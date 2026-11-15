# Pakiet „terminy 2”: raport (2026-11-15)

Gałąź `fabryka/terminy2`, ostatni commit: zob. `git log -1 fabryka/terminy2` (commit z dopiskiem „pełny check zielony”).
Zakres: konwencja art. 115 KC (DECYZJE.md, 2026-11-15, runda 8 część 1, „Otwarte do pakietu terminy 2”) w siedmiu
narzędziach, audyt jakości `wypowiedzenie-zmieniajace` i `badania-lekarskie-w-pracy` (zmiany z rundy 8), badanie
„Zdąż do” w niedzielę albo święto (pkt 6). Proces: badacz prawa (`PRZEPISY.md`), budowniczy, weryfikator kodu i UX
(`WERYFIKACJA-KOD.json`) i weryfikator prawny (`WERYFIKACJA-PRAWNA.json`) niezależnie, audytor (`AUDYT.json`)
i drugi podagent potwierdzający jego znaleziska (`AUDYT-wer.json`). `terminy.ts` i `przesunZDniaWolnego` bez zmian.

## Co powstało
- `wypowiedzenie-zmieniajace`: odmowa przed połową okresu (art. 42 § 3 zd. 1–2) i odwołanie (art. 264 § 1) przez
  `terminPracownika`: „Zdąż do” i „Ostatni dzień według art. 115 KC”, zdanie `zdanieArt115(…, 'sad')` przy odwołaniu
  i własne `ODMOWA_ART_115` przy odmowie (oświadczenie musi dojść do pracodawcy, art. 61 § 1 KC; orzeczeń brak).
  Bez pouczenia (art. 42 § 3 zd. 3) termin to koniec okresu wypowiedzenia: bez drugiej daty, bo następnego dnia
  obowiązują nowe warunki. Teksty wyniku z jednej funkcji `opisZmieniajacego` (HTML i skrypt); status w trzech fazach.
- `odszkodowanie-za-zwolnienie`: termin na pozew według sytuacji: 21 dni z art. 264 § 1 albo § 2 tylko przy zwolnieniu
  przez pracodawcę; przy art. 55 § 1¹ przedawnienie 3 lata (art. 291 § 1; SO Olsztyn IV Pa 79/15, czytany w pełnym
  tekście), przy art. 61¹ rok, najpóźniej 3 lata (art. 291 § 2 i § 2¹, zarzut z art. 292). Strona nie liczy daty, więc
  dwie daty z art. 115 KC odsyła do kalkulatora odwołania (link w „Jak liczymy”). **Błąd naprawiony przy okazji:**
  wcześniej „Pozew: 21 dni (art. 264)” pokazywał się też przy art. 55 § 1¹ i 61¹.
- `odpowiedzialnosc-materialna`: przy końcu przedawnienia w sobotę albo dzień wolny zdanie `sporArt115`: spór,
  sentencja III CZP 21/23 dosłownie („art. 115 k.c. nie ma zastosowania do upływu terminu przedawnienia”) jako znana
  z przytoczeń, druga data i to, że dla pracownika (roszczenie przeciw niemu) późniejsza data jest bezpieczna. Status
  bez zmian (liczony od daty późniejszej). Dni wolne i sobota od 2017 r. ze wspólnej funkcji.
- `zgloszenie-pracy-cudzoziemca`: powiadomienia pracodawcy bez przesunięcia (wcześniej druga data „po przesunięciu”),
  nazwa dnia wolnego w nawiasie, zdanie dlaczego (`BEZ_PRZESUNIECIA_CUDZOZIEMCY`, niżej uwaga o wspólnym zdaniu).
- `zwrot-podatku-pit-37`: 30 kwietnia przesuwa przepis szczególny (art. 12 § 5 Ordynacji, sobota od 1998 r.):
  jedna data po przesunięciu, `terminZaplaty` bez `przesunZDniaWolnego` (sobota 2016 r. też przesuwa).
- `badania-lekarskie-w-pracy`: odwołanie od orzeczenia (§ 5 ust. 3 rozporządzenia; to nie postępowanie
  administracyjne, art. 57 § 4 KPA nie działa) jako termin osoby badanej: dwie daty z ostrzeżeniem (`ODWOLANIE_ART_115`);
  30 dni z art. 229 § 1¹ jako okres z `BEZ_PRZESUNIECIA.okres`.
- `monitoring-w-pracy`: `BEZ_PRZESUNIECIA.okres` przy końcu przechowywania w dniu wolnym (poza regionem aria-live)
  i `WSTECZ_BEZ_PRZESUNIECIA` przy terminach liczonych wstecz od uruchomienia (art. 22² § 7 i § 9).
- Testy: daty z niezależnego `raporty/terminy2/swieta.py` (własna Wielkanoc, sobota od 2017 r., 12.11.2018 r.),
  przypadki brzegowe (Wigilia, przełom roku, sobota przed 2017 r., 29 lutego), E2E stanów z dwiema datami, po błędzie
  danych i ze stałym zegarem. Zrzuty 412/320 px: `raporty/terminy2/zrzuty/` (skrypt `zrzuty.mjs`).

## Przepisy i orzeczenia (cytaty i zapytania: `PRZEPISY.md`)
- Art. 42 § 1–3, 55 § 1¹, 61¹, 177 § 1, § 1¹, § 4, 43, 229 § 1¹–2, 264 § 1–2, 291 § 1–3, 292 Kp (t.j. Dz.U. 2026
  poz. 1245; nowelizacje po t.j. tych artykułów nie zmieniają), art. 61, 115 KC (t.j. 2026 poz. 795), art. 165 § 2–4,
  125¹, 125³ KPC (t.j. 2026 poz. 468), art. 12 § 5 Ordynacji (t.j. 2026 poz. 622; od 1.10.2026 „termin do wykonania
  czynności”, Dz.U. 2026 poz. 846), art. 45 ust. 1 i 4 ustawy o PIT, ustawa o powierzaniu pracy cudzoziemcom
  (Dz.U. 2025 poz. 621, cztery nowelizacje; bez reguły soboty, przesunięcia tylko przy awarii i pracy sezonowej),
  rozporządzenie o badaniach (t.j. 2023 poz. 607, zm. 2026 poz. 456 i 726), art. 22² Kp, Prawo pocztowe (t.j. 2026
  poz. 558), ustawa o ograniczeniu handlu w niedziele (art. 6 ust. 1 pkt 7).
- **SAOS był w przerwie technicznej przez całą pracę** (07:53–08:15 UTC badacz, ok. 50 min audytor), więc żadnego
  orzeczenia SN nie przeczytaliśmy w pełnym tekście. III CZP 21/23: sentencja i skład z glosy (S. Szejna, Glosa 2026
  nr 2) i z wyroku SR w Gdyni VI GC 238/24; II PK 185/07 i II PZ 26/12 z przytoczeń w SO Olsztyn IV Pa 79/15;
  II PK 214/07 i II PK 319/04 z przytoczeń (SR Wrocław-Śródmieście IV P 368/12). Strony opisują je jako znane z przytoczeń.

## Wynik checku
`npm run -s check:szybki` EXIT 0 (astro check 0 błędów, unit 2243 w 139 plikach), `BEZ_WEBKIT=1 npm run check` EXIT 0
(E2E 2380 zaliczonych, 346 pominiętych z założenia, 8,6 min; Lighthouse i kontrola SEO produkcji przed startem bez
błędów). Zrzuty 412 i 320 px siedmiu stron w stanie z datą w sobotę: 0 px przewijania w bok, nic nieucięte.

## Interpretacje
- Odmowa z pouczeniem: drugą datę liczymy od dnia „zdąż do” (ostatni dzień w całości przed połową); gdy połowa wypada
  w środku następnego dnia, a ten jest wolny, drugiej daty nie podajemy (wariant wcześniejszy).
- Odwołanie od orzeczenia lekarskiego: dwie daty, choć zadanie mówiło „ujednolicić zdanie o braku przesunięcia”: to
  czynność osoby badanej, więc według konwencji (każdy termin pracownika: dwie daty), z ostrzeżeniem, że art. 115 jest
  niepewny. Do potwierdzenia przez orkiestratora.
- PIT: art. 12 § 5 OP przesuwa termin sam, więc jedna data (po przesunięciu), bez ostrzeżenia.

## Weryfikacje i audyt
- Weryfikator kodu/UX: ok. 155 tys. przypadków z własnego modelu, 0 rozbieżności dat i statusów; 7 znalezisk
  poprawionych: etykieta „art. 115 kc” (toLowerCase na całości), martwe pole `wolny` w badaniach, sobota w Ordynacji
  przed 2017 r., etykieta odwołania zmieniana tylko przy dwóch datach, zdanie monitoringu poza aria-live, testy E2E
  błędu i zegara, przypadki brzegowe.
- Weryfikator prawny: 5 znalezisk poprawionych: druga data odmowy bez pouczenia po końcu okresu (merytoryczny),
  art. 177 § 1¹ niepełny, „ma na pozew rok” zamiast przedawnienia z art. 292, komentarz o art. 12 OP, zdanie
  o „jednym dniu” we wspólnym `BEZ_PRZESUNIECIA.pracodawca` (niżej). Potwierdził art. 264 § 2 a art. 55 § 1¹ (IV Pa 79/15
  w pełnym tekście), art. 12 § 5 OP, opis art. 42 § 3 i art. 43.
- Audytor (2 × 14 000 i 2380 przypadków brzegowych, 0 rozbieżności obliczeń), 5 znalezisk, wszystkie potwierdzone
  przez drugiego podagenta i poprawione z testami: **B-1** domyślne „Nie wiem” dawało „nie jest wymagane” po L4 ponad
  30 dni i urlopie (teraz „przepis tego nie rozstrzyga, bezpieczniej zrobić badanie”), B-2 „Jak liczymy” bez warunku
  30 dni, A-1 „3 lata mija”, A-2 art. 177 § 1¹ i § 4, A-3 art. 43 bez „stwierdzonej orzeczeniem lekarskim”
  i „niezawinionej”.

## Pkt 6: „Zdąż do” w niedzielę albo święto (rekomendacja dla orkiestratora)
Nie dodawać trzeciej daty „prawnej”. Gdy „Zdąż do” wypada w sobotę, niedzielę albo święto, dopisać pod nią jedną
linijkę praktyczną w `zdanieArt115` (wspólna funkcja, więc decyzja orkiestratora i pakiet „jakosc4”): przy piśmie do
pracodawcy „złóż najpóźniej w ostatnim dniu roboczym przed tą datą (np. piątek 11 grudnia 2026 r.), bo liczy się
dzień, w którym pismo dotrze” (art. 61 § 1 KC; w dzień wolny biuro zwykle nieczynne, orzeczeń o dojściu w dniu wolnym
brak); przy pozwie „tego dnia możesz je nadać w placówce Poczty Polskiej, jeśli jest czynna” (art. 165 § 2 KPC nie
wymaga dnia roboczego; placówki mogą działać w niedziele, art. 6 ust. 1 pkt 7 ustawy o ograniczeniu handlu, ale nie
muszą, a pracownik bez pełnomocnika nie wniesie pozwu elektronicznie, art. 165 § 4 i 125³ § 2 KPC). Najważniejsze
przy przedawnieniu (po III CZP 21/23 bez przesunięcia) i przy pismach do pracodawcy. Dzień roboczy jako pon.–pt. bez
świąt, nazwany wprost.

## Czego nie sprawdzono / poza zakresem
- SN w pełnym tekście (SAOS w przerwie): III CZP 21/23 (moc zasady prawnej), II PK 185/07, II PZ 26/12, I PKN 639/00,
  I PK 541/03, II PK 214/07, II PK 319/04, I PK 144/11; CBOSA (orzeczenia lekarskie, art. 77 OP, kary z art. 84 ustawy
  o cudzoziemcach) zrywa połączenie; które placówki Poczty Polskiej są czynne w niedziele. WebKit, prawdziwy czytnik ekranu.
- Poza zakresem pakietu (do orkiestratora):
  - `BEZ_PRZESUNIECIA.pracodawca` w `terminy.ts` mówi „jeden dzień po dacie z przepisu nie musi oznaczać
    spóźnienia”, a z soboty przesunięcie to co najmniej dwa dni (do poniedziałku), przy świętach więcej; proponowane
    „kilka dni po dacie z przepisu, do następnego dnia roboczego,”. Używają go `swiadectwo-pracy`, `kara-porzadkowa`,
    `start-w-pracy` i strony monitoringu i badań (przez `BEZ_PRZESUNIECIA.okres` nie). Cudzoziemcy mają własne zdanie.
  - `terminCzynnosci` i `terminWDniach` w `termin-odwolania.ts` nie mają już użytkownika poza testami;
    `przesunZDniaWolnego` używa tylko `co-wolno-na-l4` (bez reguły soboty sprzed 2017 r.).
  - Przy przedawnieniu w `przedawnienie-wynagrodzenia`, `zalegly-urlop`, `swiadectwo-pracy`: sentencja III CZP 21/23
    jest już potwierdzona w dwóch przytoczeniach (cytat w `PRZEPISY.md`), można ją przytoczyć dosłownie.

## Sprawy dla Patryka
1. Ręcznie w sn.pl albo LEX: czy uchwała 7 sędziów III CZP 21/23 ma moc zasady prawnej i wyrok II CSKP 1946/22
   (od tego zależy, czy przy przedawnieniu zostawić drugą datę).
2. Zgoda na rekomendację z pkt 6 (linijka „złóż w ostatnim dniu roboczym” przy „Zdąż do” w dzień wolny).
3. Ręcznie: orzeczenia SN II PK 185/07 i II PZ 26/12 (art. 264 § 2 nie dotyczy odszkodowania z art. 55 § 1¹), na których
   dziś opiera się zmiana w kalkulatorze odszkodowania (obok wyroku SO, przeczytanego w całości).
