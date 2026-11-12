// Hałas na stanowisku pracy: poziom ekspozycji odniesiony do 8 godzin (L_EX,8h) z poziomów dźwięku A i czasów ich
// działania, porównany z wartościami z przepisów:
// - NDN: L_EX,8h 85 dB, maksymalny poziom dźwięku A 115 dB, szczytowy poziom dźwięku C 135 dB (załącznik do rozporządzenia
//   z 12 czerwca 2018 r. w sprawie NDS i NDN, Dz.U. 2018 poz. 1286, część B, pkt A.1.3–1.5; zmiany do 2026 r. nie dotyczą hałasu);
// - próg działania: L_EX,8h 80 dB i szczytowy C 135 dB (załącznik do rozporządzenia z 5 sierpnia 2005 r., Dz.U. 2005 nr 157
//   poz. 1318); powyżej progu pracodawca udostępnia ochronniki słuchu, od NDN nadzoruje ich stosowanie (§ 6 ust. 1);
// - kobiety w ciąży: 65 dB, 130 dB(C), 110 dB(A) (Dz.U. 2017 poz. 796, załącznik, cz. III); młodociani: 80 dB, 130 dB(C),
//   110 dB(A) (Dz.U. 2023 poz. 1240, załącznik nr 1, cz. I ust. 2 pkt 6).
// L_EX,8h = 10·lg(Σ (t_i / 8 h) · 10^(L_i/10)): energia dźwięku z całej zmiany odniesiona do 8 godzin, także przy zmianie 12 h.

export type Grupa = 'dorosly' | 'mlodociany' | 'ciaza';

export const LIMITY: Record<Grupa, { lex: number; maksA: number; szczytC: number; nazwa: string }> = {
  dorosly: { lex: 85, maksA: 115, szczytC: 135, nazwa: 'pracownik' },
  mlodociany: { lex: 80, maksA: 110, szczytC: 130, nazwa: 'młodociany' },
  ciaza: { lex: 65, maksA: 110, szczytC: 130, nazwa: 'kobieta w ciąży' },
};
export const PROG_DZIALANIA = 80;
const OSIEM_GODZIN = 8;

export interface Okres {
  /** Równoważny poziom dźwięku A w tym czasie (dB). */
  poziom: number;
  /** Czas w godzinach. */
  godziny: number;
}

/** Poziom ekspozycji odniesiony do 8 godzin (dB), z dokładnością do 0,1 dB. */
export function ekspozycja8h(okresy: Okres[]): number {
  const wazne = okresy.filter((o) => o.godziny > 0);
  if (!wazne.length) throw new RangeError('Podaj co najmniej jeden okres');
  for (const o of wazne) if (!(o.poziom >= 0 && o.poziom <= 160 && o.godziny <= 24)) throw new RangeError('Poziom 0–160 dB, czas do 24 h');
  const energia = wazne.reduce((s, o) => s + (o.godziny / OSIEM_GODZIN) * 10 ** (o.poziom / 10), 0);
  return Math.round(10 * Math.log10(energia) * 10) / 10;
}

/** Najdłuższy czas (h) przy danym poziomie, po którym ekspozycja osiąga limit L_EX,8h. */
export const dopuszczalnyCzas = (poziom: number, limit = LIMITY.dorosly.lex) => OSIEM_GODZIN * 10 ** ((limit - poziom) / 10);

/**
 * Ocena: powyżej progu działania (> 80 dB, § 6 ust. 1 pkt 1: ochronniki udostępnione), osiąga NDN (≥ limitu, § 5 ust. 2
 * i § 6 ust. 1 pkt 2: program i nadzór nad ochronnikami), przekracza (> limitu, § 9: niezwłoczne ograniczenie narażenia;
 * dla młodocianych i kobiet w ciąży: praca wzbroniona).
 */
export function ocenaHalasu(okresy: Okres[], grupa: Grupa, maksA?: number, szczytC?: number) {
  const lex = ekspozycja8h(okresy);
  const l = LIMITY[grupa];
  const przekroczone = lex > l.lex || (maksA ?? 0) > l.maksA || (szczytC ?? 0) > l.szczytC;
  const osiagaNdn = lex >= l.lex || (maksA ?? 0) >= l.maksA || (szczytC ?? 0) >= l.szczytC;
  return {
    lex,
    limit: l,
    przekroczone,
    osiagaNdn,
    powyzejProgu: lex > PROG_DZIALANIA || (szczytC ?? 0) > LIMITY.dorosly.szczytC,
    godziny: okresy.reduce((s, o) => s + (o.godziny > 0 ? o.godziny : 0), 0),
  };
}

/** „7 h 59 min”, „15 min”. */
export function godzinyIMinuty(h: number): string {
  const minuty = Math.floor(h * 60 + 1e-9);
  const g = Math.floor(minuty / 60);
  const m = minuty % 60;
  return [g ? `${g} h` : '', m || !g ? `${m} min` : ''].filter(Boolean).join(' ');
}
