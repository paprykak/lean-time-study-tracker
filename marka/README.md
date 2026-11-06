# Marka Rytmu Hali

## Logo (`logo/`)
Koncepcja C: plakietka z dachem szedowym, litery RH, napis „RYTM HALI”, podtytuł „Produkcja · Magazyn · Dane”.
Tekst zamieniony na krzywe z fontów Noto (SIL OFL 1.1).

**Stan:** pliki w `logo/svg/` to odtworzenie koncepcji C z opisu w prompcie (sesja w chmurze nie miała dostępu
do oryginałów z `/home/patryk/Pulpit/rytm-hali/marka/logo/`), po szlifie z 2026-11-06 na prośbę Patryka.
Geometria i wszystkie wymiary: `logo/geometria.mjs` (`PARAMETRY`). Porównanie wariantów w realnych rozmiarach:
`node marka/logo/porownaj.mjs porownanie.png`. Po dodaniu oryginałów: podmień pliki w `logo/svg/` (te same nazwy)
i uruchom `npm run logo -- --tylko-pochodne`, żeby odtworzyć favicony, awatar, logo PNG i okładkę.

### Szlif z 2026-11-06: co i dlaczego
1. **Dach i korpus to jedna sylwetka hali.** Wcześniej dach unosił się nad korpusem (szczelina) i czytał się jak
   ozdobny ząbkowany pasek albo korona. Połączony z korpusem tworzy klasyczny piktogram hali z dachem szedowym:
   znak rozpoznawalny od 16 px i jednoznaczny („hala”, nie „piła”).
2. **Zęby dachu wznoszą się w prawo** (spadek w górę, pionowe przeszklenie po prawej). Kierunek czytania
   prowadzi oko w górę i do napisu; pionowy bok ostatniego zęba domyka plakietkę od strony tekstu. Rytm trzech
   równych zębów to wprost „rytm hali”.
3. **Monogram i napis w tej samej grubości** (Noto Sans Display 800). Wcześniej RH było cięższe od napisu.
   Korekta par RY i odstępu między słowami (wersaliki z dodatkowym światłem miały za szeroką spację).
4. **Blok tekstu ma wysokość korpusu:** góra wersalików napisu leży na linii okapu (podstawa dachu), linia bazowa
   podtytułu na dole plakietki. Dwie linie wyrównania zamiast „pływającego” tekstu.
5. **Podtytuł wersalikami ze stałym światłem 0,14 em**, rozmiar dobrany tak, żeby miał szerokość napisu.
   Wcześniej małe litery były rozstrzelone do szerokości napisu (błąd typograficzny: małych liter się nie rozstrzela).
   Wersaliki z małym rozmiarem i światłem pasują do etykiet kategorii w serwisie.
6. **Pole rysunku liczone z obrysu glifów** (wielkie J w Noto schodzi pod linię bazową; wcześniej było ucięte).
7. **Mała ikona (16 px)** bez liter, krawędzie na siatce 16 i 32 px, bez szczeliny: ostra w karcie przeglądarki.

**Pole ochronne:** wokół logo co najmniej wysokość zęba dachu (21 jednostek plakietki, czyli około 1/5 jej boku).
**Najmniejszy rozmiar:** logo pełne od 48 px wysokości (niżej podtytuł przestaje być czytelny), kompaktowe od 20 px,
ikona z literami od 24 px, poniżej ikona mała.

| Plik | Użycie |
|---|---|
| `svg/rytm-hali-jasne.svg` | logo na jasnym tle (nagłówek na komputerze, dokumenty) |
| `svg/rytm-hali-ciemne.svg` | logo na ciemnym tle (stopka, okładki) |
| `svg/rytm-hali-cb.svg`, `svg/rytm-hali-cb-negatyw.svg` | wersje czarno-białe (druk, faks, grawer) |
| `svg/rytm-hali-kompakt-*.svg` | bez podtytułu, do małych rozmiarów (nagłówek na telefonie) |
| `svg/rytm-hali-ikona*.svg` | sama plakietka; „mała” bez liter, ostra w 16 px |
| `png/favicon-16/32/48.png`, `../public/favicon.ico`, `../public/favicon.svg` | favicony |
| `png/apple-touch-icon-180.png` | ikona na ekranie iPhone'a |
| `png/awatar-linkedin-400.png` | awatar z marginesem na przycięcie do koła (LinkedIn, inne profile) |
| `png/okladka-domyslna-1200x630.jpg` | domyślna okładka udostępnień (og:image) |
| `png/logo-jasne-1200.png`, `png/logo-ciemne-1200.png` | logo rastrowe do dokumentów i poczty |

## Kolory i fonty
Tokeny: `src/styles/global.css` (blok `@theme`). Grafit `#1d2530`, `#11161d`, pomarańcz `#e8590c`
(mały tekst w odcieniu `#c2410c`, żeby mieć kontrast 4,5:1 na białym). Fonty: Noto Sans i Noto Sans Display,
podzbiór z polskimi znakami (`npm run fonty`).

## Zdjęcia (`zdjecia/rejestr.json`)
Tylko prawdziwe zdjęcia, CC0 albo CC BY, każde za zgodą Patryka, z wpisem w rejestrze przed publikacją.
