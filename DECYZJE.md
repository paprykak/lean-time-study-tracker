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

### Technika
- **Stack jak w patrykkorpyta.pl:** Astro 7.4, Tailwind 4 (tokeny w `@theme`), TypeScript strict, Vitest, Playwright, axe, Lighthouse CI. Przeniesione i dostosowane: `seo-check`, układ `<head>`, udostępnianie bez skryptów, okruszki, konfiguracje testów.
- **CSP w dwóch warstwach:** `<meta>` z Astro (`security.csp`) z hashem każdego skryptu i stylu (bez `unsafe-inline` i `unsafe-eval`) oraz nagłówek z dyrektywami, których nie wolno dać w `<meta>` (`frame-ancestors`). Konsekwencja: bez atrybutów `style=""` (kontrola SEO to sprawdza).
- **Tryb budowania:** gałąź `main` w Cloudflare oraz build lokalny i w GitHub Actions = produkcja; każda inna gałąź w Cloudflare = podgląd z `noindex` w `<meta>` i `X-Robots-Tag` (`src/lib/srodowisko.mjs`). Nagłówki generowane przy buildzie (`dist/_headers`).
- **Cloudflare:** na razie Worker tylko z plikami statycznymi (`wrangler.jsonc`); kod workera (formularze, 410, logowanie do panelu) dochodzi w F2, F6 i F8. Produkcja tylko pod `rytmhali.pl` (`workers_dev: false`), podglądy wersji włączone.
- **Lighthouse:** wszystkie strony ≥ 95 w wydajności, dostępności i dobrych praktykach oraz LCP < 2 s, CLS < 0,02, TBT < 200 ms. **SEO ≥ 95 tylko na stronach indeksowanych:** na 404 i `/styleguide` Lighthouse z definicji obniża SEO za noindex i status 404, a te strony mają być nieindeksowane. Odstępstwo od literalnego brzmienia poprzeczki dla strony 404 jest celowe.
- **Budżet rozmiaru na każdej stronie** (nie tylko artykule): JS ≤ 30 KB, CSS ≤ 40 KB, fonty z preload ≤ 60 KB (gzip).
- **Playwright przypięty do 1.63.0** (zgodność z przeglądarką w środowisku sesji w chmurze; GitHub Actions instaluje przeglądarki tej samej wersji). Testy iPhone'a (WebKit) w GitHub Actions; lokalnie `BEZ_WEBKIT=1`, jeśli brak bibliotek WebKita.
- **Linki do tras z kolejnych faz** (`/dzial/…`, `/newsletter`, strony zaufania) są w kontroli SEO ostrzeżeniem, nie błędem; lista `PLANOWANE` w `scripts/seo-check.mjs` maleje z każdą fazą i ma być pusta przed startem.
- **Node:** `engines` ≥ 22.23.4 (wymóg Astro 7); `.nvmrc` = 24 jak na komputerze Patryka i w CI.
