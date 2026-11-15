# Weryfikacja kodu i UX: orzecznictwo SN w trzech narzędziach (2026-11-15)

Zakres: `git diff 69fc5d8 -- src tests` (okres-wypowiedzenia, wypowiedzenie-zmieniajace, kalkulator-odprawy), zasady 4–11
z `prompty/02-fabryka.md`, testy, czytelność na telefonie, układ 412/320 px na `dist/` (podgląd na porcie 4330, zatrzymany).

## Zasady 4–11: wynik

- Zasada 4: teksty skryptów idą przez `typografia()`, daty przez `dataPoPolsku` (uwaga w okresie wypowiedzenia, uwaga w zmieniającym). OK.
- Zasada 5: FAQ (zmieniające, odprawy) czysty tekst, bez HTML i linków. OK.
- Zasada 6: forma „Ty” w FAQ i w akapicie odprawy; w „Po odmowie” trzecia osoba („pracownik nie przyjął”, „na niekorzyść pracownika”) – nie narusza zasady, ale niespójne z FAQ (uwaga 7).
- Zasada 8: brak `style=""` w trzech zbudowanych stronach. OK.
- Zasada 11: nowe linki w tym samym wierszu co tekst przed nimi (`kalkulator-odprawy.astro:129`, `wypowiedzenie-zmieniajace.astro:147`); w `dist/` słowo nie skleja się z linkiem. OK.
- Zasada 10: brak przewijania w bok przy 412 i 320 px na wszystkich trzech stronach (wyniki niżej).

## Uwagi (plik:linia, problem, poprawka)

### Do poprawy

1. **Sygnatury łamią się w środku** (zrzuty `zmieniajace-320-po-odmowie.png`, `odprawy-320-wylaczny-powod.png`):
   „(II PK⏎340/12)”, „III PK⏎55/14”. `typografia()` wiąże tylko jednoliterowe „I” z „PK”, nie „PK” z numerem ani „II/III”
   z „PK”. Dotyczy `wypowiedzenie-zmieniajace.astro:150–163`, `kalkulator-odprawy.astro:123–129`, FAQ obu stron i uwag
   w skryptach (`okres-wypowiedzenia.astro:187`, `wypowiedzenie-zmieniajace.astro:214`).
   Poprawka: w `src/lib/typografia.mjs` reguła sygnatur, np.
   `/(?<=(?:^|[\s(„])(?:I|II|III|IV|V))[  ]+(?=(?:PKN?|PK|UK|CSK|CK|PZP|PZ|BU)[  ]+\d)/g` i
   `/(?<=\b(?:PKN?|PK|UK|CSK|CK|PZP|PZ|BU))[  ]+(?=\d+\/\d{2}\b)/g` → NBSP, z testem w `typografia.test`.
2. **„1 miesiąc” łamie się** w uwadze okresu wypowiedzenia („Bez wydłużenia: 1⏎miesiąc”, zrzut
   `okres-wypowiedzenia-320-wynik.png`). `JEDNOSTKI` w `src/lib/typografia.mjs:16` ma „miesięcy|miesiące”, brak
   „miesiąc|miesiąca|tydzień|tygodnia|lata|rok”. Poprawka: dopisać te formy do listy jednostek.
3. **`wypowiedzenie-zmieniajace.astro:214` – „w obu wariantach” myli się z wariantami A/B połowy okresu** (to samo słowo
   na tej samej stronie, w wierszu „Połowa od początku pełnego tygodnia albo miesiąca”) i zdanie jest za długie
   (5 wierszy przy 320 px). Poprawka:
   `' Staż osiąga próg w trakcie wypowiedzenia, więc okres się wydłuża (wyrok SN I PKN 34/99). Termin na odmowę liczymy z krótszego okresu: odmowa do tego dnia jest w terminie przy każdym z nich.'`
   (art. 42 § 1 zostaje w „Jak liczymy”, linia 111). Test `narzedzie-zmieniajace.spec.ts:31` dopasować.
4. **Wariant B przy progu stażu niespójny z „Jak liczymy”** (`src/lib/narzedzia/wypowiedzenie-zmieniajace.ts:67`):
   `odmowaDoWariantB` liczy połowę dłuższego okresu (`koniec`), a nie `koniecDoOdmowy`. Dla 13.05.2026 / 12.11.2026
   z pouczeniem strona pokazuje „Połowa od początku pełnego tygodnia albo miesiąca: 15 grudnia 2026 r.”, czyli po końcu
   krótszego okresu (28.11) i wbrew zdaniu „termin na odmowę liczymy od krótszego okresu” (linie 111–113). Poprawka:
   przy `prog` liczyć B od krótszego okresu (początek pełnego tygodnia dla `krotszy` i `krotszyKoniec`) albo ukryć
   wiersz B przy progu; test jednostkowy na ten przypadek.
5. **Testy E2E przechodzą także bez nowych akapitów** (fałszywie zielone):
   - `tests/e2e/narzedzie-zmieniajace.spec.ts:42–48`: `main` zawiera FAQ, w którym też są „I PK 144/11” i „I PKN 79/00”;
     po usunięciu sygnatur z „Po odmowie” test nadal przejdzie. Linia z samym `I\sPK\s144\/11` jest zbędna (zawiera ją
     następna). Poprawka: zawęzić lokator do akapitów po `#po-odmowie`
     (`page.locator('#po-odmowie ~ p')`) i sprawdzić tam `I\sPKN\s79\/00`, `II\sPK\s340\/12`, `I\sPK\s211\/14`.
   - `tests/e2e/narzedzie-odprawy.spec.ts:33`: `I\sPK\s144\/11` jest też w FAQ (linia 24); zawęzić do sekcji wyjaśnienia
     albo sprawdzić `II\sPK\s340\/12` (tylko w akapicie).
   - `tests/e2e/narzedzie-wypowiedzenie.spec.ts:56`: `main` zawiera `I PKN 34/99` także z uwagi wyniku, więc nie sprawdza
     sekcji „Jak liczymy”; zawęzić do `#jak-liczymy ~ p`.
   Regexy używają `\s` w miejscach twardych spacji (sprawdzone w `dist/`: „I PK”, „31 sierpnia”, „z końcem” mają NBSP). Po
   poprawce 1 dojdą NBSP między „PK” a numerem – obecne regexy z `\s` to wytrzymają; literalne spacje w
   `Odmowa nowych warunków sama nie odbiera odprawy` i `to samo dotyczy zwolnień grupowych` są bezpieczne
   (brak jednoliterowych słów i jednostek).
6. **`okres-wypowiedzenia.astro:109` „staż przekroczy próg”**: logika i test (`wypowiedzenie.test.ts`, „próg w ostatnim dniu
   krótszego okresu”) przyjmują *osiągnięcie* progu, nie przekroczenie; uwaga wyniku mówi „staż osiągnie”. Poprawka:
   „Potem sprawdzamy, czy do końca okresu staż osiągnie próg.”
7. **Czytelność „Po odmowie”** (`wypowiedzenie-zmieniajace.astro:149–164`): jeden akapit, ok. 170 słów, 13 sygnatur,
   przy 320 px ponad 40 wierszy; zdanie „gdy z uwagi na interes pracownika i pracodawcy oraz rodzaj zaproponowanej pracy
   w zasadzie można oczekiwać…” to język wyroku. Propozycja (te same sygnatury):
   - akapit: „Sama odmowa nowych warunków nie odbiera odprawy (I PK 144/11). Liczy się, czy bez przyczyn niedotyczących
     Ciebie do zwolnienia by doszło; tak samo przy zwolnieniu grupowym (I PK 139/04, jeszcze na tle ustawy z 1989 r.).”
   - lista „Odprawa może się należeć, gdy nowe warunki:” – „zmierzały do rozwiązania umowy albo były obiektywnie nie do
     przyjęcia (III PK 55/14, I PK 211/14)”; „oznaczały poważne zmiany na Twoją niekorzyść, np. dużą obniżkę pensji za tę
     samą pracę (II PK 340/12, I PKN 79/00)”; „miały cechy szykany albo były wyraźnie niedogodne (I PK 144/11)”.
   - lista „Odprawy zwykle nie ma, gdy:” – „nowe warunki dało się rozsądnie przyjąć, więc odmowa jest współprzyczyną
     (I PK 144/11, III PK 55/14)”; „nowa płaca odpowiada stawkom innych na podobnych stanowiskach (I PK 211/14) albo
     wynika z ujednolicenia płac (II PK 340/12)”; „powodem odmowy są tylko sprawy osobiste, np. kredyt (II PK 340/12)”.
   - zdanie końcowe: „Warunki ocenia sąd pracy obiektywnie, w konkretnej sprawie.”
   Forma „Ty” jak w FAQ (uwaga do zasady 6).
8. **`kalkulator-odprawy.astro:123–129`**: jeden akapit, 6 sygnatur, zdanie 1 ma ok. 50 słów i wtrącenie o ustawie z 1989 r.
   Propozycja: „Wyłączny powód znaczy według Sądu Najwyższego, że bez przyczyn niedotyczących Ciebie do zwolnienia by nie
   doszło, nawet gdy były też inne okoliczności (I PK 144/11). Tak samo przy zwolnieniu grupowym (I PK 139/04, na tle
   ustawy z 1989 r.).” i osobny akapit o wypowiedzeniu zmieniającym (bez zmian treści, z linkiem w tym samym wierszu).
9. **`okres-wypowiedzenia.astro:113–116`**: opis stanu faktycznego mało konkretny („3 lata pracy mijały w marcu, przed
   końcem tego miesiąca”). Poprawka: „…od 20 marca 1995 r. Trzy lata pracy minęły 19 marca 1998 r., przed końcem okresu
   miesięcznego (31 marca). Sądy przyjęły 3 miesiące, a Sąd Najwyższy oddalił kasację pracodawcy.” Zdanie od „W sprawie”
   ma ok. 35 słów; podział na dwa zdania jak wyżej.
10. **`wypowiedzenie-zmieniajace.astro:92` i `:106`**: „(staż w dniu doręczenia; o progu w trakcie okresu niżej)” jest
    zgrzytliwe, a „Staż liczymy w pełnych miesiącach do dnia doręczenia” (106) czyta się jak sprzeczność z „SN liczy staż do
    dnia rozwiązania umowy” (109–110). Poprawka 92: „…od stażu u tego pracodawcy:”; 106: „Najpierw liczymy staż w dniu
    doręczenia, w pełnych miesiącach, bez dnia doręczenia.”

### Drobne (poza diffem, ale dotyczą spójności)

11. `src/pages/narzedzia/umowa-na-zastepstwo.astro:130` i `src/lib/narzedzia/umowa-zastepstwo.ts:29`: nadal „przepis nie
    mówi wprost, co wtedy” o progu w trakcie wypowiedzenia – niespójne z nowym brzmieniem (I PKN 34/99). Ujednolicić.
12. `src/pages/narzedzia/zwolnienia-grupowe.astro:118` i `:193`: „jedynym powodem” – w odprawach zmieniono na „wyłącznym
    powodem” (brzmienie art. 10 ust. 1); ujednolicić.
13. `wypowiedzenie-zmieniajace.astro:75` i `:204`: „odmowa liczona od okresu 2 tygodnie” – błąd przypadka; „od okresu
    2 tygodni” / „od krótszego okresu (2 tygodnie)”. Ten sam tekst budowany w dwóch miejscach (szablon i skrypt) – wbrew
    zasadzie 11 (jedna funkcja dla HTML i skryptu).
14. `wypowiedzenie-zmieniajace` (13.05.2026 / 12.11.2026): „Próg stażu w trakcie wypowiedzenia: 6 miesięcy mija
    12 listopada 2026 r.” – to dzień doręczenia, więc „w trakcie” brzmi dziwnie, choć wynik jest poprawny (staż w dniu
    doręczenia bez tego dnia). Rozważyć „mija z końcem dnia doręczenia”.

### Testy jednostkowe

`src/lib/narzedzia/wypowiedzenie.test.ts:71–87`: trzy nowe przypadki sprawdzają nowe zachowanie (stany faktyczne
I PKN 34/99 i II PK 12/11, granica: próg w ostatnim dniu krótszego okresu i dzień później `prog: null`). Brak testu dla
wariantu B przy progu w `wypowiedzenie-zmieniajace.test.ts` (uwaga 4).

## Układ 412 i 320 px (deviceScaleFactor 1, `isMobile`)

| Strona | 412 px | 320 px |
|---|---|---|
| `/narzedzia/okres-wypowiedzenia` (2006-08-01, 2009-07-15, uwaga widoczna) | scrollWidth 412 = innerWidth, OK | 320 = 320, OK |
| `/narzedzia/wypowiedzenie-zmieniajace` (2026-05-13, 2026-11-12, bez pouczenia) | 412 = 412, OK | 320 = 320, OK |
| `/narzedzia/kalkulator-odprawy` | 412 = 412, OK | 320 = 320, OK |

Poza tabelami w `.tabela` (przewijane w swoim pojemniku) żaden element `main` nie wychodzi poza ekran. Nic nie jest
ucięte; jedyne usterki to łamanie sygnatur i „1 miesiąc” (uwagi 1–2).

Zrzuty (`/tmp/claude-0/-home-user-lean-time-study-tracker/679d40f0-e722-5bab-87cb-05c622d4741e/scratchpad/ux/`):
- `okres-wypowiedzenia-412.png`, `okres-wypowiedzenia-320.png`, `okres-wypowiedzenia-412-wynik.png`, `okres-wypowiedzenia-320-wynik.png`, `okres-320-jak-liczymy.png`
- `wypowiedzenie-zmieniajace-412.png`, `wypowiedzenie-zmieniajace-320.png`, `wypowiedzenie-zmieniajace-412-wynik.png`, `wypowiedzenie-zmieniajace-320-wynik.png`, `zmieniajace-320-jak-liczymy.png`, `zmieniajace-320-po-odmowie.png`
- `kalkulator-odprawy-412.png`, `kalkulator-odprawy-320.png`, `odprawy-320-wylaczny-powod.png`
- skrypty: `zrzuty.cjs`, `sekcje.cjs`, `b.cjs`
