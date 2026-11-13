import { expect, test } from '@playwright/test';
import { adresNarzedzia } from '../../src/data/narzedzia';

// PIT-37 (art. 6, 22 ust. 2, 26, 27, 27f ustawy o PIT; wartości z niezależnego rachunku w Pythonie): płaca minimalna
// 2025 r. przez rok → dopłata 2 zł; dwoje dzieci → zwrot 2222,28 zł; jedno źródło dochodu w małżeństwie, 150 000 zł →
// osobno zwrot 4141 zł, wspólnie 9028 zł.
test.beforeEach(async ({ page }) => {
  await page.goto(adresNarzedzia('zwrot-podatku-pit-37'));
  await page.getByLabel('Rok podatkowy').selectOption('2025');
});

test('płaca minimalna 2025 r.: dopłata 2 zł; dwoje dzieci: zwrot', async ({ page }) => {
  await expect(page.locator('[data-w="wynik"]')).toHaveText(/^Dopłata\s2,00\szł$/);
  await expect(page.locator('[data-w="podstawa"]')).toHaveText(/^45\s?315,00\szł$/);
  await page.getByLabel('Dzieci przez cały rok').selectOption('2');
  await expect(page.locator('[data-w="wynik"]')).toHaveText(/^Zwrot\s2\s?222,28\szł$/);
  await expect(page.locator('[data-w="opis"]')).toContainText(/386,28\szł/);
});

test('małżeństwo: porównanie i rozliczenie wspólne', async ({ page }) => {
  await page.getByLabel('Sytuacja w roku').selectOption('malzenstwo');
  await page.getByLabel('Przychód z umowy o pracę (zł)', { exact: true }).fill('150000');
  await page.getByLabel('Składki społeczne (do odliczenia) (zł)', { exact: true }).fill('20565');
  await page.getByLabel('Składka zdrowotna (zł)', { exact: true }).fill('11648,66');
  await page.getByLabel('Zaliczki pobrane przez płatnika (zł)', { exact: true }).fill('17000');
  await expect(page.locator('[data-w="porownanie"]')).toContainText('Wpisz dane małżonka');
  await page.locator('#m-przychodPraca').fill('0');
  await expect(page.locator('[data-w="wynik"]')).toHaveText(/^Zwrot\s4\s?141,00\szł$/);
  await expect(page.locator('[data-w="porownanie"]')).toContainText(/Rozliczenie wspólne daje rodzinie 4\s?887,00\szł więcej/);
  await page.getByLabel('Rozliczenie').selectOption('wspolnie');
  await expect(page.locator('[data-w="wynik"]')).toHaveText(/^Zwrot\s9\s?028,00\szł$/);
});

test('błędna kwota', async ({ page }) => {
  await page.getByLabel('Zaliczki pobrane przez płatnika (zł)', { exact: true }).fill('dużo');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.locator('[data-w="wynik"]')).toHaveText('—');
});
