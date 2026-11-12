// Jednorazowe odszkodowanie z ZUS za wypadek przy pracy lub chorobę zawodową (ustawa o ubezpieczeniu społecznym
// z tytułu wypadków przy pracy i chorób zawodowych, t.j. Dz.U. 2025 poz. 1644; zmiana Dz.U. 2026 poz. 26 dotyczy trybu
// orzekania, art. 2, 15 i 16). Za każdy procent uszczerbku 20% przeciętnego wynagrodzenia (art. 12 ust. 1), przy
// zwiększeniu uszczerbku o co najmniej 10 punktów procentowych dopłata za każdy procent ponad poprzedni (ust. 2),
// przy całkowitej niezdolności do pracy i niezdolności do samodzielnej egzystencji dodatkowo 3,5-krotność (ust. 3).
// Kwoty z obwieszczenia ministra na okres od 1 kwietnia do 31 marca (art. 14 ust. 9), według dnia decyzji ZUS (art. 12
// ust. 5), w pełnych złotych (art. 12 ust. 6). Zwolnione z PIT (art. 21 ust. 1 pkt 3 ustawy o PIT).

export interface KwotyOdszkodowan {
  od: string;
  do: string;
  zaProcent: number;
  niezdolnosc: number;
  malzonekLubDziecko: number;
  innyCzlonek: number;
  zwiekszenie: number;
  zrodlo: string;
}

export const KWOTY_ODSZKODOWAN: KwotyOdszkodowan[] = [
  { od: '2025-04-01', do: '2026-03-31', zaProcent: 1636, niezdolnosc: 28636, malzonekLubDziecko: 147271, innyCzlonek: 73635, zwiekszenie: 28636, zrodlo: 'M.P. 2025 poz. 222' },
  { od: '2026-04-01', do: '2027-03-31', zaProcent: 1781, niezdolnosc: 31162, malzonekLubDziecko: 160264, innyCzlonek: 80132, zwiekszenie: 31162, zrodlo: 'M.P. 2026 poz. 292' },
];

export const MIN_ZWIEKSZENIA = 10;

export const kwotyNaDzien = (data: string) => KWOTY_ODSZKODOWAN.find((k) => k.od <= data && data <= k.do) ?? null;

export interface DaneOdszkodowania {
  dataDecyzji: string;
  procent: number;
  /** Procent, według którego przyznano wcześniejsze odszkodowanie; 0, gdy to pierwsze. */
  poprzedni: number;
  niezdolnosc: boolean;
}

export function odszkodowanie(d: DaneOdszkodowania) {
  const k = kwotyNaDzien(d.dataDecyzji);
  if (!k) throw new RangeError('Brak ogłoszonych kwot na ten dzień');
  for (const p of [d.procent, d.poprzedni]) if (!(Number.isInteger(p) && p >= 0 && p <= 100)) throw new RangeError('Procent: liczba całkowita od 0 do 100');
  const roznica = d.procent - d.poprzedni;
  const zwiekszenie = d.poprzedni > 0;
  const zaUszczerbek = zwiekszenie ? (roznica >= MIN_ZWIEKSZENIA ? roznica * k.zaProcent : 0) : d.procent * k.zaProcent;
  const zaNiezdolnosc = d.niezdolnosc ? k.niezdolnosc : 0;
  return { kwoty: k, zaUszczerbek, zaNiezdolnosc, razem: zaUszczerbek + zaNiezdolnosc, zwiekszenie, zaMaleZwiekszenie: zwiekszenie && roznica < MIN_ZWIEKSZENIA };
}
