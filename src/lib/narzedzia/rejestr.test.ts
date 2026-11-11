// Spójność rejestru narzędzi i przepisów: każde narzędzie ma stronę, każdy przepis istnieje, płaca minimalna
// jest wpisana na bieżący rok, a żadne sprawdzenie u źródła nie jest starsze niż 15 miesięcy (dane prawne się
// starzeją: nowa płaca minimalna co roku we wrześniu, nowe teksty jednolite).
import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { AKTY, LATA, OBJASNIENIA, PLACA_MINIMALNA } from '../../data/prawo';
import { KATEGORIE, NARZEDZIA, W_PRZYGOTOWANIU } from '../../data/narzedzia';

const dzis = new Date();
const MAKS_WIEK_DNI = 455;
const wiekDni = (data: string) => (dzis.valueOf() - Date.parse(`${data}T00:00:00Z`)) / 86_400_000;

describe('rejestr narzędzi', () => {
  it('slugi są unikalne i mają postać adresu', () => {
    const slugi = NARZEDZIA.map((n) => n.slug);
    expect(new Set(slugi).size).toBe(slugi.length);
    for (const s of slugi) expect(s).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });
  it.each(NARZEDZIA.map((n) => [n.slug, n]))('%s: strona, przepisy, kategoria, opis, data', (slug, n) => {
    expect(existsSync(`src/pages/narzedzia/${slug}.astro`), `brak src/pages/narzedzia/${slug}.astro`).toBe(true);
    expect(KATEGORIE[n.kategoria]).toBeDefined();
    for (const p of n.przepisy) expect(AKTY[p], `nieznany przepis ${p}`).toBeDefined();
    expect(n.krotko.length).toBeLessThanOrEqual(110);
    expect(wiekDni(n.sprawdzono)).toBeLessThan(MAKS_WIEK_DNI);
  });
  it('narzędzie w przygotowaniu nie dubluje gotowego', () => {
    const gotowe = new Set(NARZEDZIA.map((n) => n.nazwa));
    for (const w of W_PRZYGOTOWANIU) expect(gotowe.has(w.nazwa)).toBe(false);
  });
});

describe('rejestr przepisów', () => {
  it('płaca minimalna jest wpisana na bieżący rok (rozporządzenie wychodzi do 15 września roku poprzedniego)', () => {
    expect(PLACA_MINIMALNA[dzis.getUTCFullYear()], `dopisz płacę minimalną na ${dzis.getUTCFullYear()} w src/data/prawo.ts`).toBeDefined();
  });
  it('każda płaca minimalna wskazuje istniejący akt, lata idą po kolei', () => {
    for (const [rok, p] of Object.entries(PLACA_MINIMALNA)) {
      expect(AKTY[p.akt]).toBeDefined();
      expect(AKTY[p.akt].nazwa).toContain(rok);
    }
    expect(LATA).toEqual(Array.from({ length: LATA.length }, (_, i) => LATA[0] + i));
  });
  it.each([...Object.entries(AKTY), ...Object.entries(OBJASNIENIA)])('%s: adres i sprawdzenie nie starsze niż 15 miesięcy', (_, a) => {
    expect(a.adres).toMatch(/^https:\/\//);
    expect(wiekDni(a.sprawdzono)).toBeGreaterThanOrEqual(-1);
    expect(wiekDni(a.sprawdzono), `sprawdź ponownie ${a.nazwa} u źródła i zmień datę`).toBeLessThan(MAKS_WIEK_DNI);
  });
});
