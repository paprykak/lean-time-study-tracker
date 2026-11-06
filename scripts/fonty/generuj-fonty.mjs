// Fonty serwisu: Noto Sans (tekst) i Noto Sans Display (tytuły), licencja SIL OFL 1.1, hostowane u siebie.
// Źródło: repozytorium google/fonts na przypiętym commicie, sprawdzane sumą SHA-256 (powtarzalny wynik).
// Wynik: src/assets/fonty/*.woff2 (podzbiór łaciński z polskimi znakami; Vite nadaje im hash w nazwie, więc mogą leżeć
// w pamięci podręcznej rok), public/fonty/OFL.txt (licencja) i src/styles/fonty.css (@font-face
// oraz font zapasowy z dopasowaną metryką, żeby podmiana fontu nie przesuwała układu strony).
// Użycie: npm run fonty
import { mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import subsetFont from 'subset-font';
import opentype from 'opentype.js';
import { ZNAKI, PROBKA, unicodeRange } from './znaki.mjs';
import { CACHE, COMMIT, ZRODLA, zrodlo } from './zrodla.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const WYJSCIE = join(ROOT, 'src/assets/fonty');
const LICENCJA = join(ROOT, 'public/fonty');
// Font metrycznie zgodny z Arialem (Arial, Helvetica i Liberation Sans mają te same szerokości znaków).
// Na Ubuntu jest w pakiecie fonts-liberation (sudo apt-get install fonts-liberation).
const ZAPASOWY = '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf';

async function podzbior(buf, osie, format = 'woff2') {
  return subsetFont(buf, ZNAKI, { targetFormat: format, variationAxes: osie });
}

/** Szerokość próbki w jednostkach em (średnia na znak), z mapy glifów danego fontu. */
function szerokosc(font) {
  const glify = font.stringToGlyphs(PROBKA);
  const suma = glify.reduce((s, g) => s + (g.advanceWidth ?? 0), 0);
  return suma / font.unitsPerEm / PROBKA.length;
}

function metryka(fontBuf, zapasowyBuf) {
  const toAb = (b) => b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
  const font = opentype.parse(toAb(fontBuf));
  const zapas = opentype.parse(toAb(zapasowyBuf));
  const sizeAdjust = szerokosc(font) / szerokosc(zapas);
  const { ascender, descender, lineGap } = font.tables.hhea;
  const upm = font.unitsPerEm;
  const proc = (n) => `${(n * 100).toFixed(2)}%`;
  return {
    sizeAdjust: proc(sizeAdjust),
    ascent: proc(ascender / upm / sizeAdjust),
    descent: proc(Math.abs(descender) / upm / sizeAdjust),
    lineGap: proc(lineGap / upm / sizeAdjust),
  };
}

const sans = await zrodlo('sans');
const italic = await zrodlo('sansItalic');
const display = await zrodlo('display');
const licencja = await zrodlo('licencja');
mkdirSync(WYJSCIE, { recursive: true });

const pliki = {
  'noto-sans.woff2': await podzbior(sans.buf, { wdth: 100, wght: { min: 400, max: 700, default: 400 } }),
  'noto-sans-italic.woff2': await podzbior(italic.buf, { wdth: 100, wght: { min: 400, max: 700, default: 400 } }),
  'noto-sans-display-700.woff2': await podzbior(display.buf, { wdth: 100, wght: 700 }),
};
for (const [nazwa, buf] of Object.entries(pliki)) writeFileSync(join(WYJSCIE, nazwa), buf);
mkdirSync(LICENCJA, { recursive: true });
copyFileSync(join(CACHE, 'OFL.txt'), join(WYJSCIE, 'OFL.txt'));
copyFileSync(join(CACHE, 'OFL.txt'), join(LICENCJA, 'OFL.txt'));

// Metryka fontu zapasowego liczona z instancji, które naprawdę wyświetlamy (Sans 400, Display 700).
const zapasowy = readFileSync(ZAPASOWY);
const mSans = metryka(await podzbior(sans.buf, { wdth: 100, wght: 400 }, 'truetype'), zapasowy);
const mDisplay = metryka(await podzbior(display.buf, { wdth: 100, wght: 700 }, 'truetype'), zapasowy);
const zakres = unicodeRange();

const css = `/* Plik generowany: npm run fonty (scripts/fonty/generuj-fonty.mjs). Nie edytuj ręcznie. */
/* Noto Sans i Noto Sans Display, SIL Open Font License 1.1 (/fonty/OFL.txt), google/fonts@${COMMIT.slice(0, 7)}. */
/* font-display: optional + preload: font albo jest od pierwszego malowania, albo strona zostaje przy zapasowym (zero przesunięć). */
@font-face {
  font-family: "Noto Sans";
  font-style: normal;
  font-weight: 400 700;
  font-display: optional;
  src: url("../assets/fonty/noto-sans.woff2") format("woff2");
  unicode-range: ${zakres};
}
@font-face {
  font-family: "Noto Sans";
  font-style: italic;
  font-weight: 400 700;
  font-display: optional;
  src: url("../assets/fonty/noto-sans-italic.woff2") format("woff2");
  unicode-range: ${zakres};
}
@font-face {
  font-family: "Noto Sans Display";
  font-style: normal;
  font-weight: 700;
  font-display: optional;
  src: url("../assets/fonty/noto-sans-display-700.woff2") format("woff2");
  unicode-range: ${zakres};
}
/* Fonty zapasowe: Arial (Windows), Helvetica (Apple), Liberation Sans (Linux) przeskalowane do szerokości i wysokości Noto. */
@font-face {
  font-family: "Noto Sans Zapasowy";
  src: local("Arial"), local("Helvetica"), local("Liberation Sans");
  size-adjust: ${mSans.sizeAdjust};
  ascent-override: ${mSans.ascent};
  descent-override: ${mSans.descent};
  line-gap-override: ${mSans.lineGap};
}
@font-face {
  font-family: "Noto Sans Display Zapasowy";
  src: local("Arial Bold"), local("Arial-BoldMT"), local("Helvetica Bold"), local("Liberation Sans Bold");
  font-weight: 700;
  size-adjust: ${mDisplay.sizeAdjust};
  ascent-override: ${mDisplay.ascent};
  descent-override: ${mDisplay.descent};
  line-gap-override: ${mDisplay.lineGap};
}
`;
writeFileSync(join(ROOT, 'src/styles/fonty.css'), css);

writeFileSync(
  join(WYJSCIE, 'ZRODLA.json'),
  JSON.stringify(
    {
      licencja: 'SIL Open Font License 1.1',
      repozytorium: 'https://github.com/google/fonts',
      commit: COMMIT,
      zrodla: Object.fromEntries(Object.entries(ZRODLA).map(([k, v]) => [k, v.sciezka])),
      sha256: { sans: sans.sha256, sansItalic: italic.sha256, display: display.sha256, licencja: licencja.sha256 },
    },
    null,
    2,
  ) + '\n',
);

for (const [nazwa, buf] of Object.entries(pliki)) console.log(`${nazwa}: ${(buf.length / 1024).toFixed(1)} KB`);
console.log('Metryka zapasowa Sans:', mSans, 'Display:', mDisplay);
