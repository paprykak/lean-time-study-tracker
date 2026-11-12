import { describe, expect, it } from 'vitest';
import { netto } from './netto';

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
