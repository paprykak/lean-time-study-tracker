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

/**
 * Wpis jest w mapie strony, gdy jest opublikowany, nie testowy i bez noindex (jak doIndeksu w src/lib/tresci.ts).
 * W buildzie testowym szkice i wpisy testowe liczą się jak opublikowane.
 */
export const doMapy = (fm, testowe = false) => !fm.noindex && (testowe || (!fm.szkic && !fm.testowy));

/** Data ostatniej zmiany: aktualizacja, a bez niej publikacja (ISO 8601). */
export function lastmod(fm) {
  const data = fm.zaktualizowano ?? fm.opublikowano;
  if (!data) return undefined;
  const d = new Date(data);
  return Number.isNaN(d.valueOf()) ? undefined : d.toISOString();
}

/**
 * Artykuły z katalogów treści: slug → { doMapy, lastmod, dzial, tematy, autorzy }.
 * @param {string | string[]} katalogi
 * @param {boolean} [testowe]
 */
export function artykulyMapy(katalogi, testowe = false) {
  return new Map(
    [katalogi].flat().flatMap((katalog) =>
      readdirSync(katalog)
        .filter((f) => f.endsWith('.md'))
        .map((f) => {
          const fm = frontmatter(readFileSync(join(katalog, f), 'utf8'));
          return [f.replace(/\.md$/, ''), { doMapy: doMapy(fm, testowe), lastmod: lastmod(fm), dzial: fm.dzial, tematy: fm.tematy ?? [], autorzy: fm.autorzy ?? [] }];
        }),
    ),
  );
}

/**
 * Od ilu artykułów strona listy jest indeksowana i trafia do mapy strony. Temat z jednym, dwoma tekstami to cienka
 * strona (powiela artykuł), więc ma noindex, dopóki nie zbierze trzech; dział i autor od pierwszego tekstu.
 */
export const PROGI = { dzial: 1, temat: 3, autor: 1 };

/** Liczba artykułów (z mapy strony) w każdym dziale, temacie i u każdego autora, z datą najnowszej zmiany. */
export function listy(artykuly) {
  const wynik = { dzial: new Map(), temat: new Map(), autor: new Map() };
  const dodaj = (mapa, klucz, lm) => {
    const b = mapa.get(klucz) ?? { liczba: 0, lastmod: undefined };
    mapa.set(klucz, { liczba: b.liczba + 1, lastmod: !b.lastmod || (lm && lm > b.lastmod) ? lm : b.lastmod });
  };
  for (const a of artykuly.values()) {
    if (!a.doMapy) continue;
    if (a.dzial) dodaj(wynik.dzial, a.dzial, a.lastmod);
    for (const t of a.tematy) dodaj(wynik.temat, t, a.lastmod);
    for (const x of a.autorzy) dodaj(wynik.autor, x, a.lastmod);
  }
  return wynik;
}

/** Strona listy (/dzial/x, /dzial/x/2, /temat/x, /autor/x): czy w mapie strony i z jaką datą; undefined dla innych stron. */
export function listaWMapie(sciezka, liczby) {
  const m = sciezka.match(/^\/(dzial|temat|autor)\/([a-z0-9-]+)(?:\/\d+)?$/);
  if (!m) return undefined;
  const dane = liczby[m[1]].get(m[2]);
  return { doMapy: (dane?.liczba ?? 0) >= PROGI[m[1]], lastmod: dane?.lastmod };
}
