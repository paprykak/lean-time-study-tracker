import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import worker from './index.js';
import { ADRESY, usuniety, wzorce } from './usuniete.js';

const ENV = { ASSETS: { fetch: vi.fn(async (r) => new Response(new URL(r.url).pathname === '/410' ? '<h1>Tej strony już nie ma</h1>' : 'plik', { headers: { 'Content-Type': 'text/html' } })) } };
const zadanie = (sciezka, metoda = 'GET') => new Request(`https://rytmhali.pl${sciezka}`, { method: metoda });

describe('usunięte adresy (410 i 301)', () => {
  it('wrangler.jsonc uruchamia worker dla każdego usuniętego adresu (run_worker_first)', () => {
    // JSONC: usuwamy komentarze całych linii, reszta to zwykły JSON.
    const konfiguracja = JSON.parse(readFileSync(new URL('../wrangler.jsonc', import.meta.url), 'utf8').replace(/^\s*\/\/.*$/gm, ''));
    expect(konfiguracja.assets.run_worker_first).toEqual(['/api/*', ...wzorce()]);
  });

  it('artykuł bez pasującego narzędzia: 410 z treścią strony /410 i noindex', async () => {
    const odp = await worker.fetch(zadanie('/oee-85-procent'), ENV);
    expect(odp.status).toBe(410);
    expect(odp.headers.get('X-Robots-Tag')).toBe('noindex');
    expect(await odp.text()).toContain('Tej strony już nie ma');
  });

  it('grafik zmian: 301 na narzędzie kontroli grafiku, z zachowaniem zapytania', async () => {
    const odp = await worker.fetch(zadanie('/grafik-zmian-wypadki?utm_source=x'), ENV);
    expect(odp.status).toBe(301);
    expect(odp.headers.get('Location')).toBe('https://rytmhali.pl/narzedzia/kontrola-grafiku?utm_source=x');
  });

  it('gałęzie działów, tematów, autorów, materiałów, plików i okładek: 410; HEAD bez treści', async () => {
    for (const s of ['/dzial/produkcja', '/dzial/produkcja/2', '/dzial/produkcja/rss.xml', '/temat/oee', '/autor/patryk-korpyta', '/do-pobrania', '/do-pobrania/karta-definicji-oee', '/pobierz/test-prognozy.xlsx', '/okladki/oee-85-procent.jpg', '/rss.xml']) {
      expect(usuniety(s), s).toBe(410);
    }
    const odp = await worker.fetch(zadanie('/temat/oee', 'HEAD'), ENV);
    expect(odp.status).toBe(410);
    expect(await odp.text()).toBe('');
  });

  it('końcowy ukośnik i .html nie omijają listy; narzędzia i strony stałe zostają', () => {
    expect(usuniety('/oee-85-procent/')).toBe(410);
    expect(usuniety('/oee-85-procent.html')).toBe(410);
    for (const s of ['/', '/narzedzia', '/narzedzia/kontrola-grafiku', '/o-nas', '/dzialalnosc', '/temat', '/szukaj']) expect(usuniety(s), s).toBeNull();
  });

  it('przekierowania prowadzą tylko do narzędzi z rejestru', () => {
    const rejestr = readFileSync(new URL('../src/data/narzedzia.ts', import.meta.url), 'utf8');
    for (const d of Object.values(ADRESY)) {
      if (d === 410) continue;
      const slug = d[301].replace('/narzedzia/', '');
      expect(rejestr).toContain(`slug: '${slug}'`);
    }
  });
});
