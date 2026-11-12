import { describe, expect, it } from 'vitest';
import { terminCzynnosci } from './termin-odwolania';

// Oczekiwane daty z niezależnego rachunku w Pythonie (dzień zdarzenia niewliczony, przesunięcie z sobót i dni wolnych).
describe('terminy odwołania do sądu pracy i sprostowania świadectwa (art. 264 i 97 § 2¹ Kp, art. 111 § 2 i 115 KC)', () => {
  it('wypowiedzenie doręczone 12 listopada 2026 r.: 3 grudnia', () => {
    expect(terminCzynnosci('2026-11-12', 'wypowiedzenie')).toEqual({ pierwotny: '2026-12-03', koniec: '2026-12-03', przesuniecie: [] });
  });
  it('koniec w Wigilię: przesunięcie przez święta i weekend na 28 grudnia', () => {
    const t = terminCzynnosci('2026-12-03', 'bez-wypowiedzenia');
    expect(t.koniec).toBe('2026-12-28');
    expect(t.przesuniecie.map((p) => p.powod)).toEqual(['Wigilia Bożego Narodzenia', 'Boże Narodzenie', 'drugi dzień Bożego Narodzenia', 'niedziela']);
  });
  it('koniec 11 listopada: 12 listopada; koniec w sobotę: poniedziałek', () => {
    expect(terminCzynnosci('2026-10-21', 'wypowiedzenie').koniec).toBe('2026-11-12');
    expect(terminCzynnosci('2026-10-17', 'odmowa-przyjecia').koniec).toBe('2026-11-09');
  });
  it('przełom roku: koniec 2 stycznia 2027 r. (sobota) przechodzi na 4 stycznia', () => {
    expect(terminCzynnosci('2026-12-12', 'wypowiedzenie').koniec).toBe('2027-01-04');
  });
  it('świadectwo pracy: 14 dni', () => {
    expect(terminCzynnosci('2026-11-12', 'sprostowanie-wniosek').koniec).toBe('2026-11-26');
    expect(terminCzynnosci('2026-11-12', 'sprostowanie-sad').koniec).toBe('2026-11-26');
  });
});
