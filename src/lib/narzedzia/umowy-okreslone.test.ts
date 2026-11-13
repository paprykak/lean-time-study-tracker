import { describe, expect, it } from 'vitest';
import { sprawdzUmowy } from './umowy-okreslone';

describe('umowy na czas określony (art. 25^1 Kp)', () => {
  it('jedna umowa od 1 stycznia 2025 r.: limit 33 miesięcy do 30 września 2027 r.', () => {
    expect(sprawdzUmowy([{ od: '2025-01-01', do: '2025-12-31' }])).toEqual({
      liczba: 1,
      ciagle: true,
      dniRazem: 365,
      wynik: { stan: 'w-limicie', limitDo: '2027-09-30', pozostaloDni: 638 },
    });
  });
  it('trzy umowy bez przerw, ostatnia ponad 33 miesiące: czas nieokreślony od 1 października 2027 r.', () => {
    const r = sprawdzUmowy([
      { od: '2025-01-01', do: '2025-12-31' },
      { od: '2026-01-01', do: '2026-12-31' },
      { od: '2027-01-01', do: '2027-12-31' },
    ]);
    expect(r.wynik).toEqual({ stan: 'nieokreslony', od: '2027-10-01', powod: '33-miesiace' });
  });
  it('czwarta umowa: czas nieokreślony od dnia jej zawarcia', () => {
    const r = sprawdzUmowy([
      { od: '2025-01-01', do: '2025-03-31' },
      { od: '2025-04-01', do: '2025-06-30' },
      { od: '2025-07-01', do: '2025-09-30' },
      { od: '2025-10-01', do: '2025-12-31' },
    ]);
    expect(r.wynik).toEqual({ stan: 'nieokreslony', od: '2025-10-01', powod: 'czwarta-umowa' });
  });
  it('przerwy: okresy sumowane, miesiąc = 30 dni (990 dni)', () => {
    const r = sprawdzUmowy([
      { od: '2024-01-01', do: '2024-12-31' }, // 366 dni
      { od: '2025-03-01', do: '2026-12-31' }, // 671 dni, razem 1037 > 990
    ]);
    expect(r.ciagle).toBe(false);
    expect(r.dniRazem).toBe(1037);
    // 990 − 366 = 624 dni drugiej umowy: od 1 marca 2025 r. ostatni dzień to 14 listopada 2026 r.
    expect(r.wynik).toEqual({ stan: 'nieokreslony', od: '2026-11-15', powod: '33-miesiace' });
  });
  it('początek 31. dnia albo 29 lutego bez przerw: dzień przed dniem o tym numerze, przycięty do końca miesiąca (Python)', () => {
    expect(sprawdzUmowy([{ od: '2024-05-31', do: '2024-12-31' }]).wynik).toMatchObject({ stan: 'w-limicie', limitDo: '2027-02-27' });
    expect(sprawdzUmowy([{ od: '2024-02-29', do: '2024-12-31' }]).wynik).toMatchObject({ stan: 'w-limicie', limitDo: '2026-11-28' });
  });
  it('jeden dzień przerwy: suma 990 dni zamiast 1003 dni kalendarzowych, limit o 12 dni wcześniej', () => {
    const ciagle = sprawdzUmowy([{ od: '2025-01-01', do: '2025-12-31' }, { od: '2026-01-01', do: '2027-12-31' }]);
    const zPrzerwa = sprawdzUmowy([{ od: '2025-01-01', do: '2025-12-31' }, { od: '2026-01-02', do: '2027-12-31' }]);
    expect(ciagle.wynik).toEqual({ stan: 'nieokreslony', od: '2027-10-01', powod: '33-miesiace' });
    expect(zPrzerwa.ciagle).toBe(false);
    expect(zPrzerwa.wynik).toEqual({ stan: 'nieokreslony', od: '2027-09-19', powod: '33-miesiace' });
  });
  it('błędy: zachodzące umowy, koniec przed początkiem', () => {
    expect(() => sprawdzUmowy([{ od: '2025-01-01', do: '2025-06-30' }, { od: '2025-06-01', do: '2025-12-31' }])).toThrow(RangeError);
    expect(() => sprawdzUmowy([{ od: '2025-02-01', do: '2025-01-01' }])).toThrow(RangeError);
  });
});
