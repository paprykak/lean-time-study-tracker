// Wtyczki Markdowna dla silnika Sätteri (Astro 7: markdown.processor w astro.config.mjs). API: obiekt z nazwą
// i odwiedzającym węzły HTML (hast), jak wtyczki rehype, ale bez unified.

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

export const WTYCZKI = [tabele, miejsceReklamy, linki];
