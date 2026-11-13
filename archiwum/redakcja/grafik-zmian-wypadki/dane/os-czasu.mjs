// Rysunek 2 do artykułu „grafik-zmian-wypadki”: nocna zmiana 18:00–6:00 z przerwami o 22:00 i 1:00 (po 15 min, minimum z art. 134 KP)
// w zakładzie z przykładu (dane fikcyjne). Odcinki pracy: 4 h, 2 h 45 min, 4 h 45 min.
import { writeFileSync } from 'node:fs';
const W = 440, L = 16, R = 16, T = 34, f = 'font-family="Noto Sans, Arial, Helvetica, sans-serif"';
const x = (h) => L + (h / 12) * (W - L - R); // h: godziny od 18:00
const odc = [[0, 4, 'praca', '4 h'], [4, 4.25, 'przerwa'], [4.25, 7, 'praca', '2 h 45 min'], [7, 7.25, 'przerwa'], [7.25, 12, 'praca', '4 h 45 min', true]];
const c = [`<text x="${L}" y="${T - 14}" ${f} font-size="14" fill="#58626f">Nocna zmiana 18:00–6:00, przerwy 2 × 15 min (dane fikcyjne)</text>`];
const y = T + 10, h = 34;
for (const [a, b, rodzaj, opis, akcent] of odc) {
  const kolor = rodzaj === 'przerwa' ? '#ffffff' : akcent ? '#c2410c' : '#58626f';
  c.push(`<rect x="${x(a).toFixed(1)}" y="${y}" width="${(x(b) - x(a)).toFixed(1)}" height="${h}" fill="${kolor}" stroke="#1d2530" stroke-width="1"/>`);
  if (opis) c.push(`<text x="${((x(a) + x(b)) / 2).toFixed(1)}" y="${y + h / 2 + 5}" ${f} font-size="13" font-weight="700" fill="#ffffff" text-anchor="middle">${opis}</text>`);
}
for (const [g, et] of [[0, '18:00'], [4, '22:00'], [7, '1:00'], [12, '6:00']]) {
  c.push(`<line x1="${x(g)}" y1="${y + h}" x2="${x(g)}" y2="${y + h + 8}" stroke="#1d2530"/>`);
  c.push(`<text x="${x(g)}" y="${y + h + 24}" ${f} font-size="13" fill="#1d2530" text-anchor="${g === 0 ? 'start' : g === 12 ? 'end' : 'middle'}">${et}</text>`);
}
c.push(`<text x="${W - R}" y="${y + h + 46}" ${f} font-size="13" fill="#c2410c" text-anchor="end">najdłuższy odcinek bez przerwy:</text>`);
c.push(`<text x="${W - R}" y="${y + h + 63}" ${f} font-size="13" fill="#c2410c" text-anchor="end">od 8. do 12. godziny zmiany, nad ranem</text>`);
const H = y + h + 76;
writeFileSync(new URL('../../../src/assets/rysunki/grafik-zmian-wypadki-2.svg', import.meta.url),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img"><rect width="100%" height="100%" fill="#ffffff"/>${c.join('')}</svg>\n`);
console.log('zapisano src/assets/rysunki/grafik-zmian-wypadki-2.svg', W, H);
