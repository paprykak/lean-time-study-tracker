# Rytm Hali: zasady pracy w repozytorium

Portal **Rytm Hali** (rytmhali.pl): niezależne medium o operacjach. Właściciel i redaktor naczelny: Patryk Korpyta. Rozmowy po polsku.
Pełne zadanie i fazy: `prompty/01-budowa-portalu.md`. Stan prac: `STAN.md`. Decyzje: `DECYZJE.md`.

## Zasady nieprzekraczalne

1. **Produkcja tylko po słowie „wdrażaj”.** Nic nie trafia na `main` bez zielonego `npm run check` i słowa „wdrażaj” od Patryka w bieżącej rozmowie. Funkcje powstają na gałęziach (lokalnie w worktree). Przed pushem: `git log origin/main..main` (ma być pusto, jeśli nie wdrażamy).
2. **Konta i sekrety.** Nie zakładasz kont, nie logujesz się za Patryka, nie przechodzisz CAPTCHA, nie wpisujesz ani nie przechowujesz haseł, tokenów ani kluczy API. Gdy krok wymaga konta, zakupu albo sekretu: przygotuj wszystko i daj Patrykowi jedną krótką instrukcję z linkiem. Sekrety tylko w Cloudflare (`wrangler secret put` albo panel).
3. **Zakupy i działania publiczne** (domeny, płatne usługi, publikacja profili) robi Patryk albo Ty po jego wyraźnym „tak”.
4. **Dane.** Zero danych, przykładów i zdjęć od pracodawców Patryka. Treści testowe są fikcyjne, oznaczone i nie trafiają na produkcję (`src/data/przyklady.ts` tylko dla `/styleguide`, później `draft: true` albo kolekcja testowa).
5. **Bez sztuczek SEO:** bez masowo generowanych stron, ukrytego tekstu i kupowania linków. Treści sponsorowane zawsze oznaczone („Materiał partnera”, „Reklama”), linki `rel="sponsored"`.
6. **Node.** Na komputerze Patryka w każdym poleceniu najpierw `source ~/.nvm/nvm.sh` (wersja z `.nvmrc`). W sesji w chmurze Node jest już w PATH.
7. **Testujesz sam:** komputer, telefon, klawiatura, czytnik ekranu w podstawowym zakresie. Patrykowi pokazujesz zrzuty i wyniki, a nie scenariusze do klikania.
8. **Lekcje.** Gdy Patryk coś poprawi albo proces zadziała inaczej, dopisz jednozdaniową lekcję z datą na końcu `prompty/01-budowa-portalu.md`.
9. **Zdjęcia** tylko prawdziwe, z rejestrem licencji (`marka/zdjecia/rejestr.json`: źródło, autor, licencja, podpis „Fot.”), CC0 albo CC BY, każde pobranie za zgodą Patryka.
10. **Nowy skrypt zewnętrzny** (analityka, osadzenia, reklamy) wymaga decyzji Patryka i oceny RODO. Domyślnie zero ciasteczek i skryptów stron trzecich.

## Polecenia

| Polecenie | Co robi |
|---|---|
| `npm run dev` | serwer deweloperski (http://localhost:4321) |
| `npm run build` | build do `dist/` |
| `npx astro preview --port 4322` | podgląd zbudowanej strony |
| `npm run check:szybki` | `astro check`, testy jednostkowe, build, kontrola SEO, budżet rozmiaru (to samo uruchamia Cloudflare przed wdrożeniem) |
| `npm run check` | `check:szybki` + E2E (komputer, Android, iPhone), axe, Lighthouse. Bez WebKita lokalnie: `BEZ_WEBKIT=1 npm run check` |
| `npm run zrzuty -- <katalog>` | zrzuty komputer/telefon/klawiatura do raportu po fazie (przy działającym podglądzie) |
| `npm run fonty` | podzbiór fontów Noto z polskimi znakami i `src/styles/fonty.css` |
| `npm run logo` | komplet plików logo (SVG, favicony, awatar, okładka) |

## Gdzie co jest

| Ścieżka | Zawartość |
|---|---|
| `src/styles/global.css` | tokeny (`@theme`), komponenty bazowe, typografia treści |
| `src/components/` | komponenty (nagłówek, karty, sloty reklamowe, newsletter, stopka…) |
| `src/layouts/Uklad.astro` | `<head>`, SEO, dane strukturalne, nagłówek i stopka |
| `src/pages/styleguide.astro` | strona wzorów (noindex): akceptacja wyglądu |
| `src/lib/` | logika (daty, kontrast, reklamy, stronicowanie, nagłówki HTTP, tryb budowania) z testami `*.test.ts` |
| `src/data/ustawienia.json` | nazwa, działy, menu, stopka, teksty newslettera (w F2 do panelu CMS) |
| `scripts/` | kontrola SEO, budżet, fonty, zrzuty |
| `marka/` | logo (generator i pliki), rejestr zdjęć |
| `tests/e2e/` | Playwright: strony, dostępność, układ |

## Jak pracujemy

- Kolejność faz i bramki: `prompty/01-budowa-portalu.md`, sekcje 8–9. Stopy na Patryka tylko przy: akceptacji wyglądu (F1), zakupach, kontach i sekretach, tekstach stron zaufania i prawnych, słowie „wdrażaj”, bramce publicznego startu.
- Każda decyzja z datą i uzasadnieniem w `DECYZJE.md`. Sprawy Patryka w `STAN.md`.
- Raport po fazie: najwyżej 15 linijek (co powstało, wyniki testów, zrzuty, czego nie sprawdzono, najwyżej 3 sprawy dla Patryka).
- CSP ma hashe w `<meta>`: bez atrybutów `style=""` i bez skryptów spoza Astro. Kontrola SEO to sprawdza.
- Pole zastępcze zamiast zdjęcia (`data-brak-zdjecia`) wolno pokazać tylko na `/styleguide`. Kontrola SEO blokuje je na innych stronach.
- Dokumentacja Astro: https://docs.astro.build (Astro 7: `astro dev --background`, `astro preview --ignore-lock`, gdy działa już inny podgląd).
