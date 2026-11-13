# Audyt jakości 2: raport (2026-11-13)

Niezależny audyt 41 narzędzi dodanych po pierwszym audycie. 9 partii (A–I), w każdej audytor dostał pliki narzędzia
i teksty przepisów z API Sejmu (bez wniosków zespołu), a każde znalezisko sprawdził drugi podagent (weryfikator).
Poprawione są tylko znaleziska potwierdzone albo częściowo potwierdzone, w wersji weryfikatora, każde z testem.
Zasady: `WSPOLNE.md`, `WERYFIKATOR.md`. Wynik: `npm run -s check:szybki` i `BEZ_WEBKIT=1 npm run check` EXIT 0 (E2E: 1893 zaliczone, 7 pominiętych; testy jednostkowe zielone). Surowe raporty: `<partia>.json` (audytor) i `<partia>-wer.json` (weryfikator).

Wynik weryfikacji 73 znalezisk audytorów: potwierdzone 58, częściowo 12, odrzucone 3. Do tego 6 nowych znalezisk
weryfikatorów, poprawionych w narzędziach partii (D-9 i I-N1 dotyczą też reszty serwisu, patrz niżej).

## Poprawione błędy według narzędzi

**Urlopy (A)**
- urlop-w-okresie-wypowiedzenia: daty domyślne („od” i koniec miesiąca) liczone w przeglądarce, nie w dniu budowania; test przełomu 2027/2028.
- urlop-w-godzinach: dni na żądanie bez planu najwyżej tyle, ile pełnych dni urlopu zostało (art. 163 § 1, 167², 168); ułamkowa resztka godzin (np. 4,5 h); „mniej niż jeden dzień” zamiast „3 h po 8 h”; „do 1 dnia”.
- urlop-bezplatny: „za 2026 r.” zamiast „za 2026”; pola dat jedno pod drugim przy 320 px (też zalegly-urlop).
- urlop-szkoleniowy: etykiety egzaminów nie nachodzą na siebie przy 320 i 360 px.

**Czas pracy (B)**
- odpracowanie-wyjscia-prywatnego: zdanie „odpracowanie nie jest obowiązkowe” zastąpione brzmieniem zgodnym z art. 151 § 2¹; wyjaśnienie, gdy 33 h odpoczynku tygodniowego daje sam rozkład.
- doba-pracownicza: najbliższy poniedziałek liczony w przeglądarce; ustawa o dniach wolnych w rejestrze.
- nadgodziny-sredniotygodniowe: aria-invalid przy błędach zakresu, puste pole to brak danych; lata z kalendarza (też rownowazny-czas-pracy).
- cały serwis: podzbiór fontu ma cyfry indeksu ⁰–⁹ (wcześniej „art. 151⁹” rysował font zastępczy), test w `fonty.test.mjs`.

**Wynagrodzenia i zasiłki (C)**
- zasilek-chorobowy-na-zleceniu: zasiłek najwyżej za okres zasiłkowy (182, w ciąży 270 dni; wcześniej płacił np. za 250 dni choroby); podpowiedź o chorobowym przy pensji z etatu niższej od minimalnej (art. 9 ust. 1a ustawy o systemie); „—” zamiast mylącego 0 zł przy zleceniu u pracodawcy.
- okres-wyczekiwania: bez „r..”, uwaga o absolwencie tylko gdy warunek niespełniony, data domyślna w przeglądarce, testy przerwy przez 29.02.2028, SSR = skrypt.
- wynagrodzenie-za-niepelny-miesiac, dodatek-wyrownawczy: miesiąc i rok z przeglądarki; jedna funkcja tekstów dla HTML i skryptu; „październik” nie ucięty przy 320 px.
- swiadczenie-urlopowe: test zatrzymuje build, gdy po 20 lutego brak kwoty GUS na bieżący rok; komunikat dla urlopu w roku bez ogłoszonej kwoty; krótsze opcje list.

**Emerytura i renta (D)**
- swiadczenie-przedemerytalne: świadczenie najwcześniej data + 182 dni (rejestracja, 180 dni zasiłku, wniosek; wcześniej 2 dni przed urodzinami pisało „spełniasz”); ostrzeżenie o kwotach przychodu po 1 marca i test pilnujący komunikatu ZUS.
- renta-z-tytulu-niezdolnosci-do-pracy: limit 1/3 nieskładkowych także w ostatnich 10 latach (art. 5 ust. 2) w opisie pola, wyniku i „Jak liczymy”; cytat o orzeczeniu po zmianie od 1.01.2027 (art. 85a ustawy o systemie).
- dorabianie-do-renty: opcje świadczenia nie są ucięte przy 320 px.
- 4 narzędzia partii: aria-invalid przy błędach i ponowne liczenie po powrocie „Wstecz” (pageshow).

**Podatki (E)**
- zerowy-pit: następny rok na liście (po Nowym Roku strona zbudowana w grudniu liczyła stary rok) z uwagą o dacie sprawdzenia przepisów; rok przeprowadzki z dzisiejszej daty.
- zwrot-podatku-pit-37: termin dopłaty przesunięty z dnia wolnego (art. 12 § 5 Ordynacji; za 2027 r. to 2 maja 2028 r.).
- ulga-na-dzieci, zwrot-podatku-pit-37: ostrzeżenie, że limit 112 000 zł samotnego rodzica dotyczy małoletniego dziecka (art. 27f ust. 2 pkt 1 lit. b); „33,5%” z przecinkiem; pełny wykaz nowelizacji ustawy o PIT (1347, 1354).

**Zatrudnienie (F)**
- wypowiedzenie-zmieniajace: bez pouczenia przy progu stażu w trakcie wypowiedzenia termin odmowy z krótszego okresu (wcześniej 31.12 zamiast 28.11, odmowa mogła być spóźniona); „Zostały 2 dni”; ochrona w ciąży przy zwolnieniach z przyczyn niedotyczących pracowników.
- praca-cudzoziemca: obywatel Ukrainy z kartą pobytu i pracy pracuje na podstawie art. 41 ustawy o wygaszeniu (wcześniej „praca na innych warunkach nielegalna”); Armenia, Białoruś i Mołdawia osobno; krótsze opcje.
- zgloszenie-pracy-cudzoziemca: termin wniosku o kartę CUKR według dzisiejszej daty, nie daty startu; typografia komunikatów.
- informacja-o-warunkach-zatrudnienia: informacja o kontroli trzeźwości przed dopuszczeniem do pracy (art. 22¹c § 12).
- umowa-na-zastepstwo: „ciążyi” sklejone z linkiem; opis stażu („dnia doręczenia nie wliczamy”, też wypowiedzenie zmieniające).

**Kierowcy (G)**
- czas-jazdy-kierowcy: art. 8 ust. 8a rozporządzenia 561/2006 zamiast ust. 8; link do kalkulatora dyżuru kierowcy zamiast dyżuru z Kodeksu pracy; pole „Pojazd” w pełnym wierszu na telefonie (wcześniej ucięta nawet opcja domyślna przy 360 i 412 px).
- zaswiadczenie-adr: opis pliku kalendarza zgodny z przypomnieniami (było „bez powiadomień”), test treści .ics.
- dyzur-kierowcy: miesiąc nie ucięty przy 320 px. badania-kierowcy: pytanie FAQ bez roku 2026.

**BHP (H)**
- praca-na-wysokosci: słup, maszt, konstrukcja bez stropów od 1,0 m z szelkami i hełmem (§ 110 ust. 1 nie rozstrzyga progu 2 m; opisane), wcześniej „balustrada”; zmiana miejsca nie zakłada balustrady.
- badania-lekarskie-w-pracy: pierwsza praca bez poprzedniej umowy daje wynik „potrzebne” zamiast błędu; badanie okresowe przed datą z orzeczenia (FAQ, kalendarz).
- rejestr: opis załącznika o pracach w ciąży (cz. I, III, VIII), pełny tytuł rozporządzenia o badaniach.

**Uprawnienia i spory (I)**
- czy-potrzebne-uprawnienia-udt: rok przeciętnego wynagrodzenia przy opłacie i ostrzeżenie o nowym komunikacie GUS po roku.
- waznosc-uprawnien-sep: wyjaśnienie opłaty, gdy na bieżący rok nie ma płacy minimalnej; role="alert" przy błędach (też UDT).
- sad-pracy-czy-pip: art. 461 § 1¹ KPC jako podstawa właściwości sądu rejonowego; pełny tytuł rozporządzenia o skargach.
- mobbing-i-dyskryminacja: test przełomu roku (zachowanie było poprawne).

Nowe testy E2E: `tests/e2e/daty-domyslne.spec.ts` (daty domyślne po Nowym Roku w 11 narzędziach) i `tests/e2e/jakosc2-uklad.spec.ts` (320 px: etykiety, pola dat, opcje list w 9 narzędziach).

## Odrzucone (krótko)
- C-3 (zasiłek po wypadku zleceniobiorcy bez chorobowego z 13,71%): rozdział 9 liczy z podstawy składki chorobowej, której wtedy nie ma; strona opisuje przyjętą wykładnię.
- E-6 (stałe skali PIT w trzech plikach): przebudowa, dziś wartości są zgodne; ryzyko w sprawach do sprawdzenia.
- G-7 (rejestr ADR „kto płaci za kurs i egzamin”): strona na to odpowiada, bez nieścisłości.

## Nie poprawione (poza zakresem albo do decyzji)
- Komunikaty błędów: role="alert" ma 17 ze 100 stron z `.blad-pola`; reszta polega na aria-describedby i aria-invalid (I-N1). Do jednej decyzji dla serwisu.
- Ponowne liczenie po „Wstecz” (pageshow) dodane w 4 narzędziach partii D; inne narzędzia mają ten sam problem (D-9).
- `lataKalendarza()` i listy lat liczone przy budowaniu: strona nieprzebudowana przez ponad rok nie ma bieżącego roku (G, poza zakresem).
- czas-jazdy-kierowcy przy 320 px: „Odpoczynek” w wierszach okresów ucięty („Odpoczyne”); zwężenie kolumny czasu ucina godzinę, potrzebny projekt wiersza.
- Ucięty „październik” przy 320 px także w wyplata-z-nadgodzinami i pracownik-niepelnosprawny (nieaudytowane).
- urlop-ojcowski: „Zostało 2 dni” jak w F-9 (nieaudytowane).

## Czego nie sprawdzono
- Rozporządzenie (WE) 561/2006 w EUR-Lex (blokuje automaty): art. 8 ust. 6b i 8a do potwierdzenia ręcznie; ust. 8a potwierdza ustawa o transporcie drogowym (zał. 3 lp. 1.7a).
- sn.pl i zus.pl (blokują automaty): orzecznictwo o połowie okresu wypowiedzenia i progu stażu, przedawnieniu przy mobbingu, art. 5 ust. 2 w dziesięcioleciu z art. 58 ust. 2; praktyka ZUS przy wypadku zleceniobiorcy bez chorobowego.
- Czytnik ekranu na żywo (NVDA/VoiceOver) i WebKit (iPhone): sprawdzone atrybuty ARIA i Chromium.

## Do STAN.md (terminy)
- 2026-11-23: komunikat ZUS o kwotach 70%/130% od 1.12.2026 (dorabianie; oczekiwane 6522,00 i 12 112,20 zł).
- 2026-12-31: ustawa okołobudżetowa na 2027 r. (podstawa odpisu ZFŚS) i skala PIT na 2027 r. (brak zmian w API Sejmu na 13.11).
- 2027-02-01: czy Rada UE przedłużyła ochronę czasową obywateli Ukrainy po 4.03.2027 (praca cudzoziemca, zgłoszenie).
- 2027-02-10 do 02-25: GUS przeciętne wynagrodzenie za 2026 r. (opłata UDT, świadczenie urlopowe), ZUS kwoty od 1.03.2027 (dorabianie, świadczenie przedemerytalne, maksymalne zmniejszenia), najniższa renta od 1.03.2027 (ulga na dzieci, LATA_PIT 2027).
- 2027-03-05: po terminie wniosku o kartę CUKR usunąć pozycję i teksty w czasie przyszłym.
- 2027-09-15: płaca minimalna 2028 (mobbing, SEP, niepełny miesiąc, dodatek wyrównawczy).
