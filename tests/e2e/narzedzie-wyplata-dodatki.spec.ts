import { expect, test } from '@playwright/test';
import { NARZEDZIE_WYPLATA_DODATKI } from './strony';

// Listopad 2026 r. (160 h): 6000 zł, 10 nadgodzin 50%, 40 h w nocy → 6802,90 zł brutto, 4967,91 zł na rękę.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_WYPLATA_DODATKI);
  await page.getByLabel('Rok', { exact: true }).selectOption('2026');
  await page.getByLabel('Miesiąc', { exact: true }).selectOption('11');
  await page.getByLabel('Pensja zasadnicza brutto (zł)').fill('6000');
  await page.getByLabel(/dodatkiem\s50%/).fill('10');
  await page.getByLabel(/dodatkiem\s100%/).fill('0');
  await page.getByLabel('Godziny pracy w nocy').fill('40');
});

test('na rękę 4967,91 zł, z dodatków 547,48 zł', async ({ page }) => {
  await expect(page.locator('[data-w="netto"]')).toHaveText(/^4967,91\szł$/);
  await expect(page.locator('[data-w="brutto"]')).toHaveText(/^6802,90\szł$/);
  await expect(page.locator('[data-w="dodatki"]')).toHaveText(/^547,48\szł$/);
});

test('błędne godziny: komunikat', async ({ page }) => {
  await page.getByLabel('Godziny pracy w nocy').fill('abc');
  await expect(page.locator('[data-blad="dane"]')).toContainText('Godziny');
});
