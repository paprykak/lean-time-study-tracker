import { expect, test } from '@playwright/test';
import { adresNarzedzia } from '../../src/data/narzedzia';

// § 105–110 ogólnych przepisów BHP: drabina 2,5 m → praca na wysokości, szelki i hełm (§ 110 ust. 1); pomost ze stałą
// balustradą → wyłączenie z § 105 ust. 2 pkt 2, ale nie przy wychylaniu się (wariant bezpieczny); 0,8 m → poniżej
// progu; młodociani powyżej 3 m → wzbronione.
test.beforeEach(async ({ page }) => {
  await page.goto(adresNarzedzia('praca-na-wysokosci'));
});

test('drabina 2,5 m: praca na wysokości, szelki, szkolenie co rok', async ({ page }) => {
  await expect(page.locator('[data-w="glowny"]')).toHaveText(/^To\spraca\sna\swysokości$/);
  await expect(page.locator('[data-w="wiersze"]')).toContainText(/Szelki\sz\slinką\si\shełm/);
  await expect(page.locator('[data-w="wiersze"]')).toContainText(/Nie\srzadziej\sniż\sraz\sw\sroku/);
  await expect(page.getByLabel('Co chroni przed upadkiem?')).toBeHidden();
});

test('pomost z balustradą: nie jest, chyba że trzeba się wychylać', async ({ page }) => {
  await page.getByLabel('Gdzie pracujesz?').selectOption('pomost');
  await page.getByLabel('Co chroni przed upadkiem?').selectOption('balustrada');
  await expect(page.locator('[data-w="glowny"]')).toHaveText(/^To\snie\sjest\spraca\sna\swysokości$/);
  await expect(page.locator('[data-w="podstawa"]')).toContainText(/§\s105\sust\.\s2\spkt\s2/);
  await page.getByLabel(/wychylania się/).check();
  await expect(page.locator('[data-w="glowny"]')).toHaveText(/^To\spraca\sna\swysokości$/);
});

test('0,8 m poniżej progu; młodociany na 3,5 m', async ({ page }) => {
  await page.getByLabel('Wysokość, na której stoisz (m)').fill('0,8');
  await expect(page.locator('[data-w="glowny"]')).toHaveText(/^To\snie\sjest\spraca\sna\swysokości$/);
  await page.getByLabel('Wysokość, na której stoisz (m)').fill('3,5');
  await page.getByLabel('Kto pracuje?').selectOption('mlodociany');
  await expect(page.locator('[data-w="wiersze"]')).toContainText(/Wzbronione\spowyżej\s3\sm/);
});

test('błędna wysokość', async ({ page }) => {
  await page.getByLabel('Wysokość, na której stoisz (m)').fill('wysoko');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.locator('[data-w="glowny"]')).toHaveText('—');
  await page.getByLabel('Wysokość, na której stoisz (m)').fill('2');
  await expect(page.locator('[data-blad="dane"]')).toBeHidden();
  await expect(page.getByLabel('Wysokość, na której stoisz (m)')).not.toHaveAttribute('aria-invalid', 'true');
});

test('rusztowanie: bez opcji ścian, dach bez szelek', async ({ page }) => {
  await page.getByLabel('Gdzie pracujesz?').selectOption('rusztowanie');
  await expect(page.getByLabel('Co chroni przed upadkiem?').locator('option[value="sciany"]')).toBeDisabled();
  await page.getByLabel('Gdzie pracujesz?').selectOption('dach');
  await page.getByLabel('Co chroni przed upadkiem?').selectOption('brak');
  await expect(page.locator('[data-w="wiersze"]')).toContainText(/Balustrada:\sporęcz\s1,1\sm/);
  await expect(page.locator('[data-w="wiersze"]')).not.toContainText('Szelki z linką');
});

test('zmiana miejsca bez dozwolonych ścian: osłona „brak”, nie zakładamy balustrady', async ({ page }) => {
  await page.getByLabel('Gdzie pracujesz?').selectOption('pomost');
  await page.getByLabel('Co chroni przed upadkiem?').selectOption('sciany');
  await page.getByLabel('Gdzie pracujesz?').selectOption('rusztowanie');
  await expect(page.getByLabel('Co chroni przed upadkiem?')).toHaveValue('brak');
});

test('słup, maszt, konstrukcja na 1,5 m: szelki i hełm (wariant bezpieczny § 110 ust. 1)', async ({ page }) => {
  await page.getByLabel('Gdzie pracujesz?').selectOption('konstrukcja');
  await page.getByLabel('Co chroni przed upadkiem?').selectOption('brak');
  await page.getByLabel(/Wysokość/).fill('1,5');
  await expect(page.locator('[data-w="wiersze"]')).toContainText('Szelki z linką i hełm');
});

test.describe('telefon 320 px', () => {
  test.use({ viewport: { width: 320, height: 640 } });
  test('żadna opcja list nie jest szersza niż pole', async ({ page }) => {
    // Lista osłon jest ukryta przy drabinie: na pomoście widać wszystkie listy.
    await page.getByLabel('Gdzie pracujesz?').selectOption('pomost');
    const uciete = await page.locator('select').evaluateAll(async (listy) => {
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
