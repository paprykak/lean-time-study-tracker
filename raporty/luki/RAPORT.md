# Pakiet „luki”: raport (2026-11-15)

Gałąź `fabryka/luki`. Stan: WIP (badanie popytu gotowe, narzędzia w budowie).

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
