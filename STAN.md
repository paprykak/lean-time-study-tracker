# STAN: gdzie jesteśmy

Pamięć robocza projektu. Czyta ją i aktualizuje każda sesja na początku i na końcu pracy.

## Teraz
- **Nowy profil (2026-11-11, DECYZJE.md):** „Narzędzia i przepisy dla ludzi z hali”. Artykuły zostają jako biblioteka, nowych nie piszemy; wstrzymane szkice w `redakcja/*/wstrzymane/`. Na produkcji (`/narzedzia`, menu „Narzędzia”, nowa strona główna):
  - `/narzedzia/dodatek-za-prace-w-nocy`: płaca minimalna 2025–2027 z Dz.U., wymiar ze świętami i Wigilią, godziny nocne z grafiku, tabele stawek;
  - `/narzedzia/szkolenie-okresowe-bhp`: termin według § 15 rozporządzenia, plik .ics;
  - `/narzedzia/waznosc-uprawnien-udt`: okresy ważności z zał. 3, termin wniosku, stare zaświadczenia (koniec 1.01.2024), opłata 333,88 zł, plik .ics;
  - `/narzedzia/ile-kg-wolno-dzwigac`: § 13 i § 17, ciąża, karmienie, młodociani, mapa regału;
  - `/narzedzia/temperatura-w-pracy`: minimum § 30, napoje, § 30a w mocy od 11 stycznia 2027 r. (wyjątki z ust. 8);
  - `/narzedzia/wymiar-czasu-pracy`: wymiar miesiąca i okresu rozliczeniowego 2025–2027, etat, święta w sobotę;
  - `/narzedzia/kalkulator-nadgodzin`: dodatek 50% i 100%, podstawa z § 4a, czas wolny, limit 150 h;
  - `/narzedzia/kalkulator-urlopu`: 20/26 dni, szkoła, staż z art. 302^1 (od 2026 r.), etat, część roku;
  - `/narzedzia/kontrola-grafiku`: grafik miesiąca (12 h, trzyzmianowy), odpoczynki, doba, niedziele, dni wolne;
  - `/narzedzia/okres-wypowiedzenia`: art. 34 i 36, koniec w sobotę albo ostatniego dnia miesiąca, dni na szukanie pracy;
  - `/narzedzia/przerwy-w-pracy`: art. 134, 141, 187, 202 § 3^1;
  - `/narzedzia/badania-udt`: forma dozoru, badanie UDT i przegląd konserwacyjny z załączników rozporządzenia z 2018 r., .ics;
  - `/narzedzia/ekwiwalent-za-urlop`: § 15–19 rozporządzenia z 1997 r., współczynnik liczony z kalendarza (2026: 251/12), termin wypłaty z art. 171 § 4–5;
  - `/narzedzia/kalkulator-l4`: podstawa minus 13,71%, 80/100%, 33 albo 14 dni od pracodawcy, bez obniżki w szpitalu (uchylona od 2022 r.);
  - `/narzedzia/kalkulator-odprawy`: zwolnienie z przyczyn pracodawcy (1/2/3 pensje, limit 15 płac minimalnych) i emerytalna;
  - `/narzedzia/wolne-na-dziecko`: art. 188, 148^1, 173^1;
  - `/narzedzia/placa-minimalna`: co się wlicza (art. 6 ust. 5), wyrównanie, zlecenie 31,40 zł;
  - `/narzedzia/brutto-netto`: umowa o pracę (4806 zł → 3605,85 zł, zgodne z serwisami kadrowymi);
  - `/narzedzia/zlecenie-netto`: student, obok etatu, jedyne źródło;
  - `/narzedzia/umowa-na-czas-okreslony`: 33 miesiące i 3 umowy, agencja 18/36;
  - `/narzedzia/praca-w-niedziele`: dzień wolny albo dodatek 100%;
  - `/narzedzia/wynagrodzenie-za-przestoj` i `/narzedzia/wynagrodzenie-za-urlop`;
  - `/narzedzia/koszt-pracodawcy`: składki pracodawcy 2026 z ustawy budżetowej, wypadkowa 1,67%, PPK, limit 30-krotności;
  - `/narzedzia/zasilek-opiekunczy` i `/narzedzia/zasilek-macierzynski` (100/70% albo 81,5%, świadczenie 1000 zł);
  - `/narzedzia/normy-sanitarne`: zał. 3 do ogólnych przepisów BHP, minimum i wariant ostrożny („na każdych N”);
  - `/narzedzia/stawka-godzinowa` i `/narzedzia/limit-pracy-tymczasowej` (18 miesięcy w 36, każde okno 36 miesięcy);
  - `/narzedzia/dni-wolne-od-pracy`: święta, długie weekendy, okazje urlopowe do 5 dni, święto w sobotę, plik .ics (od października domyślnie następny rok).
  - `/narzedzia/zasilek-dla-bezrobotnych`: prawo (art. 218–220), 1783,90/1400,90 zł od 1.06.2026 (M.P. 2026 poz. 268), 120%, 180/365 dni, karencja po porozumieniu, na rękę (9% zdrowotnej, 12% PIT). Co roku w maju/czerwcu dopisać nowe obwieszczenie do `KWOTY_ZASILKU`.
  - `/narzedzia/staz-pracy`: okresy umów, zleceń i działalności (art. 302^1 od 2026 r.), nakładające się liczone raz, miesiące kalendarzowe + dni po 30, szkoła do urlopu.
  - `/narzedzia/ochrona-przedemerytalna`: art. 39–43 Kp, wiek 60/65 (art. 24 ustawy emerytalnej), zwolnienia z przyczyn pracodawcy tylko wypowiedzenie zmieniające z dodatkiem wyrównawczym.
  - `/narzedzia/odszkodowanie-za-wypadek-przy-pracy`: 1781 zł za 1% od 1.04.2026 (M.P. 2026 poz. 292), według dnia decyzji ZUS, zwiększenie od 10 pkt, 3,5-krotność przy niezdolności; co roku w marcu dopisać nowe obwieszczenie do `KWOTY_ODSZKODOWAN`.
  - `/narzedzia/termin-wyplaty-wynagrodzenia`: art. 85 § 3 Kp, dzień poprzedzający (gdy też wolny: najbliższy dzień pracy, opisane na stronie), soboty opcjonalnie, .ics; w styczniu sprawdzić test E2E z rokiem 2026/2027.
  - `/narzedzia/odwolanie-do-sadu-pracy`: 21 dni z art. 264 § 1–3 Kp, 14 dni z art. 97 § 2^1, art. 111 § 2 i 115 KC, nadanie pocztą (art. 165 § 2 KPC), przywrócenie terminu (art. 265).
  - `/narzedzia/urlop-ojcowski`: art. 182^3 Kp, ostatni dzień przed 1. urodzinami (art. 112 KC), wniosek 7 dni, zasiłek 100% (art. 31 ust. 1 i 3a ustawy zasiłkowej).
  - `/narzedzia/kalkulator-ppk`: art. 26–27, 31–32 i 105 ustawy o PPK; koszt na rękę z `netto()` (parametr `ppk`: wpłata pracodawcy w podstawie zaliczki), dopłata roczna od 3,5% × 6 płac minimalnych (25% przy obniżonej wpłacie).
  - `/narzedzia/urlop-wychowawczy`: art. 186 Kp, 36 miesięcy dla obojga, miesiąc wyłączny, koniec roku 6. urodzin, wniosek 21 dni, miesiące kalendarzowo (art. 112 KC).
  - `/narzedzia/wyplata-z-nadgodzinami`: nadgodziny 50/100% (stawka z pensji przez wymiar miesiąca), dodatek nocny z płacy minimalnej, netto z opcjonalnym PPK; składa nadgodziny.ts, dodatek-nocny.ts i netto.ts.
  - `/narzedzia/urlop-okolicznosciowy`: § 15–16 rozporządzenia z 1996 r. (t.j. 2014 poz. 1632), krwiodawcy z art. 9 ustawy o publicznej służbie krwi.
  - `/narzedzia/swiadczenie-rehabilitacyjne`: art. 18–20 ustawy zasiłkowej, art. 9 ustawy wypadkowej, art. 53 Kp; co kwartał dopisać wskaźnik waloryzacji z obwieszczenia Prezesa ZUS do `WSKAZNIKI`.
  - `/narzedzia/okres-probny`: art. 25 § 2–3 i art. 34 Kp, koniec kalendarzowo (art. 112 KC).
  - `/narzedzia/kara-porzadkowa`: art. 108–113 Kp, terminy według art. 111–115 KC; w kalkulatorze terminów do sądu pracy doszły sprawy z art. 112 § 1–2.
  - `/narzedzia/zakaz-konkurencji`: art. 101^1–101^4 Kp, minimum 25% (art. 101^2 § 3), podatek (art. 21 ust. 1 pkt 3 lit. d ustawy o PIT).
  - `/narzedzia/delegacja-krajowa`: § 7–9 rozporządzenia o podróżach służbowych (t.j. Dz.U. 2023 poz. 2190, dieta 45 zł od 2023 r.), art. 77^5 § 3–5 Kp, PIT art. 21 ust. 1 pkt 16 lit. a i ust. 15c, ZUS § 2 ust. 1 pkt 15 (t.j. Dz.U. 2025 poz. 316); doby w rzeczywistych godzinach (zmiana czasu), posiłki od diety za dobę.
  - `/narzedzia/odszkodowanie-za-zwolnienie`: art. 45, 47, 47^1, 50 § 1, 55 § 1^1, 56–61^2 Kp; kwoty jak ekwiwalent (§ 2 i 2a rozporządzenia z 1996 r.), 2 tygodnie jako połowa miesięcznej kwoty (wprost tylko § 2 ust. 2 dla art. 55 § 1^1 i 61^2, opisane na stronie), dni pracy przez współczynnik z § 19 rozporządzenia urlopowego.
  - `/narzedzia/odprawa-posmiertna`: art. 93 Kp (1/3/6 pensji, podział po równo, połowa dla jednej osoby, ubezpieczenie z § 7), uprawnieni z art. 67–68 ustawy o emeryturach i rentach z FUS, wolna od PIT (art. 21 ust. 1 pkt 7), staż z art. 36 § 1^1 i 302^1 § 8.
  Każde narzędzie: logika w `src/lib/narzedzia/` z testami, przepisy w `src/data/prawo.ts` (test pilnuje płacy minimalnej na bieżący rok i dat sprawdzenia), E2E na komputerze i Androidzie, test na produkcji po wdrożeniu, IndexNow, potem wynik CI na GitHubie (iPhone). Kolejne pomysły: „ile komornik może zabrać” wstrzymane: art. 87 § 1 i 87^1 Kp nie wymieniają składki zdrowotnej, a omówienia kadrowe liczą kwotę wolną jako płacę minimalną netto po niej (3605,85 zł w 2026 r.), więc przed budową potrzebne oficjalne stanowisko (MRPiPS albo PIP); testy UDT czekają na decyzję (niżej). Strona główna: 6 kart z `NA_GLOWNEJ` i lista wszystkich (DECYZJE.md, 2026-11-11).
- **Cloudflare wstrzykuje skrypt Web Analytics (wykryte 2026-11-11):** na produkcji pojawia się `static.cloudflareinsights.com/beacon.min.js`, który blokuje CSP. Nic nie jest wysyłane, ale każda strona ma błąd w konsoli. Patryk decyduje: wyłączyć automatyczną instalację w panelu Cloudflare (Analytics & Logs → Web Analytics → rytmhali.pl), albo włączyć analitykę świadomie, co wymaga oceny RODO, wpisu w polityce prywatności i zmiany CSP (AGENTS.md, zasada 10).
- **Do decyzji Patryka po zmianie profilu:** (1) nowe brzmienie stron zaufania „O nas” i „Zasady redakcyjne” (dziś opisują medium z artykułami); (2) czy zostawić dział „Do pobrania” w menu obok „Narzędzi”; (3) testy UDT na oficjalnych pytaniach: UDT publikuje „Przykładowe pytania egzaminacyjne” (PDF), ale nie podaje warunków ponownego wykorzystania. Prawdopodobnie to materiały urzędowe (art. 4 pkt 2 prawa autorskiego), ale najpewniej będzie poprosić UDT o zgodę mailem, a do tego czasu testów nie publikujemy.
- **Faza:** F0–F7 gotowe (F6 bez kont: zapis i kontakt działają po założeniu Brevo i Email Routing) (F1 zaakceptowana przez Patryka 2026-11-06, z kursem: artykuły w stylu HBR, nie wiadomości); skill `/artykul` gotowy (po uwagach Patryka: bez oznaczeń AI, rzemiosło pisania, redaktor językowy i czytelnik testowy, kontrola redakcyjna przed publikacją). Dalej F8 (infrastruktura i start) zależy od domeny, kont i słowa „wdrażaj”; równolegle pierwszy tekst skillem `/artykul`.
- **Start:** portal działa na rytmhali.pl (`START = true`, 2026-11-07). Opublikowane teksty: „Ta sama zmiana może mieć 56 albo 91% OEE” z kartą definicji OEE i „Zanim kupisz AI do prognoz, sprawdź, czy bijesz proste metody” z arkuszem „Test prognozy” (oba 2026-11-07, zatwierdzone przez Patryka). Na polecenie „publikuj od razu” (DECYZJE.md, 2026-11-07) wieczorem tego dnia opublikowane bez lektury przed publikacją: „Zanim kupisz roboty do kompletacji, skróć drogę magazyniera” (`/kompletacja-droga`), „Skracaj przezbrojenia najpierw na wąskim gardle” (`/smed-przezbrojenia`) i „Wdrożenie nowej osoby mierz w sztukach, nie w dniach szkolenia” (`/krzywa-uczenia`). Weryfikacja faktów: 0 niepotwierdzonych; bramka czytelnika testowego niespełniona (6/10 przyjemność, 6–7/10 wartość); szczegóły i uwagi na później w teczkach `redakcja/<slug>/teczka.md`. Wdrożenie: `npm run check` zielone (174 testy E2E, Lighthouse, build produkcji), test produkcji 19/19, IndexNow 200 dla 10 adresów, axe 0 naruszeń na żywych stronach; zrzuty w `raporty/artykuly-2026-11-07/`.
- **Teksty z 2026-11-09** (polecenie Patryka „Od razu publikuj”, bez lektury przed publikacją; tematy wybrała redakcja): „Nie podnoś ciśnienia, tylko uszczelnij sieć sprężonego powietrza” (`/wycieki-sprezonego-powietrza`), „Na czwartej nocy z rzędu ryzyko wypadku jest o jedną trzecią wyższe” (`/grafik-zmian-wypadki`), „Roczny spis spełnia ustawę, ale nie naprawi stanów w magazynie” (`/inwentaryzacja-ciagla`). Po 4–6 elementów wizualnych na tekst (wykresy, schematy, tabele-ściągi, przykład „przed i po”). Nowe tematy: Energia w zakładzie, Czas pracy i grafik, Zapasy i inwentaryzacja (strony tematów z `noindex`, jak pozostałe). Weryfikacja: po domknięciu 0 niepotwierdzonych i sprzecznych; bramka czytelnika testowego niespełniona (przyjemność 6/10 u wszystkich sześciu czytelników, wartość 7–8/10); uwagi na później w teczkach `redakcja/<slug>/teczka.md`, sekcja 12. Zdjęcia: Winterslag i Kawasaki (Commons, CC BY 4.0), centrum dystrybucyjne (Flickr, CC BY 2.0, kadr bez marek). Wdrożenie: `BEZ_WEBKIT=1 npm run check` zielone (174 testy E2E, Lighthouse, kontrola SEO produkcji 0 błędów), test produkcji 19/19, IndexNow 200 dla 10 adresów (w tym trzy strony tematów z `noindex`, zgłoszone niepotrzebnie, bez szkody), axe 0 naruszeń na żywych stronach (komputer i telefon); zrzuty w `raporty/artykuly-2026-11-09/`.
- **Gałąź robocza:** `ccr-a1f628ee-snc89w` (sesja w chmurze); `main` = produkcja, push tylko po „wdrażaj”.
- **Do obejrzenia:** zrzuty F3 w `raporty/F3/` (strona główna, artykuł, dział, wyszukiwarka; treści testowe), zrzuty F2 w `raporty/F2/` (artykuł z kolekcji treści, panel redakcji), podgląd strony głównej i artykułu (`raporty/podglad/`), strona wzorów `/styleguide` (lokalnie `npm run dev` → http://localhost:4321/styleguide), panel na lokalnych plikach: http://localhost:4321/admin/index.html.
- **Ostatnia sesja:** 2026-11-06: F3 (szablony, wyszukiwarka, start w dwóch krokach) i skill `/artykul` po uwagach Patryka (DECYZJE.md). Wcześniej F2: kolekcje treści, strona artykułu `/<slug>` z kolekcji, okładki 1200×630, mapa strony z `lastmod`, panel Sveltia CMS (przepływ redakcyjny), worker z logowaniem do panelu, testy panelu. Wcześniej tego dnia: repozytorium wyczyszczone i zaadaptowane, fundament Astro 7, fonty, tokeny, logo (odtworzenie koncepcji C), 20 komponentów, `/styleguide`, „Wkrótce” (szkic), 404, testy. `npm run check` zielone lokalnie i w GitHub Actions (tam także iPhone/WebKit: 60 testów E2E na 3 urządzeniach, 52 zaliczone, 8 celowo pominiętych, np. test klawiatury na telefonie).

## Wyniki F1 (sekcja 3 promptu)
| Obszar | Wynik |
|---|---|
| Lighthouse (telefon) | `/` 99 / 100 / 100 / 100; `/styleguide` i `/404` 100 / 100 / 100 (SEO celowo pominięte przez noindex). LCP 0,8–1,0 s, CLS 0, TBT do 110 ms |
| Budżet | JS 0,5–0,9 KB, CSS 7–8 KB, fonty z preload 47 KB (gzip) |
| Dostępność | axe WCAG 2.2 AA: 0 błędów poważnych i krytycznych; klawiatura i widoczny fokus sprawdzone testem |
| Telefon | brak przewijania w bok przy 320 px, cele dotyku ≥ 44 px, menu działów przewijane kciukiem |
| Układ | CLS < 0,02 przy wczytaniu i przewijaniu, sloty reklamowe w wymiarach formatu |
| Bezpieczeństwo | CSP z hashami (bez `unsafe-inline` i `unsafe-eval`), komplet nagłówków w `_headers`; ocena securityheaders.com możliwa dopiero po wdrożeniu |
| Prywatność | zero żądań do domen spoza serwisu (test sieci) |

## Wyniki F2
| Obszar | Wynik |
|---|---|
| Próba z promptu | nowy wpis testowy w panelu → zapis pliku: 4–11 s (test E2E, 10 powtórzeń bez błędu); plik z panelu → strona podglądu z okładką: build 17 s. Twoja próba na prawdziwym podglądzie gałęzi czeka na Cloudflare (niżej) |
| Panel | konfiguracja zgodna ze schematem Sveltia 0.256.1 i ze schematami treści w obie strony (test łapie celowe błędy: brak pola, inna lista wyboru, inna długość, nieznana opcja) |
| Strona artykułu | axe WCAG 2.2 AA: 0 naruszeń (komputer i telefon), 0 błędów konsoli i CSP, jeden H1, bez przewijania w bok przy 320 px |
| Worker | 11 testów logowania (CSRF, tylko ta sama domena, CSP z hashem, `no-store`); uruchomiony w workerd: `/api/*` przez worker, reszta z plików, `/admin/` z własną CSP |

## Wyniki F3
| Obszar | Wynik |
|---|---|
| Szablony | strona główna, artykuł, dział (ze stronicowaniem), temat, autor, materiały do pobrania (lista i strona), wyszukiwarka, newsletter (zapis i strony techniczne), reklama i współpraca, 8 stron stałych (projekty), 404, 410, RSS całości i działów |
| Start w dwóch krokach | produkcja przed startem ma tylko „Wkrótce”, 404, 410, politykę prywatności i strony newslettera; mapa strony tylko `/`; zero treści testowych (sprawdzone buildem) |
| Testy | build testowy z 25 artykułami i materiałem: E2E, axe, Lighthouse i kontrola SEO na szablonach z treścią |

## Do zrobienia przez Patryka
Od góry według pilności. Każdy punkt to jedna czynność.
- [x] ~~Akceptacja wyglądu F1~~ (2026-11-06).
- [x] ~~Zgoda na zdjęcia~~ (2026-11-06: dopuszczone CC0, CC BY, Unsplash, Pexels; wybór powierzony redakcji, 10 zdjęć w rejestrze).
- [x] ~~Logo po szlifie~~ (2026-11-06: Patryk zaakceptował wersję z podtytułem wersalikami).
- [x] ~~Oznaczenia AI~~ (2026-11-06: bez oznaczeń przy tekstach; warunek: każdy tekst czytasz w całości przed publikacją, to kontrola redakcyjna z AI Act, DECYZJE.md).
- [x] ~~Podpis tekstów~~ (2026-11-06: domyślnie „Redakcja Rytmu Hali”, Twoje nazwisko pod tekstami, które napisałeś albo przeredagowałeś i przyjmujesz jako swoje).
- [x] ~~Pierwsze teksty skillem `/artykul`~~ (2026-11-07: OEE i prognozowanie popytu opublikowane; skill dostał „Budżet pracy”, żeby kolejne teksty kosztowały mniej rund).
- [ ] **Wyłącz skrypt Cloudflare Web Analytics** (wykryte 2026-11-07 na produkcji): Cloudflare wstrzykuje na każdą stronę `static.cloudflareinsights.com/beacon.min.js`. Nasza CSP go blokuje, więc nic nie wysyła, ale to skrypt strony trzeciej bez Twojej decyzji (zasada 10) i błąd w konsoli. Panel Cloudflare → Web Analytics → karta rytmhali.pl → Manage site → Disable. Instrukcja: https://developers.cloudflare.com/web-analytics/get-started/
- [ ] **Przeczytaj trzy teksty opublikowane bez Twojej lektury** (kompletacja, SMED, krzywa uczenia; 2026-11-07): uwagi, zmiany albo wycofanie. Sekcja 12 w każdej teczce mówi, co zostało nierozwiązane.
- [ ] **Przeczytaj projekty stron stałych** na podglądzie (lokalnie: `RH_PODGLAD=1 npm run build && npx astro preview`, adresy `/o-nas`, `/zasady-redakcyjne`, `/polityka-korekt`, `/oznaczanie-reklam`, `/jak-uzywamy-ai`, `/kontakt`, `/reklama`, `/newsletter`, `/polityka-prywatnosci`, `/regulamin-newslettera`, `/stopka-redakcyjna`): uwagi albo „zatwierdzam”. Miejsca w nawiasach kwadratowych to decyzje i dane do uzupełnienia (wydawca, okresy przechowywania danych, termin odpowiedzi, częstotliwość newslettera, cennik). Polityka prywatności musi być zatwierdzona, zanim uruchomimy zapis na „Wkrótce”.
- [x] ~~Bio~~ (2026-11-06: z patrykkorpyta.pl, strona O mnie i księga marki; LinkedIn wymaga logowania, więc nie był czytany automatycznie). Miejsca pracy jak na Twojej stronie, bez obecnego pracodawcy i bez wyników w procentach; zdjęcie z portretu na patrykkorpyta.pl. Zmiany: panel → Autorzy.
- [ ] **Makiety (opcjonalnie):** skopiuj `makiety/` z `/home/patryk/Pulpit/rytm-hali/` do repozytorium; pomogą porównać szablony F3 z drugą makietą. Logo z repozytorium jest zaakceptowane, oryginały logo nie są potrzebne.
- [ ] **Opcjonalnie, więcej zdjęć:** klucz API Unsplash (darmowy, https://unsplash.com/oauth/applications → New Application). Bez klucza nie da się legalnie szukać w Unsplash automatycznie; klucz dodajesz sam w ustawieniach środowiska, nie w czacie.
- [ ] **Repozytorium:** to repozytorium jest **publiczne** i nazywa się `lean-time-study-tracker`. Prompt zakłada prywatne. GitHub → Settings → General: zmień nazwę na `rytm-hali` i na dole „Change repository visibility” → Private. https://github.com/paprykak/lean-time-study-tracker/settings
- [ ] **Domeny:** kup `rytmhali.pl` i `rytmhali.com` i dodaj je do Cloudflare (Add a domain). Bez tego nie da się wdrożyć produkcji.
- [ ] **Newsletter, konto Brevo** (rekomendacja; firma i dane w UE, API ma osobny zapis z podwójnym potwierdzeniem; jeśli wolisz MailerLite, napisz): https://www.brevo.com → załóż konto → Kontakty → Listy: lista „Raport zmianowy” (zapisz jej numer) → Szablony: szablon potwierdzenia zapisu z linkiem `{{ params.DOIurl }}` (zapisz numer) → SMTP i API → Klucze API: utwórz klucz i wpisz go sam: `npx wrangler secret put BREVO_API_KEY`. Mnie podaj tylko numer listy i szablonu (to nie sekrety). W Brevo ustaw stronę wypisu na `https://rytmhali.pl/newsletter/wypisano`.
- [ ] **Poczta domeny** (po dodaniu domeny do Cloudflare): Brevo → Nadawcy, domeny → dodaj `rytmhali.pl` i wpisz w Cloudflare DNS rekordy, które poda (DKIM, DMARC, kod weryfikacji). Jeden rekord SPF na domenę: gdy Brevo albo Email Routing poprosi o SPF, dopisz jego `include:` do istniejącego rekordu, nie dodawaj drugiego.
- [ ] **Adres redakcja@rytmhali.pl:** Cloudflare → domena → Email → Email Routing → włącz → Adresy docelowe: dodaj swoją skrzynkę i potwierdź → reguła `redakcja@rytmhali.pl` → Twoja skrzynka. Potem w ustawieniach Workera: zmienna `ADRES_REDAKCJI` = Twoja skrzynka (formularz kontaktowy wysyła na nią przez Email Routing; adres nie trafia do repozytorium). Instrukcja: https://developers.cloudflare.com/email-routing/get-started/
- [ ] **Cloudflare, projekt Workers z repozytorium:** Workers & Pages → Create → Import a repository → to repozytorium. Build command: `npm run check:szybki`, deploy command: `npx wrangler deploy`, gałęzie inne niż `main`: włącz „Builds for non-production branches”. Potem Zero Trust → Access: zabezpiecz „Preview URLs” Workera (polityka: Twój e-mail). Instrukcja: https://developers.cloudflare.com/workers/ci-cd/builds/
- [ ] **Panel, pierwsze logowanie (gdy strona będzie na Cloudflare):** utwórz token https://github.com/settings/personal-access-tokens/new → Repository access: tylko to repozytorium → Permissions: Contents i Pull requests: Read and write → ważność 90 dni. Na rytmhali.pl/admin kliknij „Zaloguj się za pomocą tokenu dostępu” i wklej. Token zostaje w Twojej przeglądarce; nie wklejaj go w czacie.
- [ ] **Logowanie przez GitHub (wygodniejsze, po tokenie):** https://github.com/settings/applications/new → nazwa „Rytm Hali: panel”, Homepage `https://rytmhali.pl`, Authorization callback URL `https://rytmhali.pl/api/auth/callback` → Register. Potem w katalogu projektu: `npx wrangler secret put GITHUB_CLIENT_ID` (Client ID) i `npx wrangler secret put GITHUB_CLIENT_SECRET` (Generate a new client secret). Wartości wpisujesz tylko Ty.
- [ ] **Umami** (wybrany w prompcie): dodaj witrynę `rytmhali.pl` w https://cloud.umami.is (region UE) i podaj identyfikator witryny (to nie jest sekret). Do raportów dla partnerów: klucz API (Ustawienia → Klucze API) tylko w swoim środowisku.
- [ ] **Przed publicznym startem:** umowa o pracę (zakaz konkurencji, zgoda na działalność dodatkową); przed pierwszą reklamą: forma działalności i rozmowa z prawnikiem. Lista 17 pytań z podstawami prawnymi: `prawne/pytania-do-prawnika.md` (rejestracja tytułu prasowego, oznaczanie reklam i materiałów partnerów, forma działalności i VAT, RODO i transfery, regulamin, AI Act, prawa autorskie).
- [ ] **Opcjonalnie: klucz OpenAlex** (darmowy, https://help.openalex.org/api/authentication/): lepsze wyszukiwanie badań w skillu `/artykul`. Klucz dodajesz sam w ustawieniach środowiska, nie w czacie.

## Wyniki F4
| Obszar | Wynik |
|---|---|
| Dane strukturalne | `WebSite` z `SearchAction` (w portalu), `NewsMediaOrganization` z logo 512×512 i zasadami redakcji (zasady, etyka, weryfikacja faktów, korekty, finansowanie, redakcja, podpisy, kontakt; `src/lib/polityki.mjs`), `Article` z obrazami 16:9, 4:3, 1:1 i okładką, autor `Person` ze stroną autora, `BreadcrumbList`, `FAQPage`, `DigitalDocument` |
| Dla asystentów AI | `/llms.txt` z treści: działy z artykułami, materiały, zasady redakcji (tylko teksty indeksowane) |
| IndexNow | klucz w `public/`, skrypt `npm run indexnow` (po wdrożeniu) |
| Kontrola | `seo-check`: każda zasada w danych organizacji prowadzi do strony i śródtytułu, każdy link w `llms.txt` do zbudowanej strony, klucz IndexNow w `dist/`; E2E dla danych strukturalnych i `llms.txt` |

## Wyniki F5
| Obszar | Wynik |
|---|---|
| Kampanie w slotach | slot sam bierze kampanie swojego miejsca z panelu (daty od–do, „aktywna”), bez JavaScriptu pokazuje kampanię trwającą w chwili buildu, w przeglądarce pilnuje dat co do minuty i losuje jedną z trwających (rotacja); po końcu kampanii autopromocja newslettera |
| Link i oznaczenie | UTM (`utm_source=rytmhali`, `utm_medium=display`, `utm_campaign=<id>`, bez nadpisywania własnych UTM partnera), `rel="sponsored noopener"`, podpis „REKLAMA”, kreacje 1× i 2× |
| Zdarzenia | kliknięcie (atrybuty Umami) i wyświetlenie (połowa reklamy na ekranie przez sekundę) z właściwościami kampania, miejsce, slot; działają, gdy skrypt Umami będzie na stronie |
| Raport dla partnera | `npm run raport-kampanii -- <id>`: wyświetlenia, kliknięcia i CTR według miejsc z API Umami; sprawdzony na atrapie API |
| Materiał partnera | oznaczenie w nagłówku i na kartach, `sponsor` w danych, linki `sponsored`, bez reklamy w treści (test E2E na fikcyjnym materiale) |

## Wyniki F6
| Obszar | Wynik |
|---|---|
| Zapis na newsletter | formularz bez skryptów → worker `/api/newsletter` → Brevo z podwójnym potwierdzeniem (lista, szablon, powrót na `/newsletter/potwierdzono`); strony: sprawdź skrzynkę, potwierdzono, wypisano, błąd |
| Kontakt | formularz na `/kontakt` → worker `/api/kontakt` → e-mail do redakcji przez Email Routing (odpowiedź trafia do nadawcy); strony: wysłano, błąd |
| Ochrona | pole-pułapka, limit 5 prób na minutę z jednego IP (Rate Limiting), tylko z tej domeny (Origin), kontrola pól i adresu e-mail w workerze, temat z zamkniętej listy (bez wstrzyknięcia nagłówków), bez adresów e-mail w logach |
| Sprawdzone | 20 testów workera (atrapy Brevo i poczty), worker w `wrangler dev` (pułapka, brak konfiguracji, obca domena, GET), E2E formularzy i axe na `/kontakt` |

## Wyniki F7
| Obszar | Wynik |
|---|---|
| Projekty tekstów | polityka prywatności (opis wszystkich przepływów danych z kodu: newsletter, kontakt, statystyki, dane techniczne, odbiorcy i transfery, pliki cookie, prawa), regulamin newslettera, stopka redakcyjna; linki w stopce i przy zgodzie na newsletter; regulamin dostępny przed startem |
| Dla prawnika | `prawne/pytania-do-prawnika.md`: 17 pytań, przepisy sprawdzone w tekstach jednolitych (Prawo prasowe art. 7, 14, 14a, 20, 27, 36, 42; ustawa o świadczeniu usług drogą elektroniczną art. 8 i 9; RODO; AI Act art. 50) |

## Następne kroki
0. Skill `/artykul` gotowy (2026-11-06): pierwszy tekst po wyborze tematu; po nim lekcje w skillu.
1. F8: lista kontrolna w `START.md`; test żywej strony `npm run test:produkcja` gotowy (sprawdzony na buildzie w workerd). Infrastruktura i start po domenie, kontach i słowie „wdrażaj”: Cloudflare, sekrety, Email Routing, Brevo, Umami, IndexNow, Search Console; `START = true` dopiero na bramce startu (12 tekstów w 4 działach i zatwierdzone strony zaufania).
1b. Po koncie Brevo i Email Routing: wiązanie `send_email` POCZTA i zmienne `BREVO_LISTA`, `BREVO_SZABLON_DOI` w `wrangler.jsonc`, próbny zapis i wiadomość z formularza na podglądzie.
1a. Po wdrożeniu produkcji: `npm run indexnow -- --mapa`, a potem Search Console i Bing Webmaster Tools (konta Patryka, weryfikacja domeny w Cloudflare).
2. Zdjęcia w treści artykułu z rejestru (rysunki z podpisem „Fot.”): dziś w treści są wykresy SVG; zdjęcia z rejestru w środku tekstu dojdą przy pierwszym tekście, który ich potrzebuje.
3. LCP strony głównej: sprawdzone w Lighthouse na buildzie testowym (wynik w raporcie F3).
4. Po podłączeniu Cloudflare: sprawdzić, czy panel widzi podgląd gałęzi (przycisk „Wyświetl podgląd”); jeśli nie, ustawić `backend.preview_context` na nazwę kontroli Workers Builds. Po zmianie nazwy repozytorium: `backend.repo` w `public/admin/config.yml`.

## Notatki
- W sesji w chmurze nie ma WebKita: lokalnie `BEZ_WEBKIT=1 npm run check`, iPhone w GitHub Actions.
- `astro preview` w Astro 7 nie startuje drugi raz, gdy podgląd już działa: `--ignore-lock` albo `npx astro preview stop`.
- Test panelu (`src/lib/panel.test.ts`) czyta schematy z `.astro/collections/`: tworzy je `npx astro sync` (robi to `astro check` na początku `npm run check`).
- Aktualizacja Sveltia CMS: nowa wersja w `package.json` (`@sveltia/cms`, dokładna) i w `public/admin/index.html`; `npx vitest run src/lib/panel.test.ts` poda nową sumę SRI i sprawdzi konfigurację z nowym schematem, `npx playwright test tests/e2e/panel.spec.ts --project=komputer` sprawdzi panel.
- Fonty generuje `npm run fonty` (wymaga `fonts-liberation` do metryki fontu zapasowego); logo `npm run logo`.
