import { expect, test } from '@playwright/test';

// Audyt jakości 2: daty domyślne formularzy liczone w przeglądarce od prawdziwego dziś, a nie od dnia budowania
// (prompty/02-fabryka.md, sekcja 4, zasada 11). Zegar przestawiony na dzień po Nowym Roku.

test('doba pracownicza: najbliższy poniedziałek od dziś (środa 13.01.2027 → 18.01.2027)', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-01-13T10:00:00+01:00'));
  await page.goto('/narzedzia/doba-pracownicza');
  await expect(page.locator('[name="start"]')).toHaveValue('2027-01-18');
});

test('doba pracownicza: w poniedziałek ten sam dzień', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-01-18T10:00:00+01:00'));
  await page.goto('/narzedzia/doba-pracownicza');
  await expect(page.locator('[name="start"]')).toHaveValue('2027-01-18');
});

test('urlop w okresie wypowiedzenia: od dziś do końca miesiąca (10.02.2027)', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-02-10T10:00:00+01:00'));
  await page.goto('/narzedzia/urlop-w-okresie-wypowiedzenia');
  await expect(page.locator('#uw-od')).toHaveValue('2027-02-10');
  await expect(page.locator('#uw-koniec')).toHaveValue('2027-02-28');
  await expect(page.locator('label[for="uw-wykorzystane"]')).toContainText(/2027\sr\./);
  await expect(page.locator('[data-w="dni-pracy"]')).toContainText(/^13\sdni/);
  await expect(page.locator('[data-w="proporcjonalny"]')).toContainText(/^5\sdni/);
});

test('okres wyczekiwania: początek ubezpieczenia 10 dni przed dziś (20.01.2027 → 10.01.2027)', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-01-20T10:00:00+01:00'));
  await page.goto('/narzedzia/okres-wyczekiwania');
  await expect(page.locator('#w-start')).toHaveValue('2027-01-10');
  await expect(page.locator('[data-w="prawo"]')).toHaveText(/^9\slutego\s2027\sr\.$/);
});

test('wynagrodzenie za niepełny miesiąc: bieżący miesiąc i rok (10.02.2027)', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-02-10T10:00:00+01:00'));
  await page.goto('/narzedzia/wynagrodzenie-za-niepelny-miesiac');
  await expect(page.locator('#n-rok')).toHaveValue('2027');
  await expect(page.locator('#n-miesiac')).toHaveValue('2');
});

test('dodatek wyrównawczy: rozliczenie za bieżący miesiąc, przeniesienie od 1. dnia poprzedniego (15.01.2027)', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-01-15T10:00:00+01:00'));
  await page.goto('/narzedzia/dodatek-wyrownawczy');
  await expect(page.locator('#d-rok')).toHaveValue('2027');
  await expect(page.locator('#d-miesiac')).toHaveValue('1');
  await expect(page.locator('#d-od')).toHaveValue('2026-12-01');
});

test('zerowy PIT: po Nowym Roku bieżący rok i zeszłoroczna przeprowadzka (15.01.2027)', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-01-15T10:00:00+01:00'));
  await page.goto('/narzedzia/zerowy-pit');
  await expect(page.locator('#z-rok')).toHaveValue('2027');
  await expect(page.locator('#z-przeniesienie')).toHaveValue('2026');
});

test('mobbing: po Nowym Roku płaca minimalna z bieżącego roku (5.01.2027 → 6 × 4950 zł)', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-01-05T10:00:00+01:00'));
  await page.goto('/narzedzia/mobbing-i-dyskryminacja');
  await page.locator('#m-naruszenie').selectOption('mobbing');
  await expect(page.locator('#m-rok')).toHaveValue('2027');
  await expect(page.locator('#m-data')).toHaveValue('2027-01-05');
  await expect(page.locator('[data-w="kwota"]')).toHaveText(/^29\s?700,00\szł$/);
});

test('egzamin UDT: ostrzeżenie o nowym komunikacie GUS dopiero po roku od ostatniego', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2027-02-10T10:00:00+01:00'));
  await page.goto('/narzedzia/czy-potrzebne-uprawnienia-udt');
  await expect(page.locator('[data-gus-nowsza]')).toBeHidden();
  await page.clock.setFixedTime(new Date('2027-02-11T10:00:00+01:00'));
  await page.reload();
  await expect(page.locator('[data-gus-nowsza]')).toBeVisible();
  await expect(page.locator('[data-gus-nowsza]')).toContainText(/za\s2026\sr\./);
});

test('SEP: rok bez płacy minimalnej, opłata z ostatniego roku z wyjaśnieniem (5.01.2028)', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2028-01-05T10:00:00+01:00'));
  await page.goto('/narzedzia/waznosc-uprawnien-sep');
  await expect(page.locator('#sep-wniosek')).toHaveValue('2027-12-31');
  await expect(page.locator('[data-w="oplata"]')).toContainText(/Nie\smamy\sjeszcze\spłacy\sminimalnej\sna\s2028\sr\./);
  await page.locator('#sep-wniosek').fill('2027-06-01');
  await expect(page.locator('[data-w="oplata"]')).not.toContainText('Nie mamy jeszcze');
});

test('komunikaty błędów UDT i SEP są ogłaszane czytnikowi (role="alert")', async ({ page }) => {
  await page.goto('/narzedzia/czy-potrzebne-uprawnienia-udt');
  await page.getByLabel('Rodzaj maszyny').selectOption('wciagnik');
  await page.getByLabel('Udźwig z tabliczki (kg)').fill('0');
  await expect(page.getByRole('alert')).toHaveText(/Wpisz\sudźwig/);
  await expect(page.locator('#sep-wniosek-blad, #cu-udzwig-blad').first()).toHaveAttribute('role', 'alert');
});

// Pakiet „spójność UX”: listy lat narzędzi liczących z samego kalendarza (data-lata-kalendarza) uzupełnia przeglądarka,
// więc strona nieprzebudowana przez ponad rok nadal ma bieżący rok (tu: czytana w 2029 r.).
for (const [slug, lista, lata] of [
  ['wymiar-czasu-pracy', '#w-rok', ['2029', '2030']],
  ['kalkulator-nadgodzin', '#n-rok', ['2028', '2029', '2030']],
  ['dni-wolne-od-pracy', '#w-rok', ['2029', '2030', '2031']],
  ['rownowazny-czas-pracy', '#r-rok', ['2028', '2029', '2030']],
] as const) {
  test(`${slug}: lista lat ma bieżący rok także w 2029 r.`, async ({ page }) => {
    await page.clock.setFixedTime(new Date('2029-03-14T10:00:00+01:00'));
    await page.goto(`/narzedzia/${slug}`);
    const opcje = await page.locator(`${lista} option`).evaluateAll((o) => o.map((x) => (x as HTMLOptionElement).value));
    for (const r of lata) expect(opcje).toContain(r);
    if (slug !== 'rownowazny-czas-pracy') await expect(page.locator(lista)).toHaveValue('2029');
    expect([...opcje].sort()).toEqual(opcje);
  });
}
