import { expect, test } from '@playwright/test';
import { adresNarzedzia } from '../../src/data/narzedzia';

// Mobbing od 5.11.2026: 6 × 4806 zł = 28 836 zł (płaca 2026), 6 × 4950 zł = 29 700 zł (2027); wielokrotna dyskryminacja
// 3 × 4806 zł = 14 418 zł; zachowanie 4.11.2026: dawne przepisy, odszkodowanie 4806 zł; przedawnienie 3 lata
// (2026-11-10 → 10 listopada 2029 r., 2024-02-29 → 28 lutego 2027 r.).
test.beforeEach(async ({ page }) => {
  await page.goto(adresNarzedzia('mobbing-i-dyskryminacja'));
  await page.getByLabel('Sprawa', { exact: true }).selectOption('mobbing');
  await page.getByLabel('Płaca minimalna z roku').selectOption('2026');
  await page.getByLabel('Dzień ostatniego zachowania').fill('2026-11-10');
});

test('mobbing po 5 listopada 2026 r.: 6 płac minimalnych', async ({ page }) => {
  await expect(page.locator('[data-w="kwota"]')).toHaveText(/^28\s?836,00\szł$/);
  await expect(page.locator('[data-w="przepisy"]')).toHaveText(/94³\s§\s11/);
  await expect(page.locator('[data-w="przedawnienie"]')).toHaveText(/^10\slistopada\s2029\sr\.$/);
  await expect(page.locator('[data-w="uwaga"]')).toContainText(/29\s?700,00\szł/);
  await page.getByLabel('Płaca minimalna z roku').selectOption('2027');
  await expect(page.locator('[data-w="kwota"]')).toHaveText(/^29\s?700,00\szł$/);
});

test('dyskryminacja wielokrotna i dawne przepisy', async ({ page }) => {
  await page.getByLabel('Sprawa', { exact: true }).selectOption('wielokrotna');
  await expect(page.locator('[data-w="kwota"]')).toHaveText(/^14\s?418,00\szł$/);
  await expect(page.locator('[data-w="dowod"]')).toContainText('18³f');
  await page.getByLabel('Dzień ostatniego zachowania').fill('2026-11-04');
  await expect(page.locator('[data-w="kwota"]')).toHaveText(/^4\s?806,00\szł$/);
  await expect(page.locator('[data-w="opis"]')).toContainText('odszkodowanie');
  await page.getByLabel('Dzień ostatniego zachowania').fill('2024-02-29');
  await expect(page.locator('[data-w="przedawnienie"]')).toHaveText(/^28\slutego\s2027\sr\.$/);
});

test('błędna data', async ({ page }) => {
  await page.getByLabel('Dzień ostatniego zachowania').fill('2099-01-01');
  await expect(page.locator('[data-blad="data"]')).toBeVisible();
  await expect(page.locator('[data-w="kwota"]')).toHaveText('—');
});
