// Oczekiwane wartości policzone niezależnie skryptem w Pythonie (datetime, własny kalendarz świąt z Wigilią od 2025 r.).
import { describe, expect, it } from 'vitest';
import { TERMINY_PRACODAWCY, koniecTrzechMiesiecy, obowiazkiNaStart, opisTerminu, terminPpk } from './start-w-pracy';

const pelne = { regulamin: true, monitoring: true, ppk: true };
const mapa = (start: string, opcje = pelne) => Object.fromEntries(obowiazkiNaStart({ start, ...opcje }).map((o) => [o.klucz, o]));

describe('terminy pracodawcy na start (art. 29 § 2–3, 229, 237³, 104³, 22² Kp; art. 36 ustawy systemowej; art. 16 ustawy o PPK)', () => {
  it('start w poniedziałek 16 listopada 2026: 7 dni do 23 listopada, 30 dni do 16 grudnia, PPK do 10 marca', () => {
    const m = mapa('2026-11-16');
    expect(m.umowa).toMatchObject({ kiedy: 'przed', data: '2026-11-16' });
    expect(m.informacja).toMatchObject({ kiedy: 'data', data: '2026-11-23' });
    expect(m.zus.data).toBe('2026-11-23');
    expect(m.zabezpieczenie.data).toBe('2026-12-16');
    expect(m.ppk.data).toBe('2027-03-10');
  });
  // Obowiązki pracodawcy: bez przesunięcia z art. 115 KC (pakiet „terminy”, 2026-11-15).
  it('start w sobotę: 7. dzień wypada w sobotę i zostaje w sobotę (termin pracodawcy)', () => {
    const m = mapa('2026-11-14');
    expect(m.informacja).toEqual(expect.objectContaining({ data: '2026-11-21' }));
    expect('przesunieta' in m.informacja).toBe(false);
    expect(opisTerminu(m.informacja).replace(/\s/g, ' ')).toBe('do 21 listopada 2026 r.');
    expect(opisTerminu(m.umowa)).toBe('przed rozpoczęciem pracy');
    expect(TERMINY_PRACODAWCY).toContain('art. 115 Kodeksu cywilnego');
    expect(m.zabezpieczenie.data).toBe('2026-12-14');
  });
  it('Wigilia: 7. dzień 24 grudnia, 30. dzień w sobotę 16 stycznia, PPK w sobotę 10 kwietnia, wszystko bez przesunięcia', () => {
    const m = mapa('2026-12-17');
    expect(m.zus.data).toBe('2026-12-24');
    expect(m.zabezpieczenie.data).toBe('2027-01-16');
    expect(m.ppk.data).toBe('2027-04-10');
    for (const o of Object.values(m)) expect('przesunieta' in o).toBe(false);
  });
  it('PPK: 3 miesiące od 1. dnia miesiąca kończą się z końcem miesiąca (1 listopada → 31 stycznia → 10 lutego)', () => {
    expect(koniecTrzechMiesiecy('2026-11-01')).toBe('2027-01-31');
    expect(terminPpk('2026-11-01')).toBe('2027-02-10');
    expect(koniecTrzechMiesiecy('2026-11-30')).toBe('2027-02-28');
    expect(terminPpk('2026-11-30')).toBe('2027-03-10');
    expect(terminPpk('2026-12-01')).toBe('2027-03-10');
    expect(koniecTrzechMiesiecy('2028-02-29')).toBe('2028-05-28');
    expect(mapa('2028-02-29').ppk.data).toBe('2028-06-10');
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
