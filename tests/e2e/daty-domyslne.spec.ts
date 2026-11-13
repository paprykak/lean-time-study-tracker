import { expect, test } from '@playwright/test';

// Audyt jakości 2: daty domyślne formularzy liczone w przeglądarce od prawdziwego dziś, a nie od dnia budowania
// (prompty/02-fabryka.md, sekcja 4, zasada 11). Zegar przestawiony na dzień po Nowym Roku.

test('doba pracownicza: najbliższy poniedziałek od dziś (środa 13.01.2027 → 18.01.2027)', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-01-13T10:00:00+01:00'));
  await page.goto('/narzedzia/doba-pracownicza');
  await expect(page.locator('[name="start"]')).toHaveValue('2027-01-18');
});

test('doba pracownicza: w poniedziałek ten sam dzień', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-01-18T10:00:00+01:00'));
  await page.goto('/narzedzia/doba-pracownicza');
  await expect(page.locator('[name="start"]')).toHaveValue('2027-01-18');
});

test('urlop w okresie wypowiedzenia: od dziś do końca miesiąca (10.02.2027)', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-02-10T10:00:00+01:00'));
  await page.goto('/narzedzia/urlop-w-okresie-wypowiedzenia');
  await expect(page.locator('#uw-od')).toHaveValue('2027-02-10');
  await expect(page.locator('#uw-koniec')).toHaveValue('2027-02-28');
  await expect(page.locator('label[for="uw-wykorzystane"]')).toContainText(/2027\sr\./);
  await expect(page.locator('[data-w="dni-pracy"]')).toContainText(/^13\sdni/);
  await expect(page.locator('[data-w="proporcjonalny"]')).toContainText(/^5\sdni/);
});

test('okres wyczekiwania: początek ubezpieczenia 10 dni przed dziś (20.01.2027 → 10.01.2027)', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-01-20T10:00:00+01:00'));
  await page.goto('/narzedzia/okres-wyczekiwania');
  await expect(page.locator('#w-start')).toHaveValue('2027-01-10');
  await expect(page.locator('[data-w="prawo"]')).toHaveText(/^9\slutego\s2027\sr\.$/);
});

test('wynagrodzenie za niepełny miesiąc: bieżący miesiąc i rok (10.02.2027)', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-02-10T10:00:00+01:00'));
  await page.goto('/narzedzia/wynagrodzenie-za-niepelny-miesiac');
  await expect(page.locator('#n-rok')).toHaveValue('2027');
  await expect(page.locator('#n-miesiac')).toHaveValue('2');
});

test('dodatek wyrównawczy: rozliczenie za bieżący miesiąc, przeniesienie od 1. dnia poprzedniego (15.01.2027)', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-01-15T10:00:00+01:00'));
  await page.goto('/narzedzia/dodatek-wyrownawczy');
  await expect(page.locator('#d-rok')).toHaveValue('2027');
  await expect(page.locator('#d-miesiac')).toHaveValue('1');
  await expect(page.locator('#d-od')).toHaveValue('2026-12-01');
});
