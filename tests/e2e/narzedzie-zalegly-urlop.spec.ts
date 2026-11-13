import { expect, test } from '@playwright/test';

// Zaległy urlop na dzień 12.11.2026: 2 dni za 2024 r. i 6 dni za 2025 r. (sprawdzone niezależnie w Pythonie).
// 2025: termin udzielenia 30.09.2026 (43 dni temu), przedawnienie w wariancie wcześniejszym 31.12.2028 (za 780 dni),
// później 30.09.2029. 2024: 31.12.2027 (za 414 dni). Urlop wychowawczy 1.03–31.08.2026: 30.06.2029 (metoda
// w miesiącach; w dniach 3.07.2029). Koniec umowy 15.03.2026: ekwiwalent, przedawnienie 15.03.2029.
test.beforeEach(async ({ page }) => {
  await page.goto('/narzedzia/zalegly-urlop');
  const w1 = page.getByRole('group', { name: 'Wiersz 1' });
  await w1.getByLabel('Rok').fill('2024');
  await w1.getByLabel('Dni niewykorzystane').fill('2');
  await page.locator('[name="rok2"]').fill('2025');
  await page.locator('[name="dni2"]').fill('6');
  await page.getByLabel('Na dzień', { exact: true }).fill('2026-11-12');
});

test('dwa lata: 8 dni, pierwszy termin przedawnienia 31 grudnia 2027 r.', async ({ page }) => {
  await expect(page.locator('[data-w="glowny"]')).toHaveText(/^8\sdni$/);
  await expect(page.locator('[data-w="opis"]')).toContainText(/za\s2024\sr\.,\s31\sgrudnia\s2027/);
  await expect(page.locator('[data-w="status"]')).toHaveText(/Zostało:\s414\sdni/);
  const r2025 = page.locator('[data-rok="2025"]');
  await expect(r2025).toContainText(/30\swrześnia\s2026\sr\.\s\(43\sdni\stemu\)/);
  await expect(r2025).toContainText(/31\sgrudnia\s2028\sr\.\s\(za\s780\sdni\)/);
  await expect(r2025).toContainText(/30\swrześnia\s2029/);
});

test('po pierwszym terminie przedawnienia: komunikat bez pewnej utraty', async ({ page }) => {
  await page.locator('[name="rok1"]').fill('2022');
  await expect(page.locator('[data-w="status"]')).toContainText(/nie\smusi\sbyć\sstracone/);
  await expect(page.locator('[data-w="status"]')).toContainText(/C-120\/21/);
});

test('urlop wychowawczy 1.03–31.08.2026 przesuwa przedawnienie za 2025 r. na 30 czerwca 2029 r.', async ({ page }) => {
  await page.locator('[name="wychOd"]').fill('2026-03-01');
  await page.locator('[name="wychDo"]').fill('2026-08-31');
  await expect(page.locator('[data-rok="2025"]')).toContainText(/30\sczerwca\s2029\sr\./);
  await expect(page.locator('[data-rok="2025"]')).toContainText(/urlopu\swychowawczego/);
});

test('koniec umowy 15.03.2026: ekwiwalent za 8 dni, przedawnienie 15 marca 2029 r.', async ({ page }) => {
  await page.getByLabel('Umowa skończyła się').fill('2026-03-15');
  await expect(page.locator('[data-w="etykieta"]')).toHaveText(/Ekwiwalent/);
  await expect(page.locator('[data-w="glowny"]')).toHaveText(/^8\sdni$/);
  await expect(page.locator('[data-w="opis"]')).toContainText(/15\smarca\s2029/);
  await expect(page.locator('[data-w="ekwiwalent"]')).toContainText(/25\smarca\s2026/);
  await expect(page.locator('[data-rok="2025"]')).toContainText(/wchodzi\sdo\sekwiwalentu/);
});

test('błędne dane: rok przyszły, dni ujemne, rok przed 2000, pusty formularz, jedna data wychowawczego', async ({ page }) => {
  const blad = page.getByRole('alert');
  const rok2 = page.locator('[name="rok2"]');
  const dni2 = page.locator('[name="dni2"]');

  await rok2.fill('2027');
  await expect(blad).toContainText(/Wiersz\s2:\srok\spóźniejszy\sniż\sdzień\ssprawdzenia/);
  await expect(rok2).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('[data-w="glowny"]')).toHaveText('—');
  await rok2.fill('2025');
  await expect(page.locator('[data-blad="dane"]')).toBeHidden();
  await expect(rok2).not.toHaveAttribute('aria-invalid', 'true');

  await dni2.fill('-3');
  await expect(blad).toContainText(/Wiersz\s2:\sdni\sod\s1\sdo\s100/);
  await expect(dni2).toHaveAttribute('aria-invalid', 'true');
  await dni2.fill('6');

  await page.locator('[name="rok1"]').fill('1999');
  await expect(blad).toContainText(/2000/);

  for (const n of ['rok1', 'dni1', 'rok2', 'dni2']) await page.locator(`[name="${n}"]`).fill('');
  await expect(blad).toContainText(/Wpisz\sco\snajmniej\sjeden\srok/);
  await page.locator('[name="rok1"]').fill('2025');
  await page.locator('[name="dni1"]').fill('4');
  await expect(page.locator('[data-blad="dane"]')).toBeHidden();

  await page.locator('[name="wychOd"]').fill('2026-03-01');
  await expect(blad).toContainText(/Uzupełnij\sobie\sdaty\surlopu\swychowawczego/);
  await expect(page.locator('[name="wychDo"]')).toHaveAttribute('aria-invalid', 'true');
});
