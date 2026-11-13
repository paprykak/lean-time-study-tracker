# Wspólne zasady audytu narzędzi Rytmu Hali (2026-11-12)

Repozytorium: /home/user/lean-time-study-tracker (gałąź fabryka/jakosc). Dziś jest 2026-11-12. Narzędzia mają działać
bez zarzutu teraz i po Nowym Roku (1 stycznia 2027 r. i później).

## Twoja rola: AUDYTOR (tylko czytasz, NIC nie zmieniasz w repozytorium)
- Nie edytuj plików repozytorium, nie commituj, nie uruchamiaj `npm run build`, `npm run check`, `npm run dev`,
  `astro build` ani `playwright test` (inne agenty pracują równolegle w tym samym katalogu).
- Wolno: czytać pliki, `npx vitest run <konkretny plik testu>`, skrypty w Pythonie/Node w swoim katalogu
  roboczym /tmp/claude-0/-home-user-lean-time-study-tracker/85e7a3e9-bef9-5b60-93fa-46f6f146f579/scratchpad/audyt/<twoja-partia>/
  (np. niezależny rachunek), Playwright z `require('playwright')` (Chromium jest zainstalowany) na gotowym podglądzie.
- Podgląd zbudowanego portalu (wszystkie narzędzia): http://127.0.0.1:4322/narzedzia/<slug>.html (statyczny serwer;
  zbudowany dziś z bieżącego kodu). Telefon: viewport 320×640 i 412×915, deviceScaleFactor 1.

## Gdzie co jest
- Rejestr: `src/data/narzedzia.ts` (slug, krotko, przepisy, sprawdzono). Akty i kwoty: `src/data/prawo.ts`.
- Strona: `src/pages/narzedzia/<slug>.astro` (komponent `StronaNarzedzia`; skrypt przeglądarki w `<script>`).
- Logika: `src/lib/narzedzia/*.ts` (pliki importowane przez stronę) i testy `*.test.ts`. Pomocnicze: `src/lib/typografia.mjs`
  (`typografia()`), `src/lib/redakcja.ts` (`odmiana()`), `src/lib/narzedzia/format.ts`, `src/lib/narzedzia/terminy.ts`, `src/lib/daty.ts`.
- E2E: `tests/e2e/narzedzie-*.spec.ts` (znajdź grepem po slugu).
- Teksty prawa (pobrane dziś z API Sejmu): `.cache/narzedzia/prawo/DU_<rok>_<poz>.txt` i `MP_<rok>_<poz>.txt`, metadane `.json`
  (pole `references`: m.in. „Akty zmieniające”, „Inf. o tekście jednolitym”). Brakujące akty pobierz sam:
  `curl -s https://api.sejm.gov.pl/eli/acts/DU/<rok>/<poz>` (metadane), `/text.html` albo `/text.pdf` (+ `pdftotext -layout`),
  zapisz do tego samego katalogu. Lista aktów z roku: `https://api.sejm.gov.pl/eli/acts/DU/2026` i `/MP/2026` (JSON, duże;
  filtruj po tytule, np. Pythonem). Wyszukiwanie: `https://api.sejm.gov.pl/eli/acts/search?publisher=MP&year=2026&title=<fraza>`.
  Serwisy blokujące automaty (np. sn.pl) zostaw i zapisz, co sprawdzić ręcznie.

## Wymiary audytu (każde narzędzie z partii, wszystkie wymiary)
1. **Poprawność prawna**: każde twierdzenie na stronie (tekst, FAQ, „Jak liczymy”, wynik skryptu) i każda stała w logice
   zgodne z brzmieniem przepisu (cytuj artykuł/paragraf z pliku w .cache). Przepisy zmienione po dacie tekstu jednolitego
   (akty zmieniające z `references`, daty wejścia w życie, także zmiany wchodzące w życie w 2027 r.). Kwoty zależne od daty,
   które zmienią się 1 stycznia 2027 r. albo co kwartał/rok (płaca minimalna 2027, komunikaty GUS i ZUS, wskaźniki
   waloryzacji, limity): czy kod po tej dacie użyje dobrej kwoty, czy po cichu starej; czy nowa kwota jest już ogłoszona
   w M.P./Dz.U. (sprawdź w API Sejmu) – podaj publikator i datę obowiązywania.
2. **Rachunek**: przypadki brzegowe (29 lutego, przełom roku 2026/2027 i 2027/2028, święta, 0, wartości progowe ±1, puste
   i błędne dane), zgodność wyniku renderowanego na serwerze (SSR, przykład domyślny) z wynikiem skryptu przeglądarki
   (ta sama funkcja i te same dane wejściowe?), wartości domyślne zależne od daty buildu (co się stanie w 2027/2028 r.;
   czy tabele kończą się na 2027 r. i co wtedy). Policz niezależnie (Python) kilka przypadków. Wskaż luki w testach.
3. **Treść i UX** (twarde zasady z `prompty/02-fabryka.md`, sekcja 4): podwójna kropka po dacie („r..”), forma neutralna
   płciowo (nigdy „pracowałeś/zarobiłaś”), odmiana liczebników z rzeczownikiem przez `odmiana()` (np. „1 dni”, „22 dni” ok,
   „2 miesięcy” źle, „5 miesiące” źle), twarde spacje w tekstach skryptu (`typografia()`), FAQ czysty tekst bez HTML,
   linki do narzędzi tylko w wyjaśnieniu, krótkie opcje `<select>` (ucięte na 320 px), brak przewijania w bok na 320/412 px,
   dostępność (etykiety pól, `aria-live` wyniku, kolejność nagłówków, komunikat błędu powiązany z polem). Sprawdź na
   podglądzie Playwrightem (zrzuty do swojego katalogu, wpisz w formularz kilka wartości, w tym błędne).
4. **Spójność**: te same sprawy liczone tak samo jak w innych narzędziach (wiek, terminy w dniach/miesiącach – art. 111–115 KC,
   dni robocze, wymiar, płaca minimalna z `prawo.ts`, staż), linki między narzędziami (czy prowadzą do istniejących slugów,
   czy brakuje oczywistego linku), zgodność wpisu w rejestrze (`krotko`, `przepisy`) z treścią strony.

## Co raportujesz
Tylko realne problemy (błąd, nieścisłość prawna, ryzyko po 1.01.2027, luka w testach wartościach brzegowych) z dowodem.
Bez gustu i bez przebudowy. Nie zgłaszaj rzeczy w plikach, których zespół nie rusza (strona główna, menu, stopka,
`src/layouts/`, kolekcje treści, `src/components/StronaNarzedzia.astro`) – jeśli tam jest błąd, dopisz go w `poza_zakresem`.

Ostatnia wiadomość: WYŁĄCZNIE blok ```json z obiektem:
{
  "partia": "<nazwa>",
  "sprawdzone": [{"slug": "...", "pliki": ["..."], "wynik": "ok | problemy"}],
  "znaleziska": [{
    "id": "<partia>-<nr>", "slug": "...", "wymiar": "prawo|rachunek|tresc-ux|spojnosc|testy",
    "waga": "krytyczna|wysoka|srednia|niska",
    "plik": "ścieżka", "linia": 123,
    "problem": "jedno-dwa zdania",
    "dowod": "cytat przepisu z plikiem .cache i jednostką redakcyjną / wynik polecenia / opis zrzutu",
    "poprawka": "konkretnie co zmienić (kod, tekst, test)"
  }],
  "do_stanu": [{"sprawa": "kwota/akt jeszcze nieogłoszony", "kiedy_sprawdzic": "RRRR-MM-DD", "gdzie_w_kodzie": "..."}],
  "poza_zakresem": ["..."],
  "nie_sprawdzono": ["..."]
}
