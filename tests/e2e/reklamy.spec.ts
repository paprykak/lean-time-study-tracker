import { expect, test, type Page } from '@playwright/test';

// Kampanie reklamowe w slotach (F5) na fikcyjnych kampaniach testowych (src/content/testowe/kampanie):
// A trwa we wszystkich miejscach, B rotuje z A w „glowna-bok”, kampania zakończona nie trafia do HTML.
const widoczna = (page: Page, miejsce: string) => page.locator(`[data-slot="${miejsce}"] .slot-wariant:visible .slot-pole > a:visible`);

test('kampania w slocie: link z UTM, rel="sponsored noopener", podpis „REKLAMA”, kreacja w wymiarach formatu', async ({ page }) => {
  await page.addInitScript(() => (Math.random = () => 0));
  await page.goto('/');
  const link = widoczna(page, 'glowna-gora');
  await expect(link).toHaveCount(1);
  await expect(link).toHaveAttribute('data-kampania', 'testowa-kampania-a');
  await expect(link).toHaveAttribute('rel', 'sponsored noopener');
  const adres = new URL((await link.getAttribute('href'))!);
  expect(Object.fromEntries(adres.searchParams)).toEqual({ utm_source: 'rytmhali', utm_medium: 'display', utm_campaign: 'testowa-kampania-a' });
  await expect(page.locator('[data-slot="glowna-gora"] .slot-wariant:visible .slot-podpis')).toHaveText(/reklama/i);
  const img = link.locator('img');
  // Slot jest pod narzędziami na stronie głównej; na niskim ekranie (iPhone) leży poniżej pierwszego widoku,
  // a kreacja ładuje się leniwie, więc przewijamy do niej przed sprawdzeniem.
  await img.scrollIntoViewIfNeeded();
  await expect(img).toHaveJSProperty('complete', true);
  expect(await img.evaluate((i: HTMLImageElement) => i.naturalWidth)).toBeGreaterThan(0);
  expect(await page.content()).not.toContain('testowa-kampania-zakonczona');
});

test('rotacja: w „glowna-bok” losowanie wybiera A albo B, druga czeka ukryta', async ({ page }) => {
  for (const [los, oczekiwana] of [[0, 'testowa-kampania-a'], [0.99, 'testowa-kampania-b']] as const) {
    await page.addInitScript((l) => (Math.random = () => l), los);
    await page.goto('/');
    const link = widoczna(page, 'glowna-bok');
    await expect(link).toHaveCount(1);
    await expect(link).toHaveAttribute('data-kampania', oczekiwana);
    if (oczekiwana.endsWith('-b')) await expect(link).toHaveAttribute('href', /utm_source=partner&utm_medium=display&utm_campaign=testowa-kampania-b/);
  }
});

test('po końcu kampanii slot wraca do autopromocji newslettera (zegar przestawiony na 2100 r.)', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2100-01-01T12:00:00+01:00'));
  await page.goto('/');
  for (const miejsce of ['glowna-gora', 'glowna-bok']) {
    await expect(widoczna(page, miejsce)).toHaveCount(1);
    await expect(widoczna(page, miejsce)).toHaveAttribute('data-autopromocja', '');
    await expect(widoczna(page, miejsce)).toHaveAttribute('href', '/newsletter');
  }
});

test('wyświetlenie kampanii trafia do statystyk, gdy połowa slotu jest na ekranie przez sekundę', async ({ page }) => {
  await page.addInitScript(() => {
    Math.random = () => 0;
    (window as unknown as { zdarzenia: unknown[] }).zdarzenia = [];
    (window as unknown as { umami: unknown }).umami = { track: (nazwa: string, dane: unknown) => (window as unknown as { zdarzenia: unknown[] }).zdarzenia.push([nazwa, dane]) };
  });
  await page.goto('/');
  await widoczna(page, 'glowna-gora').scrollIntoViewIfNeeded();
  await expect.poll(() => page.evaluate(() => (window as unknown as { zdarzenia: unknown[] }).zdarzenia), { timeout: 4000 }).toContainEqual([
    'Reklama: wyświetlenie',
    { kampania: 'testowa-kampania-a', miejsce: 'glowna-gora', slot: 'testowa-kampania-a@glowna-gora' },
  ]);
});

test('materiał partnera: oznaczenie w nagłówku i na liście, sponsor w danych, linki sponsorowane, bez reklamy w treści', async ({ page }) => {
  await page.goto('/testowy-material-partnera');
  await expect(page.locator('article .etykieta-partnera').first()).toHaveText('Materiał partnera');
  await expect(page.locator('a[href="https://example.com/czujniki"]')).toHaveAttribute('rel', 'sponsored noopener');
  await expect(page.locator('[data-slot="artykul-tresc"]')).toHaveCount(0);
  const dane = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((t) => JSON.parse(t)).flatMap((j) => j['@graph'] ?? [j]);
  expect(dane.find((x) => x['@type'] === 'Article').sponsor).toEqual({ '@type': 'Organization', name: 'Partner Testowy (fikcyjny)', url: 'https://example.com/' });
  await page.goto('/dzial/dane-i-ai');
  const karta = page.locator('article', { has: page.locator('a[href="/testowy-material-partnera"]') }).first();
  await expect(karta.locator('.etykieta-partner')).toHaveText('Materiał partnera');
});
