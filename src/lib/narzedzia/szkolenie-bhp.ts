// Termin szkolenia okresowego BHP: rozporządzenie w sprawie szkolenia w dziedzinie BHP (t.j. Dz.U. 2024 poz. 1327),
// § 14 ust. 2 (kto) i § 15 ust. 1, 2 i 4 (jak często i kiedy pierwsze), oraz art. 237^3 § 2^2 Kodeksu pracy
// (zwolnienie stanowisk administracyjno-biurowych). Termin liczymy jak w art. 112 Kodeksu cywilnego (terminy.ts).
import { dniMiedzy, dodajDni, dodajLata, koniecOkresu, dataPoPolsku } from './terminy';
import type { Wydarzenie } from './kalendarz-ics';

export const GRUPY = {
  robotnicze: {
    nazwa: 'Stanowisko robotnicze',
    krotko: 'Robotnicze',
    przyklady: 'np. operator maszyn, monter, magazynier',
    coIleLat: 3,
    pierwszeMiesiecy: 12,
    forma: 'instruktaż',
    podstawa: '§ 14 ust. 2 pkt 2, § 15 ust. 1 i 4',
  },
  'robotnicze-szczegolnie-niebezpieczne': {
    nazwa: 'Stanowisko robotnicze z pracami szczególnie niebezpiecznymi',
    krotko: 'Szczególnie niebezpieczne',
    przyklady: 'prace z wykazu prac szczególnie niebezpiecznych u pracodawcy',
    coIleLat: 1,
    pierwszeMiesiecy: 12,
    forma: 'instruktaż',
    podstawa: '§ 14 ust. 2 pkt 2, § 15 ust. 1 i 4',
  },
  kierujacy: {
    nazwa: 'Pracodawca albo osoba kierująca pracownikami',
    krotko: 'Kierowanie pracownikami',
    przyklady: 'np. kierownik, mistrz, brygadzista',
    coIleLat: 5,
    pierwszeMiesiecy: 6,
    forma: 'kurs, seminarium albo samokształcenie kierowane',
    podstawa: '§ 14 ust. 2 pkt 1, § 15 ust. 2 i 4',
  },
  'inzynieryjno-techniczne': {
    nazwa: 'Stanowisko inżynieryjno-techniczne',
    krotko: 'Inżynieryjno-techniczne',
    przyklady: 'np. projektant, konstruktor maszyn, technolog, organizator produkcji',
    coIleLat: 5,
    pierwszeMiesiecy: 12,
    forma: 'kurs, seminarium albo samokształcenie kierowane',
    podstawa: '§ 14 ust. 2 pkt 3, § 15 ust. 2 i 4',
  },
  'sluzba-bhp': {
    nazwa: 'Służba BHP',
    krotko: 'Służba BHP',
    przyklady: 'pracownicy służby BHP i inne osoby wykonujące jej zadania',
    coIleLat: 5,
    pierwszeMiesiecy: 12,
    forma: 'kurs, seminarium albo samokształcenie kierowane',
    podstawa: '§ 14 ust. 2 pkt 4, § 15 ust. 2 i 4',
  },
  'administracyjno-biurowe': {
    nazwa: 'Stanowisko administracyjno-biurowe',
    krotko: 'Biurowe',
    przyklady: 'np. biuro, kadry, księgowość, planowanie',
    coIleLat: 6,
    pierwszeMiesiecy: 12,
    forma: 'kurs, seminarium albo samokształcenie kierowane',
    podstawa: '§ 14 ust. 2 pkt 5, § 15 ust. 2 i 4',
  },
  'inne-narazeni': {
    nazwa: 'Inne stanowisko z narażeniem albo odpowiedzialnością za BHP',
    krotko: 'Inne z narażeniem',
    przyklady: 'praca z czynnikami szkodliwymi, uciążliwymi lub niebezpiecznymi albo z odpowiedzialnością w zakresie BHP',
    coIleLat: 5,
    pierwszeMiesiecy: 12,
    forma: 'kurs, seminarium albo samokształcenie kierowane',
    podstawa: '§ 14 ust. 2 pkt 6, § 15 ust. 2 i 4',
  },
} as const;

export type GrupaStanowisk = keyof typeof GRUPY;
export const KLUCZE_GRUP = Object.keys(GRUPY) as GrupaStanowisk[];

/** Ile dni przed terminem przypomnienie „zaplanuj szkolenie” w pliku kalendarza. */
export const PRZYPOMNIENIE_DNI = 60;

export interface DaneSzkolenia {
  grupa: GrupaStanowisk;
  /** Data ukończenia ostatniego szkolenia okresowego (z zaświadczenia); null, gdy nie było. */
  ostatnie: string | null;
  /** Data rozpoczęcia pracy na stanowisku (do pierwszego szkolenia okresowego). */
  poczatekPracy: string | null;
  /** Dzisiejsza data (RRRR-MM-DD). */
  dzis: string;
  /** Stanowisko biurowe u pracodawcy z kategorią ryzyka nie wyższą niż 3 (art. 237^3 § 2^2 Kp). */
  zwolnienieBiurowe?: boolean;
}

export type StatusTerminu = 'po-terminie' | 'pilne' | 'wkrotce' | 'w-terminie' | 'niewymagane';

export interface WynikSzkolenia {
  rodzaj: 'kolejne' | 'pierwsze' | 'niewymagane';
  termin: string | null;
  dni: number | null;
  status: StatusTerminu;
  wydarzenia: Wydarzenie[];
}

export const status = (dni: number): StatusTerminu => (dni < 0 ? 'po-terminie' : dni <= 30 ? 'pilne' : dni <= 90 ? 'wkrotce' : 'w-terminie');

export function terminSzkolenia(d: DaneSzkolenia): WynikSzkolenia {
  const g = GRUPY[d.grupa];
  if (d.grupa === 'administracyjno-biurowe' && d.zwolnienieBiurowe) {
    return { rodzaj: 'niewymagane', termin: null, dni: null, status: 'niewymagane', wydarzenia: [] };
  }
  let rodzaj: 'kolejne' | 'pierwsze';
  let termin: string;
  if (d.ostatnie) {
    rodzaj = 'kolejne';
    termin = dodajLata(d.ostatnie, g.coIleLat);
  } else if (d.poczatekPracy) {
    rodzaj = 'pierwsze';
    // § 15: „w okresie do 6 (12) miesięcy od rozpoczęcia pracy”. Liczymy z pierwszym dniem pracy (`koniecOkresu`), o dzień
    // wcześniej niż termin od zdarzenia (`dodajMiesiace`): świadomy wariant wcześniejszy, bezpieczny (terminy.ts).
    termin = koniecOkresu(d.poczatekPracy, g.pierwszeMiesiecy);
  } else {
    throw new RangeError('Podaj datę ostatniego szkolenia okresowego albo datę rozpoczęcia pracy');
  }
  const dni = dniMiedzy(d.dzis, termin);
  const planuj = dodajDni(termin, -PRZYPOMNIENIE_DNI);
  const opis = `Szkolenie okresowe BHP (${g.nazwa.toLowerCase()}): najpóźniej ${dataPoPolsku(termin)} Policzone na rytmhali.pl/narzedzia/szkolenie-okresowe-bhp.`;
  const wydarzenia: Wydarzenie[] = [
    ...(dniMiedzy(d.dzis, planuj) >= 0 ? [{ data: planuj, tytul: 'Zaplanuj szkolenie okresowe BHP', opis, przypomnienia: [0] }] : []),
    { data: termin, tytul: 'Ostatni dzień na szkolenie okresowe BHP', opis },
  ];
  return { rodzaj, termin, dni, status: status(dni), wydarzenia };
}
