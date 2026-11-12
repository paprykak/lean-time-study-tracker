import { expect, test } from '@playwright/test';
import { NARZEDZIE_NIEDZIELA } from './strony';

// Praca w niedzielę i święto: 15 listopada 2026 r. → wolne 9–21 listopada; 11 listopada → do końca okresu; dodatek.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_NIEDZIELA);
});

test('niedziela 15 listopada 2026 r.: dzień wolny 9–21 listopada, dodatek 420 zł', async ({ page }) => {
  await expect(page.locator('[data-w="okno"]')).toHaveText('9 listopada 2026 r. – 21 listopada 2026 r.');
  await expect(page.locator('[data-w="dodatek"]')).toHaveText('420,00 zł');
});

test('święto 11 listopada przy okresie 3-miesięcznym: do 31 grudnia', async ({ page }) => {
  await page.getByLabel('Data pracy (niedziela albo święto)').fill('2026-11-11');
  await page.getByLabel('Okres rozliczeniowy (liczony od stycznia)').selectOption('3');
  await expect(page.locator('[data-w="naglowek"]')).toHaveText('Dzień wolny za święto do');
  await expect(page.locator('[data-w="okno"]')).toHaveText('31 grudnia 2026 r.');
  await expect(page.locator('[data-w="rodzaj"]')).toContainText('Narodowe Święto Niepodległości');
});

test('zwykły dzień: komunikat z art. 151³', async ({ page }) => {
  await page.getByLabel('Data pracy (niedziela albo święto)').fill('2026-11-12');
  await expect(page.locator('[data-w="uwaga"]')).toContainText('art. 151³');
});
