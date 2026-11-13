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
    ['kalkulator-l4', 'l4-po-zwolnieniu'],
    ['kalkulator-urlopu', 'ekwiwalent-za-urlop'],
    ['waznosc-uprawnien-udt', 'badania-udt'],
    ['halas-w-pracy', 'drgania-w-pracy'],
    ['kalkulator-nadgodzin', 'wyplata-z-nadgodzinami'],
    ['zwrot-podatku-pit-37', 'ulga-na-dzieci'],
    ['czas-jazdy-kierowcy', 'dyzur-kierowcy'],
    ['kod-95', 'badania-kierowcy'],
    ['praca-w-sobote', 'praca-w-niedziele'],
    ['renta-z-tytulu-niezdolnosci-do-pracy', 'dorabianie-do-renty'],
    ['urlop-w-godzinach', 'rownowazny-czas-pracy'],
    ['praca-cudzoziemca', 'zgloszenie-pracy-cudzoziemca'],
  ])('%s → %s wśród podobnych', (a, b) => {
    expect(podobne(a, NARZEDZIA)).toContain(b);
  });

  // Fałszywe powiązania przez wspólny początek słowa albo przymiotnik (powierzchnia ~ powierzenie, kierowca zawodowy ~
  // choroba zawodowa, świadectwo pracy ~ świadectwo kwalifikacji, limit dorabiania ~ limit pracy tymczasowej).
  it.each([
    ['powierzchnia-na-pracownika', 'praca-cudzoziemca'],
    ['choroba-zawodowa', 'kod-95'],
    ['staz-pracy', 'kod-95'],
    ['limit-pracy-tymczasowej', 'dorabianie-do-renty'],
    ['urlop-szkoleniowy', 'dni-wolne-od-pracy'],
    ['emerytura-pomostowa', 'doba-pracownicza'],
    ['odziez-robocza', 'dni-robocze'],
  ])('%s ≁ %s', (a, b) => {
    expect(podobne(a, NARZEDZIA)).not.toContain(b);
  });

  it('nieznany slug: pusta lista', () => {
    expect(podobne('nie-ma', NARZEDZIA)).toEqual([]);
  });
});
