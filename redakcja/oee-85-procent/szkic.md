## W skrócie

**Problem.** Wynik OEE (całkowitej efektywności urządzeń) porównuje się z liczbą 85%, nazywaną „światową klasą” [@vorne-wc], albo z wynikiem innego zakładu. Tymczasem ta sama zmiana daje bardzo różne wyniki, zależnie od tego, kto i jak liczy.

**Dlaczego.** W TPM (kompleksowym utrzymaniu ruchu) liczba 85% jest celem, do którego zakład ma dojść dzięki usprawnieniom [@jipm]. Zmierzone średnie są niższe, a wynik zależy od tego, co uznasz za czas planowany i jaki cykl przyjmiesz za idealny [@andersson].

**Co zrobić.** Spisz kartę definicji OEE, porównuj maszynę z nią samą i mów o stratach w minutach.

## Jedna zmiana, trzy wyniki z tego samego wzoru

Poniedziałkowa odprawa (scena i liczby są fikcyjne). Inżynier utrzymania ruchu, kierownik zmiany i planista przynoszą OEE tej samej zmiany na tej samej maszynie, każdy ze swojego arkusza: 56, 68 i 91%. Nikt nie pomylił się w rachunku. Różnicę robią tylko dwie decyzje: co wliczyć do czasu planowanego i jaki cykl uznać za idealny.

Zmiana trwała osiem godzin, w tym pół godziny przerwy i pół godziny planowanej konserwacji. Dwa przezbrojenia zajęły 50 minut, awaria 20. Maszyna zrobiła 520 sztuk, z czego 505 dobrych. Producent podaje cykl 30 sekund na sztukę, a norma czasu w systemie ERP to 40 sekund.

![Wykres słupkowy: OEE tej samej zmiany w trzech arkuszach. Inżynier utrzymania ruchu: przezbrojenia i konserwacja to strata, cykl producenta 30 s, wynik 56%. Kierownik zmiany: przezbrojenia i konserwacja wyłączone z czasu planowanego, cykl producenta 30 s, wynik 68%. Planista: przezbrojenia i konserwacja wyłączone z czasu planowanego, norma czasu z ERP 40 s, wynik 91%. Przerywana linia oznacza 85%.](../../assets/rysunki/oee-85-procent-1.svg "Rysunek 1. Ta sama zmiana ma OEE od 56 do 91% zależnie od dwóch decyzji w definicji. Dane fikcyjne, rachunek redakcji.")

Inżynier liczy przezbrojenia i konserwację jako stratę i bierze cykl producenta. Dostępność wynosi u niego 77,8%, wydajność 74,3%, jakość 97,1%, a OEE 56%. Kierownik zmiany wyłącza przezbrojenia i konserwację z czasu planowanego, bo przecież były w planie, więc dostępność rośnie do 94,6%, a OEE do 68%. Planista robi to samo, ale bierze normę czasu z ERP. Wydajność skacze do 99%, a OEE do 91%, powyżej „światowej klasy”.

Najbliżej klasycznego TPM jest arkusz inżyniera, bo przezbrojenie i regulacja to w TPM jedna z sześciu dużych strat [@jipm]. Planową konserwację TPM wyłącza jednak z czasu planowanego [@jonsson], więc arkusz liczony dokładnie według TPM dałby 60%. Arkusz kierownika mierzy maszynę w czasie, który zostaje po przezbrojeniach. Arkusz planisty sprawdza raczej, czy maszyna nadąża za planem, niż ile traci.

Kłopot w tym, że każda z tych liczb trafi potem do porównania z 85%, a z tej liczby wylicza się, ile zakład mógłby zyskać. W materiale sponsorowanym firmy DSR, dostawcy systemów IT dla produkcji, czytamy, że przejście z 60 do 85% OEE daje 42% więcej produkcji [@itwiz]. Liczbę 85% jako wzorzec podaje też rozdział książki wydanej przez AGH: „światowym standardem jest wskaźnik OEE na poziomie 85%”, a za pożądany uznaje wynik około 60% [@agh].

Jeśli nie wiesz, jak policzono wynik, takie porównanie mówi niewiele. Sens ma dopiero porównanie tej samej maszyny liczonej według jednej, spisanej definicji. Pod koniec tekstu znajdziesz kartę takiej definicji i gotową odpowiedź dla zarządu.

## 85% to cel, który wyznaczyli twórcy TPM

Liczba 85% pochodzi z japońskiego ruchu TPM. Najstarsze źródło, do którego dotarliśmy, to wydana w 1982 r. książka japońskiego instytutu utrzymania ruchu JIPM pod redakcją Seiichiego Nakajimy. Kunio Shirose pisze w niej, że w firmach badanych przez instytut efektywność urządzeń wynosiła średnio od 40 do 60%, a działania TPM mogą ją podnieść nawet do 85–95% [@jipm].

Same 85% to iloczyn trzech celów przypisywanych Nakajimie: dostępności ponad 90%, wydajności ponad 95% i jakości ponad 99%. Szwedzcy badacze piszą, że Nakajima uważał taki wynik za dobry punkt odniesienia dla możliwości typowego zakładu [@jonsson]. Vorne, producent systemów do pomiaru OEE, opisuje te liczby jako minimum, do którego według Nakajimy firmy powinny dążyć. Dodaje, że według Nakajimy wszystkie zakłady nagrodzone w Japonii za wdrożenie TPM miały OEE powyżej 85% [@vorne-wc].

Nagrodzone zakłady to jednak zwycięzcy konkursu, a ich wyniki znamy tylko z relacji dostawcy. Ile zakładów naprawdę przekracza 85%, nie wiadomo, bo badań z opisaną próbą nie znaleźliśmy. Dostawca oprogramowania Evocon na danych z ponad 3,5 tys. maszyn z lat 2023–2024 podaje, że około 6% firm, ale nie opisuje, jak liczy OEE [@evocon]. Vorne zastrzega też, że 85% dotyczy produkcji dyskretnej, czyli liczonej w sztukach, i ma korzenie w japońskiej motoryzacji lat 70. [@vorne-wc]. Na stronie z pytaniami i odpowiedziami ta sama firma nazywa 85% wygodnym, przekonującym i zupełnie sztucznym punktem odniesienia [@vorne-faq].

## Zmierzone średnie są dalekie od 85%

Porządnych badań wielu zakładów jest niewiele, a najlepsze, jakie znaleźliśmy, pochodzą ze Szwecji. W badaniu 884 maszyn z 23 firm, prowadzonym w latach 2013–2014, średnie OEE wyniosło 65%, a mediana 70% [@hedman]. W danych z 98 szwedzkich firm z lat 2006–2012 średnia wyniosła 51,5% [@ylipaa] [@bokrantz], a w badaniu około 20 przypadków opisanym w 1998 r. około 55% [@ljungberg].

Nawet te średnie mogą być zawyżone. W badaniu 884 maszyn aż 702 miały wpisaną wydajność 100%, a 796 jakość 100%. To wartość domyślna systemu, a autorzy uważają za mało prawdopodobne, by tyle maszyn naprawdę pracowało bez tych strat. Pytają nawet, czy firmy mierzą OEE, czy tylko dostępność [@hedman].

Tych liczb nie uśredniaj i nie traktuj jak nowej normy, bo badania różnią się metodą, latami i próbą. W Polsce znaleźliśmy jedynie studia pojedynczych maszyn. W jednym dzienne OEE wahało się w ciągu tygodnia od 46 do 83% [@agh], w drugim średnia z 31 dni wyniosła 78,9% [@jagusiak]. Wniosek jest skromny: przeciętny zmierzony wynik leży wyraźnie poniżej 85%.

## Wynik zależy od definicji tak samo jak od maszyny

Pierwsza decyzja dotyczy czasu planowanego. Czy przezbrojenie, planowana konserwacja i przerwa mają obniżać wynik? W szwedzkich ankietach z 2001 i 2014 r. mniej niż połowa respondentów podała, że ich firma rejestruje przezbrojenie jako zakłócenie produkcji. Tymczasem niemal każda definicja OEE od początku liczy je jako stratę [@bokrantz]. Autorzy studium przypadku z 2011 r. piszą, że wzór OEE jest w zasadzie jeden. Różnie interpretuje się jednak, co jest czasem planowanym, a co nieplanowanym, i jaki cykl uznać za idealny [@andersson].

Druga decyzja to cykl idealny. Do wyboru jest cykl producenta albo czas z programu CNC, najkrótszy zmierzony albo norma czasu z ERP. Im wolniejszy cykl przyjmiesz, tym wyższa wydajność i całe OEE. Wynik zniekształca też jedna norma dla wszystkich wyrobów. W studium z AGH zakład nie określał normy czasu dla każdego wyrobu, więc autorzy przyjęli dla wyrobów o różnej trudności jedno średnie tempo: 2000 sztuk na godzinę. Sami piszą, że to uproszczenie znacząco zaniża wydajność, a wynik kolejnego tygodnia może się wyraźnie zmienić, gdy maszyna będzie robić inne wyroby [@agh].

OEE potrafi nawet spaść, gdy linia robi więcej. We wspomnianym studium przypadku zmiana testu i nowe urządzenie skróciły cykl idealny półautomatycznej linii montażowej z 26 do 22 sekund. Dotychczasowe przestoje zostały, więc OEE spadło z 86 do 79%, a linia zaczęła robić 130 zamiast 118 sztuk na godzinę [@andersson]. Kto patrzy tylko na OEE, uzna usprawnienie za pogorszenie. Gdyby zakład przeliczył historię nowym cyklem, dawne 86% zamieniłoby się w około 73% (rachunek redakcji: 86% × 22/26), a wykres pokazałby wzrost do 79%.

Norma ISO też nie rozstrzyga sprawy. Włoscy badacze, którzy przeanalizowali ISO 22400-2 z 2014 r., piszą, że podaje ona dwie definicje OEE, które wydają się rozbieżne ze sobą i z ujęciem Nakajimy [@schiraldi]. Sama norma czeka na nowe wydanie [@iso].

## Własny wynik rozpisz na minuty

Procent nie mówi, gdzie uciekają minuty. Rozpiszmy arkusz inżyniera (dane fikcyjne):

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

Podobny obraz dało badanie około 20 przypadków: dominowały w nim straty wydajności, choć uwagę skupiają długie przestoje z powodu awarii [@ljungberg]. Już podręcznik JIPM ostrzegał, że straty prędkości zwykle się przeocza, a krótkie zatrzymania trudno zmierzyć [@jipm]. Firmy ze szwedzkiego badania 884 maszyn w ogóle nie rejestrowały prędkości maszyn [@hedman]. Jeśli twoja wydajność od miesięcy wynosi równo 100%, to raczej znak, że nikt jej nie mierzy albo cykl idealny jest za wolny.

## Karta definicji OEE to osiem spisanych decyzji

Dla każdej maszyny albo linii spisz na jednej kartce, jak liczysz, także jeśli liczysz OEE od lat. Przy każdej decyzji podajemy ustawienie, od którego warto zacząć:

1. **Czas planowany.** Od długości zmiany po odjęciu przerw czy od całej doby? Czas bez zleceń wyłącz z czasu planowanego i pokazuj osobno, w godzinach. Inaczej tydzień z mniejszą liczbą zamówień obniży OEE, choć maszyna pracowała tak samo [@deron].
2. **Przezbrojenia.** Strata dostępności czy czas wyłączony z planu? Jeśli chcesz je skracać, zostaw je w stratach: tylko wtedy widać je w wyniku i zespół ma powód do usprawnień [@bokrantz]. Do przezbrojenia zalicz wymianę narzędzi, regulację pod nowy wyrób i braki przy rozruchu, bo tak tę stratę opisuje TPM [@jipm].
3. **Konserwacja planowana, sprzątanie, odprawy.** Ta sama decyzja co przy przezbrojeniach, osobno dla każdego zdarzenia. Na start zostaw w stratach wszystko, co chcesz skracać.
4. **Brak operatora i materiału.** Gdy maszyna stoi, bo operator obsługuje drugą albo brakuje materiału, to przestój, choć nie z winy maszyny. Vorne zalicza takie przyczyny do nieplanowanych postojów [@vorne-straty]. Licz je w stratach, ale z osobnym kodem przyczyny, żeby było widać, które straty leżą po stronie maszyny, a które po stronie organizacji.
5. **Cykl idealny.** Osobno dla każdego wyrobu. W TPM punktem odniesienia jest prędkość, na którą maszynę zaprojektowano, a celem dojście do niej i jej przekroczenie [@jipm]. Na start weź więc cykl producenta albo czas z programu CNC, a jeśli maszyna pracuje szybciej, najkrótszy cykl zmierzony na kilkunastu kolejnych sztukach. Przy setkach indeksów zacznij od kilkunastu, które zajmują maszynie najwięcej godzin. Norma czasu z ERP, jeśli zawiera zapas czasu, zawyży wynik tak jak w arkuszu planisty.
6. **Dobra sztuka.** Czy sztuka po przeróbce liczy się jako dobra? W TPM przeróbka to strata jakości, tak jak brak [@jipm], więc za dobre licz tylko sztuki dobre za pierwszym razem.
7. **Krótkie zatrzymania.** Od ilu minut zatrzymanie liczysz jako przestój, a krótsze tylko jako spadek wydajności? Vorne radzi powiązać ten próg z zasadą wpisywania przyczyn: na przykład każde zatrzymanie dłuższe niż dwie minuty dostaje przyczynę i liczy się jako przestój [@vorne-straty].
8. **Źródło danych.** Licznik i czujnik maszyny czy ręczny zapis operatora? Przy ręcznym zapisie krótkie zatrzymania i część przestojów łatwo pominąć [@muchiri]. Zaznacz to na karcie i nie porównuj takiego wyniku z danymi z czujników.

Potem policz OEE za ostatni miesiąc w dwóch albo trzech arkuszach. Jeśli OEE ma prowadzić do usprawnień, wybierz ten, który pokazuje straty, nawet jeśli daje niższą liczbę. Zapisz go na karcie i przelicz nim historię. Od tej chwili wynik zmienia się tylko wtedy, gdy zmienia się coś na hali: praca maszyny albo asortyment.

Kartę daj do zatwierdzenia komuś, kogo nie rozlicza się z OEE, na przykład kontrolingowi. Każdą późniejszą zmianę definicji zapisz z datą i przelicz według niej co najmniej poprzedni kwartał. Kartę dołączaj do każdego raportu z OEE.

## Zacznij od maszyny, która ogranicza linię

Wybierz maszynę, przed którą rośnie kolejka, a za którą inne czekają. Tylko tam odzyskana minuta daje więcej sztuk na końcu linii. To ona wyznacza, ile linia wyprodukuje, dlatego Vorne radzi właśnie na niej mierzyć OEE całej linii [@vorne-faq]. W produkcji gniazdowej, gdzie wąskie gardło wędruje razem z asortymentem, weź maszynę, która ogranicza produkcję najczęściej, i porównuj tygodnie o podobnym asortymencie.

Na ręcznym montażu tempo wyznaczają ludzie, a nie maszyna, więc OEE stanowiska mówi niewiele. Tam licz wprost minuty strat: czekanie na części, poprawki, przezbrojenia i przestoje z braku ludzi.

Wypełnij kartę i pokaż zespołowi różnicę między arkuszami. Potrzebujesz rejestru przestojów z czasem i przyczyną, licznika sztuk dobrych i wadliwych oraz cyklu idealnego dla każdego wyrobu. Jeśli rejestr nie odróżnia przezbrojeń od awarii i krótkich zatrzymań, popraw go, zanim zaczniesz mówić o procentach. Cel zapisz w minutach jednej straty: zamiast „podnieść OEE o pięć punktów do marca” napisz „przezbrojenia z 50 do 35 minut na zmianę do marca”.

A porównanie z innym zakładem? Ma sens tylko wtedy, gdy oba liczą tak samo. Autorzy wspomnianego studium przypadku piszą, że obliczenia muszą być wtedy ustandaryzowane [@andersson]. Bez tego porównujesz arkusze, nie maszyny.

Nawet przy wspólnej karcie OEE zależy od otoczenia maszyny. W przykładzie liczbowym z analizy z 2006 r. ta sama maszyna liczona od pełnego tygodnia miała OEE 47% przy mniejszym obciążeniu i 59% przy większym. Tempo i jakość pracy były przy tym identyczne. Autorzy wnioskują, że OEE nie nadaje się do porównywania ze sobą pojedynczych maszyn [@deron]. Najpewniejsze jest więc porównanie maszyny z nią samą.

## Co powiedzieć zarządowi, który pyta, dlaczego nie 85%

Wystarczą trzy zdania. Pierwsze: 85% to cel z programu TPM [@jipm], a w szwedzkim badaniu 884 maszyn z lat 2013–2014 średnia wynosiła 65%, choć większość maszyn miała domyślnie wpisaną wydajność 100% [@hedman]. Drugie: nasz wynik liczymy według spisanej karty i porównujemy z naszym wynikiem sprzed miesiąca. Trzecie: największa strata to tyle a tyle minut na zmianę, czyli tyle sztuk i tyle złotych, i to ją teraz zmniejszamy.

W naszym przykładzie (dane fikcyjne) trzecie zdanie brzmiałoby tak: wolniejsze tempo i krótkie zatrzymania zabierają 90 minut na zmianę, czyli 180 sztuk. Przy marży 8 zł na sztuce to 1440 zł na zmianę, a przy dwóch zmianach przez 250 dni w roku 720 tys. zł rocznie. Tyle zyskasz naprawdę tylko wtedy, gdy maszyna jest wąskim gardłem i są zamówienia na te sztuki.

Ten sam warunek dotyczy rachunku z materiału DSR, według którego przejście z 60 do 85% OEE daje 42% więcej produkcji. Autor sam zastrzega, że chodzi o maszynę krytyczną, na której wyroby jest popyt [@itwiz]. Dodaj trzeci warunek: oba wyniki trzeba policzyć według tej samej karty. Sprawdź je, zanim odłożysz zakup maszyny albo obiecasz zarządowi więcej sztuk. Gdy centrala grupy albo audytor klienta stawia ci cel 85%, najpierw poproś o ich kartę definicji.

Gdy przejdziesz na arkusz, który pokazuje straty, wynik spadnie, czasem o kilkanaście, a nawet kilkadziesiąt punktów. Uprzedź o tym zarząd i przez kwartał pokazuj na jednym wykresie obie linie, według starej i nowej karty.

Wróćmy na poniedziałkową odprawę. Żaden z trzech arkuszy nie był błędny w rachunku, ale tylko arkusz inżyniera pokazuje jako straty zarówno przezbrojenia, jak i wolne tempo. Naprawdę błędny byłby dopiero czwarty: taki, w którym co miesiąc liczy się trochę inaczej. OEE pokaże ci, gdzie maszyna traci minuty. Jak wypadasz na tle świata, z niego nie wyczytasz.
