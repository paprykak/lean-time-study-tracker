import { expect, test } from '@playwright/test';
import { adresNarzedzia } from '../../src/data/narzedzia';

// Fundusz socjalny 2026 (art. 3 i 5 ustawy o ZFŚS; podstawa 7848,60 zł z M.P. 2026 poz. 232): odpis 37,5% = 2943,225 zł
// → 2943,23 zł na etat; 50 etatów: 147 161,25 zł, do 31 maja co najmniej 110 370,94 zł; świadczenie urlopowe najwyżej
// 2943,22 zł. Kwoty z niezależnego rachunku (raporty/zfss/rachunek.py).
test.beforeEach(async ({ page }) => {
  await page.goto(adresNarzedzia('fundusz-socjalny'));
  await page.getByLabel('Rok', { exact: true }).selectOption('2026');
});

test('50 etatów: musi tworzyć fundusz, odpis 2943,23 zł, rocznie 147 161,25 zł, terminy wpłat', async ({ page }) => {
  await page.getByLabel('Etaty 1 stycznia').fill('50');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Musi tworzyć fundusz');
  await expect(page.locator('[data-w="opis"]')).toContainText(/art\.\s3\sust\.\s1\s/);
  await expect(page.locator('[data-w="odpis"]')).toHaveText(/^2\s?943,23\szł$/);
  await expect(page.locator('[data-w="odpis-opis"]')).toContainText(/dokładnie\s2\s?943,225\szł/);
  await expect(page.locator('[data-w="fundusz-etykieta"]')).toHaveText(/^Odpis\sna\s2026\sr\.,\s50\setatów$/);
  await expect(page.locator('[data-w="fundusz"]')).toHaveText(/^147\s161,25\szł$/);
  await expect(page.locator('[data-w="terminy"]')).toContainText(/co\snajmniej\s110\s370,94\szł\sdo\s31\smaja/);
});

test('49,5 etatu bez związku: nie musi, świadczenie urlopowe najwyżej 2943,22 zł; wniosek związku zmienia wynik', async ({ page }) => {
  await page.getByLabel('Etaty 1 stycznia').fill('49,5');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Nie musi tworzyć funduszu');
  await expect(page.locator('[data-w="fundusz-etykieta"]')).toHaveText(/^Fundusz\snajwyżej,\s49,5\setatu$/);
  await expect(page.locator('[data-w="fundusz"]')).toHaveText(/^145\s689,64\szł$/);
  await expect(page.locator('[data-w="urlopowe"]')).toContainText(/najwyżej\s2\s?943,22\szł/);
  await expect(page.locator('[data-w="uwaga"]')).toContainText(/art\.\s3\sust\.\s3a–3b/);
  await page.getByLabel('Związek zawodowy w firmie').selectOption('wniosek');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Musi tworzyć fundusz');
  await expect(page.locator('[data-w="opis"]')).toContainText(/art\.\s3\sust\.\s1c/);
});

test('12 etatów w jednostce budżetowej: musi bez względu na liczbę; 2025 r. z inną podstawą', async ({ page }) => {
  await page.getByLabel('Etaty 1 stycznia').fill('12');
  await page.getByLabel('Rodzaj pracodawcy').selectOption('budzetowa');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Musi tworzyć fundusz');
  await expect(page.locator('[data-w="opis"]')).toContainText(/art\.\s3\sust\.\s2/);
  await page.getByLabel('Rok', { exact: true }).selectOption('2025');
  await expect(page.locator('[data-w="odpis"]')).toHaveText(/^2\s?723,40\szł$/);
  await expect(page.locator('[data-w="odpis-opis"]')).toContainText(/7\s?262,39\szł/);
});

test('błędna liczba etatów: komunikat, pole oznaczone, po poprawie wynik wraca', async ({ page }) => {
  const pole = page.getByLabel('Etaty 1 stycznia');
  await pole.fill('0');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(pole).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('—');
  await pole.fill('abc');
  await expect(page.locator('[data-blad="dane"]')).toContainText(/większą\sod\szera/);
  await pole.fill('20');
  await expect(page.locator('[data-blad="dane"]')).toBeHidden();
  await expect(pole).not.toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Nie musi tworzyć funduszu');
});
