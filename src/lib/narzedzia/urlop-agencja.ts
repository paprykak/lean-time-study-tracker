// Urlop i wypowiedzenie pracownika tymczasowego (ustawa o zatrudnianiu pracowników tymczasowych, t.j. Dz.U. 2025 poz. 236):
// urlop 2 dni za każdy miesiąc pozostawania w dyspozycji pracodawcy użytkownika (art. 17 ust. 1), wynagrodzenie za urlop
// = wynagrodzenie z 3 miesięcy pracy u tego samego użytkownika przed miesiącem urlopu podzielone przez godziny pracy
// w tych miesiącach, razy godziny urlopu (art. 17 ust. 4), ekwiwalent za niewykorzystany urlop (ust. 3–3a); wypowiedzenie
// umowy, jeśli strony je przewidziały: 3 dni przy umowie do 2 tygodni, tydzień przy dłuższej (art. 13 ust. 2).
import { doGrosza } from './dodatek-nocny';

export const DNI_ZA_MIESIAC = 2;

/** Dni urlopu za pełne miesiące w dyspozycji (art. 17 ust. 1). */
export function urlopTymczasowy(miesiace: number): number {
  if (!(Number.isInteger(miesiace) && miesiace >= 0 && miesiace <= 18)) throw new RangeError('Miesiące: od 0 do 18');
  return miesiace * DNI_ZA_MIESIAC;
}

export interface DaneWynagrodzeniaUrlopowego {
  /** Wynagrodzenie brutto wypłacone za 3 miesiące pracy u tego samego użytkownika. */
  wynagrodzenie3m: number;
  /** Godziny pracy w tych 3 miesiącach. */
  godziny3m: number;
  /** Dni urlopu i godziny pracy w każdym z nich według grafiku. */
  dniUrlopu: number;
  godzinDziennie: number;
}

/** Wynagrodzenie za urlop pracownika tymczasowego (art. 17 ust. 4). */
export function wynagrodzenieZaUrlopTymczasowy(d: DaneWynagrodzeniaUrlopowego) {
  if (!(d.wynagrodzenie3m > 0)) throw new RangeError('Wynagrodzenie musi być dodatnie');
  if (!(d.godziny3m > 0)) throw new RangeError('Godziny muszą być dodatnie');
  if (!(d.dniUrlopu >= 0 && d.godzinDziennie > 0 && d.godzinDziennie <= 24)) throw new RangeError('Błędne dni albo godziny');
  const zaGodzine = d.wynagrodzenie3m / d.godziny3m;
  const godziny = d.dniUrlopu * d.godzinDziennie;
  return { zaGodzine: doGrosza(zaGodzine), godziny, razem: doGrosza(zaGodzine * godziny) };
}

/** Okres wypowiedzenia umowy z pracownikiem tymczasowym, gdy strony go przewidziały (art. 13 ust. 2). */
export const wypowiedzenieTymczasowe = (umowaDluzszaNiz2Tygodnie: boolean) => (umowaDluzszaNiz2Tygodnie ? '1 tydzień' : '3 dni');
