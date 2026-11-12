import { expect, test } from '@playwright/test';
import { NARZEDZIE_DELEGACJA } from './strony';

// Delegacja krajowa (§ 7–9 rozporządzenia, Dz.U. 2023 poz. 2190): 9 listopada 6:00 – 10 listopada 18:30 to 1 doba
// i 12,5 godziny, więc 2 diety po 45 zł; jedna noc 21–7 trwa co najmniej 6 godzin.
const podroz = async (page: import('@playwright/test').Page, powrot = '2026-11-10', godzina = '18:30') => {
  await page.getByLabel('Wyjazd: dzień').fill('2026-11-09');
  await page.getByLabel('Godzina wyjazdu').fill('06:00');
  await page.getByLabel('Powrót: dzień').fill(powrot);
  await page.getByLabel('Godzina powrotu').fill(godzina);
};

test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_DELEGACJA);
});

test('1 doba i 12,5 godziny: 2 diety, 90 zł', async ({ page }) => {
  await podroz(page);
  await expect(page.locator('[data-w="razem"]')).toHaveText(/^90,00\szł$/);
  await expect(page.locator('[data-w="dieta"]')).toHaveText(/^90,00\szł\s\(2\sdiety\)$/);
  await expect(page.locator('[data-w="czas"]')).toHaveText('W podróży: 1 doba, 12 godz. 30 min');
});

test('śniadanie i obiad w drugiej dobie: minus 33,75 zł', async ({ page }) => {
  await podroz(page);
  const doba2 = page.getByRole('group', { name: /^Doba 2:/ });
  await doba2.getByLabel('Śniadanie').check();
  await doba2.getByLabel('Obiad').check();
  await expect(page.locator('[data-w="potracenie"]')).toHaveText(/^33,75\szł$/);
  await expect(page.locator('[data-w="razem"]')).toHaveText(/^56,25\szł$/);
});

test('nocleg bez rachunku i komunikacja: 175,50 zł, drugi nocleg się nie mieści', async ({ page }) => {
  await podroz(page);
  await page.getByLabel('Noclegi bez rachunku').fill('1');
  await page.getByLabel(/Płacę za dojazdy/).check();
  await expect(page.locator('[data-w="razem"]')).toHaveText(/^175,50\szł$/);
  await page.getByLabel('Noclegi bez rachunku').fill('2');
  await expect(page.locator('#d-blad-noclegi')).toContainText('najwyżej 1 nocleg');
  await expect(page.locator('[data-w="razem"]')).toHaveText('—');
});

test('dłuższa podróż dokłada doby i zachowuje zaznaczone posiłki', async ({ page }) => {
  await podroz(page);
  await page.getByRole('group', { name: /^Doba 1:/ }).getByLabel('Kolacja').check();
  await page.getByLabel('Powrót: dzień').fill('2026-11-11');
  await expect(page.getByRole('group', { name: /^Doba 3:/ })).toBeVisible();
  await expect(page.getByRole('group', { name: /^Doba 1:/ }).getByLabel('Kolacja')).toBeChecked();
  // 2 pełne doby i 12,5 godziny: 3 diety (135 zł) minus kolacja 11,25 zł.
  await expect(page.locator('[data-w="razem"]')).toHaveText(/^123,75\szł$/);
});

test('poniżej 8 godzin dieta nie przysługuje, powrót przed wyjazdem to błąd', async ({ page }) => {
  await podroz(page, '2026-11-09', '13:00');
  await expect(page.locator('[data-w="dieta"]')).toHaveText('nie przysługuje');
  await expect(page.locator('[data-w="razem"]')).toHaveText(/^0,00\szł$/);
  await podroz(page, '2026-11-08', '13:00');
  await expect(page.locator('#d-blad')).toHaveText('Powrót musi być po wyjeździe.');
});
