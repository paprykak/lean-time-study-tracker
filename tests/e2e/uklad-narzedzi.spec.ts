import { expect, test } from '@playwright/test';
import { NARZEDZIA } from '../../src/data/narzedzia';
import { NAJCZESTSZE } from '../../src/data/sprawy';

// Nowy układ (2026-11-12): strona główna jako centrum narzędzi, spis /narzedzia z filtrem, nagłówek z kategoriami.

test('strona główna: pole wyszukiwania pokazuje narzędzia z pytaniem z FAQ, a liczba trafia do czytnika ekranu', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Czy wolno, czy muszę, ile mi się należy?');
  // Jedno pole na ekranie: na stronie głównej nagłówek nie ma własnego.
  await expect(page.locator('#szukaj-naglowek')).toHaveCount(0);
  await page.locator('#szukaj-glowna').fill('kto płaci za L4');
  const wyniki = page.locator('.szukajka-warstwa .szukajka-wynik-link');
  await expect(wyniki.first()).toBeVisible();
  await expect(page.locator('.szukajka-warstwa a[href="/narzedzia/kalkulator-l4"]')).toContainText('Odpowiada na:');
  await expect(page.locator('[data-szukajka-status]')).toHaveText(/narzędz/, { timeout: 3000 });
  await expect(page.locator('[data-szukajka-pelny]')).toHaveAttribute('href', '/szukaj?q=kto%20p%C5%82aci%20za%20L4');
});

test('strona główna: klawiatura (↓ do wyników, Esc wraca do pola) i brak wyników z podpowiedzią', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Klawiatura: komputer.');
  await page.goto('/');
  const pole = page.locator('#szukaj-glowna');
  await pole.fill('nadgodziny');
  await expect(page.locator('.szukajka-wynik-link').first()).toBeVisible();
  await pole.press('ArrowDown');
  await expect(page.locator('.szukajka-wynik-link').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(pole).toBeFocused();
  await expect(page.locator('[data-szukajka-warstwa]')).toBeHidden();
  await pole.fill('kangur');
  await expect(page.locator('[data-szukajka-licznik]')).toHaveText(/Nie mamy narzędzia do „kangur”/);
});

test('strona główna: najczęstsze sprawy, tematy z liczbą narzędzi i pełny spis nazw bez JavaScriptu', async ({ browser }) => {
  const kontekst = await browser.newContext({ javaScriptEnabled: false });
  const page = await kontekst.newPage();
  await page.goto('/');
  for (const s of NAJCZESTSZE) await expect(page.locator(`#najczestsze ~ ul a[href="/narzedzia/${s.slug}"]`)).toHaveCount(1);
  await expect(page.locator('#tematy ~ ul a[href="/narzedzia"]')).toContainText(`(${NARZEDZIA.length})`);
  // Każde narzędzie z rejestru ma link w spisie na dole strony.
  for (const n of NARZEDZIA) await expect(page.locator(`.spis a[href="/narzedzia/${n.slug}"]`), n.slug).toHaveCount(1);
  await kontekst.close();
});

test('/narzedzia: filtr kategorii bez przeładowania, stan w kotwicy, „Wstecz” i link z menu', async ({ page }) => {
  await page.goto('/narzedzia');
  const bhp = NARZEDZIA.filter((n) => n.kategoria === 'bhp').length;
  await page.locator('.kategoria-przelacznik[data-kategoria="bhp"]').click();
  await expect(page).toHaveURL(/\/narzedzia#bhp$/);
  await expect(page.locator('[data-licznik]')).toHaveText(new RegExp(`^${bhp} narzędz`));
  await expect(page.locator('[data-sekcja="bhp"]')).toBeVisible();
  await expect(page.locator('[data-sekcja="urlopy"]')).toBeHidden();
  await expect(page.locator('.kategoria-przelacznik[data-kategoria="bhp"]')).toHaveAttribute('aria-current', 'true');
  await page.goBack();
  await expect(page.locator('[data-sekcja="urlopy"]')).toBeVisible();
  // Wejście z linku (menu, stopka): od razu przefiltrowana kategoria.
  await page.goto('/narzedzia#urlopy');
  await expect(page.locator('[data-sekcja="bhp"]')).toBeHidden();
  await expect(page.locator('[data-sekcja="urlopy"]')).toBeVisible();
});

test('/narzedzia: filtr tekstowy na żywo (bez polskich znaków), stan w ?q=, „Pokaż wszystkie” czyści', async ({ page }) => {
  await page.goto('/narzedzia');
  await page.locator('#filtr').fill('urlopu');
  await expect(page.locator('[data-wyniki] .wiersz-link').first()).toHaveAttribute('href', '/narzedzia/kalkulator-urlopu');
  await expect(page).toHaveURL(/\?q=urlopu/);
  await expect(page.locator('[data-spis]')).toBeHidden();
  await page.locator('[data-pokaz-wszystkie]').click();
  await expect(page.locator('[data-spis]')).toBeVisible();
  await page.goto('/narzedzia?q=zwolnienie%20lekarskie');
  await expect(page.locator('[data-wyniki] a[href="/narzedzia/kalkulator-l4"]')).toHaveCount(1);
});

test('strona narzędzia: aktywna kategoria w menu i najwyżej 5 podobnych narzędzi zamiast całej listy', async ({ page }) => {
  await page.goto('/narzedzia/kalkulator-urlopu');
  await expect(page.locator('[data-kategoria-menu="urlopy"]')).toHaveAttribute('aria-current', 'true');
  const podobne = page.locator('[aria-labelledby="podobne-narzedzia"] .podobne-link');
  expect(await podobne.count()).toBeGreaterThan(0);
  expect(await podobne.count()).toBeLessThanOrEqual(5);
  await expect(page.locator('[aria-labelledby="podobne-narzedzia"] a[href="/narzedzia/ekwiwalent-za-urlop"]')).toHaveCount(1);
});
