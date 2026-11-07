## W skrócie

**Problem.** Wynik OEE (całkowitej efektywności urządzeń) porównuje się z liczbą 85%, nazywaną „światową klasą” [@vorne-wc], albo z wynikiem innego zakładu. Tymczasem ta sama zmiana daje bardzo różne wyniki, zależnie od tego, kto i jak liczy.

**Dlaczego.** W TPM (kompleksowym utrzymaniu ruchu) liczba 85% jest celem, do którego zakład ma dojść dzięki usprawnieniom [@jipm]. Zmierzone średnie są niższe, a wynik zależy od tego, co uznasz za czas planowany i jaki cykl przyjmiesz za idealny [@andersson].

**Co zrobić.** Spisz kartę definicji OEE, porównuj maszynę z nią samą i mów o stratach w minutach.

## Jedna zmiana, trzy wyniki z tego samego wzoru

Poniedziałkowa odprawa. Inżynier utrzymania ruchu, kierownik zmiany i planista przynoszą OEE tej samej zmiany na tej samej maszynie, każdy ze swojego arkusza: 56, 68 i 91%. Nikt nie pomylił się w rachunku. Różnicę robią tylko dwie decyzje: co wliczyć do czasu planowanego i jaki cykl uznać za idealny. (Scena i liczby są fikcyjne, rachunek prawdziwy.)

Zmiana trwała osiem godzin. Pół godziny zajęła przerwa, drugie pół godziny planowana konserwacja. Dwa przezbrojenia trwały 50 minut, awaria 20. Maszyna zrobiła 520 sztuk, z czego 505 dobrych. Producent podaje cykl 30 sekund na sztukę, a norma czasu w systemie ERP to 40 sekund.

![Wykres słupkowy: OEE tej samej zmiany w trzech arkuszach. Inżynier utrzymania ruchu: przezbrojenia i konserwacja to strata, cykl producenta 30 s, wynik 56%. Kierownik zmiany: przezbrojenia i konserwacja wyłączone z czasu planowanego, cykl producenta 30 s, wynik 68%. Planista: przezbrojenia i konserwacja wyłączone z czasu planowanego, norma czasu z ERP 40 s, wynik 91%. Przerywana linia oznacza 85%.](../../assets/rysunki/oee-85-procent-1.svg "Rysunek 1. Ta sama zmiana ma OEE od 56 do 91% zależnie od dwóch decyzji w definicji. Dane fikcyjne, rachunek redakcji.")

| | Inżynier | Kierownik | Planista |
| --- | --- | --- | --- |
| Przezbrojenia, konserwacja | strata | poza czasem planowanym | poza czasem planowanym |
| Cykl idealny | 30 s, producent | 30 s, producent | 40 s, ERP |
| Dostępność | 77,8% | 94,6% | 94,6% |
| Wydajność (tempo) | 74,3% | 74,3% | 99,0% |
| Jakość | 97,1% | 97,1% | 97,1% |
| OEE | 56% | 68% | 91% |

Najbliżej klasycznego TPM jest arkusz inżyniera, bo przezbrojenie i regulacja to w TPM jedna z sześciu dużych strat [@jipm]. Gdyby inżynier wyłączył jeszcze planową konserwację, jak w definicji Nakajimy [@jonsson], wyszłoby 60%. Arkusz kierownika mierzy maszynę w czasie, który zostaje po przezbrojeniach. Arkusz planisty sprawdza raczej, czy maszyna nadąża za planem, niż ile traci.

Kłopot w tym, że każda z tych liczb trafi potem do porównania z 85%. Z różnicy wylicza się, ile zakład mógłby zyskać. W materiale sponsorowanym firmy DSR, dostawcy systemów IT dla produkcji, czytamy, że przejście z 60 do 85% OEE daje 42% więcej produkcji [@itwiz]. Nawet rozdział książki wydanej przez AGH podaje 85% jako „światowy standard”, a w tym samym zdaniu 60% jako wynik pożądany [@agh].

Tymczasem firmy liczą bardzo różnie. W szwedzkich ankietach mniej niż połowa respondentów podała, że ich firma rejestruje przezbrojenie jako zakłócenie produkcji, choć według autorów niemal każda definicja OEE od początku liczy je jako stratę [@bokrantz]. Nawet norma ISO 22400-2 podaje, według analizy z 2020 r., dwie definicje OEE, które wydają się rozbieżne [@schiraldi]. Jeśli nie wiesz, jak policzono wynik, porównanie z 85% albo z innym zakładem mówi niewiele. Pod koniec tekstu znajdziesz kartę definicji, która to naprawia, i gotową odpowiedź dla zarządu.

## 85% to cel, który wyznaczyli twórcy TPM

Najwcześniej znaleźliśmy tę liczbę w książce wydanej w 1982 r. przez JIPM, japoński instytut utrzymania ruchu. Kunio Shirose pisze w niej, że w badanych firmach efektywność urządzeń wynosiła średnio 40–60%, a dzięki TPM można ją podnieść do 85–95% [@jipm]. Same 85% to iloczyn trzech wartości, które Nakajima, redaktor tej książki, podał według późniejszych autorów w 1984 r. To dostępność ponad 90%, wydajność ponad 95% i jakość ponad 99%. Uważał taki wynik za dobry punkt odniesienia dla możliwości typowego zakładu [@jonsson] i za minimum, do którego firmy powinny dążyć [@vorne-wc]. To minimum dla zakładu, który przeszedł program TPM, a nie opis przeciętnego wyniku: badane przez JIPM firmy miały wtedy średnio 40–60% [@jipm].

Dziś te liczby powtarza Vorne, producent systemów do pomiaru OEE, z zastrzeżeniem, że dotyczą produkcji liczonej w sztukach. Według niego Nakajima zauważył, że wszystkie zakłady nagrodzone w Japonii za wdrożenie TPM miały ponad 85% [@vorne-wc]. Ta sama firma nazywa jednak 85% wygodnym i przekonującym, ale zupełnie sztucznym punktem odniesienia [@vorne-faq].

Ile zakładów naprawdę przekracza 85%, nie wiadomo. Dostawca oprogramowania Evocon, który zbiera dane z ponad 3,5 tys. maszyn swoich klientów, podaje, że średnie roczne OEE co najmniej 85% ma około 6% z nich. Ponieważ klienci często zawyżają wynik, prawdziwy odsetek ocenia na około 3%. Nie podaje jednak, według jakiej definicji liczyli [@evocon].

## Zmierzone średnie są niższe niż 85%

Porządnych badań wielu zakładów jest niewiele. Oto te, które znaleźliśmy, i dwa polskie studia pojedynczych maszyn:

| Badanie | Próba | Średnie OEE |
| --- | --- | --- |
| Szwecja, 2013–2014 [@hedman] | 884 maszyny w 23 firmach | 65% (mediana 70%) |
| Szwecja, 2006–2012 [@ylipaa] [@bokrantz] | 98 firm | 51,5% |
| Badanie z 1998 r. [@ljungberg] | ok. 20 przypadków | ok. 55% |
| Polska, studium z AGH [@agh] | 1 maszyna, tydzień | 68% (dziennie 46–83%) |
| Polska, zakład farb [@jagusiak] | 1 mieszadło, 31 dni | 78,9% |

Nawet te średnie mogą być zawyżone. W badaniu 884 maszyn aż 702 miały wpisaną wydajność 100%, a 796 jakość 100%. To wartość domyślna systemu, a autorzy uważają za mało prawdopodobne, by tyle maszyn naprawdę pracowało bez tych strat. Pytają nawet, czy firmy mierzą OEE, czy tylko dostępność [@hedman].

Tych liczb nie uśredniaj i nie traktuj jak nowej normy, bo badania różnią się metodą, latami i próbą. W studium z AGH przezbrojeń w ogóle nie liczono jako straty [@agh]. Wszystkie średnie leżą jednak poniżej 85%, od 51,5 do 78,9%.

## Usprawnienie potrafi obniżyć OEE

OEE potrafi spaść, gdy linia robi więcej. W studium przypadku z 2011 r. zmiana testu i nowe urządzenie skróciły cykl idealny półautomatycznej linii montażowej z 26 do 22 sekund. Dotychczasowe przestoje zostały, więc OEE spadło z 86 do 79%, a linia zaczęła robić 130 zamiast 118 sztuk na godzinę [@andersson]. Kto patrzy tylko na OEE, uzna usprawnienie za pogorszenie. Gdyby zakład porównywał oba okresy tym samym cyklem 22 sekund, przed usprawnieniem miałby około 73% (rachunek redakcji: 86% × 22/26), a po nim 79%.

Podobnie działa jedna norma dla wielu wyrobów. W studium z AGH zakład nie określał normy czasu dla każdego wyrobu, więc autorzy przyjęli dla wyrobów o różnej trudności jedno średnie tempo: 2000 sztuk na godzinę. Sami piszą, że to uproszczenie znacząco zaniża wydajność, a wynik kolejnego tygodnia może się wyraźnie zmienić, gdy maszyna będzie robić inne wyroby [@agh].

A porównanie z innym zakładem? Autorzy studium z 2011 r. piszą, że wzór OEE jest w zasadzie jeden, ale różnie interpretuje się jego składniki, więc obliczenia trzeba ustandaryzować [@andersson]. Bez tego porównujesz arkusze, a nie maszyny.

Nawet wtedy uważaj na czas bez zleceń. W analizie z 2006 r. ta sama maszyna, liczona razem z tym czasem, miała OEE 47% przy mniejszym obciążeniu i 59% przy większym. Tempo i jakość były identyczne [@deron]. Dlatego w karcie czas bez zleceń trzymamy osobno.

## Własny wynik rozpisz na minuty

Procent nie mówi, gdzie uciekają minuty. Rozpiszmy na minuty fikcyjny arkusz inżyniera:

| Gdzie podziało się 450 minut | Minuty |
| --- | --- |
| Czas planowany | 450 |
| Przezbrojenia | −50 |
| Konserwacja planowana | −30 |
| Awaria | −20 |
| Praca maszyny | 350 |
| Wolniejsze tempo i krótkie zatrzymania | −90 |
| Braki (15 sztuk po 30 sekund) | −7,5 |
| Praca w pełni produktywna | 252,5, czyli 56,1% |

Największa strata nie jest tu awarią. Wolniejsze tempo i krótkie zatrzymania kosztują 90 minut, czyli 180 sztuk, które maszyna zrobiłaby w cyklu producenta. Do policzenia tej straty nie potrzebujesz systemu MES. Wystarczy czas pracy z rejestru przestojów i liczba sztuk z licznika: 520 sztuk po 30 sekund to 260 minut, a reszta z 350 minut pracy to strata tempa. Żeby oddzielić wolniejsze tempo od krótkich zatrzymań, poproś operatora, by przez kilka zmian notował na kartce przy maszynie każde krótkie zatrzymanie z godziną i przyczyną. Zobaczysz wtedy, która z tych dwóch strat jest większa.

Podobny obraz dało badanie około 20 przypadków: dominowały w nim straty wydajności, choć uwagę skupiają długie przestoje z powodu awarii [@ljungberg]. Już podręcznik JIPM ostrzegał, że straty prędkości zwykle się przeocza, a krótkie zatrzymania trudno zmierzyć [@jipm]. Firmy ze szwedzkiego badania 884 maszyn w ogóle nie rejestrowały prędkości maszyn [@hedman]. Jeśli twoja wydajność od miesięcy wynosi równo 100%, to raczej znak, że nikt jej nie mierzy albo cykl idealny jest za wolny.

## Karta definicji OEE to osiem spisanych decyzji

Dla każdej maszyny albo linii spisz na jednej kartce, jak liczysz, także jeśli liczysz OEE od lat. Przy każdej decyzji podajemy ustawienie, od którego warto zacząć:

1. **Czas planowany.** Od długości zmiany po odjęciu przerw czy od całej doby? Czas bez zleceń wyłącz z czasu planowanego i pokazuj osobno, w godzinach. Inaczej tydzień z mniejszą liczbą zamówień obniży OEE, choć maszyna pracowała tak samo [@deron].
2. **Przezbrojenia.** Strata dostępności czy czas wyłączony z planu? Jeśli chcesz je skracać, zostaw je w stratach: tylko wtedy widać je w wyniku i zespół ma powód do usprawnień [@bokrantz]. Do przezbrojenia zalicz wymianę oprzyrządowania pod nowy wyrób, regulację i braki powstałe przy tej regulacji, bo tak tę stratę opisuje TPM [@jipm]. Wymianę zużytego narzędzia w trakcie serii zapisuj osobno.
3. **Konserwacja planowana, sprzątanie, odprawy.** Ta sama decyzja co przy przezbrojeniach, osobno dla każdego zdarzenia. Na start zostaw w stratach wszystko, co chcesz skracać.
4. **Brak operatora i materiału.** Gdy maszyna stoi, bo operator obsługuje drugą albo brakuje materiału, to przestój, choć nie z winy maszyny. Vorne zalicza takie przyczyny do nieplanowanych postojów [@vorne-straty]. Licz je w stratach, ale z osobnym kodem przyczyny, żeby było widać, ile maszyna stoi przez siebie, a ile przez braki ludzi i materiału.
5. **Cykl idealny.** Osobno dla każdego wyrobu. W TPM punktem odniesienia jest prędkość, na którą maszynę zaprojektowano, a celem dojście do niej i jej przekroczenie [@jipm]. Na start weź więc cykl producenta albo czas z programu CNC, a jeśli maszyna pracuje szybciej, najkrótszy cykl zmierzony na kilkunastu kolejnych sztukach. Przy setkach indeksów zacznij od kilkunastu, które zajmują maszynie najwięcej godzin. Norma czasu z ERP, jeśli zawiera zapas czasu, zawyży wynik tak jak w arkuszu planisty.
6. **Dobra sztuka.** Czy sztuka po przeróbce liczy się jako dobra? W TPM przeróbka to strata jakości, tak jak brak [@jipm], więc za dobre licz tylko sztuki dobre za pierwszym razem.
7. **Krótkie zatrzymania.** Od ilu minut zatrzymanie liczysz jako przestój, a krótsze tylko jako spadek wydajności? Vorne radzi powiązać ten próg z zasadą wpisywania przyczyn: na przykład każde zatrzymanie dłuższe niż dwie minuty dostaje przyczynę i liczy się jako przestój [@vorne-straty].
8. **Źródło danych.** Licznik i czujnik maszyny czy ręczny zapis operatora? Przy ręcznym zapisie krótkie zatrzymania i część przestojów łatwo pominąć [@muchiri]. Zaznacz to na karcie i nie porównuj takiego wyniku z danymi z czujników.

Potem policz OEE za ostatni miesiąc w dwóch albo trzech arkuszach. Jeśli OEE ma prowadzić do usprawnień, wybierz ten, który pokazuje straty, nawet jeśli daje niższą liczbę. Zapisz go na karcie i przelicz nim historię. Od tej chwili zmiana wyniku znaczy, że coś zmieniło się na hali: w pracy maszyny albo w asortymencie.

Kartę daj do zatwierdzenia komuś, kogo nie rozlicza się z OEE, na przykład kontrolingowi. Każdą późniejszą zmianę definicji zapisz z datą i przelicz według niej co najmniej poprzedni kwartał. Jeśli od OEE albo od wykonania normy z ERP zależą premie, ustal z kadrami, co się z nimi stanie, zanim zmienisz kartę. Nowa definicja uderzy wtedy w ludzi.

## Zacznij od maszyny, która ogranicza linię

Wybierz maszynę, przed którą rośnie kolejka, a za którą inne czekają. Tylko tam odzyskana minuta daje więcej sztuk na końcu linii. To ona wyznacza, ile linia wyprodukuje, dlatego Vorne radzi właśnie na niej mierzyć OEE całej linii [@vorne-faq]. W produkcji gniazdowej, gdzie wąskie gardło wędruje razem z asortymentem, weź maszynę, która ogranicza produkcję najczęściej, i porównuj tygodnie o podobnym asortymencie.

Na ręcznym montażu tempo wyznaczają ludzie, więc OEE stanowiska mówi niewiele. Tam rozpisz na minuty zmianę całego gniazda: czekanie na części, poprawki, przezbrojenia i przestoje z braku ludzi.

Potrzebujesz rejestru przestojów z czasem i przyczyną, licznika sztuk dobrych i wadliwych oraz cyklu idealnego dla każdego wyrobu. Jeśli rejestr nie odróżnia przezbrojeń od awarii i krótkich zatrzymań, popraw go, zanim zaczniesz mówić o procentach. Cel zapisz w minutach jednej straty: zamiast „podnieść OEE o pięć punktów do marca” napisz „przezbrojenia z 50 do 35 minut na zmianę do marca”.

## Co powiedzieć zarządowi, który pyta, dlaczego nie 85%

Wystarczą trzy zdania. Pierwsze: „85% to cel z programu TPM, a w dużym badaniu maszyny miały średnio 65%, i to przy wydajności wpisanej z automatu jako 100%” [@jipm] [@hedman]. Drugie: „Liczymy według spisanej karty i porównujemy się z naszym wynikiem sprzed miesiąca”. Trzecie: „Największa strata to tyle a tyle minut na zmianę, czyli tyle sztuk i tyle złotych, i to ją teraz zmniejszamy”.

W naszym fikcyjnym przykładzie trzecie zdanie brzmiałoby tak: wolniejsze tempo i krótkie zatrzymania zabierają 90 minut na zmianę, czyli 180 sztuk. Przy marży 8 zł na sztuce to 1440 zł na zmianę, a przy dwóch zmianach przez 250 dni w roku 720 tys. zł rocznie. Tyle zyskasz naprawdę tylko wtedy, gdy maszyna jest wąskim gardłem i są zamówienia na te sztuki.

Tak samo z rachunkiem DSR z początku tekstu. Jest prawdziwy pod trzema warunkami: maszyna jest wąskim gardłem, na dodatkowe sztuki są zamówienia (te dwa zastrzega sam autor [@itwiz]), a oba wyniki policzono według tej samej karty. Sprawdź je, zanim odłożysz zakup maszyny albo obiecasz zarządowi więcej sztuk. Gdy centrala grupy albo audytor klienta stawia ci cel 85%, najpierw poproś o ich kartę definicji.

Gdy przejdziesz na arkusz, który pokazuje straty, wynik spadnie, czasem o kilkanaście, a nawet kilkadziesiąt punktów. Uprzedź o tym zarząd, najlepiej jednym zdaniem: „Liczymy teraz według spisanej karty, więc wynik spadnie, ale wreszcie widać, gdzie tracimy minuty”. Przez kwartał pokazuj na jednym wykresie obie linie, według starej i nowej karty.

Wróćmy na poniedziałkową odprawę. Żaden z trzech arkuszy nie był błędny w rachunku, ale tylko arkusz inżyniera pokazuje jako straty zarówno przezbrojenia, jak i wolne tempo. Naprawdę błędny byłby dopiero czwarty: taki, w którym co miesiąc liczy się trochę inaczej. OEE pokaże ci, gdzie maszyna traci minuty. Jak wypadasz na tle świata, z niego nie wyczytasz.
