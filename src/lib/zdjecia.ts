// Zdjęcia serwisu z rejestru licencji (marka/zdjecia/rejestr.json). Plik w src/assets/zdjecia/<slug>.jpg
// pobiera `npm run zdjecia`. Gdy pliku jeszcze nie ma, funkcja zwraca undefined, a karta pokazuje pole zastępcze
// (dozwolone tylko na /styleguide; kontrola SEO blokuje je na pozostałych stronach).
import type { ImageMetadata } from 'astro';
import rejestr from '../../marka/zdjecia/rejestr.json';
import type { Zdjecie } from './typy';

const pliki = import.meta.glob<ImageMetadata>('../assets/zdjecia/*.jpg', { eager: true, import: 'default' });

export interface WpisRejestru {
  slug: string;
  zrodlo: string;
  autor: string;
  licencja: string;
  licencjaUrl: string;
  fot: string;
  alt: string;
  pozycja?: string;
}

export const WPISY: WpisRejestru[] = rejestr.zdjecia;

export function zdjecie(slug: string, podpis?: string): Zdjecie | undefined {
  const wpis = WPISY.find((w) => w.slug === slug);
  if (!wpis) throw new Error(`Zdjęcie „${slug}” nie ma wpisu w marka/zdjecia/rejestr.json`);
  const src = pliki[`../assets/zdjecia/${slug}.jpg`];
  if (!src) return undefined;
  return { src, alt: wpis.alt, fot: wpis.fot, podpis, zrodlo: wpis.zrodlo, licencjaUrl: wpis.licencjaUrl, pozycja: wpis.pozycja };
}

/** Wpisy rejestru dla zdjęć, których pliki są w serwisie (np. do listy źródeł i licencji). */
export const dostepne = () => WPISY.filter((w) => pliki[`../assets/zdjecia/${w.slug}.jpg`]);
