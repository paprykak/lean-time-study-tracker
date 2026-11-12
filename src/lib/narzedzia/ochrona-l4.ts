// Ochrona przed zwolnieniem w czasie długiego zwolnienia lekarskiego. Pracodawca nie może wypowiedzieć umowy w czasie
// usprawiedliwionej nieobecności, dopóki nie minie okres, po którym wolno rozwiązać umowę bez wypowiedzenia (art. 41 Kp).
// Ten okres (art. 53 § 1 pkt 1 Kp): przy stażu u pracodawcy krótszym niż 6 miesięcy niezdolność dłuższa niż 3 miesiące
// (lit. a); przy stażu co najmniej 6 miesięcy albo niezdolności po wypadku przy pracy lub chorobie zawodowej dłuższa niż
// łączny okres wynagrodzenia i zasiłku oraz pierwsze 3 miesiące świadczenia rehabilitacyjnego (lit. b). Okres zasiłkowy:
// 182 dni, przy gruźlicy 270 (art. 8 ust. 1 ustawy zasiłkowej; przy wypadku przy pracy przez art. 7 ustawy wypadkowej).
// W ciąży umowy nie można ani wypowiedzieć, ani rozwiązać, poza winą pracownicy za zgodą związku i upadłością albo
// likwidacją (art. 177 § 1 i 4). Miesiące kalendarzowo (art. 112 KC): 3 miesiące od 1 stycznia trwają do 31 marca.
import { dodajDni, dodajMiesiace } from './terminy';

export type PrzyczynaL4 = 'choroba' | 'gruzlica' | 'wypadek' | 'ciaza';

export interface DaneL4 {
  /** Pierwszy dzień niezdolności do pracy (okresu zasiłkowego). */
  poczatek: string;
  /** Zatrudnienie u tego pracodawcy co najmniej 6 miesięcy. */
  szescMiesiecy: boolean;
  przyczyna: PrzyczynaL4;
  /** Po okresie zasiłkowym przyznano świadczenie rehabilitacyjne. */
  rehabilitacyjne: boolean;
}

export type WynikL4 =
  | { ciaza: true }
  | {
      ciaza: false;
      litera: 'a' | 'b';
      /** Dni okresu zasiłkowego (lit. b). */
      dniZasilku?: 182 | 270;
      /** Ostatni dzień okresu zasiłkowego (lit. b). */
      koniecZasilku?: string;
      /** Ostatni dzień ochrony. */
      ostatniDzien: string;
      /** Od tego dnia pracodawca może rozwiązać umowę bez wypowiedzenia albo ją wypowiedzieć. */
      odKiedy: string;
    };

export function ochronaNaL4(d: DaneL4): WynikL4 {
  if (d.przyczyna === 'ciaza') return { ciaza: true };
  if (!d.szescMiesiecy && d.przyczyna !== 'wypadek') {
    const ostatniDzien = dodajDni(dodajMiesiace(d.poczatek, 3), -1);
    return { ciaza: false, litera: 'a', ostatniDzien, odKiedy: dodajDni(ostatniDzien, 1) };
  }
  const dniZasilku = d.przyczyna === 'gruzlica' ? 270 : 182;
  const koniecZasilku = dodajDni(d.poczatek, dniZasilku - 1);
  const ostatniDzien = d.rehabilitacyjne ? dodajDni(dodajMiesiace(dodajDni(koniecZasilku, 1), 3), -1) : koniecZasilku;
  return { ciaza: false, litera: 'b', dniZasilku, koniecZasilku, ostatniDzien, odKiedy: dodajDni(ostatniDzien, 1) };
}
