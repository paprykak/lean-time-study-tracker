// Wynagrodzenie za czas urlopu (art. 172 Kp, rozporządzenie z 8 stycznia 1997 r. ze zm.): składniki stałe w stawce
// miesięcznej w wysokości z miesiąca urlopu (§ 7), składniki zmienne za okresy do miesiąca (premie miesięczne, dodatek
// nocny, nadgodziny, a przy stawce godzinowej także wynagrodzenie zasadnicze) z 3 miesięcy przed miesiącem urlopu (§ 8),
// przeliczone na godzinę pracy i pomnożone przez godziny urlopu (§ 9 ust. 1 w brzmieniu z Dz.U. 2003 poz. 2290).
// Składniki za okresy dłuższe niż miesiąc wypłaca się w zwykłych terminach, a urlop liczy się jak czas pracy (§ 12).
import { doGrosza } from './dodatek-nocny';

export interface DaneUrlopowego {
  /** Suma składników zmiennych wypłaconych w 3 miesiącach przed miesiącem urlopu. */
  zmienneSuma: number;
  /** Godziny przepracowane w tych miesiącach. */
  godzinyPrzepracowane: number;
  /** Godziny, które pracownik przepracowałby w czasie urlopu według grafiku. */
  godzinyUrlopu: number;
  /** Stała pensja miesięczna (nie zmienia się z powodu urlopu). */
  stala?: number;
}

export function wynagrodzenieUrlopowe(d: DaneUrlopowego) {
  if (!(d.zmienneSuma >= 0)) throw new RangeError('Suma składników nie może być ujemna');
  if (!(d.godzinyPrzepracowane > 0)) throw new RangeError('Podaj przepracowane godziny');
  if (!(d.godzinyUrlopu > 0)) throw new RangeError('Podaj godziny urlopu');
  const zaGodzine = d.zmienneSuma / d.godzinyPrzepracowane;
  return {
    zaGodzine: doGrosza(zaGodzine),
    zmiennaCzesc: doGrosza(zaGodzine * d.godzinyUrlopu),
    stala: d.stala ?? 0,
  };
}
