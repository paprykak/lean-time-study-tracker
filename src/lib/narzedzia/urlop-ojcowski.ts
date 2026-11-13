// Urlop ojcowski: do 2 tygodni, najpóźniej do ukończenia przez dziecko 12 miesięcy życia (art. 182^3 § 1 pkt 1 Kp),
// jednorazowo albo w 2 częściach po co najmniej tygodniu (§ 1^1), wniosek co najmniej 7 dni przed (§ 2). Wiek liczy się
// tak, że termin upływa z początkiem dnia pierwszych urodzin (art. 112 KC), więc ostatni dzień urlopu to dzień przed nimi.
// Zasiłek macierzyński za urlop ojcowski: 100% podstawy (art. 31 ust. 1 ustawy zasiłkowej), nie mniej niż świadczenie
// rodzicielskie 1000 zł miesięcznie (art. 31 ust. 3a); dziennie 1/30 kwoty miesięcznej.
import { podstawaZasilku } from './chorobowe';
import { doGrosza } from './dodatek-nocny';
import { SWIADCZENIE_RODZICIELSKIE } from './macierzynski';
import { dniMiedzy, dodajDni, dodajLata } from './terminy';
import { odmiana } from '../redakcja';

export const DNI_OJCOWSKIEGO = 14;
export const DNI_WNIOSKU = 7;

export function urlopOjcowski(urodzenie: string, dzis: string) {
  if (dzis < urodzenie) throw new RangeError('Data urodzenia z przyszłości');
  const koniec = dodajDni(dodajLata(urodzenie, 1), -1);
  const ostatniStart = dodajDni(koniec, -(DNI_OJCOWSKIEGO - 1));
  const wniosekDo = dodajDni(ostatniStart, -DNI_WNIOSKU);
  return { koniec, ostatniStart, wniosekDo, minal: dzis > koniec, dniDoKonca: dniMiedzy(dzis, koniec) };
}

export function zasilekOjcowski(rok: number, brutto: number, dni = DNI_OJCOWSKIEGO, pelnyEtat = true) {
  const { podstawa, podniesiona } = podstawaZasilku(rok, brutto, pelnyEtat);
  const miesiecznie = Math.max(doGrosza(podstawa), SWIADCZENIE_RODZICIELSKIE);
  const dziennie = doGrosza(miesiecznie / 30);
  return { podstawa, podniesiona, miesiecznie, dziennie, razem: doGrosza(dziennie * dni) };
}

/** Ile dni urlopu zostało do terminu: „Został 1 dzień”, „Zostały 2 dni”, „Zostało 5 dni” (czasownik też według liczby). */
export function zostaloDni(n: number): string {
  const czasownik = odmiana(n, ['Został', 'Zostały', 'Zostało']).slice(`${n} `.length);
  return `${czasownik} ${odmiana(n, ['dzień', 'dni', 'dni'])}`;
}
