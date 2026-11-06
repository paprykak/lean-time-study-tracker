// Logo Rytmu Hali, koncepcja C: plakietka z dachem szedowym, litery RH, napis „RYTM HALI” i podtytuł
// „Produkcja · Magazyn · Dane”. Geometria i parametry: marka/logo/geometria.mjs (porównanie wariantów:
// node marka/logo/porownaj.mjs <plik.png>). Tekst zamieniony na krzywe z fontów Noto (SIL OFL 1.1).
//
// Wersja w repozytorium to odtworzenie koncepcji C z opisu, po szlifie z 2026-11-06 (marka/README.md).
// Oryginały Patryka mają pierwszeństwo: po podmianie plików w svg/ uruchom `npm run logo -- --tylko-pochodne`,
// żeby odtworzyć favicony, awatar, logo PNG i okładkę bez nadpisywania SVG.
//
// Użycie: npm run logo
// Wynik:
//   marka/logo/svg/   wersje wektorowe (jasna, ciemna, czarno-biała, negatyw, kompaktowe, ikony)
//   marka/logo/png/   favicony 16/32/48, apple-touch-icon 180, awatar LinkedIn 400, logo PNG, okładka 1200×630
//   src/assets/logo/  SVG do wstawiania w szablony (komponent Logo.astro)
//   public/           favicon.ico, favicon.svg, apple-touch-icon.png, marka/okladka-domyslna.jpg, marka/logo.png
import { mkdirSync, writeFileSync, readFileSync, copyFileSync, existsSync, mkdtempSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { KOLORY, zbudujLogo } from './geometria.mjs';
import { zlozIco } from './ico.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const SVG = join(ROOT, 'marka/logo/svg');
const PNG = join(ROOT, 'marka/logo/png');
const ASSETS = join(ROOT, 'src/assets/logo');
const PUBLIC = join(ROOT, 'public');
const tylkoPochodne = process.argv.includes('--tylko-pochodne');

let svg = {};
if (tylkoPochodne) {
  for (const f of readdirSync(SVG).filter((f) => f.endsWith('.svg'))) svg[f.replace(/\.svg$/, '')] = readFileSync(join(SVG, f), 'utf8');
} else {
  ({ svg } = await zbudujLogo());
  mkdirSync(SVG, { recursive: true });
  for (const [nazwa, tresc] of Object.entries(svg)) writeFileSync(join(SVG, `${nazwa}.svg`), tresc);
}

mkdirSync(ASSETS, { recursive: true });
for (const n of ['rytm-hali-jasne', 'rytm-hali-ciemne', 'rytm-hali-kompakt-jasne', 'rytm-hali-kompakt-ciemne', 'rytm-hali-ikona']) {
  if (existsSync(join(SVG, `${n}.svg`))) copyFileSync(join(SVG, `${n}.svg`), join(ASSETS, `${n}.svg`));
}
copyFileSync(join(SVG, 'rytm-hali-ikona-mala.svg'), join(PUBLIC, 'favicon.svg'));

// ── Pliki rastrowe (Chromium z Playwrighta) ───────────────────────────────────────────────────────────
const fontUrl = (n) => pathToFileURL(join(ROOT, 'src/assets/fonty', n)).href;
const wczytajSvg = (n) => readFileSync(join(SVG, `${n}.svg`), 'utf8').replace(/<title>[^<]*<\/title>/, '');
const strona = (szer, wys, tlo, tresc, css = '') => `<!doctype html><html lang="pl"><head><meta charset="utf-8"><style>
@font-face { font-family: "Noto Sans"; font-weight: 400 700; src: url("${fontUrl('noto-sans.woff2')}") format("woff2"); }
@font-face { font-family: "Noto Sans Display"; font-weight: 700; src: url("${fontUrl('noto-sans-display-700.woff2')}") format("woff2"); }
* { margin: 0; box-sizing: border-box; }
html, body { width: ${szer}px; height: ${wys}px; background: ${tlo}; overflow: hidden; }
body { display: grid; place-items: center; font-family: "Noto Sans", sans-serif; }
svg { display: block; }
${css}</style></head><body>${tresc}</body></html>`;

mkdirSync(PNG, { recursive: true });
const przegladarka = await chromium.launch();
async function zrzut(html, szer, wys, cel, typ = 'png') {
  const p = await przegladarka.newPage({ viewport: { width: szer, height: wys }, deviceScaleFactor: 1 });
  // Plik tymczasowy zamiast setContent: strona z file:// może wczytać lokalne fonty.
  const tymczasowy = join(mkdtempSync(join(tmpdir(), 'logo-')), 'strona.html');
  writeFileSync(tymczasowy, html);
  await p.goto(pathToFileURL(tymczasowy).href);
  await p.evaluate(() => document.fonts.ready);
  const bufor = await p.screenshot({ type: typ, ...(typ === 'jpeg' ? { quality: 88 } : { omitBackground: false }) });
  await p.close();
  writeFileSync(cel, bufor);
  return bufor;
}

// Favicony: 16 px bez liter, 32 i 48 z literami (optyczne rozmiary).
const ikonaHtml = (n, rozmiar) => strona(rozmiar, rozmiar, 'transparent', wczytajSvg(n).replace('<svg ', `<svg width="${rozmiar}" height="${rozmiar}" `));
const f16 = await zrzut(ikonaHtml('rytm-hali-ikona-mala', 16), 16, 16, join(PNG, 'favicon-16.png'));
const f32 = await zrzut(ikonaHtml('rytm-hali-ikona', 32), 32, 32, join(PNG, 'favicon-32.png'));
const f48 = await zrzut(ikonaHtml('rytm-hali-ikona', 48), 48, 48, join(PNG, 'favicon-48.png'));
writeFileSync(join(PUBLIC, 'favicon.ico'), zlozIco([{ rozmiar: 16, png: f16 }, { rozmiar: 32, png: f32 }, { rozmiar: 48, png: f48 }]));

// apple-touch-icon: białe tło (iOS sam zaokrągla rogi), plakietka 70% boku.
const kwadrat = (bok, procent, tlo, n = 'rytm-hali-ikona') =>
  strona(bok, bok, tlo, wczytajSvg(n).replace('<svg ', `<svg width="${Math.round(bok * procent)}" height="${Math.round(bok * procent)}" `));
await zrzut(kwadrat(180, 0.7, KOLORY.bialy), 180, 180, join(PNG, 'apple-touch-icon-180.png'));
copyFileSync(join(PNG, 'apple-touch-icon-180.png'), join(PUBLIC, 'apple-touch-icon.png'));

// Awatar LinkedIn 400×400: plakietka 58% boku mieści się w kole wpisanym (przekątna 0,82 boku).
await zrzut(kwadrat(400, 0.58, KOLORY.bialy), 400, 400, join(PNG, 'awatar-linkedin-400.png'));
await zrzut(kwadrat(512, 0.8, KOLORY.bialy), 512, 512, join(PNG, 'ikona-512.png'));

// Logo PNG do dokumentów i poczty (szerokość 1200 px) oraz logo dla danych strukturalnych (600 × 60, białe tło).
const poziome = (n, szer, wys, tlo, wysLogo) =>
  strona(szer, wys, tlo, wczytajSvg(n).replace('<svg ', `<svg height="${wysLogo}" `));
// Proporcje z pola rysunku pliku (działa także po podmianie SVG na oryginały, tryb --tylko-pochodne).
const [, , vbSzer, vbWys] = wczytajSvg('rytm-hali-jasne').match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
const proporcja = vbSzer / vbWys;
await zrzut(poziome('rytm-hali-jasne', 1200, Math.round(1200 / proporcja), KOLORY.bialy, Math.round(1200 / proporcja)), 1200, Math.round(1200 / proporcja), join(PNG, 'logo-jasne-1200.png'));
await zrzut(poziome('rytm-hali-ciemne', 1200, Math.round(1200 / proporcja), KOLORY.grafitCiemny, Math.round(1200 / proporcja)), 1200, Math.round(1200 / proporcja), join(PNG, 'logo-ciemne-1200.png'));
mkdirSync(join(PUBLIC, 'marka'), { recursive: true });
await zrzut(poziome('rytm-hali-jasne', 600, 60, KOLORY.bialy, 56), 600, 60, join(PUBLIC, 'marka/logo.png'));
copyFileSync(join(PNG, 'ikona-512.png'), join(PUBLIC, 'marka/ikona-512.png'));

// Domyślna okładka udostępnień 1200×630: grafitowe tło, logo, opis i adres, ząbkowany pas dachu na dole.
// Zęby wznoszące jak w logo (/|): spadek w górę w prawo, pion po prawej.
const zeby = Array.from({ length: 25 }, (_, i) => `M${i * 48} 630L${(i + 1) * 48} 606V630Z`).join('');
const okladka = strona(
  1200,
  630,
  KOLORY.grafitCiemny,
  `<div class="o">${wczytajSvg('rytm-hali-ciemne').replace('<svg ', '<svg width="760" ')}
   <p class="opis">Niezależne medium o operacjach</p><p class="adres">rytmhali.pl</p></div>
   <svg class="pas" width="1200" height="630" viewBox="0 0 1200 630"><path fill="${KOLORY.akcent}" d="${zeby}"/></svg>`,
  `.o { position: relative; z-index: 1; width: 760px; margin-top: -24px; }
   .opis { margin-top: 44px; font-size: 34px; font-weight: 600; color: ${KOLORY.bialy}; }
   .adres { margin-top: 8px; font-size: 26px; font-weight: 500; color: ${KOLORY.szaryNaCiemnym}; }
   .pas { position: absolute; inset: 0; }`,
);
await zrzut(okladka, 1200, 630, join(PNG, 'okladka-domyslna-1200x630.jpg'), 'jpeg');
copyFileSync(join(PNG, 'okladka-domyslna-1200x630.jpg'), join(PUBLIC, 'marka/okladka-domyslna.jpg'));

await przegladarka.close();
console.log(`Logo: ${Object.keys(svg).length} plików SVG, favicony, awatar, logo PNG, okładka. Pole logo pełnego ${vbSzer} × ${vbWys}.`);
