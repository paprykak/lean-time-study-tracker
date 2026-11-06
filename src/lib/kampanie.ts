// Kampanie reklamowe w slotach (F5): które kampanie wyrenderować w danym miejscu i która jest widoczna bez
// JavaScriptu. Strona jest statyczna, więc build wstawia kampanie trwające i te, które zaczną się w ciągu horyzontu,
// a przeglądarka (skrypt w SlotReklamowy.astro) co do minuty pilnuje dat od–do i losuje jedną z trwających (rotacja).
// Po końcu kampanii slot wraca do autopromocji newslettera, nigdy nie zostaje pusty.
import type { Format } from './reklamy';

/** Pola kreacji w kolekcji „kampanie” (panel nie przyjmuje myślnika w nazwie pola). */
export const POLE_KREACJI: Record<Format, 'billboard' | 'baner' | 'prostokat' | 'polstrona' | 'mobilny' | 'mobilnyProstokat'> = {
  billboard: 'billboard',
  baner: 'baner',
  prostokat: 'prostokat',
  polstrona: 'polstrona',
  mobilny: 'mobilny',
  'mobilny-prostokat': 'mobilnyProstokat',
};

/** Ile dni naprzód build wstawia kampanie, które jeszcze się nie zaczęły (każda zmiana treści i tak przebudowuje stronę). */
export const HORYZONT_DNI = 31;

export interface OknoKampanii {
  id: string;
  od: Date;
  do: Date;
  aktywna: boolean;
  miejsca: readonly string[];
}

/** Czy kampania trwa w chwili `teraz` (od włącznie, do wyłącznie). */
export const trwa = (k: Pick<OknoKampanii, 'od' | 'do'>, teraz: Date) => k.od <= teraz && teraz < k.do;

/**
 * Kampanie do wyrenderowania w miejscu: włączone, przypisane do miejsca, jeszcze niezakończone i zaczynające się
 * najpóźniej za `horyzontDni`. Kolejność: od najwcześniejszego startu, potem po id (stała między buildami).
 */
export function kampanieDlaMiejsca<T extends OknoKampanii>(wpisy: T[], miejsce: string, teraz: Date, horyzontDni = HORYZONT_DNI): T[] {
  const granica = new Date(teraz.getTime() + horyzontDni * 86_400_000);
  return wpisy
    .filter((k) => k.aktywna && k.miejsca.includes(miejsce) && k.do > teraz && k.od <= granica)
    .sort((a, b) => a.od.getTime() - b.od.getTime() || a.id.localeCompare(b.id));
}

/** Indeks kampanii widocznej bez JavaScriptu: pierwsza trwająca w chwili buildu; -1, gdy żadna (autopromocja). */
export const widocznaBezSkryptu = (kampanie: Pick<OknoKampanii, 'od' | 'do'>[], teraz: Date) => kampanie.findIndex((k) => trwa(k, teraz));

/**
 * Wybór w przeglądarce: losowo jedna z trwających (rotacja przy każdym wyświetleniu strony); -1, gdy żadna nie trwa.
 * `los` to liczba z przedziału [0, 1), w przeglądarce Math.random().
 */
export function wybierz(kampanie: Pick<OknoKampanii, 'od' | 'do'>[], teraz: Date, los: number): number {
  const trwajace = kampanie.flatMap((k, i) => (trwa(k, teraz) ? [i] : []));
  return trwajace.length ? trwajace[Math.min(trwajace.length - 1, Math.floor(los * trwajace.length))] : -1;
}
