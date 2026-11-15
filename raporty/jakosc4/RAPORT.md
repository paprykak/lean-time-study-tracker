# Audyt jakości 4: raport (2026-11-15)

Niezależny audyt narzędzi z rundy 8: nowe `co-wolno-na-l4` (główny cel) oraz zmienione w rundzie 8 `okres-wypowiedzenia`,
`kalkulator-odprawy` (orzecznictwo SN), `przedawnienie-wynagrodzenia`, `zalegly-urlop`, `kara-porzadkowa`,
`informacja-o-warunkach-zatrudnienia` (konwencja art. 115 KC) i wspólna `terminPracownika` w `terminy.ts`. Trzy partie
(A: L4, B: wypowiedzenie, odprawa, kara, C: przedawnienie, zaległy urlop, informacja, terminy.ts). Każdy audytor dostał
pliki narzędzia i teksty przepisów z API Sejmu (z nowelizacjami po tekstach jednolitych i datami wejścia w życie), bez
raportów zespołów (`raporty/l4`, `raporty/terminy`, `raporty/orzecznictwo`) i bez ich wniosków. Każde znalezisko sprawdził
drugi, niezależny podagent. Poprawione są tylko znaleziska potwierdzone albo częściowo potwierdzone, w wersji weryfikatora,
każde z testem, który bez poprawki nie przechodzi (w L4 i hasłach wyszukiwarki sprawdzone cofnięciem poprawki); wyjątkiem są luki w testach, które
zabezpieczają poprawny dziś kod. Zasady: `WSPOLNE.md`, `WERYFIKATOR.md`; surowe raporty: `<partia>.json` i `<partia>-wer.json`.

Wynik: `npm run -s check:szybki` EXIT 0 i `BEZ_WEBKIT=1 npm run check` EXIT 0 (E2E: 2388 zaliczone, 346 pominięte; testy
jednostkowe: 2311 w 140 plikach). Zrzuty z telefonu (320 i 412 px, cała strona, wszystkie 7 zmienionych stron, zegar
15.11.2026) są w `zrzuty/` (`co-wolno-na-l4-320` jako PNG, bo strona jest wyższa niż limit WebP). Na żadnej stronie nic
nie jest ucięte, `scrollWidth` = szerokość okna, a żadna opcja list wyboru nie jest szersza od pola.

## Zadanie dodatkowe: `przesunZDniaWolnego` → `terminPracownika` w co-wolno-na-l4

`terminOdwolania` i zastrzeżenia do protokołu liczą teraz wspólną `terminPracownika` (ta sama konwencja dwóch dat co
w innych narzędziach); `przesunZDniaWolnego` w `termin-odwolania.ts` bez zmian. Różnica nie była kosmetyczna: na
datach 2000–2100 obie funkcje dawały inny koniec w 893 dniach (wszystkie soboty przed 1.01.2017 r., art. 21 ustawy
Dz.U. 2016 poz. 2255, i 10–12.11.2018 r.), a formularz przyjmuje daty od 2000 r. Testy: A-1 i A-9 w tabeli.

## Wynik weryfikacji

Audytorzy zgłosili 39 znalezisk, weryfikatorzy dodali 3 nowe (B-wer-1–3). Z 42: 18 potwierdzonych, 23 częściowo
potwierdzonych, 1 odrzucone (A-7). To 37 błędów i 4 luki w testach:

| Narzędzie | Błędy | Luki w testach |
|---|---|---|
| co-wolno-na-l4 | 7 | 1 |
| przedawnienie-wynagrodzenia | 9 (w tym C-11, wspólne z informacją) | 1 |
| kalkulator-odprawy | 7 | 1 |
| okres-wypowiedzenia | 6 (+ B-6, wspólne z odprawą) | 0 |
| zalegly-urlop | 4 | 0 (C-16: dopisany test zegara) |
| informacja-o-warunkach-zatrudnienia | 3 (w tym C-11) | 0 |
| kara-porzadkowa | 2 | 1 |
| terminy.ts (`terminPracownika` i otoczenie) | 0 (niezależny kalendarz: 9496 dni, 0 rozbieżności) | 0 |

## Tabela znalezisk

| ID | Narzędzie | Zdanie albo przypadek | Przepis | Potwierdzenie | Poprawka | Test |
|---|---|---|---|---|---|---|
| A-1 | co-wolno-na-l4 | odwołanie od decyzji z 13.07.2016 r.: „termin upłynął 16 sierpnia 2016 r.” (sobota przed 2017 r.); 12.10.2018 r. bez przesunięcia z 12.11.2018 r. | art. 115 KC, art. 21 Dz.U. 2016 poz. 2255; ustawa z 2018 r. o 12.11.2018 | potwierdzone (888 rozbieżności z modelem w Pythonie) | `terminPracownika` zamiast `przesunZDniaWolnego` | `co-wolno-na-l4.test.ts` describe('terminy'): 2016-07-13, 2018-10-10/11/12 |
| A-2 | co-wolno-na-l4 | zastrzeżenia: protokół 7.11.2026, 15.11: „Termin minął 1 dzień temu”, choć koniec w sobotę i strona sama pisze, że przepis nie rozstrzyga | art. 68e ust. 4 ustawy zasiłkowej; art. 110–111, 115 KC; konwencja z DECYZJE.md | potwierdzone | dwie daty („Zdąż do” i według art. 115 KC) ze zdaniem o art. 110 KC; status z fazą („Pierwsza data minęła…”); „Jak liczymy” i komentarz | unit (5 dat, status, tekst, Wigilia 2026) i E2E |
| A-3 | co-wolno-na-l4 | w dniu „zdąż do” wynik chował tę datę, a „Nie zwlekaj: to ostatni dzień.” stało przy „Zostały 2 dni” | konwencja `fazaTerminu` | potwierdzone | status `stanTerminuPracownika` jak `fazaTerminu`, „przypadł”, bez „Nie zwlekaj” | unit: 11.11, 12.11, 14.11, 15.11.2026 |
| A-4 | co-wolno-na-l4 | zwolnienie 20.12.2026–10.01.2027, praca w drugiej firmie 5.01.2027: „Tylko bez zwolnienia z tej pracy” bez słowa o dacie wystawienia | art. 17 ust. 1c–1d, art. 43 pkt 3 Dz.U. 2026 poz. 26 | potwierdzone (niska) | warunek: zwolnienie wystawione przed 1.01.2027 r. obejmuje każdy tytuł | unit (przełom roku i 2.01.2027) |
| A-5 | co-wolno-na-l4 | „Gdy zasiłek wypłaca pracodawca, decyzję ZUS dostaniesz po wniosku o ustalenie uprawnień” | art. 68 ust. 1b i 1e, art. 68e ust. 7, art. 63 ust. 1 | potwierdzone | po kontroli rozstrzyga ZUS; wniosek z art. 63 przy odmowie pracodawcy | unit |
| A-6 | co-wolno-na-l4 | „siłownia/remont/spacer na l4”, „maile na zwolnieniu lekarskim” poza piątką | (wyszukiwarka) | częściowo (bez „impreza na L4”: zabierało „wypadek na imprezie firmowej”) | 6 haseł | unit w obie strony |
| A-7 | co-wolno-na-l4 | „odwołanie od decyzji ZUS” wygrywa przy rencie i wypadku | (wyszukiwarka) | odrzucone: strony renty i wypadku nie mówią o odwołaniu, zawężenie nic nie zmienia | — | — |
| A-8 | co-wolno-na-l4 | wynik nazywa święta z ustawy o dniach wolnych, rejestr jej nie wymienia | ustawa o dniach wolnych | częściowo (bez wpisów dla rozporządzenia z 1999 r. i t.j. 2025) | `dniWolne` w `przepisy` | unit |
| A-9 | co-wolno-na-l4 | brak przypadków: sobota przed 2017, 12.11.2018, Wigilia 2024/2025, 1.01.2027, 28.02.2027 | — | luka w testach | 8 dat odwołania i 5 zastrzeżeń | unit |
| B-1 | kalkulator-odprawy | po błędnej pensji zostawały liczba pensji, limit i uwaga z poprzedniego wyniku | (UX) | potwierdzone | gałąź błędu czyści wszystkie pola i uwagę | E2E `narzedzie-odprawy.spec.ts` |
| B-2 | okres-wypowiedzenia | FAQ „Czy można skrócić okres wypowiedzenia?” bez art. 36¹ (skrócenie 3 miesięcy do 1 przy upadłości i likwidacji), z art. 36 § 5, który wydłuża | art. 36¹ § 1, art. 37 § 2 pkt 2, art. 36 § 5 Kp | potwierdzone | art. 36¹ w FAQ 5, art. 36 § 5 przeniesiony do FAQ 1 | E2E |
| B-3 | okres-wypowiedzenia, kalkulator-odprawy | „Od 2026 r. wlicza się też okresy umów zlecenia…” (3 miejsca) | art. 8–10 ustawy Dz.U. 2025 poz. 1423, art. 302¹ § 8 i 11 Kp | potwierdzone | 1 maja 2026 r. w firmach prywatnych, 1 stycznia w sektorze publicznym, zaświadczenie ZUS | E2E („Od 1 maja 2026 r.”) |
| B-4 | okres-wypowiedzenia | 3 dni robocze: „koniec: art. 30 § 2¹” | art. 30 § 2¹ Kp (tylko tygodnie i miesiące) | potwierdzone | bez dopisku przy dniach roboczych | E2E |
| B-5 | kalkulator-odprawy | „porozumienie stron z jego inicjatywy” | art. 10 ust. 1, art. 1 ust. 2 ustawy o zwolnieniach grupowych | potwierdzone | bez „z jego inicjatywy” | E2E (tekst nieobecny) |
| B-6 | kalkulator-odprawy, okres-wypowiedzenia | rejestr bez ustawy o rynku pracy, ustawy o stażu i KC | (spójność) | potwierdzone | `rynekPracy`, `zmianaStazu2025`, `kodeksCywilny` | `tsc` |
| B-7 | okres-wypowiedzenia | brak linków do odwołania, urlopu na wypowiedzeniu, odprawy | (zasada 11) | częściowo (bez ochrony przedemerytalnej) | 3 linki w wyjaśnieniu | E2E |
| B-8 | kalkulator-odprawy | brak linku do okresu wypowiedzenia i ekwiwalentu | (zasada 11) | częściowo (inne zdanie przy ekwiwalencie) | 2 linki | E2E |
| B-9 | kara-porzadkowa | brak linku do odpowiedzialności materialnej | (zasada 11, zadanie pakietu) | potwierdzone | akapit z linkiem | E2E `narzedzie-kara.spec.ts` |
| B-10 | okres-wypowiedzenia | „wymowienie” bez wyników, „wolne na poszukiwanie pracy” 5. | (wyszukiwarka) | częściowo (zestaw weryfikatora, 129 zapytań) | hasła i pytanie FAQ 1 „…na czas określony i nieokreślony?” | `jakosc4-wyszukiwarka.test.ts` w obie strony |
| B-11 | kalkulator-odprawy | „odprawa po 8 latach”, „odprawa przy porozumieniu stron” bez kalkulatora | (wyszukiwarka) | częściowo (bez haseł, które zabierały „redukcja etatów” i „porozumienie stron”) | 7 haseł | jw. |
| B-12 | kara-porzadkowa | „dostałem naganę” 3. miejsce | (wyszukiwarka) | częściowo (formy z „dostałem/dostałam”) | 5 haseł | jw. |
| B-13 | kara-porzadkowa | sprzeciw w sobotę przed 2017 r. i w Wigilię bez testu | art. 115 KC | luka w testach | 5 przypadków | `kara-porzadkowa.test.ts` |
| B-14 | kalkulator-odprawy | progi stażu z 29.02 i 31.08, limit ±0,01 zł, E2E błędu | art. 8 ustawy, art. 112 KC | luka w testach | 6 progów, 3 kwoty | `odprawy.test.ts`, E2E jak B-1 |
| B-wer-1 | okres-wypowiedzenia | „tak samo wyroki II PK 12/11 i I PK 2/13” | orzecznictwo SN | nowe (przytoczenia w innych wyrokach podają inne tezy; SAOS w przerwie) | na stronie tylko I PKN 34/99 (teza potwierdzona przytoczeniem SO w Poznaniu, VII U 1955/14); komentarz w `wypowiedzenie.ts`; nazwy testów bez sygnatury | E2E (sygnatury nie ma) |
| B-wer-2 | kalkulator-odprawy | „W wyroku I PK 139/04, na tle ustawy z 1989 r.” | orzecznictwo SN | nowe (przytoczenia różnią się co do ustawy) | bez „na tle ustawy z 1989 r.”, z datą 25 stycznia 2005 r. | — (treść) |
| B-wer-3 | kalkulator-odprawy | „co najmniej 20 osób” (FAQ i formularz) | art. 1 ust. 1, art. 10 ust. 1 ustawy: „20 pracowników” | nowe | „20 pracowników” | E2E |
| C-1 | przedawnienie-wynagrodzenia | lista „Kolejne terminy” z datami według art. 115 KC bez ostrzeżenia (domyślny widok 15.11.2026) | decyzja z 2026-11-15 (ostrzeżenie przy przedawnieniu) | częściowo (jedna wspólna stała) | `UWAGA_ART_115_LISTA` w `terminy.ts`, `uwagaListy` pod listą w SSR i skrypcie | unit i E2E |
| C-2 | przedawnienie-wynagrodzenia | „inna należność”: „14 listopada 2026 r. (wczoraj); według art. 115 KC: 16 listopada” bez stanu; „przedawnia się … 1400 dni temu” | art. 291 § 1, 292 Kp | potwierdzone | pole `inna` z fazą terminu i ostrzeżeniem, etykieta „koniec przedawnienia” | unit (4 przypadki), E2E |
| C-3 | zalegly-urlop | wiersze z datą według art. 115 KC bez ostrzeżenia, gdy główna data to dzień roboczy | jw. | częściowo | ta sama stała w `zdanie` | unit i E2E (zmieniony stary test, który utrwalał brak) |
| C-4 | przedawnienie-wynagrodzenia | wypłata 1. dnia „w tym samym miesiącu”: brak wypłaty za styczeń cofniętej na grudzień (31.12.2019) | art. 85 § 3 Kp | częściowo (niska: pozycja poza widoczną piątką) | pętla do roku + 1 | unit (2019-12-31, 2017-12-29, 2019-12-30) |
| C-5 | zalegly-urlop | urlop za 2000–2010 r.: „udzielić do 30 września” | art. 168 Kp: „30 września” od 1.01.2012 r. (Dz.U. 2011 nr 232 poz. 1378, art. 1 pkt 1, art. 29), wcześniej koniec I kwartału | potwierdzone | `MIN_ROK = 2011` | unit (2010 błąd, 2011 → 30.09.2012), E2E |
| C-6 | przedawnienie-wynagrodzenia | FAQ: „a potem termin biegnie od nowa (art. 295)” | art. 295 § 2 Kp | potwierdzone | po pozwie dopiero po zakończeniu sprawy | E2E |
| C-7 | przedawnienie-wynagrodzenia | „wyrokiem sądu pracy albo ugodą zawartą przed sądem” | art. 291 § 5 Kp | potwierdzone | orzeczenie (wyrok albo nakaz), ugoda przed sądem pracy lub komisją pojednawczą | E2E |
| C-8 | przedawnienie-wynagrodzenia | „przesuwamy na wcześniejszy dzień pracy” bez zdania, że przepis tego nie rozstrzyga | art. 85 § 3 Kp; zasada 2 | potwierdzone | zdanie w „Jak liczymy” | E2E |
| C-9 | przedawnienie-wynagrodzenia | „Najstarsza wypłata, o którą możesz wystąpić” | art. 292 Kp | częściowo | „Najstarsza wypłata przed przedawnieniem”, lead „który jeszcze się nie przedawnił” | E2E |
| C-10 | informacja-o-warunkach-zatrudnienia | „…takie same; nie dotyczy to prac szczególnie niebezpiecznych” (czyta się jak oba wyjątki) | art. 229 § 1¹ pkt 1–2 Kp | potwierdzone | „ten drugi wyjątek nie dotyczy…” | E2E |
| C-11 | przedawnienie, informacja | brak linków do sądu pracy i PIP, zaległego urlopu, badań, monitoringu | (zasada 11) | częściowo (bez kontroli trzeźwości, ekwiwalentu, wychowawczego) | 4 linki | E2E |
| C-12 | zalegly-urlop | „przedawnienie urlopu”, „stary urlop” poza piątką | (wyszukiwarka) | częściowo (bez „nie dają urlopu”) | 3 hasła | `jakosc4-wyszukiwarka.test.ts` w obie strony |
| C-13 | przedawnienie-wynagrodzenia | „do kiedy mogę pozwać pracodawcę o kasę” poza piątką | (wyszukiwarka) | częściowo: poprawka wymaga hasła w `sad-pracy-czy-pip` | **nie poprawione** (wpis innego narzędzia, niżej dla orkiestratora) | — |
| C-14 | informacja-o-warunkach-zatrudnienia | „na czarno”, „dokumenty na start w pracy”, „zapoznanie z regulaminem pracy”, „kiedy dostanę umowę” | (wyszukiwarka) | częściowo | 4 hasła informacji, „kara z regulaminu” dla kary; hasło dla `wynagrodzenie-za-niepelny-miesiac` dla orkiestratora | jw. |
| C-15 | zalegly-urlop | rejestr bez ustawy o dniach wolnych | (spójność) | potwierdzone | `dniWolne` | — (dane) |
| C-16 | zalegly-urlop | przesuwanie domyślnych lat po Nowym Roku bez testu z zegarem | — | luka w testach (częściowo: informacja i przedawnienie już mają) | E2E z zegarem 4.01.2027 (lata 2025 i 2026, 727 dni) | `narzedzie-zalegly-urlop.spec.ts` |

Bez zmian prawnych (sprawdzone w tekstach): art. 17 ustawy zasiłkowej w trzech brzmieniach (t.j. Dz.U. 2025 poz. 501,
t.j. Dz.U. 2026 poz. 854, ust. 1d–1e z Dz.U. 2026 poz. 26 od 1.01.2027 r.) i przepisy przejściowe art. 39–43 tej ustawy;
art. 30, 34, 36, 37 Kp; art. 8 i 10 ustawy o zwolnieniach grupowych; art. 108–113 Kp; art. 291–295 Kp; nowelizacje KPC
po t.j. (Dz.U. 2026 poz. 473, 830, 1003, 1046, 1296) nie dotyczą art. 165 i 477⁹. `terminy.ts`: `SOBOTA_ART_115_OD`
(1.01.2017 r., art. 21 i 35 Dz.U. 2016 poz. 2255), Wigilia od 2025 r. (Dz.U. 2024 poz. 1965, w mocy od 1.02.2025 r.)
i 12.11.2018 r. poprawne; rodzaj terminu (`sad`/`pracodawca`/`przedawnienie`) dobrany właściwie we wszystkich użyciach.

Niezależny rachunek w Pythonie (własny kalendarz świąt, Wielkanoc z algorytmu): L4 36 859 dat (zastrzeżenia 0
rozbieżności, odwołanie 888 = A-1); wypowiedzenie 4088 przypadków, odprawa 2030, kara 3226, przedawnienie 32 564 list
wypłat (36 rozbieżności = C-4) i 9496 końców terminu, zaległy urlop 116 lat × dni sprawdzenia i 3924 okresy
wychowawczego, informacja 4749 dat startu, `terminPracownika` 9496 dni (soboty przed i po 1.01.2017 r., Wigilia 2024
i 2025, przełom roku, 29 lutego, 12.11.2018 r.): poza wymienionymi 0 rozbieżności.

## Orzeczenia

API SAOS było w „Przerwie technicznej” przez cały audyt (około 25 prób czterech podagentów i orkiestratora między 07:50 a 09:05),
więc żadnego uzasadnienia SN nie przeczytano w SAOS. Weryfikator B przeczytał w Portalu Orzeczeń Sądów Powszechnych:
- IX P 280/20 (SR Szczecin-Centrum, 5.03.2021): zgodne: „13 kwietnia 2020r. był dniem świątecznym (Poniedziałkiem Wielkanocnym), zatem termin do wniesienia sprzeciwu zgodnie z art. 115 k.c. w zw. z art. 300 k.p. upływał w dniu następnym”;
- IX P 666/18 (SR Szczecin-Centrum, 24.02.2020): zgodne (wniosek o sprostowanie świadectwa, 12.11.2018 r. dniem wolnym, art. 115 KC);
- VII Pa 90/16 (SO w Łodzi, 24.05.2016): zgodne: „nie ma możliwości do zastosowania do sprzeciwu … art. 165 § 2 kpc” i sprzeciw musi dotrzeć do pracodawcy.

Sygnatury SN tylko z przytoczeń w innych wyrokach (niesprawdzone w uzasadnieniu): I PKN 34/99 (teza zgodna, zostaje),
I PK 144/11, II PK 340/12, III PK 55/14 (tezy zgodne z przytoczeniami, zostają), II PK 12/11 i I PK 2/13 (przytoczenia
podają inne tezy: usunięte ze strony, B-wer-1), I PK 139/04 (przytoczenia różnią się co do ustawy: B-wer-2). Wyroki IV P
553/24, IV P 24/19, VII P 41/22 i uchwały III CZP 8/03, III CZP 21/23: niesprawdzone. Zapytania do powtórzenia:
`curl -s 'https://www.saos.org.pl/api/search/judgments?caseNumber=II%20PK%2012/11'` (i analogicznie), potem
`/api/judgments/<id>` (pole `data.textContent`).

## Dla orkiestratora (poza zakresem plików pakietu)

- **Wpisy rejestrów poprawione w obrębie narzędzi z pakietu** (dopisane klucze aktów, żadnego cudzego wpisu): `co-wolno-na-l4`
  i `zalegly-urlop` + `dniWolne`, `kalkulator-odprawy` + `rynekPracy`, `zmianaStazu2025`, `okres-wypowiedzenia` + `kodeksCywilny`.
- **Komentarz pakietu „orzecznictwo” w `wypowiedzenie.ts`** mówił „Pełne teksty sprawdzone w API SAOS” dla II PK 12/11
  i I PK 2/13, a przytoczenia w Portalu Orzeczeń MS przypisują im inne tezy (II PK 12/11: kolejne wypowiedzenie w trakcie
  pierwszego, data 6.07 albo 15.07.2011; I PK 2/13: wliczanie wcześniejszego zatrudnienia). Do sprawdzenia, gdy SAOS wróci;
  jeśli tezy się potwierdzą, można je przywrócić.
- Hasła innych narzędzi (sprawdzone przez weryfikatorów na kopii indeksu): `sad-pracy-czy-pip` + 'pozwać pracodawcę' razem
  z `przedawnienie-wynagrodzenia` + 'pozwać o wypłatę' (C-13); `wynagrodzenie-za-niepelny-miesiac` + 'wypłata za pierwszy
  dzień pracy' (C-14); `swiadectwo-pracy` + 'świadectwo pracy po odejściu z pracy', `zwolnienie-na-l4` + 'zwalniają mnie na L4'
  (B-10); `badania-lekarskie-w-pracy` + 'powrót do pracy po zwolnieniu lekarskim' (A-6: „praca na zwolnieniu lekarskim”
  przejmuje dziś także „powrót do pracy po zwolnieniu lekarskim”, wcześniej też trafiało w złe narzędzie).
- `src/lib/szukaj-narzedzi.ts`: „odprawa” daje kalkulator odprawy dopiero 3. (słowo w nazwie innego narzędzia waży więcej
  niż identyczne hasło); nieznane słowo zeruje wynik („kierownik dał mi upomnienie”); remisy rozstrzyga alfabet.
- `ZDANIE_ART_115.pracodawca` (wspólny tekst) powołuje się na IX P 666/18 (świadectwo pracy) także na stronie kary.
- `przesunZDniaWolnego` (`termin-odwolania.ts`) zostaje w `cudzoziemiec-terminy.ts`, `pit-roczny.ts`, `terminWDniach`;
  ma tę samą wadę co A-1 (sobota przed 2017 r., 12.11.2018 r.).
- Kalkulator odprawy: lead i opis z limitem liczone z daty buildu; bez przebudowy po 1.01.2027 r. strona dalej podaje 2026 r.
  (skrypt liczy już 74 250 zł). Płaca minimalna na 2028 r. do dopisania po rozporządzeniu (zwykle wrzesień 2027 r.).

## Czego nie sprawdzono
- Uzasadnienia wyroków SN (SAOS w przerwie, sn.pl blokuje automaty) i uchwała III CZP 21/23; zus.pl (praktyka ZUS przy
  7-dniowym terminie zastrzeżeń w sobotę), EUR-Lex (TSUE C-120/21: teza i data z wiedzy ogólnej).
- Załączniki rozporządzenia Dz.U. 2026 poz. 503 (wzór protokołu i pouczenie o zastrzeżeniach) poza § 1–4.
- Czytnik ekranu na żywo (NVDA, VoiceOver) i WebKit: sprawdzone `ariaSnapshot`, atrybuty i Chromium.
