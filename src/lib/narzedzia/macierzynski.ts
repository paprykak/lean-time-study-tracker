// Zasiłek macierzyński za urlop macierzyński i rodzicielski matki-pracownicy (ustawa zasiłkowa, t.j. Dz.U. 2026 poz. 854).
// Wymiar: urlop macierzyński 20/31/33/35/37 tygodni (art. 180 § 1 Kp), rodzicielski 41 albo 43 tygodnie łącznie dla
// rodziców, z czego 9 tygodni wyłącznie dla każdego z nich (art. 182^1a § 1, 3 i 4). Wysokość (art. 31): 100% za
// macierzyński i 70% za rodzicielski albo, przy wniosku do 21 dni po porodzie (art. 30a ust. 1), 81,5% za cały okres
// (ust. 3); 9 tygodni drugiego rodzica 70% (ust. 3f). Miesięczny zasiłek nie niższy niż świadczenie rodzicielskie
// 1000 zł (ust. 3a; art. 17c ust. 5 ustawy o świadczeniach rodzinnych). Podstawa jak przy chorobowym (art. 47).
import { podstawaZasilku } from './chorobowe';
import { doGrosza } from './dodatek-nocny';

export const SWIADCZENIE_RODZICIELSKIE = 1000;
export const TYGODNIE_MACIERZYNSKIEGO: Record<number, number> = { 1: 20, 2: 31, 3: 33, 4: 35, 5: 37 };
export const TYGODNIE_WYLACZNE = 9;
export const tygodnieRodzicielskiego = (dzieci: number) => (dzieci === 1 ? 41 : 43);

export type Wariant = '100-70' | '81,5';

export interface DaneMacierzynskiego {
  rok: number;
  brutto: number;
  pelnyEtat?: boolean;
  /** Liczba dzieci urodzonych przy jednym porodzie (5 = pięcioro i więcej). */
  dzieci?: number;
  wariant: Wariant;
  /** Tygodnie urlopu rodzicielskiego matki; domyślnie wszystkie poza 9 tygodniami ojca. */
  tygodnieRodzicielskiego?: number;
}

const miesiecznie = (podstawa: number, procent: number) => Math.max(doGrosza((podstawa * procent) / 100), SWIADCZENIE_RODZICIELSKIE);

export function zasilekMacierzynski(d: DaneMacierzynskiego) {
  const dzieci = Math.min(Math.max(d.dzieci ?? 1, 1), 5);
  const { podstawa } = podstawaZasilku(d.rok, d.brutto, d.pelnyEtat !== false);
  const tygMac = TYGODNIE_MACIERZYNSKIEGO[dzieci];
  const maksRodz = tygodnieRodzicielskiego(dzieci) - TYGODNIE_WYLACZNE;
  const tygRodz = d.tygodnieRodzicielskiego ?? maksRodz;
  if (!(Number.isInteger(tygRodz) && tygRodz >= 0 && tygRodz <= maksRodz)) throw new RangeError(`Urlop rodzicielski matki: od 0 do ${maksRodz} tygodni`);
  const procMac = d.wariant === '81,5' ? 81.5 : 100;
  const procRodz = d.wariant === '81,5' ? 81.5 : 70;
  const mMac = miesiecznie(podstawa, procMac);
  const mRodz = miesiecznie(podstawa, procRodz);
  // Kwota za dzień: jedna trzydziesta miesięcznej, zaokrąglona do grosza, za każdy dzień (art. 31 ust. 5, art. 11 ust. 4, art. 36 ust. 3).
  const dziennieMac = doGrosza(mMac / 30);
  const dziennieRodz = doGrosza(mRodz / 30);
  const razemMac = doGrosza(dziennieMac * tygMac * 7);
  const razemRodz = doGrosza(dziennieRodz * tygRodz * 7);
  return {
    podstawa,
    tygodnieMacierzynskiego: tygMac,
    tygodnieRodzicielskiego: tygRodz,
    miesiecznieMacierzynski: mMac,
    miesiecznieRodzicielski: mRodz,
    razemMacierzynski: razemMac,
    razemRodzicielski: razemRodz,
    razem: doGrosza(razemMac + razemRodz),
  };
}
