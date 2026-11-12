import { expect, test } from '@playwright/test';
import { NARZEDZIE_ZAKAZ } from './strony';

// Zakaz konkurencji (art. 101² § 3 Kp): 6000 zł, 12 miesięcy, 25% → 18 000 zł.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_ZAKAZ);
  await page.getByLabel(/Przeciętna pensja brutto/).fill('6000');
  await page.getByLabel('Zakaz na ile miesięcy').fill('12');
});

test('25%: 18 000 zł, 1500 zł miesięcznie', async ({ page }) => {
  await page.getByLabel('Procent z umowy').fill('25');
  await expect(page.locator('[data-w="razem"]')).toHaveText(/^18\s000,00\szł$/);
  await expect(page.locator('[data-w="miesiecznie"]')).toHaveText(/^1500,00\szł$/);
});

test('20%: poniżej minimum', async ({ page }) => {
  await page.getByLabel('Procent z umowy').fill('20');
  await expect(page.locator('[data-w="status"]')).toContainText('Poniżej minimum');
});
