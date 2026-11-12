import { expect, test } from '@playwright/test';

// Urlop szkoleniowy (art. 103^2 Kp, sprawdzone niezależnie w Pythonie): egzamin zawodowy 6 dni = 72 h przy 12 h,
// matura + egzamin zawodowy 12 dni = 96 h przy 8 h, ostatni rok studiów 21 dni = 252 h przy 12 h.
test.beforeEach(async ({ page }) => {
  await page.goto('/narzedzia/urlop-szkoleniowy');
});

test('egzamin zawodowy przy zmianie 12 h: 6 dni, 72 h', async ({ page }) => {
  await expect(page.locator('[data-w="dni"]')).toHaveText(/^6\sdni$/);
  await expect(page.locator('[data-w="opis"]')).toContainText(/^72\sh\sprzy\szmianie\s12\sh/);
});

test('matura i egzamin zawodowy przy 8 h: 12 dni, 96 h', async ({ page }) => {
  await page.getByLabel('Egzamin maturalny').check();
  await page.getByLabel('8 h').check();
  await expect(page.locator('[data-w="dni"]')).toHaveText(/^12\sdni$/);
  await expect(page.locator('[data-w="opis"]')).toContainText(/^96\sh/);
  await expect(page.locator('[data-w="pozycje"]')).toContainText(/matura:\s6\sdni;\segzamin\szawodowy:\s6\sdni/);
});

test('ostatni rok studiów przy 12 h: 21 dni, 252 h', async ({ page }) => {
  await page.getByLabel('Egzamin zawodowy').uncheck();
  await page.getByLabel('Ostatni rok studiów').check();
  await expect(page.locator('[data-w="dni"]')).toHaveText(/^21\sdni$/);
  await expect(page.locator('[data-w="opis"]')).toContainText(/^252\sh/);
});

test('bez zgody pracodawcy: 0 dni i uprawnienia z art. 103^6', async ({ page }) => {
  await page.getByLabel('Nie', { exact: true }).check();
  await expect(page.locator('[data-w="dni"]')).toHaveText(/^0\sdni$/);
  await expect(page.locator('[data-gdy="nie"]')).toBeVisible();
  await expect(page.locator('[data-gdy="nie"]')).toContainText(/urlop\sbezpłatny/);
  await expect(page.locator('[data-gdy="tak"]')).toBeHidden();
});

test('inna zmiana: 7,5 h daje 45 h, 0 i 25 h to błąd', async ({ page }) => {
  await page.getByLabel('Inna', { exact: true }).check();
  const pole = page.getByLabel('Godziny na zmianie');
  await pole.fill('7,5');
  await expect(page.locator('[data-w="opis"]')).toContainText(/^45\sh/);
  await pole.fill('0');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.locator('[data-w="dni"]')).toHaveText('—');
  await pole.fill('25');
  await expect(page.locator('[data-blad="dane"]')).toContainText(/24\sgodziny/);
});
