// Część przeglądarkowa wyszukiwarki narzędzi: wczytanie indeksu (raz na stronę, dopiero przy pierwszym użyciu pola),
// podświetlenie trafionych słów i wiersz wyniku. Używają jej pole wyszukiwania (Wyszukiwarka.astro), filtr na
// /narzedzia i strona /szukaj, więc wynik wygląda wszędzie tak samo. Bez innerHTML: tekst z indeksu idzie jako tekst.
import { normalizuj, pasuje, przygotuj, slowa, szukaj, type WpisIndeksu, type Wynik } from './szukaj-narzedzi';
import { odmiana } from './redakcja';

let indeks: Promise<ReturnType<typeof przygotuj>> | undefined;

/** Indeks z /narzedzia/indeks.json (jedno pobranie na stronę). */
export function zaladujIndeks(): Promise<ReturnType<typeof przygotuj>> {
  indeks ??= fetch('/narzedzia/indeks.json')
    .then((o) => {
      if (!o.ok) throw new Error(`indeks: ${o.status}`);
      return o.json() as Promise<WpisIndeksu[]>;
    })
    .then(przygotuj)
    .catch((e) => {
      indeks = undefined;
      throw e;
    });
  return indeks;
}

export { szukaj, slowa };
export type { Wynik };

/** Tekst z podświetlonymi słowami, które pasują do zapytania (<mark>). */
export function podswietl(tekst: string, szukane: string[]): DocumentFragment {
  const f = document.createDocumentFragment();
  let ostatni = 0;
  for (const m of tekst.matchAll(/[\p{L}\p{N}]+/gu)) {
    const slowo = normalizuj(m[0]);
    if (!szukane.some((s) => pasuje(s, slowo))) continue;
    if (m.index! > ostatni) f.append(tekst.slice(ostatni, m.index));
    const mark = document.createElement('mark');
    mark.textContent = m[0];
    f.append(mark);
    ostatni = m.index! + m[0].length;
  }
  f.append(tekst.slice(ostatni));
  return f;
}

/** „1 narzędzie”, „3 narzędzia”, „12 narzędzi”. */
export const ileNarzedzi = (n: number) => odmiana(n, ['narzędzie', 'narzędzia', 'narzędzi']);

/** Wiersz wyniku: kategoria, nazwa (link), pytanie z FAQ, na które narzędzie odpowiada, albo jedno zdanie opisu. */
export function wierszWyniku(w: Wynik, szukane: string[], klasa = 'wynik'): HTMLLIElement {
  const li = document.createElement('li');
  li.className = klasa;
  const a = document.createElement('a');
  a.href = `/narzedzia/${w.wpis.s}`;
  a.className = `${klasa}-link`;
  const kategoria = document.createElement('span');
  kategoria.className = 'kategoria block';
  kategoria.textContent = w.wpis.c;
  const nazwa = document.createElement('span');
  nazwa.className = `${klasa}-nazwa`;
  nazwa.append(podswietl(w.wpis.n, szukane));
  const opis = document.createElement('span');
  opis.className = `${klasa}-opis`;
  if (w.pytanie) {
    opis.append('Odpowiada na: „', podswietl(w.pytanie, szukane), '”');
  } else {
    opis.append(podswietl(w.wpis.k, szukane));
  }
  a.append(kategoria, nazwa, opis);
  li.append(a);
  return li;
}
