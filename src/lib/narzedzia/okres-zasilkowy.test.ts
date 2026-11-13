import { describe, expect, it } from 'vitest';
import { okresZasilkowy, scal } from './okres-zasilkowy';

// Daty sprawdzone niezależnie w Pythonie (datetime).
const DWA = [
  { od: '2026-01-05', do: '2026-02-15' },
  { od: '2026-04-01', do: '2026-05-10' },
];

describe('okres zasiłkowy (art. 8–9 ustawy zasiłkowej)', () => {
  it('przerwa 44 dni: zwolnienia się sumują, 82 z 182 dni, limit 18 sierpnia 2026 r.', () => {
    expect(okresZasilkowy(DWA, 'choroba')).toEqual({
      limit: 182,
      poczatekOkresu: '2026-01-05',
      zwolnienWOkresie: 2,
      wykorzystane: 82,
      ponadLimit: 0,
      zostalo: 100,
      koniecLimitu: '2026-08-18',
      nowyOkresOd: '2026-07-11',
    });
  });
  it('przerwa 60 dni łączy, 61 dni zaczyna nowy okres', () => {
    expect(okresZasilkowy([DWA[0], { od: '2026-04-17', do: '2026-04-20' }], 'choroba').poczatekOkresu).toBe('2026-01-05');
    expect(okresZasilkowy([DWA[0], { od: '2026-04-18', do: '2026-04-20' }], 'choroba')).toMatchObject({ poczatekOkresu: '2026-04-18', wykorzystane: 3 });
  });
  it('ciąża po przerwie: bez wcześniejszych zwolnień, limit 270', () => {
    expect(okresZasilkowy(DWA, 'ciaza')).toMatchObject({ limit: 270, poczatekOkresu: '2026-04-01', wykorzystane: 40, zostalo: 230 });
  });
  it('ponad limit: 213 dni od 1 stycznia, limit minął 1 lipca 2026 r.', () => {
    expect(okresZasilkowy([{ od: '2026-01-01', do: '2026-08-01' }], 'choroba')).toMatchObject({ wykorzystane: 182, ponadLimit: 31, zostalo: 0, koniecLimitu: '2026-07-01' });
    expect(okresZasilkowy([{ od: '2026-01-01', do: '2026-07-05' }, { od: '2026-08-01', do: '2026-08-05' }], 'choroba').koniecLimitu).toBe('2026-07-01');
  });
  it('29 lutego i przełom roku: 182 dni od 1 września 2027 r., 270 dni gruźlicy od 1 grudnia 2027 r.', () => {
    // Python: 2027-09-01 + 181 dni = 2028-02-29; 2027-12-01 + 269 dni = 2028-08-26
    expect(okresZasilkowy([{ od: '2027-09-01', do: '2027-09-10' }], 'choroba').koniecLimitu).toBe('2028-02-29');
    expect(okresZasilkowy([{ od: '2027-12-01', do: '2027-12-10' }], 'gruzlica')).toMatchObject({ limit: 270, koniecLimitu: '2028-08-26' });
  });
  it('zwolnienia stykające się i nachodzące scala w jedno', () => {
    expect(scal([{ od: '2026-01-11', do: '2026-01-20' }, { od: '2026-01-01', do: '2026-01-10' }, { od: '2026-01-15', do: '2026-01-25' }])).toEqual([{ od: '2026-01-01', do: '2026-01-25' }]);
    expect(() => scal([{ od: '2026-01-10', do: '2026-01-01' }])).toThrow(RangeError);
  });
});
