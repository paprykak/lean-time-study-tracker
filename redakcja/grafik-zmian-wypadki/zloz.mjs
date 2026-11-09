// Składa src/content/artykuly/grafik-zmian-wypadki.md z teczki. Uruchom: node redakcja/grafik-zmian-wypadki/zloz.mjs
import { zloz } from '../wspolne/zloz.mjs';

zloz(import.meta.url, {
  tytul: 'Na czwartej nocy z rzędu ryzyko wypadku jest o jedną trzecią wyższe',
  tytulSeo: 'Zmiany nocne i 12-godzinne a ryzyko wypadku',
  opisSeo: 'Kolejne noce, długie zmiany i praca bez przerwy wiążą się z wyższym ryzykiem wypadku. Pięć pytań, którymi sprawdzisz grafik zmian, zanim trafi na tablicę.',
  lead: 'Na czwartej nocy z rzędu ryzyko wypadku jest o około jedną trzecią wyższe niż na pierwszej, a wyższe ryzyko wiąże się też z długimi zmianami i pracą bez przerwy. Grafik zmian jest więc decyzją o bezpieczeństwie, a nie tylko o obsadzie. Da się go sprawdzić w pięciu pytaniach, zanim trafi na tablicę.',
  dzial: 'ludzie-i-szkolenia',
  format: 'Poradnik',
  tematy: ['czas-pracy'],
  opublikowano: '2026-11-09',
  zdjecie: 'zaklady-kawasaki-noca',
  podpisZdjecia: 'Zakłady przemysłowe w Kawasaki nocą. W zakładach o ruchu ciągłym ktoś zawsze jest na zmianie, a to grafik decyduje, ile nocy z rzędu przepracuje.',
  powiazane: ['krzywa-uczenia'],
  faq: [
    ['Czy zmiany 12-godzinne są legalne?', 'Tak, w systemie równoważnego czasu pracy Kodeks pracy pozwala wydłużyć dobowy wymiar do 12 godzin, jeśli uzasadnia to rodzaj lub organizacja pracy, zwykle w okresie rozliczeniowym do miesiąca (art. 135). Pracujący w nocy, który wykonuje prace szczególnie niebezpieczne albo związane z dużym wysiłkiem fizycznym lub umysłowym, nie może jednak pracować dłużej niż 8 godzin na dobę (art. 151⁷ § 3). Wątpliwe przypadki rozstrzygnie prawnik.'],
    ['Ile nocy z rzędu to bezpiecznie?', 'Badania nie wyznaczają bezpiecznej granicy, ale pokazują, że ryzyko rośnie z każdą kolejną nocą: według przeglądu badań z 2005 r. na drugiej nocy o około 6%, na trzeciej o 17%, a na czwartej o 36% względem pierwszej.'],
    ['Jakie przerwy przysługują przy zmianie 12-godzinnej?', 'Kodeks pracy daje co najmniej 15 minut przerwy przy dobowym wymiarze czasu pracy od 6 godzin i kolejne co najmniej 15 minut, gdy wymiar jest dłuższy niż 9 godzin (art. 134 § 1). Badania pokazują, że ryzyko wypadku rośnie z czasem od ostatniej przerwy, więc liczy się też ich rozłożenie.'],
    ['Czy praca w nocy zwiększa ryzyko wypadku?', 'Według metaanalizy z 2017 r. ryzyko urazu na zmianie nocnej jest o około 36% wyższe niż na rannej (14 badań). Przegląd z 2025 r. potwierdza kierunek, ale ocenia pewność dowodów jako niską lub bardzo niską.'],
  ],
  metoda: 'Tekst opiera się na przeglądzie badań z 2005 r. (Folkard, Lombardi, Tucker), metaanalizach z 2017 i 2021 r., przeglądzie systematycznym z 2025 r., danych GUS o wypadkach przy pracy w 2024 r. i tekście jednolitym Kodeksu pracy z 2026 r. Metaanalizę z 2017 r. czytaliśmy w streszczeniu, bo pełny tekst jest płatny. Pewność dowodów oceniana w przeglądach jest niska. Przykład zakładu jest fikcyjny. Tekst nie jest poradą prawną. Konflikt interesów: redaktor naczelny prowadzi doradztwo w operacjach; tekst nie odsyła do jego usług.',
  sprawdzono: null,
  szkic: true,
});
