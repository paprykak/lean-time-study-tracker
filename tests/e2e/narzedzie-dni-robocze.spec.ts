import { expect, test } from '@playwright/test';
import { NARZEDZIE_ROBOCZE } from './strony';

// Dni robocze: od poniedziałku do piątku bez świąt. Grudzień 2026 r.: 21; z sobotami 24.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_ROBOCZE);
  await page.getByLabel('Od', { exact: true }).fill('2026-12-01');
  await page.getByLabel('Do', { exact: true }).fill('2026-12-31');
});

test('grudzień 2026: 21 dni roboczych, z sobotami 24', async ({ page }) => {
  await expect(page.locator('[data-w="robocze"]')).toHaveText('21');
  await expect(page.locator('[data-w="swieta"]')).toContainText('Wigilia');
  await page.getByLabel(/Soboty są/).check();
  await expect(page.locator('[data-w="robocze"]')).toHaveText('24');
});

test('10 dni roboczych po 18 grudnia 2026: 7 stycznia 2027', async ({ page }) => {
  await page.getByLabel('Od', { exact: true }).fill('2026-12-18');
  await page.getByLabel(/Dni roboczych od daty/).fill('10');
  await expect(page.locator('[data-w="po"]')).toHaveText(/^7\sstycznia\s2027\sr\.$/);
});
