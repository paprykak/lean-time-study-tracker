import { expect, test } from '@playwright/test';

// Nowa praca: terminy pracodawcy (art. 29 § 2–3 Kp, art. 36 ust. 4 ustawy systemowej, art. 16 ustawy o PPK): jak w start-w-pracy.test.ts.
test.beforeEach(async ({ page }) => {
  await page.goto('/narzedzia/informacja-o-warunkach-zatrudnienia');
});

test('start 16 listopada 2026 r.: informacja do 23 listopada, PPK do 10 marca', async ({ page }) => {
  await page.getByLabel('Pierwszy dzień pracy').fill('2026-11-16');
  await expect(page.locator('[data-w="informacja"]')).toHaveText(/^23\slistopada\s2026\sr\.$/);
  const lista = page.locator('[data-w="lista"]');
  await expect(lista).toContainText(/Zgłoszenie\sdo\subezpieczeń\sw\sZUS.*23\slistopada\s2026\sr\./);
  await expect(lista).toContainText(/16\sgrudnia\s2026\sr\./);
  await expect(lista).toContainText(/10\smarca\s2027\sr\./);
});

test('Wigilia: 7. dzień 24 grudnia bez przesunięcia (termin pracodawcy); bez PPK i regulaminu', async ({ page }) => {
  await page.getByLabel('Pierwszy dzień pracy').fill('2026-12-17');
  await expect(page.locator('[data-w="informacja"]')).toHaveText(/^24\sgrudnia\s2026\sr\.$/);
  await expect(page.locator('[data-w="lista"]')).not.toContainText('28 grudnia');
  await expect(page.locator('[data-w="bez-przesuniecia"]')).toContainText(/art\.\s115\sKodeksu\scywilnego/);
  await page.getByLabel('Są PPK').uncheck();
  await page.getByLabel('Jest regulamin pracy').uncheck();
  const lista = page.locator('[data-w="lista"]');
  await expect(lista).not.toContainText('PPK');
  await expect(lista).toContainText(/wypłacie,\sporze\snocnej/);
});

test('pusta data: komunikat błędu', async ({ page }) => {
  await page.getByLabel('Pierwszy dzień pracy').fill('');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.locator('[data-w="informacja"]')).toHaveText('—');
});

// Audyt jakości 4 (C-10, C-11): wyłączenie prac szczególnie niebezpiecznych tylko przy zmianie pracodawcy; linki.
test('FAQ o badaniach według art. 229 § 1¹ i linki do badań i monitoringu', async ({ page }) => {
  await expect(page.locator('main')).toContainText(/ten\sdrugi\swyjątek\snie\sdotyczy\sprac\sszczególnie\sniebezpiecznych/);
  await expect(page.locator('a[href="/narzedzia/badania-lekarskie-w-pracy"]').first()).toBeVisible();
  await expect(page.locator('a[href="/narzedzia/monitoring-w-pracy"]')).toHaveCount(1);
  await expect(page.locator('main')).toContainText(/pokaże\skalkulator\sbadań\slekarskich\sw\spracy/);
});
