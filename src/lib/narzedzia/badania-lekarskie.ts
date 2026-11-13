// Badania lekarskie w pracy: badanie kontrolne po zwolnieniu, badania wstępne w nowej pracy, odwołanie od orzeczenia
// i przypomnienie o następnym badaniu okresowym.
//
// Przepisy:
// - Kodeks pracy, t.j. Dz.U. 2026 poz. 1245: art. 26 (stosunek pracy nawiązuje się w dniu rozpoczęcia pracy z umowy),
//   art. 201 § 1 (młodociany: wstępne badania przed przyjęciem do pracy), art. 229 § 1 (kto podlega badaniom wstępnym,
//   w tym pkt 2: przeniesienie na stanowisko z czynnikami szkodliwymi lub uciążliwymi), § 1¹ (bez badań wstępnych:
//   pkt 1 ten sam pracodawca, pkt 2 inny pracodawca, oba „w ciągu 30 dni po rozwiązaniu lub wygaśnięciu” umowy),
//   § 1² (drugi etat), § 1³ (pracodawca żąda orzeczenia i skierowania), § 2 (badanie kontrolne przy niezdolności
//   do pracy „trwającej dłużej niż 30 dni, spowodowanej chorobą”), § 3 (okresowe i kontrolne w miarę możliwości
//   w godzinach pracy, z wynagrodzeniem i zwrotem przejazdu), § 4 (bez aktualnego orzeczenia nie wolno dopuścić
//   do pracy), § 4a (skierowanie od pracodawcy), § 6 (koszt pracodawcy), art. 300 (odesłanie do Kodeksu cywilnego).
// - Kodeks cywilny, t.j. Dz.U. 2026 poz. 795: art. 111 § 2 (termin w dniach liczy się od dnia po zdarzeniu),
//   art. 115 (przesunięcie z soboty i święta; tu go nie stosujemy, niżej).
// - Rozporządzenie MZiOS z 30 maja 1996 r. w sprawie badań lekarskich pracowników, t.j. Dz.U. 2023 poz. 607,
//   ze zmianą Dz.U. 2026 poz. 456 (od 17 kwietnia 2026 r., § 2: orzeczenia według dawnych przepisów jeszcze przez
//   6 miesięcy): § 3 ust. 4a pkt 12 i 15 (data następnego badania okresowego i pouczenie w orzeczeniu; były też
//   we wzorze sprzed zmiany), § 2 ust. 1 i 2 (wskazówki metodyczne; lekarz może wyznaczyć krótszy termin), § 5 ust. 1, 3–6 (odwołanie na piśmie,
//   z uzasadnieniem, w 7 dni od otrzymania orzeczenia, przez jednostkę medycyny pracy; przekazanie w 7 dni; badanie
//   w 14 dni; orzeczenie ostateczne).
// - Rozporządzenie w sprawie ogólnych przepisów BHP, Dz.U. 2003 poz. 1650, § 80 (wykaz prac szczególnie niebezpiecznych
//   prowadzi pracodawca).
// - Dni wolne: swieta() z czas-pracy.ts (ustawa o dniach wolnych od pracy, z Wigilią od 2025 r.).
//
// Interpretacje (przepis nie rozstrzyga, wybieramy wariant bezpieczny dla pracownika):
// 1. „Dłużej niż 30 dni” to dni kalendarzowe z pierwszym i ostatnim dniem zwolnienia: 30 dni nie wymaga badania,
//    31 wymaga. Przepis nie mówi o dniach roboczych, więc weekendy i święta w zwolnieniu się liczą.
// 2. Zwolnienia stykające się (następne od dnia po poprzednim) albo nachodzące to jedna niezdolność (scal() jak
//    w okresie zasiłkowym). Przepis nie każe sumować niezdolności rozdzielonych przerwą (art. 9 ust. 2 ustawy
//    zasiłkowej dotyczy tylko zasiłku). Gdy przerwa składa się wyłącznie z dni wolnych (sobota, niedziela, święto)
//    albo osoba zaznaczy, że w przerwie nie było dnia pracy z grafiku, przepis nie rozstrzyga, czy niezdolność
//    „trwała”: gdy łącznie z przerwą wychodzi ponad 30 dni, wynik „przepis nie rozstrzyga, bezpieczniej zrobić
//    badanie”. Odpowiedź „tak, był dzień pracy” rozdziela zwolnienia bez względu na kalendarz. Gdy w takim łańcuchu
//    wcześniejsza niezdolność sama trwała ponad 30 dni, przepis rozstrzyga: pracownik po niej nie wrócił do pracy,
//    więc badanie kontrolne jest potrzebne bez względu na łączenie zwolnień.
// 3. Przepis mówi „spowodowanej chorobą”. Zwolnienie w ciąży i po wypadku liczymy tak samo (wariant bezpieczny,
//    z adnotacją). Opieka nad dzieckiem lub członkiem rodziny to nie niezdolność pracownika: nie dotyczy.
// 4. Liczymy niezdolność, z której się wraca (ostatnią i połączone z nią). Termin badania kontrolnego przepis nie podaje;
//    z art. 229 § 4 wynika, że przed dopuszczeniem do pracy. Dzień powrotu to dzień po ostatnim dniu zwolnienia.
// 5. „W ciągu 30 dni po rozwiązaniu lub wygaśnięciu”: art. 300 Kp i art. 111 § 2 Kc, ostatni dzień umowy się nie liczy,
//    ostatni dzień na przyjęcie to koniec + 30. „Przyjęcie” to dzień rozpoczęcia pracy z umowy (art. 26 Kp). Bez
//    przesunięcia z art. 115 Kc (to nie termin na czynność pracownika).
// 6. „Aktualne orzeczenie”: dzień rozpoczęcia pracy przed datą następnego badania z orzeczenia. W dniu tej daty
//    i później orzeczenie traktujemy jako nieaktualne. Orzeczenie bez tej daty: aktualność do sprawdzenia.
// 7. U innego pracodawcy (pkt 2) i na drugim etacie (§ 1², warunek 30 dni odpada, bo poprzednia umowa trwa) zwolnienie
//    z badań zależy zawsze od tego, czy pracodawca stwierdzi, że warunki odpowiadają: wynik najwyżej „warunkowy”.
//    „Nie wiem” przy pracach szczególnie niebezpiecznych: badania potrzebne (zapytaj o wykaz z § 80).
// 8. U tego samego pracodawcy (pkt 1) przepis nie wymaga aktualnego orzeczenia ani nie wyłącza prac szczególnie
//    niebezpiecznych, ale art. 229 § 4 zakazuje dopuszczenia do pracy bez aktualnego orzeczenia: gdy minęło, wynik
//    „bez badań wstępnych, ale przed pracą potrzebne badanie” (rodzaju przepis nie nazywa).
// 9. Młodociany: art. 201 § 1 bez wyjątków, więc zawsze badania wstępne (także przy zmianie stanowiska, art. 229 § 1 pkt 2).
// 10. Zmiana stanowiska u dorosłego: wstępne tylko przy czynnikach szkodliwych lub uciążliwych; „nie wiem” → potrzebne.
// 11. Odwołanie: dzień otrzymania orzeczenia się nie liczy, ostatni dzień = otrzymanie + 7. Rozporządzenie nie przesuwa
//     terminu z soboty ani święta, a stosowanie art. 115 Kc jest niepewne: datę pokazujemy bez przesunięcia
//     i z ostrzeżeniem.
// 12. Następnego badania okresowego nie wyliczamy z tabel załącznika nr 1 (zakresy i ocena lekarza): bierzemy datę
//     z orzeczenia i robimy przypomnienie w tym dniu i 30 dni wcześniej (czas na skierowanie).
import { czyRoboczy } from './dni-robocze';
import { swieta } from './czas-pracy';
import { dzienTygodnia } from './dni-wolne';
import type { Wydarzenie } from './kalendarz-ics';
import { scal, type Zwolnienie } from './okres-zasilkowy';
import { dataPoPolsku, dniMiedzy, dodajDni, ileDni, poprawnaData } from './terminy';
import { odmiana } from '../redakcja';

export type { Zwolnienie };

/** Art. 229 § 2 Kp: niezdolność „dłużej niż 30 dni”. */
export const PROG_KONTROLNE = 30;
/** Art. 229 § 1¹ Kp: przyjęcie „w ciągu 30 dni” po końcu poprzedniej umowy. */
export const DNI_NA_PRZYJECIE = 30;
/** § 5 ust. 3 rozporządzenia: odwołanie w 7 dni od otrzymania orzeczenia. */
export const DNI_NA_ODWOLANIE = 7;
/** § 5 ust. 4: jednostka przekazuje odwołanie w 7 dni. */
export const DNI_PRZEKAZANIE = 7;
/** § 5 ust. 5: badanie w trybie odwołania w 14 dni od otrzymania odwołania. */
export const DNI_BADANIE_ODWOLAWCZE = 14;
/** Przypomnienie o skierowaniu przed badaniem okresowym. */
export const PRZYPOMNIENIE_DNI = 30;

const dni = (z: Zwolnienie) => dniMiedzy(z.od, z.do) + 1;
const sprawdzDate = (d: string, co: string) => {
  if (!poprawnaData(d)) throw new RangeError(`Niepoprawna data: ${co}`);
};

// ---------- A. Badanie kontrolne po zwolnieniu ----------

export type PowodNiezdolnosci = 'choroba' | 'ciaza' | 'wypadek' | 'opieka';
/** Czy w przerwie między zwolnieniami był dzień pracy: 'auto' = według kalendarza (pon.–pt. bez świąt). */
export type DzienPracyWPrzerwie = 'auto' | 'tak' | 'nie';
export type WynikKontrolnego = 'potrzebne' | 'niewymagane' | 'nierozstrzygniete' | 'nie-dotyczy';

export interface Kontrolne {
  wynik: WynikKontrolnego;
  /** Ostatnia nieprzerwana niezdolność (po scaleniu stykających się zwolnień). */
  od: string;
  do: string;
  dniOstatniej: number;
  /** Dzień po ostatnim dniu zwolnienia. */
  powrot: string;
  /** Zwolnienia połączone przerwami bez dnia pracy (1, gdy brak takich przerw). */
  zwolnienWLancuchu: number;
  /** Pierwszy dzień łańcucha. */
  odLancucha: string;
  /** Dni zwolnień w łańcuchu bez przerw i łącznie z przerwami. */
  dniZwolnien: number;
  dniLacznie: number;
  /** Czy jest przerwa między zwolnieniami (pytanie o dzień pracy ma sens). */
  przerwa: boolean;
  /** Wcześniejsza niezdolność w łańcuchu dłuższa niż 30 dni (ostatnia taka), gdy jest. */
  wczesniejsza: { od: string; do: string; dni: number } | null;
}

function przerwaBezPracy(poKoncu: string, przedPoczatkiem: string): boolean {
  const lata = new Set([poKoncu.slice(0, 4), przedPoczatkiem.slice(0, 4)]);
  const wolne = new Set([...lata].flatMap((r) => swieta(Number(r)).map((s) => s.data)));
  for (let d = poKoncu; d <= przedPoczatkiem; d = dodajDni(d, 1)) if (czyRoboczy(d, wolne)) return false;
  return true;
}

export function badanieKontrolne(lista: Zwolnienie[], powod: PowodNiezdolnosci, dzienPracy: DzienPracyWPrzerwie = 'auto'): Kontrolne {
  if (!lista.length) throw new RangeError('Brak zwolnień');
  lista.forEach((z, i) => {
    sprawdzDate(z.od, `początek zwolnienia ${i + 1}`);
    sprawdzDate(z.do, `koniec zwolnienia ${i + 1}`);
  });
  const bloki = scal(lista);
  const ost = bloki[bloki.length - 1];
  const dniOstatniej = dni(ost);
  let poczatek = bloki.length - 1;
  if (dniOstatniej <= PROG_KONTROLNE) {
    for (let i = bloki.length - 2; i >= 0; i--) {
      if (dzienPracy === 'tak') break;
      if (dzienPracy === 'auto' && !przerwaBezPracy(dodajDni(bloki[i].do, 1), dodajDni(bloki[i + 1].od, -1))) break;
      poczatek = i;
    }
  }
  const lancuch = bloki.slice(poczatek);
  // Art. 229 § 2: wcześniejsza niezdolność ponad 30 dni, po której nie było dnia pracy (interpretacja 2).
  const dluga = lancuch.slice(0, -1).filter((z) => dni(z) > PROG_KONTROLNE).pop();
  const wczesniejsza = dluga ? { od: dluga.od, do: dluga.do, dni: dni(dluga) } : null;
  const dniZwolnien = lancuch.reduce((s, z) => s + dni(z), 0);
  const dniLacznie = dniMiedzy(lancuch[0].od, ost.do) + 1;
  let wynik: WynikKontrolnego;
  if (powod === 'opieka') wynik = 'nie-dotyczy';
  else if (dniOstatniej > PROG_KONTROLNE || wczesniejsza) wynik = 'potrzebne';
  else if (lancuch.length > 1 && dniLacznie > PROG_KONTROLNE) wynik = 'nierozstrzygniete';
  else wynik = 'niewymagane';
  return {
    wynik,
    od: ost.od,
    do: ost.do,
    dniOstatniej,
    powrot: dodajDni(ost.do, 1),
    zwolnienWLancuchu: lancuch.length,
    odLancucha: lancuch[0].od,
    dniZwolnien,
    dniLacznie,
    przerwa: bloki.length > 1,
    wczesniejsza,
  };
}

export type StatusWyniku = 'po-terminie' | 'pilne' | 'wkrotce' | 'w-terminie';
export interface TekstWyniku {
  wynik: string;
  status: { tekst: string; rodzaj: StatusWyniku } | null;
  opis: string;
}

const dniTekst = (n: number) => odmiana(n, ['dzień', 'dni', 'dni']);

export function tekstKontrolnego(k: Kontrolne, powod: PowodNiezdolnosci): TekstWyniku {
  const okres = `od ${dataPoPolsku(k.od)} do ${dataPoPolsku(k.do)}`;
  const adnotacja =
    powod === 'wypadek' || powod === 'ciaza'
      ? ` Przepis mówi o niezdolności spowodowanej chorobą; ${powod === 'ciaza' ? 'zwolnienie w ciąży' : 'zwolnienie po wypadku'} liczymy tak samo.`
      : '';
  switch (k.wynik) {
    case 'nie-dotyczy':
      return {
        wynik: 'nie dotyczy',
        status: null,
        opis: 'Badanie kontrolne dotyczy Twojej niezdolności do pracy z powodu choroby. Opieka nad dzieckiem albo członkiem rodziny się do niej nie wlicza (art. 229 § 2 Kodeksu pracy).',
      };
    case 'potrzebne':
      return {
        wynik: 'potrzebne',
        status: { tekst: 'Przed powrotem do pracy', rodzaj: 'pilne' },
        opis: k.wczesniejsza
          ? `Wcześniejsza niezdolność do pracy trwała ${dniTekst(k.wczesniejsza.dni)} (od ${dataPoPolsku(k.wczesniejsza.od)} do ${dataPoPolsku(k.wczesniejsza.do)}), czyli dłużej niż ${PROG_KONTROLNE} dni, a do ostatniego zwolnienia (${okres}) nie było dnia pracy. Po takiej niezdolności badanie kontrolne jest potrzebne przed powrotem (art. 229 § 2 Kodeksu pracy).${adnotacja}`
          : `Niezdolność do pracy trwała ${dniTekst(k.dniOstatniej)} (${okres}), czyli dłużej niż ${PROG_KONTROLNE} dni (art. 229 § 2 Kodeksu pracy).${adnotacja}`,
      };
    case 'nierozstrzygniete':
      return {
        wynik: 'przepis tego nie rozstrzyga',
        status: { tekst: 'Bezpieczniej zrobić badanie', rodzaj: 'wkrotce' },
        opis: `Osobno ostatnie zwolnienie to ${dniTekst(k.dniOstatniej)}, a razem z wcześniejszymi i przerwą bez dnia pracy ${dniTekst(k.dniLacznie)} (od ${dataPoPolsku(k.odLancucha)}; same zwolnienia: ${dniTekst(k.dniZwolnien)}). Przepis nie mówi, czy to jedna niezdolność. Badanie jest na koszt pracodawcy i w miarę możliwości w godzinach pracy (art. 229 § 3 i 6 Kodeksu pracy).${adnotacja}`,
      };
    default:
      return {
        wynik: 'nie jest wymagane',
        status: { tekst: 'Wracasz bez badania kontrolnego', rodzaj: 'w-terminie' },
        opis: `Niezdolność do pracy trwała ${dniTekst(k.dniOstatniej)} (${okres}), a badanie kontrolne jest wymagane przy niezdolności dłuższej niż ${PROG_KONTROLNE} dni (art. 229 § 2 Kodeksu pracy).${adnotacja}`,
      };
  }
}

// ---------- B. Badania wstępne ----------

export type RodzajPrzyjecia = 'nowy' | 'ten-sam' | 'drugi-etat' | 'zmiana-stanowiska';
export type TakNie = 'tak' | 'nie' | 'nie-wiem';
export type StanOrzeczenia = 'data' | 'bez-daty' | 'brak';

export interface DaneWstepnych {
  rodzaj: RodzajPrzyjecia;
  /** Ostatni dzień poprzedniej umowy (przy 'nowy' i 'ten-sam'). */
  koniec?: string | null;
  /** Pierwszy dzień nowej pracy z umowy (poza 'zmiana-stanowiska'). */
  start?: string | null;
  orzeczenie: StanOrzeczenia;
  /** Data następnego badania okresowego z orzeczenia, gdy orzeczenie = 'data'. */
  nastepne?: string | null;
  /** Warunki pracy jak w skierowaniu; przy zmianie stanowiska: czynniki szkodliwe lub uciążliwe na nowym. */
  warunki: TakNie;
  szczegolnieNiebezpieczne: TakNie;
  mlodociany: boolean;
}

/** 'badanie-przed-praca': orzeczenie straciło aktualność; 'brak-orzeczenia': jak wyżej, ale orzeczenia nie ma. */
export type WynikWstepnych = 'potrzebne' | 'warunkowe' | 'zwolnienie' | 'niewymagane' | 'badanie-przed-praca' | 'brak-orzeczenia';
export type StanWarunku = 'tak' | 'nie' | 'sprawdz';
export interface Warunek {
  nazwa: string;
  stan: StanWarunku;
  opis: string;
}
export interface Wstepne {
  wynik: WynikWstepnych;
  /** Ostatni dzień, w którym rozpoczęcie pracy zwalnia z badań wstępnych (koniec + 30). */
  ostatniDzien: string | null;
  warunki: Warunek[];
}

export function badaniaWstepne(d: DaneWstepnych): Wstepne {
  const warunki: Warunek[] = [];
  const zmiana = d.rodzaj === 'zmiana-stanowiska';
  if (!zmiana) {
    if (!d.start) throw new RangeError('Brak pierwszego dnia pracy');
    sprawdzDate(d.start, 'pierwszy dzień pracy');
  }
  if (!zmiana && d.orzeczenie === 'data') {
    if (!d.nastepne) throw new RangeError('Brak daty następnego badania');
    sprawdzDate(d.nastepne, 'następne badanie');
  }
  let ostatniDzien: string | null = null;
  // Przy nowym pracodawcy brak końca poprzedniej umowy to pierwsza praca albo wcześniej bez umowy o pracę.
  if (d.rodzaj === 'ten-sam' && !d.koniec) throw new RangeError('Brak końca poprzedniej umowy');
  if ((d.rodzaj === 'nowy' || d.rodzaj === 'ten-sam') && d.koniec) {
    sprawdzDate(d.koniec, 'koniec poprzedniej umowy');
    if (d.start! <= d.koniec) throw new RangeError('Pierwszy dzień nowej pracy musi być po końcu poprzedniej umowy');
    ostatniDzien = dodajDni(d.koniec, DNI_NA_PRZYJECIE);
  }

  if (d.mlodociany) {
    warunki.push({
      nazwa: 'Osoba pełnoletnia',
      stan: 'nie',
      opis: zmiana
        ? 'przeniesienie młodocianego na inne stanowisko wymaga badań wstępnych (art. 229 § 1 pkt 2 Kodeksu pracy)'
        : 'młodociany przechodzi badania wstępne przed przyjęciem do pracy (art. 201 § 1 Kodeksu pracy)',
    });
    return { wynik: 'potrzebne', ostatniDzien, warunki };
  }

  if (zmiana) {
    const stan: StanWarunku = d.warunki === 'nie' ? 'tak' : d.warunki === 'tak' ? 'nie' : 'sprawdz';
    warunki.push({
      nazwa: 'Bez czynników szkodliwych i uciążliwych',
      stan,
      opis:
        d.warunki === 'nie'
          ? 'przepis nie wymaga badań wstępnych; sprawdź, czy orzeczenie obejmuje nowe stanowisko (art. 229 § 1 pkt 2 i § 4)'
          : d.warunki === 'tak'
            ? 'przeniesienie na takie stanowisko wymaga badań wstępnych (art. 229 § 1 pkt 2)'
            : 'zapytaj pracodawcę: skierowanie opisuje warunki pracy (§ 4 ust. 2 rozporządzenia)',
    });
    return { wynik: d.warunki === 'nie' ? 'niewymagane' : 'potrzebne', ostatniDzien, warunki };
  }

  if (d.rodzaj === 'nowy' && !d.koniec) {
    warunki.push({
      nazwa: `Poprzednia umowa o pracę w ciągu ${DNI_NA_PRZYJECIE} dni`,
      stan: 'nie',
      opis: `bez poprzedniego stosunku pracy zakończonego w ciągu ${DNI_NA_PRZYJECIE} dni przed startem zwolnienia z badań wstępnych nie ma (art. 229 § 1 pkt 1 i § 1¹ pkt 2 Kodeksu pracy)`,
    });
    return { wynik: 'potrzebne', ostatniDzien, warunki };
  }
  const w30 = ostatniDzien === null || d.start! <= ostatniDzien;
  if (ostatniDzien !== null) {
    warunki.push({
      nazwa: `Start w ciągu ${DNI_NA_PRZYJECIE} dni`,
      stan: w30 ? 'tak' : 'nie',
      opis: `ostatni dzień: ${dataPoPolsku(ostatniDzien)} (art. 229 § 1¹ Kodeksu pracy)`,
    });
  } else {
    warunki.push({ nazwa: 'Poprzednia umowa trwa', stan: 'tak', opis: 'warunek 30 dni nie ma zastosowania (art. 229 § 1² Kodeksu pracy)' });
  }
  const aktualne: StanWarunku = d.orzeczenie === 'brak' ? 'nie' : d.orzeczenie === 'bez-daty' ? 'sprawdz' : d.start! < d.nastepne! ? 'tak' : 'nie';
  const opisOrzeczenia =
    d.orzeczenie === 'brak'
      ? d.rodzaj === 'ten-sam'
        ? 'brak orzeczenia: przed pracą potrzebne badanie'
        : 'bez orzeczenia potrzebne są badania'
      : d.orzeczenie === 'bez-daty'
        ? 'orzeczenie bez daty następnego badania: aktualność sprawdź z pracodawcą'
        : aktualne === 'tak'
          ? `następne badanie ${dataPoPolsku(d.nastepne!)}, po pierwszym dniu pracy`
          : `termin następnego badania (${dataPoPolsku(d.nastepne!)}) przypada najpóźniej w pierwszym dniu pracy`;
  const stanWarunkow: StanWarunku = d.warunki === 'tak' ? 'tak' : d.warunki === 'nie' ? 'nie' : 'sprawdz';

  if (d.rodzaj === 'ten-sam') {
    warunki.push({
      nazwa: 'To samo stanowisko albo takie same warunki',
      stan: stanWarunkow,
      opis: stanWarunkow === 'sprawdz' ? 'zapytaj pracodawcę, czy warunki pracy są takie same' : 'art. 229 § 1¹ pkt 1',
    });
    warunki.push({ nazwa: 'Aktualne orzeczenie', stan: aktualne, opis: `${opisOrzeczenia}; bez aktualnego orzeczenia pracodawca nie dopuści do pracy (art. 229 § 4)` });
    if (!w30 || stanWarunkow === 'nie') return { wynik: 'potrzebne', ostatniDzien, warunki };
    if (aktualne === 'nie') return { wynik: d.orzeczenie === 'brak' ? 'brak-orzeczenia' : 'badanie-przed-praca', ostatniDzien, warunki };
    return { wynik: stanWarunkow === 'tak' && aktualne === 'tak' ? 'zwolnienie' : 'warunkowe', ostatniDzien, warunki };
  }

  // Inny pracodawca albo drugi etat (art. 229 § 1¹ pkt 2 i § 1²).
  warunki.push({ nazwa: 'Aktualne orzeczenie', stan: aktualne, opis: opisOrzeczenia });
  warunki.push({
    nazwa: 'Warunki pracy jak w skierowaniu',
    stan: stanWarunkow,
    opis: 'o tym, czy warunki odpowiadają stanowisku, decyduje pracodawca (art. 229 § 1¹ pkt 2)',
  });
  const prace: StanWarunku = d.szczegolnieNiebezpieczne === 'nie' ? 'tak' : 'nie';
  warunki.push({
    nazwa: 'Bez prac szczególnie niebezpiecznych',
    stan: prace,
    opis:
      d.szczegolnieNiebezpieczne === 'nie-wiem'
        ? 'zapytaj o wykaz takich prac, który prowadzi pracodawca (§ 80 rozporządzenia o ogólnych przepisach BHP); do tego czasu licz się z badaniami'
        : d.szczegolnieNiebezpieczne === 'nie'
          ? 'to nie są prace szczególnie niebezpieczne, przy których zwolnienia z badań nie ma (art. 229 § 1¹ pkt 2)'
          : 'przy takich pracach zwolnienia z badań nie ma (art. 229 § 1¹ pkt 2)',
  });
  if (!w30 || aktualne === 'nie' || stanWarunkow === 'nie' || prace === 'nie') return { wynik: 'potrzebne', ostatniDzien, warunki };
  return { wynik: 'warunkowe', ostatniDzien, warunki };
}

export function tekstWstepnych(w: Wstepne, rodzaj: RodzajPrzyjecia): TekstWyniku {
  const dokumenty = 'Pracodawca żąda wtedy aktualnego orzeczenia i skierowania, na podstawie którego je wydano (art. 229 § 1³ Kodeksu pracy).';
  switch (w.wynik) {
    case 'potrzebne':
      return {
        wynik: 'potrzebne',
        status: { tekst: 'Przed rozpoczęciem pracy', rodzaj: 'pilne' },
        opis: 'Badania robisz na skierowanie od pracodawcy i na jego koszt (art. 229 § 4a i 6 Kodeksu pracy). Bez aktualnego orzeczenia pracodawca nie dopuści do pracy (art. 229 § 4).',
      };
    case 'niewymagane':
      return {
        wynik: 'nie są wymagane',
        status: { tekst: 'Sprawdź orzeczenie', rodzaj: 'wkrotce' },
        opis: 'Przy przeniesieniu dorosłego pracownika badania wstępne są wymagane, gdy na nowym stanowisku występują czynniki szkodliwe dla zdrowia lub warunki uciążliwe (art. 229 § 1 pkt 2 Kodeksu pracy). Orzeczenie musi jednak dotyczyć stanowiska, na którym pracujesz (art. 229 § 4).',
      };
    case 'zwolnienie':
      return {
        wynik: 'nie są potrzebne',
        status: { tekst: 'Ten sam pracodawca w 30 dni', rodzaj: 'w-terminie' },
        opis: 'Przy ponownym przyjęciu u tego samego pracodawcy na to samo stanowisko albo o takich samych warunkach w ciągu 30 dni badań wstępnych się nie robi (art. 229 § 1¹ pkt 1 Kodeksu pracy).',
      };
    case 'badanie-przed-praca':
    case 'brak-orzeczenia':
      return {
        wynik: 'bez wstępnych, ale z badaniem',
        status: { tekst: w.wynik === 'brak-orzeczenia' ? 'Nie masz orzeczenia' : 'Orzeczenie straciło aktualność', rodzaj: 'pilne' },
        opis: 'Badań wstępnych przepis nie wymaga (art. 229 § 1¹ pkt 1 Kodeksu pracy), ale bez aktualnego orzeczenia pracodawca nie dopuści do pracy (art. 229 § 4). Potrzebne jest badanie, zanim zaczniesz pracę, na skierowanie od pracodawcy.',
      };
    default:
      return {
        wynik: 'mogą nie być potrzebne',
        status: { tekst: 'Jeśli pracodawca to potwierdzi', rodzaj: 'wkrotce' },
        opis:
          rodzaj === 'ten-sam'
            ? 'Zwolnienie z badań wstępnych zależy od tego, czy warunki pracy są takie same, a orzeczenie aktualne (art. 229 § 1¹ pkt 1 i § 4 Kodeksu pracy).'
            : `Badań wstępnych nie robisz tylko wtedy, gdy pracodawca stwierdzi, że warunki pracy opisane w skierowaniu odpowiadają nowemu stanowisku. ${dokumenty}`,
      };
  }
}

// ---------- C. Orzeczenie: odwołanie i następne badanie ----------

export interface Odwolanie {
  ostatniDzien: string;
  /** Dzień wolny, na który wypada termin (bez przesunięcia). */
  wolny: { rodzaj: 'sobota' | 'niedziela' | 'swieto'; nazwa: string } | null;
  /** Dni od dziś do końca terminu (ujemne: termin minął). */
  dniDo: number;
}

export function odwolanie(otrzymane: string, dzis: string): Odwolanie {
  sprawdzDate(otrzymane, 'otrzymanie orzeczenia');
  sprawdzDate(dzis, 'dziś');
  const ostatniDzien = dodajDni(otrzymane, DNI_NA_ODWOLANIE);
  const swieto = swieta(Number(ostatniDzien.slice(0, 4))).find((s) => s.data === ostatniDzien);
  const dt = dzienTygodnia(ostatniDzien);
  const wolny = swieto
    ? { rodzaj: 'swieto' as const, nazwa: swieto.nazwa }
    : dt === 6
      ? { rodzaj: 'sobota' as const, nazwa: 'sobota' }
      : dt === 0
        ? { rodzaj: 'niedziela' as const, nazwa: 'niedziela' }
        : null;
  return { ostatniDzien, wolny, dniDo: dniMiedzy(dzis, ostatniDzien) };
}

export function tekstOdwolania(o: Odwolanie): TekstWyniku {
  const status: TekstWyniku['status'] =
    o.dniDo < 0
      ? { tekst: `Termin minął ${ileDni(o.dniDo)}`, rodzaj: 'po-terminie' }
      : { tekst: o.dniDo === 0 ? 'Ostatni dzień: dziś' : `Zostało: ${dniTekst(o.dniDo)}`, rodzaj: o.dniDo <= 2 ? 'pilne' : 'w-terminie' };
  const opis = o.wolny
    ? `To ${o.wolny.rodzaj === 'swieto' ? `święto (${o.wolny.nazwa})` : o.wolny.nazwa}. Rozporządzenie nie przesuwa terminu, a czy przesuwa go art. 115 Kodeksu cywilnego, przepisy nie rozstrzygają: bezpieczniej złożyć odwołanie wcześniej.`
    : `${DNI_NA_ODWOLANIE} dni liczymy od dnia po otrzymaniu orzeczenia (§ 5 ust. 3 rozporządzenia o badaniach lekarskich pracowników, art. 111 § 2 Kodeksu cywilnego).`;
  return { wynik: dataPoPolsku(o.ostatniDzien), status, opis };
}

export interface Przypomnienie {
  dniDo: number;
  wydarzenia: Wydarzenie[];
}

export function przypomnienie(nastepne: string, dzis: string): Przypomnienie {
  sprawdzDate(nastepne, 'następne badanie');
  sprawdzDate(dzis, 'dziś');
  const dniDo = dniMiedzy(dzis, nastepne);
  const opis = 'Data następnego badania okresowego z orzeczenia lekarskiego. Przepis nie mówi, czy orzeczenie jest jeszcze aktualne w tym dniu: bezpieczniej zrobić badanie wcześniej. Badanie na skierowanie od pracodawcy, w miarę możliwości w godzinach pracy, z zachowaniem wynagrodzenia (art. 229 § 3 i 4a Kodeksu pracy).';
  const wczesniej = dodajDni(nastepne, -PRZYPOMNIENIE_DNI);
  const wydarzenia: Wydarzenie[] = [
    ...(wczesniej >= dzis ? [{ data: wczesniej, tytul: `Za ${PRZYPOMNIENIE_DNI} dni badanie okresowe: poproś o skierowanie`, opis, przypomnienia: [0] }] : []),
    ...(nastepne >= dzis ? [{ data: nastepne, tytul: 'Data następnego badania z orzeczenia: badanie zrób przed tym dniem', opis }] : []),
  ];
  return { dniDo, wydarzenia };
}
