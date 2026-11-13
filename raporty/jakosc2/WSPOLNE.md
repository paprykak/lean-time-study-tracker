# Audyt jakości 2: wspólne zasady (2026-11-13)

Repozytorium: /home/user/lean-time-study-tracker (gałąź fabryka/jakosc2). Dziś jest 2026-11-13. Narzędzia mają działać
bez zarzutu teraz i po Nowym Roku (1 stycznia 2027 r. i później). Każde audytowane narzędzie przeszło już weryfikację
prawną i kodu w swoim zespole: szukasz tego, co tamci przeoczyli. Nie dostajesz wniosków zespołu, tylko pliki i przepisy.

## Twoja rola: AUDYTOR (tylko czytasz, w repozytorium zmieniasz najwyżej swój plik raportu)
- Nie edytuj plików repozytorium, nie commituj, nie uruchamiaj `npm run build`, `npm run check`, `npm run dev`,
  `astro build` ani `playwright test` (inne agenty pracują równolegle w tym samym katalogu).
- Wolno: czytać pliki, `npx vitest run <konkretny plik testu>`, skrypty w Pythonie/Node w katalogu roboczym
  /tmp/claude-0/-home-user-lean-time-study-tracker/ac06a219-4538-5f71-b234-1eeb6f3157ac/scratchpad/audyt/<partia>/
  (niezależny rachunek), Playwright z `require('playwright')` (Chromium zainstalowany, `chromium.launch()` bez opcji)
  na gotowym podglądzie. Skrypty Node z Playwrightem uruchamiaj z katalogu repozytorium (`node /ścieżka/skrypt.cjs`).
- Podgląd zbudowanego portalu (wszystkie narzędzia, zbudowany dziś z bieżącego kodu):
  http://127.0.0.1:4322/narzedzia/<slug>.html. Telefon: viewport 320×640 i 412×915, deviceScaleFactor 1.
- Wynik zapisujesz do `raporty/jakosc2/<partia>.json` (jedyny plik, który tworzysz w repozytorium).

## Gdzie co jest
- Zasady treści: `prompty/02-fabryka.md`, sekcja 4 (11 twardych zasad). Konwencja terminów: `src/lib/narzedzia/terminy.ts`
  i `DECYZJE.md` (wpis „Runda 2”, 2026-11-13): termin od zdarzenia → `dodajMiesiace` (art. 112 KC, brak dnia → ostatni
  dzień miesiąca); okres liczony z pierwszym dniem → `koniecOkresu`/`pelneMiesiace`; przepisy szczególne bez zmian.
- Rejestr: `src/data/narzedzia.ts` (slug, krotko, przepisy, sprawdzono). Akty i kwoty: `src/data/prawo.ts`.
- Strona: `src/pages/narzedzia/<slug>.astro` (komponent `StronaNarzedzia`; skrypt przeglądarki w `<script>`).
- Logika: `src/lib/narzedzia/*.ts` i testy `*.test.ts`. Pomocnicze: `src/lib/typografia.mjs` (`typografia()`),
  `src/lib/redakcja.ts` (`odmiana()`), `src/lib/narzedzia/format.ts`, `terminy.ts`, `dzis-w-formularzu.ts`, `src/lib/daty.ts`.
- E2E: `tests/e2e/narzedzie-*.spec.ts`.
- Teksty prawa (pobrane dziś z API Sejmu): `.cache/narzedzia/prawo/DU_<rok>_<poz>.txt` i `MP_<rok>_<poz>.txt`, metadane
  `.json` (pole `references`: m.in. „Akty zmieniające”, „Inf. o tekście jednolitym”, pole `inForce`, `entryIntoForce`).
  Brakujące akty pobierz sam: `curl -s https://api.sejm.gov.pl/eli/acts/DU/<rok>/<poz>` (metadane), `/text.html` albo
  `/text.pdf` (+ `pdftotext -layout`), zapisz w tym samym katalogu. Wyszukiwanie:
  `https://api.sejm.gov.pl/eli/acts/search?publisher=DU&year=2026&title=<fraza>`. Akty zmieniające po dacie tekstu
  jednolitego sprawdzaj w `references` i w wyszukiwarce (także ogłoszone w 2026 r. z wejściem w życie w 2027 r.).
  Serwisy blokujące automaty (np. sn.pl, zus.pl) zostaw i zapisz, co sprawdzić ręcznie.

## Wymiary audytu (każde narzędzie z partii, wszystkie wymiary)
1. **Prawo**: każde twierdzenie na stronie (lead, tekst, FAQ, „Jak liczymy”, wynik skryptu, wpis w rejestrze) i każda
   stała w logice zgodne z brzmieniem przepisu (cytuj jednostkę redakcyjną z pliku w .cache). Numer artykułu/paragrafu
   się zgadza? Przepis aktualny (akty zmieniające, daty wejścia w życie, zmiany od 2027 r.)? Kwoty zależne od daty
   (płaca minimalna 2027, komunikaty GUS i ZUS, waloryzacje, limity, progi podatkowe): czy kod po zmianie użyje dobrej
   kwoty, czy po cichu starej; czy nowa kwota jest już ogłoszona (publikator i data obowiązywania).
2. **Rachunek**: niezależny rachunek w Pythonie kilku przypadków; przypadki brzegowe (29 lutego, przełom 2026/2027
   i 2027/2028, święta, 0, wartości progowe ±1, puste i błędne dane); zgodność wyniku SSR (przykład domyślny) z wynikiem
   skryptu przeglądarki; wartości domyślne zależne od daty buildu (co w 2027/2028 r., gdy tabele się kończą);
   konwencja terminów. Wskaż luki w testach.
3. **Treść i UX**: „r..” po dacie, forma neutralna płciowo (nigdy „pracowałeś/zarobiłaś”), liczebnik z rzeczownikiem
   przez `odmiana()` („2 miesięcy”, „5 miesiące”, „1 dni” to błąd), twarde spacje w tekstach skryptu (`typografia()`),
   FAQ czysty tekst, linki do narzędzi tylko w wyjaśnieniu, sklejenie słowa z linkiem, krótkie opcje `<select>`
   (ucięte na 320 px), brak przewijania w bok na 320/412 px, dostępność (etykiety pól, `aria-live` wyniku, kolejność
   nagłówków, komunikat błędu powiązany z polem przez `aria-describedby`/`aria-invalid`). Sprawdź na podglądzie
   Playwrightem: wpisz kilka wartości, w tym błędne i puste, porównaj tekst wyniku po przeliczeniu z SSR.
4. **Spójność**: te same sprawy liczone tak samo jak w innych narzędziach (wiek, terminy, dni robocze, wymiar, płaca
   minimalna z `prawo.ts`, staż), linki do istniejących slugów, zgodność wpisu w rejestrze z treścią strony.

## Co raportujesz
Tylko realne problemy z dowodem (błąd, nieścisłość prawna, ryzyko po 1.01.2027, luka w testach wartości brzegowych).
Bez gustu i bez przebudowy. Błędy w plikach wspólnych (strona główna, menu, stopka, `src/layouts/`,
`src/components/StronaNarzedzia.astro`, kolekcje treści) wpisz w `poza_zakresem`.

Zapisz do `raporty/jakosc2/<partia>.json` i zwróć jako ostatnią wiadomość WYŁĄCZNIE ten sam blok ```json:
{
  "partia": "<nazwa>",
  "sprawdzone": [{"slug": "...", "pliki": ["..."], "wynik": "ok | problemy: krótko co sprawdzono"}],
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
