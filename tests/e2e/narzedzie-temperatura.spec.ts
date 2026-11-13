import { expect, test } from '@playwright/test';
import { NARZEDZIE_TEMP } from './strony';

// Temperatura w pracy: minimum (§ 30), napoje (§ 4 rozporządzenia o napojach), § 30a od 11 stycznia 2027 r.
// Stan prawny ustawiamy jawnie na 2027 r., żeby wynik nie zależał od dnia testu.
const naglowek = (page: import('@playwright/test').Page) => page.locator('[data-w="naglowek"]');

test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_TEMP);
  await page.getByLabel('Stan prawny na dzień').selectOption('2027-01-11');
});

test('36°C w pomieszczeniu z pogody: zakaz pracy', async ({ page }) => {
  await page.getByLabel('Temperatura (°C)').fill('36');
  await expect(naglowek(page)).toHaveText('36°C: pracy nie wolno wykonywać');
  await expect(page.locator('[data-w="lista"] li[data-poziom="zakaz"]')).toHaveCount(1);
});

test('36°C z technologii: bez zakazu, ale obowiązek najwyżej 35°C (§ 30a ust. 1)', async ({ page }) => {
  await page.getByLabel('Temperatura (°C)').fill('36');
  await page.getByLabel(/Ciepło pochodzi z\stechnologii/).check();
  await expect(naglowek(page)).toHaveText('36°C: pracodawca ma obowiązki');
});

test('ruch ciągły przy 36°C: obowiązki bez zakazu', async ({ page }) => {
  await page.getByLabel('Temperatura (°C)').fill('36');
  await page.getByLabel(/ruchu ciągłym/).check();
  await expect(naglowek(page)).toHaveText('36°C: pracodawca ma obowiązki');
});

test('biuro 16°C: za zimno', async ({ page }) => {
  await page.getByLabel('Rodzaj pracy').selectOption('biuro-lekka');
  await page.getByLabel('Temperatura (°C)').fill('16');
  await expect(page.locator('[data-w="lista"]')).toContainText('nie może być niższa niż 18°C');
});

test('otwarta przestrzeń, duży wysiłek, 33°C: zakaz', async ({ page }) => {
  await page.getByLabel('Na otwartej przestrzeni').check();
  await expect(page.getByLabel(/Ciepło pochodzi z\stechnologii/)).toBeHidden();
  await page.getByLabel('Rodzaj pracy').selectOption('duzy');
  await page.getByLabel('Temperatura (°C)').fill('33');
  await expect(naglowek(page)).toHaveText('33°C: pracy nie wolno wykonywać');
});

test('błędna temperatura: komunikat', async ({ page }) => {
  await page.getByLabel('Temperatura (°C)').fill('gorąco');
  await expect(page.getByText('Wpisz temperaturę w stopniach Celsjusza')).toBeVisible();
});

test.describe('bez JavaScriptu', () => {
  test.use({ javaScriptEnabled: false });
  test('tabela progów jest w HTML', async ({ page }) => {
    await page.goto(NARZEDZIE_TEMP);
    await expect(page.locator('#progi ~ .tabela tr', { hasText: 'powyżej 35°C' })).toContainText('pracy nie wolno wykonywać');
  });
});
