// Monitoring w pracy: czy wolno, na jakich warunkach, do kiedy nagranie, czego pracodawcy nie wolno.
// Przepisy (teksty z API Sejmu, sprawdzone 2026-11-14; po tekstach jednolitych brak zmian tych przepisów):
// - Kodeks pracy, t.j. Dz.U. 2026 poz. 1245: art. 22² § 1 (kamery: cele i teren), § 1¹ (pomieszczenia związków:
//   zawsze bez monitoringu), § 2 (sanitariaty, szatnie, stołówki, palarnie: tylko gdy niezbędne do celu i bez naruszenia
//   godności, np. techniki uniemożliwiające rozpoznanie; sanitariaty dodatkowo za uprzednią zgodą związku albo
//   przedstawicieli pracowników), § 3 (nagrania tylko do celów zebrania, najwyżej 3 miesiące od dnia nagrania), § 4
//   (przedłużenie do prawomocnego końca postępowania, gdy nagranie jest albo może być dowodem), § 5 (zniszczenie),
//   § 6 (cele, zakres, sposób w układzie, regulaminie albo obwieszczeniu), § 7 (informacja nie później niż 2 tygodnie
//   przed uruchomieniem), § 8 (informacja papierowa lub elektroniczna przed dopuszczeniem do pracy, brzmienie od
//   27 stycznia 2026 r., Dz.U. 2026 poz. 25), § 9 (oznaczenie najpóźniej dzień przed uruchomieniem), § 10 (odesłanie do
//   art. 12 i 13 RODO, jedyne w tych przepisach); art. 22³ § 1–2 (poczta: cele, tajemnica korespondencji), § 3 (odsyła do
//   art. 22² § 6–10, a nie do § 3–5), § 4 (inne formy, np. GPS: odpowiednio, gdy konieczne do celów z § 1);
//   art. 104³ § 1 (regulamin wchodzi w życie po 2 tygodniach od podania do wiadomości);
// - ustawa o Państwowej Inspekcji Pracy, t.j. Dz.U. 2024 poz. 1712 ze zm.: art. 10 ust. 1 pkt 1 (nadzór i kontrola
//   przestrzegania prawa pracy), art. 11 ust. 1 pkt 8 (wystąpienie albo polecenie, brzmienie z Dz.U. 2026 poz. 473);
// - ustawa o ochronie danych osobowych, t.j. Dz.U. 2019 poz. 1781 ze zm.: art. 34 ust. 1–2 (Prezes UODO organem
//   właściwym i nadzorczym), art. 60 (postępowanie w sprawie naruszenia prowadzi Prezes Urzędu);
// - Kodeks cywilny, t.j. Dz.U. 2026 poz. 795: art. 112 (termin w miesiącach).
//
// Interpretacje (opisane w „Jak liczymy”):
// - 3 miesiące „od dnia nagrania” liczymy z dniem nagrania włącznie (`koniecOkresu`, art. 112 KC przez art. 300 Kp):
//   nagranie z 14 listopada najpóźniej do 13 lutego, z 30 listopada do 28 (29) lutego; to wariant wcześniejszy (drugie
//   odczytanie bez dnia nagrania: 14 lutego, opisane na stronie); to granica najwyższa, pracodawca może usunąć nagranie
//   wcześniej; art. 115 KC nie przesuwa granicy (to nie termin do wykonania czynności przez pracownika);
// - „nie później niż 2 tygodnie przed uruchomieniem”: pełne 2 tygodnie między dniem informacji a dniem uruchomienia
//   (art. 112 KC: 2 tygodnie od 30 listopada mijają z końcem 14 grudnia), więc uruchomienie 15 grudnia → informacja do
//   30 listopada; informacja 1 grudnia (ten sam dzień tygodnia) jest sporna i tak ją opisujemy; „jeden dzień przed”:
//   dzień poprzedni;
// - poczta i inne formy: Kodeks pracy nie podaje okresu przechowywania (art. 22³ § 3 nie odsyła do art. 22² § 3–5),
//   więc go nie liczymy; RODO cytujemy tylko tam, gdzie odsyła Kodeks pracy (art. 22² § 10).
import { odmiana } from '../redakcja';
import { zaIle } from './choroba-zawodowa';
import { dataPoPolsku, dniMiedzy, dodajDni, dodajMiesiace, koniecOkresu, poprawnaData } from './terminy';

export type Rodzaj = 'kamery' | 'poczta' | 'inne';
export type Miejsce = 'hala' | 'teren' | 'sanitariat' | 'szatnia' | 'stolowka' | 'palarnia' | 'zwiazek';
export type Informacja = 'tak' | 'nie' | 'nie-wiem';

export const RODZAJE: Record<Rodzaj, { krotko: string; przepis: string }> = {
  kamery: { krotko: 'Kamery (obraz)', przepis: 'art. 22² Kodeksu pracy' },
  poczta: { krotko: 'Poczta służbowa', przepis: 'art. 22³ § 1–3 Kodeksu pracy' },
  inne: { krotko: 'GPS, inne formy', przepis: 'art. 22³ § 4 Kodeksu pracy' },
};

export const MIEJSCA: Record<Miejsce, { krotko: string; dopelniacz: string }> = {
  hala: { krotko: 'Hala, magazyn, biuro', dopelniacz: 'hali, magazynu albo biura' },
  teren: { krotko: 'Teren wokół zakładu', dopelniacz: 'terenu wokół zakładu' },
  sanitariat: { krotko: 'Toaleta, łazienka', dopelniacz: 'pomieszczeń sanitarnych' },
  szatnia: { krotko: 'Szatnia', dopelniacz: 'szatni' },
  stolowka: { krotko: 'Stołówka', dopelniacz: 'stołówki' },
  palarnia: { krotko: 'Palarnia', dopelniacz: 'palarni' },
  zwiazek: { krotko: 'Pokój związku', dopelniacz: 'pomieszczeń udostępnianych zakładowej organizacji związkowej' },
};

export const INFORMACJE: Record<Informacja, string> = {
  tak: 'Tak, wpiszę kiedy',
  nie: 'Nie poinformowano',
  'nie-wiem': 'Nie wiem',
};

export const OKRES_NAGRAN_MIESIACE = 3;
export const TYGODNIE_PRZED = 2;

export interface DaneMonitoringu {
  rodzaj: Rodzaj;
  /** Miejsce kamer (tylko przy rodzaju „kamery”). */
  miejsce?: Miejsce;
  /** Dzień uruchomienia monitoringu (opcjonalnie). */
  uruchomienie?: string;
  informacja?: Informacja;
  /** Dzień, w którym pracodawca poinformował pracowników (przy informacji „tak”). */
  dataInformacji?: string;
  /** Dzień nagrania (tylko kamery, opcjonalnie). */
  nagranie?: string;
}

const puste = (x?: string) => x === undefined || x === '';
const NAJWCZESNIEJ = '2000-01-01';

export function bladMonitoringu(d: DaneMonitoringu, dzis: string): { pole: keyof DaneMonitoringu; tekst: string } | null {
  if (!puste(d.uruchomienie)) {
    if (!poprawnaData(d.uruchomienie!)) return { pole: 'uruchomienie', tekst: 'Wpisz pełną datę uruchomienia monitoringu albo zostaw pole puste.' };
    if (d.uruchomienie! < NAJWCZESNIEJ) return { pole: 'uruchomienie', tekst: 'Data uruchomienia: najwcześniej 1 stycznia 2000 r.' };
  }
  if (d.informacja === 'tak') {
    if (!poprawnaData(d.dataInformacji ?? '')) return { pole: 'dataInformacji', tekst: 'Wpisz dzień, w którym pracodawca poinformował o monitoringu.' };
    if (d.dataInformacji! < NAJWCZESNIEJ) return { pole: 'dataInformacji', tekst: 'Data informacji: najwcześniej 1 stycznia 2000 r.' };
    if (d.dataInformacji! > dzis) return { pole: 'dataInformacji', tekst: 'Dzień informacji nie może być późniejszy niż dziś.' };
  }
  if (d.rodzaj === 'kamery' && !puste(d.nagranie)) {
    if (!poprawnaData(d.nagranie!)) return { pole: 'nagranie', tekst: 'Wpisz pełną datę nagrania albo zostaw pole puste.' };
    if (d.nagranie! < NAJWCZESNIEJ) return { pole: 'nagranie', tekst: 'Data nagrania: najwcześniej 1 stycznia 2000 r.' };
    if (d.nagranie! > dzis) return { pole: 'nagranie', tekst: 'Dzień nagrania nie może być późniejszy niż dziś.' };
    if (!puste(d.uruchomienie) && d.nagranie! < d.uruchomienie!) return { pole: 'nagranie', tekst: 'Nagranie nie może być wcześniejsze niż uruchomienie monitoringu.' };
  }
  return null;
}

/** Najpóźniejszy dzień informacji (2 tygodnie przed) i oznaczenia (dzień przed) dla dnia uruchomienia. */
export const terminyInformacji = (uruchomienie: string) => ({
  /** Pełne 2 tygodnie między informacją a uruchomieniem (art. 112 KC): 15 grudnia → 30 listopada. */
  informacja: dodajDni(uruchomienie, -7 * TYGODNIE_PRZED - 1),
  /** Drugie odczytanie: ten sam dzień tygodnia 2 tygodnie wcześniej (15 grudnia → 1 grudnia). */
  informacjaLagodniej: dodajDni(uruchomienie, -7 * TYGODNIE_PRZED),
  oznaczenie: dodajDni(uruchomienie, -1),
});

/** Ostatni dzień, w którym pracodawca może przechowywać nagranie obrazu (art. 22² § 3, art. 112 KC). */
export const koniecPrzechowywania = (nagranie: string) => koniecOkresu(nagranie, OKRES_NAGRAN_MIESIACE);
/** Drugie odczytanie: dzień nagrania się nie wlicza (14 listopada → 14 lutego). */
export const koniecPrzechowywaniaPozniej = (nagranie: string) => dodajMiesiace(nagranie, OKRES_NAGRAN_MIESIACE);

export type Werdykt = 'wolno' | 'wyjatkowo' | 'nie';
export type KlasaStatusu = 'po-terminie' | 'pilne' | 'wkrotce' | 'w-terminie';

export interface OpisMonitoringu {
  werdykt: string;
  werdyktOpis: string;
  werdyktKlasa: KlasaStatusu;
  przepis: string;
  /** Warunki, które pracodawca musi spełnić (lista). */
  warunki: string[];
  informacja: string;
  /** Krótki status (np. „Za późno o 5 dni”) i jego klasa; null, gdy nie ma czego oceniać. */
  informacjaStatus: string | null;
  informacjaKlasa: KlasaStatusu | null;
  przechowywanie: string;
  przechowywanieStatus: string | null;
  przechowywanieKlasa: KlasaStatusu | null;
  zakazy: string[];
  zgloszenie: string;
}

const dni = (n: number) => odmiana(n, ['dzień', 'dni', 'dni']);

const CELE_KAMERY = 'bezpieczeństwo pracowników, ochrona mienia, kontrola produkcji albo zachowanie w tajemnicy informacji, których ujawnienie mogłoby narazić pracodawcę na szkodę';
const CELE_POCZTA = 'organizacja pracy umożliwiająca pełne wykorzystanie czasu pracy, a także właściwe używanie udostępnionych pracownikowi narzędzi pracy';

export const ZGLOSZENIE_KROTKO =
  'Naruszenie przepisów o monitoringu możesz zgłosić okręgowemu inspektoratowi pracy (art. 10 ust. 1 pkt 1 ustawy o Państwowej Inspekcji Pracy), a w sprawie danych osobowych z nagrań Prezesowi Urzędu Ochrony Danych Osobowych (art. 34 ust. 1 i art. 60 ustawy o ochronie danych osobowych).';

export const ZGLOSZENIE =
  'Naruszenie przepisów prawa pracy możesz zgłosić okręgowemu inspektoratowi pracy: Państwowa Inspekcja Pracy nadzoruje i kontroluje przestrzeganie prawa pracy (art. 10 ust. 1 pkt 1 ustawy o Państwowej Inspekcji Pracy), a po kontroli może skierować do pracodawcy wystąpienie albo wydać polecenie (art. 11 ust. 1 pkt 8). Nagrania i inne dane z monitoringu to dane osobowe: organem właściwym w sprawie ich ochrony jest Prezes Urzędu Ochrony Danych Osobowych (art. 34 ust. 1 ustawy o ochronie danych osobowych), który prowadzi postępowanie w sprawie naruszenia przepisów o ochronie danych (art. 60).';

/** Teksty wyniku: te same w HTML ze strony i w skrypcie przeglądarki. Rzuca RangeError przy błędnych danych. */
export function opisMonitoringu(d: DaneMonitoringu, dzis: string): OpisMonitoringu {
  const blad = bladMonitoringu(d, dzis);
  if (blad) throw new RangeError(blad.tekst);
  const kamery = d.rodzaj === 'kamery';
  const miejsce: Miejsce = d.miejsce ?? 'hala';
  const warunki: string[] = [];
  const zakazy: string[] = [];
  let werdykt: string;
  let werdyktOpis: string;
  let werdyktKlasa: KlasaStatusu;
  let przepis = RODZAJE[d.rodzaj].przepis;

  if (kamery) {
    if (miejsce === 'zwiazek') {
      werdykt = 'Nie wolno';
      werdyktOpis = 'Monitoring nie obejmuje pomieszczeń udostępnianych zakładowej organizacji związkowej, bez wyjątków (art. 22² § 1¹).';
      werdyktKlasa = 'po-terminie';
      przepis = 'art. 22² § 1¹ Kodeksu pracy';
    } else if (miejsce === 'hala' || miejsce === 'teren') {
      werdykt = 'Wolno, na warunkach';
      werdyktOpis = `Kamery mogą obejmować teren zakładu pracy i teren wokół niego, gdy jest to niezbędne do celu: ${CELE_KAMERY} (art. 22² § 1).`;
      werdyktKlasa = 'w-terminie';
      przepis = 'art. 22² § 1 Kodeksu pracy';
    } else {
      werdykt = 'Tylko wyjątkowo';
      werdyktOpis = `Monitoring nie obejmuje ${MIEJSCA[miejsce].dopelniacz}, chyba że jest niezbędny do celu z art. 22² § 1 i nie naruszy godności ani innych dóbr osobistych pracowników, w szczególności dzięki technikom, które nie pozwalają rozpoznać osób w tych pomieszczeniach (art. 22² § 2).`;
      werdyktKlasa = 'wkrotce';
      przepis = 'art. 22² § 2 Kodeksu pracy';
      if (miejsce === 'sanitariat')
        warunki.push('W pomieszczeniach sanitarnych potrzebna jest wcześniejsza zgoda zakładowej organizacji związkowej, a gdy jej nie ma, przedstawicieli pracowników wybranych w sposób przyjęty u pracodawcy (art. 22² § 2 zd. 2).');
    }
  } else if (d.rodzaj === 'poczta') {
    werdykt = 'Wolno, na warunkach';
    werdyktOpis = `Pracodawca może kontrolować służbową pocztę elektroniczną, gdy jest to niezbędne do celu: ${CELE_POCZTA} (art. 22³ § 1). Kontrola nie może naruszać tajemnicy korespondencji ani innych dóbr osobistych pracownika (art. 22³ § 2).`;
    werdyktKlasa = 'w-terminie';
  } else {
    werdykt = 'Wolno, na warunkach';
    werdyktOpis = `Inne formy monitoringu, np. GPS w wózku albo w aucie służbowym, wolno stosować, gdy są konieczne do celu: ${CELE_POCZTA}; stosuje się wtedy odpowiednio zasady monitoringu poczty (art. 22³ § 4).`;
    werdyktKlasa = 'w-terminie';
  }

  // Paragrafy art. 22² § 6–10 przy poczcie i innych formach stosuje się odpowiednio (art. 22³ § 3).
  const par = (n: string) => (kamery ? `art. 22² § ${n}` : `art. 22² § ${n} przez art. 22³ § 3`);
  if (kamery && miejsce === 'zwiazek') warunki.push('Żadne: w pomieszczeniach udostępnianych zakładowej organizacji związkowej monitoringu nie wolno prowadzić (art. 22² § 1¹).');
  else {
    warunki.push(`Cele, zakres i sposób monitoringu są zapisane w układzie zbiorowym pracy albo w regulaminie pracy, a gdy pracodawca nie jest objęty układem ani nie musi mieć regulaminu, w obwieszczeniu (${par('6')}).`);
    warunki.push(`Pracownicy dowiadują się o monitoringu w sposób przyjęty u pracodawcy najpóźniej 2 tygodnie przed jego uruchomieniem (${par('7')}).`);
    warunki.push(`Każda nowa osoba dostaje cele, zakres i sposób monitoringu na papierze albo elektronicznie, zanim zacznie pracę (${par('8')}).`);
    warunki.push(
      kamery
        ? 'Teren i pomieszczenia objęte monitoringiem są oznaczone widocznie i czytelnie, znakami albo ogłoszeniami dźwiękowymi, najpóźniej dzień przed uruchomieniem (art. 22² § 9). Oznaczenie nie zastępuje informacji o przetwarzaniu danych z art. 12 i 13 RODO (§ 10).'
        : 'Monitoring jest oznaczony widocznie i czytelnie najpóźniej dzień przed uruchomieniem; przepis o znakach i ogłoszeniach stosuje się tu odpowiednio (art. 22² § 9 przez art. 22³ § 3). Oznaczenie nie zastępuje informacji o przetwarzaniu danych z art. 12 i 13 RODO (art. 22² § 10).',
    );
  }

  // Informacja przed uruchomieniem (art. 22² § 7 i § 9).
  let informacja = 'Wpisz dzień uruchomienia monitoringu, a policzymy, do kiedy pracodawca musiał poinformować pracowników i oznaczyć monitoring.';
  let informacjaStatus: string | null = null;
  let informacjaKlasa: KlasaStatusu | null = null;
  const oznaczenie = kamery ? 'oznaczenie terenu' : 'oznaczenie';
  if (kamery && miejsce === 'zwiazek') {
    informacja = 'Uprzedzenie nie zmienia wyniku: monitoringu w tych pomieszczeniach nie wolno prowadzić.';
  } else if (!puste(d.uruchomienie)) {
    const t = terminyInformacji(d.uruchomienie!);
    informacja = `Informacja najpóźniej ${dataPoPolsku(t.informacja)}, ${oznaczenie} najpóźniej ${dataPoPolsku(t.oznaczenie)}`;
    if (d.informacja === 'tak') {
      const spoznienie = dniMiedzy(t.informacja, d.dataInformacji!);
      informacja += ` Poinformowano ${dataPoPolsku(d.dataInformacji!)}`;
      if (spoznienie <= 0) {
        informacjaStatus = 'W terminie';
        informacjaKlasa = 'w-terminie';
      } else if (d.dataInformacji === t.informacjaLagodniej) {
        informacjaStatus = 'Sporne: dzień za późno albo w terminie';
        informacjaKlasa = 'wkrotce';
        informacja += ` Jeśli wystarczy ten sam dzień tygodnia 2 tygodnie przed uruchomieniem, to w terminie; przy pełnych 2 tygodniach dzień za późno.`;
      } else {
        informacjaStatus = `Za późno o ${dni(spoznienie)}`;
        informacjaKlasa = 'po-terminie';
      }
    } else if (d.informacja === 'nie') {
      const r = dniMiedzy(dzis, t.informacja);
      if (r > 0) {
        informacjaStatus = `Pracodawcy ${zaIle(r)}`;
        informacjaKlasa = r <= 3 ? 'pilne' : r <= 7 ? 'wkrotce' : 'w-terminie';
      } else if (r === 0) {
        informacjaStatus = 'Dziś ostatni dzień na informację';
        informacjaKlasa = 'pilne';
      } else {
        informacjaStatus = 'Obowiązek niespełniony';
        informacjaKlasa = 'po-terminie';
        informacja += ` Bez informacji pracodawca nie spełnił obowiązku z ${par('7')}.`;
      }
    }
  } else if (d.informacja === 'nie') {
    informacja = `Pracodawca musi poinformować pracowników najpóźniej 2 tygodnie przed uruchomieniem monitoringu (${par('7')}); wpisz dzień uruchomienia, a sprawdzimy termin.`;
  } else if (d.informacja === 'tak') {
    informacja = `Poinformowano ${dataPoPolsku(d.dataInformacji!)} Wpisz dzień uruchomienia, a sprawdzimy, czy co najmniej 2 tygodnie wcześniej.`;
  }

  // Przechowywanie nagrań (art. 22² § 3–5).
  let przechowywanie: string;
  let przechowywanieStatus: string | null = null;
  let przechowywanieKlasa: KlasaStatusu | null = null;
  if (!kamery) {
    przechowywanie =
      'Kodeks pracy nie podaje okresu przechowywania danych z monitoringu poczty ani z innych form monitoringu: przepis o 3 miesiącach dotyczy tylko nagrań obrazu (art. 22³ § 3 odsyła do art. 22² § 6–10, a nie do § 3–5).';
  } else if (miejsce === 'zwiazek') {
    przechowywanie = 'Takich nagrań w ogóle nie powinno być (art. 22² § 1¹).';
    przechowywanieStatus = 'Nagranie niedozwolone';
    przechowywanieKlasa = 'po-terminie';
  } else if (!puste(d.nagranie)) {
    const koniec = koniecPrzechowywania(d.nagranie!);
    const r = dniMiedzy(dzis, koniec);
    przechowywanie =
      r >= 0
        ? `Najpóźniej do ${dataPoPolsku(koniec)}, 3 miesiące od dnia nagrania z tym dniem włącznie (art. 22² § 3); pracodawca może je usunąć wcześniej. Dłużej tylko, gdy nagranie jest dowodem w postępowaniu albo pracodawca dowiedział się, że może nim być (§ 4).`
        : `Okres minął ${dataPoPolsku(koniec)} Nagranie z danymi osobowymi powinno być zniszczone (art. 22² § 5), chyba że jest dowodem w postępowaniu albo pracodawca dowiedział się, że może nim być (§ 4), lub przepisy odrębne stanowią inaczej (§ 5).`;
    przechowywanieStatus = r < 0 ? `Okres minął ${dni(-r)} temu` : r === 0 ? 'Dziś ostatni dzień' : `${zaIle(r).charAt(0).toUpperCase()}${zaIle(r).slice(1)}`;
    przechowywanieKlasa = r < 0 ? 'po-terminie' : r <= 3 ? 'pilne' : r <= 7 ? 'wkrotce' : 'w-terminie';
  } else {
    przechowywanie = 'Nagrania obrazu najwyżej 3 miesiące od dnia nagrania (art. 22² § 3); wpisz datę nagrania, a policzymy dzień.';
  }

  if (kamery) {
    zakazy.push('Nie wolno używać nagrań do innych celów niż te, dla których je zebrano (art. 22² § 3).');
    zakazy.push('Nie wolno trzymać nagrań dłużej niż 3 miesiące od dnia nagrania, poza postępowaniem, w którym są albo mogą być dowodem (§ 3–4); potem nagrania z danymi osobowymi trzeba zniszczyć, o ile przepisy odrębne nie stanowią inaczej (§ 5).');
    zakazy.push('Nie wolno monitorować pomieszczeń udostępnianych zakładowej organizacji związkowej (§ 1¹), a sanitariatów, szatni, stołówek i palarni tylko wyjątkowo (§ 2).');
  } else if (d.rodzaj === 'poczta') {
    zakazy.push('Nie wolno naruszać tajemnicy korespondencji ani innych dóbr osobistych pracownika (art. 22³ § 2).');
  } else {
    zakazy.push('Nie wolno stosować innej formy monitoringu, gdy nie jest konieczna do celu z art. 22³ § 1, ani naruszać tajemnicy korespondencji i dóbr osobistych (art. 22³ § 2 i 4).');
  }
  if (!(kamery && miejsce === 'zwiazek'))
    zakazy.push(`Nie wolno uruchomić monitoringu bez zapisania go w układzie, regulaminie albo obwieszczeniu, bez informacji 2 tygodnie wcześniej i bez oznaczenia dzień wcześniej (art. 22² § 6, 7 i 9${kamery ? '' : ' przez art. 22³ § 3'}).`);

  return { werdykt, werdyktOpis, werdyktKlasa, przepis, warunki, informacja, informacjaStatus, informacjaKlasa, przechowywanie, przechowywanieStatus, przechowywanieKlasa, zakazy, zgloszenie: ZGLOSZENIE_KROTKO };
}
