import { expect, test } from '@playwright/test';
import { NARZEDZIE_L4_PO } from './strony';

// Zasiłek po ustaniu zatrudnienia (art. 7, 8, 13 ustawy zasiłkowej): koniec pracy 31 marca 2026 r.
const ustaw = async (page: import('@playwright/test').Page, od: string, do_: string) => {
  await page.getByLabel('Ostatni dzień zatrudnienia').fill('2026-03-31');
  await page.getByLabel('L4 od', { exact: true }).fill(od);
  await page.getByLabel('L4 do', { exact: true }).fill(do_);
};

test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_L4_PO);
});

test('L4 z czasu pracy: 91 dni, do 30 czerwca', async ({ page }) => {
  await ustaw(page, '2026-03-20', '2026-12-31');
  await expect(page.locator('[data-w="dni"]')).toHaveText(/^91\sdni$/);
  await expect(page.locator('[data-w="status"]')).toContainText('30 czerwca 2026');
});

test('L4 po 15 dniach od końca pracy: nie przysługuje', async ({ page }) => {
  await ustaw(page, '2026-04-15', '2026-06-30');
  await expect(page.locator('[data-w="dni"]')).toHaveText('Nie przysługuje');
  await expect(page.locator('[data-w="status"]')).toContainText('14 kwietnia 2026');
});

test('nowa praca z ubezpieczeniem: wyłączenie z art. 13', async ({ page }) => {
  await ustaw(page, '2026-03-20', '2026-05-31');
  await page.getByLabel(/emeryturę albo rentę/).check();
  await expect(page.locator('[data-w="status"]')).toContainText('art. 13');
});
