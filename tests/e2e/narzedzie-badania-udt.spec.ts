import { expect, test } from '@playwright/test';
import { NARZEDZIE_BADANIA_UDT } from './strony';

// Badania UDT i przeglądy: wózek widłowy co rok i co 30 dni, suwnica co 2 lata, dozór uproszczony bez badań.
const dzis = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Warsaw' }).format(new Date());
const zaMiesiecy = (n: number) => {
  const d = new Date();
  d.setUTCDate(15);
  d.setUTCMonth(d.getUTCMonth() + n);
  return d.toISOString().slice(0, 10);
};

test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_BADANIA_UDT);
});

test('wózek widłowy: badanie za rok, przegląd za 30 dni, plik kalendarza', async ({ page }) => {
  await expect(page.locator('[data-w="forma"]')).toHaveText('pełny: badanie okresowe co rok');
  await page.getByLabel('Ostatnie badanie UDT').fill('2026-03-17');
  await expect(page.locator('[data-w="badanie"]')).toHaveText('marzec 2027');
  await page.getByLabel('Ostatni przegląd konserwacyjny').fill(dzis());
  await expect(page.locator('[data-w="przeglad"]')).toContainText('za 30 dni');
  const pobranie = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Dodaj do kalendarza (.ics)' }).click();
  expect((await pobranie).suggestedFilename()).toBe('badania-udt.ics');
});

test('suwnica: badanie okresowe co 2 lata, po terminie z ostrzeżeniem', async ({ page }) => {
  await page.getByLabel('Urządzenie', { exact: true }).selectOption('suwnica-mech');
  await expect(page.locator('[data-w="forma"]')).toHaveText('pełny: badanie okresowe co 2 lata');
  await page.getByLabel('Ostatnie badanie UDT').fill(zaMiesiecy(-25));
  await expect(page.locator('[data-w="status-badania"]')).toHaveText('Po terminie: 1 miesiąc temu');
  await expect(page.locator('[data-w="uwaga"]')).toBeVisible();
});

test('dozór uproszczony: bez badania UDT i bez pola daty badania', async ({ page }) => {
  await page.getByLabel('Urządzenie', { exact: true }).selectOption('do-250');
  await expect(page.locator('[data-w="badanie"]')).toHaveText('Nie dotyczy');
  await expect(page.getByLabel('Ostatnie badanie UDT')).toBeHidden();
});

test('tabela z rozporządzenia działa bez JavaScriptu', async ({ browser }) => {
  const ctx = await browser.newContext({ javaScriptEnabled: false });
  const p = await ctx.newPage();
  await p.goto(NARZEDZIE_BADANIA_UDT);
  await expect(p.getByRole('row', { name: /Układnica magazynowa/ })).toContainText('co rok');
  await ctx.close();
});

test('lista ma krótkie nazwy, a pełna nazwa z załącznika jest w opisie pod polem', async ({ page }) => {
  await expect(page.getByLabel('Urządzenie', { exact: true }).locator('option:checked')).toHaveText('Wózek z siedziskiem');
  await expect(page.locator('[data-w="rodzaj-opis"]')).toHaveText(/^Wózek\swidłowy\si\sinny\spodnośnikowy\sz\ssiedziskiem\salbo\spodestem\soperatora\.\sDozór\spełny/);
});

test.describe('telefon 320 px', () => {
  test.use({ viewport: { width: 320, height: 640 } });
  test('żadna opcja listy urządzeń nie jest szersza niż pole', async ({ page }) => {
    const uciete = await page.locator('#utb-rodzaj').evaluate((el) => {
      const s = el as HTMLSelectElement;
      const styl = getComputedStyle(s);
      const ctx = document.createElement('canvas').getContext('2d')!;
      ctx.font = `${styl.fontWeight} ${styl.fontSize} ${styl.fontFamily}`;
      const miejsce = s.clientWidth - 40;
      return [...s.options].filter((o) => ctx.measureText(o.text).width > miejsce).map((o) => o.text);
    });
    expect(uciete).toEqual([]);
  });
});
