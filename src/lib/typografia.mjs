// Polska typografia tekstu widocznego na stronie: jednoliterowe słowa (a, i, o, u, w, z) nie zostają na końcu wiersza,
// liczba nie odrywa się od jednostki ani skrót od tego, co po nim („2017 r.”, „47 min”, „12 500 zł”, „art. 14”),
// półpauza nie zaczyna wiersza, a krótki człon przed dywizem („e-commerce”, „50-osobowy”) nie zostaje sam.
// Tylko w treści strony: <title>, opisy i dane strukturalne zostają bez twardych spacji.

export const NBSP = ' ';
/** Klasa elementu, który nie łamie się w środku (src/styles/global.css). */
export const NIEROZDZIELNIE = 'nierozdzielnie';

const ODSTEP = '[ \\t\\n\\u00A0]+';
const JEDNOLITEROWE = new RegExp(`(?<=^|[\\s(„"'‚])([aiouwzAIOUWZ])${ODSTEP}(?=\\S)`, 'g');
const JEDNOLITEROWE_NA_KONCU = new RegExp(`(?<=^|[\\s(„"'‚])([aiouwzAIOUWZ])${ODSTEP}$`);
const SKROTY = new RegExp(`(?<=(?:^|[\\s(])(?:np\\.|tzw\\.|m\\.in\\.|nr|art\\.|ust\\.|pkt|poz\\.|prof\\.|dr|mgr|inż\\.))${ODSTEP}(?=\\S)`, 'g');
const TYSIACE = /(?<=(?<![\d.,])\d{1,3}(?:[  ]\d{3})*) (?=\d{3}(?!\d))/g;
const JEDNOSTKI = new RegExp(
  `(?<=\\d)${ODSTEP}(?=(?:r\\.|zł|gr|min|godz\\.|h|s|kg|t|m|mm|cm|km|m²|m³|°C|%|‰|proc\\.|tys\\.|mln|mld|szt\\.|pkt|osób|osoby|dni|lat|zmian|palet|tygodni|tygodnie|miesięcy|miesiące|godzin|godziny|sztuk|sztuki|okresów|okresy|EUR|USD|PLN)(?![\\p{L}]))`,
  'gu',
);
const PAUZA = new RegExp(`${ODSTEP}(?=[–—](?:\\s|$))`, 'g');
/** Krótki człon (1–2 znaki) z dywizem i resztą słowa: „e-commerce”, „50-osobowym”. */
export const DYWIZ = /(?<![\p{L}\p{N}-])[\p{L}\p{N}]{1,2}-[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*/gu;

/**
 * Twarde spacje w tekście (bez HTML). `ciagDalszy`: po tym tekście stoi jeszcze inny węzeł (np. link), więc
 * jednoliterowe słowo na końcu też wiąże się z tym, co dalej.
 * @param {string} tekst
 * @param {{ ciagDalszy?: boolean }} [opcje]
 */
export function typografia(tekst, { ciagDalszy = false } = {}) {
  let t = tekst
    .replace(JEDNOLITEROWE, `$1${NBSP}`)
    .replace(SKROTY, NBSP)
    .replace(TYSIACE, NBSP)
    .replace(JEDNOSTKI, NBSP)
    .replace(PAUZA, NBSP);
  // Dwa jednoliterowe słowa z rzędu („a w Faraone”): drugi przebieg łapie to, co pierwszy pominął.
  t = t.replace(JEDNOLITEROWE, `$1${NBSP}`);
  if (ciagDalszy) t = t.replace(JEDNOLITEROWE_NA_KONCU, `$1${NBSP}`);
  return t;
}

const ENCJE = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const ucieczka = (t) => t.replace(/[&<>"']/g, (z) => ENCJE[z]);

/**
 * Tekst do wstawienia jako HTML (komponent Tekst.astro): kodowanie znaków, twarde spacje i krótkie człony z dywizem
 * w elemencie, który się nie łamie.
 * @param {string} tekst
 */
export function typografiaHtml(tekst) {
  return ucieczka(typografia(tekst)).replace(DYWIZ, (slowo) => `<span class="${NIEROZDZIELNIE}">${slowo}</span>`);
}

/**
 * Części tekstu dla drzewa HTML (wtyczka Markdowna): tekst z twardymi spacjami, a krótkie człony z dywizem jako
 * osobne elementy, które się nie łamią.
 * @param {string} tekst
 * @param {{ ciagDalszy?: boolean }} [opcje]
 * @returns {({ type: 'text', value: string } | { type: 'element', tagName: 'span', properties: { className: string[] }, children: { type: 'text', value: string }[] })[]}
 */
export function czesciTypografii(tekst, opcje) {
  const t = typografia(tekst, opcje);
  const czesci = [];
  let ostatni = 0;
  for (const m of t.matchAll(DYWIZ)) {
    if (m.index > ostatni) czesci.push({ type: 'text', value: t.slice(ostatni, m.index) });
    czesci.push({ type: 'element', tagName: 'span', properties: { className: [NIEROZDZIELNIE] }, children: [{ type: 'text', value: m[0] }] });
    ostatni = m.index + m[0].length;
  }
  if (ostatni < t.length || !czesci.length) czesci.push({ type: 'text', value: t.slice(ostatni) });
  return czesci;
}
