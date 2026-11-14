import { expect, test } from '@playwright/test';
import { adresNarzedzia } from '../../src/data/narzedzia';

// Dziś 14.11.2026 (zegar przeglądarki). Oczekiwane wartości z niezależnego rachunku w Pythonie (jak w testach jednostkowych):
// uruchomienie 15.12.2026 → informacja do 1.12.2026, oznaczenie do 14.12.2026; nagranie 14.08.2026 → do 14.11.2026 (dziś),
// 10.11.2026 → do 10.02.2027 (88 dni).
test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-11-14T10:00:00+01:00'));
  await page.goto(adresNarzedzia('monitoring-w-pracy'));
});

test('kamery w hali: warunki, termin uprzedzenia i przechowywania', async ({ page }) => {
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Wolno, na warunkach');
  await page.getByLabel('Dzień nagrania').fill('');
  await page.getByLabel('Uruchomienie monitoringu').fill('2026-12-15');
  await page.getByLabel('Czy pracodawca uprzedził?').selectOption('nie');
  await expect(page.getByLabel('Dzień informacji')).toBeHidden();
  await expect(page.locator('[data-w="informacja"]')).toContainText(/najpóźniej\s1\sgrudnia\s2026\sr\.,\soznaczenie\sterenu\snajpóźniej\s14\sgrudnia\s2026\sr\./);
  await expect(page.locator('[data-w="informacja"]')).toContainText(/ma\sjeszcze\sczas:\s17\sdni/);
  await page.getByLabel('Uruchomienie monitoringu').fill('2026-08-01');
  await page.getByLabel('Dzień nagrania').fill('2026-11-10');
  await expect(page.locator('[data-w="przechowywanie"]')).toContainText(/Najpóźniej\sdo\s10\slutego\s2027\sr\.\s\(zostało\s88\sdni\)/);
  await page.getByLabel('Dzień nagrania').fill('2026-08-14');
  await expect(page.locator('[data-w="przechowywanie"]')).toContainText(/\(to\sdziś\)/);
});

test('zakazane miejsca', async ({ page }) => {
  await page.getByLabel('Miejsce kamery').selectOption('zwiazek');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Nie wolno');
  await expect(page.locator('[data-w="przepis"]')).toHaveAttribute('data-status', 'po-terminie');
  await page.getByLabel('Miejsce kamery').selectOption('sanitariat');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Tylko wyjątkowo');
  await expect(page.locator('[data-w="warunki"]')).toContainText(/wcześniejsza\szgoda/);
});

test('poczta służbowa i GPS: bez kamer i bez okresu nagrań', async ({ page }) => {
  await page.getByLabel('Rodzaj').selectOption('poczta');
  await expect(page.getByLabel('Miejsce kamery')).toBeHidden();
  await expect(page.getByLabel('Dzień nagrania')).toBeHidden();
  await expect(page.locator('[data-w="werdykt-opis"]')).toContainText(/tajemnicy\skorespondencji/);
  await expect(page.locator('[data-w="przechowywanie"]')).toContainText(/nie\spodaje\sokresu/);
  await page.getByLabel('Rodzaj').selectOption('inne');
  await expect(page.locator('[data-w="przepis"]')).toHaveText(/^art\.\s22³\s§\s4\sKodeksu\spracy$/);
});

test('błędne dane', async ({ page }) => {
  await page.getByLabel('Dzień nagrania').fill('2026-11-20');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.getByLabel('Dzień nagrania')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('—');
  await page.getByLabel('Dzień nagrania').fill('2026-11-01');
  await expect(page.locator('[data-blad="dane"]')).toBeHidden();
  await expect(page.getByLabel('Dzień nagrania')).not.toHaveAttribute('aria-invalid', 'true');
});
