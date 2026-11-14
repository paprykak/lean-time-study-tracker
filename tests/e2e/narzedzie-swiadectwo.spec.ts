import { expect, test } from '@playwright/test';
import { adresNarzedzia } from '../../src/data/narzedzia';

// Dziś 14.11.2026 (zegar przeglądarki). Oczekiwane wartości z niezależnego rachunku w Pythonie (jak w testach jednostkowych):
// ustanie 30.10.2026 → wysyłka najpóźniej 6.11.2026; otrzymanie 31.10.2026 → wniosek do 14.11.2026 (sobota; po art. 115 KC
// 16.11.2026); wniosek 10.11.2026 → odpowiedź do 17.11.2026, pozew ostrożnie do 1.12.2026 (17 dni); 5200 zł → 7800 zł.
test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-11-14T10:00:00+01:00'));
  await page.goto(adresNarzedzia('swiadectwo-pracy'));
  await page.getByLabel('Ostatni dzień umowy').fill('2026-10-30');
  await page.getByLabel('Świadectwo otrzymane').fill('2026-10-31');
});

test('sprostowanie: 14 dni bez przesunięcia z soboty, data przesunięta w dopisku', async ({ page }) => {
  await expect(page.locator('[data-w="glowny"]')).toHaveText(/^14\slistopada\s2026\sr\.$/);
  await expect(page.locator('[data-w="status"]')).toHaveText(/^Dziś\sostatni\sdzień$/);
  await expect(page.locator('[data-w="sprostowanie"]')).toContainText(/sobota;\sczy\stermin\sprzesuwa\ssię\sna\s16\slistopada\s2026\sr\./);
  await expect(page.locator('[data-w="wydanie"]')).toContainText(/najpóźniej\s6\slistopada\s2026\sr\.$/);
  await expect(page.locator('[data-w="odszkodowanie"]')).toContainText(/najwyżej\s7\s?800,00\szł/);
});

test('po wniosku: odpowiedź pracodawcy i ostrożny termin pozwu', async ({ page }) => {
  await page.getByLabel('Wniosek o sprostowanie doręczony').fill('2026-11-10');
  await expect(page.locator('[data-w="odpowiedz"]')).toContainText(/^do\s17\slistopada\s2026\sr\./);
  await expect(page.locator('[data-w="glowny"]')).toHaveText(/^1\sgrudnia\s2026\sr\.$/);
  await expect(page.locator('[data-w="status"]')).toHaveText(/^Zostało\s17\sdni$/);
  await expect(page.locator('[data-w="pozew"]')).toContainText(/przepis\snie\spodaje\sterminu/);
});

test('nowa umowa u tego samego pracodawcy: świadectwo na wniosek', async ({ page }) => {
  await page.getByLabel('W ciągu 7 dni zaczynam nową umowę u tego samego pracodawcy').check();
  await expect(page.locator('[data-w="wydanie"]')).toContainText(/tylko\sna\swniosek/);
});

test('błędne dane', async ({ page }) => {
  await page.getByLabel('Pensja miesięczna (zł brutto)').fill('abc');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.getByLabel('Pensja miesięczna (zł brutto)')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('[data-w="glowny"]')).toHaveText('—');
  await page.getByLabel('Pensja miesięczna (zł brutto)').fill('');
  await expect(page.locator('[data-blad="dane"]')).toBeHidden();
  await page.getByLabel('Świadectwo otrzymane').fill('2026-10-20');
  await expect(page.locator('[data-blad="dane"]')).toContainText(/nie\smoże\sbyć\swcześniejsza/);
  await expect(page.getByLabel('Świadectwo otrzymane')).toHaveAttribute('aria-invalid', 'true');
});

test('daty domyślne od prawdziwego dziś (13.01.2027 → 3.01.2027)', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-01-13T10:00:00+01:00'));
  await page.goto(adresNarzedzia('swiadectwo-pracy'));
  await expect(page.getByLabel('Ostatni dzień umowy')).toHaveValue('2027-01-03');
  await expect(page.locator('[data-w="glowny"]')).toHaveText(/^17\sstycznia\s2027\sr\.$/);
});
