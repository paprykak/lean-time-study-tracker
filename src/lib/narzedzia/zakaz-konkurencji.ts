// Odszkodowanie za zakaz konkurencji po ustaniu stosunku pracy (art. 101^2 § 3 Kp): nie mniej niż 25% wynagrodzenia
// otrzymanego przed ustaniem pracy za okres równy okresowi zakazu; może być płacone w miesięcznych ratach. Umowa wymaga
// formy pisemnej pod rygorem nieważności (art. 101^3). Zakaz przestaje obowiązywać, gdy ustaną jego przyczyny albo
// pracodawca nie płaci odszkodowania (art. 101^2 § 2). Odszkodowanie nie jest zwolnione z PIT (art. 21 ust. 1 pkt 3 lit. d).
import { doGrosza } from './dodatek-nocny';

export const MINIMUM_PROCENT = 25;

export interface DaneZakazu {
  /** Przeciętne miesięczne wynagrodzenie brutto przed ustaniem pracy. */
  pensja: number;
  miesiace: number;
  /** Procent z umowy; nie mniej niż 25. */
  procent?: number;
}

export function odszkodowanieZaZakaz(d: DaneZakazu) {
  if (!(d.pensja > 0)) throw new RangeError('Pensja musi być dodatnia');
  if (!(Number.isInteger(d.miesiace) && d.miesiace >= 1 && d.miesiace <= 60)) throw new RangeError('Miesiące: od 1 do 60');
  const procent = d.procent ?? MINIMUM_PROCENT;
  const minimum = doGrosza(((d.pensja * MINIMUM_PROCENT) / 100) * d.miesiace);
  const razem = doGrosza(((d.pensja * procent) / 100) * d.miesiace);
  return {
    minimum,
    minimumMiesiecznie: doGrosza((d.pensja * MINIMUM_PROCENT) / 100),
    razem,
    miesiecznie: doGrosza((d.pensja * procent) / 100),
    zgodne: procent >= MINIMUM_PROCENT,
  };
}
