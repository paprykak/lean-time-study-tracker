import { expect, test } from '@playwright/test';
import { adresNarzedzia } from '../../src/data/narzedzia';

// § 105–110 ogólnych przepisów BHP: drabina 2,5 m → praca na wysokości, szelki i hełm (§ 110 ust. 1); pomost ze stałą
// balustradą → wyłączenie z § 105 ust. 2 pkt 2, ale nie przy wychylaniu się (wariant bezpieczny); 0,8 m → poniżej
// progu; młodociani powyżej 3 m → wzbronione.
test.beforeEach(async ({ page }) => {
  await page.goto(adresNarzedzia('praca-na-wysokosci'));
});

test('drabina 2,5 m: praca na wysokości, szelki, szkolenie co rok', async ({ page }) => {
  await expect(page.locator('[data-w="glowny"]')).toHaveText(/^To\spraca\sna\swysokości$/);
  await expect(page.locator('[data-w="wiersze"]')).toContainText(/Szelki\sz\slinką\si\shełm/);
  await expect(page.locator('[data-w="wiersze"]')).toContainText(/Nie\srzadziej\sniż\sraz\sw\sroku/);
  await expect(page.getByLabel('Co chroni przed upadkiem?')).toBeHidden();
});

test('pomost z balustradą: nie jest, chyba że trzeba się wychylać', async ({ page }) => {
  await page.getByLabel('Gdzie pracujesz?').selectOption('pomost');
  await page.getByLabel('Co chroni przed upadkiem?').selectOption('balustrada');
  await expect(page.locator('[data-w="glowny"]')).toHaveText(/^To\snie\sjest\spraca\sna\swysokości$/);
  await expect(page.locator('[data-w="podstawa"]')).toContainText(/§\s105\sust\.\s2\spkt\s2/);
  await page.getByLabel(/wychylania się/).check();
  await expect(page.locator('[data-w="glowny"]')).toHaveText(/^To\spraca\sna\swysokości$/);
});

test('0,8 m poniżej progu; młodociany na 3,5 m', async ({ page }) => {
  await page.getByLabel('Wysokość, na której stoisz (m)').fill('0,8');
  await expect(page.locator('[data-w="glowny"]')).toHaveText(/^To\snie\sjest\spraca\sna\swysokości$/);
  await page.getByLabel('Wysokość, na której stoisz (m)').fill('3,5');
  await page.getByLabel('Kto pracuje?').selectOption('mlodociany');
  await expect(page.locator('[data-w="wiersze"]')).toContainText(/Wzbronione\spowyżej\s3\sm/);
});

test('błędna wysokość', async ({ page }) => {
  await page.getByLabel('Wysokość, na której stoisz (m)').fill('wysoko');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.locator('[data-w="glowny"]')).toHaveText('—');
});
