import { expect, test } from '@playwright/test';
import { adresNarzedzia } from '../../src/data/narzedzia';

// Ulga na dzieci (art. 27f ustawy o PIT; wartości z niezależnego rachunku w Pythonie): troje dzieci, drugie od czerwca,
// trzecie od października → 2260,74 zł; jedno dziecko bez małżeństwa i 56 000,01 zł → bez ulgi; troje, podatek 0 zł,
// składki 1000 zł → zwrot 1000 zł, przepada 3224,12 zł.
test.beforeEach(async ({ page }) => {
  await page.goto(adresNarzedzia('ulga-na-dzieci'));
  await page.getByLabel('Rok podatkowy').selectOption('2025');
});

test('dzieci w części roku', async ({ page }) => {
  await page.getByLabel('Liczba dzieci').selectOption('3');
  await page.getByLabel('Dziecko 2: od').selectOption('6');
  await page.getByLabel('Dziecko 3: od').selectOption('10');
  await expect(page.locator('[data-w="przysluguje"]')).toHaveText(/^2\s?260,74\szł$/);
  await page.getByLabel('Twoja część ulgi (%)').fill('50');
  await expect(page.locator('[data-w="przysluguje"]')).toHaveText(/^1\s?130,37\szł$/);
});

test('jedno dziecko: limit dochodów', async ({ page }) => {
  await page.getByLabel('Liczba dzieci').selectOption('1');
  await page.getByLabel('Sytuacja w roku').selectOption('inna');
  await page.getByLabel('Dochód minus składki (zł)').fill('56000');
  await expect(page.locator('[data-w="przysluguje"]')).toHaveText(/^1\s?112,04\szł$/);
  await page.getByLabel('Dochód minus składki (zł)').fill('56000,01');
  await expect(page.locator('[data-w="przysluguje"]')).toHaveText(/^0,00\szł$/);
  await expect(page.locator('[data-w="opis"]')).toContainText('bez ulgi');
  await page.getByLabel('Jedno dziecko z orzeczeniem o niepełnosprawności').check();
  await expect(page.locator('[data-w="przysluguje"]')).toHaveText(/^1\s?112,04\szł$/);
});

test('zwrot ponad podatek do wysokości składek', async ({ page }) => {
  await page.getByLabel('Liczba dzieci').selectOption('3');
  await page.getByLabel('Podatek według skali (zł)').fill('0');
  await page.getByLabel('Składki społeczne i zdrowotne (zł)').fill('1000');
  await expect(page.locator('[data-w="zwrot"]')).toHaveText(/^1\s?000,00\szł$/);
  await expect(page.locator('[data-w="przepada"]')).toHaveText(/^3\s?224,12\szł$/);
});

test('błędne miesiące', async ({ page }) => {
  await page.getByLabel('Dziecko 1: od').selectOption('9');
  await page.getByLabel('Dziecko 1: do').selectOption('3');
  await expect(page.locator('[data-blad="dane"]')).toBeVisible();
  await expect(page.locator('[data-w="przysluguje"]')).toHaveText('—');
});
