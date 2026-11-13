// Urlop w okresie wypowiedzenia: ile dni pracodawca może najwyżej udzielić do końca umowy, a za ile dni urlopu
// na pewno należy się ekwiwalent. Kodeks pracy, tekst jednolity Dz.U. 2026 poz. 1245:
// - art. 167^1: w okresie wypowiedzenia pracownik jest obowiązany wykorzystać przysługujący mu urlop, jeżeli pracodawca
//   go udzieli; wymiar udzielonego urlopu, z wyłączeniem zaległego, nie może przekraczać wymiaru z art. 155^1;
// - art. 155^1 § 1 pkt 1: w roku ustania stosunku pracy urlop u dotychczasowego pracodawcy proporcjonalny do okresu
//   przepracowanego u tego pracodawcy w tym roku, chyba że pracownik wykorzystał już urlop w tym lub wyższym wymiarze;
//   § 2: wtedy u kolejnego pracodawcy urlop odpowiednio niższy, ale łącznie nie niższy niż z okresu przepracowanego
//   w tym roku u wszystkich pracodawców;
// - art. 155^2a § 1–2: kalendarzowy miesiąc pracy = 1/12 wymiaru z art. 154 § 1 i 2, niepełny miesiąc w górę;
//   § 3: przy zmianie pracy w tym samym miesiącu zaokrągla dotychczasowy pracodawca;
// - art. 155^3 § 1–2: niepełny dzień w górę, nie więcej niż wymiar z art. 154 § 1 i 2;
// - art. 153 § 2 i art. 161: prawo do urlopu za dany rok powstaje w tym roku i w nim się go udziela;
// - art. 171 § 1: za urlop niewykorzystany z powodu rozwiązania stosunku pracy przysługuje ekwiwalent pieniężny;
// - art. 154^2 § 1: urlopu udziela się w dni pracy z rozkładu czasu pracy.
// Dni pracy: od poniedziałku do piątku (albo do soboty) bez świąt z ustawy o dniach wolnych od pracy (dniRobocze),
// chyba że użytkownik poda liczbę dni z grafiku.
// Przyjęte interpretacje:
// - odczytanie art. 155^2a § 2: miesiące to kalendarzowe miesiące od 1 stycznia roku ustania (albo od początku pracy,
//   gdy później) do ostatniego dnia umowy; każdy rozpoczęty miesiąc kalendarzowy liczy się jak pełny;
// - „wykorzystane” to dni urlopu za rok ustania stosunku pracy; „zaległy” to niewykorzystany urlop za lata
//   wcześniejsze, który limit z art. 167^1 pomija;
// - urlopu za rok ustania (N+1) nie da się udzielić przed 1 stycznia N+1, więc mieści się tylko w dniach pracy w roku
//   końca umowy; zaległy mieści się w pozostałych dniach. Z dniami z grafiku przyjmujemy, że w roku końca umowy jest
//   ich najwyżej tyle, ile z kalendarza (ale nie więcej niż w grafiku);
// - „ekwiwalent co najmniej” = urlop, który nie zmieści się w dniach pracy; za każdy inny niewykorzystany dzień też
//   należy się ekwiwalent (art. 171 § 1);
// - nie liczymy urlopu w roku pierwszej pracy w życiu (art. 153 § 1) ani dodatkowego urlopu z innych ustaw; wymiar
//   roczny od 1 do 26 dni (art. 154 § 1 i 3); nie odejmujemy zwolnienia na szukanie pracy (art. 37) ani obniżenia
//   wymiaru za święto w sobotę (art. 130 § 2), bo nie wiemy, jak pracodawca ułoży grafik.
import { dniRobocze } from './dni-robocze';
import { dataPoPolsku, dniMiedzy, poprawnaData } from './terminy';
import { odmiana } from '../redakcja';
import { dzienTygodnia } from './dni-wolne';

export const MAKS_WYMIAR = 26;
/** Najdłuższy zakres od „urlop od” do końca umowy (dni kalendarzowe). */
export const MAKS_ZAKRES = 366;

export type PoleUrlopu = 'koniec' | 'od' | 'poczatek' | 'wymiar' | 'wykorzystane' | 'zalegly' | 'grafik';

/** Błąd danych z nazwą pola, którego dotyczy. */
export class BladDanych extends RangeError {
  constructor(
    public pole: PoleUrlopu,
    message: string,
  ) {
    super(message);
  }
}

export interface DaneUrlopu {
  /** Ostatni dzień umowy (RRRR-MM-DD). */
  koniecUmowy: string;
  /** Pierwszy dzień, od którego pracodawca może udzielić urlopu. */
  urlopOd: string;
  /** Początek pracy u tego pracodawcy, gdy w roku ustania umowy; pusty = od 1 stycznia. */
  poczatekPracy?: string;
  /** Roczny wymiar urlopu (art. 154 § 1 i 2), już przeliczony na etat. */
  wymiar: number;
  /** Dni urlopu za rok ustania umowy już wykorzystane. */
  wykorzystane: number;
  /** Zaległy urlop z lat poprzednich, jeszcze niewykorzystany. */
  zalegly: number;
  /** Czy soboty są dniami pracy. */
  soboty?: boolean;
  /** Liczba dni pracy z grafiku do końca umowy (nadpisuje wyliczenie). */
  dniPracy?: number;
}

const calkowita = (n: number, od: number, do_: number) => Number.isInteger(n) && n >= od && n <= do_;

/** Ostatni dzień miesiąca daty. */
export function koniecMiesiaca(data: string): string {
  const [r, m] = data.split('-').map(Number);
  return new Date(Date.UTC(r, m, 0)).toISOString().slice(0, 10);
}

/** Kalendarzowe miesiące od `od` do `do_`, każdy rozpoczęty jak pełny (art. 155^2a § 2). */
export function miesiaceKalendarzowe(od: string, do_: string): number {
  const [r1, m1] = od.split('-').map(Number);
  const [r2, m2] = do_.split('-').map(Number);
  return (r2 - r1) * 12 + (m2 - m1) + 1;
}

/** Urlop proporcjonalny w roku ustania (art. 155^1 § 1 pkt 1, 155^2a, 155^3): w górę, nie więcej niż wymiar. */
export const proporcjonalny = (wymiar: number, miesiace: number) => Math.min(wymiar, Math.floor((wymiar * miesiace + 11) / 12));

export function urlopWWypowiedzeniu(d: DaneUrlopu) {
  if (!poprawnaData(d.koniecUmowy)) throw new BladDanych('koniec', 'Wpisz ostatni dzień umowy');
  if (!poprawnaData(d.urlopOd)) throw new BladDanych('od', 'Wpisz, od kiedy możesz dostać urlop');
  if (d.koniecUmowy < d.urlopOd) throw new BladDanych('koniec', 'Koniec umowy przed datą „urlop od”');
  const kalendarzowe = dniMiedzy(d.urlopOd, d.koniecUmowy) + 1;
  if (kalendarzowe > MAKS_ZAKRES) throw new BladDanych('koniec', 'Najwyżej rok od daty „urlop od” do końca umowy');
  if (d.poczatekPracy) {
    if (!poprawnaData(d.poczatekPracy)) throw new BladDanych('poczatek', 'Popraw datę początku pracy albo zostaw pole puste');
    if (d.poczatekPracy > d.urlopOd) throw new BladDanych('poczatek', 'Początek pracy po dacie „urlop od”');
  }
  if (!calkowita(d.wymiar, 1, MAKS_WYMIAR)) throw new BladDanych('wymiar', 'Roczny wymiar urlopu: pełne dni od 1 do 26');
  if (!calkowita(d.wykorzystane, 0, d.wymiar)) throw new BladDanych('wykorzystane', 'Wykorzystane: pełne dni od 0 do rocznego wymiaru');
  if (!calkowita(d.zalegly, 0, 200)) throw new BladDanych('zalegly', 'Zaległy urlop: pełne dni od 0 do 200');
  if (d.dniPracy !== undefined && !calkowita(d.dniPracy, 0, kalendarzowe))
    throw new BladDanych('grafik', `Dni z grafiku: najwyżej tyle, ile dni kalendarzowych w zakresie (${kalendarzowe})`);

  const soboty = d.soboty ?? false;
  const rok = Number(d.koniecUmowy.slice(0, 4));
  const styczen = `${rok}-01-01`;
  const innyRok = d.urlopOd < styczen;
  const poczatek = d.poczatekPracy && d.poczatekPracy > styczen ? d.poczatekPracy : styczen;
  const miesiace = miesiaceKalendarzowe(poczatek, d.koniecUmowy);
  const zaRok = proporcjonalny(d.wymiar, miesiace);
  const biezacy = Math.max(0, zaRok - d.wykorzystane);
  const nadwyzka = Math.max(0, d.wykorzystane - zaRok);
  const razem = biezacy + d.zalegly;

  const robocze = dniRobocze(d.urlopOd, d.koniecUmowy, soboty);
  const zGrafiku = d.dniPracy !== undefined;
  const dniPracy = zGrafiku ? d.dniPracy! : robocze.robocze;
  // Urlop za rok ustania tylko w dniach pracy od 1 stycznia tego roku.
  const dniPracyWRoku = innyRok ? Math.min(dniRobocze(styczen, d.koniecUmowy, soboty).robocze, dniPracy) : dniPracy;
  const udzielonyBiezacy = Math.min(biezacy, dniPracyWRoku);
  const udzielonyZalegly = Math.min(d.zalegly, dniPracy - udzielonyBiezacy);
  const wWypowiedzeniu = udzielonyBiezacy + udzielonyZalegly;
  // Święta, które w tym rozkładzie wypadają w dniu pracy (przy pon.–pt. bez sobót).
  const swieta = robocze.swieta.map((s) => s.data).filter((s) => soboty || dzienTygodnia(s) !== 6);
  return {
    rok,
    wymiar: d.wymiar,
    urlopOd: d.urlopOd,
    /** Od kiedy liczymy okres przepracowany w roku ustania. */
    poczatek,
    miesiace,
    proporcjonalny: zaRok,
    biezacy,
    nadwyzka,
    zalegly: d.zalegly,
    razem,
    dniPracy,
    /** Dni pracy od 1 stycznia roku końca umowy (gdy „urlop od” jest w poprzednim roku). */
    dniPracyWRoku,
    zGrafiku,
    soboty,
    /** Święta w dni pracy w zakresie (pominięte w dniach pracy, gdy liczymy bez grafiku). */
    swieta,
    /** Święta w soboty przy pracy od poniedziałku do piątku (art. 130 § 2: obniżają wymiar czasu pracy). */
    swietaWSoboty: soboty ? [] : robocze.swieta.filter((s) => dzienTygodnia(s.data) === 6).map((s) => s.data),
    udzielonyBiezacy,
    udzielonyZalegly,
    wWypowiedzeniu,
    /** Ekwiwalent co najmniej za tyle dni: urlop, który nie zmieści się w dniach pracy. */
    ekwiwalent: razem - wWypowiedzeniu,
    /** „Urlop od” w roku przed rokiem końca umowy. */
    innyRok,
  };
}

const DNI: [string, string, string] = ['dzień', 'dni', 'dni'];
const dni = (n: number) => odmiana(n, DNI);

/** Teksty wyniku (wspólne dla HTML z serwera i skryptu przeglądarki; skrypt dodaje typografię). */
export function teksty(r: ReturnType<typeof urlopWWypowiedzeniu>) {
  const uwagi: string[] = [];
  if (r.nadwyzka)
    uwagi.push(
      `Wykorzystane ponad proporcję: ${dni(r.nadwyzka)}. U kolejnego pracodawcy urlop w ${r.rok} r. będzie odpowiednio niższy, ale łącznie nie niższy niż wynikający z okresu przepracowanego w ${r.rok} r. u wszystkich pracodawców (art. 155¹ § 2 Kp).`,
    );
  if (r.innyRok)
    uwagi.push(
      `Pozostały urlop za ${r.rok - 1} r. wpisz w polu zaległy: limit z art. 167¹ go nie obejmuje (dotyczy urlopu za rok ustania, art. 155¹). Urlopu za ${r.rok} r. pracodawca może udzielić od 1 stycznia ${r.rok} r.: w tym roku do końca umowy ${odmiana(r.dniPracyWRoku, ['dzień pracy', 'dni pracy', 'dni pracy'])}.`,
    );
  if (!r.zGrafiku && r.swietaWSoboty.length)
    uwagi.push(
      `Święto w sobotę (${r.swietaWSoboty.map(dataPoPolsku).join(', ')}) obniża wymiar czasu pracy o 8 godzin (art. 130 § 2 Kp), więc dni pracy w grafiku może być o jeden mniej. Wpisz je wtedy w polu dni z grafiku.`,
    );
  if (r.soboty && !r.zGrafiku)
    uwagi.push('Przy pracy od poniedziałku do soboty dniówka bywa krótsza niż 8 godzin, a urlopu udziela się w godzinach (art. 154² Kp), więc dni pracy nie zawsze równają się dniom urlopu.');
  const swiat = r.swieta.length && !r.zGrafiku ? `, bez ${odmiana(r.swieta.length, ['święta', 'świąt', 'świąt'])}` : '';
  return {
    wwyp: dni(r.wWypowiedzeniu),
    opis:
      r.razem === 0
        ? 'Nie zostało urlopu do wykorzystania'
        : r.ekwiwalent
          ? `Za co najmniej ${dni(r.ekwiwalent)} urlopu należy się ekwiwalent`
          : 'Cały urlop mieści się w dniach pracy do końca umowy',
    proporcjonalny: `${dni(r.proporcjonalny)} (${r.miesiace}/12 z ${dni(r.wymiar)}, od ${dataPoPolsku(r.poczatek)})`,
    biezacyEtykieta: `Zostało z urlopu za ${r.rok} r.`,
    biezacy: dni(r.biezacy),
    zalegly: dni(r.zalegly),
    dniPracy: r.zGrafiku ? `${dni(r.dniPracy)} z grafiku` : `${dni(r.dniPracy)} od ${dataPoPolsku(r.urlopOd)}${swiat}`,
    ekwiwalent: r.ekwiwalent ? dni(r.ekwiwalent) : '0 dni, jeśli pracodawca udzieli całego urlopu',
    uwaga: uwagi.join(' '),
  };
}

/** Etykieta pola „wykorzystane” dla roku końca umowy. */
export const etykietaWykorzystanych = (koniecUmowy: string) =>
  poprawnaData(koniecUmowy) ? `Wykorzystane z urlopu za ${koniecUmowy.slice(0, 4)} r.` : 'Wykorzystane z urlopu za rok końca umowy';
