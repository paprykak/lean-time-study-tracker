import { expect, test } from '@playwright/test';
import { adresNarzedzia } from '../../src/data/narzedzia';

// Dziś 14.11.2026 (zegar przeglądarki). Oczekiwane wartości z niezależnego rachunku w Pythonie (jak w testach jednostkowych):
// nieumyślna 20 000 zł przy 5200 zł → 15 600 zł; szkoda 10.03.2026, wiedza 2.04.2026 → 2.04.2027 (139 dni);
// przyczynienie 8000 zł przy 3000 zł → 9000 zł; powierzone 12 000 − 1500 zł → 10 500 zł, szkoda 30.06.2023,
// wiedza 15.01.2026 → 30.06.2026 (minęło 137 dni); umyślna, szkoda 29.02.2020, wiedza 29.02.2024 → 28.02.2027,
// koniec roku 31.12.2027, przestępstwo 29.02.2040; wspólne 9000,50 zł × 33,33% → 2999,87 zł.
test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-11-14T10:00:00+01:00'));
  await page.goto(adresNarzedzia('odpowiedzialnosc-materialna'));
  await page.getByLabel('Sytuacja', { exact: true }).selectOption('nieumyslna');
  await page.getByLabel('Kwota szkody (zł)').fill('20000');
  await page.getByLabel('Pensja w dniu szkody (zł brutto)').fill('5200');
  await page.getByLabel('Dzień szkody').fill('2026-03-10');
  await page.getByLabel('Pracodawca wie od').fill('2026-04-02');
});

test('wina nieumyślna: limit trzech pensji i rok na roszczenie', async ({ page }) => {
  await expect(page.locator('[data-w="granica"]')).toHaveText(/^15\s?600,00\szł$/);
  await expect(page.locator('[data-w="granica-opis"]')).toContainText(/3\s×\s5200,00\szł/);
  await expect(page.locator('[data-w="przedawnienie"]')).toHaveText(/^2\skwietnia\s2027\sr\.$/);
  await expect(page.locator('[data-w="status"]')).toHaveText(/^Pracodawcy\szostało:\s139\sdni$/);
  await expect(page.locator('[data-w="potracenie"]')).toContainText(/art\.\s91\s§\s1/);
  await page.getByLabel('Przyczynienie innych (zł)').fill('8000');
  await page.getByLabel('Pensja w dniu szkody (zł brutto)').fill('3000');
  await expect(page.locator('[data-w="granica"]')).toHaveText(/^9\s?000,00\szł$/);
});

test('mienie powierzone: pełna kwota, termin minął; pole pensji znika', async ({ page }) => {
  await page.getByLabel('Sytuacja', { exact: true }).selectOption('powierzone');
  await expect(page.getByLabel('Pensja w dniu szkody (zł brutto)')).toBeHidden();
  await page.getByLabel('Kwota szkody (zł)').fill('12000');
  await page.getByLabel('Przyczynienie innych (zł)').fill('1500');
  await page.getByLabel('Dzień szkody').fill('2023-06-30');
  await page.getByLabel('Pracodawca wie od').fill('2026-01-15');
  await expect(page.locator('[data-w="granica"]')).toHaveText(/^10\s?500,00\szł$/);
  await expect(page.locator('[data-w="przedawnienie"]')).toHaveText(/^30\sczerwca\s2026\sr\.$/);
  await expect(page.locator('[data-w="status"]')).toHaveText(/^Termin\spracodawcy\sminął\s137\sdni\stemu$/);
  await expect(page.locator('[data-w="uwagi"]')).toContainText(/halą\sspedycyjną/);
});

test('wina umyślna i wspólne mienie', async ({ page }) => {
  await page.getByLabel('Sytuacja', { exact: true }).selectOption('umyslna');
  await page.getByLabel('Dzień szkody').fill('2020-02-29');
  await page.getByLabel('Pracodawca wie od').fill('2024-02-29');
  await expect(page.locator('[data-w="granica"]')).toHaveText(/^20\s?000,00\szł$/);
  await expect(page.locator('[data-w="przedawnienie"]')).toHaveText(/^28\slutego\s2027\sr\.$/);
  await expect(page.locator('[data-w="przedawnienie-opis"]')).toContainText(/31\sgrudnia\s2027\sr\./);
  await expect(page.locator('[data-w="przedawnienie-opis"]')).toContainText(/29\slutego\s2040\sr\./);
  // Termin z art. 442¹ § 1 minął, ale przy końcu roku i przestępstwie mógł jeszcze nie minąć: bez „minął” na czerwono.
  await page.getByLabel('Dzień szkody').fill('2023-03-10');
  await page.getByLabel('Pracodawca wie od').fill('2023-03-10');
  await expect(page.locator('[data-w="status"]')).toHaveText(/^Termin\smógł\sminąć,\sale\smoże\strwać\sdo\s31\sgrudnia\s2026\sr\.$/);
  await expect(page.locator('[data-w="status"]')).toHaveAttribute('data-status', 'wkrotce');
  await page.getByLabel('Sytuacja', { exact: true }).selectOption('wspolne');
  await page.getByLabel('Kwota szkody (zł)').fill('9000,50');
  await page.getByLabel('Twoja część z umowy (%)').fill('33,33');
  await expect(page.locator('[data-w="granica"]')).toHaveText(/^2\s?999,87\szł$/);
});

test('błędne dane', async ({ page }) => {
  await page.getByLabel('Przyczynienie innych (zł)').fill('25000');
  await expect(page.locator('[data-blad="kwoty"]')).toBeVisible();
  await expect(page.getByLabel('Przyczynienie innych (zł)')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('[data-w="granica"]')).toHaveText('—');
  await page.getByLabel('Przyczynienie innych (zł)').fill('0');
  await page.getByLabel('Pracodawca wie od').fill('2026-03-01');
  await expect(page.locator('[data-blad="daty"]')).toBeVisible();
  await expect(page.locator('[data-blad="kwoty"]')).toBeHidden();
  await expect(page.locator('[data-w="przedawnienie"]')).toHaveText('—');
});

test('pola zależne od sytuacji: błąd ukrytego pola znika razem z aria-invalid', async ({ page }) => {
  const pensja = page.getByLabel('Pensja w dniu szkody (zł brutto)');
  const procent = page.getByLabel('Twoja część z umowy (%)');
  await expect(procent).toBeHidden();
  await pensja.fill('');
  await expect(page.locator('[data-blad="kwoty"]')).toBeVisible();
  await expect(pensja).toHaveAttribute('aria-invalid', 'true');
  await page.getByLabel('Sytuacja', { exact: true }).selectOption('umyslna');
  await expect(page.locator('[data-blad="kwoty"]')).toBeHidden();
  await expect(page.locator('[aria-invalid="true"]')).toHaveCount(0);
  await expect(page.locator('[data-w="granica"]')).toHaveText(/^20\s?000,00\szł$/);
  await page.getByLabel('Sytuacja', { exact: true }).selectOption('wspolne');
  await expect(procent).toBeVisible();
  await expect(pensja).toBeHidden();
});

test('dwa błędy naraz: kwota i data', async ({ page }) => {
  await page.getByLabel('Kwota szkody (zł)').fill('');
  await page.getByLabel('Pracodawca wie od').fill('2026-03-01');
  await expect(page.locator('[data-blad="kwoty"]')).toBeVisible();
  await expect(page.locator('[data-blad="daty"]')).toBeVisible();
  await expect(page.getByLabel('Pracodawca wie od')).toHaveAttribute('aria-invalid', 'true');
});

test('daty domyślne liczone w przeglądarce, nie w dniu budowania', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-01-05T10:00:00+01:00'));
  await page.goto(adresNarzedzia('odpowiedzialnosc-materialna'));
  await expect(page.getByLabel('Dzień szkody')).toHaveValue('2026-12-06');
  await expect(page.getByLabel('Pracodawca wie od')).toHaveValue('2026-12-16');
});
