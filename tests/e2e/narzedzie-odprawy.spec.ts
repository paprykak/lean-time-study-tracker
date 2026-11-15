import { expect, test } from '@playwright/test';
import { NARZEDZIE_ODPRAWA } from './strony';

// Odprawa: 6000 zł i staż 5 lat → 2 pensje; ponad 8 lat → 3; limit 15 płac minimalnych; emerytalna 1 pensja.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_ODPRAWA);
});

test('staż 5 lat: 2 pensje, 12 000 zł', async ({ page }) => {
  await page.getByLabel('Początek pracy u tego pracodawcy').fill('2021-06-01');
  await page.getByLabel('Dzień rozwiązania umowy').fill('2026-11-30');
  await expect(page.locator('[data-w="kwota"]')).toHaveText(/^12\s000,00\szł$/);
  await expect(page.locator('[data-w="miesiecy"]')).toHaveText(/^2\s\(staż\sod\s2\sdo\s8\slat\)$/);
});

test('wysoka pensja i 16 lat: obcięta do 72 090 zł', async ({ page }) => {
  await page.getByLabel('Początek pracy u tego pracodawcy').fill('2010-01-01');
  await page.getByLabel('Dzień rozwiązania umowy').fill('2026-11-30');
  await page.getByLabel('Pensja i stałe dodatki miesięcznie (zł brutto)').fill('30000');
  await expect(page.locator('[data-w="kwota"]')).toHaveText(/^72\s090,00\szł$/);
  await expect(page.locator('[data-w="uwaga"]')).toBeVisible();
});

test('emerytalna: jedna pensja z premiami, bez pól dat', async ({ page }) => {
  await page.getByLabel('Przejście na emeryturę albo rentę').check();
  await expect(page.getByLabel('Początek pracy u tego pracodawcy')).toBeHidden();
  await page.getByLabel('Średnia premii i dodatków zmiennych z 3 miesięcy (zł)').fill('500');
  await expect(page.locator('[data-w="kwota"]')).toHaveText(/^6500,00\szł$/);
});

test('wyłączny powód i odmowa nowych warunków: orzecznictwo SN z sygnaturami i linkiem w akapitach po nagłówku „Kiedy przysługuje”', async ({ page }) => {
  const sekcja = page.locator('#kiedy ~ p');
  const tekst = (await sekcja.allInnerTexts()).join(' ');
  expect(tekst).toMatch(/bez przyczyn niedotyczących pracownika do\szwolnienia by\snie doszło/);
  expect(tekst).toMatch(/I\sPK\s144\/11/);
  expect(tekst).toMatch(/odmowa może być uznana za\swspółprzyczynę/);
  await expect(sekcja.getByRole('link', { name: 'kalkulator wypowiedzenia zmieniającego' })).toHaveAttribute('href', '/narzedzia/wypowiedzenie-zmieniajace');
});
