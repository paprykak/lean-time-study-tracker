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
