# Teczka: OEE 85% to nie norma (tytuł roboczy)

Plik `redakcja/<slug>/teczka.md`. Notatki redakcji do jednego artykułu: nie trafiają na stronę, zostają w repozytorium jako ślad pracy (poprawki, aktualizacje, pytania czytelników o źródła).

## 0. Wybór tematu (tryb B, wybór redakcji na prośbę Patryka „napisz artykuł”, 2026-11-06)
1. **OEE 85% to nie norma** (Produkcja, temat oee, Analiza): skąd liczba, co mierzą badania, jak definicja zmienia wynik. Popyt: „oee co to”, „oee wskaźnik”, „oee jak liczyć”, „oee wzór”, „oee 85 world class”. **Rekomendacja i wybór.**
2. SMED: krótsze przezbrojenie nie zawsze daje więcej sztuk (Produkcja, smed, Poradnik). Popyt: „smed co to”, „przezbrojenie maszyny”.
3. Instruktaż stanowiskowy BHP a instruktaż pracy (Ludzie i szkolenia, Poradnik). Popyt: „instruktaż stanowiskowy wzór”, „ile trwa”, „kto przeprowadza”; wymaga przepisów BHP.
Powód wyboru 1: teza sporna i sprawdzalna w źródłach, największa wartość praktyczna (karta definicji), popyt potwierdzony, temat bez związku z pracodawcami Patryka.

## 1. Brief
- Czytelnik i jego pytanie: kierownik produkcji, inżynier procesu albo dyrektor zakładu z 50–250 osobami, który liczy (albo ma zacząć liczyć) OEE i pyta: „czy nasze 60% to źle? ile powinniśmy mieć?”.
- Teza (jedno zdanie, sporna, po researchu): 85% to w literaturze TPM cel, do którego zakład może dojść dzięki usprawnieniom, a nie zmierzona średnia; wynik OEE zależy od definicji (czas planowany, cykl idealny) tak bardzo, że porównywanie z 85% albo z innym zakładem bez wspólnej definicji wprowadza w błąd, a sensowne porównanie to ta sama maszyna w czasie przy stałej definicji.
- Co nowego względem wyników wyszukiwania (PL i EN): polskie strony (Symestic, TeepTrak, Wikipedia PL, ITwiz, wskaznikibranzowe.pl) powtarzają 85/60/40 za dostawcą bez danych (zrodla-agent-kontekst.md); tylko Fabrico cytuje badania. Nikt po polsku nie pokazuje: (1) że ta sama zmiana ma 56–91% zależnie od dwóch decyzji, (2) co mierzą badania z próbą i jakie mają słabości (wartości domyślne 100% u Hedmana), (3) karty definicji jako narzędzia, (4) rachunku strat w minutach z wnioskiem, że największa strata (tempo) bywa niemierzona.
- Format / dział / tematy / docelowa długość: Analiza / produkcja / oee / 1 800–2 400 słów.
- Popyt (podpowiedzi wyszukiwarki, 2026-11-06): „oee co to”, „oee wskaźnik”, „oee jak liczyć”, „oee wzór”, „oee 85 world class”.
- Autor (domyślnie `redakcja`) i konflikt interesów: redakcja; redaktor naczelny prowadzi doradztwo w operacjach (także OEE) — tekst nie odsyła do jego usług, konflikt opisany w `metoda`.

## 2. Pięć pytań redaktora
1. Teza: jak w briefie (sekcja 1).
2. Nowość: 85% to cel z literatury TPM zestawiony przez jej autorów ze zmierzoną średnią 40–60%; ta sama zmiana ma 56, 68 albo 91% zależnie od dwóch decyzji; największa strata (tempo) bywa niemierzona (702 z 884 maszyn z wydajnością 100%).
3. Dlaczego teraz i co w tym tygodniu: zakłady wdrażają systemy OEE i raportują wynik zarządom; w tym tygodniu czytelnik wypełnia kartę definicji dla jednej maszyny i przelicza ostatni miesiąc w dwóch wariantach.
4. Autorytet: źródło pierwotne TPM (JIPM 1989), badania recenzowane z próbą (Hedman 884 maszyny, Ylipää 98 firm), studium przypadku (Andersson i Bellgran), analiza normy (Schiraldi i Varisco), polskie studium (AGH), rachunek własny na danych fikcyjnych.
5. Za: JIPM 40–60% vs cel 85–95%, Vorne FAQ („completely artificial”), Hedman, Ylipää/Bokrantz, Ljungberg, Bokrantz (różne liczenie przezbrojeń), Andersson (interpretacje, 86→79%), de Ron i Rooda (popyt), Schiraldi (ISO). Przeciw / granice: Jonsson (Nakajima uważał 85% za dobry punkt odniesienia), Vorne leanproduction (85% jako cel długoterminowy dla wielu firm), Andersson (linia 86%, porównania możliwe przy standaryzacji), zakłady nagradzane powyżej 85%.

## 3. Plan tekstu (pisanie.md, część 1)
- Obietnica: po lekturze kierownik wie, skąd się wzięło 85% i dlaczego to nie norma, spisze kartę definicji OEE dla swojej maszyny i przestanie porównywać wynik z liczbą z internetu albo z innym zakładem liczącym inaczej.
- Trzy rzeczy do zabrania: **wgląd** — 85% to cel z książki o TPM, a wynik OEE zależy od definicji (czas planowany, cykl idealny) tak samo jak od maszyny; **narzędzie** — karta definicji OEE (decyzje do spisania przed pierwszym pomiarem) i rachunek strat w minutach; **kryterium decyzji** — porównuj tę samą maszynę w czasie przy stałej definicji, a między zakładami tylko przy identycznej definicji.
- Zdanie do zapamiętania: „OEE mówi, ile tracisz, a nie jak wypadasz na tle świata.”
- Czego czytelnik nie wie: kto i kiedy podał 85% i jako co; że składowe 90/95/99 to cele; że cykl idealny i czas planowany to decyzje, nie fakty; że istnieje norma ISO 22400-2 z definicją; co mówią badania o zmierzonym OEE.
- Otwarcie (paradoks, ilustracja na danych fikcyjnych): trzy osoby liczą OEE tej samej zmiany i dostają 56%, 68% i 91% — każda poprawnie (dane z `dane/wynik.json`).
- Sztafeta pytań: skąd 85%? → ile mają zakłady naprawdę? → dlaczego wyniki tak się różnią (definicje)? → czy OEE w ogóle ma sens? (tak: trend i straty w minutach) → co zrobić w poniedziałek (karta definicji) → kiedy porównanie z innymi ma sens (granice).
- Zakończenie: klamra z trzema arkuszami: wybierz jedną definicję, zapisz ją i licz tak samo co tydzień; pierwszy krok: karta definicji dla jednej maszyny.
- Test przekazania: „Zanim powiesz zarządowi, że mamy 60% i do światowej klasy brakuje 25 punktów, przeczytaj to.”

## 4. Źródła
Kolejność jak w artykule (przypis [n]). Adres w artykule to DOI albo strona; dla płatnych DOI podaję otwartą wersję, z której czytano.
| Nr | Klucz | Opis | Rodzaj | Siła | Otwarta wersja przeczytana | Co wspiera | Ograniczenia |
|---|---|---|---|---|---|---|---|
| 1 | vorne-wc | Vorne, World-Class OEE | Raport firmy | D | https://www.oee.com/world-class-oee/ | „światowa klasa”; pochodzenie 85% (Nakajima 1984/1988, minimum, nagrodzone zakłady >85%); zastrzeżenia (dyskretna, Japonia, lata 70., motoryzacja); „closer to 60%”; 3 × 90% = 73% | dostawca; 60% bez danych i metody |
| 2 | jipm | Shirose (1989), rozdz. 2 w: Nakajima (red.), TPM Development Program (wyd. jap. JIPM 1982) | Książka | C | archive.org, wyszukiwarka w treści (skan 66 = s. 38; s. 12 i 28 o sześciu stratach) | 40–60% zmierzone, 85–95% osiągalne dzięki TPM; przezbrojenie i regulacja jako jedna z sześciu strat | próba nieopisana |
| 3 | andersson | Andersson, Bellgran (2011), referat SPS 2011 | Inne (referat konferencyjny; status recenzji niepotwierdzony) | C | https://lup.lub.lu.se/search/files/6184392/2224805.pdf | interpretacje czasu planowanego i cyklu idealnego; 86→79%, 118→130 szt./h; porównania przy standaryzacji | jedna firma |
| 4 | agh | Murdzek, Richert, Hubicki (2021), rozdz. monografii AGH | Książka | C | https://winntbg.bg.agh.edu.pl/skrypty4/0587/nowoczesne_metody_119.pdf | „Światowym standardem jest wskaźnik OEE na poziomie 85%” (s. 121, za Furmanem 2014); 46–83%, średnio 68%; jeden cykl 2000 szt./h zaniża wydajność; wynik zależy od wyrobów | jedna maszyna, tydzień |
| 5 | jonsson | Jonsson, Lesshammar (1999), IJOPM 19(1) | Badanie recenzowane | C | https://publications.lib.chalmers.se/records/fulltext/26422/local_26422.pdf | s. 62–63: Nakajima za Raoufem, „world-class firms”, „good benchmark for a typical manufacturing capability”; trudność porównań; 0,30–0,80 za Ericssonem | cytat z drugiej ręki |
| 6 | vorne-faq | Vorne, OEE FAQ | Raport firmy | D | https://www.oee.com/faq/ | „completely artificial benchmark”; błąd: poprawianie najsłabszej linii, która nie jest ograniczeniem; OEE linii mierzyć na ograniczeniu | dostawca |
| 7 | hedman | Hedman i in. (2016), Procedia CIRP 57 | Badanie recenzowane | C | https://publications.lib.chalmers.se/records/fulltext/246913/local_246913.pdf | 884 maszyny, 23 firmy, 65%/70%, branże 59–74%; 702/884 i 796/884 = 100% (domyślne); brak rejestru prędkości; „measuring OEE or just availability” | klienci jednego dostawcy |
| 8 | ylipaa | Ylipää i in. (2017), IJPPM 66(1) | Badanie recenzowane | C | streszczenie (Crossref, OpenAlex) | 98 szwedzkich firm 2006–2012 | tylko streszczenie |
| 9 | bokrantz | Bokrantz i in. (2016), JMTM 27(8) | Badanie recenzowane | C | https://publications.lib.chalmers.se/records/fulltext/245676/local_245676.pdf | 51,5% za Ylipää; ankiety 80/2001, 71/2014; <50% i <25%; „virtually all OEE definitions”; „Measuring these as losses creates an incentive for improvements” (s. 1066) | deklaracje respondentów |
| 10 | ljungberg | Ljungberg (1998), IJOPM 18(5) | Badanie recenzowane | C | streszczenie (Crossref) | ok. 20 przypadków, ok. 55%; dominują straty wydajności; uwaga skupiona na awariach | tylko streszczenie |
| 11 | jagusiak | Jagusiak-Kocik, Knop, Sikora (2016), Zeszyty Naukowe QPI 1(4) | Badanie recenzowane (czasopismo z recenzją, studium przypadku) | C | https://www.qpi-journal.pl/files/No.-1-4----06.-K.-Knop,-M.-Jagusiak-Kocik-M.,--.-Sikora.pdf | mieszadło do emalii, 31 dni, pomiar stoperem, OEE 78,9% (s. 68 i 71) | jedna maszyna |
| 12 | schiraldi | Schiraldi, Varisco (2020), C&IE 145 | Badanie recenzowane | C | streszczenie (repozytorium IRIS Tor Vergata) | dwie wersje OEE w ISO 22400 „seem to diverge” | tylko streszczenie |
| 13 | iso | ISO 22400-2:2014, karta w katalogu | Przepis lub norma | A (status) | https://committee.iso.org/standard/54497.html | „to be revised [90.92]” | treści normy nie czytano |
| 14 | evocon | Evocon (2024, akt. 2026), World-Class OEE: Industry Benchmarks | Raport firmy | D | strona (curl, 2026-11-06) | ok. 6% organizacji ≥85% (średnie roczne), 3500+ maszyn, 50+ krajów, 2023–2024; wyniki >100% odrzucone jako błędne rachunki | dane klientów jednego dostawcy, bez definicji; okres podany niespójnie |
| 15 | vorne-lp | Vorne, leanproduction.com/oee | Raport firmy | D | https://www.leanproduction.com/oee/ | „For many companies, it is a suitable long-term goal.” | dostawca |
| 16 | deron | de Ron, Rooda (2006), IJPR 44(23) | Badanie recenzowane | C | https://hal.science/hal-00512884/document | 168 h, OEE 0,474 vs 0,592 przy tych samych RE i QE (przestoje 12→15 h); „not a performance measure to compare stand alone machines” | przykład liczbowy, rękopis |
| 17 | muchiri | Muchiri, Pintelon (2008), IJPR 46(13) | Przegląd lub metaanaliza | C | https://hal.science/hal-00512968/document | „For manual data collection, accuracy is very low since recording of some minor stoppages or downtime can often be forgotten.” | przegląd narracyjny, rękopis |
Nieużyte, przeczytane: Muchiri i Pintelon (2008), Ingemansson (2004), Evocon (D), TeepTrak, Symestic, Wikipedia PL/EN (szczegóły w zrodla-agent-badania.md i zrodla-agent-kontekst.md). Książka Nakajimy *Introduction to TPM* (1988): legalnej wersji online brak; jedyna kopia na archive.org to wrzutka użytkownika w kolekcji „opensource” (prawdopodobnie bez praw), nie korzystano.

## 5. Rejestr twierdzeń
| Twierdzenie w tekście (skrót) | Przypis | Miejsce w źródle | Werdykt weryfikacji |
|---|---|---|---|
| 85% nazywane „światową klasą” | [1] | grafika: „85% OEE is often referred to as World-Class and is based on having 90% Availability, 95% Performance, and 99% Quality” | |
| w literaturze TPM 85% to cel osiągalny dzięki usprawnieniom; JIPM mierzył 40–60%, TPM podnosi do 85–95% | [2] | s. 38: „Equipment effectiveness averaged from 40 to 60 percent at the companies investigated by JIPM (Table 2-3). This standard can be raised to as much as 85 to 95 percent, however, through various TPM improvement activities.” | |
| książka pod red. Nakajimy, wyd. ang. 1989, rozdział Kunio Shirose | [2] | strona tytułowa i spis treści (archive.org) | |
| wynik zależy od czasu planowanego i cyklu idealnego; wzór jeden, interpretacje różne; porównanie wymaga standaryzacji | [3] | s. 9 pliku, rozdz. 7: „the interpretation varies of what is calculated as planned/unplanned time, and what the ideal cycle time is set to. In order to compare between sites, the calculations must be made in a standardized way.” | |
| Nakajima (za Raoufem): A>90, P>95, Q>99, ≈85%, „dobry punkt odniesienia” | [4] | s. 63: „Nakajima (Raouf, 1994) asserted that under ideal conditions… OEE > 0.84… good benchmark for a typical manufacturing capability” | |
| Vorne: książka z 1984 r., na podstawie doświadczenia, minimum; wszystkie nagrodzone zakłady >85%; dyskretna, Japonia, lata 70., motoryzacja | [1] | akapit o Nakajimie i akapit z zastrzeżeniami (cytaty w zrodla-agent-kontekst.md, sekcja 3) | |
| „wygodny, przekonujący i zupełnie sztuczny punkt odniesienia” | [5] | „It is a convenient, compelling and completely artificial benchmark.” | |
| 884 maszyny, 23 firmy, X 2013–III 2014, średnia 65%, mediana 70%, klienci jednego dostawcy | [6] | s. 129–130, podziękowanie s. 132 | |
| 98 szwedzkich firm, 2006–2012 | [7] | streszczenie | |
| średnia 51,5% | [8] | s. 1054: „Ylipää et al. (forthcoming) present an average number of 51.5 per cent” | |
| ok. 20 przypadków, ok. 55% | [9] | streszczenie: „According to about 20 cases, the overall equipment effectiveness was only around 55 per cent.” | |
| 702/884 wydajność, 796/884 jakość = 100%, wartości domyślne; wyłączone weekendy, planowana konserwacja, przerwy, spotkania | [6] | s. 129 (rozdz. 3), s. 130–131 | |
| AGH: dzienne OEE jednej maszyny w tygodniu 46–83%, średnio 68% | [10] | „OEE w badanym okresie oscylował w zakresie wartości 46–83%”; „Średnia wartość OEE w badanym tygodniu roboczym wynosi 68%” | |
| Vorne: większość firm bliżej 60%, z doświadczenia, bez danych | [1] | „most manufacturing companies, even today, have OEE scores closer to 60%. We work with thousands of manufacturing companies…” | |
| TPM: przezbrojenie i regulacja jedną z sześciu dużych strat | [2] | rozdz. 2, „Six Big Losses”, „Setup and Adjustment Losses” | |
| ankiety 80 (2001) i 71 (2014) firm; wymiana narzędzi i przezbrojenie <50%, przerwy <25%; obecne w niemal wszystkich definicjach OEE | [8] | s. 1063 i 1066 | |
| AGH: zakład nie określa cyklu dla każdego wyrobu; autorzy przyjęli jeden średni (2000 szt./h); to znacząco zaniża wydajność; wynik zależy od wyrobów | [4] | s. 122: „przyjęciem stałego, średniego normatywnego czasu cyklu według wydajności akordowej równej 2000 szt./h”; s. 125: „nie określa normatywnego czasu cyklu dla wszystkich wyrobów, różnych pod względem skomplikowania i trudności wykonania … błędem zaniżającym znacząco wartość wskaźnika podrzędnego wydajności”; „może się znacząco zmienić w zależności od produkowanych wyrobów” | POTWIERDZONE (po poprawce) |
| linia półautomatyczna, cykl 26→22 s, OEE 86→79%, 118→130 szt./h | [3] | s. 9 pliku | |
| ISO 22400-2 (2014): dwie definicje rozbieżne ze sobą i z Nakajimą | [11] | streszczenie | |
| norma czeka na nowe wydanie | [12] | „International Standard to be revised [90.92]”; „Expected to be replaced by ISO/DIS 22400-2” | |
| Jonsson i Lesshammar 1999: różne definicje utrudniają porównania; pomiary 30–80% | [4] | s. 62–63 | |
| linia 86% przed zmianą; nagrodzone zakłady >85% | [3], [1] | jw. | |
| Vorne: 85% odpowiedni cel długoterminowy dla wielu firm | [13] | „For many companies, it is a suitable long-term goal.” | |
| de Ron i Rooda: 168 h, OEE 47 vs 59%, te same RE i QE; nie do porównywania pojedynczych maszyn | [14] | tabele 1–2 (s. 4–5 rękopisu), s. 7: „OEE is not a performance measure to compare stand alone machines or workstations” | |
| Ljungberg: dominują straty wydajności | [9] | streszczenie: „it is quite clear that performance losses are the dominating ones” | |
| Ylipää: największy wpływ straty sprawności operacyjnej, potem dostępności | [7] | streszczenie: „operational efficiency losses are found to have the largest impact on OEE followed by availability losses” | |
| przykład fikcyjny: 56,1 / 68,2 / 91,0%; składowe; minuty 100/90/7,5/252,5; 180 sztuk; 3 × 90% = 72,9%; 85/60 = 1,42 | — | dane/oee-warianty.mjs, wynik.json (rachunek redakcji) | POTWIERDZONE (przeliczone przez weryfikatora) |
| Andersson przeliczony nowym cyklem: 118 × 22 / 3600 = 72%; po zmianie 130 × 22 / 3600 = 79% | [3] + rachunek | wynik.json, pomocnicze.andersson (stary cykl daje 85,2% wobec 86% u autorów: zaokrąglenia źródła) | do domknięcia |
| AGH: „Światowym standardem jest wskaźnik OEE na poziomie 85%” | [4] | s. 121 | do domknięcia |
| Jagusiak-Kocik i in.: mieszadło, 31 dni, stoper, 78,9% | [11] | s. 68 („ręcznych pomiarów z użyciem stopera”, „31 dni”), s. 71 („Wskaźnik OEE przyjął średnią wartość równą 78,9%”) | do domknięcia |
| Evocon: ok. 6% firm ≥85%, 3,5 tys. maszyn, 50+ krajów, 2023–2024 | [14] | „roughly 6% of manufacturing organizations have an OEE score of 85% or above”; „3,500+ machines … 50+ countries”; „May 2023 to June 2024” | do domknięcia |
| Hedman: branże 59–74%, najwyżej żywność i napoje; brak rejestru prędkości; „OEE czy tylko dostępność” | [7] | s. 130 (4.1); s. 131: „had not logged information concerning equipment design speed”; s. 132 | do domknięcia |
| Vorne FAQ: błąd poprawiania linii, która nie jest ograniczeniem; OEE linii mierzyć na ograniczeniu | [6] | „to improve OEE by tackling the lowest performing line – even if that line is not a constraint”; „OEE … should always be measured at the constraint step” | do domknięcia |
| Bokrantz: liczenie przezbrojeń jako strat daje bodziec do usprawnień | [9] | s. 1066 | do domknięcia |
| Ljungberg: uwaga na awariach, nie na drobnych stratach tempa | [10] | streszczenie: „the focus is directed towards major time losses due to break-downs rather than minor losses in speed and time” | do domknięcia |
| Muchiri i Pintelon: ręczny zapis gubi krótkie zatrzymania | [17] | s. 30 rękopisu | do domknięcia |

## 6. Przeciwdowody i granice
- Co tezę ogranicza (źródła): Jonsson i Lesshammar (Nakajima uważał 85% za dobry punkt odniesienia); Vorne leanproduction (85% może być celem długoterminowym); linia z 86% u Anderssona i Bellgran; nagrodzone zakłady >85%; Andersson i Bellgran: porównania między zakładami mają sens przy standaryzacji. Wszystko jest w tekście (sekcja „Porównanie ma sens…”).
- Kiedy rama nie działa: OEE nie mówi, czy maszyna jest wąskim gardłem; przy czasie bez zleceń w mianowniku wynik zależy od popytu (de Ron i Rooda). Siła dowodów: wszystkie badania z próbą są szwedzkie i sprzed 2015 r. (C); badań wielu polskich zakładów brak, co tekst mówi wprost.

## 7. Analiza własna i rachunki
- `dane/oee-warianty.mjs` → `dane/wynik.json`: trzy definicje (56,1 / 68,2 / 91,0%), składowe, drzewo strat w minutach dla wariantu 1 (100 min postojów, 90 min tempa, 7,5 min braków, 252,5 min w pełni produktywnych). Sprawdzenie drugim sposobem w kodzie: iloczyn składowych = dobre sztuki × cykl idealny / czas planowany; drzewo minut = OEE wariantu 1 (wyjątek przy niezgodności).
- `dane/rysunek.mjs` → `src/assets/rysunki/oee-85-procent-1.svg` (rysunek 1 z tytułem-wnioskiem).
- 3 × 90% = 72,9% ≈ 73% (przykład liczbowy w tekście).

## 8. Zdjęcie
- Frazy i liczba kandydatów: „factory machine”, „stamping press line”, „machine shop lathes”, „packaging machine”, „conveyor bottles”, „bottling line” (stykówki w `zdjecia/`); po 12–24 kandydatów.
- Odrzucone z czołówki i powód: winiarnia Coppola (marka na kartonach), robot spawalniczy (czytelne logo XIRIS i szyld; przy okazji poprawiono uwagi w jego wpisie w rejestrze), tokarka i butelki z rawpixel (anonimowy autor, 1024 px), kandydaci z twarzami (art. 81).
- Wybrane: `linia-rozlewnicza`, https://commons.wikimedia.org/wiki/File:Wine_bottling_line_at_Chateau_Ste._Michelle_Winery.jpg, David Herrera, CC BY 2.0 (Flickr, licencja potwierdzona przez recenzenta Commons 2009-03-17); strona i metadane API sprawdzone 2026-11-06. Oryginał 2816 × 2112 px.
- Kadr: lewo 0,43, góra 0,40, 0,57 × 0,4275 → 1605 × 903 px (16:9); pomija silnik z napisem producenta i naklejkę ostrzegawczą; butelki bez etykiet. Kadry 16:9, 1:1 i okładka: po buildzie podglądu.

## 9. Weryfikacja
- Runda 1, weryfikator faktów (wersja sprzed przebudowy, 70 twierdzeń): POTWIERDZONE 57, CZĘŚCIOWO 13, NIEPOTWIERDZONE 0, SPRZECZNE 0. Poprawione wszystkie CZĘŚCIOWO: przedział „zwykle 50–70%” (zastąpiony średnimi 51–65% z zastrzeżeniem metody), pełny cytat Jonssona („world-class firms”, „typical manufacturing capability”), s. 62–63, „za wcześniejszym opracowaniem” przy 30–80%, Hedman (100% to wartość domyślna, autorzy uważają tyle prawdziwych 100% za mało prawdopodobne; „przeanalizowali” zamiast „zebrali”), Bokrantz (respondenci podali, że firma rejestruje), AGH (zaniża wydajność; jeden cykl przyjęli autorzy), Schiraldi („wydają się rozbieżne”), Ylipää usunięty z akapitu o tempie (pojęcie niezdefiniowane w streszczeniu), opis źródeł [2] i [3] (tytuł rozdziału, strony, 1982; referat bez potwierdzonej recenzji → rodzaj „Inne”), `metoda` (badania z opisaną metodą szwedzkie; dane JIPM; norma ze streszczenia), FAQ („w dużym stopniu”), brakujące przypisy (Ljungberg przy uwadze na awariach, Vorne FAQ przy wąskim gardle, Bokrantz przy pkt 2 karty).
- Runda 1, recenzent: 22/32, dziesięć problemów. Przyjęte i wprowadzone: (1) nowy benchmark 50–70% → średnie z zastrzeżeniem, że nie wolno ich uśredniać; (2) pełny cytat Nakajimy, „postulat” zamiast gry słów „norma/cel”, nowy śródtytuł; (3) „żadna nie pomyliła się w rachunku”, tylko arkusz 1 liczy przezbrojenie jak TPM; kartę zatwierdza ktoś nierozliczany z OEE; (4) czas bez zleceń poza mianownikiem i osobno, efekt mieszanki wyrobów; (5) lead i zdanie o tempie oznaczone jako przykład redakcji; rachunek na danych Anderssona (72% → 79%); (6) przeżywalność nagrodzonych zakładów, Evocon (D), polskie studium mieszadła, rozrzut branż u Hedmana, Bokrantz „ankieta nie pytała o OEE”; (7) nowy tytuł i otwarcie od paradoksu; (8) wybór maszyny-ograniczenia, cykl przy braku danych, cel w minutach, rachunek 60→85% = 42% z trzema warunkami, cel z centrali; (9) zastrzeżenie o szwedzkich danych, ręczny zapis (Muchiri i Pintelon), przeliczenie 90 min = 180 sztuk i marża; (10) usunięte formułki, stałe nazwy cyklu (producenta / najkrótszy zmierzony / z planu produkcji), „arkusz” dla wariantu. Odrzucone: IATF 16949 (norma płatna, nie sprawdzimy), MESA/LNS i Bokrantz 2014 (siła D, nie zmieniają wniosku; zostają w notatkach), Kang i in. o ISO 22400 (niesprawdzone).
- Runda 2, redaktor językowy: 40 poprawek zdań (T1–T40), 22 cięcia pewne (K1–K22), 6 do decyzji (D1–D6). Przyjęte: T1, T2 (fikcja w pierwszym zdaniu), T3 w wersji ze źródłem (stawka: zestawienie z 85% służy do szacowania potencjału, ITwiz), T4, T5, T6, T7 (inaczej: „ruch wyniku oznacza, że coś zmieniło się w pracy maszyny”), T8, T9, T10, T11, T13 (podział zdania), T15–T22, T23, T25–T30, T32, T33, T34, T35, T36, T37, T38, T39, T40; cięcia K1–K22 bez K3 w pełni (zostawione „ustandaryzowane” bez wyliczenia, wyliczenie jest w FAQ) i D1, D2, D6; przesunięcia budowy 1–4 (składowe wcielone w sekcję o definicjach, sekcja przeciwdowodów rozdzielona od porównań, Vorne „bliżej 60%” na końcu listy średnich, akapit o Nakajimie skrócony); ostatnie zdanie w wersji 2; tytuł w wersji 1 („…zależnie od tego, kto liczy”); lead w wersji 1 z „cel” zamiast „postulat”. Odrzucone: T12 i T14 (zdania usunięte w przebudowie), T24 (rozwinięcie TPM przeniesione do „W skrócie”), T31 (zdanie usunięte, D2), D3 i D5 (zostają: raport z kartą to praktyka, zastrzeżenie o produkcji dyskretnej to granica tezy dla zakładów procesowych), D4 (rozrzut branż zostaje na prośbę recenzenta i czytelnika). Słowa: 2510 przed rundą 2, 2335 po (−7%; mniej niż 10%, bo czytelnik i redaktor dodali treść: tabela, odpowiedź dla zarządu, podpowiedzi w karcie).
- Runda 2, czytelnik testowy 1 (kierownik produkcji, 150 osób, obróbka i montaż): krzywa 4/5/3/3/4/4/3/5/5/4; punkt porzucenia: łańcuch cytatów o Nakajimie i akapit o normie (przewijał, nie porzucił); zapamiętał: 85% to cel, a nie średnia; 56 albo 91% z tej samej zmiany; spadek OEE przy wzroście produkcji (zgodne z planem: wgląd, kryterium; narzędzie zapamiętał jako kartę); przyjemność 6/10, wartość 7/10 → poniżej progu. Wprowadzone: skrócona sekcja o 85% bez łańcuchów „X za Y”, mniej dopisków o fikcji, tabela minut, „cel” zamiast „postulat”, wyjaśnione „produkcja dyskretna”, mniej odwołań do Vorne (usunięte źródło leanproduction.com), warunek przy marży, podpowiedzi w pkt 5 i 6 karty (przeróbka jako strata jakości [JIPM], próg dwóch minut [Vorne]), produkcja gniazdowa, odpowiedź dla zarządu w trzech zdaniach, de Ron bez mylącego nawiasu, „porównywania ze sobą pojedynczych maszyn”, nazwa nagrody. Nie wprowadzone: karta do pobrania (PDF/XLSX) — propozycja dla Patryka jako osobny materiał; liczby dla branży metalowej (brak źródła z opisaną metodą).
- Runda 2, czytelnik testowy 2: (w toku)
- Domknięcie: zdania zmienione i dodane po rundzie 1 (wiersze „do domknięcia” w rejestrze) idą do ponownej weryfikacji.
- `sprawdzono`: (po domknięciu)

## 10. Kontrola automatyczna
- `redakcja:kontrola` (wersja po rundzie 2): 2335 słów, 174 zdania, średnio 13,4 słowa, FOG-PL 8,8, 10 śródtytułów, 18 źródeł, 18 przypisów; rytm 0,45, akapity 0,34, strona bierna 0, półpauzy 0; 0 błędów, 0 uwag.
- `redakcja:zrodla` (wersja z 14 źródłami): wszystkie adresy 200 albo 403 przy Emerald (blokada automatów; DOI potwierdzone w Crossref, otwarte wersje w repozytoriach); bez wycofanych prac. Powtórzyć po domknięciu (18 źródeł).
- Testy: `npx vitest run src/lib/kontrola-tekstu.test.ts src/lib/zdjecia.test.ts src/lib/redakcja.test.ts`: 62 zaliczone, 1 pominięty.

## 11. Karta jakości
- Bramki twarde: …
- Punkty (1–16) i suma:

## 12. Dla Patryka
- Decyzje do podjęcia:
- Miejsca `[DO UZUPEŁNIENIA]`:
- Czego nie udało się sprawdzić:
- Liczby do odświeżenia i kiedy (np. dane Eurostatu w grudniu):

## 13. Kontrola redakcyjna
Patryk czyta cały tekst przed publikacją i decyduje. To warunek publikacji (SKILL.md, zasada 6).
| Data | Kto | Decyzja (zatwierdzam / zmiany / odrzucam) | Co zmieniono |
|---|---|---|---|

## 14. Zmiany po publikacji
| Data | Co zmieniono | Dlaczego |
|---|---|---|
