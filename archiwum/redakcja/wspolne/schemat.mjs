// Wspólny generator schematów procesu (SVG 440 px, czytelny na telefonie) dla rysunków w artykułach.
// schemat({ plik, tytul, kroki: [{ nr, tekst, akcent? }], petla?: 'tekst strzałki powrotnej' })
// Każdy krok: pole z numerem i tekstem (do ok. 60 znaków, łamany automatycznie), strzałki w dół.
import { writeFileSync } from 'node:fs';

const f = 'font-family="Noto Sans, Arial, Helvetica, sans-serif"';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

function lamanie(tekst, max = 44) {
  const slowa = tekst.split(' ');
  const linie = [];
  let l = '';
  for (const s of slowa) {
    if ((l + ' ' + s).trim().length > max) { linie.push(l.trim()); l = s; } else l += ' ' + s;
  }
  if (l.trim()) linie.push(l.trim());
  return linie;
}

export function schemat({ plik, tytul, kroki, petla }) {
  const W = 440, L = 12, Rm = petla ? 46 : 12, T = 30, odstep = 22, lh = 19;
  const szer = W - L - Rm;
  const c = [`<text x="${L}" y="${T - 12}" ${f} font-size="14" fill="#58626f">${esc(tytul)}</text>`];
  let y = T;
  const srodki = [];
  kroki.forEach((k, i) => {
    const linie = lamanie(k.tekst);
    const h = 18 + linie.length * lh;
    const kolor = k.akcent ? '#c2410c' : '#1d2530';
    c.push(`<rect x="${L}" y="${y}" width="${szer}" height="${h}" rx="6" fill="${k.akcent ? '#fff4ed' : '#f3f4f6'}" stroke="${kolor}" stroke-width="${k.akcent ? 2 : 1}"/>`);
    c.push(`<circle cx="${L + 22}" cy="${y + h / 2}" r="13" fill="${kolor}"/>`);
    c.push(`<text x="${L + 22}" y="${y + h / 2 + 5}" ${f} font-size="14" font-weight="700" fill="#ffffff" text-anchor="middle">${esc(k.nr ?? i + 1)}</text>`);
    linie.forEach((ln, j) => c.push(`<text x="${L + 46}" y="${y + 9 + (j + 1) * lh - 4}" ${f} font-size="14" fill="#1d2530">${esc(ln)}</text>`));
    srodki.push([y, y + h]);
    if (i < kroki.length - 1) {
      const ax = L + szer / 2;
      c.push(`<line x1="${ax}" y1="${y + h + 2}" x2="${ax}" y2="${y + h + odstep - 6}" stroke="#58626f" stroke-width="2"/>`);
      c.push(`<path d="M${ax - 5},${y + h + odstep - 9} L${ax},${y + h + odstep - 2} L${ax + 5},${y + h + odstep - 9}" fill="none" stroke="#58626f" stroke-width="2"/>`);
    }
    y += h + odstep;
  });
  if (petla) {
    const [y0] = srodki[0], [, y1] = srodki[srodki.length - 1];
    const x = W - Rm + 8, xr = W - 14;
    c.push(`<path d="M${L + szer},${y1 - 12} L${xr},${y1 - 12} L${xr},${y0 + 12} L${L + szer + 4},${y0 + 12}" fill="none" stroke="#c2410c" stroke-width="2"/>`);
    c.push(`<path d="M${L + szer + 10},${y0 + 7} L${L + szer + 3},${y0 + 12} L${L + szer + 10},${y0 + 17}" fill="none" stroke="#c2410c" stroke-width="2"/>`);
    c.push(`<text x="${xr - 6}" y="${(y0 + y1) / 2}" ${f} font-size="13" fill="#c2410c" text-anchor="middle" transform="rotate(-90 ${xr - 6} ${(y0 + y1) / 2})">${esc(petla)}</text>`);
    void x;
  }
  const H = y - odstep + 12;
  writeFileSync(plik, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img"><rect width="100%" height="100%" fill="#ffffff"/>${c.join('')}</svg>\n`);
  return { W, H };
}
