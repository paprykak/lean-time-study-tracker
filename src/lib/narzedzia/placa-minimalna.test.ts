import { describe, expect, it } from 'vitest';
import { NIEWLICZANE, minimumZlecenie, sprawdzPlace } from './placa-minimalna';

describe('płaca minimalna (art. 6–8a ustawy o minimalnym wynagrodzeniu)', () => {
  it('pensja 4500 zł + premia 200 zł w 2026 r.: brakuje 106 zł wyrównania', () => {
    expect(sprawdzPlace({ rok: 2026, zasadnicze: 4500, wliczane: 200 })).toEqual({ minimum: 4806, liczone: 4700, wyrownanie: 106, zgodne: false, stawkaZlecenie: 31.4 });
  });
  it('pół etatu: minimum 2403 zł', () => {
    expect(sprawdzPlace({ rok: 2026, etat: 0.5, zasadnicze: 2403 })).toMatchObject({ minimum: 2403, zgodne: true, wyrownanie: 0 });
  });
  it('2027: 4950 zł, zlecenie 32,30 zł za godzinę', () => {
    expect(sprawdzPlace({ rok: 2027, zasadnicze: 5000 })).toMatchObject({ minimum: 4950, zgodne: true, stawkaZlecenie: 32.3 });
    expect(minimumZlecenie(2027, 160)).toBe(5168);
    expect(minimumZlecenie(2026, 168)).toBe(5275.2);
  });
  it('sześć składników z art. 6 ust. 5', () => {
    expect(NIEWLICZANE).toHaveLength(6);
  });
  it('błędy', () => {
    expect(() => sprawdzPlace({ rok: 2030, zasadnicze: 5000 })).toThrow(RangeError);
    expect(() => sprawdzPlace({ rok: 2026, zasadnicze: 5000, etat: 0 })).toThrow(RangeError);
  });
});
