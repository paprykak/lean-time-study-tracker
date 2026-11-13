import { expect, test, type BrowserContext } from '@playwright/test';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { parse, stringify } from 'yaml';
import { Ajv2020 } from 'ajv/dist/2020.js';
import { frontmatter } from '../../src/lib/mapa.mjs';

// Panel redakcji (Sveltia CMS) z prawdziwą konfiguracją public/admin/config.yml. Skrypt panelu z node_modules
// (ta sama wersja i plik co na unpkg.com, suma SRI sprawdzana w src/lib/panel.test.ts), bez sieci.
// Logowania do GitHuba nie da się sprawdzić automatycznie, więc druga część używa wbudowanego testowego repozytorium
// Sveltia (w pamięci przeglądarki) wypełnionego plikami z tego repozytorium: zmiana strony stałej i zapis pliku.
const REPO = process.cwd();
const TYPY: Record<string, string> = { '.js': 'text/javascript', '.json': 'application/json', '.md': 'text/markdown', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
const plik = (sciezka: string) => ({ status: 200, contentType: TYPY[extname(sciezka)] ?? 'application/octet-stream', body: readFileSync(sciezka) });
const ZASIEW = [
  ...readdirSync(join(REPO, 'src/content/strony')).map((f) => `src/content/strony/${f}`),
  'src/data/ustawienia.json',
];

async function przygotuj(context: BrowserContext, tryb: 'github' | 'testowe') {
  await context.route(/^https:\/\/(unpkg\.com|cdn\.jsdelivr\.net)\//, (route) => {
    const sciezka = new URL(route.request().url()).pathname.match(/^\/@sveltia\/cms@[^/]+\/(.+)$/)?.[1];
    const lokalny = sciezka && join(REPO, 'node_modules/@sveltia/cms', sciezka);
    return lokalny && existsSync(lokalny) ? route.fulfill(plik(lokalny)) : route.fulfill({ status: 404, body: '' });
  });
  await context.route(/\/admin\/(index\.html)?(\?.*)?$/, (route) => {
    const html = readFileSync(join(REPO, 'public/admin/index.html'), 'utf8');
    const zasiew = tryb === 'testowe' ? '<link rel="cms-seed-url" href="/zasiew/manifest.json" /></head>' : '</head>';
    return route.fulfill({ status: 200, contentType: 'text/html', body: html.replace('</head>', zasiew) });
  });
  await context.route(/\/admin\/config\.yml(\?.*)?$/, (route) => {
    const config = parse(readFileSync(join(REPO, 'public/admin/config.yml'), 'utf8'));
    if (tryb === 'testowe') Object.assign(config, { backend: { name: 'test-repo' }, publish_mode: 'simple' });
    return route.fulfill({ status: 200, contentType: 'text/yaml', body: stringify(config) });
  });
  await context.route(/\/zasiew\//, (route) => {
    const sciezka = decodeURIComponent(new URL(route.request().url()).pathname.replace(/^\/zasiew\//, ''));
    if (sciezka === 'manifest.json') return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ files: ZASIEW }) });
    return route.fulfill(plik(join(REPO, sciezka)));
  });
}

/** Wykonywane w przeglądarce: treść pliku z prywatnego systemu plików strony (OPFS) albo undefined. */
async function czytajZPamieci(szukany: string): Promise<string | undefined> {
  const szukaj = async (katalog: FileSystemDirectoryHandle, sciezka: string): Promise<string | undefined> => {
    for await (const [n, uchwyt] of katalog.entries()) {
      const p = sciezka ? `${sciezka}/${n}` : n;
      if (uchwyt.kind === 'directory') {
        const wynik = await szukaj(uchwyt, p);
        if (wynik) return wynik;
      } else if (p.endsWith(szukany)) {
        // Panel może właśnie zapisywać plik: odczyt w trakcie zapisu rzuca NotReadableError, a expect.poll
        // nie ponawia po wyjątku, więc traktujemy to jak „jeszcze nie ma” i czekamy na następną próbę.
        try {
          return await (await uchwyt.getFile()).text();
        } catch {
          return undefined;
        }
      }
    }
  };
  return szukaj(await navigator.storage.getDirectory(), '');
}

test.describe('panel redakcji', () => {
  test.skip(({ browserName, isMobile }) => browserName !== 'chromium' || isMobile, 'Panel to narzędzie redakcji na komputerze.');

  test('przyjmuje konfigurację i proponuje logowanie przez GitHub albo token', async ({ page, context }) => {
    const bledy: string[] = [];
    page.on('pageerror', (e) => bledy.push(e.message));
    await przygotuj(context, 'github');
    await page.goto('/admin/');
    await expect(page.getByRole('button', { name: /GitHub/ })).toBeVisible({ timeout: 30_000 });
    await expect(page.getByRole('button', { name: /token/i })).toBeVisible();
    await expect(page.getByText('Rytm Hali: panel redakcji').first()).toBeVisible();
    expect(bledy).toEqual([]);
  });

  test('zmiana strony stałej w panelu: zapisany plik zgodny ze schematem treści, treść nietknięta', async ({ page, context }) => {
    test.setTimeout(120_000);
    await przygotuj(context, 'testowe');
    await page.goto('/admin/');
    await page.getByRole('button', { name: /demo|test/i }).first().click({ timeout: 30_000 });
    await expect(page.getByText('Strony stałe').first()).toBeVisible({ timeout: 30_000 });
    // Tryb testowy wita oknem „Welcome to Sveltia CMS Demo”; zamykamy je jak redaktor (Esc).
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();

    const nazwa = 'src/content/strony/kontakt.md';
    const przed = frontmatter(readFileSync(join(REPO, nazwa), 'utf8'));
    await page.goto('/admin/#/collections/strony/entries/kontakt');
    const tytul = page.getByRole('textbox', { name: 'Tytuł', exact: true });
    await expect(tytul).toHaveValue(przed.tytul, { timeout: 30_000 });
    await tytul.fill('Kontakt z redakcją');
    await page.getByRole('button', { name: 'Zapisz', exact: true }).click();

    // Testowe repozytorium Sveltia trzyma pliki w OPFS przeglądarki pod tymi samymi ścieżkami co w repozytorium.
    const czytaj = () => page.evaluate(czytajZPamieci, nazwa);
    await expect.poll(czytaj, { timeout: 15_000 }).toMatch(/tytul: Kontakt z redakcją/);
    const tekst = (await czytaj())!;
    const dane = frontmatter(tekst);
    expect(dane).toMatchObject({ tytul: 'Kontakt z redakcją', opis: przed.opis });
    const schemat = JSON.parse(readFileSync(join(REPO, '.astro/collections/strony.schema.json'), 'utf8'));
    const sprawdz = new Ajv2020({ strict: false, validateFormats: false }).compile(schemat);
    expect(sprawdz(dane), JSON.stringify(sprawdz.errors)).toBe(true);
    expect(tekst).toContain('redakcja@rytmhali.pl');
  });
});
