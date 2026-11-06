import { describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';
import { artykulyMapy, doMapy, frontmatter, lastmod, listaWMapie, listy } from './mapa.mjs';

describe('mapa strony a artykuły', () => {
  it('czyta frontmatter z daty w formacie panelu', () => {
    expect(frontmatter('---\ntytul: "A: b"\nopublikowano: 2026-11-06\nszkic: true\n---\n\nTreść')).toEqual({ tytul: 'A: b', opublikowano: '2026-11-06', szkic: true });
    expect(frontmatter('Bez frontmattera')).toEqual({});
  });

  it('szkic, wpis testowy i noindex są poza mapą', () => {
    expect(doMapy({})).toBe(true);
    for (const pole of ['szkic', 'testowy', 'noindex']) expect(doMapy({ [pole]: true })).toBe(false);
  });

  it('lastmod to data aktualizacji, a bez niej publikacji', () => {
    expect(lastmod({ opublikowano: '2026-11-06' })).toBe('2026-11-06T00:00:00.000Z');
    expect(lastmod({ opublikowano: '2026-11-06', zaktualizowano: '2026-12-01' })).toBe('2026-12-01T00:00:00.000Z');
    expect(lastmod({})).toBeUndefined();
  });

  it('w buildzie testowym szkice i wpisy testowe liczą się jak opublikowane, noindex nigdy', () => {
    expect(doMapy({ szkic: true, testowy: true }, true)).toBe(true);
    expect(doMapy({ noindex: true }, true)).toBe(false);
  });

  it('strony list: temat od 3 artykułów, dział i autor od 1, lastmod z najnowszego', () => {
    const a = (dzial: string, tematy: string[], lm: string, mapa = true) => ({ doMapy: mapa, lastmod: lm, dzial, tematy, autorzy: ['redakcja'] });
    const l = listy(new Map([
      ['x', a('produkcja', ['oee', 'smed'], '2026-10-01T00:00:00.000Z')],
      ['y', a('produkcja', ['oee'], '2026-11-01T00:00:00.000Z')],
      ['z', a('produkcja', ['oee'], '2026-09-01T00:00:00.000Z')],
      ['w', a('dane-i-ai', ['smed'], '2026-11-02T00:00:00.000Z', false)],
    ]));
    expect(listaWMapie('/temat/oee', l)).toEqual({ doMapy: true, lastmod: '2026-11-01T00:00:00.000Z' });
    expect(listaWMapie('/temat/smed', l)?.doMapy).toBe(false);
    expect(listaWMapie('/dzial/produkcja/2', l)?.doMapy).toBe(true);
    expect(listaWMapie('/dzial/dane-i-ai', l)?.doMapy).toBe(false);
    expect(listaWMapie('/autor/redakcja', l)?.doMapy).toBe(true);
    expect(listaWMapie('/o-nas', l)).toBeUndefined();
  });

  it('wpis testowy z repozytorium nie trafia do mapy', () => {
    const mapa = artykulyMapy(fileURLToPath(new URL('../content/artykuly/', import.meta.url)));
    expect(mapa.get('testowy-przezbrojenie-smed')?.doMapy).toBe(false);
  });
});
