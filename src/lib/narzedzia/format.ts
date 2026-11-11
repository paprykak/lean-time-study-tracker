// Liczby po polsku w narzędziach (ten sam zapis na serwerze i w przeglądarce): „4806,00 zł”, „7,5 h”.
const ZL = new Intl.NumberFormat('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const LICZBA = new Intl.NumberFormat('pl-PL', { maximumFractionDigits: 2 });

export const zl = (x: number) => `${ZL.format(x)} zł`;
export const liczba = (x: number) => LICZBA.format(x);
export const godz = (x: number) => `${LICZBA.format(x)} h`;

/** Liczba wpisana przez człowieka: „7,5”, „7.5”, „ 8 ”. NaN, gdy to nie liczba nieujemna. */
export function wpisanaLiczba(tekst: string): number {
  const t = tekst.trim().replace(/\s/g, '').replace(',', '.');
  return /^\d+(\.\d+)?$/.test(t) ? Number(t) : Number.NaN;
}

/** Indeks górny w numerze przepisu dla danych strukturalnych i tytułów: „151^8” → „151⁸”. */
export const indeksyUnicode = (t: string) =>
  t.replace(/\^(\d+)/g, (_, d: string) => [...d].map((c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(c)]).join(''));
