import { describe, expect, it } from 'vitest';
import { limitOdprawy, miesiecyOdprawy, odprawa } from './odprawy';

describe('odprawy (art. 8 ustawy o zwolnieniach grupowych, art. 92^1 Kp)', () => {
  it('staż: krócej niż 2 lata → 1, od 2 do 8 lat → 2, ponad 8 lat → 3', () => {
    expect(miesiecyOdprawy('2024-01-01', '2025-12-30')).toBe(1);
    expect(miesiecyOdprawy('2024-01-01', '2025-12-31')).toBe(2); // pełne 2 lata
    expect(miesiecyOdprawy('2018-01-01', '2025-12-31')).toBe(2); // dokładnie 8 lat
    expect(miesiecyOdprawy('2018-01-01', '2026-01-01')).toBe(3); // ponad 8 lat
  });
  it('limit: 15 płac minimalnych z roku rozwiązania', () => {
    expect(limitOdprawy('2026-11-30')).toBe(72090);
    expect(limitOdprawy('2027-01-31')).toBe(74250);
    expect(limitOdprawy('2030-01-01')).toBeNull();
  });
  it('6000 zł, 5 lat pracy: 2 pensje = 12 000 zł', () => {
    expect(odprawa({ rodzaj: 'zwolnienie', stale: 6000, zatrudnienieOd: '2021-06-01', rozwiazanie: '2026-11-30' })).toEqual({
      miesieczne: 6000, miesiecy: 2, limit: 72090, ograniczona: false, kwota: 12000,
    });
  });
  it('premie: średnia zmiennych z 3 miesięcy i 1/12 rocznych', () => {
    expect(odprawa({ rodzaj: 'zwolnienie', stale: 5000, zmienne: 450, dluzsze12: 3600, zatrudnienieOd: '2010-03-01', rozwiazanie: '2026-11-30' })).toMatchObject({ miesieczne: 5750, miesiecy: 3, kwota: 17250 });
  });
  it('wysoka pensja: odprawa obcięta do limitu', () => {
    expect(odprawa({ rodzaj: 'zwolnienie', stale: 30000, zatrudnienieOd: '2010-01-01', rozwiazanie: '2026-11-30' })).toMatchObject({ ograniczona: true, kwota: 72090 });
  });
  it('emerytalna: jedna pensja, bez limitu', () => {
    expect(odprawa({ rodzaj: 'emerytalna', stale: 30000 })).toMatchObject({ miesiecy: 1, kwota: 30000, limit: null });
  });
  it('błędy', () => {
    expect(() => odprawa({ rodzaj: 'zwolnienie', stale: 6000 })).toThrow(RangeError);
    expect(() => odprawa({ rodzaj: 'zwolnienie', stale: 6000, zatrudnienieOd: '2026-01-01', rozwiazanie: '2025-01-01' })).toThrow(RangeError);
  });
  it('limit na przełomie 2026/2027: 72 090 i 74 250 zł (15 × 4806 i 15 × 4950)', () => {
    expect(limitOdprawy('2026-12-31')).toBe(72090);
    expect(limitOdprawy('2027-01-01')).toBe(74250);
    expect(odprawa({ rodzaj: 'zwolnienie', stale: 30000, zatrudnienieOd: '2010-01-01', rozwiazanie: '2027-01-04' })).toMatchObject({ kwota: 74250, ograniczona: true });
  });
});
