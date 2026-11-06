// Rysunek 1 do artykułu „OEE 85%”: trzy wyniki OEE tej samej (fikcyjnej) zmiany przy trzech definicjach,
// z linią 85%. Dane z wynik.json (oee-warianty.mjs). Kolory z src/styles/global.css; napisy fontem zapasowym
// (obraz w <img> nie dostaje fontów strony). Układ wąski (etykiety nad słupkami), bo obraz wypełnia kolumnę tekstu:
// na telefonie (ok. 380 px) napisy mają ok. 12 px, na komputerze (ok. 700 px) ok. 22 px.
import { readFileSync, writeFileSync } from 'node:fs';

const { warianty, cykl } = JSON.parse(readFileSync(new URL('./wynik.json', import.meta.url), 'utf8'));
const KOLOR = { tekst: '#1d2530', drugi: '#58626f', linia: '#dde1e6', slupek: '#1d2530', akcent: '#c2410c' };
// Druga linia etykiety: [tekst, wyróżnić?]. Wyróżniona (kolor akcentu, pogrubienie) jest decyzja, którą arkusz zmienia
// względem poprzedniego, żeby na telefonie od razu było widać, czym różnią się słupki.
const ETYKIETY = [
  ['Arkusz 1', [['przezbrojenia i konserwacja w stratach', false], [`, cykl producenta ${cykl.nominalnyS} s`, false]]],
  ['Arkusz 2', [['przezbrojenia i konserwacja poza planem', true], [`, cykl producenta ${cykl.nominalnyS} s`, false]]],
  ['Arkusz 3', [['przezbrojenia i konserwacja poza planem, ', false], [`norma z ERP ${cykl.standardowyS} s`, true]]],
];
const W = 520, lewy = 16, prawy = 64, gora = 44, wiersz = 92, slupek = 26;
const H = gora + wiersz * warianty.length + 30;
const skala = (W - lewy - prawy) / 100;
const x = (p) => lewy + p * skala;
const f = 'font-family="Noto Sans, Arial, Helvetica, sans-serif"';
const czesci = [];
const dolSiatki = gora + wiersz * warianty.length - 10;
for (const p of [0, 25, 50, 75, 100]) {
  czesci.push(`<line x1="${x(p)}" y1="${gora}" x2="${x(p)}" y2="${dolSiatki}" stroke="${KOLOR.linia}" stroke-width="1"/>`);
  czesci.push(`<text x="${x(p)}" y="${dolSiatki + 22}" ${f} font-size="14" fill="${KOLOR.drugi}" text-anchor="${p === 0 ? 'start' : p === 100 ? 'end' : 'middle'}">${p}%</text>`);
}
czesci.push(`<line x1="${x(85)}" y1="${gora - 14}" x2="${x(85)}" y2="${dolSiatki}" stroke="${KOLOR.akcent}" stroke-width="2.5" stroke-dasharray="6 5"/>`);
warianty.forEach((w, i) => {
  const y = gora + i * wiersz;
  const wartosc = 100 * w.oee;
  const [l1, l2] = ETYKIETY[i];
  czesci.push(`<rect x="${lewy - 6}" y="${y + 6}" width="${W - lewy + 6}" height="40" fill="#ffffff"/>`);
  czesci.push(`<text x="${lewy}" y="${y + 22}" ${f} font-size="16" font-weight="700" fill="${KOLOR.tekst}">${l1}</text>`);
  const tspany = l2.map(([t, wyr]) => (wyr ? `<tspan fill="${KOLOR.akcent}" font-weight="700">${t}</tspan>` : `<tspan>${t}</tspan>`)).join('');
  czesci.push(`<text x="${lewy}" y="${y + 41}" ${f} font-size="15" fill="${KOLOR.drugi}" xml:space="preserve">${tspany}</text>`);
  czesci.push(`<rect x="${lewy}" y="${y + 50}" width="${(wartosc * skala).toFixed(1)}" height="${slupek}" fill="${KOLOR.slupek}"/>`);
  czesci.push(`<text x="${(x(wartosc) + 8).toFixed(1)}" y="${y + 70}" ${f} font-size="18" font-weight="700" fill="${KOLOR.tekst}">${Math.round(wartosc)}%</text>`);
});
warianty.forEach((_, i) => {
  const y = gora + i * wiersz;
  czesci.push(`<line x1="${x(85)}" y1="${y + 47}" x2="${x(85)}" y2="${y + 79}" stroke="${KOLOR.akcent}" stroke-width="2.5" stroke-dasharray="6 5"/>`);
});
czesci.push(`<text x="${x(85) - 6}" y="${gora - 20}" ${f} font-size="14" font-weight="700" fill="${KOLOR.akcent}" text-anchor="end">85% („światowa klasa”)</text>`);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img"><rect width="100%" height="100%" fill="#ffffff"/>${czesci.join('')}</svg>\n`;
writeFileSync(new URL('../../../src/assets/rysunki/oee-85-procent-1.svg', import.meta.url), svg);
console.log(`zapisano src/assets/rysunki/oee-85-procent-1.svg (${W}×${H})`);
