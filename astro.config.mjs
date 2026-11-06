// @ts-check
import { defineConfig } from 'astro/config';
import { cpSync, existsSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { ADRES, PODGLAD, PORTAL, TESTOWE, WSZYSTKIE_TRESCI } from './src/lib/srodowisko.mjs';
import { plikNaglowkow } from './src/lib/naglowki.mjs';
import { WTYCZKI } from './src/lib/markdown.mjs';
import { artykulyMapy, listaWMapie, listy } from './src/lib/mapa.mjs';
import { zostaje } from './src/lib/przed-startem.mjs';

// Strony, które nigdy nie trafiają do mapy strony (mają noindex albo nie są treścią).
const POZA_MAPA = /\/(404|410|styleguide|admin|szukaj)(\/|$)|\/newsletter\/./;
// Artykuły (/<slug>): szkice, wpisy testowe i noindex poza mapą; lastmod z dat w treści (src/lib/mapa.mjs).
// Strony list (dział, temat, autor) w mapie od progu liczby artykułów, z datą najnowszego tekstu.
const katalog = (/** @type {string} */ k) => fileURLToPath(new URL(k, import.meta.url));
const ARTYKULY = artykulyMapy(
  WSZYSTKIE_TRESCI ? [katalog('./src/content/artykuly/'), katalog('./src/content/testowe/artykuly/')] : katalog('./src/content/artykuly/'),
  TESTOWE,
);
const LISTY = listy(ARTYKULY);
/**
 * @param {string} adres
 * @returns {{ doMapy?: boolean, lastmod?: string }}
 */
const wMapie = (adres) => {
  const sciezka = new URL(adres).pathname.replace(/\/$/, '') || '/';
  if (POZA_MAPA.test(sciezka)) return { doMapy: false };
  // Przed startem w mapie są tylko strony, które zostają na produkcji (src/lib/przed-startem.mjs).
  if (!PORTAL) return zostaje(sciezka === '/' ? 'index.html' : `${sciezka.slice(1)}.html`) ? {} : { doMapy: false };
  return ARTYKULY.get(sciezka.slice(1)) ?? listaWMapie(sciezka, LISTY) ?? {};
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

/** Pliki fikcyjnych materiałów do pobrania (src/content/testowe/pobierz) tylko w podglądzie i buildzie testowym. */
const plikiTestowe = () => ({
  name: 'rytm-hali:pliki-testowe',
  hooks: {
    /** @param {{ dir: URL }} opcje */
    'astro:build:done': ({ dir }) => {
      const zrodlo = katalog('./src/content/testowe/pobierz/');
      if (WSZYSTKIE_TRESCI && existsSync(zrodlo)) cpSync(zrodlo, fileURLToPath(new URL('pobierz/', dir)), { recursive: true });
    },
  },
});

/**
 * Indeks wyszukiwarki Pagefind (statyczny, bez serwera) w dist/pagefind: tylko strony z data-pagefind-body
 * (artykuły i materiały do pobrania). Przed startem produkcja go nie ma (nie ma portalu).
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
  markdown: { syntaxHighlight: false, processor: satteri({ hastPlugins: WTYCZKI }) },
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
    plikiTestowe(),
    wyszukiwarka(),
    przedStartem(),
  ],
});
