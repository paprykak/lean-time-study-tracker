// Składa src/content/artykuly/smed-przezbrojenia.md z teczki. Uruchom: node redakcja/smed-przezbrojenia/zloz.mjs
import { zloz } from '../wspolne/zloz.mjs';

zloz(import.meta.url, {
  tytul: 'Skracaj przezbrojenia najpierw na wąskim gardle',
  tytulSeo: 'SMED: ile daje skrócenie przezbrojenia i gdzie zacząć',
  opisSeo: 'SMED skraca przezbrojenia o 20–90%, zależnie od przypadku. Na wąskim gardle odzyskany czas to produkcja, gdzie indziej głównie czas ustawiaczy.',
  lead: 'Opisane wdrożenia SMED skracają przezbrojenia od około 20% do 90%. Ile to warte, zależy od miejsca: na wąskim gardle odzyskana godzina może stać się sprzedaną produkcją, a gdzie indziej oszczędzasz głównie czas ustawiaczy, i to tylko wtedy, gdy zrobią w nim coś innego.',
  dzial: 'lean-i-ciagle-doskonalenie',
  format: 'Poradnik',
  tematy: ['smed'],
  opublikowano: '2026-11-07',
  zdjecie: 'linia-montazu-elektroniki',
  podpisZdjecia: 'Linia montażu z instrukcjami nad stanowiskami. Każda zmiana wyrobu na takiej linii to przezbrojenie, które da się nagrać i skrócić.',
  powiazane: ['oee-85-procent'],
  faq: [
    ['Co to jest SMED?', 'SMED (Single Minute Exchange of Die) to metoda skracania przezbrojeń, którą rozwinął Shigeo Shingo; nazwa oznacza przezbrojenie w jednocyfrowej liczbie minut. Najpierw obserwuje się i nagrywa przezbrojenie, potem rozdziela czynności wymagające zatrzymanej maszyny od tych, które można zrobić w trakcie jej pracy, przenosi jak najwięcej czynności do pracy maszyny, a na końcu usprawnia i standaryzuje resztę.'],
    ['O ile SMED skraca przezbrojenie?', 'W opisanych przypadkach od około 20% do 90%. Przegląd 30 artykułów, głównie z przemysłu spożywczego, przytacza skrócenia od 20% do 49% i w jednym projekcie około 67%, a inne opisy podają 59–90%. Polskie badanie opisuje skrócenie o 37,67%. Tylko co trzeci opis mówi o ograniczeniach, więc przeciętny wynik może być niższy.'],
    ['Gdzie zacząć skracanie przezbrojeń?', 'Na maszynie, która ogranicza wydajność całego zakładu, czyli na wąskim gardle. Tam odzyskany czas może zamienić się w dodatkową produkcję albo zastąpić nadgodziny. Na maszynach z wolnym czasem krótsze przezbrojenie oszczędza głównie czas ustawiaczy i pozwala na mniejsze partie.'],
    ['Jak policzyć opłacalną wielkość partii?', 'Klasycznym wzorem Harrisa: partia rośnie z pierwiastkiem z iloczynu popytu i kosztu przezbrojenia, podzielonego przez koszt utrzymania sztuki w zapasie. Przezbrojenie krótsze o połowę zmniejsza więc opłacalną partię o około 29%, a nie o połowę.'],
  ],
  metoda: 'Tekst opiera się na przeglądzie 30 artykułów o SMED, głównie z przemysłu spożywczego (2022), polskim badaniu z Politechniki Rzeszowskiej (2015), badaniu ankietowym 250 pracowników zakładów w Meksyku (2017) i wzorze Harrisa na wielkość partii (1915). Rachunki dla wąskiego gardła i dla maszyny z wolnym czasem policzyliśmy na danych fikcyjnych; kod jest w archiwum redakcji. Wyniki wdrożeń pochodzą z opisów pojedynczych przypadków, a tylko co trzeci opisuje ograniczenia. Przykłady są fikcyjne. Konflikt interesów: redaktor naczelny prowadzi doradztwo w operacjach; tekst nie odsyła do jego usług.',
  sprawdzono: null,
  szkic: true,
});
