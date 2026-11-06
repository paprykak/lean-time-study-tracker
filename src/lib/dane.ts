// Synchroniczny dostęp do małych kolekcji danych (działy, tematy) dla komponentów i plików danych.
// Pliki są te same, które waliduje kolekcja treści (src/content.config.ts): błędny wpis zatrzymuje build.

interface DzialPlik {
  nazwa: string;
  nazwaMenu: string;
  opis: string;
  kolejnosc: number;
  tytulSeo?: string;
  opisSeo?: string;
}
interface AutorPlik {
  imie: string;
  rola: string;
}
interface TematPlik {
  nazwa: string;
  opis?: string;
  /** Dział główny tematu (slug). */
  dzial?: string;
}

const slugZPliku = (sciezka: string) => sciezka.split('/').at(-1)!.replace(/\.json$/, '');

const plikiDzialow = import.meta.glob<DzialPlik>('../content/dzialy/*.json', { eager: true, import: 'default' });
const plikiTematow = import.meta.glob<TematPlik>('../content/tematy/*.json', { eager: true, import: 'default' });
const plikiAutorow = import.meta.glob<AutorPlik>('../content/autorzy/*.json', { eager: true, import: 'default' });

export const DZIALY = Object.entries(plikiDzialow)
  .map(([sciezka, d]) => ({ slug: slugZPliku(sciezka), ...d, adres: `/dzial/${slugZPliku(sciezka)}` }))
  .sort((a, b) => a.kolejnosc - b.kolejnosc);

export const TEMATY = Object.entries(plikiTematow).map(([sciezka, t]) => ({ slug: slugZPliku(sciezka), ...t, adres: `/temat/${slugZPliku(sciezka)}` }));

export const AUTORZY = Object.entries(plikiAutorow).map(([sciezka, a]) => ({ slug: slugZPliku(sciezka), imie: a.imie, rola: a.rola, adres: `/autor/${slugZPliku(sciezka)}` }));

export const dzial = (slug: string) => {
  const d = DZIALY.find((x) => x.slug === slug);
  if (!d) throw new Error(`Nie ma działu „${slug}” (src/content/dzialy)`);
  return d;
};

export const temat = (slug: string) => {
  const t = TEMATY.find((x) => x.slug === slug);
  if (!t) throw new Error(`Nie ma tematu „${slug}” (src/content/tematy)`);
  return t;
};

export const autor = (slug: string) => {
  const a = AUTORZY.find((x) => x.slug === slug);
  if (!a) throw new Error(`Nie ma autora „${slug}” (src/content/autorzy)`);
  return a;
};
