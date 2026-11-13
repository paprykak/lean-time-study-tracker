import { expect, test } from '@playwright/test';
import { adresNarzedzia } from '../../src/data/narzedzia';

// Zaświadczenie ADR: okres na kurs doskonalący (art. 24 ust. 6), nowe 5 lat, egzamin za wcześnie i po końcu, kto płaci,
// plik .ics i błędne dane. Daty dalekie od dziś, żeby test był stabilny.
const ADRES = adresNarzedzia('zaswiadczenie-adr');

test.beforeEach(async ({ page }) => {
  await page.goto(ADRES);
});

test('ważne do 20.05.2041: okres, zapas i nowe zaświadczenie', async ({ page }) => {
  await page.locator('#adr-egzamin').fill('');
  await page.locator('#adr-wazne').fill('2041-05-20');
  await expect(page.locator('[data-w="termin"]')).toHaveText(/20\smaja\s2041\sr\./);
  await expect(page.locator('[data-w="status"]')).toHaveAttribute('data-status', 'w-terminie');
  await expect(page.locator('[data-w="okno"]')).toHaveText(/od\s21\smaja\s2040\sr\.\sdo\s19\smaja\s2041\sr\./);
  await expect(page.locator('[data-w="zapas"]')).toContainText(/do\s6\smaja\s2041\sr\./);
  await expect(page.locator('[data-w="nowy"]')).toHaveText(/co\snajmniej\sdo\s19\smaja\s2046\sr\./);
  await expect(page.locator('[data-w="plan"]')).toHaveText('—');
  await expect(page.getByRole('button', { name: 'Dodaj do kalendarza (.ics)' })).toBeEnabled();
});

test('egzamin za wcześnie: 5 lat od egzaminu i strata dni', async ({ page }) => {
  await page.locator('#adr-wazne').fill('2041-05-20');
  await page.locator('#adr-egzamin').fill('2040-04-10');
  await expect(page.locator('[data-w="plan"]')).toHaveText(/za\swcześnie.*co\snajmniej\sdo\s9\skwietnia\s2045\sr\.;\sprzepada\s405\sdni/);
});

test('egzamin w okresie i po końcu ważności', async ({ page }) => {
  await page.locator('#adr-wazne').fill('2041-05-20');
  await page.locator('#adr-egzamin').fill('2041-03-10');
  await expect(page.locator('[data-w="plan"]')).toHaveText(/^przedłużenie:\snowe\szaświadczenie\sważne\sco\snajmniej\sdo\s19\smaja\s2046\sr\.$/);
  await page.locator('#adr-egzamin').fill('2041-06-03');
  await expect(page.locator('[data-w="plan"]')).toHaveText(/14\sdni\sbez\szaświadczenia/);
});

test('kto płaci zależy od wyboru', async ({ page }) => {
  await expect(page.locator('[data-w="placi"]')).toContainText('art. 39 pkt 1');
  await page.getByLabel('Jeszcze nie, kurs na własną rękę').check();
  await expect(page.locator('[data-w="placi"]')).toContainText('art. 39 pkt 2');
});

test('data z przeszłości: wygasło, bez pliku kalendarza', async ({ page }) => {
  await page.locator('#adr-egzamin').fill('');
  await page.locator('#adr-wazne').fill('2015-05-10');
  await expect(page.locator('[data-w="status"]')).toHaveText('Wygasło');
  await expect(page.locator('[data-w="okno"]')).toHaveText('minął');
  await expect(page.locator('[data-w="uwaga"]')).toContainText(/art\.\s20\sust\.\s1/);
  await expect(page.getByRole('button', { name: 'Dodaj do kalendarza (.ics)' })).toBeDisabled();
});

test('błędne dane: brak daty i egzamin przed wydaniem', async ({ page }) => {
  await page.locator('#adr-wazne').fill('');
  await expect(page.locator('[data-blad="wazne"]')).toBeVisible();
  await expect(page.locator('[data-w="termin"]')).toHaveText('Wpisz datę');
  await page.locator('#adr-wazne').fill('2041-05-20');
  await page.locator('#adr-egzamin').fill('2030-01-01');
  await expect(page.locator('[data-blad="egzamin"]')).toBeVisible();
  await expect(page.locator('#adr-egzamin')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('[data-w="plan"]')).toHaveText('—');
});
