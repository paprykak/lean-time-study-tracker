// Okres wypowiedzenia umowy o pracę i ostatni dzień umowy: art. 34 (okres próbny), art. 36 § 1 (2 tygodnie, 1 miesiąc,
// 3 miesiące według stażu u danego pracodawcy), art. 30 § 2^1 (okres w tygodniach kończy się w sobotę, w miesiącach
// ostatniego dnia miesiąca), art. 37 (dni na poszukiwanie pracy). Dzień doręczenia nie wlicza się do biegu okresu:
// tygodnie to pełne tygodnie od niedzieli do soboty po doręczeniu, miesiące to pełne miesiące od 1. dnia następnego
// miesiąca (przykład gov.pl: wypowiedzenie 22 lipca, okres miesięczny kończy się 31 sierpnia).
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

/** Zwolnienie na poszukiwanie pracy przy wypowiedzeniu przez pracodawcę (art. 37 § 2), w dniach roboczych. */
export function dniNaPoszukiwanie(okres: Okres): number {
  if (okres.jednostka === 'miesiac' && okres.ile === 3) return 3;
  if ((okres.jednostka === 'miesiac' && okres.ile === 1) || (okres.jednostka === 'tydzien' && okres.ile === 2)) return 2;
  return 0;
}
