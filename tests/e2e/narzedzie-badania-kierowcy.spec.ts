import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';

// Badania kierowcy: terminy z art. 39j ust. 4 i 39k ust. 3 UTD (5 lat / 30 miesięcy po 60), wariant ostrożny przy
// przejściu przez 60. urodziny, pierwszeństwo terminu z orzeczenia, role z Kodeksu pracy, błędy danych, .ics.
// Terminy daleko w przyszłości (stabilne statusy); daty w oczekiwaniach z twardymi spacjami, stąd \s.
const ADRES = '/narzedzia/badania-kierowcy';

test.beforeEach(async ({ page }) => {
  await page.goto(ADRES);
});

const wpisz = async (page: import('@playwright/test').Page, d: Record<string, string>) => {
  for (const [etykieta, wartosc] of Object.entries(d)) await page.getByLabel(etykieta, { exact: true }).fill(wartosc);
};

test('kierowca do 60 lat: co 5 lat, osobno lekarskie i psychotesty', async ({ page }) => {
  await wpisz(page, { 'Data urodzenia': '1990-12-31', 'Data orzeczenia lekarskiego': '2025-12-31', 'Data orzeczenia psychologa': '2024-02-29' });
  await expect(page.locator('[data-w="lek"]')).toHaveText(/^31\sgrudnia\s2030\sr\.$/);
  await expect(page.locator('[data-w="psy"]')).toHaveText(/^28\slutego\s2029\sr\.$/);
  await expect(page.locator('[data-w="status-lek"]')).toHaveAttribute('data-status', 'w-terminie');
  await expect(page.locator('[data-w="lek-opis"]')).toContainText('art. 39j ust. 4 pkt 1');
});

test('5 lat wypada po 60. urodzinach: wariant ostrożny', async ({ page }) => {
  await wpisz(page, { 'Data urodzenia': '1968-03-15', 'Data orzeczenia lekarskiego': '2026-01-20', 'Data orzeczenia psychologa': '2026-01-20' });
  await expect(page.locator('[data-w="lek"]')).toHaveText(/^20\slipca\s2028\sr\.$/);
  await expect(page.locator('[data-w="lek-opis"]')).toContainText(/Ostrożnie.*20\sstycznia\s2031\sr\./);
});

test('wcześniejszy termin z orzeczenia ma pierwszeństwo', async ({ page }) => {
  await wpisz(page, { 'Data urodzenia': '1981-05-10', 'Data orzeczenia lekarskiego': '2026-11-12', 'Termin z orzeczenia lekarskiego': '2029-11-12' });
  await expect(page.locator('[data-w="lek"]')).toHaveText(/^12\slistopada\s2029\sr\.$/);
  await expect(page.locator('[data-w="lek-opis"]')).toContainText('Termin z orzeczenia');
});

test('wózek widłowy: widełki, bez psychotestów z przepisu, zaległe po górnej granicy', async ({ page }) => {
  await page.getByLabel('Operator wózka widłowego').check();
  await expect(page.getByLabel('Data orzeczenia psychologa')).toBeHidden();
  await wpisz(page, { 'Data urodzenia': '1980-01-01', 'Data orzeczenia lekarskiego': '2020-01-10' });
  await expect(page.locator('[data-w="lek"]')).toHaveText(/między\s10\sstycznia\s2023\sr\.\sa\s10\sstycznia\s2024\sr\./);
  await expect(page.locator('[data-w="status-lek"]')).toHaveAttribute('data-status', 'po-terminie');
  await expect(page.locator('[data-w="oplata-psy"]')).toContainText('żaden przepis ich nie wymaga');
  await expect(page.locator('[data-w="uwaga"]')).toContainText('art. 229 § 4');
});

test('auto służbowe: wiąże termin z orzeczenia, bez daty urodzenia', async ({ page }) => {
  await page.getByLabel('Auto służbowe, bez przewozu').check();
  await expect(page.getByLabel('Data urodzenia')).toBeHidden();
  await wpisz(page, { 'Data orzeczenia lekarskiego': '2025-08-31', 'Termin z orzeczenia lekarskiego': '2030-08-31' });
  await expect(page.locator('[data-w="lek"]')).toHaveText(/^31\ssierpnia\s2030\sr\.$/);
  await expect(page.locator('[data-w="placi"]')).toContainText('art. 229 § 6');
});

test('błędne dane: badanie przed urodzeniem, termin przed badaniem', async ({ page }) => {
  await wpisz(page, { 'Data urodzenia': '1990-05-10', 'Data orzeczenia lekarskiego': '1985-01-01' });
  await expect(page.locator('[data-blad="lek"]')).toHaveText('Data badania jest przed datą urodzenia.');
  await expect(page.locator('[data-w="lek"]')).toHaveText('Wpisz daty');
  await expect(page.getByRole('button', { name: 'Dodaj do kalendarza (.ics)' })).toBeDisabled();
  await wpisz(page, { 'Data orzeczenia lekarskiego': '2025-01-01', 'Termin z orzeczenia lekarskiego': '2024-01-01' });
  await expect(page.locator('[data-blad="lekTermin"]')).toHaveText('Termin musi być późniejszy niż data badania.');
});

test('plik .ics z terminami obu badań', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'Pobieranie plików w WebKit Playwright obsługuje inaczej; logikę sprawdzają testy jednostkowe.');
  await wpisz(page, { 'Data urodzenia': '1990-12-31', 'Data orzeczenia lekarskiego': '2025-12-31', 'Data orzeczenia psychologa': '2025-06-30' });
  const [pobranie] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Dodaj do kalendarza (.ics)' }).click()]);
  expect(pobranie.suggestedFilename()).toBe('badania-kierowcy.ics');
  const tresc = readFileSync((await pobranie.path())!, 'utf8');
  expect(tresc).toContain('DTSTART;VALUE=DATE:20301231');
  expect(tresc).toContain('DTSTART;VALUE=DATE:20300630');
});

test.describe('bez JavaScriptu', () => {
  test.use({ javaScriptEnabled: false });
  test('wynik startowy i tabela są w HTML', async ({ page }) => {
    await page.goto(ADRES);
    await expect(page.locator('[data-w="lek"]')).toHaveText(/\d{4}\sr\.$/);
    await expect(page.locator('[data-w="oplata-lek"]')).toContainText('200 zł');
    await expect(page.locator('#co-ile ~ .tabela tr', { hasText: 'po 60 latach' })).toContainText('co 30 miesięcy');
  });
});
