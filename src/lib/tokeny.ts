// Odczyt tokenów kolorów z src/styles/global.css (blok @theme), żeby test kontrastu i /styleguide
// zawsze widziały te same wartości co strona.
import css from '../styles/global.css?raw';

export function tokenyKolorow(zrodlo: string = css): Record<string, string> {
  const theme = zrodlo.match(/@theme\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';
  return Object.fromEntries([...theme.matchAll(/--color-([\w-]+):\s*(#[0-9a-fA-F]{3,8});/g)].map((m) => [m[1], m[2].toLowerCase()]));
}
