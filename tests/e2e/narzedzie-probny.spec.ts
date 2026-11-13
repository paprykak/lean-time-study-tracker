import { expect, test } from '@playwright/test';
import { NARZEDZIE_PROBNY } from './strony';

// Okres próbny (art. 25 § 2–2³, art. 34 Kp): wartości jak w okres-probny.test.ts.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_PROBNY);
  await page.getByLabel('Od', { exact: true }).fill('2027-03-01');
});

test('3 miesiące przed umową na czas nieokreślony: do 31 maja, wypowiedzenie 2 tygodnie', async ({ page }) => {
  await page.getByLabel(/Jaka umowa ma być/).selectOption('nieokreslony');
  await page.getByLabel('Okres próbny', { exact: true }).selectOption('3m');
  await expect(page.locator('[data-w="koniec"]')).toHaveText('31 maja 2027 r.');
  await expect(page.locator('[data-w="wypowiedzenie"]')).toHaveText('2 tygodnie');
  await expect(page.locator('[data-w="status"]')).toHaveText('Zgodny z Kodeksem pracy');
});

test('3 miesiące przed umową krótszą niż 6 miesięcy: za długi', async ({ page }) => {
  await page.getByLabel(/Jaka umowa ma być/).selectOption('okreslony-ponizej-6');
  await page.getByLabel('Okres próbny', { exact: true }).selectOption('3m');
  await expect(page.locator('[data-w="status"]')).toContainText('Za długi');
  await expect(page.locator('[data-w="maks"]')).toHaveText('1 miesiąc');
});

test('zła data: komunikat, a maksimum i wypowiedzenie nie zostają z poprzedniego rachunku', async ({ page }) => {
  await page.getByLabel('Od', { exact: true }).fill('');
  await expect(page.locator('#p-blad')).toHaveText('Wpisz datę początku umowy.');
  await expect(page.locator('[data-w="maks"]')).toHaveText('—');
  await expect(page.locator('[data-w="wypowiedzenie"]')).toHaveText('—');
});

test.describe('po Nowym Roku', () => {
  test('5 stycznia 2027 r.: domyślny początek umowy to dziś', async ({ page }) => {
    await page.clock.setFixedTime(new Date('2027-01-05T10:00:00+01:00'));
    await page.goto(NARZEDZIE_PROBNY);
    await expect(page.getByLabel('Od', { exact: true })).toHaveValue('2027-01-05');
    await expect(page.locator('[data-w="koniec"]')).toHaveText(/^4\skwietnia\s2027\sr\.$/);
  });
});

test.describe('telefon 320 px', () => {
  test.use({ viewport: { width: 320, height: 640 } });
  test('żadna opcja planowanej umowy nie jest szersza niż pole', async ({ page }) => {
    const uciete = await page.locator('#p-plan').evaluate((el) => {
      const s = el as HTMLSelectElement;
      const styl = getComputedStyle(s);
      const ctx = document.createElement('canvas').getContext('2d')!;
      ctx.font = `${styl.fontWeight} ${styl.fontSize} ${styl.fontFamily}`;
      return [...s.options].filter((o) => ctx.measureText(o.text).width > s.clientWidth - 40).map((o) => o.text);
    });
    expect(uciete).toEqual([]);
  });
});
