import { describe, expect, it } from 'vitest';
import { adresStrony, numeryStron } from './stronicowanie';

describe('stronicowanie', () => {
  it('pokazuje pierwszą, ostatnią i sąsiadów bieżącej z przerwami', () => {
    expect(numeryStron(1, 1)).toEqual([1]);
    expect(numeryStron(1, 5)).toEqual([1, 2, null, 5]);
    expect(numeryStron(6, 20)).toEqual([1, null, 5, 6, 7, null, 20]);
    expect(numeryStron(20, 20)).toEqual([1, null, 19, 20]);
  });

  it('nie robi przerwy tam, gdzie brakuje jednej strony (pokazuje ją)', () => {
    expect(numeryStron(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    expect(numeryStron(3, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('adres pierwszej strony jest bez numeru', () => {
    expect(adresStrony('/dzial/produkcja', 1)).toBe('/dzial/produkcja');
    expect(adresStrony('/dzial/produkcja', 3)).toBe('/dzial/produkcja/3');
  });
});
