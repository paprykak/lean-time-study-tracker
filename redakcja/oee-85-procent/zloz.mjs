// Składa plik artykułu z teczki: szkic.md (przypisy [@klucz]) + zrodla.json + nagłówek poniżej.
// Przypisy numerowane w kolejności pierwszego użycia; źródła w tej samej kolejności (wymóg schematu i kontroli tekstu).
// Uruchom z katalogu projektu: node redakcja/oee-85-procent/zloz.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const tu = (p) => new URL(p, import.meta.url);
const szkic = readFileSync(tu('./szkic.md'), 'utf8');
const zrodla = JSON.parse(readFileSync(tu('./zrodla.json'), 'utf8'));

const kolejnosc = [];
const tresc = szkic.replace(/\[@([a-z0-9-]+)\]/g, (_, klucz) => {
  if (!zrodla[klucz]) throw new Error(`Brak źródła „${klucz}” w zrodla.json`);
  if (!kolejnosc.includes(klucz)) kolejnosc.push(klucz);
  return `[${kolejnosc.indexOf(klucz) + 1}]`;
});
const nieuzyte = Object.keys(zrodla).filter((k) => !kolejnosc.includes(k));
if (nieuzyte.length) throw new Error(`Źródła bez przypisu: ${nieuzyte.join(', ')}`);

// JSON.stringify daje poprawne łańcuchy YAML w cudzysłowach.
const q = (s) => JSON.stringify(s);
const n = {
  tytul: 'OEE 85% to nie norma, tylko cel. Jak czytać własny wynik',
  tytulSeo: 'OEE 85% to nie norma. Jak liczyć i porównywać OEE',
  opisSeo: 'Skąd się wzięło 85% OEE, ile wynosi OEE w zbadanych zakładach i jak spisać definicję, żeby wynik nie zależał od tego, kto liczy.',
  lead: 'Liczba 85% krąży jako „światowa klasa” OEE, ale w literaturze TPM to cel, a nie średnia. W zbadanych zakładach wynik wynosi zwykle od 50 do 70%, a samą definicją da się go przesunąć o kilkadziesiąt punktów. Pokazujemy, jak liczyć, żeby porównanie miało sens.',
  podpisZdjecia: 'Linia rozlewnicza w ruchu: ile z jej czasu jest stratą, rozstrzyga dopiero definicja OEE.',
  faq: [
    ['Co to jest OEE?', 'OEE (Overall Equipment Effectiveness, całkowita efektywność wyposażenia) mówi, jaka część czasu planowanego maszyny dała dobre sztuki w tempie idealnym. Składa się z dostępności (czy maszyna pracowała), wydajności (czy szła w pełnym tempie) i jakości (czy sztuki były dobre).'],
    ['Jak liczyć OEE?', 'Pomnóż dostępność, wydajność i jakość. Ten sam wynik daje jeden ułamek: liczba dobrych sztuk razy cykl idealny, podzielona przez czas planowany. Zanim zaczniesz, spisz, co wliczasz do czasu planowanego i jaki cykl przyjmujesz za idealny, bo od tych dwóch decyzji wynik zależy najbardziej.'],
    ['Ile powinno wynosić OEE?', 'Nie ma jednej normy. 85% to w literaturze TPM cel, do którego zakład może dojść dzięki usprawnieniom, a w badaniach szwedzkich zakładów średnie wynosiły od około 51 do 65%. Cel wyznacz od własnego wyniku przy stałej definicji i powiąż go z konkretną stratą, na przykład z czasem przezbrojeń.'],
    ['Czy przezbrojenia wliczać do strat w OEE?', 'W klasycznym ujęciu TPM przezbrojenie i regulacja to jedna z sześciu dużych strat. Jeśli chcesz skracać przezbrojenia, licz je jako stratę dostępności: wyłączone z czasu planowanego znikają z wyniku.'],
    ['Czy można porównywać OEE dwóch zakładów?', 'Tylko wtedy, gdy oba liczą według tej samej definicji: ten sam czas planowany, ten sam rodzaj cyklu idealnego i te same zasady liczenia dobrych sztuk. Bez tego różnica wyniku może pochodzić z arkusza, a nie z maszyn.'],
  ],
  metoda:
    'Tekst opiera się na badaniach, które mierzą OEE w wielu zakładach (wszystkie szwedzkie), na rozdziale o efektywności urządzeń z książki o wdrażaniu TPM z 1989 r., na analizie definicji OEE w normie ISO 22400-2 i na polskim studium przypadku z AGH. Strony producenta systemów do pomiaru OEE opisujemy w tekście jako takie. Książki Nakajimy z 1984 r. nie udało się sprawdzić w oryginale, więc jego założenia podajemy za cytującymi ją autorami. Przykład z trzema wynikami jest fikcyjny; rachunek jest w archiwum redakcji. Konflikt interesów: redaktor naczelny prowadzi doradztwo w operacjach, także przy OEE; tekst nie odsyła do jego usług.',
};
for (const [pole, max] of [['tytul', 120], ['tytulSeo', 60], ['opisSeo', 160], ['lead', 320], ['metoda', 700]]) {
  if (n[pole].length > max) throw new Error(`${pole}: ${n[pole].length} > ${max} znaków`);
}

const yaml = [
  '---',
  `tytul: ${q(n.tytul)}`,
  `tytulSeo: ${q(n.tytulSeo)}`,
  `opisSeo: ${q(n.opisSeo)}`,
  `lead: ${q(n.lead)}`,
  'dzial: produkcja',
  'format: Analiza',
  'tematy:',
  '  - oee',
  'autorzy:',
  '  - redakcja',
  'opublikowano: 2026-11-06',
  'zdjecie: linia-rozlewnicza',
  `podpisZdjecia: ${q(n.podpisZdjecia)}`,
  'zrodla:',
  ...kolejnosc.flatMap((k) => {
    const z = zrodla[k];
    return [`  - opis: ${q(z.opis)}`, `    adres: ${q(z.adres)}`, `    rodzaj: ${q(z.rodzaj)}`, `    dostep: ${z.dostep}`];
  }),
  'faq:',
  ...n.faq.flatMap(([p, o]) => [`  - pytanie: ${q(p)}`, `    odpowiedz: ${q(o)}`]),
  `metoda: ${q(n.metoda)}`,
  ...(process.env.SPRAWDZONO ? [`sprawdzono: ${process.env.SPRAWDZONO}`] : []),
  'szkic: true',
  '---',
  '',
];
writeFileSync(tu('../../src/content/artykuly/oee-85-procent.md'), yaml.join('\n') + tresc);
console.log(`Zapisano src/content/artykuly/oee-85-procent.md: ${kolejnosc.length} źródeł w kolejności ${kolejnosc.join(', ')}`);
for (const [pole] of [['tytul'], ['tytulSeo'], ['opisSeo'], ['lead'], ['metoda']]) console.log(`  ${pole}: ${n[pole].length} znaków`);
