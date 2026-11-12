// Urlop w godzinach przy grafiku zmianowym i urlop na żądanie (Kodeks pracy, tekst jednolity Dz.U. 2026 poz. 1245):
// - wymiar urlopu 20 dni przy zatrudnieniu krócej niż 10 lat i 26 dni przy co najmniej 10 latach (art. 154 § 1);
//   przy niepełnym etacie proporcjonalnie, niepełny dzień w górę (art. 154 § 2);
// - urlopu udziela się w dni pracy według rozkładu, w godzinach odpowiadających dobowemu wymiarowi czasu pracy
//   w danym dniu (art. 154^2 § 1), a jeden dzień urlopu odpowiada 8 godzinom (§ 2);
// - § 1 i 2 stosuje się odpowiednio, gdy dobowa norma z odrębnych przepisów jest niższa niż 8 godzin (§ 3).
//   Odczytanie przepisu: „odpowiednio” rozumiemy tak, że jeden dzień urlopu odpowiada tej niższej normie (np. 7 h);
// - urlop na część dnia pracy tylko wtedy, gdy pozostała część urlopu jest niższa niż pełny dobowy wymiar czasu pracy
//   w dniu, na który ma być udzielony (§ 4). Dlatego plan liczymy zmiana po zmianie w kolejności wierszy: pełna zmiana,
//   dopóki urlopu zostaje co najmniej tyle, ile ona trwa; resztę, krótszą niż zmiana, tylko jako część tej zmiany;
// - urlop na żądanie: pracodawca musi udzielić nie więcej niż 4 dni w roku kalendarzowym, żądanie najpóźniej w dniu
//   rozpoczęcia (art. 167^2); limit łącznie u kolejnych pracodawców w roku (art. 167^3; przy dwóch etatach naraz przepis
//   tego nie rozstrzyga); to część urlopu (art. 168: termin 30 września nie dotyczy
//   „części urlopu udzielanego zgodnie z art. 167^2”), więc zmiana na żądanie zużywa godziny z tej samej puli.
//   Interpretacja: przepis mówi „4 dni urlopu” i nie rozstrzyga, czy dzień na żądanie przy zmianie 12 h to 8 czy 12 godzin.
//   Liczymy dzień na żądanie jako jeden dzień pracy z grafiku, czyli całą zmianę, bo urlopu udziela się w dni pracy
//   w godzinach dobowego wymiaru (art. 154^2 § 1). To wariant korzystniejszy dla pracownika; inny odczyt liczy limit
//   jako 4 × 8 h = 32 h (przy zmianach 12 h: 2 zmiany i 8 h). Dni na żądanie dostępne teraz = mniej z dwóch liczb:
//   4 − wykorzystane i liczba pełnych zmian mieszczących się w urlopie pozostałym po planie (zmiany na żądanie
//   wpisane do planu liczymy z puli tylko raz, w planie). Bez planu nie znamy długości zmiany: same dni.
// - długość zmiany od 1 do 24 h.
// - podział urlopu: co najmniej jedna część 14 kolejnych dni kalendarzowych (art. 162) — tylko informacja na stronie.
// Liczymy w minutach, żeby zmiany po 7,5 h nie dawały błędów zaokrągleń.
import { odmiana } from '../redakcja';
import { godz } from './format';

export const NA_ZADANIE = 4;
export const MAKS_DNI = 99;
export const MIN_ZMIANA = 1;
export const MAKS_ZMIANA = 24;
export type DzienUrlopu = 8 | 7;

export interface Zmiana {
  /** Długość zmiany w godzinach (1–24). */
  dlugosc: number;
  /** Liczba zmian urlopu o tej długości. */
  liczba: number;
  /** Numer wiersza w formularzu (do komunikatu błędu); domyślnie pozycja w tablicy + 1. */
  wiersz?: number;
}

export interface DaneUrlopu {
  dni: number;
  godziny: number;
  dzien: DzienUrlopu;
  plan: Zmiana[];
  naZadanieWykorzystane: number;
}

/** Błąd danych z nazwą pola formularza, którego dotyczy (do aria-invalid). */
export class BladDanych extends RangeError {
  constructor(
    message: string,
    readonly pole: string,
  ) {
    super(message);
    this.name = 'BladDanych';
  }
}

const min = (h: number) => Math.round(h * 60);
const h = (m: number) => m / 60;
const calkowita = (x: number, od: number, do_: number) => Number.isInteger(x) && x >= od && x <= do_;

/** Ile pełnych zmian danej długości mieści się w godzinach i ile zostaje reszty (tylko na część zmiany). */
export function pelneZmiany(godziny: number, dlugosc: number) {
  if (!(dlugosc > 0 && dlugosc <= MAKS_ZMIANA && min(dlugosc) > 0)) throw new RangeError(`Długość zmiany: od ${MIN_ZMIANA} do ${MAKS_ZMIANA} h.`);
  if (!(godziny >= 0)) throw new RangeError('Godziny urlopu nie mogą być ujemne.');
  const g = min(godziny);
  const d = min(dlugosc);
  return { pelne: Math.floor(g / d), reszta: h(g % d) };
}

/** „20 dni”, „19 dni i 1 h”, „4 h”: godziny urlopu w dniach po 8 h (albo po niższej normie). */
export function dniIGodziny(godziny: number, dzien: DzienUrlopu): string {
  const { pelne, reszta } = pelneZmiany(godziny, dzien);
  if (!pelne) return godz(reszta);
  const d = odmiana(pelne, ['dzień', 'dni', 'dni']);
  return reszta ? `${d} i ${godz(reszta)}` : d;
}

export function urlopGodzinowy(dane: DaneUrlopu) {
  const { dni, godziny, dzien, plan, naZadanieWykorzystane } = dane;
  if (dzien !== 8 && dzien !== 7) throw new BladDanych('Dzień urlopu: 8 albo 7 godzin.', 'dzien');
  if (!calkowita(dni, 0, MAKS_DNI)) throw new BladDanych(`Urlop do wykorzystania: pełne dni od 0 do ${MAKS_DNI}.`, 'dni');
  if (!calkowita(godziny, 0, dzien - 1)) throw new BladDanych(`Dodatkowe godziny: pełne godziny od 0 do ${dzien - 1}.`, 'godziny');
  if (!calkowita(naZadanieWykorzystane, 0, NA_ZADANIE)) throw new BladDanych(`Urlop na żądanie: od 0 do ${NA_ZADANIE} dni.`, 'zadanie');
  plan.forEach((z, i) => {
    const n = z.wiersz ?? i + 1;
    if (!(Number.isFinite(z.dlugosc) && z.dlugosc >= MIN_ZMIANA && z.dlugosc <= MAKS_ZMIANA))
      throw new BladDanych(`Wiersz ${n}: długość zmiany od ${MIN_ZMIANA} do ${MAKS_ZMIANA} h.`, `dlugosc${n}`);
    if (!calkowita(z.liczba, 0, 366)) throw new BladDanych(`Wiersz ${n}: liczba zmian od 0 do 366.`, `liczba${n}`);
  });

  const masz = min(dni * dzien + godziny);
  const zmianPlanu = plan.reduce((s, z) => s + z.liczba, 0);
  const planMin = plan.reduce((s, z) => s + min(z.dlugosc) * z.liczba, 0);

  // Plan zmiana po zmianie (art. 154^2 § 4): pełna zmiana, dopóki starcza; reszta tylko jako część jednej zmiany.
  let pula = masz;
  let pokryte = 0;
  let czesc = 0;
  let numerCzesci = 0;
  for (const z of plan) {
    const d = min(z.dlugosc);
    for (let i = 0; i < z.liczba; i++) {
      if (pula >= d) {
        pula -= d;
        pokryte++;
      } else if (pula > 0) {
        czesc = pula;
        numerCzesci = pokryte + 1;
        pula = 0;
      }
    }
  }

  const zostalo = Math.max(0, masz - planMin);
  // Urlop na żądanie: limit roczny i pula pozostała po planie (to część urlopu, art. 168).
  const dlugoscNaZadanie = plan.find((z) => z.liczba > 0)?.dlugosc ?? null;
  const limitNaZadanie = NA_ZADANIE - naZadanieWykorzystane;
  const naZadanie =
    zostalo === 0 ? 0 : dlugoscNaZadanie === null ? limitNaZadanie : Math.min(limitNaZadanie, pelneZmiany(h(zostalo), dlugoscNaZadanie).pelne);
  return {
    dzien,
    masz: h(masz),
    plan: h(planMin),
    zmianPlanu,
    zostalo: h(zostalo),
    brakuje: h(Math.max(0, planMin - masz)),
    /** Zmiany planu wzięte w całości. */
    pokryte,
    /** Godziny urlopu na zmianie wziętej częściowo (0, gdy żadna) i jej numer w planie. */
    czesc: h(czesc),
    numerCzesci,
    zostaloDni: pelneZmiany(h(zostalo), dzien),
    /** Pełne zmiany i reszta w pozostałym urlopie: po 12 i 8 h, przy niższej normie po 7 h. */
    dalej: (dzien === 8 ? [12, 8] : [7]).map((d) => ({ dlugosc: d, ...pelneZmiany(h(zostalo), d) })),
    limitNaZadanie,
    /** Dni na żądanie dostępne teraz: limit roczny i pełne zmiany w pozostałym urlopie. */
    naZadanie,
    /** Długość zmiany na żądanie z pierwszego wypełnionego wiersza planu; null bez planu. */
    dlugoscNaZadanie,
    naZadanieGodziny: dlugoscNaZadanie === null ? null : naZadanie * dlugoscNaZadanie,
  };
}

export type WynikUrlopu = ReturnType<typeof urlopGodzinowy>;

/** Teksty wyniku, te same na serwerze i w przeglądarce (przeglądarka przepuszcza je jeszcze przez typografię). */
export function opisWyniku(r: WynikUrlopu) {
  const zmiany = (n: number) => odmiana(n, ['zmiana', 'zmiany', 'zmian']);
  const dniN = (n: number) => odmiana(n, ['dzień', 'dni', 'dni']);
  const dalej = (x: { pelne: number; reszta: number }) =>
    x.pelne && x.reszta
      ? `${zmiany(x.pelne)} i ${godz(x.reszta)} na część zmiany`
      : x.reszta
        ? `${godz(x.reszta)} na część zmiany`
        : zmiany(x.pelne);
  let naZadanie: string;
  if (!r.limitNaZadanie) naZadanie = 'wykorzystany w tym roku';
  else if (!r.zostalo) naZadanie = `0 dni: plan wykorzystuje cały urlop (limit w tym roku: ${dniN(r.limitNaZadanie)})`;
  else if (r.dlugoscNaZadanie === null)
    naZadanie = `do ${dniN(r.naZadanie)} w ramach pozostałego urlopu; godziny zależą od długości zmiany w grafiku`;
  else if (!r.naZadanie) naZadanie = `0 dni: w pozostałym urlopie nie mieści się cała zmiana ${godz(r.dlugoscNaZadanie)}`;
  else
    naZadanie = `${dniN(r.naZadanie)} w ramach pozostałego urlopu; przy zmianie ${godz(r.dlugoscNaZadanie)} to ${godz(r.naZadanieGodziny ?? 0)}${
      r.naZadanie < r.limitNaZadanie ? ` (limit w tym roku: ${dniN(r.limitNaZadanie)})` : ''
    }`;
  return {
    zostalo: godz(r.zostalo),
    opis: r.brakuje
      ? `Na cały plan brakuje ${godz(r.brakuje)} urlopu`
      : r.zostalo
        ? `To ${dniIGodziny(r.zostalo, r.dzien)} urlopu po ${r.dzien} h`
        : 'Plan wykorzystuje cały urlop',
    masz: r.masz ? `${godz(r.masz)} (${dniIGodziny(r.masz, r.dzien)} po ${r.dzien} h)` : godz(0),
    plan: `${godz(r.plan)} (${zmiany(r.zmianPlanu)})`,
    pokrycie: r.brakuje
      ? `${r.pokryte} z ${r.zmianPlanu} ${r.zmianPlanu === 1 ? 'zmiany' : 'zmian'} w całości${r.czesc ? `, na ${r.numerCzesci}. zmianie tylko ${godz(r.czesc)} urlopu` : ''}; brakuje ${godz(r.brakuje)}`
      : r.zmianPlanu
        ? `tak, ${r.zmianPlanu === 1 ? '' : 'wszystkie '}${zmiany(r.zmianPlanu)}`
        : 'brak planu',
    dalej: r.dalej.map((x) => ({ etykieta: `Jeszcze po ${godz(x.dlugosc)}`, tekst: dalej(x) })),
    naZadanie,
  };
}
