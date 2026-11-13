import { describe, expect, it } from 'vitest';
import { SPRAWY_PRACOWNICZE, oplataApelacji, oplataOdPisma, opisSadu, sadPierwszejInstancji } from './sad-pracy';

// Oczekiwane kwoty z niezależnego rachunku w Pythonie (progi art. 13 ust. 1, 5% z ust. 2 najwyżej 100 000 zł,
// zaokrąglenie w górę z art. 21 i art. 126¹ § 3 KPC, art. 35 ust. 1 od nadwyżki ponad 50 000 zł).
describe('opłata od pisma (art. 13 ustawy o kosztach sądowych)', () => {
  it('progi opłaty stałej z wartościami granicznymi', () => {
    expect([0.5, 500, 500.01, 1500, 4000, 7500, 10_000, 15_000, 20_000].map(oplataOdPisma)).toEqual([30, 30, 100, 100, 200, 400, 500, 750, 1000]);
  });
  it('5% powyżej 20 000 zł, w górę do złotego, najwyżej 100 000 zł', () => {
    expect([20_001, 20_019, 20_020, 80_000, 2_000_000, 2_000_001, 5_000_000].map(oplataOdPisma)).toEqual([1001, 1001, 1001, 4000, 100_000, 100_000, 100_000]);
    expect(oplataOdPisma(0)).toBe(0);
  });
});

describe('apelacja pracownika (art. 35 ust. 1) i sąd (art. 17 pkt 4, 461 § 1¹ KPC)', () => {
  it('do 50 000 zł bez opłaty, potem od nadwyżki', () => {
    expect([50_000, 50_000.5, 50_001, 50_500, 60_000, 70_000, 70_001, 80_000, 150_000].map(oplataApelacji)).toEqual([0, 30, 30, 30, 500, 1000, 1001, 1500, 5000]);
  });
  it('sąd okręgowy tylko w sprawach majątkowych ponad 100 000 zł spoza art. 461 § 1¹', () => {
    expect(sadPierwszejInstancji('wynagrodzenie', 100_000)).toBe('rejonowy');
    expect(sadPierwszejInstancji('wynagrodzenie', 100_000.01)).toBe('okręgowy');
    expect(sadPierwszejInstancji('mobbing', 500_000)).toBe('rejonowy');
    expect(sadPierwszejInstancji('wypowiedzenie', 500_000)).toBe('rejonowy');
  });
  it('opis wyniku', () => {
    const o = opisSadu('wynagrodzenie', 80_000);
    expect(o.pozew).toBe('0 zł');
    expect(o.apelacja).toMatch(/^1\s?500\szł$/);
    expect(o.sad).toBe('Sąd rejonowy (sąd pracy)');
    expect(o.uwagi.join(' ')).toMatch(/od 30\s000\szł/);
    expect(o.pip).toContain('art. 11 ust. 1 pkt 7');
    expect(opisSadu('mobbing', 0).uwagi[0]).toContain('461 § 1¹');
    expect(opisSadu('wynagrodzenie', 150_000).sad).toBe('Sąd okręgowy (sąd pracy)');
    expect(() => opisSadu('kara', -1)).toThrow(RangeError);
  });
});

describe('podstawa właściwości sądu w sprawach o mobbing', () => {
  it('art. 461 § 1¹ KPC, a art. 5 ustawy zmieniającej tylko jako granica w czasie', () => {
    expect(SPRAWY_PRACOWNICZE.mobbing.sad).toContain('art. 461 § 1¹ Kodeksu postępowania cywilnego');
  });
});
