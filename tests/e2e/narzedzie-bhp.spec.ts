import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { NARZEDZIE_BHP } from './strony';

// Termin szkolenia okresowego BHP: daty liczone od stałej daty ostatniego szkolenia (termin nie zależy od dziś),
// status zależy od dziś, więc sprawdzamy go na datach dalekich od granic progów. Plik .ics: pobranie i treść.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_BHP);
});

test('robotnik: ostatnie szkolenie 15.03.2024 → 15 marca 2027 r.', async ({ page }) => {
  await page.getByLabel('Stanowisko', { exact: true }).selectOption('robotnicze');
  await page.getByLabel('Data ostatniego szkolenia okresowego (z zaświadczenia)').fill('2024-03-15');
  await expect(page.locator('[data-w="termin"]')).toHaveText('15 marca 2027 r.');
  await expect(page.locator('[data-w="czestotliwosc"]')).toHaveText('nie rzadziej niż raz na 3 lata');
});

test('prace szczególnie niebezpieczne: dawne szkolenie → po terminie', async ({ page }) => {
  await page.getByLabel('Stanowisko', { exact: true }).selectOption('robotnicze-szczegolnie-niebezpieczne');
  await page.getByLabel('Data ostatniego szkolenia okresowego (z zaświadczenia)').fill('2020-05-10');
  await expect(page.locator('[data-w="termin"]')).toHaveText('10 maja 2021 r.');
  await expect(page.locator('[data-w="status"]')).toHaveAttribute('data-status', 'po-terminie');
  await expect(page.locator('[data-w="status"]')).toContainText('Po terminie');
});

test('pierwsze szkolenie kierownika: 6 miesięcy od 31.08 → koniec lutego', async ({ page }) => {
  await page.getByLabel('Stanowisko', { exact: true }).selectOption('kierujacy');
  await page.getByLabel('Jeszcze nie było: podam datę rozpoczęcia pracy').check();
  await page.getByLabel('Data rozpoczęcia pracy na tym stanowisku').fill('2025-08-31');
  await expect(page.locator('[data-w="termin"]')).toHaveText('28 lutego 2026 r.');
  await expect(page.locator('[data-w="naglowek"]')).toHaveText('Pierwsze szkolenie okresowe najpóźniej');
});

test('biuro z kategorią ryzyka do 3: szkolenie niewymagane, pole tylko dla biura', async ({ page }) => {
  const zgoda = page.getByLabel(/kategorię ryzyka nie wyższą niż 3/);
  await expect(zgoda).toBeHidden();
  await page.getByLabel('Stanowisko', { exact: true }).selectOption('administracyjno-biurowe');
  await zgoda.check();
  await expect(page.locator('[data-w="termin"]')).toHaveText('Nie jest wymagane');
  await expect(page.getByRole('button', { name: 'Dodaj do kalendarza (.ics)' })).toBeDisabled();
});

test('data z przyszłości przy kolejnym szkoleniu: komunikat i aria-invalid', async ({ page }) => {
  const pole = page.getByLabel('Data ostatniego szkolenia okresowego (z zaświadczenia)');
  await pole.fill('2099-01-01');
  await expect(page.getByText('Ta data jest w przyszłości.')).toBeVisible();
  await expect(pole).toHaveAttribute('aria-invalid', 'true');
});

test('plik .ics: pobranie z wydarzeniem w dniu terminu', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'Pobieranie plików w WebKit Playwright obsługuje inaczej; logikę pliku sprawdzają testy jednostkowe.');
  await page.getByLabel('Data ostatniego szkolenia okresowego (z zaświadczenia)').fill('2024-03-15');
  const [pobranie] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Dodaj do kalendarza (.ics)' }).click()]);
  expect(pobranie.suggestedFilename()).toBe('szkolenie-okresowe-bhp.ics');
  const tresc = readFileSync((await pobranie.path())!, 'utf8');
  expect(tresc).toContain('BEGIN:VCALENDAR');
  expect(tresc).toContain('DTSTART;VALUE=DATE:20270315');
});

test.describe('bez JavaScriptu', () => {
  test.use({ javaScriptEnabled: false });
  test('tabela częstotliwości jest w HTML', async ({ page }) => {
    await page.goto(NARZEDZIE_BHP);
    const wiersz = page.locator('#co-ile ~ .tabela tr', { hasText: 'Stanowisko robotnicze z pracami szczególnie niebezpiecznymi' });
    await expect(wiersz).toContainText('co rok');
    await expect(page.locator('#co-ile ~ .tabela tr', { hasText: 'Pracodawca albo osoba kierująca' })).toContainText('do 6 miesięcy');
  });
});
