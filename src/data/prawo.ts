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
} as const;

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
