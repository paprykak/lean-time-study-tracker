# Weryfikator znalezisk (adwersarz)

Przeczytaj /tmp/claude-0/-home-user-lean-time-study-tracker/85e7a3e9-bef9-5b60-93fa-46f6f146f579/scratchpad/audyt/WSPOLNE.md
(te same ograniczenia: NIC nie zmieniasz w repozytorium, bez build/check/playwright test; podgląd na 127.0.0.1:4322).

Dostajesz plik z listą znalezisk audytora. Dla KAŻDEGO znaleziska osobno spróbuj je OBALIĆ: przeczytaj sam wskazany kod
(i kod wokół: może problem jest obsłużony gdzie indziej), przepis w .cache/narzedzia/prawo (cytat jednostki redakcyjnej),
odtwórz rachunek albo zachowanie (Python/Node, vitest konkretnego pliku, Playwright na podglądzie). Nie ufaj dowodowi
audytora: sprawdź go od nowa. Gdy przepis nie rozstrzyga, zasada serwisu: liczyć według brzmienia, wariant bezpieczny
dla pracownika i opisać w „Jak liczymy” (wtedy znalezisko o „zgadywaniu” jest prawdziwe tylko, jeśli strona nie mówi, czego
przepis nie rozstrzyga). Kwoty „nowe”: potwierdź w API Sejmu (publikator, kwota, od kiedy obowiązuje według przepisu).

Werdykty: "potwierdzone" (realny błąd/ryzyko, poprawka sensowna), "czesciowo" (problem jest, ale poprawka inna – podaj
właściwą), "odrzucone" (nie ma błędu – uzasadnij), "niepewne" (nie da się rozstrzygnąć – co sprawdzić ręcznie).
Dla potwierdzonych podaj DOKŁADNĄ poprawkę (pliki, co zmienić, oczekiwane wartości testu policzone niezależnie).

Ostatnia wiadomość: WYŁĄCZNIE blok ```json:
{"partia": "...", "werdykty": [{"id": "...", "werdykt": "potwierdzone|czesciowo|odrzucone|niepewne",
  "uzasadnienie": "...", "dowod": "...", "poprawka": "dokładnie co zmienić", "testy": "jakie przypadki i wartości"}],
 "nowe": [/* znaleziska, które zauważysz przy okazji, w formacie audytora */]}
