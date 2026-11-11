// Wspólne generatory rysunków do artykułów (SVG 440 px, czytelne na telefonie, kolory serwisu).
// Każda funkcja zapisuje plik i zwraca { W, H }. Napisy od 13 px, osie słupków od zera.
//
// slupki({ plik, tytul, serie: [{ nazwa, kolor? }], wiersze: [{ etykieta, wartosci: [..] }], format?, max?, krok? })
//   poziome słupki, także grupowane (kilka serii na wiersz); legenda pod osią, gdy serii jest więcej niż jedna.
// linia({ plik, tytul, x: { min, max, etykiety: [[x, 'tekst']], opis? }, y: { min, max, krok, format?, opis? },
//        serie: [{ nazwa, punkty: [[x, y]], kolor?, kreska?, grubosc?, etykieta? }], poziome?: [{ y, tekst }], pionowe?: [{ x, tekst }], obszar? })
// mapaCieplna({ plik, tytul, kolumny: [..], wiersze: [..], wartosci: [[..]], format?, min?, max?, opisKolumn?, opisWierszy?, legenda? })
// kartogram({ plik, tytul, geojson, id: (feature) => klucz, wartosci: { klucz: liczba }, obszar: [lonMin, latMin, lonMax, latMax],
//             progi: [..], format?, legenda?, podpisy?: [{ klucz, tekst?, lon?, lat? }], brak? })
// drzewo({ plik, tytul, pytania: [{ pytanie, tak, nie? }], koniec })   // „tak” prowadzi w prawo do werdyktu, „nie” w dół do kolejnego pytania
// macierz({ plik, tytul, osX: { nazwa, nisko, wysoko }, osY: { nazwa, nisko, wysoko }, cwiartki: [lewaGora, prawaGora, lewaDol, prawaDol] })
//   ćwiartka: { tytul, tekst, akcent? }
// osCzasu({ plik, tytul, od, do, odcinki: [{ od, do, etykieta, akcent? }], znaczniki?: [[t, 'tekst']], opis? })
import { writeFileSync } from 'node:fs';

export const KOLORY = { grafit: '#1d2530', szary: '#58626f', siatka: '#dde1e6', tlo: '#f3f4f6', akcent: '#c2410c', akcentJasny: '#fff4ed', seria2: '#5b6573' };
const F = 'font-family="Noto Sans, Arial, Helvetica, sans-serif"';
const W = 440;
export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const pl = (v, cyfry = 0) => Number(v).toLocaleString('pl-PL', { minimumFractionDigits: cyfry, maximumFractionDigits: cyfry, useGrouping: 'always' }).replace(/[\u00a0\u202f]/g, ' ');
const szerTekstu = (s, px) => String(s).length * px * 0.56;

export function lamanie(tekst, max = 44) {
  const linie = [];
  let l = '';
  for (const s of String(tekst).split(' ')) {
    if ((l + ' ' + s).trim().length > max && l) { linie.push(l.trim()); l = s; } else l += ' ' + s;
  }
  if (l.trim()) linie.push(l.trim());
  return linie;
}
const txt = (x, y, s, { size = 13, fill = KOLORY.grafit, anchor = 'start', weight = 400, extra = '' } = {}) =>
  `<text x="${r(x)}" y="${r(y)}" ${F} font-size="${size}" fill="${fill}" text-anchor="${anchor}"${weight !== 400 ? ` font-weight="${weight}"` : ''}${extra}>${esc(s)}</text>`;
const r = (v) => Math.round(v * 10) / 10;
function zapisz(plik, H, c) {
  writeFileSync(plik, `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${r(H)}" width="${W}" height="${r(H)}" role="img"><rect width="100%" height="100%" fill="#ffffff"/>${c.join('')}</svg>\n`);
  return { W, H: r(H) };
}
function tytulRys(c, tytul, y = 18) {
  const linie = lamanie(tytul, 58);
  linie.forEach((l, i) => c.push(txt(12, y + i * 18, l, { size: 14, fill: KOLORY.szary })));
  return y + (linie.length - 1) * 18;
}
function legenda(c, x, y, pozycje) {
  // pozycje: [{ nazwa, kolor, kreska?, linia? }]; zawija w wiersze po szerokości
  let xx = x, yy = y;
  for (const p of pozycje) {
    const w = 26 + szerTekstu(p.nazwa, 13) + 16;
    if (xx + w > W - 8 && xx > x) { xx = x; yy += 20; }
    if (p.linia) c.push(`<line x1="${xx}" y1="${yy - 4}" x2="${xx + 18}" y2="${yy - 4}" stroke="${p.kolor}" stroke-width="3"${p.kreska ? ` stroke-dasharray="${p.kreska}"` : ''}/>`);
    else c.push(`<rect x="${xx}" y="${yy - 11}" width="14" height="12" fill="${p.kolor}"/>`);
    c.push(txt(xx + 24, yy, p.nazwa));
    xx += w;
  }
  return yy;
}

export function slupki({ plik, tytul, serie, wiersze, format = (v) => pl(v), formatOsi, max, krok, etykietaSzer = 0 }) {
  const kolory = [KOLORY.akcent, KOLORY.seria2, KOLORY.grafit, '#9aa3ad'];
  const s = serie.map((x, i) => ({ ...x, kolor: x.kolor ?? kolory[i] }));
  const najw = max ?? Math.max(...wiersze.flatMap((w) => w.wartosci));
  const kr = krok ?? niceKrok(najw);
  const top = Math.ceil(najw / kr) * kr;
  const L = 12, R = 16;
  const c = [];
  let y = tytulRys(c, tytul) + 20;
  const wysSl = 14, odst = 6;
  const x = (v) => L + (v / top) * (W - L - R - etykietaSzer);
  for (const w of wiersze) {
    c.push(txt(L, y + 4, w.etykieta, { weight: 700 }));
    y += 10;
    w.wartosci.forEach((v, i) => {
      if (v == null) return;
      const xx = x(v);
      c.push(`<rect x="${L}" y="${y}" width="${r(Math.max(1, xx - L))}" height="${wysSl}" fill="${s[i].kolor}"/>`);
      const napis = format(v, i);
      const zmiesci = xx + 6 + szerTekstu(napis, 13) < W - 4;
      c.push(zmiesci ? txt(xx + 6, y + 12, napis, { fill: s[i].kolor === KOLORY.akcent ? KOLORY.akcent : KOLORY.grafit, weight: 700 })
        : txt(xx - 6, y + 12, napis, { fill: '#ffffff', anchor: 'end', weight: 700 }));
      y += wysSl + odst;
    });
    y += 10;
  }
  // oś
  const fo = formatOsi ?? ((v) => format(v, -1));
  const kreski = [];
  for (let v = 0; v <= top + 1e-9; v += kr) kreski.push(v);
  const lewaKrawedz = (v, i) => { const sz = szerTekstu(fo(v), 13); return i === 0 ? x(v) : i === kreski.length - 1 ? x(v) - sz : x(v) - sz / 2; };
  // podpisy co drugą kreskę, gdy zachodzą na siebie; skrajne zawsze
  const zachodza = kreski.some((v, i) => i > 0 && lewaKrawedz(v, i) < lewaKrawedz(kreski[i - 1], i - 1) + szerTekstu(fo(kreski[i - 1]), 13) + 8);
  kreski.forEach((v, i) => {
    c.push(`<line x1="${r(x(v))}" y1="${y - 6}" x2="${r(x(v))}" y2="${y - 1}" stroke="${KOLORY.szary}"/>`);
    const pokaz = !zachodza || i % 2 === 0 || (i === kreski.length - 1 && (kreski.length - 1) % 2 === 0);
    if (pokaz) c.push(txt(x(v), y + 13, fo(v), { fill: KOLORY.szary, anchor: i === 0 ? 'start' : i === kreski.length - 1 ? 'end' : 'middle' }));
  });
  c.push(`<line x1="${L}" y1="${y - 6}" x2="${r(x(top))}" y2="${y - 6}" stroke="${KOLORY.szary}"/>`);
  y += 22;
  if (s.length > 1) y = legenda(c, L, y + 8, s.map((x) => ({ nazwa: x.nazwa, kolor: x.kolor }))) + 4;
  return zapisz(plik, y + 8, c);
}

function niceKrok(maks, celKresek = 5) {
  const surowy = maks / celKresek;
  const p = 10 ** Math.floor(Math.log10(surowy));
  for (const m of [1, 2, 2.5, 5, 10]) if (surowy <= m * p) return m * p;
  return 10 * p;
}

export function linia({ plik, tytul, x, y, serie, poziome = [], pionowe = [], H: Hwys = 300, obszar, marginesL = 46 }) {
  const L = marginesL, R = 16;
  const c = [];
  const T = tytulRys(c, tytul) + 22;
  const B = T + Hwys - 80;
  const sx = (v) => L + ((v - x.min) / (x.max - x.min)) * (W - L - R);
  const sy = (v) => B - ((v - y.min) / (y.max - y.min)) * (B - T);
  const fy = y.format ?? ((v) => pl(v));
  for (let v = y.min; v <= y.max + 1e-9; v += y.krok) {
    c.push(`<line x1="${L}" y1="${r(sy(v))}" x2="${W - R}" y2="${r(sy(v))}" stroke="${KOLORY.siatka}"/>`);
    c.push(txt(L - 6, sy(v) + 4.5, fy(v), { fill: KOLORY.szary, anchor: 'end' }));
  }
  for (const [xv, t] of x.etykiety ?? []) c.push(txt(sx(xv), B + 18, t, { fill: KOLORY.szary, anchor: xv === x.min ? 'start' : xv === x.max ? 'end' : 'middle' }));
  if (x.opis) c.push(txt(W - R, B + 36, x.opis, { fill: KOLORY.szary, anchor: 'end' }));
  if (y.opis) c.push(txt(L, T - 8, y.opis, { fill: KOLORY.szary }));
  if (obszar) {
    const [x0, x1, kolor = KOLORY.akcentJasny, opis] = obszar;
    c.push(`<rect x="${r(sx(x0))}" y="${T}" width="${r(sx(x1) - sx(x0))}" height="${r(B - T)}" fill="${kolor}"/>`);
    if (opis) c.push(txt((sx(x0) + sx(x1)) / 2, T + (obszar[4] ?? 34), opis, { fill: KOLORY.akcent, anchor: 'middle' }));
  }
  for (const p of pionowe) {
    c.push(`<line x1="${r(sx(p.x))}" y1="${T}" x2="${r(sx(p.x))}" y2="${B}" stroke="${KOLORY.szary}" stroke-dasharray="4 4"/>`);
    if (p.tekst) c.push(txt(sx(p.x) + (p.lewo ? -5 : 5), T + 14 + (p.dy ?? 0), p.tekst, { fill: KOLORY.szary, anchor: p.lewo ? 'end' : 'start' }));
  }
  for (const p of poziome) {
    c.push(`<line x1="${L}" y1="${r(sy(p.y))}" x2="${W - R}" y2="${r(sy(p.y))}" stroke="${p.kolor ?? KOLORY.szary}" stroke-dasharray="4 4"/>`);
    if (p.tekst) c.push(txt(p.prawo === false ? L + 4 : W - R - 2, sy(p.y) - 6, p.tekst, { fill: p.kolor ?? KOLORY.szary, anchor: p.prawo === false ? 'start' : 'end' }));
  }
  const kolory = [KOLORY.akcent, KOLORY.grafit, KOLORY.seria2, '#9aa3ad'];
  serie.forEach((s, i) => {
    const kolor = s.kolor ?? kolory[i];
    const pts = s.punkty.filter(([, v]) => v != null && v <= y.max * 1.0001 && v >= y.min).map(([a, b]) => `${r(sx(a))},${r(sy(b))}`).join(' ');
    if (s.punkty.length === 1 || s.znaczniki) for (const [a, b] of s.punkty) c.push(`<circle cx="${r(sx(a))}" cy="${r(sy(b))}" r="${s.promien ?? 3.5}" fill="${kolor}"/>`);
    if (s.punkty.length > 1 && !s.tylkoZnaczniki) c.push(`<polyline points="${pts}" fill="none" stroke="${kolor}" stroke-width="${s.grubosc ?? 3}" stroke-linejoin="round"${s.kreska ? ` stroke-dasharray="${s.kreska}"` : ''}/>`);
    if (s.etykieta) {
      const [a, b, t, kotw = 'end', dx = 0, dy = -8] = s.etykieta;
      c.push(txt(sx(a) + dx, sy(b) + dy, t, { fill: kolor, anchor: kotw, weight: 700, size: 14 }));
    }
  });
  let yy = B + (x.opis ? 56 : 40);
  const leg = serie.filter((s) => s.nazwa).map((s) => ({ nazwa: s.nazwa, kolor: s.kolor ?? kolory[serie.indexOf(s)], kreska: s.kreska, linia: true }));
  if (leg.length) yy = legenda(c, L - 34, yy, leg) + 4;
  return zapisz(plik, yy + 10, c);
}

// Skala kolorów od jasnej do akcentu (5 kroków) i ciemniejsza na końcu.
export const SKALA = ['#fdf1e8', '#f9d3b5', '#f0a573', '#de6f36', '#c2410c', '#8a2e08'];
function kolorZ(v, min, max) {
  const t = Math.max(0, Math.min(1, (v - min) / (max - min || 1)));
  return SKALA[Math.min(SKALA.length - 1, Math.floor(t * (SKALA.length - 1) + 1e-9))];
}
const jasny = (k) => SKALA.indexOf(k) <= 2;

export function mapaCieplna({ plik, tytul, kolumny, wiersze, wartosci, format = (v) => pl(v), min, max, opisKolumn, opisWierszy, legenda: leg, szerEtykiet = 92, kolory }) {
  const c = [];
  let y = tytulRys(c, tytul) + 14;
  const vals = wartosci.flat().filter((v) => v != null);
  const mn = min ?? Math.min(...vals), mx = max ?? Math.max(...vals);
  const L = 12 + szerEtykiet, R = 12;
  const cw = (W - L - R) / kolumny.length, ch = 34;
  if (opisKolumn) { c.push(txt(L + (W - L - R) / 2, y + 6, opisKolumn, { fill: KOLORY.szary, anchor: 'middle' })); y += 18; }
  kolumny.forEach((k, j) => lamanie(k, Math.max(4, Math.floor(cw / 7.6))).forEach((l, i) => c.push(txt(L + cw * j + cw / 2, y + 6 + i * 15, l, { anchor: 'middle', weight: 700 }))));
  const maxLin = Math.max(...kolumny.map((k) => lamanie(k, Math.max(4, Math.floor(cw / 7.6))).length));
  y += 12 + maxLin * 15 - 6;
  const y0 = y;
  wiersze.forEach((w, i) => {
    const linie = lamanie(w, Math.floor(szerEtykiet / 7.4));
    linie.forEach((l, k) => c.push(txt(12, y + ch / 2 + 5 - (linie.length - 1) * 7.5 + k * 15, l, { weight: 700 })));
    kolumny.forEach((_, j) => {
      const v = wartosci[i][j];
      const kolor = v == null ? KOLORY.tlo : (kolory?.[i]?.[j] ?? kolorZ(v, mn, mx));
      c.push(`<rect x="${r(L + cw * j + 1)}" y="${r(y + 1)}" width="${r(cw - 2)}" height="${ch - 2}" fill="${kolor}"/>`);
      if (v != null) c.push(txt(L + cw * j + cw / 2, y + ch / 2 + 5, format(v), { anchor: 'middle', weight: 700, fill: jasny(kolor) || kolor === KOLORY.tlo ? KOLORY.grafit : '#ffffff' }));
    });
    y += ch;
  });
  if (opisWierszy) c.push(txt(12, y0 - 8 - maxLin * 15 + 6, opisWierszy, { fill: KOLORY.szary }));
  y += 22;
  if (leg !== false) {
    const kroki = SKALA.length;
    const lw = 34;
    c.push(txt(12, y + 4, leg?.tytul ?? 'Skala', { fill: KOLORY.szary }));
    const x0 = 12 + (szerTekstu(leg?.tytul ?? 'Skala', 13) + 10);
    SKALA.forEach((k, i) => c.push(`<rect x="${r(x0 + i * lw)}" y="${y - 8}" width="${lw}" height="14" fill="${k}"/>`));
    c.push(txt(x0, y + 22, leg?.lewa ?? format(mn), { fill: KOLORY.szary }));
    c.push(txt(x0 + kroki * lw, y + 22, leg?.prawa ?? format(mx), { fill: KOLORY.szary, anchor: 'end' }));
    y += 30;
  }
  return zapisz(plik, y + 6, c);
}

export function kartogram({ plik, tytul, geojson, id, wartosci, obszar, progi, format = (v) => pl(v, 1), legenda: legTytul, podpisy = [], brak = 'brak danych', wysokosc = 360 }) {
  const [lon0, lat0, lon1, lat1] = obszar;
  const k = Math.cos(((lat0 + lat1) / 2) * Math.PI / 180);
  const c = [];
  const T = tytulRys(c, tytul) + 12;
  const L = 6, R = 6;
  const sc = Math.min((W - L - R) / ((lon1 - lon0) * k), wysokosc / (lat1 - lat0));
  const mapW = (lon1 - lon0) * k * sc, mapH = (lat1 - lat0) * sc;
  const ox = L + (W - L - R - mapW) / 2;
  const px = (lon) => ox + (lon - lon0) * k * sc, py = (lat) => T + (lat1 - lat) * sc;
  const kolorProgu = (v) => { let i = 0; while (i < progi.length && v >= progi[i]) i++; return SKALA[Math.min(SKALA.length - 1, i)]; };
  c.push(`<defs><clipPath id="ramka"><rect x="${r(ox)}" y="${r(T)}" width="${r(mapW)}" height="${r(mapH)}"/></clipPath></defs><g clip-path="url(#ramka)">`);
  const sciezka = (geom) => {
    const polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.type === 'MultiPolygon' ? geom.coordinates : [];
    return polys.map((p) => p.map((ring) => 'M' + ring.map(([a, b]) => `${r(px(a))},${r(py(b))}`).join('L') + 'Z').join('')).join('');
  };
  for (const f of geojson.features) {
    const klucz = id(f);
    const v = wartosci[klucz];
    const kolor = v == null ? '#e9ecef' : kolorProgu(v);
    const d = sciezka(f.geometry);
    if (d) c.push(`<path d="${d}" fill="${kolor}" stroke="#ffffff" stroke-width="0.7"/>`);
  }
  c.push('</g>');
  for (const p of podpisy) {
    const f = geojson.features.find((x) => id(x) === p.klucz);
    if (!f && p.lon == null) continue;
    const [lo, la] = p.lon != null ? [p.lon, p.lat] : srodek(f.geometry);
    const v = wartosci[p.klucz];
    const kolor = v == null ? '#e9ecef' : kolorProgu(v);
    const napis = p.tekst ?? (v == null ? '' : format(v));
    const fill = jasny(kolor) || kolor === '#e9ecef' ? KOLORY.grafit : '#ffffff';
    c.push(txt(px(lo) + (p.dx ?? 0), py(la) + 5 + (p.dy ?? 0), napis, { anchor: 'middle', weight: 700, fill: p.kolorTekstu ?? fill, size: p.size ?? 13 }));
  }
  let y = T + mapH + 22;
  const etyk = [];
  const granice = [null, ...progi];
  granice.forEach((g, i) => {
    if (i > SKALA.length - 1) return;
    const nast = progi[i];
    const opis = g == null ? `poniżej ${format(nast)}` : nast == null ? `${format(g)} i więcej` : `${format(g)}–${format(nast)}`;
    etyk.push({ nazwa: opis, kolor: SKALA[i] });
  });
  etyk.push({ nazwa: brak, kolor: '#e9ecef' });
  if (legTytul) { c.push(txt(12, y, legTytul, { fill: KOLORY.szary })); y += 20; }
  y = legenda(c, 12, y, etyk);
  return zapisz(plik, y + 10, c);
}
function srodek(geom) {
  // środek największego pierścienia (średnia wierzchołków), wystarczy do podpisu
  const polys = geom.type === 'Polygon' ? [geom.coordinates] : geom.coordinates;
  let best = null, bestN = -1;
  for (const p of polys) {
    const ring = p[0];
    let a = 0;
    for (let i = 0; i < ring.length - 1; i++) a += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
    if (Math.abs(a) > bestN) { bestN = Math.abs(a); best = ring; }
  }
  const n = best.length - 1;
  return [best.slice(0, n).reduce((s, q) => s + q[0], 0) / n, best.slice(0, n).reduce((s, q) => s + q[1], 0) / n];
}

export function drzewo({ plik, tytul, pytania, koniec, szerPytania = 232 }) {
  const c = [];
  let y = tytulRys(c, tytul) + 18;
  const L = 12, xW = L + szerPytania + 34, szerW = W - xW - 10, lh = 17;
  pytania.forEach((p, i) => {
    const lp = lamanie(p.pytanie, Math.floor((szerPytania - 20) / 7.3));
    const lw = lamanie(p.tak, Math.floor((szerW - 16) / 7.3));
    const h = Math.max(lp.length, lw.length) * lh + 18;
    c.push(`<rect x="${L}" y="${y}" width="${szerPytania}" height="${h}" rx="6" fill="${KOLORY.tlo}" stroke="${KOLORY.grafit}"/>`);
    lp.forEach((l, k) => c.push(txt(L + 10, y + 9 + (k + 1) * lh - 4 + (h - 18 - lp.length * lh) / 2, l)));
    // tak → werdykt
    const ym = y + h / 2;
    c.push(`<line x1="${L + szerPytania}" y1="${r(ym)}" x2="${xW - 6}" y2="${r(ym)}" stroke="${KOLORY.akcent}" stroke-width="2"/><path d="M${xW - 11},${r(ym - 5)} L${xW - 4},${r(ym)} L${xW - 11},${r(ym + 5)}" fill="none" stroke="${KOLORY.akcent}" stroke-width="2"/>`);
    c.push(txt(L + szerPytania + 15, ym - 9, 'tak', { fill: KOLORY.akcent, anchor: 'middle', weight: 700 }));
    c.push(`<rect x="${xW}" y="${y}" width="${szerW}" height="${h}" rx="6" fill="${KOLORY.akcentJasny}" stroke="${KOLORY.akcent}" stroke-width="2"/>`);
    lw.forEach((l, k) => c.push(txt(xW + 8, y + 9 + (k + 1) * lh - 4 + (h - 18 - lw.length * lh) / 2, l)));
    y += h;
    // nie → w dół
    const ax = L + szerPytania / 2;
    c.push(`<line x1="${ax}" y1="${y + 2}" x2="${ax}" y2="${y + 24}" stroke="${KOLORY.szary}" stroke-width="2"/><path d="M${ax - 5},${y + 19} L${ax},${y + 26} L${ax + 5},${y + 19}" fill="none" stroke="${KOLORY.szary}" stroke-width="2"/>`);
    c.push(txt(ax + 8, y + 18, 'nie', { fill: KOLORY.szary, weight: 700 }));
    y += 30;
  });
  const lk = lamanie(koniec, Math.floor((W - 2 * L - 20) / 7.3));
  const hk = lk.length * lh + 18;
  c.push(`<rect x="${L}" y="${y}" width="${W - 2 * L}" height="${hk}" rx="6" fill="#ffffff" stroke="${KOLORY.grafit}" stroke-width="2"/>`);
  lk.forEach((l, k) => c.push(txt(L + 10, y + 9 + (k + 1) * lh - 4, l, { weight: 700 })));
  return zapisz(plik, y + hk + 10, c);
}

export function macierz({ plik, tytul, osX, osY, cwiartki, wys = 236 }) {
  const c = [];
  const T = tytulRys(c, tytul) + 30;
  const L = 34, R = 10, size = W - L - R, h = wys, cw = size / 2, chh = h / 2;
  const poz = [[L, T], [L + cw, T], [L, T + chh], [L + cw, T + chh]];
  cwiartki.forEach((q, i) => {
    const [x, y] = poz[i];
    c.push(`<rect x="${x + 2}" y="${y + 2}" width="${cw - 4}" height="${chh - 4}" rx="6" fill="${q.akcent ? KOLORY.akcentJasny : KOLORY.tlo}" stroke="${q.akcent ? KOLORY.akcent : KOLORY.siatka}" stroke-width="${q.akcent ? 2 : 1}"/>`);
    lamanie(q.tytul, 24).forEach((l, k) => c.push(txt(x + 12, y + 24 + k * 17, l, { weight: 700, size: 14, fill: q.akcent ? KOLORY.akcent : KOLORY.grafit })));
    const off = lamanie(q.tytul, 24).length * 17;
    lamanie(q.tekst, 26).forEach((l, k) => c.push(txt(x + 12, y + 28 + off + k * 16, l)));
  });
  // osie
  c.push(`<line x1="${L}" y1="${T + h + 8}" x2="${L + size}" y2="${T + h + 8}" stroke="${KOLORY.szary}" stroke-width="1.5"/><path d="M${L + size - 8},${T + h + 3} L${L + size},${T + h + 8} L${L + size - 8},${T + h + 13}" fill="none" stroke="${KOLORY.szary}" stroke-width="1.5"/>`);
  c.push(txt(L, T + h + 26, osX.nisko, { fill: KOLORY.szary }), txt(L + size, T + h + 26, osX.wysoko, { fill: KOLORY.szary, anchor: 'end' }), txt(L + size / 2, T + h + 26, osX.nazwa, { anchor: 'middle', weight: 700 }));
  c.push(`<line x1="${L - 3}" y1="${T + h}" x2="${L - 3}" y2="${T}" stroke="${KOLORY.szary}" stroke-width="1.5"/><path d="M${L - 8},${T + 8} L${L - 3},${T} L${L + 2},${T + 8}" fill="none" stroke="${KOLORY.szary}" stroke-width="1.5"/>`);
  const yc = T + h / 2;
  c.push(txt(L - 16, yc, osY.nazwa, { anchor: 'middle', weight: 700, extra: ` transform="rotate(-90 ${L - 16} ${yc})"` }));
  c.push(txt(L - 16, T + h, osY.nisko, { anchor: 'start', fill: KOLORY.szary, extra: ` transform="rotate(-90 ${L - 16} ${T + h})"` }));
  c.push(txt(L - 16, T + 14, osY.wysoko, { anchor: 'end', fill: KOLORY.szary, extra: ` transform="rotate(-90 ${L - 16} ${T + 14})"` }));
  return zapisz(plik, T + h + 40, c);
}

export function osCzasu({ plik, tytul, od, do: doT, odcinki, znaczniki = [], opis }) {
  const c = [];
  const T = tytulRys(c, tytul) + 18;
  const L = 14, R = 14, h = 34;
  const x = (t) => L + ((t - od) / (doT - od)) * (W - L - R);
  for (const o of odcinki) {
    c.push(`<rect x="${r(x(o.od))}" y="${T}" width="${r(x(o.do) - x(o.od))}" height="${h}" fill="${o.akcent ? KOLORY.akcent : o.puste ? '#ffffff' : KOLORY.seria2}" stroke="#ffffff" stroke-width="2"/>`);
    if (o.etykieta && x(o.do) - x(o.od) > szerTekstu(o.etykieta, 13) + 6) c.push(txt((x(o.od) + x(o.do)) / 2, T + h / 2 + 5, o.etykieta, { anchor: 'middle', fill: '#ffffff', weight: 700 }));
  }
  c.push(`<line x1="${L}" y1="${T + h + 2}" x2="${W - R}" y2="${T + h + 2}" stroke="${KOLORY.szary}"/>`);
  for (const [t, s] of znaczniki) {
    c.push(`<line x1="${r(x(t))}" y1="${T + h + 2}" x2="${r(x(t))}" y2="${T + h + 8}" stroke="${KOLORY.szary}"/>`);
    c.push(txt(x(t), T + h + 22, s, { fill: KOLORY.szary, anchor: t === od ? 'start' : t === doT ? 'end' : 'middle' }));
  }
  let y = T + h + 24;
  if (opis) lamanie(opis, 58).forEach((l) => { y += 18; c.push(txt(W - R, y, l, { fill: KOLORY.akcent, anchor: 'end' })); });
  return zapisz(plik, y + 12, c);
}

// panele({ plik, tytul, panele: [{ tytul, punkty: [[x, y]], akcent? }], x: { min, max }, y: { min, max, krok?, format? }, wys?, zero? })
//   „małe wielokrotności”: kilka wykresów na wspólnej skali jeden pod drugim (porównanie wariantów na telefonie).
export function panele({ plik, tytul, panele: lista, x, y, wys = 86, zero = true, format = (v) => pl(v) }) {
  const c = [];
  let top = tytulRys(c, tytul) + 16;
  const L = 40, R = 12;
  const sx = (v) => L + ((v - x.min) / (x.max - x.min)) * (W - L - R);
  for (const p of lista) {
    c.push(txt(L, top + 4, p.tytul, { weight: 700, fill: p.akcent ? KOLORY.akcent : KOLORY.grafit }));
    const T = top + 12, B = T + wys;
    const sy = (v) => B - ((Math.max(y.min, Math.min(y.max, v)) - y.min) / (y.max - y.min)) * (B - T);
    c.push(`<rect x="${L}" y="${T}" width="${W - L - R}" height="${wys}" fill="${KOLORY.tlo}"/>`);
    for (const v of [y.min, zero ? 0 : null, y.max].filter((v) => v != null)) {
      c.push(`<line x1="${L}" y1="${r(sy(v))}" x2="${W - R}" y2="${r(sy(v))}" stroke="${v === 0 ? KOLORY.szary : KOLORY.siatka}"${v === 0 ? ' stroke-dasharray="3 3"' : ''}/>`);
      c.push(txt(L - 6, sy(v) + 4.5, format(v), { fill: KOLORY.szary, anchor: 'end' }));
    }
    const kolor = p.akcent ? KOLORY.akcent : KOLORY.grafit;
    const pts = p.punkty.map(([a, b]) => `${r(sx(a))},${r(sy(b))}`).join(' ');
    c.push(`<polyline points="${pts}" fill="none" stroke="${kolor}" stroke-width="1.4" stroke-opacity="0.7"/>`);
    for (const [a, b] of p.punkty) if (b > y.max || b < y.min) c.push(`<path d="M${r(sx(a)) - 3},${r(sy(b)) + (b > y.max ? 4 : -4)} L${r(sx(a))},${r(sy(b))} L${r(sx(a)) + 3},${r(sy(b)) + (b > y.max ? 4 : -4)}" fill="none" stroke="${kolor}" stroke-width="1.5"/>`);
    top = B + 26;
  }
  if (x.opis) { c.push(txt(W - R, top - 8, x.opis, { fill: KOLORY.szary, anchor: 'end' })); top += 8; }
  return zapisz(plik, top, c);
}
