import { describe, expect, it } from 'vitest';
import { lataKalendarza, lataListy } from './dzis-w-formularzu';

describe('lataListy', () => {
  it('strona z bieżącego roku: nic nie dopisuje', () => {
    expect(lataListy([2025, 2026, 2027], 2026, -1, 1)).toEqual([2025, 2026, 2027]);
  });
  it('strona zbudowana w 2026 r., czytana w 2028 r.: dopisuje 2028 i 2029, starych lat nie usuwa', () => {
    expect(lataListy([2025, 2026, 2027], 2028, -1, 1)).toEqual([2025, 2026, 2027, 2028, 2029]);
  });
  it('zakres od bieżącego do +2 (dni wolne) i rok początkowy przepisu zostaje', () => {
    expect(lataListy([2026, 2027, 2028], 2029, 0, 2)).toEqual([2026, 2027, 2028, 2029, 2030, 2031]);
    expect(lataListy([2023, 2025, 2026, 2027], 2026, -1, 1)).toEqual([2023, 2025, 2026, 2027]);
  });
  it('lataKalendarza: poprzedni, bieżący i następny rok', () => {
    expect(lataKalendarza('2027-01-01')).toEqual([2026, 2027, 2028]);
  });
});
