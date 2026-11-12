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
// - urlop na żądanie: najwyżej 4 dni w roku kalendarzowym, żądanie najpóźniej w dniu rozpoczęcia (art. 167^2), łącznie
//   u wszystkich kolejnych pracodawców w roku (art. 167^3); to część urlopu (art. 168: termin 30 września nie dotyczy
//   „części urlopu udzielanego zgodnie z art. 167^2”), więc zmiana na żądanie zużywa godziny z tej samej puli.
//   Interpretacja: przepis mówi „4 dni urlopu” i nie rozstrzyga, czy dzień na żądanie przy zmianie 12 h to 8 czy 12 godzin.
//   Liczymy dzień na żądanie jako jeden dzień pracy z grafiku, czyli całą zmianę, bo urlopu udziela się w dni pracy
//   w godzinach dobowego wymiaru (art. 154^2 § 1). To wariant, w którym pracownik ma wolną całą zmianę.
// - podział urlopu: co najmniej jedna część 14 kolejnych dni kalendarzowych (art. 162) — tylko informacja na stronie.
// Liczymy w minutach, żeby zmiany po 7,5 h nie dawały błędów zaokrągleń.
import { odmiana } from '../redakcja';
import { godz } from './format';

export const NA_ZADANIE = 4;
export const MAKS_DNI = 99;
export type DzienUrlopu = 8 | 7;

export interface Zmiana {
  /** Długość zmiany w godzinach (0 < h ≤ 24). */
  dlugosc: number;
  /** Liczba zmian urlopu o tej długości. */
  liczba: number;
}

export interface DaneUrlopu {
  dni: number;
  godziny: number;
  dzien: DzienUrlopu;
  plan: Zmiana[];
  naZadanieWykorzystane: number;
}

const min = (h: number) => Math.round(h * 60);
const h = (m: number) => m / 60;
const calkowita = (x: number, od: number, do_: number) => Number.isInteger(x) && x >= od && x <= do_;

/** Ile pełnych zmian danej długości mieści się w godzinach i ile zostaje reszty (tylko na część zmiany). */
export function pelneZmiany(godziny: number, dlugosc: number) {
  if (!(dlugosc > 0 && dlugosc <= 24)) throw new RangeError('Długość zmiany: więcej niż 0 i najwyżej 24 h.');
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
  if (dzien !== 8 && dzien !== 7) throw new RangeError('Dzień urlopu: 8 albo 7 godzin.');
  if (!calkowita(dni, 0, MAKS_DNI)) throw new RangeError(`Urlop do wykorzystania: pełne dni od 0 do ${MAKS_DNI}.`);
  if (!calkowita(godziny, 0, dzien - 1)) throw new RangeError(`Dodatkowe godziny: od 0 do ${dzien - 1}.`);
  if (!calkowita(naZadanieWykorzystane, 0, NA_ZADANIE)) throw new RangeError(`Urlop na żądanie: od 0 do ${NA_ZADANIE} dni.`);
  plan.forEach((z, i) => {
    if (!(Number.isFinite(z.dlugosc) && z.dlugosc > 0 && z.dlugosc <= 24)) throw new RangeError(`Zmiana ${i + 1}: długość od 0 do 24 h.`);
    if (!calkowita(z.liczba, 0, 366)) throw new RangeError(`Zmiana ${i + 1}: liczba zmian od 0 do 366.`);
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
  const dlugoscNaZadanie = plan.find((z) => z.liczba > 0)?.dlugosc ?? plan[0]?.dlugosc ?? 12;
  const naZadanie = NA_ZADANIE - naZadanieWykorzystane;
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
    po12: pelneZmiany(h(zostalo), 12),
    po8: pelneZmiany(h(zostalo), 8),
    naZadanie,
    dlugoscNaZadanie,
    /** Godziny z puli, które zużyje pozostały urlop na żądanie, gdy każdy dzień to cała zmiana. */
    naZadanieGodziny: naZadanie * dlugoscNaZadanie,
  };
}

export type WynikUrlopu = ReturnType<typeof urlopGodzinowy>;

/** Teksty wyniku, te same na serwerze i w przeglądarce (przeglądarka przepuszcza je jeszcze przez typografię). */
export function opisWyniku(r: WynikUrlopu) {
  const zmiany = (n: number) => odmiana(n, ['zmiana', 'zmiany', 'zmian']);
  const dalej = (x: { pelne: number; reszta: number }) =>
    x.reszta ? `${zmiany(x.pelne)} i ${godz(x.reszta)} na część zmiany` : zmiany(x.pelne);
  return {
    zostalo: godz(r.zostalo),
    opis: r.brakuje
      ? `Na cały plan brakuje ${godz(r.brakuje)} urlopu`
      : `To ${dniIGodziny(r.zostalo, r.dzien)} urlopu po ${r.dzien} h`,
    masz: `${godz(r.masz)} (${dniIGodziny(r.masz, r.dzien)} po ${r.dzien} h)`,
    plan: `${godz(r.plan)} (${zmiany(r.zmianPlanu)})`,
    pokrycie: r.brakuje
      ? `${r.pokryte} z ${r.zmianPlanu} zmian w całości${r.czesc ? `, na ${r.numerCzesci}. zmianie tylko ${godz(r.czesc)} urlopu` : ''}; brakuje ${godz(r.brakuje)}`
      : r.zmianPlanu
        ? `tak, ${r.zmianPlanu === 1 ? '' : 'wszystkie '}${zmiany(r.zmianPlanu)}`
        : 'brak planu',
    po12: dalej(r.po12),
    po8: dalej(r.po8),
    naZadanie: r.naZadanie
      ? `${odmiana(r.naZadanie, ['dzień', 'dni', 'dni'])}; przy zmianie ${godz(r.dlugoscNaZadanie)} to do ${godz(r.naZadanieGodziny)} z puli`
      : 'wykorzystany w tym roku',
  };
}
