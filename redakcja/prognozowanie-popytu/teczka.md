# Teczka: Zanim kupisz AI do prognoz, sprawdź, czy pobijasz prognozę naiwną (tytuł roboczy)

Plik `redakcja/prognozowanie-popytu/teczka.md`. Notatki redakcji do jednego artykułu: nie trafiają na stronę.

## 0. Wybór tematu (tryb B, wybór redakcji)
Patryk 2026-11-07: „ok, pisz kolejny tekst od razu. jaki temat?” → redakcja wybiera sama (jak przy OEE) i podaje temat w odpowiedzi.
Powód wyboru:
- Popyt potwierdzony podpowiedziami wyszukiwarki z 2026-11-07: „prognozowanie popytu” (także „model naiwny”, „metody”, „wzór”, „ai”, „logistyka”, „zadania”) i „prognozowanie sprzedaży excel”.
- Dowody klasy A/B istnieją: wyniki konkursów M4 i M5 w recenzowanym International Journal of Forecasting, badania korekt prognoz w firmach. Tekst o OEE nie przeszedł kryterium 3 karty z braku takich badań.
- Czwarty dział potrzebny do bramki startu („Dane i AI”).
- Temat bez związku z pracodawcami Patryka. Przykład nie dotyczy magazynu części samochodowych (SKILL.md, zasada 5).

## 1. Brief
- Czytelnik i jego pytanie: planista, kierownik logistyki, zakupów albo produkcji, dyrektor operacyjny w firmie produkcyjnej lub dystrybucyjnej z 20–250 osobami. Dostaje oferty „prognozowania z AI” z obietnicą mniejszego błędu. Pyta: czy to poprawi nasze prognozy i jak to sprawdzić, zanim zapłacimy?
- Teza: zanim kupisz AI do prognoz, sprawdź, czy Twoja obecna prognoza bije dwie darmowe (naiwną i średnią z czterech okresów), bo na poziomie pojedynczego indeksu przewaga najlepszych metod nad prostymi bywa niewielka, a ręczne korekty planistów poprawiają prognozę tylko w mniej więcej połowie indeksów.
- Co nowego względem wyników wyszukiwania: przegląd 15 polskich stron z czołówki wyników dla „prognozowanie popytu”, „…model naiwny”, „…ai”, „prognozowanie sprzedaży excel” (2026-11-07). Żadna nie każe porównać prognozy z naiwną ani nie mówi o wartości dodanej prognozy (FVA). Tylko jedna (dostawca, 2022) wspomina konkursy M4/M5, wybiórczo. Obietnice „AI zmniejsza błąd o 20–50%” są bez źródła (Netguru, 1.06.2026, przypisuje je McKinsey bez linku; Opsio „do 50%” bez źródła). Żaden poradnik do Excela nie uczy mierzyć błędu. Wyniki angielskie mówią o FVA i benchmarku naiwnym, ale nikt nie pokazuje przewagi zwycięzcy M5 według poziomu hierarchii. Wkład: (1) analiza własna oficjalnego pliku wyników M5 według 12 poziomów: 43% przewagi na poziomie całej sieci, 2,3% na poziomie produktu w sklepie; (2) M4 policzony z pliku wyników: żadna z 5 metod czysto uczenia maszynowego nie pobiła kombinacji statystycznej; (3) test w arkuszu z dwiema darmowymi prognozami i FVA korekt; (4) pytania do dostawcy jako kryterium odbioru pilotażu.
- Format / dział / tematy / długość: Analiza, 2 000–2 800 słów; dział `dane-i-ai`; temat `ai-w-planowaniu`; materiał `test-prognozy` (XLSX); powiązany tekst o OEE (ten sam rys: mierz, zanim porównasz).
- Popyt: podpowiedzi wyszukiwarki z 2026-11-07 (sekcja 0).
- Autor: `redakcja`. Konflikt interesów: redaktor naczelny prowadzi doradztwo w operacjach; tekst nie odsyła do jego usług. Firmy wymienione w tekście (ProLogistica Soft, Netguru) nie mają związku z redakcją.

## 2. Pięć pytań redaktora
1. Teza: jak wyżej. Da się z nią nie zgodzić: dostawcy twierdzą, że AI zmniejsza błąd o 20–50%.
2. Nowość: przewaga AI maleje w miarę schodzenia do pojedynczego indeksu (analiza własna pliku M5), a prosta średnia to poprzeczka, której wiele metod nie przeskakuje. Po polsku nikt tego nie pokazał.
3. Dlaczego teraz: odsetek polskich firm używających AI wzrósł z 8,7% w 2025 r. do 17,8% w 2026 r. (GUS), oferty krążą, a kryterium oceny brak. W tym tygodniu: test 20 indeksów w arkuszu, FVA korekt, pytania do dostawcy.
4. Autorytet: recenzowane wyniki konkursów M4 i M5 (IJF) i oficjalne pliki wyników organizatorów, badania korekt prognoz w firmach (Fildes i in. 2009, Fildes, Goodwin i De Baets 2025), przegląd „Forecasting: theory and practice” (IJF 2022), dane GUS.
5. Za: M5 według poziomów, M4 (czyste ML), Makridakis i in. 2018 (ML gorsze od statystycznych na 1 045 szeregach), FVA 2025. Przeciw i granice: M5 to pierwszy konkurs, w którym wszystkie czołowe metody były czystym ML i istotnie lepsze od benchmarków (przy agregatach przewaga duża); Spiliotis i in. 2022: część metod ML lepsza dla dziennego popytu indeksów; dane M5 to handel detaliczny (73% szeregów produkt–sklep przerywanych), nie produkcja B2B; Fildes i in. 2009: w trzech z czterech firm korekty średnio poprawiały trafność.

## 3. Plan tekstu
- Obietnica: czytelnik w godzinę sprawdzi na własnych danych, czy jego prognoza jest lepsza od dwóch darmowych, czy korekty planistów pomagają, i będzie wiedział, o co zapytać dostawcę AI.
- Trzy rzeczy do zabrania: wgląd (przewaga AI rośnie z poziomem agregacji, na indeksie bywa marginalna; korekty w górę częściej szkodzą), narzędzie (test z dwiema darmowymi prognozami i FVA w arkuszu), kryterium decyzji (kupuj, gdy Twoja prognoza bije średnią z 4 okresów i masz wiele powiązanych indeksów z promocjami i cenami; odbieraj pilotaż na własnych danych względem średniej).
- Zdanie do zapamiętania: „Prognoza, która nie bije średniej z czterech tygodni, nic nie wnosi.”
- Czego czytelnik nie wie: prognoza naiwna; średnia ruchoma; błąd w sztukach (MAE) zamiast MAPE; FVA; poziom hierarchii (sieć, sklep, produkt w sklepie); popyt przerywany; czym były M4 i M5.
- Otwarcie: paradoks z M5 (43% kontra 2%) z liczbami z pliku wyników.
- Sztafeta: Skoro AI wygrała konkurs, to dlaczego nie mam jej kupić? → bo przewaga zależy od poziomu (rysunek) → czy to tylko M5? (M4, PLOS 2018, M5 ML benchmarki) → a może wystarczy, że planista poprawi prognozę systemu? (korekty, FVA) → dlaczego proste metody tak trudno pobić na indeksie (mechanizm) → kiedy AI jednak pomaga (granice) → jak to sprawdzić u siebie (test, arkusz) → o co pytać dostawcę → zamknięcie.
- Zakończenie: powrót do 43% i 2%: zanim podpiszesz umowę, policz własne „2%”.
- Test przekazania: „Zanim kupimy AI do prognoz, sprawdźmy w tym arkuszu, czy nasza prognoza bije zwykłą średnią z czterech tygodni.”

## 4. Źródła
| Nr | Opis | Rodzaj | Siła | Adres | Dostęp | Co wspiera | Ograniczenia |
|---|---|---|---|---|---|---|---|
| m5-wyniki | Scores and Ranks.xlsx, M5 Accuracy (organizatorzy) | Dane publiczne | B | https://github.com/Mcompetitions/M5-methods | 2026-11-07 | przewaga zwycięzcy wg 12 poziomów; benchmarki | jeden zbiór danych (Walmart), miara WRMSSE ważona sprzedażą w dolarach |
| m5 | Makridakis, Spiliotis, Assimakopoulos (2022), IJF 38(4) | Badanie recenzowane | B | doi 10.1016/j.ijforecast.2021.11.013 | 2026-11-07 | opis danych, LightGBM, uczenie na wielu szeregach, zmienne objaśniające, odsetek zespołów lepszych od benchmarków, zastrzeżenia autorów | wersja opublikowana zablokowana dla nas (CAPTCHA); liczby z wersji roboczej X 2020 i z pliku wyników; abstrakt opublikowany sprawdzony |
| m4-wyniki | Evaluation and Ranks.xlsx, M4 (organizatorzy) | Dane publiczne | B | https://github.com/Mcompetitions/M4-methods | 2026-11-07 | 49 zgłoszeń; czyste ML vs Comb i Naive2; ProLogistica Soft 3. miejsce | szeregi z wielu dziedzin, nie tylko popyt |
| m4 | Makridakis i in. (2020), IJF 36(1) 54–74 | Badanie recenzowane | B | doi 10.1016/j.ijforecast.2019.04.014 | 2026-11-07 | opis konkursu | pełny tekst niedostępny dla nas; errata 2021 dotyczy tylko oświadczeń o konflikcie interesów |
| plos | Makridakis, Spiliotis, Assimakopoulos (2018), PLOS ONE 13(3) e0194889 | Badanie recenzowane | B | doi 10.1371/journal.pone.0194889 | 2026-11-07 | 1 045 szeregów M3; ML gorsze; Naive2 lepsza od połowy ML | krótkie szeregi miesięczne |
| fildes2009 | Fildes, Goodwin, Lawrence, Nikolopoulos (2009), IJF 25(1) 3–23 | Badanie recenzowane | B | doi 10.1016/j.ijforecast.2008.11.010 | 2026-11-07 | 60 000 prognoz z 4 firm; małe korekty szkodzą; w górę rzadziej pomagają | tylko abstrakt; wielkości efektów niesprawdzone |
| fva2025 | Fildes, Goodwin, De Baets (2025), IJF 41(2) 649–669 | Badanie recenzowane | A/B | doi 10.1016/j.ijforecast.2024.07.006 | 2026-11-07 | ok. 147 000 prognoz z 6 badań; korekty poprawiają tylko w nieco ponad połowie SKU; w górę częściej szkodzą; duże w dół pomagają | tylko abstrakt (pełny tekst zablokowany) |
| fildes2007 | Fildes, Goodwin (2007), Interfaces 37(6) 570–576 | Badanie recenzowane | C | doi 10.1287/inte.1070.0309 | 2026-11-07 | ankieta 120 prognostów: 25% nie mierzy błędu; 52,8% sprawdza, czy korekty pomagają | wersja robocza; uczestnicy konferencji, deklaracje |
| hyndman | Hyndman, Koehler (2006), IJF 22(4) 679–688 | Badanie recenzowane | B (metoda) | doi 10.1016/j.ijforecast.2006.03.001 | 2026-11-07 | MAPE nieokreślony przy zerowej sprzedaży; skalowanie błędem naiwnej | wersja robocza 2005 |
| ftp | Petropoulos i in. (2022), Forecasting: theory and practice, IJF 38(3) 705–871 | Przegląd lub metaanaliza | A | doi 10.1016/j.ijforecast.2021.11.001 | 2026-11-07 | nowe metody porównuj co najmniej z naiwnymi i ogólnymi (wygładzanie wykładnicze, ARIMA, Theta) | przegląd ekspercki, nie metaanaliza |
| repr | Theodorou i in. (2021), Exploring the representativeness of the M5 competition data, arXiv 2103.02941 | Inne (preprint) | C | https://arxiv.org/abs/2103.02941 | 2026-11-07 | 73,35% szeregów produkt–sklep w M5 przerywanych | preprint współautorów konkursu |
| spiliotis | Spiliotis i in. (2022), Operational Research 22(3) 3037–3061 | Badanie recenzowane | B | doi 10.1007/s12351-020-00605-2 | 2026-11-07 | część metod ML lepsza dla dziennego popytu indeksów | tylko abstrakt |
| gus2026 | GUS (2026), Społeczeństwo informacyjne w Polsce w 2026 r., informacja sygnalna 21.10.2026 | Dane publiczne | A | stat.gov.pl (adres PDF w tabeli roboczej) | 2026-11-07 | 17,8% przedsiębiorstw z AI w 2026, 8,7% w 2025 | przedsiębiorstwa z co najmniej 10 pracującymi |
| netguru | Netguru, blog, K. Rafalski, 1.06.2026 | Raport firmy | D | https://www.netguru.com/pl/blog/prognozowanie-popytu-ai | 2026-11-07 | przykład obietnicy 20–50% bez źródła; ten sam tekst przyznaje 1–2 pkt MAPE | strona dostawcy |
| prologistica | ProLogistica Soft, strona firmy | Raport firmy | D | https://prologistica.pl/ | 2026-11-07 | polska firma (Wrocław), dostawca prognozowania | tylko lokalizacja i profil |

## 5. Rejestr twierdzeń
Wypełniam po napisaniu tekstu (każde zdanie z liczbą: przypis i miejsce w źródle).

## 6. Przeciwdowody i granice
- M5: wszystkie czołowe metody to czyste ML, istotnie lepsze od benchmarków statystycznych (wersja robocza, s. 23); przy agregatach przewaga 21–43% (plik wyników).
- Spiliotis i in. (2022): część metod ML daje lepsze prognozy dziennego popytu indeksów.
- Fildes i in. (2009): w trzech z czterech firm korekty średnio poprawiały trafność, duże korekty pomagały.
- M5 to handel detaliczny (dzienna sprzedaż, 73% szeregów produkt–sklep przerywanych): wynik na poziomie indeksu nie przenosi się wprost na tygodniowy popyt w produkcji B2B. Autorzy M5: wnioski nie dają się uogólnić poza obszar danych.
- Miara M5 waży szeregi sprzedażą w dolarach; zwycięzcy skupiali się na drogich i szybko rotujących produktach.
- Kiedy rama nie działa: popyt przerywany (wiele zer), nowe produkty bez historii, promocje i zmiany cen, które zna tylko planista; wtedy średnia z 4 okresów nie jest uczciwą poprzeczką, a korekty mogą mieć sens.

## 7. Analiza własna i rachunki
- `dane/m5.py` → `dane/m5-wyniki.json`: z pliku Scores and Ranks.xlsx (M5 Accuracy). Zwycięzca YJ_STU WRMSSE 0,520 kontra najlepszy benchmark ES_bu 0,671 (22,4%); według poziomów przewaga nad najlepszym benchmarkiem na danym poziomie: L1 43,2%, … L9 21,4%, L10 4,2%, L11 3,2%, L12 2,3%; 50 najlepszych na L12: od −0,8% do 3,3%. Sprawdzenie drugim sposobem: 22,4% zgadza się z tabelą 3 wersji roboczej (s. 16) i z raportem badacza; WRMSSE zwycięzcy 0,520 i ES_bu 0,671 zgadzają się z tabelą B (s. 43).
- `dane/m4.py` → `dane/m4-wyniki.json`: 49 zgłoszeń; zwycięzca Smyl OWA 0,821 kontra Comb 0,898 (8,6%); 17 zgłoszeń lepszych od Comb, 29 od Naive2; 5 metod czysto ML: 0 lepszych od Comb, 1 lepsza od Naive2; benchmarki ML: RNN 1,48, MLP 1,64. Sprawdzenie: 8,55% w kolumnie „% improvement over Comb” w pliku; liczby zgodne z raportem badacza.
- Arkusz `arkusz/arkusz.py` → `public/pobierz/test-prognozy.xlsx`; `arkusz/test.py` przelicza go w LibreOffice i porównuje z Pythonem (20 wartości zgodnych, zero błędów formuł).

## 8. Zdjęcie
- Frazy (2026-11-07): „warehouse pallet racking stock boxes” (0), „warehouse shelves” (11), „pallet racking” (4), „warehouse inventory” (6), „distribution warehouse interior” (3), „storage racks aisle” (0), „stockroom cartons” (0), „logistics warehouse” (21), „warehouse aisle” (1), „pallets warehouse” (12), „inventory shelves” (16). Stykówki w `zdjecia/`.
- Odrzucone z czołówki i powód:
  - Rawpixel (np. „warehouse shelves” 6, „logistics warehouse” 6, 7, 8, 9): bez konta tylko 1024 px, za mało na zdjęcie główne. Część ma też autora nieznanego, a przy 9 skonfiskowany towar z markami.
  - Konto Shixart1985 w Commons („warehouse shelves” 9, 10, „pallets warehouse” 10): opisane jako praca własna na CC BY 2.0. Opisy wyglądają na wygenerowane automatycznie, a jedno ze zdjęć przypomina znane zdjęcie z serwisu stockowego. Wątpliwość co do licencji, więc odrzucone (zdjecia.md, kryterium 2).
  - „Distribution centre (J Sainsbury's)” (CC BY 2.0, 1901 px): marka sieci w opisie i ryzyko logo w kadrze.
  - „ID Logistics… Briques de soupe I24”: opakowania z czytelnymi markami („Bio”, nazwa producenta).
  - IKEA (pallet racking 4), zdjęcia historyczne czarno-białe (archiwa fińskie, amerykańskie): marka albo zdjęcie nie pokazuje dzisiejszej hali.
- Wybrane: `magazyn-regaly-paletowe`. Strona: https://commons.wikimedia.org/wiki/File:ID_Logistics_Boll%C3%A8ne-_ITM-_%C3%A9picerie_I24.jpg. Autor RhôneA7, praca własna, CC BY 4.0, zdjęcie z 2024-02-09. Licencję i autora potwierdziłem 2026-11-07 w metadanych pliku (API Commons). Alejka centrum dystrybucji żywności (strefa artykułów spożywczych), regały paletowe pełne kartonów, bez ludzi i bez czytelnych marek.
- Kadry 16:9, 1:1 i okładka: do sprawdzenia po buildzie podglądu.
