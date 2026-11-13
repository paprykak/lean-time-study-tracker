// Badania lekarskie i psychologiczne kierowców: termin następnego badania, kto płaci, opłaty.
// Przepisy (sprawdzone w API Sejmu 2026-11-12):
// - ustawa o transporcie drogowym (UTD), t.j. Dz.U. 2025 poz. 1490: art. 39j ust. 4 i art. 39k ust. 3 (badania
//   lekarskie i psychologiczne kierowcy wykonującego przewóz drogowy: do ukończenia 60 lat co 5 lat, po ukończeniu
//   60. roku życia co 30 miesięcy), art. 39l ust. 1 pkt 2 (koszt ponosi przewoźnik), art. 39m (osobisty przewóz:
//   wymagania stosuje się odpowiednio), art. 39a ust. 3–4 (wyjątki; kat. B nie zwalnia z badań);
// - art. 3 ust. 1 UTD: ustawy nie stosuje się m.in. do niezarobkowego przewozu osób autem do 9 osób (pkt 1), do
//   aut do 3,5 t w niezarobkowym przewozie rzeczy albo gdy firma wykonuje wyłącznie krajowy transport rzeczy (pkt 2),
//   i do aut do 2,5 t w transporcie rzeczy (pkt 2a); przy kat. B badania z art. 39j–39k obejmują więc w praktyce
//   zarobkowy przewóz osób i zarobkowy przewóz rzeczy autem 2,5–3,5 t przez firmę, która nie wozi wyłącznie w kraju;
// - ustawa o kierujących pojazdami (UKP), t.j. Dz.U. 2025 poz. 1226: art. 79a (opłata za badanie lekarskie z art. 75
//   ust. 1 najwyżej 200 zł; przepis nie przesądza, czy limit obejmuje całe badanie kierowcy z art. 39j UTD), art. 90 ust. 1 pkt 7 lit. a (sufit opłaty za badanie psychologiczne 200 zł), art. 79 ust. 3 pkt 1
//   (lekarz może ograniczyć termin), art. 15 ust. 4 (kod 95 nie dłużej niż ważność orzeczeń);
// - rozporządzenie MZ w sprawie badań psychologicznych, t.j. Dz.U. 2022 poz. 165, § 13 pkt 1–2: opłata 150 zł,
//   od 14.11.2026 200 zł (Dz.U. 2026 poz. 1434, § 1 i § 3); § 2 tego rozporządzenia: badania rozpoczęte
//   i niezakończone orzeczeniem przed 14.11.2026 kosztują 150 zł;
// - Kodeks pracy, t.j. Dz.U. 2026 poz. 1245: art. 229 § 2, 4 i 6 (badania okresowe na koszt pracodawcy);
// - rozporządzenie o badaniach profilaktycznych, t.j. Dz.U. 2023 poz. 607: § 2 ust. 1–2 i załącznik nr 1 cz. V
//   (pkt 11: kierowanie pojazdami co 30 miesięcy – 5 lat; pkt 2: wózki widłowe co 3–4 lata, powyżej 50. r.ż.
//   co 2–3 lata); termin wpisuje lekarz w orzeczeniu (§ 3 ust. 4a pkt 12, Dz.U. 2026 poz. 456);
// - Kodeks cywilny, t.j. Dz.U. 2026 poz. 795, art. 112: terminy w miesiącach i latach (brak dnia → ostatni dzień
//   miesiąca), a wiek kończy się z początkiem dnia urodzin.
// Przyjęte interpretacje:
// 1. Termin liczymy od daty ostatniego orzeczenia; punkt (5 lat albo 30 miesięcy) wybieramy według wieku w dniu
//    badania (wzór orzeczenia psychologicznego, zał. nr 4: „zgodnie z art. 39k ust. 3 pkt 1/pkt 2”).
// 2. Przepis nie mówi, co gdy 5-letni termin kończy się po 60. urodzinach. Wiąże termin ustawowy; osobno, jako naszą
//    interpretację, pokazujemy wcześniejszy termin ostrożny: min(badanie + 5 lat, max(badanie + 30 miesięcy,
//    60. urodziny)). Ostrożny termin nie wpływa na status ani na ostrzeżenie o zaległym badaniu.
// 3. Termin z orzeczenia ma pierwszeństwo, gdy jest wcześniejszy (lekarz może skrócić); wiążąca data to
//    wcześniejsza z: ustawowej i z orzeczenia.
// 4. Badanie z Kodeksu pracy (auto służbowe bez przewozu drogowego, wózek widłowy): narzędzie podaje tylko widełki ze
//    wskazówek metodycznych (auto: pkt 11, gdy kierowanie pojazdem jest w skierowaniu; wózek: pkt 2, a inne czynniki
//    ze skierowania, np. pkt 4 „prace wymagające sprawności psychoruchowej”, mogą skrócić termin); wiąże data od lekarza. „Powyżej 50. r.ż.” liczymy jako ukończone 50 lat w dniu badania.
//    Lekarz może wyznaczyć krótszy termin (§ 2 ust. 2), więc po górnej granicy widełek badanie jest na pewno zaległe.
import { dataPoPolsku, ileDni, dniMiedzy, dodajDni, dodajLata, dodajMiesiace, poprawnaData } from './terminy';
import type { Wydarzenie } from './kalendarz-ics';

export type Rola = 'kierowca' | 'auto-sluzbowe' | 'wozek';

/** Wiek, od którego badania co 30 miesięcy (art. 39j ust. 4 pkt 2, art. 39k ust. 3 pkt 2 UTD). */
export const WIEK_PROGU = 60;
/** Odstęp do ukończenia 60 lat (art. 39j ust. 4 pkt 1, art. 39k ust. 3 pkt 1 UTD). */
export const LATA_DO_60 = 5;
/** Odstęp po ukończeniu 60 lat. */
export const MIESIECY_PO_60 = 30;

/** Najwyższa opłata za badanie lekarskie z art. 75 ust. 1 UKP i ponowne badanie (art. 79a UKP); nie przesądza, czy
 *  limit obejmuje całe badanie kierowcy z art. 39j UTD (badanie z Kodeksu pracy poszerzone o zakres UKP). */
export const OPLATA_LEKARSKA_MAKS = 200;
/** Opłata za badanie psychologiczne do 13.11.2026 (§ 13 pkt 1–2 rozp., t.j. Dz.U. 2022 poz. 165). */
export const OPLATA_PSYCH_DAWNA = 150;
/** Opłata od 14.11.2026 (Dz.U. 2026 poz. 1434, § 1); to też sufit ustawowy (art. 90 ust. 1 pkt 7 lit. a UKP). */
export const OPLATA_PSYCH = 200;
/** Dzień wejścia w życie nowej opłaty (§ 3 rozp. Dz.U. 2026 poz. 1434: 14 dni od ogłoszenia 30.10.2026). */
export const ZMIANA_OPLATY_PSYCH = '2026-11-14';

/** Widełki z załącznika nr 1 cz. V rozporządzenia o badaniach profilaktycznych (w miesiącach). */
export const WIDELKI = {
  'auto-sluzbowe': { od: 30, do: 60 }, // pkt 11 (kierowanie pojazdem w skierowaniu): co 30 miesięcy – 5 lat
  wozek: { od: 36, do: 48 }, // pkt 2: co 3–4 lata
  'wozek-po-50': { od: 24, do: 36 }, // pkt 2: powyżej 50. r.ż. co 2–3 lata
} as const;
export const WIEK_WOZEK = 50;

/** Ile dni przed terminem dodatkowy wpis w kalendarzu. */
export const DNI_PRZYPOMNIENIA = 30;

export type Status = 'po-terminie' | 'pilne' | 'wkrotce' | 'w-terminie';
export type Zrodlo = 'ustawa' | 'orzeczenie';

function sprawdz(nazwa: string, data: string) {
  if (!poprawnaData(data)) throw new RangeError(`${nazwa}: niepoprawna data ${data}`);
}

/** Dzień ukończenia `lat` lat: z początkiem dnia urodzin (art. 112 zd. 2 KC); 29 lutego → 28 lutego w roku zwykłym. */
export const dzienUkonczenia = (urodzenie: string, lat: number) => dodajLata(urodzenie, lat);

export interface TerminKierowcy {
  dzien60: string;
  /** Czy w dniu badania kierowca miał ukończone 60 lat. */
  po60: boolean;
  /** Termin według brzmienia art. 39j ust. 4 / 39k ust. 3. */
  ustawowy: string;
  /** Wariant ostrożny (nasza interpretacja, nie wiąże), gdy 5-letni termin wypada po 60. urodzinach; inaczej null. */
  ostroznie: string | null;
  zOrzeczenia: string | null;
  /** Wiążąca data: wcześniejsza z ustawowej i z orzeczenia. */
  termin: string;
  zrodlo: Zrodlo;
}

/** Termin następnego badania kierowcy (lekarskiego albo psychologicznego; liczone niezależnie). */
export function terminKierowcy({ urodzenie, badanie, zOrzeczenia }: { urodzenie: string; badanie: string; zOrzeczenia?: string | null }): TerminKierowcy {
  sprawdz('data urodzenia', urodzenie);
  sprawdz('data badania', badanie);
  if (badanie < urodzenie) throw new RangeError('badanie przed datą urodzenia');
  if (zOrzeczenia) {
    sprawdz('termin z orzeczenia', zOrzeczenia);
    if (zOrzeczenia <= badanie) throw new RangeError('termin z orzeczenia nie później niż badanie');
  }
  const dzien60 = dzienUkonczenia(urodzenie, WIEK_PROGU);
  const po60 = badanie >= dzien60;
  const ustawowy = po60 ? dodajMiesiace(badanie, MIESIECY_PO_60) : dodajLata(badanie, LATA_DO_60);
  let ostroznie: string | null = null;
  if (!po60 && ustawowy > dzien60) {
    const poPrzerwie = dodajMiesiace(badanie, MIESIECY_PO_60);
    const kandydat = poPrzerwie > dzien60 ? poPrzerwie : dzien60;
    ostroznie = kandydat < ustawowy ? kandydat : ustawowy;
  }
  const zrodlo: Zrodlo = zOrzeczenia && zOrzeczenia <= ustawowy ? 'orzeczenie' : 'ustawa';
  const termin = zrodlo === 'orzeczenie' ? zOrzeczenia! : ustawowy;
  return { dzien60, po60, ustawowy, ostroznie, zOrzeczenia: zOrzeczenia ?? null, termin, zrodlo };
}

export interface WidelkiKP {
  od: string;
  do: string;
  /** Tylko wózek: czy w dniu badania ukończone 50 lat. */
  po50: boolean;
  miesiaceOd: number;
  miesiaceDo: number;
}

/** Widełki badania okresowego z Kodeksu pracy (wiąże data wpisana przez lekarza). */
export function widelkiKP({ rola, badanie, urodzenie }: { rola: Exclude<Rola, 'kierowca'>; badanie: string; urodzenie?: string | null }): WidelkiKP {
  sprawdz('data badania', badanie);
  let po50 = false;
  if (rola === 'wozek') {
    if (!urodzenie) throw new RangeError('wózek: potrzebna data urodzenia');
    sprawdz('data urodzenia', urodzenie);
    if (badanie < urodzenie) throw new RangeError('badanie przed datą urodzenia');
    po50 = badanie >= dzienUkonczenia(urodzenie, WIEK_WOZEK);
  }
  const w = rola === 'auto-sluzbowe' ? WIDELKI['auto-sluzbowe'] : po50 ? WIDELKI['wozek-po-50'] : WIDELKI.wozek;
  return { od: dodajMiesiace(badanie, w.od), do: dodajMiesiace(badanie, w.do), po50, miesiaceOd: w.od, miesiaceDo: w.do };
}

export function status(termin: string, dzis: string): { status: Status; dni: number } {
  const dni = dniMiedzy(dzis, termin);
  return { dni, status: dni < 0 ? 'po-terminie' : dni <= 30 ? 'pilne' : dni <= 90 ? 'wkrotce' : 'w-terminie' };
}

/**
 * Opłata za badanie psychologiczne w zakresie psychologii transportu (także ponowne). Badanie rozpoczęte przed
 * 14.11.2026 kosztuje 150 zł, nawet gdy orzeczenie wydano później (§ 2 rozp. Dz.U. 2026 poz. 1434).
 */
export function oplataPsychotestu(rozpoczete: string, zakonczone?: string): number {
  sprawdz('rozpoczęcie badania', rozpoczete);
  if (zakonczone) {
    sprawdz('orzeczenie', zakonczone);
    if (zakonczone < rozpoczete) throw new RangeError('orzeczenie przed rozpoczęciem badania');
  }
  return rozpoczete < ZMIANA_OPLATY_PSYCH ? OPLATA_PSYCH_DAWNA : OPLATA_PSYCH;
}

const PLACI_KIEROWCA = 'Skierowanie wydaje i koszt ponosi przewoźnik albo pracodawca; gdy jako przedsiębiorca wykonujesz przewóz samodzielnie, płacisz Ty (art. 39m ustawy o transporcie drogowym).';
const PLACI_KP = 'Skierowanie wydaje i koszt ponosi pracodawca.';
const NAZWA = { lekarskie: 'badanie lekarskie kierowcy', psychologiczne: 'badanie psychologiczne kierowcy (psychotesty)', okresowe: 'okresowe badanie lekarskie' } as const;
export type RodzajBadania = keyof typeof NAZWA;

/** Wydarzenia do pliku .ics od daty wiążącej: 30 dni przed i w dniu terminu, tylko te, które jeszcze nie minęły.
 *  Termin ostrożny (gdy jest) to osobne, wyraźnie opisane wydarzenia: 30 dni przed nim i w jego dniu. */
export function wydarzenia(terminy: { rodzaj: RodzajBadania; termin: string; ostroznie?: string | null }[], dzis: string): Wydarzenie[] {
  return terminy
    .flatMap(({ rodzaj, termin, ostroznie }) => {
      const opis = `Następne ${NAZWA[rodzaj]} najpóźniej ${dataPoPolsku(termin)} ${rodzaj === 'okresowe' ? PLACI_KP : PLACI_KIEROWCA} Policzone na rytmhali.pl/narzedzia/badania-kierowcy.`;
      const duze = NAZWA[rodzaj][0].toUpperCase() + NAZWA[rodzaj].slice(1);
      const lista: Wydarzenie[] = [
        { data: dodajDni(termin, -DNI_PRZYPOMNIENIA), tytul: `Umów: ${NAZWA[rodzaj]}`, opis, przypomnienia: [0] },
        { data: termin, tytul: `${duze}: ostatni dzień`, opis },
      ];
      if (ostroznie && ostroznie < termin) {
        const opisOstr = `Termin ostrożny po 60. urodzinach (${dataPoPolsku(ostroznie)}): nasza interpretacja, przepis tego nie wymaga. Termin wiążący to ${dataPoPolsku(termin)} Policzone na rytmhali.pl/narzedzia/badania-kierowcy.`;
        lista.push(
          { data: dodajDni(ostroznie, -DNI_PRZYPOMNIENIA), tytul: `Bezpieczniej umów: ${NAZWA[rodzaj]}`, opis: opisOstr, przypomnienia: [0] },
          { data: ostroznie, tytul: `Bezpieczniej wcześniej: ${NAZWA[rodzaj]}`, opis: opisOstr },
        );
      }
      return lista;
    })
    .filter((w) => dniMiedzy(dzis, w.data) >= 0)
    .sort((a, b) => a.data.localeCompare(b.data));
}

// Teksty wyniku: te same na serwerze (wynik startowy bez JavaScriptu) i w przeglądarce.
export interface Wejscie {
  rola: Rola;
  urodzenie: string;
  lek: string;
  lekTermin?: string | null;
  psy: string;
  psyTermin?: string | null;
}
export interface StatusWidoku {
  status: Status;
  tekst: string;
}
export interface Widok {
  naglowekLek: string;
  lek: string;
  statusLek: StatusWidoku | null;
  lekOpis: string;
  lekOstroznie: string | null;
  pokazPsy: boolean;
  psy: string;
  statusPsy: StatusWidoku | null;
  psyOpis: string;
  psyOstroznie: string | null;
  dzien60: string;
  placi: string;
  oplataLek: string;
  oplataPsy: string;
  uwaga: string | null;
  /** Co trafi do pliku .ics i kiedy kalendarz przypomni (VALARM z kalendarz-ics.ts). */
  icsOpis: string;
  wydarzenia: Wydarzenie[];
}
const UWAGA_ICS = ' Część kalendarzy pomija przypomnienia z pliku i ustawia własne.';
const ICS_KIEROWCA =
  'Terminy do kalendarza: 30 dni przed terminem i w dniu terminu, a gdy jest termin ostrożny, także 30 dni przed nim i w jego dniu (tylko te, które jeszcze nie minęły). Przypomnienia o 9:00: „umów” w jego dniu, terminy tydzień i dzień wcześniej.' + UWAGA_ICS;
const ICS_KP =
  'Terminy do kalendarza: 30 dni przed terminem z orzeczenia i w jego dniu (tylko te, które jeszcze nie minęły). Przypomnienia o 9:00: „umów” w jego dniu, termin tydzień i dzień wcześniej.' + UWAGA_ICS;
const ICS_BEZ_TERMINU = 'Terminy do kalendarza po wpisaniu terminu z orzeczenia.';

const ETYKIETA: Record<Status, string> = { 'po-terminie': 'Zaległe', pilne: 'Pilne', wkrotce: 'Wkrótce', 'w-terminie': 'W terminie' };
const statusWidoku = (termin: string, dzis: string): StatusWidoku => {
  const s = status(termin, dzis);
  return { status: s.status, tekst: `${ETYKIETA[s.status]}: ${ileDni(s.dni)}` };
};

/** Opis opłaty za psychotest w danym dniu (przed 14.11.2026 obie kwoty). */
export const opisOplatyPsych = (dzis: string) =>
  oplataPsychotestu(dzis) === OPLATA_PSYCH_DAWNA
    ? `${OPLATA_PSYCH_DAWNA} zł za badanie rozpoczęte do ${dataPoPolsku(dodajDni(ZMIANA_OPLATY_PSYCH, -1))}, ${OPLATA_PSYCH} zł od ${dataPoPolsku(ZMIANA_OPLATY_PSYCH)} (§ 13 rozporządzenia o badaniach psychologicznych)`
    : `${OPLATA_PSYCH} zł (§ 13 rozporządzenia o badaniach psychologicznych; ${OPLATA_PSYCH_DAWNA} zł tylko za badanie rozpoczęte przed ${dataPoPolsku(ZMIANA_OPLATY_PSYCH)})`;

function opisKierowcy(t: TerminKierowcy, art: string) {
  const ustawa = t.po60 ? `30 miesięcy od badania po ukończeniu 60 lat (${art} pkt 2)` : `5 lat od badania (${art} pkt 1)`;
  if (t.zrodlo === 'orzeczenie')
    return t.zOrzeczenia === t.ustawowy
      ? `Termin z orzeczenia, taki sam jak z ustawy: ${ustawa}.`
      : `Termin z orzeczenia, wcześniejszy niż z ustawy (${dataPoPolsku(t.ustawowy)}).`;
  if (t.zOrzeczenia) return `${ustawa[0].toUpperCase()}${ustawa.slice(1)}. Termin wpisany w orzeczeniu jest późniejszy; pokazujemy wcześniejszy, ustawowy.`;
  return `${ustawa[0].toUpperCase()}${ustawa.slice(1)}.`;
}
const opisOstroznie = (t: TerminKierowcy) =>
  t.ostroznie && t.ostroznie < t.termin
    ? `Bezpieczniej wcześniej: ${dataPoPolsku(t.ostroznie)}, bo 60. urodziny wypadają przed upływem 5 lat (nasza interpretacja, przepis tego nie wymaga).`
    : null;

/** Wszystkie teksty wyniku. Rzuca RangeError przy błędnych danych (sprawdza je wcześniej formularz). */
export function widok(we: Wejscie, dzis: string): Widok {
  const ZALEGLE = 'Bez aktualnego orzeczenia lekarskiego pracodawca nie może dopuścić do pracy (art. 229 § 4 Kodeksu pracy).';
  const ZALEGLE_PSY =
    'Bez aktualnego orzeczenia psychologicznego kierowca nie spełnia warunku zatrudnienia z art. 39a ust. 1 pkt 4 ustawy o transporcie drogowym, a przewoźnik ma obowiązek kierować na badania (art. 39l ust. 1 pkt 1 lit. b).';
  if (we.rola === 'kierowca') {
    const l = terminKierowcy({ urodzenie: we.urodzenie, badanie: we.lek, zOrzeczenia: we.lekTermin });
    const p = terminKierowcy({ urodzenie: we.urodzenie, badanie: we.psy, zOrzeczenia: we.psyTermin });
    const sl = statusWidoku(l.termin, dzis);
    const sp = statusWidoku(p.termin, dzis);
    return {
      naglowekLek: 'Następne badanie lekarskie najpóźniej',
      lek: dataPoPolsku(l.termin),
      statusLek: sl,
      lekOpis: opisKierowcy(l, 'art. 39j ust. 4'),
      lekOstroznie: opisOstroznie(l),
      pokazPsy: true,
      psy: dataPoPolsku(p.termin),
      statusPsy: sp,
      psyOpis: opisKierowcy(p, 'art. 39k ust. 3'),
      psyOstroznie: opisOstroznie(p),
      dzien60: `${dataPoPolsku(l.dzien60)}; badania wykonane od tego dnia: następne po ${MIESIECY_PO_60} miesiącach`,
      placi: 'przewoźnik albo pracodawca (art. 39l ust. 1 pkt 2 ustawy o transporcie drogowym); gdy jako przedsiębiorca wykonujesz przewóz samodzielnie, płacisz Ty (art. 39m)',
      oplataLek: `limit ${OPLATA_LEKARSKA_MAKS} zł dotyczy badania z ustawy o kierujących pojazdami (art. 79a); przepis nie przesądza, czy obejmuje całe badanie kierowcy z art. 39j. Na etacie i tak płaci pracodawca`,
      oplataPsy: opisOplatyPsych(dzis),
      uwaga: [sl.status === 'po-terminie' ? ZALEGLE : '', sp.status === 'po-terminie' ? ZALEGLE_PSY : ''].filter(Boolean).join(' ') || null,
      icsOpis: ICS_KIEROWCA,
      wydarzenia: wydarzenia(
        [
          { rodzaj: 'lekarskie', termin: l.termin, ostroznie: l.ostroznie },
          { rodzaj: 'psychologiczne', termin: p.termin, ostroznie: p.ostroznie },
        ],
        dzis,
      ),
    };
  }
  const w = widelkiKP({ rola: we.rola, badanie: we.lek, urodzenie: we.urodzenie });
  if (we.lekTermin) {
    sprawdz('termin z orzeczenia', we.lekTermin);
    if (we.lekTermin <= we.lek) throw new RangeError('termin z orzeczenia nie później niż badanie');
  }
  const st = we.lekTermin ? statusWidoku(we.lekTermin, dzis) : dniMiedzy(dzis, w.do) < 0 ? statusWidoku(w.do, dzis) : null;
  const zakres =
    we.rola === 'wozek'
      ? `co ${w.miesiaceOd / 12}–${w.miesiaceDo / 12} lata${w.po50 ? ' po ukończeniu 50 lat' : ''}, zał. nr 1 cz. V pkt 2`
      : 'co 30 miesięcy – 5 lat, zał. nr 1 cz. V pkt 11, jeśli kierowanie pojazdem jest w skierowaniu';
  return {
    naglowekLek: we.lekTermin ? 'Następne badanie okresowe najpóźniej' : 'Następne badanie okresowe',
    lek: we.lekTermin ? dataPoPolsku(we.lekTermin) : `między ${dataPoPolsku(w.od)} a ${dataPoPolsku(w.do)}`,
    statusLek: st,
    lekOpis:
      (we.lekTermin
        ? `Wiąże termin z orzeczenia. Widełki ze wskazówek metodycznych: ${zakres}.`
        : `Widełki ze wskazówek metodycznych: ${zakres}. Wiąże termin, który lekarz wpisze w orzeczeniu.`) +
      (we.rola === 'wozek'
        ? ' Inne czynniki ze skierowania mogą skrócić termin, na przykład praca wymagająca sprawności psychoruchowej: co 1–2 lata, po 50 latach co rok (pkt 4).'
        : ''),
    lekOstroznie: null,
    pokazPsy: false,
    psy: '',
    statusPsy: null,
    psyOpis: '',
    psyOstroznie: null,
    dzien60: '',
    placi: 'pracodawca (art. 229 § 6 Kodeksu pracy)',
    oplataLek: 'cena rynkowa, przepisy jej nie ustalają; płaci pracodawca',
    oplataPsy:
      (we.rola === 'wozek'
        ? 'stałego obowiązku nie ma. Testy sprawności psychoruchowej mogą być częścią badania okresowego, gdy skierowanie wskazuje pracę wymagającą sprawności psychoruchowej (zał. nr 1 cz. V pkt 4), a lekarz może skierować na konsultację psychologiczną (§ 2 ust. 2 rozporządzenia o badaniach profilaktycznych); płaci pracodawca'
        : 'stałego obowiązku nie ma; lekarz może skierować na konsultację psychologiczną (§ 2 ust. 2 rozporządzenia o badaniach profilaktycznych)') +
      '. Psychotesty z ustawy o kierujących pojazdami obowiązują też m.in. po spowodowaniu wypadku z ofiarami, jeździe po alkoholu, przekroczeniu 24 punktów albo na skierowanie lekarza (art. 82 ust. 1 pkt 3–5)',
    uwaga: st?.status === 'po-terminie' ? ZALEGLE : null,
    icsOpis: we.lekTermin ? ICS_KP : ICS_BEZ_TERMINU,
    wydarzenia: we.lekTermin ? wydarzenia([{ rodzaj: 'okresowe', termin: we.lekTermin }], dzis) : [],
  };
}
