// Wypowiedzenie zmieniające (art. 42 Kodeksu pracy, t.j. Dz.U. 2026 poz. 1245): przepisy o wypowiedzeniu umowy stosuje
// się odpowiednio (§ 1), wypowiedzenie jest dokonane, gdy pracownikowi zaproponowano na piśmie nowe warunki (§ 2).
// Odmowa: umowa rozwiązuje się z upływem okresu wypowiedzenia; brak odmowy przed upływem połowy okresu = zgoda;
// bez pouczenia o tym odmowę można złożyć do końca okresu (§ 3). Okres: art. 36 § 1 (2 tygodnie, 1 miesiąc, 3 miesiące
// według stażu), koniec w sobotę albo ostatniego dnia miesiąca (art. 30 § 2^1), jak w wypowiedzenie.ts (wypowiedzenieStalej:
// gdy próg stażu przypada w trakcie wypowiedzenia, okres dłuższy; termin na odmowę liczymy wtedy od krótszego okresu). Odwołanie do sądu
// pracy: 21 dni od doręczenia (art. 264 § 1 przez art. 42 § 1), z art. 111 § 2 i 115 KC jak w termin-odwolania.ts.
//
// Połowa okresu wypowiedzenia: przepis nie mówi, od którego dnia liczyć okres. Liczymy dwa warianty:
// (A) od dnia po doręczeniu do końca okresu, (B) od pierwszego dnia pełnego tygodnia (niedziela) albo miesiąca
// (1. dzień), od którego art. 30 § 2^1 liczy okres (wypowiedzenie.ts). Bezpieczny termin to ostatni dzień, który w całości
// mieści się w pierwszej połowie wcześniejszego wariantu (A): przy nieparzystej liczbie dni (np. 31) połowa wypada
// w środku dnia, więc ten dzień już się nie liczy. Wariant B pokazujemy jako drugą wykładnię.
import { koniecWypowiedzenia, wypowiedzenieStalej, type Okres } from './wypowiedzenie';
import { terminCzynnosci } from './termin-odwolania';
import { dniMiedzy, dodajDni, poprawnaData } from './terminy';

export interface WypowiedzenieZmieniajace {
  stazMiesiecy: number;
  okres: Okres;
  /** Ostatni dzień okresu wypowiedzenia: przy odmowie ostatni dzień umowy. */
  koniec: string;
  /** Pierwszy dzień nowych warunków, gdy pracownik ich nie odrzuci. */
  noweWarunkiOd: string;
  /** Pierwszy dzień okresu w wariancie B (niedziela albo 1. dzień miesiąca po doręczeniu). */
  poczatekPelnegoOkresu: string;
  /** Ostatni bezpieczny dzień na odmowę (wariant A); bez pouczenia: koniec okresu. */
  odmowaDo: string;
  /** Ostatni dzień pierwszej połowy w wariancie B (druga wykładnia). */
  odmowaDoWariantB: string;
  /** Dni okresu w wariantach A i B. */
  dniA: number;
  dniB: number;
  pouczenie: boolean;
  /** Próg stażu (6 albo 36 miesięcy) w trakcie wypowiedzenia: okres wydłużony, odmowa liczona od krótszego. */
  prog: { miesiace: 6 | 36; dzien: string; krotszy: string; krotszyKoniec: string } | null;
  /** Ostatni dzień na odwołanie do sądu pracy (21 dni, z przesunięciem z dnia wolnego). */
  odwolanieDo: string;
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
  const koniecDoOdmowy = w.prog ? w.prog.krotszyKoniec : koniec;
  const poczatekB = okres.jednostka === 'tydzien' ? dodajDni(koniec, -7 * okres.ile + 1) : pierwszyDzienMiesiacaPo(doreczenie);
  const odmowaA = ostatniDzienPrzedPolowa(poczatekA, koniecDoOdmowy);
  return {
    stazMiesiecy,
    okres,
    koniec,
    noweWarunkiOd: dodajDni(koniec, 1),
    poczatekPelnegoOkresu: poczatekB,
    odmowaDo: pouczenie ? odmowaA : koniec,
    odmowaDoWariantB: ostatniDzienPrzedPolowa(poczatekB, koniec),
    dniA: dniMiedzy(poczatekA, koniec) + 1,
    dniB: dniMiedzy(poczatekB, koniec) + 1,
    pouczenie,
    prog: w.prog ? { miesiace: w.prog.miesiace, dzien: w.prog.dzien, krotszy: w.prog.krotszy.opis, krotszyKoniec: w.prog.krotszyKoniec } : null,
    odwolanieDo: terminCzynnosci(doreczenie, 'wypowiedzenie').koniec,
  };
}

function pierwszyDzienMiesiacaPo(data: string): string {
  const [r, m] = data.split('-').map(Number);
  return new Date(Date.UTC(r, m, 1)).toISOString().slice(0, 10);
}
