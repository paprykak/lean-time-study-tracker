import { describe, expect, it } from 'vitest';
import { SPRAWY, opisOdwolania, terminCzynnosci, terminSprawy } from './termin-odwolania';

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

// Wspólna konwencja (pakiet „terminy”): „Zdąż do” bez przesunięcia i ostatni dzień według art. 115 KC.
describe('opis wyniku: zdąż do i art. 115 KC', () => {
  const sp = (t: string) => t.replace(/\s/g, ' ');
  it('koniec w dzień roboczy: „Ostatni dzień”, bez drugiej daty', () => {
    const o = opisOdwolania('2026-11-12', 'wypowiedzenie', '2026-11-12');
    expect(o).toMatchObject({ etykieta: 'Ostatni dzień', art115: null, zdanie: '', status: 'Zostało 21 dni', statusKlasa: 'w-terminie' });
    expect(sp(o.glowny)).toBe('3 grudnia 2026 r.');
  });
  it('koniec w Wigilię: zdąż do 24 grudnia, według art. 115 KC 28 grudnia', () => {
    expect(terminSprawy('2026-12-03', 'bez-wypowiedzenia')).toMatchObject({ zdazDo: '2026-12-24', wedlugArt115: '2026-12-28', rozne: true });
    const o = opisOdwolania('2026-12-03', 'bez-wypowiedzenia', '2026-12-20');
    expect(o.etykieta).toBe('Zdąż do');
    expect(sp(o.glowny)).toBe('24 grudnia 2026 r.');
    expect(sp(o.art115!)).toBe('28 grudnia 2026 r.');
    expect(sp(o.zdanie)).toMatch(/^24 grudnia 2026 r\. to dzień wolny od pracy \(Wigilia Bożego Narodzenia\): .*\(art\. 115 Kodeksu cywilnego\)\. /);
    expect(o.status).toBe('Zostało 4 dni');
  });
  it('dni graniczne: ostatni dzień, okno art. 115 KC, po terminie', () => {
    expect(opisOdwolania('2026-12-03', 'bez-wypowiedzenia', '2026-12-24')).toMatchObject({ status: 'To dziś: złóż albo nadaj pismo dzisiaj', statusKlasa: 'pilne' });
    expect(opisOdwolania('2026-12-03', 'bez-wypowiedzenia', '2026-12-21').statusKlasa).toBe('wkrotce');
    const okno = opisOdwolania('2026-12-03', 'bez-wypowiedzenia', '2026-12-25');
    expect(sp(okno.status)).toBe('Pierwsza data minęła; ostatni dzień według art. 115 KC: 28 grudnia 2026 r.');
    expect(okno.statusKlasa).toBe('pilne');
    expect(opisOdwolania('2026-12-03', 'bez-wypowiedzenia', '2026-12-28').status).toBe('Pierwsza data minęła; ostatni dzień według art. 115 KC: dziś');
    expect(opisOdwolania('2026-12-03', 'bez-wypowiedzenia', '2026-12-29')).toMatchObject({ statusKlasa: 'po-terminie' });
    expect(opisOdwolania('2026-12-03', 'bez-wypowiedzenia', '2026-12-29').status).toContain('art. 265');
    expect(opisOdwolania('2026-11-12', 'kara-sprzeciw', '2026-12-01').status).toContain('nie przewiduje przywrócenia');
  });
  it('pismo do pracodawcy: ma dotrzeć, a nie tylko zostać nadane', () => {
    expect(opisOdwolania('2026-11-12', 'sprostowanie-wniosek', '2026-11-26').status).toBe('To dziś: pismo powinno dziś dotrzeć do pracodawcy');
    expect(opisOdwolania('2026-10-31', 'sprostowanie-wniosek', '2026-11-01').etykieta).toBe('Zdąż do');
  });
  it('terminCzynnosci bez zmian (używa go wypowiedzenie zmieniające)', () => {
    expect(terminCzynnosci('2026-12-03', 'bez-wypowiedzenia')).toMatchObject({ pierwotny: '2026-12-24', koniec: '2026-12-28' });
  });
});
