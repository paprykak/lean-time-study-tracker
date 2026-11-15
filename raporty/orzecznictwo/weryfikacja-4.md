# Weryfikacja raportu „Sprawa 4” (przedawnienie urlopu, art. 115 KC, odpowiedzialność materialna)

Stan na 2026-11-15. Weryfikator niezależny (adwersarz). Źródła: pełne teksty z otwartego API SAOS (kopie `.cache/narzedzia/orzeczenia/<id>.json`, pobrane przez `saos.py`) oraz API Sejmu (`api.sejm.gov.pl/eli/acts/DU/...`, metadane i `text.html`/`text.pdf`). Nie używałem sn.pl, ISAP ani PIP.

Metoda: każdy cytat z raportu porównałem maszynowo z pełnym tekstem (po usunięciu HTML, łamań i dzielenia wyrazów), a potem sprawdziłem położenie cytatu względem zdania „Sąd Najwyższy zważył, co następuje”, żeby odróżnić rozważania SN od opisu stanowisk sądów niższych instancji i stron.

Uwaga o przebiegu: w czasie weryfikacji API SAOS przez cały czas odpowiadało stroną „Przerwa techniczna” albo nie odpowiadało (timeout). Weryfikacja cytatów oparła się na pełnych tekstach w pamięci podręcznej (to kopie odpowiedzi tego samego API). Wyniki nowych wyszukiwań: patrz sekcja „Nowe wyszukiwania w SAOS” na końcu.

---

## Wynik ogólny

| Pytanie | Ocena | Najważniejsze |
|---|---|---|
| (a) przedawnienie urlopu i ekwiwalentu | **potwierdzone z poprawkami** | II PK 49/06 cytuje stanowisko Sądu Okręgowego, nie SN; „niewielka różnica w formule” to faktyczna rozbieżność co do zasady (koniec roku albo zawsze termin z art. 168); III PK 96/15 powołuje dodatkowo uchwały III PZP 40/72 i V PZP 5/75; data zmiany art. 168 ustalona: 1.01.2012. |
| (b) art. 115 KC w Kp, sobota | **potwierdzone z poprawkami** | Sobotę do art. 115 KC dodała ustawa z 16.12.2016 (Dz.U. 2016 poz. 2255), w życie 1.01.2017, z przepisem przejściowym. Dwa cytaty z III CZP 8/03 pochodzą z części opisowej (postanowienie składu zwykłego), nie z rozważań składu 7 sędziów. W I PZ 72/02 słowo „bezprzedmiotowy” pisze powód, nie SN. |
| (c) rozporządzenie z 1975 r., § 2, a art. 119 | **poprawione (błąd istotny)** | Raport analizował pierwotny tekst z 1975 r. Rozporządzenie zmieniono w 1996 r. (Dz.U. 1996 nr 60 poz. 276; tekst jedn. Dz.U. 1996 nr 143 poz. 662): **§ 1 skreślono**, z § 2 ust. 1 pkt 1 **usunięto „jednostek organizacyjnych handlu wewnętrznego”**. Wniosek (brak orzeczeń w SAOS, brak limitu z art. 119) się utrzymuje, ale na innej podstawie: § 2 i § 7 obecnego tekstu. |
| (d) art. 118 i 121 Kp przy szkodzie umyślnej | **poprawione** | Raport twierdzi, że SN „solidarności wprost nie przesądził”. W tym samym III PK 113/13 SN pisze: „Odpowiedzialność z art. 122 k.p. kilku osób to w istocie odpowiedzialność solidarna”. Co do art. 121: potwierdzone (brak orzeczeń w SAOS). |
| (e) art. 118 zd. 2 KC i art. 115 KC a art. 442¹ KC i art. 291 Kp | **potwierdzone z drobną poprawką** | Jeden cytat z I PK 195/09 niedosłowny (parafraza w cudzysłowie). Akt i data art. 118 zd. 2 KC potwierdzone w API Sejmu: Dz.U. 2018 poz. 1104, w życie 9.07.2018. |

---

## Kontrola cytatów (wszystkie sygnatury z raportu)

Legenda kolumny „Część”: SN = rozważania SN (po „Sąd Najwyższy zważył”); teza = teza/sentencja na początku tekstu; opis = część sprawozdawcza (stanowiska sądów, stron albo składu przedstawiającego zagadnienie).

| Sygnatura | id SAOS | Dosłowny? | Część | Ten sam przepis? | Wniosek wynika? | Uwagi |
|---|---|---|---|---|---|---|
| I PKN 415/99 | 79435 | tak (4 fragmenty) | SN | tak (art. 291 § 1, 161, 168) | tak | Uzasadnienie nie ma nagłówka „zważył”, ale fragment zaczyna się od „Uzasadniona jest też kasacja strony powodowej. Sąd drugiej instancji popełnił bowiem również błąd…”: to głos SN. |
| I PKN 336/00 (urlop) | 80457 | tak | SN (po poz. 6000 „zważył”) | tak | tak | |
| I PKN 336/00 (teza ekwiwalent) | 80457 | tak | teza | tak (art. 171) | tak | |
| I PKN 367/00 | 80502 | tak | SN (teza i rozważania) | tak | tak | SN aprobuje wykładnię Sądu Okręgowego „najkorzystniejszą dla powódki”. |
| II PK 49/06 | 84746 | tak | **opis** (Sąd Okręgowy) | tak | **nie jako głos SN** | **Błąd 1.** Fragment stoi w opisie uzasadnienia Sądu Okręgowego: „Sąd Okręgowy podzielił stanowisko Sądu Najwyższego wyrażone w postanowieniu z 14 maja 1998 r., I PKN 111/98 […]. Podobnie w orzeczeniu z dnia 29 marca 2001 r., I PKN 336/00 […], Sąd Najwyższy przyjął, że…”. W rozważaniach SN (od poz. 19044) nie ma nic o początku biegu przedawnienia ekwiwalentu. Do usunięcia z linii orzeczniczej. |
| I PK 27/15 | 244511 | tak | SN | tak | tak (na marginesie) | |
| III PK 96/15 | 245112 | tak (z błędem „przysługująca” w oryginale) | SN | tak | tak | Pominięty, mocniejszy fragment (niżej). |
| III CZP 8/03 (sentencja) | 81978 | tak | teza/sentencja | art. 115 KC + art. 165 § 1 kpc | tak | |
| III CZP 8/03 (I PKN 502/01) | 81978 | tak | **opis** (postanowienie składu zwykłego przedstawiającego zagadnienie, przed „zważył” na poz. 24551) | tak | częściowo | **Błąd 2 (drobny).** Raport pisze „Uzasadnienie przywołuje art. 129 Kp: dni wolne… nie muszą być nimi soboty”. Ten fragment też jest w części opisowej. Właściwe rozważania składu 7 sędziów mówią to mocniej (cytat niżej). |
| V CZ 27/09 | 90527 | tak | SN | tak | tak | |
| III PZ 1/12 | 97815 | tak | SN | tak | tak | |
| II PZ 10/15 | 243556 | tak | SN | tak | tak | Odrzucenie argumentu z rozporządzenia 1182/71 i ustawy o prawach konsumenta potwierdzone (poz. 9233–9884). |
| I PZ 72/02 (teza) | 81541 | tak | teza | art. 112 KC + 165 kpc | tak | |
| I PZ 72/02 („bezprzedmiotowy”) | 81541 | tak | **opis** (odpowiedź powoda na zażalenie) | – | **atrybucja błędna** | **Błąd 3 (drobny).** „Z tych względów bezprzedmiotowy jest problem (kontrowersyjny) dotyczący traktowania tzw. wolnych sobót…” pisze powód (poz. 5564, przed „zważył” na 6344). SN mówi to samo własnymi słowami: „Nie chodzi przy tym o problem, czy sobota jest dniem ustawowo wolnym od pracy (stronie pozwanej termin do wniesienia kasacji upływał z dniem 15 marca 2002 r., a więc w piątek)”. Wniosek raportu („pośrednie”) się utrzymuje. |
| II PK 241/04 | 83275 | – | SN | – | tak (nie na temat) | Potwierdzone: zarzut z art. 129 § 1 Kp w zw. z art. 115 KC dotyczył wliczania sobót do odszkodowania. |
| I PK 169/06 | 84794 | – | – | – | tak | Potwierdzone: o wymagalności ekwiwalentu piszą tylko sądy niższych instancji i skarżąca; rozważania SN (od poz. 17926) tego nie dotyczą. |
| I PKN 309/00 | 80410 | – | – | – | tak | Potwierdzone: datę wymagalności ustalił sąd I instancji. |
| II PK 307/09 | 76440 | tak (w tekście SAOS wtrącony numer strony „12”) | SN | art. 114, 115, 119, 124 | pośrednio | |
| III PK 15/09 | 90485 | tak (2 cytaty) | SN | art. 119, 121 | tak | |
| III PK 113/13 | 165842 | tak (3 cytaty) | SN | art. 118, 119, 291 § 3 | tak, ale wniosek o solidarności **błędny** | **Błąd 4** (patrz d). |
| I PK 195/09 | 92006 | **nie w całości** | SN | art. 291 § 3, 442 KC | tak | **Błąd 5 (drobny).** Raport: „przedawnienie roszczeń w przypadku wyrządzenia szkody czynem niedozwolonym reguluje w analogiczny sposób art. 4421 k.c.”. Oryginał: „obecnie terminy przedawnienia w przypadku wyrządzenia szkody czynem niedozwolonym reguluje w analogiczny sposób art. 4421 k.c.”. Sens ten sam. |
| I BP 11/14 | 243460 | tak (wtrącony numer strony „5”) | SN | art. 291 § 2–3, 442¹, 300 | pośrednio | |
| II PK 267/15 | 243706 | tak | zarzut skargi | – | tak (raport poprawnie oznacza jako zarzut) | |

---

## (a) Początek biegu przedawnienia: urlop i ekwiwalent

**Ocena: potwierdzone z poprawkami.**

Potwierdzam linię: ekwiwalent z art. 171 § 1 Kp przedawnia się od dnia ustania stosunku pracy (I PKN 336/00, III PK 96/15) i obejmuje także zaległe, nieprzedawnione urlopy.

Poprawki:
1. **II PK 49/06 (84746) usunąć** z listy orzeczeń SN (cytat z części opisowej, stanowisko Sądu Okręgowego).
2. **Rozbieżność co do zasady, nie „niewielka różnica w formule”.** I PKN 415/99 i I PKN 367/00: zasada to koniec roku kalendarzowego (art. 161), a termin z art. 168 tylko wtedy, gdy urlop przesunięto. I PKN 336/00 liczy dla każdego zaległego urlopu od dnia po terminie z art. 168 („Roszczenia powoda o niewykorzystane w naturze kolejne urlopy wypoczynkowe stały się wymagalne: 1 kwietnia 1995 za rok 1994, 1 kwietnia 1996 r. za rok 1995…”, id 80457). Różnica jest o 3 miesiące (dawniej) albo 9 miesięcy (dziś). Dla kalkulatora bezpieczne jest pokazanie obu wariantów albo wariantu korzystniejszego dla pracownika (termin z art. 168), z opisem.
3. **Pominięty fragment III PK 96/15 (245112)**, rozważania SN: „Ustanie stosunku pracy wyznacza zatem datę wymagalności ekwiwalentu za urlop bieżący i zaległy i ta data początkuje bieg terminu przedawnienia całego świadczenia (uchwała składu siedmiu sędziów Sądu Najwyższego z dnia 15 grudnia 1972 r., III PZP 40/72, OSNCP 1973 nr 9, poz. 145 i uchwała pełnego składu Izby Pracy i Ubezpieczeń Społecznych Sądu Najwyższego z dnia 21 listopada 1975 r., V PZP 5/75, OSNCP 1976 nr 6, poz. 120 oraz postanowienie Sądu Najwyższego z dnia 5 grudnia 1996 r., I PKN 34/96, OSNAPiUS 1997 nr 13, poz. 237).” Uchwały III PZP 40/72 i V PZP 5/75 są poza SAOS (tylko przez cytat).
4. **I PKN 415/99:** pełniejszy kontekst powołania V PZP 6/79: „termin przedawnienia roszczenia urlopowego może rozpocząć swój bieg w innym terminie niż koniec roku kalendarzowego, jeżeli taki termin udzielenia urlopu wynika dla pracodawcy ze szczególnych przepisów Kodeksu pracy lub pozakodeksowych aktów normatywnych.”
5. **I PKN 367/00** powołuje też wyrok SN z 8.06.1977, I PRN 37/77 (przedawnienie roszczenia o urlop z art. 291 § 1), spoza SAOS.

**Zmiana art. 168 Kp (API Sejmu):** brzmienie „do dnia 30 września następnego roku kalendarzowego” nadał art. 1 pkt 1 ustawy z dnia 16 września 2011 r. o redukcji niektórych obowiązków obywateli i przedsiębiorców, **Dz.U. 2011 nr 232 poz. 1378** (ogłoszona 28.10.2011), **w życie 1 stycznia 2012 r.** (art. 29; art. 1 nie należy do wyjątków). Przed tą datą: „do końca pierwszego kwartału następnego roku kalendarzowego”. Ustawa nie ma przepisu przejściowego o urlopach. Raport podawał „przed 2019 r.” bez weryfikacji; teraz jest dokładna data. Wszystkie orzeczenia SN w SAOS o tej kwestii dotyczą stanu sprzed 2012 r.

---

## (b) Art. 115 KC przy terminach z Kp; sobota

**Ocena: potwierdzone z poprawkami.**

Potwierdzam: w pobranych tekstach nie ma orzeczenia SN, które stosuje albo wyłącza art. 115 KC przy art. 264, art. 112 § 1 ani art. 97 § 2¹ Kp. Linia „sobota nie jest dniem ustawowo wolnym” (III CZP 8/03, V CZ 27/09, III PZ 1/12, II PZ 10/15) dotyczy dawnego brzmienia i terminów procesowych.

**Zmiana art. 115 KC (API Sejmu, ustalone):** art. 1 pkt 3 ustawy z dnia 16 grudnia 2016 r. o zmianie niektórych ustaw w celu poprawy otoczenia prawnego przedsiębiorców, **Dz.U. 2016 poz. 2255** (ogłoszona 30.12.2016), **w życie 1 stycznia 2017 r.** (art. 35; art. 1 nie należy do wyjątków). Nowe brzmienie: „Jeżeli koniec terminu do wykonania czynności przypada na dzień uznany ustawowo za wolny od pracy lub na sobotę, termin upływa następnego dnia, który nie jest dniem wolnym od pracy ani sobotą.” Przepis przejściowy, art. 21: „Przepis art. 115 ustawy zmienianej w art. 1, w brzmieniu nadanym niniejszą ustawą, stosuje się do terminów, które nie upłynęły przed dniem wejścia w życie niniejszej ustawy.” Raport słusznie wskazał, że zmiana nastąpiła po II PZ 10/15. Teraz jest akt i data. Ta sama ustawa (art. 2) zmieniała Kodeks pracy, a jej art. 22 zawiera przepis przejściowy o terminie z art. 97 § 1¹ Kp (świadectwo pracy).

Poprawki:
1. Raport cytuje III CZP 8/03 dwa razy z części opisowej. Właściwe rozważania składu 7 sędziów (81978, po poz. 24551), dosłownie: „Poglądy te należy podzielić i stwierdzić, że art. 129 § 1 k.p. nie jest przepisem ustawowym uznającym sobotę za dzień wolny od pracy. Dodać trzeba, że nawet jeżeli dla konkretnej osoby sobota (jako koniec terminu) byłaby ustalona jako drugi dzień w tygodniu wolny od pracy, to nie byłoby to „uznanie ustawowe”.” Ten fragment jest ważny dla Kp: dzień wolny z harmonogramu pracownika (np. środa w systemie zmianowym) nie przesuwał terminu z art. 115 KC. Po 2017 r. sobota przesuwa termin zawsze, a inny „wolny” dzień z grafiku nadal nie.
2. I PZ 72/02: słowo „bezprzedmiotowy” pochodzi od powoda (patrz tabela).
3. Pominięte w raporcie, w pamięci podręcznej: V CZ 5/09 (id 89665, 2009-02-11, rozważania SN): „pozwany zarzucał naruszenie art. 115 k.c. przez przyjęcie, że sobota nie jest dniem wolnym od pracy”; SN zarzut odrzucił w ślad za III CZP 8/03. Ta sama linia (termin procesowy), wniosku nie zmienia.

Sama stosowalność art. 115 KC do terminów z art. 264 i 112 Kp (przez art. 300 Kp) pozostaje **wykładnią bez orzeczenia w SAOS**, tak jak pisze raport.

---

## (c) § 2 rozporządzenia RM z 10.10.1975 a limit z art. 119 Kp

**Ocena: poprawione (błąd istotny w podstawie, wniosek się utrzymuje).**

**Błąd 6 (istotny).** Raport opiera się na skanie pierwotnym (Dz.U. 1975 nr 35 poz. 191) i z niego wyprowadza argument z § 1 pkt 1 i 2. API Sejmu (metadane DU/1975/191: status „akt posiada tekst jednolity”, w mocy; „Akty zmieniające”: DU/1996/276) pokazuje, że rozporządzenie zmieniono **rozporządzeniem RM z 28 maja 1996 r. (Dz.U. 1996 nr 60 poz. 276), w życie 2 czerwca 1996 r.**, a tekst jednolity ogłoszono w **Dz.U. 1996 nr 143 poz. 662**. Zmiany ważne dla raportu (z tekstu Dz.U. 1996 nr 60 poz. 276, OCR):
- „1) skreśla się § 1;”, czyli **argument z § 1 pkt 1 i 2 („dwa reżimy”) opiera się na uchylonym przepisie**;
- „2) w § 2: a) w ust. 1: – w pkt 1 skreśla się wyrazy „jednostek organizacyjnych handlu wewnętrznego””, czyli **wątpliwość raportu, czy § 2 obejmuje prywatnego pracodawcę, jest nieaktualna**: dziś § 2 ust. 1 pkt 1 dotyczy każdego magazynu, który spełnia warunki;
- nowy § 2 ust. 2 dodaje warunek formalny: objęcie odpowiedzialnością „następuje po uprzednim zawiadomieniu go na piśmie o zaistnieniu warunków uzasadniających taką odpowiedzialność i po przeprowadzeniu inwentaryzacji, nie później niż w ciągu jednego miesiąca od zaistnienia tych warunków”.

Obecny § 2 ust. 1 pkt 1 (tekst jedn., OCR): odpowiedzialność „na zasadach przewidzianych w art. 114–116 i 118 Kodeksu pracy” ponoszą pracownicy zatrudnieni „w magazynach, w których wyodrębniono pomieszczenie do wydawania towarów (halę spedycyjną) oraz zorganizowano dozór ruchu mienia i osób; warunek wyodrębnienia pomieszczenia wydawania towarów nie jest wymagany w magazynach, w których przeładunek odbywa się systemem automatycznym z urządzeniami pomiarowo-kontrolnymi”. § 3: pracodawca może te zasady zastosować także do innych magazynów (bez hali spedycyjnej), po opinii związku. § 7: „W wyjątkowych wypadkach, gdy jest to uzasadnione ze względu na zasady współżycia społecznego, wysokość odszkodowania za szkody w powierzonym mieniu może być także obniżona pracownikom ponoszącym odpowiedzialność materialną na zasadach przewidzianych w art. 114–116 i 118 Kodeksu pracy.” § 6 (dla odpowiedzialności z art. 124 § 2 i art. 125 Kp): odszkodowanie „obniża się stosownie”, gdy nadzór jest utrudniony, m.in. „2) w magazynach, sklepach i punktach usługowych, w których praca trwa dłużej niż na jedną zmianę lub w których obsada wynosi co najmniej 5 osób”.

Wniosek po poprawce: w tekście obecnym odesłanie obejmuje art. 114–116 i 118, a nie art. 119. Złagodzenie przewiduje tylko § 7 (wyjątkowe obniżenie ze względu na zasady współżycia społecznego), a nie limit trzech pensji. To nadal **wykładnia tekstu, nie orzecznictwo**. Orzeczenia SN o § 2 w pobranych tekstach nie ma; lokalnie w pamięci podręcznej słowo „spedycyjn” występuje tylko w I PKN 521/00 (80704), w innym znaczeniu (usługi spedycyjne). Dla magazynu z halą wydawczą ważny jest też § 6 ust. 1 pkt 2 (praca na więcej niż jedną zmianę albo obsada co najmniej 5 osób): przy odpowiedzialności z art. 124 § 2 Kp obniżenie jest wtedy obowiązkowe.

Uwaga: raport poprawnie oddał brzmienie art. 126 § 2 i art. 127 Kp (sprawdziłem w Dz.U. 2026 poz. 1245; art. 126 § 2 obejmuje dziś mienie z art. 124 § 2 i z art. 125).

---

## (d) Art. 118 i 121 Kp przy szkodzie umyślnej

**Ocena: poprawione.**

Potwierdzam cytaty z III PK 113/13 o art. 118 i 119 (szkoda nieumyślna). **Błąd 4:** raport pisze „Solidarności SN tu wprost nie przesądził; trop: art. 441 KC przez art. 300 Kp, niesprawdzony”. W tym samym wyroku, w rozważaniach SN (165842, poz. ok. 30265, po „zważył” na 14824), dosłownie: „Odpowiedzialność z art. 122 k.p. kilku osób to w istocie odpowiedzialność solidarna, jednak nie jest to współuczestnictwo procesowe konieczne.” Dalej SN wskazuje, że argument z przyczynienia się innych członków zarządu wymagałby zarzutu z „art. 362 k.c. w związku z art. 300 k.p. i art. 122 k.p.”. Wypowiedź jest krótka i SN sam pisze, że „wykracza to ponad potrzebę argumentacji”, więc to obiter dictum, ale wprost.

Art. 121 Kp przy szkodzie umyślnej: potwierdzam brak orzeczenia w pobranych tekstach. III PK 15/09 dotyczy szkody nieumyślnej.

---

## (e) Art. 118 zd. 2 KC i art. 115 KC a art. 442¹ KC (art. 291 § 3 Kp) i art. 291 Kp

**Ocena: potwierdzone z drobną poprawką.**

API Sejmu: art. 118 KC w brzmieniu z zd. 2 („Jednakże koniec terminu przedawnienia przypada na ostatni dzień roku kalendarzowego, chyba że termin przedawnienia jest krótszy niż dwa lata.”) nadał art. 1 pkt 3 ustawy z dnia 13 kwietnia 2018 r. o zmianie ustawy – Kodeks cywilny oraz niektórych innych ustaw, **Dz.U. 2018 poz. 1104** (ogłoszona 8.06.2018), **w życie 9 lipca 2018 r.** (art. 8: 30 dni od ogłoszenia). Przepis przejściowy art. 5 ust. 1: do roszczeń nieprzedawnionych w dniu wejścia w życie stosuje się nowe przepisy. Daty z raportu są potwierdzone.

Cytaty z I PK 195/09, I BP 11/14, III PK 113/13 i II PK 267/15 są dosłowne, z wyjątkiem jednej parafrazy (błąd 5). Wnioski raportu („brak orzeczeń w SAOS”, wnioskowanie pośrednie z I BP 11/14) są ostrożne i poprawne. Wśród orzeczeń SN, które SAOS zwrócił badaczowi (najnowsze z 2016 r.), nie ma i nie może być orzeczeń o art. 118 zd. 2 KC (od 2018 r.) ani o nowym art. 115 KC (od 2017 r.). Czy SAOS ma nowsze orzeczenia SN, nie dało się sprawdzić (przerwa techniczna).

---

## Lista błędów raportu

1. II PK 49/06 (84746): cytat ze stanowiska Sądu Okręgowego, przypisany SN.
2. III CZP 8/03 (81978): dwa cytaty z części opisowej (postanowienie przedstawiające zagadnienie), a nie z rozważań składu 7 sędziów; pominięty właściwy fragment o art. 129 § 1 Kp.
3. I PZ 72/02 (81541): „bezprzedmiotowy” to słowa powoda, nie SN.
4. III PK 113/13 (165842): wbrew raportowi SN wprost nazwał odpowiedzialność kilku sprawców z art. 122 Kp „w istocie odpowiedzialnością solidarną” (obiter).
5. I PK 195/09 (92006): jeden fragment w cudzysłowie nie jest dosłowny („przedawnienie roszczeń” zamiast „obecnie terminy przedawnienia”).
6. Rozporządzenie z 1975 r.: analiza pierwotnego tekstu; pominięta nowelizacja z 1996 r. (skreślony § 1, usunięte „jednostek organizacyjnych handlu wewnętrznego”, nowy § 2 ust. 2), tekst jednolity Dz.U. 1996 nr 143 poz. 662.
7. (a): rozbieżność „koniec roku albo termin z art. 168” opisana jako różnica w formule bez wpływu na wynik; w rzeczywistości zmienia datę przedawnienia o 3 (dawniej) albo 9 (dziś) miesięcy.
8. Brak aktów i dat: art. 168 Kp (Dz.U. 2011 nr 232 poz. 1378, od 1.01.2012) i art. 115 KC (Dz.U. 2016 poz. 2255, od 1.01.2017); teraz ustalone.

## Nowe orzeczenia i źródła

- III PK 96/15 (245112): dodatkowy fragment z powołaniem III PZP 40/72 (7 sędziów, 15.12.1972), V PZP 5/75 (pełny skład Izby, 21.11.1975), I PKN 34/96 (spoza SAOS, tylko przez cytat).
- I PKN 367/00 (80502): powołany I PRN 37/77 (8.06.1977), spoza SAOS.
- III PK 113/13 (165842): fragment o solidarności przy art. 122 Kp.
- III CZP 8/03 (81978): fragment z rozważań o art. 129 § 1 Kp i „uznaniu ustawowym”.
- V CZ 5/09 (89665): ta sama linia co do soboty (termin procesowy).
- Akty: Dz.U. 2011 nr 232 poz. 1378; Dz.U. 2016 poz. 2255 (art. 1 pkt 3, art. 21); Dz.U. 2018 poz. 1104 (art. 1 pkt 3, art. 5); Dz.U. 1996 nr 60 poz. 276; Dz.U. 1996 nr 143 poz. 662.

## Nowe wyszukiwania w SAOS

WYNIKI_WYSZUKIWAN
