import { describe, expect, it } from 'vitest';
import { czasCzytaniaTekst, dataDluga, dataKrotka, dzienWPolsce, godzinaAlboData, godzinaMinuta } from './daty';

describe('daty po polsku w strefie Europe/Warsaw', () => {
  it('formatuje datę długą i krótką', () => {
    const d = new Date('2026-11-06T09:30:00Z');
    expect(dataDluga(d)).toBe('6 listopada 2026');
    expect(dataKrotka(d)).toBe('6 lis');
  });

  it('godzina jest w czasie polskim, nie UTC (zima: UTC+1, lato: UTC+2)', () => {
    expect(godzinaMinuta(new Date('2026-11-06T06:05:00Z'))).toBe('07:05');
    expect(godzinaMinuta(new Date('2026-07-06T06:05:00Z'))).toBe('08:05');
  });

  it('dzień kalendarzowy liczy się w Polsce: 23:30 UTC 5 listopada to już 6 listopada', () => {
    expect(dzienWPolsce(new Date('2026-11-05T23:30:00Z'))).toBe('2026-11-06');
  });

  it('na listach: dziś godzina, wcześniej data', () => {
    const teraz = new Date('2026-11-06T12:00:00Z');
    expect(godzinaAlboData(new Date('2026-11-06T06:05:00Z'), teraz)).toBe('07:05');
    expect(godzinaAlboData(new Date('2026-11-05T06:05:00Z'), teraz)).toBe('5 lis');
  });

  it('czas czytania co najmniej 1 minuta', () => {
    expect(czasCzytaniaTekst(0.2)).toBe('1 min czytania');
    expect(czasCzytaniaTekst(6.6)).toBe('7 min czytania');
  });
});
