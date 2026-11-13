// Wyszukiwarka narzędzi: jedna logika dla pola na stronie głównej, w nagłówku, na /narzedzia i na /szukaj.
// Działa w przeglądarce na małym indeksie (/narzedzia/indeks.json: nazwa, opis, kategoria, tytuł strony i pytania
// z FAQ każdego narzędzia, src/lib/indeks-narzedzi.ts), bez serwera i bez zewnętrznych usług.
//
// Polski bez słownika odmiany: słowo z zapytania pasuje do słowa w indeksie, gdy (1) słowo w indeksie zaczyna się od
// niego (pisanie na żywo: „nadgo” → „nadgodziny”) albo (2) oba mają wspólny początek co najmniej 4 znaków i różnią
// się tylko końcówką do 3 znaków („urlopu” ~ „urlop”, „ciąży” ~ „ciąża”, „zwolnienia” ~ „zwolnienie”). Słowa do
// 3 znaków („L4”, „BHP”, „UDT”) muszą się zgadzać na początku. Polskie znaki są pomijane („ciaza” = „ciąża”).
// Słowo, którego nie zna żadne narzędzie (literówka, „szef”), jest pomijane. Z pozostałych musi pasować co najmniej
// połowa, a więcej trafionych słów zawsze wygrywa z wagą pola. Ranking: nazwa = hasła z hali (dokładne słowo +1) > tytuł > pytanie > opis > kategoria.

export interface WpisIndeksu {
  /** slug narzędzia */
  s: string;
  /** nazwa z rejestru */
  n: string;
  /** jedno zdanie z rejestru */
  k: string;
  /** nazwa kategorii */
  c: string;
  /** klucz kategorii */
  kk: string;
  /** tytuł strony i H1 */
  t: string;
  /** pytania z FAQ narzędzia */
  p: string[];
  /** hasła z hali (src/data/sprawy.ts): potoczne słowa, których nie ma w nazwie */
  h: string[];
  /** 1, gdy narzędzie jest wśród najczęstszych spraw z hali (przy remisie idzie wyżej) */
  o?: 1;
}

export interface Wynik {
  wpis: WpisIndeksu;
  punkty: number;
  /** Pytanie z FAQ, które najlepiej pasuje (do pokazania pod nazwą), gdy trafienie było w pytaniu. */
  pytanie?: string;
}

/** Słowa, które nic nie mówią o narzędziu („ile mi się należy za…”). */
const POMIJANE = new Set([
  'a', 'aby', 'albo', 'ale', 'bo', 'by', 'co', 'czy', 'do', 'dla', 'gdy', 'i', 'ile', 'jak', 'jaki', 'jaka', 'jakie', 'jest', 'kiedy',
  'ktory', 'ktora', 'ktore', 'lub', 'mi', 'mnie', 'moge', 'moj', 'moja', 'na', 'nie', 'o', 'od', 'po', 'pod', 'przy', 'przez', 'sie', 'sa',
  'ta', 'tak', 'te', 'to', 'ten', 'w', 'we', 'z', 'za', 'ze', 'mam', 'musze', 'wolno', 'trzeba', 'u', 'mojej', 'moje', 'moim',
  'hala', 'hali', 'hale', 'robocie', 'zakladzie', 'firmie', 'firma', 'kalkulator',
]);

const ZNAKI: Record<string, string> = { ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z' };

/** Małe litery bez polskich znaków, tylko litery i cyfry rozdzielone spacją. */
export function normalizuj(tekst: string): string {
  return tekst
    .toLocaleLowerCase('pl')
    .replace(/[ąćęłńóśźż]/g, (z) => ZNAKI[z])
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/** Istotne słowa zapytania (bez słów pomijanych; gdy zostałyby same pomijane, bierze wszystkie). */
export function slowa(zapytanie: string): string[] {
  const wszystkie = normalizuj(zapytanie).split(' ').filter(Boolean);
  const istotne = wszystkie.filter((s) => !POMIJANE.has(s));
  return [...new Set(istotne.length ? istotne : wszystkie)].slice(0, 8);
}

const wspolnyPoczatek = (a: string, b: string) => {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
};

/** Czy słowo zapytania pasuje do słowa z indeksu (odmiana przez wspólny początek, pisanie na żywo przez prefiks). */
export function pasuje(szukane: string, slowo: string): boolean {
  if (slowo.startsWith(szukane)) return true;
  if (szukane.length <= 3) return false;
  const wspolne = wspolnyPoczatek(szukane, slowo);
  // Różnią się tylko końcówką (do 3 znaków po wspólnym początku w każdym słowie): „pracy” ≁ „pracodawca”.
  return wspolne >= 4 && szukane.length - wspolne <= 3 && slowo.length - wspolne <= 3;
}

// Hasła z hali to świadomy wybór redakcji, więc ważą tyle co nazwa; dokładnie to samo słowo dostaje +1.
const WAGI = { n: 10, h: 10, t: 6, p: 5, k: 3, c: 2 } as const;
type Pole = keyof typeof WAGI;

interface Przygotowany {
  wpis: WpisIndeksu;
  pola: Record<Exclude<Pole, 'p'>, string[]>;
  pytania: { tekst: string; slowa: string[] }[];
  nazwa: string;
}

const naSlowa = (t: string) => normalizuj(t).split(' ').filter(Boolean);

/** Indeks gotowy do szukania (słowa policzone raz, nie przy każdym wpisanym znaku). */
export function przygotuj(indeks: WpisIndeksu[]): Przygotowany[] {
  return indeks.map((wpis) => ({
    wpis,
    pola: { n: naSlowa(wpis.n), h: naSlowa(wpis.h.join(' ')), t: naSlowa(wpis.t), k: naSlowa(wpis.k), c: naSlowa(wpis.c) },
    pytania: wpis.p.map((tekst) => ({ tekst, slowa: naSlowa(tekst) })),
    nazwa: normalizuj(wpis.n),
  }));
}

/**
 * Narzędzia pasujące do zapytania, od najlepszego. Puste zapytanie: pusta lista.
 * @param limit ile wyników zwrócić (domyślnie wszystkie)
 */
export function szukaj(przygotowany: Przygotowany[], zapytanie: string, limit = Infinity): Wynik[] {
  const wszystkieSlowa = slowa(zapytanie);
  const znane = wszystkieSlowa.filter((s) => przygotowany.some((x) => Object.values(x.pola).some((p) => p.some((w) => pasuje(s, w))) || x.pytania.some((q) => q.slowa.some((w) => pasuje(s, w)))));
  const szukane = znane;
  if (!szukane.length) return [];
  const fraza = normalizuj(zapytanie);
  const wyniki: Wynik[] = [];
  for (const x of przygotowany) {
    let punkty = 0;
    let trafione = 0;
    for (const s of szukane) {
      let najlepiej = 0;
      for (const pole of ['n', 'h', 't', 'k', 'c'] as const) {
        if (WAGI[pole] + 1 > najlepiej && x.pola[pole].some((w) => w === s)) najlepiej = WAGI[pole] + 1;
        else if (WAGI[pole] > najlepiej && x.pola[pole].some((w) => pasuje(s, w))) najlepiej = WAGI[pole];
      }
      if (najlepiej < WAGI.p && x.pytania.some((q) => q.slowa.some((w) => pasuje(s, w)))) najlepiej = WAGI.p;
      if (najlepiej) trafione++;
      punkty += najlepiej;
    }
    if (trafione < Math.ceil(szukane.length / 2)) continue;
    punkty += trafione * 100;
    if (x.nazwa.startsWith(fraza)) punkty += 3;
    else if (x.nazwa.includes(fraza)) punkty += 2;
    // Najczęstsze sprawy z hali (src/data/sprawy.ts) wygrywają remisy: „urlop” to najpierw kalkulator urlopu.
    if (x.wpis.o) punkty += 4;
    // Pytanie z FAQ, w którym trafia najwięcej słów zapytania: odpowiada „po pytaniu”, więc pokazujemy je pod nazwą.
    let pytanie: string | undefined;
    let ilePytanie = 0;
    for (const q of x.pytania) {
      const ile = szukane.filter((s) => q.slowa.some((w) => pasuje(s, w))).length;
      if (ile > ilePytanie) [pytanie, ilePytanie] = [q.tekst, ile];
    }
    const wNazwie = szukane.every((s) => x.pola.n.some((w) => pasuje(s, w)));
    if (!wNazwie && ilePytanie === szukane.length) punkty += 2;
    wyniki.push({ wpis: x.wpis, punkty, pytanie: wNazwie || ilePytanie < Math.min(2, szukane.length) ? undefined : pytanie });
  }
  return wyniki.sort((a, b) => b.punkty - a.punkty || a.wpis.n.localeCompare(b.wpis.n, 'pl')).slice(0, limit);
}
