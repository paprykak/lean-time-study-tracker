// Kalendarz czasu pracy: święta ustawowe, wymiar czasu pracy w miesiącu (art. 130 Kodeksu pracy) i godziny
// w porze nocnej na zmianie (art. 151^7 § 1). Czyste funkcje bez zależności, wspólne dla narzędzi z czasem pracy
// (dodatek nocny, nadgodziny, grafik). Daty liczymy w UTC, żeby strefa czasowa przeglądarki nie przesuwała dni.

export interface Swieto {
  /** RRRR-MM-DD */
  data: string;
  nazwa: string;
}

const DZIEN_MS = 86_400_000;
const iso = (t: number) => new Date(t).toISOString().slice(0, 10);
const utc = (rok: number, miesiac: number, dzien: number) => Date.UTC(rok, miesiac - 1, dzien);

/** Niedziela Wielkanocna w kalendarzu gregoriańskim (algorytm Meeusa, Jonesa i Butchera). */
export function wielkanoc(rok: number): string {
  const a = rok % 19;
  const b = Math.floor(rok / 100);
  const c = rok % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const miesiac = Math.floor((h + l - 7 * m + 114) / 31);
  const dzien = ((h + l - 7 * m + 114) % 31) + 1;
  return iso(utc(rok, miesiac, dzien));
}

/** Pierwszy rok, w którym 24 grudnia jest dniem wolnym (Dz.U. 2024 poz. 1965, w mocy od 1 lutego 2025 r.). */
export const WIGILIA_OD = 2025;

/** Dni wolne od pracy z art. 1 pkt 1 ustawy o dniach wolnych od pracy (bez niedziel z pkt 2), posortowane. */
export function swieta(rok: number): Swieto[] {
  const w = Date.parse(`${wielkanoc(rok)}T00:00:00Z`);
  const ruchome = (dni: number) => iso(w + dni * DZIEN_MS);
  const stale = (m: number, d: number) => iso(utc(rok, m, d));
  const lista: Swieto[] = [
    { data: stale(1, 1), nazwa: 'Nowy Rok' },
    { data: stale(1, 6), nazwa: 'Święto Trzech Króli' },
    { data: ruchome(0), nazwa: 'Wielkanoc' },
    { data: ruchome(1), nazwa: 'Poniedziałek Wielkanocny' },
    { data: stale(5, 1), nazwa: 'Święto Państwowe' },
    { data: stale(5, 3), nazwa: 'Święto Narodowe Trzeciego Maja' },
    { data: ruchome(49), nazwa: 'Zielone Świątki' },
    { data: ruchome(60), nazwa: 'Boże Ciało' },
    { data: stale(8, 15), nazwa: 'Wniebowzięcie Najświętszej Maryi Panny' },
    { data: stale(11, 1), nazwa: 'Wszystkich Świętych' },
    { data: stale(11, 11), nazwa: 'Narodowe Święto Niepodległości' },
    ...(rok >= WIGILIA_OD ? [{ data: stale(12, 24), nazwa: 'Wigilia Bożego Narodzenia' }] : []),
    { data: stale(12, 25), nazwa: 'Boże Narodzenie' },
    { data: stale(12, 26), nazwa: 'drugi dzień Bożego Narodzenia' },
  ];
  return lista.sort((x, y) => x.data.localeCompare(y.data));
}

/** 0 = niedziela, 6 = sobota. */
const dzienTygodnia = (data: string) => new Date(`${data}T00:00:00Z`).getUTCDay();

export interface WymiarMiesiaca {
  rok: number;
  miesiac: number;
  /** Wymiar czasu pracy w pełnym etacie, godziny. */
  godziny: number;
  /** Dni od poniedziałku do piątku w miesiącu. */
  dniPonPt: number;
  /** Święta, które obniżają wymiar o 8 godzin (każde poza niedzielą, także w sobotę). */
  swietaObnizajace: Swieto[];
}

/**
 * Wymiar czasu pracy w miesiącu dla pełnego etatu i okresu rozliczeniowego równego miesiącowi (art. 130 § 1 i 2 Kp).
 * Pełne tygodnie od 1. dnia miesiąca dają 40 godzin, a pozostałe dni od poniedziałku do piątku po 8 godzin, czyli
 * razem 8 godzin za każdy dzień od poniedziałku do piątku. Każde święto poza niedzielą obniża wymiar o 8 godzin.
 */
export function wymiarMiesiaca(rok: number, miesiac: number): WymiarMiesiaca {
  if (!Number.isInteger(miesiac) || miesiac < 1 || miesiac > 12) throw new RangeError(`Miesiąc spoza zakresu: ${miesiac}`);
  const dni = new Date(Date.UTC(rok, miesiac, 0)).getUTCDate();
  let dniPonPt = 0;
  for (let d = 1; d <= dni; d++) {
    const t = new Date(utc(rok, miesiac, d)).getUTCDay();
    if (t >= 1 && t <= 5) dniPonPt++;
  }
  const prefiks = `${rok}-${String(miesiac).padStart(2, '0')}-`;
  const swietaObnizajace = swieta(rok).filter((s) => s.data.startsWith(prefiks) && dzienTygodnia(s.data) !== 0);
  return { rok, miesiac, godziny: 8 * dniPonPt - 8 * swietaObnizajace.length, dniPonPt, swietaObnizajace };
}

/** Liczba dni w miesiącu. */
export const dniWMiesiacu = (rok: number, miesiac: number) => new Date(Date.UTC(rok, miesiac, 0)).getUTCDate();

/** „22:00” → minuty od północy; null dla złego zapisu. */
export function minuty(godzina: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(godzina.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

/** Pora nocna trwa 8 godzin (art. 151^7 § 1 Kp). */
export const PORA_NOCNA_MIN = 8 * 60;
/** Pora nocna mieści się między 21:00 a 7:00, więc może zacząć się najwcześniej o 21:00 i najpóźniej o 23:00. */
export const PORA_NOCNA_OD_MIN = 21 * 60;
export const PORA_NOCNA_OD_MAX = 23 * 60;

/**
 * Minuty pracy w porze nocnej na jednej zmianie. Zmiana kończy się następnego dnia, gdy koniec ≤ początek
 * (np. 18:00–6:00); ta sama godzina początku i końca oznacza zmianę 24-godzinną. Pora nocna zaczyna się o `poraOd`
 * i trwa 8 godzin; liczymy jej wystąpienia z poprzedniej, tej samej i następnej doby.
 */
export function minutyNocneZmiany(poczatek: number, koniec: number, poraOd: number): number {
  if (poraOd < PORA_NOCNA_OD_MIN || poraOd > PORA_NOCNA_OD_MAX) throw new RangeError('Pora nocna musi zaczynać się między 21:00 a 23:00');
  const s = poczatek;
  const e = koniec > poczatek ? koniec : koniec + 1440;
  let suma = 0;
  for (const k of [-1, 0, 1]) {
    const a = poraOd + k * 1440;
    const b = a + PORA_NOCNA_MIN;
    suma += Math.max(0, Math.min(e, b) - Math.max(s, a));
  }
  return suma;
}

const MIESIACE = ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień'];
const MIESIACE_MIEJSCOWNIK = ['styczniu', 'lutym', 'marcu', 'kwietniu', 'maju', 'czerwcu', 'lipcu', 'sierpniu', 'wrześniu', 'październiku', 'listopadzie', 'grudniu'];
/** Nazwa miesiąca: „listopad”; w miejscowniku: „listopadzie” (do zdań „w listopadzie”). */
export const nazwaMiesiaca = (m: number, przypadek: 'mianownik' | 'miejscownik' = 'mianownik') =>
  (przypadek === 'mianownik' ? MIESIACE : MIESIACE_MIEJSCOWNIK)[m - 1];

/** „2026-11-11” → „11 listopada”. */
export function dzienMiesiaca(data: string): string {
  const DOPELNIACZ = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
  const [, m, d] = data.split('-').map(Number);
  return `${d} ${DOPELNIACZ[m - 1]}`;
}

/** „20 dni od poniedziałku do piątku, minus święto: 11 listopada” (opis wymiaru pod wynikiem i w przykładach). */
export function opisWymiaru(w: WymiarMiesiaca): string {
  const s = w.swietaObnizajace;
  const swietaTekst = s.length
    ? `, minus ${s.length === 1 ? 'święto' : 'święta'}: ${s.map((x) => dzienMiesiaca(x.data)).join(', ')}`
    : ', bez świąt obniżających wymiar';
  return `${w.dniPonPt} dni od poniedziałku do piątku${swietaTekst}`;
}

export interface WymiarOkresu {
  /** Wymiar dla pełnego etatu, godziny. */
  godziny: number;
  dniPonPt: number;
  swietaObnizajace: Swieto[];
  miesiace: WymiarMiesiaca[];
}

/**
 * Wymiar czasu pracy w okresie rozliczeniowym zaczynającym się w danym miesiącu (art. 130 § 1 i 2 Kp). Tygodnie
 * liczymy od pierwszego dnia okresu (art. 128 § 3 pkt 2), ale 5 dni od poniedziałku do piątku w każdym pełnym tygodniu
 * daje to samo co 8 godzin za każdy taki dzień, więc wymiar okresu to suma wymiarów miesięcy.
 */
export function wymiarOkresu(rok: number, miesiacStart: number, liczbaMiesiecy: number): WymiarOkresu {
  if (!Number.isInteger(liczbaMiesiecy) || liczbaMiesiecy < 1 || liczbaMiesiecy > 12) throw new RangeError('Okres rozliczeniowy: od 1 do 12 miesięcy');
  const miesiace = Array.from({ length: liczbaMiesiecy }, (_, i) => {
    const indeks = miesiacStart - 1 + i;
    return wymiarMiesiaca(rok + Math.floor(indeks / 12), (indeks % 12) + 1);
  });
  return {
    godziny: miesiace.reduce((s, m) => s + m.godziny, 0),
    dniPonPt: miesiace.reduce((s, m) => s + m.dniPonPt, 0),
    swietaObnizajace: miesiace.flatMap((m) => m.swietaObnizajace),
    miesiace,
  };
}

/** Święta wypadające w sobotę (obniżają wymiar o 8 godzin, art. 130 § 2 Kp). */
export const swietaWSobote = (rok: number) => swieta(rok).filter((s) => dzienTygodnia(s.data) === 6);

/** „53 h 20 min”, „160 h” (wymiar przy niepełnym etacie bywa ułamkowy). */
export function godzinyIMinuty(godziny: number): string {
  const minuty = Math.round(godziny * 60);
  const h = Math.floor(minuty / 60);
  const m = minuty % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}
