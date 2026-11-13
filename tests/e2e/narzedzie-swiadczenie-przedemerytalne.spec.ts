import { expect, test } from '@playwright/test';
import { adresNarzedzia } from '../../src/data/narzedzia';

// Stałe daty: ur. 1965-06-15, likwidacja 2026-06-15, 25 lat stażu → pkt 1 (61 lat), do 15 czerwca 2030 r.; dzień
// wcześniej → brak; zwolnienie z przyczyn firmy i 40 lat → pkt 5; likwidacja 2026-03-31, 39,2 roku → zależy (pkt 6).
test.beforeEach(async ({ page }) => {
  await page.goto(adresNarzedzia('swiadczenie-przedemerytalne'));
  await page.getByLabel('Data urodzenia').fill('1965-06-15');
  await page.getByLabel('Dzień rozwiązania umowy').fill('2026-06-15');
});

test('likwidacja, 61 lat i 25 lat stażu: spełnia (pkt 1)', async ({ page }) => {
  await expect(page.locator('[data-w="stan"]')).toHaveText(/^Spełniasz\swarunki$/);
  await expect(page.locator('[data-w="podstawa"]')).toHaveText(/^art\.\s2\sust\.\s1\spkt\s1$/);
  await expect(page.locator('[data-w="koniec"]')).toHaveText(/^15\sczerwca\s2030\sr\.$/);
  await page.getByLabel('Dzień rozwiązania umowy').fill('2026-06-14');
  await expect(page.locator('[data-w="stan"]')).toHaveText(/^Warunki\sniespełnione$/);
});

test('zwolnienie z przyczyn firmy z 40 latami stażu i pkt 6 przy likwidacji', async ({ page }) => {
  await page.getByLabel('Jak skończyła się praca').selectOption('zaklad');
  await page.getByLabel('Data urodzenia').fill('1980-01-01');
  await page.getByLabel('Staż do emerytury (lata)').fill('40');
  await expect(page.locator('[data-w="podstawa"]')).toHaveText(/pkt\s5$/);
  await page.getByLabel('Jak skończyła się praca').selectOption('likwidacja');
  await page.getByLabel('Dzień rozwiązania umowy').fill('2026-03-31');
  await page.getByLabel('Staż do emerytury (lata)').fill('39,2');
  await expect(page.locator('[data-w="stan"]')).toHaveText(/^Zależy\sod\sstażu\sna\s31\sgrudnia$/);
});

test('koniec renty: etykieta daty i opis warunku się zmieniają; błędne dane', async ({ page }) => {
  await page.getByLabel('Jak skończyła się praca').selectOption('renta');
  await expect(page.getByLabel('Dzień końca renty')).toBeVisible();
  await expect(page.locator('[data-opis-okresu]')).toContainText('5 lat');
  await page.getByLabel('Staż do emerytury (lata)').fill('dużo');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.locator('[data-w="stan"]')).toHaveText('—');
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
