import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';

// Każde zdjęcie w serwisie ma wpis w rejestrze licencji, a wpis ma komplet pól (sekcja 6 promptu, decyzja z 2026-11-06).
const rejestr = JSON.parse(readFileSync(new URL('../../marka/zdjecia/rejestr.json', import.meta.url), 'utf8'));
const pliki = readdirSync(new URL('../assets/zdjecia/', import.meta.url)).filter((f) => !f.startsWith('.'));
const LICENCJE = /^(CC0 1\.0|CC BY [234]\.0|Unsplash|Pexels)$/;

describe('rejestr zdjęć', () => {
  it('każdy plik w src/assets/zdjecia ma wpis w rejestrze', () => {
    const slugi = new Set(rejestr.zdjecia.map((z: { slug: string }) => z.slug));
    expect(pliki.filter((f) => !slugi.has(f.replace(/\.jpg$/, '')))).toEqual([]);
    for (const f of pliki) expect(f).toMatch(/^[a-z0-9-]+\.jpg$/);
  });

  for (const z of rejestr.zdjecia) {
    it(`${z.slug}: komplet pól, dozwolona licencja, podpis „Fot.”`, () => {
      for (const pole of ['slug', 'dzial', 'zrodlo', 'pobierz', 'autor', 'licencja', 'licencjaUrl', 'fot', 'alt', 'zgoda']) expect(z[pole], pole).toBeTruthy();
      expect(z.licencja).toMatch(LICENCJE);
      expect(z.fot).toMatch(/^Fot\. /);
      // CC BY wymaga zaznaczenia zmian; kadrujemy każde zdjęcie do 16:9, 16:10 i 1:1.
      if (z.licencja.startsWith('CC BY')) expect(z.fot).toContain('(kadr)');
      expect(z.alt.length).toBeGreaterThan(20);
      expect(z.zrodlo).toMatch(/^https:\/\//);
      expect(z.pobierz).toMatch(/^https:\/\//);
    });
  }
});
