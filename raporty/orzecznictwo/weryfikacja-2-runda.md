# Weryfikacja, runda 2: zmiany od df12261 (src, tests)

Weryfikator niezależny (adwersarz), 2026-11-15. Zakres: `git diff df12261 -- src tests`: strony badania-lekarskie-w-pracy, wypowiedzenie-zmieniajace, kalkulator-odprawy, okres-wypowiedzenia; `src/lib/narzedzia/wypowiedzenie-zmieniajace.ts` i testy. Źródła: pełne teksty w `.cache/narzedzia/orzeczenia/<id>.json` (87635, 80852, 83519, 82843, 83164, 80053, 167970, 168753, 102723, 97770). API SAOS w czasie weryfikacji nie odpowiadało (wyszukiwanie `"kontrolnym badaniom lekarskim"` przerwane po 300 s).

## 1. Prawo

| Miejsce | Zdanie | Ocena | Podstawa (dosłownie, kto mówi) |
|---|---|---|---|
| badania, „Jak liczymy”, pkt 2 | „pracodawca kieruje Cię na badanie kontrolne; nie musisz sam przynosić orzeczenia (wyroki Sądu Najwyższego I PKN 639/00 i II PK 319/04)” | **BŁĄD sygnatury** | II PK 319/04 (83519), teza: pracownik „nie ma obowiązku dostarczenia orzeczenia lekarskiego o zdolności do pracy”. I PKN 639/00 (80852), SN w uzasadnieniu mówi coś odwrotnego: „obowiązkiem pracownika […] jest stawienie się w zakładzie pracy, a także stosownie do art. 229 § 4 KP przedstawienie »aktualnego orzeczenia lekarskiego«”. I PKN 639/00 wolno powołać tylko do „stawiasz się i zgłaszasz gotowość, pracodawca kieruje” (teza), a do „nie musisz przynosić orzeczenia” tylko II PK 319/04. |
| badania, „Jak liczymy”, pkt 1 | „urlop zaraz po zwolnieniu jest możliwy bez badania (II PK 214/07)” | **Uogólnienie ponad SN** | 87635, teza: „rozpoczęcie **zaplanowanego** urlopu wypoczynkowego bezpośrednio po ustaniu niezdolności”; SN: urlop „uzgodniony wcześniej i figurujący w planie urlopów”. Potrzebne: „urlop zaplanowany albo uzgodniony z pracodawcą”. Wyrok nie daje prawa do wzięcia urlopu bez zgody (to samo zastrzega `weryfikacja-2.md`, sekcja 3). |
| badania, FAQ „Czy kilka zwolnień…” | „badanie kontrolne jest potrzebne: robi się je przed dopuszczeniem do pracy, a urlop nie jest dniem pracy (wyrok Sądu Najwyższego II PK 214/07)” | **Nieprecyzyjne przypisanie** | SN nie rozstrzygał dwóch zwolnień z urlopem pomiędzy. W 87635 SN pisze: „Badania te są niezbędne przed dopuszczeniem do wykonywania pracy, natomiast nieprzeprowadzenie ich przed urlopem nie pozostaje w sprzeczności z istotą urlopu” i że urlop „polega na czasowym niewykonywaniu pracy”. Zwrot „urlop nie jest dniem pracy” to wniosek redakcji. Lepiej: „Badanie robi się przed dopuszczeniem do pracy, a nie przed urlopem (II PK 214/07), więc urlop nie przerywa…; to nasz wniosek z tego wyroku”. |
| badania, FAQ i „Jak liczymy” | „w bazie orzeczeń SAOS (Sąd Najwyższy, lata 1994–2016) nie znaleźliśmy orzeczeń” o sumowaniu | **Ponad stan badań** | `weryfikacja-2.md`, „Czego nie sprawdzono”: wniosek opiera się „tylko na 86 tekstach już w pamięci podręcznej”; zapytania do bazy nie zostały zadane (API w przerwie, także dziś). Do zmiany na „w przeczytanych orzeczeniach Sądu Najwyższego z bazy SAOS nie znaleźliśmy” albo do powtórzenia wyszukiwania. |
| badania, „Jak liczymy”, pkt 2 | odmowa badania „gdy jej jedyną przyczyną są okoliczności po Twojej stronie” → niedopuszczenie bez wynagrodzenia (I PK 541/03) | OK | 82843, teza i SN: „gdy jedyną [wyłączną] przyczyną tej odmowy są okoliczności leżące po stronie pracownika”. |
| badania, „Jak liczymy”, pkt 1 | data II PK 214/07: 20 marca 2008 r. | OK | 87635. |
| zmieniające, „Po odmowie” | „tylko wyjątkowo” (III PK 55/14, I PK 211/14); „zmierzały w istocie do rozwiązania umowy albo były obiektywnie nie do przyjęcia” (III PK 55/14) | OK | 167970 i 168753, SN „zważył”: „odprawa może być zasądzona tylko wyjątkowo, gdy nowe warunki […] można uznać za zmierzające do rozwiązania stosunku pracy lub obiektywnie nie do przyjęcia”. |
| zmieniające, „Po odmowie” | szykana, „wyraźnie niedogodne” (I PK 144/11); współprzyczyna „w zasadzie można było oczekiwać” (I PK 144/11, III PK 55/14) | OK | 97770 i 167970, rozważania SN (formuła z I PR 335/90 powtórzona z aprobatą). |
| zmieniające, „Po odmowie” | stawki innych na porównywalnych stanowiskach (I PK 211/14); ujednolicenie płac, kredyt (II PK 340/12); „poważnych zmian na niekorzyść” (II PK 340/12); „radykalnej obniżki pensji za tę samą pracę” (I PKN 79/00) | OK | 168753, 102723 (SN: niekorzystność „głównie z osobistych […] względów” → zarzut kasacji uzasadniony), 80053 (teza: „radykalnego obniżenia wynagrodzenia […] (przy niezmienionych wymaganiach)”). I PKN 79/00 dotyczy ustawy z 1989 r.; na stronie nie zaznaczono (drobne, było w rundzie 1). |
| zmieniające i odprawa | I PK 139/04 „to samo dotyczy zwolnień grupowych”, „na tle ustawy z 1989 r.” | OK | 83164, teza: „co dotyczy zarówno zwolnień grupowych, jak i indywidualnych”; ustawa z 28.12.1989. |
| okres-wypowiedzenia | „osiągnie próg” zamiast „przekroczy”; I PKN 34/99: 3 lata mijały „w marcu 1998 r., przed końcem okresu miesięcznego (31 marca)” | OK | art. 36 § 1 („co najmniej 6 miesięcy”, „co najmniej 3 lata”); 20.03.1995 + 3 lata = koniec 19.03.1998. |

Brzmienie porady prawnej: brak. Forma „Ty”: zachowana we wszystkich nowych zdaniach („Twój i pracodawcy”, „kieruje Cię”, „po Twojej stronie”).

## 2. Logika: wariant B przy progu stażu

Niezależny rachunek w Pythonie (`datetime`, `calendar`; własna implementacja art. 112 KC, art. 30 § 2¹ i art. 36 § 1, bez kodu z repozytorium) porównany z wynikiem `wypowiedzenieZmieniajace` (bundle esbuild) dla 68 680 przypadków: początki pracy co dzień od 2019-01-01 do 2026-11-30 × 12 dni doręczenia (czw. 12.11.2026, sob. 14.11, niedz. 15.11, pon. 30.11.2026, sob. 27.02.2027, niedz. 28.02.2027, sob. 31.01.2026, sob. 26.02.2028, wt. 29.02.2028, czw. 31.12.2026, sob. 30.01.2027, niedz. 31.01.2027) × z pouczeniem i bez. W tym 1234 przypadki z progiem stażu (6 miesięcy i 3 lata).

- Okres, koniec, odmowaDo, odmowaDoWariantB, poczatekPelnegoOkresu, dniA, dniB, krotszyKoniec: **0 różnic**.
- Przy progu z pouczeniem zawsze: odmowaDo (A) ≤ odmowaDoWariantB (B z krótszego) ≤ koniec krótszego okresu, a B z krótszego ≤ B z dłuższego okresu (0 wyjątków). „Odmowa do tej daty jest w terminie w obu wariantach” jest więc prawdą.
- Przykłady brzegowe (A / B): 15.05.2026, doręczenie w sobotę 14.11.2026 → 21.11 / 21.11; 16.05.2026, w niedzielę 15.11 → 25.11 / 28.11 (start B 22.11); 29.02.2024, 28.02.2027 (3 lata, koniec lutego) → 15.03 / 15.03, koniec 31.05.2027; 28.02.2024, w sobotę 27.02.2027 → 15.03 / 15.03; 27.02.2025, 26.02.2028 (rok przestępny) → 14.03 / 15.03.

Pokrycie testami: jednostkowe obejmują próg 6 miesięcy w czwartek i w niedzielę oraz próg 3 lat (doręczenie 12.11). **Brak** testu progu z doręczeniem w sobotę i progu 3 lat przy końcu lutego. Test „oba warianty… (wartości z rachunku w Pythonie)” sprawdza tylko nierówności, nie wartości; nazwa wprowadza w błąd. E2E nie sprawdza `[data-w="wariant-b"]` przy progu z pouczeniem, czyli dokładnie tej wartości, którą zmieniono.

## 3. UX

- Wiersz „Połowa od początku pełnego tygodnia albo miesiąca” przy progu pokazuje datę z krótszego okresu, a wiersz „Okres wypowiedzenia” pokazuje dłuższy (np. 3 miesiące, a B 15 grudnia). Wiersz progu mówi „odmowę liczymy od krótszego okresu”, ale akapit „Połowa okresu” w „Jak liczymy” nie mówi, że oba warianty liczymy wtedy od krótszego okresu. „W obu wariantach” w „Jak liczymy” jest dwuznaczne (okres krótszy/dłuższy czy warianty A/B).
- Badania: wynik „Powrót do pracy: …, dzień po końcu zwolnienia” nie pasuje do nowego zdania o urlopie po zwolnieniu (przy zaplanowanym urlopie powrót wypada później). Uwaga z `weryfikacja-2.md` („Sprzeczne”, pkt 2) dalej otwarta.
- Badania: tryb „Nie wiem” (poniedziałek–piątek bez świąt) dalej traktuje dni urlopu w tygodniu jak dni pracy, więc przy urlopie między zwolnieniami daje „nie jest wymagane”. Podpowiedź „urlop się nie liczy” pomaga tylko przy odpowiedzi „Nie”.
- FAQ a sekcje: zgodne (odprawa po odmowie: FAQ, „Po odmowie”, kalkulator odprawy; sumowanie zwolnień: FAQ, „Jak liczymy”, `badanieKontrolne`).
- E2E: `#po-odmowie ~ *` obejmuje też FAQ, „Podstawę prawną” i zastrzeżenie, a `#kiedy ~ p` (odprawa) obejmuje akapity sekcji „Odprawa emerytalna”. Asercje i tak rozróżniają sekcję (przecinek w „I PK 144/11, III PK 55/14”, wielka litera „Odmowa może”), ale tytuły „w sekcji” są na wyrost; dokładniej byłoby wziąć elementy do następnego `h2`.

## Do poprawy

1. Badania, „Jak liczymy”: „nie musisz sam przynosić orzeczenia” powołuje tylko II PK 319/04; I PKN 639/00 zostaje przy stawieniu się i zgłoszeniu gotowości (w I PKN 639/00 SN pisze o obowiązku przedstawienia orzeczenia).
2. Badania, „Jak liczymy”: „urlop zaplanowany albo uzgodniony z pracodawcą zaraz po zwolnieniu” (teza II PK 214/07).
3. Badania, FAQ: „urlop nie jest dniem pracy” jako wniosek redakcji z II PK 214/07, a nie słowa SN.
4. Badania, FAQ i „Jak liczymy”: „w bazie SAOS nie znaleźliśmy” zawęzić do przeczytanych orzeczeń (wyszukiwania w bazie nie było).
5. Testy: przypadek progu z doręczeniem w sobotę (15.05.2026 → 14.11.2026: 21.11/21.11) i progu 3 lat przy końcu lutego (29.02.2024 → 28.02.2027: 15.03/15.03); w teście z nierównościami zmienić nazwę albo dodać wartości; E2E `wariant-b` przy progu z pouczeniem (13.05.2026 → 12.11.2026: 21 listopada).
6. Zmieniające, „Połowa okresu”: jedno zdanie, że przy progu stażu oba warianty liczymy od krótszego okresu; doprecyzować „w obu wariantach”.
7. Badania: wiersz „Powrót do pracy” (drobne, poza diffem).
