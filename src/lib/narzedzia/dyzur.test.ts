import { describe, expect, it } from 'vitest';
import { wymiarMiesiaca } from './czas-pracy';
import { dyzur } from './dyzur';

// Listopad 2026 r.: 160 godzin do przepracowania.
describe('dyżur (art. 151⁵ Kp)', () => {
  it('wymiar listopada 2026 r.', () => {
    expect(wymiarMiesiaca(2026, 11).godziny).toBe(160);
  });
  it('w zakładzie, 12 h z 2 h pracy, pensja 6000 zł: 10 h po 37,50 zł', () => {
    expect(dyzur({ miejsce: 'zaklad', godzinyDyzuru: 12, godzinyPracy: 2, rok: 2026, miesiac: 11, rodzaj: 'miesieczna', stawka: 6000 })).toMatchObject({
      bezPracy: 10,
      czasWolny: 10,
      zaGodzine: 37.5,
      kwota: 375,
    });
  });
  it('stawka godzinowa 30 zł: 300 zł za 10 h', () => {
    expect(dyzur({ miejsce: 'zaklad', godzinyDyzuru: 10, rok: 2026, miesiac: 11, rodzaj: 'godzinowa', stawka: 30 }).kwota).toBe(300);
  });
  it('bez wyodrębnionej stawki: 60% wynagrodzenia według zasad urlopowych', () => {
    // 0,6 · (5000 / 160 + 1200 / 480) = 20,25 zł za godzinę
    expect(dyzur({ miejsce: 'zaklad', godzinyDyzuru: 10, rok: 2026, miesiac: 11, rodzaj: 'bez-stawki', stale: 5000, zmienneSuma: 1200, zmienneGodziny: 480 })).toMatchObject({ zaGodzine: 20.25, kwota: 202.5 });
  });
  it('dyżur w domu: bez czasu wolnego i wynagrodzenia', () => {
    expect(dyzur({ miejsce: 'dom', godzinyDyzuru: 24, godzinyPracy: 3, rok: 2026, miesiac: 11, rodzaj: 'miesieczna', stawka: 6000 })).toMatchObject({ domowy: true, kwota: 0, praca: 3 });
  });
  it('błędy', () => {
    expect(() => dyzur({ miejsce: 'zaklad', godzinyDyzuru: 5, godzinyPracy: 6, rok: 2026, miesiac: 11, rodzaj: 'godzinowa', stawka: 30 })).toThrow(RangeError);
    expect(() => dyzur({ miejsce: 'zaklad', godzinyDyzuru: 5, rok: 2026, miesiac: 11, rodzaj: 'godzinowa' })).toThrow(RangeError);
  });
});
