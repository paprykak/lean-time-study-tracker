import { expect, test } from '@playwright/test';
import { NARZEDZIE_PLACA } from './strony';

// Płaca minimalna: 4500 + 200 w 2026 r. → wyrównanie 106 zł; 5000 zł → zgodna; pół etatu 2403 zł.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_PLACA);
  await page.getByLabel('Rok', { exact: true }).selectOption('2026');
});

test('4500 zł + 200 zł premii: wyrównanie 106 zł', async ({ page }) => {
  await expect(page.locator('[data-w="wyrownanie"]')).toHaveText('106,00 zł');
  await expect(page.locator('[data-w="status"]')).toHaveText('Pensja niższa od płacy minimalnej');
});

test('5000 zł: zgodna, bez wyrównania', async ({ page }) => {
  await page.getByLabel('Pensja zasadnicza (zł brutto)').fill('5000');
  await expect(page.locator('[data-w="wyrownanie"]')).toHaveText('0,00 zł');
  await expect(page.locator('[data-w="status"]')).toHaveText('Pensja nie jest niższa od płacy minimalnej');
});

test('pół etatu: minimum 2403 zł', async ({ page }) => {
  await page.getByLabel('Wymiar etatu').selectOption('0.5');
  await expect(page.locator('[data-w="minimum"]')).toHaveText('2403,00 zł');
});
