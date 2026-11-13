import { expect, test } from '@playwright/test';

const ADRES = '/narzedzia/badania-lekarskie-w-pracy';

// Stałe daty (sprawdzone niezależnie w Pythonie): 2–20.11.2026 i 23.11–4.12.2026, przerwa sobota–niedziela,
// razem z przerwą 33 dni; 1–31.01.2026 to 31 dni; umowa do 31.10.2026, ostatni dzień na start bez badań
// 30.11.2026; orzeczenie otrzymane 4.11.2026, odwołanie do 11.11.2026 (święto); 1.01–13.02.2026 to 44 dni,
// 14–15.02.2026 to sobota i niedziela, powrót po 16–20.02 to 21.02.2026.
test.beforeEach(async ({ page }) => {
  await page.goto(ADRES);
});

test('po L4: przerwa tylko w weekend, przepis nie rozstrzyga; dzień pracy w przerwie rozdziela', async ({ page }) => {
  await page.locator('[name="od1"]').fill('2026-11-02');
  await page.locator('[name="do1"]').fill('2026-11-20');
  await page.locator('[name="od2"]').fill('2026-11-23');
  await page.locator('[name="do2"]').fill('2026-12-04');
  await expect(page.locator('[data-w="a-wynik"]')).toHaveText(/przepis\stego\snie\srozstrzyga/);
  await expect(page.locator('[data-w="a-opis"]')).toContainText(/33\sdni/);
  await page.getByLabel('Między zwolnieniami był dzień pracy?').selectOption('tak');
  await expect(page.locator('[data-w="a-wynik"]')).toHaveText(/nie\sjest\swymagane/);
  await expect(page.locator('[data-w="a-powrot"]')).toContainText(/5\sgrudnia\s2026/);
  // Wynik „nie jest wymagane”: bez wierszy o terminie i skierowaniu.
  await expect(page.locator('[data-tylko="kontrolne"]').first()).toBeHidden();
});

test('po L4: wcześniejsze zwolnienie 44 dni i weekend przerwy, badanie potrzebne', async ({ page }) => {
  await page.locator('[name="od1"]').fill('2026-01-01');
  await page.locator('[name="do1"]').fill('2026-02-13');
  await page.locator('[name="od2"]').fill('2026-02-16');
  await page.locator('[name="do2"]').fill('2026-02-20');
  await expect(page.locator('[data-w="a-wynik"]')).toHaveText(/^potrzebne$/);
  await expect(page.locator('[data-w="a-opis"]')).toContainText(/44\sdni/);
  await expect(page.locator('[data-w="a-powrot"]')).toContainText(/21\slutego\s2026/);
  // FAQ mówi to samo co wynik: wcześniejsze zwolnienie ponad 30 dni bez dnia pracy w przerwie to badanie.
  await expect(page.locator('main')).toContainText(/wcześniejsze\szwolnienie\strwało\sdłużej\sniż\s30\sdni,\sa\sdo\snastępnego\snie\sbyło\sdnia\spracy,\sbadanie\skontrolne\sjest\spotrzebne/);
});

test('po L4: 31 dni wymaga badania; koniec przed początkiem to błąd danych', async ({ page }) => {
  await page.locator('[name="od1"]').fill('2026-01-01');
  await page.locator('[name="do1"]').fill('2026-01-31');
  await expect(page.locator('[data-w="a-wynik"]')).toHaveText(/^potrzebne$/);
  await expect(page.locator('[data-w="a-powrot"]')).toContainText(/1\slutego\s2026/);
  await expect(page.locator('[data-uwaga="czas"]')).toContainText(/godzinach\spracy/);
  await page.locator('[name="do1"]').fill('2025-12-20');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.locator('[data-w="a-wynik"]')).toHaveText('—');
  await expect(page.locator('[data-blad="dane"]')).toHaveAttribute('role', 'alert');
  await expect(page.locator('[data-w="a-powrot"]')).toHaveText('—');
});

test('nowa praca: 30. dzień po umowie warunkowo bez badań, 31. dzień badania wstępne', async ({ page }) => {
  await page.getByLabel('Nowa praca').check();
  await page.locator('[name="koniec"]').fill('2026-10-31');
  await page.locator('[name="start"]').fill('2026-11-30');
  await page.locator('[name="nastepne"]').fill('2027-05-01');
  await expect(page.locator('[data-w="b-wynik"]')).toHaveText(/mogą\snie\sbyć\spotrzebne/);
  await expect(page.locator('[data-w="b-warunki"]')).toContainText(/30\slistopada\s2026/);
  await page.locator('[name="start"]').fill('2026-12-01');
  await expect(page.locator('[data-w="b-wynik"]')).toHaveText(/^potrzebne$/);
});

test('orzeczenie: odwołanie do 11 listopada (święto) i przypomnienie w kalendarzu', async ({ page }) => {
  await page.getByLabel('Mam orzeczenie').check();
  await page.locator('[name="otrzymane"]').fill('2026-11-04');
  await expect(page.locator('[data-w="c-wynik"]')).toHaveText(/11\slistopada\s2026/);
  await expect(page.locator('[data-w="c-opis"]')).toContainText(/święto/);
  await expect(page.locator('[data-ics]')).toBeDisabled();
  await page.locator('[name="nastepneOkresowe"]').fill('2099-05-12');
  await expect(page.locator('[data-w="c-nastepne"]')).toContainText(/12\smaja\s2099/);
  await expect(page.locator('[data-ics]')).toBeEnabled();
  // Puste „Dzień otrzymania”: błąd, ale przypomnienie o badaniu okresowym zostaje.
  await page.locator('[name="otrzymane"]').fill('');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.locator('[data-w="c-wynik"]')).toHaveText('—');
  await expect(page.locator('[data-w="c-nastepne"]')).toContainText(/12\smaja\s2099/);
  await expect(page.locator('[data-ics]')).toBeEnabled();
});

test('strona zbudowana wcześniej, otwarta 5 stycznia 2027 r.: domyślne daty liczone od dziś, nie od dnia buildu', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-01-05T10:00:00+01:00'));
  await page.goto(ADRES);
  // Zwolnienie 2.12.2026–4.01.2027 (34 dni), powrót 5.01.2027.
  await expect(page.locator('[name="od1"]')).toHaveValue('2026-12-02');
  await expect(page.locator('[name="do1"]')).toHaveValue('2027-01-04');
  await expect(page.locator('[name="od2"]')).toHaveValue('');
  await expect(page.locator('[data-w="a-powrot"]')).toContainText(/5\sstycznia\s2027/);
  await expect(page.locator('[name="koniec"]')).toHaveValue('2026-12-16');
  await expect(page.locator('[name="start"]')).toHaveValue('2027-01-10');
  await expect(page.locator('[name="nastepne"]')).toHaveValue('2029-01-04');
  await page.getByLabel('Mam orzeczenie').check();
  await expect(page.locator('[name="otrzymane"]')).toHaveValue('2027-01-05');
  await expect(page.locator('[data-w="c-wynik"]')).toHaveText(/12\sstycznia\s2027/);
});
