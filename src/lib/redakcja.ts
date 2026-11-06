// Czysta logika redakcyjna (bez Astro): czas czytania, widoczność wpisów, powiązania w obie strony.
// Używają jej szablony (src/lib/tresci.ts) i testy (src/lib/redakcja.test.ts).

/** Tempo czytania tekstu fachowego po polsku (słowa na minutę). */
export const SLOWA_NA_MINUTE = 200;

/** Liczba słów w Markdownie: bez kodu, adresów linków, znaczników HTML i składni. */
export function liczSlowa(markdown: string): number {
  const tekst = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, ' ') // znaczniki list
    .replace(/^\s*[-*_]{3,}\s*$/gm, ' ') // linie poziome
    .replace(/[#>*_|~]+/g, ' ');
  return (tekst.match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu) ?? []).length;
}

/** Czas czytania w minutach (zaokrąglony w górę, co najmniej 1). */
export const czasCzytania = (markdown: string) => Math.max(1, Math.ceil(liczSlowa(markdown) / SLOWA_NA_MINUTE));

/** Widoczność wpisu: na produkcji bez szkiców i wpisów testowych; w podglądzie i buildzie testowym wszystko. */
export const widoczny = (d: { szkic?: boolean; testowy?: boolean }, wszystkie: boolean) => wszystkie || (!d.szkic && !d.testowy);

export interface ArtykulRelacji {
  id: string;
  dzial: string;
  tematy: string[];
  powiazane: string[];
  opublikowano: Date;
}

/**
 * Powiązane artykuły („Czytaj także”), linki w obie strony:
 * 1) wskazane ręcznie w tym artykule, 2) artykuły, które wskazują ten artykuł, 3) wspólne tematy (więcej wspólnych
 * wyżej), 4) ten sam dział. W obrębie grup od najnowszych. Bez samego artykułu i bez powtórzeń.
 */
export function powiazane(artykul: ArtykulRelacji, wszystkie: ArtykulRelacji[], ile = 3): string[] {
  const inne = wszystkie.filter((a) => a.id !== artykul.id);
  const istnieje = new Set(inne.map((a) => a.id));
  const odNajnowszych = (a: ArtykulRelacji, b: ArtykulRelacji) => b.opublikowano.valueOf() - a.opublikowano.valueOf();
  const wynik: string[] = [];
  const dodaj = (id: string) => {
    if (istnieje.has(id) && !wynik.includes(id)) wynik.push(id);
  };
  artykul.powiazane.forEach(dodaj);
  inne.filter((a) => a.powiazane.includes(artykul.id)).sort(odNajnowszych).forEach((a) => dodaj(a.id));
  const wspolne = (a: ArtykulRelacji) => a.tematy.filter((t) => artykul.tematy.includes(t)).length;
  inne
    .filter((a) => wspolne(a) > 0)
    .sort((a, b) => wspolne(b) - wspolne(a) || odNajnowszych(a, b))
    .forEach((a) => dodaj(a.id));
  inne.filter((a) => a.dzial === artykul.dzial).sort(odNajnowszych).forEach((a) => dodaj(a.id));
  return wynik.slice(0, ile);
}

/** Nazwa serwisu w tytułach stron. */
export const NAZWA = 'Rytm Hali';
const DO_TYTULU = 60;
const DO_OPISU = 155;

/** Tytuł strony artykułu: tytuł SEO albo tytuł, z nazwą serwisu, jeśli razem mieszczą się w 60 znakach. */
export function tytulStrony(d: { tytul: string; tytulSeo?: string }): string {
  const tytul = d.tytulSeo ?? d.tytul;
  const z = `${tytul} | ${NAZWA}`;
  return z.length <= DO_TYTULU ? z : tytul;
}

/** Opis strony (meta description): opis SEO albo lead skrócony na granicy słowa do 155 znaków. */
export function opisStrony(d: { lead: string; opisSeo?: string }): string {
  if (d.opisSeo) return d.opisSeo;
  if (d.lead.length <= DO_OPISU) return d.lead;
  const ciecie = d.lead.slice(0, DO_OPISU - 1);
  return `${ciecie.slice(0, ciecie.lastIndexOf(' ')).replace(/[\s,;:.–-]+$/, '')}…`;
}

/** Polska odmiana po liczebniku: odmiana(1, ['strona', 'strony', 'stron']) → „1 strona”, 3 → „3 strony”, 12 → „12 stron”. */
export function odmiana(n: number, [jeden, kilka, wiele]: [string, string, string]): string {
  const dziesiatki = n % 100;
  const jednosci = n % 10;
  const slowo = n === 1 ? jeden : jednosci >= 2 && jednosci <= 4 && (dziesiatki < 12 || dziesiatki > 14) ? kilka : wiele;
  return `${n} ${slowo}`;
}

export interface ArtykulUkladu {
  id: string;
  dzial: string;
  opublikowano: Date;
  wyrozniony?: boolean;
}

/**
 * Dobór treści na stronę główną (prompt F3): artykuł wiodący to najnowszy wyróżniony ręcznie (pole „wyrozniony”),
 * a bez wyróżnionych najnowszy; obok trzy kolejne (najpierw wyróżnione); „Najnowsze” cztery następne; dwa pierwsze
 * działy (według kolejności) z artykułem wiodącym i listą trzech; trzy kolejne działy w kolumnach po cztery.
 * Żaden tekst nie pojawia się na stronie dwa razy; sekcje bez tekstów znikają.
 */
export function ukladGlownej<T extends ArtykulUkladu>(wszystkie: T[], kolejnoscDzialow: string[]) {
  const posortowane = [...wszystkie].sort((a, b) => b.opublikowano.valueOf() - a.opublikowano.valueOf());
  const uzyte = new Set<string>();
  const wez = (lista: T[], ile: number) => {
    const wynik = lista.filter((a) => !uzyte.has(a.id)).slice(0, ile);
    wynik.forEach((a) => uzyte.add(a.id));
    return wynik;
  };
  const wyroznione = posortowane.filter((a) => a.wyrozniony);
  const [glowny] = wez(wyroznione.length ? wyroznione : posortowane, 1);
  const obok = wez([...wyroznione, ...posortowane], 3);
  const najnowsze = wez(posortowane, 4);
  const sekcje: { dzial: string; wiodacy: T; lista: T[] }[] = [];
  const kolumny: { dzial: string; lista: T[] }[] = [];
  for (const dzial of kolejnoscDzialow) {
    const zDzialu = posortowane.filter((a) => a.dzial === dzial);
    if (!zDzialu.some((a) => !uzyte.has(a.id))) continue;
    if (sekcje.length < 2) {
      const [wiodacy, ...lista] = wez(zDzialu, 4);
      sekcje.push({ dzial, wiodacy, lista });
    } else if (kolumny.length < 3) kolumny.push({ dzial, lista: wez(zDzialu, 4) });
  }
  return { glowny, obok, najnowsze, sekcje, kolumny };
}
