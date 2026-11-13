import { expect, test } from '@playwright/test';
import { adresNarzedzia } from '../../src/data/narzedzia';

// Okres wyczekiwania: umowa o pracę od 1 marca 2026 r. → prawo od 31 marca 2026 r.; L4 od 10 marca: 21 dni bez zasiłku;
// zlecenie → 30 maja 2026 r.; wcześniejsza umowa do 30 stycznia (przerwa 29 dni) → od pierwszego dnia.
test.beforeEach(async ({ page }) => {
  await page.goto(adresNarzedzia('okres-wyczekiwania'));
  await page.getByLabel('Początek ubezpieczenia').fill('2026-03-01');
});

test('umowa o pracę od 1 marca: płatne od 31 marca, L4 od 10 marca 21 dni bez zasiłku', async ({ page }) => {
  await expect(page.locator('[data-w="prawo"]')).toHaveText(/^31\smarca\s2026\sr\.$/);
  await page.getByLabel('Pierwszy dzień L4').fill('2026-03-10');
  await expect(page.locator('[data-w="l4"]')).toContainText(/^21\sdni\sbez\szasiłku/);
});

test('zlecenie 90 dni; wcześniejsza umowa z przerwą 29 dni skraca do zera', async ({ page }) => {
  await page.getByLabel('Zlecenie, działalność (90 dni)').check();
  await expect(page.locator('[data-w="prawo"]')).toHaveText(/^30\smaja\s2026\sr\.$/);
  await page.getByLabel('Umowa o pracę (30 dni)').check();
  await page.locator('[name="od1"]').fill('2025-01-01');
  await page.locator('[name="do1"]').fill('2026-01-30');
  await expect(page.locator('[data-w="prawo"]')).toHaveText(/^1\smarca\s2026\sr\.$/);
});

test('wypadek w drodze bez czekania; okres po początku ubezpieczenia to błąd', async ({ page }) => {
  await page.getByLabel('Wypadek w drodze do lub z pracy').check();
  await expect(page.locator('[data-w="opis"]')).toContainText(/od\spierwszego\sdnia/);
  await page.locator('[name="od1"]').fill('2026-02-01');
  await page.locator('[name="do1"]').fill('2026-03-05');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
});

test('absolwent: uwaga o terminie bez „r..”; przy wypadku i spełnionym warunku absolwenta bez tej uwagi', async ({ page }) => {
  await page.getByLabel('Początek ubezpieczenia').fill('2026-12-16');
  await page.locator('#w-szkola').fill('2026-09-16');
  await expect(page.locator('[data-w="uwaga"]')).toContainText(/najpóźniej\s15\sgrudnia\s2026\sr\.$/);
  await expect(page.locator('[data-w="uwaga"]')).not.toContainText('r..');
  await page.getByLabel('Początek ubezpieczenia').fill('2028-03-01');
  await page.locator('#w-szkola').fill('2028-01-15');
  await page.locator('[name="wypadekPraca"]').check();
  await expect(page.locator('[data-w="uwaga"]')).not.toContainText('Wyjątek dla absolwenta działa');
});
