import { expect, test } from '@playwright/test';
import { STRONY } from './strony';

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
});

test('strony wewnętrzne mają noindex i nie mają adresu kanonicznego', async ({ page }) => {
  for (const adres of ['/styleguide', '/podglad/strona-glowna', '/podglad/artykul', '/404']) {
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
