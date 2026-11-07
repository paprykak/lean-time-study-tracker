## W skrócie

**Problem.** Na blogu jednego z polskich dostawców przeczytasz, że AI zmniejsza błąd prognozy popytu o 20–50% względem metod statystycznych [@netguru]. Nie dowiesz się, na jakim poziomie i na czyich danych to zmierzono.

**Dlaczego.** W konkursie M5 automatycznie dobierane wygładzanie wykładnicze, czyli prosta metoda statystyczna, dało około 88% poprawy, jaką zwycięska metoda uczenia maszynowego uzyskała względem prognozy naiwnej [@m5-wyniki]. Resztę dołożyło AI: 43,2% przy sprzedaży wszystkich sklepów razem i 2,3% przy pojedynczym produkcie w sklepie [@m5-wyniki].

**Co zrobić.** Porównaj swoją prognozę z trzema darmowymi: naiwną, średnią z czterech okresów i wygładzaniem wykładniczym, na kilkunastu indeksach naraz. Sprawdź też, czy korekty planistów zmniejszają błąd, bo w badaniach firm robiły to w niewiele ponad połowie indeksów [@fva2025]. Arkusz do pobrania liczy to w godzinę.

## Prosta metoda przeszła prawie całą drogę, AI dołożyło resztę

Prognoza naiwna to najprostsza możliwa: na jutro przyjmujesz to, co sprzedałeś dziś. W konkursie M5 zwycięska metoda uczenia maszynowego myliła się średnio o 70,3% mniej niż ona [@m5-wyniki]. Automatycznie dobierane wygładzanie wykładnicze, liczone osobno dla każdego produktu bez żadnych danych o cenach i promocjach, myliło się o 61,7% mniej [@m5-wyniki]. Wygładzanie wykładnicze, którego jedną z wersji ma nawet Excel [@excel], przeszło więc około 88% drogi, którą przeszła zwycięska metoda AI. Na każdym z 12 poziomów danych, od wszystkich sklepów razem po pojedynczy produkt w sklepie, wynik mieścił się między 87% a 92% [@m5-wyniki].

Zanim kupisz AI do prognoz, sprawdź więc, czy Twoja obecna prognoza bije proste metody, które masz za darmo. Jeśli ich nie bije, największy zysk leży w nich, a nie w algorytmie. Oferty prognoz z AI trafią też do Ciebie. Według GUS odsetek polskich przedsiębiorstw, które używają jakiejkolwiek technologii sztucznej inteligencji, wzrósł w rok z 8,7% do 17,8% [@gus2026]. Niżej znajdziesz dowody z konkursów i z badań w firmach, test na własnych danych w trzech krokach i trzy pytania do dostawcy.

M5 to jeden z największych konkursów prognostycznych. Ponad 5 tysięcy zespołów prognozowało w nim sprzedaż 3 049 produktów w 10 sklepach sieci Walmart w trzech stanach USA, na 28 dni naprzód [@m5]. Ocenie podlegały 42 840 szeregów, czyli historii sprzedaży: od łącznej sprzedaży wszystkich 10 sklepów po każdy produkt w każdym sklepie [@m5]. Wygrała metoda zbudowana z 220 modeli drzew decyzyjnych (LightGBM), w której każdy szereg prognozowała średnia z sześciu z nich [@m5].

## Im bliżej pojedynczego produktu, tym mniej dokłada AI

Sprawdziliśmy, ile zwycięzca dołożył ponad najlepszą metodę porównawczą na każdym z 12 poziomów. Organizatorzy przygotowali 24 takie metody, głównie statystyczne. Przy łącznej sprzedaży wszystkich sklepów zwycięska metoda myliła się o 43,2% mniej niż najlepsza z nich. Przy pojedynczym produkcie w jednym sklepie już tylko o 2,3% mniej [@m5-wyniki].

![Wykres słupkowy: o ile zwycięzca konkursu M5 mylił się mniej niż najlepsza metoda porównawcza na każdym z 12 poziomów danych. Suma 10 sklepów 43,2%, stan USA 37,3%, sklep 31,1%, kategoria 36,9%, dział 34,4%, stan i kategoria 32,5%, stan i dział 27,5%, sklep i kategoria 25,3%, sklep i dział 21,4%, produkt łącznie we wszystkich sklepach 4,2%, produkt w stanie 3,2%, produkt w sklepie 2,3%.](../../assets/rysunki/prognozowanie-popytu-1.svg "Rysunek 1. Im bliżej pojedynczego produktu w sklepie, tym mniej zwycięzca M5 dokładał ponad najlepszą na danym poziomie metodę porównawczą. Źródło: obliczenia redakcji na pliku wyników konkursu M5 (Scores and Ranks.xlsx).")

Na każdym poziomie najlepsza była inna metoda porównawcza. Przy sumach najlepiej wypadło wygładzanie wykładnicze z danymi o świętach i wydarzeniach, a przy produktach średnia dwóch wariantów wygładzania [@m5-wyniki]. Takiej metody nie da się wybrać z góry. Porównanie raczej zaniża więc przewagę zwycięzcy. Liczba dla sumy sklepów pochodzi też z jednego szeregu i 28 dni, więc pokazuje kierunek, a nie dokładną miarę. Mediana 50 najlepszych zespołów daje ten sam obraz: 27% przewagi przy sumie sklepów i 1,6% przy produkcie w sklepie [@m5-wyniki].

Te 2,3% dotyczą dziennej sprzedaży jednego produktu w jednym sklepie [@m5-wyniki]. Tygodniowy popyt na wyrób u producenta jest mniej przypadkowy, a surowce i zdolności planujesz na sumach z wielu wyrobów. U Ciebie przewaga AI może więc być większa. Właśnie dlatego trzeba ją zmierzyć, zamiast przyjmować na wiarę liczbę z konkursu albo z oferty.

## Wcześniejsze konkursy dawały uczeniu maszynowemu jeszcze mniej

W poprzedniej edycji, M4, prognozowano 100 tysięcy szeregów [@m4]. Organizatorzy zaliczyli pięć zgłoszonych metod do czystego uczenia maszynowego. Żadna z nich nie pobiła prostej średniej z trzech odmian wygładzania wykładniczego [@m4-wyniki], używanej jako metoda porównawcza (Comb) [@plos]. Tylko jedna pobiła prognozę naiwną z poprawką na sezonowość [@m4-wyniki]. Zwycięzca łączył wygładzanie wykładnicze z siecią neuronową [@m5] i według miary konkursu był o 8,6% dokładniejszy od tej średniej [@m4-wyniki]. Trzecie miejsce zajął zespół wrocławskiej firmy ProLogistica Soft z kombinacją samych metod statystycznych [@m4-wyniki, @prologistica].

Ci sami organizatorzy porównali też 8 metod statystycznych z 10 metodami uczenia maszynowego na 1 045 miesięcznych szeregach z wcześniejszego konkursu M3. Sześć najdokładniejszych metod było statystycznych, a prognoza naiwna z poprawką na sezonowość wypadła lepiej od połowy metod uczenia maszynowego [@plos]. Autorzy zastrzegają, że wynik może zależeć od danych, między innymi od długości szeregów [@plos].

Te porównania dotyczyły modeli uczonych osobno na każdym szeregu. M5 był pierwszym konkursem, w którym wszystkie czołowe metody były czystym uczeniem maszynowym i wyraźnie wygrały z metodami statystycznymi [@m5]. Nawet tam tylko 7,5% zespołów pobiło automatycznie dobierane wygładzanie wykładnicze, liczone dla każdego produktu w sklepie i sumowane w górę [@m5]. Większość uczestników przegrała z metodą, której zespoły nie musiały same budować.

## Korekty planistów pomagają w nieco ponad połowie indeksów

W wielu firmach system liczy prognozę, a planista ją poprawia, bo wie o promocji u klienta albo o nowym zleceniu. Robert Fildes i współpracownicy zebrali dane o ponad 60 tysiącach prognoz z czterech firm z łańcuchów dostaw [@fildes2009]. W trzech z nich korekty średnio poprawiały trafność, a większe korekty pomagały bardziej niż małe [@fildes2009]. Małe korekty często psuły prognozę, a korekty w górę dużo rzadziej ją poprawiały niż korekty w dół. Częściej też szły w złą stronę, co autorzy odczytują jako ogólną skłonność do optymizmu [@fildes2009].

W 2025 r. Fildes, Goodwin i De Baets przeanalizowali wspólnie publicznie dostępne dane o około 147 tysiącach prognoz z sześciu badań [@fva2025]. Korekty poprawiały trafność i odchylenie tylko w niewiele ponad połowie indeksów, z różnicami między zbiorami danych. Korekty w górę częściej szkodziły, a duże korekty w dół zwykle pomagały [@fva2025]. Autorzy nie znaleźli mocnych dowodów, że planiści skutecznie wykorzystują informacje niedostępne dla systemu. Wyglądało raczej na to, że reagują na sygnały bez znaczenia albo o małej wartości [@fva2025].

Te wyniki działają też na korzyść systemu. Jeśli korekty nie wnoszą nowej informacji, prognoza liczona automatycznie, bez nich, bywa lepsza od obecnego procesu. Nie wszyscy to sprawdzają. W ankiecie 120 osób zajmujących się prognozami, głównie uczestników konferencji branżowych w USA, co czwarta nie wskazała żadnej miary błędu prognozy [@fildes2007]. Tylko 52,8% deklarowało, że sprawdza, czy korekty poprawiają trafność [@fildes2007].

Znaleźliśmy tylko jedno polskie badanie metod prognozowania. W 2010 r. 89,1% z 715 ankietowanych sklepów internetowych wskazało w nim, że o sprzedaży i zapasach decyduje na wyczucie i doświadczenie handlowców [@chodak]. Nowszych danych o polskich producentach i dystrybutorach nie znaleźliśmy.

## Na pojedynczym indeksie przypadek zjada większość przewagi modelu

Weźmy sto indeksów, z których każdy sprzedaje losowo, niezależnie od pozostałych, średnio cztery sztuki dziennie (przykład liczbowy na danych fikcyjnych). Sprzedaż jednego indeksu ma odchylenie standardowe dwóch sztuk, czyli połowy średniej. Suma stu indeksów ma odchylenie 20 sztuk na 400, czyli 5%.

Przy sumie przypadkowe wahania się znoszą i zostaje sygnał, którego model może się nauczyć: dzień tygodnia, święta, promocje i ceny. Sprzedaż jednego produktu w jednym sklepie to w dużej mierze przypadek. Według analizy współautorów konkursu 73% takich szeregów w M5 miało popyt przerywany, z wieloma dniami bez sprzedaży, a kolejne 17% popyt nieregularny [@repr]. Tej części błędu nie usunie żaden model. Dla wszystkich metod zostaje niewiele do wygrania.

Zwycięzcy M5 korzystali też z tego, czego większość firm nie ma. Prawie wszystkie czołowe zespoły uczyły modele wspólnie na setkach albo tysiącach powiązanych szeregów, na przykład na wszystkich produktach jednego sklepu. Używały też danych spoza historii sprzedaży, takich jak ceny, kalendarz i wydarzenia [@m5].

Dane o wydarzeniach pomagały też prostym metodom. Organizatorzy dodali do wygładzania wykładniczego informację o świętach, wydarzeniach specjalnych i dniach zakupów na bony żywnościowe. Taki model był o 5,7% dokładniejszy niż ten sam bez niej, a model ARIMA o 13,2% [@m5-wyniki, @m5]. Zanim zapłacisz za algorytm, sprawdź, czy masz takie dane i czy prosta metoda z ich dodatkiem nie wystarczy.

## AI ma przewagę przy sumach, wielu indeksach i dobrych danych

Nie wynika z tego, że uczenie maszynowe w prognozach nic nie daje. Na poziomach od stanu USA do działu w sklepie przewaga zwycięzcy M5 wynosiła od 21,4% do 37,3% [@m5-wyniki]. Jeśli planujesz zdolności produkcyjne dla rodziny wyrobów, zakupy surowca dla wielu wyrobów albo obsadę magazynu, zysk może być duży. W porównaniu prognoz dziennego popytu indeksów część metod uczenia maszynowego była lepsza od metod statystycznych pod względem trafności i odchylenia [@spiliotis].

Granice tych wyników trzeba znać. Dane M5 pochodzą z handlu detalicznego, a autorzy sami piszą, że wniosków nie da się uogólnić poza obszar, z którego pochodzą dane [@m5]. Miara konkursu ważyła produkty ich sprzedażą w dolarach, więc według autorów zwycięzcy skupiali się na drogich i szybko rotujących produktach [@m5]. Ten tekst nie obejmuje też nowszych, wstępnie wytrenowanych modeli do szeregów czasowych. Dlatego zamiast przenosić wynik z konkursu na swoją firmę, zmierz go na własnych danych.

## Test w trzech krokach pokaże, czy Twoja prognoza coś wnosi

Wybierz około 20 indeksów. Wylosuj je z listy sprzedaży z roku przed testem, po kilka z grup A, B i C. Nie pomijaj wycofanych, bo tam korekty w górę mogły narobić najwięcej szkody. Dla każdego zbierz sprzedaż i prognozę z ostatnich 26–52 tygodni. Bierz prognozę, z którą naprawdę zamawiałeś albo planowałeś produkcję, zrobioną z takim samym wyprzedzeniem. Jeśli system nadpisuje dawne prognozy, zacznij co tydzień zapisywać ich kopię. Po kwartale będziesz mieć dane do testu.

### Krok 1. Dodaj trzy darmowe prognozy z tym samym wyprzedzeniem

Prognoza naiwna to ostatnia znana sprzedaż. Średnia z czterech okresów to średnia z czterech ostatnich znanych tygodni. Wygładzanie wykładnicze to średnia, w której nowsze tygodnie ważą więcej. Excel liczy je w narzędziu Arkusz prognozy na karcie Dane [@excel], a arkusz do tego tekstu robi to sam.

Darmowe prognozy muszą znać tylko tę sprzedaż, którą Ty znałeś. Jeśli prognozę na tydzień 20 robisz w tygodniu 14, naiwna to sprzedaż z tygodnia 13, a średnia to średnia z tygodni 10–13. Przegląd stanu wiedzy o prognozowaniu, który napisało około 80 badaczy, zaleca porównywać każdą nową metodę co najmniej z prognozą naiwną i z popularnymi metodami, takimi jak wygładzanie wykładnicze [@ftp].

### Krok 2. Policz błąd w sztukach, nie w procentach

Dla każdego tygodnia weź różnicę między prognozą a sprzedażą bez znaku i policz średnią. To średni błąd bezwzględny (MAE, mean absolute error). Nie używaj średniego błędu procentowego (MAPE) przy indeksach, które bywają bez sprzedaży, bo przy zerowej sprzedaży nie da się go policzyć [@hyndman]. Podziel swój błąd przez błąd najlepszej z darmowych prognoz. Wynik poniżej 1 znaczy, że Twoja prognoza myli się mniej.

Policz też odchylenie: sumę różnic prognoza minus sprzedaż, tym razem ze znakiem, podzieloną przez sumę sprzedaży. Wynik dodatni znaczy, że prognoza średnio zawyża sprzedaż. Jeśli zamówienia idą za prognozą, zawyża też zapas.

### Krok 3. Zmierz wartość dodaną korekt

Jeśli system liczy prognozę, a planista ją poprawia, porównaj błąd przed korektą i po niej. To wartość dodana prognozy (forecast value added, FVA): o ile każdy krok procesu zmniejsza błąd [@ftp]. Licz osobno korekty w górę i w dół, bo te pierwsze częściej szkodzą [@fva2025].

Gdy korekty psują prognozę, zmień zasady ich robienia. Fildes i Goodwin zalecają, by planista uzasadniał każdą korektę na piśmie, a firma regularnie sprawdzała, czy korekty pomagają [@fildes2007]. W analizie 147 tysięcy prognoz wyniki poprawiła też procedura usuwania odchylenia, czyli systematycznego zawyżania albo zaniżania, z prognoz po korekcie [@fva2025].

Tak wygląda wynik w przykładzie na danych fikcyjnych. Indeks sprzedaje około 125 sztuk tygodniowo, a prognoza planisty myli się średnio o 15,2 sztuki. Prognoza naiwna myli się tak samo, a średnia z czterech tygodni o 12,4 sztuki. Arkusz „Korekty” pokazuje przyczynę. System, który liczy właśnie średnią, mylił się o 12,5 sztuki, a po korektach planisty, głównie w górę „na wszelki wypadek”, o 15,2, czyli o 22% więcej.

Jeden indeks niczego jednak nie rozstrzyga. W symulacji redakcji na danych fikcyjnych dwie równie dobre prognozy porównane na 26 tygodniach różniły się przez sam przypadek nawet o 23–30%. Przy 20 indeksach liczonych razem rozrzut spadł do około 5%. Patrz więc na wynik dla wszystkich indeksów razem i na to, w ilu indeksach Twoja prognoza wygrywa. Wtedy wynik prowadzi do decyzji:

| Wynik dla wszystkich indeksów | Co to znaczy | Co zrobić |
|---|---|---|
| Twoja prognoza myli się bardziej niż naiwna | Problem jest w procesie, a nie w braku algorytmu | Sprawdź odchylenie i korekty, zwłaszcza małe i w górę |
| Nie gorsza od naiwnej, ale gorsza od średniej albo wygładzania | Prosta metoda dałaby mniejszy błąd za darmo | Zacznij od wygładzania w arkuszu (przy sezonowości i trendzie średnia zawodzi) i mierz dalej |
| Bije wszystkie trzy darmowe prognozy | Proces działa, a nowy system musi pobić już Ciebie | Pilotaż ma sens przy setkach powiązanych indeksów i danych o cenach, promocjach i wydarzeniach |

Arkusz uznaje różnicę do pięciu procent w każdą stronę za remis. To umowna granica redakcji i ma sens dla wyniku z wielu indeksów, a nie z jednego.

## Średnia z czterech okresów nie jest uczciwą poprzeczką dla każdego indeksu

Test działa najlepiej dla indeksów, które sprzedają się co tydzień i bez wielkich skoków. W czterech sytuacjach trzeba go uzupełnić.

Pierwsza to sezonowość. Jeśli wyrób sprzedaje się latem trzy razy lepiej niż zimą, dodaj sezonową prognozę naiwną: sprzedaż z tego samego tygodnia rok wcześniej. Organizatorzy M5 też jej użyli, tyle że z cyklem tygodniowym: sprzedaż z tego samego dnia tydzień wcześniej [@m5]. Roczna wersja wymaga roku historii przed pierwszym ocenianym tygodniem.

Druga to trend. Średnia z czterech okresów pokazuje poziom sprzed około dwóch i pół tygodnia, więc przy rosnącej sprzedaży ją zaniża. Wtedy Twoja prognoza może bić średnią, choć nic nie wnosi ponad wygładzanie albo prognozę naiwną.

Trzecia to popyt przerywany. Przy indeksach, które w większości tygodni nie sprzedają się wcale, najmniejszy średni błąd w sztukach może mieć prognoza „zero” [@ftp]. Nikt nie zamówi według niej towaru, więc takie indeksy oceniaj osobno, po zapasie i poziomie obsługi klienta, a nie po samym błędzie [@ftp]. Czwarta to nowe wyroby i jednorazowe zdarzenia, takie jak duże zamówienie klienta albo promocja. Tu darmowe prognozy nie mają historii, a planista ma wiedzę, której system nie zna. Duże korekty w dół zwykle pomagały [@fva2025], więc korekt nie zakazuj, tylko je mierz.

Pamiętaj też, że sprzedaż to nie zawsze popyt. W tygodniu, w którym towaru zabrakło, sprzedaż była niższa od tego, co klienci chcieli kupić. Takie tygodnie oznacz w arkuszu albo pomiń.

## Trzy pytania do dostawcy, zanim podpiszesz umowę

Netguru to polska firma tworząca oprogramowanie. Na jej blogu przeczytasz, że „firmy wdrażające zaawansowane metody prognozowania oparte na sztucznej inteligencji zmniejszają błąd prognozy o 20–50% w porównaniu z tradycyjnymi statystycznymi punktami odniesienia” [@netguru]. Autor powołuje się na analizę firmy doradczej, ale nie podaje do niej odnośnika.

Ten sam tekst przyznaje dalej, że dobrze dostrojone metody statystyczne często dorównują gradient boostingowi, jednej z metod uczenia maszynowego. Dotyczy to dojrzałych, szybko rotujących indeksów z co najmniej trzyletnią historią czystych danych, a różnica wynosi według autora 1–2 punkty procentowe błędu MAPE [@netguru]. Obie liczby mogą być prawdziwe, ale odpowiadają na inne pytania. Zadaj więc trzy własne.

Pierwsze: z jaką metodą porównywaliście? Prognoza naiwna to łatwy rywal, wygładzanie wykładnicze trudniejszy, a Twoja obecna prognoza to jedyny, który się liczy. Drugie: na jakim poziomie? Wynik dla sumy firmy nic nie mówi o indeksie w magazynie, co pokazał rysunek wyżej. Trzecie: na czyich danych? Poproś o test na Twojej sprzedaży z ostatnich 26 tygodni, na poziomie, na którym zamawiasz, z prognozą liczoną z Twoim wyprzedzeniem.

Pilnuj, by model w pilotażu nie widział danych z tygodni, na których go oceniasz. Przegląd stanu wiedzy ostrzega, że dane testowe, miary i metody do porównania bywają dobrane tak, że przesadnie pokazują zalety nowej metody [@ftp]. Nawet cytowany wyżej tekst dostawcy pisze, że dopuszczenie przyszłych danych do uczenia to najszybszy sposób na model, który w fazie budowy wygląda na dokładny, a w działaniu zawodzi [@netguru]. Wynik testu wpisz do umowy jako warunek odbioru pilotażu i dopisz koszt utrzymania. Autorzy M5 zwracają uwagę, że metoda nadaje się do użytku tylko wtedy, gdy koszt obliczeń setek tysięcy prognoz co tydzień nie jest zaporowy [@m5].

## Policz, ile AI doda do Twoich prognoz, zanim podpiszesz umowę

Wróćmy do konkursu M5. Proste wygładzanie wykładnicze przeszło około 88% drogi od prognozy naiwnej do najlepszej metody z ponad 5 tysięcy zespołów [@m5-wyniki]. Zwycięzca dołożył resztę: dużo przy sumach, mało przy pojedynczym produkcie. Ile z tej reszty zostaje przy Twoich indeksach, pokaże tylko test na Twoich danych.

W poniedziałek wyeksportuj z systemu sprzedaż i prognozy 20 indeksów z ostatniego półrocza i wklej je do arkusza. Jeśli Twoja prognoza nie bije prostych metod, zacznij od nich i od korekt, które szkodzą. Nowy system rozważ wtedy, gdy będzie miał co pobić.
