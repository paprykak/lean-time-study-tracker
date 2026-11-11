// Składa src/content/artykuly/obciazenie-maszyn.md z teczki. Uruchom: node redakcja/obciazenie-maszyn/zloz.mjs
import { zloz } from '../wspolne/zloz.mjs';

zloz(import.meta.url, {
  tytul: 'Obciążenie maszyny 95% daje kolejkę, a nie wydajność',
  tytulSeo: 'Jak obliczyć obciążenie maszyny i kiedy rośnie kolejka',
  opisSeo: 'Z 80 do 95% obciążenia: o 19% więcej zleceń i cztery razy dłuższy czas przejścia. Jak policzyć obciążenie maszyny, kolejkę i kiedy dokładać zleceń.',
  lead: 'Dociążenie wąskiego gardła z 80 do 95% daje w naszym przykładzie o 19% więcej zleceń, ale czterokrotnie dłuższy czas przejścia. Tak działa każda kolejka ze zmiennością: im bliżej 100%, tym szybciej rośnie czekanie. Zanim dołożysz zleceń, zmniejsz zmienność.',
  dzial: 'lean-i-ciagle-doskonalenie',
  format: 'Poradnik',
  tematy: ['przeplyw'],
  opublikowano: '2026-11-11',
  zdjecie: 'hala-pusta',
  podpisZdjecia: '',
  powiazane: ['smed-przezbrojenia', 'oee-85-procent'],
  faq: [
    ['Jak obliczyć obciążenie maszyny?', 'Podziel czas potrzebny na zaplanowane zlecenia, razem z przezbrojeniami, przez czas dostępny po odjęciu przerw i planowanych przeglądów. Na przykład 128 zleceń po 30 minut to 3 840 minut; przy 4 800 minutach dostępnych w tygodniu obciążenie wynosi 80%.'],
    ['Do ilu procent można obciążyć maszynę?', 'Nie ma jednej granicy, bo czas czekania zależy także od zmienności. W modelu kolejki przy dużej zmienności zlecenie czeka 4 czasy obróbki przy 80% obciążenia i 19 przy 95%; przy małej zmienności te same 95% kosztują niecałe 5 czasów obróbki. Powyżej 85% najpierw zmniejsz zmienność, a dopiero potem dokładaj zleceń.'],
    ['Co mówi prawo Little’a?', 'Średnia liczba elementów w systemie równa się średniemu tempu ich napływu pomnożonemu przez średni czas w systemie. W produkcji: zapas w toku przed maszyną i na niej rośnie razem z czasem czekania, więc dłuższa kolejka to więcej wózków z detalami na hali.'],
    ['Ile wynosi wykorzystanie mocy produkcyjnych w Polsce?', 'Według Eurostatu przetwórstwo przemysłowe w Polsce pracowało w IV kwartale 2026 r. średnio na 78,4% mocy, tyle samo co średnia Unii Europejskiej. To odpowiedzi firm w ankiecie koniunktury, a nie pomiar maszyn.'],
  ],
  metoda: 'Tekst opiera się na twierdzeniu Little’a (Little 2011), wzorach dla kolejki przed jednym stanowiskiem (podręcznik Larsona i Odoniego, przybliżenie Kingmana), danych Eurostatu o wykorzystaniu mocy w przetwórstwie (ankieta koniunktury) i badaniu jednego zakładu przetwórstwa polimerów (Nieto i in. 2010). Krzywe kolejki policzyliśmy wzorem i sprawdziliśmy symulacją 400 tys. zleceń; kod jest w archiwum redakcji. Przykład frezarki jest fikcyjny. Konflikt interesów: redaktor naczelny prowadzi doradztwo w operacjach; tekst nie odsyła do jego usług.',
  sprawdzono: null,
  szkic: true,
});
