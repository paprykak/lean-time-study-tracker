# Weryfikacja kodu i UX: gałąź fabryka/linki

Weryfikator niezależny, 15.11.2026 r. Zakres: `git diff f58eeb3 HEAD` (początkowo HEAD = 6b5e649; w trakcie pracy doszły commity
4e72ecc, af02536 i 5afbf6e z poprawkami redakcji, więc strony, `dist/` i testy sprawdziłem jeszcze raz na af02536/5afbf6e).
Plików źródłowych nie zmieniałem. `dist/` przebudowałem raz (`npx astro build`, ten sam tryb co w `check:szybki`), bo po
af02536 był nieaktualny.

## Wynik w skrócie

Błędów blokujących nie znalazłem. Rachunek w umowie na zastępstwo zgadza się z niezależnym modelem w 1500 na 1500 przypadków.
Zasada 11 jest spełniona w źródle i w HTML, kontrola SEO przechodzi, każda strona narzędzia ma 5 poprawnych „Podobnych narzędzi”.
Są uwagi do strojenia „Podobnych narzędzi”: kilka pominięć po 6-literowym początku wycina dobre słowa, a test „wszystkie mają 5”
utrwala słabe listy.

## Znaleziska

| # | Plik:linia | Opis | Waga |
|---|---|---|---|
| 1 | (proces) commit af02536 | Do commita trafiły moje tymczasowe pliki `scripts/tmp-*.test.mjs` i `scripts/tmp-podobne-stare.ts`, bo `git add -A` zadziałał w czasie mojej pracy. Usunięto je w 5afbf6e. Przed scaleniem warto zrobić squash albo sprawdzić, że w historii gałęzi nie zostały. | uwaga |
| 2 | src/lib/podobne.ts:35 (`'monito'`) | Początek `monito` wycina też słowo `monitor`. Przez to „Praca w ciąży: monitor i stanie” i „Przerwy w pracy” (hasło „monitor”, przerwa 5 min/h przy monitorze) straciły się nawzajem: przed strojeniem były na swoich listach, teraz ich nie ma. Lepiej pominąć dokładne słowo `monitoring` zamiast początku. | uwaga |
| 3 | src/lib/podobne.ts:36 (`'niepel'`) | Początek `niepel` miał oddzielić „niepełny miesiąc”, ale wycina też `niepelnosprawny/-osc/-oscia`. Dziś skutek jest żaden, bo to słowo ma tylko jedno narzędzie. Każde przyszłe narzędzie o niepełnosprawności straci jednak tego sąsiada. Bezpieczniej pominąć dokładne `niepelny`. | uwaga |
| 4 | src/lib/podobne.ts:35 (`'odszko'`) | Wycięte „odszkodowanie” rozłączyło „Mobbing i dyskryminacja” z „Odszkodowaniem za zwolnienie” (dwa roszczenia przed sądem pracy). Mobbing ma teraz na liście „Dodatek za pracę w nocy” (zob. listę słabych niżej). | uwaga |
| 5 | src/lib/podobne.ts:28 i 34–36 | Komentarz mówi, że lista ma „pełne słowa i ich 6-literowe początki”. Wpisy krótsze niż 6 liter (`okres`, `wolno`, `pozew`, `kiedy`, `brak`, `przy`, `osobe`) działają jednak tylko jak dokładne słowa: `okres` nie usuwa `okresu`, a `pozew` nie usuwa `pozwu`. Działa to poprawnie, ale komentarz wprowadza w błąd. | uwaga |
| 6 | src/lib/podobne.ts:66 (`ADRES_NARZEDZIA`) | Regex łapie tylko `href="/narzedzia/slug"`. Nie łapie linku z kotwicą (`/narzedzia/slug#sekcja`), apostrofów, `href={adresNarzedzia(...)}` ani linków w tekstach wyniku z `src/lib/narzedzia/*.ts`. Dziś na stronach narzędzi nie ma żadnej z tych form (297 linków, wszystkie w obsługiwanej formie), więc nic nie ginie. Pierwszy link z kotwicą zostanie jednak pominięty po cichu. Propozycja: `/href="\/narzedzia\/([a-z0-9-]+)(?:#[^"]*)?"/g` plus test. Liczą się też linki w komentarzach HTML w szablonie. | uwaga |
| 7 | src/lib/podobne.test.ts:20–23 | Test „wszystkie mają pełne 5” przeczy zasadzie z nagłówka podobne.ts („lepiej dwa trafne niż pięć przypadkowych”). Utrwala słabe dopełnienia (lista niżej) i przy kolejnym strojeniu wymusi trzymanie przypadkowych sąsiadów. Jako strażnik regresji lepiej sprawdziłby się próg typu „co najmniej 3”. Można też zostawić 5 i dopisać kilka par ≁ z listy słabych. | uwaga |
| 8 | src/pages/narzedzia/odwolanie-do-sadu-pracy.astro:105 | Dwa kolejne zdania mają ten sam czasownik („…sprostowania, policzy narzędzie o świadectwie pracy. Ile trwa okres wypowiedzenia, policzy…”). Do tego „narzędzie o świadectwie pracy” nic nie „liczy” w sensie kalkulatora. To drobiazg redakcyjny. | uwaga |
| 9 | src/pages/narzedzia/praca-na-wysokosci.astro:135–136 | Związek jest naciągany: drogi i przejścia oraz obciążenie regału to nie praca na wysokości. Zdanie jest poprawne, ale link z tej strony podbija w „Podobnych” parę praca na wysokości ↔ składowanie (pierwsza pozycja). | uwaga |

Sprawdzone bez zastrzeżeń:
- `import.meta.glob` działa w Vitest i w buildzie Astro. Listy „Podobnych” w `dist/` na 6b5e649 były identyczne (113/113) z wynikiem `podobne()` w Vitest. Glob nie trafia do JS klienta: w `dist/_astro` nie ma treści szablonów, a `podobne` importuje tylko frontmatter `StronaNarzedzia.astro`.
- Wynik jest deterministyczny: przy odwróconej kolejności rejestru wszystkie 113 list są takie same. Remisy rozstrzyga `localeCompare('pl')`.
- Akty zmieniające (`/o zmianie|zmieniając/`) i akt pod dwoma kluczami (publikator) działają zgodnie z testem.
- Zmiana list jest szeroka: 105 ze 113 narzędzi ma inną listę niż przed strojeniem (pełne zestawienie przed/po: `/tmp/claude-0/linki-zrzuty/stare.json` i `dump.json`).

## Słowa, które dziś znikają przez pominięcie po początku (skrypt na nazwach, adresach i hasłach)

```
dostan: dostane            kontro: kontrola, kontrolne      monito: monitor, monitoring
niepel: niepelnosprawnoscia, niepelnosprawny, niepelnosprawnosc, niepelny
odszko: odszkodowanie      pierws: pierwsza, pierwszy, pierwszym, pierwszego
pracod: pracodawcy, pracodawce, pracodawca                 pracow: pracownicy, pracownicza, pracownikow
sluzbo: sluzbowy, sluzbowa, sluzbowego, sluzbowym          stanow: stanowiska, stanowisko, stanowiskiem
swiadc: swiadczenie        trzeci: trzecia                  zmiana: zmianach
```
Niezamierzone straty: `monitor` (znalezisko 2), `kontrolne` (dziś tylko jedno narzędzie), `niepelnosprawn*` (znalezisko 3),
`odszkodowanie` przy mobbingu (znalezisko 4). Pozostałe wycięcia są zamierzone i zasadne.

## Umowa na zastępstwo: niezależny rachunek

Model w Pythonie (`/tmp/claude-0/linki-zrzuty/py/cmp.py`):
- staż w pełnych miesiącach według art. 112 KC: okres od początku dnia kończy się dzień przed datą odpowiadającą, a gdy jej brak, ostatniego dnia miesiąca;
- 2 tygodnie to pełne tygodnie od niedzieli do soboty po doręczeniu, a miesiące kończą się ostatniego dnia miesiąca;
- okres według stażu w dniu rozwiązania, czyli min(koniec okresu, data z umowy), liczony iteracyjnie do punktu stałego.

Na 1500 losowych przypadkach (ziarno 15112026; 2/3 ustawione tak, żeby próg 6 miesięcy albo 3 lat wypadał koło doręczenia) wyszło:
**0 rozbieżności** z `wypowiedzenieZastepstwa`. Próg mijał w trakcie okresu w 321 przypadkach, a w 42 data z umowy zatrzymała krótszy okres.
Granica „koniec umowy = dzień progu → dłuższy okres” zgadza się z modelem.

## Wyniki poleceń

- `npx vitest run src/lib/podobne.test.ts src/lib/narzedzia/umowa-zastepstwo.test.ts`: 2 pliki, **101 testów zielonych** (na 6b5e649 i na af02536).
- `npx astro build` (af02536): 136 stron, bez błędów.
- `node scripts/seo-check.mjs` (część `check:szybki`, sprawdza też sklejenie słowa z linkiem i linki do nieistniejących stron): **136 stron, 0 błędów, 0 ostrzeżeń**.
- Zasada 11:
  - w źródle 15 zmienionych stron nie ma żadnego wiersza zaczynającego się od `<a `;
  - w `<main>` wszystkich stron `dist/` regex szukał litery, cyfry albo znaku interpunkcyjnego tuż przed `<a ` oraz litery tuż po `</a>`: **0 sklejeń**.
- „Podobne narzędzia” w `dist/`: 113 stron z sekcją, każda ma dokładnie 5 linków. Wszystkie prowadzą do istniejących stron, bez duplikatów i bez linku do samej siebie.
- Czytnik ekranu: w 15 zmienionych stronach każdy nowy link ma opisową nazwę („narzędzie o drogach i przejściach”, „narzędzie »Co wolno na L4«” itd.). Nie ma „tutaj” ani „więcej”, a na żadnej stronie ta sama nazwa nie prowadzi do dwóch różnych celów.

## Zrzuty (telefon, deviceScaleFactor 1, przewinięte do nowych zdań)

`document.documentElement.scrollWidth - innerWidth = 0` na wszystkich zrzutach. Nic nie jest ucięte, a linki zawijają się w obrębie kolumny.

| Strona | 412 px | 320 px |
|---|---|---|
| umowa-na-zastepstwo | /tmp/claude-0/linki-zrzuty/umowa-na-zastepstwo-412.png | /tmp/claude-0/linki-zrzuty/umowa-na-zastepstwo-320.png |
| sad-pracy-czy-pip | /tmp/claude-0/linki-zrzuty/sad-pracy-czy-pip-412.png | /tmp/claude-0/linki-zrzuty/sad-pracy-czy-pip-320.png |
| praca-na-wysokosci | /tmp/claude-0/linki-zrzuty/praca-na-wysokosci-412.png | /tmp/claude-0/linki-zrzuty/praca-na-wysokosci-320.png |
| kalkulator-l4 | /tmp/claude-0/linki-zrzuty/kalkulator-l4-412.png | /tmp/claude-0/linki-zrzuty/kalkulator-l4-320.png |
| czy-potrzebne-uprawnienia-udt | /tmp/claude-0/linki-zrzuty/czy-potrzebne-uprawnienia-udt-412.png | /tmp/claude-0/linki-zrzuty/czy-potrzebne-uprawnienia-udt-320.png |
| ile-kg-wolno-dzwigac | /tmp/claude-0/linki-zrzuty/ile-kg-wolno-dzwigac-412.png | /tmp/claude-0/linki-zrzuty/ile-kg-wolno-dzwigac-320.png |
| odziez-robocza | /tmp/claude-0/linki-zrzuty/odziez-robocza-412.png | /tmp/claude-0/linki-zrzuty/odziez-robocza-320.png |
| l4-po-zwolnieniu | /tmp/claude-0/linki-zrzuty/l4-po-zwolnieniu-412.png | /tmp/claude-0/linki-zrzuty/l4-po-zwolnieniu-320.png |

## 10 najsłabszych list „Podobnych narzędzi” (stan af02536)

1. **zakaz-konkurencji** → okres-wypowiedzenia, *odprawa-posmiertna*, *zasilek-dla-bezrobotnych*, kalkulator-odprawy, *staz-pracy*. Odprawa pośmiertna i zasiłek dla bezrobotnych nie mają związku z zakazem konkurencji, a odszkodowania (wypadek, zwolnienie) wypadły.
2. **mobbing-i-dyskryminacja** → …, kalkulator-odprawy, *dodatek-za-prace-w-nocy*. Dodatek nocny jest przypadkowy; brakuje odszkodowania za zwolnienie (znalezisko 4).
3. **pracownik-niepelnosprawny** → …, *czas-jazdy-kierowcy*. Kierowca jest tu przypadkowy (wspólna „przerwa” w hasłach); brakuje renty z tytułu niezdolności.
4. **swiadczenie-urlopowe** → brutto-netto, kalkulator-urlopu, zlecenie-netto, *delegacja-krajowa*, *delegacja-zagraniczna*. Delegacje nie mają związku ze świadczeniem z ZFŚS. Z drugiej strony **zerowy-pit** i **zwrot-podatku-pit-37** dostają świadczenie urlopowe.
5. **monitoring-w-pracy** → sad-pracy-czy-pip, informacja-o-warunkach-zatrudnienia, kontrola-trzezwosci, *swiadectwo-pracy*, *staz-pracy*. Świadectwo pracy i staż są przypadkowe.
6. **praca-w-ciazy** → *praca-na-wysokosci*, dodatek-wyrownawczy, drgania, hałas, umowa-na-zastepstwo. Brakuje „Ile kg wolno dźwigać” (strona dźwigania linkuje do pracy w ciąży) i „Przerw w pracy” (monitor, znalezisko 2).
7. **odszkodowanie-za-wypadek-przy-pracy** → …, kalkulator-l4, *odpowiedzialnosc-materialna*. Odpowiedzialność materialna dotyczy szkody wyrządzonej przez pracownika, czyli odwrotnego kierunku; brakuje zasiłku chorobowego „wypadkowego” i świadczenia rehabilitacyjnego.
8. **praca-cudzoziemca** → zgloszenie-pracy-cudzoziemca, informacja-o-warunkach-zatrudnienia, *kalkulator-odprawy*, *staz-pracy*, *kara-porzadkowa*. Trzy ostatnie są przypadkowe; podobnie **zgloszenie-pracy-cudzoziemca** → *sad-pracy-czy-pip*, *staz-pracy*.
9. **koszt-pracodawcy** → brutto-netto, kalkulator-ppk, *kalkulator-l4*, zlecenie-netto, *zasilek-macierzynski*. Brakuje płacy minimalnej i nadgodzin; L4 i macierzyński są słabe.
10. **okres-probny** → …, *odpowiedzialnosc-materialna*. Podobnie **limit-pracy-tymczasowej** → *kara-porzadkowa*, **dni-robocze** → *odwolanie-do-sadu-pracy* (tylko przez link), **posilki-profilaktyczne** → *odszkodowanie-za-wypadek-przy-pracy*, **odpowiedzialnosc-materialna** → *wynagrodzenie-za-niepelny-miesiac*.

Pliki robocze: `/tmp/claude-0/linki-zrzuty/dump.json` (listy po strojeniu, wycięte słowa, test determinizmu), `stare.json` (listy przed strojeniem),
`podobne-dist.json` (listy z `dist/` na af02536), `py/` (przypadki i model w Pythonie).
