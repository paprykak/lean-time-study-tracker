import type { ImageMetadata } from 'astro';

/** Zdjęcie z rejestrem licencji (sekcja 6: źródło, autor, licencja, podpis „Fot.”). */
export interface Zdjecie {
  src: ImageMetadata;
  alt: string;
  /** Podpis pod zdjęciem, np. „Linia montażowa w zakładzie…”. */
  podpis?: string;
  /** Autor zdjęcia do podpisu „Fot.”, np. „Fot. Jan Kowalski / Wikimedia Commons, CC BY 4.0”. */
  fot: string;
  /** Strona zdjęcia u źródła i tekst licencji (link w podpisie, wymagany przy CC BY). */
  zrodlo?: string;
  licencjaUrl?: string;
  /** Punkt zaczepienia kadru (center, left, right, top, bottom). */
  pozycja?: string;
}

export interface Odnosnik {
  nazwa: string;
  adres: string;
}

/** Dane artykułu potrzebne kartom na listach (strona główna, dział, temat, autor). */
export interface ArtykulKarta {
  tytul: string;
  adres: string;
  lead?: string;
  kategoria?: Odnosnik;
  /** Format tekstu: Poradnik, Analiza, Wywiad, Raport, Wzór do pobrania, Komentarz (pole, nie dział). */
  format?: string;
  data: Date;
  autor?: string;
  czasCzytania?: number;
  zdjecie?: Zdjecie;
  /** Materiał partnera: nazwa partnera (oznaczenie „Materiał partnera” zamiast kategorii). */
  partner?: string;
}
