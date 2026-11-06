// Arkusz porównawczy wariantów logo w realnych rozmiarach: nagłówek na komputerze (60 px), na telefonie (32 px),
// stopka (ciemne tło), favicon 32 i 16 px (powiększone, żeby było widać piksele) oraz duży podgląd konstrukcji.
// Użycie: node marka/logo/porownaj.mjs <plik.png>
import { writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { PARAMETRY, zbudujLogo } from './geometria.mjs';

const OBECNA = {
  ...PARAMETRY,
  dach: { zeby: 3, gora: 3, dol: 22, korpus: 27, kierunek: 'opadajacy' },
  litery: { tekst: 'RH', waga: 800, wersaliki: 38, tracking: 0.01, korektaY: 0 },
  napis: { tekst: 'RYTM HALI', waga: 700, wersaliki: 37, gora: 27, tracking: 0.035, odstep: 20, kerning: {} },
  podtytul: { tekst: 'Produkcja · Magazyn · Dane', waga: 600, wersaliki: 12.5, wyjustuj: true },
  kompakt: { wersaliki: 40 },
};

export const WARIANTY = [
  { nazwa: 'Przed: odtworzenie z opisu', p: OBECNA },
  { nazwa: 'Po szlifie (rekomendacja)', p: PARAMETRY },
  {
    nazwa: 'Alternatywa: podtytuł małymi literami',
    p: { ...PARAMETRY, podtytul: { tekst: 'Produkcja · Magazyn · Dane', waga: 600, tracking: 0.02, wersaliki: 12, wyjustuj: 'rozmiar' } },
  },
];

const cel = process.argv[2] ?? 'porownanie-logo.png';
const bezTytulu = (s) => s.replace(/<title>[^<]*<\/title>/, '').replace(/ role="img" aria-label="[^"]*"/, '');
const wysokosc = (s, h) => bezTytulu(s).replace('<svg ', `<svg height="${h}" `);

let html = `<!doctype html><html lang="pl"><head><meta charset="utf-8"><style>
body{margin:0;font:14px/1.4 system-ui,sans-serif;color:#1d2530;background:#fff}
.w{display:grid;grid-template-columns:260px 1fr;border-bottom:1px solid #dde1e6}
.n{padding:24px;font-weight:700;background:#f2f4f6}
.r{display:flex;align-items:center;gap:40px;padding:24px 32px;flex-wrap:wrap}
.c{background:#11161d;padding:16px 24px}
.px img{image-rendering:pixelated;outline:1px solid #ccc}
small{display:block;color:#58626f;margin-top:4px}
</style></head><body>`;

const przegladarka = await chromium.launch();
const strona = await przegladarka.newPage({ viewport: { width: 1500, height: 900 }, deviceScaleFactor: 1 });
async function raster(svg, bok) {
  const s = await przegladarka.newPage({ viewport: { width: bok, height: bok } });
  await s.setContent(`<html><body style="margin:0">${bezTytulu(svg).replace('<svg ', `<svg width="${bok}" height="${bok}" `)}</body></html>`);
  const b = await s.screenshot({ omitBackground: true });
  await s.close();
  return `data:image/png;base64,${b.toString('base64')}`;
}

for (const { nazwa, p } of WARIANTY) {
  const { svg } = await zbudujLogo(p);
  const f32 = await raster(svg['rytm-hali-ikona'], 32);
  const f16 = await raster(svg['rytm-hali-ikona-mala'], 16);
  html += `<div class="w"><div class="n">${nazwa}</div><div class="r">
    <div>${wysokosc(svg['rytm-hali-jasne'], 60)}<small>nagłówek komputer, 60 px</small></div>
    <div>${wysokosc(svg['rytm-hali-kompakt-jasne'], 32)}<small>telefon, 32 px</small></div>
    <div class="c">${wysokosc(svg['rytm-hali-ciemne'], 52)}</div>
    <div class="px"><img src="${f32}" width="64" height="64"><small>32 px ×2</small></div>
    <div class="px"><img src="${f16}" width="64" height="64"><small>16 px ×4</small></div>
    <div>${wysokosc(svg['rytm-hali-jasne'], 150)}</div>
  </div></div>`;
}
html += '</body></html>';
const plik = join(mkdtempSync(join(tmpdir(), 'logo-por-')), 'p.html');
writeFileSync(plik, html);
await strona.goto(pathToFileURL(plik).href);
await strona.screenshot({ path: cel, fullPage: true });
await przegladarka.close();
console.log(`Zapisano ${cel}`);
