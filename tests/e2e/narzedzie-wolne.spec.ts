import { expect, test } from '@playwright/test';
import { NARZEDZIE_WOLNE } from './strony';

// Wolne na dziecko: pełny etat 16 h, pół etatu 8 h, 3/5 etatu 10 h (9,6 w górę), norma 7 h → 14 h.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_WOLNE);
});

test('pełny etat: 2 dni albo 16 h', async ({ page }) => {
  await expect(page.locator('[data-w="dziecko"]')).toHaveText('2 dni albo 16 h');
});

test('3/5 etatu: 10 h (zaokrąglenie w górę), siła wyższa tak samo', async ({ page }) => {
  await page.getByLabel('Wymiar etatu').selectOption('0.6');
  await expect(page.locator('[data-w="dziecko"]')).toHaveText('2 dni albo 10 h');
  await expect(page.locator('[data-w="sila"]')).toContainText('2 dni albo 10 h, płatne 50%');
});

test('norma 7 godzin: 14 h', async ({ page }) => {
  await page.getByLabel('Dobowa norma czasu pracy').selectOption('7');
  await expect(page.locator('[data-w="dziecko"]')).toHaveText('2 dni albo 14 h');
});
