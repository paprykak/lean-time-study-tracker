import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import fontverter from 'fontverter';
import opentype from 'opentype.js';
import { ZNAKI, POLSKIE, unicodeRange } from './znaki.mjs';

// Fonty hostowane u siebie mają mieć wszystkie znaki z zestawu (polskie litery, cudzysłowy „”, myślniki, €),
// a @font-face ma deklarować dokładnie ten zakres, żeby przeglądarka nie pobierała fontu na darmo.
const KATALOG = new URL('../../src/assets/fonty/', import.meta.url);
const PLIKI = { 'noto-sans.woff2': 'wght 400–700', 'noto-sans-italic.woff2': 'wght 400–700', 'noto-sans-display-700.woff2': '700' };

async function wczytaj(nazwa) {
  const sfnt = await fontverter.convert(readFileSync(new URL(nazwa, KATALOG)), 'sfnt');
  return opentype.parse(sfnt.buffer.slice(sfnt.byteOffset, sfnt.byteOffset + sfnt.byteLength));
}

describe('fonty Noto', () => {
  for (const [nazwa, waga] of Object.entries(PLIKI)) {
    it(`${nazwa} (${waga}) ma glify dla wszystkich znaków zestawu`, async () => {
      const font = await wczytaj(nazwa);
      const brak = [...ZNAKI].filter((z) => z.trim() && font.charToGlyphIndex(z) === 0);
      expect(brak).toEqual([]);
      for (const z of POLSKIE) expect(font.charToGlyphIndex(z)).toBeGreaterThan(0);
    });

    it(`${nazwa} waży mniej niż 40 KB`, () => {
      expect(readFileSync(new URL(nazwa, KATALOG)).length).toBeLessThan(40 * 1024);
    });
  }

  it('fonty.css deklaruje unicode-range zgodny z zestawem znaków i font-display: optional', () => {
    const css = readFileSync(new URL('../../src/styles/fonty.css', import.meta.url), 'utf8');
    const zakresy = [...css.matchAll(/unicode-range: ([^;]+);/g)].map((m) => m[1]);
    expect(zakresy).toHaveLength(3);
    for (const z of zakresy) expect(z).toBe(unicodeRange());
    expect([...css.matchAll(/font-display: (\w+);/g)].map((m) => m[1])).toEqual(['optional', 'optional', 'optional']);
  });

  it('licencja OFL jest publikowana razem z fontami', () => {
    expect(readFileSync(new URL('../../public/fonty/OFL.txt', import.meta.url), 'utf8')).toContain('SIL OPEN FONT LICENSE');
  });
});
