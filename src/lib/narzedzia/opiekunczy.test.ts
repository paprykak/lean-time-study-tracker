import { describe, expect, it } from 'vitest';
import { zasilekOpiekunczy } from './opiekunczy';

describe('zasiłek opiekuńczy (art. 32–35 ustawy zasiłkowej)', () => {
  it('6000 zł brutto, 5 dni opieki nad chorym dzieckiem: 690,30 zł', () => {
    // podstawa 5177,40; 80% / 30 = 138,06 zł za dzień
    expect(zasilekOpiekunczy({ rok: 2026, brutto: 6000, rodzaj: 'dziecko', dni: 5 })).toEqual({
      podstawa: 5177.4,
      zaDzien: 138.06,
      pozostalo: 60,
      dniPlatne: 5,
      dniPonadLimit: 0,
      kwota: 690.3,
    });
  });
  it('limit 60 dni: po 57 dniach płatne tylko 3', () => {
    expect(zasilekOpiekunczy({ rok: 2026, brutto: 6000, rodzaj: 'dziecko', dni: 7, wykorzystaneTenRodzaj: 57 })).toMatchObject({ dniPlatne: 3, dniPonadLimit: 4 });
  });
  it('inny członek rodziny: 14 dni, ale łącznie nie więcej niż 60', () => {
    expect(zasilekOpiekunczy({ rok: 2026, brutto: 6000, rodzaj: 'czlonek-rodziny', dni: 14 }).dniPlatne).toBe(14);
    expect(zasilekOpiekunczy({ rok: 2026, brutto: 6000, rodzaj: 'czlonek-rodziny', dni: 14, wykorzystaneLacznie: 55 }).dniPlatne).toBe(5);
  });
  it('minimum przy pełnym etacie', () => {
    expect(zasilekOpiekunczy({ rok: 2026, brutto: 3000, rodzaj: 'dziecko', dni: 1 }).podstawa).toBe(4147.1);
  });
});
