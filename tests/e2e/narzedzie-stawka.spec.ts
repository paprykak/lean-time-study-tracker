import { expect, test } from '@playwright/test';
import { NARZEDZIE_STAWKA } from './strony';

// Stawka godzinowa z pensji: 6000 zł w 2026 r. (2008 h) → 35,86 zł średnio; listopad 160 h → 37,50 zł.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_STAWKA);
  await page.getByLabel('Rok', { exact: true }).selectOption('2026');
});

test('6000 zł w 2026 r.: średnio 35,86 zł, listopad 37,50 zł', async ({ page }) => {
  await expect(page.locator('[data-w="srednio"]')).toHaveText('35,86 zł');
  await expect(page.locator('[data-w="rocznie"]')).toHaveText('2008 h');
  await expect(page.locator('[data-w="lista"]')).toContainText(/listopad: 37,50\szł \(160\sh\)/);
});

test('zła pensja: komunikat', async ({ page }) => {
  await page.getByLabel('Pensja brutto miesięcznie (zł)').fill('0');
  await expect(page.locator('#s-blad')).toHaveText('Wpisz pensję brutto, na przykład 6000.');
});
