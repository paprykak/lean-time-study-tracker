// Praca w niedzielę i święto (art. 151^9–151^11 Kp): dzień wolny w zamian za niedzielę w ciągu 6 dni przed albo po niej,
// a gdy to niemożliwe do końca okresu rozliczeniowego (§ 1 pkt 1, § 2); za święto do końca okresu rozliczeniowego (§ 1 pkt 2);
// gdy dnia wolnego nie da się udzielić, dodatek 100% za każdą godzinę (§ 2 i 3 w związku z art. 151^1 § 1 pkt 1).
// Święto w niedzielę: zasady jak dla niedzieli (§ 4). Niedziela i święto liczą się od 6:00 do 6:00 następnego dnia
// (art. 151^9 § 2), chyba że pracodawca ustalił inną godzinę.
import { swieta } from './czas-pracy';
import { dodajDni, koniecOkresu as koniecOkresuOd } from './terminy';
import { doGrosza } from './dodatek-nocny';

export type RodzajDnia = 'niedziela' | 'swieto' | 'swieto-w-niedziele' | 'zwykly';

export function rodzajDnia(data: string): { rodzaj: RodzajDnia; nazwa: string | null } {
  const niedziela = new Date(`${data}T00:00:00Z`).getUTCDay() === 0;
  const s = swieta(Number(data.slice(0, 4))).find((x) => x.data === data);
  if (s && niedziela) return { rodzaj: 'swieto-w-niedziele', nazwa: s.nazwa };
  if (s) return { rodzaj: 'swieto', nazwa: s.nazwa };
  return { rodzaj: niedziela ? 'niedziela' : 'zwykly', nazwa: null };
}

/** Ostatni dzień okresu rozliczeniowego, który zaczyna się 1. dnia miesiąca `poczatek` (RRRR-MM) i trwa `miesiecy`. */
export const koniecOkresu = (poczatek: string, miesiecy: number) => koniecOkresuOd(`${poczatek}-01`, miesiecy);

/** Okres rozliczeniowy zawierający datę, gdy okresy liczy się od stycznia (1, 2, 3, 4, 6 albo 12 miesięcy). */
export function okresZawierajacy(data: string, miesiecy: number): { od: string; do: string } {
  if (![1, 2, 3, 4, 6, 12].includes(miesiecy)) throw new RangeError('Okres rozliczeniowy: 1, 2, 3, 4, 6 albo 12 miesięcy');
  const rok = Number(data.slice(0, 4));
  const m = Number(data.slice(5, 7));
  const start = Math.floor((m - 1) / miesiecy) * miesiecy + 1;
  const poczatek = `${rok}-${String(start).padStart(2, '0')}`;
  return { od: `${poczatek}-01`, do: koniecOkresu(poczatek, miesiecy) };
}

export function wolneZaNiedzieleSwieto(data: string, okresMiesiecy: number) {
  const { rodzaj, nazwa } = rodzajDnia(data);
  const okres = okresZawierajacy(data, okresMiesiecy);
  if (rodzaj === 'zwykly') return { rodzaj, nazwa, okres, okno: null };
  const jakNiedziela = rodzaj === 'niedziela' || rodzaj === 'swieto-w-niedziele';
  return {
    rodzaj,
    nazwa,
    okres,
    /** Niedziela: najpierw 6 dni przed albo po; potem do końca okresu rozliczeniowego. */
    okno: jakNiedziela ? { od: dodajDni(data, -6), do: dodajDni(data, 6) } : null,
  };
}

/** Dodatek 100% za godziny pracy w niedzielę lub święto, gdy nie udzielono dnia wolnego. */
export const dodatekZaNiedziele = (godziny: number, stawka: number) => {
  if (!(godziny >= 0 && stawka >= 0)) throw new RangeError('Godziny i stawka nie mogą być ujemne');
  return doGrosza(godziny * stawka);
};
