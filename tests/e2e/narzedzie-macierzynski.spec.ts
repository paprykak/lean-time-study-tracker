import { expect, test } from '@playwright/test';
import { NARZEDZIE_MACIERZYNSKI } from './strony';

// Zasiłek macierzyński: 6000 zł → 5177,40 zł / 3624,18 zł albo 4219,58 zł; bliźnięta: 34 tygodnie rodzicielskiego matki.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_MACIERZYNSKI);
  await page.getByLabel('Rok', { exact: true }).selectOption('2026');
});

test('6000 zł: 100% i 70% albo 81,5%', async ({ page }) => {
  await expect(page.locator('[data-w="mac-a"]')).toHaveText('5177,40 zł');
  await expect(page.locator('[data-w="rodz-a"]')).toHaveText('3624,18 zł miesięcznie');
  await expect(page.locator('[data-w="mac-b"]')).toHaveText('4219,58 zł');
});

test('bliźnięta: domyślnie 34 tygodnie rodzicielskiego matki', async ({ page }) => {
  await page.getByLabel('Dzieci z jednego porodu').selectOption('2');
  await expect(page.getByLabel('Tygodnie rodzicielskiego matki')).toHaveValue('34');
});

test('za dużo tygodni: komunikat', async ({ page }) => {
  await page.getByLabel('Tygodnie rodzicielskiego matki').fill('40');
  await expect(page.getByText('Tygodnie rodzicielskiego matki: od 0 do 32.')).toBeVisible();
});
