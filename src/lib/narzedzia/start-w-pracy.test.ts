// Oczekiwane wartości policzone niezależnie skryptem w Pythonie (datetime, własny kalendarz świąt z Wigilią od 2025 r.).
import { describe, expect, it } from 'vitest';
import { koniecTrzechMiesiecy, obowiazkiNaStart, terminPpk } from './start-w-pracy';

const pelne = { regulamin: true, monitoring: true, ppk: true };
const mapa = (start: string, opcje = pelne) => Object.fromEntries(obowiazkiNaStart({ start, ...opcje }).map((o) => [o.klucz, o]));

describe('terminy pracodawcy na start (art. 29 § 2–3, 229, 237³, 104³, 22² Kp; art. 36 ustawy systemowej; art. 16 ustawy o PPK)', () => {
  it('start w poniedziałek 16 listopada 2026: 7 dni do 23 listopada, 30 dni do 16 grudnia, PPK do 10 marca', () => {
    const m = mapa('2026-11-16');
    expect(m.umowa).toMatchObject({ kiedy: 'przed', data: '2026-11-16' });
    expect(m.informacja).toMatchObject({ kiedy: 'data', data: '2026-11-23' });
    expect(m.informacja.przesunieta).toBeUndefined();
    expect(m.zus.data).toBe('2026-11-23');
    expect(m.zabezpieczenie.data).toBe('2026-12-16');
    expect(m.ppk.data).toBe('2027-03-10');
  });
  it('start w sobotę: 7. dzień wypada w sobotę, po art. 115 KC w poniedziałek', () => {
    const m = mapa('2026-11-14');
    expect(m.informacja).toMatchObject({ data: '2026-11-21', przesunieta: '2026-11-23' });
    expect(m.zabezpieczenie.data).toBe('2026-12-14');
  });
  it('Wigilia i Boże Narodzenie: z 24 grudnia na 28 grudnia; 30. dzień w sobotę 16 stycznia na 18 stycznia', () => {
    const m = mapa('2026-12-17');
    expect(m.zus).toMatchObject({ data: '2026-12-24', przesunieta: '2026-12-28' });
    expect(m.zabezpieczenie).toMatchObject({ data: '2027-01-16', przesunieta: '2027-01-18' });
    expect(m.ppk).toMatchObject({ data: '2027-04-10', przesunieta: '2027-04-12' });
  });
  it('PPK: 3 miesiące od 1. dnia miesiąca kończą się z końcem miesiąca (1 listopada → 31 stycznia → 10 lutego)', () => {
    expect(koniecTrzechMiesiecy('2026-11-01')).toBe('2027-01-31');
    expect(terminPpk('2026-11-01')).toBe('2027-02-10');
    expect(koniecTrzechMiesiecy('2026-11-30')).toBe('2027-02-28');
    expect(terminPpk('2026-11-30')).toBe('2027-03-10');
    expect(terminPpk('2026-12-01')).toBe('2027-03-10');
    expect(koniecTrzechMiesiecy('2028-02-29')).toBe('2028-05-28');
    expect(mapa('2028-02-29').ppk).toMatchObject({ data: '2028-06-10', przesunieta: '2028-06-12' });
  });
  it('bez regulaminu, monitoringu i PPK: tych pozycji nie ma, a informacja obejmuje wypłatę i porę nocną', () => {
    const m = mapa('2026-11-16', { regulamin: false, monitoring: false, ppk: false });
    expect(m.regulamin).toBeUndefined();
    expect(m.monitoring).toBeUndefined();
    expect(m.ppk).toBeUndefined();
    expect(m.informacja.nazwa).toMatch(/wypłacie, porze nocnej/);
    expect(Object.keys(mapa('2026-11-16'))).toEqual(['umowa', 'badania', 'bhp', 'regulamin', 'monitoring', 'informacja', 'zus', 'zabezpieczenie', 'ppk']);
  });
  it('błędna data', () => {
    expect(() => obowiazkiNaStart({ start: '2026-02-29', ...pelne })).toThrow(/pierwszy dzień/);
    expect(() => obowiazkiNaStart({ start: '', ...pelne })).toThrow();
  });
});

describe('kontrola trzeźwości (art. 22¹c § 12 Kp)', () => {
  it('informacja przed dopuszczeniem do pracy tylko przy kontroli', () => {
    const z = obowiazkiNaStart({ start: '2026-12-01', regulamin: true, monitoring: false, ppk: false, trzezwosc: true }).find((o) => o.klucz === 'trzezwosc');
    expect(z).toMatchObject({ kiedy: 'przed', data: '2026-12-01' });
    expect(obowiazkiNaStart({ start: '2026-12-01', regulamin: true, monitoring: false, ppk: false }).some((o) => o.klucz === 'trzezwosc')).toBe(false);
  });
});
