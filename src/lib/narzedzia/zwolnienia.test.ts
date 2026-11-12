import { describe, expect, it } from 'vitest';
import { ZWOLNIENIA, zwolnienie } from './zwolnienia';

describe('zwolnienia od pracy (§ 15 rozporządzenia, art. 9 ustawy o publicznej służbie krwi)', () => {
  it('ślub i pogrzeb rodzica: 2 dni płatne; pogrzeb babci: 1 dzień', () => {
    expect(zwolnienie('slub')).toMatchObject({ wymiar: '2 dni', platnosc: 'platne' });
    expect(zwolnienie('pogrzeb-najblizszy').wymiar).toBe('2 dni');
    expect(zwolnienie('pogrzeb-dalszy').wymiar).toBe('1 dzień');
  });
  it('krwiodawca: dzień oddania i następny', () => {
    expect(zwolnienie('krew').wymiar).toBe('dzień oddania krwi i dzień następny');
  });
  it('wezwanie do sądu: rekompensata, nie wynagrodzenie od pracodawcy', () => {
    expect(zwolnienie('wezwanie').platnosc).toBe('rekompensata');
  });
  it('unikalne klucze i podstawa przy każdym', () => {
    expect(new Set(ZWOLNIENIA.map((z) => z.klucz)).size).toBe(ZWOLNIENIA.length);
    for (const z of ZWOLNIENIA) expect(z.podstawa).toMatch(/§|art\./);
    expect(() => zwolnienie('xyz')).toThrow(RangeError);
  });
});
