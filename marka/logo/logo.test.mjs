import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { czytajIco } from './ico.mjs';

// Komplet plików logo z sekcji 6 promptu i ich podstawowe własności.
const R = new URL('../../', import.meta.url);
const plik = (p) => new URL(p, R);

const SVG = ['jasne', 'ciemne', 'cb', 'cb-negatyw', 'kompakt-jasne', 'kompakt-ciemne', 'ikona', 'ikona-cb', 'ikona-mala'].map((n) => `marka/logo/svg/rytm-hali-${n}.svg`);
const RASTRY = {
  'marka/logo/png/favicon-16.png': [16, 16],
  'marka/logo/png/favicon-32.png': [32, 32],
  'marka/logo/png/favicon-48.png': [48, 48],
  'public/apple-touch-icon.png': [180, 180],
  'marka/logo/png/awatar-linkedin-400.png': [400, 400],
  'public/marka/ikona-512.png': [512, 512],
  'public/marka/logo.png': [600, 60],
};

const wymiaryPng = (b) => [b.readUInt32BE(16), b.readUInt32BE(20)];
const wymiaryJpg = (b) => {
  for (let i = 2; i < b.length; ) {
    const znacznik = b[i + 1];
    const dlugosc = b.readUInt16BE(i + 2);
    if (znacznik >= 0xc0 && znacznik <= 0xc2) return [b.readUInt16BE(i + 7), b.readUInt16BE(i + 5)];
    i += 2 + dlugosc;
  }
  return [0, 0];
};

describe('logo', () => {
  for (const p of SVG) {
    it(`${p}: tekst jako krzywe, pole rysunku, tytuł, bez zasobów zewnętrznych`, () => {
      const svg = readFileSync(plik(p), 'utf8');
      expect(svg).toMatch(/viewBox="[\d. ]+"/);
      expect(svg).toContain('<title>Rytm Hali</title>');
      expect(svg).not.toMatch(/<text|font-family|href=|<image/);
    });
  }

  for (const [p, [w, h]] of Object.entries(RASTRY)) {
    it(`${p} ma ${w}×${h} px`, () => {
      expect(wymiaryPng(readFileSync(plik(p)))).toEqual([w, h]);
    });
  }

  it('domyślna okładka udostępnień ma 1200×630 px', () => {
    expect(wymiaryJpg(readFileSync(plik('public/marka/okladka-domyslna.jpg')))).toEqual([1200, 630]);
  });

  it('favicon.ico zawiera obrazy 16, 32 i 48 px (PNG)', () => {
    expect(czytajIco(readFileSync(plik('public/favicon.ico')))).toEqual([
      { rozmiar: 16, png: true },
      { rozmiar: 32, png: true },
      { rozmiar: 48, png: true },
    ]);
  });

  it('favicon.svg to mała ikona (bez liter, czytelna w 16 px)', () => {
    expect(readFileSync(plik('public/favicon.svg'), 'utf8')).toBe(readFileSync(plik('marka/logo/svg/rytm-hali-ikona-mala.svg'), 'utf8'));
  });

  it('szablony mają kopie SVG do wstawiania w nagłówek i stopkę', () => {
    for (const n of ['jasne', 'ciemne', 'kompakt-jasne', 'kompakt-ciemne', 'ikona']) expect(existsSync(plik(`src/assets/logo/rytm-hali-${n}.svg`))).toBe(true);
  });
});
