import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { STRONY } from './strony';

// WCAG 2.2 AA przez axe: błędy „serious” i „critical” blokują wdrożenie.
for (const adres of STRONY) {
  test(`${adres}: brak poważnych błędów dostępności (axe, WCAG 2.2 AA)`, async ({ page }) => {
    await page.goto(adres);
    const wynik = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze();
    const powazne = wynik.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    expect(powazne.map((v) => `${v.id}: ${v.help} (${v.nodes.length}×) ${v.nodes[0]?.target.join(' ')}`)).toEqual([]);
  });
}

test('klawiatura: pierwszy Tab pokazuje „Przejdź do treści”, Enter przenosi do treści', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'Safari domyślnie nie przechodzi Tabem po linkach (ustawienie systemu).');
  await page.goto('/styleguide');
  await page.keyboard.press('Tab');
  const link = page.getByRole('link', { name: 'Przejdź do treści' });
  await expect(link).toBeFocused();
  await expect(link).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page.locator('main#tresc')).toBeFocused();
});

test('klawiatura: każdy element w nagłówku ma widoczny fokus', async ({ page, browserName, isMobile }) => {
  test.skip(browserName === 'webkit' || isMobile, 'Fokus klawiatury sprawdzamy na komputerze.');
  await page.goto('/styleguide');
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press('Tab');
    const obrys = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement;
      const s = getComputedStyle(el);
      const naKarcie = el.closest('.karta');
      const sk = naKarcie ? getComputedStyle(naKarcie) : null;
      return { el: el.outerHTML.slice(0, 80), szerokosc: Math.max(parseFloat(s.outlineWidth) || 0, parseFloat(sk?.outlineWidth ?? '0') || 0), styl: s.outlineStyle };
    });
    expect(obrys.szerokosc, `fokus niewidoczny na ${obrys.el}`).toBeGreaterThanOrEqual(2);
  }
});

test('karta ma jedno miejsce w kolejności Tab (rozciągnięty link) i obrys całej karty przy fokusie', async ({ page, browserName, isMobile }) => {
  test.skip(browserName === 'webkit' || isMobile, 'Fokus klawiatury sprawdzamy na komputerze.');
  await page.goto('/styleguide');
  const karta = page.locator('section[aria-labelledby="karty"] article.karta').nth(4);
  const linki = karta.locator('a');
  // Link tytułu plus ewentualnie link kategorii: tytuł pokrywa całą kartę.
  await karta.locator('.karta-link').focus();
  const obrys = await karta.evaluate((el) => getComputedStyle(el).outlineWidth);
  expect(parseFloat(obrys)).toBeGreaterThanOrEqual(2);
  expect(await linki.count()).toBeLessThanOrEqual(2);
});
