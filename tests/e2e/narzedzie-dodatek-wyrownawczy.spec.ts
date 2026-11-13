import { expect, test } from '@playwright/test';
import { adresNarzedzia } from '../../src/data/narzedzia';

// Dodatek wyrównawczy po wypadku przy pracy, przeniesienie 1 października 2026 r. (okres do 31 marca 2027 r.):
// przed 6000 zł + 2700 zł zmiennych w 92 dniach, po 5200 zł + 300 zł; listopad 2026 r.: 800 + 2700/92 × 30 − 300 = 1380,43 zł;
// z 5 dniami L4 i 1 dniem urlopu bezpłatnego 1032,77 zł (§ 8–9 rozporządzenia z 1996 r.).
test.beforeEach(async ({ page }) => {
  await page.goto(adresNarzedzia('dodatek-wyrownawczy'));
  await page.getByLabel('Powód przeniesienia').selectOption('wypadek');
  await page.getByLabel('Dzień przeniesienia').fill('2026-10-01');
  await page.getByLabel('Miesiąc', { exact: true }).selectOption('11');
  await page.getByLabel('Rok', { exact: true }).selectOption('2026');
});

test('listopad 2026 r.: 1380,43 zł, okres do 31 marca 2027 r.', async ({ page }) => {
  await expect(page.locator('[data-w="kwota"]')).toHaveText(/^1\s?380,43\szł$/);
  await expect(page.locator('[data-w="okres"]')).toContainText(/31\smarca\s2027/);
});

test('5 dni L4 i 1 dzień bez wynagrodzenia: 1032,77 zł', async ({ page }) => {
  await page.getByLabel('Dni L4 lub zasiłku').fill('5');
  await page.getByLabel('Dni bez wynagrodzenia').fill('1');
  await expect(page.locator('[data-w="kwota"]')).toHaveText(/^1\s?032,77\szł$/);
});

test('miesiąc po okresie i błąd: za dużo dni L4', async ({ page }) => {
  await page.getByLabel('Miesiąc', { exact: true }).selectOption('4');
  await page.getByLabel('Rok', { exact: true }).selectOption('2027');
  await expect(page.locator('[data-w="uwaga"]')).toContainText(/poza\sokresem/);
  await page.getByLabel('Rok', { exact: true }).selectOption('2026');
  await page.getByLabel('Dni L4 lub zasiłku').fill('40');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
});
