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
  it('bez wyodrębnionej stawki: 60% tylko w dodatku, normalne wynagrodzenie pełną stawką (art. 151^1 § 1 i 3)', () => {
    // XI 2026: 160 h. 8000 zł: stawka pełna 50, podstawa dodatku 30. 1 h z 50%: 50 + 15 = 65; 1 h ze 100%: 50 + 30 = 80.
    const listopad = { rodzaj: 'bez-zaszeregowania', kwota: 8000, rok: 2026, miesiac: 11 } as const;
    expect(nadgodziny({ wynagrodzenie: listopad, godziny100: 0, godziny50: 1 })).toMatchObject({ stawka: 30, stawkaNormalna: 50, dodatek50: 15, normalne: 50, razem: 65 });
    expect(nadgodziny({ wynagrodzenie: listopad, godziny100: 1, godziny50: 0 })).toMatchObject({ dodatek100: 30, normalne: 50, razem: 80 });
    // 6000 zł: 37,50 pełna, 22,50 podstawa; 1 h z 50%: 37,50 + 11,25 = 48,75.
    expect(nadgodziny({ wynagrodzenie: { ...listopad, kwota: 6000 }, godziny100: 0, godziny50: 1 })).toMatchObject({ stawka: 22.5, normalne: 37.5, dodatek50: 11.25, razem: 48.75 });
    // Pensja ze stawką zasadniczą bez zmian: 50 + 25 = 75.
    expect(nadgodziny({ wynagrodzenie: { ...listopad, rodzaj: 'miesieczna' }, godziny100: 0, godziny50: 1 })).toMatchObject({ stawka: 50, stawkaNormalna: 50, normalne: 50, razem: 75 });
  });
  it('błędy danych', () => {
    expect(() => nadgodziny({ wynagrodzenie: { rodzaj: 'godzinowa', stawka: 0 }, godziny100: 1, godziny50: 0 })).toThrow(RangeError);
    expect(() => nadgodziny({ wynagrodzenie: { rodzaj: 'godzinowa', stawka: 30 }, godziny100: -1, godziny50: 0 })).toThrow(RangeError);
  });
});
