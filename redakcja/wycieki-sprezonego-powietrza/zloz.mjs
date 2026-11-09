// Składa src/content/artykuly/wycieki-sprezonego-powietrza.md z teczki. Uruchom: node redakcja/wycieki-sprezonego-powietrza/zloz.mjs
import { zloz } from '../wspolne/zloz.mjs';

zloz(import.meta.url, {
  tytul: 'Nie podnoś ciśnienia, tylko uszczelnij sieć sprężonego powietrza',
  tytulSeo: 'Koszt wycieku sprężonego powietrza i jak go zmierzyć',
  opisSeo: 'Otwór 3 mm przy 6 barach to do 25 tys. zł rocznie, gdy sieć pracuje całą dobę. Jak w sobotę zmierzyć wycieki sprężonego powietrza i ich koszt.',
  lead: 'Według szacunku Departamentu Energii USA wycieki zabierają w zaniedbanej sieci około jednej piątej wydajności sprężarek. Otwór 3 mm przy 6 barach to w naszym rachunku do 25 tys. zł rocznie, gdy sieć jest pod ciśnieniem całą dobę. Kto podnosi ciśnienie zamiast uszczelnić sieć, płaci więcej i powiększa wycieki.',
  dzial: 'produkcja',
  format: 'Poradnik',
  tematy: ['energia'],
  opublikowano: '2026-11-09',
  zdjecie: 'sprezarkownia-winterslag',
  podpisZdjecia: 'Hala sprężarek dawnej kopalni Winterslag w Genk. Każdy metr sześcienny powietrza, który ucieka przez nieszczelność, ktoś najpierw musiał sprężyć.',
  powiazane: ['oee-85-procent'],
  faq: [
    ['Ile kosztuje wyciek sprężonego powietrza?', 'Zależy od średnicy otworu, ciśnienia, ceny prądu i godzin pracy sieci. W naszym rachunku przy 6 barach i cenie 0,7685 zł za kWh otwór 1 mm kosztuje około 2 800 zł rocznie, 2 mm około 11 300 zł, a 3 mm około 25 500 zł, jeśli sieć jest pod ciśnieniem przez cały rok. Przy dwóch zmianach te kwoty są mniej więcej o połowę niższe.'],
    ['Jak sprawdzić, ile powietrza ucieka z instalacji?', 'Gdy żadne urządzenie nie pobiera powietrza, zmierz, ile minut sprężarka pracuje pod obciążeniem (T) i ile odpoczywa (t). Udział wycieków to T × 100 / (T + t). Przy sprężarce z falownikiem zmierz czas spadku ciśnienia w sieci od ciśnienia roboczego do mniej więcej jego połowy i użyj wzoru z pojemnością sieci.'],
    ['Jaki poziom wycieków jest normalny?', 'Poradnik Departamentu Energii USA szacuje, bez podania metody, że zakład, który nie dba o szczelność, traci około 20% wydajności sprężarek, a systematyczne wyszukiwanie i naprawa wycieków mogą obniżyć je poniżej 5–10%.'],
    ['Czy obniżenie ciśnienia daje oszczędności?', 'Tak, ale dopiero po uszczelnieniu sieci. Każde 2 psi (ok. 0,14 bara) więcej to około 1% więcej energii przy pełnej wydajności sprężarki, a wyższe ciśnienie zwiększa też przepływ przez każdy wyciek.'],
  ],
  metoda: 'Tekst opiera się na poradniku Departamentu Energii USA (Compressed Air Challenge), materiałach niemieckiej kampanii „Druckluft effizient” (Fraunhofer ISI), danych Eurostatu o cenach energii dla firm w Polsce i dwóch badaniach recenzowanych. Koszt wycieków policzyliśmy z równania przepływu przez otwór; model odtwarza tabelę Departamentu Energii, a kod jest w archiwum redakcji. Recenzowanych pomiarów udziału wycieków w wielu zakładach nie znaleźliśmy. Przykłady są fikcyjne. Konflikt interesów: redaktor naczelny prowadzi doradztwo w operacjach; tekst nie odsyła do jego usług.',
  sprawdzono: null,
  szkic: true,
});
