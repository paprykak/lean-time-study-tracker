# Pakiet „zfss”: raport (2026-11-15)

Gałąź `fabryka/zfss`. Jedno narzędzie w kategorii „wynagrodzenie”: `/narzedzia/fundusz-socjalny` (zakładowy fundusz świadczeń
socjalnych). Proces: badacz prawa (`raporty/zfss/PRZEPISY.md`), budowniczy, weryfikator prawny i weryfikator kodu/UX
(niezależnie, pliki i teksty przepisów bez wniosków), audytor. Wynik: `npm run -s check:szybki` EXIT 0 (2300 testów
jednostkowych) i `BEZ_WEBKIT=1 npm run check` WYNIK_CHECKU. Zrzuty formularza i wyniku 412 i 320 px: `raporty/zfss/zrzuty/`
(bez przewijania w bok, nic nie ucięte).

## Co liczy
Formularz: rok (2025, 2026), etaty 1 stycznia, związek zawodowy (nie ma / jest / złożył wniosek), rodzaj pracodawcy.
Wynik: czy musi tworzyć fundusz (art. 3 ust. 1, 1c, 2, 3) i na jakiej podstawie, odpis na etat (2026: 2943,23 zł, dokładnie
2943,225 zł), odpis na rok przy tej liczbie etatów, terminy wpłat (75% do 31 maja, całość do 30 września), świadczenie urlopowe
jako alternatywa (link do istniejącego kalkulatora, nie dubluje go), kto korzysta i od czego zależy świadczenie, co przewiduje
ustawa, gdy pracodawca funduszu nie tworzy (pozew związku z art. 8 ust. 3, grzywna na wniosek PIP z art. 12a), bez porad.
Kwoty GUS biorę z `PODSTAWA_ODPISU` w `swiadczenie-urlopowe.ts` (import, bez zmian w tamtym narzędziu): jedno miejsce
aktualizacji, a `rejestr.test.ts` już zatrzymuje build po 20 lutego bez nowej kwoty.

## Przepisy
Ustawa o ZFŚS (t.j. Dz.U. 2024 poz. 288; jedyna nowelizacja po t.j. w mocy: Dz.U. 2026 poz. 25 od 27.01.2026 r., regulamin
„z pracownikami wybranymi przez załogę”; Dz.U. 2026 poz. 1123 zmienia art. 2 pkt 1 od 1.01.2028 r.). Obwieszczenia GUS M.P.
2026 poz. 232 (7848,60 zł) i M.P. 2025 poz. 148 (7262,39 zł). Ustawy okołobudżetowe na 2025 i 2026 r. (ze zmianą 2026/1349)
bez przepisu o funduszu; projekt na 2027 r. (druk 3154, sprawozdanie 3284, Sejm uchwalił 6.11.2026 r.) też. Rozporządzenie
z 9.03.2009 r. (Dz.U. 2009 nr 43 poz. 349). Ustawa o związkach zawodowych art. 27 ust. 1–2, 30 ust. 6–7 (t.j. 2026 poz. 549).
PIT art. 21 ust. 1 pkt 67, 67a, 78 lit. a (t.j. 2026 poz. 592; dziewięć nowelizacji po t.j. sprawdzonych). Rozporządzenie
składkowe § 2 ust. 1 pkt 19, art. 81 ust. 1 ustawy o świadczeniach opieki zdrowotnej. Cytaty w `PRZEPISY.md`.

## Interpretacje (opisane w „Jak liczymy”)
- 50,00 etatu to „co najmniej 50”; odpis na rok = dokładny odpis na etat × etaty 1 stycznia (pracodawca koryguje go na koniec
  roku), do grosza od połówki w górę; „co najmniej 75%” w górę do grosza. Kwota roczna tylko po 37,5%.
- Terminy z art. 6 ust. 2 przy pracodawcy poniżej 50 etatów, który musi tworzyć fundusz (wniosek związku, jednostka budżetowa):
  art. 6 ust. 2a wyłącza „pracodawców z art. 3 ust. 3”; pokazujemy terminy z dopiskiem, że ustawa tego nie rozstrzyga.
- Jednostka budżetowa: czy układ zbiorowy może wyłączyć fundusz (art. 4 ust. 1 odsyła do art. 3 ust. 1 i 1c), nie przesądzamy.
- Art. 3 ust. 3b mówi o 50 pracownikach bez „etatów”: liczą się osoby (tylko w tekście, kalkulator nie pyta o osoby).
- Wpis „1.200” to błąd (tysiące czy ułamek), a nie cichy wynik.

## Weryfikacje i audyt
- Weryfikator prawny: 4 błędy (świadczenie urlopowe „nie zamiast funduszu” sprzeczne przy 20–49 z wnioskiem i budżetówce;
  warunki art. 3 ust. 3a–3b; art. 5 ust. 8 i art. 1 ust. 2–3 przy budżetówce; zła parafraza art. 6 ust. 2a), 10 nieścisłości
  (m.in. „od 20 do 49” zamiast „co najmniej 20 i mniej niż 50”, art. 4 w FAQ odnoszony do budżetówki, warunki zwiększeń, art. 6a
  ust. 1a, art. 30 ust. 6, „pracownik” przy pkt 67, porada w FAQ). Poprawione.
- Weryfikator kodu/UX: 2 błędy (ten sam tekst o świadczeniu urlopowym; forma „organizujesz sam”), uwagi: „1.200” liczone jako
  1,2, mylący komunikat przy liczbie ponad milion, stara etykieta przy błędzie, brak ogłaszania kwoty rocznej przez czytnik,
  przeładowany wynik na telefonie. Poprawione (osobne komunikaty błędów, region `aria-live` z kwotą roczną, zapis tylko przy
  zmianie, krótsze teksty wyniku), testy dopisane.
- Audytor: 70 432 porównania z niezależnym modelem w Pythonie (Decimal, kwoty przepisane z PDF obwieszczeń), 0 rozbieżności;
  0 błędów, 6 nieścisłości i 8 drobiazgów w tekstach; poprawione poza punktem niżej (wspólne wpisy).
- Pełny check wykrył, że pytanie FAQ i hasła z „podatkiem” zabierały zapytanie „zapłacić podatek” narzędziu o zwrocie PIT
  (`jakosc3-wyszukiwarka.test.ts`); pytanie przeformułowane, dwa hasła usunięte, zapytania o fundusz nadal trafiają.

## Dla orkiestratora (wspólne pliki)
- Wspólne wpisy `pit`, `podstawaSkladek`, `swiadczeniaZdrowotne` w `src/data/prawo.ts` mają w `uwaga` przepisy innych
  narzędzi, więc „Podstawa prawna” tej strony pokazuje np. art. 21 ust. 1 pkt 11, 148, a nie pkt 67, 67a, 78 lit. a ani § 2
  ust. 1 pkt 19. Dopisać je (sprawdzone: nowelizacje po t.j. ich nie zmieniają) i datę 2026-11-15; pakiet tylko dopisuje, więc
  tego nie zmieniał.
- Hasło „wczasy pod gruszą” jest w `HASLA` przy `swiadczenie-urlopowe`, a dopłata „pod gruszą” to przede wszystkim świadczenie
  z funduszu; nowe narzędzie ma „wczasy pod gruszą zasady/dla kogo”. Rozważyć przeniesienie.
- `typografia.mjs`: brak twardej spacji między „art. N” a „ust.” oraz w „60 etatów”, „50 pracowników” (łamią się na 320 px);
  sprawa całego serwisu.

## Czego nie sprawdzono
- Orzecznictwo: SAOS cały dzień w przerwie technicznej; strona nie powołuje się na orzeczenia. Do sprawdzenia: SN I UK 121/09
  (16.09.2009 r., świadczenia z funduszu bez kryterium socjalnego a składki).
- Ostateczny tekst ustawy okołobudżetowej na 2027 r. po Senacie; Karta Nauczyciela (art. 53) i rozporządzenia z art. 1 ust. 2–3;
  czy zwolnienie z pkt 67 obejmuje emerytów i rodziny (strona mówi tylko o pracowniku); interpretacje podatkowe o bonach.

## Sprawy dla Patryka
1. Kalendarz w `STAN.md`: do 2027-02-20 dopisać obwieszczenie GUS na 2027 r. do `PODSTAWA_ODPISU` (obsługuje oba narzędzia)
   i sprawdzić, czy Senat nie dodał do ustawy okołobudżetowej na 2027 r. przepisu o podstawie odpisu.
2. Ręcznie (lub przy następnym pakiecie, gdy SAOS wróci): wyrok SN I UK 121/09 — czy dopisać do FAQ o „po równo”.
3. Zgoda na interpretację terminów wpłat przy pracodawcy 20–49 etatów z wnioskiem związku (pokazujemy je z zastrzeżeniem).
