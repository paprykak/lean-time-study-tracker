import { expect, test } from '@playwright/test';
import { adresNarzedzia } from '../../src/data/narzedzia';

// Dorabianie od 1 września 2026 r. (M.P. 2026 poz. 839: 6463,20 i 12 003,10 zł; maksymalne zmniejszenia
// M.P. 2026 poz. 220): renta całkowita i 6800 zł → zmniejszenie 336,80 zł, do zawieszenia 5203,10 zł;
// częściowa i 9000 zł → 742,10 zł; 13 000 zł → zawieszenie; emerytura od 60/65 lat → bez limitu;
// grudzień 2025–luty 2026, emerytura przed 60/65 lat i 9000 zł → 939,61 zł (M.P. 2025 poz. 152).
test.beforeEach(async ({ page }) => {
  await page.goto(adresNarzedzia('dorabianie-do-renty'));
  await page.getByLabel('Okres').selectOption('2026-09-01');
  await page.getByLabel('Świadczenie', { exact: true }).selectOption('renta-calkowita');
  await page.getByLabel('Przychód w miesiącu (zł brutto)').fill('6800');
});

test('renta całkowita, 6800 zł: zmniejszenie o 336,80 zł', async ({ page }) => {
  await expect(page.locator('[data-w="stan"]')).toHaveText(/^Zmniejszenie\so\s336,80\szł$/);
  await expect(page.locator('[data-w="p70"]')).toHaveText(/^6\s?463,20\szł$/);
  await expect(page.locator('[data-w="zapas"]')).toHaveText(/^5\s?203,10\szł$/);
});

test('najwyższe zmniejszenie, zawieszenie i bez zmian', async ({ page }) => {
  await page.getByLabel('Świadczenie', { exact: true }).selectOption('renta-czesciowa');
  await page.getByLabel('Przychód w miesiącu (zł brutto)').fill('9000');
  await expect(page.locator('[data-w="stan"]')).toHaveText(/^Zmniejszenie\so\s742,10\szł$/);
  await page.getByLabel('Przychód w miesiącu (zł brutto)').fill('13000');
  await expect(page.locator('[data-w="stan"]')).toHaveText('Zawieszenie');
  await page.getByLabel('Przychód w miesiącu (zł brutto)').fill('5000');
  await expect(page.locator('[data-w="stan"]')).toHaveText('Bez zmian');
  await expect(page.locator('[data-w="opis"]')).toContainText(/1\s?463,20\szł/);
});

test('emerytura od 60/65 lat bez limitu, wcześniejsza z kwotami z 2025 r.', async ({ page }) => {
  await page.getByLabel('Świadczenie', { exact: true }).selectOption('emerytura-wiek');
  await page.getByLabel('Przychód w miesiącu (zł brutto)').fill('20000');
  await expect(page.locator('[data-w="stan"]')).toHaveText('Bez limitu');
  await expect(page.locator('[data-w="uwaga"]')).toContainText('103a');
  await page.getByLabel('Świadczenie', { exact: true }).selectOption('emerytura');
  await page.getByLabel('Okres').selectOption('2025-12-01');
  await page.getByLabel('Przychód w miesiącu (zł brutto)').fill('9000');
  await expect(page.locator('[data-w="stan"]')).toHaveText(/^Zmniejszenie\so\s939,61\szł$/);
});

test('błędny przychód', async ({ page }) => {
  await page.getByLabel('Przychód w miesiącu (zł brutto)').fill('sześć tysięcy');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.locator('[data-w="stan"]')).toHaveText('—');
  await expect(page.getByLabel('Przychód w miesiącu (zł brutto)')).toHaveAttribute('aria-invalid', 'true');
  await page.getByLabel('Przychód w miesiącu (zł brutto)').fill('6000');
  // Po poprawie atrybut znika (wspólny wzorzec, src/lib/narzedzia/formularz.ts).
  await expect(page.getByLabel('Przychód w miesiącu (zł brutto)')).not.toHaveAttribute('aria-invalid');
});

test('po powrocie przyciskiem Wstecz wynik odpowiada przywróconemu wyborowi', async ({ page }) => {
  await page.getByLabel('Świadczenie', { exact: true }).selectOption('emerytura-wiek');
  await expect(page.locator('[data-w="stan"]')).toHaveText(/^Bez\slimitu/);
  await page.goto('/narzedzia');
  await page.goBack();
  await expect(page.getByLabel('Świadczenie', { exact: true })).toHaveValue('emerytura-wiek');
  await expect(page.locator('[data-w="stan"]')).toHaveText(/^Bez\slimitu/);
});
