import { describe, expect, it } from 'vitest';
import { kwartal, swiadczenieRehabilitacyjne } from './swiadczenie-rehabilitacyjne';

describe('świadczenie rehabilitacyjne (art. 18–19 ustawy zasiłkowej)', () => {
  it('kwartały', () => {
    expect(kwartal('2026-11-12')).toBe('2026-4');
    expect(kwartal('2026-03-31')).toBe('2026-1');
  });
  it('start 12 listopada 2026 r., 6000 zł: podstawa 5177,40 × 100,4%, 90% i 75%', () => {
    expect(swiadczenieRehabilitacyjne({ start: '2026-11-12', brutto: 6000, przyczyna: 'choroba', miesiace: 12 })).toMatchObject({
      podstawa: 5177.4,
      podstawaPoWaloryzacji: 5198.11,
      pierwsze: 4678.3,
      dalej: 3898.58,
      od75: '2027-02-12',
      koniecNajpozniej: '2027-11-11',
      razem: 49122.12,
    });
  });
  it('III kwartał 2026 r.: wskaźnik 109,0%', () => {
    expect(swiadczenieRehabilitacyjne({ start: '2026-07-01', brutto: 6000, przyczyna: 'choroba', miesiace: 3 }).podstawaPoWaloryzacji).toBe(5643.37);
  });
  it('ciąża i wypadek przy pracy: 100% przez cały okres', () => {
    expect(swiadczenieRehabilitacyjne({ start: '2026-11-12', brutto: 6000, przyczyna: 'wypadek', miesiace: 6 })).toMatchObject({ pierwsze: 5198.11, dalej: 5198.11, razem: 31188.66 });
  });
  it('kwartał bez ogłoszonego wskaźnika: bez waloryzacji', () => {
    expect(swiadczenieRehabilitacyjne({ start: '2027-01-15', brutto: 6000, przyczyna: 'choroba', miesiace: 1 })).toMatchObject({ wskaznik: null, podstawaPoWaloryzacji: 5177.4 });
  });
  it('błędy', () => {
    expect(() => swiadczenieRehabilitacyjne({ start: '2026-11-12', brutto: 6000, przyczyna: 'choroba', miesiace: 13 })).toThrow(RangeError);
  });
});
