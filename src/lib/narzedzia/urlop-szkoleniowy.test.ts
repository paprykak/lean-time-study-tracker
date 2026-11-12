import { describe, expect, it } from 'vitest';
import { urlopSzkoleniowy, type Egzamin } from './urlop-szkoleniowy';

// Wartości sprawdzone niezależnie w Pythonie (6 dni do każdego egzaminu z art. 103^2 § 1 pkt 1–3 Kp, 21 dni raz
// w ostatnim roku studiów, dzień = cała zmiana, godziny w pełnych minutach).
describe('urlop szkoleniowy (art. 103^1–103^6 Kp)', () => {
  it('matura i egzamin zawodowy: 12 dni, przy 8 h 96 h', () => {
    expect(urlopSzkoleniowy({ zaZgoda: true, egzaminy: { maturalny: 1, zawodowy: 1 }, zmiana: 8 })).toEqual({
      podstawa: 'art. 103^1',
      dni: 12,
      minuty: 5760,
      godziny: 96,
      pozycje: [
        { egzamin: 'maturalny', liczba: 1, dni: 6 },
        { egzamin: 'zawodowy', liczba: 1, dni: 6 },
      ],
    });
  });
  it('ostatni rok studiów: 21 dni, przy zmianach 12 h to 252 h', () => {
    expect(urlopSzkoleniowy({ zaZgoda: true, egzaminy: { studia: 1 }, zmiana: 12 })).toMatchObject({ dni: 21, godziny: 252 });
  });
  it('egzamin zawodowy przy 12 h: 6 dni = 72 h, a nie 48 h', () => {
    expect(urlopSzkoleniowy({ zaZgoda: true, egzaminy: { zawodowy: 1 }, zmiana: 12 })).toMatchObject({ dni: 6, godziny: 72 });
  });
  it('wszystkie cztery pozycje przy zmianie 7,5 h: 39 dni, 292,5 h, w kolejności przepisu', () => {
    const r = urlopSzkoleniowy({ zaZgoda: true, egzaminy: { studia: 1, zawodowy: 1, maturalny: 1, eksternistyczny: 1 }, zmiana: 7.5 });
    expect(r).toMatchObject({ dni: 39, godziny: 292.5 });
    expect(r.pozycje.map((p) => p.egzamin)).toEqual(['eksternistyczny', 'maturalny', 'zawodowy', 'studia']);
  });
  it('kilka egzaminów tego samego rodzaju: 6 dni do każdego', () => {
    expect(urlopSzkoleniowy({ zaZgoda: true, egzaminy: { maturalny: 2 }, zmiana: 10 })).toMatchObject({ dni: 12, godziny: 120 });
    expect(urlopSzkoleniowy({ zaZgoda: true, egzaminy: { eksternistyczny: 3, zawodowy: 2 }, zmiana: 8 })).toMatchObject({ dni: 30, godziny: 240 });
    expect(urlopSzkoleniowy({ zaZgoda: true, egzaminy: { eksternistyczny: 5, maturalny: 5, zawodowy: 5, studia: 1 }, zmiana: 12 })).toMatchObject({ dni: 111, godziny: 1332 });
  });
  it('godziny w pełnych minutach: 21 × 7,333 h = 154 h, nie 153,99', () => {
    expect(urlopSzkoleniowy({ zaZgoda: true, egzaminy: { studia: 1 }, zmiana: 7.333 })).toMatchObject({ minuty: 9240, godziny: 154 });
  });
  it('nauka bez zgody pracodawcy: 0 dni, zostaje art. 103^6, długość zmiany bez znaczenia', () => {
    const bez = { podstawa: 'art. 103^6', dni: 0, minuty: 0, godziny: 0, pozycje: [] };
    expect(urlopSzkoleniowy({ zaZgoda: false, egzaminy: { studia: 1, maturalny: 1 }, zmiana: 12 })).toEqual(bez);
    expect(urlopSzkoleniowy({ zaZgoda: false, egzaminy: {}, zmiana: 0 })).toEqual(bez);
  });
  it('za zgodą bez egzaminu: 0 dni urlopu, ale podstawa art. 103^1 (zwolnienie na obowiązkowe zajęcia)', () => {
    expect(urlopSzkoleniowy({ zaZgoda: true, egzaminy: { maturalny: 0 }, zmiana: 8 })).toEqual({ podstawa: 'art. 103^1', dni: 0, minuty: 0, godziny: 0, pozycje: [] });
  });
  it('granice zmiany: 24 h i 0,5 h działają, 0, ujemna, 24,1 h i NaN to błąd', () => {
    expect(urlopSzkoleniowy({ zaZgoda: true, egzaminy: { zawodowy: 1 }, zmiana: 24 }).godziny).toBe(144);
    expect(urlopSzkoleniowy({ zaZgoda: true, egzaminy: { zawodowy: 1 }, zmiana: 0.5 }).godziny).toBe(3);
    for (const zmiana of [0, -8, 24.1, Number.NaN]) expect(() => urlopSzkoleniowy({ zaZgoda: true, egzaminy: {}, zmiana })).toThrow(RangeError);
  });
  it('błędne egzaminy: nieznany klucz (także constructor, toString), liczba poza zakresem', () => {
    for (const k of ['doktorat', 'constructor', 'toString', '__proto__'])
      expect(() => urlopSzkoleniowy({ zaZgoda: true, egzaminy: JSON.parse(`{"${k}":1}`) as Partial<Record<Egzamin, number>>, zmiana: 8 })).toThrow(RangeError);
    for (const e of [{ maturalny: 6 }, { maturalny: -1 }, { zawodowy: 1.5 }, { studia: 2 }])
      expect(() => urlopSzkoleniowy({ zaZgoda: true, egzaminy: e, zmiana: 8 })).toThrow(RangeError);
  });
});
