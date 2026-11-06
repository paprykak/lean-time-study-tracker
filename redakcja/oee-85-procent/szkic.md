## W skrócie

**Problem.** Wynik OEE (całkowitej efektywności urządzeń) porównuje się z liczbą 85%, nazywaną „światową klasą” [@vorne-wc], albo z wynikiem innego zakładu. Tymczasem ta sama zmiana daje bardzo różne wyniki, zależnie od tego, kto i jak liczy.

**Dlaczego.** W TPM (kompleksowym utrzymaniu ruchu) liczba 85% jest celem, do którego zakład ma dojść dzięki usprawnieniom [@jipm]. Zmierzone średnie są niższe, a wynik zależy od tego, co uznasz za czas planowany i jaki cykl przyjmiesz za idealny [@andersson].

**Co zrobić.** Spisz kartę definicji OEE, porównuj maszynę z nią samą i mów o stratach w minutach.

## Jedna zmiana, trzy wyniki z tego samego wzoru

Weźmy jedną zmianę na jednej maszynie i trzy osoby, które liczą jej OEE, każda w swoim arkuszu (to przykład, liczby są fikcyjne). Wychodzi im 56, 68 i 91%. Żadna nie pomyliła się w rachunku. Różnicę robią tylko dwie decyzje: co wliczyć do czasu planowanego i jaki cykl uznać za idealny.

Oto ta zmiana. Trwała osiem godzin, w tym pół godziny przerwy i pół godziny planowanej konserwacji. Dwa przezbrojenia zajęły 50 minut, awaria 20. Maszyna zrobiła 520 sztuk, z czego 505 dobrych. Producent podaje cykl 30 sekund na sztukę, a norma czasu w systemie ERP to 40 sekund.

![Wykres słupkowy: OEE tej samej zmiany w trzech arkuszach. Arkusz 1: przezbrojenia i konserwacja w stratach, cykl producenta 30 s, wynik 56%. Arkusz 2: przezbrojenia i konserwacja poza planem, cykl producenta 30 s, wynik 68%. Arkusz 3: przezbrojenia i konserwacja poza planem, norma czasu z ERP 40 s, wynik 91%. Przerywana linia oznacza 85%.](../../assets/rysunki/oee-85-procent-1.svg "Rysunek 1. Ta sama zmiana ma OEE od 56 do 91% zależnie od dwóch decyzji w definicji. Dane fikcyjne, rachunek redakcji.")

Pierwszy arkusz liczy przezbrojenia i konserwację jako stratę i bierze cykl producenta. Dostępność wynosi w nim 77,8%, wydajność 74,3%, jakość 97,1%, a OEE 56%. Drugi arkusz wyłącza przezbrojenia i konserwację z czasu planowanego, bo przecież były w planie, więc dostępność rośnie do 94,6%, a OEE do 68%. Trzeci robi to samo, ale bierze normę czasu z ERP. Wydajność skacze do 99%, a OEE do 91%, powyżej „światowej klasy”.

Najbliżej klasycznego TPM jest pierwszy arkusz, bo przezbrojenie i regulacja to w TPM jedna z sześciu dużych strat [@jipm]. Planową konserwację TPM wyłącza jednak z czasu planowanego [@jonsson], więc arkusz liczony dokładnie według TPM dałby 60%. Drugi arkusz mierzy maszynę w czasie, który zostaje po przezbrojeniach. Trzeci sprawdza raczej, czy maszyna nadąża za planem, niż ile traci.

Ma to znaczenie, bo z liczby 85% wylicza się, ile zakład mógłby zyskać. W materiale sponsorowanym firmy DSR, dostawcy systemów IT dla produkcji, czytamy, że przejście z 60 do 85% OEE daje 42% więcej produkcji [@itwiz]. Liczbę 85% jako wzorzec podaje też rozdział książki wydanej przez AGH: „światowym standardem jest wskaźnik OEE na poziomie 85%”, a za pożądany uznaje wynik około 60% [@agh]. Jeśli nie wiesz, jak policzono wynik, takie porównanie mówi niewiele. Sens ma dopiero porównanie tej samej maszyny liczonej według jednej, spisanej definicji. Pod koniec tekstu znajdziesz kartę takiej definicji i gotową odpowiedź dla zarządu.

## 85% to cel, który wyznaczyli twórcy TPM

Liczba 85% pochodzi z japońskiego ruchu TPM. Najstarsze źródło, do którego dotarliśmy, to książka o wdrażaniu TPM pod redakcją Seiichiego Nakajimy. Wydał ją w 1982 r. JIPM, japoński instytut utrzymania ruchu, a po angielsku ukazała się w 1989 r. Kunio Shirose pisze w niej, że w firmach badanych przez JIPM efektywność urządzeń wynosiła średnio od 40 do 60%. Działania TPM mogą ją według niego podnieść nawet do 85–95% [@jipm].

Same 85% to iloczyn trzech celów przypisywanych Nakajimie: dostępności ponad 90%, wydajności ponad 95% i jakości ponad 99%. Jonsson i Lesshammar piszą, że Nakajima uważał taki wynik za dobry punkt odniesienia dla możliwości typowego zakładu [@jonsson]. Vorne, producent systemów do pomiaru OEE, opisuje te liczby jako minimum, do którego według Nakajimy firmy powinny dążyć [@vorne-wc].

Vorne dodaje, że według Nakajimy wszystkie zakłady nagrodzone w Japonii za wdrożenie TPM (Distinguished Plant Prize) miały OEE powyżej 85%. Zastrzega też, że te liczby dotyczą produkcji dyskretnej, czyli liczonej w sztukach, i mają korzenie w japońskiej motoryzacji lat 70. [@vorne-wc]. W częstych pytaniach na swojej stronie ta sama firma nazywa 85% wygodnym, przekonującym i zupełnie sztucznym punktem odniesienia [@vorne-faq].

## Zmierzone średnie są dalekie od 85%

Badań OEE w wielu zakładach z opisaną metodą jest mało, a najlepsze, jakie znaleźliśmy, pochodzą ze Szwecji. W badaniu z największą liczbą maszyn, obejmującym 884 maszyny w 23 firmach w latach 2013–2014, średnie OEE wyniosło 65%, a mediana 70% [@hedman]. W danych z 98 szwedzkich firm z lat 2006–2012 średnia wyniosła 51,5% [@ylipaa] [@bokrantz], a w około 20 przypadkach opisanych w 1998 r. około 55% [@ljungberg].

Najciekawsze jest to, czego te liczby nie pokazują. W badaniu z największą liczbą maszyn 702 z 884 miały wpisaną wydajność 100%, a 796 jakość 100%. To wartość domyślna systemu, a autorzy uważają za mało prawdopodobne, by tyle maszyn naprawdę pracowało bez tych strat. Pytają nawet, czy firmy mierzą OEE, czy tylko dostępność [@hedman]. Prawdziwe średnie mogą więc być jeszcze niższe.

Tych liczb nie uśredniaj i nie traktuj jak nowej normy, bo badania różnią się metodą, latami i próbą. To dane głównie szwedzkie i sprzed ponad dekady. W Polsce znaleźliśmy jedynie studia pojedynczych maszyn: w jednym dzienne OEE wahało się w ciągu tygodnia od 46 do 83% [@agh], w drugim średnia z 31 dni wyniosła 78,9% [@jagusiak]. Polskiej średniej z tego nie wyliczysz.

## Wynik zależy od definicji tak samo jak od maszyny

Pierwsza decyzja dotyczy czasu planowanego. Czy przezbrojenie, planowana konserwacja i przerwa mają obniżać wynik? W dwóch szwedzkich ankietach, z 2001 i 2014 r., mniej niż połowa respondentów podała, że ich firma rejestruje przezbrojenie jako zakłócenie produkcji. Tymczasem według autorów niemal każda definicja OEE od początku liczy je jako stratę [@bokrantz]. Andersson i Bellgran piszą, że wzór OEE jest w zasadzie jeden, ale różnie interpretuje się, co jest czasem planowanym, a co nieplanowanym, i jaki cykl uznać za idealny [@andersson].

Druga decyzja to cykl idealny. Do wyboru jest cykl producenta, najkrótszy zmierzony albo norma czasu z karty technologicznej czy ERP. Im wolniejszy cykl przyjmiesz, tym wyższa wydajność i całe OEE. Wynik zniekształca też jedna norma dla wszystkich wyrobów. W studium z AGH zakład nie określał normy czasu dla każdego wyrobu, więc autorzy przyjęli dla wyrobów o różnej trudności jedno średnie tempo: 2000 sztuk na godzinę. Sami piszą, że to uproszczenie znacząco zaniża wydajność, a wynik kolejnego tygodnia może się wyraźnie zmienić, gdy maszyna będzie robić inne wyroby [@agh].

OEE potrafi nawet spaść, gdy linia robi więcej. Andersson i Bellgran opisali półautomatyczną linię montażową, na której usprawnienie skróciło cykl idealny z 26 do 22 sekund. Dotychczasowe przestoje zostały, więc OEE spadło z 86 do 79%, a linia zaczęła robić 130 zamiast 118 sztuk na godzinę [@andersson]. Kto patrzy tylko na OEE, uzna usprawnienie za pogorszenie. Gdyby zakład przeliczył historię nowym cyklem, te same 118 sztuk na godzinę dałyby około 72% (rachunek redakcji: 118 × 22 s / 3600 s), a wykres pokazałby wzrost do 79%.

Norma ISO też nie rozstrzyga sprawy. Według analizy Schiraldiego i Varisco ISO 22400-2 z 2014 r. podaje dwie definicje OEE, które wydają się rozbieżne ze sobą i z ujęciem Nakajimy [@schiraldi]. Sama norma czeka na nowe wydanie [@iso].

## Wysokie OEE się zdarza, tylko nie wiadomo, jak często

Nagrodzone japońskie zakłady to zwycięzcy konkursu, a nie przekrój firm z TPM, a ich wyniki OEE znamy tylko z relacji dostawcy [@vorne-wc]. Linia Anderssona i Bellgran miała 86% przy dawnym cyklu idealnym 26 sekund, który zakład skrócił nowym urządzeniem [@andersson]. Badań z opisaną próbą, które mówiłyby, ile zakładów przekracza 85%, nie znaleźliśmy. Dostawca oprogramowania Evocon podaje, że robi to około 6% firm. Dane pochodzą z ponad 3,5 tys. maszyn w ponad 50 krajach z lat 2023–2024, ale firma nie opisuje definicji OEE [@evocon].

Czy 85% nadaje się więc na cel? Tak, bo tak pomyśleli tę liczbę twórcy TPM [@jipm], ale pod dwoma warunkami. Cel ma dotyczyć tej samej maszyny, liczonej stale według jednej definicji, a droga do niego ma prowadzić przez konkretne straty. Bez tych warunków 85% staje się normą, którą łatwiej spełnić w arkuszu niż na hali.

## Porównanie z innym zakładem wymaga wspólnej karty

Porównanie dwóch zakładów też może mieć sens. Andersson i Bellgran piszą, że obliczenia muszą być wtedy ustandaryzowane [@andersson]. Bez tego porównujesz arkusze, nie maszyny.

Dwóch rzeczy wspólna definicja jednak nie załatwi. Po pierwsze, OEE nie mówi, czy maszyna jest wąskim gardłem. Wyższe OEE maszyny, która i tak czeka na poprzednią, nie da ani jednej sztuki więcej na końcu linii.

Po drugie, gdy czas bez zleceń wchodzi do czasu planowanego, wynik zależy od popytu. De Ron i Rooda policzyli na przykładzie jedną maszynę przez pełny tydzień, czyli 168 godzin. Przy mniejszym obciążeniu miała OEE 47%, przy większym 59%, choć tempo i jakość pracy były identyczne. Różnicę zrobił głównie czas, w którym maszyna czekała na zlecenia. Według autorów OEE zawiera wpływ otoczenia maszyny, dlatego nie nadaje się do porównywania ze sobą pojedynczych maszyn [@deron].

## Własny wynik czytaj w minutach, nie w procentach

Procent nie mówi, gdzie uciekają minuty. Rozpiszmy pierwszy arkusz (dane fikcyjne):

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

Największa strata nie jest tu awarią. Wolniejsze tempo i krótkie zatrzymania kosztują 90 minut, czyli 180 sztuk, które maszyna zrobiłaby w cyklu producenta.

Przykład ułożyliśmy na wzór badań. Ljungberg pisał, że w analizowanych przypadkach dominowały straty wydajności, choć uwagę skupiają długie przestoje z powodu awarii [@ljungberg]. Już podręcznik JIPM ostrzegał, że straty prędkości zwykle się przeocza, a krótkie zatrzymania trudno zmierzyć [@jipm]. Firmy z badania Hedmana i współautorów w ogóle nie rejestrowały prędkości maszyn [@hedman]. Jeśli twoja wydajność od miesięcy wynosi równo 100%, to raczej znak, że nikt jej nie mierzy albo cykl idealny jest za wolny.

## Karta definicji OEE to siedem spisanych decyzji

Spisz na jednej kartce, jak liczysz, osobno dla każdej maszyny albo linii, także jeśli liczysz OEE od lat. Przy każdej decyzji podajemy ustawienie, od którego warto zacząć:

1. **Czas planowany.** Od długości zmiany po odjęciu przerw czy od całej doby? Czas bez zleceń wyłącz z czasu planowanego i pokazuj osobno, w godzinach. Inaczej tydzień z mniejszą liczbą zamówień obniży OEE, choć maszyna pracowała tak samo [@deron].
2. **Przezbrojenia.** Strata dostępności czy czas wyłączony z planu? Jeśli chcesz je skracać, zostaw je w stratach: tylko wtedy są widoczne w wyniku i dają bodziec do usprawnień [@bokrantz].
3. **Konserwacja planowana, sprzątanie, odprawy.** Ta sama decyzja co przy przezbrojeniach, osobno dla każdego zdarzenia. Na start zostaw w stratach wszystko, co chcesz skracać.
4. **Cykl idealny.** Osobno dla każdego wyrobu. W TPM punktem odniesienia jest prędkość konstrukcyjna maszyny, a celem dojście do niej i jej przekroczenie [@jipm]. Na start weź więc cykl producenta, a jeśli maszyna pracuje szybciej, najkrótszy cykl zmierzony na kilkunastu kolejnych sztukach. Wolniejszy cykl ze względów jakościowych zapisz na karcie z powodem. Norma czasu z ERP, jeśli zawiera naddatki, zawyży wynik tak jak w arkuszu 3.
5. **Dobra sztuka.** Czy sztuka po przeróbce liczy się jako dobra? W TPM przeróbka to strata jakości, tak jak brak [@jipm], więc za dobre licz tylko sztuki dobre za pierwszym razem.
6. **Krótkie zatrzymania.** Od ilu minut zatrzymanie liczysz jako przestój, a krótsze tylko jako spadek wydajności? Vorne radzi powiązać ten próg z zasadą wpisywania przyczyn: na przykład każde zatrzymanie dłuższe niż dwie minuty dostaje przyczynę i liczy się jako przestój [@vorne-straty].
7. **Źródło danych.** Licznik i czujnik maszyny czy ręczny zapis operatora? Przy ręcznym zapisie krótkie zatrzymania i część przestojów łatwo pominąć [@muchiri]. Zaznacz to na karcie i nie porównuj takiego wyniku z danymi z czujników.

Potem policz OEE za ostatni miesiąc w dwóch albo trzech arkuszach. Jeśli OEE ma prowadzić do usprawnień, wybierz ten, który pokazuje straty, nawet jeśli daje niższą liczbę. Zapisz go na karcie i przelicz nim historię. Od tej chwili wynik zmienia się tylko wtedy, gdy zmienia się coś na hali: praca maszyny albo asortyment.

Kartę daj do zatwierdzenia komuś, kogo nie rozlicza się z OEE, na przykład kontrolingowi. Każdą późniejszą zmianę definicji zapisz z datą i przelicz według niej co najmniej poprzedni kwartał, żeby wykres nie pokazał skoku, którego maszyna nie zrobiła. Kartę dołączaj do każdego raportu z OEE.

## Zacznij od maszyny, która ogranicza linię

Wybierz maszynę, przed którą rośnie kolejka, a za którą inne czekają. Tylko tam odzyskana minuta daje więcej sztuk na końcu linii i właśnie tam, według Vorne, należy mierzyć OEE całej linii [@vorne-faq]. W produkcji gniazdowej, gdzie wąskie gardło wędruje razem z asortymentem, weź maszynę, która ogranicza produkcję najczęściej, i porównuj tygodnie o podobnym asortymencie. Na ręcznym montażu tempo wyznaczają ludzie, więc zamiast OEE stanowiska licz wprost minuty strat.

Wypełnij kartę i pokaż zespołowi różnicę między arkuszami. Potrzebujesz rejestru przestojów z czasem i przyczyną, licznika sztuk dobrych i wadliwych oraz cyklu idealnego dla każdego wyrobu. Jeśli rejestr nie odróżnia przezbrojeń od awarii i krótkich zatrzymań, popraw go, zanim zaczniesz mówić o procentach.

Cel zapisz w minutach jednej straty. Zamiast „podnieść OEE o pięć punktów do marca” napisz „przezbrojenia z 50 do 35 minut na zmianę do marca”.

## Co powiedzieć zarządowi, który pyta, dlaczego nie 85%

Wystarczą trzy zdania. Pierwsze: 85% to cel, który twórcy TPM wyznaczyli zakładom, a w firmach, które sami badali, mierzyli średnio 40–60% [@jipm]. Drugie: nasz wynik liczymy według spisanej karty i porównujemy z naszym wynikiem sprzed miesiąca. Trzecie: największa strata to tyle a tyle minut na zmianę, czyli tyle sztuk i tyle złotych, i to ją teraz zmniejszamy.

W naszym przykładzie (dane fikcyjne) trzecie zdanie brzmiałoby tak. Wolniejsze tempo i krótkie zatrzymania zabierają 90 minut na zmianę, czyli 180 sztuk. Przy marży 8 zł na sztuce to 1440 zł na zmianę, a przy dwóch zmianach przez 250 dni w roku 720 tys. zł rocznie. Ta kwota jest prawdziwa tylko wtedy, gdy maszyna jest wąskim gardłem i są zamówienia na te sztuki.

Ten sam warunek dotyczy rachunku z materiału DSR, według którego przejście z 60 do 85% OEE daje 42% więcej produkcji. Autor sam zastrzega, że chodzi o maszynę krytyczną, na której wyroby jest popyt [@itwiz]. Dodaj trzeci warunek: oba wyniki trzeba policzyć według tej samej karty. Sprawdź te warunki, zanim odłożysz zakup maszyny albo obiecasz zarządowi więcej sztuk. Gdy centrala grupy albo audytor klienta stawia ci cel 85%, najpierw poproś o ich kartę definicji.

Gdy przejdziesz na arkusz, który pokazuje straty, wynik spadnie, czasem o kilkanaście, a nawet kilkadziesiąt punktów. Uprzedź o tym zarząd i przez kwartał pokazuj na jednym wykresie obie linie, według starej i nowej karty.

Wróćmy do trzech arkuszy z początku. Żaden nie był błędny w rachunku, ale tylko pierwszy pokazuje jako straty zarówno przezbrojenia, jak i wolne tempo. Naprawdę błędny byłby dopiero czwarty: taki, w którym co miesiąc liczy się trochę inaczej. OEE pokaże ci, gdzie maszyna traci minuty. Jak wypadasz na tle świata, z niego nie wyczytasz.
