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
| 1 | vorne-wc | Vorne, World-Class OEE | Raport firmy | D | https://www.oee.com/world-class-oee/ (cała strona) | pochodzenie 85% (Nakajima 1984/1988, minimum, nagrodzone zakłady >85%), zastrzeżenia (dyskretna, Japonia, lata 70., motoryzacja), „closer to 60%” | dostawca systemów OEE; 60% bez danych i metody |
| 2 | jipm | Shirose (1989), rozdz. 2 w: Nakajima (red.), TPM Development Program | Książka | C | archive.org, wyszukiwarka w treści (leaf 66 = s. 38); sześć dużych strat w tym samym rozdziale | 40–60% zmierzone w firmach JIPM, 85–95% osiągalne dzięki TPM; przezbrojenie i regulacja jako jedna z sześciu strat | próba nieopisana; pełny tekst tylko po wypożyczeniu |
| 3 | andersson | Andersson, Bellgran (2011), SPS11 | Badanie recenzowane (referat) | C | https://lup.lub.lu.se/search/files/6184392/2224805.pdf | różne interpretacje czasu planowanego i cyklu idealnego; 86→79%, 118→130 szt./h; porównanie przy standaryzacji | jedna firma, studium przypadku |
| 4 | jonsson | Jonsson, Lesshammar (1999), IJOPM 19(1) | Badanie recenzowane | C | https://publications.lib.chalmers.se/records/fulltext/26422/local_26422.pdf | Nakajima (za Raoufem): A>0,90, P>0,95, Q>0,99, OEE>0,84, „good benchmark”; trudność porównań; 0,30–0,80 (za Ericssonem) | cytat z drugiej ręki |
| 5 | vorne-faq | Vorne, OEE FAQ | Raport firmy | D | https://www.oee.com/faq/ | „convenient, compelling and completely artificial benchmark” | dostawca |
| 6 | hedman | Hedman, Subramaniyan, Almström (2016), Procedia CIRP 57 | Badanie recenzowane | C | https://publications.lib.chalmers.se/records/fulltext/246913/local_246913.pdf | 884 maszyny, 23 firmy, X 2013–III 2014, średnia 65%, mediana 70%; 702/884 i 796/884 = 100% (domyślne); wyłączone przestoje planowane | klienci jednego dostawcy (Good Solutions AB), próba wygodna |
| 7 | ylipaa | Ylipää i in. (2017), IJPPM 66(1) | Badanie recenzowane | C | streszczenie (OpenAlex, Crossref) | 98 szwedzkich firm 2006–2012; straty sprawności operacyjnej największe, potem dostępności | pełny tekst płatny; średniej 51,5% w streszczeniu nie ma |
| 8 | bokrantz | Bokrantz i in. (2016), JMTM 27(8) | Badanie recenzowane | C | https://publications.lib.chalmers.se/records/fulltext/245676/local_245676.pdf (CC BY) | 51,5% za Ylipää i in. (>90 firm, 2006–2012); ankiety 80/2001 i 71/2014; <50% i <25%; „virtually all OEE definitions” | ankieta deklaratywna |
| 9 | ljungberg | Ljungberg (1998), IJOPM 18(5) | Badanie recenzowane | C | streszczenie (Crossref); Emerald 403, nie obchodzono | ok. 20 przypadków, OEE ok. 55%, dominują straty wydajności | stare dane, tylko streszczenie |
| 10 | agh | Murdzek, Richert, Hubicki (2021), rozdz. monografii AGH | Książka | C | https://winntbg.bg.agh.edu.pl/skrypty4/0587/nowoczesne_metody_119.pdf | jedna maszyna, tydzień: 46–83%, średnio 68%; jeden cykl normatywny zaniża wynik | jedna maszyna |
| 11 | vorne-lp | Vorne, leanproduction.com/oee, „OEE Benchmarks” | Raport firmy | D | https://www.leanproduction.com/oee/ | „For many companies, it is a suitable long-term goal.” (kontrargument) | dostawca |
| 12 | deron | de Ron, Rooda (2006), IJPR 44(23) | Badanie recenzowane | C | https://hal.science/hal-00512884/document (rękopis złożony do recenzji) | tabele 1–2: 168 h, OEE 0,474 vs 0,592 przy tych samych RE i QE; „not a performance measure to compare stand alone machines” | przykład liczbowy, wersja rękopisu |
| 13 | schiraldi | Schiraldi, Varisco (2020), C&IE 145 | Badanie recenzowane | C | streszczenie | dwie wersje OEE w ISO 22400 rozbieżne ze sobą i z Nakajimą | tylko streszczenie |
| 14 | iso | ISO 22400-2:2014, karta w katalogu | Przepis lub norma | A (dla statusu) | https://committee.iso.org/standard/54497.html | status 90.92 „to be revised”, ISO/DIS 22400-2 w toku | treści normy nie czytano (płatna) |

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
| AGH: jeden cykl normatywny dla wszystkich wyrobów znacząco zaniża wynik | [10] | „Analizowane przedsiębiorstwo nie określa normatywnego czasu cyklu dla wszystkich wyrobów … błędem zaniżającym znacząco wartość wskaźnika” | |
| linia półautomatyczna, cykl 26→22 s, OEE 86→79%, 118→130 szt./h | [3] | s. 9 pliku | |
| ISO 22400-2 (2014): dwie definicje rozbieżne ze sobą i z Nakajimą | [13] | streszczenie | |
| norma czeka na nowe wydanie | [14] | „International Standard to be revised [90.92]”; „Expected to be replaced by ISO/DIS 22400-2” | |
| Jonsson i Lesshammar 1999: różne definicje utrudniają porównania; pomiary 30–80% | [4] | s. 62–63 | |
| linia 86% przed zmianą; nagrodzone zakłady >85% | [3], [1] | jw. | |
| Vorne: 85% odpowiedni cel długoterminowy dla wielu firm | [11] | „For many companies, it is a suitable long-term goal.” | |
| de Ron i Rooda: 168 h, OEE 47 vs 59%, te same RE i QE; nie do porównywania pojedynczych maszyn | [12] | tabele 1–2 (s. 4–5 rękopisu), s. 7: „OEE is not a performance measure to compare stand alone machines or workstations” | |
| Ljungberg: dominują straty wydajności | [9] | streszczenie: „it is quite clear that performance losses are the dominating ones” | |
| Ylipää: największy wpływ straty sprawności operacyjnej, potem dostępności | [7] | streszczenie: „operational efficiency losses are found to have the largest impact on OEE followed by availability losses” | |
| przykład fikcyjny: 56,1 / 68,2 / 91,0%; składowe; minuty 100/90/7,5/252,5 | — | dane/oee-warianty.mjs, wynik.json (rachunek redakcji) | |

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
- Runda 1, weryfikator faktów: liczby werdyktów, poprawki:
- Runda 1, recenzent: najważniejsze uwagi i co z nimi zrobiono:
- Runda 2, redaktor językowy: poprawki przyjęte / odrzucone (z powodem), słowa przed i po cięciach:
- Runda 2, czytelnik testowy (persona): krzywa uwagi, punkt porzucenia i co z nim zrobiono, co zabiera kontra plan tekstu, przyjemność _/10, wartość _/10:
- Domknięcie: ponowna weryfikacja zdań z faktami, drugi czytelnik testowy (gdy był potrzebny):
- `sprawdzono`:

## 10. Kontrola automatyczna
- `redakcja:kontrola` (statystyki, błędy; uwagi stylu: poprawione albo dlaczego zostają):
- `redakcja:zrodla`:
- Testy:

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
