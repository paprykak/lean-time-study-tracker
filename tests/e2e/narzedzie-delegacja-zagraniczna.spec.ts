import { expect, test } from '@playwright/test';
import { NARZEDZIE_ZAGRANICZNA } from './strony';

// Delegacja zagraniczna (§ 13–17 rozporządzenia, Dz.U. 2023 poz. 2190): Niemcy 49 EUR, nocleg 170 EUR;
// 9 listopada 6:00 – 11 listopada 10:00 to 2 doby i 4 godziny, czyli 2 i 1/3 diety = 114,33 EUR.
const podroz = async (page: import('@playwright/test').Page, powrot = '2026-11-11', godzina = '10:00') => {
  await page.getByLabel('Państwo docelowe').selectOption('Niemcy');
  await page.getByLabel('Wyjazd za granicę: dzień').fill('2026-11-09');
  await page.getByLabel('Godzina wyjazdu').fill('06:00');
  await page.getByLabel('Powrót do Polski: dzień').fill(powrot);
  await page.getByLabel('Godzina powrotu').fill(godzina);
};

test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_ZAGRANICZNA);
});

test('Niemcy, 2 doby i 4 godziny: 114,33 EUR', async ({ page }) => {
  await podroz(page);
  await expect(page.locator('[data-w="razem"]')).toHaveText(/^114,33\sEUR$/);
  await expect(page.locator('[data-w="dieta"]')).toHaveText(/^114,33\sEUR\s\(2 i 1\/3 diety po 49,00\sEUR\)$/);
});

test('całodzienne wyżywienie w pierwszej dobie: zostaje 25% diety', async ({ page }) => {
  await podroz(page);
  const doba1 = page.getByRole('group', { name: /^Doba 1:/ });
  for (const p of ['Śniadanie', 'Obiad', 'Kolacja']) await doba1.getByLabel(p).check();
  await expect(page.locator('[data-w="potracenie"]')).toHaveText(/^36,75\sEUR$/);
  await expect(page.locator('[data-w="razem"]')).toHaveText(/^77,58\sEUR$/);
});

test('noclegi, dojazd i komunikacja: 263,03 EUR; trzeci nocleg się nie mieści', async ({ page }) => {
  await podroz(page);
  await page.getByLabel('Noclegi bez rachunku').fill('2');
  await page.getByLabel(/dworzec albo lotnisko/).selectOption('oba');
  await page.getByLabel(/komunikację miejscową/).check();
  await expect(page.locator('[data-w="razem"]')).toHaveText(/^263,03\sEUR$/);
  await page.getByLabel('Noclegi bez rachunku').fill('3');
  await expect(page.locator('#z-blad-noclegi')).toContainText('najwyżej 2 noce');
});

test('inne państwo i przeliczenie kursem', async ({ page }) => {
  await podroz(page);
  await page.getByLabel(/Kurs EUR/).fill('4,25');
  await expect(page.locator('[data-w="pln"]')).toHaveText(/^485,90\szł$/);
  await page.getByLabel('Państwo docelowe').selectOption('Wielka Brytania');
  await expect(page.locator('[data-w="limit"]')).toHaveText(/^zwrot do 220,00\sGBP za dobę$/);
  await expect(page.getByLabel(/Kurs GBP/)).toBeVisible();
});

test('5 godzin za granicą: 1/3 diety', async ({ page }) => {
  await podroz(page, '2026-11-09', '11:00');
  await expect(page.locator('[data-w="dieta"]')).toContainText('1/3 diety');
  await expect(page.locator('[data-w="razem"]')).toHaveText(/^16,33\sEUR$/);
});

test('krótka nazwa USA w liście, pełna w tabeli; opis czasu bez linku do innego narzędzia', async ({ page }) => {
  await page.getByLabel('Państwo docelowe').selectOption('Stany Zjednoczone Ameryki: Nowy Jork');
  await expect(page.getByLabel('Państwo docelowe').locator('option:checked')).toHaveText('USA: Nowy Jork');
  await expect(page.locator('#z-czas-opis a')).toHaveCount(0);
});

test('strona czytana w styczniu 2027 r.: wyjazd dziś, powrót za 2 dni', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-01-05T10:00:00+01:00'));
  await page.goto(NARZEDZIE_ZAGRANICZNA);
  await expect(page.getByLabel('Wyjazd za granicę: dzień')).toHaveValue('2027-01-05');
  await expect(page.getByLabel('Powrót do Polski: dzień')).toHaveValue('2027-01-07');
});

test.describe('telefon 320 px', () => {
  test.use({ viewport: { width: 320, height: 640 } });
  test('żadna opcja listy państw nie jest szersza niż pole', async ({ page }) => {
    const uciete = await page.locator('#z-panstwo').evaluate(async (el) => {
      const s = el as HTMLSelectElement;
      const styl = getComputedStyle(s);
      const ctx = document.createElement('canvas').getContext('2d')!;
      ctx.font = `${styl.fontWeight} ${styl.fontSize} ${styl.fontFamily}`;
      // Mierzymy fontem strony, nie zastępczym: bez tego wynik zależy od fontów systemu (w CI szersze).
      await document.fonts.load(ctx.font, [...s.options].map((o) => o.text).join(''));
      const miejsce = s.clientWidth - 40;
      return [...s.options].filter((o) => ctx.measureText(o.text).width > miejsce).map((o) => o.text);
    });
    expect(uciete).toEqual([]);
  });
});
