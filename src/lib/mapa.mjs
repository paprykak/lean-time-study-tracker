// Mapa strony: daty lastmod. Używa astro.config.mjs; integracja @astrojs/sitemap działa przed kolekcjami treści, a plik
// konfiguracji nie importuje TypeScriptu, więc czyta pliki wprost: rejestr narzędzi (src/data/narzedzia.ts, data
// „sprawdzono” = ostatnie sprawdzenie z przepisami) i frontmatter stron stałych (pole „zaktualizowano”).
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';

/** Frontmatter pliku Markdown (blok YAML między liniami „---”). */
export function frontmatter(tekst) {
  const blok = tekst.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  return blok ? (parse(blok[1]) ?? {}) : {};
}

/** Data w formacie ISO 8601 albo undefined. */
const iso = (data) => {
  if (!data) return undefined;
  const d = new Date(data);
  return Number.isNaN(d.valueOf()) ? undefined : d.toISOString();
};

/**
 * Narzędzia z tekstu rejestru: slug → data sprawdzenia (ISO). Każdy wpis rejestru ma slug, a po nim sprawdzono
 * (pilnuje src/lib/narzedzia/rejestr.test.ts); test mapy pilnuje, że liczba dat równa się liczbie slugów.
 * @param {string} tekst
 */
export function narzedziaMapy(tekst) {
  const czesc = tekst.slice(tekst.indexOf('export const NARZEDZIA'), tekst.indexOf('export const W_PRZYGOTOWANIU'));
  return new Map([...czesc.matchAll(/slug: '([a-z0-9-]+)'[\s\S]*?sprawdzono: '(\d{4}-\d{2}-\d{2})'/g)].map((m) => [m[1], iso(m[2])]));
}

/**
 * Strony stałe: slug → data aktualizacji (ISO). Projekty nowych brzmień (projekt-*.md) nie są stronami serwisu.
 * @param {string} katalog
 */
export function stronyMapy(katalog) {
  return new Map(
    readdirSync(katalog)
      .filter((f) => f.endsWith('.md') && !f.startsWith('projekt-'))
      .map((f) => [f.replace(/\.md$/, ''), iso(frontmatter(readFileSync(join(katalog, f), 'utf8')).zaktualizowano)]),
  );
}

/**
 * lastmod adresu: narzędzie ma datę sprawdzenia, strona stała datę aktualizacji, a strona główna i /narzedzia
 * datę najświeżej sprawdzonego narzędzia. Inne adresy bez daty.
 * @param {string} sciezka np. /narzedzia/kalkulator-l4
 * @param {{ narzedzia: Map<string, string | undefined>, strony: Map<string, string | undefined> }} dane
 */
export function lastmodAdresu(sciezka, { narzedzia, strony }) {
  if (sciezka === '/' || sciezka === '/narzedzia') return [...narzedzia.values()].filter(Boolean).sort().at(-1);
  const narzedzie = sciezka.match(/^\/narzedzia\/([a-z0-9-]+)$/);
  if (narzedzie) return narzedzia.get(narzedzie[1]);
  return strony.get(sciezka.slice(1));
}
