import { describe, expect, it } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { LICENCJE } from './model';

// Każde zdjęcie w serwisie ma wpis w rejestrze licencji (kolekcja src/content/zdjecia), a wpis ma komplet pól.
// Schemat kolekcji sprawdza to samo przy buildzie; ten test daje czytelny komunikat od razu w `vitest`.
const KATALOG = new URL('../content/zdjecia/', import.meta.url);
const wpisy = readdirSync(KATALOG)
  .filter((f) => f.endsWith('.json'))
  .map((f) => ({ slug: f.replace(/\.json$/, ''), ...JSON.parse(readFileSync(new URL(f, KATALOG), 'utf8')) }));
const pliki = readdirSync(new URL('../assets/zdjecia/', import.meta.url)).filter((f) => !f.startsWith('.'));

describe('rejestr zdjęć', () => {
  it('każdy plik w src/assets/zdjecia ma wpis w rejestrze', () => {
    const wRejestrze = new Set(wpisy.map((w) => w.plik.split('/').at(-1)));
    expect(pliki.filter((f) => !wRejestrze.has(f))).toEqual([]);
  });

  for (const z of wpisy) {
    it(`${z.slug}: komplet pól, dozwolona licencja, podpis „Fot.”, plik na miejscu`, () => {
      for (const pole of ['plik', 'autor', 'licencja', 'fot', 'alt', 'zgoda']) expect(z[pole], pole).toBeTruthy();
      expect(z.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(LICENCJE).toContain(z.licencja);
      expect(z.fot).toMatch(/^Fot\. /);
      // CC BY wymaga zaznaczenia zmian; kadrujemy każde zdjęcie do 16:9, 16:10 i 1:1.
      if (z.licencja.startsWith('CC BY')) expect(z.fot).toContain('(kadr)');
      if (!['Własne redakcji', 'Partner (zgoda)'].includes(z.licencja)) expect(z.zrodlo).toMatch(/^https:\/\//);
      expect(z.alt.length).toBeGreaterThanOrEqual(20);
      // Ścieżka od katalogu projektu, tak jak zapisuje ją panel (media_folder w public/admin/config.yml).
      expect(z.plik).toMatch(/^\/src\/assets\/zdjecia\/[a-z0-9-]+\.(jpe?g|png|webp|avif)$/);
      expect(existsSync(new URL(`../..${z.plik}`, import.meta.url)), `brak pliku ${z.plik}`).toBe(true);
    });
  }
});
