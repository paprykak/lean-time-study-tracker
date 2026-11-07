// Rysunek 1 do artykułu „prognozowanie-popytu”: o ile zwycięzca konkursu M5 był dokładniejszy od najlepszej
// z 24 metod porównawczych organizatorów na każdym z 12 poziomów agregacji (dane: m5-wyniki.json z m5.py).
// Układ wąski, etykiety nad słupkami (obraz wypełnia kolumnę tekstu: na telefonie napisy ok. 12 px).
import { readFileSync, writeFileSync } from 'node:fs';

const dane = JSON.parse(readFileSync(new URL('./m5-wyniki.json', import.meta.url), 'utf8'));
const poprawa = dane.poprawa_zwyciezcy_nad_najlepszym_benchmarkiem_wg_poziomu_proc;
const POZIOMY = [
  ['L1', 'Cała sieć', '1 szereg'],
  ['L2', 'Stan', '3 szeregi'],
  ['L3', 'Sklep', '10'],
  ['L4', 'Kategoria', '3'],
  ['L5', 'Dział', '7'],
  ['L6', 'Stan × kategoria', '9'],
  ['L7', 'Stan × dział', '21'],
  ['L8', 'Sklep × kategoria', '30'],
  ['L9', 'Sklep × dział', '70'],
  ['L10', 'Produkt, suma sklepów', '3 049'],
  ['L11', 'Produkt × stan', '9 147'],
  ['L12', 'Produkt w sklepie', '30 490'],
];
const KOLOR = { tekst: '#1d2530', drugi: '#58626f', linia: '#dde1e6', slupek: '#1d2530', akcent: '#c2410c' };
const W = 440, lewy = 12, prawy = 52, gora = 30, wiersz = 46, slupek = 16, max = 50;
const H = gora + wiersz * POZIOMY.length + 34;
const skala = (W - lewy - prawy) / max;
const x = (p) => lewy + p * skala;
const f = 'font-family="Noto Sans, Arial, Helvetica, sans-serif"';
const pl = (n) => n.toLocaleString('pl-PL', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const czesci = [];
const dol = gora + wiersz * POZIOMY.length;
for (const p of [0, 10, 20, 30, 40, 50]) {
  czesci.push(`<line x1="${x(p)}" y1="${gora - 6}" x2="${x(p)}" y2="${dol}" stroke="${KOLOR.linia}" stroke-width="1"/>`);
  czesci.push(`<text x="${x(p)}" y="${dol + 22}" ${f} font-size="14" fill="${KOLOR.drugi}" text-anchor="${p === 0 ? 'start' : p === max ? 'end' : 'middle'}">${p}%</text>`);
}
czesci.push(`<text x="${lewy}" y="${gora - 12}" ${f} font-size="14" fill="${KOLOR.drugi}">Poziom (liczba szeregów)</text>`);
POZIOMY.forEach(([kod, nazwa, ile], i) => {
  const y = gora + i * wiersz;
  const v = poprawa[kod];
  const produkt = i >= 9;
  const kolor = produkt ? KOLOR.akcent : KOLOR.slupek;
  czesci.push(`<rect x="${lewy - 6}" y="${y + 3}" width="${W - lewy}" height="18" fill="#ffffff"/>`);
  czesci.push(`<text x="${lewy}" y="${y + 17}" ${f} font-size="15" fill="${KOLOR.tekst}" font-weight="${produkt ? 700 : 400}">${nazwa} <tspan fill="${KOLOR.drugi}" font-weight="400">(${ile})</tspan></text>`);
  czesci.push(`<rect x="${lewy}" y="${y + 23}" width="${Math.max(2, v * skala).toFixed(1)}" height="${slupek}" fill="${kolor}"/>`);
  czesci.push(`<text x="${(x(v) + 6).toFixed(1)}" y="${y + 37}" ${f} font-size="15" font-weight="700" fill="${kolor}">${pl(v)}%</text>`);
});
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img"><rect width="100%" height="100%" fill="#ffffff"/>${czesci.join('')}</svg>\n`;
writeFileSync(new URL('../../../src/assets/rysunki/prognozowanie-popytu-1.svg', import.meta.url), svg);
console.log(`zapisano src/assets/rysunki/prognozowanie-popytu-1.svg (${W}×${H})`);
