import { expect, test } from '@playwright/test';
import { NARZEDZIE_OKOLICZNOSCIOWY } from './strony';

// Zwolnienia od pracy: § 15 rozporządzenia z 1996 r. i art. 9 ustawy o publicznej służbie krwi.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_OKOLICZNOSCIOWY);
});

test('ślub: 2 dni płatne', async ({ page }) => {
  await page.getByLabel('Co się wydarzyło').selectOption('slub');
  await expect(page.locator('[data-w="wymiar"]')).toHaveText('2 dni');
  await expect(page.locator('[data-w="platnosc"]')).toContainText('zachowujesz wynagrodzenie');
});

test('pogrzeb babci: 1 dzień; oddanie krwi: dzień oddania i następny', async ({ page }) => {
  await page.getByLabel('Co się wydarzyło').selectOption('pogrzeb-dalszy');
  await expect(page.locator('[data-w="wymiar"]')).toHaveText('1 dzień');
  await page.getByLabel('Co się wydarzyło').selectOption('krew');
  await expect(page.locator('[data-w="wymiar"]')).toHaveText('dzień oddania krwi i dzień następny');
});

test('wezwanie do sądu: rekompensata', async ({ page }) => {
  await page.getByLabel('Co się wydarzyło').selectOption('wezwanie');
  await expect(page.locator('[data-w="platnosc"]')).toContainText('rekompensatę');
});

test('strażak OSP: czas akcji bez limitu dni, ekwiwalent z gminy (art. 12 i 15 ustawy o OSP)', async ({ page }) => {
  await page.getByLabel('Co się wydarzyło').selectOption('osp');
  await expect(page.locator('[data-w="wymiar"]')).toHaveText(/^czas akcji, szkolenia lub ćwiczeń i\sodpoczynek po nich/);
  await expect(page.locator('[data-w="platnosc"]')).toContainText(/ekwiwalent pieniężny z\sbudżetu gminy/);
  await expect(page.locator('[data-w="podstawa"]')).toHaveText(/^art\.\s12 i\s15 ustawy o\sochotniczych strażach pożarnych$/);
  await expect(page.locator('#z-sytuacja-opis')).toHaveText('Akcja, szkolenie lub ćwiczenia OSP');
});

test.describe('telefon 320 px', () => {
  test.use({ viewport: { width: 320, height: 640 } });
  test('żadna opcja listy nie jest szersza niż pole', async ({ page }) => {
    const uciete = await page.locator('#z-sytuacja').evaluate(async (el) => {
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
