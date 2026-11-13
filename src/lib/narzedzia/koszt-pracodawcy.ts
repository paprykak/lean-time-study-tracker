// Koszt zatrudnienia na umowę o pracę w 2026 i 2027 r.: pensja brutto plus składki finansowane przez pracodawcę.
// Emerytalna 9,76% (połowa z 19,52%, art. 16 ust. 1 i art. 22 ust. 1 pkt 1 ustawy systemowej), rentowa 6,5% (art. 16 ust. 1b),
// wypadkowa według stopy płatnika (art. 16 ust. 3; przy do 9 ubezpieczonych 50% najwyższej stopy z załącznika, 3,33%,
// czyli 1,67% po zaokrągleniu: art. 28 ust. 1 ustawy wypadkowej, § 6 ust. 2 rozporządzenia o różnicowaniu stopy).
// Fundusz Pracy 1,0% i Fundusz Solidarnościowy 1,45% (art. 25 i 26 ustawy budżetowej na 2026 r.), tylko gdy podstawa
// w miesiącu wynosi co najmniej płacę minimalną (art. 259 ust. 1 ustawy o rynku pracy, art. 4 ust. 1 ustawy o FS),
// i nie za kobiety od 55 lat i mężczyzn od 60 lat (art. 261). FGŚP 0,10% (art. 27 ustawy budżetowej): bez progu płacy
// minimalnej, ale z tym samym progiem wieku (art. 9b ust. 2 ustawy o ochronie roszczeń pracowniczych). PPK pracodawcy 1,5% (art. 26 ust. 1).
// Rok ma znaczenie: próg FP i FS to płaca minimalna z danego roku (2027: 4950 zł, Dz.U. 2026 poz. 1213), a roczny limit
// podstawy emerytalnej i rentowych ogłasza minister (2027: 300 990 zł, M.P. 2026 poz. 1098, art. 19 ust. 10 ustawy
// systemowej). Stopy FP, FS i FGŚP na 2027 r. da dopiero ustawa budżetowa na 2027 r.: do jej ogłoszenia liczymy stopami
// z 2026 r. i mówimy o tym na stronie (`stopyZRoku`).
import { PLACA_MINIMALNA } from '../../data/prawo';
import { doGrosza } from './dodatek-nocny';

export const STOPY_PRACODAWCY_2026 = { emerytalna: 9.76, rentowa: 6.5, fp: 1.0, fs: 1.45, fgsp: 0.1, ppk: 1.5 } as const;
export const WYPADKOWA_DOMYSLNA = 1.67;
/** Roczny limit podstawy składek emerytalnej i rentowych w 2026 r.: 30 × 9420 zł (art. 19 ust. 1, art. 24 ustawy budżetowej). */
export const LIMIT_ROCZNY_2026 = 30 * 9420;

/** Parametry roku: stopy funduszy (z ustawy budżetowej), z którego roku pochodzą, i roczny limit podstawy. */
export const ROKI_KOSZTU = {
  2026: { stopy: STOPY_PRACODAWCY_2026, stopyZRoku: 2026, limitRoczny: LIMIT_ROCZNY_2026, limitZrodlo: 'art. 24 ustawy budżetowej na 2026 r.' },
  // Ustawa budżetowa na 2027 r. jeszcze nieogłoszona (sprawdzone 2026-11-13): stopy jak w 2026 r., opisane na stronie.
  2027: { stopy: STOPY_PRACODAWCY_2026, stopyZRoku: 2026, limitRoczny: 300_990, limitZrodlo: 'M.P. 2026 poz. 1098' },
} as const;
export type RokKosztu = keyof typeof ROKI_KOSZTU;
export const LATA_KOSZTU = Object.keys(ROKI_KOSZTU).map(Number) as RokKosztu[];

/** Rok do obliczeń dla danej daty: bieżący, a poza tabelą najbliższy znany. */
export const rokKosztu = (data: string): RokKosztu => {
  const rok = Number(data.slice(0, 4));
  return (LATA_KOSZTU.includes(rok as RokKosztu) ? rok : rok < LATA_KOSZTU[0] ? LATA_KOSZTU[0] : LATA_KOSZTU[LATA_KOSZTU.length - 1]) as RokKosztu;
};

export interface DaneKosztu {
  brutto: number;
  wypadkowa?: number;
  /** Kobieta od 55 lat albo mężczyzna od 60 lat: bez FP, FS i FGŚP. */
  wiekZwolniony?: boolean;
  ppk?: boolean;
  /** Rok wypłaty (domyślnie 2026). */
  rok?: RokKosztu;
}

export function kosztPracodawcy(d: DaneKosztu) {
  if (!(d.brutto > 0 && d.brutto < 1_000_000)) throw new RangeError('Brutto musi być dodatnie');
  const wypadkowaStopa = d.wypadkowa ?? WYPADKOWA_DOMYSLNA;
  if (!(wypadkowaStopa >= 0.4 && wypadkowaStopa <= 8.12)) throw new RangeError('Stopa wypadkowa od 0,40% do 8,12%');
  const B = d.brutto;
  const rok = d.rok ?? 2026;
  if (!(rok in ROKI_KOSZTU)) throw new RangeError(`Brak stóp na ${rok} r.`);
  const S = ROKI_KOSZTU[rok].stopy;
  const pct = (p: number) => doGrosza((B * p) / 100);
  const emerytalna = pct(S.emerytalna);
  const rentowa = pct(S.rentowa);
  const wypadkowa = pct(wypadkowaStopa);
  const placiFp = !d.wiekZwolniony && B >= PLACA_MINIMALNA[rok].miesiecznie;
  const fp = placiFp ? pct(S.fp) : 0;
  const fs = placiFp ? pct(S.fs) : 0;
  const fgsp = d.wiekZwolniony ? 0 : pct(S.fgsp);
  const ppk = d.ppk ? pct(S.ppk) : 0;
  const skladki = doGrosza(emerytalna + rentowa + wypadkowa + fp + fs + fgsp + ppk);
  return { rok, brutto: B, emerytalna, rentowa, wypadkowa, fp, fs, fgsp, ppk, skladki, koszt: doGrosza(B + skladki) };
}
