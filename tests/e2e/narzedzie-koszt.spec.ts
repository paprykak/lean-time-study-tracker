import { expect, test } from '@playwright/test';
import { NARZEDZIE_KOSZT } from './strony';

// Koszt pracodawcy 2026: 6000 zł → 7228,80 zł; z PPK 7318,80 zł; płaca minimalna 5790,28 zł; 60+: bez funduszy.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_KOSZT);
});

test('6000 zł: 7228,80 zł, z PPK 7318,80 zł', async ({ page }) => {
  await expect(page.locator('[data-w="koszt"]')).toHaveText('7228,80 zł');
  await page.getByLabel(/uczestniczy w\sPPK/).check();
  await expect(page.locator('[data-w="koszt"]')).toHaveText('7318,80 zł');
});

test('płaca minimalna: 5790,28 zł', async ({ page }) => {
  await page.getByLabel('Wynagrodzenie brutto w miesiącu (zł)').fill('4806');
  await expect(page.locator('[data-w="koszt"]')).toHaveText('5790,28 zł');
});

test('kobieta 55+ albo mężczyzna 60+: bez FP, FS i FGŚP', async ({ page }) => {
  await page.getByLabel(/Kobieta od\s55\slat/).check();
  await expect(page.locator('[data-w="fp"]')).toHaveText('0,00 zł');
  await expect(page.locator('[data-w="fgsp"]')).toHaveText('0,00 zł');
});

test('2027: próg FP i FS to płaca minimalna 4950 zł, limit 300 990 zł; po Nowym Roku rok domyślnie 2027', async ({ page }) => {
  await page.getByLabel('Rok wypłaty').selectOption('2027');
  await page.getByLabel('Wynagrodzenie brutto w miesiącu (zł)').fill('4900');
  await expect(page.locator('[data-w="fp"]')).toHaveText('0,00 zł');
  await expect(page.locator('[data-w="koszt"]')).toHaveText('5783,47 zł');
  await expect(page.locator('[data-w="uwaga"]')).toContainText(/300\s990\szł/);
  await expect(page.locator('[data-w="uwaga"]')).toContainText(/nie\sogłoszono/);
});

test('strona zbudowana w 2026 r. otwarta w styczniu 2027 r. liczy 2027 r.', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-01-05T10:00:00+01:00'));
  await page.goto(NARZEDZIE_KOSZT);
  await expect(page.getByLabel('Rok wypłaty')).toHaveValue('2027');
});
