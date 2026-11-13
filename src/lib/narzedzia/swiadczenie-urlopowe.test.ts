import { describe, expect, it } from 'vitest';
import { etat, maksimum, naReke, podstawaOdpisu, urlop, zlDokladnie } from './swiadczenie-urlopowe';

// Kwoty sprawdzone niezależnie w Pythonie (Decimal, zaokrąglenie w dół do grosza; zaliczka ROUND_HALF_UP do złotych).
describe('świadczenie urlopowe (art. 3 ust. 4–6 i art. 5 ustawy o ZFŚS)', () => {
  it('podstawa: wyższa kwota z drugiego półrocza (art. 5 ust. 2)', () => {
    expect(podstawaOdpisu(2026)).toBe(7848.6);
    expect(podstawaOdpisu(2025)).toBe(7262.39);
    expect(() => podstawaOdpisu(2030)).toThrow(RangeError);
  });
  it('2026, pełny etat: 2943,22 zł (dokładnie 2943,225 zł, w dół)', () => {
    expect(maksimum(2026, 'zwykle')).toMatchObject({ kwota: 2943.22, dokladnie: 2943.225 });
    expect(maksimum(2025, 'zwykle').kwota).toBe(2723.39);
    expect(zlDokladnie(maksimum(2026, 'zwykle').dokladnie)).toBe('2943,225 zł');
    expect(zlDokladnie(maksimum(2025, 'zwykle', etat('7/8')).dokladnie).replace(/\s/g, ' ')).toBe('2382,971719 zł');
  });
  it('niepełny etat proporcjonalnie', () => {
    expect(maksimum(2026, 'zwykle', etat('3/4')).kwota).toBe(2207.41);
    expect(maksimum(2026, 'zwykle', etat('1/2')).kwota).toBe(1471.61);
    expect(maksimum(2026, 'zwykle', etat('7/8')).kwota).toBe(2575.32);
    expect(maksimum(2026, 'zwykle', etat('1/4')).kwota).toBe(735.8);
    expect(maksimum(2025, 'zwykle', etat('3/4')).kwota).toBe(2042.54);
  });
  it('szczególne warunki 50%', () => {
    expect(maksimum(2026, 'szczegolne').kwota).toBe(3924.3);
    expect(maksimum(2026, 'szczegolne', etat('1/4')).kwota).toBe(981.07);
    expect(maksimum(2025, 'szczegolne').kwota).toBe(3631.19);
  });
  it('młodociani 5/6/7% bez proporcji do etatu', () => {
    expect(maksimum(2026, 'mlodociany1').kwota).toBe(392.43);
    expect(maksimum(2026, 'mlodociany2').kwota).toBe(470.91);
    expect(maksimum(2026, 'mlodociany2', etat('1/2')).kwota).toBe(470.91);
    expect(maksimum(2026, 'mlodociany3').kwota).toBe(549.4);
    expect(maksimum(2025, 'mlodociany3').kwota).toBe(508.36);
  });
  it('etat: błędne dane', () => {
    expect(() => etat('0')).toThrow(RangeError);
    expect(() => etat('5/4')).toThrow(RangeError);
    expect(() => etat('abc')).toThrow(RangeError);
  });
  it('urlop: 14 kolejnych dni kalendarzowych, wypłata dzień wcześniej', () => {
    expect(urlop('2026-07-06', '2026-07-19')).toEqual({ dni: 14, spelnia: true, terminWyplaty: '2026-07-05', rok: 2026 });
    expect(urlop('2026-07-06', '2026-07-18')).toMatchObject({ dni: 13, spelnia: false });
    expect(urlop('2026-12-21', '2027-01-03')).toMatchObject({ dni: 14, spelnia: true, rok: 2026 });
    expect(urlop('2028-02-20', '2028-03-04')).toMatchObject({ dni: 14, terminWyplaty: '2028-02-19' });
    expect(urlop('2026-01-01', '2026-01-14').terminWyplaty).toBe('2025-12-31');
    expect(() => urlop('2026-07-10', '2026-07-01')).toThrow(RangeError);
  });
  it('na rękę: zaliczka 12% albo 32% do pełnych złotych, do 26 lat bez podatku', () => {
    expect(naReke(2943.22, 12)).toEqual({ zaliczka: 353, netto: 2590.22 });
    expect(naReke(2943.22, 32)).toEqual({ zaliczka: 942, netto: 2001.22 });
    expect(naReke(2943.22, 0)).toEqual({ zaliczka: 0, netto: 2943.22 });
    expect(naReke(2207.41, 12)).toEqual({ zaliczka: 265, netto: 1942.41 });
    expect(() => naReke(0, 12)).toThrow(RangeError);
  });
});
