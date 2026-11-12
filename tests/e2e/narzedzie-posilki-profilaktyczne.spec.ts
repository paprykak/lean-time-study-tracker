import { expect, test } from '@playwright/test';

const ADRES = '/narzedzia/posilki-profilaktyczne';

// Posiłki profilaktyczne (§ 3 rozporządzenia z 1996 r.): stałe daty, progi „powyżej”, okres zimowy 1.11–31.03,
// kJ przeliczane 1 kcal = 4,1868 kJ (6280,1 kJ przekracza próg 6280 kJ w chłodni).
test.beforeEach(async ({ page }) => {
  await page.goto(ADRES);
  await page.locator('[name="data"]').fill('2026-06-10');
});

test('hala: 2000 kcal u mężczyzn to nie „powyżej”, 2001 kcal tak', async ({ page }) => {
  await page.locator('[name="plec"][value="mezczyzn"]').check();
  await page.locator('[name="wydatek"]').fill('2000');
  await expect(page.locator('[data-w="naglowek"]')).toHaveText(/^nie\snależy\ssię$/);
  await expect(page.locator('[data-w="napoje"]')).toContainText(/§\s4\sust\.\s1\spkt\s4/);
  await page.locator('[name="wydatek"]').fill('2001');
  await expect(page.locator('[data-w="naglowek"]')).toHaveText(/^należy\ssię$/);
  await expect(page.locator('[data-w="podstawa"]')).toContainText(/§\s3\sust\.\s1\spkt\s1/);
});

test('na zewnątrz u kobiet: 1001 kcal 1 listopada tak, 1 kwietnia nie', async ({ page }) => {
  await page.getByLabel('Miejsce pracy').selectOption('zewnatrz');
  await page.locator('[name="plec"][value="kobiet"]').check();
  await page.locator('[name="wydatek"]').fill('1001');
  await page.locator('[name="data"]').fill('2026-11-01');
  await expect(page.locator('[data-w="naglowek"]')).toHaveText(/^należy\ssię$/);
  await expect(page.locator('[data-w="zima"]')).toContainText(/31\smarca\s2027/);
  await page.locator('[name="data"]').fill('2027-04-01');
  await expect(page.locator('[data-w="naglowek"]')).toHaveText(/^nie\snależy\ssię$/);
});

test('chłodnia w kJ i okno posiłku przez północ', async ({ page }) => {
  await page.getByLabel('Miejsce pracy').selectOption('chlodnia');
  await page.locator('[name="plec"][value="mezczyzn"]').check();
  await page.getByLabel('Jednostka').selectOption('kJ');
  await page.locator('[name="wydatek"]').fill('6280');
  await expect(page.locator('[data-w="naglowek"]')).toHaveText(/^nie\snależy\ssię$/);
  await page.locator('[name="wydatek"]').fill('6280,1');
  await expect(page.locator('[data-w="naglowek"]')).toHaveText(/^należy\ssię$/);
  await page.locator('[name="start"]').fill('22:00');
  await expect(page.locator('[data-w="kiedy"]')).toContainText(/01:00–02:00/);
});

test('błąd danych: wydatek bez wyboru progów i liczba z literami', async ({ page }) => {
  await expect(page.locator('[data-w="naglowek"]')).toHaveText(/^zależy\sod\swydatku$/);
  await page.locator('[name="wydatek"]').fill('2100');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await page.locator('[name="plec"][value="mezczyzn"]').check();
  await expect(page.locator('[data-blad="dane"]')).toBeHidden();
  await page.locator('[name="wydatek"]').fill('abc');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.locator('[data-w="naglowek"]')).toHaveText('—');
});
