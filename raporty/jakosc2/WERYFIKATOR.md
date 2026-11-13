# Audyt jakości 2: weryfikator znalezisk (adwersarz)

Przeczytaj `raporty/jakosc2/WSPOLNE.md` (te same ograniczenia: nic nie zmieniasz w repozytorium poza swoim plikiem
`raporty/jakosc2/<partia>-wer.json`; bez build/check/playwright test; podgląd na 127.0.0.1:4322).

Dostajesz plik z listą znalezisk audytora. Dla KAŻDEGO znaleziska osobno spróbuj je OBALIĆ: przeczytaj sam wskazany kod
(i kod wokół: może problem jest obsłużony gdzie indziej), przepis w .cache/narzedzia/prawo (cytat jednostki redakcyjnej),
odtwórz rachunek albo zachowanie (Python/Node, vitest konkretnego pliku, Playwright na podglądzie). Nie ufaj dowodowi
audytora: sprawdź go od nowa. Gdy przepis nie rozstrzyga, zasada serwisu: liczyć według brzmienia, wariant bezpieczny
dla pracownika i opisać w „Jak liczymy” (wtedy znalezisko o „zgadywaniu” jest prawdziwe tylko, jeśli strona nie mówi, czego
przepis nie rozstrzyga). Kwoty „nowe”: potwierdź w API Sejmu (publikator, kwota, od kiedy obowiązuje według przepisu).
Konwencja terminów z `DECYZJE.md` (Runda 2) i `src/lib/narzedzia/terminy.ts` jest decyzją: odstępstwo od niej to błąd
tylko wtedy, gdy strona go nie opisuje albo przepis szczególny mówi inaczej.

Werdykty: "potwierdzone" (realny błąd/ryzyko, poprawka sensowna), "czesciowo" (problem jest, ale poprawka inna – podaj
właściwą), "odrzucone" (nie ma błędu – uzasadnij), "niepewne" (nie da się rozstrzygnąć – co sprawdzić ręcznie).
Dla potwierdzonych podaj DOKŁADNĄ poprawkę (pliki, co zmienić, oczekiwane wartości testu policzone niezależnie).

Zapisz do `raporty/jakosc2/<partia>-wer.json` i zwróć jako ostatnią wiadomość WYŁĄCZNIE ten sam blok ```json:
{"partia": "...", "werdykty": [{"id": "...", "werdykt": "potwierdzone|czesciowo|odrzucone|niepewne",
  "uzasadnienie": "...", "dowod": "...", "poprawka": "dokładnie co zmienić", "testy": "jakie przypadki i wartości"}],
 "nowe": [/* znaleziska zauważone przy okazji, w formacie audytora (też je sprawdź, zanim wpiszesz) */]}
