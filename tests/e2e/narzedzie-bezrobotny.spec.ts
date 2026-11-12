import { expect, test } from '@playwright/test';
import { NARZEDZIE_BEZROBOTNY } from './strony';

// Zasiłek dla bezrobotnych od 1 czerwca 2026 r. (M.P. 2026 poz. 268): 1783,90 zł → 1409,35 zł na rękę, potem 1400,90 zł
// → 1106,82 zł; 120%: 2140,68 zł → 1691,02 zł. Wartości z niezależnego rachunku (zasilek-bezrobotny.test.ts).
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_BEZROBOTNY);
  await page.getByLabel('Data rejestracji w urzędzie pracy').fill('2026-11-12');
});

test('rejestracja 12 listopada 2026 r.: 1409,35 zł na rękę, 180 dni do 10 maja 2027 r.', async ({ page }) => {
  await expect(page.locator('[data-w="kwota"]')).toHaveText('1409,35 zł');
  await expect(page.locator('[data-w="do"]')).toHaveText('10 maja 2027 r.');
  await expect(page.locator('[data-w="odcinki"]')).toContainText('1400,90 zł brutto, 1106,82 zł na rękę');
});

test('20 lat stażu: 120%', async ({ page }) => {
  await page.getByLabel(/najmniej\s20\slat\sstażu/).check();
  await expect(page.locator('[data-w="kwota"]')).toHaveText('1691,02 zł');
  await expect(page.locator('[data-w="podpis"]')).toContainText('(120%)');
});

test('porozumienie stron z innego powodu: zasiłek od 10 lutego 2027 r.', async ({ page }) => {
  await page.getByLabel('Jak skończyła się ostatnia praca').selectOption('porozumienie');
  await expect(page.locator('[data-w="od"]')).toHaveText('10 lutego 2027 r.');
  await expect(page.locator('[data-w="dni"]')).toHaveText('90 dni');
  await expect(page.locator('[data-w="uwaga"]')).toBeVisible();
});

test('własne wypowiedzenie: zasiłek nie przysługuje', async ({ page }) => {
  await page.getByLabel('Jak skończyła się ostatnia praca').selectOption('wypowiedzenie-wlasne');
  await expect(page.locator('[data-w="kwota"]')).toHaveText('nie przysługuje');
  await expect(page.locator('[data-w="uwaga"]')).toContainText('art. 219 ust. 1 pkt 1');
});
