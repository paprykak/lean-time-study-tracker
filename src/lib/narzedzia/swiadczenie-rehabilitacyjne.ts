// Świadczenie rehabilitacyjne (ustawa zasiłkowa, t.j. Dz.U. 2026 poz. 854): po wyczerpaniu zasiłku chorobowego, gdy
// leczenie rokuje odzyskanie zdolności do pracy, najdłużej 12 miesięcy (art. 18 ust. 1–2); 90% podstawy przez pierwsze
// 3 miesiące, potem 75%, w ciąży 100% (art. 19 ust. 1); z ubezpieczenia wypadkowego 100% (art. 9 ust. 1 ustawy wypadkowej).
// Podstawa zasiłku chorobowego podlega waloryzacji wskaźnikiem z kwartału, w którym zaczyna się świadczenie (art. 19
// ust. 2–3; wskaźniki z obwieszczeń Prezesa ZUS). Kwoty miesięczne brutto, przed zaliczką na podatek, za pełne miesiące.
import { podstawaZasilku } from './chorobowe';
import { doGrosza } from './dodatek-nocny';
import { dodajDni, dodajMiesiace } from './terminy';

/** Wskaźnik waloryzacji w procentach według kwartału „RRRR-K”; 100 = bez waloryzacji. */
export const WSKAZNIKI: Record<string, { wskaznik: number; zrodlo: string }> = {
  '2026-1': { wskaznik: 100, zrodlo: 'M.P. 2025 poz. 1205 (bez waloryzacji)' },
  '2026-2': { wskaznik: 105.1, zrodlo: 'M.P. 2026 poz. 210' },
  '2026-3': { wskaznik: 109.0, zrodlo: 'M.P. 2026 poz. 495' },
  '2026-4': { wskaznik: 100.4, zrodlo: 'M.P. 2026 poz. 858' },
};

export const kwartal = (data: string) => `${data.slice(0, 4)}-${Math.floor((Number(data.slice(5, 7)) - 1) / 3) + 1}`;

export type Przyczyna = 'choroba' | 'ciaza' | 'wypadek';

export interface DaneRehabilitacyjnego {
  start: string;
  brutto: number;
  pelnyEtat?: boolean;
  przyczyna: Przyczyna;
  /** Na ile miesięcy przyznano świadczenie (1–12). */
  miesiace: number;
}

export function swiadczenieRehabilitacyjne(d: DaneRehabilitacyjnego) {
  if (!(Number.isInteger(d.miesiace) && d.miesiace >= 1 && d.miesiace <= 12)) throw new RangeError('Miesiące: od 1 do 12');
  const rok = Number(d.start.slice(0, 4));
  const { podstawa, podniesiona } = podstawaZasilku(rok, d.brutto, d.pelnyEtat ?? true);
  const w = WSKAZNIKI[kwartal(d.start)] ?? null;
  const podstawaPoWaloryzacji = doGrosza((podstawa * Math.max(100, w?.wskaznik ?? 100)) / 100);
  const [p1, p2] = d.przyczyna === 'choroba' ? [90, 75] : [100, 100];
  const pierwsze = doGrosza((podstawaPoWaloryzacji * p1) / 100);
  const dalej = doGrosza((podstawaPoWaloryzacji * p2) / 100);
  return {
    podstawa,
    podniesiona,
    wskaznik: w,
    podstawaPoWaloryzacji,
    procentPierwsze: p1,
    procentDalej: p2,
    pierwsze,
    dalej,
    od75: dodajMiesiace(d.start, 3),
    koniecNajpozniej: dodajDni(dodajMiesiace(d.start, 12), -1),
    koniecPrzyznanego: dodajDni(dodajMiesiace(d.start, d.miesiace), -1),
    razem: doGrosza(Math.min(3, d.miesiace) * pierwsze + Math.max(0, d.miesiace - 3) * dalej),
  };
}
