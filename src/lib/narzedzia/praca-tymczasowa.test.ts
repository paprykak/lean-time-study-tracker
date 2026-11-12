import { describe, expect, it } from 'vitest';
import { podsumowanie, sprawdzLimit } from './praca-tymczasowa';

// Oczekiwane wartości policzone niezależnie (brute force w Pythonie, dzień po dniu, to samo okno 36 miesięcy).
describe('praca tymczasowa: 18 miesięcy w 36 (art. 20 ust. 1–4 ustawy o zatrudnianiu pracowników tymczasowych)', () => {
  it('540 dni bez przerwy: limit wyczerpany, powrót po 18 miesiącach przerwy', () => {
    expect(sprawdzLimit([{ od: '2024-01-01', do: '2025-06-23' }], '2025-06-23')).toEqual({
      dniRazem: 540,
      oknoOd: '2022-06-24',
      oknoDo: '2025-06-23',
      dniWOknie: 540,
      przekroczenie: null,
      dalejOd: '2027-01-01',
      odRazu: false,
      dalejDo: '2028-06-23',
      potemOd: '2030-01-01',
    });
  });
  it('dzień ponad 540: przekroczenie w tym dniu', () => {
    expect(sprawdzLimit([{ od: '2024-01-01', do: '2025-06-24' }], '2025-06-24')).toMatchObject({ dniRazem: 541, przekroczenie: '2025-06-24', dalejOd: '2027-01-02' });
  });
  it('3 miesiące pracy: dalej bez przerwy do 24 czerwca 2026 r., potem od 1 stycznia 2028 r.', () => {
    expect(sprawdzLimit([{ od: '2025-01-01', do: '2025-03-31' }], '2025-03-31')).toMatchObject({
      dniRazem: 90,
      przekroczenie: null,
      dalejOd: '2025-04-01',
      dalejDo: '2026-06-24',
      potemOd: '2028-01-01',
    });
  });
  it('dawne skierowanie poza oknem: liczymy od dziś, pełne 540 dni', () => {
    expect(sprawdzLimit([{ od: '2023-01-01', do: '2023-06-30' }], '2026-11-12')).toMatchObject({ dalejOd: '2026-11-12', dalejDo: '2028-05-04', potemOd: '2029-11-12' });
  });
  it('trzy skierowania z przerwami: przekroczenie w drugim, kolejność wpisania bez znaczenia', () => {
    const r = sprawdzLimit(
      [
        { od: '2026-03-01', do: '2026-12-31' },
        { od: '2024-02-01', do: '2024-09-30' },
        { od: '2025-01-01', do: '2025-10-31' },
      ],
      '2026-11-12',
    );
    expect(r).toMatchObject({ dniRazem: 853, oknoOd: '2024-01-01', dniWOknie: 853, przekroczenie: '2025-10-25', dalejOd: '2028-03-12', dalejDo: '2028-10-31', potemOd: '2029-03-01' });
  });
  it('podsumowanie: trzy stany wyniku', () => {
    expect(podsumowanie(sprawdzLimit([{ od: '2024-01-01', do: '2025-06-23' }], '2025-06-23'))).toMatchObject({ naglowek: 'Limit wykorzystany, znów od', status: 'wkrotce' });
    expect(podsumowanie(sprawdzLimit([{ od: '2024-01-01', do: '2025-06-24' }], '2025-06-24'))).toMatchObject({ naglowek: 'Limit przekroczony od', status: 'po-terminie' });
    const w = podsumowanie(sprawdzLimit([{ od: '2025-05-01', do: '2025-09-30' }, { od: '2026-01-01', do: '2026-12-31' }], '2026-11-12'));
    expect(w).toMatchObject({ naglowek: 'Bez przerwy możesz pracować do', status: 'wkrotce', opis: 'W limicie: jeszcze 22 dni' });
  });
  it('błędy', () => {
    expect(() => sprawdzLimit([], '2025-01-01')).toThrow(RangeError);
    expect(() => sprawdzLimit([{ od: '2025-02-01', do: '2025-01-01' }], '2025-03-01')).toThrow(RangeError);
    expect(() => sprawdzLimit([{ od: '2025-01-01', do: '2025-06-30' }, { od: '2025-06-01', do: '2025-12-31' }], '2025-12-31')).toThrow(RangeError);
  });
});
