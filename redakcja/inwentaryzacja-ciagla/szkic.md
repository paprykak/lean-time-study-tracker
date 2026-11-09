## W skrócie

**Problem.** W badaniu prawie 370 tys. rekordów z 37 sklepów jednej sieci 65% stanów w systemie nie zgadzało się z tym, co było na półce [@dehoratius]. Spis raz w roku poprawia stany na jeden dzień, a błędy zaczynają narastać od następnego.

**Dlaczego.** Każde przyjęcie, pobranie i przesunięcie może zostawić błąd, a najwięcej operacji mają najczęściej pobierane indeksy. W naszym modelu na danych fikcyjnych przy spisie raz w roku średnio 45% stanów jest błędnych, a przy liczeniu cyklicznym według rotacji 22%.

**Co zrobić.** Ustawa o rachunkowości pozwala liczyć zapasy w strzeżonych składowiskach z ewidencją ilościowo-wartościową raz w ciągu dwóch lat, a więc rozłożyć spis na cały okres [@ustawa]. Licz najczęściej tam, gdzie błąd rośnie najszybciej, i naprawiaj przyczyny różnic, bo samo liczenie daje tylko część efektu.

## Dwanaście kartonów, których nie ma

System pokazuje dwanaście kartonów. Na półce nie ma żadnego. Kompletujący odkłada zamówienie, kierownik zmiany szuka towaru w strefie przyjęć, a klient dostaje informację, że dostawa będzie niepełna.

Weźmy hurtownię artykułów elektrotechnicznych z 6 000 indeksów (to przykład, firma jest fikcyjna). Co roku w pierwszym tygodniu stycznia zamyka magazyn na dwa dni i liczy wszystko. Różnice zostają wyjaśnione, stany poprawione. Do marca magazynierzy znów zgłaszają puste lokalizacje, w których system widzi towar.

Badanie, które Nicole DeHoratius i Ananth Raman opublikowali w „Management Science”, pokazuje skalę zjawiska w handlu: 65% z prawie 370 tys. rekordów było błędnych [@dehoratius]. Błędy zmniejszały regularne audyty stanów, a zwiększały złożoność sklepu i struktura dostaw [@dehoratius]. Roczny spis spełnia ustawę, ale nie naprawi stanów w magazynie. Ustawa pozwala liczyć zapasy przez cały rok, a liczenie według rotacji daje dokładniejsze stany, jeśli przy okazji naprawiasz to, co błędy robi.

## Błędy rosną od dnia po spisie

Zbudowaliśmy prosty model hurtowni z przykładu (dane fikcyjne). Indeksy klasy A, 20% asortymentu, mają po 8 operacji dziennie, klasa B, 30%, po 2, a klasa C, połowa indeksów, 0,3 operacji. Zakładamy, że co dwusetna operacja zostawia błąd w stanie i że błędy się nie znoszą.

Skąd tak szybki przyrost? Indeks klasy A ma w roku 2 000 operacji, po 8 dziennie przez 250 dni. Przy błędzie co dwusetną operację średnio dziesięć z nich zostawi ślad w stanie. Klasa A psuje się więc pierwsza. W naszym modelu około 70% indeksów klasy C przechodzi rok bez żadnego błędu, a w klasie A prawie żaden. Dlatego liczenie co miesiąc ma sens dla A, a dla C wystarczy raz w roku.

![Wykres liniowy: odsetek indeksów z błędnym stanem w systemie w ciągu roku. Przy spisie w styczniu rośnie od zera do 63% na koniec roku. Przy liczeniu cyklicznym według rotacji utrzymuje się na poziomie 22%, a przy liczeniu cyklicznym i mniejszej liczbie błędów przy operacjach na poziomie 10%.](../../assets/rysunki/inwentaryzacja-ciagla-1.svg "Rysunek 1. Spis raz w roku zostawia rosnącą liczbę błędnych stanów, a liczenie cykliczne trzyma ją niżej; najwięcej daje liczenie połączone z poprawą przyjęć i pobrań. Źródło: model redakcji na danych fikcyjnych (6 000 indeksów, błąd przy co dwusetnej operacji albo co pięćsetnej).")

Po kwartale od spisu błędnych jest 37% stanów, a na koniec roku 63%. Średnio przez rok to 45%. Liczenie cykliczne, w którym indeksy A liczy się co miesiąc, B co kwartał, a C raz w roku, utrzymuje odsetek błędnych stanów na poziomie 22%. Gdy błąd zostawia co pięćsetna operacja zamiast co dwusetnej, to samo liczenie daje 10%.

Model jest uproszczony i nie kalibrowaliśmy go do żadnego badania. Pokazuje jednak mechanizm: błędy rosną tam, gdzie jest najwięcej ruchu, a liczenie bez poprawy procesu tylko je ścina. To samo wyszło w symulacji centrum dystrybucyjnego, którą przeprowadzili Iuri Destro i współautorzy. W najlepszym magazynie bez liczenia cyklicznego rozbieżności rosły w ciągu roku z 0,10% do 4,55%, a jedna osoba licząca utrzymywała je na 0,13% [@destro]. W najsłabszym magazynie nawet zespół dziesięciu liczących dawał w ciągu roku więcej utraconej sprzedaży niż najlepszy magazyn bez liczenia [@destro]. Autorzy piszą, że liczenie działa lepiej, gdy idzie za nim ograniczenie błędów przy przyjęciach i pobraniach [@destro].

## Co mówi ustawa

Ustawa o rachunkowości każe inwentaryzować zapasy na ostatni dzień roku obrotowego, spisem z natury, z wyjaśnieniem i rozliczeniem różnic [@ustawa]. Termin uznaje się za dotrzymany, jeśli spis rozpoczęto nie wcześniej niż 3 miesiące przed końcem roku i zakończono do 15. dnia następnego roku [@ustawa].

Dla zapasów materiałów, towarów, produktów gotowych i półproduktów w strzeżonych składowiskach, objętych ewidencją ilościowo-wartościową, wystarczy inwentaryzacja raz w ciągu dwóch lat [@ustawa]. To podstawa, na której firmy rozkładają spis na cały okres, czyli prowadzą inwentaryzację ciągłą. Samo to określenie w ustawie nie pada. Różnice trzeba wyjaśnić i rozliczyć w księgach roku obrotowego, na który przypadał termin inwentaryzacji [@ustawa].

Zanim zmienisz zasady, zadaj głównemu księgowemu cztery pytania. Czy nasz magazyn to strzeżone składowisko w rozumieniu naszej polityki rachunkowości? Czy prowadzimy ewidencję ilościowo-wartościową dla wszystkich indeksów, które chcemy liczyć cyklicznie? Jak zapiszemy harmonogram liczenia w instrukcji inwentaryzacyjnej? Jak będziemy rozliczać różnice w trakcie roku i czy biegły rewident chce być obecny przy części liczeń? Odpowiedzi należą do księgowości i biegłego rewidenta, a nie do magazynu.

Jeśli w tym roku spis jest już zaplanowany, nie odwołuj go. Zrób ostatni pełny spis, a od stycznia licz według harmonogramu zapisanego w instrukcji inwentaryzacyjnej. Pierwszy rok pokaże, ile naprawdę kosztuje liczenie i jak zmienia się dokładność. Po dwóch latach każdy indeks będzie policzony co najmniej raz, a najczęściej pobierane kilkanaście razy.

## Plan liczenia w czterech krokach

### Krok 1. Podziel indeksy według liczby operacji

Klasy wyznaczaj według liczby przyjęć, pobrań i przesunięć, a nie według wartości. Błąd w stanie powstaje przy operacji, więc indeks z 8 pobraniami dziennie psuje się szybciej niż drogi indeks pobierany raz w miesiącu. To ta sama zasada, którą w [tekście o kompletacji](/kompletacja-droga) stosujemy do rozmieszczenia towaru.

Dla hurtowni z przykładu (dane fikcyjne) plan wygląda tak:

| Klasa | Indeksy | Operacje na indeks dziennie | Liczenie | Liczeń w roku |
|---|---|---|---|---|
| A | 1 200 | 8 | co 21 dni roboczych (ok. co miesiąc) | 14 286 |
| B | 1 800 | 2 | co 63 dni roboczych (ok. co kwartał) | 7 143 |
| C | 3 000 | 0,3 | raz w roku | 3 000 |
| Razem | 6 000 | | | 24 429 |

To około 98 lokalizacji na dzień roboczy, zamiast dwóch dni zamkniętego magazynu w styczniu. Ile godzin to zajmie, sprawdź u siebie: zmierz czas liczenia 20 lokalizacji i pomnóż.

Ile osób na to przeznaczyć? W symulacji centrum dystrybucyjnego ze stu kompletującymi najlepszy magazyn utrzymywał stany z jedną osobą liczącą, a typowy z trzema [@destro]. W swojej hurtowni policz to sam: liczba lokalizacji dziennie razy zmierzony czas jednej.

### Krok 2. Licz także wtedy, gdy coś się nie zgadza

Oprócz harmonogramu licz lokalizację zawsze wtedy, gdy kompletujący nie znajduje towaru, gdy stan spada do zera albo gdy system pokazuje stan ujemny. Takie liczenie kosztuje niewiele, bo i tak ktoś stoi przy regale, a trafia w miejsca, w których błąd właśnie się ujawnił.

### Krok 3. Licz na ślepo

Liczący nie powinien widzieć stanu z systemu, tylko lokalizację i indeks. Wtedy zapisuje to, co policzył, a nie potwierdza liczbę z ekranu. Różnicę ponad ustalony próg liczy drugi raz ktoś inny, zanim korekta trafi do systemu.

Licz wtedy, gdy w lokalizacji nic się nie dzieje: przed pierwszą zmianą albo po zablokowaniu lokalizacji w systemie na czas liczenia. Inaczej pobranie w trakcie liczenia zrobi różnicę, której nie ma. Liczenie warto powierzyć stałej osobie, a nie temu, kto akurat ma wolną chwilę.

### Krok 4. Każdą różnicę doprowadź do przyczyny

Korekta stanu bez przyczyny to zamiecenie błędu pod dywan. Przy każdej różnicy zapisz, skąd się wzięła: przyjęcie, pobranie, przesunięcie bez zapisu, ubytek, zła jednostka miary. W badaniu pięciu sklepów, które przeprowadzili Hsiao-Hui Chuang i Rogelio Oliva, głównymi przyczynami błędnych stanów były ubytki na zapleczu i na półce [@chuang]. W tym samym badaniu więcej pracy na pełny etat zmniejszało błędy, a praca w niepełnym wymiarze ich nie zmniejszała [@chuang].

Raz w miesiącu policz, która przyczyna dała najwięcej różnic, i napraw ją w procesie: kontrolę przy przyjęciu, skanowanie przy pobraniu, zasady przesunięć. W naszym modelu na danych fikcyjnych to właśnie mniejsza liczba błędów przy operacjach obniżała odsetek błędnych stanów z 22 do 10%.

## Każde liczenie zostawia ślad

Korektę po ponownym liczeniu powinien zatwierdzić ktoś spoza zespołu, który liczył, na przykład kontroler albo kierownik z innego działu. Ustawa wymaga, żeby przebieg i wyniki inwentaryzacji były udokumentowane i powiązane z zapisami ksiąg rachunkowych [@ustawa]. Przy liczeniu rozłożonym na cały rok ten ślad powstaje codziennie, więc najlepiej prowadzić go w jednej karcie (przykład na danych fikcyjnych):

| Data | Lokalizacja | Indeks | Stan w systemie | Policzono | Różnica | Przyczyna | Liczył | Zatwierdził |
|---|---|---|---|---|---|---|---|---|
| 18.11 | B-04-2 | przewód 3×1,5, krążek 100 m | 12 | 0 | −12 | przyjęcie na złą lokalizację | A. N. | kontroler |

Kolumna „przyczyna” jest najważniejsza. Bez niej karta służy księgowości, a z nią także magazynowi.

## Jak zmierzyć dokładność stanów

Najprostsza miara to odsetek lokalizacji, w których stan policzony zgadza się z systemem. Licz indeks i ilość, nie wartość: brak dziesięciu tanich złączek i nadwyżka jednego drogiego przełącznika mogą dać zero w złotówkach i dwa błędy na półce.

W poniedziałek wylosuj z systemu 20 lokalizacji, policz je na ślepo i podziel liczbę zgodnych przez 20. Przy tak małej próbie jedna różnica zmienia wynik o 5 punktów procentowych, więc ten test pokaże tylko duży problem. Do śledzenia zmian licz co tydzień większą losową próbę i zapisuj wynik na wykresie. Policz go osobno dla klas A, B i C: jeśli dokładność spada głównie w klasie A, problem leży w pobraniach, a nie w rzadko ruszanym towarze.

## Ile o tym naprawdę wiemy

Najmocniejsze badanie dotyczy handlu detalicznego, a nie magazynu hurtowego, i czytaliśmy je w streszczeniu, bo pełny tekst jest płatny [@dehoratius]. Badanie przyczyn błędów objęło pięć sklepów [@chuang]. Wyniki dla centrum dystrybucyjnego pochodzą z symulacji, a nie z pomiaru [@destro]. Nasz model jest ilustracją mechanizmu, nie prognozą dla konkretnego magazynu.

Wszystkie te źródła wskazują jednak w tę samą stronę: stany psują się z każdą operacją, regularne liczenie je poprawia, a w słabym procesie liczenie nie wystarcza [@dehoratius, @destro].

## Kiedy liczenie cykliczne nie wystarczy

Przepis o inwentaryzacji raz w ciągu dwóch lat dotyczy tylko zapasów w strzeżonych składowiskach z ewidencją ilościowo-wartościową [@ustawa]. Bez niej spis i tak trzeba zrobić w terminie wokół końca roku [@ustawa]. Liczenie cykliczne nadal poprawi stany, ale spisu nie zastąpi.

Mały magazyn z kilkuset indeksami może taniej policzyć wszystko w jeden dzień. W magazynie z dużą liczbą błędów przy przyjęciach i pobraniach liczenie gasi pożar, którego źródło dalej działa [@destro]. Wtedy pierwsza złotówka powinna iść w proces, a dopiero druga w liczących.

## Kartony, których już nie szukasz

Hurtownia z początku tekstu nie musi zamykać magazynu na dwa dni w styczniu. Może liczyć około stu lokalizacji dziennie, najczęściej pobierane indeksy co miesiąc, i co miesiąc naprawiać przyczynę, która dała najwięcej różnic. Księgowość dostanie inwentaryzację rozłożoną na dwa lata, a kompletujący stany, którym da się wierzyć.

Zacznij w poniedziałek od 20 losowych lokalizacji policzonych na ślepo. Wynik powie, ile kartonów w systemie istnieje tylko w systemie.
