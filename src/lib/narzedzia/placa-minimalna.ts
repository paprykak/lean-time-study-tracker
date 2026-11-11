// Czy wynagrodzenie nie jest niższe od płacy minimalnej (ustawa o minimalnym wynagrodzeniu za pracę, t.j. Dz.U. 2024
// poz. 1773, bez późniejszych zmian według API Sejmu): art. 6 ust. 1 i 4 (składniki wynagrodzeń osobowych), ust. 5
// (czego nie wlicza się: nagroda jubileuszowa, odprawa emerytalna lub rentowa, nadgodziny, dodatek nocny, dodatek za staż,
// dodatek za szczególne warunki pracy), art. 7 (wyrównanie), art. 8 (niepełny etat proporcjonalnie do godzin),
// art. 8a (minimalna stawka godzinowa przy zleceniu i umowie o świadczenie usług).
import { PLACA_MINIMALNA } from '../../data/prawo';
import { doGrosza } from './dodatek-nocny';

export const NIEWLICZANE = [
  'wynagrodzenie za nadgodziny',
  'dodatek za pracę w nocy',
  'dodatek za staż pracy',
  'dodatek za szczególne warunki pracy',
  'nagroda jubileuszowa',
  'odprawa emerytalna lub rentowa',
] as const;

export interface DanePlacy {
  rok: number;
  /** Wymiar etatu (0–1]: minimum proporcjonalnie do godzin (art. 8 ust. 1). */
  etat?: number;
  /** Pensja zasadnicza za pełny przepracowany miesiąc. */
  zasadnicze: number;
  /** Premie, dodatki i inne składniki wliczane (art. 6 ust. 4), np. premia regulaminowa, dodatek funkcyjny. */
  wliczane?: number;
}

export function sprawdzPlace(d: DanePlacy) {
  const placa = PLACA_MINIMALNA[d.rok];
  if (!placa) throw new RangeError(`Brak płacy minimalnej na ${d.rok} r.`);
  const etat = d.etat ?? 1;
  if (!(etat > 0 && etat <= 1)) throw new RangeError('Etat od 0 do 1');
  const wliczane = d.wliczane ?? 0;
  if (!(d.zasadnicze >= 0 && wliczane >= 0)) throw new RangeError('Kwoty nie mogą być ujemne');
  const minimum = doGrosza(placa.miesiecznie * etat);
  const liczone = doGrosza(d.zasadnicze + wliczane);
  const wyrownanie = Math.max(0, doGrosza(minimum - liczone));
  return { minimum, liczone, wyrownanie, zgodne: wyrownanie === 0, stawkaZlecenie: placa.stawkaGodzinowa };
}

/** Wynagrodzenie na zleceniu za przepracowane godziny przy minimalnej stawce godzinowej (art. 8a ust. 1). */
export const minimumZlecenie = (rok: number, godziny: number) => {
  const placa = PLACA_MINIMALNA[rok];
  if (!placa) throw new RangeError(`Brak stawki na ${rok} r.`);
  if (!(godziny >= 0)) throw new RangeError('Godziny nie mogą być ujemne');
  return doGrosza(placa.stawkaGodzinowa * godziny);
};
