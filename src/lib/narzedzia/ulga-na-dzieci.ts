// Ulga na dzieci w PIT (art. 27f ustawy o podatku dochodowym od osób fizycznych, t.j. Dz.U. 2026 poz. 592; brzmienie
// art. 27f takie samo w t.j. Dz.U. 2025 poz. 163, więc za 2025 i 2026 r. liczymy tak samo; zmiany po t.j. z 2026 r.,
// Dz.U. 2026 poz. 779, 846, 1079, 1098, 1123, 1287 i 1371, nie dotyczą art. 27f):
// - odliczenie od podatku za każdy miesiąc, w którym podatnik wykonywał władzę rodzicielską, był opiekunem prawnym
//   (dziecko z nim mieszkało) albo rodziną zastępczą (ust. 1–2): 92,67 zł na pierwsze i drugie dziecko, 166,67 zł na trzecie,
//   225 zł na czwarte i każde kolejne; kwota w miesiącu zależy od liczby dzieci w tym miesiącu;
// - przy jednym dziecku limit dochodów (ust. 2 pkt 1): 112 000 zł łącznie z małżonkiem przy małżeństwie przez cały rok,
//   112 000 zł dla osoby samotnie wychowującej dziecko (art. 6 ust. 4c), 56 000 zł w innych przypadkach (także małżeństwo
//   przez część roku); dochody to dochody z art. 27, 30b i 30c minus składki społeczne (ust. 2a); „nie przekroczyły”, więc
//   dokładnie 112 000 albo 56 000 zł mieści się w limicie; przekroczenie o złotówkę odbiera całą ulgę;
// - limit nie dotyczy jednego dziecka z orzeczeniem albo decyzją z art. 26 ust. 7d (ust. 2e), a jeśli choć przez jeden dzień
//   roku było więcej niż jedno dziecko, odliczenie przysługuje według pkt 2 albo 3 bez limitu (ust. 2b);
// - kwotę dzielą rodzice w dowolnej proporcji, bez porozumienia po równo albo w całości u rodzica, z którym dziecko mieszka
//   (ust. 4); przy pieczy części miesiąca 1/30 za dzień (ust. 3: nie liczymy dni, tylko pełne miesiące);
// - pełnoletnie dzieci (ust. 6): z zasiłkiem pielęgnacyjnym albo rentą socjalną albo uczące się do 25 lat, jeśli ich dochody
//   (art. 27 i 30b, poza rentą rodzinną) i przychody z art. 21 ust. 1 pkt 148 i 152 nie przekroczyły dwunastokrotności renty
//   socjalnej z grudnia roku podatkowego (art. 6 ust. 4e); renta socjalna = 100% najniższej renty z tytułu całkowitej
//   niezdolności do pracy (art. 6 ust. 1 ustawy o rencie socjalnej, t.j. Dz.U. 2026 poz. 377);
// - gdy ulga jest wyższa niż podatek, różnica wraca do wysokości sumy składek społecznych odliczonych od dochodu, składek
//   zdrowotnych i składek społecznych od przychodów zwolnionych z art. 21 ust. 1 pkt 148 i 152–154 (ust. 8–9); małżonkowie
//   przez cały rok: składki obojga łącznie (ust. 10).
// Przyjęte: dziecko liczy się w miesiącu, który wskaże użytkownik (od–do); w miesiącu, w którym liczymy dwoje albo więcej
// dzieci, przyjmujemy, że choć przez jeden dzień było więcej niż jedno dziecko (ust. 2b). Kwotę ulgi po podziale między
// rodziców zaokrąglamy do grosza.
import { doGrosza } from './dodatek-nocny';
import { zl } from './format';
import { odmiana } from '../redakcja';

/** Kwoty miesięczne z art. 27f ust. 2 (zł). */
export const KWOTY_ULGI = { pierwszeIDrugie: 92.67, trzecie: 166.67, czwarteIKolejne: 225 } as const;

/** Limity dochodów przy jednym dziecku (art. 27f ust. 2 pkt 1). */
export const LIMIT_MALZENSTWO = 112_000;
export const LIMIT_INNY = 56_000;

/**
 * Najniższa renta z tytułu całkowitej niezdolności do pracy w grudniu roku podatkowego (= renta socjalna, art. 6 ust. 1
 * ustawy o rencie socjalnej); dwunastokrotność to limit dochodów pełnoletniego uczącego się dziecka (art. 6 ust. 4e PIT).
 * Kwoty obowiązują od 1 marca do końca lutego następnego roku (komunikaty Prezesa ZUS).
 */
export const RENTA_SOCJALNA_GRUDZIEN: Record<number, { kwota: number; publikator: string }> = {
  2025: { kwota: 1878.91, publikator: 'M.P. 2025 poz. 152' },
  2026: { kwota: 1978.49, publikator: 'M.P. 2026 poz. 220' },
};

export const limitDochoduDziecka = (rok: number) => {
  const r = RENTA_SOCJALNA_GRUDZIEN[rok];
  return r ? doGrosza(r.kwota * 12) : null;
};

/** Lata, za które narzędzia PIT liczą (te same kwoty skali i ulgi; renta socjalna z grudnia każdego roku). */
export const LATA_PIT = Object.keys(RENTA_SOCJALNA_GRUDZIEN).map(Number).sort((a, b) => a - b);

/** Kwota ulgi w miesiącu, w którym ulga przysługuje na `n` dzieci (cała rodzina, przed podziałem między rodziców). */
export function kwotaMiesiaca(n: number): number {
  if (n <= 0) return 0;
  const { pierwszeIDrugie: a, trzecie: b, czwarteIKolejne: c } = KWOTY_ULGI;
  if (n <= 2) return doGrosza(a * n);
  return doGrosza(2 * a + b + c * (n - 3));
}

/**
 * Sytuacja podatnika w roku: małżeństwo przez cały rok, ślub w trakcie roku, samotne wychowywanie dziecka
 * (art. 6 ust. 4c) albo inna (bez małżeństwa).
 */
export type Sytuacja = 'malzenstwo' | 'slub' | 'samotny' | 'inna';

export interface Dziecko {
  /** Pierwszy miesiąc z ulgą (1–12). */
  od: number;
  /** Ostatni miesiąc z ulgą (1–12). */
  do: number;
}

export interface DaneUlgi {
  dzieci: Dziecko[];
  sytuacja: Sytuacja;
  /** Dochody do limitu przy jednym dziecku: Twoje, przy małżeństwie przez cały rok razem z małżonkiem (zł). */
  dochod: number;
  /** Jedno dziecko z orzeczeniem o niepełnosprawności albo decyzją z art. 26 ust. 7d: bez limitu dochodów. */
  orzeczenie?: boolean;
  /** Twoja część ulgi w procentach (0–100), reszta przysługuje drugiemu rodzicowi. */
  czesc: number;
  /** Podatek obliczony według skali (przed ulgą), od którego odliczasz ulgę (zł). */
  podatek: number;
  /** Suma składek, do której wraca niewykorzystana ulga (art. 27f ust. 9; małżonkowie przez cały rok: obojga) (zł). */
  skladki: number;
}

export interface WynikUlgi {
  /** Liczba dzieci z ulgą w każdym miesiącu (indeks 0 = styczeń). */
  miesiace: number[];
  /** Ulga dla rodziny za rok (100%). */
  naRodzine: number;
  /** Limit dochodów, gdy dotyczy (jedno dziecko); null, gdy limitu nie ma. */
  limit: number | null;
  ponadLimit: boolean;
  /** Twoja część ulgi. */
  przysluguje: number;
  /** Odliczone od podatku. */
  odliczenie: number;
  /** Zwrot niewykorzystanej części (do wysokości składek). */
  zwrot: number;
  /** Niewykorzystana część ponad składki: przepada. */
  przepada: number;
}

const miesiacOk = (m: number) => Number.isInteger(m) && m >= 1 && m <= 12;

export function ulgaNaDzieci(d: DaneUlgi): WynikUlgi {
  for (const x of d.dzieci) {
    if (!miesiacOk(x.od) || !miesiacOk(x.do) || x.od > x.do) throw new RangeError('Miesiące dziecka: od 1 do 12, „od” nie później niż „do”');
  }
  if (!(d.czesc >= 0 && d.czesc <= 100)) throw new RangeError('Część ulgi: od 0 do 100%');
  for (const k of ['dochod', 'podatek', 'skladki'] as const) if (!(d[k] >= 0)) throw new RangeError(`${k} nie może być ujemne`);
  const miesiace = Array.from({ length: 12 }, (_, i) => d.dzieci.filter((x) => x.od <= i + 1 && i + 1 <= x.do).length);
  const wiecejNizJedno = miesiace.some((n) => n >= 2);
  const limit = wiecejNizJedno || d.orzeczenie || !d.dzieci.length ? null : d.sytuacja === 'malzenstwo' || d.sytuacja === 'samotny' ? LIMIT_MALZENSTWO : LIMIT_INNY;
  const ponadLimit = limit !== null && d.dochod > limit;
  const naRodzine = ponadLimit ? 0 : doGrosza(miesiace.reduce((s, n) => s + kwotaMiesiaca(n), 0));
  const przysluguje = doGrosza((naRodzine * d.czesc) / 100);
  const odliczenie = Math.min(przysluguje, doGrosza(d.podatek));
  const reszta = doGrosza(przysluguje - odliczenie);
  const zwrot = Math.min(reszta, doGrosza(d.skladki));
  return { miesiace, naRodzine, limit, ponadLimit, przysluguje, odliczenie, zwrot, przepada: doGrosza(reszta - zwrot) };
}

export interface OpisUlgi {
  przysluguje: string;
  opis: string;
  odliczenie: string;
  zwrot: string;
  przepada: string;
  naRodzine: string;
  uwagi: string[];
}

const NAZWY_LIMITU: Record<Sytuacja, string> = {
  malzenstwo: 'Twoje i małżonka razem',
  samotny: 'przy samotnym wychowywaniu dziecka',
  slub: 'Twoje; małżeństwo przez część roku liczy się jak brak małżeństwa',
  inna: 'Twoje',
};

/** Teksty wyniku: te same w HTML ze strony i w skrypcie przeglądarki. */
export function opisUlgi(d: DaneUlgi, rok: number): OpisUlgi {
  const r = ulgaNaDzieci(d);
  const uwagi: string[] = [];
  const miesiecy = r.miesiace.filter((n) => n > 0).length;
  const wynik: OpisUlgi = {
    przysluguje: zl(r.przysluguje),
    opis: '',
    odliczenie: zl(r.odliczenie),
    zwrot: zl(r.zwrot),
    przepada: zl(r.przepada),
    naRodzine: zl(r.naRodzine),
    uwagi,
  };
  if (!d.dzieci.length) {
    wynik.opis = 'dodaj dziecko, na które przysługuje ulga';
    return wynik;
  }
  if (r.ponadLimit && r.limit !== null) {
    wynik.opis = `bez ulgi: przy jednym dziecku dochody (${NAZWY_LIMITU[d.sytuacja]}) przekraczają ${zl(r.limit)}`;
    uwagi.push('Limit dochodów dotyczy tylko jednego dziecka. Przy dwojgu i więcej dzieciach, a także przy dziecku z orzeczeniem o niepełnosprawności, limitu nie ma (art. 27f ust. 2, 2b i 2e).');
  } else {
    const czesc = d.czesc === 100 ? '' : `, Twoja część ${d.czesc}%`;
    wynik.opis = `za ${odmiana(miesiecy, ['miesiąc', 'miesiące', 'miesięcy'])} z ulgą${czesc}`;
    if (r.limit !== null) uwagi.push(`Przy jednym dziecku dochody (${NAZWY_LIMITU[d.sytuacja]}) nie mogą przekroczyć ${zl(r.limit)}; Twoje mieszczą się w limicie.`);
  }
  if (r.zwrot > 0) uwagi.push(`Podatek jest niższy niż ulga, więc urząd skarbowy zwróci ${zl(r.zwrot)} z niewykorzystanej części (do wysokości składek, art. 27f ust. 8–9).`);
  if (r.przepada > 0) uwagi.push(`${zl(r.przepada)} ulgi przepada: zwrot nie może przekroczyć sumy składek.`);
  const limitDziecka = limitDochoduDziecka(rok);
  if (limitDziecka !== null) {
    uwagi.push(`Pełnoletnie uczące się dziecko do 25 lat liczy się, gdy jego dochody w ${rok} r. nie przekroczyły ${zl(limitDziecka)} (12 × renta socjalna z grudnia, ${RENTA_SOCJALNA_GRUDZIEN[rok].publikator}).`);
  }
  return wynik;
}
