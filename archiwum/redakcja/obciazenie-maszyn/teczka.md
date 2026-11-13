# Teczka: obciazenie-maszyn

## 0. Tryb pracy
- 2026-11-11: Patryk: „napisz kolejne 3 teksty. jeszcze lepsza jakość i więcej wykresów, diagramów, schematów, tabel, map i innych wizualnych rzeczy dawaj w artykułach. pamiętaj o tym by zawsze dawać dużo — zapisz to w skillu”. Tematy wybrała redakcja (jak przy poprzednich „wybierz sam”). Polecenia publikacji nie było, więc tryb domyślny: szkic na gałęzi, podgląd, Patryk czyta przed publikacją (SKILL.md, zasada 6). Budżet pracy według SKILL.md; co najmniej 6 elementów wizualnych (styl.md, decyzja z 2026-11-11).

## 1. Brief
- Czytelnik i jego pytanie: planista produkcji, kierownik produkcji albo dyrektor zakładu, który ma wąskie gardło i presję na terminy. „Jak obliczyć obciążenie maszyny i do ilu procent można ją planować, żeby nie rozwalić terminów?”
- Teza: powyżej ok. 85% obciążenia stanowiska ze zmiennością każdy kolejny punkt kosztuje nieproporcjonalnie dużo czasu oczekiwania; dociążenie z 80 do 95% daje kilkanaście procent więcej zleceń i kilkukrotnie dłuższy czas przejścia, więc zanim dołożysz zleceń, zmniejsz zmienność.
- Wkład: (1) jak liczyć obciążenie w minutach, z przezbrojeniami, z przykładem; (2) krzywa kolejki z modelu sprawdzonego symulacją (400 tys. zleceń × 5 powtórzeń), w języku planisty („wielokrotność czasu obróbki”); (3) dane Eurostatu: przetwórstwo w Polsce i UE pracuje średnio na 78,4% mocy (IV kw. 2026), z mapą Europy i szeregiem od 2000 r.; (4) drzewo decyzji „dokładać czy nie”. Polskie wyniki („obciążenie maszyny”, „jak obliczyć obciążenie maszyny”) to definicje i kalkulatory bez kolejek.
- Format: Poradnik, ok. 1 500–1 800 słów. Dział: lean-i-ciagle-doskonalenie. Temat: nowy „przeplyw” (Przepływ i kolejki). Powiązane: smed-przezbrojenia, oee-85-procent.
- Popyt (podpowiedzi Google, 2026-11-11): „obciążenie maszyny”, „jak obliczyć obciążenie maszyny”, „wykorzystanie mocy produkcyjnych”, „prawo little'a”.
- Autor: redakcja. Konflikt interesów: redaktor naczelny prowadzi doradztwo w operacjach; tekst nie odsyła do jego usług.

## 2. Pięć pytań redaktora
1. Teza: sporna (intuicja i wiele systemów premiowych mówią „im wyższe wykorzystanie, tym lepiej”). 2. Nowość: krzywa kolejki w liczbach planisty i reguła decyzji, dane o mocach w Polsce. 3. Dlaczego teraz: przetwórstwo w Polsce i UE pracuje na 78,4% mocy, a pod presją terminów planiści dociążają wąskie gardła. 4. Autorytet: twierdzenie Little'a (Little 2011), wzory Pollaczka–Chinczyna (Larson i Odoni), symulacja redakcji, Eurostat. 5. Co czytelnik zrobi: policzy obciążenie i zmienność wąskiego gardła z ostatnich 4 tygodni i zdecyduje, czy dokładać zleceń.

## 3. Plan tekstu
- Obietnica: czytelnik policzy obciążenie swojego wąskiego gardła i będzie wiedział, kiedy dołożenie zlecenia wydłuży wszystkim terminy.
- Trzy rzeczy do zabrania: (1) czas czekania rośnie jak u/(1−u): przy 80% to 4 czasy obróbki, przy 95% już 19 (przy dużej zmienności); (2) zmienność kosztuje tyle samo co obciążenie: o połowę mniejsze c² to o połowę krótsza kolejka; (3) Little: zapas w toku = przepływ × czas przejścia, więc kolejkę widać na hali.
- Otwarcie: przykład na danych fikcyjnych: frezarka CNC jako wąskie gardło, czas obróbki zlecenia 30 min, planista dokłada zleceń do 95%, „bo maszyna stoi”; handlowiec pyta, czemu terminy się sypią. Rama inna niż w poprzednich tekstach (rozmowa planisty z handlowcem).
- Sztafeta: jak liczyć obciążenie? → co się dzieje z kolejką, gdy rośnie? → ile kosztuje 15 punktów (przykład)? → co z tym robi zmienność? → ile mocy zostawiają inni (Eurostat)? → jak decydować (drzewo, karta)? → gdzie model nie działa → pierwszy krok.
- Elementy wizualne (9): (1) tabela: rachunek obciążenia w minutach (sekcja 2); (2) rys. 1, linia: krzywe kolejki dla trzech poziomów zmienności (sekcja 3); (3) tabela: symulacja a wzór (sekcja 3); (4) rys. 2, słupki: czas przejścia frezarki przy 75–95% (sekcja 4); (5) rys. 3, macierz 2 × 2: obciążenie × zmienność (sekcja 5); (6) rys. 4, kartogram Europy: wykorzystanie mocy w przetwórstwie, IV kw. 2026 (sekcja 6); (7) rys. 5, linia: Polska i UE 2000–2026 (sekcja 6); (8) rys. 6, drzewo decyzji (sekcja 7); (9) tabela: karta „obciążenie i kolejka” do skopiowania (sekcja 7). Generator: `redakcja/wspolne/wykresy.mjs`, skrypt `dane/rysunki.mjs`.
- Zakończenie: wraca do rozmowy planisty z handlowcem; pierwszy krok: obciążenie i zmienność z ostatnich czterech tygodni.
- Test przekazania: „Zanim dołożymy frezarce zleceń do 95%, policzmy, ile urośnie kolejka — tu jest krzywa i reguła.”
- Narzędzie do pobrania: nie (karta w tabeli wystarczy).
- Czytelnik konspektu: (wpis po uruchomieniu).

## 4. Źródła
Kopie: `.cache/redakcja/obciazenie-maszyn/`. Opisy: `zrodla.json`.
| Klucz | Źródło | Rodzaj | Siła | Do czego | Uwagi |
|---|---|---|---|---|---|
| little | Little (2011), Operations Research 59(3) | Badanie recenzowane | B | L = λW: zapas w toku = przepływ × czas | kopia na stronie kursu UMass |
| larson | Larson, Odoni, Urban Operations Research, rozdz. 4.7 | Książka | C | czas oczekiwania zależy od wariancji czasu obsługi (M/G/1, wzory Pollaczka–Chinczyna) | wzory w HTML jako obrazki; cytujemy tekst |
| bartolucci | Bartolucci, Vivo (2026), arXiv:2605.27202 | Inne (preprint) | D | brzmienie przybliżenia G/G/1 (Kingman) i zastrzeżenie „dokładne, gdy ρ → 1” | tylko do zapisu wzoru; wielkości liczy symulacja redakcji |
| nieto | Nieto, Gläßer, Reiner (2010), POMS | Inne (referat) | C | przeciwdowód: w danych zakładu zależność widoczna tylko w części klastrów | studium jednego zakładu |
| eurostat | Eurostat ei_bsin_q_r2, BS-ICU-PC | Dane publiczne | A | wykorzystanie mocy w przetwórstwie, kraje UE, PL 2000–2026 | ankieta: ocena firm, nie pomiar maszyn |
| gus | GUS, prezentacja o badaniu koniunktury (2025) | Raport instytucji | C | wskaźnik ilościowy = średnia ważona odpowiedzi firm | |

## 5. Rejestr twierdzeń
| Twierdzenie | Źródło | Miejsce i fragment |
|---|---|---|
| L = λW: średnia liczba elementów w systemie = średnie tempo napływu × średni czas w systemie | little | s. 537: „Little's Law says that the average number of items in a queuing system, denoted L, equals the average arrival rate of items to the system, λ, multiplied by the average waiting time of an item in the system, W.” |
| to twierdzenie (theorem) teorii kolejek | little | abstrakt: „Basically, it is a theorem in queuing theory.” |
| czas oczekiwania zależy od wariancji czasu obsługi; równiejsza obsługa = lepsze działanie | larson | 4.7: „…depends on the variance of the service times: increasing the consistency of service (i.e., reducing the variance of service times) improves the performance of the service facility.” |
| przybliżenie G/G/1: Wq ≈ ρ/(1−ρ) · (ca² + cs²)/2 · E[S], dokładne asymptotycznie przy ρ → 1 | bartolucci | s. 15–16, równ. (21): „…is approximately … which is exact asymptotically as ρ → 1−. Equation (21) is widely used as a robust operational approximation at moderate utilization” |
| w danych zakładu zależność czasu realizacji od wykorzystania nie dała się wyjaśnić samym prostym modelem kolejki | nieto | abstrakt: „this relationship can not be explain using simple queuing models alone” |
| przy średnich według poziomu wykorzystania brak istotnego trendu; w klastrze wysokiego popytu i zaległości zależność wykładnicza wyraźna | nieto | wyniki: „no significant growing trend could be identified”; „in the case of high demand and high backlog cluster … the exponential relationship is obvious” |
| PL i UE: 78,4% w IV kw. 2026; PL min. 64,0 (2001-Q4), maks. 83,2 (2018-Q1); 30 krajów z danymi | eurostat | `dane/eurostat-ei_bsin_q_r2.json`, aktualizacja 2026-10-29 |
| wskaźnik z ankiety (pytania ilościowe: średnia ważona odpowiedzi) | gus | slajd 8: „Dla pytań ilościowych (np. wykorzystanie mocy produkcyjnych, zagwarantowany okres działania) … – średnia arytmetyczna ważona” |
| krzywe, symulacja i przykład frezarki | redakcja | `dane/model.py` → `wyniki.json` |

## 6. Przeciwdowody i granice
- Nieto i in. (2010): w złożonym zakładzie (45 maszyn, ok. 19 tys. produktów) zależność czasu realizacji od wykorzystania nie jest prosta; wyraźna tylko przy wysokim popycie i zaległościach. Wniosek: model jednego stanowiska to przybliżenie; mierzyć kolejkę u siebie.
- Model zakłada stałą kolejność (kto pierwszy), jedną maszynę, stabilne średnie; przy priorytetach i pracy na kilku maszynach liczby będą inne.
- Wskaźnik Eurostatu to ocena firm w ankiecie, nie pomiar wąskiego gardła.

## 7. Analiza własna i rachunki
- `dane/model.py`: wzór Kingmana i symulacja (rekurencja Lindleya, rozkłady gamma, 400 000 zleceń, 10% rozgrzewki, 5 powtórzeń). Wyniki (czas czekania w wielokrotnościach czasu obróbki, wzór / symulacja): 70%: 2,33 / 2,33 (c = 1), 0,58 / 0,43 (c = 0,5); 80%: 4,00 / 4,00 i 1,00 / 0,84; 85%: 5,67 / 5,66 i 1,42 / 1,25; 90%: 9,00 / 9,04 i 2,25 / 2,09; 95%: 19,0 / 19,19 i 4,75 / 4,61. Przy c = 1 (rozkład wykładniczy) wzór jest dokładny; przy c = 0,5 lekko zawyża, najmniej przy wysokim obciążeniu.
- Przykład na danych fikcyjnych (frezarka, obróbka 30 min, c = 1, 8 h): 75%: 12,0 zlecenia, czas przejścia 120 min; 80%: 12,8, 150 min; 85%: 13,6, 200 min; 90%: 14,4, 300 min; 95%: 15,2, 600 min. Z 80 do 95%: +18,75% zleceń, czas przejścia ×4. Zapas w toku (Little): 4,0 → 19,0 zleceń.
- `dane/rysunki.mjs` → rysunki 1–6 w `src/assets/rysunki/obciazenie-maszyn-*.svg`.
