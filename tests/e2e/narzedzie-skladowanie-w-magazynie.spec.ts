import { expect, test } from '@playwright/test';

// Składowanie: obciążenie z tabliczki (§ 68 ust. 2 pkt 2), 0,5 m od gorących urządzeń (§ 4 ust. 1 pkt 8 ppoż.),
// gaśnica 1 m i 30 m (§ 33 ust. 2 ppoż.), linie napowietrzne (§ 77). Wartości policzone niezależnie w Pythonie.
const ADRES = '/narzedzia/skladowanie-w-magazynie';

test.beforeEach(async ({ page }) => {
  await page.goto(ADRES);
});

test('start: 2 × 800 kg na poziomie 2000 kg, sekcja 4 × 1600 kg przekracza 6000 kg o 400 kg', async ({ page }) => {
  await expect(page.locator('[data-w="glowny"]')).toHaveText(/^1600\skg$/);
  await expect(page.locator('[data-w="zmiesci"]')).toHaveText(/zmieszczą\ssię\snajwyżej\s2\stakie\sładunki/);
  await expect(page.locator('[data-w="status"]')).toHaveText('Niezgodne z przepisem');
  await expect(page.locator('[data-w="lista"]')).toContainText(/6400\skg\sna\s4\spoziomach:\so\s400\skg\swięcej/);
});

test('trzy poziomy mieszczą się; 0,4 m od grzejnika przy materiałach palnych to za blisko', async ({ page }) => {
  await page.getByLabel('Zajęte poziomy').fill('3');
  await expect(page.locator('[data-w="status"]')).toHaveText(/^Zgodne\sz\sprzepisem$/);
  await page.getByLabel('Od gorących urządzeń i kabli').fill('0,4');
  await expect(page.locator('[data-w="status"]')).toHaveText('Niezgodne z przepisem');
  await expect(page.locator('[data-w="lista"]')).toContainText(/co\snajmniej\s0,5\sm/);
  await page.getByLabel('Materiały palne (karton, folia, drewno, tworzywa)').uncheck();
  await expect(page.locator('[data-w="lista"]')).toContainText(/nie\sdotyczy/);
  await expect(page.locator('[data-w="status"]')).toHaveText(/^Zgodne\sz\sprzepisem$/);
});

test('gaśnica i linia do 15 kV', async ({ page }) => {
  await page.getByLabel('Zajęte poziomy').fill('3');
  await page.getByLabel('Dostęp do gaśnicy').fill('0,9');
  await page.getByLabel('Do gaśnicy', { exact: true }).fill('25');
  await expect(page.locator('[data-w="lista"]')).toContainText(/dostęp\smusi\smieć\sco\snajmniej\s1\sm/);
  await page.getByLabel('Linia napowietrzna').selectOption('do15');
  await page.getByLabel('Od linii w poziomie').fill('4');
  await expect(page.locator('[data-w="lista"]')).toContainText(/bliżej\sniż\s5\sm/);
});

test('błąd: liczba palet z ułamkiem, potem sekcja bez poziomów', async ({ page }) => {
  const blad = page.locator('[data-blad="dane"]');
  await page.getByLabel('Palety na poziomie').fill('1,5');
  await expect(blad).toContainText(/liczbę\scałkowitą/);
  await expect(page.getByLabel('Palety na poziomie')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('[data-w="glowny"]')).toHaveText('—');
  await page.getByLabel('Palety na poziomie').fill('2');
  await page.getByLabel('Zajęte poziomy').fill('');
  await expect(blad).toContainText(/liczbę\szajętych\spoziomów/);
  await page.getByLabel('Na sekcję (kg)').fill('');
  await expect(blad).toBeHidden();
});
