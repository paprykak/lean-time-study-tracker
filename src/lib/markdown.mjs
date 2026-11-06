// Wtyczki Markdowna dla silnika Sätteri (Astro 7: markdown.processor w astro.config.mjs). API: obiekt z nazwą
// i odwiedzającym węzły HTML (hast), jak wtyczki rehype, ale bez unified.
import { czesciTypografii } from './typografia.mjs';

/** Znacznik miejsca reklamy w treści. Stronę artykułu dzieli w tym miejscu src/components/artykul/TrescArtykulu.astro. */
export const ZNACZNIK_REKLAMY = 'rh:miejsce-reklamy';

/** Najwcześniej po którym akapicie treści może stać reklama (prompt F3: po 3. akapicie). */
export const AKAPIT_REKLAMY = 3;

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

const tekst = (wezel) => (wezel.type === 'text' ? wezel.value : (wezel.children ?? []).map(tekst).join(''));
const istotny = (wezel) => wezel.type === 'element' || (wezel.type === 'text' && wezel.value.trim() !== '');

/**
 * Miejsce reklamy: znacznik (komentarz HTML) po 3. akapicie najwyższego poziomu. Akapit kończący się dwukropkiem
 * zapowiada listę albo tabelę, więc reklama idzie po następnym akapicie. Bez miejsca, gdy po akapicie nic nie ma
 * (krótki tekst nie kończy się reklamą).
 */
export const miejsceReklamy = {
  name: 'rh-miejsce-reklamy',
  after(root, ctx) {
    const dzieci = root.children;
    let akapity = 0;
    for (let i = 0; i < dzieci.length; i++) {
      const w = dzieci[i];
      if (w.type !== 'element' || w.tagName !== 'p') continue;
      akapity++;
      if (akapity < AKAPIT_REKLAMY || tekst(w).trim().endsWith(':')) continue;
      if (!dzieci.slice(i + 1).some(istotny)) return;
      ctx.insertAfter(w, { type: 'comment', value: ZNACZNIK_REKLAMY });
      return;
    }
  },
};

const ADRES_SERWISU = /^https?:\/\/(www\.)?rytmhali\.pl(\/|$)/;

/**
 * Linki zewnętrzne: w materiale partnera (pole „partner” we frontmatterze) mają rel="sponsored noopener"
 * (wytyczne Google dla treści sponsorowanych), w pozostałych tekstach rel="noopener".
 */
export const linki = {
  name: 'rh-linki',
  element: {
    filter: ['a'],
    visit(node, ctx) {
      const href = node.properties?.href;
      if (typeof href !== 'string' || !/^https?:\/\//.test(href) || ADRES_SERWISU.test(href)) return;
      const partner = Boolean(ctx.data?.astro?.frontmatter?.partner);
      ctx.setProperty(node, 'rel', partner ? ['sponsored', 'noopener'] : ['noopener']);
    },
  },
};

/** Przypis w treści: [1], [1, 3] albo [2–4]. Panel może zapisać nawiasy z ukośnikiem (\\[1\\]); w drzewie HTML ich już nie ma. */
export const PRZYPIS = /\[(\d{1,2}(?:\s*[,–-]\s*\d{1,2})*)\]/g;

/** Numery z treści przypisu: „1, 3” → [1, 3], „2–4” → [2, 3, 4]. */
export function numeryPrzypisu(tresc) {
  return tresc.split(/\s*,\s*/).flatMap((czesc) => {
    const [od, doN] = czesc.split(/\s*[–-]\s*/).map(Number);
    if (doN === undefined) return [od];
    return od <= doN && doN - od < 20 ? Array.from({ length: doN - od + 1 }, (_, i) => od + i) : [od, doN];
  });
}

const BEZ_PRZYPISOW = new Set(['a', 'code', 'pre', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

/**
 * Przypisy: [n] w tekście staje się odsyłaczem do n-tego źródła na liście „Źródła” (id „zrodlo-n”).
 * Każda liczba i każde badanie w artykule ma przypis (skill /artykul, kontrola w src/lib/kontrola-tekstu.mjs).
 */
export const przypisy = {
  name: 'rh-przypisy',
  text(node, ctx) {
    if (!PRZYPIS.test(node.value)) return;
    PRZYPIS.lastIndex = 0;
    const rodzic = ctx.parent(node);
    if (rodzic?.type === 'element' && BEZ_PRZYPISOW.has(rodzic.tagName)) return;
    const czesci = [];
    let ostatni = 0;
    for (const m of node.value.matchAll(PRZYPIS)) {
      if (m.index > ostatni) czesci.push({ type: 'text', value: node.value.slice(ostatni, m.index) });
      const numery = numeryPrzypisu(m[1]);
      const odsylacze = numery.flatMap((n, i) => [
        ...(i > 0 ? [{ type: 'text', value: ', ' }] : []),
        { type: 'element', tagName: 'a', properties: { href: `#zrodlo-${n}`, ariaLabel: `Źródło ${n}` }, children: [{ type: 'text', value: String(n) }] },
      ]);
      czesci.push({
        type: 'element',
        tagName: 'sup',
        properties: { className: ['przypis'] },
        children: [{ type: 'text', value: '[' }, ...odsylacze, { type: 'text', value: ']' }],
      });
      ostatni = m.index + m[0].length;
    }
    if (ostatni < node.value.length) czesci.push({ type: 'text', value: node.value.slice(ostatni) });
    ctx.replaceNode(node, czesci);
  },
};

/**
 * Rysunek z podpisem: akapit z samym obrazem, który ma tytuł (![opis](plik "Rysunek 1. Wniosek. Źródło: …")),
 * staje się <figure> z <figcaption>. Opis w nawiasach kwadratowych zostaje tekstem alternatywnym.
 */
export const rysunki = {
  name: 'rh-rysunki',
  element: {
    filter: ['p'],
    visit(node, ctx) {
      const istotne = (node.children ?? []).filter((d) => d.type !== 'text' || d.value.trim() !== '');
      const [obraz] = istotne;
      const podpis = obraz?.properties?.title;
      if (istotne.length !== 1 || obraz.type !== 'element' || obraz.tagName !== 'img' || typeof podpis !== 'string' || !podpis.trim()) return;
      const { title: _, ...wlasciwosci } = obraz.properties;
      ctx.replaceNode(node, {
        type: 'element',
        tagName: 'figure',
        properties: { className: ['rysunek'] },
        children: [
          { type: 'element', tagName: 'img', properties: wlasciwosci, children: [] },
          { type: 'element', tagName: 'figcaption', properties: {}, children: [{ type: 'text', value: podpis.trim() }] },
        ],
      });
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

export const WTYCZKI = [tabele, rysunki, przypisy, miejsceReklamy, linki, typografiaTekstu];
