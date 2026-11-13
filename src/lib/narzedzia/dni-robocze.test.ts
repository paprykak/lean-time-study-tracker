import { describe, expect, it } from 'vitest';
import { dniRobocze, poDniachRoboczych } from './dni-robocze';

describe('dni robocze (od poniedziałku do piątku bez świąt)', () => {
  it('miesiące i lata zgodne z niezależnym rachunkiem', () => {
    expect(dniRobocze('2026-11-01', '2026-11-30').robocze).toBe(20);
    expect(dniRobocze('2026-12-01', '2026-12-31').robocze).toBe(21);
    expect(dniRobocze('2026-01-01', '2026-12-31')).toMatchObject({ kalendarzowe: 365, robocze: 253 });
    expect(dniRobocze('2027-01-01', '2027-12-31').robocze).toBe(253);
  });
  it('z sobotami jako dniami pracy', () => {
    expect(dniRobocze('2026-12-01', '2026-12-31', true).robocze).toBe(24);
  });
  it('święta w zakresie bez niedziel', () => {
    expect(dniRobocze('2026-12-20', '2026-12-31').swieta.map((s) => s.data)).toEqual(['2026-12-24', '2026-12-25', '2026-12-26']);
  });
  it('10 dni roboczych po piątku 18 grudnia 2026 r.: 7 stycznia 2027 r.', () => {
    expect(poDniachRoboczych('2026-12-18', 10)).toBe('2027-01-07');
  });
  it('błędy', () => {
    expect(() => dniRobocze('2026-12-31', '2026-12-01')).toThrow(RangeError);
    expect(() => poDniachRoboczych('2026-12-18', 0)).toThrow(RangeError);
  });
});

describe('lata spoza 2026–2027', () => {
  it('2028: 251 dni roboczych; styczeń 2010 bez Trzech Króli: 20', () => {
    expect(dniRobocze('2028-01-01', '2028-12-31').robocze).toBe(251);
    expect(dniRobocze('2010-01-01', '2010-01-31').robocze).toBe(20);
  });
});
