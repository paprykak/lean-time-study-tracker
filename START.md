# Lista kontrolna startu Rytmu Hali

Dwa kroki z promptu (sekcja 8, F8). Każdy punkt ma właściciela; „Claude” robi go po słowie Patryka albo po jego zgodzie.
Szczegóły kont i sekretów: STAN.md („Do zrobienia przez Patryka”).

## Krok 1: strona „Wkrótce” z zapisem na listę oczekujących

| # | Co | Kto |
|---|---|---|
| 1 | Domeny `rytmhali.pl` i `rytmhali.com` w Cloudflare | Patryk |
| 2 | Projekt Workers z tego repozytorium (build `npm run check:szybki`, deploy `npx wrangler deploy`, gałęzie z podglądem), Access na adresach podglądu | Patryk |
| 3 | Przekierowania: `www.rytmhali.pl` i `rytmhali.com` → `https://rytmhali.pl` (reguły przekierowań w Cloudflare) | Patryk albo Claude po zgodzie |
| 4 | Konto Brevo: lista, szablon potwierdzenia, sekret `BREVO_API_KEY`; numery listy i szablonu do `wrangler.jsonc` | Patryk (konto i sekret), Claude (konfiguracja) |
| 5 | Poczta: rekordy Brevo (DKIM, DMARC, jeden SPF), Email Routing `redakcja@rytmhali.pl`, zmienna `ADRES_REDAKCJI`, wiązanie `send_email` | Patryk (DNS i adres), Claude (konfiguracja) |
| 6 | Zatwierdzona polityka prywatności i regulamin newslettera (projekty bez oznaczenia „projekt”) | Patryk (i prawnik) |
| 7 | Próbny zapis i wiadomość z formularza na podglądzie gałęzi | Claude, potwierdzenie maila: Patryk |
| 8 | `npm run check` zielone, `git log origin/main..main` puste, słowo „wdrażaj” | Claude, Patryk |
| 9 | Po wdrożeniu: `npm run test:produkcja -- --domeny`, `npm run indexnow -- --mapa` | Claude |
| 10 | Search Console (domena przez rekord TXT) i Bing Webmaster Tools, zgłoszone mapy stron; monitor dostępności (np. UptimeRobot) | Patryk (konta), Claude (instrukcja i zgłoszenia) |

## Krok 2: pełny portal

**2026-11-07: start pełnego portalu decyzją Patryka** (bez punktów 1 i 4 poniżej; krok 1 pominięty). Zrobione: 2 (strony zaufania zatwierdzone), 5 (`START = true`, check zielony, „wdrażaj”), 6 (test produkcji, IndexNow). Zostaje: 1 (kolejne teksty), 3 (Umami), 4 (prawnik), 7 (przeglądy po 14 i 28 dniach).

| # | Co | Kto |
|---|---|---|
| 1 | Bramka: co najmniej 12 opublikowanych artykułów w co najmniej 4 działach, każdy przeczytany i zatwierdzony przez Patryka (kontrola redakcyjna) | Patryk i skill `/artykul` |
| 2 | Strony zaufania zatwierdzone (O nas, zasady, korekty, oznaczanie reklam, jak używamy AI, kontakt, stopka redakcyjna): kontrola SEO po starcie blokuje projekt | Patryk |
| 3 | Umami: identyfikator witryny, skrypt i CSP, opis w polityce prywatności | Patryk (konto), Claude (wdrożenie) |
| 4 | Odpowiedzi prawnika (`prawne/pytania-do-prawnika.md`), forma działalności przed pierwszą reklamą | Patryk |
| 5 | `START = true` w `src/lib/srodowisko.mjs`, `npm run check` zielone, słowo „wdrażaj” | Claude, Patryk |
| 6 | Po wdrożeniu: `npm run test:produkcja -- --domeny`, `npm run indexnow -- --mapa`, mapa strony w Search Console, zrzuty komputer i telefon | Claude |
| 7 | Przegląd po 14 i 28 dniach: indeks, błędy, wydajność z danych terenowych | Claude, decyzje: Patryk |
