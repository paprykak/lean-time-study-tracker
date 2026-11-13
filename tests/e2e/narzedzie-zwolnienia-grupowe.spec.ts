import { expect, test } from '@playwright/test';
import { NARZEDZIE_GRUPOWE } from './strony';

// Zwolnienia grupowe: 150 zatrudnionych, próg 15 osób; porozumienia stron liczą się od 5.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_GRUPOWE);
  await page.getByLabel('Ile osób zatrudnia pracodawca').fill('150');
});

test('12 wypowiedzeń i 6 porozumień przy 150 zatrudnionych: grupowe; 4 porozumienia: indywidualne', async ({ page }) => {
  await page.getByLabel('Wypowiedzenia').fill('12');
  await page.getByLabel('Porozumienia stron').fill('6');
  await expect(page.locator('[data-w="rodzaj"]')).toHaveText('Zwolnienie grupowe');
  await page.getByLabel('Porozumienia stron').fill('4');
  await expect(page.locator('[data-w="rodzaj"]')).toHaveText('Zwolnienie indywidualne');
  await expect(page.locator('[data-w="opis"]')).toContainText(/brakuje\s3/);
  await page.getByLabel('Ile osób zatrudnia pracodawca').fill('220');
  await expect(page.locator('[data-w="opis"]')).toContainText(/Próg:\s22\sosoby/);
});

test('terminy: urząd pracy 1 marca 2027 r., koniec umowy 31 stycznia 2027 r.', async ({ page }) => {
  await page.getByLabel('Wypowiedzenia').fill('20');
  await page.getByLabel('Zawiadomienie urzędu pracy').fill('2027-03-01');
  await page.getByLabel('Dzień rozwiązania umowy').fill('2027-01-31');
  await expect(page.locator('[data-w="urzad"]')).toContainText(/1\skwietnia\s2027/);
  await expect(page.locator('[data-w="zgloszenie"]')).toContainText(/31\sstycznia\s2028/);
  await expect(page.locator('[data-w="powrot"]')).toContainText(/30\skwietnia\s2028/);
});

test('poniżej 20 zatrudnionych ustawa nie dotyczy; błąd przy większej liczbie zwalnianych', async ({ page }) => {
  await page.getByLabel('Ile osób zatrudnia pracodawca').fill('15');
  await page.getByLabel('Wypowiedzenia').fill('10');
  await page.getByLabel('Porozumienia stron').fill('0');
  await expect(page.locator('[data-w="rodzaj"]')).toHaveText('Ustawa nie dotyczy');
  await expect(page.locator('[data-wiersz="odprawa"]')).toBeHidden();
  await page.getByLabel('Wypowiedzenia').fill('16');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
});

test('błąd danych: wiersz odprawy i uwaga znikają', async ({ page }) => {
  await page.getByLabel('Ile osób zatrudnia pracodawca').fill('150');
  await page.getByLabel('Wypowiedzenia').fill('12');
  await expect(page.locator('[data-wiersz="odprawa"]')).toBeVisible();
  await page.getByLabel('Wypowiedzenia').fill('abc');
  await expect(page.locator('#g-blad')).toHaveText('Wpisz liczby osób, bez przecinków.');
  await expect(page.locator('[data-wiersz="odprawa"]')).toBeHidden();
  await expect(page.locator('[data-w="uwaga"]')).toBeHidden();
});
