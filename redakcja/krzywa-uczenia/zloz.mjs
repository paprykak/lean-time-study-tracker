// Składa src/content/artykuly/krzywa-uczenia.md z teczki. Uruchom: node redakcja/krzywa-uczenia/zloz.mjs
import { zloz } from '../wspolne/zloz.mjs';

zloz(import.meta.url, {
  tytul: 'Wdrożenie nowej osoby mierz w sztukach, nie w dniach szkolenia',
  tytulSeo: 'Krzywa uczenia: kiedy nowy pracownik osiąga normę',
  opisSeo: 'Nauka przy pracy ręcznej trwa setki sztuk, a jej koszt skupia się w pierwszych. Jak zmierzyć krzywą uczenia nowej osoby i próbować ją skrócić.',
  lead: 'Plan wdrożenia nowej osoby na linii liczy się w dniach, a nauka w sztukach. W jednym z badań montażu ręcznego czas sztuki spadał przez około 160 sztuk, a większość kosztu nauki przypadła na pierwszą setkę. Pokazujemy, jak zmierzyć tę krzywą u siebie i jak próbować ją skrócić.',
  dzial: 'ludzie-i-szkolenia',
  format: 'Poradnik',
  tematy: ['matryca-kompetencji'],
  opublikowano: '2026-11-07',
  zdjecie: 'warsztat-szkoleniowy',
  podpisZdjecia: 'Warsztat szkoleniowy przy tokarkach. Na hali nauka trwa dłużej niż kurs: liczy się w sztukach, a nie w dniach.',
  powiazane: ['smed-przezbrojenia'],
  faq: [
    ['Co to jest krzywa uczenia?', 'To zależność czasu pracy od łącznej liczby wykonanych sztuk. W modelu opisanym dla produkcji w 1936 r. czas spada o stały procent przy każdym podwojeniu liczby sztuk, a w praktyce po pewnym czasie przestaje spadać i ustala się na stałym poziomie.'],
    ['Kiedy nowy pracownik osiąga normę?', 'To trzeba zmierzyć na własnym stanowisku. W badaniu ręcznego montażu wiązek przewodów czas sztuki ustalał się według modelu autorów między 157. a 298. sztuką, w tych eksperymentach, w których się ustalił. Zapisuj codziennie liczbę sztuk i godzin nowej osoby i sprawdź, kiedy jej czas na sztukę przestaje wyraźnie spadać.'],
    ['Co to jest instruktaż stanowiskowy TWI?', 'Job Instruction to moduł programu Training Within Industry z lat 40. Instruktor najpierw rozpisuje pracę na kroki i kluczowe punkty, a potem uczy w czterech krokach: przygotuj pracownika, pokaż operację, daj spróbować i sprawdzaj dalej, stopniowo wycofując się z opieki.'],
    ['Jak policzyć koszt wdrożenia nowego pracownika?', 'Poza rekrutacją i szkoleniem wstępnym policz godziny produkcji poniżej normy: dla każdego tygodnia różnicę między normą a wydajnością nowej osoby razy przepracowane godziny. Suma tych godzin to koszt drogi do normy, który można porównywać między instruktorami i zmianami.'],
  ],
  metoda: 'Tekst opiera się na danych GUS o wolnych miejscach pracy (2026), pomiarach czasu montażu wiązek przewodów z Politechniki w Kownie (2014), pracy o zapominaniu w krzywej uczenia (2022), rozdziale o historii krzywej uczenia przy produkcji bombowca B-17 (1999), raporcie programu Training Within Industry (1945) i badaniu firm zgłoszonych do tego programu (NBER, 2021). Koszt drogi do normy policzyliśmy na danych z opublikowanej tabeli; kod jest w archiwum redakcji. Wyniki programu z 1945 r. to oświadczenia zakładów, bez grupy porównawczej. Przykłady są fikcyjne. Konflikt interesów: redaktor naczelny prowadzi doradztwo w operacjach; tekst nie odsyła do jego usług.',
  sprawdzono: null,
  szkic: true,
});
