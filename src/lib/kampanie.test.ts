import { describe, expect, it } from 'vitest';
import { kampanieDlaMiejsca, POLE_KREACJI, trwa, widocznaBezSkryptu, wybierz } from './kampanie';
import { FORMATY } from './reklamy';

const d = (s: string) => new Date(s);
const k = (id: string, od: string, doDaty: string, miejsca = ['glowna-gora'], aktywna = true) => ({ id, od: d(od), do: d(doDaty), miejsca, aktywna });
const TERAZ = d('2026-11-06T12:00:00+01:00');

describe('kampanie w slocie', () => {
  it('każdy format slotu ma pole kreacji w kolekcji', () => {
    expect(Object.keys(POLE_KREACJI).sort()).toEqual(Object.keys(FORMATY).sort());
  });

  it('trwa: od włącznie, do wyłącznie', () => {
    const kampania = k('a', '2026-11-01T00:00:00+01:00', '2026-11-06T12:00:00+01:00');
    expect(trwa(kampania, d('2026-11-01T00:00:00+01:00'))).toBe(true);
    expect(trwa(kampania, TERAZ)).toBe(false);
  });

  it('do slotu trafiają włączone kampanie tego miejsca, niezakończone i zaczynające się w horyzoncie', () => {
    const wpisy = [
      k('trwa', '2026-11-01', '2026-12-01'),
      k('zakonczona', '2026-10-01', '2026-11-01'),
      k('za-tydzien', '2026-11-13', '2026-12-13'),
      k('za-rok', '2027-11-01', '2027-12-01'),
      k('inne-miejsce', '2026-11-01', '2026-12-01', ['artykul-bok']),
      k('wylaczona', '2026-11-01', '2026-12-01', ['glowna-gora'], false),
      k('a-trwa-tez', '2026-11-01', '2026-11-20'),
    ];
    expect(kampanieDlaMiejsca(wpisy, 'glowna-gora', TERAZ).map((x) => x.id)).toEqual(['a-trwa-tez', 'trwa', 'za-tydzien']);
  });

  it('bez JavaScriptu widać pierwszą trwającą, a gdy żadna nie trwa, autopromocję (-1)', () => {
    const lista = [k('przyszla', '2026-11-13', '2026-12-13'), k('trwa', '2026-11-01', '2026-12-01')];
    expect(widocznaBezSkryptu(lista, TERAZ)).toBe(1);
    expect(widocznaBezSkryptu(lista, d('2026-12-20'))).toBe(-1);
  });

  it('rotacja: los wybiera jedną z trwających, zakończone i przyszłe nie biorą udziału', () => {
    const lista = [k('a', '2026-11-01', '2026-12-01'), k('przyszla', '2026-11-13', '2026-12-13'), k('b', '2026-11-02', '2026-12-01')];
    expect(wybierz(lista, TERAZ, 0)).toBe(0);
    expect(wybierz(lista, TERAZ, 0.99)).toBe(2);
    expect(wybierz(lista, d('2026-11-20'), 0.5)).toBe(1);
    expect(wybierz(lista, d('2027-01-01'), 0.5)).toBe(-1);
  });
});
