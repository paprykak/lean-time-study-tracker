# Decyzje

Każda decyzja z datą i uzasadnieniem. Decyzje „Patryk” czekają na jego słowo w `STAN.md`.

## 2026-11-06 — F0 i F1

### Repozytorium
- **Repozytorium `paprykak/lean-time-study-tracker` zaadaptowane pod Rytm Hali** (na prośbę Patryka: „repozytorium wyczyść i zaadoptuj pod to”). Aplikacja Next.js usunięta z gałęzi roboczej; zostaje w historii (`f273183`) i na `main` do pierwszego „wdrażaj”. Prompt wymaga prywatnego repozytorium o nazwie projektu, a to jest publiczne: zmiana nazwy na `rytm-hali` i widoczności na prywatne to sprawa Patryka (STAN.md).
- **Prompt i lekcje w repozytorium** (`prompty/01-budowa-portalu.md`), bo sesje w chmurze nie widzą plików z komputera Patryka.

### Adresy i treść (rekomendacje z sekcji 5, rozstrzygnięte)
- **Struktura adresów:** artykuł `/<slug>` (płasko: zmiana działu nie zmienia adresu), dział `/dzial/<slug>`, temat `/temat/<slug>`, autor `/autor/<slug>`, materiał `/do-pobrania/<slug>`. Stronicowanie list: `/dzial/<slug>/2`. Bez ukośnika na końcu (`trailingSlash: 'never'`).
- **Adresy działów:** `produkcja`, `magazyn-i-logistyka`, `lean-i-ciagle-doskonalenie`, `dane-i-ai`, `ludzie-i-szkolenia`. Pełne nazwy w adresie (czytelne, stabilne, zgodne z frazami wyszukiwania); w menu krótka nazwa „Lean”, żeby menu mieściło się na komputerze w jednej linii.
- **Formaty treści** jako pole, nie dział: Poradnik, Analiza, Wywiad, Raport, Wzór do pobrania, Komentarz (schemat w F2).
- **Język:** tylko polski, bez hreflang. **Domena:** bez `www` (jedno przekierowanie www → bez www, HSTS).
- **Ciemny motyw:** nie na start (koszt testów kontrastu w dwóch motywach przy niewielkiej korzyści dla portalu B2B). Tokeny przygotowane w `global.css` (`:root[data-motyw="ciemny"]`), nic ich nie włącza.

### System wizualny
- **Jeden akcent w dwóch odcieniach tego samego tonu:** `#e8590c` (barwa marki) ma na białym tylko 3,58:1, więc nie wolno nim pisać małego tekstu (WCAG 4,5:1). Mały tekst, linki i przycisk główny używają `#c2410c` (5,17:1), najechanie `#9a3412`. Test sprawdza, że wszystkie odcienie „akcent*” mają ten sam ton (±6°) i każdą parę tekst/tło.
- **Fonty u siebie, własny podzbiór** z repozytorium google/fonts (przypięty commit, sumy SHA-256): Noto Sans zmienny 400–700 (30 KB), Noto Sans Display Bold (17 KB), kursywa (32 KB, ładowana tylko gdy potrzebna). Zestaw znaków: łacina, Latin-1, polskie litery, typografia polska („” – — …), litery czeskie, słowackie i węgierskie z nazw firm. Strzałki i znaki matematyczne biorą fonty systemowe (Noto Sans ich nie ma; test to wykrył).
- **`font-display: optional` + preload + font zapasowy z dopasowaną metryką** (Arial/Helvetica/Liberation Sans przeskalowane do szerokości i wysokości Noto): font jest od pierwszego malowania albo strona zostaje przy zapasowym, bez przeskoku układu (poprzeczka CLS < 0,02).
- **Promień kart i zdjęć 2 px**, bez cieni na kartach, linie 1 px między sekcjami, nagłówek sekcji z linią 2 px (pierwsze 48 px w kolorze akcentu).
- **Karta główna:** tytuł na zdjęciu (przyciemnienie dołu zdjęcia dla czytelności) na komputerze, pod zdjęciem na telefonie (czytelność na hali, w słońcu).
- **Cała karta klikalna jednym linkiem w tytule** (rozciągnięty link): jedno miejsce w kolejności Tab, obrys całej karty przy fokusie.
- **Ramka autora ze zdjęciem kwadratowym**, nie okrągłym (zakaz promienia ponad 4 px dla zdjęć).
- **Pasek „Na zmianie” bez animacji** (rozprasza i utrudnia czytanie, WCAG 2.2.2). Komputer: 3 najnowsze, telefon: 4 przewijane w bok. Etykieta czasu („07:05” dziś, „5 lis” wcześniej) liczona u czytelnika, bo strona jest statyczna.
- **Podpis „REKLAMA” także na autopromocji newslettera** w slocie reklamowym: stała wysokość podpisu (zero przesunięć) i jedna reguła bez wyjątków.
- **Newsletter:** zgoda jako osobne, niezaznaczone pole wyboru (wymagane), pole-pułapka na boty. Treść zgody i klauzuli to projekt do akceptacji Patryka i oceny prawnika (F7).
- **Logo odtworzone z opisu koncepcji C**, bo oryginały są tylko na komputerze Patryka. Generator (`marka/logo/generuj-logo.mjs`) robi komplet plików; oryginały podmienią SVG bez zmian w szablonach.
- **Szlif logo (na prośbę Patryka, w ramach koncepcji C):** dach i korpus jako jedna sylwetka hali, zęby wznoszące się w prawo, monogram i napis w tej samej grubości, blok tekstu wyrównany do okapu i dołu plakietki, podtytuł wersalikami ze stałym światłem zamiast rozstrzelonych małych liter. Uzasadnienie punkt po punkcie: `marka/README.md`. Wariant z podtytułem małymi literami został w `marka/logo/porownaj.mjs` jako alternatywa. **Zaakceptowane przez Patryka 2026-11-06** (podtytuł wersalikami); od tej chwili logo z repozytorium jest obowiązujące, a oryginały koncepcji C nie są potrzebne.

### Technika
- **Stack jak w patrykkorpyta.pl:** Astro 7.4, Tailwind 4 (tokeny w `@theme`), TypeScript strict, Vitest, Playwright, axe, Lighthouse CI. Przeniesione i dostosowane: `seo-check`, układ `<head>`, udostępnianie bez skryptów, okruszki, konfiguracje testów.
- **CSP w dwóch warstwach:** `<meta>` z Astro (`security.csp`) z hashem każdego skryptu i stylu (bez `unsafe-inline` i `unsafe-eval`) oraz nagłówek z dyrektywami, których nie wolno dać w `<meta>` (`frame-ancestors`). Konsekwencja: bez atrybutów `style=""` (kontrola SEO to sprawdza).
- **Tryb budowania:** gałąź `main` w Cloudflare oraz build lokalny i w GitHub Actions = produkcja; każda inna gałąź w Cloudflare = podgląd z `noindex` w `<meta>` i `X-Robots-Tag` (`src/lib/srodowisko.mjs`). Nagłówki generowane przy buildzie (`dist/_headers`).
- **Cloudflare:** Worker z plikami statycznymi (`wrangler.jsonc`); kod workera tylko dla `/api/*` (od F2 logowanie do panelu, w F6 formularze, w F8 410). Produkcja tylko pod `rytmhali.pl` (`workers_dev: false`), podglądy wersji włączone.
- **Lighthouse:** wszystkie strony ≥ 95 w wydajności, dostępności i dobrych praktykach oraz LCP < 2 s, CLS < 0,02, TBT < 200 ms. **SEO ≥ 95 tylko na stronach indeksowanych:** na 404 i `/styleguide` Lighthouse z definicji obniża SEO za noindex i status 404, a te strony mają być nieindeksowane. Odstępstwo od literalnego brzmienia poprzeczki dla strony 404 jest celowe.
- **Markdown bez podświetlania składni** (`markdown.syntaxHighlight: false`): Shiki wstawia style w atrybutach, które blokuje CSP. Gdy kod w artykułach będzie potrzebny: Prism z klasami CSS.
- **Budżet rozmiaru na każdej stronie** (nie tylko artykule): JS ≤ 30 KB, CSS ≤ 40 KB, fonty z preload ≤ 60 KB (gzip).
- **Playwright przypięty do 1.63.0** (zgodność z przeglądarką w środowisku sesji w chmurze; GitHub Actions instaluje przeglądarki tej samej wersji). Testy iPhone'a (WebKit) w GitHub Actions; lokalnie `BEZ_WEBKIT=1`, jeśli brak bibliotek WebKita.
- **Linki do tras z kolejnych faz** (`/dzial/…`, `/newsletter`, strony zaufania) są w kontroli SEO ostrzeżeniem, nie błędem; lista `PLANOWANE` w `scripts/seo-check.mjs` maleje z każdą fazą i ma być pusta przed startem.
- **Node:** `engines` ≥ 22.23.4 (wymóg Astro 7); `.nvmrc` = 24 jak na komputerze Patryka i w CI.

### Zdjęcia (2026-11-06)
- **Dozwolone licencje: CC0, CC BY, Unsplash, Pexels** (Patryk: „jak darmowe, to dopuszczam”), zawsze z podpisem „Fot.” i wpisem w rejestrze licencji (do F2 `marka/zdjecia/rejestr.json`, od F2 kolekcja `src/content/zdjecia/`). Przy CC BY podpis zaznacza zmiany („kadr”) i linkuje źródło (test rejestru to sprawdza). CC BY-SA odrzucone (obowiązek udostępniania na tej samej licencji nie pasuje do serwisu z treściami partnerów).
- **Wybór redakcji: 10 zdjęć** (8 z Wikimedia Commons, 2 z rawpixel przez Openverse), po jednym zestawie na każdy dział. Odrzucone mimo poprawnej licencji: rozpoznawalne marki (Opel, Dyson, Toyota), anonimowi autorzy przy zdjęciach wyglądających na firmowe (ryzyko cudzego zdjęcia z przypisaną licencją), zdjęcia reklamowe producentów z twarzami. Lista z uzasadnieniem: `marka/zdjecia/kandydaci.md`.
- **Rawpixel bez konta daje 1024 px:** te dwa zdjęcia tylko w kartach siatki i bocznych, nie w karcie głównej (zapisane w uwagach rejestru).
- **Unsplash i Pexels: tylko przez ich API** (wyszukiwarki blokują automaty, nie obchodzimy zabezpieczeń). Klucz API to konto Patryka; do tego czasu źródła: Wikimedia Commons i Openverse.
- **Pliki zdjęć w repozytorium** (`src/assets/zdjecia/`, JPEG do 2000 px, bez metadanych EXIF), przetwarzane przez `astro:assets` do AVIF i WebP w kilku szerokościach. ~~Strona buduje się także bez części plików~~ (zmienione w F2: wpis rejestru bez pliku zatrzymuje build).

### Podgląd szablonów (2026-11-06, na prośbę Patryka przed F3)
- **Strona główna:** billboard (telefon 320 × 100) pod nagłówkiem; czołówka 8/12 (karta główna) + 4/12 (trzy karty boczne); „Najnowsze” w czterech kolumnach; dwa działy z kartą wiodącą i listą z datami obok kolumny bocznej („Najczęściej czytane” i prostokąt 300 × 250 przyklejony przy przewijaniu); pas newslettera; trzy gęste kolumny pozostałych działów. H1 strony głównej niewidoczny (nazwa medium dla czytników ekranu i wyszukiwarek).
- **Artykuł:** treść 8/12 i kolumna boczna 4/12 (półstrona 300 × 600, „Najczęściej czytane”, newsletter przyklejony); nagłówek: kategoria i format, tytuł, lead, autor, daty, czas czytania, udostępnianie; zdjęcie główne z podpisem „Fot.” i linkiem do źródła; spis treści otwarty, zwijany; reklama w treści po 3. akapicie tylko na komputerze; ramka materiału do pobrania; pytania i odpowiedzi jako rozwijane pozycje z danymi FAQPage; źródła; tematy; udostępnianie; autor; „Więcej z działu”.
- **Na telefonie okruszki bez bieżącej strony** (długi tytuł łamał ścieżkę); bieżąca strona zostaje w danych strukturalnych.
- **Style linków w treści tylko dla tekstu właściwego** (akapity, listy, tabele, podpisy), z zerową specyficznością: komponenty w treści (reklama, ramka do pobrania, spis treści) zachowują własny wygląd.
- Podglądy (`/podglad/strona-glowna`, `/podglad/artykul`) mają noindex w `<meta>` i nagłówku, są poza mapą strony i w pełnych testach (axe, 320 px, CSP, Lighthouse). W F3 zastąpią je prawdziwe szablony z kolekcji treści.

### Kurs redakcyjny: artykuły, nie wiadomości (2026-11-06, Patryk)
- **Rytm Hali to magazyn eksperckich artykułów w rodzaju Harvard Business Review, nie serwis wiadomości.** Konsekwencje w systemie wizualnym:
  - pasek „Na zmianie” (wiadomości z godziną) zastąpiony **paskiem tematów** (stała nawigacja po zagadnieniach, tematy wybiera redakcja w panelu: `tematyWyroznione` w ustawieniach);
  - **bez godzin publikacji** w całym serwisie (usunięty skrypt etykiet czasu: mniej JavaScriptu);
  - nad tytułem **dział i format** (Poradnik, Analiza, Wywiad, Raport, Wzór do pobrania, Komentarz);
  - na kartach **autor i czas czytania**; data publikacji i aktualizacji na stronie artykułu (teksty mają żyć latami, więc data nie jest najważniejszą informacją na liście);
  - listy w sekcjach działów bez nazwy działu (jest w nagłówku sekcji), z formatem.
- W kolejnych fazach z tego kursu wynika też: dłuższe formy, autorzy z opisem kompetencji (E-E-A-T), strony tematów jako huby wiedzy, aktualizacje zamiast nowych wersji tekstu, mapa strony Google News dopiero przy regularnej publikacji wiadomości (na razie nieplanowana).

## 2026-11-06 — F2: model treści i panel redakcyjny

### Model treści
- **Kolekcje Astro (`src/content.config.ts`, loader `glob`)**: artykuły i materiały w Markdownie, rejestr zdjęć, autorzy, działy, tematy, partnerzy i kampanie w JSON. Relacje przez nazwę pliku (`reference()`), więc zmiana nazwy działu czy tytułu zdjęcia nie psuje powiązań. Stałe wspólne dla schematów, panelu i testów w `src/lib/model.ts`.
- **Adres artykułu `/<nazwa pliku>`** z listą zarezerwowanych nazw (trasy serwisu); test i build odrzucają kolizję. Panel tworzy nazwę z tytułu (ASCII, bez polskich znaków, do 70 znaków) i pozwala ją poprawić tylko przy tworzeniu: późniejsza zmiana adresu wymaga przekierowania, więc robi ją programista.
- **Rejestr zdjęć przeniesiony do kolekcji `src/content/zdjecia/`** (był `marka/zdjecia/rejestr.json`): panel edytuje go jak każdą treść, a schemat pilnuje pól licencji (podpis „Fot. ”, licencja z listy, alt ≥ 20 znaków, zgoda). Plik zapisany ścieżką od katalogu projektu (`/src/assets/zdjecia/…`): Sveltia nie przyjmuje względnego `public_folder`, a Astro rozwiązuje taką ścieżkę w `image()` (sprawdzone buildem: optymalizacja działa, brak pliku zatrzymuje build).
- **Szkice i wpisy testowe**: pola `szkic` i `testowy`. Produkcja (`main`) ich nie buduje; podgląd gałęzi buduje wszystko z `noindex`. Mapa strony pomija szkice, wpisy testowe i `noindex`, a `lastmod` bierze z daty aktualizacji albo publikacji.
- **Dane strukturalne `Article`, nie `NewsArticle`** (magazyn, nie serwis wiadomości): autor jako `Person` ze stroną autora i profilami, wydawca `NewsMediaOrganization`, dział, format, tematy, liczba słów, czas czytania, `sponsor` przy materiale partnera. Autor „Redakcja” (pole `typ`) to organizacja, nie osoba.
- **Okładka udostępnień 1200×630 przy buildzie** (`/okladki/<slug>.jpg`: satori + resvg + sharp, bez przeglądarki): zdjęcie z rejestru, przyciemnienie, logo, dział i format, tytuł dobrany rozmiarem do długości, pas dachu.
- **Powiązania w obie strony**: „Czytaj także” bierze kolejno wskazane ręcznie, wskazujące ten tekst, ze wspólnymi tematami, z tego samego działu; „Więcej z działu” bez powtórzeń.
- **Materiał partnera bez reklam** w treści i w kolumnie bocznej (czytelnik nie dostaje reklamy konkurenta w tekście sponsorowanym, partner płaci za uwagę), oznaczenie „Materiał partnera” albo „Reklama” zawsze widoczne, linki zewnętrzne `rel="sponsored noopener"`.

### Markdown
- **Silnik Sätteri (Astro 7)** z wtyczkami serwisu (`src/lib/markdown.mjs`): tabela w przewijanym kontenerze, miejsce reklamy po 3. akapicie najwyższego poziomu (akapit kończący się dwukropkiem zapowiada listę, więc reklama idzie po następnym; krótki tekst nie kończy się reklamą), `rel` linków zewnętrznych. Treść dzieli w tym miejscu `TrescArtykulu.astro` już po renderowaniu, więc zdjęcia i kotwice przetwarza Astro.
- **Bez obrazów wstawianych w treść w panelu** (przycisk obrazu wyłączony): każde zdjęcie ma przejść przez rejestr licencji. Rysunki w treści z rejestru i podpisem dojdą w F3.

### Panel redakcji (Sveltia CMS)
- **Sveltia CMS 0.256.1 z unpkg.com, przypięty i z sumą SRI**: przeglądarka nie uruchomi podmienionego pliku. Wersja z 31 października (tydzień „w obiegu”), nie najnowsza z tego dnia. Aktualizacja świadoma: wersja w `package.json` i `index.html`, test podaje nową sumę i sprawdza konfigurację ze schematem nowej wersji. Wersja npm bez CDN odrzucona: Sveltia jej nie wspiera i odcina automatyczne poprawki bezpieczeństwa.
- **Własna CSP dla `/admin/*`** według dokumentacji Sveltia (skrypt tylko z unpkg.com, połączenia tylko z GitHubem i unpkg.com, fonty panelu z jsDelivr). `'wasm-unsafe-eval'` tylko dla WebAssembly (konwersja zdjęć w Safari i zdjęć HEIC z telefonu), bez `eval()`. Panel nie dotyczy czytelników: zero skryptów zewnętrznych na stronach serwisu zostaje.
- **Przepływ redakcyjny (`editorial_workflow`)**: każdy wpis to gałąź i pull request (szkic → do sprawdzenia → gotowe), podgląd gałęzi w Cloudflare z `noindex`, publikacja = scalenie z `main`. „Zapisz i opublikuj” zostawione na drobne poprawki.
- **Role na przyszłość przez uprawnienia GitHuba**: autor dostaje rolę Write (zapisuje szkice i wysyła do przeglądu), a ochrona gałęzi `main` z wymaganym przeglądem sprawia, że publikuje redaktor (Maintain/Admin). Osobne ustawienia ról w panelu nie są potrzebne: GitHub odmówi scalenia osobie bez uprawnień, a panel pokaże błąd.
- **Logowanie**: na start „Zaloguj się za pomocą tokenu dostępu” (token Patryka zostaje w jego przeglądarce, nikt inny go nie widzi). Docelowo „Zaloguj się przez GitHub” przez własny worker `/api/auth` (port protokołu Sveltia CMS Authenticator, licencja MIT) zamiast osobnej usługi: jedna domena, jedno wdrożenie. Zaostrzenia: token tylko do okna z tej samej domeny, ciasteczko `__Host-` z losowym stanem (CSRF), CSP z hashem skryptu, `no-store`, zakresy z listy dozwolonych.
- **Zdjęcia w panelu**: konwersja do WebP do 2400 px, bez metadanych, nazwy plików bez polskich znaków; wyłączone biblioteki zdjęć stockowych panelu (omijałyby rejestr licencji); limit 15 MB.
- **Zgodność panelu z modelem pilnuje test** (`src/lib/panel.test.ts`): konfiguracja zgodna ze schematem Sveltia, pola i wymagalność zgodne ze schematami Astro w obie strony, te same listy wyboru i długości, relacje do istniejących kolekcji, plik ustawień pokryty w całości. Test E2E uruchamia panel z prawdziwą konfiguracją i robi próbę zapisu wpisu w testowym repozytorium Sveltia.

### Przed publicznym startem
- Do bramki startu (F8) teksty czekają w gałęziach przepływu redakcyjnego (podgląd z `noindex`) albo mają `szkic: true`; na `main` trafia tylko to, co ma być publiczne.

## 2026-11-06 — Skill `/artykul`: jak powstają teksty

Patryk: treści mają opierać się na faktach i badaniach, mieć zdjęcie z otwartej licencji i być lepsze niż Harvard Business Review. Decyzje redakcji:
- **Jeden skill z procesem i bramkami, a nie „pisarz”**: brief i teza → research → konspekt z rejestrem twierdzeń → pisanie → zdjęcie → weryfikacja niezależna → kontrola automatyczna → karta jakości → oddanie szkicu. Pliki: `.claude/skills/artykul/` (SKILL.md, standard, dowody, styl, zdjęcia, weryfikacja, wzór teczki). Teczka każdego tekstu w `redakcja/<slug>/teczka.md`: źródła, rejestr twierdzeń, weryfikacja, decyzje (ślad pracy na potrzeby poprawek).
- **„Lepiej niż HBR” mierzalnie**: przypis przy każdej liczbie i każdym wniosku z badania (klikalny, prowadzi do źródła na liście), skala siły dowodów A–D, przeciwdowody i granice w każdym tekście, niezależna weryfikacja faktów (dwa agenty z czystym kontekstem: weryfikator i recenzent), polski kontekst, analiza własna na danych publicznych, działanie na ten tydzień, jawna metoda pod tekstem. Wytyczne HBR sprawdzone u źródła (pięć cech i pięć pytań propozycji); HBR prosi o ujawnienie powiązań finansowych i użycia AI tylko redakcję, my mówimy o nich czytelnikowi.
- **Przypisy `[n]` w Markdownie** zamiast linków w zdaniach: wtyczka Sätteri robi z nich odsyłacze do listy źródeł (`#zrodlo-n`), a kontrola tekstu w CI nie przepuści nietestowego artykułu z liczbą bez przypisu albo z oznaczenia „dane fikcyjne”, z przypisem bez źródła, ze źródłem bez przypisu ani z frazami z tekstów generowanych.
- **Nowe pola artykułu**: `zrodla[].rodzaj` i `zrodla[].dostep`, `sprawdzono` (data pełnej weryfikacji) i `metoda`. Ramka „Jak powstał ten tekst” pokazuje metodę, liczbę źródeł według rodzaju i datę weryfikacji; źródła trafiają też do danych strukturalnych (`citation`).
- **Rysunki z podpisem**: obraz z tytułem w Markdownie staje się `<figure>` z `<figcaption>`; wykresy jako SVG w `src/assets/rysunki/`.
- **Zdjęcia**: skrypt szuka w Openverse i Wikimedia Commons tylko licencji z rejestru, robi stykówkę do oceny wzrokowej i wpis do rejestru; licencję redakcja potwierdza na stronie źródła. Próba na frazie „cnc machining” od razu pokazała dwa zdjęcia z logo producentów do odrzucenia, więc ocena wzrokowa jest obowiązkowa.
- **Źródła sprawdzane automatycznie**: adres, metadane DOI z Crossref i wycofania (pole `updated-by` z danymi Retraction Watch; sprawdzone na wycofanej pracy z „Lancetu”).
- **Autor domyślnie „Redakcja Rytmu Hali”**, a Patryk podpisuje tylko teksty, które napisał albo przeredagował i przyjął jako swoje; użycie AI opisane w ramce metody. **Do decyzji Patryka** (STAN.md).
- **Niezależność redakcji**: w tekstach redakcyjnych bez reklamy i linków do usług Patryka; konflikt interesów w ramce metody.
- **Wywiady tylko z prawdziwych rozmów**, z autoryzacją dosłownych cytatów według Prawa prasowego (art. 14a, sprawdzony w tekście jednolitym Dz.U. 2018 poz. 1914; dawny art. 14 ust. 2 jest uchylony).
- **Źródła badań dostępne bez kont**: Crossref, Eurostat, API Sejmu, Openverse, Wikimedia Commons (z limitem), wyszukiwarka. OpenAlex wymaga od 2026 r. darmowego klucza (konto Patryka, opcjonalnie); GUS BDL nie odpowiada z sesji w chmurze, działa z komputera Patryka.

