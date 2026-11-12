import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { adresNarzedzia } from '../../src/data/narzedzia';

// Kod 95: ważność wpisu (5 lat od świadectwa, nie dłużej niż orzeczenia), najpóźniejszy dzień szkolenia, strata przy
// szkoleniu wcześniej, plik .ics i sprawdzenie, czy praca wymaga kodu 95. Daty dalekie od dziś, żeby test był stabilny.
const ADRES = adresNarzedzia('kod-95');

test.beforeEach(async ({ page }) => {
  await page.goto(ADRES);
});

test('świadectwo 29.02.2032: kod do 28 lutego 2037 r., szkolenie najpóźniej 26 lutego', async ({ page }) => {
  await page.locator('#k95-szkolenie').fill('');
  await page.locator('#k95-data').fill('2032-02-29');
  await expect(page.locator('[data-w="termin"]')).toHaveText(/28\slutego\s2037\sr\./);
  await expect(page.locator('[data-w="ograniczenie"]')).toContainText('5 lat od wydania świadectwa');
  // 28.02.2037 to sobota: ostatni dzień roboczy 27.02, szkolenie najpóźniej 26.02.
  await expect(page.locator('[data-w="najpozniej"]')).toContainText(/26\slutego\s2037\sr\./);
  await expect(page.locator('[data-w="najpozniej"]')).toContainText(/nie\stermin\sz\sustawy/);
  await expect(page.locator('[data-w="zapas"]')).toContainText(/27\sstycznia\s2037\sr\.\s\(szacunek\sredakcji/);
  await expect(page.locator('[data-w="status"]')).toHaveAttribute('data-status', 'w-terminie');
  await expect(page.locator('[data-w="plan"]')).toHaveText('—');
});

test('orzeczenie lekarskie krótsze: kod przycięty do orzeczenia', async ({ page }) => {
  await page.locator('#k95-data').fill('2034-06-15');
  await page.getByLabel('Lekarskie').fill('2036-12-15');
  await expect(page.locator('[data-w="termin"]')).toHaveText(/15\sgrudnia\s2036\sr\./);
  await expect(page.locator('[data-w="ograniczenie"]')).toContainText('orzeczenia lekarskiego');
});

test('data z prawa jazdy i szkolenie wcześniej: przepada 115 dni', async ({ page }) => {
  await page.getByLabel('Datę kodu 95 z prawa jazdy').check();
  await expect(page.locator('[data-w="data-etykieta"]')).toHaveText('Kod 95 ważny do');
  await page.locator('#k95-data').fill('2041-03-15');
  await page.locator('#k95-szkolenie').fill('2040-11-20');
  await expect(page.locator('[data-w="termin"]')).toHaveText(/15\smarca\s2041\sr\./);
  await expect(page.locator('[data-w="plan"]')).toHaveText(/nowy\skod\sdo\s20\slistopada\s2045\sr\.;\sprzepada\s115\sdni\sobecnego/);
});

test('szkolenie po końcu ważności: dni bez kodu', async ({ page }) => {
  await page.getByLabel('Datę kodu 95 z prawa jazdy').check();
  await page.locator('#k95-data').fill('2041-03-15');
  await page.locator('#k95-szkolenie').fill('2041-04-01');
  await expect(page.locator('[data-w="plan"]')).toContainText(/17\sdni\sbez\skodu\s95/);
});

test('data z przeszłości: wygasł, bez pliku kalendarza', async ({ page }) => {
  await page.locator('#k95-data').fill('2015-05-10');
  await expect(page.locator('[data-w="status"]')).toContainText('Wygasł');
  await expect(page.locator('[data-w="uwaga"]')).toContainText(/szkolenie\sokresowe/);
  await expect(page.getByRole('button', { name: 'Dodaj do kalendarza (.ics)' })).toBeDisabled();
});

test('błędne dane: orzeczenie przed świadectwem', async ({ page }) => {
  await page.locator('#k95-data').fill('2034-06-15');
  await page.getByLabel('Psychologiczne').fill('2030-01-01');
  await expect(page.locator('[data-blad="orzeczenia"]')).toBeVisible();
  await expect(page.locator('[data-w="termin"]')).toHaveText(/Wpisz\sdatę/);
});

test('plik .ics z ostatnim dniem na szkolenie', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'Pobieranie plików w WebKit Playwright obsługuje inaczej; logikę pliku sprawdzają testy jednostkowe.');
  await page.getByLabel('Datę kodu 95 z prawa jazdy').check();
  await page.locator('#k95-data').fill('2041-03-15');
  const [pobranie] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Dodaj do kalendarza (.ics)' }).click()]);
  expect(pobranie.suggestedFilename()).toBe('kod-95.ics');
  const tresc = readFileSync((await pobranie.path())!, 'utf8');
  expect(tresc).toContain('DTSTART;VALUE=DATE:20410314');
  expect(tresc).toContain('DTSTART;VALUE=DATE:20410315');
});

test('czy potrzebujesz: B nie, C+E tak, wyjątek ocenny „jeśli…”, pkt 5 tylko dla D i D1', async ({ page }) => {
  const kat = page.getByLabel('Kategoria pojazdu w pracy');
  const werdykt = page.locator('[data-p="werdykt"]');
  await expect(werdykt).toHaveText('Potrzebujesz');
  await kat.selectOption('B');
  await expect(werdykt).toHaveText('Nie potrzebujesz');
  await expect(page.locator('[data-p="opis"]')).toContainText(/art\.\s39a\sust\.\s4/);
  await kat.selectOption('C');
  await page.getByLabel('Wożę sprzęt do swojej pracy').check();
  await expect(werdykt).toHaveText(/Nie\spotrzebujesz,\sjeśli…/);
  await page.getByLabel('Wożę sprzęt do swojej pracy').uncheck();
  await page.getByLabel('Autobus bez pasażerów do serwisu').check();
  await expect(werdykt).toHaveText('Potrzebujesz');
  await expect(page.locator('[data-p="uwaga"]')).toBeVisible();
  await page.getByLabel('Siły zbrojne').check();
  await expect(werdykt).toHaveText('Nie potrzebujesz');
});

test.describe('bez JavaScriptu', () => {
  test.use({ javaScriptEnabled: false });
  test('wynik startowy i tabela wyjątków są w HTML', async ({ page }) => {
    await page.goto(ADRES);
    await expect(page.locator('[data-w="termin"]')).toHaveText(/\d{4}\sr\./);
    await expect(page.locator('[data-p="werdykt"]')).toHaveText('Potrzebujesz');
    await expect(page.locator('#kiedy-potrzebny ~ .tabela tr', { hasText: '45 km/h' }).first()).toBeVisible();
  });
});
