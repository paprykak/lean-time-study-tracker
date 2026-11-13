import { expect, test } from '@playwright/test';
import { NARZEDZIE_POSMIERTNA } from './strony';

// Odprawa pośmiertna (art. 93 Kp): 6000 zł, 12 lat → 3 pensje.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_POSMIERTNA);
  await page.getByLabel(/Pensja brutto/).fill('6000');
  await page.getByLabel('Pełne lata u pracodawcy').fill('12');
});

test('dwie osoby: 18 000 zł po 9000 zł', async ({ page }) => {
  await page.getByLabel('Uprawnione osoby').fill('2');
  await expect(page.locator('[data-w="razem"]')).toHaveText(/^18\s000,00\szł$/);
  await expect(page.locator('[data-w="osoba"]')).toHaveText(/^9000,00\szł$/);
});

test('jedna osoba: połowa', async ({ page }) => {
  await page.getByLabel('Uprawnione osoby').fill('1');
  await expect(page.locator('[data-w="razem"]')).toHaveText(/^9000,00\szł$/);
  await expect(page.locator('[data-w="opis"]')).toContainText('Połowa z 3 miesięcznych wynagrodzeń');
});

test('ubezpieczenie od pracodawcy: dopłata różnicy', async ({ page }) => {
  await page.getByLabel('Uprawnione osoby').fill('2');
  await page.getByLabel(/ubezpieczenia na życie/).fill('10000');
  await expect(page.locator('[data-w="razem"]')).toHaveText(/^8000,00\szł$/);
  await expect(page.locator('[data-w="osoba"]')).toHaveText(/^4000,00\szł$/);
});

test('15 lat: 6 pensji', async ({ page }) => {
  await page.getByLabel('Pełne lata u pracodawcy').fill('15');
  await page.getByLabel('Uprawnione osoby').fill('3');
  await expect(page.locator('[data-w="razem"]')).toHaveText(/^36\s000,00\szł$/);
});

test('bez osób: błąd', async ({ page }) => {
  await page.getByLabel('Uprawnione osoby').fill('0');
  await expect(page.locator('#p-blad')).toHaveText(/Wpisz\sliczbę\suprawnionych\sosób:\sod\s1\sdo\s20\./);
});
