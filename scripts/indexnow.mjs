// Zgłasza nowe i zmienione adresy do IndexNow. Tylko po wdrożeniu produkcji, gdy adresy już działają.
// Użycie:
//   npm run indexnow -- /oee-bez-mitow /dzial/produkcja   (wybrane adresy)
//   npm run indexnow -- --mapa                            (wszystkie adresy z dist/sitemap-0.xml, np. w dniu startu)
//   dodaj --proba, żeby tylko wypisać zgłoszenie bez wysyłania.
import { readdirSync, readFileSync } from 'node:fs';
import { ADRES } from '../src/lib/srodowisko.mjs';
import { PLIK_KLUCZA, PUNKT_ZGLOSZEN, adresyDoZgloszenia, adresyZMapy, zgloszenie } from '../src/lib/indexnow.mjs';

const plikKlucza = readdirSync(new URL('../public/', import.meta.url)).find((f) => PLIK_KLUCZA.test(f));
if (!plikKlucza) {
  console.error('Brak pliku klucza IndexNow w public/ (32 znaki szesnastkowe + .txt).');
  process.exit(1);
}
const klucz = plikKlucza.replace('.txt', '');
const argumenty = process.argv.slice(2);
const proba = argumenty.includes('--proba');
const wpisy = argumenty.includes('--mapa')
  ? adresyZMapy(readFileSync(new URL('../dist/sitemap-0.xml', import.meta.url), 'utf8'))
  : argumenty.filter((a) => !a.startsWith('--'));

let tresc;
try {
  tresc = zgloszenie(adresyDoZgloszenia(wpisy, ADRES), klucz, ADRES);
} catch (e) {
  console.error(`${e.message}. Podaj adresy, np. npm run indexnow -- /oee-bez-mitow, albo --mapa.`);
  process.exit(1);
}
if (proba) {
  console.log(JSON.stringify(tresc, null, 2));
  process.exit(0);
}
const odpowiedz = await fetch(PUNKT_ZGLOSZEN, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify(tresc),
});
// 200 i 202 oznaczają przyjęcie zgłoszenia; 403 to zwykle klucz niedostępny pod adresem z keyLocation.
console.log(`IndexNow: HTTP ${odpowiedz.status} dla ${tresc.urlList.length} adresów`);
if (![200, 202].includes(odpowiedz.status)) {
  console.error(await odpowiedz.text());
  process.exit(1);
}
