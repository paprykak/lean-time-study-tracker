import { expect, test } from '@playwright/test';
import { NARZEDZIE_OCHRONA } from './strony';

// Ochrona przedemerytalna: 4 lata przed wiekiem emerytalnym (art. 39 Kp), wiek 60 albo 65 lat.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_OCHRONA);
  await page.getByLabel('Data urodzenia').fill('1964-03-15');
});

test('65 lat: ochrona od 15 marca 2025 r. do 14 marca 2029 r.', async ({ page }) => {
  await page.getByLabel('Wiek emerytalny').selectOption('65');
  await expect(page.locator('[data-w="od"]')).toHaveText('15 marca 2025 r.');
  await expect(page.locator('[data-w="do"]')).toHaveText('14 marca 2029 r.');
  await expect(page.locator('[data-w="status"]')).toHaveText('Ochrona trwa');
});

test('60 lat: wiek emerytalny już osiągnięty', async ({ page }) => {
  await page.getByLabel('Wiek emerytalny').selectOption('60');
  await expect(page.locator('[data-w="od"]')).toHaveText('15 marca 2020 r.');
  await expect(page.locator('[data-w="status"]')).toHaveText('Wiek emerytalny osiągnięty');
});

test('młodsza osoba: ochrona dopiero za kilka lat', async ({ page }) => {
  await page.getByLabel('Data urodzenia').fill('1990-06-01');
  await expect(page.locator('[data-w="od"]')).toHaveText('1 czerwca 2051 r.');
  await expect(page.locator('[data-w="status"]')).toContainText('Za ');
});
