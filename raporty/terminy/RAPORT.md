# Pakiet „terminy”: raport (2026-11-15)

Gałąź `fabryka/terminy`, ostatni commit: zob. `git log -1 fabryka/terminy` (commit z dopiskiem „pełny check zielony”).
Zakres: jedna konwencja art. 115 KC w sześciu kalkulatorach (DECYZJE.md, 2026-11-15, ostatni punkt) i audyt jakości
`/narzedzia/swiadectwo-pracy`. Proces: badacz prawa (`raporty/terminy/PRZEPISY.md`), budowniczy, weryfikator prawny
i weryfikator kodu/UX (niezależnie, pliki i teksty przepisów, bez wniosków budowniczego), audytor świadectwa pracy.

## Co powstało
- `src/lib/narzedzia/terminy.ts` (tylko dopisane): `terminPracownika(koniec)` → `{ zdazDo, wedlugArt115, rozne, wolne }`,
  `dzienWolnyArt115` (niedziele i święta z `swieta()`, Wigilia od 2025, sobota dopiero od 1.01.2017 r., jednorazowo
  12.11.2018 r.), `fazaTerminu`, `zostaloDni`, etykiety `ETYKIETA_ZDAZ_DO` / `ETYKIETA_ART_115`, jedno zdanie
  `zdanieArt115(t, 'sad' | 'pracodawca' | 'przedawnienie')` dla HTML i skryptu, `BEZ_PRZESUNIECIA` dla terminów pracodawcy.
  Testy: 37 dat (święta stałe i ruchome, sobota, niedziela, Wigilia, przełom roku, 29 lutego, sobota przed 2017 r.)
  z niezależnego rachunku `raporty/terminy/art115.py` (dateutil.easter).
- Strony: gdy daty się różnią, wynik pokazuje „Zdąż do” (bez przesunięcia) i „Ostatni dzień według art. 115 KC”
  z jednym zdaniem; w oknie między datami status „Pierwsza data minęła; …”.
  - `odwolanie-do-sadu-pracy`: wszystkie 7 spraw (pozwy: `sad`, sprzeciw i wniosek o sprostowanie: `pracodawca`);
    `terminCzynnosci` bez zmian (używa go `wypowiedzenie-zmieniajace`).
  - `kara-porzadkowa`: sprzeciw dwie daty; termin na ukaranie i zatarcie bez przesunięcia (zdanie dlaczego), a kara
    między datą z art. 109 § 1 a dniem po przesunięciu dostaje status „po terminie, chyba że sąd uzna przesunięcie”.
  - `swiadectwo-pracy`: wniosek, pozew, ostrożny pozew i przedawnienie pozwu o wydanie dwie daty (zamiast dopisku);
    wydanie, wysyłka, odpowiedź pracodawcy bez przesunięcia.
  - `przedawnienie-wynagrodzenia`, `zalegly-urlop`: dwie daty, ale przesunięcie opisane jako wątpliwe (niżej);
    30 września (art. 168) bez przesunięcia jako data z przepisu dla pracodawcy.
  - `informacja-o-warunkach-zatrudnienia`: same obowiązki pracodawcy, więc bez przesunięcia (usunięta data przesunięta),
    jedno zdanie dlaczego.
- „Jak liczymy”, FAQ, testy jednostkowe (1801 w całym repozytorium) i E2E zaktualizowane; zrzuty 412/320 px:
  `raporty/terminy/zrzuty/` (skrypt `zrzuty.mjs`, stan z dwiema datami, 0 px przewijania w bok, nic nieucięte).

## Przepisy i orzeczenia (szczegóły i cytaty: `PRZEPISY.md`)
- Art. 110–116 KC (t.j. Dz.U. 2026 poz. 795; bez zmian po t.j.), „lub na sobotę” w art. 115 od 1.01.2017 r.
  (Dz.U. 2016 poz. 2255, art. 1 pkt 3, przejściowy art. 21); art. 300, 264, 97 § 1–2¹, 109, 112, 113, 168, 291–295 Kp
  (t.j. Dz.U. 2026 poz. 1245, bez zmian po t.j.); art. 165 § 1–2 KPC (t.j. Dz.U. 2026 poz. 468; 5 nowelizacji po t.j.,
  żadna nie zmienia art. 165).
- **SAOS był w przerwie technicznej przez całą pracę badacza** (sn.pl blokuje). Strony nie powołują się więc na SN,
  tylko na wyroki sądów pracy z Portalu Orzeczeń MS, czytane w pełnym uzasadnieniu: SR Jelenia Góra IV P 24/19 (art. 264,
  koniec w sobotę i niedzielę), SR Szczecin-Centrum IX P 280/20 (sprzeciw) i IX P 666/18 (wniosek o sprostowanie),
  SO Łódź VII Pa 90/16 (sprzeciw musi dotrzeć do pracodawcy, bez art. 165 § 2 KPC), SR Wrocław-Śródmieście IV P 553/24
  (dni wolne bez znaczenia dla przedawnienia z art. 291 Kp). Audytor potwierdził w SAOS (druga próba) II PK 36/04
  (id 82913), na który powołuje się świadectwo pracy.
- Wnioski: (a) pozew do sądu pracy: art. 115 stosowany jednolicie przy art. 264; (b) pismo do pracodawcy: stosowany
  w pojedynczych wyrokach, bez art. 165 § 2 KPC (liczymy doręczenie); (c) przedawnienie: według uchwały 7 sędziów SN
  III CZP 21/23 (22.05.2024, znanej z przytoczeń) art. 115 nie dotyczy upływu przedawnienia, więc strony mówią
  „wątpliwe, złóż pozew w pierwszej dacie”; (d) terminy pracodawcy i okresy: brak orzeczeń, bez przesunięcia.

## Interpretacje
- Sobota przed 1.01.2017 r. nie przesuwa (stare brzmienie art. 115, uchwała III CZP 8/03 w przytoczeniach).
- Przy przedawnieniu druga data zostaje (konwencja z DECYZJE.md), ale status w oknie mówi „prawdopodobnie przedawnione”.
- Ostrożny pozew o sprostowanie bez zawiadomienia o odmowie: po upływie ostrożnej daty status „pozew nadal możliwy
  przed przedawnieniem” (art. 97 § 2¹ zd. 3, art. 97¹ § 3–4), a nie „termin minął”.

## Weryfikacje i audyt
- Weryfikator prawny: 2 błędy (zdanie o przedawnieniu przypisywało VII P 41/22 sprawę z art. 291 Kp, choć dotyczyła
  art. 442¹ KC; zdanie o terminach pracodawcy podawało pewnik bez źródła), 8 nieścisłości (nadmierna pewność
  „sądy stosują”, VII Pa 90/16 tylko przy sprzeciwie, wymagalność wynagrodzenia, status art. 265 bez warunku winy,
  art. 97¹ § 4 bez zastrzeżenia 14 dni po odmowie, sobota przed 2017 r., kolejność § 3³/3² w FAQ); wszystkie poprawione.
- Weryfikator kodu/UX: 376 272 porównań z modelem w Pythonie, 1 rozbieżność (wypłata za grudzień cofnięta na grudzień
  znikała z listy przedawnienia: pętla do `rok + 1`), odmiana „Został 1 dzień”, nieaktualne pola po błędzie (odwołanie,
  kara, przedawnienie), progi statusu jak w świadectwie, długi region aria-live (zdanie o art. 115 wyniesione poza
  region), „po tej dacie” dwuznaczne; poprawione.
- Audytor świadectwa pracy: 50 000 przypadków, 1 510 782 porównań, 0 rozbieżności; 320/412 px bez uwag; poprawione:
  status po ostrożnej dacie pozwu, brak stanu przedawnienia pozwu o wydanie, grzywna 2000–60 000 zł bez daty
  (od 8.07.2026 r., Dz.U. 2026 poz. 473), odszkodowanie 1,5 × pensja podane jako interpretacja, dopisek o art. 115
  przy złożonym wniosku. Znaleziska audytora potwierdziłem sam testami (każde z testem w `swiadectwo-pracy.test.ts`),
  bez drugiego podagenta.

## Wynik checku
`npm run -s check:szybki` EXIT 0, `BEZ_WEBKIT=1 npm run check` EXIT 0 (szczegóły w ostatniej wiadomości do orkiestratora).

## Czego nie sprawdzono / poza zakresem
- SN: III CZP 21/23 (pełna teza, zakres), III CZP 8/03, III CSK 409/06, orzeczenie SN o art. 115 przy art. 264
  i 112 Kp (SAOS w przerwie, sn.pl blokuje). WebKit i prawdziwy czytnik ekranu.
- Wspólne pliki, których pakiet nie zmienia: wpis `wynagrodzenieRozp` w `src/data/prawo.ts` nie wymienia § 2 ust. 1
  pkt 9, § 2 ust. 2 i § 2a (używa ich świadectwo pracy); sekcja „Podstawa prawna” we wspólnym komponencie wyświetla
  `uwaga` bez `typografia()`. Zdanie „PPK najwcześniej po 14 dniach zatrudnienia” na
  `informacja-o-warunkach-zatrudnienia` do sprawdzenia w tekście ustawy o PPK (brak kopii).
- Inne narzędzia z terminem pracownika (edytują inne zespoły), do przejścia na `terminPracownika`:
  - `wypowiedzenie-zmieniajace`: `odwolanieDo` to data po przesunięciu (`terminCzynnosci().koniec`) jako jedyna;
    odmowa przyjęcia warunków (art. 42 § 3) to pismo do pracodawcy bez drugiej daty: pokazać „Zdąż do” i art. 115.
  - `odszkodowanie-za-zwolnienie`: wspomina 21 dni z art. 264; przy dacie pokazać obie daty lub odesłać do kalkulatora.
  - `odpowiedzialnosc-materialna`: status przedawnienia roszczenia pracodawcy liczony od dnia po przesunięciu
    z art. 115; po III CZP 21/23 przesunięcie przy przedawnieniu jest wątpliwe, więc tekst „zostało” i status
    do przeglądu (dla pracownika późniejsza data jest bezpieczna, ale opis powinien mówić o sporze).
  - `zgloszenie-pracy-cudzoziemca` (`cudzoziemiec-terminy.ts`): obowiązki pracodawcy z datą przesuniętą; według
    konwencji bez przesunięcia z jednym zdaniem dlaczego.
  - `badania-lekarskie-w-pracy`, `monitoring-w-pracy`: już bez przesunięcia, tylko ujednolicić zdanie (`BEZ_PRZESUNIECIA`).
  - `przesunZDniaWolnego` w `termin-odwolania.ts` (używają `cudzoziemiec-terminy`, `pit-roczny`) to druga implementacja
    art. 115 bez reguły soboty sprzed 2017 r.; docelowo delegować do `terminPracownika`.

## Sprawy dla Patryka
1. Ręcznie sprawdzić w sn.pl uchwałę 7 sędziów SN III CZP 21/23 (czy art. 115 KC nie przesuwa każdego końca
   przedawnienia, także z art. 291 Kp); od niej zależy zdanie o przedawnieniu na trzech stronach.
2. Ręcznie sprawdzić, czy jest orzeczenie SN o art. 115 KC przy art. 264 i art. 112 Kp (dziś strony powołują się
   na sądy rejonowe i okręgowe).
3. Zgoda na konwencję dla przedawnienia: pokazujemy drugą datę z art. 115 KC, ale z ostrzeżeniem, że prawdopodobnie
   nie działa (alternatywa: przy przedawnieniu tylko jedna data).
