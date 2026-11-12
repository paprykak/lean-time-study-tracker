// Urlop w okresie wypowiedzenia: ile dni pracodawca może udzielić do końca umowy, a za ile należy się ekwiwalent.
// Kodeks pracy, tekst jednolity Dz.U. 2026 poz. 1245:
// - art. 167^1: w okresie wypowiedzenia pracownik jest obowiązany wykorzystać przysługujący mu urlop, jeżeli pracodawca
//   go udzieli; wymiar udzielonego urlopu, z wyłączeniem zaległego, nie może przekraczać wymiaru z art. 155^1;
// - art. 155^1 § 1 pkt 1: w roku ustania stosunku pracy urlop u dotychczasowego pracodawcy proporcjonalny do okresu
//   przepracowanego u tego pracodawcy w tym roku, chyba że pracownik wykorzystał już urlop w tym lub wyższym wymiarze;
//   § 2: nadwyżka ponad proporcję obniża urlop u kolejnego pracodawcy;
// - art. 155^2a § 1–2: kalendarzowy miesiąc pracy = 1/12 wymiaru z art. 154 § 1 i 2, niepełny miesiąc w górę;
// - art. 155^3 § 1–2: niepełny dzień w górę, nie więcej niż wymiar z art. 154 § 1 i 2;
// - art. 171 § 1: za urlop niewykorzystany z powodu rozwiązania stosunku pracy przysługuje ekwiwalent pieniężny;
// - art. 154^2 § 1: urlopu udziela się w dni pracy z rozkładu czasu pracy.
// Dni pracy: od poniedziałku do piątku (albo do soboty) bez świąt z ustawy o dniach wolnych od pracy (dniRobocze),
// chyba że użytkownik poda liczbę dni z grafiku.
// Przyjęte interpretacje:
// - miesiące liczymy jako kalendarzowe miesiące od 1 stycznia roku ustania (albo od początku pracy, gdy później)
//   do ostatniego dnia umowy; każdy rozpoczęty miesiąc kalendarzowy liczy się jak pełny (art. 155^2a § 2);
// - „wykorzystane” to dni urlopu za rok ustania stosunku pracy, „zaległy” to niewykorzystany urlop za lata wcześniejsze;
//   gdy umowa kończy się w następnym roku, tegoroczny niewykorzystany urlop staje się zaległym (wpisuje go użytkownik);
// - pracodawca może udzielić w wypowiedzeniu najwyżej tylu dni, ile jest dni pracy od „urlop od” do końca umowy;
//   reszta to ekwiwalent. Nie odejmujemy dnia wolnego za święto w sobotę (art. 130 § 2), bo wyznacza go pracodawca;
// - nie liczymy urlopu w pierwszej pracy w życiu (art. 153 § 1: 1/12 z upływem każdego miesiąca) ani dodatkowego
//   urlopu z innych ustaw; wymiar roczny przyjmujemy od 1 do 26 dni (art. 154 § 1 i 3).
import { dniRobocze } from './dni-robocze';
import { dataPoPolsku, dniMiedzy, poprawnaData } from './terminy';
import { odmiana } from '../redakcja';
import { dzienTygodnia } from './dni-wolne';

export const MAKS_WYMIAR = 26;
/** Najdłuższy zakres od „urlop od” do końca umowy (dni kalendarzowe). */
export const MAKS_ZAKRES = 366;

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
  if (!poprawnaData(d.koniecUmowy)) throw new RangeError('Błędna data końca umowy');
  if (!poprawnaData(d.urlopOd)) throw new RangeError('Błędna data „urlop od”');
  if (d.koniecUmowy < d.urlopOd) throw new RangeError('Koniec umowy przed datą „urlop od”');
  if (dniMiedzy(d.urlopOd, d.koniecUmowy) + 1 > MAKS_ZAKRES) throw new RangeError('Najwyżej rok do końca umowy');
  if (d.poczatekPracy) {
    if (!poprawnaData(d.poczatekPracy)) throw new RangeError('Błędna data początku pracy');
    if (d.poczatekPracy > d.urlopOd) throw new RangeError('Początek pracy po dacie „urlop od”');
  }
  if (!calkowita(d.wymiar, 1, MAKS_WYMIAR)) throw new RangeError('Wymiar urlopu: od 1 do 26 dni');
  if (!calkowita(d.wykorzystane, 0, d.wymiar)) throw new RangeError('Wykorzystane: od 0 do rocznego wymiaru');
  if (!calkowita(d.zalegly, 0, 200)) throw new RangeError('Zaległy urlop: od 0 do 200 dni');
  if (d.dniPracy !== undefined && !calkowita(d.dniPracy, 0, MAKS_ZAKRES)) throw new RangeError('Dni pracy z grafiku: od 0 do 366');

  const rok = Number(d.koniecUmowy.slice(0, 4));
  const styczen = `${rok}-01-01`;
  const poczatek = d.poczatekPracy && d.poczatekPracy > styczen ? d.poczatekPracy : styczen;
  const miesiace = miesiaceKalendarzowe(poczatek, d.koniecUmowy);
  const zaRok = proporcjonalny(d.wymiar, miesiace);
  const biezacy = Math.max(0, zaRok - d.wykorzystane);
  const nadwyzka = Math.max(0, d.wykorzystane - zaRok);
  const razem = biezacy + d.zalegly;
  const robocze = dniRobocze(d.urlopOd, d.koniecUmowy, d.soboty ?? false);
  const zGrafiku = d.dniPracy !== undefined;
  const dniPracy = zGrafiku ? d.dniPracy! : robocze.robocze;
  const wWypowiedzeniu = Math.min(razem, dniPracy);
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
    zGrafiku,
    /** Święta od poniedziałku do soboty w zakresie (pominięte w dniach pracy, gdy liczymy bez grafiku). */
    swieta: robocze.swieta.map((s) => s.data),
    /** Święta w soboty przy pracy od poniedziałku do piątku (art. 130 § 2: pracodawca wyznacza inny dzień wolny). */
    swietaWSoboty: d.soboty ? [] : robocze.swieta.filter((s) => dzienTygodnia(s.data) === 6).map((s) => s.data),
    wWypowiedzeniu,
    ekwiwalent: razem - wWypowiedzeniu,
    /** Umowa kończy się w innym roku niż „urlop od”. */
    innyRok: rok !== Number(d.urlopOd.slice(0, 4)),
  };
}

const DNI: [string, string, string] = ['dzień', 'dni', 'dni'];
const dni = (n: number) => odmiana(n, DNI);

/** Teksty wyniku (wspólne dla HTML z serwera i skryptu przeglądarki; skrypt dodaje typografię). */
export function teksty(r: ReturnType<typeof urlopWWypowiedzeniu>) {
  const uwagi: string[] = [];
  if (r.nadwyzka)
    uwagi.push(`Wykorzystane ponad proporcję: ${dni(r.nadwyzka)}. U kolejnego pracodawcy urlop w tym roku będzie odpowiednio niższy (art. 155^1 § 2 Kp).`);
  if (r.innyRok)
    uwagi.push(`Umowa kończy się w ${r.rok} r., więc liczymy urlop za ${r.rok} r.; niewykorzystany urlop za ${r.rok - 1} r. wpisz jako zaległy.`);
  if (!r.zGrafiku && r.swietaWSoboty.length)
    uwagi.push(
      `Święto w sobotę (${r.swietaWSoboty.map(dataPoPolsku).join(', ')}) obniża wymiar czasu pracy o 8 godzin, a dzień wolny za nie wyznacza pracodawca (art. 130 § 2 Kp), więc dni pracy może być o tyle mniej.`,
    );
  const swiat = r.swieta.length && !r.zGrafiku ? `, bez ${odmiana(r.swieta.length, ['święta', 'świąt', 'świąt'])}` : '';
  return {
    wwyp: dni(r.wWypowiedzeniu),
    opis: r.razem === 0
      ? 'Nie zostało urlopu do wykorzystania'
      : r.ekwiwalent
        ? `Za ${dni(r.ekwiwalent)} urlopu należy się ekwiwalent`
        : 'Cały urlop mieści się w dniach pracy do końca umowy',
    proporcjonalny: `${dni(r.proporcjonalny)} (${r.miesiace}/12 z ${dni(r.wymiar)}, od ${dataPoPolsku(r.poczatek)})`,
    biezacyEtykieta: `Zostało z urlopu za ${r.rok} r.`,
    biezacy: dni(r.biezacy),
    zalegly: dni(r.zalegly),
    razem: dni(r.razem),
    dniPracy: r.zGrafiku ? `${dni(r.dniPracy)} z grafiku` : `${dni(r.dniPracy)} od ${dataPoPolsku(r.urlopOd)}${swiat}`,
    ekwiwalent: r.ekwiwalent ? dni(r.ekwiwalent) : 'nie należy się',
    uwaga: uwagi.join(' '),
  };
}
