// Wtyczki Markdowna dla silnika Sätteri (Astro 7: markdown.processor w astro.config.mjs). API: obiekt z nazwą
// i odwiedzającym węzły HTML (hast), jak wtyczki rehype, ale bez unified. Markdown mają tylko strony stałe
// (src/content/strony); wtyczki artykułów (przypisy, rysunki, miejsce reklamy) przeszły do historii git 2026-11-12.
import { czesciTypografii } from './typografia.mjs';

/**
 * Tabele: każda dostaje kontener <div class="tabela">, który przewija się w bok na telefonie (strona nie przewija się
 * w bok od 320 px). Tabela zachowuje semantykę, przewija się kontener; układ dodaje mu tabindex i opis, gdy trzeba.
 */
export const tabele = {
  name: 'rh-tabele',
  element: {
    filter: ['table'],
    visit(node, ctx) {
      ctx.wrapNode(node, { type: 'element', tagName: 'div', properties: { className: ['tabela'] }, children: [] });
    },
  },
};

const ADRES_SERWISU = /^https?:\/\/(www\.)?rytmhali\.pl(\/|$)/;

/** Linki zewnętrzne w stronach stałych: rel="noopener"; linki serwisu bez zmian. */
export const linki = {
  name: 'rh-linki',
  element: {
    filter: ['a'],
    visit(node, ctx) {
      const href = node.properties?.href;
      if (typeof href !== 'string' || !/^https?:\/\//.test(href) || ADRES_SERWISU.test(href)) return;
      ctx.setProperty(node, 'rel', ['noopener']);
    },
  },
};

// Śródtytuły bez twardych spacji: z ich tekstu powstają kotwice (id), a twarda spacja zmienia „fakty-i-źródła”
// w „fakty-iźródła” i psuje linki do sekcji.
const BEZ_TYPOGRAFII = new Set(['code', 'pre', 'kbd', 'samp', 'script', 'style', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

/**
 * Polska typografia w treści (src/lib/typografia.mjs): jednoliterowe słowa, liczby z jednostkami i skróty nie zostają
 * na końcu wiersza, a krótkie człony z dywizem („e-commerce”) się nie łamią. Bez kodu i śródtytułów.
 */
export const typografiaTekstu = {
  name: 'rh-typografia',
  text(node, ctx) {
    const rodzic = ctx.parent(node);
    for (let w = rodzic; w; w = ctx.parent(w)) if (w.type === 'element' && BEZ_TYPOGRAFII.has(w.tagName)) return;
    const ciagDalszy = ctx.indexOf(node) < (rodzic?.children?.length ?? 0) - 1;
    const czesci = czesciTypografii(node.value, { ciagDalszy });
    if (czesci.length === 1 && czesci[0].type === 'text' && czesci[0].value === node.value) return;
    ctx.replaceNode(node, czesci);
  },
};

export const WTYCZKI = [tabele, linki, typografiaTekstu];
