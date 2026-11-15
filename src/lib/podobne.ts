// „Podobne narzędzia” w kolumnie bocznej strony narzędzia: najwyżej kilka trafnych zamiast listy wszystkich.
// Punkty liczone z rejestru (src/data/narzedzia.ts) i z linków między stronami, więc nowe narzędzie dostaje sąsiadów
// bez ręcznej pracy:
// - +2,5, gdy jedna ze stron linkuje do drugiej w wyjaśnieniu (href="/narzedzia/…" w src/pages/narzedzia/*.astro):
//   redakcja łączy tylko sprawy, z których czytelnik naprawdę przechodzi dalej;
// - wspólne akty ważone rzadkością (1 / ln(1 + liczba narzędzi z tym aktem)): Kodeks pracy, który ma prawie każde
//   narzędzie, waży mało, a ustawa zasiłkowa albo rozporządzenie o UDT dużo. Akt rozpoznajemy po publikatorze, bo
//   rejestr przepisów ma czasem ten sam akt pod dwoma kluczami (ogolneBhp i ogolneBhpHala: Dz.U. 2003 poz. 1650);
//   ustaw i rozporządzeń zmieniających nie liczymy: zmieniają po kilka niepowiązanych spraw naraz;
// - +1,5 za każde wspólne słowo, gdy jest w nazwie albo adresie choć jednego z dwóch narzędzi, a +1, gdy tylko
//   w hasłach z hali obu (src/data/sprawy.ts: długie hasła mają słowa ogólne, np. „pracodawca”, „wypłata”);
// - +1 za tę samą kategorię.
// Poniżej progu nic nie pokazujemy: lepiej dwa trafne niż pięć przypadkowych.
import type { Narzedzie } from '../data/narzedzia';
import { AKTY, type KluczAktu } from '../data/prawo';
import { HASLA } from '../data/sprawy';
import { normalizuj } from './szukaj-narzedzi';

export const PROG = 0.8;
export const ZA_LINK = 2.5;
const ZA_SLOWO = 1.5;
const ZA_HASLO = 1;
const KROTKIE_OK = new Set(['l4', 'udt', 'bhp', 'ppk', 'sep']);
// Słowo pomijamy, gdy całe jest na liście albo gdy na liście jest jego 6-literowy początek (słowa porównujemy po
// 6 literach). Wpis krótszy niż 6 liter działa więc tylko jako całe słowo: „okres” nie wycina „okresu”.
const POMIJANE = new Set(['w', 'i', 'na', 'do', 'za', 'od', 'z', 'po', 'ile', 'pracy', 'praca', 'prace', 'kalkulator', 'czy', 'albo', 'oraz', 'normy', 'termin', 'terminy', 'pracownik', 'pracownika', 'dni', 'dzien', 'zwolnienie', 'zwolnienia',
  // Przymiotniki i nazwy dokumentów, które łączą niepowiązane sprawy (kierowca zawodowy ≁ choroba zawodowa,
  // świadectwo pracy ≁ świadectwo kwalifikacji, wcześniejsza emerytura ≁ wcześniejsze przyjście do pracy, zwrot podatku ≁ zwrot kosztów szkolenia, odzież robocza ≁ dni robocze,
  // powierzenie pracy ≁ powierzchnia na pracownika).
  'zawodowa', 'zawodowy', 'zawodowej', 'zawodowego', 'swiadectwo', 'wczesniej', 'wczesniejsza', 'wczesniejsze', 'wczesniejszy', 'zwrot', 'robocze', 'robocza', 'roboczej', 'roboczy',
  'powierzeniu', 'powierzenie', 'powierzenia',
  // Słowa ogólne w nazwach i hasłach (początki): kontrola trzeźwości ≁ kontrola grafiku ≁ kontrola ZUS, ile kg wolno ≁ co wolno
  // na L4, świadczenie urlopowe ≁ świadczenie rehabilitacyjne, odszkodowanie za wypadek ≁ odszkodowanie za zwolnienie ≁ zakaz
  // konkurencji, praca przy monitorze ≁ monitoring (pomijamy samo słowo „monitoring”, „monitor” zostaje), okres próbny ≁ okres zasiłkowy, wyjazd służbowy ≁ wyjazd na L4,
  // pracownik niepełnosprawny ≁ niepełny miesiąc (pomijamy samo „niepełny”).
  'pracod', 'pracow', 'kontro', 'wolno', 'swiadc', 'odszko', 'monitoring', 'okres', 'sluzbo', 'stanow', 'wyjazd', 'pozew', 'koszty',
  'zmiana', 'kiedy', 'pierws', 'dostan', 'trzeci', 'osobe', 'brak', 'przy', 'niepelny']);

const slowa = (tekst: string) =>
  new Set(
    normalizuj(tekst)
      .split(' ')
      .filter((s) => (s.length >= 4 || KROTKIE_OK.has(s)) && !POMIJANE.has(s) && !POMIJANE.has(s.slice(0, 6)))
      .map((s) => s.slice(0, 6)),
  );

/** Słowa nazwy i adresu oraz osobno słowa samych haseł z hali. */
const slowaNarzedzia = (n: Pick<Narzedzie, 'slug' | 'nazwa'>) => {
  const nazwa = slowa(`${n.nazwa} ${n.slug.replaceAll('-', ' ')}`);
  const hasla = new Set([...slowa((HASLA[n.slug] ?? []).join(' '))].filter((s) => !nazwa.has(s)));
  return { nazwa, hasla };
};

const ZMIENIAJACY = /o zmianie|zmieniając/i;
/** Akty narzędzia rozpoznane po publikatorze, bez aktów zmieniających. */
const aktyNarzedzia = (przepisy: readonly KluczAktu[]) =>
  new Set(przepisy.filter((k) => !ZMIENIAJACY.test(AKTY[k].nazwa)).map((k) => AKTY[k].publikator));

const ADRES_NARZEDZIA = /href=["']\/narzedzia\/([a-z0-9-]+)(?:#[^"']*)?["']/g;
/** Linki między stronami narzędzi: slug → slugi, do których strona linkuje. */
export function linkiZeStron(zrodla: Record<string, string>): Map<string, Set<string>> {
  const linki = new Map<string, Set<string>>();
  for (const [plik, tresc] of Object.entries(zrodla)) {
    const slug = plik.split('/').pop()!.replace(/\.astro$/, '');
    linki.set(slug, new Set([...tresc.matchAll(ADRES_NARZEDZIA)].map((m) => m[1]).filter((s) => s !== slug)));
  }
  return linki;
}

const LINKI = linkiZeStron(import.meta.glob<string>('../pages/narzedzia/*.astro', { query: '?raw', import: 'default', eager: true }));

/** Do `ile` podobnych narzędzi (slugi), od najbardziej podobnego. */
export function podobne(slug: string, wszystkie: Narzedzie[], ile = 5, linki: Map<string, Set<string>> = LINKI): string[] {
  const ten = wszystkie.find((n) => n.slug === slug);
  if (!ten) return [];
  const akty = new Map(wszystkie.map((n) => [n.slug, aktyNarzedzia(n.przepisy)]));
  const liczbaAktu = new Map<string, number>();
  for (const a of akty.values()) for (const p of a) liczbaAktu.set(p, (liczbaAktu.get(p) ?? 0) + 1);
  const moje = slowaNarzedzia(ten);
  const mojeAkty = akty.get(slug)!;
  const linkuje = (a: string, b: string) => linki.get(a)?.has(b) ?? false;
  return wszystkie
    .filter((n) => n.slug !== slug)
    .map((n) => {
      let punkty = 0;
      for (const p of akty.get(n.slug)!) if (mojeAkty.has(p)) punkty += 1 / Math.log(1 + liczbaAktu.get(p)!);
      const jego = slowaNarzedzia(n);
      for (const s of new Set([...jego.nazwa, ...jego.hasla])) {
        if (moje.nazwa.has(s)) punkty += ZA_SLOWO;
        else if (moje.hasla.has(s)) punkty += jego.nazwa.has(s) ? ZA_SLOWO : ZA_HASLO;
      }
      if (n.kategoria === ten.kategoria) punkty += 1;
      if (linkuje(slug, n.slug) || linkuje(n.slug, slug)) punkty += ZA_LINK;
      return { slug: n.slug, nazwa: n.nazwa, punkty };
    })
    .filter((x) => x.punkty >= PROG)
    .sort((a, b) => b.punkty - a.punkty || a.nazwa.localeCompare(b.nazwa, 'pl'))
    .slice(0, ile)
    .map((x) => x.slug);
}
