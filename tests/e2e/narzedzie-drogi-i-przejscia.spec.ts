import { expect, test } from '@playwright/test';

// Drogi i przejścia: przejście do obsługi 0,75 m (§ 47 ust. 3), wysokość 2 m (§ 47 ust. 1–2), pochylnia 8% (§ 5 ust. 1).
// Wartości policzone niezależnie w Pythonie (raporty/hala/RAPORT.md).
const ADRES = '/narzedzia/drogi-i-przejscia';

test.beforeEach(async ({ page }) => {
  await page.goto(ADRES);
});

test('start: 0,7 m to za wąsko o 5 cm', async ({ page }) => {
  await expect(page.locator('[data-w="minimum"]')).toHaveText(/^co\snajmniej\s0,75\sm$/);
  await expect(page.locator('[data-w="status"]')).toHaveText('Niezgodne z przepisem');
  await expect(page.locator('[data-w="lista"]')).toContainText(/brakuje\s5\scm\sdo\s0,75\sm/);
});

test('dwa kierunki 1 m, wysokość 1,9 m tylko wyjątkowo', async ({ page }) => {
  await page.getByLabel('Rodzaj').selectOption('obsluga-dwa');
  await page.getByLabel('Szerokość (m)').fill('1');
  await page.getByLabel('Wysokość (m)').fill('1,9');
  await expect(page.locator('[data-w="minimum"]')).toHaveText(/^co\snajmniej\s1\sm$/);
  await expect(page.locator('[data-w="status"]')).toHaveText(/^Zgodne\stylko\swyjątkowo$/);
  await expect(page.locator('[data-w="lista"]')).toContainText('§ 47 ust. 2');
});

test('pochylnia 15 cm na 1,5 m: 10%, najkrótsza 1,88 m', async ({ page }) => {
  await page.getByLabel('Szerokość (m)').fill('0,8');
  await page.getByLabel('Różnica poziomów (cm)').fill('15');
  await page.getByLabel('Długość w poziomie (m)').fill('1,5');
  await expect(page.locator('[data-w="lista"]')).toContainText(/Nachylenie\s10%\s\(ok\.\s5,7°\)/);
  await expect(page.locator('[data-w="lista"]')).toContainText(/co\snajmniej\s1,88\sm/);
  await page.getByLabel('Długość w poziomie (m)').fill('1,875');
  await expect(page.locator('[data-w="status"]')).toHaveText(/^Zgodne\sz\sprzepisem$/);
});

test('droga dla wózków: przepis nie podaje liczby; piesi dodają wysokość', async ({ page }) => {
  await page.getByLabel('Rodzaj').selectOption('wozki');
  await expect(page.locator('[data-w="minimum"]')).toHaveText(/^brak\sliczby\sw\sprzepisie$/);
  await expect(page.locator('[data-w="lista"]')).toContainText('Polskie Normy');
  await expect(page.locator('[data-w="uwaga"]')).toContainText('§ 69 ust. 2');
  await page.getByLabel('Tą drogą chodzą też piesi').check();
  await page.getByLabel('Wysokość (m)').fill('1,7');
  await expect(page.locator('[data-w="status"]')).toHaveText('Niezgodne z przepisem');
  await expect(page.locator('[data-w="uwaga"]')).toContainText('§ 6 ust. 5');
});

test('błąd: pochylnia bez długości, litery w szerokości', async ({ page }) => {
  await page.getByLabel('Różnica poziomów (cm)').fill('15');
  const blad = page.locator('[data-blad="dane"]');
  await expect(blad).toBeVisible();
  await expect(page.getByLabel('Długość w poziomie (m)')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('[data-w="status"]')).toBeHidden();
  await page.getByLabel('Różnica poziomów (cm)').fill('');
  await page.getByLabel('Szerokość (m)').fill('dużo');
  await expect(blad).toContainText(/Wpisz\sszerokość/);
  await page.getByLabel('Szerokość (m)').fill('0,75');
  await expect(blad).toBeHidden();
  await expect(page.locator('[data-w="status"]')).toHaveText(/^Zgodne\sz\sprzepisem$/);
});

test('pole „piesi” tylko przy drodze dla wózków', async ({ page }) => {
  const piesi = page.getByLabel('Tą drogą chodzą też piesi');
  await expect(piesi).toBeHidden();
  await page.getByLabel('Rodzaj').selectOption('wozki');
  await expect(piesi).toBeVisible();
  await page.getByLabel('Rodzaj').selectOption('gasnica');
  await expect(piesi).toBeHidden();
  await expect(page.locator('[data-w="lista"]')).toContainText('podaje tylko szerokość');
});
