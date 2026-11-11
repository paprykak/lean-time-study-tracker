// Terminy badań UDT i przeglądów konserwacyjnych urządzeń transportu bliskiego (UTB): rozporządzenie z 30 października
// 2018 r. w sprawie warunków technicznych dozoru technicznego w zakresie eksploatacji UTB (Dz.U. 2018 poz. 2176, bez
// zmian według API Sejmu, sprawdzone 2026-11-11). Załącznik nr 1: forma dozoru i termin badania okresowego (dozór pełny)
// albo doraźnego kontrolnego (dozór ograniczony). Załącznik nr 2: przeglądy konserwacyjne, o ile instrukcja eksploatacji
// nie podaje innych terminów (§ 9 ust. 3). Terminy badań wyznacza się, podając miesiąc i rok (§ 22 ust. 1).
// Wybrane urządzenia spotykane w zakładach i magazynach; formę dozoru konkretnego urządzenia ustala decyzja UDT
// zezwalająca na eksploatację (art. 14 ust. 4 ustawy o dozorze technicznym).
import { dodajDni, dodajLata, dniMiedzy } from './terminy';

export type Forma = 'pelny' | 'ograniczony' | 'uproszczony';

export interface UrzadzenieUtb {
  id: string;
  grupa: 'Wózki jezdniowe' | 'Suwnice, wciągniki i żurawie' | 'Podesty, dźwigi i układnice' | 'Inne';
  nazwa: string;
  forma: Forma;
  /** Co ile lat badanie UDT (okresowe przy dozorze pełnym, doraźne kontrolne przy ograniczonym); null: brak. */
  badanieLat: number | null;
  /** Przegląd konserwacyjny co ile dni (zał. nr 2, bez rozróżnienia formy dozoru); null: termin zależy od rodzaju
   *  urządzenia albo instrukcji eksploatacji. */
  przegladDni: number | null;
  /** Pozycje w załącznikach: [zał. 1, zał. 2]. */
  lp: [number, number | null];
}

export const URZADZENIA: UrzadzenieUtb[] = [
  { id: 'wozek-siedzisko', grupa: 'Wózki jezdniowe', nazwa: 'Wózek widłowy i inny podnośnikowy z siedziskiem albo podestem operatora', forma: 'pelny', badanieLat: 1, przegladDni: 30, lp: [38, 33] },
  { id: 'wozek-prowadzony', grupa: 'Wózki jezdniowe', nazwa: 'Wózek podnośnikowy prowadzony albo zdalnie sterowany', forma: 'ograniczony', badanieLat: 2, przegladDni: 60, lp: [39, 34] },
  { id: 'wozek-wysiegnik', grupa: 'Wózki jezdniowe', nazwa: 'Wózek podnośnikowy z wysięgnikiem (np. ładowarka teleskopowa)', forma: 'pelny', badanieLat: 1, przegladDni: 30, lp: [36, 31] },
  { id: 'wozek-operator', grupa: 'Wózki jezdniowe', nazwa: 'Wózek z operatorem podnoszonym wraz z ładunkiem', forma: 'pelny', badanieLat: 1, przegladDni: 30, lp: [37, 32] },
  { id: 'suwnica-mech', grupa: 'Suwnice, wciągniki i żurawie', nazwa: 'Suwnica ogólnego przeznaczenia z napędem mechanicznym', forma: 'pelny', badanieLat: 2, przegladDni: 30, lp: [10, 7] },
  { id: 'suwnica-reczna', grupa: 'Suwnice, wciągniki i żurawie', nazwa: 'Suwnica z napędem ręcznym wszystkich mechanizmów', forma: 'ograniczony', badanieLat: 2, przegladDni: 90, lp: [9, 6] },
  { id: 'suwnica-specjalna', grupa: 'Suwnice, wciągniki i żurawie', nazwa: 'Suwnica specjalnego przeznaczenia', forma: 'pelny', badanieLat: 1, przegladDni: 30, lp: [11, 8] },
  { id: 'wciagnik-mech', grupa: 'Suwnice, wciągniki i żurawie', nazwa: 'Wciągnik albo wciągarka z napędem mechanicznym (poza jednofazowymi do 1000 kg)', forma: 'ograniczony', badanieLat: 2, przegladDni: 30, lp: [5, 3] },
  { id: 'wciagnik-reczny-duzy', grupa: 'Suwnice, wciągniki i żurawie', nazwa: 'Wciągnik albo wciągarka ręczna, udźwig powyżej 2000 kg', forma: 'ograniczony', badanieLat: 3, przegladDni: 90, lp: [4, 2] },
  { id: 'wciagnik-specjalny', grupa: 'Suwnice, wciągniki i żurawie', nazwa: 'Wciągnik albo wciągarka specjalnego przeznaczenia', forma: 'pelny', badanieLat: 1, przegladDni: 30, lp: [7, 4] },
  { id: 'zuraw-stacjonarny', grupa: 'Suwnice, wciągniki i żurawie', nazwa: 'Żuraw z napędem mechanicznym: stacjonarny (np. słupowy) albo przenośny do 3200 kg', forma: 'ograniczony', badanieLat: 2, przegladDni: 60, lp: [15, 11] },
  { id: 'ukladnica', grupa: 'Podesty, dźwigi i układnice', nazwa: 'Układnica magazynowa', forma: 'pelny', badanieLat: 1, przegladDni: 30, lp: [16, 12] },
  { id: 'podest-przejezdny', grupa: 'Podesty, dźwigi i układnice', nazwa: 'Podest ruchomy przejezdny (np. podnośnik koszowy albo nożycowy)', forma: 'pelny', badanieLat: 1, przegladDni: 30, lp: [18, 14] },
  { id: 'podest-stacjonarny', grupa: 'Podesty, dźwigi i układnice', nazwa: 'Podest ruchomy stacjonarny', forma: 'ograniczony', badanieLat: 2, przegladDni: 60, lp: [21, 17] },
  { id: 'podest-zaladowczy', grupa: 'Podesty, dźwigi i układnice', nazwa: 'Podest ruchomy załadowczy', forma: 'ograniczony', badanieLat: 3, przegladDni: 180, lp: [22, 18] },
  { id: 'wyciag', grupa: 'Podesty, dźwigi i układnice', nazwa: 'Wyciąg towarowy', forma: 'ograniczony', badanieLat: 2, przegladDni: 90, lp: [17, 13] },
  { id: 'dzwig', grupa: 'Podesty, dźwigi i układnice', nazwa: 'Dźwig (winda) do transportu osób lub ładunków', forma: 'pelny', badanieLat: 1, przegladDni: 30, lp: [26, 22] },
  { id: 'dzwig-towarowy-maly', grupa: 'Podesty, dźwigi i układnice', nazwa: 'Dźwig towarowy mały albo bez wstępu osób do kabiny', forma: 'pelny', badanieLat: 3, przegladDni: 60, lp: [27, 23] },
  { id: 'atex', grupa: 'Inne', nazwa: 'UTB w wersji przeciwwybuchowej (całość lub część)', forma: 'pelny', badanieLat: 1, przegladDni: 30, lp: [1, 1] },
  { id: 'jednofazowy', grupa: 'Inne', nazwa: 'Wciągnik albo wciągarka elektryczna jednofazowa do 1000 kg', forma: 'uproszczony', badanieLat: null, przegladDni: 30, lp: [6, 3] },
  { id: 'wciagnik-reczny-maly', grupa: 'Inne', nazwa: 'Wciągnik albo wciągarka ręczna do 2000 kg', forma: 'uproszczony', badanieLat: null, przegladDni: 90, lp: [3, 2] },
  { id: 'do-250', grupa: 'Inne', nazwa: 'UTB o udźwigu do 250 kg (bez dźwigów i urządzeń dla osób)', forma: 'uproszczony', badanieLat: null, przegladDni: null, lp: [2, null] },
];

export const FORMY: Record<Forma, { nazwa: string; badanie: string | null }> = {
  pelny: { nazwa: 'pełny', badanie: 'badanie okresowe' },
  ograniczony: { nazwa: 'ograniczony', badanie: 'badanie doraźne kontrolne' },
  uproszczony: { nazwa: 'uproszczony', badanie: null },
};

export const GRUPY = [...new Set(URZADZENIA.map((u) => u.grupa))];

export const urzadzenie = (id: string) => URZADZENIA.find((u) => u.id === id);

export const co = (lat: number) => (lat === 1 ? 'co rok' : `co ${lat} lata`);

export type StatusTerminu = 'po-terminie' | 'pilne' | 'wkrotce' | 'w-terminie';

export interface TerminyUtb {
  /** Kolejne badanie UDT, „RRRR-MM” (§ 22 ust. 1). */
  badanie: string | null;
  /** Ile pełnych miesięcy kalendarzowych do miesiąca badania (ujemne: po terminie). */
  miesiecyDoBadania: number | null;
  statusBadania: StatusTerminu | null;
  przeglad: string | null;
  dniDoPrzegladu: number | null;
  statusPrzegladu: StatusTerminu | null;
}

/** Kolejne badanie UDT (miesiąc i rok) i kolejny przegląd konserwacyjny według załączników. */
export function terminyUtb(u: UrzadzenieUtb, ostatnieBadanie: string | null, ostatniPrzeglad: string | null, dzis: string): TerminyUtb {
  const badanie = u.badanieLat && ostatnieBadanie ? dodajLata(ostatnieBadanie, u.badanieLat).slice(0, 7) : null;
  const przeglad = u.przegladDni && ostatniPrzeglad ? dodajDni(ostatniPrzeglad, u.przegladDni) : null;
  const [rd, md] = dzis.split('-').map(Number);
  const miesiecyDoBadania = badanie ? (Number(badanie.slice(0, 4)) - rd) * 12 + Number(badanie.slice(5, 7)) - md : null;
  const dniDoPrzegladu = przeglad ? dniMiedzy(dzis, przeglad) : null;
  return {
    badanie,
    miesiecyDoBadania,
    statusBadania: miesiecyDoBadania === null ? null : miesiecyDoBadania < 0 ? 'po-terminie' : miesiecyDoBadania === 0 ? 'pilne' : miesiecyDoBadania <= 2 ? 'wkrotce' : 'w-terminie',
    przeglad,
    dniDoPrzegladu,
    statusPrzegladu: dniDoPrzegladu === null ? null : dniDoPrzegladu < 0 ? 'po-terminie' : dniDoPrzegladu <= 3 ? 'pilne' : dniDoPrzegladu <= 14 ? 'wkrotce' : 'w-terminie',
  };
}

const odmianaMiesiecy = (n: number) => (n === 1 ? 'miesiąc' : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? 'miesiące' : 'miesięcy');

/** „w tym miesiącu”, „za 4 miesiące”, „2 miesiące temu”. */
export function ileMiesiecy(n: number): string {
  if (n === 0) return 'w tym miesiącu';
  const m = Math.abs(n);
  return n > 0 ? `za ${m} ${odmianaMiesiecy(m)}` : `${m} ${odmianaMiesiecy(m)} temu`;
}
