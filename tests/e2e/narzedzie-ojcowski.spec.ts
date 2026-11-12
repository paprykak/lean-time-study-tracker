import { expect, test } from '@playwright/test';
import { NARZEDZIE_OJCOWSKI } from './strony';

// Urlop ojcowski: dziecko urodzone 15 marca 2026 r. → do 14 marca 2027 r.; 6000 zł brutto → 2416,12 zł za 14 dni.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_OJCOWSKI);
  await page.getByLabel('Data urodzenia dziecka').fill('2026-03-15');
  await page.getByLabel(/Przeciętna pensja brutto/).fill('6000');
});

test('ostatni dzień, start całego urlopu i wniosek', async ({ page }) => {
  await expect(page.locator('[data-w="koniec"]')).toHaveText('14 marca 2027 r.');
  await expect(page.locator('[data-w="start"]')).toHaveText('1 marca 2027 r.');
  await expect(page.locator('[data-w="wniosek"]')).toHaveText('22 lutego 2027 r.');
});

test('zasiłek 100% za 14 dni', async ({ page }) => {
  await expect(page.locator('[data-w="zasilek"]')).toHaveText(/^2416,12\szł$/);
  await expect(page.locator('[data-w="dziennie"]')).toHaveText(/^172,58\szł$/);
});
