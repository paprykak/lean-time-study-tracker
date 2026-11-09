// Rysunek 1 do artykułu „inwentaryzacja-ciagla”: odsetek indeksów z błędnym stanem w ciągu roku
// przy spisie rocznym i przy liczeniu cyklicznym (model redakcji, dane fikcyjne; wyniki.json).
import { readFileSync, writeFileSync } from 'node:fs';
const d = JSON.parse(readFileSync(new URL('./wyniki.json', import.meta.url), 'utf8'));
const roczny = d.krzywa_roczny_p0005, cykl = d.cykliczny_p0005, cykl2 = d['p=0.002'].cykliczny_srednio_proc;
const W = 440, H = 330, L = 44, R = 14, T = 34, B = 64, max = 70;
const x = (t) => L + (t / 250) * (W - L - R), y = (v) => T + (1 - v / max) * (H - T - B);
const f = 'font-family="Noto Sans, Arial, Helvetica, sans-serif"';
const c = [];
for (const v of [0, 10, 20, 30, 40, 50, 60, 70]) {
  c.push(`<line x1="${L}" y1="${y(v)}" x2="${W - R}" y2="${y(v)}" stroke="#dde1e6"/>`);
  c.push(`<text x="${L - 6}" y="${y(v) + 5}" ${f} font-size="13" fill="#58626f" text-anchor="end">${v}%</text>`);
}
for (const [t, n] of [[0, 'styczeń'], [63, 'kwiecień'], [125, 'lipiec'], [188, 'październik']]) {
  c.push(`<text x="${x(t)}" y="${H - B + 20}" ${f} font-size="13" fill="#58626f" text-anchor="${t === 0 ? 'start' : t === 250 ? 'end' : 'middle'}">${n}</text>`);
}
c.push(`<text x="${L}" y="${T - 14}" ${f} font-size="14" fill="#58626f">Indeksy z błędnym stanem w systemie</text>`);
const pts = roczny.map((v, t) => `${x(t).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
c.push(`<polyline points="${pts}" fill="none" stroke="#1d2530" stroke-width="3"/>`);
c.push(`<line x1="${x(0)}" y1="${y(cykl)}" x2="${x(250)}" y2="${y(cykl)}" stroke="#c2410c" stroke-width="3"/>`);
c.push(`<line x1="${x(0)}" y1="${y(cykl2)}" x2="${x(250)}" y2="${y(cykl2)}" stroke="#c2410c" stroke-width="3" stroke-dasharray="7 5"/>`);
const pl = (v) => v.toLocaleString('pl-PL', { maximumFractionDigits: 0 });
c.push(`<text x="${x(250) - 2}" y="${y(roczny[250]) - 8}" ${f} font-size="15" font-weight="700" fill="#1d2530" text-anchor="end">${pl(roczny[250])}%</text>`);
c.push(`<text x="${x(250) - 2}" y="${y(cykl) - 8}" ${f} font-size="15" font-weight="700" fill="#c2410c" text-anchor="end">${pl(cykl)}%</text>`);
c.push(`<text x="${x(250) - 2}" y="${y(cykl2) - 8}" ${f} font-size="15" font-weight="700" fill="#c2410c" text-anchor="end">${pl(cykl2)}%</text>`);
const leg = [['#1d2530', '', 'Spis raz w roku (w styczniu)'], ['#c2410c', '', 'Liczenie cykliczne według rotacji'], ['#c2410c', '7 5', 'Liczenie cykliczne i mniej błędów przy operacjach']];
leg.forEach(([k, dash, opis], i) => {
  const yy = H - B + 36 + i * 18;
  c.push(`<line x1="${L}" y1="${yy}" x2="${L + 24}" y2="${yy}" stroke="${k}" stroke-width="3" ${dash ? `stroke-dasharray="${dash}"` : ''}/><text x="${L + 32}" y="${yy + 5}" ${f} font-size="13" fill="#1d2530">${opis}</text>`);
});
const H2 = H + 40;
writeFileSync(new URL('../../../src/assets/rysunki/inwentaryzacja-ciagla-1.svg', import.meta.url),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H2}" width="${W}" height="${H2}" role="img"><rect width="100%" height="100%" fill="#ffffff"/>${c.join('')}</svg>\n`);
console.log('zapisano src/assets/rysunki/inwentaryzacja-ciagla-1.svg', W, H2);
