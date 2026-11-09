// Składa src/content/artykuly/inwentaryzacja-ciagla.md z teczki. Uruchom: node redakcja/inwentaryzacja-ciagla/zloz.mjs
import { zloz } from '../wspolne/zloz.mjs';

zloz(import.meta.url, {
  tytul: 'Roczny spis spełnia ustawę, ale nie naprawi stanów w magazynie',
  tytulSeo: 'Inwentaryzacja ciągła w magazynie: przepisy i plan',
  opisSeo: 'W badaniu 37 sklepów 65% stanów w systemie było błędnych. Co ustawa o rachunkowości mówi o inwentaryzacji ciągłej i jak ułożyć liczenie cykliczne.',
  lead: 'W badaniu 37 sklepów jednej sieci 65% stanów w systemie było błędnych. Spis raz w roku tego nie zmienia, bo błędy narastają od następnego dnia. Ustawa pozwala rozłożyć inwentaryzację zapasów w strzeżonych składowiskach na dwa lata, a liczenie cykliczne powinno poprawić stany, jeśli naprawiasz też przyczyny błędów.',
  dzial: 'magazyn-i-logistyka',
  format: 'Poradnik',
  tematy: ['zapasy'],
  opublikowano: '2026-11-09',
  zdjecie: 'magazyn-inwentaryzacja',
  podpisZdjecia: 'Regały paletowe w centrum dystrybucyjnym; litery na słupkach oznaczają alejki. Stan w systemie jest wart tyle, ile jego zgodność z tym, co naprawdę stoi w każdej lokalizacji.',
  powiazane: ['kompletacja-droga'],
  faq: [
    ['Czy inwentaryzacja ciągła jest zgodna z ustawą o rachunkowości?', 'Ustawa nie używa tego określenia, ale pozwala inwentaryzować zapasy materiałów, towarów, produktów gotowych i półproduktów w strzeżonych składowiskach, objętych ewidencją ilościowo-wartościową, raz w ciągu dwóch lat (art. 26 ust. 3 pkt 2). Na tej podstawie firmy rozkładają spis na cały okres. O szczegółach decyduje polityka rachunkowości, więc ustal je z głównym księgowym i biegłym rewidentem.'],
    ['Jak często liczyć indeksy w liczeniu cyklicznym?', 'Częściej tam, gdzie jest najwięcej przyjęć, pobrań i przesunięć, bo przy nich powstają błędy. W przykładzie z tekstu indeksy z największą liczbą operacji liczy się co miesiąc, średnie co kwartał, a pozostałe raz w roku, co daje około 98 liczeń dziennie przy 6 000 indeksów.'],
    ['Jak zmierzyć dokładność stanów magazynowych?', 'Wylosuj lokalizacje, policz je bez podglądu stanu z systemu i podziel liczbę zgodnych przez liczbę policzonych. Licz ilość, nie wartość, i zwiększ próbę, jeśli chcesz śledzić zmiany z tygodnia na tydzień.'],
    ['Dlaczego stany w systemie się nie zgadzają?', 'Błąd może powstać przy każdym przyjęciu, pobraniu i przesunięciu. W symulacji systemu zapasów sklepu głównymi przyczynami były ubytki na zapleczu i na półce, a w badaniu 37 sklepów mniej błędnych rekordów wiązało się z praktykami audytu stanów.'],
  ],
  metoda: 'Tekst opiera się na badaniu prawie 370 tys. rekordów stanów z „Management Science” (czytanym w streszczeniu, bo pełny tekst jest płatny), pracy o przyczynach błędów (symulacja i dane z pięciu sklepów), symulacji centrum dystrybucyjnego i tekście jednolitym ustawy o rachunkowości z 2026 r. Model narastania błędów policzyliśmy na danych fikcyjnych; kod jest w archiwum redakcji. Przykład hurtowni jest fikcyjny. Tekst nie jest poradą prawną ani księgową. Konflikt interesów: redaktor naczelny prowadzi doradztwo w operacjach; tekst nie odsyła do jego usług.',
  sprawdzono: '2026-11-09',
  szkic: false,
});
