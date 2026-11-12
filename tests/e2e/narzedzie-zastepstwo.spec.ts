import { expect, test } from '@playwright/test';
import { NARZEDZIE_ZASTEPSTWO } from './strony';

// Umowa na zastępstwo (art. 36 § 1, art. 30 § 1 pkt 4, art. 177 § 1, § 3 i § 3^1 Kp): wartości jak w umowa-zastepstwo.test.ts.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_ZASTEPSTWO);
});

const w = (page: import('@playwright/test').Page, k: string) => page.locator(`[data-w="${k}"]`);

test('zastępstwo, staż 6 miesięcy: 1 miesiąc do 31 października, bez limitu i bez przedłużenia', async ({ page }) => {
  await page.getByLabel('Pracujesz u tego pracodawcy od').fill('2026-03-15');
  await page.getByLabel('Dzień doręczenia wypowiedzenia').fill('2026-09-15');
  await expect(w(page, 'ostatni')).toHaveText(/^31\spaździernika\s2026\sr\.$/);
  await expect(w(page, 'okres')).toHaveText(/^1\smiesiąc$/);
  await expect(w(page, 'staz')).toHaveText(/^6\spełnych\smiesięcy$/);
  await expect(w(page, 'limit')).toContainText('nie dotyczy');
  await expect(w(page, 'porod')).toHaveText(/^nie\s\(art\.\s177\s§\s3¹\)$/);
  await expect(w(page, 'status')).toBeHidden();
});

test('data końca umowy przed końcem okresu wypowiedzenia: ostatni dzień z umowy', async ({ page }) => {
  await page.getByLabel('Pracujesz u tego pracodawcy od').fill('2024-02-29');
  await page.getByLabel('Dzień doręczenia wypowiedzenia').fill('2026-11-30');
  await page.getByLabel('Koniec umowy (jeśli ma datę)').fill('2026-12-15');
  await expect(w(page, 'ostatni')).toHaveText(/^15\sgrudnia\s2026\sr\.$/);
  await expect(w(page, 'koniec-okresu')).toHaveText(/^31\sgrudnia\s2026\sr\.$/);
  await expect(w(page, 'uwaga')).toHaveText(/z\supływem\sczasu/);
});

test('inna umowa na czas określony w ciąży: przedłużenie do porodu i granica 3. miesiąca', async ({ page }) => {
  await page.getByLabel('Rodzaj umowy').selectOption('okreslony');
  await page.getByLabel('Pracujesz u tego pracodawcy od').fill('2026-01-05');
  await page.getByLabel('Dzień doręczenia wypowiedzenia').fill('2026-11-30');
  await page.getByLabel('Początek ciąży (jeśli dotyczy)').fill('2027-01-10');
  await expect(w(page, 'porod')).toHaveText(/wpisz\skoniec\sumowy/);
  await page.getByLabel('Koniec umowy (jeśli ma datę)').fill('2027-04-11');
  await expect(w(page, 'uplyw')).toHaveText(/^10\skwietnia\s2027\sr\.$/);
  await expect(w(page, 'porod')).toHaveText(/^tak,\sdo\sdnia\sporodu/);
  await expect(w(page, 'limit')).toContainText('dotyczy');
  await page.getByLabel('Koniec umowy (jeśli ma datę)').fill('2027-04-10');
  await expect(w(page, 'porod')).toHaveText(/przepis\snie\srozstrzyga/);
  await page.getByLabel('Rodzaj umowy').selectOption('zastepstwo');
  await expect(w(page, 'porod')).toHaveText(/^nie\s/);
});

test('wypowiedzenie doręczone w ciąży: ostrzeżenie o zakazie (art. 177 § 1)', async ({ page }) => {
  await page.getByLabel('Pracujesz u tego pracodawcy od').fill('2026-01-05');
  await page.getByLabel('Dzień doręczenia wypowiedzenia').fill('2026-11-30');
  await page.getByLabel('Początek ciąży (jeśli dotyczy)').fill('2026-10-01');
  await expect(w(page, 'status')).toBeVisible();
  await expect(w(page, 'status')).toHaveText(/zakazane\s\(art\.\s177\s§\s1\)/);
});

test('błędne dane: doręczenie przed początkiem pracy', async ({ page }) => {
  await page.getByLabel('Pracujesz u tego pracodawcy od').fill('2026-12-01');
  await page.getByLabel('Dzień doręczenia wypowiedzenia').fill('2026-11-30');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.locator('[data-blad="dane"]')).toHaveText(/nie\smoże\sbyć\swcześniejszy/);
  await expect(w(page, 'ostatni')).toHaveText('—');
});
