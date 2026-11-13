// Zwolnienia z PIT do 85 528 zł w roku (art. 21 ust. 1 pkt 148 i 152–154, ust. 39, 43–48 ustawy o podatku dochodowym od
// osób fizycznych, t.j. Dz.U. 2026 poz. 592; brzmienie takie samo w t.j. Dz.U. 2025 poz. 163; zmiany po t.j. z 2026 r.
// nie dotyczą tych przepisów):
// - pkt 148, ulga dla młodych: przychody z pracy, zlecenia, praktyk absolwenckich, stażu uczniowskiego i zasiłku
//   macierzyńskiego otrzymane do ukończenia 26. roku życia; według objaśnień MF z 30 grudnia 2022 r. (art. 12 § 4
//   Ordynacji podatkowej) włącznie z dniem 26. urodzin, bez przesunięcia na dzień roboczy; liczy się dzień otrzymania
//   przychodu, nie okres pracy; urodzeni 29 lutego kończą lata 28 lutego (art. 12 § 4: „dzień, który poprzedzałby”);
// - pkt 152, ulga na powrót: cztery kolejne lata od roku przeniesienia miejsca zamieszkania do Polski albo od roku
//   następnego, przy warunkach z ust. 43; tylko dla przeniesienia po 31 grudnia 2021 r. (art. 53 ustawy z 29 października
//   2021 r., Dz.U. 2021 poz. 2105); także działalność (liniowy, skala, ryczałt);
// - pkt 153, rodzina 4+: w roku podatkowym co najmniej czworo dzieci z art. 6 ust. 4c (z ust. 4e i 8), bez dzieci
//   umieszczonych w instytucji całodobowej (ust. 45); informacja o dzieciach w terminie zeznania (ust. 46);
// - pkt 154, pracujący senior: przychody otrzymane po ukończeniu 60 lat (kobieta) albo 65 lat (mężczyzna), gdy z tego
//   tytułu podlega ubezpieczeniom społecznym i mimo nabycia prawa nie otrzymuje emerytury ani renty rodzinnej (lit. a–g);
// - wspólny limit 85 528 zł dla wszystkich czterech zwolnień (ust. 44), osobno dla każdego z małżonków (objaśnienia MF);
//   do limitu nie liczą się przychody z ryczałtem, zwolnione na innej podstawie i z zaniechanym poborem (ust. 39);
// - przy zwolnieniu koszty z pracy i zlecenia najwyżej do części opodatkowanej (art. 22 ust. 3b), a składek społecznych od
//   przychodu zwolnionego nie odlicza się od dochodu (art. 26 ust. 1 pkt 2), za to zwiększają one limit zwrotu ulgi na
//   dzieci (art. 27f ust. 9 pkt 3);
// - płatnik: ulgę dla młodych stosuje sam, chyba że złożysz wniosek o niestosowanie (art. 32 ust. 6), ZUS od zasiłku
//   macierzyńskiego na wniosek (art. 34 ust. 4b); ulgi z pkt 152–154 na oświadczenie (art. 31a ust. 8).
// Przyjęte: przepis o seniorach mówi „po ukończeniu”, a ukończenie lat następuje z upływem dnia urodzin (art. 12 § 4
// Ordynacji, tak MF liczy wiek 26 lat), więc pierwszy dzień ulgi to dzień po 60./65. urodzinach (wariant bezpieczny: bez
// dopłaty); MF w komunikacie prasowym podaje, że wolne są też przychody z dnia urodzin, ale to nie są objaśnienia. Przy
// rodzinie 4+ przepis wymaga czworga dzieci „w roku podatkowym” i nie mówi, przez jaką część roku: liczymy rok, w którym
// warunek był spełniony, i piszemy o tym na stronie.
import { doGrosza } from './dodatek-nocny';
import { zl } from './format';
import { dataPoPolsku, dodajDni, dodajLata, poprawnaData } from './terminy';

export const LIMIT_ZWOLNIEN = 85_528;

export type Zwolnienie = 'mlodzi' | 'powrot' | 'rodzina4' | 'senior';

/** Dzień, w którym kończy się `lata` lat: rocznica urodzin, a dla 29 lutego w roku nieprzestępnym 28 lutego (art. 12 § 4 Ordynacji). */
export function urodziny(dataUrodzenia: string, lata: number): string {
  const [r, m, d] = dataUrodzenia.split('-').map(Number);
  const rok = r + lata;
  const ostatni = new Date(Date.UTC(rok, m, 0)).getUTCDate();
  return `${rok}-${String(m).padStart(2, '0')}-${String(Math.min(d, ostatni)).padStart(2, '0')}`;
}

export interface DaneZwolnienia {
  rok: number;
  zwolnienie: Zwolnienie;
  /** Data urodzenia (RRRR-MM-DD): ulga dla młodych i dla seniorów. */
  dataUrodzenia?: string;
  /** Senior: kobieta 60 lat, mężczyzna 65 lat. */
  kobieta?: boolean;
  /** Senior: nie pobierasz emerytury ani renty rodzinnej. */
  bezEmerytury?: boolean;
  /** Powrót: rok przeniesienia miejsca zamieszkania do Polski. */
  rokPrzeniesienia?: number;
  /** Powrót: ulga od roku następnego po przeniesieniu. */
  odNastepnego?: boolean;
  /** Rodzina 4+: liczba dzieci w roku. */
  dzieci?: number;
  /** Przychody objęte tym zwolnieniem w roku (otrzymane w okresie ulgi), zł. */
  przychody: number;
  /** Przychody zwolnione w tym roku z innej z tych czterech ulg (wspólny limit), zł. */
  inneZwolnione?: number;
}

export type StanZwolnienia = 'caly-rok' | 'czesc-roku' | 'nie';

export interface WynikZwolnienia {
  stan: StanZwolnienia;
  /** Pierwszy i ostatni dzień w roku, w którym przychód może być zwolniony. */
  od: string | null;
  do: string | null;
  /** Lata ulgi na powrót (od–do). */
  lata?: [number, number];
  /** Powód braku ulgi. */
  powod?: string;
  limit: number;
  zwolnione: number;
  opodatkowane: number;
}

export function zwolnienie(d: DaneZwolnienia): WynikZwolnienia {
  if (!(d.przychody >= 0) || !((d.inneZwolnione ?? 0) >= 0)) throw new RangeError('Przychody nie mogą być ujemne');
  const poczatek = `${d.rok}-01-01`;
  const koniec = `${d.rok}-12-31`;
  const limit = Math.max(0, doGrosza(LIMIT_ZWOLNIEN - (d.inneZwolnione ?? 0)));
  const nie = (powod: string): WynikZwolnienia => ({ stan: 'nie', od: null, do: null, powod, limit, zwolnione: 0, opodatkowane: d.przychody });
  let od = poczatek;
  let do_ = koniec;
  let lata: [number, number] | undefined;
  if (d.zwolnienie === 'mlodzi' || d.zwolnienie === 'senior') {
    if (!d.dataUrodzenia || !poprawnaData(d.dataUrodzenia)) throw new RangeError('Podaj datę urodzenia');
    if (d.dataUrodzenia > koniec) return nie('data urodzenia po końcu roku');
  }
  if (d.zwolnienie === 'mlodzi') {
    const u26 = urodziny(d.dataUrodzenia!, 26);
    if (u26 < poczatek) return nie(`26 lat skończone ${dataPoPolsku(u26)}`);
    if (u26 < koniec) do_ = u26;
  } else if (d.zwolnienie === 'senior') {
    const wiek = d.kobieta ? 60 : 65;
    const start = dodajDni(urodziny(d.dataUrodzenia!, wiek), 1);
    if (start > koniec) return nie(`${wiek} lat dopiero ${dataPoPolsku(urodziny(d.dataUrodzenia!, wiek))}`);
    if (!d.bezEmerytury) return nie('ulga jest tylko dla osób, które nie pobierają emerytury ani renty rodzinnej');
    if (start > poczatek) od = start;
  } else if (d.zwolnienie === 'powrot') {
    const r = d.rokPrzeniesienia;
    if (!r || !Number.isInteger(r)) throw new RangeError('Podaj rok przeniesienia miejsca zamieszkania');
    if (r < 2022) return nie('ulga dotyczy przeniesienia miejsca zamieszkania do Polski od 2022 r.');
    const pierwszy = d.odNastepnego ? r + 1 : r;
    lata = [pierwszy, pierwszy + 3];
    if (d.rok < pierwszy) return { ...nie(`ulga zaczyna się w ${pierwszy} r.`), lata };
    if (d.rok > pierwszy + 3) return { ...nie(`ulga skończyła się w ${pierwszy + 3} r.`), lata };
  } else if ((d.dzieci ?? 0) < 4) {
    return nie('ulga wymaga co najmniej czworga dzieci');
  }
  const zwolnione = Math.min(d.przychody, limit);
  return {
    stan: od === poczatek && do_ === koniec ? 'caly-rok' : 'czesc-roku',
    od,
    do: do_,
    lata,
    limit,
    zwolnione,
    opodatkowane: doGrosza(d.przychody - zwolnione),
  };
}

export interface OpisZwolnienia {
  stan: string;
  opis: string;
  okres: string;
  limit: string;
  zwolnione: string;
  opodatkowane: string;
  uwagi: string[];
}

const KTO: Record<Zwolnienie, string> = {
  mlodzi: 'Przychody z pracy, zlecenia, praktyk absolwenckich, stażu uczniowskiego i zasiłku macierzyńskiego (art. 21 ust. 1 pkt 148).',
  powrot: 'Przychody z pracy, zlecenia, działalności (skala, liniowy, ryczałt) i zasiłku macierzyńskiego (art. 21 ust. 1 pkt 152).',
  rodzina4: 'Przychody z pracy, zlecenia, działalności (skala, liniowy, ryczałt) i zasiłku macierzyńskiego (art. 21 ust. 1 pkt 153).',
  senior: 'Przychody z pracy, zlecenia, działalności (skala, liniowy, ryczałt) i zasiłku macierzyńskiego, od których płacisz składki społeczne (art. 21 ust. 1 pkt 154).',
};

/** Teksty wyniku: te same w HTML ze strony i w skrypcie przeglądarki. */
export function opisZwolnienia(d: DaneZwolnienia): OpisZwolnienia {
  const r = zwolnienie(d);
  const uwagi: string[] = [KTO[d.zwolnienie]];
  const o: OpisZwolnienia = {
    stan: '',
    opis: '',
    okres: '—',
    limit: zl(r.limit),
    zwolnione: zl(r.zwolnione),
    opodatkowane: zl(r.opodatkowane),
    uwagi,
  };
  if (r.stan === 'nie') {
    o.stan = 'Nie przysługuje';
    o.opis = r.powod ?? '';
    if (r.lata) o.okres = `${r.lata[0]}–${r.lata[1]}`;
    return o;
  }
  o.stan = r.stan === 'caly-rok' ? `Cały ${d.rok} r.` : r.od !== `${d.rok}-01-01` ? `Od ${dataPoPolsku(r.od!)}` : `Do ${dataPoPolsku(r.do!)}`;
  o.okres = r.lata ? `${r.lata[0]}–${r.lata[1]}` : `${dataPoPolsku(r.od!)}–${dataPoPolsku(r.do!)}`;
  o.opis = r.opodatkowane > 0 ? `ponad limit ${zl(r.opodatkowane)} przychodu jest opodatkowane według skali` : 'cały wpisany przychód mieści się w limicie';
  if (d.zwolnienie === 'mlodzi' && r.stan === 'czesc-roku') {
    uwagi.push('Liczy się dzień otrzymania pieniędzy: pensja za pracę przed urodzinami wypłacona po nich nie jest już zwolniona (objaśnienia MF z 30 grudnia 2022 r.).');
  }
  if (d.zwolnienie === 'senior') {
    uwagi.push('Przepis mówi „po ukończeniu” 60 albo 65 lat, więc liczymy od dnia po urodzinach. Ministerstwo Finansów w komunikacie podaje, że zwolnione są też przychody z dnia urodzin.');
  }
  if (d.zwolnienie === 'rodzina4') {
    uwagi.push('Przepis wymaga czworga dzieci w roku podatkowym i nie mówi, przez jaką część roku. Informację o dzieciach składasz w terminie zeznania (PIT/DZ), chyba że podasz je w zeznaniu (art. 21 ust. 46 i 48).');
  }
  if (d.zwolnienie === 'powrot') uwagi.push('Warunki: przez 3 lata przed rokiem przeprowadzki i do jej dnia bez miejsca zamieszkania w Polsce, obywatelstwo polskie albo innego państwa UE, EOG lub Szwajcarii, Karta Polaka albo zamieszkanie w krajach wymienionych w przepisie, certyfikat rezydencji, ulga wykorzystana pierwszy raz (art. 21 ust. 43).');
  uwagi.push('Limit 85 528 zł jest wspólny dla ulgi dla młodych, na powrót, dla rodzin 4+ i dla seniorów (art. 21 ust. 44).');
  return o;
}
