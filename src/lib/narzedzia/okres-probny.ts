// Okres próbny (art. 25 § 2–3 Kp): najwyżej 3 miesiące; 1 miesiąc przed umową na czas określony krótszą niż 6 miesięcy,
// 2 miesiące przed umową od 6 do 12 miesięcy (§ 2^2), z możliwością jednorazowego wydłużenia tych okresów o 1 miesiąc,
// gdy uzasadnia to rodzaj pracy (§ 2^3). Wypowiedzenie (art. 34): 3 dni robocze przy okresie do 2 tygodni, 1 tydzień przy
// dłuższym, 2 tygodnie przy 3 miesiącach. Koniec umowy: miesiące kalendarzowo (art. 112 KC, `koniecOkresu`): dzień przed dniem o tej samej dacie, a gdy takiego
// dnia nie ma, ostatni dzień miesiąca (od 31 stycznia na miesiąc: 28 lutego).
import { dodajDni, koniecOkresu } from './terminy';

export type PlanowanaUmowa = 'nieokreslony' | 'okreslony-12' | 'okreslony-6-12' | 'okreslony-ponizej-6';
export type DlugoscProby = '2t' | '1m' | '2m' | '3m';

export const MAKS_MIESIECY: Record<PlanowanaUmowa, number> = {
  nieokreslony: 3,
  'okreslony-12': 3,
  'okreslony-6-12': 2,
  'okreslony-ponizej-6': 1,
};

const MIESIACE: Record<DlugoscProby, number> = { '2t': 0.5, '1m': 1, '2m': 2, '3m': 3 };

export function maksymalnyOkres(plan: PlanowanaUmowa, wydluzenie: boolean): number {
  const m = MAKS_MIESIECY[plan];
  return wydluzenie && m < 3 ? m + 1 : m;
}

export function wypowiedzenieProby(dlugosc: DlugoscProby): string {
  if (dlugosc === '2t') return '3 dni robocze';
  if (dlugosc === '3m') return '2 tygodnie';
  return '1 tydzień';
}

export function okresProbny(start: string, plan: PlanowanaUmowa, dlugosc: DlugoscProby, wydluzenie = false) {
  const maks = maksymalnyOkres(plan, wydluzenie);
  const dozwolony = MIESIACE[dlugosc] <= maks;
  const koniec = dlugosc === '2t' ? dodajDni(start, 13) : koniecOkresu(start, MIESIACE[dlugosc]);
  return { maks, dozwolony, koniec, wypowiedzenie: wypowiedzenieProby(dlugosc), wydluzenieMozliwe: MAKS_MIESIECY[plan] < 3 };
}
