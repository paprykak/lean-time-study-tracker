# Pytania do prawnika przed publicznym startem Rytmu Hali

Przygotowane 2026-11-06 (F7). Przepisy sprawdzone w tekstach jednolitych przez API Sejmu tego dnia; prawnik potwierdza
ich aktualne brzmienie i zastosowanie. To lista pytań, nie porada prawna. Projekty tekstów do oceny: polityka
prywatności, regulamin newslettera, stopka redakcyjna, zasady redakcyjne, oznaczanie reklam (`src/content/strony/`,
na podglądzie pod `/polityka-prywatnosci`, `/regulamin-newslettera`, `/stopka-redakcyjna`).

## 1. Prawo prasowe
1. Czy Rytm Hali (serwis internetowy z artykułami publikowanymi regularnie pod stałym tytułem) jest prasą w rozumieniu art. 7 ust. 2 pkt 1 Prawa prasowego (t.j. Dz.U. 2018 poz. 1914) i czy wymaga rejestracji jako czasopismo w sądzie okręgowym (art. 20)? Jakie są skutki publikowania bez rejestracji?
2. Jeśli tak: jakie elementy stopki z art. 27 trzeba podać w serwisie internetowym i czy projekt `/stopka-redakcyjna` je zawiera?
3. Autoryzacja (art. 14a) i zgoda na publikację nagrania (art. 14 ust. 1): czy proces w zasadach redakcyjnych wystarcza (informacja przed rozmową, autoryzacja dosłownych cytatów na żądanie)?

## 2. Reklamy i materiały partnerów
4. Czy oznaczenia „Reklama” (sloty) i „Materiał partnera” (artykuły sponsorowane, z linkami `rel="sponsored"`) spełniają art. 36 ust. 3 Prawa prasowego (oznaczenie niebudzące wątpliwości, że to nie materiał redakcyjny) i art. 9 ustawy o świadczeniu usług drogą elektroniczną (t.j. Dz.U. 2024 poz. 1513; wyodrębnienie i oznaczenie informacji handlowej)? Czy oznaczać także w samym tytule albo w adresie?
5. Odpowiedzialność za treść reklam i materiałów partnerów: jak daleko sięga wyłączenie z art. 42 ust. 2 Prawa prasowego przy materiałach partnera, które redakcja pomaga przygotować? Jakie zapisy umowy z partnerem (oświadczenia, prawa do kreacji, zwolnienie z odpowiedzialności)?
6. Sponsor newslettera: jak oznaczyć reklamę w wydaniu e-mail i czy zgoda na newsletter obejmuje informację handlową sponsora?

## 3. Forma działalności i rozliczenia
7. Jaka forma działalności przy sprzedaży reklam i materiałów partnerów (działalność nierejestrowana ma limit przychodu; jednoosobowa działalność; spółka)? Co z VAT przy sprzedaży reklamy firmom z Polski i z UE?
8. Kto jest wydawcą w rozumieniu prawa prasowego i administratorem danych w każdej z tych form?

## 4. Dane osobowe (RODO)
9. Podstawa przetwarzania danych z formularza kontaktowego: zgoda (art. 6 ust. 1 lit. a RODO) czy prawnie uzasadniony interes (lit. f)? Czy pole zgody w formularzu jest potrzebne?
10. Okresy przechowywania: wiadomości do redakcji, dowód zgody na newsletter, lista wypisanych adresów.
11. Umowy powierzenia i transfery: Cloudflare (hosting, poczta redakcji; transfer do USA na podstawie EU-U.S. Data Privacy Framework i standardowych klauzul umownych), Brevo SAS (newsletter), dostawca Umami (statystyki). Co sprawdzić i zachować w dokumentacji?
12. Statystyki Umami bez plików cookie i bez zapisu adresu IP: czy to dane osobowe i czy wymagają zgody według przepisów o dostępie do informacji w urządzeniu użytkownika? Czy wystarczy informacja w polityce prywatności?
13. Czy potrzebny jest rejestr czynności przetwarzania i w jakim zakresie przy tej skali?

## 5. Usługi elektroniczne
14. Czy newsletter wymaga regulaminu z art. 8 ustawy o świadczeniu usług drogą elektroniczną i czy projekt `/regulamin-newslettera` jest kompletny? Czy formularz kontaktowy też jest usługą wymagającą regulaminu?

## 6. AI w pracy redakcji
15. Teksty powstają z pomocą narzędzi AI bez oznaczeń przy tekstach; każdy tekst czyta i zatwierdza redaktor naczelny, a fakty są sprawdzane u źródła (skill `/artykul`, zasada 6). Czy to wystarcza do zwolnienia z obowiązku oznaczania z art. 50 ust. 4 AI Act (kontrola redakcyjna i odpowiedzialność redakcyjna), według wytycznych Komisji Europejskiej do art. 50? Co udokumentować na wypadek kontroli?

## 7. Prawa autorskie
16. Prawo cytatu (art. 29 ustawy o prawie autorskim): cytaty z badań i raportów oraz wykresy redakcji oparte na danych z cudzych publikacji, w medium z reklamami.
17. Zdjęcia na licencjach CC0, CC BY, Unsplash i Pexels: czy podpis „Fot.” z autorem i licencją wystarcza w serwisie komercyjnym? Ryzyka przy wizerunkach osób na zdjęciach.
