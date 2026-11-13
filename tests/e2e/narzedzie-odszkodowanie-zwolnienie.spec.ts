import { expect, test } from '@playwright/test';
import { NARZEDZIE_ODSZKODOWANIE } from './strony';

// Odszkodowanie za zwolnienie (art. 47¹, 50 § 1, 58 Kp): pensja 6000 zł.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_ODSZKODOWANIE);
  await page.getByLabel(/Pensja brutto/).fill('6000');
});

test('wypowiedzenie, miesiąc: od 6000 do 18 000 zł', async ({ page }) => {
  await page.getByLabel('Okres wypowiedzenia').selectOption('1m');
  await expect(page.locator('[data-w="kwota"]')).toHaveText(/^od\s6000,00\szł\sdo\s18\s000,00\szł$/);
  await expect(page.locator('[data-w="polowa"]')).toBeHidden();
});

test('wypowiedzenie, 2 tygodnie: od połowy pensji i uwaga o § 2 ust. 2', async ({ page }) => {
  await page.getByLabel('Okres wypowiedzenia').selectOption('2t');
  await expect(page.locator('[data-w="kwota"]')).toHaveText(/^od\s3000,00\szł\sdo\s18\s000,00\szł$/);
  await expect(page.locator('[data-w="polowa"]')).toBeVisible();
});

test('dyscyplinarka, 3 miesiące: 18 000 zł i powrót od 1 do 3 miesięcy', async ({ page }) => {
  await page.getByLabel('Co się stało').selectOption('dyscyplinarka');
  await page.getByLabel('Okres wypowiedzenia').selectOption('3m');
  await expect(page.locator('[data-w="kwota"]')).toHaveText(/^18\s000,00\szł$/);
  await expect(page.locator('[data-w="przywrocenie"]')).toContainText('od 1 do 3 miesięcy');
});

test('umowa na czas określony pyta o dni pracy do końca umowy', async ({ page }) => {
  await page.getByLabel('Umowa', { exact: true }).selectOption('okreslona');
  await expect(page.getByLabel('Dni pracy do końca umowy')).toBeVisible();
  await expect(page.locator('[data-wiersz="koniec"]')).toBeVisible();
});

test('okres próbny: tylko dni do końca okresu, bez powrotu do pracy', async ({ page }) => {
  await page.getByLabel('Co się stało').selectOption('probny');
  await expect(page.getByLabel('Dni pracy do końca okresu próbnego')).toBeVisible();
  await expect(page.getByLabel('Okres wypowiedzenia')).toBeHidden();
  await expect(page.locator('[data-wiersz="przywrocenie"]')).toBeHidden();
  await page.getByLabel('Dni pracy do końca okresu próbnego').fill('5');
  await expect(page.locator('[data-w="kwota"]')).toHaveText(/^\d[\d\s]*,\d{2}\szł$/);
});

test('bez pensji: błąd', async ({ page }) => {
  await page.getByLabel(/Pensja brutto/).fill('');
  await expect(page.locator('#o-blad')).toHaveText('Wpisz pensję brutto, na przykład 6000.');
  await expect(page.locator('[data-w="kwota"]')).toHaveText('—');
});
