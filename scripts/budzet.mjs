// Budżet rozmiaru każdej zbudowanej strony (gzip). Uruchamiany w `npm run check:szybki`.
// JavaScript: do 30 KB (sekcja 3 promptu: strona artykułu, bez analityki; pilnujemy tego na każdej stronie).
// CSS (w kodzie strony): do 40 KB. Fonty wczytywane z wyprzedzeniem (preload): do 60 KB.
import { gzipSync } from 'node:zlib';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
export const BUDZET = { js: 30 * 1024, css: 40 * 1024, fonty: 60 * 1024 };

const html = (k) => readdirSync(k).flatMap((n) => (statSync(join(k, n)).isDirectory() ? (n === '_astro' ? [] : html(join(k, n))) : n.endsWith('.html') ? [join(k, n)] : []));
const gzip = (tresc) => gzipSync(tresc, { level: 9 }).length;
const plikDist = (adres) => readFileSync(join(DIST, adres.replace(/^\//, '')));
const kb = (b) => `${(b / 1024).toFixed(1)} KB`;

let bledy = 0;
const wiersze = [];
for (const plik of html(DIST)) {
  const strona = readFileSync(plik, 'utf8');
  const zewnetrzne = [...strona.matchAll(/<script\b[^>]*\ssrc="(\/_astro\/[^"]+\.js)"/g)].map((m) => m[1]);
  // Moduły importowane przez skrypty (podział na części przez Vite) też liczą się do budżetu.
  const doPobrania = new Set(zewnetrzne);
  for (const adres of doPobrania) {
    for (const [, imp] of plikDist(adres).toString('utf8').matchAll(/from\s*"\.\/([^"]+\.js)"/g)) doPobrania.add(`/_astro/${imp}`);
  }
  const wKodzie = [...strona.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)].filter(([, a]) => !/\bsrc=|ld\+json/.test(a)).map(([, , t]) => t);
  const js = [...doPobrania].reduce((s, a) => s + gzip(plikDist(a)), 0) + wKodzie.reduce((s, t) => s + gzip(t), 0);
  const css = [...strona.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)].reduce((s, [, t]) => s + gzip(t), 0) +
    [...strona.matchAll(/<link rel="stylesheet" href="(\/_astro\/[^"]+)"/g)].reduce((s, [, a]) => s + gzip(plikDist(a)), 0);
  const fonty = [...strona.matchAll(/<link rel="preload" href="([^"]+)" as="font"/g)].reduce((s, [, a]) => s + plikDist(a).length, 0);
  const adres = '/' + relative(DIST, plik).replace(/\.html$/, '').replace(/^index$/, '');
  const przekroczone = [js > BUDZET.js && 'JS', css > BUDZET.css && 'CSS', fonty > BUDZET.fonty && 'fonty'].filter(Boolean);
  if (przekroczone.length) bledy++;
  wiersze.push(`${przekroczone.length ? '✗' : '✓'} ${adres.padEnd(16)} JS ${kb(js).padStart(8)}  CSS ${kb(css).padStart(8)}  fonty ${kb(fonty).padStart(8)}${przekroczone.length ? `  przekroczono: ${przekroczone.join(', ')}` : ''}`);
}
console.log(`Budżet (gzip): JS ≤ ${kb(BUDZET.js)}, CSS ≤ ${kb(BUDZET.css)}, fonty z preload ≤ ${kb(BUDZET.fonty)}`);
for (const w of wiersze) console.log(w);
process.exit(bledy ? 1 : 0);
