// Planowanie okresu rozliczeniowego w systemach z przedłużonym dobowym wymiarem czasu pracy: ile zmian danej
// długości wypełni wymiar, czy okres jest dopuszczalny dla systemu i ile dni wolnych wyjdzie.
//
// Przepisy (Kodeks pracy, t.j. Dz.U. 2026 poz. 1245):
// - art. 135 § 1: równoważny do 12 h, okres do 1 miesiąca; przedłużony wymiar równoważony krótszym dniem albo dniami
//   wolnymi; § 2: do 3 miesięcy w szczególnie uzasadnionych przypadkach; § 3: do 4 miesięcy przy pracach zależnych
//   od pory roku lub warunków atmosferycznych;
// - art. 136 § 1: do 16 h przy dozorze urządzeń lub częściowym pozostawaniu w pogotowiu, okres do 1 miesiąca;
//   § 2: po każdej zmianie w przedłużonym wymiarze odpoczynek co najmniej równy liczbie przepracowanych godzin;
// - art. 137: do 24 h przy pilnowaniu mienia, ochronie osób, w zakładowych strażach pożarnych i służbach
//   ratowniczych, okres do 1 miesiąca; art. 135 § 2 i 3 oraz art. 136 § 2 stosuje się odpowiednio (więc też 3 i 4 mies.);
// - art. 143: skrócony tydzień (na wniosek, mniej niż 5 dni w tygodniu, do 12 h, okres do 1 miesiąca);
// - art. 144: weekendowy (na wniosek, wyłącznie piątki, soboty, niedziele i święta, do 12 h, okres do 1 miesiąca);
// - art. 129 § 2: w każdym systemie okres można przedłużyć do 12 miesięcy z przyczyn obiektywnych, technicznych lub
//   organizacyjnych; art. 150 § 2: okres z art. 135 § 2–3 bez zgody związków po zawiadomieniu okręgowego inspektora
//   pracy; § 3–4: przedłużenie z art. 129 § 2 w układzie albo porozumieniu, kopia do OIP w 5 dni roboczych;
// - art. 130 (wymiar, `wymiarOkresu`), art. 128 § 3 pkt 2 (tydzień od pierwszego dnia okresu), art. 134 § 1 (przerwy),
//   art. 147 (dni wolne przy pracy w niedziele i święta), art. 148 (najwyżej 8 h), art. 151 § 1 (nadgodziny).
//
// Przyjęte interpretacje:
// - Etat pełny. Przy niepełnym wymiar i liczba zmian zależą od umowy, a przepisy systemu się nie zmieniają; narzędzie
//   tego nie liczy.
// - Okres zaczyna się 1. dnia wybranego miesiąca i trwa 1, 2, 3, 4, 6 albo 12 miesięcy.
// - Zmiana dłuższa niż 8 h i nie dłuższa niż maksimum systemu, co 0,5 h. Zmiana do 8 h to system podstawowy.
// - Wymiar W wypełniamy n = floor(W / L) pełnymi zmianami i jedną krótszą zmianą r = W − n·L (gdy r > 0); dni pracy
//   d = ceil(W / L). Kodeks nie mówi, jak rozłożyć resztę godzin (art. 135 § 1: „krótszym dobowym wymiarem czasu pracy
//   w niektórych dniach lub dniami wolnymi”), więc to tylko jeden z możliwych rozkładów.
// - Minimum dni wolnych z art. 147 = dni kalendarzowe − W / 8: W / 8 to dni od poniedziałku do piątku bez świąt
//   obniżających wymiar, czyli dni pracy w przeciętnie pięciodniowym tygodniu; reszta to niedziele, święta i dni
//   wolne z pięciodniowego tygodnia.
// - Status okresu: 1 miesiąc wprost; równoważny 12 h i 24 h: 2–3 miesiące z art. 135 § 2, 4 miesiące z art. 135 § 3,
//   a w obu przypadkach także po przedłużeniu z art. 129 § 2 (dotyczy każdego systemu); 16 h, weekendowy i skrócony
//   tydzień ponad 1 miesiąc oraz każdy system ponad 4 miesiące tylko po przedłużeniu z art. 129 § 2.
// - 16 h i 24 h: odpoczynek po zmianie co najmniej L h (art. 136 § 2, art. 137). Rytm najgęstszy: zmiana i odpoczynek
//   po niej, czyli 2L h; w okresie D dni mieści się najwyżej floor(24·D / (2L)) takich par (informacja, bez reszty
//   zmian po ostatniej).
// - Weekendowy: dni dostępne to piątki, soboty, niedziele i święta z ustawy o dniach wolnych od pracy (święto w pt–nd
//   liczymy raz); najwięcej godzin = dostępne · L. Skrócony tydzień: tygodnie od 1. dnia okresu, w każdym najwyżej
//   4 dni pracy, w ostatnim niepełnym najwyżej min(4, liczba jego dni). Gdy to mniej niż wymiar, pokazujemy brak
//   godzin; Kodeks nie mówi, co wtedy.

import { dniWMiesiacu, swieta, wymiarOkresu } from './czas-pracy';
import { godz } from './format';
import { dataPoPolsku } from './terminy';
import { odmiana } from '../redakcja';

export type SystemRownowazny = 'r12' | 'r16' | 'r24' | 'weekendowy' | 'skrocony';

export const SYSTEMY: Record<SystemRownowazny, { nazwa: string; maks: number; podstawa: string }> = {
  r12: { nazwa: 'Równoważny do 12 h', maks: 12, podstawa: 'art. 135 § 1 Kp' },
  r16: { nazwa: 'Równoważny do 16 h (dozór)', maks: 16, podstawa: 'art. 136 § 1 Kp' },
  r24: { nazwa: 'Równoważny do 24 h (ochrona)', maks: 24, podstawa: 'art. 137 Kp' },
  weekendowy: { nazwa: 'Weekendowy', maks: 12, podstawa: 'art. 144 Kp' },
  skrocony: { nazwa: 'Skrócony tydzień', maks: 12, podstawa: 'art. 143 Kp' },
};

export const OKRESY = [1, 2, 3, 4, 6, 12] as const;

export type RodzajStatusu = 'wprost' | 'szczegolne' | 'pora-roku' | 'przedluzenie';

export interface StatusOkresu {
  rodzaj: RodzajStatusu;
  opis: string;
  podstawa: string;
}

/** Czy okres rozliczeniowy danej długości jest dopuszczalny w systemie i na jakiej podstawie. */
export function statusOkresu(system: SystemRownowazny, miesiecy: number): StatusOkresu {
  if (!Number.isInteger(miesiecy) || miesiecy < 1 || miesiecy > 12) throw new RangeError('Okres rozliczeniowy: od 1 do 12 miesięcy');
  if (miesiecy === 1) return { rodzaj: 'wprost', opis: `dopuszczalny wprost (${SYSTEMY[system].podstawa})`, podstawa: SYSTEMY[system].podstawa };
  const z135 = system === 'r12' || system === 'r24';
  const odpowiednio = system === 'r24' ? ' w związku z art. 137' : '';
  // Art. 129 § 2 pozwala przedłużyć okres w każdym systemie, więc art. 135 § 2–3 nie jest jedyną drogą.
  if (z135 && miesiecy <= 3)
    return {
      rodzaj: 'szczegolne',
      opis: `w szczególnie uzasadnionych przypadkach (art. 135 § 2${odpowiednio} Kp) albo po przedłużeniu z art. 129 § 2`,
      podstawa: `art. 135 § 2${odpowiednio} albo art. 129 § 2 Kp`,
    };
  if (z135 && miesiecy === 4)
    return {
      rodzaj: 'pora-roku',
      opis: `przy pracach zależnych od pory roku lub pogody (art. 135 § 3${odpowiednio} Kp) albo po przedłużeniu z art. 129 § 2`,
      podstawa: `art. 135 § 3${odpowiednio} albo art. 129 § 2 Kp`,
    };
  return {
    rodzaj: 'przedluzenie',
    opis: 'tylko po przedłużeniu z przyczyn obiektywnych, technicznych lub organizacyjnych (art. 129 § 2 Kp), w układzie zbiorowym albo porozumieniu (art. 150 § 3)',
    podstawa: 'art. 129 § 2 i art. 150 § 3 Kp',
  };
}

/** Przerwy 15-minutowe wliczane do czasu pracy przy dobowym wymiarze `godziny` (art. 134 § 1 Kp). */
export const przerwy = (godziny: number) => (godziny >= 6 ? 1 : 0) + (godziny > 9 ? 1 : 0) + (godziny > 16 ? 1 : 0);

const iso = (t: number) => new Date(t).toISOString().slice(0, 10);
const DZIEN_MS = 86_400_000;

/** Daty kolejnych dni okresu (RRRR-MM-DD). */
function dniOkresu(rok: number, miesiacStart: number, miesiecy: number): string[] {
  const start = Date.UTC(rok, miesiacStart - 1, 1);
  let d = 0;
  for (let i = 0; i < miesiecy; i++) {
    const indeks = miesiacStart - 1 + i;
    d += dniWMiesiacu(rok + Math.floor(indeks / 12), (indeks % 12) + 1);
  }
  return Array.from({ length: d }, (_, i) => iso(start + i * DZIEN_MS));
}

/** Piątki, soboty, niedziele i święta w okresie (art. 144 Kp); święto w pt–nd liczy się raz. */
export function dniWeekendowe(rok: number, miesiacStart: number, miesiecy: number): number {
  const dni = dniOkresu(rok, miesiacStart, miesiecy);
  const lata = [...new Set(dni.map((d) => Number(d.slice(0, 4))))];
  const sw = new Set(lata.flatMap((r) => swieta(r).map((s) => s.data)));
  return dni.filter((d) => {
    const t = new Date(`${d}T00:00:00Z`).getUTCDay();
    return t === 5 || t === 6 || t === 0 || sw.has(d);
  }).length;
}

/** Najwięcej dni pracy w skróconym tygodniu: tygodnie od 1. dnia okresu, w każdym do 4 dni (art. 143, 128 § 3 pkt 2 Kp). */
export function dniSkroconegoTygodnia(rok: number, miesiacStart: number, miesiecy: number): number {
  const D = dniOkresu(rok, miesiacStart, miesiecy).length;
  let suma = 0;
  for (let i = 0; i < D; i += 7) suma += Math.min(4, D - i);
  return suma;
}

export interface WynikRownowazny {
  system: SystemRownowazny;
  zmiana: number;
  /** Pierwszy i ostatni dzień okresu, RRRR-MM-DD. */
  od: string;
  do: string;
  miesiecy: number;
  status: StatusOkresu;
  /** Wymiar okresu dla pełnego etatu, h (art. 130). */
  wymiar: number;
  dniKalendarzowe: number;
  pelneZmiany: number;
  /** Godziny krótszej zmiany; 0, gdy wymiar dzieli się bez reszty. */
  reszta: number;
  dniPracy: number;
  dniWolne: number;
  /** Najmniej dni wolnych z art. 147: niedziele, święta i dni wolne z pięciodniowego tygodnia. */
  minimumWolnych: number;
  przerwy: number;
  przerwyReszty: number;
  /** Odpoczynek po zmianie (16 h i 24 h, art. 136 § 2), h; null w innych systemach. */
  odpoczynek: number | null;
  /** Najwięcej par „zmiana + odpoczynek” w okresie (16 h i 24 h); null w innych systemach. */
  maksZmianRytm: number | null;
  /** Dni, w które wolno pracować, i ile godzin się w nich zmieści (weekendowy, skrócony); null w innych. */
  dostepneDni: number | null;
  dostepneGodziny: number | null;
  /** Godziny wymiaru, których nie da się zaplanować w dostępnych dniach; 0, gdy się mieści. */
  brakuje: number;
}

/** Plan okresu rozliczeniowego dla zmian długości `zmiana` h. RangeError przy złych danych. */
export function planOkresu(system: SystemRownowazny, zmiana: number, rok: number, miesiacStart: number, miesiecy: number): WynikRownowazny {
  const s = SYSTEMY[system];
  if (!s) throw new RangeError(`Nieznany system: ${system}`);
  if (!Number.isFinite(zmiana) || zmiana <= 0) throw new RangeError('Długość zmiany musi być dodatnia');
  if (zmiana <= 8) throw new RangeError('Zmiana do 8 h to system podstawowy');
  if (zmiana > s.maks) throw new RangeError(`W tym systemie zmiana najwyżej ${s.maks} h`);
  if (!Number.isInteger(zmiana * 2)) throw new RangeError('Długość zmiany co pół godziny');
  if (!Number.isInteger(rok) || rok < 2000 || rok > 2100) throw new RangeError('Rok spoza zakresu');
  if (!Number.isInteger(miesiacStart) || miesiacStart < 1 || miesiacStart > 12) throw new RangeError('Miesiąc spoza zakresu');
  if (!(OKRESY as readonly number[]).includes(miesiecy)) throw new RangeError('Okres: 1, 2, 3, 4, 6 albo 12 miesięcy');

  const status = statusOkresu(system, miesiecy);
  const w = wymiarOkresu(rok, miesiacStart, miesiecy);
  const dni = dniOkresu(rok, miesiacStart, miesiecy);
  const D = dni.length;
  const W = w.godziny;
  const pelneZmiany = Math.floor(W / zmiana);
  const reszta = W - pelneZmiany * zmiana;
  const dniPracy = Math.ceil(W / zmiana);
  const dlugi = system === 'r16' || system === 'r24';
  const dostepneDni =
    system === 'weekendowy' ? dniWeekendowe(rok, miesiacStart, miesiecy) : system === 'skrocony' ? dniSkroconegoTygodnia(rok, miesiacStart, miesiecy) : null;
  const dostepneGodziny = dostepneDni === null ? null : dostepneDni * zmiana;
  return {
    system,
    zmiana,
    od: dni[0],
    do: dni[D - 1],
    miesiecy,
    status,
    wymiar: W,
    dniKalendarzowe: D,
    pelneZmiany,
    reszta,
    dniPracy,
    dniWolne: D - dniPracy,
    minimumWolnych: D - W / 8,
    przerwy: przerwy(zmiana),
    przerwyReszty: reszta ? przerwy(reszta) : 0,
    odpoczynek: dlugi ? zmiana : null,
    maksZmianRytm: dlugi ? Math.floor((24 * D) / (2 * zmiana)) : null,
    dostepneDni,
    dostepneGodziny,
    brakuje: dostepneGodziny === null ? 0 : Math.max(0, W - dostepneGodziny),
  };
}

const DNI: [string, string, string] = ['dzień', 'dni', 'dni'];
const ZMIANY: [string, string, string] = ['zmiana', 'zmiany', 'zmian'];
const PRZERWY: [string, string, string] = ['przerwa', 'przerwy', 'przerw'];
const przerwyTekst = (n: number) => (n ? `${odmiana(n, PRZERWY)} po 15 min` : 'bez przerwy');

/** Kolor statusu (klasa .status-terminu). */
export const KOLOR_STATUSU: Record<RodzajStatusu, string> = { wprost: 'w-terminie', szczegolne: 'wkrotce', 'pora-roku': 'wkrotce', przedluzenie: 'pilne' };

/** Teksty wyniku, te same na serwerze i w przeglądarce. Wiersz `null` = ukryty. */
export function opisWyniku(r: WynikRownowazny): Record<'glowny' | 'opis' | 'status' | 'okres' | 'wymiar' | 'wolne' | 'przerwy', string> &
  Record<'odpoczynek' | 'rytm' | 'dostepne', string | null> {
  const plan = `${odmiana(r.pelneZmiany, ZMIANY)} po ${godz(r.zmiana)}${r.reszta ? ` i 1 zmiana ${godz(r.reszta)}` : ''}`;
  return {
    glowny: r.brakuje ? `Brakuje ${godz(r.brakuje)}` : `${odmiana(r.dniPracy, DNI)} pracy`,
    opis: r.brakuje
      ? `Wymiaru ${godz(r.wymiar)} nie da się zaplanować w tym okresie: ${odmiana(r.dostepneDni ?? 0, DNI)} po ${godz(r.zmiana)} to ${godz(r.dostepneGodziny ?? 0)}.`
      : `${plan}; wymiar ${godz(r.wymiar)}`,
    status: `Okres ${odmiana(r.miesiecy, ['miesiąc', 'miesiące', 'miesięcy'])}: ${r.status.opis}`,
    okres: `${dataPoPolsku(r.od)} – ${dataPoPolsku(r.do)}, ${odmiana(r.dniKalendarzowe, DNI)}`,
    wymiar: `${godz(r.wymiar)} = 8 h × ${r.wymiar / 8} dni od poniedziałku do piątku bez świąt`,
    wolne: `${odmiana(r.dniWolne, DNI)}; minimum z art. 147 Kp: ${r.minimumWolnych}`,
    przerwy: `na zmianie ${godz(r.zmiana)}: ${przerwyTekst(r.przerwy)}${r.reszta ? `; na zmianie ${godz(r.reszta)}: ${przerwyTekst(r.przerwyReszty)}` : ''}`,
    odpoczynek: r.odpoczynek === null ? null : `po zmianie ${godz(r.zmiana)} co najmniej ${godz(r.odpoczynek)} bez pracy${r.reszta > 8 ? `, po zmianie ${godz(r.reszta)} co najmniej ${godz(r.reszta)}` : ''}`,
    rytm:
      r.maksZmianRytm === null
        ? null
        : `zmiana i odpoczynek po niej: najwyżej ${odmiana(r.maksZmianRytm, ZMIANY)} po ${godz(r.zmiana)} w okresie; plan ma ${odmiana(r.dniPracy, ZMIANY)}`,
    dostepne:
      r.dostepneDni === null
        ? null
        : r.system === 'weekendowy'
          ? `${odmiana(r.dostepneDni, DNI)} (piątki, soboty, niedziele i święta), razem najwyżej ${godz(r.dostepneGodziny ?? 0)}`
          : `${odmiana(r.dostepneDni, DNI)} (najwyżej 4 w tygodniu), razem najwyżej ${godz(r.dostepneGodziny ?? 0)}`,
  };
}
