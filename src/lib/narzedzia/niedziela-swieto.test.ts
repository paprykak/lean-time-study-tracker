import { describe, expect, it } from 'vitest';
import { dodatekZaNiedziele, okresZawierajacy, rodzajDnia, wolneZaNiedzieleSwieto } from './niedziela-swieto';

describe('praca w niedzielę i święto (art. 151^9–151^11 Kp)', () => {
  it('rodzaj dnia: niedziela, święto, święto w niedzielę', () => {
    expect(rodzajDnia('2026-11-15').rodzaj).toBe('niedziela');
    expect(rodzajDnia('2026-11-11')).toEqual({ rodzaj: 'swieto', nazwa: expect.stringContaining('Niepodległości') });
    expect(rodzajDnia('2026-11-01').rodzaj).toBe('swieto-w-niedziele');
    expect(rodzajDnia('2026-11-12').rodzaj).toBe('zwykly');
  });
  it('okres rozliczeniowy liczony od stycznia', () => {
    expect(okresZawierajacy('2026-11-15', 1)).toEqual({ od: '2026-11-01', do: '2026-11-30' });
    expect(okresZawierajacy('2026-11-15', 3)).toEqual({ od: '2026-10-01', do: '2026-12-31' });
    expect(okresZawierajacy('2026-02-10', 4)).toEqual({ od: '2026-01-01', do: '2026-04-30' });
    expect(() => okresZawierajacy('2026-02-10', 5)).toThrow(RangeError);
  });
  it('niedziela: 6 dni przed albo po; święto: do końca okresu', () => {
    expect(wolneZaNiedzieleSwieto('2026-11-15', 1).okno).toEqual({ od: '2026-11-09', do: '2026-11-21' });
    expect(wolneZaNiedzieleSwieto('2026-11-11', 1)).toMatchObject({ rodzaj: 'swieto', okno: null, okres: { do: '2026-11-30' } });
    expect(wolneZaNiedzieleSwieto('2026-11-01', 1).okno).toEqual({ od: '2026-10-26', do: '2026-11-07' });
  });
  it('dodatek 100%: 12 h × 35 zł = 420 zł', () => {
    expect(dodatekZaNiedziele(12, 35)).toBe(420);
  });
  it('2028 r.: niedziela 2 stycznia i święto 11 listopada w sobotę', () => {
    expect(wolneZaNiedzieleSwieto('2028-01-02', 1)).toMatchObject({ rodzaj: 'niedziela', okno: { od: '2027-12-27', do: '2028-01-08' }, okres: { od: '2028-01-01', do: '2028-01-31' } });
    expect(wolneZaNiedzieleSwieto('2028-11-11', 1)).toMatchObject({ rodzaj: 'swieto', okno: null, okres: { do: '2028-11-30' } });
  });
});
