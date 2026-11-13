import { expect, test } from '@playwright/test';
import { NARZEDZIE_WYPLATA_DODATKI } from './strony';

// Listopad 2026 r. (160 h): 6000 zł, 10 nadgodzin 50%, 40 h w nocy → 6802,90 zł brutto, 4967,91 zł na rękę.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_WYPLATA_DODATKI);
  await page.getByLabel('Rok', { exact: true }).selectOption('2026');
  await page.getByLabel('Miesiąc', { exact: true }).selectOption('11');
  await page.getByLabel('Pensja zasadnicza brutto (zł)').fill('6000');
  await page.getByLabel(/dodatkiem\s50%/).fill('10');
  await page.getByLabel(/dodatkiem\s100%/).fill('0');
  await page.getByLabel('Godziny pracy w nocy').fill('40');
});

test('na rękę 4967,91 zł, z dodatków 547,48 zł', async ({ page }) => {
  await expect(page.locator('[data-w="netto"]')).toHaveText(/^4967,91\szł$/);
  await expect(page.locator('[data-w="brutto"]')).toHaveText(/^6802,90\szł$/);
  await expect(page.locator('[data-w="dodatki"]')).toHaveText(/^547,48\szł$/);
});

test('błędne godziny: komunikat', async ({ page }) => {
  await page.getByLabel('Godziny pracy w nocy').fill('abc');
  await expect(page.locator('[data-blad="dane"]')).toContainText('Godziny');
});

test('godziny nocne: najwyżej 8 na dobę, w lutym 2027 r. 224 godziny', async ({ page }) => {
  await page.getByLabel('Rok', { exact: true }).selectOption('2027');
  await page.getByLabel('Miesiąc', { exact: true }).selectOption('2');
  await page.getByLabel('Godziny pracy w nocy').fill('225');
  await expect(page.locator('[data-blad="dane"]')).toHaveText(/najwyżej 224\sgodziny/);
  await expect(page.locator('[data-w="netto"]')).toHaveText('—');
  await page.getByLabel('Godziny pracy w nocy').fill('224');
  await expect(page.locator('[data-blad="dane"]')).toBeHidden();
  await expect(page.locator('[data-w="netto"]')).not.toHaveText('—');
});

test('wysoka wypłata: miesiąc przekroczenia progu 120 000 zł', async ({ page }) => {
  await page.getByLabel('Pensja zasadnicza brutto (zł)').fill('20000');
  await page.getByLabel('Godziny pracy w nocy').fill('0');
  await expect(page.locator('[data-w="uwaga"]')).toContainText(/120\s000\szł w\slipcu/);
});

test('rok i miesiąc przestawiają się na dziś w przeglądarce', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-01-05T10:00:00+01:00'));
  await page.goto(NARZEDZIE_WYPLATA_DODATKI);
  await expect(page.getByLabel('Rok', { exact: true })).toHaveValue('2027');
  await expect(page.getByLabel('Miesiąc', { exact: true })).toHaveValue('1');
});
