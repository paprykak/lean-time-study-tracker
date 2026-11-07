## W skrócie

**Problem.** Na blogu jednego z polskich dostawców przeczytasz, że AI zmniejsza błąd prognozy popytu o 20–50% względem metod statystycznych [@netguru]. Nie dowiesz się, na jakim poziomie i na czyich danych to zmierzono.

**Dlaczego.** Przewaga AI zależy od poziomu. W konkursie M5 zwycięska metoda myliła się o połowę mniej niż automatycznie dobierane wygładzanie wykładnicze, ale tylko przy sumie sprzedaży sklepów. Przy pojedynczym produkcie w sklepie myliła się o 3,3% mniej [@m5-wyniki]. Do tego ręczne korekty planistów poprawiają prognozę w nieco ponad połowie indeksów [@fva2025], więc część zysku może leżeć w obecnym procesie.

**Co zrobić.** Na około 20 indeksach porównaj swoją prognozę z trzema darmowymi: naiwną, średnią z czterech tygodni i wygładzaniem wykładniczym, liczonymi z takim wyprzedzeniem, z jakim zamawiasz. Zmierz też, czy korekty zmniejszają błąd. Gdy masz dane, z [plikiem do pobrania](/do-pobrania/test-prognozy) zrobisz to w godzinę.

## Przy pojedynczym produkcie AI ledwo pobiło metodę statystyczną

Weźmy kierownika planowania w zakładzie, który produkuje opakowania dla kilkudziesięciu klientów (to przykład, firma jest fikcyjna). Na biurku ma ofertę systemu prognoz z AI i obietnicę błędu mniejszego o jedną trzecią. W komputerze ma prognozy, które jego planiści co tydzień poprawiają ręcznie. Oferta nie mówi jednego: z czym ten system porównywano.

Najlepszą wskazówkę daje konkurs prognostyczny M5. Ponad 5 tysięcy zespołów prognozowało w nim sprzedaż 3 049 produktów w 10 sklepach sieci Walmart w trzech stanach USA, na 28 dni naprzód [@m5]. Wygrała metoda uczenia maszynowego zbudowana z 220 modeli drzew decyzyjnych [@m5]. Porównaliśmy ją z wygładzaniem wykładniczym, metodą statystyczną, w której nowsze okresy ważą więcej. Organizatorzy dobierali jej wariant automatycznie dla każdego produktu w każdym sklepie. Przy sumie sprzedaży wszystkich sklepów zwycięzca mylił się o połowę mniej niż ta metoda, a przy pojedynczym produkcie w sklepie tylko o 3,3% mniej [@m5-wyniki].

Zanim kupisz AI do prognoz, sprawdź więc, czy Twoja obecna prognoza bije proste metody, które masz za darmo, i na jakim poziomie potrzebujesz lepszej prognozy. Jeśli zamawiasz indeks po indeksie, a Twoja prognoza przegrywa z prostymi metodami, więcej zyskasz na nich niż na algorytmie. Takich ofert będzie przybywać: według GUS odsetek polskich przedsiębiorstw, które używają jakiejkolwiek technologii sztucznej inteligencji, wzrósł w rok z 8,7% do 17,8% [@gus2026].

## Im bliżej pojedynczego produktu, tym mniej dokłada AI

W średniej ze wszystkich poziomów wygładzanie wykładnicze dobierane automatycznie wypadło najlepiej z 24 metod porównawczych, które przygotowali organizatorzy M5 [@m5]. Sprawdziliśmy w ich pliku wyników, o ile zwycięzca pobił tę metodę na każdym z 12 poziomów danych.

![Wykres słupkowy: o ile mniej mylił się zwycięzca konkursu M5 niż automatycznie dobierane wygładzanie wykładnicze na każdym z 12 poziomów danych. Suma 10 sklepów 53,3%, stan USA 39,7%, sklep 31,1%, kategoria 42,1%, dział 34,4%, stan i kategoria 32,5%, stan i dział 27,5%, sklep i kategoria 25,3%, sklep i dział 21,4%, produkt łącznie we wszystkich sklepach 4,6%, produkt w stanie 4,2%, produkt w sklepie 3,3%.](../../assets/rysunki/prognozowanie-popytu-1.svg "Rysunek 1. Im bliżej pojedynczego produktu, tym mniej zwycięzca M5 dokładał ponad automatyczne wygładzanie wykładnicze. Źródło: obliczenia redakcji na pliku wyników konkursu M5 (Scores and Ranks.xlsx).")

Wynik nie zależy od szczęścia jednego zespołu: mediana 50 najlepszych zespołów to 40% przewagi przy sumie sklepów i 2,6% przy produkcie w sklepie [@m5-wyniki]. Mimo to tylko 7,5% wszystkich zespołów w ogóle pobiło tę metodę statystyczną [@m5].

Skąd tak duża różnica między sumą a produktem? Weźmy sto indeksów, z których każdego sprzedajesz średnio cztery sztuki dziennie, losowo i niezależnie od pozostałych (przykład liczbowy na danych fikcyjnych). Sprzedaż jednego indeksu waha się typowo o dwie sztuki, czyli o połowę średniej. Wahania sumy rosną wolniej niż sama suma, bo przypadkowe skoki w górę i w dół się znoszą. Suma stu indeksów waha się więc o 20 sztuk na 400, czyli o 5%.

W sumie zostaje sygnał, którego model może się nauczyć: dzień tygodnia, święta, promocje i ceny. Sprzedaż jednego produktu w jednym sklepie to w dużej mierze przypadek, a w M5 aż 73% takich szeregów miało popyt przerywany, z wieloma dniami bez sprzedaży [@repr]. Przypadku nie przewidzi żaden model.

Najbliżej producenta jest poziom produktu zsumowanego po wszystkich sklepach, tak jak indeks zsumowany po wszystkich klientach. Tam zwycięzca mylił się o 4,6% mniej niż wygładzanie [@m5-wyniki]. Dane M5 to jednak dzienna sprzedaż w handlu, a tygodniowy popyt na wyrób u producenta jest zwykle mniej przypadkowy. U Ciebie przewaga AI może więc być większa. Właśnie to sprawdzi test opisany niżej.

## AI ma przewagę przy sumach, wielu indeksach i dobrych danych

Na poziomach od stanu USA do działu w sklepie zwycięzca M5 mylił się o 21–42% mniej niż wygładzanie wykładnicze [@m5-wyniki]. Jeśli planujesz zdolności produkcyjne dla rodziny wyrobów, zakupy surowca dla wielu wyrobów albo obsadę magazynu, zysk z lepszej metody może być duży. Spiliotis i współautorzy porównali też prognozy dziennego popytu na pojedyncze indeksy: część metod uczenia maszynowego była w nich trafniejsza od statystycznych i słabiej zawyżała albo zaniżała sprzedaż [@spiliotis].

Zwycięzcy M5 korzystali jednak z tego, czego większość firm nie ma. Prawie wszystkie czołowe zespoły uczyły modele wspólnie na setkach albo tysiącach powiązanych szeregów i używały danych o cenach, kalendarzu i wydarzeniach [@m5]. Same dane pochodziły z handlu detalicznego, a autorzy zastrzegają, że wniosków nie da się uogólnić poza ten obszar [@m5]. Istnieją też nowsze modele, wytrenowane wcześniej na wielu cudzych szeregach; ten tekst ich nie ocenia. Każdy z nich sprawdzisz jednak tym samym testem, bo liczy się wynik na Twoich danych.

## Trzy pytania do dostawcy, zanim podpiszesz umowę

Pierwsze: z jaką metodą porównywaliście? Prognoza naiwna to łatwy rywal, wygładzanie wykładnicze trudniejszy, a Twoja obecna prognoza to jedyny, który się liczy. Drugie: na jakim poziomie? Wynik dla sumy firmy nic nie mówi o indeksie w magazynie, co pokazał rysunek wyżej. Trzecie: na czyich danych? Poproś o test na swojej sprzedaży z ostatnich 26 tygodni, na poziomie i z wyprzedzeniem, z jakimi zamawiasz.

Te pytania przydadzą się przy każdej obietnicy. Blog Netguru, polskiej firmy tworzącej oprogramowanie, podaje, że „firmy wdrażające zaawansowane metody prognozowania oparte na sztucznej inteligencji zmniejszają błąd prognozy o 20–50% w porównaniu z tradycyjnymi statystycznymi punktami odniesienia” [@netguru]. Odnośnika do badania nie ma. Ten sam tekst przyznaje dalej, że dobrze dostrojone metody statystyczne często dorównują gradient boostingowi, jednej z metod uczenia maszynowego. Dotyczy to dojrzałych, szybko rotujących indeksów z co najmniej trzyletnią historią czystych danych, a różnica wynosi według autora 1–2 punkty procentowe błędu MAPE [@netguru].

Pilnuj, by model w pilotażu nie widział danych z tygodni, na których go oceniasz. Przegląd stanu wiedzy o prognozowaniu ostrzega, że dane testowe, miary i metody do porównania bywają dobrane tak, że przesadnie pokazują zalety nowej metody [@ftp]. Wynik testu wpisz do umowy jako warunek odbioru pilotażu. Może brzmieć na przykład tak (przykład liczbowy; to propozycja redakcji, a nie wzór umowy, więc brzmienie i próg ustal z prawnikiem):

> Ocena obejmuje dane sprzedaży Zamawiającego z ostatnich 26 tygodni dla uzgodnionej listy indeksów, na poziomie indeksu w magazynie i z wyprzedzeniem 6 tygodni. Średni błąd bezwzględny prognoz systemu będzie co najmniej o 10% niższy od błędu obecnej prognozy Zamawiającego i od błędu wygładzania wykładniczego. System nie korzysta z danych z tygodni objętych oceną.

Dopisz też koszt utrzymania: licencję, pracę ludzi i obliczenia. Autorzy M5 zwracają uwagę, że metoda nadaje się do użytku tylko wtedy, gdy koszt obliczeń setek tysięcy prognoz co tydzień nie jest zaporowy [@m5].

## Korekty planistów pomagają w nieco ponad połowie indeksów

W wielu firmach system liczy prognozę, a planista ją poprawia, bo wie o promocji u klienta albo o nowym zleceniu. Robert Fildes i współpracownicy zebrali dane o ponad 60 tysiącach prognoz z czterech firm z łańcuchów dostaw [@fildes2009]. W trzech z nich korekty średnio poprawiały trafność, a większe korekty pomagały bardziej niż małe. Małe korekty często psuły prognozę, a korekty w górę poprawiały ją dużo rzadziej niż te w dół [@fildes2009]. Częściej też szły w złą stronę: planista podnosił prognozę, choć sprzedaż wypadała poniżej prognozy systemu. Autorzy widzą w tym ogólną skłonność do optymizmu [@fildes2009].

W 2025 r. Fildes, Goodwin i De Baets połączyli publicznie dostępne dane z sześciu badań, razem około 147 tysięcy prognoz [@fva2025]. Korekty zmniejszały błąd i odchylenie, czyli systematyczne zawyżanie albo zaniżanie, tylko w nieco ponad połowie indeksów, a wyniki różniły się między zbiorami danych. Korekty w górę częściej szkodziły, a duże korekty w dół zwykle pomagały [@fva2025]. Autorzy nie znaleźli mocnych dowodów, że planiści skutecznie wykorzystują informacje niedostępne dla systemu. Wyglądało raczej na to, że reagują na sygnały, które mało mówią o przyszłej sprzedaży [@fva2025].

Bez pomiaru nikt nie wie, które korekty pomagają, także sam planista. Jeśli korekty nie wnoszą nowej informacji, sama prognoza systemu bywa lepsza od obecnego procesu [@ftp]. Wtedy pierwszy zysk leży w korektach, a nie w nowym systemie.

## Test trzech darmowych prognoz w trzech krokach

Wybierz około 20 indeksów. Wylosuj je z listy sprzedaży z roku przed testem, po kilka z grup A, B i C, razem z wycofanymi, bo tam korekty w górę mogły narobić najwięcej szkody. Dla każdego zbierz sprzedaż i prognozę z ostatnich 26–52 tygodni. Bierz prognozę, według której naprawdę zamawiałeś albo planowałeś produkcję. Jeśli system nadpisuje dawne prognozy, zacznij co tydzień zapisywać ich kopię. Po kwartale zrobisz pierwszy test, a po pół roku pełny.

### Krok 1. Dodaj trzy darmowe prognozy z tym samym wyprzedzeniem

Przegląd stanu wiedzy zaleca porównywać każdą nową metodę co najmniej z prognozą naiwną i z popularnymi metodami, takimi jak wygładzanie wykładnicze [@ftp]. Prognoza naiwna to ostatnia znana sprzedaż, średnia z czterech tygodni uśrednia cztery ostatnie znane tygodnie, a wygładzanie wykładnicze daje nowszym tygodniom większą wagę. Plik do pobrania liczy je sam. Wersję wygładzania z trendem i sezonowością ma Excel w narzędziu Arkusz prognozy na karcie Dane [@excel].

Darmowe prognozy mogą znać tylko tę sprzedaż, którą Ty znałeś. Jeśli prognozę na tydzień 20 robisz po zamknięciu tygodnia 14, wyprzedzenie wynosi 6. Prognoza naiwna to wtedy sprzedaż z tygodnia 14, a średnia to średnia z tygodni 11–14. Jeśli klienci przysyłają własne prognozy albo harmonogramy dostaw, dodaj je jako czwartą poprzeczkę. Gdy Twoja prognoza nie bije tego, co przysłał klient, Twój proces nic do niej nie dodaje.

### Krok 2. Policz błąd w sztukach i przelicz go na zapas

Dla każdego tygodnia weź różnicę między prognozą a sprzedażą, pomiń znak i policz średnią. To średni błąd bezwzględny (MAE, mean absolute error). Średniego błędu procentowego (MAPE) nie używaj przy indeksach, które miewają tygodnie bez sprzedaży, bo przy zerowej sprzedaży nie da się go policzyć [@hyndman]. Podziel swój błąd przez błąd prognozy naiwnej i przez błąd lepszej z dwóch pozostałych: średniej albo wygładzania. Wynik poniżej 1 znaczy, że Twoja prognoza myli się mniej.

Policz też odchylenie: sumę różnic prognoza minus sprzedaż, ze znakiem, podzieloną przez sumę sprzedaży. Wynik dodatni znaczy, że prognoza średnio zawyża sprzedaż, a jeśli zamawiasz według niej, zawyżasz też zapas.

Zapas bezpieczeństwa wyznacza się z rozrzutu błędu prognozy w czasie dostawy [@ftp]. W klasycznym wzorze, przy tym samym poziomie obsługi klienta, rośnie on proporcjonalnie do tego rozrzutu. Weźmy magazyn z zapasem bezpieczeństwa za 1,2 mln zł (przykład na danych fikcyjnych). Prognoza z błędem mniejszym o 10% pozwala zmniejszyć ten zapas mniej więcej o 120 tys. zł. Tę kwotę porównaj z ceną systemu.

### Krok 3. Zmierz wartość dodaną korekt

Porównaj błąd prognozy systemu przed korektą planisty i po niej. To wartość dodana prognozy (forecast value added, FVA): o ile każdy krok procesu zmniejsza błąd [@ftp]. Licz osobno korekty w górę i w dół, bo te pierwsze częściej szkodzą [@fva2025]. Gdy korekty psują prognozę, zmień zasady ich robienia. Fildes i Goodwin zalecają, by planista uzasadniał każdą korektę na piśmie, a firma regularnie sprawdzała, czy korekty pomagają [@fildes2007].

Weźmy jeden indeks kierownika z początku tekstu (dane fikcyjne, takie jak w pliku do pobrania). Sprzedaje się go około 125 sztuk tygodniowo, a prognoza planisty myli się średnio o 15,2 sztuki. Prognoza naiwna myli się tak samo, a średnia z czterech tygodni o 12,4 sztuki. System kierownika liczy właśnie tę średnią, zaokrągloną do całych sztuk, i myli się o 12,5 sztuki. Po korektach planisty, głównie w górę „na wszelki wypadek”, błąd rośnie do 15,2 sztuki, czyli o 22%. Według klasycznego wzoru korekty podnoszą więc zapas bezpieczeństwa tego indeksu mniej więcej o jedną piątą.

Na jednym indeksie różnica do 30% może jednak być przypadkiem. Tak wyszło w naszej symulacji na danych fikcyjnych, w której dwie równie dobre prognozy porównaliśmy na 26 tygodniach. Przy 20 indeksach liczonych razem przypadek przesuwał wynik już tylko o kilka procent. Dlatego plik traktuje różnicę do 5% jako remis, a rozstrzyga wynik dla wszystkich indeksów razem i to, w ilu z nich Twoja prognoza wygrywa:

| Wynik dla wszystkich indeksów | Co to znaczy | Co zrobić |
|---|---|---|
| Gorsza od naiwnej | Problem w procesie, nie w algorytmie | Sprawdź odchylenie i korekty, zwłaszcza małe i w górę |
| Nie gorsza od naiwnej, gorsza od średniej albo wygładzania | Prosta metoda dałaby mniejszy błąd za darmo | Przejdź na wygładzanie (przy trendzie i sezonowości w wersji, która je uwzględnia) i mierz dalej |
| Bije wszystkie darmowe prognozy | Proces działa, nowy system musi pobić Ciebie | Pilotaż ma sens przy setkach powiązanych indeksów i danych o cenach, promocjach i wydarzeniach |

## Kiedy test trzeba uzupełnić

Test działa najlepiej dla indeksów, które sprzedają się co tydzień i bez wielkich skoków. Przy sezonowości dodaj sezonową prognozę naiwną, czyli sprzedaż z tego samego tygodnia rok wcześniej; wymaga ona roku historii przed testem. Przy rosnącej sprzedaży średnia z czterech tygodni pokazuje poziom sprzed około dwóch i pół tygodnia i zaniża prognozę, więc porównuj się wtedy z wygładzaniem z trendem.

Przy indeksach, które w większości tygodni nie sprzedają się wcale, najmniejszy średni błąd w sztukach może mieć prognoza „zero” [@ftp]. Nikt nie zamówi według niej towaru, więc takie indeksy oceniaj osobno, po zapasie i poziomie obsługi klienta [@ftp]. Przy nowych wyrobach i jednorazowych zdarzeniach, takich jak duże zamówienie albo promocja, darmowe prognozy nie mają historii, a planista ma wiedzę, której system nie zna. Tu korekt nie zakazuj, tylko mierz je osobno. I pamiętaj, że w tygodniu, w którym towaru zabrakło, klienci kupili mniej, niż chcieli; taki tydzień oznacz albo pomiń.

## Policz własną przewagę AI na 20 indeksach

Kierownik planowania z początku tekstu nie musi zgadywać, czy oferta jest warta swojej ceny. W poniedziałek wyeksportuje z systemu sprzedaż i prognozy 20 indeksów z ostatniego półrocza i wklei je do pliku. Sprawdzi, czy jego prognoza bije darmowe, czy korekty planistów pomagają i ile zapasu kosztuje różnica. Z tym wynikiem pójdzie do dostawcy z trzema pytaniami.

Jeśli Twoja prognoza przegrywa z prostymi metodami, zacznij od nich i od korekt, które szkodzą. Nowy system kupuj dopiero wtedy, gdy będzie musiał pobić Ciebie, a nie średnią z czterech tygodni.
