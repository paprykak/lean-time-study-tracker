// Składa src/content/artykuly/smed-przezbrojenia.md z teczki. Uruchom: node redakcja/smed-przezbrojenia/zloz.mjs
import { zloz } from '../wspolne/zloz.mjs';

zloz(import.meta.url, {
  tytul: 'Skracaj przezbrojenia najpierw na wąskim gardle',
  tytulSeo: 'SMED: ile daje skrócenie przezbrojenia i gdzie zacząć',
  opisSeo: 'Wdrożenia SMED skracają przezbrojenia zwykle o 20–50%, nie o 90%. Na wąskim gardle zysk rośnie z odzyskanym czasem, gdzie indziej tylko z pierwiastkiem.',
  lead: 'Opublikowane wdrożenia SMED skracają przezbrojenia zwykle o 20–50%, a nie o 90%. Ile to warte, zależy od miejsca: na wąskim gardle każda odzyskana godzina to sprzedana produkcja, a gdzie indziej przezbrojenie krótsze o połowę obniża koszt partii i zapasu tylko o 29%.',
  dzial: 'lean-i-ciagle-doskonalenie',
  format: 'Poradnik',
  tematy: ['smed'],
  opublikowano: '2026-11-07',
  zdjecie: 'linia-montazu-elektroniki',
  podpisZdjecia: 'Linia montażu z instrukcjami nad stanowiskami. Każda zmiana wyrobu na takiej linii to przezbrojenie, które da się nagrać i skrócić.',
  powiazane: ['oee-85-procent'],
  faq: [
    ['Co to jest SMED?', 'SMED (Single Minute Exchange of Die) to metoda skracania przezbrojeń, którą rozwinął Shigeo Shingo. Najpierw rozdziela się czynności wymagające zatrzymanej maszyny od tych, które można zrobić w trakcie jej pracy, potem przenosi jak najwięcej czynności do pracy maszyny i upraszcza resztę.'],
    ['O ile SMED skraca przezbrojenie?', 'W opublikowanych przypadkach zwykle o 20–50%: przegląd 30 artykułów z przemysłu spożywczego przytacza wyniki od 21% do około 67%, a polskie badanie opisuje skrócenie o 37,67%. Już pierwszy etap, rozdzielenie czynności, ma według literatury skracać przezbrojenie o 30–50%.'],
    ['Gdzie zacząć skracanie przezbrojeń?', 'Na maszynie, która ogranicza wydajność całego zakładu, czyli na wąskim gardle. Tam odzyskany czas zamienia się w dodatkową produkcję. Na maszynach z wolnym czasem krótsze przezbrojenie daje mniejsze partie, a oszczędność rośnie tylko z pierwiastkiem kosztu przezbrojenia.'],
    ['Jak policzyć opłacalną wielkość partii?', 'Klasycznym wzorem Harrisa: partia rośnie z pierwiastkiem z iloczynu popytu i kosztu przezbrojenia, podzielonego przez koszt utrzymania sztuki w zapasie. Z tego samego wzoru wynika, że przezbrojenie krótsze o połowę obniża roczny koszt przezbrojeń i zapasu o około 29%.'],
  ],
  metoda: 'Tekst opiera się na przeglądzie 30 artykułów o SMED w przemyśle spożywczym (2022), polskim badaniu z Politechniki Rzeszowskiej (2015), badaniu ankietowym 250 pracowników zakładów w Meksyku (2017) i wzorze Harrisa na wielkość partii (1915). Rachunki dla wąskiego gardła i dla linii z wolnym czasem policzyliśmy na danych fikcyjnych; kod jest w archiwum redakcji. Wyniki wdrożeń pochodzą z opisów przypadków, które częściej opisują sukcesy niż porażki. Przykłady są fikcyjne. Konflikt interesów: redaktor naczelny prowadzi doradztwo w operacjach; tekst nie odsyła do jego usług.',
  sprawdzono: null,
  szkic: true,
});
