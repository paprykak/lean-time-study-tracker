import { expect, test } from '@playwright/test';
import { NARZEDZIE_EKWIWALENT } from './strony';

// Ekwiwalent za urlop: 6000 zł, 5 dni w 2026 r. → 1434,26 zł; premie; pół etatu.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_EKWIWALENT);
  await page.getByLabel('Rok odejścia z pracy').selectOption('2026');
});

test('6000 zł, 5 dni, 2026 r.: 1434,26 zł', async ({ page }) => {
  await expect(page.locator('[data-w="kwota"]')).toHaveText('1434,26 zł');
  await expect(page.locator('[data-w="wspolczynnik"]')).toHaveText('20,92 (251 dni pracy / 12)');
});

test('premia miesięczna i roczna, 1 dzień', async ({ page }) => {
  await page.getByLabel('Pensja i stałe dodatki miesięcznie (zł brutto)').fill('4806');
  await page.getByLabel('Średnia premii i dodatków zmiennych z 3 miesięcy (zł)').fill('600');
  await page.getByLabel('Premie kwartalne i roczne z 12 miesięcy, razem (zł)').fill('2400');
  await page.getByLabel('Dni urlopu').fill('1');
  await expect(page.locator('[data-w="podstawa"]')).toHaveText('5606,00 zł');
  await expect(page.locator('[data-w="kwota"]')).toHaveText('268,02 zł');
});

test('pół etatu, 13 dni: 2987,00 zł', async ({ page }) => {
  await page.getByLabel('Wymiar etatu').selectOption('0.5');
  await page.getByLabel('Pensja i stałe dodatki miesięcznie (zł brutto)').fill('2403');
  await page.getByLabel('Dni urlopu').fill('13');
  await expect(page.locator('[data-w="kwota"]')).toHaveText('2987,00 zł');
});

test('brak pensji: komunikat', async ({ page }) => {
  await page.getByLabel('Pensja i stałe dodatki miesięcznie (zł brutto)').fill('');
  await expect(page.getByText('Wpisz pensję miesięczną')).toBeVisible();
  await expect(page.locator('[data-w="kwota"]')).toHaveText('—');
});
