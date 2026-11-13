import { expect, test } from '@playwright/test';
import { adresNarzedzia } from '../../src/data/narzedzia';

// Daty urodzenia tak dobrane, że wynik nie zależy od dnia testu (do maja 2028 r.): mężczyzna ur. 1966-05-20, 16 lat pracy
// z wykazu, staż 30 → spełnia (60 lat 20 maja 2026 r., najdłużej do 20 maja 2031 r.); kobieta ur. 1990-03-01 → wiek
// 55 lat 1 marca 2045 r.; ur. 1948-12-31 → rocznik; ur. 1968-01-01 i 5 lat pracy z wykazu → nie zdąży przed 65 latami;
// hutnictwo ur. 1969-05-20 (55 lat w 2024 r., 60 dopiero w 2029 r.) → art. 7.
test.beforeEach(async ({ page }) => {
  await page.goto(adresNarzedzia('emerytura-pomostowa'));
  await page.getByLabel('Data urodzenia').fill('1966-05-20');
});

test('mężczyzna, 16 lat pracy z wykazu, staż 30 lat: spełnia warunki', async ({ page }) => {
  await expect(page.locator('[data-w="stan"]')).toHaveText('Spełniasz warunki');
  await expect(page.locator('[data-w="praca"]')).toHaveText(/^tak:\s16\slat\sz\swymaganych\s15\slat$/);
  await expect(page.locator('[data-w="koniec"]')).toHaveText(/^20\smaja\s2031\sr\.$/);
  await expect(page.locator('[data-w="uwaga"]')).toContainText('103a');
});

test('kobieta przed 55. urodzinami: data, od której spełni warunki', async ({ page }) => {
  await page.getByLabel('Płeć').selectOption('k');
  await page.getByLabel('Data urodzenia').fill('1990-03-01');
  await page.getByLabel('Praca z wykazu (lata)').fill('15');
  await page.getByLabel('Staż w ZUS (lata)').fill('20');
  await expect(page.locator('[data-w="stan"]')).toHaveText(/^Od\s1\smarca\s2045\sr\.$/);
  await expect(page.locator('[data-w="wiek"]')).toHaveText(/^55\slat:\s1\smarca\s2045\sr\.$/);
});

test('hutnictwo, rocznik 1948 i brak czasu na uzbieranie okresów', async ({ page }) => {
  await page.getByLabel('Rodzaj prac').selectOption('hutnictwo');
  await expect(page.locator('[data-w="uwaga"]')).toContainText('ogólnych zasad z art. 4');
  await page.getByLabel('Data urodzenia').fill('1969-05-20');
  await page.getByLabel('Z tego w hutnictwie, pkt 4–12 (lata)').fill('16');
  await expect(page.locator('[data-w="uwaga"]')).toContainText('lekarza medycyny pracy');
  await page.getByLabel('Data urodzenia').fill('1948-12-31');
  await expect(page.locator('[data-w="stan"]')).toHaveText('Nie przysługuje');
  await page.getByLabel('Rodzaj prac').selectOption('ogolne');
  await page.getByLabel('Data urodzenia').fill('1968-01-01');
  await page.getByLabel('Praca z wykazu (lata)').fill('5');
  await expect(page.locator('[data-w="stan"]')).toHaveText(/^Nie\szdążysz$/);
});

test('rekompensata przy 15 latach przed 2009 r. i błędne dane', async ({ page }) => {
  await page.getByLabel('Data urodzenia').fill('1964-01-01');
  await page.getByLabel('Praca z wykazu (lata)').fill('15');
  await page.getByLabel('Z tego przed 2009 r.').fill('15');
  await page.getByLabel('Staż w ZUS (lata)').fill('20');
  await expect(page.locator('[data-w="uwaga"]')).toContainText('rekompensaty');
  await page.getByLabel('Z tego przed 2009 r.').fill('16');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.locator('[data-w="stan"]')).toHaveText('—');
  await page.getByLabel('Z tego przed 2009 r.').fill('piętnaście');
  await expect(page.locator('[data-blad="dane"]')).toContainText('w latach');
  await page.getByLabel('Z tego przed 2009 r.').fill('0');
  await page.getByLabel('Staż w ZUS (lata)').fill('10');
  await expect(page.locator('[data-blad="dane"]')).toContainText('Staż nie może być krótszy');
  await expect(page.getByLabel('Staż w ZUS (lata)')).toHaveAttribute('aria-invalid', 'true');
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
