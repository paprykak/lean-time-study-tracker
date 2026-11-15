// Terminy w latach i miesiącach (art. 112 Kodeksu cywilnego, w prawie pracy przez art. 300 Kodeksu pracy). Daty jako
// RRRR-MM-DD, liczone w UTC. Jedna konwencja dla wszystkich narzędzi (pakiet „wspólny kod”, 2026-11-13; decyzja w DECYZJE.md):
//
// 1. Termin od zdarzenia (dzień zdarzenia się nie wlicza: „3 miesiące od naruszenia”, „15 miesięcy od
//    rozwiązania umowy”, „5 lat od dnia wydania”): kończy się z upływem dnia, który datą odpowiada dniowi zdarzenia,
//    a gdy takiego dnia w ostatnim miesiącu nie ma, z upływem ostatniego dnia tego miesiąca (art. 112 zd. 1 KC):
//    `dodajMiesiace` (31 sierpnia + 6 miesięcy = 28 lutego, 29 lutego + 1 rok = 28 lutego).
// 2. Okres od początku dnia (pierwszy dzień się wlicza: umowa, okres próbny, urlop, staż, „3 miesiące zatrudnienia”):
//    kończy się z upływem dnia poprzedzającego dzień, który datą odpowiada pierwszemu dniowi, a gdy takiego dnia
//    w ostatnim miesiącu nie ma, z upływem ostatniego dnia tego miesiąca (art. 112 zd. 1 KC, jak w zdaniu 2 dla wieku):
//    `koniecOkresu` (1 marca + 3 miesiące = 31 maja, 31 marca + 6 miesięcy = 30 września, 30 listopada + 3 miesiące =
//    28 lutego, a w roku przestępnym 29 lutego). Pełne miesiące takiego okresu liczy `pelneMiesiace`.
// 3. Okres wypowiedzenia w tygodniach i miesiącach kończy się w sobotę albo ostatniego dnia miesiąca (art. 30 § 2^1 Kp):
//    to przepis szczególny, liczy go `wypowiedzenie.ts`.
// 4. Wiek: kolejny rok życia kończy się z początkiem dnia urodzin (art. 112 zd. 2 KC): `dodajLata(urodzenie, n)` to
//    pierwszy dzień po ukończeniu n lat.
// Regułę „dzień przed dniem odpowiadającym datą” stosuje praktyka prawa pracy (np. A. Kuźniar, „Kiedy zakończyć terminową
// umowę o pracę”, rp.pl 2012; G. Ordak, rp.pl 2016; kadry.infor.pl „Terminy w prawie pracy”). W przypadku, gdy takiego dnia
// w ostatnim miesiącu nie ma, żadne znalezione źródło nie rozstrzyga wprost: przyjmujemy literę art. 112 zd. 1 KC
// (ostatni dzień miesiąca). Drugie odczytanie (dzień przed ostatnim dniem, np. 27 lutego) strony narzędzi podają tam,
// gdzie byłoby korzystniejsze dla pracownika (limit 33 miesięcy, okres próbny).
// Odstępstwa od pkt 2 są w narzędziach opisane jako wariant bezpieczny dla pracownika, gdy przepis nie rozstrzyga
// (umowa na zastępstwo: upływ 3. miesiąca ciąży; praca cudzoziemca: okno na podjęcie pracy), a w drugą stronę szkolenie
// okresowe BHP: „do 6 (12) miesięcy od rozpoczęcia pracy” liczymy jak okres z pierwszym dniem (pkt 2), bo wychodzi wcześniej.

import { swieta } from './czas-pracy';

const DZIEN_MS = 86_400_000;

/** Czy tekst to poprawna data RRRR-MM-DD (także sprawdza, że dzień istnieje). */
export function poprawnaData(data: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return false;
  const [r, m, d] = data.split('-').map(Number);
  const t = new Date(Date.UTC(r, m - 1, d));
  return t.getUTCFullYear() === r && t.getUTCMonth() === m - 1 && t.getUTCDate() === d;
}

/** Termin od zdarzenia według art. 112 KC: dzień, który datą odpowiada `data`, albo ostatni dzień miesiąca (pkt 1). */
export function dodajMiesiace(data: string, miesiace: number): string {
  const [r, m, d] = data.split('-').map(Number);
  const indeks = r * 12 + (m - 1) + miesiace;
  const rok = Math.floor(indeks / 12);
  const miesiac = indeks - rok * 12;
  const ostatni = new Date(Date.UTC(rok, miesiac + 1, 0)).getUTCDate();
  return new Date(Date.UTC(rok, miesiac, Math.min(d, ostatni))).toISOString().slice(0, 10);
}

export const dodajLata = (data: string, lata: number) => dodajMiesiace(data, lata * 12);

const ostatniDzien = (rok: number, miesiac0: number) => new Date(Date.UTC(rok, miesiac0 + 1, 0)).getUTCDate();

/**
 * Ostatni dzień okresu `miesiace` miesięcy liczonego od początku dnia `od` (dzień `od` wliczony): dzień przed dniem,
 * który datą odpowiada dniowi `od`, a gdy takiego dnia w ostatnim miesiącu nie ma, ostatni dzień tego miesiąca.
 * Dla `miesiace` = 0 dzień przed `od` (okres pusty).
 */
export function koniecOkresu(od: string, miesiace: number): string {
  if (!Number.isInteger(miesiace) || miesiace < 0) throw new RangeError(`Okres: ${miesiace} miesięcy`);
  const [r, m, d] = od.split('-').map(Number);
  const indeks = r * 12 + (m - 1) + miesiace;
  const rok = Math.floor(indeks / 12);
  const miesiac0 = indeks - rok * 12;
  const ostatni = ostatniDzien(rok, miesiac0);
  if (d > ostatni) return new Date(Date.UTC(rok, miesiac0, ostatni)).toISOString().slice(0, 10);
  return new Date(Date.UTC(rok, miesiac0, d - 1)).toISOString().slice(0, 10);
}

/**
 * Pełne miesiące okresu od `od` do `ostatni` (oba dni włącznie), np. staż od pierwszego dnia pracy: największe `m`,
 * dla którego `koniecOkresu(od, m)` nie wypada po `ostatni`. Od 31 sierpnia do 28 lutego: 6 miesięcy.
 */
export function pelneMiesiace(od: string, ostatni: string): number {
  if (ostatni < od) return 0;
  const [r1, m1] = od.split('-').map(Number);
  const [r2, m2] = ostatni.split('-').map(Number);
  // Okres od 1. dnia miesiąca kończy się ostatniego dnia miesiąca, więc pełnych miesięcy bywa o jeden więcej niż różnicy.
  let m = (r2 - r1) * 12 + (m2 - m1) + 1;
  while (m > 0 && koniecOkresu(od, m) > ostatni) m--;
  return m;
}

/** Dodaje (albo odejmuje) dni kalendarzowe. */
export const dodajDni = (data: string, dni: number) => new Date(Date.parse(`${data}T00:00:00Z`) + dni * DZIEN_MS).toISOString().slice(0, 10);

/** Liczba dni od `od` do `do` (ujemna, gdy `do` jest wcześniej). */
export const dniMiedzy = (od: string, do_: string) => Math.round((Date.parse(`${do_}T00:00:00Z`) - Date.parse(`${od}T00:00:00Z`)) / DZIEN_MS);

/** Dzisiejsza data w Polsce (RRRR-MM-DD), niezależnie od strefy urządzenia. */
export const dzisWPolsce = (teraz = new Date()) =>
  new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Warsaw', year: 'numeric', month: '2-digit', day: '2-digit' }).format(teraz);

const DATA_PL = new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
/** „2027-03-15” → „15 marca 2027 r.” */
export const dataPoPolsku = (data: string) => `${DATA_PL.format(new Date(`${data}T00:00:00Z`))} r.`;

/** „za 45 dni”, „jutro”, „dziś”, „3 dni temu”. */
export function ileDni(dni: number): string {
  const n = Math.abs(dni);
  const slowo = n === 1 ? 'dzień' : 'dni';
  if (dni === 0) return 'dziś';
  if (dni === 1) return 'jutro';
  if (dni === -1) return 'wczoraj';
  return dni > 0 ? `za ${n} ${slowo}` : `${n} ${slowo} temu`;
}

// ---------------------------------------------------------------------------------------------------------------------
// Termin, który musi zachować pracownik, a art. 115 Kodeksu cywilnego (pakiet „terminy”, DECYZJE.md 2026-11-15).
// Art. 115 KC (t.j. Dz.U. 2026 poz. 795): „Jeżeli koniec terminu do wykonania czynności przypada na dzień uznany
// ustawowo za wolny od pracy lub na sobotę, termin upływa następnego dnia, który nie jest dniem wolnym od pracy ani
// sobotą.” W prawie pracy stosuje się go przez art. 300 Kp, w postępowaniu sądowym przez art. 165 § 1 KPC. Dni ustawowo
// wolne od pracy: niedziele i święta z art. 1 ustawy o dniach wolnych od pracy (`swieta` z czas-pracy.ts, z Wigilią od
// 2025 r.). Jedna konwencja dla wszystkich kalkulatorów terminów pracownika: gdy daty się różnią, wynik pokazuje
// „Zdąż do” (data bez przesunięcia, bezpieczna zawsze) i „Ostatni dzień według art. 115 KC” z jednym zdaniem, kiedy
// przesunięcie działa (`ZDANIE_ART_115`). Terminy pracodawcy i granice okresów (nie czynność pracownika) narzędzia
// podają bez przesunięcia (`BEZ_PRZESUNIECIA`).
export const ETYKIETA_ZDAZ_DO = 'Zdąż do';
export const ETYKIETA_ART_115 = 'Ostatni dzień według art. 115 KC';

/** Nazwa dnia, z którego art. 115 KC przesuwa koniec terminu („sobota”, „niedziela”, nazwa święta), albo null. */
export function dzienWolnyArt115(data: string): string | null {
  const swieto = swieta(Number(data.slice(0, 4))).find((s) => s.data === data);
  if (swieto) return swieto.nazwa;
  const dt = new Date(`${data}T00:00:00Z`).getUTCDay();
  return dt === 0 ? 'niedziela' : dt === 6 ? 'sobota' : null;
}

export interface TerminPracownika {
  /** Ostatni dzień z liczby dni, tygodni, miesięcy albo lat, bez przesunięcia: „zdąż do”. */
  zdazDo: string;
  /** Ostatni dzień po przesunięciu z soboty i dnia ustawowo wolnego od pracy (art. 115 KC); równy `zdazDo`, gdy to dzień roboczy. */
  wedlugArt115: string;
  /** Czy daty się różnią (koniec wypada w sobotę albo dzień wolny). */
  rozne: boolean;
  /** Dni, z których przesunięto koniec, po kolei: nazwa święta, „sobota” albo „niedziela”. */
  wolne: { data: string; powod: string }[];
}

/** Koniec terminu pracownika bez przesunięcia i po przesunięciu z art. 115 KC. */
export function terminPracownika(koniec: string): TerminPracownika {
  if (!poprawnaData(koniec)) throw new RangeError(`Błędna data końca terminu: ${koniec}`);
  const wolne: { data: string; powod: string }[] = [];
  let d = koniec;
  for (let p = dzienWolnyArt115(d); p; p = dzienWolnyArt115(d)) {
    wolne.push({ data: d, powod: p });
    d = dodajDni(d, 1);
  }
  return { zdazDo: koniec, wedlugArt115: d, rozne: d !== koniec, wolne };
}

/** Rodzaj terminu pracownika: pismo do sądu, pismo do pracodawcy albo przedawnienie roszczenia. */
export type RodzajTerminu = 'sad' | 'pracodawca' | 'przedawnienie';

const NAZWA_DNIA = (powod: string) => (powod === 'sobota' || powod === 'niedziela' ? powod : `dzień wolny od pracy (${powod})`);

/**
 * Jedno zdanie pod dwiema datami: kiedy przesunięcie działa i jak pewne jest w tym rodzaju terminu.
 * Ten sam tekst w HTML ze strony i w skrypcie przeglądarki (skrypt przepuszcza go jeszcze przez typografia()).
 */
export function zdanieArt115(t: TerminPracownika, rodzaj: RodzajTerminu): string {
  if (!t.rozne) return '';
  const dzien = `${dataPoPolsku(t.zdazDo)} to ${NAZWA_DNIA(t.wolne[0].powod)}`;
  return `${dzien}: gdy koniec terminu wypada w sobotę albo dzień ustawowo wolny od pracy, upływa on następnego dnia, który nie jest dniem wolnym ani sobotą (art. 115 Kodeksu cywilnego). ${ZDANIE_ART_115[rodzaj]}`;
}

/** Jak pewne jest przesunięcie w danym rodzaju terminu (orzecznictwo sprawdzone w SAOS, raporty/terminy/PRZEPISY.md). */
export const ZDANIE_ART_115: Record<RodzajTerminu, string> = {
  sad: 'Bezpieczniej zdążyć do pierwszej daty.',
  pracodawca: 'Bezpieczniej zdążyć do pierwszej daty.',
  przedawnienie: 'Bezpieczniej zdążyć do pierwszej daty.',
};

/** Jedno zdanie, dlaczego terminy pracodawcy i granice okresów podajemy bez przesunięcia. */
export const BEZ_PRZESUNIECIA = {
  pracodawca: 'Terminy pracodawcy podajemy bez przesunięcia z soboty i dnia wolnego (art. 115 Kodeksu cywilnego), bo to nie Twoja czynność; gdy taki termin kończy się w dzień wolny, pracodawca może się powołać na przesunięcie na następny dzień roboczy.',
  okres: 'Koniec okresu podajemy bez przesunięcia z soboty i dnia wolnego: art. 115 Kodeksu cywilnego dotyczy terminów do wykonania czynności, a nie okresów, które po prostu mijają.',
};

/**
 * Gdzie jest dzień `dzis` względem terminu pracownika: przed końcem „zdąż do” (`dni` do niego), już po nim, ale nie po
 * dniu z art. 115 KC (`dni` do tego dnia), albo po obu (`dni` ujemne, od dnia z art. 115 KC).
 */
export function fazaTerminu(t: TerminPracownika, dzis: string): { faza: 'w-terminie' | 'tylko-art-115' | 'po-terminie'; dni: number } {
  if (dzis <= t.zdazDo) return { faza: 'w-terminie', dni: dniMiedzy(dzis, t.zdazDo) };
  if (dzis <= t.wedlugArt115) return { faza: 'tylko-art-115', dni: dniMiedzy(dzis, t.wedlugArt115) };
  return { faza: 'po-terminie', dni: dniMiedzy(dzis, t.wedlugArt115) };
}
