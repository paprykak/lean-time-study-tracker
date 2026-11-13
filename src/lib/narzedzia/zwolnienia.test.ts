import { describe, expect, it } from 'vitest';
import { OPIS_PLATNOSCI, ZWOLNIENIA, zwolnienie } from './zwolnienia';

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
  it('strażak OSP: czas akcji, szkolenia lub ćwiczeń bez limitu 6 dni, ekwiwalent z gminy (art. 12 i 15 ustawy o OSP)', () => {
    const z = zwolnienie('osp');
    expect(z.wymiar).not.toContain('6 dni');
    expect(z.platnosc).toBe('ekwiwalent-osp');
    expect(z.podstawa).toContain('art. 12');
    expect(OPIS_PLATNOSCI['ekwiwalent-osp']).toContain('budżetu gminy');
  });
  it('krótkie nazwy do listy wyboru: do 28 znaków i różne', () => {
    for (const z of ZWOLNIENIA) expect(z.krotko.length).toBeLessThanOrEqual(28);
    expect(new Set(ZWOLNIENIA.map((z) => z.krotko)).size).toBe(ZWOLNIENIA.length);
  });
  it('unikalne klucze i podstawa przy każdym', () => {
    expect(new Set(ZWOLNIENIA.map((z) => z.klucz)).size).toBe(ZWOLNIENIA.length);
    for (const z of ZWOLNIENIA) expect(z.podstawa).toMatch(/§|art\./);
    expect(() => zwolnienie('xyz')).toThrow(RangeError);
  });
});
