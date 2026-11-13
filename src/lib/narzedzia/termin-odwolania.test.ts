import { describe, expect, it } from 'vitest';
import { SPRAWY, terminCzynnosci } from './termin-odwolania';

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
  it('kara porządkowa: sprzeciw 7 dni, pozew 14 dni', () => {
    expect(terminCzynnosci('2026-11-12', 'kara-sprzeciw').koniec).toBe('2026-11-19');
    expect(terminCzynnosci('2026-11-12', 'kara-sad').koniec).toBe('2026-11-26');
  });
  it('świadectwo pracy: 14 dni', () => {
    expect(terminCzynnosci('2026-11-12', 'sprostowanie-wniosek').koniec).toBe('2026-11-26');
    expect(terminCzynnosci('2026-11-12', 'sprostowanie-sad').koniec).toBe('2026-11-26');
  });
});

describe('przywrócenie terminu (art. 265 § 1 Kp) i przełom 2027/2028', () => {
  it('tylko sprawy z art. 264 i 97 § 2^1', () => {
    expect(SPRAWY['wypowiedzenie'].przywrocenie).toBe(true);
    expect(SPRAWY['sprostowanie-sad'].przywrocenie).toBe(true);
    expect(SPRAWY['kara-sprzeciw'].przywrocenie).toBe(false);
    expect(SPRAWY['kara-sad'].przywrocenie).toBe(false);
    for (const s of Object.values(SPRAWY)) expect(s.krotko.length).toBeLessThanOrEqual(28);
  });
  it('święta 2027 i 2028 (niezależnie w Pythonie)', () => {
    expect(terminCzynnosci('2027-03-08', 'wypowiedzenie').koniec).toBe('2027-03-30');
    expect(terminCzynnosci('2027-12-03', 'wypowiedzenie').koniec).toBe('2027-12-27');
    expect(terminCzynnosci('2027-12-11', 'wypowiedzenie').koniec).toBe('2028-01-03');
    expect(terminCzynnosci('2027-05-06', 'wypowiedzenie').koniec).toBe('2027-05-28');
    expect(terminCzynnosci('2028-12-10', 'wypowiedzenie').koniec).toBe('2029-01-02');
  });
});
