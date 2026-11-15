# Pakiet „wyszukiwarka2”: trafność wyszukiwarki narzędzi (2026-11-15)

Gałąź `fabryka/wyszukiwarka2`, ostatni commit: zob. `git log -1` (ten raport jest w commicie z dopiskiem „pełny check zielony”).
Pliki: `src/lib/szukaj-narzedzi.ts` (algorytm), `src/data/sprawy.ts` (hasła), `src/lib/szukaj-narzedzi.test.ts`
(testy algorytmu i haseł w obie strony), nowy `src/lib/szukaj-zapytania-z-hali.test.ts` (zestaw zapytań z progiem),
`src/lib/szukaj-klient.ts` (podświetlanie literówek), `src/pages/narzedzia/index.astro` (filtr kategorii przekazany do
wyszukiwarki, jedna linijka; wymagała tego zmiana progu). `src/lib/indeks-narzedzi.ts` bez zmian.

## Wynik

| Zbiór | Przed (stary algorytm, stare hasła) | Sam nowy algorytm (stare hasła) | Po (algorytm i hasła) |
|---|---|---|---|
| Zestaw główny, 716 zapytań z narzędziem | 85,9% na 1. miejscu, 94,1% w trójce | 90,9% / 96,1% | **95,7% / 99,3%** |
| w tym podpowiedzi Google (395) | 78,0% / 90,4% | — | 94,4% / 99,2% |
| w tym zapytania z testów repozytorium (205) | 95,1% / 98,5% | — | 97,1% / 99,0% |
| w tym pytania z FAQ (114) | 98,2% / 100% | — | 98,2% / 100% |
| Zestaw kontrolny, 147 zapytań z narzędziem (nieużyty do strojenia) | 68,7% / 86,4% | 77,6% / 89,8% | 81,0% / 90,5% |

Zestaw główny służył do strojenia, więc jego wynik jest zawyżony. Uczciwą miarą uogólnienia jest zestaw kontrolny:
178 świeżych podpowiedzi Google z 83 innych fraz początkowych, ocenionych tak samo (dwóch oceniających, trzeci przy sporze)
już po strojeniu i bez dopisywania pod nie haseł. Różnica (81% wobec 96%) to głównie słownictwo, którego żadne narzędzie
nie zna („emerytura a praca na etacie” → dorabianie do renty, „zwolnienie lekarskie a umowa zlecenie” → zasiłek na zleceniu):
materiał na następną rundę haseł, nie błąd algorytmu.

Każde zapytanie obu zbiorów z wynikiem przed i po (pierwsza trójka) jest w `wyniki-przed-i-po.tsv`. Poprawiło się
113 zapytań (na 1. miejsce albo do trójki), pogorszyło 17 (lista niżej).

## Zestaw zapytań

- **786 zapytań** (`dane/zestaw-zapytan.json`, w teście `src/lib/szukaj-zapytania-z-hali.test.ts`): 452 podpowiedzi Google
  (285 fraz początkowych z nazw narzędzi, haseł i spraw z hali, `dane/frazy-poczatkowe.txt`; 2735 podpowiedzi
  `dane/podpowiedzi-google.json`, po dwie na frazę, bez ofert pracy, sklepów, lotów, nauczycieli i budżetówki;
  odrzucone z powodem w `skrypty/odrzuc.mjs`), 218 zapytań z testów wyszukiwarki w repozytorium, 114 pytań z FAQ
  (po jednym z narzędzia), 2 zapytania z raportów audytów („odprawa”, „kierownik dał mi upomnienie”).
- **Oczekiwane narzędzie:** dwóch niezależnych oceniających (podagenci na samym katalogu narzędzi bez haseł, bez wglądu
  w wyniki wyszukiwarki, `dane/katalog-dla-oceniajacych.md`): zgodność w 767 z 786, 19 sporów rozstrzygnął trzeci
  (`dane/ocena-A.tsv`, `ocena-B.tsv`, `spory.txt`, `rozstrzygniecia.tsv`, `etykiety.tsv`). 70 zapytań bez narzędzia.
- **Zestaw kontrolny** (`dane/kontrolny/`): 178 zapytań, zgodność 160, 18 sporów u trzeciego, 31 bez narzędzia.
- **Świadomie niespełnione dwa zapytania**, bo oceniający są innego zdania niż wcześniejsze testy, które zostają:
  „wyrównanie wynagrodzenia” (oceniający: dodatek wyrównawczy; test rundy 3: to zwykle wyrównanie zaległej pensji)
  i „zepsułem sobie zdrowie w pracy” (oceniający: choroba zawodowa; test audytu jakosc3: wypadek przy pracy).

## Zmiany algorytmu (`src/lib/szukaj-narzedzi.ts`, opis na górze pliku)

1. **Waga słowa według rzadkości** (√ln(N/liczba narzędzi, które je znają)): „odprawa” mówi więcej niż „pracy”. Dawniej każde
   słowo ważyło tyle samo, a o kolejności decydowała liczba trafionych słów.
2. **Fraza wyczerpana przez zapytanie** (nazwa, temat nazwy przed dwukropkiem, hasło, tytuł, pytanie z FAQ): iloczyn tego,
   jaka część frazy jest w zapytaniu i jaka część wagi zapytania jest we frazie; słowa pomijane liczą się we frazach z wagą
   0,2. To usuwa błąd „słowo z nazwy innego narzędzia waży więcej niż identyczne hasło” („ile dostanę na L4”, „odprawa”).
3. **Nieznane słowo nie zeruje wyniku**: słowo, którego nie zna żadne narzędzie, jest pomijane, a próg listy liczy się
   od najlepszego narzędzia (50% jego pokrycia), a nie od połowy słów. „kierownik dał mi upomnienie” → kara porządkowa.
4. **Remisy bez alfabetu**: najczęstsze sprawy (+0,02), potem krótsza nazwa, potem kolejność rejestru; premia +0,2,
   gdy nazwa zaczyna się od słowa zapytania („przedawnienie” → „Przedawnienie wynagrodzenia…”).
5. **Odmiana dokładniej**: wspólny początek ≥ 4 znaki i ≥ 70% krótszego słowa, końcówki do 3 znaków (razem 3, przy
   dłuższym początku 4); czas przeszły w 1. osobie do 4 („zniszczyłem” ~ „zniszczony”); „lat” ~ „lata”.
   Nie pasują już: „szkoła”/„szkoda”, „przed”/„przerwy”, „kierownik”/„kierowcy”, „wyrównanie”/„wyrównawczy”, „m”/„ma”.
6. **Pisanie na żywo**: początek słowa tylko dla ostatniego słowa zapytania (pisanego); słowo, którego nie ma w słowniku,
   a które zaczyna inne słowa, liczy się tylko jako początek („przeda” → przedawnienie, nie „przerwy”); przy ponad
   8 słowach zostaje ostatnie.
7. **Literówki**: gdy słowo nie pasuje inaczej; od 7 znaków odległość 1 z przestawieniem („wypowiedzenei”), przy 5–6
   tylko przestawienie („urlpo”); trafienie z literówki jest podświetlane w wyniku.
8. **Słowa bez treści z podpowiedzi**: „kodeks”, „przepisy”, „zasady”, „wzór”, „sobie”, „może”, „nad”, „bez”, lata „2026”.
9. **Filtr kategorii przed progiem** (`szukaj(indeks, q, limit, kategoria)`), żeby lista w kategorii na /narzedzia nie
   robiła się pusta. Słownik indeksu liczony raz: każde słowo zapytania porównywane z ~1750 słowami, nie z każdym polem.

Bez nowych zależności; wyszukiwarka zostaje w przeglądarce, indeks bez zmian formatu.

Skrypty pomiaru: `skrypty/ocen.mjs` (zestaw główny), `ocen-k.mjs` (kontrolny), `tabela.mjs` (przed i po), `brak.mjs`.

## Zmiany haseł (`src/data/sprawy.ts`), każda z testem w obie strony

Dodane (26 przy 17 narzędziach), źródło: dosłowna podpowiedź Google (pl, 2026-11-15) zawierająca hasło:
brutto-netto „najniższa krajowa na rękę”, „najniższa krajowa netto”; kalkulator-nadgodzin „odbiór nadgodzin”, „wolne
za nadgodziny”; placa-minimalna „pensja minimalna”; termin-wyplaty-wynagrodzenia „wypłata do 10 dnia miesiąca”;
kalkulator-urlopu „urlop na żądanie”; wynagrodzenie-za-urlop „wynagrodzenie za urlop wypoczynkowy”; dni-wolne-od-pracy
„święto w sobotę”, „Boże Ciało”, „11 listopada”; okres-wypowiedzenia „wypowiedzenie umowy na czas określony”;
kontrola-grafiku „praca zmianowa”, „odpoczynek dobowy”; przerwy-w-pracy „komputer”; temperatura-w-pracy „ile stopni
w pracy”, „woda w pracy”, „temperatura na hali”; sad-pracy-czy-pip „gdzie zgłosić pracodawcę”; okres-wyczekiwania
„chorobowe po jakim czasie”; praca-cudzoziemca „karta pobytu”; choroba-zawodowa „choroba zawodowa kręgosłupa”,
„zwyrodnienie kręgosłupa”; czas-jazdy-kierowcy „odpoczynek dobowy kierowcy”; co-wolno-na-l4 „co wolno na L4”, „co można
na L4”. „komputer” nie jest podpowiedzią (fraza początkowa), zostaje, bo strona przerw odpowiada o pracy przy komputerze,
a test audytu jakosc3 wymaga, by „okulary do komputera” nie prowadziły do monitoringu.

Usunięte (11): ogólne słowo przy narzędziu pobocznym zabierało je narzędziu, do którego należy: „L4” (okres zasiłkowy),
„zwolnienie lekarskie” (zwolnienie na L4, L4 po zwolnieniu), „emerytura” (PPK), „odprawa” (odprawa pośmiertna,
zwolnienia grupowe), „odszkodowanie” (zakaz konkurencji), „szkolenie” (lojalka), „świadectwo pracy” (staż pracy),
„wózek” (drgania), „sobota pracująca” (praca w sobotę: w podpowiedziach to kalendarz sobót pracujących).

Zasada w komentarzu `sprawy.ts` uzupełniona: hasło także wtedy, gdy całe częste zapytanie przegrywa z innym narzędziem
(wyszukiwarka liczy hasło jako frazę), i tylko dla sprawy, na którą strona naprawdę odpowiada.

## Weryfikacja

- **Redaktor** (czy hasła to prawdziwe zapytania i czy strona na nie odpowiada): 12 uwag. Usunięte hasła, na które strona
  nie odpowiada: „sobota pracująca” przy dniach wolnych, „zmiana grafiku” (strona nie mówi o terminie powiadomienia),
  „okulary do komputera” (żadna strona nie mówi o okularach), „gdzie zgłosić pracę bez umowy”, „praca w nocy a dziecko”
  (zabierało „praca w nocy”); usunięte zbędne, bez wpływu na wynik: „stawka godzinowa”, „praca przy komputerze”,
  „Wigilia wolna”, „dzień wolny za święto”. Zostało 5 haseł, które redaktor uznał za zbędne (słowa są w FAQ), bo bez nich
  częste zapytanie przegrywa z innym narzędziem (pomiar każdego osobno; dwa wymaga test audytu): „wynagrodzenie za urlop
  wypoczynkowy”, „święto w sobotę”, „urlop na żądanie”, „odpoczynek dobowy kierowcy”, „wypowiedzenie umowy na czas
  określony”, oraz „co wolno na L4”.
- **Weryfikator kodu i UX**: 9 znalezisk, wszystkie poprawione z testami (pisanie na żywo „przeda”, „nad”, „kal”;
  jednowyrazowe hasła „wózek”, „odszkodowanie”, „emerytura”, „szkolenie”; „praca w nocy”; „zwolnienie lekarskie”;
  literówki „szkoła”/„piłka” i brak podświetlenia; pusty filtr kategorii; ucinanie pisanego słowa przy ponad 8 słowach;
  „m²” ~ „ma”). Funkcja literówek porównana z odległością Damerau na 300 tys. losowych par: zgodna.
- **Wydajność** (weryfikator, Chromium z procesorem spowolnionym 6×, przed ostatnimi poprawkami): przygotowanie indeksu
  38–44 ms raz na stronę (było 18), wyszukiwanie przy pisaniu średnio 3,7 ms, p99 15,4 ms, najwyżej 21,8 ms na znak
  (było najwyżej 14,4); mieści się w budżecie klatki przy pisaniu (pole czeka 120 ms po ostatnim znaku). Node, stan
  końcowy: przygotowanie 7,5 ms, wyszukiwanie średnio 1,0 ms na 23 661 prefiksach zapytań zestawu.
- **Rozmiar**: +0,8 KB gzip JavaScriptu na stronach z polem wyszukiwania (moduł 2,1 KB zamiast 1,2 KB); najcięższa strona
  25,6 KB przy limicie 30 KB, `scripts/budzet.mjs` bez przekroczeń.
- **Czytnik ekranu**: interfejs bez zmian (lista wyników, licznik w `role="status"` po 700 ms, „Odpowiada na: …”); brak pola
  `pytanie` zamiast `undefined` nie zmienia widoku. Sprawdzone z kodu i w E2E (axe), bez prawdziwego NVDA/VoiceOver.

## Wynik checku

`npm run -s check:szybki`: EXIT 0. `BEZ_WEBKIT=1 npm run check`: EXIT 0 (2517 testów jednostkowych w 143 plikach,
2417 testów E2E na komputerze i Androidzie w 8,8 min, axe, Lighthouse, budżet, build produkcji przed startem).
Nowe testy: plik zestawu z progiem 95%/99% (także osobno dla podpowiedzi Google: 93%/99%), bloki algorytmu, haseł
w obie strony i poprawek po weryfikatorze w `szukaj-narzedzi.test.ts`.

Zrzuty (`zrzuty/`, podgląd `RH_PODGLAD=1`, telefon 412 px i 320 px): `/szukaj` dla „kierownik dał mi upomnienie”,
„odprawa”, „ile stopni w pracy max” i pole na stronie głównej przy pisaniu „przeda”. Przy obu szerokościach strona nie
przewija się w bok i żaden element treści nie wychodzi poza ekran (pomiar w skrypcie, nie tylko na oko); pasek kategorii
u góry to wspólny przewijany pasek, tak jak wcześniej.

## Pogorszone zapytania (17)

Zestaw główny: „zwolnienie lekarskie po ustaniu zatrudnienia” (L4 po zwolnieniu 1. → 2.), „wolne za sobotę 2026” i „…2027”
(dni wolne 1. → 2.), „praca 12 godzin dziennie”, „praca po 12 godzin ile wolnego” (równoważny 1. → 2.), „35 godzin odpoczynku
tygodniowego”, „system 12 godzinny grafik” (kontrola grafiku 1. → 2./3.), „wypowiedzenie na l4 przez pracownika”,
„zwolnienie z pracy ile wypowiedzenia” (okres wypowiedzenia 1. → 2.), dwa pytania z FAQ (1. → 2.). Kontrolny:
„chorobowe a umowa zlecenie”, „chorobowe a koniec umowy”, „potrącenie z pensji za l4”, „emerytura a praca na etacie”,
„renta a praca na cały etat”, „renta a praca zarobkowa”, „renta a praca na zlecenie”. Wszystkie oprócz „renta a praca
na cały etat” zostają w pierwszej trójce; przyczyna to głównie premia za początek nazwy („Renta…”, „Zwolnienie…”).

## Sprawy bez narzędzia (według liczby podpowiedzi Google, 3556 podpowiedzi z trzech pobrań)

| Podpowiedzi | Sprawa |
|---:|---|
| 41 | premia, trzynastka, dodatek stażowy, wynagrodzenie zasadnicze |
| 34 | praca na czarno, praca bez umowy, zgłoszenie zlecenia do ZUS (częściowo: „Nowa praca: terminy pracodawcy”) |
| 31 | nieobecność nieusprawiedliwiona, spóźnienia, porzucenie pracy |
| 30 | kontrola PIP, skarga na pracodawcę (wzór, do ZUS) |
| 21 | wiek emerytalny, wcześniejsza emerytura |
| 20 | regulamin pracy, układ zbiorowy |
| 20 | staż z urzędu pracy, praktyki |
| 20 | odmowa delegacji, nadgodzin, urlopu (czy wolno odmówić) |
| 19 | porozumienie stron (rozwiązanie umowy) |
| 15 | przyczyny zwolnienia dyscyplinarnego |
| 14 | potrącenia komornicze z wypłaty |
| 10 | umowa o dzieło |
| 10 | pasek wypłaty (co musi zawierać, obowiązek) |
| 10 | przerwa na papierosa |
| 9 | podpisanie i wycofanie wypowiedzenia, podstawa prawna |
| 8 | pracodawca nie płaci składek, termin składek ZUS |
| 8 | świadectwo pracy: wzór, przy zleceniu, a ekwiwalent |
| 8 | zakres obowiązków, kod zawodu |
| 7 | ubezpieczenie zdrowotne po zwolnieniu |
| 7 | ciąża a umowa terminowa, okres próbny i zlecenie; kiedy powiedzieć o ciąży |
| 6 | L4 wystawione wstecz |
| 6 | zwrot akcyzy |
| 3 | L4 i chorobowe a emerytura, urlop a L4 |
| 3 | renta socjalna |
| 2 | próg podatkowy, PIT-11A |
| 2 | dodatek wyrównawczy do emerytury, wychowawczy a emerytura |
| 1 | uprawnienia budowlane; skutki pracy w nocy; macierzyński na zleceniu; praca po godzinach w domu |

Liczba to podpowiedzi, które dotyczą sprawy (wzorce w `skrypty/brak.mjs`), a nie wyświetlenia; kolejność orientacyjna.
Kalendarz sobót pracujących (hasło usunięte z dwóch narzędzi) to osobna sprawa z ok. 10 podpowiedziami.

## Propozycje dla pakietu „jakosc5” (hasła narzędzi, których ta runda nie ruszała)

- `monitoring-w-pracy`: „monitoring komputerów” przyciąga ogólne „komputer” i „okulary do komputera”; propozycja:
  „monitoring komputerów pracowników” zamiast „monitoring komputerów” (dosłowna podpowiedź Google).
- `odpowiedzialnosc-materialna`: „potrącenie z wypłaty za szkodę” zabiera „potrącenie z pensji za l4” wynagrodzeniu za
  niepełny miesiąc; bez zmiany hasła wystarczy hasło „potrącenie za L4” u tamtego narzędzia (następna runda).
- `fundusz-socjalny`, `zgloszenie-pracy-cudzoziemca`, `zwrot-podatku-pit-37`, `odszkodowanie-za-zwolnienie`: bez uwag
  z tego zestawu (wszystkie ich zapytania trafiają na 1. miejsce albo w trójkę).

## Czego nie sprawdzono

Prawdziwy czytnik ekranu (NVDA, VoiceOver) i prawdziwy telefon (pomiar z emulowanym spowolnieniem procesora); WebKit
lokalnie (`BEZ_WEBKIT=1`, w CI na GitHubie jest); wyniki pełnotekstowe Pagefind na /szukaj (poza zakresem).

## Dla Patryka (3)

1. Kolejne narzędzia z listy spraw bez narzędzia: najwięcej podpowiedzi mają premie i dodatki, praca na czarno,
   nieobecność i spóźnienia, kontrola PIP i skarga, wiek emerytalny.
2. Dwa wcześniejsze testy są sprzeczne z oceną dwóch oceniających („wyrównanie wynagrodzenia”, „zepsułem sobie zdrowie
   w pracy”); zostawiłem testy. Jedno zdanie decyzji wystarczy, by poprawić hasła.
3. Zestaw kontrolny pokazuje 81% / 90,5%: następna runda haseł z jego błędów (np. „emerytura/renta a praca” → dorabianie
   do renty, „zwolnienie lekarskie a zlecenie” → zasiłek na zleceniu) podniesie trafność dla zapytań spoza zestawu.
