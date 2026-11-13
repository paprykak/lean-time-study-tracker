// Terminy w sporach z pracodawcą: odwołanie do sądu pracy 21 dni (art. 264 § 1–3 Kp), sprostowanie świadectwa pracy
// 14 dni (art. 97 § 2^1), sprzeciw od kary porządkowej 7 dni i pozew o jej uchylenie 14 dni (art. 112 § 1–2). Liczenie: dnia zdarzenia nie wlicza się (art. 111 § 2 KC), a gdy koniec wypada w sobotę albo
// dzień ustawowo wolny od pracy, termin upływa następnego dnia, który nie jest dniem wolnym ani sobotą (art. 115 KC);
// przepisy KC stosuje się przez art. 300 Kp, a w postępowaniu sądowym przez art. 165 § 1 KPC.
import { swieta } from './czas-pracy';
import { dodajDni } from './terminy';

export type Sprawa = 'wypowiedzenie' | 'bez-wypowiedzenia' | 'odmowa-przyjecia' | 'sprostowanie-wniosek' | 'sprostowanie-sad' | 'kara-sprzeciw' | 'kara-sad';

/** `krotko` do listy wyboru (telefon ucina długie opcje); `przywrocenie`: czy art. 265 § 1 Kp pozwala przywrócić termin
 * (tylko czynności z art. 97 § 2^1 i art. 264; sprzeciw od kary składa się pracodawcy, a pozwu z art. 112 § 2 art. 265
 * nie wymienia). */
export const SPRAWY: Record<Sprawa, { nazwa: string; krotko: string; dni: number; zdarzenie: string; gdzie: 'sąd pracy' | 'pracodawca'; przepis: string; przywrocenie: boolean }> = {
  wypowiedzenie: { nazwa: 'Odwołanie od wypowiedzenia', krotko: 'Wypowiedzenie', dni: 21, zdarzenie: 'Dzień doręczenia wypowiedzenia', gdzie: 'sąd pracy', przepis: 'art. 264 § 1 Kodeksu pracy', przywrocenie: true },
  'bez-wypowiedzenia': { nazwa: 'Zwolnienie bez wypowiedzenia albo wygaśnięcie umowy', krotko: 'Dyscyplinarka, wygaśnięcie', dni: 21, zdarzenie: 'Dzień doręczenia pisma albo wygaśnięcia umowy', gdzie: 'sąd pracy', przepis: 'art. 264 § 2 Kodeksu pracy', przywrocenie: true },
  'odmowa-przyjecia': { nazwa: 'Odmowa przyjęcia do pracy', krotko: 'Odmowa przyjęcia do pracy', dni: 21, zdarzenie: 'Dzień doręczenia odmowy', gdzie: 'sąd pracy', przepis: 'art. 264 § 3 Kodeksu pracy', przywrocenie: true },
  'sprostowanie-wniosek': { nazwa: 'Wniosek o sprostowanie świadectwa pracy', krotko: 'Sprostowanie świadectwa', dni: 14, zdarzenie: 'Dzień otrzymania świadectwa pracy', gdzie: 'pracodawca', przepis: 'art. 97 § 2¹ zdanie pierwsze Kodeksu pracy', przywrocenie: true },
  'sprostowanie-sad': { nazwa: 'Sprostowanie świadectwa w sądzie po odmowie', krotko: 'Świadectwo: pozew', dni: 14, zdarzenie: 'Dzień zawiadomienia o odmowie sprostowania', gdzie: 'sąd pracy', przepis: 'art. 97 § 2¹ zdanie drugie Kodeksu pracy', przywrocenie: true },
  'kara-sprzeciw': { nazwa: 'Sprzeciw od kary porządkowej', krotko: 'Sprzeciw od kary', dni: 7, zdarzenie: 'Dzień zawiadomienia o karze', gdzie: 'pracodawca', przepis: 'art. 112 § 1 Kodeksu pracy', przywrocenie: false },
  'kara-sad': { nazwa: 'Uchylenie kary porządkowej w sądzie', krotko: 'Kara: pozew do sądu', dni: 14, zdarzenie: 'Dzień zawiadomienia o odrzuceniu sprzeciwu', gdzie: 'sąd pracy', przepis: 'art. 112 § 2 Kodeksu pracy', przywrocenie: false },
};

export interface TerminCzynnosci {
  /** Ostatni dzień według liczby dni, przed przesunięciem. */
  pierwotny: string;
  koniec: string;
  /** Dni, z których termin przesunięto: nazwa święta, „sobota” albo „niedziela”. */
  przesuniecie: { data: string; powod: string }[];
}

/** Koniec terminu przesunięty z soboty i dnia ustawowo wolnego na najbliższy dzień roboczy (art. 115 KC). */
export function przesunZDniaWolnego(data: string): { koniec: string; przesuniecie: { data: string; powod: string }[] } {
  const rok = Number(data.slice(0, 4));
  const swieto = new Map([...swieta(rok), ...swieta(rok + 1)].map((s) => [s.data, s.nazwa]));
  const wolny = (d: string) => {
    if (swieto.has(d)) return swieto.get(d)!;
    const dt = new Date(`${d}T00:00:00Z`).getUTCDay();
    return dt === 0 ? 'niedziela' : dt === 6 ? 'sobota' : null;
  };
  const przesuniecie: { data: string; powod: string }[] = [];
  let koniec = data;
  for (let p = wolny(koniec); p; p = wolny(koniec)) {
    przesuniecie.push({ data: koniec, powod: p });
    koniec = dodajDni(koniec, 1);
  }
  return { koniec, przesuniecie };
}

/** Termin w dniach od zdarzenia: dnia zdarzenia nie wlicza się (art. 111 § 2 KC), koniec przesuwa art. 115 KC. */
export function terminWDniach(zdarzenie: string, dni: number): TerminCzynnosci {
  const pierwotny = dodajDni(zdarzenie, dni);
  return { pierwotny, ...przesunZDniaWolnego(pierwotny) };
}

export function terminCzynnosci(zdarzenie: string, sprawa: Sprawa): TerminCzynnosci {
  return terminWDniach(zdarzenie, SPRAWY[sprawa].dni);
}
