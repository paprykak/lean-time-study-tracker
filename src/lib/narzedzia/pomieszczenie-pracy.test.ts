import { describe, expect, it } from 'vitest';
import { pomieszczeniePracy } from './pomieszczenie-pracy';

describe('pomieszczenie stałej pracy (§ 19 ust. 2 i § 20 ogólnych przepisów BHP)', () => {
  it('100 m², 4 m: 400 m³ → 30 osób z objętości, 50 z podłogi', () => {
    expect(pomieszczeniePracy({ powierzchnia: 100, wysokosc: 4 })).toMatchObject({ zaObjetosc: 30, zaPowierzchnia: 50, maksOsob: 30, wysokoscOk: true });
  });
  it('z maszynami: 40 m² i 60 m³ zajęte', () => {
    expect(pomieszczeniePracy({ powierzchnia: 100, wysokosc: 4, zajetaPowierzchnia: 40, zajetaObjetosc: 60 })).toMatchObject({ wolnaPowierzchnia: 60, wolnaObjetosc: 340, zaPowierzchnia: 30, zaObjetosc: 26, maksOsob: 26 });
  });
  it('czynniki szkodliwe: 3,3 m; przy 3 m nikt', () => {
    expect(pomieszczeniePracy({ powierzchnia: 100, wysokosc: 3, szkodliwe: true })).toMatchObject({ wymaganaWysokosc: 3.3, wysokoscOk: false, maksOsob: 0 });
  });
  it('2,6 m: najwyżej 4 osoby po 15 m³', () => {
    expect(pomieszczeniePracy({ powierzchnia: 30, wysokosc: 2.6 })).toMatchObject({ wysokoscOk: false, niskie: true, maksOsob: 4 });
    expect(pomieszczeniePracy({ powierzchnia: 12, wysokosc: 2.6 })).toMatchObject({ niskie: true, maksOsob: 2 });
    expect(pomieszczeniePracy({ powierzchnia: 30, wysokosc: 2.4 })).toMatchObject({ niskie: false, maksOsob: 0 });
  });
  it('błędy', () => {
    expect(() => pomieszczeniePracy({ powierzchnia: 0, wysokosc: 3 })).toThrow(RangeError);
    expect(() => pomieszczeniePracy({ powierzchnia: 10, wysokosc: 3, zajetaPowierzchnia: 11 })).toThrow(RangeError);
  });
});
