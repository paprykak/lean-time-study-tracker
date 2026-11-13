// Odprawy przy końcu pracy: z przyczyn niedotyczących pracownika (art. 8 i 10 ustawy o szczególnych zasadach
// rozwiązywania z pracownikami stosunków pracy z przyczyn niedotyczących pracowników, t.j. Dz.U. 2026 poz. 1195)
// i emerytalna albo rentowa (art. 92^1 Kp). Wynagrodzenie liczy się jak do ekwiwalentu za urlop: odprawę z ustawy
// według art. 8 ust. 3 ustawy, emerytalną i rentową według § 2 ust. 1 pkt 7 rozporządzenia z 29 maja 1996 r. (t.j. Dz.U. 2017 poz. 927): składniki stałe, średnia zmiennych
// z 3 miesięcy i jedna dwunasta składników za okresy dłuższe niż miesiąc z 12 miesięcy (§ 15–17 rozporządzenia urlopowego).
import { PLACA_MINIMALNA } from '../../data/prawo';
import { doGrosza } from './dodatek-nocny';
import { koniecOkresu } from './terminy';

export type RodzajOdprawy = 'zwolnienie' | 'emerytalna';

/** Ile miesięcznych wynagrodzeń (art. 8 ust. 1): krócej niż 2 lata 1, od 2 do 8 lat 2, ponad 8 lat 3. */
export function miesiecyOdprawy(zatrudnienieOd: string, rozwiazanie: string): 1 | 2 | 3 {
  // Ostatni dzień 2 i 8 lat zatrudnienia liczonych z pierwszym dniem (`koniecOkresu`, terminy.ts).
  const dwaLata = koniecOkresu(zatrudnienieOd, 24);
  const osiemLat = koniecOkresu(zatrudnienieOd, 96);
  if (rozwiazanie < dwaLata) return 1;
  if (rozwiazanie <= osiemLat) return 2;
  return 3;
}

/** Najwyższa odprawa z przyczyn niedotyczących pracownika: 15-krotność płacy minimalnej z dnia rozwiązania (art. 8 ust. 4). */
export function limitOdprawy(rozwiazanie: string): number | null {
  const placa = PLACA_MINIMALNA[Number(rozwiazanie.slice(0, 4))];
  return placa ? 15 * placa.miesiecznie : null;
}

export interface DaneOdprawy {
  rodzaj: RodzajOdprawy;
  stale: number;
  zmienne?: number;
  dluzsze12?: number;
  zatrudnienieOd?: string;
  rozwiazanie?: string;
}

export function odprawa(d: DaneOdprawy) {
  const zmienne = d.zmienne ?? 0;
  const dluzsze = d.dluzsze12 ?? 0;
  if (!(d.stale >= 0 && zmienne >= 0 && dluzsze >= 0)) throw new RangeError('Kwoty nie mogą być ujemne');
  const miesieczne = doGrosza(d.stale + zmienne + dluzsze / 12);
  if (d.rodzaj === 'emerytalna') return { miesieczne, miesiecy: 1, limit: null, ograniczona: false, kwota: miesieczne };
  if (!d.zatrudnienieOd || !d.rozwiazanie) throw new RangeError('Podaj daty zatrudnienia i rozwiązania umowy');
  if (d.rozwiazanie < d.zatrudnienieOd) throw new RangeError('Rozwiązanie przed początkiem zatrudnienia');
  const miesiecy = miesiecyOdprawy(d.zatrudnienieOd, d.rozwiazanie);
  const limit = limitOdprawy(d.rozwiazanie);
  if (limit === null) throw new RangeError('Brak płacy minimalnej na rok rozwiązania umowy');
  const pelna = doGrosza(miesieczne * miesiecy);
  return { miesieczne, miesiecy, limit, ograniczona: pelna > limit, kwota: Math.min(pelna, limit) };
}
