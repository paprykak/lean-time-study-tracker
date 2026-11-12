import { expect, test } from '@playwright/test';
import { NARZEDZIE_POMIESZCZENIE } from './strony';

// § 19 ust. 2 i § 20 ogólnych przepisów BHP: 13 m³ i 2 m² wolne na osobę, wysokość 3 m (3,3 m przy czynnikach szkodliwych).
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_POMIESZCZENIE);
});

test('100 m², 4 m, sprzęt 40 m² i 60 m³: 26 osób', async ({ page }) => {
  await page.getByLabel('Powierzchnia podłogi (m²)').fill('100');
  await page.getByLabel('Wysokość w świetle (m)').fill('4');
  await page.getByLabel('Zajęte przez sprzęt (m²)').fill('40');
  await page.getByLabel('Zajęte przez sprzęt (m³)').fill('60');
  await expect(page.locator('[data-w="osoby"]')).toHaveText('26');
  await expect(page.locator('[data-w="podloga"]')).toContainText('30');
});

test('3 m przy czynnikach szkodliwych: za nisko', async ({ page }) => {
  await page.getByLabel('Wysokość w świetle (m)').fill('3');
  await page.getByLabel(/czynniki szkodliwe/).check();
  await expect(page.locator('[data-w="osoby"]')).toHaveText('0');
  await expect(page.locator('[data-w="status"]')).toContainText('Za niskie');
});
