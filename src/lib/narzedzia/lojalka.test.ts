import { describe, expect, it } from 'vitest';
import { lojalka, type DaneLojalki } from './lojalka';

const D: DaneLojalki = { koszt: 5000, ukonczenie: '2026-03-31', miesiecy: 24, koniecPracy: '2027-01-15', rozwiazanie: 'wypowiedzenie-pracownika' };

describe('lojalka: zwrot kosztów nauki (art. 103^5 Kp)', () => {
  it('wypowiedzenie po 290 z 731 dni: zwrot 441/731 kosztu', () => {
    expect(lojalka(D)).toEqual({ stan: 'zwrot', koniecZobowiazania: '2028-03-31', okres: 731, przepracowane: 290, kwota: 3016.42, podstawa: 'art. 103⁵ pkt 3' });
  });
  it('dyscyplinarka i art. 55 bez podstaw też ze zwrotem', () => {
    expect(lojalka({ ...D, rozwiazanie: 'dyscyplinarka' }).kwota).toBe(3016.42);
    expect(lojalka({ ...D, rozwiazanie: 'art55-bez-podstaw' }).podstawa).toBe('art. 103⁵ pkt 4');
  });
  it('wypowiedzenie pracodawcy, porozumienie, koniec umowy, mobbing: bez zwrotu', () => {
    for (const r of ['wypowiedzenie-pracodawcy', 'porozumienie', 'koniec-umowy', 'mobbing'] as const) {
      expect(lojalka({ ...D, rozwiazanie: r })).toMatchObject({ stan: 'bez-zwrotu', kwota: 0 });
    }
  });
  it('ostatni dzień zobowiązania: już bez zwrotu; odejście w trakcie nauki: bez wyliczenia', () => {
    expect(lojalka({ ...D, koniecPracy: '2028-03-31' })).toMatchObject({ stan: 'po-okresie', kwota: 0 });
    expect(lojalka({ ...D, koniecPracy: '2028-03-30' }).kwota).toBe(6.84);
    expect(lojalka({ ...D, koniecPracy: '2026-03-20' })).toMatchObject({ stan: 'w-trakcie', kwota: null });
  });
  it('okres zobowiązania najwyżej 3 lata', () => {
    expect(() => lojalka({ ...D, miesiecy: 37 })).toThrow(RangeError);
  });
});
