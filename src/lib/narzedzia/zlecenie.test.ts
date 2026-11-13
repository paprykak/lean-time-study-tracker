import { describe, expect, it } from 'vitest';
import { nettoZlecenie } from './zlecenie';

describe('netto z umowy zlecenia', () => {
  it('3000 zł, jedyne źródło, z chorobowym, bez PIT-2: 2106,72 zł', () => {
    expect(nettoZlecenie({ brutto: 3000, chorobowe: true })).toEqual({
      brutto: 3000,
      emerytalna: 292.8,
      rentowa: 45,
      chorobowa: 73.5,
      spoleczne: 411.3,
      zdrowotna: 232.98,
      koszty: 517.74,
      podstawa: 2071,
      zaliczka: 249,
      netto: 2106.72,
      malaUmowa: false,
    });
  });
  it('to samo z PIT-2: zaliczka 0, netto 2355,72 zł', () => {
    expect(nettoZlecenie({ brutto: 3000, chorobowe: true, pit2: true })).toMatchObject({ zaliczka: 0, netto: 2355.72 });
  });
  it('bez chorobowego: wyższe netto', () => {
    expect(nettoZlecenie({ brutto: 3000 })).toMatchObject({ chorobowa: 0, spoleczne: 337.8 });
  });
  it('etat u innego pracodawcy: tylko zdrowotna i podatek', () => {
    // zdrowotna 9% z 3000 = 270; koszty 600; podstawa 2400; zaliczka 288
    expect(nettoZlecenie({ brutto: 3000, status: 'etat' })).toMatchObject({ spoleczne: 0, zdrowotna: 270, koszty: 600, zaliczka: 288, netto: 2442 });
  });
  it('student do 26 lat: netto = brutto', () => {
    expect(nettoZlecenie({ brutto: 3000, status: 'student' })).toMatchObject({ spoleczne: 0, zdrowotna: 0, zaliczka: 0, netto: 3000 });
  });
  it('do 26 lat bez nauki: składki tak, podatku nie', () => {
    expect(nettoZlecenie({ brutto: 3000, chorobowe: true, ulgaMlodych: true })).toMatchObject({ zaliczka: 0, netto: 2355.72 });
  });
  // Umowa do 200 zł: podatek zryczałtowany 12% przychodu, bez kosztów i PIT-2 (art. 30 ust. 1 pkt 5a i ust. 3 ustawy o PIT).
  // Wartości z niezależnego rachunku w Pythonie (scratchpad audytu, B-fix/zlecenie.py).
  it('umowa do 200 zł: 150 zł → podatek 18 zł, netto 103,13 zł, PIT-2 bez znaczenia', () => {
    const r = nettoZlecenie({ brutto: 150 });
    expect(r).toMatchObject({ malaUmowa: true, spoleczne: 16.89, zdrowotna: 11.98, koszty: 0, zaliczka: 18, netto: 103.13 });
    expect(nettoZlecenie({ brutto: 150, pit2: true })).toEqual(r);
  });
  it('dokładnie 200 zł: ryczałt 24 zł, netto 137,51 zł; 200,01 zł: zwykła zaliczka 17 zł, netto 144,52 zł', () => {
    expect(nettoZlecenie({ brutto: 200 })).toMatchObject({ malaUmowa: true, spoleczne: 22.52, zdrowotna: 15.97, zaliczka: 24, netto: 137.51 });
    expect(nettoZlecenie({ brutto: 200.01 })).toMatchObject({ malaUmowa: false, koszty: 35.5, zaliczka: 17, netto: 144.52 });
  });
  it('umowa do 200 zł studenta albo z ulgą dla młodych: bez podatku', () => {
    expect(nettoZlecenie({ brutto: 150, ulgaMlodych: true })).toMatchObject({ malaUmowa: false, zaliczka: 0 });
  });
});
