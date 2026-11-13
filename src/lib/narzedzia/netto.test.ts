import { describe, expect, it } from 'vitest';
import { miesiacPrzekroczenia, netto } from './netto';

describe('netto z umowy o pracę (ZUS, zdrowotna, zaliczka na PIT)', () => {
  it('płaca minimalna 2026: 4806 zł → 3605,85 zł (koszty 250 zł, PIT-2)', () => {
    expect(netto({ brutto: 4806 })).toMatchObject({
      emerytalna: 469.07,
      rentowa: 72.09,
      chorobowa: 117.75,
      spoleczne: 658.91,
      zdrowotna: 373.24,
      podstawa: 3897,
      zaliczka: 168,
      netto: 3605.85,
      mozliweObnizenieZdrowotnej: false,
      progPrzekroczony: false,
    });
  });
  it('koszty podwyższone 300 zł: 3611,85 zł', () => {
    expect(netto({ brutto: 4806, kosztyPodwyzszone: true }).netto).toBe(3611.85);
  });
  it('bez PIT-2: zaliczka większa o 300 zł', () => {
    expect(netto({ brutto: 4806, pit2: false })).toMatchObject({ zaliczka: 468, netto: 3305.85 });
  });
  it('do 26 lat: bez zaliczki, zdrowotna bez zmian', () => {
    expect(netto({ brutto: 4806, ulgaMlodych: true })).toMatchObject({ zaliczka: 0, zdrowotna: 373.24, netto: 3773.85 });
  });
  it('6000 zł brutto', () => {
    const r = netto({ brutto: 6000 });
    // składki 585,60 + 90,00 + 147,00 = 822,60; zdrowotna 9% z 5177,40 = 465,97; podstawa 4927; zaliczka 591,24 − 300 → 291
    expect(r).toMatchObject({ spoleczne: 822.6, zdrowotna: 465.97, podstawa: 4927, zaliczka: 291, netto: 4420.43 });
  });
  it('bardzo niska kwota: możliwe obniżenie zdrowotnej (art. 83), wysoka: próg 120 000 zł', () => {
    expect(netto({ brutto: 1000 }).mozliweObnizenieZdrowotnej).toBe(true);
    expect(netto({ brutto: 1500 }).mozliweObnizenieZdrowotnej).toBe(false);
    expect(netto({ brutto: 12000 }).progPrzekroczony).toBe(true);
  });
});

describe('netto z PPK', () => {
  it('6000 zł, PPK 2% i 1,5%: wpłata pracodawcy w podstawie zaliczki, wpłata pracownika z wypłaty', () => {
    // Bez PPK: podstawa 4927, zaliczka 291, netto 4420,43. Z PPK: podstawa 6000 + 90 − 250 − 822,60 = 5017, zaliczka 302.
    expect(netto({ brutto: 6000 }).netto).toBe(4420.43);
    expect(netto({ brutto: 6000, ppk: { pracownik: 2, pracodawca: 1.5 } })).toMatchObject({ podstawa: 5017, zaliczka: 302, ppkPracownik: 120, ppkPracodawca: 90, netto: 4289.43 });
  });
});

// Wartości z niezależnego rachunku w Pythonie (scratchpad audytu, B-fix/netto.py): suma od stycznia ponad próg.
describe('próg 120 000 zł i limit ulgi dla młodych 85 528 zł', () => {
  it('płaca minimalna 2027: 4950 zł → 3703,93 zł', () => {
    expect(netto({ brutto: 4950 })).toMatchObject({ spoleczne: 678.65, zdrowotna: 384.42, podstawa: 4021, zaliczka: 183, netto: 3703.93 });
  });
  it('25 000 zł: podstawa 21 323 zł, próg pęka w czerwcu', () => {
    expect(netto({ brutto: 25000 })).toMatchObject({ podstawa: 21323, progPrzekroczony: true, miesiacProgu: 6 });
  });
  it('podstawa 10 000 zł (12 × = dokładnie 120 000 zł): bez przekroczenia; 10 001 zł: w grudniu', () => {
    expect(netto({ brutto: 11878 })).toMatchObject({ podstawa: 10000, progPrzekroczony: false, miesiacProgu: null });
    expect(netto({ brutto: 11880 })).toMatchObject({ podstawa: 10001, progPrzekroczony: true, miesiacProgu: 12 });
  });
  it('ulga do 26 lat: 7127 zł (85 524 zł w roku) w limicie, 7128 zł ponad, 10 000 zł od września', () => {
    expect(netto({ brutto: 7127, ulgaMlodych: true })).toMatchObject({ limitUlgiPrzekroczony: false, miesiacLimituUlgi: null, progPrzekroczony: false });
    expect(netto({ brutto: 7128, ulgaMlodych: true })).toMatchObject({ limitUlgiPrzekroczony: true, miesiacLimituUlgi: 12 });
    expect(netto({ brutto: 10000, ulgaMlodych: true })).toMatchObject({ limitUlgiPrzekroczony: true, miesiacLimituUlgi: 9, zaliczka: 0 });
    expect(netto({ brutto: 10000 })).toMatchObject({ limitUlgiPrzekroczony: false, miesiacLimituUlgi: null });
  });
  it('wpłata PPK pracodawcy wlicza się do limitu ulgi: 7100 zł + 1,5% = 7206,50 zł', () => {
    expect(netto({ brutto: 7100, ulgaMlodych: true }).limitUlgiPrzekroczony).toBe(false);
    expect(netto({ brutto: 7100, ulgaMlodych: true, ppk: { pracownik: 2, pracodawca: 1.5 } })).toMatchObject({ limitUlgiPrzekroczony: true, miesiacLimituUlgi: 12 });
  });
  it('miesiacPrzekroczenia: równo w limicie nie przekracza', () => {
    expect(miesiacPrzekroczenia(120000, 10000)).toBeNull();
    expect(miesiacPrzekroczenia(120000, 20000)).toBe(7);
    expect(miesiacPrzekroczenia(120000, 0)).toBeNull();
  });
});
