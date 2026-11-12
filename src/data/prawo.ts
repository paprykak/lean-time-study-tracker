// Rejestr przepisów i wartości prawnych, na których liczą narzędzia (src/lib/narzedzia/). Jedno źródło prawdy:
// strona narzędzia pokazuje z niego podstawę prawną, a obliczenia biorą z niego kwoty. Każda pozycja ma adres
// w Dzienniku Ustaw (ELI) i datę, kiedy redakcja sprawdziła tekst u źródła (API Sejmu, api.sejm.gov.pl/eli).
// Kopie tekstów: .cache/narzedzia/prawo/ (poza repozytorium). Test src/lib/narzedzia/prawo.test.ts pilnuje,
// żeby płaca minimalna była wpisana na bieżący rok i żeby żadne sprawdzenie nie było starsze niż rok z kwartałem.

export interface Akt {
  /** Nazwa skrócona do zdania: „Kodeks pracy”. */
  nazwa: string;
  /** Publikator: „Dz.U. 2026 poz. 1245”. */
  publikator: string;
  /** Rodzaj publikacji, gdy to nie akt pierwotny: „tekst jednolity”. */
  uwaga?: string;
  /** Adres w Dzienniku Ustaw (ELI). */
  adres: string;
  /** Data sprawdzenia tekstu u źródła (RRRR-MM-DD). */
  sprawdzono: string;
}

const eli = (rok: number, poz: number) => `https://eli.gov.pl/eli/DU/${rok}/${poz}/ogl`;

export const AKTY = {
  kodeksPracy: {
    nazwa: 'Kodeks pracy',
    publikator: 'Dz.U. 2026 poz. 1245',
    uwaga: 'tekst jednolity, stan prawny na 27 sierpnia 2026 r.',
    adres: eli(2026, 1245),
    sprawdzono: '2026-11-11',
  },
  dniWolne: {
    nazwa: 'Ustawa o dniach wolnych od pracy',
    publikator: 'Dz.U. 2025 poz. 296',
    uwaga: 'tekst jednolity; Wigilia dniem wolnym od 1 lutego 2025 r. (Dz.U. 2024 poz. 1965)',
    adres: eli(2025, 296),
    sprawdzono: '2026-11-11',
  },
  minimalneWynagrodzenie: {
    nazwa: 'Ustawa o minimalnym wynagrodzeniu za pracę',
    publikator: 'Dz.U. 2024 poz. 1773',
    uwaga: 'tekst jednolity',
    adres: eli(2024, 1773),
    sprawdzono: '2026-11-11',
  },
  kodeksCywilny: {
    nazwa: 'Kodeks cywilny',
    publikator: 'Dz.U. 2026 poz. 795',
    uwaga: 'tekst jednolity; art. 112: terminy w miesiącach i latach',
    adres: eli(2026, 795),
    sprawdzono: '2026-11-11',
  },
  szkoleniaBhp: {
    nazwa: 'Rozporządzenie w sprawie szkolenia w dziedzinie bezpieczeństwa i higieny pracy',
    publikator: 'Dz.U. 2024 poz. 1327',
    uwaga: 'tekst jednolity; zmiana Dz.U. 2025 poz. 1640 dotyczy tylko potwierdzania instruktażu (§ 12)',
    adres: eli(2024, 1327),
    sprawdzono: '2026-11-11',
  },
  ogolneBhp: {
    nazwa: 'Rozporządzenie w sprawie ogólnych przepisów bezpieczeństwa i higieny pracy',
    publikator: 'Dz.U. 2003 poz. 1650',
    uwaga: 'tekst jednolity ze zmianami, ostatnia Dz.U. 2026 poz. 927; § 80: prace szczególnie niebezpieczne',
    adres: eli(2003, 1650),
    sprawdzono: '2026-11-11',
  },
  dozorTechniczny: {
    nazwa: 'Ustawa o dozorze technicznym',
    publikator: 'Dz.U. 2024 poz. 1194',
    uwaga: 'tekst jednolity; późniejsza zmiana Dz.U. 2026 poz. 252 nie dotyczy kwalifikacji; art. 22–23',
    adres: eli(2024, 1194),
    sprawdzono: '2026-11-11',
  },
  kwalifikacjeUdt: {
    nazwa: 'Rozporządzenie w sprawie sposobu i trybu sprawdzania kwalifikacji przy obsłudze i konserwacji urządzeń technicznych oraz przedłużania zaświadczeń',
    publikator: 'Dz.U. 2019 poz. 1008',
    uwaga: '§ 6–7 i załącznik nr 3: rodzaje urządzeń i okresy ważności',
    adres: eli(2019, 1008),
    sprawdzono: '2026-11-11',
  },
  zwolnieniaGrupowe: {
    nazwa: 'Ustawa o szczególnych zasadach rozwiązywania z pracownikami stosunków pracy z przyczyn niedotyczących pracowników',
    publikator: 'Dz.U. 2026 poz. 1195',
    uwaga: 'tekst jednolity, bez późniejszych zmian; art. 1, 8 i 10',
    adres: eli(2026, 1195),
    sprawdzono: '2026-11-11',
  },
  pit: {
    nazwa: 'Ustawa o podatku dochodowym od osób fizycznych',
    publikator: 'Dz.U. 2026 poz. 592',
    uwaga: 'tekst jednolity; późniejsze zmiany nie dotyczą zaliczek od wynagrodzeń; art. 21 ust. 1 pkt 148, art. 22 ust. 2, art. 27, 31b, 32',
    adres: eli(2026, 592),
    sprawdzono: '2026-11-11',
  },
  swiadczeniaZdrowotne: {
    nazwa: 'Ustawa o świadczeniach opieki zdrowotnej finansowanych ze środków publicznych',
    publikator: 'Dz.U. 2025 poz. 1461',
    uwaga: 'tekst jednolity; późniejsze zmiany nie dotyczą składki pracownika; art. 79, 81 i 83',
    adres: eli(2025, 1461),
    sprawdzono: '2026-11-11',
  },
  ordynacja: {
    nazwa: 'Ustawa – Ordynacja podatkowa',
    publikator: 'Dz.U. 2026 poz. 622',
    uwaga: 'tekst jednolity; art. 63 § 1: zaokrąglanie podstawy i podatku do pełnych złotych',
    adres: eli(2026, 622),
    sprawdzono: '2026-11-11',
  },
  zasilkowa: {
    nazwa: 'Ustawa o świadczeniach pieniężnych z ubezpieczenia społecznego w razie choroby i macierzyństwa',
    publikator: 'Dz.U. 2026 poz. 854',
    uwaga: 'tekst jednolity, bez późniejszych zmian; art. 3 pkt 3, art. 4, 8, 11, 36–38, 42 i 45',
    adres: eli(2026, 854),
    sprawdzono: '2026-11-11',
  },
  systemUbezpieczen: {
    nazwa: 'Ustawa o systemie ubezpieczeń społecznych',
    publikator: 'Dz.U. 2026 poz. 199',
    uwaga: 'tekst jednolity; późniejsze zmiany nie dotyczą stóp składek; art. 16 i 22',
    adres: eli(2026, 199),
    sprawdzono: '2026-11-11',
  },
  zmianaZasilkowa2021: {
    nazwa: 'Ustawa z 24 czerwca 2021 r. o zmianie ustawy o systemie ubezpieczeń społecznych oraz niektórych innych ustaw',
    publikator: 'Dz.U. 2021 poz. 1621',
    uwaga: 'art. 3 pkt 4: od 1 stycznia 2022 r. bez obniżki zasiłku do 70% za pobyt w szpitalu',
    adres: eli(2021, 1621),
    sprawdzono: '2026-11-11',
  },
  urlopowe: {
    nazwa: 'Rozporządzenie w sprawie szczegółowych zasad udzielania urlopu wypoczynkowego, ustalania i wypłacania wynagrodzenia za czas urlopu oraz ekwiwalentu pieniężnego za urlop',
    publikator: 'Dz.U. 1997 nr 2 poz. 14',
    uwaga: 'zmiany: Dz.U. 2002 poz. 1810, 2003 poz. 2290, 2006 poz. 1591, 2009 poz. 1353 (bez tekstu jednolitego); § 6 i § 14–19',
    adres: eli(1997, 14),
    sprawdzono: '2026-11-11',
  },
  warunkiUtb: {
    nazwa: 'Rozporządzenie w sprawie warunków technicznych dozoru technicznego w zakresie eksploatacji, napraw i modernizacji urządzeń transportu bliskiego',
    publikator: 'Dz.U. 2018 poz. 2176',
    uwaga: 'bez zmian; § 3, § 6–9, § 12, § 22, załącznik nr 1 (formy dozoru i terminy badań) i nr 2 (przeglądy konserwacyjne)',
    adres: eli(2018, 2176),
    sprawdzono: '2026-11-11',
  },
  zmianaUdt2018: {
    nazwa: 'Ustawa z 9 listopada 2018 r. o zmianie ustawy o dozorze technicznym',
    publikator: 'Dz.U. 2018 poz. 2518',
    uwaga: 'art. 3: zaświadczenia wydane przed 1 czerwca 2019 r. zachowały ważność przez 5 lat',
    adres: eli(2018, 2518),
    sprawdzono: '2026-11-11',
  },
  przecietneWynagrodzenie2025: {
    nazwa: 'Komunikat Prezesa GUS w sprawie przeciętnego wynagrodzenia w gospodarce narodowej w 2025 r.',
    publikator: 'M.P. 2026 poz. 192',
    uwaga: '8903,56 zł',
    adres: 'https://eli.gov.pl/eli/MP/2026/192/ogl',
    sprawdzono: '2026-11-11',
  },
  recznePrace: {
    nazwa: 'Rozporządzenie w sprawie bezpieczeństwa i higieny pracy przy ręcznych pracach transportowych',
    publikator: 'Dz.U. 2018 poz. 1139',
    uwaga: 'tekst jednolity; § 2, 3, 13, 14, 16 i 17',
    adres: eli(2018, 1139),
    sprawdzono: '2026-11-11',
  },
  praceKobietCiaza: {
    nazwa: 'Rozporządzenie w sprawie wykazu prac uciążliwych, niebezpiecznych lub szkodliwych dla zdrowia kobiet w ciąży i kobiet karmiących dziecko piersią',
    publikator: 'Dz.U. 2017 poz. 796',
    uwaga: 'załącznik, cz. I',
    adres: eli(2017, 796),
    sprawdzono: '2026-11-11',
  },
  praceMlodocianych: {
    nazwa: 'Rozporządzenie w sprawie wykazu prac wzbronionych młodocianym i warunków ich zatrudniania przy niektórych z tych prac',
    publikator: 'Dz.U. 2023 poz. 1240',
    uwaga: 'załącznik nr 1, cz. I ust. 1',
    adres: eli(2023, 1240),
    sprawdzono: '2026-11-11',
  },
  temperatura2026: {
    nazwa: 'Rozporządzenie z 9 lipca 2026 r. zmieniające rozporządzenie w sprawie ogólnych przepisów BHP (§ 30a: temperatura)',
    publikator: 'Dz.U. 2026 poz. 927',
    uwaga: 'wchodzi w życie 11 stycznia 2027 r.',
    adres: eli(2026, 927),
    sprawdzono: '2026-11-11',
  },
  napoje: {
    nazwa: 'Rozporządzenie w sprawie profilaktycznych posiłków i napojów',
    publikator: 'Dz.U. 1996 poz. 279',
    uwaga: '§ 4: napoje; zmiana Dz.U. 2019 poz. 1160 dotyczy tylko posiłków',
    adres: eli(1996, 279),
    sprawdzono: '2026-11-11',
  },
  wynagrodzenieRozp: {
    nazwa: 'Rozporządzenie w sprawie sposobu ustalania wynagrodzenia w okresie niewykonywania pracy oraz wynagrodzenia stanowiącego podstawę obliczania odszkodowań i innych należności z Kodeksu pracy',
    publikator: 'Dz.U. 2017 poz. 927',
    uwaga: 'tekst jednolity; § 4a: stawka za godzinę z pensji miesięcznej, § 4b: dodatek nocny',
    adres: eli(2017, 927),
    sprawdzono: '2026-11-11',
  },
  zmianaStazu2025: {
    nazwa: 'Ustawa z 26 września 2025 r. o zmianie ustawy – Kodeks pracy oraz niektórych innych ustaw (staż pracy)',
    publikator: 'Dz.U. 2025 poz. 1423',
    uwaga: 'art. 302^1 Kp; w mocy od 1 stycznia 2026 r., u pracodawców spoza sektora finansów publicznych od 1 maja 2026 r. (art. 9 i 10)',
    adres: eli(2025, 1423),
    sprawdzono: '2026-11-11',
  },
  placa2025: {
    nazwa: 'Rozporządzenie w sprawie minimalnego wynagrodzenia w 2025 r.',
    publikator: 'Dz.U. 2024 poz. 1362',
    adres: eli(2024, 1362),
    sprawdzono: '2026-11-11',
  },
  placa2026: {
    nazwa: 'Rozporządzenie w sprawie minimalnego wynagrodzenia w 2026 r.',
    publikator: 'Dz.U. 2025 poz. 1242',
    adres: eli(2025, 1242),
    sprawdzono: '2026-11-11',
  },
  placa2027: {
    nazwa: 'Rozporządzenie w sprawie minimalnego wynagrodzenia w 2027 r.',
    publikator: 'Dz.U. 2026 poz. 1213',
    adres: eli(2026, 1213),
    sprawdzono: '2026-11-11',
  },
} as const satisfies Record<string, Akt>;

export type KluczAktu = keyof typeof AKTY;

/** Objaśnienia urzędowe, na których opiera się sposób liczenia (nie przepis, ale źródło metody). */
export const OBJASNIENIA = {
  zpeDodatekNocny: {
    nazwa: 'Zintegrowana Platforma Edukacyjna (gov.pl), „Składniki wynagrodzenia”',
    opis: 'sposób liczenia dodatku: minimalne wynagrodzenie dzielone przez liczbę godzin do przepracowania w danym miesiącu',
    adres: 'https://zpe.gov.pl/a/skladniki-wynagrodzenia/DDuaud0YF',
    sprawdzono: '2026-11-11',
  },
  biznesWynagrodzenie: {
    nazwa: 'biznes.gov.pl, „Jak ustalić wynagrodzenie za pracę”',
    opis: 'Kodeks pracy określa minimalną wysokość dodatku, pracodawca może ustalić wyższą; konkretne 8 godzin pory nocnej wybiera pracodawca',
    adres: 'https://www.biznes.gov.pl/pl/portal/00132',
    sprawdzono: '2026-11-11',
  },
  udtPrzedluzanie: {
    nazwa: 'Urząd Dozoru Technicznego, „Przedłużanie okresu ważności zaświadczeń kwalifikacyjnych” i FAQ',
    opis: 'zaświadczenia bez daty ważności (postępowania wszczęte przed 1 czerwca 2019 r.) straciły ważność 1 stycznia 2024 r.; wniosek po terminie nie przedłuża zaświadczenia',
    adres: 'https://www.udt.gov.pl/uslugi-udt/dozor-techniczny/kwalifikacje-osob/przedluzanie-okresu-waznosci-zaswiadczen-kwalifikacyjnych',
    sprawdzono: '2026-11-11',
  },
  biznesCzasPracy: {
    nazwa: 'biznes.gov.pl, „Jak ustalać i rozliczać czas pracy”',
    opis: 'wymiar przy niepełnym etacie liczy się jak dla pełnego i obniża proporcjonalnie do etatu; przykład: sierpień 2026 r. = 160 godzin',
    adres: 'https://www.biznes.gov.pl/pl/portal/00133',
    sprawdzono: '2026-11-11',
  },
  govUstanie: {
    nazwa: 'gov.pl (Ministerstwo Rodziny, Pracy i Polityki Społecznej), „Ustanie stosunku pracy”',
    opis: 'przykład: wypowiedzenie złożone 22 lipca, okres miesięczny kończy się 31 sierpnia, trzymiesięczny 31 października',
    adres: 'https://www.gov.pl/web/rodzina/ustanie-stosunku-pracy',
    sprawdzono: '2026-11-11',
  },
} as const;

/** Przeciętne wynagrodzenie z komunikatu GUS (art. 20 pkt 1 lit. a ustawy o emeryturach i rentach z FUS): podstawa opłaty za egzamin UDT. */
export const PRZECIETNE_WYNAGRODZENIE = { zaRok: 2025, kwota: 8903.56, ogloszono: '2026-02-10', akt: 'przecietneWynagrodzenie2025' as KluczAktu };

export interface PlacaMinimalna {
  /** Minimalne wynagrodzenie za pracę w pełnym wymiarze, zł brutto miesięcznie. */
  miesiecznie: number;
  /** Minimalna stawka godzinowa dla umów cywilnoprawnych, zł brutto. */
  stawkaGodzinowa: number;
  akt: KluczAktu;
}

/** Minimalne wynagrodzenie według roku (§ 1 i § 2 rozporządzeń Rady Ministrów, obowiązują od 1 stycznia). */
export const PLACA_MINIMALNA: Record<number, PlacaMinimalna> = {
  2025: { miesiecznie: 4666, stawkaGodzinowa: 30.5, akt: 'placa2025' },
  2026: { miesiecznie: 4806, stawkaGodzinowa: 31.4, akt: 'placa2026' },
  2027: { miesiecznie: 4950, stawkaGodzinowa: 32.3, akt: 'placa2027' },
};

/** Lata, dla których narzędzia mają komplet danych (płaca minimalna i kalendarz świąt z Wigilią). */
export const LATA = Object.keys(PLACA_MINIMALNA).map(Number).sort((a, b) => a - b);
