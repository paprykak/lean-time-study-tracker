// Źródła fontów Noto: repozytorium google/fonts na przypiętym commicie, każdy plik sprawdzany sumą SHA-256.
// Pliki trafiają do .cache/fonty (poza gitem). Używają ich generator fontów strony i generator logo.
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const CACHE = fileURLToPath(new URL('../../.cache/fonty/', import.meta.url));
export const COMMIT = '24ddc1f324cac5d9f5aedca126d298f56e3f1640'; // google/fonts, gałąź main z 2026-11-06
export const ZRODLA = {
  sans: { sciezka: 'ofl/notosans/NotoSans[wdth,wght].ttf', sha256: 'bfb7bb691513f12e734dc346c03a03f784912432d7e3fa8e56efcf906fe86b3d' },
  sansItalic: { sciezka: 'ofl/notosans/NotoSans-Italic[wdth,wght].ttf', sha256: '58e6e0ebd1931b29a365aa2d3e2ee9a9e831a3af7cf3ad1462d4e72154f0b291' },
  display: { sciezka: 'ofl/notosansdisplay/NotoSansDisplay[wdth,wght].ttf', sha256: 'deaa68141fa5ad21bd17d7c11fa79183ceda19b32e40ff5c33874d42f3636dde' },
  licencja: { sciezka: 'ofl/notosans/OFL.txt', sha256: 'cee9892f9f0cc8fe882c9e9537ee6a89621d86ee7ceaf70b02e2b2b1c25c061a' },
};

const sha = (buf) => createHash('sha256').update(buf).digest('hex');

/** @param {keyof typeof ZRODLA} nazwa */
export async function zrodlo(nazwa) {
  const { sciezka, sha256 } = ZRODLA[nazwa];
  mkdirSync(CACHE, { recursive: true });
  const plik = join(CACHE, sciezka.split('/').at(-1));
  if (!existsSync(plik)) {
    const url = `https://raw.githubusercontent.com/google/fonts/${COMMIT}/${sciezka.split('/').map(encodeURIComponent).join('/')}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Nie udało się pobrać ${url}: HTTP ${res.status}`);
    writeFileSync(plik, Buffer.from(await res.arrayBuffer()));
  }
  const buf = readFileSync(plik);
  if (sha(buf) !== sha256) throw new Error(`Suma SHA-256 pliku ${plik} nie zgadza się (oczekiwana ${sha256}).`);
  return { buf, sha256 };
}
