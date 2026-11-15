import { describe, expect, it } from 'vitest';
import { koniecPrzedawnienia, opisPrzedawnienia, przedawnienie, wyplatyDoDochodzenia } from './przedawnienie';

const sp = (t: string) => t.replace(/\s/g, ' ');

// Oczekiwane daty z niezależnego rachunku w Pythonie (własny kalendarz świąt, art. 85 § 3, 3 lata z art. 291 § 1).
describe('przedawnienie roszczeń pracownika (art. 291 § 1 Kp)', () => {
  it('3 lata od dnia wymagalności, 29 lutego → 28 lutego', () => {
    expect(koniecPrzedawnienia('2023-11-10')).toBe('2026-11-10');
    expect(koniecPrzedawnienia('2024-02-29')).toBe('2027-02-28');
  });
  it('ostatni dzień terminu jeszcze w terminie, następny po terminie', () => {
    expect(przedawnienie('2023-11-10', '2026-11-10')).toMatchObject({ koniec: '2026-11-10', zostalo: 0, status: 'pilne' });
    expect(przedawnienie('2023-11-10', '2026-11-11').status).toBe('po-terminie');
    expect(przedawnienie('2024-01-10', '2026-11-12')).toMatchObject({ zostalo: 59, status: 'wkrotce' });
    expect(przedawnienie('2024-03-08', '2026-11-12').status).toBe('w-terminie');
  });
});

describe('wypłaty, o które można jeszcze wystąpić', () => {
  it('wypłata 10. dnia następnego miesiąca, 12 listopada 2026 r.: najstarsza za listopad 2023 r.', () => {
    const w = wyplatyDoDochodzenia('2026-11-12', 'nastepny', 10);
    expect(w.slice(0, 3)).toEqual([
      { za: '2023-11', wymagalna: '2023-12-08', koniec: '2026-12-08', art115: '2026-12-08', zostalo: 26, status: 'pilne' },
      // 10 stycznia 2027 r. to niedziela: według art. 115 KC poniedziałek 11 stycznia (raporty/terminy/art115.py).
      { za: '2023-12', wymagalna: '2024-01-10', koniec: '2027-01-10', art115: '2027-01-11', zostalo: 59, status: 'wkrotce' },
      { za: '2024-01', wymagalna: '2024-02-09', koniec: '2027-02-09', art115: '2027-02-09', zostalo: 89, status: 'wkrotce' },
    ]);
    expect(w).toHaveLength(36);
    expect(w.at(-1)).toMatchObject({ za: '2026-10', wymagalna: '2026-11-10', koniec: '2029-11-10' });
  });
  it('wypłata ostatniego dnia miesiąca', () => {
    const w = wyplatyDoDochodzenia('2026-11-12', 'ostatni', 0);
    expect(w[0]).toEqual({ za: '2023-11', wymagalna: '2023-11-30', koniec: '2026-11-30', art115: '2026-11-30', zostalo: 18, status: 'pilne' });
    expect(w[1]).toMatchObject({ za: '2023-12', wymagalna: '2023-12-29' });
    expect(w).toHaveLength(36);
  });
  it('dzień wypłaty w następnym miesiącu najpóźniej 10. (art. 85 § 2)', () => {
    expect(() => wyplatyDoDochodzenia('2026-11-12', 'nastepny', 15)).toThrow(RangeError);
    expect(() => wyplatyDoDochodzenia('2026-11-12', 'ten', 30)).toThrow(RangeError);
  });
});

describe('koniec przedawnienia w sobotę albo dzień wolny (art. 115 KC)', () => {
  // 14 listopada 2026 r. to sobota, według art. 115 KC poniedziałek 16 listopada.
  it('między datami roszczenie zostaje na liście jako pilne', () => {
    expect(przedawnienie('2023-11-14', '2026-11-15')).toMatchObject({ koniec: '2026-11-14', art115: '2026-11-16', zostalo: -1, status: 'pilne' });
    expect(przedawnienie('2023-11-14', '2026-11-17').status).toBe('po-terminie');
    // Wypłata 14. dnia w tym samym miesiącu: listopad 2023 r. jeszcze na liście 15 listopada 2026 r.
    expect(wyplatyDoDochodzenia('2026-11-15', 'ten', 14)[0]).toMatchObject({ za: '2023-11', koniec: '2026-11-14', art115: '2026-11-16', status: 'pilne' });
    expect(wyplatyDoDochodzenia('2026-11-17', 'ten', 14)[0].za).toBe('2023-12');
  });
  it('teksty: zdąż do, ostatni dzień według art. 115 KC, jedno zdanie i stan', () => {
    const p = przedawnienie('2023-11-14', '2026-11-10');
    const o = opisPrzedawnienia(p, '2026-11-10');
    expect(sp(o.opis)).toBe('Wypłata z 14 listopada 2023 r.: zdąż do 14 listopada 2026 r.; ostatni dzień według art. 115 KC: 16 listopada 2026 r.');
    expect(sp(o.zdanie)).toMatch(/^14 listopada 2026 r\. to sobota: .*\(art\. 115 Kodeksu cywilnego\)\. /);
    expect(o.status).toBe('Zostało: 4 dni');
    expect(sp(o.krotko)).toBe('14 listopada 2026 r. (według art. 115 KC: 16 listopada 2026 r.)');
    expect(sp(o.zDniami)).toBe('14 listopada 2026 r. (za 4 dni); według art. 115 KC: 16 listopada 2026 r.');
    expect(opisPrzedawnienia(p, '2026-11-15').status).toBe('Pierwsza data minęła; według art. 115 KC zostało: 1 dzień');
    expect(opisPrzedawnienia(p, '2026-11-16').status).toBe('Pierwsza data minęła; według art. 115 KC ostatni dzień to dziś');
    expect(opisPrzedawnienia(p, '2026-11-18').status).toBe('Termin minął 2 dni temu');
    expect(opisPrzedawnienia(p, '2026-11-13').status).toBe('Zostało: 1 dzień');
    const bez = opisPrzedawnienia(przedawnienie('2023-11-10', '2026-11-10'), '2026-11-10');
    expect(sp(bez.opis)).toBe('Wypłata z 10 listopada 2023 r. przedawnia się z końcem dnia 10 listopada 2026 r.');
    expect(bez.zdanie).toBe('');
    expect(bez.status).toBe('Ostatni dzień: dziś');
  });
});
