import { expect, test } from '@playwright/test';
import { adresNarzedzia } from '../../src/data/narzedzia';

// L4 wstecz (§ 7 rozporządzenia Dz.U. 2015 poz. 2013, § 2 rozporządzenia t.j. Dz.U. 2014 poz. 1632). Dziś 13.11.2026 r.
// (zegar przeglądarki), wizyta w piątek 13.11.2026 r.: najwcześniej od wtorku 10.11, bez warunków do 14.11, z warunkiem
// do 17.11. Daty i dni tygodnia z niezależnego rachunku (raporty/luki/rachunek_l4.py).
test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-11-13T10:00:00+01:00'));
  await page.goto(adresNarzedzia('l4-wstecz'));
  await page.getByLabel('Wizyta u lekarza').fill('2026-11-13');
});

test('dzisiejsze daty w formularzu: wizyta dziś, nieobecność od wczoraj', async ({ page }) => {
  await page.goto(adresNarzedzia('l4-wstecz'));
  await expect(page.getByLabel('Wizyta u lekarza')).toHaveValue('2026-11-13');
  await expect(page.getByLabel('Nie pracujesz od')).toHaveValue('2026-11-12');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Tak, jeśli badanie to potwierdzi');
});

test('3 dni wstecz: tak; zawiadomienie w drugim dniu nieobecności, który minął', async ({ page }) => {
  await page.getByLabel('Nie pracujesz od').fill('2026-11-10');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Tak, jeśli badanie to potwierdzi');
  await expect(page.locator('[data-w="od"]')).toHaveText(/^wtorek,\s10\slistopada\s2026\sr\.\s\(3\sdni\sprzed\swizytą\)$/);
  await expect(page.locator('[data-w="do"]')).toContainText(/sobota,\s14\slistopada\s2026\sr\.;\sdo\s17\slistopada\s2026\sr\./);
  await expect(page.locator('[data-w="zawiadom-etykieta"]')).toHaveText('Termin zawiadomienia minął');
  await expect(page.locator('[data-w="zawiadom"]')).toContainText(/środa,\s11\slistopada\s2026\sr\./);
});

test('4 dni wstecz: dzień bez zwolnienia; psychiatra: wyjątek z § 7 ust. 4', async ({ page }) => {
  await page.getByLabel('Nie pracujesz od').fill('2026-11-09');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Nie, tak daleko L4 nie sięga');
  await expect(page.locator('[data-w="opis"]')).toContainText(/\(1\sdzień\)\szostanie\sbez\szwolnienia/);
  await page.getByLabel('Lekarz', { exact: true }).selectOption('psychiatra');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Tylko w jednej sytuacji');
  await expect(page.locator('[data-w="opis"]')).toContainText(/§\s7\sust\.\s4/);
});

test('L4 od poniedziałku po piątkowej wizycie: z warunkiem; termin i uprzedzenie; 5. dzień za późno', async ({ page }) => {
  await page.getByLabel('Nie pracujesz od').fill('2026-11-16');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Tylko w dwóch sytuacjach');
  await expect(page.locator('[data-w="zawiadom-etykieta"]')).toHaveText('Zawiadom pracodawcę najpóźniej');
  await expect(page.locator('[data-w="zawiadom"]')).toHaveText(/^wtorek,\s17\slistopada\s2026\sr\.;\sgdy\sprzyczynę\sznasz\sz\sgóry,\suprzedź\sprzed\s16\slistopada\s2026\sr\.\s\(§\s2\sust\.\s1\)$/);
  await page.getByLabel('Nie pracujesz od').fill('2026-11-18');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Nie, to za daleko od wizyty');
  await expect(page.locator('[data-w="opis"]')).toHaveText(/najwcześniej\s14\slistopada\s2026\sr\.\s\(4\sdni\sprzed\spoczątkiem\)\.$/);
});

test('nieobecność od dziś: zawiadom do soboty, uwaga o dniu wolnym', async ({ page }) => {
  await page.getByLabel('Nie pracujesz od').fill('2026-11-13');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Tak');
  await expect(page.locator('[data-w="zawiadom-etykieta"]')).toHaveText('Zawiadom pracodawcę najpóźniej');
  await expect(page.locator('[data-w="zawiadom"]')).toContainText(/^sobota,\s14\slistopada\s2026\sr\./);
  await expect(page.locator('[data-w="uwaga"]')).toContainText(/14\slistopada\s2026\sr\.\sto\ssobota/);
});

test('brak daty to błąd przy polu', async ({ page }) => {
  await page.getByLabel('Nie pracujesz od').fill('');
  await expect(page.locator('[data-blad="dane"]')).toHaveText('Wpisz pierwszy dzień nieobecności w pracy.');
  await expect(page.getByLabel('Nie pracujesz od')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('—');
  await expect(page.locator('[data-w="zawiadom-etykieta"]')).toHaveText('Zawiadom pracodawcę najpóźniej');
});
