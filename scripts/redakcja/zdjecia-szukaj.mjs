// Szukanie zdjęć z otwartych licencji do artykułu (skill /artykul, krok „Zdjęcie”; zasady: .claude/skills/artykul/zdjecia.md).
//
// 1) Kandydaci:  npm run redakcja:zdjecia -- "assembly line workers" --artykul=<slug> [--ile=24] [--min=1600] [--zrodla=openverse,commons]
//    → redakcja/<slug>/zdjecia/kandydaci.json i stykowka.jpg (numerowane miniatury do oceny wzrokowej).
// 2) Wpis do rejestru: npm run redakcja:zdjecia -- --wybierz=<nr> --artykul=<slug> --nazwa=<slug-zdjecia> --alt="…" [--dzial=produkcja]
//    → src/content/zdjecia/<nazwa>.json; potem npm run zdjecia -- --tylko=<nazwa pliku> pobiera i kadruje plik.
//
// Tylko licencje z rejestru serwisu: CC0 1.0 i CC BY 2.0/3.0/4.0 (bez BY-SA, NC, ND). Licencję każdego wybranego
// zdjęcia redakcja sprawdza jeszcze raz na stronie źródła: metadane wyszukiwarek bywają nieaktualne.
// Zasady Wikimedia (https://w.wiki/4wJS) i Openverse: identyfikujący User-Agent, zapytania po kolei, standardowe rozmiary miniatur.
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { licencja, podpisFot } from '../../src/lib/licencje.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const UA = 'RytmHali-redakcja/1.0 (https://github.com/paprykak/lean-time-study-tracker)';
const czekaj = (ms) => new Promise((r) => setTimeout(r, ms));
const opcja = (nazwa, domyslna) => process.argv.find((a) => a.startsWith(`--${nazwa}=`))?.slice(nazwa.length + 3) ?? domyslna;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const bezHtml = (s) => String(s ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

async function json(url) {
  for (let proba = 1; proba <= 3; proba++) {
    const odp = await fetch(url, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30_000) });
    if (odp.ok) return odp.json();
    if (odp.status === 429 && proba < 3) {
      const s = Math.max(10, Number(odp.headers.get('retry-after')) || 10);
      console.log(`  429 (${new URL(url).host}), czekam ${s} s`);
      await czekaj(s * 1000);
      continue;
    }
    throw new Error(`HTTP ${odp.status} (${new URL(url).host})`);
  }
}

async function openverse(fraza, min) {
  const wynik = [];
  for (const strona of [1, 2]) {
    const q = new URLSearchParams({ q: fraza, license: 'cc0,by', category: 'photograph', size: 'large', mature: 'false', page_size: '20', page: String(strona) });
    const dane = await json(`https://api.openverse.org/v1/images/?${q}`);
    for (const r of dane.results ?? []) {
      const l = licencja(r.license, r.license_version);
      if (!l || (r.width ?? 0) < min) continue;
      wynik.push({
        zrodlo: 'openverse',
        serwis: r.source === 'wikimedia' ? 'Wikimedia Commons' : (r.source ?? r.provider),
        tytul: r.title,
        autor: r.creator || 'autor nieznany',
        licencja: l,
        licencjaUrl: r.license_url,
        strona: r.foreign_landing_url,
        plik: r.url,
        miniatura: r.thumbnail,
        szerokosc: r.width,
        wysokosc: r.height,
      });
    }
    if (!dane.page_count || strona >= dane.page_count) break;
    await czekaj(1000);
  }
  return wynik;
}

async function commons(fraza, min) {
  const q = new URLSearchParams({
    action: 'query', format: 'json', generator: 'search', gsrnamespace: '6', gsrsearch: `${fraza} filetype:bitmap`, gsrlimit: '30',
    prop: 'imageinfo', iiprop: 'url|size|extmetadata', iiurlwidth: '1920',
  });
  const dane = await json(`https://commons.wikimedia.org/w/api.php?${q}`);
  return Object.values(dane.query?.pages ?? {}).flatMap((s) => {
    const i = s.imageinfo?.[0];
    const m = i?.extmetadata ?? {};
    const l = licencja(m.LicenseShortName?.value);
    if (!i || !l || i.width < min) return [];
    return [{
      zrodlo: 'commons',
      serwis: 'Wikimedia Commons',
      tytul: s.title.replace(/^File:/, ''),
      autor: bezHtml(m.Artist?.value) || 'autor nieznany',
      licencja: l,
      licencjaUrl: m.LicenseUrl?.value,
      strona: i.descriptionurl,
      plik: i.thumburl ?? i.url,
      miniatura: (i.thumburl ?? i.url).replace(/\/1920px-/, '/330px-'),
      szerokosc: i.width,
      wysokosc: i.height,
    }];
  });
}

async function stykowka(kandydaci, cel) {
  const KOL = 4, W = 330, H = 220, PODPIS = 34;
  const kafle = [];
  for (const [i, k] of kandydaci.entries()) {
    let obraz;
    try {
      const odp = await fetch(k.miniatura, { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(30_000) });
      obraz = await sharp(Buffer.from(await odp.arrayBuffer())).resize(W, H, { fit: 'contain', background: '#dde1e6' }).toBuffer();
    } catch {
      obraz = await sharp({ create: { width: W, height: H, channels: 3, background: '#dde1e6' } }).png().toBuffer();
    }
    const tekst = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${PODPIS}"><rect width="100%" height="100%" fill="#11161d"/><text x="8" y="23" font-family="DejaVu Sans, sans-serif" font-size="17" fill="#fff"><tspan font-weight="bold" fill="#f2783a">${i + 1}</tspan>  ${k.licencja} · ${k.szerokosc}×${k.wysokosc}</text></svg>`;
    kafle.push(
      { input: obraz, left: (i % KOL) * W, top: Math.floor(i / KOL) * (H + PODPIS) },
      { input: Buffer.from(tekst), left: (i % KOL) * W, top: Math.floor(i / KOL) * (H + PODPIS) + H },
    );
    await czekaj(300);
  }
  const wiersze = Math.ceil(kandydaci.length / KOL);
  await sharp({ create: { width: KOL * W, height: wiersze * (H + PODPIS), channels: 3, background: '#ffffff' } })
    .composite(kafle)
    .jpeg({ quality: 80 })
    .toFile(cel);
}

async function szukaj() {
  const fraza = process.argv.slice(2).find((a) => !a.startsWith('--'));
  const artykul = opcja('artykul');
  if (!fraza || !artykul) throw new Error('Użycie: npm run redakcja:zdjecia -- "fraza po angielsku" --artykul=<slug>');
  const min = Number(opcja('min', '1600'));
  const ile = Number(opcja('ile', '24'));
  const zrodla = opcja('zrodla', 'openverse,commons').split(',');
  const katalog = join(ROOT, 'redakcja', artykul, 'zdjecia');
  mkdirSync(katalog, { recursive: true });
  const wszyscy = [];
  for (const z of zrodla) {
    try {
      const wynik = z === 'commons' ? await commons(fraza, min) : await openverse(fraza, min);
      console.log(`${z}: ${wynik.length} zdjęć z dozwoloną licencją i szerokością ≥ ${min} px`);
      wszyscy.push(...wynik);
    } catch (e) {
      console.log(`${z}: ${e.message} (pomijam to źródło)`);
    }
    await czekaj(1000);
  }
  // Bez duplikatów (to samo zdjęcie z Commons i z Openverse), poziome najpierw, potem największe.
  const unikalne = [...new Map(wszyscy.map((k) => [k.strona, k])).values()]
    .sort((a, b) => Number(b.szerokosc >= b.wysokosc * 1.2) - Number(a.szerokosc >= a.wysokosc * 1.2) || b.szerokosc - a.szerokosc)
    .slice(0, ile)
    .map((k, i) => ({ nr: i + 1, fraza, ...k }));
  if (!unikalne.length) throw new Error('Brak kandydatów: zmień frazę (po angielsku, rzeczownikami: „warehouse forklift”, „cnc machining”).');
  writeFileSync(join(katalog, 'kandydaci.json'), JSON.stringify(unikalne, null, 2) + '\n');
  await stykowka(unikalne, join(katalog, 'stykowka.jpg'));
  console.log(`\n${unikalne.length} kandydatów: redakcja/${artykul}/zdjecia/stykowka.jpg (obejrzyj) i kandydaci.json`);
  for (const k of unikalne) console.log(`${String(k.nr).padStart(2)}. ${k.licencja.padEnd(10)} ${k.szerokosc}×${k.wysokosc} ${k.serwis}: ${String(k.tytul).slice(0, 70)}`);
}

function wybierz() {
  const nr = Number(opcja('wybierz'));
  const artykul = opcja('artykul');
  const nazwa = opcja('nazwa');
  const alt = opcja('alt', '');
  if (!artykul || !nazwa || !SLUG.test(nazwa)) throw new Error('Podaj --artykul=<slug> i --nazwa=<slug-zdjecia> (małe litery, cyfry, myślniki)');
  if (alt.length < 20) throw new Error('Podaj --alt="…" (co widać na zdjęciu, co najmniej 20 znaków)');
  const k = JSON.parse(readFileSync(join(ROOT, 'redakcja', artykul, 'zdjecia', 'kandydaci.json'), 'utf8')).find((x) => x.nr === nr);
  if (!k) throw new Error(`Nie ma kandydata nr ${nr}`);
  const cel = join(ROOT, 'src/content/zdjecia', `${nazwa}.json`);
  if (existsSync(cel)) throw new Error(`Wpis ${nazwa} już jest w rejestrze`);
  const dzis = new Date().toISOString().slice(0, 10);
  const wpis = {
    plik: `/src/assets/zdjecia/${nazwa}.jpg`,
    alt,
    fot: podpisFot(k),
    autor: k.autor,
    licencja: k.licencja,
    ...(k.licencjaUrl ? { licencjaUrl: k.licencjaUrl } : {}),
    zrodlo: k.strona,
    pobierz: k.plik,
    ...(opcja('dzial') ? { dzial: opcja('dzial') } : {}),
    uwagi: `Wybór do artykułu „${artykul}” (fraza „${k.fraza}”, ${k.szerokosc}×${k.wysokosc} px, ${k.serwis}). Licencja sprawdzona w wyszukiwarce; potwierdź na stronie źródła.`,
    zgoda: `${dzis}: wybór redakcji w ramach licencji dopuszczonych przez Patryka (2026-11-06)`,
  };
  writeFileSync(cel, JSON.stringify(wpis, null, 2) + '\n');
  console.log(`Zapisano src/content/zdjecia/${nazwa}.json\nDalej: sprawdź licencję na ${k.strona}, potem npm run zdjecia -- --tylko=${new URL(k.plik).pathname.split('/').at(-1).slice(0, 40)}`);
}

try {
  if (opcja('wybierz')) wybierz();
  else await szukaj();
} catch (e) {
  console.error(`✗ ${e.message}`);
  process.exit(1);
}
