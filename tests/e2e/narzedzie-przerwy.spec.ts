import { expect, test } from '@playwright/test';
import { NARZEDZIE_PRZERWY } from './strony';

// Przerwy w pracy: 12 h → 2 × 15 min, karmienie, młodociany, przerwa niewliczana.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_PRZERWY);
});

test('12 godzin: 30 minut płatnych przerw', async ({ page }) => {
  await expect(page.locator('[data-w="wliczane"]')).toHaveText('30 min');
  await expect(page.locator('[data-w="lista"] li')).toHaveCount(2);
});

test('8 godzin, karmienie jednego dziecka, 30 min przerwy niewliczanej', async ({ page }) => {
  await page.getByLabel('Dobowy wymiar czasu pracy (godziny)').fill('8');
  await page.getByLabel('Karmienie piersią').selectOption('jedno');
  await page.getByLabel('Przerwa niewliczana z regulaminu (minuty, 0–60)').fill('30');
  await expect(page.locator('[data-w="wliczane"]')).toHaveText('75 min');
  await expect(page.locator('[data-w="w-pracy"]')).toHaveText('8 h 30 min');
});

test('młodociany 5 h: 30 minut', async ({ page }) => {
  await page.getByLabel('Dobowy wymiar czasu pracy (godziny)').fill('5');
  await page.getByLabel('Pracownik młodociany (15–18 lat)').check();
  await expect(page.locator('[data-w="wliczane"]')).toHaveText('30 min');
});

test('8 godzin przy monitorze i z orzeczeniem: 15 + 35 + 15 minut', async ({ page }) => {
  await page.getByLabel('Dobowy wymiar czasu pracy (godziny)').fill('8');
  await page.getByLabel(/przy monitorze co najmniej/).check();
  await expect(page.locator('[data-w="wliczane"]')).toHaveText('50 min');
  await page.getByLabel(/Mam orzeczenie/).check();
  await expect(page.locator('[data-w="wliczane"]')).toHaveText('65 min');
});

test('zły wymiar: komunikat', async ({ page }) => {
  await page.getByLabel('Dobowy wymiar czasu pracy (godziny)').fill('30');
  await expect(page.getByText('Wpisz wymiar od 1 do 24 godzin')).toBeVisible();
});

test('8 godzin, w tym 4 przy monitorze: 15 + 20 minut', async ({ page }) => {
  await page.getByLabel('Dobowy wymiar czasu pracy (godziny)').fill('8');
  await page.getByLabel(/przy monitorze co najmniej/).check();
  await page.getByLabel('Godziny przy monitorze na zmianie').fill('4');
  await expect(page.locator('[data-w="wliczane"]')).toHaveText('35 min');
  await page.getByLabel('Godziny przy monitorze na zmianie').fill('3');
  await expect(page.getByText(/od\społowy\sdo\scałej\szmiany/)).toBeVisible();
});
