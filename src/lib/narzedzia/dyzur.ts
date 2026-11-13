// Dyżur (art. 151^5 Kp): pozostawanie poza normalnymi godzinami pracy w gotowości do pracy w zakładzie albo w innym
// miejscu wyznaczonym przez pracodawcę. Czasu dyżuru nie wlicza się do czasu pracy, jeżeli pracownik nie pracował (§ 2).
// Za dyżur poza domem: czas wolny równy długości dyżuru, a gdy nie można go udzielić, wynagrodzenie z osobistego
// zaszeregowania (stawka godzinowa albo miesięczna), a bez wyodrębnionej stawki 60% wynagrodzenia (§ 3); za dyżur w domu
// nic. Nie dotyczy pracowników zarządzających zakładem (§ 4). Godzina: stawka miesięczna przez godziny do przepracowania
// w miesiącu (§ 4a rozporządzenia z 29 maja 1996 r.), 60% według zasad urlopowych: stałe składniki przez godziny w miesiącu,
// zmienne przez godziny przepracowane w okresie, z którego się je liczy (§ 4 ust. 1–2). W przeciwieństwie do przestoju
// (art. 81 § 1) przepis nie wprowadza minimum z płacy minimalnej. Godziny pracy w czasie dyżuru są czasem pracy (§ 2),
// więc rekompensatę liczymy za pozostałe godziny dyżuru.
import { wymiarMiesiaca } from './czas-pracy';
import { doGrosza } from './dodatek-nocny';
import type { RodzajStawki } from './przestoj';

export type MiejsceDyzuru = 'zaklad' | 'dom';

export interface DaneDyzuru {
  miejsce: MiejsceDyzuru;
  /** Długość dyżuru w godzinach. */
  godzinyDyzuru: number;
  /** Godziny pracy wykonanej w czasie dyżuru (czas pracy). */
  godzinyPracy?: number;
  rok: number;
  miesiac: number;
  rodzaj: RodzajStawki;
  stawka?: number;
  stale?: number;
  zmienneSuma?: number;
  zmienneGodziny?: number;
}

export function dyzur(d: DaneDyzuru) {
  const praca = d.godzinyPracy ?? 0;
  if (!(d.godzinyDyzuru > 0 && d.godzinyDyzuru <= 744)) throw new RangeError('Godziny dyżuru od 0 do 744');
  if (!(praca >= 0 && praca <= d.godzinyDyzuru)) throw new RangeError('Praca nie może trwać dłużej niż dyżur');
  const bezPracy = d.godzinyDyzuru - praca;
  const wymiar = wymiarMiesiaca(d.rok, d.miesiac).godziny;
  if (d.miejsce === 'dom') return { domowy: true, bezPracy, praca, wymiar, zaGodzine: 0, kwota: 0, czasWolny: 0 };
  let zaGodzine: number;
  if (d.rodzaj === 'godzinowa') zaGodzine = d.stawka ?? NaN;
  else if (d.rodzaj === 'miesieczna') zaGodzine = (d.stawka ?? NaN) / wymiar;
  else {
    // Zmienne składniki dzieli się przez godziny przepracowane w miesiącach, z których je liczymy (§ 4 ust. 2 pkt 2):
    // bez tych godzin nie da się ich policzyć, a pominięcie zaniżyłoby stawkę.
    if ((d.zmienneSuma ?? 0) > 0 && !((d.zmienneGodziny ?? 0) > 0)) throw new RangeError('Podaj godziny przepracowane w miesiącach ze zmiennymi składnikami');
    zaGodzine = 0.6 * ((d.stale ?? 0) / wymiar + (d.zmienneSuma && d.zmienneGodziny ? d.zmienneSuma / d.zmienneGodziny : 0));
  }
  if (!(zaGodzine >= 0)) throw new RangeError('Podaj stawkę');
  return { domowy: false, bezPracy, praca, wymiar, zaGodzine: doGrosza(zaGodzine), kwota: doGrosza(zaGodzine * bezPracy), czasWolny: bezPracy };
}
