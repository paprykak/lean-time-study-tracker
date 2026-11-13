import { expect, test } from '@playwright/test';
import { NARZEDZIE_NIEDZIELA } from './strony';

// Praca w niedzielę i święto: 15 listopada 2026 r. → wolne 9–21 listopada; 11 listopada → do końca okresu; dodatek.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_NIEDZIELA);
});

test('niedziela 15 listopada 2026 r.: dzień wolny 9–21 listopada, dodatek 420 zł', async ({ page }) => {
  await expect(page.locator('[data-w="okno"]')).toHaveText(/^9\slistopada\s2026\sr\.\s–\s21\slistopada\s2026\sr\.$/);
  await expect(page.locator('[data-w="dodatek"]')).toHaveText('420,00 zł');
});

test('święto 11 listopada przy okresie 3-miesięcznym: do 31 grudnia', async ({ page }) => {
  await page.getByLabel('Data pracy (niedziela albo święto)').fill('2026-11-11');
  await page.getByLabel('Okres rozliczeniowy (liczony od stycznia)').selectOption('3');
  await expect(page.locator('[data-w="naglowek"]')).toHaveText('Dzień wolny za święto do');
  await expect(page.locator('[data-w="okno"]')).toHaveText(/^31\sgrudnia\s2026\sr\.$/);
  await expect(page.locator('[data-w="rodzaj"]')).toContainText('Narodowe Święto Niepodległości');
});

test('zwykły dzień: komunikat z art. 151³', async ({ page }) => {
  await page.getByLabel('Data pracy (niedziela albo święto)').fill('2026-11-12');
  await expect(page.locator('[data-w="uwaga"]')).toContainText('art. 151³');
});

test('przed wczytaniem skryptu ten sam wynik co po (SSR z tej samej funkcji)', async ({ browser }) => {
  const kontekst = await browser.newContext({ javaScriptEnabled: false });
  const strona = await kontekst.newPage();
  await strona.goto(NARZEDZIE_NIEDZIELA);
  await expect(strona.locator('[data-w="okno"]')).toHaveText(/^9\slistopada\s2026\sr\.\s–\s21\slistopada\s2026\sr\.$/);
  await kontekst.close();
});

test('2028 r.: niedziela 2 stycznia 2028 r. liczy się (bez górnej granicy roku)', async ({ page }) => {
  await page.getByLabel('Data pracy (niedziela albo święto)').fill('2028-01-02');
  await expect(page.locator('[data-w="okno"]')).toHaveText(/^27\sgrudnia\s2027\sr\.\s–\s8\sstycznia\s2028\sr\.$/);
  await expect(page.locator('[data-w="koniec"]')).toContainText(/31\sstycznia\s2028\sr\./);
});

test('błędne godziny: komunikat i aria-invalid', async ({ page }) => {
  await page.getByLabel('Godziny pracy').fill('abc');
  await expect(page.getByText(/Wpisz\sliczbę\sgodzin/)).toBeVisible();
  await expect(page.getByLabel('Godziny pracy')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('[data-w="dodatek"]')).toHaveText('—');
});
