import { expect, test } from '@playwright/test';
import { NARZEDZIE_RODZIC } from './strony';

// Rodzic w pracy: dziecko urodzone 15 marca 2024 r., plan od 1 grudnia 2026 r.: ojcowski minął 14 marca 2025 r.,
// wychowawczy do 31 grudnia 2030 r. z wnioskiem do 10 listopada 2026 r., praca zdalna do 14 marca 2028 r.
test('dziecko 2,5 roku: 7 z 8 uprawnień, terminy wniosków', async ({ page }) => {
  await page.goto(NARZEDZIE_RODZIC);
  await page.getByLabel('Urodzenie dziecka').fill('2024-03-15');
  await page.getByLabel('Chcę zacząć od').fill('2026-12-01');
  await expect(page.locator('[data-w="ile"]')).toHaveText(/^7\sz\s8\suprawnień$/);
  const lista = page.locator('[data-w="lista"] li');
  await expect(lista.nth(0)).toContainText(/minęło\s14\smarca\s2025/);
  await expect(lista.nth(2)).toContainText(/do\s31\sgrudnia\s2030\sr\.;\swniosek\snajpóźniej\s10\slistopada\s2026/);
  await expect(lista.nth(4)).toContainText(/do\s14\smarca\s2028/);
  await page.getByLabel('Chcę zacząć od').fill('2020-01-01');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
});

test('urlop ojcowski: na 3 dni przed 1. urodzinami za późno, na 2 tygodnie przed pełny opis terminów', async ({ page }) => {
  await page.goto(NARZEDZIE_RODZIC);
  await page.getByLabel('Urodzenie dziecka').fill('2024-03-15');
  await page.getByLabel('Chcę zacząć od').fill('2025-03-12');
  const ojcowski = page.locator('[data-w="lista"] li').nth(0);
  await expect(ojcowski).toHaveAttribute('data-dostepne', 'nie');
  await expect(ojcowski).toContainText(/za\spóźno:\snajkrótsza\sczęść\strwa\stydzień/);
  await page.getByLabel('Chcę zacząć od').fill('2025-02-01');
  await expect(ojcowski).toHaveAttribute('data-dostepne', 'tak');
  await expect(ojcowski).toContainText(/całe\s2\stygodnie\strzeba\szacząć\snajpóźniej\s1\smarca\s2025\sr\.,\stydzień\snajpóźniej\s8\smarca\s2025/);
});

test('strona czytana w styczniu 2027 r.: początek za 30 dni od dziś', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-01-05T10:00:00+01:00'));
  await page.goto(NARZEDZIE_RODZIC);
  await expect(page.getByLabel('Chcę zacząć od')).toHaveValue('2027-02-04');
});
