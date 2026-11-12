// Kontrola SEO i bezpieczeństwa zbudowanej strony (dist/). Uruchamiana po `astro build` w `npm run check:szybki`,
// także w buildzie Cloudflare: błąd zatrzymuje wdrożenie. Bez zależności: proste parsowanie HTML.
// Wzór: scripts/seo-check.mjs z patrykkorpyta.pl, rozszerzony o linki wewnętrzne, alt, CSP i tryb podglądu.
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { ADRES, FORMULARZE, PODGLAD, PORTAL, START, TESTOWE } from '../src/lib/srodowisko.mjs';
import { POLITYKI } from '../src/lib/polityki.mjs';
import { PLIK_KLUCZA } from '../src/lib/indexnow.mjs';

const DIST = new URL('../dist/', import.meta.url).pathname;
// Strony, które celowo nie trafiają do wyszukiwarek: techniczne, wyniki wyszukiwania, strony wzorów.
const NOINDEX_OK = new Set(['/404', '/410', '/styleguide', '/szukaj', '/newsletter/potwierdz', '/newsletter/potwierdzono', '/newsletter/wypisano', '/newsletter/blad', '/kontakt/wyslano', '/kontakt/blad']);
// Noindex z danych: listy poniżej progu artykułów (src/lib/mapa.mjs, PROGI) i artykuły z polem noindex.
const NOINDEX_Z_DANYCH = /^\/(dzial|temat|autor)\//;
// Pole zastępcze zamiast zdjęcia wolno pokazać tylko na stronie wzorów (zasady wyglądu: bez szarych prostokątów na produkcji).
const POLE_ZASTEPCZE_OK = new Set(['/styleguide']);
// Trasy z planu kolejnych faz, których jeszcze nie ma: link do nich to ostrzeżenie, nie błąd. Pusta od F3.
const PLANOWANE = [];
// Adresy fikcyjnych artykułów na stronie wzorów (src/data/przyklady.ts).
const PRZYKLADOWE = /^\/przyklad-/;
// Prawdziwa produkcja (nie podgląd i nie build testowy): bez treści testowych i projektów tekstów.
const PRODUKCJA = !PODGLAD && !TESTOWE;
const POMIN_KATALOGI = new Set(['_astro', 'admin']);

const bledy = [];
const ostrzezenia = [];
const planowane = new Map();

function plikiHtml(katalog) {
  return readdirSync(katalog).flatMap((nazwa) => {
    const pelna = join(katalog, nazwa);
    if (statSync(pelna).isDirectory()) return POMIN_KATALOGI.has(nazwa) ? [] : plikiHtml(pelna);
    return nazwa.endsWith('.html') ? [pelna] : [];
  });
}

const adresPliku = (plik) => {
  const sciezka = '/' + relative(DIST, plik).split(sep).join('/').replace(/\.html$/, '').replace(/(^|\/)index$/, '');
  return sciezka === '/' ? '/' : sciezka.replace(/\/$/, '');
};
const pelny = (adres) => ADRES + (adres === '/' ? '/' : adres);

/** Czy adres wewnętrzny prowadzi do zbudowanego pliku (strona albo zasób). */
function istnieje(adres) {
  const sciezka = decodeURI(adres.split(/[?#]/)[0]);
  if (sciezka === '/' || sciezka === '') return existsSync(join(DIST, 'index.html'));
  const bez = sciezka.replace(/\/$/, '');
  return [join(DIST, bez), join(DIST, `${bez}.html`), join(DIST, bez, 'index.html')].some((p) => existsSync(p) && statSync(p).isFile());
}

const mapa = new Set(
  readdirSync(DIST)
    .filter((f) => /^sitemap-\d+\.xml$/.test(f))
    .flatMap((f) => [...readFileSync(join(DIST, f), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])),
);

const strony = plikiHtml(DIST);
const tytuly = new Map();
const opisy = new Map();

for (const plik of strony) {
  const adres = adresPliku(plik);
  const html = readFileSync(plik, 'utf8');
  const gdzie = `${adres}:`;
  const noindex = /<meta name="robots" content="[^"]*noindex/.test(html);

  // Tytuł, opis, H1
  const tytul = html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim();
  if (!tytul) bledy.push(`${gdzie} brak <title>`);
  else if (tytul.length > 65) ostrzezenia.push(`${gdzie} tytuł ma ${tytul.length} znaków (zalecane do 60)`);
  const opis = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  if (!opis) bledy.push(`${gdzie} brak meta description`);
  else if (opis.length > 165) ostrzezenia.push(`${gdzie} opis ma ${opis.length} znaków (zalecane do 155)`);
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) bledy.push(`${gdzie} liczba nagłówków H1: ${h1} (ma być 1)`);
  if (!/<html lang="pl"[\s>]/.test(html)) bledy.push(`${gdzie} brak <html lang="pl">`);

  // Dane strukturalne: poprawny JSON
  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      JSON.parse(json);
    } catch {
      bledy.push(`${gdzie} niepoprawny JSON-LD`);
    }
  }

  // Obrazy: każdy <img> ma atrybut alt (pusty tylko dla ozdobnych)
  // Pusty alt Astro zapisuje skrótem (`alt`), a HTML traktuje go jak alt="".
  for (const [img] of html.matchAll(/<img\b[^>]*>/g)) if (!/\salt(?:="|[\s>])/.test(img)) bledy.push(`${gdzie} obraz bez atrybutu alt: ${img.slice(0, 90)}`);

  // Podwójna kropka po skrócie daty („2026 r..”): data z dataPoPolsku kończy się kropką, więc zdanie nie dostaje drugiej.
  const tekst = html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<[^>]+>/g, ' ');
  if (/\sr\.\.(?!\.)/.test(tekst)) bledy.push(`${gdzie} podwójna kropka po „r.” w tekście strony`);

  // Pole zastępcze zamiast zdjęcia tylko na stronie wzorów
  if (html.includes('data-brak-zdjecia') && !POLE_ZASTEPCZE_OK.has(adres)) bledy.push(`${gdzie} pole zastępcze zamiast zdjęcia (zasady wyglądu: prawdziwe zdjęcia na produkcji)`);

  // CSP: każdy skrypt i styl w kodzie strony ma swój hash w <meta http-equiv="content-security-policy">
  const csp = html.match(/<meta http-equiv="content-security-policy" content="([^"]*)"/)?.[1];
  if (!csp) bledy.push(`${gdzie} brak CSP w <meta>`);
  else {
    // 'wasm-unsafe-eval' (tylko WebAssembly, strona wyszukiwarki) jest dozwolone; 'unsafe-eval' i 'unsafe-inline' nie.
    if (/'unsafe-eval'|'unsafe-inline'/.test(csp)) bledy.push(`${gdzie} CSP zawiera 'unsafe-eval' albo 'unsafe-inline'`);
    if (/'wasm-unsafe-eval'/.test(csp) && adres !== '/szukaj') bledy.push(`${gdzie} 'wasm-unsafe-eval' poza stroną wyszukiwarki`);
    const hash = (tresc) => `'sha256-${createHash('sha256').update(tresc).digest('base64')}'`;
    for (const [, atrybuty, tresc] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
      if (/\bsrc=/.test(atrybuty) || /application\/ld\+json/.test(atrybuty) || !tresc.trim()) continue;
      if (!csp.includes(hash(tresc))) bledy.push(`${gdzie} skrypt bez hasha w CSP (przeglądarka go zablokuje)`);
    }
    for (const [, tresc] of html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)) if (!csp.includes(hash(tresc))) bledy.push(`${gdzie} styl bez hasha w CSP`);
    if (/\sstyle="/.test(html.replace(/<svg[\s\S]*?<\/svg>/g, ''))) bledy.push(`${gdzie} atrybut style="" (CSP go zablokuje; użyj klasy)`);
  }

  // Linki wewnętrzne prowadzą do istniejących stron
  for (const [, href] of html.matchAll(/<a\b[^>]*\shref="(\/[^"#]*)(?:#[^"]*)?"/g)) {
    if (href.startsWith('//') || istnieje(href)) continue;
    if (adres === '/styleguide' && PRZYKLADOWE.test(href)) continue;
    if (PLANOWANE.some((w) => w.test(href.split('?')[0]))) planowane.set(href, (planowane.get(href) ?? 0) + 1);
    else bledy.push(`${gdzie} link do nieistniejącej strony ${href}`);
  }

  // Okładka udostępnień istnieje
  const og = html.match(/<meta property="og:image" content="([^"]*)"/)?.[1];
  if (og?.startsWith(ADRES) && !istnieje(og.slice(ADRES.length))) bledy.push(`${gdzie} og:image ${og} nie istnieje w dist/`);

  // Produkcja: bez treści testowych; projekt strony stałej blokuje start (przed startem tylko ostrzega).
  if (PRODUKCJA && (adres.startsWith('/testowy-') || html.includes('Tekst testowy (fikcyjny)'))) bledy.push(`${gdzie} treść testowa na produkcji`);
  if (PRODUKCJA && html.includes('data-projekt')) (START ? bledy : ostrzezenia).push(`${gdzie} projekt tekstu do akceptacji Patryka${START ? '' : ' (przed startem i przed uruchomieniem zapisu na listę musi być zatwierdzony)'}`);
  // Formularz bez skonfigurowanej usługi kończy się stroną błędu: na produkcji go nie pokazujemy (FORMULARZE).
  // Wyjątek: strona wzorów (noindex) pokazuje stany formularza dla redakcji.
  for (const [rodzaj, dziala] of Object.entries(FORMULARZE)) {
    if (PRODUKCJA && !dziala && adres !== '/styleguide' && html.includes(`action="/api/${rodzaj}"`)) bledy.push(`${gdzie} formularz /api/${rodzaj} bez skonfigurowanej usługi (FORMULARZE w srodowisko.mjs)`);
  }

  if (PODGLAD) {
    if (!noindex) bledy.push(`${gdzie} build podglądu bez noindex`);
    continue;
  }

  if (noindex) {
    const artykul = /<meta property="og:type" content="article"/.test(html);
    if (!NOINDEX_OK.has(adres) && !NOINDEX_Z_DANYCH.test(adres) && !artykul) bledy.push(`${gdzie} ma noindex, a nie jest na liście wyjątków`);
    if (mapa.has(pelny(adres))) bledy.push(`${gdzie} ma noindex, a jest w mapie strony`);
    continue;
  }

  if (tytul) tytuly.set(tytul, [...(tytuly.get(tytul) ?? []), adres]);
  if (opis) opisy.set(opis, [...(opisy.get(opis) ?? []), adres]);

  const kanoniczny = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
  const oczekiwany = pelny(adres);
  if (!kanoniczny) bledy.push(`${gdzie} brak adresu kanonicznego`);
  else if (kanoniczny !== oczekiwany) bledy.push(`${gdzie} kanoniczny ${kanoniczny}, oczekiwany ${oczekiwany}`);
  const ogUrl = html.match(/<meta property="og:url" content="([^"]*)"/)?.[1];
  if (ogUrl && ogUrl !== oczekiwany) bledy.push(`${gdzie} og:url ${ogUrl}, oczekiwany ${oczekiwany}`);
  if (!mapa.has(oczekiwany)) bledy.push(`${gdzie} brak w mapie strony`);
}

for (const [t, adresy] of tytuly) if (adresy.length > 1) bledy.push(`powtórzony tytuł „${t}”: ${adresy.join(', ')}`);
for (const [o, adresy] of opisy) if (adresy.length > 1) bledy.push(`powtórzony opis „${o.slice(0, 60)}…”: ${adresy.join(', ')}`);

const zbudowane = new Set(strony.map((f) => pelny(adresPliku(f))));
for (const loc of mapa) if (!zbudowane.has(loc)) bledy.push(`mapa strony: ${loc} nie ma odpowiadającej strony`);

const naglowki = existsSync(join(DIST, '_headers')) ? readFileSync(join(DIST, '_headers'), 'utf8') : '';
if (!naglowki) bledy.push('brak dist/_headers');
else if (PODGLAD && !/X-Robots-Tag: noindex/.test(naglowki.split('\n\n')[1] ?? '')) bledy.push('build podglądu: _headers bez X-Robots-Tag: noindex dla /*');

// Zasady redakcji w danych organizacji (src/lib/polityki.mjs): strona istnieje i ma śródtytuł z kotwicą.
if (PORTAL) {
  for (const [pole, sciezka] of Object.entries(POLITYKI)) {
    const [strona, kotwica] = sciezka.split('#');
    if (!istnieje(strona)) {
      bledy.push(`dane organizacji: ${pole} wskazuje ${strona}, a takiej strony nie ma`);
      continue;
    }
    const html = readFileSync(join(DIST, `${strona}.html`), 'utf8');
    if (kotwica && !html.includes(`id="${kotwica}"`)) bledy.push(`dane organizacji: ${pole} wskazuje ${sciezka}, a strona nie ma śródtytułu z id „${kotwica}” (zmieniony śródtytuł? popraw src/lib/polityki.mjs)`);
  }
}

// llms.txt (mapa dla asystentów AI): w portalu jest, a każdy link prowadzi do zbudowanej strony.
if (PORTAL) {
  const llms = existsSync(join(DIST, 'llms.txt')) ? readFileSync(join(DIST, 'llms.txt'), 'utf8') : '';
  if (!llms.startsWith('# ')) bledy.push('brak dist/llms.txt albo nie zaczyna się od nagłówka „# nazwa”');
  for (const [, url] of llms.matchAll(/\]\((https?:\/\/[^)]+)\)/g)) {
    if (!url.startsWith(ADRES)) bledy.push(`llms.txt: link spoza serwisu ${url}`);
    else if (!istnieje(url.slice(ADRES.length) || '/')) bledy.push(`llms.txt: ${url} nie ma odpowiadającej strony`);
  }
}

// IndexNow: plik klucza leży publicznie (także przed startem).
if (readdirSync(DIST).filter((f) => PLIK_KLUCZA.test(f)).length !== 1) bledy.push('IndexNow: w dist/ ma być dokładnie jeden plik klucza <32 znaki>.txt');

if (planowane.size) ostrzezenia.push(`linki do tras planowanych w kolejnych fazach (${planowane.size}): ${[...planowane.keys()].sort().join(', ')}`);
for (const o of ostrzezenia) console.warn(`⚠ ${o}`);
for (const b of bledy) console.error(`✗ ${b}`);
const tryb = PODGLAD ? 'podgląd' : TESTOWE ? 'build testowy' : PORTAL ? 'produkcja' : 'produkcja przed startem';
console.log(`\nKontrola SEO (${tryb}): ${strony.length} stron, ${bledy.length} błędów, ${ostrzezenia.length} ostrzeżeń.`);
process.exit(bledy.length ? 1 : 0);
