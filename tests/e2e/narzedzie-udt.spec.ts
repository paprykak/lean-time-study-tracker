import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { NARZEDZIE_UDT } from './strony';

// Ważność uprawnień UDT: termin wniosku (3 miesiące przed końcem ważności), przedłużenie od dnia upływu,
// zaświadczenia bez daty (straciły ważność 1 stycznia 2024 r.), plik .ics. Daty dalekie od dziś, żeby test był stabilny.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_UDT);
});

test('wózki (10 lat): ważne do 15.06.2029 → wniosek do 15 marca 2029 r., po przedłużeniu 2039', async ({ page }) => {
  await page.getByLabel('Rodzaj urządzenia').selectOption('o-wozki');
  await page.getByLabel('Zaświadczenie ważne do').fill('2029-06-15');
  await expect(page.locator('[data-w="termin"]')).toHaveText('15 marca 2029 r.');
  await expect(page.locator('[data-w="po-przedluzeniu"]')).toHaveText('15 czerwca 2039 r. (o 10 lat od końca ważności)');
  await expect(page.locator('[data-w="status"]')).toHaveAttribute('data-status', 'w-terminie');
});

test('podesty przejezdne (5 lat): przedłużenie o 5 lat', async ({ page }) => {
  await page.getByLabel('Rodzaj urządzenia').selectOption('o-podesty-przejezdne');
  await expect(page.locator('[data-w="rodzaj-opis"]')).toHaveText('Podesty ruchome przejezdne. Zaświadczenie ważne 5 lat.');
  await page.getByLabel('Zaświadczenie ważne do').fill('2030-08-31');
  await expect(page.locator('[data-w="termin"]')).toHaveText('31 maja 2030 r.');
  await expect(page.locator('[data-w="po-przedluzeniu"]')).toContainText('31 sierpnia 2035 r.');
});

test('zaświadczenie bez daty: straciło ważność 1 stycznia 2024 r.', async ({ page }) => {
  await page.getByLabel('Nie ma daty (wydane przed 1 czerwca 2019 r.)').check();
  await expect(page.getByLabel('Zaświadczenie ważne do')).toBeHidden();
  await expect(page.locator('[data-w="termin"]')).toHaveText('1 stycznia 2024 r.');
  await expect(page.locator('[data-w="uwaga"]')).toContainText('trzeba ponownie zdać egzamin');
});

test('data z przeszłości: wygasło, bez pliku kalendarza', async ({ page }) => {
  await page.getByLabel('Zaświadczenie ważne do').fill('2025-01-10');
  await expect(page.locator('[data-w="status"]')).toContainText('Wygasło');
  await expect(page.getByRole('button', { name: 'Dodaj do kalendarza (.ics)' })).toBeDisabled();
});

test('plik .ics z terminem wniosku', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'Pobieranie plików w WebKit Playwright obsługuje inaczej; logikę pliku sprawdzają testy jednostkowe.');
  await page.getByLabel('Zaświadczenie ważne do').fill('2029-06-15');
  const [pobranie] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Dodaj do kalendarza (.ics)' }).click()]);
  expect(pobranie.suggestedFilename()).toBe('uprawnienia-udt.ics');
  const tresc = readFileSync((await pobranie.path())!, 'utf8');
  expect(tresc).toContain('DTSTART;VALUE=DATE:20290315');
  expect(tresc).toContain('DTSTART;VALUE=DATE:20290615');
});

test.describe('bez JavaScriptu', () => {
  test.use({ javaScriptEnabled: false });
  test('tabele okresów ważności są w HTML', async ({ page }) => {
    await page.goto(NARZEDZIE_UDT);
    await expect(page.locator('#ile-lat ~ .tabela tr', { hasText: 'Układnice' }).first()).toContainText('10 lat');
    await expect(page.locator('#konserwacja ~ .tabela tr', { hasText: 'Wózki jezdniowe podnośnikowe' }).first()).toContainText('5 lat');
  });
});
