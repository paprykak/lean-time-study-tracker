import { expect, test } from '@playwright/test';

// Wartości sprawdzone niezależnie w Pythonie (urlop-bezplatny.py):
// 1.03–31.05.2026 (92 dni), wymiar 26, powrót w tym samym roku: praca w 9 z 12 miesięcy, 26 × 9/12 = 19,5 → 20 dni;
// 10 lat stażu 15.06.2027 r. przesuwa się o 92 dni na 15.09.2027 r.; świadczenia zdrowotne do 31.03.2026 r.
// 1.11.2026–28.02.2027: za 2026 bez obniżenia (brak powrotu w tym roku) 26 dni, za 2027 10/12 → 22 dni.
test.beforeEach(async ({ page }) => {
  await page.goto('/narzedzia/urlop-bezplatny');
  await page.getByLabel('Od', { exact: true }).fill('2026-03-01');
  await page.getByLabel('Do', { exact: true }).fill('2026-05-31');
  await page.getByLabel('Roczny wymiar urlopu').fill('26');
  await page.getByLabel('Wykorzystany przed').fill('0');
  await page.getByLabel('Data 10 lat stażu bez urlopu bezpłatnego').fill('2027-06-15');
});

test('powrót w tym samym roku: 20 dni urlopu, staż później o 92 dni', async ({ page }) => {
  await expect(page.locator('[data-w="glowna"]')).toHaveText(/^20\sdni$/);
  await expect(page.locator('[data-w="lista"]')).toContainText(/praca\sw\s9\sz\s12\smiesięcy/);
  await expect(page.locator('[data-w="lista"]')).toContainText(/15\swrześnia\s2027\sr\.,\spóźniej\so\s92\sdni/);
  await expect(page.locator('[data-w="ubezpieczenia"]')).toContainText(/po\s31\smarca\s2026/);
  await expect(page.locator('[data-w="ochrona"]')).toContainText(/w\sczasie\surlopu\spracownika/);
});

test('15.03–14.05: 24 dni; urlop wychowawczy bez obniżenia; art. 174¹ z drugim odczytaniem', async ({ page }) => {
  await page.getByLabel('Od', { exact: true }).fill('2026-03-15');
  await page.getByLabel('Do', { exact: true }).fill('2026-05-14');
  await expect(page.locator('[data-w="glowna"]')).toHaveText(/^24\sdni$/);
  await page.getByLabel('Rodzaj').selectOption('wychowawczy');
  await expect(page.locator('[data-w="glowna"]')).toHaveText(/^26\sdni$/);
  await expect(page.locator('[data-w="lista"]')).toContainText(/bez\szmian:\s15\sczerwca\s2027/);
  await page.getByLabel('Rodzaj').selectOption('inny-pracodawca');
  await expect(page.locator('[data-w="glowna"]')).toHaveText(/^24\sdni$/);
  await expect(page.locator('[data-w="lista"]')).toContainText(/Drugie\sodczytanie\sza\s2026/);
  await expect(page.locator('[data-w="lista"]')).toContainText('174¹');
});

test('przełom roku: 26 dni za 2026 (brak powrotu w tym roku), 22 za 2027', async ({ page }) => {
  await page.getByLabel('Od', { exact: true }).fill('2026-11-01');
  await page.getByLabel('Do', { exact: true }).fill('2027-02-28');
  await expect(page.locator('[data-w="glowna"]')).toHaveText(/^26\sdni$/);
  await expect(page.locator('[data-w="lista"]')).toContainText(/brak\spowrotu\sw\stym\ssamym\sroku/);
  await expect(page.locator('[data-w="lista"]')).toContainText(/za\s2027\s*22\sdni/);
});

test('błędne dane: koniec przed początkiem i zły wymiar, komunikat role="alert" i aria-invalid', async ({ page }) => {
  const blad = page.locator('[data-blad="dane"]');
  await page.getByLabel('Do', { exact: true }).fill('2026-02-01');
  await expect(blad).toBeVisible();
  await expect(blad).toHaveAttribute('role', 'alert');
  await expect(blad).toHaveText('Koniec przed początkiem.');
  await expect(page.getByLabel('Do', { exact: true })).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('[data-w="glowna"]')).toHaveText('—');
  await page.getByLabel('Do', { exact: true }).fill('2026-05-31');
  await expect(blad).toBeHidden();
  const wymiar = page.getByLabel('Roczny wymiar urlopu');
  for (const zly of ['', '0', '1,5', '27']) {
    await wymiar.fill(zly);
    await expect(blad).toBeVisible();
    await expect(wymiar).toHaveAttribute('aria-invalid', 'true');
    await expect(page.getByLabel('Od', { exact: true })).toHaveAttribute('aria-invalid', 'false');
    await expect(page.locator('[data-w="glowna"]')).toHaveText('—');
  }
});
