# Audyt jakości 3: wspólne zasady (2026-11-15)

Repozytorium: /home/user/lean-time-study-tracker (gałąź fabryka/jakosc3). Dziś jest 2026-11-15. Narzędzia mają działać
bez zarzutu teraz i po Nowym Roku (1 stycznia 2027 r. i później). Każde audytowane narzędzie przeszło już weryfikację
prawną i kodu w swoim zespole: szukasz tego, co tamci przeoczyli. Nie dostajesz wniosków zespołu, tylko pliki i przepisy.
Nie czytaj raportów zespołów (`raporty/odpowiedzialnosc/`, `raporty/hala/`, `raporty/prawa-pracownika/`) ani `raporty/jakosc3/` poza tym plikiem i swoim zadaniem.

## Twoja rola: AUDYTOR (tylko czytasz; w repozytorium tworzysz najwyżej swój plik raportu)
- Nie edytuj plików repozytorium, nie commituj, nie uruchamiaj `npm run build`, `npm run check`, `npm run dev`,
  `astro build` ani `playwright test` (inne agenty pracują równolegle w tym samym katalogu).
- Wolno: czytać pliki, `npx vitest run <konkretny plik testu>`, skrypty w Pythonie/Node w katalogu roboczym
  /tmp/claude-0/-home-user-lean-time-study-tracker/f9385693-a042-5077-9a0f-bb509ace4ae2/scratchpad/audyt/<partia>/ (niezależny rachunek), Playwright z `require('playwright')` (Chromium zainstalowany,
  `chromium.launch()` bez opcji) na gotowym podglądzie. Skrypty Node z Playwrightem uruchamiaj z katalogu repozytorium
  (`node /ścieżka/skrypt.cjs`).
- Podgląd zbudowanego portalu (zbudowany dziś z bieżącego kodu): http://127.0.0.1:4322/narzedzia/<slug>.html.
  Telefon: viewport 320×640 i 412×915, deviceScaleFactor 1. Czytnik ekranu: `page.accessibility.snapshot()` albo
  `page.locator(...).ariaSnapshot()` (kolejność, nazwy pól, role, region wyniku `aria-live`, komunikaty błędów).
- Wyszukiwarka serwisu na indeksie z podglądu: `node --experimental-strip-types /tmp/claude-0/-home-user-lean-time-study-tracker/f9385693-a042-5077-9a0f-bb509ace4ae2/scratchpad/szukaj.mjs "zapytanie" "zapytanie 2"`
  (pierwsze 5 wyników z punktami; logika: `src/lib/szukaj-narzedzi.ts`, hasła: `src/data/sprawy.ts`).
- Wynik zapisujesz do `raporty/jakosc3/<partia>.json` (jedyny plik, który tworzysz w repozytorium).

## Gdzie co jest
- Zasady treści: `prompty/02-fabryka.md`, sekcja 4 (12 twardych zasad). Konwencja terminów: `src/lib/narzedzia/terminy.ts`
  i `DECYZJE.md` (wpis „Runda 2”, 2026-11-13; o art. 115 KC wpis z 2026-11-15, ostatni punkt).
- Rejestr: `src/data/narzedzia.ts` (slug, krotko, przepisy, sprawdzono). Akty i kwoty: `src/data/prawo.ts`.
- Strona: `src/pages/narzedzia/<slug>.astro` (komponent `StronaNarzedzia`; skrypt przeglądarki w `<script>`).
- Pomocnicze: `src/lib/typografia.mjs` (`typografia()`), `src/lib/redakcja.ts` (`odmiana()`), `src/lib/narzedzia/format.ts`,
  `terminy.ts`, `formularz.ts`, `dzis-w-formularzu.ts`, `src/lib/daty.ts`.
- Teksty prawa (pobrane dziś z API Sejmu): `.cache/narzedzia/prawo/DU_<rok>_<poz>.txt` (pdftotext -layout; indeksy
  artykułów bywają rozbite: „art. 22²” może wyglądać jak „art. 222” albo „art. 22[2]”), metadane `.json`
  (pole `references`). Pliki `base_<rok>_<poz>.json` to metadane aktów pierwotnych z listą „Akty zmieniające”
  (pole `date` = wejście w życie). Nowelizacje po tekstach jednolitych, które już pobrałem:
  Kodeks pracy (t.j. DU_2026_1245): DU_2026_1046 (mobbing, od 5.11.2026); KC (t.j. DU_2026_795): DU_2026_507 (część od 2028 r.);
  ogólne przepisy BHP (t.j. DU_2003_1650): DU_2007_330, DU_2008_690, DU_2011_1034, DU_2021_2088, DU_2026_927 (§ 30a, od 11.01.2027);
  ochrona ppoż. (t.j. DU_2023_822): DU_2024_1716, DU_2026_1276; ustawa o PIP (t.j. DU_2024_1712): DU_2025_321, 368, 620, 769,
  DU_2026_160, DU_2026_473; ustawa o ochronie danych (t.j. DU_2019_1781): DU_2026_252, 548, 1003.
  Brakujące akty pobierz sam: `curl -s https://api.sejm.gov.pl/eli/acts/DU/<rok>/<poz>` (metadane), `/text.pdf`
  (+ `pdftotext -layout`), zapisz w tym samym katalogu. Sprawdź, czy tekst jednolity już zawiera nowelizację (data obwieszczenia).
- RODO (rozporządzenie 2016/679) jest w EUR-Lex, który blokuje automaty: nie obchodź blokady; to, czego nie da się
  sprawdzić, wpisz w `nie_sprawdzono`.
- Orzeczenia: Sąd Najwyższy z lat 1994–2016 i wiele wyroków sądów powszechnych mają pełne teksty w otwartym API SAOS:
  `curl -s 'https://www.saos.org.pl/api/search/judgments?caseNumber=II%20PK%20307/09'`, potem
  `curl -s https://www.saos.org.pl/api/judgments/<id>` (pole `data.textContent`). Tezę, na którą powołuje się strona,
  sprawdzasz w uzasadnieniu (dosłowny fragment do raportu), a nie w streszczeniu. sn.pl, NSA, PIP, UODO, zus.pl blokują
  automaty: zapisz, co sprawdzić ręcznie. Wyroki NSA są w CBOSA (orzeczenia.nsa.gov.pl), zwykle też blokowanym.

## Wymiary audytu (każde narzędzie z partii, wszystkie wymiary)
1. **Prawo**: KAŻDE zdanie strony (lead, tekst, FAQ, „Jak liczymy”, każdy wariant wyniku skryptu, etykiety i podpowiedzi
   pól, wpis w rejestrze `krotko`) i każda stała w logice zgodne z brzmieniem przepisu (cytuj jednostkę redakcyjną
   z pliku w .cache). Numer artykułu/paragrafu/ustępu się zgadza? Przepis aktualny (nowelizacje po tekście jednolitym,
   daty wejścia w życie, zmiany od 2027 r.)? Każda sygnatura orzeczenia: istnieje w SAOS, data i sąd się zgadzają,
   uzasadnienie mówi to, co strona mu przypisuje? Gdy przepis nie rozstrzyga, strona musi to powiedzieć i wybrać
   wariant bezpieczny dla pracownika (zasada 2).
2. **Rachunek**: niezależny rachunek w Pythonie (własna implementacja z przepisu, nie przepisanie kodu) i porównanie
   z logiką (np. przez skrypt Node z `--experimental-strip-types` importujący plik .ts albo przez vitest w scratchpadzie);
   przypadki brzegowe (0, wartości progowe ±1 i ±0,01, puste i błędne dane, bardzo duże liczby, daty: 29 lutego,
   przełom 2026/2027 i 2027/2028, święta, sobota); zgodność wyniku SSR (przykład domyślny) z wynikiem skryptu
   przeglądarki; wartości domyślne zależne od daty buildu. Wskaż luki w testach.
3. **Treść i UX**: „r..” po dacie, forma neutralna płciowo (nigdy „pracowałeś/zarobiłaś”, „sam/sama”), liczebnik
   z rzeczownikiem przez `odmiana()` („2 miesięcy”, „5 miesiące”, „1 dni” to błąd), twarde spacje w tekstach skryptu
   (`typografia()`), FAQ czysty tekst, linki do innych narzędzi tylko w wyjaśnieniu (czy slug istnieje, czy link prowadzi
   do właściwego narzędzia, czy brakuje oczywistego linku), sklejenie słowa z linkiem, krótkie opcje `<select>`
   (ucięte na 320 px), brak przewijania w bok na 320/412 px, nic nie ucięte (zrzut), dostępność (etykiety pól,
   `aria-live` wyniku, kolejność nagłówków, kolejność czytania, komunikat błędu powiązany z polem przez
   `aria-describedby`/`aria-invalid`, `role="alert"`, fieldset/legend przy grupach). Sprawdź na podglądzie
   Playwrightem: wpisz kilka wartości, w tym błędne i puste, porównaj tekst wyniku po przeliczeniu z SSR.
4. **Wyszukiwarka**: hasła narzędzia w `src/data/sprawy.ts`. Wymyśl co najmniej 15 prawdziwych zapytań ludzi z hali
   (potocznie, z literówkami bez polskich znaków, jak w Google) o sprawy tego narzędzia i sprawdź, czy narzędzie jest
   w pierwszej trójce. Sprawdź też odwrotnie: czy hasła tego narzędzia nie wypychają z pierwszego miejsca innego
   narzędzia, które lepiej odpowiada na zapytanie (np. „wózek widłowy” → uprawnienia UDT; „potrącenie z wypłaty” →
   narzędzie o potrąceniach). Podaj zapytanie, wynik i proponowaną zmianę hasła.
5. **Spójność**: te same sprawy opisane tak samo jak w innych narzędziach serwisu, linki do istniejących slugów,
   zgodność wpisu w rejestrze z treścią strony, akty w `przepisy` rejestru zgodne z tym, na co strona się powołuje.

## Co raportujesz
Tylko realne problemy z dowodem (błąd, nieścisłość prawna, ryzyko po 1.01.2027, luka w testach wartości brzegowych).
Bez gustu i bez przebudowy. Błędy w plikach wspólnych (strona główna, menu, stopka, `src/layouts/`,
`src/components/`, `src/lib/szukaj-narzedzi.ts`, kolekcje treści) wpisz w `poza_zakresem`.

Zapisz do `raporty/jakosc3/<partia>.json` i zwróć jako ostatnią wiadomość WYŁĄCZNIE ten sam blok ```json:
{
  "partia": "<nazwa>",
  "sprawdzone": [{"slug": "...", "pliki": ["..."], "wynik": "ok | problemy: krótko co sprawdzono (przepisy, liczba zdań, przypadki, zapytania)"}],
  "znaleziska": [{
    "id": "<partia>-<nr>", "slug": "...", "wymiar": "prawo|rachunek|tresc-ux|wyszukiwarka|spojnosc|testy",
    "waga": "krytyczna|wysoka|srednia|niska",
    "plik": "ścieżka", "linia": 123,
    "zdanie": "dosłowne zdanie strony albo opis przypadku",
    "problem": "jedno-dwa zdania",
    "dowod": "cytat przepisu z plikiem .cache i jednostką redakcyjną / wynik polecenia / opis zrzutu",
    "poprawka": "konkretnie co zmienić (kod, tekst, test)"
  }],
  "orzeczenia": [{"sygnatura": "...", "saos_id": 0, "wynik": "zgodne | niezgodne | brak w SAOS", "fragment": "dosłowny fragment uzasadnienia"}],
  "do_stanu": [{"sprawa": "kwota/akt jeszcze nieogłoszony", "kiedy_sprawdzic": "RRRR-MM-DD", "gdzie_w_kodzie": "..."}],
  "poza_zakresem": ["..."],
  "nie_sprawdzono": ["..."]
}
