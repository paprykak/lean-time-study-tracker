// Oczekiwane kwoty policzone niezależnie skryptem w Pythonie (Decimal, zaokrąglenie do grosza połowa w górę; wymiar
// miesiąca z art. 130 Kp: listopad 2026 r. 160 h, styczeń 2027 r. 152 h). Stawkę i połowę zaokrąglamy do grosza przed
// mnożeniem: 5432,10 / 152 = 35,74, połowa 17,87; 3,5 × 35,74 = 125,09; 12,25 × 17,87 = 218,9075 → 218,91.
import { describe, expect, it } from 'vitest';
import { dyzurKierowcy, opisDyzuruKierowcy, type DaneDyzuruKierowcy } from './dyzur-kierowcy';

const baza: DaneDyzuruKierowcy = { rodzaj: 'miesieczna', stawka: 6000, rok: 2026, miesiac: 11, dyzur: 4, przerwy: 10, zaloga: 6, przerywany: 0 };

describe('wynagrodzenie kierowcy za dyżur i przerwy', () => {
  it('pensja 6000 zł w listopadzie 2026 r. (160 h)', () => {
    const r = dyzurKierowcy(baza);
    expect(r.wymiar).toBe(160);
    expect(r.zaGodzine).toBe(37.5);
    expect(r.polowa).toBe(18.75);
    expect(r.kwotaDyzur).toBe(150);
    expect(r.kwotaPrzerwy).toBe(187.5);
    expect(r.kwotaZaloga).toBe(112.5);
    expect(r.kwotaPrzerywany).toBe(0);
    expect(r.razem).toBe(450);
  });
  it('pensja 5432,10 zł w styczniu 2027 r. (152 h), ułamki godzin', () => {
    const r = dyzurKierowcy({ ...baza, stawka: 5432.1, rok: 2027, miesiac: 1, dyzur: 3.5, przerwy: 12.25, zaloga: 1, przerywany: 4.75 });
    expect(r.wymiar).toBe(152);
    expect(r.zaGodzine).toBe(35.74);
    expect(r.polowa).toBe(17.87);
    expect([r.kwotaDyzur, r.kwotaPrzerwy, r.kwotaZaloga, r.kwotaPrzerywany]).toEqual([125.09, 218.91, 17.87, 84.88]);
    expect(r.razem).toBe(446.75);
  });
  it('stawka godzinowa 31,40 zł: połowa zaokrąglana do grosza w górę', () => {
    const r = dyzurKierowcy({ ...baza, rodzaj: 'godzinowa', stawka: 31.4, dyzur: 7.5, przerwy: 3, zaloga: 2.25, przerywany: 0 });
    expect(r.wymiar).toBeNull();
    expect([r.kwotaDyzur, r.kwotaPrzerwy, r.kwotaZaloga]).toEqual([235.5, 47.1, 35.33]);
  });
  it('teksty wyniku', () => {
    const d = { ...baza, przerywany: 2 };
    const o = opisDyzuruKierowcy(dyzurKierowcy(d), d);
    expect(o.razem).toBe('487,50 zł');
    expect(o.godzina).toBe('37,50 zł (pensja przez 160 h do przepracowania w miesiącu); połowa: 18,75 zł');
    expect(o.dyzur).toBe('150,00 zł (4 h × 37,50 zł; art. 9 ust. 5) albo 4 h czasu wolnego');
    expect(o.przerwy).toBe('187,50 zł (10 h × 18,75 zł; co najmniej, art. 27 ust. 1 i art. 9 ust. 6)');
    expect(o.przerywany).toBe('37,50 zł (2 h × 18,75 zł; art. 16 ust. 2)');
    const zero = { ...baza, dyzur: 0, zaloga: 0 };
    const z = opisDyzuruKierowcy(dyzurKierowcy(zero), zero);
    expect(z.dyzur).toBe('—');
    expect(z.zaloga).toBe('—');
  });
  it('błędne dane', () => {
    expect(() => dyzurKierowcy({ ...baza, stawka: 0 })).toThrow(RangeError);
    expect(() => dyzurKierowcy({ ...baza, przerwy: -1 })).toThrow(RangeError);
    expect(() => dyzurKierowcy({ ...baza, dyzur: Number.NaN })).toThrow(RangeError);
  });
});

describe('iloczyn w wyniku zgadza się z kwotą', () => {
  it('pensja 6000 zł w grudniu 2026 r. (160 h) i 5432,10 zł w styczniu 2027 r.', () => {
    for (const d of [{ ...baza, miesiac: 12 }, { ...baza, stawka: 5432.1, rok: 2027, miesiac: 1, dyzur: 3.5, przerwy: 12.25 }]) {
      const r = dyzurKierowcy(d);
      expect(r.kwotaDyzur).toBe(Math.round(d.dyzur * r.zaGodzine * 100) / 100);
      expect(r.kwotaPrzerwy).toBe(Math.round(d.przerwy * r.polowa * 100) / 100);
    }
  });
  it('maj 2027 r.: 1 maja w sobotę, 3 maja i Boże Ciało obniżają wymiar (144 h); granica 744 h', () => {
    expect(dyzurKierowcy({ ...baza, rok: 2027, miesiac: 5 }).wymiar).toBe(144);
    expect(() => dyzurKierowcy({ ...baza, dyzur: 744 })).not.toThrow();
    expect(() => dyzurKierowcy({ ...baza, dyzur: 744.5 })).toThrow(RangeError);
  });
});
