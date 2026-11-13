import { describe, expect, it } from 'vitest';
import { urlopOjcowski, zasilekOjcowski, zostaloDni } from './urlop-ojcowski';

describe('urlop ojcowski (art. 182^3 Kp, art. 31 ustawy zasiłkowej)', () => {
  it('dziecko urodzone 15 marca 2026 r.: urlop najpóźniej do 14 marca 2027 r.', () => {
    expect(urlopOjcowski('2026-03-15', '2026-11-12')).toEqual({
      koniec: '2027-03-14',
      ostatniStart: '2027-03-01',
      wniosekDo: '2027-02-22',
      minal: false,
      dniDoKonca: 122,
    });
  });
  it('urodzone 29 lutego: koniec 27 lutego następnego roku (art. 112 KC)', () => {
    expect(urlopOjcowski('2024-02-29', '2024-03-01').koniec).toBe('2025-02-27');
  });
  it('po terminie', () => {
    expect(urlopOjcowski('2025-01-10', '2026-11-12').minal).toBe(true);
  });
  it('zasiłek 100% za 14 dni: 6000 zł brutto → 2416,12 zł', () => {
    expect(zasilekOjcowski(2026, 6000)).toMatchObject({ podstawa: 5177.4, dziennie: 172.58, razem: 2416.12 });
    expect(zasilekOjcowski(2026, 4806).razem).toBe(1935.36);
  });
  it('niska podstawa przy niepełnym etacie: nie mniej niż 1000 zł miesięcznie', () => {
    expect(zasilekOjcowski(2026, 1000, 14, false)).toMatchObject({ miesiecznie: 1000, dziennie: 33.33, razem: 466.62 });
  });
});

describe('zostało dni (komunikat terminu)', () => {
  it('czasownik i rzeczownik według liczby', () => {
    expect(zostaloDni(1)).toBe('Został 1 dzień');
    expect(zostaloDni(2)).toBe('Zostały 2 dni');
    expect(zostaloDni(5)).toBe('Zostało 5 dni');
    expect(zostaloDni(22)).toBe('Zostały 22 dni');
    expect(zostaloDni(12)).toBe('Zostało 12 dni');
  });
});
