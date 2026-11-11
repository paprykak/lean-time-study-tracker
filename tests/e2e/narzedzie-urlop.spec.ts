import { expect, test } from '@playwright/test';
import { NARZEDZIE_URLOP } from './strony';

// Kalkulator urlopu: 20/26 dni ze szkołą, niepełny etat, część roku, pierwsza praca.
const dni = (page: import('@playwright/test').Page) => page.locator('[data-w="dni"]');
const staz = async (page: import('@playwright/test').Page, lata: string, szkola: string) => {
  await page.getByLabel('Lata', { exact: true }).fill(lata);
  await page.getByLabel('Miesiące', { exact: true }).fill('0');
  await page.getByLabel('Ukończona szkoła').selectOption(szkola);
};

test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_URLOP);
});

test('studia i 2 lata pracy: 26 dni, 208 h', async ({ page }) => {
  await staz(page, '2', 'wyzsza');
  await expect(dni(page)).toHaveText('26 dni');
  await expect(page.locator('[data-w="godziny"]')).toHaveText('208 h');
  await expect(page.locator('[data-w="do-26"]')).toHaveText('już przysługuje');
});

test('1/3 etatu przy 26 dniach: 9 dni (zaokrąglenie w górę)', async ({ page }) => {
  await staz(page, '10', 'brak');
  await page.getByLabel('Etat', { exact: true }).selectOption('1/3');
  await expect(dni(page)).toHaveText('9 dni');
});

test('zmiana pracy: 7 miesięcy przy 20 dniach → 12 dni', async ({ page }) => {
  await staz(page, '3', 'brak');
  await page.getByLabel('W tym roku', { exact: true }).selectOption('czesc-roku');
  await page.getByLabel('Miesiące pracy u tego pracodawcy w tym roku').fill('7');
  await expect(dni(page)).toHaveText('12 dni');
});

test('pierwsza praca, 3 pełne miesiące: 5 dni nabyte', async ({ page }) => {
  await staz(page, '0', 'brak');
  await page.getByLabel('W tym roku', { exact: true }).selectOption('pierwsza-praca');
  await page.getByLabel('Miesiące pracy u tego pracodawcy w tym roku').fill('3');
  await expect(dni(page)).toHaveText('5 dni');
  await expect(page.locator('[data-w="uwaga"]')).toContainText('13 h 20 min');
});

test('błędny staż: komunikat', async ({ page }) => {
  await page.getByLabel('Miesiące', { exact: true }).fill('15');
  await expect(page.getByText('Wpisz pełne lata i miesiące')).toBeVisible();
});
