# Standard Rytmu Hali: poziom wyżej niż Harvard Business Review

Punkt odniesienia to najlepsze magazyny zarządzania: Harvard Business Review, MIT Sloan Management Review, McKinsey Quarterly. HBR ocenia teksty według pięciu cech: ekspertyza, dowody, oryginalność, użyteczność i dobre pisanie dla mądrego, sceptycznego i zajętego czytelnika ([wytyczne HBR](https://hbr.org/guidelines-for-authors)). Bierzemy to w całości (jedna sporna teza, diagnoza przyczyny, rama, dowody, decyzja dla szefa) i dokładamy to, czego tam brakuje.

## Dziewięć przewag nad HBR
1. **Przypis przy każdej liczbie i każdym wniosku z badania**, klikalny, do źródła pierwotnego, z rodzajem źródła i datą dostępu. HBR odsyła do badań opisem albo linkiem w tekście; czytelnik nie wie, które zdanie opiera się na czym.
2. **Nazwana siła dowodów** (A–D z [dowody.md](dowody.md)) i język pewności proporcjonalny do niej. Korelacja nie udaje przyczyny.
3. **Przeciwdowody i granice w każdym tekście**: co najmniej jedno źródło, które tezę ogranicza, i sekcja „Kiedy to nie działa”.
4. **Niezależna weryfikacja faktów przed publikacją** ([weryfikacja.md](weryfikacja.md)), z datą w ramce „Jak powstał ten tekst”.
5. **Polski kontekst:** dane GUS i Eurostatu dla Polski, polskie prawo, kwoty w złotych, skala firm 20–250 osób, realia hali w Polsce.
6. **Analiza własna na danych publicznych**, odtwarzalna: dane i skrypt w teczce, wykres z tytułem-wnioskiem.
7. **Działanie na ten tydzień:** krok, rachunek albo wzór do pobrania, który czytelnik wykorzysta bez kupowania czegokolwiek.
8. **Niezależność jawna dla czytelnika:** HBR prosi autorów o ujawnienie powiązań finansowych swojej redakcji, a większość jego autorów to, według jego wytycznych, wykładowcy szkół biznesu albo konsultanci. My metodę i konflikty interesów opisujemy czytelnikowi pod tekstem i nie promujemy usług autora.
9. **Tekst, który chce się czytać, sprawdzony przed publikacją:** HBR wymaga dobrego pisania; my je mierzymy. Rzemiosło z [pisanie.md](pisanie.md), redaktor językowy i czytelnik testowy, którzy nie znają intencji autora, i próg przyjemności oraz wartości w karcie jakości.

## Pięć pytań redaktora (przed pierwszym akapitem)
Pytania, które [wytyczne HBR](https://hbr.org/guidelines-for-authors) każą zawrzeć w propozycji tekstu (sprawdzone 2026-11-06), dostosowane do naszego czytelnika; odpowiedzi w teczce:
1. Jaka jest teza w jednym zdaniu? Twierdzenie, z którym da się nie zgodzić, a nie temat.
2. Co w niej jest nowe, ważne albo sprzeczne z intuicją?
3. Dlaczego kierownik, dyrektor operacyjny albo właściciel firmy potrzebuje jej teraz i co z nią zrobi w tym tygodniu?
4. Skąd autorytet: badania, dane publiczne, analiza własna, rozmowa z praktykiem, materiał Patryka?
5. Jakie dowody tezę wspierają, a jakie ją ograniczają?

Przykład. Temat „SMED” to nie teza. Teza: „Połowę czasu przezbrojenia da się odzyskać bez inwestycji, ale tylko tam, gdzie przezbrojenie jest wąskim gardłem; w innych miejscach skrócenie przezbrojenia nie zwiększa produkcji ani o sztukę”.

## Anatomia według formatu
Wspólne dla wszystkich: tytuł do 70 znaków (teza albo obietnica wglądu, nie etykieta), lead 2–3 zdania (napięcie i teza; to fragment cytowany przez wyszukiwarki i asystentów AI), otwarcie i akapit sedna do 200 słów, śródtytuły-wnioski, zakończenie, które domyka otwarcie albo daje pierwszy krok ([pisanie.md](pisanie.md)), FAQ 3–5 prawdziwych pytań czytelnika, źródła, pole `metoda`.

| Format | Długość (słowa) | Budowa |
|---|---|---|
| **Poradnik** | 1 500–2 500 (cel: do 2 000) | W skrócie (Problem, Dlaczego, Co zrobić) → diagnoza → rama z nazwą i rysunkiem → 3–5 kroków (każdy: wniosek, uzasadnienie, przykład) → przypadek prowadzący → kiedy to nie działa → co zrobić w tym tygodniu |
| **Analiza** | 2 000–3 500 | W skrócie → teza i stawka → dowody (najmocniejsze najpierw) → mechanizm (dlaczego tak jest) → przeciwdowody → co z tego wynika dla decyzji → co zrobić |
| **Raport** | 1 500–3 000 | Kluczowe liczby (3–5) → dane i metoda analizy własnej → wyniki z rysunkami → interpretacja i ograniczenia danych → implikacje |
| **Wywiad** | 1 500–3 000 | Wstęp: kim jest rozmówca i dlaczego warto go słuchać → pytania i autoryzowane odpowiedzi → ramka „Co z tego wynika” z faktami sprawdzonymi przez redakcję |
| **Komentarz** | 700–1 200 | Teza w pierwszym zdaniu → 2–3 argumenty z dowodami → najmocniejszy kontrargument i odpowiedź → stanowisko; jasno oznaczony jako opinia |
| **Wzór do pobrania** | 600–1 200 + plik | Do czego służy wzór → jak go wypełnić (przykład na danych fikcyjnych) → typowe błędy → plik w kolekcji „Materiały do pobrania” |

„W skrócie” w Markdownie: śródtytuł `## W skrócie` i trzy akapity zaczynające się od **Problem.**, **Dlaczego.**, **Co zrobić.** (po 1–2 zdania).
Przypadek prowadzący: jeden, rozbudowany, do którego tekst wraca. Kolejność: materiał Patryka (tylko jego), publicznie opisany przypadek ze źródłem, przykład na danych fikcyjnych oznaczony przy pierwszym użyciu.

## Pole `metoda` (ramka „Jak powstał ten tekst”, do 700 znaków)
Wzór: „Tekst opiera się na {liczba} źródłach, w tym {najmocniejsze, np. dwóch metaanalizach i danych GUS za 2025 r.}. {Analizę własną policzyliśmy na danych …; dane i kod są w archiwum redakcji.} {Rozmawialiśmy z … (tylko prawdziwa rozmowa).} {Konflikt interesów: brak / opis.}”
Bez wzmianki o narzędziach, których redakcja używa (decyzja Patryka z 2026-11-06; SKILL.md, zasada 6).
Liczby źródeł według rodzaju i datę weryfikacji ramka dopisuje sama (z pól `zrodla[].rodzaj` i `sprawdzono`).

## Karta jakości
**Bramki twarde** (każda musi być spełniona, inaczej nie oddajesz tekstu):
- [ ] Weryfikacja: zero twierdzeń niepotwierdzonych albo sprzecznych ze źródłem.
- [ ] Kontrola automatyczna bez błędów (`redakcja:kontrola`, `redakcja:zrodla`, testy).
- [ ] Licencja zdjęcia potwierdzona na stronie źródła, data w teczce.
- [ ] Zero danych pracodawców Patryka, zmyślonych cytatów i cudzego doświadczenia w pierwszej osobie.
- [ ] `metoda` opisuje najważniejsze źródła i konflikt interesów (albo jego brak), bez wzmianki o narzędziach.
- [ ] Czytelnik testowy: przyjemność i wartość co najmniej 8/10, punkt porzucenia usunięty, a to, co zabiera, pokrywa się z trzema rzeczami z planu tekstu. Gdy po drugim czytelniku ocena jest niższa, nie ma trzeciej rundy: raport podaje oceny i nierozwiązane uwagi, a o publikacji decyduje Patryk ([weryfikacja.md](weryfikacja.md)).
- [ ] Redaktor językowy: każda poprawka przyjęta albo odrzucona z powodem w teczce; zdania z faktami po poprawkach sprawdzone ponownie.

**Ocena** (0 = brak, 1 = częściowo, 2 = w pełni). Próg: co najmniej 28 z 32 punktów, żadnego zera, a kryteria 1, 3, 7, 13 i 15 na 2.
| # | Kryterium | 2 punkty, gdy… |
|---|---|---|
| 1 | Teza | sporna, w jednym zdaniu, w leadzie |
| 2 | Nowość | wkład, którego nie ma w pierwszych wynikach po polsku i po angielsku, jest nazwany w teczce i widoczny w tekście |
| 3 | Dowody | kluczowa teza ma źródła A lub B; każda liczba ma przypis |
| 4 | Przeciwdowody | jest źródło ograniczające tezę i sekcja o granicach |
| 5 | Pewność | czasowniki pasują do siły dowodów; bez przyczynowości z korelacji, z wielkością efektu i próbą przy badaniach |
| 6 | Polski kontekst | polskie dane, prawo albo realia tam, gdzie istnieją |
| 7 | Użyteczność | czytelnik wie, co zrobić w tym tygodniu; jest rachunek, krok albo wzór |
| 8 | Przypadek | jeden przypadek prowadzi przez tekst, ze źródłem albo oznaczony jako fikcyjny |
| 9 | Dane i rysunek | analiza własna albo rysunek z tytułem-wnioskiem i źródłem |
| 10 | Czytelność | FOG-PL do 12, średnio do 18 słów w zdaniu, śródtytuły-wnioski |
| 11 | Zdjęcie | autentyczne, trafne do tezy, kadry 16:9 i 1:1 działają, alt opisuje treść |
| 12 | Test dyrektora | sceptyczny dyrektor po 3 minutach pomyśli „tego nie wiedziałem” albo „to zmienia moją decyzję” |
| 13 | Otwarcie | pierwsze trzy zdania wciągają (scena, przypadek, paradoks, liczba albo pytanie czytelnika), akapit sedna do 200 słów, bez definicji i zapowiedzi |
| 14 | Łuk | sztafeta pytań: każda sekcja odpowiada na pytanie poprzedniej; przypadek wraca; zakończenie domyka otwarcie albo daje pierwszy krok |
| 15 | Zdania | rytm zróżnicowany, czasowniki zamiast rzeczowników, strona czynna, terminy stałe; każda uwaga kontroli stylu poprawiona albo uzasadniona w teczce |
| 16 | Gęstość wartości | test usunięcia nie znajduje akapitu do wycięcia; jest narzędzie i kryterium decyzji; zdanie z testu przekazania jest w teczce |
