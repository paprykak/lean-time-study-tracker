// Rejestr narzędzi Rytmu Hali (DECYZJE.md, 2026-11-11: profil „narzędzia i przepisy dla ludzi z hali”).
// Jedno źródło prawdy dla strony głównej, /narzedzia, menu, llms.txt i testów. Nowe narzędzie: wpis tutaj,
// strona src/pages/narzedzia/<slug>.astro (StronaNarzedzia), logika w src/lib/narzedzia/<slug>.ts z testami,
// adres w tests/e2e/strony.ts i lighthouserc.cjs. Test src/lib/narzedzia/rejestr.test.ts pilnuje spójności.
// Granica z GembaHQ: tu prawo i ludzie na hali (czy wolno, czy muszę, ile się należy, jak zdać), a wydajność
// i doskonalenie (OEE, SMED, chronometraż) to GembaHQ.
import type { KluczAktu } from './prawo';

export const KATEGORIE = {
  'czas-pracy': { nazwa: 'Czas pracy i wynagrodzenie', krotko: 'Czas pracy' },
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
    kategoria: 'czas-pracy',
    przepisy: ['kodeksPracy', 'wynagrodzenieRozp', 'dniWolne', 'minimalneWynagrodzenie', 'placa2025', 'placa2026', 'placa2027'],
    sprawdzono: '2026-11-11',
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
    kategoria: 'czas-pracy',
    przepisy: ['kodeksPracy', 'wynagrodzenieRozp', 'dniWolne'],
    sprawdzono: '2026-11-11',
  },
  {
    slug: 'kalkulator-urlopu',
    nazwa: 'Kalkulator urlopu wypoczynkowego',
    krotko: 'Ile dni urlopu: 20 czy 26, ze szkołą i stażem z umów zlecenia od 2026 r., na niepełny etat i część roku.',
    kategoria: 'czas-pracy',
    przepisy: ['kodeksPracy', 'zmianaStazu2025'],
    sprawdzono: '2026-11-11',
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
    slug: 'okres-wypowiedzenia',
    nazwa: 'Okres wypowiedzenia',
    krotko: 'Ile trwa wypowiedzenie i który dzień jest ostatnim dniem umowy: 2 tygodnie, miesiąc albo 3 miesiące.',
    kategoria: 'czas-pracy',
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

export const adresNarzedzia = (slug: string) => `/narzedzia/${slug}`;

export function narzedzie(slug: string): Narzedzie {
  const n = NARZEDZIA.find((x) => x.slug === slug);
  if (!n) throw new Error(`Brak narzędzia „${slug}” w src/data/narzedzia.ts`);
  return n;
}
