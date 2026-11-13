// „Podobne narzędzia” w kolumnie bocznej strony narzędzia: najwyżej kilka trafnych zamiast listy wszystkich.
// Punkty liczone z rejestru (src/data/narzedzia.ts), więc nowe narzędzie dostaje sąsiadów bez ręcznej pracy:
// - wspólne przepisy ważone rzadkością (1 / ln(1 + liczba narzędzi z tym aktem)): Kodeks pracy, który ma prawie każde
//   narzędzie, waży mało, a ustawa zasiłkowa albo rozporządzenie o UDT dużo;
// - +1,5 za każde wspólne słowo nazwy, adresu albo haseł z hali (src/data/sprawy.ts: „l4”, „urlop”, „udt”, „chorobowe”);
// - +1 za tę samą kategorię.
// Poniżej progu nic nie pokazujemy: lepiej dwa trafne niż pięć przypadkowych.
import type { Narzedzie } from '../data/narzedzia';
import { HASLA } from '../data/sprawy';
import { normalizuj } from './szukaj-narzedzi';

export const PROG = 0.8;
const KROTKIE_OK = new Set(['l4', 'udt', 'bhp', 'ppk', 'sep']);
const POMIJANE = new Set(['w', 'i', 'na', 'do', 'za', 'od', 'z', 'po', 'ile', 'pracy', 'praca', 'prace', 'kalkulator', 'czy', 'albo', 'oraz', 'normy', 'termin', 'terminy', 'pracownik', 'pracownika', 'dni', 'dzien', 'zwolnienie', 'zwolnienia',
  // Przymiotniki i nazwy dokumentów, które łączą niepowiązane sprawy (kierowca zawodowy ≁ choroba zawodowa,
  // świadectwo pracy ≁ świadectwo kwalifikacji, wcześniejsza emerytura ≁ wcześniejsze przyjście do pracy, zwrot podatku ≁ zwrot kosztów szkolenia).
  'zawodowa', 'zawodowy', 'zawodowej', 'zawodowego', 'swiadectwo', 'wczesniej', 'wczesniejsza', 'wczesniejsze', 'wczesniejszy', 'zwrot']);

/** Słowa nazwy i adresu, po których narzędzia są do siebie podobne (bez słów, które ma prawie każde). */
const slowaNarzedzia = (n: Pick<Narzedzie, 'slug' | 'nazwa'>) =>
  new Set(
    normalizuj(`${n.nazwa} ${n.slug.replaceAll('-', ' ')} ${(HASLA[n.slug] ?? []).join(' ')}`)
      .split(' ')
      .filter((s) => (s.length >= 4 || KROTKIE_OK.has(s)) && !POMIJANE.has(s))
      .map((s) => s.slice(0, 6)),
  );

/** Do `ile` podobnych narzędzi (slugi), od najbardziej podobnego. */
export function podobne(slug: string, wszystkie: Narzedzie[], ile = 5): string[] {
  const ten = wszystkie.find((n) => n.slug === slug);
  if (!ten) return [];
  const liczbaAktu = new Map<string, number>();
  for (const n of wszystkie) for (const p of new Set(n.przepisy)) liczbaAktu.set(p, (liczbaAktu.get(p) ?? 0) + 1);
  const mojeSlowa = slowaNarzedzia(ten);
  const mojePrzepisy = new Set(ten.przepisy);
  return wszystkie
    .filter((n) => n.slug !== slug)
    .map((n) => {
      let punkty = 0;
      for (const p of new Set(n.przepisy)) if (mojePrzepisy.has(p)) punkty += 1 / Math.log(1 + liczbaAktu.get(p)!);
      for (const s of slowaNarzedzia(n)) if (mojeSlowa.has(s)) punkty += 1.5;
      if (n.kategoria === ten.kategoria) punkty += 1;
      return { slug: n.slug, nazwa: n.nazwa, punkty };
    })
    .filter((x) => x.punkty >= PROG)
    .sort((a, b) => b.punkty - a.punkty || a.nazwa.localeCompare(b.nazwa, 'pl'))
    .slice(0, ile)
    .map((x) => x.slug);
}
