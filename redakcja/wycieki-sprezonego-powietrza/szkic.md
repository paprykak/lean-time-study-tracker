## W skrócie

**Problem.** W zakładzie, który nie dba o szczelność sieci, przez wycieki ucieka typowo około 20% powietrza wytwarzanego przez sprężarki [@doe]. Za tę część płacisz pełną cenę prądu, a powietrze nie dociera do żadnej maszyny.

**Dlaczego.** W naszym rachunku wyciek przez otwór 3 mm przy 6 barach to około 580 litrów na minutę [@doe]. Jeśli sieć jest pod ciśnieniem przez cały rok, kosztuje to ponad 25 tys. zł rocznie [@eurostat]. Gdy na końcu hali brakuje ciśnienia, ktoś zwykle podnosi nastawę sprężarki. To zwiększa i zużycie energii, i same wycieki [@doe].

**Co zrobić.** W sobotę, gdy maszyny stoją, zmierz, jak długo sprężarka pracuje pod obciążeniem, a jak długo odpoczywa. Ze wzoru w tym tekście policzysz udział wycieków i ich koszt w złotówkach. Potem znajdź i napraw największe nieszczelności, a dopiero na końcu wróć do pytania o ciśnienie i nową sprężarkę.

## W sobotę słychać, ile płacisz

W sobotę rano, kiedy hala stoi, słychać syk. Dochodzi zza prasy, spod szybkozłącza przy stanowisku spawalniczym, z węża, który ktoś zostawił pod regałem. W tygodniu zagłusza go produkcja, ale sprężarki pracują dalej i uzupełniają to, co ucieka.

Weźmy zakład obróbki metali z dwiema sprężarkami po 37 kW, pracujący na dwie zmiany (to przykład, firma jest fikcyjna). Od kilku miesięcy pneumatyczny docisk na końcu hali zgłasza za niskie ciśnienie. Utrzymanie ruchu podniosło więc nastawę sprężarek z 6 do 7 barów, a kierownik produkcji pyta o trzecią sprężarkę.

Poradnik amerykańskiego Departamentu Energii opisuje dokładnie ten mechanizm: wycieki obniżają ciśnienie w sieci i prowadzą do dokupowania niepotrzebnej mocy sprężarek [@doe]. W zakładzie bez programu szczelności ucieka typowo około 20% wydajności sprężarek, a systematyczne wyszukiwanie i naprawa obniżają to do 5–10% [@doe]. Audytorzy niemieckiej kampanii, która przebadała instalacje w około 100 firmach, uznali ograniczanie wycieków za zwykle najbardziej opłacalne działanie [@radgen]. Nie podnoś więc ciśnienia, tylko uszczelnij sieć. Najpierw policz, ile u ciebie ucieka, a dopiero potem rozmawiaj o sprężarce.

## Otwór 3 mm kosztuje więcej niż nowy wąż

Ile powietrza ucieka przez otwór, wynika z fizyki przepływu przez dyszę. Przeliczyliśmy to dla ciśnień typowych w polskich zakładach i dla otworu idealnego, takiego jak w tabeli Departamentu Energii. Nasz rachunek odtwarza tę tabelę dokładnie: 6,5, 26 i 104 stopy sześcienne na minutę dla otworów 1/16, 1/8 i 1/4 cala przy 100 psi [@doe].

Koszt policzyliśmy przy cenie 0,7685 zł za kWh bez VAT. Tyle według Eurostatu płaciły w pierwszym półroczu 2026 r. polskie firmy zużywające od 2 do 20 GWh rocznie [@eurostat]. Mniejsze firmy płaciły więcej: 0,878 zł [@eurostat]. Moc potrzebną do sprężenia 1 m³ powietrza na minutę, 6,5 kW, wzięliśmy z tej samej tabeli amerykańskiej, która zakłada sprawną sprężarkę [@doe].

![Wykres słupkowy: roczny koszt energii jednego wycieku przy 6 barach. Otwór 1 mm: 65 litrów na minutę, 2 800 zł przy sieci pod ciśnieniem przez cały rok i 1 300 zł przy dwóch zmianach. Otwór 2 mm: 259 l/min, 11 300 i 5 200 zł. Otwór 3 mm: 583 l/min, 25 500 i 11 600 zł. Otwór 4 mm: 1 037 l/min, 45 300 i 20 700 zł.](../../assets/rysunki/wycieki-sprezonego-powietrza-1.svg "Rysunek 1. Dwa razy większy otwór to cztery razy większy wyciek i cztery razy wyższy rachunek. Źródło: obliczenia redakcji (przepływ przez otwór idealny, model zgodny z tabelą DOE), cena energii Eurostat 2026-S1.")

W naszym rachunku przy 7 barach ten sam otwór przepuszcza o 14% więcej powietrza niż przy 6 barach, bo przepływ przez otwór rośnie z różnicą ciśnień [@doe]. Wyciek rośnie z kwadratem średnicy, więc jedna dziura 4 mm kosztuje tyle co szesnaście otworów 1 mm. Szukaj więc najpierw dużych wycieków.

To górne oszacowanie dla tej średnicy. Nieszczelność w złączce ma nieregularny kształt i przepuszcza mniej powietrza niż idealny otwór. Ale sieć z dziesiątkami złączy ma też dziesiątki takich miejsc.

## Krok 1. Zmierz wycieki w sobotę

Test działa przy sprężarkach, które na przemian pracują pod obciążeniem i odpoczywają [@doe]. Uruchom sprężarkę, gdy w zakładzie nie pracuje żadne urządzenie zasilane powietrzem [@doe]. Sprężarka będzie się wtedy cyklicznie załączać tylko dlatego, że powietrze ucieka. Zmierz kilka cykli: ile minut sprężarka pracuje pod obciążeniem (T) i ile minut odpoczywa (t) [@doe]. Udział wycieków w jej wydajności to:

**udział wycieków (%) = T × 100 / (T + t)** [@doe]

Przykład na danych fikcyjnych: sprężarka pracuje pod obciążeniem przez 30 sekund, potem odpoczywa przez 2 minuty. Udział wycieków to 0,5 × 100 / (0,5 + 2), czyli 20%. Przy sprężarkach o łącznej mocy 75 kW, 4 000 godzinach pracy w roku i cenie 0,7685 zł za kWh to około 46 tys. zł rocznie. Gdy zejdziesz do 10%, oszczędzisz około 23 tys. zł.

Na pieniądze przeliczysz każdy wynik tak samo: udział wycieków razy moc sprężarek w kW, razy godziny, w których sieć jest pod ciśnieniem, razy twoja cena kWh. Gdy masz dwie sprężarki, a jedna wystarcza na potrzeby testu, zostaw włączoną jedną.

Moc znajdziesz na tabliczce znamionowej sprężarki albo w jej dokumentacji. Godziny to czas, w którym sieć jest pod ciśnieniem, a nie tylko czas pracy maszyn: przy dwóch zmianach przez 250 dni to 4 000 godzin, przy pracy ciągłej 8 760. Cenę policz z faktury: całą kwotę za energię i dystrybucję podziel przez liczbę zużytych kWh. Wynik zapisz w karcie testu, żeby za kwartał porównać go z następnym (przykład na danych fikcyjnych):

| Data | Sprężarka | T (min) | t (min) | Udział wycieków | Moc (kW) | Godziny w roku | Cena (zł/kWh) | Koszt (zł/rok) |
|---|---|---|---|---|---|---|---|---|
| 15.11 | nr 1 i 2 | 0,5 | 2,0 | 20% | 75 | 4 000 | 0,7685 | 46 100 |

Sprężarki z falownikiem nie przełączają się między obciążeniem a odpoczynkiem. Wtedy użyj spadku ciśnienia [@doe]. Doprowadź sieć do ciśnienia roboczego p1, wyłącz sprężarkę i zmierz, ile minut (T) trwa spadek do p2, mniej więcej połowy ciśnienia roboczego [@doe]. Potrzebna jest też pojemność sieci V w m³: zbiorniki i rurociągi [@doe]. W jednostkach SI wzór wygląda tak (przeliczenie redakcji):

**wyciek (m³/min) = V × (p1 − p2) / (1,013 × T) × 1,25** [@doe]

Mnożnik 1,25 przelicza wynik na ciśnienie robocze [@doe]. Przykład na danych fikcyjnych: sieć o pojemności 3 m³ traci ciśnienie z 6 do 3 barów w 5 minut. To 2,2 m³ na minutę, czyli około piątej części tego, co dają sprężarki 75 kW.

Test nie obejmuje urządzeń, którym na czas pomiaru odcięto powietrze [@doe]. Nieszczelny siłownik, który w tygodniu pracuje, w sobotę nie wycieka. Dlatego wynik testu to dolna granica.

## Krok 2. Znajdź, oznacz i napraw

Najczęściej wycieka na złączach, wężach, przewodach i złączkach, na reduktorach ciśnienia, przy otwartych odwadniaczach kondensatu i zaworach odcinających, na połączeniach rur, szybkozłączach i uszczelnieniach gwintów [@doe]. Większość wycieków jest w punktach poboru, a nie w rurociągach rozprowadzających [@doe]. Zacznij więc od stanowisk, na których często przepina się narzędzia pneumatyczne. Jeśli sieć ma zawory odcinające do poszczególnych hal, otwieraj je po kolei, każdy na mniej więcej pół godziny, i patrz, jak zmienia się wyciek. Tak zrobiono w jednym z audytów kampanii niemieckiej, w sobotę, gdy zakład nie produkował [@radgen].

Najlepszym narzędziem jest detektor ultradźwiękowy, który wyłapuje syk wycieku wśród hałasu hali [@doe]. Bez detektora zostaje woda z mydłem nakładana pędzlem: metoda pewna, ale powolna [@doe]. Detektor wskazuje miejsce, ale nie wielkość. W badaniu laboratoryjnym na przebitej rurze pokazywał 75 dB niezależnie od średnicy otworu i ciśnienia [@dudic]. O kolejności napraw zdecyduj więc według tego, co widzisz i słyszysz z bliska, a nie według odczytu detektora.

Każdy znaleziony wyciek oznacz zawieszką z numerem i wpisz na listę: miejsce, szacunkowa wielkość, kto naprawia i do kiedy. Duże wycieki naprawiaj w tym samym tygodniu, drobne przy najbliższym postoju. Po naprawach powtórz test z kroku 1. Druga liczba pokaże zarządowi efekt w złotówkach.

Naprawy są zwykle tanie w porównaniu z tym, co ucieka. W kampanii niemieckiej wymiana odwadniacza kondensatu sterowanego czasowo na elektroniczny kosztowała około 150 euro, a dawała około 100 euro oszczędności rocznie [@radgen]. Odwadniacz sterowany czasem otwiera się według zegara, także wtedy, gdy kondensatu prawie nie ma, i wypuszcza przy tym sprężone powietrze [@doe].

## Krok 3. Ciśnienie obniżaj dopiero po uszczelnieniu

Każde 2 psi, czyli około 0,14 bara, więcej na wylocie sprężarki to około 1% więcej energii przy pełnej wydajności [@doe]. W przeliczeniu redakcji to około 7% na każdy bar. Wyższe ciśnienie zwiększa też wycieki: im mniejsza różnica ciśnień na otworze, tym mniejszy przepływ [@doe].

W zakładzie z przykładu (dane fikcyjne) podniesienie nastawy z 6 do 7 barów zwiększyło więc zużycie energii o około 7%, a wycieki o 14%. A docisk na końcu hali dalej będzie zgłaszał spadki, jeśli ich przyczyną są nieszczelności po drodze. Gdy po naprawach ciśnienie na końcu sieci jest stabilne, obniżaj nastawę stopniowo, sprawdzając, czy najbardziej wymagające urządzenie dalej pracuje.

## Krok 4. Utrzymaj wynik

Sieć znów zacznie przeciekać: węże się ścierają, złączki luzują, a nowe stanowiska dochodzą bez sprawdzenia. Wpisz test sprężarki do planu utrzymania ruchu i powtarzaj go co kwartał, w tych samych warunkach. Wynik zapisuj obok zużycia energii przez sprężarki. Gdy udział wycieków rośnie, wracasz do kroku 2.

Według poradnika Departamentu Energii zakład, który systematycznie szuka i naprawia wycieki, utrzymuje je poniżej 5–10% wydajności sprężarek [@doe]. To realny cel na koniec pierwszego roku.

Dopiero gdy sieć jest szczelna, wróć do pytania o nową sprężarkę. Powtórz test, sprawdź ciśnienie na końcu sieci w szczycie zmiany i zobacz, czy sprężarki dalej pracują bez odpoczynku. Jeśli tak, potrzebujesz więcej powietrza. Jeśli nie, zakup nie jest potrzebny.

## Ile o tym naprawdę wiemy

Liczba „20% w typowym zakładzie” pochodzi z poradnika rządowego, a nie z badania, w którym zmierzono wycieki w setkach fabryk [@doe]. Poradnik nie opisuje, skąd ją wziął. Recenzowanych pomiarów z wielu zakładów nie znaleźliśmy.

Najbliższe takiemu badaniu są audyty niemieckiej kampanii „Druckluft effizient”, którą prowadziły Niemiecka Agencja Energetyczna, Instytut Fraunhofera ISI i związek producentów maszyn VDMA [@radgen]. W Niemczech instalacje sprężonego powietrza zużywały wtedy około 7% energii elektrycznej przemysłu [@radgen]. Około 100 firm dostało darmowy audyt; wycieki odpowiadały w nich za największą część strat, a zidentyfikowane oszczędności wynosiły zwykle od 10 do 35% energii instalacji [@radgen]. To jednak firmy, które odpowiedziały na zaproszenie, a nie losowa próba.

Jedyny recenzowany pomiar, do którego dotarliśmy, dotyczy jednej instalacji w budynku usługowym. Wycieki stanowiły tam 62% powietrza, a ich usunięcie dałoby około 44% oszczędności energii instalacji [@nascimento]. To pojedynczy przypadek, a nie średnia. Dlatego zamiast przyjmować cudzą liczbę, zmierz własną w sobotę.

## Kiedy ten rachunek nie pasuje

Tabela zakłada, że sieć jest pod ciśnieniem przez wszystkie godziny w roku albo na dwie zmiany. Jeśli po pracy odcinasz powietrze zaworem głównym, wycieki kosztują tylko w godzinach pracy. Jeśli sprężarki chodzą w weekendy dla jednej maszyny, płacisz za wycieki także wtedy.

Koszt energii to nie wszystko. Wycieki skracają też życie sprężarek, bo zmuszają je do dłuższej pracy, a za niskie ciśnienie obniża wydajność narzędzi pneumatycznych [@doe]. Tego w naszym rachunku nie liczymy.

Mała instalacja z kilkoma odbiorami może mieć tak niski rachunek, że nie opłaca się kupować detektora. Wtedy wystarczą test sprężarki i woda z mydłem.

## Najpierw sobota, potem sprężarka

Zakład z dwiema sprężarkami nie musi kupować trzeciej, zanim nie zmierzy, ile powietrza traci. Wystarczy jedna sobota: test sprężarki, obchód hali z detektorem albo pędzlem i lista nieszczelności. Wynik w procentach przelicza się na złotówki tym samym wzorem, którego użyliśmy w przykładzie.

Następna rozmowa o ciśnieniu i nowej sprężarce będzie wtedy krótsza. Syk w sobotę rano to dźwięk rachunku za prąd, który płacisz także od poniedziałku do piątku.
