import { describe, expect, it } from 'vitest';
import { dniPracyWRoku, ekwiwalent, wspolczynnik } from './ekwiwalent';

describe('ekwiwalent za urlop (§ 15–19 rozporządzenia z 1997 r.)', () => {
  it('dni pracy i współczynnik: 2026 → 251 dni, 251/12; 2025 → 249 dni (Wigilia); 2027 → 251 dni', () => {
    expect(dniPracyWRoku(2026)).toBe(251);
    expect(wspolczynnik(2026)).toBeCloseTo(20.9167, 4);
    expect(dniPracyWRoku(2025)).toBe(249);
    expect(dniPracyWRoku(2027)).toBe(251);
  });
  it('2028 (rok przestępny): 249 dni, bo 1 stycznia i 11 listopada wypadają w sobotę; współczynnik 20,75 (Python, Wielkanoc z algorytmu Meeusa)', () => {
    expect(dniPracyWRoku(2028)).toBe(249);
    expect(wspolczynnik(2028)).toBeCloseTo(20.75, 4);
  });
  it('6000 zł, pełny etat, 5 dni (40 h) w 2026 r.', () => {
    const r = ekwiwalent({ rok: 2026, stale: 6000, godzinyUrlopu: 40 });
    // 6000 / (251/12) = 286,85 za dzień; / 8 = 35,86 za godzinę; × 40 = 1434,26
    expect(r).toEqual({ podstawa: 6000, wspolczynnik: 251 / 12, zaDzien: 286.85, zaGodzine: 35.86, kwota: 1434.26 });
  });
  it('składniki zmienne (§ 16) i premia roczna (§ 17, średnio z 12 miesięcy)', () => {
    const r = ekwiwalent({ rok: 2026, stale: 4806, zmienne: 600, dluzsze12: 2400, godzinyUrlopu: 8 });
    expect(r.podstawa).toBe(5606);
    expect(r.kwota).toBe(268.02);
  });
  it('pół etatu: współczynnik obniżony o połowę (§ 19 ust. 3); 13 dni = 104 h', () => {
    const r = ekwiwalent({ rok: 2026, stale: 2403, etat: 0.5, godzinyUrlopu: 104 });
    expect(r.wspolczynnik).toBeCloseTo(10.4583, 4);
    expect(r.kwota).toBe(2987); // 2403 × 312 / 251 = 2986,996…
  });
  it('norma 7 h: ekwiwalent za godzinę wyższy', () => {
    expect(ekwiwalent({ rok: 2026, stale: 6000, norma: 7, godzinyUrlopu: 7 }).kwota).toBe(286.85);
  });
  it('błędy', () => {
    expect(() => ekwiwalent({ rok: 2026, stale: -1, godzinyUrlopu: 8 })).toThrow(RangeError);
    expect(() => ekwiwalent({ rok: 2026, stale: 1000, etat: 0, godzinyUrlopu: 8 })).toThrow(RangeError);
  });
});
