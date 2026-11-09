// Rysunek 1 do artykułu „wycieki-sprezonego-powietrza”: roczny koszt energii jednego wycieku według średnicy otworu
// przy 6 barach, przy pracy ciągłej i na dwie zmiany (obliczenia redakcji; wyniki.json z wycieki.py).
import { readFileSync, writeFileSync } from 'node:fs';
const d = JSON.parse(readFileSync(new URL('./wyniki.json', import.meta.url), 'utf8'));
const wiersze = d.tabela.filter((w) => w.p_bar === 6);
const W = 440, L = 12, R = 70, T = 30, grupa = 74, bw = 18, max = 50000;
const H = T + grupa * wiersze.length + 74;
const f = 'font-family="Noto Sans, Arial, Helvetica, sans-serif"';
const x = (v) => L + (v / max) * (W - L - R);
const pl = (v) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const c = [];
const dol = T + grupa * wiersze.length;
for (const v of [0, 10000, 20000, 30000, 40000, 50000]) {
  c.push(`<line x1="${x(v)}" y1="${T - 6}" x2="${x(v)}" y2="${dol}" stroke="#dde1e6"/>`);
  c.push(`<text x="${x(v)}" y="${dol + 20}" ${f} font-size="13" fill="#58626f" text-anchor="${v === 0 ? 'start' : v === max ? 'end' : 'middle'}">${v / 1000} tys.</text>`);
}
c.push(`<text x="${L}" y="${T - 12}" ${f} font-size="14" fill="#58626f">Koszt energii jednego wycieku, zł rocznie (6 bar)</text>`);
wiersze.forEach((w, i) => {
  const y0 = T + i * grupa;
  c.push(`<text x="${L}" y="${y0 + 16}" ${f} font-size="15" font-weight="700" fill="#1d2530">Otwór ${w.d_mm} mm: ${pl(w.l_min)} l/min</text>`);
  [[w.pln_8760, '#c2410c'], [w.pln_4000, '#58626f']].forEach(([v, k], j) => {
    const y = y0 + 24 + j * 22;
    c.push(`<rect x="${L}" y="${y}" width="${Math.max(2, x(v) - L).toFixed(1)}" height="${bw}" fill="${k}"/>`);
    c.push(`<text x="${(x(v) + 6).toFixed(1)}" y="${y + 14}" ${f} font-size="14" font-weight="700" fill="${k}">${pl(v)} zł</text>`);
  });
});
const leg = [['#c2410c', 'Sieć pod ciśnieniem przez cały rok (8 760 h)'], ['#58626f', 'Dwie zmiany, 250 dni (4 000 h)']];
leg.forEach(([k, o], i) => c.push(`<rect x="${L}" y="${dol + 34 + i * 20}" width="12" height="12" fill="${k}"/><text x="${L + 18}" y="${dol + 45 + i * 20}" ${f} font-size="13" fill="#1d2530">${o}</text>`));
writeFileSync(new URL('../../../src/assets/rysunki/wycieki-sprezonego-powietrza-1.svg', import.meta.url),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img"><rect width="100%" height="100%" fill="#ffffff"/>${c.join('')}</svg>\n`);
console.log('zapisano src/assets/rysunki/wycieki-sprezonego-powietrza-1.svg', W, H);
