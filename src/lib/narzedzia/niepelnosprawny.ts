// Pracownik z niepełnosprawnością (ustawa o rehabilitacji zawodowej i społecznej oraz zatrudnianiu osób niepełnosprawnych,
// tekst jednolity Dz.U. 2026 poz. 884; zmiana Dz.U. 2026 poz. 1102 nie dotyczy art. 2a i 15–20):
// - czas pracy najwyżej 8 godzin na dobę i 40 w tygodniu, przy umiarkowanym i znacznym stopniu 7 i 35 (art. 15 ust. 1–2);
//   bez pracy w nocy i nadgodzin (ust. 3); nie dotyczy pilnowania i zgody lekarza na wniosek pracownika (art. 16);
// - dodatkowa przerwa 15 minut wliczana do czasu pracy (art. 17);
// - pensja miesięczna bez obniżki, stawka godzinowa rośnie w stosunku 40 do 35, czyli razy 8/7 (art. 18);
// - dodatkowy urlop 10 dni roboczych w roku przy umiarkowanym i znacznym stopniu, pierwszy po przepracowaniu roku po dniu
//   zaliczenia do stopnia (art. 19 ust. 1); zwolnienie do 21 dni na turnus rehabilitacyjny, razem z urlopem dodatkowym
//   najwyżej 21 dni w roku (art. 20 ust. 1 i 3); uprawnienia od dnia przedstawienia orzeczenia pracodawcy (art. 2a, 20c).
// Wymiar w miesiącu liczymy jak art. 130 Kodeksu pracy z normą dobową tej osoby: dni od poniedziałku do piątku razy norma,
// minus norma za każde święto poza niedzielą.
import { wymiarMiesiaca } from './czas-pracy';
import { dodajDni, dodajLata } from './terminy';

export type Stopien = 'lekki' | 'umiarkowany' | 'znaczny';

export const NORMY: Record<Stopien, { doba: number; tydzien: number }> = {
  lekki: { doba: 8, tydzien: 40 },
  umiarkowany: { doba: 7, tydzien: 35 },
  znaczny: { doba: 7, tydzien: 35 },
};
export const PRZERWA_MIN = 15;
export const URLOP_DODATKOWY = 10;
export const TURNUS_DNI = 21;

export const krotszaNorma = (s: Stopien) => s !== 'lekki';

/** Wymiar czasu pracy w miesiącu (pełny etat, okres rozliczeniowy 1 miesiąc). */
export function wymiarNiepelnosprawnego(rok: number, miesiac: number, stopien: Stopien, zgodaLekarza = false) {
  const w = wymiarMiesiaca(rok, miesiac);
  const doba = zgodaLekarza ? 8 : NORMY[stopien].doba;
  const dni = w.dniPonPt - w.swietaObnizajace.length;
  return { doba, dni, godziny: doba * dni, swieta: w.swietaObnizajace };
}

/** Stawka godzinowa po przejściu z 8 na 7 godzin (art. 18 ust. 2), do grosza. */
export const stawkaPoSkroceniu = (stawka: number) => Math.round((Math.round(stawka * 100) * 8) / 7) / 100;

/**
 * Pierwszy dzień prawa do dodatkowego urlopu: po przepracowaniu roku po dniu zaliczenia do stopnia (art. 19 ust. 1).
 * Rok liczymy od dnia następnego po zaliczeniu (art. 111 § 2 KC), więc kończy się w rocznicę zaliczenia, a prawo powstaje
 * dzień później; przy przerwach w pracy ten dzień się przesuwa.
 */
export const pierwszyUrlopDodatkowy = (zaliczenie: string) => dodajDni(dodajLata(zaliczenie, 1), 1);
