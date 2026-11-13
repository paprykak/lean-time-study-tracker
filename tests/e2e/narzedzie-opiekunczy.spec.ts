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
  await expect(page.locator('[data-w="uwaga"]')).toContainText(/Za\s4\sdni\sponad\sroczny\slimit/);
});

test('inny członek rodziny: limit 14 dni', async ({ page }) => {
  await page.getByLabel('Nad kim opieka').selectOption('czlonek-rodziny');
  await page.getByLabel('Dni opieki').fill('20');
  await expect(page.locator('[data-w="dni"]')).toHaveText('14');
});

test('członek rodziny po 20 dniach opieki nad dzieckiem z orzeczeniem: łącznie 30 dni, płatne 10', async ({ page }) => {
  await page.getByLabel('Nad kim opieka').selectOption('czlonek-rodziny');
  await page.getByLabel('Dni opieki').fill('14');
  await page.getByLabel('Wcześniej w roku: łącznie').fill('20');
  await expect(page.locator('[data-w="dni"]')).toHaveText('10');
  await page.getByLabel(/W\stym\sopieka\snad\sdzieckiem\sdo\s14\slat/).check();
  await expect(page.locator('[data-w="dni"]')).toHaveText('14');
});

test('krótkie opcje listy z pełnym opisem pod polem', async ({ page }) => {
  for (const tekst of await page.getByLabel('Nad kim opieka').locator('option').allTextContents()) expect(tekst.length).toBeLessThanOrEqual(28);
  await page.getByLabel('Nad kim opieka').selectOption('dziecko-orzeczenie');
  await expect(page.locator('[data-w="rodzaj-opis"]')).toContainText(/od\s14\sdo\s18\slat/);
});
