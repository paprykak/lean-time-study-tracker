// Okładka udostępnień artykułu 1200×630 (og:image, image w danych strukturalnych), generowana przy buildzie
// bez przeglądarki: satori (układ i tekst jako krzywe) + resvg (raster) + sharp (JPEG). Zdjęcie artykułu
// z rejestru licencji w kadrze 1200×630, przyciemnienie pod tekstem, logo, dział i format, tytuł, pas dachu.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';

// Ścieżki od katalogu projektu (build i testy uruchamiane są z niego). Nie z import.meta.url: przy buildzie moduł
// trafia do .astro/.prerender/chunks i ścieżka względna wskazywałaby w złe miejsce.
const plik = (sciezka: string) => readFileSync(join(process.cwd(), sciezka));
let zasoby: { fonty: Parameters<typeof satori>[1]['fonts']; logo: string } | undefined;
const wczytaj = () =>
  (zasoby ??= {
    fonty: [
      { name: 'Noto Sans Display', data: plik('src/assets/fonty/og/noto-sans-display-700.ttf'), weight: 700, style: 'normal' },
      { name: 'Noto Sans', data: plik('src/assets/fonty/og/noto-sans-600.ttf'), weight: 600, style: 'normal' },
    ],
    logo: `data:image/svg+xml;base64,${plik('marka/logo/svg/rytm-hali-ciemne.svg').toString('base64')}`,
  });
const ZEBY = Array.from({ length: 25 }, (_, i) => `M${i * 48} 24L${(i + 1) * 48} 0V24Z`).join('');
const PAS = `data:image/svg+xml;base64,${Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="24"><path fill="#e8590c" d="${ZEBY}"/></svg>`).toString('base64')}`;

export const SZEROKOSC = 1200;
export const WYSOKOSC = 630;

export interface DaneOkladki {
  tytul: string;
  etykieta: string;
  /** Ścieżka zdjęcia względem katalogu projektu, np. src/assets/zdjecia/robot-spawalniczy.jpg */
  zdjecie: string;
  pozycja?: string;
}

/** Rozmiar tytułu dobrany do długości, żeby zmieścił się w czterech liniach. */
export const rozmiarTytulu = (tytul: string) => (tytul.length > 90 ? 46 : tytul.length > 60 ? 56 : tytul.length > 40 ? 62 : 70);

type Wezel = { type: string; props: Record<string, unknown> };
const el = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): Wezel => ({
  type,
  props: { style, ...(children !== undefined ? { children } : {}), ...extra },
});

export async function okladka({ tytul, etykieta, zdjecie, pozycja = 'center' }: DaneOkladki): Promise<Buffer> {
  const { fonty, logo } = wczytaj();
  const tlo = await sharp(plik(zdjecie)).rotate().resize(SZEROKOSC, WYSOKOSC, { fit: 'cover', position: pozycja }).jpeg({ quality: 82 }).toBuffer();
  const drzewo = el(
    'div',
    { width: SZEROKOSC, height: WYSOKOSC, display: 'flex', position: 'relative', backgroundColor: '#11161d', fontFamily: 'Noto Sans' },
    [
      el('img', { position: 'absolute', left: 0, top: 0, width: SZEROKOSC, height: WYSOKOSC }, undefined, { src: `data:image/jpeg;base64,${tlo.toString('base64')}`, width: SZEROKOSC, height: WYSOKOSC }),
      el('div', {
        position: 'absolute',
        left: 0,
        top: 0,
        width: SZEROKOSC,
        height: WYSOKOSC,
        backgroundImage: 'linear-gradient(90deg, rgba(17,22,29,0.96) 0%, rgba(17,22,29,0.9) 48%, rgba(17,22,29,0.35) 100%)',
      }),
      el('img', { position: 'absolute', left: 72, top: 52 }, undefined, { src: logo, height: 58, width: Math.round(58 * 4.479) }),
      el('div', { position: 'absolute', left: 72, bottom: 78, width: 800, display: 'flex', flexDirection: 'column' }, [
        el('div', { display: 'flex', fontSize: 22, fontWeight: 600, letterSpacing: 2.4, color: '#f2783a', textTransform: 'uppercase' }, etykieta),
        el(
          'div',
          { display: 'flex', marginTop: 18, fontFamily: 'Noto Sans Display', fontWeight: 700, fontSize: rozmiarTytulu(tytul), lineHeight: 1.1, color: '#ffffff' },
          tytul,
        ),
      ]),
      el('img', { position: 'absolute', left: 0, bottom: 0 }, undefined, { src: PAS, width: SZEROKOSC, height: 24 }),
    ],
  );
  const svg = await satori(drzewo as unknown as Parameters<typeof satori>[0], { width: SZEROKOSC, height: WYSOKOSC, fonts: fonty });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: SZEROKOSC } }).render().asPng();
  return sharp(png).jpeg({ quality: 86, mozjpeg: true }).toBuffer();
}
