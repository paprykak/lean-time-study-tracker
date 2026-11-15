// Terminy w sporach z pracodawcą: odwołanie do sądu pracy 21 dni (art. 264 § 1–3 Kp), sprostowanie świadectwa pracy
// 14 dni (art. 97 § 2^1), sprzeciw od kary porządkowej 7 dni i pozew o jej uchylenie 14 dni (art. 112 § 1–2). Liczenie: dnia zdarzenia nie wlicza się (art. 111 § 2 KC), a gdy koniec wypada w sobotę albo
// dzień ustawowo wolny od pracy, termin upływa następnego dnia, który nie jest dniem wolnym ani sobotą (art. 115 KC);
// przepisy KC stosuje się przez art. 300 Kp, a w postępowaniu sądowym przez art. 165 § 1 KPC.
// Wynik strony (pakiet „terminy”, 2026-11-15): wspólna konwencja z terminy.ts, czyli „Zdąż do” (bez przesunięcia)
// i „Ostatni dzień według art. 115 KC”, gdy się różnią (`terminSprawy`, `opisOdwolania`), a gdy „Zdąż do” wypada w dzień
// wolny, linijka praktyczna pod datą (`linijkaDniaWolnego`, pakiet „terminy3”). Dawne `przesunZDniaWolnego`,
// `terminWDniach` i `terminCzynnosci` (druga implementacja art. 115 KC) usunięte w pakiecie „terminy3”: reguła dni wolnych
// jest tylko w terminy.ts.
import { ETYKIETA_ZDAZ_DO, dataPoPolsku, dodajDni, dzienRoboczy, fazaTerminu, linijkaDniaWolnego, terminPracownika, zdanieArt115, zostaloDni, type TerminPracownika } from './terminy';

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

/** Termin pracownika w sprawie: ostatni dzień bez przesunięcia i według art. 115 KC (terminy.ts). */
export const terminSprawy = (zdarzenie: string, sprawa: Sprawa): TerminPracownika => terminPracownika(dodajDni(zdarzenie, SPRAWY[sprawa].dni));

export interface OpisOdwolania {
  /** „Ostatni dzień” albo „Zdąż do”, gdy art. 115 KC daje późniejszą datę. */
  etykieta: string;
  glowny: string;
  /** Data według art. 115 KC, gdy inna niż `glowny`. */
  art115: string | null;
  /** Linijka praktyczna pod datą, gdy `glowny` wypada w sobotę albo dzień wolny (puste w dzień roboczy). */
  praktycznie: string;
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
    // Audyt terminy3 A-2: w dzień wolny sąd jest nieczynny, zostaje nadanie w czynnej placówce.
    const sadDzis = !dzienRoboczy(t.zdazDo)
      ? 'To dziś: nadaj pismo w placówce Poczty Polskiej, jeśli jest czynna'
      : 'To dziś: złóż pismo w sądzie albo nadaj je dziś w placówce Poczty Polskiej';
    status = f.dni === 0 ? (doSadu ? sadDzis : 'To dziś: pismo powinno dziś dotrzeć do pracodawcy') : zostaloDni(f.dni);
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
    praktycznie: linijkaDniaWolnego(t, doSadu ? 'sad' : 'pracodawca', dzis),
    zdanie: zdanieArt115(t, doSadu ? 'sad' : 'pracodawca'),
    status,
    statusKlasa,
  };
}
