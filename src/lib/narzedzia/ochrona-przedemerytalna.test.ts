import { describe, expect, it } from 'vitest';
import { ochronaPrzedemerytalna } from './ochrona-przedemerytalna';

describe('ochrona przedemerytalna (art. 39 Kp, art. 24 ustawy emerytalnej)', () => {
  it('65 lat: ochrona od 61. urodzin do dnia przed 65. urodzinami', () => {
    expect(ochronaPrzedemerytalna('1964-03-15', 65, '2026-11-12')).toEqual({
      od: '2025-03-15',
      do: '2029-03-14',
      wiekEmerytalny: '2029-03-15',
      stan: 'w-ochronie',
      dniDoOchrony: 0,
    });
  });
  it('60 lat: przed ochroną, ile dni zostało', () => {
    expect(ochronaPrzedemerytalna('1971-01-10', 60, '2026-11-12')).toMatchObject({ od: '2027-01-10', stan: 'przed', dniDoOchrony: 59 });
  });
  it('po osiągnięciu wieku emerytalnego ochrona się kończy', () => {
    expect(ochronaPrzedemerytalna('1962-05-01', 65, '2026-11-12').stan).toBe('w-ochronie');
    expect(ochronaPrzedemerytalna('1962-05-01', 60, '2026-11-12').stan).toBe('po');
  });
  it('urodzeni 29 lutego: 28 lutego w roku nieprzestępnym', () => {
    expect(ochronaPrzedemerytalna('1968-02-29', 60, '2026-11-12')).toMatchObject({ od: '2024-02-29', wiekEmerytalny: '2028-02-29' });
    expect(ochronaPrzedemerytalna('1964-02-29', 65, '2026-11-12')).toMatchObject({ od: '2025-02-28', wiekEmerytalny: '2029-02-28', do: '2029-02-27' });
  });
  it('błędy', () => {
    expect(() => ochronaPrzedemerytalna('2030-01-01', 65, '2026-11-12')).toThrow(RangeError);
  });
});
