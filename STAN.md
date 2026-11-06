# STAN: gdzie jesteśmy

Pamięć robocza projektu. Czyta ją i aktualizuje każda sesja na początku i na końcu pracy.

## Teraz
- **Faza:** F0 i F1 gotowe, **F1 zaakceptowana przez Patryka 2026-11-06** (z kursem: artykuły w stylu HBR, nie wiadomości). Teraz F2: model treści i panel redakcyjny.
- **Gałąź robocza:** `ccr-a1f628ee-snc89w` (sesja w chmurze). `main` bez zmian: nadal stara aplikacja Lean Time Study Tracker, do pierwszego „wdrażaj”.
- **Do obejrzenia:** podgląd strony głównej i artykułu (`raporty/podglad/`, strony `/podglad/strona-glowna` i `/podglad/artykul`), strona wzorów `/styleguide` (lokalnie `npm run dev` → http://localhost:4321/styleguide) i zrzuty w `raporty/F1/`.
- **Ostatnia sesja:** 2026-11-06. Repozytorium wyczyszczone i zaadaptowane, fundament Astro 7, fonty, tokeny, logo (odtworzenie koncepcji C), 20 komponentów, `/styleguide`, „Wkrótce” (szkic), 404, testy. `npm run check` zielone lokalnie i w GitHub Actions (tam także iPhone/WebKit: 60 testów E2E na 3 urządzeniach, 52 zaliczone, 8 celowo pominiętych, np. test klawiatury na telefonie).

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

## Do zrobienia przez Patryka
Od góry według pilności. Każdy punkt to jedna czynność.
- [x] ~~Akceptacja wyglądu F1~~ (2026-11-06).
- [x] ~~Zgoda na zdjęcia~~ (2026-11-06: dopuszczone CC0, CC BY, Unsplash, Pexels; wybór powierzony redakcji, 10 zdjęć w rejestrze).
- [x] ~~Logo po szlifie~~ (2026-11-06: Patryk zaakceptował wersję z podtytułem wersalikami).
- [ ] **Makiety (opcjonalnie):** skopiuj `makiety/` z `/home/patryk/Pulpit/rytm-hali/` do repozytorium; pomogą porównać szablony F3 z drugą makietą. Logo z repozytorium jest zaakceptowane, oryginały logo nie są potrzebne.
- [ ] **Opcjonalnie, więcej zdjęć:** klucz API Unsplash (darmowy, https://unsplash.com/oauth/applications → New Application). Bez klucza nie da się legalnie szukać w Unsplash automatycznie; klucz dodajesz sam w ustawieniach środowiska, nie w czacie.
- [ ] **Repozytorium:** to repozytorium jest **publiczne** i nazywa się `lean-time-study-tracker`. Prompt zakłada prywatne. GitHub → Settings → General: zmień nazwę na `rytm-hali` i na dole „Change repository visibility” → Private. https://github.com/paprykak/lean-time-study-tracker/settings
- [ ] **Domeny:** kup `rytmhali.pl` i `rytmhali.com` i dodaj je do Cloudflare (Add a domain). Bez tego nie da się wdrożyć produkcji.
- [ ] **Cloudflare, projekt Workers z repozytorium:** Workers & Pages → Create → Import a repository → to repozytorium. Build command: `npm run check:szybki`, deploy command: `npx wrangler deploy`, gałęzie inne niż `main`: włącz „Builds for non-production branches”. Potem Zero Trust → Access: zabezpiecz „Preview URLs” Workera (polityka: Twój e-mail). Instrukcja: https://developers.cloudflare.com/workers/ci-cd/builds/
- [ ] **Umami:** dodaj witrynę `rytmhali.pl` w https://cloud.umami.is i podaj identyfikator witryny (to nie jest sekret). Włączymy statystyki po decyzji przy F3.
- [ ] **Przed publicznym startem:** umowa o pracę (zakaz konkurencji, zgoda na działalność dodatkową); przed pierwszą reklamą: forma działalności i rozmowa z prawnikiem (lista pytań w F7).

## Następne kroki (po akceptacji F1)
0. W F3: LCP podglądu strony głównej 1,8 s (limit 2,0 s) – sprawdzić przy prawdziwym szablonie (mniejszy wariant zdjęcia czołówki na telefonie albo preload).
1. F2: kolekcje treści (zod), panel Sveltia CMS z polskimi etykietami, okładki 1200×630, czas czytania, linki w obie strony, próba fikcyjnego wpisu.
2. F3: szablony (główna, dział, temat, autor, artykuł, wyszukiwarka, newsletter, strony stałe, RSS). Każda nowa trasa schodzi z listy `PLANOWANE` w `scripts/seo-check.mjs`.

## Notatki
- W sesji w chmurze nie ma WebKita: lokalnie `BEZ_WEBKIT=1 npm run check`, iPhone w GitHub Actions.
- `astro preview` w Astro 7 nie startuje drugi raz, gdy podgląd już działa: `--ignore-lock` albo `npx astro preview stop`.
- Fonty generuje `npm run fonty` (wymaga `fonts-liberation` do metryki fontu zapasowego); logo `npm run logo`.
