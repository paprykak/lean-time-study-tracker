## W skrócie

**Problem.** W magazynie, w którym kompletujący sam chodzi do regałów, droga zajmuje typowo połowę jego czasu, a kompletacja może pochłaniać nawet 55% kosztów operacyjnych całego magazynu [@dekoster].

**Dlaczego.** Długość drogi zależy od dwóch decyzji, które nic nie kosztują: gdzie leżą najczęściej pobierane indeksy i jaką trasą idzie kompletujący. W polskim badaniu symulacyjnym sama zmiana składowania skróciła średni czas kompletacji o 27% [@tarczynski].

**Co zrobić.** Policz pobrania na indeks z ostatniego kwartału, przenieś najczęściej pobierane bliżej punktu wydań i dobierz zasadę trasy do liczby pobrań w alejce. Zwrot z automatyzacji licz dopiero od drogi, która zostanie.

## Połowa czasu kompletującego to chodzenie

Wyobraź sobie kierownika magazynu dystrybutora chemii gospodarczej, w którym ośmiu kompletujących zbiera na zmianę kilka tysięcy linii zamówień, czyli pozycji na zamówieniach (to przykład, firma jest fikcyjna). Dostawca robotów mobilnych obiecuje mu, że roboty przejmą chodzenie między regałami. Chodzenia jest dużo, więc oferta brzmi rozsądnie. Ile z niego jest jednak potrzebne?

Przegląd badań nad kompletacją zamówień (order picking), który napisali René de Koster i współautorzy, podaje typowy podział czasu kompletującego w magazynie, w którym człowiek idzie do towaru. Droga to 50%, szukanie 20%, samo pobranie 15%, przygotowanie 10%, a reszta 5% [@dekoster]. Te proporcje pochodzą z podręcznika, a nie z pomiaru autorów przeglądu, ale autorzy dodają, że droga jest zwykle największym składnikiem czasu i pierwszym kandydatem do poprawy [@dekoster].

Zanim kupisz roboty do kompletacji, skróć drogę, którą dziś pokonuje magazynier. Samo rozmieszczenie według rotacji skracało drogę w modelu o 32–43% [@leduc], a czas kompletacji w polskim badaniu o 27% [@tarczynski]. Żadna z tych zmian nie wymaga zakupu sprzętu: kosztują roboczogodziny przy przenoszeniu towaru i kilka wolniejszych dni. Robot, który przejmie chodzenie później, przejmie go już mniej.

## Najczęściej pobierane indeksy powinny leżeć najbliżej wydań

Popyt w magazynie rzadko rozkłada się równo. W klasycznej metodzie Pareto najszybsza klasa to około 15% indeksów (pozycji asortymentu, SKU), które dają około 85% ruchu [@dekoster]. Jeśli te indeksy leżą rozrzucone po całej hali, kompletujący chodzi po nie wszędzie. Jeśli leżą blisko punktu wydań, czyli miejsca, w którym kompletujący oddaje zebrany towar, większość zamówień kończy się kilka alejek od niego.

Rozprawa Tho Le-Duca z Uniwersytetu Erazma w Rotterdamie pokazuje skalę tej różnicy w modelu pojedynczej alejki. Składowanie według ABC skracało drogę nawet o 32% przy umiarkowanie skośnym popycie i o 43% przy silnie skośnym, w porównaniu ze składowaniem losowym [@leduc]. Polskie badanie symulacyjne opublikowane w „Optimum. Studia Ekonomiczne” dało podobny rząd wielkości. Właściwe składowanie skróciło średni czas kompletacji o 26,93% bez zmiany trasy [@tarczynski].

Granice klas znajdziesz w danych. Ułóż indeksy od najczęściej pobieranych i dopisz, jaki odsetek wszystkich pobrań dają łącznie kolejne indeksy. Tam, gdzie krzywa przestaje szybko rosnąć, kończy się klasa A; w opisanych modelach to od kilkunastu do 30% indeksów [@dekoster, @leduc]. Resztę podziel na jedną albo dwie klasy wolniejsze.

Klasy wyznaczaj według częstości pobrań, czyli liczby linii zamówień na indeks [@dekoster]. Nie według wartości sprzedaży: drogę wydłuża każda wizyta przy regale, niezależnie od tego, ile kosztuje towar. Pełne uszeregowanie wszystkich indeksów według rotacji daje w symulacjach jeszcze krótszą drogę niż podział na klasy, ale autorzy tej analizy zalecają w praktyce 2–4 klasy, bo łatwiej je utrzymać [@dekoster].

## Trasa zależy od tego, ile pobrań wypada na alejkę

Najczęstsza w praktyce zasada to trasa w kształcie litery S (S-shape): kompletujący przechodzi całą długością każdej alejki, w której ma coś do pobrania, i wraca do wydań [@tarczynski]. Jest prosta i nikt się na niej nie gubi. Według badań cytowanych w przeglądzie de Kostera trasy S-shape są jednak przy losowym składowaniu średnio o 7–33% dłuższe od najkrótszych możliwych [@dekoster]. Najlepsza z prostych zasad schodzi średnio do około 5% ponad optimum [@dekoster].

Jedną z takich zasad jest omijanie największej przerwy (largest gap). Kompletujący przechodzi w całości pierwszą i ostatnią alejkę z pobraniami. Do pozostałych wchodzi z przodu, z tyłu albo z obu stron i zawraca tak, żeby ominąć największą przerwę między pobraniami [@dekoster]. Ta zasada wygrywa z S-shape wtedy, gdy na alejkę wypada mniej niż około 4 pobrań [@dekoster]. Przy gęstych zamówieniach i losowym rozmieszczeniu i tak przechodzisz prawie każdą alejkę do końca. Wtedy wybór trasy traci znaczenie.

Sprawdziliśmy to w symulacji na danych fikcyjnych. Magazyn ma 10 alejek po 30 miejsc z każdej strony, 600 indeksów, z których 20% daje 80% pobrań, a punkt wydań stoi w rogu. Dla każdego wariantu policzyliśmy drogę dla 20 tysięcy zamówień.

![Wykres słupkowy: o ile krótsza jest droga kompletującego niż przy losowym rozmieszczeniu towaru i trasie S-shape. Zamówienie z 5 pozycjami: sama trasa largest gap 19%, samo rozmieszczenie według rotacji 34%, oba razem 42%. Z 15 pozycjami: 20%, 29% i 45%. Z 30 pozycjami: 6%, 19% i 33%.](../../assets/rysunki/kompletacja-droga-1.svg "Rysunek 1. Rozmieszczenie według rotacji skraca drogę bardziej niż zmiana trasy, a przy losowym rozmieszczeniu trasa traci znaczenie przy dużych zamówieniach. Źródło: symulacja redakcji na danych fikcyjnych (10 alejek, 600 indeksów, 20 tys. zamówień na wariant).")

Wszystkie procenty na rysunku porównują drogę z tym samym punktem wyjścia: losowym rozmieszczeniem i trasą S-shape. Przy zamówieniach z 5 pozycjami sama zmiana trasy skróciła drogę o 19%, samo rozmieszczenie według rotacji o 34%, a oba kroki razem o 42%. Przy 30 pozycjach i losowym rozmieszczeniu zmiana trasy dała już tylko 6%, bo kompletujący i tak odwiedzał prawie każdą alejkę. Po rozmieszczeniu według rotacji trasa znów miała znaczenie: oba kroki razem dały 33%, a samo rozmieszczenie 19%, bo pobrania skupiały się z przodu alejek.

Rozmieszczenie daje więcej, ale wymaga przenoszenia towaru. Trasę zmienisz bez przenoszenia, więc przy zamówieniach do kilkunastu pozycji zacznij od niej, a rozmieszczenie zaplanuj na kolejne tygodnie.

## Strefy i łączenie zamówień dają więcej, ale kosztują sortowanie

Kolejny krok to podział magazynu na strefy albo kompletowanie kilku zamówień naraz. W polskim badaniu symulacyjnym najlepszy wariant, kompletacja synchroniczna w pięciu strefach, skrócił czas o blisko 70% względem magazynu bez stref, ze składowaniem losowym i trasą S-shape [@tarczynski]. Autorzy zastrzegają jednak, że taki wariant wymaga dodatkowej pracy w sortowni, czyli przy rozdzielaniu towaru na zamówienia, albo dużych nakładów na sortownię automatyczną [@tarczynski]. Ostrzegają też, że źle dobrane składowanie i trasa przy strefach mogą dać czasy dłuższe niż w magazynie bez stref [@tarczynski].

Łączenie kilku małych zamówień w jedną rundę działa podobnie: kompletujący pobiera więcej w każdej alejce przy tej samej drodze, ale potem ktoś musi rozdzielić towar na zamówienia. Gęstsze pobrania mają też drugi skutek: jak pisaliśmy wyżej, prosta trasa S-shape traci wtedy mniej.

Strefy i łączenie zamówień to więc decyzja o organizacji pracy, a nie poprawka na jutro. Rozmieszczenie i trasę zmienisz bez sortowni i bez nowych ludzi.

## Skróć drogę w trzech krokach

### Krok 1. Zmierz udział drogi i policz pobrania

Zanim cokolwiek przeniesiesz, sprawdź, ile drogi naprawdę jest w Twoim magazynie. Przez kilka dni obserwuj 20–30 rund kompletacji na różnych zmianach i zapisuj osobno czas chodzenia i czas przy regale. Jeśli chodzenie to mniej niż jedna trzecia czasu, większy zysk leży w szukaniu i pobieraniu: w oznaczeniu lokalizacji, kolejności na liście i opakowaniach.

Wyeksportuj z systemu magazynowego linie zamówień z ostatniego kwartału: indeks, lokalizację i numer zamówienia. Bez systemu magazynowego wystarczy zestawienie dokumentów wydania (WZ) w arkuszu. Policz, ile razy pobierano każdy indeks, i ułóż indeksy od najczęściej pobieranych. Policz też średnią liczbę pobrań na alejkę w jednym zamówieniu albo w jednej rundzie kompletacji. Ta liczba podpowie zasadę trasy.

### Krok 2. Przenieś najczęściej pobierane indeksy bliżej wydań

Podziel indeksy na 2–4 klasy według częstości pobrań. Klasę A, czyli najczęściej pobierane indeksy, ułóż w alejkach i miejscach najbliżej punktu wydań, a najrzadziej pobierane w głębi hali. Nie przenoś wszystkiego naraz: zacznij od indeksów, które dziś leżą najdalej, a są pobierane najczęściej. Popyt się zmienia, więc klasy przeliczaj co kwartał, a przy towarze sezonowym także przed sezonem.

Przenoszenie zaplanuj poza szczytem kompletacji, na przykład na zmianie bez wysyłek, i przenoś partiami, klasa po klasie. Zanim zaczniesz, zmierz na kilku próbach, ile trwa przeniesienie jednego indeksu, i pomnóż przez liczbę indeksów do przeniesienia. Tyle kosztuje zmiana. Każde przeniesienie od razu zapisz w systemie magazynowym i sprawdź etykietę lokalizacji. Miejsca klasy A opróżniają się najszybciej, więc daj im większą pojemność albo zaplanuj ich uzupełnianie poza godzinami kompletacji.

### Krok 3. Dobierz zasadę trasy i zmierz efekt

Gdy na alejkę wypada mniej niż około 4 pobrań, kompletujący nie musi przechodzić alejek do końca: wchodzi i zawraca przy największej przerwie. Gdy pobrań jest więcej, S-shape jest prosty i niewiele traci. Jeśli system magazynowy układa listę pobrań, sprawdź, którą zasadę stosuje.

Nową trasę pokaż kompletującym na planie hali i przećwicz na kilku rundach, zanim ocenisz wynik. Pierwsze dni zwykle idą wolniej. Ludzie szukają nowych lokalizacji, zamiast chodzić z pamięci, więc pomiar po zmianie zacznij po tygodniu.

Efekt mierz czasem na linię zamówienia z systemu magazynowego, dwa tygodnie przed zmianą i dwa tygodnie po niej, przy podobnych zamówieniach.

Przykład na danych fikcyjnych: jeśli droga to połowa czasu kompletacji, a skrócisz ją o 40%, czas kompletacji spadnie mniej więcej o 20%. Przy ośmiu kompletujących na zmianę to około 1,6 etatu na zmianę, a przy czterdziestu około 8 etatów. Pieniądze z tego będą dopiero wtedy, gdy obsłużysz tym czasem więcej zamówień albo zrezygnujesz z nadgodzin i pracowników tymczasowych. Przy 80 tys. zł rocznego kosztu etatu, ośmiu kompletujących i dwóch zmianach to około 256 tys. zł rocznie (1,6 etatu razy dwie zmiany razy 80 tys. zł). Zwrot z robotów licz od drogi, która zostanie po tej zmianie: roboty przejmą chodzenie, którego już będzie mniej.

## Trzy pytania do dostawcy automatyzacji

Pierwsze: od jakiej drogi liczycie oszczędność? Jeśli od dzisiejszej, część obiecanego zysku dałoby samo przeniesienie najczęściej pobieranych indeksów. Drugie: na czyich zamówieniach liczyliście wynik? Poproś o symulację na Twoich liniach zamówień z ostatniego kwartału, z liczbą pozycji i alejek taką, jaką masz. Trzecie: ile pobrań na godzinę osiąga kompletujący dziś, a ile po zmianie? Porównuj z wynikiem po uporządkowaniu magazynu, nie z obecnym bałaganem.

Te same pytania zadaj wewnątrz firmy, gdy ktoś proponuje nowe regały, wózki albo system magazynowy. Każda z tych inwestycji też skraca drogę, ale dopiero po rozmieszczeniu i trasie widać, ile drogi naprawdę zostało do skrócenia.

## Gdzie symulacja nie sięga

Tekst dotyczy magazynów, w których człowiek idzie do towaru. Tam, gdzie towar przyjeżdża do stanowiska kompletacji, na przykład z regałów automatycznych, droga kompletującego przestaje być problemem, a liczą się czas pobrania i wydajność systemu.

Wszystkie wyniki pochodzą z modeli i symulacji, a podział czasu pochodzi z podręcznika, nie z pomiarów w polskich magazynach. W Twoim magazynie proporcje mogą być inne: przy dużych, ciężkich pozycjach więcej czasu zjada samo pobranie, a przy drobnicy szukanie. Mały magazyn z kilkoma alejkami ma też mniej drogi do skrócenia. Stąd pomiar na początku, przed przenoszeniem towaru.

Nasza symulacja nie uwzględnia tłoku ani ergonomii. Gdy klasa A stoi w dwóch alejkach przy wydaniach, kilku kompletujących może sobie w nich przeszkadzać, więc przy wielu osobach na zmianę rozłóż ją na kilka alejek. Najczęściej pobierane indeksy kładź na wysokości, z której łatwo je wziąć.

## Najpierw krótsza droga, potem roboty

Kierownik z magazynu chemii gospodarczej nie musi odrzucać oferty robotów. Najpierw jednak wyeksportuje linie zamówień z kwartału i sprawdzi, gdzie leżą najczęściej pobierane indeksy. Zmieni trasę, przeniesie klasę A bliżej wydań i zmierzy czas na linię. Potem zapyta dostawcę, ile robot zaoszczędzi na drodze, która już jest krótsza.

Roboty mogą się opłacić, ale niech zastąpią drogę, której nie da się już skrócić, a nie tę, której nikt jeszcze nie próbował skracać.
