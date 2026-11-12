import { expect, test } from '@playwright/test';
import { NARZEDZIE_TRZEZWOSC } from './strony';

// Kontrola trzeźwości: progi 0,1 i 0,25 mg/dm³ w powietrzu, 0,2 i 0,5‰ we krwi (art. 46 ustawy o wychowaniu w trzeźwości).
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_TRZEZWOSC);
});

test('alkomat: 0,09 brak, 0,1 stan po użyciu, 0,26 nietrzeźwość', async ({ page }) => {
  const wynik = page.getByLabel('Wynik', { exact: true });
  await wynik.fill('0,09');
  await expect(page.locator('[data-w="stan"]')).toHaveText(/^brak\salkoholu/);
  await wynik.fill('0,1');
  await expect(page.locator('[data-w="stan"]')).toHaveText(/^stan\spo\sużyciu\salkoholu$/);
  await wynik.fill('0,26');
  await expect(page.locator('[data-w="stan"]')).toHaveText(/^stan\snietrzeźwości$/);
  await expect(page.locator('[data-w="status"]')).toHaveAttribute('data-status', 'po-terminie');
});

test('krew: 0,5‰ to jeszcze stan po użyciu, 0,51‰ nietrzeźwość; błędny wynik', async ({ page }) => {
  await page.getByLabel('Rodzaj badania').selectOption('krew');
  const wynik = page.getByLabel('Wynik', { exact: true });
  await wynik.fill('0,5');
  await expect(page.locator('[data-w="stan"]')).toHaveText(/^stan\spo\sużyciu/);
  await wynik.fill('0,51');
  await expect(page.locator('[data-w="stan"]')).toHaveText(/^stan\snietrzeźwości$/);
  await wynik.fill('abc');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
});
