import { describe, expect, it } from 'vitest';
import { terminyWyplaty } from './termin-wyplaty';

// Oczekiwane daty z niezależnego rachunku w Pythonie (własny algorytm Wielkanocy, dni wolne: sobota, niedziela, święta).
describe('terminy wypłaty wynagrodzenia (art. 85 Kp)', () => {
  it('10. dnia miesiąca w 2027 r.', () => {
    expect(terminyWyplaty(2027, 10).map((t) => t.wyplata)).toEqual([
      '2027-01-08', '2027-02-10', '2027-03-10', '2027-04-09', '2027-05-10', '2027-06-10',
      '2027-07-09', '2027-08-10', '2027-09-10', '2027-10-08', '2027-11-10', '2027-12-10',
    ]);
  });
  it('ostatni dzień miesiąca w 2027 r.', () => {
    expect(terminyWyplaty(2027, 'ostatni').map((t) => t.wyplata)).toEqual([
      '2027-01-29', '2027-02-26', '2027-03-31', '2027-04-30', '2027-05-31', '2027-06-30',
      '2027-07-30', '2027-08-31', '2027-09-30', '2027-10-29', '2027-11-30', '2027-12-31',
    ]);
  });
  it('25. dnia w 2026 r.: w grudniu przed Wigilią, z powodem przesunięcia', () => {
    const t = terminyWyplaty(2026, 25);
    expect(t.map((x) => x.wyplata)).toEqual([
      '2026-01-23', '2026-02-25', '2026-03-25', '2026-04-24', '2026-05-25', '2026-06-25',
      '2026-07-24', '2026-08-25', '2026-09-25', '2026-10-23', '2026-11-25', '2026-12-23',
    ]);
    expect(t[11].powod).toEqual(['Boże Narodzenie', 'Wigilia Bożego Narodzenia']);
  });
  it('sobota jako dzień pracy w zakładzie', () => {
    expect(terminyWyplaty(2027, 10, false)[0]).toMatchObject({ ustalony: '2027-01-10', wyplata: '2027-01-09', powod: ['niedziela'] });
  });
  it('błędy', () => {
    expect(() => terminyWyplaty(2027, 30)).toThrow(RangeError);
  });
});
