// Okres wypowiedzenia umowy o pracę i ostatni dzień umowy: art. 34 (okres próbny), art. 36 § 1 (2 tygodnie, 1 miesiąc,
// 3 miesiące według stażu u danego pracodawcy), art. 30 § 2^1 (okres w tygodniach kończy się w sobotę, w miesiącach
// ostatniego dnia miesiąca), art. 37 (dni na poszukiwanie pracy). Dzień doręczenia nie wlicza się do biegu okresu:
// tygodnie to pełne tygodnie od niedzieli do soboty po doręczeniu, miesiące to pełne miesiące od 1. dnia następnego
// miesiąca (przykład gov.pl: wypowiedzenie 22 lipca, okres miesięczny kończy się 31 sierpnia).
// Staż w pełnych miesiącach według art. 112 KC: 6 miesięcy od 31 marca (wliczonego) mija z końcem 30 września; dnia
// doręczenia nie wliczamy. Gdy próg 6 miesięcy albo 3 lat stażu przypada w trakcie biegu wypowiedzenia, przepis nie mówi
// wprost, co wtedy; w praktyce (stanowisko PIP i MRPiPS, część orzecznictwa SN) okres wydłuża się z mocy prawa, więc
// jako wynik podajemy dłuższy okres, liczony od tego samego doręczenia (wariant bezpieczny dla pracownika).
import { dodajDni } from './terminy';

export type RodzajUmowy = 'stala' | 'probna-2tyg' | 'probna-ponad-2tyg' | 'probna-3mies';

export interface Okres {
  jednostka: 'tydzien' | 'miesiac' | 'dni-robocze';
  ile: number;
  opis: string;
  podstawa: string;
}

/** Pełne miesiące między datami (RRRR-MM-DD), np. staż od rozpoczęcia pracy do doręczenia wypowiedzenia. */
export function pelneMiesiace(od: string, do_: string): number {
  const [r1, m1, d1] = od.split('-').map(Number);
  const [r2, m2, d2] = do_.split('-').map(Number);
  let m = (r2 - r1) * 12 + (m2 - m1);
  if (d2 < d1) m--;
  return Math.max(0, m);
}

export function okresWypowiedzenia(rodzaj: RodzajUmowy, stazMiesiecy: number): Okres {
  if (rodzaj === 'probna-2tyg') return { jednostka: 'dni-robocze', ile: 3, opis: '3 dni robocze', podstawa: 'art. 34 pkt 1 Kodeksu pracy' };
  if (rodzaj === 'probna-ponad-2tyg') return { jednostka: 'tydzien', ile: 1, opis: '1 tydzień', podstawa: 'art. 34 pkt 2 Kodeksu pracy' };
  if (rodzaj === 'probna-3mies') return { jednostka: 'tydzien', ile: 2, opis: '2 tygodnie', podstawa: 'art. 34 pkt 3 Kodeksu pracy' };
  if (stazMiesiecy >= 36) return { jednostka: 'miesiac', ile: 3, opis: '3 miesiące', podstawa: 'art. 36 § 1 pkt 3 Kodeksu pracy' };
  if (stazMiesiecy >= 6) return { jednostka: 'miesiac', ile: 1, opis: '1 miesiąc', podstawa: 'art. 36 § 1 pkt 2 Kodeksu pracy' };
  return { jednostka: 'tydzien', ile: 2, opis: '2 tygodnie', podstawa: 'art. 36 § 1 pkt 1 Kodeksu pracy' };
}

/** Ostatni dzień umowy dla okresu w tygodniach albo miesiącach; null dla dni roboczych (zależą od rozkładu pracy). */
export function koniecWypowiedzenia(doreczenie: string, okres: Okres): string | null {
  if (okres.jednostka === 'dni-robocze') return null;
  if (okres.jednostka === 'tydzien') {
    const dzienTygodnia = new Date(`${doreczenie}T00:00:00Z`).getUTCDay();
    const doNiedzieli = dzienTygodnia === 0 ? 7 : 7 - dzienTygodnia;
    return dodajDni(doreczenie, doNiedzieli + 7 * okres.ile - 1);
  }
  const [r, m] = doreczenie.split('-').map(Number);
  return new Date(Date.UTC(r, m + okres.ile, 0)).toISOString().slice(0, 10);
}

export interface WypowiedzenieStalej {
  /** Pełne miesiące stażu w dniu doręczenia. */
  staz: number;
  okres: Okres;
  /** Ostatni dzień umowy. */
  koniec: string;
  /** Gdy w trakcie wypowiedzenia staż osiąga próg: który, z końcem jakiego dnia i jaki byłby okres bez wydłużenia. */
  prog: { miesiace: 6 | 36; dzien: string; krotszy: Okres; krotszyKoniec: string } | null;
}

/** Umowa na czas nieokreślony albo określony: okres według stażu, wydłużony, gdy próg stażu przypada przed jego końcem. */
export function wypowiedzenieStalej(od: string, doreczenie: string): WypowiedzenieStalej {
  const staz = pelneMiesiace(od, doreczenie);
  const pierwszy = okresWypowiedzenia('stala', staz);
  let okres = pierwszy;
  let koniec = koniecWypowiedzenia(doreczenie, okres)!;
  // Dłuższy okres może sam dojść do kolejnego progu (1 miesiąc do 3 lat), więc liczymy do skutku.
  for (;;) {
    const nowy = okresWypowiedzenia('stala', pelneMiesiace(od, dodajDni(koniec, 1)));
    if (nowy.podstawa === okres.podstawa) break;
    okres = nowy;
    koniec = koniecWypowiedzenia(doreczenie, okres)!;
  }
  if (okres === pierwszy) return { staz, okres, koniec, prog: null };
  const miesiace = okres.ile === 3 ? 36 : 6;
  // Pierwszy dzień, od którego staż ma pełne `miesiace`; próg mija z końcem dnia poprzedniego.
  let dzien = dodajDni(doreczenie, 1);
  while (pelneMiesiace(od, dzien) < miesiace) dzien = dodajDni(dzien, 1);
  return { staz, okres, koniec, prog: { miesiace, dzien: dodajDni(dzien, -1), krotszy: pierwszy, krotszyKoniec: koniecWypowiedzenia(doreczenie, pierwszy)! } };
}

/** Zwolnienie na poszukiwanie pracy przy wypowiedzeniu przez pracodawcę (art. 37 § 2), w dniach roboczych. */
export function dniNaPoszukiwanie(okres: Okres): number {
  if (okres.jednostka === 'miesiac' && okres.ile === 3) return 3;
  if ((okres.jednostka === 'miesiac' && okres.ile === 1) || (okres.jednostka === 'tydzien' && okres.ile === 2)) return 2;
  return 0;
}
