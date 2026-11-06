# Weryfikacja niezależna (krok 6)

Autor tekstu nie sprawdza sam siebie: zna swoje intencje i czyta to, co chciał napisać. Dlatego tekst sprawdzają agenty z czystym kontekstem (narzędzie Agent, typ ogólny). Dajesz im ścieżki do plików, a nie swoje wnioski. Wyniki zapisujesz w teczce (sekcja 9).

Dwie rundy, w każdej dwa agenty uruchomione równolegle w jednej wiadomości, a potem domknięcie:
1. **Treść:** weryfikator faktów i recenzent. Poprawiasz tekst.
2. **Forma:** redaktor językowy i czytelnik testowy, na tekście po poprawkach z rundy 1. Poprawiasz tekst.
3. **Domknięcie:** zdania z faktami zmienione w rundzie 2 wracają do weryfikatora faktów; gdy czytelnik testowy dał mniej niż 8/10, po poprawkach czyta nowy czytelnik testowy (nowy agent, czysty kontekst).

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

## Agent 3: redaktor językowy
> Jesteś redaktorem prowadzącym i redaktorem językowym najlepszego polskiego magazynu o zarządzaniu. Poprawiasz formę, nie treść: nie zmieniasz faktów, liczb, przypisów [n], cytatów ani tezy. Plik: `src/content/artykuly/<slug>.md`. Zasady domu: `.claude/skills/artykul/pisanie.md` i `.claude/skills/artykul/styl.md`.
> 1. Przeczytaj tekst dwa razy: raz jak czytelnik, raz z ołówkiem w ręku.
> 2. Budowa: czy pierwsze trzy zdania wciągają, czy akapit sedna pada do 200 słów, czy śródtytuły czytane po kolei opowiadają argument, czy każda sekcja odpowiada na pytanie poprzedniej, czy zakończenie domyka otwarcie. Wskaż akapity do wycięcia albo scalenia i miejsca, w których tekst traci tempo.
> 3. Zdania: do 40 poprawek, od najważniejszej, w tabeli: cytat | propozycja | powód (rytm, czasownik zamiast rzeczownika, strona bierna, szyk z najważniejszym na końcu, powtórzenie, niespójny termin, anglicyzm, styl urzędowy, interpunkcja, konstrukcja typowa dla tekstów generowanych). Propozycja to gotowe zdanie po polsku, nie rada.
> 4. Cięcia: zdania i akapity do usunięcia bez straty treści, z liczbą słów, które to oszczędza (cel: co najmniej 10% tekstu).
> 5. Po dwie lepsze wersje pierwszego i ostatniego zdania tekstu; uwagi do tytułu i leadu.
> Poprawkę, która dotyka zdania z faktem, oznacz [FAKT].

## Agent 4: czytelnik testowy
Dostaje tylko plik artykułu: bez teczki, standardu i twoich intencji, jak prawdziwy czytelnik. Personę bierzesz z briefu; tekst dla dwóch grup czytelników czytają dwaj czytelnicy testowi.
> Jesteś {czytelnik z briefu, np. kierownikiem produkcji w polskiej firmie ze 150 pracownikami, od 12 lat na hali; czytasz w przerwie albo wieczorem, na telefonie}. Nie jesteś redaktorem. Przeczytaj artykuł `src/content/artykuly/<slug>.md` od tytułu do ostatniego zdania, tak jak czytałbyś go naprawdę (z frontmattera tylko tytuł i lead). Odpowiadaj szczerze: zawyżona ocena szkodzi redakcji.
> 1. Krzywa uwagi: każda sekcja w skali 1–5 (jak bardzo chciałeś czytać dalej) i jedno zdanie dlaczego.
> 2. Punkt porzucenia: pierwsze miejsce, w którym naprawdę przestałbyś czytać albo zacząłbyś przewijać (cytat), i powód. Gdy go nie ma, napisz „brak”.
> 3. Trzy rzeczy, które zapamiętasz, i jedna, którą zrobisz w poniedziałek.
> 4. Komu prześlesz tekst i z jakim jednym zdaniem; gdy nikomu, dlaczego.
> 5. Zdania, które musiałeś przeczytać dwa razy, i słowa, których nie rozumiesz (cytaty).
> 6. Zdania, które brzmią sztucznie: jak z broszury, z urzędu albo z generatora tekstu (cytaty).
> 7. Ocena 1–10 za przyjemność czytania i 1–10 za wartość dla ciebie, z uzasadnieniem i z tym, co podniosłoby każdą o 2 punkty. Skala: 10 to najlepszy tekst o operacjach, jaki czytałeś; 8 to tekst, który polecasz bez zastrzeżeń; 5 to przeciętny artykuł branżowy.

## Po weryfikacji
- NIEPOTWIERDZONE i SPRZECZNE: zdanie usuwasz albo zmieniasz tak, żeby mówiło dokładnie to, co źródło, albo szukasz lepszego źródła (i dopisujesz je do rejestru). CZĘŚCIOWO: poprawiasz do brzmienia źródła.
- Uwagi recenzenta: poprawiasz albo w teczce piszesz, dlaczego nie (np. dowód, którego brakuje, nie istnieje — wtedy mówi o tym tekst).
- Poprawki redaktora językowego: przyjmujesz albo odrzucasz z powodem w teczce; słowa przed i po cięciach zapisujesz.
- Czytelnik testowy: punkt porzucenia usuwasz (zwykle cięcie, przykład albo przejście), zdania czytane dwa razy przepisujesz. Trzy rzeczy, które zapamiętał, porównujesz z trzema rzeczami z planu tekstu (teczka, sekcja 3); gdy się rozjeżdżają, tekst nie dowozi obietnicy i poprawiasz budowę, a nie pojedyncze zdania.
- Zmienione zdania przechodzą weryfikację jeszcze raz (ten sam agent z listą zmienionych zdań).
- Dopiero przy zerze NIEPOTWIERDZONYCH i SPRZECZNYCH ustawiasz `sprawdzono: <dzisiejsza data>`.
- Gdy agentów nie da się uruchomić, robisz role sam, kolejno, z otwartym źródłem przy każdym zdaniu, i piszesz to w teczce i w raporcie dla Patryka. Czytelnika testowego nie da się zastąpić samooceną: bez niego bramka przyjemności i wartości pozostaje niesprawdzona, co mówisz Patrykowi wprost.
