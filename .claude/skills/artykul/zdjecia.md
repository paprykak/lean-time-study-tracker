# Zdjęcie do artykułu (krok 5)

Zdjęcie ma pokazać zjawisko, o którym jest tekst, w prawdziwej hali albo magazynie. Nie ilustrujemy pojęć (uścisk dłoni, żarówka, wykres na tablecie) i nie używamy zdjęć stockowych z pozowanymi ludźmi. Najpierw sprawdź rejestr (`src/content/zdjecia/`): może jest pasujące zdjęcie, którego nie używa żaden inny tekst jako zdjęcia głównego.

## Kryteria (wszystkie muszą być spełnione)
1. **Licencja:** CC0 1.0 albo CC BY 2.0, 3.0, 4.0. Bez CC BY-SA, NC, ND, GFDL i „domeny publicznej” bez CC0. Unsplash i Pexels tylko przez ich API z kluczem Patryka (AGENTS.md, zasada 9).
2. **Pewność licencji:** licencję i autora potwierdzasz na stronie źródła (Wikimedia Commons, Flickr, rawpixel itd.), nie tylko w wyszukiwarce. Odrzucasz zdjęcia, przy których licencja budzi wątpliwość: anonimowy autor przy zdjęciu, które wygląda na firmowe albo reklamowe (ryzyko cudzego zdjęcia z przypisaną licencją), konto na Flickr wrzucające zdjęcia z wielu źródeł, brak daty i autora.
3. **Bez marek i logo**: nazwy producentów maszyn, logo firm, szyldy, opakowania z marką. Mała, nieczytelna tabliczka znamionowa może zostać, jeśli zniknie w kadrze; wtedy zapisz to w uwagach wpisu.
4. **Wizerunek:** rozpowszechnianie wizerunku wymaga zezwolenia osoby (ustawa o prawie autorskim, art. 81 ust. 1); bez zezwolenia wolno, gdy osoba jest powszechnie znana i zdjęcie zrobiono w związku z jej funkcją publiczną albo gdy jest jedynie szczegółem całości, takiej jak zgromadzenie, krajobraz, publiczna impreza (art. 81 ust. 2; Dz.U. 2025 poz. 24, sprawdzone 2026-11-06). W praktyce: ludzie tyłem, z daleka, w tłumie albo same ręce przy pracy; nie rozpoznawalna twarz jako główny motyw.
5. **Bez związku z pracodawcami Patryka** i bez realiów magazynu części samochodowych (SKILL.md, zasada 5). Bez zdjęć generowanych przez AI.
6. **Technika:** co najmniej 1600 px szerokości, ostre, bez znaków wodnych i napisów; da się wykadrować do 16:9 (zdjęcie główne, okładka 1200×630) i 1:1 (karty), nie tracąc sensu.

## Procedura
1. Frazy po angielsku, rzeczowniki konkretne: „changeover die press”, „warehouse picking cart”, „cnc lathe operator hands”. Dwie, trzy frazy, każda osobno:
   `npm run redakcja:zdjecia -- "<fraza>" --artykul=<slug>` (opcje: `--ile=24`, `--min=1600`, `--zrodla=openverse,commons`).
2. Obejrzyj `redakcja/<slug>/zdjecia/stykowka.jpg` narzędziem Read (numery na kafelkach odpowiadają `kandydaci.json`). Odrzuć według kryteriów i zapisz w teczce powód przy każdym odrzuconym z czołówki (np. „2: logo producenta maszyny”).
3. Dla 1–3 najlepszych otwórz stronę źródła (`strona` w `kandydaci.json`): potwierdź licencję, autora, opis, brak zastrzeżeń. Zapisz w teczce adres i datę sprawdzenia.
4. Wpis do rejestru:
   `npm run redakcja:zdjecia -- --wybierz=<nr> --artykul=<slug> --nazwa=<slug-zdjecia> --alt="<co widać>" --dzial=<dział>`
   Alt: konkretnie, co widać (co najmniej 20 znaków, bez „zdjęcie przedstawia”). Popraw w pliku wpisu autora, jeśli wyszukiwarka podała nazwę konta zamiast imienia i nazwiska ze strony źródła.
5. Pobranie i kadrowanie: `npm run zdjecia -- --tylko=<fragment nazwy pliku>`. Gdy ważna część zdjęcia ucieka z kadru, ustaw `pozycja` (top, bottom, left, right) albo `kadr` (ułamki 0–1) we wpisie i pobierz ponownie z `--wymus`.
6. Sprawdź wynik: plik w `src/assets/zdjecia/`, test `npx vitest run src/lib/zdjecia.test.ts`, a po buildzie podglądu okładka `/okladki/<slug>.jpg` i zdjęcie na stronie artykułu (zrzut).
7. W artykule: `zdjecie: <slug-zdjecia>` i `podpisZdjecia`: jedno zdanie, które łączy zdjęcie z tezą i mówi tylko to, co na nim naprawdę widać. Podpis „Fot.” z licencją dochodzi sam z rejestru.
