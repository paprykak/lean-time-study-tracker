import { expect, test } from '@playwright/test';
import { NARZEDZIE_REHABILITACYJNE } from './strony';

// Świadczenie rehabilitacyjne: start 12 listopada 2026 r. (IV kwartał, wskaźnik 100,4%), 6000 zł → 4678,30 zł, potem 3898,58 zł.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_REHABILITACYJNE);
  await page.getByLabel(/Przeciętna pensja brutto/).fill('6000');
  await page.getByLabel('Początek świadczenia').fill('2026-11-12');
});

test('choroba: 90% i 75% po waloryzacji', async ({ page }) => {
  await expect(page.locator('[data-w="pierwsze"]')).toHaveText(/^4678,30\szł$/);
  await expect(page.locator('[data-w="dalej"]')).toHaveText(/^3898,58\szł$/);
  await expect(page.locator('[data-w="wskaznik"]')).toContainText('100,4%');
});

test('wypadek przy pracy: 100%', async ({ page }) => {
  await page.getByLabel('Przyczyna niezdolności do pracy').selectOption('wypadek');
  await expect(page.locator('[data-w="pierwsze"]')).toHaveText(/^5198,11\szł$/);
  await expect(page.locator('[data-w="naglowek"]')).toHaveText('Miesięcznie brutto (100%)');
});

test('miesiąc to 30 dni: 75% od 10 lutego 2027 r., najdłużej do 6 listopada 2027 r.', async ({ page }) => {
  await expect(page.locator('[data-w="dalej-opis"]')).toHaveText(/^Od\s10\slutego\s2027\sr\.,\smiesięcznie\s\(75%\)$/);
  await expect(page.locator('[data-w="koniec"]')).toHaveText(/^6\slistopada\s2027\sr\.$/);
});
