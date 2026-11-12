import { expect, test } from '@playwright/test';
import { NARZEDZIE_OPIEKUNCZY } from './strony';

// Zasiłek opiekuńczy: 6000 zł, 5 dni → 690,30 zł; limit 60 dni; inny członek rodziny 14 dni.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_OPIEKUNCZY);
  await page.getByLabel('Rok', { exact: true }).selectOption('2026');
});

test('6000 zł, 5 dni: 690,30 zł', async ({ page }) => {
  await expect(page.locator('[data-w="kwota"]')).toHaveText('690,30 zł');
  await expect(page.locator('[data-w="za-dzien"]')).toHaveText('138,06 zł');
});

test('po 57 dniach w roku: płatne 3 dni, komunikat o limicie', async ({ page }) => {
  await page.getByLabel('Dni opieki').fill('7');
  await page.getByLabel('Wcześniej w roku: ten rodzaj').fill('57');
  await expect(page.locator('[data-w="dni"]')).toHaveText('3');
  await expect(page.locator('[data-w="uwaga"]')).toContainText('Za 4 dni ponad roczny limit');
});

test('inny członek rodziny: limit 14 dni', async ({ page }) => {
  await page.getByLabel('Nad kim opieka').selectOption('czlonek-rodziny');
  await page.getByLabel('Dni opieki').fill('20');
  await expect(page.locator('[data-w="dni"]')).toHaveText('14');
});
