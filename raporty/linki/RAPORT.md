# Pakiet „linki”: raport

Gałąź: `fabryka/linki` (od `f58eeb3`). Pełny check zielony na `7d6eeae`. Po nim zmieniły się tylko pliki w `raporty/linki/`; ostatni commit to commit z tym raportem.
Weryfikacje: redaktor (`redakcja.md`: 5 zdań bez uwag, 11 do poprawy, 1 do usunięcia; wszystkie uwagi wprowadzone poza jedną opisaną niżej) i weryfikator kodu i UX (`weryfikacja-kodu.md`: 0 błędów, 9 uwag; 5 poprawionych, 4 opisane niżej).

## 1. Linki do sześciu narzędzi (17 linków na 14 stronach)

Każdy link stoi w zdaniu z powodem, w tym samym wierszu szablonu co tekst przed nim (zasada 11), w sekcji wyjaśnienia. Rachunek i treść merytoryczna stron się nie zmieniły. Strony z wyłączeń nie dostały linków.

| Strona | Cel | Zdanie |
|---|---|---|
| `kalkulator-l4` | `co-wolno-na-l4` | Co wolno robić na zwolnieniu, żeby nie stracić wynagrodzenia chorobowego ani zasiłku, i jak wygląda kontrola ZUS, opisuje narzędzie „Co wolno na L4”. |
| `zwolnienie-na-l4` | `co-wolno-na-l4` | Co wolno robić na zwolnieniu, żeby nie stracić zasiłku, i jak wygląda kontrola ZUS, opisuje narzędzie „Co wolno na L4”. |
| `okres-zasilkowy` | `co-wolno-na-l4` | Czy praca, wyjazd albo zakupy w czasie zwolnienia odbiorą zasiłek, sprawdzi narzędzie „Co wolno na L4”. |
| `l4-po-zwolnieniu` | `co-wolno-na-l4` | Zasiłek za okres po ustaniu ubezpieczenia można stracić na tych samych zasadach co w czasie pracy, np. za pracę zarobkową na zwolnieniu (art. 17 ust. 4 ustawy zasiłkowej, od 13 kwietnia 2026 r.). Co wolno robić na zwolnieniu, opisuje narzędzie „Co wolno na L4”. |
| `odwolanie-do-sadu-pracy` | `swiadectwo-pracy` | Do kiedy pracodawca musi wydać świadectwo i do kiedy żądać jego sprostowania, pokaże narzędzie o świadectwie pracy. |
| `sad-pracy-czy-pip` | `swiadectwo-pracy` | Do kiedy pracodawca musi wydać świadectwo pracy i do kiedy żądać jego sprostowania, policzy narzędzie o świadectwie pracy. |
| `sad-pracy-czy-pip` | `odpowiedzialnosc-materialna` | Gdy to pracodawca żąda od Ciebie odszkodowania za szkodę albo manko, ile najwyżej zapłacisz, pokaże narzędzie o odpowiedzialności materialnej. |
| `wolne-na-dziecko` | `swiadectwo-pracy` | (…informację o nich podaje świadectwo pracy.) Co jeszcze musi być w świadectwie i jak je sprostować, sprawdzi narzędzie o świadectwie pracy. |
| `kontrola-trzezwosci` | `monitoring-w-pracy` | Inne sposoby nadzoru w zakładzie, czyli kamery, kontrolę poczty służbowej i GPS, opisuje narzędzie o monitoringu w pracy. |
| `odziez-robocza` | `odpowiedzialnosc-materialna` | (po zdaniu o odzieży powierzonej, art. 124) Ile najwyżej zapłacisz za szkodę w mieniu pracodawcy i kiedy wolno mu potrącić odszkodowanie z pensji, sprawdzi narzędzie o odpowiedzialności materialnej. |
| `praca-na-wysokosci` | `drogi-i-przejscia` | Szerokość przejść i wysokość dojść do stanowisk, także na antresolach i pomostach w hali, sprawdzi narzędzie o drogach i przejściach. |
| `praca-na-wysokosci` | `skladowanie-w-magazynie` | Czy towar na regale, przy którym pracujesz na wysokości, nie przeciąża go, sprawdzi narzędzie o składowaniu w magazynie. |
| `czy-potrzebne-uprawnienia-udt` | `drogi-i-przejscia` | Co przepisy mówią o drodze dla wózka i o pieszych na tej samej drodze, opisuje narzędzie o drogach i przejściach. |
| `czy-potrzebne-uprawnienia-udt` | `skladowanie-w-magazynie` | Obciążenie regałów i odległości w magazynie sprawdzi narzędzie o składowaniu w magazynie. |
| `ile-kg-wolno-dzwigac` | `skladowanie-w-magazynie` | Czy towar nie przeciąża samego regału, sprawdzi narzędzie o składowaniu w magazynie; potrzebne jest dopuszczalne obciążenie z tabliczki na regale. |
| `normy-sanitarne` | `drogi-i-przejscia` | Szerokość przejść, wysokość dojść i nachylenie pochylni z ogólnych przepisów BHP sprawdzi narzędzie o drogach i przejściach. |
| `powierzchnia-na-pracownika` | `drogi-i-przejscia` | Jak szerokie ma być przejście między maszynami i regałami, sprawdzi narzędzie o drogach i przejściach. |

Liczba nowych linków do celów: `co-wolno-na-l4` 4, `swiadectwo-pracy` 3, `drogi-i-przejscia` 4, `skladowanie-w-magazynie` 3, `odpowiedzialnosc-materialna` 2, `monitoring-w-pracy` 1. Ostatni z tych celów ma jeden link, bo żadna strona spoza wyłączeń nie mówi o nadzorze nad pracownikiem; przy linkach z przerw w pracy, sądu pracy czy PIP oraz rodzica w pracy powód byłby naciągany. Art. 17 ust. 4 ustawy zasiłkowej i art. 36 § 5 Kp sprawdzone w tekstach jednolitych z API Sejmu (Dz.U. 2026 poz. 854 i 1245). Link z `umowa-na-zastepstwo` do odpowiedzialności materialnej usunięty po uwadze redaktora, bo przerywał akapit o okresie wypowiedzenia. Link z `praca-na-wysokosci` do dróg i przejść zostaje wbrew redaktorowi, z nowym powodem: tabela tego narzędzia obejmuje pomosty, antresole i dojścia do stanowisk.

## 2. „Podobne narzędzia” (`src/lib/podobne.ts`)

Przyczyny słabych list: długie hasła z hali w nowych narzędziach dawały po 1,5 punktu za słowa ogólne („pracodawca”, „służbowy”, „kontrola”, „wolno”, „wyjazd”, „pozew”). Do tego ten sam akt występuje w rejestrze pod dwoma kluczami (`ogolneBhp` i `ogolneBhpHala`: Dz.U. 2003 poz. 1650; tak samo wózki, badania profilaktyczne i obwieszczenia M.P.). Nowe reguły, każda działa od razu na wiele stron:
- +2,5, gdy jedna strona linkuje do drugiej w treści (linki odczytywane ze źródeł stron przez `import.meta.glob`). W ten sposób nowe zdania z pkt 1 zasilają też kolumnę boczną.
- Akt rozpoznawany po publikatorze. Ustawy zmieniające się nie liczą.
- Słowo wspólne tylko w hasłach obu narzędzi daje 1 punkt zamiast 1,5. Lista słów ogólnych jest dłuższa, a „monitoring” i „niepełny” są pomijane tylko jako całe słowa.

Wynik: zmieniło się 105 ze 113 list i przybyło 201 nowych par. Każde narzędzie ma 5 podobnych, tak jak przed zmianą. Listy w `dist/` są identyczne z wynikiem funkcji w Vitest (113 na 113), wynik jest deterministyczny, a treść szablonów nie trafia do JS klienta. Testy w `podobne.test.ts` obejmują 26 par „→” (14 nowych), 31 par „≁” (24 nowe), test „wszystkie mają 5”, test linku w obie strony, regex linków (kotwica, apostrof) i akt pod dwoma kluczami. Pełna lista przed i po: `podobne.md`. Przykłady:

| Narzędzie | Przed | Po |
|---|---|---|
| odpowiedzialnosc-materialna | przedawnienie-wynagrodzenia, sad-pracy-czy-pip, swiadectwo-pracy, monitoring-w-pracy, informacja-o-warunkach-zatrudnienia | kara-porzadkowa, przedawnienie-wynagrodzenia, sad-pracy-czy-pip, termin-wyplaty-wynagrodzenia, wynagrodzenie-za-niepelny-miesiac |
| monitoring-w-pracy | odpowiedzialnosc-materialna, sad-pracy-czy-pip, swiadectwo-pracy, co-wolno-na-l4, dodatek-wyrownawczy | sad-pracy-czy-pip, informacja-o-warunkach-zatrudnienia, kontrola-trzezwosci, swiadectwo-pracy, staz-pracy |
| drogi-i-przejscia | skladowanie-w-magazynie, badania-udt, odpowiedzialnosc-materialna, waznosc-uprawnien-udt, drgania-w-pracy | skladowanie-w-magazynie, czy-potrzebne-uprawnienia-udt, powierzchnia-na-pracownika, praca-na-wysokosci, normy-sanitarne |
| powierzchnia-na-pracownika | umowa-na-zastepstwo, badania-lekarskie-w-pracy, odziez-robocza, praca-na-wysokosci, temperatura-w-pracy | drogi-i-przejscia, temperatura-w-pracy, normy-sanitarne, badania-lekarskie-w-pracy, odziez-robocza |
| kontrola-trzezwosci | badania-lekarskie-w-pracy, co-wolno-na-l4, kontrola-grafiku, monitoring-w-pracy, choroba-zawodowa | kara-porzadkowa, monitoring-w-pracy, odwolanie-do-sadu-pracy, badania-lekarskie-w-pracy, choroba-zawodowa |

W pakiecie przykładem była para odpowiedzialność materialna → „Brutto na netto”. W rejestrze na `f58eeb3` tej pary nie było, a słabe były inne pozycje z tabeli wyżej. Zostały słabe ogony list, bo progu nie podniesiono, żeby żadne narzędzie nie straciło podobnych: zakaz-konkurencji, mobbing → dodatek za pracę w nocy (łączy je płaca minimalna), świadczenie urlopowe → delegacje (łączą je PIT i składki), cudzoziemcy → kara porządkowa. Pominięcie słowa „odszkodowanie” rozdzieliło mobbing i odszkodowanie za zwolnienie (dziś łączy je tylko sąd pracy); to świadomy koszt rozdzielenia zakazu konkurencji i wypadku przy pracy.

Poprawka w cudzym teście: `tests/e2e/narzedzie-odpowiedzialnosc.spec.ts:110` liczył linki do kary porządkowej na całej stronie, a teraz drugi link jest w kolumnie „Podobne”. Licznik obejmuje teraz tylko treść strony (`.tresc`), więc sens testu („jeden link w treści”) się nie zmienił.

## 3. Umowa na zastępstwo: próg stażu w trakcie wypowiedzenia

Linia SN pasuje do tej strony. Art. 36 § 1 Kp dotyczy wprost „umowy o pracę zawartej na czas nieokreślony i umowy o pracę zawartej na czas określony”, a zastępstwo jest umową na czas określony. Zamiast „przepis nie mówi wprost, co wtedy” strona i komentarz w `umowa-zastepstwo.ts` podają teraz, że SN liczy staż do dnia rozwiązania umowy (I PKN 34/99, II PK 12/11). Przy okazji wyszedł przypadek, którego nowe zdanie by nie obejmowało: umowa z datą końca przed dniem progu pokazywała dłuższy okres, choć staż w dniu rozwiązania progu nie osiąga. Ostatni dzień był dobry, ale opis okresu nie. Teraz zostaje krótszy okres. Dodano 6 testów (np. praca od 10.12.2023 r., doręczenie 25.11.2026 r., koniec umowy 5.12, 8.12, 9.12, 15.01, 1.03, bez daty), daty policzone niezależnie w Pythonie. Weryfikator porównał funkcję z niezależnym modelem w 1500 losowych przypadkach i nie znalazł żadnej różnicy.
**SAOS:** API przez całą sesję zwracało stronę „Przerwa techniczna” (ostatnia próba przy zamknięciu raportu: brak odpowiedzi). Sygnatury i fragment („liczony od dnia zawarcia umowy o pracę do daty jej rozwiązania z upływem okresu wypowiedzenia”) wzięte z `raporty/orzecznictwo/RAPORT.md`, gdzie zespół sprawdził je w pełnych tekstach.

## Wynik checku

- `npm run -s check:szybki`: EXIT 0. `BEZ_WEBKIT=1 npm run check` na `7d6eeae`: EXIT 0. Vitest: 2276 testów (139 plików). Playwright: 2368 zielonych, 346 pominiętych (WebKit). Lighthouse i `check:start` zielone. Kontrola SEO: 136 stron, 0 błędów. W `dist/` nie ma żadnego sklejenia słowa z linkiem.
- Zrzuty 412 i 320 px wszystkich 15 zmienionych stron: `scrollWidth − innerWidth = 0` na każdej, przy nowych zdaniach nic nie jest ucięte. Zrzuty są w scratchpadzie sesji (`zrzuty/`, `linki-zrzuty/`), poza repozytorium.
- Czytnik ekranu w podstawowym zakresie: nazwa każdego nowego linku mówi, dokąd prowadzi. Na żadnej stronie ta sama nazwa nie prowadzi do dwóch celów.

## Czego nie sprawdzono

- Własnej kontroli cytatów I PKN 34/99 i II PK 12/11 w SAOS (przerwa techniczna). Do powtórzenia: `GET https://www.saos.org.pl/api/judgments/79015` i `/95376`.
- Czytnika ekranu na prawdziwym urządzeniu (zmiany to zdania z linkami).
- Historia gałęzi ma commit z tymczasowymi skryptami weryfikatora i commit, który je usuwa. Przy scaleniu warto użyć squash.

## Sprawy dla Patryka

1. Nic do decyzji w tym pakiecie. Zdanie o progu stażu w umowie na zastępstwo opiera się na linii SN sprawdzonej przez zespół „orzecznictwo”. Pozycję z `STAN.md` o tym progu można skreślić także dla tej strony.
