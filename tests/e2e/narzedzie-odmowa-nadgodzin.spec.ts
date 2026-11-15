import { expect, test } from '@playwright/test';
import { adresNarzedzia } from '../../src/data/narzedzia';

// Czy można odmówić nadgodzin (art. 100 § 1, 132 § 1, 151 § 1–3, 178, 203 Kp; art. 15 ust. 3 i 16 ustawy o rehabilitacji).
// Zmiana 6:00–14:00, następna 6:00: najpóźniej 19:00 (11 h odpoczynku); wartości z raporty/luki/rachunek_nadgodziny.py.
test.beforeEach(async ({ page }) => {
  await page.goto(adresNarzedzia('odmowa-nadgodzin'));
});

test('do 18:00 przy 40 h w roku: musisz, 4 h, najpóźniej 19:00, limit 110 → 106 h', async ({ page }) => {
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Co do zasady musisz zostać');
  await expect(page.locator('[data-w="dzis"]')).toHaveText(/^4\sh,\sdo\s18:00$/);
  await expect(page.locator('[data-w="najpozniej"]')).toHaveText(/^19:00\s\(11\sh\sodpoczynku\sprzed\snastępną\szmianą\)$/);
  await expect(page.locator('[data-w="limit"]')).toHaveText(/^zostało\s110\sz\s150\sh\sw\stym\sroku,\spo\sdzisiejszych\s106\sh$/);
});

test('do 20:00: za długo przez odpoczynek; przy awarii musisz, z uwagą o równoważnym odpoczynku', async ({ page }) => {
  await page.getByLabel('Praca miałaby trwać do').fill('20:00');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Nie tak długo');
  await expect(page.locator('[data-w="powody"]')).toContainText(/zostałoby\s10\sh.*o\s19:00/);
  await page.getByLabel('Powód nadgodzin').selectOption('awaria');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Co do zasady musisz zostać');
  await expect(page.locator('[data-w="uwaga"]')).toContainText(/równoważny\sodpoczynek/);
});

test('ciąża: nie wolno; dziecko do 8 lat: tylko za zgodą', async ({ page }) => {
  await page.getByLabel('Jesteś w ciąży').check();
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Nie wolno: możesz odmówić');
  await expect(page.locator('[data-w="powody"]')).toContainText(/art\.\s178\s§\s1/);
  await page.getByLabel('Jesteś w ciąży').uncheck();
  await page.getByLabel('Wychowujesz dziecko, które nie ma jeszcze 8 lat').check();
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Tylko za Twoją zgodą');
  await page.getByLabel('Zgadzasz się na nadgodziny (przy dziecku do 8 lat)').check();
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Co do zasady musisz zostać');
});

test('limit: 148 h w roku i 4 h dziś to ponad 150 h; inny limit z regulaminu', async ({ page }) => {
  await page.getByLabel('Nadgodziny w tym roku').fill('148');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Nie tak długo');
  await expect(page.locator('[data-w="powody"]')).toContainText(/Zostało\s2\sh/);
  await page.getByLabel('Limit w roku (h)').fill('200');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Co do zasady musisz zostać');
});

test('błędne dane: koniec pracy przed końcem zmiany, zła liczba godzin', async ({ page }) => {
  await page.getByLabel('Praca miałaby trwać do').fill('13:00');
  await expect(page.locator('[data-blad="dane"]')).toHaveText('Koniec pracy nie może być wcześniej niż koniec zmiany.');
  await expect(page.getByLabel('Praca miałaby trwać do')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('—');
  await page.getByLabel('Praca miałaby trwać do').fill('16:00');
  await page.getByLabel('Nadgodziny w tym roku').fill('abc');
  await expect(page.locator('[data-blad="dane"]')).toHaveText('Wpisz liczbę godzin, na przykład 40 albo 12,5.');
});
