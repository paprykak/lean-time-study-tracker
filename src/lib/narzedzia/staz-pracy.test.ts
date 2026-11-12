import { describe, expect, it } from 'vitest';
import { miesiaceIDni, obliczStaz, opisStazu, polacz, staz } from './staz-pracy';

// Oczekiwane wartości z niezależnego rachunku w Pythonie (te same zasady: art. 112 i 114 KC, okresy bez powtórzeń).
describe('staż pracy (art. 302^1 Kp, okresy bez powtórzeń)', () => {
  it('jeden okres: pełne miesiące kalendarzowe i dni', () => {
    expect(staz([{ od: '2015-09-01', do: '2026-11-12' }])).toEqual({ lata: 11, miesiace: 2, dni: 12 });
    expect(miesiaceIDni('2019-01-15', '2019-03-10')).toEqual({ miesiace: 1, dni: 24 });
  });
  it('nakładające się okresy liczymy raz (art. 302^1 § 10), stykające się łączymy', () => {
    const naklad = [
      { od: '2020-01-01', do: '2020-12-31' },
      { od: '2020-06-01', do: '2021-05-31' },
    ];
    expect(polacz(naklad)).toEqual([{ od: '2020-01-01', do: '2021-05-31' }]);
    expect(staz(naklad)).toEqual({ lata: 1, miesiace: 5, dni: 0 });
    expect(staz([{ od: '2021-01-01', do: '2021-06-30' }, { od: '2021-07-01', do: '2021-12-31' }])).toEqual({ lata: 1, miesiace: 0, dni: 0 });
  });
  it('przerwy: dni ponad pełne miesiące sumujemy, 30 dni = miesiąc', () => {
    expect(
      staz([
        { od: '2019-01-15', do: '2019-03-10' },
        { od: '2019-06-01', do: '2019-08-20' },
        { od: '2020-02-01', do: '2020-02-29' },
      ]),
    ).toEqual({ lata: 0, miesiace: 5, dni: 14 });
  });
  it('umowa i zlecenie: osobno umowy o pracę, razem bez powtórzeń', () => {
    const r = obliczStaz(
      [
        { od: '2020-01-01', do: '2020-12-31', rodzaj: 'umowa' },
        { od: '2020-06-01', do: '2021-05-31', rodzaj: 'zlecenie' },
      ],
      'brak',
    );
    expect(r.razem).toEqual({ lata: 1, miesiace: 5, dni: 0 });
    expect(r.umowy).toEqual({ lata: 1, miesiace: 0, dni: 0 });
    expect(r.dniUrlopu).toBe(20);
  });
  it('urlop: staż ze szkołą, 26 dni od 10 lat, ile brakuje', () => {
    expect(obliczStaz([{ od: '2016-01-01', do: '2020-12-31', rodzaj: 'umowa' }], 'liceum')).toMatchObject({
      doUrlopu: { lata: 9, miesiace: 0, dni: 0 },
      dniUrlopu: 20,
      brakuje: { lata: 1, miesiace: 0, dni: 0 },
    });
    expect(obliczStaz([{ od: '2015-09-01', do: '2026-11-12', rodzaj: 'umowa' }], 'zasadnicza')).toMatchObject({ dniUrlopu: 26, brakuje: null });
  });
  it('opis i błędy', () => {
    expect(opisStazu({ lata: 11, miesiace: 2, dni: 12 })).toBe('11 lat, 2 miesiące i 12 dni');
    expect(opisStazu({ lata: 1, miesiace: 1, dni: 1 })).toBe('1 rok, 1 miesiąc i 1 dzień');
    expect(opisStazu({ lata: 22, miesiace: 5, dni: 0 })).toBe('22 lata, 5 miesięcy i 0 dni');
    expect(() => obliczStaz([], 'brak')).toThrow(RangeError);
    expect(() => staz([{ od: '2020-02-01', do: '2020-01-01' }])).toThrow(RangeError);
  });
});
