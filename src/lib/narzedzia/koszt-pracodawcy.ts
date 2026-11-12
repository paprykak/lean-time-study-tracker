// Koszt zatrudnienia na umowę o pracę w 2026 r.: pensja brutto plus składki finansowane przez pracodawcę.
// Emerytalna 9,76% (połowa z 19,52%, art. 16 ust. 1 i art. 22 ust. 1 pkt 1 ustawy systemowej), rentowa 6,5% (art. 16 ust. 1b),
// wypadkowa według stopy płatnika (art. 16 ust. 3; przy do 9 ubezpieczonych 50% najwyższej stopy z załącznika, 3,33%,
// czyli 1,67% po zaokrągleniu: art. 28 ust. 1 ustawy wypadkowej, § 6 ust. 2 rozporządzenia o różnicowaniu stopy).
// Fundusz Pracy 1,0% i Fundusz Solidarnościowy 1,45% (art. 25 i 26 ustawy budżetowej na 2026 r.), tylko gdy podstawa
// w miesiącu wynosi co najmniej płacę minimalną (art. 259 ust. 1 ustawy o rynku pracy, art. 4 ust. 1 ustawy o FS),
// i nie za kobiety od 55 lat i mężczyzn od 60 lat (art. 261). FGŚP 0,10% (art. 27 ustawy budżetowej), bez tego
// samego progu wieku (art. 9b ust. 2 ustawy o ochronie roszczeń pracowniczych). PPK pracodawcy 1,5% (art. 26 ust. 1).
import { PLACA_MINIMALNA } from '../../data/prawo';
import { doGrosza } from './dodatek-nocny';

export const STOPY_PRACODAWCY_2026 = { emerytalna: 9.76, rentowa: 6.5, fp: 1.0, fs: 1.45, fgsp: 0.1, ppk: 1.5 } as const;
export const WYPADKOWA_DOMYSLNA = 1.67;
/** Roczny limit podstawy składek emerytalnej i rentowych w 2026 r.: 30 × 9420 zł (art. 19 ust. 1, art. 24 ustawy budżetowej). */
export const LIMIT_ROCZNY_2026 = 30 * 9420;

export interface DaneKosztu {
  brutto: number;
  wypadkowa?: number;
  /** Kobieta od 55 lat albo mężczyzna od 60 lat: bez FP, FS i FGŚP. */
  wiekZwolniony?: boolean;
  ppk?: boolean;
}

export function kosztPracodawcy(d: DaneKosztu) {
  if (!(d.brutto > 0 && d.brutto < 1_000_000)) throw new RangeError('Brutto musi być dodatnie');
  const wypadkowaStopa = d.wypadkowa ?? WYPADKOWA_DOMYSLNA;
  if (!(wypadkowaStopa >= 0.4 && wypadkowaStopa <= 8.12)) throw new RangeError('Stopa wypadkowa od 0,40% do 8,12%');
  const B = d.brutto;
  const S = STOPY_PRACODAWCY_2026;
  const pct = (p: number) => doGrosza((B * p) / 100);
  const emerytalna = pct(S.emerytalna);
  const rentowa = pct(S.rentowa);
  const wypadkowa = pct(wypadkowaStopa);
  const placiFp = !d.wiekZwolniony && B >= PLACA_MINIMALNA[2026].miesiecznie;
  const fp = placiFp ? pct(S.fp) : 0;
  const fs = placiFp ? pct(S.fs) : 0;
  const fgsp = d.wiekZwolniony ? 0 : pct(S.fgsp);
  const ppk = d.ppk ? pct(S.ppk) : 0;
  const skladki = doGrosza(emerytalna + rentowa + wypadkowa + fp + fs + fgsp + ppk);
  return { brutto: B, emerytalna, rentowa, wypadkowa, fp, fs, fgsp, ppk, skladki, koszt: doGrosza(B + skladki) };
}
