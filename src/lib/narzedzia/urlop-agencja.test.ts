import { describe, expect, it } from 'vitest';
import { urlopTymczasowy, wynagrodzenieZaUrlopTymczasowy, wypowiedzenieTymczasowe } from './urlop-agencja';

describe('pracownik tymczasowy (ustawa o zatrudnianiu pracowników tymczasowych)', () => {
  it('urlop: 2 dni za każdy miesiąc w dyspozycji (art. 17 ust. 1)', () => {
    expect([0, 1, 6, 18].map(urlopTymczasowy)).toEqual([0, 2, 12, 36]);
    expect(() => urlopTymczasowy(1.5)).toThrow(RangeError);
  });
  it('wynagrodzenie za urlop: stawka z 3 miesięcy razy godziny urlopu (art. 17 ust. 4)', () => {
    expect(wynagrodzenieZaUrlopTymczasowy({ wynagrodzenie3m: 15000, godziny3m: 500, dniUrlopu: 2, godzinDziennie: 8 })).toEqual({ zaGodzine: 30, godziny: 16, razem: 480 });
    expect(wynagrodzenieZaUrlopTymczasowy({ wynagrodzenie3m: 15000, godziny3m: 500, dniUrlopu: 3, godzinDziennie: 12 }).razem).toBe(1080);
    expect(wynagrodzenieZaUrlopTymczasowy({ wynagrodzenie3m: 14523.17, godziny3m: 488, dniUrlopu: 2, godzinDziennie: 8 })).toMatchObject({ zaGodzine: 29.76, razem: 476.17 });
  });
  it('wypowiedzenie, gdy przewiduje je umowa (art. 13 ust. 2)', () => {
    expect(wypowiedzenieTymczasowe(false)).toBe('3 dni');
    expect(wypowiedzenieTymczasowe(true)).toBe('1 tydzień');
  });
  it('błędy', () => {
    expect(() => wynagrodzenieZaUrlopTymczasowy({ wynagrodzenie3m: 0, godziny3m: 500, dniUrlopu: 2, godzinDziennie: 8 })).toThrow(RangeError);
    expect(() => wynagrodzenieZaUrlopTymczasowy({ wynagrodzenie3m: 100, godziny3m: 0, dniUrlopu: 2, godzinDziennie: 8 })).toThrow(RangeError);
  });
});
