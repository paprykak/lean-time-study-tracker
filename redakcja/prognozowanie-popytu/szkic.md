## W skrócie

**Problem.** Dostawcy obiecują, że prognozy popytu z AI zmniejszą błąd o 20–50% względem tradycyjnych metod statystycznych [@netguru]. Rzadko mówią, na jakim poziomie to zmierzyli (całej firmy czy pojedynczego indeksu, który zamawiasz) i na czyich danych.

**Dlaczego.** Przewaga najlepszych metod rośnie wraz z poziomem sumowania. W konkursie M5 zwycięzca był o 43,2% dokładniejszy od najlepszej prostej metody przy sprzedaży całej sieci i tylko o 2,3% przy pojedynczym produkcie w sklepie [@m5-wyniki]. Ręczne korekty planistów poprawiają prognozę w niewiele ponad połowie indeksów [@fva2025].

**Co zrobić.** Zanim zapłacisz za nowy system, porównaj swoją prognozę z dwiema darmowymi: naiwną i średnią z czterech okresów. Sprawdź też, czy korekty zmniejszają błąd. Arkusz do pobrania liczy to w godzinę.

## Zwycięzca wygrał o 43% przy całej sieci i o 2% przy jednym produkcie

W konkursie prognostycznym M5 ponad 5 tysięcy zespołów przewidywało sprzedaż sieci Walmart [@m5]. Do prognozy było 42 840 szeregów: od sprzedaży całej sieci po każdy z 3 049 produktów w każdym z 10 sklepów, na 28 dni naprzód [@m5]. Wygrała metoda uczenia maszynowego, która uśredniła 220 modeli drzew decyzyjnych (LightGBM) [@m5]. W średniej ze wszystkich poziomów była o 22,4% dokładniejsza od najlepszej z 24 metod porównawczych przygotowanych przez organizatorów [@m5-wyniki].

Ta średnia ukrywa najciekawsze. Policzyliśmy przewagę zwycięzcy osobno dla każdego z 12 poziomów, na podstawie pliku wyników udostępnionego przez organizatorów. Przy sprzedaży całej sieci zwycięska metoda myliła się o 43,2% mniej niż najlepsza metoda porównawcza. Przy pojedynczym produkcie w jednym sklepie już tylko o 2,3% mniej [@m5-wyniki]. Wśród 50 najlepszych zespołów przewaga na tym poziomie wynosiła od −0,8% do 3,3%, więc niektóre z nich wypadły tu gorzej od prostej metody [@m5-wyniki].

![Wykres słupkowy: przewaga zwycięzcy konkursu M5 nad najlepszą metodą porównawczą na 12 poziomach danych. Cała sieć 43,2%, stan 37,3%, sklep 31,1%, kategoria 36,9%, dział 34,4%, stan i kategoria 32,5%, stan i dział 27,5%, sklep i kategoria 25,3%, sklep i dział 21,4%, produkt łącznie we wszystkich sklepach 4,2%, produkt w stanie 3,2%, produkt w sklepie 2,3%.](../../assets/rysunki/prognozowanie-popytu-1.svg "Rysunek 1. Im bliżej pojedynczego produktu w sklepie, tym mniejsza przewaga zwycięzcy M5 nad najlepszą prostą metodą. Źródło: obliczenia redakcji na pliku wyników konkursu M5 (Scores and Ranks.xlsx).")

To zmienia pytanie, które warto zadać przed zakupem. Zamawiasz i planujesz produkcję na poziomie indeksu, a nie całej firmy. Właśnie tam przewaga najlepszej metody z konkursu, w którym rywalizowały tysiące zespołów, była najmniejsza. Tymczasem odsetek polskich przedsiębiorstw, które używają sztucznej inteligencji, wzrósł w ciągu roku z 8,7% do 17,8% [@gus2026]. Zanim kupisz AI do prognoz, sprawdź więc, czy Twoja obecna prognoza bije dwie, które nic nie kosztują: naiwną (sprzedaż z poprzedniego okresu) i średnią z czterech ostatnich okresów. Niżej znajdziesz dowody z konkursów i z badań w firmach, test na własnych danych i trzy pytania do dostawcy.

## Proste metody to poprzeczka, której większość nie przeskakuje

Konkurs M5 nie jest wyjątkiem. W poprzedniej edycji, M4, prognozowano 100 tysięcy szeregów [@m4]. Pięć zgłoszonych metod opierało się wyłącznie na uczeniu maszynowym. Żadna nie pobiła prostej średniej z trzech odmian wygładzania wykładniczego [@m4-wyniki, @plos], a tylko jedna pobiła prognozę naiwną z poprawką na sezonowość [@m4-wyniki].

Zwycięzca łączył wygładzanie wykładnicze z siecią neuronową [@m5] i był o 8,6% dokładniejszy od tej średniej [@m4-wyniki]. Trzecie miejsce zajął zespół wrocławskiej firmy ProLogistica Soft z kombinacją samych metod statystycznych [@m4-wyniki, @prologistica].

Ci sami organizatorzy porównali też 8 metod statystycznych z 10 metodami uczenia maszynowego na 1 045 miesięcznych szeregach z wcześniejszego konkursu M3. Sześć najdokładniejszych metod było statystycznych, a prognoza naiwna z poprawką na sezonowość wypadła lepiej od połowy metod uczenia maszynowego [@plos]. Autorzy zastrzegają, że wynik może zależeć od danych, bo szeregi były krótkie [@plos].

M5 był pierwszym konkursem, w którym wszystkie czołowe metody były czystym uczeniem maszynowym i wyraźnie wygrały z metodami statystycznymi [@m5]. Mimo to tylko 7,5% zespołów pobiło zwykłe wygładzanie wykładnicze, liczone dla każdego produktu w sklepie i sumowane w górę [@m5]. Prosta metoda nie jest więc słabym rywalem, którego pokona każdy system. Większość uczestników konkursu z nią przegrała.

## Korekty planistów pomagają w nieco ponad połowie indeksów

Skoro system prognoz nie zawsze wygrywa z prostą metodą, może wystarczy, że planista poprawi jego wynik? W wielu firmach tak wygląda proces: system liczy prognozę, a planista ją koryguje, bo wie o promocji u klienta albo o nowym zleceniu. Robert Fildes i współpracownicy zebrali dane o ponad 60 tysiącach prognoz z czterech firm z łańcuchów dostaw [@fildes2009]. W trzech z nich korekty średnio poprawiały trafność, a większe korekty pomagały bardziej niż małe [@fildes2009]. Małe korekty często psuły prognozę, a korekty w górę dużo rzadziej ją poprawiały niż korekty w dół. Częściej też szły w złą stronę, co autorzy odczytują jako ogólną skłonność do optymizmu [@fildes2009].

W 2025 r. Fildes, Goodwin i De Baets przeanalizowali wspólnie około 147 tysięcy prognoz z sześciu badań [@fva2025]. Korekty poprawiały trafność i odchylenie tylko w niewiele ponad połowie indeksów, z różnicami między zbiorami danych. Korekty w górę częściej szkodziły, a duże korekty w dół zwykle pomagały [@fva2025]. Autorzy nie znaleźli mocnych dowodów, że planiści wykorzystują informacje niedostępne dla systemu. Reagowali raczej na sygnały bez znaczenia albo o małej wartości [@fva2025].

Mało kto to sprawdza. W ankiecie 120 osób zajmujących się prognozami, głównie uczestników amerykańskich konferencji branżowych, co czwarta nie wskazała żadnej miary błędu prognozy [@fildes2007]. Tylko 52,8% sprawdzało, czy korekty poprawiają trafność [@fildes2007]. W jedynym polskim badaniu metod prognozowania, jakie znaleźliśmy, 89,1% z 715 sklepów internetowych decydowało w 2010 r. o zapasach wyłącznie na wyczucie i doświadczenie handlowców [@chodak]. Nowszych danych o polskich producentach i dystrybutorach nie znaleźliśmy.

## Na pojedynczym indeksie przypadek wygrywa z każdym modelem

Dlaczego przy całej sieci najlepsza metoda wygrywa wyraźnie, a przy pojedynczym produkcie w sklepie ledwo? Weźmy sto indeksów, z których każdy sprzedaje losowo średnio cztery sztuki dziennie (przykład liczbowy na danych fikcyjnych). Sprzedaż jednego indeksu odchyla się od średniej typowo o dwie sztuki, czyli o połowę. Suma stu indeksów odchyla się o 20 sztuk na 400, czyli o 5%.

W sumie przypadkowe wahania się znoszą i zostaje sygnał, którego model może się nauczyć: dzień tygodnia, święta, promocje i ceny. Sprzedaż jednego produktu w jednym sklepie to w dużej mierze przypadek. Według analizy współautorów konkursu 73% takich szeregów w M5 miało popyt przerywany, z wieloma dniami bez żadnej sprzedaży [@repr]. Tej części błędu nie usunie żaden model, więc dla wszystkich metod zostaje niewiele do wygrania.

Zwycięzcy M5 wygrali też dzięki temu, czego większość firm nie ma. Prawie wszystkie czołowe zespoły uczyły jeden model na tysiącach powiązanych szeregów naraz i korzystały z cen, promocji i kalendarza wydarzeń [@m5]. Część przewagi dają same dane. Wygładzanie wykładnicze z informacją o cenach i wydarzeniach było o 5,7% dokładniejsze niż bez niej, a model ARIMA o 13,2% [@m5-wyniki]. Zanim zapłacisz za algorytm, sprawdź, czy masz takie dane i czy prosta metoda z ich dodatkiem nie wystarczy.

## AI ma przewagę przy sumach, wielu indeksach i dobrych danych

Nie wynika z tego, że uczenie maszynowe w prognozach nic nie daje. Na poziomach od stanu do działu w sklepie przewaga zwycięzcy M5 wynosiła od 21,4% do 37,3% [@m5-wyniki]. Jeśli planujesz zdolności produkcyjne dla rodziny wyrobów albo obsadę magazynu, zysk może być duży. W porównaniu prognoz dziennego popytu indeksów część metod uczenia maszynowego była lepsza od metod statystycznych pod względem trafności i odchylenia [@spiliotis].

Granice działają też w drugą stronę. Dane M5 pochodzą z handlu detalicznego, a autorzy sami piszą, że wniosków nie da się uogólnić poza obszar, z którego pochodzą dane [@m5]. Miara konkursu ważyła produkty ich sprzedażą w dolarach, więc zwycięzcy skupiali się na drogich i szybko rotujących produktach [@m5]. Tygodniowy popyt u producenta, który obsługuje kilkudziesięciu klientów, zachowuje się inaczej niż dzienna sprzedaż w supermarkecie. Dlatego zamiast przenosić wynik z konkursu na swoją firmę, zmierz go na własnych danych.

## Test w trzech krokach pokaże, czy Twoja prognoza coś wnosi

Wybierz 20 indeksów: kilkanaście z największą sprzedażą i kilka zwykłych. Dla każdego zbierz sprzedaż i prognozę z ostatnich 26–52 tygodni. Bierz prognozę zrobioną przed tygodniem, z takim wyprzedzeniem, z jakim naprawdę zamawiasz albo planujesz produkcję. Prognoza poprawiana po fakcie nie nadaje się do testu.

### Krok 1. Dodaj dwie darmowe prognozy

Naiwna to sprzedaż z poprzedniego tygodnia. Średnia z czterech okresów to średnia sprzedaży z czterech poprzednich tygodni. Przegląd stanu wiedzy o prognozowaniu, który napisało około 80 badaczy, zaleca porównywać każdą nową metodę co najmniej z prognozą naiwną i z popularnymi metodami, takimi jak wygładzanie wykładnicze [@ftp].

### Krok 2. Policz błąd w sztukach, nie w procentach

Dla każdego tygodnia weź różnicę między prognozą a sprzedażą bez znaku i policz średnią. To średni błąd bezwzględny (MAE, mean absolute error). Nie używaj średniego błędu procentowego (MAPE) przy indeksach, które bywają bez sprzedaży, bo przy zerowej sprzedaży nie da się go policzyć [@hyndman]. Podziel swój błąd przez błąd każdej z darmowych prognoz. Wynik poniżej 1 znaczy, że Twoja prognoza myli się mniej.

Policz też odchylenie: sumę różnic prognoza minus sprzedaż, tym razem ze znakiem, podzieloną przez sumę sprzedaży. Wynik stale dodatni znaczy, że prognoza zawyża sprzedaż, a magazyn trzyma zapas ponad potrzebę.

### Krok 3. Zmierz wartość dodaną korekt

Jeśli system liczy prognozę, a planista ją poprawia, porównaj błąd przed korektą i po niej. To wartość dodana prognozy (forecast value added, FVA): o ile każdy krok procesu zmniejsza błąd [@ftp]. Licz osobno korekty w górę i w dół, bo te pierwsze częściej szkodzą [@fva2025].

Gdy korekty psują prognozę, nie zakazuj ich, tylko zmień zasady. Fildes i Goodwin zalecają, by planista uzasadniał każdą korektę na piśmie, a firma regularnie sprawdzała, czy korekty pomagają [@fildes2007]. W analizie 147 tysięcy prognoz trafność poprawiła też prosta procedura usuwania stałego odchylenia z prognoz po korekcie [@fva2025].

Arkusz „Test prognozy” liczy wszystkie trzy kroki. Tak wygląda wynik w przykładzie na danych fikcyjnych. Indeks sprzedaje około 120 sztuk tygodniowo, a prognoza planisty myli się średnio o 15,2 sztuki. Prognoza naiwna myli się tak samo, a średnia z czterech tygodni o 12,4 sztuki. Arkusz „Korekty” pokazuje przyczynę. System, który liczy właśnie średnią, mylił się o 12,5 sztuki, a po korektach planisty w górę „na wszelki wypadek” o 15,2, czyli o 22% więcej.

Wynik testu prowadzi do decyzji:

| Wynik | Co to znaczy | Co zrobić |
|---|---|---|
| Twoja prognoza myli się bardziej niż naiwna | Problem jest w procesie, a nie w braku algorytmu | Sprawdź odchylenie i korekty, zwłaszcza małe i w górę |
| Lepsza od naiwnej, gorsza od średniej z czterech okresów | Prosta metoda dałaby mniejszy błąd za darmo | Zacznij od średniej albo wygładzania w arkuszu i mierz dalej |
| Bije obie darmowe prognozy | Proces działa, a nowy system musi pobić już Ciebie | Pilotaż ma sens przy setkach powiązanych indeksów i danych o cenach i promocjach |

Arkusz uznaje różnicę do pięciu procent w każdą stronę za remis. To umowna granica redakcji: przy kilkunastu tygodniach historii mniejsza różnica może wynikać z przypadku.

## Średnia z czterech okresów nie jest uczciwą poprzeczką dla każdego indeksu

Test działa najlepiej dla indeksów, które sprzedają się co tydzień i bez wielkich skoków. W czterech sytuacjach trzeba go uzupełnić.

Pierwsza to sezonowość. Jeśli wyrób sprzedaje się latem trzy razy lepiej niż zimą, dodaj trzecią darmową prognozę: sprzedaż z tego samego tygodnia rok wcześniej. To sezonowa prognoza naiwna, której organizatorzy M5 też użyli jako punktu odniesienia [@m5-wyniki]. Druga to trend. Średnia z czterech okresów zawsze pokazuje poziom sprzed około dwóch tygodni, więc przy rosnącej sprzedaży stale ją zaniża. Wtedy Twoja prognoza może bić średnią, choć nic nie wnosi ponad prognozę naiwną.

Trzecia to popyt przerywany. Przy indeksach, które w większości tygodni nie sprzedają się wcale, najmniejszy średni błąd w sztukach może mieć prognoza „zero” [@ftp]. Nikt nie zamówi według niej towaru, więc takie indeksy oceniaj osobno, po zapasie i poziomie obsługi klienta, a nie po samym błędzie [@ftp]. Czwarta to nowe wyroby i jednorazowe zdarzenia, takie jak duże zamówienie klienta albo promocja. Tu darmowe prognozy nie mają historii, a planista ma wiedzę, której system nie zna. Duże korekty w dół zwykle pomagały [@fva2025], więc nie zakazuj korekt, tylko je mierz.

Pamiętaj też, że sprzedaż to nie zawsze popyt. W tygodniu, w którym towaru zabrakło, sprzedaż była niższa od tego, co klienci chcieli kupić. Takie tygodnie oznacz w arkuszu albo pomiń.

## Trzy pytania do dostawcy, zanim podpiszesz umowę

Na polskich stronach firm wdrażających AI łatwo znaleźć obietnicę, że takie prognozy „zmniejszają błąd prognozy o 20–50% w porównaniu z tradycyjnymi statystycznymi punktami odniesienia” [@netguru]. Autor powołuje się na analizę firmy doradczej, ale nie podaje do niej odnośnika. Ten sam tekst przyznaje dalej, że przy dojrzałych, szybko rotujących indeksach dobrze dostrojone metody statystyczne często dorównują uczeniu maszynowemu. Różnica wynosi według autora 1–2 punkty procentowe błędu MAPE [@netguru]. Obie liczby mogą być prawdziwe, ale odpowiadają na inne pytania. Zadaj więc trzy własne.

Pierwsze: z jaką metodą porównywaliście? Prognoza naiwna to łatwy rywal, średnia z czterech okresów trudniejszy, a Twoja obecna prognoza to jedyny, który się liczy. Drugie: na jakim poziomie? Wynik dla sumy firmy nic nie mówi o indeksie w magazynie, co pokazał rysunek wyżej. Trzecie: na czyich danych? Poproś o test na Twojej sprzedaży z ostatnich 26 tygodni, na poziomie, na którym zamawiasz, z prognozą liczoną przed każdym tygodniem.

Pilnuj, by model w pilotażu nie widział danych z tygodni, na których go oceniasz. Ostrzega przed tym nawet cytowany wyżej tekst dostawcy. Dopuszczenie przyszłych danych do uczenia to według niego najszybszy sposób na model, który w fazie budowy wygląda na dokładny, a w działaniu zawodzi [@netguru]. Wynik tego testu wpisz do umowy jako warunek odbioru pilotażu i dopisz koszt utrzymania. Autorzy M5 zwracają uwagę, że metoda nadaje się do użytku tylko wtedy, gdy koszt obliczeń setek tysięcy prognoz co tydzień nie jest zaporowy [@m5].

## Zanim podpiszesz umowę, policz własne 2%

Wróćmy do konkursu M5: 43,2% przewagi przy całej sieci i 2,3% przy produkcie w sklepie [@m5-wyniki]. Twoja firma ma własną wersję tych liczb i nikt jej za Ciebie nie policzy. W poniedziałek wyeksportuj z systemu sprzedaż i prognozy 20 indeksów z ostatniego półrocza i wklej je do arkusza. Wynik zobaczysz, zanim skończy się zmiana. Jeśli Twoja prognoza nie bije średniej z czterech tygodni, zacznij od średniej i od korekt, które szkodzą. Nowy system rozważ wtedy, gdy będzie miał co pobić.
