import { expect, test } from '@playwright/test';

// Zaległy urlop na dzień 12.11.2026: 2 dni za 2024 r. i 6 dni za 2025 r. (sprawdzone niezależnie w Pythonie).
// 2025: termin udzielenia 30.09.2026 (43 dni temu), przedawnienie najwcześniej 31.12.2028 (za 780 dni), później 30.09.2029.
// 2024: przedawnienie najwcześniej 31.12.2027 (za 414 dni). Koniec umowy 15.03.2026: ekwiwalent, przedawnienie 15.03.2029.
test.beforeEach(async ({ page }) => {
  await page.goto('/narzedzia/zalegly-urlop');
  await page.locator('[name="rok1"]').fill('2024');
  await page.locator('[name="dni1"]').fill('2');
  await page.locator('[name="rok2"]').fill('2025');
  await page.locator('[name="dni2"]').fill('6');
  await page.locator('[name="naDzien"]').fill('2026-11-12');
});

test('dwa lata: 8 dni, najbliższe przedawnienie 31 grudnia 2027 r.', async ({ page }) => {
  await expect(page.locator('[data-w="glowny"]')).toHaveText(/^8\sdni$/);
  await expect(page.locator('[data-w="opis"]')).toContainText(/za\s2024\sr\.:\s31\sgrudnia\s2027/);
  await expect(page.locator('[data-w="status"]')).toHaveText(/Zostało:\s414\sdni/);
  const r2025 = page.locator('[data-rok="2025"]');
  await expect(r2025).toContainText(/30\swrześnia\s2026\sr\.\s\(43\sdni\stemu\)/);
  await expect(r2025).toContainText(/31\sgrudnia\s2028\sr\.\s\(za\s780\sdni\)/);
  await expect(r2025).toContainText(/30\swrześnia\s2029/);
});

test('urlop wychowawczy 1.03–31.08.2026 przesuwa przedawnienie za 2025 r. na 3 lipca 2029 r.', async ({ page }) => {
  await page.locator('[name="wychOd"]').fill('2026-03-01');
  await page.locator('[name="wychDo"]').fill('2026-08-31');
  await expect(page.locator('[data-rok="2025"]')).toContainText(/3\slipca\s2029\sr\./);
  await expect(page.locator('[data-rok="2025"]')).toContainText(/184\sdni/);
});

test('koniec umowy 15.03.2026: ekwiwalent za 8 dni, przedawnienie 15 marca 2029 r.', async ({ page }) => {
  await page.locator('[name="koniecUmowy"]').fill('2026-03-15');
  await expect(page.locator('[data-w="etykieta"]')).toHaveText(/Ekwiwalent/);
  await expect(page.locator('[data-w="glowny"]')).toHaveText(/^8\sdni$/);
  await expect(page.locator('[data-w="opis"]')).toContainText(/15\smarca\s2029/);
  await expect(page.locator('[data-w="ekwiwalent"]')).toContainText(/25\smarca\s2026/);
});

test('błędne dane: rok po dniu sprawdzenia, dni ujemne, rok przed 2000', async ({ page }) => {
  const blad = page.locator('[data-blad="dane"]');
  await page.locator('[name="rok2"]').fill('2027');
  await expect(blad).toBeVisible();
  await expect(page.locator('[data-w="glowny"]')).toHaveText('—');
  await page.locator('[name="rok2"]').fill('2025');
  await expect(blad).toBeHidden();
  await page.locator('[name="dni2"]').fill('-3');
  await expect(blad).toBeVisible();
  await page.locator('[name="dni2"]').fill('6');
  await page.locator('[name="rok1"]').fill('1999');
  await expect(blad).toContainText(/2000/);
});
