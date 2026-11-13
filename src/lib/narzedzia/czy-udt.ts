// Czy do obsługi maszyny potrzebne jest zaświadczenie kwalifikacyjne UDT. Drzewo decyzji w trzech krokach:
// 1. Czy maszyna jest urządzeniem technicznym: § 1 pkt 6–7 rozporządzenia Rady Ministrów z 7 grudnia 2012 r. w sprawie
//    rodzajów urządzeń technicznych podlegających dozorowi technicznemu (Dz.U. 2012 poz. 1468, bez zmian).
// 2. Czy przy jej obsłudze zaświadczenie jest wymagane: art. 22 ust. 3 ustawy o dozorze technicznym (t.j. Dz.U. 2024
//    poz. 1194) i załącznik nr 3, tabela nr 1 „Obsługa”, z wyłączeniami pod tabelą, do rozporządzenia z 21 maja 2019 r.
//    (Dz.U. 2019 poz. 1008):
//    „Poz. 1–3 nie dotyczą urządzeń technicznych: o napędzie ręcznym wszystkich mechanizmów; z napędem elektrycznym
//    jednofazowym o udźwigu do 1000 kg; o udźwigu do 250 kg, z wyłączeniem urządzeń służących do przemieszczania osób.
//    Poz. 4–11 nie dotyczą urządzeń technicznych: o napędzie ręcznym wszystkich mechanizmów; o udźwigu do 250 kg,
//    z wyłączeniem dźwigów oraz urządzeń służących do przemieszczania osób.”
// 3. Kategoria i okres ważności: kolumny b i c tej tabeli; bierzemy je z OBSLUGA w uprawnienia-udt.ts (bez dublowania).
//    Zaświadczenie konserwatora (tab. nr 2) pokazujemy jako dopisek. Jedno zaświadczenie obejmuje jeden rodzaj z kolumny b
//    (§ 4 ust. 3), więc pozycje tab. nr 2, których KONSERWACJA w uprawnienia-udt.ts nie rozdziela, definiujemy tu
//    (KONSERWATOR, dosłownie z tab. nr 2).
// Wózki z napędem silnikowym: § 4 rozporządzenia bhp o wózkach jezdniowych z napędem silnikowym (t.j. Dz.U. 2020
// poz. 852): ust. 1 (z mechanicznym napędem podnoszenia: zaświadczenie kwalifikacyjne albo uprawnienia maszynisty ciężkich
// maszyn budowlanych i drogowych lub książka operatora maszyn roboczych z wpisem o wózkach podnośnikowych), ust. 2
// (pozostałe: szkolenie według programu UDT, prawo jazdy albo uprawnienia z ust. 1) i przepis przejściowy § 2
// rozporządzenia z 2019 r. (Dz.U. 2019 poz. 1948). Warunki egzaminu: art. 23 ust. 1c ustawy (18 lat, język polski albo
// tłumacz przysięgły), opłata art. 23 ust. 4.
//
// Przyjęte interpretacje (przepis nie rozstrzyga; wybieramy wariant bezpieczny, czyli „potrzebne”, i piszemy to w uwagach):
// - „do 1000 kg” i „do 250 kg” obejmują wartość graniczną (1000 kg i 250 kg wyłączone, 1001 kg i 251 kg nie).
// - Udźwig: największy udźwig nominalny z tabliczki i dokumentacji.
// - Wózki z mechanicznym napędem podnoszenia do 250 kg: zał. nr 3 je wyłącza, więc art. 22 ust. 3 ustawy nie działa, ale
//   § 4 ust. 1 rozp. bhp (wózki z napędem silnikowym) nie ma progu udźwigu. Wynik „potrzebne” z uwagą, że wystarczają też
//   uprawnienia z § 4 ust. 1 pkt 2. Wózek pchany ręcznie z elektrycznym podnoszeniem: nie wiadomo, czy to „wózek z napędem
//   silnikowym” (§ 1 rozp. bhp); wariant bezpieczny „potrzebne” z jawną uwagą.
// - Reach truck (wysuwany maszt): przepis nie mówi, czy to „wózek z wysięgnikiem”. Przyjmujemy 10 lat z uwagą (w praktyce
//   „wysięgnik” to ładowarka teleskopowa); ładowarka teleskopowa i wózek z podnoszonym operatorem: 5 lat.
// - „Specjalnego przeznaczenia” (wciągniki, suwnice) bez definicji: przy „nie wiem” wskazujemy kategorię 5-letnią
//   „ogólnego i specjalnego”, bo obejmuje obie.
// - Podest ruchomy traktujemy jako urządzenie służące do przemieszczania osób (do tego służy), więc wyjątek 250 kg go nie
//   obejmuje. Przepis tego nie definiuje.
// - Dźwig szpitalny: dopisek w tab. nr 1 lp. 9 mówi o „dźwigach szpitalnych nieposiadających kontroli obciążenia kabiny”;
//   przyjmujemy, że zaświadczenie jest potrzebne przy każdym dźwigu szpitalnym.
// - Napęd ręczny tylko wtedy, gdy ręczne są wszystkie mechanizmy (podnoszenie i jazda). Jeden napęd mechaniczny wystarczy.
// - Wysokość podnoszenia i sposób sterowania nie są kryterium w przepisach o zaświadczeniach (zał. nr 3), z wyjątkiem
//   dźwigów towarowo-osobowych, które tabela nr 1 obejmuje tylko „ze sterowaniem wewnętrznym”.
// - Funkcja bierze pod uwagę tylko pola, które mają znaczenie dla rodzaju (polaRodzaju); pozostałe ignoruje.
import { OBSLUGA, type RodzajUrzadzenia } from './uprawnienia-udt';

export type RodzajMaszyny =
  | 'wozek-widlowy'
  | 'reach-truck'
  | 'wozek-kompletacyjny'
  | 'ladowarka-teleskopowa'
  | 'paleciak'
  | 'ciagnik'
  | 'wciagnik'
  | 'suwnica'
  | 'zuraw'
  | 'ukladnica'
  | 'wyciag'
  | 'podest'
  | 'dzwignik'
  | 'dzwig';

export type Naped = 'reczny' | 'jednofazowy' | 'mechaniczny';
export type Przeznaczenie = 'ogolne' | 'specjalne' | 'nie-wiem';
export type TypZurawia = 'stacjonarny' | 'przewozny' | 'samojezdny' | 'wiezowy';
export type TypPodestu = 'przejezdny' | 'stacjonarny' | 'wiszacy' | 'masztowy' | 'zaladowczy';
export type TypDzwigu = 'osobowy' | 'towarowy' | 'towarowy-maly' | 'towarowo-osobowy-wewn' | 'towarowo-osobowy-zewn' | 'szpitalny' | 'budowlany';
export type NapedDzwigu = 'elektryczny' | 'hydrauliczny';
export type TypDzwignika = 'staly' | 'przenosny-reczny' | 'pojazd' | 'stol-technologiczny';

export type Pole =
  | 'jazda'
  | 'podnoszenie'
  | 'naped'
  | 'udzwig'
  | 'osoby'
  | 'przeznaczenie'
  | 'typZurawia'
  | 'typPodestu'
  | 'typDzwigu'
  | 'napedDzwigu'
  | 'typDzwignika';

/** Rodzaje do listy wyboru (krótkie nazwy) i pola, które mają dla nich znaczenie. */
export const RODZAJE: { id: RodzajMaszyny; nazwa: string; pola: Pole[] }[] = [
  { id: 'paleciak', nazwa: 'Paleciak, wózek unoszący', pola: ['jazda', 'podnoszenie', 'udzwig'] },
  { id: 'wozek-widlowy', nazwa: 'Wózek widłowy', pola: ['udzwig'] },
  { id: 'reach-truck', nazwa: 'Reach truck', pola: ['udzwig'] },
  { id: 'wozek-kompletacyjny', nazwa: 'Wózek kompletacyjny', pola: [] },
  { id: 'ladowarka-teleskopowa', nazwa: 'Ładowarka teleskopowa', pola: [] },
  { id: 'ciagnik', nazwa: 'Ciągnik, bez podnoszenia', pola: [] },
  { id: 'wciagnik', nazwa: 'Wciągnik, wciągarka', pola: ['naped', 'udzwig', 'osoby', 'przeznaczenie'] },
  { id: 'suwnica', nazwa: 'Suwnica', pola: ['naped', 'udzwig', 'osoby', 'przeznaczenie'] },
  { id: 'zuraw', nazwa: 'Żuraw (np. słupowy, HDS)', pola: ['typZurawia', 'naped', 'udzwig', 'osoby'] },
  { id: 'ukladnica', nazwa: 'Układnica', pola: ['naped', 'udzwig', 'osoby'] },
  { id: 'wyciag', nazwa: 'Wyciąg towarowy', pola: ['naped', 'udzwig'] },
  { id: 'podest', nazwa: 'Podest ruchomy, zwyżka', pola: ['typPodestu', 'naped'] },
  { id: 'dzwignik', nazwa: 'Stół podnośny, dźwignik', pola: ['typDzwignika'] },
  { id: 'dzwig', nazwa: 'Dźwig (winda)', pola: ['typDzwigu', 'napedDzwigu'] },
];

export interface DaneMaszyny {
  rodzaj: RodzajMaszyny;
  /** Paleciak: jazda z silnikiem (true) czy pchany ręcznie. */
  jazdaSilnikowa?: boolean;
  /** Paleciak: podnoszenie mechaniczne (silnik, pompa elektryczna) czy ręczną pompą. */
  podnoszenieMechaniczne?: boolean;
  naped?: Naped;
  /** Udźwig nominalny w kg. */
  udzwigKg?: number;
  /** Urządzenie przemieszcza też osoby (np. kabina operatora jadąca z ładunkiem). */
  przemieszczaOsoby?: boolean;
  przeznaczenie?: Przeznaczenie;
  typZurawia?: TypZurawia;
  typPodestu?: TypPodestu;
  typDzwigu?: TypDzwigu;
  /** Dźwig: napęd (tylko do rodzaju zaświadczenia konserwatora, tab. nr 2 lp. 12). */
  napedDzwigu?: NapedDzwigu;
  typDzwignika?: TypDzwignika;
}

const KLUCZ: Record<Pole, keyof DaneMaszyny> = {
  jazda: 'jazdaSilnikowa',
  podnoszenie: 'podnoszenieMechaniczne',
  naped: 'naped',
  udzwig: 'udzwigKg',
  osoby: 'przemieszczaOsoby',
  przeznaczenie: 'przeznaczenie',
  typZurawia: 'typZurawia',
  typPodestu: 'typPodestu',
  typDzwigu: 'typDzwigu',
  napedDzwigu: 'napedDzwigu',
  typDzwignika: 'typDzwignika',
};

/** Pola, które mają znaczenie dla danych (udźwig paleciaka tylko przy mechanicznym podnoszeniu). */
export function polaRodzaju(d: Pick<DaneMaszyny, 'rodzaj' | 'podnoszenieMechaniczne'>): Pole[] {
  const r = RODZAJE.find((x) => x.id === d.rodzaj);
  if (!r) throw new RangeError('Nieznany rodzaj maszyny.');
  return r.id === 'paleciak' && d.podnoszenieMechaniczne === false ? r.pola.filter((p) => p !== 'udzwig') : r.pola;
}

/** Zostawia tylko pola, które mają znaczenie dla rodzaju (reszta wraca do wartości domyślnych). */
export function tylkoPola(d: DaneMaszyny): DaneMaszyny {
  const wynik: DaneMaszyny = { rodzaj: d.rodzaj };
  for (const p of polaRodzaju(d)) (wynik as unknown as Record<string, unknown>)[KLUCZ[p]] = d[KLUCZ[p]];
  return wynik;
}

/** Gałąź drzewa: do testów i do wyboru tekstów. */
export type Galaz =
  | 'wymagane'
  | 'nie-utd' // R0: nie jest urządzeniem technicznym
  | 'wozek-bez-podnoszenia' // R0 + R6: wózek z silnikiem jazdy bez mechanicznego podnoszenia
  | 'reczny' // R1/R2: napęd ręczny wszystkich mechanizmów
  | 'jednofazowy' // R1: jednofazowy do 1000 kg (tylko poz. 1–3)
  | 'do-250' // R1/R2: udźwig do 250 kg
  | 'bez-obslugi'; // R3: urządzenie techniczne spoza tabeli nr 1

export interface WynikCzyUdt {
  potrzebne: boolean;
  galaz: Galaz;
  /** Rodzaj zaświadczenia z kolumny b i okres z kolumny c (tylko gdy potrzebne). */
  kategoria: RodzajUrzadzenia | null;
  /** Dlaczego, z przepisem w nawiasie. */
  powod: string;
  /** Co zamiast zaświadczenia (gdy niepotrzebne). */
  zamiast: string | null;
  /** Gdy przepis nie rozstrzyga albo ludzie się mylą. */
  uwagi: string[];
  /** Zaświadczenie potrzebne do konserwacji (tab. nr 2), gdy obsługa go nie wymaga. */
  konserwacja: RodzajUrzadzenia | null;
}

/** Zał. nr 3 tab. nr 2 („Konserwacja”) do rozporządzenia z 2019 r., kolumny b i c, dosłownie (wybrane pozycje). */
export const KONSERWATOR: RodzajUrzadzenia[] = [
  { id: 'k-wciagniki-ogolne', grupa: 'Wciągarki i wciągniki', krotko: 'Wciągniki i wciągarki ogólnego przeznaczenia', nazwa: 'Wciągniki i wciągarki ogólnego przeznaczenia', lata: 10 },
  { id: 'k-wciagniki-specjalne', grupa: 'Wciągarki i wciągniki', krotko: 'Wciągniki i wciągarki, także specjalne', nazwa: 'Wciągniki i wciągarki ogólnego i specjalnego przeznaczenia', lata: 10 },
  { id: 'k-suwnice-ogolne', grupa: 'Suwnice, wciągniki i wciągarki', krotko: 'Suwnice ogólnego przeznaczenia', nazwa: 'Suwnice, wciągniki i wciągarki ogólnego przeznaczenia', lata: 5 },
  { id: 'k-suwnice-specjalne', grupa: 'Suwnice, wciągniki i wciągarki', krotko: 'Suwnice, także specjalne', nazwa: 'Suwnice, wciągniki i wciągarki ogólnego oraz specjalnego przeznaczenia', lata: 5 },
  { id: 'k-zurawie-stacjonarne', grupa: 'Żurawie', krotko: 'Żurawie stacjonarne', nazwa: 'Żurawie stacjonarne (uprawnia też do wciągników i wciągarek ogólnego przeznaczenia)', lata: 10 },
  { id: 'k-zurawie-samojezdne', grupa: 'Żurawie', krotko: 'Żurawie samojezdne, przenośne i przewoźne', nazwa: 'Żurawie samojezdne oraz przenośne i przewoźne', lata: 5 },
  { id: 'k-zurawie-wiezowe', grupa: 'Żurawie', krotko: 'Żurawie wieżowe', nazwa: 'Żurawie wieżowe, szybkomontujące, szynowe i stacjonarne', lata: 5 },
  { id: 'k-ukladnice', grupa: 'Układnice magazynowe', krotko: 'Układnice', nazwa: 'Układnice', lata: 10 },
  { id: 'k-dzwigniki', grupa: 'Dźwigniki', krotko: 'Dźwigniki', nazwa: 'Dźwigniki do podnoszenia ładunków, w tym pojazdów', lata: 10 },
  { id: 'k-wyciagi', grupa: 'Wyciągi towarowe', krotko: 'Wyciągi towarowe', nazwa: 'Wyciągi towarowe', lata: 10 },
  { id: 'k-podesty-swm', grupa: 'Podesty ruchome', krotko: 'Podesty stacjonarne, wiszące, masztowe', nazwa: 'Podesty ruchome stacjonarne, wiszące oraz masztowe', lata: 5 },
  { id: 'k-podesty-pz', grupa: 'Podesty ruchome', krotko: 'Podesty przejezdne i załadowcze', nazwa: 'Podesty ruchome przejezdne oraz załadowcze, w tym do transportu osób', lata: 5 },
  { id: 'k-dzwigi-elektryczne', grupa: 'Dźwigi osobowe i towarowe', krotko: 'Dźwigi z napędem elektrycznym', nazwa: 'Dźwigi osobowe, towarowo-osobowe i towarowe z napędem elektrycznym', lata: 5 },
  { id: 'k-dzwigi-hydrauliczne', grupa: 'Dźwigi osobowe i towarowe', krotko: 'Dźwigi hydrauliczne i pneumatyczne', nazwa: 'Dźwigi osobowe, towarowo-osobowe i towarowe z napędem hydraulicznym oraz pneumatycznym', lata: 5 },
  { id: 'k-dzwigi-budowlane', grupa: 'Dźwigi budowlane', krotko: 'Dźwigi budowlane', nazwa: 'Dźwigi budowlane towarowe i towarowo-osobowe', lata: 5 },
];

const kat = (id: string) => {
  const r = OBSLUGA.find((o) => o.id === id);
  if (!r) throw new Error(`Brak rodzaju ${id} w OBSLUGA`);
  return r;
};
const kons = (id: string) => {
  const r = KONSERWATOR.find((k) => k.id === id);
  if (!r) throw new Error(`Brak rodzaju ${id} w KONSERWATOR`);
  return r;
};

export const MAKS_JEDNOFAZOWY = 1000;
export const MAKS_LEKKI = 250;

const TAB1 = 'zał. nr 3 tab. nr 1 do rozporządzenia z 2019 r.';
const WYLACZENIA = 'uwagi pod tab. nr 1 zał. nr 3 do rozporządzenia z 2019 r.';
const BHP_PRZED = 'Pracodawca musi przeszkolić pracownika z bhp przed dopuszczeniem do pracy (art. 237³ § 2 Kodeksu pracy), w tym instruktażem stanowiskowym (rozporządzenie o szkoleniu bhp).';
const PARAGRAF4 = `Osoba, która ukończyła 18 lat i ma: zaświadczenie ukończenia szkolenia odpowiedniego do rodzaju wózka według programu opracowanego lub zatwierdzonego przez UDT (albo do 1 stycznia 2011 r. przez ODK w Mysłowicach), albo prawo jazdy, albo uprawnienia wymagane do wózków podnośnikowych, np. zaświadczenie UDT (§ 4 ust. 2 pkt 1–3 rozporządzenia bhp o wózkach). Kto był dopuszczony do obsługi takich wózków według dawnych przepisów, może je obsługiwać dalej (§ 2 rozporządzenia z 2019 r., Dz.U. 2019 poz. 1948). ${BHP_PRZED}`;
const OGOLNE_BHP = `Nie wolno dopuścić pracownika do pracy bez wymaganych kwalifikacji i umiejętności (art. 237³ § 1 Kodeksu pracy). ${BHP_PRZED}`;
const UWAGA_KSIAZKA =
  'Rozporządzenie bhp o wózkach dopuszcza też osobę z uprawnieniami maszynisty ciężkich maszyn budowlanych i drogowych albo z książką operatora maszyn roboczych z wpisem o wózkach podnośnikowych (§ 4 ust. 1 pkt 2). Ustawa wymaga jednak zaświadczenia jednostki dozoru (art. 22 ust. 3), więc wskazujemy zaświadczenie UDT.';

const wymagane = (kategoria: RodzajUrzadzenia, powod: string, uwagi: string[] = []): WynikCzyUdt => ({
  potrzebne: true,
  galaz: 'wymagane',
  kategoria,
  powod,
  zamiast: null,
  uwagi,
  konserwacja: null,
});

const niewymagane = (galaz: Exclude<Galaz, 'wymagane'>, powod: string, zamiast: string, uwagi: string[] = [], konserwacja: RodzajUrzadzenia | null = null): WynikCzyUdt => ({
  potrzebne: false,
  galaz,
  kategoria: null,
  powod,
  zamiast,
  uwagi,
  konserwacja,
});

const zlyUdzwig = (u: number) => !Number.isFinite(u) || u <= 0;
function sprawdzUdzwig(udzwigKg: number | undefined): number {
  if (udzwigKg === undefined || zlyUdzwig(udzwigKg)) throw new RangeError('Podaj udźwig w kilogramach (liczba większa od zera).');
  return udzwigKg;
}

/** Wyłączenia pod tabelą nr 1: poz. 1–3 (z jednofazowym) albo 4–11 (bez niego). */
function wylaczenie(grupa: '1-3' | '4-11', d: DaneMaszyny, konserwacja: RodzajUrzadzenia | null): WynikCzyUdt | null {
  const naped = d.naped ?? 'mechaniczny';
  if (naped === 'reczny')
    return niewymagane('reczny', `Wszystkie mechanizmy mają napęd ręczny, a takich urządzeń wymóg zaświadczenia nie obejmuje (${WYLACZENIA}).`, OGOLNE_BHP, [], konserwacja);
  const udzwig = sprawdzUdzwig(d.udzwigKg);
  if (grupa === '1-3' && naped === 'jednofazowy' && udzwig <= MAKS_JEDNOFAZOWY)
    return niewymagane('jednofazowy', `Napęd elektryczny jednofazowy i udźwig do ${MAKS_JEDNOFAZOWY} kg: wymóg zaświadczenia nie obejmuje takich wciągników, wciągarek, suwnic i żurawi (${WYLACZENIA}).`, OGOLNE_BHP, [], konserwacja);
  if (udzwig <= MAKS_LEKKI && !d.przemieszczaOsoby)
    return niewymagane('do-250', `Udźwig do ${MAKS_LEKKI} kg, a urządzenie nie przemieszcza osób: wymóg zaświadczenia go nie obejmuje (${WYLACZENIA}).`, OGOLNE_BHP, [], konserwacja);
  return null;
}

function uwagiNapedu(grupa: '1-3' | '4-11', d: DaneMaszyny): string[] {
  const u: string[] = [];
  if (grupa === '4-11' && d.naped === 'jednofazowy')
    u.push('Wyjątek dla zasilania jednofazowego do 1000 kg dotyczy tylko wciągników, wciągarek, suwnic i żurawi (poz. 1–3 tabeli). Tego urządzenia nie obejmuje.');
  if (grupa === '1-3' && d.naped === 'jednofazowy' && (d.udzwigKg ?? 0) > MAKS_JEDNOFAZOWY)
    u.push(`Wyjątek dla zasilania jednofazowego obejmuje udźwig do ${MAKS_JEDNOFAZOWY} kg; to urządzenie ma większy.`);
  if (d.przemieszczaOsoby && (d.udzwigKg ?? Infinity) <= MAKS_LEKKI)
    u.push(`Wyjątek dla udźwigu do ${MAKS_LEKKI} kg nie obejmuje urządzeń, które przemieszczają osoby.`);
  return u;
}

const UWAGA_SPECJALNE =
  'Przepis nie definiuje „specjalnego przeznaczenia” (np. chwytak, elektromagnes, ciekły metal). Gdy nie wiesz, wskazujemy kategorię 5-letnią „ogólnego i specjalnego przeznaczenia”, bo obejmuje obie. Rodzaj urządzenia potwierdzi dokumentacja albo UDT.';

/** Uwagi dla wózka z mechanicznym napędem podnoszenia: § 4 ust. 1 pkt 2 i udźwig do 250 kg. */
function uwagiWozka(d: DaneMaszyny, pchany: boolean): string[] {
  const u: string[] = [];
  if (d.udzwigKg !== undefined && zlyUdzwig(d.udzwigKg)) throw new RangeError('Podaj udźwig w kilogramach (liczba większa od zera).');
  if (d.udzwigKg !== undefined && d.udzwigKg <= MAKS_LEKKI) {
    u.push(
      `Przy udźwigu do ${MAKS_LEKKI} kg wymóg z ustawy nie działa (${WYLACZENIA}). Obowiązek wynika wtedy tylko z § 4 ust. 1 rozporządzenia bhp o wózkach z napędem silnikowym, które nie ma progu udźwigu i dopuszcza zaświadczenie UDT albo uprawnienia z pkt 2 (maszynista, książka operatora).`,
    );
    if (pchany)
      u.push(
        'Przepis nie rozstrzyga, czy wózek pchany ręcznie z elektrycznym podnoszeniem to „wózek z napędem silnikowym” (§ 1 rozporządzenia bhp o wózkach). Przyjmujemy wariant bezpieczny: zaświadczenie potrzebne.',
      );
  }
  u.push(UWAGA_KSIAZKA);
  return u;
}

/** Rozstrzyga, czy do obsługi maszyny potrzebne jest zaświadczenie kwalifikacyjne UDT. */
export function czyUdt(dane: DaneMaszyny): WynikCzyUdt {
  const d = tylkoPola(dane);
  const WOZKI = `wózki jezdniowe podnośnikowe z mechanicznym napędem podnoszenia, ${TAB1}, lp. 8`;
  switch (d.rodzaj) {
    case 'ciagnik':
      return niewymagane(
        'wozek-bez-podnoszenia',
        'Wózek bez mechanicznego podnoszenia nie jest urządzeniem technicznym: przepis wymienia tylko wózki jezdniowe podnośnikowe z mechanicznym napędem podnoszenia (§ 1 pkt 6 lit. l rozporządzenia z 2012 r.).',
        PARAGRAF4,
      );
    case 'paleciak': {
      if (d.podnoszenieMechaniczne ?? true)
        return wymagane(
          kat('o-wozki'),
          `Wózek podnosi ładunek mechanicznie, więc jest wózkiem jezdniowym podnośnikowym z mechanicznym napędem podnoszenia (§ 1 pkt 6 lit. l rozporządzenia z 2012 r.; ${WOZKI}). Wysokość podnoszenia i prowadzenie z dyszla nie zmieniają wyniku.`,
          ['Podest, na którym operator stoi, ale który nie jedzie w górę z ładunkiem, nie zmienia kategorii.', ...uwagiWozka(d, d.jazdaSilnikowa === false)],
        );
      if (d.jazdaSilnikowa ?? true)
        return niewymagane(
          'wozek-bez-podnoszenia',
          'Podnoszenie ręczną pompą: to nie jest wózek z mechanicznym napędem podnoszenia, więc nie jest urządzeniem technicznym (§ 1 pkt 6 lit. l rozporządzenia z 2012 r.). Elektryczna jazda tego nie zmienia.',
          PARAGRAF4,
        );
      return niewymagane(
        'nie-utd',
        'Ręczny wózek paletowy (ręczna jazda i ręczne podnoszenie) nie jest urządzeniem technicznym (§ 1 pkt 6 lit. l rozporządzenia z 2012 r.) ani wózkiem z napędem silnikowym (§ 1 rozporządzenia bhp o wózkach).',
        OGOLNE_BHP,
      );
    }
    case 'wozek-widlowy':
      return wymagane(
        kat('o-wozki'),
        `Wózek widłowy podnosi mechanicznie (${WOZKI}). Gdy obsługujesz też ładowarki teleskopowe albo wózki z podnoszonym operatorem, potrzebna jest kategoria 5-letnia.`,
        uwagiWozka(d, false),
      );
    case 'reach-truck':
      return wymagane(kat('o-wozki'), `Reach truck podnosi mechanicznie (${WOZKI}).`, [
        'Przepis nie mówi, czy wysuwany maszt to „wysięgnik”. W praktyce „wózek z wysięgnikiem” to ładowarka teleskopowa, więc wskazujemy kategorię 10-letnią. Kategorię dla konkretnego wózka wskazuje pracodawca albo UDT; kategoria 5-letnia obejmuje wszystkie wózki.',
        ...uwagiWozka(d, false),
      ]);
    case 'wozek-kompletacyjny':
      return wymagane(
        kat('o-wozki-wysiegnik'),
        `Operator jedzie w górę razem z ładunkiem (${WOZKI}: wózki z osobą obsługującą podnoszoną wraz z ładunkiem). Ta kategoria uprawnia też do wszystkich innych wózków podnośnikowych.`,
        [UWAGA_KSIAZKA],
      );
    case 'ladowarka-teleskopowa':
      return wymagane(kat('o-wozki-wysiegnik'), `Ładowarka teleskopowa to wózek z wysięgnikiem (${WOZKI}). Ta kategoria uprawnia też do wszystkich innych wózków podnośnikowych.`, [UWAGA_KSIAZKA]);

    case 'wciagnik':
    case 'suwnica':
    case 'zuraw': {
      const lp = d.rodzaj === 'wciagnik' ? 1 : d.rodzaj === 'suwnica' ? 2 : 3;
      const p = d.przeznaczenie ?? 'nie-wiem';
      const ogolne = p === 'ogolne' ? 'ogolne' : 'specjalne';
      const typ = d.typZurawia ?? 'stacjonarny';
      const konserwacja = kons(
        d.rodzaj === 'wciagnik'
          ? `k-wciagniki-${ogolne}`
          : d.rodzaj === 'suwnica'
            ? `k-suwnice-${ogolne}`
            : { stacjonarny: 'k-zurawie-stacjonarne', przewozny: 'k-zurawie-samojezdne', samojezdny: 'k-zurawie-samojezdne', wiezowy: 'k-zurawie-wiezowe' }[typ],
      );
      const wyl = wylaczenie('1-3', d, konserwacja);
      if (wyl) return wyl;
      const uwagi = uwagiNapedu('1-3', d);
      let id: string;
      if (d.rodzaj === 'zuraw') {
        id = { stacjonarny: 'o-zurawie-stacjonarne', przewozny: 'o-zurawie-przewozne', samojezdny: 'o-zurawie-samojezdne', wiezowy: 'o-zurawie-wiezowe' }[typ];
      } else {
        if (p === 'nie-wiem') uwagi.push(UWAGA_SPECJALNE);
        id = `o-${d.rodzaj === 'wciagnik' ? 'wciagniki' : 'suwnice'}-${ogolne}`;
      }
      if (d.rodzaj === 'suwnica' && p !== 'nie-wiem') uwagi.push('Zaświadczenie na suwnice obejmuje też wciągniki i wciągarki tego samego przeznaczenia.');
      const nazwa = d.rodzaj === 'wciagnik' ? 'Wciągnik albo wciągarka' : d.rodzaj === 'suwnica' ? 'Suwnica' : 'Żuraw';
      return wymagane(kat(id), `${nazwa} z napędem mechanicznym, bez wyłączeń spod tabeli (${TAB1}, lp. ${lp}). Wysokość podnoszenia i sterowanie (kaseta, pilot, kabina) nie zmieniają wyniku.`, uwagi);
    }

    case 'ukladnica':
    case 'wyciag': {
      const konserwacja = kons(d.rodzaj === 'ukladnica' ? 'k-ukladnice' : 'k-wyciagi');
      const wyl = wylaczenie('4-11', d, konserwacja);
      if (wyl) return wyl;
      const lp = d.rodzaj === 'ukladnica' ? 4 : 5;
      return wymagane(kat(d.rodzaj === 'ukladnica' ? 'o-ukladnice' : 'o-wyciagi'), `${d.rodzaj === 'ukladnica' ? 'Układnica' : 'Wyciąg towarowy'} z napędem mechanicznym, bez wyłączeń spod tabeli (${TAB1}, lp. ${lp}).`, uwagiNapedu('4-11', d));
    }

    case 'podest': {
      const typ = d.typPodestu ?? 'przejezdny';
      const konserwacja = kons(typ === 'przejezdny' || typ === 'zaladowczy' ? 'k-podesty-pz' : 'k-podesty-swm');
      if (typ === 'zaladowczy')
        return niewymagane('bez-obslugi', `Podest ruchomy załadowczy (np. winda załadowcza) jest urządzeniem technicznym, ale tabela obsługi go nie wymienia (${TAB1}, lp. 7); zaświadczenie potrzebne jest tylko do konserwacji.`, OGOLNE_BHP, [], konserwacja);
      if ((d.naped ?? 'mechaniczny') === 'reczny')
        return niewymagane('reczny', `Wszystkie mechanizmy mają napęd ręczny, a takich urządzeń wymóg zaświadczenia nie obejmuje (${WYLACZENIA}).`, OGOLNE_BHP, [], konserwacja);
      const id = { przejezdny: 'o-podesty-przejezdne', stacjonarny: 'o-podesty-stacjonarne', wiszacy: 'o-podesty-wiszace', masztowy: 'o-podesty-masztowe' }[typ];
      return wymagane(
        kat(id),
        `Podest ruchomy służy do przemieszczania osób, więc przyjmujemy, że wyjątek dla udźwigu do ${MAKS_LEKKI} kg go nie obejmuje (${WYLACZENIA}; ${TAB1}, lp. 7). Wysokość podnoszenia nie zmienia wyniku.`,
        uwagiNapedu('4-11', d),
      );
    }

    case 'dzwignik': {
      const typ = d.typDzwignika ?? 'staly';
      if (typ !== 'staly') {
        const co = { 'przenosny-reczny': 'Dźwignik przenośny z napędem ręcznym', pojazd: 'Dźwignik stanowiący wyposażenie pojazdu', 'stol-technologiczny': 'Dźwignik do pochylania stołu technologicznego' }[typ];
        return niewymagane('nie-utd', `${co} nie jest urządzeniem technicznym (§ 1 pkt 6 lit. e rozporządzenia z 2012 r.).`, OGOLNE_BHP);
      }
      return niewymagane('bez-obslugi', `Dźwignik (np. stół podnośny, podnośnik warsztatowy) jest urządzeniem technicznym, ale tabela obsługi go nie wymienia (${TAB1}); zaświadczenie potrzebne jest tylko do konserwacji.`, OGOLNE_BHP, [], kons('k-dzwigniki'));
    }

    case 'dzwig': {
      const typ = d.typDzwigu ?? 'towarowy';
      if (typ === 'budowlany') return wymagane(kat('o-dzwigi-budowlane'), `Dźwig budowlany (${TAB1}, lp. 9). Udźwig nie ma znaczenia: wyjątek 250 kg nie obejmuje dźwigów.`);
      if (typ === 'towarowo-osobowy-wewn')
        return wymagane(kat('o-dzwigi-towarowo-osobowe'), `Dźwig towarowo-osobowy ze sterowaniem wewnętrznym (${TAB1}, lp. 9). Udźwig nie ma znaczenia: wyjątek 250 kg nie obejmuje dźwigów.`);
      if (typ === 'szpitalny')
        return wymagane(kat('o-dzwigi-towarowo-osobowe'), `Dźwig szpitalny (${TAB1}, lp. 9). Udźwig nie ma znaczenia: wyjątek 250 kg nie obejmuje dźwigów.`, [
          'Dopisek w tabeli mówi, że to zaświadczenie uprawnia do obsługi „dźwigów szpitalnych nieposiadających kontroli obciążenia kabiny”. Przepis nie mówi wprost, czy dźwig szpitalny z kontrolą obciążenia wymaga zaświadczenia. Przyjmujemy wariant bezpieczny: potrzebne.',
        ]);
      const co = { osobowy: 'Dźwig osobowy', towarowy: 'Dźwig towarowy', 'towarowy-maly': 'Dźwig towarowy mały', 'towarowo-osobowy-zewn': 'Dźwig towarowo-osobowy sterowany z przystanków' }[typ];
      return niewymagane(
        'bez-obslugi',
        `${co} jest urządzeniem technicznym, ale tabela obsługi go nie wymienia: obejmuje tylko dźwigi budowlane, szpitalne i towarowo-osobowe ze sterowaniem wewnętrznym (${TAB1}, lp. 9). Zaświadczenie potrzebne jest tylko do konserwacji.`,
        OGOLNE_BHP,
        [],
        kons((d.napedDzwigu ?? 'elektryczny') === 'elektryczny' ? 'k-dzwigi-elektryczne' : 'k-dzwigi-hydrauliczne'),
      );
    }
    default:
      throw new RangeError('Nieznany rodzaj maszyny.');
  }
}
