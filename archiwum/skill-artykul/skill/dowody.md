# Dowody: skąd brać, jak oceniać, jak pisać o nich uczciwie

## Siła dowodu A–D (oznaczenie w tabeli źródeł teczki)
Skala własna redakcji, wzorowana na praktyce zarządzania opartego na dowodach (Center for Evidence-Based Management, https://cebma.org) i na hierarchii dowodów w naukach o zdrowiu. W polu `zrodla[].rodzaj` zapisujesz rodzaj, w teczce także siłę.

| Siła | Co to jest | Do czego wystarcza |
|---|---|---|
| **A** | Przegląd systematyczny lub metaanaliza; oficjalne dane publiczne (GUS, Eurostat) dla faktów opisowych; tekst przepisu dla tego, co przepis mówi | Kluczowa teza tekstu |
| **B** | Pojedyncze badanie recenzowane z mocnym planem: eksperyment, quasi-eksperyment, duża próba, dane panelowe | Kluczowa teza, z opisem próby i ograniczeń |
| **C** | Badanie przekrojowe lub ankietowe, studium przypadku w recenzowanym czasopiśmie, raport instytucji z opisaną metodą, klasyczna książka (dla idei i metod, nie dla liczb) | Wsparcie i ilustracja; nie jedyne oparcie tezy |
| **D** | Raport firmy lub dostawcy, ankieta bez metody, opinia, artykuł prasowy, blog | Tylko ilustracja, nazwana wprost („według danych dostawcy …”) |

Kluczowa teza potrzebuje co najmniej dwóch źródeł A lub B, gdy takie badania istnieją. Gdy nie istnieją, piszesz to wprost („badań na ten temat jest mało; najlepsze, co mamy, to …”).

## Jak czytać badanie (zapisz w teczce przy każdym źródle A–C)
- **Kto, na kim, ile, gdzie, kiedy:** autorzy, populacja, liczebność próby, kraj i branża, lata danych.
- **Plan:** czy wynik jest przyczynowy (eksperyment, quasi-eksperyment) czy tylko współwystępowanie (przekrój, ankieta).
- **Wielkość efektu**, nie tylko istotność: o ile, w jakich jednostkach, z jakim przedziałem.
- **Porównanie:** z czym zestawiono wynik (grupa kontrolna, okres przed).
- **Status:** recenzowane czy preprint lub working paper (wtedy piszesz to w zdaniu), finansowanie i konflikt interesów autorów, replikacje i polemiki, wycofanie (`npm run redakcja:zrodla`).
- **Przenośność:** czy wynik dotyczy firm podobnych do polskich firm produkcyjnych i logistycznych z 20–250 osobami.

Czytaj źródło pierwotne dalej niż streszczenie: metodę, tabelę wyników, ograniczenia. Gdy pełny tekst jest płatny, opierasz się na streszczeniu autora i piszesz w teczce, czego nie dało się sprawdzić.

## Język pewności
| Dowód | Piszesz | Nie piszesz |
|---|---|---|
| Eksperyment, metaanaliza | „powoduje”, „skraca o”, „w eksperymencie … skróciło o” | „zawsze”, „w każdej firmie” |
| Badanie przekrojowe | „wiąże się z”, „firmy, które …, częściej …” | „powoduje”, „dzięki” |
| Studium przypadku | „w jednym zakładzie …”, „w opisanym przypadku …” | „firmy osiągają” |
| Raport dostawcy | „według danych dostawcy …”, „ankieta firmy X (bez opisu metody)” | liczby bez nazwania źródła |
Przy badaniu w zdaniu podaj, kto badał, na kim i ile: „W badaniu 1 200 zakładów w Niemczech …”.

## Gdzie szukać (sprawdzone z sesji 2026-11-06)
**Badania**
- Wyszukiwarka (WebSearch, tryb „extended” przy trudnych tematach): frazy po angielsku z „meta-analysis”, „systematic review”, „field experiment”, „panel data”, a także po polsku.
- Crossref, bez klucza: `https://api.crossref.org/works?query=<fraza>&filter=type:journal-article&rows=20&select=DOI,title,container-title,issued,is-referenced-by-count`. Metadane i wycofania pojedynczej pracy: `https://api.crossref.org/works/<DOI>` (pole `updated-by`, z danymi Retraction Watch).
- Narzędzie wyszukiwania badań Consensus (MCP), gdy jest w sesji: szybki przegląd literatury; każdą pracę i tak otwierasz u źródła.
- OpenAlex (`api.openalex.org`) od 2026 r. wymaga darmowego klucza (bez niego wspólny limit dla adresu IP wyczerpuje się szybko). Klucz zakłada Patryk; w sesji w chmurze przez sekret środowiska. Semantic Scholar bez klucza często zwraca 429.
- Pełne teksty: wersje otwarte (strona autora, repozytorium uczelni, PubMed Central, SSRN i arXiv — to preprinty, oznacz je).

**Dane publiczne dla Polski**
- Eurostat API: `https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/<kod>?format=JSON&geo=PL&time=<rok>&lang=en`. Pytaj o jedną wartość każdego wymiaru naraz i dekoduj JSON-stat w kodzie. Czytelnikowi linkuj `https://ec.europa.eu/eurostat/databrowser/view/<kod>/default/table?lang=en`.
- GUS: publikacje na stat.gov.pl i Bank Danych Lokalnych (`bdl.stat.gov.pl/api/v1`). Z sesji w chmurze BDL nie odpowiadał (2026-11-06); z komputera Patryka działa. Także PARP, NBP, CIOP-PIB, Państwowa Inspekcja Pracy (raporty z kontroli).

**Prawo**
- API Sejmu (ELI): `https://api.sejm.gov.pl/eli/acts/DU/<rok>/<pozycja>` (status, tekst jednolity, zmiany) i tekst `…/text.pdf`. Zawsze sprawdź najnowszy tekst jednolity i późniejsze zmiany; cytuj „Dz.U. <rok> poz. <pozycja>, art. …”. Przykład z 2026-11-06: dawny art. 14 ust. 2 Prawa prasowego jest uchylony, autoryzację reguluje art. 14a — pamięć bywa nieaktualna.
- Normy (ISO, PN-EN): numer i tytuł z katalogu (iso.org, pkn.pl); treść norm jest płatna, więc nie przytaczasz jej poza publicznym opisem.

## Liczby
- Każda liczba: rok danych, jednostka, populacja („firmy z 10 i więcej pracującymi, 2025 r.”). Nie łączysz liczb z różnych definicji i lat w jednym rachunku.
- Rachunki i przykłady liczysz w kodzie (`redakcja/<slug>/dane/`), w tekście wynik z sensownym zaokrągleniem. Kwoty w złotych; przeliczenie z euro z kursem NBP i datą.
- Nie cytujesz liczb z pamięci ani z opisu w wynikach wyszukiwania; tylko ze strony, którą otworzyłeś.

## Analiza własna (przewaga 6)
Gdy dane publiczne odpowiadają na pytanie czytelnika lepiej niż cudze raporty: dane surowe i skrypt w `redakcja/<slug>/dane/`, wynik sprawdzony drugim sposobem (np. suma kontrolna, inne zapytanie), rysunek SVG w `src/assets/rysunki/<slug>-<n>.svg` (kolory z `src/styles/global.css`, bez ozdobników; wykres wyświetla się jako obraz, więc nie dostaje fontów strony: napisy zamień na krzywe z `src/assets/fonty/og/noto-sans-600.ttf` przez opentype.js, jak w generatorze logo, albo zostaw `font-family="Noto Sans, Arial, sans-serif"`), w tekście `![opis danych](../../assets/rysunki/<slug>-<n>.svg "Rysunek <n>. <Wniosek>. Źródło: …")`.
