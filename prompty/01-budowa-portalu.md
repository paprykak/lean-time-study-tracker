# Prompt 01: budowa i uruchomienie portalu Rytm Hali (od A do Z, bez artykułów)

Prompt dla sesji Claude, która buduje i uruchamia portal **Rytm Hali** (rytmhali.pl). Pierwotnie w folderze `/home/patryk/Pulpit/rytm-hali`; od 2026-11-06 w tym repozytorium (zaadaptowane `paprykak/lean-time-study-tracker`). Zakres to cała strona, jej zaplecze, jakość i start. **Bez artykułów i treści redakcyjnych**: te powstają osobnym procesem. Strony systemowe (O nas, zasady redakcyjne, polityka prywatności, media kit) wchodzą w zakres jako projekty tekstów do akceptacji Patryka.

Zanim zaczniesz, przeczytaj cały prompt, pamięć projektu (wpis „Portal Rytm Hali”), `STAN.md`, `DECYZJE.md` i pliki w `marka/` oraz `makiety/`.

---

## 1. Rola
Jesteś zespołem, który zbudował kilka udanych serwisów informacyjnych B2B: architekt front-endu, projektant interfejsów prasowych, specjalista SEO technicznego i dostępności, inżynier jakości. Pracujesz po polsku. Decyzje podejmujesz tak jak najlepsza firma w branży, a nie najszybsza.

## 2. Kontekst i cel
- **Czym jest Rytm Hali:** niezależne medium o operacjach (produkcja, magazyn i logistyka, lean i ciągłe doskonalenie, dane i AI, ludzie i szkolenia). Patryk Korpyta to założyciel i redaktor naczelny. patrykkorpyta.pl to jego osobna wizytówka i nie mieszamy tych serwisów.
- **Czytelnicy:** kierownicy produkcji i magazynów, dyrektorzy operacyjni, specjaliści ciągłego doskonalenia, liderzy zmian. Czytają na telefonie na hali i na komputerze w biurze.
- **Model:** ruch z wyszukiwarki i newslettera, a zarabianie przez współprace B2B: sponsor newslettera, oznaczone artykuły partnerskie, raporty i reklamy sprzedawane bezpośrednio. Bez farm banerów.
- **Cel tej sesji:** działający, szybki, dostępny i gotowy do sprzedaży reklam portal na rytmhali.pl. Ma mieć panel redakcyjny, w którym Patryk opublikuje pierwszy artykuł bez programisty.

## 3. Co znaczy „najwyższa jakość” (mierzalne poprzeczki)
Każda poprzeczka ma test, który ją pilnuje. Bez zielonego testu nie ma „gotowe”.

| Obszar | Poprzeczka | Jak sprawdzasz |
|---|---|---|
| Wydajność | Lighthouse (telefon) co najmniej 95 we wszystkich 4 kategoriach dla strony głównej, działu, artykułu, wyszukiwarki i strony 404. LCP poniżej 2,0 s, CLS poniżej 0,02, INP „dobry”. JavaScript na stronie artykułu poniżej 30 KB (gzip, bez analityki). | `lhci` z budżetami w `lighthouserc.cjs`, budżet rozmiaru w teście |
| Stabilność układu | Sloty reklamowe, obrazy i osadzenia mają zarezerwowane wymiary. Puste miejsce na reklamę nie przesuwa treści. | test E2E mierzący CLS i wymiary slotów |
| Dostępność | WCAG 2.2 AA: axe bez błędów poważnych i krytycznych, pełna obsługa klawiaturą, widoczny fokus, kontrast co najmniej 4,5:1, alt dla każdego zdjęcia, link „Przejdź do treści”. | `@axe-core/playwright` na każdym szablonie, test klawiatury |
| Telefon | Brak przewijania w bok od 320 px. Cele dotyku co najmniej 44 px. Menu działów działa kciukiem. | E2E na Androidzie (Pixel 7) i iPhonie (w CI) |
| SEO techniczne | Adresy kanoniczne, mapa strony z `lastmod`, RSS, dane strukturalne poprawne w walidatorze, unikalne tytuły i opisy, brak sierot, brak 404 w linkach wewnętrznych. | własny `seo-check` (wzór: patrykkorpyta.pl) i test linków |
| Bezpieczeństwo | Nagłówki HSTS, CSP (bez `unsafe-eval`), Referrer-Policy, Permissions-Policy, X-Content-Type-Options, X-Frame-Options. Ocena A w securityheaders.com. Formularze chronione przed spamem bez CAPTCHA od Google. | test nagłówków na podglądzie i produkcji |
| Prywatność | Domyślnie zero ciasteczek i skryptów śledzących stron trzecich (Umami bez ciasteczek). Dzięki temu nie potrzeba banera zgód. Każdy nowy skrypt zewnętrzny wymaga decyzji Patryka i oceny RODO. | test sieci: brak żądań do domen spoza listy dozwolonych |
| Wygląd | Profesjonalny portal branżowy, nie „z AI”. Lista zakazów w sekcji 6. Akceptacja Patryka na zrzutach z komputera i telefonu. | przegląd według listy z sekcji 6 i porównanie obok trans.info |
| Redakcja | Szkic, podgląd, publikacja i poprawka artykułu w panelu w mniej niż 10 minut. Okładka do udostępnień i dane strukturalne powstają same. | próba na fikcyjnym wpisie testowym, który nie trafia na produkcję |
| Niezawodność | Build Cloudflare z `main` przechodzi tylko z zielonym `npm run check:szybki`. Gałęzie mają podgląd. Strona 410 dla usuniętych adresów. | CI i test |

## 4. Decyzje podjęte (nie wracaj do nich bez powodu)
- **Nazwa:** Rytm Hali. **Domena główna:** rytmhali.pl, a rytmhali.com przekierowuje 301 na .pl. Kupuje je Patryk.
- **Logo:** koncepcja C, czyli plakietka z dachem szedowym, litery RH, napis „RYTM HALI” i podtytuł „Produkcja · Magazyn · Dane”. Pliki są w `marka/logo/` i generuje je `generuj-logo.mjs` (tekst jako krzywe, fonty Noto na licencji OFL). Koncepcja A odpada, bo kojarzy się z TV Republika.
- **Kierunek wyglądu:** druga makieta w `makiety/` (styl nowoczesnego portalu w rodzaju trans.info):
  - białe tło, grafit `#1d2530` i `#11161d`, pomarańcz `#e8590c`;
  - fonty Noto Sans i Noto Sans Display (hostowane u siebie);
  - gęsta siatka, zdjęcia;
  - pasek „Na zmianie”, „Najczęściej czytane”; *(zmiana 2026-11-06: portal publikuje artykuły, nie wiadomości, styl magazynu w rodzaju Harvard Business Review; pasek „Na zmianie” zastąpiony paskiem tematów, bez godzin publikacji, DECYZJE.md)*
  - newsletter „Raport zmianowy”;
  - oznaczone sloty reklamowe.
- **Stack:** jak w patrykkorpyta.pl, bo jest sprawdzony:
  - Astro 7 (statyczne strony), Tailwind 4 z tokenami w CSS;
  - kolekcje treści ze schematami zod;
  - Cloudflare Workers + Assets z Workers Builds z GitHuba;
  - panel Sveltia CMS (commity do repozytorium, szkice i podgląd);
  - testy: Vitest, Playwright, axe, Lighthouse CI.

  Kod, który da się przenieść z patrykkorpyta.pl (`seo-check`, IndexNow, okładki, linki w obie strony, FAQPage, `llms.txt`, udostępnianie, 410 w workerze), przenosisz i dostosowujesz, a nie piszesz od zera.
- **Wyszukiwarka:** Pagefind (statyczny indeks, bez serwera).
- **Analityka:** Umami (osobna witryna dla rytmhali.pl), zdarzenia: zapis na newsletter, kliknięcie reklamy, udostępnienie, pobranie.
- **Komentarze:** brak na start.
- **Treści sponsorowane:** zawsze z widocznym oznaczeniem „Materiał partnera” albo „Reklama”, linki z `rel="sponsored"`, a strona partnera nie przejmuje redakcyjnej kontroli (zasady Google o nadużywaniu reputacji witryny).

## 5. Decyzje otwarte: rekomendacja domyślna i kto decyduje
Rozstrzygasz według rekomendacji, chyba że kolumna mówi „Patryk”. Każdą decyzję zapisujesz w `DECYZJE.md` z datą i uzasadnieniem.

| Decyzja | Rekomendacja | Kto |
|---|---|---|
| Struktura adresów | Artykuł `/<slug>` (płasko, bez działu w adresie, żeby zmiana działu nie zmieniała adresu). Dział `/dzial/<slug>`, temat `/temat/<slug>`, autor `/autor/<slug>`, materiał `/do-pobrania/<slug>`. | Ty |
| Formaty treści | Poradnik, Analiza, Wywiad, Raport, Wzór do pobrania, Komentarz. Format jako pole, nie jako dział. | Ty |
| Dostawca newslettera | Usługa z siedzibą i danymi w UE, z podwójnym potwierdzeniem zapisu i API (np. MailerLite albo Brevo). Formularz bez skryptu dostawcy: punkt API w workerze, a klucz jako sekret Cloudflare. | Patryk wybiera i zakłada konto. Klucz wpisuje sam (`wrangler secret put` albo panel). Ty nigdy nie widzisz ani nie wpisujesz klucza. |
| Reklamy | Kampanie sprzedawane bezpośrednio, zarządzane w CMS: slot, kreacja, link, daty, oznaczenie. Ad server (Google Ad Manager) i reklamy programatyczne dopiero po decyzji, bo wymagają zgód (CMP, IAB TCF) i obniżają wydajność. | Patryk (ad server) |
| Strona przed startem | Strona „Wkrótce” na rytmhali.pl z zapisem na newsletter (lista oczekujących), indeksowana. Cały portal na podglądzie z `noindex` do bramki startu. | Patryk zatwierdza moment startu |
| Bramka publicznego startu | Co najmniej 12 opublikowanych artykułów w co najmniej 4 działach i strony zaufania (O nas, zasady redakcyjne, korekty, oznaczanie reklam, wykorzystanie AI). | Patryk |
| Forma prawna i prawo prasowe | Przed sprzedażą pierwszej reklamy: forma działalności (działalność nierejestrowana ma limit przychodu) i ocena prawnika, czy portal wymaga rejestracji tytułu prasowego. Bez porad prawnych z Twojej strony, tylko lista pytań do prawnika. | Patryk i prawnik |
| Umowa o pracę | Przed publicznym startem Patryk sprawdza zakaz konkurencji i zgodę na działalność dodatkową. | Patryk |
| Ciemny motyw | Nie na start (koszt testów przy niewielkiej korzyści dla portalu B2B). Tokeny przygotowane. | Ty |
| Język | Tylko polski. Bez hreflang. | Ty |

## 6. Zasady wyglądu: profesjonalny portal, nie „z AI”
**Zakazy:**
- beżowe tła stron;
- duże zaokrąglone karty, czyli promień powyżej 4 px dla kart i zdjęć;
- gradientowe plamy i neonowe poświaty;
- ikonki-emoji w kafelkach;
- wyśrodkowane hasła na pustym tle;
- szare prostokąty zamiast zdjęć na produkcji;
- stockowe zdjęcia „uśmiechniętych ludzi w kaskach” patrzących w obiektyw;
- więcej niż 1 kolor akcentu;
- tekst wersalikami w tytułach;
- animacje wejścia przy przewijaniu.

**Wymagania:**
- **Hierarchia jak w redakcji:** kategoria pomarańczowymi wersalikami (małymi), tytuł w Noto Sans Display Bold, lead, metadane (data, autor, czas czytania).
- **Siatka:** szerokość 1240 px i stałe odstępy. Cienkie linie oddzielają sekcje, a nagłówki sekcji mają linię 2 px.
- **Zdjęcia:** prawdziwe, z rejestrem licencji (źródło, autor, licencja i podpis „Fot.” przy każdym zdjęciu). Na start CC0 i CC BY z rawpixel, Wikimedia, Unsplash albo Pexels, każde pobranie za zgodą Patryka. Kadrowanie 16:9, 16:10 i 1:1 przez `astro:assets` (AVIF i WebP, `srcset`).
- **Logo:** wersja jasna, ciemna, czarno-biała, ikonka (favicon 16, 32, 48 i `apple-touch-icon` 180), awatar z marginesem na koło (LinkedIn) i domyślna okładka udostępnień.
- **Strona `/styleguide`** z `noindex`: tokeny, typografia i wszystkie komponenty w stanach (hover, focus, pusty, długi tytuł). Na niej Patryk akceptuje wygląd przed budową szablonów.

## 7. Zasady nieprzekraczalne
1. **Produkcja tylko po słowie „wdrażaj”:** nic nie trafia na `main` bez zielonego `npm run check` i słowa „wdrażaj” od Patryka w bieżącej rozmowie. Funkcje powstają na gałęziach w worktree. Przed pushem sprawdź `git log origin/main..main`.
2. **Konta i sekrety:**
   - nie zakładasz kont, nie logujesz się za Patryka, nie przechodzisz CAPTCHA;
   - nie wpisujesz ani nie przechowujesz haseł, tokenów ani kluczy API;
   - gdy krok wymaga konta, zakupu lub sekretu, przygotowujesz wszystko i dajesz Patrykowi jedną krótką instrukcję z linkiem.
3. **Zakupy i działania publiczne** (domeny, płatne usługi, publikacja profili) robi Patryk albo Ty po jego wyraźnym „tak”.
4. **Dane:** zero danych, przykładów i zdjęć od pracodawców Patryka. Treści testowe są fikcyjne, oznaczone i nie trafiają do produkcji (osobna kolekcja testowa albo `draft: true`).
5. **Bez sztuczek SEO:** żadnych masowo generowanych stron, ukrytego tekstu ani kupowania linków.
6. **Node:** w każdym poleceniu najpierw `source ~/.nvm/nvm.sh`.
7. **Testujesz sam:** komputer, telefon, klawiatura, czytnik ekranu w podstawowym zakresie. Patrykowi pokazujesz zrzuty i wyniki, a nie scenariusze do klikania.
8. **Lekcje:** gdy Patryk coś poprawi albo proces zadziała inaczej, dopisz jednozdaniową lekcję z datą na końcu tego pliku.

## 8. Fazy (każda kończy się raportem i zrzutami)

### F0. Fundament (bez akceptacji)
- Repozytorium git z `.gitignore`, `README.md`, `AGENTS.md` (zasady z sekcji 7 i polecenia), `STAN.md` (gdzie jesteśmy, sprawy Patryka) i `DECYZJE.md`.
- Szkielet Astro 7, Tailwind 4, TypeScript w trybie strict.
- Skrypty `check:szybki` i `check` jak w patrykkorpyta.pl. GitHub Actions uruchamia `check` na gałęziach (z iPhonem w CI).
- `.claude/launch.json` z konfiguracją podglądu.
- **Sprawy Patryka, w jednej liście:**
  - kupno domen;
  - prywatne repozytorium na GitHubie (albo zgoda, że założysz je przez `gh` na jego koncie);
  - projekt w Cloudflare podpięty do repozytorium;
  - witryna w Umami.

### F1. System wizualny (bramka: akceptacja Patryka)
- Tokeny w CSS (kolory, typografia, odstępy, linie, cienie).
- Fonty Noto hostowane u siebie, z podzbiorem łacińskim i polskimi znakami.
- Komplet plików logo z sekcji 6.
- Komponenty:
  - nagłówek z paskiem górnym, menu działów z przewijaniem na telefonie i wyszukiwarką;
  - pasek „Na zmianie”;
  - karty w 4 wariantach: główna na zdjęciu, boczna, siatka, lista z godziną;
  - lista „Najczęściej czytane”;
  - nagłówek sekcji;
  - slot reklamowy (billboard 970×250, 750×200, prostokąt 300×250 i 300×600, mobilny 320×100 i 300×250; zawsze z podpisem „REKLAMA”);
  - pole newslettera;
  - ramka autora;
  - udostępnianie (wzór z patrykkorpyta.pl: bez skryptów serwisów);
  - okruszki, stronicowanie, stopka;
  - strona błędu.
- Strona `/styleguide` z zrzutami z komputera i telefonu do akceptacji.

### F2. Model treści i panel redakcyjny
**Kolekcje (schematy zod, bez treści):**
- **Artykuł:**
  - tytuł, tytuł SEO, lead, dział, format, tematy, autorzy;
  - daty publikacji i aktualizacji;
  - zdjęcie główne z alt, podpisem i rejestrem licencji;
  - okładka udostępnień;
  - pola sponsorowane (partner, oznaczenie, data końca kampanii);
  - źródła, FAQ, powiązane;
  - `noindex`, `draft`.
- **Autor:** imię i nazwisko, rola, bio, zdjęcie, `sameAs`.
- **Dział:** opis i kolejność.
- **Temat.**
- **Partner.**
- **Kampania reklamowa:** slot, kreacja, link, daty, cel UTM.
- **Materiał do pobrania:** plik, format, podglądy.
- **Ustawienia serwisu:** menu, pasek „Na zmianie”, teksty stałe.

**Panel Sveltia CMS:**
- polskie etykiety i podpowiedzi;
- szkice i podgląd;
- media z polami licencji;
- role na przyszłość (autor i redaktor).

**Generatory:**
- okładka udostępnień 1200×630 przy buildzie albo skryptem, wzór z patrykkorpyta.pl;
- czas czytania;
- linki w obie strony (artykuł ↔ temat ↔ dział).

**Próba:** fikcyjny wpis testowy przechodzi od szkicu do podglądu w mniej niż 10 minut. Nie trafia na produkcję.

### F3. Szablony stron
- Strona główna według makiety, z regułami doboru: najnowsze, wyróżnione ręcznie, najczęściej czytane z Umami albo ręcznie na start.
- Dział, temat, autor, artykuł z elementami:
  - spis treści przy długich tekstach;
  - śródtytuły z kotwicami;
  - tabele przewijane na telefonie;
  - rysunki z podpisem;
  - ramka materiału do pobrania;
  - źródła;
  - FAQ;
  - powiązane;
  - slot reklamowy w treści po 3. akapicie, tylko na komputerze, z zarezerwowaną wysokością.
- Wyszukiwarka (Pagefind).
- Lista i strona materiału do pobrania.
- Newsletter (zapis, potwierdzenie, wypis, archiwum na później).
- „Reklama i współpraca” (media kit z liczbami do uzupełnienia, bez zmyślonych statystyk).
- Strony stałe, 404 i 410.
- Kanał RSS dla całości i dla każdego działu.

### F4. SEO i widoczność w AI
**Podstawy:**
- adresy kanoniczne;
- mapa strony z `lastmod` z dat treści, wzór z patrykkorpyta.pl;
- `robots.txt`;
- `llms.txt` budowany z treści;
- IndexNow (klucz w repozytorium jako plik publiczny);
- stronicowanie działów z linkami;
- linkowanie wewnętrzne z bloków „Więcej z działu” i „Na ten temat”.

**Dane strukturalne:**
- `NewsMediaOrganization` (Rytm Hali) z logo, `publishingPrinciples` i `correctionsPolicy` wskazującymi na strony zaufania;
- `WebSite` z `SearchAction`;
- `NewsArticle` albo `Article` z autorem (`Person` ze stroną autora);
- `BreadcrumbList`;
- `FAQPage` z sekcji pytań;
- `DigitalDocument` dla materiałów.

Mapa strony dla Google News dopiero wtedy, gdy portal publikuje regularnie (decyzja po starcie).

**Strony zaufania (E-E-A-T):** jako projekty tekstów do akceptacji Patryka:
- O nas i redakcja;
- zasady redakcyjne;
- polityka korekt;
- oznaczanie treści sponsorowanych;
- jak używamy AI w pracy redakcyjnej (jawnie: AI pomaga, redakcja sprawdza fakty u źródła i odpowiada za tekst);
- kontakt.

**Kontrola:** `seo-check` na każdej stronie (tytuły, opisy, H1, kanoniczne, JSON-LD, alt, linki).

### F5. Zaplecze zarabiania
- Komponent slotu reklamowego czyta kampanie z CMS:
  - daty od i do, rotacja kreacji;
  - link z UTM i `rel="sponsored noopener"`;
  - podpis „REKLAMA”;
  - zdarzenia Umami (wyświetlenie i kliknięcie);
  - po końcu kampanii slot wraca do autopromocji newslettera, a nie zostaje pusty.
- Oznaczenie artykułu partnerskiego w nagłówku, na liście i w danych strukturalnych.
- Raport dla partnera: skrypt, który z Umami (API albo eksport) liczy wyświetlenia i kliknięcia kampanii. Klucz API Umami wpisuje Patryk.

### F6. Newsletter i formularze
- Formularz zapisu bez skryptu zewnętrznego: worker, potem API dostawcy, z podwójnym potwierdzeniem, ochroną przed spamem (pole-pułapka, limit żądań na IP) i jasną zgodą RODO.
- Strony: potwierdzenie, dziękujemy, wypis.
- Rekordy DNS poczty (SPF, DKIM, DMARC) dla domeny nadawcy według instrukcji dostawcy. Rekordy dodaje Patryk albo Ty po jego zgodzie w panelu Cloudflare.
- Adres `redakcja@rytmhali.pl` przez Cloudflare Email Routing (przekazywanie na skrzynkę Patryka).
- Formularz kontaktowy redakcji (worker i e-mail) z tą samą ochroną.

### F7. Prawo i zaufanie
- Projekty: polityka prywatności (administrator, cele, podstawy, odbiorcy jak dostawca newslettera, Cloudflare i Umami, prawa, okresy), regulamin newslettera i stopka redakcyjna (wydawca, redaktor naczelny, kontakt).
- Lista pytań do prawnika: prawo prasowe (rejestracja tytułu), forma działalności przy sprzedaży reklam, oznaczanie reklam, odpowiedzialność za treści partnerów.
- Bez gotowych porad prawnych z Twojej strony.

### F8. Infrastruktura i start
- **Cloudflare:**
  - domena główna z `www` albo bez (rekomendacja: bez `www`, jedno przekierowanie, HSTS);
  - przekierowanie rytmhali.com;
  - nagłówki bezpieczeństwa i pamięci podręcznej (`_headers`);
  - worker dla API formularzy i 410;
  - podglądy gałęzi chronione przed indeksacją (`X-Robots-Tag: noindex` poza produkcją).
- **Search Console** (domena przez rekord DNS TXT) i **Bing Webmaster Tools**: instrukcja dla Patryka albo kliknięcia po jego zgodzie, gdy jest zalogowany. Mapy stron zgłoszone.
- **Monitoring:**
  - test produkcji po każdym wdrożeniu (curl i Playwright);
  - prosty monitor dostępności (np. darmowy UptimeRobot, konto zakłada Patryk);
  - przegląd po 14 i 28 dniach (indeks, błędy, wydajność z danych terenowych).
- **Start w dwóch krokach:**
  1. Strona „Wkrótce” z zapisem na listę oczekujących, zaraz po F6.
  2. Pełny portal po bramce z sekcji 5, na słowo „wdrażaj”, z listą kontrolną startu: przekierowania, `noindex` zdjęty tylko z produkcji, mapa strony, RSS, Search Console, IndexNow, zrzuty.

## 9. Sposób pracy
- **Kolejność:** F0 → F1 (stop: akceptacja wyglądu) → F2 → F3 → F4 → F5 → F6 → F7 → F8. Fazy F4–F7 mogą iść równolegle na osobnych gałęziach, jeśli nie dotykają tych samych plików.
- **Gałęzie:** każda faza na gałęzi w worktree. Scalasz do `main` dopiero po zielonym `npm run check`. Przed publicznym startem `main` publikuje tylko stronę „Wkrótce” i podgląd z `noindex`.
- **Stopy na Patryka** wyłącznie przy:
  - akceptacji wyglądu (F1);
  - zakupach, kontach i sekretach;
  - tekstach stron zaufania i prawnych;
  - słowie „wdrażaj” przy każdym wdrożeniu;
  - bramce publicznego startu.

  Resztę rozstrzygasz sam według sekcji 5 i zapisujesz w `DECYZJE.md`.
- **Raport po fazie** (najwyżej 15 linijek):
  - co powstało;
  - wyniki testów (tabela z sekcji 3);
  - zrzuty: komputer, telefon, klawiatura i fokus;
  - czego nie sprawdzono i dlaczego;
  - najwyżej 3 sprawy dla Patryka.

## 10. Definicja „gotowe” dla całego promptu
- [ ] Wszystkie poprzeczki z sekcji 3 zielone i pilnowane testami w `npm run check`.
- [ ] Patryk opublikował w panelu testowy artykuł na podglądzie w mniej niż 10 minut, sam, z okładką i danymi strukturalnymi.
- [ ] Kampania reklamowa ustawiona w CMS wyświetla się w slocie, liczy kliknięcia i znika po dacie końca.
- [ ] Zapis na newsletter działa od formularza do potwierdzenia u dostawcy, bez skryptu zewnętrznego na stronie.
- [ ] Strona „Wkrótce” działa na rytmhali.pl, a pełny portal czeka na bramkę startu.
- [ ] `STAN.md` mówi, co dalej, a `DECYZJE.md` i lekcje są aktualne.

## Lekcje
<!-- RRRR-MM-DD — lekcja (jedno zdanie, dlaczego) -->
- 2026-11-06 — Pierwsza makieta (beż, duże zaokrąglone karty, same teksty) wyglądała „jak z AI”. Portal ma wyglądać jak prawdziwy serwis branżowy: zdjęcia […] *(dalsza część wpisu została ucięta przy wklejaniu promptu; do uzupełnienia przez Patryka)*.
- 2026-11-06 — Materiały marki (`marka/logo/`, `makiety/`) i pamięć projektu były tylko na komputerze Patryka, więc sesja w chmurze ich nie widziała; wszystko, czego potrzebuje kolejna sesja, trzymamy w repozytorium.
- 2026-11-06 — Astro 7 nie uruchamia drugiego `astro preview`, gdy pierwszy już działa (blokada), więc Playwright i Lighthouse startują podgląd z `--ignore-lock`.
- 2026-11-06 — CSP z hashami w `<meta>` blokuje atrybuty `style=""`, więc wymiary i kolory zależne od danych idą przez klasy CSS, a kontrola SEO pilnuje, żeby `style=""` nie wróciło.
- 2026-11-06 — Kolor marki `#e8590c` ma na białym tylko 3,58:1, więc mały tekst w akcencie używa ciemniejszego odcienia tego samego tonu `#c2410c` (test tokenów pilnuje obu warunków).
- 2026-11-06 — Patryk dopuścił darmowe licencje Unsplash i Pexels (z podpisem „Fot.”) i powierzył wybór zdjęć redakcji, bo na CC0 i CC BY brakuje zdjęć tablic lean i magazynów bez logo; reguła w AGENTS.md (pkt 9).
- 2026-11-06 — Wyszukiwarki Unsplash i Pexels blokują automaty, a ich API wymaga klucza z konta, więc zdjęcia z tych serwisów wymagają klucza od Patryka; do tego czasu źródłem jest Openverse (CC0 i CC BY, także rawpixel) i Wikimedia Commons.
- 2026-11-06 — Wikimedia odcina zbyt częste pobieranie (HTTP 429) dla całego adresu sesji, więc zdjęcia pobiera jeden skrypt w spokojnym tempie (`npm run zdjecia`), a nie agenci z wieloma równoległymi zapytaniami.
- 2026-11-06 — opentype.js 2.0 przy części rozmiarów zapisuje współrzędne jako NaN (`toPathData`), więc logo ma własną serializację ścieżek i test, który wyklucza NaN w plikach SVG.
- 2026-11-06 — Patryk: Rytm Hali publikuje artykuły, nie wiadomości („bardziej jak Harvard Business Review”), więc bez godzin publikacji i bez paska wiadomości; zamiast „Na zmianie” pasek tematów, na kartach dział, format, autor i czas czytania.
- 2026-11-06 — Astro 7 renderuje Markdown silnikiem Sätteri, który pomija wtyczki z `markdown.rehypePlugins`, więc wtyczki serwisu mają API Sätteri (`src/lib/markdown.mjs`) i testy na prawdziwym silniku, a nie na ręcznie zbudowanym drzewie.
- 2026-11-06 — Sveltia CMS odrzuca względny `public_folder` (np. `../../assets`), a Astro w `image()` przyjmuje ścieżkę od katalogu projektu (`/src/assets/…`), więc panel zapisuje zdjęcia w tej postaci; przed decyzją sprawdzone buildem, także przypadek brakującego pliku.
- 2026-11-06 — Moduły czytające pliki względem `import.meta.url` psują się przy buildzie, bo kod ląduje w `.astro/.prerender/chunks`, więc pliki z repozytorium czytamy względem katalogu projektu (`process.cwd()`).
- 2026-11-06 — Patryk: treści oparte na faktach i badaniach, ze zdjęciem z otwartej licencji, lepsze niż HBR, więc powstał skill `/artykul` z przypisami przy każdej liczbie, niezależną weryfikacją faktów i kartą jakości, a kontrola tekstu działa w CI.
- 2026-11-06 — Przepisy z pamięci bywają nieaktualne (dawny art. 14 ust. 2 Prawa prasowego jest uchylony, autoryzację reguluje art. 14a), więc każdy przepis w skillu i w tekstach sprawdzamy w aktualnym tekście jednolitym przez API Sejmu.
- 2026-11-06 — Prompt wymaga, żeby przed startem `main` publikował tylko „Wkrótce”, a testy muszą sprawdzać szablony na treści, więc są cztery tryby budowania (produkcja przed startem, podgląd, build testowy z fikcyjnymi treściami, produkcja po starcie) i `npm run check` sprawdza zarówno portal, jak i to, co naprawdę trafi na `main`.
- 2026-11-06 — Pagefind nie ma polskiej odmiany i dopasowuje krótkie słowa jako rdzenie, więc wyniki wyszukiwania filtrujemy po wspólnym początku słowa; bez tego „politechnika” znajdowała wszystkie teksty ze słowem „po”.

- 2026-11-06 — Patryk nie chce oznaczeń użycia AI przy tekstach i oczekuje maksimum przyjemności z czytania i wartości dla czytelnika, więc skill `/artykul` ma rzemiosło pisania, redaktora językowego i czytelnika testowego, a zwolnienie z oznaczania (art. 50 ust. 4 AI Act) opiera się na tym, że Patryk jako redaktor naczelny czyta i zatwierdza każdy tekst przed publikacją.
- 2026-11-06 — Na zrzucie z telefonu jednoliterowe „w” i „i” zostawały na końcu wiersza, a „e-commerce” łamało się na dywizie, więc serwis ma polską typografię w treści i w tytułach (`src/lib/typografia.mjs`); zrzuty z telefonu oglądamy także pod kątem składu, nie tylko układu.
- 2026-11-06 — Astro czyści pamięć treści (`node_modules/.astro/data-store.json`) tylko po zmianie konfiguracji, a kod wtyczek Markdowna do niej nie wchodzi, więc lokalne buildy pokazywały HTML sprzed zmiany wtyczki; skrót plików wtyczek jest teraz w konfiguracji, a wynik zmiany wtyczki sprawdzamy w zbudowanym HTML, nie tylko w teście jednostkowym.
- 2026-11-07 — Patryk chciał, żebym w jego imieniu działał w panelach OVH i Cloudflare przez wbudowaną przeglądarkę, ale sesja w chmurze jej nie ma (działa tylko w sesji na jego komputerze w aplikacji Claude), więc przy krokach w panelach od razu dajemy krótką listę kliknięć i sprawdzamy wynik publicznie (DNS, test produkcji), a hasła i kody logowania zawsze wpisuje Patryk.
- 2026-11-07 — Podzbiór fontów serwisu nie ma znaku minus (U+2212), więc PDF-y do pobrania generujemy z pełnych fontów źródłowych, a generator sam sprawdza, czy treść nie nachodzi na stopkę.
- 2026-11-07 — Skill /artykul ma „Budżet pracy”: limit rund weryfikacji (najwyżej dwóch czytelników testowych, potem decyzja Patryka), czytelnika konspektu przed pisaniem, zamrożoną specyfikację narzędzia, triage uwag i tańszy model dla ról bez oceny źródeł, bo tekst o prognozach kosztował blisko miliona tokenów na rundę, a Patryk chce tej samej jakości szybciej i taniej.
- 2026-11-07 — Przy trzech tekstach pisanych naraz sześciu czytelników testowych dało po 6/10 za przyjemność z tego samego powodu (środek gęsty od opisów badań, praktyka w drugiej połowie), a teksty powtarzały tę samą ramę otwarcia; w planie tekstu część praktyczna idzie przed przeglądem dowodów, które skracamy do wniosku, a przy kilku tekstach naraz każdy dostaje inną ramę otwarcia i zakończenia.
- 2026-11-09 — Patryk: „Ludzie lubią obrazy!”, więc teksty dostają więcej wartościowych elementów wizualnych (wykresy, schematy procesu, tabele-ściągi, karty do skopiowania), zwykle 3–6 w Poradniku, jeden na 300–400 słów, zamiast dawnego limitu 3–4; każdy niesie treść, ma tytuł-wniosek, źródło albo oznaczenie fikcji i działa na telefonie (styl.md, „Elementy tekstu”).
- 2026-11-09 — Wikimedia Commons i duże rozmiary z Flickra odpowiadały 429 przez kilka godzin, kiedy teksty były już gotowe, więc plik zdjęcia i metadane licencji pobieramy zaraz po wyborze (krok 5 przed weryfikacją), a nie na końcu; na 429 czekamy, nie obchodzimy limitu.
- 2026-11-11 — Patryk: więcej wykresów, diagramów, schematów, tabel i map, „zawsze dawaj dużo”, więc skill /artykul wymaga w Poradniku i Analizie co najmniej 6 elementów wizualnych co najmniej czterech rodzajów, a liczby z badań pokazuje obrazem; wspólne generatory w `redakcja/wspolne/wykresy.mjs`.
- 2026-11-11 — Przy narzędziach z przepisami zawsze sprawdzaj w API Sejmu akty zmieniające po dacie tekstu jednolitego i datę wejścia w życie (entryIntoForce), bo tekst jednolity bywa nieaktualny, a nowy przepis może jeszcze nie obowiązywać (§ 30a o upale ogłoszony w lipcu 2026 r., w mocy od 11 stycznia 2027 r.).
- 2026-11-11 — Lokalny check jest bez WebKita, więc po każdym wdrożeniu sprawdzaj wynik CI na GitHubie (iPhone): zmiana strony głównej zepchnęła slot reklamowy poniżej pierwszego ekranu iPhone'a i test leniwie ładowanej kreacji padał w CI przez kilka wdrożeń, zanim to zauważyłem.
- 2026-11-11 — Formularze narzędzi przechodzą przez typografię (twarde spacje po „z”, „w”, „§” i przed jednostkami), więc w testach E2E etykiety dopasowujemy wyrażeniem z `\s` albo dokładnym tekstem z `getByLabel`, a nie wyrażeniem ze zwykłą spacją.
- 2026-11-12 — Pliki przygotowane w brudnopisie kopiuj do repozytorium przez `cp -n` i sprawdzaj `git status` (M zamiast ??), bo nowy test `narzedzie-wolne.spec.ts` nadpisał test narzędzia „wolne na dziecko” o tej samej nazwie i kontrola przeszła bez niego.
- 2026-11-12 — CI na GitHubie ma `cancel-in-progress`, więc push na main częściej niż co ~8 minut anuluje poprzedni przebieg przed testem na iPhonie; między wdrożeniami czekaj na koniec przebiegu albo sprawdzaj, że ostatni przebieg zakończył się sukcesem.
- 2026-11-12 — Typografia wstawia twarde spacje tylko w HTML z Astro: tekst ustawiany skryptem w przeglądarce potrzebuje `\u00a0` wpisanego ręcznie w literałach (zamiana masowa w skrypcie zepsuła raz identyfikator `const dB`), a testy E2E dopasowują etykiety z „z”, „w”, „u” i liczbami przez `\s` albo krótszy fragment.
- 2026-11-12 — Data z `dataPoPolsku` kończy się „r.”, więc zdanie po niej nie dostaje drugiej kropki; kontrola SEO blokuje teraz „r..” w tekście strony (dwie strony narzędzi i dwa opisy do kalendarza miały ten błąd).
- 2026-11-12 — Osiem równoległych sesji z wieloma podagentami wyczerpało 5-godzinny limit API konta w 20 minut i przerwało pracę w połowie, więc zespoły fabryki startują falami, mają najwyżej 3 podagentów naraz, a przy limicie zapisują stan WIP na swojej gałęzi i same planują wznowienie (prompty/02-fabryka.md).
- 2026-11-12 — Sesja zatrzymana limitem API nie wykona już żadnego polecenia, więc „zapisz WIP przy limicie” nie działa: o 17:31 trzy zespoły straciły niezatwierdzoną pracę; zespoły zatwierdzają i wypychają gałąź po każdym kroku, a wznowienia planuje orkiestrator na następne okno limitu.
- 2026-11-12 — Scalanie `union` zgubiło zamknięcie wpisu (`sprawdzono`, `},`, `{`), gdy dwie gałęzie dopisały wpisy w tym samym miejscu rejestru; po każdym scaleniu najpierw `npx tsc --noEmit -p .` (zduplikowane pole `slug` wychodzi od razu), dopiero potem pełny check.
- 2026-11-13 — Strona narzędzia jest budowana raz, a czytana miesiącami: każda wartość z dnia budowania (data, rok, miesiąc, „najbliższa” wypłata) musi się przestawiać w przeglądarce (`src/lib/narzedzia/dzis-w-formularzu.ts`), a każda kwota ogłaszana okresowo ma termin pilnowany testem w `rejestr.test.ts` (audyt znalazł ponad 30 narzędzi z wartościami z dnia budowania i brak kwoty GUS za III kwartał).
- 2026-11-13 — Status „review ready” sesji zespołu nie znaczy „gotowe”: zespół uprawnień zatrzymał się na limicie z niedokończonymi poprawkami po weryfikacji i bez pełnego checku, więc przed scaleniem czytam raport końcowy (najtaniej przez podagenta) i scalam tylko gałąź z raportem i zielonym checkiem.
- 2026-11-13 — Kompresja HTML w Astro usuwa łamanie wiersza przed `<a>`, więc słowo przed linkiem zaczynającym nowy wiersz szablonu skleja się z nim; link piszę w tym samym wierszu co tekst przed nim, a kontrola SEO blokuje wzorzec „litera<a”.
- 2026-11-13 — Hasło wzięte z podpowiedzi Google nie jest jeszcze dobrym hasłem: „fundusz socjalny”, „wyrównanie wynagrodzenia” czy „kierowca zawodowy” to prawdziwe zapytania, ale o inną sprawę niż ta, na którą odpowiada narzędzie, a test zapytań złożony z kopii haseł tego nie wykryje; zapytania testowe biorę z podpowiedzi spoza haseł i dodaję kontrolki negatywne.
