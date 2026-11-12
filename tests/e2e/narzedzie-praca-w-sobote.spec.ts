import { expect, test } from '@playwright/test';

// Praca w wolną sobotę: 21 listopada 2026 r., 6:00–16:00, 35 zł → dzień wolny do 30 listopada; A 35 zł, B 280 + 35 zł.
test.beforeEach(async ({ page }) => {
  await page.goto('/narzedzia/praca-w-sobote');
});

test('sobota 21 listopada 2026 r., 6:00–16:00: dzień wolny do 30 listopada, dodatki w obu wariantach', async ({ page }) => {
  await expect(page.locator('[data-w="data"]')).toHaveText(/^30\slistopada\s2026\sr\.$/);
  await expect(page.locator('[data-w="godziny"]')).toHaveText(/^10\sh:\s8\sh\s\+\s2\sh\snadgodzin\sdobowych$/);
  const a = page.locator('[data-w="a"]');
  await expect(a.locator('div').nth(1)).toContainText(/dodatek\s50%\s*35,00\szł/);
  const b = page.locator('[data-w="b"]');
  await expect(b.locator('div').nth(0)).toContainText(/8\sh\sponad\swymiar\sokresu,\sdodatek\s100%\s*280,00\szł/);
  await expect(b.locator('div').nth(1)).toContainText(/2\sh\snadgodzin,\sdodatek\s50%\s*35,00\szł/);
});

test('nocna zmiana 18:00–6:00, okres 3 miesiące: 4 h nadgodzin w porze nocnej po 100%, termin 31 grudnia', async ({ page }) => {
  await page.getByLabel('Data pracy (dzień wolny z grafiku)').fill('2026-11-28');
  await page.getByLabel('Od', { exact: true }).fill('18:00');
  await page.getByLabel('Do', { exact: true }).fill('06:00');
  await page.getByLabel('Okres rozliczeniowy (od stycznia)').selectOption('3');
  await expect(page.locator('[data-w="data"]')).toHaveText(/^31\sgrudnia\s2026\sr\.$/);
  await expect(page.locator('[data-w="a"] div').nth(1)).toContainText(/4\sh\snadgodzin\sw\sporze\snocnej,\sdodatek\s100%\s*140,00\szł/);
  await page.getByLabel('Stawka za godzinę (zł)').fill('');
  await expect(page.locator('[data-w="b"] div').nth(0)).toContainText('100% stawki za godzinę');
});

test('święto w sobotę (26 grudnia 2026 r.): inne zasady, odesłanie do kalkulatora niedzieli', async ({ page }) => {
  await page.getByLabel('Data pracy (dzień wolny z grafiku)').fill('2026-12-26');
  await expect(page.locator('[data-w="naglowek"]')).toHaveText('Ten dzień to niedziela albo święto');
  await expect(page.locator('[data-w="uwagi"]')).toContainText(/kalkulator\spracy\sw\sniedzielę\si\sświęto/);
  await expect(page.locator('[data-w="warianty"]')).toBeHidden();
  await expect(page.locator('#jak-liczymy ~ p a[href="/narzedzia/praca-w-niedziele"]')).toBeVisible();
});

test('błędne dane: koniec równy początkowi, brak godziny, ujemna stawka', async ({ page }) => {
  await page.getByLabel('Do', { exact: true }).fill('06:00');
  await expect(page.locator('[data-blad="godziny"]')).toHaveText('Koniec pracy musi być inny niż początek.');
  await expect(page.locator('[data-w="data"]')).toHaveText('—');
  await page.getByLabel('Od', { exact: true }).fill('');
  await expect(page.locator('[data-blad="godziny"]')).toContainText('Wpisz godziny pracy');
  await page.getByLabel('Od', { exact: true }).fill('07:00');
  await expect(page.locator('[data-blad="godziny"]')).toBeHidden();
  await page.getByLabel('Stawka za godzinę (zł)').fill('-5');
  await expect(page.locator('[data-blad="stawka"]')).toBeVisible();
  await expect(page.locator('[data-w="warianty"]')).toBeHidden();
});
