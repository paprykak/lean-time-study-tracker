import { describe, expect, it } from 'vitest';
import { przerwy } from './przerwy';

describe('przerwy w pracy (art. 134, 141, 187, 202 Kp)', () => {
  it('8 godzin: 15 minut; 12 godzin: 2 × 15; 5 godzin: brak', () => {
    expect(przerwy({ godziny: 8 }).wliczane).toBe(15);
    expect(przerwy({ godziny: 12 }).wliczane).toBe(30);
    expect(przerwy({ godziny: 9 }).wliczane).toBe(15);
    expect(przerwy({ godziny: 5 }).lista).toEqual([]);
    expect(przerwy({ godziny: 24 }).wliczane).toBe(45);
  });
  it('przerwa niewliczana wydłuża pobyt w pracy', () => {
    expect(przerwy({ godziny: 8, niewliczana: 30 })).toMatchObject({ wliczane: 15, niewliczane: 30, wPracy: 510 });
  });
  it('karmienie: poniżej 4 h żadna, do 6 h jedna, powyżej 6 h dwie; bliźnięta po 45 min', () => {
    expect(przerwy({ godziny: 3.5, karmienie: 'jedno' }).wliczane).toBe(0);
    expect(przerwy({ godziny: 6, karmienie: 'jedno' }).wliczane).toBe(15 + 30);
    expect(przerwy({ godziny: 8, karmienie: 'jedno' }).wliczane).toBe(15 + 60);
    expect(przerwy({ godziny: 8, karmienie: 'wiecej' }).wliczane).toBe(15 + 90);
  });
  it('młodociany powyżej 4,5 h: 30 minut', () => {
    expect(przerwy({ godziny: 5, mlodociany: true }).wliczane).toBe(30);
    expect(przerwy({ godziny: 4.5, mlodociany: true }).wliczane).toBe(0);
  });
  it('błędy', () => {
    expect(() => przerwy({ godziny: 0 })).toThrow(RangeError);
    expect(() => przerwy({ godziny: 8, niewliczana: 90 })).toThrow(RangeError);
  });
});
