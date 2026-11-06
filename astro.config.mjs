// @ts-check
import { defineConfig } from 'astro/config';
import { writeFileSync } from 'node:fs';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { ADRES, PODGLAD } from './src/lib/srodowisko.mjs';
import { plikNaglowkow } from './src/lib/naglowki.mjs';

// Strony, które nigdy nie trafiają do mapy strony (mają noindex albo nie są treścią).
const POZA_MAPA = /\/(404|410|styleguide|admin|podglad)(\/|$)/;

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
  // Bez podświetlania składni: Shiki wstawia style w atrybutach, które blokuje CSP z hashami. Kod w artykułach
  // to rzadkość (DECYZJE.md); gdy będzie potrzebny, Prism z klasami CSS.
  markdown: { syntaxHighlight: false },
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
      filter: (strona) => !POZA_MAPA.test(new URL(strona).pathname),
    }),
    naglowki(),
  ],
});
