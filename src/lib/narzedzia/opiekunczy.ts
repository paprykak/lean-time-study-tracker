// Zasiłek opiekuńczy pracownika (art. 32–35 ustawy zasiłkowej, t.j. Dz.U. 2026 poz. 854): 80% podstawy (art. 35 ust. 1),
// za każdy dzień, także wolny (art. 35 ust. 2 w związku z art. 11 ust. 4). Podstawa jak przy chorobowym (art. 47).
// Limity w roku kalendarzowym (art. 33): 60 dni na dziecko do 14 lat i zdrowe dziecko do 8 lat w przypadkach z art. 32
// ust. 1 pkt 1; 30 dni na dziecko z orzeczeniem do 18 lat (pkt 2a i 2b); 14 dni na innego chorego członka rodziny;
// łącznie najwyżej 60 dni, a gdy opieka dotyczy wyłącznie osób z pkt 2a, 2b i 3, łącznie 30 dni (ust. 2 zd. 2); bez
// względu na liczbę uprawnionych i liczbę dzieci (ust. 3). Chore dziecko do 14 lat z orzeczeniem mieści się w pkt 2
// (60 dni), więc rodzaj „dziecko z orzeczeniem” to dziecko od 14 do 18 lat.
import { podstawaZasilku } from './chorobowe';
import { doGrosza } from './dodatek-nocny';

export type RodzajOpieki = 'dziecko' | 'dziecko-orzeczenie' | 'czlonek-rodziny';

export const LIMITY_OPIEKI: Record<RodzajOpieki, { dni: number; nazwa: string }> = {
  dziecko: { dni: 60, nazwa: 'Dziecko do 14 lat' },
  'dziecko-orzeczenie': { dni: 30, nazwa: 'Dziecko 14–18, orzeczenie' },
  'czlonek-rodziny': { dni: 14, nazwa: 'Członek rodziny' },
};
/** Pełne opisy rodzajów opieki (art. 32 ust. 1) do tabeli i opisu pod polem. */
export const OPISY_OPIEKI: Record<RodzajOpieki, string> = {
  dziecko: 'chore dziecko do 14 lat albo zdrowe dziecko do 8 lat (zamknięty żłobek, przedszkole, szkoła; choroba niani)',
  'dziecko-orzeczenie': 'dziecko od 14 do 18 lat z orzeczeniem o znacznej niepełnosprawności, gdy choruje albo rodzic, który stale się nim opiekuje, rodzi, choruje lub jest w szpitalu',
  'czlonek-rodziny': 'inny chory członek rodziny we wspólnym gospodarstwie',
};
export const LIMIT_LACZNY = 60;
/** Łączny limit, gdy w roku była opieka wyłącznie nad osobami z art. 32 ust. 1 pkt 2a, 2b i 3 (art. 33 ust. 2 zd. 2). */
export const LIMIT_LACZNY_BEZ_DZIECKA = 30;

export interface DaneOpiekunczego {
  rok: number;
  brutto: number;
  pelnyEtat?: boolean;
  rodzaj: RodzajOpieki;
  dni: number;
  /** Dni zasiłku opiekuńczego w tym roku na ten sam rodzaj opieki (cała rodzina). */
  wykorzystaneTenRodzaj?: number;
  /** Dni zasiłku opiekuńczego w tym roku łącznie, na wszystkie rodzaje opieki (cała rodzina). */
  wykorzystaneLacznie?: number;
  /** Wcześniej w tym roku była opieka nad dzieckiem do 14 lat albo do 8 lat (art. 32 ust. 1 pkt 1–2): łączny limit 60 dni. */
  bylaOpiekaNadDzieckiem60?: boolean;
}

export function zasilekOpiekunczy(d: DaneOpiekunczego) {
  if (!(Number.isInteger(d.dni) && d.dni >= 1 && d.dni <= 366)) throw new RangeError('Dni opieki od 1');
  const tenRodzaj = d.wykorzystaneTenRodzaj ?? 0;
  const lacznie = Math.max(d.wykorzystaneLacznie ?? 0, tenRodzaj);
  const { podstawa } = podstawaZasilku(d.rok, d.brutto, d.pelnyEtat !== false);
  const zaDzien = doGrosza((podstawa / 30) * 0.8);
  const limitLaczny = d.rodzaj === 'dziecko' || d.bylaOpiekaNadDzieckiem60 ? LIMIT_LACZNY : LIMIT_LACZNY_BEZ_DZIECKA;
  const pozostalo = Math.max(0, Math.min(LIMITY_OPIEKI[d.rodzaj].dni - tenRodzaj, limitLaczny - lacznie));
  const dniPlatne = Math.min(d.dni, pozostalo);
  return { podstawa, zaDzien, limitLaczny, pozostalo, dniPlatne, dniPonadLimit: d.dni - dniPlatne, kwota: doGrosza(zaDzien * dniPlatne) };
}
