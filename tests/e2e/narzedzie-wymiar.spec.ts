import { expect, test } from '@playwright/test';
import { NARZEDZIE_WYMIAR } from './strony';

// Wymiar czasu pracy: miesiąc, okres przez przełom roku, niepełny etat (wynik w godzinach i minutach).
const ustaw = async (page: import('@playwright/test').Page, rok: string, miesiac: string, dlugosc: string, etat = '1') => {
  await page.getByLabel('Rok').selectOption(rok);
  await page.getByLabel('Miesiąc', { exact: true }).selectOption(miesiac);
  await page.getByLabel('Długość okresu').selectOption(dlugosc);
  await page.getByLabel('Etat').selectOption(etat);
};

test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_WYMIAR);
});

test('sierpień 2026: 160 h (przykład biznes.gov.pl), 15 sierpnia w sobotę', async ({ page }) => {
  await ustaw(page, '2026', '8', '1');
  await expect(page.locator('[data-w="godziny"]')).toHaveText('160 h');
  await expect(page.locator('[data-w="swieta"]')).toContainText('15 sierpnia');
});

test('rok 2027: 2008 h i 251 dni', async ({ page }) => {
  await ustaw(page, '2027', '1', '12');
  await expect(page.locator('[data-w="godziny"]')).toHaveText('2008 h');
  await expect(page.locator('[data-w="dni"]')).toHaveText('251');
  await expect(page.locator('[data-w="miesiace"] tr')).toHaveCount(12);
});

test('3 miesiące od listopada 2026 na 1/3 etatu: 157 h 20 min', async ({ page }) => {
  await ustaw(page, '2026', '11', '3', '1/3');
  await expect(page.locator('[data-w="okres"]')).toHaveText('listopad 2026 – styczeń 2027');
  await expect(page.locator('[data-w="godziny"]')).toHaveText('157 h 20 min');
});

test.describe('bez JavaScriptu', () => {
  test.use({ javaScriptEnabled: false });
  test('tabele roczne i dni wolne są w HTML', async ({ page }) => {
    await page.goto(NARZEDZIE_WYMIAR);
    await expect(page.locator('h2', { hasText: /Wymiar czasu pracy 20\d\d: tabela/ })).toHaveCount(2);
    await expect(page.locator('h3', { hasText: /Dni wolne od pracy 20\d\d/ }).first()).toBeVisible();
  });
});
