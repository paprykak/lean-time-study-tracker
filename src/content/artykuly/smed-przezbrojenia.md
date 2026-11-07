---
tytul: "Skracaj przezbrojenia najpierw na wąskim gardle"
tytulSeo: "SMED: ile daje skrócenie przezbrojenia i gdzie zacząć"
opisSeo: "Wdrożenia SMED skracają przezbrojenia zwykle o 20–50%, nie o 90%. Na wąskim gardle zysk rośnie z odzyskanym czasem, gdzie indziej tylko z pierwiastkiem."
lead: "Opublikowane wdrożenia SMED skracają przezbrojenia zwykle o 20–50%, a nie o 90%. Ile to warte, zależy od miejsca: na wąskim gardle każda odzyskana godzina to sprzedana produkcja, a gdzie indziej przezbrojenie krótsze o połowę obniża koszt partii i zapasu tylko o 29%."
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
  - opis: "Barrantes Gerónimo D., Silva Lostaunau K., Córdova Aguirre J. (2022), Analysis of the Implementation of the SMED Methodology to Reduce Changeover Times in the Food Industry: A Literature Review, Proceedings of the 1st Australian International Conference on Industrial Engineering and Operations Management, Sydney, s. 2201–2212."
    adres: "https://ieomsociety.org/proceedings/2022australia/475.pdf"
    rodzaj: "Przegląd lub metaanaliza"
    dostep: 2026-11-07
  - opis: "Stadnicka D. (2015), Setup analysis: combining SMED with other tools, Management and Production Engineering Review, 6(1), 36–50."
    adres: "https://doi.org/10.1515/mper-2015-0006"
    rodzaj: "Badanie recenzowane"
    dostep: 2026-11-07
  - opis: "Díaz-Reza J. R., García-Alcaraz J. L., Mendoza-Fong J. R., Martínez-Loya V., Jiménez Macías E., Blanco-Fernández J. (2017), Interrelations among SMED Stages: A Causal Model, Complexity, art. 5912940."
    adres: "https://doi.org/10.1155/2017/5912940"
    rodzaj: "Badanie recenzowane"
    dostep: 2026-11-07
  - opis: "Harris F. W. (1915), What quantity to make at once, w: Operation and Costs: Planning and Filling Orders, Cost-Keeping Methods, Controlling Your Operations, Standardizing Material and Labor Costs, Chicago: A. W. Shaw, rozdz. IV (pierwodruk wzoru: Factory, The Magazine of Management, 1913)."
    adres: "https://archive.org/details/operationcostspl00chicrich"
    rodzaj: "Książka"
    dostep: 2026-11-07
faq:
  - pytanie: "Co to jest SMED?"
    odpowiedz: "SMED (Single Minute Exchange of Die) to metoda skracania przezbrojeń, którą rozwinął Shigeo Shingo. Najpierw rozdziela się czynności wymagające zatrzymanej maszyny od tych, które można zrobić w trakcie jej pracy, potem przenosi jak najwięcej czynności do pracy maszyny i upraszcza resztę."
  - pytanie: "O ile SMED skraca przezbrojenie?"
    odpowiedz: "W opublikowanych przypadkach zwykle o 20–50%: przegląd 30 artykułów z przemysłu spożywczego przytacza wyniki od 21% do około 67%, a polskie badanie opisuje skrócenie o 37,67%. Już pierwszy etap, rozdzielenie czynności, ma według literatury skracać przezbrojenie o 30–50%."
  - pytanie: "Gdzie zacząć skracanie przezbrojeń?"
    odpowiedz: "Na maszynie, która ogranicza wydajność całego zakładu, czyli na wąskim gardle. Tam odzyskany czas zamienia się w dodatkową produkcję. Na maszynach z wolnym czasem krótsze przezbrojenie daje mniejsze partie, a oszczędność rośnie tylko z pierwiastkiem kosztu przezbrojenia."
  - pytanie: "Jak policzyć opłacalną wielkość partii?"
    odpowiedz: "Klasycznym wzorem Harrisa: partia rośnie z pierwiastkiem z iloczynu popytu i kosztu przezbrojenia, podzielonego przez koszt utrzymania sztuki w zapasie. Z tego samego wzoru wynika, że przezbrojenie krótsze o połowę obniża roczny koszt przezbrojeń i zapasu o około 29%."
metoda: "Tekst opiera się na przeglądzie 30 artykułów o SMED w przemyśle spożywczym (2022), polskim badaniu z Politechniki Rzeszowskiej (2015), badaniu ankietowym 250 pracowników zakładów w Meksyku (2017) i wzorze Harrisa na wielkość partii (1915). Rachunki dla wąskiego gardła i dla linii z wolnym czasem policzyliśmy na danych fikcyjnych; kod jest w archiwum redakcji. Wyniki wdrożeń pochodzą z opisów przypadków, które częściej opisują sukcesy niż porażki. Przykłady są fikcyjne. Konflikt interesów: redaktor naczelny prowadzi doradztwo w operacjach; tekst nie odsyła do jego usług."
szkic: true
---
## W skrócie

**Problem.** O SMED, czyli metodzie skracania przezbrojeń, krążą obietnice skrócenia czasu o 90%. Opublikowane wdrożenia skracają przezbrojenia zwykle o 20–50% [1, 2], a firmy często porzucają metodę w trakcie [3].

**Dlaczego.** Godzina przezbrojenia kosztuje różnie w różnych miejscach zakładu. Na maszynie, która ma wolny czas, krótsze przezbrojenie daje mniejsze partie, a oszczędność rośnie tylko z pierwiastkiem kosztu przezbrojenia [4]. Na wąskim gardle każda odzyskana godzina zamienia się w sprzedaną produkcję.

**Co zrobić.** Zacznij SMED od maszyny, która ogranicza wydajność całego zakładu. Nagraj jedno przezbrojenie, rozdziel czynności na te przy zatrzymanej maszynie i te, które da się zrobić w trakcie pracy, i zdecyduj z góry, na co przeznaczysz odzyskany czas.

## Opublikowane wdrożenia skracają przezbrojenia o 20–50%

Weźmy kierownika produkcji w zakładzie, który na kilku wtryskarkach robi elementy obudów do sprzętu AGD (to przykład, firma jest fikcyjna). Przezbrojenie trwa u niego godzinę. Firma doradcza obiecuje, że po warsztatach SMED zejdzie do kilku minut, a zakład zarobi na tym setki tysięcy złotych rocznie. Kierownik ma dwa pytania: ile to jest naprawdę i od której maszyny zacząć.

Sama nazwa metody stawia poprzeczkę wysoko. „Single minute” oznacza przezbrojenie w jednocyfrowej liczbie minut, czyli poniżej 10 minut [3]. To cel, a nie typowy wynik pierwszego wdrożenia.

Na pierwsze odpowiadają opublikowane wdrożenia. Przegląd 30 artykułów o SMED w przemyśle spożywczym z lat 2015–2021 przytacza wyniki od 21% do około 67% krótszego przezbrojenia [1]. Polskie badanie z Politechniki Rzeszowskiej opisuje przypadek, w którym przezbrojenie skróciło się z 72 do 45 minut, czyli o 37,67%. Autorka sama ocenia ten wynik jako „niezbyt imponujący”, choć zaoszczędzono prawie 38% czasu [2]. Według meksykańskiego zespołu badaczy, który powołuje się na twórcę metody, Shigeo Shingo, już pierwszy etap SMED, czyli rozdzielenie czynności, skraca przezbrojenie o 30–50% [3].

Skracaj więc przezbrojenia najpierw tam, gdzie maszyna ogranicza wydajność całego zakładu. Spodziewaj się 20–50% krótszego czasu [1, 2], a zysk policz według tego, co zrobisz z odzyskanymi minutami.

## Poza wąskim gardłem zysk rośnie tylko z pierwiastkiem

Większość maszyn w zakładzie ma wolny czas. Nie wszystkie. Przezbrojenie takiej maszyny kosztuje ludzi, energię i odpady, ale nie odbiera sprzedaży, bo maszyna i tak nie pracuje na okrągło i jej wolny czas nie ma kupca. Krótsze przezbrojenie pozwala tam robić mniejsze partie, a mniejsze partie to mniejszy zapas.

Ile wart jest mniejszy zapas, policzył ponad sto lat temu Ford Whitman Harris. Opłacalna wielkość partii rośnie u niego z pierwiastkiem kosztu przezbrojenia [4]. Z tego samego wzoru wynika, że roczny koszt przezbrojeń i utrzymania zapasu też rośnie z pierwiastkiem. Przezbrojenie krótsze o połowę obniża więc ten koszt nie o połowę, ale o około 29%.

Policzyliśmy to dla jednego wyrobu na danych fikcyjnych. Roczny popyt to 24 tysiące sztuk, godzina postoju przy przezbrojeniu kosztuje 600 zł, a utrzymanie sztuki w zapasie przez rok 5 zł. Przezbrojenie trwa godzinę.

| Przezbrojenie krótsze o | Opłacalna partia | Przezbrojeń w roku | Koszt przezbrojeń i zapasu w roku | Oszczędność w roku |
|---|---|---|---|---|
| 0% (60 min) | 2 400 szt. | 10 | 12 000 zł | — |
| 20% | 2 147 szt. | 11,2 | 10 733 zł | 1 267 zł |
| 38% | 1 890 szt. | 12,7 | 9 449 zł | 2 551 zł |
| 50% | 1 697 szt. | 14,1 | 8 485 zł | 3 515 zł |
| 75% | 1 200 szt. | 20 | 6 000 zł | 6 000 zł |

Na linii z 20 podobnymi wyrobami trzeba te kwoty pomnożyć przez 20. Wciąż jednak skrócenie przezbrojenia o połowę daje 29% oszczędności, a nie 50%. Harris zauważył też, że brygadziści, którzy dobrze czują koszt przezbrojenia przy małych zleceniach, robią prawie zawsze duże partie, jeśli nikt ich nie pilnuje [4]. Gdy przezbrojenie się skraca, a partie zostają takie same, oszczędność na zapasie w ogóle się nie pojawia.

Zmienić musi się więc plan produkcji. W naszym przykładzie na danych fikcyjnych przy przezbrojeniu krótszym o połowę opłaca się przezbrajać 14 razy w roku zamiast 10. Jeśli planista dalej układa harmonogram według starych partii, SMED zostaje na papierze.

## Na wąskim gardle zysk rośnie wprost z odzyskanym czasem

Inaczej jest na maszynie, przed którą stoi kolejka i która decyduje, ile zakład sprzeda. Tam godzina przezbrojenia to godzina produkcji, której nie będzie. Krótsze przezbrojenie oddaje tę godzinę sprzedaży, a zysk rośnie wprost proporcjonalnie do odzyskanego czasu.

Weźmy wąskie gardło z 15 przezbrojeniami tygodniowo po 50 minut, 48 tygodni pracy w roku i 400 zł marży z każdej godziny pracy (przykład na danych fikcyjnych). Skrócenie przezbrojeń o 38% oddaje 4,75 godziny tygodniowo, czyli 228 godzin rocznie. To około 91 tys. zł marży, jeśli rynek kupi dodatkową produkcję. Przy skróceniu o połowę wychodzi 300 godzin i 120 tys. zł.

Jeśli rynek nie kupi więcej, odzyskane godziny na wąskim gardle wciąż mają wartość. Zastąpią nadgodziny albo dodatkowe zmiany, które dziś ratują terminy, więc licz wtedy ich koszt zamiast marży.

Na tej samej maszynie możesz też wybrać mniejsze partie zamiast dodatkowej produkcji. Decyzję podejmij przed warsztatem, bo odzyskany czas bez decyzji rozpływa się w mikroprzestojach i dłuższych przerwach.

## Wiele firm porzuca SMED w trakcie

Liczby z artykułów pokazują sukcesy, a nie przeciętne wdrożenie. W przeglądzie 30 artykułów tylko 10, czyli 30%, opisywało ograniczenia wdrożenia, a rachunki oszczędności kosztów nie były podane szczegółowo [1]. Jako główną przeszkodę autorzy przeglądu wskazują brak przeszkolenia pracowników [1]. Badacze z Meksyku, którzy przebadali ankietą 250 pracowników zakładów maquiladora, piszą, że tamtejsze firmy często porzucają SMED, bo uważają go za trudny [3]. Zdaniem autorów dzieje się tak zwykle wtedy, gdy firma nie zna dobrze kolejnych etapów metody albo nie wie, jak się ze sobą wiążą [3].

Polskie dane są skromne, ale idą w tę samą stronę. W ankiecie wśród operatorów z firm na Podkarpaciu tylko w 33% przypadków podejmowano działania, żeby skrócić przezbrojenia, a autorka szacuje, że 47% badanych firm nigdy tego nie robiło [2]. Ankietę wypełniło jednak 29 operatorów z 88 losowo wybranych firm, więc to sygnał, a nie obraz całego przemysłu [2].

## SMED w czterech krokach

### Krok 1. Wybierz maszynę, która ogranicza zakład

Szukaj maszyny, przed którą zawsze czeka materiał, a za którą następne stanowiska stoją bez pracy. Przez tydzień zapisuj raz dziennie, ile pojemników albo palet czeka przed każdą maszyną w ciągu. Tam, gdzie kolejka rośnie, a nie znika do końca zmiany, masz kandydata. Potwierdź go danymi: wysokim wykorzystaniem, nadgodzinami na tej maszynie i liczbą przezbrojeń w tygodniu.

Jeśli takiej maszyny nie ma, a kłopotem jest zapas, zacznij od wyrobów, które robisz w największych partiach. Tam krótsze przezbrojenie najszybciej przełoży się na mniejsze partie.

### Krok 2. Nagraj przezbrojenie i rozdziel czynności

Nagraj jedno pełne przezbrojenie telefonem, od ostatniej dobrej sztuki starego wyrobu do pierwszej dobrej sztuki nowego. Wypisz każdą czynność z czasem i oznacz, czy wymaga zatrzymanej maszyny. Pierwszy etap SMED polega właśnie na rozróżnieniu i rozdzieleniu tych dwóch rodzajów czynności [3].

Nagranie obejrzyj razem z operatorem, który przezbrajał, i z ustawiaczem z innej zmiany. Operator wie, dlaczego coś trwa, a ustawiacz z innej zmiany często robi to samo inaczej. Różnice między zmianami to pierwszy materiał do standardu: zanim cokolwiek przyspieszysz, wybierz najlepszy z dzisiejszych sposobów i naucz go wszystkich.

### Krok 3. Przenieś do pracy maszyny wszystko, co się da

Drugi etap to zamiana jak największej części czynności przy zatrzymanej maszynie na takie, które robi się w trakcie pracy [3]. Narzędzia, formy i materiał przygotuj przed zatrzymaniem. W polskim badaniu w 33% przypadków operator musiał przynosić narzędzia z innych miejsc [2]. Takie chodzenie to najtańsze minuty do odzyskania.

Na nagraniu szukaj czynności, które zwykle da się zrobić przed zatrzymaniem maszyny: przyniesienia formy, narzędzi i materiału, wydruku dokumentacji, sprawdzenia nowego programu, wstępnego nagrzania albo przygotowania pojemników na nowy wyrób. Każdą z nich wpisz na listę „przed zatrzymaniem” i przypisz do konkretnej osoby. Dopiero gdy ta lista działa, warto inwestować w szybkie mocowania i jednakowe śruby, czyli w trzeci etap: uproszczenie tego, co musi zostać przy zatrzymanej maszynie.

### Krok 4. Zapisz standard i zmierz dwa wyniki

Nowy sposób przezbrojenia zapisz jako standard ze zdjęciami i przeszkol według niego wszystkie zmiany, bo brak przeszkolenia to główna przeszkoda wdrożeń [1]. Mierz czas przezbrojenia przez miesiąc i osobno to, co zrobiłeś z odzyskanym czasem: dodatkową produkcję albo mniejsze partie. Bez drugiej liczby nie wiesz, czy SMED zarobił.

Zarządowi pokaż rachunek w tej samej postaci, w jakiej liczyliśmy go wyżej. Na wąskim gardle: odzyskane godziny w roku razy marża z godziny pracy maszyny. Poza nim: różnica rocznego kosztu przezbrojeń i zapasu przed zmianą i po niej, pod warunkiem że partie naprawdę się zmniejszyły. Obie liczby sprawdź po kwartale na danych z produkcji, a nie z planu warsztatu.

## Kiedy te liczby się nie sprawdzą

Wyniki z przeglądu dotyczą przemysłu spożywczego i pochodzą z artykułów, które opisują udane przypadki. Polskie badanie to jedna firma i jedno stanowisko. Nasze rachunki są na danych fikcyjnych i prostym modelu: zakładają stały popyt, stały koszt godziny postoju i to, że rynek kupi dodatkową produkcję z wąskiego gardła.

Liczy się czas do pierwszej dobrej sztuki, a nie do uruchomienia maszyny. Przezbrojenie skrócone o kwadrans, po którym pierwsze sztuki przez pół godziny idą do odpadu, nic nie oddaje.

Jeśli wąskie gardło przesuwa się między maszynami, skrócenie przezbrojeń na jednej z nich oddaje mniej, niż pokazuje rachunek. Krótsze przezbrojenie poprawia też dostępność w OEE, bo przezbrojenie to w nim zaplanowany albo niezaplanowany postój. Jak liczysz przezbrojenia w OEE, zależy jednak od przyjętej definicji, o czym piszemy w [tekście o OEE](/oee-85-procent); porównując OEE przed SMED i po nim, nie zmieniaj definicji po drodze.

Jeśli przezbrojenia są rzadkie, a partie i tak wynikają z zamówień klientów, większy zysk może leżeć gdzie indziej, na przykład w awariach albo w jakości.

## Najpierw wąskie gardło, potem reszta zakładu

Kierownik z początku tekstu nie musi odrzucać warsztatów SMED. Najpierw jednak wskaże maszynę, przed którą stoi kolejka, i nagra na niej jedno przezbrojenie. Z doradcą umówi się na wynik w godzinach odzyskanych na tej maszynie i w złotówkach, które z nich będą, a nie w procentach z prezentacji.

Przezbrojenie krótsze o połowę na maszynie, która ma wolny czas, to 29% mniejszy koszt partii i zapasu [4]. Na wąskim gardle to połowa straconej produkcji z powrotem w sprzedaży.
