import { expect, test } from '@playwright/test';
import { NARZEDZIE_ODWOLANIE } from './strony';

// Terminy z art. 264 i 97 § 2¹ Kp liczone według art. 111 § 2 i 115 KC (wartości jak w termin-odwolania.test.ts).
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_ODWOLANIE);
});

test('wypowiedzenie doręczone 12 listopada 2026 r.: do 3 grudnia', async ({ page }) => {
  await page.getByLabel('Sprawa', { exact: true }).selectOption('wypowiedzenie');
  await page.locator('#o-data').fill('2026-11-12');
  await expect(page.locator('[data-w="koniec"]')).toHaveText('3 grudnia 2026 r.');
  await expect(page.locator('[data-w="przesuniecie"]')).toHaveText('brak');
});

test('dyscyplinarka 3 grudnia 2026 r.: koniec przesunięty przez święta na 28 grudnia', async ({ page }) => {
  await page.getByLabel('Sprawa', { exact: true }).selectOption('bez-wypowiedzenia');
  await page.locator('#o-data').fill('2026-12-03');
  await expect(page.locator('[data-w="koniec"]')).toHaveText('28 grudnia 2026 r.');
  await expect(page.locator('[data-w="przesuniecie"]')).toContainText('Wigilia Bożego Narodzenia');
});

test('sprostowanie świadectwa: 14 dni u pracodawcy', async ({ page }) => {
  await page.getByLabel('Sprawa', { exact: true }).selectOption('sprostowanie-wniosek');
  await expect(page.locator('label[for="o-data"]')).toHaveText('Dzień otrzymania świadectwa pracy');
  await page.locator('#o-data').fill('2026-11-12');
  await expect(page.locator('[data-w="koniec"]')).toHaveText('26 listopada 2026 r.');
  await expect(page.locator('[data-w="gdzie"]')).toHaveText('pracodawca');
});
