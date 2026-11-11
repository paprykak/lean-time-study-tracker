// Ekwiwalent pieniężny za niewykorzystany urlop wypoczynkowy (art. 171 Kp) według rozporządzenia z 8 stycznia 1997 r.
// (Dz.U. 1997 nr 2 poz. 14 ze zm.: 2003 poz. 2290 i 2009 poz. 1353; ostatnia zmiana według API Sejmu z 2009 r.):
// § 15 składniki stałe w wysokości z miesiąca nabycia prawa, § 16 zmienne miesięczne średnio z 3 miesięcy, § 17 składniki
// za okresy dłuższe niż miesiąc średnio z 12 miesięcy, § 18 ekwiwalent za dzień = suma / współczynnik, za godzinę = za
// dzień / dobowa norma, razem = za godzinę × godziny urlopu, § 19 współczynnik = (dni roku − niedziele, święta i dni
// wolne z przeciętnie pięciodniowego tygodnia) / 12, przy niepełnym etacie obniżony proporcjonalnie (ust. 3).
import { wymiarMiesiaca } from './czas-pracy';
import { doGrosza } from './dodatek-nocny';

/** Dni pracy w roku przy pełnym etacie: dni roku minus niedziele, święta i dni wolne z pięciodniowego tygodnia. */
export function dniPracyWRoku(rok: number): number {
  let godziny = 0;
  for (let m = 1; m <= 12; m++) godziny += wymiarMiesiaca(rok, m).godziny;
  return godziny / 8;
}

/** Współczynnik z § 19 ust. 2. Przepis nie każe go zaokrąglać, więc liczymy na wartości dokładnej. */
export const wspolczynnik = (rok: number) => dniPracyWRoku(rok) / 12;

export interface DaneEkwiwalentu {
  rok: number;
  /** Składniki stałe w stawce miesięcznej (§ 15), zł. */
  stale: number;
  /** Średnia miesięczna składników zmiennych z 3 miesięcy (§ 16), zł. */
  zmienne?: number;
  /** Suma składników za okresy dłuższe niż miesiąc wypłaconych w 12 miesiącach (§ 17), zł. */
  dluzsze12?: number;
  /** Wymiar etatu, np. 1, 0.5, 0.75. */
  etat?: number;
  /** Dobowa norma czasu pracy w godzinach (8, a np. 7 przy znacznym lub umiarkowanym stopniu niepełnosprawności). */
  norma?: number;
  /** Godziny niewykorzystanego urlopu. */
  godzinyUrlopu: number;
}

export function ekwiwalent(d: DaneEkwiwalentu) {
  const etat = d.etat ?? 1;
  const norma = d.norma ?? 8;
  const zmienne = d.zmienne ?? 0;
  const dluzsze = (d.dluzsze12 ?? 0) / 12;
  if (!(d.stale >= 0) || !(zmienne >= 0) || !(dluzsze >= 0)) throw new RangeError('Kwoty nie mogą być ujemne');
  if (!(etat > 0 && etat <= 1)) throw new RangeError('Etat od 0 do 1');
  if (!(norma > 0 && norma <= 8)) throw new RangeError('Norma dobowa do 8 godzin');
  if (!(d.godzinyUrlopu >= 0)) throw new RangeError('Godziny urlopu nie mogą być ujemne');
  const podstawa = d.stale + zmienne + dluzsze;
  const wsp = wspolczynnik(d.rok) * etat;
  const zaDzien = podstawa / wsp;
  const zaGodzine = zaDzien / norma;
  return {
    podstawa: doGrosza(podstawa),
    wspolczynnik: wsp,
    zaDzien: doGrosza(zaDzien),
    zaGodzine: doGrosza(zaGodzine),
    kwota: doGrosza(zaGodzine * d.godzinyUrlopu),
  };
}
