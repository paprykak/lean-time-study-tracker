import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { frontmatter, lastmodAdresu, narzedziaMapy, stronyMapy } from './mapa.mjs';
import { NARZEDZIA } from '../data/narzedzia';

const rejestr = readFileSync(new URL('../data/narzedzia.ts', import.meta.url), 'utf8');

describe('mapa strony: daty lastmod', () => {
  it('czyta frontmatter z daty w formacie panelu', () => {
    expect(frontmatter('---\ntytul: "A: b"\nzaktualizowano: 2026-11-06\nprojekt: true\n---\n\nTreść')).toEqual({ tytul: 'A: b', zaktualizowano: '2026-11-06', projekt: true });
    expect(frontmatter('Bez frontmattera')).toEqual({});
  });

  it('każde narzędzie z rejestru ma w mapie swoją datę sprawdzenia (odczyt tekstu rejestru zgadza się z modułem)', () => {
    const mapa = narzedziaMapy(rejestr);
    expect(mapa.size).toBe(NARZEDZIA.length);
    for (const n of NARZEDZIA) expect(mapa.get(n.slug), n.slug).toBe(new Date(`${n.sprawdzono}T00:00:00Z`).toISOString());
  });

  it('strony stałe z datą aktualizacji, bez projektów nowych brzmień', () => {
    const strony = stronyMapy(fileURLToPath(new URL('../content/strony/', import.meta.url)));
    expect(strony.get('o-nas')).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect([...strony.keys()].some((k) => k.startsWith('projekt-'))).toBe(false);
  });

  it('strona główna i /narzedzia: najświeższe sprawdzenie; inne adresy bez daty', () => {
    const dane = { narzedzia: new Map([['a', '2026-11-01T00:00:00.000Z'], ['b', '2026-11-12T00:00:00.000Z']]), strony: new Map([['o-nas', '2026-11-07T00:00:00.000Z']]) };
    expect(lastmodAdresu('/', dane)).toBe('2026-11-12T00:00:00.000Z');
    expect(lastmodAdresu('/narzedzia', dane)).toBe('2026-11-12T00:00:00.000Z');
    expect(lastmodAdresu('/narzedzia/a', dane)).toBe('2026-11-01T00:00:00.000Z');
    expect(lastmodAdresu('/o-nas', dane)).toBe('2026-11-07T00:00:00.000Z');
    expect(lastmodAdresu('/szukaj', dane)).toBeUndefined();
  });
});
