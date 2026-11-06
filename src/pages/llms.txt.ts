import type { APIRoute } from 'astro';
import { getCollection, getEntry } from 'astro:content';
import ustawienia from '../data/ustawienia.json';
import { DZIALY } from '../lib/dane';
import { artykuly, doIndeksu } from '../lib/tresci';
import { widoczny } from '../lib/redakcja';
import { WSZYSTKIE_TRESCI } from '../lib/srodowisko.mjs';

// Mapa serwisu dla asystentów AI (format llmstxt.org): czym jest Rytm Hali, artykuły według działów, materiały
// i zasady redakcji. Buduje się z treści, więc nie trzeba jej aktualizować ręcznie. Tylko teksty indeksowane
// (bez szkiców, wpisów testowych i stron z noindex). Przed startem plik usuwa integracja „przed startem”.
export const GET: APIRoute = async () => {
  const adres = ustawienia.adres;
  const link = (tytul: string, sciezka: string, opis: string) => `- [${tytul}](${adres}${sciezka}): ${opis.replace(/\s+/g, ' ').trim()}`;
  const teksty = (await artykuly()).filter(doIndeksu);
  const materialy = (await getCollection('materialy', ({ data }) => widoczny(data, WSZYSTKIE_TRESCI))).sort(
    (a, b) => b.data.opublikowano.valueOf() - a.data.opublikowano.valueOf(),
  );
  const strona = async (slug: string) => {
    const s = await getEntry('strony', slug);
    if (!s) throw new Error(`llms.txt: brak strony „${slug}” w src/content/strony`);
    return link(s.data.tytul, `/${slug}`, s.data.opis);
  };

  const dzialy = DZIALY.map((d) => {
    const lista = teksty.filter((a) => a.data.dzial.id === d.slug);
    if (!lista.length) return [];
    return [
      `## ${d.nazwa}`,
      ...lista.map((a) => link(a.data.tytul, `/${a.id}`, `${a.data.partner ? 'Materiał partnera. ' : ''}${a.data.lead} (${a.data.format})`)),
      '',
    ];
  }).flat();

  const tekst = [
    `# ${ustawienia.nazwa}`,
    '',
    `> ${ustawienia.opis} Artykuły po polsku dla kierowników i dyrektorów operacyjnych, specjalistów ciągłego doskonalenia i właścicieli firm.`,
    '',
    'Każda liczba i każdy wniosek z badania mają w tekście przypis do źródła pierwotnego (lista „Źródła” pod artykułem), a ramka „Jak powstał ten tekst” podaje metodę i datę weryfikacji faktów. Przykłady liczbowe bez źródła są oznaczone jako fikcyjne, a materiały partnerów jako „Materiał partnera”. Cytując, podaj tytuł artykułu, nazwę „Rytm Hali” i adres.',
    '',
    ...dzialy,
    ...(materialy.length
      ? ['## Do pobrania', ...materialy.map((m) => link(m.data.tytul, `/do-pobrania/${m.id}`, m.data.opis)), '']
      : []),
    '## Zasady redakcji',
    await strona('zasady-redakcyjne'),
    await strona('polityka-korekt'),
    await strona('oznaczanie-reklam'),
    await strona('jak-uzywamy-ai'),
    '',
    '## Optional',
    await strona('o-nas'),
    await strona('kontakt'),
    link('Kanał RSS', '/rss.xml', 'wszystkie nowe artykuły (kanały działów pod /dzial/<dział>/rss.xml).'),
    '',
  ].join('\n');
  return new Response(tekst, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
