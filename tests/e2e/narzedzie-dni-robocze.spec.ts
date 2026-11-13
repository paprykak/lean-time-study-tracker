import { expect, test } from '@playwright/test';
import { NARZEDZIE_ROBOCZE } from './strony';

// Dni robocze: od poniedziałku do piątku bez świąt. Grudzień 2026 r.: 21; z sobotami 24.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_ROBOCZE);
  await page.getByLabel('Od', { exact: true }).fill('2026-12-01');
  await page.getByLabel('Do', { exact: true }).fill('2026-12-31');
});

test('grudzień 2026: 21 dni roboczych, z sobotami 24', async ({ page }) => {
  await expect(page.locator('[data-w="robocze"]')).toHaveText('21');
  await expect(page.locator('[data-w="swieta"]')).toContainText('Wigilia');
  await page.getByLabel(/Soboty są/).check();
  await expect(page.locator('[data-w="robocze"]')).toHaveText('24');
});

test('10 dni roboczych po 18 grudnia 2026: 7 stycznia 2027', async ({ page }) => {
  await page.getByLabel('Od', { exact: true }).fill('2026-12-18');
  await page.getByLabel(/Dni roboczych od daty/).fill('10');
  await expect(page.locator('[data-w="po"]')).toHaveText(/^7\sstycznia\s2027\sr\.$/);
});

test('jeden dzień: odmiana „1 dnia kalendarzowego” i „Po 1 dniu roboczym”', async ({ page }) => {
  await page.getByLabel('Od', { exact: true }).fill('2026-12-31');
  await page.getByLabel('Do', { exact: true }).fill('2026-12-31');
  await page.getByLabel(/Dni roboczych od daty/).fill('1');
  await expect(page.locator('[data-w="opis"]')).toHaveText(/^z\s1\sdnia\skalendarzowego$/);
  await expect(page.locator('[data-w="po-etykieta"]')).toHaveText(/^Po\s1\sdniu\sroboczym$/);
  await expect(page.locator('[data-w="po"]')).toHaveText(/^4\sstycznia\s2027\sr\.$/);
});

test('data „Do” przed „Od”: komunikat i aria-invalid na polach dat', async ({ page }) => {
  await page.getByLabel('Do', { exact: true }).fill('2026-11-01');
  await expect(page.getByLabel('Do', { exact: true })).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('[data-w="robocze"]')).toHaveText('—');
});

test('strona sprzed Nowego Roku otwarta 5 stycznia 2027 r.: „Od” to dziś', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-01-05T10:00:00+01:00'));
  await page.goto(NARZEDZIE_ROBOCZE);
  await expect(page.getByLabel('Od', { exact: true })).toHaveValue('2027-01-05');
  await expect(page.getByLabel('Do', { exact: true })).toHaveValue('2027-02-04');
});
