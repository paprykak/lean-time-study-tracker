import { expect, test } from '@playwright/test';
import { NARZEDZIE_NADGODZINY } from './strony';

// Kalkulator nadgodzin: stawka godzinowa, pensja (pensja : godziny w miesiącu, § 4a), 60% przy braku stawki zasadniczej.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_NADGODZINY);
});

test('stawka 40 zł: 4 h ze 100% i 6 h z 50% → 680 zł razem', async ({ page }) => {
  await page.getByLabel('Stawka za godzinę (zł brutto)').fill('40');
  await page.getByLabel('Nadgodziny z dodatkiem 100%').fill('4');
  await page.getByLabel('Nadgodziny z dodatkiem 50%').fill('6');
  await expect(page.locator('[data-w="razem"]')).toHaveText('680,00 zł');
  await expect(page.locator('[data-w="wolne"]')).toHaveText('10 h na Twój wniosek albo 15 h bez wniosku');
});

test('pensja 6400 zł w listopadzie 2026: stawka 40 zł (160 h)', async ({ page }) => {
  await page.getByLabel('Pensja miesięczna (stawka zasadnicza)').check();
  await page.getByLabel('Pensja zasadnicza (zł brutto miesięcznie)').fill('6400');
  await page.getByLabel('Rok').selectOption('2026');
  await page.getByLabel('Miesiąc', { exact: true }).selectOption('11');
  await expect(page.locator('[data-w="stawka"]')).toHaveText('40,00 zł');
  await expect(page.locator('[data-w="stawka-opis"]')).toHaveText('pensja : 160 h w listopadzie 2026');
});

test('bez stawki zasadniczej: 60% z 8000 zł w listopadzie 2026 → 30 zł', async ({ page }) => {
  await page.getByLabel('Bez wyodrębnionej stawki zasadniczej').check();
  await page.getByLabel('Wynagrodzenie miesięczne (zł brutto)').fill('8000');
  await page.getByLabel('Rok').selectOption('2026');
  await page.getByLabel('Miesiąc', { exact: true }).selectOption('11');
  await expect(page.locator('[data-w="stawka"]')).toHaveText('30,00 zł');
});

test('błędna kwota: komunikat', async ({ page }) => {
  await page.getByLabel('Stawka za godzinę (zł brutto)').fill('dużo');
  await expect(page.getByText('Wpisz kwotę w złotych')).toBeVisible();
  await expect(page.locator('[data-w="razem"]')).toHaveText('—');
});
