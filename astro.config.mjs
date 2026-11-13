// @ts-check
import { defineConfig } from 'astro/config';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { ADRES, PODGLAD, PORTAL } from './src/lib/srodowisko.mjs';
import { plikNaglowkow } from './src/lib/naglowki.mjs';
import { WTYCZKI } from './src/lib/markdown.mjs';
import { lastmodAdresu, narzedziaMapy, stronyMapy } from './src/lib/mapa.mjs';
import { zostaje } from './src/lib/przed-startem.mjs';

// Pamięć treści Astro (node_modules/.astro/data-store.json) czyści się po zmianie konfiguracji, ale kod wtyczek
// Markdowna do niej nie wchodzi (funkcji się nie serializuje), więc po zmianie wtyczki lokalny build pokazywał stary
// HTML. Skrót plików wtyczek w nazwie ostatniej wtyczki zmienia konfigurację i przebudowuje treści.
const WERSJA_WTYCZEK = createHash('sha256')
  .update(['./src/lib/markdown.mjs', './src/lib/typografia.mjs'].map((p) => readFileSync(new URL(p, import.meta.url), 'utf8')).join('\n'))
  .digest('hex')
  .slice(0, 12);

// Strony, które nigdy nie trafiają do mapy strony (mają noindex albo nie są treścią).
const POZA_MAPA = /\/(404|410|styleguide|admin|szukaj|podglad)(\/|$)|\/(newsletter|kontakt)\/./;
// lastmod: narzędzia z datą sprawdzenia z przepisami (rejestr), strony stałe z datą aktualizacji (src/lib/mapa.mjs).
const katalog = (/** @type {string} */ k) => fileURLToPath(new URL(k, import.meta.url));
const DATY = {
  narzedzia: narzedziaMapy(readFileSync(katalog('./src/data/narzedzia.ts'), 'utf8')),
  strony: stronyMapy(katalog('./src/content/strony/')),
};
/**
 * @param {string} adres
 * @returns {{ doMapy?: boolean, lastmod?: string }}
 */
const wMapie = (adres) => {
  const sciezka = new URL(adres).pathname.replace(/\/$/, '') || '/';
  if (POZA_MAPA.test(sciezka)) return { doMapy: false };
  // Przed startem w mapie są tylko strony, które zostają na produkcji (src/lib/przed-startem.mjs).
  if (!PORTAL) return zostaje(sciezka === '/' ? 'index.html' : `${sciezka.slice(1)}.html`) ? {} : { doMapy: false };
  const lastmod = lastmodAdresu(sciezka, DATY);
  return lastmod ? { lastmod } : {};
};

/**
 * Pliki w katalogu (rekurencyjnie), pełne ścieżki.
 * @param {string} kat
 * @returns {string[]}
 */
const pliki = (kat) =>
  readdirSync(kat).flatMap((n) => {
    const p = join(kat, n);
    return statSync(p).isDirectory() ? pliki(p) : [p];
  });

/**
 * Indeks wyszukiwarki Pagefind (statyczny, bez serwera) w dist/pagefind: tylko strony z data-pagefind-body
 * (strony narzędzi: opis, „Jak liczymy” i pytania). Przed startem produkcja go nie ma (nie ma portalu).
 */
const wyszukiwarka = () => ({
  name: 'rytm-hali:wyszukiwarka',
  hooks: {
    /** @param {{ dir: URL, logger: { info: (s: string) => void } }} opcje */
    'astro:build:done': async ({ dir, logger }) => {
      if (!PORTAL) return;
      const pagefind = await import('pagefind');
      const { index, errors } = await pagefind.createIndex({ forceLanguage: 'pl' });
      if (!index) throw new Error(`Pagefind: ${errors.join('; ')}`);
      const { page_count: strony = 0, errors: bledy = [] } = await index.addDirectory({ path: fileURLToPath(dir) });
      if (bledy.length) throw new Error(`Pagefind: ${bledy.join('; ')}`);
      await index.writeFiles({ outputPath: fileURLToPath(new URL('pagefind/', dir)) });
      await pagefind.close();
      logger.info(`indeks wyszukiwarki: ${strony} stron`);
    },
  },
});

/** Przed startem produkcja publikuje tylko „Wkrótce” i strony błędów (src/lib/przed-startem.mjs). */
const przedStartem = () => ({
  name: 'rytm-hali:przed-startem',
  hooks: {
    /** @param {{ dir: URL, logger: { info: (s: string) => void } }} opcje */
    'astro:build:done': ({ dir, logger }) => {
      if (PORTAL) return;
      const katalogDist = fileURLToPath(dir);
      const usuniete = pliki(katalogDist)
        .map((p) => relative(katalogDist, p).split(sep).join('/'))
        .filter((p) => !zostaje(p));
      for (const p of usuniete) rmSync(join(katalogDist, p));
      for (const k of readdirSync(katalogDist)) {
        const p = join(katalogDist, k);
        if (statSync(p).isDirectory() && pliki(p).length === 0) rmSync(p, { recursive: true });
      }
      logger.info(`przed startem: usunięto ${usuniete.length} plików portalu, zostaje strona „Wkrótce”`);
    },
  },
});

/** Zapisuje dist/_headers (nagłówki bezpieczeństwa i pamięci podręcznej) zależnie od trybu budowania. */
const naglowki = () => ({
  name: 'rytm-hali:naglowki',
  hooks: {
    /** @param {{ dir: URL }} opcje */
    'astro:build:done': ({ dir }) => {
      writeFileSync(new URL('_headers', dir), plikNaglowkow({ podglad: PODGLAD }));
    },
  },
});

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  site: ADRES,
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'always' },
  vite: {
    plugins: [tailwindcss()],
  },
  // Silnik Markdowna Astro 7 (Sätteri) z wtyczkami serwisu: tabele przewijane na telefonie, miejsce reklamy
  // po 3. akapicie, rel linków zewnętrznych (src/lib/markdown.mjs).
  // Bez podświetlania składni: Shiki wstawia style w atrybutach, które blokuje CSP z hashami. Kod w artykułach
  // to rzadkość (DECYZJE.md); gdy będzie potrzebny, Prism z klasami CSS.
  markdown: { syntaxHighlight: false, processor: satteri({ hastPlugins: WTYCZKI.map((w, i) => (i === WTYCZKI.length - 1 ? { ...w, name: `${w.name}-${WERSJA_WTYCZEK}` } : w)) }) },
  // CSP w <meta> z hashami każdego skryptu i stylu (bez 'unsafe-inline'). Reszta dyrektyw: src/lib/naglowki.mjs.
  security: {
    csp: {
      algorithm: 'SHA-256',
      directives: [
        "default-src 'self'",
        "img-src 'self' data:",
        "font-src 'self'",
        "connect-src 'self'",
        "media-src 'self'",
        "manifest-src 'self'",
        "worker-src 'self'",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
    },
  },
  integrations: [
    sitemap({
      filter: (strona) => wMapie(strona).doMapy !== false,
      serialize: (wpis) => {
        const lastmod = wMapie(wpis.url).lastmod;
        return lastmod ? { ...wpis, lastmod } : wpis;
      },
    }),
    naglowki(),
    wyszukiwarka(),
    przedStartem(),
  ],
});
