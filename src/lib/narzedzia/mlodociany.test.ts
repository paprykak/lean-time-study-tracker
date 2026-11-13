import { describe, expect, it } from 'vitest';
import { mlodociany, placaMlodocianego, urlopMlodocianego, wiek, type DaneMlodocianego } from './mlodociany';

const D: DaneMlodocianego = {
  urodzenie: '2010-03-15',
  poczatekPracy: '2025-09-01',
  naDzien: '2025-11-12',
  cel: 'nauka-zawodu',
  rokNauki: 1,
  bezSzkolyPodstawowej: false,
};

describe('wiek (art. 112 KC)', () => {
  it('lata kończą się z początkiem dnia urodzin', () => {
    expect(wiek('2010-03-15', '2026-03-14')).toBe(15);
    expect(wiek('2010-03-15', '2026-03-15')).toBe(16);
  });
  it('urodzeni 29 lutego: 28 lutego w roku nieprzestępnym', () => {
    expect(wiek('2008-02-29', '2026-02-27')).toBe(17);
    expect(wiek('2008-02-29', '2026-02-28')).toBe(18);
  });
});

describe('czas pracy młodocianego (art. 200^2, 202, 203 Kp)', () => {
  it('do 16. urodzin 6 godzin, od 16. urodzin 8', () => {
    expect(mlodociany(D)).toMatchObject({ status: 'mlodociany', lata: 15, limitDoby: 6, szesnascie: '2026-03-15', osiemnascie: '2028-03-15', poraNocna: '22:00–6:00' });
    expect(mlodociany({ ...D, naDzien: '2026-03-14' }).limitDoby).toBe(6);
    expect(mlodociany({ ...D, naDzien: '2026-03-15' }).limitDoby).toBe(8);
  });
  it('lekkie prace: 12 godzin w tygodniu w roku szkolnym, w ferie 6 albo 7 godzin i 35 w tygodniu', () => {
    expect(mlodociany({ ...D, cel: 'lekkie-prace' }).lekkie).toEqual({ tydzienSzkola: 12, dzienZajec: 2, dobaFerie: 6, tydzienFerie: 35 });
    expect(mlodociany({ ...D, cel: 'lekkie-prace', naDzien: '2026-07-01' }).lekkie?.dobaFerie).toBe(7);
    expect(mlodociany(D).lekkie).toBeNull();
  });
  it('pora nocna 20–6 przed 15. urodzinami i bez szkoły podstawowej', () => {
    expect(mlodociany({ ...D, naDzien: '2025-03-01' })).toMatchObject({ status: 'ponizej-15', limitDoby: 6, poraNocna: '20:00–6:00', rokPietnastu: 2025 });
    expect(mlodociany({ ...D, bezSzkolyPodstawowej: true }).poraNocna).toBe('20:00–6:00');
  });
  it('od 18. urodzin zasady ogólne', () => {
    expect(mlodociany({ ...D, naDzien: '2028-03-15' })).toMatchObject({ status: 'pelnoletni', limitDoby: null, poraNocna: null, placa: null, lekkie: null });
    expect(mlodociany({ ...D, naDzien: '2028-03-14' }).status).toBe('mlodociany');
  });
  it('daty przed urodzeniem to błąd', () => {
    expect(() => mlodociany({ ...D, poczatekPracy: '2009-01-01' })).toThrow(RangeError);
  });
});

describe('płaca w przygotowaniu zawodowym (§ 19–20 rozporządzenia)', () => {
  it('nauka zawodu, 1. rok, listopad 2026: 8% z 9233,13 zł (II kwartał 2026), w górę do grosza', () => {
    expect(placaMlodocianego('nauka-zawodu', 1, '2026-11-12')).toMatchObject({ procent: 8, kwota: 738.66, podstawa: { publikator: 'M.P. 2026 poz. 779', mozeNieaktualna: false } });
    expect(placaMlodocianego('nauka-zawodu', 2, '2026-11-12')?.kwota).toBe(830.99);
    expect(placaMlodocianego('nauka-zawodu', 3, '2026-11-12')?.kwota).toBe(923.32);
  });
  it('kwota obowiązuje od 1. dnia miesiąca po ogłoszeniu', () => {
    expect(placaMlodocianego('nauka-zawodu', 3, '2026-03-01')).toMatchObject({ kwota: 919.78, podstawa: { kwartal: 'IV kwartał 2025 r.' } });
    expect(placaMlodocianego('nauka-zawodu', 3, '2026-02-28')).toMatchObject({ kwota: 877.17, podstawa: { kwartal: 'III kwartał 2025 r.' } });
    expect(placaMlodocianego('przyuczenie', 1, '2026-06-15')).toMatchObject({ procent: 7, kwota: 669.41 });
  });
  it('III kwartał 2026 r. (M.P. 2026 poz. 1122, ogłoszony 10 listopada): 9317,01 zł od 1 grudnia 2026 r.', () => {
    // Niezależnie: 9317,01 × 8/9/10/7% w górę do grosza = 745,37 / 838,54 / 931,71 / 652,20 zł.
    expect(placaMlodocianego('nauka-zawodu', 1, '2026-11-30')).toMatchObject({ kwota: 738.66, podstawa: { kwartal: 'II kwartał 2026 r.' } });
    expect(placaMlodocianego('nauka-zawodu', 1, '2026-12-01')).toMatchObject({ kwota: 745.37, podstawa: { publikator: 'M.P. 2026 poz. 1122', mozeNieaktualna: false } });
    expect(placaMlodocianego('nauka-zawodu', 2, '2026-12-01')?.kwota).toBe(838.54);
    expect(placaMlodocianego('nauka-zawodu', 3, '2027-01-04')?.kwota).toBe(931.71);
    expect(placaMlodocianego('przyuczenie', 1, '2026-12-01')?.kwota).toBe(652.2);
  });
  it('po 3 miesiącach od ostatniej kwoty ostrzegamy, że GUS mógł ogłosić nową', () => {
    expect(placaMlodocianego('nauka-zawodu', 1, '2027-02-28')?.podstawa.mozeNieaktualna).toBe(false);
    expect(placaMlodocianego('nauka-zawodu', 1, '2027-03-01')?.podstawa.mozeNieaktualna).toBe(true);
  });
  it('lekkie prace i daty bez kwoty: brak', () => {
    expect(placaMlodocianego('lekkie-prace', 1, '2026-11-12')).toBeNull();
    expect(placaMlodocianego('nauka-zawodu', 1, '2025-11-30')).toBeNull();
  });
});

describe('urlop młodocianego (art. 205 Kp)', () => {
  it('12 dni po 6 miesiącach, 26 po roku, potem 26 co roku i 20 w roku 18. urodzin', () => {
    expect(urlopMlodocianego('2010-03-15', '2025-09-01')).toEqual({
      lista: [
        { data: '2026-03-01', dni: 12, podstawa: 'art. 205 § 1', opis: 'po 6 miesiącach pierwszej pracy' },
        { data: '2026-09-01', dni: 26, podstawa: 'art. 205 § 2 zd. 1', opis: 'po roku pracy' },
        { data: '2027-01-01', dni: 26, podstawa: 'art. 205 § 2 i 5, art. 153 § 2', opis: 'kolejny rok' },
        { data: '2028-01-01', dni: 20, podstawa: 'art. 205 § 2 zd. 2', opis: 'rok 18. urodzin' },
      ],
      zasadyOgolneOd: '2029-01-01',
      przedOsiemnastka: true,
    });
  });
  it('rok pracy mija w roku 18. urodzin: 12 i 20 dni', () => {
    expect(urlopMlodocianego('1993-05-20', '2010-09-01').lista.map((u) => [u.data, u.dni])).toEqual([
      ['2011-03-01', 12],
      ['2011-09-01', 20],
    ]);
  });
  it('rok pracy przed rokiem 18. urodzin: 20 dni 1 stycznia', () => {
    expect(urlopMlodocianego('2008-06-10', '2024-09-01').lista.map((u) => [u.data, u.dni])).toEqual([
      ['2025-03-01', 12],
      ['2025-09-01', 26],
      ['2026-01-01', 20],
    ]);
  });
  it('rok pracy po roku 18. urodzin: tylko 12 dni, potem zasady ogólne', () => {
    expect(urlopMlodocianego('2008-11-15', '2026-05-01')).toMatchObject({ lista: [{ data: '2026-11-01', dni: 12 }], zasadyOgolneOd: '2027-01-01' });
  });
  it('6 miesięcy mija w dniu 18. urodzin albo później: zasady ogólne', () => {
    expect(urlopMlodocianego('2008-01-10', '2025-09-01')).toMatchObject({ lista: [], przedOsiemnastka: false });
    expect(urlopMlodocianego('2008-03-01', '2025-09-01')).toMatchObject({ lista: [], przedOsiemnastka: false });
  });
});
