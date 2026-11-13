import { expect, test, type Page } from '@playwright/test';
import { adresNarzedzia } from '../../src/data/narzedzia';

// Czas jazdy kierowcy: przykład bez naruszeń, przerwa po 4,5 h, jazda ponad 10 h, odpoczynek za późno, linia do 50 km,
// pora nocna i błędne dane. Wartości z niezależnego rachunku w Pythonie (src/lib/narzedzia/czas-jazdy.test.ts).
const ADRES = adresNarzedzia('czas-jazdy-kierowcy');

async function wpisz(page: Page, start: string, wiersze: [string, string][]) {
  await page.getByRole('button', { name: 'Wyczyść okresy' }).click();
  await page.locator('#cj-start').fill(start);
  for (const [i, [rodzaj, godzina]] of wiersze.entries()) {
    await page.locator(`#cj-r${i}`).selectOption({ label: rodzaj });
    await page.locator(`#cj-d${i}`).fill(godzina);
  }
}

test.beforeEach(async ({ page }) => {
  await page.goto(ADRES);
});

test('przykład: bez naruszeń, przerwa najpóźniej o 16:45, odpoczynek do 19:00', async ({ page }) => {
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Bez naruszeń');
  await expect(page.locator('[data-w="naruszenia"]')).toBeHidden();
  await expect(page.locator('[data-w="przerwa"]')).toHaveText(/najpóźniej\so\s16:45:\s45\smin/);
  await expect(page.locator('[data-w="dzien"]')).toHaveText(/^8\sh\s45\smin\sz\s9\sh,\szostało\s15\smin/);
  await expect(page.locator('[data-w="odpoczynek"]')).toHaveText(/najpóźniej\so\s19:00\s\(11\sh\);\sskrócony\s\(9\sh\):\so\s21:00/);
  await expect(page.locator('[data-w="tydzien"]')).toHaveText(/40\sh\s45\smin\sz\s56\sh;\sw\sdwóch\stygodniach\s80\sh\s45\smin\sz\s90\sh;\szostało\s9\sh\s15\smin/);
  await expect(page.locator('[data-w="uwaga"]')).toContainText(/Odpoczynek\stygodniowy\szacznij\snajpóźniej/);
});

test('noc: przerwa należała się o 2:30 i ponad 10 h pracy w porze nocnej', async ({ page }) => {
  await wpisz(page, '22:00', [['Jazda', '02:45'], ['Przerwa', '03:30'], ['Jazda', '07:00'], ['Inna praca', '09:00']]);
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('2 naruszenia');
  const lista = page.locator('[data-w="naruszenia"] li');
  await expect(lista).toHaveCount(2);
  await expect(lista.nth(0)).toContainText(/najpóźniej\so\s2:30\snastępnego\sdnia/);
  await expect(lista.nth(1)).toContainText(/10\sh\s30\smin/);
  await page.locator('#cj-pojazd').selectOption({ label: 'Bus 2,5–3,5 t za granicą' });
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('1 naruszenie');
});

test('pora nocna 0:00–4:00: zmiana od 5:00 bez limitu 10 h, ale 10 h 30 min jazdy to naruszenie', async ({ page }) => {
  await wpisz(page, '05:00', [['Jazda', '09:30'], ['Przerwa', '10:15'], ['Jazda', '14:45'], ['Przerwa', '15:30'], ['Jazda', '17:00']]);
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('2 naruszenia');
  await page.locator('#cj-noc').selectOption({ label: '0:00–4:00' });
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('1 naruszenie');
  await expect(page.locator('[data-w="naruszenia"] li')).toContainText(/Dzienna\sjazda\s10\sh\s30\smin/);
});

test('linia do 50 km: brakuje 10 min przerw', async ({ page }) => {
  await page.locator('#cj-pojazd').selectOption({ label: 'Linia regularna do 50 km' });
  await wpisz(page, '06:00', [['Jazda', '09:00'], ['Przerwa', '09:10'], ['Jazda', '12:00'], ['Przerwa', '12:20'], ['Jazda', '14:00']]);
  await expect(page.locator('[data-w="przerwa"]')).toHaveText(/wykorzystano\s20\smin,\sbrakuje\s10\smin/);
  await expect(page.locator('[data-w="naruszenia"] li')).toContainText('art. 31b');
});

test('błędne dane: brak okresów i zła liczba godzin w tygodniu', async ({ page }) => {
  await page.getByRole('button', { name: 'Wyczyść okresy' }).click();
  await expect(page.locator('[data-blad="okresy"]')).toBeVisible();
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Wpisz okresy');
  await page.locator('#cj-d0').fill('08:00');
  await expect(page.locator('[data-blad="okresy"]')).toBeHidden();
  await page.locator('#cj-tydzien').fill('abc');
  await expect(page.locator('[data-blad="tydzien"]')).toBeVisible();
  await expect(page.locator('#cj-tydzien')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.locator('[data-w="tydzien"]')).toHaveText('wpisz jazdę z tego tygodnia');
});

test('odpoczynek wpisany na końcu: bez naruszenia, przerwa nie dotyczy; odpoczynek w środku: błąd przy wierszu', async ({ page }) => {
  await wpisz(page, '06:00', [['Jazda', '10:30'], ['Przerwa', '11:15'], ['Jazda', '15:45'], ['Odpoczynek', '07:00']]);
  await expect(page.locator('[data-w="werdykt"]')).toHaveText('Bez naruszeń');
  await expect(page.locator('[data-w="przerwa"]')).toHaveText(/nie\sdotyczy:\sod\s15:45\sodpoczynek\sdobowy/);
  await expect(page.locator('[data-w="odpoczynek"]')).toHaveText(/od\s15:45:\s14\sh\s15\smin\sw\s24\sh/);
  await page.locator('#cj-r4').selectOption({ label: 'Jazda' });
  await page.locator('#cj-d4').fill('08:00');
  await expect(page.locator('[data-blad="okresy"]')).toHaveText(/Odpoczynek\sdobowy\swpisz\sjako\sostatni\sokres/);
  await expect(page.locator('#cj-d4')).toHaveAttribute('aria-invalid', 'true');
});
