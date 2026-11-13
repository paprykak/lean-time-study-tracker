import { expect, test } from '@playwright/test';
import { NARZEDZIE_PPK } from './strony';

// PPK 2026: 6000 zł, 2% i 1,5% → 131 zł mniej na rękę, 3010 zł na koncie po roku (ppk.test.ts).
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_PPK);
  await page.getByLabel('Pensja brutto miesięcznie (zł)').fill('6000');
});

test('6000 zł: koszt 131 zł miesięcznie, 3010 zł na koncie po roku', async ({ page }) => {
  await expect(page.locator('[data-w="koszt"]')).toHaveText(/^131,00\szł$/);
  await expect(page.locator('[data-w="na-koncie"]')).toHaveText(/^3010,00\szł$/);
  await expect(page.locator('[data-w="doplaty"]')).toHaveText(/^490,00\szł$/);
});

test('obniżona wpłata przy wysokiej pensji: komunikat', async ({ page }) => {
  await page.getByLabel('Twoja wpłata podstawowa').selectOption('0.5');
  await expect(page.locator('[data-blad="dane"]')).toContainText('tylko przy pensji do');
});

test('w 2027 r. próg obniżonej wpłaty z płacy minimalnej 2027 r. (strona zbudowana wcześniej)', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-01-05T10:00:00+01:00'));
  await page.goto(NARZEDZIE_PPK);
  await expect(page.locator('#k-pracownik-opis')).toHaveText(/5940,00\szł w\s2027\sr\./);
  await expect(page.locator('[data-w="rok-placy"]')).toHaveText(/2027\sr\.: 4950,00\szł/);
  await page.getByLabel('Pensja brutto miesięcznie (zł)').fill('5900');
  await page.getByLabel('Twoja wpłata podstawowa').selectOption('0.5');
  await expect(page.locator('[data-blad="dane"]')).toBeHidden();
});
