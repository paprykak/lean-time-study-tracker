import { describe, expect, it } from 'vitest';
import { odszkodowanieZaZakaz } from './zakaz-konkurencji';

describe('odszkodowanie za zakaz konkurencji (art. 101² § 3 Kp)', () => {
  it('6000 zł, 12 miesięcy: co najmniej 18 000 zł, 1500 zł miesięcznie', () => {
    expect(odszkodowanieZaZakaz({ pensja: 6000, miesiace: 12 })).toMatchObject({ minimum: 18000, minimumMiesiecznie: 1500, zgodne: true });
  });
  it('umowa na 50%: 36 000 zł za 12 miesięcy', () => {
    expect(odszkodowanieZaZakaz({ pensja: 6000, miesiace: 12, procent: 50 })).toMatchObject({ razem: 36000, miesiecznie: 3000 });
  });
  it('umowa na 20%: poniżej minimum', () => {
    expect(odszkodowanieZaZakaz({ pensja: 6000, miesiace: 6, procent: 20 }).zgodne).toBe(false);
  });
  it('błędy', () => {
    expect(() => odszkodowanieZaZakaz({ pensja: 6000, miesiace: 0 })).toThrow(RangeError);
  });
});
