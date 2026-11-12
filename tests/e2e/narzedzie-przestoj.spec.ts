import { expect, test } from '@playwright/test';
import { NARZEDZIE_PRZESTOJ } from './strony';

// Przestój: pensja 6000 zł w listopadzie 2026 r. (160 h) → 37,50 zł za godzinę; stawka 25 zł podniesiona do minimum.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_PRZESTOJ);
  await page.getByLabel('Miesiąc', { exact: true }).selectOption('11');
  await page.getByLabel('Rok', { exact: true }).selectOption('2026');
});

test('pensja 6000 zł, 16 h w listopadzie 2026 r.: 600 zł', async ({ page }) => {
  await expect(page.locator('[data-w="za-godzine"]')).toHaveText('37,50 zł');
  await expect(page.locator('[data-w="kwota"]')).toHaveText('600,00 zł');
});

test('stawka godzinowa 25 zł: podniesiona do płacy minimalnej', async ({ page }) => {
  await page.getByLabel('Stawka godzinowa').check();
  await page.getByLabel('Stawka za godzinę (zł brutto)').fill('25');
  await expect(page.locator('[data-w="uwaga"]')).toBeVisible();
  await expect(page.locator('[data-w="kwota"]')).toHaveText('480,60 zł');
});

test('bez wyodrębnionej stawki: 60%', async ({ page }) => {
  await page.getByLabel(/Bez wyodrębnionej stawki/).check();
  await expect(page.locator('[data-w="za-godzine"]')).toHaveText('18,75 zł (60%)');
});
