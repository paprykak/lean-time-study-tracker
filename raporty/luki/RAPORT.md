# Pakiet „luki”: raport (2026-11-15)

Gałąź `fabryka/luki` (ostatni commit: ten z dopiskiem „pełny check zielony”). Dwa nowe narzędzia: `/narzedzia/l4-wstecz`
(kategoria „wynagrodzenie”) i `/narzedzia/odmowa-nadgodzin` („czas pracy”). Proces: badanie popytu, badacz prawa (teksty
z API Sejmu w `.cache/narzedzia/prawo/`, nowelizacje po tekstach jednolitych sprawdzone), budowniczy, weryfikator prawny
i weryfikator kodu/UX (niezależnie, pliki i teksty przepisów bez wniosków), audytor. Wynik: `npm run -s check:szybki`
EXIT 0 (2540 testów jednostkowych, kontrola SEO produkcji 139 stron bez błędów) i `BEZ_WEBKIT=1 npm run check` EXIT 0
(E2E 2461 zaliczonych, 355 pominiętych z założenia, 9,1 min; Lighthouse 7 adresów; kontrola SEO testowa 150 i produkcji 139 stron bez błędów). Zrzuty formularza i wyniku 412 i 320 px: `raporty/luki/zrzuty/` (bez przewijania w bok, nic nie ucięte).

## Badanie popytu

Źródło: podpowiedzi Google (`suggestqueries.google.com`, `hl=pl`, `gl=pl`), pobrane 15.11.2026 r. skryptem
`raporty/luki/zbierz.py`: 21 fraz z hali (pracodawca, praca, wypłata, L4, urlop, umowa, zwolnienie, BHP, wózek, magazyn,
zmiana, nocka, nadgodziny, ZUS, agencja pracy, cudzoziemiec, emerytura, odprawa, kara, PIP, sąd pracy), każda sama
i z dopiskami „czy”, „ile”, „kiedy”, „czy wolno”, „czy muszę” przed i po niej: 231 zapytań, 1484 podpowiedzi, 1331 unikalnych
(`podpowiedzi-baza.json`). Każdą podpowiedź przepuściłem przez wyszukiwarkę serwisu (`szukaj()` z `src/lib/szukaj-narzedzi.ts`
na indeksie z `indeksNarzedzi()`, 114 narzędzi); wynik z pierwszym trafieniem i punktami w `wyszukiwarka-podpowiedzi.txt`.
Punkty 1xx oznaczają trafienie jednego słowa, czyli zwykle brak odpowiedzi. Dla skupisk bez narzędzia druga sonda
(17 fraz, `podpowiedzi-sonda.json`) sprawdziła, czy popyt się potwierdza. Skupiska liczy `skupiska.py` (wyrażenia regularne
na tekście bez polskich znaków).

Większość podpowiedzi to sprawy spoza serwisu (magazyn energii, odprawa na lotnisku, karaluchy, zmiana czasu, oferty pracy)
albo sprawy, na które narzędzie już odpowiada (płatne L4, ile urlopu, nadgodziny 50/100%, odprawa, okres wypowiedzenia).

### Ranking spraw bez narzędzia

| # | Sprawa | Podpowiedzi (baza + sonda) | Po odjęciu szumu | Przepis w tle | Policzyć / sprawdzić | Dziś w serwisie |
|---|---|---|---|---|---|---|
| 1 | L4 wstecz, od kiedy może zacząć się zwolnienie, zawiadomienie pracodawcy, czy dostarczać L4, kiedy pracodawca je widzi | 30 + 31 | 57 (bez „VAT”, „WF”, „dyscyplinarne”, „zwolnienie z pracy z datą wsteczną”) | § 7 rozp. Dz.U. 2015 poz. 2013; § 2–3 rozp. Dz.U. 2014 poz. 1632; art. 55, 55a, 58, 62 ustawy zasiłkowej; art. 108 Kp | tak: daty (3 dni wstecz, 4. dzień po badaniu, drugi dzień nieobecności) | brak: `co-wolno-na-l4` i `kalkulator-l4` nie mówią o dacie wstecznej ani o zawiadomieniu; wyszukiwarka daje `badania-lekarskie-w-pracy` |
| 2 | Nadgodziny: czy muszę zostać, czy można odmówić, kto nie może pracować w nadgodzinach, limity | 27 + 27 | 50 (bez „po angielsku” i nadgodzin nauczycieli) | art. 100 § 1, 131–133, 151 § 1–4, 151⁴, 178, 203 Kp; art. 15 ust. 3 i 16 ustawy o rehabilitacji | tak: sprawdzenie z przepisu + limit roczny i odpoczynek dobowy | częściowo: FAQ o limicie 150 h w `kalkulator-nadgodzin`; o obowiązku, odmowie i grupach chronionych nic |
| 3 | Urlop: czy pracodawca może odmówić albo wysłać na urlop, 14 dni z rzędu, do końca roku, urlop na żądanie | 26 + 20 | ok. 42 (bez urlopu rodzicielskiego, okolicznościowego, bezpłatnego) | art. 161–168, 167² Kp | częściowo (sprawdzenie, mało rachunku) | częściowo: `kalkulator-urlopu` (FAQ o 4 dniach na żądanie, zdanie o 14 dniach), `zalegly-urlop`, `urlop-w-okresie-wypowiedzenia` |
| 4 | Spóźniona albo niewypłacona pensja: odsetki | 5 + 27 | ok. 28 (bez „800 plus”, „bezumowne korzystanie”) | art. 85 Kp, art. 481 KC, obwieszczenia o odsetkach ustawowych | tak: odsetki za każdy dzień opóźnienia | brak rachunku: `termin-wyplaty-wynagrodzenia` podaje termin i grzywnę |
| 5 | PIP: kontrola, skarga anonimowa, czas na odpowiedź | 23 + 0 | 23 | ustawa o PIP, KPA | słabo (mało liczb) | częściowo: `sad-pracy-czy-pip` |
| 6 | Służba BHP i komisja BHP: od ilu pracowników | 8 + 10 | 18 | art. 237¹¹–237¹² Kp, rozporządzenie o służbie BHP | tak: progi pracowników | brak |
| 7 | Agencja pracy: ile zabiera z wypłaty, opłaty | 15 + 0 | 15 | zakaz opłat od osób kierowanych do pracy | nie: marża agencji nie wynika z przepisu | brak |
| 8 | Sąd pracy: ile trwa sprawa | 12 + 0 | 12 | brak terminu w KPC | nie da się policzyć | brak |

Zbudowane: pozycje 1 i 2 (najwięcej podpowiedzi, przepis z liczbami, pełny rachunek). Rekomendacja na następną rundę:
pozycja 4 (odsetki za spóźnioną pensję: popyt potwierdzony sondą, w tym trzy podpowiedzi „kalkulator”, rachunek w całości
z przepisu i obwieszczeń o stopie odsetek) i pozycja 6. Pozycja 3 to w większości akapity w istniejących narzędziach urlopowych
(niżej, „Dla orkiestratora”).

## Narzędzia

### `/narzedzia/l4-wstecz`: L4 wstecz i zawiadomienie pracodawcy
Formularz: dzień wizyty u lekarza, pierwszy dzień nieobecności w pracy, lekarz (inny niż psychiatra albo psychiatra). Wynik:
czy zwolnienie może objąć ten dzień (3 dni wstecz, psychiatra dłużej, dzień badania albo następny, 2.–4. dzień po wizycie
tylko przy dniach wolnych albo w trakcie wcześniejszego L4, później nie), najwcześniejszy i najpóźniejszy początek, do kiedy
zawiadomić pracodawcę (drugi dzień nieobecności, uprzedzenie przy przyczynie znanej z góry, termin minął), uwaga, gdy ten
dzień to sobota, niedziela albo święto. Wyjaśnienie: szpital (§ 4 ust. 2, § 10), sposób zawiadomienia, kara z art. 108 § 1 Kp,
e-ZLA, wydruk i papierowe zaświadczenie (komu i kiedy dostarczyć).
Przepisy: § 4 ust. 2, § 6 ust. 1, § 7 ust. 1–4, § 10 rozporządzenia z 10.11.2015 r. (Dz.U. 2015 poz. 2013, bez zmian; podstawa
art. 59a ustawy zasiłkowej bez zmian); § 2 ust. 1–3, § 3 pkt 1 rozporządzenia o usprawiedliwianiu nieobecności (t.j. Dz.U. 2014
poz. 1632, bez późniejszych zmian); art. 55 ust. 1–2 i 4, 55a ust. 6, 7, 9, 58 ust. 1 i 5, 62 ust. 1–2 ustawy zasiłkowej
(t.j. Dz.U. 2026 poz. 854; zmiany 2026 poz. 26, 441, 1123 tych przepisów nie dotyczą); art. 108 § 1 Kp (t.j. 2026 poz. 1245).

### `/narzedzia/odmowa-nadgodzin`: czy można odmówić nadgodzin
Formularz: powód (szczególne potrzeby albo awaria i akcja ratownicza), grupy chronione (ciąża, dziecko do 8 lat i zgoda,
poniżej 18 lat, niepełnosprawność ze zgodą lekarza albo pilnowaniem, NDS/NDN), godziny zmiany, koniec pracy, następna
zmiana, nadgodziny w roku i limit. Wynik: zakaz / nie tak długo / tylko za zgodą / co do zasady musisz / to nie nadgodziny,
z powodami, nadgodziny dziś, najpóźniejszy koniec pracy (11 h odpoczynku w dobie albo limit roczny), limit.
Przepisy: art. 100 § 1, 128 § 3 pkt 1, 129 § 1, 131 § 1, 132 § 1–3, 133, 140¹, 151 § 1–5, 151¹–151², 151⁴, 178 § 1–2, 189¹,
203 § 1 Kp (t.j. Dz.U. 2026 poz. 1245, bez późniejszych zmian tych przepisów); art. 15 ust. 1–3 i 16 ust. 1 ustawy
o rehabilitacji (t.j. Dz.U. 2026 poz. 884; zmiana 2026 poz. 26 dotyczy tylko art. 5).

Rejestry (tylko dopisane): `src/data/narzedzia.ts` (dwa wpisy przed `przerwy-w-pracy`), `src/data/prawo.ts` (nowe
`zaswiadczeniaLekarskie`, `usprawiedliwianieNieobecnosci`, `zasilkowaZaswiadczenia`), `src/data/sprawy.ts` (hasła z podpowiedzi),
`STAN.md` (jedna linijka). Test wyszukiwarki w obie strony: `src/lib/narzedzia/luki-wyszukiwarka.test.ts` (21 zapytań).
Niezależny rachunek: `raporty/luki/rachunek_l4.py`, `raporty/luki/rachunek_nadgodziny.py`.

## Interpretacje (opisane w „Jak liczymy”)
- Dni z § 7 liczone kalendarzowo (rozporządzenie odróżnia dni od dni wolnych od pracy; § 4 ust. 1).
- „Drugi dzień nieobecności” = dzień po pierwszym, także gdy wypada w dzień wolny według grafiku (najwcześniejsza możliwa
  data). Bez przesunięcia z art. 115 KC: przepis wskazuje dzień nieobecności, a nie termin liczony w dniach (decyzja do
  potwierdzenia przez orkiestratora, niżej).
- § 2 ust. 3 dosłownie odsyła do „terminu przewidzianego w ust. 1”; stosujemy go do terminu z ust. 2 (korzystniej).
- Czy e-ZLA zastępuje zawiadomienie z § 2 ust. 2: przepis nie mówi, więc bezpieczniej zawiadomić osobno.
- Odpoczynek dobowy w dobie od startu dzisiejszej zmiany; najpóźniejszy koniec = min(start + 13 h, następna zmiana − 11 h),
  a przy szczególnych potrzebach także koniec zmiany + pozostały limit.
- Nadgodziny dziś = koniec pracy − koniec zmiany z grafiku (przy zmianie krótszej niż 8 h ostrożnie, z uwagą o art. 129 § 1).
- „Szczególnych potrzeb” narzędzie nie ocenia (przepis ich nie definiuje).

## Weryfikacje i audyt
- Weryfikator prawny: 1 błąd (dopisek „11 h przed następną zmianą”, gdy granicą jest koniec doby), 8 nieścisłości (wyjątek
  szpitalny, brak „niezwłocznie”, warunki § 7 ust. 2 w komunikacie „za późno”, art. 62 ust. 2, skutki niezawiadomienia,
  hierarchia z art. 151 § 4, „rodzic” zamiast „wychowujący”, art. 15 ust. 1–2) i drobiazgi. Poprawione, z testami.
- Weryfikator kodu/UX: 2 błędy (podwójna kropka po „r.”, puste pole limitu liczone jako 0 h), uwagi (zakaz przy braku
  nadgodzin, awaria przy grafiku bez 11 h, „Pilne potrzeby” zamiast „szczególnych”, mieszanie dnia wolnego z kalendarzem,
  łagodniejsze „uprzedź”, etykieta po błędzie, oba złe pola liczbowe, zależne pola wyboru z wcięciem), luki w E2E. Poprawione.
- Audytor: 3,22 mln porównań z niezależnym modelem w Pythonie (L4 383 670, godziny 2 764 800, werdykty 73 728), 0 rozbieżności;
  1 błąd prawny (art. 189¹ Kp: przy dwojgu pracujących rodzicach z ochrony art. 178 § 2 korzysta jedno, a FAQ mówiło odwrotnie),
  3 nieścisłości (limit pomijany w polu „Najpóźniej do”, uwaga o tej samej dobie przy „brak nadgodzin”, zmiana krótsza niż 8 h),
  drobiazgi (odmiana dnia tygodnia po „najpóźniej”, „brakiem lub nieobecnością domowników”, art. 178 § 2 przy „Nie tak długo”,
  `noscript`). Wszystko poprawione z testami, poza punktem o art. 115 KC (niżej).

## Dla orkiestratora
- Art. 115 KC przy zawiadomieniu o nieobecności (§ 2 ust. 2): audytor wskazał konwencję „Zdąż do” / „według art. 115 KC”
  (DECYZJE.md, 2026-11-15). Nie wdrożyłem jej: to dzień nieobecności, nie termin w dniach, zawiadomienie bywa telefoniczne,
  a zdania `ZDANIE_ART_115` mówią o pismach. Narzędzie pokazuje jedną, najwcześniejszą datę i mówi dlaczego. Do decyzji.
- Urlop („czy pracodawca może odmówić / wysłać na urlop”, „14 dni”, „na żądanie czy można odmówić”, ok. 42 podpowiedzi):
  nadaje się na akapity i FAQ w `kalkulator-urlopu` (art. 167² i odmowa urlopu na żądanie, art. 162, art. 163–164), a nie na
  nowe narzędzie; pakiet nie rusza cudzych stron.
- Wyszukiwarka: „ile zapłacą za nadgodziny” daje na pierwszym miejscu `przedawnienie-wynagrodzenia` (sprzed pakietu);
  „czy nocka jest więcej płatna”, „czy na nockach zarabia się więcej” nie znajdują `dodatek-za-prace-w-nocy`, a „kiedy umowa
  na czas nieokreślony” trafia w `okres-wypowiedzenia` zamiast `umowa-na-czas-okreslony` (hasła do cudzych wpisów).
- Następna runda: odsetki za spóźnioną pensję (pozycja 4) i służba BHP (pozycja 6).

## Czego nie sprawdzono
- Orzecznictwo: SAOS nie odpowiadał (przekroczony czas); strony nie powołują się na orzeczenia. Do sprawdzenia ręcznie: linia
  SN o odmowie pracy w nadgodzinach (skutki naruszenia art. 100 § 1) i o „szczególnych potrzebach pracodawcy” (stałe
  planowanie nadgodzin).
- gov.pl (strona MRPiPS „Praca nadliczbowa”) zrywa połączenie z automatów; PIP i ZUS (status e-ZLA „do wyjaśnienia”,
  teleporada jako „bezpośrednie badanie”) nie były czytane.
- iPhone (WebKit) tylko w CI; prawdziwy czytnik ekranu nie był używany (sprawdzone atrybuty ARIA).

## Sprawy dla Patryka
1. Decyzja: czy przy zawiadomieniu o L4 pokazywać drugą datę według art. 115 KC (dziś jedna, najwcześniejsza).
2. Ręcznie, gdy SAOS wróci: orzeczenia SN o odmowie nadgodzin i „szczególnych potrzebach” (czy dopisać je do FAQ).
