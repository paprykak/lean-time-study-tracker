# Terminy, runda 3: linijka praktyczna pod datą „Zdąż do” (przepisy i orzeczenia)

Stan na 2026-11-15. Badacz prawa zespołu „terminy3”. To jest uzupełnienie `raporty/terminy/PRZEPISY.md` (runda 1) i `raporty/terminy2/PRZEPISY.md` (runda 2). Nie powtarzam pełnych cytatów z tamtych plików. Tam, gdzie tylko potwierdzam, podaję odesłanie.

**Kopie źródeł:** `.cache/narzedzia/prawo/terminy3/` (poza repozytorium, katalog w `.gitignore`). Są tam: PDF i tekst z API Sejmu (`kpc.txt`, `pp.txt`, `kpa.txt`, `dw.txt`, `2026_854.txt`, `2026_1474.txt`, `rozp503.txt`, `r_2023_607.txt`, `r_2026_456.txt`), metadane `meta_*.json`, nowelizacje w `nowel/` i uzasadnienia sądów powszechnych w `orzeczenia-ms/`. Nazwa pliku w `orzeczenia-ms/` to id dokumentu w Portalu Orzeczeń MS, adres: `https://orzeczenia.ms.gov.pl/content/$N/<id>`. Skrypt wyszukiwania w Portalu MS: `/tmp/claude-0/-home-user-lean-time-study-tracker/5694ca6a-84a2-50ca-b985-6e131433d479/scratchpad/ms/szukaj.sh "<fraza>" <plik>`. Wysyła on formularz `search.advancedsearchform` (pole `phrase`).

**Dostępność źródeł orzeczeń (2026-11-15):**
- **SAOS:** strona „Przerwa techniczna” przy każdej próbie. Próby: ok. 10:30 UTC `all="165 § 2" "placówce pocztowej" niedzielę&courtType=SUPREME`, ok. 10:55 `caseNumber=III CZP 21/23`, 11:11 `all="165 § 2" przedawnienia&courtType=SUPREME`; każda trwała ok. 16 s i dawała HTTP 200 ze stroną przerwy. **W tej rundzie nie ustaliłem żadnego id SAOS.** Orzeczenia SN znam tylko z przytoczeń w uzasadnieniach sądów powszechnych i tak je oznaczam.
- **sn.pl, PIP:** nie próbowałem (blokują automaty).
- **www.gov.pl:** połączenie zerwane (curl: „Connection reset by peer”, proxy: `ws_closed_mid_exchange`), WebFetch dostał HTTP 503. Nie obchodziłem blokady.
- **Portal Orzeczeń MS:** działa. Wszystkie cytaty z sądów powszechnych przeczytałem w pełnym tekście.

---

## 1. Art. 165 § 2 KPC, operator wyznaczony, nadanie w dzień wolny

### Brzmienie (sprawdzone ponownie)
**KPC, t.j. Dz.U. 2026 poz. 468** (obwieszczenie z 27.03.2026; `https://api.sejm.gov.pl/eli/acts/DU/2026/468/text.pdf`):
- **Art. 165 § 1.** „Terminy oblicza się według przepisów prawa cywilnego.”
- **Art. 165 § 2.** „Oddanie pisma procesowego w polskiej placówce operatora świadczącego pocztowe usługi powszechne na terytorium Rzeczypospolitej Polskiej albo w zagranicznej placówce pocztowej operatora świadczącego pocztowe usługi powszechne na terytorium innego państwa członkowskiego Unii Europejskiej jest równoznaczne z wniesieniem tego pisma do sądu.”
- **Odpowiedź na pytanie o słowa:** KPC mówi **„operatora świadczącego pocztowe usługi powszechne”**, nie „operatora wyznaczonego”. Słów „operatora wyznaczonego” używają **art. 57 § 5 pkt 2 KPA** i art. 12 § 6 pkt 2 Ordynacji. Pełne brzmienie z KPA, t.j. Dz.U. 2025 poz. 1691: „nadane w polskiej placówce pocztowej operatora wyznaczonego w rozumieniu ustawy z dnia 23 listopada 2012 r. – Prawo pocztowe albo placówce pocztowej operatora świadczącego pocztowe usługi powszechne w innym państwie członkowskim Unii Europejskiej, Konfederacji Szwajcarskiej albo państwie członkowskim Europejskiego Porozumienia o Wolnym Handlu (EFTA) – stronie umowy o Europejskim Obszarze Gospodarczym;”. W metadanych KPA DU/2025/1691 nie ma klucza „Nowelizacje po tekście jednolitym”.
- **Nowelizacje KPC po t.j.** (metadane: DU/2026/830, 473, 1296, 1046, 1003): przeczytałem przepisy zmieniające KPC w każdej z nich.
  - 830 (art. 18): zmienia tylko art. 4¹.
  - 473 (art. 2): zmienia art. 63¹, 63², 398², 460, 461, 465, 476 oraz dodaje art. 477¹c, 477¹d i oddział o art. 477⁷b–477⁷g.
  - 1296 (art. 2): zmienia art. 17.
  - 1046 (art. 2): zmienia art. 47, 461 § 1¹ i dodaje art. 477⁶a.
  - 1003 (art. 115): zmienia przepisy o sprawach z zakresu sztucznej inteligencji (art. 479⁸⁸ⁱ itd.).
  - **Żadna nie zmienia art. 165 ani art. 477⁹.**

**Prawo pocztowe, t.j. Dz.U. 2026 poz. 558** (bez „Nowelizacji po tekście jednolitym”):
- **Art. 3 pkt 13:** „operator wyznaczony – operatora pocztowego obowiązanego do świadczenia usług powszechnych;”. Więc „operator świadczący pocztowe usługi powszechne” z KPC to w Polsce ten sam podmiot co operator wyznaczony.
- **Art. 46 ust. 1:** „Do świadczenia usług powszechnych na terytorium całego kraju jest obowiązany operator wyznaczony.”
- **Art. 71 ust. 1:** „Operator wyznaczony jest wybierany na okres 10 lat przez Prezesa UKE, w drodze decyzji, spośród operatorów pocztowych wyłonionych w drodze konkursu ogłaszanego przez Prezesa UKE.”
- Art. 3 pkt 15 (placówka pocztowa, także agenta pocztowego) i art. 46 ust. 2 pkt 5 (co najmniej 5 dni w tygodniu, bez dni ustawowo wolnych): cytaty w rundzie 2, sekcja 7. **Ustawa nie każe otwierać placówek w soboty, niedziele ani święta.**

### Kto jest operatorem wyznaczonym (listopad 2026)
- **Poczta Polska S.A., na lata 2026–2035.** Podstawa: decyzja Prezesa UKE z 28.11.2025 z rygorem natychmiastowej wykonalności.
- **Źródła, które przeczytałem, nie są urzędowe.** Komunikat Poczty Polskiej (wersja angielska, „Updated on: December 1, 2025”, `https://www.poczta-polska.pl/en/news/prezes-uke-zdecydowal-poczta-polska-operatorem-wyznaczonym-do-2035-roku/`) mówi: „for a period of 10 years, i.e. in the years 2026-2035” i cytuje decyzję: „I hereby declare this decision immediately enforceable”. Komunikat podaje 28 listopada jako datę pisma, które dostała spółka.
- **Źródło urzędowe: nie znalazłem i nie przeczytałem.** Nie mam tekstu decyzji, komunikatu UKE w BIP ani tekstu komunikatu Ministerstwa Aktywów Państwowych (`https://www.gov.pl/web/aktywa-panstwowe/poczta-polska-operatorem-wyznaczonym-do-2035-r`: 503 lub zerwane połączenie). Wyszukiwarka przypisuje tej stronie zdanie „Poczta Polska od 1 stycznia 2026 r. do 31 grudnia 2035 r. będzie operatorem wyznaczonym”, ale sam tego nie odczytałem.
- **Do linijki:** pisać „w placówce Poczty Polskiej”, ewentualnie „(operator wyznaczony)”.

### Czy nadanie w sobotę, niedzielę lub święto jest skuteczne
- **Z tekstu:** art. 165 § 2 KPC nie wiąże skutku z dniem tygodnia ani z dniem roboczym. Liczy się samo „oddanie pisma” w placówce operatora. Art. 165 § 1 i art. 115 KC przesuwają tylko koniec terminu, a nie zakazują działania w dniu wolnym.
- **Orzeczenia o nadaniu w niedzielę lub święto: nie znalazłem.**
  - Zapytania w Portalu MS: `"nadany w niedzielę"`, `"nadane w niedzielę"`, `"nadała w niedzielę"`, `"czynnej w niedzielę"`: 0 wyników. `"165 § 2 k.p.c." "w niedzielę" "nadan"`: 0.
  - `"w niedzielę" "165 § 2" "placówce"`: 4 wyniki. Żaden nie dotyczy nadania w niedzielę: VII ACa 63/17 dotyczy terminu kończącego się w niedzielę, a II Ca 1028/23 zarzutu, że data wypadła w niedzielę (24.03.2022 to czwartek).
  - SAOS: niedostępny.
- **Przytoczenie SN o wymaganiach dowodowych** (nie o dniu tygodnia). Sąd Apelacyjny w Białymstoku, I ACa 956/17, wyrok z 6.02.2018, id `150500000000503_I_ACa_000956_2017_Uz_2018-02-06_002`, streszcza wyrok SN z 12.10.2017 wydany w tej sprawie (sygnatury SN w tekście nie ma): „Sąd Najwyższy za zasadny uznał zarzut naruszenia art. 165 § 2 k.p.c., wskazując, że z mocy tego przepisu oceny wymaga nie wysoki stopień prawdopodobieństwa daty nadania przesyłki – jak przyjął Sąd Apelacyjny - ale jednoznaczne ustalenie daty oddania pisma procesowego w polskiej placówce pocztowej i to wyłącznie operatora publicznego wyznaczonego do pełnienia takich obowiązków przepisami ustawy Prawo pocztowe. Tylko oddanie pisma w taki sposób jest równoznaczne z mocy art. 165 § 2 k.p.c. z wniesieniem go do sądu.” Wniosek praktyczny: trzeba **zachować potwierdzenie nadania**, a list wysłany przez innego przewoźnika (kuriera, InPost) nie korzysta z art. 165 § 2.
- **Przytoczenie SN o adresie sądu.** Sąd Apelacyjny w Gdańsku, III AUz 426/15, 16.09.2015, id `151000000001521_III_AUz_000426_2015_Uz_2015-09-16_001`: „Tożsame stanowisko zajął Sąd Najwyższy w postanowieniu z dnia 3 października 2000 r. (I CKN 967/00, LEX nr 511971), wskazując, że oddanie pisma w urzędzie pocztowym po myśli art. 165 § 2 k.p.c. jest równoznaczne z wniesieniem go do sądu jedynie wówczas, gdy przesyłka skierowana jest pod adresem właściwego sądu.”
- **Wniosek:** prawnie nadanie w placówce Poczty Polskiej w sobotę, niedzielę lub święto jest skuteczne (wprost z tekstu art. 165 § 2). Orzeczenia SN, które by to potwierdzało wprost, nie mam (SAOS niedostępny). Faktycznie czynnych placówek w te dni jest mało (runda 2, sekcja 7: art. 6 ust. 1 pkt 7 ustawy o ograniczeniu handlu pozwala je otworzyć, ale nie nakazuje). Stąd zastrzeżenie „jeśli jest czynna” w linijce jest konieczne.

---

## 2. Przedawnienie: czy pozew nadany w placówce przerywa bieg z dniem nadania

### Przepisy (potwierdzenie z rund 1 i 2)
- **Art. 291 § 1 Kp** (t.j. Dz.U. 2026 poz. 1245): „Roszczenia ze stosunku pracy ulegają przedawnieniu z upływem 3 lat od dnia, w którym roszczenie stało się wymagalne.”
- **Art. 295 § 1 Kp:** cytatu nie pobierałem w tej rundzie; mówi o przerwaniu biegu przedawnienia przez czynność przed sądem, jak art. 123 § 1 pkt 1 KC. Do potwierdzenia z t.j. 2026/1245 przez budowniczego.
- **Art. 123 § 1 pkt 1 KC** (t.j. Dz.U. 2026 poz. 795; dosłownie w rundzie 1): bieg przedawnienia przerywa „każda czynność przed sądem (…) przedsięwzięta bezpośrednio w celu dochodzenia (…) roszczenia”.
- **III CZP 21/23** (uchwała 7 sędziów SN z 22.05.2024): „art. 115 k.c. nie ma zastosowania do upływu terminu przedawnienia” (runda 2, sekcja 2).

### Orzeczenia (Portal MS; SAOS niedostępny)
Zapytania: `"przerwanie biegu przedawnienia" "art. 165 § 2"` (19 wyników), `"Sąd Najwyższy" "165 § 2 k.p.c." "przerwania biegu przedawnienia" "nadania"` (12), `"art. 165 § 2 k.p.c." "art. 123 § 1 pkt 1 k.c." "nadania"` (19), `"165 § 2 k.p.c." "art. 291"` (2). **Wszystkie przeczytane uzasadnienia przyjmują przerwanie z dniem nadania.** Rozstrzygnięcia SN wprost o tym nie znalazłem.
- **Sąd Apelacyjny w Warszawie, VI ACa 1552/13, wyrok z 25.07.2014**, id `154500000003003_VI_ACa_001552_2013_Uz_2014-07-25_001`. Sąd odpiera zarzut, że art. 165 § 2 „ma zastosowanie do terminów prawa procesowego, a nie materialnego”: „Według utrwalonego w piśmiennictwie stanowiska w przypadku przerwania biegu przedawnienia przez wytoczenie powództwa bieg terminu przerywa się w dniu wniesienia pozwu, ponieważ ustawodawca wiąże ten skutek z czynnością wierzyciela, a nie sądu, np. doręczeniem pozwu (…). Pozew wywołuje skutki prawne od chwili wniesienia, a więc zgodnie z art. 165 § 2 k.p.c. od momentu złożenia pisma w sądzie albo oddania w polskiej placówce pocztowej operatora publicznego (…). W konsekwencji zarzut przedawnienia dochodzonego przez powódkę roszczenia okazał się nieusprawiedliwiony z uwagi na skuteczne przerwanie biegu przedawnienia wniesieniem pozwu o zapłatę kary umownej.” (Ten sam wyrok zmienił rozstrzygnięcie z innych przyczyn; ta część stoi.)
- **Sąd Apelacyjny w Warszawie, V ACa 1254/17, wyrok z 9.05.2018**, id `154500000002503_V_ACa_001254_2017_Uz_2018-05-09_002`: „bieg terminu przedawnienia został przerwany w związku z wytoczeniem niniejszego powództwa – a zatem z dniem 28 czerwca 2016 r. (data nadania pisma inicjującego postępowanie u operatora wyznaczonego, co w związku z treścią art. 165 § 2 k. p. c. jest równoznaczny z wniesieniem tego pisma do sądu).”
- **Sąd Rejonowy w Gdyni, VI GC 2924/15, wyrok z 19.07.2017**, id `151015150003027_VI_GC_002924_2015_Uz_2017-08-21_002`: „Nie ma przy tym wątpliwości, że pozew jest pismem procesowym, a zatem wniesienie go do sądu – podobnie jak wszystkich innych pism procesowych – może nastąpić w sposób określony w art. 165 § 2 k.p.c. Uznać więc należało, że do przerwania biegu przedawnienia doszło z chwilą nadania niniejszego pozwu na poczcie.”
- **Na tle Kp: Sąd Apelacyjny w Gdańsku, III APa 2/16, wyrok z 16.03.2016**, id `151000000001521_III_APa_000002_2016_Uz_2016-03-16_001`. Sąd relacjonuje ustalenie sądu I instancji (nie rozważa go sam): „pozew w sprawie został wniesiony w trybie art. 165 § 2 k.p.c. w dniu 24 października 2013 r., wobec czego roszczenie dotyczące okresu, odnośnie którego świadek ten mógłby zeznać, a więc do września 2010 r., uległo niewątpliwie w myśl art. 291 § 1 k.p. przedawnieniu w związku z upływem 3 lat.” Granicą przedawnienia był tu dzień nadania.
- **Termin zawity prawa materialnego, ta sama reguła:** Sąd Apelacyjny w Warszawie, VII ACa 63/17, 6.12.2017, id `154500000003527_VII_ACa_000063_2017_Uz_2017-12-06_002`: „datą wniesienia pozwu lub wniosku o zawezwanie do próby ugodowej jest data nadania w placówce pocztowej operatora publicznego przesyłki, zawierającej tego rodzaju pismo (art. 165 § 2 k.p.c.).”

### Wniosek
Pozew nadany w placówce Poczty Polskiej przerywa bieg przedawnienia z dniem nadania. Tak przyjmują jednolicie sądy powszechne w przeczytanych uzasadnieniach (także przy art. 291 Kp). Brakuje mi orzeczenia SN wprost. Skoro po III CZP 21/23 koniec przedawnienia nie przesuwa się z dnia wolnego, to przy „Zdąż do” w niedzielę lub święto **jedyny sposób działania w tym dniu to nadanie w czynnej placówce Poczty Polskiej**. Zastrzeżenie o wątpliwym przesunięciu z art. 115 KC jest więc trafne.

---

## 3. Odwołanie od decyzji ZUS

### Przepisy
**KPC, t.j. 2026/468, bez zmian po t.j.:**
- **Art. 477⁹ § 1.** „Odwołania od decyzji organów rentowych lub orzeczeń wojewódzkich zespołów do spraw orzekania o niepełnosprawności lub decyzji wydanych przez ten zespół, wnosi się na piśmie do organu lub zespołu, który wydał decyzję lub orzeczenie, lub do protokołu sporządzonego przez ten organ lub zespół, w terminie miesiąca od dnia doręczenia decyzji lub orzeczenia.”
- **Art. 477⁹ § 2.** „Organ rentowy lub wojewódzki zespół do spraw orzekania o niepełnosprawności niezwłocznie, niepóźniej niż w terminie trzydziestu dni od dnia, w którym otrzymał odwołanie, przekazuje je wraz z aktami sprawy do sądu. (…)”
- **Art. 477⁹ § 3.** „Sąd odrzuci odwołanie wniesione po upływie terminu, chyba że przekroczenie terminu nie jest nadmierne i nastąpiło z przyczyn niezależnych od odwołującego się.”
- (§ 2¹ zmienia się 1.01.2027: ustawa z 18.12.2025, Dz.U. 2026 poz. 26, art. 3 pkt 2 lit. a, odnośniki 61–62 w t.j. Nie dotyczy terminu.)

**Ustawa o systemie ubezpieczeń społecznych, t.j. Dz.U. 2026 poz. 1474** (obwieszczenie z 9.10.2026, stan prawny na 4.10.2026; zastępuje t.j. 2026/199; metadane bez „Nowelizacji po tekście jednolitym”):
- **Art. 83 ust. 2.** „Od decyzji Zakładu przysługuje odwołanie do właściwego sądu w terminie i według zasad określonych w przepisach Kodeksu postępowania cywilnego.”
- **Art. 83 ust. 5.** „Odwołanie wnosi się na piśmie do jednostki organizacyjnej Zakładu, która wydała decyzję, lub do protokołu sporządzonego przez tę jednostkę.”
- **Art. 83 ust. 7.** „Jeżeli odwołanie nie zostało w całości lub w części uwzględnione, Zakład przekazuje niezwłocznie, niepóźniej niż w terminie 30 dni od dnia wniesienia odwołania, sprawę do sądu wraz z uzasadnieniem.”

### Orzeczenia (Portal MS; SAOS niedostępny)
Zapytania: `"odwołanie" "organ rentowy" "165 § 2" "placówce pocztowej"` (3), `"477 9 § 3" "165 § 2"` (2), `"odwołanie od decyzji" "data stempla pocztowego" "477"` (45), `"odwołania od decyzji" "nadane w placówce pocztowej"` (8), `"odwołanie od decyzji" "jest pismem procesowym"` (17), `"wniesienia odwołania" "organu rentowego" "w placówce pocztowej" "Sąd Najwyższy"` (19). Zapytanie SAOS `all="odwołanie" "organ rentowy" "165 § 2"&courtType=SUPREME` nie przeszło (przerwa).
- **Sąd Apelacyjny w Gdańsku, III AUz 11/18, postanowienie z 24.01.2018**, id `151000000001521_III_AUz_000011_2018_Uz_2018-01-24_001`: „W związku z powyższym odwołanie wniesione w sprawie przez skarżących w dniu 9 stycznia 2015 r. (data nadania w polskiej placówce pocztowej operatora wyznaczonego) jest odwołaniem złożonym w terminie i winno podlegać merytorycznemu rozpoznaniu. Zatem odrzucając odwołanie Sąd Okręgowy uchybił art. 477⁹ (…)”.
- **Sąd Okręgowy w Gdańsku, VII U 2743/12, postanowienie z 14.11.2013**, id `151015000003521_VII_U_002743_2012_Uz_2013-11-14_001`: „Odwołanie z datą 13 lutego 2012 r. od powyższej decyzji wnioskodawczyni wniosła w dniu 17 lutego 2012 r. (data stempla pocztowego – k. 4 akt rentowych – zgodnie z art. 165 § 2 k.p.c.)”. Odwołanie było adresowane do ZUS (akta rentowe), a sąd liczył termin z art. 477⁹ od daty stempla.
- **Charakter odwołania; SN tylko z przytoczenia:** Sąd Apelacyjny w Łodzi, III AUa 1112/13, postanowienie z 3.04.2014, id `152500000001521_III_AUa_001112_2013_Uz_2014-04-03_001`: „Wszczynające postępowanie sądowe odwołanie od decyzji organu rentowego pełni rolę pozwu. (por. postanowienie Sądu Najwyższego z dnia 19 czerwca 1998 r., II UKN 105/98, Legalis). Odwołanie jest pismem procesowym i w związku z tym powinno odpowiadać warunkom formalnym pisma procesowego określonym w art. 126 i n.”
- **Adres:** III AUz 426/15 (cytat z I CKN 967/00 w pyt. 1): skutek z art. 165 § 2 tylko przy przesyłce zaadresowanej do właściwego adresata. Tu właściwym adresatem jest jednostka ZUS, która wydała decyzję (art. 477⁹ § 1, art. 83 ust. 5).

### Wniosek
Odwołanie jest pismem procesowym (II UKN 105/98 w przytoczeniu), więc nadanie w placówce Poczty Polskiej, zaadresowane do jednostki ZUS, która wydała decyzję, zachowuje miesięczny termin z dniem nadania. Tak przyjmują sądy powszechne w przeczytanych uzasadnieniach (III AUz 11/18, VII U 2743/12). Orzeczenia SN wprost nie czytałem (SAOS niedostępny). Dodatkowy bufor bezpieczeństwa daje art. 477⁹ § 3, ale nie wolno na nim opierać linijki.

---

## 4. Zastrzeżenia do protokołu kontroli zwolnienia lekarskiego (ZUS albo płatnik)

### Przepisy
**Ustawa z 25.06.1999 o świadczeniach pieniężnych z ubezpieczenia społecznego w razie choroby i macierzyństwa, t.j. Dz.U. 2026 poz. 854** (obwieszczenie z 19.06.2026, stan prawny na 17.06.2026; obejmuje zmianę z ustawy z 18.12.2025, Dz.U. 2026 poz. 26). Art. 68–68g dodał art. 13 pkt 9 ustawy 2026/26 (odnośnik 32). Według art. 43 ustawy 2026/26 ten przepis wszedł w życie z ogólnym terminem „po upływie 3 miesięcy od dnia ogłoszenia”: ogłoszenie 12.01.2026, w życie **13.04.2026** (metadane). Przepis przejściowy, art. 42 ustawy 2026/26: „Do postępowań w sprawie przeprowadzania kontroli prawidłowości wykorzystywania zwolnień od pracy zgodnie z ich celem oraz formalnej kontroli zaświadczeń lekarskich, o których mowa w art. 68 ustawy zmienianej w art. 13, w brzmieniu dotychczasowym, wszczętych i niezakończonych przed dniem wejścia w życie niniejszej ustawy, stosuje się przepisy dotychczasowe.” Zmiany ustawy zasiłkowej ogłoszone po t.j. (Dz.U. 2026 poz. 441 i 1123) nie dotyczą art. 68–68g (sprawdzone w tekstach: brak „68”).
- **Art. 68e ust. 2.** „Protokół kontroli sporządza się w dwóch egzemplarzach, z których jeden doręcza się osobie kontrolowanej.”
- **Art. 68e ust. 4.** „Osoba kontrolowana ma prawo w terminie 7 dni od dnia otrzymania protokołu kontroli lub aneksu do protokołu kontroli złożyć zastrzeżenia do ustaleń w nich zawartych, wskazując równocześnie stosowne środki dowodowe.”
- **Art. 68e ust. 5.** „Zakład Ubezpieczeń Społecznych rozpatruje zgłoszone zastrzeżenia. O sposobie rozpatrzenia zastrzeżeń osobę kontrolowaną informuje się na piśmie.”
- **Art. 68e ust. 6.** „Do aneksu do protokołu kontroli sporządzonego w wyniku rozpatrzenia zgłoszonych zastrzeżeń nie stosuje się ust. 4.”
- **Art. 68e ust. 7.** „Protokół kontroli stanowi podstawę do wszczęcia przez Zakład Ubezpieczeń Społecznych postępowania w sprawie ustania prawa do zasiłku chorobowego, zasiłku opiekuńczego lub świadczenia rehabilitacyjnego oraz stanowi dowód w tym postępowaniu, chyba że z protokołu lub z uwzględnionych do niego zastrzeżeń nie wynika, że zwolnienie od pracy było wykorzystywane niezgodnie z jego celem.”
- **Art. 68 ust. 1a:** kontrolę mogą prowadzić także płatnicy składek („Płatnicy składek, o których mowa w art. 61 ust. 1 pkt 1, są uprawnieni do przeprowadzania kontroli ubezpieczonych, którym wypłacają zasiłki (…)”). **Art. 68c ust. 3 pkt 2:** kontrolujący ma obowiązek „poinformowania osoby kontrolowanej o jej uprawnieniach, w tym o możliwości zgłoszenia zastrzeżeń do protokołu kontroli”.
- **Wzór protokołu:** rozporządzenie MRPiPS z 8.04.2026 (Dz.U. 2026 poz. 503, w życie 13.04.2026). Pouczenie: „Może Pan/Pani w ciągu 7 dni od dnia otrzymania protokołu kontroli złożyć zastrzeżenia do ustaleń w nim zawartych. W zastrzeżeniach należy wskazać środki dowodowe, które będą je potwierdzać.”

### Forma, adresat, poczta
- **Forma:** ustawa nie określa formy zastrzeżeń (ust. 4: „złożyć zastrzeżenia”). Formę pisemną wymienia tylko dla informacji o rozpatrzeniu (ust. 5).
- **Adresat:** ustawa nie mówi, komu się je składa. Ust. 5 mówi tylko, że rozpatruje je ZUS, także dosłownie wtedy, gdy kontrolę prowadził płatnik (ust. 5 nie rozróżnia). Pouczenie we wzorze też nie wskazuje adresata.
- **Nadanie pocztą:** w ustawie zasiłkowej nie ma przepisu o zachowaniu terminu przez nadanie, o dniu wolnym ani o sposobie liczenia terminów (przeszukane: „sobot”, „wolny od pracy”, „placówce”, „nadan”). Ustawa nie odsyła ogólnie do KPA ani do ustawy o systemie ubezpieczeń społecznych. Jedyne odesłanie do KPA w art. 59 ust. 5 dotyczy decyzji o cofnięciu upoważnienia lekarzowi. Art. 123 ustawy systemowej („W sprawach uregulowanych ustawą stosuje się przepisy Kodeksu postępowania administracyjnego, chyba że ustawa stanowi inaczej.”) dotyczy spraw z tamtej ustawy, a kontrola zwolnień jest uregulowana w ustawie zasiłkowej. KPA (art. 1 pkt 1) normuje postępowanie w sprawach „rozstrzyganych w drodze decyzji”, a kontrola to czynność poprzedzająca postępowanie (art. 68e ust. 7). Art. 57 § 5 KPA wprost się więc nie stosuje.
- **Orzeczenia:** nie szukałem w CBOSA (runda 2: zrywa połączenia). Przepis obowiązuje od 13.04.2026, więc orzecznictwa praktycznie nie ma.
- **Wniosek: przepis nie rozstrzyga ani adresata, ani tego, czy nadanie pocztą zachowuje termin.** Bezpieczna praktyka: złożyć zastrzeżenia tak, by **dotarły** w 7 dni do jednostki ZUS (albo płatnika, który kontrolował), z potwierdzeniem złożenia. Nadanie w Poczcie Polskiej może być oceniane według art. 57 § 5 KPA tylko w drodze analogii, bez podstawy wprost.

---

## 5. Odwołanie od orzeczenia lekarskiego z badań pracowniczych

### Przepisy
**Rozporządzenie MZiOS z 30.05.1996 r., t.j. Dz.U. 2023 poz. 607.** Nowelizacje po t.j. (metadane DU/2023/607): Dz.U. 2026 poz. 456 (rozporządzenie MZ z 20.03.2026, w życie 17.04.2026; zmienia § 5 ust. 3, 4, dodaje ust. 7) i Dz.U. 2026 poz. 726 (bez zmian § 5). Pełne brzmienie § 5 ust. 1–7 po zmianie jest w rundzie 2, sekcja 5. Potwierdzam z tekstów:
- **§ 5 ust. 1.** „Od orzeczenia lekarskiego, o którym mowa w § 2 ust. 5, przysługuje odwołanie wnoszone na piśmie.”
- **§ 5 ust. 3** (po 17.04.2026, zmiana z 2026/456, § 1 pkt 2 lit. a): „Odwołanie wraz z jego uzasadnieniem wnosi się w terminie 7 dni od dnia otrzymania orzeczenia lekarskiego, za pośrednictwem podstawowej jednostki służby medycyny pracy, w której orzeczenie zostało wydane, do jednego z podmiotów odwoławczych (…)” (WOMP, instytuty, CNMK, podmioty MON, podmiot ABW/AW/CBA). Wcześniej: „za pośrednictwem lekarza, który je wydał”.
- **§ 5 ust. 4** (po zmianie): „Podstawowa jednostka służby medycyny pracy, za pośrednictwem której jest składane odwołanie, w terminie 7 dni od dnia otrzymania odwołania, przekazuje je (…) do właściwego podmiotu”.
- **Poczta:** w § 5 i w całym t.j. 2023/607 nie ma przepisu o nadaniu pocztą ani o zachowaniu terminu przez nadanie (przeszukane: „poczt”, „nadan”, „operator”). W 2026/456 „elektroniczn” dotyczy tylko postaci orzeczenia i zaleceń.
- **Ustawa o służbie medycyny pracy (t.j. Dz.U. 2022 poz. 437) a Dz.U. 2026 poz. 187:** ustawa 2026/187 to ustawa z 23.01.2026 o zawodzie psychologa oraz samorządzie zawodowym psychologów. Jej art. 135 zmienia tylko art. 18 ust. 3 pkt 3: „3) regionalnego rzecznika dyscyplinarnego o wszczęcie postępowania dyscyplinarnego, o którym mowa w art. 64 ustawy z dnia 23 stycznia 2026 r. o zawodzie psychologa oraz samorządzie zawodowym psychologów (Dz. U. poz. 187).” Wchodzi w życie 19.05.2028 (art. 161: „po upływie 2 lat i 3 miesięcy od dnia ogłoszenia”, art. 135 nie jest wyłączony; data z metadanych DU/1997/593). **Nie dotyczy odwołań od orzeczeń.** Ustawa o służbie medycyny pracy nie ma artykułu o trybie odwołań; jedyny przepis to art. 17 pkt 5 („rozpatrywanie odwołań od orzeczeń lekarskich wydawanych do celów przewidzianych w Kodeksie pracy”), cytowany w rundzie 2. W pytaniu wpisano „art. 11?”, ale tamtej ustawy w tej sprawie nie ma.

### Wniosek
Odwołanie składa się na piśmie **za pośrednictwem jednostki medycyny pracy, w której wydano orzeczenie** (przychodni, a nie lekarza i nie WOMP). Przepis nie mówi, że nadanie pocztą zachowuje termin. To nie jest pismo procesowe ani postępowanie z KPA (runda 2), więc ani art. 165 § 2 KPC, ani art. 57 § 5 KPA nie mają zastosowania wprost. **Bezpiecznie: odwołanie musi dotrzeć do przychodni w 7 dni.** Orzeczeń nie znalazłem (runda 2).

---

## 6. Pisma do pracodawcy: liczy się dojście (art. 61 § 1 KC przez art. 300 Kp)

### Przepisy (cytaty dosłowne w rundach 1 i 2)
- Art. 112 § 1 Kp (sprzeciw w 7 dni od zawiadomienia o ukaraniu), art. 97 § 2¹ zd. 1 Kp (wniosek o sprostowanie świadectwa w 14 dni), art. 42 § 3 Kp (odmowa przed upływem połowy okresu wypowiedzenia): runda 1 i runda 2, sekcja 1.
- Art. 61 § 1 KC: „Oświadczenie woli, które ma być złożone innej osobie, jest złożone z chwilą, gdy doszło do niej w taki sposób, że mogła zapoznać się z jego treścią. (…)” § 2 (postać elektroniczna): runda 2. Art. 300 Kp: odpowiednie stosowanie KC.

### Orzeczenia (Portal MS; SAOS niedostępny)
Zapytania: `"sprzeciw" "kary porządkowej" "art. 61 k.c." "doszło"` (6), `"sprzeciwu" "112" "art. 61" "nadania"` (53, przejrzane pierwsze), `"sprostowanie świadectwa pracy" "art. 61 k.c." "wniosek"` (52), `"sprostowanie świadectwa" "doręczenia" "art. 61"` (90), `"Sąd Najwyższy" "sprzeciw" "kary porządkowej" "dojścia"` (2). Zapytania SAOS `all="art. 61" "sprzeciw" "kary porządkowej"` i `all="sprostowanie świadectwa" "doręczenia" "art. 61"` nie przeszły (przerwa).
- **Sprzeciw od kary: Sąd Rejonowy Szczecin-Centrum w Szczecinie, IX P 762/20, uzasadnienie z 22.02.2022**, id `155515300004521_IX_P_000762_2020_Uz_2022-02-22_001`: „Powódka niezasadnie wskazała, że zachowała wymagany termin, ponieważ nadała pismo listem poleconym w placówce pocztowej jeszcze przed upływem 7 dni. Otóż termin wynikający z art. 112 k.p jest terminem prawa materialnego i dla oceny jego zachowania zastosowanie mają przepisy kodeksu cywilnego (poprzez art. 300 k.p.). Zatem Sąd uznał, że w tym zakresie jeżeli chodzi o kwestie ustalenia daty prawidłowego złożenia sprzeciwu, zastosowanie ma art. 61 kc., który stanowi, że oświadczenie woli, które ma być złożone innej osobie, jest złożone z chwilą, gdy doszło do niej w taki sposób, że mogła zapoznać się z jego treścią. W tym wypadku było to więc 13 listopada 2020 r. Dopiero z tą datą pracodawca miał możliwość zapoznania się z treścią pisma zawierającego sprzeciw, a zatem już po upływie 7-dniowego terminu do jego wniesienia.” Ten sam sąd dalej: „dla oceny kwestii terminowego złożenia sprzeciwu od nałożonej kary porządkowej posiłkowe odwołanie się do art. 61 k.c. statuującego zasady składania oświadczeń woli znajduje prawne uzasadnienie.” Sąd powołuje SN, wyrok z 19.10.1995, III CRN 40/95, OSNC 1996, nr 3, poz. 43, ale tylko jako ogólną tezę o różnicy między czynnościami prawnymi a procesowymi.
- **Sprzeciw (runda 1):** SO w Łodzi, VII Pa 90/16, 8.06.2016: art. 165 § 2 KPC do sprzeciwu się nie stosuje.
- **Wniosek o sprostowanie świadectwa: Sąd Okręgowy we Wrocławiu, VII Pa 323/13, wyrok z 5.12.2013**, id `155025000003515_VII_Pa_000323_2013_Uz_2013-12-11_001`. Sąd okręgowy relacjonuje stanowisko sądu rejonowego (wyrok SR uchylono z innych przyczyn; SO tej tezy nie podważył): „Zdaniem Sądu powódka nie dochowała pierwszego z terminów, gdyż wniosek o sprostowanie świadectwa pracy winien zostać doręczony pozwanemu najpóźniej 23 listopada 2012 r. w oparciu o art. 61 k.c. w zw. z art. 300 k.p., podczas gdy tego dnia powódka dopiero nadała wniosek w urzędzie pocztowym.” (Termin wynosił wtedy 7 dni.) Uwaga: w rundzie 1 opisano IX P 666/18, gdzie sąd przyjął datę nadania wniosku, ale nie rozważał tej kwestii.
- **Odmowa przyjęcia warunków (art. 42 § 3):** brak orzeczeń o dojściu (runda 2, sekcja 1). Wniosek z art. 61 § 1 KC ten sam.
- **SN:** orzeczenia SN o dojściu sprzeciwu albo wniosku o sprostowanie do pracodawcy nie przeczytałem (SAOS niedostępny). Ogólnie o skuteczności oświadczenia z chwilą dojścia, w przytoczeniu (SR w Gdańsku, IV P 653/13, id `151015150002015_IV_P_000653_2013_Uz_2016-04-06_001`, o oświadczeniu pracodawcy): „oświadczenie woli pracodawcy w tym przedmiocie jest skuteczne z chwilą dojścia do adresata w sposób umożliwiający mu zapoznanie się z jego treścią (por. uchwałę Sądu Najwyższego z dnia 06 października 1998 r. w sprawie III ZP 31/98).”

### Wniosek
**Potwierdzam:** sprzeciw, wniosek o sprostowanie i odmowa przyjęcia warunków muszą **dojść** do pracodawcy w terminie (art. 61 § 1 KC przez art. 300 Kp). Nadanie na poczcie w ostatnim dniu nie wystarcza (IX P 762/20, VII Pa 90/16, stanowisko SR w VII Pa 323/13). Brak orzeczenia SN w przeczytanych źródłach.

---

## 7. Dni ustawowo wolne od pracy

**Ustawa z 18.01.1951 o dniach wolnych od pracy, t.j. Dz.U. 2025 poz. 296** (obwieszczenie z 6.03.2025; zmiana: ustawa z 6.12.2024, **Dz.U. 2024 poz. 1965**, ogłoszona 30.12.2024, w życie **1.02.2025**, art. 5. W metadanych DU/1951/28 nie ma zmian po t.j.):
- **Art. 1.** „Dniami wolnymi od pracy są: 1) dni niżej wymienione: a) 1 stycznia – Nowy Rok, b) 6 stycznia – Święto Trzech Króli, c) pierwszy dzień Wielkiej Nocy, d) drugi dzień Wielkiej Nocy, e) 1 maja – Święto Państwowe, f) 3 maja – Święto Narodowe Trzeciego Maja, g) pierwszy dzień Zielonych Świątek, h) dzień Bożego Ciała, i) 15 sierpnia – Wniebowzięcie Najświętszej Maryi Panny, j) 1 listopada – Wszystkich Świętych, k) 11 listopada – Narodowe Święto Niepodległości, ka) 24 grudnia – Wigilia Bożego Narodzenia, l) 25 grudnia – pierwszy dzień Bożego Narodzenia, m) 26 grudnia – drugi dzień Bożego Narodzenia; 2) niedziele.”
- **Art. 1a ust. 1.** „W przypadku ogłoszenia stanu zagrożenia epidemicznego lub stanu epidemii, dniem wolnym od pracy jest także dzień określony przez Prezesa Rady Ministrów, w drodze rozporządzenia.” Kalkulator tego nie przewidzi; warto o tym wiedzieć.
- **Wigilia** jest dniem wolnym od 1.02.2025, więc pierwszy raz 24.12.2025. Dla dat sprzed 1.02.2025 24 grudnia nie jest świętem.
- **Ruchome dni wolne** (obliczenie własne, algorytm Gaussa i Meeusa; ustawa nie podaje dat):

| Rok | Wielkanoc (niedziela) | Poniedziałek Wielkanocny | Zielone Świątki (niedziela, +49) | Boże Ciało (czwartek, +60) |
|---|---|---|---|---|
| 2026 | 5.04 | 6.04 | 24.05 | 4.06 |
| 2027 | 28.03 | 29.03 | 16.05 | 27.05 |
| 2028 | 16.04 | 17.04 | 4.06 | 15.06 |

- Przykład z zadania: 11.12.2026 to **piątek**, 12.12.2026 to sobota (sprawdzone).
- Sobota nie jest dniem ustawowo wolnym (III CZP 8/03, runda 1). Od 1.01.2017 art. 115 KC wymienia ją jednak osobno.

---

## 8. Czy pracodawca musi przyjmować pisma w sobotę

- **Przepis: brak.** Kp nie nakłada na pracodawcę obowiązku prowadzenia biura podawczego ani przyjmowania pism w określonych dniach lub godzinach (nie znalazłem; Kp przy terminach składania pism przez pracownika odsyła tylko do art. 300 i art. 61 KC).
- **Orzeczenia: brak.** Portal MS: `"art. 61 k.c." "w sobotę" "pracodawc" "zapoznać się z jego treścią"` (0), `"art. 61" "dzień wolny od pracy" "e-mail" "pracodawc"` (0), `"po godzinach pracy" "art. 61 k.c." "zapoznania"` (5; żaden o dojściu pisma pracownika poza godzinami pracy), `"sekretariat" "w sobotę" "art. 61 k.c."` (1, bez związku). Runda 2: brak orzeczeń o dojściu oświadczenia w dniu wolnym. SAOS niedostępny.
- **Z tekstu art. 61 § 1 KC:** liczy się możliwość zapoznania się przez adresata. Jeśli zakład pracuje w sobotę i jest tam osoba, która przyjmuje pisma (kierownik zmiany, kadry), pismo wręczone wtedy prawdopodobnie „doszło”. Kalkulator nie zna grafiku pracodawcy. Ciężar dowodu dojścia spoczywa na składającym (X P 367/17, runda 2).

---

## Wnioski dla linijki praktycznej

Warunek wyświetlenia: „Zdąż do” wypada w sobotę, niedzielę albo dzień z art. 1 ustawy o dniach wolnych od pracy (z Wigilią od 2025 r.).

1. **Pismo do pracodawcy** (sprzeciw od kary, wniosek o sprostowanie świadectwa, odmowa nowych warunków): wolno napisać „złóż najpóźniej w ostatnim dniu roboczym przed tą datą (np. w piątek 11 grudnia 2026 r.), bo liczy się dzień, w którym pismo dotrze do pracodawcy, a nie dzień nadania”. Podstawa: art. 61 § 1 KC przez art. 300 Kp; IX P 762/20, VII Pa 90/16, VII Pa 323/13 (stanowisko SR). Lepiej nie pisać, że w sobotę nie da się złożyć pisma, bo zakład może wtedy pracować (brak przepisu, pyt. 8). Można dodać „chyba że Twój zakład przyjmuje pisma tego dnia”.
2. **Pozew lub odwołanie do sądu pracy:** wolno napisać „tego dnia możesz nadać pismo w placówce Poczty Polskiej (operator wyznaczony), jeśli jest czynna; zachowaj potwierdzenie nadania”. Podstawa: art. 165 § 2 KPC („operatora świadczącego pocztowe usługi powszechne”) w zw. z art. 3 pkt 13 Prawa pocztowego; Poczta Polska na lata 2026–2035 według decyzji Prezesa UKE z 28.11.2025 (źródło nieurzędowe); wymóg dowodu nadania: SN 12.10.2017 w przytoczeniu z I ACa 956/17. Nie pisać „operatora wyznaczonego” jako cytatu z KPC. Kurier i InPost nie korzystają z art. 165 § 2.
3. **Odwołanie od decyzji ZUS:** wolno napisać to samo co przy pozwie, z dopiskiem, że list trzeba zaadresować do oddziału ZUS, który wydał decyzję, a nie do sądu. Podstawa: art. 477⁹ § 1 KPC, art. 83 ust. 2 i 5 ustawy systemowej; odwołanie jest pismem procesowym (II UKN 105/98 w przytoczeniu, III AUa 1112/13); III AUz 11/18 i VII U 2743/12 (data nadania zachowuje termin); I CKN 967/00 w przytoczeniu (właściwy adresat).
4. **Zastrzeżenia do protokołu kontroli zwolnienia:** **nie** obiecywać skutku nadania na poczcie. Napisać jak przy piśmie do pracodawcy: „złóż tak, żeby dotarły najpóźniej w ostatnim dniu roboczym przed tą datą”. Podstawa: art. 68e ust. 4–5 ustawy zasiłkowej nie mówi o formie, adresacie ani nadaniu. KPA i art. 165 § 2 KPC nie mają zastosowania wprost. **Przepis nie rozstrzyga.**
5. **Odwołanie od orzeczenia lekarskiego:** napisać „złóż w przychodni medycyny pracy, która wydała orzeczenie, najpóźniej w ostatnim dniu roboczym przed tą datą; przepis nie przewiduje, że wystarczy nadanie na poczcie”. Podstawa: § 5 ust. 1 i 3 rozporządzenia z 1996 r. (t.j. 2023/607, zm. 2026/456): „na piśmie”, „za pośrednictwem podstawowej jednostki służby medycyny pracy, w której orzeczenie zostało wydane”; brak przepisu o poczcie. Zmiana 2026/187 tego nie dotyczy.
6. **Przedawnienie:** wolno napisać jak przy pozwie („tego dnia możesz nadać pozew w czynnej placówce Poczty Polskiej; bieg przedawnienia przerywa się z dniem nadania”), z ostrzeżeniem „nie licz na przesunięcie na poniedziałek: Sąd Najwyższy uznał, że art. 115 KC nie stosuje się do przedawnienia (III CZP 21/23); bezpieczniej złóż pozew wcześniej”. Podstawa: art. 123 § 1 pkt 1 KC (art. 295 § 1 pkt 1 Kp), art. 165 § 2 KPC; VI ACa 1552/13, V ACa 1254/17, VI GC 2924/15, III APa 2/16 (data nadania = przerwanie); III CZP 21/23.

## Do ręcznego sprawdzenia

1. **SAOS** (gdy wróci; `curl -m 120`): (a) orzeczenie SN, że nadanie z art. 165 § 2 KPC przerywa bieg przedawnienia: `all="165 § 2" przedawnienia "nadania"&courtType=SUPREME`; (b) SN o nadaniu odwołania do organu rentowego: `all="odwołanie" "organ rentowy" "165 § 2"&courtType=SUPREME`, `caseNumber=II UKN 105/98`; (c) `caseNumber=I CKN 967/00`; (d) wyrok SN z 12.10.2017 w sprawie SA w Białymstoku I ACa 956/17 (sygnatura nieznana: szukać `all="165 § 2" "operatora publicznego"` z datą 2017-10-12); (e) SN o dojściu sprzeciwu i wniosku o sprostowanie: `all="art. 61" "sprzeciw" "kary porządkowej"`, `all="sprostowanie świadectwa" "art. 61"`; (f) SN o nadaniu w niedzielę lub święto: `all="165 § 2" niedziel`.
2. **Operator wyznaczony, źródło urzędowe:** decyzja Prezesa UKE z 28.11.2025 (BIP UKE) albo komunikat UKE lub MAP (gov.pl odrzucał połączenia).
3. **Art. 295 § 1 Kp:** dosłowne brzmienie z t.j. Dz.U. 2026 poz. 1245 (nie pobierałem w tej rundzie).
4. **Zastrzeżenia do protokołu kontroli:** czy ZUS w pouczeniach albo na stronie wskazuje adresata i sposób złożenia (PUE/eZUS, placówka, poczta). Czy przy kontroli prowadzonej przez płatnika zastrzeżenia składa się płatnikowi czy ZUS (art. 68e ust. 5 mówi tylko o rozpatrzeniu przez ZUS).
5. **Placówki Poczty Polskiej czynne w soboty, niedziele i święta** (placowki.poczta-polska.pl): czy linkować wyszukiwarkę placówek w linijce. Czy agencja pocztowa lub punkt partnerski Poczty Polskiej to „placówka” w rozumieniu art. 165 § 2 (art. 3 pkt 15 Prawa pocztowego obejmuje jednostki agenta; orzeczeń nie szukałem).
6. **Odwołanie do ZUS elektronicznie** (PUE/eZUS): czy i od kiedy zachowuje termin. Nie badałem.
