// Wspólne składanie pliku artykułu z teczki: szkic.md (przypisy [@klucz] albo [@klucz1, @klucz2]) + zrodla.json + nagłówek.
// Przypisy numerowane w kolejności pierwszego użycia; źródła w tej samej kolejności (wymóg schematu i kontroli tekstu).
// Użycie w redakcja/<slug>/zloz.mjs: import { zloz } from '../wspolne/zloz.mjs'; zloz(import.meta.url, { ...nagłówek });
import { readFileSync, writeFileSync } from 'node:fs';

const LIMITY = [['tytul', 70], ['tytulSeo', 60], ['opisSeo', 160], ['lead', 320], ['metoda', 700]];

export function zloz(adresSkryptu, n) {
  const tu = (p) => new URL(p, adresSkryptu);
  const slug = new URL('.', adresSkryptu).pathname.split('/').filter(Boolean).pop();
  const szkic = readFileSync(tu('./szkic.md'), 'utf8');
  const zrodla = JSON.parse(readFileSync(tu('./zrodla.json'), 'utf8'));
  const kolejnosc = [];
  const numer = (klucz) => {
    if (!zrodla[klucz]) throw new Error(`Brak źródła „${klucz}” w zrodla.json`);
    if (!kolejnosc.includes(klucz)) kolejnosc.push(klucz);
    return kolejnosc.indexOf(klucz) + 1;
  };
  const tresc = szkic.replace(/\[@([a-z0-9-]+(?:,\s*@[a-z0-9-]+)*)\]/g, (_, grupa) =>
    `[${grupa.split(/,\s*@/).map((k) => numer(k.replace(/^@/, ''))).join(', ')}]`,
  );
  const nieuzyte = Object.keys(zrodla).filter((k) => !kolejnosc.includes(k));
  if (nieuzyte.length) throw new Error(`Źródła bez przypisu: ${nieuzyte.join(', ')}`);
  for (const [pole, max] of LIMITY) if (n[pole].length > max) throw new Error(`${pole}: ${n[pole].length} > ${max} znaków`);
  const q = (s) => JSON.stringify(s);
  const lista = (nazwa, wartosci) => (wartosci?.length ? [`${nazwa}:`, ...wartosci.map((w) => `  - ${w}`)] : []);
  const yaml = [
    '---',
    `tytul: ${q(n.tytul)}`,
    `tytulSeo: ${q(n.tytulSeo)}`,
    `opisSeo: ${q(n.opisSeo)}`,
    `lead: ${q(n.lead)}`,
    `dzial: ${n.dzial}`,
    `format: ${n.format}`,
    ...lista('tematy', n.tematy),
    ...lista('autorzy', n.autorzy ?? ['redakcja']),
    `opublikowano: ${n.opublikowano}`,
    `zdjecie: ${n.zdjecie}`,
    `podpisZdjecia: ${q(n.podpisZdjecia)}`,
    ...lista('materialy', n.materialy),
    ...lista('powiazane', n.powiazane),
    'zrodla:',
    ...kolejnosc.flatMap((k) => {
      const z = zrodla[k];
      return [`  - opis: ${q(z.opis)}`, `    adres: ${q(z.adres)}`, `    rodzaj: ${q(z.rodzaj)}`, `    dostep: ${z.dostep}`];
    }),
    'faq:',
    ...n.faq.flatMap(([p, o]) => [`  - pytanie: ${q(p)}`, `    odpowiedz: ${q(o)}`]),
    `metoda: ${q(n.metoda)}`,
    ...(n.sprawdzono ? [`sprawdzono: ${n.sprawdzono}`] : []),
    `szkic: ${n.szkic ? 'true' : 'false'}`,
    '---',
    '',
  ];
  writeFileSync(tu(`../../src/content/artykuly/${slug}.md`), yaml.join('\n') + tresc);
  console.log(`Zapisano src/content/artykuly/${slug}.md: ${kolejnosc.length} źródeł w kolejności ${kolejnosc.join(', ')}`);
  for (const [pole] of LIMITY) console.log(`  ${pole}: ${n[pole].length} znaków`);
}
