// Treści PRZYKŁADOWE (fikcyjne) do podglądu szablonów strony głównej i artykułu (/podglad/*, noindex).
// Tytuły w formie poradników, bez twierdzeń o prawdziwych firmach i zdarzeniach. Nie trafiają do kolekcji treści.
import type { ArtykulKarta } from '../lib/typy';
import { zdjecie } from '../lib/zdjecia';
import ustawienia from './ustawienia.json';

const dzial = (slug: string) => {
  const d = ustawienia.dzialy.find((x) => x.slug === slug)!;
  return { nazwa: d.nazwa, adres: `/dzial/${d.slug}` };
};
const czas = (iso: string) => new Date(iso);
const R = 'Redakcja Rytmu Hali';

const a = (tytul: string, slug: string, dz: string, iso: string, extra: Partial<ArtykulKarta> = {}): ArtykulKarta => ({
  tytul,
  adres: `/przyklad-${slug}`,
  kategoria: dzial(dz),
  data: czas(iso),
  autor: R,
  ...extra,
});

export const GLOWNY = a('Przezbrojenie krótsze o połowę bez nowych maszyn: SMED krok po kroku', 'smed', 'produkcja', '2026-11-06T06:40:00Z', {
  lead: 'Większość czasu przezbrojenia to czynności, które można zrobić, zanim maszyna stanie. Pokazujemy, jak je wyłowić z nagrania i ułożyć na nowo.',
  czasCzytania: 9,
  zdjecie: zdjecie('robot-spawalniczy'),
});

export const OBOK_GLOWNEGO = [
  a('Magazyn w szczycie sezonu: pięć wskaźników, które warto liczyć codziennie', 'wskazniki-magazynu', 'magazyn-i-logistyka', '2026-11-06T05:15:00Z', { zdjecie: zdjecie('magazyn-wozek-regaly') }),
  a('Tablica wyników na hali: co pokazywać zmianie, a co kierownictwu', 'tablica-wynikow', 'lean-i-ciagle-doskonalenie', '2026-11-05T14:20:00Z', { zdjecie: zdjecie('sciana-karteczek') }),
  a('Dane z maszyn bez wielkiego wdrożenia: od czego zacząć pomiar OEE', 'pomiar-oee', 'dane-i-ai', '2026-11-05T09:05:00Z', { zdjecie: zdjecie('robot-cleanroom') }),
];

export const NAJNOWSZE = [
  a('Instruktaż stanowiskowy dla nowych pracowników: jak skrócić wdrożenie na zmianie', 'instruktaz', 'ludzie-i-szkolenia', '2026-11-04T11:30:00Z', {
    lead: 'Cztery kroki instruktażu i karta rozbioru pracy. Bez prezentacji, przy stanowisku.',
    zdjecie: zdjecie('warsztat-szkoleniowy'),
  }),
  a('Ekran operatora, który pomaga: czego nie pokazywać na pulpicie SCADA', 'ekran-operatora', 'dane-i-ai', '2026-11-04T08:10:00Z', {
    lead: 'Mniej liczb, więcej stanów. Jak projektować widok dla zmiany, a nie dla działu IT.',
    zdjecie: zdjecie('stanowisko-scada'),
  }),
  a('Sortownia bez korków: jak zaplanować okna przyjęć i wydań', 'okna-przyjec', 'magazyn-i-logistyka', '2026-11-03T13:45:00Z', {
    lead: 'Harmonogram awizacji, bufor przy rampie i jedna tablica dla spedycji.',
    zdjecie: zdjecie('sortownia-kartony'),
  }),
  a('Instrukcja stanowiskowa, którą ktoś przeczyta: jedna kartka, zdjęcia, kluczowe punkty', 'instrukcja-stanowiskowa', 'lean-i-ciagle-doskonalenie', '2026-11-03T07:30:00Z', {
    lead: 'Dlaczego segregator przy linii nie działa i jak zrobić standard pracy na jednej stronie.',
    zdjecie: zdjecie('linia-montazu-elektroniki'),
  }),
];

export const SEKCJA_PRODUKCJA = {
  wiodacy: a('Mikroprzestoje: jak je zobaczyć, zanim zjedzą zmianę', 'mikroprzestoje', 'produkcja', '2026-11-02T10:00:00Z', {
    lead: 'Krótkie zatrzymania rzadko trafiają do raportów, a sumują się w godziny. Prosty sposób na ich pomiar bez systemu MES.',
    zdjecie: zdjecie('hala-pusta'),
  }),
  lista: [
    a('Plan produkcji w arkuszu: pięć sygnałów, że czas na zmianę narzędzia', 'plan-w-arkuszu', 'produkcja', '2026-11-01T09:00:00Z'),
    a('Odprawa na początku zmiany w 10 minut: wzór i najczęstsze błędy', 'odprawa', 'produkcja', '2026-10-31T06:20:00Z'),
    a('Kontrola pierwszej sztuki po przezbrojeniu: kto podpisuje i kiedy', 'pierwsza-sztuka', 'produkcja', '2026-10-30T12:15:00Z'),
  ],
};

export const SEKCJA_MAGAZYN = {
  wiodacy: a('Przenośniki czy wózki: od czego zależy wybór w średnim magazynie', 'przenosniki-czy-wozki', 'magazyn-i-logistyka', '2026-11-02T08:00:00Z', {
    lead: 'Przepływ, zmienność asortymentu i koszt zmiany układu. Pytania, które warto zadać przed rozmową z dostawcą.',
    zdjecie: zdjecie('przenosnik-rolkowy'),
  }),
  lista: [
    a('Inwentaryzacja ciągła zamiast rocznej: od czego zacząć', 'inwentaryzacja-ciagla', 'magazyn-i-logistyka', '2026-11-01T11:40:00Z'),
    { ...a('Automatyczne wózki w magazynie średniej wielkości: koszty i pierwsze miesiące', 'material-partnera', 'magazyn-i-logistyka', '2026-10-31T08:00:00Z'), kategoria: undefined, partner: 'Partner przykładowy' },
    a('Kompletacja falowa czy strefowa: prosty test na danych z jednego tygodnia', 'kompletacja', 'magazyn-i-logistyka', '2026-10-29T14:00:00Z'),
  ],
};

export const KOLUMNY = [
  {
    dzial: dzial('lean-i-ciagle-doskonalenie'),
    lista: [
      a('5S bez akcji sprzątania: jak utrzymać standard po pierwszym tygodniu', '5s', 'lean-i-ciagle-doskonalenie', '2026-11-02T07:00:00Z'),
      a('Kaizen w małym zakładzie: jeden problem tygodniowo zamiast warsztatów', 'kaizen', 'lean-i-ciagle-doskonalenie', '2026-10-30T09:30:00Z'),
      a('Gemba walk kierownika: trzy pytania, które warto zadawać codziennie', 'gemba', 'lean-i-ciagle-doskonalenie', '2026-10-28T06:50:00Z'),
      a('Mapowanie strumienia wartości w dwa dni: co przygotować przed warsztatem', 'vsm', 'lean-i-ciagle-doskonalenie', '2026-10-27T10:10:00Z'),
    ],
  },
  {
    dzial: dzial('dane-i-ai'),
    lista: [
      a('Asystent AI w dziale planowania: trzy zadania, w których się sprawdza, i dwa, w których nie', 'asystent-ai', 'dane-i-ai', '2026-11-01T13:00:00Z'),
      a('Słownik przestojów: bez wspólnych definicji OEE nic nie mówi', 'slownik-przestojow', 'dane-i-ai', '2026-10-31T10:30:00Z'),
      a('Raport zmiany z arkusza w 15 minut: automatyzacja bez programisty', 'raport-zmiany', 'dane-i-ai', '2026-10-29T08:40:00Z'),
      a('Czujnik na starej maszynie: co da się zmierzyć za mniej niż koszt jednego przestoju', 'czujnik', 'dane-i-ai', '2026-10-27T12:00:00Z'),
    ],
  },
  {
    dzial: dzial('ludzie-i-szkolenia'),
    lista: [
      a('Matryca kompetencji na jednej kartce: kogo przeszkolić w pierwszej kolejności', 'matryca', 'ludzie-i-szkolenia', '2026-11-02T09:15:00Z'),
      a('Lider zmiany po awansie z linii: pierwsze 90 dni', 'lider-zmiany', 'ludzie-i-szkolenia', '2026-10-30T07:45:00Z'),
      a('Rozmowa po błędzie na stanowisku: jak szukać przyczyny, a nie winnego', 'rozmowa-po-bledzie', 'ludzie-i-szkolenia', '2026-10-28T11:20:00Z'),
      a('Rotacja na stanowiskach: kiedy pomaga, a kiedy tylko przenosi problem', 'rotacja', 'ludzie-i-szkolenia', '2026-10-26T09:00:00Z'),
    ],
  },
];

export const NA_ZMIANIE_PODGLAD = [
  { tytul: 'Nowy wzór do pobrania: karta obserwacji przezbrojenia', adres: '/przyklad-wzor-karta', data: czas('2026-11-06T07:55:00Z') },
  { tytul: 'Raport zmianowy: zapisy na listę oczekujących otwarte', adres: '/przyklad-raport-zmianowy', data: czas('2026-11-06T06:10:00Z') },
  { tytul: 'Korekta: poprawiliśmy definicję czasu cyklu w poradniku o OEE', adres: '/przyklad-korekta', data: czas('2026-11-05T15:30:00Z') },
  { tytul: 'W dziale Dane i AI: słownik przestojów do wspólnych definicji', adres: '/przyklad-slownik', data: czas('2026-11-05T12:00:00Z') },
];

export const NAJCZESCIEJ_PODGLAD = [GLOWNY, ...OBOK_GLOWNEGO, NAJNOWSZE[0]].map((x) => ({ tytul: x.tytul, adres: x.adres }));
