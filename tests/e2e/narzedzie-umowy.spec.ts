import { expect, test } from '@playwright/test';
import { NARZEDZIE_UMOWY } from './strony';

// Umowy na czas określony: dwie umowy od 2025 r. → limit do 30 września 2027 r.; czwarta umowa; przerwy (990 dni).
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_UMOWY);
});

test('dwie umowy bez przerwy: limit do 30 września 2027 r.', async ({ page }) => {
  await expect(page.locator('[data-w="data"]')).toHaveText('30 września 2027 r.');
  await expect(page.locator('[data-w="status"]')).toHaveText('W limicie: zostało 273 dni po ostatniej umowie');
});

test('czwarta umowa: czas nieokreślony od dnia jej zawarcia', async ({ page }) => {
  await page.locator('#u-od-2').fill('2027-01-01');
  await page.locator('#u-do-2').fill('2027-03-31');
  await page.locator('#u-od-3').fill('2027-04-01');
  await page.locator('#u-do-3').fill('2027-06-30');
  await expect(page.locator('[data-w="naglowek"]')).toHaveText('Umowa na czas nieokreślony od');
  await expect(page.locator('[data-w="data"]')).toHaveText('1 kwietnia 2027 r.');
  await expect(page.locator('[data-w="status"]')).toHaveText('Czwarta umowa na czas określony');
});

test('przerwa między umowami: liczymy 990 dni', async ({ page }) => {
  await page.locator('#u-od-1').fill('2026-03-01');
  await expect(page.locator('[data-w="metoda"]')).toContainText('990 dni');
});

test('zachodzące umowy: komunikat', async ({ page }) => {
  await page.locator('#u-od-1').fill('2025-06-01');
  await expect(page.getByText('Umowy nie mogą na siebie zachodzić')).toBeVisible();
});
