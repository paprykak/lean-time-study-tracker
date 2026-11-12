// Terminy w sporach z pracodawcą: odwołanie do sądu pracy 21 dni (art. 264 § 1–3 Kp), sprostowanie świadectwa pracy
// 14 dni (art. 97 § 2^1). Liczenie: dnia zdarzenia nie wlicza się (art. 111 § 2 KC), a gdy koniec wypada w sobotę albo
// dzień ustawowo wolny od pracy, termin upływa następnego dnia, który nie jest dniem wolnym ani sobotą (art. 115 KC);
// przepisy KC stosuje się przez art. 300 Kp, a w postępowaniu sądowym przez art. 165 § 1 KPC.
import { swieta } from './czas-pracy';
import { dodajDni } from './terminy';

export type Sprawa = 'wypowiedzenie' | 'bez-wypowiedzenia' | 'odmowa-przyjecia' | 'sprostowanie-wniosek' | 'sprostowanie-sad';

export const SPRAWY: Record<Sprawa, { nazwa: string; dni: number; zdarzenie: string; gdzie: 'sąd pracy' | 'pracodawca'; przepis: string }> = {
  wypowiedzenie: { nazwa: 'Odwołanie od wypowiedzenia', dni: 21, zdarzenie: 'Dzień doręczenia wypowiedzenia', gdzie: 'sąd pracy', przepis: 'art. 264 § 1 Kodeksu pracy' },
  'bez-wypowiedzenia': { nazwa: 'Zwolnienie bez wypowiedzenia albo wygaśnięcie umowy', dni: 21, zdarzenie: 'Dzień doręczenia pisma albo wygaśnięcia umowy', gdzie: 'sąd pracy', przepis: 'art. 264 § 2 Kodeksu pracy' },
  'odmowa-przyjecia': { nazwa: 'Odmowa przyjęcia do pracy', dni: 21, zdarzenie: 'Dzień doręczenia odmowy', gdzie: 'sąd pracy', przepis: 'art. 264 § 3 Kodeksu pracy' },
  'sprostowanie-wniosek': { nazwa: 'Wniosek o sprostowanie świadectwa pracy', dni: 14, zdarzenie: 'Dzień otrzymania świadectwa pracy', gdzie: 'pracodawca', przepis: 'art. 97 § 2¹ zdanie pierwsze Kodeksu pracy' },
  'sprostowanie-sad': { nazwa: 'Sprostowanie świadectwa w sądzie po odmowie', dni: 14, zdarzenie: 'Dzień zawiadomienia o odmowie sprostowania', gdzie: 'sąd pracy', przepis: 'art. 97 § 2¹ zdanie drugie Kodeksu pracy' },
};

export interface TerminCzynnosci {
  /** Ostatni dzień według liczby dni, przed przesunięciem. */
  pierwotny: string;
  koniec: string;
  /** Dni, z których termin przesunięto: nazwa święta, „sobota” albo „niedziela”. */
  przesuniecie: { data: string; powod: string }[];
}

export function terminCzynnosci(zdarzenie: string, sprawa: Sprawa): TerminCzynnosci {
  const rok = Number(zdarzenie.slice(0, 4));
  const swieto = new Map([...swieta(rok), ...swieta(rok + 1)].map((s) => [s.data, s.nazwa]));
  const wolny = (d: string) => {
    if (swieto.has(d)) return swieto.get(d)!;
    const dt = new Date(`${d}T00:00:00Z`).getUTCDay();
    return dt === 0 ? 'niedziela' : dt === 6 ? 'sobota' : null;
  };
  const pierwotny = dodajDni(zdarzenie, SPRAWY[sprawa].dni);
  const przesuniecie: TerminCzynnosci['przesuniecie'] = [];
  let koniec = pierwotny;
  for (let p = wolny(koniec); p; p = wolny(koniec)) {
    przesuniecie.push({ data: koniec, powod: p });
    koniec = dodajDni(koniec, 1);
  }
  return { pierwotny, koniec, przesuniecie };
}
