import { describe, expect, it } from 'vitest';
import { koniecPrzedawnienia, przedawnienie, wyplatyDoDochodzenia } from './przedawnienie';

// Oczekiwane daty z niezależnego rachunku w Pythonie (własny kalendarz świąt, art. 85 § 3, 3 lata z art. 291 § 1).
describe('przedawnienie roszczeń pracownika (art. 291 § 1 Kp)', () => {
  it('3 lata od dnia wymagalności, 29 lutego → 28 lutego', () => {
    expect(koniecPrzedawnienia('2023-11-10')).toBe('2026-11-10');
    expect(koniecPrzedawnienia('2024-02-29')).toBe('2027-02-28');
  });
  it('ostatni dzień terminu jeszcze w terminie, następny po terminie', () => {
    expect(przedawnienie('2023-11-10', '2026-11-10')).toMatchObject({ koniec: '2026-11-10', zostalo: 0, status: 'pilne' });
    expect(przedawnienie('2023-11-10', '2026-11-11').status).toBe('po-terminie');
    expect(przedawnienie('2024-01-10', '2026-11-12')).toMatchObject({ zostalo: 59, status: 'wkrotce' });
    expect(przedawnienie('2024-03-08', '2026-11-12').status).toBe('w-terminie');
  });
});

describe('wypłaty, o które można jeszcze wystąpić', () => {
  it('wypłata 10. dnia następnego miesiąca, 12 listopada 2026 r.: najstarsza za listopad 2023 r.', () => {
    const w = wyplatyDoDochodzenia('2026-11-12', 'nastepny', 10);
    expect(w.slice(0, 3)).toEqual([
      { za: '2023-11', wymagalna: '2023-12-08', koniec: '2026-12-08', zostalo: 26, status: 'pilne' },
      { za: '2023-12', wymagalna: '2024-01-10', koniec: '2027-01-10', zostalo: 59, status: 'wkrotce' },
      { za: '2024-01', wymagalna: '2024-02-09', koniec: '2027-02-09', zostalo: 89, status: 'wkrotce' },
    ]);
    expect(w).toHaveLength(36);
    expect(w.at(-1)).toMatchObject({ za: '2026-10', wymagalna: '2026-11-10', koniec: '2029-11-10' });
  });
  it('wypłata ostatniego dnia miesiąca', () => {
    const w = wyplatyDoDochodzenia('2026-11-12', 'ostatni', 0);
    expect(w[0]).toEqual({ za: '2023-11', wymagalna: '2023-11-30', koniec: '2026-11-30', zostalo: 18, status: 'pilne' });
    expect(w[1]).toMatchObject({ za: '2023-12', wymagalna: '2023-12-29' });
    expect(w).toHaveLength(36);
  });
  it('dzień wypłaty w następnym miesiącu najpóźniej 10. (art. 85 § 2)', () => {
    expect(() => wyplatyDoDochodzenia('2026-11-12', 'nastepny', 15)).toThrow(RangeError);
    expect(() => wyplatyDoDochodzenia('2026-11-12', 'ten', 30)).toThrow(RangeError);
  });
});
