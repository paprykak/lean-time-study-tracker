import { expect, test } from '@playwright/test';

// Wypowiedzenie zmieniające (art. 42 § 3, art. 36 § 1, art. 264 § 1 Kp): wartości jak w wypowiedzenie-zmieniajace.test.ts.
test.beforeEach(async ({ page }) => {
  await page.goto('/narzedzia/wypowiedzenie-zmieniajace');
});

test('staż ponad 3 lata: odmowa do 5 stycznia, koniec 28 lutego, sąd do 3 grudnia', async ({ page }) => {
  await page.getByLabel('Pracujesz u tego pracodawcy od').fill('2020-01-15');
  await page.getByLabel('Dzień doręczenia pisma').fill('2026-11-12');
  await expect(page.locator('[data-w="odmowa"]')).toHaveText(/^5\sstycznia\s2027\sr\.$/);
  await expect(page.locator('[data-w="okres"]')).toHaveText(/^3\smiesiące$/);
  await expect(page.locator('[data-w="koniec"]')).toHaveText(/^28\slutego\s2027\sr\.$/);
  await expect(page.locator('[data-w="wariant-b"]')).toHaveText(/^14\sstycznia\s2027\sr\.$/);
  await expect(page.locator('[data-w="odwolanie"]')).toHaveText(/^3\sgrudnia\s2026\sr\.$/);
});

test('bez pouczenia: odmowa do końca okresu', async ({ page }) => {
  await page.getByLabel('Pracujesz u tego pracodawcy od').fill('2020-01-15');
  await page.getByLabel('Dzień doręczenia pisma').fill('2026-11-12');
  await page.getByLabel(/pouczenie/).uncheck();
  await expect(page.locator('[data-w="odmowa"]')).toHaveText(/^28\slutego\s2027\sr\.$/);
});

test('bez pouczenia, próg 6 miesięcy w trakcie wypowiedzenia: odmowa do końca krótszego okresu', async ({ page }) => {
  await page.getByLabel('Pracujesz u tego pracodawcy od').fill('2026-05-13');
  await page.getByLabel('Dzień doręczenia pisma').fill('2026-11-12');
  await page.getByLabel(/pouczenie/).uncheck();
  await expect(page.locator('[data-w="odmowa"]')).toHaveText(/^28\slistopada\s2026\sr\.$/);
  await expect(page.locator('[data-w="koniec"]')).toHaveText(/^31\sgrudnia\s2026\sr\.$/);
  await expect(page.locator('[data-w="uwaga"]')).toContainText(/okres się wydłuża \(art\.\s42\s§\s1 Kodeksu pracy, wyrok Sądu Najwyższego I\sPKN\s34\/99\), ale termin na\sodmowę liczymy od\skrótszego okresu\./);
  await expect(page.locator('[data-w="prog"]')).toHaveText(/^6\smiesięcy mija 12\slistopada\s2026\sr\.; odmowę liczymy od\skrótszego okresu \(2\stygodnie\)$/);
});

test('doręczenie przed początkiem pracy: komunikat błędu', async ({ page }) => {
  await page.getByLabel('Pracujesz u tego pracodawcy od').fill('2026-11-13');
  await page.getByLabel('Dzień doręczenia pisma').fill('2026-11-12');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.locator('[data-w="odmowa"]')).toHaveText('—');
});

test('odprawa po odmowie: kryterium z orzecznictwa SN z sygnaturami na stronie po nagłówku „Po odmowie”', async ({ page }) => {
  const sekcja = (await page.locator('#po-odmowie ~ *').allInnerTexts()).join(' ');
  expect(sekcja).toMatch(/Sama odmowa nowych warunków nie odbiera odprawy/);
  expect(sekcja).toMatch(/I\sPK\s144\/11,\sIII\sPK\s55\/14/);
  expect(sekcja).toMatch(/radykalnej obniżki pensji za\stę samą pracę \(I\sPKN\s79\/00\)/);
  expect(sekcja).toMatch(/to samo dotyczy zwolnień grupowych/);
  expect(sekcja).toMatch(/Odmowa może być uznana za\swspółprzyczynę/);
});

test('z pouczeniem, próg 6 miesięcy w trakcie wypowiedzenia: oba warianty połowy z krótszego okresu', async ({ page }) => {
  await page.getByLabel('Pracujesz u tego pracodawcy od').fill('2026-05-13');
  await page.getByLabel('Dzień doręczenia pisma').fill('2026-11-12');
  await expect(page.locator('[data-w="odmowa"]')).toHaveText(/^20\slistopada\s2026\sr\.$/);
  await expect(page.locator('[data-w="wariant-b"]')).toHaveText(/^21\slistopada\s2026\sr\.$/);
  await expect(page.locator('[data-w="koniec"]')).toHaveText(/^31\sgrudnia\s2026\sr\.$/);
});

test('koniec w sobotę: odmowa i odwołanie z datą „zdąż do” i datą według art. 115 KC', async ({ page }) => {
  await page.getByLabel('Pracujesz u tego pracodawcy od').fill('2026-06-01');
  await page.getByLabel('Dzień doręczenia pisma').fill('2026-11-14');
  await expect(page.locator('#wynik-tytul')).toHaveText(/^Odmowa: zdąż do$/);
  await expect(page.locator('[data-w="odmowa"]')).toHaveText(/^21\slistopada\s2026\sr\.$/);
  await expect(page.locator('[data-w="odmowa-art115"]')).toHaveText(/^23\slistopada\s2026\sr\.$/);
  await expect(page.locator('[data-w="odmowa-zdanie"]')).toContainText(/21\slistopada\s2026\sr\. to\ssobota.*art\.\s61\s§\s1 Kodeksu cywilnego/);
  await expect(page.locator('[data-w="odwolanie"]')).toHaveText(/^5\sgrudnia\s2026\sr\.$/);
  await expect(page.locator('[data-w="odwolanie-art115"]')).toHaveText(/^7\sgrudnia\s2026\sr\.$/);
  await expect(page.locator('[data-w="odwolanie-zdanie"]')).toContainText(/IV\sP\s24\/19/);
  // Dzień roboczy: jedna data, wiersze i zdania o art. 115 KC ukryte.
  await page.getByLabel('Dzień doręczenia pisma').fill('2026-11-12');
  await expect(page.locator('#wynik-tytul')).toHaveText(/^Odmowę złóż najpóźniej$/);
  await expect(page.locator('[data-wiersz="odmowa-art115"]')).toBeHidden();
  await expect(page.locator('[data-wiersz="odwolanie-art115"]')).toBeHidden();
  await expect(page.locator('[data-w="odmowa-zdanie"]')).toBeHidden();
  await expect(page.locator('[data-w="odwolanie-zdanie"]')).toBeHidden();
});
