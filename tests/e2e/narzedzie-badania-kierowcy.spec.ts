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
  await expect(page.locator('[data-w="lek-ostroznie"]')).toBeHidden();
});

test('5 lat wypada po 60. urodzinach: wiąże termin ustawowy, ostrożny osobno', async ({ page }) => {
  await wpisz(page, { 'Data urodzenia': '1968-03-15', 'Data orzeczenia lekarskiego': '2026-01-20', 'Data orzeczenia psychologa': '2026-01-20' });
  await expect(page.locator('[data-w="lek"]')).toHaveText(/^20\sstycznia\s2031\sr\.$/);
  await expect(page.locator('[data-w="lek-ostroznie"]')).toBeVisible();
  await expect(page.locator('[data-w="lek-ostroznie"]')).toContainText(/Bezpieczniej\swcześniej:\s20\slipca\s2028\sr\..*przepis\stego\snie\swymaga/);
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
  await expect(page.locator('[data-w="oplata-psy"]')).toContainText('stałego obowiązku nie ma');
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

test('wartości startowe liczone od prawdziwego dziś (page.clock 2027-06-01)', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-06-01T10:00:00+02:00'));
  await page.goto(ADRES);
  await expect(page.getByLabel('Data orzeczenia lekarskiego')).toHaveValue('2025-06-01');
  await expect(page.getByLabel('Data urodzenia')).toHaveValue('1982-06-01'); // Python: 2027-06-01 − 16436 dni
  await expect(page.locator('[data-w="lek"]')).toHaveText(/^1\sczerwca\s2030\sr\.$/);
  await expect(page.locator('[data-w="status-lek"]')).toHaveText(/W\sterminie:\sza\s1096\sdni/);
});

test('data spoza zakresu pola: komunikat zamiast wyniku', async ({ page }) => {
  await wpisz(page, { 'Data urodzenia': '1920-01-01' });
  await expect(page.locator('[data-blad="urodzenie"]')).toHaveText(/Wpisz\sdatę\sod\s1\sstycznia\s1930\sr\./);
  await expect(page.locator('[data-w="lek"]')).toHaveText('Wpisz daty');
  await expect(page.locator('[data-w="wiersz-60"]')).toBeHidden();
});

test('wózek bez terminu z orzeczenia: kalendarz wyłączony z dopiskiem', async ({ page }) => {
  await page.getByLabel('Operator wózka widłowego').check();
  await expect(page.getByRole('button', { name: 'Dodaj do kalendarza (.ics)' })).toBeDisabled();
  await expect(page.locator('[data-w="ics-opis"]')).toHaveText(/Terminy\sdo\skalendarza\spo\swpisaniu\sterminu\sz\sorzeczenia\./);
});

test.describe('bez JavaScriptu', () => {
  test.use({ javaScriptEnabled: false });
  test('wynik startowy i tabela są w HTML', async ({ page }) => {
    await page.goto(ADRES);
    await expect(page.locator('[data-w="lek"]')).toHaveText(/\d{4}\sr\.$/);
    await expect(page.locator('[data-w="oplata-lek"]')).toContainText('200 zł');
    await expect(page.locator('#co-ile ~ .tabela tr', { hasText: 'po 60 latach' })).toContainText('co 30 miesięcy');
    await expect(page.locator('[data-w="status-lek"]')).toBeHidden();
  });
});
