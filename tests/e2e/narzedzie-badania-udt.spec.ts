import { expect, test } from '@playwright/test';
import { NARZEDZIE_BADANIA_UDT } from './strony';

// Badania UDT i przeglądy: wózek widłowy co rok i co 30 dni, suwnica co 2 lata, dozór uproszczony bez badań.
const dzis = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Warsaw' }).format(new Date());
const zaMiesiecy = (n: number) => {
  const d = new Date();
  d.setUTCDate(15);
  d.setUTCMonth(d.getUTCMonth() + n);
  return d.toISOString().slice(0, 10);
};

test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_BADANIA_UDT);
});

test('wózek widłowy: badanie za rok, przegląd za 30 dni, plik kalendarza', async ({ page }) => {
  await expect(page.locator('[data-w="forma"]')).toHaveText('pełny: badanie okresowe co rok');
  await page.getByLabel('Ostatnie badanie UDT').fill('2026-03-17');
  await expect(page.locator('[data-w="badanie"]')).toHaveText('marzec 2027');
  await page.getByLabel('Ostatni przegląd konserwacyjny').fill(dzis());
  await expect(page.locator('[data-w="przeglad"]')).toContainText('za 30 dni');
  const pobranie = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Dodaj do kalendarza (.ics)' }).click();
  expect((await pobranie).suggestedFilename()).toBe('badania-udt.ics');
});

test('suwnica: badanie okresowe co 2 lata, po terminie z ostrzeżeniem', async ({ page }) => {
  await page.getByLabel('Urządzenie', { exact: true }).selectOption('suwnica-mech');
  await expect(page.locator('[data-w="forma"]')).toHaveText('pełny: badanie okresowe co 2 lata');
  await page.getByLabel('Ostatnie badanie UDT').fill(zaMiesiecy(-25));
  await expect(page.locator('[data-w="status-badania"]')).toHaveText('Po terminie: 1 miesiąc temu');
  await expect(page.locator('[data-w="uwaga"]')).toBeVisible();
});

test('dozór uproszczony: bez badania UDT i bez pola daty badania', async ({ page }) => {
  await page.getByLabel('Urządzenie', { exact: true }).selectOption('do-250');
  await expect(page.locator('[data-w="badanie"]')).toHaveText('Nie dotyczy');
  await expect(page.getByLabel('Ostatnie badanie UDT')).toBeHidden();
});

test('tabela z rozporządzenia działa bez JavaScriptu', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const p = await ctx.newPage();
  await p.goto(NARZEDZIE_BADANIA_UDT);
  await expect(p.getByRole('row', { name: /Układnica magazynowa/ })).toContainText('co rok');
  await ctx.close();
});
