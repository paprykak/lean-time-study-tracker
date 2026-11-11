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
    przepisy: ['kodeksPracy', 'dniWolne', 'minimalneWynagrodzenie', 'placa2025', 'placa2026', 'placa2027'],
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
];

/** Następne narzędzia w kolejce (bez stron i linków; lista na /narzedzia). Zdejmujesz pozycję, gdy narzędzie rusza. */
export const W_PRZYGOTOWANIU: { nazwa: string; kategoria: KategoriaNarzedzia }[] = [
  { nazwa: 'Ważność uprawnień UDT i termin wniosku o przedłużenie', kategoria: 'uprawnienia' },
  { nazwa: 'Ile kg wolno dźwigać w pracy', kategoria: 'transport' },
  { nazwa: 'Testy UDT na wózki widłowe', kategoria: 'uprawnienia' },
  { nazwa: 'Grafik 12-godzinny z kontrolą przepisów', kategoria: 'czas-pracy' },
  { nazwa: 'Temperatura w pracy: kiedy pracodawca musi działać', kategoria: 'bhp' },
];

export const adresNarzedzia = (slug: string) => `/narzedzia/${slug}`;

export function narzedzie(slug: string): Narzedzie {
  const n = NARZEDZIA.find((x) => x.slug === slug);
  if (!n) throw new Error(`Brak narzędzia „${slug}” w src/data/narzedzia.ts`);
  return n;
}
