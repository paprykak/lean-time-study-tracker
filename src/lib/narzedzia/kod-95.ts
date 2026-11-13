// Kod 95: ważność wpisu w prawie jazdy, najpóźniejszy dzień ukończenia szkolenia okresowego, strata przy szkoleniu
// zrobionym wcześniej i sprawdzenie, czy praca w ogóle wymaga kodu 95.
//
// Przepisy (sprawdzone 2026-11-12):
// - art. 15 ust. 3–5 ustawy o kierujących pojazdami (ukp, t.j. Dz.U. 2025 poz. 1226): wpis jest dokonywany w formie
//   wymiany prawa jazdy na okres 5 lat liczony od dnia wydania świadectwa kwalifikacji zawodowej, nie dłużej niż okres
//   ważności orzeczenia lekarskiego i psychologicznego; świadectwo ze szkolenia w zakresie jednego bloku daje wpis dla
//   wszystkich posiadanych kategorii C1–D+E; za wpis opłata jak za prawo jazdy (art. 10 ust. 1);
// - rozporządzenie w sprawie wysokości opłat za wydanie dokumentów stwierdzających uprawnienia do kierowania pojazdami
//   (Dz.U. 2025 poz. 953), § 1 pkt 1: prawo jazdy 100 zł;
// - art. 39a ust. 1 pkt 5–6, ust. 3 i 4, art. 39d ust. 2, 5 i 6, art. 39f ust. 1, art. 39l ustawy o transporcie
//   drogowym (utd, t.j. Dz.U. 2025 poz. 1490); art. 3 ust. 1 pkt 3 utd (ratownictwo medyczne, transport sanitarny);
// - rozporządzenie w sprawie szkolenia i egzaminowania kierowców wykonujących przewóz drogowy (Dz.U. 2026 poz. 1355,
//   od 3 listopada 2026 r.): § 13 ust. 1 (35 godzin), § 21 ust. 5 (świadectwo najpóźniej następnego dnia roboczego
//   po ukończeniu ostatniego modułu);
// - art. 112 Kodeksu cywilnego (stosowany odpowiednio): 5 lat kończy się w dniu, który datą odpowiada dniowi wydania
//   świadectwa, a gdy go nie ma (29 lutego), w ostatnim dniu miesiąca. Wiąże data w prawie jazdy (CEPiK może wydrukować
//   inną niż ten rachunek).
//
// Interpretacje (wariant bezpieczny dla pracownika: najwcześniejszy termin):
// 1. Kod jest ważny do końca dnia „świadectwo + 5 lat” (art. 112 KC), przycięty do wcześniejszej z dat ważności orzeczeń.
// 2. Data przy kodzie 95 w prawie jazdy (rubryka 12) ma pierwszeństwo przed obliczeniem; w trybie „z prawa jazdy” bierzemy
//    ją wprost. Orzeczenia ograniczają wtedy tylko nowy wpis po szkoleniu. Art. 39d ust. 2 utd można czytać jako stały
//    cykl od kwalifikacji wstępnej; przepisy nie rozstrzygają, jak pogodzić go z art. 15 ust. 4 ukp. Liczymy z ukp.
// 3. Do jazdy potrzebne jest prawo jazdy z aktualnym wpisem (art. 39f ust. 1 i 3 utd), więc głównym terminem jest data
//    z zapasem na wymianę prawa jazdy (szacunek redakcji, ZAPAS_DNI). Osobno: ostatni dzień ukończenia szkolenia, po którym
//    świadectwo na pewno przyjdzie przed końcem ważności (§ 21 ust. 5: najpóźniej następnego dnia roboczego), czyli
//    przeddzień ostatniego dnia roboczego ważności kodu. To nasz rachunek, nie termin z ustawy; bez czasu na wymianę. Dzień roboczy: poniedziałek–
//    piątek bez świąt (sobota jako wolna daje wcześniejszy termin). Czasu wymiany prawa jazdy przepisy nie podają.
// 4. Szkolenie wcześniej: nowe 5 lat liczy się od nowego świadectwa; reszta starego wpisu przepada (żaden przepis jej
//    nie dolicza). Przyjmujemy świadectwo z dniem ukończenia szkolenia (najwcześniejsza możliwa data, więc i najwcześniejszy
//    koniec nowego wpisu).
// 5. Wyjątki z art. 39a ust. 3: pkt 5 tylko dla kategorii D i D1 (brzmienie przepisu). Wyjątki z warunkami ocennymi
//    (pkt 5, 9, 10, 11 i „handlowy”/„niehandlowy” w pkt 6, 7 i 8) dają wynik „nie potrzebujesz, jeśli spełniasz wszystkie
//    warunki”. Osobno art. 3 ust. 1 pkt 3 utd: ustawy nie stosuje się do zespołów ratownictwa medycznego i transportu
//    sanitarnego (to nie jest punkt art. 39a ust. 3).
import { czyRoboczy } from './dni-robocze';
import { swieta } from './czas-pracy';
import { dataPoPolsku, dniMiedzy, dodajDni, dodajLata, poprawnaData } from './terminy';
import type { Wydarzenie } from './kalendarz-ics';

/** Wpis na 5 lat (art. 15 ust. 4 ukp). */
export const LATA_WPISU = 5;
/** Kurs okresowy: 35 godzin (§ 13 ust. 1 pkt 1 rozporządzenia Dz.U. 2026 poz. 1355). */
export const GODZINY_SZKOLENIA = 35;
/** Wymiana prawa jazdy z wpisem: 100 zł (art. 15 ust. 5 ukp, rozp. Dz.U. 2025 poz. 953 § 1 pkt 1). */
export const OPLATA_PRAWO_JAZDY = 100;
/** Przykładowy zapas na wymianę prawa jazdy (dni): szacunek, nie przepis. */
export const ZAPAS_DNI = 30;

export type Tryb = 'swiadectwo' | 'prawo-jazdy';
export type Ograniczenie = 'piec-lat' | 'prawo-jazdy' | 'lekarskie' | 'psychologiczne';
export type StatusKodu = 'wygaslo' | 'pilne' | 'wkrotce' | 'w-terminie';

export interface DaneKodu {
  tryb: Tryb;
  /** Data wydania świadectwa (tryb „swiadectwo”) albo data przy kodzie 95 w prawie jazdy. */
  data: string;
  lekarskieDo?: string;
  psychologiczneDo?: string;
  /** Planowany dzień ukończenia szkolenia (opcjonalnie). */
  szkolenie?: string;
  dzis: string;
}

export interface WynikKodu {
  waznyDo: string;
  ograniczenie: Ograniczenie;
  dniDoKonca: number;
  status: StatusKodu;
  /** Najpóźniejszy dzień ukończenia szkolenia, żeby świadectwo zdążyło przed końcem ważności. */
  szkolenieNajpozniej: string;
  /** Przykładowy termin z zapasem na wymianę prawa jazdy (szacunek). */
  zZapasem: string;
  /** Orzeczenie kończy się wcześniej niż data w prawie jazdy (tryb „prawo-jazdy”). */
  orzeczenieWczesniej: boolean;
  plan: null | {
    /** Koniec nowego wpisu: 5 lat od nowego świadectwa, nie dłużej niż orzeczenia. */
    nowyKoniec: string;
    nowyOgraniczony: boolean;
    /** Dni dotychczasowej ważności, które przepadają (0, gdy szkolenie po końcu). */
    strata: number;
    /** Dni bez ważnego kodu między końcem a nowym świadectwem (0, gdy szkolenie przed końcem). */
    przerwa: number;
    /** Wpisane orzeczenie kończy się przed dniem szkolenia: przed wpisem potrzebne nowe (art. 15 ust. 2 ukp). */
    noweOrzeczenie: boolean;
  };
  wydarzenia: Wydarzenie[];
}

const najwczesniejsza = (daty: (string | undefined)[]) => daty.filter((d): d is string => !!d).sort()[0];

/** Ostatni dzień roboczy (pon.–pt. bez świąt) nie później niż `data`. */
export function ostatniRoboczy(data: string): string {
  let d = data;
  const sw = new Set([...swieta(Number(d.slice(0, 4)) - 1), ...swieta(Number(d.slice(0, 4)))].map((s) => s.data));
  while (!czyRoboczy(d, sw)) d = dodajDni(d, -1);
  return d;
}

/** Najpóźniejszy dzień ukończenia szkolenia: przeddzień ostatniego dnia roboczego ważności (§ 21 ust. 5). */
export const szkolenieNajpozniej = (waznyDo: string) => dodajDni(ostatniRoboczy(waznyDo), -1);

/** Przykład startowy w dniach od dziś (znaczniki data-dzis, src/lib/narzedzia/dzis-w-formularzu.ts):
 *  świadectwo sprzed ok. 4,5 roku, szkolenie za 60 dni. */
export const PRZYKLAD_DNI = { data: -1640, szkolenie: 60 } as const;
export const przykladStartowy = (dzis: string) => ({ data: dodajDni(dzis, PRZYKLAD_DNI.data), szkolenie: dodajDni(dzis, PRZYKLAD_DNI.szkolenie) });

export function kod95({ tryb, data, lekarskieDo, psychologiczneDo, szkolenie, dzis }: DaneKodu): WynikKodu {
  for (const d of [data, dzis, lekarskieDo, psychologiczneDo, szkolenie]) {
    if (d !== undefined && !poprawnaData(d)) throw new RangeError(`Niepoprawna data: ${d}`);
  }
  const orzeczenia = najwczesniejsza([lekarskieDo, psychologiczneDo]);
  let waznyDo: string;
  let ograniczenie: Ograniczenie;
  if (tryb === 'swiadectwo') {
    const piec = dodajLata(data, LATA_WPISU);
    waznyDo = najwczesniejsza([piec, lekarskieDo, psychologiczneDo]);
    ograniczenie = waznyDo === piec ? 'piec-lat' : waznyDo === lekarskieDo ? 'lekarskie' : 'psychologiczne';
    if (orzeczenia && orzeczenia < data) throw new RangeError('Orzeczenie kończy się przed wydaniem świadectwa.');
  } else {
    waznyDo = data;
    ograniczenie = 'prawo-jazdy';
  }
  const dniDoKonca = dniMiedzy(dzis, waznyDo);
  const status: StatusKodu = dniDoKonca < 0 ? 'wygaslo' : dniDoKonca <= 60 ? 'pilne' : dniDoKonca <= 180 ? 'wkrotce' : 'w-terminie';
  const najpozniej = szkolenieNajpozniej(waznyDo);
  const zZapasem = dodajDni(najpozniej, -ZAPAS_DNI);

  let plan: WynikKodu['plan'] = null;
  if (szkolenie) {
    if (tryb === 'swiadectwo' && szkolenie < data) throw new RangeError('Szkolenie kończy się przed wydaniem obecnego świadectwa.');
    const piec = dodajLata(szkolenie, LATA_WPISU);
    // Orzeczenie, które wygaśnie przed dniem szkolenia, nie ogranicza nowego wpisu: do wpisu potrzebne będzie nowe.
    const aktualne = [lekarskieDo, psychologiczneDo].filter((d): d is string => !!d && d >= szkolenie);
    const nowyKoniec = najwczesniejsza([piec, ...aktualne]);
    const roznica = dniMiedzy(szkolenie, waznyDo);
    plan = {
      nowyKoniec,
      nowyOgraniczony: nowyKoniec !== piec,
      strata: Math.max(0, roznica),
      przerwa: Math.max(0, -roznica),
      noweOrzeczenie: [lekarskieDo, psychologiczneDo].some((d) => !!d && d < szkolenie),
    };
  }

  const opis = `Kod 95 ważny do ${dataPoPolsku(waznyDo)} Szkolenie okresowe (${GODZINY_SZKOLENIA} h) z zapasem na wymianę prawa jazdy: do ${dataPoPolsku(zZapasem)} (szacunek redakcji: ${ZAPAS_DNI} dni). Ostatni dzień, w którym świadectwo na pewno przyjdzie przed końcem ważności: ${dataPoPolsku(najpozniej)} (rachunek z § 21 ust. 5 rozporządzenia, nie termin z ustawy). Wiąże data w prawie jazdy. Policzone na rytmhali.pl/narzedzia/kod-95.`;
  const kandydaci: Wydarzenie[] = [
    // Gdy do końca zostało mniej niż 180 dni, przypomnienie o zapisie dostaje dzisiejszą datę.
    { data: dniDoKonca >= 0 && dniDoKonca < 180 ? dzis : dodajDni(waznyDo, -180), tytul: 'Zapisz się na szkolenie okresowe (kod 95)', opis },
    { data: zZapasem, tytul: 'Kod 95: ukończ szkolenie okresowe (z zapasem na wymianę prawa jazdy)', opis },
    { data: najpozniej, tytul: 'Kod 95: ostatni dzień na ukończenie szkolenia (świadectwo zdąży, bez wymiany prawa jazdy)', opis },
    { data: waznyDo, tytul: 'Koniec ważności kodu 95', opis },
  ];

  return {
    waznyDo,
    ograniczenie,
    dniDoKonca,
    status,
    szkolenieNajpozniej: najpozniej,
    zZapasem,
    orzeczenieWczesniej: tryb === 'prawo-jazdy' && !!orzeczenia && orzeczenia < data,
    plan,
    wydarzenia: kandydaci.filter((w) => dniMiedzy(dzis, w.data) >= 0),
  };
}

// --- Czy potrzebujesz kodu 95 (art. 39a ust. 3 i 4 utd, art. 3 ust. 1 pkt 3 utd) ---

export const KATEGORIE_BEZ = ['AM', 'A1', 'A2', 'A', 'B1', 'B', 'B+E'] as const;
export const KATEGORIE_Z = ['C1', 'C1+E', 'C', 'C+E', 'D1', 'D1+E', 'D', 'D+E'] as const;
export const KATEGORIE = [...KATEGORIE_BEZ, ...KATEGORIE_Z] as const;
export type Kategoria = (typeof KATEGORIE)[number];

export interface Wyjatek {
  id: string;
  /** Punkt art. 39a ust. 3 albo „art. 3 ust. 1 pkt 3”. */
  pkt: string;
  /** Krótka etykieta pola wyboru. */
  krotko: string;
  /** Streszczenie brzmienia (tabela w wyjaśnieniu). */
  tresc: string;
  /** Warunek ocenny: wynik „jeśli spełniasz wszystkie warunki”. */
  ocenny?: boolean;
  /** Tylko dla tych kategorii (brzmienie przepisu). */
  tylko?: Kategoria[];
}

export const WYJATKI: Wyjatek[] = [
  { id: 'w1', pkt: '1', krotko: 'Pojazd do 45 km/h z konstrukcji', tresc: 'pojazd, którego konstrukcja ogranicza prędkość jazdy do 45 km/h' },
  { id: 'w2', pkt: '2', krotko: 'Siły zbrojne', tresc: 'pojazd sił zbrojnych albo w ich dyspozycji, przy przewozie w związku z zadaniami sił zbrojnych' },
  { id: 'w3', pkt: '3', krotko: 'Straż, policja, obrona cywilna', tresc: 'pojazd formacji obrony cywilnej, jednostek ochrony przeciwpożarowej albo odpowiedzialnych za bezpieczeństwo lub porządek publiczny, przy ich zadaniach' },
  { id: 'w4', pkt: '4', krotko: 'Testy, naprawa, pojazd nowy', tresc: 'pojazd w testach drogowych do celów rozwoju technicznego prowadzonych przez producentów, instytuty badawcze, uczelnie lub Sieć Badawczą Łukasiewicz, w testach do celów naprawy lub konserwacji albo nowy lub odremontowany, jeszcze niewprowadzony do użytku' },
  { id: 'w5', pkt: '5', krotko: 'Autobus bez pasażerów do serwisu', tresc: 'pojazd kategorii D lub D1 prowadzony bez pasażerów przez personel techniczny do lub z pobliskiego centrum obsługi, gdy prowadzenie nie jest głównym zajęciem', ocenny: true, tylko: ['D', 'D1'] },
  { id: 'w6', pkt: '6', krotko: 'Ratunek, pomoc humanitarna', tresc: 'pojazd w sytuacjach zagrożenia, do akcji ratunkowych albo do niehandlowego przewozu pomocy humanitarnej', ocenny: true },
  { id: 'w7', pkt: '7', krotko: 'Nauka jazdy, egzamin', tresc: 'pojazd do nauki jazdy, szkolenia, egzaminu państwowego albo praktycznego szkolenia w miejscu pracy (z osobą z kwalifikacją lub instruktorem), gdy nie jest wtedy w przewozie handlowym', ocenny: true },
  { id: 'w8', pkt: '8', krotko: 'Przewóz niehandlowy', tresc: 'pojazd do niehandlowego przewozu drogowego osób lub rzeczy', ocenny: true },
  { id: 'w9', pkt: '9', krotko: 'Wożę sprzęt do swojej pracy', tresc: 'przewóz materiałów, urządzeń lub sprzętu potrzebnych kierowcy do jego pracy, gdy prowadzenie nie jest głównym zajęciem', ocenny: true },
  { id: 'w10', pkt: '10', krotko: 'Własna firma na wsi, sporadycznie', tresc: 'obszary wiejskie, własna działalność kierowcy, który nie oferuje usług przewozowych; przewóz sporadyczny i bez wpływu na bezpieczeństwo ruchu', ocenny: true },
  { id: 'w11', pkt: '11', krotko: 'Rolnictwo, las, rybactwo do 100 km', tresc: 'pojazd wykorzystywany lub wynajęty bez kierowcy przez przedsiębiorstwo rolnicze, ogrodnicze, leśne, gospodarstwo rolne lub rybackie do przewozu rzeczy w ramach własnej działalności, chyba że jazda to część głównego zajęcia albo ponad 100 km od siedziby', ocenny: true },
];

/** Osobne wyłączenie: art. 3 ust. 1 pkt 3 utd (ustawy nie stosuje się), nie punkt art. 39a ust. 3. */
export const RATOWNICTWO: Wyjatek = { id: 'ratownictwo', pkt: 'art. 3 ust. 1 pkt 3', krotko: 'Ratownictwo medyczne, transport sanitarny', tresc: 'przewóz pojazdami zespołów ratownictwa medycznego oraz w ramach usług transportu sanitarnego: ustawy o transporcie drogowym nie stosuje się' };

/** Wszystkie pola wyboru: wyjątki z art. 39a ust. 3 i wyłączenie z art. 3 ust. 1 pkt 3. */
export const WSZYSTKIE_WYJATKI: Wyjatek[] = [...WYJATKI, RATOWNICTWO];

export type Potrzeba = 'nie' | 'raczej-nie' | 'tak';

export interface WynikPotrzeby {
  potrzeba: Potrzeba;
  /** Wyjątki zaznaczone, które dotyczą tej kategorii. */
  wyjatki: Wyjatek[];
  /** Zaznaczone, ale niedotyczące tej kategorii (pkt 5 poza D i D1). */
  niedotyczace: Wyjatek[];
}

export function czyPotrzebny(kategoria: Kategoria, zaznaczone: string[]): WynikPotrzeby {
  if (!KATEGORIE.includes(kategoria)) throw new RangeError(`Nieznana kategoria: ${kategoria}`);
  const wybrane = zaznaczone.map((id) => {
    const w = WSZYSTKIE_WYJATKI.find((x) => x.id === id);
    if (!w) throw new RangeError(`Nieznany wyjątek: ${id}`);
    return w;
  });
  if ((KATEGORIE_BEZ as readonly string[]).includes(kategoria)) return { potrzeba: 'nie', wyjatki: [], niedotyczace: [] };
  const wyjatki = wybrane.filter((w) => !w.tylko || w.tylko.includes(kategoria));
  const niedotyczace = wybrane.filter((w) => !wyjatki.includes(w));
  const potrzeba: Potrzeba = wyjatki.length === 0 ? 'tak' : wyjatki.some((w) => !w.ocenny) ? 'nie' : 'raczej-nie';
  return { potrzeba, wyjatki, niedotyczace };
}
