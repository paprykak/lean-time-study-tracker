import { expect, test } from '@playwright/test';
import { adresNarzedzia } from '../../src/data/narzedzia';

// Świadczenie urlopowe 2026: 37,5% z 7848,60 zł = 2943,225 zł → najwyżej 2943,22 zł; 3/4 etatu 2207,41 zł;
// urlop 6–19 lipca 2026 r. (14 dni) → wypłata do 5 lipca 2026 r.; na rękę przy 12%: 2943,22 − 353 = 2590,22 zł.
test.beforeEach(async ({ page }) => {
  await page.goto(adresNarzedzia('swiadczenie-urlopowe'));
  await page.getByLabel('Rok', { exact: true }).selectOption('2026');
  await page.getByLabel('Pierwszy dzień').fill('2026-07-06');
  await page.getByLabel('Ostatni dzień').fill('2026-07-19');
});

test('pełny etat 2026: 2943,22 zł, na rękę 2590,22 zł, wypłata do 5 lipca', async ({ page }) => {
  await expect(page.locator('[data-w="maksimum"]')).toHaveText(/^2\s?943,22\szł$/);
  await expect(page.locator('[data-w="netto"]')).toContainText(/2\s?590,22\szł/);
  await expect(page.locator('[data-w="termin"]')).toHaveText(/^5\slipca\s2026\sr\.$/);
});

test('3/4 etatu i młodociany bez proporcji', async ({ page }) => {
  await page.getByLabel('Wymiar etatu').selectOption('3/4');
  await expect(page.locator('[data-w="maksimum"]')).toHaveText(/^2\s?207,41\szł$/);
  await page.getByLabel('Rodzaj pracy').selectOption('mlodociany2');
  await expect(page.locator('[data-w="maksimum"]')).toHaveText(/^470,91\szł$/);
});

test('13 dni urlopu: warunek niespełniony; koniec przed początkiem to błąd', async ({ page }) => {
  await page.getByLabel('Ostatni dzień').fill('2026-07-18');
  await expect(page.locator('[data-w="urlop"]')).toContainText(/13\sdni/);
  await expect(page.locator('[data-w="termin"]')).toContainText(/nie\snależy/);
  await page.getByLabel('Ostatni dzień').fill('2026-07-01');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
});
