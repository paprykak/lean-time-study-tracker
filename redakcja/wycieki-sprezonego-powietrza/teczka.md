# Teczka: wycieki-sprezonego-powietrza

## 0. Tryb pracy
- 2026-11-09: Patryk: „Napisz i opublikuj kolejne 3 artykuły. Dobierz super zdjęcia! Pamiętaj o najwyższym poziomie. Od razu publikuj”. Temat wybrany przez redakcję (tryb B, „wybierz sam”), publikacja w trybie „publikuj od razu” (DECYZJE.md, 2026-11-07). Budżet pracy według SKILL.md.

## 1. Brief
- Czytelnik i jego pytanie: kierownik utrzymania ruchu, kierownik produkcji albo dyrektor zakładu (50–250 osób) z instalacją sprężonego powietrza. „Ile kosztują nas wycieki i od czego zacząć, zanim kupimy kolejną sprężarkę albo podniesiemy ciśnienie?”
- Teza: w zakładzie bez programu szczelności przez nieszczelności ucieka typowo około piątej części powietrza ze sprężarek, a najtańszy krok to sprawdzić to w sobotę testem sprężarki i naprawić wycieki, zanim ktoś podniesie ciśnienie albo kupi sprężarkę.
- Wkład: (1) koszt wycieku w złotówkach według średnicy otworu dla 6 i 7 barów i polskiej ceny prądu (Eurostat, 2026-S1), policzony z fizyki przepływu i sprawdzony z tabelą DOE; (2) test w sobotę opisany w jednostkach SI i z rachunkiem; (3) uczciwe zestawienie dowodów: ile wiemy o udziale wycieków. Polskie wyniki wyszukiwania („koszt wycieku sprężonego powietrza”) to głównie strony dostawców sprężarek i detektorów bez źródeł i bez przeliczenia na polskie ceny.
- Format: Poradnik, ok. 1 600–1 800 słów. Dział: produkcja. Temat: nowy „energia” (Energia w zakładzie). Powiązane: oee-85-procent.
- Popyt (podpowiedzi Google, 2026-11-09): „koszt wycieku sprężonego powietrza”, „koszt 1m3 sprężonego powietrza”, „koszt wytworzenia sprężonego powietrza”.
- Autor: redakcja. Konflikt interesów: redaktor naczelny prowadzi doradztwo w operacjach; tekst nie odsyła do jego usług.

## 2. Pięć pytań redaktora
1. Teza: sporna (wielu uważa wycieki za drobiazg albo zaczyna od zakupu sprężarki). 2. Nowość: tabela w złotówkach i barach z fizyki, test w SI. 3. Dlaczego teraz: ceny prądu dla firm w Polsce w 2026-S1 wyższe niż rok wcześniej (Eurostat: 0,7685 zł/kWh w paśmie ID wobec 0,7305 w 2025-S1); test można zrobić w najbliższą sobotę. 4. Autorytet: DOE/Compressed Air Challenge, Fraunhofer ISI, Eurostat, pomiar laboratoryjny (Dudić i in.). 5. Za i przeciw: liczby udziału wycieków pochodzą z poradnika i kampanii, nie z recenzowanych pomiarów w wielu zakładach; jeden przypadek z pomiarem (Nascimento i in.) to budynek usługowy.

## 3. Plan tekstu
- Obietnica: czytelnik policzy, ile kosztują wycieki w jego zakładzie, i będzie wiedział, co zrobić w sobotę.
- Trzy rzeczy do zabrania: (1) otwór 2–3 mm kosztuje kilkanaście–kilkadziesiąt tysięcy zł rocznie; (2) test załadunku sprężarki przy wyłączonych odbiorach pokazuje udział wycieków; (3) nie podnoś ciśnienia, żeby przykryć wycieki: to więcej energii i większe wycieki.
- Zdanie do zapamiętania: „Najpierw uszczelnij sieć, potem rozmawiaj o sprężarce.”
- Czego czytelnik nie wie: przepływ krytyczny (tylko efekt: wyciek rośnie z ciśnieniem i z kwadratem średnicy), test załadunku, detektor ultradźwiękowy.
- Otwarcie: scena dźwiękowa (sobota, hala stoi, słychać syk) i liczba (otwór 2 mm = 259 l/min); przypadek prowadzący na danych fikcyjnych: zakład obróbki metali, dwie sprężarki po 37 kW (razem ok. 75 kW), dwie zmiany; na końcu hali spada ciśnienie, ktoś podnosi nastawę z 6 do 7 barów. Rama inna niż w poprzednich tekstach (bez sprzedawcy i obietnicy).
- Sztafeta: ile kosztuje jedna dziura? → jak sprawdzić, ile ucieka u mnie? → gdzie szukać? → co z ciśnieniem? → jak utrzymać wynik? → ile o tym naprawdę wiemy? → kiedy test nie działa → pierwszy krok.
- Zakończenie: klamra z sobotnim sykiem i pierwszy krok (test, zanim decyzja o sprężarce).
- Test przekazania: „Zróbmy w sobotę test sprężarki, zanim zamówimy nową; tu jest, jak policzyć wynik.”
- Narzędzie do pobrania: nie (tabela i wzór w tekście wystarczą).
- Czytelnik konspektu: (wpis po uruchomieniu).

## 4. Źródła
Kopie: `.cache/redakcja/wycieki-sprezonego-powietrza/`. Opisy: `zrodla.json`.
| Klucz | Opis | Rodzaj | Siła | Co wspiera | Ograniczenia |
|---|---|---|---|---|---|
| doe | US DOE / Compressed Air Challenge, Improving Compressed Air System Performance: A Sourcebook for Industry, 3. wyd. | Raport instytucji | C | udział wycieków (20–30%, typowo 20%, do 5–10%), tabela wycieków, test załadunku, metoda spadku ciśnienia, ultradźwięki, miejsca wycieków, ciśnienie (2 psi ≈ 1%) | poradnik bez opisanej próby; liczby udziału bez metodyki |
| radgen | Radgen P. (2003), kampania „Druckluft effizient”, ACEEE Summer Study (Fraunhofer ISI) | Raport instytucji | C | Niemcy: ok. 62 000 instalacji, 7% energii elektrycznej przemysłu; badanie UE: oszczędności 25–40%, zwrot < 2 lata; wycieki największą częścią strat w audytach | materiał konferencyjny; wyniki kampanii, nie badanie z grupą kontrolną |
| eurostat | Eurostat nrg_pc_205, ceny energii elektrycznej dla odbiorców innych niż gospodarstwa domowe, Polska | Dane publiczne | A | cena 0,7685 zł/kWh (pasmo ID, bez VAT i podatków zwrotnych, 2026-S1); 0,8780 zł/kWh (pasmo IC) | średnia dla pasma; ceny pojedynczych firm różne |
| dudic | Dudić S. i in. (2012), Leakage quantification of compressed air on pipes using thermovision, Thermal Science 16(suppl. 2):S555–S565 | Badanie recenzowane | C | pomiar laboratoryjny przepływu przez otwory 0,5–2 mm przy 4–8 bar; detektor ultradźwiękowy pokazywał 75 dB niezależnie od wielkości otworu | laboratorium, jedna rura; liczby tylko na wykresie |
| nascimento | Nascimento M. i in. (2022), Quantifying Compressed Air Leakage through NILM…, Energies 15(9):3213 | Badanie recenzowane | C | jeden przypadek: wycieki 62%; po usunięciu ok. 44% oszczędności energii instalacji (abstrakt) | jedna instalacja w budynku usługowym; czytany tylko abstrakt |

Badań recenzowanych z pomiarem udziału wycieków w wielu zakładach nie znaleźliśmy (Saidur 2010, Radgen i Blaustein 2001 w pełnym tekście i badania IAC niedostępne); tekst mówi to wprost.

## 5. Rejestr twierdzeń
| Twierdzenie w tekście | Przypis | Miejsce i fragment |
|---|---|---|
| wycieki 20–30% wydajności; typowy zakład bez utrzymania ok. 20%; program do 5–10% | doe | s. 28, Fact Sheet 3: „sometimes wasting 20 to 30 percent of a compressor's output. A typical plant that has not been well maintained will likely have a leak rate equal to 20 percent…”; „proactive leak detection and repair can reduce leaks to less than 5 to 10 percent of compressor output.” |
| tabela 1/16″ 6,5 cfm, 1/8″ 26, 1/4″ 104 przy 100 psi; 0,10 USD/kWh; 8 760 h; otwór idealny | doe | s. 28, tabela (grafika, sprawdzona na obrazie strony 2026-11-09): „Costs calculated using electricity rate of $0.10 per kilowatt-hour, assuming 8,760-hour operation, a perfect orifice at 100 psi, and an efficient compressor.” |
| test załadunku: wyciek % = T × 100 / (T + t); przy wyłączonych odbiorach; nie obejmuje urządzeń odciętych zaworem | doe | s. 28: „Leakage (%) = [(T x 100)/(T+t)] where: T = on-load time (minutes), t = off-load time (minutes)”; „may not account for idle end use equipment where the compressed air has been turned off.” |
| metoda spadku ciśnienia (dla sprężarek z innym sterowaniem), P2 ok. połowa ciśnienia, mnożnik 1,25 | doe | s. 28–29: „Leakage (cfm) = (V x (P1-P2)/T x 14.7) x 1.25”; „P2… equal to about one-half the operating pressure” |
| ultradźwięki najlepsze do wykrywania; woda z mydłem niezawodna, ale wolna | doe | s. 29: „The best way to detect leaks is to use an ultrasonic acoustic detector…”; „apply soapy water with a paint brush… Although reliable, this method can be time consuming.” |
| najczęstsze miejsca: złącza, węże, przewody, złączki; reduktory; otwarte odwadniacze i zawory; połączenia rur, szybkozłącza, uszczelniacze gwintów | doe | s. 28: „Couplings, hoses, tubes, and fittings; Pressure regulators; Open condensate traps and shut-off valves; Pipe joints, disconnects, and thread sealants” |
| wycieki powodują spadki ciśnienia i dokupowanie zbędnej mocy | doe | s. 28: „Leaks cause a drop in system pressure…”; „leaks can lead to adding unnecessary compressor capacity.” |
| 2 psi więcej = ok. 1% więcej energii przy pełnej wydajności | doe | Fact Sheet 1: „for every 2 psi increase in discharge pressure, energy consumption will increase by approximately 1 percent at full output flow” |
| niższe ciśnienie = mniejszy przepływ przez wyciek | doe | s. 30: „The lower the pressure differential across an orifice or leak, the lower the rate of flow” |
| sprężone powietrze to prawdopodobnie najdroższa forma energii w zakładzie | doe | Fact Sheet 2: „Compressed air is probably the most expensive form of energy available in a plant.” |
| Niemcy: ok. 62 000 instalacji, ok. 14 mld kWh, 7% energii przemysłu; UE: oszczędności 25–40%, zwrot < 2 lat | radgen | s. 3-195 (cytaty w raporcie agenta badawczego; plik aceee_2003…txt) |
| wycieki największą częścią strat w audytach kampanii | radgen | s. 3-199: „compressed air leakages, as they are responsible for the largest part of the overall losses.” |
| cena 0,7685 zł/kWh (ID, bez VAT, 2026-S1); 0,7305 (2025-S1) | eurostat | nrg_pc_205, PL, E7000, MWH2000-19999, X_VAT, NAC (dane/wycieki.py, wyniki.json) |
| detektor ultradźwiękowy: 75 dB dla wszystkich otworów i ciśnień (lokalizuje, nie mierzy wielkości) | dudic | s. S560: „75 dB for all sizes of orifices and at all pressure levels” |
| jeden przypadek: 62% wycieków; ok. 44% oszczędności instalacji | nascimento | abstrakt: „The results suggested 62% of leaks in the study case.”; „the savings would represent around 44% in the compressed air system” |

## 7. Analiza własna i rachunki
- `dane/wycieki.py`: przepływ krytyczny przez otwór idealny (Cd = 1, 20 °C, powietrze wolne 1,013 bar); sprawdzenie: model daje 6,5 / 26,0 / 104,0 cfm dla 1/16″, 1/8″, 1/4″ przy 100 psi, dokładnie jak tabela DOE. Moc 6,50 kW na 1 m³/min wynika z tej samej tabeli (koszt / cena / 8 760 h). Wyniki dla 1–4 mm przy 6 i 7 barach, koszt przy 0,7685 zł/kWh dla 8 760 h i 4 000 h. Przykład na danych fikcyjnych (po weryfikacji): jedna sprężarka 37 kW, T = 0,5 min, t = 0,75 min → 40% jej wydajności (20% obu); 4 000 h, 0,7685 zł/kWh → do ok. 45 500 zł rocznie; naprawa połowy → do ok. 22 700 zł; przy poborze sprężarki odciążonej 15–35% mocy oszczędność 65–85% tej kwoty, czyli 14,8–19,3 tys. zł. Spadek ciśnienia: V = 3 m³, 6 → 3 bar w 5 min → 2,22 m³/min, 19,5% wydajności dwóch sprężarek po 37 kW. Ciśnienie: 1 bar ≈ 7,25 × 2 psi, więc 1% na 2 psi ≈ 7%/bar, 1,6–2% ≈ 12–15%/bar; wyciek 6 → 7 bar +14,3%. Rura 100 m × 50 mm: 0,196 m³.
- Rysunek: `dane/rysunek.mjs` → `src/assets/rysunki/wycieki-sprezonego-powietrza-1.svg`.
- Schemat testu: `dane/schemat.mjs` → `src/assets/rysunki/wycieki-sprezonego-powietrza-2.svg`.

## 8. Zdjęcie
- Wybór: „Compressor room Coal Mine Winterslag Genk Belgium” (Eebie, Wikimedia Commons, CC BY 4.0) — hala sprężarek dawnej kopalni; pasuje do tezy (każdy metr sześcienny trzeba najpierw sprężyć), bez ludzi i marek w kadrze. Licencja potwierdzona 2026-11-09 (sekcja 12); kadr 16:9 ze środka zdjęcia bez zmian.

## 9. Weryfikacja
- Runda 1, weryfikator faktów (model główny, ok. 73 twierdzenia): ok. 54 POTWIERDZONE, 15 CZĘŚCIOWO, 2 NIEPOTWIERDZONE, 2 SPRZECZNE. Poprawione: 25 tys. zł tylko przy sieci pod ciśnieniem całą dobę (lead, opisSeo, FAQ), 20% jako szacunek wydajności sprężarek bez metody, wynik detektora (Dudić) zawężony do jednego badania, tytuł raportu Radgena, 74 zamiast 75 kW, wzór kosztu dla sprężarki z testu.
- Runda 1, recenzent (model główny): karta 24/30 (bez kryterium 11). Zrobione: 20% opisane jako szacunek bez metody, sprężarka odciążona pobiera 15–35% mocy (realna oszczędność 15–19 tys. zł), cena z faktury tylko z opłat zmiennych, akapit o spadku ciśnienia w sieci (DOE Fact Sheet 4), 430 zł miesięcznie za otwór 2 mm, opis audytorów kampanii niemieckiej. Wspólna rama trzech tekstów zmieniona (różne otwarcia i zakończenia).
- Runda 2, redaktor językowy (sonnet): przyjęte m.in. otwarcie „Weźmy…” z oznaczeniem przykładu, śródtytuł „Dwa razy większy otwór to cztery razy wyższy rachunek”, scalenie sekcji o liczbie 20% i o granicach rachunku w „Ten rachunek ma granice”, odesłanie do rysunku 1 zamiast „tabeli”, tabela skutków podniesienia ciśnienia zamiast dwóch akapitów liczb, zdanie o ciśnieniu bez zaprzeczenia, porządek listy miejsc wycieków, zakończenie wracające do syku. Odrzucone: zmiana tytułu (ma tezę; wzorzec „nie X, tylko Y” użyty raz), nowy lead (obecny ma tezę i warunek całej doby), usunięcie zdania o zgodności z tabelą DOE (skrócone, bez jednostek calowych, bo pokazuje, że rachunek jest sprawdzony). Słowa: ok. 1 780 przed rundą, 1 772 po (doszła tabela, akapit o spadku ciśnienia i wyjaśnienia czytelników).
- Runda 2, czytelnik testowy 1 (kierownik utrzymania ruchu, obróbka metali, 140 osób): przewijanie w sekcji o liczbie 20%; przyjemność 6/10, wartość 7/10. Zrobione: sekcja skrócona i scalona, mniej przypisów w otwarciu, prostszy przykład testu („do”, 65–85%), akapit „gdy wycieków jest mało, a ciśnienia brakuje”, skąd wziąć pojemność sieci, bez stóp sześciennych i psi w tekście głównym. Zapamiętał: kwadrat średnicy i 25 tys. zł, 6 → 7 barów = ok. 7% energii i 14% wycieków, test T × 100 / (T + t) — zgodne z trzema rzeczami z planu.
- Domknięcie, czytelnik testowy 2 (dyrektor zakładu, 90 osób): przewijanie przy wzorze dla sprężarek z falownikiem; przyjemność 6/10, wartość 8/10. Zrobione: wyjaśnione „otwór idealny” i mnożnik 1,25, pogodzone 40% z 20%, krótszy akapit o cenach, wyjaśniona różnica 7% i 12–15%. Na później: ramka „dla utrzymania ruchu” ze wzorem dla falownika i ramka „co powiedzieć utrzymaniu ruchu”.
- Domknięcie, weryfikacja zmienionych zdań (sonnet, kopie źródeł): A1–A10 POTWIERDZONE (Radgen s. 3-200 „typically the most cost effective measure”; Eurostat pasma ID 0,7685, IC 0,878, IB 1,1243; DOE Fact Sheet 4 „within the last 30 feet”; Nascimento 62%). Zdania zmienione po domknięciu sprawdzone przez redakcję w poradniku DOE: s. 28 „The 1.25 multiplier corrects leakage to normal system pressure, allowing for reduced leakage with falling system pressure”; dodatkowe 0,6–1,0% na 2 psi z poboru nieregulowanego (stąd 1,6–2%).
- `sprawdzono`: 2026-11-09.

## 10. Kontrola automatyczna
- `redakcja:kontrola`: 1 772 słowa (bez tabel), FOG-PL 9,2, średnio 14,9 słowa w zdaniu, bez błędów. Uwagi zostają z uzasadnieniem: „zdania ponad 30 słów” to zdania z dwukropkiem przed tabelą albo wzorem, które skrypt skleja z następnym blokiem; rytm 0,44 przy celu 0,45 — tekst ma dwie procedury krok po kroku, gdzie zdania podobnej długości są czytelniejsze.
- `redakcja:zrodla`: 5 źródeł bez problemów (MDPI 403 dla automatów, DOI sprawdzony w Crossref).
- Testy: pełne `npm run check` przed wdrożeniem (wynik w STAN.md).

## 11. Karta jakości
- Bramki twarde: weryfikacja ✓; kontrola automatyczna ✓; licencja zdjęcia ✓ (Commons, CC BY 4.0, 2026-11-09); dane pracodawców ✓; metoda ✓; redaktor językowy ✓; **czytelnik testowy ✗** (6/10 i 6/10 za przyjemność; 7/10 i 8/10 za wartość).
- Punkty (ocena redakcji po poprawkach; recenzent po rundzie 1: 24/30 bez kryterium 11): 1:2, 2:1, 3:1, 4:2, 5:2, 6:2, 7:2, 8:2, 9:2, 10:2, 11:2, 12:2, 13:2, 14:2, 15:2, 16:2 = **30/32**. Kryterium 3 (obowiązkowe) na 1: liczby 20% i 5–10% mają tylko źródło klasy C (poradnik rządowy), co tekst mówi wprost; recenzowanych pomiarów z wielu zakładów nie znaleźliśmy. Kryterium 2: rada „najpierw wycieki” jest znana, nowe są koszt w złotych przy polskich cenach i test w jednostkach SI.

## 12. Dla Patryka
- Bramka czytelnika (8/10 za przyjemność) i kryterium 3 niespełnione; tekst opublikowany na polecenie „publikuj od razu”. Do decyzji: ramka dla utrzymania ruchu ze wzorem dla falownika.
- Zdjęcie: licencja potwierdzona 2026-11-09 w metadanych pliku w Wikimedia Commons (CC BY 4.0, praca własna autora, zdjęcie z 2024-03-10, bez ograniczeń); Commons odpowiadał 429 przez ok. godzinę, plik pobrany po przerwie, bez obchodzenia limitu.
- Liczby do odświeżenia: ceny Eurostatu (nrg_pc_205) po publikacji danych za 2026-S2.

## 13. Kontrola redakcyjna
Tryb „publikuj od razu” (SKILL.md, zasada 6): Patryk czyta tekst krótko po publikacji.
| Data | Kto | Decyzja | Co zmieniono |
|---|---|---|---|
| 2026-11-09 | Patryk (polecenie z rozmowy: „Od razu publikuj”) | publikuj od razu, bez lektury przed publikacją | czyta po publikacji; zmiany wpisujemy w sekcji 14 |

## 14. Zmiany po publikacji
