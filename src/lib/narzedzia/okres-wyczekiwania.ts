// Okres wyczekiwania na zasiłek chorobowy (ustawa zasiłkowa, t.j. Dz.U. 2026 poz. 854; zmiany Dz.U. 2026 poz. 26
// i 1123 nie dotyczą art. 4):
// - art. 4 ust. 1: prawo do zasiłku po upływie 30 dni nieprzerwanego ubezpieczenia chorobowego, gdy ubezpieczenie jest
//   obowiązkowe (umowa o pracę), po 90 dniach, gdy dobrowolne (umowa zlecenia, działalność);
// - art. 4 ust. 2: wlicza się poprzednie okresy ubezpieczenia chorobowego, jeżeli przerwa nie przekroczyła 30 dni albo była
//   spowodowana urlopem wychowawczym, urlopem bezpłatnym lub czynną służbą wojskową żołnierza niezawodowego;
// - art. 4 ust. 3: od pierwszego dnia ubezpieczenia: absolwenci objęci ubezpieczeniem w ciągu 90 dni od ukończenia szkoły,
//   uczelni lub szkoły doktorskiej (pkt 1), niezdolność wskutek wypadku w drodze do pracy lub z pracy (pkt 2), ubezpieczeni
//   obowiązkowo z wcześniejszym co najmniej 10-letnim okresem obowiązkowego ubezpieczenia chorobowego (pkt 3);
//   pkt 4–5 (posłowie, senatorowie, dawni funkcjonariusze Służby Celnej) pomijamy;
// - art. 9 ust. 3: niezdolności w okresie wyczekiwania nie wlicza się do okresu zasiłkowego;
// - art. 92 § 3 pkt 2 Kodeksu pracy: wynagrodzenie chorobowe nie przysługuje, gdy pracownik nie ma prawa do zasiłku,
//   więc okres wyczekiwania dotyczy też pierwszych dni L4 płaconych przez pracodawcę;
// - art. 8 ust. 1–2 ustawy wypadkowej (t.j. Dz.U. 2025 poz. 1644): zasiłek z ubezpieczenia wypadkowego (wypadek przy pracy,
//   choroba zawodowa) niezależnie od okresu ubezpieczenia, od pierwszego dnia niezdolności.
// Interpretacje:
// 1. „Po upływie 30 dni” od dnia początku ubezpieczenia: prawo od 31. dnia (1 marca → 31 marca), art. 111 § 2 KC nie
//    dotyczy, bo pierwszy dzień ubezpieczenia jest dniem ubezpieczenia.
// 2. Dni ubezpieczenia liczymy kalendarzowo, wliczając pierwszy i ostatni dzień; przerwa to dni między końcem poprzedniego
//    a początkiem następnego okresu (bez nich). Wcześniejsze okresy liczą się do obecnego, dopóki każda przerwa po drodze
//    nie przekracza 30 dni albo była spowodowaną urlopem wychowawczym, bezpłatnym lub służbą wojskową.
// 3. Do 90 dni przy ubezpieczeniu dobrowolnym wliczamy też wcześniejsze okresy ubezpieczenia obowiązkowego: art. 4 ust. 2
//    mówi o „poprzednich okresach ubezpieczenia chorobowego” bez rozróżnienia.
// 4. Gdy L4 zaczęło się w okresie wyczekiwania i trwa dalej, zasiłek (wynagrodzenie chorobowe) przysługuje za dni od
//    nabycia prawa: art. 4 ust. 1 daje prawo „po upływie” okresu, a art. 9 ust. 3 wyłącza z okresu zasiłkowego tylko dni
//    sprzed niego.
import { dniMiedzy, dodajDni } from './terminy';

export type RodzajUbezpieczenia = 'obowiazkowe' | 'dobrowolne';

export const DNI_WYCZEKIWANIA: Record<RodzajUbezpieczenia, number> = { obowiazkowe: 30, dobrowolne: 90 };
export const MAKS_PRZERWA = 30;
export const DNI_ABSOLWENTA = 90;

export interface OkresUbezpieczenia {
  od: string;
  do: string;
  /** Przerwa po tym okresie wynikała z urlopu wychowawczego, bezpłatnego albo czynnej służby wojskowej. */
  przerwaUsprawiedliwiona?: boolean;
}

export type Wyjatek = 'absolwent' | 'wypadek-w-drodze' | 'dziesiec-lat' | 'wypadek-przy-pracy';

export interface DaneWyczekiwania {
  rodzaj: RodzajUbezpieczenia;
  /** Pierwszy dzień obecnego ubezpieczenia chorobowego. */
  start: string;
  /** Wcześniejsze okresy ubezpieczenia chorobowego (dowolna kolejność). */
  poprzednie?: OkresUbezpieczenia[];
  /** Dzień ukończenia szkoły, uczelni albo szkoły doktorskiej (uzyskania dyplomu). */
  ukonczenieSzkoly?: string;
  /** Niezdolność wskutek wypadku w drodze do pracy lub z pracy. */
  wypadekWDrodze?: boolean;
  /** Wypadek przy pracy albo choroba zawodowa (zasiłek z ubezpieczenia wypadkowego). */
  wypadekPrzyPracy?: boolean;
  /** Co najmniej 10 lat obowiązkowego ubezpieczenia chorobowego wcześniej (tylko przy obowiązkowym). */
  dziesiecLat?: boolean;
  /** Pierwszy dzień L4 (opcjonalnie). */
  l4Od?: string;
}

export function okresWyczekiwania(d: DaneWyczekiwania) {
  const potrzeba = DNI_WYCZEKIWANIA[d.rodzaj];
  if (!potrzeba) throw new RangeError('Nieznany rodzaj ubezpieczenia');
  const poprzednie = [...(d.poprzednie ?? [])].sort((a, b) => (a.od < b.od ? -1 : 1));
  for (const p of poprzednie) {
    if (p.do < p.od) throw new RangeError('Koniec okresu przed początkiem');
    if (p.do >= d.start) throw new RangeError('Wcześniejszy okres musi skończyć się przed obecnym ubezpieczeniem');
  }
  for (let i = 1; i < poprzednie.length; i++) if (poprzednie[i].od <= poprzednie[i - 1].do) throw new RangeError('Okresy nachodzą na siebie');

  // Wyjątki z art. 4 ust. 3 i art. 8 ustawy wypadkowej.
  let wyjatek: Wyjatek | null = null;
  if (d.wypadekPrzyPracy) wyjatek = 'wypadek-przy-pracy';
  else if (d.wypadekWDrodze) wyjatek = 'wypadek-w-drodze';
  else if (d.ukonczenieSzkoly && d.ukonczenieSzkoly <= d.start && dniMiedzy(d.ukonczenieSzkoly, d.start) <= DNI_ABSOLWENTA) wyjatek = 'absolwent';
  else if (d.dziesiecLat && d.rodzaj === 'obowiazkowe') wyjatek = 'dziesiec-lat';

  // Łańcuch wcześniejszych okresów od najnowszego wstecz (interpretacja 2).
  let wliczone = 0;
  let wliczonychOkresow = 0;
  let nastepnyStart = d.start;
  for (let i = poprzednie.length - 1; i >= 0; i--) {
    const p = poprzednie[i];
    const przerwa = dniMiedzy(p.do, nastepnyStart) - 1;
    if (przerwa > MAKS_PRZERWA && !p.przerwaUsprawiedliwiona) break;
    wliczone += dniMiedzy(p.od, p.do) + 1;
    wliczonychOkresow++;
    nastepnyStart = p.od;
  }
  const brakuje = wyjatek ? 0 : Math.max(0, potrzeba - wliczone);
  const prawoOd = dodajDni(d.start, brakuje);

  let l4: { bezPlatnosci: number; platneOd: string } | null = null;
  if (d.l4Od) {
    if (d.l4Od < d.start) throw new RangeError('L4 przed początkiem ubezpieczenia');
    l4 = { bezPlatnosci: d.l4Od >= prawoOd ? 0 : dniMiedzy(d.l4Od, prawoOd), platneOd: d.l4Od >= prawoOd ? d.l4Od : prawoOd };
  }
  return {
    potrzeba,
    wliczone,
    wliczonychOkresow,
    brakuje,
    wyjatek,
    prawoOd,
    /** Ostatni dzień bez prawa do zasiłku (null, gdy prawo od pierwszego dnia). */
    ostatniBezPrawa: brakuje > 0 ? dodajDni(prawoOd, -1) : null,
    l4,
  };
}
