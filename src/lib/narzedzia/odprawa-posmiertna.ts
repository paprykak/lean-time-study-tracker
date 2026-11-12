// Odprawa pośmiertna (art. 93 Kp): przy śmierci pracownika w czasie zatrudnienia albo pobierania po jego końcu zasiłku
// chorobowego rodzinie należy się od pracodawcy 1, 3 albo 6 miesięcznych wynagrodzeń według stażu u tego pracodawcy
// (§ 2: krócej niż 10 lat, co najmniej 10, co najmniej 15). Dzieli się ją po równo (§ 5), a jedynej uprawnionej osobie
// należy się połowa (§ 6). Ubezpieczenie na życie opłacone przez pracodawcę zastępuje odprawę, gdy wypłata jest nie niższa;
// gdy niższa, pracodawca dopłaca różnicę (§ 7). Wynagrodzenie jak do ekwiwalentu za urlop (§ 2 ust. 1 pkt 8 rozporządzenia
// z 29 maja 1996 r., t.j. Dz.U. 2017 poz. 927). Wolna od PIT (art. 21 ust. 1 pkt 7 ustawy o PIT).
import { doGrosza } from './dodatek-nocny';

/** Ile miesięcznych wynagrodzeń według pełnych lat pracy u pracodawcy (art. 93 § 2). */
export const miesiecyPosmiertnej = (lata: number): 1 | 3 | 6 => (lata >= 15 ? 6 : lata >= 10 ? 3 : 1);

export interface DaneOdprawyPosmiertnej {
  /** Miesięczne wynagrodzenie liczone jak do ekwiwalentu za urlop. */
  pensja: number;
  /** Pełne lata pracy u tego pracodawcy. */
  lata: number;
  /** Liczba uprawnionych członków rodziny (§ 4). */
  osoby: number;
  /** Wypłata z ubezpieczenia na życie, które opłacał pracodawca (0, gdy go nie było). */
  ubezpieczenie?: number;
}

export function odprawaPosmiertna(d: DaneOdprawyPosmiertnej) {
  if (!(d.pensja > 0)) throw new RangeError('Pensja musi być dodatnia');
  if (!(Number.isInteger(d.lata) && d.lata >= 0 && d.lata <= 70)) throw new RangeError('Lata: od 0 do 70');
  if (!(Number.isInteger(d.osoby) && d.osoby >= 1 && d.osoby <= 20)) throw new RangeError('Osoby: od 1 do 20');
  const ubezpieczenie = d.ubezpieczenie ?? 0;
  if (!(ubezpieczenie >= 0)) throw new RangeError('Ubezpieczenie nie może być ujemne');
  const miesiace = miesiecyPosmiertnej(d.lata);
  const jednaOsoba = d.osoby === 1;
  const odprawa = doGrosza((d.pensja * miesiace) / (jednaOsoba ? 2 : 1));
  const doWyplaty = ubezpieczenie >= odprawa ? 0 : doGrosza(odprawa - ubezpieczenie);
  return { miesiace, jednaOsoba, odprawa, doWyplaty, naOsobe: doGrosza(doWyplaty / d.osoby) };
}
