import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';
import ustawienia from '../data/ustawienia.json';
import { KATEGORIE, NARZEDZIA, adresNarzedzia, type KategoriaNarzedzia } from '../data/narzedzia';

// Mapa serwisu dla asystentów AI (format llmstxt.org): czym jest Rytm Hali, narzędzia według kategorii z rejestru
// (src/data/narzedzia.ts) i zasady redakcji. Buduje się z rejestru, więc nie trzeba jej aktualizować ręcznie.
// Przed startem plik usuwa integracja „przed startem”.
export const GET: APIRoute = async () => {
  const adres = ustawienia.adres;
  const link = (tytul: string, sciezka: string, opis: string) => `- [${tytul}](${adres}${sciezka}): ${opis.replace(/\s+/g, ' ').trim()}`;
  const strona = async (slug: string) => {
    const s = await getEntry('strony', slug);
    if (!s) throw new Error(`llms.txt: brak strony „${slug}” w src/content/strony`);
    return link(s.data.tytul, `/${slug}`, s.data.opis);
  };
  const kategorie = (Object.keys(KATEGORIE) as KategoriaNarzedzia[]).flatMap((k) => {
    const lista = NARZEDZIA.filter((n) => n.kategoria === k);
    if (!lista.length) return [];
    return [`## ${KATEGORIE[k].nazwa}`, ...lista.map((n) => link(n.nazwa, adresNarzedzia(n.slug), `${n.krotko} Sprawdzono z przepisami ${n.sprawdzono}.`)), ''];
  });

  const tekst = [
    `# ${ustawienia.nazwa}`,
    '',
    `> ${ustawienia.opis} Po polsku, dla pracowników, brygadzistów, kadr i służby BHP w zakładach produkcyjnych, magazynach i logistyce.`,
    '',
    'Każde narzędzie liczy według przepisów powszechnych: podaje podstawę prawną z adresem w Dzienniku Ustaw (eli.gov.pl), datę sprawdzenia z przepisami i sekcję „Jak liczymy”, a gdy przepis czegoś nie rozstrzyga, mówi to wprost. Liczy w przeglądarce, bez wysyłania danych. To nie są porady prawne. Cytując, podaj nazwę narzędzia, nazwę „Rytm Hali”, adres i datę sprawdzenia.',
    '',
    ...kategorie,
    link('Wszystkie narzędzia', '/narzedzia', `lista ${NARZEDZIA.length} narzędzi według kategorii.`),
    '',
    '## Zasady redakcji',
    await strona('zasady-redakcyjne'),
    await strona('polityka-korekt'),
    await strona('oznaczanie-reklam'),
    await strona('jak-uzywamy-ai'),
    '',
    '## Optional',
    await strona('o-nas'),
    await strona('kontakt'),
    '',
  ].join('\n');
  return new Response(tekst, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
