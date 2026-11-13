import { expect, test } from '@playwright/test';
import { adresNarzedzia } from '../../src/data/narzedzia';

// Zwolnienia z art. 21 ust. 1 pkt 148 i 152–154 ustawy o PIT (limit 85 528 zł, ust. 44), stały rok 2026.
test.beforeEach(async ({ page }) => {
  await page.goto(adresNarzedzia('zerowy-pit'));
  await page.getByLabel('Rok', { exact: true }).selectOption('2026');
});

test('ulga dla młodych do dnia 26. urodzin, limit wspólny', async ({ page }) => {
  await page.getByLabel('Data urodzenia').fill('2000-05-20');
  await expect(page.locator('[data-w="stan"]')).toHaveText(/^Do\s20\smaja\s2026\sr\.$/);
  await page.getByLabel('Przychody w okresie ulgi (zł)').fill('100000');
  await page.getByLabel('Zwolnione z innej ulgi (zł)').fill('20000');
  await expect(page.locator('[data-w="zwolnione"]')).toHaveText(/^65\s?528,00\szł$/);
  await expect(page.locator('[data-w="opodatkowane"]')).toHaveText(/^34\s?472,00\szł$/);
  await page.getByLabel('Data urodzenia').fill('1999-12-31');
  await expect(page.locator('[data-w="stan"]')).toHaveText('Nie przysługuje');
});

test('senior od dnia po urodzinach, powrót 4 lata, rodzina 4+', async ({ page }) => {
  await page.getByLabel('Ulga', { exact: true }).selectOption('senior');
  await page.getByLabel('Data urodzenia').fill('1966-03-10');
  await expect(page.locator('[data-w="stan"]')).toHaveText(/^Od\s11\smarca\s2026\sr\.$/);
  await page.getByLabel('Nie pobieram emerytury ani renty rodzinnej').uncheck();
  await expect(page.locator('[data-w="stan"]')).toHaveText('Nie przysługuje');
  await page.getByLabel('Ulga', { exact: true }).selectOption('powrot');
  await page.getByLabel('Rok przeprowadzki do Polski').fill('2024');
  await page.getByLabel('Ulga od roku').selectOption('nastepny');
  await expect(page.locator('[data-w="okres"]')).toHaveText('2025–2028');
  await page.getByLabel('Ulga', { exact: true }).selectOption('rodzina4');
  await page.getByLabel('Dzieci w roku').selectOption('3');
  await expect(page.locator('[data-w="stan"]')).toHaveText('Nie przysługuje');
});

test('błędna data', async ({ page }) => {
  await page.getByLabel('Data urodzenia').fill('');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.locator('[data-w="stan"]')).toHaveText('—');
});
