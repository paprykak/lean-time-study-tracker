// Kanały RSS (prompt F3): całość i każdy dział. Pozycja: tytuł, adres, data, lead, dział i format jako kategorie,
// autorzy. Szkice i wpisy testowe nie trafiają do kanałów produkcji (src/lib/tresci.ts).
import rss from '@astrojs/rss';
import { dzial as daneDzialu, autor } from './dane';
import { ADRES } from './srodowisko.mjs';
import ustawienia from '../data/ustawienia.json';
import type { Artykul } from './tresci';

export const DO_KANALU = 30;

export function kanal({ tytul, opis, adres, teksty }: { tytul: string; opis: string; adres: string; teksty: Artykul[] }) {
  return rss({
    title: tytul,
    description: opis,
    site: `${ADRES}${adres}`,
    trailingSlash: false,
    items: teksty.slice(0, DO_KANALU).map((a) => ({
      title: a.data.tytul,
      link: `${ADRES}/${a.id}`,
      pubDate: a.data.opublikowano,
      description: a.data.lead,
      categories: [daneDzialu(a.data.dzial.id).nazwa, a.data.format],
      customData: `<dc:creator><![CDATA[${a.data.autorzy.map((x) => autor(x.id).imie).join(', ')}]]></dc:creator>`,
    })),
    xmlns: { dc: 'http://purl.org/dc/elements/1.1/' },
    customData: `<language>pl-PL</language><copyright>© ${ustawienia.nazwa}</copyright>`,
  });
}
