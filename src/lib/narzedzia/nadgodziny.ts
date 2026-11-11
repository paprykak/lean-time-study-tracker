// Nadgodziny: dodatek 100% i 50% (art. 151^1 § 1–2 Kp), podstawa dodatku (art. 151^1 § 3), stawka za godzinę przy
// pensji miesięcznej: stawka podzielona przez liczbę godzin do przepracowania w danym miesiącu (§ 4a rozporządzenia
// w sprawie sposobu ustalania wynagrodzenia w okresie niewykonywania pracy…, t.j. Dz.U. 2017 poz. 927).
// Czas wolny zamiast dodatku: 1:1 na wniosek pracownika, 1,5:1 bez wniosku (art. 151^2). Limit 150 h rocznie (art. 151 § 3).
import { doGrosza } from './dodatek-nocny';
import { wymiarMiesiaca } from './czas-pracy';

export type Wynagrodzenie =
  | { rodzaj: 'godzinowa'; stawka: number }
  | { rodzaj: 'miesieczna'; kwota: number; rok: number; miesiac: number }
  /** Bez wyodrębnionej stawki zasadniczej: podstawą jest 60% wynagrodzenia (art. 151^1 § 3). */
  | { rodzaj: 'bez-zaszeregowania'; kwota: number; rok: number; miesiac: number };

export interface DaneNadgodzin {
  wynagrodzenie: Wynagrodzenie;
  /** Godziny z dodatkiem 100%: w nocy, w niedziele i święta wolne według rozkładu, w dniu wolnym za niedzielę lub święto, ponad normę tygodniową. */
  godziny100: number;
  /** Godziny z dodatkiem 50%: w pozostałe dni. */
  godziny50: number;
}

export interface WynikNadgodzin {
  /** Podstawa dodatku za godzinę, zł. */
  stawka: number;
  /** Wymiar miesiąca, gdy stawka wynika z pensji. */
  wymiar: number | null;
  dodatek100: number;
  dodatek50: number;
  /** Normalne wynagrodzenie za godziny nadliczbowe liczone tą samą stawką. */
  normalne: number;
  razem: number;
  /** Czas wolny zamiast dodatku (godziny): na wniosek 1:1, bez wniosku 1,5:1. */
  wolneNaWniosek: number;
  wolneBezWniosku: number;
}

export const LIMIT_ROCZNY = 150;

export function nadgodziny({ wynagrodzenie: w, godziny100, godziny50 }: DaneNadgodzin): WynikNadgodzin {
  if (!(godziny100 >= 0) || !(godziny50 >= 0)) throw new RangeError('Liczba godzin musi być nieujemna');
  let stawka: number;
  let wymiar: number | null = null;
  if (w.rodzaj === 'godzinowa') {
    if (!(w.stawka > 0)) throw new RangeError('Stawka musi być dodatnia');
    stawka = w.stawka;
  } else {
    if (!(w.kwota > 0)) throw new RangeError('Wynagrodzenie musi być dodatnie');
    wymiar = wymiarMiesiaca(w.rok, w.miesiac).godziny;
    const podstawa = w.rodzaj === 'bez-zaszeregowania' ? w.kwota * 0.6 : w.kwota;
    stawka = doGrosza(podstawa / wymiar);
  }
  const dodatek100 = doGrosza(stawka * godziny100);
  const dodatek50 = doGrosza(stawka * 0.5 * godziny50);
  const normalne = doGrosza(stawka * (godziny100 + godziny50));
  const suma = godziny100 + godziny50;
  return {
    stawka,
    wymiar,
    dodatek100,
    dodatek50,
    normalne,
    razem: doGrosza(dodatek100 + dodatek50 + normalne),
    wolneNaWniosek: suma,
    wolneBezWniosku: suma * 1.5,
  };
}
