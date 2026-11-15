import { expect, test } from '@playwright/test';
import { adresNarzedzia } from '../../src/data/narzedzia';

// Dziś 15.11.2026 (zegar przeglądarki), więc domyślnie zwolnienie 10–23.11.2026 i czynność 14.11.2026. Oczekiwane daty
// z niezależnego rachunku w Pythonie (jak w testach jednostkowych): protokół 14.11 → zastrzeżenia do 21.11 (6 dni),
// decyzja 13.11 → odwołanie do 13.12.2026 (niedziela), według art. 115 KC 14.12.2026 (28 dni).
test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-11-15T10:00:00+01:00'));
  await page.goto(adresNarzedzia('co-wolno-na-l4'));
});

test('praca na polecenie pracodawcy: nie wolno, utrata za cały okres zwolnienia', async ({ page }) => {
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Nie wolno, także na polecenie');
  await expect(page.locator('[data-w="przepis"]')).toHaveAttribute('data-status', 'po-terminie');
  await expect(page.locator('[data-w="skutek"]')).toContainText(/od\s10\slistopada\s2026\sr\.\sdo\s23\slistopada\s2026\sr\.\s\(14\sdni\)/);
  await expect(page.locator('[data-w="brzmienie"]')).toHaveText(/^Przepisy\sod\s13\skwietnia\s2026\sr\.$/);
  await expect(page.locator('[data-w="cytaty"]')).toContainText(/Istotną\sokolicznością\snie\smoże\sbyć\spolecenie\spracodawcy/);
});

test('dawne brzmienie dla czynności przed 13 kwietnia 2026 r.', async ({ page }) => {
  await page.getByLabel('Zwolnienie od').fill('2026-04-01');
  await page.getByLabel('Zwolnienie do').fill('2026-04-20');
  await page.getByLabel('Dzień czynności').fill('2026-04-12');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Ryzyko utraty zasiłku');
  await expect(page.locator('[data-w="brzmienie"]')).toHaveText(/^Przepis\sw\sbrzmieniu\sdo\s12\skwietnia\s2026\sr\.$/);
  await expect(page.locator('[data-w="uwagi"]')).toContainText(/art\.\s39\sustawy\sz\s18\sgrudnia\s2025\sr\./);
  await expect(page.locator('[data-w="skutek"]')).toContainText(/\(20\sdni\)/);
  await page.getByLabel('Dzień czynności').fill('2026-04-13');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Nie wolno, także na polecenie');
  await expect(page.locator('[data-w="uwagi"]')).not.toContainText('art. 39');
});

test('czynności: opis pod polem, zakupy z warunkiem, uwaga przy wskazaniu „leżeć”, lekarz wolno', async ({ page }) => {
  await page.getByLabel('Co robisz').selectOption('zakupy');
  await expect(page.locator('[data-w="czynnosc-opis"]')).toHaveText(/^Zakupy\sspożywcze/);
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Wolno, jeśli nie szkodzi leczeniu');
  await expect(page.locator('[data-w="warunki"]')).not.toContainText('chory powinien leżeć');
  await page.getByLabel('Wskazanie lekarza').selectOption('lezec');
  await expect(page.locator('[data-w="warunki"]')).toContainText(/chory\spowinien\sleżeć/);
  await expect(page.locator('[data-w="skutek"]')).toContainText(/^Jeśli\sZUS\salbo\spracodawca/);
  await page.getByLabel('Co robisz').selectOption('lekarz');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Wolno');
  await expect(page.locator('[data-w="przepis"]')).toHaveAttribute('data-status', 'w-terminie');
  await page.getByLabel('Co robisz').selectOption('inna-praca');
  await page.getByLabel('Zwolnienie od').fill('2027-01-04');
  await page.getByLabel('Zwolnienie do').fill('2027-01-15');
  await page.getByLabel('Dzień czynności').fill('2027-01-05');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Tylko bez zwolnienia z tej pracy');
  await expect(page.locator('[data-w="cytaty"]')).toContainText(/art\.\s17\sust\.\s1e,\sod\s1\sstycznia\s2027\sr\./);
});

test('kontrola pracodawcy, zastrzeżenia i odwołanie z dwiema datami', async ({ page }) => {
  await page.getByLabel('Kto kontroluje').selectOption('pracodawca');
  await expect(page.locator('[data-w="kontrola"]')).toContainText(/legitymację\spracowniczą/);
  await expect(page.locator('[data-w="zastrzezenia-status"]')).toBeHidden();
  await page.getByLabel('Dzień czynności').fill('2026-11-12');
  await page.getByLabel('Otrzymanie protokołu').fill('2026-11-14');
  // Audyt jakosc4 (A-2): koniec 7 dni w sobotę, więc dwie daty jak przy odwołaniu.
  await expect(page.locator('[data-w="zastrzezenia"]')).toContainText(/^Zdąż\sdo\s21\slistopada\s2026\sr\.:\s7\sdni/);
  await expect(page.locator('[data-w="zastrzezenia"]')).toContainText(/ostatni\sdzień\sto\s23\slistopada\s2026\sr\./);
  await expect(page.locator('[data-w="zastrzezenia-status"]')).toHaveText(/^Zostało\s6\sdni$/);
  await expect(page.locator('[data-w="zastrzezenia-status"]')).toHaveAttribute('data-status', 'wkrotce');
  // Dzień po sobocie, w której minęła pierwsza data: nie „Termin minął”.
  await page.getByLabel('Zwolnienie od').fill('2026-11-03');
  await page.getByLabel('Dzień czynności').fill('2026-11-05');
  await page.getByLabel('Otrzymanie protokołu').fill('2026-11-07');
  await expect(page.locator('[data-w="zastrzezenia-status"]')).toHaveText(/^Pierwsza\sdata\sminęła;\sostatni\sdzień\swedług\sart\.\s115\sKC:\s16\slistopada\s2026\sr\.$/);
  await page.getByLabel('Dzień czynności').fill('2026-11-12');
  await page.getByLabel('Otrzymanie protokołu').fill('2026-11-14');
  await page.getByLabel('Doręczenie decyzji ZUS').fill('2026-11-13');
  await expect(page.locator('[data-w="odwolanie"]')).toContainText(/^Zdąż\sdo\s13\sgrudnia\s2026\sr\.:\smiesiąc\sod\sdoręczenia\sdecyzji\.\s13\sgrudnia\s2026\sr\.\sto\sniedziela/);
  await expect(page.locator('[data-w="odwolanie"]')).toContainText(/ostatni\sdzień\sto\s14\sgrudnia\s2026\sr\./);
  await expect(page.locator('[data-w="odwolanie-status"]')).toHaveText(/^Zostało\s28\sdni$/);
});

test('błędne dane', async ({ page }) => {
  await page.getByLabel('Dzień czynności').fill('2026-11-25');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.locator('[data-blad="dane"]')).toContainText(/w\sczasie\szwolnienia/);
  await expect(page.getByLabel('Dzień czynności')).toHaveAttribute('aria-invalid', 'true');
  // Werdykt nie zależy od dat: zostaje, a skutek i terminy znikają.
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Nie wolno, także na polecenie');
  await expect(page.locator('[data-w="skutek"]')).toHaveText('—');
  await page.getByLabel('Dzień czynności').fill('2026-11-14');
  await expect(page.locator('[data-blad="dane"]')).toBeHidden();
  await expect(page.getByLabel('Dzień czynności')).not.toHaveAttribute('aria-invalid', 'true');
  await page.getByLabel('Doręczenie decyzji ZUS').fill('2026-11-20');
  await expect(page.locator('[data-blad="dane"]')).toContainText(/późniejszy\sniż\sdziś/);
  await expect(page.getByLabel('Doręczenie decyzji ZUS')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('[data-w="odwolanie-status"]')).toBeHidden();
  await page.getByLabel('Doręczenie decyzji ZUS').fill('');
  await expect(page.locator('[data-blad="dane"]')).toBeHidden();
  await page.getByLabel('Zwolnienie do').fill('2026-11-09');
  await expect(page.locator('[data-blad="dane"]')).toContainText(/nie\smoże\sbyć\swcześniejszy\sniż\spierwszy/);
  await expect(page.getByLabel('Zwolnienie do')).toHaveAttribute('aria-invalid', 'true');
});

// Linijka praktyczna (pakiet „terminy3”): zastrzeżenia do soboty 21.11.2026 r. (piątek 20.11), odwołanie do niedzieli 13.12.
test('zastrzeżenia w sobotę i odwołanie w niedzielę: linijki praktyczne pod tekstem', async ({ page }) => {
  await page.getByLabel('Kto kontroluje').selectOption('pracodawca');
  await page.getByLabel('Dzień czynności').fill('2026-11-12');
  await page.getByLabel('Otrzymanie protokołu').fill('2026-11-14');
  await expect(page.locator('[data-w="zastrzezenia-praktycznie"]')).toHaveText(/^To\ssobota\.\sJeśli\stego\sdnia\snie\sda\ssię\sich\szłożyć\sosobiście,\sbezpieczniej\szłóż\szastrzeżenia\snajpóźniej\sw\sostatnim\sdniu\sroboczym\sprzed\stą\sdatą,\sczyli\sw\spiątek\s20\slistopada\s2026\sr\.:\sustawa\snie\smówi,\sczy\swystarczy\snadanie\sna\spoczcie/);
  await page.getByLabel('Doręczenie decyzji ZUS').fill('2026-11-13');
  await expect(page.locator('[data-w="odwolanie-praktycznie"]')).toHaveText(/^To\sniedziela\.\sTego\sdnia\smożesz\sjeszcze\snadać\sodwołanie\sw\splacówce\sPoczty\sPolskiej\s\(operatora\swyznaczonego\),\sjeśli\sjest\sczynna,\szaadresowane\sdo\soddziału\sZUS/);
  await page.getByLabel('Doręczenie decyzji ZUS').fill('2026-11-16');
  await expect(page.locator('[data-w="odwolanie-praktycznie"]')).toBeEmpty();
});
