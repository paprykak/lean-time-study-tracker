# Fabryka Rytmu Hali: praca na wielu agentach

Prompt główny do rozbudowy serwisu przez wiele zespołów naraz. Zlecenie Patryka (2026-11-12): „Usuwasz też to, co nie
pasuje do nowej koncepcji. Pracuj na jak największej liczbie agentów. Wszystko ma być najwyższej jakości. Podziel pracę,
zaprojektuj od nowa, uporządkuj i zrób coś naprawdę mega, a potem stosuj ten prompt aż do końca tokenów”. Zasady
z `AGENTS.md` obowiązują bez wyjątków; ten plik ich nie zmienia, tylko organizuje pracę.

## 1. Koncepcja, której pilnuje każdy zespół

Rytm Hali to **darmowe narzędzia i przepisy dla ludzi z hali** (produkcja, magazyn, logistyka). Odpowiada na pytania
„czy wolno, czy muszę, ile mi się należy, jak zdać”: prawo pracy, wynagrodzenia i zasiłki, czas pracy i urlopy, BHP,
uprawnienia UDT i SEP. Wydajność i doskonalenie (OEE, SMED, ILUO, chronometraż, prognozy, ABC) należą do GembaHQ i tu
nie wracają (DECYZJE.md, 2026-11-11). Czytelnik to pracownik albo brygadzista na zmianie, często na telefonie.

Do serwisu pasuje: narzędzie, które liczy albo sprawdza coś z przepisu, oraz strona, która pomaga je znaleźć.
Nie pasuje: artykuły i materiały o wydajności, działy i tematy z czasów magazynu, treści bez przepisu w tle.

## 2. Role

**Orkiestrator** (sesja główna, gałąź robocza z AGENTS.md):
- dzieli pracę na pakiety, które się nie nakładają, i uruchamia dla każdego zespół w osobnej sesji w chmurze;
- czyta raporty, scala gałęzie zespołów, puszcza pełny `npm run check`, wdraża na `main`, robi test produkcji i IndexNow;
- jako jedyny wdraża na `main` i jako jedyny zapisuje decyzje w `DECYZJE.md`.

**Zespół** (osobna sesja w chmurze, własna gałąź `fabryka/<pakiet>`) dostaje jeden pakiet i używa własnych podagentów:
- *badacz prawa*: pobiera teksty aktów z API Sejmu, sprawdza akty zmieniające i daty wejścia w życie, cytuje przepisy;
- *budowniczy*: pisze logikę, testy, stronę i test E2E według wzoru z sekcji 4;
- *weryfikator prawny* (adwersarz): porównuje każde zdanie strony z cytatem z przepisu i szuka twierdzeń bez źródła;
- *weryfikator kodu i UX* (adwersarz): przypadki brzegowe, telefon 320 px, czytnik ekranu, typografia, odmiana;
- *redaktor*: prosty język, zdania krótkie, forma neutralna płciowo, bez porad prawnych.

Weryfikatorzy dostają pliki, a nie wnioski budowniczego. Każda uwaga o błędzie jest poprawiana; ulepszenia tylko wtedy,
gdy kosztują mniej niż akapit.

## 3. Pakiet roboczy

Każdy pakiet ma: cel, listę rzeczy do zrobienia albo obszar do zbadania, listę istniejących narzędzi (żeby nie dublować),
pliki, których zespół nie rusza, i warunek ukończenia. Pakiety się nie nakładają: dwa zespoły nigdy nie tworzą
narzędzia o tym samym temacie ani nie edytują tej samej istniejącej strony.

## 4. Standard narzędzia (wzór: `src/pages/narzedzia/okres-zasilkowy.astro` i `src/lib/narzedzia/okres-zasilkowy.ts`)

Pliki jednego narzędzia, wszystkie nowe:
- `src/lib/narzedzia/<nazwa>.ts`: czyste funkcje, komentarz na górze z przepisami (artykuł, paragraf, publikator) i opisem
  każdej przyjętej interpretacji;
- `src/lib/narzedzia/<nazwa>.test.ts`: oczekiwane wartości policzone niezależnie (osobny skrypt w Pythonie), przypadki
  brzegowe (29 lutego, koniec roku, święto, wartości graniczne progów), błędne dane;
- `src/pages/narzedzia/<slug>.astro`: `StronaNarzedzia`, formularz, wynik, sekcja „Jak liczymy”, 4–6 pytań FAQ;
- `tests/e2e/narzedzie-<nazwa>.spec.ts`: stałe daty, dopasowania z `\s` (twarde spacje), błąd danych;
- wpis w `src/data/narzedzia.ts` (przed wpisem `przerwy-w-pracy`), nowe akty w `src/data/prawo.ts`, jedna linijka
  w `STAN.md` w liście narzędzi. Tych trzech plików dotykasz tylko dopisując; scalanie gałęzi łączy dopiski (`.gitattributes`).
  `tests/e2e/strony.ts` bierze adresy narzędzi z rejestru: nie dopisuj tam nic.

Twarde zasady treści (każda wzięła się z błędu, który już raz wyszedł):
1. Każde twierdzenie prawne ma źródło w przepisie: tekst jednolity z API Sejmu (`api.sejm.gov.pl/eli`), akty zmieniające
   po dacie tekstu jednolitego i data wejścia w życie. Kopie tekstów w `.cache/narzedzia/prawo/` (poza repozytorium).
2. Gdy przepis czegoś nie rozstrzyga, narzędzie nie zgaduje: liczy według brzmienia przepisu, wybiera wariant bezpieczny
   dla pracownika (np. najwcześniejszy termin) i pisze w „Jak liczymy”, czego przepis nie mówi. Bez porad prawnych.
3. Serwisy, które blokują automaty (np. sn.pl), zostawiasz: bez obchodzenia blokad; zapisujesz w raporcie, co sprawdzić ręcznie.
4. Teksty w skryptach przeglądarki idą przez `typografia()` z `src/lib/typografia.mjs` (twarde spacje), liczby z
   rzeczownikiem przez `odmiana()` z `src/lib/redakcja.ts`, daty przez `dataPoPolsku` (kończy się „r.”, bez drugiej kropki).
5. FAQ to czysty tekst (bez HTML); linki do innych narzędzi tylko w sekcji wyjaśnienia.
6. Forma neutralna płciowo („pracujesz”, „przez ten rok”), nigdy „pracowałeś”.
7. Opcje list wyboru krótkie (telefon ucina długie); etykiety bez zbędnych słów.
8. Bez atrybutu `style=""` i bez skryptów spoza Astro (CSP z hashami); bez nowych zewnętrznych skryptów i ciasteczek.
9. Limity: `tytul` do 48 znaków, `opis` do 155, `krotko` w rejestrze do 110.
10. Zrzut z telefonu (Playwright, 412 px) przed oddaniem: nic nie ucięte, brak przewijania w bok.

## 5. Proces zespołu

1. Przeczytaj `AGENTS.md`, ten plik, `STAN.md` (lista narzędzi) i swój pakiet. Sprawdź, czy nie dublujesz istniejącego narzędzia.
2. Badacz prawa: teksty aktów, zmiany, cytaty. Bez źródła nie ma narzędzia: zamiast zgadywać, wybierz inny temat z obszaru.
3. Budowniczy: logika z testami (niezależny rachunek), strona, test E2E, wpisy w rejestrach.
4. Weryfikator prawny i weryfikator kodu działają niezależnie; poprawiasz wszystko, co znajdą.
5. `npm run -s check:szybki`, potem `BEZ_WEBKIT=1 npm run check` (ok. 11 minut) aż do EXIT 0; zrzut z telefonu.
6. Commit na gałęzi `fabryka/<pakiet>` (stopka commitów z instrukcji sesji) i `git push -u origin fabryka/<pakiet>`.
   **Nigdy nie wypychaj na `main`** i nie twórz pull requestów.
7. Ostatnia wiadomość to raport do orkiestratora: gałąź i ostatni commit, lista narzędzi (slug, przepisy, wynik checku),
   przyjęte interpretacje, czego nie sprawdzono, sprawy dla Patryka (najwyżej 3).

## 6. Integracja (orkiestrator)

1. `git fetch`, scalenie gałęzi zespołów po kolei na gałęzi roboczej; konflikty rozstrzygane ręcznie, bez gubienia wpisów.
2. Jeden pełny `BEZ_WEBKIT=1 npm run check` po scaleniu; czerwony wynik naprawia orkiestrator albo odsyła zespołowi.
3. Wdrożenie na `main` według AGENTS.md (zgoda „wdrażaj” jest w rozmowie z 2026-11-11), poczekać na koniec przebiegu CI,
   test produkcji nowych adresów, IndexNow.
4. Decyzje do `DECYZJE.md`, lekcje na koniec `prompty/01-budowa-portalu.md`, sprawy dla Patryka do `STAN.md`.
5. Następna runda: nowe pakiety z obszarów, które zostały, aż skończy się budżet.

## 7. Czego nie robi nikt

- Nie zakłada kont, nie wpisuje sekretów, nie kupuje i nie publikuje niczego poza wdrożeniem serwisu (AGENTS.md, zasady 2–3).
- Nie używa danych ani przykładów od pracodawców Patryka (zasada 4).
- Nie generuje stron hurtem pod wyszukiwarkę: każde narzędzie ma własny rachunek, przepis i sens (zasada 5).
- Nie zmienia tekstów stron zaufania i prawnych bez Patryka: nowe brzmienie przygotowuje jako projekt (`projekt: true`)
  i wpisuje do `STAN.md`.
