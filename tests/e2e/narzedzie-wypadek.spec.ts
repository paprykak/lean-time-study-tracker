import { expect, test } from '@playwright/test';
import { NARZEDZIE_WYPADEK } from './strony';

// Odszkodowanie z ZUS: od 1 kwietnia 2026 r. 1781 zł za 1% (M.P. 2026 poz. 292); wartości jak w odszkodowanie-wypadek.test.ts.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_WYPADEK);
  await page.getByLabel('Data decyzji ZUS').fill('2026-11-12');
});

test('8% uszczerbku: 14 248 zł', async ({ page }) => {
  await page.getByLabel('Uszczerbek na zdrowiu (%)').fill('8');
  await expect(page.locator('[data-w="razem"]')).toHaveText(/^14\s248\szł$/);
  await expect(page.locator('[data-w="stawka"]')).toContainText('1781 zł');
});

test('zwiększenie z 10% do 25%: 26 715 zł', async ({ page }) => {
  await page.getByLabel('Uszczerbek na zdrowiu (%)').fill('25');
  await page.getByLabel('Procent z wcześniejszego odszkodowania').fill('10');
  await expect(page.locator('[data-w="razem"]')).toHaveText(/^26\s715\szł$/);
});

test('zwiększenie o mniej niż 10 punktów: 0 zł i wyjaśnienie', async ({ page }) => {
  await page.getByLabel('Uszczerbek na zdrowiu (%)').fill('18');
  await page.getByLabel('Procent z wcześniejszego odszkodowania').fill('10');
  await expect(page.locator('[data-w="razem"]')).toHaveText(/^0\szł$/);
  await expect(page.locator('[data-w="uwaga"]')).toContainText('co najmniej o 10');
});
