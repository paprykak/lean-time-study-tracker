import { describe, expect, it } from 'vitest';
import { pierwszyUrlopDodatkowy, stawkaPoSkroceniu, wymiarNiepelnosprawnego } from './niepelnosprawny';

describe('pracownik z niepełnosprawnością (art. 15–19 ustawy o rehabilitacji)', () => {
  it('grudzień 2026 r. (Wigilia, święta, 26 grudnia w sobotę): 140 godzin przy 7 godzinach, 160 przy lekkim stopniu', () => {
    expect(wymiarNiepelnosprawnego(2026, 12, 'umiarkowany')).toMatchObject({ doba: 7, dni: 20, godziny: 140 });
    expect(wymiarNiepelnosprawnego(2026, 12, 'lekki')).toMatchObject({ doba: 8, godziny: 160 });
    expect(wymiarNiepelnosprawnego(2026, 12, 'znaczny', true).godziny).toBe(160);
  });
  it('święto w sobotę obniża wymiar o 7 godzin: listopad 2025 r. (1 listopada w sobotę)', () => {
    const w = wymiarNiepelnosprawnego(2025, 11, 'znaczny');
    expect(w.swieta.map((s) => s.data)).toEqual(['2025-11-01', '2025-11-11']);
    expect(w).toMatchObject({ dni: 18, godziny: 126 });
  });
  it('stawka godzinowa razy 8/7', () => {
    expect(stawkaPoSkroceniu(28)).toBe(32);
    expect(stawkaPoSkroceniu(30.5)).toBe(34.86);
  });
  it('dodatkowy urlop dzień po rocznicy zaliczenia, 29 lutego → 1 marca', () => {
    expect(pierwszyUrlopDodatkowy('2026-03-10')).toBe('2027-03-11');
    expect(pierwszyUrlopDodatkowy('2024-02-29')).toBe('2025-03-01');
  });
});
