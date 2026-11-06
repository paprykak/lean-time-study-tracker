// Geometria logo Rytmu Hali (koncepcja C): plakietka z dachem szedowym, monogram RH, napis i podtytuł.
// Wszystko w jednostkach rysunku, gdzie plakietka ma 100 × 100. Tekst jako krzywe z fontów Noto (SIL OFL 1.1).
// Parametry w jednym obiekcie, żeby dało się porównywać warianty (marka/logo/porownaj.mjs) i odtwarzać pliki.
import subsetFont from 'subset-font';
import opentype from 'opentype.js';
import { zrodlo } from '../../scripts/fonty/zrodla.mjs';

export const KOLORY = {
  grafit: '#1d2530',
  grafitCiemny: '#11161d',
  akcent: '#e8590c',
  bialy: '#ffffff',
  szary: '#58626f',
  szaryNaCiemnym: '#b4bcc6',
  czarny: '#000000',
};

/**
 * Wersja po szlifie z 2026-11-06 (uzasadnienie w marka/README.md):
 * - dach i korpus to jedna sylwetka hali; trzy zęby dachu szedowego wznoszą się w prawo (/|/|/|), pionowe
 *   przeszklenie ostatniego zęba domyka plakietkę od strony napisu;
 * - monogram RH i napis w tej samej grubości (Noto Sans Display 800), poprawione pary RY i odstęp między słowami;
 * - blok tekstu ma wysokość korpusu: góra wersalików napisu na linii okapu, linia bazowa podtytułu na dole plakietki;
 * - podtytuł wersalikami ze stałym światłem 0,14 em, rozmiar dobrany do szerokości napisu (bez rozstrzelania małych liter).
 */
export const PARAMETRY = {
  // kierunek: 'wznoszacy' = spadek dachu rośnie w prawo, pionowe przeszklenie po prawej stronie zęba (/|/|/|)
  dach: { zeby: 3, gora: 0, dol: 21, korpus: 21, kierunek: 'wznoszacy' },
  litery: { tekst: 'RH', waga: 800, wersaliki: 41, tracking: 0.02, korektaY: 0 },
  // gora: wysokość, na której zaczynają się wersaliki napisu (w jednostkach plakietki)
  napis: { tekst: 'RYTM HALI', waga: 800, wersaliki: 46, gora: 21, tracking: 0.035, odstep: 18, kerning: { RY: -0.035, 'M ': -0.05, ' H': -0.03 } },
  // wyjustuj: 'rozmiar' = stałe światło (tracking), rozmiar dobrany tak, żeby podtytuł miał szerokość napisu
  podtytul: { tekst: 'PRODUKCJA · MAGAZYN · DANE', waga: 600, tracking: 0.14, wersaliki: 12, wyjustuj: 'rozmiar' },
  kompakt: { wersaliki: 41 },
  mala: { granice: [0, 31.25, 62.5, 100], dol: 31.25, gora: 0, korpus: 31.25 },
};

const r = (n) => Math.round(n * 100) / 100;
const fonty = new Map();

/** Dane ścieżki SVG z poleceń opentype.js. Własna serializacja zamiast toPathData(), który w opentype.js 2.0
 *  przy części rozmiarów zamienia bardzo małe liczby na NaN (zapis wykładniczy przy zaokrąglaniu). */
function daneSciezki(sciezka) {
  const z = (n) => {
    const v = r(n);
    return Object.is(v, -0) ? '0' : String(v);
  };
  return sciezka.commands
    .map((c) => {
      switch (c.type) {
        case 'M':
        case 'L':
          return `${c.type}${z(c.x)} ${z(c.y)}`;
        case 'Q':
          return `Q${z(c.x1)} ${z(c.y1)} ${z(c.x)} ${z(c.y)}`;
        case 'C':
          return `C${z(c.x1)} ${z(c.y1)} ${z(c.x2)} ${z(c.y2)} ${z(c.x)} ${z(c.y)}`;
        default:
          return 'Z';
      }
    })
    .join('');
}

async function instancja(zrodloFontu, waga, tekst) {
  const klucz = `${zrodloFontu}|${waga}|${tekst}`;
  if (!fonty.has(klucz)) {
    const { buf } = await zrodlo(zrodloFontu);
    const ttf = await subsetFont(buf, tekst, { targetFormat: 'truetype', variationAxes: { wdth: 100, wght: waga } });
    fonty.set(klucz, opentype.parse(ttf.buffer.slice(ttf.byteOffset, ttf.byteOffset + ttf.byteLength)));
  }
  return fonty.get(klucz);
}

/**
 * Tekst jako ścieżka SVG: skład z kerningiem fontu, światłem (tracking, em) i ręcznymi korektami par (em).
 * Szerokość liczona optycznie: od lewej krawędzi pierwszego glifu do prawej krawędzi ostatniego.
 */
function sklad(font, tekst, { wysokoscWersalikow, tracking = 0, kerning = {} }) {
  const rozmiar = (wysokoscWersalikow / font.tables.os2.sCapHeight) * font.unitsPerEm;
  const skala = rozmiar / font.unitsPerEm;
  const znaki = [...tekst];
  const glify = font.stringToGlyphs(tekst);
  const czesci = [];
  let x = 0;
  glify.forEach((g, i) => {
    czesci.push({ g, x });
    x += g.advanceWidth * skala;
    if (i < glify.length - 1) {
      const para = znaki[i] + znaki[i + 1];
      x += font.getKerningValue(g, glify[i + 1]) * skala + tracking * rozmiar + (kerning[para] ?? 0) * rozmiar;
    }
  });
  const lewa = czesci[0].x + (czesci[0].g.xMin ?? 0) * skala;
  const ostatni = czesci.at(-1);
  const prawa = ostatni.x + (ostatni.g.xMax ?? ostatni.g.advanceWidth) * skala;
  return {
    rysuj: (x0, linia) =>
      czesci
        .map(({ g, x: dx }) => daneSciezki(g.getPath(x0 - lewa + dx, linia, rozmiar)))
        .filter(Boolean)
        .join(''),
    szerokosc: prawa - lewa,
    rozmiar,
    // Najniższy punkt glifów pod linią bazową (np. wielkie J w Noto schodzi pod linię), w jednostkach rysunku.
    zejscie: Math.max(0, ...czesci.map(({ g }) => -(g.yMin ?? 0) * skala)),
  };
}

function dach(kolor, { granice, dol, gora, kierunek = 'opadajacy' }) {
  const d = granice
    .slice(0, -1)
    .map((a, i) => {
      const b = granice[i + 1];
      // opadający: pion po lewej, spadek w dół w prawo (|\); wznoszący: spadek w górę w prawo, pion po prawej (/|)
      return kierunek === 'wznoszacy' ? `M${r(a)} ${r(dol)}L${r(b)} ${r(gora)}V${r(dol)}Z` : `M${r(a)} ${r(dol)}V${r(gora)}L${r(b)} ${r(dol)}Z`;
    })
    .join('');
  return `<path fill="${kolor}" d="${d}"/>`;
}

const rowneGranice = (n) => Array.from({ length: n + 1 }, (_, i) => (100 * i) / n);

function plik(viewBox, tresc, tytul = 'Rytm Hali') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" role="img" aria-label="${tytul}"><title>${tytul}</title>${tresc}</svg>\n`;
}

export const WARIANTY_KOLOROW = {
  jasne: { dach: KOLORY.akcent, korpus: KOLORY.grafit, litery: KOLORY.bialy, napis: KOLORY.grafit, podtytul: KOLORY.szary },
  ciemne: { dach: KOLORY.akcent, korpus: KOLORY.bialy, litery: KOLORY.grafitCiemny, napis: KOLORY.bialy, podtytul: KOLORY.szaryNaCiemnym },
  cb: { dach: KOLORY.czarny, korpus: KOLORY.czarny, litery: KOLORY.bialy, napis: KOLORY.czarny, podtytul: KOLORY.czarny },
  'cb-negatyw': { dach: KOLORY.bialy, korpus: KOLORY.bialy, litery: KOLORY.czarny, napis: KOLORY.bialy, podtytul: KOLORY.bialy },
};

/** Buduje wszystkie wersje SVG logo dla podanych parametrów. Zwraca { nazwa: svg } i wymiary pola logo pełnego. */
export async function zbudujLogo(p = PARAMETRY) {
  const fLitery = await instancja('display', p.litery.waga, p.litery.tekst);
  const fNapis = await instancja('display', p.napis.waga, p.napis.tekst);
  const fPodtytul = await instancja('sans', p.podtytul.waga, p.podtytul.tekst);

  const geom = { granice: rowneGranice(p.dach.zeby), dol: p.dach.dol, gora: p.dach.gora, kierunek: p.dach.kierunek };
  const rh = sklad(fLitery, p.litery.tekst, { wysokoscWersalikow: p.litery.wersaliki, tracking: p.litery.tracking });

  function plakietka(k, { litery = true, mala = false } = {}) {
    const korpus = mala ? p.mala.korpus : p.dach.korpus;
    let svg = dach(k.dach, mala ? { ...p.mala, kierunek: p.dach.kierunek } : geom) + `<rect x="0" y="${r(korpus)}" width="100" height="${r(100 - korpus)}" fill="${k.korpus}"/>`;
    if (litery) {
      const linia = p.dach.korpus + (100 - p.dach.korpus + p.litery.wersaliki) / 2 + p.litery.korektaY;
      svg += `<path fill="${k.litery}" d="${rh.rysuj(50 - rh.szerokosc / 2, linia)}"/>`;
    }
    return svg;
  }

  // Logo pełne: wersaliki napisu od górnej krawędzi korpusu, linia bazowa podtytułu na dolnej krawędzi plakietki.
  const napis = sklad(fNapis, p.napis.tekst, { wysokoscWersalikow: p.napis.wersaliki, tracking: p.napis.tracking, kerning: p.napis.kerning });
  const bazowy = sklad(fPodtytul, p.podtytul.tekst, { wysokoscWersalikow: p.podtytul.wersaliki, tracking: p.podtytul.tracking ?? 0 });
  let podtytul = bazowy;
  if (p.podtytul.wyjustuj === 'rozmiar') {
    // Szerokość rośnie liniowo z rozmiarem (światło jest w em), więc wystarczy proporcja.
    const wersaliki = (p.podtytul.wersaliki * napis.szerokosc) / bazowy.szerokosc;
    podtytul = sklad(fPodtytul, p.podtytul.tekst, { wysokoscWersalikow: wersaliki, tracking: p.podtytul.tracking ?? 0 });
  } else if (p.podtytul.wyjustuj) {
    podtytul = sklad(fPodtytul, p.podtytul.tekst, {
      wysokoscWersalikow: p.podtytul.wersaliki,
      tracking: (napis.szerokosc - bazowy.szerokosc) / ([...p.podtytul.tekst].length - 1) / bazowy.rozmiar,
    });
  }
  const x0 = 100 + p.napis.odstep;
  const liniaNapisu = (p.napis.gora ?? p.dach.korpus) + p.napis.wersaliki;
  const dol = r(100 + Math.ceil(podtytul.zejscie * 10) / 10);
  const szerokosc = r(x0 + Math.max(napis.szerokosc, podtytul.szerokosc));
  const pelne = (k) =>
    plik(
      `0 0 ${szerokosc} ${dol}`,
      plakietka(k) + `<path fill="${k.napis}" d="${napis.rysuj(x0, liniaNapisu)}"/>` + `<path fill="${k.podtytul}" d="${podtytul.rysuj(x0, 100)}"/>`,
    );

  // Kompaktowe: bez podtytułu, napis wyśrodkowany w pionie na korpusie.
  const napisK = sklad(fNapis, p.napis.tekst, { wysokoscWersalikow: p.kompakt.wersaliki, tracking: p.napis.tracking, kerning: p.napis.kerning });
  const szerokoscK = r(x0 + napisK.szerokosc);
  const liniaK = p.dach.korpus + (100 - p.dach.korpus + p.kompakt.wersaliki) / 2;
  const kompakt = (k) => plik(`0 0 ${szerokoscK} 100`, plakietka(k) + `<path fill="${k.napis}" d="${napisK.rysuj(x0, liniaK)}"/>`);

  const svg = {};
  for (const [nazwa, k] of Object.entries(WARIANTY_KOLOROW)) svg[`rytm-hali-${nazwa}`] = pelne(k);
  svg['rytm-hali-kompakt-jasne'] = kompakt(WARIANTY_KOLOROW.jasne);
  svg['rytm-hali-kompakt-ciemne'] = kompakt(WARIANTY_KOLOROW.ciemne);
  svg['rytm-hali-ikona'] = plik('0 0 100 100', plakietka(WARIANTY_KOLOROW.jasne));
  svg['rytm-hali-ikona-cb'] = plik('0 0 100 100', plakietka(WARIANTY_KOLOROW.cb));
  svg['rytm-hali-ikona-mala'] = plik('0 0 100 100', plakietka(WARIANTY_KOLOROW.jasne, { litery: false, mala: true }));
  return { svg, pole: { szerokosc, wysokosc: dol } };
}
