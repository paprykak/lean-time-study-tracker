import { expect, test } from '@playwright/test';

// Listopad 2026, pełny etat: wymiar 160 h (21 dni pon–pt minus 11 listopada), 184 h pracy, 10 h nadgodzin dobowych
// → 14 h średniotygodniowych, dodatek 100% przy 40 zł = 560,00 zł, średnio 184 / (30/7) = 42,93 h.
test.beforeEach(async ({ page }) => {
  await page.goto('/narzedzia/nadgodziny-sredniotygodniowe');
});

test('przykład startowy: 14 godzin, 560 zł, średnia 42,93 h w limicie', async ({ page }) => {
  await page.getByLabel('Przepracowane godziny').fill('184');
  await expect(page.locator('[data-w="glowna"]')).toHaveText(/^14\sgodzin$/);
  await expect(page.locator('[data-w="wymiar"]')).toContainText(/^160\sh/);
  await expect(page.locator('[data-w="dodatek"]')).toHaveText(/^560,00\szł$/);
  await expect(page.locator('[data-w="srednia"]')).toContainText(/^42,93\sh/);
  await expect(page.locator('[data-w="limit"]')).toHaveAttribute('data-stan', 'ok');
});

test('luty 2026: 192 h to dokładnie 48 h i jeszcze limit, 192,5 h już ponad', async ({ page }) => {
  await page.getByLabel('Miesiąc').selectOption('2');
  await page.getByLabel('W tym nadgodziny dobowe').fill('0');
  await page.getByLabel('Przepracowane godziny').fill('192');
  await expect(page.locator('[data-w="glowna"]')).toHaveText(/^32\sgodziny$/);
  await expect(page.locator('[data-w="srednia"]')).toContainText(/^48\sh\s\(28\sdni\sto\s4\stygodnie\)/);
  await expect(page.locator('[data-w="limit"]')).toHaveAttribute('data-stan', 'ok');
  await page.getByLabel('Przepracowane godziny').fill('192,5');
  await expect(page.locator('[data-w="limit"]')).toHaveText('przekroczony');
  await expect(page.locator('[data-w="uwaga"]')).toContainText(/art\.\s131\s§\s1/);
});

test('pół etatu w listopadzie 2026: 80 h ponadwymiarowych i 10 h nadgodzin', async ({ page }) => {
  await page.getByLabel('Etat').selectOption('1/2');
  await page.getByLabel('W tym nadgodziny dobowe').fill('0');
  await page.getByLabel('Przepracowane godziny').fill('170');
  await expect(page.locator('[data-w="etat"]')).toHaveText(/^80\sh$/);
  await expect(page.locator('[data-w="ponadwymiarowe"]')).toHaveText(/^80\sh$/);
  await expect(page.locator('[data-w="glowna"]')).toHaveText(/^10\sgodzin$/);
});

test('błędne dane: nadgodziny dobowe większe niż przepracowane i tekst zamiast liczby', async ({ page }) => {
  await page.getByLabel('W tym nadgodziny dobowe').fill('200');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.locator('[data-w="glowna"]')).toHaveText('—');
  await page.getByLabel('W tym nadgodziny dobowe').fill('10');
  await expect(page.locator('[data-blad="dane"]')).toBeHidden();
  await page.getByLabel('Przepracowane godziny').fill('dużo');
  await expect(page.locator('[data-blad="dane"]')).toContainText('wpisz liczbę');
});

test('błędy zakresu oznaczają pola (aria-invalid), puste pole to brak danych', async ({ page }) => {
  const przepracowane = page.getByLabel('Przepracowane godziny');
  const dobowe = page.getByLabel('W tym nadgodziny dobowe');
  const blad = page.locator('[data-blad="dane"]');
  await przepracowane.fill('');
  await expect(blad).toHaveText('Wpisz przepracowane godziny.');
  await expect(przepracowane).toHaveAttribute('aria-invalid', 'true');
  await przepracowane.fill('800');
  await expect(blad).toHaveText(/najwyżej\s720\sgodzin/);
  await expect(przepracowane).toHaveAttribute('aria-invalid', 'true');
  await przepracowane.fill('184');
  await dobowe.fill('200');
  await expect(dobowe).toHaveAttribute('aria-invalid', 'true');
  await dobowe.fill('10');
  await page.getByLabel('Urlop, L4 (godziny)').fill('500');
  await expect(page.getByLabel('Urlop, L4 (godziny)')).toHaveAttribute('aria-invalid', 'true');
  await page.getByLabel('Urlop, L4 (godziny)').fill('0');
  await expect(blad).toBeHidden();
  await expect(przepracowane).not.toHaveAttribute('aria-invalid');
});
