# Pakiet „hala”: raport (2026-11-14)

Gałąź `fabryka/hala`. Dwa narzędzia BHP (kategoria „bhp”): `/narzedzia/drogi-i-przejscia` i `/narzedzia/skladowanie-w-magazynie`.
Proces: badacz prawa (`raporty/hala/PRZEPISY.md`), budowniczy, weryfikator prawny i weryfikator kodu/UX (niezależnie, pliki
i teksty przepisów bez wniosków), audytor. Wynik: `npm run -s check:szybki` EXIT 0 (unit 1992) i `BEZ_WEBKIT=1 npm run check` EXIT 0
(liczby w ostatnim commicie). Zrzuty formularzy 412 i 320 px: `raporty/hala/zrzuty/` (bez przewijania w bok, nic nie ucięte).

## Przepisy
Ogólne przepisy BHP (t.j. Dz.U. 2003 poz. 1650; zmiany 2007/330, 2008/690, 2011/1034, 2021/2088, 2026/927 sprawdzone, dotyczy
tylko § 70 ust. 2 w brzmieniu z 2021 r.): § 4–7, 17, 21, 46, 47, 55, 64a, 66, 68–77, 106, zał. 1 § 13. Ręczne prace transportowe
(t.j. Dz.U. 2018 poz. 1139): § 12 ust. 1, § 21 ust. 3, § 34–35. Wózki jezdniowe (t.j. Dz.U. 2020 poz. 852): § 8. Ochrona ppoż.
(t.j. Dz.U. 2023 poz. 822, zmiany 2024/1716 i 2026/1276 nie dotyczą użytych przepisów): § 4 ust. 1 pkt 6, 8, 9, 18, ust. 3, § 33 ust. 2.

## Zmiana zakresu narzędzia 1 (ważne)
Zlecenie zakładało kalkulator „szerokość wózka + zapas z przepisu”. Takiego przepisu nie ma: § 4 ust. 2 BHP odsyła do Polskich Norm,
§ 69 ust. 2 i § 8 rozporządzenia o wózkach nie podają liczby. Reguła „+60 cm / dwie szerokości + 90 cm” to § 46 rozporządzenia
z 1953 r. (Dz.U. 1953 nr 22 poz. 89, wózki pchane ręcznie), bez mocy od 1.01.2002 r. (§ 34–35 Dz.U. 2000 nr 26 poz. 313 w brzmieniu
Dz.U. 2000 nr 82 poz. 930; data 2000-10-11 w API Sejmu jest nieaktualna). Kalkulator sprawdza więc to, co przepis podaje: przejście
do obsługi 0,75/1 m, dojście 2 m (1,8 m wyjątkowo), pochylnię 8%, dostęp do gaśnicy 1 m; przy drodze wózków mówi wprost, że liczby
nie ma, i skąd wzięła się stara reguła. Narzędzie 2 ma sensowny rachunek (obciążenie poziomu i sekcji z tabliczki, § 68 ust. 2 pkt 2,
oraz odległości z przepisów), więc zostało w zamówionym temacie.

## Interpretacje
- Alejka piesza między regałami jak przejście z § 47 ust. 3 (przepis wymienia maszyny i urządzenia, regały nie wprost); opisane na stronie.
- Wysokość 2 m tylko dla przejść pieszych i drogi wózków z pieszymi; pochylnia > 8% to „niezgodne” przy drodze wózków, a przy przejściu
  pieszym i gaśnicy „zależy od miejsca” (§ 5 ust. 1 dotyczy dróg transportowych i magazynów).
- Sekcja regału: ten sam ładunek na każdym poziomie; 30 m do gaśnicy mierzone drogą dojścia (wariant bezpieczny); 0,5 m tylko dla palnych.
- Porównania w mm i gramach na liczbach całkowitych; nachylenie w górę do 0,1%, najkrótsza pochylnia w górę do 1 cm.

## Weryfikacje i audyt
- Weryfikator prawny: 1 błąd (data uchylenia rozporządzenia z 1953 r.), 8 nieścisłości (§ 17 tylko stropy, regały, zakres § 47 ust. 3
  i § 5 ust. 1, organizator pracy, przewody piorunochronne, § 55, 30 m), sugestie; poprawione.
- Weryfikator kodu/UX: lista „Linia napowietrzna” ucięta na 320 px (test uklad-320), wpisane a niesprawdzane wymiary bez komunikatu,
  szyk „… jest”, etykiety, aria-describedby, brakujące testy; poprawione.
- Audytor: 150 000 porównań z niezależnym modelem w Pythonie (Decimal), 0 rozbieżności werdyktów i liczb; 2 błędy w tekstach
  (metry z 2 miejscami przy polach w mm: „0,75 m: brakuje 0,1 cm”; powtórzone słowo w FAQ) i 11 drobniejszych; poprawione.

## Czego nie sprawdzono
- Czy po 21.09.2026 r. wyszło nowe rozporządzenie o warunkach technicznych budynków (API Sejmu: stare „uznany za uchylony”, następcy
  brak); dlatego strony nie podają liczb schodów, pochylni w budynku ani przejść ewakuacyjnych.
- Treść PN-EN 15620 i PN-EN 15635 (normy płatne; wymienione tylko z nazwy) i stanowisko PIP co do alejek międzyregałowych (sn.pl i PIP blokują automaty).

## Sprawy dla Patryka
1. Zgoda na zmianę zakresu narzędzia 1 (bez kalkulatora „szerokość wózka + zapas”, bo przepis go nie daje).
2. Wspólny wpis `recznePrace` w `src/data/prawo.ts`: dopisać do uwagi § 12, 21 i 34–35 i datę sprawdzenia 2026-11-14 (pakiet tylko dopisuje,
   więc tego nie zmieniał); docelowo scalić `ogolneBhpHala` z `ogolneBhp`.
3. Ręcznie sprawdzić w Dz.U./ISAP, czy jest nowe rozporządzenie o warunkach technicznych budynków.
