import { expect, test } from '@playwright/test';

// Rozkład 7:00–15:00, okres 1 miesiąc, wyjście 18.11.2026 (środa) 10:00–13:00 = 3 h.
// Odpracowanie 19.11 15:00–17:00 i 20.11 15:00–16:00: bilans 0, odpoczynek dobowy w porządku.
test.beforeEach(async ({ page }) => {
  await page.goto('/narzedzia/odpracowanie-wyjscia-prywatnego');
  await page.locator('[name="start"]').fill('07:00');
  await page.locator('[name="koniec"]').fill('15:00');
  await page.locator('[name="wdata"]').fill('2026-11-18');
  await page.locator('[name="wod"]').fill('10:00');
  await page.locator('[name="wdo"]').fill('13:00');
  await page.locator('[name="data1"]').fill('2026-11-19');
  await page.locator('[name="od1"]').fill('15:00');
  await page.locator('[name="do1"]').fill('17:00');
  await page.locator('[name="data2"]').fill('2026-11-20');
  await page.locator('[name="od2"]').fill('15:00');
  await page.locator('[name="do2"]').fill('16:00');
});

test('przykład startowy: wszystko odpracowane, odpoczynek dobowy w porządku', async ({ page }) => {
  await expect(page.locator('[data-w="zostalo"]')).toHaveText(/^0\smin$/);
  await expect(page.locator('[data-w="opis"]')).toContainText(/Wyjście\s3\sh,\sodpracowane\s3\sh/);
  await expect(page.locator('[data-w="lista"] li[data-stan="ok"]')).toHaveCount(2);
  await expect(page.locator('[data-w="lista"] li[data-stan="blad"]')).toHaveCount(0);
});

test('odpracowanie do 21:00: 10 h przerwy w dobie i 3 h nadgodzin', async ({ page }) => {
  await page.locator('[name="do1"]').fill('21:00');
  await page.locator('[name="data2"]').fill('');
  await page.locator('[name="od2"]').fill('');
  await page.locator('[name="do2"]').fill('');
  await expect(page.locator('[data-w="opis"]')).toContainText(/3\sh\sponad\swyjście/);
  const blad = page.locator('[data-w="lista"] li[data-stan="blad"]');
  await expect(blad).toContainText(/najdłuższa\sprzerwa\s10\sh/);
  await expect(page.locator('[data-w="lista"]')).toContainText(/Są\snadgodzinami,\sjeśli\sprzekraczają\s8\sgodzin/);
});

test('niedziela: uwaga o art. 151¹⁰; zmiana nocna z wyjściem 2:00–4:00', async ({ page }) => {
  await page.locator('[name="data2"]').fill('2026-11-15');
  await page.locator('[name="od2"]').fill('08:00');
  await page.locator('[name="do2"]').fill('09:00');
  await expect(page.locator('[data-w="lista"]')).toContainText(/niedzielę\salbo\sświęto/);
  await page.locator('[name="start"]').fill('22:00');
  await page.locator('[name="koniec"]').fill('06:00');
  await page.locator('[name="wod"]').fill('02:00');
  await page.locator('[name="wdo"]').fill('04:00');
  await page.locator('[name="data1"]').fill('2026-11-19');
  await page.locator('[name="od1"]').fill('06:00');
  await page.locator('[name="do1"]').fill('08:00');
  await page.locator('[name="data2"]').fill('');
  await page.locator('[name="od2"]').fill('');
  await page.locator('[name="do2"]').fill('');
  await expect(page.locator('[data-w="zostalo"]')).toHaveText(/^0\smin$/);
  await expect(page.locator('[data-blad="dane"]')).toBeHidden();
});

test('odpracowanie w godzinach zmiany to błąd danych', async ({ page }) => {
  await page.locator('[name="od1"]').fill('14:00');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.locator('[data-blad="dane"]')).toContainText(/nachodzi\sna\sgodziny\spracy/);
  await expect(page.locator('[data-w="zostalo"]')).toHaveText('—');
});
