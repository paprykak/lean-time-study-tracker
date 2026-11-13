import { describe, expect, it } from 'vitest';
import { zasilekZlecenie } from './zasilek-zlecenie';

// Kwoty sprawdzone niezależnie w Pythonie (Decimal, ROUND_HALF_UP do grosza, zaliczka do pełnych złotych).
const ZLECENIE = { status: 'zlecenie-chorobowe' as const, przyczyna: 'choroba' as const, przychod: 4000, dni: 10 };

describe('zasiłek chorobowy na zleceniu (art. 3 pkt 4, 11, 48–49 ustawy zasiłkowej)', () => {
  it('4000 zł, 10 dni choroby: podstawa 3451,60 zł, 92,04 zł za dzień, 920,40 zł, na rękę 810,40 zł', () => {
    expect(zasilekZlecenie(ZLECENIE)).toMatchObject({ przysluguje: true, podstawa: 3451.6, zaDzien: 92.04, brutto: 920.4, zaliczka: 110, netto: 810.4, okresZasilkowy: 182 });
  });
  it('ciąża 100%, 30 dni: 3451,50 zł, okres 270 dni', () => {
    expect(zasilekZlecenie({ ...ZLECENIE, przyczyna: 'ciaza', dni: 30 })).toMatchObject({ zaDzien: 115.05, brutto: 3451.5, zaliczka: 414, okresZasilkowy: 270 });
  });
  it('inne kwoty: 3500 zł × 14 dni i 5123,45 zł × 31 dni', () => {
    expect(zasilekZlecenie({ ...ZLECENIE, przychod: 3500, dni: 14 })).toMatchObject({ podstawa: 3020.15, zaDzien: 80.54, brutto: 1127.56, netto: 992.56 });
    expect(zasilekZlecenie({ ...ZLECENIE, przychod: 5123.45, dni: 31 })).toMatchObject({ podstawa: 4421.03, zaDzien: 117.89, brutto: 3654.59, zaliczka: 439 });
  });
  it('wypadek przy pracy bez chorobowego: z ubezpieczenia wypadkowego, minus 11,26%, 100%', () => {
    expect(zasilekZlecenie({ ...ZLECENIE, status: 'zlecenie-bez-chorobowego', przyczyna: 'wypadek-przy-pracy', dni: 5 })).toMatchObject({ przysluguje: true, odliczenie: 11.26, podstawa: 3549.6, zaDzien: 118.32, brutto: 591.6, zaliczka: 71, bezWyczekiwania: true });
  });
  it('bez chorobowego, student, etat gdzie indziej, zlecenie u pracodawcy: zasiłku ze zlecenia nie ma', () => {
    expect(zasilekZlecenie({ ...ZLECENIE, status: 'zlecenie-bez-chorobowego' })).toMatchObject({ przysluguje: false, brutto: 0 });
    expect(zasilekZlecenie({ ...ZLECENIE, status: 'student', przyczyna: 'wypadek-przy-pracy' })).toMatchObject({ przysluguje: false, netto: 0 });
    expect(zasilekZlecenie({ ...ZLECENIE, status: 'etat-gdzie-indziej' }).przysluguje).toBe(false);
    expect(zasilekZlecenie({ ...ZLECENIE, status: 'u-pracodawcy' }).przysluguje).toBe(false);
  });
  it('błędne dane', () => {
    expect(() => zasilekZlecenie({ ...ZLECENIE, przychod: 0 })).toThrow(RangeError);
    expect(() => zasilekZlecenie({ ...ZLECENIE, dni: 0 })).toThrow(RangeError);
    expect(() => zasilekZlecenie({ ...ZLECENIE, dni: 2.5 })).toThrow(RangeError);
    expect(() => zasilekZlecenie({ ...ZLECENIE, dni: 271 })).toThrow(RangeError);
  });
});
