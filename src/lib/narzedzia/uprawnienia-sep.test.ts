import { describe, expect, it } from 'vitest';
import { GRUPY, KONIEC_STARYCH, KONIEC_STARYCH_KC, NA_HALI, oplataSep, ostatniDzien, waznoscSep } from './uprawnienia-sep';

// Daty i kwoty sprawdzone niezależnie w Pythonie (datetime, rocznica przez replace(year+5), 29.02 → 28.02).
const DZIS = '2026-11-12';

describe('ważność po 3 lipca 2021 r. (art. 54 ust. 1aa PE, art. 112 KC)', () => {
  it('wydane 15.09.2022: rocznica 15.09.2027, bezpiecznie do 14.09.2027, 306 dni', () => {
    expect(waznoscSep({ wydano: '2022-09-15', dzis: DZIS })).toMatchObject({
      podstawa: 'nowe',
      waznoDo: '2027-09-14',
      wedlugKc: '2027-09-15',
      dniDoKonca: 306,
      status: 'wazne',
      rozbieznosc: false,
    });
  });
  it('29 lutego: rocznica 28.02.2029, bezpiecznie 27.02.2029', () => {
    expect(waznoscSep({ wydano: '2024-02-29', dzis: DZIS })).toMatchObject({ waznoDo: '2029-02-27', wedlugKc: '2029-02-28' });
  });
  it('koniec roku: wydane 31.12.2023 → do 30.12.2028', () => {
    expect(ostatniDzien('2023-12-31')).toBe('2028-12-30');
  });
  it('wydane 15.11.2021: wygasa za 2 dni (wkrótce)', () => {
    expect(waznoscSep({ wydano: '2021-11-15', dzis: DZIS })).toMatchObject({ waznoDo: '2026-11-14', dniDoKonca: 2, status: 'wkrotce' });
  });
  it('pierwszy dzień nowych zasad 3.07.2021: do 2.07.2026, wygasło 133 dni temu', () => {
    expect(waznoscSep({ wydano: '2021-07-03', dzis: DZIS })).toMatchObject({ podstawa: 'nowe', waznoDo: '2026-07-02', dniDoKonca: -133, status: 'wygaslo' });
  });
  it('dzień rocznicy (art. 110–112 KC): ostatni dzień według KC, nie „wygasło”; dzień później wygasło', () => {
    expect(waznoscSep({ wydano: '2021-11-12', dzis: DZIS })).toMatchObject({ waznoDo: '2026-11-11', wedlugKc: '2026-11-12', dniDoKonca: -1, status: 'ostatni-dzien-kc' });
    expect(waznoscSep({ wydano: '2021-11-11', dzis: DZIS })).toMatchObject({ wedlugKc: '2026-11-11', dniDoKonca: -2, status: 'wygaslo' });
    expect(waznoscSep({ wydano: '2015-06-10', dzis: '2026-07-03' }).status).toBe('ostatni-dzien-kc');
    expect(waznoscSep({ wydano: '2015-06-10', dzis: '2026-07-04' }).status).toBe('wygaslo');
  });
  it('wpis równy dziś: „ostatni dzień”', () => {
    expect(waznoscSep({ wydano: '2021-11-13', wpis: DZIS, dzis: DZIS })).toMatchObject({ dniDoKonca: 0, status: 'ostatni-dzien' });
    expect(waznoscSep({ wydano: '2021-11-13', dzis: DZIS })).toMatchObject({ waznoDo: DZIS, status: 'ostatni-dzien' });
  });
  it('próg „wkrótce”: 90 dni tak, 91 dni nie', () => {
    expect(waznoscSep({ wydano: '2022-02-11', dzis: DZIS })).toMatchObject({ waznoDo: '2027-02-10', status: 'wkrotce' });
    expect(waznoscSep({ wydano: '2022-02-12', dzis: DZIS })).toMatchObject({ waznoDo: '2027-02-11', status: 'wazne' });
  });
  it('wydane dziś: do 11.11.2031; nowe świadectwo od dziś też', () => {
    expect(waznoscSep({ wydano: DZIS, dzis: DZIS })).toMatchObject({ waznoDo: '2031-11-11', noweOdDzis: '2031-11-11' });
  });
});

describe('wpis „ważne do” (wzór, zał. 3)', () => {
  it('wpis zgodny (rocznica albo dzień przed): wynik z wpisu, bez rozbieżności', () => {
    expect(waznoscSep({ wydano: '2022-09-15', wpis: '2027-09-15', dzis: DZIS })).toMatchObject({ waznoDo: '2027-09-15', wedlugKc: null, rozbieznosc: false });
    expect(waznoscSep({ wydano: '2022-09-15', wpis: '2027-09-14', dzis: DZIS }).rozbieznosc).toBe(false);
  });
  it('wpis niezgodny: wynik z wpisu, rozbieżność', () => {
    expect(waznoscSep({ wydano: '2022-09-15', wpis: '2027-09-01', dzis: DZIS })).toMatchObject({ waznoDo: '2027-09-01', rozbieznosc: true });
  });
  it('wpis późniejszy niż 5 lat: bierzemy rocznicę (art. 54 ust. 1aa), rozbieżność', () => {
    expect(waznoscSep({ wydano: '2022-09-15', wpis: '2027-10-01', dzis: DZIS })).toMatchObject({ waznoDo: '2027-09-15', rozbieznosc: true });
    expect(waznoscSep({ wydano: '2024-03-10', wpis: '2035-01-01', dzis: DZIS })).toMatchObject({ waznoDo: '2029-03-10', rozbieznosc: true });
    expect(waznoscSep({ wydano: '2022-09-15', wpis: '2027-10-15', zDatyEgzaminu: true, dzis: DZIS }).waznoDo).toBe('2027-09-29');
  });
  it('od daty egzaminu: wpis do 14 dni po rocznicy jest zgodny', () => {
    expect(waznoscSep({ wydano: '2022-09-15', wpis: '2027-09-29', zDatyEgzaminu: true, dzis: DZIS }).rozbieznosc).toBe(false);
    expect(waznoscSep({ wydano: '2022-09-15', wpis: '2027-09-30', zDatyEgzaminu: true, dzis: DZIS }).rozbieznosc).toBe(true);
  });
});

describe('świadectwa sprzed 3 lipca 2021 r. (art. 25 ustawy z 2021 r.)', () => {
  it('stałe: koniec 2.07.2026 bezpiecznie, 3.07.2026 według art. 112 KC', () => {
    expect(KONIEC_STARYCH).toBe('2026-07-02');
    expect(KONIEC_STARYCH_KC).toBe('2026-07-03');
  });
  it('„bezterminowe” z 10.06.2015: wygasło', () => {
    expect(waznoscSep({ wydano: '2015-06-10', dzis: DZIS })).toMatchObject({ podstawa: 'stare-bez-terminu', waznoDo: '2026-07-02', wedlugKc: '2026-07-03', status: 'wygaslo', dniDoKonca: -133 });
  });
  it('dzień przed nowelą (2.07.2021), bez terminu: limit z art. 25, nie 5 lat od wydania', () => {
    expect(waznoscSep({ wydano: '2021-07-02', dzis: DZIS })).toMatchObject({ podstawa: 'stare-bez-terminu', waznoDo: '2026-07-02' });
  });
  it('z wpisem 10.05.2024: wygasło z wpisem', () => {
    expect(waznoscSep({ wydano: '2019-05-10', wpis: '2024-05-10', dzis: DZIS })).toMatchObject({ podstawa: 'stare-z-terminem', waznoDo: '2024-05-10', rozbieznosc: false, status: 'wygaslo' });
  });
  it('wpis po 2.07.2026: obcięty do limitu', () => {
    expect(waznoscSep({ wydano: '2021-06-30', wpis: '2026-06-30', dzis: '2026-06-01' })).toMatchObject({ waznoDo: '2026-06-30', rozbieznosc: false });
    expect(waznoscSep({ wydano: '2021-06-30', wpis: '2027-01-01', dzis: '2026-06-01' })).toMatchObject({ waznoDo: '2026-07-02', rozbieznosc: true });
  });
});

describe('przypomnienia .ics (propozycja redakcji)', () => {
  it('3 miesiące i miesiąc przed końcem oraz ostatni dzień', () => {
    expect(waznoscSep({ wydano: '2022-09-15', dzis: DZIS }).wydarzenia.map((w) => w.data)).toEqual(['2027-06-14', '2027-08-14', '2027-09-14']);
  });
  it('koniec miesiąca: 31.05 → 28.02 i 30.04 (art. 112 KC)', () => {
    expect(waznoscSep({ wydano: '2022-06-01', dzis: DZIS }).wydarzenia.map((w) => w.data)).toEqual(['2027-02-28', '2027-04-30', '2027-05-31']);
  });
  it('tylko przyszłe; po wygaśnięciu żadnych', () => {
    expect(waznoscSep({ wydano: '2021-11-15', dzis: DZIS }).wydarzenia.map((w) => w.data)).toEqual(['2026-11-14']);
    expect(waznoscSep({ wydano: '2015-06-10', dzis: DZIS }).wydarzenia).toEqual([]);
  });
});

describe('błędne dane', () => {
  it('RangeError', () => {
    expect(() => waznoscSep({ wydano: '2023-02-30', dzis: DZIS })).toThrow(RangeError);
    expect(() => waznoscSep({ wydano: '2027-01-01', dzis: DZIS })).toThrow(RangeError);
    expect(() => waznoscSep({ wydano: '2023-05-01', wpis: '2023-04-30', dzis: DZIS })).toThrow(RangeError);
    expect(() => oplataSep('2026-13-01')).toThrow(RangeError);
    expect(() => oplataSep('2030-01-01')).toThrow(RangeError);
  });
});

describe('opłata (§ 14 ust. 1: 10% płacy minimalnej z dnia złożenia wniosku)', () => {
  it('2025: 466,60 zł; 2026: 480,60 zł; 2027: 495,00 zł', () => {
    expect(oplataSep('2025-06-01')).toEqual({ kwota: 466.6, placa: 4666, rok: 2025 });
    expect(oplataSep('2026-12-31').kwota).toBe(480.6);
    expect(oplataSep('2027-01-01').kwota).toBe(495);
  });
});

describe('załącznik nr 1', () => {
  it('liczba punktów: G1 16, G2 24, G3 15; punkty z wyboru „na hali” istnieją', () => {
    expect(GRUPY.map((g) => g.punkty.length)).toEqual([16, 24, 15]);
    for (const g of GRUPY) for (const nr of NA_HALI[g.id]) expect(g.punkty[nr - 1]?.nr).toBe(nr);
  });
});
