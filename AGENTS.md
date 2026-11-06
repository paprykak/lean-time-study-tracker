# Rytm Hali: zasady pracy w repozytorium

Portal **Rytm Hali** (rytmhali.pl): niezależne medium o operacjach. Właściciel i redaktor naczelny: Patryk Korpyta. Rozmowy po polsku.
Pełne zadanie i fazy: `prompty/01-budowa-portalu.md`. Stan prac: `STAN.md`. Decyzje: `DECYZJE.md`. Lista kontrolna startu: `START.md`.

## Zasady nieprzekraczalne

1. **Produkcja tylko po słowie „wdrażaj”.** Nic nie trafia na `main` bez zielonego `npm run check` i słowa „wdrażaj” od Patryka w bieżącej rozmowie. Funkcje powstają na gałęziach (lokalnie w worktree). Przed pushem: `git log origin/main..main` (ma być pusto, jeśli nie wdrażamy).
2. **Konta i sekrety.** Nie zakładasz kont, nie logujesz się za Patryka, nie przechodzisz CAPTCHA, nie wpisujesz ani nie przechowujesz haseł, tokenów ani kluczy API. Gdy krok wymaga konta, zakupu albo sekretu: przygotuj wszystko i daj Patrykowi jedną krótką instrukcję z linkiem. Sekrety tylko w Cloudflare (`wrangler secret put` albo panel).
3. **Zakupy i działania publiczne** (domeny, płatne usługi, publikacja profili) robi Patryk albo Ty po jego wyraźnym „tak”.
4. **Dane.** Zero danych, przykładów i zdjęć od pracodawców Patryka. Treści testowe są fikcyjne, oznaczone i nie trafiają na produkcję (`src/data/przyklady.ts` i `src/data/podglad.ts` tylko dla `/styleguide` i `/podglad/*`; wpisy w kolekcjach z polami `testowy: true` i `szkic: true`, które produkcja pomija).
5. **Bez sztuczek SEO:** bez masowo generowanych stron, ukrytego tekstu i kupowania linków. Treści sponsorowane zawsze oznaczone („Materiał partnera”, „Reklama”), linki `rel="sponsored"`.
6. **Node.** Na komputerze Patryka w każdym poleceniu najpierw `source ~/.nvm/nvm.sh` (wersja z `.nvmrc`). W sesji w chmurze Node jest już w PATH.
7. **Testujesz sam:** komputer, telefon, klawiatura, czytnik ekranu w podstawowym zakresie. Patrykowi pokazujesz zrzuty i wyniki, a nie scenariusze do klikania.
8. **Lekcje.** Gdy Patryk coś poprawi albo proces zadziała inaczej, dopisz jednozdaniową lekcję z datą na końcu `prompty/01-budowa-portalu.md`.
9. **Zdjęcia** tylko prawdziwe, z wpisem w rejestrze licencji przed użyciem (kolekcja `src/content/zdjecia/`, w panelu „Zdjęcia”: źródło, autor, licencja, podpis „Fot.”). Dozwolone: CC0, CC BY, licencja Unsplash i licencja Pexels (decyzja Patryka z 2026-11-06, wybór zdjęć powierzony redakcji). Bez CC BY-SA, bez rozpoznawalnych marek i logo, bez zdjęć od pracodawców Patryka. Pobieranie: `npm run zdjecia`.
10. **Nowy skrypt zewnętrzny** (analityka, osadzenia, reklamy) wymaga decyzji Patryka i oceny RODO. Domyślnie zero ciasteczek i skryptów stron trzecich.

## Polecenia

| Polecenie | Co robi |
|---|---|
| `npm run dev` | serwer deweloperski (http://localhost:4321) |
| `npm run build` | build do `dist/` |
| `npx astro preview --port 4322` | podgląd zbudowanej strony |
| `npm run check:szybki` | `astro check`, testy jednostkowe, build, kontrola SEO, budżet rozmiaru (to samo uruchamia Cloudflare przed wdrożeniem) |
| `npm run check` | build testowy (`RH_TESTOWE=1`: cały portal z treściami testowymi) + `check:szybki`, E2E (komputer, Android, iPhone), axe, Lighthouse, na końcu `check:start` (build produkcji przed startem). Bez WebKita lokalnie: `BEZ_WEBKIT=1 npm run check` |
| `RH_PODGLAD=1 npm run build` | podgląd jak na gałęzi w Cloudflare: cały portal, wszystkie treści, wszędzie noindex |
| `npm run zrzuty -- <katalog>` | zrzuty komputer/telefon/klawiatura do raportu po fazie (przy działającym podglądzie) |
| `npm run fonty` | podzbiór fontów Noto z polskimi znakami i `src/styles/fonty.css` |
| `npm run logo` | komplet plików logo (SVG, favicony, awatar, okładka); warianty: `node marka/logo/porownaj.mjs <plik.png>` |
| `npm run zdjecia` | pobiera brakujące zdjęcia z rejestru licencji, kadruje i zapisuje do `src/assets/zdjecia/` |
| panel lokalnie | `npm run dev` → http://localhost:4321/admin/index.html → „Pracuj z lokalnym repozytorium” (Chrome/Edge, zapis prosto do plików) |
| `npm run test:produkcja` | test żywej strony po każdym wdrożeniu: nagłówki, indeksowanie, robots, każdy adres z mapy strony, klucz IndexNow, 404, formularze; `--adres <podgląd> --podglad` dla gałęzi, `--domeny` dla przekierowań. Lokalnie na buildzie: `npx wrangler dev` i `--adres http://127.0.0.1:8787` |
| `npm run indexnow -- <ścieżki>` | zgłasza adresy do IndexNow (Bing i inne) **tylko po wdrożeniu produkcji**; `--mapa` zgłasza całą mapę strony z `dist/`, `--proba` tylko wypisuje zgłoszenie |
| `npm run raport-kampanii -- <id>` | raport kampanii dla partnera z API Umami (wyświetlenia, kliknięcia, CTR według miejsc; na ekran, nie do repozytorium). Wymaga `UMAMI_API_KEY` i `UMAMI_WEBSITE_ID` w środowisku Patryka |
| `npx wrangler dev` | worker z `/api/*` i plikami z `dist/` lokalnie (sekrety testowe: `--var NAZWA:wartość`, nigdy prawdziwe) |

## Gdzie co jest

| Ścieżka | Zawartość |
|---|---|
| `src/styles/global.css` | tokeny (`@theme`), komponenty bazowe, typografia treści |
| `src/components/` | komponenty (nagłówek, karty, sloty reklamowe, newsletter, stopka…) |
| `src/layouts/Uklad.astro` | `<head>`, SEO, dane strukturalne, nagłówek i stopka |
| `src/pages/styleguide.astro` | strona wzorów (noindex): akceptacja wyglądu |
| `src/lib/` | logika (daty, kontrast, reklamy, stronicowanie, nagłówki HTTP, tryb budowania) z testami `*.test.ts` |
| `src/content.config.ts`, `src/content/` | model treści (schematy zod) i treści: artykuły, materiały, rejestr zdjęć, autorzy, działy, tematy, partnerzy, kampanie |
| `public/admin/` | panel redakcji Sveltia CMS (`config.yml`; wersja skryptu przypięta z sumą SRI w `index.html` i `package.json`) |
| `worker/` | Worker Cloudflare dla `/api/*`: logowanie do panelu przez GitHub, zapis na newsletter (Brevo, podwójne potwierdzenie) i formularz kontaktowy (Email Routing) w `formularze.js`; dalej 410 |
| `src/lib/markdown.mjs` | wtyczki Markdowna (silnik Sätteri w Astro 7): przypisy `[n]` do źródeł, rysunki z podpisem, tabele, miejsce reklamy po 3. akapicie, rel linków |
| `src/content/strony/` | strony stałe (O nas, zasady, korekty, reklamy, AI, kontakt, polityka prywatności, regulamin newslettera, stopka redakcyjna, reklama, newsletter); `projekt: true` = projekt do akceptacji Patryka |
| `prawne/` | lista pytań do prawnika przed startem (F7) |
| `src/content/testowe/` | fikcyjne artykuły i materiał do testów szablonów (tylko podgląd i build testowy; panel ich nie widzi) |
| `src/data/ustawienia.json` | nazwa, menu, pasek tematów, stopka, teksty newslettera (edycja w panelu: „Ustawienia serwisu”) |
| `scripts/` | kontrola SEO, budżet, fonty, zrzuty |
| `marka/` | logo (generator i pliki), wybór zdjęć z uzasadnieniem (`marka/zdjecia/kandydaci.md`) |
| `tests/e2e/` | Playwright: strony, dostępność, układ, panel redakcji (konfiguracja i próba zapisu wpisu) |

## Skille projektu

| Skill | Do czego |
|---|---|
| `/artykul` | Artykuł od tematu do szkicu: research w badaniach i danych publicznych, przypisy, rzemiosło pisania (`pisanie.md`), niezależna weryfikacja faktów, redaktor językowy i czytelnik testowy, zdjęcie z otwartej licencji, karta jakości (`.claude/skills/artykul/`). Bez oznaczeń AI; każdy tekst przed publikacją czyta i zatwierdza Patryk. Teczki artykułów w `redakcja/<slug>/` |

Polecenia skilla: `npm run redakcja:zdjecia` (kandydaci na zdjęcie i stykówka), `npm run redakcja:zrodla -- <slug>` (adresy, DOI, wycofane badania), `npm run redakcja:kontrola -- <slug>` (przypisy, liczby i wnioski z badań bez źródła, frazy z tekstów generowanych, czytelność, rytm, styl). Kontrolę tekstu każdego nietestowego artykułu uruchamia też `npm run check`.

## Tryby budowania (`src/lib/srodowisko.mjs`)

| Tryb | Kiedy | Co zawiera |
|---|---|---|
| produkcja przed startem | `main` w Cloudflare, `npm run build` | tylko „Wkrótce”, 404, 410, polityka prywatności, strony newslettera (reszta usunięta z `dist/`, `src/lib/przed-startem.mjs`) |
| podgląd | inne gałęzie w Cloudflare, `RH_PODGLAD=1` | cały portal, szkice, wpisy testowe i fikcyjne treści z `src/content/testowe/`, wszędzie noindex |
| build testowy | `RH_TESTOWE=1` (tylko `npm run check` i CI) | jak podgląd, ale z zachowaniem produkcji (indeksowanie, kanoniczne, mapa strony); nigdy do wdrożenia |
| produkcja po starcie | `START = true` w `srodowisko.mjs` (F8, na „wdrażaj”) | cały portal, tylko opublikowane treści |

## Jak pracujemy

- Kolejność faz i bramki: `prompty/01-budowa-portalu.md`, sekcje 8–9. Stopy na Patryka tylko przy: akceptacji wyglądu (F1), zakupach, kontach i sekretach, tekstach stron zaufania i prawnych, słowie „wdrażaj”, bramce publicznego startu.
- Każda decyzja z datą i uzasadnieniem w `DECYZJE.md`. Sprawy Patryka w `STAN.md`.
- Raport po fazie: najwyżej 15 linijek (co powstało, wyniki testów, zrzuty, czego nie sprawdzono, najwyżej 3 sprawy dla Patryka).
- CSP ma hashe w `<meta>`: bez atrybutów `style=""` i bez skryptów spoza Astro. Kontrola SEO to sprawdza.
- **Pole treści zmieniasz w dwóch miejscach naraz:** schemat w `src/content.config.ts` i pole w `public/admin/config.yml`. Test `src/lib/panel.test.ts` porównuje je ze schematami generowanymi przez `astro sync` (nazwy, wymagalność, listy wyboru, relacje, długości).
- **Markdown w Astro 7 to silnik Sätteri:** wtyczki rehype i remark nie działają; wtyczki serwisu mają API Sätteri (`src/lib/markdown.mjs`, testy na prawdziwym silniku).
- **Zdjęcia w danych** zapisujemy ścieżką od katalogu projektu (`/src/assets/zdjecia/plik.webp`), bo tak zapisuje je panel, a Astro je wtedy optymalizuje; brak pliku zatrzymuje build.
- Pole zastępcze zamiast zdjęcia (`data-brak-zdjecia`) wolno pokazać tylko na `/styleguide`. Kontrola SEO blokuje je na innych stronach.
- Dokumentacja Astro: https://docs.astro.build (Astro 7: `astro dev --background`, `astro preview --ignore-lock`, gdy działa już inny podgląd).
