## W skrócie

**Problem.** Wynik OEE porównuje się z liczbą 85%, nazywaną „światową klasą” [@vorne-wc], albo z wynikiem innego zakładu. Tymczasem ta sama zmiana może mieć 56 albo 91%, zależnie od tego, jak się liczy (przykład na danych fikcyjnych).

**Dlaczego.** W literaturze TPM 85% to postulat, czyli wynik, do którego zakład ma dojść dzięki usprawnieniom [@jipm]. Zmierzone średnie są niższe, a wynik zależy od tego, co uznasz za czas planowany i jaki cykl przyjmiesz za idealny [@andersson].

**Co zrobić.** Spisz kartę definicji OEE, porównuj maszynę z nią samą i mów o stratach w minutach.

## Jedna zmiana, trzy wyniki z tego samego wzoru

Trzy osoby liczą OEE tej samej zmiany na tej samej maszynie, każda w swoim arkuszu. Wychodzi im 56, 68 i 91%. Żadna nie pomyliła się w rachunku. Różnią je tylko dwie decyzje: co jest czasem planowanym i jaki cykl uznać za idealny (przykład na danych fikcyjnych).

Oto ta zmiana. Trwała osiem godzin, w tym pół godziny przerwy i pół godziny planowanej konserwacji. Dwa przezbrojenia zajęły 50 minut, awaria 20. Maszyna zrobiła 520 sztuk, z czego 505 dobrych. Producent podaje, że robi sztukę w 30 sekund, a w planie produkcji przyjęto 40 sekund.

Pierwszy arkusz traktuje przezbrojenia i konserwację jako stratę i bierze cykl producenta: wychodzi 56%. Drugi wyłącza przezbrojenia i konserwację z czasu planowanego, bo przecież były w planie, i pokazuje 68%. Trzeci robi to samo, ale bierze cykl z planu produkcji. Ma 91%, czyli więcej niż „światowa klasa” (dane fikcyjne, rysunek 1).

![Wykres słupkowy: OEE tej samej zmiany w trzech arkuszach. Arkusz 1: przezbrojenia i konserwacja to strata, cykl producenta 30 s, wynik 56%. Arkusz 2: przezbrojenia i konserwacja poza planem, cykl producenta 30 s, wynik 68%. Arkusz 3: przezbrojenia i konserwacja poza planem, cykl z planu produkcji 40 s, wynik 91%. Przerywana linia oznacza 85%.](../../assets/rysunki/oee-85-procent-1.svg "Rysunek 1. Ta sama zmiana ma OEE od 56 do 91% zależnie od dwóch decyzji w definicji. Dane fikcyjne, rachunek redakcji.")

Tylko pierwszy arkusz liczy przezbrojenie jako stratę, tak jak klasyczne TPM, w którym przezbrojenie i regulacja to jedna z sześciu dużych strat [@jipm]. Drugi mierzy maszynę w czasie, który zostaje po przezbrojeniach. Trzeci sprawdza raczej, czy maszyna nadąża za planem, niż ile traci.

Ta różnica ma konsekwencje. Liczba 85% krąży jako wzorzec nawet w opracowaniach akademickich. W rozdziale wydanym przez AGH czytamy, że „światowym standardem jest wskaźnik OEE na poziomie 85%” [@agh]. Tymczasem w literaturze TPM to postulat, zmierzone średnie są dużo niższe, a badania, które je podają, różnią się metodą. Dopóki nie wiesz, jak policzono wynik, porównanie z 85% albo z innym zakładem mówi niewiele. Sens ma dopiero ta sama maszyna liczona według tej samej, spisanej definicji.

## Składowe OEE to ułamki, w których coś przyjęto

OEE to iloczyn dostępności, wydajności i jakości. W pierwszym arkuszu (dane fikcyjne) maszyna pracowała 350 z 450 minut czasu planowanego, więc dostępność wynosi 77,8%. W tym czasie zrobiła 520 sztuk, a w cyklu producenta zrobiłaby 700, stąd wydajność 74,3%. Dobrych sztuk było 97,1%. Iloczyn daje 56,1%, dokładnie tyle, co 505 dobrych sztuk razy 30 sekund, podzielone przez 450 minut.

Każda składowa zawiera decyzję. Dostępność zależy od tego, co wliczysz do czasu planowanego, wydajność od przyjętego cyklu idealnego, jakość od definicji dobrej sztuki. Drugi arkusz skrócił mianownik do 370 minut i podniósł tylko dostępność. Trzeci wydłużył cykl idealny do 40 sekund i wydajność skoczyła do 99%. Ponieważ składowe się mnoży, nawet wysokie wyniki cząstkowe dają skromną całość: trzy razy po 90% to 73% OEE (przykład liczbowy).

## 85% to postulat z programu TPM, nie opis typowego zakładu

Liczba pochodzi z japońskiego ruchu TPM (Total Productive Maintenance, kompleksowe utrzymanie ruchu). Najstarsze źródło, do którego dotarliśmy, to książka o wdrażaniu TPM pod redakcją Seiichiego Nakajimy, wydana po angielsku w 1989 r. Kunio Shirose pisze w niej, że w firmach badanych przez japoński instytut utrzymania ruchu JIPM efektywność urządzeń wynosiła średnio od 40 do 60%. Działania TPM mogą ją według niego podnieść nawet do 85–95% [@jipm].

Jonsson i Lesshammar przytaczają za wcześniejszym opracowaniem, że według Nakajimy w idealnych warunkach dostępność powinna przekraczać 90%, wydajność 95%, a jakość 99%. Iloczyn daje około 85%, a Nakajima miał uważać taki wynik za dobry punkt odniesienia dla typowych możliwości zakładu [@jonsson]. Vorne, producent systemów do pomiaru OEE, pisze, że Nakajima podał te wartości w książce z 1984 r. na podstawie własnego doświadczenia jako minimum, do którego firmy powinny dążyć. Według Vorne Nakajima zauważył też, że wszystkie zakłady nagrodzone w Japonii za udane wdrożenie TPM miały OEE powyżej 85% [@vorne-wc].

Dla twórców TPM 85% było więc postulatem: minimum, które zakład powinien osiągnąć dzięki programowi. Nie było opisem tego, ile zakłady mają, bo w tym samym tekście JIPM podaje zmierzone 40–60% [@jipm]. Vorne zastrzega, że liczby dotyczą produkcji dyskretnej (nie procesowej) i mają korzenie w Japonii lat 70. i w przemyśle motoryzacyjnym [@vorne-wc]. W odpowiedziach na pytania czytelników ta sama firma nazywa 85% wygodnym, przekonującym i zupełnie sztucznym punktem odniesienia [@vorne-faq].

## Zmierzone średnie są dalekie od 85%, choć badania różnią się metodą

Badań, które mierzą OEE w wielu zakładach według opisanej metody, jest mało, a najlepsze, jakie znaleźliśmy, pochodzą ze Szwecji. Hedman, Subramaniyan i Almström zebrali automatyczne pomiary z 884 maszyn w 23 szwedzkich firmach, klientach jednego dostawcy systemu pomiarowego, od października 2013 do marca 2014 r. Średnie OEE wyniosło 65%, a mediana 70%. W grupach branż średnie wahały się od 59 do 74%, najwyżej w żywności i napojach [@hedman].

Ylipää i współpracownicy zebrali dane OEE z 98 szwedzkich firm z lat 2006–2012 [@ylipaa]. Średnia z tych danych, podana w pracy tego samego zespołu, wynosi 51,5% [@bokrantz]. Ljungberg, który przeanalizował około 20 przypadków, podał OEE w okolicach 55% [@ljungberg].

Tych średnich nie należy uśredniać ani traktować jak nowej normy, bo badania różnią się metodą, latami i próbą. W danych Hedmana i współautorów 702 z 884 maszyn miały wpisaną wydajność 100%, a 796 jakość 100%, w większości jako wartość domyślną systemu. Z czasu planowanego wyłączono przy tym między innymi weekendy, planowaną konserwację, przerwy i spotkania. Sami autorzy pytają, czy firmy mierzą OEE, czy tylko dostępność [@hedman]. Z tych liczb wynika jedno: przeciętny zmierzony wynik leży wyraźnie poniżej 85%.

To dane ze szwedzkich zakładów sprzed ponad dekady, w największym badaniu z firm, które mierzą automatycznie. W Polsce nie znaleźliśmy badania wielu zakładów z opisaną metodą, tylko studia pojedynczych maszyn. Studium z AGH opisuje maszynę, której dzienne OEE wahało się w ciągu tygodnia od 46 do 83%, średnio 68% [@agh]. Drugie, o mieszadle do emalii w zakładzie farb, podaje średnie OEE z 31 dni pomiarów stoperem: 78,9% [@jagusiak]. Na tej podstawie nie da się mówić o polskiej średniej. Vorne pisze, że większość firm ma OEE bliżej 60%, ale opiera to na doświadczeniu ze współpracy z klientami i nie podaje danych ani metody [@vorne-wc].

## Wynik zależy od definicji tak samo jak od maszyny

Pierwsza decyzja dotyczy czasu planowanego: czy przezbrojenie, planowana konserwacja i przerwa obniżają wynik. Firmy podchodzą do tego różnie. Bokrantz i współautorzy pytali o rejestrowanie zakłóceń produkcji w dwóch ankietach: w 80 szwedzkich firmach w 2001 r. i w 71 w 2014 r. Wymianę narzędzi i przezbrojenie rejestrowała jako zakłócenie mniej niż połowa respondentów, a przerwy mniej niż co czwarty [@bokrantz].

Ankieta nie pytała wprost o OEE. Pokazuje jednak, że wiele firm nie traktuje przezbrojenia jako zakłócenia, choć według autorów jest ono w niemal każdej definicji OEE od jej początków [@bokrantz]. Andersson i Bellgran piszą wprost, że wzór OEE jest w zasadzie jeden, ale jego składniki interpretuje się różnie. Chodzi właśnie o to, co jest czasem planowanym, a co nieplanowanym, i jaki cykl uznać za idealny [@andersson].

Druga decyzja to cykl idealny: cykl producenta, najkrótszy zmierzony albo cykl z planu produkcji. Im wolniejszy cykl przyjmiesz, tym wyższa wydajność i całe OEE. Wynik zniekształca też jeden cykl dla wszystkich wyrobów. W studium z AGH zakład przyjmował jeden średni cykl normatywny dla wyrobów o różnej trudności wykonania, a autorzy piszą, że to uproszczenie znacząco zaniża wydajność. Dodają, że przy takich założeniach wynik w kolejnym tygodniu może się znacząco zmienić w zależności od produkowanych wyrobów [@agh].

Zdarza się nawet, że OEE spada, choć linia robi więcej. Andersson i Bellgran opisali półautomatyczną linię montażową, na której usprawnienie skróciło cykl idealny z 26 do 22 sekund. Dotychczasowe przestoje zostały, więc OEE spadło z 86 do 79%, a linia zaczęła robić 130 zamiast 118 sztuk na godzinę [@andersson]. Gdyby zakład przeliczył historię nowym cyklem, te same 118 sztuk na godzinę dałyby około 72% (rachunek redakcji: 118 × 22 s / 3600 s). Zmiana pokazałaby wtedy wzrost do 79%. Kto patrzy tylko na OEE, uzna dobrą zmianę za pogorszenie.

Norma też nie rozstrzyga sprawy. ISO 22400-2 z 2014 r. opisuje wskaźniki zarządzania operacjami produkcyjnymi, ale według analizy Schiraldiego i Varisco podaje dwie definicje OEE, niespójne ze sobą i z ujęciem Nakajimy [@schiraldi]. Sama norma czeka na nowe wydanie [@iso]. Jonsson i Lesshammar pisali już w 1999 r., że przez różne definicje trudno porównywać OEE między firmami. Przytoczyli pomiary od 30 do 80% i uznali, że tak rozbieżne liczby pokazują, jak trudno porównywać OEE różnych procesów [@jonsson].

## Porównanie ma sens, gdy definicja jest wspólna

Z tego nie wynika, że OEE jest bezużyteczne albo że 85% jest nieosiągalne. Wysokie wyniki się zdarzają. Znane przykłady niewiele jednak mówią o tym, jak często. Nagrodzone japońskie zakłady to zwycięzcy konkursu, nie wszystkie firmy z TPM, i znamy je tylko z relacji dostawcy [@vorne-wc]. Linia Anderssona i Bellgran miała 86% przy cyklu idealnym, który okazał się za wolny [@andersson].

Badań z opisaną próbą, które mówiłyby, ile zakładów przekracza 85%, nie znaleźliśmy. Według danych dostawcy oprogramowania Evocon, zebranych z ponad 3,5 tys. maszyn w ponad 50 krajach w latach 2023–2024, bez opisu definicji, robi to około 6% firm [@evocon].

Za liczbą 85% przemawia jedno: ambitny cel nie pozwala spocząć na laurach. Vorne pisze, że dla wielu firm 85% może być odpowiednim celem długoterminowym [@vorne-lp]. To się broni pod dwoma warunkami. Cel dotyczy tej samej maszyny liczonej według tej samej definicji, a droga do niego prowadzi przez konkretne straty. Bez tych warunków 85% staje się normą, którą łatwiej spełnić w arkuszu niż na hali.

Porównanie dwóch zakładów też może mieć sens. Andersson i Bellgran piszą, że obliczenia muszą być wtedy wykonane w ten sam, ustandaryzowany sposób [@andersson]. W praktyce oznacza to ten sam czas planowany, ten sam rodzaj cyklu idealnego i te same zasady liczenia dobrych sztuk. Bez tego porównujesz arkusze, nie maszyny.

Dwóch granic definicja nie usunie. Pierwsza: OEE nie mówi, czy maszyna jest wąskim gardłem. Wyższe OEE maszyny, która i tak czeka na poprzednią, nie da ani jednej sztuki więcej na końcu linii.

Druga: gdy czas bez zleceń wchodzi do mianownika, wynik zależy od popytu. De Ron i Rooda policzyli na przykładzie liczbowym jedną maszynę w pełnym tygodniu, czyli w 168 godzinach. Przy mniejszym obciążeniu miała OEE 47%, przy większym 59%, choć tempo i jakość były identyczne. Autorzy wnioskują, że OEE zawiera wpływ otoczenia maszyny i nie nadaje się do porównywania pojedynczych maszyn [@deron]. Dla porównań tej samej maszyny w czasie wynika z tego praktyczna zasada: czas bez zleceń trzymaj poza czasem planowanym i pokazuj osobno.

## Własny wynik czytaj w minutach, nie w procentach

Procent mówi, ile tracisz, ale nie gdzie. Rozpiszmy na minuty pierwszy arkusz z naszego przykładu (dane fikcyjne). Z 450 minut czasu planowanego maszyna stała przez 100: 50 minut trwały przezbrojenia, 30 konserwacja, a 20 awaria. W pozostałych 350 minutach zrobiła 520 sztuk, choć w cyklu producenta zajęłoby jej to 260 minut. Kolejne 90 minut zjadło więc wolniejsze tempo i krótkie zatrzymania, których nikt nie zapisał jako przestoju.

Na braki poszło 7,5 minuty. Zostaje 252,5 minuty pracy w pełni produktywnej, czyli właśnie 56,1%. Te 90 minut to 180 sztuk, które maszyna zrobiłaby w cyklu producenta. Pomnóż je przez marżę na wyrobie, a dostaniesz kwotę, którą da się pokazać zarządowi.

Przykład ułożyliśmy tak, żeby przypominał to, co opisują badania: wolniejsze tempo i krótkie zatrzymania kosztują tu więcej niż przezbrojenia i awaria razem. Ljungberg pisał, że w analizowanych przypadkach dominowały straty wydajności [@ljungberg]. W danych z 98 szwedzkich firm największy wpływ na OEE miały straty sprawności operacyjnej (w oryginale: operational efficiency), a dopiero po nich straty dostępności [@ylipaa]. W danych Hedmana i współautorów tej straty w większości nie mierzono, skoro 702 z 884 maszyn miały wpisaną wydajność 100% [@hedman]. Jeśli twoja wydajność od miesięcy wynosi równo 100%, to raczej znak, że nikt jej nie mierzy albo cykl idealny jest za wolny, niż że maszyna pracuje idealnie.

## Karta definicji OEE to siedem decyzji przed pierwszym pomiarem

Zanim policzysz pierwszy wynik, spisz na jednej kartce, jak liczysz. Każdą decyzję zapisz osobno dla maszyny albo linii:

1. **Czas planowany.** Od czego liczysz: od długości zmiany po odjęciu przerw czy od całej doby? Jeśli porównujesz maszynę tydzień do tygodnia, wyłącz czas bez zleceń z czasu planowanego i pokazuj go osobno, w godzinach. Inaczej tydzień z mniejszą liczbą zamówień obniży OEE, choć maszyna pracowała tak samo [@deron].
2. **Przezbrojenia.** Strata dostępności czy czas wyłączony z planu? Jeśli chcesz je skracać, zostaw je jako stratę, bo inaczej znikną z wyniku.
3. **Konserwacja planowana, sprzątanie, odprawy.** Ta sama decyzja co przy przezbrojeniach, osobno dla każdego zdarzenia.
4. **Cykl idealny.** Cykl producenta, najkrótszy zmierzony czy cykl z planu produkcji, osobno dla każdego wyrobu. Przy jednym cyklu dla wszystkich wyrobów tydzień z trudniejszymi wyrobami pokaże spadek, którego na hali nie było [@agh].
5. **Dobra sztuka.** Czy sztuka po przeróbce liczy się jako dobra?
6. **Krótkie zatrzymania.** Od ilu minut zatrzymanie jest przestojem, a poniżej jakiego progu obniża tylko wydajność?
7. **Źródło danych.** Licznik i czujnik maszyny czy ręczny zapis operatora? Przy ręcznym zapisie krótkie zatrzymania i część przestojów łatwo pominąć [@muchiri]. Zaznacz to na karcie i nie porównuj takiego wyniku z danymi z czujników.

Potem policz OEE za ostatni miesiąc w dwóch albo trzech arkuszach i wybierz jeden. Jeśli OEE ma prowadzić do usprawnień, wybierz ten, który pokazuje straty, nie ten z najładniejszą liczbą. Zapisz go na karcie i przelicz nim historię. Od tej chwili zmiana wyniku oznacza zmianę na hali, nie w arkuszu.

Kartę zatwierdza ktoś, kogo nie rozlicza się z OEE, na przykład kontroling. Każdą późniejszą zmianę definicji zapisz z datą i przelicz według niej co najmniej poprzedni kwartał, żeby na wykresie nie pojawił się skok, którego nie było na hali. Kartę dołączaj do każdego raportu, w którym pokazujesz OEE.

## Co zrobić w tym tygodniu

Zacznij od maszyny, która ogranicza całą linię: tej, przed którą rośnie kolejka, a za którą inne czekają. Tylko tam odzyskana minuta daje więcej sztuk na końcu linii. Wypełnij dla niej kartę, przelicz ostatni miesiąc w dwóch arkuszach i pokaż zespołowi różnicę.

Potrzebujesz rejestru przestojów z czasem i przyczyną, licznika sztuk dobrych i wadliwych oraz cyklu idealnego dla każdego wyrobu. Jeśli rejestr nie odróżnia przezbrojeń od awarii i krótkich zatrzymań, popraw go, zanim zaczniesz mówić o procentach. Jeśli nie masz cyklu idealnego dla każdego wyrobu, zacznij od wyrobu, który maszyna robi najczęściej, i przyjmij najkrótszy cykl zmierzony na kilkunastu kolejnych sztukach.

Cel zapisz w minutach jednej straty, nie w punktach OEE. Zamiast „70% do marca” napisz „przezbrojenia z 50 do 35 minut na zmianę do marca” (przykład liczbowy). Potem porównuj maszynę z nią samą, tydzień do tygodnia, przy tej samej karcie.

Najdroższy błąd zdarza się przy dużych decyzjach. Rachunek „z 60 do 85% OEE to 42% więcej sztuk” (przykład liczbowy: 85 / 60 ≈ 1,42) działa tylko pod trzema warunkami. Maszyna jest wąskim gardłem, są zamówienia na te sztuki, a oba wyniki policzono według tej samej karty. Sprawdź te trzy warunki, zanim odłożysz zakup maszyny albo obiecasz zarządowi więcej sztuk. A jeśli 85% przychodzi jako cel z centrali grupy albo z audytu klienta, zanim go przyjmiesz, poproś o ich kartę definicji.

Wróćmy do trzech arkuszy z początku. Żaden nie był błędny w rachunku, ale tylko pierwszy pokazuje przezbrojenia i wolne tempo jako straty. Naprawdę błędny byłby dopiero czwarty: taki, w którym co miesiąc liczy się trochę inaczej. OEE mówi, ile tracisz, a nie jak wypadasz na tle świata.
