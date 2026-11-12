import { expect, test } from '@playwright/test';
import { NARZEDZIE_URLOPOWE } from './strony';

// Wynagrodzenie za urlop: 1800 zł zmiennych z 480 h, 40 h urlopu → 150 zł ponad pensję.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_URLOPOWE);
});

test('1800 zł z 480 h, 40 h urlopu: 150 zł', async ({ page }) => {
  await expect(page.locator('[data-w="zmienna"]')).toHaveText('150,00 zł');
  await expect(page.locator('[data-w="za-godzine"]')).toHaveText('3,75 zł');
});

test('stawka godzinowa: 17 028 zł z 504 h, 24 h urlopu → 810,86 zł', async ({ page }) => {
  await page.getByLabel(/Składniki zmienne z\s3\smiesięcy/).fill('17028');
  await page.getByLabel('Przepracowane godziny w tych miesiącach').fill('504');
  await page.getByLabel('Godziny urlopu według grafiku').fill('24');
  await expect(page.locator('[data-w="zmienna"]')).toHaveText('810,86 zł');
});

test('brak godzin: komunikat', async ({ page }) => {
  await page.getByLabel('Przepracowane godziny w tych miesiącach').fill('0');
  await expect(page.getByText('Wpisz przepracowane godziny')).toBeVisible();
});
