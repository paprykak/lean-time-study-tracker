# Rytm Hali

Niezależne medium o operacjach: produkcja, magazyn i logistyka, lean i ciągłe doskonalenie, dane i AI, ludzie i szkolenia.
Adres docelowy: **rytmhali.pl**. Redaktor naczelny: Patryk Korpyta.

Statyczny portal w Astro 7 i Tailwind 4, hostowany na Cloudflare Workers (Assets). Panel redakcyjny (Sveltia CMS),
wyszukiwarka (Pagefind) i newsletter dochodzą w kolejnych fazach, opisanych w `prompty/01-budowa-portalu.md`.

## Start
```bash
source ~/.nvm/nvm.sh   # na komputerze z nvm (wersja z .nvmrc)
npm ci
npm run dev            # http://localhost:4321, strona wzorów: /styleguide
npm run check          # pełna kontrola jakości (lokalnie bez WebKita: BEZ_WEBKIT=1 npm run check)
```

## Dokumenty
- `AGENTS.md`: zasady pracy, polecenia, struktura repozytorium
- `STAN.md`: gdzie jesteśmy i co czeka na Patryka
- `DECYZJE.md`: decyzje z datą i uzasadnieniem
- `prompty/01-budowa-portalu.md`: zadanie, poprzeczki jakości, fazy, lekcje
- `marka/README.md`: logo, kolory, fonty, rejestr zdjęć

## Historia repozytorium
Do 2026-11-06 repozytorium zawierało aplikację „Lean Time Study Tracker” (Next.js). Na prośbę Patryka zostało
wyczyszczone i zaadaptowane pod Rytm Hali; poprzednia aplikacja jest w historii gita (commit `f273183`).
