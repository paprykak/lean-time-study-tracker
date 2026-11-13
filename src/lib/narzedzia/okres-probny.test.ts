import { describe, expect, it } from 'vitest';
import { maksymalnyOkres, okresProbny, wypowiedzenieProby } from './okres-probny';

describe('okres próbny (art. 25 § 2–2³ i art. 34 Kp)', () => {
  it('maksymalny okres według planowanej umowy i wydłużenie o miesiąc', () => {
    expect(maksymalnyOkres('nieokreslony', false)).toBe(3);
    expect(maksymalnyOkres('okreslony-ponizej-6', false)).toBe(1);
    expect(maksymalnyOkres('okreslony-ponizej-6', true)).toBe(2);
    expect(maksymalnyOkres('okreslony-6-12', true)).toBe(3);
    expect(maksymalnyOkres('nieokreslony', true)).toBe(3);
  });
  it('wypowiedzenie: 3 dni robocze, 1 tydzień, 2 tygodnie', () => {
    expect(wypowiedzenieProby('2t')).toBe('3 dni robocze');
    expect(wypowiedzenieProby('2m')).toBe('1 tydzień');
    expect(wypowiedzenieProby('3m')).toBe('2 tygodnie');
  });
  it('koniec: 3 miesiące od 1 marca do 31 maja, 2 tygodnie od 2 marca do 15 marca', () => {
    expect(okresProbny('2027-03-01', 'nieokreslony', '3m')).toMatchObject({ koniec: '2027-05-31', dozwolony: true, wypowiedzenie: '2 tygodnie' });
    expect(okresProbny('2027-03-02', 'nieokreslony', '2t').koniec).toBe('2027-03-15');
  });
  it('początek 29.–31. dnia miesiąca: koniec dzień przed ostatnim dniem krótszego miesiąca (konwencja terminy.ts, Python)', () => {
    expect(okresProbny('2026-01-31', 'okreslony-ponizej-6', '1m').koniec).toBe('2026-02-27');
    expect(okresProbny('2026-11-30', 'nieokreslony', '3m').koniec).toBe('2027-02-27');
    expect(okresProbny('2027-01-29', 'okreslony-ponizej-6', '1m').koniec).toBe('2027-02-27');
  });
  it('3 miesiące przed umową na 4 miesiące: niedozwolone', () => {
    expect(okresProbny('2027-03-01', 'okreslony-ponizej-6', '3m').dozwolony).toBe(false);
    expect(okresProbny('2027-03-01', 'okreslony-ponizej-6', '2m', true).dozwolony).toBe(true);
  });
});
