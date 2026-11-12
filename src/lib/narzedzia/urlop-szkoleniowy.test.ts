import { describe, expect, it } from 'vitest';
import { urlopSzkoleniowy, type Egzamin } from './urlop-szkoleniowy';

// Wartości sprawdzone niezależnie w Pythonie (6/6/6/21 dni z art. 103^2 § 1 Kp, dzień = cała zmiana).
describe('urlop szkoleniowy (art. 103^1–103^6 Kp)', () => {
  it('matura i egzamin zawodowy w jednym roku: 12 dni, przy 8 h 96 h', () => {
    expect(urlopSzkoleniowy({ zaZgoda: true, egzaminy: ['maturalny', 'zawodowy'], zmiana: 8 })).toEqual({
      podstawa: 'art. 103^1',
      dni: 12,
      godziny: 96,
      pozycje: [
        { egzamin: 'maturalny', dni: 6 },
        { egzamin: 'zawodowy', dni: 6 },
      ],
    });
  });
  it('ostatni rok studiów: 21 dni, przy zmianach 12 h to 252 h', () => {
    expect(urlopSzkoleniowy({ zaZgoda: true, egzaminy: ['studia'], zmiana: 12 })).toMatchObject({ dni: 21, godziny: 252 });
  });
  it('egzamin zawodowy przy 12 h: 6 dni = 72 h, a nie 48 h', () => {
    expect(urlopSzkoleniowy({ zaZgoda: true, egzaminy: ['zawodowy'], zmiana: 12 })).toMatchObject({ dni: 6, godziny: 72 });
  });
  it('wszystkie cztery pozycje przy zmianie 7,5 h: 39 dni, 292,5 h', () => {
    const wszystkie: Egzamin[] = ['studia', 'zawodowy', 'maturalny', 'eksternistyczny'];
    const r = urlopSzkoleniowy({ zaZgoda: true, egzaminy: wszystkie, zmiana: 7.5 });
    expect(r).toMatchObject({ dni: 39, godziny: 292.5 });
    expect(r.pozycje.map((p) => p.egzamin)).toEqual(['eksternistyczny', 'maturalny', 'zawodowy', 'studia']);
  });
  it('nauka bez zgody pracodawcy: 0 dni, zostaje art. 103^6', () => {
    expect(urlopSzkoleniowy({ zaZgoda: false, egzaminy: ['studia', 'maturalny'], zmiana: 12 })).toEqual({ podstawa: 'art. 103^6', dni: 0, godziny: 0, pozycje: [] });
  });
  it('za zgodą bez egzaminu: 0 dni urlopu, ale podstawa art. 103^1 (zwolnienie na zajęcia)', () => {
    expect(urlopSzkoleniowy({ zaZgoda: true, egzaminy: [], zmiana: 8 })).toEqual({ podstawa: 'art. 103^1', dni: 0, godziny: 0, pozycje: [] });
  });
  it('ten sam egzamin dwa razy liczy się raz', () => {
    expect(urlopSzkoleniowy({ zaZgoda: true, egzaminy: ['maturalny', 'maturalny'], zmiana: 10 })).toMatchObject({ dni: 6, godziny: 60 });
  });
  it('granice zmiany: 24 h i 0,5 h działają, 0, ujemna, 24,1 h i NaN to błąd', () => {
    expect(urlopSzkoleniowy({ zaZgoda: true, egzaminy: ['zawodowy'], zmiana: 24 }).godziny).toBe(144);
    expect(urlopSzkoleniowy({ zaZgoda: true, egzaminy: ['zawodowy'], zmiana: 0.5 }).godziny).toBe(3);
    for (const zmiana of [0, -8, 24.1, Number.NaN]) expect(() => urlopSzkoleniowy({ zaZgoda: true, egzaminy: [], zmiana })).toThrow(RangeError);
    expect(() => urlopSzkoleniowy({ zaZgoda: true, egzaminy: ['doktorat' as Egzamin], zmiana: 8 })).toThrow(RangeError);
  });
});
