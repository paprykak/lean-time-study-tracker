// Składa plik artykułu z teczki: szkic.md (przypisy [@klucz] albo [@klucz1, @klucz2]) + zrodla.json + nagłówek poniżej.
// Przypisy numerowane w kolejności pierwszego użycia; źródła w tej samej kolejności (wymóg schematu i kontroli tekstu).
// Uruchom z katalogu projektu: node redakcja/prognozowanie-popytu/zloz.mjs  (data weryfikacji: SPRAWDZONO=RRRR-MM-DD)
import { readFileSync, writeFileSync } from 'node:fs';

const tu = (p) => new URL(p, import.meta.url);
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

const q = (s) => JSON.stringify(s);
const n = {
  tytul: 'Zanim kupisz AI do prognoz, sprawdź, czy bijesz średnią z 4 tygodni',
  tytulSeo: 'Prognozowanie popytu z AI czy prognoza naiwna? Jak sprawdzić',
  opisSeo: 'W konkursie M5 AI przy pojedynczym produkcie myliło się tylko o 3% mniej niż proste wygładzanie wykładnicze. Jak w godzinę sprawdzić własną prognozę popytu.',
  lead: 'W konkursie M5 zwycięska metoda AI myliła się o połowę mniej niż automatyczne wygładzanie wykładnicze przy sumie sprzedaży wszystkich sklepów, ale tylko o 3% mniej przy pojedynczym produkcie w sklepie. Zanim kupisz system prognoz, sprawdź, czy Twoja prognoza bije proste metody.',
  podpisZdjecia: 'Regały w centrum dystrybucji żywności. Tu prognoza dla pojedynczego indeksu zamienia się w palety zapasu.',
  faq: [
    ['Co to jest prognoza naiwna?', 'To prognoza, w której na następny okres przyjmujesz ostatnią znaną sprzedaż. Nic nie kosztuje i nie wymaga systemu, dlatego służy jako punkt odniesienia: prognoza, która nie myli się mniej niż naiwna, nie wnosi wartości. Zwykle trudniej pobić średnią z czterech ostatnich okresów albo wygładzanie wykładnicze.'],
    ['Jak policzyć błąd prognozy popytu?', 'Najprościej jako średni błąd bezwzględny (MAE): dla każdego okresu weź różnicę między prognozą a sprzedażą bez znaku i policz średnią w sztukach. Podziel ten błąd przez błąd prognozy naiwnej i lepszej z prostych metod, liczonych z tym samym wyprzedzeniem. Średniego błędu procentowego (MAPE) nie używaj przy indeksach z zerową sprzedażą, bo wtedy nie da się go policzyć.'],
    ['Czy AI poprawia prognozy popytu?', 'Zależy od poziomu i danych. W konkursie M5 zwycięska metoda uczenia maszynowego myliła się o połowę mniej niż automatyczne wygładzanie wykładnicze przy sumie sprzedaży wszystkich sklepów, ale tylko o 3,3% mniej przy pojedynczym produkcie w sklepie. Czy poprawi Twoje prognozy, sprawdzisz tylko na własnych danych.'],
    ['Co to jest FVA, czyli wartość dodana prognozy?', 'FVA (forecast value added) mówi, o ile każdy krok procesu prognozowania zmniejsza błąd: na przykład system względem prognozy naiwnej albo korekta planisty względem prognozy systemu. Wynik ujemny oznacza, że krok zwiększył błąd. W badaniach firm korekty planistów poprawiały prognozę w niewiele ponad połowie indeksów, a korekty w górę częściej szkodziły.'],
    ['Jak prognozować sprzedaż w Excelu?', 'Excel ma narzędzie Arkusz prognozy (karta Dane, grupa Prognoza), które liczy wygładzanie wykładnicze z trendem i sezonowością. Zanim zaufasz jakiejkolwiek metodzie, porównaj jej błąd z prognozą naiwną i ze średnią z czterech okresów na tych samych tygodniach, z takim wyprzedzeniem, z jakim zamawiasz. Gotowy arkusz z tym porównaniem znajdziesz w materiałach do pobrania.'],
  ],
  metoda:
    'Tekst opiera się głównie na recenzowanych wynikach konkursów prognostycznych M4 i M5 i na oficjalnych plikach wyników ich organizatorów. Z pliku M5 sami policzyliśmy przewagę zwycięzcy na 12 poziomach danych, a remis w teście sprawdziliśmy symulacją; dane i kod są w archiwum redakcji. Artykuły o M5, ankietę Fildesa i Goodwina oraz pracę Hyndmana i Koehler znamy z wersji roboczych, a badania korekt prognoz i porównanie Spiliotisa i in. ze streszczeń. Dane M5 pochodzą z handlu detalicznego. Przykłady są fikcyjne. Konflikt interesów: redaktor naczelny prowadzi doradztwo w operacjach; tekst nie odsyła do jego usług, a wymienione firmy nie mają związku z redakcją.',
};
for (const [pole, max] of [['tytul', 70], ['tytulSeo', 60], ['opisSeo', 160], ['lead', 320], ['metoda', 700]]) {
  if (n[pole].length > max) throw new Error(`${pole}: ${n[pole].length} > ${max} znaków`);
}

const yaml = [
  '---',
  `tytul: ${q(n.tytul)}`,
  `tytulSeo: ${q(n.tytulSeo)}`,
  `opisSeo: ${q(n.opisSeo)}`,
  `lead: ${q(n.lead)}`,
  'dzial: dane-i-ai',
  'format: Analiza',
  'tematy:',
  '  - ai-w-planowaniu',
  'autorzy:',
  '  - redakcja',
  'opublikowano: 2026-11-07',
  'zdjecie: magazyn-regaly-paletowe',
  `podpisZdjecia: ${q(n.podpisZdjecia)}`,
  'materialy:',
  '  - test-prognozy',
  'powiazane:',
  '  - oee-85-procent',
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
writeFileSync(tu('../../src/content/artykuly/prognozowanie-popytu.md'), yaml.join('\n') + tresc);
console.log(`Zapisano src/content/artykuly/prognozowanie-popytu.md: ${kolejnosc.length} źródeł w kolejności ${kolejnosc.join(', ')}`);
for (const pole of ['tytul', 'tytulSeo', 'opisSeo', 'lead', 'metoda']) console.log(`  ${pole}: ${n[pole].length} znaków`);
