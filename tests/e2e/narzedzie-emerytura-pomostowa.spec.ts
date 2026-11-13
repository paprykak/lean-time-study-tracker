import { expect, test } from '@playwright/test';
import { adresNarzedzia } from '../../src/data/narzedzia';

// Daty urodzenia tak dobrane, że wynik nie zależy od dnia testu (do 2030 r.): mężczyzna ur. 1966-05-20, 16 lat pracy
// z wykazu, staż 30 → spełnia (60 lat 20 maja 2026 r., najdłużej do 20 maja 2031 r.); kobieta ur. 1990-03-01 → wiek
// 55 lat 1 marca 2045 r.; ur. 1948-12-31 → rocznik; 5 lat pracy z wykazu i 2 lata do 65 → nie zdąży.
test.beforeEach(async ({ page }) => {
  await page.goto(adresNarzedzia('emerytura-pomostowa'));
  await page.getByLabel('Data urodzenia').fill('1966-05-20');
});

test('mężczyzna, 16 lat pracy z wykazu, staż 30 lat: spełnia warunki', async ({ page }) => {
  await expect(page.locator('[data-w="stan"]')).toHaveText('Spełniasz warunki');
  await expect(page.locator('[data-w="praca"]')).toHaveText(/^tak:\s16\slat\sz\swymaganych\s15\slat$/);
  await expect(page.locator('[data-w="koniec"]')).toHaveText(/^20\smaja\s2031\sr\.$/);
  await expect(page.locator('[data-w="uwaga"]')).toContainText('103a');
});

test('kobieta przed 55. urodzinami: data, od której spełni warunki', async ({ page }) => {
  await page.getByLabel('Płeć').selectOption('k');
  await page.getByLabel('Data urodzenia').fill('1990-03-01');
  await page.getByLabel('Praca z wykazu (lata)').fill('15');
  await page.getByLabel('Staż w ZUS (lata)').fill('20');
  await expect(page.locator('[data-w="stan"]')).toHaveText(/^Od\s1\smarca\s2045\sr\.$/);
  await expect(page.locator('[data-w="wiek"]')).toHaveText(/^55\slat:\s1\smarca\s2045\sr\.$/);
});

test('hutnictwo, rocznik 1948 i brak czasu na uzbieranie okresów', async ({ page }) => {
  await page.getByLabel('Rodzaj prac').selectOption('hutnictwo');
  await expect(page.locator('[data-w="uwaga"]')).toContainText('ogólne zasady z art. 4');
  await page.getByLabel('Z tego w hutnictwie, pkt 4–12 (lata)').fill('16');
  await expect(page.locator('[data-w="uwaga"]')).toContainText('lekarza medycyny pracy');
  await page.getByLabel('Data urodzenia').fill('1948-12-31');
  await expect(page.locator('[data-w="stan"]')).toHaveText('Nie przysługuje');
  await page.getByLabel('Rodzaj prac').selectOption('ogolne');
  await page.getByLabel('Data urodzenia').fill('1964-01-01');
  await page.getByLabel('Praca z wykazu (lata)').fill('5');
  await expect(page.locator('[data-w="stan"]')).toHaveText(/^Nie\szdążysz$/);
});

test('rekompensata przy 15 latach przed 2009 r. i błędne dane', async ({ page }) => {
  await page.getByLabel('Data urodzenia').fill('1964-01-01');
  await page.getByLabel('Praca z wykazu (lata)').fill('15');
  await page.getByLabel('Z tego przed 2009 r.').fill('15');
  await page.getByLabel('Staż w ZUS (lata)').fill('20');
  await expect(page.locator('[data-w="uwaga"]')).toContainText('rekompensaty');
  await page.getByLabel('Z tego przed 2009 r.').fill('16');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.locator('[data-w="stan"]')).toHaveText('—');
  await page.getByLabel('Z tego przed 2009 r.').fill('piętnaście');
  await expect(page.locator('[data-blad="dane"]')).toContainText('w latach');
});
