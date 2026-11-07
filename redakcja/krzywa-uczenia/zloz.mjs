// Składa src/content/artykuly/krzywa-uczenia.md z teczki. Uruchom: node redakcja/krzywa-uczenia/zloz.mjs
import { zloz } from '../wspolne/zloz.mjs';

zloz(import.meta.url, {
  tytul: 'Do normy dochodzi się po setkach sztuk, nie po pierwszym tygodniu',
  tytulSeo: 'Krzywa uczenia: kiedy nowy pracownik osiąga normę',
  opisSeo: 'Czas montażu spada przez setki sztuk, zanim osiągnie normę. Jak zmierzyć krzywą uczenia nowej osoby i skrócić wdrożenie instruktażem w czterech krokach.',
  lead: 'Plan wdrożenia nowej osoby na linii liczy się w dniach, a norma przychodzi po setkach sztuk. W montażu ręcznym czas jednej sztuki spadał przez 163 sztuki. Pokazujemy, jak zmierzyć tę krzywą u siebie i jak ją skrócić instruktażem, który ma strukturę.',
  dzial: 'ludzie-i-szkolenia',
  format: 'Poradnik',
  tematy: ['matryca-kompetencji'],
  opublikowano: '2026-11-07',
  zdjecie: 'warsztat-szkoleniowy',
  podpisZdjecia: 'Warsztat szkoleniowy przy tokarkach. Na hali nauka trwa dłużej niż kurs: liczy się w sztukach, a nie w dniach.',
  powiazane: ['smed-przezbrojenia'],
  faq: [
    ['Co to jest krzywa uczenia?', 'To zależność czasu pracy od łącznej liczby wykonanych sztuk. W klasycznym modelu z 1936 r. czas spada o stały procent przy każdym podwojeniu liczby sztuk, a w praktyce po pewnym czasie przestaje spadać i ustala się na stałym poziomie.'],
    ['Kiedy nowy pracownik osiąga normę?', 'To trzeba zmierzyć na własnym stanowisku. W badaniu ręcznego montażu wiązek przewodów czas sztuki przestawał spadać między 58. a 298. sztuką, zależnie od eksperymentu. Zapisuj codziennie liczbę sztuk i godzin nowej osoby i sprawdź, kiedy jej czas na sztukę przestaje wyraźnie spadać.'],
    ['Co to jest instruktaż stanowiskowy TWI?', 'Job Instruction to moduł programu Training Within Industry z lat 40. Instruktor najpierw rozpisuje pracę na kroki i kluczowe punkty, a potem uczy w czterech krokach: przygotuj pracownika, pokaż operację, daj spróbować i sprawdzaj dalej, stopniowo wycofując się z opieki.'],
    ['Jak policzyć koszt wdrożenia nowego pracownika?', 'Poza rekrutacją i szkoleniem wstępnym policz godziny produkcji poniżej normy: dla każdego tygodnia różnicę między normą a wydajnością nowej osoby razy przepracowane godziny. Suma tych godzin to koszt drogi do normy, który można porównywać między instruktorami i zmianami.'],
  ],
  metoda: 'Tekst opiera się na danych GUS o wolnych miejscach pracy (2026), pomiarach czasu montażu wiązek przewodów z Politechniki w Kownie (2014), pracy o zapominaniu w krzywej uczenia (2022), analizie danych Wrighta (1999), raporcie programu Training Within Industry (1945) i badaniu firm zgłoszonych do tego programu (NBER, 2021). Koszt drogi do normy policzyliśmy na danych z opublikowanej tabeli; kod jest w archiwum redakcji. Wyniki programu z 1945 r. to oświadczenia zakładów, bez grupy porównawczej. Przykłady są fikcyjne. Konflikt interesów: redaktor naczelny prowadzi doradztwo w operacjach; tekst nie odsyła do jego usług.',
  sprawdzono: null,
  szkic: true,
});
