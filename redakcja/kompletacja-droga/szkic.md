## W skrócie

**Problem.** W magazynie, w którym kompletujący sam chodzi do regałów, droga zajmuje typowo połowę jego czasu, a kompletacja może pochłaniać nawet 55% kosztów operacyjnych całego magazynu [@dekoster]. Za tę drogę płacisz, zanim ktokolwiek dotknie towaru.

**Dlaczego.** Długość drogi zależy od dwóch decyzji, które nic nie kosztują: gdzie leżą najczęściej pobierane indeksy i jaką trasą idzie kompletujący. W polskim badaniu symulacyjnym sama zmiana składowania skróciła średni czas kompletacji o 27% [@tarczynski].

**Co zrobić.** Policz pobrania na indeks z ostatniego kwartału, przenieś najczęściej pobierane bliżej punktu wydań i dobierz zasadę trasy do liczby pobrań w alejce. Zwrot z automatyzacji licz dopiero od drogi, która zostanie.

## Połowa czasu kompletującego to chodzenie

Weźmy kierownika magazynu dystrybutora chemii gospodarczej, w którym ośmiu kompletujących zbiera na zmianę kilka tysięcy linii zamówień (to przykład, firma jest fikcyjna). Dostawca robotów mobilnych obiecuje mu, że roboty przejmą chodzenie między regałami. Brzmi rozsądnie, bo chodzenia jest dużo. Pytanie brzmi jednak inaczej: ile z tego chodzenia jest naprawdę potrzebne?

Przegląd badań nad kompletacją, który napisali René de Koster i współautorzy, podaje typowy podział czasu kompletującego w magazynie, w którym człowiek idzie do towaru. Droga to 50%, szukanie 20%, samo pobranie 15%, przygotowanie 10%, a reszta 5% [@dekoster]. Te proporcje pochodzą z podręcznika, a nie z pomiaru autorów przeglądu, ale autorzy dodają, że droga jest zwykle największym składnikiem czasu i pierwszym kandydatem do poprawy [@dekoster]. Przytaczają przy tym zdanie Johna Bartholdiego i Stevena Hackmana: „czas drogi to marnotrawstwo; kosztuje roboczogodziny, a nie dodaje wartości” [@dekoster].

Zanim kupisz roboty do kompletacji, skróć więc drogę, którą dziś pokonuje magazynier. Rozmieszczenie towaru i zasada trasy skracają ją w badaniach o 27–43% [@tarczynski, @leduc], a żadna z nich nie wymaga inwestycji. Robot, który przejmie chodzenie później, przejmie go już mniej.

## Najczęściej pobierane indeksy powinny leżeć najbliżej wydań

Popyt w magazynie rzadko rozkłada się równo. W klasycznym podziale ABC najszybsza grupa to często około 15% indeksów, które dają około 85% obrotu [@dekoster]. Jeśli te indeksy leżą rozrzucone po całej hali, kompletujący chodzi po nie wszędzie. Jeśli leżą blisko punktu wydań, większość zamówień kończy się kilka alejek od biurka.

Rozprawa Tho Le-Duca z Uniwersytetu Erazma w Rotterdamie pokazuje skalę tej różnicy w modelu magazynu. Składowanie według ABC skracało drogę nawet o 32% przy umiarkowanie skośnym popycie i o 43% przy silnie skośnym, w porównaniu ze składowaniem losowym [@leduc]. Polskie badanie symulacyjne opublikowane w „Optimum. Studia Ekonomiczne” dało podobny rząd wielkości. Właściwe składowanie skróciło średni czas kompletacji o 26,93% bez zmiany trasy [@tarczynski].

Granice klas znajdziesz w danych. Ułóż indeksy od najczęściej pobieranych i dopisz, jaki odsetek wszystkich pobrań dają łącznie kolejne indeksy. Tam, gdzie krzywa przestaje szybko rosnąć, kończy się klasa A; zwykle to kilkanaście procent indeksów. Resztę podziel na jedną albo dwie klasy wolniejsze.

Klasy wyznaczaj według częstości pobrań, czyli liczby linii zamówień na indeks, a nie według wartości sprzedaży [@dekoster]. Drogę wydłuża każda wizyta przy regale, niezależnie od tego, ile kosztuje towar. Pełne uszeregowanie wszystkich indeksów według rotacji daje w symulacjach jeszcze krótszą drogę niż podział na klasy, ale autorzy tej analizy zalecają w praktyce 2–4 klasy, bo łatwiej je utrzymać [@dekoster].

## Trasa zależy od tego, ile pobrań wypada na alejkę

Najczęstsza zasada trasy w magazynach nazywa się S-shape: kompletujący przechodzi całą długością każdej alejki, w której ma coś do pobrania, i wraca do wydań. Jest prosta i nikt się na niej nie gubi. Według badań cytowanych w przeglądzie de Kostera trasy S-shape są jednak przy losowym składowaniu średnio o 7–33% dłuższe od najkrótszych możliwych [@dekoster]. Najlepsza z prostych zasad schodzi średnio do około 5% ponad optimum [@dekoster].

Jedną z takich zasad jest largest gap. Kompletujący wchodzi do alejki z przodu albo z tyłu i zawraca tam, gdzie między pobraniami jest największa przerwa, zamiast przechodzić alejkę w całości. Ta zasada wygrywa z S-shape wtedy, gdy na alejkę wypada mniej niż około 4 pobrań [@dekoster]. Przy gęstych zamówieniach i tak przechodzisz prawie każdą alejkę do końca, więc wybór trasy traci znaczenie.

Sprawdziliśmy to w symulacji na danych fikcyjnych. Magazyn ma 10 alejek po 30 miejsc z każdej strony, 600 indeksów, z których 20% daje 80% pobrań, a punkt wydań stoi w rogu. Dla każdego wariantu policzyliśmy drogę dla 20 tysięcy zamówień.

![Wykres słupkowy: o ile krótsza jest droga kompletującego niż przy losowym rozmieszczeniu towaru i trasie S-shape. Zamówienie z 5 pozycjami: sama trasa largest gap 19%, samo rozmieszczenie według rotacji 34%, oba razem 42%. Z 15 pozycjami: 20%, 29% i 45%. Z 30 pozycjami: 6%, 19% i 33%.](../../assets/rysunki/kompletacja-droga-1.svg "Rysunek 1. Rozmieszczenie według rotacji skraca drogę bardziej niż zmiana trasy, a trasa traci znaczenie przy dużych zamówieniach. Źródło: symulacja redakcji na danych fikcyjnych (10 alejek, 600 indeksów, 20 tys. zamówień na wariant).")

Przy zamówieniach z 5 pozycjami sama zmiana trasy skróciła drogę o 19%, samo rozmieszczenie według rotacji o 34%, a oba kroki razem o 42%. Przy 30 pozycjach zmiana trasy dała już tylko 6%, bo kompletujący i tak odwiedzał prawie każdą alejkę. Rozmieszczenie działało przy każdej wielkości zamówienia.

Wniosek dla kierownika jest prosty: najpierw rozmieszczenie, potem trasa.

## Strefy i łączenie zamówień dają więcej, ale kosztują sortowanie

Kolejny krok to podział magazynu na strefy albo kompletowanie kilku zamówień naraz. W polskim badaniu symulacyjnym najlepszy wariant, kompletacja synchroniczna w pięciu strefach, skrócił czas o blisko 70% względem magazynu bez stref, ze składowaniem losowym i trasą S-shape [@tarczynski]. Autorzy zastrzegają jednak, że taki wariant wymaga dodatkowej pracy w sortowni albo dużych nakładów na sortownię automatyczną [@tarczynski]. Ostrzegają też, że źle dobrane składowanie i trasa przy strefach mogą dać czasy dłuższe niż w magazynie bez stref [@tarczynski].

Łączenie kilku małych zamówień w jedną rundę działa podobnie: kompletujący pobiera więcej w każdej alejce przy tej samej drodze, ale potem ktoś musi rozdzielić towar na zamówienia. Przy okazji rośnie liczba pobrań na alejkę, więc prosta trasa S-shape traci mniej.

Strefy i łączenie zamówień to więc decyzja o organizacji pracy, a nie poprawka na jutro. Rozmieszczenie i trasę zmienisz w miesiąc, bez sortowni i bez nowych ludzi.

## Skróć drogę w trzech krokach

### Krok 1. Zmierz udział drogi i policz pobrania

Zanim cokolwiek przeniesiesz, sprawdź, ile drogi naprawdę jest w Twoim magazynie. Przez kilka dni obserwuj 20–30 rund kompletacji na różnych zmianach i zapisuj osobno czas chodzenia i czas przy regale. Jeśli chodzenie to mniej niż jedna trzecia czasu, większy zysk leży w szukaniu i pobieraniu: w oznaczeniu lokalizacji, kolejności na liście i opakowaniach.

Wyeksportuj z systemu magazynowego linie zamówień z ostatniego kwartału: indeks, lokalizację i numer zamówienia. Policz, ile razy pobierano każdy indeks, i ułóż indeksy od najczęściej pobieranych. Policz też średnią liczbę pobrań na alejkę w jednym zamówieniu albo w jednej rundzie kompletacji. Ta liczba podpowie zasadę trasy.

### Krok 2. Przenieś najczęściej pobierane indeksy bliżej wydań

Podziel indeksy na 2–4 klasy według częstości pobrań. Najszybszą klasę ułóż w alejkach i miejscach najbliżej punktu wydań, a najwolniejszą w głębi hali. Nie przenoś wszystkiego naraz: zacznij od indeksów, które dziś leżą najdalej, a są pobierane najczęściej. Popyt się zmienia, więc klasy przeliczaj co kwartał, a przy towarze sezonowym także przed sezonem.

### Krok 3. Dobierz zasadę trasy i zmierz efekt

Gdy na alejkę wypada mniej niż około 4 pobrań, kompletujący nie musi przechodzić alejek do końca: wchodzi i zawraca przy największej przerwie. Gdy pobrań jest więcej, S-shape jest prosty i niewiele traci. Jeśli system magazynowy układa listę pobrań, sprawdź, którą zasadę stosuje.

Nową trasę pokaż kompletującym na planie hali i przećwicz na kilku rundach, zanim ocenisz wynik. Pierwsze dni zwykle idą wolniej, bo ludzie chodzą po nowych lokalizacjach, a nie z pamięci. Dlatego pomiar po zmianie zacznij dopiero po tygodniu.

Efekt mierz czasem na linię zamówienia z systemu magazynowego, dwa tygodnie przed zmianą i dwa tygodnie po niej, przy podobnych zamówieniach. Weźmy przykład na danych fikcyjnych. Jeśli droga to połowa czasu kompletacji, a skrócisz ją o 40%, czas kompletacji spadnie mniej więcej o 20%. Przy ośmiu kompletujących na zmianę to około półtora etatu na zmianę. Jeśli roczny koszt etatu kompletującego wynosi 80 tys. zł, przy dwóch zmianach daje to około 240 tys. zł rocznie. Dopiero od tej liczby licz zwrot z robotów: przejmą chodzenie, którego już będzie mniej.

## Trzy pytania do dostawcy automatyzacji

Pierwsze: od jakiej drogi liczycie oszczędność? Jeśli od dzisiejszej, część obiecanego zysku dałoby samo przeniesienie najczęściej pobieranych indeksów. Drugie: na czyich zamówieniach liczyliście wynik? Poproś o symulację na Twoich liniach zamówień z ostatniego kwartału, z liczbą pozycji i alejek taką, jaką masz. Trzecie: ile pobrań na godzinę osiąga kompletujący dziś, a ile po zmianie? Porównuj z wynikiem po uporządkowaniu magazynu, nie z obecnym bałaganem.

Te same pytania zadaj wewnątrz firmy, gdy ktoś proponuje nowe regały, wózki albo system magazynowy. Każda z tych inwestycji też skraca drogę, ale dopiero po rozmieszczeniu i trasie widać, ile drogi naprawdę zostało do skrócenia.

## Kiedy te liczby się nie sprawdzą

Tekst dotyczy magazynów, w których człowiek idzie do towaru. Tam, gdzie towar przyjeżdża do stanowiska kompletacji, na przykład z regałów automatycznych, droga kompletującego przestaje być problemem, a liczą się czas pobrania i wydajność systemu.

Wszystkie wyniki w tym tekście pochodzą z modeli i symulacji, a podział czasu na drogę i resztę z podręcznika, a nie z pomiarów w polskich magazynach. W Twoim magazynie proporcje mogą być inne: przy kompletacji dużych, ciężkich pozycji więcej czasu zjada samo pobranie, a przy drobnicy szukanie. Dlatego zaczynasz od pomiaru, a nie od przenoszenia regałów.

Mały magazyn z kilkoma alejkami ma mniej drogi do skrócenia, więc i zysk będzie mniejszy; tam częściej opłaca się praca nad szukaniem i pobieraniem.

Nasza symulacja nie uwzględnia tłoku. Gdy najczęściej pobierane indeksy stoją w dwóch alejkach przy wydaniach, kilku kompletujących może sobie w nich przeszkadzać. Przy wielu osobach na zmianę rozłóż najszybszą klasę na kilka alejek. Nie uwzględnia też kosztu samego przenoszenia towaru ani ergonomii: najczęściej pobierane indeksy kładź na wysokości, z której łatwo je wziąć.

## Najpierw krótsza droga, potem roboty

Kierownik magazynu z początku tekstu nie musi odrzucać oferty robotów. Najpierw jednak wyeksportuje linie zamówień z kwartału i sprawdzi, gdzie leżą jego najczęściej pobierane indeksy. Przeniesie je bliżej wydań i zmierzy czas na linię. Potem zapyta dostawcę, ile robot zaoszczędzi na drodze, która już jest krótsza.

Roboty mogą się opłacić. Ale płacenie za to, żeby maszyna szybciej pokonywała niepotrzebną drogę, to automatyzowanie marnotrawstwa.
