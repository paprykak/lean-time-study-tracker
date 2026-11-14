// Odpowiedzialność materialna pracownika: górna granica odszkodowania dla pracodawcy i przedawnienie jego roszczenia.
// Przepisy (teksty z API Sejmu, sprawdzone 2026-11-14; po tekstach jednolitych brak zmian tych przepisów):
// - Kodeks pracy, t.j. Dz.U. 2026 poz. 1245: art. 114–122 (szkoda z winy pracownika), art. 124–127 (mienie powierzone),
//   art. 91 i 87 (potrącenia), art. 291 § 2–3 i 295 (przedawnienie);
// - Kodeks cywilny, t.j. Dz.U. 2026 poz. 795: art. 112 (terminy w latach), 118 zd. 2 (koniec roku), 442¹ (czyn niedozwolony);
// - rozporządzenie z 29 maja 1996 r., t.j. Dz.U. 2017 poz. 927, § 3: wynagrodzenie do art. 119 jak ekwiwalent za urlop,
//   bez zmian wprowadzonych po dniu szkody (zasady ekwiwalentu: rozporządzenie urlopowe Dz.U. 1997 nr 2 poz. 14, § 14–19);
// - rozporządzenie RM z 10 października 1975 r., t.j. Dz.U. 1996 nr 143 poz. 662 (mienie powierzone w magazynach z halą
//   spedycyjną: zasady art. 114–116 i 118 Kp, § 2–3; obniżenie odszkodowania, § 6–9);
// - rozporządzenie RM z 4 października 1974 r., t.j. Dz.U. 1996 nr 143 poz. 663 (wspólna odpowiedzialność, § 6: części z umowy).
//
// Interpretacje (opisane w „Jak liczymy”):
// - wina nieumyślna: najwyżej szkoda pomniejszona o przyczynienie pracodawcy lub innej osoby (art. 117 § 1), nie więcej niż
//   3 × wynagrodzenie miesięczne z dnia szkody (art. 119); wpisane wynagrodzenie traktujemy jak kwotę brutto ustaloną według
//   § 3 rozporządzenia; podwyżka obowiązująca już w dniu szkody się liczy, późniejsza nie („bez uwzględnienia zmian… po dniu”);
// - wina umyślna: pełna wysokość (art. 122), przyczynienie się pracodawcy odliczamy (art. 117 § 1 w tym samym rozdziale);
// - mienie powierzone (art. 124 § 1–2) i wspólne (art. 125): pełna wysokość bez limitu z art. 119, bo art. 127 do niego nie
//   odsyła; wspólne: część z umowy (art. 125 § 2); odliczamy przyczynienie (art. 117 przez art. 127);
// - przedawnienie przy winie nieumyślnej i mieniu powierzonym: rok od dnia, w którym pracodawca dowiedział się o szkodzie,
//   najpóźniej 3 lata od szkody (art. 291 § 2); przy winie umyślnej przepisy KC (art. 291 § 3): 3 lata od dowiedzenia się,
//   najpóźniej 10 lat od zdarzenia (art. 442¹ § 1), 20 lat od przestępstwa (§ 2); końce lat według art. 112 KC jak
//   w przedawnienie.ts (29 lutego → 28 lutego). Roszczenie jest przeciw pracownikowi, więc bezpieczna jest data późniejsza:
//   status („minął”, kolor; „zostało” pokazuje obie daty) liczymy od dnia po przesunięciu z soboty i dnia wolnego (art. 115 KC), a przy winie
//   umyślnej od końca roku z art. 118 zd. 2 KC; oba przesunięcia nie są przesądzone, więc strona podaje obie daty;
// - mienie powierzone: § 6 ust. 1 rozporządzenia z 1975 r. każe obniżyć odszkodowanie przy utrudnionym nadzorze (art. 124
//   § 2 i 125); kwoty obniżenia przepis nie podaje, więc pokazujemy kwotę przed obniżeniem i piszemy o nim w uwagach;
// - zarzut i przerwanie przedawnienia: art. 292 i 295 Kp, przy winie umyślnej art. 117 § 2 i 123–124 KC (art. 291 § 3).
// Nie liczymy kwoty wolnej od potrąceń (art. 87¹ § 1 pkt 1 i art. 91 § 2): sprawa składki zdrowotnej jest otwarta (STAN.md).

import { liczba, zl } from './format';
import { odmiana } from '../redakcja';
import { swieta } from './czas-pracy';
import { dzienTygodnia } from './dni-wolne';
import { dataPoPolsku, dniMiedzy, dodajDni, dodajLata, poprawnaData } from './terminy';

export type Sytuacja = 'nieumyslna' | 'umyslna' | 'powierzone' | 'wspolne';

export const SYTUACJE: Record<Sytuacja, { krotko: string; opis: string; przepis: string }> = {
  nieumyslna: {
    krotko: 'Szkoda nieumyślna',
    opis: 'Szkoda w mieniu pracodawcy z winy nieumyślnej, np. uszkodzony wózek albo towar przy rozładunku.',
    przepis: 'art. 114–119 Kodeksu pracy',
  },
  umyslna: {
    krotko: 'Szkoda umyślna',
    opis: 'Szkoda wyrządzona umyślnie, np. przywłaszczenie towaru albo celowe zniszczenie.',
    przepis: 'art. 122 Kodeksu pracy',
  },
  powierzone: {
    krotko: 'Mienie powierzone',
    opis: 'Mienie powierzone z obowiązkiem zwrotu albo wyliczenia się, np. towar w magazynie, kasa, narzędzia, odzież robocza.',
    przepis: 'art. 124 Kodeksu pracy',
  },
  wspolne: {
    krotko: 'Wspólne mienie (umowa)',
    opis: 'Mienie powierzone kilku osobom łącznie na podstawie pisemnej umowy o współodpowiedzialności materialnej.',
    przepis: 'art. 125 Kodeksu pracy',
  },
};

export interface DaneOdpowiedzialnosci {
  sytuacja: Sytuacja;
  /** Kwota szkody (zł). */
  szkoda: number;
  /** Część szkody, do której przyczynił się pracodawca albo inna osoba (zł); domyślnie 0. */
  przyczynienie?: number;
  /** Wynagrodzenie miesięczne z dnia szkody (zł brutto); potrzebne przy winie nieumyślnej. */
  wynagrodzenie?: number;
  /** Część z umowy o współodpowiedzialności (%); potrzebna przy mieniu wspólnym. */
  udzial?: number;
  dataSzkody: string;
  /** Dzień, w którym pracodawca dowiedział się o szkodzie. */
  dataWiedzy: string;
}

const gr = (x: number) => Math.round(x * 100);

/** Sprawdza dane; zwraca komunikat błędu i nazwę pola albo null. */
export function bladDanych(d: DaneOdpowiedzialnosci, dzis: string): { pole: string; tekst: string } | null {
  if (!(gr(d.szkoda) > 0 && d.szkoda < 100_000_000)) return { pole: 'szkoda', tekst: 'Wpisz kwotę szkody w złotych, na przykład 12000.' };
  const p = d.przyczynienie ?? 0;
  if (!(p >= 0 && p < 100_000_000)) return { pole: 'przyczynienie', tekst: 'Wpisz w złotych część szkody, do której przyczynił się pracodawca albo inna osoba, albo 0.' };
  if (gr(p) > gr(d.szkoda)) return { pole: 'przyczynienie', tekst: 'Przyczynienie pracodawcy albo innej osoby nie może być większe niż cała szkoda.' };
  if (d.sytuacja === 'nieumyslna' && !(gr(d.wynagrodzenie ?? Number.NaN) > 0 && (d.wynagrodzenie ?? 0) < 10_000_000))
    return { pole: 'wynagrodzenie', tekst: 'Wpisz wynagrodzenie miesięczne brutto, na przykład 5200.' };
  if (d.sytuacja === 'wspolne' && !(Math.round((d.udzial ?? Number.NaN) * 100) > 0 && (d.udzial ?? 0) <= 100))
    return { pole: 'udzial', tekst: 'Wpisz część z umowy w procentach: od 0,01 do 100.' };
  if (d.sytuacja === 'wspolne' && Math.abs((d.udzial ?? 0) * 100 - Math.round((d.udzial ?? 0) * 100)) > 1e-6)
    return { pole: 'udzial', tekst: 'Wpisz część z umowy z najwyżej dwoma miejscami po przecinku, na przykład 33,33.' };
  if (!poprawnaData(d.dataSzkody)) return { pole: 'dataSzkody', tekst: 'Wpisz dzień szkody.' };
  if (d.dataSzkody < '1990-01-01') return { pole: 'dataSzkody', tekst: 'Dzień szkody: najwcześniej 1 stycznia 1990 r.' };
  if (d.dataSzkody > dzis) return { pole: 'dataSzkody', tekst: 'Dzień szkody nie może być późniejszy niż dziś.' };
  if (!poprawnaData(d.dataWiedzy)) return { pole: 'dataWiedzy', tekst: 'Wpisz dzień, w którym pracodawca dowiedział się o szkodzie.' };
  if (d.dataWiedzy < d.dataSzkody) return { pole: 'dataWiedzy', tekst: 'Pracodawca nie mógł dowiedzieć się o szkodzie przed dniem szkody.' };
  if (d.dataWiedzy > dzis) return { pole: 'dataWiedzy', tekst: 'Dzień, w którym pracodawca się dowiedział, nie może być późniejszy niż dziś.' };
  return null;
}

/** Górna granica odszkodowania (zł) i czy zadziałał limit trzech pensji. */
export function granicaOdszkodowania(d: DaneOdpowiedzialnosci) {
  const poPrzyczynieniu = gr(d.szkoda) - gr(d.przyczynienie ?? 0);
  if (d.sytuacja === 'nieumyslna') {
    const limit = 3 * gr(d.wynagrodzenie ?? 0);
    return { kwota: Math.min(poPrzyczynieniu, limit) / 100, limit: limit / 100, limitDziala: limit < poPrzyczynieniu, poPrzyczynieniu: poPrzyczynieniu / 100 };
  }
  if (d.sytuacja === 'wspolne') {
    // Część z umowy w groszach, zaokrąglona do pełnego grosza (połówka w górę), na liczbach całkowitych:
    // procent w setnych częściach, żeby 33,33% nie dawało błędu zapisu dziesiętnego.
    const setne = Math.round((d.udzial ?? 0) * 100);
    const kwota = Math.floor((poPrzyczynieniu * setne + 5000) / 10000);
    return { kwota: kwota / 100, limit: null, limitDziala: false, poPrzyczynieniu: poPrzyczynieniu / 100 };
  }
  return { kwota: poPrzyczynieniu / 100, limit: null, limitDziala: false, poPrzyczynieniu: poPrzyczynieniu / 100 };
}

const koniecRoku = (data: string) => `${data.slice(0, 4)}-12-31`;
const wczesniejsza = (a: string, b: string) => (a <= b ? a : b);

/** Przedawnienie roszczenia pracodawcy: ostatni dzień, w którym roszczenie nie jest przedawnione. */
export function przedawnienieRoszczenia(sytuacja: Sytuacja, dataSzkody: string, dataWiedzy: string) {
  if (sytuacja === 'umyslna') {
    const odWiedzy = dodajLata(dataWiedzy, 3);
    const maks = dodajLata(dataSzkody, 10);
    const koniec = wczesniejsza(odWiedzy, maks);
    return {
      koniec,
      odWiedzy,
      maks,
      /** Wariant z końcem roku (art. 118 zd. 2 KC), nie później niż 10 lat od szkody liczone tak samo. */
      koniecRoku: wczesniejsza(koniecRoku(koniec), koniecRoku(maks)),
      przestepstwo: dodajLata(dataSzkody, 20),
    };
  }
  const odWiedzy = dodajLata(dataWiedzy, 1);
  const maks = dodajLata(dataSzkody, 3);
  return { koniec: wczesniejsza(odWiedzy, maks), odWiedzy, maks, koniecRoku: null, przestepstwo: null };
}

/** Art. 115 KC: koniec terminu w sobotę albo dzień ustawowo wolny przesuwa się na następny dzień, który nim nie jest. */
export function przesunietyKoniec(data: string): string {
  let d = data;
  const wolne = (x: string) => dzienTygodnia(x) === 0 || dzienTygodnia(x) === 6 || swieta(Number(x.slice(0, 4))).some((s) => s.data === x);
  while (wolne(d)) d = dodajDni(d, 1);
  return d;
}

export interface OpisOdpowiedzialnosci {
  granica: string;
  granicaOpis: string;
  przepisy: string;
  przedawnienie: string;
  przedawnienieOpis: string;
  status: string;
  statusKlasa: 'po-terminie' | 'pilne' | 'wkrotce' | 'w-terminie';
  potracenie: string;
  /** Uwagi zależne od sytuacji: każda w osobnym akapicie. */
  uwagi: string[];
}

const POTRACENIE =
  'Potrącić odszkodowanie z pensji pracodawca może tylko za Twoją zgodą na piśmie (art. 91 § 1 Kodeksu pracy): nie ma go wśród potrąceń bez zgody (art. 87 § 1). Bez zgody musi uzyskać wyrok sądu pracy albo ugodę z klauzulą wykonalności (art. 121¹) i skierować sprawę do komornika. Także przy zgodzie część pensji jest wolna od potrąceń (art. 91 § 2 pkt 1).';

const OBNIZENIE_1975 =
  'Gdy nadzór nad mieniem jest utrudniony, na przykład w magazynie, w którym pracuje się dłużej niż na jedną zmianę albo w obsadzie co najmniej 5 osób, odszkodowanie za towar i inne mienie z art. 124 § 2 oraz za mienie wspólne obniża się stosownie do utrudnienia; nie dotyczy to pieniędzy, narzędzi, odzieży i obuwia roboczego ani środków ochrony (§ 6 ust. 1 rozporządzenia z 10 października 1975 r.). Tak samo, gdy do mienia mają dostęp inne osoby (§ 6 ust. 1 pkt 1), a w innych okolicznościach w wyjątkowych wypadkach (§ 6 ust. 2). Obniżenie ustala pracodawca po wysłuchaniu pracownika i opinii związku zawodowego (§ 8–9). Kwota wyżej jest przed obniżeniem.';

const MAGAZYN_1975 =
  'W magazynie z wydzieloną halą spedycyjną i dozorem ruchu mienia i osób (albo z automatycznym przeładunkiem) za powierzony towar odpowiada się na zasadach art. 114–116 i 118 Kodeksu pracy, czyli pracodawca musi udowodnić winę, a odpowiada się tylko za rzeczywistą stratę; obowiązuje to po pisemnym zawiadomieniu i inwentaryzacji (§ 2 rozporządzenia z 10 października 1975 r.). Rozporządzenie nie odsyła do limitu trzech pensji z art. 119.';

const UMYSLNIE_POWIERZONE =
  'Gdy pracodawca zarzuca, że szkodę wyrządzono umyślnie, na przykład przez przywłaszczenie towaru, odpowiada się w pełnej wysokości (art. 122 przez art. 127), a przedawnienie liczy się jak przy szkodzie umyślnej (art. 291 § 3): wybierz wtedy „Szkoda umyślna”.';

const RYZYKO = 'Pracownik nie odpowiada za szkodę w granicach dopuszczalnego ryzyka ani za ryzyko działalności pracodawcy (art. 117 § 2).';

const UGODA = 'W ugodzie z pracodawcą odszkodowanie może być niższe, z uwzględnieniem m.in. stopnia winy i stosunku do obowiązków; może je obniżyć także sąd pracy (art. 121).';

const STATUS_DNI = (zostalo: number): OpisOdpowiedzialnosci['statusKlasa'] => (zostalo <= 30 ? 'pilne' : zostalo <= 90 ? 'wkrotce' : 'w-terminie');

/** Teksty wyniku: te same w HTML ze strony i w skrypcie przeglądarki. Rzuca RangeError przy błędnych danych. */
export function opisOdpowiedzialnosci(d: DaneOdpowiedzialnosci, dzis: string): OpisOdpowiedzialnosci {
  const blad = bladDanych(d, dzis);
  if (blad) throw new RangeError(blad.tekst);
  const g = granicaOdszkodowania(d);
  const p = przedawnienieRoszczenia(d.sytuacja, d.dataSzkody, d.dataWiedzy);
  const umyslna = d.sytuacja === 'umyslna';
  const uwagi: string[] = [];
  const przyczynienie = d.przyczynienie ?? 0;
  const poOdjeciu = przyczynienie > 0 ? ` (po odjęciu ${zl(przyczynienie)}, do których przyczynił się pracodawca albo inna osoba)` : '';

  let granicaOpis: string;
  if (d.sytuacja === 'nieumyslna') {
    granicaOpis = g.limitDziala
      ? `limit: 3 × ${zl(d.wynagrodzenie ?? 0)} pensji z dnia szkody, mniej niż szkoda${poOdjeciu}: ${zl(g.poPrzyczynieniu)}`
      : `cała szkoda${poOdjeciu}; limit trzech pensji to ${zl(g.limit ?? 0)}`;
    uwagi.push(`Odpowiadasz tylko za rzeczywistą stratę i normalne następstwa, bez utraconych zysków pracodawcy (art. 115). ${RYZYKO} Gdy szkodę wyrządziło kilka osób, każda odpowiada za część według przyczynienia się i stopnia winy, a gdy nie da się ich ustalić, w częściach równych (art. 118).`);
    uwagi.push(UGODA);
  } else if (umyslna) {
    granicaOpis = `pełna wysokość szkody${poOdjeciu}, bez limitu trzech pensji (art. 122)`;
    uwagi.push('Winę umyślną musi udowodnić pracodawca (art. 116). Kodeks pracy nie mówi, czy pełna wysokość obejmuje utracone korzyści; jeśli sąd sięgnie do Kodeksu cywilnego (art. 361 § 2 przez art. 300 Kodeksu pracy), pracodawca może żądać także ich, a nie tylko rzeczywistej straty. Przepis o obniżeniu odszkodowania w ugodzie albo przez sąd (art. 121) nie wyłącza wprost szkody umyślnej.');
  } else if (d.sytuacja === 'powierzone') {
    granicaOpis = `pełna wysokość szkody w powierzonym mieniu${poOdjeciu} (art. 124)`;
    uwagi.push(`Uwolnisz się od odpowiedzialności, gdy wykażesz, że szkoda powstała z przyczyn od Ciebie niezależnych, w szczególności gdy pracodawca nie zapewnił warunków do zabezpieczenia mienia (art. 124 § 3). ${RYZYKO} ${UGODA}`);
    uwagi.push(OBNIZENIE_1975, MAGAZYN_1975, UMYSLNIE_POWIERZONE);
  } else {
    granicaOpis = `${liczba(d.udzial ?? 0)}% z ${zl(g.poPrzyczynieniu)}${poOdjeciu}, według części z umowy (art. 125 § 2)`;
    uwagi.push('Gdy ustalono, że niedobór spowodowały tylko niektóre osoby, za tę część odpowiadają tylko one, a za resztę nadal wspólnie z pozostałymi (art. 125 § 2 i § 6 rozporządzenia z 4 października 1974 r.). Umowa musi być pisemna, pod rygorem nieważności (art. 125 § 1), a każda zmiana składu zespołu wymaga nowej umowy (§ 5).');
    uwagi.push(`Uwolnisz się od odpowiedzialności, gdy wykażesz, że szkoda powstała z przyczyn od Ciebie niezależnych, w szczególności gdy pracodawca nie zapewnił warunków do zabezpieczenia mienia (art. 124 § 3 przez art. 125 § 1). W 3 dni od wiadomości o niedoborze możesz na piśmie odstąpić od umowy na przyszłość; za niedobór stwierdzony do końca inwentaryzacji odpowiadasz nadal, jeśli inwentaryzacja zacznie się w 7 dni od odstąpienia; jeśli nie, od dnia odstąpienia nie odpowiadasz (§ 11 ust. 1 i § 20 ust. 1 rozporządzenia z 1974 r.). ${UGODA}`);
    uwagi.push(OBNIZENIE_1975, UMYSLNIE_POWIERZONE);
  }

  // Ostatni dzień, w którym roszczenie może jeszcze nie być przedawnione: przy winie umyślnej koniec roku (art. 118 zd. 2
  // KC), w każdej sytuacji z przesunięciem z soboty i dnia wolnego (art. 115 KC). Status liczymy od niego.
  const najpozniej = przesunietyKoniec(umyslna ? (p.koniecRoku ?? p.koniec) : p.koniec);
  const czesci: string[] = [];
  if (umyslna) {
    czesci.push(
      p.koniec === p.maks
        ? 'Termin: 10 lat od zdarzenia, które wywołało szkodę, bo to wcześniej niż 3 lata od dnia, w którym pracodawca się dowiedział (art. 291 § 3 Kodeksu pracy i art. 442¹ § 1 Kodeksu cywilnego).'
        : 'Termin: 3 lata od dnia, w którym pracodawca dowiedział się albo przy należytej staranności mógł się dowiedzieć o szkodzie i o osobie obowiązanej do jej naprawienia, najpóźniej 10 lat od zdarzenia (art. 291 § 3 Kodeksu pracy i art. 442¹ § 1 Kodeksu cywilnego).',
    );
    if (p.koniecRoku && p.koniecRoku !== p.koniec) czesci.push(`Jeśli koniec terminu przypada na ostatni dzień roku (art. 118 zd. 2 Kodeksu cywilnego; przepisy tego nie przesądzają), to ${dataPoPolsku(p.koniecRoku)}`);
  } else {
    czesci.push(
      p.koniec === p.maks
        ? 'Termin: 3 lata od szkody, bo to wcześniej niż rok od dnia, w którym pracodawca się dowiedział (art. 291 § 2 Kodeksu pracy).'
        : 'Termin: rok od dnia, w którym pracodawca dowiedział się o szkodzie, najpóźniej 3 lata od szkody (art. 291 § 2 Kodeksu pracy).',
    );
  }
  const bezPrzesuniecia = umyslna ? (p.koniecRoku ?? p.koniec) : p.koniec;
  if (najpozniej !== bezPrzesuniecia) czesci.push(`${dataPoPolsku(bezPrzesuniecia)} to sobota albo dzień wolny od pracy; jeśli termin przesuwa się na następny dzień (art. 115 Kodeksu cywilnego), to ${dataPoPolsku(najpozniej)}`);
  if (umyslna) czesci.push(`Gdy szkoda wynikła ze zbrodni lub występku, czyli przestępstwa, termin to 20 lat od jego popełnienia: ${dataPoPolsku(p.przestepstwo!)} (art. 442¹ § 2).`);
  czesci.push(
    umyslna
      ? 'Bieg przedawnienia przerywa pozew albo inna czynność przed sądem lub komornikiem, i uznanie roszczenia; potem termin biegnie od nowa (art. 123–124 Kodeksu cywilnego). Mediacja wstrzymuje bieg przedawnienia na czas jej trwania (art. 121 pkt 5). Po terminie można odmówić zapłaty (art. 117 § 2).'
      : 'Bieg przedawnienia przerywa pozew albo inna czynność przed sądem lub komornikiem i uznanie roszczenia; potem termin biegnie od nowa (art. 295 Kodeksu pracy). Po terminie można odmówić zapłaty (art. 292).',
  );

  const zostalo = dniMiedzy(dzis, p.koniec);
  const doNajpozniej = dniMiedzy(dzis, najpozniej);
  let status: string;
  let statusKlasa: OpisOdpowiedzialnosci['statusKlasa'];
  if (zostalo === 0) {
    status = doNajpozniej > 0 ? `Termin kończy się dziś albo ${dataPoPolsku(najpozniej)}` : 'Dziś jest ostatni dzień terminu pracodawcy';
    statusKlasa = 'pilne';
  } else if (zostalo > 0) {
    // Liczba dni do daty wcześniejszej, a kolor według późniejszej (bezpieczniej dla pracownika).
    status = `Pracodawcy zostało: ${odmiana(zostalo, ['dzień', 'dni', 'dni'])}${najpozniej !== p.koniec ? `, a może do ${dataPoPolsku(najpozniej)}` : ''}`;
    statusKlasa = STATUS_DNI(doNajpozniej);
  } else if (doNajpozniej >= 0) {
    status = `Termin mógł minąć, ale może trwać do ${dataPoPolsku(najpozniej)}`;
    statusKlasa = STATUS_DNI(doNajpozniej);
  } else {
    status = `Termin pracodawcy minął ${odmiana(-doNajpozniej, ['dzień', 'dni', 'dni'])} temu${umyslna && dniMiedzy(dzis, p.przestepstwo!) >= 0 ? ', chyba że szkoda wynikła z przestępstwa' : ''}`;
    statusKlasa = 'po-terminie';
  }

  return {
    granica: zl(g.kwota),
    granicaOpis,
    przepisy: SYTUACJE[d.sytuacja].przepis,
    przedawnienie: dataPoPolsku(p.koniec),
    przedawnienieOpis: czesci.join(' '),
    status,
    statusKlasa,
    potracenie: POTRACENIE,
    uwagi,
  };
}
