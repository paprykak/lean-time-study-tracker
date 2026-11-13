import { expect, test } from '@playwright/test';
import { adresNarzedzia } from '../../src/data/narzedzia';

// Dyżur i przerwy kierowcy: pensja przez wymiar miesiąca (listopad 2026 r.: 160 h), stawka godzinowa, błędne dane.
// Kwoty z niezależnego rachunku w Pythonie (src/lib/narzedzia/dyzur-kierowcy.test.ts).
const ADRES = adresNarzedzia('dyzur-kierowcy');

test.beforeEach(async ({ page }) => {
  await page.goto(ADRES);
});

test('pensja 6000 zł w listopadzie 2026 r.: 450 zł', async ({ page }) => {
  await page.locator('#dk-rok').selectOption('2026');
  await page.locator('#dk-miesiac').selectOption('11');
  await expect(page.locator('[data-w="razem"]')).toHaveText(/^450,00\szł$/);
  await expect(page.locator('[data-w="godzina"]')).toHaveText(/37,50\szł\s\(pensja\sprzez\s160\sh/);
  await expect(page.locator('[data-w="dyzur"]')).toHaveText(/150,00\szł.*albo\s4\sh\sczasu\swolnego/);
  await expect(page.locator('[data-w="przerwy"]')).toHaveText(/187,50\szł\s\(10\sh\s×\s18,75\szł/);
});

test('stawka godzinowa 31,40 zł: miesiąc znika, połowa zaokrąglona', async ({ page }) => {
  await page.getByLabel('Stawka za godzinę', { exact: true }).check();
  await expect(page.locator('[data-tylko-miesieczna]')).toBeHidden();
  await page.locator('#dk-stawka').fill('31,40');
  await page.locator('#dk-dyzur').fill('7,5');
  await page.locator('#dk-przerwy').fill('3');
  await page.locator('#dk-zaloga').fill('2,25');
  await expect(page.locator('[data-w="zaloga"]')).toHaveText(/^35,33\szł/);
  await expect(page.locator('[data-w="razem"]')).toHaveText(/^317,93\szł$/);
});

test('błędne dane: brak stawki i godziny z literami', async ({ page }) => {
  await page.locator('#dk-stawka').fill('');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.locator('[data-w="razem"]')).toHaveText('—');
  await page.locator('#dk-stawka').fill('6000');
  await page.locator('#dk-przerwy').fill('abc');
  await expect(page.locator('#dk-przerwy')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('[data-blad="dane"]')).toContainText('od 0 do 744');
});
