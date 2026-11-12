import { expect, test } from '@playwright/test';
import { NARZEDZIE_URLOP_AGENCJA } from './strony';

// Pracownik tymczasowy (art. 17 ustawy o zatrudnianiu pracowników tymczasowych): 6 miesięcy → 12 dni urlopu;
// 15 000 zł za 500 godzin → 30 zł za godzinę, 12 dni po 8 godzin → 2880 zł.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_URLOP_AGENCJA);
  await page.getByLabel('Pełne miesiące w dyspozycji użytkownika').fill('6');
  await page.getByLabel(/Wynagrodzenie brutto/).fill('15000');
  await page.getByLabel(/Godziny pracy/).fill('500');
  await page.getByLabel('Godzin w dniu pracy').fill('8');
});

test('6 miesięcy: 12 dni urlopu i 2880 zł', async ({ page }) => {
  await expect(page.locator('[data-w="dni"]')).toHaveText('12 dni');
  await expect(page.locator('[data-w="godzina"]')).toHaveText(/^30,00\szł$/);
  await expect(page.locator('[data-w="opis"]')).toHaveText(/2880,00\szł/);
});

test('zmiany 12-godzinne i 3 miesiące: 6 dni, 72 godziny, 2160 zł', async ({ page }) => {
  await page.getByLabel('Pełne miesiące w dyspozycji użytkownika').fill('3');
  await page.getByLabel('Godzin w dniu pracy').fill('12');
  await expect(page.locator('[data-w="dni"]')).toHaveText('6 dni');
  await expect(page.locator('[data-w="godziny"]')).toHaveText('72 h');
  await expect(page.locator('[data-w="opis"]')).toHaveText(/2160,00\szł/);
});

test('bez godzin pracy: błąd', async ({ page }) => {
  await page.getByLabel(/Godziny pracy/).fill('0');
  await expect(page.locator('#a-blad')).toHaveText('Wpisz godziny pracy z 3 miesięcy, na przykład 500.');
});
