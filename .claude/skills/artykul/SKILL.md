---
name: artykul
description: Pisze artykuł do Rytmu Hali od tematu do szkicu gotowego do akceptacji, na poziomie wyższym niż Harvard Business Review — teza z dowodami i przeciwdowodami z badań i danych publicznych, przypis przy każdej liczbie, niezależna weryfikacja faktów, zdjęcie z otwartej licencji wpisane do rejestru, plik w src/content/artykuly. Użyj, gdy Patryk pisze „/artykul”, „napisz artykuł”, „nowy tekst”, „tekst o …”, „pomysł na artykuł”, „popraw artykuł”, „zaktualizuj tekst”, „wywiad z …”.
---

# Artykuł do Rytmu Hali

Rytm Hali publikuje najlepszy tekst po polsku na dany temat operacji: z tezą, z dowodami, które czytelnik sprawdzi jednym kliknięciem, i z działaniem na ten tydzień. Poprzeczka jest wyżej niż w Harvard Business Review: przypis do źródła pierwotnego przy każdej liczbie, nazwana siła dowodów, niezależna weryfikacja faktów przed publikacją i jawna metoda pod tekstem. Gdy tej poprzeczki nie da się przejść, tekst nie powstaje — lepiej żaden niż przeciętny.

## Zanim zaczniesz
- Przeczytaj [standard.md](standard.md) (poprzeczka, anatomia według formatu, karta jakości). Pozostałe pliki czytasz w swoim kroku: [dowody.md](dowody.md), [styl.md](styl.md), [zdjecia.md](zdjecia.md), [weryfikacja.md](weryfikacja.md).
- `AGENTS.md` (zasady nieprzekraczalne), `STAN.md`, lista artykułów w `src/content/artykuly/`, działy i tematy w `src/content/dzialy/` i `src/content/tematy/`: nie dubluj tematu, wybierz dział, tematy i powiązane teksty.
- Załóż teczkę `redakcja/<slug>/teczka.md` z [teczka-wzor.md](teczka-wzor.md). Wszystkie notatki, źródła, rejestr twierdzeń i decyzje są w teczce, nigdy w pliku artykułu (komentarz HTML widać w źródle strony).

## Tryby
- **A. Patryk podaje temat** → kroki 1–9.
- **B. Pomysł na tekst** → 3 propozycje (tytuł roboczy, czytelnik, pytanie, teza, dowód popytu, luka w wynikach, format, dział) i rekomendacja. **STOP:** Patryk wybiera („wybierz sam” = rekomendacja).
- **C. Aktualizacja** → slug i data publikacji zostają, `zaktualizowano` = dziś (tylko przy zmianie merytorycznej), każda liczba i link sprawdzone od nowa, wpis w sekcji „Zmiany” teczki.
- **D. Wywiad** → wyłącznie z nagrania albo notatek z prawdziwej rozmowy, którą dostarczy Patryk. Rozmówcę informujesz przed rozmową o prawie do autoryzacji dosłownie cytowanych wypowiedzi, a gdy jej zażąda, dajesz mu je do autoryzacji (Prawo prasowe, art. 14a: do 24 godzin dla czasopism, chyba że strony umówią się inaczej); publikacja nagrania wymaga zgody rozmówcy (art. 14 ust. 1; tekst jednolity Dz.U. 2018 poz. 1914, bez późniejszych zmian według API Sejmu, sprawdzone 2026-11-06). Nigdy nie wymyślaj rozmówcy, cytatu ani parafrazy.

## Kroki
1. **Brief i teza** (teczka, sekcje 1–2). Czytelnik, jego pytanie, teza w jednym zdaniu (taka, z którą da się nie zgodzić), wkład nowy względem tego, co jest w wynikach wyszukiwania po polsku i po angielsku, format, dział, tematy, długość. Popyt: podpowiedzi `https://suggestqueries.google.com/complete/search?client=firefox&hl=pl&gl=pl&q=<fraza>` (dowodzą, że fraza jest wpisywana; skali nie podawaj). Bez dobrej tezy zmień kąt, zanim zaczniesz szukać.
   **STOP** tylko w trybie B albo gdy temat dotyka pracy Patryka, jego usług, partnera lub kampanii: jedno pytanie z opcjami.
2. **Research** według [dowody.md](dowody.md). Plan pytań → źródła pierwotne otwarte i przeczytane dalej niż streszczenie → każde w tabeli źródeł teczki z siłą dowodu A–D. Przy szerszym temacie uruchom równolegle do 3 agentów badawczych (badania, dane publiczne, prawo i kontekst polski) z wąskim zadaniem; kluczowe źródła otwórz sam, nie ufaj streszczeniom. Gdzie dane publiczne pozwalają, zrób własną analizę w kodzie (`redakcja/<slug>/dane/`).
   Gdy dowody nie wspierają tezy, zmieniasz tezę, a nie dowody. Gdy dowody są słabe (tylko C–D), tekst może być Komentarzem albo nie powstaje — napisz to Patrykowi.
3. **Konspekt** według anatomii formatu ze [standard.md](standard.md) i **rejestr twierdzeń**: każde twierdzenie, które trafi do tekstu, z numerem źródła i miejscem w źródle (strona, tabela, cytat).
4. **Pisanie** według [styl.md](styl.md): przypis `[n]` przy każdej liczbie i każdym wniosku z badania, przykłady liczbowe policzone w kodzie i oznaczone „przykład na danych fikcyjnych”, rysunek z tytułem-wnioskiem, FAQ, źródła w kolejności przypisów (z `rodzaj` i `dostep`), pole `metoda`, `szkic: true`, autor według zasady 3.
5. **Zdjęcie** według [zdjecia.md](zdjecia.md): `npm run redakcja:zdjecia -- "<fraza po angielsku>" --artykul=<slug>` → obejrzyj stykówkę → licencja potwierdzona na stronie źródła → `--wybierz` → `npm run zdjecia -- --tylko=<plik>` → obejrzyj kadry.
6. **Weryfikacja niezależna** według [weryfikacja.md](weryfikacja.md): weryfikator faktów i recenzent, dwa agenty z czystym kontekstem, równolegle. Poprawiasz wszystko, co niepotwierdzone, a zmienione zdania przechodzą weryfikację jeszcze raz. Dopiero wtedy `sprawdzono: <dzisiejsza data>`.
7. **Kontrola automatyczna** (wszystko bez błędów):
   - `npm run redakcja:kontrola -- <slug>` (przypisy, liczby bez źródła, frazy z tekstów generowanych, czytelność);
   - `npm run redakcja:zrodla -- <slug>` (adresy, DOI, wycofane badania; odpowiedzi 403 i 429 sprawdź ręcznie);
   - `npx astro sync && npx vitest run src/lib/kontrola-tekstu.test.ts src/lib/zdjecia.test.ts src/lib/redakcja.test.ts`.
8. **Karta jakości** ze [standard.md](standard.md): wszystkie bramki twarde i próg punktowy; wynik w teczce. Nie przechodzi → wróć do kroku, który zawiódł.
9. **Oddanie.** `RH_PODGLAD=1 npx astro build --outDir <katalog roboczy>`, zrzuty strony `/<slug>` na komputerze i telefonie (Playwright, axe bez naruszeń), commit na gałęzi roboczej: „Artykuł: <tytuł> (szkic)”. Raport dla Patryka do 10 linijek: tytuł, teza, 3 najmocniejsze dowody, najważniejsze ograniczenie, wynik karty jakości, co musi uzupełnić lub zdecydować, zrzuty.
   **STOP:** `szkic: false` tylko po zgodzie Patryka, a produkcja dopiero po słowie „wdrażaj” (AGENTS.md, zasada 1).

## Zasady nieprzekraczalne
1. **Zero zmyśleń.** Liczba, badanie, cytat, osoba, firma i przypadek tylko ze źródła otwartego w tej pracy. Czego nie potwierdzisz, usuwasz albo piszesz wprost, że wiarygodnych danych brak.
2. **Przypis przy każdej liczbie i każdym wniosku z badania**, do źródła pierwotnego (badanie, tabela GUS), nie do omówienia omówienia.
3. **Autor:** domyślnie `redakcja`. `patryk-korpyta` tylko wtedy, gdy Patryk tekst napisał albo przeredagował i przyjął jako swój (jego decyzja). Pierwsza osoba o doświadczeniu tylko z jego materiału; bez niego miejsce `[DO UZUPEŁNIENIA: …]`.
4. **Niezależność redakcji:** bez reklamy i linków do usług Patryka (patrykkorpyta.pl) w treści; konflikt interesów opisany w `metoda`. Treść sponsorowana wyłącznie przez pole `partner`, z oznaczeniem.
5. **Dane pracodawców Patryka: zero** (AGENTS.md, zasada 4); bez realiów magazynu części samochodowych (decyzja Patryka z 2026-11-05 przy blogu, ta sama ochrona etatu).
6. **AI jawnie:** pole `metoda` mówi, do czego użyto AI i kto zatwierdził tekst; odpowiedzialność za publikację ma redaktor.
7. **Prawo:** cytat to urywek w zakresie uzasadnionym celem (wyjaśnianie, polemika, analiza), zawsze z twórcą i źródłem (ustawa o prawie autorskim, art. 29 i 34; tekst jednolity Dz.U. 2025 poz. 24, sprawdzony 2026-11-06); wizerunek według [zdjecia.md](zdjecia.md); prawo pracy, BHP, RODO i AI Act tylko ze źródłem w przepisie, bez porad — odsyłasz do specjalisty.
8. **Bez masówki:** jeden temat, jeden tekst z nazwanym wkładem, którego nie ma w wynikach wyszukiwania.

## Na koniec
- Teczka kompletna: karta jakości, wynik weryfikacji, decyzje i miejsca do uzupełnienia dla Patryka.
- Po każdej poprawce Patryka jedna linia w „Lekcjach” poniżej (`RRRR-MM-DD — co robić inaczej (dlaczego)`); gdy dotyczy całego projektu, także na końcu `prompty/01-budowa-portalu.md`. Ponad 15 lekcji: przenieś je do treści kroków.

## Lekcje
<!-- RRRR-MM-DD — lekcja (jedno zdanie, dlaczego) -->
