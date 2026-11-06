// Dostęp do treści z kolekcji z uwzględnieniem trybu budowania: na produkcji bez szkiców i wpisów testowych,
// w podglądzie gałęzi wszystko (każda strona ma tam noindex). Kolejność: od najnowszych.
import { getCollection, type CollectionEntry } from 'astro:content';
import { PODGLAD } from './srodowisko.mjs';
import { widoczny, powiazane as powiazaneIds, czasCzytania } from './redakcja';
import { autor, dzial } from './dane';
import { zdjecie } from './zdjecia';
import type { ArtykulKarta } from './typy';

export type Artykul = CollectionEntry<'artykuly'>;

export async function artykuly(): Promise<Artykul[]> {
  const wszystkie = await getCollection('artykuly', ({ data }) => widoczny(data, PODGLAD));
  return wszystkie.sort((a, b) => b.data.opublikowano.valueOf() - a.data.opublikowano.valueOf());
}

export const minutyCzytania = (a: Artykul) => czasCzytania(a.body ?? '');

/** Powiązane artykuły (linki w obie strony), tylko spośród widocznych. */
export function powiazaneArtykuly(a: Artykul, wszystkie: Artykul[], ile = 3): Artykul[] {
  const rel = (x: Artykul) => ({
    id: x.id,
    dzial: x.data.dzial.id,
    tematy: x.data.tematy.map((t) => t.id),
    powiazane: x.data.powiazane.map((p) => p.id),
    opublikowano: x.data.opublikowano,
  });
  return powiazaneIds(rel(a), wszystkie.map(rel), ile).map((id) => wszystkie.find((x) => x.id === id)!);
}

/** Wpis jest indeksowany tylko, gdy jest opublikowany, nie testowy i nie ma noindex. */
export const doIndeksu = (a: Artykul) => !a.data.noindex && !a.data.szkic && !a.data.testowy && !PODGLAD;

/** Dane karty artykułu na listach (strona główna, dział, temat, autor, „Czytaj także”). */
export function karta(a: Artykul): ArtykulKarta {
  const d = a.data;
  const dz = dzial(d.dzial.id);
  return {
    tytul: d.tytul,
    adres: `/${a.id}`,
    lead: d.lead,
    kategoria: { nazwa: dz.nazwa, adres: dz.adres },
    format: d.format,
    data: d.opublikowano,
    autor: d.autorzy.map((x) => autor(x.id).imie).join(', '),
    czasCzytania: minutyCzytania(a),
    zdjecie: zdjecie(d.zdjecie.id),
    partner: d.partner?.partner.id,
    oznaczenie: d.partner?.oznaczenie,
  };
}
