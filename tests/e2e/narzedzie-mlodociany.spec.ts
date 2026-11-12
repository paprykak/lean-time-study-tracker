import { expect, test } from '@playwright/test';
import { NARZEDZIE_MLODOCIANY } from './strony';

// Pracownik młodociany: urodzony 15 marca 2010 r., pierwsza praca od 1 września 2025 r. Urlop 12 dni 1 marca 2026 r.,
// 26 dni 1 września 2026 r. i 1 stycznia 2027 r., 20 dni 1 stycznia 2028 r. (rok 18. urodzin).
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_MLODOCIANY);
  await page.getByLabel('Data urodzenia').fill('2010-03-15');
  await page.getByLabel('Początek pierwszej pracy').fill('2025-09-01');
  await page.getByLabel('Sprawdź na dzień').fill('2026-11-12');
});

test('16 lat, nauka zawodu: 8 godzin, płaca 8% z 9233,13 zł i daty urlopu', async ({ page }) => {
  await expect(page.locator('[data-w="doba"]')).toHaveText(/^do\s8\sgodzin$/);
  await expect(page.locator('[data-w="placa"]')).toContainText(/738,66\szł\sbrutto/);
  await page.getByLabel('Rok nauki zawodu').selectOption('3');
  await expect(page.locator('[data-w="placa"]')).toContainText(/923,32\szł/);
  const urlop = page.locator('[data-w="urlop"] li');
  await expect(urlop).toHaveCount(4);
  await expect(urlop.nth(0)).toHaveText(/^1\smarca\s2026\sr\.:\s12\sdni/);
  await expect(urlop.nth(1)).toHaveText(/^1\swrześnia\s2026\sr\.:\s26\sdni/);
  await expect(urlop.nth(3)).toHaveText(/^1\sstycznia\s2028\sr\.:\s20\sdni/);
  await expect(page.locator('[data-w="urlop-ogolne"]')).toContainText(/1\sstycznia\s2029/);
});

test('przed 16. urodzinami 6 godzin; lekkie prace w ferie 6 godzin', async ({ page }) => {
  await page.getByLabel('Sprawdź na dzień').fill('2026-03-14');
  await expect(page.locator('[data-w="doba"]')).toHaveText(/^do\s6\sgodzin$/);
  await page.getByLabel('Rodzaj zatrudnienia').selectOption('lekkie-prace');
  await expect(page.getByLabel('Rok nauki zawodu')).toBeHidden();
  await expect(page.locator('[data-w="lekkie"]')).toContainText(/w\sferie\sdo\s6\sgodzin/);
  await expect(page.locator('[data-w="placa"]')).toContainText('Ustala umowa');
});

test('od 18. urodzin zasady ogólne, przed 15. urodzinami wyjątki i pora nocna od 20:00', async ({ page }) => {
  await page.getByLabel('Sprawdź na dzień').fill('2028-03-15');
  await expect(page.locator('[data-w="doba"]')).toHaveText('zasady ogólne');
  await expect(page.locator('[data-wiersz="placa"]')).toBeHidden();
  await page.getByLabel('Sprawdź na dzień').fill('2025-02-01');
  await expect(page.locator('[data-w="uwaga"]')).toContainText(/W\sroku\s15\.\surodzin/);
  await expect(page.locator('[data-w="noc"]')).toContainText('20:00–6:00');
});

test('błąd, gdy praca zaczyna się przed urodzeniem', async ({ page }) => {
  await page.getByLabel('Początek pierwszej pracy').fill('2009-09-01');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.locator('[data-w="doba"]')).toHaveText('—');
});
