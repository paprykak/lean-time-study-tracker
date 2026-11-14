# Pakiet „spójność UX”: raport (2026-11-14)

Zakres: wszystkie 107 narzędzi, bez nowych narzędzi i bez zmian logiki prawnej. Gałąź `fabryka/ux`. Wykonały go
3 grupy budowniczych (po około 35 stron), a sprawdził niezależny weryfikator kodu i UX. Weryfikator dostał diff, pliki
i zrzuty bez wniosków zespołu. Fuzzował błędy, sprawdzał „Wstecz” i 320 px we wszystkich trybach.

## 1. Komunikaty błędów (WCAG 2.2: 3.3.1, 3.3.3, 4.1.3, 1.3.1)
Wzorzec: `src/lib/narzedzia/formularz.ts`, zasada 12 w `prompty/02-fabryka.md`, wzór `okres-zasilkowy`.
- `<p id="…" class="blad-pola" role="alert" hidden>` na każdej stronie z komunikatem (wcześniej role="alert" miało 17 ze 100 stron). Pola, których komunikat dotyczy, wskazują go w `aria-describedby`.
- Komunikat pokazuje się tylko przez `pokazBlad(komunikat, tekst, pola)`:
  - ten sam tekst nie jest wpisywany ponownie, więc czytnik go nie powtarza;
  - nowy komunikat pojawia się po 400 ms przerwy w pisaniu: „1” w drodze do „1500” nie przerywa czytnika i nie miga na czerwono;
  - po poprawie komunikat znika od razu;
  - `aria-invalid="true"` dostaje dokładnie pole do poprawy, a po poprawie atrybut znika (wcześniej bywało „false”);
  - typografia jest w pomocniku.
- Wybór role="alert" zamiast regionu `aria-live="polite"`: komunikat jest ukryty (`hidden`), a region polite przełączany z ukrytego bywa przez czytniki pomijany. Pojawienie się alertu ogłaszają NVDA, JAWS i VoiceOver. Opóźnienie ogranicza przerywanie w trakcie pisania.
- Poprawione przy okazji: brak komunikatu przy dużych liczbach w normach sanitarnych (wyjątek w konsoli, stary wynik), komunikat płacy minimalnej wskazujący inne pole niż oznaczone, komunikaty i aria-invalid na ukrytych polach po zmianie trybu (dodatek nocny, UDT bez daty), „22 nocy” w delegacji zagranicznej, pola bez aria-describedby (m.in. PPK, przerwy, dyżur, ulga na dzieci, posiłki).

## 2. Powrót „Wstecz”
- Chromium przywraca pola po zdarzeniu load, bez input/change, więc wynik zostawał stary: test wykrył to na 98 stronach.
- Na wszystkich stronach jest teraz `liczPoPowrocie(przelicz)` (pageshow, także bez bfcache). Własne pageshow 4 stron zastąpił pomocnik.
- Kontrola grafiku odtwarza kalendarz tylko przy zmianie roku, miesiąca albo wzoru, więc ręcznie poprawione dni zostają.

## 3. Telefon 320 px
Audyt skryptem całego rejestru:
- przewijanie w bok;
- opcje list mierzone fontem strony;
- pola dat i godzin;
- overflow i tekst poza elementem.

Poprawione 31 stron:
- **Pary dat jedno pod drugim poniżej 380 px:** okres zasiłkowy, umowy terminowe, limit pracy tymczasowej, staż, badania lekarskie, delegacje, dni robocze, L4 po zwolnieniu, młodociany, okres próbny, rodzic, zwolnienia grupowe, zwrot kosztów szkolenia.
- **Czas jazdy kierowcy:** poniżej 360 px rodzaj okresu w pełnym wierszu, a godzina pod nim; wyżej kolumna godziny 8,5 rem, bo „10:15 AM” w przeglądarce angielskiej też się mieści.
- **„październik” w pełni widoczny:** wypłata z nadgodzinami, pracownik niepełnosprawny, dyżur w pracy, ulga na dzieci.
- **Litery zmian w kalendarzu kontroli grafiku:** wcześniej zasłaniała je strzałka listy.
- **Skrócone opcje list,** z tymi samymi wartościami. Pełny opis jest pod polem tam, gdzie skrót by go zgubił:

| Strona | Było | Jest |
|---|---|---|
| dyżur w pracy | W zakładzie lub wskazanym miejscu | W zakładzie, poza domem |
| młodociany | Lekkie prace, np. w wakacje | Lekkie prace |
| staż pracy | Zlecenie albo umowa agencyjna | Zlecenie lub agencyjna |
| urlop bezpłatny | Do pracy u innego pracodawcy | U innego pracodawcy |
| urlop bezpłatny | Nieobecność nieusprawiedliwiona | Bez usprawiedliwienia |
| L4 po zwolnieniu | Choroba zakaźna z wylęganiem ponad 14 dni | Choroba zakaźna (warunek pod polem) |
| dźwiganie | Podnoszenie, przenoszenie | Podnoszenie, noszenie |
| kalkulator urlopu | Cały rok u tego pracodawcy | Cały rok w tej pracy |
| kontrola grafiku | 8 h: trzy zmiany tygodniami | 8 h: 3 zmiany tygodniami |
| zasiłek opiekuńczy | Dziecko 14–18 z orzeczeniem | Dziecko 14–18, orzeczenie |
| uprawnienia UDT | Podest, podnośnik koszowy | Podest ruchomy, zwyżka |
| uprawnienia UDT | Tow.-osobowy, z przystanków / z kabiny | Tow.-osob., z przystanku / z kabiny (objaśnienie pod polem) |
| uprawnienia UDT | Hydrauliczny, pneumatyczny | Hydraulika, pneumatyka |
| uprawnienia UDT | Specjalne (chwytak, magnes) | Specjalne (np. chwytak) |
| drgania | Przez ręce (narzędzia ręczne) | Przez ręce (narzędzia) |
| odwołanie do sądu | Odmowa przyjęcia do pracy | Odmowa przyjęcia (pełna nazwa pod polem) |

- Zasiłek dla bezrobotnych i świadczenie rehabilitacyjne: lista zamieniona na przyciski wyboru z pełnym tekstem, bo skrót zmieniłby sens.
- Odmiana: „Zostały 2 dni” w urlopie ojcowskim (`zostaloDni()` z testem 1, 2, 5, 12 i 22).

## 4. Listy lat liczone przy budowaniu
**Przeniesione do przeglądarki.** `data-lata-kalendarza` w `dzis-w-formularzu.ts` dopisuje brakujące lata i nie usuwa lat z budowania. Dotyczy 11 narzędzi liczących z samego kalendarza (święta z algorytmu Wielkanocy):
- dni wolne od pracy,
- dyżur kierowcy,
- dyżur w pracy,
- kalkulator nadgodzin,
- kontrola grafiku,
- pracownik niepełnosprawny,
- stawka godzinowa,
- termin wypłaty,
- wymiar czasu pracy,
- nadgodziny średniotygodniowe,
- równoważny czas pracy.

**Wymagają przebudowy strony,** bo lata wynikają z kwot w danych (płaca minimalna, PIT, przeciętne wynagrodzenie) i nowego roku nie da się dopisać bez nowych kwot:
- dodatek wyrównawczy,
- dodatek za pracę w nocy,
- kalkulator L4,
- mobbing i dyskryminacja,
- płaca minimalna,
- wynagrodzenie za niepełny miesiąc,
- wynagrodzenie za przestój,
- wypłata z nadgodzinami,
- zasiłek macierzyński,
- zasiłek opiekuńczy,
- zerowy PIT.

**Częściowo:**
- ekwiwalent za urlop: etykiety z współczynnikiem roku, do zrobienia w skrypcie strony;
- tabele roczne w treści stron (np. wymiar czasu pracy, dni wolne): też tylko przy przebudowie.

## Testy
- `tests/e2e/formularze.spec.ts`, wszystkie narzędzia:
  - struktura komunikatów;
  - zła wartość → aria-invalid na polu, które wskazuje komunikat;
  - brak ponownego wpisania komunikatu;
  - zniknięcie po poprawie;
  - „Wstecz” z prawdziwym przywróceniem pola (bfcache w Playwright nie działa).
  - Strony bez prostego błędu albo bez przywracanych pól są na jawnych listach; każda inna, która nic nie sprawdzi, oblewa test.
- `tests/e2e/uklad-320.spec.ts`: wszystkie narzędzia przy 320 px, w stanie domyślnym i w każdym trybie (opcje list, pola wyboru).
- `daty-domyslne.spec.ts`: listy lat w 2029 r.
- `formularz.test.ts`, `dzis-w-formularzu.test.ts`: testy jednostkowe.

## Czego nie sprawdzono
- Prawdziwy czytnik ekranu (NVDA, VoiceOver) i Safari/iOS lokalnie. Sprawdzone atrybuty ARIA i zachowanie w Chromium; iPhone (WebKit) sprawdza CI. VoiceOver bywa zawodny przy alercie odkrywanym z `hidden`; gdyby to wyszło w teście z czytnikiem, wariantem jest stale wyrenderowany pusty region.
- Format godzin AM/PM w innych językach przeglądarki: test zakłada „00:00”.
