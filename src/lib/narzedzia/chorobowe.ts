// Wynagrodzenie chorobowe (art. 92 Kp) i zasiłek chorobowy (ustawa zasiłkowa, t.j. Dz.U. 2026 poz. 854) dla pracownika.
// Podstawa: przeciętne miesięczne wynagrodzenie z 12 miesięcy (art. 36 ust. 1) po odliczeniu składek finansowanych przez
// pracownika (art. 3 pkt 3): emerytalnej 9,76%, rentowych 1,5% i chorobowej 2,45% (art. 16 i 22 ustawy o systemie
// ubezpieczeń społecznych), razem 13,71%; przy pełnym etacie nie mniej niż płaca minimalna minus 13,71% (art. 45 ust. 1).
// Za dzień: 1/30 podstawy (art. 36 ust. 3) razy 80% albo 100% (art. 92 § 1 Kp, art. 11 ustawy). Pracodawca płaci do 33 dni
// w roku, po roku 50. urodzin do 14 dni (art. 92 § 1 i 5), dalej zasiłek z ZUS (art. 92 § 4). Od 1 stycznia 2022 r. nie ma
// obniżki do 70% za pobyt w szpitalu (art. 3 pkt 4 ustawy z 24 czerwca 2021 r., Dz.U. 2021 poz. 1621).
import { PLACA_MINIMALNA } from '../../data/prawo';
import { doGrosza } from './dodatek-nocny';

export const SKLADKI_PRACOWNIKA = 13.71;

export type Powod = 'choroba' | 'ciaza' | 'wypadek-w-drodze' | 'dawca';

export const POWODY: Record<Powod, { nazwa: string; procent: number; podstawa: string }> = {
  choroba: { nazwa: 'Choroba (także pobyt w szpitalu)', procent: 80, podstawa: 'art. 92 § 1 pkt 1 Kp, art. 11 ust. 1 ustawy zasiłkowej' },
  ciaza: { nazwa: 'Choroba w czasie ciąży', procent: 100, podstawa: 'art. 92 § 1 pkt 2 Kp, art. 11 ust. 2 pkt 1 ustawy zasiłkowej' },
  'wypadek-w-drodze': { nazwa: 'Wypadek w drodze do pracy lub z pracy', procent: 100, podstawa: 'art. 92 § 1 pkt 2 Kp, art. 11 ust. 2 pkt 3 ustawy zasiłkowej' },
  dawca: { nazwa: 'Badania i zabieg dawcy komórek, tkanek, narządów', procent: 100, podstawa: 'art. 92 § 1 pkt 3 Kp, art. 11 ust. 2 pkt 2 ustawy zasiłkowej' },
};

/** Najdłuższy okres zasiłkowy w dniach (art. 8 ust. 1): 182, w ciąży 270. */
export const okresZasilkowy = (powod: Powod) => (powod === 'ciaza' ? 270 : 182);

/** Najniższa podstawa przy pełnym etacie (art. 45 ust. 1). */
export const minimalnaPodstawa = (rok: number) => doGrosza(PLACA_MINIMALNA[rok].miesiecznie * (1 - SKLADKI_PRACOWNIKA / 100));

export interface DaneChorobowego {
  rok: number;
  /** Przeciętne miesięczne wynagrodzenie brutto (przychód oskładkowany) z 12 miesięcy. */
  brutto: number;
  pelnyEtat?: boolean;
  /** Dni niezdolności do pracy na tym zwolnieniu. */
  dni: number;
  /** Dni niezdolności do pracy w tym roku, za które pracodawca już zapłacił wynagrodzenie chorobowe. */
  wykorzystane?: number;
  /** Rok 50. urodzin minął przed bieżącym rokiem (art. 92 § 5). */
  po50?: boolean;
  powod?: Powod;
}

export function chorobowe(d: DaneChorobowego) {
  const powod = d.powod ?? 'choroba';
  const wykorzystane = d.wykorzystane ?? 0;
  if (!PLACA_MINIMALNA[d.rok]) throw new RangeError(`Brak płacy minimalnej na ${d.rok} r.`);
  if (!(d.brutto > 0)) throw new RangeError('Wynagrodzenie musi być dodatnie');
  if (!(Number.isInteger(d.dni) && d.dni >= 1 && d.dni <= okresZasilkowy(powod))) throw new RangeError('Dni od 1 do końca okresu zasiłkowego');
  if (!(Number.isInteger(wykorzystane) && wykorzystane >= 0 && wykorzystane <= 366)) throw new RangeError('Wykorzystane dni od 0 do 366');
  const wyliczona = doGrosza(d.brutto * (1 - SKLADKI_PRACOWNIKA / 100));
  const minimum = d.pelnyEtat === false ? 0 : minimalnaPodstawa(d.rok);
  const podstawa = Math.max(wyliczona, minimum);
  const procent = POWODY[powod].procent;
  const zaDzien = doGrosza((podstawa / 30) * (procent / 100));
  const limitPracodawcy = d.po50 ? 14 : 33;
  const dniPracodawca = Math.max(0, Math.min(d.dni, limitPracodawcy - wykorzystane));
  const dniZus = d.dni - dniPracodawca;
  return {
    podstawa,
    podstawaPodniesiona: podstawa > wyliczona,
    procent,
    zaDzien,
    limitPracodawcy,
    dniPracodawca,
    dniZus,
    wynagrodzenieChorobowe: doGrosza(zaDzien * dniPracodawca),
    zasilek: doGrosza(zaDzien * dniZus),
    razem: doGrosza(zaDzien * d.dni),
  };
}
