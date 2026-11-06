// Formaty slotów reklamowych (sekcja F1 promptu). Wymiary w px CSS; slot rezerwuje dokładnie to miejsce,
// także gdy kreacja się nie wczyta albo kampanii nie ma (wtedy autopromocja newslettera, nigdy pusta dziura).
export const FORMATY = {
  billboard: { szerokosc: 970, wysokosc: 250, nazwa: 'Billboard' },
  baner: { szerokosc: 750, wysokosc: 200, nazwa: 'Baner' },
  prostokat: { szerokosc: 300, wysokosc: 250, nazwa: 'Prostokąt' },
  polstrona: { szerokosc: 300, wysokosc: 600, nazwa: 'Półstrona' },
  mobilny: { szerokosc: 320, wysokosc: 100, nazwa: 'Mobilny' },
  'mobilny-prostokat': { szerokosc: 300, wysokosc: 250, nazwa: 'Mobilny prostokąt' },
} as const;

export type Format = keyof typeof FORMATY;

export interface Kreacja {
  /** Adres obrazu kreacji w wymiarach formatu (albo 2× dla ekranów o dużej gęstości). */
  src: string;
  alt: string;
}

export interface Kampania {
  id: string;
  reklamodawca: string;
  link: string;
  komputer?: Kreacja;
  telefon?: Kreacja;
}

/** Link reklamy z parametrami UTM (utm_source=rytmhali, utm_medium=display, utm_campaign=<id kampanii>). */
export function linkReklamy(kampania: Pick<Kampania, 'id' | 'link'>): string {
  const url = new URL(kampania.link);
  if (!url.searchParams.has('utm_source')) url.searchParams.set('utm_source', 'rytmhali');
  if (!url.searchParams.has('utm_medium')) url.searchParams.set('utm_medium', 'display');
  if (!url.searchParams.has('utm_campaign')) url.searchParams.set('utm_campaign', kampania.id);
  return url.toString();
}
