import { expect, test } from '@playwright/test';
import { NARZEDZIE_CIAZA } from './strony';

// Praca w ciąży: monitor do 8 h (50 min pracy, 10 min przerwy), stanie do 3 h (15/15 min), bez nocy i nadgodzin.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_CIAZA);
});

test('6 h przy monitorze i 1 h na stojąco: bez naruszeń, 7 przerw po 10 minut i 3 po 15', async ({ page }) => {
  await page.getByLabel('Przy monitorze (godziny)').fill('6');
  await page.getByLabel('Na stojąco (godziny)').fill('1');
  await expect(page.locator('[data-w="wynik"]')).toHaveText('bez naruszeń');
  await expect(page.locator('[data-w="monitor"]')).toContainText(/^7\spo\s10\sminut/);
  await expect(page.locator('[data-w="stanie"]')).toContainText(/^3\spo\s15\sminut/);
});

test('9 h przy monitorze, 4 h na stojąco i nocka: 3 naruszenia', async ({ page }) => {
  await page.getByLabel('Przy monitorze (godziny)').fill('9');
  await page.getByLabel('Na stojąco (godziny)').fill('4');
  await page.getByLabel(/porze nocnej/).check();
  await expect(page.locator('[data-w="wynik"]')).toHaveText(/^3\snaruszenia$/);
  await expect(page.locator('[data-w="naruszenia"]')).toContainText('porze nocnej');
  await page.getByLabel('Na stojąco (godziny)').fill('30');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
});
