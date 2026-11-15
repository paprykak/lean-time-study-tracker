// L4 wstecz, początek zwolnienia i zawiadomienie pracodawcy.
//
// Przepisy (teksty z API Sejmu, kopie w .cache/narzedzia/prawo/):
// - rozporządzenie MPiPS z 10.11.2015 r. w sprawie trybu i sposobu orzekania o czasowej niezdolności do pracy,
//   wystawiania zaświadczenia lekarskiego (…) (Dz.U. 2015 poz. 2013, bez zmian; wydane na podstawie art. 59a ustawy
//   zasiłkowej, który obowiązuje w t.j. Dz.U. 2026 poz. 854):
//   § 6 ust. 1: zaświadczenie wystawia się wyłącznie po bezpośrednim badaniu;
//   § 7 ust. 1: okres od dnia badania albo od dnia bezpośrednio następującego po dniu badania;
//   § 7 ust. 2: okres zaczynający się później, „nie później jednak niż 4. dnia po dniu badania”, tylko gdy (1) bezpośrednio
//     po dniu badania przypadają dni wolne od pracy albo (2) badanie jest w okresie wcześniej orzeczonej niezdolności;
//   § 7 ust. 3: okres może objąć najwyżej 3 dni poprzedzające dzień badania, „jeżeli jego wyniki wykazują, że ubezpieczony
//     w tym okresie niewątpliwie był niezdolny do pracy”;
//   § 7 ust. 4: lekarz psychiatra może objąć okres wcześniejszy niż w ust. 3 przy stwierdzeniu lub podejrzeniu zaburzeń
//     psychicznych ograniczających zdolność ubezpieczonego do oceny własnego postępowania (przepis nie podaje granicy);
// - rozporządzenie MPiPS z 15.05.1996 r. w sprawie sposobu usprawiedliwiania nieobecności w pracy (…) (t.j. Dz.U. 2014
//   poz. 1632, bez późniejszych zmian): § 2 ust. 1 (przyczynę znaną z góry zgłasza się wcześniej), § 2 ust. 2 (niezwłocznie,
//   nie później niż w drugim dniu nieobecności; sposób: osobiście, przez inną osobę, telefonicznie, innym środkiem łączności
//   albo pocztą, wtedy liczy się data stempla, chyba że przepisy u pracodawcy określają sposób), § 2 ust. 3 (spóźnienie
//   usprawiedliwiają szczególne okoliczności, zwłaszcza obłożna choroba z brakiem domowników albo inne zdarzenie losowe;
//   wtedy zawiadamia się po ustaniu przyczyny), § 3 pkt 1 (dowodem jest zaświadczenie lekarskie z art. 55 ust. 1 ustawy);
// - ustawa zasiłkowa (t.j. Dz.U. 2026 poz. 854): art. 55 ust. 1–2 (e-ZLA trafia do ZUS), art. 55a ust. 6–7 i 9 (wydruk
//   na żądanie albo gdy płatnik nie ma profilu; papierowe zaświadczenie z systemu, gdy wystawienie elektroniczne nie jest
//   możliwe, lekarz przesyła je do ZUS w 3 dni robocze), art. 58 ust. 1 (płatnik z profilem widzi zaświadczenie najpóźniej
//   w dniu następującym po dniu, w którym ZUS je otrzymał), art. 58 ust. 5 (płatnik bez profilu informuje na piśmie
//   o obowiązku dostarczania wydruku), art. 62 ust. 1 (komu dostarcza się wydruk; bez terminu i bez obniżenia zasiłku);
// - Kodeks pracy (t.j. Dz.U. 2026 poz. 1245): art. 108 § 1 (kara upomnienia albo nagany za nieprzestrzeganie przyjętego
//   sposobu usprawiedliwiania nieobecności).
//
// Interpretacje (opisane w „Jak liczymy” na stronie):
// - dni z § 7 to dni kalendarzowe (rozporządzenie mówi o „dniach” i „dniach wolnych od pracy” osobno, § 4 ust. 1: okres
//   określa się liczbą dni), więc weekend przed wizytą wlicza się do 3 dni;
// - „4. dnia po dniu badania” = dzień badania + 4;
// - „drugi dzień nieobecności” liczymy jako dzień po pierwszym dniu nieobecności, także gdy wypada w dzień wolny według
//   grafiku: przepis nie mówi, czy dni wolne się liczą, a ta data jest najwcześniejsza z możliwych (wariant bezpieczny);
// - czy wyniki badania „niewątpliwie” potwierdzają wcześniejszą niezdolność, ocenia lekarz: narzędzie podaje tylko granice.
import { DNI_TYGODNIA } from './doba-pracownicza';
import { dataPoPolsku, dniMiedzy, dodajDni, dzienWolnyArt115, poprawnaData } from './terminy';
import { odmiana } from '../redakcja';

/** Najwięcej dni przed dniem badania (§ 7 ust. 3). */
export const WSTECZ_DNI = 3;
/** Najpóźniejszy początek zwolnienia: ten dzień po dniu badania (§ 7 ust. 2). */
export const PO_BADANIU_MAKS = 4;

export type Lekarz = 'inny' | 'psychiatra';

/** Gdzie wypada początek nieobecności względem wizyty u lekarza. */
export type Polozenie = 'przed-granica' | 'wstecz' | 'zwykle' | 'pozniej-warunek' | 'za-pozno';

export const dzienTygodnia = (data: string) => DNI_TYGODNIA[new Date(`${data}T00:00:00Z`).getUTCDay()];
/** „piątek, 13 listopada 2026 r.” */
export const dataZDniem = (data: string) => `${dzienTygodnia(data)}, ${dataPoPolsku(data)}`;

export interface GraniceL4 {
  /** Najwcześniejszy początek zwolnienia u lekarza innego niż psychiatra: 3 dni przed dniem badania. */
  najwczesniej: string;
  /** Najpóźniejszy początek bez warunków: dzień po dniu badania. */
  najpozniejZwykle: string;
  /** Najpóźniejszy początek przy dniach wolnych po badaniu albo badaniu w trakcie zwolnienia. */
  najpozniejWarunek: string;
}

export function granice(badanie: string): GraniceL4 {
  if (!poprawnaData(badanie)) throw new RangeError(`Błędna data badania: ${badanie}`);
  return {
    najwczesniej: dodajDni(badanie, -WSTECZ_DNI),
    najpozniejZwykle: dodajDni(badanie, 1),
    najpozniejWarunek: dodajDni(badanie, PO_BADANIU_MAKS),
  };
}

/** Położenie pierwszego dnia nieobecności względem dnia badania (różnica w dniach kalendarzowych). */
export function polozenie(badanie: string, poczatek: string): { polozenie: Polozenie; roznica: number } {
  if (!poprawnaData(badanie) || !poprawnaData(poczatek)) throw new RangeError('Błędna data');
  const roznica = dniMiedzy(badanie, poczatek);
  const p: Polozenie =
    roznica < -WSTECZ_DNI ? 'przed-granica' : roznica < 0 ? 'wstecz' : roznica <= 1 ? 'zwykle' : roznica <= PO_BADANIU_MAKS ? 'pozniej-warunek' : 'za-pozno';
  return { polozenie: p, roznica };
}

/** Ostatni dzień na zawiadomienie pracodawcy: drugi dzień nieobecności (§ 2 ust. 2), liczony kalendarzowo. */
export const terminZawiadomienia = (poczatek: string) => dodajDni(poczatek, 1);

export interface OpisL4 {
  werdykt: string;
  opis: string;
  odKiedy: string;
  doKiedy: string;
  zawiadomEtykieta: string;
  zawiadom: string;
  uwagi: string[];
}

const dni = (n: number) => odmiana(n, ['dzień', 'dni', 'dni']);

/**
 * Teksty wyniku dla strony i skryptu (jedna funkcja, żeby HTML z buildu i przeliczenie w przeglądarce mówiły to samo).
 * @param badanie dzień wizyty u lekarza (badania)
 * @param poczatek pierwszy dzień nieobecności w pracy z powodu choroby
 * @param dzis dzisiejsza data w Polsce (do tego, czy termin zawiadomienia już minął albo nieobecność dopiero będzie)
 */
export function opisL4(badanie: string, poczatek: string, lekarz: Lekarz, dzis: string): OpisL4 {
  const g = granice(badanie);
  const { polozenie: p, roznica } = polozenie(badanie, poczatek);
  const uwagi: string[] = [];
  let werdykt: string;
  let opis: string;
  if (p === 'przed-granica') {
    const poza = dniMiedzy(poczatek, g.najwczesniej);
    if (lekarz === 'psychiatra') {
      werdykt = 'Tylko w jednej sytuacji';
      opis = `To ${dni(-roznica)} przed wizytą. Psychiatra może objąć zwolnieniem okres wcześniejszy niż 3 dni, gdy stwierdza albo podejrzewa zaburzenia psychiczne ograniczające zdolność oceny własnego postępowania (§ 7 ust. 4). Przepis nie podaje granicy. W innych przypadkach zwolnienie może zacząć się najwyżej 3 dni przed dniem badania (§ 7 ust. 3).`;
    } else {
      werdykt = 'Nie, tak daleko L4 nie sięga';
      opis = `To ${dni(-roznica)} przed wizytą, a zwolnienie może objąć najwyżej 3 dni przed dniem badania (§ 7 ust. 3). ${poza === 1 ? `Dzień ${dataPoPolsku(poczatek)} zostanie` : `Od ${dataPoPolsku(poczatek)} do ${dataPoPolsku(dodajDni(g.najwczesniej, -1))} (${dni(poza)}) zostanie`} bez zwolnienia lekarskiego. Granica 3 dni nie dotyczy pobytu w szpitalu: zwolnienie obejmuje go od dnia przyjęcia do dnia wypisu (§ 4 ust. 2, § 10 ust. 1).`;
    }
  } else if (p === 'wstecz') {
    werdykt = 'Tak, jeśli badanie to potwierdzi';
    opis = `To ${dni(-roznica)} przed wizytą. Zwolnienie może objąć najwyżej 3 dni przed dniem badania, jeśli jego wyniki niewątpliwie wykażą, że już wtedy była niezdolność do pracy (§ 7 ust. 3). Ocenia to lekarz.`;
  } else if (p === 'zwykle') {
    werdykt = 'Tak';
    opis = roznica === 0 ? 'Zwolnienie może zacząć się w dniu badania (§ 7 ust. 1).' : 'Zwolnienie może zacząć się w dniu następującym po dniu badania (§ 7 ust. 1).';
  } else if (p === 'pozniej-warunek') {
    werdykt = 'Tylko w dwóch sytuacjach';
    opis = `To ${roznica}. dzień po wizycie. Tak późny początek jest możliwy tylko wtedy, gdy zaraz po dniu badania są dni wolne od pracy albo gdy badanie odbywa się w trakcie wcześniejszego zwolnienia (§ 7 ust. 2).`;
  } else {
    werdykt = 'Nie, to za daleko od wizyty';
    opis = `To ${dni(roznica)} po dniu wizyty, a zwolnienie może zacząć się najpóźniej 4. dnia po dniu badania (§ 7 ust. 2). Na zwolnienie od tej daty wizyta musiałaby się odbyć najwcześniej ${dataPoPolsku(dodajDni(poczatek, -1))} (dzień przed początkiem), a przy dniach wolnych zaraz po wizycie albo w trakcie wcześniejszego L4 najwcześniej ${dataPoPolsku(dodajDni(poczatek, -PO_BADANIU_MAKS))} (4 dni przed początkiem).`;
  }

  const termin = terminZawiadomienia(poczatek);
  let zawiadomEtykieta = 'Zawiadom pracodawcę';
  let zawiadom = `niezwłocznie, najpóźniej ${dataZDniem(termin)} (drugi dzień nieobecności)`;
  if (poczatek > dzis) {
    zawiadom = `niezwłocznie, najpóźniej ${dataZDniem(termin)}; gdy przyczynę znasz z góry, uprzedź przed ${dataPoPolsku(poczatek)} (§ 2 ust. 1)`;
  } else if (termin < dzis) {
    zawiadomEtykieta = 'Termin zawiadomienia minął';
    zawiadom = `${dataZDniem(termin)}; zawiadom od razu. Spóźnienie może usprawiedliwić np. obłożna choroba połączona z brakiem domowników albo inne zdarzenie losowe (§ 2 ust. 3)`;
  }
  const wolny = dzienWolnyArt115(termin);
  if (wolny && !(termin < dzis)) {
    uwagi.push(`${dataPoPolsku(termin)} to ${wolny}. Przepis nie mówi, czy dzień, w którym nie masz pracować, liczy się jako dzień nieobecności, więc bezpieczniej zawiadomić do tej daty.`);
  }
  return {
    werdykt,
    opis,
    odKiedy:
      lekarz === 'psychiatra'
        ? `${dataZDniem(g.najwczesniej)} (3 dni przed wizytą); psychiatra w jednej sytuacji wcześniej`
        : `${dataZDniem(g.najwczesniej)} (3 dni przed wizytą)`,
    doKiedy: `${dataZDniem(g.najpozniejZwykle)}; do ${dataPoPolsku(g.najpozniejWarunek)} przy dniach wolnych zaraz po wizycie albo w trakcie wcześniejszego L4`,
    zawiadomEtykieta,
    zawiadom,
    uwagi,
  };
}

export type BladDat = 'brak-badania' | 'brak-poczatku';
export const KOMUNIKATY: Record<BladDat, string> = {
  'brak-badania': 'Wpisz dzień wizyty u lekarza.',
  'brak-poczatku': 'Wpisz pierwszy dzień nieobecności w pracy.',
};
