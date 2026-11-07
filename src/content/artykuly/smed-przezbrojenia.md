---
tytul: "Skracaj przezbrojenia najpierw na wąskim gardle"
tytulSeo: "SMED: ile daje skrócenie przezbrojenia i gdzie zacząć"
opisSeo: "SMED skraca przezbrojenia o 20–90%, zależnie od przypadku. Na wąskim gardle odzyskany czas to produkcja, gdzie indziej głównie czas ustawiaczy."
lead: "Opisane wdrożenia SMED skracają przezbrojenia od około 20% do 90%. Ile to warte, zależy od miejsca: na wąskim gardle odzyskana godzina może stać się sprzedaną produkcją, a gdzie indziej oszczędzasz głównie czas ustawiaczy, i to tylko wtedy, gdy zrobią w nim coś innego."
dzial: lean-i-ciagle-doskonalenie
format: Poradnik
tematy:
  - smed
autorzy:
  - redakcja
opublikowano: 2026-11-07
zdjecie: linia-montazu-elektroniki
podpisZdjecia: "Linia montażu z instrukcjami nad stanowiskami. Każda zmiana wyrobu na takiej linii to przezbrojenie, które da się nagrać i skrócić."
powiazane:
  - oee-85-procent
zrodla:
  - opis: "Díaz-Reza J. R., García-Alcaraz J. L., Mendoza-Fong J. R., Martínez-Loya V., Jiménez Macías E., Blanco-Fernández J. (2017), Interrelations among SMED Stages: A Causal Model, Complexity, art. 5912940."
    adres: "https://doi.org/10.1155/2017/5912940"
    rodzaj: "Badanie recenzowane"
    dostep: 2026-11-07
  - opis: "Barrantes Gerónimo M. A., Silva Lostaunau L. C., Córdova Aguirre L. J. (2022), Analysis of the Implementation of the SMED Methodology to Reduce Machine Setup Times and Die Change in the Food Industry: A Literature Review, Proceedings of the First Australian International Conference on Industrial Engineering and Operations Management, Sydney."
    adres: "https://ieomsociety.org/proceedings/2022australia/475.pdf"
    rodzaj: "Przegląd lub metaanaliza"
    dostep: 2026-11-07
  - opis: "Harris F. W. (1915), What quantity to make at once, w: Operation and Costs: Planning and Filling Orders, Cost-Keeping Methods, Controlling Your Operations, Standardizing Material and Labor Costs, Chicago: A. W. Shaw, rozdz. IV (pierwodruk wzoru: Factory, The Magazine of Management, 1913)."
    adres: "https://archive.org/details/operationcostspl00chicrich"
    rodzaj: "Książka"
    dostep: 2026-11-07
  - opis: "Stadnicka D. (2015), Setup analysis: combining SMED with other tools, Management and Production Engineering Review, 6(1), 36–50."
    adres: "https://doi.org/10.1515/mper-2015-0006"
    rodzaj: "Badanie recenzowane"
    dostep: 2026-11-07
faq:
  - pytanie: "Co to jest SMED?"
    odpowiedz: "SMED (Single Minute Exchange of Die) to metoda skracania przezbrojeń, którą rozwinął Shigeo Shingo; nazwa oznacza przezbrojenie w jednocyfrowej liczbie minut. Najpierw obserwuje się i nagrywa przezbrojenie, potem rozdziela czynności wymagające zatrzymanej maszyny od tych, które można zrobić w trakcie jej pracy, przenosi jak najwięcej czynności do pracy maszyny, a na końcu usprawnia i standaryzuje resztę."
  - pytanie: "O ile SMED skraca przezbrojenie?"
    odpowiedz: "W opisanych przypadkach od około 20% do 90%. Przegląd 30 artykułów, głównie z przemysłu spożywczego, przytacza skrócenia od 20% do 49% i w jednym projekcie około 67%, a inne opisy podają 59–90%. Polskie badanie opisuje skrócenie o 37,67%. Tylko co trzeci opis mówi o ograniczeniach, więc przeciętny wynik może być niższy."
  - pytanie: "Gdzie zacząć skracanie przezbrojeń?"
    odpowiedz: "Na maszynie, która ogranicza wydajność całego zakładu, czyli na wąskim gardle. Tam odzyskany czas może zamienić się w dodatkową produkcję albo zastąpić nadgodziny. Na maszynach z wolnym czasem krótsze przezbrojenie oszczędza głównie czas ustawiaczy i pozwala na mniejsze partie."
  - pytanie: "Jak policzyć opłacalną wielkość partii?"
    odpowiedz: "Klasycznym wzorem Harrisa: partia rośnie z pierwiastkiem z iloczynu popytu i kosztu przezbrojenia, podzielonego przez koszt utrzymania sztuki w zapasie. Przezbrojenie krótsze o połowę zmniejsza więc opłacalną partię o około 29%, a nie o połowę."
metoda: "Tekst opiera się na przeglądzie 30 artykułów o SMED, głównie z przemysłu spożywczego (2022), polskim badaniu z Politechniki Rzeszowskiej (2015), badaniu ankietowym 250 pracowników zakładów w Meksyku (2017) i wzorze Harrisa na wielkość partii (1915). Rachunki dla wąskiego gardła i dla maszyny z wolnym czasem policzyliśmy na danych fikcyjnych; kod jest w archiwum redakcji. Wyniki wdrożeń pochodzą z opisów pojedynczych przypadków, a tylko co trzeci opisuje ograniczenia. Przykłady są fikcyjne. Konflikt interesów: redaktor naczelny prowadzi doradztwo w operacjach; tekst nie odsyła do jego usług."
sprawdzono: 2026-11-07
szkic: false
---
## W skrócie

**Problem.** O SMED, czyli metodzie skracania przezbrojeń, czyta się, że skraca je nawet o 90% [1]. W opisanych przypadkach przezbrojenia skracały się o 20–90% [2, 1]. Sam procent nie mówi jednak, ile zakład zarobi.

**Dlaczego.** Godzina przezbrojenia kosztuje różnie w różnych miejscach zakładu. Na wąskim gardle (bottleneck) płacisz za nią dwa razy: czasem ludzi i produkcją, której nie będzie. Na maszynie, która ma wolny czas, płacisz głównie ludźmi, a mniejsze partie dokładają niewiele, bo opłacalna partia maleje dużo wolniej niż koszt przezbrojenia [3].

**Co zrobić.** Zacznij SMED od maszyny, która ogranicza wydajność całego zakładu. Nagraj jedno przezbrojenie, rozdziel czynności na te przy zatrzymanej maszynie i te, które da się zrobić w trakcie pracy, i zdecyduj z góry, na co przeznaczysz odzyskany czas.

## Opisane wdrożenia skracają przezbrojenia o 20–90%

Wtryskarka stoi, ustawiacz odkręca formę, a przed maszyną rośnie kolejka palet. Weźmy zakład, który na kilku wtryskarkach robi elementy obudów do sprzętu AGD (to przykład, firma jest fikcyjna). Przezbrojenie (changeover) trwa tam godzinę. Firma doradcza zapowiada, że po warsztatach SMED zejdzie do kilku minut, a zakład zarobi na tym setki tysięcy złotych rocznie. Kierownik produkcji ma dwa pytania: ile to jest naprawdę i od której maszyny zacząć.

Opisane wdrożenia dają szeroki przedział. Przegląd 30 artykułów o SMED, głównie z przemysłu spożywczego, przytacza skrócenia od 20% do 49%, a w jednym projekcie dla firmy spożywczej około 67% [2]. Zespół badaczy z Meksyku i Hiszpanii przytacza inne opisy, z wynikami od 59% do 90% [1]. Polskie badanie z Politechniki Rzeszowskiej opisuje przypadek, w którym przezbrojenie skróciło się z 72 do 45 minut, czyli o 37,67% [4]. Już pierwszy etap, rozdzielenie czynności, skraca przezbrojenie o 30–50%, twierdzi twórca metody, Shigeo Shingo, cytowany przez badaczy z Meksyku i Hiszpanii [1].

Skracaj przezbrojenia najpierw tam, gdzie maszyna ogranicza wydajność całego zakładu. Procent z prezentacji mówi niewiele; zysk zależy od tego, na której maszynie odzyskasz minuty i co z nimi zrobisz.

## Na wąskim gardle płacisz za przezbrojenie dwa razy

Pomyśl o maszynie, przed którą stoi kolejka i która decyduje, ile zakład sprzeda. Godzina przezbrojenia kosztuje tam dwa razy: czas ustawiaczy i godzinę produkcji, której nie będzie. Krótsze przezbrojenie oddaje obie. Zysk rośnie wprost proporcjonalnie do odzyskanego czasu.

Załóżmy, że jedna z wtryskarek kierownika jest wąskim gardłem. Przezbraja się 15 razy w tygodniu po godzinie, zakład pracuje 48 tygodni w roku, a godzina pracy maszyny daje 400 zł marży (przykład na danych fikcyjnych). Skrócenie przezbrojeń o 38% oddaje 5,7 godziny tygodniowo, czyli około 274 godzin rocznie. To około 109 tys. zł marży, jeśli rynek kupi dodatkową produkcję. Przy skróceniu o połowę wychodzi 360 godzin i 144 tys. zł. Czasu ustawiaczy w tym rachunku nawet nie liczymy.

Jeśli rynek nie kupi więcej, odzyskane godziny wciąż mają wartość. Zastąpią nadgodziny albo dodatkowe zmiany, które dziś ratują terminy, więc licz wtedy ich koszt zamiast marży. Na tej samej maszynie możesz też wybrać mniejsze partie. Decyzję podejmij przed warsztatem. Odzyskany czas bez decyzji rozpływa się w krótkich postojach i dłuższych przerwach.

## Poza wąskim gardłem zysk jest mały

Większość maszyn w zakładzie ma wolny czas. Przezbrojenie takiej maszyny kosztuje ludzi, energię i odpad, ale nie odbiera sprzedaży, bo jej wolny czas nie ma kupca. Krótsze przezbrojenie oszczędza tam czas ustawiaczy i pozwala robić mniejsze partie.

Ile wart jest mniejszy zapas, policzył ponad sto lat temu inżynier Ford W. Harris [3]. W jego wzorze opłacalna partia maleje dużo wolniej niż koszt przezbrojenia: gdy przezbrojenie tanieje o połowę, partia maleje tylko o około 29% [3]. W jego rachunku koszt przezbrojenia obejmuje też obsługę zlecenia w biurze, której SMED nie skraca [3].

Policzyliśmy to dla jednego wyrobu na danych fikcyjnych. Roczny popyt to 24 tysiące sztuk, jedno godzinne przezbrojenie kosztuje 600 zł (ludzie, energia, odpad), a utrzymanie sztuki w zapasie przez rok 5 zł.

| Przezbrojenie krótsze o | Opłacalna partia | Przezbrojeń w roku | Koszt przezbrojeń i zapasu w roku | Oszczędność w roku |
|---|---|---|---|---|
| 0% (60 min) | 2 400 szt. | 10 | 12 000 zł | — |
| 20% | 2 147 szt. | 11,2 | 10 733 zł | 1 267 zł |
| 38% | 1 890 szt. | 12,7 | 9 449 zł | 2 551 zł |
| 50% | 1 697 szt. | 14,1 | 8 485 zł | 3 515 zł |
| 75% | 1 200 szt. | 20 | 6 000 zł | 6 000 zł |

Przy przezbrojeniu krótszym o połowę i dotychczasowych partiach oszczędzasz połowę kosztu samych przezbrojeń, w przykładzie na danych fikcyjnych 3 000 zł rocznie na wyrób. To prawdziwe pieniądze tylko wtedy, gdy ustawiacze zrobią w odzyskanym czasie coś innego. Mniejsze partie dokładają tylko 515 zł. Tyle wynosi różnica między 3 515 zł z tabeli a tymi 3 000 zł. Nawet przy 20 takich wyrobach na jednej maszynie daje to około 70 tys. zł rocznie, mniej niż połowę tego, co oddaje to samo skrócenie na wąskim gardle.

Harris zauważył też, że brygadziści, którzy dobrze czują koszt przezbrojenia przy małych zleceniach, robią prawie zawsze duże partie, jeśli nikt ich nie pilnuje [3]. Gdy przezbrojenie się skraca, a planista dalej układa harmonogram według starych partii, mniejszego zapasu nie będzie.

## Opisy wdrożeń rzadko mówią o porażkach

W przeglądzie 30 artykułów tylko 10, czyli 30%, opisywało ograniczenia wdrożenia, a rachunki oszczędności kosztów nie były podane szczegółowo [2]. Liczby z artykułów mogą więc zawyżać przeciętny wynik. Jako główną przeszkodę autorzy przeglądu wskazują brak przeszkolenia pracowników [2].

W meksykańskich fabrykach maquiladora, często filiach firm zagranicznych, wdrożenia SMED według badaczy z Meksyku i Hiszpanii rzadko dają oczekiwane wyniki, a firmy często porzucają metodę [1]. To ich obserwacja ze wstępu do badania ankietowego, a nie jego wynik. Przyczynę widzą w tym, że firma może nie znać dobrze kolejnych etapów metody albo nie wiedzieć, jak się ze sobą wiążą [1].

Polskie dane pokazują inny kłopot: w wielu firmach nikt nie próbował skracać przezbrojeń. W ankiecie wśród operatorów z firm na Podkarpaciu tylko w 33% przypadków podejmowano działania, żeby skrócić przezbrojenia, a 47% badanych firm według szacunku z badania nigdy tego nie robiło [4]. Ankietę wypełniło jednak 29 operatorów z 88 losowo wybranych firm, więc to sygnał, a nie obraz całego przemysłu [4].

Wniosek dla zarządu: zanim zapłacisz za warsztat, ustal, kto przeszkoli według nowego standardu wszystkie zmiany i kto po kwartale sprawdzi wynik na danych z produkcji.

## SMED w czterech krokach

### Krok 1. Wybierz maszynę, która ogranicza zakład

Szukaj maszyny, przed którą zawsze czeka materiał, a za którą następne stanowiska stoją bez pracy. Przez tydzień zapisuj raz dziennie, ile pojemników albo palet czeka przed każdą maszyną w ciągu. Tam, gdzie kolejka rośnie, a nie znika do końca zmiany, masz kandydata. Drugi test: gdy ta maszyna stanie na godzinę, czy cały zakład traci godzinę produkcji? Jeśli tak, masz wąskie gardło. Potwierdź je danymi: wysokim wykorzystaniem, nadgodzinami na tej maszynie i liczbą przezbrojeń w tygodniu.

Jeśli żadna maszyna nie ogranicza zakładu, SMED da mniej. Zacznij wtedy od maszyny, na której ustawiacze spędzają najwięcej godzin na przezbrojeniach, i licz zysk w ich czasie.

### Krok 2. Nagraj przezbrojenie i rozdziel czynności

Shingo zalecał zacząć od obserwacji i nagrania całego przezbrojenia [1]. Nagraj je telefonem, od ostatniej dobrej sztuki starego wyrobu do pierwszej dobrej sztuki nowego. Wypisz każdą czynność z czasem i oznacz, czy wymaga zatrzymanej maszyny. Pierwszy etap SMED polega właśnie na rozróżnieniu i rozdzieleniu tych dwóch rodzajów czynności [1].

Nagranie obejrzyj razem z operatorem, który przezbrajał, i z ustawiaczem z innej zmiany. Operator wie, dlaczego coś trwa, a ustawiacz z innej zmiany często robi to samo inaczej. Różnice między zmianami to pierwszy materiał do standardu: zanim cokolwiek przyspieszysz, wybierz najlepszy z dzisiejszych sposobów i naucz go wszystkich.

### Krok 3. Przenieś do pracy maszyny wszystko, co się da

Drugi etap to zamiana jak największej części czynności przy zatrzymanej maszynie na takie, które robi się w trakcie pracy [1]. W polskim badaniu w 33% przypadków operator musiał przynosić narzędzia i przyrządy z innych miejsc [4]. Takie chodzenie to najtańsze minuty do odzyskania.

Na nagraniu szukaj czynności, które zwykle da się zrobić przed zatrzymaniem maszyny: przyniesienia formy, narzędzi i materiału, wydruku dokumentacji, sprawdzenia nowego programu, wstępnego nagrzania albo przygotowania pojemników na nowy wyrób. Każdą z nich wpisz na listę „przed zatrzymaniem” i przypisz do konkretnej osoby.

Na wtryskarce taka lista może wyglądać tak. Przed zatrzymaniem: przywieź formę pod maszynę, przygotuj węże i złącza wody, nagrzej formę, jeśli masz osobny termostat, i wysusz materiał. Przy zatrzymanej maszynie zostają odpięcie starej formy, zamocowanie nowej, podłączenie wody, ustawienie parametrów i próbne wtryski do pierwszej dobrej sztuki. Gdy lista „przed zatrzymaniem” działa, przychodzi trzeci etap: usprawnienie i standaryzacja wszystkich czynności [1]. Na wtryskarce to na przykład szybkozłącza wody i parametry zapisane dla każdej formy. Na prasie zasada jest ta sama: matrycę i mocowania przygotuj przy prasie, zanim zatrzymasz prasę.

### Krok 4. Zapisz standard i zmierz dwa wyniki

Nowy sposób przezbrojenia zapisz jako standard ze zdjęciami i przeszkol według niego wszystkie zmiany, bo brak przeszkolenia to główna przeszkoda wdrożeń [2]. Przez miesiąc mierz czas przezbrojenia i osobno to, na co poszedł odzyskany czas: dodatkową produkcję, mniej nadgodzin albo mniejsze partie. Bez drugiej liczby nie wiesz, czy SMED zarobił.

Zarządowi pokaż rachunek w tej samej postaci, w jakiej liczyliśmy go wyżej. Na wąskim gardle: odzyskane godziny w roku razy marża z godziny pracy maszyny albo koszt nadgodzin, których nie będzie. Poza nim: zaoszczędzony czas ustawiaczy, jeśli zrobią w nim coś innego, i mniejszy zapas, jeśli partie naprawdę się zmniejszyły. Obie liczby sprawdź po kwartale na danych z produkcji, a nie z planu warsztatu.

## Kiedy ten rachunek zawiedzie

Wyniki z przeglądu dotyczą głównie przemysłu spożywczego [2]. Polskie badanie to jedna firma i jedno stanowisko. Nasze rachunki są na danych fikcyjnych i prostym modelu: zakładają stały popyt, stały koszt przezbrojenia i to, że rynek kupi dodatkową produkcję z wąskiego gardła.

Liczy się czas do pierwszej dobrej sztuki, a nie do uruchomienia maszyny. Gdy przezbrojenie skróci się o kwadrans, a potem pierwsze sztuki przez pół godziny idą do odpadu, zysku nie ma. Jeśli wąskie gardło przesuwa się między maszynami, skrócenie przezbrojeń na jednej z nich oddaje mniej, niż pokazuje rachunek. Jeśli mierzysz OEE (całkowitą efektywność urządzeń), nie zmieniaj po wdrożeniu SMED definicji przezbrojenia; piszemy o tym w [tekście o OEE](/oee-85-procent).

## Najpierw maszyna z kolejką

Wróćmy do zakładu z wtryskarkami. Zamiast warsztatu dla całej hali kierownik wskaże maszynę, przed którą stoi kolejka palet. Z doradcą umówi się na wynik w godzinach odzyskanych na tej maszynie i w złotówkach, które z nich będą, a nie w procentach z prezentacji. Na maszynie z wolnym czasem przezbrojenie krótsze o połowę oszczędza głównie czas ustawiaczy, a na wąskim gardle oddaje połowę straconej produkcji.

W poniedziałek nagraj na tej maszynie jedno przezbrojenie, od ostatniej dobrej sztuki do pierwszej dobrej, i zaznacz, co dało się zrobić przed zatrzymaniem.
