import { expect, test } from '@playwright/test';
import { NARZEDZIE_ZLECENIE } from './strony';

// Zlecenie netto: 3000 zł z chorobowym bez PIT-2 → 2106,72 zł; obok etatu 2442 zł; student 3000 zł.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_ZLECENIE);
});

test('jedyne źródło, z chorobowym: 2106,72 zł; z PIT-2: 2355,72 zł', async ({ page }) => {
  await expect(page.locator('[data-w="netto"]')).toHaveText('2106,72 zł');
  await page.getByLabel(/Złożony PIT-2/).check();
  await expect(page.locator('[data-w="netto"]')).toHaveText('2355,72 zł');
});

test('obok etatu: tylko zdrowotna i podatek, 2442 zł', async ({ page }) => {
  await page.getByLabel(/Mam etat u\sinnego pracodawcy/).check();
  await expect(page.locator('[data-w="spoleczne"]')).toHaveText('0,00 zł');
  await expect(page.locator('[data-w="netto"]')).toHaveText('2442,00 zł');
});

test('student do 26 lat: całe 3000 zł, bez pól PIT', async ({ page }) => {
  await page.getByLabel(/Uczę się albo studiuję/).check();
  await expect(page.locator('[data-w="netto"]')).toHaveText('3000,00 zł');
  await expect(page.getByLabel(/Złożony PIT-2/)).toBeHidden();
});
