import { expect, test } from '@playwright/test';

// Wypowiedzenie zmieniające (art. 42 § 3, art. 36 § 1, art. 264 § 1 Kp): wartości jak w wypowiedzenie-zmieniajace.test.ts.
test.beforeEach(async ({ page }) => {
  await page.goto('/narzedzia/wypowiedzenie-zmieniajace');
});

test('staż ponad 3 lata: odmowa do 5 stycznia, koniec 28 lutego, sąd do 3 grudnia', async ({ page }) => {
  await page.getByLabel('Pracujesz u tego pracodawcy od').fill('2020-01-15');
  await page.getByLabel('Dzień doręczenia pisma').fill('2026-11-12');
  await expect(page.locator('[data-w="odmowa"]')).toHaveText(/^5\sstycznia\s2027\sr\.$/);
  await expect(page.locator('[data-w="okres"]')).toHaveText(/^3\smiesiące$/);
  await expect(page.locator('[data-w="koniec"]')).toHaveText(/^28\slutego\s2027\sr\.$/);
  await expect(page.locator('[data-w="wariant-b"]')).toHaveText(/^14\sstycznia\s2027\sr\.$/);
  await expect(page.locator('[data-w="odwolanie"]')).toHaveText(/^3\sgrudnia\s2026\sr\.$/);
});

test('bez pouczenia: odmowa do końca okresu', async ({ page }) => {
  await page.getByLabel('Pracujesz u tego pracodawcy od').fill('2020-01-15');
  await page.getByLabel('Dzień doręczenia pisma').fill('2026-11-12');
  await page.getByLabel(/pouczenie/).uncheck();
  await expect(page.locator('[data-w="odmowa"]')).toHaveText(/^28\slutego\s2027\sr\.$/);
});

test('bez pouczenia, próg 6 miesięcy w trakcie wypowiedzenia: odmowa do końca krótszego okresu', async ({ page }) => {
  await page.getByLabel('Pracujesz u tego pracodawcy od').fill('2026-05-13');
  await page.getByLabel('Dzień doręczenia pisma').fill('2026-11-12');
  await page.getByLabel(/pouczenie/).uncheck();
  await expect(page.locator('[data-w="odmowa"]')).toHaveText(/^28\slistopada\s2026\sr\.$/);
  await expect(page.locator('[data-w="koniec"]')).toHaveText(/^31\sgrudnia\s2026\sr\.$/);
  await expect(page.locator('[data-w="uwaga"]')).toContainText('koniec krótszego okresu');
});

test('doręczenie przed początkiem pracy: komunikat błędu', async ({ page }) => {
  await page.getByLabel('Pracujesz u tego pracodawcy od').fill('2026-11-13');
  await page.getByLabel('Dzień doręczenia pisma').fill('2026-11-12');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.locator('[data-w="odmowa"]')).toHaveText('—');
});
