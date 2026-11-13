// Zestaw znaków fontów serwisu: łacina podstawowa i Latin-1, polskie litery, typografia polska
// i kilka liter z nazw firm i miast regionu (czeskie, słowackie, węgierskie, niemieckie są w Latin-1).
// Używa go generator fontów (podzbiór i unicode-range) oraz test, który sprawdza, że w fontach są wszystkie glify.

const zakres = (od, do_) => Array.from({ length: do_ - od + 1 }, (_, i) => String.fromCodePoint(od + i)).join('');

export const POLSKIE = 'ĄąĆćĘęŁłŃńÓóŚśŹźŻż';
const REGION = 'ČčĎďĚěŇňŘřŠšŤťŮůŽžŐőŰűĹĺĽľŔŕ';
// Myślniki, cudzysłowy polskie i angielskie, wielokropek, punktor, promil, prim, cudzysłowy ostrokątne, euro, numer, znak towarowy.
// Strzałek i znaków matematycznych (≤ ≥ ≈ ≠ −) Noto Sans nie ma: biorą je fonty systemowe, a strzałki w interfejsie to ikony SVG.
const TYPOGRAFIA = '\u2070\u2074\u2075\u2076\u2077\u2078\u2079\u2009\u200A\u2011\u202F\u2013\u2014\u2018\u2019\u201A\u201C\u201D\u201E\u2026\u2022\u2030\u2032\u2033\u2039\u203A\u20AC\u2116\u2122';

export const ZNAKI = [zakres(0x20, 0x7e), zakres(0xa0, 0xff), POLSKIE, REGION, TYPOGRAFIA].join('');

/** unicode-range dla @font-face, zbudowany z tego samego zestawu (zwinięte przedziały). */
export function unicodeRange(tekst = ZNAKI) {
  const kody = [...new Set([...tekst].map((z) => z.codePointAt(0)))].sort((a, b) => a - b);
  const przedzialy = [];
  for (const k of kody) {
    const ostatni = przedzialy.at(-1);
    if (ostatni && k === ostatni[1] + 1) ostatni[1] = k;
    else przedzialy.push([k, k]);
  }
  const hex = (n) => n.toString(16).toUpperCase().padStart(4, '0');
  return przedzialy.map(([a, b]) => (a === b ? `U+${hex(a)}` : `U+${hex(a)}-${hex(b)}`)).join(', ');
}

// Tekst próbny do dopasowania metryki fontu zapasowego (częstość liter jak w polskim tekście prasowym).
export const PROBKA =
  'Kierownik zmiany sprawdza wskaźnik OEE na linii montażowej, a dział logistyki planuje dostawy do magazynu. ' +
  'Ciągłe doskonalenie zaczyna się od pomiaru: czasu cyklu, przezbrojeń i przestojów. Żółta tablica wisi przy wejściu do hali.';
