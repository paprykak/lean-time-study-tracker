import { expect, test } from '@playwright/test';

// Terminy zgłoszeń pracy cudzoziemca: jak w cudzoziemiec-terminy.test.ts.
test.beforeEach(async ({ page }) => {
  await page.goto('/narzedzia/zgloszenie-pracy-cudzoziemca');
});

test('ochrona czasowa: urząd pracy do 19 listopada, po zmianie do 7 stycznia', async ({ page }) => {
  await page.getByLabel('Pierwszy dzień pracy').fill('2026-11-12');
  await page.getByLabel('Zmiana umowy lub stawki').fill('2026-12-31');
  const lista = page.locator('[data-w="lista"]');
  await expect(lista).toContainText(/19\slistopada\s2026\sr\./);
  await expect(lista).toContainText(/7\sstycznia\s2027\sr\./);
});

test('zezwolenie: niepodjęcie pracy do 7 maja, kolejne zezwolenie do 28 lutego 2029 r.', async ({ page }) => {
  await page.getByLabel('Na jakiej podstawie').selectOption('zezwolenie');
  await page.getByLabel('Zezwolenie ważne od').fill('2026-03-01');
  await page.getByLabel('Zezwolenie ważne do').fill('2029-02-28');
  const lista = page.locator('[data-w="lista"]');
  await expect(lista).toContainText(/7\smaja\s2026\sr\./);
  await expect(lista).toContainText(/Wniosek\so\skolejne\szezwolenie.*28\slutego\s2029\sr\./);
});

test('oświadczenie: koniec przed startem daje błąd', async ({ page }) => {
  await page.getByLabel('Na jakiej podstawie').selectOption('oswiadczenie');
  await page.getByLabel('Start pracy z ewidencji').fill('2027-01-01');
  await page.getByLabel('Koniec pracy z oświadczenia').fill('2026-12-31');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.locator('[data-w="lista"] li')).toHaveCount(0);
});
