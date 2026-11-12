import { describe, expect, it } from 'vitest';
import { LIMIT_ROCZNY_2026, kosztPracodawcy } from './koszt-pracodawcy';

describe('koszt pracodawcy 2026 (umowa o pracę)', () => {
  it('płaca minimalna 4806 zł, wypadkowa 1,67%: 5790,28 zł', () => {
    // 469,07 + 312,39 + 80,26 + 48,06 + 69,69 + 4,81 = 984,28
    expect(kosztPracodawcy({ brutto: 4806 })).toEqual({
      brutto: 4806,
      emerytalna: 469.07,
      rentowa: 312.39,
      wypadkowa: 80.26,
      fp: 48.06,
      fs: 69.69,
      fgsp: 4.81,
      ppk: 0,
      skladki: 984.28,
      koszt: 5790.28,
    });
  });
  it('6000 zł z PPK', () => {
    // 585,60 + 390,00 + 100,20 + 60,00 + 87,00 + 6,00 + 90,00 = 1318,80
    expect(kosztPracodawcy({ brutto: 6000, ppk: true })).toMatchObject({ skladki: 1318.8, koszt: 7318.8 });
  });
  it('pensja poniżej płacy minimalnej (niepełny etat): bez FP i FS', () => {
    expect(kosztPracodawcy({ brutto: 2403 })).toMatchObject({ fp: 0, fs: 0, fgsp: 2.4 });
  });
  it('kobieta 55+ / mężczyzna 60+: bez FP, FS i FGŚP', () => {
    expect(kosztPracodawcy({ brutto: 6000, wiekZwolniony: true })).toMatchObject({ fp: 0, fs: 0, fgsp: 0 });
  });
  it('limit roczny 282 600 zł; błędna stopa wypadkowa', () => {
    expect(LIMIT_ROCZNY_2026).toBe(282600);
    expect(() => kosztPracodawcy({ brutto: 6000, wypadkowa: 10 })).toThrow(RangeError);
  });
});
