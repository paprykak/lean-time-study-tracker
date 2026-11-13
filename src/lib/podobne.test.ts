import { describe, expect, it } from 'vitest';
import { podobne } from './podobne';
import { NARZEDZIA } from '../data/narzedzia';

describe('podobne narzędzia', () => {
  it('najwyżej 5, bez samego siebie, tylko istniejące', () => {
    const slugi = new Set(NARZEDZIA.map((n) => n.slug));
    for (const n of NARZEDZIA) {
      const lista = podobne(n.slug, NARZEDZIA);
      expect(lista.length, n.slug).toBeLessThanOrEqual(5);
      expect(lista).not.toContain(n.slug);
      for (const s of lista) expect(slugi.has(s)).toBe(true);
    }
  });

  it('każde narzędzie ma choć jednego sąsiada', () => {
    expect(NARZEDZIA.filter((n) => podobne(n.slug, NARZEDZIA).length === 0).map((n) => n.slug)).toEqual([]);
  });

  it.each([
    ['kalkulator-l4', 'okres-zasilkowy'],
    ['kalkulator-urlopu', 'ekwiwalent-za-urlop'],
    ['waznosc-uprawnien-udt', 'badania-udt'],
    ['halas-w-pracy', 'drgania-w-pracy'],
    ['kalkulator-nadgodzin', 'wyplata-z-nadgodzinami'],
  ])('%s → %s wśród podobnych', (a, b) => {
    expect(podobne(a, NARZEDZIA)).toContain(b);
  });

  it('nieznany slug: pusta lista', () => {
    expect(podobne('nie-ma', NARZEDZIA)).toEqual([]);
  });
});
