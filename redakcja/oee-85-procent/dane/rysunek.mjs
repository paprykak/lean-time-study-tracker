// Rysunek 1 do artykułu „OEE 85%”: trzy wyniki OEE tej samej (fikcyjnej) zmiany przy trzech definicjach,
// z linią 85%. Dane z wynik.json (oee-warianty.mjs). Kolory z src/styles/global.css; napisy fontem zapasowym
// (obraz w <img> nie dostaje fontów strony).
import { readFileSync, writeFileSync } from 'node:fs';

const { warianty } = JSON.parse(readFileSync(new URL('./wynik.json', import.meta.url), 'utf8'));
const KOLOR = { tekst: '#1d2530', drugi: '#58626f', linia: '#dde1e6', slupek: '#1d2530', akcent: '#c2410c' };
const ETYKIETY = [
  ['Przezbrojenia i konserwacja', 'jako strata, cykl nominalny'],
  ['Przezbrojenia i konserwacja', 'poza czasem planowanym, cykl nominalny'],
  ['Przezbrojenia i konserwacja', 'poza czasem planowanym, cykl ze standardu'],
];
const W = 760, lewy = 300, prawy = 60, gora = 40, wiersz = 76, slupek = 34;
const H = gora + wiersz * warianty.length + 40;
const skala = (W - lewy - prawy) / 100;
const x = (p) => lewy + p * skala;
const f = 'font-family="Noto Sans, Arial, Helvetica, sans-serif"';
const czesci = [];
for (const p of [0, 25, 50, 75, 100]) {
  czesci.push(`<line x1="${x(p)}" y1="${gora - 10}" x2="${x(p)}" y2="${H - 30}" stroke="${KOLOR.linia}" stroke-width="1"/>`);
  czesci.push(`<text x="${x(p)}" y="${H - 10}" ${f} font-size="14" fill="${KOLOR.drugi}" text-anchor="middle">${p}%</text>`);
}
warianty.forEach((w, i) => {
  const y = gora + i * wiersz;
  const wartosc = 100 * w.oee;
  const [l1, l2] = ETYKIETY[i];
  czesci.push(`<text x="${lewy - 14}" y="${y + 14}" ${f} font-size="15" font-weight="600" fill="${KOLOR.tekst}" text-anchor="end">${l1}</text>`);
  czesci.push(`<text x="${lewy - 14}" y="${y + 34}" ${f} font-size="14" fill="${KOLOR.drugi}" text-anchor="end">${l2}</text>`);
  czesci.push(`<rect x="${lewy}" y="${y}" width="${(wartosc * skala).toFixed(1)}" height="${slupek}" fill="${KOLOR.slupek}"/>`);
  czesci.push(`<text x="${(x(wartosc) + 8).toFixed(1)}" y="${y + 24}" ${f} font-size="17" font-weight="700" fill="${KOLOR.tekst}">${Math.round(wartosc)}%</text>`);
});
czesci.push(`<line x1="${x(85)}" y1="${gora - 22}" x2="${x(85)}" y2="${H - 30}" stroke="${KOLOR.akcent}" stroke-width="2.5" stroke-dasharray="6 5"/>`);
czesci.push(`<text x="${x(85)}" y="${gora - 26}" ${f} font-size="14" font-weight="600" fill="${KOLOR.akcent}" text-anchor="middle">85% („światowa klasa”)</text>`);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img"><rect width="100%" height="100%" fill="#ffffff"/>${czesci.join('')}</svg>\n`;
writeFileSync(new URL('../../../src/assets/rysunki/oee-85-procent-1.svg', import.meta.url), svg);
console.log(`zapisano src/assets/rysunki/oee-85-procent-1.svg (${W}×${H})`);
