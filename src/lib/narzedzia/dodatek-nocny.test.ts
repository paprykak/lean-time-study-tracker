import { describe, expect, it } from 'vitest';
import { dodatekNocny, doGrosza, tabelaRoku } from './dodatek-nocny';

describe('dodatekNocny (art. 151^8 § 1 Kp)', () => {
  it('przykład z objaśnienia urzędowego (ZPE): 2022, płaca 3010 zł, 10 godzin', () => {
    const wrzesien = dodatekNocny({ rok: 2022, miesiac: 9, godziny: 10, placaMinimalna: 3010 });
    expect([wrzesien.stawka, wrzesien.zaGodzine, wrzesien.kwota]).toEqual([17.1, 3.42, 34.2]);
    const pazdziernik = dodatekNocny({ rok: 2022, miesiac: 10, godziny: 10, placaMinimalna: 3010 });
    expect([pazdziernik.stawka, pazdziernik.zaGodzine, pazdziernik.kwota]).toEqual([17.92, 3.58, 35.8]);
  });
  it('listopad 2026: 4806 zł / 160 h, 8 godzin nocnych', () => {
    const w = dodatekNocny({ rok: 2026, miesiac: 11, godziny: 8 });
    expect(w).toMatchObject({ placaMinimalna: 4806, stawka: 30.04, zaGodzine: 6.01, kwota: 48.08 });
    expect(w.wymiar.godziny).toBe(160);
  });
  it('wyższy procent z regulaminu', () => {
    expect(dodatekNocny({ rok: 2026, miesiac: 11, godziny: 10, procent: 25 }).zaGodzine).toBe(7.51);
  });
  it('błędy: rok bez płacy minimalnej, ujemne godziny, procent poniżej 20', () => {
    expect(() => dodatekNocny({ rok: 2030, miesiac: 1, godziny: 1 })).toThrow(RangeError);
    expect(() => dodatekNocny({ rok: 2026, miesiac: 1, godziny: -1 })).toThrow(RangeError);
    expect(() => dodatekNocny({ rok: 2026, miesiac: 1, godziny: Number.NaN })).toThrow(RangeError);
    expect(() => dodatekNocny({ rok: 2026, miesiac: 1, godziny: 1, procent: 15 })).toThrow(RangeError);
  });
});

describe('tabelaRoku', () => {
  it('2026: dodatek za godzinę w każdym miesiącu', () => {
    expect(tabelaRoku(2026).map((w) => w.zaGodzine)).toEqual([6.01, 6.01, 5.46, 5.72, 6.01, 5.72, 5.22, 6.01, 5.46, 5.46, 6.01, 6.01]);
  });
  it('2027: płaca 4950 zł, styczeń 152 h', () => {
    const [styczen] = tabelaRoku(2027);
    expect([styczen.placaMinimalna, styczen.wymiar.godziny, styczen.zaGodzine]).toEqual([4950, 152, 6.51]);
  });
});

it('doGrosza zaokrągla połówki w górę mimo błędów binarnych', () => {
  expect(doGrosza(30.0375)).toBe(30.04);
  expect(doGrosza(1.005)).toBe(1.01);
  expect(doGrosza(6.008)).toBe(6.01);
  expect(doGrosza(6.01 * 7.5)).toBe(45.08);
  expect(dodatekNocny({ rok: 2026, miesiac: 11, godziny: 7.5 }).kwota).toBe(45.08);
  for (let g = 0; g <= 240; g += 0.25) expect(dodatekNocny({ rok: 2026, miesiac: 11, godziny: g }).kwota).toBe(Math.round(601 * g) / 100);
});
