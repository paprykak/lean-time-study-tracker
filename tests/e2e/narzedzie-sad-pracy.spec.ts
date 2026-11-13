import { expect, test } from '@playwright/test';
import { adresNarzedzia } from '../../src/data/narzedzia';

// Pozew pracownika 0 zł (art. 96 ust. 1 pkt 4 ustawy o kosztach sądowych); apelacja przy 80 000 zł: 5% z 30 000 zł =
// 1500 zł, przy 60 000 zł: 500 zł (nadwyżka 10 000 zł), do 50 000 zł 0 zł (art. 35 ust. 1); 150 000 zł zaległej pensji:
// sąd okręgowy (art. 17 pkt 4 KPC), mobbing za 150 000 zł: sąd rejonowy (art. 461 § 1¹ KPC).
test.beforeEach(async ({ page }) => {
  await page.goto(adresNarzedzia('sad-pracy-czy-pip'));
  await page.getByLabel('Sprawa', { exact: true }).selectOption('wynagrodzenie');
});

test('kwota z „zł”', async ({ page }) => {
  await page.getByLabel('Kwota, której żądasz (zł)').fill('80 000 zł');
  await expect(page.locator('[data-w="apelacja"]')).toHaveText(/^1\s?500\szł$/);
});

test('opłaty od pozwu i apelacji', async ({ page }) => {
  const kwota = page.getByLabel('Kwota, której żądasz (zł)');
  await kwota.fill('80000');
  await expect(page.locator('[data-w="pozew"]')).toHaveText('0 zł');
  await expect(page.locator('[data-w="apelacja"]')).toHaveText(/^1\s?500\szł$/);
  await kwota.fill('60000');
  await expect(page.locator('[data-w="apelacja"]')).toHaveText(/^500\szł$/);
  await kwota.fill('50000');
  await expect(page.locator('[data-w="apelacja"]')).toHaveText('0 zł');
  await expect(page.locator('[data-w="pip"]')).toContainText(/art\.\s11\sust\.\s1\spkt\s7/);
});

test('sąd okręgowy tylko poza sprawami z art. 461 § 1¹', async ({ page }) => {
  await page.getByLabel('Kwota, której żądasz (zł)').fill('150000');
  await expect(page.locator('[data-w="sad"]')).toHaveText(/^Sąd\sokręgowy/);
  await page.getByLabel('Sprawa', { exact: true }).selectOption('mobbing');
  await expect(page.locator('[data-w="sad"]')).toHaveText(/^Sąd\srejonowy/);
  await expect(page.locator('[data-w="uwaga"]')).toContainText('461');
});

test('błędna kwota', async ({ page }) => {
  await page.getByLabel('Kwota, której żądasz (zł)').fill('dużo');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.locator('[data-w="sad"]')).toHaveText('—');
});
