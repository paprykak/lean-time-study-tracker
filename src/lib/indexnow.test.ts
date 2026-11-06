import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { PLIK_KLUCZA, adresyDoZgloszenia, adresyZMapy, zgloszenie } from './indexnow.mjs';
import { zostaje } from './przed-startem.mjs';

const ADRES = 'https://rytmhali.pl';

describe('IndexNow', () => {
  it('w public/ jest dokładnie jeden plik klucza, a jego treść to sam klucz', () => {
    const pliki = readdirSync(new URL('../../public/', import.meta.url)).filter((f) => PLIK_KLUCZA.test(f));
    expect(pliki).toHaveLength(1);
    expect(readFileSync(new URL(`../../public/${pliki[0]}`, import.meta.url), 'utf8')).toBe(pliki[0].replace('.txt', ''));
    expect(zostaje(pliki[0]), 'klucz zostaje w dist/ także przed startem').toBe(true);
  });

  it('ścieżki dostają adres serwisu, powtórzenia znikają, obce domeny są błędem', () => {
    expect(adresyDoZgloszenia(['/oee', 'dzial/produkcja', 'https://rytmhali.pl/oee'], ADRES)).toEqual(['https://rytmhali.pl/oee', 'https://rytmhali.pl/dzial/produkcja']);
    expect(() => adresyDoZgloszenia(['https://example.com/x'], ADRES)).toThrow(/spoza rytmhali\.pl/);
  });

  it('zgłoszenie ma host, klucz i adres pliku klucza; adresy z mapy strony', () => {
    expect(zgloszenie(['https://rytmhali.pl/oee'], 'a'.repeat(32), ADRES)).toEqual({
      host: 'rytmhali.pl',
      key: 'a'.repeat(32),
      keyLocation: `https://rytmhali.pl/${'a'.repeat(32)}.txt`,
      urlList: ['https://rytmhali.pl/oee'],
    });
    expect(() => zgloszenie([], 'k', ADRES)).toThrow(/Brak adresów/);
    expect(adresyZMapy('<urlset><url><loc>https://rytmhali.pl/</loc></url><url><loc>https://rytmhali.pl/oee</loc></url></urlset>')).toEqual(['https://rytmhali.pl/', 'https://rytmhali.pl/oee']);
  });
});
