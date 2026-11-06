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
- **„Lepiej niż HBR” mierzalnie**: przypis przy każdej liczbie i każdym wniosku z badania (klikalny, prowadzi do źródła na liście), skala siły dowodów A–D, przeciwdowody i granice w każdym tekście, niezależna weryfikacja faktów (dwa agenty z czystym kontekstem: weryfikator i recenzent), polski kontekst, analiza własna na danych publicznych, działanie na ten tydzień, jawna metoda pod tekstem. Wytyczne HBR sprawdzone u źródła (pięć cech i pięć pytań propozycji); HBR prosi o ujawnienie powiązań finansowych tylko redakcję, my mówimy o nich czytelnikowi (pierwotnie także o użyciu AI; zmienione 2026-11-06, niżej).
- **Przypisy `[n]` w Markdownie** zamiast linków w zdaniach: wtyczka Sätteri robi z nich odsyłacze do listy źródeł (`#zrodlo-n`), a kontrola tekstu w CI nie przepuści nietestowego artykułu z liczbą bez przypisu albo z oznaczenia „dane fikcyjne”, z przypisem bez źródła, ze źródłem bez przypisu ani z frazami z tekstów generowanych.
- **Nowe pola artykułu**: `zrodla[].rodzaj` i `zrodla[].dostep`, `sprawdzono` (data pełnej weryfikacji) i `metoda`. Ramka „Jak powstał ten tekst” pokazuje metodę, liczbę źródeł według rodzaju i datę weryfikacji; źródła trafiają też do danych strukturalnych (`citation`).
- **Rysunki z podpisem**: obraz z tytułem w Markdownie staje się `<figure>` z `<figcaption>`; wykresy jako SVG w `src/assets/rysunki/`.
- **Zdjęcia**: skrypt szuka w Openverse i Wikimedia Commons tylko licencji z rejestru, robi stykówkę do oceny wzrokowej i wpis do rejestru; licencję redakcja potwierdza na stronie źródła. Próba na frazie „cnc machining” od razu pokazała dwa zdjęcia z logo producentów do odrzucenia, więc ocena wzrokowa jest obowiązkowa.
- **Źródła sprawdzane automatycznie**: adres, metadane DOI z Crossref i wycofania (pole `updated-by` z danymi Retraction Watch; sprawdzone na wycofanej pracy z „Lancetu”).
- **Autor domyślnie „Redakcja Rytmu Hali”**, a Patryk podpisuje tylko teksty, które napisał albo przeredagował i przyjął jako swoje. Zatwierdzone przez Patryka 2026-11-06.
- **Niezależność redakcji**: w tekstach redakcyjnych bez reklamy i linków do usług Patryka; konflikt interesów w ramce metody.
- **Wywiady tylko z prawdziwych rozmów**, z autoryzacją dosłownych cytatów według Prawa prasowego (art. 14a, sprawdzony w tekście jednolitym Dz.U. 2018 poz. 1914; dawny art. 14 ust. 2 jest uchylony).
- **Źródła badań dostępne bez kont**: Crossref, Eurostat, API Sejmu, Openverse, Wikimedia Commons (z limitem), wyszukiwarka. OpenAlex wymaga od 2026 r. darmowego klucza (konto Patryka, opcjonalnie); GUS BDL nie odpowiada z sesji w chmurze, działa z komputera Patryka.

## 2026-11-06 — Skill `/artykul`: bez oznaczeń AI, rzemiosło i czytelnik testowy

Patryk: bez oznaczeń, że tekst powstał z użyciem AI, a teksty mają być napisane maksymalnie dobrze pod względem przyjemności z czytania i wartości dla czytelnika. Decyzje redakcji:
- **Bez oznaczeń przy tekstach:** ramka „Jak powstał ten tekst”, podpis i treść nie wspominają o narzędziach AI (skill, wzór pola `metoda`, podpowiedź w panelu, projekty stron O nas i Jak używamy AI).
- **Podstawa prawna sprawdzona u źródła:** art. 50 ust. 4 AI Act stosuje się od 2 sierpnia 2026 r., ale tekst, który przeszedł kontrolę redakcyjną, nie wymaga oznaczenia. Według FAQ Komisji Europejskiej do art. 50 (aktualizacja z 24 lipca 2026) to kontrola sprawowana w praktyce przez redaktora naczelnego, który może zatwierdzić, zmienić albo odrzucić treść i sprawdza fakty; korekta językowa jej nie zastępuje; odpowiedzialność za publikację ma osoba z redakcji. Polska ustawa o systemach sztucznej inteligencji (Dz.U. 2026 poz. 1003, tekst z API Sejmu) tworzy nadzór i nie dodaje własnego obowiązku oznaczania. Dlatego skill ma bramkę **kontroli redakcyjnej**: Patryk czyta cały tekst przed publikacją, decyzja z datą w teczce (sekcja 13); bez niej tekst nie wychodzi.
- **Strona „Jak używamy AI” zostaje** jako ogólna zasada pracy (wymaga jej prompt, sekcja F4, i bramka startu), bez obietnicy oznaczeń przy tekstach i bez nazw dostawców.
- **Rzemiosło jako osobny plik skilla** (`pisanie.md`): plan tekstu w teczce (obietnica, trzy rzeczy do zabrania, sztafeta pytań, otwarcie i zakończenie w parze), pięć otwarć, akapit sedna do 200 słów, łuk i tempo, zdania (szyk z najważniejszym na końcu, rytm, liczby po ludzku, role zamiast „pracowników”), test usunięcia i test przekazania, cztery przebiegi redakcyjne, przykłady przed i po. `styl.md` dostał tabelę polszczyzny redakcyjnej i listę śladów tekstów generowanych.
- **Dwie rundy weryfikacji:** treść (weryfikator faktów, recenzent), potem forma: redaktor językowy (do 40 gotowych poprawek, cięcie co najmniej 10%) i czytelnik testowy w personie z briefu, który dostaje tylko plik artykułu (krzywa uwagi, punkt porzucenia, co zabiera, komu prześle, oceny przyjemności i wartości). To, co czytelnik zabiera, porównujemy z planem tekstu na ślepo: rozjazd znaczy, że tekst nie dowozi obietnicy.
- **Karta jakości:** bramki przyjemności i wartości (czytelnik testowy co najmniej 8/10 w obu) i redaktora językowego; cztery nowe kryteria (otwarcie, łuk, zdania, gęstość wartości); próg 28 z 32, bez zera, a teza, dowody, użyteczność, otwarcie i zdania na 2.
- **Kontrola tekstu w CI rozszerzona:** wniosek z badań bez przypisu to błąd; uwagi o stylu urzędowym, kalkach z angielskiego, słowach nadużywanych, konstrukcjach typowych dla tekstów generowanych („nie tylko…, ale”, „to nie X, to Y”, pytanie z natychmiastową odpowiedzią, trzy zdania od tego samego słowa), śródtytułach-etykietach, nadmiarze list, pogrubień, półpauz i strony biernej oraz o monotonnym rytmie. Progi rytmu skalibrowane na felietonach Boya-Żeleńskiego (Wolne Lektury, domena publiczna): w 16 fragmentach zróżnicowanie długości zdań 0,57–0,96, więc próg 0,45 nie łapie dobrej prozy, tylko tekst jednostajny.

## 2026-11-06 — F6: newsletter i formularze

- **Rekomendacja: Brevo** (wybór i konto należą do Patryka). Brevo ma w API osobny zapis z podwójnym potwierdzeniem (`POST /v3/contacts/doubleOptinConfirmation`: lista, szablon potwierdzenia, strona powrotu; sprawdzone w dokumentacji Brevo 2026-11-06), więc potwierdzenie gwarantuje kod. W MailerLite przy zapisie przez API potwierdzenie zależy od ustawienia konta, którego dokumentacja API nie opisuje. Obie firmy są z UE. Worker ma jednego dostawcę w jednej funkcji, więc zmiana to kilkanaście linii.
- **Formularze bez JavaScriptu**: zwykłe `<form method="post">`, worker odpowiada przekierowaniem 303 na strony statyczne (sukces, błąd). Działa w każdej przeglądarce i nie potrzebuje skryptów ani CSP dla połączeń.
- **Ochrona przed spamem bez CAPTCHA**: pole-pułapka (wypełnione udaje sukces), limit 5 prób na minutę z IP przez wiązanie Rate Limiting Cloudflare, nagłówek Origin z tej samej domeny, kontrola pól w workerze. Turnstile nie, bo to dodatkowy skrypt zewnętrzny; wrócimy do niego, gdyby spam przeszedł.
- **Kontakt przez Email Routing** (wiązanie `send_email`): wiadomość MIME budowana w workerze (UTF-8, base64, temat RFC 2047), odpowiedź do nadawcy przez Reply-To, temat tylko z listy, adres docelowy w zmiennej Cloudflare, nie w repozytorium.
- **Prywatność w logach**: worker loguje kod błędu dostawcy, nigdy adresu e-mail.
- **Wiązanie poczty i zmienne Brevo dojdą do `wrangler.jsonc` po założeniu kont** (Email Routing wymaga domeny w Cloudflare); bez nich formularz prowadzi na stronę błędu z adresem redakcji, a log mówi, czego brakuje.

## 2026-11-06 — F5: zaplecze zarabiania

- **Kampanie wybiera slot, nie strona**: `SlotReklamowy` czyta kolekcję „kampanie” po swoim miejscu (`src/lib/kampanie.ts`), więc nowa kampania z panelu trafia na wszystkie strony z tym miejscem bez zmian w szablonach.
- **Daty i rotacja przy statycznej stronie**: build wstawia kampanie trwające i te, które zaczną się w ciągu 31 dni, a mały skrypt w przeglądarce co do minuty pokazuje trwającą (losowo jedną z kilku: rotacja przy każdym wyświetleniu strony) albo autopromocję po końcu. Bez JavaScriptu widać kampanię trwającą w chwili buildu. Dzięki temu koniec kampanii nie zależy od tego, kiedy ktoś przebuduje stronę (rozliczenie z partnerem), a strona zostaje statyczna i bez zewnętrznych skryptów. Ukryte kreacje mają `loading="lazy"`, więc się nie pobierają.
- **Wyświetlenie = połowa reklamy na ekranie przez sekundę** (próg widoczności IAB/MRC dla reklam graficznych); zdarzenie idzie do Umami tylko wtedy, gdy jego skrypt jest na stronie. Kliknięcie przez atrybuty `data-umami-event`. Właściwość `slot` (kampania@miejsce), bo API Umami liczy wartości jednej właściwości i nie filtruje po drugiej.
- **Raport dla partnera** z endpointu `event-data/values` (sprawdzony w dokumentacji Umami: Umami Cloud `https://api.umami.is/v1`, klucz w nagłówku `Authorization: Bearer`). Wynik tylko na ekran: repozytorium jest dziś publiczne, a liczby kampanii to dane partnera. Opis w raporcie mówi, że blokery statystyk zaniżają liczby, nigdy nie zawyżają.
- **Umami wybrał Patryk w prompcie** (sekcja 4, „Analityka”: osobna witryna dla rytmhali.pl). Czeka identyfikator witryny z jego konta (STAN.md) i ocena RODO w polityce prywatności (F7); do tego czasu skryptu Umami na stronie nie ma, a sloty i raport są gotowe na jego włączenie.
- **Fikcyjne kampanie i partner do testów** (`src/content/testowe/kampanie`, `testowe/partnerzy`, kreacje „KREACJA TESTOWA” na example.com): tylko w podglądzie i buildzie testowym, jak inne treści testowe.

## 2026-11-06 — F4: SEO i widoczność w asystentach AI

- **Zasady redakcji w danych organizacji** (`NewsMediaOrganization`): `publishingPrinciples`, `ethicsPolicy`, `verificationFactCheckingPolicy`, `correctionsPolicy`, `ownershipFundingInfo`, `masthead`, `noBylinesPolicy`, `actionableFeedbackPolicy`, każda na stronę zaufania i śródtytuł (`src/lib/polityki.mjs`). Tylko w portalu: przed startem tych stron nie ma. Kontrola SEO pilnuje, że strona i kotwica istnieją, więc zmiana śródtytułu w panelu nie zostawi martwego odsyłacza.
- **Logo organizacji 512×512** zamiast napisu 600×60: wytyczne Google dla danych `Organization` wymagają co najmniej 112×112 px (sprawdzone w dokumentacji Google 2026-11-06).
- **Obrazy artykułu 16:9, 4:3 i 1:1** ze zdjęcia głównego (kadry `getImage`, bez powiększania małych plików) i okładka 1200×630: zalecenie Google dla danych `Article` (wiele proporcji, każdy obraz co najmniej 50 000 pikseli; sprawdzone 2026-11-06).
- **`SearchAction`** w `WebSite` tylko w portalu (wyszukiwarka `/szukaj?q=`).
- **`llms.txt`** według llmstxt.org, budowany z treści: opis serwisu, zasada przypisów i oznaczeń, artykuły według działów (z „Materiał partnera” przy treściach sponsorowanych), materiały, zasady redakcji. Tylko teksty indeksowane. Wzór z patrykkorpyta.pl.
- **IndexNow**: klucz w `public/<klucz>.txt` (protokół wymaga, żeby był publiczny; to nie sekret), zostaje także przed startem; skrypt `npm run indexnow` z `--mapa` i `--proba`, logika w `src/lib/indexnow.mjs` z testami. Zgłoszenia tylko po wdrożeniu produkcji. Google nie korzysta z IndexNow, więc Search Console i tak będzie potrzebne (konto Patryka).
- **Pamięć treści Astro a wtyczki Markdowna**: skrót plików wtyczek w nazwie ostatniej wtyczki w `astro.config.mjs`, bo bez tego zmiana wtyczki nie przebudowywała treści lokalnie (CI zaczyna od zera, więc tam błąd był niewidoczny).

## 2026-11-06 — Bio redaktora naczelnego i polska typografia

- **Bio z patrykkorpyta.pl** (strona O mnie i księga marki w repozytorium `paprykak/patrykkorpyta-pl`), bo LinkedIn bez logowania nie pokazuje profilu automatom. Miejsca pracy tylko te, które Patryk sam opublikował (Amazon, IKEA Industry, Gusti Leder, Faraone Poland), bez obecnego pracodawcy (ochrona etatu) i bez wyników w procentach: w medium bio opisuje doświadczenie, a nie sprzedaje usług (prompt: „nie mieszamy tych serwisów”). Profil linkuje tylko LinkedIn (`sameAs`), bez patrykkorpyta.pl. Zdjęcie: kadr z portretu ze strony Patryka, w trzech gęstościach (ostre na telefonie).
- **Polska typografia w całym serwisie** (`src/lib/typografia.mjs`): jednoliterowe słowa (a, i, o, u, w, z) nie zostają na końcu wiersza, liczba nie odrywa się od jednostki ani roku („12 500 zł”, „2017 r.”), skróty („np.”, „art.”) wiążą się z tym, co po nich, półpauza nie zaczyna wiersza, a krótkie człony z dywizem („e-commerce”, „50-osobowy”) nie łamią się na dywizie. Działa w treści Markdowna (wtyczka Sätteri, bez kodu i bez śródtytułów, bo z ich tekstu powstają kotwice, a twarda spacja zmieniała `#fakty-i-źródła` w `#fakty-iźródła`; test pilnuje kotwic) i w tytułach, leadach, bio i FAQ (komponent `Tekst.astro`). Twarde spacje tylko w treści strony; `<title>`, opisy i dane strukturalne zostają bez nich. Dywizu nie zamieniamy na niełamliwy znak (U+2011), tylko owijamy słowo w element bez łamania, żeby wyszukiwarka i Ctrl+F znajdowały „e-commerce”.

## 2026-11-06 — F3: szablony stron

### Start w dwóch krokach w kodzie
- **Cztery tryby budowania** (`src/lib/srodowisko.mjs`): produkcja przed startem, podgląd, build testowy, produkcja po starcie. Prompt wymaga, żeby przed bramką startu `main` publikował tylko „Wkrótce”, a cały portal był na podglądzie z `noindex`. Szablony portalu budują się zawsze (błąd w nich zatrzymuje build `main`), ale integracja usuwa ich pliki z `dist/` według listy w `src/lib/przed-startem.mjs`; mapa strony ma wtedy tylko `/`. Start to zmiana `START = true` w F8, na słowo „wdrażaj”.
- **Zostają przed startem**: „Wkrótce”, 404, 410, polityka prywatności (zgoda przy zapisie na listę oczekujących linkuje do niej) i strony newslettera (worker z F6 przekierowuje na nie). Polityka prywatności jest projektem, więc kontrola SEO ostrzega na produkcji przed startem i blokuje po starcie: przed uruchomieniem zapisu na listę oczekujących musi być zatwierdzona.
- **Treści testowe w osobnym katalogu** `src/content/testowe/` (24 fikcyjne artykuły z tytułami z podglądu F1 i materiał z plikiem PDF), ładowane tylko w podglądzie i buildzie testowym. Panel redakcji ich nie widzi, produkcja nigdy ich nie ładuje (test i kontrola SEO: treść testowa na produkcji to błąd). Zastąpiły podglądy `/podglad/*` i `src/data/podglad.ts`.
- **Build testowy** (`RH_TESTOWE=1`): cały portal z treściami testowymi i z zachowaniem produkcji, żeby E2E, axe, Lighthouse i kontrola SEO sprawdzały szablony na treści i ścieżkę indeksowania. `npm run check` buduje go, testuje, a na końcu buduje i sprawdza produkcję przed startem (`check:start`). W Cloudflare `RH_TESTOWE=1` zatrzymuje build.

### Szablony
- **Strona główna** według podglądu F1, dobór w czystej funkcji z testami (`ukladGlownej`): artykuł wiodący to najnowszy wyróżniony ręcznie, obok trzy kolejne, „Najnowsze” cztery, dwa działy z wiodącym i listą, trzy kolumny działów; żaden tekst dwa razy. Kolumna boczna: „Polecane przez redakcję” (lista w ustawieniach, do 5 tekstów); „Najczęściej czytane” dojdą ze statystykami. Nie nazywamy listy redakcji „najczęściej czytanymi”, bo to byłaby nieprawda.
- **Dział, temat, autor**: wspólny szablon listy, 10 tekstów na stronę (czołówka 1 + 3, potem siatka), stronicowanie `/dzial/<slug>/2`. Cienkie strony list mają `noindex` i są poza mapą strony: temat poniżej 3 tekstów, dział i autor bez tekstów (`src/lib/mapa.mjs`, PROGI). Mapa strony bierze dla list datę najnowszego tekstu.
- **Autor**: bio, kompetencje, profile (`rel="me"`), dane `ProfilePage` z osobą; podpis „Redakcja” to organizacja.
- **Materiały do pobrania**: lista i strona z przyciskiem pobrania (zdarzenie statystyk), podglądami, instrukcją, artykułami, które z materiału korzystają, i danymi `DigitalDocument`.
- **RSS** całości i każdego działu (`@astrojs/rss`), 30 ostatnich tekstów, z autorem i kategoriami; link w `<head>` każdej strony portalu.
- **Strony stałe** w kolekcji `strony` (edycja w panelu): projekty tekstów O nas, zasad redakcyjnych, polityki korekt, oznaczania treści sponsorowanych, jak używamy AI, kontaktu, polityki prywatności (sama struktura do F7), reklamy i newslettera. Każdy projekt ma na stronie widoczne oznaczenie; miejsca do decyzji Patryka w nawiasach kwadratowych.
- **Poprawki pod artykułem** (pole `poprawki`): polityka korekt obiecuje jawny ślad po błędzie, więc serwis musi go pokazywać.
- **„Reklama i współpraca”**: tabela miejsc i formatów generowana z kodu slotów, więc zawsze zgodna z tym, co serwis wyświetla; zamiast statystyk zdanie, że dane podamy z analityki po pierwszych miesiącach (prompt: bez zmyślonych liczb).
- **Newsletter**: strona zapisu i strony techniczne (sprawdź skrzynkę, potwierdzono, wypisano) z `noindex`; zapis zadziała w F6.
- **410**: treść odpowiedzi, którą zwróci worker w F8.

### Wyszukiwarka
- **Pagefind 1.5.2** (przypięta wersja z kwietnia 2026, nie z ostatniego tygodnia), indeks przy buildzie portalu, tylko artykuły i materiały (`data-pagefind-body`), bez reklam, udostępniania, ramek autora i źródeł. Formularz GET działa z nagłówka i stron błędów; bez JavaScriptu strona prowadzi do działów i tematów; wyniki mają `noindex`.
- **CSP tylko na `/szukaj`** dostaje `'wasm-unsafe-eval'` (Pagefind liczy w WebAssembly); to nie jest `eval()`, a kontrola SEO pilnuje, żeby nie pojawiło się na innej stronie.
- **Pagefind nie ma polskiej odmiany słów** i krótkie słowa z tekstu traktuje jak rdzenie („po” pasowało do „politechnika”). Strona wyników zostawia tylko trafienia, w których podświetlone słowo ma z szukanym wspólny początek co najmniej 60% jego długości: „kompletacji” znajduje „kompletacja”, a przypadkowe dopasowania znikają (test E2E).

