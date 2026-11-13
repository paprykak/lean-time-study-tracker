// Indeks wyszukiwarki narzędzi (budowany przy buildzie, serwowany jako /narzedzia/indeks.json): rejestr narzędzi,
// hasła z hali (src/data/sprawy.ts) i pytania z FAQ każdej strony narzędzia. Pytania leżą w kodzie stron
// (src/pages/narzedzia/<slug>.astro, `pytanie: '…'`), więc czytamy je z tekstu plików: strony narzędzi zostają
// w rękach zespołów fabryki, a nowe narzędzie trafia do wyszukiwarki bez dopisywania czegokolwiek.
import { KATEGORIE, NARZEDZIA } from '../data/narzedzia';
import { HASLA } from '../data/sprawy';
import type { WpisIndeksu } from './szukaj-narzedzi';

const ZRODLA = import.meta.glob('../pages/narzedzia/*.astro', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

/** Napis z kodu strony: bez znaków ucieczki, wstawki `${…}` z szablonów (rok) zastąpione bieżącym rokiem. */
const napis = (surowy: string, rok: number) =>
  surowy
    .replace(/\$\{[^}]*\}/g, String(rok))
    .replace(/\\(['"`\\])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();

/** Pytania z FAQ (`pytanie: '…'`, "…" albo `…`) i tytuł strony (atrybut tytul albo h1 przekazany jako tekst). */
export function zKoduStrony(kod: string, rok = new Date().getFullYear()): { pytania: string[]; tytul: string } {
  const pytania = [...kod.matchAll(/pytanie:\s*(['"`])((?:\\.|(?!\1)[^\\])*)\1/g)].map((m) => napis(m[2], rok));
  const tytul = [...kod.matchAll(/\s(?:tytul|h1)="([^"]+)"/g)].map((m) => m[1]).join(' ');
  return { pytania: [...new Set(pytania)], tytul };
}

/** Wpisy indeksu w kolejności rejestru. */
export function indeksNarzedzi(): WpisIndeksu[] {
  return NARZEDZIA.map((n) => {
    const kod = ZRODLA[`../pages/narzedzia/${n.slug}.astro`] ?? '';
    const { pytania, tytul } = zKoduStrony(kod);
    return { s: n.slug, n: n.nazwa, k: n.krotko, c: KATEGORIE[n.kategoria].nazwa, kk: n.kategoria, t: tytul, p: pytania, h: HASLA[n.slug] ?? [] };
  });
}
