import { expect, test } from '@playwright/test';
import { NARZEDZIE_OKRES_ZASILKOWY } from './strony';

// Okres zasiłkowy: 5.01–15.02.2026 (42 dni) i 1.04–10.05.2026 (40 dni), przerwa 44 dni: razem 82 z 182,
// limit 18 sierpnia 2026 r., nowy okres przy zwolnieniu od 11 lipca 2026 r.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_OKRES_ZASILKOWY);
  await page.locator('[name="od1"]').fill('2026-01-05');
  await page.locator('[name="do1"]').fill('2026-02-15');
  await page.locator('[name="od2"]').fill('2026-04-01');
  await page.locator('[name="do2"]').fill('2026-05-10');
});

test('dwa zwolnienia z przerwą 44 dni: zostało 100 dni', async ({ page }) => {
  await expect(page.locator('[data-w="zostalo"]')).toHaveText(/^100\sdni$/);
  await expect(page.locator('[data-w="limit"]')).toContainText(/18\ssierpnia\s2026/);
  await expect(page.locator('[data-w="nowy"]')).toContainText(/11\slipca\s2026/);
});

test('ciąża po przerwie: tylko ostatnie zwolnienie, 230 z 270 dni', async ({ page }) => {
  await page.getByLabel('Ostatnie zwolnienie').selectOption('ciaza');
  await expect(page.locator('[data-w="zostalo"]')).toHaveText(/^230\sdni$/);
});

test('przerwa 61 dni zaczyna nowy okres; brak daty końca to błąd', async ({ page }) => {
  await page.locator('[name="od2"]').fill('2026-04-18');
  await expect(page.locator('[data-w="opis"]')).toContainText(/okres\sod\s18\skwietnia\s2026/);
  await page.locator('[name="do2"]').fill('');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
});

test('strona sprzed Nowego Roku otwarta 5 stycznia 2027 r.: ostatnie zwolnienie kończy się tego dnia', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-01-05T10:00:00+01:00'));
  await page.goto(NARZEDZIE_OKRES_ZASILKOWY);
  await expect(page.locator('[name="do2"]')).toHaveValue('2027-01-05');
  await expect(page.locator('[name="od1"]')).toHaveValue('2026-09-07');
});
