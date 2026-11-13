// Wynagrodzenie za przestój z przyczyn dotyczących pracodawcy (art. 81 § 1 i 2 Kp): stawka z osobistego zaszeregowania
// (godzinowa albo miesięczna), a gdy jej nie wyodrębniono 60% wynagrodzenia; nie mniej niż płaca minimalna.
// Godzina przy stawce miesięcznej: stawka podzielona przez godziny do przepracowania w miesiącu (§ 4a rozporządzenia
// z 29 maja 1996 r.). 60%: według zasad wynagrodzenia urlopowego, składniki stałe miesięczne dzielone przez godziny
// do przepracowania w miesiącu, zmienne przez godziny przepracowane w okresie, z którego się je liczy (§ 4 ust. 1 i 2).
// Minimum za godzinę: płaca minimalna podzielona przez godziny do przepracowania w miesiącu (metoda jak w § 4a i § 4b).
import { PLACA_MINIMALNA } from '../../data/prawo';
import { wymiarMiesiaca } from './czas-pracy';
import { doGrosza } from './dodatek-nocny';

export type RodzajStawki = 'godzinowa' | 'miesieczna' | 'bez-stawki';

export interface DanePrzestoju {
  rok: number;
  miesiac: number;
  godziny: number;
  rodzaj: RodzajStawki;
  /** Stawka godzinowa albo miesięczna z osobistego zaszeregowania. */
  stawka?: number;
  /** Bez wyodrębnionej stawki: stałe składniki miesięczne. */
  stale?: number;
  /** Bez wyodrębnionej stawki: suma składników zmiennych z okresu (zwykle 3 miesięcy). */
  zmienneSuma?: number;
  /** Godziny przepracowane w okresie, z którego liczymy zmienne składniki. */
  zmienneGodziny?: number;
  /** Wymiar etatu (1 = pełny): pensję i stałe składniki dzielimy przez godziny do przepracowania przy tym etacie.
   *  Minimum za godzinę zostaje płacą minimalną podzieloną przez wymiar pełnego etatu. */
  etat?: number;
}

export function przestoj(d: DanePrzestoju) {
  const placa = PLACA_MINIMALNA[d.rok];
  if (!placa) throw new RangeError(`Brak płacy minimalnej na ${d.rok} r.`);
  if (!(d.godziny > 0 && d.godziny <= 744)) throw new RangeError('Godziny przestoju od 0 do 744');
  const etat = d.etat ?? 1;
  if (!(etat > 0 && etat <= 1)) throw new RangeError('Wymiar etatu od 0 do 1');
  const wymiar = wymiarMiesiaca(d.rok, d.miesiac).godziny;
  let zaGodzine: number;
  if (d.rodzaj === 'godzinowa') zaGodzine = d.stawka ?? NaN;
  else if (d.rodzaj === 'miesieczna') zaGodzine = (d.stawka ?? NaN) / (wymiar * etat);
  else {
    const stale = (d.stale ?? 0) / (wymiar * etat);
    const zmienne = d.zmienneSuma && d.zmienneGodziny ? d.zmienneSuma / d.zmienneGodziny : 0;
    zaGodzine = 0.6 * (stale + zmienne);
  }
  if (!(zaGodzine >= 0)) throw new RangeError('Podaj stawkę');
  const minimumZaGodzine = placa.miesiecznie / wymiar;
  const stawkaPrzestoju = Math.max(zaGodzine, minimumZaGodzine);
  return {
    wymiar,
    /** Godziny do przepracowania w miesiącu przy tym etacie. */
    wymiarEtatu: wymiar * etat,
    zaGodzine: doGrosza(zaGodzine),
    minimumZaGodzine: doGrosza(minimumZaGodzine),
    podniesioneDoMinimum: zaGodzine < minimumZaGodzine,
    kwota: doGrosza(stawkaPrzestoju * d.godziny),
  };
}
