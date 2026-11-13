// Ważność zaświadczeń kwalifikacyjnych UDT i termin wniosku o przedłużenie.
// Okresy ważności: załącznik nr 3 do rozporządzenia z 21 maja 2019 r. (Dz.U. 2019 poz. 1008), tabela 1 (obsługa)
// i tabela 2 (konserwacja); wybrane urządzenia spotykane w zakładach i magazynach. Przedłużenie: art. 23 ust. 2a–2c
// ustawy o dozorze technicznym (wniosek najpóźniej 3 miesiące przed końcem ważności, co najmniej 3 lata pracy
// w ostatnich 5 latach), nowy okres liczony od dnia upływu ważności (§ 7 ust. 4 rozporządzenia).
// Zaświadczenia bez daty ważności (postępowania wszczęte przed 1 czerwca 2019 r.) straciły ważność 1 stycznia 2024 r.
// (art. 3 ustawy z 9 listopada 2018 r., Dz.U. 2018 poz. 2518; objaśnienie UDT).
import { dniMiedzy, dodajDni, dodajLata, dodajMiesiace, dataPoPolsku } from './terminy';
import { odmiana } from '../redakcja';
import type { Wydarzenie } from './kalendarz-ics';

export interface RodzajUrzadzenia {
  id: string;
  /** Pozycja z kolumny a załącznika nr 3. */
  grupa: string;
  /** Rodzaj z kolumny b. */
  nazwa: string;
  /** Krótka nazwa do listy wyboru (telefon ucina długie opcje); pełna nazwa i okres są w opisie pod polem. */
  krotko: string;
  /** Okres ważności z kolumny c (lata). */
  lata: 5 | 10;
}

export const OBSLUGA: RodzajUrzadzenia[] = [
  { id: 'o-wozki-wysiegnik', krotko: 'Wózki z wysięgnikiem', grupa: 'Wózki jezdniowe podnośnikowe', nazwa: 'Wózki z wysięgnikiem oraz z osobą obsługującą podnoszoną wraz z ładunkiem (uprawnia też do pozostałych wózków)', lata: 5 },
  { id: 'o-wozki', krotko: 'Wózki widłowe', grupa: 'Wózki jezdniowe podnośnikowe', nazwa: 'Wózki z mechanicznym napędem podnoszenia, bez wózków z wysięgnikiem i z podnoszonym operatorem', lata: 10 },
  { id: 'o-wciagniki-ogolne', krotko: 'Wciągniki ogólne', grupa: 'Wciągarki i wciągniki', nazwa: 'Wciągniki i wciągarki ogólnego przeznaczenia', lata: 10 },
  { id: 'o-wciagniki-specjalne', krotko: 'Wciągniki, też specjalne', grupa: 'Wciągarki i wciągniki', nazwa: 'Wciągniki i wciągarki ogólnego i specjalnego przeznaczenia', lata: 5 },
  { id: 'o-suwnice-ogolne', krotko: 'Suwnice ogólne', grupa: 'Suwnice', nazwa: 'Suwnice, wciągniki i wciągarki ogólnego przeznaczenia', lata: 10 },
  { id: 'o-suwnice-specjalne', krotko: 'Suwnice, też specjalne', grupa: 'Suwnice', nazwa: 'Suwnice, wciągniki i wciągarki ogólnego oraz specjalnego przeznaczenia', lata: 5 },
  { id: 'o-zurawie-stacjonarne', krotko: 'Żurawie stacjonarne', grupa: 'Żurawie', nazwa: 'Żurawie stacjonarne', lata: 10 },
  { id: 'o-zurawie-przewozne', krotko: 'Żurawie przewoźne', grupa: 'Żurawie', nazwa: 'Żurawie przewoźne i przenośne (także stacjonarne)', lata: 10 },
  { id: 'o-zurawie-samojezdne', krotko: 'Żurawie samojezdne', grupa: 'Żurawie', nazwa: 'Żurawie samojezdne (także przewoźne, przenośne i stacjonarne)', lata: 5 },
  { id: 'o-zurawie-wiezowe', krotko: 'Żurawie wieżowe', grupa: 'Żurawie', nazwa: 'Żurawie wieżowe i szybkomontujące (także szynowe)', lata: 5 },
  { id: 'o-ukladnice', krotko: 'Układnice', grupa: 'Układnice', nazwa: 'Układnice', lata: 10 },
  { id: 'o-wyciagi', krotko: 'Wyciągi towarowe', grupa: 'Wyciągi towarowe', nazwa: 'Wyciągi towarowe', lata: 10 },
  { id: 'o-podesty-stacjonarne', krotko: 'Podesty stacjonarne', grupa: 'Podesty ruchome', nazwa: 'Podesty ruchome stacjonarne', lata: 10 },
  { id: 'o-podesty-wiszace', krotko: 'Podesty wiszące', grupa: 'Podesty ruchome', nazwa: 'Podesty ruchome wiszące (także stacjonarne)', lata: 10 },
  { id: 'o-podesty-masztowe', krotko: 'Podesty masztowe', grupa: 'Podesty ruchome', nazwa: 'Podesty ruchome masztowe (także stacjonarne)', lata: 10 },
  { id: 'o-podesty-przejezdne', krotko: 'Podesty przejezdne', grupa: 'Podesty ruchome', nazwa: 'Podesty ruchome przejezdne', lata: 5 },
  { id: 'o-dzwigi-budowlane', krotko: 'Dźwigi budowlane', grupa: 'Dźwigi', nazwa: 'Dźwigi budowlane (także wyciągi towarowe)', lata: 10 },
  { id: 'o-dzwigi-towarowo-osobowe', krotko: 'Towarowo-osobowe', grupa: 'Dźwigi', nazwa: 'Dźwigi towarowo-osobowe ze sterowaniem wewnętrznym i szpitalne', lata: 10 },
  { id: 'o-kontenery', krotko: 'Przeładunek kontenerów', grupa: 'Urządzenia do manipulacji kontenerami', nazwa: 'Urządzenia do przemieszczania kontenerów przy pracach przeładunkowych', lata: 10 },
  { id: 'o-zbiorniki-przenosne', krotko: 'Zbiorniki przenośne', grupa: 'Zbiorniki przenośne', nazwa: 'Napełnianie zbiorników przenośnych (naczyń ciśnieniowych) powyżej 350 cm³', lata: 10 },
  { id: 'o-lpg', krotko: 'Zbiorniki LPG i CNG', grupa: 'Zbiorniki na gaz w pojazdach', nazwa: 'Napełnianie zbiorników LPG, CNG, LNG albo wodoru w pojazdach', lata: 10 },
  { id: 'o-adr', krotko: 'Zbiorniki ADR', grupa: 'Zbiorniki transportowe', nazwa: 'Napełnianie i opróżnianie zbiorników transportowych do materiałów niebezpiecznych (ADR, RID, ADN)', lata: 5 },
  { id: 'o-zbiorniki-transportowe', krotko: 'Zbiorniki poza ADR', grupa: 'Zbiorniki transportowe', nazwa: 'Napełnianie i opróżnianie zbiorników transportowych do materiałów niezaliczanych do niebezpiecznych', lata: 10 },
];

export const KONSERWACJA: RodzajUrzadzenia[] = [
  { id: 'k-wozki', krotko: 'Wózki podnośnikowe', grupa: 'Wózki jezdniowe podnośnikowe', nazwa: 'Wózki jezdniowe podnośnikowe z mechanicznym napędem podnoszenia', lata: 5 },
  { id: 'k-wciagniki', krotko: 'Wciągniki i wciągarki', grupa: 'Wciągarki i wciągniki', nazwa: 'Wciągniki i wciągarki ogólnego oraz ogólnego i specjalnego przeznaczenia', lata: 10 },
  { id: 'k-suwnice', krotko: 'Suwnice', grupa: 'Suwnice, wciągniki i wciągarki', nazwa: 'Suwnice, wciągniki i wciągarki ogólnego oraz specjalnego przeznaczenia', lata: 5 },
  { id: 'k-zurawie-stacjonarne', krotko: 'Żurawie stacjonarne', grupa: 'Żurawie', nazwa: 'Żurawie stacjonarne (także wciągniki i wciągarki ogólnego przeznaczenia)', lata: 10 },
  { id: 'k-zurawie-samojezdne', krotko: 'Żurawie samojezdne', grupa: 'Żurawie', nazwa: 'Żurawie samojezdne oraz przenośne i przewoźne', lata: 5 },
  { id: 'k-ukladnice', krotko: 'Układnice', grupa: 'Układnice magazynowe', nazwa: 'Układnice', lata: 10 },
  { id: 'k-dzwigniki', krotko: 'Dźwigniki', grupa: 'Dźwigniki', nazwa: 'Dźwigniki do podnoszenia ładunków, w tym pojazdów', lata: 10 },
  { id: 'k-wyciagi', krotko: 'Wyciągi towarowe', grupa: 'Wyciągi towarowe', nazwa: 'Wyciągi towarowe', lata: 10 },
  { id: 'k-podesty', krotko: 'Podesty ruchome', grupa: 'Podesty ruchome', nazwa: 'Podesty ruchome stacjonarne, wiszące, masztowe, przejezdne albo załadowcze', lata: 5 },
  { id: 'k-dzwigi', krotko: 'Dźwigi', grupa: 'Dźwigi osobowe i towarowe', nazwa: 'Dźwigi osobowe, towarowo-osobowe i towarowe (napęd elektryczny albo hydrauliczny i pneumatyczny)', lata: 5 },
  { id: 'k-dzwigi-budowlane', krotko: 'Dźwigi budowlane', grupa: 'Dźwigi budowlane', nazwa: 'Dźwigi budowlane towarowe i towarowo-osobowe', lata: 5 },
  { id: 'k-kontenery', krotko: 'Przeładunek kontenerów', grupa: 'Urządzenia do manipulacji kontenerami', nazwa: 'Urządzenia do przemieszczania kontenerów przy pracach przeładunkowych', lata: 5 },
];

export const WSZYSTKIE = [...OBSLUGA, ...KONSERWACJA];
export const rodzaj = (id: string) => WSZYSTKIE.find((r) => r.id === id);

/** Opis pod listą wyboru: obsługa albo konserwacja, pełna nazwa z załącznika nr 3 i okres ważności. */
export const opisRodzaju = (r: RodzajUrzadzenia) =>
  `${KONSERWACJA.includes(r) ? 'Konserwacja' : 'Obsługa'}: ${r.nazwa}. Zaświadczenie ważne ${odmiana(r.lata, ['rok', 'lata', 'lat'])}.`;

/** Zaświadczenia bez daty ważności (wydane przed 1 czerwca 2019 r.) straciły ważność tego dnia. */
export const KONIEC_STARYCH = '2024-01-01';
/** Wniosek o przedłużenie najpóźniej tyle miesięcy przed końcem ważności (art. 23 ust. 2c pkt 1). */
export const MIESIECY_PRZED = 3;
/** Opłata za egzamin: 3,75% przeciętnego wynagrodzenia z komunikatu GUS (art. 23 ust. 4 ustawy o dozorze technicznym). */
export const PROCENT_OPLATY = 3.75;

export type StatusUdt = 'wygaslo' | 'za-pozno-na-wniosek' | 'pilne' | 'wkrotce' | 'w-terminie';

export interface WynikUdt {
  waznoDo: string;
  wniosekDo: string;
  dniDoWniosku: number;
  dniDoKonca: number;
  /** Ważność po przedłużeniu: od dnia upływu dotychczasowej (§ 7 ust. 4). */
  poPrzedluzeniu: string;
  status: StatusUdt;
  wydarzenia: Wydarzenie[];
}

export function terminyUdt({ waznoDo, lata, dzis, nazwa }: { waznoDo: string; lata: 5 | 10; dzis: string; nazwa?: string }): WynikUdt {
  const wniosekDo = dodajMiesiace(waznoDo, -MIESIECY_PRZED);
  const dniDoWniosku = dniMiedzy(dzis, wniosekDo);
  const dniDoKonca = dniMiedzy(dzis, waznoDo);
  const status: StatusUdt =
    dniDoKonca < 0 ? 'wygaslo' : dniDoWniosku < 0 ? 'za-pozno-na-wniosek' : dniDoWniosku <= 30 ? 'pilne' : dniDoWniosku <= 90 ? 'wkrotce' : 'w-terminie';
  const opis = `Zaświadczenie kwalifikacyjne UDT${nazwa ? ` (${nazwa})` : ''} ważne do ${dataPoPolsku(waznoDo)} Wniosek o przedłużenie najpóźniej ${dataPoPolsku(wniosekDo)}, do jednostki, która wydała zaświadczenie (np. przez portal eUDT). Policzone na rytmhali.pl/narzedzia/waznosc-uprawnien-udt.`;
  const kandydaci: Wydarzenie[] = [
    { data: dodajDni(wniosekDo, -30), tytul: 'Złóż wniosek o przedłużenie uprawnień UDT', opis, przypomnienia: [0] },
    { data: wniosekDo, tytul: 'Ostatni dzień na wniosek o przedłużenie uprawnień UDT', opis },
    { data: waznoDo, tytul: 'Koniec ważności zaświadczenia UDT', opis },
  ];
  return {
    waznoDo,
    wniosekDo,
    dniDoWniosku,
    dniDoKonca,
    poPrzedluzeniu: dodajLata(waznoDo, lata),
    status,
    wydarzenia: kandydaci.filter((w) => dniMiedzy(dzis, w.data) >= 0),
  };
}

/**
 * Kwota GUS do opłaty może być już nieaktualna: komunikat o przeciętnym wynagrodzeniu wychodzi co roku w lutym,
 * więc po 12 miesiącach od ogłoszenia ostatniego znanego komunikatu mógł wyjść następny.
 */
export const kwotaGusMozeNieaktualna = (ogloszono: string, dzis: string) => dzis > dodajMiesiace(ogloszono, 12);

/** Opłata za egzamin w zł (do grosza), z przeciętnego wynagrodzenia obowiązującego w dniu złożenia wniosku. */
export const oplataEgzaminu = (przecietneWynagrodzenie: number) => Math.round(Number((przecietneWynagrodzenie * PROCENT_OPLATY).toPrecision(12))) / 100;
