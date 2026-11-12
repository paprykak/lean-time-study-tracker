// Ważność świadectw kwalifikacyjnych „SEP” (stanowiska E i D, grupy G1–G3) i opłata za egzamin.
// Przepisy (stan na 12 listopada 2026 r.):
// - Prawo energetyczne, t.j. Dz.U. 2026 poz. 43: art. 54 ust. 1 (świadectwo wydane przez komisję kwalifikacyjną),
//   ust. 1aa (świadectwa tracą ważność po upływie 5 lat od dnia wydania), ust. 1b (ponowne sprawdzenie na wniosek
//   pracodawcy, inspektora pracy, Prezesa URE), ust. 2 (praca pod nadzorem bez świadectwa), ust. 4 (opłata od osoby
//   kierującej wniosek), ust. 4a i 4b (bez opłaty w komisjach MON i Ministra Sprawiedliwości; ust. 4b od 21 lipca 2026 r.,
//   Dz.U. 2026 poz. 900).
// - Ustawa z 20 maja 2021 r. o zmianie ustawy – Prawo energetyczne oraz niektórych innych ustaw (Dz.U. 2021 poz. 1093),
//   w życie 3 lipca 2021 r.: art. 25 – świadectwa wydane wcześniej zachowują ważność przez okres, na jaki zostały wydane;
//   pkt 2: nie dłużej niż 5 lat od dnia wejścia w życie ustawy; pkt 1 (osoby z dawnego art. 54 ust. 1c pkt 2: usługi
//   dla konsumentów i MŚP): bez tego limitu.
// - Rozporządzenie Ministra Klimatu i Środowiska z 1 lipca 2022 r. (Dz.U. 2022 poz. 1392): § 4 (stanowiska E i D),
//   § 5 (sama obsługa bez świadectwa), § 13 (świadectwo do 14 dni po egzaminie), § 14 ust. 1 (opłata: 10% minimalnego
//   wynagrodzenia obowiązującego w dniu złożenia wniosku), załącznik nr 1 (grupy i punkty).
// - Kodeks cywilny, t.j. Dz.U. 2026 poz. 795, art. 110–112 (Prawo energetyczne nie określa sposobu liczenia terminu;
//   termin w latach kończy się z upływem dnia rocznicy; 29 lutego + 5 lat = 28 lutego).
// - Płaca minimalna: PLACA_MINIMALNA w src/data/prawo.ts (rozporządzenia Rady Ministrów, Dz.U. 2025 poz. 1242 i 2026 poz. 1213).
//
// Przyjęte interpretacje (badanie prawne z 12 listopada 2026 r.):
// 1. „Po upływie 5 lat od dnia wydania”: według art. 110–112 KC świadectwo jest ważne do końca dnia rocznicy.
//    Dla zapasu przyjmujemy dzień wcześniej (ostatni dzień „z zapasem”). W dniu rocznicy narzędzie nie pisze „wygasło”,
//    tylko status 'ostatni-dzien-kc': dziś ostatni dzień według KC, bezpieczny termin minął wczoraj.
// 2. Świadectwa wydane przed 3 lipca 2021 r. bez terminu („bezterminowe”) wygasły: z zapasem z końcem 2 lipca 2026 r.
//    (według art. 112 KC z upływem 3 lipca 2026 r.). Świadectwa z wpisanym terminem: do tego terminu, ale nie dłużej
//    niż do 2 lipca 2026 r. Limit z art. 25 pkt 2 stosujemy zawsze, bo narzędzie nie wie, czy osoba należała do grupy
//    z art. 25 pkt 1 (dawny ust. 1c pkt 2), dla której limitu nie ma. Zakładamy, że tej grupie świadectwa wydawano
//    na 5 lat (sprawdzanie „co pięć lat”); przepis tego nie przesądza – to wariant bezpieczny.
// 3. Wpis „ważne do dnia” na świadectwie (wzór, zał. nr 3) rozstrzyga: jest wynikiem. Obliczenie służy do kontroli;
//    przy rozbieżności pokazujemy obie daty.
// 4. Liczy się data wydania, nie egzaminu (§ 13: do 14 dni później). Gdy znana jest tylko data egzaminu, liczymy od niej:
//    wynik wychodzi najwyżej 14 dni za wcześnie, czyli bezpiecznie.
// 5. Przedłużenia przepis nie zna: po nowym egzaminie nowe 5 lat biegnie od nowej daty wydania.
// 6. Przypomnienia w pliku .ics (3 miesiące i 1 miesiąc przed końcem) to propozycja redakcji, nie termin z przepisu:
//    zawiadomienie o egzaminie przychodzi co najmniej 14 dni wcześniej (§ 10 ust. 2), a świadectwo do 14 dni po nim (§ 13).
// 7. Opłata: dokładnie 10% (rozporządzenie, nie „do 10%” z ustawy), z płacy minimalnej z dnia złożenia wniosku,
//    za jeden egzamin (wniosek). Liczby wniosków przy E i D albo kilku grupach przepis nie ustala, więc nie mnożymy.
import { PLACA_MINIMALNA } from '../../data/prawo';
import type { Wydarzenie } from './kalendarz-ics';
import { dataPoPolsku, dniMiedzy, dodajDni, dodajLata, dodajMiesiace, poprawnaData } from './terminy';

/** Wejście w życie ustawy z 20 maja 2021 r. (5 lat dla wszystkich świadectw, art. 54 ust. 1aa). */
export const NOWE_ZASADY_OD = '2021-07-03';
/** Koniec starych świadectw (art. 25 pkt 2): bezpiecznie dzień przed rocznicą 3 lipca 2026 r. */
export const KONIEC_STARYCH = dodajDni(dodajLata(NOWE_ZASADY_OD, 5), -1);
/** To samo według art. 112 KC: z upływem rocznicy. */
export const KONIEC_STARYCH_KC = dodajLata(NOWE_ZASADY_OD, 5);
export const LATA_WAZNOSCI = 5;
/** Status „wkrótce” na tyle dni przed końcem (propozycja redakcji: egzamin trzeba umówić z wyprzedzeniem). */
export const WKROTCE_DNI = 90;
/** Przypomnienia w kalendarzu: tyle miesięcy przed ostatnim dniem ważności. */
export const PRZYPOMNIENIA_MIESIACE = [3, 1] as const;
/** Opłata: procent minimalnego wynagrodzenia (§ 14 ust. 1 rozporządzenia z 2022 r.). */
export const PROCENT_OPLATY = 10;
/** Komisja wydaje świadectwo najpóźniej tyle dni po egzaminie (§ 13). */
export const DNI_NA_WYDANIE = 14;

export type StatusSep = 'wazne' | 'wkrotce' | 'ostatni-dzien-kc' | 'wygaslo';
export type PodstawaSep = 'nowe' | 'stare-bez-terminu' | 'stare-z-terminem';

export interface DaneSep {
  /** Data wydania świadectwa (albo egzaminu, gdy `zDatyEgzaminu`). */
  wydano: string;
  /** Wpis „ważne do dnia” ze świadectwa, jeśli jest. */
  wpis?: string;
  zDatyEgzaminu?: boolean;
  dzis: string;
}

export interface WynikSep {
  podstawa: PodstawaSep;
  /** Ostatni dzień ważności przyjęty przez narzędzie (bezpieczny albo z wpisu). */
  waznoDo: string;
  /** Koniec według art. 112 KC (z upływem tego dnia), gdy liczymy sami; null przy wpisie. */
  wedlugKc: string | null;
  /** Ostatni dzień wyliczony z daty wydania (bezpiecznie), do porównania z wpisem; null dla starych. */
  wyliczone: string | null;
  /** Wpis różni się od wyliczenia (nowe świadectwa) albo przekracza limit z art. 25 (stare). */
  rozbieznosc: boolean;
  dniDoKonca: number;
  status: StatusSep;
  /** Nowe świadectwo wydane dziś byłoby ważne do (bezpiecznie). */
  noweOdDzis: string;
  wydarzenia: Wydarzenie[];
}

/** Ostatni dzień ważności świadectwa wydanego danego dnia (bezpiecznie: dzień przed rocznicą z art. 112 KC). */
export const ostatniDzien = (wydano: string) => dodajDni(dodajLata(wydano, LATA_WAZNOSCI), -1);

export function waznoscSep({ wydano, wpis, zDatyEgzaminu = false, dzis }: DaneSep): WynikSep {
  if (!poprawnaData(wydano)) throw new RangeError('Niepoprawna data wydania');
  if (!poprawnaData(dzis)) throw new RangeError('Niepoprawna data dzisiejsza');
  if (wpis !== undefined && wpis !== '' && !poprawnaData(wpis)) throw new RangeError('Niepoprawna data ważności');
  if (wydano > dzis) throw new RangeError('Data wydania późniejsza niż dziś');
  const maWpis = Boolean(wpis);
  if (maWpis && wpis! < wydano) throw new RangeError('Data ważności wcześniejsza niż data wydania');

  let podstawa: PodstawaSep;
  let waznoDo: string;
  let wedlugKc: string | null = null;
  let wyliczone: string | null = null;
  let rozbieznosc = false;

  if (wydano >= NOWE_ZASADY_OD) {
    podstawa = 'nowe';
    wyliczone = ostatniDzien(wydano);
    const rocznica = dodajLata(wydano, LATA_WAZNOSCI);
    if (maWpis) {
      waznoDo = wpis!;
      // Zgodny wpis: dzień przed rocznicą albo rocznica; od daty egzaminu wydanie mogło nastąpić do 14 dni później.
      const najpozniej = zDatyEgzaminu ? dodajDni(rocznica, DNI_NA_WYDANIE) : rocznica;
      rozbieznosc = wpis! < wyliczone || wpis! > najpozniej;
    } else {
      waznoDo = wyliczone;
      wedlugKc = rocznica;
    }
  } else if (maWpis) {
    // Art. 25: termin z wpisu; limit 5 lat od 3.07.2021 (pkt 2) stosujemy zawsze, bo nie wiemy, czy osoba należy
    // do wyjątku z pkt 1 (bez limitu, zakładamy świadectwa 5-letnie; przepis tego nie przesądza – wariant bezpieczny).
    podstawa = 'stare-z-terminem';
    rozbieznosc = wpis! > KONIEC_STARYCH;
    waznoDo = rozbieznosc ? KONIEC_STARYCH : wpis!;
  } else {
    podstawa = 'stare-bez-terminu';
    waznoDo = KONIEC_STARYCH;
    wedlugKc = KONIEC_STARYCH_KC;
  }

  const dniDoKonca = dniMiedzy(dzis, waznoDo);
  const status: StatusSep =
    dniDoKonca < 0 ? (wedlugKc === dzis ? 'ostatni-dzien-kc' : 'wygaslo') : dniDoKonca <= WKROTCE_DNI ? 'wkrotce' : 'wazne';
  const opis = `${wedlugKc ? `Świadectwo kwalifikacyjne ważne z zapasem do ${dataPoPolsku(waznoDo)} (według art. 110–112 Kodeksu cywilnego do końca ${dataPoPolsku(wedlugKc)}).` : `Świadectwo kwalifikacyjne ważne do ${dataPoPolsku(waznoDo)}`} Przepis nie przewiduje przedłużenia: potrzebny nowy egzamin w komisji kwalifikacyjnej, a nowe świadectwo jest ważne 5 lat od dnia jego wydania. Przypomnienie z wyprzedzeniem to propozycja redakcji, nie termin z przepisu. Policzone na rytmhali.pl/narzedzia/waznosc-uprawnien-sep.`;
  const kandydaci: Wydarzenie[] = [
    ...PRZYPOMNIENIA_MIESIACE.map((m) => ({
      data: dodajMiesiace(waznoDo, -m),
      tytul: `Uprawnienia SEP: ${m === 1 ? 'za miesiąc' : `za ${m} miesiące`} koniec ważności, umów egzamin`,
      opis,
    })),
    { data: waznoDo, tytul: wedlugKc ? 'Uprawnienia SEP: ostatni dzień ważności z zapasem (według KC jutro)' : 'Uprawnienia SEP: ostatni dzień ważności świadectwa', opis },
  ];
  return {
    podstawa,
    waznoDo,
    wedlugKc,
    wyliczone,
    rozbieznosc,
    dniDoKonca,
    status,
    noweOdDzis: ostatniDzien(dzis),
    wydarzenia: kandydaci.filter((w) => dniMiedzy(dzis, w.data) >= 0),
  };
}

export interface OplataSep {
  kwota: number;
  placa: number;
  rok: number;
}

/** Opłata za egzamin: 10% płacy minimalnej obowiązującej w dniu złożenia wniosku (§ 14 ust. 1), do grosza. */
export function oplataSep(dataWniosku: string): OplataSep {
  if (!poprawnaData(dataWniosku)) throw new RangeError('Niepoprawna data wniosku');
  const rok = Number(dataWniosku.slice(0, 4));
  const p = PLACA_MINIMALNA[rok];
  if (!p) throw new RangeError(`Brak płacy minimalnej na ${rok} r.`);
  return { kwota: Math.round(p.miesiecznie * PROCENT_OPLATY) / 100, placa: p.miesiecznie, rok };
}

export interface Punkt {
  nr: number;
  nazwa: string;
}

export interface Grupa {
  id: 'G1' | 'G2' | 'G3';
  nazwa: string;
  punkty: Punkt[];
}

const p = (nazwy: string[]): Punkt[] => nazwy.map((nazwa, i) => ({ nr: i + 1, nazwa }));

/** Załącznik nr 1 do rozporządzenia z 2022 r. (Dz.U. 2022 poz. 1392), brzmienie dosłowne punktów. */
export const GRUPY: Grupa[] = [
  {
    id: 'G1',
    nazwa: 'Urządzenia, instalacje i sieci elektroenergetyczne',
    punkty: p([
      'urządzenia prądotwórcze przyłączone do sieci przesyłowej lub dystrybucyjnej energii elektrycznej bez względu na wysokość napięcia znamionowego',
      'urządzenia, instalacje i sieci elektroenergetyczne o napięciu znamionowym nie wyższym niż 1 kV',
      'urządzenia, instalacje i sieci elektroenergetyczne o napięciu znamionowym wyższym niż 1 kV i napięciu znamionowym nie wyższym niż 30 kV',
      'urządzenia, instalacje i sieci elektroenergetyczne o napięciu znamionowym wyższym niż 30 kV i napięciu znamionowym nie wyższym niż 110 kV',
      'urządzenia, instalacje i sieci elektroenergetyczne o napięciu znamionowym wyższym niż 110 kV',
      'zespoły prądotwórcze o mocy wyższej niż 50 kW',
      'urządzenia elektrotermiczne',
      'urządzenia do elektrolizy',
      'sieci elektrycznego oświetlenia ulicznego',
      'elektryczna sieć trakcyjna',
      'elektryczne urządzenia w wykonaniu przeciwwybuchowym',
      'urządzenia umożliwiające magazynowanie energii elektrycznej i jej wprowadzanie do sieci elektroenergetycznej o mocy wyższej niż 10 kW',
      'aparatura kontrolno-pomiarowa oraz urządzenia i instalacje automatycznej regulacji, sterowania i zabezpieczeń urządzeń i instalacji wymienionych w pkt 1–12',
      'urządzenia techniki wojskowej lub uzbrojenia',
      'urządzenia ratowniczo-gaśnicze',
      'urządzenia ochrony granic',
    ]),
  },
  {
    id: 'G2',
    nazwa: 'Urządzenia cieplne i inne urządzenia energetyczne',
    punkty: p([
      'kotły parowe oraz wodne na paliwa stałe, płynne i gazowe, o mocy wyższej niż 50 kW i mocy nie wyższej niż 500 kW, wraz z urządzeniami pomocniczymi',
      'kotły parowe oraz wodne na paliwa stałe, płynne i gazowe, o mocy wyższej niż 500 kW i o mocy nie wyższej niż 1800 kW, wraz z urządzeniami pomocniczymi',
      'kotły parowe oraz wodne na paliwa stałe, płynne i gazowe, o mocy wyższej niż 1800 kW, wraz z urządzeniami pomocniczymi',
      'sieci i instalacje cieplne wraz z urządzeniami pomocniczymi, o przesyle ciepła wyższym niż 50 kW i o przesyle ciepła nie wyższym niż 500 kW',
      'sieci i instalacje cieplne wraz z urządzeniami pomocniczymi, o przesyle ciepła wyższym niż 500 kW',
      'turbiny parowe oraz wodne o mocy wyższej niż 50 kW i o mocy nie wyższej niż 15 MW, wraz z urządzeniami pomocniczymi',
      'turbiny parowe oraz wodne o mocy wyższej niż 15 MW i o mocy nie wyższej niż 100 MW, wraz z urządzeniami pomocniczymi',
      'turbiny parowe oraz wodne o mocy wyższej niż 100 MW i o mocy nie wyższej niż 500 MW, wraz z urządzeniami pomocniczymi',
      'turbiny parowe oraz wodne o mocy wyższej niż 500 MW, wraz z urządzeniami pomocniczymi',
      'przemysłowe urządzenia odbiorcze pary i gorącej wody o mocy wyższej niż 50 kW i o mocy nie wyższej niż 500 kW',
      'przemysłowe urządzenia odbiorcze pary i gorącej wody o mocy wyższej niż 500 kW',
      'urządzenia wentylacji, klimatyzacji i chłodnicze o mocy wyższej niż 50 kW i o mocy nie wyższej niż 500 kW',
      'urządzenia wentylacji, klimatyzacji i chłodnicze o mocy wyższej niż 500 kW',
      'pompy, ssawy, wentylatory i dmuchawy o mocy wyższej niż 50 kW i o mocy nie wyższej niż 500 kW',
      'pompy, ssawy, wentylatory i dmuchawy o mocy wyższej niż 500 kW',
      'sprężarki o mocy wyższej niż 20 kW i o mocy nie wyższej niż 200 kW oraz instalacje sprężonego powietrza i gazów technicznych',
      'sprężarki o mocy wyższej niż 200 kW oraz instalacje sprężonego powietrza i gazów technicznych',
      'urządzenia do składowania, magazynowania i rozładunku paliw o pojemności składowania odpowiadającej masie ponad 100 Mg',
      'piece przemysłowe o mocy wyższej niż 50 kW',
      'urządzenia umożliwiające przechowywanie ciepła lub chłodu w celu ich późniejszego wykorzystania o mocy wyższej niż 10 kW',
      'aparatura kontrolno-pomiarowa i urządzenia automatycznej regulacji do urządzeń, instalacji i sieci wymienionych w pkt 1–20',
      'urządzenia techniki wojskowej lub uzbrojenia',
      'urządzenia ratowniczo-gaśnicze',
      'urządzenia ochrony granic',
    ]),
  },
  {
    id: 'G3',
    nazwa: 'Urządzenia, instalacje i sieci gazowe',
    punkty: p([
      'urządzenia do produkcji paliw gazowych, generatory gazu',
      'urządzenia do przetwarzania i uzdatniania paliw gazowych, rozkładnie paliw gazowych, urządzenia przeróbki gazu ziemnego, oczyszczalnie gazu, rozprężalnie i rozlewnie gazu płynnego, odazotownie, mieszalnie',
      'urządzenia do magazynowania paliw gazowych',
      'sieci gazowe o ciśnieniu nie wyższym niż 0,5 MPa (gazociągi, stacje gazowe, zespoły gazowe na przyłączu, w tym punkty gazowe)',
      'sieci gazowe o ciśnieniu wyższym niż 0,5 MPa (gazociągi, stacje gazowe, zespoły gazowe na przyłączu, tłocznie gazu)',
      'urządzenia i instalacje gazowe o ciśnieniu nie wyższym niż 5 kPa',
      'urządzenia i instalacje gazowe o ciśnieniu wyższym niż 5 kPa',
      'przemysłowe odbiorniki paliw gazowych o mocy wyższej niż 50 kW',
      'turbiny gazowe',
      'aparatura kontrolno-pomiarowa, urządzenia sterowania do urządzeń, instalacji i sieci wymienionych w pkt 1–9',
      'urządzenia i instalacje do skraplania gazu ziemnego',
      'urządzenia i instalacje do regazyfikacji skroplonego gazu ziemnego',
      'instalacje do tankowania sprężonego gazu ziemnego',
      'instalacje do tankowania skroplonego gazu ziemnego',
      'urządzenia techniki wojskowej lub uzbrojenia',
    ]),
  },
];

/** Punkty najczęściej spotykane w zakładach i magazynach (wybór redakcji do krótkiej tabeli). */
export const NA_HALI: Record<Grupa['id'], number[]> = {
  G1: [2, 3, 6, 11, 12, 13],
  G2: [1, 12, 14, 16, 19],
  G3: [6, 7, 8],
};
