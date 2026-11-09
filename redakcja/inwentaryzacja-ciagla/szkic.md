## W skrócie

**Problem.** W badaniu prawie 370 tys. rekordów z 37 sklepów jednej sieci 65% stanów w systemie nie zgadzało się z tym, co było na półce [@dehoratius]. Spis raz w roku poprawia stany na jeden dzień, a błędy zaczynają narastać od następnego.

**Dlaczego.** Każde przyjęcie, pobranie i przesunięcie może zostawić błąd, a najwięcej operacji mają najczęściej pobierane indeksy. W naszym modelu na danych fikcyjnych przy spisie raz w roku średnio 45% stanów jest błędnych, a przy liczeniu cyklicznym według rotacji 22%.

**Co zrobić.** Ustawa o rachunkowości pozwala inwentaryzować zapasy w strzeżonych składowiskach z ewidencją ilościowo-wartościową raz w ciągu dwóch lat [@ustawa]. Na tej podstawie firmy rozkładają spis na cały ten okres. Licz najczęściej tam, gdzie błąd rośnie najszybciej, i naprawiaj przyczyny różnic, bo samo liczenie daje tylko część efektu.

## Dwanaście kartonów, których nie ma

System pokazuje dwanaście kartonów. Na półce nie ma żadnego. Kompletujący odkłada zamówienie, kierownik zmiany szuka towaru w strefie przyjęć, a klient dostaje informację, że dostawa będzie niepełna.

Hurtownia artykułów elektrotechnicznych z naszego przykładu (dane fikcyjne) ma 6 000 indeksów. Co roku w pierwszym tygodniu stycznia zamyka magazyn na dwa dni i liczy wszystko. Różnice zostają wyjaśnione, stany poprawione. Do marca magazynierzy znów zgłaszają puste lokalizacje, w których system widzi towar.

Badanie, które Nicole DeHoratius i Ananth Raman opublikowali w „Management Science”, pokazuje skalę zjawiska w handlu: w 37 sklepach jednej sieci 65% z prawie 370 tys. rekordów było błędnych [@dehoratius]. Więcej zmienności błędów przypadało na różnice między kategoriami produktów (26,4%) niż między sklepami (2,7%) [@dehoratius]. Mniej błędów wiązało się z praktykami audytu stanów, a więcej ze złożonością sklepu i strukturą dostaw [@dehoratius].

Magazyny wypadają lepiej. W benchmarku WERC z 2019 r., na którym oparto opisaną dalej symulację, typowy magazyn ma dokładność inwentaryzacji od 97% do 99%, a najlepsze co najmniej 99,9% [@destro]. To inne zakłady i inne źródło danych, więc tych liczb nie zestawiamy wprost z wynikiem ze sklepów. Niezależnie od punktu startu błędy zaczynają narastać od dnia po spisie, bo każda operacja może zostawić nowy. Dlatego jeden spis w roku nie wystarczy. Ustawa pozwala rozłożyć inwentaryzację zapasów na dwa lata, a liczenie według rotacji powinno dać dokładniejsze stany, jeśli przy okazji usuwasz przyczyny błędów.

## Błędy rosną od dnia po spisie

Zbudowaliśmy prosty model hurtowni z przykładu (dane fikcyjne). Indeksy klasy A, 20% asortymentu, mają po 8 operacji dziennie, klasa B, 30%, po 2, a klasa C, połowa indeksów, 0,3 operacji. Zakładamy, że co dwusetna operacja zostawia błąd w stanie i że błędy się nie znoszą.

Skąd tak szybki przyrost? Indeks klasy A ma w roku 2 000 operacji, po 8 dziennie przez 250 dni. Przy błędzie co dwusetną operację średnio dziesięć z nich zostawi ślad w stanie. Klasa A psuje się więc pierwsza. W naszym modelu około 70% indeksów klasy C przechodzi rok bez żadnego błędu, a w klasie A prawie żaden. Dlatego liczenie co miesiąc ma sens dla A, a dla C wystarczy raz w roku.

![Wykres liniowy: odsetek indeksów z błędnym stanem w systemie w ciągu roku. Przy spisie w styczniu rośnie od zera do 63% na koniec roku. Przy liczeniu cyklicznym według rotacji utrzymuje się na poziomie 22%, a przy liczeniu cyklicznym i mniejszej liczbie błędów przy operacjach na poziomie 10%.](../../assets/rysunki/inwentaryzacja-ciagla-1.svg "Rysunek 1. Spis raz w roku zostawia rosnącą liczbę błędnych stanów, a liczenie cykliczne trzyma ją niżej; najwięcej daje liczenie połączone z poprawą przyjęć i pobrań. Źródło: model redakcji na danych fikcyjnych (6 000 indeksów, błąd przy co dwusetnej operacji albo co pięćsetnej).")

Po kwartale od spisu błędnych jest 37% stanów, a na koniec roku 63%. Średnio przez rok to 45%. Liczenie cykliczne, w którym indeksy A liczy się co miesiąc, B co kwartał, a C raz w roku, utrzymuje odsetek błędnych stanów na poziomie 22%. Gdy błąd zostawia co pięćsetna operacja zamiast co dwusetnej, to samo liczenie daje 10%.

Model jest uproszczony i nie kalibrowaliśmy go do żadnego badania. Przy rzadszych błędach krzywa rośnie wolniej, ale ma ten sam kształt: najszybciej psują się najczęściej ruszane indeksy.

Model pokazuje więc mechanizm: błędy rosną tam, gdzie jest najwięcej ruchu, a liczenie bez poprawy procesu tylko je ścina. Ten sam kierunek, choć nie skalę, pokazała symulacja centrum dystrybucyjnego, którą przeprowadzili Iuri Destro i współautorzy. Mierzy ona rozbieżność jako różnicę między ilością w systemie i na półce dla całego magazynu, a nie odsetek błędnych indeksów, więc jej liczb nie porównujemy z modelem [@destro]. W magazynie z najlepszej kategorii benchmarku bez liczenia cyklicznego rozbieżności rosły w ciągu roku z 0,10% do 4,55%, a z jedną osobą liczącą tylko do 0,13% [@destro]. W najsłabszym magazynie nawet zespół dziesięciu liczących dawał w ciągu roku więcej utraconej sprzedaży niż najlepszy magazyn bez liczenia [@destro]. Autorzy piszą, że liczenie działa lepiej, gdy idzie za nim ograniczenie błędów przy przyjęciach i pobraniach [@destro].

## Ustawa pozwala liczyć zapasy przez dwa lata, ale nie wszędzie

Ustawa o rachunkowości każe inwentaryzować zapasy na ostatni dzień roku obrotowego, spisem z natury, z wyjaśnieniem i rozliczeniem różnic [@ustawa]. Termin uznaje się za dotrzymany, jeśli spis rozpoczęto nie wcześniej niż 3 miesiące przed końcem roku i zakończono do 15. dnia następnego roku [@ustawa]. Stan na koniec roku ustala się wtedy, dopisując lub odpisując obroty od dnia spisu [@ustawa]. Nie dotyczy to m.in. produktów w toku produkcji ani materiałów i towarów odpisywanych w koszty w momencie zakupu [@ustawa].

Dla zapasów materiałów, towarów, produktów gotowych i półproduktów w strzeżonych składowiskach, objętych ewidencją ilościowo-wartościową, wystarczy inwentaryzacja raz w ciągu dwóch lat [@ustawa]. To podstawa, na której firmy rozkładają spis na cały okres, czyli prowadzą inwentaryzację ciągłą. Samo to określenie w ustawie nie pada. Różnice trzeba wyjaśnić i rozliczyć w księgach roku obrotowego, na który przypadał termin inwentaryzacji [@ustawa].

Zanim zmienisz zasady, zadaj głównemu księgowemu cztery pytania. Czy nasz magazyn to strzeżone składowisko w rozumieniu naszej polityki rachunkowości? Czy prowadzimy ewidencję ilościowo-wartościową dla wszystkich indeksów, które chcemy liczyć cyklicznie? Jak zapiszemy harmonogram liczenia w instrukcji inwentaryzacyjnej? Jak będziemy rozliczać różnice w trakcie roku i czy biegły rewident chce być obecny przy części liczeń? Odpowiedzi należą do księgowości i biegłego rewidenta, a nie do magazynu.

Jeśli w tym roku spis jest już zaplanowany, nie odwołuj go. Zrób ostatni pełny spis, a od stycznia licz według harmonogramu zapisanego w instrukcji inwentaryzacyjnej. Pierwszy rok pokaże, ile naprawdę kosztuje liczenie i jak zmienia się dokładność. W hurtowni z przykładu (dane fikcyjne) po dwóch latach każdy indeks będzie policzony co najmniej dwa razy, a najczęściej pobierane około 24 razy.

## Plan liczenia w czterech krokach

Plan ma cztery kroki, ale każde pojedyncze liczenie wygląda tak samo: od wyboru lokalizacji do naprawy przyczyny.

![Schemat jednego liczenia w sześciu krokach: 1. lokalizacja z harmonogramu albo wywołana brakiem towaru, stanem zero albo ujemnym; 2. liczenie na ślepo, gdy lokalizacja stoi; 3. różnica ponad próg: drugie liczenie przez inną osobę; 4. przyczyna różnicy; 5. korekta zatwierdzona przez osobę spoza zespołu liczącego; 6. raz w miesiącu naprawa przyczyny, która dała najwięcej różnic. Strzałka wraca od kroku 6 do kroku 1: mniej błędów przy operacjach.](../../assets/rysunki/inwentaryzacja-ciagla-2.svg "Rysunek 2. Każde liczenie kończy się przyczyną, a nie tylko korektą stanu. Źródło: opracowanie redakcji.")

### Krok 1. Podziel indeksy według liczby operacji

Klasy wyznaczaj według liczby przyjęć, pobrań i przesunięć, a nie według wartości. Błąd w stanie powstaje przy operacji. Indeks z 8 pobraniami dziennie psuje się więc szybciej niż drogi indeks pobierany raz w miesiącu. To ta sama zasada, którą w [tekście o kompletacji](/kompletacja-droga) stosujemy do rozmieszczenia towaru.

Dla hurtowni z przykładu (dane fikcyjne) plan wygląda tak:

| Klasa | Indeksy | Operacje na indeks dziennie | Liczenie | Liczeń w roku |
|---|---|---|---|---|
| A | 1 200 | 8 | co 21 dni roboczych (ok. co miesiąc) | 14 286 |
| B | 1 800 | 2 | co 63 dni roboczych (ok. co kwartał) | 7 143 |
| C | 3 000 | 0,3 | raz w roku | 3 000 |
| Razem | 6 000 | | | 24 429 |

To około 98 liczeń na dzień roboczy, gdy każdy indeks ma jedną lokalizację, zamiast dwóch dni zamkniętego magazynu w styczniu.

Liczenie nie jest jednak darmowe. Przy 2 minutach na lokalizację (dane fikcyjne) 24 429 liczeń to około 814 godzin pracy rocznie, czyli około 3,3 godziny dziennie. Spis tych samych 6 000 lokalizacji to około 200 godzin, choć w dwa dni zamkniętego magazynu. Liczysz więc mniej więcej cztery razy więcej. To dużo. W zamian, według naszego modelu, masz przez cały rok o połowę mniej błędnych stanów i nie zatrzymujesz wysyłek.

Rachunek jest dobry, jeśli dodatkowe 600 godzin kosztuje mniej niż szukanie towaru, niepełne dostawy i korekty, których unikniesz. Swój czas liczenia sprawdź sam: zmierz czas 20 lokalizacji i pomnóż.

Ile osób na to przeznaczyć? W symulacji centrum dystrybucyjnego ze stu kompletującymi magazyn z najlepszej kategorii potrzebował jednej albo dwóch osób liczących (tekst i tabela autorów różnią się), a typowy dwóch albo trzech [@destro]. W swojej hurtowni policz to sam: liczba lokalizacji dziennie razy zmierzony czas jednej.

### Krok 2. Licz także wtedy, gdy coś się nie zgadza

Oprócz harmonogramu licz lokalizację zawsze wtedy, gdy kompletujący nie znajduje towaru, gdy stan spada do zera albo gdy system pokazuje stan ujemny. Takie liczenie kosztuje niewiele, bo i tak ktoś stoi przy regale, a trafia w miejsca, w których błąd właśnie się ujawnił.

### Krok 3. Licz na ślepo

Liczący nie powinien widzieć stanu z systemu, tylko lokalizację i indeks. Wtedy zapisuje to, co policzył, a nie potwierdza liczbę z ekranu. Różnicę ponad ustalony próg liczy drugi raz ktoś inny, zanim korekta trafi do systemu.

Licz wtedy, gdy w lokalizacji nic się nie dzieje: przed pierwszą zmianą albo po zablokowaniu lokalizacji w systemie na czas liczenia. Inaczej pobranie w trakcie liczenia zrobi różnicę, której nie ma. Liczenie warto powierzyć stałej osobie, a nie temu, kto akurat ma wolną chwilę.

### Krok 4. Każdą różnicę doprowadź do przyczyny

Korekta stanu bez ustalenia przyczyny poprawia liczbę, ale nie proces, który ją zepsuł. Przy każdej różnicy zapisz, skąd się wzięła: przyjęcie, pobranie, przesunięcie bez zapisu, ubytek, zła jednostka miary. W symulacji systemu zapasów sklepu, którą zbudowali Howard Hao-Chun Chuang i Rogelio Oliva, głównymi przyczynami błędnych stanów były ubytki na zapleczu i na półce [@chuang]. W tej samej pracy analiza danych z pięciu sklepów dała silne dowody, że więcej pracy na pełny etat zmniejsza błędy, a praca w niepełnym wymiarze ich nie zmniejsza [@chuang].

Raz w miesiącu policz, która przyczyna dała najwięcej różnic, i napraw ją w procesie: kontrolę przy przyjęciu, skanowanie przy pobraniu, zasady przesunięć. W naszym modelu na danych fikcyjnych to właśnie mniejsza liczba błędów przy operacjach obniżała odsetek błędnych stanów z 22 do 10%.

## Każde liczenie zostawia ślad

Korektę po ponownym liczeniu powinien zatwierdzić ktoś spoza zespołu, który liczył, na przykład kontroler albo kierownik z innego działu. Ustawa wymaga, żeby przebieg i wyniki inwentaryzacji były udokumentowane i powiązane z zapisami ksiąg rachunkowych [@ustawa]. Przy liczeniu rozłożonym na cały rok ten ślad powstaje codziennie, więc najlepiej prowadzić go w jednej karcie (przykład na danych fikcyjnych):

| Data | Lokalizacja | Indeks | Stan w systemie | Policzono | Różnica | Przyczyna | Liczył | Zatwierdził |
|---|---|---|---|---|---|---|---|---|
| 18.11 | B-04-2 | przewód 3×1,5, krążek 100 m | 12 | 0 | −12 | przyjęcie na złą lokalizację | A. N. | kontroler |

Kolumna „przyczyna” jest najważniejsza. Bez niej karta służy księgowości, a z nią także magazynowi.

## Dokładność mierz w sztukach, nie w złotówkach

Najprostsza miara to odsetek lokalizacji, w których stan policzony zgadza się z systemem. Licz indeks i ilość, nie wartość: brak dziesięciu tanich złączek i nadwyżka jednego drogiego przełącznika mogą dać zero w złotówkach i dwa błędy na półce.

W poniedziałek wylosuj z systemu 20 lokalizacji, policz je na ślepo i podziel liczbę zgodnych przez 20. Przy tak małej próbie jedna różnica zmienia wynik o 5 punktów procentowych, więc ten test pokaże tylko duży problem. Do śledzenia zmian licz co tydzień większą losową próbę i zapisuj wynik na wykresie. Policz go osobno dla klas A, B i C: jeśli dokładność spada głównie w klasie A, problem leży w pobraniach, a nie w rzadko ruszanym towarze.

## Dowody pochodzą ze sklepów i symulacji

Najmocniejsze badanie dotyczy handlu detalicznego, a nie magazynu hurtowego, i czytaliśmy je w streszczeniu, bo pełny tekst jest płatny [@dehoratius]. Przyczyny błędów Chuang i Oliva badali w symulacji, a wpływ zatrudnienia na danych z pięciu sklepów [@chuang]. Wyniki dla centrum dystrybucyjnego pochodzą z symulacji, a nie z pomiaru [@destro]. Nasz model jest ilustracją mechanizmu, nie prognozą dla konkretnego magazynu.

Kierunek jest jednak spójny. Audyty i liczenie wiążą się z mniejszą liczbą błędów [@dehoratius, @destro], a w symulacji przy wielu błędach operacji samo liczenie nie wystarczało [@destro].

## Liczenie nie zastąpi spisu ani naprawy procesu

Przepis o inwentaryzacji raz w ciągu dwóch lat dotyczy tylko zapasów w strzeżonych składowiskach z ewidencją ilościowo-wartościową [@ustawa]. Bez niej albo poza strzeżonym składowiskiem spis trzeba zrobić na koniec roku, zwykle w oknie od 3 miesięcy przed jego końcem do 15 stycznia [@ustawa]. Inne terminy mają m.in. sklepy [@ustawa]. Liczenie cykliczne nadal poprawi stany, ale spisu nie zastąpi.

Mały magazyn z kilkuset indeksami może taniej policzyć wszystko w jeden dzień. W symulacji Destro i współautorów w magazynach z wieloma błędami przy przyjęciach i pobraniach samo liczenie nie wystarczało [@destro]. Liczenie gasi wtedy pożar, którego źródło dalej działa. Wtedy pierwsza złotówka powinna iść w proces, a dopiero druga w liczących.

## Kartony, których już nie szukasz

Styczniowe zamknięcie magazynu może zniknąć z kalendarza hurtowni, jeśli księgowość potwierdzi, że jej zapasy spełniają warunki ustawy. Hurtownia może wtedy robić około stu liczeń dziennie, najczęściej pobierane indeksy co miesiąc, i co miesiąc naprawiać przyczynę, która dała najwięcej różnic. Księgowość dostanie inwentaryzację rozłożoną na dwa lata, a kompletujący stany, którym da się wierzyć.

Zacznij w poniedziałek od 20 losowych lokalizacji policzonych na ślepo i zanieś wynik głównemu księgowemu razem z czterema pytaniami o instrukcję inwentaryzacyjną. Trzy niezgodne lokalizacje albo więcej to w tej próbie mniej niż 90%, czyli wynik poniżej progu najsłabszej kategorii w benchmarku WERC [@destro]. Wtedy ta rozmowa nie powinna czekać do stycznia.
