# Weryfikacja 1: próg stażu z art. 36 § 1 Kp osiągnięty w trakcie wypowiedzenia

Weryfikator niezależny (adwersarz), 2026-11-15. Źródło: otwarte API SAOS (`.cache/narzedzia/saos.py`), Sąd Najwyższy, 1994–2016. Wnioski oparte wyłącznie na dosłownych fragmentach pełnych tekstów, nie na tezach z wyszukiwarki. sn.pl i PIP nie były używane.

## Pytanie

Gdy staż u danego pracodawcy w dniu doręczenia wypowiedzenia jest niższy od progu 6 miesięcy albo 3 lat, ale próg mija przed końcem krótszego okresu wypowiedzenia, czy okres jest dłuższy? Do kiedy liczy się staż? Czy są orzeczenia przeciwne albo zastrzeżenia?

## Zapytania do SAOS (courtType=SUPREME, pageSize=50)

| Zapytanie `all=` | Wyników | Trafne |
|---|---|---|
| `"liczony od dnia zawarcia umowy o pracę do daty jej rozwiązania"` | 3 | I PKN 34/99, II PK 56/07, II PK 12/11 |
| `"okres zatrudnienia, od którego zależy okres wypowiedzenia"` | 1 | II PK 12/11 |
| `"do końca zatrudnienia po wypowiedzeniu"` | 1 | II PK 12/11 |
| `"liczy się do jego upływu"` | 10 | II PK 12/11 (reszta spoza tematu) |
| `"okres wypowiedzenia jest okresem zatrudnienia"` | 4 | I PKN 34/99, III PZP 20/02, II PK 56/07, I PK 45/13 (art. 52, poza tematem) |
| `"okres zatrudnienia u danego pracodawcy" "do dnia złożenia oświadczenia"` | 2 | I PKN 34/99 (pogląd skarżącego, odrzucony); III PK 44/05 (poza tematem) |
| `"art. 36 § 1" "do dnia wypowiedzenia"` | 5 | II PK 12/11; I PKN 366/97, I PKN 619/00, I PKN 171/01, I PK 2/08 bez związku |
| `"od którego zależy długość okresu wypowiedzenia"` | 5 | III PZP 20/02, I PK 2/13, I PKN 377/98, II PK 332/04 (sumowanie okresów, nie moment) |
| `"zakładowy staż pracy" "okres wypowiedzenia" "art. 36"` | 10 | I PKN 34/99, II PK 56/07; reszta: umowy terminowe, art. 47¹ |
| `"do daty rozwiązania" "okres zatrudnienia u danego pracodawcy"` | 5 | II PK 12/11; reszta poza tematem |
| `"okres wypowiedzenia" "wlicza się do okresu zatrudnienia"` | 15 | brak orzeczeń o momencie liczenia stażu (art. 23¹, 36¹ § 2, 51, służba wojskowa) |
| `"był zatrudniony" "okres wypowiedzenia" "w czasie biegu"` | 6 | brak trafnych |
| `"36 § 1 pkt 2" "36 § 1 pkt 3" "w okresie wypowiedzenia"` | 2 | II PK 12/11; I PK 29/08 (bez sporu o moment) |
| `"3-letniego" "okresu zatrudnienia" "okres wypowiedzenia" "upływ"` | 2 | I PKN 34/99; II PK 78/08 (art. 72, poza tematem) |
| bez wyników (0): `"I PKN 34/99"`, `"I PZP 33/78"`, `"wliczania okresu wypowiedzenia do okresu zatrudnienia"`, `"w trakcie biegu okresu wypowiedzenia" "3 lata"`, `"osiągnął" "w okresie wypowiedzenia" "trzech lat" "36 § 1"`, `"okres wypowiedzenia" "przedłuża się" …`, `"art. 36 § 1 pkt 1" "6 miesięcy" "w okresie wypowiedzenia" …` | 0 | (fraza w cudzysłowie z sygnaturą nie działa w SAOS; sprawdzono pełnym tekstem) |

## Orzeczenia

| Sygnatura, data, id SAOS | Stan faktyczny | Dosłowny fragment uzasadnienia | Znaczenie |
|---|---|---|---|
| **I PKN 34/99**, wyrok 11.05.1999, [79015](https://www.saos.org.pl/judgments/79015) | Zatrudnienie od 20.03.1995; wypowiedzenie pismem z 26.02.1998 z okresem 1 miesiąca, do 31.03.1998. 3 lata mijały 19/20.03.1998, w trakcie okresu miesięcznego. Sądy obu instancji: 3 miesiące; SN oddalił kasację pracodawcy. | „Nie ma żadnego uzasadnienia prawnego założenie, że staż zatrudnienia u danego pracodawcy znaczy co innego niż okres trwający od chwili nawiązania stosunku pracy do jego ustania (rozwiązania), które w przypadku wypowiedzenia umowy o pracę następuje z upływem okresu wypowiedzenia (art. 32 § 2 KP).” … „o długości przewidzianych w art. 36 § 1 KP okresów wypowiedzenia decyduje okres zatrudnienia u danego pracodawcy, który obejmuje cały staż zatrudnienia u tego pracodawcy, liczony od dnia zawarcia umowy o pracę do daty jej rozwiązania z upływem okresu wypowiedzenia (art. 32 § 2 KP).” | Wprost: próg w trakcie biegu wydłuża okres. SN odrzucił pogląd skarżącego (staż „do dnia złożenia oświadczenia o rozwiązaniu”, argument ze zwrotu „był zatrudniony”, art. 61, 89, 116 KC). Powołuje uchwałę I PZP 33/78 (4.04.1979, OSNC 1979/10/188; nie ma jej w SAOS): „żaden przepis Kodeksu pracy nie daje podstawy do odmiennego traktowania okresu wypowiedzenia, który jest okresem zatrudnienia”. |
| **II PK 12/11**, wyrok 6.07.2011, [95376](https://www.saos.org.pl/judgments/95376) | Zatrudnienie od 1.08.2006 (3 lata mijały 31.07.2009); skuteczne wypowiedzenie z 29.06.2009 doręczone (awizo) w lipcu 2009 z okresem 1 miesiąca. Sąd okręgowy: 1 miesiąc, „wobec zatrudnienia powódki poniżej 3 lat”, koniec 31.08.2009. SN uchylił. | „Zasadny jest zarzut naruszenia art. 36 § 1 pkt 2 i 3 k.p., gdyż okres zatrudnienia, od którego zależy okres wypowiedzenia, liczy się do jego upływu, czyli do końca zatrudnienia po wypowiedzeniu, a nie do dnia wypowiedzenia. Pozwana zatrudniała powódkę od 1 sierpnia 2006 r., zatem wobec ustalenia, że wypowiedzenie umowy o pracę zostało doręczone w lipcu 2009 r., to okres wypowiedzenia powinien być trzymiesięczny a nie jednomiesięczne.” | Wprost to samo co I PKN 34/99, z powołaniem jego tezy. Kasacja pracownicy nazwała pogląd przeciwny („liczony jest do chwili doręczenia”) błędną wykładnią; SN to przyjął. SN nie wypowiedział się, od kiedy biegną 3 miesiące (sąd rejonowy przy doręczeniu 3.08.2009 liczył od 1.09 do 30.11.2009). |
| **II PK 56/07**, wyrok 29.10.2007, [86779](https://www.saos.org.pl/judgments/86779) | Umowa zawarta 15.11.2004, praca od 1.03.2005; pracownik wypowiedział 1.02.2005, przed nawiązaniem stosunku pracy. | „W wyroku z dnia 11 maja 1999 r., I PKN 34/99 … Sąd Najwyższy stwierdził, że o długości okresów wypowiedzenia (art. 36 § 1 k.p.) decyduje okres zatrudnienia u danego pracodawcy liczony od dnia zawarcia umowy o pracę do daty jej rozwiązania z upływem okresu wypowiedzenia (art. 32 § 2 k.p.). Przedmiotem rozstrzygnięcia w sprawie, w której zapadł powyższy wyrok, była kwestia dopuszczalności wliczania okresu wypowiedzenia do okresu zatrudnienia u danego pracodawcy …” Dalej: „W dniu nawiązania stosunku pracy rozpoczyna się okres zatrudnienia. Jeżeli więc strony wskazały w umowie o pracę dzień rozpoczęcia pracy późniejszy niż data zawarcia umowy, okres pomiędzy zawarciem umowy a nawiązaniem stosunku pracy nie jest traktowany jako okres zatrudnienia” … „Okresem wypowiedzenia dokonanego przed nawiązaniem się stosunku jest okres przewidziany w art. 36 § 1 pkt 1 k.p.” | Aprobuje linię I PKN 34/99 bez zastrzeżeń co do wliczania okresu wypowiedzenia. Zastrzeżenie dotyczy tylko początku stażu: liczy się od nawiązania stosunku pracy (art. 26), nie od zawarcia umowy, mimo słów tezy I PKN 34/99. |
| **III PZP 20/02**, uchwała 7 sędziów 15.01.2003, [81804](https://www.saos.org.pl/judgments/81804) | Kilka umów z przerwami u jednego pracodawcy. | „Przy ustalaniu okresu wypowiedzenia umowy o pracę zawartej na czas nieokreślony (art. 36 § 1 k.p.) uwzględnia się wszystkie okresy zatrudnienia u tego samego (danego) pracodawcy.” Uzasadnienie wspomina „rozbieżność w kwestii pojmowania wyrażenia »okres zatrudnienia u danego pracodawcy«” (I PKN 81/01). | Rozbieżność, o której mowa, dotyczyła sumowania umów, a nie momentu liczenia stażu. Ważne dla danych wejściowych narzędzia (jedna data „od”). |
| **I PK 2/13**, wyrok 12.06.2013, [102031](https://www.saos.org.pl/judgments/102031) | Przejście pracownika samorządowego na podstawie porozumienia pracodawców. | „tak zsumowane okresy zatrudnienia stanowią na gruncie art. 36 § 1 k.p. okres zatrudnienia u tego (danego) pracodawcy, który dokonuje wypowiedzenia umowy o pracę.” | Tylko zakres wliczanych okresów (art. 36 § 1¹, art. 23¹); o momencie nic. |

Orzeczeń SN przeciwnych (staż tylko do dnia doręczenia albo złożenia oświadczenia; brak wydłużenia; wliczanie okresu wypowiedzenia do stażu tylko „dla innych celów”) w SAOS nie znalazłem. Pogląd „do dnia złożenia oświadczenia” występuje wyłącznie jako zarzut stron (kasacja pracodawcy w I PKN 34/99) i stanowisko sądu okręgowego w II PK 12/11, w obu sprawach odrzucone przez SN.

## Ocena linii orzeczniczej

**Linia jednolita** (w zakresie dostępnym w SAOS): I PKN 34/99 (1999), aprobowana w II PK 56/07 (2007) i zastosowana wprost w II PK 12/11 (2011), z uchwałą I PZP 33/78 (1979) w tle. Staż liczy się do dnia rozwiązania umowy z upływem okresu wypowiedzenia, więc gdy próg przypada przed końcem krótszego okresu, obowiązuje okres dłuższy. Jedyne zastrzeżenie w orzecznictwie dotyczy **początku** stażu (od nawiązania stosunku pracy, nie od zawarcia umowy: II PK 56/07). SN nie powiedział wprost, od jakiej daty biegnie wydłużony okres; z obu stanów faktycznych wynika liczenie od tego samego doręczenia (I PKN 34/99: sądy przyjęły 3 miesiące zamiast 1 przy tym samym piśmie; II PK 12/11: „doręczone w lipcu 2009 r. … trzymiesięczny”).

Komentarz w `src/lib/narzedzia/wypowiedzenie.ts` („część orzecznictwa SN”, „przepis nie mówi wprost”) zaniża siłę tej linii: w SAOS to stanowisko jednolite, nie wariant „bezpieczny”. Proponuję: „tak orzeka SN: I PKN 34/99, II PK 12/11”.

## Ocena narzędzia (`wypowiedzenieStalej`)

Sprawdziłem funkcję na kopii kodu (Node 22, `--experimental-strip-types`) na stanach faktycznych SN:

| Dane | Wynik narzędzia | SN |
|---|---|---|
| od 1995-03-20, doręczenie 1998-02-26 (I PKN 34/99) | 3 miesiące, koniec 31.05.1998; próg 19.03.1998, krótszy 1 mies. do 31.03.1998 | 3 miesiące: zgodne |
| od 2006-08-01, doręczenie 2009-07-15 i 2009-07-31 (II PK 12/11) | 3 miesiące, koniec 31.10.2009 | 3 miesiące: zgodne |
| od 2006-08-01, doręczenie 2009-08-03 (wariant sądu rejonowego) | staż 36, 3 miesiące, koniec 30.11.2009 | zgodne z sądem rejonowym |

Algorytm (okres wg stażu w dniu doręczenia, potem staż na koniec tego okresu, w razie progu dłuższy okres od tego samego doręczenia, do skutku) odpowiada regule SN, bo zawsze wybiera najkrótszy okres, który jest „spójny” ze stażem liczonym do dnia rozwiązania. Pętla jest poprawna także wtedy, gdy krótszy okres kończy się przed progiem (brak wydłużenia).

Przypadki, w których narzędzie liczy inaczej niż SN albo SN go nie potwierdza:

1. **Wypowiedzenie przed rozpoczęciem pracy (II PK 56/07).** SN: okres 2 tygodnie (art. 36 § 1 pkt 1), umowa może być wypowiedziana przed nawiązaniem stosunku pracy. Narzędzie odrzuca takie dane („Początek pracy musi być przed doręczeniem wypowiedzenia.”, `okres-wypowiedzenia.astro`, ok. wiersza 160), zamiast podać 2 tygodnie. To nie zły wynik, tylko brak wyniku w sytuacji, którą SN rozstrzygnął.
2. **Umowa zawarta wcześniej niż początek pracy.** Teza I PKN 34/99 mówi „od dnia zawarcia umowy”; II PK 56/07 mówi, że okres między zawarciem a nawiązaniem stosunku pracy „nie jest traktowany jako okres zatrudnienia”. Narzędzie liczy od „początku pracy”, czyli zgodnie z II PK 56/07. Gdy próg mija tylko przy liczeniu od zawarcia umowy, wynik narzędzia jest krótszy niż przy dosłownym czytaniu tezy I PKN 34/99. Uważam narzędzie za poprawne, ale warto o tym wiedzieć.
3. **Próg mija w ostatnim dniu krótszego okresu.** Np. od 2023-06-01, doręczenie 2026-04-15: 1 miesiąc kończy się 31.05.2026, a 3 lata mijają z końcem tego samego dnia. Narzędzie podaje 3 miesiące (do 31.07.2026). Wynika to z reguły SN („do daty jej rozwiązania”, staż wtedy wynosi „co najmniej 3 lata”), ale w SAOS nie ma sprawy z takim stanem faktycznym. Wynik da się obronić, jednak SN go nie potwierdził.
4. **Kilka umów z przerwami (III PZP 20/02).** Narzędzie przyjmuje jedną datę „od”. Opis pola każe wpisać datę zastępczą po przeliczeniu stażu w kalkulatorze stażu. Przy przerwach wydłużenie w trakcie biegu wypowiedzenia liczy się wtedy poprawnie tylko pod warunkiem, że ostatnia umowa trwa bez przerwy do doręczenia, a tak jest zawsze, bo wypowiada się trwającą umowę. Zgodne.

Nie znalazłem przypadku, w którym narzędzie przy poprawnych danych liczy **inaczej** niż SN w sprawach z SAOS. Rozbieżności 1 i 2 dotyczą danych brzegowych, a przypadek 3 nie ma potwierdzenia w orzecznictwie.

## Czego nie sprawdzono

- Uchwała I PZP 33/78 (1979) i orzeczenia sprzed 1994 r. oraz po 2016 r.: poza SAOS.
- Przepisy przejściowe dla umów na czas określony zawartych przed 22.02.2016 r.: poza zakresem.
- Literatura i stanowiska PIP i MRPiPS (komentarz w kodzie się na nie powołuje): nie weryfikowano, bo zadanie obejmowało tylko SAOS.
