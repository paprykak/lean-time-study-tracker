// Rysunek 1 do artykułu „grafik-zmian-wypadki”: o ile wyższe jest ryzyko wypadku na kolejnych zmianach nocnych
// i dziennych niż na pierwszej zmianie w serii. Dane: Folkard, Lombardi, Tucker (2005), Industrial Health 43(1):20–23, s. 21
// („about 6% higher on the second night, 17% higher on the third night, and 36% higher on the fourth night”;
// dla zmian rannych/dziennych +2%, +7%, +17%; 7 i 5 badań). Słupki od zera, w procentach przyrostu.
import { writeFileSync } from 'node:fs';
const NOCE = [0, 6, 17, 36], DNI = [0, 2, 7, 17];
const W = 440, H = 300, L = 44, R = 14, T = 34, B = 70, max = 40;
const f = 'font-family="Noto Sans, Arial, Helvetica, sans-serif"';
const y = (v) => T + (1 - v / max) * (H - T - B);
const gw = (W - L - R) / 4, bw = 26;
const c = [];
for (const v of [0, 10, 20, 30, 40]) {
  c.push(`<line x1="${L}" y1="${y(v)}" x2="${W - R}" y2="${y(v)}" stroke="#dde1e6"/>`);
  c.push(`<text x="${L - 6}" y="${y(v) + 5}" ${f} font-size="13" fill="#58626f" text-anchor="end">${v}%</text>`);
}
c.push(`<text x="${L}" y="${T - 14}" ${f} font-size="14" fill="#58626f">O ile wyższe ryzyko wypadku niż na pierwszej zmianie w serii</text>`);
for (let i = 0; i < 4; i++) {
  const cx = L + gw * i + gw / 2;
  for (const [v, k, dx] of [[DNI[i], '#58626f', -bw - 2], [NOCE[i], '#c2410c', 2]]) {
    const top = y(v), base = y(0);
    c.push(`<rect x="${cx + dx}" y="${top.toFixed(1)}" width="${bw}" height="${Math.max(1.5, base - top).toFixed(1)}" fill="${k}"/>`);
    c.push(`<text x="${cx + dx + bw / 2}" y="${(top - 6).toFixed(1)}" ${f} font-size="13" font-weight="700" fill="${k}" text-anchor="middle">${i === 0 ? '0' : '+' + v + '%'}</text>`);
  }
  c.push(`<text x="${cx}" y="${H - B + 20}" ${f} font-size="14" fill="#1d2530" text-anchor="middle">${i + 1}. zmiana</text>`);
}
const leg = [['#c2410c', 'Kolejne noce (7 badań)'], ['#58626f', 'Kolejne zmiany ranne lub dzienne (5 badań)']];
leg.forEach(([k, o], i) => c.push(`<rect x="${L}" y="${H - B + 34 + i * 20}" width="12" height="12" fill="${k}"/><text x="${L + 18}" y="${H - B + 45 + i * 20}" ${f} font-size="13" fill="#1d2530">${o}</text>`));
writeFileSync(new URL('../../../src/assets/rysunki/grafik-zmian-wypadki-1.svg', import.meta.url),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img"><rect width="100%" height="100%" fill="#ffffff"/>${c.join('')}</svg>\n`);
console.log('zapisano src/assets/rysunki/grafik-zmian-wypadki-1.svg', W, H);
