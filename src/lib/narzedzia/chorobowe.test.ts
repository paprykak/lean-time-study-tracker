import { describe, expect, it } from 'vitest';
import { chorobowe, minimalnaPodstawa } from './chorobowe';

describe('wynagrodzenie chorobowe i zasiłek (art. 92 Kp, ustawa zasiłkowa)', () => {
  it('6000 zł brutto, 10 dni choroby: podstawa 5177,40 zł, 138,06 zł za dzień, całość od pracodawcy', () => {
    expect(chorobowe({ rok: 2026, brutto: 6000, dni: 10 })).toMatchObject({
      podstawa: 5177.4,
      procent: 80,
      zaDzien: 138.06,
      dniPracodawca: 10,
      dniZus: 0,
      razem: 1380.6,
    });
  });
  it('limit 33 dni w roku: 30 już wykorzystanych, 10 dni → 3 od pracodawcy, 7 z ZUS', () => {
    expect(chorobowe({ rok: 2026, brutto: 6000, dni: 10, wykorzystane: 30 })).toMatchObject({ dniPracodawca: 3, dniZus: 7, wynagrodzenieChorobowe: 414.18, zasilek: 966.42 });
  });
  it('po roku 50. urodzin: pracodawca 14 dni', () => {
    expect(chorobowe({ rok: 2026, brutto: 6000, dni: 20, po50: true })).toMatchObject({ limitPracodawcy: 14, dniPracodawca: 14, dniZus: 6 });
  });
  it('ciąża i wypadek w drodze: 100%', () => {
    expect(chorobowe({ rok: 2026, brutto: 6000, dni: 30, powod: 'ciaza' })).toMatchObject({ procent: 100, zaDzien: 172.58, razem: 5177.4 });
    expect(chorobowe({ rok: 2026, brutto: 6000, dni: 1, powod: 'wypadek-w-drodze' }).procent).toBe(100);
  });
  it('minimum przy pełnym etacie: płaca minimalna minus 13,71% (art. 45)', () => {
    expect(minimalnaPodstawa(2026)).toBe(4147.1);
    expect(minimalnaPodstawa(2027)).toBe(4271.36);
    expect(chorobowe({ rok: 2026, brutto: 4000, dni: 1 })).toMatchObject({ podstawa: 4147.1, podstawaPodniesiona: true });
    expect(chorobowe({ rok: 2026, brutto: 2400, dni: 1, pelnyEtat: false })).toMatchObject({ podstawa: 2070.96, podstawaPodniesiona: false });
  });
  it('błędy: zero dni, ponad 182 dni choroby', () => {
    expect(() => chorobowe({ rok: 2026, brutto: 6000, dni: 0 })).toThrow(RangeError);
    expect(() => chorobowe({ rok: 2026, brutto: 6000, dni: 183 })).toThrow(RangeError);
    expect(chorobowe({ rok: 2026, brutto: 6000, dni: 270, powod: 'ciaza' }).dniZus).toBe(237);
  });
});
