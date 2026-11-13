// Emerytura pomostowa: czy spełniasz warunki (ustawa z 19 grudnia 2008 r. o emeryturach pomostowych, tekst jednolity
// Dz.U. 2024 poz. 1696, stan prawny na 30 października 2024 r.; API Sejmu nie podaje zmian po tym tekście):
// - art. 4: urodzenie po 31 grudnia 1948 r., co najmniej 15 lat pracy w szczególnych warunkach lub o szczególnym
//   charakterze, wiek co najmniej 55 lat (kobiety) albo 60 lat (mężczyźni), okres składkowy i nieskładkowy co najmniej
//   20 albo 25 lat (art. 5–9 i 11 ustawy o emeryturach i rentach z FUS), praca w tych warunkach po 31 grudnia 2008 r.;
//   art. 4 pkt 5 (praca przed 1 stycznia 1999 r.) uchyliła ustawa z 28 lipca 2023 r. (Dz.U. 2023 poz. 1667) od 1 stycznia
//   2024 r., a art. 4 pkt 7 (rozwiązanie stosunku pracy) jest uchylony;
// - art. 49: bez pracy po 2008 r. prawo przysługuje, gdy wymagany okres pracy w szczególnych warunkach był w całości
//   przed 1 stycznia 2009 r. (warunek pracy po 2008 r. zastępuje więc pełny okres przed 2009 r.);
// - warunki szczególne: art. 6 (porty morskie, zał. 1 pkt 21 i zał. 2 pkt 12: 55 lat, 15 lat w porcie), art. 7 (hutnictwo,
//   zał. 1 pkt 4–12: 55 lat, 15 lat, orzeczenie lekarza medycyny pracy), art. 8 (zał. 1 pkt 20, 22 i 32: nurkowie, rybacy
//   morscy, azbest: 50/55 lat, 10 lat); w każdym z nich staż 20/25 lat i praca po 2008 r. (art. 4 pkt 1, 4 i 6);
// - art. 3 ust. 4–5: po 2008 r. liczy się praca w pełnym wymiarze czasu pracy; art. 12: bez okresów niewykonywania pracy, za które
//   jest wynagrodzenie albo świadczenie z ubezpieczenia chorobowego i macierzyńskiego; art. 3 ust. 7: praca przed 2009 r. także według art. 32 i 33 ustawy o FUS;
// - art. 15–16: prawo powstaje z dniem spełnienia warunków i ustaje z dniem przed nabyciem emerytury z FUS albo z dniem
//   osiągnięcia 60/65 lat; art. 17: zawieszenie i zmniejszenie jak w art. 103 ust. 3 i 103a–106 ustawy o FUS (także
//   kontynuowanie zatrudnienia u tego samego pracodawcy) oraz zawieszenie przy powrocie do pracy w szczególnych warunkach;
// - art. 21–23: rekompensata (dodatek do kapitału początkowego) przy co najmniej 15 latach pracy w szczególnych warunkach
//   przed 2009 r. według ustawy o FUS, dla osoby bez prawomocnie ustalonego prawa do emerytury pomostowej (art. 2 pkt 5)
//   i bez prawomocnie ustalonego prawa do emerytury (art. 21 ust. 2).
// Interpretacje: lata wpisane z ułamkiem (14,5 roku) porównujemy z progiem wprost; wiek osiąga się w dniu urodzin
// (29 lutego: 28 lutego, art. 112 KC). Przewidywaną datę spełnienia liczymy przy założeniu dalszej pracy w szczególnych
// warunkach w pełnym wymiarze od dziś, brakujące miesiące zaokrąglamy w górę. Nie sprawdzamy art. 5 (lotnictwo), 9
// (maszyniści), 10 (ratownicy górscy), 11 (górnicy) ani 13 (służby mundurowe).

import { odmiana } from '../redakcja';
import { liczba } from './format';
import { dataPoPolsku, dodajLata, dodajMiesiace } from './terminy';

export type Plec = 'k' | 'm';
export type RodzajPrac = 'ogolne' | 'hutnictwo' | 'port' | 'art8';

interface Wymagania {
  wiek: number;
  lataPracy: number;
  przepis: string;
}

export function wymagania(rodzaj: RodzajPrac, plec: Plec): Wymagania {
  if (rodzaj === 'hutnictwo') return { wiek: 55, lataPracy: 15, przepis: 'art. 7' };
  if (rodzaj === 'port') return { wiek: 55, lataPracy: 15, przepis: 'art. 6' };
  if (rodzaj === 'art8') return { wiek: plec === 'k' ? 50 : 55, lataPracy: 10, przepis: 'art. 8' };
  return { wiek: plec === 'k' ? 55 : 60, lataPracy: 15, przepis: 'art. 4' };
}

export const stazWymagany = (plec: Plec) => (plec === 'k' ? 20 : 25);
export const wiekPowszechny = (plec: Plec) => (plec === 'k' ? 60 : 65);

export interface DanePomostowej {
  plec: Plec;
  urodzenie: string;
  rodzaj: RodzajPrac;
  /** Praca w szczególnych warunkach lub o szczególnym charakterze razem (lata). */
  lataSzczegolne: number;
  /** Z tego przed 1 stycznia 2009 r. (lata). */
  przed2009: number;
  /** Okres składkowy i nieskładkowy (lata). */
  staz: number;
  dzis: string;
}

export type StanPomostowej = 'spelnia' | 'wiek' | 'brak' | 'po-wieku' | 'rocznik';

/** Miesiące brakujące do progu w latach, zaokrąglone w górę (0, gdy próg osiągnięty). */
const brakMiesiecy = (mam: number, prog: number) => (mam >= prog ? 0 : Math.ceil(Math.round((prog - mam) * 12 * 1000) / 1000));

export function emeryturaPomostowa(d: DanePomostowej) {
  if (!(d.lataSzczegolne >= 0 && d.przed2009 >= 0 && d.staz >= 0)) throw new RangeError('Okresy nie mogą być ujemne');
  if (d.przed2009 > d.lataSzczegolne) throw new RangeError('Okres przed 2009 r. dłuższy niż cały okres');
  if (d.dzis < d.urodzenie) throw new RangeError('Data urodzenia z przyszłości');
  const w = wymagania(d.rodzaj, d.plec);
  const dataWieku = dodajLata(d.urodzenie, w.wiek);
  const koniec = dodajLata(d.urodzenie, wiekPowszechny(d.plec));
  const staz = stazWymagany(d.plec);
  const po2008 = Math.round((d.lataSzczegolne - d.przed2009) * 1000) / 1000;
  const warunki = {
    rocznik: d.urodzenie > '1948-12-31',
    praca: d.lataSzczegolne >= w.lataPracy,
    wiek: d.dzis >= dataWieku,
    staz: d.staz >= staz,
    // Art. 4 pkt 6 albo art. 49 (cały wymagany okres przed 2009 r.).
    po2008: po2008 > 0 || d.przed2009 >= w.lataPracy,
  };
  const brakPracy = brakMiesiecy(d.lataSzczegolne, w.lataPracy);
  const brakStazu = brakMiesiecy(d.staz, staz);
  // Przy dalszej pracy w szczególnych warunkach od dziś przybywa obu okresów naraz (i pracy po 2008 r.).
  const miesiace = Math.max(brakPracy, brakStazu);
  const najwczesniej = [dataWieku, dodajMiesiace(d.dzis, miesiace)].sort()[1];
  let stan: StanPomostowej;
  if (!warunki.rocznik) stan = 'rocznik';
  else if (d.dzis >= koniec) stan = 'po-wieku';
  else if (warunki.praca && warunki.staz && warunki.po2008) stan = warunki.wiek ? 'spelnia' : 'wiek';
  else stan = 'brak';
  // Wymagane okresy dopiero po 60/65 latach: emerytura pomostowa nie zdąży powstać.
  const zaPozno = stan === 'brak' && najwczesniej >= koniec;
  return { stan, warunki, wymagania: w, stazWymagany: staz, dataWieku, koniec, po2008, brakPracy, brakStazu, najwczesniej, zaPozno, rekompensata: d.przed2009 >= 15 };
}

/** „1 rok”, „2 lata”, „5 lat”, z ułamkiem: „14,5 roku”. */
export const lat = (x: number) => {
  const n = Math.round(x * 100) / 100;
  return Number.isInteger(n) ? odmiana(n, ['rok', 'lata', 'lat']) : `${liczba(n)} roku`;
};

const miesiecy = (m: number) => {
  const l = Math.floor(m / 12);
  const r = m % 12;
  const mies = (n: number) => odmiana(n, ['miesiąc', 'miesiące', 'miesięcy']);
  if (!l) return mies(r);
  return r ? `${lat(l)} i ${mies(r)}` : lat(l);
};

export interface OpisPomostowej {
  stan: string;
  opis: string;
  praca: string;
  wiek: string;
  staz: string;
  po2008: string;
  koniec: string;
  uwagi: string[];
}

const ART_17 =
  'Emerytura pomostowa jest zawieszona, gdy praca trwa dalej u tego samego pracodawcy bez rozwiązania umowy o pracę (art. 17 ust. 1 ustawy i art. 103a ustawy o FUS) i gdy wracasz do pracy w szczególnych warunkach (art. 17 ust. 4); przy innej pracy obowiązują limity dorabiania jak przy wcześniejszej emeryturze.';

/** Teksty wyniku: te same w HTML ze strony i w skrypcie przeglądarki. */
export function opisPomostowej(d: DanePomostowej): OpisPomostowej {
  const r = emeryturaPomostowa(d);
  const w = r.wymagania;
  const tak = (ok: boolean, tekst: string) => `${ok ? 'tak' : 'nie'}: ${tekst}`;
  const o: OpisPomostowej = {
    stan: '',
    opis: '',
    praca: tak(r.warunki.praca, `${lat(d.lataSzczegolne)} z wymaganych ${lat(w.lataPracy)}`),
    wiek: `${w.wiek} lat: ${dataPoPolsku(r.dataWieku)}`,
    staz: tak(r.warunki.staz, `${lat(d.staz)} z wymaganych ${lat(r.stazWymagany)}`),
    po2008: r.po2008 > 0 ? `tak: ${lat(r.po2008)} po 2008 r.` : r.warunki.po2008 ? `nie, ale ${lat(w.lataPracy)} przed 2009 r. (art. 49)` : 'nie: brak pracy po 2008 r. i pełnego okresu przed 2009 r.',
    koniec: dataPoPolsku(r.koniec),
    uwagi: [],
  };
  if (r.stan === 'rocznik') {
    o.stan = 'Nie przysługuje';
    o.opis = 'emerytura pomostowa jest dla osób urodzonych po 31 grudnia 1948 r. (art. 4 pkt 1)';
  } else if (r.stan === 'po-wieku') {
    o.stan = 'Już nie przysługuje';
    o.opis = `prawo do emerytury pomostowej ustaje w dniu ${wiekPowszechny(d.plec)}. urodzin (art. 16 pkt 2); w tym wieku przysługuje emerytura z FUS`;
  } else if (r.stan === 'spelnia') {
    o.stan = 'Spełniasz warunki';
    o.opis = `prawo powstaje z dniem spełnienia warunków (art. 15 ust. 1) i trwa najdłużej do ${dataPoPolsku(r.koniec)}`;
  } else if (r.stan === 'wiek') {
    o.stan = `Od ${dataPoPolsku(r.dataWieku)}`;
    o.opis = `okresy pracy już masz; brakuje wieku ${w.wiek} lat`;
  } else if (r.zaPozno) {
    o.stan = 'Nie zdążysz';
    o.opis = `brakujące okresy uzbierasz najwcześniej ${dataPoPolsku(r.najwczesniej)}, a emerytura pomostowa przysługuje tylko do ${wiekPowszechny(d.plec)}. urodzin`;
  } else {
    const braki = [r.brakPracy ? `${miesiecy(r.brakPracy)} pracy w szczególnych warunkach` : '', r.brakStazu ? `${miesiecy(r.brakStazu)} stażu` : ''].filter(Boolean).join(' i ');
    o.stan = 'Jeszcze nie';
    o.opis = `brakuje ${braki}; przy dalszej pracy w szczególnych warunkach na pełen etat warunki spełnisz najwcześniej ${dataPoPolsku(r.najwczesniej)}`;
  }
  if (d.rodzaj === 'hutnictwo') o.uwagi.push('W hutnictwie potrzebne jest też orzeczenie lekarza medycyny pracy o niezdolności do pracy w szczególnych warunkach z pkt 4–12 załącznika nr 1 (art. 7 pkt 3).');
  if (d.rodzaj === 'port') o.uwagi.push('Liczy się praca w morskim porcie handlowym albo przedsiębiorstwie pomocniczym portu: przeładunek w ładowniach statku (zał. 1 pkt 21) albo obsługa dźwignic portowych (zał. 2 pkt 12) (art. 6).');
  if (r.stan === 'spelnia' || r.stan === 'wiek') o.uwagi.push('Wniosek składasz w ZUS sam albo przez pracodawcę (art. 24).', ART_17);
  if (r.rekompensata && r.stan !== 'spelnia' && r.stan !== 'wiek') {
    o.uwagi.push('Masz co najmniej 15 lat pracy w szczególnych warunkach przed 2009 r., więc możesz mieć prawo do rekompensaty: dodatku do kapitału początkowego ustalanego z wnioskiem o emeryturę (art. 21–23). Nie przysługuje, gdy masz już prawomocnie ustalone prawo do emerytury pomostowej albo do emerytury (art. 2 pkt 5 i art. 21 ust. 2).');
  } else if (r.rekompensata) {
    o.uwagi.push('Rekompensata za pracę przed 2009 r. (art. 21–23) przysługuje tylko osobie bez prawomocnie ustalonego prawa do emerytury pomostowej (art. 2 pkt 5).');
  }
  o.uwagi.push('Liczy się tylko praca z wykazów w załącznikach do ustawy, po 2008 r. na pełen etat, bez okresów niewykonywania pracy, za które dostajesz wynagrodzenie albo zasiłek z ubezpieczenia chorobowego i macierzyńskiego (art. 3 i 12). Okresy potwierdza pracodawca, a o prawie decyduje ZUS.');
  return o;
}
