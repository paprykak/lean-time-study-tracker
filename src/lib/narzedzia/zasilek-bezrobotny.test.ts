import { describe, expect, it } from 'vitest';
import { kwotyNa, naReke, zasilekDlaBezrobotnych, type DaneZasilku } from './zasilek-bezrobotny';

// Daty i kwoty na rękę policzone niezależnie (Python, Decimal, zaokrąglenie połówek w górę).
const baza: DaneZasilku = { rejestracja: '2026-11-12', staz365: true, staz20: false, okres365: false, koniec: 'pracodawca' };

describe('zasiłek dla bezrobotnych (art. 218–225 ustawy o rynku pracy, M.P. 2026 poz. 268)', () => {
  it('kwoty według daty: waloryzacja 1 czerwca, brak kwot po 31 maja 2027 r.', () => {
    expect(kwotyNa('2026-05-31')).toMatchObject({ pierwsze90: 1721.9, potem: 1352.2 });
    expect(kwotyNa('2026-06-01')).toMatchObject({ pierwsze90: 1783.9, potem: 1400.9 });
    expect(kwotyNa('2027-05-31')).not.toBeNull();
    expect(kwotyNa('2027-06-01')).toBeNull();
    expect(kwotyNa('2025-05-31')).toBeNull();
  });
  it('na rękę: 9% zdrowotnej i 12% zaliczki w pełnych złotych', () => {
    expect(naReke(1783.9)).toEqual({ zdrowotna: 160.55, zaliczka: 214, netto: 1409.35 });
    expect(naReke(1400.9)).toEqual({ zdrowotna: 126.08, zaliczka: 168, netto: 1106.82 });
    expect(naReke(2140.68).netto).toBe(1691.02);
    expect(naReke(1681.08).netto).toBe(1327.78);
    expect(naReke(1721.9).netto).toBe(1359.93);
    expect(naReke(1352.2).netto).toBe(1068.5);
  });
  it('180 dni od rejestracji 12 listopada 2026 r.: 90 dni kwoty wyższej, potem niższa', () => {
    const r = zasilekDlaBezrobotnych(baza);
    expect(r).toMatchObject({ prawo: true, wyplataOd: '2026-11-12', koniec: '2027-05-10', dniWyplaty: 180, karencja: false, procent: 100 });
    if (!r.prawo) throw new Error();
    expect(r.odcinki).toEqual([
      { od: '2026-11-12', do: '2027-02-09', dni: 90, wyzsza: true, brutto: 1783.9, netto: 1409.35 },
      { od: '2027-02-10', do: '2027-05-10', dni: 90, wyzsza: false, brutto: 1400.9, netto: 1106.82 },
    ]);
  });
  it('365 dni i 20 lat stażu: 120%, po 1 czerwca 2027 r. kwota jeszcze nieznana', () => {
    const r = zasilekDlaBezrobotnych({ ...baza, staz20: true, okres365: true });
    if (!r.prawo) throw new Error();
    expect(r.koniec).toBe('2027-11-11');
    expect(r.odcinki.map((o) => [o.od, o.do, o.brutto])).toEqual([
      ['2026-11-12', '2027-02-09', 2140.68],
      ['2027-02-10', '2027-05-31', 1681.08],
      ['2027-06-01', '2027-11-11', null],
    ]);
  });
  it('porozumienie stron z innych przyczyn: wypłata po 90 dniach, okres skrócony', () => {
    const r = zasilekDlaBezrobotnych({ ...baza, koniec: 'porozumienie' });
    expect(r).toMatchObject({ prawo: true, wyplataOd: '2027-02-10', koniec: '2027-05-10', dniWyplaty: 90, karencja: true });
    if (!r.prawo) throw new Error();
    expect(r.odcinki).toHaveLength(1);
    expect(r.odcinki[0]).toMatchObject({ wyzsza: true, brutto: 1783.9, dni: 90 });
  });
  it('rejestracja w marcu 2026 r.: waloryzacja w trakcie pobierania', () => {
    const r = zasilekDlaBezrobotnych({ ...baza, rejestracja: '2026-03-01' });
    if (!r.prawo) throw new Error();
    expect(r.odcinki.map((o) => [o.od, o.do, o.brutto])).toEqual([
      ['2026-03-01', '2026-05-29', 1721.9],
      ['2026-05-30', '2026-05-31', 1352.2],
      ['2026-06-01', '2026-08-27', 1400.9],
    ]);
  });
  it('brak prawa: własne wypowiedzenie, dyscyplinarka, za krótki staż', () => {
    expect(zasilekDlaBezrobotnych({ ...baza, koniec: 'wypowiedzenie-wlasne' })).toEqual({ prawo: false, powod: 'wypowiedzenie-wlasne' });
    expect(zasilekDlaBezrobotnych({ ...baza, koniec: 'dyscyplinarka' })).toEqual({ prawo: false, powod: 'dyscyplinarka' });
    expect(zasilekDlaBezrobotnych({ ...baza, staz365: false })).toEqual({ prawo: false, powod: 'staz' });
    expect(() => zasilekDlaBezrobotnych({ ...baza, rejestracja: '2027-07-01' })).toThrow(RangeError);
  });
});
