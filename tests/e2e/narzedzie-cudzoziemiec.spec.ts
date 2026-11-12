import { expect, test } from '@playwright/test';

// Praca cudzoziemca (ustawa o powierzaniu pracy cudzoziemcom z 2025 r.): jak w cudzoziemiec-podstawa.test.ts.
test.beforeEach(async ({ page }) => {
  await page.goto('/narzedzia/praca-cudzoziemca');
});

test('Ukraina z ochroną czasową: bez zezwolenia, urząd pracy w 7 dni', async ({ page }) => {
  await expect(page.locator('[data-w="naglowek"]')).toHaveText(/Bez\szezwolenia/);
  await expect(page.locator('[data-w="obowiazki"]')).toContainText(/7\sdni/);
});

test('Białoruś na wizie: oświadczenie albo zezwolenie; inne państwo: zezwolenie', async ({ page }) => {
  await page.getByLabel('Obywatelstwo').selectOption('oswiadczenie');
  await page.getByLabel('Dokument albo status w Polsce').selectOption('inny');
  await expect(page.locator('[data-w="naglowek"]')).toHaveText(/oświadczenie/);
  await expect(page.locator('[data-w="uwaga"]')).toContainText(/24\smiesiące/);
  await page.getByLabel('Obywatelstwo').selectOption('inne');
  await expect(page.locator('[data-w="naglowek"]')).toHaveText(/Potrzebne\szezwolenie\sna\spracę/);
});

test('UE: pole statusu znika, brak obowiązków', async ({ page }) => {
  await page.getByLabel('Obywatelstwo').selectOption('ue');
  await expect(page.getByLabel('Dokument albo status w Polsce')).toBeHidden();
  await expect(page.locator('[data-w="obowiazki"] li')).toHaveCount(0);
});
