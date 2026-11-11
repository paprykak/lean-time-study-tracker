import { describe, expect, it } from 'vitest';
import { ocenTemperature, podsumowanie, type DaneTemperatury } from './temperatura';

const baza: DaneTemperatury = { miejsce: 'pomieszczenie', wysilek: 'zwykla', temperatura: 22, zPogody: true, wyjatek: false, data: '2027-07-01' };
const ocena = (z: Partial<DaneTemperatury>) => ocenTemperature({ ...baza, ...z });
const podstawy = (z: Partial<DaneTemperatury>) => ocena(z).map((p) => `${p.poziom}:${p.podstawa.split(' ').slice(0, 3).join(' ')}`);

describe('minimum w pomieszczeniu (§ 30)', () => {
  it('poniżej 14°C zawsze, poniżej 18°C w biurze i przy lekkiej pracy', () => {
    expect(podstawy({ temperatura: 12 })).toEqual(['obowiazek:§ 30 rozporządzenia']);
    expect(podstawy({ temperatura: 16 })).toEqual([]);
    expect(podstawy({ temperatura: 16, wysilek: 'biuro-lekka' })).toEqual(['obowiazek:§ 30 rozporządzenia']);
    expect(podsumowanie(ocena({ temperatura: 21 }))).toBe('bez-obowiazkow');
  });
});

describe('upał w pomieszczeniu (§ 30a od 11 stycznia 2027 r. i napoje)', () => {
  it('29°C z pogody: obowiązek z ust. 3 i napoje', () => {
    expect(podstawy({ temperatura: 29 })).toEqual(['obowiazek:§ 30a ust.', 'obowiazek:§ 4 ust.']);
  });
  it('26°C przy dużym wysiłku: próg 25°C i napoje za wysiłek', () => {
    expect(podstawy({ temperatura: 26, wysilek: 'duzy' })).toEqual(['obowiazek:§ 30a ust.', 'obowiazek:§ 4 ust.']);
  });
  it('36°C z pogody: zakaz pracy', () => {
    const p = ocena({ temperatura: 36 });
    expect(podsumowanie(p)).toBe('zakaz');
    expect(p[0].podstawa).toContain('§ 30a ust. 1 i 2');
  });
  it('36°C z technologii: bez zakazu i bez § 30a', () => {
    expect(podstawy({ temperatura: 36, zPogody: false })).toEqual([]);
  });
  it('36°C w pracy z wyjątków (np. ruch ciągły): bez zakazu, obowiązki zostają', () => {
    const p = ocena({ temperatura: 36, wyjatek: true });
    expect(podsumowanie(p)).toBe('obowiazki');
  });
  it('przed 11 stycznia 2027 r.: § 30a jako zapowiedź, napoje obowiązują', () => {
    const p = ocena({ temperatura: 36, data: '2026-11-11' });
    expect(p.map((x) => x.poziom)).toEqual(['zapowiedz', 'zapowiedz', 'obowiazek']);
    expect(p[0].tekst.startsWith('Przerwać pracę')).toBe(true);
    expect(podsumowanie(p)).toBe('obowiazki');
  });
});

describe('otwarta przestrzeń', () => {
  it('33°C przy dużym wysiłku: zakaz (32°C), obowiązki z ust. 4 i napoje', () => {
    expect(podstawy({ miejsce: 'otwarta', temperatura: 33, wysilek: 'duzy' })).toEqual(['zakaz:§ 30a ust.', 'obowiazek:§ 30a ust.', 'obowiazek:§ 4 ust.']);
  });
  it('33°C przy zwykłej pracy: bez zakazu', () => {
    expect(podsumowanie(ocena({ miejsce: 'otwarta', temperatura: 33 }))).toBe('obowiazki');
  });
  it('5°C: napoje gorące', () => {
    const p = ocena({ miejsce: 'otwarta', temperatura: 5 });
    expect(p).toHaveLength(1);
    expect(p[0].tekst).toContain('napoje gorące');
  });
  it('20°C: bez obowiązków', () => {
    expect(ocena({ miejsce: 'otwarta', temperatura: 20 })).toEqual([]);
  });
});
