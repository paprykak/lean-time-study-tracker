import { expect, test } from '@playwright/test';
import { adresNarzedzia } from '../../src/data/narzedzia';

// Stałe daty: ur. 1985-04-10, niezdolność 2026-11-13 (41 lat) → 5 lat, w tym 5 w ostatnich 10 latach; 6 lat składkowych
// i 1 nieskładkowy → spełnione; 4 lata w ostatnich 10 → brakuje 1 roku. Ur. 2004-01-15, niezdolność 2026-01-16 i 2,5 roku
// → „zależy” (3 lata dokładnie, 2 w pełnych latach). Wypadek przy pracy → staż niewymagany.
test.beforeEach(async ({ page }) => {
  await page.goto(adresNarzedzia('renta-z-tytulu-niezdolnosci-do-pracy'));
  await page.getByLabel('Data urodzenia').fill('1985-04-10');
  await page.getByLabel('Niezdolność powstała dnia').fill('2026-11-13');
});

test('41 lat, 7 lat stażu, 6 w ostatnich 10 latach: warunki spełnione', async ({ page }) => {
  await expect(page.locator('[data-w="stan"]')).toHaveText(/^Warunki\sstażu\sspełnione$/);
  await expect(page.locator('[data-w="wiek"]')).toHaveText(/^41\slat$/);
  await expect(page.locator('[data-w="wymagany"]')).toHaveText(/^5\slat,\sw\stym\s5\slat\sw\sostatnich\s10\slatach$/);
  await page.getByLabel('Z tego w ostatnich 10 latach').fill('4');
  await expect(page.locator('[data-w="stan"]')).toHaveText(/^Warunki\sniespełnione$/);
  await expect(page.locator('[data-w="opis"]')).toHaveText(/brakuje\s1\sroku/);
});

test('rok po 22. urodzinach: zależy od liczenia wieku', async ({ page }) => {
  await page.getByLabel('Płeć').selectOption('k');
  await page.getByLabel('Data urodzenia').fill('2004-01-15');
  await page.getByLabel('Niezdolność powstała dnia').fill('2026-01-16');
  await page.getByLabel('Okresy składkowe (lata)').fill('2,5');
  await page.getByLabel('Nieskładkowe (lata)').fill('0');
  await page.getByLabel('Z tego w ostatnich 10 latach').fill('2,5');
  await expect(page.locator('[data-w="stan"]')).toHaveText(/^Zależy\sod\sliczenia\swieku$/);
});

test('wypadek przy pracy bez stażu; 18 miesięcy po końcu pracy przy częściowej niezdolności', async ({ page }) => {
  await page.getByLabel('Okresy składkowe (lata)').fill('0,2');
  await page.getByLabel('Nieskładkowe (lata)').fill('0');
  await page.getByLabel('Z tego w ostatnich 10 latach').fill('0,2');
  await page.getByLabel('Przyczyna').selectOption('praca');
  await expect(page.locator('[data-w="stan"]')).toHaveText(/^Staż\snie\sjest\swymagany$/);
  await page.getByLabel('Przyczyna').selectOption('choroba');
  await page.getByLabel('Okresy składkowe (lata)').fill('26');
  await page.getByLabel('Z tego w ostatnich 10 latach').fill('10');
  await page.getByLabel('Względem ubezpieczenia').selectOption('pozniej');
  await expect(page.locator('[data-w="okres"]')).toHaveText('nie');
  await page.getByLabel('Niezdolność', { exact: true }).selectOption('calkowita');
  await expect(page.locator('[data-w="okres"]')).toContainText('art. 57 ust. 2');
  await expect(page.locator('[data-w="stan"]')).toHaveText(/^Warunki\sstażu\sspełnione$/);
});

test('błędne dane', async ({ page }) => {
  await page.getByLabel('Z tego w ostatnich 10 latach').fill('12');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.locator('[data-w="stan"]')).toHaveText('—');
  await page.getByLabel('Z tego w ostatnich 10 latach').fill('5');
  await page.getByLabel('Niezdolność powstała dnia').fill('1980-01-01');
  await expect(page.locator('[data-blad="dane"]')).toContainText('po dacie urodzenia');
});

test.describe('telefon 320 px', () => {
  test.use({ viewport: { width: 320, height: 640 } });
  test('żadna opcja list wyboru nie jest szersza niż pole; brak przewijania w bok', async ({ page }) => {
    const uciete = await page.locator('form select').evaluateAll(async (listy) => {
      const wynik: string[] = [];
      for (const el of listy) {
        const s = el as HTMLSelectElement;
        const styl = getComputedStyle(s);
        const ctx = document.createElement('canvas').getContext('2d')!;
        ctx.font = `${styl.fontWeight} ${styl.fontSize} ${styl.fontFamily}`;
        // Mierzymy fontem strony, nie zastępczym: bez tego wynik zależy od fontów systemu (w CI szersze).
        await document.fonts.load(ctx.font, [...s.options].map((o) => o.text).join(''));
        const miejsce = s.clientWidth - 40;
        wynik.push(...[...s.options].filter((o) => ctx.measureText(o.text).width > miejsce).map((o) => o.text));
      }
      return wynik;
    });
    expect(uciete).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});
