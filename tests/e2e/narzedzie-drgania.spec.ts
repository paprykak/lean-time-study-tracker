import { expect, test } from '@playwright/test';
import { NARZEDZIE_DRGANIA } from './strony';

// Drgania: A(8) = √(Σ a²·t / 8); NDN 2,8 m/s² (ręce), 0,8 m/s² (ogólne); próg działania 2,5 i 0,5 m/s².
const ustaw = async (page: import('@playwright/test').Page, okresy: [string, string][]) => {
  for (let i = 0; i < 4; i++) {
    await page.getByLabel(`Drgania ${i + 1}: m/s²`).fill(okresy[i]?.[0] ?? '');
    await page.getByLabel(`Drgania ${i + 1}: godziny`).fill(okresy[i]?.[1] ?? '');
  }
};

test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_DRGANIA);
});

test('2 h przy 5 m/s² i 3 h przy 2 m/s²: 2,78 m/s², powyżej progu', async ({ page }) => {
  await ustaw(page, [['5', '2'], ['2', '3']]);
  await expect(page.locator('[data-w="a8"]')).toHaveText(/^2,78\sm\/s²$/);
  await expect(page.locator('[data-w="status"]')).toContainText('Powyżej progu działania');
});

test('1 h przy 6 m/s² i 3 h przy 3 m/s²: 2,81 m/s², przekroczona norma', async ({ page }) => {
  await ustaw(page, [['6', '1'], ['3', '3']]);
  await expect(page.locator('[data-w="a8"]')).toHaveText(/^2,81\sm\/s²$/);
  await expect(page.locator('[data-w="status"]')).toContainText('Przekroczona norma');
});

test('drgania ogólne w ciąży: praca wzbroniona', async ({ page }) => {
  await ustaw(page, [['0,3', '2']]);
  await page.getByLabel('Rodzaj drgań').selectOption('ogolne');
  await page.getByLabel('Kto pracuje').selectOption('ciaza');
  await expect(page.locator('[data-w="status"]')).toHaveText('Praca wzbroniona w ciąży');
});
