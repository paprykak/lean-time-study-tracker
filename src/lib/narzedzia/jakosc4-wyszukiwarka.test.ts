// Audyt „jakosc4” (2026-11-15): zapytania ludzi z hali o narzędzia z rundy 8 (raporty/jakosc4/*-wer.json). Każde
// zapytanie sprawdzone w obie strony: narzędzie trafia w pierwszą trójkę, a jego hasła nie zabierają pierwszego miejsca
// narzędziu, które lepiej odpowiada na inną sprawę. Hasła co-wolno-na-l4 testuje co-wolno-na-l4.test.ts.
import { describe, expect, it } from 'vitest';
import { przygotuj, szukaj } from '../szukaj-narzedzi';
import { indeksNarzedzi } from '../indeks-narzedzi';

const p = przygotuj(indeksNarzedzi());
const pierwszy = (q: string) => szukaj(p, q)[0]?.wpis.s;
const wsrod = (q: string, ile = 3) => szukaj(p, q, ile).map((w) => w.wpis.s);

describe('jakosc4: zapytania z hali trafiają w narzędzie', () => {
  it.each([
    // C-12
    ['przedawnienie urlopu', 'zalegly-urlop'],
    ['stary urlop', 'zalegly-urlop'],
    ['niewykorzystany urlop z 2024', 'zalegly-urlop'],
    // C-14
    ['na czarno', 'informacja-o-warunkach-zatrudnienia'],
    ['praca na czarno', 'informacja-o-warunkach-zatrudnienia'],
    ['dokumenty na start w pracy', 'informacja-o-warunkach-zatrudnienia'],
    ['zapoznanie z regulaminem pracy', 'informacja-o-warunkach-zatrudnienia'],
    ['kiedy dostane umowe', 'informacja-o-warunkach-zatrudnienia'],
  ])('„%s” → %s w pierwszej trójce', (q, slug) => expect(wsrod(q)).toContain(slug));
  it.each([
    // B-10, B-11, B-12
    ['wymowienie', 'okres-wypowiedzenia'],
    ['wypowiedzenie umowy na czas okreslony', 'okres-wypowiedzenia'],
    ['wolne na poszukiwanie pracy', 'okres-wypowiedzenia'],
    ['odejscie z pracy', 'okres-wypowiedzenia'],
    ['odprawa po 8 latach', 'kalkulator-odprawy'],
    ['odprawa przy porozumieniu stron', 'kalkulator-odprawy'],
    ['czy nalezy mi sie odprawa', 'kalkulator-odprawy'],
    ['ile pensji odprawy', 'kalkulator-odprawy'],
    ['dostalem nagane', 'kara-porzadkowa'],
    ['dostalam nagane', 'kara-porzadkowa'],
    ['dostalem upomnienie', 'kara-porzadkowa'],
  ])('„%s” → %s na pierwszym miejscu', (q, slug) => expect(pierwszy(q)).toBe(slug));
});

describe('jakosc4: hasła nie zabierają innych spraw', () => {
  it.each([
    ['urlop', 'kalkulator-urlopu'],
    ['urlop na zadanie', 'kalkulator-urlopu'],
    ['niewykorzystany urlop', 'ekwiwalent-za-urlop'],
    ['ekwiwalent za niewykorzystany urlop', 'ekwiwalent-za-urlop'],
    ['przedawnienie', 'przedawnienie-wynagrodzenia'],
    ['kara z regulaminu pracy', 'kara-porzadkowa'],
    ['kara porzadkowa', 'kara-porzadkowa'],
    ['nowa praca', 'informacja-o-warunkach-zatrudnienia'],
    ['praca bez umowy', 'informacja-o-warunkach-zatrudnienia'],
    ['umowa na czas okreslony', 'umowa-na-czas-okreslony'],
    ['czas okreslony', 'umowa-na-czas-okreslony'],
    ['wypowiedzenie przed emerytura', 'ochrona-przedemerytalna'],
    ['redukcja etatow', 'zwolnienia-grupowe'],
    ['porozumienie stron', 'zasilek-dla-bezrobotnych'],
    ['ile lat pracy', 'staz-pracy'],
    ['odprawa posmiertna', 'odprawa-posmiertna'],
    ['dostalem l4', 'kalkulator-l4'],
  ])('„%s” → %s na pierwszym miejscu', (q, slug) => expect(pierwszy(q)).toBe(slug));
});
