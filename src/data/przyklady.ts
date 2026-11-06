// Treści PRZYKŁADOWE (fikcyjne) wyłącznie dla strony /styleguide. Nie opisują prawdziwych firm ani zdarzeń
// i nie trafiają do kolekcji treści. Tytuły mają realną długość, żeby sprawdzić zawijanie i rytm siatki.
import type { ArtykulKarta } from '../lib/typy';
import { zdjecie } from '../lib/zdjecia';
import ustawienia from './ustawienia.json';

const dzial = (slug: string) => {
  const d = ustawienia.dzialy.find((x) => x.slug === slug)!;
  return { nazwa: d.nazwa, adres: `/dzial/${d.slug}` };
};
const czas = (iso: string) => new Date(iso);

export const ARTYKULY: ArtykulKarta[] = [
  {
    tytul: 'Przezbrojenie krótsze o połowę bez nowych maszyn: SMED krok po kroku',
    adres: '/przyklad-smed',
    format: 'Poradnik',
    lead: 'Większość czasu przezbrojenia to czynności, które można zrobić, zanim maszyna stanie. Pokazujemy, jak je wyłowić z nagrania i ułożyć na nowo.',
    kategoria: dzial('produkcja'),
    data: czas('2026-11-06T06:40:00Z'),
    autor: 'Redakcja Rytmu Hali',
    czasCzytania: 9,
    zdjecie: zdjecie('robot-spawalniczy'),
  },
  {
    tytul: 'Magazyn w szczycie sezonu: pięć wskaźników, które warto liczyć codziennie',
    adres: '/przyklad-wskazniki-magazynu',
    format: 'Analiza',
    lead: 'Kompletacja, dokładność, czas od przyjęcia do lokacji, wypełnienie stref i nadgodziny. Jak je liczyć z danych, które już masz.',
    kategoria: dzial('magazyn-i-logistyka'),
    data: czas('2026-11-06T05:15:00Z'),
    autor: 'Redakcja Rytmu Hali',
    czasCzytania: 7,
    zdjecie: zdjecie('magazyn-wozek-regaly'),
  },
  {
    tytul: 'Tablica wyników na hali: co pokazywać zmianie, a co kierownictwu',
    adres: '/przyklad-tablica-wynikow',
    format: 'Poradnik',
    lead: 'Jedna tablica dla wszystkich zwykle nie działa nikomu. Rozdzielamy wskaźniki zmiany od wskaźników zakładu.',
    kategoria: dzial('lean-i-ciagle-doskonalenie'),
    data: czas('2026-11-05T14:20:00Z'),
    autor: 'Redakcja Rytmu Hali',
    czasCzytania: 6,
    zdjecie: zdjecie('sciana-karteczek'),
  },
  {
    tytul: 'Dane z maszyn bez wielkiego wdrożenia: od czego zacząć pomiar OEE',
    adres: '/przyklad-pomiar-oee',
    format: 'Analiza',
    lead: 'Najpierw definicje przestojów i jedna linia, potem automatyzacja. Kolejność, która oszczędza miesiące.',
    kategoria: dzial('dane-i-ai'),
    data: czas('2026-11-05T09:05:00Z'),
    autor: 'Redakcja Rytmu Hali',
    czasCzytania: 8,
    zdjecie: zdjecie('robot-cleanroom'),
  },
  {
    tytul: 'Instruktaż stanowiskowy dla nowych pracowników: jak skrócić wdrożenie na zmianie',
    adres: '/przyklad-instruktaz',
    format: 'Wzór do pobrania',
    lead: 'Cztery kroki instruktażu i karta rozbioru pracy. Bez prezentacji, przy stanowisku.',
    kategoria: dzial('ludzie-i-szkolenia'),
    data: czas('2026-11-04T11:30:00Z'),
    autor: 'Redakcja Rytmu Hali',
    czasCzytania: 5,
    zdjecie: zdjecie('warsztat-szkoleniowy'),
  },
  {
    tytul: 'Automatyczne wózki w magazynie średniej wielkości: koszty i pierwsze miesiące po uruchomieniu',
    adres: '/przyklad-material-partnera',
    format: 'Raport',
    lead: 'Materiał przygotowany przez partnera. Redakcja nie odpowiada za jego treść.',
    data: czas('2026-11-04T08:00:00Z'),
    partner: 'Partner przykładowy',
    zdjecie: zdjecie('sortownia-kartony'),
  },
];

export const DLUGI_TYTUL: ArtykulKarta = {
  ...ARTYKULY[0],
  tytul: 'Bardzo długi tytuł do sprawdzenia zawijania: dlaczego planowanie produkcji w arkuszu przestaje działać, gdy liczba wariantów rośnie szybciej niż zespół planistów i liczba zmian w tygodniu',
  adres: '/przyklad-dlugi-tytul',
  zdjecie: zdjecie('hala-pusta'),
};

export const NAJCZESCIEJ = ARTYKULY.slice(0, 5).map((a) => ({ tytul: a.tytul, adres: a.adres }));
