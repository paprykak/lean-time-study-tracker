import { expect, test } from '@playwright/test';
import { NARZEDZIE_KG } from './strony';

// Ile kg wolno dźwigać: granice z § 13 i § 17 rozporządzenia o ręcznych pracach transportowych, ciąża, młodociani,
// porównanie ładunku i mapa regału (dolne półki: podnoszenie, górne: powyżej barków).
const limit = (page: import('@playwright/test').Page) => page.locator('[data-w="limit"]');

test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_KG);
});

test('mężczyzna, praca stała: 30 kg, regał 30 i 21 kg', async ({ page }) => {
  await expect(limit(page)).toHaveText('30 kg');
  await expect(page.locator('[data-w="regal-dol"]')).toHaveText('30 kg');
  await expect(page.locator('[data-w="regal-gora"]')).toHaveText('21 kg');
});

test('kobieta, praca dorywcza, ładunek 25 kg: przekracza o 5 kg', async ({ page }) => {
  await page.getByLabel('Kto dźwiga').selectOption('kobieta');
  await page.getByLabel('Praca dorywcza').check();
  await page.getByLabel('Masa ładunku w kg (opcjonalnie)').fill('25');
  await expect(limit(page)).toHaveText('20 kg');
  await expect(page.locator('[data-w="status"]')).toHaveText('25 kg przekracza granicę o 5 kg');
  await expect(page.locator('[data-w="regal-gora"]')).toHaveText('14 kg');
});

test('ciąża, przenoszenie zespołowe: zakaz', async ({ page }) => {
  await page.getByLabel('Kto dźwiga').selectOption('ciaza');
  await page.getByLabel('Co robi').selectOption('zespolowo');
  await expect(limit(page)).toHaveText('Zakaz');
  await expect(page.locator('[data-w="uwaga"]')).toHaveText('Tej osobie nie wolno wykonywać tej pracy.');
});

test('młodociana, praca stała: 7,2 kg i uwaga o pracach wzbronionych', async ({ page }) => {
  await page.getByLabel('Kto dźwiga').selectOption('mlodociana');
  await expect(limit(page)).toHaveText('7,2 kg');
  await expect(page.locator('[data-w="uwaga"]')).toContainText('Młodocianym nie wolno');
});

test('błędna masa: komunikat', async ({ page }) => {
  await page.getByLabel('Masa ładunku w kg (opcjonalnie)').fill('dużo');
  await expect(page.getByText('Wpisz masę w kilogramach')).toBeVisible();
});

test.describe('bez JavaScriptu', () => {
  test.use({ javaScriptEnabled: false });
  test('tabela dla dorosłych jest w HTML', async ({ page }) => {
    await page.goto(NARZEDZIE_KG);
    const wiersz = page.locator('#tabela ~ .tabela tr', { hasText: 'Podnoszenie powyżej barków' }).first();
    await expect(wiersz).toContainText('21 kg');
    await expect(wiersz).toContainText('8 kg');
  });
});
