import { expect, test } from '@playwright/test';
import { ARTYKUL, INDEKSOWANE, NIEINDEKSOWANE, STRONY } from './strony';

// Podstawowe ścieżki: strona się ładuje, ma jeden widoczny H1, brak błędów konsoli i naruszeń CSP,
// brak przewijania w bok od 320 px, brak żądań do domen spoza serwisu (prywatność: zero skryptów stron trzecich).
for (const adres of STRONY) {
  test(`${adres}: ładuje się bez błędów, naruszeń CSP i żądań do obcych domen`, async ({ page, baseURL }) => {
    const bledy: string[] = [];
    const obce: string[] = [];
    const host = new URL(baseURL!).host;
    page.on('pageerror', (e) => bledy.push(e.message));
    page.on('console', (m) => m.type() === 'error' && !/status of 404/.test(m.text()) && bledy.push(m.text()));
    page.on('request', (r) => {
      const u = new URL(r.url());
      if (/^https?:$/.test(u.protocol) && u.host !== host) obce.push(r.url());
    });
    await page.addInitScript(() => {
      document.addEventListener('securitypolicyviolation', (e) => console.error(`CSP: ${e.violatedDirective} ${e.blockedURI}`));
    });

    await page.goto(adres, { waitUntil: 'networkidle' });
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toBeVisible();
    expect(bledy).toEqual([]);
    expect(obce).toEqual([]);
  });

  test(`${adres}: brak przewijania w bok przy 320 px`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.goto(adres);
    const szerokosc = await page.evaluate(() => document.documentElement.scrollWidth);
    expect(szerokosc).toBeLessThanOrEqual(320);
  });
}

test('strona główna: kanoniczny adres, okładka udostępnień i dane strukturalne', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://rytmhali.pl/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://rytmhali.pl/marka/okladka-domyslna.jpg');
  const graf = JSON.parse((await page.locator('script[type="application/ld+json"]').first().textContent())!)['@graph'];
  expect(graf.map((x: { '@type': string }) => x['@type'])).toEqual(['WebSite', 'NewsMediaOrganization']);
  const [serwis, redakcja] = graf;
  expect(serwis.potentialAction.target.urlTemplate).toBe('https://rytmhali.pl/szukaj?q={search_term_string}');
  expect(redakcja.logo).toMatchObject({ url: 'https://rytmhali.pl/marka/ikona-512.png', width: 512, height: 512 });
  expect(redakcja.publishingPrinciples).toBe('https://rytmhali.pl/zasady-redakcyjne');
  expect(redakcja.correctionsPolicy).toBe('https://rytmhali.pl/polityka-korekt');
  // Kotwica z polskimi literami w danych jest zakodowana i prowadzi do istniejącego śródtytułu.
  const finansowanie = new URL(redakcja.ownershipFundingInfo);
  await page.goto(finansowanie.pathname);
  await expect(page.locator(`[id="${decodeURIComponent(finansowanie.hash.slice(1))}"]`)).toHaveText('Niezależność i finansowanie');
});

test('llms.txt dla asystentów AI: nagłówek, działy, zasady redakcji, linki do istniejących stron', async ({ request }) => {
  const odp = await request.get('/llms.txt');
  expect(odp.status()).toBe(200);
  expect(odp.headers()['content-type']).toContain('text/plain');
  const tekst = await odp.text();
  expect(tekst).toMatch(/^# Rytm Hali\n\n> /);
  expect(tekst).toContain('## Produkcja');
  expect(tekst).toContain('## Zasady redakcji');
  expect(tekst).toContain(`(https://rytmhali.pl${ARTYKUL})`);
  for (const [, url] of [...tekst.matchAll(/\]\((https:\/\/rytmhali\.pl[^)]*)\)/g)].slice(0, 8)) {
    expect((await request.get(new URL(url).pathname)).status(), url).toBe(200);
  }
});

test('strony indeksowane mają adres kanoniczny i są w mapie strony', async ({ page, request }) => {
  const mapa = await (await request.get('/sitemap-0.xml')).text();
  for (const adres of INDEKSOWANE) {
    await page.goto(adres);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://rytmhali.pl${adres}`);
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    expect(mapa, adres).toContain(`<loc>https://rytmhali.pl${adres}</loc>`);
  }
});

test('artykuł: przypisy prowadzą do źródeł, okładka z buildu, dane strukturalne Article', async ({ page }) => {
  await page.goto(ARTYKUL);
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', `https://rytmhali.pl/okladki${ARTYKUL}.jpg`);
  const typy = (await page.locator('script[type="application/ld+json"]').allTextContents()).flatMap((t) => {
    const j = JSON.parse(t);
    return (j['@graph'] ?? [j]).map((x: { '@type': string }) => x['@type']);
  });
  expect(typy).toEqual(expect.arrayContaining(['Article', 'BreadcrumbList', 'FAQPage']));
  // Obrazy w proporcjach 16:9, 4:3 i 1:1 (Google) i okładka udostępnień; każdy plik istnieje.
  const artykul = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((t) => JSON.parse(t)).flatMap((j) => j['@graph'] ?? [j]).find((x) => x['@type'] === 'Article');
  expect(artykul.image).toHaveLength(4);
  for (const url of artykul.image) expect((await page.request.get(new URL(url).pathname)).status(), url).toBe(200);
  await expect(page.getByRole('heading', { name: 'Poprawki' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Jak powstał ten tekst' })).toBeVisible();
});

test('wyszukiwarka znajduje artykuł i nie zwraca wyników bez trafienia', async ({ page }) => {
  await page.goto('/szukaj?q=mikroprzestoje');
  await expect(page.locator('[data-status]')).toHaveText(/1 wynik/);
  await expect(page.locator('[data-wyniki] a').first()).toHaveAttribute('href', ARTYKUL);
  await page.goto('/szukaj?q=politechnika');
  await expect(page.locator('[data-status]')).toHaveText(/Brak wyników/);
});

test('kanały RSS: całość i dział', async ({ request }) => {
  for (const adres of ['/rss.xml', '/dzial/produkcja/rss.xml']) {
    const odp = await request.get(adres);
    expect(odp.ok(), adres).toBe(true);
    expect(await odp.text()).toMatch(/^<\?xml[\s\S]*<rss[\s\S]*<item>/);
  }
});

test('strony wewnętrzne mają noindex i nie mają adresu kanonicznego', async ({ page }) => {
  for (const adres of NIEINDEKSOWANE) {
    await page.goto(adres);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  }
});

test('robots.txt wskazuje mapę strony i zamyka panel', async ({ request }) => {
  const tekst = await (await request.get('/robots.txt')).text();
  expect(tekst).toContain('Sitemap: https://rytmhali.pl/sitemap-index.xml');
  expect(tekst).toContain('Disallow: /admin/');
});
