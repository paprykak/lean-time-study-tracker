import { expect, test } from '@playwright/test';
import { NARZEDZIE_DYZUR } from './strony';

// Dyżur (art. 151⁵ Kp): listopad 2026 r. ma 160 godzin pracy, pensja 6000 zł → 37,50 zł za godzinę.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_DYZUR);
  await page.getByLabel('Miesiąc dyżuru').selectOption('11');
  await page.getByLabel('Rok', { exact: true }).selectOption('2026');
});

test('12 h dyżuru, 2 h pracy, pensja 6000 zł: 10 h wolnego albo 375 zł', async ({ page }) => {
  await page.getByLabel('Godziny dyżuru').fill('12');
  await page.getByLabel('W tym godziny pracy').fill('2');
  await page.getByLabel(/Pensja zasadnicza/).fill('6000');
  await expect(page.locator('[data-w="wolne"]')).toHaveText(/^10\sh wolnego$/);
  await expect(page.locator('[data-w="albo"]')).toContainText('375,00');
});

test('bez stawki: 60% według zasad urlopowych', async ({ page }) => {
  await page.getByLabel('Godziny dyżuru').fill('10');
  await page.getByLabel('W tym godziny pracy').fill('0');
  await page.getByLabel(/Bez wyodrębnionej stawki/).check();
  await page.getByLabel(/Stałe składniki/).fill('5000');
  await page.getByLabel(/Zmienne/).fill('1200');
  await page.getByLabel(/Przepracowane godziny/).fill('480');
  await expect(page.locator('[data-w="albo"]')).toContainText('202,50');
});

test('dyżur w domu: nic', async ({ page }) => {
  await page.getByLabel('Gdzie pełnisz dyżur').selectOption('dom');
  await expect(page.locator('[data-w="wolne"]')).toHaveText('Nic');
});
