// Okładki udostępnień artykułów 1200×630 generowane przy buildzie: /okladki/<slug>.jpg (og:image, dane strukturalne).
import type { APIRoute, GetStaticPaths } from 'astro';
import { getEntry } from 'astro:content';
import { artykuly, type Artykul } from '../../lib/tresci';
import { WPISY } from '../../lib/zdjecia';
import { okladka } from '../../lib/okladka';

export const getStaticPaths: GetStaticPaths = async () => (await artykuly()).map((a) => ({ params: { slug: a.id }, props: { artykul: a } }));

export const GET: APIRoute = async ({ props }) => {
  const { data } = props.artykul as Artykul;
  const dzial = await getEntry(data.dzial);
  const wpis = WPISY.find((w) => w.slug === data.zdjecie.id)!;
  const plik = await okladka({
    tytul: data.tytul,
    etykieta: data.partner ? data.partner.oznaczenie : `${dzial!.data.nazwa} · ${data.format}`,
    zdjecie: wpis.plik.replace(/^\//, ''), // /src/assets/zdjecia/<plik> → ścieżka od katalogu projektu
    pozycja: wpis.pozycja,
  });
  return new Response(new Uint8Array(plik), { headers: { 'Content-Type': 'image/jpeg' } });
};
