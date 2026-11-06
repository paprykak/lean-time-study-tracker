# Marka Rytmu Hali

## Logo (`logo/`)
Koncepcja C: plakietka z dachem szedowym, litery RH, napis „RYTM HALI”, podtytuł „Produkcja · Magazyn · Dane”.
Tekst zamieniony na krzywe z fontów Noto (SIL OFL 1.1).

**Stan:** pliki w `logo/svg/` to robocze odtworzenie koncepcji C z opisu w prompcie, wykonane w sesji w chmurze,
która nie miała dostępu do oryginałów z komputera Patryka (`/home/patryk/Pulpit/rytm-hali/marka/logo/`).
Po dodaniu oryginałów: podmień pliki w `logo/svg/` (te same nazwy) i uruchom `npm run logo -- --tylko-pochodne`,
żeby odtworzyć favicony, awatar, logo PNG i okładkę. Szablony nie wymagają zmian.

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
