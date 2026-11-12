// Rejestr narzędzi Rytmu Hali (DECYZJE.md, 2026-11-11: profil „narzędzia i przepisy dla ludzi z hali”).
// Jedno źródło prawdy dla strony głównej, /narzedzia, menu, llms.txt i testów. Nowe narzędzie: wpis tutaj,
// strona src/pages/narzedzia/<slug>.astro (StronaNarzedzia), logika w src/lib/narzedzia/<slug>.ts z testami,
// adres w tests/e2e/strony.ts i lighthouserc.cjs. Test src/lib/narzedzia/rejestr.test.ts pilnuje spójności.
// Granica z GembaHQ: tu prawo i ludzie na hali (czy wolno, czy muszę, ile się należy, jak zdać), a wydajność
// i doskonalenie (OEE, SMED, chronometraż) to GembaHQ.
import type { KluczAktu } from './prawo';

export const KATEGORIE = {
  'czas-pracy': { nazwa: 'Czas pracy i grafik', krotko: 'Czas pracy' },
  wynagrodzenie: { nazwa: 'Wynagrodzenie i zasiłki', krotko: 'Wynagrodzenie' },
  urlopy: { nazwa: 'Urlopy i dni wolne', krotko: 'Urlopy' },
  umowa: { nazwa: 'Umowa i jej koniec', krotko: 'Umowa' },
  bhp: { nazwa: 'BHP i badania', krotko: 'BHP' },
  uprawnienia: { nazwa: 'Uprawnienia UDT i SEP', krotko: 'Uprawnienia' },
  transport: { nazwa: 'Transport ręczny i magazyn', krotko: 'Magazyn' },
} as const;

export type KategoriaNarzedzia = keyof typeof KATEGORIE;

export interface Narzedzie {
  slug: string;
  /** Nazwa na kartach i w menu: krótka, z frazą, której szuka człowiek z hali. */
  nazwa: string;
  /** Jedno zdanie na kartę (do ok. 110 znaków): co policzy albo sprawdzi. */
  krotko: string;
  kategoria: KategoriaNarzedzia;
  /** Przepisy, na których liczy (klucze z src/data/prawo.ts). */
  przepisy: KluczAktu[];
  /** Data ostatniego sprawdzenia narzędzia z przepisami (RRRR-MM-DD). */
  sprawdzono: string;
}

export const NARZEDZIA: Narzedzie[] = [
  {
    slug: 'dodatek-za-prace-w-nocy',
    nazwa: 'Dodatek za pracę w nocy',
    krotko: 'Ile wynosi dodatek nocny w danym miesiącu: z płacy minimalnej, wymiaru godzin i Twojego grafiku.',
    kategoria: 'wynagrodzenie',
    przepisy: ['kodeksPracy', 'wynagrodzenieRozp', 'dniWolne', 'minimalneWynagrodzenie', 'placa2025', 'placa2026', 'placa2027'],
    sprawdzono: '2026-11-11',
  },
  {
    slug: 'odszkodowanie-za-wypadek-przy-pracy',
    nazwa: 'Odszkodowanie za wypadek przy pracy',
    krotko: 'Ile ZUS płaci za każdy procent uszczerbku na zdrowiu po wypadku przy pracy, zwiększenie i dodatek.',
    kategoria: 'bhp',
    przepisy: ['wypadkowa', 'odszkodowaniaWypadkowe2026', 'pit'],
    sprawdzono: '2026-11-12',
  },
  {
    slug: 'szkolenie-okresowe-bhp',
    nazwa: 'Termin szkolenia okresowego BHP',
    krotko: 'Co ile szkolenie okresowe na Twoim stanowisku i do kiedy masz je zrobić. Z przypomnieniem w kalendarzu.',
    kategoria: 'bhp',
    przepisy: ['szkoleniaBhp', 'kodeksPracy', 'ogolneBhp', 'kodeksCywilny'],
    sprawdzono: '2026-11-11',
  },
  {
    slug: 'waznosc-uprawnien-udt',
    nazwa: 'Ważność uprawnień UDT',
    krotko: 'Do kiedy ważne jest zaświadczenie UDT i do kiedy złożyć wniosek o przedłużenie. Wózki, suwnice, podesty.',
    kategoria: 'uprawnienia',
    przepisy: ['dozorTechniczny', 'kwalifikacjeUdt', 'zmianaUdt2018', 'przecietneWynagrodzenie2025', 'kodeksPracy', 'kodeksCywilny'],
    sprawdzono: '2026-11-11',
  },
  {
    slug: 'badania-udt',
    nazwa: 'Badania UDT i przeglądy konserwacyjne',
    krotko: 'Kiedy następne badanie UDT i przegląd konserwacyjny wózka widłowego, suwnicy, podestu. Z kalendarzem.',
    kategoria: 'transport',
    przepisy: ['warunkiUtb', 'dozorTechniczny', 'kodeksCywilny'],
    sprawdzono: '2026-11-11',
  },
  {
    slug: 'normy-sanitarne',
    nazwa: 'Toalety, umywalki, natryski: normy',
    krotko: 'Ile misek ustępowych, pisuarów, umywalek i natrysków na zmianę według przepisów BHP. Jadalnia od 21 osób.',
    kategoria: 'bhp',
    przepisy: ['ogolneBhp'],
    sprawdzono: '2026-11-12',
  },
  {
    slug: 'ile-kg-wolno-dzwigac',
    nazwa: 'Ile kg wolno dźwigać',
    krotko: 'Ile kilogramów wolno podnosić i przenosić w pracy: kobiety, mężczyźni, ciąża, młodociani. Z mapą regału.',
    kategoria: 'transport',
    przepisy: ['recznePrace', 'praceKobietCiaza', 'praceMlodocianych', 'kodeksPracy'],
    sprawdzono: '2026-11-11',
  },
  {
    slug: 'temperatura-w-pracy',
    nazwa: 'Temperatura w pracy',
    krotko: 'Za zimno albo za gorąco? Co musi zrobić pracodawca: minimum 14 i 18°C, napoje, nowe progi upału od 2027 r.',
    kategoria: 'bhp',
    przepisy: ['ogolneBhp', 'temperatura2026', 'napoje', 'kodeksPracy'],
    sprawdzono: '2026-11-11',
  },
  {
    slug: 'wymiar-czasu-pracy',
    nazwa: 'Wymiar czasu pracy',
    krotko: 'Ile godzin i dni do przepracowania w miesiącu, kwartale albo roku. Na pełny i niepełny etat, ze świętami.',
    kategoria: 'czas-pracy',
    przepisy: ['kodeksPracy', 'dniWolne'],
    sprawdzono: '2026-11-11',
  },
  {
    slug: 'kalkulator-nadgodzin',
    nazwa: 'Kalkulator nadgodzin',
    krotko: 'Dodatek za nadgodziny 50% i 100% przy stawce godzinowej albo pensji. Z czasem wolnym zamiast dodatku.',
    kategoria: 'wynagrodzenie',
    przepisy: ['kodeksPracy', 'wynagrodzenieRozp', 'dniWolne'],
    sprawdzono: '2026-11-11',
  },
  {
    slug: 'dni-wolne-od-pracy',
    nazwa: 'Dni wolne od pracy i długie weekendy',
    krotko: 'Święta w wybranym roku, długie weekendy i kiedy wziąć urlop, żeby mieć najwięcej wolnego. Plik do kalendarza.',
    kategoria: 'urlopy',
    przepisy: ['dniWolne', 'kodeksPracy'],
    sprawdzono: '2026-11-12',
  },
  {
    slug: 'kalkulator-urlopu',
    nazwa: 'Kalkulator urlopu wypoczynkowego',
    krotko: 'Ile dni urlopu: 20 czy 26, ze szkołą i stażem z umów zlecenia od 2026 r., na niepełny etat i część roku.',
    kategoria: 'urlopy',
    przepisy: ['kodeksPracy', 'zmianaStazu2025'],
    sprawdzono: '2026-11-11',
  },
  {
    slug: 'ekwiwalent-za-urlop',
    nazwa: 'Ekwiwalent za niewykorzystany urlop',
    krotko: 'Ile wynosi ekwiwalent za urlop przy odejściu z pracy. Współczynnik na 2026 i 2027 r., premie, niepełny etat.',
    kategoria: 'urlopy',
    przepisy: ['kodeksPracy', 'urlopowe', 'dniWolne'],
    sprawdzono: '2026-11-11',
  },
  {
    slug: 'kalkulator-l4',
    nazwa: 'Kalkulator L4: chorobowe i zasiłek',
    krotko: 'Ile dostaniesz na zwolnieniu lekarskim: 80% albo 100%, 33 albo 14 dni od pracodawcy, potem zasiłek z ZUS.',
    kategoria: 'wynagrodzenie',
    przepisy: ['kodeksPracy', 'zasilkowa', 'systemUbezpieczen', 'zmianaZasilkowa2021', 'minimalneWynagrodzenie', 'placa2025', 'placa2026', 'placa2027'],
    sprawdzono: '2026-11-11',
  },
  {
    slug: 'kalkulator-odprawy',
    nazwa: 'Kalkulator odprawy',
    krotko: 'Odprawa przy zwolnieniu z przyczyn pracodawcy (1, 2 albo 3 pensje, z limitem) i odprawa emerytalna.',
    kategoria: 'umowa',
    przepisy: ['zwolnieniaGrupowe', 'kodeksPracy', 'wynagrodzenieRozp', 'urlopowe', 'minimalneWynagrodzenie', 'placa2025', 'placa2026', 'placa2027'],
    sprawdzono: '2026-11-11',
  },
  {
    slug: 'wolne-na-dziecko',
    nazwa: 'Wolne na dziecko i siła wyższa',
    krotko: '2 dni albo 16 godzin na dziecko do 14 lat i na pilne sprawy rodzinne, przy niepełnym etacie proporcjonalnie.',
    kategoria: 'urlopy',
    przepisy: ['kodeksPracy', 'wynagrodzenieRozp'],
    sprawdzono: '2026-11-11',
  },
  {
    slug: 'placa-minimalna',
    nazwa: 'Płaca minimalna: sprawdź pasek',
    krotko: 'Czy pensja nie jest niższa od płacy minimalnej: co się wlicza (bez nocy, nadgodzin, stażu), ile wyrównania.',
    kategoria: 'wynagrodzenie',
    przepisy: ['minimalneWynagrodzenie', 'placa2025', 'placa2026', 'placa2027'],
    sprawdzono: '2026-11-11',
  },
  {
    slug: 'brutto-netto',
    nazwa: 'Brutto na netto: umowa o pracę',
    krotko: 'Ile na rękę z pensji brutto: składki ZUS, zdrowotna i zaliczka na PIT, z PIT-2 i ulgą do 26 lat.',
    kategoria: 'wynagrodzenie',
    przepisy: ['pit', 'systemUbezpieczen', 'swiadczeniaZdrowotne', 'ordynacja'],
    sprawdzono: '2026-11-11',
  },
  {
    slug: 'umowa-na-czas-okreslony',
    nazwa: 'Umowa na czas określony: limit',
    krotko: 'Kiedy umowa na czas określony staje się umową na stałe: 33 miesiące, 3 umowy, aneksy, przerwy, agencja.',
    kategoria: 'umowa',
    przepisy: ['kodeksPracy', 'kodeksCywilny', 'pracaTymczasowa'],
    sprawdzono: '2026-11-12',
  },
  {
    slug: 'limit-pracy-tymczasowej',
    nazwa: 'Praca przez agencję: 18 miesięcy w 36',
    krotko: 'Do kiedy możesz pracować przez agencję u jednej firmy i od kiedy wrócić: limit 18 miesięcy w 36.',
    kategoria: 'umowa',
    przepisy: ['pracaTymczasowa', 'kodeksCywilny'],
    sprawdzono: '2026-11-12',
  },
  {
    slug: 'zlecenie-netto',
    nazwa: 'Umowa zlecenie: netto',
    krotko: 'Ile netto ze zlecenia: student do 26 lat, zlecenie obok etatu albo jako jedyne źródło, chorobowe, PIT-2.',
    kategoria: 'wynagrodzenie',
    przepisy: ['pit', 'systemUbezpieczen', 'swiadczeniaZdrowotne', 'ordynacja', 'minimalneWynagrodzenie'],
    sprawdzono: '2026-11-12',
  },
  {
    slug: 'praca-w-niedziele',
    nazwa: 'Praca w niedzielę i święto',
    krotko: 'Dzień wolny za niedzielę w ciągu 6 dni, za święto w okresie rozliczeniowym, a gdy się nie da: dodatek 100%.',
    kategoria: 'czas-pracy',
    przepisy: ['kodeksPracy', 'dniWolne'],
    sprawdzono: '2026-11-12',
  },
  {
    slug: 'wynagrodzenie-za-przestoj',
    nazwa: 'Wynagrodzenie za przestój',
    krotko: 'Ile za przestój z winy pracodawcy (awaria, brak materiału): stawka z umowy albo 60%, nie mniej niż minimum.',
    kategoria: 'wynagrodzenie',
    przepisy: ['kodeksPracy', 'wynagrodzenieRozp', 'minimalneWynagrodzenie', 'placa2025', 'placa2026', 'placa2027', 'dniWolne'],
    sprawdzono: '2026-11-12',
  },
  {
    slug: 'wynagrodzenie-za-urlop',
    nazwa: 'Wynagrodzenie za urlop',
    krotko: 'Ile za urlop przy dodatku nocnym, nadgodzinach i premiach: średnia z 3 miesięcy na godzinę urlopu.',
    kategoria: 'urlopy',
    przepisy: ['kodeksPracy', 'urlopowe'],
    sprawdzono: '2026-11-12',
  },
  {
    slug: 'wyplata-z-nadgodzinami',
    nazwa: 'Wypłata z nadgodzinami i nockami',
    krotko: 'Wypłata za miesiąc z nadgodzinami 50% i 100% i dodatkiem nocnym: brutto, na rękę i ile zostaje z dodatków.',
    kategoria: 'wynagrodzenie',
    przepisy: ['kodeksPracy', 'wynagrodzenieRozp', 'dniWolne', 'placa2026', 'pit', 'systemUbezpieczen', 'swiadczeniaZdrowotne'],
    sprawdzono: '2026-11-12',
  },
  {
    slug: 'kalkulator-ppk',
    nazwa: 'Kalkulator PPK',
    krotko: 'Ile PPK zabiera z pensji na rękę, ile dokłada pracodawca i państwo i ile masz na koncie po roku.',
    kategoria: 'wynagrodzenie',
    przepisy: ['ppk', 'pit', 'systemUbezpieczen', 'swiadczeniaZdrowotne', 'placa2026'],
    sprawdzono: '2026-11-12',
  },
  {
    slug: 'koszt-pracodawcy',
    nazwa: 'Koszt pracodawcy 2026',
    krotko: 'Ile kosztuje pracownik na etacie: pensja plus składki emerytalna, rentowa, wypadkowa, FP, FS, FGŚP i PPK.',
    kategoria: 'wynagrodzenie',
    przepisy: ['systemUbezpieczen', 'budzet2026', 'rynekPracy', 'funduszSolidarnosciowy', 'roszczeniaPracownicze', 'wypadkowa', 'wypadkowaStopy', 'ppk', 'placa2026'],
    sprawdzono: '2026-11-12',
  },
  {
    slug: 'zasilek-opiekunczy',
    nazwa: 'Zasiłek opiekuńczy',
    krotko: 'Ile za opiekę nad chorym dzieckiem albo członkiem rodziny: 80% podstawy, limity 60, 30 i 14 dni w roku.',
    kategoria: 'wynagrodzenie',
    przepisy: ['zasilkowa', 'systemUbezpieczen', 'minimalneWynagrodzenie', 'placa2025', 'placa2026', 'placa2027'],
    sprawdzono: '2026-11-12',
  },
  {
    slug: 'zasilek-macierzynski',
    nazwa: 'Zasiłek macierzyński: 100/70 czy 81,5%',
    krotko: 'Ile na urlopie macierzyńskim i rodzicielskim: 100% i 70% albo 81,5% za całość, porównanie obu wariantów.',
    kategoria: 'wynagrodzenie',
    przepisy: ['zasilkowa', 'kodeksPracy', 'swiadczeniaRodzinne', 'systemUbezpieczen', 'minimalneWynagrodzenie', 'placa2025', 'placa2026', 'placa2027'],
    sprawdzono: '2026-11-12',
  },
  {
    slug: 'urlop-ojcowski',
    nazwa: 'Urlop ojcowski',
    krotko: 'Do kiedy wykorzystać 2 tygodnie urlopu ojcowskiego, kiedy złożyć wniosek i ile wyniesie zasiłek 100%.',
    kategoria: 'urlopy',
    przepisy: ['kodeksPracy', 'kodeksCywilny', 'zasilkowa', 'swiadczeniaRodzinne'],
    sprawdzono: '2026-11-12',
  },
  {
    slug: 'urlop-wychowawczy',
    nazwa: 'Urlop wychowawczy',
    krotko: 'Ile miesięcy urlopu wychowawczego zostało, do kiedy potrwa i kiedy złożyć wniosek (21 dni).',
    kategoria: 'urlopy',
    przepisy: ['kodeksPracy', 'kodeksCywilny'],
    sprawdzono: '2026-11-12',
  },
  {
    slug: 'termin-wyplaty-wynagrodzenia',
    nazwa: 'Terminy wypłaty wynagrodzenia',
    krotko: 'Kiedy wypłata w każdym miesiącu: dzień z regulaminu przesunięty z soboty, niedzieli i świąt, plik .ics.',
    kategoria: 'wynagrodzenie',
    przepisy: ['kodeksPracy', 'dniWolne'],
    sprawdzono: '2026-11-12',
  },
  {
    slug: 'stawka-godzinowa',
    nazwa: 'Ile to na godzinę: stawka z pensji',
    krotko: 'Przelicz pensję na stawkę za godzinę w każdym miesiącu: godziny do przepracowania, średnia roczna.',
    kategoria: 'wynagrodzenie',
    przepisy: ['kodeksPracy', 'wynagrodzenieRozp', 'dniWolne', 'placa2025', 'placa2026', 'placa2027'],
    sprawdzono: '2026-11-12',
  },
  {
    slug: 'kontrola-grafiku',
    nazwa: 'Kontrola grafiku zmian',
    krotko: 'Sprawdź grafik 12 h albo trzyzmianowy: odpoczynek 11 i 35 h, wolne niedziele, dni wolne, godziny a wymiar.',
    kategoria: 'czas-pracy',
    przepisy: ['kodeksPracy', 'dniWolne'],
    sprawdzono: '2026-11-11',
  },
  {
    slug: 'staz-pracy',
    nazwa: 'Kalkulator stażu pracy',
    krotko: 'Staż z umów o pracę, zleceń i działalności (od 2026 r.) bez liczenia okresów podwójnie; 20 czy 26 dni urlopu.',
    kategoria: 'umowa',
    przepisy: ['kodeksPracy', 'kodeksCywilny'],
    sprawdzono: '2026-11-12',
  },
  {
    slug: 'zasilek-dla-bezrobotnych',
    nazwa: 'Zasiłek dla bezrobotnych',
    krotko: 'Czy przysługuje Ci zasiłek, ile na rękę, od kiedy i do kiedy, także po porozumieniu stron.',
    kategoria: 'umowa',
    przepisy: ['rynekPracy', 'zasilekBezrobotni2026', 'swiadczeniaZdrowotne', 'pit', 'systemUbezpieczen'],
    sprawdzono: '2026-11-12',
  },
  {
    slug: 'ochrona-przedemerytalna',
    nazwa: 'Ochrona przedemerytalna',
    krotko: 'Od kiedy do kiedy pracodawca nie może wypowiedzieć umowy przed emeryturą; wyjątki i obniżka pensji.',
    kategoria: 'umowa',
    przepisy: ['kodeksPracy', 'zwolnieniaGrupowe', 'emerytury', 'kodeksCywilny'],
    sprawdzono: '2026-11-12',
  },
  {
    slug: 'odwolanie-do-sadu-pracy',
    nazwa: 'Odwołanie do sądu pracy: termin',
    krotko: 'Ostatni dzień na odwołanie od wypowiedzenia lub dyscyplinarki (21 dni) i sprostowanie świadectwa pracy.',
    kategoria: 'umowa',
    przepisy: ['kodeksPracy', 'kodeksCywilny', 'kpc', 'dniWolne'],
    sprawdzono: '2026-11-12',
  },
  {
    slug: 'okres-wypowiedzenia',
    nazwa: 'Okres wypowiedzenia',
    krotko: 'Ile trwa wypowiedzenie i który dzień jest ostatnim dniem umowy: 2 tygodnie, miesiąc albo 3 miesiące.',
    kategoria: 'umowa',
    przepisy: ['kodeksPracy', 'zmianaStazu2025'],
    sprawdzono: '2026-11-11',
  },
  {
    slug: 'przerwy-w-pracy',
    nazwa: 'Przerwy w pracy',
    krotko: 'Ile przerw przy zmianie 8 i 12 godzin, które są płatne, przerwy na karmienie i dla młodocianych.',
    kategoria: 'czas-pracy',
    przepisy: ['kodeksPracy'],
    sprawdzono: '2026-11-11',
  },
];

/** Następne narzędzia w kolejce (bez stron i linków; lista na /narzedzia). Zdejmujesz pozycję, gdy narzędzie rusza. */
export const W_PRZYGOTOWANIU: { nazwa: string; kategoria: KategoriaNarzedzia }[] = [
  { nazwa: 'Testy UDT na wózki widłowe', kategoria: 'uprawnienia' },
];

/** Karty na stronie głównej (wybór redakcji, dopóki nie ma statystyk); pozostałe narzędzia są tam na zwartej liście. */
export const NA_GLOWNEJ = ['brutto-netto', 'kalkulator-l4', 'dodatek-za-prace-w-nocy', 'kalkulator-nadgodzin', 'kalkulator-urlopu', 'waznosc-uprawnien-udt'] as const;

export const adresNarzedzia = (slug: string) => `/narzedzia/${slug}`;

export function narzedzie(slug: string): Narzedzie {
  const n = NARZEDZIA.find((x) => x.slug === slug);
  if (!n) throw new Error(`Brak narzędzia „${slug}” w src/data/narzedzia.ts`);
  return n;
}
