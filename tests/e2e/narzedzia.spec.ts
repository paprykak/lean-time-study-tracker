import { expect, test } from '@playwright/test';
import { NARZEDZIE } from './strony';

// Kalkulator dodatku za pracę w nocy: wynik dla znanych danych (listopad 2026: 4806 zł / 160 h = 30,04 zł,
// 20% = 6,01 zł za godzinę; testy jednostkowe w src/lib/narzedzia), tryb grafiku, błędy, wyższy procent,
// tabela bez JavaScriptu. Rok i miesiąc ustawiamy jawnie, bo domyślnie kalkulator bierze bieżący miesiąc.
const kwota = (page: import('@playwright/test').Page) => page.locator('[data-w="kwota"]');

test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE);
  await page.getByLabel('Rok').selectOption('2026');
  await page.getByLabel('Miesiąc', { exact: true }).selectOption('11');
});

test('znana liczba godzin: listopad 2026, 8 h → 48,08 zł', async ({ page }) => {
  await page.getByLabel('Godziny nocne w miesiącu').fill('8');
  await expect(kwota(page)).toHaveText('48,08 zł');
  await expect(page.locator('[data-w="wymiar"]')).toHaveText('160 h');
  await expect(page.locator('[data-w="wymiar-opis"]')).toContainText('11 listopada');
  await expect(page.locator('[data-w="stawka"]')).toHaveText('4806,00 zł : 160 h = 30,04 zł');
  await page.getByLabel('Godziny nocne w miesiącu').fill('7,5');
  await expect(kwota(page)).toHaveText('45,08 zł');
});

test('z grafiku: 10 zmian 18:00–6:00 przy porze 22:00–6:00 → 80 h, 480,80 zł', async ({ page }) => {
  await page.getByLabel('Policz z grafiku').check();
  await page.getByLabel('Początek zmiany').fill('18:00');
  await page.getByLabel('Koniec zmiany').fill('06:00');
  await page.getByLabel('Pora nocna u pracodawcy').selectOption('22:00');
  await page.getByLabel('Takich zmian w miesiącu').fill('10');
  await expect(page.locator('[data-w="godziny"]')).toHaveText('80 h');
  await expect(kwota(page)).toHaveText('480,80 zł');
  await expect(page.locator('[data-w="pracujacy-w-nocy"]')).toBeVisible();
  // Zmiana popołudniowa 14:00–22:00: przy porze od 21:00 jedna godzina nocna, od 22:00 żadna.
  await page.getByLabel('Początek zmiany').fill('14:00');
  await page.getByLabel('Koniec zmiany').fill('22:00');
  await page.getByLabel('Pora nocna u pracodawcy').selectOption('21:00');
  await expect(page.locator('[data-w="godziny"]')).toHaveText('10 h');
  await expect(page.locator('[data-w="pracujacy-w-nocy"]')).toBeHidden();
});

test('błędne dane: komunikat przy polu, aria-invalid, brak kwoty', async ({ page }) => {
  const pole = page.getByLabel('Godziny nocne w miesiącu');
  await pole.fill('osiem');
  await expect(page.getByText('Wpisz liczbę godzin, na przykład 8 albo 7,5.')).toBeVisible();
  await expect(pole).toHaveAttribute('aria-invalid', 'true');
  await expect(kwota(page)).toHaveText('—');
  await pole.fill('300');
  await expect(page.getByText('najwyżej 240 godzin')).toBeVisible();
  await pole.fill('8');
  await expect(pole).toHaveAttribute('aria-invalid', 'false');
  await expect(kwota(page)).toHaveText('48,08 zł');
});

test('wyższy dodatek z regulaminu: 25% → 7,51 zł za godzinę', async ({ page }) => {
  await page.getByText('Pracodawca płaci więcej niż 20%?').click();
  await page.getByLabel('Dodatek w procentach stawki z płacy minimalnej').fill('25');
  await expect(page.locator('[data-w="za-godzine"]')).toHaveText('25% × 30,04 zł = 7,51 zł');
  await expect(kwota(page)).toHaveText('60,08 zł');
});

test.describe('bez JavaScriptu', () => {
  test.use({ javaScriptEnabled: false });
  test('tabela stawek na 2026 r. jest w HTML', async ({ page }) => {
    await page.goto(NARZEDZIE);
    const wiersz = page.locator('#stawki-2026 + p + .tabela tr', { hasText: 'listopad' });
    await expect(wiersz).toContainText('160 h');
    await expect(wiersz).toContainText('6,01 zł');
    await expect(wiersz).toContainText('48,08 zł');
  });
});
