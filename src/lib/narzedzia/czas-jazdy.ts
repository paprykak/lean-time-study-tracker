// Czas jazdy, przerwy i odpoczynki kierowcy: kierowca wpisuje, co robił od końca odpoczynku (jazda, przerwa, inna praca,
// dyspozycja, z godziną końca każdego okresu), a narzędzie mówi, co jest naruszeniem, kiedy najpóźniej przerwa, ile jazdy
// zostało na dziś i w tygodniu i kiedy najpóźniej zacząć odpoczynek dobowy i tygodniowy.
//
// Przepisy (sprawdzone 2026-11-13):
// - rozporządzenie (WE) nr 561/2006 (tekst skonsolidowany z 31.12.2024; bez późniejszych zmian według Urzędu Publikacji UE):
//   art. 2 ust. 1 (pojazdy: rzeczy powyżej 3,5 t; od 1 lipca 2026 r. rzeczy w przewozie międzynarodowym i kabotażu powyżej
//   2,5 t; osoby: ponad 9 miejsc z kierowcą), art. 4 lit. d (przerwa: bez jazdy i bez innej pracy, tylko wypoczynek),
//   lit. g (regularny dzienny odpoczynek 11 h albo 3 h + 9 h, skrócony 9–11 h), lit. h (tygodniowy 45 h, skrócony od 24 h),
//   lit. k (dzienny czas jazdy: między dwoma odpoczynkami), art. 6 ust. 1–3 (9 h, 10 h najwyżej dwa razy w tygodniu, 56 h
//   w tygodniu, 90 h w dwóch kolejnych tygodniach), art. 7 akapit 1–2 (po 4,5 h jazdy przerwa 45 min albo 15 min, a po niej
//   30 min), art. 8 ust. 2 (dzienny odpoczynek w każdym okresie 24 h po poprzednim odpoczynku), ust. 4 (najwyżej trzy
//   skrócone między tygodniowymi), ust. 6 (tygodniowy najpóźniej po sześciu okresach 24 h; w dwóch tygodniach dwa
//   regularne albo regularny i skrócony), ust. 6b (rekompensata do końca trzeciego tygodnia);
// - ustawa o czasie pracy kierowców (t.j. Dz.U. 2026 poz. 477): art. 2 pkt 6a (pora nocna: 4 godziny między 0:00 a 7:00),
//   art. 6 ust. 3 (przerwa 15 min wliczana do czasu pracy przy dobowym wymiarze co najmniej 6 h), art. 8 ust. 1 (doba:
//   24 godziny od rozpoczęcia pracy), art. 10 (dyspozycja), art. 14 ust. 1–3 (11 h w dobie, 35 h w tygodniu, najmniej
//   24 h przy zmianie zmiany), art. 21 (przy pracy w porze nocnej najwyżej 10 h pracy między odpoczynkami), art. 22
//   (art. 13 i 21 nie dotyczą m.in. rzeczy do 3,5 t i pojazdów do 9 osób), art. 27 ust. 3–5 (15 min przerwy z art. 7
//   rozporządzenia w czasie pracy; przy przerwach i odpoczynkach z rozporządzenia nie stosuje się art. 13 i 14),
//   art. 31a–31c (linie regularne do 50 km: 10 h jazdy, 30 min przerwy przy 6–8 h jazdy, 45 min powyżej 8 h, części po
//   co najmniej 15 min, nie przed i nie po jeździe; 60 h w tygodniu, 90 h w dwóch; tygodniowy po sześciu okresach 24 h).
//
// Interpretacje (wariant bezpieczny dla kierowcy, opisany w „Jak liczymy”):
// 1. Dyspozycja (gotowość) nie jest przerwą w rozumieniu art. 4 lit. d (tylko wypoczynek) i nie liczymy jej do czasu pracy
//    (art. 10 ust. 1: okresy inne niż przerwy; bez wyjątku z art. 10 ust. 3 dla zadaniowego czasu pracy); do art. 21
//    liczymy jazdę i inną pracę oraz 15 min przerwy (art. 27 ust. 3), gdy praca trwa co najmniej 6 h i była przerwa
//    co najmniej 15 min (ustawa wiąże to z wymiarem z rozkładu, którego nie znamy). Linia do 50 km: wszystkie przerwy
//    z art. 31b, bo „rozliczane są jak czas pracy” (ust. 4); czy to czas pracy do art. 21, przepis nie mówi.
// 2. Przerwa dzielona: pierwsza część co najmniej 15 min, druga co najmniej 30 min, w tej kolejności (art. 7 akapit 2).
//    Przerwy krótsze niż 15 min nie liczą się. Odpoczynek dzielony 3 h + 9 h: gdy wśród przerw jest co najmniej 3 h.
//    Odpoczynek dobowy kierowca wpisuje jako ostatni okres („Odpoczynek”); przerwę na końcu od 9 h traktujemy tak samo.
//    Sprawdzamy, ile odpoczynku mieści się w 24 h od początku pracy (art. 8 ust. 2: odpoczynek „w” okresie 24 h).
// 6. Linia do 50 km: przerwy po 6 h pracy z art. 13 ustawy nie sprawdzamy (relacji do art. 31b ustawa nie rozstrzyga).
// 3. Pora nocna: przepis wskazuje 4 godziny między 0:00 a 7:00, a które, ustala pracodawca. Kierowca wybiera je z listy;
//    gdy nie wie, każdą pracę między 0:00 a 7:00 traktujemy jak pracę w porze nocnej (limit 10 h z art. 21).
// 4. Odpoczynek dobowy: musi się zmieścić w 24 h od końca poprzedniego odpoczynku (art. 8 ust. 2), więc regularny (11 h)
//    zaczyna się najpóźniej 13 h po starcie, a skrócony (9 h) albo druga część dzielonego (9 h) 15 h po starcie.
// 5. Liczymy w godzinach zegarowych z wpisanych godzin; zmiany czasu (marzec, październik) nie uwzględniamy. Tydzień
//    od poniedziałku 0:00 do niedzieli 24:00 (art. 4 lit. i): jazdę z tego tygodnia przed dziś wpisuje kierowca.
// Nie liczymy: załogi kilkuosobowej (art. 8 ust. 5), promu i pociągu (art. 9), odstępstw dla okazjonalnych przewozów
// osób (art. 7 akapit 3, art. 8 ust. 2a i 6a), odstępstwa dla dwóch skróconych tygodniowych w przewozach
// międzynarodowych (art. 8 ust. 6 akapit 3), pojazdów wyłączonych z art. 3 i 13 rozporządzenia.

import { odmiana } from '../redakcja';
import { dataPoPolsku } from './terminy';

export type Rodzaj = 'jazda' | 'przerwa' | 'praca' | 'dyspozycja' | 'odpoczynek';
export type Pojazd = 'ciezarowy' | 'autobus' | 'bus-miedzynarodowy' | 'linia-50' | 'do-35t';

export const RODZAJE: { id: Rodzaj; nazwa: string }[] = [
  { id: 'jazda', nazwa: 'Jazda' },
  { id: 'przerwa', nazwa: 'Przerwa' },
  { id: 'praca', nazwa: 'Inna praca' },
  { id: 'dyspozycja', nazwa: 'Dyspozycja' },
  { id: 'odpoczynek', nazwa: 'Odpoczynek' },
];

export const POJAZDY: { id: Pojazd; nazwa: string }[] = [
  { id: 'ciezarowy', nazwa: 'Ciężarówka ponad 3,5 t' },
  { id: 'autobus', nazwa: 'Autobus, autokar' },
  { id: 'bus-miedzynarodowy', nazwa: 'Bus 2,5–3,5 t za granicą' },
  { id: 'linia-50', nazwa: 'Linia regularna do 50 km' },
  { id: 'do-35t', nazwa: 'Do 3,5 t (za granicą 2,5 t)' },
];

/** Limity w minutach (rozporządzenie 561/2006 i ustawa o czasie pracy kierowców). */
export const LIMITY = {
  jazdaBezPrzerwy: 270, // art. 7: 4,5 h
  przerwa: 45,
  przerwaCzesc1: 15,
  przerwaCzesc2: 30,
  jazdaDzien: 540, // art. 6 ust. 1: 9 h
  jazdaDzienPrzedluzona: 600, // 10 h, najwyżej 2 razy w tygodniu
  jazdaTydzien: 56 * 60, // art. 6 ust. 2
  jazdaDwaTygodnie: 90 * 60, // art. 6 ust. 3 i art. 31a ust. 3
  jazdaTydzienLinia: 60 * 60, // art. 31a ust. 3
  odpoczynekRegularny: 660, // 11 h
  odpoczynekSkrocony: 540, // 9 h
  odpoczynekCzesc1: 180, // 3 h
  okresOdpoczynku: 1440, // 24 h
  skroconeMaks: 3, // art. 8 ust. 4
  tygodniowyPo: 6 * 1440, // art. 8 ust. 6 i art. 31c ust. 2
  pracaNoc: 600, // art. 21: 10 h
  nocDo: 420, // 7:00
} as const;

export interface Okres {
  rodzaj: Rodzaj;
  /** Minuty od północy dnia startu (koniec może być następnego dnia: powyżej 1440). */
  od: number;
  do: number;
}

export interface Naruszenie {
  kod: 'przerwa' | 'jazda-dzien' | 'jazda-tydzien' | 'jazda-dwa-tygodnie' | 'odpoczynek' | 'noc' | 'przerwa-linia' | 'przerwa-15';
  tekst: string;
}

export interface DaneJazdy {
  pojazd: Pojazd;
  /** Godzina końca odpoczynku (początku pracy) w minutach od północy. */
  start: number;
  /** Okresy w kolejności, od startu. */
  okresy: Okres[];
  /** Dni z jazdą ponad 9 h w tym tygodniu przed dziś (0–2). */
  dniPonad9?: number;
  /** Skrócone odpoczynki dobowe od ostatniego tygodniowego (0–3). */
  skrocone?: number;
  /** Jazda w tym tygodniu przed dziś (minuty). */
  jazdaTydzien?: number;
  /** Jazda w poprzednim tygodniu (minuty). */
  jazdaPoprzedni?: number;
  /** Pora nocna u pracodawcy: początek w minutach od północy (4 godziny, art. 2 pkt 6a); brak: cały przedział 0:00–7:00. */
  nocOd?: number;
}

export interface WynikJazdy {
  pojazd: Pojazd;
  /** Czy obowiązuje rozporządzenie 561/2006 (art. 6–8). */
  rozporzadzenie: boolean;
  koniec: number;
  jazda: number;
  /** Jazda i inna praca (bez dyspozycji i przerw). */
  praca: number;
  /** Czas pracy do art. 21: praca + 15 min przerwy, gdy praca trwa co najmniej 6 h i była przerwa co najmniej 15 min. */
  czasPracy: number;
  pracaWNocy: boolean;
  /** Pora nocna, z którą liczyliśmy (minuty od północy). */
  noc: { od: number; do: number };
  /** Art. 7: jazda od ostatniej pełnej przerwy i czy była już część 15 min. */
  jazdaOdPrzerwy: number;
  czesc15: boolean;
  /** Najpóźniej przerwa (minuty od północy), gdy jazda trwa dalej; null, gdy limit już przekroczony albo nie dotyczy. */
  przerwaNajpozniej: number | null;
  przerwaDlugosc: number;
  /** Linia do 50 km: wymagana i wykorzystana suma przerw (art. 31b). */
  przerwyLinia: { wymagane: number; wykorzystane: number } | null;
  limitDzien: number;
  zostaloDzien: number;
  /** Dni z jazdą ponad 9 h w tym tygodniu przed dziś. */
  dniPonad9: number;
  /** Odpoczynek dobowy: najpóźniej start regularnego (11 h) i skróconego albo drugiej części dzielonego (9 h). */
  odpoczynekRegularny: number;
  odpoczynekSkrocony: number | null;
  dzielony: boolean;
  /** Wpisany odpoczynek dobowy: początek i ile z niego mieści się w 24 h od początku pracy. */
  odpoczynekOd: number | null;
  odpoczynekW24: number | null;
  tydzien: number | null;
  dwaTygodnie: number | null;
  zostaloTydzien: number | null;
  naruszenia: Naruszenie[];
}

/** „4 h 30 min”, „45 min”, „9 h”, „0 min”. */
export function czasTrwania(minuty: number): string {
  const m = Math.round(Math.abs(minuty));
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (!h) return `${r} min`;
  return r ? `${h} h ${r} min` : `${h} h`;
}

/** Godzina z minut od północy dnia startu: „16:45”, „1:15 następnego dnia”, „3:00 po 2 dniach”. */
export function godzina(minuty: number): string {
  const dzien = Math.floor(minuty / 1440);
  const m = minuty - dzien * 1440;
  const t = `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
  return dzien === 0 ? t : dzien === 1 ? `${t} następnego dnia` : `${t} po ${dzien} dniach`;
}

/** „06:30” albo „6:30” → minuty od północy; NaN, gdy to nie godzina. */
export function minutyZGodziny(tekst: string): number {
  const m = /^(\d{1,2}):(\d{2})$/.exec(tekst.trim());
  if (!m) return Number.NaN;
  const h = Number(m[1]);
  const min = Number(m[2]);
  return h < 24 && min < 60 ? h * 60 + min : Number.NaN;
}

/** Błąd w jednym z wpisanych wierszy (indeks w tablicy wierszy), żeby strona mogła oznaczyć pole. */
export class BladOkresu extends RangeError {
  constructor(
    message: string,
    public wiersz: number,
  ) {
    super(message);
  }
}

/** Okresy z godzin końca: każdy zaczyna się, gdy kończy poprzedni; godzina wcześniejsza niż poprzednia to następny dzień.
 *  Odpoczynek dobowy kończy listę: po nim nie może być innego okresu. */
export function okresyZGodzin(start: number, wiersze: { rodzaj: Rodzaj; do: number }[]): Okres[] {
  const okresy: Okres[] = [];
  let poprzedni = start;
  for (const [i, w] of wiersze.entries()) {
    if (!(w.do >= 0 && w.do < 1440)) throw new BladOkresu('Niepoprawna godzina', i);
    if (i > 0 && wiersze[i - 1].rodzaj === 'odpoczynek') throw new BladOkresu('Odpoczynek dobowy musi być ostatnim okresem', i);
    const zegar = ((poprzedni % 1440) + 1440) % 1440;
    if (w.do === zegar) throw new BladOkresu('Okres bez długości', i);
    const koniec = poprzedni + ((w.do - zegar + 1440) % 1440);
    okresy.push({ rodzaj: w.rodzaj, od: poprzedni, do: koniec });
    poprzedni = koniec;
  }
  return okresy;
}

/** Sąsiednie okresy tego samego rodzaju łączymy (dwie przerwy pod rząd to jedna przerwa). */
function scal(okresy: Okres[]): Okres[] {
  const wynik: Okres[] = [];
  for (const o of okresy) {
    const ostatni = wynik[wynik.length - 1];
    if (ostatni && ostatni.rodzaj === o.rodzaj && ostatni.do === o.od) ostatni.do = o.do;
    else wynik.push({ ...o });
  }
  return wynik;
}

const dlugosc = (o: Okres) => o.do - o.od;

/** Pory nocne do wyboru: 4 godziny między 0:00 a 7:00 (art. 2 pkt 6a ustawy); „nie wiem” to cały przedział. */
export const PORY_NOCNE = [0, 60, 120, 180] as const;

/** Czy okres pracy zachodzi na porę nocną któregoś dnia. */
function wNocy(o: Okres, od: number, do_: number): boolean {
  for (let d = Math.floor(o.od / 1440); d * 1440 < o.do; d++) {
    if (o.od < d * 1440 + do_ && o.do > d * 1440 + od) return true;
  }
  return false;
}

export function czasJazdy(d: DaneJazdy): WynikJazdy {
  if (!(d.start >= 0 && d.start < 1440)) throw new RangeError('Niepoprawny początek');
  const dniPonad9 = d.dniPonad9 ?? 0;
  const skrocone = d.skrocone ?? 0;
  if (![0, 1, 2].includes(dniPonad9)) throw new RangeError('Dni z jazdą ponad 9 h: 0–2');
  if (![0, 1, 2, 3].includes(skrocone)) throw new RangeError('Skrócone odpoczynki: 0–3');
  for (const x of [d.jazdaTydzien, d.jazdaPoprzedni]) if (x !== undefined && !(x >= 0 && x <= 7 * 1440)) throw new RangeError('Niepoprawna jazda w tygodniu');
  let poprzedni = d.start;
  for (const o of d.okresy) {
    if (o.od !== poprzedni || !(o.do > o.od)) throw new RangeError('Okresy muszą następować po sobie');
    poprzedni = o.do;
  }
  if (d.okresy.slice(0, -1).some((o) => o.rodzaj === 'odpoczynek')) throw new RangeError('Odpoczynek dobowy musi być ostatnim okresem');
  // Odpoczynek dobowy na końcu: od jego początku kończy się dzienny czas jazdy (art. 4 lit. k rozporządzenia).
  const ostatni = d.okresy[d.okresy.length - 1];
  // Przerwa na końcu dłuższa niż 9 h to w praktyce rozpoczęty odpoczynek dobowy (art. 4 lit. g), a nie przerwa w pracy.
  const odpoczynek = ostatni && (ostatni.rodzaj === 'odpoczynek' || (ostatni.rodzaj === 'przerwa' && ostatni.do - ostatni.od >= LIMITY.odpoczynekSkrocony)) ? ostatni : null;
  const okresy = scal(odpoczynek ? d.okresy.slice(0, -1) : d.okresy);
  const rozporzadzenie = d.pojazd !== 'linia-50' && d.pojazd !== 'do-35t';
  const ustawaArt21 = d.pojazd === 'ciezarowy' || d.pojazd === 'autobus' || d.pojazd === 'linia-50';
  const koniec = odpoczynek ? odpoczynek.od : okresy.length ? okresy[okresy.length - 1].do : d.start;
  const naruszenia: Naruszenie[] = [];

  const jazda = okresy.filter((o) => o.rodzaj === 'jazda').reduce((s, o) => s + dlugosc(o), 0);
  const praca = okresy.filter((o) => o.rodzaj === 'jazda' || o.rodzaj === 'praca').reduce((s, o) => s + dlugosc(o), 0);
  const przerwy = okresy.filter((o) => o.rodzaj === 'przerwa');
  const bylaPrzerwa15 = przerwy.some((o) => dlugosc(o) >= LIMITY.przerwaCzesc1);
  // Linia do 50 km: przerwy z art. 31b rozlicza się jak czas pracy (ust. 4), więc liczymy je całe (wariant bezpieczny
  // dla limitu z art. 21). Pozostałe pojazdy: 15 min przerwy w czasie pracy (art. 6 ust. 3, art. 27 ust. 3).
  const czasPracy =
    d.pojazd === 'linia-50'
      ? praca + przerwy.filter((o) => dlugosc(o) >= LIMITY.przerwaCzesc1).reduce((s, o) => s + dlugosc(o), 0)
      : praca + (praca >= 360 && bylaPrzerwa15 ? 15 : 0);
  if (d.nocOd !== undefined && !(PORY_NOCNE as readonly number[]).includes(d.nocOd)) throw new RangeError('Pora nocna: 4 godziny między 0:00 a 7:00');
  const nocOd = d.nocOd ?? 0;
  const nocDo = d.nocOd === undefined ? LIMITY.nocDo : d.nocOd + 240;
  const pracaWNocy = okresy.some((o) => (o.rodzaj === 'jazda' || o.rodzaj === 'praca') && wNocy(o, nocOd, nocDo));

  // Art. 7: jazda od ostatniej pełnej przerwy.
  let jazdaOdPrzerwy = 0;
  let czesc15 = false;
  if (rozporzadzenie) {
    let przekroczenie: { od: number; nadwyzka: number } | null = null;
    const zamknij = () => {
      if (przekroczenie) {
        naruszenia.push({
          kod: 'przerwa',
          tekst: `Przerwa należała się najpóźniej o ${godzina(przekroczenie.od)}, po 4 h 30 min jazdy; jazda dłużej o ${czasTrwania(przekroczenie.nadwyzka)} (art. 7 rozporządzenia 561/2006).`,
        });
        przekroczenie = null;
      }
    };
    for (const o of okresy) {
      const m = dlugosc(o);
      if (o.rodzaj === 'jazda') {
        if (jazdaOdPrzerwy + m > LIMITY.jazdaBezPrzerwy) {
          if (!przekroczenie) przekroczenie = { od: o.od + Math.max(0, LIMITY.jazdaBezPrzerwy - jazdaOdPrzerwy), nadwyzka: 0 };
          przekroczenie.nadwyzka = jazdaOdPrzerwy + m - LIMITY.jazdaBezPrzerwy;
        }
        jazdaOdPrzerwy += m;
      } else if (o.rodzaj === 'przerwa') {
        if (m >= LIMITY.przerwa || (czesc15 && m >= LIMITY.przerwaCzesc2)) {
          zamknij();
          jazdaOdPrzerwy = 0;
          czesc15 = false;
        } else if (m >= LIMITY.przerwaCzesc1) czesc15 = true;
      }
    }
    zamknij();
  }
  const przerwaNajpozniej = rozporzadzenie && !odpoczynek && jazdaOdPrzerwy <= LIMITY.jazdaBezPrzerwy ? koniec + LIMITY.jazdaBezPrzerwy - jazdaOdPrzerwy : null;
  const przerwaDlugosc = czesc15 ? LIMITY.przerwaCzesc2 : LIMITY.przerwa;

  // Art. 31b ustawy: przerwy na linii do 50 km, w trakcie dziennej jazdy (po pierwszej i przed ostatnią jazdą).
  let przerwyLinia: WynikJazdy['przerwyLinia'] = null;
  if (d.pojazd === 'linia-50') {
    const jazdy = okresy.filter((o) => o.rodzaj === 'jazda');
    const wykorzystane = jazdy.length
      ? przerwy.filter((o) => o.od >= jazdy[0].do && o.do <= jazdy[jazdy.length - 1].od && dlugosc(o) >= LIMITY.przerwaCzesc1).reduce((s, o) => s + dlugosc(o), 0)
      : 0;
    const wymagane = jazda > 480 ? 45 : jazda >= 360 ? 30 : 0;
    przerwyLinia = { wymagane, wykorzystane };
    if (wykorzystane < wymagane) {
      naruszenia.push({
        kod: 'przerwa-linia',
        tekst: `Przy ${czasTrwania(jazda)} jazdy należy się łącznie ${czasTrwania(wymagane)} przerw w trakcie jazdy, w częściach po co najmniej 15 min; wykorzystano ${czasTrwania(wykorzystane)} (art. 31b ustawy o czasie pracy kierowców).`,
      });
    }
  }

  // Dzienny czas jazdy (art. 6 ust. 1 rozporządzenia, art. 31a ust. 1 ustawy).
  const limitDzien = d.pojazd === 'linia-50' ? LIMITY.jazdaDzienPrzedluzona : dniPonad9 < 2 ? LIMITY.jazdaDzienPrzedluzona : LIMITY.jazdaDzien;
  if (d.pojazd !== 'do-35t' && jazda > limitDzien) {
    naruszenia.push({
      kod: 'jazda-dzien',
      tekst:
        d.pojazd === 'linia-50'
          ? `Dzienna jazda ${czasTrwania(jazda)}, a limit to 10 h (art. 31a ust. 1 ustawy o czasie pracy kierowców).`
          : limitDzien === LIMITY.jazdaDzien
            ? `Dzienna jazda ${czasTrwania(jazda)}, a w tym tygodniu były już dwa dni po 10 h: limit to 9 h (art. 6 ust. 1 rozporządzenia 561/2006).`
            : `Dzienna jazda ${czasTrwania(jazda)}, a limit to 9 h, najwyżej dwa razy w tygodniu 10 h (art. 6 ust. 1 rozporządzenia 561/2006).`,
    });
  }

  // Odpoczynek dobowy w 24 h od końca poprzedniego (art. 8 ust. 2 rozporządzenia, art. 14 ust. 1 ustawy).
  const dzielony = rozporzadzenie && przerwy.some((o) => dlugosc(o) >= LIMITY.odpoczynekCzesc1);
  const odpoczynekRegularny = d.start + LIMITY.okresOdpoczynku - LIMITY.odpoczynekRegularny;
  const odpoczynekSkrocony = rozporzadzenie && (dzielony || skrocone < LIMITY.skroconeMaks) ? d.start + LIMITY.okresOdpoczynku - LIMITY.odpoczynekSkrocony : null;
  const najpozniej = odpoczynekSkrocony ?? odpoczynekRegularny;
  // Wpisany odpoczynek: ile mieści się w 24 h od początku pracy; wymagane 11 h, a 9 h przy skróconym albo dzielonym.
  const odpoczynekW24 = odpoczynek ? Math.min(odpoczynek.do, d.start + LIMITY.okresOdpoczynku) - odpoczynek.od : null;
  const odpoczynekWymagany = odpoczynekSkrocony !== null ? LIMITY.odpoczynekSkrocony : LIMITY.odpoczynekRegularny;
  if (odpoczynek && odpoczynekW24 !== null) {
    if (odpoczynekW24 < odpoczynekWymagany) {
      naruszenia.push({
        kod: 'odpoczynek',
        tekst: rozporzadzenie
          ? `Odpoczynek dobowy od ${godzina(odpoczynek.od)}: w 24 h od początku pracy mieści się ${czasTrwania(odpoczynekW24)}, a potrzeba co najmniej ${czasTrwania(odpoczynekWymagany)} (art. 8 ust. 2 rozporządzenia 561/2006).`
          : `Odpoczynek dobowy od ${godzina(odpoczynek.od)}: w dobie mieści się ${czasTrwania(odpoczynekW24)}, a potrzeba co najmniej 11 h (art. 14 ust. 1 ustawy o czasie pracy kierowców).`,
      });
    }
  } else if (koniec > najpozniej) {
    naruszenia.push({
      kod: 'odpoczynek',
      tekst: rozporzadzenie
        ? `Odpoczynek dobowy trzeba było zacząć najpóźniej o ${godzina(najpozniej)}, żeby zmieścić ${odpoczynekSkrocony !== null ? '9 h' : '11 h'} w 24 h od końca poprzedniego (art. 8 ust. 2 rozporządzenia 561/2006).`
        : `Odpoczynek dobowy trzeba było zacząć najpóźniej o ${godzina(najpozniej)}, żeby zmieścić 11 h w dobie (art. 14 ust. 1 ustawy o czasie pracy kierowców).`,
    });
  }

  // Praca w porze nocnej (art. 21 ustawy).
  if (ustawaArt21 && pracaWNocy && czasPracy > LIMITY.pracaNoc) {
    naruszenia.push({
      kod: 'noc',
      tekst: `Czas pracy ${czasTrwania(czasPracy)}, a część pracy wypada w porze nocnej (${godzina(nocOd)}–${godzina(nocDo)}): wtedy najwyżej 10 h między odpoczynkami (art. 21 ustawy o czasie pracy kierowców).`,
    });
  }

  // Bez rozporządzenia: przerwa 15 min przy co najmniej 6 h pracy (art. 6 ust. 3 ustawy).
  if (d.pojazd === 'do-35t' && praca >= 360 && !bylaPrzerwa15) {
    naruszenia.push({ kod: 'przerwa-15', tekst: 'Przy dobowym wymiarze czasu pracy co najmniej 6 h należy się przerwa 15 min wliczana do czasu pracy (art. 6 ust. 3 ustawy o czasie pracy kierowców); wpisana praca trwa co najmniej 6 h, a wśród okresów nie ma przerwy 15 min.' });
  }

  // Tydzień i dwa tygodnie (art. 6 ust. 2–3 rozporządzenia, art. 31a ust. 3 ustawy).
  let tydzien: number | null = null;
  let dwaTygodnie: number | null = null;
  let zostaloTydzien: number | null = null;
  if (d.pojazd !== 'do-35t' && d.jazdaTydzien !== undefined) {
    const limitTydzien = d.pojazd === 'linia-50' ? LIMITY.jazdaTydzienLinia : LIMITY.jazdaTydzien;
    tydzien = d.jazdaTydzien + jazda;
    zostaloTydzien = limitTydzien - tydzien;
    if (tydzien > limitTydzien) {
      naruszenia.push({ kod: 'jazda-tydzien', tekst: `Jazda w tygodniu ${czasTrwania(tydzien)}, a limit to ${limitTydzien / 60} h (${d.pojazd === 'linia-50' ? 'art. 31a ust. 3 ustawy o czasie pracy kierowców' : 'art. 6 ust. 2 rozporządzenia 561/2006'}).` });
    }
    if (d.jazdaPoprzedni !== undefined) {
      dwaTygodnie = d.jazdaPoprzedni + tydzien;
      zostaloTydzien = Math.min(zostaloTydzien, LIMITY.jazdaDwaTygodnie - dwaTygodnie);
      if (dwaTygodnie > LIMITY.jazdaDwaTygodnie) {
        naruszenia.push({ kod: 'jazda-dwa-tygodnie', tekst: `Jazda w dwóch kolejnych tygodniach ${czasTrwania(dwaTygodnie)}, a limit to 90 h (${d.pojazd === 'linia-50' ? 'art. 31a ust. 3 ustawy o czasie pracy kierowców' : 'art. 6 ust. 3 rozporządzenia 561/2006'}).` });
      }
    }
  }

  return {
    pojazd: d.pojazd,
    rozporzadzenie,
    koniec,
    jazda,
    praca,
    czasPracy,
    pracaWNocy,
    noc: { od: nocOd, do: nocDo },
    jazdaOdPrzerwy,
    czesc15,
    przerwaNajpozniej,
    przerwaDlugosc,
    przerwyLinia,
    limitDzien,
    zostaloDzien: limitDzien - jazda,
    dniPonad9,
    odpoczynekRegularny,
    odpoczynekSkrocony,
    dzielony,
    odpoczynekOd: odpoczynek ? odpoczynek.od : null,
    odpoczynekW24,
    tydzien,
    dwaTygodnie,
    zostaloTydzien,
    naruszenia,
  };
}

// --- Odpoczynek tygodniowy (art. 8 ust. 6 rozporządzenia, art. 31c ust. 2 i art. 14 ust. 2 ustawy) ---

/** Najpóźniejszy start odpoczynku tygodniowego: sześć okresów 24 h od końca poprzedniego (data RRRR-MM-DD i minuty). */
export function tygodniowyNajpozniej(data: string, minuty: number): { data: string; minuty: number; tekst: string } {
  const t = Date.parse(`${data}T00:00:00Z`) + (minuty + LIMITY.tygodniowyPo) * 60_000;
  const dz = new Date(t);
  const d = dz.toISOString().slice(0, 10);
  const m = dz.getUTCHours() * 60 + dz.getUTCMinutes();
  return { data: d, minuty: m, tekst: `${dataPoPolsku(d)} o ${godzina(m)}` };
}

export interface OpisJazdy {
  werdykt: string;
  przerwa: string;
  dzien: string;
  odpoczynek: string;
  tydzien: string;
  praca: string;
  naruszenia: string[];
  uwagi: string[];
}

export interface DaneTygodniowego {
  /** Koniec ostatniego odpoczynku tygodniowego (data i minuty), jeśli wpisany. */
  data?: string;
  minuty?: number;
  /** Poprzedni tygodniowy był skrócony (wtedy następny regularny). */
  poprzedniSkrocony?: boolean;
}

/** Teksty wyniku: te same w HTML ze strony i w skrypcie przeglądarki. */
export function opisJazdy(r: WynikJazdy, t: DaneTygodniowego = {}): OpisJazdy {
  const n = r.naruszenia.length;
  const werdykt = n === 0 ? 'Bez naruszeń' : odmiana(n, ['naruszenie', 'naruszenia', 'naruszeń']);
  const nd = 'nie dotyczy';
  let przerwa: string;
  if (r.pojazd === 'do-35t') przerwa = '15 min przy dobowym wymiarze co najmniej 6 h (art. 6 ust. 3 ustawy), wliczane do czasu pracy';
  else if (r.przerwyLinia) {
    const brak = Math.max(0, r.przerwyLinia.wymagane - r.przerwyLinia.wykorzystane);
    przerwa = r.przerwyLinia.wymagane === 0
      ? 'art. 31b ustawy nie wymaga przerwy do 6 h jazdy; od 6 h łącznie 30 min, powyżej 8 h 45 min'
      : `łącznie ${czasTrwania(r.przerwyLinia.wymagane)} w trakcie jazdy, wykorzystano ${czasTrwania(r.przerwyLinia.wykorzystane)}${brak ? `, brakuje ${czasTrwania(brak)}` : ''}`;
  } else if (r.odpoczynekOd !== null) przerwa = `nie dotyczy: od ${godzina(r.odpoczynekOd)} odpoczynek dobowy`;
  else if (r.przerwaNajpozniej === null) przerwa = 'teraz: limit 4 h 30 min jazdy już przekroczony';
  else przerwa = `najpóźniej o ${godzina(r.przerwaNajpozniej)}: ${r.czesc15 ? '30 min (część 15 min już była)' : '45 min albo 15 min, a później 30 min'}`;

  let dzien: string;
  if (r.pojazd === 'do-35t') dzien = `${czasTrwania(r.jazda)}; limitów jazdy z rozporządzenia 561/2006 ${nd}`;
  else if (r.zostaloDzien < 0) dzien = `${czasTrwania(r.jazda)} z ${czasTrwania(r.limitDzien)}, za dużo o ${czasTrwania(-r.zostaloDzien)}`;
  else if (r.pojazd === 'linia-50' || r.limitDzien === LIMITY.jazdaDzien) dzien = `${czasTrwania(r.jazda)} z ${czasTrwania(r.limitDzien)}, zostało ${czasTrwania(r.zostaloDzien)}`;
  else {
    const doDziewieciu = LIMITY.jazdaDzien - r.jazda;
    const ile = 2 - r.dniPonad9;
    const dni10 = `10 h możesz jechać jeszcze ${odmiana(ile, ['dzień', 'dni', 'dni'])} w tym tygodniu`;
    dzien = doDziewieciu >= 0
      ? `${czasTrwania(r.jazda)} z 9 h, zostało ${czasTrwania(doDziewieciu)}; do 10 h zostało ${czasTrwania(r.zostaloDzien)} (${dni10})`
      : `${czasTrwania(r.jazda)}: ponad 9 h, więc to jeden z dwóch dni po 10 h w tygodniu; do 10 h zostało ${czasTrwania(r.zostaloDzien)}`;
  }

  const rodzajOdp = (w24: number) => (w24 >= LIMITY.odpoczynekRegularny ? 'regularny' : r.dzielony ? 'druga część dzielonego' : 'skrócony');
  const odpoczynek = r.odpoczynekOd !== null && r.odpoczynekW24 !== null
    ? `od ${godzina(r.odpoczynekOd)}: ${czasTrwania(r.odpoczynekW24)} w 24 h od początku pracy${r.naruszenia.some((x) => x.kod === 'odpoczynek') ? ', za mało' : r.rozporzadzenie ? ` (${rodzajOdp(r.odpoczynekW24)})` : ''}`
    : r.rozporzadzenie
    ? `zacznij najpóźniej o ${godzina(r.odpoczynekRegularny)} (11 h)${r.odpoczynekSkrocony !== null ? `; ${r.dzielony ? 'druga część dzielonego (9 h, po przerwie 3 h)' : 'skrócony (9 h)'}: o ${godzina(r.odpoczynekSkrocony)}` : '; skróconych już nie ma (najwyżej 3 między tygodniowymi)'}`
    : `zacznij najpóźniej o ${godzina(r.odpoczynekRegularny)} (11 h w dobie, art. 14 ust. 1 ustawy)`;

  let tydzien: string;
  if (r.pojazd === 'do-35t') tydzien = nd;
  else if (r.tydzien === null) tydzien = 'wpisz jazdę z tego tygodnia';
  else {
    const limit = r.pojazd === 'linia-50' ? 60 : 56;
    tydzien = `${czasTrwania(r.tydzien)} z ${limit} h${r.dwaTygodnie !== null ? `; w dwóch tygodniach ${czasTrwania(r.dwaTygodnie)} z 90 h` : ''}${r.zostaloTydzien !== null && r.zostaloTydzien >= 0 ? `; zostało ${czasTrwania(r.zostaloTydzien)}` : ''}`;
  }

  const praca = `${czasTrwania(r.czasPracy)} (jazda i inna praca${r.czasPracy > r.praca ? (r.pojazd === 'linia-50' ? ', z przerwami z art. 31b' : ', z 15 min przerwy') : ''})${r.pracaWNocy ? `; praca w porze nocnej (${godzina(r.noc.od)}–${godzina(r.noc.do)})` : ''}`;

  const uwagi: string[] = [];
  if (t.data && t.minuty !== undefined) {
    const tw = tygodniowyNajpozniej(t.data, t.minuty);
    if (r.pojazd === 'do-35t') uwagi.push('Odpoczynek tygodniowy: co najmniej 35 h w każdym tygodniu od poniedziałku do niedzieli (art. 14 ust. 2 ustawy).');
    else if (r.pojazd === 'linia-50') uwagi.push(`Odpoczynek tygodniowy zacznij najpóźniej ${tw.tekst}: co najmniej 35 h (art. 31c ust. 2 i art. 14 ust. 2 ustawy).`);
    else uwagi.push(`Odpoczynek tygodniowy zacznij najpóźniej ${tw.tekst}: ${t.poprzedniSkrocony ? 'regularny, co najmniej 45 h, bo poprzedni był skrócony' : 'co najmniej 45 h albo skrócony od 24 h'} (art. 8 ust. 6 rozporządzenia 561/2006). Skrócenie trzeba odebrać w całości do końca trzeciego tygodnia po tym, w którym był skrócony odpoczynek (art. 8 ust. 6b).`);
  }
  if (r.pojazd === 'linia-50') uwagi.push('Na linii do 50 km przerwy rozlicza się jak czas pracy (art. 31b ust. 4 ustawy).');
  if (r.rozporzadzenie) uwagi.push('Gdy korzystasz z przerw z rozporządzenia, 15 min przerwy wlicza się do czasu pracy, jeśli dobowy wymiar to co najmniej 6 h (art. 27 ust. 3 ustawy).');
  if (r.pojazd === 'bus-miedzynarodowy') uwagi.push('Rozporządzenie 561/2006 obejmuje przewóz rzeczy w przewozie międzynarodowym i kabotażu pojazdami powyżej 2,5 t od 1 lipca 2026 r. (art. 2 ust. 1 lit. aa).');
  return {
    werdykt,
    przerwa,
    dzien,
    odpoczynek,
    tydzien,
    praca,
    naruszenia: r.naruszenia.map((x) => x.tekst),
    uwagi,
  };
}

/** Przykład startowy: 6:00, jazda do 10:00, przerwa 15 min, jazda, przerwa 30 min, jazda, inna praca, jazda. */
export const PRZYKLAD = {
  start: '06:00',
  wiersze: [
    { rodzaj: 'jazda', do: '10:00' },
    { rodzaj: 'przerwa', do: '10:15' },
    { rodzaj: 'jazda', do: '10:45' },
    { rodzaj: 'przerwa', do: '11:15' },
    { rodzaj: 'jazda', do: '14:45' },
    { rodzaj: 'praca', do: '15:45' },
    { rodzaj: 'jazda', do: '16:30' },
  ] as { rodzaj: Rodzaj; do: string }[],
  jazdaTydzien: '32',
  jazdaPoprzedni: '40',
} as const;

/** Godziny wpisane przez człowieka: „32”, „32,5”, „32:30” → minuty; NaN, gdy to nie liczba nieujemna. */
export function wpisaneGodziny(tekst: string): number {
  const t = tekst.trim().replace(/\s/g, '');
  const hm = /^(\d{1,3}):([0-5]\d)$/.exec(t);
  if (hm) return Number(hm[1]) * 60 + Number(hm[2]);
  const x = t.replace(',', '.');
  return /^\d+(\.\d+)?$/.test(x) ? Math.round(Number(x) * 60) : Number.NaN;
}
