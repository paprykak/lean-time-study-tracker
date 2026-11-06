// Numery stron do pokazania w stronicowaniu: pierwsza, ostatnia, bieżąca z sąsiadami, przerwy jako null.
export function numeryStron(biezaca: number, liczba: number, sasiedzi = 1): (number | null)[] {
  if (liczba <= 1) return [1];
  const zestaw = new Set([1, liczba]);
  for (let n = biezaca - sasiedzi; n <= biezaca + sasiedzi; n++) if (n >= 1 && n <= liczba) zestaw.add(n);
  const posortowane = [...zestaw].sort((a, b) => a - b);
  const wynik: (number | null)[] = [];
  posortowane.forEach((n, i) => {
    const poprzedni = posortowane[i - 1];
    if (i > 0 && n - poprzedni === 2) wynik.push(poprzedni + 1);
    else if (i > 0 && n - poprzedni > 2) wynik.push(null);
    wynik.push(n);
  });
  return wynik;
}

/** Adres strony listy: pierwsza bez numeru (/dzial/produkcja), dalsze z numerem (/dzial/produkcja/2). */
export const adresStrony = (bazowy: string, n: number) => (n <= 1 ? bazowy : `${bazowy.replace(/\/$/, '')}/${n}`);
