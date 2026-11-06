// Test produkcji po wdrożeniu (F8): żywa strona odpowiada tak, jak zakłada build. Bez zależności, tylko fetch.
// Użycie:
//   npm run test:produkcja                                  (https://rytmhali.pl)
//   npm run test:produkcja -- --adres <adres podglądu> --podglad   (podgląd gałęzi: wszędzie noindex)
//   dodaj --domeny, żeby sprawdzić też przekierowania http, www i rytmhali.com (po konfiguracji DNS).
// Sprawdza: nagłówki bezpieczeństwa, indeksowanie, robots.txt, mapę strony (każdy adres 200), klucz IndexNow,
// 404, punkty formularzy (GET 405, pułapka bez wywołania dostawcy), po starcie także RSS i llms.txt.
import { readdirSync } from 'node:fs';
import { PLIK_KLUCZA } from '../src/lib/indexnow.mjs';
import { ADRES, START } from '../src/lib/srodowisko.mjs';

const argumenty = process.argv.slice(2);
const opcja = (n) => (argumenty.includes(n) ? argumenty[argumenty.indexOf(n) + 1] : undefined);
const baza = (opcja('--adres') ?? ADRES).replace(/\/$/, '');
const podglad = argumenty.includes('--podglad');
const bledy = [];
const ok = [];
const sprawdz = (warunek, opis) => (warunek ? ok : bledy).push(opis);
const adresow = (n) => `${n} ${n === 1 ? 'adres' : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? 'adresy' : 'adresów'}`;
const pobierz = (sciezka, opcje = {}) => fetch(sciezka.startsWith('http') ? sciezka : baza + sciezka, { redirect: 'manual', ...opcje });

// Strona główna: nagłówki i indeksowanie
const glowna = await pobierz('/');
sprawdz(glowna.status === 200, `/ odpowiada 200 (jest ${glowna.status})`);
sprawdz(/max-age=\d{8,}/.test(glowna.headers.get('strict-transport-security') ?? ''), 'HSTS z max-age co najmniej rok');
for (const n of ['x-content-type-options', 'x-frame-options', 'referrer-policy', 'permissions-policy', 'content-security-policy']) sprawdz(glowna.headers.has(n), `nagłówek ${n}`);
const html = await glowna.text();
sprawdz(/<meta http-equiv="content-security-policy"/i.test(html), 'CSP z hashami w <meta>');
const noindex = /noindex/.test(glowna.headers.get('x-robots-tag') ?? '') || /<meta name="robots" content="noindex/.test(html);
sprawdz(podglad ? noindex : !noindex, podglad ? 'podgląd: noindex' : 'produkcja: strona główna bez noindex');

// robots.txt i mapa strony
const robots = await (await pobierz('/robots.txt')).text();
sprawdz(/Sitemap: https:\/\/rytmhali\.pl\/sitemap-index\.xml/.test(robots) && /Disallow: \/admin\//.test(robots), 'robots.txt wskazuje mapę i zamyka panel');
const mapa = await pobierz('/sitemap-0.xml');
sprawdz(mapa.status === 200, 'mapa strony sitemap-0.xml');
const adresy = [...(await mapa.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]).slice(0, 300);
const zle = [];
for (const a of adresy) {
  const odp = await pobierz(a.replace(ADRES, baza), { method: 'HEAD' });
  if (odp.status !== 200) zle.push(`${a} (${odp.status})`);
}
sprawdz(adresy.length > 0 && !zle.length, `każdy adres z mapy strony odpowiada 200 (${adresow(adresy.length)}${zle.length ? `; złe: ${zle.slice(0, 5).join(', ')}` : ''})`);

// IndexNow, 404, pamięć podręczna zasobów
const klucz = readdirSync(new URL('../public/', import.meta.url)).find((f) => PLIK_KLUCZA.test(f));
sprawdz(klucz && (await (await pobierz(`/${klucz}`)).text()) === klucz.replace('.txt', ''), 'klucz IndexNow dostępny publicznie');
const brak = await pobierz('/nie-ma-takiej-strony-test');
sprawdz(brak.status === 404, `nieistniejący adres: 404 (jest ${brak.status})`);
const zasob = html.match(/\/_astro\/[^"']+\.(?:css|js|woff2)/)?.[0];
if (zasob) sprawdz(/immutable/.test((await pobierz(zasob)).headers.get('cache-control') ?? ''), 'zasoby /_astro/ z Cache-Control immutable');

// Formularze: GET 405, pułapka udaje sukces bez wywołania dostawcy
sprawdz((await pobierz('/api/newsletter')).status === 405, 'GET /api/newsletter: 405');
const pulapka = await pobierz('/api/newsletter', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded', Origin: new URL(baza).origin },
  body: 'email=test-produkcji%40example.com&zgoda=tak&strona=pulapka',
});
sprawdz(pulapka.status === 303 && /\/newsletter\/potwierdz$/.test(pulapka.headers.get('location') ?? ''), 'pułapka formularza: 303 na /newsletter/potwierdz');

// Po starcie: RSS i llms.txt
if (START || podglad) {
  for (const s of ['/rss.xml', '/llms.txt']) sprawdz((await pobierz(s)).status === 200, `${s} odpowiada 200`);
}

// Domeny (po konfiguracji DNS)
if (argumenty.includes('--domeny')) {
  for (const [z, opis] of [['http://rytmhali.pl/', 'http → https'], ['https://www.rytmhali.pl/', 'www → bez www'], ['https://rytmhali.com/', 'rytmhali.com → rytmhali.pl']]) {
    try {
      const odp = await fetch(z, { redirect: 'manual' });
      sprawdz([301, 308].includes(odp.status) && (odp.headers.get('location') ?? '').startsWith('https://rytmhali.pl'), `${opis} (stałe przekierowanie)`);
    } catch {
      sprawdz(false, `${opis}: brak odpowiedzi`);
    }
  }
}

for (const o of ok) console.log(`✓ ${o}`);
for (const b of bledy) console.error(`✗ ${b}`);
console.log(`\nTest produkcji (${baza}${podglad ? ', podgląd' : ''}): ${ok.length} w porządku, ${bledy.length} błędów.`);
process.exit(bledy.length ? 1 : 0);
