import { expect, test } from '@playwright/test';
import { NARZEDZIE_WOLNE_DNI } from './strony';

// Dni wolne 2027: najwięcej wolnego za 4 dni urlopu 4–8 stycznia (1–10 stycznia, 10 dni); przy 1 dniu urlopu 28 maja
// (Boże Ciało, 27–30 maja). Święta w sobotę: 1 maja i 25 grudnia. Wartości z niezależnego rachunku (dni-wolne.test.ts).
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_WOLNE_DNI);
  await page.getByLabel('Rok', { exact: true }).selectOption('2027');
});

test('2027, do 4 dni urlopu: 10 dni wolnego od 1 do 10 stycznia', async ({ page }) => {
  await page.getByLabel('Najwyżej dni urlopu naraz').selectOption('4');
  await expect(page.locator('[data-w="najwiecej"]')).toHaveText(/^10\sdni$/);
  await expect(page.locator('[data-w="najlepsza"]')).toContainText('4–8 stycznia');
  await expect(page.locator('[data-w="sobota"]')).toHaveText('1 maja, 25 grudnia');
  await expect(page.locator('[data-w="weekendy"] li')).toHaveCount(5);
  await expect(page.locator('[data-w="dni-pracy"]')).toHaveText('251');
});

test('2027, 1 dzień urlopu: piątek po Bożym Ciele daje 4 dni', async ({ page }) => {
  await page.getByLabel('Najwyżej dni urlopu naraz').selectOption('1');
  await expect(page.locator('[data-w="najwiecej"]')).toHaveText(/^4\sdni$/);
  await expect(page.locator('[data-w="najlepsza"]')).toContainText('28 maja');
  await expect(page.locator('[data-w="okazje"] li')).toHaveCount(2);
});

test('plik kalendarza ze świętami wybranego roku', async ({ page }) => {
  const [plik] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: /Święta do kalendarza/ }).click()]);
  expect(plik.suggestedFilename()).toBe('dni-wolne-od-pracy-2027.ics');
});

test.describe('rok później', () => {
  test('5 października 2027 r.: domyślnie następny rok, 2028 (249 dni pracy)', async ({ page }) => {
    await page.clock.setFixedTime(new Date('2027-10-05T10:00:00+02:00'));
    await page.goto(NARZEDZIE_WOLNE_DNI);
    await expect(page.getByLabel('Rok', { exact: true })).toHaveValue('2028');
    await expect(page.locator('[data-w="dni-pracy"]')).toHaveText('249');
  });
});
