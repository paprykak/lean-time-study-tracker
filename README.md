# Rytm Hali

Narzędzia i przepisy dla ludzi z hali: bezpłatne kalkulatory i ściągi z prawa pracy, wynagrodzeń i zasiłków, czasu
pracy i urlopów, BHP oraz uprawnień UDT dla produkcji, magazynów i logistyki. Przy każdym narzędziu przepis z Dziennika
Ustaw i data sprawdzenia; liczy w przeglądarce, niczego nie wysyła. Adres: **rytmhali.pl**. Redaktor naczelny: Patryk Korpyta.

Statyczny serwis w Astro 7 i Tailwind 4 na Cloudflare Workers (Assets). Narzędzia: rejestr `src/data/narzedzia.ts`,
przepisy `src/data/prawo.ts`, logika z testami w `src/lib/narzedzia/`, strony w `src/pages/narzedzia/`. Wyszukiwarka
narzędzi działa w przeglądarce na indeksie z rejestru i pytań FAQ (`src/lib/szukaj-narzedzi.ts`), pełny tekst przez
Pagefind (`/szukaj`). Strony stałe i kampanie reklamowe edytuje się w panelu Sveltia CMS pod `/admin`. Praca wieloma
zespołami: `prompty/02-fabryka.md`. Artykuły z czasów medium o operacjach są w `archiwum/` (poza buildem).

## Start
```bash
source ~/.nvm/nvm.sh   # na komputerze z nvm (wersja z .nvmrc)
npm ci
npm run dev            # http://localhost:4321, strona wzorów: /styleguide
                       # panel na lokalnych plikach: http://localhost:4321/admin/index.html
                       # → „Pracuj z lokalnym repozytorium” (Chrome albo Edge)
npm run check          # pełna kontrola jakości (lokalnie bez WebKita: BEZ_WEBKIT=1 npm run check)
```

## Dokumenty
- `AGENTS.md`: zasady pracy, polecenia, struktura repozytorium
- `STAN.md`: gdzie jesteśmy i co czeka na Patryka
- `DECYZJE.md`: decyzje z datą i uzasadnieniem
- `prompty/01-budowa-portalu.md`: zadanie, poprzeczki jakości, fazy, lekcje
- `prompty/02-fabryka.md`: koncepcja serwisu narzędzi, standard narzędzia, praca wieloma zespołami
- `archiwum/README.md`: co usunięto 2026-11-12 i skąd
- `marka/README.md`: logo, kolory, fonty

## Historia repozytorium
Do 2026-11-06 repozytorium zawierało aplikację „Lean Time Study Tracker” (Next.js). Na prośbę Patryka zostało
wyczyszczone i zaadaptowane pod Rytm Hali; poprzednia aplikacja jest w historii gita (commit `f273183`).
