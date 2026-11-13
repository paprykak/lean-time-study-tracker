import { expect, test } from '@playwright/test';
import { NARZEDZIE_NETTO } from './strony';

// Brutto–netto: 6000 zł → 4420,43 zł; płaca minimalna 4806 zł → 3605,85 zł; koszty 300 zł; ulga do 26 lat; uwagi.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_NETTO);
});

test('6000 zł brutto: 4420,43 zł netto', async ({ page }) => {
  await expect(page.locator('[data-w="netto"]')).toHaveText('4420,43 zł');
  await expect(page.locator('[data-w="zaliczka"]')).toHaveText('291,00 zł');
});

test('płaca minimalna 2026: 3605,85 zł, z dojazdem 3611,85 zł', async ({ page }) => {
  await page.getByLabel('Wynagrodzenie brutto w miesiącu (zł)').fill('4806');
  await expect(page.locator('[data-w="netto"]')).toHaveText('3605,85 zł');
  await page.getByLabel(/Dojeżdżam z\sinnej miejscowości/).check();
  await expect(page.locator('[data-w="netto"]')).toHaveText('3611,85 zł');
});

test('do 26 lat: bez zaliczki', async ({ page }) => {
  await page.getByLabel('Wynagrodzenie brutto w miesiącu (zł)').fill('4806');
  await page.getByLabel(/Mam mniej niż 26\slat/).check();
  await expect(page.locator('[data-w="zaliczka"]')).toHaveText('0,00 zł');
  await expect(page.locator('[data-w="netto"]')).toHaveText('3773,85 zł');
});

test('wysoka pensja: uwaga o progu 120 000 zł', async ({ page }) => {
  await page.getByLabel('Wynagrodzenie brutto w miesiącu (zł)').fill('12000');
  await expect(page.locator('[data-w="uwaga"]')).toContainText(/120\s000\szł w\sgrudniu/);
  await page.getByLabel('Wynagrodzenie brutto w miesiącu (zł)').fill('25000');
  await expect(page.locator('[data-w="uwaga"]')).toContainText(/120\s000\szł w\sczerwcu/);
});

test('do 26 lat, 10 000 zł: uwaga o limicie ulgi 85 528 zł od września', async ({ page }) => {
  await page.getByLabel('Wynagrodzenie brutto w miesiącu (zł)').fill('10000');
  await page.getByLabel(/Mam mniej niż 26\slat/).check();
  await expect(page.locator('[data-w="uwaga"]')).toBeVisible();
  await expect(page.locator('[data-w="uwaga"]')).toContainText(/85\s528\szł we wrześniu/);
});
