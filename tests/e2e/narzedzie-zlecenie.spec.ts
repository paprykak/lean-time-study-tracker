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

test('umowa do 200 zł: podatek zryczałtowany 12% całej kwoty, 150 zł → 103,13 zł', async ({ page }) => {
  await page.getByLabel('Kwota brutto z umowy w miesiącu (zł)').fill('150');
  await page.getByLabel(/Dobrowolne ubezpieczenie chorobowe/).uncheck();
  await expect(page.locator('[data-w="zaliczka"]')).toHaveText('18,00 zł');
  await expect(page.locator('[data-w="netto"]')).toHaveText('103,13 zł');
  await expect(page.locator('[data-w="uwaga"]')).toContainText(/podatek zryczałtowany 12%/);
  await page.getByLabel('Kwota brutto z umowy w miesiącu (zł)').fill('200,01');
  await expect(page.locator('[data-w="netto"]')).toHaveText('144,52 zł');
  await expect(page.locator('[data-w="uwaga"]')).toBeHidden();
});

test('FAQ: minimalna stawka godzinowa na 2027 r. z rejestru płacy minimalnej', async ({ page }) => {
  await expect(page.getByText(/2027\sr\.\s32,30\szł/).first()).toBeAttached();
});
