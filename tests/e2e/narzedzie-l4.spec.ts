import { expect, test } from '@playwright/test';
import { NARZEDZIE_L4 } from './strony';

// Kalkulator L4: 6000 zł, 10 dni → 1380,60 zł; podział pracodawca/ZUS; 100% w ciąży; minimum z płacy minimalnej.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_L4);
  await page.getByLabel('Rok zwolnienia').selectOption('2026');
});

test('6000 zł, 10 dni choroby: 1380,60 zł od pracodawcy', async ({ page }) => {
  await expect(page.locator('[data-w="razem"]')).toHaveText('1380,60 zł');
  await expect(page.locator('[data-w="za-dzien"]')).toHaveText('138,06 zł (80%)');
  await expect(page.locator('[data-w="zus"]')).toHaveText('0 dni: 0,00 zł');
});

test('po 30 dniach w roku: 3 dni od pracodawcy, 7 z ZUS, komunikat', async ({ page }) => {
  await page.getByLabel('Dni L4 w tym roku przed tym zwolnieniem').fill('30');
  await expect(page.locator('[data-w="pracodawca"]')).toHaveText('3 dni: 414,18 zł');
  await expect(page.locator('[data-w="zus"]')).toHaveText('7 dni: 966,42 zł');
  await expect(page.locator('[data-w="uwaga"]')).toBeVisible();
});

test('ciąża: 100%', async ({ page }) => {
  await page.getByLabel('Powód niezdolności do pracy').selectOption('ciaza');
  await expect(page.locator('[data-w="za-dzien"]')).toHaveText('172,58 zł (100%)');
});

test('niska pensja na pełnym etacie: minimum z płacy minimalnej', async ({ page }) => {
  await page.getByLabel('Przeciętne wynagrodzenie brutto z 12 miesięcy (zł)').fill('4000');
  await expect(page.locator('[data-w="podstawa"]')).toHaveText('4147,10 zł (minimum z płacy minimalnej)');
});

test('ponad 182 dni: komunikat', async ({ page }) => {
  await page.getByLabel('Dni zwolnienia').fill('200');
  await expect(page.getByText('Wpisz liczbę dni zwolnienia od 1 do 182.')).toBeVisible();
});
