import { describe, expect, it } from 'vitest';
import { BladDanych, dniIGodziny, opisWyniku, pelneZmiany, urlopGodzinowy, type DaneUrlopu } from './urlop-godzinowy';

// Wartości sprawdzone niezależnie w Pythonie (skrypt urlop-godzinowy.py w notatkach budowniczego).
const D = (x: Partial<DaneUrlopu> = {}): DaneUrlopu => ({ dni: 26, godziny: 0, dzien: 8, plan: [{ dlugosc: 12, liczba: 4 }], naZadanieWykorzystane: 0, ...x });
const bez = (s: string) => s.replace(/\s/g, ' ');

describe('urlop w godzinach (art. 154^2 Kp)', () => {
  it('26 dni = 208 h; plan 4 × 12 h zostawia 160 h = 20 dni, 13 zmian po 12 h i 4 h', () => {
    const r = urlopGodzinowy(D());
    expect(r).toMatchObject({ masz: 208, plan: 48, zostalo: 160, brakuje: 0, pokryte: 4, czesc: 0, zmianPlanu: 4 });
    expect(r.zostaloDni).toEqual({ pelne: 20, reszta: 0 });
    expect(r.dalej).toEqual([{ dlugosc: 12, pelne: 13, reszta: 4 }, { dlugosc: 8, pelne: 20, reszta: 0 }]);
    expect(r).toMatchObject({ naZadanie: 4, limitNaZadanie: 4, dlugoscNaZadanie: 12, naZadanieGodziny: 48 });
    const o = opisWyniku(r);
    expect(bez(o.zostalo)).toBe('160 h');
    expect(bez(o.opis)).toBe('To 20 dni urlopu po 8 h');
    expect(o.dalej.map((x) => bez(`${x.etykieta}: ${x.tekst}`))).toEqual(['Jeszcze po 12 h: 13 zmian i 4 h na część zmiany', 'Jeszcze po 8 h: 20 zmian']);
    expect(bez(o.naZadanie)).toBe('4 dni w ramach pozostałego urlopu; przy zmianie 12 h to 48 h');
  });

  it('plan 18 × 12 h przy 208 h: 17 pełnych zmian, 4 h na 18., brakuje 8 h', () => {
    const r = urlopGodzinowy(D({ plan: [{ dlugosc: 12, liczba: 18 }] }));
    expect(r).toMatchObject({ plan: 216, zostalo: 0, brakuje: 8, pokryte: 17, czesc: 4, numerCzesci: 18 });
    expect(bez(opisWyniku(r).pokrycie)).toBe('17 z 18 zmian w całości, na 18. zmianie tylko 4 h urlopu; brakuje 8 h');
    expect(bez(opisWyniku(r).opis)).toBe('Na cały plan brakuje 8 h urlopu');
    expect(r.naZadanie).toBe(0);
    expect(bez(opisWyniku(r).naZadanie)).toBe('0 dni: plan wykorzystuje cały urlop (limit w tym roku: 4 dni)');
  });

  it('granica § 4: 20 dni i 4 h przy 14 zmianach po 12 h: 13 pełnych, 8 h na 14., brakuje 4 h', () => {
    expect(urlopGodzinowy(D({ dni: 20, godziny: 4, plan: [{ dlugosc: 12, liczba: 14 }] }))).toMatchObject({ masz: 164, pokryte: 13, czesc: 8, numerCzesci: 14, brakuje: 4 });
    // Dokładnie tyle, ile trwa plan: wszystko w całości, nic nie zostaje.
    expect(urlopGodzinowy(D({ plan: [{ dlugosc: 12, liczba: 17 }, { dlugosc: 4, liczba: 1 }] }))).toMatchObject({ zostalo: 0, brakuje: 0, pokryte: 18, czesc: 0 });
  });

  it('niższa norma 7 h: 26 dni = 182 h, po 4 × 12 h zostaje 134 h = 19 dni i 1 h', () => {
    const r = urlopGodzinowy(D({ dzien: 7, naZadanieWykorzystane: 1 }));
    expect(r).toMatchObject({ masz: 182, zostalo: 134, zostaloDni: { pelne: 19, reszta: 1 }, naZadanie: 3, naZadanieGodziny: 36 });
    expect(r.dalej).toEqual([{ dlugosc: 7, pelne: 19, reszta: 1 }]);
    expect(bez(dniIGodziny(134, 7))).toBe('19 dni i 1 h');
  });

  it('zmiany różnej długości, resztka godzin i wykorzystany urlop na żądanie', () => {
    const r = urlopGodzinowy(D({ godziny: 7, plan: [{ dlugosc: 12, liczba: 10 }, { dlugosc: 8, liczba: 3 }], naZadanieWykorzystane: 4 }));
    expect(r).toMatchObject({ masz: 215, plan: 144, zostalo: 71, zostaloDni: { pelne: 8, reszta: 7 }, dalej: [{ pelne: 5, reszta: 11 }, { pelne: 8, reszta: 7 }], pokryte: 13, naZadanie: 0 });
    expect(opisWyniku(r).naZadanie).toBe('wykorzystany w tym roku');
    // Zmiany po 7,5 h liczone w minutach: 160 − 15 = 145 h.
    expect(urlopGodzinowy(D({ dni: 20, plan: [{ dlugosc: 7.5, liczba: 2 }] }))).toMatchObject({ zostalo: 145, zostaloDni: { pelne: 18, reszta: 1 }, dalej: [{ pelne: 12, reszta: 1 }, { pelne: 18, reszta: 1 }] });
  });

  it('bez planu: 20 dni = 160 h; zero dni i 1 dzień w odmianie', () => {
    const r = urlopGodzinowy(D({ dni: 20, plan: [] }));
    expect(r).toMatchObject({ masz: 160, plan: 0, zostalo: 160, dlugoscNaZadanie: null, naZadanieGodziny: null });
    expect(opisWyniku(r).pokrycie).toBe('brak planu');
    expect(bez(dniIGodziny(12, 8))).toBe('1 dzień i 4 h');
    expect(bez(dniIGodziny(4, 8))).toBe('4 h');
    expect(pelneZmiany(0, 12)).toEqual({ pelne: 0, reszta: 0 });
  });

  it('błędne dane: RangeError', () => {
    expect(() => urlopGodzinowy(D({ dni: -1 }))).toThrow(RangeError);
    expect(() => urlopGodzinowy(D({ dni: 2.5 }))).toThrow(RangeError);
    expect(() => urlopGodzinowy(D({ godziny: 8 }))).toThrow('Dodatkowe godziny: pełne godziny od 0 do 7.');
    expect(() => urlopGodzinowy(D({ dzien: 7, godziny: 7 }))).toThrow('Dodatkowe godziny: pełne godziny od 0 do 6.');
    expect(() => urlopGodzinowy(D({ plan: [{ dlugosc: 0, liczba: 1 }] }))).toThrow('Wiersz 1: długość zmiany od 1 do 24 h.');
    expect(() => urlopGodzinowy(D({ plan: [{ dlugosc: 0.005, liczba: 1 }] }))).toThrow(RangeError);
    expect(() => urlopGodzinowy(D({ plan: [{ dlugosc: 0.9, liczba: 1 }] }))).toThrow(RangeError);
    expect(urlopGodzinowy(D({ plan: [{ dlugosc: 1, liczba: 1 }] })).zostalo).toBe(207);
    expect(() => urlopGodzinowy(D({ plan: [{ dlugosc: 24.5, liczba: 1 }] }))).toThrow(RangeError);
    expect(() => urlopGodzinowy(D({ plan: [{ dlugosc: 12, liczba: -1 }] }))).toThrow(RangeError);
    expect(() => urlopGodzinowy(D({ naZadanieWykorzystane: 5 }))).toThrow('Urlop na żądanie: od 0 do 4 dni.');
    expect(urlopGodzinowy(D({ plan: [{ dlugosc: 24, liczba: 1 }], naZadanieWykorzystane: 4 })).zostalo).toBe(184);
  });

  it('błąd podaje numer wiersza formularza i pole', () => {
    try {
      urlopGodzinowy(D({ plan: [{ dlugosc: 25, liczba: 1, wiersz: 2 }] }));
      expect.unreachable();
    } catch (e) {
      expect(e).toBeInstanceOf(BladDanych);
      expect((e as BladDanych).message).toBe('Wiersz 2: długość zmiany od 1 do 24 h.');
      expect((e as BladDanych).pole).toBe('dlugosc2');
    }
    expect(() => urlopGodzinowy(D({ plan: [{ dlugosc: 12, liczba: 1.5, wiersz: 3 }] }))).toThrow('Wiersz 3: liczba zmian od 0 do 366.');
    expect(() => pelneZmiany(10, 0)).toThrow(RangeError);
    expect(() => pelneZmiany(10, -1)).toThrow(RangeError);
    expect(() => pelneZmiany(10, 0.001)).toThrow(RangeError);
  });

  it('urlop na żądanie w ramach pozostałej puli (art. 168)', () => {
    // 2 dni = 16 h, po zmianie 12 h zostają 4 h: cała zmiana na żądanie się nie mieści.
    const a = urlopGodzinowy(D({ dni: 2, plan: [{ dlugosc: 12, liczba: 1 }] }));
    expect(a).toMatchObject({ zostalo: 4, naZadanie: 0, limitNaZadanie: 4 });
    expect(bez(opisWyniku(a).naZadanie)).toBe('0 dni: w pozostałym urlopie nie mieści się cała zmiana 12 h');
    expect(bez(opisWyniku(a).dalej[0].tekst)).toBe('4 h na część zmiany');
    // 3 dni = 24 h, po zmianie 12 h zostaje 12 h: jedna zmiana na żądanie.
    const b = urlopGodzinowy(D({ dni: 3, plan: [{ dlugosc: 12, liczba: 1 }] }));
    expect(b).toMatchObject({ naZadanie: 1, naZadanieGodziny: 12 });
    expect(bez(opisWyniku(b).naZadanie)).toBe('1 dzień w ramach pozostałego urlopu; przy zmianie 12 h to 12 h (limit w tym roku: 4 dni)');
    // Bez planu: same dni.
    const c = urlopGodzinowy(D({ dni: 20, plan: [], naZadanieWykorzystane: 2 }));
    expect(bez(opisWyniku(c).naZadanie)).toBe('do 2 dni w ramach pozostałego urlopu; godziny zależą od długości zmiany w grafiku');
    // Plan dokładnie na cały urlop i jedna zmiana w planie bez pokrycia: teksty bez „0 h po 8 h” i „z 1 zmian”.
    const d = urlopGodzinowy(D({ plan: [{ dlugosc: 12, liczba: 17 }, { dlugosc: 4, liczba: 1 }] }));
    expect(opisWyniku(d).opis).toBe('Plan wykorzystuje cały urlop');
    const e = urlopGodzinowy(D({ dni: 0, plan: [{ dlugosc: 12, liczba: 1 }] }));
    expect(bez(opisWyniku(e).pokrycie)).toBe('0 z 1 zmiany w całości; brakuje 12 h');
    expect(bez(opisWyniku(e).masz)).toBe('0 h');
  });
});
