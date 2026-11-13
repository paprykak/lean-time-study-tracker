# Teczka: smed-przezbrojenia

## 0. Tryb pracy
- 2026-11-07: Patryk: „Od razu napisz kolejne trzy i też publikuj od razu!”; temat wybrany przez redakcję (tryb B, „wybierz sam”). Publikacja bez lektury Patryka przed publikacją i bez oznaczenia AI (decyzja w `DECYZJE.md`, 2026-11-07); Patryk czyta tekst krótko po publikacji. Budżet pracy według SKILL.md: jedna runda treści, jedna runda formy, domknięcie na zmienionych zdaniach.

## 1. Brief (skrót)
- Czytelnik: kierownik produkcji albo specjalista ciągłego doskonalenia przed decyzją o warsztatach SMED.
- Teza: skracaj przezbrojenia najpierw na wąskim gardle; poza nim zysk z SMED jest mały, a procent skrócenia nie mówi, ile zakład zarobi.
- Wkład: rachunek redakcji porównujący to samo skrócenie na wąskim gardle i na maszynie z wolnym czasem (wzór Harrisa, rozbicie oszczędności na przezbrojenia i mniejsze partie); zestawienie przedziału 20–90% z tym, że tylko 10 z 30 opisów mówi o ograniczeniach. Polskie wyniki wyszukiwania powtarzają obietnicę „do kilku minut” bez rachunku miejsca.
- Trzy rzeczy do zabrania: zysk zależy od maszyny, nie od procentu; na wąskim gardle godzina to produkcja, poza nim głównie czas ustawiaczy; odzyskany czas trzeba z góry przeznaczyć.
- Test przekazania: „Zanim zamówimy warsztat SMED, wybierzmy maszynę z kolejką i policzmy godziny, nie procenty.”

## 4. Źródła
Pełne teksty otwartych źródeł: `.cache/redakcja/smed-przezbrojenia/` (poza repozytorium). Lista i opisy: `zrodla.json`. Własne obliczenia: `dane/`.

## 9. Weryfikacja
- Runda 1, weryfikator faktów (69 pozycji): 39 POTWIERDZONE, 19 CZĘŚCIOWO, 11 NIEPOTWIERDZONE, 0 SPRZECZNE. Niepotwierdzone (m.in. „zwykle 20–50%, nie 90%”, „opisy pokazują sukcesy”) usunięte albo zastąpione brzmieniem źródeł (20–90%, 10 z 30 opisów z ograniczeniami); autorzy i tytuł przeglądu Barrantes poprawione.
- Runda 1, recenzent: karta 24/32. Błąd: rachunek pomijał, że przy starych partiach też oszczędzasz koszt przezbrojeń; rachunek przepisany (3 000 zł z przezbrojeń + 515 zł z mniejszych partii). Usunięta definicja z otwarcia, przypadek wtryskarki wszedł do rachunków.
- Runda 2, redaktor językowy: przyjęte „co trzeci opis” raz zamiast trzech razy, rozpisane „dwa razy” (ludzie i produkcja), finał z krokiem na poniedziałek, szyk zdania o Shingo, usunięte „Tylko tyle.” i „Nie wszystkie.”, „nikt nie próbował”, rozwinięte OEE, bezosobowa forma w kroku 4, otwarcie sceną zamiast ramy z kompletacji. Odrzucone: scalenie akapitów meksykańskiego i polskiego (dwa różne kłopoty, po skróceniu oba krótkie). Słowa: 1413 przed rundą, 1570 po (dopisane czynności na wtryskarce i prasie, test wąskiego gardła, wniosek dla zarządu).
- Runda 2, czytelnik testowy 1 (kierownik wtryskarni, 120 osób): porzucenia brak, zwolnienie przy Harrisie i tabeli; przyjemność 6/10, wartość 7/10. Zrobione: lista czynności przezbrojenia wtryskarki, wyjaśnione „maquiladora”, zdanie o największych partiach zastąpione regułą dla zakładu bez wąskiego gardła, drugi test wąskiego gardła, Harris w jednym zdaniu wniosku.
- Domknięcie, czytelnik testowy 2 (specjalista lean, tłoczenie i obróbka): przewijanie w sekcji o porażkach; przyjemność 6/10, wartość 7/10. Zrobione: sekcja skrócona, wniosek dla zarządu, prasa i matryca, wyjaśnione 515 zł, „skracały się” zamiast „rozciągają się”, bez „mikroprzestojów”, jedno „Weźmy” mniej. Na później: pełny przykład z tłoczenia; czasu zwrotu warsztatu nie podajemy (brak źródła cen).
- Domknięcie, weryfikacja zmienionych zdań (model sonnet): S1–S7 i D1–D4: 9 POTWIERDZONE, 2 CZĘŚCIOWO („zwykle” przy przyczynach porażek; autorstwo i rok u Harrisa); obie poprawione w brzmieniu weryfikatora.
- `sprawdzono`: 2026-11-07.

## 10. Kontrola automatyczna
- `redakcja:kontrola`: 1570 słów i tabela, FOG-PL 9,7, średnio 14,5 słowa w zdaniu, rytm 0,45; bez błędów i uwag.
- `redakcja:zrodla`: 4 źródła bez problemów.
- Testy: pełne `npm run check` przed wdrożeniem (wynik w STAN.md).

## 11. Karta jakości
- Bramki twarde: weryfikacja ✓; kontrola automatyczna ✓; licencja zdjęcia ✓ (rejestr, CC0); dane pracodawców ✓; metoda ✓; redaktor językowy ✓; **czytelnik testowy ✗** (dwóch czytelników: 6/10 i 7/10).
- Punkty (ocena redakcji po poprawkach; recenzent po rundzie 1: 24/32): 1:2, 2:2, 3:1, 4:2, 5:2, 6:2, 7:2, 8:2, 9:2, 10:2, 11:1, 12:2, 13:2, 14:2, 15:2, 16:2 = **30/32**. Kryterium 3 (obowiązkowe): teza o wąskim gardle opiera się na rachunku redakcji i wzorze Harrisa, bez badania A/B porównującego miejsca wdrożenia; kryterium 11: zdjęcie pokazuje linię montażu, a nie przezbrojenie.

## 12. Dla Patryka
- Bramka czytelnika i kryterium 3 niespełnione; tekst opublikowany na polecenie „publikuj od razu”. Do decyzji: dodać źródło o teorii ograniczeń (np. przegląd zastosowań TOC) i przykład z tłoczenia.
- Zdjęcie do wymiany, gdy znajdzie się otwarte zdjęcie przezbrojenia (wymiany formy albo matrycy).

## 13. Kontrola redakcyjna
Tryb „publikuj od razu” (SKILL.md, zasada 6): Patryk czyta tekst krótko po publikacji.
| Data | Kto | Decyzja | Co zmieniono |
|---|---|---|---|
| 2026-11-07 | Patryk (polecenie z rozmowy) | publikuj od razu, bez lektury przed publikacją | czyta po publikacji; zmiany wpisujemy w sekcji 14 |

## 14. Zmiany po publikacji
| Data | Co zmieniono | Dlaczego |
|---|---|---|
