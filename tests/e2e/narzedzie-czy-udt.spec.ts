import { expect, test } from '@playwright/test';
import { adresNarzedzia } from '../../src/data/narzedzia';

// Czy potrzebne uprawnienia UDT: drzewo decyzji (rodzaj, napęd, udźwig), pola zależne od rodzaju, progi 250 i 1000 kg,
// błędny udźwig i wynik bez JavaScriptu. Narzędzie nie liczy dat, więc test nie zależy od dnia.
const ADRES = adresNarzedzia('czy-potrzebne-uprawnienia-udt');

test.beforeEach(async ({ page }) => {
  await page.goto(ADRES);
});

test('start: paleciak elektryczny wymaga zaświadczenia na 10 lat', async ({ page }) => {
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Potrzebne');
  await expect(page.locator('[data-w="status"]')).toHaveText(/Ważne\s10\slat/);
  await expect(page.getByLabel('Udźwig z tabliczki (kg)')).toBeVisible();
});

test('paleciak 200 kg: potrzebne z uwagą o § 4 ust. 1 rozporządzenia bhp', async ({ page }) => {
  await page.getByLabel('Udźwig z tabliczki (kg)').fill('200');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Potrzebne');
  await expect(page.locator('[data-w="uwagi"]')).toContainText(/wymóg\sz\sustawy\snie\sdziała/);
});

test('ukryty napęd „ręczny” z wciągnika nie zmienia wyniku dźwigu', async ({ page }) => {
  await page.getByLabel('Rodzaj maszyny').selectOption('wciagnik');
  await page.getByLabel('Napęd', { exact: true }).selectOption('reczny');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Niepotrzebne');
  await page.getByLabel('Rodzaj maszyny').selectOption('dzwig');
  await page.getByLabel('Rodzaj dźwigu').selectOption('szpitalny');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Potrzebne');
  await page.getByLabel('Rodzaj dźwigu').selectOption('budowlany');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Potrzebne');
});

test('ukryte „przewozi ludzi” z wciągnika nie zmienia wyniku wyciągu', async ({ page }) => {
  await page.getByLabel('Rodzaj maszyny').selectOption('wciagnik');
  await page.getByLabel('Udźwig z tabliczki (kg)').fill('200');
  await page.getByLabel('Przewozi też ludzi (np. kabina)').check();
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Potrzebne');
  await page.getByLabel('Rodzaj maszyny').selectOption('wyciag');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Niepotrzebne');
});

test('paleciak z ręczną pompą: niepotrzebne, § 4 ust. 2 i 18 lat', async ({ page }) => {
  await page.getByLabel('Ręczną pompą (dyszlem)').check();
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Niepotrzebne');
  await expect(page.locator('[data-w="zamiast"]')).toContainText(/§\s4\sust\.\s2/);
  await expect(page.locator('[data-w="zamiast"]')).toContainText(/18\slat/);
  await expect(page.locator('[data-wiersz="oplata"]')).toBeHidden();
  await expect(page.getByLabel('Udźwig z tabliczki (kg)')).toBeHidden();
});

test('wciągnik jednofazowy: 1000 kg niepotrzebne, 1001 kg potrzebne', async ({ page }) => {
  await page.getByLabel('Rodzaj maszyny').selectOption('wciagnik');
  await expect(page.getByRole('group', { name: 'Podnoszenie wideł' })).toBeHidden();
  await page.getByLabel('Napęd', { exact: true }).selectOption('jednofazowy');
  await page.getByLabel('Udźwig z tabliczki (kg)').fill('1000');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Niepotrzebne');
  await page.getByLabel('Udźwig z tabliczki (kg)').fill('1001');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Potrzebne');
  await expect(page.locator('[data-w="kategoria"]')).toHaveText(/Wciągniki\si\swciągarki\sogólnego\sprzeznaczenia/);
});

test('wyciąg towarowy: 250 kg niepotrzebne, 251 kg potrzebne', async ({ page }) => {
  await page.getByLabel('Rodzaj maszyny').selectOption('wyciag');
  await page.getByLabel('Udźwig z tabliczki (kg)').fill('250');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Niepotrzebne');
  await page.getByLabel('Udźwig z tabliczki (kg)').fill('251');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Potrzebne');
});

test('podnośnik nożycowy: 5 lat; winda załadowcza: tylko konserwator', async ({ page }) => {
  await page.getByLabel('Rodzaj maszyny').selectOption('podest');
  await expect(page.locator('[data-w="status"]')).toHaveText(/Ważne\s5\slat/);
  await page.getByLabel('Rodzaj podestu').selectOption('zaladowczy');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Niepotrzebne');
  await expect(page.locator('[data-w="konserwacja"]')).toContainText(/przejezdne\soraz\szaładowcze.*5\slat/);
});

test('suwnica „nie wiem”: kategoria 5-letnia z uwagą', async ({ page }) => {
  await page.getByLabel('Rodzaj maszyny').selectOption('suwnica');
  await page.getByLabel('Przeznaczenie').selectOption('nie-wiem');
  await expect(page.locator('[data-w="status"]')).toHaveText(/Ważne\s5\slat/);
  await expect(page.locator('[data-w="uwagi"]')).toContainText('specjalnego przeznaczenia');
});

test('błędny udźwig: komunikat i brak werdyktu', async ({ page }) => {
  await page.getByLabel('Rodzaj maszyny').selectOption('ukladnica');
  await page.getByLabel('Udźwig z tabliczki (kg)').fill('0');
  await expect(page.locator('[data-blad="udzwig"]')).toBeVisible();
  await expect(page.getByLabel('Udźwig z tabliczki (kg)')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('—');
});

test.describe('bez JavaScriptu', () => {
  test.use({ javaScriptEnabled: false });
  test('wynik startowy i tabela typowych maszyn są w HTML', async ({ page }) => {
    await page.goto(ADRES);
    await expect(page.locator('[data-w="werdykt"]')).toHaveText('Potrzebne');
    await expect(page.locator('#typowe-maszyny ~ .tabela tr', { hasText: 'Stół podnośny' }).first()).toContainText('niepotrzebne');
    await expect(page.locator('#typowe-maszyny ~ .tabela tr', { hasText: 'Ładowarka teleskopowa' }).first()).toContainText(/5\slat/);
  });
});
