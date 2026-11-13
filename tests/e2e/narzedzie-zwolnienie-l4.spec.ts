import { expect, test } from '@playwright/test';
import { NARZEDZIE_L4_OCHRONA } from './strony';

// Ochrona na L4 (art. 41, 53 § 1 pkt 1, 177 Kp): L4 od 1 stycznia 2026 r.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_L4_OCHRONA);
  await page.getByLabel('Pierwszy dzień niezdolności do pracy').fill('2026-01-01');
});

test('staż od 6 miesięcy: 182 dni, do 1 lipca', async ({ page }) => {
  await expect(page.locator('[data-w="ostatni"]')).toHaveText(/^1\slipca\s2026\sr\.$/);
  await expect(page.locator('[data-w="odkiedy"]')).toContainText('2 lipca 2026');
  await page.getByLabel(/świadczenie rehabilitacyjne/).check();
  await expect(page.locator('[data-w="ostatni"]')).toHaveText(/^1\spaździernika\s2026\sr\.$/);
});

test('staż poniżej 6 miesięcy: 3 miesiące, a po wypadku przy pracy 182 dni', async ({ page }) => {
  await page.getByLabel(/najmniej\s6\smiesi/).uncheck();
  await expect(page.locator('[data-w="ostatni"]')).toHaveText(/^31\smarca\s2026\sr\.$/);
  await expect(page.locator('[data-w="podstawa"]')).toContainText('lit. a');
  await page.getByLabel('Przyczyna').selectOption('wypadek');
  await expect(page.locator('[data-w="ostatni"]')).toHaveText(/^1\slipca\s2026\sr\.$/);
});

test('ciąża: art. 177', async ({ page }) => {
  await page.getByLabel('Przyczyna').selectOption('ciaza');
  await expect(page.locator('[data-w="ostatni"]')).toHaveText('Przez całą ciążę');
  await expect(page.locator('[data-w="podstawa"]')).toHaveText('art. 177 Kodeksu pracy');
});

test('pusta data po poprawnej: podstawa i koniec zasiłku nie zostają z poprzedniego rachunku', async ({ page }) => {
  await expect(page.locator('[data-w="zasilek"]')).toHaveText(/^1\slipca\s2026\sr\.\s\(182\sdni\)$/);
  await page.getByLabel('Pierwszy dzień niezdolności do pracy').fill('');
  await expect(page.locator('[data-w="ostatni"]')).toHaveText('—');
  await expect(page.locator('[data-w="podstawa"]')).toHaveText('—');
  await expect(page.locator('[data-wiersz="zasilek"]')).toBeHidden();
});

test('forma neutralna: „jeśli niezdolność do pracy trwa dalej”', async ({ page }) => {
  await expect(page.locator('[data-w="odkiedy"]')).toHaveText(/^Od\s2\slipca\s2026\sr\. pracodawca może rozwiązać umowę, jeśli niezdolność do\spracy trwa dalej\.$/);
});

test.describe('po Nowym Roku', () => {
  test('5 stycznia 2027 r.: domyślny pierwszy dzień L4 to 30 dni przed dziś', async ({ page }) => {
    await page.clock.setFixedTime(new Date('2027-01-05T10:00:00+01:00'));
    await page.goto(NARZEDZIE_L4_OCHRONA);
    await expect(page.getByLabel('Pierwszy dzień niezdolności do pracy')).toHaveValue('2026-12-06');
  });
});
