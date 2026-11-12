import { expect, test } from '@playwright/test';
import { NARZEDZIE_WYCHOWAWCZY } from './strony';

// Urlop wychowawczy (art. 186 Kp): wartości jak w urlop-wychowawczy.test.ts.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_WYCHOWAWCZY);
  await page.getByLabel('Data urodzenia dziecka').fill('2025-05-20');
  await page.getByLabel('Początek urlopu').fill('2027-01-01');
});

test('12 miesięcy: do 31 grudnia 2027 r., wniosek do 11 grudnia 2026 r.', async ({ page }) => {
  await page.getByLabel('Na ile miesięcy').fill('12');
  await expect(page.locator('[data-w="koniec"]')).toHaveText('31 grudnia 2027 r.');
  await expect(page.locator('[data-w="wniosek"]')).toHaveText('11 grudnia 2026 r.');
  await expect(page.locator('[data-w="dostepne"]')).toHaveText('35');
});

test('36 miesięcy: 35, bo miesiąc drugiego rodzica', async ({ page }) => {
  await page.getByLabel('Na ile miesięcy').fill('36');
  await expect(page.locator('[data-w="uwaga"]')).toContainText('zarezerwowany');
  await page.getByLabel(/jedynym uprawnionym/).check();
  await expect(page.locator('[data-w="dostepne"]')).toHaveText('36');
});

test('koniec roku 6. urodzin skraca urlop', async ({ page }) => {
  await page.getByLabel('Początek urlopu').fill('2031-06-01');
  await page.getByLabel('Na ile miesięcy').fill('12');
  await expect(page.locator('[data-w="koniec"]')).toHaveText('31 grudnia 2031 r.');
  await expect(page.locator('[data-w="uwaga"]')).toContainText('6 lat');
});
