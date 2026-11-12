import { describe, expect, it } from 'vitest';
import { zasilekPoUstaniu } from './zasilek-po-ustaniu';

describe('zasiłek chorobowy po ustaniu zatrudnienia (art. 7, 8 i 13 ustawy zasiłkowej)', () => {
  it('L4 z czasu pracy trwa dalej: najwyżej 91 dni po ustaniu', () => {
    expect(zasilekPoUstaniu({ ustanie: '2026-03-31', poczatek: '2026-03-20', koniec: '2026-12-31', przyczyna: 'choroba' })).toEqual({
      przysluguje: true,
      od: '2026-04-01',
      do: '2026-06-30',
      dni: 91,
      limit91: true,
      powstalaWCzasiePracy: true,
    });
  });
  it('krótsze L4: do końca zwolnienia', () => {
    expect(zasilekPoUstaniu({ ustanie: '2026-03-31', poczatek: '2026-03-20', koniec: '2026-04-10', przyczyna: 'choroba' })).toMatchObject({ do: '2026-04-10', dni: 10 });
  });
  it('L4 po ustaniu: w ciągu 14 dni i co najmniej 30 dni', () => {
    expect(zasilekPoUstaniu({ ustanie: '2026-03-31', poczatek: '2026-04-14', koniec: '2026-05-13', przyczyna: 'choroba' })).toMatchObject({ przysluguje: true, od: '2026-04-14', dni: 30 });
    expect(zasilekPoUstaniu({ ustanie: '2026-03-31', poczatek: '2026-04-15', koniec: '2026-06-30', przyczyna: 'choroba' })).toMatchObject({ przysluguje: false, powod: 'za-pozno', ostatniDzienPowstania: '2026-04-14' });
    expect(zasilekPoUstaniu({ ustanie: '2026-03-31', poczatek: '2026-04-05', koniec: '2026-05-03', przyczyna: 'choroba' })).toMatchObject({ przysluguje: false, powod: 'za-krotko' });
  });
  it('L4 po ustaniu: 91 dni liczone od pierwszego dnia zasiłku', () => {
    expect(zasilekPoUstaniu({ ustanie: '2026-03-31', poczatek: '2026-04-14', koniec: '2026-12-31', przyczyna: 'choroba' })).toMatchObject({ od: '2026-04-14', do: '2026-07-13', dni: 91 });
  });
  it('choroba zakaźna z długim wylęganiem: w ciągu 3 miesięcy', () => {
    expect(zasilekPoUstaniu({ ustanie: '2026-03-31', poczatek: '2026-06-20', koniec: '2026-08-01', przyczyna: 'zakazna' })).toMatchObject({ przysluguje: true });
  });
  it('ciąża: bez limitu 91 dni, do 270 dni okresu zasiłkowego', () => {
    expect(zasilekPoUstaniu({ ustanie: '2026-03-31', poczatek: '2026-03-01', koniec: '2026-12-31', przyczyna: 'ciaza' })).toMatchObject({ limit91: false, do: '2026-11-25' });
  });
  it('okres zasiłkowy 182 dni wcześniej niż 91 dni', () => {
    expect(zasilekPoUstaniu({ ustanie: '2026-06-15', poczatek: '2026-01-01', koniec: '2026-12-31', przyczyna: 'choroba' })).toMatchObject({ do: '2026-07-01', dni: 16 });
  });
  it('wyłączenia z art. 13 i błędy', () => {
    expect(zasilekPoUstaniu({ ustanie: '2026-03-31', poczatek: '2026-03-20', koniec: '2026-05-31', przyczyna: 'choroba', wylaczenie: true })).toEqual({ przysluguje: false, powod: 'wylaczenie' });
    expect(() => zasilekPoUstaniu({ ustanie: '2026-03-31', poczatek: '2026-04-20', koniec: '2026-04-10', przyczyna: 'choroba' })).toThrow(RangeError);
  });
});
