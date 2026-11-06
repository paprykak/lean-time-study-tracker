import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { bloki, fogPl, kontrolaTekstu, sylaby, zdania } from './kontrola-tekstu.mjs';
import { frontmatter } from './mapa.mjs';

const ZRODLA = [{ opis: 'GUS, Rocznik statystyczny przemysłu', adres: 'https://stat.gov.pl', rodzaj: 'Dane publiczne' }];
const sprawdz = (body: string, fm: Record<string, unknown> = { zrodla: ZRODLA }) => kontrolaTekstu({ body, frontmatter: fm });

describe('kontrola tekstu: przypisy i źródła', () => {
  it('poprawny tekst: liczba z przypisem, źródło zacytowane', () => {
    expect(sprawdz('Przetwórstwo daje 18,5% wartości dodanej [1].').bledy).toEqual([]);
  });

  it('przypis bez źródła i źródło bez przypisu to błędy', () => {
    const { bledy } = sprawdz('Zdanie z przypisem [2].');
    expect(bledy).toContain('przypis [2] nie ma źródła (lista „Źródła” ma 1 pozycji)');
    expect(bledy.some((b) => b.startsWith('źródło 1'))).toBe(true);
  });

  it('liczba bez źródła to błąd, chyba że to oznaczony przykład na danych fikcyjnych', () => {
    expect(sprawdz('Firmy tracą 30% czasu na przezbrojenia. [1] jest gdzie indziej.\n\nDrugi akapit [1].').bledy).toEqual([]);
    const bez = sprawdz('Firmy tracą 30% czasu na przezbrojenia.\n\nInny akapit [1].');
    expect(bez.bledy[0]).toMatch(/^liczba bez źródła: „Firmy tracą 30% czasu/);
    expect(sprawdz('Przykład na danych fikcyjnych: linia traci 30% czasu.\n\nAkapit [1].').bledy).toEqual([]);
  });

  it('tabelę z liczbami może opisać akapit przed nią (przypis albo fikcja)', () => {
    const tabela = '| Czynność | Udział |\n| --- | --- |\n| Czekanie | 40% |';
    expect(sprawdz(`Struktura strat w badaniu [1]:\n\n${tabela}`).bledy).toEqual([]);
    expect(sprawdz(`Struktura strat:\n\n${tabela}\n\nAkapit [1].`).bledy.some((b) => b.startsWith('liczba bez źródła'))).toBe(true);
  });

  it('przypisy zapisane przez panel z ukośnikami liczą się tak samo', () => {
    expect(sprawdz('Udział 18,5% \\[1\\].').bledy).toEqual([]);
  });
});

describe('kontrola tekstu: język', () => {
  it('frazy z tekstów generowanych to błąd, frazy podejrzane to uwaga', () => {
    const { bledy, uwagi } = sprawdz('Warto zauważyć, że synergia działa [1].');
    expect(bledy).toContain('fraza z tekstów generowanych: „warto zauważyć”');
    expect(uwagi.some((u) => u.includes('synergi'))).toBe(true);
  });

  it('miejsce do uzupełnienia blokuje tylko tekst do publikacji', () => {
    const body = 'Akapit [1]. [DO UZUPEŁNIENIA: przykład z praktyki]';
    expect(sprawdz(body, { zrodla: ZRODLA, szkic: true }).bledy).toEqual([]);
    expect(sprawdz(body, { zrodla: ZRODLA }).bledy).toContain('w tekście do publikacji zostało miejsce [DO UZUPEŁNIENIA]');
  });

  it('zdania: skróty nie dzielą zdania, koniec zdania po „r.” tak', () => {
    expect(zdania('Firmy, np. Toyota, mierzą czas. Dane z Dz. U. 2018 poz. 1914 są jawne.')).toHaveLength(2);
    expect(zdania('Badanie z 2023 r. Potem kolejne.')).toHaveLength(2);
    expect(zdania('Metodę opisał S. Shingo w 1985 r. i rozwinęli ją inni.')).toHaveLength(1);
  });

  it('sylaby i FOG-PL', () => {
    expect([sylaby('nie'), sylaby('operacji'), sylaby('przezbrojenie'), sylaby('kierownik')]).toEqual([1, 4, 4, 3]);
    expect(fogPl('Krótkie zdanie. Drugie też.')).toBeLessThan(5);
    expect(fogPl('Niewystarczająca standaryzacja przezbrojeń powoduje nieprzewidywalne opóźnienia produkcyjne.')).toBeGreaterThan(15);
  });

  it('bloki: rozpoznaje śródtytuł, listę, tabelę, cytat i obraz', () => {
    expect(bloki('## A\n\n- x\n\n| a |\n\n> c\n\n![o](p.png)\n\nTekst').map((b) => b.rodzaj)).toEqual(['naglowek', 'lista', 'tabela', 'cytat', 'obraz', 'akapit']);
  });
});

// Każdy artykuł, który nie jest testowy, przechodzi kontrolę bez błędów (także szkice z przepływu redakcyjnego).
describe('artykuły w repozytorium', () => {
  const katalog = new URL('../content/artykuly/', import.meta.url);
  for (const plik of readdirSync(katalog).filter((f) => f.endsWith('.md'))) {
    const tekst = readFileSync(new URL(plik, katalog), 'utf8');
    const fm = frontmatter(tekst);
    const body = tekst.replace(/^---\n[\s\S]*?\n---\n?/, '');
    it.skipIf(fm.testowy)(`${plik}: kontrola tekstu bez błędów`, () => {
      expect(kontrolaTekstu({ body, frontmatter: fm }).bledy).toEqual([]);
    });
  }
});
