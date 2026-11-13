import { expect, test } from '@playwright/test';

const ADRES = '/narzedzia/odziez-robocza';

// Odzież robocza: domyślnie umowa o pracę, ubranie się brudzi, firma daje i pierze; rachunki 8 × 3,50 zł = 28,00 zł
// miesięcznie (336,00 zł rocznie) i 120 zł/12 mies. + 200 zł/24 mies. = 18,33 zł miesięcznie (220,00 zł rocznie).
test.beforeEach(async ({ page }) => {
  await page.goto(ADRES);
});

test('domyślnie: firma musi dać odzież, bez podatku, rachunki prań i ekwiwalentu', async ({ page }) => {
  await expect(page.locator('[data-w="glowny"]')).toHaveText(/Firma\smusi\sdać\sodzież\si\sobuwie/);
  await expect(page.locator('[data-w="wiersze"]')).toContainText(/Bez\spodatku/);
  await expect(page.locator('[data-w="pran"]')).toHaveText(/^28,00\szł\smiesięcznie$/);
  await expect(page.locator('[data-w="pran-opis"]')).toContainText(/336,00\szł/);
  await expect(page.locator('[data-w="ekw"]')).toHaveText(/^18,33\szł\smiesięcznie$/);
  await expect(page.locator('[data-w="ekw-opis"]')).toContainText(/220,00\szł/);
});

test('obsługa maszyn i własne ubranie: własnych nie wolno (art. 237⁷ § 3)', async ({ page }) => {
  await page.locator('input[name="warunki"][value="maszyny"]').check();
  await page.locator('[name="teraz"]').selectOption('wlasna');
  await expect(page.locator('[data-w="wiersze"]')).toContainText(/Nie\sna\stym\sstanowisku/);
  await expect(page.locator('[data-w="uwagi"]')).toContainText(/237⁷\s§\s3/);
});

test('zlecenie: przepis nie rozstrzyga wprost; skażenie przy umowie o pracę: pranie tylko przez pracodawcę', async ({ page }) => {
  await page.locator('[name="umowa"]').selectOption('zlecenie');
  await expect(page.locator('[data-w="glowny"]')).toHaveText(/Przepis\snie\srozstrzyga\swprost/);
  await page.locator('[name="umowa"]').selectOption('praca');
  await page.locator('input[name="warunki"][value="skazenie"]').check();
  await page.locator('[name="pranie"]').selectOption('ja');
  await expect(page.locator('[data-w="wiersze"]')).toContainText(/Tylko\spracodawca/);
  await expect(page.locator('[data-w="uwagi"]')).toContainText(/237¹⁰\s§\s2/);
});

test('63 prania w miesiącu to błąd danych', async ({ page }) => {
  await page.getByText('Policz koszt swoich prań').click();
  await page.locator('[name="pranMies"]').fill('63');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.locator('[data-w="pran"]')).toHaveText('—');
});

test('same maszyny: obowiązek jako wariant bezpieczny; ŚOI prane w domu: uwaga z art. 237⁹ § 2', async ({ page }) => {
  await page.locator('input[name="warunki"][value="brud"]').uncheck();
  await page.locator('input[name="warunki"][value="maszyny"]').check();
  await expect(page.locator('[data-w="podstawa"]')).toContainText(/wariant\sbezpieczny/);
  await page.locator('[name="rodzaj"]').selectOption('soi');
  await page.locator('[name="pranie"]').selectOption('ja');
  await expect(page.locator('[data-w="uwagi"]')).toContainText(/237⁹\s§\s2/);
  await expect(page.locator('[data-pole="ekw-pranie"]')).toBeHidden();
});

test('własne ubranie prane w domu bez ekwiwalentu za pranie: jedna uwaga „przepis nie rozstrzyga”', async ({ page }) => {
  await page.locator('[name="teraz"]').selectOption('wlasna');
  await page.locator('[name="pranie"]').selectOption('ja');
  await page.locator('[name="ekwPranie"]').selectOption('nie');
  const uwagi = page.locator('[data-w="uwagi"] p');
  await expect(uwagi).toHaveCount(1);
  await expect(uwagi).toContainText(/Przepis\snie\srozstrzyga/);
});
