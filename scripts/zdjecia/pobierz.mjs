// Pobiera zdjęcia z rejestru licencji (marka/zdjecia/rejestr.json), kadruje i zapisuje jako JPEG do src/assets/zdjecia/.
// Pobiera tylko brakujące pliki. Zgodnie z zasadami Wikimedia (https://w.wiki/4wJS): identyfikujący User-Agent,
// jedno połączenie naraz, standardowe rozmiary miniatur, przy 429 czeka tyle, ile mówi nagłówek Retry-After.
// Użycie: npm run zdjecia   (--wymus pobiera wszystko ponownie; --tylko=<fragment adresu> np. --tylko=rawpixel)
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const CEL = join(ROOT, 'src/assets/zdjecia');
const UA = 'RytmHali-zdjecia/1.0 (https://github.com/paprykak/lean-time-study-tracker) node-fetch';
const MAKS_SZEROKOSC = 2000;
const PROBY = 4;
const wymus = process.argv.includes('--wymus');
const tylko = process.argv.find((a) => a.startsWith('--tylko='))?.slice('--tylko='.length);
const czekaj = (ms) => new Promise((r) => setTimeout(r, ms));

const { zdjecia } = JSON.parse(readFileSync(join(ROOT, 'marka/zdjecia/rejestr.json'), 'utf8'));
mkdirSync(CEL, { recursive: true });

async function pobierz(url) {
  for (let proba = 1; proba <= PROBY; proba++) {
    const odp = await fetch(url, { headers: { 'User-Agent': UA } });
    if (odp.ok) return Buffer.from(await odp.arrayBuffer());
    if (odp.status === 429 && proba < PROBY) {
      const sekundy = Math.max(10, Number(odp.headers.get('retry-after')) || 10) * proba;
      console.log(`  429, czekam ${sekundy} s (Retry-After)`);
      await czekaj(sekundy * 1000);
      continue;
    }
    throw new Error(`HTTP ${odp.status} dla ${url}`);
  }
}

let pobrane = 0;
const bledy = [];
for (const z of zdjecia) {
  const plik = join(CEL, `${z.slug}.jpg`);
  if ((existsSync(plik) && !wymus) || (tylko && !z.pobierz.includes(tylko))) continue;
  console.log(`${z.slug}: ${z.pobierz}`);
  try {
    const dane = await pobierz(z.pobierz);
    let obraz = sharp(dane).rotate(); // obrót według EXIF, potem metadane są usuwane przy zapisie
    if (z.kadr) {
      const { width, height } = await sharp(dane).rotate().metadata();
      obraz = obraz.extract({
        left: Math.round(z.kadr.lewo * width),
        top: Math.round(z.kadr.gora * height),
        width: Math.round(z.kadr.szerokosc * width),
        height: Math.round(z.kadr.wysokosc * height),
      });
    }
    const wynik = await obraz.resize({ width: MAKS_SZEROKOSC, withoutEnlargement: true }).jpeg({ quality: 85, mozjpeg: true }).toBuffer();
    writeFileSync(plik, wynik);
    const { width, height } = await sharp(wynik).metadata();
    console.log(`  zapisano ${width} × ${height}, ${(wynik.length / 1024).toFixed(0)} KB`);
    pobrane++;
  } catch (e) {
    bledy.push(`${z.slug}: ${e.message}`);
    console.error(`  ✗ ${e.message}`);
  }
  await czekaj(3000); // spokojne tempo dla serwerów źródeł
}
console.log(`\nPobrano ${pobrane}, błędów ${bledy.length}, w rejestrze ${zdjecia.length}.`);
if (bledy.length) {
  console.log('Brakujące zdjęcia: strona buduje się bez nich (pole zastępcze tylko na /styleguide). Uruchom ponownie później.');
  process.exit(1);
}
