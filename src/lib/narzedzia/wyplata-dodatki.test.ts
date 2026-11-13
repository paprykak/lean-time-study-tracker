import { describe, expect, it } from 'vitest';
import { wyplataZDodatkami } from './wyplata-dodatki';

// Oczekiwane kwoty z niezależnego rachunku w Pythonie (Decimal, połówki w górę), listopad 2026 r.: 160 h.
describe('wypłata z nadgodzinami i dodatkiem nocnym', () => {
  it('6000 zł, 10 nadgodzin z dodatkiem 50% i 40 godzin nocnych', () => {
    expect(wyplataZDodatkami({ rok: 2026, miesiac: 11, pensja: 6000, godziny50: 10, godziny100: 0, godzinyNocne: 40 })).toMatchObject({
      stawka: 37.5,
      wymiar: 160,
      zaNadgodziny: 562.5,
      nocnyZaGodzine: 6.01,
      dodatekNocny: 240.4,
      brutto: 6802.9,
      netto: 4967.91,
      nettoSamaPensja: 4420.43,
      dodatkiNaReke: 547.48,
    });
  });
  it('8 nadgodzin z dodatkiem 100%: 600 zł brutto więcej', () => {
    expect(wyplataZDodatkami({ rok: 2026, miesiac: 11, pensja: 6000, godziny50: 0, godziny100: 8, godzinyNocne: 0 })).toMatchObject({ brutto: 6600, netto: 4829.58 });
  });
  it('z PPK 2% i 1,5%', () => {
    expect(wyplataZDodatkami({ rok: 2026, miesiac: 11, pensja: 6000, godziny50: 10, godziny100: 0, godzinyNocne: 40, ppk: true })).toMatchObject({ netto: 4818.85, nettoSamaPensja: 4289.43 });
  });
  it('20 000 zł i 10 nadgodzin 50% w listopadzie 2026 r.: 21 875 zł brutto, próg 120 000 zł w lipcu (B-fix/netto.py)', () => {
    expect(wyplataZDodatkami({ rok: 2026, miesiac: 11, pensja: 20000, godziny50: 10, godziny100: 0, godzinyNocne: 0 })).toMatchObject({ brutto: 21875, progPrzekroczony: true, miesiacProgu: 7 });
    expect(wyplataZDodatkami({ rok: 2026, miesiac: 11, pensja: 6000, godziny50: 10, godziny100: 0, godzinyNocne: 40 }).miesiacProgu).toBeNull();
  });
});
