// Kontrast kolorów według WCAG 2.2 (względna luminancja sRGB). Używają go test tokenów i strona /styleguide.

export function luminancja(hex: string): number {
  const h = hex.replace('#', '');
  const pelny = h.length === 3 ? [...h].map((z) => z + z).join('') : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(pelny.slice(i, i + 2), 16) / 255);
  const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

export function kontrast(a: string, b: string): number {
  const [jasny, ciemny] = [luminancja(a), luminancja(b)].sort((x, y) => y - x);
  return (jasny + 0.05) / (ciemny + 0.05);
}

/** Zapis jak w narzędziach (np. 4,52:1), z obcięciem, nie zaokrągleniem w górę, żeby nie zawyżać wyniku. */
export const zapisKontrastu = (k: number) => `${(Math.floor(k * 100) / 100).toFixed(2).replace('.', ',')}:1`;
