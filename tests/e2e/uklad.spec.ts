import { expect, test } from '@playwright/test';
import { FORMATY } from '../../src/lib/reklamy';

// Stabilność układu (CLS), sloty reklamowe w wymiarach formatu, cele dotyku na telefonie.
test('CLS poniżej 0,02 przy wczytaniu i przewinięciu strony wzorów', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Layout Instability API jest tylko w Chromium.');
  await page.addInitScript(() => {
    (window as unknown as { cls: number }).cls = 0;
    new PerformanceObserver((lista) => {
      for (const e of lista.getEntries() as unknown as { value: number; hadRecentInput: boolean }[]) if (!e.hadRecentInput) (window as unknown as { cls: number }).cls += e.value;
    }).observe({ type: 'layout-shift', buffered: true });
  });
  await page.goto('/styleguide', { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 30));
    }
  });
  const cls = await page.evaluate(() => (window as unknown as { cls: number }).cls);
  expect(cls).toBeLessThan(0.02);
});

test('sloty reklamowe rezerwują miejsce w proporcjach formatu i mają podpis „REKLAMA”', async ({ page }) => {
  await page.goto('/styleguide');
  const warianty = page.locator('.slot-wariant');
  const n = await warianty.count();
  expect(n).toBeGreaterThan(5);
  let widoczne = 0;
  for (let i = 0; i < n; i++) {
    const w = warianty.nth(i);
    if (!(await w.isVisible())) continue;
    widoczne++;
    const format = (await w.getAttribute('data-format')) as keyof typeof FORMATY;
    const { szerokosc, wysokosc } = FORMATY[format];
    await expect(w.locator('.slot-podpis')).toHaveText(/reklama/i);
    const pole = (await w.locator('.slot-pole').boundingBox())!;
    expect(pole.width).toBeLessThanOrEqual(szerokosc + 0.5);
    expect(Math.abs(pole.width / pole.height - szerokosc / wysokosc)).toBeLessThan(0.02);
    // Pełny wymiar tam, gdzie kolumna jest dość szeroka
    const rodzic = (await w.evaluate((el) => el.parentElement!.getBoundingClientRect().width)) as number;
    if (rodzic >= szerokosc) expect(Math.round(pole.width)).toBe(szerokosc);
  }
  expect(widoczne).toBeGreaterThan(3);
});

test('reklama kampanii: link sponsorowany z UTM, otwierany bezpiecznie', async ({ page }) => {
  await page.goto('/styleguide');
  const link = page.locator('[data-slot="sg-kampania"] a:visible').first();
  await expect(link).toHaveAttribute('rel', 'sponsored noopener');
  await expect(link).toHaveAttribute('href', /utm_source=rytmhali&utm_medium=display&utm_campaign=przyklad-styleguide/);
});

test('telefon: cele dotyku w nagłówku, pasku kategorii i okruszkach mają co najmniej 44 px', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Tylko telefon.');
  await page.goto('/styleguide');
  const cele = page.locator('header a:visible, header button:visible, nav[aria-label="Ścieżka nawigacji"] a, .newsletter button');
  const n = await cele.count();
  expect(n).toBeGreaterThan(8);
  for (let i = 0; i < n; i++) {
    const box = await cele.nth(i).boundingBox();
    if (!box) continue;
    expect(Math.round(box.height), await cele.nth(i).evaluate((el) => el.outerHTML.slice(0, 80))).toBeGreaterThanOrEqual(44);
  }
});

test('telefon: pasek kategorii przewija się w bok, a strona nie', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Tylko telefon.');
  await page.goto('/styleguide');
  const menu = page.locator('.menu-dzialow-lista');
  const { przewija } = await menu.evaluate((el) => ({ przewija: el.scrollWidth > el.clientWidth }));
  expect(przewija).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
