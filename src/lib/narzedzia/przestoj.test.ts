import { describe, expect, it } from 'vitest';
import { przestoj } from './przestoj';

describe('wynagrodzenie za przestój (art. 81 Kp)', () => {
  it('stawka godzinowa 35 zł, 16 h: 560 zł', () => {
    expect(przestoj({ rok: 2026, miesiac: 11, godziny: 16, rodzaj: 'godzinowa', stawka: 35 })).toMatchObject({ zaGodzine: 35, kwota: 560, podniesioneDoMinimum: false });
  });
  it('pensja 6000 zł w listopadzie 2026 r. (160 h): 37,50 zł za godzinę', () => {
    const r = przestoj({ rok: 2026, miesiac: 11, godziny: 8, rodzaj: 'miesieczna', stawka: 6000 });
    expect(r).toMatchObject({ wymiar: 160, zaGodzine: 37.5, kwota: 300 });
  });
  it('bez wyodrębnionej stawki: 60% (stałe / wymiar + zmienne / godziny)', () => {
    // stałe 5000 / 160 = 31,25; zmienne 3000 / 480 = 6,25; razem 37,50; 60% = 22,50 < minimum 4806 / 160 = 30,0375
    const r = przestoj({ rok: 2026, miesiac: 11, godziny: 10, rodzaj: 'bez-stawki', stale: 5000, zmienneSuma: 3000, zmienneGodziny: 480 });
    expect(r).toMatchObject({ zaGodzine: 22.5, minimumZaGodzine: 30.04, podniesioneDoMinimum: true, kwota: 300.38 });
  });
  it('niska stawka godzinowa: podniesiona do płacy minimalnej', () => {
    expect(przestoj({ rok: 2026, miesiac: 11, godziny: 1, rodzaj: 'godzinowa', stawka: 25 }).podniesioneDoMinimum).toBe(true);
  });
  it('błędy', () => {
    expect(() => przestoj({ rok: 2026, miesiac: 11, godziny: 0, rodzaj: 'godzinowa', stawka: 30 })).toThrow(RangeError);
    expect(() => przestoj({ rok: 2026, miesiac: 11, godziny: 8, rodzaj: 'godzinowa' })).toThrow(RangeError);
  });
});
