// Mapa strony a treści: które artykuły trafiają do sitemap i z jaką datą lastmod. Używa astro.config.mjs (integracja
// @astrojs/sitemap działa przed kolekcjami treści, więc czyta frontmatter plików Markdown wprost).
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'yaml';

/** Frontmatter pliku Markdown (blok YAML między liniami „---”). */
export function frontmatter(tekst) {
  const blok = tekst.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  return blok ? (parse(blok[1]) ?? {}) : {};
}

/** Wpis jest w mapie strony tylko, gdy jest opublikowany, nie testowy i bez noindex (jak doIndeksu w src/lib/tresci.ts). */
export const doMapy = (fm) => !fm.szkic && !fm.testowy && !fm.noindex;

/** Data ostatniej zmiany: aktualizacja, a bez niej publikacja (ISO 8601). */
export function lastmod(fm) {
  const data = fm.zaktualizowano ?? fm.opublikowano;
  if (!data) return undefined;
  const d = new Date(data);
  return Number.isNaN(d.valueOf()) ? undefined : d.toISOString();
}

/** Artykuły z katalogu treści: slug → { doMapy, lastmod }. */
export function artykulyMapy(katalog) {
  return new Map(
    readdirSync(katalog)
      .filter((f) => f.endsWith('.md'))
      .map((f) => {
        const fm = frontmatter(readFileSync(join(katalog, f), 'utf8'));
        return [f.replace(/\.md$/, ''), { doMapy: doMapy(fm), lastmod: lastmod(fm) }];
      }),
  );
}
