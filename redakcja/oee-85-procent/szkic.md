## W skrócie

**Problem.** Wynik OEE porównuje się z liczbą 85%, nazywaną „światową klasą” [@vorne-wc], i z wynikami innych zakładów, choć żadne z nich nie jest wzorcem.

**Dlaczego.** Twórcy TPM postawili 85% jako cel dla najlepszych [@jipm], a ta sama zmiana daje bardzo różne OEE zależnie od tego, jak liczysz czas planowany i cykl idealny [@andersson].

**Co zrobić.** Spisz kartę definicji OEE, porównuj maszynę z nią samą i mów o stratach w minutach, a nie w procentach.

## Jedna zmiana, trzy poprawne wyniki

Weźmy jedną ośmiogodzinną zmianę na jednej maszynie (to przykład, liczby są fikcyjne). Maszyna zrobiła 520 sztuk, z czego 505 dobrych. Pół godziny trwała przerwa, drugie pół godziny planowana konserwacja, 50 minut zajęły dwa przezbrojenia, a 20 minut awaria. Producent podaje, że maszyna robi sztukę w 30 sekund. W planie produkcji przyjęto 40 sekund.

Trzy osoby liczą OEE tej zmiany. Pierwsza traktuje przezbrojenia i konserwację jako stratę i bierze cykl producenta: wychodzi 56%. Druga wyłącza przezbrojenia i konserwację z czasu planowanego, bo przecież były w planie, i dostaje 68%. Trzecia robi to samo, ale bierze cykl z planu produkcji. Ma 91%, czyli więcej niż „światowa klasa”. Każda policzyła poprawnie (dane fikcyjne, rysunek 1).

![Wykres słupkowy: OEE tej samej zmiany przy trzech definicjach. Przezbrojenia i konserwacja jako strata, cykl nominalny: 56%. Przezbrojenia i konserwacja poza czasem planowanym, cykl nominalny: 68%. To samo z cyklem ze standardu planowania: 91%. Przerywana linia oznacza 85%.](../../assets/rysunki/oee-85-procent-1.svg "Rysunek 1. Ta sama zmiana ma OEE od 56 do 91% zależnie od dwóch decyzji w definicji. Dane fikcyjne, rachunek redakcji.")

To nie sztuczka. OEE to stosunek czasu w pełni produktywnego do czasu planowanego [@vorne-wc]: dobre sztuki razy cykl idealny, podzielone przez czas, w którym maszyna miała pracować. Licznik i mianownik zależą od decyzji, a nie tylko od tego, co działo się na hali. Dopóki nie wiesz, jak policzono wynik, porównanie z liczbą 85% albo z innym zakładem mówi niewiele. Pokażemy, skąd się wzięło 85%, ile wynosi OEE w zakładach, które zbadano, i jak spisać definicję, dzięki której wynik przestanie zależeć od tego, kto liczy.

## OEE to jeden iloraz, a nie trzy procenty

Zwykle OEE liczy się jako iloczyn trzech składowych: dostępności, wydajności i jakości. Dostępność mówi, jaką część czasu planowanego maszyna pracowała. Wydajność mówi, ile sztuk zrobiła w porównaniu z tym, ile zrobiłaby w cyklu idealnym. Jakość to udział dobrych sztuk.

W naszym przykładzie (dane fikcyjne) maszyna pracowała 350 minut. U pierwszej osoby czas planowany wynosi 450 minut, więc dostępność to 77,8%, wydajność 74,3%, a jakość 97,1%. Iloczyn daje 56,1%, dokładnie tyle samo, co 505 dobrych sztuk razy 30 sekund, podzielone przez 450 minut. Druga osoba skróciła mianownik do 370 minut, więc wzrosła tylko dostępność. Trzecia wydłużyła cykl idealny do 40 sekund i wydajność skoczyła do 99%.

Z tego rachunku płyną dwa wnioski. Każda składowa jest ułamkiem, w którym coś przyjęto: czas planowany w dostępności, cykl idealny w wydajności, definicję dobrej sztuki w jakości. A ponieważ składowe się mnoży, nawet wysokie wyniki cząstkowe dają skromną całość. Trzy razy po 90% to 73% OEE [@vorne-wc].

## 85% to cel dla najlepszych zakładów, nie średnia

Liczba pochodzi z japońskiego ruchu TPM (Total Productive Maintenance, kompleksowe utrzymanie ruchu). W 1989 r. japoński instytut, który rozwijał TPM, pisał, że w badanych przez niego firmach efektywność urządzeń wynosiła średnio 40–60%, a działania TPM mogą ją podnieść do 85–95% [@jipm]. Seiichi Nakajima, twórca metody, przyjmował, że w idealnych warunkach dostępność powinna przekraczać 90%, wydajność 95%, a jakość 99%. Iloczyn tych liczb daje około 85% [@jonsson].

Te liczby miały wyznaczać kierunek, a nie opisywać przeciętny zakład. Według Vorne, producenta systemów do pomiaru OEE, Nakajima przedstawił je jako minimum, do którego zakłady mają dążyć, i zauważył, że wszystkie zakłady nagrodzone w Japonii za wdrożenie TPM miały OEE powyżej 85% [@vorne-wc]. Vorne przypomina też, że liczba ma korzenie w Japonii lat 70. i w przemyśle motoryzacyjnym. W odpowiedziach na pytania czytelników ta sama firma nazywa 85% wygodnym, przekonującym i zupełnie sztucznym punktem odniesienia [@vorne-faq].

Zatem 85% to poprzeczka dla najlepszych, ustawiona przez ludzi, którzy w badanych firmach mierzyli 40–60% [@jipm]. Traktowanie jej jak normy, poniżej której zakład „odstaje”, odwraca jej sens.

## W zbadanych zakładach OEE wynosi zwykle od 50 do 70%

Badań, które mierzą OEE w wielu zakładach według opisanej metody, jest mało. Najlepsze, jakie znaleźliśmy, pochodzą ze Szwecji. Hedman, Subramaniyan i Almström zebrali automatyczne pomiary z 884 maszyn w 23 szwedzkich firmach od października 2013 do marca 2014 r. Średnie OEE wyniosło 65%, a mediana 70% [@hedman]. W danych z ponad 90 firm z lat 2006–2012 średnia wyniosła 51,5% [@bokrantz]. Ljungberg, który przeanalizował około 20 przypadków, podał OEE w okolicach 55% [@ljungberg].

Nawet te liczby mogą być zawyżone. Hedman i współautorzy zastrzegają, że w 702 z 884 maszyn wydajność, a w 796 jakość wpisano jako 100% [@hedman]. Jeśli te maszyny traciły na tempie albo na jakości, średnia 65% jest za wysoka.

W Polsce nie znaleźliśmy badania wielu zakładów z opisaną metodą, tylko studia pojedynczych maszyn. W jednym z nich, opisanym przez autorów z AGH, OEE jednej maszyny wahało się w ciągu tygodnia od 46 do 83%, średnio 68% [@agh]. Na tej podstawie nie da się mówić o polskiej średniej. Popularne „typowe 60%” pochodzi z kolei z doświadczenia producenta systemów OEE, który nie podaje danych ani metody [@vorne-wc].

## Wynik zależy od definicji tak samo jak od maszyny

Pierwsza decyzja dotyczy czasu planowanego: czy przezbrojenie, planowana konserwacja i przerwa obniżają wynik. W TPM przezbrojenie i regulacja to jedna z sześciu dużych strat [@jipm]. Firmy liczą to jednak różnie. W dwóch ankietach w szwedzkim przemyśle (80 firm w 2001 r. i 71 w 2014 r.) zdarzenia planowane, takie jak przezbrojenie, wymiana narzędzi, konserwacja i przerwy, uznawała za zakłócenie produkcji połowa respondentów albo mniej [@bokrantz]. Andersson i Bellgran opisują to samo z bliska: w badanych firmach różnie rozumiano, co jest czasem planowanym, a co nieplanowanym, i jaki cykl uznać za idealny [@andersson].

Druga decyzja to cykl idealny. Do wyboru jest nominalny cykl maszyny, najlepszy zmierzony albo czas z normy planowania. Im wolniejszy cykl przyjmiesz, tym wyższa wydajność i całe OEE. W studium z AGH zakład przyjmował jeden normatywny cykl dla wszystkich wyrobów, różnych pod względem trudności, i autorzy piszą wprost, że takie uproszczenie znacząco zaniża wydajność [@agh].

Bywa też odwrotnie: OEE spada, choć linia robi więcej. Andersson i Bellgran opisali półautomatyczną linię montażową, na której usprawnienie wąskiego gardła skróciło cykl idealny linii z 26 do 22 sekund. Przestoje na innym stanowisku zostały, więc OEE spadło z 86 do 79%, a linia zaczęła robić 130 zamiast 118 sztuk na godzinę [@andersson]. Kto patrzy tylko na OEE, uzna dobrą zmianę za pogorszenie.

Nawet norma nie rozstrzyga sporu. ISO 22400-2 z 2014 r. opisuje wskaźniki zarządzania operacjami produkcyjnymi, ale według analizy Schiraldiego i Varisco podaje dwie definicje OEE, które rozchodzą się ze sobą i z ujęciem Nakajimy [@schiraldi]. Sama norma czeka na nowe wydanie [@iso].

Badacze zauważali to już pod koniec lat 90. Rozbieżne wyniki pomiarów, od 30 do 80%, pokazują ich zdaniem, jak trudno porównywać OEE różnych procesów [@jonsson].

## Porównanie ma sens, gdy definicja jest wspólna

Z tego nie wynika, że OEE jest bezużyteczne albo że 85% jest nieosiągalne. Linia z przykładu Anderssona i Bellgran miała 86% przed zmianą [@andersson], a zakłady nagradzane w Japonii za TPM przekraczały 85% [@vorne-wc]. Wysoki wynik jest możliwy, tylko nie jest normą.

Porównanie dwóch zakładów też może mieć sens. Andersson i Bellgran piszą, że obliczenia muszą być wtedy wykonane w ten sam, ustandaryzowany sposób [@andersson]. W praktyce oznacza to ten sam czas planowany, ten sam rodzaj cyklu idealnego i te same zasady liczenia dobrych sztuk. Bez tego porównujesz arkusze, a nie maszyny.

Jednej granicy definicja nie usunie: OEE nie mówi, czy maszyna jest wąskim gardłem. Wyższe OEE maszyny, która i tak czeka na poprzednią, nie da ani jednej sztuki więcej na końcu linii.

## Karta definicji OEE: siedem decyzji przed pierwszym pomiarem

Zanim policzysz pierwszy wynik, spisz na jednej kartce, jak liczysz. Każdą decyzję zapisz osobno dla maszyny albo linii:

1. **Czas planowany.** Od czego liczysz: od długości zmiany po odjęciu przerw czy od całej doby?
2. **Przezbrojenia.** Strata dostępności czy czas wyłączony z planu? Jeśli chcesz je skracać, zostaw je jako stratę, bo inaczej znikną z wyniku.
3. **Konserwacja planowana, sprzątanie, odprawy.** Ta sama decyzja co przy przezbrojeniach, osobno dla każdego zdarzenia.
4. **Cykl idealny.** Nominalny cykl maszyny, najlepszy zmierzony czy czas z planowania, osobno dla każdego wyrobu.
5. **Dobra sztuka.** Czy sztuka po przeróbce liczy się jako dobra?
6. **Krótkie zatrzymania.** Od ilu minut zatrzymanie jest przestojem, a poniżej jakiego progu obniża tylko wydajność?
7. **Źródło danych.** Licznik i czujnik maszyny czy ręczny zapis operatora?

Potem policz OEE za ostatni miesiąc w dwóch albo trzech wariantach, wybierz jeden, zapisz go na karcie i przelicz nim historię. Od tej chwili zmiana wyniku oznacza zmianę na hali, a nie w arkuszu. Kartę dołączaj do każdego raportu, w którym pokazujesz OEE.

## Co zrobić w tym tygodniu

Porównuj maszynę z nią samą, tydzień do tygodnia, przy tej samej karcie. Cel wyznaczaj od własnego punktu startu, a nie od liczby z internetu. O stratach mów w minutach: „50 minut przezbrojeń na zmianę” wskazuje, co robić, a „OEE spadło o trzy punkty” nie wskazuje niczego. Zanim porównasz się z innym zakładem, porównaj najpierw karty definicji.

Wróćmy do trzech arkuszy z początku. Wszystkie były poprawne. Błędny byłby dopiero czwarty: taki, w którym co miesiąc liczy się trochę inaczej. OEE mówi, ile tracisz, a nie jak wypadasz na tle świata.
