import { describe, expect, it } from 'vitest';
import { fileURLToPath } from 'node:url';
import { artykulyMapy, doMapy, frontmatter, lastmod } from './mapa.mjs';

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

  it('wpis testowy z repozytorium nie trafia do mapy', () => {
    const mapa = artykulyMapy(fileURLToPath(new URL('../content/artykuly/', import.meta.url)));
    expect(mapa.get('testowy-przezbrojenie-smed')?.doMapy).toBe(false);
  });
});
