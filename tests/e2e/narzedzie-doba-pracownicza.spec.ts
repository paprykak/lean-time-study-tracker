import { expect, test } from '@playwright/test';

// Tydzień od poniedziałku 16 listopada 2026 r.: pn 14:00–22:00, wt–pt 6:00–14:00. Doba poniedziałku trwa do 14:00
// we wtorek, więc cała wtorkowa zmiana (8 h) to nadgodziny z doby; odpoczynek w dobie poniedziałku 22:00–6:00 = 8 h.
const dni = [
  ['14:00', '22:00'],
  ['06:00', '14:00'],
  ['06:00', '14:00'],
  ['06:00', '14:00'],
  ['06:00', '14:00'],
  ['', ''],
  ['', ''],
];

test.beforeEach(async ({ page }) => {
  await page.goto('/narzedzia/doba-pracownicza');
  await page.locator('[name="start"]').fill('2026-11-16');
  for (const [i, [od, do_]] of dni.entries()) {
    await page.locator(`[name="od${i + 1}"]`).fill(od);
    await page.locator(`[name="do${i + 1}"]`).fill(do_);
  }
});

test('popołudnie, potem ranne zmiany: 8 h nadgodzin z doby i za krótki odpoczynek', async ({ page }) => {
  await expect(page.locator('[data-w="nadgodziny"]')).toHaveText(/^8\sh$/);
  await expect(page.locator('[data-w="dodatki"]')).toContainText(/wtorek\s17\.11/);
  await expect(page.locator('[data-w="odpoczynek"]')).toHaveText(/za\skrótki\sw\s1\sdobie/);
  const pn = page.locator('[data-w="dni"] tr').first();
  await expect(pn).toHaveAttribute('data-stan', 'naruszenie');
  await expect(pn).toContainText(/8\sh,\sza\skrótki/);
  await expect(page.locator('[data-dzien="0"]')).toHaveText(/poniedziałek\s16\.11/);
});

test('pn 8:00–16:00 i wt 6:00–14:00: 2 h; ruchomy rozkład zeruje nadgodziny, odpoczynek zostaje', async ({ page }) => {
  await page.locator('[name="od1"]').fill('08:00');
  await page.locator('[name="do1"]').fill('16:00');
  await expect(page.locator('[data-w="nadgodziny"]')).toHaveText(/^2\sh$/);
  await expect(page.locator('[data-w="odpoczynek"]')).toContainText(/co\snajmniej\s11\sh/);
  await page.locator('[name="od1"]').fill('14:00');
  await page.locator('[name="do1"]').fill('22:00');
  await page.getByLabel(/Ruchomy rozkład/).check();
  await expect(page.locator('[data-w="nadgodziny"]')).toHaveText(/^0\sh$/);
  await expect(page.locator('[data-w="uwagi"]')).toContainText(/wyszłoby\s8\sh/);
  await expect(page.locator('[data-w="odpoczynek"]')).toHaveText(/za\skrótki/);
});

test('pora nocna od 23:00: wtorek 5:00–13:00 daje 2 h nocnych nadgodzin', async ({ page }) => {
  await page.locator('[name="od2"]').fill('05:00');
  await page.locator('[name="do2"]').fill('13:00');
  await page.getByLabel('Pora nocna u pracodawcy').selectOption('23:00');
  await expect(page.locator('[data-w="dodatki"]')).toContainText(/W\sporze\snocnej\s2\sh\s\(dodatek\s100%\),\sw\spozostałych\sgodzinach\s6\sh/);
});

test('błędne dane: tylko jedna godzina, zmiany na siebie nachodzą', async ({ page }) => {
  await page.locator('[name="do3"]').fill('');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.locator('[data-blad="dane"]')).toContainText(/środa\s18\.11:\swpisz\sobie\sgodziny/);
  await expect(page.locator('[data-w="nadgodziny"]')).toHaveText('—');
  await expect(page.locator('[name="do3"]')).toHaveAttribute('aria-invalid', 'true');
  await page.locator('[name="do3"]').fill('14:00');
  await expect(page.locator('[name="do3"]')).not.toHaveAttribute('aria-invalid', 'true');
  await page.locator('[name="do1"]').fill('08:00');
  await expect(page.locator('[data-blad="dane"]')).toContainText(/wtorek\s17\.11:\szmiana\szaczyna\ssię/);
});
