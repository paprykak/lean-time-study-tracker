import { describe, expect, it } from 'vitest';
import { kwotyNaDzien, odszkodowanie } from './odszkodowanie-wypadek';

describe('jednorazowe odszkodowanie za wypadek przy pracy (art. 11–12 ustawy wypadkowej, M.P. 2026 poz. 292)', () => {
  it('kwota według dnia decyzji ZUS', () => {
    expect(kwotyNaDzien('2026-03-31')?.zaProcent).toBe(1636);
    expect(kwotyNaDzien('2026-04-01')?.zaProcent).toBe(1781);
    expect(kwotyNaDzien('2027-04-01')).toBeNull();
  });
  it('8% uszczerbku w 2026 r.: 14 248 zł', () => {
    expect(odszkodowanie({ dataDecyzji: '2026-11-12', procent: 8, poprzedni: 0, niezdolnosc: false })).toMatchObject({ zaUszczerbek: 14248, razem: 14248 });
  });
  it('z całkowitą niezdolnością i niezdolnością do samodzielnej egzystencji: plus 31 162 zł', () => {
    expect(odszkodowanie({ dataDecyzji: '2026-11-12', procent: 60, poprzedni: 0, niezdolnosc: true }).razem).toBe(60 * 1781 + 31162);
  });
  it('zwiększenie uszczerbku: co najmniej 10 punktów, dopłata za różnicę', () => {
    expect(odszkodowanie({ dataDecyzji: '2026-11-12', procent: 25, poprzedni: 10, niezdolnosc: false })).toMatchObject({ zaUszczerbek: 15 * 1781, zwiekszenie: true });
    expect(odszkodowanie({ dataDecyzji: '2026-11-12', procent: 18, poprzedni: 10, niezdolnosc: false })).toMatchObject({ zaUszczerbek: 0, zaMaleZwiekszenie: true });
  });
  it('decyzja z 2025 r.: 1636 zł za procent', () => {
    expect(odszkodowanie({ dataDecyzji: '2025-10-01', procent: 5, poprzedni: 0, niezdolnosc: false }).razem).toBe(8180);
  });
  it('błędy', () => {
    expect(() => odszkodowanie({ dataDecyzji: '2027-05-01', procent: 5, poprzedni: 0, niezdolnosc: false })).toThrow(RangeError);
    expect(() => odszkodowanie({ dataDecyzji: '2026-11-12', procent: 101, poprzedni: 0, niezdolnosc: false })).toThrow(RangeError);
  });
});
