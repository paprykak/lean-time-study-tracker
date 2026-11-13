// Terminy pracodawcy przy pracy cudzoziemca: ustawa z 20 marca 2025 r. o warunkach dopuszczalności powierzania pracy
// cudzoziemcom (Dz.U. 2025 poz. 621 ze zm.: 2025 poz. 1794, 2026 poz. 203, 473, 734; bez tekstu jednolitego):
// - oświadczenie: start najpóźniej 6 miesięcy od złożenia i praca najwyżej 24 miesiące (art. 61 ust. 1 pkt 5–6),
//   powiadomienie starosty o podjęciu pracy w 7 dni od rozpoczęcia, o niepodjęciu w 14 dni od dnia rozpoczęcia z ewidencji
//   (art. 70 ust. 1), o wcześniejszym zakończeniu bez terminu w dniach (art. 70 ust. 2), wniosek o zezwolenie przed dniem
//   zakończenia z oświadczenia po co najmniej 3 miesiącach umowy o pracę (art. 71 ust. 1);
// - zezwolenie: najwyżej 3 lata (art. 15), powiadomienie wojewody w 7 dni od okoliczności z art. 19 (niepodjęcie pracy
//   w 2 miesiące od początku ważności, przerwa ponad 2 miesiące, zakończenie wcześniej niż 2 miesiące przed końcem
//   ważności; art. 20 ust. 1), wniosek o kolejne zezwolenie w okresie ważności (art. 21 ust. 1);
// - ochrona czasowa i obywatele Ukrainy z art. 41 ustawy o wygaszeniu (Dz.U. 2026 poz. 203): powiadomienie PUP w 7 dni od
//   rozpoczęcia pracy i w 7 dni od zmiany umowy, stanowiska, wymiaru albo stawki (art. 5a ust. 1 i 5, od 5 marca 2026 r.);
//   wniosek o kartę pobytu z art. 42c do 4 marca 2027 r. (art. 42x ustawy o pomocy obywatelom Ukrainy, t.j. Dz.U. 2026
//   poz. 1293); okres z art. 41 to 3 lata od 5 marca 2026 r.;
// - kopie dokumentu pobytowego i dane: przez okres pracy i 2 lata od końca roku, w którym umowa ustała (art. 4 ust. 4 i 6).
//
// Interpretacje (przepisy tego nie przesądzają; wybieramy datę najwcześniejszą):
// - „w terminie N dni od dnia …”: dnia zdarzenia nie liczymy (art. 111 § 2 KC). Czy koniec przesuwa się z soboty i święta,
//   ustawa nie mówi (reguluje tylko awarię systemu), więc podajemy datę bez przesunięcia i osobno po przesunięciu;
// - okres pracy z oświadczenia i zezwolenia liczymy z dniem rozpoczęcia włącznie: 24 miesiące od 1 marca kończą się
//   ostatniego lutego dwa lata później; 6 miesięcy od złożenia oświadczenia jak art. 112 KC (dzień odpowiadający datą);
// - niepodjęcie pracy przy zezwoleniu: okoliczność zachodzi z ostatnim dniem 2 miesięcy od początku ważności (liczonych
//   z tym dniem), a 7 dni liczymy od tego ostatniego dnia; zakończenie „wcześniej niż 2 miesiące przed upływem” ważności:
//   w dniu, który datą odpowiada dniowi końca ważności 2 miesiące wcześniej, albo przed nim (wariant bezpieczny: powiadomić
//   także w dniu granicy, bo przepis go nie rozstrzyga);
// - 3 lata z art. 41 kończą się 4 marca 2029 r. (dzień przed rocznicą wejścia w życie); możliwe też liczenie do 5 marca.
import { przesunZDniaWolnego } from './termin-odwolania';
import { dataPoPolsku, dodajDni, dodajMiesiace, koniecOkresu, poprawnaData } from './terminy';

export type Tryb = 'oswiadczenie' | 'zezwolenie' | 'ochrona';

export interface Termin {
  klucz: string;
  nazwa: string;
  /** Ostatni dzień (RRRR-MM-DD) albo null, gdy przepis nie podaje terminu w dniach. */
  data: string | null;
  przesunieta?: string;
  podstawa: string;
  /** Dodatkowe zdanie, np. o przekroczeniu limitu. */
  uwaga?: string;
  /** Status sprawdzenia: „blad”, gdy warunek z przepisu nie jest spełniony. */
  stan?: 'ok' | 'blad';
}

export const KARTA_UKR_WNIOSEK_DO = '2027-03-04';
export const ART_41_DO = '2029-03-04';
const U = 'ustawy o powierzaniu pracy cudzoziemcom';

function wDniach(od: string, dni: number) {
  const data = dodajDni(od, dni);
  const { koniec } = przesunZDniaWolnego(data);
  return { data, ...(koniec !== data ? { przesunieta: koniec } : {}) };
}

/**
 * Ostatni dzień okresu N miesięcy liczonego z dniem początku włącznie, w wariancie najwcześniejszym (okno na podjęcie
 * pracy): gdy dnia o tej dacie nie ma, dzień przed ostatnim dniem miesiąca. Świadome odstępstwo od `koniecOkresu`
 * (terminy.ts) na korzyść bezpiecznego terminu powiadomienia; różni się tylko przy starcie 29.–31. dnia miesiąca.
 */
export const ostatniDzienMiesiecy = (od: string, miesiace: number) => dodajDni(dodajMiesiace(od, miesiace), -1);

/**
 * Najdłuższy dopuszczalny okres N miesięcy (limity 24 miesięcy i 3 lat): dzień przed dniem, który datą odpowiada
 * początkowi; gdy takiego dnia w miesiącu końcowym nie ma (start 29 lutego, 31 stycznia), ostatni dzień tego miesiąca
 * (art. 112 KC). Nie zaniżamy limitu, żeby nie oznaczać jako błąd okresu zgodnego z przepisem.
 */
export const koniecLimitu = (od: string, miesiace: number) => koniecOkresu(od, miesiace);

const OD_USTAWY = '2025-06-01';
const OD_ART_5A = '2026-03-05';

/** Do kiedy pracodawca przechowuje kopie dokumentów pobytowych i dane (art. 4 ust. 4 i 6). */
export const przechowywanieDo = (koniecUmowy: string) => `${Number(koniecUmowy.slice(0, 4)) + 2}-12-31`;

const sprawdz = (...daty: (string | null | undefined)[]) => {
  for (const d of daty) if (d != null && d !== '' && !poprawnaData(d)) throw new Error('Popraw datę.');
};

export interface DaneOswiadczenia {
  /** Dzień złożenia oświadczenia (opcjonalnie). */
  zlozone?: string | null;
  /** Dzień rozpoczęcia pracy z ewidencji oświadczeń. */
  startEwidencja: string;
  /** Dzień, w którym praca naprawdę się zaczęła; null, gdy jeszcze nie. */
  startFaktyczny?: string | null;
  /** Dzień zakończenia pracy z oświadczenia. */
  koniec: string;
}

export function terminyOswiadczenia(d: DaneOswiadczenia): Termin[] {
  sprawdz(d.zlozone, d.startEwidencja, d.startFaktyczny, d.koniec);
  if (!d.startEwidencja || !d.koniec) throw new Error('Wpisz dzień rozpoczęcia i zakończenia pracy z oświadczenia.');
  if (d.koniec < d.startEwidencja) throw new Error('Koniec pracy nie może być przed jej rozpoczęciem.');
  if (d.startEwidencja < OD_USTAWY) throw new Error('Kalkulator liczy według ustawy w mocy od 1 czerwca 2025 r.');
  const lista: Termin[] = [];
  if (d.zlozone) {
    const najpozniej = dodajMiesiace(d.zlozone, 6);
    lista.push({
      klucz: 'start-6m',
      nazwa: 'Dzień rozpoczęcia pracy najpóźniej',
      data: najpozniej,
      podstawa: `art. 61 ust. 1 pkt 6 ${U}`,
      stan: d.startEwidencja <= najpozniej ? 'ok' : 'blad',
      ...(d.startEwidencja > najpozniej ? { uwaga: 'Start później niż 6 miesięcy od złożenia: takie oświadczenie urząd pozostawia bez rozpoznania (art. 61 ust. 2).' } : {}),
    });
  }
  const maks = koniecLimitu(d.startEwidencja, 24);
  lista.push({
    klucz: 'limit-24m',
    nazwa: 'Praca z oświadczenia najdłużej',
    data: maks,
    podstawa: `art. 61 ust. 1 pkt 5 ${U}`,
    stan: d.koniec <= maks ? 'ok' : 'blad',
    ...(d.koniec > maks ? { uwaga: 'Okres w oświadczeniu wygląda na dłuższy niż 24 miesiące (liczymy z dniem startu): sprawdź daty.' } : {}),
  });
  if (d.startFaktyczny) lista.push({ klucz: 'podjecie', nazwa: 'Powiadomienie starosty o podjęciu pracy', ...wDniach(d.startFaktyczny, 7), podstawa: `art. 70 ust. 1 pkt 1 ${U}` });
  else lista.push({ klucz: 'niepodjecie', nazwa: 'Powiadomienie starosty o niepodjęciu pracy', ...wDniach(d.startEwidencja, 14), podstawa: `art. 70 ust. 1 pkt 2 ${U}` });
  lista.push(
    { klucz: 'zakonczenie', nazwa: 'Powiadomienie starosty o wcześniejszym zakończeniu pracy', data: null, podstawa: `art. 70 ust. 2 ${U}`, uwaga: 'Przepis nie podaje terminu w dniach.' },
    {
      klucz: 'zezwolenie-po',
      nazwa: 'Wniosek o zezwolenie na pracę, żeby pracować dalej bez przerwy',
      data: dodajDni(d.koniec, -1),
      podstawa: `art. 71 ust. 1 ${U}`,
      uwaga: 'Wymaga co najmniej 3 miesięcy pracy na umowę o pracę z tego oświadczenia, wniosku na to samo stanowisko i na umowę o pracę, bez braków formalnych albo z brakami uzupełnionymi w terminie; wtedy praca jest legalna do decyzji.',
    },
  );
  return lista;
}

export interface DaneZezwolenia {
  /** Początek ważności zezwolenia. */
  od: string;
  /** Koniec ważności zezwolenia. */
  do: string;
  /** Dzień rozpoczęcia pracy; null, gdy jeszcze nie. */
  startFaktyczny?: string | null;
  /** Ostatni dzień pracy, gdy praca kończy się przed końcem zezwolenia. */
  zakonczenie?: string | null;
}

export function terminyZezwolenia(d: DaneZezwolenia): Termin[] {
  sprawdz(d.od, d.do, d.startFaktyczny, d.zakonczenie);
  if (!d.od || !d.do) throw new Error('Wpisz okres ważności zezwolenia.');
  if (d.do < d.od) throw new Error('Koniec ważności nie może być przed początkiem.');
  if (d.od < OD_USTAWY) throw new Error('Kalkulator liczy według ustawy w mocy od 1 czerwca 2025 r.');
  const lista: Termin[] = [];
  const maks = koniecLimitu(d.od, 36);
  lista.push({
    klucz: 'limit-3l',
    nazwa: 'Zezwolenie najdłużej',
    data: maks,
    podstawa: `art. 15 ${U}`,
    stan: d.do <= maks ? 'ok' : 'blad',
    ...(d.do > maks ? { uwaga: 'Zezwolenie wydaje się najwyżej na 3 lata: sprawdź daty z decyzji.' } : {}),
  });
  const okno = ostatniDzienMiesiecy(d.od, 2);
  if (!d.startFaktyczny || d.startFaktyczny > okno) {
    lista.push({
      klucz: 'niepodjecie',
      nazwa: `Powiadomienie wojewody, jeśli praca nie zacznie się do ${dataPoPolsku(okno)}`,
      ...wDniach(okno, 7),
      podstawa: `art. 19 pkt 1 i art. 20 ust. 1 ${U}`,
    });
  }
  lista.push({
    klucz: 'przerwa',
    nazwa: 'Powiadomienie wojewody o przerwie w pracy dłuższej niż 2 miesiące',
    data: null,
    podstawa: `art. 19 pkt 2 i art. 20 ust. 1 ${U}`,
    uwaga: '7 dni od dnia, w którym przerwa przekroczy 2 miesiące.',
  });
  if (d.zakonczenie) {
    const granica = dodajMiesiace(d.do, -2);
    if (d.zakonczenie <= granica) {
      lista.push({ klucz: 'zakonczenie', nazwa: 'Powiadomienie wojewody o wcześniejszym zakończeniu pracy', ...wDniach(d.zakonczenie, 7), podstawa: `art. 19 pkt 3 i art. 20 ust. 1 ${U}` });
    } else {
      lista.push({ klucz: 'zakonczenie', nazwa: 'Powiadomienie o zakończeniu pracy', data: null, podstawa: `art. 19 pkt 3 ${U}`, uwaga: 'Niepotrzebne: praca kończy się później niż 2 miesiące przed końcem zezwolenia.' });
    }
  }
  lista.push({ klucz: 'kolejne', nazwa: 'Wniosek o kolejne zezwolenie, żeby pracować dalej bez przerwy', data: d.do, podstawa: `art. 21 ust. 1 ${U}`, uwaga: 'Wniosek musi wpłynąć w okresie ważności obecnego zezwolenia, bez braków formalnych albo z brakami uzupełnionymi w terminie.' });
  return lista;
}

export interface DaneOchrony {
  /** Dzień rozpoczęcia pracy. */
  start: string;
  /** Dzień zmiany umowy, stanowiska, wymiaru albo stawki (opcjonalnie). */
  zmiana?: string | null;
}

export function terminyOchrony(d: DaneOchrony): Termin[] {
  sprawdz(d.start, d.zmiana);
  if (!d.start) throw new Error('Wpisz dzień rozpoczęcia pracy.');
  if (d.start < OD_ART_5A) throw new Error('Art. 5a obowiązuje od 5 marca 2026 r.; wcześniej zgłoszenia regulował art. 22 specustawy.');
  const lista: Termin[] = [{ klucz: 'pup', nazwa: 'Powiadomienie powiatowego urzędu pracy przez praca.gov.pl', ...wDniach(d.start, 7), podstawa: `art. 5a ust. 1 ${U}` }];
  if (d.zmiana) {
    if (d.zmiana < d.start) throw new Error('Zmiana nie może być przed rozpoczęciem pracy.');
    lista.push({ klucz: 'pup-zmiana', nazwa: 'Ponowne powiadomienie urzędu pracy po zmianie', ...wDniach(d.zmiana, 7), podstawa: `art. 5a ust. 5 ${U}` });
  }
  const karta: Termin[] = [
    { klucz: 'karta', nazwa: 'Wniosek o kartę pobytu CUKR, który zapewnia legalny pobyt do decyzji', data: KARTA_UKR_WNIOSEK_DO, podstawa: 'art. 42c i 42x ustawy o pomocy obywatelom Ukrainy', uwaga: 'Dla osób ze statusem UKR 4 czerwca 2025 r., w dniu wniosku i nieprzerwanie co najmniej 365 dni (art. 42c).' },
  ];
  if (d.start <= KARTA_UKR_WNIOSEK_DO) lista.push(...karta);
  lista.push(
    { klucz: 'art41', nazwa: 'Obywatele Ukrainy bez ochrony czasowej: zasady z art. 5a', data: ART_41_DO, podstawa: 'art. 41 ustawy o wygaszeniu pomocy obywatelom Ukrainy' },
  );
  return lista;
}
