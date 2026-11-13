// Odpracowanie wyjścia prywatnego (Kodeks pracy, t.j. Dz.U. 2026 poz. 1245):
// - czas odpracowania zwolnienia od pracy udzielonego na wniosek pracownika złożony w postaci papierowej lub
//   elektronicznej w celu załatwienia spraw osobistych nie jest pracą w godzinach nadliczbowych; odpracowanie nie może
//   naruszać prawa do odpoczynku z art. 132 i 133 (art. 151 § 2^1);
// - co najmniej 11 h nieprzerwanego odpoczynku w każdej dobie (art. 132 § 1) i 35 h w każdym tygodniu, obejmujących
//   11 h odpoczynku dobowego (art. 133 § 1);
// - doba = 24 kolejne godziny od godziny rozpoczęcia pracy według rozkładu, tydzień = 7 kolejnych dni kalendarzowych
//   od pierwszego dnia okresu rozliczeniowego (art. 128 § 3 pkt 1 i 2);
// - praca ponad normy to nadgodziny (art. 151 § 1); wynagrodzenie za pracę wykonaną, za czas niewykonywania pracy tylko
//   wtedy, gdy przepisy tak stanowią (art. 80); praca w niedziele i święta tylko w przypadkach z art. 151^10;
// - święta: ustawa o dniach wolnych od pracy (`swieta()` z czas-pracy.ts).
//
// Przyjęte założenia (model):
// - rozkład: ta sama zmiana od `start` do `koniec` w dni pracy pon–pt bez świąt (święto w dzień pracy = dzień wolny);
//   koniec ≤ początek oznacza zmianę przez północ; długość zmiany 1–12 h;
// - okresy rozliczeniowe 1, 2, 3, 4, 6, 12 miesięcy liczone od stycznia (`okresZawierajacy`);
// - wyjście: data = dzień, w którym zaczyna się zmiana (przy zmianie nocnej godziny po północy należą do tej zmiany);
//   musi mieścić się w godzinach pracy dnia pracy;
// - odpracowanie: do 3 wierszy (data początku, od, do; do ≤ od = przez północ); nie może nachodzić na godziny pracy
//   z rozkładu ani na inne wiersze;
// - oś czasu w minutach od 2000-01-01 0:00; praca = zmiany z rozkładu minus wyjście plus wiersze odpracowania;
// - odpoczynek dobowy: dla doby od godziny rozpoczęcia pracy w dniu pracy (okno 24 h), która dotyka wiersza odpracowania
//   albo jest dobą wyjścia, najdłuższa przerwa bez pracy w oknie (przerwy na krawędziach tylko w części w oknie) < 11 h
//   = naruszenie. Dla odpracowania w dzień wolny doba zaczyna się z początkiem pierwszego wiersza w tym dniu (przepis
//   definiuje dobę od godziny rozpoczęcia pracy według rozkładu, a w dniu wolnym rozkład jej nie wyznacza);
// - odpoczynek tygodniowy: dla każdego tygodnia z odpracowaniem najdłuższa przerwa w oknie 7 dni od 0:00. Ostatni
//   tydzień okresu może sięgać do następnego okresu: liczymy pełne 7 dni. Skrócenie do 24 h (art. 133 § 2) przy stałym
//   rozkładzie bez zmiany pory pracy nie dotyczy. Gdy już sam rozkład nie daje 35 h przerwy w całości wewnątrz tygodnia
//   (np. tydzień od niedzieli dzieli weekend na dwa tygodnie), odpracowanie, które tę przerwę skraca, dostaje stan
//   „uwaga”, a nie „błąd”: przepis nie mówi, jak liczyć przerwę na przełomie tygodni, a art. 151 § 2^1 zakazuje
//   naruszenia odpoczynku przez odpracowanie; błąd = odpracowanie odbiera 35 h, które rozkład w tym tygodniu daje;
// - informacje (stan „uwaga”, nie blokują): odpracowanie w dzień wolny z rozkładu, w niedzielę albo święto
//   (art. 151^10 i 151^11), w innym okresie rozliczeniowym niż wyjście; w wolną sobotę dodatkowo stanowisko poradnika
//   ministerstwa pracy (rodzinaipraca.gov.pl): praca w dniu wolnym z pięciodniowego tygodnia daje prawo do innego dnia
//   wolnego (art. 151^3), więc odpracowania w ten dzień się odradza;
// - wiersze przed wyjściem: art. 151 § 2^1 mówi o odpracowaniu zwolnienia „udzielonego”, więc ich nie liczymy do bilansu
//   (wariant bezpieczny dla pracownika: praca ponad normy może być wtedy nadgodzinami, art. 151 § 1).
import { minuty, swieta } from './czas-pracy';
import { dataPoPolsku, dniMiedzy, dodajDni, poprawnaData } from './terminy';
import { okresZawierajacy, rodzajDnia } from './niedziela-swieto';
import { odmiana } from '../redakcja';

export const H = 60;
export const DOBA = 24 * H;
export const ODPOCZYNEK_DOBOWY = 11 * H;
export const ODPOCZYNEK_TYGODNIOWY = 35 * H;
export const OKRESY = [1, 2, 3, 4, 6, 12] as const;
export const MAKS_WIERSZY = 3;

export interface Wiersz {
  data: string;
  od: string;
  do: string;
  /** Numer wiersza w formularzu (gdy puste wiersze pominięto); domyślnie kolejny. */
  nr?: number;
}

export interface DaneOdpracowania {
  /** Rozkład: godzina rozpoczęcia i zakończenia zmiany („7:00”). */
  start: string;
  koniec: string;
  /** Okres rozliczeniowy w miesiącach (od stycznia). */
  okres: number;
  wyjscie: Wiersz;
  odpracowanie: Wiersz[];
}

export type Stan = 'ok' | 'uwaga' | 'blad';

export interface Kontrola {
  id: 'bilans' | 'odpoczynek-dobowy' | 'odpoczynek-tygodniowy' | 'dzien-wolny' | 'niedziela-swieto' | 'okres' | 'przed-wyjsciem';
  stan: Stan;
  tytul: string;
  opis: string;
  /** Numer przepisu z indeksem zapisany „151^10”. */
  podstawa: string;
  szczegoly: string[];
}

export interface Doba {
  /** Początek doby (minuty od 2000-01-01 0:00). */
  od: number;
  najdluzsza: number;
  wolny: boolean;
}

export interface Tydzien {
  od: string;
  najdluzsza: number;
  /** Najdłuższa przerwa w tym tygodniu według samego rozkładu (bez wyjścia i odpracowania). */
  rozklad: number;
}

export interface WynikOdpracowania {
  wyjscie: number;
  odpracowane: number;
  /** odpracowane − wyjście */
  roznica: number;
  zostalo: number;
  nadwyzka: number;
  doby: Doba[];
  tygodnie: Tydzien[];
  kontrole: Kontrola[];
}

interface Odcinek {
  a: number;
  b: number;
}

const EPOKA = '2000-01-01';
const chwila = (data: string, min: number) => dniMiedzy(EPOKA, data) * DOBA + min;
export const dataZ = (t: number) => dodajDni(EPOKA, Math.floor(t / DOBA));
export const godzinaZ = (t: number) => {
  const m = ((t % DOBA) + DOBA) % DOBA;
  return `${Math.floor(m / H)}:${String(m % H).padStart(2, '0')}`;
};
/** „19 listopada 2026 r., 21:00” */
export const opisChwili = (t: number) => `${dataPoPolsku(dataZ(t))}, ${godzinaZ(t)}`;

/** Minuty jako „3 h”, „1 h 30 min”, „45 min”, „0 min”. */
export function czas(min: number): string {
  const h = Math.floor(min / H);
  const m = min % H;
  if (!h) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
}

const dzienTygodnia = (data: string) => new Date(`${data}T00:00:00Z`).getUTCDay();
const SWIETA = new Map<number, Set<string>>();
const swieto = (data: string) => {
  const rok = Number(data.slice(0, 4));
  if (!SWIETA.has(rok)) SWIETA.set(rok, new Set(swieta(rok).map((s) => s.data)));
  return SWIETA.get(rok)!.has(data);
};
/** Dzień pracy według rozkładu: poniedziałek–piątek, bez świąt. */
export const dzienPracy = (data: string) => {
  const d = dzienTygodnia(data);
  return d >= 1 && d <= 5 && !swieto(data);
};

const godzina = (tekst: string, co: string) => {
  const m = minuty(tekst);
  if (m === null) throw new RangeError(`${co}: wpisz godzinę jak 7:00`);
  return m;
};

/** Najdłuższa przerwa bez pracy w oknie [a, b); przerwy na krawędziach liczą się w części w oknie. */
export function najdluzszaPrzerwa(a: number, b: number, praca: Odcinek[]): number {
  const w = praca
    .filter((o) => o.a < b && o.b > a)
    .map((o) => ({ a: Math.max(o.a, a), b: Math.min(o.b, b) }))
    .sort((x, y) => x.a - y.a);
  let najdl = 0;
  let t = a;
  for (const o of w) {
    najdl = Math.max(najdl, o.a - t);
    t = Math.max(t, o.b);
  }
  return Math.max(najdl, b - t);
}

const nachodza = (x: Odcinek, y: Odcinek) => x.a < y.b && y.a < x.b;

export function odpracowanie(dane: DaneOdpracowania): WynikOdpracowania {
  const S = godzina(dane.start, 'Początek zmiany');
  const E = godzina(dane.koniec, 'Koniec zmiany');
  const dlugosc = (E - S + DOBA) % DOBA;
  if (dlugosc < H || dlugosc > 12 * H) throw new RangeError('Zmiana w rozkładzie: od 1 do 12 godzin');
  if (!(OKRESY as readonly number[]).includes(dane.okres)) throw new RangeError('Okres rozliczeniowy: 1, 2, 3, 4, 6 albo 12 miesięcy');

  // Wyjście
  const w = dane.wyjscie;
  if (!poprawnaData(w.data)) throw new RangeError('Wyjście: wpisz datę');
  if (!dzienPracy(w.data)) throw new RangeError('Wyjście: ten dzień jest wolny według rozkładu (sobota, niedziela albo święto)');
  const zmianaWyjscia = chwila(w.data, S);
  const doZmiany = (min: number) => chwila(w.data, min < S ? min + DOBA : min);
  const wOd = doZmiany(godzina(w.od, 'Wyjście od'));
  const wDoMin = godzina(w.do, 'Wyjście do');
  if (wDoMin === godzina(w.od, 'Wyjście od')) throw new RangeError('Wyjście: koniec taki sam jak początek');
  const wDo = wDoMin <= S ? chwila(w.data, wDoMin + DOBA) : chwila(w.data, wDoMin);
  if (wOd < zmianaWyjscia || wDo > zmianaWyjscia + dlugosc || wDo <= wOd)
    throw new RangeError(`Wyjście musi mieścić się w godzinach pracy: ${godzinaZ(S)}–${godzinaZ(E)}`);
  const wyjscie: Odcinek = { a: wOd, b: wDo };

  // Wiersze odpracowania
  const wiersze: (Odcinek & { data: string; nr: number })[] = [];
  dane.odpracowanie.forEach((r, i) => {
    const nr = r.nr ?? i + 1;
    if (!poprawnaData(r.data)) throw new RangeError(`Odpracowanie ${nr}: wpisz datę`);
    const od = godzina(r.od, `Odpracowanie ${nr} od`);
    const do_ = godzina(r.do, `Odpracowanie ${nr} do`);
    if (od === do_) throw new RangeError(`Odpracowanie ${nr}: koniec taki sam jak początek`);
    const a = chwila(r.data, od);
    wiersze.push({ a, b: a + ((do_ - od + DOBA) % DOBA), data: r.data, nr });
  });
  wiersze.sort((x, y) => x.a - y.a);
  for (let i = 1; i < wiersze.length; i++)
    if (nachodza(wiersze[i - 1], wiersze[i])) throw new RangeError(`Odpracowanie ${wiersze[i - 1].nr} i ${wiersze[i].nr} nachodzą na siebie`);

  // Zmiany z rozkładu w zakresie dat, które obejmują wszystkie okna dób i tygodni
  const daty = [w.data, ...wiersze.map((r) => r.data)].sort();
  const zmiany: (Odcinek & { data: string })[] = [];
  for (let d = dodajDni(daty[0], -9); d <= dodajDni(daty[daty.length - 1], 9); d = dodajDni(d, 1))
    if (dzienPracy(d)) zmiany.push({ a: chwila(d, S), b: chwila(d, S) + dlugosc, data: d });
  for (const r of wiersze) {
    const z = zmiany.find((x) => nachodza(x, r));
    if (z) throw new RangeError(`Odpracowanie ${r.nr} nachodzi na godziny pracy z rozkładu (${dataPoPolsku(z.data)}, ${godzinaZ(S)}–${godzinaZ(E)})`);
  }

  const praca: Odcinek[] = [];
  for (const z of zmiany) {
    if (z.a === zmianaWyjscia) {
      if (wyjscie.a > z.a) praca.push({ a: z.a, b: wyjscie.a });
      if (z.b > wyjscie.b) praca.push({ a: wyjscie.b, b: z.b });
    } else praca.push(z);
  }
  praca.push(...wiersze);

  const minWyjscia = wyjscie.b - wyjscie.a;
  // Przepis mówi o odpracowaniu zwolnienia już udzielonego: godzin przed wyjściem nie liczymy do bilansu
  // (zostają na osi czasu, więc odpoczynek sprawdzamy z nimi).
  const odpracowane = wiersze.filter((r) => r.a >= wyjscie.a).reduce((s, r) => s + r.b - r.a, 0);
  const roznica = odpracowane - minWyjscia;

  // Odpoczynek dobowy
  const doby: Doba[] = [];
  for (const z of zmiany) {
    const okno = { a: z.a, b: z.a + DOBA };
    if (z.a === zmianaWyjscia || wiersze.some((r) => nachodza(r, okno)))
      doby.push({ od: z.a, najdluzsza: najdluzszaPrzerwa(okno.a, okno.b, praca), wolny: false });
  }
  const pierwszeWWolne = new Map<string, number>();
  for (const r of wiersze) if (!dzienPracy(r.data) && !pierwszeWWolne.has(r.data)) pierwszeWWolne.set(r.data, r.a);
  for (const a of pierwszeWWolne.values()) doby.push({ od: a, najdluzsza: najdluzszaPrzerwa(a, a + DOBA, praca), wolny: true });
  doby.sort((x, y) => x.od - y.od);

  // Odpoczynek tygodniowy: tygodnie od pierwszego dnia okresu rozliczeniowego
  const poczatkiTygodni = new Set<string>();
  for (const r of wiersze)
    for (const t of [r.a, r.b - 1]) {
      const data = dataZ(t);
      const okres = okresZawierajacy(data, dane.okres).od;
      poczatkiTygodni.add(dodajDni(okres, Math.floor(dniMiedzy(okres, data) / 7) * 7));
    }
  const tygodnie: Tydzien[] = [...poczatkiTygodni].sort().map((od) => {
    const a = chwila(od, 0);
    return { od, najdluzsza: najdluzszaPrzerwa(a, a + 7 * DOBA, praca), rozklad: najdluzszaPrzerwa(a, a + 7 * DOBA, zmiany) };
  });

  const kontrole: Kontrola[] = [];

  kontrole.push(
    roznica === 0
      ? {
          id: 'bilans',
          stan: 'ok',
          tytul: `Odpracowane w całości: ${czas(odpracowane)}`,
          opis: 'Czas odpracowania wyjścia w sprawach osobistych, udzielonego na Twój wniosek, nie jest pracą w godzinach nadliczbowych.',
          podstawa: 'art. 151 § 2^1 Kodeksu pracy',
          szczegoly: [],
        }
      : roznica > 0
        ? {
            id: 'bilans',
            stan: 'uwaga',
            tytul: `${czas(roznica)} ponad czas wyjścia`,
            opis: 'Te godziny nie są odpracowaniem wyjścia, bo art. 151 § 2^1 obejmuje tylko czas odpracowania zwolnienia. Są nadgodzinami, jeśli przekraczają 8 godzin w dobie albo przeciętnie 40 godzin w tygodniu w okresie rozliczeniowym.',
            podstawa: 'art. 151 § 1 i § 2^1 Kodeksu pracy',
            szczegoly: [],
          }
        : {
            id: 'bilans',
            stan: 'uwaga',
            tytul: `Zostało do odpracowania: ${czas(-roznica)}`,
            opis: 'Wynagrodzenie przysługuje za pracę wykonaną, a za czas niewykonywania pracy tylko wtedy, gdy przepisy prawa pracy (w tym układ zbiorowy albo regulamin) tak stanowią. Przepis nie nakazuje odpracowania i nie wskazuje terminu; bez odpracowania za ten czas wynagrodzenie nie przysługuje.',
            podstawa: 'art. 80 Kodeksu pracy',
            szczegoly: [],
          },
  );

  const krotkie = doby.filter((d) => d.najdluzsza < ODPOCZYNEK_DOBOWY);
  kontrole.push({
    id: 'odpoczynek-dobowy',
    stan: krotkie.length ? 'blad' : 'ok',
    tytul: krotkie.length ? 'Za krótki odpoczynek dobowy' : 'Co najmniej 11 h odpoczynku w każdej dobie',
    opis: krotkie.length
      ? 'Odpracowanie nie może naruszać odpoczynku: w każdej dobie przysługuje co najmniej 11 godzin nieprzerwanego odpoczynku.'
      : 'W każdej dobie z odpracowaniem i w dobie wyjścia zostaje co najmniej 11 godzin nieprzerwanego odpoczynku.',
    podstawa: 'art. 132 § 1 i art. 151 § 2^1 Kodeksu pracy',
    szczegoly: (krotkie.length ? krotkie : doby).map((d) => `Doba od ${opisChwili(d.od)}: najdłuższa przerwa ${czas(d.najdluzsza)}.`),
  });

  if (tygodnie.length) {
    const bledy = tygodnie.filter((t) => t.najdluzsza < ODPOCZYNEK_TYGODNIOWY && t.rozklad >= ODPOCZYNEK_TYGODNIOWY);
    const uwagi = tygodnie.filter((t) => t.najdluzsza < ODPOCZYNEK_TYGODNIOWY && t.rozklad < ODPOCZYNEK_TYGODNIOWY && t.najdluzsza < t.rozklad);
    const opisTygodnia = (t: Tydzien) =>
      `Tydzień od ${dataPoPolsku(t.od)}: najdłuższa przerwa ${czas(t.najdluzsza)}${
        t.najdluzsza !== t.rozklad
          ? `, według samego rozkładu ${czas(t.rozklad)}`
          : t.rozklad < ODPOCZYNEK_TYGODNIOWY
            ? '; tyle daje już sam rozkład, bo weekend przypada na przełomie tygodni okresu rozliczeniowego'
            : ''
      }.`;
    kontrole.push({
      id: 'odpoczynek-tygodniowy',
      stan: bledy.length ? 'blad' : uwagi.length ? 'uwaga' : 'ok',
      tytul: bledy.length
        ? 'Za krótki odpoczynek tygodniowy'
        : uwagi.length
          ? 'Odpracowanie skraca przerwę w tygodniu poniżej 35 h'
          : 'Odpracowanie nie odbiera 35 h odpoczynku w tygodniu',
      opis: bledy.length
        ? 'W każdym tygodniu przysługuje co najmniej 35 godzin nieprzerwanego odpoczynku, a odpracowanie nie może go naruszać.'
        : uwagi.length
          ? 'Już sam rozkład nie daje w tym tygodniu 35 h przerwy w całości wewnątrz tygodnia (weekend dzieli się między dwa tygodnie okresu rozliczeniowego), a odpracowanie tę przerwę skraca. Przepis nie mówi, jak liczyć przerwę na przełomie tygodni.'
          : 'W każdym tygodniu przysługuje co najmniej 35 godzin nieprzerwanego odpoczynku. Tygodnie liczymy od pierwszego dnia okresu rozliczeniowego.',
      podstawa: 'art. 133 § 1, art. 128 § 3 pkt 2 i art. 151 § 2^1 Kodeksu pracy',
      szczegoly: (bledy.length ? bledy : uwagi.length ? uwagi : tygodnie).map(opisTygodnia),
    });
  } else
    kontrole.push({
      id: 'odpoczynek-tygodniowy',
      stan: 'ok',
      tytul: 'Odpoczynek tygodniowy: brak odpracowania do sprawdzenia',
      opis: 'Wpisz, kiedy odpracujesz wyjście, a sprawdzimy 35 godzin odpoczynku w tygodniu.',
      podstawa: 'art. 133 § 1 Kodeksu pracy',
      szczegoly: [],
    });

  const opisWiersza = (r: (typeof wiersze)[number]) => `Odpracowanie ${r.nr}: ${dataPoPolsku(r.data)}`;
  const wolne = wiersze.filter((r) => !dzienPracy(r.data));
  const sobota = wolne.filter((r) => rodzajDnia(r.data).rodzaj === 'zwykly');
  const niedzielaSwieto = wolne.filter((r) => rodzajDnia(r.data).rodzaj !== 'zwykly');
  if (sobota.length)
    kontrole.push({
      id: 'dzien-wolny',
      stan: 'uwaga',
      tytul: `Odpracowanie w dzień wolny z rozkładu: ${odmiana(sobota.length, ['dzień', 'dni', 'dni'])}`,
      opis: 'Art. 151 § 2^1 nie wskazuje dnia odpracowania. Poradnik ministerstwa pracy (rodzinaipraca.gov.pl) odradza odpracowanie w wolną sobotę, bo praca w dniu wolnym z pięciodniowego tygodnia daje prawo do innego dnia wolnego (art. 151^3). Dobę w dniu wolnym liczymy od początku odpracowania.',
      podstawa: 'art. 151 § 2^1 i art. 151^3 Kodeksu pracy',
      szczegoly: sobota.map(opisWiersza),
    });
  if (niedzielaSwieto.length)
    kontrole.push({
      id: 'niedziela-swieto',
      stan: 'uwaga',
      tytul: 'Odpracowanie w niedzielę albo święto',
      opis: 'Praca w niedziele i święta jest dozwolona tylko w przypadkach wymienionych w przepisie, np. przy pracy zmianowej, w ruchu ciągłym albo przy niezbędnych remontach. Za taką pracę pracodawca zapewnia inny dzień wolny.',
      podstawa: 'art. 151^10 i art. 151^11 § 1 Kodeksu pracy',
      szczegoly: niedzielaSwieto.map((r) => {
        const d = rodzajDnia(r.data);
        return `Odpracowanie ${r.nr}: ${dataPoPolsku(r.data)}, ${d.nazwa ?? 'niedziela'}.`;
      }),
    });

  const okresWyjscia = okresZawierajacy(w.data, dane.okres);
  const inneOkresy = wiersze.filter((r) => okresZawierajacy(r.data, dane.okres).od !== okresWyjscia.od);
  if (inneOkresy.length)
    kontrole.push({
      id: 'okres',
      stan: 'uwaga',
      tytul: 'Odpracowanie w innym okresie rozliczeniowym',
      opis: `Wyjście przypada w okresie od ${dataPoPolsku(okresWyjscia.od)} do ${dataPoPolsku(okresWyjscia.do)}; w tym okresie zabraknie godzin do wymiaru, a w okresie odpracowania będzie ich więcej. Przepis nie mówi o terminie odpracowania.`,
      podstawa: 'art. 151 § 2^1 Kodeksu pracy',
      szczegoly: inneOkresy.map(opisWiersza),
    });

  const wczesniej = wiersze.filter((r) => r.a < wyjscie.a);
  if (wczesniej.length)
    kontrole.push({
      id: 'przed-wyjsciem',
      stan: 'uwaga',
      tytul: 'Odpracowanie przed wyjściem',
      opis: 'Przepis mówi o odpracowaniu zwolnienia już udzielonego. Godzin przed wyjściem nie liczymy jako odpracowania: ponad normy czasu pracy mogą być nadgodzinami.',
      podstawa: 'art. 151 § 1 i § 2^1 Kodeksu pracy',
      szczegoly: wczesniej.map(opisWiersza),
    });

  return {
    wyjscie: minWyjscia,
    odpracowane,
    roznica,
    zostalo: Math.max(0, -roznica),
    nadwyzka: Math.max(0, roznica),
    doby,
    tygodnie,
    kontrole,
  };
}
