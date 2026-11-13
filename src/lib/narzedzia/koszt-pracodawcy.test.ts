import { describe, expect, it } from 'vitest';
import { LIMIT_ROCZNY_2026, ROKI_KOSZTU, kosztPracodawcy, rokKosztu } from './koszt-pracodawcy';

describe('koszt pracodawcy 2026 (umowa o pracę)', () => {
  it('płaca minimalna 4806 zł, wypadkowa 1,67%: 5790,28 zł', () => {
    // 469,07 + 312,39 + 80,26 + 48,06 + 69,69 + 4,81 = 984,28
    expect(kosztPracodawcy({ brutto: 4806 })).toEqual({
      rok: 2026,
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

describe('koszt pracodawcy 2027', () => {
  it('próg FP i FS to płaca minimalna 2027 (4950 zł): przy 4900 zł bez FP i FS, w 2026 r. z nimi', () => {
    // 2027: 478,24 + 318,50 + 81,83 + 0 + 0 + 4,90 = 883,47 → 5783,47 zł; 2026: + 49,00 + 71,05 = 5903,52 zł.
    expect(kosztPracodawcy({ brutto: 4900, rok: 2027 })).toMatchObject({ fp: 0, fs: 0, fgsp: 4.9, skladki: 883.47, koszt: 5783.47 });
    expect(kosztPracodawcy({ brutto: 4900, rok: 2026 })).toMatchObject({ fp: 49, fs: 71.05, koszt: 5903.52 });
  });
  it('płaca minimalna 2027 (4950 zł): 5963,77 zł', () => {
    // 483,12 + 321,75 + 82,67 (82,665) + 49,50 + 71,78 (71,775) + 4,95 = 1013,77
    expect(kosztPracodawcy({ brutto: 4950, rok: 2027 })).toMatchObject({ fp: 49.5, fs: 71.78, skladki: 1013.77, koszt: 5963.77 });
  });
  it('limit roczny 2027: 300 990 zł (M.P. 2026 poz. 1098); rok z daty', () => {
    expect(ROKI_KOSZTU[2027].limitRoczny).toBe(300990);
    expect(rokKosztu('2026-12-31')).toBe(2026);
    expect(rokKosztu('2027-01-01')).toBe(2027);
    expect(rokKosztu('2028-03-01')).toBe(2027);
  });
});
