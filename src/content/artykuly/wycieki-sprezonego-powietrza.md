---
tytul: "Nie podnoś ciśnienia, tylko uszczelnij sieć sprężonego powietrza"
tytulSeo: "Koszt wycieku sprężonego powietrza i jak go zmierzyć"
opisSeo: "Otwór 3 mm przy 6 barach to do 25 tys. zł rocznie, gdy sieć pracuje całą dobę. Jak w sobotę zmierzyć wycieki sprężonego powietrza i ich koszt."
lead: "Według szacunku Departamentu Energii USA wycieki zabierają w zaniedbanej sieci około jednej piątej wydajności sprężarek. Otwór 3 mm przy 6 barach to w naszym rachunku do 25 tys. zł rocznie, gdy sieć jest pod ciśnieniem całą dobę. Kto podnosi ciśnienie zamiast uszczelnić sieć, płaci więcej i powiększa wycieki."
dzial: produkcja
format: Poradnik
tematy:
  - energia
autorzy:
  - redakcja
opublikowano: 2026-11-09
zdjecie: sprezarkownia-winterslag
podpisZdjecia: "Hala sprężarek dawnej kopalni Winterslag w Genk. Każdy metr sześcienny powietrza, który ucieka przez nieszczelność, ktoś najpierw musiał sprężyć."
powiazane:
  - oee-85-procent
zrodla:
  - opis: "U.S. Department of Energy, Compressed Air Challenge (b.d.), Improving Compressed Air System Performance: A Sourcebook for Industry, 3. wyd., sekcja 1 i Fact Sheets 1–3."
    adres: "https://www.compressedairchallenge.org/data/sites/1/media/library/sourcebook/Improving_Compressed_Air-Sourcebook.pdf"
    rodzaj: "Raport instytucji"
    dostep: 2026-11-09
  - opis: "Eurostat (2026), Electricity prices for non-household consumers – bi-annual data (nrg_pc_205), Polska, pasma ID i IC, bez VAT i podatków zwrotnych, PLN/kWh, aktualizacja 19 października 2026."
    adres: "https://ec.europa.eu/eurostat/databrowser/view/nrg_pc_205/default/table?lang=en"
    rodzaj: "Dane publiczne"
    dostep: 2026-11-09
  - opis: "Radgen P. (2003), The „Efficient Compressed Air” Campaign in Germany: Market Transformation to Activate Cost Reductions and Emissions Savings, w: ACEEE Summer Study on Energy Efficiency in Industry, s. 3-194–3-205 (Fraunhofer ISI)."
    adres: "https://www.aceee.org/wp-content/uploads/proceedings-1980-2020/2003/SS03_Panel3_Paper18.pdf"
    rodzaj: "Raport instytucji"
    dostep: 2026-11-09
  - opis: "Dudić S., Ignjatović I., Šešlija D., Blagojević V., Stojiljković M. (2012), Leakage Quantification of Compressed Air on Pipes Using Thermovision, Thermal Science 16(suppl. 2), S555–S565, DOI 10.2298/TSCI120503191D."
    adres: "https://www.thermalscience.rs/pdfs/papers-2012/TSCI120503191D.pdf"
    rodzaj: "Badanie recenzowane"
    dostep: 2026-11-09
  - opis: "Martin Nascimento G. F., Wurtz F., Kuo-Peng P., Delinchant B., Batistela N. J. (2022), Quantifying Compressed Air Leakage through Non-Intrusive Load Monitoring Techniques in the Context of Energy Audits, Energies 15(9), 3213 (streszczenie)."
    adres: "https://doi.org/10.3390/en15093213"
    rodzaj: "Badanie recenzowane"
    dostep: 2026-11-09
faq:
  - pytanie: "Ile kosztuje wyciek sprężonego powietrza?"
    odpowiedz: "Zależy od średnicy otworu, ciśnienia, ceny prądu i godzin pracy sieci. W naszym rachunku przy 6 barach i cenie 0,7685 zł za kWh otwór 1 mm kosztuje około 2 800 zł rocznie, 2 mm około 11 300 zł, a 3 mm około 25 500 zł, jeśli sieć jest pod ciśnieniem całą dobę przez cały rok. Przy dwóch zmianach te kwoty są mniej więcej o połowę niższe."
  - pytanie: "Jak sprawdzić, ile powietrza ucieka z instalacji?"
    odpowiedz: "Gdy żadne urządzenie nie pobiera powietrza, zmierz, ile minut sprężarka pracuje pod obciążeniem (T) i ile odpoczywa (t). Udział wycieków to T × 100 / (T + t). Przy sprężarce z falownikiem zmierz czas spadku ciśnienia w sieci od ciśnienia roboczego do mniej więcej jego połowy i użyj wzoru z pojemnością sieci."
  - pytanie: "Jaki poziom wycieków jest normalny?"
    odpowiedz: "Poradnik Departamentu Energii USA szacuje, bez podania metody, że zakład, który nie dba o szczelność, traci około 20% wydajności sprężarek, a systematyczne wyszukiwanie i naprawa wycieków mogą obniżyć je poniżej 5–10%."
  - pytanie: "Czy obniżenie ciśnienia daje oszczędności?"
    odpowiedz: "Tak, ale dopiero po uszczelnieniu sieci. Każde 2 psi (ok. 0,14 bara) więcej to około 1% więcej energii przy pełnej wydajności sprężarki, a wyższe ciśnienie zwiększa też przepływ przez każdy wyciek."
metoda: "Tekst opiera się na poradniku Departamentu Energii USA (Compressed Air Challenge), materiałach niemieckiej kampanii „Druckluft effizient” (Fraunhofer ISI), danych Eurostatu o cenach energii dla firm w Polsce i dwóch badaniach recenzowanych. Koszt wycieków policzyliśmy z równania przepływu przez otwór; model odtwarza tabelę Departamentu Energii, a kod jest w archiwum redakcji. Recenzowanych pomiarów udziału wycieków w wielu zakładach nie znaleźliśmy. Przykłady są fikcyjne. Konflikt interesów: redaktor naczelny prowadzi doradztwo w operacjach; tekst nie odsyła do jego usług."
szkic: true
---
## W skrócie

**Problem.** Poradnik amerykańskiego Departamentu Energii szacuje, bez podania metody, że w zakładzie, który nie dba o szczelność sieci, wycieki zabierają około 20% wydajności sprężarek [1]. Ile u ciebie, pokaże jeden test w sobotę.

**Dlaczego.** W naszym rachunku wyciek przez otwór 3 mm przy 6 barach to około 580 litrów na minutę [1]. Jeśli sieć jest pod ciśnieniem całą dobę przez cały rok, kosztuje to do 25 tys. zł rocznie [2]. Gdy na końcu hali brakuje ciśnienia, ktoś zwykle podnosi nastawę sprężarki. To zwiększa i zużycie energii, i same wycieki [1].

**Co zrobić.** W sobotę, gdy maszyny stoją, zmierz, jak długo sprężarka pracuje pod obciążeniem, a jak długo odpoczywa. Ze wzoru w tym tekście policzysz udział wycieków i ich koszt w złotówkach. Potem znajdź i napraw największe nieszczelności, a dopiero na końcu wróć do pytania o ciśnienie i nową sprężarkę.

## W sobotę słychać, ile płacisz

Weźmy sobotni ranek w zakładzie obróbki metali, w którym stoją maszyny, a mimo to słychać syk (przykład na danych fikcyjnych). Dochodzi zza prasy, spod szybkozłącza przy stanowisku spawalniczym, z węża, który ktoś zostawił pod regałem. W tygodniu zagłusza go produkcja. Sprężarki pracują jednak dalej i uzupełniają to, co ucieka.

Zakład ma dwie sprężarki po 37 kW i pracuje na dwie zmiany. Od kilku miesięcy pneumatyczny docisk na końcu hali zgłasza za niskie ciśnienie. Utrzymanie ruchu podniosło więc nastawę sprężarek z 6 do 7 barów, a kierownik produkcji pyta o trzecią sprężarkę.

Poradnik amerykańskiego Departamentu Energii opisuje dokładnie ten mechanizm: wycieki obniżają ciśnienie w sieci, a zakład dokupuje moc sprężarek, której nie potrzebuje [1]. Według raportu z niemieckiej kampanii, w której producenci sprężarek i doradcy zbadali instalacje w około 100 firmach, ograniczanie wycieków zwykle opłaca się najbardziej [3]. Zanim ktoś podniesie ciśnienie albo zamówi sprężarkę, trzeba więc zmierzyć, ile powietrza ucieka.

## Dwa razy większy otwór to cztery razy wyższy rachunek

Ile powietrza ucieka przez otwór, wynika z fizyki przepływu przez dyszę. Przeliczyliśmy to dla 6 i 7 barów i dla otworu idealnego, takiego jak w tabeli Departamentu Energii. Nasz rachunek zgadza się z tą tabelą dla wszystkich trzech średnic, które podaje [1].

Koszt policzyliśmy przy cenie 0,7685 zł za kWh bez VAT. Tyle według Eurostatu płaciły w pierwszym półroczu 2026 r. polskie firmy zużywające od 2 do 20 GWh rocznie [2]. Mniejsze firmy płaciły więcej, więc ich rachunek będzie wyższy: 0,878 zł przy zużyciu od 0,5 do 2 GWh i ponad 1,12 zł przy mniejszym [2]. Moc 6,5 kW na każdy metr sześcienny powietrza na minutę wyliczyliśmy z tej samej tabeli; zakłada ona sprawną sprężarkę i ciśnienie około 7 barów [1]. Przy 6 barach sprężarka zużywa trochę mniej energii, więc koszty dla 6 barów są w naszym rachunku raczej zawyżone o kilka procent.

![Wykres słupkowy: roczny koszt energii jednego wycieku przy 6 barach. Otwór 1 mm: 65 litrów na minutę, 2 800 zł przy sieci pod ciśnieniem przez cały rok i 1 300 zł przy dwóch zmianach. Otwór 2 mm: 259 l/min, 11 300 i 5 200 zł. Otwór 3 mm: 583 l/min, 25 500 i 11 600 zł. Otwór 4 mm: 1 037 l/min, 45 300 i 20 700 zł.](../../assets/rysunki/wycieki-sprezonego-powietrza-1.svg "Rysunek 1. Dwa razy większy otwór to cztery razy większy wyciek i cztery razy wyższy rachunek. Źródło: obliczenia redakcji (przepływ przez otwór idealny, model zgodny z tabelą DOE), cena energii Eurostat 2026-S1.")

W naszym rachunku przy 7 barach ten sam otwór przepuszcza o 14% więcej powietrza niż przy 6 barach. Wyciek rośnie tu proporcjonalnie do ciśnienia bezwzględnego. Poradnik Departamentu Energii potwierdza, że wyższe ciśnienie zwiększa wyciek [1]. Wyciek rośnie też z kwadratem średnicy: jeden otwór 4 mm kosztuje tyle co szesnaście otworów 1 mm. Zacznij więc od największych.

Takie liczby to górna granica: nieszczelna złączka ma nieregularny kształt i przepuszcza mniej powietrza niż otwór idealny. Za to w sieci z dziesiątkami złączy takich miejsc są dziesiątki.

## Krok 1. Zmierz wycieki w sobotę

Test działa przy sprężarkach, które na przemian pracują pod obciążeniem i odpoczywają. Najpierw wyłącz wszystkie urządzenia zasilane powietrzem. Potem uruchom sprężarkę. Gdy masz kilka sprężarek, zostaw włączoną jedną, o ile sama utrzyma ciśnienie w sieci.

Sprężarka będzie się wtedy cyklicznie załączać tylko dlatego, że powietrze ucieka. Zmierz kilka cykli: ile minut pracuje pod obciążeniem (T) i ile minut odpoczywa (t). Udział wycieków w jej wydajności to [1]:

**udział wycieków (%) = T × 100 / (T + t)** [1]

Przykład na danych fikcyjnych: na czas testu zostaje włączona jedna sprężarka 37 kW. Pod obciążeniem pracuje 30 sekund, potem odpoczywa 45. Udział wycieków to 0,5 × 100 / (0,5 + 0,75), czyli 40% wydajności tej sprężarki.

Jeśli sieć jest pod ciśnieniem 4 000 godzin w roku, a kWh kosztuje 0,7685 zł, wycieki kosztują do około 45 tys. zł rocznie. Naprawa połowy z nich to do około 23 tys. zł oszczędności. Słowo „do” jest tu ważne. Sprężarka śrubowa, gdy odpoczywa, zwykle pobiera jeszcze 15–35% pełnej mocy [1]. Jeśli sterownik jej wtedy nie wyłącza, oszczędność wyniesie raczej 65–85% tej kwoty, czyli 15–19 tys. zł.

Każdy wynik przeliczysz na złote tak samo: pomnóż udział wycieków przez moc sprężarki z testu w kW, przez liczbę godzin pod ciśnieniem i przez swoją cenę kWh. Cały test mieści się w sześciu krokach.

![Schemat w sześciu krokach: 1. wyłącz wszystkie odbiory powietrza; 2. zostaw włączoną jedną sprężarkę, jeśli sama utrzyma ciśnienie; 3. zmierz kilka cykli: T to minuty pod obciążeniem, t to minuty odpoczynku; 4. udział wycieków w procentach to T razy 100 przez T plus t; 5. koszt roczny to udział razy moc tej sprężarki w kW razy godziny pod ciśnieniem razy cena kWh; 6. zapisz wynik w karcie i powtórz test po naprawach.](../../assets/rysunki/wycieki-sprezonego-powietrza-2.svg "Rysunek 2. Test wycieków zajmuje jedną sobotę i nie wymaga żadnego zakupu. Źródło: opracowanie redakcji na podstawie poradnika Departamentu Energii USA (s. 28).")

Moc znajdziesz na tabliczce znamionowej sprężarki albo w jej dokumentacji. Liczą się godziny pod ciśnieniem, nie samej pracy maszyn: dwie zmiany przez 250 dni to 4 000 godzin, praca ciągła 8 760. Cenę policz z faktury: zmienne opłaty za energię i dystrybucję podziel przez liczbę zużytych kWh. Opłaty stałe po naprawie wycieków nie spadną. Wynik zapisz w karcie testu, żeby za kwartał porównać go z następnym (przykład na danych fikcyjnych, 4 000 godzin w roku i 0,7685 zł za kWh):

| Data | Sprężarka | T (min) | t (min) | Udział | Koszt (zł/rok) |
|---|---|---|---|---|---|
| 15.11 | nr 1, 37 kW | 0,5 | 0,75 | 40% | do 45 500 |

Sprężarki z falownikiem nie przełączają się między obciążeniem a odpoczynkiem, więc dla nich jest druga metoda: spadek ciśnienia [1]. Doprowadź sieć do ciśnienia roboczego p1, wyłącz sprężarkę i zmierz czas T w minutach, w którym ciśnienie spadnie do p2, czyli mniej więcej połowy roboczego. Potrzebna jest też pojemność sieci V w m³, czyli zbiorników i rurociągów [1]. Pojemność zbiornika znajdziesz w jego dokumentacji, a pojemność rur policzysz z długości i średnicy wewnętrznej: na przykład 100 m rury o średnicy 50 mm to około 0,2 m³. W jednostkach SI wzór wygląda tak (przeliczenie redakcji):

**wyciek (m³/min) = V × (p1 − p2) / (1,013 × T) × 1,25** [1]

Mnożnik 1,25 przelicza wynik na ciśnienie robocze [1]. Przykład na danych fikcyjnych: sieć o pojemności 3 m³ traci ciśnienie z 6 do 3 barów w 5 minut. To 2,2 m³ na minutę, czyli około 20% wydajności dwóch sprężarek po 37 kW.

Obie metody z poradnika Departamentu Energii różnią się tym, czego potrzebujesz i co dostajesz [1]:

| | Test obciążenia sprężarki | Spadek ciśnienia w sieci |
|---|---|---|
| Dla jakich sprężarek | pracujących na przemian pod obciążeniem i bez niego albo załączanych i wyłączanych | o każdym sterowaniu, także z falownikiem |
| Co mierzysz | minuty pod obciążeniem (T) i odpoczynku (t) w kilku cyklach | czas spadku ciśnienia z roboczego do mniej więcej połowy |
| Czego potrzebujesz | stopera | manometru za zbiornikiem i pojemności sieci V |
| Co dostajesz | udział wycieków w wydajności sprężarki | wyciek w m³ powietrza na minutę |

Test nie obejmuje urządzeń, którym na czas pomiaru odcięto powietrze [1]. Nieszczelny siłownik odcięty na czas testu nie wycieka, więc jego strat nie zobaczysz. W tygodniu wycieki mogą więc być większe niż w sobotnim teście.

## Krok 2. Znajdź, oznacz i napraw

Najczęściej przecieka na złączach i złączkach, szybkozłączach i gwintach, w wężach, przewodach, reduktorach i połączeniach rur oraz przy otwartych odwadniaczach kondensatu i zaworach odcinających [1]. Większość wycieków jest w punktach poboru, a nie w rurociągach rozprowadzających [1]. Zacznij więc od stanowisk, na których często przepina się narzędzia pneumatyczne. Jeśli sieć ma zawory odcinające do poszczególnych hal, otwieraj je po kolei, każdy na mniej więcej pół godziny, i patrz, jak zmienia się wyciek. Tak zrobiono w jednym z audytów kampanii niemieckiej, w sobotę, gdy zakład nie produkował [3].

Najlepszym narzędziem jest detektor ultradźwiękowy, który wyłapuje syk wycieku wśród hałasu hali [1]. Bez detektora zostaje woda z mydłem nakładana pędzlem: metoda pewna, ale powolna [1]. Odczyt detektora nie zawsze zdradza wielkość wycieku: w badaniu laboratoryjnym na przebitej stalowej rurze wskazywał 75 dB niezależnie od średnicy otworu i ciśnienia [4]. O kolejności napraw decyduj więc także tym, co widać i słychać z bliska.

Każdy znaleziony wyciek oznacz zawieszką z numerem i wpisz na listę: miejsce, szacunkowa wielkość, kto naprawia i do kiedy. Duże wycieki naprawiaj w tym samym tygodniu, drobne przy najbliższym postoju. Po naprawach powtórz test z kroku 1. Druga liczba pokaże zarządowi efekt w złotówkach.

Porównaj cenę części z rysunkiem 1: otwór 2 mm przy dwóch zmianach to w naszym rachunku około 430 zł miesięcznie. Autor raportu z kampanii niemieckiej podaje też typowy przykład: wymiana odwadniacza kondensatu sterowanego czasowo na elektroniczny kosztuje około 150 euro, a daje zwykle około 100 euro oszczędności rocznie [3]. Odwadniacz sterowany czasem otwiera się według zegara, także wtedy, gdy kondensatu prawie nie ma, i wypuszcza przy tym sprężone powietrze [1].

## Krok 3. Ciśnienie obniżaj dopiero po uszczelnieniu

Każde 0,14 bara (2 psi) więcej na wylocie sprężarki to około 1% więcej energii przy pełnej wydajności [1]. Wyższe ciśnienie zwiększa też wycieki, bo przez ten sam otwór ucieka wtedy więcej powietrza [1]. Podniesienie nastawy o bar kosztuje więc podwójnie:

| Co rośnie po podniesieniu ciśnienia o 1 bar | O ile | Skąd |
|---|---|---|
| energia przy pełnej wydajności sprężarki | ok. 7% | 1% na każde 2 psi [1], przeliczenie redakcji |
| energia, gdy w sieci jest dużo poboru bez reduktora, w tym wycieków | ok. 12–15% | 1,6–2% na każde 2 psi [1], przeliczenie redakcji |
| wyciek przez ten sam otwór, z 6 do 7 barów | ok. 14% | obliczenia redakcji (rysunek 1) |

W zakładzie z przykładu (dane fikcyjne) podniesienie nastawy z 6 do 7 barów dołożyło więc około 7% do zużycia energii przy tej samej ilości powietrza, a wycieki zwiększyło o 14%.

Bywa też, że test pokaże mało wycieków, a na końcu hali dalej brakuje ciśnienia. Wtedy szukaj spadku po drodze. Zmierz w szczycie zmiany ciśnienie za sprężarką i przy docisku. Dobrze zaprojektowana sieć traci od sprężarki do punktu poboru znacznie mniej niż 10% ciśnienia [1]. Największe spadki są zwykle tuż przy urządzeniach, na ostatnich metrach sieci: w za cienkich albo nieszczelnych wężach, szybkozłączach, filtrach i reduktorach [1]. Gdy po naprawach ciśnienie na końcu sieci jest stabilne, obniżaj nastawę stopniowo, sprawdzając, czy najbardziej wymagające urządzenie dalej pracuje.

## Krok 4. Utrzymaj wynik

Według poradnika Departamentu Energii systematyczne wyszukiwanie i naprawa mogą obniżyć wycieki poniżej 5–10% wydajności sprężarek [1]. Sieć jednak znów zacznie przeciekać: węże się ścierają, złączki luzują, a nowe stanowiska dochodzą bez sprawdzenia. Wpisz test sprężarki do planu utrzymania ruchu i powtarzaj go co kwartał, w tych samych warunkach. Wynik zapisuj obok zużycia energii przez sprężarki. Gdy udział wycieków rośnie, wracasz do kroku 2.

Dopiero gdy sieć jest szczelna, wróć do pytania o nową sprężarkę. Powtórz test, sprawdź ciśnienie na końcu sieci w szczycie zmiany i zobacz, czy sprężarki dalej pracują bez odpoczynku. Jeśli sprężarki dalej pracują bez odpoczynku, potrzebujesz więcej powietrza. Jeśli odpoczywają, trzecia sprężarka to wydatek bez powodu.

## Ten rachunek ma granice

Liczba 20% pochodzi z poradnika rządowego, który nie podaje, skąd ją wziął [1]. Recenzowanych pomiarów z wielu zakładów nie znaleźliśmy. W niemieckiej kampanii „Druckluft effizient” około 100 firm dostało darmowy audyt, który wskazywał zwykle od 10 do 35% możliwych oszczędności energii instalacji [3]. Audytorzy uznali wycieki za największe źródło strat, ale badali firmy, które odpowiedziały na zaproszenie, a nie losową próbę [3]. Jedyny recenzowany pomiar w działającej instalacji, do którego dotarliśmy, dotyczy budynku usługowego: wycieki oszacowano tam na 62% [5]. Dlatego zamiast przyjmować cudzą liczbę, zmierz własną.

Rysunek 1 zakłada sieć pod ciśnieniem przez cały rok albo na dwie zmiany. Jeśli po pracy odcinasz powietrze zaworem głównym, wycieki kosztują tylko w godzinach pracy. Jeśli sprężarki chodzą w weekendy dla jednej maszyny, płacisz za wycieki także wtedy. Wycieki skracają też życie sprężarek, bo zmuszają je do dłuższej pracy, a za niskie ciśnienie obniża wydajność narzędzi pneumatycznych [1]. Tego w naszym rachunku nie liczymy. W małej instalacji z kilkoma odbiorami detektor może się nie zwrócić, a wtedy wystarczą test sprężarki i woda z mydłem.

## Najpierw sobota, potem sprężarka

Zakład z dwiema sprężarkami nie musi zamawiać trzeciej, zanim nie zmierzy, ile powietrza traci. Wystarczy jedna sobota: test sprężarki, obchód hali z detektorem albo pędzlem i lista nieszczelności.

Gdy w następną sobotę znów usłyszysz syk, będziesz wiedzieć, ile kosztuje. Rozmowa o trzeciej sprężarce zacznie się wtedy od tej liczby, a nie od skarg z końca hali.
