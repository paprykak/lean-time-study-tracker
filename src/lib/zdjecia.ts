// Zdjęcia serwisu z rejestru licencji: kolekcja src/content/zdjecia/<slug>.json (edycja w panelu, pole „Zdjęcia”).
// Plik obrazu w src/assets/zdjecia/ (pobiera `npm run zdjecia` albo wgrywa redakcja w panelu).
// Gdy pliku jeszcze nie ma, funkcja zwraca undefined, a karta pokazuje pole zastępcze (dozwolone tylko na /styleguide;
// kontrola SEO blokuje je na pozostałych stronach).
import type { ImageMetadata } from 'astro';
import type { Zdjecie } from './typy';

export interface WpisRejestru {
  slug: string;
  plik: string;
  zrodlo?: string;
  autor: string;
  licencja: string;
  licencjaUrl?: string;
  fot: string;
  alt: string;
  pozycja?: string;
}

const wpisy = import.meta.glob<Omit<WpisRejestru, 'slug'>>('../content/zdjecia/*.json', { eager: true, import: 'default' });
// JPEG z npm run zdjecia, WebP z panelu (konwersja przy wgrywaniu, public/admin/config.yml).
const pliki = import.meta.glob<ImageMetadata>('../assets/zdjecia/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' });

export const WPISY: WpisRejestru[] = Object.entries(wpisy).map(([sciezka, w]) => ({ slug: sciezka.split('/').at(-1)!.replace(/\.json$/, ''), ...w }));

const plikDla = (w: WpisRejestru) => pliki[`../assets/zdjecia/${w.plik.split('/').at(-1)}`];

export function zdjecie(slug: string, podpis?: string): Zdjecie | undefined {
  const wpis = WPISY.find((w) => w.slug === slug);
  if (!wpis) throw new Error(`Zdjęcie „${slug}” nie ma wpisu w rejestrze (src/content/zdjecia/${slug}.json)`);
  const src = plikDla(wpis);
  if (!src) return undefined;
  return { src, alt: wpis.alt, fot: wpis.fot, podpis, zrodlo: wpis.zrodlo, licencjaUrl: wpis.licencjaUrl, pozycja: wpis.pozycja };
}

/** Wpisy rejestru dla zdjęć, których pliki są w serwisie (np. do listy źródeł i licencji). */
export const dostepne = () => WPISY.filter((w) => plikDla(w));
