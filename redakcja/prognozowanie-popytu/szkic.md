## W skrócie

**Problem.** Na blogu jednego z polskich dostawców przeczytasz, że AI zmniejsza błąd prognozy popytu o 20–50% względem metod statystycznych [@netguru]. Nie dowiesz się, na jakim poziomie i na czyich danych to zmierzono.

**Dlaczego.** W konkursie M5 zwycięska metoda AI myliła się o połowę mniej niż automatycznie dobierane wygładzanie wykładnicze, ale tylko przy sumie sprzedaży wszystkich sklepów. Przy pojedynczym produkcie w sklepie myliła się zaledwie o 3,3% mniej [@m5-wyniki]. Ręczne korekty planistów poprawiały prognozę w niewiele ponad połowie indeksów [@fva2025].

**Co zrobić.** Porównaj swoją prognozę z trzema darmowymi: naiwną, średnią z czterech okresów i wygładzaniem wykładniczym, na kilkunastu indeksach naraz i z takim wyprzedzeniem, z jakim zamawiasz. Zmierz też, czy korekty zmniejszają błąd. Gdy masz dane, arkusz do pobrania policzy to w godzinę.

## Przy pojedynczym produkcie AI ledwo pobiło prostą metodę

Weźmy kierownika planowania w zakładzie, który produkuje opakowania dla kilkudziesięciu klientów (to przykład, firma jest fikcyjna). Na biurku ma ofertę systemu prognoz z AI i obietnicę błędu mniejszego o jedną trzecią. W arkuszu ma prognozy, które jego planiści co tydzień poprawiają ręcznie. O tym, czy oferta jest coś warta, rozstrzyga pytanie, którego w niej nie ma: z czym ten system będzie się porównywał?

Najlepsza odpowiedź, jaką mamy, pochodzi z konkursu prognostycznego M5. Ponad 5 tysięcy zespołów prognozowało w nim sprzedaż 3 049 produktów w 10 sklepach sieci Walmart w trzech stanach USA, na 28 dni naprzód [@m5]. Wygrała metoda uczenia maszynowego zbudowana z 220 modeli drzew decyzyjnych [@m5]. Porównaliśmy ją z automatycznie dobieranym wygładzaniem wykładniczym, liczonym dla każdego produktu w każdym sklepie i potem zsumowanym. Przy łącznej sprzedaży wszystkich sklepów zwycięzca mylił się o 53,3% mniej. Przy pojedynczym produkcie w sklepie mylił się już tylko o 3,3% mniej [@m5-wyniki].

Zanim kupisz AI do prognoz, sprawdź więc, czy Twoja obecna prognoza bije proste metody, które masz za darmo, i na jakim poziomie potrzebujesz lepszej prognozy. Jeśli zamawiasz i planujesz indeks po indeksie, a Twoja prognoza nie bije prostych metod, największy zysk leży w nich, a nie w algorytmie. Takich ofert przybywa: według GUS odsetek polskich przedsiębiorstw, które używają jakiejkolwiek technologii sztucznej inteligencji, wzrósł w rok z 8,7% do 17,8% [@gus2026].

## Im bliżej pojedynczego produktu, tym mniej dokłada AI

Wygładzanie wykładnicze to średnia, w której nowsze okresy ważą więcej. W M5 należało do 24 metod porównawczych przygotowanych przez organizatorów, a jego wersja dobierana automatycznie wypadła najlepiej z nich w średniej ze wszystkich poziomów [@m5]. Sprawdziliśmy w pliku wyników organizatorów, o ile zwycięzca pobił ją na każdym z 12 poziomów, od sumy sklepów po produkt w sklepie. Rysunek pokazuje, że przewaga topnieje tam, gdzie zaczyna się pojedynczy produkt.

![Wykres słupkowy: o ile mniej mylił się zwycięzca konkursu M5 niż automatycznie dobierane wygładzanie wykładnicze na każdym z 12 poziomów danych. Suma 10 sklepów 53,3%, stan USA 39,7%, sklep 31,1%, kategoria 42,1%, dział 34,4%, stan i kategoria 32,5%, stan i dział 27,5%, sklep i kategoria 25,3%, sklep i dział 21,4%, produkt łącznie we wszystkich sklepach 4,6%, produkt w stanie 4,2%, produkt w sklepie 3,3%.](../../assets/rysunki/prognozowanie-popytu-1.svg "Rysunek 1. Im bliżej pojedynczego produktu, tym mniej zwycięzca M5 dokładał ponad automatyczne wygładzanie wykładnicze. Źródło: obliczenia redakcji na pliku wyników konkursu M5 (Scores and Ranks.xlsx).")

To nie jest szczęście jednego zespołu. Mediana 50 najlepszych zespołów daje ten sam obraz: 40% przewagi przy sumie sklepów i 2,6% przy produkcie w sklepie [@m5-wyniki]. Liczba dla sumy sklepów opiera się przy tym na jednym szeregu, czyli jednej historii sprzedaży, i 28 dniach, więc pokazuje kierunek, a nie dokładną miarę.

Najbliżej producenta jest poziom produktu zsumowanego po wszystkich sklepach, tak jak indeks zsumowany po wszystkich klientach. Tam zwycięzca mylił się o 4,6% mniej niż wygładzanie [@m5-wyniki]. Dane M5 to jednak dzienna sprzedaż w handlu. Tygodniowy popyt na wyrób u producenta jest zwykle mniej przypadkowy, a surowce i zdolności planujesz na sumach z wielu wyrobów. U Ciebie przewaga AI może więc być większa i właśnie dlatego trzeba ją zmierzyć.

## Prosta metoda to poprzeczka, której większość nie przeskakuje

M5 był pierwszym konkursem, w którym wszystkie czołowe metody były czystym uczeniem maszynowym i wyraźnie wygrały z metodami statystycznymi [@m5]. Mimo to tylko 7,5% zespołów pobiło automatycznie dobierane wygładzanie wykładnicze [@m5]. Większość uczestników przegrała z metodą, którą organizatorzy dali wszystkim jako punkt odniesienia.

We wcześniejszych porównaniach uczenie maszynowe wypadało jeszcze słabiej. W konkursie M4, na 100 tysiącach szeregów [@m4], żadna z pięciu metod, które organizatorzy zaliczyli do czystego uczenia maszynowego, nie pobiła prostej średniej z trzech odmian wygładzania wykładniczego [@m4-wyniki, @plos]. Trzecie miejsce zajął tam zespół wrocławskiej firmy ProLogistica Soft z kombinacją samych metod statystycznych [@m4-wyniki, @prologistica]. Na 1 045 miesięcznych szeregach z konkursu M3 sześć najdokładniejszych metod było statystycznych, ale modele uczono tam osobno na każdym szeregu, a szeregi były krótkie [@plos].

## Korekty planistów pomagają w nieco ponad połowie indeksów

W wielu firmach system liczy prognozę, a planista ją poprawia, bo wie o promocji u klienta albo o nowym zleceniu. Robert Fildes i współpracownicy zebrali dane o ponad 60 tysiącach prognoz z czterech firm z łańcuchów dostaw [@fildes2009]. W trzech z nich korekty średnio poprawiały trafność, a większe korekty pomagały bardziej niż małe. Małe korekty często psuły prognozę, a korekty w górę dużo rzadziej ją poprawiały niż korekty w dół [@fildes2009]. Częściej też szły w złą stronę: planista podnosił prognozę, choć sprzedaż wypadała poniżej prognozy systemu. Autorzy widzą w tym ogólną skłonność do optymizmu [@fildes2009].

W 2025 r. Fildes, Goodwin i De Baets przeanalizowali wspólnie publicznie dostępne dane o około 147 tysiącach prognoz z sześciu badań [@fva2025]. Korekty zmniejszały błąd i odchylenie, czyli systematyczne zawyżanie albo zaniżanie, tylko w niewiele ponad połowie indeksów, z różnicami między zbiorami danych. Korekty w górę częściej szkodziły, a duże korekty w dół zwykle pomagały [@fva2025]. Autorzy nie znaleźli mocnych dowodów, że planiści skutecznie wykorzystują informacje niedostępne dla systemu. Wyglądało raczej na to, że reagują na sygnały, które mało mówią o przyszłej sprzedaży [@fva2025].

To nie jest zarzut wobec planistów. Bez pomiaru nikt nie wie, które korekty pomagają. Te wyniki przemawiają też za prognozą liczoną automatycznie: jeśli korekty nie wnoszą nowej informacji, prognoza bez nich bywa lepsza od obecnego procesu [@ftp]. Pomiar nie jest powszechny. W ankiecie 120 osób zajmujących się prognozami, głównie uczestników konferencji branżowych w USA, co czwarta nie wskazała żadnej miary błędu prognozy [@fildes2007]. Tylko 52,8% deklarowało, że sprawdza, czy korekty poprawiają trafność [@fildes2007].

Znaleźliśmy tylko jedno polskie badanie metod prognozowania. W 2010 r. 89,1% z 715 ankietowanych sklepów internetowych wskazało w nim, że o sprzedaży i zapasach decyduje na wyczucie i doświadczenie handlowców [@chodak]. Nowszych danych o polskich producentach i dystrybutorach nie znaleźliśmy.

## Na pojedynczym indeksie przypadek zjada większość przewagi modelu

Weźmy sto indeksów, z których każdy sprzedaje losowo, niezależnie od pozostałych, średnio cztery sztuki dziennie (przykład liczbowy na danych fikcyjnych). Sprzedaż jednego indeksu ma odchylenie standardowe dwóch sztuk, czyli połowy średniej. Suma stu indeksów ma odchylenie 20 sztuk na 400, czyli 5%.

W sumie przypadkowe wahania się znoszą i zostaje sygnał, którego model może się nauczyć: dzień tygodnia, święta, promocje i ceny. Sprzedaż jednego produktu w jednym sklepie to w dużej mierze przypadek. Według analizy współautorów konkursu 73% takich szeregów w M5 miało popyt przerywany, z wieloma dniami bez sprzedaży [@repr]. Tej części błędu nie usunie żaden model. Dla wszystkich metod zostaje niewiele do wygrania.

Zwycięzcy M5 korzystali też z tego, czego większość firm nie ma. Prawie wszystkie czołowe zespoły uczyły modele wspólnie na setkach albo tysiącach powiązanych szeregów, na przykład na wszystkich produktach jednego sklepu. Używały też danych spoza historii sprzedaży, takich jak ceny, kalendarz i wydarzenia [@m5]. Zanim zapłacisz za algorytm, sprawdź, czy masz takie dane i wystarczająco wiele podobnych indeksów.

## AI ma przewagę przy sumach, wielu indeksach i dobrych danych

Na poziomach od stanu USA do działu w sklepie zwycięzca M5 mylił się o 21–42% mniej niż wygładzanie wykładnicze [@m5-wyniki]. Jeśli planujesz zdolności produkcyjne dla rodziny wyrobów, zakupy surowca dla wielu wyrobów albo obsadę magazynu, zysk z lepszej metody może być duży. W porównaniu prognoz dziennego popytu indeksów część metod uczenia maszynowego była lepsza od metod statystycznych pod względem trafności i odchylenia [@spiliotis].

Dane M5 pochodzą jednak z handlu detalicznego, a autorzy sami piszą, że wniosków nie da się uogólnić poza obszar, z którego pochodzą dane [@m5]. Miara konkursu ważyła produkty ich sprzedażą w dolarach, więc według autorów zwycięzcy skupiali się na drogich i szybko rotujących produktach [@m5]. Dostawcy oferują dziś także nowsze modele, wytrenowane wcześniej na wielu cudzych szeregach, których ten tekst nie ocenia. Test opisany niżej działa dla każdej metody tak samo: liczy się wynik na Twoich danych.

## Test w trzech krokach pokaże, czy Twoja prognoza coś wnosi

Wybierz około 20 indeksów. Wylosuj je z listy sprzedaży z roku przed testem, po kilka z grup A, B i C. Nie pomijaj wycofanych, bo tam korekty w górę mogły narobić najwięcej szkody. Dla każdego zbierz sprzedaż i prognozę z ostatnich 26–52 tygodni. Bierz prognozę, z którą naprawdę zamawiałeś albo planowałeś produkcję. Jeśli system nadpisuje dawne prognozy, zacznij co tydzień zapisywać ich kopię. Po kwartale będziesz mieć dane do testu.

### Krok 1. Dodaj darmowe prognozy z tym samym wyprzedzeniem

Prognoza naiwna to ostatnia znana sprzedaż. Średnia z czterech okresów to średnia z czterech ostatnich znanych tygodni. Wygładzanie wykładnicze w wersji z trendem i sezonowością liczy Excel w narzędziu Arkusz prognozy na karcie Dane [@excel], a arkusz do tego tekstu liczy wersję prostą.

Darmowe prognozy mogą znać tylko tę sprzedaż, którą Ty znałeś. Jeśli prognozę na tydzień 20 robisz po zamknięciu tygodnia 14, wyprzedzenie wynosi 6. Prognoza naiwna to wtedy sprzedaż z tygodnia 14, a średnia to średnia z tygodni 11–14. Jeśli klienci przysyłają własne prognozy albo harmonogramy dostaw, dodaj je jako czwartą poprzeczkę. Gdy Twoja prognoza nie bije tego, co przysłał klient, korekty nie wnoszą nic. Przegląd stanu wiedzy o prognozowaniu zaleca porównywać każdą nową metodę co najmniej z prognozą naiwną i z popularnymi metodami, takimi jak wygładzanie wykładnicze [@ftp].

### Krok 2. Policz błąd w sztukach, nie w procentach

Dla każdego tygodnia weź różnicę między prognozą a sprzedażą bez znaku i policz średnią. To średni błąd bezwzględny (MAE, mean absolute error). Nie używaj średniego błędu procentowego (MAPE) przy indeksach, które bywają bez sprzedaży, bo przy zerowej sprzedaży nie da się go policzyć [@hyndman]. Podziel swój błąd przez błąd prognozy naiwnej i przez błąd lepszej z dwóch pozostałych: średniej albo wygładzania. Wynik poniżej 1 znaczy, że Twoja prognoza myli się mniej.

Policz też odchylenie: sumę różnic prognoza minus sprzedaż, tym razem ze znakiem, podzieloną przez sumę sprzedaży. Wynik dodatni znaczy, że prognoza średnio zawyża sprzedaż. Jeśli zamówienia idą za prognozą, zawyża też zapas.

### Krok 3. Zmierz wartość dodaną korekt

Jeśli system liczy prognozę, a planista ją poprawia, porównaj błąd przed korektą i po niej. To wartość dodana prognozy (forecast value added, FVA): o ile każdy krok procesu zmniejsza błąd [@ftp]. Licz osobno korekty w górę i w dół, bo te pierwsze częściej szkodzą [@fva2025].

Gdy korekty psują prognozę, zmień zasady ich robienia. Fildes i Goodwin zalecają, by planista uzasadniał każdą korektę na piśmie, a firma regularnie sprawdzała, czy korekty pomagają [@fildes2007]. W analizie 147 tysięcy prognoz wyniki poprawiła też procedura usuwania odchylenia z prognoz po korekcie [@fva2025].

Tak wygląda wynik w przykładzie na danych fikcyjnych. Indeks sprzedaje około 125 sztuk tygodniowo, a prognoza planisty myli się średnio o 15,2 sztuki. Prognoza naiwna myli się tak samo, a średnia z czterech tygodni o 12,4 sztuki. Arkusz „Korekty” pokazuje przyczynę. System liczy tę samą średnią, tylko zaokrągloną do sztuk, i myli się o 12,5 sztuki. Po korektach planisty, głównie w górę „na wszelki wypadek”, błąd rośnie do 15,2 sztuki, czyli o 22%.

Jeden indeks niczego jednak nie rozstrzyga. W symulacji redakcji na danych fikcyjnych dwie równie dobre prognozy, które mylą się podobnie, porównano na 26 tygodniach. W 9 porównaniach na 10 różnica ich błędów wynosiła do 23–30%, a w co dziesiątym była większa. Przy 20 indeksach o podobnej sprzedaży, liczonych razem, rozrzut spadł do około 6%. Patrz więc na wynik dla wszystkich indeksów razem i na to, w ilu indeksach Twoja prognoza wygrywa. Ten wynik wskazuje jedną z trzech dróg:

| Wynik dla wszystkich indeksów | Co to znaczy | Co zrobić |
|---|---|---|
| Gorsza od naiwnej | Problem w procesie, nie w algorytmie | Sprawdź odchylenie i korekty, zwłaszcza małe i w górę |
| Nie gorsza od naiwnej, gorsza od średniej albo wygładzania | Prosta metoda dałaby mniejszy błąd za darmo | Przejdź na wygładzanie (przy trendzie i sezonowości w wersji, która je uwzględnia) i mierz dalej |
| Bije wszystkie darmowe prognozy | Proces działa, nowy system musi pobić Ciebie | Pilotaż ma sens przy setkach powiązanych indeksów i danych o cenach, promocjach i wydarzeniach |

Arkusz uznaje różnicę do pięciu procent w każdą stronę za remis. To umowna granica redakcji. Przy wyniku z wielu indeksów ma sens, przy jednym indeksie nie.

## Średnia z czterech okresów nie jest uczciwą poprzeczką dla każdego indeksu

Test działa najlepiej dla indeksów, które sprzedają się co tydzień i bez wielkich skoków. W czterech sytuacjach trzeba go uzupełnić.

Pierwsza to sezonowość. Jeśli wyrób sprzedaje się latem trzy razy lepiej niż zimą, dodaj sezonową prognozę naiwną: sprzedaż z tego samego tygodnia rok wcześniej. Organizatorzy M5 też jej użyli, tyle że z cyklem tygodniowym: sprzedaż z tego samego dnia tydzień wcześniej [@m5]. Roczna wersja wymaga roku historii przed pierwszym ocenianym tygodniem.

Druga to trend. Średnia z czterech okresów pokazuje poziom sprzed około dwóch i pół tygodnia, więc przy rosnącej sprzedaży ją zaniża. Wtedy Twoja prognoza może bić średnią, choć nic nie wnosi ponad prognozę naiwną albo wygładzanie z trendem.

Trzecia to popyt przerywany. Przy indeksach, które w większości tygodni nie sprzedają się wcale, najmniejszy średni błąd w sztukach może mieć prognoza „zero” [@ftp]. Nikt nie zamówi według niej towaru, więc takie indeksy oceniaj osobno, po zapasie i poziomie obsługi klienta, a nie po samym błędzie [@ftp].

Czwarta to nowe wyroby i jednorazowe zdarzenia, takie jak duże zamówienie klienta albo promocja. Tu darmowe prognozy nie mają historii, a planista ma wiedzę, której system nie zna. Korekt nie zakazuj, tylko mierz je osobno. Pamiętaj też, że sprzedaż to nie zawsze popyt: w tygodniu, w którym towaru zabrakło, sprzedaż była niższa od tego, co klienci chcieli kupić. Takie tygodnie oznacz w arkuszu albo pomiń.

## Trzy pytania do dostawcy, zanim podpiszesz umowę

Netguru to polska firma tworząca oprogramowanie. Na jej blogu przeczytasz, że „firmy wdrażające zaawansowane metody prognozowania oparte na sztucznej inteligencji zmniejszają błąd prognozy o 20–50% w porównaniu z tradycyjnymi statystycznymi punktami odniesienia” [@netguru]. Autor powołuje się na analizę firmy doradczej, ale nie podaje do niej odnośnika.

Ten sam tekst przyznaje dalej, że dobrze dostrojone metody statystyczne często dorównują gradient boostingowi, jednej z metod uczenia maszynowego. Dotyczy to dojrzałych, szybko rotujących indeksów z co najmniej trzyletnią historią czystych danych, a różnica wynosi według autora 1–2 punkty procentowe błędu MAPE [@netguru]. Obietnica z pierwszego zdania i zastrzeżenie z drugiego dotyczą innych sytuacji. Dlatego zadaj dostawcy trzy pytania.

Pierwsze: z jaką metodą porównywaliście? Prognoza naiwna to łatwy rywal, wygładzanie wykładnicze trudniejszy, a Twoja obecna prognoza to jedyny, który się liczy. Drugie: na jakim poziomie? Wynik dla sumy firmy nic nie mówi o indeksie w magazynie, co pokazał rysunek wyżej. Trzecie: na czyich danych? Poproś o test na Twojej sprzedaży z ostatnich 26 tygodni, na poziomie, na którym zamawiasz, z prognozą liczoną z Twoim wyprzedzeniem.

Pilnuj, by model w pilotażu nie widział danych z tygodni, na których go oceniasz. Przegląd stanu wiedzy ostrzega, że dane testowe, miary i metody do porównania bywają dobrane tak, że przesadnie pokazują zalety nowej metody [@ftp]. Nawet cytowany wyżej tekst dostawcy pisze, że dopuszczenie przyszłych danych do uczenia to najszybszy sposób na model, który w fazie budowy wygląda na dokładny, a w działaniu zawodzi [@netguru]. Wynik testu wpisz do umowy jako warunek odbioru pilotażu i dopisz koszt utrzymania. Autorzy M5 zwracają uwagę, że metoda nadaje się do użytku tylko wtedy, gdy koszt obliczeń setek tysięcy prognoz co tydzień nie jest zaporowy [@m5].

## Policz własną przewagę AI na 20 indeksach

Kierownik planowania z początku tego tekstu nie musi zgadywać, czy oferta jest warta swojej ceny. W konkursie z ponad 5 tysiącami zespołów przewaga najlepszej metody nad prostym wygładzaniem wynosiła połowę przy sumie sklepów i kilka procent przy pojedynczym produkcie [@m5-wyniki]. Ile wyniesie u niego, pokaże tylko test na jego danych.

W poniedziałek wyeksportuj z systemu sprzedaż i prognozy 20 indeksów z ostatniego półrocza i wklej je do arkusza. Jeśli Twoja prognoza nie bije prostych metod, zacznij od nich i od korekt, które szkodzą. Nowy system rozważ wtedy, gdy będzie miał co pobić.
