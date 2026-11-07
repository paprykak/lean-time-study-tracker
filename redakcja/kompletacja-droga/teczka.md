# Teczka: kompletacja-droga

## 0. Tryb pracy
- 2026-11-07: Patryk: „Od razu napisz kolejne trzy i też publikuj od razu!”; temat wybrany przez redakcję (tryb B, „wybierz sam”). Publikacja bez lektury Patryka przed publikacją i bez oznaczenia AI (decyzja w `DECYZJE.md`, 2026-11-07); Patryk czyta tekst krótko po publikacji. Budżet pracy według SKILL.md: jedna runda treści, jedna runda formy, domknięcie na zmienionych zdaniach.

## 1. Brief (skrót)
- Czytelnik: kierownik magazynu albo właściciel firmy dystrybucyjnej z ofertą robotów do kompletacji na biurku.
- Teza: kto kupuje roboty przed uporządkowaniem rozmieszczenia i trasy, płaci za automatyzację drogi, którą dało się skrócić bez zakupów.
- Wkład: własna symulacja (10 alejek, 600 indeksów, 20 tys. zamówień na wariant) zestawia zmianę trasy i rozmieszczenia przy 5, 15 i 30 pozycjach na zamówienie; rachunek etatów jako punkt wyjścia do zwrotu z robotów; trzy pytania do dostawcy. Polskie wyniki wyszukiwania dają ogólne opisy ABC albo oferty automatyzacji bez takiego rachunku.
- Trzy rzeczy do zabrania: droga to typowo połowa czasu kompletacji; rozmieszczenie według liczby pobrań i trasa dobrana do pobrań na alejkę skracają drogę o jedną trzecią i więcej; zwrot z robotów licz od drogi po uporządkowaniu.
- Test przekazania: „Zanim podpiszemy roboty, sprawdźmy, ile drogi skrócimy samym przełożeniem towaru; tu jest, jak to policzyć.”

## 4. Źródła
Pełne teksty otwartych źródeł: `.cache/redakcja/kompletacja-droga/` (poza repozytorium). Lista i opisy: `zrodla.json`. Własne obliczenia: `dane/`.

## 9. Weryfikacja
- Runda 1, weryfikator faktów (52 twierdzenia): 39 POTWIERDZONE, 11 CZĘŚCIOWO, 1 NIEPOTWIERDZONE, 1 SPRZECZNE (podpis zdjęcia). Poprawione wszystkie: zakresy w leadzie i opisie SEO do wyników symulacji (33–45%), podpis zdjęcia, brzmienia częściowe.
- Runda 1, recenzent: karta 25/32. Błędy: czas kompletacji utożsamiony z drogą, wolne etaty liczone jak gotówka, zakresy 27–43% i 20–45% niezgodne ze źródłami, brak spornej tezy w leadzie; wszystkie poprawione. Na później: źródło o tłoku kompletujących (np. Gue, Meller, Skufca 2006) do sekcji o granicach.
- Runda 2, redaktor językowy: przyjęte scalenie opisu symulacji, podmiot i klamra w zakończeniu (wraca dystrybutor chemii), stały termin „klasa A”, zapowiedź przykładu, zdanie o podręczniku, nowe ostatnie zdanie, polskie nazwy tras z angielskimi w nawiasie, „order picking” przy pierwszym użyciu, inny śródtytuł ograniczeń. Usunięte zdania bez źródła („zmienisz w miesiąc”); zdanie o łączeniu zamówień oparte na progu z wcześniejszej części tekstu. Słowa: 1579 przed rundą, 1687 po (cięcia ok. 60 słów, dopisane przenoszenie i uzupełnianie, objaśnienia pojęć, wariant dla 40 osób).
- Runda 2, czytelnik testowy 1 (kierownik magazynu dystrybucyjnego, 40 osób na zmianę): porzucenia brak, przewijanie przy opisie symulacji; przyjemność 6/10, wartość 7/10. Zrobione: jeden punkt odniesienia dla procentów, usunięta pozorna sprzeczność rady o kolejności, objaśnione „punkt wydań” i „sortownia”, akapit o przenoszeniu i uzupełnianiu, wariant dla 40 osób. Co zabiera, pokrywa się z planem.
- Domknięcie, czytelnik testowy 2 (właściciel hurtowni, 25 osób w magazynie): przewijanie od „Granice klas znajdziesz w danych”; przyjemność 6/10, wartość 7/10. Zrobione: SKU, „linia zamówienia”, arkusz z WZ bez systemu magazynowego, rozpisany rachunek etatów, usunięte zdanie-hasło. Na później: strefy i łączenie zamówień jako krótka ramka, mniejsza gęstość liczb w środku, rysunek obu tras.
- Domknięcie, weryfikacja zmienionych zdań (model sonnet): K1–K5 i D9: 4 POTWIERDZONE, 2 CZĘŚCIOWO (zaokrąglenie 256 tys. zł, zdanie o łączeniu zamówień jako wniosek redakcji); obie poprawione.
- `sprawdzono`: 2026-11-07.

## 10. Kontrola automatyczna
- `redakcja:kontrola`: 1687 słów, FOG-PL 10,6, średnio 14,9 słowa w zdaniu, rytm 0,46; bez błędów i uwag.
- `redakcja:zrodla`: 3 źródła bez problemów (DOI de Kostera i Tarczyńskiego potwierdzone).
- Testy: pełne `npm run check` przed wdrożeniem (wynik w STAN.md).

## 11. Karta jakości
- Bramki twarde: weryfikacja ✓ (0 niepotwierdzonych i sprzecznych); kontrola automatyczna ✓; licencja zdjęcia ✓ (rejestr, CC0); dane pracodawców ✓; metoda ✓; redaktor językowy ✓; **czytelnik testowy ✗** (dwóch czytelników: 6/10 i 7/10).
- Punkty (ocena redakcji po poprawkach; recenzent po rundzie 1: 25/32): 1:2, 2:2, 3:2, 4:1, 5:2, 6:2, 7:2, 8:2, 9:2, 10:2, 11:1, 12:2, 13:2, 14:2, 15:2, 16:2 = **30/32**. Kryterium 4: sekcja o granicach bez źródła o tłoku; kryterium 11: zdjęcie pokazuje przenośniki, a nie kompletację między regałami.

## 12. Dla Patryka
- Bramka czytelnika niespełniona (6/10 przyjemność, 7/10 wartość u obu czytelników); tekst opublikowany na polecenie „publikuj od razu”. Do decyzji: druga wersja z ramką o strefach i rysunkiem tras.
- Czego nie sprawdzono: udziału drogi w polskich magazynach (brak publicznych pomiarów; tekst to mówi).

## 13. Kontrola redakcyjna
Tryb „publikuj od razu” (SKILL.md, zasada 6): Patryk czyta tekst krótko po publikacji.
| Data | Kto | Decyzja | Co zmieniono |
|---|---|---|---|
| 2026-11-07 | Patryk (polecenie z rozmowy) | publikuj od razu, bez lektury przed publikacją | czyta po publikacji; zmiany wpisujemy w sekcji 14 |

## 14. Zmiany po publikacji
| Data | Co zmieniono | Dlaczego |
|---|---|---|
