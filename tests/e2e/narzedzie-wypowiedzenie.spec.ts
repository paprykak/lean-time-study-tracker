import { expect, test } from '@playwright/test';
import { NARZEDZIE_WYPOWIEDZENIE } from './strony';

// Okres wypowiedzenia: miesiące do końca miesiąca (przykład gov.pl), tygodnie do soboty, okres próbny.
test.beforeEach(async ({ page }) => {
  await page.goto(NARZEDZIE_WYPOWIEDZENIE);
});

test('staż 4 lata, doręczenie 22 lipca 2026: 3 miesiące do 31 października, 3 dni na szukanie pracy', async ({ page }) => {
  await page.getByLabel('Początek pracy u tego pracodawcy').fill('2022-03-01');
  await page.getByLabel('Doręczenie wypowiedzenia').fill('2026-07-22');
  await expect(page.locator('[data-w="koniec"]')).toHaveText('31 października 2026 r. (sobota)');
  await expect(page.locator('[data-w="okres"]')).toHaveText('3 miesiące');
  await expect(page.locator('[data-w="poszukiwanie"]')).toHaveText('3 dni robocze, płatne');
});

test('staż 3 miesiące, doręczenie w poniedziałek: 2 tygodnie do trzeciej soboty', async ({ page }) => {
  await page.getByLabel('Początek pracy u tego pracodawcy').fill('2026-08-01');
  await page.getByLabel('Doręczenie wypowiedzenia').fill('2026-11-09');
  await expect(page.locator('[data-w="koniec"]')).toHaveText('28 listopada 2026 r. (sobota)');
  await page.getByLabel('Pracownik', { exact: true }).check();
  await expect(page.locator('[data-w="poszukiwanie"]')).toHaveText('nie przysługują (wypowiada pracownik)');
});

test('okres próbny ponad 2 tygodnie: 1 tydzień do soboty', async ({ page }) => {
  await page.getByLabel('Rodzaj umowy').selectOption('probna-ponad-2tyg');
  await expect(page.getByLabel('Początek pracy u tego pracodawcy')).toBeHidden();
  await page.getByLabel('Doręczenie wypowiedzenia').fill('2026-11-11');
  await expect(page.locator('[data-w="koniec"]')).toHaveText('21 listopada 2026 r. (sobota)');
});

test('początek po doręczeniu: komunikat', async ({ page }) => {
  await page.getByLabel('Początek pracy u tego pracodawcy').fill('2026-12-01');
  await page.getByLabel('Doręczenie wypowiedzenia').fill('2026-11-09');
  await expect(page.getByText('Początek pracy musi być przed doręczeniem wypowiedzenia.')).toBeVisible();
  await expect(page.getByLabel('Doręczenie wypowiedzenia')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByLabel('Doręczenie wypowiedzenia')).toHaveAttribute('aria-describedby', 'wy-blad');
  await expect(page.getByLabel('Początek pracy u tego pracodawcy')).toHaveAttribute('aria-describedby', 'wy-od-opis wy-blad');
});

test('6 miesięcy stażu mija w trakcie wypowiedzenia: 1 miesiąc zamiast 2 tygodni, z uwagą', async ({ page }) => {
  await page.getByLabel('Początek pracy u tego pracodawcy').fill('2026-03-01');
  await page.getByLabel('Doręczenie wypowiedzenia').fill('2026-08-20');
  await expect(page.locator('[data-w="koniec"]')).toHaveText(/^30\swrześnia\s2026\sr\.\s\(środa\)$/);
  await expect(page.locator('[data-w="okres"]')).toHaveText(/^1\smiesiąc$/);
  await expect(page.locator('[data-w="staz"]')).toHaveText(/^5\smiesięcy$/);
  await expect(page.locator('[data-w="uwaga"]')).toHaveText(/z\skońcem dnia 31\ssierpnia\s2026\sr\., staż osiągnie 6\smiesięcy.*do\s1\smiesiąca\. Bez wydłużenia: 2\stygodnie, do\s5\swrześnia\s2026\sr\.\s\(sobota\)/);
});

test('koniec miesiąca (art. 112 KC): 29 lutego 2024 r. → doręczenie 28 lutego 2027 r., 3 miesiące do 31 maja', async ({ page }) => {
  await page.getByLabel('Początek pracy u tego pracodawcy').fill('2024-02-29');
  await page.getByLabel('Doręczenie wypowiedzenia').fill('2027-02-28');
  await expect(page.locator('[data-w="okres"]')).toHaveText(/^3\smiesiące$/);
  await expect(page.locator('[data-w="koniec"]')).toHaveText(/^31\smaja\s2027\sr\.\s\(poniedziałek\)$/);
  await expect(page.locator('[data-w="staz"]')).toHaveText(/^2\slata\si\s11\smiesięcy$/);
});

test('próg po końcu okresu: 2 tygodnie bez uwagi', async ({ page }) => {
  await page.getByLabel('Początek pracy u tego pracodawcy').fill('2026-03-01');
  await page.getByLabel('Doręczenie wypowiedzenia').fill('2026-08-01');
  await expect(page.locator('[data-w="okres"]')).toHaveText(/^2\stygodnie$/);
  await expect(page.locator('[data-w="uwaga"]')).toBeHidden();
});

test.describe('telefon 320 px', () => {
  test.use({ viewport: { width: 320, height: 640 } });
  test('żadna opcja rodzaju umowy nie jest szersza niż pole', async ({ page }) => {
    const uciete = await page.locator('#wy-rodzaj').evaluate(async (el) => {
      const s = el as HTMLSelectElement;
      const styl = getComputedStyle(s);
      const ctx = document.createElement('canvas').getContext('2d')!;
      ctx.font = `${styl.fontWeight} ${styl.fontSize} ${styl.fontFamily}`;
      // Mierzymy fontem strony, nie zastępczym: bez tego wynik zależy od fontów systemu (w CI szersze).
      await document.fonts.load(ctx.font, [...s.options].map((o) => o.text).join(''));
      return [...s.options].filter((o) => ctx.measureText(o.text).width > s.clientWidth - 40).map((o) => o.text);
    });
    expect(uciete).toEqual([]);
  });
});
