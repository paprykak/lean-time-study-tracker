// Drgania mechaniczne na stanowisku pracy: ekspozycja dzienna A(8) = √(Σ a_i² · t_i / 8 h) z przyspieszeń drgań
// (suma wektorowa a_hv dla drgań miejscowych, przyspieszenie dominujące z 1,4·a_wx, 1,4·a_wy, a_wz dla ogólnych)
// i czasów, porównana z przepisami:
// - NDN: miejscowe 2,8 m/s² (A(8)) i 11,2 m/s² (ekspozycja do 30 minut), ogólne 0,8 i 3,2 m/s² (załącznik do rozporządzenia
//   z 12 czerwca 2018 r., Dz.U. 2018 poz. 1286, część B, pkt B.1.2–1.3 i 2.2–2.3);
// - próg działania A(8): miejscowe 2,5 m/s², ogólne 0,5 m/s² (załącznik do rozporządzenia z 5 sierpnia 2005 r., Dz.U. 2005
//   nr 157 poz. 1318); od progu pracodawca wprowadza program ograniczenia narażenia (§ 5 ust. 2 pkt 2);
// - kobiety w ciąży: miejscowe 1 i 4 m/s², ogólne: każda praca wzbroniona (Dz.U. 2017 poz. 796, załącznik, cz. III
//   pkt 4–5); młodociani: miejscowe 1 i 4 m/s², ogólne 0,19 i 0,76 m/s² (Dz.U. 2023 poz. 1240, załącznik nr 1, cz. I
//   ust. 2 pkt 8–9).

export type RodzajDrgan = 'miejscowe' | 'ogolne';
export type GrupaDrgan = 'dorosly' | 'mlodociany' | 'ciaza';

interface Limit {
  /** A(8), m/s²; null, gdy każda praca jest wzbroniona. */
  a8: number | null;
  /** Ekspozycja trwająca 30 minut i krócej, m/s². */
  krotka: number | null;
}

export const LIMITY_DRGAN: Record<RodzajDrgan, Record<GrupaDrgan, Limit>> = {
  miejscowe: { dorosly: { a8: 2.8, krotka: 11.2 }, mlodociany: { a8: 1, krotka: 4 }, ciaza: { a8: 1, krotka: 4 } },
  ogolne: { dorosly: { a8: 0.8, krotka: 3.2 }, mlodociany: { a8: 0.19, krotka: 0.76 }, ciaza: { a8: null, krotka: null } },
};
export const PROG_DZIALANIA_DRGAN: Record<RodzajDrgan, number> = { miejscowe: 2.5, ogolne: 0.5 };

export interface OkresDrgan {
  /** Przyspieszenie drgań, m/s². */
  a: number;
  /** Czas w godzinach. */
  godziny: number;
}

/** A(8) w m/s², z dokładnością do 0,01. */
export function ekspozycjaA8(okresy: OkresDrgan[]): number {
  const wazne = okresy.filter((o) => o.godziny > 0);
  if (!wazne.length) throw new RangeError('Podaj co najmniej jeden okres');
  for (const o of wazne) if (!(o.a >= 0 && o.a <= 100 && o.godziny <= 24)) throw new RangeError('Przyspieszenie 0–100 m/s², czas do 24 h');
  return Math.round(Math.sqrt(wazne.reduce((s, o) => s + o.a * o.a * o.godziny, 0) / 8) * 100) / 100;
}

/** Najdłuższy czas (h) przy danym przyspieszeniu, po którym A(8) osiąga limit. */
export const dopuszczalnyCzasDrgan = (a: number, limit: number) => (a > 0 ? 8 * (limit / a) ** 2 : Infinity);

export function ocenaDrgan(okresy: OkresDrgan[], rodzaj: RodzajDrgan, grupa: GrupaDrgan) {
  const a8 = ekspozycjaA8(okresy);
  const l = LIMITY_DRGAN[rodzaj][grupa];
  const krotkie = okresy.filter((o) => o.godziny > 0 && o.godziny <= 0.5);
  const wzbronione = l.a8 === null;
  const przekroczoneA8 = l.a8 !== null && a8 > l.a8;
  const przekroczoneKrotkie = l.krotka !== null && krotkie.some((o) => o.a > l.krotka!);
  return {
    a8,
    limit: l,
    wzbronione,
    przekroczone: wzbronione || przekroczoneA8 || przekroczoneKrotkie,
    przekroczoneKrotkie,
    powyzejProgu: a8 > PROG_DZIALANIA_DRGAN[rodzaj],
  };
}
