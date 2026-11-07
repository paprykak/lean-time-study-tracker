// Składa src/content/artykuly/kompletacja-droga.md z teczki. Uruchom: node redakcja/kompletacja-droga/zloz.mjs
import { zloz } from '../wspolne/zloz.mjs';

zloz(import.meta.url, {
  tytul: 'Zanim kupisz roboty do kompletacji, skróć drogę magazyniera',
  tytulSeo: 'Kompletacja zamówień: jak skrócić drogę magazyniera',
  opisSeo: 'Droga to typowo połowa czasu kompletacji. Układ towaru według rotacji i lepsza trasa skróciły ją w naszej symulacji o 33–45%. Od czego zacząć.',
  lead: 'Kompletujący spędza typowo połowę czasu na chodzeniu. W naszej symulacji rozmieszczenie towaru według rotacji i lepsza trasa skróciły tę drogę o 33–45%. Kto kupuje roboty przed uporządkowaniem magazynu, płaci za automatyzację drogi, którą dało się skrócić bez zakupów.',
  dzial: 'magazyn-i-logistyka',
  format: 'Poradnik',
  tematy: ['kompletacja'],
  opublikowano: '2026-11-07',
  zdjecie: 'przenosnik-rolkowy',
  podpisZdjecia: 'Przenośniki rolkowe i taśmowe w zakładzie. Zanim kartony na nie trafią, ktoś musi przejść po towar między regałami.',
  powiazane: ['oee-85-procent'],
  faq: [
    ['Ile czasu kompletującego zajmuje droga?', 'W magazynie, w którym kompletujący sam chodzi do regałów, typowo około połowy: według podziału z podręcznika cytowanego w przeglądzie badań de Kostera i współautorów droga to 50% czasu, szukanie 20%, samo pobranie 15%. W konkretnym magazynie proporcje mogą być inne, dlatego warto je zmierzyć.'],
    ['Czym różni się trasa S-shape od largest gap?', 'Przy S-shape kompletujący przechodzi całą długością każdej alejki, w której ma coś do pobrania. Przy largest gap przechodzi w całości pierwszą i ostatnią alejkę, a do pozostałych wchodzi z przodu, z tyłu albo z obu stron, omijając największą przerwę między pobraniami. Largest gap wygrywa, gdy na alejkę wypada mniej niż około 4 pobrań.'],
    ['Jak ułożyć towar w magazynie według ABC?', 'Podziel indeksy na 2–4 klasy według liczby pobrań (linii zamówień); drogę wydłuża każda wizyta przy regale, a nie wartość towaru. Najczęściej pobierane indeksy połóż najbliżej punktu wydań, najrzadziej pobierane w głębi hali, a klasy przeliczaj co kwartał.'],
    ['Czy strefy kompletacji się opłacają?', 'Mogą dać najwięcej: w polskim badaniu symulacyjnym kompletacja synchroniczna w pięciu strefach skróciła czas o blisko 70%. Wymaga jednak dodatkowej pracy w sortowni albo sortowni automatycznej, a źle dobrane składowanie i trasa mogą wydłużyć czas. Zacznij od rozmieszczenia i trasy.'],
  ],
  metoda: 'Tekst opiera się na przeglądzie badań nad kompletacją de Kostera i in. (2007), rozprawie Le-Duca (2005) i polskim badaniu symulacyjnym z „Optimum. Studia Ekonomiczne” (2017). Własną symulację drogi kompletującego (10 alejek, 600 indeksów, 20% indeksów daje 80% pobrań, 20 tys. zamówień na wariant) policzyliśmy na danych fikcyjnych; kod jest w archiwum redakcji. Podział czasu kompletującego pochodzi z podręcznika cytowanego w przeglądzie, a nie z pomiarów w polskich magazynach. Przykłady są fikcyjne. Konflikt interesów: redaktor naczelny prowadzi doradztwo w operacjach; tekst nie odsyła do jego usług.',
  sprawdzono: '2026-11-07',
  szkic: false,
});
