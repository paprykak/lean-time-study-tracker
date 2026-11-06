# Weryfikacja niezależna (krok 6)

Autor tekstu nie sprawdza sam siebie: zna swoje intencje i czyta to, co chciał napisać. Dlatego weryfikację robią dwa agenty z czystym kontekstem (narzędzie Agent, typ ogólny), uruchomione równolegle w jednej wiadomości. Dajesz im ścieżki do plików, a nie swoje wnioski. Wyniki zapisujesz w teczce (sekcja 8).

## Agent 1: weryfikator faktów
Polecenie (uzupełnij ścieżki):

> Jesteś weryfikatorem faktów w redakcji magazynu, w standardzie działów sprawdzania faktów najlepszych redakcji. Nie poprawiasz stylu, nie oceniasz tezy. Plik artykułu: `src/content/artykuly/<slug>.md` (źródła w polu `zrodla` frontmattera; przypis [n] w treści wskazuje n-te źródło). Teczka z rejestrem twierdzeń: `redakcja/<slug>/teczka.md`.
> 1. Wypisz każde zdanie z faktem: liczbą, datą, nazwą, wynikiem badania, cytatem, opisem przepisu albo przypadkiem firmy. Także w leadzie, FAQ, podpisach rysunków i polu `metoda`.
> 2. Dla każdego otwórz źródło z przypisu (adres z `zrodla`) i znajdź miejsce, które je potwierdza: dosłowny fragment, tabela, strona. Nie opieraj się na pamięci ani na wynikach wyszukiwania.
> 3. Werdykt: POTWIERDZONE, CZĘŚCIOWO (co się różni: liczba, rok, populacja, zakres), NIEPOTWIERDZONE (źródło tego nie mówi albo nie da się otworzyć) albo SPRZECZNE.
> 4. Przelicz w kodzie każdy rachunek, procent i zaokrąglenie z tekstu i z `redakcja/<slug>/dane/`.
> 5. Sprawdź, czy przypis wskazuje właściwe źródło, czy wynik badania jest opisany z próbą i bez przesady (korelacja nie jako przyczyna), czy przepis jest w aktualnym brzmieniu, czy cytaty są dosłowne.
> Odpowiedz tabelą: zdanie (skrót) | przypis | miejsce w źródle | werdykt | uwaga. Na końcu liczby werdyktów.

## Agent 2: recenzent
> Jesteś recenzentem tekstu do magazynu o operacjach (produkcja, magazyn, lean, dane), w dwóch rolach: metodolog nauk o zarządzaniu i sceptyczny dyrektor operacyjny polskiej firmy z 200 pracownikami, który ma 3 minuty. Plik: `src/content/artykuly/<slug>.md`, teczka: `redakcja/<slug>/teczka.md`, standard: `.claude/skills/artykul/standard.md`.
> Wskaż najwyżej 10 najważniejszych problemów, od najpoważniejszego: przesadne wnioski, przyczynowość z korelacji, wybiórcze dowody (czego brakuje, co by tezę osłabiło), błąd przeżywalności, przenoszenie wyników z innego kontekstu na polską firmę bez zastrzeżeń, słaba nowość („to już wiedziałem”), brak działania na ten tydzień, miejsca niejasne albo żargon, zdania z tekstów generowanych. Do każdego: cytat z tekstu, dlaczego to problem, konkretna poprawka. Na końcu ocena karty jakości ze standardu (punkty i uzasadnienie w jednym zdaniu na kryterium).

## Po weryfikacji
- NIEPOTWIERDZONE i SPRZECZNE: zdanie usuwasz albo zmieniasz tak, żeby mówiło dokładnie to, co źródło, albo szukasz lepszego źródła (i dopisujesz je do rejestru). CZĘŚCIOWO: poprawiasz do brzmienia źródła.
- Uwagi recenzenta: poprawiasz albo w teczce piszesz, dlaczego nie (np. dowód, którego brakuje, nie istnieje — wtedy mówi o tym tekst).
- Zmienione zdania przechodzą weryfikację jeszcze raz (ten sam agent z listą zmienionych zdań).
- Dopiero przy zerze NIEPOTWIERDZONYCH i SPRZECZNYCH ustawiasz `sprawdzono: <dzisiejsza data>`.
- Gdy agentów nie da się uruchomić, robisz obie role sam, kolejno, z otwartym źródłem przy każdym zdaniu, i piszesz to w teczce i w raporcie dla Patryka.
