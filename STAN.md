# STAN: gdzie jesteśmy

Pamięć robocza projektu. Czyta ją i aktualizuje każda sesja na początku i na końcu pracy.

## Teraz
- **Faza:** F8, start 2026-11-07: pełny portal na https://rytmhali.pl (`START = true`, decyzja Patryka: bez bramki 12 tekstów). Opublikowane: 11 stron stałych (zatwierdzone), tekst „Ta sama zmiana może mieć 56 albo 91% OEE…” i karta definicji OEE. Formularze newslettera i kontaktu wyłączone do konfiguracji kont (`FORMULARZE` w `src/lib/srodowisko.mjs`); strona pokazuje „Zapisy ruszą wkrótce”. Tekst o prognozach w weryfikacji (sesja w chmurze).
- **Gałęzie:** `main` = produkcja (od `ed03418`); każdy commit na `main`, także z panelu, to publikacja na żywej stronie po zielonym `check:szybki`. `ccr-a1f628ee-snc89w` (sesja w chmurze): przed dalszą pracą scal `origin/main`. `wdrozenie/start`: gałąź wdrożenia z komputera Patryka (prompt 02 w `/home/patryk/Pulpit/rytm-hali/prompty/`).
- **Produkcja 2026-11-07, 20:00:** Worker `rytm-hali`, wersja `9214ca3b`, własna domena rytmhali.pl (Let's Encrypt do 2027-02-05). `npm run test:produkcja -- --domeny`: 21 w porządku, 1 błąd (rytmhali.com nie istnieje). IndexNow: 17 adresów (HTTP 202). Zrzuty: `raporty/start/`.
- **Do obejrzenia:** zrzuty F3 w `raporty/F3/` (strona główna, artykuł, dział, wyszukiwarka; treści testowe), zrzuty F2 w `raporty/F2/` (artykuł z kolekcji treści, panel redakcji), podgląd strony głównej i artykułu (`raporty/podglad/`), strona wzorów `/styleguide` (lokalnie `npm run dev` → http://localhost:4321/styleguide), panel na lokalnych plikach: http://localhost:4321/admin/index.html.
- **Ostatnia sesja:** 2026-11-06: F3 (szablony, wyszukiwarka, start w dwóch krokach) i skill `/artykul` po uwagach Patryka (DECYZJE.md). Wcześniej F2: kolekcje treści, strona artykułu `/<slug>` z kolekcji, okładki 1200×630, mapa strony z `lastmod`, panel Sveltia CMS (przepływ redakcyjny), worker z logowaniem do panelu, testy panelu. Wcześniej tego dnia: repozytorium wyczyszczone i zaadaptowane, fundament Astro 7, fonty, tokeny, logo (odtworzenie koncepcji C), 20 komponentów, `/styleguide`, „Wkrótce” (szkic), 404, testy. `npm run check` zielone lokalnie i w GitHub Actions (tam także iPhone/WebKit: 60 testów E2E na 3 urządzeniach, 52 zaliczone, 8 celowo pominiętych, np. test klawiatury na telefonie).

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

## Wyniki F3
| Obszar | Wynik |
|---|---|
| Szablony | strona główna, artykuł, dział (ze stronicowaniem), temat, autor, materiały do pobrania (lista i strona), wyszukiwarka, newsletter (zapis i strony techniczne), reklama i współpraca, 8 stron stałych (projekty), 404, 410, RSS całości i działów |
| Start w dwóch krokach | produkcja przed startem ma tylko „Wkrótce”, 404, 410, politykę prywatności i strony newslettera; mapa strony tylko `/`; zero treści testowych (sprawdzone buildem) |
| Testy | build testowy z 25 artykułami i materiałem: E2E, axe, Lighthouse i kontrola SEO na szablonach z treścią |

## Do zrobienia przez Patryka
Od góry według pilności. Każdy punkt to jedna czynność.
- [x] ~~Akceptacja wyglądu F1~~ (2026-11-06).
- [x] ~~Zgoda na zdjęcia~~ (2026-11-06: dopuszczone CC0, CC BY, Unsplash, Pexels; wybór powierzony redakcji, 10 zdjęć w rejestrze).
- [x] ~~Logo po szlifie~~ (2026-11-06: Patryk zaakceptował wersję z podtytułem wersalikami).
- [x] ~~Oznaczenia AI~~ (2026-11-06: bez oznaczeń przy tekstach; warunek: każdy tekst czytasz w całości przed publikacją, to kontrola redakcyjna z AI Act, DECYZJE.md).
- [x] ~~Podpis tekstów~~ (2026-11-06: domyślnie „Redakcja Rytmu Hali”, Twoje nazwisko pod tekstami, które napisałeś albo przeredagowałeś i przyjmujesz jako swoje).
- [x] ~~Pierwszy tekst skillem `/artykul`~~ (OEE, opublikowany 2026-11-07 po lekturze Patryka). Kolejne: podaj temat albo napisz „wybierz sam” (dostaniesz 3 propozycje z tezą i luką w wynikach wyszukiwania).
- [x] ~~Przeczytaj projekty stron stałych~~ (2026-11-07: zatwierdzone poleceniem Patryka, rozstrzygnięcia w DECYZJE.md, F8). Dawny opis: na podglądzie (lokalnie: `RH_PODGLAD=1 npm run build && npx astro preview`, adresy `/o-nas`, `/zasady-redakcyjne`, `/polityka-korekt`, `/oznaczanie-reklam`, `/jak-uzywamy-ai`, `/kontakt`, `/reklama`, `/newsletter`, `/polityka-prywatnosci`, `/regulamin-newslettera`, `/stopka-redakcyjna`): uwagi albo „zatwierdzam”. Miejsca w nawiasach kwadratowych to decyzje i dane do uzupełnienia (wydawca, okresy przechowywania danych, termin odpowiedzi, częstotliwość newslettera, cennik). Polityka prywatności musi być zatwierdzona, zanim uruchomimy zapis na „Wkrótce”.
- [x] ~~Bio~~ (2026-11-06: z patrykkorpyta.pl, strona O mnie i księga marki; LinkedIn wymaga logowania, więc nie był czytany automatycznie). Miejsca pracy jak na Twojej stronie, bez obecnego pracodawcy i bez wyników w procentach; zdjęcie z portretu na patrykkorpyta.pl. Zmiany: panel → Autorzy.
- [ ] **Makiety (opcjonalnie):** skopiuj `makiety/` z `/home/patryk/Pulpit/rytm-hali/` do repozytorium; pomogą porównać szablony F3 z drugą makietą. Logo z repozytorium jest zaakceptowane, oryginały logo nie są potrzebne.
- [ ] **Opcjonalnie, więcej zdjęć:** klucz API Unsplash (darmowy, https://unsplash.com/oauth/applications → New Application). Bez klucza nie da się legalnie szukać w Unsplash automatycznie; klucz dodajesz sam w ustawieniach środowiska, nie w czacie.
- [ ] **Repozytorium:** to repozytorium jest **publiczne** i nazywa się `lean-time-study-tracker`. Prompt zakłada prywatne. GitHub → Settings → General: zmień nazwę na `rytm-hali` i na dole „Change repository visibility” → Private. https://github.com/paprykak/lean-time-study-tracker/settings
- [x] ~~Domena rytmhali.pl~~ (2026-11-07: OVH, w Cloudflare od 16:17, DNSSEC wyłączony, rekordy A z OVH usunięte, `www` przekierowuje 301). Zostaje: **rytmhali.com** (kupno i przekierowanie 301 na .pl) oraz **odnawianie rytmhali.pl w OVH** (07.11 panel pokazywał „Częstotliwość odnawiania: Brak”).
- [ ] **Newsletter, konto Brevo** (po koncie: `FORMULARZE.newsletter = true`, wyłączone śledzenie otwarć i kliknięć w Brevo, opis newslettera w polityce prywatności) (rekomendacja; firma i dane w UE, API ma osobny zapis z podwójnym potwierdzeniem; jeśli wolisz MailerLite, napisz): https://www.brevo.com → załóż konto → Kontakty → Listy: lista „Raport zmianowy” (zapisz jej numer) → Szablony: szablon potwierdzenia zapisu z linkiem `{{ params.DOIurl }}` (zapisz numer) → SMTP i API → Klucze API: utwórz klucz i wpisz go sam: `npx wrangler secret put BREVO_API_KEY`. Mnie podaj tylko numer listy i szablonu (to nie sekrety). W Brevo ustaw stronę wypisu na `https://rytmhali.pl/newsletter/wypisano`.
- [ ] **Poczta domeny** (po dodaniu domeny do Cloudflare): Brevo → Nadawcy, domeny → dodaj `rytmhali.pl` i wpisz w Cloudflare DNS rekordy, które poda (DKIM, DMARC, kod weryfikacji). Jeden rekord SPF na domenę: gdy Brevo albo Email Routing poprosi o SPF, dopisz jego `include:` do istniejącego rekordu, nie dodawaj drugiego.
- [ ] **Pilne: adres redakcja@rytmhali.pl** (podany na stronach, bez Email Routing nie działa; stare rekordy poczty OVH w DNS zastąpi Email Routing): Cloudflare → domena → Email → Email Routing → włącz → Adresy docelowe: dodaj swoją skrzynkę i potwierdź → reguła `redakcja@rytmhali.pl` → Twoja skrzynka. Potem w ustawieniach Workera: zmienna `ADRES_REDAKCJI` = Twoja skrzynka (formularz kontaktowy wysyła na nią przez Email Routing; adres nie trafia do repozytorium). Instrukcja: https://developers.cloudflare.com/email-routing/get-started/
- [x] ~~Cloudflare, projekt Workers z repozytorium~~ (2026-11-07: Worker `rytm-hali`, podglądy przez `npx wrangler preview`). Zostaje: **Access na adresach podglądu** (Worker → Domains → Preview → „Enable Access”, polityka: Twój e-mail). Dawny opis: Workers & Pages → Create → Import a repository → to repozytorium. Build command: `npm run check:szybki`, deploy command: `npx wrangler deploy`, gałęzie inne niż `main`: włącz „Builds for non-production branches”. Potem Zero Trust → Access: zabezpiecz „Preview URLs” Workera (polityka: Twój e-mail). Instrukcja: https://developers.cloudflare.com/workers/ci-cd/builds/
- [ ] **Panel, pierwsze logowanie (gdy strona będzie na Cloudflare):** utwórz token https://github.com/settings/personal-access-tokens/new → Repository access: tylko to repozytorium → Permissions: Contents i Pull requests: Read and write → ważność 90 dni. Na rytmhali.pl/admin kliknij „Zaloguj się za pomocą tokenu dostępu” i wklej. Token zostaje w Twojej przeglądarce; nie wklejaj go w czacie.
- [ ] **Logowanie przez GitHub (wygodniejsze, po tokenie):** https://github.com/settings/applications/new → nazwa „Rytm Hali: panel”, Homepage `https://rytmhali.pl`, Authorization callback URL `https://rytmhali.pl/api/auth/callback` → Register. Potem w katalogu projektu: `npx wrangler secret put GITHUB_CLIENT_ID` (Client ID) i `npx wrangler secret put GITHUB_CLIENT_SECRET` (Generate a new client secret). Wartości wpisujesz tylko Ty.
- [ ] **Umami** (wybrany w prompcie): dodaj witrynę `rytmhali.pl` w https://cloud.umami.is (region UE) i podaj identyfikator witryny (to nie jest sekret). Do raportów dla partnerów: klucz API (Ustawienia → Klucze API) tylko w swoim środowisku.
- [ ] **Przed publicznym startem:** umowa o pracę (zakaz konkurencji, zgoda na działalność dodatkową); przed pierwszą reklamą: forma działalności i rozmowa z prawnikiem. Lista 17 pytań z podstawami prawnymi: `prawne/pytania-do-prawnika.md` (rejestracja tytułu prasowego, oznaczanie reklam i materiałów partnerów, forma działalności i VAT, RODO i transfery, regulamin, AI Act, prawa autorskie).
- [ ] **Opcjonalnie: klucz OpenAlex** (darmowy, https://help.openalex.org/api/authentication/): lepsze wyszukiwanie badań w skillu `/artykul`. Klucz dodajesz sam w ustawieniach środowiska, nie w czacie.

## Wyniki F4
| Obszar | Wynik |
|---|---|
| Dane strukturalne | `WebSite` z `SearchAction` (w portalu), `NewsMediaOrganization` z logo 512×512 i zasadami redakcji (zasady, etyka, weryfikacja faktów, korekty, finansowanie, redakcja, podpisy, kontakt; `src/lib/polityki.mjs`), `Article` z obrazami 16:9, 4:3, 1:1 i okładką, autor `Person` ze stroną autora, `BreadcrumbList`, `FAQPage`, `DigitalDocument` |
| Dla asystentów AI | `/llms.txt` z treści: działy z artykułami, materiały, zasady redakcji (tylko teksty indeksowane) |
| IndexNow | klucz w `public/`, skrypt `npm run indexnow` (po wdrożeniu) |
| Kontrola | `seo-check`: każda zasada w danych organizacji prowadzi do strony i śródtytułu, każdy link w `llms.txt` do zbudowanej strony, klucz IndexNow w `dist/`; E2E dla danych strukturalnych i `llms.txt` |

## Wyniki F5
| Obszar | Wynik |
|---|---|
| Kampanie w slotach | slot sam bierze kampanie swojego miejsca z panelu (daty od–do, „aktywna”), bez JavaScriptu pokazuje kampanię trwającą w chwili buildu, w przeglądarce pilnuje dat co do minuty i losuje jedną z trwających (rotacja); po końcu kampanii autopromocja newslettera |
| Link i oznaczenie | UTM (`utm_source=rytmhali`, `utm_medium=display`, `utm_campaign=<id>`, bez nadpisywania własnych UTM partnera), `rel="sponsored noopener"`, podpis „REKLAMA”, kreacje 1× i 2× |
| Zdarzenia | kliknięcie (atrybuty Umami) i wyświetlenie (połowa reklamy na ekranie przez sekundę) z właściwościami kampania, miejsce, slot; działają, gdy skrypt Umami będzie na stronie |
| Raport dla partnera | `npm run raport-kampanii -- <id>`: wyświetlenia, kliknięcia i CTR według miejsc z API Umami; sprawdzony na atrapie API |
| Materiał partnera | oznaczenie w nagłówku i na kartach, `sponsor` w danych, linki `sponsored`, bez reklamy w treści (test E2E na fikcyjnym materiale) |

## Wyniki F6
| Obszar | Wynik |
|---|---|
| Zapis na newsletter | formularz bez skryptów → worker `/api/newsletter` → Brevo z podwójnym potwierdzeniem (lista, szablon, powrót na `/newsletter/potwierdzono`); strony: sprawdź skrzynkę, potwierdzono, wypisano, błąd |
| Kontakt | formularz na `/kontakt` → worker `/api/kontakt` → e-mail do redakcji przez Email Routing (odpowiedź trafia do nadawcy); strony: wysłano, błąd |
| Ochrona | pole-pułapka, limit 5 prób na minutę z jednego IP (Rate Limiting), tylko z tej domeny (Origin), kontrola pól i adresu e-mail w workerze, temat z zamkniętej listy (bez wstrzyknięcia nagłówków), bez adresów e-mail w logach |
| Sprawdzone | 20 testów workera (atrapy Brevo i poczty), worker w `wrangler dev` (pułapka, brak konfiguracji, obca domena, GET), E2E formularzy i axe na `/kontakt` |

## Wyniki F7
| Obszar | Wynik |
|---|---|
| Projekty tekstów | polityka prywatności (opis wszystkich przepływów danych z kodu: newsletter, kontakt, statystyki, dane techniczne, odbiorcy i transfery, pliki cookie, prawa), regulamin newslettera, stopka redakcyjna; linki w stopce i przy zgodzie na newsletter; regulamin dostępny przed startem |
| Dla prawnika | `prawne/pytania-do-prawnika.md`: 17 pytań, przepisy sprawdzone w tekstach jednolitych (Prawo prasowe art. 7, 14, 14a, 20, 27, 36, 42; ustawa o świadczeniu usług drogą elektroniczną art. 8 i 9; RODO; AI Act art. 50) |

## Następne kroki
0. Skill `/artykul` gotowy (2026-11-06): pierwszy tekst po wyborze tematu; po nim lekcje w skillu.
1. F8: lista kontrolna w `START.md`; test żywej strony `npm run test:produkcja` gotowy (sprawdzony na buildzie w workerd). Infrastruktura i start po domenie, kontach i słowie „wdrażaj”: Cloudflare, sekrety, Email Routing, Brevo, Umami, IndexNow, Search Console; `START = true` dopiero na bramce startu (12 tekstów w 4 działach i zatwierdzone strony zaufania).
1b. Po koncie Brevo i Email Routing: wiązanie `send_email` POCZTA i zmienne `BREVO_LISTA`, `BREVO_SZABLON_DOI` w `wrangler.jsonc`, próbny zapis i wiadomość z formularza na podglądzie.
1a. Po wdrożeniu produkcji: `npm run indexnow -- --mapa`, a potem Search Console i Bing Webmaster Tools (konta Patryka, weryfikacja domeny w Cloudflare).
2. Zdjęcia w treści artykułu z rejestru (rysunki z podpisem „Fot.”): dziś w treści są wykresy SVG; zdjęcia z rejestru w środku tekstu dojdą przy pierwszym tekście, który ich potrzebuje.
3. LCP strony głównej: sprawdzone w Lighthouse na buildzie testowym (wynik w raporcie F3).
4. Po podłączeniu Cloudflare: sprawdzić, czy panel widzi podgląd gałęzi (przycisk „Wyświetl podgląd”); jeśli nie, ustawić `backend.preview_context` na nazwę kontroli Workers Builds. Po zmianie nazwy repozytorium: `backend.repo` w `public/admin/config.yml`.

## Notatki
- W sesji w chmurze nie ma WebKita: lokalnie `BEZ_WEBKIT=1 npm run check`, iPhone w GitHub Actions.
- `astro preview` w Astro 7 nie startuje drugi raz, gdy podgląd już działa: `--ignore-lock` albo `npx astro preview stop`.
- Test panelu (`src/lib/panel.test.ts`) czyta schematy z `.astro/collections/`: tworzy je `npx astro sync` (robi to `astro check` na początku `npm run check`).
- Aktualizacja Sveltia CMS: nowa wersja w `package.json` (`@sveltia/cms`, dokładna) i w `public/admin/index.html`; `npx vitest run src/lib/panel.test.ts` poda nową sumę SRI i sprawdzi konfigurację z nowym schematem, `npx playwright test tests/e2e/panel.spec.ts --project=komputer` sprawdzi panel.
- Fonty generuje `npm run fonty` (wymaga `fonts-liberation` do metryki fontu zapasowego); logo `npm run logo`.
