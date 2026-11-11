## W skrócie

**Problem.** Planista dokłada zlecenia na wąskie gardło, bo maszyna „stoi co piątą godzinę”. Terminy sypią się szybciej, niż rośnie produkcja. W naszym przykładzie dociążenie frezarki z 80 do 95% daje o 19% więcej zleceń i czterokrotnie dłuższy czas przejścia (przykład na danych fikcyjnych).

**Dlaczego.** Przed każdym stanowiskiem, do którego zlecenia przychodzą nierówno i trwają różnie długo, tworzy się kolejka. Czas czekania rośnie jak u / (1 − u), gdzie u to obciążenie, i tym szybciej, im większa zmienność [@bartolucci, @larson]. Zapas w toku rośnie razem z czasem czekania [@little].

**Co zrobić.** Policz obciążenie i zmienność wąskiego gardła z ostatnich czterech tygodni. Gdy obciążenie jest wysokie, każdy kolejny punkt kosztuje coraz więcej czekania [@bartolucci], więc najpierw zmniejsz zmienność: skróć przezbrojenia, wyrównaj napływ zleceń. Dopiero potem dokładaj.

## „Przecież maszyna stoi”

Weźmy rozmowę, która w wielu zakładach odbywa się w czwartek po południu (przykład na danych fikcyjnych). Handlowiec pyta, dlaczego zlecenie obiecane na wtorek wciąż czeka na frezarkę. Planista pokazuje raport: frezarka jest obciążona w 80%, więc zostaje jej jeszcze piąta część czasu. Na przyszły tydzień dołoży 24 zlecenia i dojdzie do 95%. Problem rozwiązany.

Za tydzień zlecenia czekają przed frezarką średnio dziesięć godzin zamiast dwóch i pół. Maszyna rzeczywiście wyprodukowała więcej, ale każdy klient dostał późniejszy termin. Ten mechanizm opisuje teoria kolejek od ponad pół wieku, a da się go policzyć na jednej kartce.

## Obciążenie liczysz w minutach, nie w sztukach

Obciążenie to czas, którego maszyna potrzebuje na zaplanowane zlecenia, podzielony przez czas, którym naprawdę dysponuje. Do czasu zlecenia wlicz przezbrojenie, a z dostępnego czasu odejmij przerwy i planowane przeglądy. Frezarka z przykładu wygląda tak (dane fikcyjne):

| Pozycja | Wartość |
|---|---|
| Dostępny czas w tygodniu: 10 zmian po 480 min | 4 800 min |
| Zlecenia w tygodniu | 128 |
| Czas zlecenia: przezbrojenie 8 min + obróbka 22 min | 30 min |
| Potrzebny czas: 128 × 30 min | 3 840 min |
| **Obciążenie: 3 840 / 4 800** | **80%** |
| Po dołożeniu 24 zleceń: 152 × 30 min = 4 560 min | **95%** |

Te same dane pozwalają policzyć coś, czego raport obciążenia nie pokazuje: ile zlecenie poczeka w kolejce.

## Kolejka rośnie szybciej niż obciążenie

Gdyby zlecenia przychodziły równo jak w zegarku i trwały zawsze tyle samo, maszynę dałoby się obciążyć prawie do pełna bez kolejki [@bartolucci]. W zakładzie tak nie jest. Jedno zlecenie trwa kwadrans, następne trzy kwadranse, a trzy przychodzą naraz po zebraniu planistycznym.

Dla takiego stanowiska stosuje się przybliżenie, które w 1961 r. podał John Kingman [@bartolucci]. Średni czas czekania w kolejce to:

**czekanie ≈ c² × u / (1 − u) × czas zlecenia** [@bartolucci]

Tutaj u to obciążenie, a c² to średnia z kwadratów współczynników zmienności czasu zleceń i odstępów między nimi (współczynnik zmienności to odchylenie standardowe podzielone przez średnią). Przybliżenie jest tym dokładniejsze, im bliżej 100% [@bartolucci]. Podręcznik teorii kolejek podkreśla, że czekanie zależy od rozrzutu czasów obsługi, a nie tylko od ich średniej [@larson].

Wzór [@bartolucci] sprawdziliśmy symulacją 400 tysięcy zleceń, powtórzoną pięć razy dla każdego wariantu (obliczenia redakcji). Czas czekania w tabeli podajemy w wielokrotnościach czasu zlecenia:

| Obciążenie | c = 1: wzór | c = 1: symulacja | c = 0,5: wzór | c = 0,5: symulacja |
|---|---|---|---|---|
| 70% | 2,33 | 2,33 | 0,58 | 0,43 |
| 80% | 4,00 | 4,00 | 1,00 | 0,84 |
| 85% | 5,67 | 5,66 | 1,42 | 1,25 |
| 90% | 9,00 | 9,04 | 2,25 | 2,09 |
| 95% | 19,0 | 19,2 | 4,75 | 4,61 |

Przy dużej zmienności (c = 1) wzór trafia co do setnych. Przy mniejszej lekko zawyża czekanie, ale kształt krzywej jest ten sam.

![Wykres liniowy: czas czekania w kolejce w wielokrotnościach czasu obróbki zlecenia w zależności od obciążenia stanowiska od 30 do 97 procent, dla trzech poziomów zmienności. Przy wysokiej zmienności czekanie wynosi 4 czasy obróbki przy 80 procentach i 19 przy 95 procentach; przy średniej i niskiej krzywe rosną wolniej, ale też gwałtownie powyżej 90 procent.](../../assets/rysunki/obciazenie-maszyn-1.svg "Rysunek 1. Od 85% obciążenia każdy kolejny punkt kosztuje coraz więcej czekania, a im większa zmienność, tym wcześniej zaczyna się ten wzrost. Źródło: obliczenia redakcji, przybliżenie Kingmana sprawdzone symulacją.")

## Zmienność zmierzysz z danych, które już masz

Współczynnik zmienności liczysz dwa razy. Raz dla czasów zleceń na maszynie, raz dla odstępów między chwilami, w których kolejne zlecenia trafiają do kolejki. Oba są w systemie: w meldunkach z MES albo w ERP, a w najgorszym razie w zeszycie operatora.

Weźmy pięć ostatnich zleceń frezarki: 20, 45, 30, 25 i 40 minut (przykład na danych fikcyjnych). Średnia to 32 minuty, odchylenie standardowe około 9 minut, więc współczynnik zmienności wynosi 0,29, a jego kwadrat 0,08. Odstępy między zleceniami w tym samym przykładzie: 5, 40, 10, 60 i 35 minut. Tu współczynnik wynosi 0,67, a kwadrat 0,46. Średnia z obu kwadratów to c² = 0,27. Taka frezarka jest bliżej dolnej krzywej z rysunku 1 niż górnej.

Pięć zleceń to za mało na decyzję, ale wystarczy, żeby zobaczyć, skąd bierze się zmienność. W przykładzie dokłada ją nierówny napływ zleceń, a nie sama obróbka. Do decyzji weź dane z czterech tygodni.

## Ostatnie 15 punktów kosztuje najwięcej

Frezarka z przykładu przy 80% obciążenia robi 12,8 zlecenia na zmianę, a zlecenie spędza przed nią i na niej średnio 2,5 godziny. Przy 95% robi 15,2 zlecenia, ale czas przejścia rośnie do 10 godzin (dane fikcyjne, c = 1).

![Wykres słupkowy: czas przejścia zlecenia przez frezarkę przy obciążeniu 75, 80, 85, 90 i 95 procent wynosi kolejno 2,0, 2,5, 3,3, 5,0 i 10,0 godzin, przy produkcji 12,0, 12,8, 13,6, 14,4 i 15,2 zlecenia na zmianę.](../../assets/rysunki/obciazenie-maszyn-2.svg "Rysunek 2. Z 80 do 95% obciążenia frezarka robi o 19% więcej zleceń, a każde zlecenie czeka cztery razy dłużej. Źródło: obliczenia redakcji, przykład na danych fikcyjnych.")

Kolejkę widać też na posadzce. Twierdzenie Little'a mówi, że średnia liczba elementów w systemie równa się tempu ich napływu pomnożonemu przez średni czas w systemie [@little]. To twierdzenie teorii kolejek, a nie reguła z doświadczenia [@little]. Dla frezarki znaczy to, że przy 80% przed maszyną i na niej jest średnio 4 zlecenia, a przy 95% już 19 (obliczenia redakcji). Wózki z detalami zajmują przejście, a planista szuka w stosie zlecenia, które obiecał na wtorek.

Czy to się opłaca, zależy od zakładu. Dodatkowe 2,4 zlecenia na zmianę są warte pieniądze, jeśli klienci kupią je bez względu na termin. Jeśli jednak sprzedajesz krótki czas dostawy, dociążenie wąskiego gardła zjada właśnie to, za co płaci klient.

## Mierz kolejkę, a nie tylko obciążenie

Raport obciążenia mówi, ile maszyna pracuje. Nie mówi, ile czekają klienci. Dlatego obok obciążenia zapisuj codziennie dwie liczby: ile zleceń stoi przed wąskim gardłem i na nim o stałej porze, na przykład na początku pierwszej zmiany, i ile zleceń maszyna kończy w ciągu dnia. Ich iloraz to średni czas przejścia [@little].

Sprawdźmy to na frezarce przy 95% obciążenia (przykład na danych fikcyjnych). W systemie jest średnio 19 zleceń, a maszyna kończy 30,4 zlecenia w ciągu dnia z dwiema zmianami. Czas przejścia to 19 / 30,4 = 0,625 takiego dnia, czyli 10 godzin pracy. Dokładnie tyle pokazuje rysunek 2.

Ten sam rachunek łapie błędy w danych. Jeden z praktyków, których cytuje Little, mówi, że często dostaje arkusze z danymi, które się nie sumują, a twierdzenie Little’a pozwala to sprawdzić [@little]. Jeśli kolejka rośnie z tygodnia na tydzień przy tym samym obciążeniu, rośnie zmienność. Szukaj wtedy przyczyny w przezbrojeniach i w tym, jak zlecenia trafiają na halę.

## Zmienność kosztuje tyle samo co obciążenie

We wzorze zmienność i obciążenie są mnożone przez siebie [@bartolucci]. O połowę mniejsze c² daje o połowę krótszą kolejkę przy tym samym obciążeniu. Dlatego przy dużej zmienności frezarka z 95% obciążenia czeka 19 czasów zlecenia, a przy c² = 0,25 niecałe 5 (obliczenia redakcji).

Zmienność ma w zakładzie konkretne źródła. Długie i nieregularne przezbrojenia, awarie, partie wypuszczane raz dziennie po zebraniu, zlecenia pilne wciskane w środek kolejki. Każde z nich podnosi c² i przesuwa krzywą w lewo. [Tekst o przezbrojeniach](/smed-przezbrojenia) pokazuje, od której maszyny warto zacząć ich skracanie.

![Macierz dwa na dwa: oś pozioma obciążenie od poniżej 80 do powyżej 85 procent, oś pionowa zmienność od niskiej do wysokiej. Niska zmienność i niskie obciążenie: zapas mocy, można dokładać zlecenia. Wysoka zmienność i niskie obciążenie: kolejki z chaosu, wyrównaj napływ. Niska zmienność i wysokie obciążenie: pełno, ale płynnie, pilnuj zmienności. Wysoka zmienność i wysokie obciążenie: strefa kolejek, najpierw zmniejsz zmienność.](../../assets/rysunki/obciazenie-maszyn-3.svg "Rysunek 3. Najdroższa jest prawa górna ćwiartka: wysokie obciążenie przy dużej zmienności. Źródło: opracowanie redakcji na podstawie modelu kolejki.")

## Zakłady w Polsce pracują średnio na 78% mocy

Przetwórstwo przemysłowe w Polsce pracowało w IV kwartale 2026 r. średnio na 78,4% mocy, dokładnie tyle, ile wynosiła średnia Unii Europejskiej [@eurostat]. To odpowiedzi firm w ankiecie koniunktury, liczone jako średnia ważona, a nie pomiar maszyn [@gus]. Pokazują jednak, że zakład jako całość prawie nigdy nie pracuje blisko pełnej mocy.

![Mapa Europy: wykorzystanie mocy produkcyjnych w przetwórstwie przemysłowym w IV kwartale 2026 roku. Polska 78,4 procent, Niemcy 78,7, Francja 82,1, Hiszpania 79,8, Włochy 75,3, Szwecja 84,8; średnia Unii 78,4 procent. Najniższe wartości w Unii na Cyprze, w Rumunii i w Danii, najwyższe w Austrii, Szwecji i Słowenii.](../../assets/rysunki/obciazenie-maszyn-4.svg "Rysunek 4. Przetwórstwo w Polsce wykorzystuje moce tak samo jak średnio w Unii, a żaden kraj nie przekracza 85%. Źródło: Eurostat, ei_bsin_q_r2, dane wyrównane sezonowo, aktualizacja 29 października 2026.")

Od 2000 r. polskie zakłady deklarowały najwyżej 83,2% (początek 2018 r.), a najniżej 64,0% (koniec 2001 r.) [@eurostat]. Średnia 78% dla całego zakładu nie wyklucza więc maszyn pracujących na 95%: średnia ukrywa wąskie gardło.

![Wykres liniowy: wykorzystanie mocy produkcyjnych w przetwórstwie w Polsce i w Unii Europejskiej od 2000 do 2026 roku. Polska rośnie z około 64 procent w 2001 roku do 83 procent w 2018 roku, z załamaniami w 2009 i 2020 roku; w 2026 roku 78,4 procent, tyle co Unia. Linia przerywana na 85 procentach pozostaje powyżej obu szeregów przez cały okres.](../../assets/rysunki/obciazenie-maszyn-5.svg "Rysunek 5. Przez 27 lat ani Polska, ani Unia nie przekroczyły średnio 85% wykorzystania mocy. Źródło: Eurostat, ei_bsin_q_r2, dane wyrównane sezonowo.")

## Decyzję o dokładaniu zleceń podejmij w trzech pytaniach

Z modelu wynika prosta reguła dla planisty (reguła redakcji, nie norma). Zadaj trzy pytania, zanim dołożysz zlecenie na wąskie gardło.

![Drzewo decyzji: czy dołożyć zlecenia na wąskie gardło. Pierwsze pytanie: czy po dołożeniu obciążenie zostaje poniżej 80 procent; jeśli tak, dokładaj. Drugie: czy czasy obróbki i odstępy między zleceniami są równe, współczynnik zmienności poniżej 0,5; jeśli tak, można dojść do 90 procent i mierzyć kolejkę co tydzień. Trzecie: czy da się w tym miesiącu skrócić przezbrojenia albo wyrównać napływ zleceń; jeśli tak, najpierw zmniejsz zmienność. W przeciwnym razie nie dokładaj: podaj dłuższy termin albo przenieś zlecenie na inną maszynę.](../../assets/rysunki/obciazenie-maszyn-6.svg "Rysunek 6. Zanim dołożysz zleceń powyżej 80%, sprawdź zmienność. Źródło: reguła redakcji na podstawie modelu kolejki.")

Do tej decyzji wystarczy karta z siedmioma liczbami. Wypełnij ją dla wąskiego gardła z danych z ostatnich czterech tygodni (w kolumnie przykład na danych fikcyjnych):

| Krok | Jak policzyć | Frezarka z przykładu |
|---|---|---|
| Dostępny czas w tygodniu | czas zmian minus przerwy i planowane przeglądy | 4 800 min |
| Zlecenia w tygodniu | z planu albo z rejestru | 128 |
| Średni czas zlecenia | przezbrojenie + obróbka | 30 min |
| Obciążenie u | zlecenia × czas zlecenia / dostępny czas | 80% |
| Zmienność c² | średnia z (odchylenie / średnia)² czasów zleceń i odstępów między nimi | 1,0 |
| Czekanie w kolejce | c² × u / (1 − u) × czas zlecenia | 120 min |
| Zapas w toku | zlecenia na minutę × (czekanie + czas zlecenia) | 4 zlecenia |

Jeśli czekanie z karty różni się wyraźnie od tego, co widzisz w systemie, nie wyrzucaj karty. Sprawdź, czy zlecenia nie czekają na co innego: materiał, narzędzie, operatora.

## Gdy obciążenia nie da się obniżyć

Czasem zleceń nie da się przenieść ani odłożyć. Wtedy zostają dwie drogi: więcej mocy albo mniej zmienności. Więcej mocy to nadgodziny, druga zmiana albo przeniesienie części operacji na inną maszynę. Każda z tych decyzji obniża u w mianowniku wzoru, więc działa mocno właśnie przy wysokim obciążeniu [@bartolucci].

Mniej zmienności to przede wszystkim krótsze i równiejsze przezbrojenia oraz wypuszczanie zleceń na halę równo w ciągu dnia, a nie paczką po zebraniu. W szpitalach liczy się to podobnie. Jeden z praktyków cytowanych przez Johna Little’a wyznacza liczbę łóżek z twierdzenia Little’a, dzieląc potrzebną liczbę przez docelowe obłożenie, na przykład 90% [@little]. Zapas mocy jest tam założeniem planu, a nie marnotrawstwem.

## Model upraszcza, kolejka jest prawdziwa

Wzór opisuje jedno stanowisko, zlecenia obsługiwane po kolei i stabilne średnie. W prawdziwym zakładzie są priorytety, kilka maszyn i zmiany w popycie. Badanie zakładu przetwórstwa polimerów z 45 maszynami wykazało, że zależności czasu realizacji od wykorzystania nie da się wyjaśnić samym prostym modelem kolejki [@nieto]. Po uśrednieniu według poziomu wykorzystania nie było wyraźnego trendu, ale w okresach wysokiego popytu i dużych zaległości wzrost był wyraźny [@nieto].

Wniosek nie brzmi więc „nigdy nie dociążaj wąskiego gardła”. Brzmi: przy wysokim obciążeniu mierz kolejkę i zmienność, bo właśnie tam ryzyko jest największe. Model mówi, gdzie szukać, a pomiar u siebie mówi, ile to kosztuje.

## Czwartkowa rozmowa wygląda inaczej

Gdy planista z przykładu ma kartę, czwartkowa rozmowa z handlowcem zmienia treść. Zamiast „maszyna stoi, dołożę” pada pytanie: czy klient woli dostać zlecenie za dwa dni, czy jutro, kosztem innych? A jeśli przezbrojenia skrócą się o połowę, frezarka zmieści więcej zleceń bez wydłużania kolejki.

Zacznij od liczb z ostatnich czterech tygodni. Policz obciążenie i zmienność wąskiego gardła, wpisz je do karty i porównaj czekanie z tym, co pokazuje system. Jeśli karta pokaże kolejkę dłuższą niż kilka czasów zlecenia, pierwszym projektem nie jest nowe zlecenie, tylko krótsze przezbrojenie.
