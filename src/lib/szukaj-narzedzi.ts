// Wyszukiwarka narzędzi: jedna logika dla pola na stronie głównej, w nagłówku, na /narzedzia i na /szukaj.
// Działa w przeglądarce na małym indeksie (/narzedzia/indeks.json: nazwa, opis, kategoria, tytuł strony, pytania
// z FAQ i hasła z hali każdego narzędzia, src/lib/indeks-narzedzi.ts), bez serwera i bez zewnętrznych usług.
//
// Polski bez słownika odmiany. Słowo z zapytania pasuje do słowa z indeksu, gdy:
// - jest takie samo (najmocniej);
// - różni się tylko końcówką: wspólny początek co najmniej 4 znaków, a po nim najwyżej 3 znaki w każdym słowie
//   i razem najwyżej 4 („urlopu” ~ „urlop”, „ciąży” ~ „ciąża”, „pracowników” ~ „pracownik”, ale „kierownik” ≁ „kierowcy”);
// - jest początkiem słowa z indeksu, ale tylko ostatnie słowo zapytania, bo to ono jest pisane na żywo („nadgo” →
//   „nadgodziny”); wcześniejsze słowa są już skończone, więc „dał” nie pasuje do „dalej”;
// - ma literówkę (jedna litera zamieniona, dodana, pominięta albo dwie przestawione, słowa od 5 znaków), ale tylko gdy
//   żadne narzędzie nie zna go w poprawnej postaci („nadgodzni” → „nadgodziny”).
// Słowa do 3 znaków („L4”, „BHP”, „UDT”) muszą się zgadzać w całości (ostatnie: na początku). Polskie znaki są
// pomijane („ciaza” = „ciąża”). Słowo, którego nie zna żadne narzędzie („szef”, „kierownik”), jest pomijane.
//
// Ranking (punkty od 0 do ok. 1,5):
// 1. Pokrycie zapytania: każde znane słowo waży tym więcej, im mniej narzędzi je zna (rzadkie „odprawa” mówi więcej niż
//    częste „pracy”), a trafienie waży według pola: nazwa i hasła z hali 1, tytuł 0,8, pytanie z FAQ 0,6, opis 0,55,
//    kategoria 0,35, razy jakość dopasowania (to samo słowo 1, odmiana 0,85, początek słowa 0,7, literówka 0,6).
//    Narzędzie trafia na listę, gdy pokrywa co najmniej połowę wagi zapytania.
// 2. Fraza: nazwa, hasło z hali, tytuł albo pytanie z FAQ, które zapytanie wyczerpuje (iloczyn: jaka część frazy jest
//    w zapytaniu i jaka część zapytania jest we frazie). Dlatego hasło „odprawa” wygrywa z nazwą „Odprawa pośmiertna”:
//    zapytanie „odprawa” wyczerpuje hasło, a nazwy tylko w połowie.
// 3. Remis: najczęstsze sprawy z hali (src/data/sprawy.ts), potem krótsza nazwa (narzędzie ogólniejsze), na końcu
//    kolejność rejestru (bez alfabetu, który nic nie mówi o trafności).

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
  // Dopiski z podpowiedzi Google, które nie mówią, o jaką sprawę chodzi („nadgodziny kodeks pracy”, „urlop zasady”).
  'kodeks', 'kodeksu', 'kp', 'przepisy', 'przepisow', 'zasady', 'polska', 'polsce', 'wzor', 'sobie', 'moze', 'mozna', 'musi', 'jakim',
]);
/** Rok w zapytaniu („płaca minimalna 2027”) zwykle nie odróżnia narzędzi, a lata są w tytułach wielu z nich. */
const ROK = /^20[0-9]{2}$/;

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

/** Istotne słowa tekstu (bez słów pomijanych; gdy zostałyby same pomijane, bierze wszystkie). */
const istotne = (wszystkie: string[]) => {
  const bez = wszystkie.filter((s) => !POMIJANE.has(s) && !ROK.test(s));
  return bez.length ? bez : wszystkie;
};

/** Istotne słowa zapytania, bez powtórzeń, najwyżej 8. */
export function slowa(zapytanie: string): string[] {
  return [...new Set(istotne(normalizuj(zapytanie).split(' ').filter(Boolean)))].slice(0, 8);
}

const wspolnyPoczatek = (a: string, b: string) => {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
};

/**
 * Odmiana: wspólny początek co najmniej 4 znaków, a po nim najwyżej 3 znaki w każdym słowie. Czas przeszły w pierwszej
 * osobie ma dłuższą końcówkę, więc przy nim do 4 („zniszczyłem” ~ „zniszczony”), ale „wyrównanie” ≁ „wyrównawczy”.
 */
const PRZESZLY = /l[ae]m$/;
const odmiana = (a: string, b: string) => {
  if (a.length <= 3 || b.length <= 3) return false;
  const w = wspolnyPoczatek(a, b);
  const koncowka = PRZESZLY.test(a) || PRZESZLY.test(b) ? 4 : 3;
  return w >= 4 && a.length - w <= koncowka && b.length - w <= koncowka;
};

/** Czy słowo zapytania pasuje do słowa z indeksu (do podświetlania: odmiana albo początek słowa). */
export function pasuje(szukane: string, slowo: string): boolean {
  return slowo.startsWith(szukane) || odmiana(szukane, slowo);
}

/** Odległość edycyjna najwyżej 1 (zamiana, dodanie, pominięcie litery albo przestawienie dwóch sąsiednich). */
function literowka(a: string, b: string): boolean {
  if (a === b || Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  if (a.length === b.length) {
    if (a.slice(i + 1) === b.slice(i + 1)) return true;
    return a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2);
  }
  return a.length > b.length ? a.slice(i + 1) === b.slice(i) : a.slice(i) === b.slice(i + 1);
}

/** Jakość dopasowania słowa zapytania do słowa z indeksu (0 = nie pasuje), bez literówek. */
function jakosc(s: string, w: string, ostatnie: boolean): number {
  if (s === w) return 1;
  if (odmiana(s, w)) return 0.85;
  if (ostatnie && w.startsWith(s)) return 0.7;
  return 0;
}

// Hasła z hali to świadomy wybór redakcji, więc ważą tyle co nazwa.
const WAGI = { n: 1, h: 1, t: 0.8, p: 0.6, k: 0.55, c: 0.35 } as const;
type Pole = keyof typeof WAGI;
const LITEROWKA = 0.6;
const FRAZA = 0.8;
/** Narzędzie trafia na listę, gdy pokrywa co najmniej połowę tego, co pokrywa najlepsze. */
const PROG = 0.5;
/** Nazwa zaczyna się od pierwszego słowa zapytania („przedawnienie” → „Przedawnienie wynagrodzenia…”). */
const POCZATEK = 0.2;
/** Waga słowa pomijanego („po”, „na”) w dopasowaniu frazy. */
const POMIJANE_WAGA = 0.2;

interface Fraza {
  /** numery słów w słowniku */
  slowa: number[];
  waga: number;
}

interface Przygotowany {
  wpis: WpisIndeksu;
  /** numer słowa w słowniku → najwyższa waga pola, w którym narzędzie je ma */
  wagi: Map<number, number>;
  frazy: Fraza[];
  pytania: { tekst: string; slowa: number[] }[];
  /** czy słowo jest w nazwie */
  nazwa: Set<number>;
  /** pierwsze istotne słowo nazwy */
  poczatek: number;
  dlugoscNazwy: number;
  kolejnosc: number;
}

interface Indeks {
  slownik: string[];
  numery: Map<string, number>;
  narzedzia: Przygotowany[];
}

const naSlowa = (t: string) => normalizuj(t).split(' ').filter(Boolean);

/** Indeks gotowy do szukania: słownik wszystkich słów i ich wagi w każdym narzędziu, policzone raz. */
export function przygotuj(indeks: WpisIndeksu[]): Indeks & Przygotowany[] {
  const slownik: string[] = [];
  const numery = new Map<string, number>();
  const nr = (s: string) => {
    let n = numery.get(s);
    if (n === undefined) numery.set(s, (n = slownik.push(s) - 1));
    return n;
  };
  const narzedzia = indeks.map((wpis, kolejnosc): Przygotowany => {
    const wagi = new Map<number, number>();
    const dodaj = (pole: Pole, tekst: string) => {
      const wszystkie = naSlowa(tekst);
      for (const n of wszystkie.map(nr)) wagi.set(n, Math.max(wagi.get(n) ?? 0, WAGI[pole]));
      // Nazwa to tytuł, a nie zdanie z hali: „i”, „w” i „kalkulator” nie są w niej treścią.
      return (pole === 'n' ? istotne(wszystkie) : wszystkie).map(nr);
    };
    const frazy: Fraza[] = [];
    const fraza = (pole: Pole, tekst: string) => {
      const s = [...new Set(dodaj(pole, tekst))];
      if (s.length) frazy.push({ slowa: s, waga: WAGI[pole] });
      return s;
    };
    const nazwa = fraza('n', wpis.n);
    for (const h of wpis.h) fraza('h', h);
    fraza('t', wpis.t);
    const pytania = wpis.p.map((tekst) => ({ tekst, slowa: fraza('p', tekst) }));
    dodaj('k', wpis.k);
    dodaj('c', wpis.c);
    return { wpis, wagi, frazy, pytania, nazwa: new Set(nazwa), poczatek: nazwa[0], dlugoscNazwy: nazwa.length, kolejnosc };
  });
  // Tablica narzędzi z dołączonym słownikiem: dawni użytkownicy indeksu widzą dalej listę narzędzi.
  return Object.assign(narzedzia, { slownik, numery, narzedzia });
}

/**
 * Narzędzia pasujące do zapytania, od najlepszego. Puste zapytanie: pusta lista.
 * @param limit ile wyników zwrócić (domyślnie wszystkie)
 */
export function szukaj(indeks: Indeks, zapytanie: string, limit = Infinity): Wynik[] {
  const { slownik, numery, narzedzia } = indeks;
  const wszystkieSlowa = slowa(zapytanie);
  const ostatnie = wszystkieSlowa.at(-1);
  // Dla każdego słowa zapytania: pasujące słowa ze słownika z jakością dopasowania.
  const dopasowania: { s: string; slowa: Map<number, number> }[] = [];
  for (const s of wszystkieSlowa) {
    const m = new Map<number, number>();
    const krotkie = s.length <= 3;
    slownik.forEach((w, n) => {
      const j = krotkie ? (w === s ? 1 : w.startsWith(s) ? (w.length === s.length + 1 ? 0.85 : s === ostatnie ? 0.7 : 0) : 0) : jakosc(s, w, s === ostatnie);
      if (j) m.set(n, j);
    });
    if (!m.size && s.length >= 5) slownik.forEach((w, n) => w.length >= 5 && literowka(s, w) && m.set(n, LITEROWKA));
    if (m.size) dopasowania.push({ s, slowa: m });
  }
  if (!dopasowania.length) return [];
  // Waga słowa: im mniej narzędzi je zna, tym więcej mówi o sprawie: √ln(N / liczba narzędzi), co najmniej √0,1.
  // Pierwiastek, bo słowo rzadkie w indeksie bywa w zapytaniu ogólne („procent”, „max”): ma ważyć więcej, ale nie rządzić.
  const wagaSlowa = dopasowania.map(({ slowa: m }) => {
    const ile = narzedzia.filter((x) => [...m.keys()].some((n) => x.wagi.has(n))).length;
    return Math.sqrt(Math.max(0.1, Math.log(narzedzia.length / ile)));
  });
  const suma = wagaSlowa.reduce((a, b) => a + b, 0);

  // Do fraz liczą się też słowa pomijane, ale tylko w tej samej postaci i z małą wagą: hasło „po L4” to nie samo „L4”.
  const frazowe = dopasowania.map((d, i) => ({ ...d, waga: wagaSlowa[i] }));
  for (const s of new Set(normalizuj(zapytanie).split(' '))) {
    const n = numery.get(s);
    if (n !== undefined && !wszystkieSlowa.includes(s) && (POMIJANE.has(s) || ROK.test(s))) frazowe.push({ s, slowa: new Map([[n, 1]]), waga: POMIJANE_WAGA });
  }
  const sumaFrazowa = frazowe.reduce((a, f) => a + f.waga, 0);

  const wyniki: (Wynik & { fraza: number; pokrycie: number; x: Przygotowany })[] = [];
  for (const x of narzedzia) {
    let pokrycie = 0;
    dopasowania.forEach(({ slowa: m }, i) => {
      let najlepiej = 0;
      for (const [n, j] of m) najlepiej = Math.max(najlepiej, j * (x.wagi.get(n) ?? 0));
      pokrycie += wagaSlowa[i] * najlepiej;
    });
    pokrycie /= suma;
    if (!pokrycie) continue;

    // Fraza wyczerpana przez zapytanie: część frazy w zapytaniu razy część zapytania we frazie.
    let fraza = 0;
    for (const f of x.frazy) {
      let wFrazie = 0;
      let wZapytaniu = 0;
      for (const n of f.slowa) {
        let j = 0;
        for (const { slowa: m } of frazowe) j = Math.max(j, m.get(n) ?? 0);
        wFrazie += j;
      }
      for (const { slowa: m, waga } of frazowe) {
        let j = 0;
        for (const n of f.slowa) j = Math.max(j, m.get(n) ?? 0);
        wZapytaniu += waga * j;
      }
      fraza = Math.max(fraza, f.waga * (wFrazie / f.slowa.length) * (wZapytaniu / sumaFrazowa));
    }

    // Pytanie z FAQ, w którym trafia najwięcej słów zapytania: odpowiada „po pytaniu”, więc pokazujemy je pod nazwą.
    let pytanie: string | undefined;
    let ilePytanie = 0;
    for (const q of x.pytania) {
      const ile = dopasowania.filter(({ slowa: m }) => q.slowa.some((n) => m.has(n))).length;
      if (ile > ilePytanie) [pytanie, ilePytanie] = [q.tekst, ile];
    }
    const wNazwie = dopasowania.every(({ slowa: m }) => [...x.nazwa].some((n) => m.has(n)));
    const odPoczatku = dopasowania.some(({ slowa: m }) => (m.get(x.poczatek) ?? 0) >= 0.85) ? POCZATEK : 0;
    const punkty = pokrycie + FRAZA * fraza + odPoczatku + (x.wpis.o ? 0.02 : 0);
    wyniki.push({ wpis: x.wpis, punkty, fraza, pokrycie, x, pytanie: wNazwie || ilePytanie < Math.min(2, dopasowania.length) ? undefined : pytanie });
  }
  const najlepsze = Math.max(0, ...wyniki.map((w) => w.pokrycie));
  return wyniki
    .filter((w) => w.pokrycie >= PROG * najlepsze)
    .sort((a, b) => b.punkty - a.punkty || a.x.dlugoscNazwy - b.x.dlugoscNazwy || a.x.kolejnosc - b.x.kolejnosc)
    .slice(0, limit)
    .map(({ wpis, punkty, pytanie }) => ({ wpis, punkty: Math.round(punkty * 1000) / 1000, ...(pytanie ? { pytanie } : {}) }));
}
