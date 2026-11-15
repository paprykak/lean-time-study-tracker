# Sprawa 4: przedawnienie urlopu, art. 115 KC w prawie pracy, odpowiedzialność materialna

Stan na 2026-11-15. Źródło orzeczeń: wyłącznie otwarte API SAOS (`courtType=SUPREME`). Pełne teksty pobrane przez `saos.py tekst`, kopie w `.cache/narzedzia/orzeczenia/<id>.json`. Każdy cytat niżej jest dosłowny z pełnego tekstu (pisownia i podział wyrazów jak w SAOS; łamania wierszy usunięte). Przepisy Kp: tekst jednolity Dz.U. 2026 poz. 1245 (`.cache/narzedzia/prawo/kp-2026-1245.txt`). Rozporządzenie z 1975 r.: skan Dz.U. 1975 nr 35 poz. 191 z API Sejmu.

Uwaga o przebiegu: SAOS przez większość sesji odpowiadał stroną „Przerwa techniczna”. Zapytania szły z ponawianiem. Wszystkie wyniki niżej to odpowiedzi JSON, które przyszły. Zapytania z frazami w cudzysłowie zwracały 0 wyników, więc powtórzyłem je bez cudzysłowów.

Tropy z wyszukiwarki internetowej (V PZP 6/79, II PSKP 61/23, III CZP 21/23, III CZP 46/22, III CZP 7/25, I PK 62/17 i inne) **nie są sprawdzone** i występują tylko w rubryce „do ręcznego sprawdzenia”.

---

## (a) Od kiedy biegnie przedawnienie roszczenia o urlop i o ekwiwalent

### Zapytania do SAOS
- `all=przedawnienie roszczenia o urlop wypoczynkowy wymagalność` (24 wyniki)
- `all=przedawnienie urlop wypoczynkowy art. 168 pierwszego kwartału` (4)
- `all=przedawnienie ekwiwalent urlop rozwiązania stosunku pracy` (44)
- `all=urlop przedawnienie 30 września` (89, bez trafień w sprawie)

### Orzeczenia

| Sygnatura | Data | Rodzaj | id SAOS | Dosłowny fragment | Uwagi |
|---|---|---|---|---|---|
| I PKN 415/99 | 1999-12-16 | wyrok | 79435 | „Bieg trzyletniego terminu przedawnienia pracowniczego roszczenia o urlop wypoczynkowy rozpoczyna się w zasadzie ostatniego dnia roku kalendarzowego, w którym pracownik uzyskał prawo do urlopu. […] Takim przepisem szczególnym względem ogólnej normy art. 161 KP […] jest przepis art. 168 KP. […] Jeżeli więc terminu wykorzystania przesuniętego urlopu nie wyznaczono lub nie przesunięto na termin wykraczający poza pierwszy kwartał następnego roku (np. wskutek choroby pracownika), to z ostatnim dniem tego kwartału pracownik może dochodzić swego roszczenia jako wymagalnego, a więc powodującego również rozpoczęcie biegu terminu z art. 291 § 1 KP.” | **Ratio** (SN uwzględnił kasację powoda w tej części). SN powołuje uchwałę 7 sędziów V PZP 6/79 z 20.02.1980 (spoza SAOS). Zasada: koniec roku. Gdy urlopu nie wykorzystano w tym roku: ostatni dzień terminu z art. 168. |
| I PKN 336/00 | 2001-03-29 | wyrok | 80457 | „Urlop wypoczynkowy za dany rok kalendarzowy powinien być pracownikowi udzielony najpóźniej do końca pierwszego kwartału następnego roku kalendarzowego (art. 168 KP). W pierwszym dniu drugiego kwartału, a więc 1 kwietnia, powstaje roszczenie pracownika o udzielenie urlopu za rok poprzedni. Od tej też daty rozpoczyna bieg trzyletni okres przedawnienia roszczenia o urlop.” | **Ratio.** Termin liczony od dnia po ostatnim dniu na udzielenie urlopu z art. 168. |
| I PKN 336/00 (teza) | 2001-03-29 | wyrok | 80457 | „Z dniem rozwiązania stosunku pracy prawo pracownika do urlopu wypoczynkowego w naturze przekształca się w prawo do ekwiwalentu pieniężnego za niewykorzystany urlop. W tym też dniu rozpoczyna bieg termin przedawnienia roszczenia o ekwiwalent pieniężny za niewykorzystane w naturze, a nieprzedawnione urlopy wypoczynkowe.” | **Ratio** co do ekwiwalentu z art. 171. |
| I PKN 367/00 | 2001-04-11 | wyrok | 80502 | „Przepisy art. 161 i 168 KP nakazują przyjąć, że rozpoczęcie biegu trzyletniego (art. 291 § 1 KP) terminu przedawnienia roszczenia o udzielenie urlopu wypoczynkowego następuje bądź z końcem roku kalendarzowego, za który urlop przysługuje (art. 161 KP), bądź najpóźniej z końcem pierwszego kwartału roku następnego, jeżeli urlop został przesunięty na ten rok z przyczyn leżących po stronie pracownika lub pracodawcy (art. 168 KP).” | **Ratio** (teza). SN zaaprobował, że urlop za 1994 r. przedawnił się 1.04.1998. |
| II PK 49/06 | 2006-11-21 | wyrok | 84746 | „[…] Sąd Najwyższy przyjął, że z dniem rozwiązania stosunku pracy prawo pracownika do urlopu wypoczynkowego w naturze przekształca się w prawo do ekwiwalentu pieniężnego za niewykorzystany urlop. W tym też dniu rozpoczyna bieg termin przedawnienia roszczenia o ekwiwalent […]” | Powtórzenie I PKN 336/00 w uzasadnieniu. Sprawa dotyczyła udzielenia urlopu w okresie wypowiedzenia, więc to **uwaga na marginesie**. |
| I PK 27/15 | 2016-02-03 | wyrok | 244511 | „[…] powód powinien był je zgłosić w dacie ich ewentualnej wymagalności, tj. w dacie rozwiązania stosunku pracy (co do początku biegu przedawnienia roszczenia o ekwiwalent za urlop zob.: 29 marca 2001 r., I PKN 336/00 […])” | Potwierdzenie przez odesłanie; **uwaga na marginesie**. |
| III PK 96/15 | 2016-04-14 | wyrok | 245112 | „Zważywszy, że w świetle art. 171 § 1 k.p. ekwiwalent pieniężny przysługuje za urlop wypoczynkowy niewykorzystany z powodu rozwiązania lub wygaśnięcia stosunku pracy, roszczenie z tego tytułu staje się wymagalne w dniu ustania tego stosunku. […] Dotyczy to zarówno ekwiwalentu za urlop przysługujący w roku rozwiązania stosunku pracy, jak i za nieprzedawnione zaległe urlopy wypoczynkowe przysługująca za poprzednie lata.” | **Ratio**, najnowsze w SAOS. |

Sprawdzone i pominięte: w I PK 169/06 (84794) o dacie wymagalności piszą tylko skarżąca i sądy niższych instancji, SN tego nie rozstrzygał. W I PKN 309/00 (80410) datę wymagalności ekwiwalentu ustalił sąd I instancji, a SN rozpoznawał zarzut z art. 5 KC.

### Wniosek: linia jednolita
Bieg przedawnienia roszczenia o urlop zaczyna się z upływem ostatniego dnia, w którym pracodawca musiał udzielić urlopu. Co do zasady jest to koniec roku kalendarzowego (art. 161). Gdy urlop przechodzi na następny rok, liczy się koniec terminu z art. 168. Wszystkie orzeczenia w SAOS dotyczą dawnego brzmienia: koniec I kwartału, czyli 31 marca. Przy obecnym brzmieniu art. 168 („do dnia 30 września następnego roku kalendarzowego”) ta logika prowadzi do 30 września, ale **SAOS nie ma orzeczenia SN o nowym terminie**. Niewielka różnica w formule: I PKN 336/00 liczy od 1 kwietnia („w pierwszym dniu drugiego kwartału”), a I PKN 415/99 i I PKN 367/00 mówią o „ostatnim dniu”/„końcu” kwartału. Na wynik (3 lata) to nie wpływa. Ekwiwalent z art. 171 przedawnia się od dnia ustania stosunku pracy, także co do zaległych, nieprzedawnionych urlopów (I PKN 336/00, III PK 96/15).

### Do ręcznego sprawdzenia (po 2016 r. i spoza SAOS)
- Uchwała 7 sędziów V PZP 6/79 z 20.02.1980 (cytowana w I PKN 415/99; SAOS jej nie obejmuje).
- Orzeczenia SN o terminie 30 września (trop: II PSKP 61/23 z 20.02.2024).
- Datę wejścia w życie zmiany art. 168 (31 marca na 30 września): w zleceniu podano „przed 2019 r.”, nie weryfikowałem.

---

## (b) Art. 115 KC przy terminach z Kodeksu pracy; sobota

### Zapytania do SAOS
- `all="art. 115 k.c." "art. 264"` i `all="art. 115 k.c." sprzeciw kara porządkowa` (0, frazy w cudzysłowie)
- `all=art. 115 k.c. art. 264 k.p. termin` (4: II PK 38/05, I PK 323/06, I PK 212/08, II PK 118/13; żaden nie dotyczy art. 115 KC)
- `all=art. 115 kodeksu cywilnego odwołanie sądu pracy termin dzień wolny` (22)
- `all=sprzeciw kara porządkowa termin dzień wolny art. 115` (0), `all=sprzeciw od kary porządkowej termin upływał dzień wolny` (0), `all=art. 112 k.p. sprzeciw termin 7 dni` (30, bez trafień)
- `all=termin do wniesienia odwołania od wypowiedzenia upłynął w niedzielę art. 115` (0), `all=termin odwołania art. 264 niedziela następnego dnia` (1, nie na temat)
- `all=art. 300 k.p. art. 115 k.c. termin` (47, bez trafień w sprawie)
- `all=sobota dzień wolny od pracy art. 115 k.c.` (25), `all=wniosek o udzielenie urlopu art. 115 k.c.` (17, bez trafień)

### Orzeczenia

| Sygnatura | Data | Rodzaj | id SAOS | Dosłowny fragment | Uwagi |
|---|---|---|---|---|---|
| III CZP 8/03 | 2003-04-25 | uchwała 7 sędziów (zasada prawna) | 81978 | „Sobota nie jest dniem uznanym ustawowo za wolny od pracy w rozumieniu art. 115 k.c. w związku z art. 165 § 1 k.p.c. i nadał jej moc zasady prawnej.” | **Sentencja.** Izba Cywilna, w składzie sędziowie Izby Pracy (J. Iwulski, współsprawozdawca). Dotyczy terminu procesowego (art. 165 § 1 kpc), nie terminów z Kp. Uzasadnienie przywołuje art. 129 Kp: dni wolne z rozkładu czasu pracy „nie muszą być nimi soboty”. |
| III CZP 8/03 (uzasadnienie) | 2003-04-25 | uchwała | 81978 | „W postanowieniu z dnia 20 maja 2002 r., I PKN 502/01 […] Sąd Najwyższy natomiast wyjaśnił, że sobota nie jest dniem uznanym ustawowo za dzień wolny od pracy w rozumieniu art. 115 k.c. w związku z art. 165 § 1 k.p.c. W uzasadnieniu nawiązał do treści art. 138 § 1 k.p. i stwierdził, że soboty, jako dni wolne od pracy, nie zostały przez ustawodawcę zrównane z niedzielami i świętami […]” | Wcześniejsza linia Izby Pracy (I PKN 502/01 tylko przez cytat; brak osobnej weryfikacji w SAOS). |
| V CZ 27/09 | 2009-07-02 | postanowienie | 90527 | „Sąd Apelacyjny trafnie bowiem w uzasadnieniu wskazał na uchwałę składu siedmiu sędziów z dnia 25 kwietnia 2003 r., III CZP 8/03, w której Sąd Najwyższy wyjaśnił, że sobota nie jest dniem uznanym ustawowo za wolny od pracy w rozumieniu art. 115 k.c. w związku z art. 165 § 1 k.p.c.” | **Ratio**: odmowa przywrócenia terminu, bo profesjonalny pełnomocnik pominął zasadę prawną. |
| III PZ 1/12 | 2012-04-11 | postanowienie | 97815 | „[…] przypadał na sobotę, co wyłączyło możliwość zastosowania implikacji dotyczącej zakończenia terminu w dniu uznanym ustawowo za wolny od pracy. Sobota jest bowiem dniem powszednim.” | **Ratio**, Izba Pracy, termin kasacyjny. SN odrzucił argument z uchwały NSA I OPS 1/11. |
| II PZ 10/15 | 2015-10-15 | postanowienie | 243556 | „[…] wykładnia językowa art. 115 k.c. w związku z art. 165 § 1 k.p.c., zgodnie z którą sobota nie jest dniem uznanym ustawowo za wolny od pracy, nie prowadzi do sprzeczności z wartościami czy normami uwzględnianymi w wykładni funkcjonalnej i systemowej.” | **Ratio**, Izba Pracy, termin kasacyjny upływający w sobotę 27.12.2014. Odrzucony argument z ustawy o prawach konsumenta i rozporządzenia 1182/71. |
| I PZ 72/02 | 2002-08-23 | postanowienie | 81541 | (teza) „Do obliczania miesięcznego terminu do wniesienia kasacji (art. 3934 § 1 k.p.c.) jako terminu ciągłego stosuje się art. 112 k.c. w związku z art. 165 § 1 k.p.c., a nie art. 114 k.c.” | Kwestię sobót SN nazwał tu „bezprzedmiotową”. Pośrednie. |

Sprawdzone i nie na temat: II PK 241/04 (83275), w którym SN uznał zarzut z „art. 129 § 1 k.p. w związku z art. 115 k.c.” za niezrozumiały.

### Wniosek
- **Art. 115 KC przy terminach z Kp (art. 264, art. 112 § 1, art. 97 § 2¹): brak orzeczeń w SAOS.** Zapytania wyżej nie dały żadnego orzeczenia SN, które stosowałoby albo wyłączało art. 115 KC przy tych terminach. Wniosek „stosuje się przez art. 300 Kp” byłby wyłącznie wykładnią, nie orzecznictwem z SAOS.
- **Sobota a art. 115 KC (dawne brzmienie, „dzień uznany ustawowo za wolny od pracy”): linia jednolita w SAOS** (III CZP 8/03, V CZ 27/09, III PZ 1/12, II PZ 10/15). Sobota nie była takim dniem. Wszystkie te sprawy dotyczą terminów procesowych (art. 165 § 1 kpc), nie terminów z Kp. Obecne brzmienie art. 115 KC wymienia sobotę wprost („dzień uznany ustawowo za wolny od pracy lub na sobotę”). Zmiana nastąpiła po II PZ 10/15 (październik 2015), bo SN stosował wtedy jeszcze stare brzmienie. Akt zmieniający i datę trzeba potwierdzić w ISAP: pobranie tekstu KC z API Sejmu w tej sesji się nie udało. Dla obecnego stanu prawnego linia III CZP 8/03 jest więc nieaktualna.

### Do ręcznego sprawdzenia
- Orzeczenia SN po 2016 r. o art. 115 KC przy terminach z art. 264 Kp (trop: tezy LEX/SN o „terminach prawa materialnego w Kp” i art. 300 Kp) oraz przy sprzeciwie z art. 112 Kp.
- Trop: uchwała 7 sędziów z 2024 r. (w wynikach wyszukiwarki jako III CZP 21/23, „art. 115 k.c. nie ma zastosowania do upływu terminu przedawnienia”). Niesprawdzona sygnatura i treść, ważna także dla (e).
- Akt i data nowelizacji art. 115 KC dodającej sobotę.

---

## (c) Rozporządzenie RM z 10.10.1975 (§ 2, magazyn z halą spedycyjną) a limit z art. 119 Kp

Tekst aktu (Dz.U. 1975 nr 35 poz. 191, z API Sejmu; OCR skanu, poprawione oczywiste błędy rozpoznania). § 1: rozporządzenie „ustala warunki odpowiedzialności materialnej pracowników za szkody w mieniu, o którym mowa w art. 124 § 2 Kodeksu pracy […]: 1) na zasadach przewidzianych w art. 114–116 i 118 Kodeksu pracy, 2) w ograniczonej wysokości”. § 2 ust. 1: „Odpowiedzialność materialną za szkody w powierzonym mieniu ponoszą na zasadach przewidzianych w art. 114–116 i 118 Kodeksu pracy pracownicy zatrudnieni: 1) w magazynach jednostek organizacyjnych handlu wewnętrznego, w których wyodrębniono pomieszczenie do wydawania towarów (halę spedycyjną) oraz zorganizowano dozór ruchu mienia i osób […]”. Delegacja dziś: art. 126 § 2 pkt 1 i 2 Kp (osobno „w ograniczonej wysokości” i osobno „na zasadach przewidzianych w art. 114–116 i 118”). Art. 127 Kp odsyła do art. 117, 121, 121¹ i 122, ale nie do art. 119.

### Zapytania do SAOS
- `all=art. 119 k.p. powierzone mienie hala spedycyjna` (0), `all=hala spedycyjna magazyn odpowiedzialność` (0), `all=halę spedycyjną` (0)
- `all=rozporządzenia Rady Ministrów z dnia 10 października 1975 r. w sprawie warunków odpowiedzialności materialnej` (0)
- `all=rozporządzenie 10 października 1975 odpowiedzialności materialnej powierzonym mieniu art. 119` (6, bez sprawy z rozporządzenia)
- `all=powierzonym mieniu na zasadach przewidzianych w art. 114-116 i 118` (30, bez trafień)
- `all=odpowiedzialności materialnej pracowników za szkodę w powierzonym mieniu art. 119 trzymiesięcznego` (8)

### Orzeczenia (tylko pośrednie: nie dotyczą § 2 rozporządzenia)

| Sygnatura | Data | Rodzaj | id SAOS | Dosłowny fragment | Uwagi |
|---|---|---|---|---|---|
| II PK 307/09 | 2010-04-19 | wyrok | 76440 | „Natomiast, jeżeli w okolicznościach konkretnej sprawy można przyjąć, iż przyczyny powstania szkody leżą głównie (lecz niewyłącznie) po stronie osób trzecich, pracownik odpowiada za szkodę w mieniu powierzonym na ogólnych zasadach określonych w przepisach rozdziału I działu V Kodeksu pracy […] implikuje jego odpowiedzialność odszkodowawczą za wyrządzoną pracodawcy szkodę, ograniczoną do trzymiesięcznego wynagrodzenia za pracę, stosownie do przepisów art. 114, art. 115 i art. 119 k.p.” | **Ratio**, ale inny mechanizm: kradzież powierzonego samochodu, przejście z art. 124 na zasady ogólne. Rozporządzenia z 1975 r. nie dotyczy. |
| III PK 15/09 | 2009-06-23 | wyrok | 90485 | „[…] na mocy art. 119 k.p. - mającego zastosowanie tylko szkód (w postaci „rzeczywistej straty” – art. 115 k.p.) wyrządzonych z winy nieumyślnej – poszczególne odszkodowania […] nie mogą przekraczać trzykrotności tego wynagrodzenia […]” | Zasady ogólne (kierowca), nie mienie powierzone. |

### Wniosek: brak orzeczeń w SAOS
SAOS nie ma orzeczenia SN, które rozstrzygałoby, czy pracownik odpowiadający z § 2 rozporządzenia z 1975 r. „na zasadach przewidzianych w art. 114–116 i 118” korzysta z limitu trzykrotności z art. 119. Z samego tekstu wynika rozdział na dwa reżimy: § 1 pkt 1 to zasady art. 114–116 i 118, § 1 pkt 2 to „ograniczona wysokość”. Art. 119 pominięto w pkt 1 i w art. 127 Kp, a tak samo zbudowana jest delegacja w art. 126 § 2 Kp. To jednak **wykładnia tekstu, nie orzecznictwo**. Za limitem (analogią) przemawia tylko pośrednio II PK 307/09: przy odpowiedzialności „na ogólnych zasadach” za mienie powierzone SN stosuje art. 119.

### Do ręcznego sprawdzenia
- Orzecznictwo SN (zwłaszcza z lat 70. i 80., spoza SAOS) i komentarze do § 2 rozporządzenia oraz do art. 126 § 2 pkt 2 Kp.
- Czy rozporządzenie obowiązuje w całości. API Sejmu podaje status „obowiązujący”, ale § 2 dotyczy „jednostek organizacyjnych handlu wewnętrznego”, a stosowanie go do prywatnego pracodawcy wymaga analizy.
- Trop: I PK 62/17 z 15.05.2018 (niesprawdzony).

---

## (d) Szkoda umyślna a art. 121 Kp, a także art. 118 Kp (kilku pracowników)

Uwaga o przepisach: w obecnym Kp art. 121 dotyczy **obniżenia odszkodowania** (ugoda, sąd pracy). Odpowiedzialność **kilku pracowników** reguluje art. 118. Odpowiadam na obie wersje pytania.

### Zapytania do SAOS
- `all=art. 118 k.p. kilku pracowników umyślne wyrządzenie szkody solidarna` (1: III PK 113/13)
- `all=art. 118 k.p. winy umyślnej solidarnie art. 441` (0)
- `all=art. 121 k.p. obniżenie odszkodowania umyślnie` (2), `all=art. 121 k.p. umyślnego wyrządzenia szkody obniżenia odszkodowania` (3), `all=obniżenie odszkodowania art. 121 § 2 art. 122 winy umyślnej` (2). Trafienia: III PK 15/09, II PK 131/13, I PK 53/12, III CSK 115/15. W II PK 131/13 i I PK 53/12 nie ma rozważań o art. 121.

### Orzeczenia

| Sygnatura | Data | Rodzaj | id SAOS | Dosłowny fragment | Uwagi |
|---|---|---|---|---|---|
| III PK 113/13 | 2014-05-22 | wyrok | 165842 | „Niezasadność skargi potwierdza również zarzut naruszenia art. 118 k.p., gdyż także pomija, że przepis ten ma zastosowanie do pracowniczej odpowiedzialności materialnej za szkodę wyrządzoną z winy nieumyślnej. W przypadku winy umyślnej i kilku sprawców nie stosuje się takiego podziału odpowiedzialności za szkodę (część) jak w art. 118 k.p.” | **Ratio** (odpowiedź na zarzut kasacyjny). Dotyczy art. 118 (kilku pracowników). |
| III PK 113/13 | 2014-05-22 | wyrok | 165842 | „Ostatecznie ocenę powyższą dopełnia stwierdzenie, że dobrodziejstwo ograniczenia odszkodowania na podstawie art. 119 k.p. służy tylko przy odpowiedzialności materialnej za szkodę wyrządzoną z winy nieumyślnej, a nie z winy umyślnej.” | Dotyczy art. 119, nie art. 121. |
| III PK 15/09 | 2009-06-23 | wyrok | 90485 | „W skardze nie powołano zarzutu naruszenia art. 121 § 2 w związku z § 1 k.p., które umożliwiają sądowi obniżenie odszkodowania na podstawie wszystkich okoliczności sprawy, a w szczególności stopnia winy pracownika i jego stosunku do obowiązków pracowniczych.” | Szkoda nieumyślna. O art. 121 przy szkodzie umyślnej SN się nie wypowiedział; **uwaga na marginesie**. |

### Wniosek
- **Art. 118 Kp (kilku pracowników): linia jednolita w SAOS, choć to jedno orzeczenie** (III PK 113/13). Podział według przyczynienia i stopnia winy stosuje się tylko do szkody nieumyślnej. Przy winie umyślnej kilku sprawców nie dzieli się szkody w ten sposób. Solidarności SN tu wprost nie przesądził; trop: art. 441 KC przez art. 300 Kp, niesprawdzony.
- **Art. 121 Kp (obniżenie odszkodowania) przy szkodzie umyślnej: brak orzeczeń w SAOS.** Art. 127 Kp odsyła do art. 121 i 122 łącznie przy mieniu powierzonym, a art. 121 § 1 wymienia „stopień winy” jako kryterium, ale SN w SAOS tego nie rozstrzygał.

### Do ręcznego sprawdzenia
- Orzecznictwo SN o art. 121 § 2 przy art. 122 (w zestawieniu standardyprawa.pl jest kategoria „Obniżenie odszkodowania z mocy art. 121 i art. 127 k.p.”, sygnatury nieznane).
- Solidarność kilku sprawców szkody umyślnej (trop: uchwała V PZP 3/75 cytowana w I PK 212/15; obie niesprawdzone).

---

## (e) Art. 118 zd. 2 KC i art. 115 KC a przedawnienie z art. 442¹ KC (art. 291 § 3 Kp) i z art. 291 Kp

### Zapytania do SAOS
- `all=art. 291 § 3 k.p. art. 442 k.c. przedawnienie umyślnie` (7)
- `all=art. 4421 k.c. art. 291 § 3 k.p.` (19)
- `all=art. 442 1 k.c. przedawnienie koniec roku kalendarzowego` (3, nie na temat)
- `all=art. 118 k.c. ostatni dzień roku kalendarzowego przedawnienie` (14, głównie ubezpieczenia społeczne)
- `all=art. 115 k.c. termin przedawnienia sobota` (0), `all="art. 118 zd. 2" OR "art. 118 zdanie drugie" przedawnienie` (przerwane przez przerwę w SAOS; zastąpione zapytaniem bez cudzysłowów wyżej)

### Orzeczenia (o samym odesłaniu z art. 291 § 3 Kp do KC)

| Sygnatura | Data | Rodzaj | id SAOS | Dosłowny fragment | Uwagi |
|---|---|---|---|---|---|
| I PK 195/09 | 2010-03-09 | wyrok | 92006 | „Z kolei według art. 291 § 3 k.p., jeżeli pracownik umyślnie wyrządził szkodę, do przedawnienia roszczenia o naprawienie tej szkody stosuje się przepisy Kodeksu cywilnego. W stanie faktycznym podlegającym ocenie odniesienie do przepisów Kodeksu cywilnego oznaczało zastosowanie art. 442 § 1 k.c. […] (art. 442 k.c. został, co prawda, uchylony z dniem 10 sierpnia 2007 r. […] przedawnienie roszczeń w przypadku wyrządzenia szkody czynem niedozwolonym reguluje w analogiczny sposób art. 4421 k.c.).” | **Ratio** co do odesłania. Art. 118 zd. 2 KC nie był przedmiotem sprawy (przepis jeszcze nie istniał). |
| I BP 11/14 | 2015-10-08 | wyrok | 243460 | „Nie ma zatem podstaw do stwierdzenia naruszenia art. 291 § 3 k.p. w związku z art. 4421 k.c., gdyż nie ustalono umyślnego wyrządzenia szkody. Wyklucza to przedawnienie według prawa cywilnego (art. 4421 k.c.), gdyż prawo pracy ma samodzielną regulację (art. 291 § 2 k.p. w relacji do art. 4421 k.c. oraz art. 300 k.p.) […]” | **Ratio.** Przy szkodzie nieumyślnej Kp ma własną regulację przedawnienia; KC wchodzi tylko przez art. 291 § 3. Argument istotny dla pytania, czy art. 118 zd. 2 KC przenosi się na art. 291 Kp. |
| III PK 113/13 | 2014-05-22 | wyrok | 165842 | „Szkoda wynikła z przestępstwa ma swoje odrębne przedawnienie, które wchodzi na grunt przepisów prawa cywilnego (art. 291 § 3 k.p.).” | Szkoda z przestępstwa, przez art. 442¹ § 2 KC. |
| II PK 267/15 | 2015-10-27 | wyrok | 243706 | (zarzut skargi) „art. 118 k.c. w związku z art. 300 k.p. i art. 291 § 1 k.p. przez przyjęcie, że roszczenie powoda […] uległo przedawnieniu” | Art. 118 KC występuje **tylko w zarzucie** (dawne brzmienie, bez zd. 2). SN się do niego nie odniósł. |

### Wniosek: brak orzeczeń w SAOS
- Art. 118 zd. 2 KC (koniec terminu przedawnienia w ostatnim dniu roku kalendarzowego, gdy termin wynosi co najmniej 2 lata) wprowadziła ustawa z 13.04.2018, w życie 9.07.2018. SAOS kończy się na ok. 2016 r., więc **orzeczeń w SAOS nie ma**: ani dla art. 442¹ KC przez art. 291 § 3 Kp, ani dla art. 291 § 1 i 2 Kp.
- Art. 115 KC a koniec terminu przedawnienia: **brak orzeczeń w SAOS** (zapytanie: 0 wyników).
- Pośrednio z SAOS: art. 291 § 3 Kp odsyła do całych „przepisów Kodeksu cywilnego” o przedawnieniu (I PK 195/09), więc przy szkodzie umyślnej wchodzi art. 442¹ KC razem z ogólnymi przepisami KC. Przy art. 291 § 1–2 Kp działa „samodzielna regulacja” prawa pracy (I BP 11/14), co przemawia przeciw automatycznemu przenoszeniu art. 118 zd. 2 KC przez art. 300 Kp. To wnioskowanie z orzeczeń o innym przepisie, nie rozstrzygnięcie.

### Do ręcznego sprawdzenia (wszystko po 2016 r.)
- Trop III CZP 21/23 (uchwała z 2024 r. o art. 115 KC i przedawnieniu; niesprawdzona).
- Tropy o art. 118 zd. 2 KC: III CZP 46/22, III CZP 7/25 (niesprawdzone; dotyczą obrotu cywilnego, nie art. 291 Kp).
- Orzeczenia Izby Pracy (II PSK/I PSK/III PSKP) o art. 118 zd. 2 KC w związku z art. 291 Kp i art. 300 Kp. W SAOS ich nie ma.

---

## Pliki
- Pełne teksty: `.cache/narzedzia/orzeczenia/{79435,80457,80502,84746,244511,245112,81978,90527,97815,243556,81541,76440,90485,165842,92006,243460,243706}.json`.
- Wyniki zapytań: katalog scratchpad sesji (`szukaj2.txt`, `szukaj3.txt`, `szukaj4.txt`), poza repozytorium.
