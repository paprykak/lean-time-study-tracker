import { expect, test } from '@playwright/test';

// Urlop w okresie wypowiedzenia (wartości sprawdzone niezależnie w Pythonie): koniec umowy 30.11.2026, urlop od
// 2.11.2026, wymiar 26, wykorzystane 2, zaległy 6. Urlop za 11 miesięcy: ceil(26 × 11 / 12) = 24, zostało 22, razem 28.
// Dni pracy pon.–pt. od 2 do 30 listopada bez 11.11: 20, więc w wypowiedzeniu 20 dni, ekwiwalent za 8.
const ADRES = '/narzedzia/urlop-w-okresie-wypowiedzenia';

test.beforeEach(async ({ page }) => {
  await page.goto(ADRES);
  await page.locator('[name="koniec"]').fill('2026-11-30');
  await page.locator('[name="od"]').fill('2026-11-02');
  await page.locator('[name="wymiar"]').fill('26');
  await page.locator('[name="wykorzystane"]').fill('2');
  await page.locator('[name="zalegly"]').fill('6');
});

test('listopad bez 11.11: 20 dni w wypowiedzeniu, ekwiwalent za 8', async ({ page }) => {
  await expect(page.locator('[data-w="wwyp"]')).toHaveText(/^20\sdni$/);
  await expect(page.locator('[data-w="opis"]')).toContainText(/Za\sco\snajmniej\s8\sdni\surlopu/);
  await expect(page.locator('[data-w="proporcjonalny"]')).toContainText(/^24\sdni\s\(11\/12/);
  await expect(page.locator('[data-w="biezacy"]')).toHaveText(/^22\sdni$/);
  await expect(page.locator('[data-w="dni-pracy"]')).toContainText(/bez\s1\sświęta/);
  await expect(page.locator('[data-w="ekwiwalent"]')).toHaveText(/^8\sdni$/);
});

test('soboty jako dni pracy: 24 dni; grafik 10 dni: ekwiwalent za 18', async ({ page }) => {
  await page.getByLabel('Dni pracy', { exact: true }).selectOption('pn-sb');
  await expect(page.locator('[data-w="wwyp"]')).toHaveText(/^24\sdni$/);
  await page.locator('[name="grafik"]').fill('10');
  await expect(page.locator('[data-w="wwyp"]')).toHaveText(/^10\sdni$/);
  await expect(page.locator('[data-w="ekwiwalent"]')).toHaveText(/^18\sdni$/);
});

test('początek pracy 20 maja, koniec 10 sierpnia: 4 miesiące, 9 dni', async ({ page }) => {
  await page.locator('[name="koniec"]').fill('2026-08-10');
  await page.locator('[name="od"]').fill('2026-07-20');
  await page.locator('[name="poczatek"]').fill('2026-05-20');
  await page.locator('[name="wykorzystane"]').fill('0');
  await page.locator('[name="zalegly"]').fill('0');
  await expect(page.locator('[data-w="proporcjonalny"]')).toContainText(/^9\sdni\s\(4\/12/);
  await expect(page.locator('[data-w="wwyp"]')).toHaveText(/^9\sdni$/);
  await expect(page.locator('[data-w="ekwiwalent"]')).toHaveText(/^0\sdni,\sjeśli\spracodawca\sudzieli/);
});

test('przełom roku: urlop za 2027 r. 3 dni i 10 zaległego, razem 13', async ({ page }) => {
  await page.locator('[name="od"]').fill('2026-12-14');
  await page.locator('[name="koniec"]').fill('2027-01-15');
  await page.locator('[name="wykorzystane"]').fill('0');
  await page.locator('[name="zalegly"]').fill('10');
  await expect(page.locator('[data-w="wwyp"]')).toHaveText(/^13\sdni$/);
  await expect(page.locator('[data-w="dni-pracy"]')).toContainText(/^21\sdni/);
  await expect(page.locator('[data-w="uwaga"]')).toContainText(/2027\sr\./);
});

test('ponad proporcję: koniec 30 kwietnia, 20 wykorzystanych z 9, nadwyżka 11 dni', async ({ page }) => {
  await page.locator('[name="od"]').fill('2026-04-01');
  await page.locator('[name="koniec"]').fill('2026-04-30');
  await page.locator('[name="wykorzystane"]').fill('20');
  await page.locator('[name="zalegly"]').fill('2');
  await expect(page.locator('[data-w="wwyp"]')).toHaveText(/^2\sdni$/);
  await expect(page.locator('[data-w="uwaga"]')).toContainText(/ponad\sproporcję:\s11\sdni/);
});

test('koniec umowy przed datą „urlop od” to błąd', async ({ page }) => {
  await page.locator('[name="koniec"]').fill('2026-10-30');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.locator('[data-blad="dane"]')).toContainText(/Koniec\sumowy\sprzed/);
  await expect(page.locator('[data-w="wwyp"]')).toHaveText('—');
});

test('przełom roku: urlopu za 2027 r. najwyżej 2 dni (4–5 stycznia), ekwiwalent co najmniej za 1', async ({ page }) => {
  await page.locator('[name="od"]').fill('2026-12-14');
  await page.locator('[name="koniec"]').fill('2027-01-05');
  await page.locator('[name="wykorzystane"]').fill('0');
  await page.locator('[name="zalegly"]').fill('0');
  await expect(page.getByLabel(/Wykorzystane\sz\surlopu\sza\s2027/)).toBeVisible();
  await expect(page.locator('[data-w="wwyp"]')).toHaveText(/^2\sdni$/);
  await expect(page.locator('[data-w="ekwiwalent"]')).toHaveText(/^1\sdzień$/);
  await expect(page.locator('[data-w="uwaga"]')).toContainText(/Pozostały\surlop\sza\s2026\sr\./);
});

test('ułamek dni w wykorzystanych to błąd przy tym polu', async ({ page }) => {
  await page.locator('[name="wykorzystane"]').fill('2,5');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.locator('[data-blad="dane"]')).toContainText(/Wykorzystane/);
  await expect(page.locator('[name="wykorzystane"]')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('[name="zalegly"]')).not.toHaveAttribute('aria-invalid');
  await expect(page.locator('[data-w="wwyp"]')).toHaveText('—');
});
