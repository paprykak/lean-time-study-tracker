// Terminy w sporach z pracodawcą: odwołanie do sądu pracy 21 dni (art. 264 § 1–3 Kp), sprostowanie świadectwa pracy
// 14 dni (art. 97 § 2^1), sprzeciw od kary porządkowej 7 dni i pozew o jej uchylenie 14 dni (art. 112 § 1–2). Liczenie: dnia zdarzenia nie wlicza się (art. 111 § 2 KC), a gdy koniec wypada w sobotę albo
// dzień ustawowo wolny od pracy, termin upływa następnego dnia, który nie jest dniem wolnym ani sobotą (art. 115 KC);
// przepisy KC stosuje się przez art. 300 Kp, a w postępowaniu sądowym przez art. 165 § 1 KPC.
// Wynik strony (pakiet „terminy”, 2026-11-15): wspólna konwencja z terminy.ts, czyli „Zdąż do” (bez przesunięcia)
// i „Ostatni dzień według art. 115 KC”, gdy się różnią (`terminSprawy`, `opisOdwolania`). `terminCzynnosci` zostaje
// bez zmian, bo używa go wypowiedzenie-zmieniajace.ts.
import { swieta } from './czas-pracy';
import { ETYKIETA_ZDAZ_DO, dataPoPolsku, dodajDni, fazaTerminu, terminPracownika, zdanieArt115, zostaloDni, type TerminPracownika } from './terminy';

export type Sprawa = 'wypowiedzenie' | 'bez-wypowiedzenia' | 'odmowa-przyjecia' | 'sprostowanie-wniosek' | 'sprostowanie-sad' | 'kara-sprzeciw' | 'kara-sad';

/** `krotko` do listy wyboru (telefon ucina długie opcje); `przywrocenie`: czy art. 265 § 1 Kp pozwala przywrócić termin
 * (tylko czynności z art. 97 § 2^1 i art. 264; sprzeciw od kary składa się pracodawcy, a pozwu z art. 112 § 2 art. 265
 * nie wymienia). */
export const SPRAWY: Record<Sprawa, { nazwa: string; krotko: string; dni: number; zdarzenie: string; gdzie: 'sąd pracy' | 'pracodawca'; przepis: string; przywrocenie: boolean }> = {
  wypowiedzenie: { nazwa: 'Odwołanie od wypowiedzenia', krotko: 'Wypowiedzenie', dni: 21, zdarzenie: 'Dzień doręczenia wypowiedzenia', gdzie: 'sąd pracy', przepis: 'art. 264 § 1 Kodeksu pracy', przywrocenie: true },
  'bez-wypowiedzenia': { nazwa: 'Zwolnienie bez wypowiedzenia albo wygaśnięcie umowy', krotko: 'Bez wypowiedzenia', dni: 21, zdarzenie: 'Dzień doręczenia pisma albo wygaśnięcia umowy', gdzie: 'sąd pracy', przepis: 'art. 264 § 2 Kodeksu pracy', przywrocenie: true },
  'odmowa-przyjecia': { nazwa: 'Odmowa przyjęcia do pracy', krotko: 'Odmowa przyjęcia', dni: 21, zdarzenie: 'Dzień doręczenia odmowy', gdzie: 'sąd pracy', przepis: 'art. 264 § 3 Kodeksu pracy', przywrocenie: true },
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

/** Termin pracownika w sprawie: ostatni dzień bez przesunięcia i według art. 115 KC (terminy.ts). */
export const terminSprawy = (zdarzenie: string, sprawa: Sprawa): TerminPracownika => terminPracownika(dodajDni(zdarzenie, SPRAWY[sprawa].dni));

export interface OpisOdwolania {
  /** „Ostatni dzień” albo „Zdąż do”, gdy art. 115 KC daje późniejszą datę. */
  etykieta: string;
  glowny: string;
  /** Data według art. 115 KC, gdy inna niż `glowny`. */
  art115: string | null;
  /** Jedno zdanie, kiedy przesunięcie działa (puste bez przesunięcia). */
  zdanie: string;
  status: string;
  statusKlasa: 'w-terminie' | 'wkrotce' | 'pilne' | 'po-terminie';
}

/** Teksty wyniku kalkulatora: te same w HTML ze strony i w skrypcie przeglądarki. */
export function opisOdwolania(zdarzenie: string, sprawa: Sprawa, dzis: string): OpisOdwolania {
  const s = SPRAWY[sprawa];
  const t = terminSprawy(zdarzenie, sprawa);
  const f = fazaTerminu(t, dzis);
  const doSadu = s.gdzie === 'sąd pracy';
  let status: string;
  let statusKlasa: OpisOdwolania['statusKlasa'];
  if (f.faza === 'w-terminie') {
    status = f.dni === 0 ? (doSadu ? 'To dziś: złóż pismo w sądzie albo nadaj je dziś w placówce Poczty Polskiej' : 'To dziś: pismo powinno dziś dotrzeć do pracodawcy') : zostaloDni(f.dni);
    // Progi jak w świadectwie pracy: do 3 dni pilne, do 7 dni wkrótce.
    statusKlasa = f.dni <= 3 ? 'pilne' : f.dni <= 7 ? 'wkrotce' : 'w-terminie';
  } else if (f.faza === 'tylko-art-115') {
    status = `Pierwsza data minęła; ostatni dzień według art. 115 KC: ${f.dni === 0 ? 'dziś' : dataPoPolsku(t.wedlugArt115)}`;
    statusKlasa = 'pilne';
  } else {
    status = s.przywrocenie
      ? 'Termin minął: jeśli spóźnienie nastąpiło bez Twojej winy, możesz w 7 dni od ustania przyczyny złożyć do sądu pracy wniosek o przywrócenie terminu (art. 265 Kodeksu pracy)'
      : 'Termin minął: Kodeks pracy nie przewiduje przywrócenia tego terminu';
    statusKlasa = 'po-terminie';
  }
  return {
    etykieta: t.rozne ? ETYKIETA_ZDAZ_DO : 'Ostatni dzień',
    glowny: dataPoPolsku(t.zdazDo),
    art115: t.rozne ? dataPoPolsku(t.wedlugArt115) : null,
    zdanie: zdanieArt115(t, doSadu ? 'sad' : 'pracodawca'),
    status,
    statusKlasa,
  };
}
