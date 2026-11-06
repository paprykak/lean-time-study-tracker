// Kontrola tekstu artykułu (skill /artykul, krok „Kontrola”; w CI dla każdego artykułu, który nie jest testowy).
// Błędy blokują publikację: przypis bez źródła, źródło bez przypisu, liczba bez źródła, frazy z tekstów generowanych,
// miejsca do uzupełnienia w tekście do publikacji. Uwagi to wskazówki redakcyjne (długie zdania, czytelność, typografia).
import { numeryPrzypisu, PRZYPIS } from './markdown.mjs';

/** Frazy typowe dla tekstów generowanych i korporacyjnej waty. Zamiast nich: fakt, krok albo liczba. */
export const FRAZY_ZAKAZANE = [
  'w dzisiejszym dynamicznym świecie', 'w dzisiejszym świecie', 'w dzisiejszych czasach', 'w erze transformacji',
  'w dobie cyfryzacji', 'warto zauważyć', 'warto podkreślić', 'nie da się ukryć', 'nie ulega wątpliwości', 'kluczowe jest',
  'kluczową rolę odgrywa', 'podsumowując', 'reasumując', 'zanurzmy się', 'w tym artykule dowiesz się', 'mam nadzieję, że',
  'game changer', 'holistyczne podejście', 'przełomowe rozwiązanie', 'szyte na miarę', 'jak wszyscy wiemy',
];
/** Frazy często puste, ale czasem uzasadnione (np. „rewolucja” w historii Toyoty): uwaga, nie błąd. */
export const FRAZY_PODEJRZANE = ['synergi', 'rewolucj', 'kompleksowe rozwiązanie', 'najwyższej jakości', 'nie bez powodu', 'innowacyjn', 'efektywnie zarządza'];

/** Liczba, która wymaga źródła: procent, waluta, duże liczebniki, krotność. */
const STATYSTYKA = /\d[\d\s.,]*\s?(?:%|proc\.?|procent|zł|PLN|EUR|USD|€|\$|mln|mld|tys\.)|\d+(?:[.,]\d+)?\s?(?:razy|-krotn)/i;
/** Oznaczenie przykładu bez źródła (skill: „przykład na danych fikcyjnych”). */
const FIKCJA = /fikcyjn|hipotetyczn|przykład(?:owe|owy|owa)? (?:na danych|liczbowy)|dla przykładu przyjmijmy/i;
const DO_UZUPELNIENIA = /\[DO UZUPEŁNIENIA/i;
const PIERWSZA_OSOBA = /\b(wdrożyłem|wdrożyłam|u mojego klienta|w moim zakładzie|w mojej firmie|prowadziłem|prowadziłam|zrobiłem|zrobiłam)\b/i;
// Skróty, po których często stoi wielka litera albo liczba, a które nie kończą zdania („np. Toyota”, „Dz. U. 2018”).
// Bez „r.”, „min.”, „itd.”: te zwykle kończą zdanie („w 2023 r. Potem…”).
const SKROTY = ['np', 'm.in', 'tj', 'tzw', 'tzn', 'dr', 'prof', 'mgr', 'inż', 'ang', 'wg', 'cyt', 'nr', 'por', 'ust', 'art', 'pkt', 'poz', 'Dz', 'U', 'al', 'św', 'ul'];
/** Przypis w tekście (bez stanu globalnego wyrażenia z flagą g). */
const maPrzypis = (tekst) => new RegExp(PRZYPIS.source).test(tekst);

/** Markdown bez kodu i komentarzy, nawiasy przypisów bez ukośników z panelu. */
const oczysc = (md) =>
  md
    .replace(/```[\s\S]*?```/g, '\n')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\\([[\]])/g, '$1');

/**
 * Bloki treści oddzielone pustą linią, z rodzajem: naglowek, tabela, cytat, lista, obraz, akapit.
 * @param {string} md
 * @returns {{ rodzaj: 'naglowek' | 'tabela' | 'cytat' | 'lista' | 'obraz' | 'akapit', tekst: string }[]}
 */
export function bloki(md) {
  return oczysc(md)
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((tekst) => {
      const rodzaj = /^#{1,6}\s/.test(tekst)
        ? 'naglowek'
        : /^\|/.test(tekst)
          ? 'tabela'
          : /^>/.test(tekst)
            ? 'cytat'
            : /^(?:[-*+]|\d+\.)\s/.test(tekst)
              ? 'lista'
              : /^!\[/.test(tekst)
                ? 'obraz'
                : 'akapit';
      return { rodzaj, tekst };
    });
}

/** Tekst bez składni Markdowna (do statystyk). */
const goly = (md) =>
  md
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(PRZYPIS, '')
    .replace(/^\s*(?:[-*+]|\d+\.|>)\s+/gm, '')
    .replace(/[*_`#]/g, '');

/**
 * Zdania z tekstu po polsku (skróty typu „np.”, „m.in.”, „tzw.” nie kończą zdania).
 * @param {string} tekst
 * @returns {string[]}
 */
export function zdania(tekst) {
  let t = ` ${tekst.replace(/\s+/g, ' ')} `;
  for (const s of SKROTY) t = t.replace(new RegExp(`(\\s|\\()${s.replace('.', '\\.')}\\.`, 'g'), `$1${s}§`);
  t = t.replace(/\b([A-ZŁŚŻŹĆŃÓ])\.\s/g, '$1§ '); // inicjały: „S. Shingo”
  return t
    .split(/(?<=[.!?…])\s+(?=[„"(A-ZĄĆĘŁŃÓŚŹŻ0-9])/)
    .map((z) => z.replace(/§/g, '.').trim())
    .filter((z) => /[\p{L}\p{N}]/u.test(z));
}

const SLOWO = /[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu;
export const slowa = (tekst) => tekst.match(SLOWO) ?? [];
/** Sylaby po polsku: grupy samogłosek („nie”, „się” to jedna sylaba). */
export const sylaby = (slowo) => (slowo.toLowerCase().match(/[aąeęioóuy]+/g) ?? []).length;

/**
 * Wskaźnik FOG-PL (polska odmiana wskaźnika mglistości Gunninga): 0,4 × (średnia długość zdania + odsetek słów
 * mających co najmniej 4 sylaby). Orientacyjnie: do 12 tekst przystępny dla menedżera, powyżej 15 trudny.
 */
export function fogPl(tekst) {
  const z = zdania(tekst);
  const s = slowa(tekst);
  if (!z.length || !s.length) return 0;
  const trudne = s.filter((w) => sylaby(w) >= 4 && !/^\d/.test(w)).length;
  return 0.4 * (s.length / z.length + (100 * trudne) / s.length);
}

/**
 * @param {{ body: string, frontmatter: Record<string, any> }} artykul
 * @returns {{ bledy: string[], uwagi: string[], statystyki: Record<string, number> }}
 */
export function kontrolaTekstu({ body, frontmatter }) {
  const bledy = [];
  const uwagi = [];
  const zrodla = frontmatter.zrodla ?? [];
  const lista = bloki(body);
  const cytowane = new Set();

  // Przypisy i źródła
  for (const { tekst } of lista) {
    for (const m of tekst.matchAll(PRZYPIS)) for (const n of numeryPrzypisu(m[1])) cytowane.add(n);
  }
  for (const n of [...cytowane].sort((a, b) => a - b)) {
    if (n < 1 || n > zrodla.length) bledy.push(`przypis [${n}] nie ma źródła (lista „Źródła” ma ${zrodla.length} pozycji)`);
  }
  zrodla.forEach((z, i) => {
    if (!cytowane.has(i + 1)) bledy.push(`źródło ${i + 1} („${String(z.opis).slice(0, 60)}”) nie ma przypisu w tekście`);
    if (!z.adres && !['Książka', 'Rozmowa'].includes(z.rodzaj)) uwagi.push(`źródło ${i + 1} bez adresu: dodaj link, chyba że to książka albo rozmowa`);
    if (!z.rodzaj) uwagi.push(`źródło ${i + 1} bez rodzaju (badanie, dane publiczne, przepis…)`);
  });

  // Liczby bez źródła: akapit, element listy, cytat i tabela (tabelę może opisać akapit tuż przed nią).
  lista.forEach((b, i) => {
    if (b.rodzaj === 'naglowek' || b.rodzaj === 'obraz') return;
    const jednostki = b.rodzaj === 'lista' ? b.tekst.split(/\n(?=\s*(?:[-*+]|\d+\.)\s)/) : [b.tekst];
    const poprzedni = lista[i - 1]?.tekst ?? '';
    for (const j of jednostki) {
      if (!STATYSTYKA.test(goly(j))) continue;
      const zPrzypisem = maPrzypis(j) || (b.rodzaj === 'tabela' && maPrzypis(poprzedni));
      const fikcja = FIKCJA.test(j) || FIKCJA.test(poprzedni) || (b.rodzaj === 'lista' && FIKCJA.test(b.tekst));
      if (!zPrzypisem && !fikcja) bledy.push(`liczba bez źródła: „${goly(j).replace(/\s+/g, ' ').slice(0, 90)}…” (dodaj przypis albo oznacz dane fikcyjne)`);
    }
  });

  // Język
  const tresc = lista.filter((b) => ['akapit', 'lista', 'cytat'].includes(b.rodzaj)).map((b) => goly(b.tekst)).join('\n\n');
  const male = tresc.toLowerCase();
  for (const f of FRAZY_ZAKAZANE) if (male.includes(f)) bledy.push(`fraza z tekstów generowanych: „${f}”`);
  for (const f of FRAZY_PODEJRZANE) if (male.includes(f)) uwagi.push(`fraza często pusta: „${f}…” (zostaw tylko, gdy niesie treść)`);
  if (DO_UZUPELNIENIA.test(body) && !frontmatter.szkic) bledy.push('w tekście do publikacji zostało miejsce [DO UZUPEŁNIENIA]');
  const osoba = tresc.match(PIERWSZA_OSOBA);
  if (osoba) uwagi.push(`pierwsza osoba („${osoba[0]}”): wolno tylko z materiału autora, sprawdź w teczce`);
  if (/(^|\s)"[^"\n]+"/.test(tresc)) uwagi.push('cudzysłów prosty "…": po polsku „…”');
  if (/\s-\s/.test(tresc)) uwagi.push('dywiz zamiast półpauzy: „ – ” w środku zdania');

  const z = zdania(tresc);
  const s = slowa(tresc);
  const dlugosci = z.map((x) => slowa(x).length);
  const statystyki = {
    slowa: s.length,
    zdania: z.length,
    sredniaZdania: z.length ? s.length / z.length : 0,
    dlugieZdania: dlugosci.filter((d) => d > 30).length,
    fogPl: fogPl(tresc),
    srodtytuly: lista.filter((b) => /^##\s/.test(b.tekst)).length,
    zrodla: zrodla.length,
    przypisy: cytowane.size,
  };
  if (statystyki.sredniaZdania > 20) uwagi.push(`średnio ${statystyki.sredniaZdania.toFixed(1)} słowa w zdaniu (cel: do 18)`);
  if (statystyki.dlugieZdania) uwagi.push(`${statystyki.dlugieZdania} zdań dłuższych niż 30 słów: podziel je`);
  if (statystyki.fogPl > 14) uwagi.push(`FOG-PL ${statystyki.fogPl.toFixed(1)}: tekst trudny (cel: do 12)`);
  if (statystyki.slowa > 800 && statystyki.srodtytuly < 3) uwagi.push('dłuższy tekst ma mniej niż 3 śródtytuły');
  for (const b of lista.filter((x) => x.rodzaj === 'akapit')) {
    if (zdania(goly(b.tekst)).length > 6) uwagi.push(`akapit ma ponad 6 zdań: „${goly(b.tekst).slice(0, 60)}…”`);
  }
  return { bledy, uwagi, statystyki };
}
