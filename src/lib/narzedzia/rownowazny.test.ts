import { describe, expect, it } from 'vitest';
import { wymiarOkresu } from './czas-pracy';
import { dniSkroconegoTygodnia, dniWeekendowe, opisWyniku, planOkresu, przerwy, statusOkresu } from './rownowazny';

// Wymiary, dni wolne z art. 147, dni dostępne w systemie weekendowym i skróconym tygodniu sprawdzone niezależnie
// w Pythonie (datetime, własna lista świąt, Wielkanoc algorytmem Gaussa).

describe('plan okresu w systemie równoważnym (art. 135–137 Kp)', () => {
  it('12 h, listopad 2026: 13 zmian po 12 h i jedna 4 h, 16 dni wolnych, minimum 10', () => {
    expect(planOkresu('r12', 12, 2026, 11, 1)).toMatchObject({
      od: '2026-11-01',
      do: '2026-11-30',
      wymiar: 160,
      dniKalendarzowe: 30,
      pelneZmiany: 13,
      reszta: 4,
      dniPracy: 14,
      dniWolne: 16,
      minimumWolnych: 10,
      przerwy: 2,
      przerwyReszty: 0,
      odpoczynek: null,
      dostepneDni: null,
      brakuje: 0,
      status: { rodzaj: 'wprost' },
    });
  });
  it('24 h, listopad 2026: 6 zmian po 24 h i jedna 16 h, odpoczynek 24 h, najwyżej 15 zmian w rytmie', () => {
    expect(planOkresu('r24', 24, 2026, 11, 1)).toMatchObject({ pelneZmiany: 6, reszta: 16, dniPracy: 7, dniWolne: 23, przerwy: 3, przerwyReszty: 2, odpoczynek: 24, maksZmianRytm: 15 });
    expect(planOkresu('r24', 24, 2026, 12, 1)).toMatchObject({ wymiar: 160, dniKalendarzowe: 31, dniPracy: 7, minimumWolnych: 11 });
  });
  it('16 h, listopad 2026: 10 zmian bez reszty; 3 miesiące 2027 tylko po przedłużeniu z art. 129 § 2', () => {
    expect(planOkresu('r16', 16, 2026, 11, 1)).toMatchObject({ pelneZmiany: 10, reszta: 0, dniPracy: 10, odpoczynek: 16, maksZmianRytm: 22 });
    expect(planOkresu('r16', 16, 2027, 1, 3)).toMatchObject({ wymiar: 488, dniKalendarzowe: 90, pelneZmiany: 30, reszta: 8, status: { rodzaj: 'przedluzenie' } });
  });
  it('12 h, 3 i 4 miesiące od stycznia 2027: szczególnie uzasadnione i pora roku', () => {
    expect(planOkresu('r12', 12, 2027, 1, 3)).toMatchObject({ wymiar: 488, pelneZmiany: 40, reszta: 8, dniPracy: 41, dniWolne: 49, minimumWolnych: 29, status: { rodzaj: 'szczegolne' } });
    expect(planOkresu('r12', 12, 2027, 1, 4)).toMatchObject({ wymiar: 664, dniKalendarzowe: 120, dniPracy: 56, minimumWolnych: 37, status: { rodzaj: 'pora-roku' } });
  });
  it('rok przestępny 2028: 12 miesięcy, 366 dni, 1992 h, 166 zmian po 12 h; luty 2028 168 h', () => {
    expect(planOkresu('r12', 12, 2028, 1, 12)).toMatchObject({ do: '2028-12-31', dniKalendarzowe: 366, wymiar: 1992, pelneZmiany: 166, reszta: 0, dniWolne: 200, minimumWolnych: 117, status: { rodzaj: 'przedluzenie' } });
    expect(planOkresu('r12', 12, 2028, 2, 1)).toMatchObject({ do: '2028-02-29', dniKalendarzowe: 29, wymiar: 168, dniPracy: 14 });
  });
  it('przejście roku: grudzień 2026 i styczeń 2027, 312 h, 26 zmian', () => {
    expect(planOkresu('r12', 12, 2026, 12, 2)).toMatchObject({ od: '2026-12-01', do: '2027-01-31', dniKalendarzowe: 62, wymiar: 312, dniPracy: 26, minimumWolnych: 23 });
  });
  it('zmiana 10,5 h: 15 pełnych zmian i jedna 2,5 h', () => {
    expect(planOkresu('r12', 10.5, 2026, 11, 1)).toMatchObject({ pelneZmiany: 15, reszta: 2.5, dniPracy: 16, przerwy: 2, przerwyReszty: 0 });
  });
  it('minimum z art. 147 = niedziele + święta poza niedzielą + soboty (= dni − dni pon–pt bez świąt)', () => {
    for (const [rok, m, k] of [[2026, 11, 1], [2027, 1, 4], [2028, 1, 12], [2026, 12, 2]]) {
      const w = wymiarOkresu(rok, m, k);
      const p = planOkresu('r12', 12, rok, m, k);
      expect(p.minimumWolnych).toBe(p.dniKalendarzowe - (w.dniPonPt - w.swietaObnizajace.length));
      expect(p.dniWolne).toBeGreaterThanOrEqual(p.minimumWolnych);
    }
  });
});

describe('weekendowy i skrócony tydzień (art. 143–144 Kp)', () => {
  it('weekendowy, luty 2027: 12 dni po 12 h = 144 h, brakuje 16 h', () => {
    expect(dniWeekendowe(2027, 2, 1)).toBe(12);
    expect(planOkresu('weekendowy', 12, 2027, 2, 1)).toMatchObject({ wymiar: 160, dostepneDni: 12, dostepneGodziny: 144, brakuje: 16 });
  });
  it('weekendowy, listopad 2026: 13 dni pt–nd i 11 listopada (środa) = 14 dni, 168 h, mieści się', () => {
    expect(planOkresu('weekendowy', 12, 2026, 11, 1)).toMatchObject({ dostepneDni: 14, dostepneGodziny: 168, brakuje: 0, dniPracy: 14, pelneZmiany: 13, reszta: 4 });
  });
  it('weekendowy, grudzień 2026: Wigilia w czwartek dochodzi, święta 25–26 w pt i sob liczone raz: 13 dni, brakuje 4 h', () => {
    expect(planOkresu('weekendowy', 12, 2026, 12, 1)).toMatchObject({ wymiar: 160, dostepneDni: 13, brakuje: 4 });
    expect(dniWeekendowe(2028, 2, 1)).toBe(12);
    expect(dniWeekendowe(2027, 1, 3)).toBe(41);
  });
  it('skrócony tydzień: listopad 2026 18 dni, luty 2027 16 dni, luty 2028 17 dni', () => {
    expect(dniSkroconegoTygodnia(2026, 11, 1)).toBe(18);
    expect(dniSkroconegoTygodnia(2027, 2, 1)).toBe(16);
    expect(dniSkroconegoTygodnia(2028, 2, 1)).toBe(17);
    expect(dniSkroconegoTygodnia(2026, 12, 2)).toBe(36);
    expect(planOkresu('skrocony', 12, 2026, 11, 1)).toMatchObject({ dostepneDni: 18, dostepneGodziny: 216, brakuje: 0, dniPracy: 14 });
    expect(planOkresu('skrocony', 9, 2027, 2, 1)).toMatchObject({ dostepneGodziny: 144, brakuje: 16 });
  });
});

describe('status okresu, przerwy i błędy', () => {
  it('status: 24 h ma 3 i 4 miesiące przez art. 137; weekendowy ponad miesiąc tylko z art. 129 § 2', () => {
    expect(statusOkresu('r24', 3)).toMatchObject({ rodzaj: 'szczegolne', podstawa: 'art. 135 § 2 w związku z art. 137 Kp' });
    expect(statusOkresu('r24', 4).rodzaj).toBe('pora-roku');
    expect(statusOkresu('r12', 6).rodzaj).toBe('przedluzenie');
    expect(statusOkresu('weekendowy', 2).rodzaj).toBe('przedluzenie');
    expect(statusOkresu('skrocony', 1).rodzaj).toBe('wprost');
  });
  it('przerwy z art. 134: dokładnie 6 h jedna, 9 h jedna, 9,5 h dwie, 16 h dwie, 16,5 h trzy', () => {
    expect([5.5, 6, 9, 9.5, 16, 16.5, 24].map(przerwy)).toEqual([0, 1, 1, 2, 2, 3, 3]);
  });
  it('błędne dane: zmiana ponad maksimum, do 8 h, ujemna, nie co pół godziny, zły okres', () => {
    expect(() => planOkresu('r12', 12.5, 2026, 11, 1)).toThrow(RangeError);
    expect(() => planOkresu('weekendowy', 13, 2026, 11, 1)).toThrow(RangeError);
    expect(() => planOkresu('r16', 8, 2026, 11, 1)).toThrow(RangeError);
    expect(() => planOkresu('r12', 0, 2026, 11, 1)).toThrow(RangeError);
    expect(() => planOkresu('r12', Number.NaN, 2026, 11, 1)).toThrow(RangeError);
    expect(() => planOkresu('r12', 10.3, 2026, 11, 1)).toThrow(RangeError);
    expect(() => planOkresu('r12', 12, 2026, 11, 5)).toThrow(RangeError);
    expect(() => planOkresu('r12', 12, 2026, 13, 1)).toThrow(RangeError);
    expect(planOkresu('r24', 24, 2026, 11, 1).zmiana).toBe(24);
  });
});

describe('teksty wyniku', () => {
  it('12 h listopad 2026, 24 h z resztą 16 h, weekendowy z brakiem', () => {
    const a = opisWyniku(planOkresu('r12', 12, 2026, 11, 1));
    expect(a).toMatchObject({ glowny: '14 dni pracy', opis: '13 zmian po 12 h i 1 zmiana 4 h; wymiar 160 h', odpoczynek: null, dostepne: null });
    expect(a.wolne).toBe('16 dni; minimum z art. 147 Kp: 10');
    expect(a.przerwy).toBe('na zmianie 12 h: 2 przerwy po 15 min; na zmianie 4 h: bez przerwy');
    expect(a.okres).toBe('1 listopada 2026 r. – 30 listopada 2026 r., 30 dni');
    const b = opisWyniku(planOkresu('r24', 24, 2026, 11, 1));
    expect(b.odpoczynek).toBe('po zmianie 24 h co najmniej 24 h bez pracy, po zmianie 16 h co najmniej 16 h');
    expect(b.glowny).toBe('7 dni pracy');
    const c = opisWyniku(planOkresu('weekendowy', 12, 2027, 2, 1));
    expect(c.glowny).toBe('Brakuje 16 h');
    expect(c.opis).toBe('Wymiaru 160 h nie da się zaplanować w tym okresie: 12 dni po 12 h to 144 h.');
    expect(opisWyniku(planOkresu('r12', 12, 2027, 1, 3)).status).toBe('Okres 3 miesiące: tylko w szczególnie uzasadnionych przypadkach (art. 135 § 2 Kp)');
  });
});
