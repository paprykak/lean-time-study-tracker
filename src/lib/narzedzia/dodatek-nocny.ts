// Dodatek za pracę w porze nocnej (art. 151^8 § 1 Kodeksu pracy): 20% stawki godzinowej wynikającej z minimalnego
// wynagrodzenia za każdą godzinę pracy w porze nocnej. Stawkę godzinową liczymy jak w objaśnieniu urzędowym
// (OBJASNIENIA.zpeDodatekNocny): minimalne wynagrodzenie dzielone przez wymiar czasu pracy w danym miesiącu.
// Zaokrąglamy do grosza na każdym kroku, tak jak w tym objaśnieniu (stawka, dodatek za godzinę, kwota).
import { PLACA_MINIMALNA } from '../../data/prawo';
import { wymiarMiesiaca, type WymiarMiesiaca } from './czas-pracy';

/** Ustawowe minimum dodatku w procentach (art. 151^8 § 1). Pracodawca może dać więcej. */
export const PROCENT_USTAWOWY = 20;

/**
 * Zaokrąglenie do grosza, połówki w górę. Najpierw 12 cyfr znaczących, żeby błąd zapisu binarnego nie zmienił
 * połówki: 6,01 × 7,5 to w liczbach zmiennoprzecinkowych 45,07499999…, a ma dać 45,08.
 */
export const doGrosza = (x: number) => Math.round(Number((x * 100).toPrecision(12))) / 100;

export interface DaneDodatku {
  rok: number;
  miesiac: number;
  /** Godziny pracy w porze nocnej w miesiącu. */
  godziny: number;
  /** Procent dodatku; domyślnie ustawowe 20. */
  procent?: number;
  /** Minimalne wynagrodzenie; domyślnie z rejestru przepisów dla roku. */
  placaMinimalna?: number;
}

export interface WynikDodatku {
  placaMinimalna: number;
  wymiar: WymiarMiesiaca;
  /** Stawka godzinowa z minimalnego wynagrodzenia, zł. */
  stawka: number;
  procent: number;
  /** Dodatek za jedną godzinę w porze nocnej, zł. */
  zaGodzine: number;
  godziny: number;
  /** Dodatek za wszystkie godziny w miesiącu, zł brutto. */
  kwota: number;
}

export function dodatekNocny({ rok, miesiac, godziny, procent = PROCENT_USTAWOWY, placaMinimalna }: DaneDodatku): WynikDodatku {
  const placa = placaMinimalna ?? PLACA_MINIMALNA[rok]?.miesiecznie;
  if (placa === undefined) throw new RangeError(`Brak minimalnego wynagrodzenia dla roku ${rok}`);
  if (!(godziny >= 0)) throw new RangeError('Liczba godzin musi być nieujemna');
  if (!(procent >= PROCENT_USTAWOWY)) throw new RangeError(`Dodatek nie może być niższy niż ${PROCENT_USTAWOWY}%`);
  const wymiar = wymiarMiesiaca(rok, miesiac);
  const stawka = doGrosza(placa / wymiar.godziny);
  const zaGodzine = doGrosza((stawka * procent) / 100);
  return { placaMinimalna: placa, wymiar, stawka, procent, zaGodzine, godziny, kwota: doGrosza(zaGodzine * godziny) };
}

/** Dodatek za godzinę w każdym miesiącu roku (tabela na stronie narzędzia, działa bez JavaScriptu). */
export function tabelaRoku(rok: number, procent = PROCENT_USTAWOWY): WynikDodatku[] {
  return Array.from({ length: 12 }, (_, i) => dodatekNocny({ rok, miesiac: i + 1, godziny: 8, procent }));
}
