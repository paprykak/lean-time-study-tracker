import { describe, expect, it } from 'vitest';
import { dniTrzechMiesiecyPrzed, dodatekWyrownawczy, koniecMiesiecy, okresDodatku } from './dodatek-wyrownawczy';

// Wartości sprawdzone niezależnie w Pythonie (Decimal, datetime; współczynnik 2026 r. = 251/12).
const BAZA = { powod: 'wypadek' as const, od: '2026-10-01', rok: 2026, miesiac: 11, stalePrzed: 6000, stalePo: 5200, zmiennePrzed: 2700, zmiennePo: 300 };

describe('okres dodatku wyrównawczego', () => {
  it('6 miesięcy: do dnia przed dniem odpowiadającym datą, bez takiego dnia do końca miesiąca', () => {
    expect(koniecMiesiecy('2026-10-01', 6)).toBe('2027-03-31');
    expect(koniecMiesiecy('2026-11-15', 6)).toBe('2027-05-14');
    expect(koniecMiesiecy('2026-08-31', 6)).toBe('2027-02-28');
    expect(koniecMiesiecy('2026-08-30', 6)).toBe('2027-02-28');
    expect(koniecMiesiecy('2026-09-01', 6)).toBe('2027-02-28');
    expect(koniecMiesiecy('2027-08-30', 6)).toBe('2028-02-29');
  });
  it('ciąża bez końca, ochrona do podanego dnia, art. 230 i 231 po 6 miesięcy', () => {
    expect(okresDodatku('ciaza', '2026-10-01').koniec).toBeNull();
    expect(okresDodatku('grupowe', '2026-10-01', '2027-06-30').koniec).toBe('2027-06-30');
    expect(okresDodatku('choroba-zawodowa', '2026-10-01').koniec).toBe('2027-03-31');
    expect(okresDodatku('indywidualne', '2026-10-01').koniec).toBe('2027-03-31');
    expect(okresDodatku('choroba-stwierdzona', '2026-10-01').koniec).toBe('2027-03-31');
    expect(() => okresDodatku('grupowe', '2026-10-01', '2026-09-30')).toThrow(RangeError);
  });
  it('dni 3 miesięcy przed miesiącem przeniesienia (także przez koniec roku)', () => {
    expect(dniTrzechMiesiecyPrzed('2026-10-01')).toBe(92);
    expect(dniTrzechMiesiecyPrzed('2027-02-10')).toBe(92);
    expect(dniTrzechMiesiecyPrzed('2026-05-20')).toBe(89);
  });
});

describe('kwota dodatku (§ 7–9 rozporządzenia z 1996 r.)', () => {
  it('listopad 2026 r. bez nieobecności: 800 + (2700/92 × 30 − 300) = 1380,43 zł', () => {
    expect(dodatekWyrownawczy(BAZA)).toMatchObject({ dniPrzed: 92, dniPo: 30, stala: 800, zaDzien: 29.35, zmienna: 580.43, dodatek: 1380.43, przysluguje: true });
  });
  it('5 dni L4 i 1 dzień urlopu bezpłatnego: 1032,77 zł (§ 8: dzielnik 30 i współczynnik)', () => {
    expect(dodatekWyrownawczy({ ...BAZA, dniL4: 5, dniBezPlacy: 1 })).toMatchObject({ zmniejszenie: 171.58, stala: 628.42, dniPo: 24, zmienna: 404.35, dodatek: 1032.77 });
  });
  it('pół etatu po przeniesieniu: współczynnik o połowę mniejszy', () => {
    expect(dodatekWyrownawczy({ ...BAZA, etat: 0.5, dniBezPlacy: 1 })).toMatchObject({ zmniejszenie: 76.49, dodatek: 1274.6 });
  });
  it('po przeniesieniu więcej: dodatek nie przysługuje', () => {
    expect(dodatekWyrownawczy({ ...BAZA, powod: 'ciaza', stalePrzed: 5000, stalePo: 5600, zmiennePrzed: 0, zmiennePo: 0 })).toMatchObject({ dodatek: 0, przysluguje: false, stala: -600 });
  });
  it('miesiąc częściowo w okresie: od 16 listopada 15 z 30 dni', () => {
    expect(dodatekWyrownawczy({ ...BAZA, powod: 'ciaza', od: '2026-11-16', zmiennePrzed: 0, zmiennePo: 0 })).toMatchObject({ dniWOkresie: 15, stala: 400, dodatek: 400 });
  });
  it('ostatni miesiąc okresu w całości i miesiąc po okresie', () => {
    expect(dodatekWyrownawczy({ ...BAZA, rok: 2027, miesiac: 3, zmiennePrzed: 0, zmiennePo: 0 })).toMatchObject({ dniWOkresie: 31, dodatek: 800 });
    expect(dodatekWyrownawczy({ ...BAZA, rok: 2027, miesiac: 4 })).toMatchObject({ wOkresie: false, dodatek: 0 });
    expect(dodatekWyrownawczy({ ...BAZA, rok: 2026, miesiac: 9 })).toMatchObject({ wOkresie: false });
  });
  it('dni z 3 miesięcy wpisane ręcznie: 900 zł w 90 dniach, od 15 listopada, kwiecień 2027 r.', () => {
    expect(dodatekWyrownawczy({ ...BAZA, od: '2026-11-15', rok: 2027, miesiac: 4, zmiennePrzed: 900, dniPrzed: 90, zmiennePo: 0 })).toMatchObject({ zaDzien: 10, zmienna: 300, dodatek: 1100 });
  });
  it('błędne dane', () => {
    expect(() => dodatekWyrownawczy({ ...BAZA, dniL4: 31 })).toThrow(RangeError);
    expect(() => dodatekWyrownawczy({ ...BAZA, dniL4: 1.5 })).toThrow(RangeError);
    expect(() => dodatekWyrownawczy({ ...BAZA, stalePrzed: -1 })).toThrow(RangeError);
    expect(() => dodatekWyrownawczy({ ...BAZA, dniPrzed: 0 })).toThrow(RangeError);
    expect(() => dodatekWyrownawczy({ ...BAZA, etat: 0 })).toThrow(RangeError);
    expect(() => dodatekWyrownawczy({ ...BAZA, miesiac: 13 })).toThrow(RangeError);
  });
});
