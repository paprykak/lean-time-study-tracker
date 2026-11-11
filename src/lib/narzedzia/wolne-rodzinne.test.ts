import { describe, expect, it } from 'vitest';
import { URLOP_OPIEKUNCZY_DNI, godzinyZwolnienia, silaWyzsza, zwolnienieNaDziecko } from './wolne-rodzinne';

describe('wolne na sprawy rodzinne (art. 148^1, 173^1, 188 Kp)', () => {
  it('pełny etat: 2 dni albo 16 godzin', () => {
    expect(zwolnienieNaDziecko()).toEqual({ dni: 2, godziny: 16 });
    expect(silaWyzsza()).toEqual({ dni: 2, godziny: 16 });
  });
  it('niepełny etat: godziny proporcjonalnie, niepełna godzina w górę', () => {
    expect(godzinyZwolnienia(0.5)).toBe(8);
    expect(godzinyZwolnienia(0.75)).toBe(12);
    expect(godzinyZwolnienia(0.875)).toBe(14);
    expect(godzinyZwolnienia(1 / 3)).toBe(6); // 5,33 h → 6
    expect(godzinyZwolnienia(0.6)).toBe(10); // 9,6 h → 10
  });
  it('norma 7 godzin: 14 godzin', () => {
    expect(godzinyZwolnienia(1, 7)).toBe(14);
  });
  it('urlop opiekuńczy: 5 dni; błędy', () => {
    expect(URLOP_OPIEKUNCZY_DNI).toBe(5);
    expect(() => godzinyZwolnienia(0)).toThrow(RangeError);
  });
});
