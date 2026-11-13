import { describe, expect, it } from 'vitest';
import { odmiana } from './redakcja';

describe('odmiana po liczebniku', () => {
  const strony = ['strona', 'strony', 'stron'] as [string, string, string];
  it.each([
    [1, '1 strona'], [2, '2 strony'], [4, '4 strony'], [5, '5 stron'], [11, '11 stron'], [12, '12 stron'],
    [14, '14 stron'], [21, '21 stron'], [22, '22 strony'], [112, '112 stron'], [124, '124 strony'],
  ])('%i → %s', (n, oczekiwane) => expect(odmiana(n, strony)).toBe(oczekiwane));
});
