import { describe, expect, it } from 'vitest';
import { nadgodziny } from './nadgodziny';

describe('nadgodziny (art. 151^1 Kp, § 4a rozporządzenia o wynagrodzeniu)', () => {
  it('stawka godzinowa 40 zł: 4 h ze 100% i 6 h z 50%', () => {
    const w = nadgodziny({ wynagrodzenie: { rodzaj: 'godzinowa', stawka: 40 }, godziny100: 4, godziny50: 6 });
    expect(w).toMatchObject({ stawka: 40, dodatek100: 160, dodatek50: 120, normalne: 400, razem: 680, wolneNaWniosek: 10, wolneBezWniosku: 15 });
  });
  it('pensja 6400 zł w listopadzie 2026 (160 h): 40 zł za godzinę', () => {
    const w = nadgodziny({ wynagrodzenie: { rodzaj: 'miesieczna', kwota: 6400, rok: 2026, miesiac: 11 }, godziny100: 0, godziny50: 10 });
    expect(w).toMatchObject({ stawka: 40, wymiar: 160, dodatek50: 200, normalne: 400 });
  });
  it('lipiec 2026 (184 h): ta sama pensja daje niższą stawkę', () => {
    expect(nadgodziny({ wynagrodzenie: { rodzaj: 'miesieczna', kwota: 6400, rok: 2026, miesiac: 7 }, godziny100: 1, godziny50: 0 }).stawka).toBe(34.78);
  });
  it('bez wyodrębnionej stawki: podstawa 60% wynagrodzenia (art. 151^1 § 3)', () => {
    expect(nadgodziny({ wynagrodzenie: { rodzaj: 'bez-zaszeregowania', kwota: 8000, rok: 2026, miesiac: 11 }, godziny100: 1, godziny50: 0 }).stawka).toBe(30);
  });
  it('błędy danych', () => {
    expect(() => nadgodziny({ wynagrodzenie: { rodzaj: 'godzinowa', stawka: 0 }, godziny100: 1, godziny50: 0 })).toThrow(RangeError);
    expect(() => nadgodziny({ wynagrodzenie: { rodzaj: 'godzinowa', stawka: 30 }, godziny100: -1, godziny50: 0 })).toThrow(RangeError);
  });
});
