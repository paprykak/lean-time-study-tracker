import { expect, test } from '@playwright/test';
import { adresNarzedzia } from '../../src/data/narzedzia';

// Stałe daty w przeszłości (wynik nie zależy od dnia uruchomienia): okres z wykazu liczony od dnia po ostatnim dniu
// pracy w narażeniu, jak art. 112 KC: cieśń nadgarstka (poz. 20 pkt 1, 1 rok), koniec 15.03.2025 → do 15.03.2026;
// ubytek słuchu (poz. 21, 2 lata), koniec 10.01.2020 → do 10.01.2022.
test.beforeEach(async ({ page }) => {
  await page.goto(adresNarzedzia('choroba-zawodowa'));
  await page.getByLabel('Choroba', { exact: true }).selectOption('20.1');
  await page.getByLabel('Czy nadal pracujesz w narażeniu?').selectOption('koniec-nie-pracuje');
  await page.getByLabel('Ostatni dzień w narażeniu').fill('2025-03-15');
});

test('cieśń nadgarstka: objawy w okresie i po nim', async ({ page }) => {
  await page.getByLabel('Pierwsze objawy w dokumentacji').fill('2026-03-15');
  await expect(page.locator('[data-w="glowny"]')).toHaveText('Objawy w okresie z wykazu');
  await expect(page.locator('[data-w="podstawa"]')).toContainText(/15\smarca\s2026\sr\.\swłącznie/);
  await expect(page.locator('[data-w="wiersze"]')).toContainText(/Poz\.\s20\spkt\s1/);
  await expect(page.locator('[data-w="wiersze"]')).toContainText(/Możesz\sTy,\ssam\slub\ssama/);
  await page.getByLabel('Pierwsze objawy w dokumentacji').fill('2026-03-16');
  await expect(page.locator('[data-w="glowny"]')).toHaveText('Objawy po okresie z wykazu');
});

test('ubytek słuchu: okres minął, w narażeniu przez lekarza medycyny pracy', async ({ page }) => {
  await page.getByLabel('Choroba', { exact: true }).selectOption('21');
  await page.getByLabel('Ostatni dzień w narażeniu').fill('2020-01-10');
  await expect(page.locator('[data-w="glowny"]')).toHaveText(/^Okres\sminął\s10\sstycznia\s2022\sr\.$/);
  await page.getByLabel('Czy nadal pracujesz w narażeniu?').selectOption('trwa');
  await expect(page.locator('[data-w="glowny"]')).toHaveText(/^Jest\sw\swykazie:\spoz\.\s21$/);
  await expect(page.getByLabel('Ostatni dzień w narażeniu')).toBeHidden();
  await expect(page.locator('[data-w="wiersze"]')).toContainText(/przez\slekarza\smedycyny\spracy/);
  await expect(page.locator('[data-w="uwagi"]')).toContainText(/45\sdB/);
});

test('kręgosłup spoza wykazu, pylica bez daty', async ({ page }) => {
  await page.getByLabel('Choroba', { exact: true }).selectOption('kregoslup');
  await expect(page.locator('[data-w="glowny"]')).toHaveText('Nie ma w wykazie');
  await page.getByLabel('Choroba', { exact: true }).selectOption('3.1');
  await expect(page.locator('[data-w="glowny"]')).toHaveText(/^Okres:\snie\smożna\sokreślić$/);
});

test('błąd: koniec narażenia w przyszłości', async ({ page }) => {
  await page.getByLabel('Ostatni dzień w narażeniu').fill('2099-01-01');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.getByLabel('Ostatni dzień w narażeniu')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('[data-w="glowny"]')).toHaveText('—');
});
