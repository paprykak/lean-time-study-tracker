import { describe, expect, it } from 'vitest';
import { urlopWychowawczy } from './urlop-wychowawczy';

const baza = { urodzenie: '2025-05-20', start: '2027-01-01', miesiace: 12, wykorzystaneJa: 0, wykorzystaneDrugi: 0, jedyny: false };

describe('urlop wychowawczy (art. 186 Kp)', () => {
  it('12 miesięcy od 1 stycznia 2027 r.: do 31 grudnia 2027 r., wniosek do 11 grudnia 2026 r.', () => {
    expect(urlopWychowawczy(baza)).toMatchObject({ limitDo: '2031-12-31', dostepne: 35, zarezerwowane: 1, koniec: '2027-12-31', wniosekDo: '2026-12-11' });
  });
  it('koniec miesiąca (konwencja terminy.ts, Python): od 31 stycznia na miesiąc do 28 lutego, od 31 marca na 6 do 30 września', () => {
    expect(urlopWychowawczy({ ...baza, start: '2027-01-31', miesiace: 1 }).koniec).toBe('2027-02-28');
    expect(urlopWychowawczy({ ...baza, start: '2027-03-31', miesiace: 6 }).koniec).toBe('2027-09-30');
    expect(urlopWychowawczy({ ...baza, start: '2027-03-30', miesiace: 6 }).koniec).toBe('2027-09-29');
  });
  it('miesiąc wyłączny drugiego rodzica: 35, chyba że już go wykorzystał albo jesteś jedynym uprawnionym', () => {
    expect(urlopWychowawczy({ ...baza, miesiace: 36 })).toMatchObject({ miesiace: 35, skroconyWymiarem: true });
    expect(urlopWychowawczy({ ...baza, miesiace: 36, wykorzystaneDrugi: 2 }).dostepne).toBe(34);
    expect(urlopWychowawczy({ ...baza, miesiace: 36, jedyny: true }).dostepne).toBe(36);
  });
  it('koniec roku, w którym dziecko kończy 6 lat, skraca urlop', () => {
    expect(urlopWychowawczy({ ...baza, start: '2031-06-01' })).toMatchObject({ koniec: '2031-12-31', skroconyLimitem: true });
  });
  it('błędy', () => {
    expect(() => urlopWychowawczy({ ...baza, start: '2032-01-01' })).toThrow(RangeError);
    expect(() => urlopWychowawczy({ ...baza, miesiace: 40 })).toThrow(RangeError);
  });
});
