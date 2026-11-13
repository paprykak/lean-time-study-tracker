import { expect, test } from '@playwright/test';
import { NARZEDZIE_SANITARNE } from './strony';

// Normy sanitarne: 45 mężczyzn i 25 kobiet, praca brudząca → 14 umywalek, 8–9 natrysków; biuro i mała firma.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_SANITARNE);
});

test('45 mężczyzn i 25 kobiet, praca brudząca', async ({ page }) => {
  await expect(page.locator('[data-w="umywalki"]')).toHaveText('14');
  await expect(page.locator('[data-w="miski-m"]')).toHaveText('1, ostrożnie 2');
  await expect(page.locator('[data-w="natryski"]')).toHaveText('8, ostrożnie 9');
  await expect(page.locator('[data-w="jadalnia"]')).toContainText('wymagana');
});

test('6 mężczyzn, zwykła praca, bez natrysków: jedna umywalka, bez jadalni', async ({ page }) => {
  await page.getByLabel('Mężczyźni').fill('6');
  await page.getByLabel('Kobiety').fill('0');
  await page.getByLabel('Zwykła praca na hali').check();
  await page.getByLabel('Nie są wymagane').check();
  await expect(page.locator('[data-w="umywalki"]')).toHaveText('1');
  await expect(page.locator('[data-w="natryski"]')).toHaveText('0');
  await expect(page.locator('[data-w="jadalnia"]')).toContainText('niewymagana');
});

test('10 osób przy pracy brudzącej: jadalnia wymagana (§ 29 ust. 2)', async ({ page }) => {
  await page.getByLabel('Mężczyźni').fill('10');
  await page.getByLabel('Kobiety').fill('0');
  await page.getByLabel(/Praca brudząca/).check();
  await expect(page.locator('[data-w="jadalnia"]')).toContainText(/§\s29\sust\.\s2/);
});
