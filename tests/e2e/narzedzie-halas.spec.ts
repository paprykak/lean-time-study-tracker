import { expect, test } from '@playwright/test';
import { NARZEDZIE_HALAS } from './strony';

// Hałas: L_EX,8h = 10·lg(Σ t/8 · 10^(L/10)); NDN 85 dB, próg działania 80 dB (Dz.U. 2018 poz. 1286, 2005 poz. 1318).
const ustaw = async (page: import('@playwright/test').Page, okresy: [string, string][]) => {
  for (let i = 0; i < 4; i++) {
    await page.getByLabel(`Hałas ${i + 1}: poziom (dB)`).fill(okresy[i]?.[0] ?? '');
    await page.getByLabel(`Hałas ${i + 1}: godziny`).fill(okresy[i]?.[1] ?? '');
  }
};

test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_HALAS);
});

test('4 h przy 88 dB i 4 h przy 80 dB: 85,6 dB, przekroczona norma', async ({ page }) => {
  await ustaw(page, [['88', '4'], ['80', '4']]);
  await expect(page.locator('[data-w="lex"]')).toHaveText(/^85,6\sdB$/);
  await expect(page.locator('[data-w="status"]')).toHaveText(/^Przekroczona norma 85\sdB$/);
});

test('8 h przy 83 dB: powyżej progu działania; 12 h przy 85 dB: 86,8 dB', async ({ page }) => {
  await ustaw(page, [['83', '8']]);
  await expect(page.locator('[data-w="status"]')).toHaveText(/^Powyżej progu działania 80\sdB$/);
  await ustaw(page, [['85', '12']]);
  await expect(page.locator('[data-w="lex"]')).toHaveText(/^86,8\sdB$/);
});

test('kobieta w ciąży: 70 dB to praca wzbroniona', async ({ page }) => {
  await ustaw(page, [['70', '8']]);
  await page.getByLabel('Kto pracuje').selectOption('ciaza');
  await expect(page.locator('[data-w="status"]')).toContainText('Praca wzbroniona');
});

test('bez danych: błąd', async ({ page }) => {
  await ustaw(page, []);
  await expect(page.locator('#h-blad')).toHaveText('Wpisz co najmniej jeden poziom hałasu i czas.');
});

test('błędny poziom: komunikat i aria-invalid na polu, po poprawce zdjęte', async ({ page }) => {
  await page.locator('#h-poziom-0').fill('abc');
  await expect(page.locator('#h-poziom-0')).toHaveAttribute('aria-invalid', 'true');
  await page.locator('#h-poziom-0').fill('85');
  await expect(page.locator('#h-poziom-0')).toHaveAttribute('aria-invalid', 'false');
});
