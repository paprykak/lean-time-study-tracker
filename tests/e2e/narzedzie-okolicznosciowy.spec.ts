import { expect, test } from '@playwright/test';
import { NARZEDZIE_OKOLICZNOSCIOWY } from './strony';

// Zwolnienia od pracy: § 15 rozporządzenia z 1996 r. i art. 9 ustawy o publicznej służbie krwi.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_OKOLICZNOSCIOWY);
});

test('ślub: 2 dni płatne', async ({ page }) => {
  await page.getByLabel('Co się wydarzyło').selectOption('slub');
  await expect(page.locator('[data-w="wymiar"]')).toHaveText('2 dni');
  await expect(page.locator('[data-w="platnosc"]')).toContainText('zachowujesz wynagrodzenie');
});

test('pogrzeb babci: 1 dzień; oddanie krwi: dzień oddania i następny', async ({ page }) => {
  await page.getByLabel('Co się wydarzyło').selectOption('pogrzeb-dalszy');
  await expect(page.locator('[data-w="wymiar"]')).toHaveText('1 dzień');
  await page.getByLabel('Co się wydarzyło').selectOption('krew');
  await expect(page.locator('[data-w="wymiar"]')).toHaveText('dzień oddania krwi i dzień następny');
});

test('wezwanie do sądu: rekompensata', async ({ page }) => {
  await page.getByLabel('Co się wydarzyło').selectOption('wezwanie');
  await expect(page.locator('[data-w="platnosc"]')).toContainText('rekompensatę');
});
