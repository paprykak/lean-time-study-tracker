import { expect, test } from '@playwright/test';
import { NARZEDZIE_ODWOLANIE } from './strony';

// Terminy z art. 264 i 97 § 2¹ Kp liczone według art. 111 § 2 i 115 KC (wartości jak w termin-odwolania.test.ts).
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_ODWOLANIE);
});

test('wypowiedzenie doręczone 12 listopada 2026 r.: do 3 grudnia', async ({ page }) => {
  await page.getByLabel('Sprawa', { exact: true }).selectOption('wypowiedzenie');
  await page.locator('#o-data').fill('2026-11-12');
  await expect(page.locator('[data-w="koniec"]')).toHaveText(/^3\sgrudnia\s2026\sr\.$/);
  await expect(page.locator('[data-w="etykieta"]')).toHaveText('Ostatni dzień');
  await expect(page.locator('[data-wiersz="art115"]')).toBeHidden();
});

test('dyscyplinarka 3 grudnia 2026 r.: zdąż do Wigilii, według art. 115 KC 28 grudnia', async ({ page }) => {
  await page.getByLabel('Sprawa', { exact: true }).selectOption('bez-wypowiedzenia');
  await page.locator('#o-data').fill('2026-12-03');
  await expect(page.locator('[data-w="etykieta"]')).toHaveText('Zdąż do');
  await expect(page.locator('[data-w="koniec"]')).toHaveText(/^24\sgrudnia\s2026\sr\.$/);
  await expect(page.locator('[data-wiersz="art115"]')).toBeVisible();
  await expect(page.locator('[data-wiersz="art115"] dt')).toHaveText('Ostatni dzień według art. 115 KC');
  await expect(page.locator('[data-w="art115"]')).toHaveText(/^28\sgrudnia\s2026\sr\.$/);
  await expect(page.locator('[data-w="zdanie"]')).toContainText(/Wigilia\sBożego\sNarodzenia/);
  await page.locator('#o-data').fill('2026-12-08');
  await expect(page.locator('[data-wiersz="art115"]')).toBeHidden();
  await expect(page.locator('[data-w="etykieta"]')).toHaveText('Ostatni dzień');
});

test('między datami: pierwsza minęła, według art. 115 KC termin jeszcze trwa', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-12-27T10:00:00+01:00'));
  await page.goto(NARZEDZIE_ODWOLANIE);
  await page.getByLabel('Sprawa', { exact: true }).selectOption('bez-wypowiedzenia');
  await page.locator('#o-data').fill('2026-12-03');
  await expect(page.locator('[data-w="status"]')).toHaveText(/^Pierwsza\sdata\sminęła;\sostatni\sdzień\swedług\sart\.\s115\sKC:\s28\sgrudnia\s2026\sr\.$/);
  await expect(page.locator('[data-w="status"]')).toHaveAttribute('data-status', 'pilne');
});

test('sprostowanie świadectwa: 14 dni u pracodawcy', async ({ page }) => {
  await page.getByLabel('Sprawa', { exact: true }).selectOption('sprostowanie-wniosek');
  await expect(page.locator('label[for="o-data"]')).toHaveText('Dzień otrzymania świadectwa pracy');
  await page.locator('#o-data').fill('2026-11-12');
  await expect(page.locator('[data-w="koniec"]')).toHaveText(/^26\slistopada\s2026\sr\.$/);
  await expect(page.locator('[data-w="gdzie"]')).toHaveText('pracodawca');
});

test('sprzeciw od kary po terminie: bez obietnicy przywrócenia terminu z art. 265', async ({ page }) => {
  await page.getByLabel('Sprawa', { exact: true }).selectOption('kara-sprzeciw');
  await page.locator('#o-data').fill('2026-10-01');
  await expect(page.locator('[data-w="status"]')).toHaveText(/nie\sprzewiduje\sprzywrócenia/);
  await page.getByLabel('Sprawa', { exact: true }).selectOption('wypowiedzenie');
  await expect(page.locator('[data-w="status"]')).toContainText(/art\.\s265/);
});

test('krótkie opcje listy spraw (telefon), pełna nazwa pod polem', async ({ page }) => {
  for (const tekst of await page.getByLabel('Sprawa', { exact: true }).locator('option').allTextContents()) expect(tekst.length).toBeLessThanOrEqual(28);
  await page.getByLabel('Sprawa', { exact: true }).selectOption('bez-wypowiedzenia');
  await expect(page.locator('[data-w="sprawa-opis"]')).toHaveText(/Zwolnienie\sbez\swypowiedzenia\salbo\swygaśnięcie\sumowy/);
});

test('strona sprzed Nowego Roku otwarta 5 stycznia 2027 r.: dzień doręczenia to dziś', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-01-05T10:00:00+01:00'));
  await page.goto(NARZEDZIE_ODWOLANIE);
  await expect(page.locator('#o-data')).toHaveValue('2027-01-05');
  await expect(page.locator('[data-w="status"]')).toHaveText(/Zostało\s21\sdni/);
});

// Linijka praktyczna pod „Zdąż do” w dzień wolny (pakiet „terminy3”; daty z raporty/terminy3/linijka.py).
test('pozew do sądu w Wigilię: linijka o placówce pocztowej pod datą', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-12-20T10:00:00+01:00'));
  await page.goto(NARZEDZIE_ODWOLANIE);
  await page.getByLabel('Sprawa', { exact: true }).selectOption('bez-wypowiedzenia');
  await page.locator('#o-data').fill('2026-12-03');
  await expect(page.locator('[data-w="praktycznie"]')).toHaveText(/^To\sdzień\swolny\sod\spracy\s\(Wigilia\sBożego\sNarodzenia\)\.\sTego\sdnia\smożesz\sjeszcze\snadać\spismo\sw\splacówce\spocztowej\soperatora\swyznaczonego/);
  await page.locator('#o-data').fill('2026-12-08');
  await expect(page.locator('[data-w="praktycznie"]')).toBeHidden();
  await page.locator('#o-data').fill('');
  await expect(page.locator('[data-w="praktycznie"]')).toBeHidden();
});

test('sprostowanie do pracodawcy w sobotę 2 stycznia 2027 r.: złóż w czwartek 31 grudnia', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-12-20T10:00:00+01:00'));
  await page.goto(NARZEDZIE_ODWOLANIE);
  await page.getByLabel('Sprawa', { exact: true }).selectOption('sprostowanie-wniosek');
  await page.locator('#o-data').fill('2026-12-19');
  await expect(page.locator('[data-w="koniec"]')).toHaveText(/^2\sstycznia\s2027\sr\.$/);
  await expect(page.locator('[data-w="praktycznie"]')).toHaveText(/^To\ssobota\.\sPismo\sdo\spracodawcy\szłóż\snajpóźniej\sw\sostatnim\sdniu\sroboczym\sprzed\stą\sdatą,\sczyli\sw\sczwartek\s31\sgrudnia\s2026\sr\.:\sliczy\ssię\sdzień,\sw\sktórym\sdo\sniego\sdotrze\s\(art\.\s61\s§\s1\sKodeksu\scywilnego\)\.$/);
});
