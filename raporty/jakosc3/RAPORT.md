# Audyt jakości 3: raport (2026-11-15)

Niezależny audyt czterech narzędzi z rund 6–7: `odpowiedzialnosc-materialna`, `monitoring-w-pracy`, `drogi-i-przejscia`,
`skladowanie-w-magazynie` (`swiadectwo-pracy` audytuje pakiet „terminy”). Trzy partie (A, B, C). Każdy audytor dostał
pliki narzędzia i teksty przepisów z API Sejmu (z nowelizacjami po tekstach jednolitych), ale nie dostał raportów
zespołów ani ich wniosków. Każde znalezisko sprawdził drugi, niezależny podagent (weryfikator). Poprawione są tylko
znaleziska potwierdzone albo częściowo potwierdzone, w wersji weryfikatora. Każda poprawka ma test, który bez niej
nie przechodzi; luki w testach są wyjątkiem, bo zabezpieczają poprawny dziś kod. Zasady pracy: `WSPOLNE.md` i
`WERYFIKATOR.md`, surowe raporty: `<partia>.json` (audytor) i `<partia>-wer.json` (weryfikator).

Wynik: `npm run -s check:szybki` EXIT 0 i `BEZ_WEBKIT=1 npm run check` EXIT 0 (E2E: 2331 zaliczone, 343 pominięte; testy jednostkowe: 2080 w 137 plikach).
Zrzuty z telefonu (320 i 412 px, cała strona) są w `zrzuty/`. Na żadnej stronie nic nie jest ucięte, strony nie
przewijają się w bok (`scrollWidth` = szerokość okna), a żadna opcja list wyboru nie jest szersza od pola.

## Wynik weryfikacji

Audytorzy zgłosili 26 znalezisk. Weryfikatorzy potwierdzili 15, częściowo potwierdzili 11 i nie odrzucili żadnego;
nowych znalezisk nie dodali. Z tego 23 to błędy, a 3 to luki w testach (kod jest poprawny):

| Narzędzie | Błędy | Luki w testach |
|---|---|---|
| odpowiedzialnosc-materialna | 9 | 1 |
| monitoring-w-pracy | 6 | 1 |
| drogi-i-przejscia | 4 | 1 (wspólna z składowaniem) |
| skladowanie-w-magazynie | 4 | (jw.) |

## Tabela znalezisk

| ID | Narzędzie | Zdanie albo przypadek | Przepis | Potwierdzenie | Poprawka | Test |
|---|---|---|---|---|---|---|
| A-1 | odpowiedzialnosc-materialna | „rok od dnia, w którym pracodawca dowiedział się o szkodzie”; pole „np. z inwentaryzacji”. Narzędzie mogło za wcześnie napisać „termin minął” | art. 291 § 2 Kp: „powziął wiadomość o wyrządzeniu przez pracownika szkody” | potwierdzone | „dowiedział się, że pracownik wyrządził szkodę” w wyniku, FAQ, opisie pola i komunikacie błędu | `odpowiedzialnosc.test.ts` „audyt jakosc3” |
| A-2 | odpowiedzialnosc-materialna | FAQ: „kar pieniężnych za naruszenie porządku pracy” | art. 87 § 1 pkt 4, art. 108 § 1–2 Kp | potwierdzone | kary pieniężne z art. 108: tylko BHP, ppoż., opuszczenie pracy, alkohol | E2E `narzedzie-odpowiedzialnosc.spec.ts` |
| A-3 | odpowiedzialnosc-materialna | 20 lat przy przestępstwie bez końca roku i art. 115 KC (dopisek znikał 1.12.2026, a nie 31.12.2026; szkoda 5.05.2008 → 2.01.2029) | art. 442¹ § 2, 118 zd. 2, 115 KC | potwierdzone | druga data i status od niej | jw. (6188 i 6210 dni, policzone w Pythonie) |
| A-4 | odpowiedzialnosc-materialna | „inna czynność przed sądem… przerywa”: zawezwanie do próby ugodowej zawiesza bieg; zbędny przecinek | art. 121 pkt 6, 123 KC | potwierdzone | „Mediacja i zawezwanie do próby ugodowej wstrzymują bieg… (art. 121 pkt 5–6)” | jw. |
| A-5 | odpowiedzialnosc-materialna | wspólna kasa: „nie dotyczy to pieniędzy” | § 6 ust. 1 rozp. z 10.10.1975 (art. 124 § 2 oraz art. 125) | potwierdzone | obniżenie obejmuje całe mienie powierzone wspólnie, także pieniądze; wynik i „Zasady” | jw. |
| A-6 | odpowiedzialnosc-materialna | „może trwać do 16 listopada 2026 r.” w dniu 16.11.2026 | (treść) | potwierdzone | „może trwać do dziś (16 listopada 2026 r.)” | jw. |
| A-7 | odpowiedzialnosc-materialna | brak linku do kary porządkowej | (spójność) | częściowo (bez linku do odzieży roboczej) | link do `/narzedzia/kara-porzadkowa` w wyjaśnieniu | E2E |
| A-8 | odpowiedzialnosc-materialna | „zepsulem maszyne w pracy musze zaplacic”, „rozbilem auto sluzbowe”, „zgoda na potracenie z wynagrodzenia” poza trójką | (wyszukiwarka) | częściowo: imiesłowy zamiast czasowników („zniszczyłem sobie kręgosłup” to choroba zawodowa) | 6 haseł | `jakosc3-wyszukiwarka.test.ts` |
| A-9 | odpowiedzialnosc-materialna | hasło „kara za zniszczenie” zabierało „kara pieniezna potracenie z wyplaty” narzędziu kara-porzadkowa | (wyszukiwarka) | częściowo | usunięte „szkoda” (jest w nazwie) i „kara za zniszczenie” | jw. |
| A-10 | odpowiedzialnosc-materialna | art. 115 KC bez świąt ruchomych 2027–2028 | art. 115 KC | luka w testach | 8 par dat | `odpowiedzialnosc.test.ts` |
| B-1 | monitoring-w-pracy | osoba przyjęta po uruchomieniu: „Za późno o 198 dni” albo „Obowiązek niespełniony… § 7” | art. 22² § 7 i § 8 Kp | częściowo (osobna odpowiedź zamiast „za późno albo nie dotyczy”) | opcja „Przyjęto mnie później” z opisem pola; § 8 zamiast terminu 2 tygodni; wskazówka przy „Za późno”, gdy informacja była po uruchomieniu | `monitoring.test.ts`, E2E |
| B-2 | monitoring-w-pracy | uruchomienie 2015 r. z „Nie poinformowano” → „Obowiązek niespełniony” | art. 111 i 176 ustawy z 10.05.2018 (Dz.U. 2018 poz. 1000): art. 22² od 25.05.2018 | częściowo (granicą jest termin informacji, nie dzień uruchomienia) | termin przed 25.05.2018 nie jest oceniany; „Jak liczymy” | `monitoring.test.ts` (2018-06-08 i 2018-06-09) |
| B-3 | monitoring-w-pracy | oznaczenie liczone łagodniej dla pracodawcy niż informacja | art. 22² § 9; zasada 2 standardu | potwierdzone | oznaczenie z pełnym dniem przerwy (13.12) i dzień poprzedni (14.12) w wyniku i „Jak liczymy” | `monitoring.test.ts`, E2E |
| B-4 | monitoring-w-pracy | „szatnia”, „toaleta”, „szafka w szatni” → monitoring na 1. miejscu zamiast norm sanitarnych | (wyszukiwarka) | częściowo | usunięte „kamera w szatni” i „kamera w toalecie” (pytanie z FAQ wystarcza) | `jakosc3-wyszukiwarka.test.ts` |
| B-5 | monitoring-w-pracy | „monitoring komputera”, „kamera nad stanowiskiem”, „sledzenie pracownika” poza trójką | (wyszukiwarka) | częściowo (bez haseł, które zabierały „okulary do komputera”, „praca w magazynie”) | 6 haseł | jw. |
| B-6 | monitoring-w-pracy | czytnik ogłaszał tylko status, a nie datę; aria-live na ukrywanym elemencie | WCAG 4.1.3 | potwierdzone | `aria-live` i `aria-atomic` na `<dd>` | E2E |
| B-7 | monitoring-w-pracy | 29 lutego, 31. dzień, przełom roku, granice klas | art. 112 KC | luka w testach | przypadki dopisane | `monitoring.test.ts` |
| C-1 | skladowanie-w-magazynie | „ile kg na regal” → dźwiganie | (wyszukiwarka) | potwierdzone | 3 hasła | `jakosc3-wyszukiwarka.test.ts` |
| C-2 | skladowanie-w-magazynie | „ile metrow do gasnicy” → praca na wysokości | (wyszukiwarka) | potwierdzone | 3 hasła | jw. |
| C-3 | drogi-i-przejscia | „rampa zaladunkowa”, „pasy na hali zolte”, „barierki dla pieszych hala” bez wyniku | (wyszukiwarka) | częściowo (bez „próg”, „pasy”, „wysokość”: zabierały „prog podatkowy”, „pasy bezpieczenstwa”, „wysokosc odprawy”) | 6 haseł | jw. |
| C-4 | skladowanie-w-magazynie | „co na najnizszej polce” → płaca minimalna | (wyszukiwarka) | potwierdzone | 2 hasła | jw. |
| C-5 | drogi-i-przejscia | błąd w polu, zmiana rodzaju na gaśnicę: uwaga o § 7 zamiast o 30 m | (UX) | potwierdzone | uwaga z samego rodzaju także przy błędzie | E2E `narzedzie-drogi-i-przejscia.spec.ts` |
| C-6 | drogi-i-przejscia | „pochylnia musi mieć… 1,88 m” poza drogą transportową i magazynem; „przejście” przy gaśnicy | § 5 ust. 1 ogólnych przepisów BHP | potwierdzone | „pochylnia o nachyleniu najwyżej 8% ma…”, „to miejsce” | `drogi-i-przejscia.test.ts` |
| C-7 | skladowanie-w-magazynie | przykład startowy: „zmieszczą się 2”, a sekcja przeciążona | § 68 ust. 2 pkt 2 | potwierdzone | liczba z obu limitów: „zmieści się najwyżej 1 taki ładunek, bo przy 4 zajętych poziomach ogranicza obciążenie sekcji (sam poziom uniesie 2)” | `skladowanie.test.ts`, E2E |
| C-8 | drogi-i-przejscia | brak linku do pracy na wysokości (balustrady § 106) | (spójność) | częściowo (bez linku do dźwigania; linki zwrotne poza zakresem) | link do `/narzedzia/praca-na-wysokosci` | build (kontrola linków SEO) |
| C-9 | drogi i składowanie | granice pól i progi ±1 mm bez testów | § 47, § 5, § 33 ppoż., § 77 | luka w testach | przypadki dopisane | oba pliki testów |

Orzeczenia: jedyna sygnatura na stronach, II PK 307/09 (SN, 19.04.2010, SAOS id 76440), jest zgodna z uzasadnieniem:
„wystarczające jest wykazanie przez pracodawcę prawidłowego powierzenia mienia pracownikowi i szkody powstałej wskutek
nierozliczenia się z niego, by przyjąć domniemanie zawinionego przez pracownika naruszenia obowiązku pieczy”.

Bez uwag prawnych: drogi i przejścia oraz składowanie (każdy paragraf zgodny; nowelizacje DU 2007/330, 2008/690,
2011/1034, 2021/2088, 2026/927 z § 30a od 11.01.2027, ppoż. 2024/1716 i 2026/1276 nie zmieniają użytych przepisów).
Niezależny rachunek w Pythonie: drogi 30 000 przypadków, składowanie 70 000, odpowiedzialność 30 000, monitoring
11 323 dni; 0 rozbieżności.

## Dla orkiestratora (poza zakresem plików pakietu)

- `src/data/sprawy.ts`, wpis `normy-sanitarne`: „toaleta w pracy” i „ile toalet w pracy” wygrywa monitoring (216 do 215),
  bo „pracy” jest w nazwie narzędzia. Proponowane hasła: `'toaleta w pracy'`, `'szatnia w pracy'` (sprawdzone przez
  weryfikatora B). Nie dopisałem ich, bo to wpis innego narzędzia.
- `szukaj-narzedzi.ts`: remis punktów rozstrzyga kolejność alfabetyczna („szkoda na zdrowiu w pracy”: 216 do 216 dla
  odpowiedzialności przed odszkodowaniem za wypadek). Proponowane hasło `'szkoda na zdrowiu'` dla
  `odszkodowanie-za-wypadek-przy-pracy` i `'potrącenie kary pieniężnej'` dla `kara-porzadkowa`.
- Linki zwrotne do tych czterech narzędzi z innych stron (`praca-na-wysokosci`, `czy-potrzebne-uprawnienia-udt`,
  `kara-porzadkowa`, `przedawnienie-wynagrodzenia`): żadna ich nie ma. `przedawnienie-wynagrodzenia` ma w FAQ to samo
  uproszczenie co A-1 („dowiedział się o szkodzie”).
- `src/lib/typografia.mjs`: brak jednostek V, kV, dB, więc „400 V” łamie się przy 320 px (opis pola linii w składowaniu).
- `src/lib/podobne.ts`: dla odpowiedzialności materialnej podobne to „Brutto na netto” zamiast kary porządkowej.

## Czego nie sprawdzono
- RODO (EUR-Lex blokuje automaty): strona cytuje art. 12 i 13 tylko przez art. 22² § 10 Kp; brzmienie RODO do ręcznego sprawdzenia.
- Polskie Normy (PN-EN 15620, 15635): strony nie podają z nich liczb.
- Orzecznictwo SN o art. 291 § 3 Kp (art. 442¹ czy art. 118 KC przy zbiegu z art. 471) i o art. 115/118 KC przy
  przedawnieniu (np. III CZP 8/03): wyszukiwanie pełnotekstowe SAOS zwracało „Przerwa techniczna”, sn.pl blokuje automaty.
- Czytnik ekranu na żywo (NVDA, VoiceOver) i WebKit: sprawdzone `ariaSnapshot`, atrybuty i Chromium.
