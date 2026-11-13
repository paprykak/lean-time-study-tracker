import { expect, test } from '@playwright/test';
import { NARZEDZIE_STAZ } from './strony';

// Staż pracy: okresy bez powtórzeń, pełne miesiące kalendarzowe i dni po 30 (wartości jak w staz-pracy.test.ts).
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_STAZ);
  for (let i = 0; i < 6; i++) {
    await page.locator(`#s-od-${i}`).fill('');
    await page.locator(`#s-do-${i}`).fill('');
  }
});

test('etat i zlecenie w tym samym czasie: liczone raz', async ({ page }) => {
  await page.locator('#s-od-0').fill('2020-01-01');
  await page.locator('#s-do-0').fill('2020-12-31');
  await page.locator('#s-od-1').fill('2020-06-01');
  await page.locator('#s-do-1').fill('2021-05-31');
  await page.locator('#s-rodzaj-1').selectOption('zlecenie');
  await expect(page.locator('[data-w="razem"]')).toHaveText(/^1\srok, 5\smiesięcy i\s0\sdni$/);
  await expect(page.locator('[data-w="umowy"]')).toHaveText(/^1\srok, 0\smiesięcy i\s0\sdni$/);
});

test('ze szkołą zasadniczą ponad 10 lat: 26 dni urlopu', async ({ page }) => {
  await page.locator('#s-od-0').fill('2015-09-01');
  await page.locator('#s-do-0').fill('2026-11-12');
  await page.getByLabel('Ukończona szkoła (do urlopu)').selectOption('zasadnicza');
  await expect(page.locator('[data-w="razem"]')).toHaveText(/^11\slat, 2\smiesiące i\s12\sdni$/);
  await expect(page.locator('[data-w="urlop"]')).toHaveText('26 dni');
});

test('brak dat: komunikat, a wynik nie zostaje z poprzedniego rachunku', async ({ page }) => {
  await page.locator('#s-od-0').fill('2020-01-01');
  await page.locator('#s-do-0').fill('2020-12-31');
  await expect(page.locator('[data-w="umowy"]')).toHaveText(/^1\srok/);
  await page.locator('#s-do-0').fill('');
  await expect(page.getByText(/Okres\s1: wpisz obie daty/)).toBeVisible();
  for (const k of ['razem', 'umowy', 'urlopowy', 'urlop']) await expect(page.locator(`[data-w="${k}"]`)).toHaveText('—');
});

test('lista szkół: odmiana lat', async ({ page }) => {
  await expect(page.locator('#s-szkola option[value="zasadnicza"]')).toHaveText('Zasadnicza (3 lata)');
  await expect(page.locator('#s-szkola option[value="technikum-5"]')).toHaveText('Technikum 5-letnie (5 lat)');
});
