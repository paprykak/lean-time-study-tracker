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
  await expect(page.locator('[data-w="prog"]')).toHaveText(/^6\smiesięcy stażu mija 12\slistopada\s2026\sr\.; odmowę liczymy od\skrótszego okresu \(2\stygodnie\)$/);
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
  await page.clock.setFixedTime(new Date('2026-11-22T10:00:00+01:00'));
  await page.goto('/narzedzia/wypowiedzenie-zmieniajace');
  await page.getByLabel('Pracujesz u tego pracodawcy od').fill('2026-06-01');
  await page.getByLabel('Dzień doręczenia pisma').fill('2026-11-14');
  await expect(page.locator('#wynik-tytul')).toHaveText(/^Odmowa: zdąż do$/);
  await expect(page.locator('[data-w="odmowa"]')).toHaveText(/^21\slistopada\s2026\sr\.$/);
  await expect(page.locator('[data-w="odmowa-art115"]')).toHaveText(/^23\slistopada\s2026\sr\.$/);
  await expect(page.locator('[data-w="odmowa-zdanie"]')).toContainText(/21\slistopada\s2026\sr\. to\ssobota.*art\.\s61\s§\s1 Kodeksu cywilnego/);
  await expect(page.locator('[data-w="odwolanie"]')).toHaveText(/^5\sgrudnia\s2026\sr\.$/);
  await expect(page.locator('[data-w="odwolanie-art115"]')).toHaveText(/^7\sgrudnia\s2026\sr\.$/);
  await expect(page.locator('[data-w="odwolanie-zdanie"]')).toContainText(/IV\sP\s24\/19/);
  await expect(page.locator('[data-w="odwolanie-etykieta"]')).toHaveText(/^Odwołanie do\ssądu pracy: zdąż do$/);
  await expect(page.locator('[data-wiersz="odwolanie-art115"] dt')).toHaveText(/^Odwołanie: ostatni dzień według art\.\s115\sKC$/);
  // Dziś 22.11.2026: pierwsza data (21.11) minęła, druga (23.11) jeszcze nie.
  await expect(page.locator('[data-w="status"]')).toHaveText(/^Pierwsza data minęła; ostatni dzień według art\.\s115\sKC: 23\slistopada\s2026\sr\.$/);
  await expect(page.locator('[data-w="status"]')).toHaveAttribute('data-status', 'pilne');
  // Błąd danych: nowe wiersze i zdania znikają.
  await page.getByLabel('Pracujesz u tego pracodawcy od').fill('2026-11-20');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  for (const s of ['[data-wiersz="odmowa-art115"]', '[data-wiersz="odwolanie-art115"]', '[data-w="odmowa-zdanie"]', '[data-w="odwolanie-zdanie"]', '[data-w="status"]']) await expect(page.locator(s)).toBeHidden();
  await expect(page.locator('#wynik-tytul')).toHaveText(/^Odmowę złóż najpóźniej$/);
  await page.getByLabel('Pracujesz u tego pracodawcy od').fill('2026-06-01');
  // Dzień roboczy: jedna data, wiersze i zdania o art. 115 KC ukryte.
  await page.getByLabel('Dzień doręczenia pisma').fill('2026-11-12');
  await expect(page.locator('#wynik-tytul')).toHaveText(/^Odmowę złóż najpóźniej$/);
  await expect(page.locator('[data-wiersz="odmowa-art115"]')).toBeHidden();
  await expect(page.locator('[data-wiersz="odwolanie-art115"]')).toBeHidden();
  await expect(page.locator('[data-w="odmowa-zdanie"]')).toBeHidden();
  await expect(page.locator('[data-w="odwolanie-zdanie"]')).toBeHidden();
  await expect(page.locator('[data-w="odwolanie-etykieta"]')).toHaveText(/^Odwołanie do\ssądu pracy do$/);
});

// Linijki praktyczne pod datami (pakiet „terminy3”): odmowa do niedzieli 6.12.2026 r., odwołanie do niedzieli 13.12.2026 r.
test('odmowa do niedzieli: złóż w piątek; odwołanie w niedzielę: placówka pocztowa', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-11-15T10:00:00+01:00'));
  await page.goto('/narzedzia/wypowiedzenie-zmieniajace');
  await page.getByLabel('Pracujesz u tego pracodawcy od').fill('2026-05-12');
  await page.getByLabel('Dzień doręczenia pisma').fill('2026-11-12');
  await expect(page.locator('[data-w="odmowa"]')).toHaveText(/^6\sgrudnia\s2026\sr\.$/);
  await expect(page.locator('[data-w="odmowa-praktycznie"]')).toContainText(/czyli\sw\spiątek\s4\sgrudnia\s2026\sr\.,/);
  await expect(page.locator('[data-w="odwolanie-praktycznie"]')).toBeHidden();
  await page.getByLabel('Pracujesz u tego pracodawcy od').fill('2020-01-15');
  await page.getByLabel('Dzień doręczenia pisma').fill('2026-11-22');
  await expect(page.locator('[data-w="odwolanie"]')).toHaveText(/^13\sgrudnia\s2026\sr\.$/);
  await expect(page.locator('[data-w="odwolanie-praktycznie"]')).toHaveText(/^To\sniedziela\.\sTego\sdnia\smożesz\sjeszcze\snadać\spismo\sw\splacówce\sPoczty\sPolskiej/);
});
