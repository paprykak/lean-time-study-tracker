// Kanał RSS działu: /dzial/<slug>/rss.xml
import type { APIRoute, GetStaticPaths } from 'astro';
import { DZIALY } from '../../../lib/dane';
import { artykuly } from '../../../lib/tresci';
import { kanal } from '../../../lib/rss';

export const getStaticPaths: GetStaticPaths = () => DZIALY.map((d) => ({ params: { slug: d.slug }, props: { dzial: d } }));

export const GET: APIRoute = async ({ props }) => {
  const d = props.dzial as (typeof DZIALY)[number];
  const teksty = (await artykuly()).filter((a) => a.data.dzial.id === d.slug);
  return kanal({ tytul: `Rytm Hali: ${d.nazwa}`, opis: d.opis, adres: d.adres, teksty });
};
