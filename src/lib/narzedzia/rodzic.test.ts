import { describe, expect, it } from 'vitest';
import { planRodzica, uprawnieniaRodzica } from './rodzic';

describe('rodzic w pracy (art. 67^19, 178, 182^1c, 182^3, 186, 186^7, 188, 188^1 Kp)', () => {
  it('dziecko urodzone 15 marca 2024 r.: terminy uprawnień', () => {
    const u = Object.fromEntries(uprawnieniaRodzica('2024-03-15').map((x) => [x.klucz, x.do]));
    expect(u).toEqual({
      ojcowski: '2025-03-14',
      rodzicielski: '2030-12-31',
      wychowawczy: '2030-12-31',
      obnizony: '2030-12-31',
      zdalna: '2028-03-14',
      elastyczna: '2032-03-14',
      zgoda: '2032-03-14',
      wolne: '2038-03-14',
    });
  });
  it('plan od 1 grudnia 2026 r.: ojcowski minął, wniosek o wychowawczy do 10 listopada', () => {
    const p = Object.fromEntries(planRodzica('2024-03-15', '2026-12-01').map((x) => [x.klucz, x]));
    expect(p.ojcowski.dostepne).toBe(false);
    expect(p.wychowawczy).toMatchObject({ dostepne: true, wniosekDo: '2026-11-10' });
    expect(p.zdalna).toMatchObject({ dostepne: true, wniosekDo: null });
  });
  it('29 lutego: 4 lata kończą się 28 lutego', () => {
    expect(uprawnieniaRodzica('2024-02-29').find((x) => x.klucz === 'zdalna')?.do).toBe('2028-02-28');
  });
  it('początek przed urodzeniem to błąd', () => {
    expect(() => planRodzica('2024-03-15', '2024-01-01')).toThrow(RangeError);
  });
});
