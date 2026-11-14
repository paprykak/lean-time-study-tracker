# Pakiet „odpowiedzialność materialna”: raport (2026-11-14)

Gałąź `fabryka/odpowiedzialnosc`. Jedno narzędzie: `/narzedzia/odpowiedzialnosc-materialna` (kategoria „Umowa”).
Proces: badacz prawa, budowniczy, weryfikator prawny i weryfikator kodu/UX (niezależnie, pliki bez wniosków), audytor.
Wynik: `npm run -s check:szybki` i `BEZ_WEBKIT=1 npm run check` EXIT 0 (E2E 2245 zaliczonych, 331 pominiętych z założenia; unit 1959).

## Przepisy
Kp (t.j. Dz.U. 2026 poz. 1245) art. 87, 91, 114–122, 124–127, 291 § 2–3, 292, 295, 300; KC (t.j. Dz.U. 2026 poz. 795)
art. 112, 115, 117, 118, 121 pkt 5, 123–124, 361 § 2, 442¹; rozporządzenia: Dz.U. 2017 poz. 927 (§ 3), urlopowe Dz.U. 1997
nr 2 poz. 14 (§ 14–17), Dz.U. 1996 nr 143 poz. 662 (mienie powierzone, § 2–3, 5–9) i 663 (wspólna odpowiedzialność).
Po tekstach jednolitych brak zmian tych przepisów (API Sejmu, 2026-11-14).

## Interpretacje
- Nieumyślna: min(szkoda − przyczynienie, 3 × wynagrodzenie z dnia szkody brutto); podwyżka z dnia szkody się liczy.
- Umyślna, powierzone, wspólne: bez limitu z art. 119; przyczynienie (art. 117 § 1) odejmowane wszędzie; wspólne: część z umowy.
- Obniżenie z § 6 rozp. z 1975 r. (utrudniony nadzór) opisane, nie liczone (przepis nie podaje kwoty).
- Przedawnienie: art. 112 KC; roszczenie jest przeciw pracownikowi, więc pokazujemy też datę późniejszą (art. 115 KC,
  przy umyślnej koniec roku z art. 118 zd. 2 KC); „termin minął” dopiero po dacie późniejszej; 20 lat przy przestępstwie.
- Kwoty wolnej od potrąceń nie liczymy (sprawa składki zdrowotnej w STAN.md).

## Weryfikacje i audyt
- Weryfikator prawny: 4 błędy (obowiązkowe obniżenie z § 6, art. 292 i 295 Kp zamiast KC, status „minął” przy umyślnej,
  roczny termin przy umyślnym manku), 14 nieścisłości, 7 sugestii; poprawione wszystkie poza dopiskami do wspólnych wpisów
  `kodeksCywilny` i `wynagrodzenieRozp` w prawo.ts (pakiet tylko dopisuje).
- Weryfikator kodu/UX: status przy umyślnej, interpunkcja, ściana tekstu (uwagi w osobnych akapitach), dwa błędy naraz,
  ułamki dające 0, data sprzed 1990 r., luki w testach; poprawione.
- Audytor: rachunek bez rozbieżności (20 016 par dat, 20 000 kwot, art. 115 KC dla 1990–2047, niezależnie w Pythonie);
  15 znalezisk w tekstach i testach (mediacja zawiesza, a nie przerywa, „r..”, status niezgodny z „Jak liczymy”, dopisek
  o przestępstwie po 20 latach, brzmienie art. 442¹, § 20 i § 9 rozporządzeń, hasła wyszukiwarki, test dat domyślnych); poprawione.

## Do sprawdzenia ręcznie (sn.pl blokuje automaty)
Czy limit z art. 119 działa w magazynie z halą spedycyjną (§ 2 rozp. z 1975 r.); czy art. 118 zd. 2 i art. 115 KC dotyczą
końca przedawnienia (art. 442¹); czy art. 121 Kp obejmuje szkodę umyślną; uchwały V PZP 13/75, V PZP 3/75, IV PZP 6/80.
