// Pomocnicze funkcje języka redakcji, wspólne dla narzędzi i stron (logika artykułów przeszła do historii git
// 2026-11-12, gdy serwis został przy narzędziach).

/** Polska odmiana po liczebniku: odmiana(1, ['strona', 'strony', 'stron']) → „1 strona”, 3 → „3 strony”, 12 → „12 stron”. */
export function odmiana(n: number, [jeden, kilka, wiele]: [string, string, string]): string {
  const dziesiatki = n % 100;
  const jednosci = n % 10;
  const slowo = n === 1 ? jeden : jednosci >= 2 && jednosci <= 4 && (dziesiatki < 12 || dziesiatki > 14) ? kilka : wiele;
  return `${n} ${slowo}`;
}
