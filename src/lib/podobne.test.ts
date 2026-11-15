import { describe, expect, it } from 'vitest';
import { linkiZeStron, podobne } from './podobne';
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

  // Przed strojeniem z 15.11.2026 r. każde ze 113 narzędzi miało 5 podobnych; strojenie nie może tego odebrać.
  it('żadne narzędzie nie traci podobnych: wszystkie mają pełne 5', () => {
    expect(NARZEDZIA.filter((n) => podobne(n.slug, NARZEDZIA).length < 5).map((n) => n.slug)).toEqual([]);
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
    // Strojenie z 15.11.2026 r. (linki między stronami, akt po publikatorze, słowa ogólne):
    ['odpowiedzialnosc-materialna', 'kara-porzadkowa'],
    ['kara-porzadkowa', 'odpowiedzialnosc-materialna'],
    ['swiadectwo-pracy', 'odwolanie-do-sadu-pracy'],
    ['monitoring-w-pracy', 'kontrola-trzezwosci'],
    ['drogi-i-przejscia', 'skladowanie-w-magazynie'],
    ['drogi-i-przejscia', 'powierzchnia-na-pracownika'],
    ['skladowanie-w-magazynie', 'drogi-i-przejscia'],
    ['co-wolno-na-l4', 'kalkulator-l4'],
    ['kalkulator-l4', 'co-wolno-na-l4'],
    ['powierzchnia-na-pracownika', 'normy-sanitarne'],
    ['normy-sanitarne', 'powierzchnia-na-pracownika'],
    ['zasilek-dla-bezrobotnych', 'swiadectwo-pracy'],
    ['okres-probny', 'umowa-na-czas-okreslony'],
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
    // Słowa ogólne w długich hasłach z hali i w nazwach (pracodawca, służbowy, kontrola, wolno, świadczenie, monitor):
    ['odpowiedzialnosc-materialna', 'monitoring-w-pracy'],
    ['odpowiedzialnosc-materialna', 'informacja-o-warunkach-zatrudnienia'],
    ['monitoring-w-pracy', 'co-wolno-na-l4'],
    ['monitoring-w-pracy', 'dodatek-wyrownawczy'],
    ['monitoring-w-pracy', 'praca-w-ciazy'],
    ['dodatek-wyrownawczy', 'monitoring-w-pracy'],
    ['kalkulator-odprawy', 'monitoring-w-pracy'],
    ['wypowiedzenie-zmieniajace', 'monitoring-w-pracy'],
    ['przerwy-w-pracy', 'monitoring-w-pracy'],
    ['delegacja-krajowa', 'co-wolno-na-l4'],
    ['delegacja-zagraniczna', 'co-wolno-na-l4'],
    ['koszt-pracodawcy', 'co-wolno-na-l4'],
    ['ile-kg-wolno-dzwigac', 'co-wolno-na-l4'],
    ['kontrola-trzezwosci', 'co-wolno-na-l4'],
    ['kontrola-trzezwosci', 'kontrola-grafiku'],
    ['odwolanie-do-sadu-pracy', 'co-wolno-na-l4'],
    ['powierzchnia-na-pracownika', 'umowa-na-zastepstwo'],
    ['waznosc-uprawnien-sep', 'rodzic-w-pracy'],
    ['pracownik-niepelnosprawny', 'wynagrodzenie-za-niepelny-miesiac'],
    ['swiadczenie-urlopowe', 'swiadczenie-rehabilitacyjne'],
    ['zakaz-konkurencji', 'odszkodowanie-za-wypadek-przy-pracy'],
    ['dyzur-w-pracy', 'odpowiedzialnosc-materialna'],
    ['drogi-i-przejscia', 'odpowiedzialnosc-materialna'],
    ['okres-probny', 'okres-zasilkowy'],
  ])('%s ≁ %s', (a, b) => {
    expect(podobne(a, NARZEDZIA)).not.toContain(b);
  });

  // Bez linku wspólny jest tylko Kodeks pracy (poniżej progu); link z jednej strony liczy się w obie.
  it('link między stronami przybliża narzędzia w obie strony', () => {
    const bez = new Map<string, Set<string>>();
    const zLinkiem = new Map([['zakaz-konkurencji', new Set(['urlop-bezplatny'])]]);
    const wszystkie = NARZEDZIA.length;
    expect(podobne('zakaz-konkurencji', NARZEDZIA, wszystkie, bez)).not.toContain('urlop-bezplatny');
    expect(podobne('zakaz-konkurencji', NARZEDZIA, wszystkie, zLinkiem)).toContain('urlop-bezplatny');
    expect(podobne('urlop-bezplatny', NARZEDZIA, wszystkie, zLinkiem)).toContain('zakaz-konkurencji');
  });

  it('linki ze stron: slug z nazwy pliku, bez linku do samej siebie, bez adresów spoza narzędzi', () => {
    const linki = linkiZeStron({
      '../pages/narzedzia/a-b.astro': 'tekst <a href="/narzedzia/c-d">x</a>, <a href="/narzedzia/a-b">ta sama</a> i <a href="/o-nas">o nas</a>',
    });
    expect([...linki.get('a-b')!]).toEqual(['c-d']);
  });

  // ogolneBhp i ogolneBhpHala to ten sam akt (Dz.U. 2003 poz. 1650): bez rozpoznania po publikatorze drogi i przejścia
  // nie miały nic wspólnego z normami pomieszczeń.
  it('ten sam akt pod dwoma kluczami liczy się jako wspólny', () => {
    const bez = new Map<string, Set<string>>();
    expect(podobne('powierzchnia-na-pracownika', NARZEDZIA, 10, bez)).toContain('drogi-i-przejscia');
  });

  it('nieznany slug: pusta lista', () => {
    expect(podobne('nie-ma', NARZEDZIA)).toEqual([]);
  });
});
