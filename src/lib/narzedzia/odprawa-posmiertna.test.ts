import { describe, expect, it } from 'vitest';
import { miesiecyPosmiertnej, odprawaPosmiertna } from './odprawa-posmiertna';

describe('odprawa pośmiertna (art. 93 Kp)', () => {
  it('1, 3 albo 6 miesięcy według stażu u pracodawcy (§ 2)', () => {
    expect([0, 9, 10, 14, 15, 30].map(miesiecyPosmiertnej)).toEqual([1, 1, 3, 3, 6, 6]);
  });
  it('dwie osoby: cała kwota po równo (§ 5)', () => {
    expect(odprawaPosmiertna({ pensja: 6000, lata: 12, osoby: 2 })).toMatchObject({ miesiace: 3, odprawa: 18000, doWyplaty: 18000, naOsobe: 9000 });
  });
  it('jedna osoba: połowa (§ 6)', () => {
    expect(odprawaPosmiertna({ pensja: 6000, lata: 16, osoby: 1 })).toMatchObject({ miesiace: 6, odprawa: 18000, naOsobe: 18000, jednaOsoba: true });
  });
  it('ubezpieczenie na życie od pracodawcy: dopłata różnicy albo nic (§ 7)', () => {
    expect(odprawaPosmiertna({ pensja: 6000, lata: 12, osoby: 3, ubezpieczenie: 10000 })).toMatchObject({ odprawa: 18000, doWyplaty: 8000, naOsobe: 2666.67 });
    expect(odprawaPosmiertna({ pensja: 6000, lata: 12, osoby: 3, ubezpieczenie: 18000 }).doWyplaty).toBe(0);
  });
  it('błędy', () => {
    expect(() => odprawaPosmiertna({ pensja: 0, lata: 1, osoby: 1 })).toThrow(RangeError);
    expect(() => odprawaPosmiertna({ pensja: 6000, lata: 1, osoby: 0 })).toThrow(RangeError);
    expect(() => odprawaPosmiertna({ pensja: 6000, lata: 1.5, osoby: 1 })).toThrow(RangeError);
  });
});
