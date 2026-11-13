// Urlop wychowawczy (art. 186 Kp): do 36 miesięcy łącznie dla obojga rodziców (§ 2 i § 3^1), najpóźniej do końca roku
// kalendarzowego, w którym dziecko kończy 6 lat (§ 2), każdemu z rodziców wyłącznie 1 miesiąc (§ 4), cały wymiar dla
// jedynego uprawnionego rodzica albo opiekuna (§ 9 i § 10), wniosek co najmniej 21 dni przed (§ 7), najwyżej 5 części (§ 8),
// po co najmniej 6 miesiącach zatrudnienia (§ 1). Miesiące urlopu liczymy kalendarzowo (art. 112 KC,
// `koniecOkresu`): od 1 stycznia na 12 miesięcy do 31 grudnia, od 31 stycznia na miesiąc do 28 lutego.
import { dodajDni, koniecOkresu } from './terminy';

export const WYMIAR_MIESIECY = 36;
export const MIESIAC_WYLACZNY = 1;
export const DNI_WNIOSKU = 21;

export interface DaneWychowawczego {
  urodzenie: string;
  start: string;
  miesiace: number;
  /** Miesiące już wykorzystane przez Ciebie i przez drugiego rodzica. */
  wykorzystaneJa: number;
  wykorzystaneDrugi: number;
  /** Jedyny uprawniony rodzic albo opiekun (art. 186 § 9 i 10). */
  jedyny: boolean;
}

export function urlopWychowawczy(d: DaneWychowawczego) {
  for (const n of [d.miesiace, d.wykorzystaneJa, d.wykorzystaneDrugi])
    if (!(Number.isInteger(n) && n >= 0 && n <= WYMIAR_MIESIECY)) throw new RangeError('Miesiące: liczba całkowita od 0 do 36');
  const limitDo = `${Number(d.urodzenie.slice(0, 4)) + 6}-12-31`;
  if (d.start < d.urodzenie) throw new RangeError('Urlop nie może zacząć się przed urodzeniem dziecka');
  if (d.start > limitDo) throw new RangeError('Po końcu roku, w którym dziecko kończy 6 lat');
  const pula = Math.max(0, WYMIAR_MIESIECY - d.wykorzystaneJa - d.wykorzystaneDrugi);
  const zarezerwowane = d.jedyny || d.wykorzystaneDrugi >= MIESIAC_WYLACZNY ? 0 : MIESIAC_WYLACZNY;
  const dostepne = Math.max(0, pula - zarezerwowane);
  const miesiace = Math.min(d.miesiace, dostepne);
  const koniecPlanu = koniecOkresu(d.start, miesiace);
  const koniec = koniecPlanu > limitDo ? limitDo : koniecPlanu;
  return {
    limitDo,
    dostepne,
    zarezerwowane,
    miesiace,
    koniec,
    skroconyLimitem: koniecPlanu > limitDo,
    skroconyWymiarem: d.miesiace > dostepne,
    wniosekDo: dodajDni(d.start, -DNI_WNIOSKU),
  };
}
