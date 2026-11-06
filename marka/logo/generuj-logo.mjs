// Logo Rytmu Hali, koncepcja C: plakietka z dachem szedowym, litery RH, napis „RYTM HALI” i podtytuł
// „Produkcja · Magazyn · Dane”. Tekst zamieniony na krzywe z fontów Noto (SIL OFL 1.1), więc pliki nie zależą
// od fontów zainstalowanych na komputerze.
//
// UWAGA: to robocze odtworzenie koncepcji C z opisu w prompcie. Oryginalne pliki Patryka (marka/logo/ na jego
// komputerze) mają pierwszeństwo: po ich dodaniu wystarczy podmienić geometrię poniżej albo pliki w svg/
// i uruchomić `npm run logo -- --tylko-pochodne`, żeby odtworzyć favicony, awatar i okładkę.
//
// Użycie: npm run logo
// Wynik:
//   marka/logo/svg/   wersje wektorowe (jasna, ciemna, czarno-biała, negatyw, kompaktowe, ikony)
//   marka/logo/png/   favicony 16/32/48, apple-touch-icon 180, awatar LinkedIn 400, logo PNG, okładka 1200×630
//   src/assets/logo/  SVG do wstawiania w szablony (komponent Logo.astro)
//   public/           favicon.ico, favicon.svg, apple-touch-icon.png, marka/okladka-domyslna.jpg, marka/logo.png
import { mkdirSync, writeFileSync, readFileSync, copyFileSync, existsSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import subsetFont from 'subset-font';
import opentype from 'opentype.js';
import { chromium } from 'playwright';
import { zrodlo } from '../../scripts/fonty/zrodla.mjs';
import { zlozIco } from './ico.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const SVG = join(ROOT, 'marka/logo/svg');
const PNG = join(ROOT, 'marka/logo/png');
const ASSETS = join(ROOT, 'src/assets/logo');
const PUBLIC = join(ROOT, 'public');
const tylkoPochodne = process.argv.includes('--tylko-pochodne');

export const KOLORY = {
  grafit: '#1d2530',
  grafitCiemny: '#11161d',
  akcent: '#e8590c',
  bialy: '#ffffff',
  szary: '#58626f',
  szaryNaCiemnym: '#b4bcc6',
  czarny: '#000000',
};

export const NAPIS = 'RYTM HALI';
export const PODTYTUL = 'Produkcja · Magazyn · Dane';
const LITERY = 'RH';

// ── Fonty: statyczne instancje z fontów zmiennych, tylko potrzebne znaki ──────────────────────────────
async function instancja(zrodloFontu, waga, tekst) {
  const { buf } = await zrodlo(zrodloFontu);
  const ttf = await subsetFont(buf, tekst, { targetFormat: 'truetype', variationAxes: { wdth: 100, wght: waga } });
  return opentype.parse(ttf.buffer.slice(ttf.byteOffset, ttf.byteOffset + ttf.byteLength));
}

/**
 * Tekst jako ścieżka SVG: ręczny skład z kerningiem i światłem między literami (tracking w em).
 * Zwraca dane ścieżki, szerokość i wysokość wersalików w jednostkach rysunku.
 */
function sklad(font, tekst, { wysokoscWersalikow, tracking = 0 }) {
  const rozmiar = (wysokoscWersalikow / font.tables.os2.sCapHeight) * font.unitsPerEm;
  const skala = rozmiar / font.unitsPerEm;
  const glify = font.stringToGlyphs(tekst);
  const czesci = [];
  let x = 0;
  glify.forEach((g, i) => {
    czesci.push({ g, x });
    x += g.advanceWidth * skala;
    if (i < glify.length - 1) x += font.getKerningValue(g, glify[i + 1]) * skala + tracking * rozmiar;
  });
  // Szerokość optyczna: od lewej krawędzi pierwszego glifu do prawej krawędzi ostatniego (bez bocznych odstępów).
  const pierwszy = czesci[0];
  const ostatni = czesci.at(-1);
  const lewa = pierwszy.x + (pierwszy.g.xMin ?? 0) * skala;
  const prawa = ostatni.x + (ostatni.g.xMax ?? ostatni.g.advanceWidth) * skala;
  return {
    rysuj: (x0, linia) =>
      czesci
        .map(({ g, x: dx }) => g.getPath(x0 - lewa + dx, linia, rozmiar).toPathData(2))
        .filter(Boolean)
        .join(''),
    szerokosc: prawa - lewa,
    rozmiar,
  };
}

// ── Geometria (jednostki: plakietka 100 × 100) ─────────────────────────────────────────────────────────
// Dach szedowy: trzy zęby z pionowym bokiem (przeszklenie) i spadkiem, nad nim korpus hali.
const DACH_DOL = 22;
const DACH_GORA = 3;
const KORPUS_GORA = 27;

function dach(kolor, { granice = [0, 100 / 3, 200 / 3, 100], dol = DACH_DOL, gora = DACH_GORA } = {}) {
  const zeby = granice
    .slice(0, -1)
    .map((a, i) => `M${r(a)} ${dol}V${gora}L${r(granice[i + 1])} ${dol}Z`)
    .join('');
  return `<path fill="${kolor}" d="${zeby}"/>`;
}
// Ikona mała (favicon 16 px i karta przeglądarki): krawędzie na siatce 16 i 32 pikseli, żeby nie było rozmycia.
// Zęby 5, 5 i 6 px, dach 4 px, szczelina 1 px, korpus 11 px (przy 16 px).
const MALA = { granice: [0, 31.25, 62.5, 100], dol: 25, gora: 0, korpus: 31.25 };
const r = (n) => Math.round(n * 100) / 100;

function plakietka({ dachKolor, korpusKolor, literyKolor, litery, mala = false }) {
  const gora = mala ? MALA.korpus : KORPUS_GORA;
  let svg = dach(dachKolor, mala ? MALA : undefined) + `<rect x="0" y="${gora}" width="100" height="${100 - gora}" fill="${korpusKolor}"/>`;
  if (litery) {
    const linia = KORPUS_GORA + (100 - KORPUS_GORA + litery.wysokosc) / 2;
    svg += `<path fill="${literyKolor}" d="${litery.sklad.rysuj(50 - litery.sklad.szerokosc / 2, linia)}"/>`;
  }
  return svg;
}

function plik(viewBox, tresc, tytul = 'Rytm Hali') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="${tytul}"><title>${tytul}</title>${tresc}</svg>\n`;
}

// ── Budowa wersji ──────────────────────────────────────────────────────────────────────────────────────
const displayLitery = await instancja('display', 800, LITERY);
const displayNapis = await instancja('display', 700, NAPIS);
const sansPodtytul = await instancja('sans', 600, PODTYTUL);

const WERSALIKI_RH = 38;
const rh = { sklad: sklad(displayLitery, LITERY, { wysokoscWersalikow: WERSALIKI_RH, tracking: 0.01 }), wysokosc: WERSALIKI_RH };

// Napis: wersaliki od górnej krawędzi korpusu; podtytuł: linia bazowa na dolnej krawędzi plakietki.
const ODSTEP = 20;
const WERSALIKI_NAPISU = 37;
const WERSALIKI_PODTYTULU = 12.5;
const napis = sklad(displayNapis, NAPIS, { wysokoscWersalikow: WERSALIKI_NAPISU, tracking: 0.035 });
// Podtytuł dostaje światło między literami tak, żeby miał dokładnie szerokość napisu (wyjustowany blok).
const podtytulBazowy = sklad(sansPodtytul, PODTYTUL, { wysokoscWersalikow: WERSALIKI_PODTYTULU });
const brakuje = napis.szerokosc - podtytulBazowy.szerokosc;
const tracking = brakuje / (PODTYTUL.length - 1) / podtytulBazowy.rozmiar;
const podtytul = sklad(sansPodtytul, PODTYTUL, { wysokoscWersalikow: WERSALIKI_PODTYTULU, tracking });

const LINIA_NAPISU = KORPUS_GORA + WERSALIKI_NAPISU + 1;
// Linia bazowa podtytułu równo z dolną krawędzią plakietki; pole rysunku sięga niżej o wydłużenia dolne (j, g, y).
const LINIA_PODTYTULU = 100;
const DOL_PELNEGO = r(LINIA_PODTYTULU + (Math.abs(sansPodtytul.tables.hhea.descender) / sansPodtytul.unitsPerEm) * podtytul.rozmiar * 0.85);
const SZEROKOSC_PELNA = r(100 + ODSTEP + napis.szerokosc);

function logoPelne(k) {
  return plik(
    `0 0 ${SZEROKOSC_PELNA} ${DOL_PELNEGO}`,
    plakietka({ dachKolor: k.dach, korpusKolor: k.korpus, literyKolor: k.litery, litery: rh }) +
      `<path fill="${k.napis}" d="${napis.rysuj(100 + ODSTEP, LINIA_NAPISU)}"/>` +
      `<path fill="${k.podtytul}" d="${podtytul.rysuj(100 + ODSTEP, LINIA_PODTYTULU)}"/>`,
  );
}

// Kompaktowe: bez podtytułu (nagłówek na telefonie, małe rozmiary). Napis wyśrodkowany w pionie na korpusie.
const WERSALIKI_KOMPAKT = 40;
const napisKompakt = sklad(displayNapis, NAPIS, { wysokoscWersalikow: WERSALIKI_KOMPAKT, tracking: 0.035 });
const LINIA_KOMPAKT = KORPUS_GORA + (100 - KORPUS_GORA + WERSALIKI_KOMPAKT) / 2;
const SZEROKOSC_KOMPAKT = r(100 + ODSTEP + napisKompakt.szerokosc);
function logoKompakt(k) {
  return plik(
    `0 0 ${SZEROKOSC_KOMPAKT} 100`,
    plakietka({ dachKolor: k.dach, korpusKolor: k.korpus, literyKolor: k.litery, litery: rh }) +
      `<path fill="${k.napis}" d="${napisKompakt.rysuj(100 + ODSTEP, LINIA_KOMPAKT)}"/>`,
  );
}

const WARIANTY = {
  jasne: { dach: KOLORY.akcent, korpus: KOLORY.grafit, litery: KOLORY.bialy, napis: KOLORY.grafit, podtytul: KOLORY.szary },
  ciemne: { dach: KOLORY.akcent, korpus: KOLORY.bialy, litery: KOLORY.grafitCiemny, napis: KOLORY.bialy, podtytul: KOLORY.szaryNaCiemnym },
  cb: { dach: KOLORY.czarny, korpus: KOLORY.czarny, litery: KOLORY.bialy, napis: KOLORY.czarny, podtytul: KOLORY.czarny },
  'cb-negatyw': { dach: KOLORY.bialy, korpus: KOLORY.bialy, litery: KOLORY.czarny, napis: KOLORY.bialy, podtytul: KOLORY.bialy },
};

const svg = {};
if (tylkoPochodne) {
  for (const n of ['rytm-hali-jasne', 'rytm-hali-ciemne', 'rytm-hali-ikona', 'rytm-hali-ikona-mala']) svg[n] = readFileSync(join(SVG, `${n}.svg`), 'utf8');
} else {
  for (const [nazwa, k] of Object.entries(WARIANTY)) svg[`rytm-hali-${nazwa}`] = logoPelne(k);
  svg['rytm-hali-kompakt-jasne'] = logoKompakt(WARIANTY.jasne);
  svg['rytm-hali-kompakt-ciemne'] = logoKompakt(WARIANTY.ciemne);
  // Ikona: sama plakietka z literami (od 32 px). Ikona mała: bez liter, czytelna w 16 px (karta przeglądarki).
  const MARGINES = 0;
  svg['rytm-hali-ikona'] = plik(`${-MARGINES} 0 ${100 + 2 * MARGINES} 100`, plakietka({ dachKolor: KOLORY.akcent, korpusKolor: KOLORY.grafit, literyKolor: KOLORY.bialy, litery: rh }));
  svg['rytm-hali-ikona-cb'] = plik('0 0 100 100', plakietka({ dachKolor: KOLORY.czarny, korpusKolor: KOLORY.czarny, literyKolor: KOLORY.bialy, litery: rh }));
  svg['rytm-hali-ikona-mala'] = plik('0 0 100 100', plakietka({ dachKolor: KOLORY.akcent, korpusKolor: KOLORY.grafit, mala: true }));
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
const zeby = Array.from({ length: 25 }, (_, i) => `M${i * 48} 630V606L${(i + 1) * 48} 630Z`).join('');
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
console.log(`Logo: ${Object.keys(svg).length} plików SVG, favicony, awatar, okładka. Pole logo pełnego ${SZEROKOSC_PELNA} × ${DOL_PELNEGO}.`);
