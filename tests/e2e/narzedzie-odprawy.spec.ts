import { expect, test } from '@playwright/test';
import { NARZEDZIE_ODPRAWA } from './strony';

// Odprawa: 6000 zł i staż 5 lat → 2 pensje; ponad 8 lat → 3; limit 15 płac minimalnych; emerytalna 1 pensja.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_ODPRAWA);
});

test('staż 5 lat: 2 pensje, 12 000 zł', async ({ page }) => {
  await page.getByLabel('Początek pracy u tego pracodawcy').fill('2021-06-01');
  await page.getByLabel('Dzień rozwiązania umowy').fill('2026-11-30');
  await expect(page.locator('[data-w="kwota"]')).toHaveText(/^12\s000,00\szł$/);
  await expect(page.locator('[data-w="miesiecy"]')).toHaveText(/^2\s\(staż\sod\s2\sdo\s8\slat\)$/);
});

test('wysoka pensja i 16 lat: obcięta do 72 090 zł', async ({ page }) => {
  await page.getByLabel('Początek pracy u tego pracodawcy').fill('2010-01-01');
  await page.getByLabel('Dzień rozwiązania umowy').fill('2026-11-30');
  await page.getByLabel('Pensja i stałe dodatki miesięcznie (zł brutto)').fill('30000');
  await expect(page.locator('[data-w="kwota"]')).toHaveText(/^72\s090,00\szł$/);
  await expect(page.locator('[data-w="uwaga"]')).toBeVisible();
});

test('emerytalna: jedna pensja z premiami, bez pól dat', async ({ page }) => {
  await page.getByLabel('Przejście na emeryturę albo rentę').check();
  await expect(page.getByLabel('Początek pracy u tego pracodawcy')).toBeHidden();
  await page.getByLabel('Średnia premii i dodatków zmiennych z 3 miesięcy (zł)').fill('500');
  await expect(page.locator('[data-w="kwota"]')).toHaveText(/^6500,00\szł$/);
});

test('wyłączny powód i odmowa nowych warunków: orzecznictwo SN z sygnaturami i linkiem w akapitach po nagłówku „Kiedy przysługuje”', async ({ page }) => {
  const sekcja = page.locator('#kiedy ~ p');
  const tekst = (await sekcja.allInnerTexts()).join(' ');
  expect(tekst).toMatch(/bez przyczyn niedotyczących pracownika do\szwolnienia by\snie doszło/);
  expect(tekst).toMatch(/I\sPK\s144\/11/);
  expect(tekst).toMatch(/odmowa może być uznana za\swspółprzyczynę/);
  await expect(sekcja.getByRole('link', { name: 'kalkulator wypowiedzenia zmieniającego' })).toHaveAttribute('href', '/narzedzia/wypowiedzenie-zmieniajace');
});

// Audyt jakości 4 (B-1, B-14): po błędzie danych znika cały wynik, a nie tylko kwota.
test('błędna pensja albo rok bez płacy minimalnej: żadne pole wyniku nie zostaje z poprzedniego liczenia', async ({ page }) => {
  await page.getByLabel('Początek pracy u tego pracodawcy').fill('2010-01-01');
  await page.getByLabel('Dzień rozwiązania umowy').fill('2026-12-31');
  const pensja = page.getByLabel('Pensja i stałe dodatki miesięcznie (zł brutto)');
  await pensja.fill('24030,01');
  await expect(page.locator('[data-w="kwota"]')).toHaveText(/^72\s090,00\szł$/);
  await expect(page.locator('[data-w="uwaga"]')).toBeVisible();
  await pensja.fill('0');
  for (const k of ['kwota', 'miesieczne', 'miesiecy', 'limit']) await expect(page.locator(`[data-w="${k}"]`)).toHaveText('—');
  await expect(page.locator('[data-w="uwaga"]')).toBeHidden();
  await pensja.fill('6000');
  await page.getByLabel('Dzień rozwiązania umowy').fill('2028-01-15');
  await expect(page.locator('[data-w="limit"]')).toHaveText('—');
});

test('linki do okresu wypowiedzenia i ekwiwalentu za urlop (B-8), 20 pracowników (B-wer-3)', async ({ page }) => {
  await expect(page.locator('a[href="/narzedzia/okres-wypowiedzenia"]').first()).toBeAttached();
  await expect(page.locator('main a[href="/narzedzia/ekwiwalent-za-urlop"]:not(.podobne-link)')).toHaveCount(1);
  await expect(page.locator('main')).not.toContainText('20 osób');
  await expect(page.locator('main')).not.toContainText('z jego inicjatywy');
});
