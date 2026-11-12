import { expect, test } from '@playwright/test';
import { NARZEDZIE_LOJALKA } from './strony';

// Lojalka: 5000 zł, nauka do 31 marca 2026 r., zobowiązanie 24 miesiące (731 dni), odejście 15 stycznia 2027 r.:
// zwrot za 441 z 731 dni, 3016,42 zł.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_LOJALKA);
  await page.getByLabel(/Koszt opłacony/).fill('5000');
  await page.getByLabel('Koniec nauki').fill('2026-03-31');
  await page.getByLabel(/Zobowiązanie/).fill('24');
  await page.getByLabel('Ostatni dzień pracy').fill('2027-01-15');
});

test('wypowiedzenie pracownika: 3016,42 zł, zobowiązanie do 31 marca 2028 r.', async ({ page }) => {
  await expect(page.locator('[data-w="kwota"]')).toHaveText(/^3016,42\szł$/);
  await expect(page.locator('[data-w="koniec"]')).toHaveText(/31\smarca\s2028/);
  await expect(page.locator('[data-w="opis"]')).toContainText(/441\sz\s731\sdni/);
});

test('wypowiedzenie przez pracodawcę i koniec zobowiązania: 0 zł', async ({ page }) => {
  await page.getByLabel('Jak kończy się umowa').selectOption('wypowiedzenie-pracodawcy');
  await expect(page.locator('[data-w="kwota"]')).toHaveText(/^0,00\szł$/);
  await page.getByLabel('Jak kończy się umowa').selectOption('dyscyplinarka');
  await page.getByLabel('Ostatni dzień pracy').fill('2028-04-01');
  await expect(page.locator('[data-w="kwota"]')).toHaveText(/^0,00\szł$/);
});

test('zobowiązanie ponad 3 lata to błąd', async ({ page }) => {
  await page.getByLabel(/Zobowiązanie/).fill('40');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.locator('[data-w="kwota"]')).toHaveText('—');
});
