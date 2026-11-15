# Pakiet „l4”: raport (2026-11-15)

Gałąź `fabryka/l4`. Nowe narzędzie (kategoria „wynagrodzenie”): `/narzedzia/co-wolno-na-l4`, „Co wolno na zwolnieniu lekarskim (L4)”.
Proces: badacz prawa (`raporty/l4/PRZEPISY.md`), budowniczy, weryfikator prawny i weryfikator kodu/UX (niezależnie, pliki i teksty
przepisów bez wniosków budowniczego), audytor. Wynik: `npm run -s check:szybki` EXIT 0 i `BEZ_WEBKIT=1 npm run check` EXIT 0
(unit 2087, E2E 2344 zaliczonych, 346 pominiętych z założenia, 0 niestabilnych; Lighthouse i kontrola SEO produkcji bez błędów). Zrzuty formularza i wyniku 412 i 320 px: `raporty/l4/zrzuty/` (bez przewijania w bok, nic nie ucięte).

## Zakres
Formularz: co robisz (praca w innej firmie, praca dla pracodawcy, jedna pilna sprawa, zakupy i apteka, lekarz, dziecko i dom,
wyjazd, sport/remont/impreza), wskazanie lekarza (może chodzić, powinien leżeć), kto kontroluje, daty zwolnienia i czynności,
opcjonalnie dzień otrzymania protokołu i doręczenia decyzji ZUS. Wynik: werdykt z przepisem, warunki, skutek (cały wpisany okres
zwolnienia z liczbą dni, zasiłek i wynagrodzenie chorobowe, zwrot), zastrzeżenia do protokołu, odwołanie z datą, przebieg kontroli,
dosłowne cytaty art. 17 w brzmieniu z dnia czynności, uwagi (art. 63, sąd pracy, przepisy przejściowe). Linki do kalkulatora L4,
okresu zasiłkowego, świadczenia rehabilitacyjnego, L4 po zwolnieniu, zasiłku na zleceniu i zwolnienia na długim L4 (bez dublowania).

## Przepisy
- Ustawa zasiłkowa, t.j. Dz.U. 2026 poz. 854 (po nim tylko Dz.U. 2026 poz. 1123, art. 32): art. 8, 17 (dawny ust. 1 i 3 z t.j. 2025
  poz. 501; ust. 1–1c i 4 od 13.04.2026, ust. 1d–1e od 1.01.2027), 22, 55 ust. 3 pkt 7, 59, 61, 63, 66 ust. 2, 68–68e.
- Ustawa z 18.12.2025 r., Dz.U. 2026 poz. 26 (ogłoszona 12.01.2026): art. 13 pkt 2 i 8–9, art. 39, 42, 43. Rozporządzenie o wzorach
  upoważnienia i protokołu, Dz.U. 2026 poz. 503 (od 13.04.2026); rozporządzenie z 27.07.1999 r. (Dz.U. 1999 nr 65 poz. 743) dla dawnej kontroli.
- Ustawa o systemie ubezpieczeń społecznych, t.j. Dz.U. 2026 poz. 1474: art. 83 ust. 1 pkt 4, ust. 2 i 5. Kodeks pracy, t.j. 2026 poz. 1245
  (zmiana poz. 1046 nie dotyczy art. 92): art. 92 § 1 i § 3 pkt 2, art. 291 § 1. KPC, t.j. 2026 poz. 468 (zmiany 473, 830, 1003, 1046, 1296
  nie dotyczą użytych przepisów): art. 165 § 1, 476 § 1 pkt 1 i § 2, 477⁹ § 1–3 i 5. KC, t.j. 2026 poz. 795: art. 111 § 2, 112, 115.
- Nowe wpisy w `src/data/prawo.ts`: `zmianaKontroliZwolnien2026`, `wzoryKontroliZwolnien`. Hasła w `src/data/sprawy.ts` z podpowiedzi
  Google; wyszukiwarka serwisu stawia narzędzie na 1. miejscu dla 8 fraz (test w `co-wolno-na-l4.test.ts`).
- Orzeczenia: brak. SAOS 2026-11-15 najpierw „Przerwa techniczna”, potem przekroczony czas połączenia przy każdym zapytaniu; strona nie
  powołuje się na żadną sygnaturę.

## Interpretacje (opisane w „Jak liczymy”)
- Brzmienie art. 17 według dnia czynności; art. 39 mówi tylko o postępowaniach wszczętych przed 13.04.2026, o późniejszych milczy.
- Przed 13.04.2026 (bez definicji) przy pracy na polecenie i jednej pilnej sprawie werdykt „ryzyko utraty zasiłku”, a nie „nie wolno”.
- „Cały okres zwolnienia” = wpisane od–do; czy kolejne zwolnienia liczą się razem, ustawa nie mówi.
- Zakupy, apteka, sprawy domowe jako „zwykłe czynności dnia codziennego” w zwykłym znaczeniu słów, zawsze z warunkiem z ust. 1b; sport,
  remont, impreza bez werdyktu „wolno”; przy wskazaniu „leżeć” piszemy wprost, że przepis nie mówi, czego nie wolno.
- Od 2027 r. praca w tytule bez zwolnienia (ust. 1d): werdykt z warunkiem i zastrzeżeniem, że ustawa nie mówi tego wprost; nie dotyczy
  pracy bez osobnego tytułu (dzieło) ani zlecenia u własnego pracodawcy.
- Przepisy o kontroli według dnia otrzymania protokołu (przybliżenie dnia wszczęcia z art. 42): protokół sprzed 13.04.2026 to dawna
  kontrola, uwagi bez terminu (§ 9 rozp. z 1999 r.).
- Odwołanie: miesiąc od doręczenia (art. 112 KC); przy sobocie i dniu wolnym dwie daty („zdąż do” i art. 115 KC), od dnia wolnego status
  liczony od daty z art. 115 KC. Zastrzeżenia: 7 dni bez dnia otrzymania, bez przesunięcia (ustawa nie odsyła do KC).

## Weryfikacje i audyt
- Weryfikator prawny: 5 błędów (status terminu przy art. 115 KC, 7 dni z art. 68e przy kontroli sprzed 13.04.2026, opis dawnej kontroli
  z nowymi uprawnieniami, niedosłowny cytat, „r..”), 10 nieścisłości (parafraza ust. 1c, dzieło przy ust. 1d, płatnik w dawnym trybie,
  werdykt kategoryczny przy dawnym brzmieniu, decyzja ZUS przy płatniku, próg 20 osób przy ust. 1d, kto kieruje na badanie, legitymacja
  a dokument tożsamości, aneks i ust. 6, „ZUS musi móc”), 6 sugestii (ust. 4 i art. 22, art. 59 ust. 10, wymagalność, „istotne”,
  miejsce działalności, „ustali”); wszystko poprawione.
- Weryfikator kodu/UX: 2 błędy („r..”, status „termin minął” mimo art. 115 KC), 5 nieścisłości (kolejność błędów w skrypcie, nagłówki
  wyniku dla czytnika, odesłanie w komentarzu, uwaga o sobocie bez nazwy dnia, art. 42 a data), sugestie (atrybuty aria-live tylko przy
  zmianie, nazwy świąt); poprawione. Niezrobione: chowanie kontroli i cytatów w `<details>` (wynik ok. 4300 px przy 320 px; werdykt
  i terminy na górze).
- Audytor: 120 000 przypadków `opisL4`/`bladL4` i każdy dzień 2000–2100 dla terminów porównane z niezależnym modelem w Pythonie:
  0 rozbieżności w rachunku; cytaty art. 17 dosłowne (porównanie automatyczne). 2 błędy w tekstach (status po obu datach, przepisy
  z 2026 r. w opisie wyjazdu przy dawnym brzmieniu), 5 nieścisłości i 7 sugestii; poprawione poza pkt 13 (niżej, sprawa 1).
- Testy: 62 jednostkowe (w tym pętla typografii po wszystkich kombinacjach), 5 E2E × 2 urządzenia; wspólne `formularze` i `uklad-320`.

## Czego nie sprawdzono
- Orzecznictwo SN do dawnego art. 17 (praca zarobkowa, czynności incydentalne, „cały okres zwolnienia”) i do terminu zastrzeżeń
  w sobotę: SAOS nie odpowiadał, sn.pl blokuje automaty. Do ręcznego sprawdzenia.
- Brzmienie art. 17 ust. 1 przed t.j. 2025 poz. 501 (formularz przyjmuje daty od 2000 r.) i art. 59 sprzed 27.01.2026 (art. 41).
- Praktyka ZUS (zus.pl) co do kontroli i zwykłych czynności dnia codziennego.

## Sprawy dla Patryka
1. Data „zdąż do” w niedzielę lub święto (np. 13.12.2026): czy jako datę bezpieczną podawać poprzedni dzień roboczy? To zmiana zasady
   z DECYZJE.md (2026-11-15) dla wszystkich narzędzi terminowych, więc tu bez zmiany.
2. 1.01.2027: przejrzeć teksty o art. 17 ust. 1d–1e (czas przyszły „od 1 stycznia 2027 r.”); wpis w STAN.md.
3. Ręcznie: orzecznictwo SN do dawnego art. 17 (SAOS/sn.pl), jeśli chcemy dopisać sygnatury do FAQ.
