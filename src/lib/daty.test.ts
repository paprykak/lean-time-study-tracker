import { describe, expect, it } from 'vitest';
import { czasCzytaniaTekst, dataDluga, dataKrotka } from './daty';

describe('daty po polsku w strefie Europe/Warsaw', () => {
  it('formatuje datę długą i krótką', () => {
    const d = new Date('2026-11-06T09:30:00Z');
    expect(dataDluga(d)).toBe('6 listopada 2026');
    expect(dataKrotka(d)).toBe('6 lis 2026');
  });

  it('dzień kalendarzowy liczy się w Polsce: 23:30 UTC 5 listopada to już 6 listopada', () => {
    expect(dataDluga(new Date('2026-11-05T23:30:00Z'))).toBe('6 listopada 2026');
  });

  it('czas czytania co najmniej 1 minuta', () => {
    expect(czasCzytaniaTekst(0.2)).toBe('1 min czytania');
    expect(czasCzytaniaTekst(6.6)).toBe('7 min czytania');
  });
});
