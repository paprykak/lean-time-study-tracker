// Język hali dla wyszukiwarki i strony głównej. Rejestr narzędzi (src/data/narzedzia.ts) dopisują zespoły fabryki,
// więc potoczne słowa i najczęstsze sprawy są tutaj, w osobnym pliku. Test src/lib/szukaj-narzedzi.test.ts pilnuje,
// że każdy slug istnieje w rejestrze. Nowe narzędzie działa w wyszukiwarce bez wpisu (nazwa, opis i pytania z FAQ);
// hasło dopisujesz tylko wtedy, gdy ludzie mówią o sprawie słowem, którego nie ma w nazwie ani w pytaniach, albo gdy
// całe częste zapytanie (podpowiedź Google) przegrywa z innym narzędziem: wyszukiwarka liczy hasło także jako całą frazę.
// Hasło tylko dla sprawy, na którą strona narzędzia naprawdę odpowiada; każda zmiana z testem w obie strony.

/** Potoczne słowa, pod którymi ludzie szukają narzędzia (slug → hasła). */
export const HASLA: Record<string, string[]> = {
  // Pakiet „wyszukiwarka2” (2026-11-15): 27 haseł z podpowiedzi Google (pl) przy 18 narzędziach (źródło każdego
  // w raporty/wyszukiwarka2/RAPORT.md) i 5 usuniętych, które zabierały ogólne zapytania narzędziu głównemu: „L4” przy
  // okresie zasiłkowym, „odprawa” przy odprawie pośmiertnej i zwolnieniach grupowych (słowo jest w nazwie albo w FAQ),
  // „sobota pracująca” przy pracy w sobotę (w podpowiedziach to kalendarz: „sobota pracująca w sierpniu”, na który żadne
  // narzędzie nie odpowiada), „świadectwo pracy” przy stażu pracy (od rundy 7 jest narzędzie o świadectwie). Każda
  // zmiana z testem w obie strony w src/lib/szukaj-narzedzi.test.ts.
  'kalkulator-l4': ['chorobowe', 'zwolnienie lekarskie', 'choroba', 'zasiłek chorobowy', 'e-ZLA', 'ile dostanę na L4'],
  'okres-zasilkowy': ['chorobowe', '182 dni', 'długie zwolnienie'],
  'zwolnienie-na-l4': ['zwolnienie lekarskie', 'choroba', 'wypowiedzenie na L4', 'art. 53', 'zwalniają mnie na L4'],
  'l4-po-zwolnieniu': ['zwolnienie lekarskie', 'choroba po pracy', 'po umowie'],
  'swiadczenie-rehabilitacyjne': ['po L4', 'po 182 dniach', 'rehabilitacyjne'],
  'brutto-netto': ['pensja', 'wypłata', 'na rękę', 'pasek', 'netto', 'ile dostanę', 'najniższa krajowa na rękę', 'najniższa krajowa netto'],
  'zlecenie-netto': ['umowa zlecenie', 'na rękę', 'student'],
  'wyplata-z-nadgodzinami': ['pasek', 'pensja', 'nocki', 'wypłata', 'nadgodziny'],
  'kalkulator-nadgodzin': ['nadgodziny', 'godziny nadliczbowe', 'dodatek 50', 'dodatek 100', 'nadgodzinki', 'odbiór nadgodzin', 'wolne za nadgodziny'],
  'dodatek-za-prace-w-nocy': ['nocki', 'nocna zmiana', 'trzecia zmiana', 'nocne'],
  'praca-w-niedziele': ['święto', 'weekend', 'dzień wolny za niedzielę'],
  'placa-minimalna': ['najniższa krajowa', 'minimalne wynagrodzenie', 'pasek', 'pensja minimalna'],
  'stawka-godzinowa': ['na godzinę', 'stawka', 'pensja'],
  'termin-wyplaty-wynagrodzenia': ['kiedy wypłata', 'spóźniona wypłata', 'dziesiąty', 'wypłata do 10 dnia miesiąca'],
  'przedawnienie-wynagrodzenia': ['zaległa wypłata', 'niezapłacone nadgodziny', 'pozew', 'pozwać o wypłatę'],
  'wynagrodzenie-za-przestoj': ['postój', 'brak pracy', 'awaria', 'stoi linia', 'przestój'],
  'koszt-pracodawcy': ['brutto brutto', 'ZUS pracodawcy', 'całkowity koszt'],
  'kalkulator-ppk': ['emerytura', 'oszczędzanie', 'wpłaty PPK'],
  'delegacja-krajowa': ['wyjazd służbowy', 'podróż służbowa', 'dieta'],
  'delegacja-zagraniczna': ['wyjazd za granicę', 'podróż służbowa', 'dieta zagraniczna'],
  'zasilek-macierzynski': ['ciąża', 'macierzyński', 'rodzicielski', 'urodzenie dziecka'],
  'zasilek-opiekunczy': ['chore dziecko', 'opieka nad dzieckiem', 'L4 na dziecko', 'opieka'],
  'kalkulator-urlopu': ['urlop', 'ile dni urlopu', 'wypoczynkowy', '26 dni', '20 dni', 'urlop na żądanie'],
  'ekwiwalent-za-urlop': ['niewykorzystany urlop', 'urlop po zwolnieniu', 'pieniądze za urlop'],
  'wynagrodzenie-za-urlop': ['urlopowe', 'płatny urlop', 'ile za urlop', 'wynagrodzenie za urlop wypoczynkowy'],
  'urlop-okolicznosciowy': ['ślub', 'pogrzeb', 'narodziny dziecka', 'okolicznościowy', 'krwiodawca'],
  'wolne-na-dziecko': ['opieka nad dzieckiem', '2 dni', 'siła wyższa', 'art. 188'],
  'rodzic-w-pracy': ['dziecko', 'praca zdalna', 'elastyczny czas', 'rodzic', 'praca w nocy a dziecko'],
  'urlop-ojcowski': ['tata', 'ojciec', 'narodziny dziecka'],
  'urlop-wychowawczy': ['wychowawczy', 'dziecko', 'opieka nad dzieckiem'],
  'dni-wolne-od-pracy': ['święta', 'długi weekend', 'kalendarz', 'mostek', 'święto w sobotę', 'Boże Ciało', '11 listopada'],
  'urlop-w-agencji-pracy': ['agencja', 'praca tymczasowa', 'urlop'],
  'okres-wypowiedzenia': ['wypowiedzenie', 'wymówienie', 'zwolnienie', 'odejście z pracy', 'zwalniają mnie', 'rzucam pracę', 'pracownik wypowiada', 'wolne na poszukiwanie', 'wypowiedzenie umowy na czas określony'],
  'kalkulator-odprawy': ['odprawa', 'odprawę', 'odprawa przy zwolnieniu', 'ile pensji odprawy', 'odprawa po latach', 'odprawa za porozumieniem', 'czy należy mi się odprawa', 'odprawa przy redukcji etatów', 'likwidacja stanowiska', 'zwolnienie'],
  'odszkodowanie-za-zwolnienie': ['niesłuszne zwolnienie', 'zwolnienie dyscyplinarne', 'przywrócenie do pracy'],
  'odwolanie-do-sadu-pracy': ['sąd pracy', 'odwołanie', 'dyscyplinarka', 'termin 21 dni'],
  'zwolnienia-grupowe': ['redukcja etatów', 'zwolnienia'],
  'ochrona-przedemerytalna': ['emerytura', '4 lata przed emeryturą', 'wiek emerytalny', 'zwolnienie przed emeryturą'],
  'umowa-na-czas-okreslony': ['33 miesiące', 'trzecia umowa', 'umowa na stałe'],
  'okres-probny': ['umowa na okres próbny', 'pierwsza umowa'],
  'kara-porzadkowa': ['nagana', 'naganę', 'dostałem naganę', 'dostałam naganę', 'dostałem karę', 'upomnienie', 'kara pieniężna', 'sprzeciw', 'potrącenie kary pieniężnej', 'kara z regulaminu'],
  'zakaz-konkurencji': ['konkurencja', 'praca u konkurencji', 'odszkodowanie'],
  'zwrot-kosztow-szkolenia': ['lojalka', 'szkolenie', 'zwrot kosztów', 'kurs'],
  'limit-pracy-tymczasowej': ['agencja pracy', 'praca tymczasowa', '18 miesięcy'],
  'zasilek-dla-bezrobotnych': ['bezrobocie', 'urząd pracy', 'po zwolnieniu', 'kuroniówka'],
  'staz-pracy': ['lata pracy', 'staż'],
  'odprawa-posmiertna': ['śmierć pracownika', 'rodzina'],
  'kontrola-grafiku': ['grafik', 'harmonogram', 'zmiany', 'odpoczynek', '11 godzin', '12 godzin', 'praca zmianowa', 'odpoczynek dobowy'],
  'wymiar-czasu-pracy': ['ile godzin', 'godziny w miesiącu', 'etat', 'norma godzin'],
  'przerwy-w-pracy': ['przerwa', 'śniadaniowa', '15 minut', 'monitor', 'komputer'],
  'dyzur-w-pracy': ['dyżur', 'pod telefonem', 'gotowość'],
  'dni-robocze': ['dni robocze', 'termin', 'kalendarz'],
  'pracownik-mlodociany': ['uczeń', 'praktykant', 'nieletni', 'młodociany'],
  'pracownik-niepelnosprawny': ['orzeczenie', 'niepełnosprawność', 'krótszy czas pracy'],
  'temperatura-w-pracy': ['zimno', 'upał', 'gorąco', 'ogrzewanie', 'napoje', 'ile stopni w pracy', 'woda w pracy', 'temperatura na hali'],
  'halas-w-pracy': ['hałas', 'głośno', 'nauszniki', 'decybele'],
  'drgania-w-pracy': ['wibracje', 'drgania', 'młot', 'wózek'],
  'szkolenie-okresowe-bhp': ['szkolenie BHP', 'szkolenie okresowe', 'termin BHP'],
  'kontrola-trzezwosci': ['alkomat', 'alkohol', 'nietrzeźwy', 'kac'],
  'praca-w-ciazy': ['ciąża', 'w ciąży', 'monitor', 'stanie'],
  'normy-sanitarne': ['toaleta', 'WC', 'szatnia', 'prysznic', 'toaleta w pracy', 'szatnia w pracy'],
  'powierzchnia-na-pracownika': ['ile osób w pomieszczeniu', 'metry na osobę'],
  'odszkodowanie-za-wypadek-przy-pracy': ['wypadek', 'uszczerbek', 'ZUS', 'wypadek przy pracy', 'szkoda na zdrowiu'],
  'ile-kg-wolno-dzwigac': ['dźwiganie', 'ciężary', 'podnoszenie', 'normy dźwigania', 'kilogramy'],
  'waznosc-uprawnien-udt': ['UDT', 'wózek widłowy', 'uprawnienia na wózek', 'suwnica', 'przedłużenie uprawnień'],
  'badania-udt': ['przegląd wózka', 'UDT', 'konserwacja', 'wózek widłowy'],
  'mobbing-i-dyskryminacja': ['nękanie', 'molestowanie', 'równe traktowanie', 'odszkodowanie za mobbing', 'gorsze traktowanie'],
  'sad-pracy-czy-pip': ['inspekcja pracy', 'skarga na pracodawcę', 'zgłoszenie do PIP', 'anonimowa skarga', 'pozew', 'koszty sądowe', 'pozwać pracodawcę', 'gdzie zgłosić pracodawcę'],
  // Runda 2 (2026-11-13): hasła z podpowiedzi wyszukiwarki Google (pl), nie z głowy; źródła w raporcie pakietu.
  'waznosc-uprawnien-sep': ['uprawnienia elektryczne', 'uprawnienia sepowskie', 'SEP do 1 kV', 'elektryk'],
  'czy-potrzebne-uprawnienia-udt': ['paleciak', 'wózek paletowy', 'zwyżka', 'podest ruchomy', 'podnośnik koszowy'],
  'kod-95': ['kod 95 odnowienie', 'świadectwo kwalifikacji zawodowej', 'kod 95 kiedy potrzebny'],
  'badania-kierowcy': ['psychotesty dla kierowców', 'psychotesty co ile lat', 'badania kierowcy co ile', 'badania kierowcy kat C'],
  'badania-lekarskie-w-pracy': ['medycyna pracy', 'badania okresowe', 'badania wstępne', 'badania kontrolne po L4', 'powrót do pracy po zwolnieniu lekarskim'],
  'posilki-profilaktyczne': ['posiłek regeneracyjny', 'ciepły posiłek', 'darmowy posiłek w pracy', 'zupa regeneracyjna'],
  'odziez-robocza': ['ekwiwalent za pranie', 'buty robocze', 'ciuchy robocze', 'odzież robocza BHP', 'pranie odzieży roboczej'],
  'wypowiedzenie-zmieniajace': ['zmiana warunków pracy i płacy', 'obniżenie wynagrodzenia', 'obniżka pensji', 'zmiana stanowiska bez zgody'],
  'informacja-o-warunkach-zatrudnienia': ['praca bez umowy', 'umowa na piśmie', 'zgłoszenie do ZUS nowego pracownika', 'pierwszy dzień pracy', 'praca na czarno', 'start w nowej pracy', 'zapoznanie z regulaminem', 'kiedy dostanę umowę'],
  'umowa-na-zastepstwo': ['zastępstwo', 'zastępstwo a ciąża', 'zastępstwo za osobę na urlopie macierzyńskim', 'umowa na czas nieobecności'],
  'wynagrodzenie-za-niepelny-miesiac': ['pensja po L4', 'wypłata po L4', 'wypłata za część miesiąca', 'pierwsza wypłata w nowej pracy', 'wypłata za pierwszy dzień pracy'],
  'dodatek-wyrownawczy': ['przeniesienie na inne stanowisko', 'przeniesienie do innej pracy', 'przeniesienie pracownicy w ciąży'],
  'okres-wyczekiwania': ['L4 nowa praca', 'L4 w pierwszym miesiącu', 'chorobowe od kiedy', 'L4 od pierwszego dnia', 'chorobowe po jakim czasie'],
  'zasilek-chorobowy-na-zleceniu': ['L4 na zleceniu', 'chorobowe na zleceniu', 'umowa zlecenie L4', 'dobrowolne chorobowe'],
  'swiadczenie-urlopowe': ['wczasy pod gruszą', 'dofinansowanie do urlopu', 'wczasy pod gruszą ile'],
  'urlop-w-godzinach': ['urlop przy pracy 12-godzinnej', 'urlop system 12-godzinny', 'urlop w godzinach czy dniach', 'urlop w równoważnym systemie'],
  'urlop-w-okresie-wypowiedzenia': ['urlop na wypowiedzeniu', 'przymusowy urlop', 'wypowiedzenie a urlop'],
  'urlop-szkoleniowy': ['urlop na studia', 'urlop na egzamin', 'studia zaoczne'],
  'urlop-bezplatny': ['urlop bez wynagrodzenia', 'urlop bezpłatny a ZUS', 'urlop bezpłatny a składki'],
  'zalegly-urlop': ['urlop z zeszłego roku', 'urlop z poprzedniego roku', 'czy zaległy urlop przepada', 'urlop do 30 września', 'przedawnienie urlopu', 'stary urlop', 'niewykorzystany urlop z zeszłego roku'],
  'praca-cudzoziemca': ['zezwolenie na pracę', 'praca dla Ukraińca', 'obcokrajowiec', 'karta pobytu'],
  'zgloszenie-pracy-cudzoziemca': ['powiadomienie o powierzeniu pracy', 'zgłoszenie Ukraińca do PUP', 'zgłoszenie cudzoziemca do urzędu pracy'],
  'odpracowanie-wyjscia-prywatnego': ['wyjście prywatne', 'wcześniejsze wyjście z pracy', 'odrabianie godzin'],
  'praca-w-sobote': ['ile za sobotę', 'wolne za sobotę', 'nadgodziny za sobotę', 'odbiór dnia wolnego'],
  'nadgodziny-sredniotygodniowe': ['nadgodziny 100', '48 godzin tygodniowo', 'przekroczenie normy'],
  'doba-pracownicza': ['wcześniejsze przyjście do pracy', 'przychodzenie wcześniej', 'zmiana godziny rozpoczęcia', 'nadgodziny w dobie'],
  'rownowazny-czas-pracy': ['praca po 12 godzin', 'zmiany po 12 godzin', 'system 12-godzinny', 'system równoważny', 'system weekendowy'],
  'dorabianie-do-renty': ['ile można dorobić', 'praca na rencie', 'dorabianie na emeryturze', 'zawieszenie renty'],
  'zwrot-podatku-pit-37': ['PIT-37', 'rozliczenie PIT', 'nadpłata podatku', 'rozliczenie z żoną'],
  'ulga-na-dzieci': ['ulga prorodzinna', 'ulga na dziecko', 'zwrot na dziecko'],
  'zerowy-pit': ['PIT dla młodych', 'ulga dla młodych', 'do 26 roku życia', 'ulga na powrót', 'ulga dla pracujących seniorów'],
  'choroba-zawodowa': ['cieśń nadgarstka', 'ubytek słuchu', 'lista chorób zawodowych', 'choroba zawodowa kręgosłupa', 'zwyrodnienie kręgosłupa'],
  'praca-na-wysokosci': ['od ilu metrów', 'badania wysokościowe', 'szelki bezpieczeństwa', 'praca na drabinie'],
  'emerytura-pomostowa': ['pomostówka', 'wcześniejsza emerytura', 'w szczególnym charakterze'],
  'renta-z-tytulu-niezdolnosci-do-pracy': ['renta', 'renta inwalidzka', 'renta po wypadku', 'orzeczenie ZUS'],
  'swiadczenie-przedemerytalne': ['zasiłek przedemerytalny', 'przedemerytalne', 'likwidacja firmy a pracownik przed emeryturą'],
  'czas-jazdy-kierowcy': ['ile może jechać kierowca', 'tachograf', 'pauza kierowcy', 'przerwa kierowcy', 'odpoczynek tygodniowy', 'czas pracy kierowcy', 'odpoczynek dobowy kierowcy'],
  'dyzur-kierowcy': ['dyżur kierowcy', 'podwójna obsada', 'drugi kierowca'],
  'zaswiadczenie-adr': ['ADR', 'kurs ADR', 'uprawnienia ADR', 'przedłużenie ADR', 'towary niebezpieczne'],
  // Pakiet „odpowiedzialność” (2026-11-14): frazy z podpowiedzi wyszukiwarki Google (pl), a „niedobór”, „inwentaryzacja”,
  // „uszkodzenie wózka” i „pozew od pracodawcy” z audytu wyszukiwarki i podobnych narzędzi
  // (bez nich zapytania z hali nie trafiały w to narzędzie, a podobne były przypadkowe).
  // Audyt „jakosc3” (2026-11-15): bez „szkoda” (słowo jest w nazwie) i „kara za zniszczenie” (zabierało zapytania o karę
  // pieniężną narzędziu o karach porządkowych); imiesłowy zamiast czasowników („zniszczony”, nie „zniszczyłem”), bo
  // „zniszczyłem sobie kręgosłup” to choroba zawodowa, a „zepsułem sobie zdrowie” to wypadek przy pracy.
  'odpowiedzialnosc-materialna': ['manko w kasie', 'niedobór', 'inwentaryzacja', 'braki w towarze', 'potrącenie z wypłaty za szkodę', 'zgoda na potrącenie z wynagrodzenia', 'zniszczenie mienia pracodawcy', 'uszkodzenie wózka', 'zniszczony wózek', 'zepsuty sprzęt', 'zgubiony sprzęt firmowy', 'rozbity samochód służbowy', 'koszty naprawy', 'pozew od pracodawcy', 'uszkodzenie samochodu służbowego', 'przedawnienie roszczeń pracodawcy', 'umowa o współodpowiedzialności materialnej'],
  'swiadectwo-pracy': ['brak świadectwa pracy', 'świadectwo pracy ile dni', 'sprostowanie świadectwa', 'błąd w świadectwie pracy', 'pracodawca nie wydał świadectwa', 'świadectwo pracy po zwolnieniu', 'co musi być w świadectwie pracy', 'świadectwo pracy pozew', 'odszkodowanie za świadectwo pracy', 'świadectwo pracy po odejściu z pracy'],
  // Audyt „jakosc3” (2026-11-15): bez „kamera w szatni” i „kamera w toalecie”, bo zabierały zapytania o szatnię i toaletę
  // narzędziu o normach sanitarnych (kamerę w szatni znajduje pytanie z FAQ); dopisane potoczne zapytania z hali.
  'monitoring-w-pracy': ['kamery w pracy', 'nagrywanie pracowników', 'nagrania z kamer', 'GPS w aucie służbowym', 'lokalizator w wózku', 'kontrola maila służbowego', 'RODO w pracy', 'monitoring wizyjny', 'monitoring komputerów', 'kamera nad stanowiskiem', 'śledzenie pracownika', 'pracodawca podgląda', 'monitoring bez uprzedzenia', 'nielegalny monitoring'],
  // Pakiet „hala” (2026-11-14): frazy z podpowiedzi wyszukiwarki Google (pl) do zapytań „szerokość drogi dla wózka”,
  // „odległość między regałami”, „obciążenie regału”, „wysokość składowania”, „pochylnia nachylenie”. Audyt „jakosc3”
  // (2026-11-15): dopisane zapytania z hali o rampę, linie, regał w kilogramach i gaśnicę, które trafiały do innych narzędzi.
  'drogi-i-przejscia': ['droga transportowa', 'ciąg komunikacyjny na hali', 'przejście między regałami', 'odległość między regałami w magazynie', 'szerokość przejścia bhp', 'pochylnia maksymalne nachylenie', 'wózek widłowy', 'piesi i wózki', 'dojście do stanowiska', 'rampa załadunkowa', 'nachylenie rampy', 'żółte linie na posadzce', 'barierki dla pieszych', 'prędkość wózka na hali'],
  'skladowanie-w-magazynie': ['dopuszczalne obciążenie regału', 'tabliczka obciążenie regału', 'obciążenie półki regału', 'wysokość składowania palet', 'składowanie materiałów bhp', 'regał magazynowy', 'palety', 'odległość od lamp', 'odległość towaru od tryskaczy', 'gaśnica w magazynie', 'ile kg na regał', 'ile kg na półkę regału', 'nośność regału', 'odległość do gaśnicy', 'ile metrów do gaśnicy', 'rozmieszczenie gaśnic', 'najniższa półka regału', 'co na dolnej półce regału'],
  // Pakiet „l4” (2026-11-15): frazy z podpowiedzi wyszukiwarki Google (pl) do zapytań „co wolno na l4”, „czy na l4 można”,
  // „kontrola zus l4”, „praca na l4”, „wyjazd na l4”, „l4 chory może chodzić”.
  'co-wolno-na-l4': ['co wolno na L4', 'co można na L4', 'czy na L4 można wychodzić z domu', 'praca na L4', 'praca na L4 u innego pracodawcy', 'praca na L4 nowe przepisy', 'kontrola ZUS L4', 'kontrola ZUS jak wygląda', 'wyjazd na L4', 'chory może chodzić', 'chory powinien leżeć', 'utrata zasiłku chorobowego', 'odwołanie od decyzji ZUS', 'siłownia na L4', 'sport na L4', 'remont na L4', 'spacer na L4', 'maile na L4', 'praca na zwolnieniu lekarskim'],
  // Pakiet „zfss” (2026-11-15): frazy z podpowiedzi wyszukiwarki Google (pl) do zapytań „fundusz socjalny”, „zfśs”,
  // „fundusz socjalny ile”, „czy pracodawca musi mieć fundusz socjalny”, „wczasy pod gruszą”, „bony świąteczne”.
  'fundusz-socjalny': ['ZFŚS', 'socjal', 'socjalne z pracy', 'fundusz socjalny w pracy', 'fundusz socjalny ile na pracownika', 'ZFŚS od ilu pracowników', 'czy każdy pracodawca musi mieć fundusz socjalny', 'odpis na ZFŚS', 'fundusz socjalny dla emerytów', 'bony świąteczne dla pracowników', 'paczki świąteczne', 'zapomoga z funduszu socjalnego', 'regulamin ZFŚS', 'kryterium socjalne', 'dofinansowanie z funduszu socjalnego', 'wczasy pod gruszą zasady', 'wczasy pod gruszą dla kogo'],
};

/**
 * Najczęstsze sprawy z hali na stronie głównej: pytanie w języku ludzi → narzędzie. Wybór redakcji, dopóki nie ma
 * statystyk; potem kolejność według odsłon, a brzmienie pytań zostaje ręczne. Zastąpiła dawne karty wyboru redakcji.
 */
export const NAJCZESTSZE: { pytanie: string; slug: string }[] = [
  { pytanie: 'Ile dostanę za dni na L4?', slug: 'kalkulator-l4' },
  { pytanie: 'Ile zapłacą mi za nadgodziny?', slug: 'kalkulator-nadgodzin' },
  { pytanie: 'Ile wyjdzie na rękę z mojej pensji?', slug: 'brutto-netto' },
  { pytanie: 'Ile mam dodatku za nocki?', slug: 'dodatek-za-prace-w-nocy' },
  { pytanie: 'Ile dni urlopu mam w tym roku?', slug: 'kalkulator-urlopu' },
  { pytanie: 'Czy mój grafik zmian jest zgodny z przepisami?', slug: 'kontrola-grafiku' },
  { pytanie: 'Ile przerwy mam na zmianie 12 godzin?', slug: 'przerwy-w-pracy' },
  { pytanie: 'Ile mam wypowiedzenia?', slug: 'okres-wypowiedzenia' },
  { pytanie: 'Do kiedy ważne są moje uprawnienia na wózek?', slug: 'waznosc-uprawnien-udt' },
  { pytanie: 'Ile kilogramów wolno mi dźwigać?', slug: 'ile-kg-wolno-dzwigac' },
  { pytanie: 'Ile mi się należy za pracę w wolną sobotę?', slug: 'praca-w-sobote' },
  { pytanie: 'Co się należy za pracę w niedzielę albo w święto?', slug: 'praca-w-niedziele' },
];

/** Podpowiedzi pod polem wyszukiwania na stronie głównej: słowa, które ludzie wpisują najczęściej. */
export const CZESTO_SZUKANE = ['L4', 'nadgodziny', 'nocki', 'urlop', 'wypowiedzenie', 'UDT na wózek', 'ile kg'];

/** Słowa z hali pod nazwą kategorii na stronie głównej (klucze z KATEGORIE w src/data/narzedzia.ts). */
export const SLOWA_KATEGORII: Record<string, string> = {
  'czas-pracy': 'grafik, przerwy, wymiar godzin, niedziele',
  wynagrodzenie: 'na rękę, nadgodziny, nocki, L4, delegacje',
  urlopy: 'ile dni, ekwiwalent, wolne na dziecko, święta',
  umowa: 'wypowiedzenie, odprawa, okres próbny, agencja',
  bhp: 'hałas, temperatura, szkolenie, wypadek',
  uprawnienia: 'UDT na wózek, przedłużenie',
  transport: 'ile kg, badania wózka',
};
