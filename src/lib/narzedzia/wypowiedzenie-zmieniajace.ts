// Wypowiedzenie zmieniające (art. 42 Kodeksu pracy, t.j. Dz.U. 2026 poz. 1245): przepisy o wypowiedzeniu umowy stosuje
// się odpowiednio (§ 1), wypowiedzenie jest dokonane, gdy pracownikowi zaproponowano na piśmie nowe warunki (§ 2).
// Odmowa: umowa rozwiązuje się z upływem okresu wypowiedzenia; brak odmowy przed upływem połowy okresu = zgoda;
// bez pouczenia o tym odmowę można złożyć do końca okresu (§ 3). Okres: art. 36 § 1 (2 tygodnie, 1 miesiąc, 3 miesiące
// według stażu), koniec w sobotę albo ostatniego dnia miesiąca (art. 30 § 2^1), jak w wypowiedzenie.ts (wypowiedzenieStalej:
// gdy próg stażu przypada w trakcie wypowiedzenia, okres dłuższy; termin na odmowę liczymy wtedy od krótszego okresu). Odwołanie do sądu
// pracy: 21 dni od doręczenia (art. 264 § 1 przez art. 42 § 1), dnia doręczenia nie liczymy (art. 111 § 2 KC).
//
// Art. 115 KC (konwencja z terminy.ts, pakiet „terminy 2”, 2026-11-15): odmowa i odwołanie to czynności pracownika, więc
// gdy ostatni dzień wypada w sobotę albo dzień ustawowo wolny, pokazujemy „Zdąż do” (bez przesunięcia) i „Ostatni dzień
// według art. 115 KC” (`terminPracownika`). Odwołanie: zdanie dla pozwu do sądu (`zdanieArt115(…, 'sad')`). Odmowa to
// oświadczenie składane pracodawcy, skuteczne z chwilą, gdy do niego dojdzie (art. 61 § 1 KC): własne zdanie
// (`ODMOWA_ART_115`), bo orzeczeń o art. 115 przy art. 42 § 3 nie znaleźliśmy (raporty/terminy2/PRZEPISY.md).
// Przesunięcie liczymy od dnia „zdąż do” (ostatniego dnia w całości przed połową); gdy połowa wypada w środku
// następnego dnia, a ten jest wolny, drugiej daty nie podajemy (wariant wcześniejszy, bezpieczny).
//
// Połowa okresu wypowiedzenia: przepis nie mówi, od którego dnia liczyć okres. Liczymy dwa warianty:
// (A) od dnia po doręczeniu do końca okresu, (B) od pierwszego dnia pełnego tygodnia (niedziela) albo miesiąca
// (1. dzień), od którego art. 30 § 2^1 liczy okres (wypowiedzenie.ts). Bezpieczny termin to ostatni dzień, który w całości
// mieści się w pierwszej połowie wcześniejszego wariantu (A): przy nieparzystej liczbie dni (np. 31) połowa wypada
// w środku dnia, więc ten dzień już się nie liczy. Wariant B pokazujemy jako drugą wykładnię.
import { koniecWypowiedzenia, wypowiedzenieStalej, type Okres } from './wypowiedzenie';
import {
  ETYKIETA_ART_115,
  ETYKIETA_ZDAZ_DO,
  ZDANIE_ART_115,
  dataPoPolsku,
  dniMiedzy,
  dodajDni,
  fazaTerminu,
  poprawnaData,
  terminPracownika,
  zdanieArt115,
  zostaloDni,
  type TerminPracownika,
} from './terminy';

export interface WypowiedzenieZmieniajace {
  stazMiesiecy: number;
  okres: Okres;
  /** Ostatni dzień okresu wypowiedzenia: przy odmowie ostatni dzień umowy. */
  koniec: string;
  /** Pierwszy dzień nowych warunków, gdy pracownik ich nie odrzuci. */
  noweWarunkiOd: string;
  /** Pierwszy dzień okresu w wariancie B (niedziela albo 1. dzień miesiąca po doręczeniu); przy progu stażu z krótszego okresu. */
  poczatekPelnegoOkresu: string;
  /** Ostatni bezpieczny dzień na odmowę (wariant A); bez pouczenia: koniec okresu, a przy progu stażu koniec krótszego. */
  odmowaDo: string;
  /** Ostatni dzień pierwszej połowy w wariancie B (druga wykładnia); przy progu stażu z krótszego okresu. */
  odmowaDoWariantB: string;
  /** Dni okresu w wariantach A i B (przy progu stażu: krótszego okresu, od którego liczymy odmowę). */
  dniA: number;
  dniB: number;
  pouczenie: boolean;
  /** Próg stażu (6 albo 36 miesięcy) w trakcie wypowiedzenia: okres wydłużony, odmowa liczona od krótszego. */
  prog: { miesiace: 6 | 36; dzien: string; krotszy: string; krotszyKoniec: string } | null;
  /** Termin na odmowę jako termin pracownika: `zdazDo` = `odmowaDo`, `wedlugArt115` po przesunięciu z dnia wolnego. */
  odmowa: TerminPracownika;
  /** Odwołanie do sądu pracy: 21 dni od doręczenia (art. 264 § 1), bez przesunięcia i według art. 115 KC. */
  odwolanie: TerminPracownika;
}

/** Ostatni dzień, który w całości leży przed upływem połowy okresu od `pierwszy` do `ostatni` (włącznie). */
export function ostatniDzienPrzedPolowa(pierwszy: string, ostatni: string): string {
  const dni = dniMiedzy(pierwszy, ostatni) + 1;
  return dodajDni(pierwszy, Math.floor(dni / 2) - 1);
}

export function wypowiedzenieZmieniajace(poczatekPracy: string, doreczenie: string, pouczenie = true): WypowiedzenieZmieniajace {
  if (!poprawnaData(poczatekPracy) || !poprawnaData(doreczenie)) throw new Error('Wpisz obie daty.');
  if (doreczenie < poczatekPracy) throw new Error('Doręczenie nie może być przed rozpoczęciem pracy.');
  const w = wypowiedzenieStalej(poczatekPracy, doreczenie);
  const { okres, koniec } = w;
  const stazMiesiecy = w.staz;
  const poczatekA = dodajDni(doreczenie, 1);
  // Gdy próg stażu przypada w trakcie wypowiedzenia, okres się wydłuża (jak w wypowiedzenie.ts), ale termin na odmowę
  // liczymy też od krótszego okresu i podajemy wcześniejszy: odmowa złożona do tego dnia jest w terminie w obu wariantach.
  // Oba warianty połowy (A i B) liczymy od tego samego, krótszego okresu.
  const koniecDoOdmowy = w.prog ? w.prog.krotszyKoniec : koniec;
  const okresDoOdmowy = w.prog ? w.prog.krotszy : okres;
  const poczatekB = okresDoOdmowy.jednostka === 'tydzien' ? dodajDni(koniecDoOdmowy, -7 * okresDoOdmowy.ile + 1) : pierwszyDzienMiesiacaPo(doreczenie);
  const odmowaA = ostatniDzienPrzedPolowa(poczatekA, koniecDoOdmowy);
  // Bez pouczenia odmowa do końca okresu wypowiedzenia (art. 42 § 3 zd. 3); przy progu stażu do końca krótszego okresu.
  const odmowaDo = pouczenie ? odmowaA : koniecDoOdmowy;
  return {
    stazMiesiecy,
    okres,
    koniec,
    noweWarunkiOd: dodajDni(koniec, 1),
    poczatekPelnegoOkresu: poczatekB,
    odmowaDo,
    odmowaDoWariantB: ostatniDzienPrzedPolowa(poczatekB, koniecDoOdmowy),
    dniA: dniMiedzy(poczatekA, koniecDoOdmowy) + 1,
    dniB: dniMiedzy(poczatekB, koniecDoOdmowy) + 1,
    pouczenie,
    prog: w.prog ? { miesiace: w.prog.miesiace, dzien: w.prog.dzien, krotszy: w.prog.krotszy.opis, krotszyKoniec: w.prog.krotszyKoniec } : null,
    // Bez pouczenia termin to koniec okresu wypowiedzenia (art. 42 § 3 zd. 3): to granica okresu, po której obowiązują
    // nowe warunki, więc drugiej daty z art. 115 KC nie podajemy (weryfikacja prawna P-1).
    odmowa: pouczenie ? terminPracownika(odmowaDo) : { zdazDo: odmowaDo, wedlugArt115: odmowaDo, rozne: false, wolne: [] },
    odwolanie: terminPracownika(dodajDni(doreczenie, DNI_ODWOLANIA)),
  };
}

/** Art. 264 § 1 Kp: 21 dni od doręczenia pisma. */
export const DNI_ODWOLANIA = 21;

/** Drugie zdanie pod datą z art. 115 KC przy odmowie (zamiast zdania o sprzeciwie od kary z terminy.ts). */
export const ODMOWA_ART_115 =
  'Czy to przesunięcie działa przy odmowie nowych warunków, przepisy wprost nie mówią, a orzeczeń o tym nie znaleźliśmy. Odmowa jest złożona dopiero wtedy, gdy dotrze do pracodawcy tak, że może się z nią zapoznać (art. 61 § 1 Kodeksu cywilnego), a spóźniona oznacza zgodę na nowe warunki, więc zdąż do pierwszej daty.';

export interface OpisZmieniajacego {
  /** Nagłówek wyniku: „Odmowę złóż najpóźniej” albo „Odmowa: zdąż do”, gdy art. 115 KC daje późniejszą datę. */
  odmowaEtykieta: string;
  odmowa: string;
  /** Data odmowy według art. 115 KC, gdy inna niż `odmowa`. */
  odmowaArt115: string | null;
  odmowaZdanie: string;
  status: string;
  statusKlasa: 'w-terminie' | 'wkrotce' | 'pilne' | 'po-terminie';
  okres: string;
  prog: string | null;
  koniec: string;
  nowe: string;
  wariantB: string;
  /** Odwołanie do sądu pracy: etykieta („… do” albo „…: zdąż do” przy dwóch datach), data i data według art. 115 KC, gdy inna. */
  odwolanieEtykieta: string;
  odwolanieArt115Etykieta: string;
  odwolanie: string;
  odwolanieArt115: string | null;
  odwolanieZdanie: string;
  uwaga: string;
}

const UWAGA_POUCZENIE =
  'Odmowa złożona później może zostać uznana za spóźnioną, a wtedy przyjmujesz nowe warunki (art. 42 § 3 Kodeksu pracy). Liczy się dzień, w którym odmowa dotrze do pracodawcy.';

/** Teksty wyniku: te same w HTML ze strony i w skrypcie przeglądarki (skrypt przepuszcza je przez typografia()). */
export function opisZmieniajacego(r: WypowiedzenieZmieniajace, dzis: string): OpisZmieniajacego {
  const f = fazaTerminu(r.odmowa, dzis);
  let status: string;
  let statusKlasa: OpisZmieniajacego['statusKlasa'];
  if (f.faza === 'w-terminie') {
    status = f.dni === 0 ? 'To dziś: odmowa musi dziś dotrzeć do pracodawcy' : zostaloDni(f.dni);
    statusKlasa = f.dni <= 3 ? 'wkrotce' : 'w-terminie';
  } else if (f.faza === 'tylko-art-115') {
    status = `Pierwsza data minęła; ostatni dzień według art. 115 KC: ${f.dni === 0 ? 'dziś' : dataPoPolsku(r.odmowa.wedlugArt115)}`;
    statusKlasa = 'pilne';
  } else {
    status = 'Termin na odmowę minął';
    statusKlasa = 'po-terminie';
  }
  const zdanieOdmowy = zdanieArt115(r.odmowa, 'pracodawca');
  return {
    odmowaEtykieta: r.odmowa.rozne ? `Odmowa: ${ETYKIETA_ZDAZ_DO.toLowerCase()}` : 'Odmowę złóż najpóźniej',
    odmowa: dataPoPolsku(r.odmowa.zdazDo),
    odmowaArt115: r.odmowa.rozne ? dataPoPolsku(r.odmowa.wedlugArt115) : null,
    odmowaZdanie: zdanieOdmowy && zdanieOdmowy.replace(ZDANIE_ART_115.pracodawca, ODMOWA_ART_115),
    status,
    statusKlasa,
    okres: r.okres.opis,
    prog: r.prog ? tekstProgu(r.prog) : null,
    koniec: dataPoPolsku(r.koniec),
    nowe: dataPoPolsku(r.noweWarunkiOd),
    wariantB: r.pouczenie ? dataPoPolsku(r.odmowaDoWariantB) : 'nie dotyczy (bez pouczenia)',
    odwolanieEtykieta: r.odwolanie.rozne ? `Odwołanie do sądu pracy: ${ETYKIETA_ZDAZ_DO.toLowerCase()}` : 'Odwołanie do sądu pracy do',
    odwolanieArt115Etykieta: `Odwołanie: ${ETYKIETA_ART_115.charAt(0).toLowerCase()}${ETYKIETA_ART_115.slice(1)}`,
    odwolanie: dataPoPolsku(r.odwolanie.zdazDo),
    odwolanieArt115: r.odwolanie.rozne ? dataPoPolsku(r.odwolanie.wedlugArt115) : null,
    odwolanieZdanie: zdanieArt115(r.odwolanie, 'sad'),
    uwaga: r.pouczenie
      ? UWAGA_POUCZENIE
      : `Bez pouczenia możesz odmówić do końca okresu wypowiedzenia (art. 42 § 3 zdanie trzecie Kodeksu pracy). Tego dnia nie przesuwamy z soboty ani dnia wolnego: następnego dnia obowiązują już nowe warunki.${r.prog ? ' Staż osiąga próg w trakcie wypowiedzenia, więc okres się wydłuża (art. 42 § 1 Kodeksu pracy, wyrok Sądu Najwyższego I PKN 34/99), ale termin na odmowę liczymy od krótszego okresu.' : ''} Liczy się dzień, w którym odmowa dotrze do pracodawcy.`,
  };
}

/** Wiersz wyniku o progu stażu (jeden tekst dla HTML i skryptu strony). */
export function tekstProgu(prog: NonNullable<WypowiedzenieZmieniajace['prog']>): string {
  return `${prog.miesiace === 6 ? '6 miesięcy stażu mija' : '3 lata stażu mijają'} ${dataPoPolsku(prog.dzien)}; odmowę liczymy od krótszego okresu (${prog.krotszy})`;
}

function pierwszyDzienMiesiacaPo(data: string): string {
  const [r, m] = data.split('-').map(Number);
  return new Date(Date.UTC(r, m, 1)).toISOString().slice(0, 10);
}
