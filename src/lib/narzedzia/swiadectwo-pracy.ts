// Świadectwo pracy: terminy wydania i sprostowania, pozew o wydanie, górna granica odszkodowania.
// Przepisy (teksty z API Sejmu, sprawdzone 2026-11-14; po tekstach jednolitych brak zmian tych przepisów):
// - Kodeks pracy, t.j. Dz.U. 2026 poz. 1245: art. 97 § 1 (wydanie w dniu ustania stosunku pracy, a gdy z przyczyn
//   obiektywnych to niemożliwe, wysyłka „w ciągu 7 dni od dnia upływu tego terminu”), § 1¹–1² (kolejna umowa u tego
//   samego pracodawcy w 7 dni: świadectwo tylko na wniosek, w 7 dni od złożenia), § 1³ (bez uzależniania od rozliczenia),
//   § 2 (treść), § 2¹ (wniosek o sprostowanie 14 dni od otrzymania, pozew 14 dni od zawiadomienia o odmowie, przy
//   niezawiadomieniu pozew bez terminu w przepisie); art. 97¹ (pozew o wydanie, ustalenie uprawnienia, „w każdym czasie
//   przed upływem terminu przedawnienia”, § 4 odpowiednio do sprostowania); art. 99 § 1–2 (odszkodowanie: wynagrodzenie
//   za czas pozostawania bez pracy z tego powodu, nie dłuższy niż 6 tygodni); art. 265 (przywrócenie terminu);
//   art. 282 § 1 pkt 3 (wykroczenie: niewydanie w terminie); art. 291 § 1 (przedawnienie 3 lata); art. 300;
// - rozporządzenie w sprawie świadectwa pracy, t.j. Dz.U. 2024 poz. 1016: § 2 (treść), § 7 ust. 1 (zawiadomienie o odmowie
//   sprostowania albo nowe świadectwo w 7 dni od otrzymania wniosku);
// - rozporządzenie z 29 maja 1996 r., t.j. Dz.U. 2017 poz. 927: § 2 ust. 1 pkt 9 (odszkodowanie z art. 99 § 2 według zasad
//   ekwiwalentu za urlop), § 2 ust. 2 (2 tygodnie = połowa miesięcznej kwoty, ale tylko dla pkt 3–5);
// - Kodeks cywilny, t.j. Dz.U. 2026 poz. 795: art. 111 § 2 (dnia zdarzenia nie wlicza się), art. 112, art. 115.
//
// Interpretacje (opisane w „Jak liczymy”):
// - terminy w dniach liczymy od dnia po zdarzeniu (art. 111 § 2 KC przez art. 300 Kp);
// - przesunięcie końca terminu z soboty i dnia wolnego (art. 115 KC) przy terminach z Kodeksu pracy jest sporne, więc
//   terminy, które musi zachować pracownik, podajemy bez przesunięcia (wariant najwcześniejszy), a datę po przesunięciu
//   tylko jako dopisek; terminy pracodawcy też bez przesunięcia (pracownik liczy od nich swój ostrożny termin);
// - pozew o sprostowanie, gdy pracodawca nie zawiadomił o odmowie: przepis nie podaje terminu (art. 97 § 2¹ zd. 3,
//   art. 97¹ § 3–4); wariant ostrożny: 14 dni od upływu 7 dni pracodawcy na odpowiedź (jak po odmowie);
// - pozew o wydanie: „w każdym czasie przed upływem terminu przedawnienia”; przedawnienie 3 lata od wymagalności
//   (art. 291 § 1), a wymagalność liczymy od dnia ustania stosunku pracy (najwcześniejszy dzień, art. 97 § 1 zd. 1);
// - odszkodowanie z art. 99 § 2: rozporządzenie nie przelicza 6 tygodni na kwotę; przyjmujemy 1,5 miesięcznej kwoty
//   (jak § 2 ust. 2: 2 tygodnie = połowa), a drugie odczytanie (30 dni pracy × dniówka z § 2a) opisujemy na stronie.
//   To górna granica: należy się wynagrodzenie za faktyczny czas bez pracy z powodu świadectwa.
import { zl } from './format';
import { odmiana } from '../redakcja';
import { przesunZDniaWolnego } from './termin-odwolania';
import { zaIle } from './choroba-zawodowa';
import { dataPoPolsku, dniMiedzy, dodajDni, dodajLata, poprawnaData } from './terminy';

export const DNI_SPROSTOWANIE = 14;
export const DNI_POZEW = 14;
export const DNI_ODPOWIEDZ = 7;
export const DNI_WYSYLKA = 7;
/** 6 tygodni z art. 99 § 2 jako wielokrotność miesięcznej kwoty (interpretacja, § 2 ust. 2 rozporządzenia z 1996 r.). */
export const MNOZNIK_6_TYGODNI = 1.5;
export const NAJWCZESNIEJ = '2000-01-01';

export interface DaneSwiadectwa {
  /** Dzień ustania stosunku pracy (ostatni dzień umowy). */
  ustanie: string;
  /** Czy u tego samego pracodawcy zaczyna się kolejna umowa w ciągu 7 dni (art. 97 § 1¹). */
  kolejnaUmowa?: boolean;
  /** Dzień otrzymania świadectwa (opcjonalnie). */
  otrzymanie?: string;
  /** Dzień, w którym pracodawca otrzymał wniosek o sprostowanie (opcjonalnie). */
  wniosek?: string;
  /** Dzień zawiadomienia o odmowie sprostowania (opcjonalnie). */
  odmowa?: string;
  /** Wynagrodzenie miesięczne liczone jak do ekwiwalentu za urlop (zł brutto, opcjonalnie). */
  wynagrodzenie?: number;
}

const puste = (x?: string) => x === undefined || x === '';

/** Sprawdza dane; zwraca nazwę pola i komunikat albo null. */
export function bladSwiadectwa(d: DaneSwiadectwa, dzis: string): { pole: keyof DaneSwiadectwa; tekst: string } | null {
  if (!poprawnaData(d.ustanie)) return { pole: 'ustanie', tekst: 'Wpisz dzień ustania stosunku pracy, czyli ostatni dzień umowy.' };
  if (d.ustanie < NAJWCZESNIEJ) return { pole: 'ustanie', tekst: 'Dzień ustania stosunku pracy: najwcześniej 1 stycznia 2000 r.' };
  for (const [pole, nazwa] of [['otrzymanie', 'otrzymania świadectwa'], ['wniosek', 'doręczenia wniosku'], ['odmowa', 'zawiadomienia o odmowie']] as const) {
    if (!puste(d[pole]) && !poprawnaData(d[pole]!)) return { pole, tekst: `Wpisz pełną datę ${nazwa} albo zostaw pole puste.` };
  }
  for (const [pole, nazwa] of [['otrzymanie', 'otrzymania świadectwa'], ['wniosek', 'doręczenia wniosku'], ['odmowa', 'zawiadomienia o odmowie']] as const) {
    if (!puste(d[pole]) && d[pole]! > dzis) return { pole, tekst: `Dzień ${nazwa} nie może być późniejszy niż dziś.` };
  }
  if (!puste(d.otrzymanie) && d.otrzymanie! < d.ustanie) return { pole: 'otrzymanie', tekst: 'Świadectwo wydaje się w dniu ustania stosunku pracy albo później, więc data otrzymania nie może być wcześniejsza.' };
  if (!puste(d.wniosek) && !puste(d.otrzymanie) && d.wniosek! < d.otrzymanie!) return { pole: 'wniosek', tekst: 'Wniosek o sprostowanie składa się po otrzymaniu świadectwa.' };
  if (!puste(d.wniosek) && d.wniosek! < d.ustanie) return { pole: 'wniosek', tekst: 'Wniosek o sprostowanie nie może być wcześniejszy niż ustanie stosunku pracy.' };
  if (!puste(d.odmowa) && !puste(d.wniosek) && d.odmowa! < d.wniosek!) return { pole: 'odmowa', tekst: 'Odmowa sprostowania nie może być wcześniejsza niż wniosek.' };
  if (!puste(d.odmowa) && !puste(d.otrzymanie) && d.odmowa! < d.otrzymanie!) return { pole: 'odmowa', tekst: 'Odmowa sprostowania nie może być wcześniejsza niż otrzymanie świadectwa.' };
  if (!puste(d.odmowa) && d.odmowa! < d.ustanie) return { pole: 'odmowa', tekst: 'Odmowa sprostowania nie może być wcześniejsza niż ustanie stosunku pracy.' };
  if (d.wynagrodzenie !== undefined && !(Math.round(d.wynagrodzenie * 100) > 0 && d.wynagrodzenie < 10_000_000))
    return { pole: 'wynagrodzenie', tekst: 'Wpisz wynagrodzenie miesięczne brutto, na przykład 5200, albo zostaw pole puste.' };
  return null;
}

/** Termin w dniach od zdarzenia (art. 111 § 2 KC) bez przesunięcia i, gdy wypada w sobotę albo dzień wolny, po przesunięciu (art. 115 KC). */
export function terminDni(zdarzenie: string, dni: number) {
  const koniec = dodajDni(zdarzenie, dni);
  const p = przesunZDniaWolnego(koniec);
  return { koniec, poPrzesunieciu: p.koniec === koniec ? null : p.koniec, powod: p.przesuniecie[0]?.powod ?? null };
}

/** Górna granica odszkodowania z art. 99 § 2 (zł, w groszach zaokrąglona połówką w górę). */
export const granicaOdszkodowania = (wynagrodzenie: number) => Math.round(Math.round(wynagrodzenie * 100) * MNOZNIK_6_TYGODNI) / 100;

export function terminySwiadectwa(d: DaneSwiadectwa, dzis = '2100-12-31') {
  const blad = bladSwiadectwa(d, dzis);
  if (blad) throw new RangeError(blad.tekst);
  return {
    wydanie: d.kolejnaUmowa ? null : d.ustanie,
    wysylka: d.kolejnaUmowa ? null : dodajDni(d.ustanie, DNI_WYSYLKA),
    sprostowanie: puste(d.otrzymanie) ? null : terminDni(d.otrzymanie!, DNI_SPROSTOWANIE),
    odpowiedz: puste(d.wniosek) ? null : terminDni(d.wniosek!, DNI_ODPOWIEDZ),
    pozew: puste(d.odmowa) ? null : terminDni(d.odmowa!, DNI_POZEW),
    /** Wariant ostrożny przy braku zawiadomienia: 14 dni od końca 7 dni pracodawcy. */
    pozewBezOdpowiedzi: puste(d.wniosek) || !puste(d.odmowa) ? null : terminDni(dodajDni(d.wniosek!, DNI_ODPOWIEDZ), DNI_POZEW),
    przedawnienie: dodajLata(d.ustanie, 3),
    odszkodowanie: d.wynagrodzenie === undefined ? null : granicaOdszkodowania(d.wynagrodzenie),
  };
}

export type KlasaStatusu = 'po-terminie' | 'pilne' | 'wkrotce' | 'w-terminie';

export interface PozycjaWyniku {
  klucz: string;
  etykieta: string;
  /** Krótko: data albo kwota i stan terminu (pogrubione). */
  wartosc: string;
  /** Objaśnienie z przepisem (zwykłą czcionką). */
  opis: string;
}

export interface OpisSwiadectwa {
  /** Najbliższy termin pracownika (data albo opis) i jego status. */
  glowny: string;
  glownyOpis: string;
  status: string;
  statusKlasa: KlasaStatusu;
  pozycje: PozycjaWyniku[];
  uwagi: string[];
}

const dni = (n: number) => odmiana(n, ['dzień', 'dni', 'dni']);

/** „został 1 dzień”, „zostały 2 dni”, „zostało 5 dni”, „dziś ostatni dzień”, „termin minął 3 dni temu”. */
export function stanTerminu(koniec: string, dzis: string): { tekst: string; klasa: KlasaStatusu } {
  const r = dniMiedzy(dzis, koniec);
  if (r < 0) return { tekst: `termin minął ${dni(-r)} temu`, klasa: 'po-terminie' };
  if (r === 0) return { tekst: 'dziś ostatni dzień', klasa: 'pilne' };
  return { tekst: zaIle(r), klasa: r <= 3 ? 'pilne' : r <= 7 ? 'wkrotce' : 'w-terminie' };
}

const NAZWA_WOLNEGO = (powod: string | null) => (powod === 'sobota' ? 'sobota' : powod === 'niedziela' ? 'niedziela' : 'dzień wolny od pracy');

const dopiskPrzesuniecia = (t: { koniec: string; poPrzesunieciu: string | null; powod: string | null }) =>
  t.poPrzesunieciu
    ? ` Ten dzień to ${NAZWA_WOLNEGO(t.powod)}; czy termin przesuwa się na ${dataPoPolsku(t.poPrzesunieciu)} (art. 115 Kodeksu cywilnego), przepisy nie przesądzają, więc bezpieczniej zdążyć do ${dataPoPolsku(t.koniec)}`
    : '';

const PRZYWROCENIE = 'Gdy termin minął bez Twojej winy, sąd pracy może go przywrócić na wniosek złożony w 7 dni od ustania przyczyny spóźnienia (art. 265 Kodeksu pracy).';

const wielka = (t: string) => t.charAt(0).toUpperCase() + t.slice(1);

/** Teksty wyniku: te same w HTML ze strony i w skrypcie przeglądarki. Rzuca RangeError przy błędnych danych. */
export function opisSwiadectwa(d: DaneSwiadectwa, dzis: string): OpisSwiadectwa {
  const t = terminySwiadectwa(d, dzis);
  const pozycje: PozycjaWyniku[] = [];
  const uwagi: string[] = [];

  if (t.wydanie) {
    pozycje.push({
      klucz: 'wydanie',
      etykieta: 'Wydanie świadectwa',
      wartosc: dataPoPolsku(t.wydanie),
      opis: `W dniu ustania stosunku pracy (art. 97 § 1). Gdy z przyczyn obiektywnych nie da się go wtedy wydać, pracodawca wysyła je pocztą albo doręcza inaczej najpóźniej ${dataPoPolsku(t.wysylka!)}`,
    });
  } else {
    pozycje.push({
      klucz: 'wydanie',
      etykieta: 'Wydanie świadectwa',
      wartosc: 'Na Twój wniosek',
      opis: 'Przy nowej umowie u tego samego pracodawcy w ciągu 7 dni świadectwo dostajesz tylko na wniosek, papierowy albo elektroniczny, złożony w każdym czasie; pracodawca wydaje je w 7 dni od złożenia wniosku (art. 97 § 1¹–1²).',
    });
  }

  // Terminy pracownika: wniosek o sprostowanie, pozew po odmowie albo wariant ostrożny bez odpowiedzi.
  const terminyPracownika: { koniec: string; nazwa: string; przesuniety: boolean }[] = [];
  if (t.sprostowanie) {
    const s = stanTerminu(t.sprostowanie.koniec, dzis);
    pozycje.push({
      klucz: 'sprostowanie',
      etykieta: 'Wniosek o sprostowanie',
      wartosc: puste(d.wniosek) ? `do ${dataPoPolsku(t.sprostowanie.koniec)}: ${s.tekst}` : `do ${dataPoPolsku(t.sprostowanie.koniec)}`,
      opis: `14 dni od otrzymania świadectwa (art. 97 § 2¹); do tego dnia wniosek powinien dotrzeć do pracodawcy.${dopiskPrzesuniecia(t.sprostowanie)}`,
    });
    if (puste(d.wniosek) && puste(d.odmowa)) terminyPracownika.push({ koniec: t.sprostowanie.koniec, nazwa: 'Wniosek o sprostowanie', przesuniety: !!t.sprostowanie.poPrzesunieciu });
    if (!puste(d.wniosek) && d.wniosek! > t.sprostowanie.koniec) {
      const wPrzesunietym = !!t.sprostowanie.poPrzesunieciu && d.wniosek! <= t.sprostowanie.poPrzesunieciu;
      uwagi.push(
        wPrzesunietym
          ? `Wniosek dotarł po ${dataPoPolsku(t.sprostowanie.koniec)} Jest w terminie tylko wtedy, gdy termin przesuwa się z dnia wolnego na następny dzień roboczy (art. 115 Kodeksu cywilnego). ${PRZYWROCENIE}`
          : `Wniosek dotarł po terminie 14 dni z art. 97 § 2¹. ${PRZYWROCENIE}`,
      );
    }
  } else {
    pozycje.push({ klucz: 'sprostowanie', etykieta: 'Wniosek o sprostowanie', wartosc: '14 dni od otrzymania', opis: 'Termin z art. 97 § 2¹; wpisz datę otrzymania świadectwa, a policzymy dzień.' });
  }

  if (t.odpowiedz) {
    pozycje.push({
      klucz: 'odpowiedz',
      etykieta: 'Odpowiedź pracodawcy',
      wartosc: `do ${dataPoPolsku(t.odpowiedz.koniec)}`,
      opis: 'W 7 dni od otrzymania wniosku pracodawca zawiadamia o odmowie albo wydaje nowe świadectwo (§ 7 ust. 1 rozporządzenia w sprawie świadectwa pracy).',
    });
  } else {
    pozycje.push({ klucz: 'odpowiedz', etykieta: 'Odpowiedź pracodawcy', wartosc: '7 dni od otrzymania wniosku', opis: 'Zawiadomienie o odmowie albo nowe świadectwo (§ 7 ust. 1 rozporządzenia w sprawie świadectwa pracy).' });
  }

  if (t.pozew) {
    const s = stanTerminu(t.pozew.koniec, dzis);
    pozycje.push({
      klucz: 'pozew',
      etykieta: 'Pozew o sprostowanie',
      wartosc: `do ${dataPoPolsku(t.pozew.koniec)}: ${s.tekst}`,
      opis: `14 dni od zawiadomienia o odmowie, do sądu pracy (art. 97 § 2¹).${dopiskPrzesuniecia(t.pozew)}`,
    });
    terminyPracownika.push({ koniec: t.pozew.koniec, nazwa: 'Pozew o sprostowanie', przesuniety: !!t.pozew.poPrzesunieciu });
  } else if (t.pozewBezOdpowiedzi) {
    const s = stanTerminu(t.pozewBezOdpowiedzi.koniec, dzis);
    pozycje.push({
      klucz: 'pozew',
      etykieta: 'Pozew o sprostowanie',
      wartosc: `ostrożnie do ${dataPoPolsku(t.pozewBezOdpowiedzi.koniec)}: ${s.tekst}`,
      opis: 'Gdy pracodawca nie zawiadomi o odmowie, przepis nie podaje terminu: pozew wnosi się do sądu pracy (art. 97 § 2¹), w każdym czasie przed przedawnieniem (art. 97¹ § 3–4). Ostrożnie liczymy 14 dni od końca terminu pracodawcy, jak po odmowie.',
    });
    terminyPracownika.push({ koniec: t.pozewBezOdpowiedzi.koniec, nazwa: 'Pozew o sprostowanie (ostrożnie)', przesuniety: !!t.pozewBezOdpowiedzi.poPrzesunieciu });
  } else {
    pozycje.push({ klucz: 'pozew', etykieta: 'Pozew o sprostowanie', wartosc: '14 dni od odmowy', opis: 'Termin od zawiadomienia o odmowie sprostowania; gdy pracodawca nie zawiadomi, pozew wnosi się do sądu pracy bez terminu w przepisie (art. 97 § 2¹).' });
  }

  pozycje.push(
    d.kolejnaUmowa
      ? {
          klucz: 'wydanie-sad',
          etykieta: 'Gdy nie wyda świadectwa',
          wartosc: 'Pozew o wydanie',
          opis: 'Pozew o zobowiązanie pracodawcy do wydania świadectwa (art. 97¹ § 1), w każdym czasie przed przedawnieniem (art. 97¹ § 3). Przy wydaniu na wniosek 3 lata przedawnienia (art. 291 § 1) liczą się dopiero od końca 7 dni na wydanie po złożeniu wniosku (art. 97 § 1²).',
        }
      : {
          klucz: 'wydanie-sad',
          etykieta: 'Gdy nie wyda świadectwa',
          wartosc: `pozew do ${dataPoPolsku(t.przedawnienie)}`,
          opis: 'Pozew o zobowiązanie pracodawcy do wydania świadectwa, w każdym czasie przed przedawnieniem (art. 97¹ § 1 i 3): 3 lata (art. 291 § 1), liczone od ostatniego dnia umowy. Gdy pracodawca nie istnieje albo z innych przyczyn pozew przeciw niemu jest niemożliwy, pozew o ustalenie prawa do świadectwa (art. 97¹ § 2).',
        },
  );

  pozycje.push(
    t.odszkodowanie === null
      ? { klucz: 'odszkodowanie', etykieta: 'Odszkodowanie', wartosc: 'najwyżej za 6 tygodni', opis: 'Wynagrodzenie za czas bez pracy z powodu niewydania w terminie albo wydania niewłaściwego świadectwa (art. 99 § 1–2); wpisz pensję, a policzymy górną granicę.' }
      : {
          klucz: 'odszkodowanie',
          etykieta: 'Odszkodowanie',
          wartosc: `najwyżej ${zl(t.odszkodowanie)}`,
          opis: `Wynagrodzenie za czas bez pracy z tego powodu, nie dłuższy niż 6 tygodni (art. 99 § 2), liczone jak ekwiwalent za urlop (§ 2 ust. 1 pkt 9 rozporządzenia z 29 maja 1996 r.): 1,5 × ${zl(d.wynagrodzenie!)}.`,
        },
  );

  uwagi.push('Pracodawca nie może uzależniać wydania świadectwa od wcześniejszego rozliczenia się z nim, np. ze zwrotu odzieży roboczej (art. 97 § 1³). Za niewydanie świadectwa w terminie grozi grzywna od 2000 do 60 000 zł (art. 282 § 1 pkt 3).');
  uwagi.push('Odszkodowanie wymaga wykazania związku między pozostawaniem bez pracy a niewydaniem w terminie albo wydaniem niewłaściwego świadectwa. Inną szkodę niż utracone zarobki można dochodzić na zasadach ogólnych, z art. 471 Kodeksu cywilnego przez art. 300 Kodeksu pracy (wyrok Sądu Najwyższego z 13 października 2004 r., II PK 36/04).');
  if (!uwagi.some((u) => u.includes('art. 265'))) uwagi.push(PRZYWROCENIE);

  // Najbliższy termin pracownika, który jeszcze nie minął; gdy wszystkie minęły, ostatni.
  let glowny: string;
  let glownyOpis: string;
  let status: string;
  let statusKlasa: KlasaStatusu;
  if (terminyPracownika.length) {
    const przyszle = terminyPracownika.filter((x) => x.koniec >= dzis).sort((a, b) => (a.koniec < b.koniec ? -1 : 1));
    const wybrany = przyszle[0] ?? terminyPracownika[terminyPracownika.length - 1];
    const s = stanTerminu(wybrany.koniec, dzis);
    glowny = dataPoPolsku(wybrany.koniec);
    glownyOpis = `${wybrany.nazwa}: ostatni dzień${wybrany.przesuniety ? ', bez przesunięcia z dnia wolnego' : ''}`;
    status = wielka(s.tekst);
    statusKlasa = s.klasa;
  } else if (t.wydanie) {
    glowny = dataPoPolsku(t.wydanie);
    glownyOpis = 'Wydanie świadectwa: w dniu ustania stosunku pracy (art. 97 § 1)';
    const r = dniMiedzy(dzis, t.wydanie);
    if (r > 0) {
      status = `Do ustania stosunku pracy: ${dni(r)}`;
      statusKlasa = 'w-terminie';
    } else if (r === 0) {
      status = 'Świadectwo należy się dziś';
      statusKlasa = 'pilne';
    } else if (dzis <= t.wysylka!) {
      status = `Wysyłka z przyczyn obiektywnych: najpóźniej ${dataPoPolsku(t.wysylka!)}`;
      statusKlasa = 'wkrotce';
    } else {
      status = `Pracodawca miał wydać świadectwo ${dni(-r)} temu`;
      statusKlasa = 'po-terminie';
    }
  } else {
    glowny = 'Na wniosek';
    glownyOpis = 'Świadectwo w 7 dni od złożenia wniosku (art. 97 § 1²)';
    status = 'Wniosek możesz złożyć w każdym czasie';
    statusKlasa = 'w-terminie';
  }
  return { glowny, glownyOpis, status, statusKlasa, pozycje, uwagi };
}

/** Co musi być w świadectwie (art. 97 § 2 Kp, § 2 ust. 1–2 rozporządzenia): lista do sprawdzenia własnego świadectwa. */
export const TRESC_SWIADECTWA: string[] = [
  'okresy zatrudnienia i wymiar czasu pracy (etat)',
  'rodzaj pracy, stanowiska albo funkcje',
  'tryb i podstawa prawna rozwiązania umowy albo podstawa jej wygaśnięcia, a przy wypowiedzeniu: kto wypowiedział',
  'okres, za który należy się odszkodowanie za skrócone wypowiedzenie (art. 36¹ § 1)',
  'urlop wypoczynkowy przysługujący i wykorzystany w roku odejścia (wzór świadectwa wymienia osobno urlop na żądanie)',
  'wolne z powodu siły wyższej (art. 148¹) i urlop opiekuńczy (art. 173¹) w roku odejścia',
  'urlop bezpłatny, rodzicielski i wychowawczy z podstawą prawną oraz urlop ojcowski',
  'okres ochrony stosunku pracy z art. 186⁸ § 1 pkt 2',
  'zwolnienie na opiekę nad dzieckiem do 14 lat (art. 188) w roku odejścia',
  'dni pracy zdalnej okazjonalnej (art. 67³³) w roku odejścia',
  'liczba dni wynagrodzenia chorobowego (art. 92) w roku odejścia',
  'czynna służba wojskowa lub jej formy zastępcze, praca w szczególnych warunkach lub w szczególnym charakterze',
  'wykorzystany dodatkowy urlop albo inne uprawnienie lub świadczenie z przepisów prawa pracy',
  'okresy nieskładkowe w czasie zatrudnienia, uwzględniane przy ustalaniu prawa do emerytury lub renty',
  'zajęcie wynagrodzenia w postępowaniu egzekucyjnym',
  'należności uznane, a niewypłacone z braku pieniędzy',
  'na Twoje żądanie: wysokość i składniki wynagrodzenia oraz zdobyte kwalifikacje',
  'pouczenie o prawie do sprostowania (14 dni) i do pozwu w sądzie pracy',
];
