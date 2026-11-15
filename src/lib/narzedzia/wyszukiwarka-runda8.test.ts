// Runda 8 (2026-11-15): hasła zaproponowane przez audyt „jakosc3” dla narzędzi spoza jego zakresu (raporty/jakosc3/RAPORT.md,
// „Dla orkiestratora”). Zapytanie trafia w narzędzie, które na nie odpowiada, a pytania o kamery dalej prowadzą do monitoringu.
import { describe, expect, it } from 'vitest';
import { przygotuj, szukaj } from '../szukaj-narzedzi';
import { indeksNarzedzi } from '../indeks-narzedzi';

const p = przygotuj(indeksNarzedzi());
const pierwszy = (q: string) => szukaj(p, q)[0]?.wpis.s;

describe('runda 8: hasła z audytu jakosc3', () => {
  it.each([
    ['toaleta w pracy', 'normy-sanitarne'],
    ['ile toalet w pracy', 'normy-sanitarne'],
    ['szatnia w pracy', 'normy-sanitarne'],
    ['szkoda na zdrowiu w pracy', 'odszkodowanie-za-wypadek-przy-pracy'],
    ['kara pieniezna potracenie z wyplaty', 'kara-porzadkowa'],
    ['potrącenie kary pieniężnej', 'kara-porzadkowa'],
    ['kamera w szatni', 'monitoring-w-pracy'],
    ['kamera w toalecie', 'monitoring-w-pracy'],
    ['zepsulem maszyne w pracy musze zaplacic', 'odpowiedzialnosc-materialna'],
  ])('„%s” → %s na pierwszym miejscu', (q, slug) => {
    expect(pierwszy(q)).toBe(slug);
  });
});

// Runda 9 (2026-11-15): hasła zaproponowane przez audyt „jakosc4” (raporty/jakosc4/RAPORT.md, „Dla orkiestratora”).
describe('runda 9: hasła z audytu jakosc4', () => {
  it.each([
    ['pozwać pracodawcę', 'sad-pracy-czy-pip'],
    ['pozwać o wypłatę', 'przedawnienie-wynagrodzenia'],
    ['wypłata za pierwszy dzień pracy', 'wynagrodzenie-za-niepelny-miesiac'],
    ['świadectwo pracy po odejściu z pracy', 'swiadectwo-pracy'],
    ['zwalniają mnie na L4', 'zwolnienie-na-l4'],
    ['powrót do pracy po zwolnieniu lekarskim', 'badania-lekarskie-w-pracy'],
    ['praca na zwolnieniu lekarskim', 'co-wolno-na-l4'],
    ['fundusz socjalny', 'fundusz-socjalny'],
    ['świadczenie urlopowe', 'swiadczenie-urlopowe'],
  ])('„%s” → %s na pierwszym miejscu', (q, slug) => {
    expect(pierwszy(q)).toBe(slug);
  });
});
