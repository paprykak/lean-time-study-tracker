// Rysunek 1 do artykułu „krzywa-uczenia”: czas ręcznego montażu wiązki przewodów według numeru sztuki
// (Kleiza i Tilindis 2014, tabela 1, eksperyment 1) i czas ustalony (średnia od sztuki 163; wyniki.json).
import { readFileSync, writeFileSync } from 'node:fs';

const w = JSON.parse(readFileSync(new URL('./wyniki.json', import.meta.url), 'utf8'));
const P = [[2, 6.88], [44, 3.078], [100, 2.423], [163, 2.047], [172, 2.128], [204, 2.224], [236, 2.212], [268, 2.178], [301, 2.233], [349, 2.114], [396, 2.101], [428, 2.136], [460, 2.14]];
const W = 440, H = 330, lewy = 44, prawy = 16, gora = 34, dol = 46;
const sx = (n) => lewy + (n / 480) * (W - lewy - prawy);
const sy = (h) => gora + (1 - h / 7.5) * (H - gora - dol);
const f = 'font-family="Noto Sans, Arial, Helvetica, sans-serif"';
const pl = (v) => v.toLocaleString('pl-PL', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
const c = [];
for (const h of [0, 2, 4, 6]) {
  c.push(`<line x1="${lewy}" y1="${sy(h)}" x2="${W - prawy}" y2="${sy(h)}" stroke="#dde1e6"/>`);
  c.push(`<text x="${lewy - 8}" y="${sy(h) + 5}" ${f} font-size="14" fill="#58626f" text-anchor="end">${h} h</text>`);
}
for (const n of [0, 100, 200, 300, 400]) {
  c.push(`<text x="${sx(n)}" y="${H - dol + 22}" ${f} font-size="14" fill="#58626f" text-anchor="middle">${n}</text>`);
}
c.push(`<text x="${(lewy + W - prawy) / 2}" y="${H - 6}" ${f} font-size="14" fill="#58626f" text-anchor="middle">Numer zmontowanej sztuki</text>`);
c.push(`<text x="${lewy - 36}" y="${gora - 14}" ${f} font-size="14" fill="#58626f">Czas montażu jednej wiązki</text>`);
const ust = w.czas_ustalony_h;
c.push(`<line x1="${lewy}" y1="${sy(ust)}" x2="${W - prawy}" y2="${sy(ust)}" stroke="#c2410c" stroke-width="2" stroke-dasharray="6 4"/>`);
c.push(`<text x="${W - prawy}" y="${sy(ust) - 8}" ${f} font-size="14" font-weight="700" fill="#c2410c" text-anchor="end">czas ustalony ${pl(ust)} h</text>`);
c.push(`<polyline points="${P.map(([n, h]) => `${sx(n).toFixed(1)},${sy(h).toFixed(1)}`).join(' ')}" fill="none" stroke="#1d2530" stroke-width="2.5"/>`);
for (const [n, h] of P) c.push(`<circle cx="${sx(n).toFixed(1)}" cy="${sy(h).toFixed(1)}" r="4" fill="#1d2530"/>`);
c.push(`<text x="${sx(2) + 10}" y="${sy(6.88) + 5}" ${f} font-size="14" font-weight="700" fill="#1d2530">6,88 h przy 2. sztuce</text>`);
c.push(`<text x="${sx(163)}" y="${sy(2.047) + 26}" ${f} font-size="14" fill="#1d2530" text-anchor="middle">2,05 h przy 163.</text>`);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img"><rect width="100%" height="100%" fill="#ffffff"/>${c.join('')}</svg>\n`;
writeFileSync(new URL('../../../src/assets/rysunki/krzywa-uczenia-1.svg', import.meta.url), svg);
console.log(`zapisano src/assets/rysunki/krzywa-uczenia-1.svg (${W}×${H})`);
