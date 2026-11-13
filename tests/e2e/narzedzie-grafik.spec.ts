import { expect, test } from '@playwright/test';
import { NARZEDZIE_GRAFIK } from './strony';

// Kontrola grafiku: wzór czterobrygadowy w listopadzie 2026 (16 zmian, 192 h przy 160 h), ręczna zmiana dnia
// łamiąca odpoczynek 11 h, trzyzmianowy 8 h zgodny z wymiarem.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_GRAFIK);
  await page.getByLabel('Rok').selectOption('2026');
  await page.getByLabel('Miesiąc', { exact: true }).selectOption('11');
});

test('czterobrygadowy 12 h: 192 h przy wymiarze 160 h, bez naruszeń', async ({ page }) => {
  await expect(page.locator('[data-w="podsumowanie"]')).toHaveText(/^16\szmian,\s192\sh\sprzy\swymiarze\s160\sh,\sdni\swolnych:\s14$/);
  await expect(page.locator('[data-w="naglowek"]')).toHaveText('Bez naruszeń, uwagi: 1');
});

test('noc, a rano następnego dnia: naruszenie odpoczynku dobowego', async ({ page }) => {
  await page.getByLabel('1 listopad (niedziela)').selectOption('N');
  await page.getByLabel('2 listopad (poniedziałek)').selectOption('R');
  await expect(page.locator('[data-w="lista"] li[data-stan="blad"]')).toContainText(['Za krótki odpoczynek między zmianami']);
});

test('trzyzmianowy 8 h w lutym 2026: start od poniedziałku, 160 h, bez naruszeń', async ({ page }) => {
  await page.getByLabel('Miesiąc', { exact: true }).selectOption('2');
  await page.getByLabel('Wzór rotacji').selectOption('trzyzmianowy-8');
  await expect(page.locator('[data-w="podsumowanie"]')).toContainText(/160\sh\sprzy\swymiarze\s160\sh/);
  await expect(page.getByLabel('Start cyklu')).toHaveValue('6');
  await expect(page.locator('[data-w="naglowek"]')).toHaveText('Bez naruszeń, uwagi: 1');
});

test('odmiana liczby zmian i krótka nazwa wzoru z pełnym opisem pod polem', async ({ page }) => {
  await page.getByLabel('Wzór rotacji').selectOption('trzyzmianowy-8');
  await expect(page.locator('[data-w="podsumowanie"]')).toHaveText(/^\d+\szmian(y|a)?,/);
  await expect(page.locator('[data-w="wzor-opis"]')).toContainText('tydzień rano, tydzień popołudnie, tydzień noc');
  for (const tekst of await page.getByLabel('Wzór rotacji').locator('option').allTextContents()) expect(tekst.length).toBeLessThanOrEqual(28);
});

test('strona sprzed Nowego Roku otwarta 5 stycznia 2027 r.: styczeń 2027', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-01-05T10:00:00+01:00'));
  await page.goto(NARZEDZIE_GRAFIK);
  await expect(page.getByLabel('Rok')).toHaveValue('2027');
  await expect(page.getByLabel('Miesiąc', { exact: true })).toHaveValue('1');
});
