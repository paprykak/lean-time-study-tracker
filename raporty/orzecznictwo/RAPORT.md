# Pakiet „orzecznictwo”: raport

Gałąź: `fabryka/orzecznictwo` (od `69fc5d8`). Ostatni commit: podany w wiadomości końcowej zespołu (commit z tym raportem).
Źródła: API SAOS (orzeczenia SN 1994–2016, pełne teksty, kopie w `.cache/narzedzia/orzeczenia/`, pomocnik `.cache/narzedzia/saos.py`),
API Sejmu: Kodeks pracy t.j. Dz.U. 2026 poz. 1245 (akt zmieniający po t.j.: Dz.U. 2026 poz. 1046, nie dotyczy art. 36, 42, 229),
ustawa o zwolnieniach t.j. Dz.U. 2026 poz. 1195 (bez zmian po t.j.). SAOS miał 15.11.2026 długie „przerwy techniczne”
(HTML zamiast JSON): część wyszukiwań się nie wykonała, opisane niżej.

Proces: sprawy 1–3 badał zespół, sprawę 4 osobny badacz; każdy wniosek sprawdził drugi, niezależny podagent na pełnych
tekstach (`weryfikacja-1.md`, `-2.md`, `-3.md`, `-4.md`). Zmiany w narzędziach: weryfikator prawny (`weryfikacja-prawna.md`:
1 błąd, 11 nieprecyzyjności), weryfikator kodu i UX (`weryfikacja-kodu.md`: 1 błąd w logice, zrzuty 412/320 px), druga runda
na końcowym diffie (`weryfikacja-2-runda.md`: 68 680 porównań logiki z Pythonem, 0 różnic; 7 uwag do tekstów). Wszystkie
uwagi w zakresie pakietu poprawione.

## Sprawy

| Sprawa | Wniosek | Sygnatury (SN, SAOS) | Zmiana w narzędziu |
|---|---|---|---|
| 1. Próg stażu (6 mies., 3 lata) w trakcie wypowiedzenia | **Linia jednolita.** Staż z art. 36 § 1 liczy się do dnia rozwiązania umowy z upływem okresu, nie do doręczenia: „o długości przewidzianych w art. 36 § 1 KP okresów wypowiedzenia decyduje okres zatrudnienia u danego pracodawcy, który obejmuje cały staż zatrudnienia u tego pracodawcy, liczony od dnia zawarcia umowy o pracę do daty jej rozwiązania z upływem okresu wypowiedzenia”. Orzeczeń przeciwnych nie znaleziono (pogląd „do doręczenia” tylko jako zarzut stron, odrzucony). Narzędzie liczy zgodnie (wariant dłuższy). | I PKN 34/99 (11.05.1999, id 79015: praca od 20.03.1995, pismo 26.02.1998, sąd: 3 mies.), II PK 12/11 (6.07.2011, id 95376: praca od 1.08.2006, doręczenie 07.2009, 3 mies.), I PK 2/13 (12.06.2013, id 102031: „w judykaturze SN przyjmuje się”), II PK 56/07 (id 86779) | Tekst: „część orzecznictwa” → linia SN z sygnaturami w „Jak liczymy” i w uwadze wyniku (okres-wypowiedzenia, wypowiedzenie-zmieniajace), komentarz w `wypowiedzenie.ts`. Testy na stanach faktycznych I PKN 34/99 (do 31.05.1998, jak w wyroku) i II PK 12/11, test progu w ostatnim dniu krótszego okresu, E2E. **Błąd znaleziony przy okazji:** w wypowiedzeniu zmieniającym przy progu stażu wariant B połowy okresu liczył się od dłuższego okresu (np. 15.12 zamiast 21.11, po końcu krótszego okresu 28.11), wbrew opisowi; poprawione, testy z rachunku w Pythonie, E2E. |
| 2. Sumowanie zwolnień przy badaniu kontrolnym (art. 229 § 2) | **Brak orzeczeń SN w SAOS** o sumowaniu zwolnień rozdzielonych przerwą, o dniach kalendarzowych, ciąży i wypadku (13 zapytań wykonanych przez zespół + lektura 86 pełnych tekstów przez weryfikatora; jego dalsze wyszukiwania przerwała awaria SAOS). **Linia jednolita** w sprawach pokrewnych: obowiązek skierowania powstaje, gdy pracownik stawi się i zgłosi gotowość do pracy; zaplanowany urlop zaraz po chorobie bez badania jest dopuszczalny, badanie przed dopuszczeniem do pracy; odmowa badania z winy pracownika = niedopuszczenie bez wynagrodzenia. | II PK 214/07 (20.03.2008, id 87635: „Badania te są niezbędne przed dopuszczeniem do wykonywania pracy, natomiast nieprzeprowadzenie ich przed urlopem nie pozostaje w sprzeczności z istotą urlopu wypoczynkowego”), II PK 240/10 (id 94395), II PK 319/04 (id 83519), I PKN 639/00 (id 80852), I PK 541/03 (id 82843), I PK 287/14 (id 243639) | Logika sumowania bez zmian (interpretacje 1–3 niesprzeczne z SN). Luka: urlop między długim a krótkim L4 przy „Nie wiem” liczył się jak dzień pracy → podpowiedź „urlop się nie liczy”, FAQ zgodne z wynikiem (dawne „w pozostałych przypadkach bezpieczniej zrobić badanie” przeczyło wynikowi), w „Jak liczymy” urlop po L4, zgłoszenie gotowości, odmowa badania z sygnaturami; testy jednostkowe (urlop w przerwie) i E2E. |
| 3. Odmowa nowych warunków a odprawa; „wyłączny powód” | **Linia ugruntowana co do zasady, rozbieżna w akcencie.** Odmowa sama nie odbiera odprawy (art. 10 ust. 1 stosuje się po wypowiedzeniu zmieniającym); „wyłączny powód” = bez przyczyn niedotyczących pracownika do zwolnienia by nie doszło (także przy grupowym, I PK 139/04, ustawa z 1989 r.). Odmowa może być współprzyczyną, gdy warunki obiektywnie dało się przyjąć. Łagodniej: I PKN 521/00 (sama obniżka „w zasadzie” nie jest współprzyczyną); ostrzej, nowsze: I PK 144/11, III PK 55/14, I PK 211/14 („odprawa może być zasądzona tylko wyjątkowo”). Rozstrzyga sąd meriti, obiektywnie. | I PK 144/11 (12.04.2012, id 97770), III PK 55/14 (id 167970), I PK 211/14 (id 168753), II PK 340/12 (id 102723), II PK 38/09 (id 90697), I PKN 79/00 (id 80053), I PKN 521/00 (id 80704), I PK 139/04 (id 83164), I PK 290/14 (id 243640) | Teksty „przepis wprost nie mówi … rozstrzyga sąd” zastąpione kryterium SN z sygnaturami, w formie warunkowej („może się należeć”): FAQ i sekcja „Po odmowie” (krótki akapit + dwie listy) w wypowiedzeniu zmieniającym; FAQ, „wyłączny” zamiast „jedynym” i nowe akapity w kalkulatorze odprawy z linkiem. E2E. Logika kwot bez zmian. |
| 4a. Przedawnienie roszczenia o urlop i ekwiwalent (tylko raport) | **Rozbieżna** co do początku biegu: koniec roku kalendarzowego (art. 161), a termin z art. 168 tylko przy przesunięciu urlopu (I PKN 415/99, id 79435; I PKN 367/00, id 80502) albo zawsze dzień po terminie z art. 168 (I PKN 336/00, id 80457). Ekwiwalent: **jednolita**, od dnia ustania stosunku pracy, także za zaległe urlopy (I PKN 336/00, III PK 96/15, id 245112, z uchwałami III PZP 40/72 i V PZP 5/75). Art. 168: 30 września od 1.01.2012 (Dz.U. 2011 nr 232 poz. 1378); orzeczeń o nowym terminie w SAOS brak. | jak obok | Brak (nie nasz zakres). `zalegly-urlop` pokazuje oba warianty (31.12 i 30.09): zgodnie z rozbieżną linią. |
| 4b. Art. 115 KC przy terminach z Kp (pakiet „terminy”) | **Brak orzeczeń SN w SAOS** o art. 115 KC przy art. 264, 112 i 97 § 2¹ Kp. Linia o sobocie (nie jest dniem ustawowo wolnym) dotyczy dawnego brzmienia: sobotę dodała ustawa z 16.12.2016 (Dz.U. 2016 poz. 2255, art. 1 pkt 3), w życie 1.01.2017, przejściowo art. 21 (terminy, które nie upłynęły). | III CZP 8/03 (7 sędziów, 25.04.2003, id 81978), V CZ 27/09 (id 90527), III PZ 1/12 (id 97815), II PZ 10/15 (id 243556) | Brak. |
| 4c. § 2 rozp. z 10.10.1975 (magazyn z halą spedycyjną) a limit z art. 119 | **Brak orzeczeń w SAOS.** Uwaga: obowiązuje tekst po zmianie z 1996 r. (Dz.U. 1996 nr 60 poz. 276, t.j. Dz.U. 1996 nr 143 poz. 662): § 1 skreślony, § 2 dotyczy każdego magazynu z halą spedycyjną, z warunkiem pisemnego zawiadomienia i inwentaryzacji. Wniosek z tekstu (§ 2 i § 7: „na zasadach art. 114–116 i 118”, bez art. 119, więc bez limitu) to wykładnia, nie orzecznictwo. Pośrednio II PK 307/09 (id 76440). | — | Brak (strona `odpowiedzialnosc-materialna` innego zespołu). |
| 4d. Art. 118 i 121 Kp przy szkodzie umyślnej | Art. 118 i limit z art. 119 tylko przy winie nieumyślnej; przy umyślnej (art. 122) odpowiedzialność kilku osób „to w istocie odpowiedzialność solidarna” (obiter). O obniżeniu z art. 121 przy szkodzie umyślnej orzeczeń brak. | III PK 113/13 (22.05.2014, id 165842) | Brak. |
| 4e. Art. 118 zd. 2 KC i art. 115 KC przy art. 442¹ KC i art. 291 Kp | **Brak orzeczeń w SAOS** (art. 118 zd. 2 KC od 9.07.2018, Dz.U. 2018 poz. 1104). Pośrednio: art. 291 § 3 odsyła do KC (I PK 195/09, id 92006); art. 291 § 2 to „samodzielna regulacja” (I BP 11/14, id 243460), co przemawia przeciw przenoszeniu art. 118 zd. 2 KC na art. 291 § 1–2, ale nie rozstrzyga. | jak obok | Brak. |

## Wynik checku

- `npm run -s check:szybki`: EXIT 0.
- `BEZ_WEBKIT=1 npm run check` (na commicie `3670873`, potem zmienił się tylko ten raport): EXIT 0; vitest 2029 testów (136 plików), Playwright 2335 passed, 343 skipped (WebKit), Lighthouse i `check:start` zielone.
- Zrzuty 412 i 320 px zmienionych stron (okres-wypowiedzenia z uwagą o progu, wypowiedzenie-zmieniajace z progiem i bez pouczenia, kalkulator-odprawy, badania-lekarskie-w-pracy): bez przewijania w bok, nic nie ucięte (tabele przewijają się we własnym pojemniku, jak w całym serwisie). Po ostatnich poprawkach zrzuty wszystkich czterech stron w 412 i 320 px: `scrollWidth − innerWidth = 0` na każdej. Zrzuty w scratchpadzie sesji (`ux/`, `zrzuty/`), poza repozytorium.

## Pozycje z STAN.md

Patryk może skreślić (z „Sprawdź ręcznie orzecznictwo…”, linia 162, i dopisków przy narzędziach):
- wydłużenie wypowiedzenia przy progu stażu (także dopisek w linii 123): linia SN jednolita, narzędzia zgodne;
- czy odmowa nowych warunków jest współprzyczyną (odprawa, „wypowiedzenie zmieniające”): kryterium SN opisane na stronach;
- sumowanie zwolnień przy badaniu kontrolnym: orzeczeń brak, narzędzie mówi o tym wprost i bierze wariant bezpieczny (pozycja może zostać jako „sprawdzić orzeczenia po 2016 r.”, patrz niżej).

Zostają:
- od kiedy biegnie przedawnienie roszczenia o urlop (`zalegly-urlop`): linia rozbieżna, orzeczeń o terminie 30 września w SAOS brak (orzeczenia po 2016 r. na sn.pl);
- art. 115 KC przy terminach kar porządkowych i art. 118 KC (w tym `przedawnienie-wynagrodzenia`: III PSKP 54/24 i II PSKP 45/23, poza SAOS): brak orzeczeń w SAOS;
- `odpowiedzialnosc-materialna`: § 2 rozporządzenia z 1975 r. a art. 119 i art. 118 zd. 2 KC przy art. 442¹: brak orzeczeń; dopisek w STAN.md (linia 109) mówi o § 2 bez zmiany z 1996 r. (zakres: każdy magazyn z halą spedycyjną);
- sumowanie zwolnień (art. 229 § 2) w orzecznictwie po 2016 r.; świadczenie rehabilitacyjne (zus.pl) i zerowy PIT (podatki.gov.pl) poza zakresem pakietu.

## Uwagi dla orkiestratora (poza zakresem pakietu, nic nie zmieniane)

1. `src/lib/typografia.mjs` (wspólny): sygnatury („II PK 340/12”) i „1 miesiąc” łamią się na końcu wiersza. W swoich stronach wpisaliśmy twarde spacje w sygnaturach; reguła w `typografia()` (I–III + PK/PKN/PSKP + numer; „miesiąc”, „miesiąca”, „tydzień”, „lata”, „rok” w `JEDNOSTKI`) naprawiłaby to w całym serwisie.
2. `zwolnienia-grupowe.astro:118` i `:193`: „jedynym powodem” (ustawa: „wyłączny powód”, SN: bez tych przyczyn do zwolnienia by nie doszło); `umowa-na-zastepstwo.astro:130` i `umowa-zastepstwo.ts:29`: „przepis nie mówi wprost, co wtedy” przy progu stażu: można przywołać I PKN 34/99.
3. Pakiet „terminy” (art. 115 KC): sygnatury z wiersza 4b; orzeczeń o terminach z Kp w SAOS brak.

## Czego nie sprawdzono

- Orzeczeń SN po połowie 2016 r. i sprzed 1994 r. (I PZP 33/78, I PR 319/90, I PR 335/90, II PK 108/08 znamy tylko z przytoczeń): sn.pl blokuje automaty.
- Części zaplanowanych wyszukiwań w SAOS w sprawach 2 i 4 (przerwa techniczna API; zapytania do powtórzenia są w `weryfikacja-2.md` i `weryfikacja-4.md`).
- Czytnika ekranu na prawdziwym urządzeniu (zmiany to tekst i wartości w istniejących polach).

## Sprawy dla Patryka

1. Skreślić w STAN.md pozycje wymienione wyżej (wydłużenie wypowiedzenia, odprawa po odmowie, badanie kontrolne jako „brak orzeczeń do 2016 r.”).
2. Przedawnienie urlopu: linia SN jest rozbieżna (koniec roku czy termin z art. 168); warto zapytać prawnika (F7), który wariant `zalegly-urlop` ma pokazywać jako główny.
3. Orzeczenia po 2016 r. (III PSKP 54/24, II PSKP 45/23 i inne z listy) da się sprawdzić tylko ręcznie na sn.pl.
