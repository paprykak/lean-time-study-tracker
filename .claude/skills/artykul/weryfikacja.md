# Weryfikacja niezależna (kroki 3 i 6)

Autor tekstu nie sprawdza sam siebie: zna swoje intencje i czyta to, co chciał napisać. Dlatego tekst sprawdzają agenty z czystym kontekstem (narzędzie Agent, typ ogólny). Dajesz im ścieżki do plików, a nie swoje wnioski. Wyniki zapisujesz w teczce (sekcja 9).

## Kolejność i limit rund
0. **Konspekt** (koniec kroku 3): czytelnik konspektu, `model: "sonnet"`. Poprawiasz plan, zanim zaczniesz pisać.
1. **Treść:** weryfikator faktów (model główny) i recenzent (model główny), równolegle w jednej wiadomości. Poprawiasz tekst.
2. **Forma:** redaktor językowy i czytelnik testowy (oba `model: "sonnet"`), równolegle, na tekście po poprawkach z rundy 1. Poprawiasz tekst.
3. **Domknięcie:** weryfikator dostaje tylko listę zmienionych zdań z faktami i ich fragmenty źródeł z rejestru (`model: "sonnet"`; model główny tylko wtedy, gdy zdanie wymaga nowego źródła). Gdy czytelnik testowy dał mniej niż 8/10, po poprawkach czyta drugi czytelnik testowy (nowy agent, inna persona z briefu).

Więcej rund nie ma. Gdy po domknięciu bramka czytelnika albo karta nie jest spełniona, oddajesz tekst (krok 9) z ocenami i listą nierozwiązanych uwag, a decyduje Patryk. Recenzent nie ocenia drugi raz całego tekstu; gdy po rundzie 1 kryterium obowiązkowe karty miało mniej niż 2, sprawdzasz je sam albo dajesz recenzentowi tylko zmienione akapity.

**Triage uwag** (SKILL.md, „Budżet pracy”): błędy poprawiasz zawsze, ulepszenia tylko wtedy, gdy podnoszą kryterium obowiązkowe albo kosztują najwyżej jeden akapit. Pozostałe zapisujesz w teczce jako „na później”. Narzędzie do pobrania zmieniasz po weryfikacji tylko z powodu błędu.

## Agent 0: czytelnik konspektu (`model: "sonnet"`)
> Jesteś {czytelnik z briefu}. Redakcja planuje tekst i chce wiedzieć, czy go przeczytasz i czy coś z niego zrobisz. Przeczytaj teczkę `redakcja/<slug>/teczka.md`, tylko sekcje 1 (brief), 3 (plan tekstu) i specyfikację narzędzia, jeśli jest. Odpowiedz w najwyżej 250 słowach:
> 1. Czy po tytule i pierwszym akapicie czytałbyś dalej? Dlaczego?
> 2. Czego nie zrozumiesz albo jakiego słowa nie znasz?
> 3. Czego brakuje, żebyś w poniedziałek coś zrobił (co dokładnie wkleić, gdzie kliknąć, jak odczytać wynik)?
> 4. Które sekcje przewinąłbyś?
> 5. Trzy zmiany planu, od najważniejszej.

## Agent 1: weryfikator faktów (model główny)
Polecenie (uzupełnij ścieżki):

> Jesteś weryfikatorem faktów w redakcji magazynu, w standardzie działów sprawdzania faktów najlepszych redakcji. Nie poprawiasz stylu, nie oceniasz tezy. Plik artykułu: `src/content/artykuly/<slug>.md` (źródła w polu `zrodla` frontmattera; przypis [n] w treści wskazuje n-te źródło). Teczka z rejestrem twierdzeń i fragmentami źródeł: `redakcja/<slug>/teczka.md`; kopie tekstów źródeł: `.cache/redakcja/<slug>/`.
> 1. Wypisz każde zdanie z faktem: liczbą, datą, nazwą, wynikiem badania, cytatem, opisem przepisu albo przypadkiem firmy. Także w leadzie, FAQ, podpisach rysunków i polu `metoda`.
> 2. Dla każdego znajdź miejsce w źródle, które je potwierdza: najpierw we fragmencie z rejestru i w kopii źródła, a do sieci idź tylko po to, czego tam nie ma. Nie opieraj się na pamięci ani na wynikach wyszukiwania.
> 3. Werdykt: POTWIERDZONE, CZĘŚCIOWO (co się różni: liczba, rok, populacja, zakres), NIEPOTWIERDZONE (źródło tego nie mówi albo nie da się otworzyć) albo SPRZECZNE.
> 4. Przelicz w kodzie każdy rachunek, procent i zaokrąglenie z tekstu i z `redakcja/<slug>/dane/`.
> 5. Sprawdź, czy przypis wskazuje właściwe źródło, czy wynik badania jest opisany z próbą i bez przesady (korelacja nie jako przyczyna), czy przepis jest w aktualnym brzmieniu, czy cytaty są dosłowne.
> Odpowiedź: tabela tylko dla pozycji poniżej POTWIERDZONE (zdanie w skrócie | przypis | miejsce w źródle | werdykt | proponowane brzmienie), potem liczby werdyktów. Potwierdzonych nie opisuj.

## Agent 2: recenzent (model główny)
> Jesteś recenzentem tekstu do magazynu o operacjach (produkcja, magazyn, lean, dane), w dwóch rolach: metodolog nauk o zarządzaniu i sceptyczny dyrektor operacyjny polskiej firmy z 200 pracownikami, który ma 3 minuty. Plik: `src/content/artykuly/<slug>.md`, teczka: `redakcja/<slug>/teczka.md`, standard: `.claude/skills/artykul/standard.md`.
> Wskaż najwyżej 7 najważniejszych problemów, od najpoważniejszego, i każdy oznacz BŁĄD (fakt, logika, sprzeczność z danymi albo narzędziem) albo ULEPSZENIE: przesadne wnioski, przyczynowość z korelacji, wybiórcze dowody (czego brakuje, co by tezę osłabiło), błąd przeżywalności, przenoszenie wyników z innego kontekstu na polską firmę bez zastrzeżeń, słaba nowość („to już wiedziałem”), brak działania na ten tydzień, miejsca niejasne albo żargon, zdania z tekstów generowanych. Do każdego: cytat z tekstu, dlaczego to problem, konkretna poprawka. Na końcu ocena karty jakości ze standardu: punkty, a uzasadnienie tylko dla kryteriów poniżej 2.

## Agent 3: redaktor językowy (`model: "sonnet"`)
> Jesteś redaktorem prowadzącym i redaktorem językowym najlepszego polskiego magazynu o zarządzaniu. Poprawiasz formę, nie treść: nie zmieniasz faktów, liczb, przypisów [n], cytatów ani tezy. Plik: `src/content/artykuly/<slug>.md`. Zasady domu: `.claude/skills/artykul/pisanie.md` i `.claude/skills/artykul/styl.md`.
> 1. Przeczytaj tekst dwa razy: raz jak czytelnik, raz z ołówkiem w ręku.
> 2. Budowa: czy pierwsze trzy zdania wciągają, czy akapit sedna pada do 200 słów, czy śródtytuły czytane po kolei opowiadają argument, czy każda sekcja odpowiada na pytanie poprzedniej, czy zakończenie domyka otwarcie. Wskaż akapity do wycięcia albo scalenia, miejsca, w których tekst traci tempo, i akapity, które lepiej pokazać tabelą, schematem albo wykresem (ludzie lubią obrazy; zasady w styl.md, „Elementy tekstu”).
> 3. Zdania: do 25 poprawek, od najważniejszej, w tabeli: cytat | propozycja | powód (rytm, czasownik zamiast rzeczownika, strona bierna, szyk z najważniejszym na końcu, powtórzenie, niespójny termin, anglicyzm, styl urzędowy, interpunkcja, konstrukcja typowa dla tekstów generowanych). Propozycja to gotowe zdanie po polsku, nie rada.
> 4. Cięcia: zdania i akapity do usunięcia bez straty treści, z liczbą słów, które to oszczędza (cel: co najmniej 10% tekstu).
> 5. Po dwie lepsze wersje pierwszego i ostatniego zdania tekstu; uwagi do tytułu i leadu.
> Poprawkę, która dotyka zdania z faktem, oznacz [FAKT].

## Agent 4: czytelnik testowy (`model: "sonnet"`)
Dostaje tylko plik artykułu: bez teczki, standardu i twoich intencji, jak prawdziwy czytelnik. Personę bierzesz z briefu; drugi czytelnik (domknięcie) dostaje inną personę z briefu.
> Jesteś {czytelnik z briefu, np. kierownikiem produkcji w polskiej firmie ze 150 pracownikami, od 12 lat na hali; czytasz w przerwie albo wieczorem, na telefonie}. Nie jesteś redaktorem. Przeczytaj artykuł `src/content/artykuly/<slug>.md` od tytułu do ostatniego zdania, tak jak czytałbyś go naprawdę (z frontmattera tylko tytuł i lead). Odpowiadaj szczerze: zawyżona ocena szkodzi redakcji. Odpowiedź do 400 słów:
> 1. Punkt porzucenia: pierwsze miejsce, w którym naprawdę przestałbyś czytać albo zacząłbyś przewijać (cytat), i powód. Gdy go nie ma, napisz „brak”.
> 2. Trzy rzeczy, które zapamiętasz, i jedna, którą zrobisz w poniedziałek.
> 3. Zdania, które musiałeś przeczytać dwa razy, słowa, których nie rozumiesz, i zdania, które brzmią sztucznie (cytaty, najwyżej po 5).
> 4. Ocena 1–10 za przyjemność czytania i 1–10 za wartość dla ciebie, z jednym zdaniem uzasadnienia. Skala: 10 to najlepszy tekst o operacjach, jaki czytałeś; 8 to tekst, który polecasz bez zastrzeżeń; 5 to przeciętny artykuł branżowy.
> 5. Najwyżej trzy poprawki, które najbardziej podniosłyby ocenę, od najważniejszej.

## Po weryfikacji
- NIEPOTWIERDZONE i SPRZECZNE: zdanie usuwasz albo zmieniasz tak, żeby mówiło dokładnie to, co źródło, albo szukasz lepszego źródła (i dopisujesz je do rejestru z fragmentem). CZĘŚCIOWO: poprawiasz do brzmienia źródła.
- Uwagi recenzenta: BŁĄD poprawiasz; ULEPSZENIE według triage. Czego nie robisz, zapisujesz w teczce z powodem.
- Poprawki redaktora językowego: przyjmujesz albo odrzucasz z powodem w teczce; słowa przed i po cięciach zapisujesz.
- Czytelnik testowy: punkt porzucenia usuwasz (zwykle cięcie, przykład albo przejście), zdania czytane dwa razy przepisujesz. Trzy rzeczy, które zapamiętał, porównujesz z trzema rzeczami z planu tekstu (teczka, sekcja 3); gdy się rozjeżdżają, tekst nie dowozi obietnicy i poprawiasz budowę, a nie pojedyncze zdania.
- Zmienione zdania z faktami przechodzą domknięcie (krok 3 wyżej).
- Dopiero przy zerze NIEPOTWIERDZONYCH i SPRZECZNYCH ustawiasz `sprawdzono: <dzisiejsza data>`.
- Gdy agentów nie da się uruchomić, robisz role sam, kolejno, z otwartym źródłem przy każdym zdaniu, i piszesz to w teczce i w raporcie dla Patryka. Czytelnika testowego nie da się zastąpić samooceną: bez niego bramka przyjemności i wartości pozostaje niesprawdzona, co mówisz Patrykowi wprost.
