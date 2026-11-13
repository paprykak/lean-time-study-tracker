// Rysunek 1 do artykułu „kompletacja-droga”: o ile krótsza jest droga kompletującego niż przy losowym
// rozmieszczeniu i trasie S-shape, dla zamówień z 5, 15 i 30 pozycjami (symulacja redakcji, dane fikcyjne; wyniki.json).
import { readFileSync, writeFileSync } from 'node:fs';

const dane = JSON.parse(readFileSync(new URL('./wyniki.json', import.meta.url), 'utf8'));
const WARIANTY = [
  ['losowe + largest gap', 'Tylko trasa (largest gap)', '#58626f'],
  ['wg rotacji + S-shape', 'Tylko rozmieszczenie wg rotacji', '#1d2530'],
  ['wg rotacji + largest gap', 'Trasa i rozmieszczenie razem', '#c2410c'],
];
const GRUPY = [['5_pozycji', 'Zamówienie z 5 pozycjami'], ['15_pozycji', 'Z 15 pozycjami'], ['30_pozycji', 'Z 30 pozycjami']];
const W = 440, lewy = 12, prawy = 52, gora = 30, grupa = 112, slupek = 16, max = 50;
const H = gora + grupa * GRUPY.length + 34;
const skala = (W - lewy - prawy) / max;
const x = (p) => lewy + p * skala;
const f = 'font-family="Noto Sans, Arial, Helvetica, sans-serif"';
const pl = (n) => n.toLocaleString('pl-PL', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
const czesci = [];
const dol = gora + grupa * GRUPY.length;
for (const p of [0, 10, 20, 30, 40, 50]) {
  czesci.push(`<line x1="${x(p)}" y1="${gora - 6}" x2="${x(p)}" y2="${dol}" stroke="#dde1e6" stroke-width="1"/>`);
  czesci.push(`<text x="${x(p)}" y="${dol + 22}" ${f} font-size="14" fill="#58626f" text-anchor="${p === 0 ? 'start' : p === max ? 'end' : 'middle'}">${p}%</text>`);
}
czesci.push(`<text x="${lewy}" y="${gora - 12}" ${f} font-size="14" fill="#58626f">Droga krótsza niż przy losowym układzie i trasie S-shape</text>`);
GRUPY.forEach(([klucz, nazwa], g) => {
  const y0 = gora + g * grupa;
  czesci.push(`<rect x="${lewy - 6}" y="${y0 + 3}" width="${W - lewy}" height="18" fill="#ffffff"/>`);
  czesci.push(`<text x="${lewy}" y="${y0 + 17}" ${f} font-size="15" font-weight="700" fill="#1d2530">${nazwa}</text>`);
  WARIANTY.forEach(([k, opis, kolor], i) => {
    const v = dane[klucz].krocej_niz_losowe_S_shape_proc[k];
    const y = y0 + 26 + i * 28;
    czesci.push(`<rect x="${lewy}" y="${y}" width="${Math.max(2, v * skala).toFixed(1)}" height="${slupek}" fill="${kolor}"/>`);
    czesci.push(`<text x="${(x(v) + 6).toFixed(1)}" y="${y + 13}" ${f} font-size="15" font-weight="700" fill="${kolor}">${pl(v)}%</text>`);
  });
});
// Legenda pod osią
const legenda = WARIANTY.map(([, opis, kolor], i) => `<rect x="${lewy}" y="${dol + 34 + i * 20}" width="12" height="12" fill="${kolor}"/><text x="${lewy + 18}" y="${dol + 45 + i * 20}" ${f} font-size="14" fill="#1d2530">${opis}</text>`).join('');
const H2 = H + 64;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H2}" width="${W}" height="${H2}" role="img"><rect width="100%" height="100%" fill="#ffffff"/>${czesci.join('')}${legenda}</svg>\n`;
writeFileSync(new URL('../../../src/assets/rysunki/kompletacja-droga-1.svg', import.meta.url), svg);
console.log(`zapisano src/assets/rysunki/kompletacja-droga-1.svg (${W}×${H2})`);
