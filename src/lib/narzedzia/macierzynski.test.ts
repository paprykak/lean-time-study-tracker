import { describe, expect, it } from 'vitest';
import { zasilekMacierzynski } from './macierzynski';

describe('zasiłek macierzyński (art. 31 ustawy zasiłkowej, art. 180 i 182^1a Kp)', () => {
  it('6000 zł brutto, jedno dziecko, 100% + 70%: 20 + 32 tygodnie', () => {
    const r = zasilekMacierzynski({ rok: 2026, brutto: 6000, wariant: '100-70' });
    // podstawa 5177,40; 70% = 3624,18
    expect(r).toMatchObject({ podstawa: 5177.4, tygodnieMacierzynskiego: 20, tygodnieRodzicielskiego: 32, miesiecznieMacierzynski: 5177.4, miesiecznieRodzicielski: 3624.18 });
    // 172,58 zł × 140 dni = 24 161,20; 120,81 zł × 224 dni = 27 061,44
    expect(r.razemMacierzynski).toBe(24161.2);
    expect(r.razemRodzicielski).toBe(27061.44);
  });
  it('81,5% za cały okres: 4219,58 zł miesięcznie', () => {
    const r = zasilekMacierzynski({ rok: 2026, brutto: 6000, wariant: '81,5' });
    expect(r.miesiecznieMacierzynski).toBe(4219.58);
    expect(r.miesiecznieRodzicielski).toBe(4219.58);
  });
  it('bliźnięta: 31 tygodni macierzyńskiego i 34 rodzicielskiego matki', () => {
    expect(zasilekMacierzynski({ rok: 2026, brutto: 6000, wariant: '100-70', dzieci: 2 })).toMatchObject({ tygodnieMacierzynskiego: 31, tygodnieRodzicielskiego: 34 });
  });
  it('niski zasiłek podwyższony do 1000 zł (art. 31 ust. 3a)', () => {
    expect(zasilekMacierzynski({ rok: 2026, brutto: 1200, pelnyEtat: false, wariant: '100-70' }).miesiecznieRodzicielski).toBe(1000);
  });
  it('błąd: więcej tygodni niż przysługuje matce', () => {
    expect(() => zasilekMacierzynski({ rok: 2026, brutto: 6000, wariant: '100-70', tygodnieRodzicielskiego: 33 })).toThrow(RangeError);
  });
});
