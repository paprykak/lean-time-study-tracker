// Zrzuty ekranu do raportu po fazie: komputer (1440 px), telefon (Pixel 7) i fokus klawiatury.
// Długie strony są dzielone na części, żeby dało się je oglądać na telefonie. Format JPEG (mniejsze pliki w gicie).
// Użycie: npm run zrzuty -- [katalog] [adresy...]   (domyślnie raporty/zrzuty; strony: / /styleguide /404)
// Wymaga działającego podglądu: npx astro preview --port 4322 (albo BASE_URL=https://… dla produkcji).
import { chromium, devices } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const BASE = process.env.BASE_URL ?? 'http://localhost:4322';
const [katalog = 'raporty/zrzuty', ...adresy] = process.argv.slice(2);
const STRONY = adresy.length ? adresy : ['/', '/styleguide', '/404'];
const SKALA = Number(process.env.SKALA ?? 2);
const CZESC = 1800; // wysokość jednej części w px CSS
const nazwa = (adres) => (adres === '/' ? 'glowna' : adres.replace(/^\//, '').replace(/\//g, '-'));

mkdirSync(katalog, { recursive: true });
const przegladarka = await chromium.launch();
let licznik = 0;

async function otworz(kontekstOpcje, adres) {
  const kontekst = await przegladarka.newContext({ locale: 'pl-PL', timezoneId: 'Europe/Warsaw', reducedMotion: 'reduce', ...kontekstOpcje });
  const strona = await kontekst.newPage();
  await strona.goto(BASE + adres, { waitUntil: 'networkidle' });
  await strona.evaluate(() => document.fonts.ready);
  return { kontekst, strona };
}

async function calaStrona(kontekstOpcje, adres, przedrostek) {
  const { kontekst, strona } = await otworz(kontekstOpcje, adres);
  const { szer, wys } = await strona.evaluate(() => ({ szer: document.documentElement.clientWidth, wys: document.documentElement.scrollHeight }));
  const czesci = Math.ceil(wys / CZESC);
  for (let i = 0; i < czesci; i++) {
    const y = i * CZESC;
    const plik = czesci === 1 ? `${przedrostek}.jpg` : `${przedrostek}-${String(i + 1).padStart(2, '0')}.jpg`;
    await strona.screenshot({ path: join(katalog, plik), fullPage: true, clip: { x: 0, y, width: szer, height: Math.min(CZESC, wys - y) }, type: 'jpeg', quality: 80 });
    licznik++;
  }
  await kontekst.close();
}

const KOMPUTER = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: SKALA };
const TELEFON = { ...devices['Pixel 7'], deviceScaleFactor: SKALA };

for (const adres of STRONY) {
  await calaStrona(KOMPUTER, adres, `${nazwa(adres)}-komputer`);
  await calaStrona(TELEFON, adres, `${nazwa(adres)}-telefon`);
}

// Klawiatura: pierwszy Tab pokazuje „Przejdź do treści”; dalsze przechodzą przez nagłówek z widocznym fokusem.
async function klawiatura(adres, tabow, plik) {
  const { kontekst, strona } = await otworz(KOMPUTER, adres);
  for (let i = 0; i < tabow; i++) await strona.keyboard.press('Tab');
  await strona.screenshot({ path: join(katalog, plik), type: 'jpeg', quality: 85, clip: { x: 0, y: 0, width: 1440, height: 420 } });
  licznik++;
  await kontekst.close();
}
const wzory = STRONY.includes('/styleguide') ? '/styleguide' : STRONY[0];
// Kolejność Tab na komputerze: 1 „Przejdź do treści”, 2–5 pasek górny, 6 logo, 7 pole wyszukiwania, 8 lupa, 9 newsletter, 10 pierwszy dział.
await klawiatura(wzory, 1, 'klawiatura-1-przejdz-do-tresci.jpg');
await klawiatura(wzory, 6, 'klawiatura-2-logo.jpg');
await klawiatura(wzory, 7, 'klawiatura-3-wyszukiwarka.jpg');
await klawiatura(wzory, 10, 'klawiatura-4-menu-dzialow.jpg');

// Fokus na karcie (obrys całej karty) w sekcji kart strony wzorów.
if (STRONY.includes('/styleguide')) {
  const { kontekst, strona } = await otworz(KOMPUTER, '/styleguide');
  const karta = strona.locator('section[aria-labelledby="karty"] article.karta').nth(4);
  await karta.locator('.karta-link').focus();
  await karta.scrollIntoViewIfNeeded();
  await strona.screenshot({ path: join(katalog, 'klawiatura-5-fokus-karty.jpg'), type: 'jpeg', quality: 85 });
  licznik++;
  await kontekst.close();
}

await przegladarka.close();
console.log(`Zrzuty w ${katalog}: ${licznik} plików.`);
