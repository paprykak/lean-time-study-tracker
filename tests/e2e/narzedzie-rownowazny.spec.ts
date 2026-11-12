import { expect, test } from '@playwright/test';

// Równoważny czas pracy, listopad 2026 r.: wymiar 160 h. 12 h: 13 zmian po 12 h i 1 zmiana 4 h (14 dni pracy),
// 16 dni wolnych, minimum z art. 147: 10. 24 h: 6 zmian po 24 h i 1 zmiana 16 h. Weekendowy, luty 2027 r.:
// 12 dni po 12 h = 144 h, brakuje 16 h.
test.beforeEach(async ({ page }) => {
  await page.goto('/narzedzia/rownowazny-czas-pracy');
  await page.locator('[name="miesiac"]').selectOption('11');
  await page.locator('[name="rok"]').selectOption('2026');
});

test('12 h, listopad 2026: 14 dni pracy, 16 dni wolnych; 3 miesiące tylko w szczególnych przypadkach', async ({ page }) => {
  await expect(page.locator('[data-w="glowny"]')).toHaveText(/^14\sdni\spracy$/);
  await expect(page.locator('[data-w="opis"]')).toHaveText(/13\szmian\spo\s12\sh\si\s1\szmiana\s4\sh/);
  await expect(page.locator('[data-w="wolne"]')).toContainText(/16\sdni;\sminimum\sz\sart\.\s147\sKp:\s10/);
  await expect(page.locator('[data-w="status"]')).toHaveAttribute('data-status', 'w-terminie');
  await page.locator('[name="miesiac"]').selectOption('1');
  await page.locator('[name="rok"]').selectOption('2027');
  await page.locator('[name="okres"]').selectOption('3');
  await expect(page.locator('[data-w="status"]')).toContainText(/szczególnie\suzasadnionych/);
  await expect(page.locator('[data-w="glowny"]')).toHaveText(/^41\sdni\spracy$/);
});

test('24 h (ochrona): 6 zmian po 24 h i 1 zmiana 16 h, odpoczynek co najmniej 24 h', async ({ page }) => {
  await page.locator('[name="system"]').selectOption('r24');
  await expect(page.locator('[name="zmiana"]')).toHaveValue('24');
  await expect(page.locator('[data-w="opis"]')).toHaveText(/6\szmian\spo\s24\sh\si\s1\szmiana\s16\sh/);
  await expect(page.locator('[data-w="odpoczynek"]')).toBeVisible();
  await expect(page.locator('[data-w="odpoczynek"]')).toContainText(/co\snajmniej\s24\sh/);
  await page.locator('[name="system"]').selectOption('r16');
  await page.locator('[name="okres"]').selectOption('3');
  await expect(page.locator('[data-w="status"]')).toContainText(/art\.\s129\s§\s2/);
});

test('weekendowy, luty 2027: brakuje 16 h', async ({ page }) => {
  await page.locator('[name="system"]').selectOption('weekendowy');
  await page.locator('[name="miesiac"]').selectOption('2');
  await page.locator('[name="rok"]').selectOption('2027');
  await expect(page.locator('[data-w="glowny"]')).toHaveText(/^Brakuje\s16\sh$/);
  await expect(page.locator('[data-w="dostepne"]')).toContainText(/12\sdni/);
});

test('zmiana ponad maksimum i zły zapis to błąd', async ({ page }) => {
  await page.locator('[name="zmiana"]').fill('13');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.locator('[data-blad="dane"]')).toContainText(/najwyżej\s12\sh/);
  await page.locator('[name="zmiana"]').fill('abc');
  await expect(page.locator('[data-blad="dane"]')).toContainText(/liczbą/);
  await page.locator('[name="zmiana"]').fill('10,5');
  await expect(page.locator('[data-blad="dane"]')).toBeHidden();
  await expect(page.locator('[data-w="opis"]')).toHaveText(/15\szmian\spo\s10,5\sh\si\s1\szmiana\s2,5\sh/);
});
