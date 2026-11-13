import { expect, test } from '@playwright/test';
import { NARZEDZIE_PRZEDAWNIENIE } from './strony';

// Przedawnienie wynagrodzenia na 12 listopada 2026 r.: wypłata 10. dnia następnego miesiąca, za październik 2023 r.
// przedawniona 10 listopada 2026 r., za listopad 2023 r. (wypłata 8 grudnia 2023 r., bo 10 grudnia to niedziela) do 8 grudnia 2026 r.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_PRZEDAWNIENIE);
  await page.getByLabel('Sprawdź na dzień').fill('2026-11-12');
});

test('wypłata 10. dnia: najstarsza za listopad 2023 r., zostało 26 dni', async ({ page }) => {
  await expect(page.locator('[data-w="najstarsza"]')).toHaveText(/^za\slistopad\s2023\sr\.$/);
  await expect(page.locator('[data-w="opis"]')).toContainText(/8\sgrudnia\s2026/);
  await expect(page.locator('[data-w="status"]')).toHaveText(/Zostało:\s26\sdni/);
  await expect(page.locator('[data-w="status"]')).toHaveAttribute('data-status', 'pilne');
  await expect(page.locator('[data-w="lista"] li').first()).toHaveText(/za\sgrudzień\s2023\sr\.:\sdo\s10\sstycznia\s2027/);
});

test('wypłata ostatniego dnia miesiąca: bez pola dnia, termin 30 listopada 2026 r.', async ({ page }) => {
  await page.getByLabel('Kiedy dostajesz wypłatę za miesiąc').selectOption('ostatni');
  await expect(page.getByLabel('Dzień wypłaty')).toBeHidden();
  await expect(page.locator('[data-w="opis"]')).toContainText(/30\slistopada\s2026/);
});

test('inna należność: 3 lata od dnia, w którym miała być zapłacona', async ({ page }) => {
  await page.getByLabel(/Inna należność/).fill('2023-11-15');
  await expect(page.locator('[data-w="inna"]')).toHaveText(/^15\slistopada\s2026\sr\.\s\(za\s3\sdni\)$/);
});

test('wypłata w następnym miesiącu po 10. dniu to błąd', async ({ page }) => {
  await page.getByLabel('Dzień wypłaty').fill('15');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.locator('[data-w="najstarsza"]')).toHaveText('—');
});

test('strona sprzed Nowego Roku otwarta 15 marca 2027 r.: pole „Sprawdź na dzień” to dziś', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-03-15T10:00:00+01:00'));
  await page.goto(NARZEDZIE_PRZEDAWNIENIE);
  await expect(page.locator('#p-dzis')).toHaveValue('2027-03-15');
});
