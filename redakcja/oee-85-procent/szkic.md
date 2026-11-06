## W skrócie

**Problem.** Wynik OEE porównuje się z liczbą 85%, nazywaną „światową klasą” [@vorne-wc], albo z wynikiem innego zakładu, jakby jedno i drugie było wzorcem.

**Dlaczego.** W literaturze TPM 85% to cel, do którego zakład może dojść dzięki usprawnieniom, a nie zmierzona średnia [@jipm]. Wynik zależy przy tym od tego, co uznasz za czas planowany i jaki cykl przyjmiesz za idealny [@andersson].

**Co zrobić.** Spisz kartę definicji OEE, porównuj maszynę z nią samą i mów o stratach w minutach, a nie w procentach.

## Jedna zmiana, trzy poprawne wyniki

Weźmy jedną ośmiogodzinną zmianę na jednej maszynie (to przykład, liczby są fikcyjne). Maszyna zrobiła 520 sztuk, z czego 505 dobrych. Pół godziny trwała przerwa, drugie pół godziny planowana konserwacja, 50 minut zajęły dwa przezbrojenia, a 20 minut awaria. Producent podaje, że maszyna robi sztukę w 30 sekund. W planie produkcji przyjęto 40 sekund.

Trzy osoby liczą OEE tej zmiany. Pierwsza traktuje przezbrojenia i konserwację jako stratę i bierze cykl producenta: wychodzi 56%. Druga wyłącza przezbrojenia i konserwację z czasu planowanego, bo przecież były w planie, i dostaje 68%. Trzecia robi to samo, ale bierze cykl z planu produkcji. Ma 91%, czyli więcej niż „światowa klasa”. Każda policzyła poprawnie (dane fikcyjne, rysunek 1).

![Wykres słupkowy: OEE tej samej zmiany w trzech arkuszach. Arkusz 1: przezbrojenia i konserwacja to strata, cykl producenta 30 s, wynik 56%. Arkusz 2: przezbrojenia i konserwacja poza planem, cykl producenta 30 s, wynik 68%. Arkusz 3: przezbrojenia i konserwacja poza planem, cykl z planu produkcji 40 s, wynik 91%. Przerywana linia oznacza 85%.](../../assets/rysunki/oee-85-procent-1.svg "Rysunek 1. Ta sama zmiana ma OEE od 56 do 91% zależnie od dwóch decyzji w definicji. Dane fikcyjne, rachunek redakcji.")

To nie sztuczka. OEE da się zapisać jako jeden ułamek: dobre sztuki razy cykl idealny, podzielone przez czas, w którym maszyna miała pracować. Licznik i mianownik zależą od decyzji, a nie tylko od tego, co działo się na hali. Dopóki nie wiesz, jak policzono wynik, porównanie z liczbą z poradnika albo z innym zakładem mówi niewiele. Pokażemy, skąd się wzięło 85%, ile wynosi OEE w zakładach, które zbadano, i jak spisać definicję, dzięki której wynik przestanie zależeć od tego, kto liczy.

## OEE to jeden iloraz, a nie trzy procenty

Zwykle OEE liczy się jako iloczyn trzech składowych: dostępności, wydajności i jakości. Dostępność mówi, jaką część czasu planowanego maszyna pracowała. Wydajność mówi, ile sztuk zrobiła w porównaniu z tym, ile zrobiłaby w cyklu idealnym. Jakość to udział dobrych sztuk.

W naszym przykładzie (dane fikcyjne) maszyna pracowała 350 minut. U pierwszej osoby czas planowany wynosi 450 minut, więc dostępność to 77,8%, wydajność 74,3%, a jakość 97,1%. Iloczyn daje 56,1%, dokładnie tyle samo, co 505 dobrych sztuk razy 30 sekund, podzielone przez 450 minut. Druga osoba skróciła mianownik do 370 minut, więc wzrosła tylko dostępność. Trzecia wydłużyła cykl idealny do 40 sekund i wydajność skoczyła do 99%.

Z tego rachunku płyną dwa wnioski. Każda składowa jest ułamkiem, w którym coś przyjęto: czas planowany w dostępności, cykl idealny w wydajności, definicję dobrej sztuki w jakości. A ponieważ składowe się mnoży, nawet wysokie wyniki cząstkowe dają skromną całość: trzy razy po 90% to 73% OEE (przykład liczbowy).

## 85% to cel dla najlepszych zakładów, nie średnia

Liczba pochodzi z japońskiego ruchu TPM (Total Productive Maintenance, kompleksowe utrzymanie ruchu). Najstarsze źródło, do którego dotarliśmy, to książka o wdrażaniu TPM pod redakcją Seiichiego Nakajimy, wydana po angielsku w 1989 r. Kunio Shirose pisze w niej, że w firmach badanych przez japoński instytut utrzymania ruchu JIPM efektywność urządzeń wynosiła średnio od 40 do 60%. Działania TPM mogą ją według niego podnieść nawet do 85–95% [@jipm].

Składowe tej liczby przypisuje się samemu Nakajimie. Jonsson i Lesshammar przytaczają za wcześniejszym opracowaniem, że według niego w idealnych warunkach dostępność powinna przekraczać 90%, wydajność 95%, a jakość 99%. Iloczyn daje około 85%, a Nakajima miał uważać taki wynik za dobry punkt odniesienia [@jonsson].

Vorne, producent systemów do pomiaru OEE, podaje, że Nakajima określił te wartości w książce z 1984 r. na podstawie własnego doświadczenia jako minimum, do którego firmy powinny dążyć. Zauważył też, że wszystkie zakłady nagrodzone w Japonii za udane wdrożenie TPM miały OEE powyżej 85% [@vorne-wc]. Ta sama strona zastrzega, że liczby dotyczą produkcji dyskretnej, a nie procesowej, i mają korzenie w Japonii lat 70. i w przemyśle motoryzacyjnym. W odpowiedziach na pytania czytelników Vorne nazywa 85% wygodnym, przekonującym i zupełnie sztucznym punktem odniesienia [@vorne-faq].

Zatem 85% to poprzeczka postawiona przez ludzi, którzy w badanych firmach mierzyli od 40 do 60% [@jipm]. Traktowanie jej jak normy, poniżej której zakład „odstaje”, odwraca jej sens.

## W zbadanych zakładach OEE wynosi zwykle od 50 do 70%

Badań, które mierzą OEE w wielu zakładach według opisanej metody, jest mało, a najlepsze, jakie znaleźliśmy, pochodzą ze Szwecji. Hedman, Subramaniyan i Almström zebrali automatyczne pomiary z 884 maszyn w 23 szwedzkich firmach, klientach jednego dostawcy systemu pomiarowego, od października 2013 do marca 2014 r. Średnie OEE wyniosło 65%, a mediana 70% [@hedman]. Ylipää i współpracownicy zebrali dane OEE z 98 szwedzkich firm z lat 2006–2012 [@ylipaa]. Średnia z tych danych, podana w pracy tego samego zespołu, wynosi 51,5% [@bokrantz]. Ljungberg, który przeanalizował około 20 przypadków, podał OEE w okolicach 55% [@ljungberg].

Nawet te liczby mogą być zawyżone. Hedman i współautorzy zauważają, że w 702 z 884 maszyn wydajność, a w 796 jakość miały wpisane 100%, czyli w większości wartość domyślną systemu. Z czasu planowanego wyłączono przy tym między innymi weekendy, planowaną konserwację, przerwy i spotkania, a więc przyjęto definicję korzystną dla wyniku [@hedman]. Mimo to średnia nie doszła do 70%.

W Polsce nie znaleźliśmy badania wielu zakładów z opisaną metodą, tylko studia pojedynczych maszyn. W jednym z nich, opisanym przez autorów z AGH, dzienne OEE jednej maszyny wahało się w ciągu tygodnia od 46 do 83%, średnio 68% [@agh]. Na tej podstawie nie da się mówić o polskiej średniej. Vorne pisze z kolei, że większość firm ma OEE bliżej 60%, ale opiera to na doświadczeniu ze współpracy z klientami i nie podaje danych ani metody [@vorne-wc].

## Wynik zależy od definicji tak samo jak od maszyny

Pierwsza decyzja dotyczy czasu planowanego: czy przezbrojenie, planowana konserwacja i przerwa obniżają wynik. W TPM przezbrojenie i regulacja to jedna z sześciu dużych strat [@jipm]. Firmy liczą to jednak różnie.

Bokrantz i współautorzy pytali o zakłócenia produkcji w dwóch ankietach: w 80 szwedzkich firmach w 2001 r. i w 71 w 2014 r. Wymianę narzędzi i przezbrojenie rejestrowała jako zakłócenie mniej niż połowa respondentów, a przerwy mniej niż co czwarty. Autorzy zwracają uwagę, że wymiana narzędzi i przezbrojenie są w niemal każdej definicji OEE od jej początków [@bokrantz]. Andersson i Bellgran piszą wprost, że wzór OEE jest w zasadzie jeden, ale jego składniki interpretuje się różnie. Chodzi właśnie o to, co jest czasem planowanym, a co nieplanowanym, i jaki cykl uznać za idealny [@andersson].

Druga decyzja to cykl idealny. Do wyboru jest nominalny cykl maszyny, najlepszy zmierzony albo czas z normy planowania. Im wolniejszy cykl przyjmiesz, tym wyższa wydajność i całe OEE. Wynik zniekształca też jeden cykl dla wszystkich wyrobów. W studium z AGH zakład nie miał cyklu normatywnego dla każdego wyrobu i przyjmował jeden, a autorzy piszą, że to uproszczenie znacząco zaniża wynik [@agh].

Zdarza się nawet, że OEE spada, choć linia robi więcej. Andersson i Bellgran opisali półautomatyczną linię montażową, na której usprawnienie skróciło cykl idealny z 26 do 22 sekund. Dotychczasowe przestoje zostały, więc OEE spadło z 86 do 79%, a linia zaczęła robić 130 zamiast 118 sztuk na godzinę [@andersson]. Kto patrzy tylko na OEE, uzna dobrą zmianę za pogorszenie.

Nawet norma nie rozstrzyga sporu. ISO 22400-2 z 2014 r. opisuje wskaźniki zarządzania operacjami produkcyjnymi, ale według analizy Schiraldiego i Varisco podaje dwie definicje OEE, niespójne ze sobą i z ujęciem Nakajimy [@schiraldi]. Sama norma czeka na nowe wydanie [@iso].

Badacze widzieli ten problem już w latach 90. Jonsson i Lesshammar pisali w 1999 r., że przez różne definicje trudno porównywać OEE między firmami. Przytoczyli pomiary od 30 do 80% i uznali, że tak rozbieżne liczby pokazują, jak trudno porównywać OEE różnych procesów [@jonsson].

## Porównanie ma sens, gdy definicja jest wspólna

Z tego nie wynika, że OEE jest bezużyteczne albo że 85% jest nieosiągalne. Linia opisana przez Anderssona i Bellgran miała 86% przed zmianą [@andersson], a zakłady nagradzane w Japonii za TPM przekraczały 85% [@vorne-wc]. Wysoki wynik jest możliwy, tylko nie jest normą.

Najmocniejszy argument za 85% brzmi tak: cel ma być ambitny, a liczba z literatury nie pozwala spocząć na laurach. Vorne pisze, że dla wielu firm 85% może być odpowiednim celem długoterminowym [@vorne-lp]. Zgoda, pod dwoma warunkami. Cel dotyczy tej samej maszyny liczonej według tej samej definicji, a droga do niego prowadzi przez konkretne straty, a nie przez zmianę arkusza. Bez tych warunków 85% staje się normą, którą łatwiej spełnić w arkuszu niż na hali.

Porównanie dwóch zakładów też może mieć sens. Andersson i Bellgran piszą, że obliczenia muszą być wtedy wykonane w ten sam, ustandaryzowany sposób [@andersson]. W praktyce oznacza to ten sam czas planowany, ten sam rodzaj cyklu idealnego i te same zasady liczenia dobrych sztuk. Bez tego porównujesz arkusze, a nie maszyny.

Dwóch granic definicja nie usunie. Pierwsza: OEE nie mówi, czy maszyna jest wąskim gardłem. Wyższe OEE maszyny, która i tak czeka na poprzednią, nie da ani jednej sztuki więcej na końcu linii.

Druga: gdy czas bez zleceń wchodzi do mianownika, wynik zależy od popytu. De Ron i Rooda policzyli na przykładzie liczbowym jedną maszynę w pełnym tygodniu, czyli w 168 godzinach. Przy mniejszym obciążeniu miała OEE 47%, przy większym 59%, choć tempo i jakość były identyczne. Według autorów różnicę zrobiło otoczenie maszyny, a nie ona sama, dlatego OEE nie nadaje się do porównywania pojedynczych maszyn [@deron].

## Własny wynik czytaj w minutach, nie w procentach

Procent mówi, ile tracisz, ale nie gdzie. Rozpiszmy na minuty pierwszy arkusz z naszego przykładu (dane fikcyjne). Z 450 minut czasu planowanego maszyna stała przez 100: 50 minut trwały przezbrojenia, 30 konserwacja, a 20 awaria. W pozostałych 350 minutach zrobiła 520 sztuk, choć w cyklu idealnym zajęłoby jej to 260 minut. Kolejne 90 minut zjadło więc wolniejsze tempo i krótkie zatrzymania, których nikt nie zapisał jako przestoju.

Na braki poszło 7,5 minuty. Zostaje 252,5 minuty pracy w pełni produktywnej, czyli właśnie 56,1%.

Największą stratą okazuje się tempo, a nie awaria, która zwykle przyciąga najwięcej uwagi. Ljungberg pisał, że w analizowanych przypadkach dominowały straty wydajności [@ljungberg]. W danych z 98 szwedzkich firm największy wpływ na OEE miały straty sprawności operacyjnej, a dopiero po nich straty dostępności [@ylipaa]. Tymczasem tę stratę zakłady często pomijają: w danych Hedmana i współautorów 702 z 884 maszyn miały wpisaną wydajność 100% [@hedman]. Jeśli twoja wydajność od miesięcy wynosi równo 100%, to raczej znak, że nikt jej nie mierzy albo cykl idealny jest za wolny, niż że maszyna pracuje idealnie.

## Karta definicji OEE to siedem decyzji przed pierwszym pomiarem

Zanim policzysz pierwszy wynik, spisz na jednej kartce, jak liczysz. Każdą decyzję zapisz osobno dla maszyny albo linii:

1. **Czas planowany.** Od czego liczysz: od długości zmiany po odjęciu przerw czy od całej doby? Czy czas bez zleceń jest stratą maszyny?
2. **Przezbrojenia.** Strata dostępności czy czas wyłączony z planu? Jeśli chcesz je skracać, zostaw je jako stratę, bo inaczej znikną z wyniku.
3. **Konserwacja planowana, sprzątanie, odprawy.** Ta sama decyzja co przy przezbrojeniach, osobno dla każdego zdarzenia.
4. **Cykl idealny.** Nominalny cykl maszyny, najlepszy zmierzony czy czas z planowania, osobno dla każdego wyrobu.
5. **Dobra sztuka.** Czy sztuka po przeróbce liczy się jako dobra?
6. **Krótkie zatrzymania.** Od ilu minut zatrzymanie jest przestojem, a poniżej jakiego progu obniża tylko wydajność?
7. **Źródło danych.** Licznik i czujnik maszyny czy ręczny zapis operatora?

Potem policz OEE za ostatni miesiąc w dwóch albo trzech wariantach i wybierz jeden. Jeśli OEE ma prowadzić do usprawnień, wybierz wariant, który pokazuje straty, a nie ten, który daje najładniejszą liczbę. Zapisz go na karcie i przelicz nim historię. Od tej chwili zmiana wyniku oznacza zmianę na hali, a nie w arkuszu.

Kartę podpisuje osoba, która odpowiada za wynik, na przykład kierownik produkcji. Każdą późniejszą zmianę definicji zapisz z datą i przelicz według niej co najmniej poprzedni kwartał, żeby na wykresie nie pojawił się skok, którego nie było na hali. Kartę dołączaj do każdego raportu, w którym pokazujesz OEE.

## Co zrobić w tym tygodniu

Zacznij od jednej maszyny. Wypełnij dla niej kartę, przelicz ostatni miesiąc w dwóch wariantach i pokaż zespołowi różnicę. Nic tak szybko nie oducza porównywania się z liczbą z internetu. Do przeliczenia wystarczą trzy rzeczy, które zwykle już są: rejestr przestojów z czasem i przyczyną, licznik sztuk dobrych i wadliwych oraz cykl idealny dla każdego wyrobu. Jeśli rejestr nie odróżnia przezbrojeń od awarii i krótkich zatrzymań, popraw go, zanim zaczniesz mówić o procentach.

Potem porównuj maszynę z nią samą, tydzień do tygodnia, przy tej samej karcie, a cel wyznaczaj od własnego punktu startu. O stratach mów w minutach: „50 minut przezbrojeń na zmianę” wskazuje, co robić, a „OEE spadło o trzy punkty” nie wskazuje niczego. Zanim porównasz się z innym zakładem, porównaj najpierw karty definicji.

Wróćmy do trzech arkuszy z początku. Wszystkie były poprawne. Błędny byłby dopiero czwarty: taki, w którym co miesiąc liczy się trochę inaczej. OEE mówi, ile tracisz, a nie jak wypadasz na tle świata.
