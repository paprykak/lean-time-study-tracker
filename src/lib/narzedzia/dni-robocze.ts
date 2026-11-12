// Dni robocze między datami: od poniedziałku do piątku bez świąt z art. 1 pkt 1 ustawy o dniach wolnych od pracy
// (swieta() w czas-pracy.ts), opcjonalnie z sobotami jako dniami pracy. Daty RRRR-MM-DD, oba końce włącznie.
// Dodawanie dni roboczych: liczymy od dnia po dacie początkowej, tak jak terminy w dniach (art. 111 § 2 KC).
import { swieta, type Swieto } from './czas-pracy';
import { dzienTygodnia } from './dni-wolne';
import { dniMiedzy, dodajDni } from './terminy';

export const MAKS_DNI = 3660;

const swietaWLatach = (od: string, do_: string) => {
  const lata: Swieto[] = [];
  for (let r = Number(od.slice(0, 4)); r <= Number(do_.slice(0, 4)); r++) lata.push(...swieta(r));
  return lata;
};

export const czyRoboczy = (data: string, swietaDaty: Set<string>, soboty = false) => {
  const dt = dzienTygodnia(data);
  return dt !== 0 && (soboty || dt !== 6) && !swietaDaty.has(data);
};

export function dniRobocze(od: string, do_: string, soboty = false) {
  if (do_ < od) throw new RangeError('Data końcowa przed początkową');
  const kalendarzowe = dniMiedzy(od, do_) + 1;
  if (kalendarzowe > MAKS_DNI) throw new RangeError('Najwyżej 10 lat');
  const swietaZakres = swietaWLatach(od, do_).filter((s) => s.data >= od && s.data <= do_);
  const daty = new Set(swietaZakres.map((s) => s.data));
  let robocze = 0;
  let sobot = 0;
  let niedziel = 0;
  for (let i = 0; i < kalendarzowe; i++) {
    const dzien = dodajDni(od, i);
    const dt = dzienTygodnia(dzien);
    if (dt === 6) sobot++;
    if (dt === 0) niedziel++;
    if (czyRoboczy(dzien, daty, soboty)) robocze++;
  }
  return {
    kalendarzowe,
    robocze,
    soboty: sobot,
    niedziele: niedziel,
    /** Święta w zakresie, które wypadają w dni od poniedziałku do soboty. */
    swieta: swietaZakres.filter((s) => dzienTygodnia(s.data) !== 0),
  };
}

/** Data, w której mija `n` dni roboczych, licząc od dnia po `od`. */
export function poDniachRoboczych(od: string, n: number, soboty = false): string {
  if (!(Number.isInteger(n) && n >= 1 && n <= 2000)) throw new RangeError('Liczba dni: od 1 do 2000');
  const daty = new Set(swietaWLatach(od, dodajDni(od, n * 2 + 30)).map((s) => s.data));
  let data = od;
  for (let licznik = 0; licznik < n; ) {
    data = dodajDni(data, 1);
    if (czyRoboczy(data, daty, soboty)) licznik++;
  }
  return data;
}
