# Styl Rytmu Hali (krok 4)

Piszemy dla mądrego, sceptycznego i zajętego czytelnika: kierownika zmiany, kierownika magazynu, dyrektora operacyjnego, właściciela firmy, specjalisty ciągłego doskonalenia. Myślenie jak w najlepszych magazynach zarządzania, język prosty i polski. Ten plik to zasady zdania, typografii i elementów tekstu; budowę, otwarcie, rytm i wartość opisuje [pisanie.md](pisanie.md).

## Zasady
- **Najpierw wynik, potem szczegóły**: w leadzie, w „W skrócie”, w sekcji i w akapicie. Treść może zacząć się od sceny albo przypadku, ale teza pada najpóźniej w akapicie sedna ([pisanie.md](pisanie.md), część 2). Śródtytuł to wniosek („Połowa przezbrojenia to czekanie”), nie etykieta („Analiza czasu”). Wyjątek: kroki poradnika („Krok 2: oddziel czynności wewnętrzne od zewnętrznych”).
- **Proza prowadzi argument.** Akapity łączą przejścia („dlatego”, „ale”, „to prowadzi do”), sekcja kończy się myślą, która otwiera następną. Listy tylko dla rzeczy naprawdę równoległych, najwyżej 2–3 w tekście.
- **Krótko i konkretnie:** zdania średnio do 18 słów (krótkie po dłuższym podkreśla wniosek), akapity 2–4 zdania, FOG-PL do 12 (`npm run redakcja:kontrola` liczy oba). Strona czynna i konkretny wykonawca: „kierownik zmiany przepisuje dane”, nie „dane są przepisywane”.
- **Termin polski**, przy pierwszym użyciu angielski w nawiasie: „przezbrojenie (changeover)”, „czas przejścia (lead time)”. Skróty rozwinięte przy pierwszym użyciu.
- **Osoby:** polecenia w trybie rozkazującym („nagraj”, „policz”), działania redakcji w liczbie mnogiej („sprawdziliśmy w danych GUS”). Pierwsza osoba liczby pojedynczej tylko w tekście podpisanym przez Patryka i tylko z jego materiału.
- **Pewność proporcjonalna do dowodów** (tabela w [dowody.md](dowody.md)). Bez „zawsze”, „każda firma”, „gwarantuje”.
- **Bez fraz i konstrukcji z tekstów generowanych** (sekcja „Żeby nie brzmiało jak z generatora” niżej). Frazy są w `src/lib/kontrola-tekstu.mjs` (FRAZY_ZAKAZANE, FRAZY_PODEJRZANE); kontrola wyłapuje je razem z konstrukcjami.
- **Ton spokojnego eksperta:** bez straszenia, bez entuzjazmu sprzedażowego, bez wykrzykników i emoji. Gdy metoda nie pomoże, mówimy to.

## Polszczyzna redakcyjna
Kontrola tekstu zgłasza te konstrukcje jako uwagi (`STYL_URZEDOWY`, `ANGLICYZMY`, `NADUZYWANE` w `src/lib/kontrola-tekstu.mjs`).

| Zamiast | Piszesz |
|---|---|
| dokonać analizy, przeprowadzić szkolenie | przeanalizować, przeszkolić |
| w celu zwiększenia | żeby zwiększyć |
| posiadać | mieć |
| w oparciu o, na bazie, bazować na | na podstawie, opierać się na |
| poprzez | przez |
| na chwilę obecną, na dzień dzisiejszy | teraz, dziś |
| w zakresie (gdy to nie zakres liczb) | usuń albo nazwij rzecz |
| jest to, są to | „X to …” albo zacznij od podmiotu |
| dany (pracownik, proces) | ten, każdy, nazwa roli albo rzeczy |
| w sposób efektywny | efektywnie, a najlepiej liczba |
| ma miejsce | zdarza się, trwa, następuje |
| należy (w poradniku) | nagraj, policz, sprawdź |
| zaadresować problem, dedykowany, implementować, w temacie, robić sens, być w stanie | rozwiązać, przeznaczony, wdrożyć, o, mieć sens, móc |
| insight, ownership, mindset, framework, best practice | wgląd, odpowiedzialność, nastawienie, rama, dobra praktyka (angielski tylko w nawiasie przy pierwszym użyciu) |
| uważa się, badania pokazują (bez przypisu) | kto? „Shingo opisał…”, „W badaniu 300 zakładów [3]…” (wniosek z badań bez przypisu to błąd kontroli) |

Terminy z hali i magazynu zostają: „realizacja zamówień”, „adresowanie lokalizacji” i „przezbrojenie” to język branży, nie urzędu.

## Żeby nie brzmiało jak z generatora
Pod tekstem nie ma żadnej etykiety, więc tekst ma brzmieć jak napisany przez najlepszego redaktora branży. Typowe ślady tekstów generowanych, których unikasz:
- „nie tylko…, ale także…” i „to nie X, to Y” więcej niż raz w tekście; pytanie, na które od razu pada odpowiedź („Dlaczego? Bo…”, „Odpowiedź jest prosta”);
- zdania i akapity podobnej długości, trzy zdania z rzędu od tego samego słowa, triady („szybko, tanio i skutecznie”) seriami;
- wyliczenia zamiast prozy, pogrubienia w środku akapitu, dwukropek w śródtytule („SMED: jak…”), półpauzy i wtrącenia w co drugim zdaniu;
- łączniki na początku zdań („Co więcej”, „Ponadto”, „Dodatkowo”, „Warto”) zamiast przejścia z treści;
- asekuracja w każdym zdaniu („może”, „potencjalnie”, „w pewnym stopniu”) zamiast jednego dokładnego zastrzeżenia tam, gdzie dowody są słabe;
- słowa-wypełniacze („kluczowy”, „istotny”, „wyzwanie”, „rewolucja”, „przełom”) i zakończenie morałem albo streszczeniem.

Kontrola wyłapuje większość z nich jako uwagi; resztę wychwytują redaktor językowy i czytelnik testowy ([weryfikacja.md](weryfikacja.md)).

## Przypisy i źródła
- `[n]` po twierdzeniu, przed kropką: „… o 47 minut [3].” Kilka źródeł: `[2, 5]`, zakres: `[2–4]`. Numer n to n-ta pozycja w `zrodla` (kolejność pierwszego użycia w tekście).
- Przypis przy każdej liczbie (procent, kwota, liczba firm, czas), przy każdym wniosku z badania i przy opisie przepisu. Bez przypisu tylko przykład oznaczony „przykład na danych fikcyjnych” (w tym samym akapicie albo w akapicie z dwukropkiem tuż przed listą lub tabelą).
- Pozycja źródła: „Autor A., Autor B. (rok), Tytuł, Czasopismo/Wydawca, tom(numer), strony.” Dla danych: „GUS (2025), Tytuł publikacji, tabela 12.” Dla przepisu: „Ustawa z dnia … – Prawo prasowe, Dz.U. 2018 poz. 1914, art. 14a.” Do tego `adres` (DOI jako `https://doi.org/…`, gdy jest), `rodzaj`, `dostep`.
- FAQ i lead nie mają przypisów (wyświetlają się bez nich); liczba z FAQ albo leadu musi być w tekście z przypisem.

## Liczby i typografia
- Separator tysięcy: spacja (12 500), przecinek dziesiętny (18,5%), procent bez spacji, kwoty „12 500 zł”, jednostki „47 min”, „3 zmiany”. Daty: „6 listopada 2026”, w tabelach „2026-11-06”.
- Cudzysłów „…”, w środku ‚…’; półpauza „ – ” w zdaniu i w zakresach (2020–2025); wielokropek „…”.
- Liczby do dziewięciu słownie w zwykłym tekście („trzy kroki”), cyfrą przy jednostkach i w danych („3 min”).

## Elementy tekstu
- **Tytuł** do 70 znaków; gdy fraza z wyszukiwarki się nie mieści, `tytulSeo` do 60 znaków. **Lead** 2–3 zdania (60–320 znaków): napięcie i teza. `opisSeo` 140–155 znaków tylko, gdy lead nie nadaje się na opis.
- **Rysunek:** SVG w `src/assets/rysunki/<slug>-<n>.svg`, w tekście `![opis danych dla niewidomych](../../assets/rysunki/<slug>-<n>.svg "Rysunek <n>. <Wniosek>. Źródło: … [albo: dane fikcyjne]")`. Tytuł rysunku to wniosek, a rysunek da się zrozumieć bez tekstu. Razem najwyżej 3–4 tabele i rysunki.
- **Tabela:** do porównań, z akapitem przed nią, który mówi, co z niej wynika, i ma przypis (albo oznaczenie fikcji).
- **FAQ:** 3–5 pytań, które czytelnik naprawdę zadaje (podpowiedzi wyszukiwarki, pytania z forów branżowych), odpowiedzi po 2–4 zdania, pełne bez czytania tekstu.
- **Linki wewnętrzne:** 1–3 powiązane artykuły (`powiazane`) i tematy; w treści link tylko tam, gdzie pomaga czytelnikowi. Linki zewnętrzne tylko do źródeł (przypisy).
