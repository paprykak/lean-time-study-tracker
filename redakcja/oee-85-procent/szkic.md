## W skrócie

**Problem.** Wynik OEE (całkowitej efektywności wyposażenia) porównuje się z liczbą 85%, nazywaną „światową klasą” [@vorne-wc], albo z wynikiem innego zakładu. Ta sama zmiana może jednak mieć 56 albo 91%, zależnie od tego, jak się liczy (przykład na danych fikcyjnych).

**Dlaczego.** W literaturze TPM (kompleksowego utrzymania ruchu) liczba 85% to cel, do którego zakład ma dojść dzięki usprawnieniom [@jipm]. Zmierzone średnie są niższe, a wynik zależy od tego, co uznasz za czas planowany i jaki cykl przyjmiesz za idealny [@andersson].

**Co zrobić.** Spisz kartę definicji OEE, porównuj maszynę z nią samą i mów o stratach w minutach.

## Jedna zmiana, trzy wyniki z tego samego wzoru

Weźmy jedną zmianę na jednej maszynie i trzy osoby, które liczą jej OEE, każda w swoim arkuszu (to przykład, liczby są fikcyjne). Wychodzi im 56, 68 i 91%. Żadna nie pomyliła się w rachunku. Różnicę robią tylko dwie decyzje: co wliczyć do czasu planowanego i jaki cykl uznać za idealny.

Oto ta zmiana. Trwała osiem godzin, w tym pół godziny przerwy i pół godziny planowanej konserwacji. Dwa przezbrojenia zajęły 50 minut, awaria 20. Maszyna zrobiła 520 sztuk, z czego 505 dobrych. Producent podaje cykl 30 sekund na sztukę, a plan produkcji przyjmuje 40 sekund.

Pierwszy arkusz traktuje przezbrojenia i konserwację jako stratę i bierze cykl producenta: wychodzi 56%. Drugi wyłącza je z czasu planowanego, bo przecież były w planie, i pokazuje 68%. Trzeci robi to samo, ale bierze cykl z planu produkcji. Ma 91%, czyli więcej niż „światowa klasa” (dane fikcyjne, rysunek 1).

![Wykres słupkowy: OEE tej samej zmiany w trzech arkuszach. Arkusz 1: przezbrojenia i konserwacja to strata, cykl producenta 30 s, wynik 56%. Arkusz 2: przezbrojenia i konserwacja poza planem, cykl producenta 30 s, wynik 68%. Arkusz 3: przezbrojenia i konserwacja poza planem, cykl z planu produkcji 40 s, wynik 91%. Przerywana linia oznacza 85%.](../../assets/rysunki/oee-85-procent-1.svg "Rysunek 1. Ta sama zmiana ma OEE od 56 do 91% zależnie od dwóch decyzji w definicji. Dane fikcyjne, rachunek redakcji.")

Tylko pierwszy arkusz liczy jak klasyczne TPM, w którym przezbrojenie i regulacja to jedna z sześciu dużych strat [@jipm]. Drugi mierzy maszynę w czasie, który zostaje po przezbrojeniach. Trzeci sprawdza raczej, czy maszyna nadąża za planem, niż ile traci.

Ta różnica kosztuje, bo wynik zestawia się z 85%, żeby oszacować, ile zakład mógłby zyskać [@itwiz]. Liczbę 85% jako wzorzec podaje nawet rozdział książki wydanej przez AGH: „światowym standardem jest wskaźnik OEE na poziomie 85%” [@agh]. Tymczasem w literaturze TPM to cel, a zmierzone średnie są dużo niższe.

Dopóki nie wiesz, jak policzono wynik, porównanie ze „światową klasą” albo z innym zakładem mówi niewiele. Sens ma dopiero porównanie tej samej maszyny, liczonej zawsze według tej samej, spisanej definicji. Pod koniec tekstu znajdziesz kartę takiej definicji: siedem decyzji do spisania przed pierwszym pomiarem.

## 85% to cel z programu TPM, nie opis typowego zakładu

Liczba 85% pochodzi z japońskiego ruchu TPM. Najstarsze źródło, do którego dotarliśmy, to książka o wdrażaniu TPM pod redakcją Seiichiego Nakajimy. Wydał ją w 1982 r. JIPM, japoński instytut utrzymania ruchu, a po angielsku ukazała się w 1989 r. Kunio Shirose pisze w niej, że w firmach badanych przez JIPM efektywność urządzeń wynosiła średnio od 40 do 60%. Działania TPM mogą ją według niego podnieść nawet do 85–95% [@jipm].

Same 85% to iloczyn celów przypisywanych Nakajimie: dostępności ponad 90%, wydajności ponad 95% i jakości ponad 99%. Według Jonssona i Lesshammara Nakajima uważał ten wynik za dobry punkt odniesienia dla możliwości typowego zakładu [@jonsson]. Według Vorne, producenta systemów do pomiaru OEE, podał go jako minimum, do którego firmy powinny dążyć [@vorne-wc]. To miara możliwości, nie opis stanu. W tych samych latach JIPM mierzył w badanych firmach średnio 40–60% [@jipm].

Vorne dodaje, że według Nakajimy wszystkie zakłady nagrodzone w Japonii za wdrożenie TPM (Distinguished Plant Prize) miały OEE powyżej 85%. Zastrzega też, że te liczby dotyczą produkcji dyskretnej, czyli liczonej w sztukach, i mają korzenie w japońskiej motoryzacji lat 70. [@vorne-wc]. W częstych pytaniach na swojej stronie ta sama firma nazywa 85% wygodnym, przekonującym i zupełnie sztucznym punktem odniesienia [@vorne-faq].

## Zmierzone średnie są dalekie od 85%, choć badania różnią się metodą

Badań OEE w wielu zakładach z opisaną metodą jest mało, a najlepsze, jakie znaleźliśmy, pochodzą ze Szwecji. Hedman, Subramaniyan i Almström przeanalizowali automatyczne pomiary z 884 maszyn w 23 szwedzkich firmach, klientach jednego dostawcy systemu pomiarowego, z okresu od października 2013 do marca 2014 r. Średnie OEE wyniosło 65%, a mediana 70%. Między grupami branż średnie wahały się od 59 do 74%, najwyżej w produkcji żywności i napojów [@hedman].

Ylipää i współautorzy zebrali dane OEE z 98 szwedzkich firm z lat 2006–2012 [@ylipaa], a średnia z tych danych wynosi 51,5% [@bokrantz]. Ljungberg na podstawie około 20 przypadków podał OEE rzędu 55% [@ljungberg]. Vorne ocenia, że większość firm ma OEE bliżej 60%, ale tylko na podstawie współpracy z klientami, bez danych i metody [@vorne-wc].

Nie uśredniaj tych liczb i nie traktuj ich jak nowej normy: badania różnią się metodą, latami i próbą. W danych Hedmana i współautorów 702 z 884 maszyn miały wpisaną wydajność 100%, a 796 jakość 100%. To wartość domyślna systemu, a autorzy uważają za mało prawdopodobne, by tyle maszyn naprawdę pracowało bez tych strat. Pytają nawet, czy firmy mierzą OEE, czy tylko dostępność [@hedman]. Mimo to każda z tych średnich leży wyraźnie poniżej 85%.

To dane szwedzkie, sprzed ponad dekady, a w największym badaniu tylko z firm, które mierzą automatycznie. W Polsce znaleźliśmy jedynie studia pojedynczych maszyn. Studium z AGH opisuje maszynę, której dzienne OEE wahało się w ciągu tygodnia od 46 do 83%, średnio 68% [@agh]. Drugie, o mieszadle do emalii w zakładzie farb, podaje średnie OEE z 31 dni pomiarów stoperem: 78,9% [@jagusiak]. Polskiej średniej z tego nie wyliczysz.

## Wynik zależy od definicji tak samo jak od maszyny

Żeby zobaczyć, skąd biorą się rozbieżności, rozłóżmy pierwszy arkusz z przykładu na składowe. Dostępność wynosi w nim 77,8%, wydajność 74,3%, a jakość 97,1%, co daje 56,1% (dane fikcyjne). Każda składowa zawiera decyzję. Dostępność zależy od tego, co wliczysz do czasu planowanego, wydajność od przyjętego cyklu idealnego, jakość od definicji dobrej sztuki. Drugi arkusz skrócił czas planowany do 370 minut i podniósł tylko dostępność. Trzeci wydłużył cykl idealny do 40 sekund, a wydajność skoczyła do 99%.

Pierwsza decyzja dotyczy czasu planowanego. Czy przezbrojenie, planowana konserwacja i przerwa mają obniżać wynik? Firmy podchodzą do tego różnie. Bokrantz i współautorzy dwa razy zapytali szwedzkie firmy, jak rejestrują zakłócenia produkcji: 80 firm w 2001 r. i 71 w 2014 r. Mniej niż połowa respondentów podała, że ich firma rejestruje wymianę narzędzi i przezbrojenie jako zakłócenie, a w przypadku przerw mniej niż co czwarty [@bokrantz].

Ankieta nie pytała wprost o OEE, ale pokazuje, że wiele firm nie traktuje przezbrojenia jako zakłócenia, choć według autorów od początku uwzględnia je niemal każda definicja OEE [@bokrantz]. Andersson i Bellgran piszą, że wzór OEE jest w zasadzie jeden, ale różnie interpretuje się, co jest czasem planowanym, a co nieplanowanym, i jaki cykl uznać za idealny [@andersson].

Druga decyzja to cykl idealny. Do wyboru jest cykl producenta, najkrótszy zmierzony albo cykl z planu produkcji. Im wolniejszy cykl przyjmiesz, tym wyższa wydajność i całe OEE. Wynik zniekształca też jedno tempo dla wszystkich wyrobów. W studium z AGH zakład nie określał cyklu normatywnego dla każdego wyrobu, więc autorzy przyjęli dla wyrobów o różnej trudności jedno średnie tempo: 2000 sztuk na godzinę. Sami piszą, że to uproszczenie znacząco zaniża wydajność, a wynik kolejnego tygodnia może się wyraźnie zmienić, gdy maszyna będzie robić inne wyroby [@agh].

OEE potrafi nawet spaść, gdy linia robi więcej. Andersson i Bellgran opisali półautomatyczną linię montażową, na której usprawnienie skróciło cykl idealny z 26 do 22 sekund. Dotychczasowe przestoje zostały, więc OEE spadło z 86 do 79%, a linia zaczęła robić 130 zamiast 118 sztuk na godzinę [@andersson]. Gdyby zakład przeliczył historię nowym cyklem, te same 118 sztuk na godzinę dałyby około 72% (rachunek redakcji: 118 × 22 s / 3600 s). Wykres pokazałby wtedy wzrost do 79%. Kto patrzy tylko na OEE, uzna usprawnienie za pogorszenie.

Norma też nie rozstrzyga sprawy. Według analizy Schiraldiego i Varisco ISO 22400-2 z 2014 r. podaje dwie definicje OEE, które wydają się rozbieżne ze sobą i z ujęciem Nakajimy [@schiraldi]. Sama norma czeka na nowe wydanie [@iso]. Jonsson i Lesshammar pisali już w 1999 r., że przez różne definicje i inne okoliczności trudno porównywać OEE między firmami [@jonsson].

## Wysokie OEE się zdarza, tylko nie wiadomo, jak często

Z tego nie wynika, że OEE jest bezużyteczne albo że 85% jest nieosiągalne. Wysokie wyniki się zdarzają. Znane przykłady nie mówią jednak, jak często. Nagrodzone japońskie zakłady to zwycięzcy konkursu, nie wszystkie firmy z TPM, i znamy je tylko z relacji dostawcy [@vorne-wc]. Linia Anderssona i Bellgran miała 86% przy cyklu idealnym, który okazał się za wolny [@andersson].

Badań z opisaną próbą, które mówiłyby, ile zakładów przekracza 85%, nie znaleźliśmy. Dostawca oprogramowania Evocon podaje, że robi to około 6% firm. Dane pochodzą z ponad 3,5 tys. maszyn w ponad 50 krajach z lat 2023–2024, ale firma nie opisuje definicji OEE [@evocon].

Czy 85% nadaje się więc na cel? Tak, bo tak pomyśleli tę liczbę twórcy TPM [@jipm], ale pod dwoma warunkami. Cel ma dotyczyć tej samej maszyny, liczonej zawsze według tej samej definicji, a droga do niego ma prowadzić przez konkretne straty. Bez tych warunków 85% staje się normą, którą łatwiej spełnić w arkuszu niż na hali.

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

Największa strata nie jest tu awarią. Wolniejsze tempo i krótkie zatrzymania kosztują 90 minut, czyli 180 sztuk, które maszyna zrobiłaby w cyklu producenta. Jeśli to wąskie gardło i masz zamówienia na te sztuki, pomnóż je przez marżę na wyrobie. Dostaniesz kwotę, którą zrozumie każdy w zarządzie, także ten, kto nigdy nie liczył OEE.

Przykład ułożyliśmy na wzór badań: tempo i krótkie zatrzymania kosztują w nim więcej niż przezbrojenia i awaria razem. Ljungberg pisał, że w analizowanych przypadkach dominowały straty wydajności, choć uwagę skupiają długie przestoje z powodu awarii [@ljungberg]. Już podręcznik JIPM ostrzegał, że krótkie zatrzymania łatwo przeoczyć, bo trudno je zmierzyć [@jipm]. Firmy z badania Hedmana i współautorów w ogóle nie rejestrowały prędkości maszyn [@hedman]. Jeśli twoja wydajność od miesięcy wynosi równo 100%, to raczej znak, że nikt jej nie mierzy albo cykl idealny jest za wolny, niż że maszyna pracuje idealnie.

## Karta definicji OEE to siedem decyzji przed pierwszym pomiarem

Zanim policzysz pierwszy wynik, spisz na jednej kartce, jak liczysz, osobno dla każdej maszyny albo linii. Przy każdej decyzji podajemy ustawienie, od którego warto zacząć:

1. **Czas planowany.** Od długości zmiany po odjęciu przerw czy od całej doby? Czas bez zleceń wyłącz z czasu planowanego i pokazuj osobno, w godzinach. Inaczej tydzień z mniejszą liczbą zamówień obniży OEE, choć maszyna pracowała tak samo [@deron].
2. **Przezbrojenia.** Strata dostępności czy czas wyłączony z planu? Jeśli chcesz skracać przezbrojenia, zostaw je w stratach: tylko wtedy są widoczne w wyniku i dają bodziec do usprawnień [@bokrantz].
3. **Konserwacja planowana, sprzątanie, odprawy.** Ta sama decyzja co przy przezbrojeniach, osobno dla każdego zdarzenia.
4. **Cykl idealny.** Cykl producenta, najkrótszy zmierzony czy cykl z planu produkcji, osobno dla każdego wyrobu. Przy jednym tempie dla wszystkich wyrobów dzień z trudniejszym wyrobem pokaże spadek wydajności, który wynika z założenia, a nie z pracy maszyny [@agh].
5. **Dobra sztuka.** Czy sztuka po przeróbce liczy się jako dobra? W TPM przeróbka to strata jakości, tak jak brak [@jipm], więc za dobre licz tylko sztuki dobre za pierwszym razem.
6. **Krótkie zatrzymania.** Od ilu minut zatrzymanie liczysz jako przestój, a krótsze tylko jako spadek wydajności? Vorne radzi powiązać ten próg z zasadą wpisywania przyczyn: na przykład każde zatrzymanie dłuższe niż dwie minuty dostaje przyczynę i liczy się jako przestój [@vorne-straty].
7. **Źródło danych.** Licznik i czujnik maszyny czy ręczny zapis operatora? Przy ręcznym zapisie krótkie zatrzymania i część przestojów łatwo pominąć [@muchiri]. Zaznacz to na karcie i nie porównuj takiego wyniku z danymi z czujników.

Potem policz OEE za ostatni miesiąc w dwóch albo trzech arkuszach, a jeśli OEE ma prowadzić do usprawnień, wybierz ten, który pokazuje straty, a nie ten z najładniejszą liczbą. Zapisz go na karcie i przelicz nim historię. Od tej chwili ruch wyniku oznacza, że coś zmieniło się w pracy maszyny.

Kartę daj do zatwierdzenia komuś, kogo nie rozlicza się z OEE, na przykład kontrolingowi. Każdą późniejszą zmianę definicji zapisz z datą i przelicz według niej co najmniej poprzedni kwartał, żeby wykres nie pokazał skoku, którego maszyna nie zrobiła. Kartę dołączaj do każdego raportu z OEE.

## Zacznij od maszyny, która ogranicza linię

Wybierz maszynę, przed którą rośnie kolejka, a za którą inne czekają. Tylko tam odzyskana minuta daje więcej sztuk na końcu linii i właśnie tam, według Vorne, należy mierzyć OEE całej linii [@vorne-faq]. W produkcji gniazdowej, gdzie wąskie gardło wędruje razem z asortymentem, weź maszynę, która ogranicza produkcję najczęściej, i porównuj tygodnie o podobnym asortymencie.

Wypełnij dla niej kartę i pokaż zespołowi różnicę między arkuszami. Potrzebujesz rejestru przestojów z czasem i przyczyną, licznika sztuk dobrych i wadliwych oraz cyklu idealnego dla każdego wyrobu. Jeśli rejestr nie odróżnia przezbrojeń od awarii i krótkich zatrzymań, popraw go, zanim zaczniesz mówić o procentach. Gdy brakuje ci cyklu idealnego, zacznij od wyrobu, który maszyna robi najczęściej, i przyjmij najkrótszy cykl zmierzony na kilkunastu kolejnych sztukach.

Cel zapisz w minutach jednej straty. Zamiast „podnieść OEE o pięć punktów do marca” napisz „przezbrojenia z 50 do 35 minut na zmianę do marca”.

Na pytanie zarządu, dlaczego nie 85%, wystarczą trzy zdania. W literaturze TPM 85% to cel, a nie średnia, a zmierzone średnie są niższe [@jipm]. Nasz wynik liczymy według spisanej karty i porównujemy z naszym wynikiem sprzed miesiąca. Największa strata to tyle a tyle minut na zmianę, czyli tyle sztuk i tyle złotych, i to ją teraz zmniejszamy.

W jednym z polskich artykułów o wskaźnikach produkcji czytamy, że przejście z 60 do 85% OEE daje 42% więcej produkcji [@itwiz]. Arytmetycznie to prawda, ale tylko pod trzema warunkami: maszyna musi być wąskim gardłem, na te sztuki muszą być zamówienia, a oba wyniki trzeba policzyć według tej samej karty. Sprawdź je, zanim odłożysz zakup maszyny albo obiecasz zarządowi więcej sztuk. Gdy centrala grupy albo audytor klienta stawia ci cel 85%, najpierw poproś o ich kartę definicji.

Wróćmy do trzech arkuszy z początku. Żaden nie był błędny w rachunku, ale tylko pierwszy pokazuje przezbrojenia i wolne tempo jako straty. Naprawdę błędny byłby dopiero czwarty: taki, w którym co miesiąc liczy się trochę inaczej. OEE pokaże ci, gdzie maszyna traci minuty. Jak wypadasz na tle świata, z niego nie wyczytasz.
