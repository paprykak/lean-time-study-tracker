// Terminy wypłaty wynagrodzenia (art. 85 Kp): co najmniej raz w miesiącu, w stałym terminie (§ 1), przy wypłacie raz
// w miesiącu najpóźniej w ciągu pierwszych 10 dni następnego miesiąca (§ 2); gdy ustalony dzień wypłaty jest dniem wolnym
// od pracy, wynagrodzenie wypłaca się w dniu poprzedzającym (§ 3). Przepis nie mówi, co gdy i ten dzień jest wolny:
// pokazujemy najbliższy wcześniejszy dzień pracy (dni wolne: niedziele, święta z ustawy o dniach wolnych od pracy
// i, gdy tak jest w zakładzie, soboty).
// Najbliższa wypłata liczy się od dzisiejszej daty, a nie z roku wybranego na liście: po ostatniej wypłacie roku jest nią
// pierwsza wypłata następnego roku.
import { swieta } from './czas-pracy';
import { dodajDni } from './terminy';

export type DzienWyplaty = number | 'ostatni';

export interface TerminWyplaty {
  miesiac: number;
  ustalony: string;
  wyplata: string;
  /** Dlaczego przesunięto: nazwy dni wolnych od ustalonego dnia wstecz. */
  powod: string[];
}

const dwa = (n: number) => String(n).padStart(2, '0');
const ostatniDzien = (rok: number, m: number) => new Date(Date.UTC(rok, m, 0)).getUTCDate();

export function terminyWyplaty(rok: number, dzien: DzienWyplaty, sobotaWolna = true): TerminWyplaty[] {
  if (dzien !== 'ostatni' && !(Number.isInteger(dzien) && dzien >= 1 && dzien <= 28)) throw new RangeError('Dzień wypłaty: 1–28 albo ostatni');
  const swieto = new Map([...swieta(rok - 1), ...swieta(rok)].map((s) => [s.data, s.nazwa]));
  const wolny = (d: string): string | null => {
    const dt = new Date(`${d}T00:00:00Z`).getUTCDay();
    if (swieto.has(d)) return swieto.get(d)!;
    if (dt === 0) return 'niedziela';
    if (dt === 6 && sobotaWolna) return 'sobota';
    return null;
  };
  return Array.from({ length: 12 }, (_, i) => {
    const m = i + 1;
    const ustalony = `${rok}-${dwa(m)}-${dwa(dzien === 'ostatni' ? ostatniDzien(rok, m) : dzien)}`;
    const powod: string[] = [];
    let wyplata = ustalony;
    for (let p = wolny(wyplata); p; p = wolny(wyplata)) {
      powod.push(p);
      wyplata = dodajDni(wyplata, -1);
    }
    return { miesiac: m, ustalony, wyplata, powod };
  });
}

/** Najbliższa wypłata od dnia `dzis` (YYYY-MM-DD) włącznie: z bieżącego albo następnego roku. */
export function najblizszaWyplata(dzis: string, dzien: DzienWyplaty, sobotaWolna = true): TerminWyplaty {
  const rok = Number(dzis.slice(0, 4));
  const pula = [...terminyWyplaty(rok, dzien, sobotaWolna), ...terminyWyplaty(rok + 1, dzien, sobotaWolna)];
  return pula.find((t) => t.wyplata >= dzis)!;
}
