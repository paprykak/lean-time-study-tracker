import { expect, test } from '@playwright/test';
import { NARZEDZIE_PRZESTOJ } from './strony';

// Przestój: pensja 6000 zł w listopadzie 2026 r. (160 h) → 37,50 zł za godzinę; stawka 25 zł podniesiona do minimum.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_PRZESTOJ);
  await page.getByLabel('Miesiąc', { exact: true }).selectOption('11');
  await page.getByLabel('Rok', { exact: true }).selectOption('2026');
});

test('pensja 6000 zł, 16 h w listopadzie 2026 r.: 600 zł', async ({ page }) => {
  await expect(page.locator('[data-w="za-godzine"]')).toHaveText('37,50 zł');
  await expect(page.locator('[data-w="kwota"]')).toHaveText('600,00 zł');
});

test('stawka godzinowa 25 zł: podniesiona do płacy minimalnej', async ({ page }) => {
  await page.getByLabel('Stawka godzinowa').check();
  await page.getByLabel('Stawka za godzinę (zł brutto)').fill('25');
  await expect(page.locator('[data-w="uwaga"]')).toBeVisible();
  await expect(page.locator('[data-w="kwota"]')).toHaveText('480,60 zł');
});

test('bez wyodrębnionej stawki: 60%', async ({ page }) => {
  await page.getByLabel(/Bez wyodrębnionej stawki/).check();
  await expect(page.locator('[data-w="za-godzine"]')).toHaveText('18,75 zł (60%)');
});

test('pół etatu, pensja 3000 zł, 8 h: 37,50 zł za godzinę, 300 zł', async ({ page }) => {
  await page.getByLabel('Pensja zasadnicza (zł brutto)').fill('3000');
  await page.getByLabel('Wymiar etatu').selectOption('0.5');
  await page.getByLabel('Godziny przestoju').fill('8');
  await expect(page.locator('[data-w="za-godzine"]')).toHaveText('37,50 zł');
  await expect(page.locator('[data-w="kwota"]')).toHaveText('300,00 zł');
  await expect(page.locator('[data-w="wymiar"]')).toHaveText(/^80\sh$/);
  await expect(page.locator('[data-w="uwaga"]')).toBeHidden();
});

test('legenda neutralna płciowo', async ({ page }) => {
  await expect(page.getByText('Forma wynagrodzenia', { exact: true })).toBeVisible();
});

test('strona sprzed Nowego Roku otwarta 5 stycznia 2027 r.: styczeń 2027', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-01-05T10:00:00+01:00'));
  await page.goto(NARZEDZIE_PRZESTOJ);
  await expect(page.getByLabel('Rok', { exact: true })).toHaveValue('2027');
  await expect(page.getByLabel('Miesiąc', { exact: true })).toHaveValue('1');
});
