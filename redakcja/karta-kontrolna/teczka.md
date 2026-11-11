# Teczka: karta-kontrolna

## 0. Tryb pracy
- 2026-11-11: Patryk: „napisz kolejne 3 teksty. jeszcze lepsza jakość i więcej wykresów, diagramów, schematów, tabel, map…”. Temat wybrała redakcja. Polecenia publikacji nie było: szkic na gałęzi, podgląd, Patryk czyta przed publikacją. Co najmniej 6 elementów wizualnych (decyzja z 2026-11-11).

## 1. Brief
- Czytelnik i jego pytanie: kierownik jakości, technolog, kierownik produkcji albo lider zmiany w obróbce, wtrysku, pakowaniu. „Kiedy operator ma korygować maszynę po pomiarze, a kiedy zostawić ją w spokoju? Jak zrobić kartę kontrolną bez programu SPC?”
- Teza: korygowanie stabilnego procesu po każdym pomiarze o zmierzoną odchyłkę zwiększa rozrzut (wariancja ×2, braki przy tolerancji ±3σ z 0,27% do ok. 3,4%); karta kontrolna mówi, kiedy reagować, ale każda reguła sygnału ma cenę w fałszywych alarmach, a przy znanym dryfie korekta według planu jest uzasadniona.
- Wkład: (1) lejek Deminga przeliczony na braki w procentach dla konkretnej tolerancji; (2) symulacja reguł 1–4 i ARL dla przesunięć 0–3σ (cena reguł Western Electric w fałszywych alarmach); (3) drzewo decyzji dla operatora i karta reakcji do skopiowania; (4) wdrożenie karty wartości indywidualnych na jednym wymiarze z kalkulacją granic. Polskie wyniki („karta kontrolna spc”, „karta kontrolna excel”) to definicje i szablony bez kosztu korekt i bez ceny reguł.
- Format: Poradnik, ok. 1 500–1 800 słów. Dział: dane-i-ai. Temat: nowy „spc” (SPC i karty kontrolne). Powiązane: oee-85-procent, obciazenie-maszyn.
- Popyt (podpowiedzi Google, 2026-11-11): „karta kontrolna spc”, „karta kontrolna excel”, „karta kontrolna wzór”, „statystyczne sterowanie procesem”.
- Autor: redakcja. Konflikt interesów: redaktor naczelny prowadzi doradztwo w operacjach; tekst nie odsyła do jego usług.

## 2. Pięć pytań redaktora
1. Teza: sporna (odruch „poprawiam, bo widzę odchyłkę” jest powszechny i bywa nagradzany). 2. Nowość: braki w procentach i cena reguł w liczbach. 3. Dlaczego teraz: pomiary w linii i automatyczne korektory ułatwiają korygowanie po każdej sztuce. 4. Autorytet: NIST, Deming przez Minitab, badanie van Gestela i in., symulacje redakcji. 5. Co czytelnik zrobi: wybierze jeden wymiar, zbierze 20–25 pomiarów bez korekt, policzy granice, wywiesi kartę z regułami reakcji.

## 3. Plan tekstu
- Obietnica: czytelnik będzie wiedział, kiedy przestawiać maszynę, a kiedy nie, i zrobi kartę kontrolną na jednym wymiarze w tym tygodniu.
- Trzy rzeczy do zabrania: (1) korekta o ostatnią odchyłkę podwaja wariancję stabilnego procesu; (2) karta oddziela zmienność wspólną od sygnału, a każda dodatkowa reguła przyspiesza wykrycie i mnoży fałszywe alarmy (371 → ok. 92 punkty); (3) przy znanym dryfie koryguj według planu, nie po każdym pomiarze.
- Otwarcie: przykład na danych fikcyjnych: operator tokarki mierzy średnicę wałka po każdej sztuce i przestawia korektor o odchyłkę; braki rosną, choć „wszyscy pilnują wymiaru”. Rama inna niż w tekście o obciążeniu (tam rozmowa, tu warsztat i paradoks).
- Sztafeta: co się dzieje, gdy korygujesz po każdej sztuce? → ile to kosztuje w brakach? → skąd wiedzieć, kiedy reagować (karta)? → ile reguł (cena)? → kiedy jednak korygować (dryf)? → jak wdrożyć → granice → pierwszy krok.
- Elementy wizualne (8): (1) tabela: cztery reguły lejka; (2) rys. 1, małe wielokrotności: 100 sztuk przy każdej regule; (3) rys. 2, słupki: odchylenie po 50 i 200 sztukach; (4) tabela: braki przy tolerancji ±3σ (reguła 1 i 2); (5) rys. 3, karta wartości indywidualnych z przesunięciem; (6) rys. 4, mapa cieplna ARL: przesunięcie × zestaw reguł; (7) rys. 5, drzewo decyzji dla operatora; (8) rys. 6, schemat wdrożenia w pięciu krokach; (9) tabela: karta reakcji do skopiowania. Generator: `redakcja/wspolne/wykresy.mjs` (panele, słupki, linia, mapa cieplna, drzewo) i `schemat.mjs`.
- Zakończenie: wraca do tokarki; pierwszy krok: 20–25 pomiarów bez korekt.
- Test przekazania: „Przestańmy korygować po każdej sztuce — tu jest, ile nas to kosztuje i jak zrobić kartę na jutro.”
- Narzędzie do pobrania: nie (karta reakcji i wzór granic w tekście).
- Czytelnik konspektu: (wpis po uruchomieniu).

## 4. Źródła
Kopie: `.cache/redakcja/karta-kontrolna/`. Opisy: `zrodla.json`.
| Klucz | Źródło | Rodzaj | Siła | Do czego | Uwagi |
|---|---|---|---|---|---|
| minitab | Minitab, demonstracja eksperymentu z lejkiem (za Demingiem 1986, s. 327–332) | Raport firmy | C | brzmienie reguł 1–4, wariancja σ² i 2σ², niestabilność reguł 3–4, wniosek „zostaw stabilny proces” | materiał dydaktyczny; wynik matematyczny potwierdza symulacja redakcji |
| nist | NIST/SEMATECH e-Handbook, rozdz. 6.3 | Raport instytucji | B | ARL ≈ 371, reguły WECO, fałszywy alarm co 91,75 punktu, granice karty wartości indywidualnych (MR̄/1,128) | |
| vangestel | Van Gestel, Pons, Pulakanam (2015), J. Ind. Eng. Int. | Badanie recenzowane | B (studium przypadku) | przeciwdowód: korekta procesu z trendem bywa korzystna; „tampering” nie zawsze zły | zakład przetwórstwa odpadów mięsnych |

## 5. Rejestr twierdzeń
| Twierdzenie | Źródło | Miejsce i fragment |
|---|---|---|
| reguła 1: lejek nieruchomo nad celem | minitab | „The funnel remains fixed, aimed at the target.” |
| reguła 2: przesuń o odchyłkę w przeciwną stronę od poprzedniej pozycji | minitab | „Move the funnel from its previous position a distance equal the current error (location of drop), in the opposite direction.” |
| reguła 3: naprzeciw ostatniego wyniku względem celu; reguła 4: na ostatni wynik | minitab | „Move the funnel to a position that is exactly opposite the point where the last marble dropped, relative to the target.”; „Move the funnel to the position where the last marble dropped.” |
| reguły 1 i 2 stabilne z wariancją σ² i 2σ², 3 i 4 niestabilne | minitab | „both strategies (1) and (2) are stable with variance sigma2 and 2 sigma2, respectively. Strategies (3) and (4) are unstable and will eventually wander off to infinity.” |
| stabilny proces zostaw; poprawa wymaga zmiany samego układu | minitab | „a stable common-cause process … should be left alone for best results; adjustments (strategies 2 - 4) will only result in worse performance. To improve performance, the funnel apparatus (common-cause system) itself must be changed.” |
| ARL ≈ 371 przy granicach 3σ | nist | pmc311: „For a normal distribution, p = 0.0027 and the ARL is approximately 371.” |
| reguły WECO (punkt poza 3σ; 2 z 3 poza 2σ; 4 z 5 poza 1σ; 8 po jednej stronie) | nist | pmc32: „Any Point Above +3 Sigma”, „2 Out of the Last 3 Points Above +2 Sigma”, „4 Out of the Last 5 Points Above +1 Sigma”, „8 Consecutive Points on This Side of Control Line” |
| z regułami WECO fałszywy alarm średnio co 91,75 punktu | nist | pmc32: „Adding the WECO rules increases the frequency of false alarms to about once in every 91.75 points, on the average” |
| granice karty wartości indywidualnych: średnia ± 3·MR̄/1,128 | nist | pmc322: „UCL = x̄ + 3 MR̄/1.128 … (Note that 1.128 is the value of d2 for n = 2.)” |
| korekta w granicach to „tampering”; oczekuje się strat w stabilnym procesie | vangestel | „The action of adjusting a process while it is still within control limits is considered tampering. It is expected that losses will be incurred if a stable system is tampered with.” |
| okresowa korekta procesu z trendem jest korzystna | vangestel | „It has been shown that periodic adjustment of a trending process is beneficial (Xie et al. 2002).” |
| „tampering” nie zawsze zły; spór o to, kiedy ocena operatora jest właściwa | vangestel | „We conclude that tampering cannot be considered to be universally bad … how to differentiate those situations where operator judgement is appropriate from those where it is not.” |
| symulacje i przykład tokarki | redakcja | `dane/model.py` → `wyniki.json`; `dane/przyklad.py` → `przyklad.json` |

## 6. Przeciwdowody i granice
- Van Gestel i in.: w zakładzie z trendami w procesie operatorzy z doświadczeniem poprawiali jakość korektami; nowicjusze, nastawieni na wydajność, czasem ją psuli. Wniosek: odróżniać proces stabilny od dryfującego.
- Karta zakłada niezależne pomiary i rozkład zbliżony do normalnego; przy autokorelacji (np. temperatura) granice z ruchomego rozstępu bywają za wąskie.
- Lejek to model najprostszy (szum bez dryfu); rzeczywisty proces może mieć oba.

## 7. Analiza własna i rachunki
- `dane/model.py`: lejek jednowymiarowy, σ = 1, 2 000 powtórzeń: odchylenie po 50 / 200 sztukach: reguła 1: 0,98 / 1,00; reguła 2: 1,40 / 1,41; reguła 3: 4,41 / 8,82; reguła 4: 2,69 / 5,37. ARL (symulacja, 20 000 serii; 4 000 dla procesu bez zmian): tylko 3σ: 372 / 156 / 43,3 / 14,9 / 6,3 / 2,0 dla przesunięć 0 / 0,5 / 1 / 1,5 / 2 / 3σ (teoria: 370,4 / 155,2 / 43,9 / 15,0 / 6,3 / 2,0); reguły WE: 92,5 / 27,4 / 9,2 / 5,0 / 3,3 / 1,8.
- `dane/przyklad.py` (dane fikcyjne): tokarka, wałek 20,00 mm, σ = 0,010 mm, tolerancja ±0,030 mm: braki przy regule 1: 0,27%, przy regule 2 (σ·√2): 3,39%. Karta: 20 sztuk bez zmian, od 21. przesunięcie o 1,5σ; z pierwszych 20: średnia 19,9987, MR̄ 0,0124, granice 20,0317 i 19,9658; pierwszy sygnał przy sztuce 25 (punkt powyżej górnej granicy).
- `dane/rysunki.mjs` → rysunki 1–6 w `src/assets/rysunki/karta-kontrolna-*.svg`.
