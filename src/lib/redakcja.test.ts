import { describe, expect, it } from 'vitest';
import { readdirSync } from 'node:fs';
import { czasCzytania, liczSlowa, powiazane, widoczny, type ArtykulRelacji, tytulStrony, opisStrony, odmiana, ukladGlownej } from './redakcja';
import { SLUG, ZAREZERWOWANE } from './model';

describe('czas czytania', () => {
  it('liczy słowa bez składni Markdowna, adresów i kodu', () => {
    expect(liczSlowa('## Śródtytuł\n\nTo jest [link do tekstu](https://example.com/a-b-c) i **pogrubienie**.')).toBe(8);
    expect(liczSlowa('Tekst ```\nkod kod kod\n``` dalej')).toBe(2);
    expect(liczSlowa('Zażółć gęślą jaźń, co-working i 5S.')).toBe(6);
  });

  it('zaokrągla w górę, co najmniej 1 minuta', () => {
    expect(czasCzytania('słowo')).toBe(1);
    expect(czasCzytania(Array(401).fill('słowo').join(' '))).toBe(3);
  });
});

describe('widoczność wpisów', () => {
  it('produkcja bez szkiców i testowych, podgląd wszystko', () => {
    expect(widoczny({}, false)).toBe(true);
    expect(widoczny({ szkic: true }, false)).toBe(false);
    expect(widoczny({ testowy: true }, false)).toBe(false);
    expect(widoczny({ szkic: true, testowy: true }, true)).toBe(true);
  });
});

describe('powiązane artykuły (linki w obie strony)', () => {
  const d = (s: string) => new Date(s);
  const A: ArtykulRelacji[] = [
    { id: 'a', dzial: 'produkcja', tematy: ['smed', 'oee'], powiazane: ['d'], opublikowano: d('2026-10-01') },
    { id: 'b', dzial: 'produkcja', tematy: ['oee'], powiazane: [], opublikowano: d('2026-10-05') },
    { id: 'c', dzial: 'magazyn', tematy: ['smed', 'oee'], powiazane: [], opublikowano: d('2026-09-01') },
    { id: 'd', dzial: 'lean', tematy: [], powiazane: [], opublikowano: d('2026-08-01') },
    { id: 'e', dzial: 'magazyn', tematy: [], powiazane: ['a'], opublikowano: d('2026-10-10') },
    { id: 'f', dzial: 'produkcja', tematy: [], powiazane: [], opublikowano: d('2026-10-20') },
  ];
  const art = (id: string) => A.find((a) => a.id === id)!;

  it('kolejność: wskazane ręcznie, wskazujące ten artykuł, wspólne tematy, ten sam dział', () => {
    expect(powiazane(art('a'), A, 5)).toEqual(['d', 'e', 'c', 'b', 'f']);
  });

  it('link działa w obie strony: d nie wskazuje a, ale a wskazuje d', () => {
    expect(powiazane(art('d'), A, 1)).toEqual(['a']);
  });

  it('bez samego artykułu, bez powtórzeń, bez nieistniejących (np. szkiców poza listą)', () => {
    const wynik = powiazane({ ...art('a'), powiazane: ['a', 'nie-ma', 'd', 'd'] }, A, 10);
    expect(wynik).not.toContain('a');
    expect(wynik).not.toContain('nie-ma');
    expect(new Set(wynik).size).toBe(wynik.length);
  });
});

describe('adresy artykułów', () => {
  it('pliki artykułów mają poprawne slugi i nie zajmują adresów tras serwisu', () => {
    const pliki = readdirSync(new URL('../content/artykuly/', import.meta.url)).filter((f) => f.endsWith('.md'));
    for (const f of pliki) {
      const slug = f.replace(/\.md$/, '');
      expect(slug).toMatch(SLUG);
      expect(ZAREZERWOWANE as readonly string[]).not.toContain(slug);
    }
  });
});

describe('tytuł i opis strony artykułu', () => {
  it('tytuł z nazwą serwisu, gdy mieści się w 60 znakach; tytuł SEO ma pierwszeństwo', () => {
    expect(tytulStrony({ tytul: 'SMED krok po kroku' })).toBe('SMED krok po kroku | Rytm Hali');
    const dlugi = 'Przezbrojenie krótsze o połowę bez nowych maszyn: SMED krok po kroku';
    expect(tytulStrony({ tytul: dlugi })).toBe(dlugi);
    expect(tytulStrony({ tytul: dlugi, tytulSeo: 'SMED: przezbrojenie krótsze o połowę' })).toBe('SMED: przezbrojenie krótsze o połowę | Rytm Hali');
  });

  it('opis to opis SEO albo lead skrócony na granicy słowa do 155 znaków', () => {
    expect(opisStrony({ lead: 'Krótki lead.', opisSeo: 'Opis SEO.' })).toBe('Opis SEO.');
    expect(opisStrony({ lead: 'Krótki lead.' })).toBe('Krótki lead.');
    const lead = 'Większość czasu przezbrojenia to czynności, które można zrobić, zanim maszyna stanie. '.repeat(3);
    const opis = opisStrony({ lead });
    expect(opis.length).toBeLessThanOrEqual(155);
    expect(opis).toMatch(/[\p{L}]…$/u);
    expect(lead.startsWith(opis.slice(0, -1))).toBe(true);
  });
});

describe('odmiana po liczebniku', () => {
  const strony = ['strona', 'strony', 'stron'] as [string, string, string];
  it.each([
    [1, '1 strona'], [2, '2 strony'], [4, '4 strony'], [5, '5 stron'], [11, '11 stron'], [12, '12 stron'],
    [14, '14 stron'], [21, '21 stron'], [22, '22 strony'], [112, '112 stron'], [124, '124 strony'],
  ])('%i → %s', (n, oczekiwane) => expect(odmiana(n, strony)).toBe(oczekiwane));
});

describe('strona główna: dobór treści', () => {
  const DZIALY = ['produkcja', 'magazyn', 'lean', 'dane', 'ludzie'];
  const art = (id: string, dzial: string, dzien: number, wyrozniony = false) => ({ id, dzial, opublikowano: new Date(2026, 10, dzien), wyrozniony });
  const wszystkie = DZIALY.flatMap((d, i) => Array.from({ length: 5 }, (_, j) => art(`${d}-${j}`, d, 28 - j * 5 - i)));

  it('artykuł wiodący to najnowszy wyróżniony, a bez wyróżnionych najnowszy', () => {
    expect(ukladGlownej(wszystkie, DZIALY).glowny.id).toBe('produkcja-0');
    const zWyroznionym = [...wszystkie, art('starszy-wyrozniony', 'dane', 1, true)];
    expect(ukladGlownej(zWyroznionym, DZIALY).glowny.id).toBe('starszy-wyrozniony');
  });

  it('każdy tekst najwyżej raz; sekcje: 3 obok, 4 najnowsze, 2 działy z wiodącym i listą, 3 kolumny', () => {
    const u = ukladGlownej(wszystkie, DZIALY);
    const ids = [u.glowny, ...u.obok, ...u.najnowsze, ...u.sekcje.flatMap((s) => [s.wiodacy, ...s.lista]), ...u.kolumny.flatMap((k) => k.lista)].map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect([u.obok.length, u.najnowsze.length, u.sekcje.length, u.kolumny.length]).toEqual([3, 4, 2, 3]);
    expect(u.sekcje.map((s) => s.dzial)).toEqual(['produkcja', 'magazyn']);
  });

  it('mało tekstów: sekcje bez treści znikają, nic się nie powtarza', () => {
    const u = ukladGlownej([art('a', 'produkcja', 5), art('b', 'lean', 4), art('c', 'lean', 3)], DZIALY);
    expect(u.glowny.id).toBe('a');
    expect(u.obok.map((a) => a.id)).toEqual(['b', 'c']);
    expect([u.najnowsze.length, u.sekcje.length, u.kolumny.length]).toEqual([0, 0, 0]);
  });
});
