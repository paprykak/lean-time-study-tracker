import { expect, test, type BrowserContext } from '@playwright/test';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { parse, stringify } from 'yaml';
import { Ajv2020 } from 'ajv/dist/2020.js';
import { frontmatter } from '../../src/lib/mapa.mjs';

// Panel redakcji (Sveltia CMS) z prawdziwą konfiguracją public/admin/config.yml. Skrypt panelu z node_modules
// (ta sama wersja i plik co na unpkg.com, suma SRI sprawdzana w src/lib/panel.test.ts), bez sieci.
// Logowania do GitHuba nie da się sprawdzić automatycznie, więc druga część używa wbudowanego testowego repozytorium
// Sveltia (w pamięci przeglądarki) wypełnionego plikami z tego repozytorium: próba z F2 „od szkicu do zapisu”.
const REPO = process.cwd();
const TYPY: Record<string, string> = { '.js': 'text/javascript', '.json': 'application/json', '.md': 'text/markdown', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml' };
const plik = (sciezka: string) => ({ status: 200, contentType: TYPY[extname(sciezka)] ?? 'application/octet-stream', body: readFileSync(sciezka) });
const ZASIEW = [
  ...['artykuly', 'zdjecia', 'dzialy', 'tematy', 'autorzy'].flatMap((k) => readdirSync(join(REPO, 'src/content', k)).map((f) => `src/content/${k}/${f}`)),
  ...readdirSync(join(REPO, 'src/assets/zdjecia')).map((f) => `src/assets/zdjecia/${f}`),
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
      } else if (p.endsWith(szukany)) return (await uchwyt.getFile()).text();
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

  test('próba F2: nowy wpis testowy od szkicu do zapisu, plik zgodny ze schematem treści', async ({ page, context }) => {
    test.setTimeout(120_000);
    await przygotuj(context, 'testowe');
    await page.goto('/admin/');
    await page.getByRole('button', { name: /demo|test/i }).first().click({ timeout: 30_000 });
    await expect(page.getByText('Artykuły').first()).toBeVisible({ timeout: 30_000 });
    // Tryb testowy wita oknem „Welcome to Sveltia CMS Demo”; zamykamy je jak redaktor (Esc).
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toBeHidden();

    // Zasiane wpisy z repozytorium otwierają się z rozwiązanymi relacjami (dział, autor, zdjęcie z rejestru).
    await page.goto('/admin/#/collections/artykuly/entries/testowy-przezbrojenie-smed');
    await expect(page.getByRole('radio', { name: 'Produkcja' })).toBeChecked({ timeout: 30_000 });
    await expect(page.getByRole('checkbox', { name: 'Patryk Korpyta' })).toBeChecked();
    await expect(page.getByRole('combobox', { name: 'Zdjęcie główne' })).toContainText('Robot spawalniczy');

    const start = Date.now();
    await page.goto('/admin/#/collections/artykuly/new');
    await page.getByRole('textbox', { name: 'Tytuł', exact: true }).fill('[TEST] Próba panelu: od szkicu do podglądu');
    await page.getByRole('textbox', { name: 'Lead', exact: true }).fill('Wpis testowy (fikcyjny) z próby panelu redakcyjnego. Sprawdza, czy tekst zapisany w panelu ma poprawny format.');
    await page.getByRole('radio', { name: 'Lean i ciągłe doskonalenie' }).click();
    const zdjecie = page.getByRole('combobox', { name: 'Zdjęcie główne' });
    await zdjecie.focus();
    await page.keyboard.press('ArrowDown');
    await page.locator('[role=option]', { hasText: /karteczek/i }).first().click();
    for (let i = 0; i < 12; i++) {
      await page.mouse.move(300, 600);
      await page.mouse.wheel(0, 1200);
    }
    const tresc = page.locator('[contenteditable=true]').last();
    await tresc.click();
    for (const akapit of ['Pierwszy akapit.', 'Drugi akapit.', 'Trzeci akapit.', 'Czwarty akapit.']) {
      await page.keyboard.type(akapit);
      await page.keyboard.press('Enter');
    }
    await page.getByRole('switch', { name: 'Szkic (nie publikuj na produkcji)' }).click();
    await page.getByRole('switch', { name: 'Wpis testowy (fikcyjny)' }).click();
    await page.getByRole('button', { name: 'Zapisz', exact: true }).click();

    // Testowe repozytorium Sveltia trzyma pliki w OPFS przeglądarki pod tymi samymi ścieżkami co w repozytorium.
    const nazwa = 'src/content/artykuly/test-proba-panelu-od-szkicu-do-podgladu.md';
    const czytaj = () => page.evaluate(czytajZPamieci, nazwa);
    await expect.poll(czytaj, { timeout: 15_000 }).toMatch(/^---\n/);
    const tekst = (await czytaj())!;
    expect(Date.now() - start, 'od nowego wpisu do zapisu').toBeLessThan(10 * 60_000);

    // Zapisany plik spełnia schemat kolekcji (ten sam, który sprawdza build), a puste pola opcjonalne są pominięte.
    const dane = frontmatter(tekst);
    expect(dane).toMatchObject({ dzial: 'lean-i-ciagle-doskonalenie', format: 'Poradnik', autorzy: ['patryk-korpyta'], zdjecie: 'sciana-karteczek', szkic: true, testowy: true });
    expect(dane.opublikowano).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(Object.keys(dane)).not.toContain('tytulSeo');
    const schemat = JSON.parse(readFileSync(join(REPO, '.astro/collections/artykuly.schema.json'), 'utf8'));
    const sprawdz = new Ajv2020({ strict: false, validateFormats: false }).compile(schemat);
    expect(sprawdz(dane), JSON.stringify(sprawdz.errors)).toBe(true);
    expect(tekst).toContain('Pierwszy akapit.\n\nDrugi akapit.');
  });
});
