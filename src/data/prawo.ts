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
    uwaga: 'tekst jednolity; art. 111–115: terminy w dniach, miesiącach i latach, koniec w sobotę lub dzień wolny',
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
    uwaga: 'tekst jednolity ze zmianami, ostatnia Dz.U. 2026 poz. 927; § 80: prace szczególnie niebezpieczne; załącznik nr 3 (§ 19–29, 39): pomieszczenia higienicznosanitarne',
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
    uwaga: 'tekst jednolity; późniejsze zmiany nie dotyczą zaliczek od wynagrodzeń ani zwolnienia diet; art. 21 ust. 1 pkt 16 i 148, art. 22 ust. 2, art. 27, 31b, 32',
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
  pracaTymczasowa: {
    nazwa: 'Ustawa o zatrudnianiu pracowników tymczasowych',
    publikator: 'Dz.U. 2025 poz. 236',
    uwaga: 'tekst jednolity; zmiana Dz.U. 2024 poz. 1871 (od 19.03.2025) dotyczy tylko art. 21 ust. 4; art. 20, 21, 27a, 27b i 28',
    adres: eli(2025, 236),
    sprawdzono: '2026-11-12',
  },
  budzet2026: {
    nazwa: 'Ustawa budżetowa na rok 2026',
    publikator: 'Dz.U. 2026 poz. 62',
    uwaga: 'art. 24: prognozowane przeciętne wynagrodzenie 9420 zł; art. 25–27: Fundusz Pracy 1,0%, Fundusz Solidarnościowy 1,45%, FGŚP 0,10%',
    adres: eli(2026, 62),
    sprawdzono: '2026-11-12',
  },
  rynekPracy: {
    nazwa: 'Ustawa o rynku pracy i służbach zatrudnienia',
    publikator: 'Dz.U. 2025 poz. 620',
    uwaga: 'późniejsze zmiany (do Dz.U. 2026 poz. 1123) nie dotyczą art. 218–237 (zasiłek) ani art. 259–261 (składka na Fundusz Pracy)',
    adres: eli(2025, 620),
    sprawdzono: '2026-11-12',
  },
  funduszSolidarnosciowy: {
    nazwa: 'Ustawa o Funduszu Solidarnościowym',
    publikator: 'Dz.U. 2024 poz. 1848',
    uwaga: 'tekst jednolity; art. 4: składka jak na Fundusz Pracy',
    adres: eli(2024, 1848),
    sprawdzono: '2026-11-12',
  },
  roszczeniaPracownicze: {
    nazwa: 'Ustawa o ochronie roszczeń pracowniczych w razie niewypłacalności pracodawcy',
    publikator: 'Dz.U. 2026 poz. 186',
    uwaga: 'tekst jednolity, bez późniejszych zmian; art. 9a–9c i 29 (składka na FGŚP)',
    adres: eli(2026, 186),
    sprawdzono: '2026-11-12',
  },
  wypadkowa: {
    nazwa: 'Ustawa o ubezpieczeniu społecznym z tytułu wypadków przy pracy i chorób zawodowych',
    publikator: 'Dz.U. 2025 poz. 1644',
    uwaga: 'tekst jednolity; zmiana Dz.U. 2026 poz. 26 dotyczy art. 2, 15 i 16 (orzekanie); art. 11–14: jednorazowe odszkodowanie, art. 28: stopa dla płatnika do 9 ubezpieczonych',
    adres: eli(2025, 1644),
    sprawdzono: '2026-11-12',
  },
  wypadkowaStopy: {
    nazwa: 'Rozporządzenie w sprawie różnicowania stopy procentowej składki na ubezpieczenie społeczne z tytułu wypadków przy pracy i chorób zawodowych',
    publikator: 'Dz.U. 2025 poz. 1874',
    uwaga: 'tekst jednolity; § 6 ust. 2 (zaokrąglanie), załącznik: najwyższa stopa dla grup działalności 3,33%',
    adres: eli(2025, 1874),
    sprawdzono: '2026-11-12',
  },
  ppk: {
    nazwa: 'Ustawa o pracowniczych planach kapitałowych',
    publikator: 'Dz.U. 2026 poz. 192',
    uwaga: 'tekst jednolity; zmiana Dz.U. 2026 poz. 989 dotyczy art. 8; art. 26–27 (wpłaty), 31–32 (dopłaty państwa), 97, 99 i 105 (wypłata i zwrot)',
    adres: eli(2026, 192),
    sprawdzono: '2026-11-12',
  },
  swiadczeniaRodzinne: {
    nazwa: 'Ustawa o świadczeniach rodzinnych',
    publikator: 'Dz.U. 2025 poz. 1208',
    uwaga: 'tekst jednolity; art. 17c ust. 5: świadczenie rodzicielskie 1000 zł miesięcznie',
    adres: eli(2025, 1208),
    sprawdzono: '2026-11-12',
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
  odszkodowaniaWypadkowe2026: {
    nazwa: 'Obwieszczenie Ministra Rodziny, Pracy i Polityki Społecznej w sprawie wysokości kwot jednorazowych odszkodowań z tytułu wypadku przy pracy lub choroby zawodowej',
    publikator: 'M.P. 2026 poz. 292',
    uwaga: 'od 1 kwietnia 2026 r. do 31 marca 2027 r.: 1781 zł za 1% uszczerbku; poprzednio M.P. 2025 poz. 222 (1636 zł)',
    adres: 'https://eli.gov.pl/eli/MP/2026/292/ogl',
    sprawdzono: '2026-11-12',
  },
  kpc: {
    nazwa: 'Kodeks postępowania cywilnego',
    publikator: 'Dz.U. 2026 poz. 468',
    uwaga: 'tekst jednolity; art. 165 § 1–2: terminy według prawa cywilnego, nadanie w placówce operatora świadczącego pocztowe usługi powszechne',
    adres: eli(2026, 468),
    sprawdzono: '2026-11-12',
  },
  zwolnieniaOdPracy: {
    nazwa: 'Rozporządzenie w sprawie sposobu usprawiedliwiania nieobecności w pracy oraz udzielania pracownikom zwolnień od pracy',
    publikator: 'Dz.U. 2014 poz. 1632',
    uwaga: 'tekst jednolity, bez późniejszych zmian; § 15: 2 dni albo 1 dzień, § 16: wynagrodzenie albo rekompensata',
    adres: eli(2014, 1632),
    sprawdzono: '2026-11-12',
  },
  sluzbaKrwi: {
    nazwa: 'Ustawa o publicznej służbie krwi',
    publikator: 'Dz.U. 2024 poz. 1782',
    uwaga: 'tekst jednolity, bez późniejszych zmian; art. 9 ust. 1: zwolnienie w dniu oddania krwi i w dniu następnym',
    adres: eli(2024, 1782),
    sprawdzono: '2026-11-12',
  },
  podrozeSluzbowe: {
    nazwa: 'Rozporządzenie w sprawie należności przysługujących pracownikowi zatrudnionemu w państwowej lub samorządowej jednostce sfery budżetowej z tytułu podróży służbowej',
    publikator: 'Dz.U. 2023 poz. 2190',
    uwaga: 'tekst jednolity, bez późniejszych zmian; § 7: dieta krajowa 45 zł od 1 stycznia 2023 r., § 8: nocleg, § 9: komunikacja miejscowa',
    adres: eli(2023, 2190),
    sprawdzono: '2026-11-12',
  },
  kilometrowka: {
    nazwa: 'Rozporządzenie w sprawie warunków ustalania oraz sposobu dokonywania zwrotu kosztów używania do celów służbowych samochodów osobowych, motocykli i motorowerów niebędących własnością pracodawcy',
    publikator: 'Dz.U. 2002 poz. 271',
    uwaga: 'zmiany: Dz.U. 2004 poz. 2376, 2007 poz. 1462, 2011 poz. 308, 2023 poz. 5 (§ 2: stawki za 1 km od 17 stycznia 2023 r.)',
    adres: eli(2002, 271),
    sprawdzono: '2026-11-12',
  },
  podstawaSkladek: {
    nazwa: 'Rozporządzenie w sprawie szczegółowych zasad ustalania podstawy wymiaru składek na ubezpieczenia emerytalne i rentowe',
    publikator: 'Dz.U. 2025 poz. 316',
    uwaga: 'tekst jednolity, bez późniejszych zmian; § 2 ust. 1 pkt 15: diety i należności z podróży służbowej do limitów z przepisów o podróżach w sferze budżetowej',
    adres: eli(2025, 316),
    sprawdzono: '2026-11-12',
  },
  waloryzacjaRehabilitacyjnego2026: {
    nazwa: 'Obwieszczenia Prezesa ZUS w sprawie wskaźnika waloryzacji podstawy wymiaru zasiłku chorobowego przyjętej do obliczenia świadczenia rehabilitacyjnego',
    publikator: 'M.P. 2026 poz. 858',
    uwaga: 'IV kwartał 2026 r.: 100,4%; III kwartał: 109,0% (M.P. 2026 poz. 495); II kwartał: 105,1% (M.P. 2026 poz. 210); I kwartał bez waloryzacji (M.P. 2025 poz. 1205)',
    adres: 'https://eli.gov.pl/eli/MP/2026/858/ogl',
    sprawdzono: '2026-11-12',
  },
  zasilekPogrzebowy2026: {
    nazwa: 'Komunikat Prezesa ZUS w sprawie kwoty zasiłku pogrzebowego',
    publikator: 'M.P. 2026 poz. 150',
    uwaga: 'od 1 marca 2026 r.: 7000 zł (art. 80 ust. 1 i 6 ustawy o emeryturach i rentach z FUS)',
    adres: 'https://eli.gov.pl/eli/MP/2026/150/ogl',
    sprawdzono: '2026-11-12',
  },
  emerytury: {
    nazwa: 'Ustawa o emeryturach i rentach z Funduszu Ubezpieczeń Społecznych',
    publikator: 'Dz.U. 2025 poz. 1749',
    uwaga: 'tekst jednolity; zmiany Dz.U. 2026 poz. 26 i 425 nie dotyczą art. 24, 67–81 i 87; art. 24 ust. 1: wiek emerytalny 60 i 65 lat; art. 80: zasiłek pogrzebowy 7000 zł od 1 stycznia 2026 r. (Dz.U. 2025 poz. 718)',
    adres: eli(2025, 1749),
    sprawdzono: '2026-11-12',
  },
  zasilekBezrobotni2026: {
    nazwa: 'Obwieszczenie Ministra Rodziny, Pracy i Polityki Społecznej w sprawie wysokości zasiłku dla bezrobotnych',
    publikator: 'M.P. 2026 poz. 268',
    uwaga: 'od 1 czerwca 2026 r.: 1783,90 zł w pierwszych 90 dniach, potem 1400,90 zł; poprzednio M.P. 2025 poz. 510',
    adres: 'https://eli.gov.pl/eli/MP/2026/268/ogl',
    sprawdzono: '2026-11-12',
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
