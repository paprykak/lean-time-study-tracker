# STAN: gdzie jesteśmy

Pamięć robocza projektu. Czyta ją i aktualizuje każda sesja na początku i na końcu pracy.

## Teraz
- **Faza:** F0, F1 i **F2 gotowe** (F1 zaakceptowana przez Patryka 2026-11-06, z kursem: artykuły w stylu HBR, nie wiadomości). Teraz F3: szablony stron.
- **Gałąź robocza:** `ccr-a1f628ee-snc89w` (sesja w chmurze). `main` bez zmian: nadal stara aplikacja Lean Time Study Tracker, do pierwszego „wdrażaj”.
- **Do obejrzenia:** zrzuty F2 w `raporty/F2/` (artykuł z kolekcji treści, panel redakcji), podgląd strony głównej i artykułu (`raporty/podglad/`), strona wzorów `/styleguide` (lokalnie `npm run dev` → http://localhost:4321/styleguide), panel na lokalnych plikach: http://localhost:4321/admin/index.html.
- **Ostatnia sesja:** 2026-11-06, F2: kolekcje treści, strona artykułu `/<slug>` z kolekcji, okładki 1200×630, mapa strony z `lastmod`, panel Sveltia CMS (przepływ redakcyjny), worker z logowaniem do panelu, testy panelu. Wcześniej tego dnia: repozytorium wyczyszczone i zaadaptowane, fundament Astro 7, fonty, tokeny, logo (odtworzenie koncepcji C), 20 komponentów, `/styleguide`, „Wkrótce” (szkic), 404, testy. `npm run check` zielone lokalnie i w GitHub Actions (tam także iPhone/WebKit: 60 testów E2E na 3 urządzeniach, 52 zaliczone, 8 celowo pominiętych, np. test klawiatury na telefonie).

## Wyniki F1 (sekcja 3 promptu)
| Obszar | Wynik |
|---|---|
| Lighthouse (telefon) | `/` 99 / 100 / 100 / 100; `/styleguide` i `/404` 100 / 100 / 100 (SEO celowo pominięte przez noindex). LCP 0,8–1,0 s, CLS 0, TBT do 110 ms |
| Budżet | JS 0,5–0,9 KB, CSS 7–8 KB, fonty z preload 47 KB (gzip) |
| Dostępność | axe WCAG 2.2 AA: 0 błędów poważnych i krytycznych; klawiatura i widoczny fokus sprawdzone testem |
| Telefon | brak przewijania w bok przy 320 px, cele dotyku ≥ 44 px, menu działów przewijane kciukiem |
| Układ | CLS < 0,02 przy wczytaniu i przewijaniu, sloty reklamowe w wymiarach formatu |
| Bezpieczeństwo | CSP z hashami (bez `unsafe-inline` i `unsafe-eval`), komplet nagłówków w `_headers`; ocena securityheaders.com możliwa dopiero po wdrożeniu |
| Prywatność | zero żądań do domen spoza serwisu (test sieci) |

## Wyniki F2
| Obszar | Wynik |
|---|---|
| Próba z promptu | nowy wpis testowy w panelu → zapis pliku: 4–11 s (test E2E, 10 powtórzeń bez błędu); plik z panelu → strona podglądu z okładką: build 17 s. Twoja próba na prawdziwym podglądzie gałęzi czeka na Cloudflare (niżej) |
| Panel | konfiguracja zgodna ze schematem Sveltia 0.256.1 i ze schematami treści w obie strony (test łapie celowe błędy: brak pola, inna lista wyboru, inna długość, nieznana opcja) |
| Strona artykułu | axe WCAG 2.2 AA: 0 naruszeń (komputer i telefon), 0 błędów konsoli i CSP, jeden H1, bez przewijania w bok przy 320 px |
| Worker | 11 testów logowania (CSRF, tylko ta sama domena, CSP z hashem, `no-store`); uruchomiony w workerd: `/api/*` przez worker, reszta z plików, `/admin/` z własną CSP |

## Do zrobienia przez Patryka
Od góry według pilności. Każdy punkt to jedna czynność.
- [x] ~~Akceptacja wyglądu F1~~ (2026-11-06).
- [x] ~~Zgoda na zdjęcia~~ (2026-11-06: dopuszczone CC0, CC BY, Unsplash, Pexels; wybór powierzony redakcji, 10 zdjęć w rejestrze).
- [x] ~~Logo po szlifie~~ (2026-11-06: Patryk zaakceptował wersję z podtytułem wersalikami).
- [ ] **Decyzja: podpis tekstów pisanych z pomocą AI.** Propozycja: domyślnie „Redakcja Rytmu Hali”, Twoje nazwisko tylko pod tekstami, które sam napisałeś albo przeredagowałeś i przyjmujesz jako swoje; użycie AI opisane w ramce „Jak powstał ten tekst”. Odpowiedz „tak” albo podaj inną zasadę.
- [ ] **Pierwszy tekst skillem `/artykul`:** podaj temat albo napisz „wybierz sam” (dostaniesz 3 propozycje z tezą i luką w wynikach wyszukiwania).
- [ ] **Bio w panelu (po pierwszym logowaniu):** Autorzy → Patryk Korpyta: bio z doświadczeniem w operacjach, kompetencje, kwadratowe zdjęcie. Obecne bio to projekt.
- [ ] **Makiety (opcjonalnie):** skopiuj `makiety/` z `/home/patryk/Pulpit/rytm-hali/` do repozytorium; pomogą porównać szablony F3 z drugą makietą. Logo z repozytorium jest zaakceptowane, oryginały logo nie są potrzebne.
- [ ] **Opcjonalnie, więcej zdjęć:** klucz API Unsplash (darmowy, https://unsplash.com/oauth/applications → New Application). Bez klucza nie da się legalnie szukać w Unsplash automatycznie; klucz dodajesz sam w ustawieniach środowiska, nie w czacie.
- [ ] **Repozytorium:** to repozytorium jest **publiczne** i nazywa się `lean-time-study-tracker`. Prompt zakłada prywatne. GitHub → Settings → General: zmień nazwę na `rytm-hali` i na dole „Change repository visibility” → Private. https://github.com/paprykak/lean-time-study-tracker/settings
- [ ] **Domeny:** kup `rytmhali.pl` i `rytmhali.com` i dodaj je do Cloudflare (Add a domain). Bez tego nie da się wdrożyć produkcji.
- [ ] **Cloudflare, projekt Workers z repozytorium:** Workers & Pages → Create → Import a repository → to repozytorium. Build command: `npm run check:szybki`, deploy command: `npx wrangler deploy`, gałęzie inne niż `main`: włącz „Builds for non-production branches”. Potem Zero Trust → Access: zabezpiecz „Preview URLs” Workera (polityka: Twój e-mail). Instrukcja: https://developers.cloudflare.com/workers/ci-cd/builds/
- [ ] **Panel, pierwsze logowanie (gdy strona będzie na Cloudflare):** utwórz token https://github.com/settings/personal-access-tokens/new → Repository access: tylko to repozytorium → Permissions: Contents i Pull requests: Read and write → ważność 90 dni. Na rytmhali.pl/admin kliknij „Zaloguj się za pomocą tokenu dostępu” i wklej. Token zostaje w Twojej przeglądarce; nie wklejaj go w czacie.
- [ ] **Logowanie przez GitHub (wygodniejsze, po tokenie):** https://github.com/settings/applications/new → nazwa „Rytm Hali: panel”, Homepage `https://rytmhali.pl`, Authorization callback URL `https://rytmhali.pl/api/auth/callback` → Register. Potem w katalogu projektu: `npx wrangler secret put GITHUB_CLIENT_ID` (Client ID) i `npx wrangler secret put GITHUB_CLIENT_SECRET` (Generate a new client secret). Wartości wpisujesz tylko Ty.
- [ ] **Umami:** dodaj witrynę `rytmhali.pl` w https://cloud.umami.is i podaj identyfikator witryny (to nie jest sekret). Włączymy statystyki po decyzji przy F3.
- [ ] **Przed publicznym startem:** umowa o pracę (zakaz konkurencji, zgoda na działalność dodatkową); przed pierwszą reklamą: forma działalności i rozmowa z prawnikiem (lista pytań w F7). Pytanie do prawnika: czy Rytm Hali jako regularnie wydawany portal wymaga rejestracji tytułu prasowego w sądzie okręgowym (Prawo prasowe, art. 20) i co to zmienia (autoryzacja, sprostowania, redaktor naczelny).
- [ ] **Opcjonalnie: klucz OpenAlex** (darmowy, https://help.openalex.org/api/authentication/): lepsze wyszukiwanie badań w skillu `/artykul`. Klucz dodajesz sam w ustawieniach środowiska, nie w czacie.

## Następne kroki
0. Skill `/artykul` gotowy (2026-11-06): pierwszy tekst po decyzji o podpisie i wyborze tematu; po nim lekcje w skillu.
1. F3: szablony (główna, dział, temat, autor, artykuł, wyszukiwarka, newsletter, strony stałe, RSS) z kolekcji treści. Każda nowa trasa schodzi z listy `PLANOWANE` w `scripts/seo-check.mjs`; podglądy `/podglad/*` znikają, gdy zastąpią je prawdziwe szablony.
2. W F3: E2E, axe i Lighthouse dla strony artykułu z kolekcji. Produkcja nie ma jeszcze żadnego opublikowanego artykułu, więc testy muszą działać na buildzie z wpisem testowym (np. drugi build z `RH_PODGLAD=1` w CI). W F2 sprawdzone ręcznie skryptem (wyniki wyżej).
3. W F3: rysunki w treści artykułu tylko z rejestru zdjęć (komponent w Markdownie albo pole listy), bo panel nie pozwala wstawiać obrazów wprost.
4. W F3: LCP podglądu strony głównej 1,8 s (limit 2,0 s) – sprawdzić przy prawdziwym szablonie (mniejszy wariant zdjęcia czołówki na telefonie albo preload).
5. Po podłączeniu Cloudflare: sprawdzić, czy panel widzi podgląd gałęzi (przycisk „Wyświetl podgląd”); jeśli nie, ustawić `backend.preview_context` na nazwę kontroli Workers Builds. Po zmianie nazwy repozytorium: `backend.repo` w `public/admin/config.yml`.
6. W F4: obrazy 16:9, 4:3 i 1:1 w danych strukturalnych artykułu (teraz okładka 1200×630).

## Notatki
- W sesji w chmurze nie ma WebKita: lokalnie `BEZ_WEBKIT=1 npm run check`, iPhone w GitHub Actions.
- `astro preview` w Astro 7 nie startuje drugi raz, gdy podgląd już działa: `--ignore-lock` albo `npx astro preview stop`.
- Test panelu (`src/lib/panel.test.ts`) czyta schematy z `.astro/collections/`: tworzy je `npx astro sync` (robi to `astro check` na początku `npm run check`).
- Aktualizacja Sveltia CMS: nowa wersja w `package.json` (`@sveltia/cms`, dokładna) i w `public/admin/index.html`; `npx vitest run src/lib/panel.test.ts` poda nową sumę SRI i sprawdzi konfigurację z nowym schematem, `npx playwright test tests/e2e/panel.spec.ts --project=komputer` sprawdzi panel.
- Fonty generuje `npm run fonty` (wymaga `fonts-liberation` do metryki fontu zapasowego); logo `npm run logo`.
