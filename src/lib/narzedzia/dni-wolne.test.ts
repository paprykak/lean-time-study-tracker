import { describe, expect, it } from 'vitest';
import { dlugieWeekendy, najlepsza, okazje, podsumowanieRoku, zakres } from './dni-wolne';

// Oczekiwane wartości z niezależnego prototypu w Pythonie (dzień po dniu, własny algorytm Wielkanocy).
const OKAZJE_2027 = [
  { urlopOd: '2027-01-04', urlopDo: '2027-01-05', dniUrlopu: 2, wolneOd: '2027-01-01', wolneDo: '2027-01-06', dniWolnego: 6 },
  { urlopOd: '2027-01-04', urlopDo: '2027-01-08', dniUrlopu: 4, wolneOd: '2027-01-01', wolneDo: '2027-01-10', dniWolnego: 10 },
  { urlopOd: '2027-01-07', urlopDo: '2027-01-08', dniUrlopu: 2, wolneOd: '2027-01-06', wolneDo: '2027-01-10', dniWolnego: 5 },
  { urlopOd: '2027-03-22', urlopDo: '2027-03-26', dniUrlopu: 5, wolneOd: '2027-03-20', wolneDo: '2027-03-29', dniWolnego: 10 },
  { urlopOd: '2027-03-30', urlopDo: '2027-04-02', dniUrlopu: 4, wolneOd: '2027-03-27', wolneDo: '2027-04-04', dniWolnego: 9 },
  { urlopOd: '2027-04-26', urlopDo: '2027-04-30', dniUrlopu: 5, wolneOd: '2027-04-24', wolneDo: '2027-05-03', dniWolnego: 10 },
  { urlopOd: '2027-05-04', urlopDo: '2027-05-07', dniUrlopu: 4, wolneOd: '2027-05-01', wolneDo: '2027-05-09', dniWolnego: 9 },
  { urlopOd: '2027-05-24', urlopDo: '2027-05-26', dniUrlopu: 3, wolneOd: '2027-05-22', wolneDo: '2027-05-27', dniWolnego: 6 },
  { urlopOd: '2027-05-24', urlopDo: '2027-05-28', dniUrlopu: 4, wolneOd: '2027-05-22', wolneDo: '2027-05-30', dniWolnego: 9 },
  { urlopOd: '2027-05-28', urlopDo: '2027-05-28', dniUrlopu: 1, wolneOd: '2027-05-27', wolneDo: '2027-05-30', dniWolnego: 4 },
  { urlopOd: '2027-10-25', urlopDo: '2027-10-29', dniUrlopu: 5, wolneOd: '2027-10-23', wolneDo: '2027-11-01', dniWolnego: 10 },
  { urlopOd: '2027-11-02', urlopDo: '2027-11-05', dniUrlopu: 4, wolneOd: '2027-10-30', wolneDo: '2027-11-07', dniWolnego: 9 },
  { urlopOd: '2027-11-08', urlopDo: '2027-11-10', dniUrlopu: 3, wolneOd: '2027-11-06', wolneDo: '2027-11-11', dniWolnego: 6 },
  { urlopOd: '2027-11-08', urlopDo: '2027-11-12', dniUrlopu: 4, wolneOd: '2027-11-06', wolneDo: '2027-11-14', dniWolnego: 9 },
  { urlopOd: '2027-11-12', urlopDo: '2027-11-12', dniUrlopu: 1, wolneOd: '2027-11-11', wolneDo: '2027-11-14', dniWolnego: 4 },
  { urlopOd: '2027-12-20', urlopDo: '2027-12-23', dniUrlopu: 4, wolneOd: '2027-12-18', wolneDo: '2027-12-26', dniWolnego: 9 },
  { urlopOd: '2027-12-27', urlopDo: '2027-12-31', dniUrlopu: 5, wolneOd: '2027-12-24', wolneDo: '2028-01-02', dniWolnego: 10 },
];

describe('dni wolne od pracy, długie weekendy i okazje urlopowe', () => {
  it('2027: święta według dnia tygodnia', () => {
    const p = podsumowanieRoku(2027);
    expect(p.swieta).toHaveLength(14);
    expect(p.wSobote.map((s) => s.data)).toEqual(['2027-05-01', '2027-12-25']);
    expect(p.wNiedziele.map((s) => s.data)).toEqual(['2027-03-28', '2027-05-16', '2027-08-15', '2027-12-26']);
    expect(p.wDniRobocze).toHaveLength(8);
  });
  it('2027: długie weekendy bez urlopu', () => {
    expect(dlugieWeekendy(2027).map((w) => [w.od, w.do, w.dni])).toEqual([
      ['2027-01-01', '2027-01-03', 3],
      ['2027-03-27', '2027-03-29', 3],
      ['2027-05-01', '2027-05-03', 3],
      ['2027-10-30', '2027-11-01', 3],
      ['2027-12-24', '2027-12-26', 3],
    ]);
  });
  it('2026: Wigilia w czwartek daje 4 dni wolnego', () => {
    expect(dlugieWeekendy(2026).map((w) => [w.od, w.do, w.dni])).toEqual([
      ['2026-04-04', '2026-04-06', 3],
      ['2026-05-01', '2026-05-03', 3],
      ['2026-12-24', '2026-12-27', 4],
    ]);
  });
  it('2027: okazje do 5 dni urlopu', () => {
    expect(okazje(2027, 5)).toEqual(OKAZJE_2027);
  });
  it('limit dni urlopu i najlepsza okazja', () => {
    expect(okazje(2027, 4)).toEqual(OKAZJE_2027.filter((o) => o.dniUrlopu <= 4));
    expect(najlepsza(okazje(2027, 4))).toMatchObject({ urlopOd: '2027-01-04', dniWolnego: 10 });
    expect(najlepsza(okazje(2027, 1))).toMatchObject({ urlopOd: '2027-05-28', dniWolnego: 4 });
    expect(okazje(2026, 5)).toHaveLength(18);
    expect(okazje(2026, 5).at(-1)).toEqual({ urlopOd: '2026-12-28', urlopDo: '2026-12-31', dniUrlopu: 4, wolneOd: '2026-12-24', wolneDo: '2027-01-03', dniWolnego: 11 });
  });
  it('zakres dat', () => {
    expect(zakres('2027-01-04', '2027-01-08')).toBe('4–8 stycznia');
    expect(zakres('2027-10-30', '2027-11-01')).toBe('30 października – 1 listopada');
    expect(zakres('2027-12-24', '2028-01-02')).toBe('24 grudnia 2027 r. – 2 stycznia 2028 r.');
    expect(zakres('2027-05-28', '2027-05-28')).toBe('28 maja');
  });
});
