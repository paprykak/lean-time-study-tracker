## W skrócie

**Problem.** Na blogu jednego z polskich dostawców przeczytasz, że AI zmniejsza błąd prognozy popytu o 20–50% względem metod statystycznych [@netguru]. Nie dowiesz się, na jakim poziomie i na czyich danych to zmierzono.

**Dlaczego.** W konkursie M5 zwycięzca mylił się przy sumie sprzedaży sklepów o 53% mniej niż automatycznie dobierane wygładzanie wykładnicze, a przy pojedynczym produkcie w sklepie tylko o 3,3% mniej [@m5-wyniki]. Ręczne korekty planistów poprawiają zaś prognozę tylko w niewiele ponad połowie indeksów [@fva2025].

**Co zrobić.** Na około 20 indeksach porównaj swoją prognozę z trzema darmowymi: naiwną (ostatnia znana sprzedaż), średnią z czterech tygodni i wygładzaniem wykładniczym, liczonymi z Twoim wyprzedzeniem. Zmierz też korekty; z [plikiem do pobrania](/do-pobrania/test-prognozy) zajmie to około godziny, gdy masz już eksport sprzedaży i dawnych prognoz.

## Przy pojedynczym produkcie AI ledwo pobiło automatyczne wygładzanie

Weźmy kierownika planowania w zakładzie, który produkuje opakowania dla kilkudziesięciu klientów (to przykład, firma jest fikcyjna). Na biurku ma ofertę systemu prognoz z AI i obietnicę błędu mniejszego o jedną trzecią, a w komputerze prognozy, które jego planiści co tydzień poprawiają ręcznie. Oferta nie mówi jednego: z czym ten system porównywano.

Najlepszą wskazówkę daje konkurs prognostyczny M5. Ponad 5 tysięcy zespołów prognozowało w nim sprzedaż 3 049 produktów w 10 sklepach sieci Walmart w trzech stanach USA, na 28 dni naprzód [@m5]. Wygrała metoda uczenia maszynowego zbudowana z 220 modeli drzew decyzyjnych [@m5].

Porównaliśmy ją z wygładzaniem wykładniczym, metodą statystyczną, w której nowsze okresy ważą więcej. Organizatorzy dobierali jego odmianę, na przykład z trendem albo bez, automatycznie dla każdego produktu w każdym sklepie. Dalej nazywamy je więc automatycznym wygładzaniem. Przy sumie sprzedaży wszystkich sklepów zwycięzca mylił się o 53% mniej niż ta metoda, a przy pojedynczym produkcie w sklepie tylko o 3,3% mniej [@m5-wyniki].

Przy produkcie w sklepie niewiele dawało nawet automatyczne dobieranie odmiany. Proste wygładzanie wykładnicze, bez trendu i sezonowości, myliło się tam tylko o 1,9% bardziej niż automatyczne, a średnia z kilku ostatnich dni o 2,6% bardziej [@m5-wyniki]. Podobne wersje obu metod, ze stałymi parametrami i na danych tygodniowych, liczy plik do pobrania. Prognozę naiwną zwycięzca poprawił przy produkcie w sklepie o 29,5%, a automatyczne wygładzanie o 27% [@m5-wyniki].

Zanim kupisz AI do prognoz, sprawdź więc, czy Twoja obecna prognoza bije proste metody, które masz za darmo, i na jakim poziomie potrzebujesz lepszej prognozy. Jeśli zamawiasz indeks po indeksie, a Twoja prognoza przegrywa z prostymi metodami, więcej zyskasz na nich niż na algorytmie.

## Im bliżej pojedynczego produktu, tym mniej dokłada AI

W średniej ze wszystkich poziomów automatyczne wygładzanie wypadło najlepiej z 24 metod porównawczych, które przygotowali organizatorzy M5 [@m5]. Sprawdziliśmy w ich pliku wyników, o ile zwycięzca pobił tę metodę na każdym z 12 poziomów danych, od sumy wszystkich sklepów po produkt w sklepie.

![Wykres słupkowy: o ile mniej mylił się zwycięzca konkursu M5 niż automatycznie dobierane wygładzanie wykładnicze na każdym z 12 poziomów danych. Suma 10 sklepów 53,3%, stan USA 39,7%, sklep 31,1%, kategoria 42,1%, dział 34,4%, stan i kategoria 32,5%, stan i dział 27,5%, sklep i kategoria 25,3%, sklep i dział 21,4%, produkt łącznie we wszystkich sklepach 4,6%, produkt w stanie 4,2%, produkt w sklepie 3,3%.](../../assets/rysunki/prognozowanie-popytu-1.svg "Rysunek 1. Im bliżej pojedynczego produktu, tym mniej zwycięzca M5 dokładał ponad automatyczne wygładzanie wykładnicze. Źródło: obliczenia redakcji na pliku wyników konkursu M5 (Scores and Ranks.xlsx).")

Automatyczne wygładzanie było trudnym rywalem: pobiło je tylko 7,5% wszystkich zespołów [@m5]. Wynik nie zależy jednak od szczęścia zwycięzcy. Mediana 50 najlepszych zespołów to 40% przewagi przy sumie sklepów i 2,6% przy produkcie w sklepie [@m5-wyniki].

Skąd tak duża różnica między sumą a produktem? Wyobraź sobie sto indeksów, z których każdego sprzedajesz średnio cztery sztuki dziennie, losowo i niezależnie od pozostałych (przykład liczbowy na danych fikcyjnych). Sprzedaż jednego indeksu waha się typowo o dwie sztuki, czyli o połowę średniej. Przy sumie przypadkowe skoki w górę i w dół się znoszą, więc wahania rosną jak pierwiastek z liczby indeksów: przy stu indeksach dziesięć razy, a nie sto razy. Suma waha się więc o 20 sztuk na 400, czyli o 5%.

W sumie zostaje sygnał, którego model może się nauczyć: dzień tygodnia, święta, promocje i ceny. Przy jednym produkcie w jednym sklepie zostaje głównie przypadek. W M5 aż 73% takich historii sprzedaży miało popyt przerywany, z wieloma dniami bez sprzedaży [@repr].

Najbliżej producenta jest poziom produktu zsumowanego po wszystkich sklepach, tak jak indeks zsumowany po wszystkich klientach, i tam zwycięzca mylił się o 4,6% mniej niż automatyczne wygładzanie [@m5-wyniki].

U producenta działają jednak dwie siły w przeciwne strony. Dane tygodniowe są zwykle stabilniejsze niż dzienne [@ftp], więc przypadku jest w nich mniej. Producent zwykle widzi za to zamówienia hurtowni i sieci, a nie sprzedaż w sklepach. Te zamówienia wahają się mocniej niż popyt klientów końcowych, i to tym mocniej, im dalej w górę łańcucha dostaw: to efekt byczego bicza [@ftp]. Czy u Ciebie AI zyska więcej niż w M5, czy mniej? Rozstrzygnie to test opisany niżej.

## AI ma przewagę przy sumach, wielu indeksach i dobrych danych

Na poziomach od stanu USA do działu w sklepie zwycięzca M5 mylił się o 21–42% mniej niż automatyczne wygładzanie [@m5-wyniki]. Jeśli planujesz zdolności produkcyjne dla rodziny wyrobów, zakupy surowca dla wielu wyrobów albo obsadę magazynu, zysk z lepszej metody może być duży. Spiliotis i współautorzy porównali też prognozy dziennego popytu na pojedyncze indeksy: część metod uczenia maszynowego była w nich trafniejsza od statystycznych i słabiej zawyżała albo zaniżała sprzedaż [@spiliotis].

Zwycięzcy M5 korzystali jednak z tego, czego większość firm nie ma. Prawie wszystkie czołowe zespoły uczyły modele naraz na historii sprzedaży setek albo tysięcy produktów, a nie każdego produktu osobno, i używały danych o cenach, kalendarzu i wydarzeniach [@m5]. Firma z kilkudziesięcioma indeksami i bez danych o promocjach nie ma takiej bazy. Same dane M5 pochodziły z handlu detalicznego, a autorzy zastrzegają, że wniosków nie da się uogólnić poza ten obszar [@m5]. Istnieją też nowsze modele, wytrenowane wcześniej na wielu cudzych historiach sprzedaży; ten tekst ich nie ocenia. Każdy z nich sprawdzisz jednak tym samym testem, bo liczy się wynik na Twoich danych.

## Trzy pytania do dostawcy, zanim podpiszesz umowę

Pierwsze: z jaką metodą porównywaliście? Prognoza naiwna to łatwy rywal, wygładzanie wykładnicze trudniejszy, a Twoja obecna prognoza to jedyny, który się liczy. Drugie: na jakim poziomie? Wynik dla sumy firmy nic nie mówi o indeksie w magazynie, co pokazał rysunek wyżej. Trzecie: na czyich danych? Poproś o test na swojej sprzedaży z ostatnich 26 tygodni, na poziomie i z wyprzedzeniem, z jakimi zamawiasz.

Na żadne z nich nie odpowiada obietnica, od której zaczęliśmy. Blog polskiej firmy programistycznej Netguru powołuje się na analizę McKinsey Global Institute z 2023 roku. Według niej firmy wdrażające prognozy oparte na sztucznej inteligencji „zmniejszają błąd prognozy o 20–50% w porównaniu z tradycyjnymi statystycznymi punktami odniesienia” [@netguru]. Odnośnika do tej analizy nie ma. Ten sam tekst przyznaje dalej, że dobrze dostrojone metody statystyczne często dorównują gradient boostingowi, jednej z metod uczenia maszynowego. Przy dojrzałych, szybko rotujących indeksach z co najmniej trzyletnią historią czystych danych różnica wynosi według autora 1–2 punkty procentowe średniego błędu procentowego (MAPE) [@netguru].

Pilnuj, by model w pilotażu nie widział danych z tygodni, na których go oceniasz. Przegląd stanu wiedzy o prognozowaniu ostrzega, że dane testowe, miary i metody do porównania bywają dobrane tak, że przesadnie pokazują zalety nowej metody [@ftp]. Wynik testu wpisz do umowy jako warunek odbioru pilotażu. Próg ustaw nie niżej niż granica remisu z pliku do pobrania dla Twojego wyprzedzenia, bo inaczej system może przejść odbiór przez przypadek. Zapis może wyglądać jak ten niżej. To przykład liczbowy i propozycja redakcji, a nie wzór umowy, więc brzmienie i próg ustal z prawnikiem.

> Ocena obejmuje dane sprzedaży Zamawiającego z ostatnich 26 tygodni dla uzgodnionej listy około 20 indeksów, na poziomie indeksu w magazynie i z wyprzedzeniem 4 tygodni. Średni błąd bezwzględny prognoz systemu będzie co najmniej o 15% niższy od błędu obecnej prognozy Zamawiającego i od błędu wygładzania wykładniczego. System nie korzysta z danych z tygodni objętych oceną.

Dopisz też koszt utrzymania: licencję, pracę ludzi i obliczenia. Autorzy M5 zwracają uwagę, że metoda nadaje się do użytku tylko wtedy, gdy koszt obliczeń setek tysięcy prognoz co tydzień nie jest zaporowy [@m5].

## Korekty planistów pomagają w niewiele ponad połowie indeksów

W wielu firmach system liczy prognozę, a planista ją poprawia, bo wie o promocji u klienta albo o nowym zleceniu. Robert Fildes i współpracownicy zebrali dane o ponad 60 tysiącach prognoz z czterech firm z łańcuchów dostaw [@fildes2009]. W trzech z nich korekty średnio poprawiały trafność, a większe korekty pomagały bardziej niż małe. Małe często psuły prognozę [@fildes2009]. Korekty w górę poprawiały ją dużo rzadziej niż te w dół i częściej szły w złą stronę: planista podnosił prognozę, choć sprzedaż wypadała poniżej prognozy systemu [@fildes2009]. Autorzy widzą w tym ogólną skłonność do optymizmu [@fildes2009].

W 2025 r. Fildes, Goodwin i De Baets połączyli publicznie dostępne dane z sześciu badań, razem około 147 tysięcy prognoz [@fva2025]. Korekty zmniejszały błąd i odchylenie, czyli systematyczne zawyżanie albo zaniżanie, tylko w nieco ponad połowie indeksów, a wyniki różniły się między zbiorami danych [@fva2025]. To niewiele więcej niż rzut monetą.

Korekty w górę częściej szkodziły, a duże korekty w dół zwykle pomagały [@fva2025]. Autorzy nie znaleźli mocnych dowodów, że planiści skutecznie wykorzystują informacje niedostępne dla systemu; wyglądało raczej na to, że reagują na sygnały, które mało mówią o przyszłej sprzedaży [@fva2025].

Bez pomiaru nikt nie wie, które korekty pomagają, także sam planista. Jeśli korekty nie wnoszą nowej informacji, sama prognoza systemu bywa lepsza od obecnego procesu [@ftp]. Wtedy pierwszy zysk leży w korektach, a nie w nowym systemie.

## Test trzech darmowych prognoz w trzech krokach

Wybierz około 20 indeksów. Wylosuj je z listy sprzedaży z roku przed testem, po kilka z grup A, B i C, razem z wycofanymi, bo tam korekty w górę mogły narobić najwięcej szkody. Dla każdego zbierz sprzedaż i prognozę z ostatnich 26–52 tygodni. Bierz prognozę, według której naprawdę zamawiałeś albo planowałeś produkcję. Jeśli system nadpisuje dawne prognozy, zacznij co tydzień zapisywać ich kopię. Po kwartale zrobisz pierwszy test, a po pół roku pełny.

Na zakładkę „Wiele indeksów” w pliku wklejasz cztery kolumny: indeks, tydzień, sprzedaż i swoją prognozę na ten tydzień, indeks po indeksie. Jako sprzedaż bierz to, co prognozujesz. Jeśli prognozujesz zamówienia klientów, wklej zamówienia, a nie wysyłki, bo wysyłki ogranicza dostępność towaru. Tydzień, w którym towaru zabrakło, zostaw z pustą sprzedażą, bo klienci kupili wtedy mniej, niż chcieli.

Prognozę systemu sprzed korekty planisty wklej osobno, na zakładkę „Korekty”. Plik działa tak samo na miesiącach, ale weź wtedy co najmniej dwa lata historii. Jeśli planujesz zdolności dla rodzin wyrobów, zrób ten sam test na sumach: każdą rodzinę wklej jako jeden indeks.

### Krok 1. Dodaj trzy darmowe prognozy z tym samym wyprzedzeniem

Przegląd stanu wiedzy zaleca porównywać każdą nową metodę co najmniej z prognozą naiwną i z popularnymi metodami, takimi jak wygładzanie wykładnicze [@ftp]. Prognoza naiwna to ostatnia znana sprzedaż, średnia z czterech tygodni uśrednia cztery ostatnie znane tygodnie, a wygładzanie wykładnicze daje nowszym tygodniom większą wagę. Plik do pobrania liczy je sam.

Darmowe prognozy mogą znać tylko tę sprzedaż, którą Ty znałeś. Wyprzedzenie to liczba tygodni między chwilą prognozy a tygodniem, na który ją robisz. Weź to, z którym podejmujesz decyzję, na przykład zamawiasz surowiec albo zamrażasz plan produkcji. Jeśli prognozę na tydzień 20 robisz po zamknięciu tygodnia 14, wyprzedzenie wynosi 6, prognoza naiwna to sprzedaż z tygodnia 14, a średnia to średnia z tygodni 11–14.

Jeśli klienci przysyłają własne prognozy albo harmonogramy dostaw, dodaj je jako czwartą poprzeczkę. Musisz je pobić. Inaczej Twój proces nic do nich nie dodaje.

Wersję wygładzania z trendem i sezonowością liczy narzędzie Arkusz prognozy w Excelu, na karcie Dane [@excel]. Do testu ustaw w „Opcjach” „Początek prognozy” na datę przed końcem danych, a Excel policzy prognozę tylko z wcześniejszej sprzedaży [@excel]. Porównaj ją ze sprzedażą w tygodniu odległym od tej daty o Twoje wyprzedzenie. To pojedyncza próba, nie pełny test. Pokaże jednak, czy trend i sezonowość coś zmieniają.

### Krok 2. Policz błąd w sztukach i przelicz go na zapas

Dla każdego tygodnia weź różnicę między prognozą a sprzedażą, pomiń znak i policz średnią. To średni błąd bezwzględny (MAE, mean absolute error). Średniego błędu procentowego (MAPE) nie używaj przy indeksach, które miewają tygodnie bez sprzedaży, bo przy zerowej sprzedaży nie da się go policzyć [@hyndman]. Podziel swój błąd przez błąd prognozy naiwnej i przez błąd lepszej z dwóch pozostałych: średniej albo wygładzania. Wynik poniżej 1 znaczy, że Twoja prognoza myli się mniej.

Policz też odchylenie: sumę różnic prognoza minus sprzedaż, ze znakiem, podzieloną przez sumę sprzedaży. Wynik dodatni znaczy, że prognoza średnio zawyża sprzedaż, a jeśli zamawiasz według niej, zawyżasz też zapas.

Zapas bezpieczeństwa wyznacza się z rozrzutu błędu prognozy w czasie dostawy [@ftp]. W klasycznym wzorze to mnożnik zależny od poziomu obsługi klienta razy ten rozrzut, więc zapas rośnie i maleje razem z nim. Jeśli magazyn trzyma zapas bezpieczeństwa za 1,2 mln zł, prognoza z błędem mniejszym o 10% pozwala go zmniejszyć mniej więcej o 120 tys. zł (przykład na danych fikcyjnych). To kwota jednorazowa, a licencję płacisz co roku: z jej ceną porównaj roczny koszt utrzymania tych 120 tys. zł w zapasie.

### Krok 3. Zmierz wartość dodaną korekt

Porównaj błąd prognozy systemu przed korektą planisty i po niej. To wartość dodana prognozy (forecast value added, FVA): o ile każdy krok procesu zmniejsza błąd [@ftp]. Licz osobno korekty w górę i w dół, bo te pierwsze częściej szkodzą [@fva2025]. Gdy korekty psują prognozę, zmień zasady ich robienia. Fildes i Goodwin zalecają, by planista uzasadniał każdą korektę na piśmie, a firma regularnie sprawdzała, czy korekty pomagają [@fildes2007].

Jeden indeks kierownika z początku tekstu wygląda tak (dane fikcyjne, takie jak w pliku do pobrania). Sprzedaje się go około 125 sztuk tygodniowo. System liczy średnią z czterech tygodni, zaokrągloną do całych sztuk, i myli się średnio o 12,5 sztuki. Planiści poprawiają ją głównie w górę, „na wszelki wypadek”, i po korektach błąd rośnie do 15,2 sztuki, czyli o 22%. Tyle samo myli się prognoza naiwna, a sama średnia z czterech tygodni o 12,4 sztuki. Według klasycznego wzoru korekty podnoszą zapas bezpieczeństwa tego indeksu mniej więcej o jedną piątą.

To jednak tylko jeden indeks i tylko trop. W naszej symulacji na danych fikcyjnych dwie równie dobre prognozy, porównane na 26 tygodniach jednego indeksu, różniły się przez przypadek nawet o 30%. Dla 20 indeksów różnej wielkości liczonych razem przypadek przesuwał stosunek błędów przy wyprzedzeniu 1–2 tygodni zwykle o mniej niż 10%. Przy wyprzedzeniu 3–4 tygodni przesuwał go o mniej niż 15%, a przy dłuższym o mniej niż 20%. Te granice plik nazywa remisem i sam dobiera je do Twojego wyprzedzenia.

Rozstrzyga więc wynik dla wszystkich indeksów razem. Liczba indeksów, w których wygrywasz, tylko go uzupełnia: przy równie dobrych prognozach wychodzi zwykle od 6 do 14 na 20. Pod tabelą wyników plik sam wskaże, w którym wierszu tabeli decyzji jesteś. „Gorsza” znaczy w niej gorsza o więcej niż granica remisu:

| Twoja prognoza dla wszystkich indeksów razem | Co to znaczy | Co zrobić |
|---|---|---|
| Gorsza od naiwnej | Problem w procesie, nie w algorytmie | Sprawdź odchylenie i korekty, zwłaszcza małe i w górę. Z zakupem systemu poczekaj |
| Nie gorsza od naiwnej, ale gorsza od średniej albo wygładzania | Prosta metoda dałaby mniejszy błąd za darmo | Przejdź na wygładzanie (przy trendzie i sezonowości w wersji, która je uwzględnia) i mierz dalej. Z zakupem systemu poczekaj |
| Remis z prostymi metodami | Twój proces nie dodaje wartości ponad darmową prognozę | Sprawdź korekty i uprość proces. System musi w pilotażu wyraźnie pobić proste metody |
| Lepsza od wszystkich darmowych prognoz | Proces działa | Nowy system musi w pilotażu wyraźnie pobić Ciebie. Największe szanse ma przy setkach powiązanych indeksów i danych o cenach, promocjach i wydarzeniach |

## Kiedy test trzeba uzupełnić

Test działa najlepiej dla indeksów, które sprzedają się co tydzień i bez wielkich skoków. Przy sezonowości dodaj sezonową prognozę naiwną, czyli sprzedaż z tego samego tygodnia rok wcześniej; wymaga ona roku historii przed testem. Przy rosnącej sprzedaży średnia z czterech tygodni pokazuje poziom sprzed około dwóch i pół tygodnia i zaniża prognozę, więc porównuj się wtedy z wygładzaniem z trendem.

Przy indeksach, które w większości tygodni nie sprzedają się wcale, najmniejszy średni błąd w sztukach może mieć prognoza „zero” [@ftp]. Nikt nie zamówi według niej towaru, więc takie indeksy oceniaj osobno, po zapasie i poziomie obsługi klienta [@ftp]. Przy nowych wyrobach i jednorazowych zdarzeniach, takich jak duże zamówienie albo promocja, darmowe prognozy nie mają historii, a planista ma wiedzę, której system nie zna. Tu korekt nie zakazuj, tylko mierz je osobno.

## Najpierw zmierz swój proces, potem system dostawcy

Kierownik planowania z początku tekstu wyeksportuje w poniedziałek sprzedaż i prognozy 20 indeksów z ostatniego półrocza i wklei je do pliku. Sprawdzi, czy jego prognoza bije darmowe, czy korekty planistów pomagają i ile zapasu kosztuje różnica. Z tym wynikiem pójdzie do dostawcy z trzema pytaniami. Tym samym plikiem oceni potem pilotaż: zamiast swojej prognozy wklei prognozę systemu.

Jeśli Twoja prognoza przegrywa z prostymi metodami, zacznij od nich i od korekt, które szkodzą. Nowy system kupuj dopiero wtedy, gdy Twoja prognoza bije proste metody, a system dostawcy w pilotażu wyraźnie bije Twoją.
