import { expect, test } from '@playwright/test';

// Urlop w godzinach (art. 154^2 Kp), wartości sprawdzone niezależnie w Pythonie: 26 dni = 208 h; plan 4 × 12 h
// zostawia 160 h = 20 dni, 13 zmian po 12 h i 4 h; plan 18 × 12 h: 17 zmian w całości, 4 h na 18., brakuje 8 h.
test.beforeEach(async ({ page }) => {
  await page.goto('/narzedzia/urlop-w-godzinach');
  await page.locator('[name="dni"]').fill('26');
  await page.locator('[name="godziny"]').fill('0');
  await page.locator('[name="dlugosc1"]').fill('12');
  await page.locator('[name="liczba1"]').fill('4');
  await page.locator('[name="zadanie"]').fill('0');
});

test('26 dni i 4 zmiany po 12 h: zostaje 160 h', async ({ page }) => {
  await expect(page.locator('[data-w="zostalo"]')).toHaveText(/^160\sh$/);
  await expect(page.locator('[data-w="opis"]')).toHaveText(/20\sdni\surlopu\spo\s8\sh/);
  await expect(page.locator('[data-w="masz"]')).toContainText(/208\sh/);
  await expect(page.locator('[data-w="dalej1"]')).toHaveText(/^13\szmian\si\s4\sh\sna\sczęść\szmiany$/);
  await expect(page.locator('[data-w="na-zadanie"]')).toContainText(/4\sdni\sw\sramach\spozostałego\surlopu;\sprzy\szmianie\s12\sh\sto\s48\sh/);
});

test('18 zmian po 12 h: 17 w całości, 4 h na 18., brakuje 8 h', async ({ page }) => {
  await page.locator('[name="liczba1"]').fill('18');
  await expect(page.locator('[data-w="zostalo"]')).toHaveText(/^0\sh$/);
  await expect(page.locator('[data-w="pokrycie"]')).toHaveText(/17\sz\s18\szmian\sw\scałości,\sna\s18\.\szmianie\stylko\s4\sh\surlopu;\sbrakuje\s8\sh/);
  await expect(page.locator('[data-w="na-zadanie"]')).toContainText(/^0\sdni:\splan\swykorzystuje\scały\surlop/);
});

test('norma 7 h i jeden dzień na żądanie: 134 h = 19 dni i 1 h, zostały 3 dni', async ({ page }) => {
  await page.getByLabel('Dzień urlopu').selectOption('7');
  await page.locator('[name="zadanie"]').fill('1');
  await expect(page.locator('[data-w="zostalo"]')).toHaveText(/^134\sh$/);
  await expect(page.locator('[data-w="opis"]')).toHaveText(/19\sdni\si\s1\sh/);
  await expect(page.locator('[data-w="na-zadanie"]')).toContainText(/^3\sdni/);
  await expect(page.locator('[data-w="dalej1-etykieta"]')).toHaveText(/po\s7\sh/);
  await expect(page.locator('[data-w="dalej1"]')).toHaveText(/^19\szmian\si\s1\sh/);
  await expect(page.locator('[data-wiersz-dalej2]')).toBeHidden();
});

test('błędne dane: na żądanie 5 dni i zmiana 25 h', async ({ page }) => {
  await page.locator('[name="zadanie"]').fill('5');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.locator('[data-blad="dane"]')).toContainText(/od\s0\sdo\s4\sdni/);
  await expect(page.locator('[data-w="zostalo"]')).toHaveText('—');
  await page.locator('[name="zadanie"]').fill('0');
  await expect(page.locator('[data-blad="dane"]')).toBeHidden();
  await page.locator('[name="dlugosc1"]').fill('25');
  await expect(page.locator('[data-blad="dane"]')).toContainText(/Wiersz\s1:\sdługość\szmiany\sod\s1\sdo\s24\sh/);
  await expect(page.locator('[name="dlugosc1"]')).toHaveAttribute('aria-invalid', 'true');
  await page.locator('[name="dlugosc1"]').fill('12');
  await expect(page.locator('[name="dlugosc1"]')).not.toHaveAttribute('aria-invalid', 'true');
});

test('błąd w wierszu 2 przy pustym wierszu 1 podaje numer 2', async ({ page }) => {
  await page.locator('[name="dlugosc1"]').fill('');
  await page.locator('[name="liczba1"]').fill('');
  await page.locator('[name="dlugosc2"]').fill('0,5');
  await page.locator('[name="liczba2"]').fill('2');
  await expect(page.locator('[data-blad="dane"]')).toContainText(/Wiersz\s2:\sdługość\szmiany\sod\s1\sdo\s24\sh/);
  await expect(page.locator('[name="dlugosc2"]')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('[data-w="zostalo"]')).toHaveText('—');
});
