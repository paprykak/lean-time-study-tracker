// Oczekiwane wartości policzone niezależnie skryptem w Pythonie (dateutil.relativedelta i calendar, bez kodu serwisu).
import { describe, expect, it } from 'vitest';
import { przedluzenieDoPorodu, uplywTrzeciegoMiesiaca, wypowiedzenieWCiazy, wypowiedzenieZastepstwa } from './umowa-zastepstwo';

describe('wypowiedzenie umowy na zastępstwo (art. 36 § 1, art. 30 § 2^1)', () => {
  it.each([
    // początek pracy, doręczenie, staż, okres, koniec okresu
    ['2026-03-15', '2026-09-14', 5, '2 tygodnie', '2026-10-03'],
    ['2026-03-15', '2026-09-15', 6, '1 miesiąc', '2026-10-31'],
    ['2023-12-01', '2026-11-30', 35, '1 miesiąc', '2026-12-31'],
    ['2023-12-01', '2026-12-01', 36, '3 miesiące', '2027-03-31'],
    // koniec roku: dwa tygodnie przechodzą na styczeń; sobota i niedziela jako dzień doręczenia
    ['2026-10-05', '2026-12-28', 2, '2 tygodnie', '2027-01-16'],
    ['2026-10-05', '2026-12-27', 2, '2 tygodnie', '2027-01-16'],
    ['2026-10-05', '2026-12-26', 2, '2 tygodnie', '2027-01-09'],
    ['2025-08-31', '2026-03-01', 6, '1 miesiąc', '2026-04-30'],
  ])('praca od %s, doręczenie %s: staż %i mies., %s, koniec %s', (start, dor, staz, opis, koniec) => {
    const r = wypowiedzenieZastepstwa(start, dor);
    expect(r.stazMiesiecy).toBe(staz);
    expect(r.okres.opis).toBe(opis);
    expect(r.koniecOkresu).toBe(koniec);
    expect(r.ostatniDzien).toBe(koniec);
    expect(r.powod).toBe('wypowiedzenie');
  });

  it('umowa z datą końca przed końcem okresu kończy się z upływem czasu (art. 30 § 1 pkt 4)', () => {
    const r = wypowiedzenieZastepstwa('2024-02-29', '2026-11-30', '2026-12-15');
    expect(r.stazMiesiecy).toBe(33);
    expect(r.koniecOkresu).toBe('2026-12-31');
    expect(r.ostatniDzien).toBe('2026-12-15');
    expect(r.powod).toBe('termin');
  });

  it('data końca po okresie wypowiedzenia: decyduje wypowiedzenie; pusta data jak brak daty', () => {
    expect(wypowiedzenieZastepstwa('2024-02-29', '2026-11-30', '2027-01-15')).toMatchObject({ ostatniDzien: '2026-12-31', powod: 'wypowiedzenie' });
    expect(wypowiedzenieZastepstwa('2024-02-29', '2026-11-30', '')).toMatchObject({ ostatniDzien: '2026-12-31', powod: 'wypowiedzenie' });
    expect(wypowiedzenieZastepstwa('2024-02-29', '2026-11-30', '2026-12-31')).toMatchObject({ ostatniDzien: '2026-12-31', powod: 'wypowiedzenie' });
  });

  it('błędne dane', () => {
    expect(() => wypowiedzenieZastepstwa('', '2026-11-30')).toThrow('rozpoczęcia');
    expect(() => wypowiedzenieZastepstwa('2026-01-01', '2026-02-30')).toThrow('doręczenia');
    expect(() => wypowiedzenieZastepstwa('2026-12-01', '2026-11-30')).toThrow('przed rozpoczęciem');
    expect(() => wypowiedzenieZastepstwa('2026-01-01', '2026-11-30', '2026-11-29')).toThrow('przed doręczeniem');
    expect(() => wypowiedzenieZastepstwa('2026-01-01', '2026-11-30', '2026-13-01')).toThrow('końca umowy');
  });
});

describe('przedłużenie umowy do dnia porodu (art. 177 § 3 i § 3^1)', () => {
  it.each([
    // rodzaj, koniec umowy, początek ciąży, upływ 3. miesiąca, status
    ['okreslony', '2027-04-11', '2027-01-10', '2027-04-10', 'przedluza'],
    ['okreslony', '2027-04-10', '2027-01-10', '2027-04-10', 'granica'],
    ['okreslony', '2027-04-09', '2027-01-10', '2027-04-10', 'przed-uplywem'],
    ['zastepstwo', '2027-12-31', '2027-01-10', '2027-04-10', 'zastepstwo'],
    ['probna-ponad-miesiac', '2027-05-31', '2027-01-10', '2027-04-10', 'przedluza'],
    ['probna-do-miesiaca', '2027-05-31', '2027-01-10', '2027-04-10', 'probna-krotka'],
    // 29 lutego w roku przestępnym i ostatni dzień miesiąca (art. 112 KC)
    ['okreslony', '2028-03-01', '2027-11-29', '2028-02-29', 'przedluza'],
    ['okreslony', '2028-02-29', '2027-11-30', '2028-02-29', 'granica'],
    ['okreslony', '2027-02-28', '2026-11-30', '2027-02-28', 'granica'],
    ['okreslony', '2027-03-01', '2026-11-30', '2027-02-28', 'przedluza'],
    // przez koniec roku
    ['okreslony', '2027-01-04', '2026-10-31', '2027-01-31', 'przed-uplywem'],
    // ciąża po końcu umowy
    ['okreslony', '2026-12-31', '2027-01-02', '2027-04-02', 'po-umowie'],
  ] as const)('%s do %s, ciąża od %s: upływ %s, %s', (rodzaj, koniec, ciaza, uplyw, status) => {
    expect(przedluzenieDoPorodu(rodzaj, koniec, ciaza)).toEqual({ status, uplyw3Miesiaca: uplyw });
  });

  it('upływ 3. miesiąca liczony kalendarzowo', () => {
    expect(uplywTrzeciegoMiesiaca('2026-11-30')).toBe('2027-02-28');
    expect(uplywTrzeciegoMiesiaca('2026-12-15')).toBe('2027-03-15');
  });

  it('błędne dane', () => {
    expect(() => przedluzenieDoPorodu('okreslony', '', '2027-01-10')).toThrow('końca umowy');
    expect(() => przedluzenieDoPorodu('okreslony', '2027-04-10', '2027-02-29')).toThrow('początku ciąży');
  });
});

describe('wypowiedzenie w ciąży (art. 177 § 1)', () => {
  it('doręczenie w dniu początku ciąży i później: zakaz; przed: nie; brak daty: nie', () => {
    expect(wypowiedzenieWCiazy('2027-01-10', '2027-01-10')).toBe(true);
    expect(wypowiedzenieWCiazy('2027-03-01', '2027-01-10')).toBe(true);
    expect(wypowiedzenieWCiazy('2027-01-09', '2027-01-10')).toBe(false);
    expect(wypowiedzenieWCiazy('2027-01-09', '')).toBe(false);
  });
});
