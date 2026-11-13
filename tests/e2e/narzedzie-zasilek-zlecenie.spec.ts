import { expect, test } from '@playwright/test';
import { adresNarzedzia } from '../../src/data/narzedzia';

// Zasiłek na zleceniu: przychód 4000 zł → podstawa 3451,60 zł, 80% → 92,04 zł za dzień, 10 dni = 920,40 zł,
// zaliczka 110 zł → 810,40 zł; ciąża 30 dni → 3451,50 zł; student → brak zasiłku.
test.beforeEach(async ({ page }) => {
  await page.goto(adresNarzedzia('zasilek-chorobowy-na-zleceniu'));
  await page.getByLabel('Przychód miesięcznie (zł brutto)').fill('4000');
  await page.getByLabel('Dni L4').fill('10');
});

test('4000 zł, 10 dni choroby: 920,40 zł, na rękę 810,40 zł', async ({ page }) => {
  await expect(page.locator('[data-w="kwota"]')).toHaveText(/^920,40\szł$/);
  await expect(page.locator('[data-w="netto"]')).toContainText(/810,40\szł/);
});

test('ciąża 30 dni: 3451,50 zł; student bez zasiłku', async ({ page }) => {
  await page.getByLabel('Powód L4').selectOption('ciaza');
  await page.getByLabel('Dni L4').fill('30');
  await expect(page.locator('[data-w="kwota"]')).toHaveText(/^3\s?451,50\szł$/);
  await page.getByLabel('Twoja sytuacja').selectOption('student');
  await expect(page.locator('[data-w="kwota"]')).toHaveText(/^0,00\szł$/);
  await expect(page.locator('[data-w="uwaga"]')).toContainText(/26\slat/);
});

test('błędne dni L4', async ({ page }) => {
  await page.getByLabel('Dni L4').fill('2,5');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
});

test('choroba: najwyżej 182 dni (art. 8 ust. 1), w ciąży 270', async ({ page }) => {
  await page.getByLabel('Dni L4').fill('183');
  await expect(page.locator('[data-blad="dane"]')).toContainText(/najwyżej\sza\s182\sdni/);
  await expect(page.locator('[data-w="kwota"]')).toHaveText('—');
  await page.getByLabel('Powód L4').selectOption('ciaza');
  await expect(page.locator('[data-blad="dane"]')).toBeHidden();
});

test('zlecenie u pracodawcy: bez mylącego 0 zł; etat z niską pensją: podpowiedź o chorobowym', async ({ page }) => {
  await page.getByLabel('Twoja sytuacja').selectOption('u-pracodawcy');
  await expect(page.locator('[data-w="kwota"]')).toHaveText('—');
  await expect(page.locator('[data-w="opis"]')).not.toContainText('nie przysługuje');
  await page.getByLabel('Twoja sytuacja').selectOption('etat-gdzie-indziej');
  await expect(page.locator('[data-w="uwaga"]')).toContainText(/niższa\sod\sminimalnej/);
  await expect(page.locator('[data-w="uwaga"]')).toContainText('Zlecenie z chorobowym');
});
