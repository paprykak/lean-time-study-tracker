import { describe, expect, it } from 'vitest';
import { buildTestowy, formularzAktywny, trybBudowania, zakres } from './srodowisko.mjs';
import { zostaje } from './przed-startem.mjs';

describe('tryby budowania', () => {
  it('main i build lokalny to produkcja, inne gałęzie w Cloudflare to podgląd', () => {
    expect(trybBudowania({})).toBe('produkcja');
    expect(trybBudowania({ WORKERS_CI_BRANCH: 'main' })).toBe('produkcja');
    expect(trybBudowania({ WORKERS_CI_BRANCH: 'cms/strony/kontakt' })).toBe('podglad');
    expect(trybBudowania({ RH_PODGLAD: '1' })).toBe('podglad');
  });

  it('przed startem produkcja nie buduje portalu ani treści testowych; podgląd buduje wszystko', () => {
    expect(zakres({ WORKERS_CI_BRANCH: 'main' }, false)).toEqual({ portal: false, wszystkieTresci: false });
    expect(zakres({ WORKERS_CI_BRANCH: 'f3' }, false)).toEqual({ portal: true, wszystkieTresci: true });
    expect(zakres({ RH_TESTOWE: '1' }, false)).toEqual({ portal: true, wszystkieTresci: true });
  });

  it('po starcie produkcja ma portal, ale nigdy szkiców ani treści testowych', () => {
    expect(zakres({ WORKERS_CI_BRANCH: 'main' }, true)).toEqual({ portal: true, wszystkieTresci: false });
  });

  it('build testowy nie może powstać w Cloudflare', () => {
    expect(() => buildTestowy({ RH_TESTOWE: '1', WORKERS_CI_BRANCH: 'main' })).toThrow(/tylko do testów/);
    expect(buildTestowy({ RH_TESTOWE: '1' })).toBe(true);
  });
});

describe('formularze', () => {
  const wylaczone = { newsletter: false, kontakt: false };

  it('produkcja pokazuje formularz tylko wtedy, gdy jego usługa jest skonfigurowana', () => {
    expect(formularzAktywny('newsletter', { WORKERS_CI_BRANCH: 'main' }, wylaczone)).toBe(false);
    expect(formularzAktywny('kontakt', {}, wylaczone)).toBe(false);
    expect(formularzAktywny('newsletter', { WORKERS_CI_BRANCH: 'main' }, { newsletter: true, kontakt: false })).toBe(true);
  });

  it('podgląd i build testowy pokazują formularze zawsze', () => {
    expect(formularzAktywny('newsletter', { WORKERS_CI_BRANCH: 'wdrozenie/start' }, wylaczone)).toBe(true);
    expect(formularzAktywny('kontakt', { RH_PODGLAD: '1' }, wylaczone)).toBe(true);
    expect(formularzAktywny('kontakt', { RH_TESTOWE: '1' }, wylaczone)).toBe(true);
  });
});

describe('produkcja przed startem', () => {
  it('zostaje strona „Wkrótce”, strony błędów, panel, zasoby i pliki techniczne', () => {
    for (const p of ['index.html', '404.html', '410.html', 'robots.txt', '_headers', 'sitemap-0.xml', 'admin/index.html', 'admin/config.yml', '_astro/x.css', 'marka/logo.png', 'favicon.svg']) {
      expect(zostaje(p), p).toBe(true);
    }
  });

  it('znikają strony portalu, narzędzia, projekty stron, llms.txt i indeks wyszukiwarki', () => {
    for (const p of ['narzedzia.html', 'narzedzia/kalkulator-l4.html', 'podglad/o-nas.html', 'styleguide.html', 'szukaj.html', 'llms.txt', 'pagefind/pagefind.js', 'o-nas.html']) {
      expect(zostaje(p), p).toBe(false);
    }
  });
});
