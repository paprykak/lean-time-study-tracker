import { describe, expect, it } from 'vitest';
import { wymiarMiesiaca } from './czas-pracy';
import { niepelnyMiesiac, wymiarCzesci } from './niepelny-miesiac';

// Wartości sprawdzone niezależnie w Pythonie (datetime, Decimal, własny kalendarz świąt).
const LISTOPAD = { rok: 2026, miesiac: 11, stawka: 6000 };

describe('wymiar części miesiąca (art. 130 Kp)', () => {
  it('cały miesiąc równa się wymiarowi miesiąca', () => {
    for (let m = 1; m <= 12; m++) expect(wymiarCzesci(2026, m, 1, new Date(Date.UTC(2026, m, 0)).getUTCDate())).toBe(wymiarMiesiaca(2026, m).godziny);
  });
  it('od 16 listopada 2026 r.: 88 h; do 15 grudnia 2026 r.: 88 h (Wigilia i święta poza okresem)', () => {
    expect(wymiarCzesci(2026, 11, 16, 30)).toBe(88);
    expect(wymiarCzesci(2026, 12, 1, 15)).toBe(88);
  });
});

describe('wynagrodzenie za niepełny miesiąc (§ 11–12 rozporządzenia z 1996 r.)', () => {
  it('pełny miesiąc bez nieobecności: cała stawka', () => {
    expect(niepelnyMiesiac(LISTOPAD)).toMatchObject({ wymiar: 160, wynagrodzenie: 6000, wyrownanie: 0 });
  });
  it('10 dni L4: 6000 − 6000/30 × 10 = 4000 zł (§ 11)', () => {
    expect(niepelnyMiesiac({ ...LISTOPAD, dniL4: 10 })).toMatchObject({ potracenieL4: 2000, wynagrodzenie: 4000, zaDzienL4: 200, minimum: null });
  });
  it('16 h urlopu bezpłatnego: 6000 − 37,50 × 16 = 5400 zł (§ 12 ust. 1)', () => {
    expect(niepelnyMiesiac({ ...LISTOPAD, godzinyNieobecnosci: 16 })).toMatchObject({ zaGodzine: 37.5, potracenieNieobecnosci: 600, wynagrodzenie: 5400 });
  });
  it('umowa od 16 listopada: 88 z 160 h, 3300 zł (§ 12 ust. 2)', () => {
    expect(niepelnyMiesiac({ ...LISTOPAD, od: 16 })).toMatchObject({ godzinyUmowy: 88, godzinyPoza: 72, potraceniePozaUmowa: 2700, wynagrodzenie: 3300 });
  });
  it('umowa 4–29 maja 2026 r.: te same godziny co cały miesiąc, pełna stawka', () => {
    expect(niepelnyMiesiac({ rok: 2026, miesiac: 5, stawka: 7000, od: 4, do: 29 })).toMatchObject({ godzinyPoza: 0, wynagrodzenie: 7000 });
  });
  it('luty: 28 dni L4 to cały miesiąc (0 zł), 26 dni L4 daje 4/30 stawki', () => {
    expect(niepelnyMiesiac({ rok: 2026, miesiac: 2, stawka: 6000, dniL4: 28 })).toMatchObject({ calyMiesiacL4: true, wynagrodzenie: 0 });
    expect(niepelnyMiesiac({ rok: 2026, miesiac: 2, stawka: 6000, dniL4: 26 })).toMatchObject({ calyMiesiacL4: false, wynagrodzenie: 800 });
  });
  it('luty 2027 r.: 28 dni L4 to cały miesiąc; 29 lutego 2028 r. liczy się w wymiarze części', () => {
    expect(niepelnyMiesiac({ rok: 2027, miesiac: 2, stawka: 6000, dniL4: 28 }).calyMiesiacL4).toBe(true);
    expect(wymiarCzesci(2028, 2, 1, 29)).toBe(168);
    expect(wymiarCzesci(2028, 2, 15, 29)).toBe(88);
  });
  it('styczeń: 30 dni L4 i 1 dzień pracy daje 0 zł; z 8 h nieobecności wynik ujemny zamieniony na 0', () => {
    expect(niepelnyMiesiac({ rok: 2026, miesiac: 1, stawka: 6000, dniL4: 30 })).toMatchObject({ wynagrodzenie: 0, ujemne: false, calyMiesiacL4: false });
    expect(niepelnyMiesiac({ rok: 2026, miesiac: 1, stawka: 6000, dniL4: 30, godzinyNieobecnosci: 8 })).toMatchObject({ wynagrodzenie: 0, ujemne: true });
  });
  it('pół etatu: 80 h w listopadzie, 8 h nieobecności to 600 zł', () => {
    expect(niepelnyMiesiac({ ...LISTOPAD, etat: 0.5, godzinyNieobecnosci: 8 })).toMatchObject({ godzinyMiesiaca: 80, wynagrodzenie: 5400 });
  });
  it('płaca minimalna: 4500 zł od 16 listopada daje 2475 zł, minimum 2643,30 zł, wyrównanie 168,30 zł', () => {
    expect(niepelnyMiesiac({ ...LISTOPAD, stawka: 4500, od: 16 })).toMatchObject({ wynagrodzenie: 2475, minimum: 2643.3, wyrownanie: 168.3 });
  });
  it('godziny z grafiku zamiast wymiaru', () => {
    expect(niepelnyMiesiac({ ...LISTOPAD, godzinyMiesiaca: 168, godzinyNieobecnosci: 12 })).toMatchObject({ zaGodzine: 35.71, potracenieNieobecnosci: 428.57, wynagrodzenie: 5571.43 });
  });
  it('błędne dane', () => {
    expect(() => niepelnyMiesiac({ ...LISTOPAD, dniL4: 31 })).toThrow(RangeError);
    expect(() => niepelnyMiesiac({ ...LISTOPAD, od: 16, dniL4: 16 })).toThrow(RangeError);
    expect(() => niepelnyMiesiac({ ...LISTOPAD, godzinyNieobecnosci: 161 })).toThrow(RangeError);
    expect(() => niepelnyMiesiac({ ...LISTOPAD, od: 20, do: 10 })).toThrow(RangeError);
    expect(() => niepelnyMiesiac({ ...LISTOPAD, do: 31 })).toThrow(RangeError);
    expect(() => niepelnyMiesiac({ ...LISTOPAD, stawka: 0 })).toThrow(RangeError);
    expect(() => niepelnyMiesiac({ ...LISTOPAD, etat: 1.5 })).toThrow(RangeError);
    expect(() => niepelnyMiesiac({ ...LISTOPAD, rok: 2030 })).toThrow(RangeError);
  });
});
