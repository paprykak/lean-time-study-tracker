import { expect, test } from '@playwright/test';
import { adresNarzedzia } from '../../src/data/narzedzia';

// Niepełny miesiąc, listopad 2026 r. (160 h), pensja 6000 zł: 10 dni L4 → 4000 zł; 16 h urlopu bezpłatnego → 5400 zł;
// umowa od 16 listopada (88 h) → 3300 zł; luty 2026 r. z 28 dniami L4 → 0 zł (art. 80 Kp).
test.beforeEach(async ({ page }) => {
  await page.goto(adresNarzedzia('wynagrodzenie-za-niepelny-miesiac'));
  await page.getByLabel('Miesiąc', { exact: true }).selectOption('11');
  await page.getByLabel('Rok', { exact: true }).selectOption('2026');
  await page.getByLabel('Pensja miesięczna (zł brutto)').fill('6000');
});

test('10 dni L4: 4000 zł', async ({ page }) => {
  await page.getByLabel('Dni L4 lub zasiłku').fill('10');
  await expect(page.locator('[data-w="kwota"]')).toHaveText(/^4\s?000,00\szł$/);
  await expect(page.locator('[data-w="l4"]')).toHaveText(/^2\s?000,00\szł$/);
});

test('urlop bezpłatny 16 h: 5400 zł; umowa od 16 listopada: 3300 zł', async ({ page }) => {
  await page.getByLabel('Dni L4 lub zasiłku').fill('0');
  await page.getByLabel('Godziny bez płacy').fill('16');
  await expect(page.locator('[data-w="kwota"]')).toHaveText(/^5\s?400,00\szł$/);
  await page.getByLabel('Godziny bez płacy').fill('0');
  await page.getByLabel('Od lub do dnia w trakcie miesiąca').check();
  await page.getByLabel('Pierwszy dzień umowy').fill('16');
  await expect(page.locator('[data-w="kwota"]')).toHaveText(/^3\s?300,00\szł$/);
  await expect(page.locator('[data-w="poza"]')).toContainText(/72\sh/);
});

test('luty z 28 dniami L4: 0 zł; 31 dni L4 to błąd', async ({ page }) => {
  await page.getByLabel('Miesiąc', { exact: true }).selectOption('2');
  await page.getByLabel('Dni L4 lub zasiłku').fill('28');
  await expect(page.locator('[data-w="kwota"]')).toHaveText(/^0,00\szł$/);
  await expect(page.locator('[data-w="uwaga"]')).toContainText(/art\.\s80/);
  await page.getByLabel('Dni L4 lub zasiłku').fill('31');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
});
