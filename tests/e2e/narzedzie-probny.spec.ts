import { expect, test } from '@playwright/test';
import { NARZEDZIE_PROBNY } from './strony';

// Okres próbny (art. 25 § 2–2³, art. 34 Kp): wartości jak w okres-probny.test.ts.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_PROBNY);
  await page.getByLabel('Od', { exact: true }).fill('2027-03-01');
});

test('3 miesiące przed umową na czas nieokreślony: do 31 maja, wypowiedzenie 2 tygodnie', async ({ page }) => {
  await page.getByLabel(/Jaka umowa ma być/).selectOption('nieokreslony');
  await page.getByLabel('Okres próbny', { exact: true }).selectOption('3m');
  await expect(page.locator('[data-w="koniec"]')).toHaveText('31 maja 2027 r.');
  await expect(page.locator('[data-w="wypowiedzenie"]')).toHaveText('2 tygodnie');
  await expect(page.locator('[data-w="status"]')).toHaveText('Zgodny z Kodeksem pracy');
});

test('3 miesiące przed umową krótszą niż 6 miesięcy: za długi', async ({ page }) => {
  await page.getByLabel(/Jaka umowa ma być/).selectOption('okreslony-ponizej-6');
  await page.getByLabel('Okres próbny', { exact: true }).selectOption('3m');
  await expect(page.locator('[data-w="status"]')).toContainText('Za długi');
  await expect(page.locator('[data-w="maks"]')).toHaveText('1 miesiąc');
});
