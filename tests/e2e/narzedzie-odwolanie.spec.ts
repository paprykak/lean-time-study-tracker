import { expect, test } from '@playwright/test';
import { NARZEDZIE_ODWOLANIE } from './strony';

// Terminy z art. 264 i 97 § 2¹ Kp liczone według art. 111 § 2 i 115 KC (wartości jak w termin-odwolania.test.ts).
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_ODWOLANIE);
});

test('wypowiedzenie doręczone 12 listopada 2026 r.: do 3 grudnia', async ({ page }) => {
  await page.getByLabel('Sprawa', { exact: true }).selectOption('wypowiedzenie');
  await page.locator('#o-data').fill('2026-11-12');
  await expect(page.locator('[data-w="koniec"]')).toHaveText(/^3\sgrudnia\s2026\sr\.$/);
  await expect(page.locator('[data-w="przesuniecie"]')).toHaveText('brak');
});

test('dyscyplinarka 3 grudnia 2026 r.: koniec przesunięty przez święta na 28 grudnia', async ({ page }) => {
  await page.getByLabel('Sprawa', { exact: true }).selectOption('bez-wypowiedzenia');
  await page.locator('#o-data').fill('2026-12-03');
  await expect(page.locator('[data-w="koniec"]')).toHaveText(/^28\sgrudnia\s2026\sr\.$/);
  await expect(page.locator('[data-w="przesuniecie"]')).toContainText('Wigilia Bożego Narodzenia');
});

test('sprostowanie świadectwa: 14 dni u pracodawcy', async ({ page }) => {
  await page.getByLabel('Sprawa', { exact: true }).selectOption('sprostowanie-wniosek');
  await expect(page.locator('label[for="o-data"]')).toHaveText('Dzień otrzymania świadectwa pracy');
  await page.locator('#o-data').fill('2026-11-12');
  await expect(page.locator('[data-w="koniec"]')).toHaveText(/^26\slistopada\s2026\sr\.$/);
  await expect(page.locator('[data-w="gdzie"]')).toHaveText('pracodawca');
});

test('sprzeciw od kary po terminie: bez obietnicy przywrócenia terminu z art. 265', async ({ page }) => {
  await page.getByLabel('Sprawa', { exact: true }).selectOption('kara-sprzeciw');
  await page.locator('#o-data').fill('2026-10-01');
  await expect(page.locator('[data-w="status"]')).toHaveText(/nie\sprzewiduje\sprzywrócenia/);
  await page.getByLabel('Sprawa', { exact: true }).selectOption('wypowiedzenie');
  await expect(page.locator('[data-w="status"]')).toContainText(/art\.\s265/);
});

test('krótkie opcje listy spraw (telefon), pełna nazwa pod polem', async ({ page }) => {
  for (const tekst of await page.getByLabel('Sprawa', { exact: true }).locator('option').allTextContents()) expect(tekst.length).toBeLessThanOrEqual(28);
  await page.getByLabel('Sprawa', { exact: true }).selectOption('bez-wypowiedzenia');
  await expect(page.locator('[data-w="sprawa-opis"]')).toHaveText(/Zwolnienie\sbez\swypowiedzenia\salbo\swygaśnięcie\sumowy/);
});

test('strona sprzed Nowego Roku otwarta 5 stycznia 2027 r.: dzień doręczenia to dziś', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-01-05T10:00:00+01:00'));
  await page.goto(NARZEDZIE_ODWOLANIE);
  await expect(page.locator('#o-data')).toHaveValue('2027-01-05');
  await expect(page.locator('[data-w="status"]')).toHaveText(/Zostało\s21\sdni/);
});
