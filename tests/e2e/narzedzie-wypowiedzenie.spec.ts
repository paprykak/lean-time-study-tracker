import { expect, test } from '@playwright/test';
import { NARZEDZIE_WYPOWIEDZENIE } from './strony';

// Okres wypowiedzenia: miesiące do końca miesiąca (przykład gov.pl), tygodnie do soboty, okres próbny.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_WYPOWIEDZENIE);
});

test('staż 4 lata, doręczenie 22 lipca 2026: 3 miesiące do 31 października, 3 dni na szukanie pracy', async ({ page }) => {
  await page.getByLabel('Początek pracy u tego pracodawcy').fill('2022-03-01');
  await page.getByLabel('Doręczenie wypowiedzenia').fill('2026-07-22');
  await expect(page.locator('[data-w="koniec"]')).toHaveText('31 października 2026 r. (sobota)');
  await expect(page.locator('[data-w="okres"]')).toHaveText('3 miesiące');
  await expect(page.locator('[data-w="poszukiwanie"]')).toHaveText('3 dni robocze, płatne');
});

test('staż 3 miesiące, doręczenie w poniedziałek: 2 tygodnie do trzeciej soboty', async ({ page }) => {
  await page.getByLabel('Początek pracy u tego pracodawcy').fill('2026-08-01');
  await page.getByLabel('Doręczenie wypowiedzenia').fill('2026-11-09');
  await expect(page.locator('[data-w="koniec"]')).toHaveText('28 listopada 2026 r. (sobota)');
  await page.getByLabel('Pracownik', { exact: true }).check();
  await expect(page.locator('[data-w="poszukiwanie"]')).toHaveText('nie przysługują (wypowiada pracownik)');
});

test('okres próbny ponad 2 tygodnie: 1 tydzień do soboty', async ({ page }) => {
  await page.getByLabel('Rodzaj umowy').selectOption('probna-ponad-2tyg');
  await expect(page.getByLabel('Początek pracy u tego pracodawcy')).toBeHidden();
  await page.getByLabel('Doręczenie wypowiedzenia').fill('2026-11-11');
  await expect(page.locator('[data-w="koniec"]')).toHaveText('21 listopada 2026 r. (sobota)');
});

test('początek po doręczeniu: komunikat', async ({ page }) => {
  await page.getByLabel('Początek pracy u tego pracodawcy').fill('2026-12-01');
  await page.getByLabel('Doręczenie wypowiedzenia').fill('2026-11-09');
  await expect(page.getByText('Początek pracy musi być przed doręczeniem wypowiedzenia.')).toBeVisible();
});
