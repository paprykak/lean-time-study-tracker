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
  await expect(page.locator('[data-w="podsumowanie"]')).toHaveText('16 zmian, 192 h przy wymiarze 160 h, dni wolnych: 14');
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
  await expect(page.locator('[data-w="podsumowanie"]')).toContainText('160 h przy wymiarze 160 h');
  await expect(page.getByLabel('Start cyklu')).toHaveValue('6');
  await expect(page.locator('[data-w="naglowek"]')).toHaveText('Bez naruszeń, uwagi: 1');
});
