// Zasiłek dla bezrobotnych według ustawy o rynku pracy i służbach zatrudnienia (Dz.U. 2025 poz. 620; późniejsze zmiany
// nie dotyczą art. 218–237). Kwoty z obwieszczeń ministra o waloryzacji z 1 czerwca (art. 228 ust. 4).
// - prawo: 365 dni pracy z co najmniej płacą minimalną w 18 miesiącach przed rejestracją (art. 218 ust. 1);
// - brak prawa po własnym wypowiedzeniu (poza zmianą miejsca zamieszkania i art. 55 § 1 i 1^1 Kp) i po dyscyplinarce
//   z własnej winy (art. 219 ust. 1 pkt 1–2); po porozumieniu stron z innych przyczyn niż upadłość, likwidacja, zmniejszenie
//   zatrudnienia albo przeprowadzka zasiłek dopiero po 90 dniach od rejestracji (art. 220 ust. 1 pkt 5, ust. 2 pkt 3), a okres
//   pobierania skraca się o te dni (art. 225 ust. 3);
// - kwota wyższa w pierwszych 90 dniach posiadania prawa, potem niższa (art. 224 ust. 1); 120% przy co najmniej 20 latach
//   okresów z art. 218 (art. 224 ust. 2); okres 180 albo 365 dni (art. 225 ust. 1);
// - potrącenia: składka zdrowotna 9% od kwoty zasiłku, pobiera urząd pracy (art. 79 ust. 1, art. 81 ust. 8 pkt 5 i art. 85 ust. 6
//   ustawy o świadczeniach opieki zdrowotnej); zaliczka na PIT 12% (art. 35 ust. 1 pkt 5 i ust. 4 ustawy o PIT), podstawa
//   i zaliczka w pełnych złotych (art. 63 § 1 Ordynacji podatkowej). Składki emerytalną i rentową finansuje urząd pracy
//   z Funduszu Pracy (art. 16 ust. 9 ustawy o systemie ubezpieczeń społecznych), więc nie zmniejszają wypłaty.
import { doGrosza } from './dodatek-nocny';
import { dniMiedzy, dodajDni, dodajLata } from './terminy';

export interface KwotyZasilku {
  od: string;
  pierwsze90: number;
  potem: number;
  zrodlo: string;
}

/** Kwoty z art. 224 ust. 1 po waloryzacji, od najstarszej. */
export const KWOTY_ZASILKU: KwotyZasilku[] = [
  { od: '2025-06-01', pierwsze90: 1721.9, potem: 1352.2, zrodlo: 'M.P. 2025 poz. 510' },
  { od: '2026-06-01', pierwsze90: 1783.9, potem: 1400.9, zrodlo: 'M.P. 2026 poz. 268' },
];

export const DNI_KWOTY_WYZSZEJ = 90;
export const KARENCJA_POROZUMIENIE = 90;
export const STAWKA_ZDROWOTNA = 0.09;
export const STAWKA_ZALICZKI = 0.12;

/** Kwoty obowiązujące w dniu `data`; null przed wejściem ustawy albo po 1 czerwca, dla którego nie ogłoszono kwot. */
export function kwotyNa(data: string): KwotyZasilku | null {
  const ostatnie = KWOTY_ZASILKU[KWOTY_ZASILKU.length - 1];
  if (data < KWOTY_ZASILKU[0].od || data >= dodajLata(ostatnie.od, 1)) return null;
  return [...KWOTY_ZASILKU].reverse().find((k) => k.od <= data) ?? null;
}

/** Na rękę: minus 9% składki zdrowotnej i zaliczka 12% od kwoty w pełnych złotych, zaokrąglona do złotego. */
export function naReke(brutto: number) {
  const zdrowotna = doGrosza(brutto * STAWKA_ZDROWOTNA);
  const zaliczka = Math.round(Math.round(brutto) * STAWKA_ZALICZKI);
  return { zdrowotna, zaliczka, netto: doGrosza(brutto - zdrowotna - zaliczka) };
}

export type KoniecPracy = 'pracodawca' | 'porozumienie-zaklad' | 'porozumienie' | 'wypowiedzenie-wlasne' | 'dyscyplinarka';

export interface DaneZasilku {
  rejestracja: string;
  /** 365 dni pracy (albo okresów z art. 218 ust. 2) w 18 miesiącach przed rejestracją. */
  staz365: boolean;
  /** Co najmniej 20 lat okresów z art. 218 ust. 1, ust. 2 pkt 1, 2, 4 i 5. */
  staz20: boolean;
  /** Okres 365 dni z art. 225 ust. 1 pkt 2. */
  okres365: boolean;
  koniec: KoniecPracy;
}

export interface Odcinek {
  od: string;
  do: string;
  dni: number;
  wyzsza: boolean;
  /** Brutto miesięcznie; null, gdy kwoty po waloryzacji jeszcze nie ogłoszono. */
  brutto: number | null;
  netto: number | null;
}

export type WynikZasilku =
  | { prawo: false; powod: 'staz' | 'wypowiedzenie-wlasne' | 'dyscyplinarka' }
  | {
      prawo: true;
      /** Pierwszy dzień wypłaty i ostatni dzień okresu pobierania. */
      wyplataOd: string;
      koniec: string;
      dniOkresu: number;
      dniWyplaty: number;
      karencja: boolean;
      procent: 100 | 120;
      odcinki: Odcinek[];
    };

export function zasilekDlaBezrobotnych(d: DaneZasilku): WynikZasilku {
  if (!kwotyNa(d.rejestracja)) throw new RangeError('Data rejestracji poza okresem znanych kwot');
  if (d.koniec === 'wypowiedzenie-wlasne' || d.koniec === 'dyscyplinarka') return { prawo: false, powod: d.koniec };
  if (!d.staz365) return { prawo: false, powod: 'staz' };
  const dniOkresu = d.okres365 ? 365 : 180;
  const koniec = dodajDni(d.rejestracja, dniOkresu - 1);
  const karencja = d.koniec === 'porozumienie';
  const wyplataOd = karencja ? dodajDni(d.rejestracja, KARENCJA_POROZUMIENIE) : d.rejestracja;
  const procent = d.staz20 ? 120 : 100;
  const odcinki: Odcinek[] = [];
  for (let dzien = wyplataOd; dzien <= koniec; dzien = dodajDni(dzien, 1)) {
    const wyzsza = dniMiedzy(wyplataOd, dzien) < DNI_KWOTY_WYZSZEJ;
    const k = kwotyNa(dzien);
    const brutto = k ? doGrosza(((wyzsza ? k.pierwsze90 : k.potem) * procent) / 100) : null;
    const ostatni = odcinki[odcinki.length - 1];
    if (ostatni && ostatni.wyzsza === wyzsza && ostatni.brutto === brutto) {
      ostatni.do = dzien;
      ostatni.dni++;
    } else odcinki.push({ od: dzien, do: dzien, dni: 1, wyzsza, brutto, netto: brutto === null ? null : naReke(brutto).netto });
  }
  return { prawo: true, wyplataOd, koniec, dniOkresu, dniWyplaty: dniMiedzy(wyplataOd, koniec) + 1, karencja, procent, odcinki };
}
