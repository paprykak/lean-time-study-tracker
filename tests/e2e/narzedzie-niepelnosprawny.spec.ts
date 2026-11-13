import { expect, test } from '@playwright/test';
import { NARZEDZIE_NIEPELNOSPRAWNY } from './strony';

// Pracownik z niepełnosprawnością: umiarkowany stopień 7 godzin, stawka razy 8/7, dodatkowy urlop dzień po rocznicy zaliczenia.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_NIEPELNOSPRAWNY);
});

test('umiarkowany stopień: 7 godzin, wymiar to dni razy 7, stawka 28 zł → 32 zł, urlop od 11 marca 2027 r.', async ({ page }) => {
  await expect(page.locator('[data-w="doba"]')).toHaveText(/^do\s7\sgodzin$/);
  const wymiar = (await page.locator('[data-w="wymiar"]').textContent()) ?? '';
  const [, godziny, dni] = wymiar.match(/^(\d+)\sgodzin[ay]?\s\((\d+)\s×\s7\sgodzin\)$/) ?? [];
  expect(Number(godziny)).toBe(Number(dni) * 7);
  await page.getByLabel(/Stawka za godzinę/).fill('28');
  await expect(page.locator('[data-w="stawka"]')).toContainText(/32,00\szł\szamiast\s28,00\szł/);
  await page.getByLabel('Dzień zaliczenia do stopnia').fill('2026-03-10');
  await expect(page.locator('[data-w="urlop"]')).toContainText(/11\smarca\s2027/);
});

test('lekki stopień: 8 godzin, bez dodatkowego urlopu i turnusu, przerwa zostaje', async ({ page }) => {
  await page.getByLabel('Stopień niepełnosprawności').selectOption('lekki');
  await expect(page.locator('[data-w="doba"]')).toHaveText(/^do\s8\sgodzin/);
  await expect(page.locator('[data-wiersz="urlop"]')).toBeHidden();
  await expect(page.locator('[data-wiersz="turnus"]')).toBeHidden();
  await expect(page.locator('[data-wiersz="przerwa"]')).toBeVisible();
});

test('zgoda lekarza: 8 godzin i bez podwyżki stawki; błędna stawka', async ({ page }) => {
  await page.getByLabel(/Lekarz zgodził się/).check();
  await expect(page.locator('[data-w="doba"]')).toHaveText(/^do\s8\sgodzin/);
  await page.getByLabel(/Stawka za godzinę/).fill('abc');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
});

test('odmiana wymiaru: marzec 2027 r. 154 godziny, styczeń 2027 r. przy lekkim 152 godziny, luty 160 godzin', async ({ page }) => {
  await page.getByLabel('Rok').selectOption('2027');
  await page.getByLabel('Miesiąc').selectOption('3');
  await expect(page.locator('[data-w="wymiar"]')).toHaveText(/^154\sgodziny\s\(22\s×\s7\sgodzin\)$/);
  await page.getByLabel('Stopień niepełnosprawności').selectOption('lekki');
  await page.getByLabel('Miesiąc').selectOption('1');
  await expect(page.locator('[data-w="wymiar"]')).toHaveText(/^152\sgodziny\s\(19\s×\s8\sgodzin\)$/);
  await page.getByLabel('Miesiąc').selectOption('2');
  await expect(page.locator('[data-w="wymiar"]')).toHaveText(/^160\sgodzin\s\(20\s×\s8\sgodzin\)$/);
});

test('strona czytana w styczniu 2027 r. pokazuje bieżący miesiąc i rok', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-01-05T10:00:00+01:00'));
  await page.goto(NARZEDZIE_NIEPELNOSPRAWNY);
  await expect(page.getByLabel('Rok')).toHaveValue('2027');
  await expect(page.getByLabel('Miesiąc')).toHaveValue('1');
  await expect(page.locator('[data-w="wymiar-etykieta"]')).toHaveText(/styczeń\s2027/);
});
