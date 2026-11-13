import { expect, test } from '@playwright/test';
import { NARZEDZIE_KARA } from './strony';

// Kara porządkowa (art. 109, 112, 113 Kp): wartości jak w kara-porzadkowa.test.ts.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_KARA);
  await page.getByLabel('Dzień naruszenia').fill('2026-11-02');
  await page.getByLabel('Kiedy pracodawca się o nim dowiedział').fill('2026-11-04');
});

test('kara 12 listopada 2026 r.: w terminie, sprzeciw do 19 listopada', async ({ page }) => {
  await page.getByLabel('Dzień zawiadomienia o karze').fill('2026-11-12');
  await expect(page.locator('[data-w="sprzeciw"]')).toHaveText(/^19\slistopada\s2026\sr\.$/);
  await expect(page.locator('[data-w="status"]')).toHaveText('Kara nałożona w terminie');
  await expect(page.locator('[data-w="zatarcie"]')).toHaveText(/^12\slistopada\s2027\sr\.$/);
});

test('kara 20 listopada 2026 r.: po terminie', async ({ page }) => {
  await page.getByLabel('Dzień zawiadomienia o karze').fill('2026-11-20');
  await expect(page.locator('[data-w="status"]')).toContainText('po terminie');
});

test('3 miesiące kończą się w niedzielę 28 lutego 2027 r.: kara 1 marca jest po terminie (bez art. 115 KC)', async ({ page }) => {
  await page.getByLabel('Dzień naruszenia').fill('2026-11-30');
  await page.getByLabel('Kiedy pracodawca się o nim dowiedział').fill('2027-02-20');
  await page.getByLabel('Dzień zawiadomienia o karze').fill('2027-03-01');
  await expect(page.locator('[data-w="3mies"]')).toHaveText(/^28\slutego\s2027\sr\.$/);
  await expect(page.locator('[data-w="status"]')).toHaveText(/po\sterminie/);
});
