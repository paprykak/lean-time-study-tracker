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
