import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { adresNarzedzia } from '../../src/data/narzedzia';

// Ważność uprawnień SEP: 5 lat od dnia wydania (art. 54 ust. 1aa PE), stare świadectwa (art. 25 ustawy z 2021 r.),
// wpis „ważne do”, opłata za egzamin (§ 14), plik .ics. Daty dalekie od dziś, żeby test był stabilny.
const ADRES = adresNarzedzia('waznosc-uprawnien-sep');

test.beforeEach(async ({ page }) => {
  await page.goto(ADRES);
});

test('wydane 29.02.2024: ważne do 27 lutego 2029 r., rocznica 28 lutego', async ({ page }) => {
  await page.getByLabel('Data wydania świadectwa').fill('2024-02-29');
  await expect(page.locator('[data-w="termin"]')).toHaveText(/^27\slutego\s2029\sr\.$/);
  await expect(page.locator('[data-w="kc"]')).toContainText(/28\slutego\s2029/);
  await expect(page.locator('[data-w="status"]')).toHaveAttribute('data-status', 'w-terminie');
});

test('dzień rocznicy: ostatni dzień według art. 112 KC, nie „wygasło”', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2031-03-14T10:00:00+01:00'));
  await page.reload();
  await page.getByLabel('Data wydania świadectwa').fill('2026-03-14');
  await expect(page.locator('[data-w="termin"]')).toHaveText(/^13\smarca\s2031\sr\.$/);
  await expect(page.locator('[data-w="status"]')).toContainText(/Dziś\sostatni\sdzień\sważności\swedług\sart\.\s112\sKC/);
  await expect(page.locator('[data-w="status"]')).not.toContainText('Wygasło');
  await expect(page.locator('[data-w="uwaga"]')).toContainText(/Od\sjutra/);
});

test('bezterminowe sprzed 3 lipca 2021 r.: wygasło 2 lipca 2026 r., bez kalendarza', async ({ page }) => {
  await page.getByLabel('Data wydania świadectwa').fill('2015-06-10');
  await expect(page.locator('[data-w="termin"]')).toHaveText(/^2\slipca\s2026\sr\.$/);
  await expect(page.locator('[data-w="status"]')).toContainText('Wygasło');
  await expect(page.locator('[data-w="uwaga"]')).toContainText(/egzamin\sod\snowa/);
  await expect(page.getByRole('button', { name: 'Dodaj do kalendarza (.ics)' })).toBeDisabled();
});

test('wpis późniejszy niż 5 lat: bierzemy rocznicę, obie daty w uwadze', async ({ page }) => {
  await page.getByLabel('Data wydania świadectwa').fill('2024-03-10');
  await page.getByLabel('Wpis „ważne do” (jeśli jest)').fill('2035-01-01');
  await expect(page.locator('[data-w="termin"]')).toHaveText(/^10\smarca\s2029\sr\.$/);
  await expect(page.locator('[data-w="uwaga"]')).toContainText(/1\sstycznia\s2035/);
  await expect(page.locator('[data-w="uwaga"]')).toContainText(/art\.\s54\sust\.\s1aa/);
});

test('data egzaminu: etykieta pola się zmienia', async ({ page }) => {
  await page.getByLabel('Znam tylko datę egzaminu').check();
  await expect(page.getByLabel('Data egzaminu', { exact: true })).toBeVisible();
});

test('domyślna data wniosku to prawdziwe dziś: 5.01.2027 → 495,00 zł', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-01-05T10:00:00+01:00'));
  await page.reload();
  await expect(page.getByLabel('Data wniosku o egzamin')).toHaveValue('2027-01-05');
  await expect(page.locator('[data-w="oplata"]')).toContainText(/495,00\szł/);
});

test('opłata: wniosek 30.12.2026 → 480,60 zł, 4.01.2027 → 495,00 zł', async ({ page }) => {
  await page.getByLabel('Data wniosku o egzamin').fill('2026-12-30');
  await expect(page.locator('[data-w="oplata"]')).toContainText(/480,60\szł/);
  await page.getByLabel('Data wniosku o egzamin').fill('2027-01-04');
  await expect(page.locator('[data-w="oplata"]')).toContainText(/495,00\szł/);
});

test('błędne dane: wpis przed datą wydania', async ({ page }) => {
  await page.getByLabel('Data wydania świadectwa').fill('2024-03-10');
  await page.getByLabel('Wpis „ważne do” (jeśli jest)').fill('2023-01-01');
  await expect(page.locator('[data-blad="wpis"]')).toBeVisible();
  await expect(page.locator('[data-w="termin"]')).toHaveText('Wpisz datę');
});

test('plik .ics z przypomnieniami', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'Pobieranie plików w WebKit Playwright obsługuje inaczej; logikę sprawdzają testy jednostkowe.');
  await page.getByLabel('Data wydania świadectwa').fill('2024-02-29');
  const [pobranie] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Dodaj do kalendarza (.ics)' }).click()]);
  expect(pobranie.suggestedFilename()).toBe('uprawnienia-sep.ics');
  const tresc = readFileSync((await pobranie.path())!, 'utf8');
  expect(tresc).toContain('DTSTART;VALUE=DATE:20281127');
  expect(tresc).toContain('DTSTART;VALUE=DATE:20290127');
  expect(tresc).toContain('DTSTART;VALUE=DATE:20290227');
});

test.describe('bez JavaScriptu', () => {
  test.use({ javaScriptEnabled: false });
  test('wynik startowy i tabele są w HTML', async ({ page }) => {
    await page.goto(ADRES);
    await expect(page.locator('[data-w="termin"]')).toHaveText(/\d{4}\sr\.$/);
    await expect(page.locator('#oplata ~ .tabela tr', { hasText: '2026' })).toContainText(/480,60\szł/);
    await expect(page.locator('#grupy ~ .tabela tr', { hasText: 'G2 pkt 16' })).toContainText('sprężarki');
  });
});
