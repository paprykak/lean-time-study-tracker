import { expect, test, type Page } from '@playwright/test';
import { NARZEDZIE_AGENCJA } from './strony';

// Limit pracy przez agencję: 18 miesięcy (540 dni) w 36 miesiącach. Daty w przyszłości, żeby wynik nie zależał od dnia
// testu (do 2028 r.); wartości policzone niezależnie, dzień po dniu (praca-tymczasowa.test.ts).
const wpisz = async (page: Page, skierowania: [string, string][]) => {
  for (let i = 0; i < 4; i++) {
    const [od, do_] = skierowania[i] ?? ['', ''];
    await page.locator(`#a-od-${i}`).fill(od);
    await page.locator(`#a-do-${i}`).fill(do_);
  }
};

test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_AGENCJA);
});

test('pół roku pracy: dalej bez przerwy do 23 czerwca 2029 r., potem od 1 stycznia 2031 r.', async ({ page }) => {
  await wpisz(page, [['2028-01-01', '2028-06-30']]);
  await expect(page.locator('[data-w="naglowek"]')).toHaveText('Bez przerwy możesz pracować do');
  await expect(page.locator('[data-w="data"]')).toHaveText('23 czerwca 2029 r.');
  await expect(page.locator('[data-w="okno"]')).toHaveText('182 z 540 dni');
  await expect(page.locator('[data-w="potem"]')).toHaveText('1 stycznia 2031 r.');
});

test('540 dni bez przerwy: limit wykorzystany, znów od 1 stycznia 2031 r.', async ({ page }) => {
  await wpisz(page, [['2028-01-01', '2029-06-23']]);
  await expect(page.locator('[data-w="naglowek"]')).toHaveText('Limit wykorzystany, znów od');
  await expect(page.locator('[data-w="data"]')).toHaveText('1 stycznia 2031 r.');
});

test('przekroczenie w drugim skierowaniu: data i ostrzeżenie', async ({ page }) => {
  await wpisz(page, [['2029-03-01', '2029-09-30'], ['2028-01-01', '2028-12-31']]);
  await expect(page.locator('[data-w="naglowek"]')).toHaveText('Limit przekroczony od');
  await expect(page.locator('[data-w="data"]')).toHaveText('22 sierpnia 2029 r.');
  await expect(page.locator('[data-w="uwaga"]')).toContainText('art. 20 ust. 5–8');
});

test('zachodzące daty: komunikat', async ({ page }) => {
  await wpisz(page, [['2028-01-01', '2028-06-30'], ['2028-06-01', '2028-12-31']]);
  await expect(page.getByText('Skierowania nie mogą na siebie zachodzić')).toBeVisible();
});
