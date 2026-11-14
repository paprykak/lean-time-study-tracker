# Pakiet „prawa pracownika”: raport (2026-11-14)

Gałąź `fabryka/prawa-pracownika`. Dwa narzędzia w kategorii „Umowa”: `/narzedzia/swiadectwo-pracy` i `/narzedzia/monitoring-w-pracy`.
Proces: badacz prawa, budowniczy, weryfikator prawny i weryfikator kodu/UX (niezależnie, pliki bez wniosków), audytor.
Wynik: `npm run -s check:szybki` i `BEZ_WEBKIT=1 npm run check` EXIT 0 (E2E 2285 zaliczonych, 337 pominiętych z założenia; unit 1989; Lighthouse i check:start zielone).
Zrzuty z telefonu 412 i 320 px (formularz z wynikiem): `*-412.png`, `*-320.png` w tym katalogu; bez ucięć i bez przewijania w bok.

## Przepisy
- Świadectwo pracy: Kp (t.j. Dz.U. 2026 poz. 1245) art. 97 § 1–3, 97¹, 99, 265, 282 § 1 pkt 3, 291 § 1, 300; rozporządzenie
  w sprawie świadectwa pracy (t.j. Dz.U. 2024 poz. 1016, nowy wpis `swiadectwoPracy`) § 2 ust. 1–2a, § 7 ust. 1; rozporządzenie
  z 29 maja 1996 r. (Dz.U. 2017 poz. 927) § 2 ust. 1 pkt 9, ust. 2, § 2a; rozporządzenie urlopowe § 19; KC art. 111–112, 115;
  KPC art. 98, 102, 461 § 1 i § 1¹ (brzmienie z Dz.U. 2026 poz. 1046); koszty sądowe art. 96 ust. 1 pkt 4; ustawa o PIP art. 10 ust. 1 pkt 15.
- Monitoring: Kp art. 22² § 1–10 (§ 8 w brzmieniu od 27.01.2026, Dz.U. 2026 poz. 25), 22³ § 1–4, 104³ § 1; ustawa o PIP
  art. 10 ust. 1 pkt 1, art. 11 ust. 1 pkt 8 (brzmienie z Dz.U. 2026 poz. 473); ustawa o ochronie danych osobowych
  (t.j. Dz.U. 2019 poz. 1781, nowy wpis `ochronaDanych`) art. 34 ust. 1, art. 60; RODO tylko przez art. 22² § 10 (art. 12–13).
- Po tekstach jednolitych brak zmian tych przepisów (API Sejmu, 2026-11-14). Kopie i cytaty: `.cache/narzedzia/prawo/`.

## Interpretacje (opisane w „Jak liczymy”)
- Terminy pracownika (sprostowanie 14 dni, pozew 14 dni) bez przesunięcia z art. 115 KC; data po przesunięciu w dopisku.
- Pozew po braku zawiadomienia o odmowie: przepis bez terminu (art. 97¹ § 3–4); ostrożnie 14 dni po 7 dniach pracodawcy.
- Przedawnienie pozwu o wydanie: 3 lata od ostatniego dnia umowy; przy nowej umowie w 7 dni od końca 7 dni po wniosku (bez daty).
- Odszkodowanie z art. 99 § 2: 1,5 × kwota jak do ekwiwalentu (analogia do § 2 ust. 2); drugie odczytanie (30 dni pracy, § 2a) opisane.
- Monitoring: informacja z pełnymi 2 tygodniami przerwy (15.12 → 30.11; 1.12 oznaczony jako sporny), oznaczenie dzień przed
  (łagodniej, opisane); nagrania 3 miesiące z dniem nagrania włącznie (14.11 → 13.02, wariant wcześniejszy); poczta i GPS bez okresu w Kp.

## Weryfikacje i audyt
- Weryfikator prawny: 17 uwag. Najważniejsze: cytat SN I PKN 145/97 nie dotyczył art. 99 (usunięty, zostało II PK 36/04
  z art. 471 KC), niepełna lista treści świadectwa (pkt 11 i 16), przedawnienie przy nowej umowie, „udostępnianych zakładowej
  organizacji związkowej”, ostrzejsze liczenie 2 tygodni i 3 miesięcy, klucze `zmianaPip2026` i `zmianaMobbing2026`. Poprawione wszystkie
  poza uwagami o wspólnych plikach (niżej).
- Weryfikator kodu/UX: 14 uwag (zepsute odesłanie „art. 22² przez art. 22³ § 3 § 6”, „0 dni”, statusy niewidoczne, błąd daty
  zerował werdykt, czerwony status w czasie legalnej wysyłki, niepełna data bez zdarzenia input → `focusout`, ściana pogrubionego
  tekstu, luki w testach). Poprawione wszystkie; dopisane testy.
- Audytor: rachunek bez rozbieżności (73 604 przypadki: 2 × 20 000 losowych dat 2000–2045 i każdy dzień okresu, niezależnie
  w Pythonie); budowniczy osobno 20 000 przypadków × 13 wartości, też 0 rozbieżności. 13 uwag do tekstów („zostało 1 dzień”,
  cele z art. 22³ § 1, warunek obwieszczenia, § 8 dotyczy informacji z § 6, art. 98 KPC, art. 97¹ § 2); poprawione.

## Czego nie sprawdzono
- Orzecznictwo o terminie pozwu bez zawiadomienia o odmowie i o liczeniu okresów z art. 22² § 3 i § 7 (w SAOS brak; sn.pl blokuje automaty).
- iPhone (WebKit) lokalnie; sprawdzi CI.

## Dla orkiestratora (wspólne pliki, których pakiet nie rusza)
- `src/data/prawo.ts`, wpis `pip`: uwaga twierdzi, że zmiany 2025 poz. 321, 620 nie dotyczą art. 10–11, a dotyczą (art. 10 ust. 1
  pkt 3, 15, 15e); brak też Dz.U. 2026 poz. 473 (nowe brzmienie art. 11).
- Spójność: `odwolanie-do-sadu-pracy` przesuwa terminy sprostowania świadectwa z art. 115 KC bez zastrzeżenia, a nowe narzędzie
  podaje datę bez przesunięcia (wariant ostrożny). Warto jedna konwencja (DECYZJE.md).

## Sprawy dla Patryka (najwyżej 3)
1. Czy przy sporze o art. 115 KC wszystkie kalkulatory terminów pracownika mają podawać datę bez przesunięcia (jak tu)?
