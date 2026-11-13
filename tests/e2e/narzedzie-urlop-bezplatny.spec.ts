import { expect, test } from '@playwright/test';

// Urlop bezpłatny 1.03–31.05.2026 (92 dni), wymiar 26: praca w 9 z 12 miesięcy, 26 × 9/12 = 19,5 → 20 dni;
// 10 lat stażu 15.06.2027 r. przesuwa się o 92 dni na 15.09.2027 r.; świadczenia zdrowotne do 31.03.2026 r.
// Wartości sprawdzone niezależnie w Pythonie.
test.beforeEach(async ({ page }) => {
  await page.goto('/narzedzia/urlop-bezplatny');
  await page.locator('[name="od"]').fill('2026-03-01');
  await page.locator('[name="do"]').fill('2026-05-31');
  await page.locator('[name="wymiar"]').fill('26');
  await page.locator('[name="wykorzystane"]').fill('0');
  await page.locator('[name="staz"]').fill('2027-06-15');
});

test('trzy pełne miesiące: 20 dni urlopu, staż później o 92 dni', async ({ page }) => {
  await expect(page.locator('[data-w="glowna"]')).toHaveText(/^20\sdni$/);
  await expect(page.locator('[data-w="lista"]')).toContainText(/praca\sw\s9\sz\s12\smiesięcy/);
  await expect(page.locator('[data-w="lista"]')).toContainText(/15\swrześnia\s2027\sr\.,\spóźniej\so\s92\sdni/);
  await expect(page.locator('[data-w="ubezpieczenia"]')).toContainText(/po\s31\smarca\s2026/);
});

test('15.03–14.05: tylko kwiecień bez pracy, 24 dni; urlop wychowawczy bez obniżenia', async ({ page }) => {
  await page.locator('[name="od"]').fill('2026-03-15');
  await page.locator('[name="do"]').fill('2026-05-14');
  await expect(page.locator('[data-w="glowna"]')).toHaveText(/^24\sdni$/);
  await page.getByLabel('Rodzaj').selectOption('wychowawczy');
  await expect(page.locator('[data-w="glowna"]')).toHaveText(/^26\sdni$/);
  await expect(page.locator('[data-w="lista"]')).toContainText(/bez\szmian:\s15\sczerwca\s2027/);
});

test('przełom roku: po 22 dni za 2026 i 2027; koniec przed początkiem to błąd', async ({ page }) => {
  await page.locator('[name="od"]').fill('2026-11-01');
  await page.locator('[name="do"]').fill('2027-02-28');
  await expect(page.locator('[data-w="lista"]')).toContainText(/za\s2027\s*22\sdni/);
  await page.locator('[name="do"]').fill('2026-10-01');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.locator('[data-blad="dane"]')).toHaveText('Koniec przed początkiem.');
  await expect(page.locator('[data-w="glowna"]')).toHaveText('—');
});
