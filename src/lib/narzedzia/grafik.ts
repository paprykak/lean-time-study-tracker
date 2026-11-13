// Kontrola grafiku zmian w miesiącu (okres rozliczeniowy = miesiąc): godziny a wymiar (art. 130), najwyżej 12 h na dobę
// w systemie równoważnym (art. 135), odpoczynek dobowy 11 h (art. 132 § 1) i tygodniowy 35 h, przy zmianie zmiany
// co najmniej 24 h (art. 133 § 1–2), niedziela wolna co najmniej raz na 4 tygodnie (art. 151^12), liczba dni wolnych
// (art. 147), ponowna praca w tej samej dobie pracowniczej (art. 128 § 3 pkt 1). Czas w minutach od 1. dnia miesiąca, 0:00.
import { dniWMiesiacu, wymiarMiesiaca } from './czas-pracy';

export const ZMIANY = {
  D: { nazwa: 'Dzień 6:00–18:00', start: 6 * 60, dlugosc: 12 * 60 },
  N: { nazwa: 'Noc 18:00–6:00', start: 18 * 60, dlugosc: 12 * 60 },
  R: { nazwa: 'Rano 6:00–14:00', start: 6 * 60, dlugosc: 8 * 60 },
  P: { nazwa: 'Popołudnie 14:00–22:00', start: 14 * 60, dlugosc: 8 * 60 },
  O: { nazwa: 'Noc 22:00–6:00', start: 22 * 60, dlugosc: 8 * 60 },
} as const;

export type KodZmiany = keyof typeof ZMIANY;
/** Kod dnia w grafiku: zmiana albo W (wolne). */
export type KodDnia = KodZmiany | 'W';

/** Wzory rotacji: kolejne dni cyklu. */
export const WZORY = {
  // `krotko` do listy wyboru (telefon ucina długie opcje), `nazwa` w opisie pod polem i w FAQ.
  'czterobrygadowy-12': { krotko: '12 h: 2 dni, 2 noce, 4 wolne', nazwa: 'Czterobrygadowy 12 h: 2 dni, 2 noce, 4 wolne', cykl: ['D', 'D', 'N', 'N', 'W', 'W', 'W', 'W'] as KodDnia[] },
  'dzien-noc-12': { krotko: '12 h: dzień, noc, 2 wolne', nazwa: '12 h: dzień, noc, 2 wolne', cykl: ['D', 'N', 'W', 'W'] as KodDnia[] },
  'trzyzmianowy-8': { krotko: '8 h: trzy zmiany tygodniami', nazwa: 'Trzyzmianowy 8 h: tydzień rano, tydzień popołudnie, tydzień noc', cykl: [...'RRRRRWW', ...'PPPPPWW', ...'OOOOOWW'] as KodDnia[] },
} as const;

export type Wzor = keyof typeof WZORY;

/** Grafik na miesiąc z wzoru; `przesuniecie` = dzień cyklu przypadający na 1. dzień miesiąca (0 = pierwszy). */
export function grafikZWzoru(rok: number, miesiac: number, wzor: Wzor, przesuniecie = 0): KodDnia[] {
  const cykl = WZORY[wzor].cykl;
  return Array.from({ length: dniWMiesiacu(rok, miesiac) }, (_, i) => cykl[(i + przesuniecie) % cykl.length]);
}

export type Stan = 'ok' | 'uwaga' | 'blad';

export interface Kontrola {
  id: 'godziny' | 'doba' | 'odpoczynek-dobowy' | 'ta-sama-doba' | 'odpoczynek-tygodniowy' | 'niedziela' | 'dni-wolne';
  stan: Stan;
  tytul: string;
  opis: string;
  podstawa: string;
  /** Dni miesiąca, których dotyczy (1–31). */
  dni: number[];
}

export interface WynikGrafiku {
  godziny: number;
  wymiar: number;
  zmian: number;
  dniWolnych: number;
  kontrole: Kontrola[];
}

const H = 60;
const DOBA = 24 * H;

export function sprawdzGrafik(rok: number, miesiac: number, dni: KodDnia[]): WynikGrafiku {
  const liczbaDni = dniWMiesiacu(rok, miesiac);
  if (dni.length !== liczbaDni) throw new RangeError(`Grafik ma mieć ${liczbaDni} dni`);
  const wymiar = wymiarMiesiaca(rok, miesiac).godziny;
  const zmiany = dni
    .map((k, i) => (k === 'W' ? null : { dzien: i + 1, s: i * DOBA + ZMIANY[k].start, e: i * DOBA + ZMIANY[k].start + ZMIANY[k].dlugosc }))
    .filter((z): z is { dzien: number; s: number; e: number } => z !== null);
  const godziny = zmiany.reduce((s, z) => s + (z.e - z.s) / H, 0);
  const kontrole: Kontrola[] = [];

  // Godziny a wymiar
  const roznica = godziny - wymiar;
  kontrole.push({
    id: 'godziny',
    stan: roznica === 0 ? 'ok' : 'uwaga',
    tytul: roznica === 0 ? `Godziny zgodne z wymiarem: ${godziny} h` : roznica > 0 ? `${roznica} h ponad wymiar ${wymiar} h` : `${-roznica} h poniżej wymiaru ${wymiar} h`,
    opis:
      roznica > 0
        ? 'Praca ponad wymiar to godziny nadliczbowe z dodatkiem 50% albo 100%, dopuszczalne tylko przy akcji ratowniczej, usuwaniu awarii albo szczególnych potrzebach pracodawcy.'
        : roznica < 0
          ? 'Grafik nie wyczerpuje wymiaru w okresie rozliczeniowym: pracodawca planuje pracę w liczbie godzin równej wymiarowi.'
          : 'Suma godzin z grafiku równa się wymiarowi czasu pracy w miesiącu.',
    podstawa: roznica > 0 ? 'art. 130, art. 151 § 1 i art. 151^1 Kodeksu pracy' : 'art. 130 Kodeksu pracy',
    dni: [],
  });

  // Najwyżej 12 h na dobę
  const za_dlugie = zmiany.filter((z) => z.e - z.s > 12 * H).map((z) => z.dzien);
  kontrole.push({
    id: 'doba',
    stan: za_dlugie.length ? 'blad' : 'ok',
    tytul: za_dlugie.length ? 'Zmiany dłuższe niż 12 godzin' : 'Zmiany nie dłuższe niż 12 godzin',
    opis: 'W systemie równoważnym dobowy wymiar można przedłużyć najwyżej do 12 godzin.',
    podstawa: 'art. 135 § 1 Kodeksu pracy',
    dni: za_dlugie,
  });

  // Odpoczynek dobowy i ta sama doba
  const krotkiOdpoczynek: number[] = [];
  const tasamaDoba: number[] = [];
  for (let i = 0; i + 1 < zmiany.length; i++) {
    const a = zmiany[i];
    const b = zmiany[i + 1];
    if (b.s - a.e < 11 * H) krotkiOdpoczynek.push(b.dzien);
    if (b.s - a.s < DOBA) tasamaDoba.push(b.dzien);
  }
  kontrole.push({
    id: 'odpoczynek-dobowy',
    stan: krotkiOdpoczynek.length ? 'blad' : 'ok',
    tytul: krotkiOdpoczynek.length ? 'Za krótki odpoczynek między zmianami' : 'Co najmniej 11 h odpoczynku między zmianami',
    opis: 'W każdej dobie pracownikowi przysługuje co najmniej 11 godzin nieprzerwanego odpoczynku.',
    podstawa: 'art. 132 § 1 Kodeksu pracy',
    dni: krotkiOdpoczynek,
  });
  kontrole.push({
    id: 'ta-sama-doba',
    stan: tasamaDoba.length ? 'uwaga' : 'ok',
    tytul: tasamaDoba.length ? 'Zmiana zaczyna się w tej samej dobie co poprzednia' : 'Każda zmiana zaczyna się w nowej dobie',
    opis: 'Doba to 24 godziny od rozpoczęcia pracy. Praca ponownie podjęta w tej samej dobie ponad jej wymiar to godziny nadliczbowe.',
    podstawa: 'art. 128 § 3 pkt 1 i art. 151 § 1 Kodeksu pracy',
    dni: tasamaDoba,
  });

  // Odpoczynek tygodniowy: tygodnie od 1. dnia miesiąca (art. 128 § 3 pkt 2), tylko pełne tygodnie.
  const koniecMiesiaca = liczbaDni * DOBA;
  const przerwy: { od: number; do: number }[] = [];
  let poprzedniKoniec = 0;
  for (const z of zmiany) {
    przerwy.push({ od: poprzedniKoniec, do: z.s });
    poprzedniKoniec = Math.max(poprzedniKoniec, z.e);
  }
  przerwy.push({ od: poprzedniKoniec, do: koniecMiesiaca });
  const tygodnieKrotkie: number[] = [];
  const tygodnie24: number[] = [];
  for (let t = 0; (t + 1) * 7 <= liczbaDni; t++) {
    const a = t * 7 * DOBA;
    const b = a + 7 * DOBA;
    // Liczy się część przerwy, która mieści się w tym tygodniu.
    const najdluzsza = Math.max(0, ...przerwy.map((p) => Math.min(p.do, b) - Math.max(p.od, a)));
    if (najdluzsza < 24 * H) tygodnieKrotkie.push(t * 7 + 1);
    else if (najdluzsza < 35 * H) tygodnie24.push(t * 7 + 1);
  }
  kontrole.push({
    id: 'odpoczynek-tygodniowy',
    stan: tygodnieKrotkie.length ? 'blad' : tygodnie24.length ? 'uwaga' : 'ok',
    tytul: tygodnieKrotkie.length
      ? 'Tydzień bez 24 godzin odpoczynku'
      : tygodnie24.length
        ? 'Tydzień z odpoczynkiem 24–35 h'
        : 'W każdym tygodniu co najmniej 35 h odpoczynku',
    opis: 'W każdym tygodniu przysługuje co najmniej 35 godzin nieprzerwanego odpoczynku; przy przejściu na inną zmianę może być krótszy, ale nie krótszy niż 24 godziny. Tygodnie liczymy od 1. dnia miesiąca; ostatnie dni ponad pełne tygodnie pomijamy.',
    podstawa: 'art. 133 § 1 i 2 oraz art. 128 § 3 pkt 2 Kodeksu pracy',
    dni: [...tygodnieKrotkie, ...tygodnie24],
  });

  // Niedziele: praca w niedzielę = zmiana nakładająca się na 24 h od 6:00 w niedzielę (art. 133 § 3, art. 151^9 § 2).
  const niedziele = Array.from({ length: liczbaDni }, (_, i) => i + 1).filter((d) => new Date(Date.UTC(rok, miesiac - 1, d)).getUTCDay() === 0);
  const pracujace = niedziele.filter((d) => {
    const a = (d - 1) * DOBA + 6 * H;
    const b = a + DOBA;
    return zmiany.some((z) => z.s < b && z.e > a);
  });
  let seria = 0;
  let naruszenie: number[] = [];
  for (const d of niedziele) {
    if (pracujace.includes(d)) {
      seria++;
      if (seria >= 4 && !naruszenie.length) naruszenie = niedziele.filter((x) => x <= d && pracujace.includes(x)).slice(-4);
    } else seria = 0;
  }
  kontrole.push({
    id: 'niedziela',
    stan: naruszenie.length ? 'blad' : 'ok',
    tytul: naruszenie.length ? 'Cztery niedziele pracujące z rzędu' : pracujace.length ? `Niedziele pracujące: ${pracujace.length} z ${niedziele.length}, z wolną co 4 tygodnie` : 'Bez pracy w niedziele',
    opis: 'Pracownik pracujący w niedziele powinien mieć co najmniej raz na 4 tygodnie wolną niedzielę (nie dotyczy pracy w weekendy z art. 144). Niedziela to 24 godziny od 6:00, chyba że pracodawca ustalił inną godzinę.',
    podstawa: 'art. 151^12 i art. 133 § 3 Kodeksu pracy',
    dni: naruszenie,
  });

  // Dni wolne: co najmniej tyle, ile dni w miesiącu poza dniami pracy z wymiaru (niedziele, święta, wolne soboty).
  const dniWolnych = dni.filter((k) => k === 'W').length;
  const wymagane = liczbaDni - wymiar / 8;
  kontrole.push({
    id: 'dni-wolne',
    stan: dniWolnych >= wymagane ? 'ok' : 'blad',
    tytul: `Dni wolne: ${dniWolnych}, wymagane co najmniej ${wymagane}`,
    opis: 'Gdy rozkład obejmuje pracę w niedziele i święta, liczba dni wolnych w okresie rozliczeniowym musi być co najmniej równa liczbie niedziel, świąt i dni wolnych z przeciętnie pięciodniowego tygodnia.',
    podstawa: 'art. 147 Kodeksu pracy',
    dni: [],
  });

  return { godziny, wymiar, zmian: zmiany.length, dniWolnych, kontrole };
}
