import { describe, expect, it } from 'vitest';
import { dniIGodziny, opisWyniku, pelneZmiany, urlopGodzinowy, type DaneUrlopu } from './urlop-godzinowy';

// Wartości sprawdzone niezależnie w Pythonie (skrypt urlop-godzinowy.py w notatkach budowniczego).
const D = (x: Partial<DaneUrlopu> = {}): DaneUrlopu => ({ dni: 26, godziny: 0, dzien: 8, plan: [{ dlugosc: 12, liczba: 4 }], naZadanieWykorzystane: 0, ...x });
const bez = (s: string) => s.replace(/\s/g, ' ');

describe('urlop w godzinach (art. 154^2 Kp)', () => {
  it('26 dni = 208 h; plan 4 × 12 h zostawia 160 h = 20 dni, 13 zmian po 12 h i 4 h', () => {
    const r = urlopGodzinowy(D());
    expect(r).toMatchObject({ masz: 208, plan: 48, zostalo: 160, brakuje: 0, pokryte: 4, czesc: 0, zmianPlanu: 4 });
    expect(r.zostaloDni).toEqual({ pelne: 20, reszta: 0 });
    expect(r.po12).toEqual({ pelne: 13, reszta: 4 });
    expect(r.po8).toEqual({ pelne: 20, reszta: 0 });
    expect(r).toMatchObject({ naZadanie: 4, dlugoscNaZadanie: 12, naZadanieGodziny: 48 });
    const o = opisWyniku(r);
    expect(bez(o.zostalo)).toBe('160 h');
    expect(bez(o.opis)).toBe('To 20 dni urlopu po 8 h');
    expect(bez(o.po12)).toBe('13 zmian i 4 h na część zmiany');
    expect(bez(o.naZadanie)).toBe('4 dni; przy zmianie 12 h to do 48 h z puli');
  });

  it('plan 18 × 12 h przy 208 h: 17 pełnych zmian, 4 h na 18., brakuje 8 h', () => {
    const r = urlopGodzinowy(D({ plan: [{ dlugosc: 12, liczba: 18 }] }));
    expect(r).toMatchObject({ plan: 216, zostalo: 0, brakuje: 8, pokryte: 17, czesc: 4, numerCzesci: 18 });
    expect(bez(opisWyniku(r).pokrycie)).toBe('17 z 18 zmian w całości, na 18. zmianie tylko 4 h urlopu; brakuje 8 h');
    expect(bez(opisWyniku(r).opis)).toBe('Na cały plan brakuje 8 h urlopu');
  });

  it('granica § 4: 20 dni i 4 h przy 14 zmianach po 12 h: 13 pełnych, 8 h na 14., brakuje 4 h', () => {
    expect(urlopGodzinowy(D({ dni: 20, godziny: 4, plan: [{ dlugosc: 12, liczba: 14 }] }))).toMatchObject({ masz: 164, pokryte: 13, czesc: 8, numerCzesci: 14, brakuje: 4 });
    // Dokładnie tyle, ile trwa plan: wszystko w całości, nic nie zostaje.
    expect(urlopGodzinowy(D({ plan: [{ dlugosc: 12, liczba: 17 }, { dlugosc: 4, liczba: 1 }] }))).toMatchObject({ zostalo: 0, brakuje: 0, pokryte: 18, czesc: 0 });
  });

  it('niższa norma 7 h: 26 dni = 182 h, po 4 × 12 h zostaje 134 h = 19 dni i 1 h', () => {
    const r = urlopGodzinowy(D({ dzien: 7, naZadanieWykorzystane: 1 }));
    expect(r).toMatchObject({ masz: 182, zostalo: 134, zostaloDni: { pelne: 19, reszta: 1 }, po12: { pelne: 11, reszta: 2 }, po8: { pelne: 16, reszta: 6 }, naZadanie: 3, naZadanieGodziny: 36 });
    expect(bez(dniIGodziny(134, 7))).toBe('19 dni i 1 h');
  });

  it('zmiany różnej długości, resztka godzin i wykorzystany urlop na żądanie', () => {
    const r = urlopGodzinowy(D({ godziny: 7, plan: [{ dlugosc: 12, liczba: 10 }, { dlugosc: 8, liczba: 3 }], naZadanieWykorzystane: 4 }));
    expect(r).toMatchObject({ masz: 215, plan: 144, zostalo: 71, zostaloDni: { pelne: 8, reszta: 7 }, po12: { pelne: 5, reszta: 11 }, pokryte: 13, naZadanie: 0 });
    expect(opisWyniku(r).naZadanie).toBe('wykorzystany w tym roku');
    // Zmiany po 7,5 h liczone w minutach: 160 − 15 = 145 h.
    expect(urlopGodzinowy(D({ dni: 20, plan: [{ dlugosc: 7.5, liczba: 2 }] }))).toMatchObject({ zostalo: 145, zostaloDni: { pelne: 18, reszta: 1 }, po12: { pelne: 12, reszta: 1 } });
  });

  it('bez planu: 20 dni = 160 h; zero dni i 1 dzień w odmianie', () => {
    const r = urlopGodzinowy(D({ dni: 20, plan: [] }));
    expect(r).toMatchObject({ masz: 160, plan: 0, zostalo: 160, dlugoscNaZadanie: 12 });
    expect(opisWyniku(r).pokrycie).toBe('brak planu');
    expect(bez(dniIGodziny(12, 8))).toBe('1 dzień i 4 h');
    expect(bez(dniIGodziny(4, 8))).toBe('4 h');
    expect(pelneZmiany(0, 12)).toEqual({ pelne: 0, reszta: 0 });
  });

  it('błędne dane: RangeError', () => {
    expect(() => urlopGodzinowy(D({ dni: -1 }))).toThrow(RangeError);
    expect(() => urlopGodzinowy(D({ dni: 2.5 }))).toThrow(RangeError);
    expect(() => urlopGodzinowy(D({ godziny: 8 }))).toThrow('Dodatkowe godziny: od 0 do 7.');
    expect(() => urlopGodzinowy(D({ dzien: 7, godziny: 7 }))).toThrow('Dodatkowe godziny: od 0 do 6.');
    expect(() => urlopGodzinowy(D({ plan: [{ dlugosc: 0, liczba: 1 }] }))).toThrow('Zmiana 1: długość od 0 do 24 h.');
    expect(() => urlopGodzinowy(D({ plan: [{ dlugosc: 24.5, liczba: 1 }] }))).toThrow(RangeError);
    expect(() => urlopGodzinowy(D({ plan: [{ dlugosc: 12, liczba: -1 }] }))).toThrow(RangeError);
    expect(() => urlopGodzinowy(D({ naZadanieWykorzystane: 5 }))).toThrow('Urlop na żądanie: od 0 do 4 dni.');
    expect(urlopGodzinowy(D({ plan: [{ dlugosc: 24, liczba: 1 }], naZadanieWykorzystane: 4 })).zostalo).toBe(184);
  });
});
