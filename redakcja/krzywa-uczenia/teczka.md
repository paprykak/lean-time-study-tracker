# Teczka: krzywa-uczenia

## 0. Tryb pracy
- 2026-11-07: Patryk: „Od razu napisz kolejne trzy i też publikuj od razu!”; temat wybrany przez redakcję (tryb B, „wybierz sam”). Publikacja bez lektury Patryka przed publikacją i bez oznaczenia AI (decyzja w `DECYZJE.md`, 2026-11-07); Patryk czyta tekst krótko po publikacji. Budżet pracy według SKILL.md: jedna runda treści, jedna runda formy, domknięcie na zmienionych zdaniach.

## 1. Brief (skrót)
- Czytelnik: kierownik produkcji, kierowniczka HR albo lider zespołu, który przed szczytem wdraża kilka nowych osób.
- Teza: wdrożenie nowej osoby mierz w sztukach i godzinach poniżej normy, nie w dniach szkolenia, bo koszt nauki skupia się w pierwszych sztukach.
- Wkład: koszt nauki policzony z opublikowanej tabeli Kleizy i Tilindisa (ok. 117 godzin, z czego 112 w pierwszych 100 sztukach), arkusz wdrożenia z przykładem, uczciwe zestawienie dowodów dla TWI (oświadczenia zakładów kontra badanie NBER). Polskie wyniki wyszukiwania mówią o onboardingu w dniach i o kosztach rekrutacji.
- Trzy rzeczy do zabrania: nauka liczy się w sztukach; koszt to godziny poniżej normy, skupione na początku; nie przesuwaj nowej osoby, dopóki jej czas na sztukę spada.
- Test przekazania: „Policzmy przed szczytem, ile godzin poniżej normy kosztuje nas każda nowa osoba; tu jest arkusz.”

## 4. Źródła
Pełne teksty otwartych źródeł: `.cache/redakcja/krzywa-uczenia/` (poza repozytorium). Lista i opisy: `zrodla.json`. Własne obliczenia: `dane/`.

## 9. Weryfikacja
- Runda 1, weryfikator faktów: 42 POTWIERDZONE, 21 CZĘŚCIOWO, 1 SPRZECZNE (opis rozdziału Mishiny w `metoda`), 0 NIEPOTWIERDZONE. Poprawione wszystkie (lead, opis SEO, metoda, zakres 157–298 sztuk w siedmiu eksperymentach).
- Runda 1, recenzent: karta 25/32. Błąd: teza porównywała niewspółmierne jednostki; nowy tytuł i teza (sztuki kontra dni), oszacowania oznaczone jako obliczenia redakcji, pełniejsze cztery kroki TWI, uczciwy śródtytuł o dowodach.
- Runda 2, redaktor językowy: przyjęte zdanie o arkuszu z czwartego dnia, „Ważniejsze, że…”, liczby cyframi, szyk zdania o Kownie, strona czynna przy Wrighcie, lead bez zapowiedzi, „Ty poprawiaj”, przygotowanie instruktora przeniesione do kroku 1 zamiast powtórzenia, otwarcie bez frazy o pierwszym dniu, zakończenie z pierwszym krokiem, inny śródtytuł ograniczeń. Odrzucone: zapis „Sztuka nr 2…” (w prozie czytelniejsze liczebniki porządkowe). Słowa: 1538 przed rundą, 1506 po.
- Runda 2, czytelnik testowy 1 (kierowniczka HR i szkoleń w zakładzie montażowym): porzucenia brak, zwolnienie przy TWI i NBER; przyjemność 6/10, wartość 6/10. Zrobione: arkusz wdrożenia w tabeli z przykładem, prostsze nazwy („czas, na którym montaż się ustalił”), wyjaśniona produktywność, zdanie o instruktorze bez wolnego czasu, skrócona historia TWI.
- Domknięcie, czytelnik testowy 2 (lider zespołu na linii montażu elektroniki): przewijanie od akapitu o dowodach TWI; przyjemność 6/10, wartość 7/10. Zrobione: dowody TWI w czterech zdaniach (bez kordu i liczby oświadczeń), bez zdania o skali logarytmicznej, przedział 110–166 godzin przeniesiony do `metoda`, bez „470 godzin”, objaśniona kolumna tabeli, konkret zamiast „krzywa nie ma do czego zbiec”. Na później: część praktyczna przed sekcją o TWI (zmiana budowy).
- Domknięcie, weryfikacja zmienionych zdań (model sonnet): C1–C9 i D5–D8: 13 POTWIERDZONE; uwaga do D7 przyjęta (efekt instruktażu „na sprzedaż i produktywność”); dopisane, że wyniki z lat 40. dotyczą całego programu.
- `sprawdzono`: 2026-11-07.

## 10. Kontrola automatyczna
- `redakcja:kontrola`: 1506 słów i tabela, FOG-PL 9,2, średnio 14,8 słowa w zdaniu, rytm 0,45; bez błędów i uwag. Akapit sedna po 196 słowach.
- `redakcja:zrodla`: 6 źródeł bez problemów.
- Testy: pełne `npm run check` przed wdrożeniem (wynik w STAN.md).

## 11. Karta jakości
- Bramki twarde: weryfikacja ✓; kontrola automatyczna ✓; licencja zdjęcia ✓ (rejestr, CC0); dane pracodawców ✓; metoda ✓; redaktor językowy ✓; **czytelnik testowy ✗** (6/10 i 6–7/10).
- Punkty (ocena redakcji po poprawkach; recenzent po rundzie 1: 25/32): 1:2, 2:2, 3:1, 4:2, 5:2, 6:2, 7:2, 8:2, 9:2, 10:2, 11:2, 12:2, 13:2, 14:2, 15:2, 16:2 = **31/32**. Kryterium 3 (obowiązkowe): pomiary z Kowna dotyczą procesu, a nie pojedynczych nowych osób; badania pracowników z grupą porównawczą nie znaleźliśmy (tekst to mówi).

## 12. Dla Patryka
- Bramka czytelnika i kryterium 3 niespełnione; tekst opublikowany na polecenie „publikuj od razu”. Do decyzji: przebudowa (część praktyczna przed TWI) i arkusz do pobrania.

## 13. Kontrola redakcyjna
Tryb „publikuj od razu” (SKILL.md, zasada 6): Patryk czyta tekst krótko po publikacji.
| Data | Kto | Decyzja | Co zmieniono |
|---|---|---|---|
| 2026-11-07 | Patryk (polecenie z rozmowy) | publikuj od razu, bez lektury przed publikacją | czyta po publikacji; zmiany wpisujemy w sekcji 14 |

## 14. Zmiany po publikacji
| Data | Co zmieniono | Dlaczego |
|---|---|---|
