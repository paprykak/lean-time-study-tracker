# Archiwum: treści z czasów magazynu z artykułami

Od 2026-11-12 Rytm Hali to wyłącznie narzędzia i przepisy dla ludzi z hali (`prompty/02-fabryka.md`, sekcja 1).
Artykuły i materiały o wydajności należą do GembaHQ i tu nie wracają. Żeby nie zgubić pracy, wszystko, co zniknęło
z `src/`, `public/` i katalogu redakcji, leży tutaj w niezmienionej postaci. Ten katalog jest poza buildem: Astro,
testy i panel go nie czytają.

Ostatni commit z pełnym serwisem artykułów: `68f0a48` (`git checkout 68f0a48 -- <ścieżka>` przywraca dowolny plik
w miejscu, z którego pochodził).

| Tutaj | Skąd | Co to jest |
|---|---|---|
| `tresci/artykuly/` | `src/content/artykuly/` | 8 opublikowanych artykułów (OEE, SMED, prognozy, krzywa uczenia, kompletacja, inwentaryzacja, sprężone powietrze, grafik zmian a wypadki) i 1 testowy |
| `tresci/materialy/` | `src/content/materialy/` | opisy materiałów do pobrania: karta definicji OEE, test prognozy |
| `public/pobierz/` | `public/pobierz/` | pliki materiałów (PDF, XLSX) |
| `assets/materialy/` | `src/assets/materialy/` | podglądy stron materiałów |
| `tresci/dzialy/`, `tresci/tematy/` | `src/content/dzialy/`, `src/content/tematy/` | 5 działów i 10 tematów |
| `tresci/autorzy/`, `assets/autorzy/` | `src/content/autorzy/`, `src/assets/autorzy/` | strony autorów (Patryk Korpyta, Redakcja) ze zdjęciem |
| `tresci/zdjecia/`, `assets/zdjecia/` | `src/content/zdjecia/`, `src/assets/zdjecia/` | rejestr licencji zdjęć (źródło, autor, licencja, zgoda) i pliki zdjęć |
| `assets/rysunki/` | `src/assets/rysunki/` | wykresy SVG z artykułów |
| `redakcja/` | `redakcja/` | teczki artykułów (research, weryfikacja, karty jakości, wstrzymane szkice) |
| `skill-artykul/skill/` | `.claude/skills/artykul/` | skill `/artykul` |
| `skill-artykul/scripts/` | `scripts/redakcja/`, `scripts/zdjecia/`, `src/lib/kontrola-tekstu.mjs`, `src/lib/licencje.mjs` (z testami) | narzędzia skilla: kontrola tekstu, źródła, zdjęcia, licencje |

Kod szablonów (strona artykułu, działy, tematy, autorzy, materiały, RSS, okładki udostępnień, karty, wtyczki
przypisów i rysunków) nie jest tu kopiowany: jest w historii git pod commitem `68f0a48`.

## Adresy publiczne

Usunięte adresy odpowiadają 410 albo 301 przez worker (`worker/usuniete.js`, lista w `assets.run_worker_first`
w `wrangler.jsonc`, zgodność pilnuje test `worker/usuniete.test.mjs`):

- 301: `/grafik-zmian-wypadki` → `/narzedzia/kontrola-grafiku` (narzędzie sprawdza ten sam grafik z Kodeksem pracy);
- 410: pozostałe artykuły, `/rss.xml`, `/do-pobrania` i wszystko pod `/do-pobrania/`, `/pobierz/`, `/dzial/`,
  `/temat/`, `/autor/`, `/okladki/`.

## Gdyby coś miało wrócić

Teksty o wydajności przenosi się do GembaHQ, nie z powrotem tutaj. Zdjęcie albo materiał wraca do Rytmu Hali tylko
z decyzją Patryka i wpisem w rejestrze licencji (AGENTS.md, zasada 9); adres wraca wtedy z listy w `worker/usuniete.js`.
