# Pakiet „terminy3”: raport (2026-11-15)

Gałąź `fabryka/terminy3`, ostatni commit: zob. `git log -1 fabryka/terminy3` (commit z dopiskiem „pełny check zielony”).
Zakres: linijka praktyczna pod „Zdąż do” w sobotę, niedzielę albo dzień ustawowo wolny (DECYZJE.md, 2026-11-15, runda 9;
rekomendacja z `raporty/terminy2/RAPORT.md`, pkt 6) we wspólnej funkcji i ośmiu narzędziach oraz porządki w terminach.
Proces: badacz prawa (`PRZEPISY.md`; przerwany limitem API, ale z kompletem wniosków), budowniczy, weryfikator kodu i UX
(`WERYFIKACJA-KOD.json`) i weryfikator prawny (`WERYFIKACJA-PRAWNA.json`) niezależnie, audytor (`AUDYT.json`).

## Co powstało
- `terminy.ts`: jedna reguła dni wolnych (`dzienWolny`: święta z art. 1 ustawy o dniach wolnych od pracy, 12.11.2018 r.,
  niedziela, sobota); na niej `dzienWolnyArt115` (sobota dopiero od 1.01.2017 r., zachowanie bez zmian: 14 976 dni
  porównanych z poprzednią wersją), `dzienRoboczy` (pon.–pt. bez świąt), `ostatniDzienRoboczyPrzed`, `wDniu`
  („w piątek 11 grudnia 2026 r.”) i `linijkaDniaWolnego(t, rodzaj, dzis?)`: jedna funkcja tekstu dla HTML i skryptu.
  Rodzaje: pismo do pracodawcy i odmowa (ma dotrzeć, art. 61 § 1 KC: „Jeśli zakład nie przyjmuje pism tego dnia,
  bezpieczniej złóż … najpóźniej w ostatnim dniu roboczym przed tą datą, czyli w piątek …”), pismo do sądu (nadanie
  w placówce Poczty Polskiej, jeśli jest czynna, art. 165 § 2 KPC, potwierdzenie nadania, kurier nie), przedawnienie
  (jak pozew, z ostrzeżeniem z konwencji), odwołanie do ZUS (list do oddziału, który wydał decyzję), zastrzeżenia do
  protokołu kontroli i odwołanie od orzeczenia lekarskiego (przepisy nie mówią, czy wystarczy nadanie: ma dotrzeć).
  Bez trzeciej daty prawnej. Po dniu „Zdąż do” linijki nie ma; gdy dzień roboczy już minął, linijka mówi, kiedy był,
  radzi złożyć pismo jak najszybciej i podaje dzień z art. 115 KC, jeśli jest późniejszy.
- `termin-odwolania.ts`: usunięte `przesunZDniaWolnego`, `terminWDniach`, `terminCzynnosci` (druga implementacja art. 115
  KC, bez reguły soboty sprzed 2017 r.; grep: nikt ich nie używał); ich testy przeniesione na `terminSprawy`.
  Status „To dziś” w dzień wolny: tylko nadanie w czynnej placówce (sąd nieczynny).
- Linijka w ośmiu narzędziach (logika, strona, testy jednostkowe i E2E ze stałym zegarem, data w sobotę i święto):
  `odwolanie-do-sadu-pracy` (sąd albo pracodawca według sprawy), `kara-porzadkowa` (sprzeciw), `swiadectwo-pracy`
  (wniosek o sprostowanie, pozew, pozew o wydanie przed przedawnieniem; pod najbliższym terminem tylko raz),
  `przedawnienie-wynagrodzenia` (główny wynik i „inna należność”), `zalegly-urlop`, `wypowiedzenie-zmieniajace` (odmowa,
  także bez pouczenia, gdy koniec okresu to sobota; odwołanie), `badania-lekarskie-w-pracy`, `co-wolno-na-l4`
  (zastrzeżenia i odwołanie od decyzji ZUS). Linijka stoi pod regionem aria-live (czytnik nie czyta jej przy każdej zmianie).
- Testy: daty z niezależnego `raporty/terminy3/linijka.py` (kalendarz z `raporty/terminy2/swieta.py`): Wigilia 2025
  i 2026 r. (2024 r. dzień roboczy), 1 i 3 maja, Wielkanoc i Poniedziałek Wielkanocny, Zielone Świątki, Boże Ciało,
  sobota 31.12.2016 r. i 7.01.2017 r., przełom roku (1–2.01.2027 r. → czwartek 31.12.2026 r.), 12.11.2018 r.
  Zrzuty 412 i 320 px: `raporty/terminy3/zrzuty/` (skrypt `zrzuty.mjs`).

## Przepisy i orzeczenia (cytaty: `PRZEPISY.md`)
- Art. 165 § 1–2 i 477⁹ § 1, § 3 KPC (t.j. Dz.U. 2026 poz. 468; pięć nowelizacji po t.j. ich nie zmienia; KPC mówi
  „operatora świadczącego pocztowe usługi powszechne”, czyli operatora wyznaczonego z art. 3 pkt 13 Prawa pocztowego,
  t.j. 2026 poz. 558); art. 61 § 1, 110–115, 123 KC (t.j. 2026 poz. 795); art. 42 § 3, 97 § 2¹, 112, 264, 291, 300 Kp
  (t.j. 2026 poz. 1245); art. 1 ustawy o dniach wolnych od pracy (t.j. 2025 poz. 296, Wigilia od 1.02.2025 r.);
  art. 68e ust. 4–7 ustawy zasiłkowej (t.j. 2026 poz. 854, od 13.04.2026 r.); art. 83 ust. 2 i 5 ustawy o sus
  (t.j. 2026 poz. 1474); § 5 ust. 1 i 3 rozporządzenia o badaniach (t.j. 2023 poz. 607, zm. 2026 poz. 456).
- Orzeczenia (Portal Orzeczeń MS, pełne teksty; SAOS w przerwie technicznej przez całą pracę badacza): dojście pisma do
  pracodawcy, nie nadanie: SR Szczecin-Centrum IX P 762/20 (sprzeciw od kary), SO Wrocław VII Pa 323/13 (wniosek
  o sprostowanie, stanowisko SR); pozew nadany na poczcie przerywa przedawnienie z dniem nadania: SA w Warszawie
  VI ACa 1552/13, V ACa 1254/17 (także III APa 2/16 na tle art. 291 Kp); odwołanie do ZUS nadane na poczcie w terminie:
  SA w Gdańsku III AUz 11/18, SO w Gdańsku VII U 2743/12. SN tylko z przytoczeń (II UKN 105/98, I CKN 967/00, III CZP 21/23).
- Operator wyznaczony 2026–2035: Poczta Polska, decyzja Prezesa UKE z 28.11.2025 r., znana z komunikatów Poczty Polskiej
  i gov.pl (źródła urzędowego UKE nie odczytano: blokada automatów).

## Wynik checku
`npm run -s check:szybki` EXIT 0 (astro check 0 błędów, testy jednostkowe zielone), `BEZ_WEBKIT=1 npm run check`: wynik
w ostatnim commicie (dopisek „pełny check zielony” tylko przy EXIT 0). Zrzuty 412 i 320 px ośmiu stron w stanie z linijką:
0 px przewijania w bok, linijka widoczna, nic nieucięte.

## Interpretacje
- Linijka zależy od dnia tygodnia „Zdąż do”, nie od tego, czy art. 115 KC daje drugą datę: sobota sprzed 2017 r. też ją
  dostaje (biuro i tak bywa nieczynne), ale przy przedawnieniu bez zdania o wątpliwym przesunięciu (audyt A-4).
- Dzień roboczy jako rada („bezpieczniej”, z warunkiem „jeśli zakład nie przyjmuje pism tego dnia”), a nie termin:
  art. 61 § 1 KC wymaga tylko dojścia (weryfikacja prawna P-2); grafiku zakładu nie znamy.
- Odwołanie od decyzji ZUS jak pismo do sądu (nadanie w Poczcie Polskiej, list do oddziału ZUS); zastrzeżenia do protokołu
  i odwołanie od orzeczenia lekarskiego jak pismo do pracodawcy (przepisy nie mówią, czy wystarczy nadanie).
- Przy przedawnieniu zostaje słowo „wątpliwe” (konwencja z DECYZJE.md, runda 8), choć weryfikator prawny proponował
  mocniej (P-3): uchwała III CZP 21/23 jest znana tylko z przytoczeń i czeka na ręczne sprawdzenie w `STAN.md`.

## Weryfikacje i audyt
- Weryfikator kodu i UX: 260 120 porównań z własnym modelem (2000–2040, 6 rodzajów, z dniem dzisiejszym i bez),
  0 rozbieżności; sześć narzędzi spoza zakresu bez zmian (pliki, 139 testów, tekst zbudowanych stron identyczny).
  Poprawione: K-1 kara bez dnia dzisiejszego (rada po terminie), K-2 linijka dwa razy w świadectwie, K-3 linijka
  w aria-live, K-5 luki w testach (E2E po dniu „Zdąż do”, data Wigilii w przeniesionym teście). K-4 (eksporty używane
  tylko w testach) zostawione: to API wspólnego modułu, testowane wprost.
- Weryfikator prawny: 0 błędów, 2 ryzyka, 7 drobnych; poprawione P-1 („sądy uznają dzień nadania za dzień wniesienia
  odwołania” zamiast „liczą termin od dnia nadania”), P-2 i P-6 (rada „bezpieczniej” z warunkiem), P-5 (= K-1), P-7
  (mianownik: „Ostatnim dniem roboczym … był piątek”), P-8 (odmowa „najlepiej na piśmie”), P-9 (= K-2). P-4 (KPC nie
  używa słów „operator wyznaczony”) bez zmiany: to opis z art. 3 pkt 13 Prawa pocztowego, nie cytat. P-3 jak wyżej.
- Audytor: 286 tys. przypadków linijki i 260 tys. przez funkcje opisu siedmiu narzędzi, 0 rozbieżności; 0 błędów,
  1 ryzyko, 6 drobnych. Poprawione z testami: A-1 (po dniu roboczym wprost dzień z art. 115 KC), A-2 (status „To dziś”
  w dzień wolny), A-4, A-5 (język: „w liście do oddziału ZUS”, „przesyłka nadana u kuriera”, jedno „bezpieczniej”,
  „nie mówi, czy”), A-7 (komentarz w `zalegly-urlop.ts`, RangeError przy błędnej dacie). Zostawione: A-3 (dzień wolny
  nazwany i w linijce, i w zdaniu o art. 115 KC: to dwa różne komunikaty, praktyczny i prawny), A-6 (w L4 linijka stoi
  pod długim tekstem w tym samym wierszu wyniku, bo wynik L4 to jeden akapit na termin).

## Narzędzia z pakietu „jakosc5” (bez zmian)
Żadne z sześciu nie potrzebuje linijki: `odpowiedzialnosc-materialna` (przedawnienie roszczenia pracodawcy, pracownik nie
działa), `monitoring-w-pracy`, `zgloszenie-pracy-cudzoziemca`, `fundusz-socjalny` (terminy pracodawcy),
`zwrot-podatku-pit-37` (art. 12 § 5 Ordynacji sam przesuwa termin), `odszkodowanie-za-zwolnienie` (nie liczy daty,
odsyła do kalkulatora odwołania, który linijkę ma). Ich teksty i testy bez zmian.

## Czego nie sprawdzono
- SN w pełnym tekście (SAOS w przerwie): nadanie z art. 165 § 2 KPC a przerwanie przedawnienia, odwołanie do organu
  rentowego (II UKN 105/98, I CKN 967/00), dojście sprzeciwu i wniosku o sprostowanie, III CZP 21/23 (sn.pl).
- Decyzja Prezesa UKE o operatorze wyznaczonym w źródle urzędowym; które placówki Poczty Polskiej są czynne w soboty,
  niedziele i święta; czy agencja pocztowa to „placówka” z art. 165 § 2 KPC.
- Komu składa się zastrzeżenia, gdy kontroluje płatnik (art. 68e ust. 5 mówi tylko o rozpatrzeniu przez ZUS);
  odwołanie do ZUS przez PUE/eZUS. WebKit i prawdziwy czytnik ekranu.

## Sprawy dla Patryka
1. Ręcznie w sn.pl albo LEX: uchwała III CZP 21/23 (czy można napisać przy przedawnieniu „Sąd Najwyższy uznał”, zamiast
   „przesunięcie jest wątpliwe”).
2. Ręcznie: decyzja Prezesa UKE z 28.11.2025 r. (Poczta Polska operatorem wyznaczonym 2026–2035) w BIP UKE.
