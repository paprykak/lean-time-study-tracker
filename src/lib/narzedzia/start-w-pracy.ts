// Terminy pracodawcy przy nowej umowie o pracę, liczone od pierwszego dnia pracy (dopuszczenia do pracy):
// - przed dopuszczeniem: umowa na piśmie albo pisemne potwierdzenie ustaleń (art. 29 § 2 Kp), aktualne orzeczenie
//   lekarskie (art. 229 § 1 pkt 1 i § 4), szkolenie BHP (art. 237^3 § 2), zapoznanie z regulaminem pracy (art. 104^3 § 2),
//   informacje o monitoringu (art. 22^2 § 8, art. 22^3 § 3–4); Kodeks pracy t.j. Dz.U. 2026 poz. 1245;
// - 7 dni od dopuszczenia: informacja o warunkach zatrudnienia (art. 29 § 3 pkt 1);
// - 30 dni od dopuszczenia: informacja o instytucjach zabezpieczenia społecznego (art. 29 § 3 pkt 2);
// - 7 dni od nawiązania stosunku pracy: zgłoszenie do ZUS (art. 13 pkt 1 i art. 36 ust. 2 i 4 ustawy o systemie ubezpieczeń
//   społecznych, t.j. Dz.U. 2026 poz. 1474); stosunek pracy nawiązuje się w dniu rozpoczęcia pracy z umowy (art. 26 Kp);
// - PPK: umowa o prowadzenie PPK najpóźniej do 10. dnia miesiąca po miesiącu, w którym upłynęły 3 miesiące zatrudnienia
//   (art. 16 ust. 1 ustawy o PPK, t.j. Dz.U. 2026 poz. 192); zatrudnienie z 12 poprzednich miesięcy wlicza się (ust. 2);
//   od 55 do 69 lat tylko na wniosek, od 70 lat wcale (art. 15).
//
// Interpretacje: terminy w dniach liczymy od dnia po dopuszczeniu (art. 111 § 2 KC przez art. 300 Kp). Przepisy nie
// przesądzają, czy art. 115 KC przesuwa koniec z soboty i święta na obowiązki pracodawcy; podajemy datę bez przesunięcia
// (najwcześniejszą) i osobno datę po przesunięciu. 3 miesiące zatrudnienia przy PPK upływają z końcem dnia poprzedzającego
// dzień, który datą odpowiada pierwszemu dniowi pracy (pierwszy dzień pracy wlicza się do zatrudnienia), a gdy takiego
// dnia nie ma, z końcem ostatniego dnia miesiąca (`koniecOkresu`, konwencja z terminy.ts): to wariant wcześniejszy niż
// liczenie z art. 112 KC od dnia po zdarzeniu.
import { przesunZDniaWolnego } from './termin-odwolania';
import { dodajDni, koniecOkresu, poprawnaData } from './terminy';

export type Termin = 'przed' | 'data';

export interface Obowiazek {
  klucz: string;
  nazwa: string;
  /** „przed” = przed pierwszym dniem pracy; „data” = do podanej daty. */
  kiedy: Termin;
  /** Ostatni dzień terminu (dla „przed”: pierwszy dzień pracy, przed jego rozpoczęciem). */
  data: string;
  /** Data po przesunięciu z soboty albo dnia wolnego (art. 115 KC), gdy inna niż `data`. */
  przesunieta?: string;
  podstawa: string;
}

export interface DaneStartu {
  /** Pierwszy dzień pracy (dzień dopuszczenia do pracy i rozpoczęcia pracy z umowy), RRRR-MM-DD. */
  start: string;
  /** Czy u pracodawcy obowiązuje regulamin pracy. */
  regulamin: boolean;
  /** Czy pracodawca stosuje monitoring (kamery, poczta, inne formy). */
  monitoring: boolean;
  /** Czy pracodawca prowadzi PPK (pomijamy, gdy nie). */
  ppk: boolean;
}

/** Ostatni dzień 3 miesięcy zatrudnienia liczonych od pierwszego dnia pracy włącznie. */
export const koniecTrzechMiesiecy = (start: string) => koniecOkresu(start, 3);

/** Termin zawarcia umowy o prowadzenie PPK (art. 16 ust. 1): 10. dzień miesiąca po miesiącu, w którym minęły 3 miesiące. */
export function terminPpk(start: string): string {
  const [r, m] = koniecTrzechMiesiecy(start).split('-').map(Number);
  return new Date(Date.UTC(r, m, 10)).toISOString().slice(0, 10);
}

function wDniach(start: string, dni: number) {
  const data = dodajDni(start, dni);
  const { koniec } = przesunZDniaWolnego(data);
  return { data, ...(koniec !== data ? { przesunieta: koniec } : {}) };
}

export function obowiazkiNaStart(d: DaneStartu): Obowiazek[] {
  if (!poprawnaData(d.start)) throw new Error('Wpisz pierwszy dzień pracy.');
  const s = d.start;
  const lista: Obowiazek[] = [
    { klucz: 'umowa', nazwa: 'Umowa o pracę na piśmie albo pisemne potwierdzenie ustaleń', kiedy: 'przed', data: s, podstawa: 'art. 29 § 2 Kodeksu pracy' },
    { klucz: 'badania', nazwa: 'Orzeczenie lekarskie z badań wstępnych (skierowanie daje pracodawca)', kiedy: 'przed', data: s, podstawa: 'art. 229 § 1 i 4 Kodeksu pracy' },
    { klucz: 'bhp', nazwa: 'Szkolenie BHP (instruktaż ogólny i stanowiskowy)', kiedy: 'przed', data: s, podstawa: 'art. 237³ § 2 Kodeksu pracy, § 8–11 rozporządzenia o szkoleniu BHP' },
  ];
  if (d.regulamin) lista.push({ klucz: 'regulamin', nazwa: 'Zapoznanie z regulaminem pracy', kiedy: 'przed', data: s, podstawa: 'art. 104³ § 2 Kodeksu pracy' });
  if (d.monitoring) lista.push({ klucz: 'monitoring', nazwa: 'Informacja o celach, zakresie i sposobie monitoringu', kiedy: 'przed', data: s, podstawa: 'art. 22² § 8 i art. 22³ § 3–4 Kodeksu pracy' });
  lista.push(
    {
      klucz: 'informacja',
      nazwa: d.regulamin
        ? 'Informacja o warunkach zatrudnienia (normy i wymiar czasu, przerwy, odpoczynek, nadgodziny, urlop, wypowiedzenie)'
        : 'Informacja o warunkach zatrudnienia, a bez regulaminu pracy także o wypłacie, porze nocnej i potwierdzaniu obecności',
      kiedy: 'data',
      ...wDniach(s, 7),
      podstawa: 'art. 29 § 3 pkt 1 Kodeksu pracy',
    },
    { klucz: 'zus', nazwa: 'Zgłoszenie do ubezpieczeń w ZUS (robi pracodawca)', kiedy: 'data', ...wDniach(s, 7), podstawa: 'art. 36 ust. 4 ustawy o systemie ubezpieczeń społecznych' },
    { klucz: 'zabezpieczenie', nazwa: 'Informacja, do których instytucji idą składki (ZUS) i o ochronie z ubezpieczeń', kiedy: 'data', ...wDniach(s, 30), podstawa: 'art. 29 § 3 pkt 2 Kodeksu pracy' },
  );
  if (d.ppk) {
    const data = terminPpk(s);
    const { koniec } = przesunZDniaWolnego(data);
    lista.push({
      klucz: 'ppk',
      nazwa: 'Zapis do PPK, chyba że złożysz pisemną deklarację rezygnacji (od 55 lat tylko na wniosek)',
      kiedy: 'data',
      data,
      ...(koniec !== data ? { przesunieta: koniec } : {}),
      podstawa: 'art. 15 i 16 ust. 1 ustawy o PPK',
    });
  }
  return lista;
}
