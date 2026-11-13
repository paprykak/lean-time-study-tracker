// Zaświadczenie ADR kierowcy: do kiedy ważne, w jakim okresie zrobić kurs doskonalący i egzamin, żeby przedłużyć
// ważność bez przerwy, do kiedy będzie ważne nowe i kto płaci za kurs, egzamin i wydanie dokumentu.
//
// Przepisy (sprawdzone 2026-11-13):
// - ustawa o przewozie towarów niebezpiecznych (t.j. Dz.U. 2024 poz. 643; po tekście jednolitym bez zmian według API Sejmu):
//   art. 20 ust. 1 (pojazdem, dla którego ADR wymaga kursu, kieruje osoba z ważnym zaświadczeniem ADR), art. 20 ust. 2
//   (21 lat, kurs początkowy albo doskonalący przy przedłużeniu, egzamin), art. 21 ust. 9 (rozszerzenie zakresu nie
//   wydłuża ważności), art. 21 ust. 10 (egzamin najpóźniej 6 miesięcy od ukończenia kursu), art. 23 ust. 3 (marszałek
//   województwa wydaje zaświadczenie w 14 dni od egzaminu i wysyła pocztą), art. 23 ust. 4 (5 lat od dnia egzaminu),
//   art. 24 ust. 6 (kurs doskonalący i egzamin w okresie 12 miesięcy poprzedzających dzień upływu ważności: przedłużenie
//   na kolejne 5 lat od dnia upływu ważności dotychczasowego), art. 39 (koszt kursu, egzaminu i wydania zaświadczenia
//   ponosi uczestnik przewozu, gdy kierowca wykonuje czynności na jego rzecz albo gdy sam osobiście prowadzi tę
//   działalność; w innych przypadkach uczestnik kursu), załącznik nr 1 lp. 2.8 (kara 2000 zł za dopuszczenie do
//   przewozu kierowcy bez wymaganego zaświadczenia);
// - rozporządzenie w sprawie egzaminów dla kierowców przewożących towary niebezpieczne (Dz.U. 2024 poz. 964): § 11
//   (zdany przy co najmniej 2/3 poprawnych odpowiedzi), § 18 (opłata za zaświadczenie albo wtórnik 50 zł); zmiana
//   Dz.U. 2026 poz. 1491 (od 1 stycznia 2027 r.) dotyczy tylko wynagrodzenia komisji.
// Tekstu ADR (Dz.U. 2025 poz. 642) nie cytujemy: w Dzienniku Ustaw jest skanem bez warstwy tekstowej, a strona UNECE
// blokuje automatyczne pobieranie. Narzędzie opiera się na ustawie, która przenosi zasady ważności z ADR.
//
// Interpretacje (wariant bezpieczny dla kierowcy: krótszy okres, wcześniejszy koniec):
// 1. „Dzień upływu ważności” to data „ważne do” z zaświadczenia. Okres 12 miesięcy poprzedzających ten dzień można
//    liczyć z nim albo bez niego; podajemy część wspólną obu odczytań: od dnia po dacie sprzed 12 miesięcy do dnia przed
//    końcem ważności (miesiące według art. 112 KC, 29 lutego → 28 lutego).
// 2. Nowe 5 lat liczone od dnia upływu ważności (przedłużenie) albo od dnia egzaminu (egzamin przed okresem z art. 24
//    ust. 6) może się kończyć w dniu, który datą odpowiada początkowi, albo dzień wcześniej; podajemy wcześniejszy dzień
//    jako „co najmniej do”. Datę wiążącą wpisuje marszałek województwa na zaświadczeniu.
// 3. Egzamin przed okresem 12 miesięcy: ustawa nie mówi, że przedłuża ważność od dnia jej upływu (art. 24 ust. 6 tego
//    nie obejmuje), więc liczymy nowe 5 lat od dnia egzaminu (art. 23 ust. 4). Część starej ważności przepada.
// 4. Po upływie ważności przedłużenie z art. 24 ust. 6 nie jest już możliwe. Czy wystarczy wtedy kurs doskonalący, ustawa
//    nie rozstrzyga (art. 20 ust. 2 pkt 3 zna kurs początkowy przy pierwszym zaświadczeniu i doskonalący przy
//    przedłużeniu), więc tego nie przesądzamy.
// 5. Zapas na wydanie dokumentu: egzamin najpóźniej 14 dni przed końcem ważności, bo marszałek ma 14 dni na wydanie
//    zaświadczenia (art. 23 ust. 3); bez czasu na pocztę. To nasz rachunek, nie termin z ustawy.
import { dataPoPolsku, dniMiedzy, dodajDni, dodajLata, dodajMiesiace, poprawnaData } from './terminy';
import type { Wydarzenie } from './kalendarz-ics';

/** Zaświadczenie na 5 lat (art. 23 ust. 4 i art. 24 ust. 6). */
export const LATA_WAZNOSCI = 5;
/** Kurs doskonalący i egzamin w ostatnich 12 miesiącach ważności (art. 24 ust. 6). */
export const MIESIACE_OKNA = 12;
/** Marszałek wydaje zaświadczenie w 14 dni od egzaminu (art. 23 ust. 3). */
export const DNI_NA_WYDANIE = 14;
/** Egzamin najpóźniej 6 miesięcy od ukończenia kursu (art. 21 ust. 10). */
export const MIESIACE_NA_EGZAMIN = 6;
/** Opłata za wydanie zaświadczenia albo wtórnika (§ 18 rozporządzenia Dz.U. 2024 poz. 964). */
export const OPLATA = 50;
/** Kara dla firmy za dopuszczenie do przewozu kierowcy bez zaświadczenia (załącznik nr 1 lp. 2.8). */
export const KARA_FIRMY = 2000;

export type Platnik = 'firma' | 'wlasna-firma' | 'sam';
export type StatusAdr = 'wygaslo' | 'okno' | 'przed-oknem';
export type Egzamin = 'brak' | 'w-oknie' | 'przed-oknem' | 'po-koncu' | 'przed-wydaniem';

export interface DaneAdr {
  /** Data „ważne do” z zaświadczenia. */
  waznyDo: string;
  /** Planowany albo zdany egzamin po kursie doskonalącym (opcjonalnie). */
  egzamin?: string;
  dzis: string;
}

export interface WynikAdr {
  waznyDo: string;
  dniDoKonca: number;
  /** Dni do początku okresu na kurs doskonalący (ujemne, gdy już trwa). */
  dniDoOkna: number;
  status: StatusAdr;
  /** Okres na kurs doskonalący i egzamin (art. 24 ust. 6, część wspólna odczytań). */
  oknoOd: string;
  oknoDo: string;
  /** Egzamin z zapasem 14 dni na wydanie dokumentu (nasz rachunek). */
  zZapasem: string;
  zapasMinal: boolean;
  /** Nowe zaświadczenie po przedłużeniu: co najmniej do (art. 24 ust. 6). */
  nowyPoPrzedluzeniu: string;
  egzamin: Egzamin;
  /** Koniec nowego zaświadczenia według dnia egzaminu (co najmniej do); null bez egzaminu albo po końcu ważności. */
  nowyKoniec: string | null;
  /** Dni dotychczasowej ważności, które przepadają przy egzaminie przed okresem z art. 24 ust. 6. */
  strata: number;
  /** Dni bez ważnego zaświadczenia, gdy egzamin wypada po końcu ważności. */
  przerwa: number;
  wydarzenia: Wydarzenie[];
}

/** Przykład startowy w dniach od dziś (data-dzis): zaświadczenie ważne jeszcze ok. 8 miesięcy, egzamin za 3 miesiące. */
export const PRZYKLAD_DNI = { waznyDo: 240, egzamin: 90 } as const;
export const przykladStartowy = (dzis: string) => ({ waznyDo: dodajDni(dzis, PRZYKLAD_DNI.waznyDo), egzamin: dodajDni(dzis, PRZYKLAD_DNI.egzamin) });

/** Okres na kurs doskonalący i egzamin: od dnia po dacie sprzed 12 miesięcy do dnia przed końcem ważności. */
export const oknoPrzedluzenia = (waznyDo: string) => ({ od: dodajDni(dodajMiesiace(waznyDo, -MIESIACE_OKNA), 1), do: dodajDni(waznyDo, -1) });

/** 5 lat od dnia `od`: wcześniejszy z możliwych końców (dzień przed datą odpowiadającą, art. 112 KC). */
export const piecLatOd = (od: string) => dodajDni(dodajLata(od, LATA_WAZNOSCI), -1);

export function zaswiadczenieAdr({ waznyDo, egzamin, dzis }: DaneAdr): WynikAdr {
  for (const d of [waznyDo, dzis, egzamin]) {
    if (d !== undefined && !poprawnaData(d)) throw new RangeError(`Niepoprawna data: ${d}`);
  }
  const okno = oknoPrzedluzenia(waznyDo);
  if (egzamin && egzamin < dodajLata(waznyDo, -LATA_WAZNOSCI)) throw new RangeError('Egzamin przed wydaniem obecnego zaświadczenia.');
  const dniDoKonca = dniMiedzy(dzis, waznyDo);
  const status: StatusAdr = dniDoKonca < 0 ? 'wygaslo' : dzis >= okno.od ? 'okno' : 'przed-oknem';
  const nowyPoPrzedluzeniu = piecLatOd(waznyDo);
  const zZapasem = dodajDni(waznyDo, -DNI_NA_WYDANIE);

  let stan: Egzamin = 'brak';
  let nowyKoniec: string | null = null;
  let strata = 0;
  let przerwa = 0;
  if (egzamin) {
    if (egzamin >= waznyDo) {
      stan = 'po-koncu';
      przerwa = dniMiedzy(waznyDo, egzamin);
    } else if (egzamin < okno.od) {
      stan = 'przed-oknem';
      nowyKoniec = piecLatOd(egzamin);
      strata = dniMiedzy(egzamin, waznyDo);
    } else {
      stan = egzamin > zZapasem ? 'przed-wydaniem' : 'w-oknie';
      nowyKoniec = nowyPoPrzedluzeniu;
    }
  }

  const opis = `Zaświadczenie ADR ważne do ${dataPoPolsku(waznyDo)} Kurs ADR doskonalący i egzamin od ${dataPoPolsku(okno.od)} do ${dataPoPolsku(okno.do)} (art. 24 ust. 6 ustawy o przewozie towarów niebezpiecznych); z zapasem na wydanie dokumentu egzamin do ${dataPoPolsku(zZapasem)} Policzone na rytmhali.pl/narzedzia/zaswiadczenie-adr.`;
  const kandydaci: Wydarzenie[] = [
    { data: okno.od, tytul: 'ADR: od dziś kurs doskonalący i egzamin przedłużą zaświadczenie', opis },
    { data: zZapasem, tytul: 'ADR: ostatni dzień na egzamin z zapasem na wydanie zaświadczenia', opis },
    { data: okno.do, tytul: 'ADR: ostatni dzień na egzamin, który przedłuża zaświadczenie', opis },
    { data: waznyDo, tytul: 'Koniec ważności zaświadczenia ADR', opis },
  ];

  return {
    waznyDo,
    dniDoKonca,
    dniDoOkna: dniMiedzy(dzis, okno.od),
    status,
    oknoOd: okno.od,
    oknoDo: okno.do,
    zZapasem,
    zapasMinal: dzis > zZapasem,
    nowyPoPrzedluzeniu,
    egzamin: stan,
    nowyKoniec,
    strata,
    przerwa,
    wydarzenia: kandydaci.filter((w) => dniMiedzy(dzis, w.data) >= 0),
  };
}

/** Kto płaci za kurs, egzamin i wydanie zaświadczenia (art. 39). */
export function ktoPlaci(platnik: Platnik): string {
  if (platnik === 'firma') return 'Firma, dla której wozisz towary niebezpieczne (pracodawca albo zleceniodawca): kurs, egzamin i wydanie zaświadczenia (art. 39 pkt 1).';
  if (platnik === 'wlasna-firma') return 'Ty jako firma, bo osobiście wykonujesz przewóz towarów niebezpiecznych (art. 39 pkt 1).';
  return 'Ty jako uczestnik kursu, gdy nie wykonujesz przewozu na rzecz firmy (art. 39 pkt 2). Gdy zaczniesz wozić towary niebezpieczne dla firmy, koszty następnego kursu ponosi ona.';
}

export interface OpisAdr {
  status: string;
  /** Wartość atrybutu data-status (kolor). */
  kod: StatusAdr;
  termin: string;
  okno: string;
  zapas: string;
  nowy: string;
  plan: string;
  placi: string;
  uwagi: string[];
}

/** Teksty wyniku: te same w HTML ze strony i w skrypcie przeglądarki. */
export function opisAdr(r: WynikAdr, platnik: Platnik): OpisAdr {
  const dni = (n: number) => `${n} ${n === 1 ? 'dzień' : 'dni'}`;
  const status =
    r.status === 'wygaslo'
      ? 'Wygasło'
      : r.status === 'okno'
        ? r.dniDoKonca === 0
          ? 'Ostatni dzień ważności'
          : `Czas na kurs doskonalący: zostało ${dni(r.dniDoKonca)}`
        : `Ważne: kurs doskonalący za ${dni(r.dniDoOkna)}`;
  const plan = (() => {
    switch (r.egzamin) {
      case 'brak':
        return '—';
      case 'w-oknie':
        return `przedłużenie: nowe zaświadczenie ważne co najmniej do ${dataPoPolsku(r.nowyKoniec!)}`;
      case 'przed-wydaniem':
        return `przedłużenie: nowe zaświadczenie ważne co najmniej do ${dataPoPolsku(r.nowyKoniec!)}, ale urząd ma 14 dni na wydanie, więc dokument może przyjść po końcu obecnego`;
      case 'przed-oknem':
        return `za wcześnie na przedłużenie: nowe 5 lat od dnia egzaminu, co najmniej do ${dataPoPolsku(r.nowyKoniec!)}; przepada ${dni(r.strata)} obecnej ważności`;
      case 'po-koncu':
        return `po końcu ważności: ${dni(r.przerwa)} bez zaświadczenia, przedłużenie już nie przysługuje`;
    }
  })();
  const uwagi: string[] = [];
  if (r.status === 'wygaslo') {
    uwagi.push(
      'Bez ważnego zaświadczenia nie możesz kierować pojazdem, dla którego ADR wymaga kursu (art. 20 ust. 1). Przedłużenia z art. 24 ust. 6 już nie ma; ustawa przy przedłużeniu przewiduje kurs doskonalący, a przy pierwszym zaświadczeniu początkowy, więc o rodzaj kursu po wygaśnięciu zapytaj w ośrodku szkolenia albo urzędzie marszałkowskim.',
    );
  } else {
    uwagi.push(`Egzamin trzeba zdać najpóźniej 6 miesięcy po ukończeniu kursu (art. 21 ust. 10), więc kurs skończ tak, żeby egzamin wypadł w okresie od ${dataPoPolsku(r.oknoOd)} do ${dataPoPolsku(r.oknoDo)}`);
  }
  uwagi.push(`Firma, która dopuści do przewozu kierowcę bez wymaganego zaświadczenia ADR, płaci karę ${KARA_FIRMY} zł.`);
  return {
    status,
    kod: r.status,
    termin: dataPoPolsku(r.waznyDo),
    okno: r.status === 'wygaslo' ? 'minął' : `od ${dataPoPolsku(r.oknoOd)} do ${dataPoPolsku(r.oknoDo)}`,
    zapas: r.status === 'wygaslo' || r.zapasMinal ? 'minął' : `do ${dataPoPolsku(r.zZapasem)} (nasz rachunek: 14 dni na wydanie)`,
    nowy: `co najmniej do ${dataPoPolsku(r.nowyPoPrzedluzeniu)}`,
    plan,
    placi: ktoPlaci(platnik),
    uwagi,
  };
}
