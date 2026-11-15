import { expect, test } from '@playwright/test';
import { NARZEDZIE_KARA } from './strony';

// Kara porządkowa (art. 109, 112, 113 Kp): wartości jak w kara-porzadkowa.test.ts.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_KARA);
  await page.getByLabel('Dzień naruszenia').fill('2026-11-02');
  await page.getByLabel('Kiedy pracodawca się o nim dowiedział').fill('2026-11-04');
});

test('kara 12 listopada 2026 r.: w terminie, sprzeciw do 19 listopada', async ({ page }) => {
  await page.getByLabel('Dzień zawiadomienia o karze').fill('2026-11-12');
  await expect(page.locator('[data-w="sprzeciw"]')).toHaveText(/^19\slistopada\s2026\sr\.$/);
  await expect(page.locator('[data-w="status"]')).toHaveText('Kara nałożona w terminie');
  await expect(page.locator('[data-w="zatarcie"]')).toHaveText(/^12\slistopada\s2027\sr\.$/);
});

test('zawiadomienie 7 listopada 2026 r.: sprzeciw zdąż do soboty 14 listopada, według art. 115 KC 16 listopada', async ({ page }) => {
  await page.getByLabel('Dzień zawiadomienia o karze').fill('2026-11-07');
  await expect(page.locator('[data-w="etykieta"]')).toHaveText('Sprzeciw do pracodawcy: zdąż do');
  await expect(page.locator('[data-w="sprzeciw"]')).toHaveText(/^14\slistopada\s2026\sr\.$/);
  await expect(page.locator('[data-w="art115"]')).toHaveText(/^16\slistopada\s2026\sr\.$/);
  await expect(page.locator('[data-w="zdanie"]')).toContainText(/to\ssobota/);
  await page.getByLabel('Dzień zawiadomienia o karze').fill('2026-11-12');
  await expect(page.locator('[data-wiersz="art115"]')).toBeHidden();
});

test('kara 20 listopada 2026 r.: po terminie', async ({ page }) => {
  await page.getByLabel('Dzień zawiadomienia o karze').fill('2026-11-20');
  await expect(page.locator('[data-w="status"]')).toContainText('po terminie');
});

test('3 miesiące kończą się w niedzielę 28 lutego 2027 r.: kara 1 marca jest po terminie (bez art. 115 KC)', async ({ page }) => {
  await page.getByLabel('Dzień naruszenia').fill('2026-11-30');
  await page.getByLabel('Kiedy pracodawca się o nim dowiedział').fill('2027-02-20');
  await page.getByLabel('Dzień zawiadomienia o karze').fill('2027-03-01');
  await expect(page.locator('[data-w="3mies"]')).toHaveText(/^28\slutego\s2027\sr\.$/);
  await expect(page.locator('[data-w="status"]')).toHaveText(/po\sterminie.*chyba\sże\ssąd\suzna\sprzesunięcie\sz\sart\.\s115\sKC/);
  await page.getByLabel('Dzień zawiadomienia o karze').fill('2027-03-02');
  await expect(page.locator('[data-w="status"]')).toHaveText(/^Kara\snałożona\spo\sterminie\sz\sart\.\s109\s§\s1$/);
});

// Audyt jakości 4 (B-9): kara pieniężna to nie odszkodowanie za szkodę.
test('link do odpowiedzialności materialnej w wyjaśnieniu', async ({ page }) => {
  await expect(page.locator('main a[href="/narzedzia/odpowiedzialnosc-materialna"]').first()).toBeAttached();
  await expect(page.locator('main')).toContainText(/pokaże\skalkulator\sodpowiedzialności\smaterialnej/);
});

// Linijka praktyczna pod datą sprzeciwu (pakiet „terminy3”): 13.12.2026 r. to niedziela, 3.05.2027 r. święto.
test('sprzeciw do niedzieli 13 grudnia 2026 r.: złóż w piątek 11 grudnia', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-11-15T10:00:00+01:00'));
  await page.goto(NARZEDZIE_KARA);
  await page.getByLabel('Dzień naruszenia').fill('2026-12-01');
  await page.getByLabel('Kiedy pracodawca się o nim dowiedział').fill('2026-12-02');
  await page.getByLabel('Dzień zawiadomienia o karze').fill('2026-12-06');
  await expect(page.locator('[data-w="sprzeciw"]')).toHaveText(/^13\sgrudnia\s2026\sr\.$/);
  await expect(page.locator('[data-w="praktycznie"]')).toHaveText(/^To\sniedziela\.\sJeśli\szakład\snie\sprzyjmuje\spism\stego\sdnia,\sbezpieczniej\szłóż\spismo\sdo\spracodawcy\snajpóźniej\sw\sostatnim\sdniu\sroboczym\sprzed\stą\sdatą,\sczyli\sw\spiątek\s11\sgrudnia\s2026\sr\.:/);
  await page.getByLabel('Dzień naruszenia').fill('2027-04-20');
  await page.getByLabel('Kiedy pracodawca się o nim dowiedział').fill('2027-04-21');
  await page.getByLabel('Dzień zawiadomienia o karze').fill('2027-04-26');
  await expect(page.locator('[data-w="praktycznie"]')).toContainText(/Święto\sNarodowe\sTrzeciego\sMaja\)\.\sJeśli\szakład.*w\spiątek\s30\skwietnia\s2027\sr\./);
  await page.getByLabel('Dzień zawiadomienia o karze').fill('2027-04-27');
  await expect(page.locator('[data-w="praktycznie"]')).toBeHidden();
});

test('sprzeciw już po terminie (dziś 14 grudnia 2026 r.): bez linijki', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-12-14T10:00:00+01:00'));
  await page.goto(NARZEDZIE_KARA);
  await page.getByLabel('Dzień naruszenia').fill('2026-12-01');
  await page.getByLabel('Kiedy pracodawca się o nim dowiedział').fill('2026-12-02');
  await page.getByLabel('Dzień zawiadomienia o karze').fill('2026-12-06');
  await expect(page.locator('[data-w="sprzeciw"]')).toHaveText(/^13\sgrudnia\s2026\sr\.$/);
  await expect(page.locator('[data-w="praktycznie"]')).toBeHidden();
});
