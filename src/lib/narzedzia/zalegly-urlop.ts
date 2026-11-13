// Zaległy urlop wypoczynkowy: do kiedy pracodawca ma go udzielić i kiedy roszczenie o urlop może się przedawnić.
// Przepisy (Kodeks pracy, tekst jednolity Dz.U. 2026 poz. 1245; Kodeks cywilny, t.j. Dz.U. 2026 poz. 795):
// - art. 161 Kp: urlopu udziela się w roku kalendarzowym, w którym pracownik uzyskał do niego prawo;
// - art. 168 Kp: urlopu niewykorzystanego w terminie ustalonym zgodnie z art. 163 należy udzielić najpóźniej do
//   30 września następnego roku kalendarzowego; nie dotyczy to części urlopu udzielanego zgodnie z art. 167²
//   (urlop na żądanie);
// - art. 291 § 1 Kp: roszczenia ze stosunku pracy przedawniają się z upływem 3 lat od dnia, w którym roszczenie stało się
//   wymagalne; § 4: terminów nie można skracać ani przedłużać czynnością prawną;
// - art. 293¹ Kp: bieg przedawnienia roszczenia o urlop wypoczynkowy nie rozpoczyna się, a rozpoczęty ulega zawieszeniu
//   na czas korzystania z urlopu wychowawczego;
// - art. 171 § 1 Kp: za urlop niewykorzystany z powodu rozwiązania lub wygaśnięcia stosunku pracy przysługuje ekwiwalent;
//   § 4–5 (od 27 stycznia 2026 r.): wypłata w terminie wypłaty wynagrodzenia, a gdy ten przypada przed końcem umowy,
//   w ciągu 10 dni od rozwiązania;
// - art. 112 KC (przez art. 300 Kp): termin w latach kończy się z upływem dnia, który datą odpowiada początkowemu dniowi,
//   a gdy takiego dnia w ostatnim miesiącu nie ma, w ostatnim dniu miesiąca (dodajLata z ./terminy).
//
// Przyjęte interpretacje (przepis ich nie rozstrzyga):
// 1. Kodeks pracy nie mówi, kiedy roszczenie o urlop staje się wymagalne. Główny wynik to wariant najwcześniejszy
//    (bezpieczny dla pracownika): wymagalność 31 grudnia roku, w którym trzeba było udzielić urlopu (art. 161), więc
//    przedawnienie z upływem 31 grudnia trzy lata później. Wariant późniejszy: od 30 września następnego roku (art. 168).
//    Orzecznictwa SN nie sprawdzaliśmy (sn.pl blokuje automaty), urzędowego źródła o wymagalności nie znaleźliśmy.
// 2. Zawieszenie z art. 293¹: do końca terminu dodajemy liczbę dni urlopu wychowawczego przypadających po dniu
//    wymagalności i nie później niż w (przedłużonym) końcu terminu. Przepis nie mówi, jak liczyć termin w latach po
//    zawieszeniu; liczenie w dniach daje ten sam albo bardzo zbliżony wynik.
// 3. Ekwiwalent: przepis nie wskazuje dnia wymagalności. Wariant najwcześniejszy: dzień rozwiązania umowy; od niego
//    3 lata (art. 291 § 1, art. 112 KC). Art. 293¹ dotyczy roszczenia o urlop, więc do ekwiwalentu go nie stosujemy.
// 4. Nie przesuwamy końca terminu na koniec roku (art. 118 KC) ani na dzień roboczy (art. 115 KC): Kodeks pracy ma
//    własne przepisy o przedawnieniu, a gdyby sąd przyjął dłuższy termin, nasza data i tak jest bezpieczna.
import { odmiana } from '../redakcja';
import { dataPoPolsku, dniMiedzy, dodajDni, dodajLata, ileDni, poprawnaData } from './terminy';

export const LATA_PRZEDAWNIENIA = 3;
export const MIN_ROK = 2000;
export const MAKS_DNI = 100;

export type Status = 'po-terminie' | 'pilne' | 'wkrotce' | 'w-terminie';

export interface Okres {
  od: string;
  do: string;
}

export interface UrlopZaRok {
  rok: number;
  dni: number;
}

export interface Termin {
  data: string;
  zostalo: number;
  status: Status;
}

export interface WynikRoku {
  rok: number;
  dni: number;
  /** Rok bieżący względem dnia sprawdzenia: urlopu udziela się jeszcze w tym roku (art. 161). */
  biezacy: boolean;
  /** 30 września następnego roku (art. 168). */
  udzielenie: Termin;
  /** Wariant najwcześniejszy: 3 lata od 31 grudnia roku urlopu (+ zawieszenie z art. 293¹). */
  przedawnienie: Termin;
  /** Wariant późniejszy: 3 lata od 30 września następnego roku (+ zawieszenie). */
  przedawnieniePozniej: Termin;
  /** Dni zawieszenia biegu (urlop wychowawczy) w wariancie najwcześniejszym. */
  zawieszenie: number;
  /** Tryb ekwiwalentu: roszczenie o urlop mogło się przedawnić przed końcem umowy (wariant najwcześniejszy). */
  przedawnionyPrzedKoncemUmowy: boolean;
}

export interface Wynik {
  lata: WynikRoku[];
  razem: number;
  /** Tylko gdy podano koniec umowy. */
  ekwiwalent: null | {
    koniecUmowy: string;
    dni: number;
    /** 10 dni od rozwiązania (art. 171 § 5), przed ewentualnym cofnięciem z dnia wolnego. */
    wyplataNajpozniej10: string;
    przedawnienie: Termin;
  };
}

const status = (zostalo: number): Status => (zostalo < 0 ? 'po-terminie' : zostalo <= 30 ? 'pilne' : zostalo <= 90 ? 'wkrotce' : 'w-terminie');

export const termin = (data: string, naDzien: string): Termin => {
  const zostalo = dniMiedzy(naDzien, data);
  return { data, zostalo, status: status(zostalo) };
};

/** Liczba dni okresu `o` w przedziale (po, doDnia]. */
function dniWPrzedziale(o: Okres, po: string, doDnia: string): number {
  const od = o.od > dodajDni(po, 1) ? o.od : dodajDni(po, 1);
  const koniec = o.do < doDnia ? o.do : doDnia;
  return koniec >= od ? dniMiedzy(od, koniec) + 1 : 0;
}

/**
 * Koniec przedawnienia od dnia wymagalności, przedłużony o dni urlopu wychowawczego w trakcie biegu (art. 293¹).
 */
export function koniecPrzedawnienia(wymagalne: string, wychowawczy: Okres | null = null): { koniec: string; zawieszenie: number } {
  const bazowy = dodajLata(wymagalne, LATA_PRZEDAWNIENIA);
  if (!wychowawczy) return { koniec: bazowy, zawieszenie: 0 };
  let dni = 0;
  for (;;) {
    const n = dniWPrzedziale(wychowawczy, wymagalne, dodajDni(bazowy, dni));
    if (n === dni) return { koniec: dodajDni(bazowy, dni), zawieszenie: dni };
    dni = n;
  }
}

export const terminUdzielenia = (rok: number) => `${rok + 1}-09-30`;
export const wymagalnoscNajwczesniej = (rok: number) => `${rok}-12-31`;

export interface Dane {
  urlopy: UrlopZaRok[];
  naDzien: string;
  koniecUmowy?: string | null;
  wychowawczy?: Okres | null;
}

export function zaleglyUrlop({ urlopy, naDzien, koniecUmowy = null, wychowawczy = null }: Dane): Wynik {
  if (!poprawnaData(naDzien)) throw new RangeError('Błędna data sprawdzenia.');
  if (koniecUmowy && !poprawnaData(koniecUmowy)) throw new RangeError('Błędna data końca umowy.');
  if (wychowawczy && (!poprawnaData(wychowawczy.od) || !poprawnaData(wychowawczy.do) || wychowawczy.do < wychowawczy.od))
    throw new RangeError('Błędny okres urlopu wychowawczego.');
  if (!urlopy.length) throw new RangeError('Wpisz co najmniej jeden rok.');
  const rokDzis = Number(naDzien.slice(0, 4));
  const widziane = new Set<number>();
  for (const u of urlopy) {
    if (!Number.isInteger(u.rok) || u.rok < MIN_ROK) throw new RangeError(`Rok od ${MIN_ROK}.`);
    if (u.rok > rokDzis) throw new RangeError('Rok późniejszy niż dzień sprawdzenia.');
    if (koniecUmowy && u.rok > Number(koniecUmowy.slice(0, 4))) throw new RangeError('Rok późniejszy niż koniec umowy.');
    if (widziane.has(u.rok)) throw new RangeError('Rok wpisany dwa razy.');
    widziane.add(u.rok);
    if (!Number.isInteger(u.dni) || u.dni <= 0 || u.dni > MAKS_DNI) throw new RangeError(`Dni od 1 do ${MAKS_DNI}.`);
  }
  const lata = [...urlopy]
    .sort((a, b) => a.rok - b.rok)
    .map((u): WynikRoku => {
      const p1 = koniecPrzedawnienia(wymagalnoscNajwczesniej(u.rok), wychowawczy);
      const p2 = koniecPrzedawnienia(terminUdzielenia(u.rok), wychowawczy);
      return {
        rok: u.rok,
        dni: u.dni,
        biezacy: u.rok === rokDzis,
        udzielenie: termin(terminUdzielenia(u.rok), naDzien),
        przedawnienie: termin(p1.koniec, naDzien),
        przedawnieniePozniej: termin(p2.koniec, naDzien),
        zawieszenie: p1.zawieszenie,
        przedawnionyPrzedKoncemUmowy: !!koniecUmowy && p1.koniec < koniecUmowy,
      };
    });
  const razem = lata.reduce((s, r) => s + r.dni, 0);
  const ekwiwalent = koniecUmowy
    ? {
        koniecUmowy,
        dni: razem,
        wyplataNajpozniej10: dodajDni(koniecUmowy, 10),
        przedawnienie: termin(dodajLata(koniecUmowy, LATA_PRZEDAWNIENIA), naDzien),
      }
    : null;
  return { lata, razem, ekwiwalent };
}

// Teksty wyniku: te same na serwerze i w przeglądarce (skrypt przepuszcza je jeszcze przez typografia()).
const DNI: [string, string, string] = ['dzień', 'dni', 'dni'];
const kiedy = (t: Termin) => `${dataPoPolsku(t.data)} (${ileDni(t.zostalo)})`;
const stan = (t: Termin) =>
  t.zostalo < 0 ? `Termin minął ${ileDni(t.zostalo)}` : t.zostalo === 0 ? 'Ostatni dzień: dziś' : `Zostało: ${odmiana(t.zostalo, DNI)}`;

export interface OpisRoku {
  rok: number;
  tytul: string;
  wiersze: { dt: string; dd: string }[];
}

export interface Opis {
  etykieta: string;
  glowny: string;
  opis: string;
  status: Status;
  statusTekst: string;
  lata: OpisRoku[];
}

export function opis(w: Wynik): Opis {
  const lata = w.lata.map((r): OpisRoku => {
    const wiersze: { dt: string; dd: string }[] = [];
    if (w.ekwiwalent) {
      wiersze.push({
        dt: 'Roszczenie o urlop',
        dd: r.przedawnionyPrzedKoncemUmowy
          ? `mogło się przedawnić przed końcem umowy, najwcześniej ${dataPoPolsku(r.przedawnienie.data)}`
          : `do ekwiwalentu (art. 171 § 1); przedawnienie roszczenia o urlop najwcześniej ${dataPoPolsku(r.przedawnienie.data)}`,
      });
    } else {
      wiersze.push({
        dt: r.biezacy ? 'Udzielić' : 'Udzielić najpóźniej',
        dd: r.biezacy
          ? `w ${r.rok} r. (art. 161), a urlop niewykorzystany w terminie z planu do ${kiedy(r.udzielenie)}`
          : `${kiedy(r.udzielenie)}`,
      });
      wiersze.push({
        dt: 'Przedawnienie najwcześniej',
        dd: `${kiedy(r.przedawnienie)}${r.zawieszenie ? `, z doliczonym urlopem wychowawczym: ${odmiana(r.zawieszenie, DNI)}` : ''}`,
      });
      wiersze.push({ dt: 'Wariant późniejszy', dd: dataPoPolsku(r.przedawnieniePozniej.data) });
    }
    return { rok: r.rok, tytul: `Urlop za ${r.rok} r.: ${odmiana(r.dni, DNI)}`, wiersze };
  });
  if (w.ekwiwalent) {
    const e = w.ekwiwalent;
    return {
      etykieta: 'Ekwiwalent za niewykorzystany urlop',
      glowny: odmiana(e.dni, DNI),
      opis: `Koniec umowy ${dataPoPolsku(e.koniecUmowy)}: za urlop niewykorzystany z powodu rozwiązania umowy przysługuje ekwiwalent (art. 171 § 1). Przedawnienie najwcześniej ${dataPoPolsku(e.przedawnienie.data)}`,
      status: e.przedawnienie.status,
      statusTekst: stan(e.przedawnienie),
      lata,
    };
  }
  const najblizszy = w.lata.reduce((a, b) => (b.przedawnienie.data < a.przedawnienie.data ? b : a));
  const p = najblizszy.przedawnienie;
  return {
    etykieta: 'Niewykorzystany urlop',
    glowny: odmiana(w.razem, DNI),
    opis: `Najwcześniej może się przedawnić urlop za ${najblizszy.rok} r.: ${dataPoPolsku(p.data)}`,
    status: p.status,
    statusTekst: stan(p),
    lata,
  };
}
