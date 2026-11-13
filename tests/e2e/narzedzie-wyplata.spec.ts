import { expect, test } from '@playwright/test';
import { NARZEDZIE_WYPLATA } from './strony';

// Terminy wypłaty (art. 85 § 3 Kp): wartości jak w termin-wyplaty.test.ts.
// Lista lat to bieżący i następny rok, więc test z rokiem spoza listy jest pomijany (do odświeżenia w styczniu).
const rokNaLiscie = async (page: import('@playwright/test').Page, rok: string) =>
  (await page.locator('#p-rok option').allTextContents()).includes(rok);

test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_WYPLATA);
});

test('2027, 10. dnia: w styczniu 8 stycznia zamiast niedzieli', async ({ page }) => {
  test.skip(!(await rokNaLiscie(page, '2027')), 'rok 2027 poza listą');
  await page.getByLabel('Rok', { exact: true }).selectOption('2027');
  await page.getByLabel('Dzień wypłaty z regulaminu').selectOption('10');
  await expect(page.locator('[data-w="lista"] li').first()).toHaveText(/^styczeń: 8\sstycznia \(piątek\), zamiast 10\sstycznia \(niedziela\)$/);
});

test('2026, 25. dnia: w grudniu 23 grudnia przed Wigilią', async ({ page }) => {
  test.skip(!(await rokNaLiscie(page, '2026')), 'rok 2026 poza listą');
  await page.getByLabel('Rok', { exact: true }).selectOption('2026');
  await page.getByLabel('Dzień wypłaty z regulaminu').selectOption('25');
  await expect(page.locator('[data-w="lista"] li').last()).toContainText('23 grudnia (środa)');
  await expect(page.locator('[data-w="lista"] li').last()).toContainText(/zamiast 25\sgrudnia \(Boże Narodzenie\)/);
});

test('plik kalendarza z wypłatami', async ({ page }) => {
  const rok = (await page.locator('#p-rok option').first().textContent())!.trim();
  await page.getByLabel('Rok', { exact: true }).selectOption(rok);
  const [plik] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: /Wypłaty do kalendarza/ }).click()]);
  expect(plik.suggestedFilename()).toBe(`wyplaty-${rok}.ics`);
});

test('po ostatniej wypłacie roku najbliższa jest w styczniu następnego roku', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-12-15T10:00:00+01:00'));
  await page.reload();
  test.skip(!(await rokNaLiscie(page, '2027')), 'rok 2027 poza listą');
  await expect(page.locator('#p-rok')).toHaveValue('2027');
  await expect(page.locator('[data-w="najblizsza"]')).toHaveText(/^8\sstycznia\s2027\sr\.$/);
  await expect(page.locator('[data-w="dzien-tygodnia"]')).toHaveText('piątek');
});
