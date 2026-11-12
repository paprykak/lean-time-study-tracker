import { describe, expect, it } from 'vitest';
import { chwilaWPolsce, czasPodrozy, delegacja, dobyPodrozy, ileDiet, ileNoclegow, LIMIT_HOTELU, noceWPodrozy, opisChwili, poPolsku, RYCZALT_KOMUNIKACJA, RYCZALT_NOCLEG } from './delegacja';

const GODZ = 3_600_000;
const podroz = (od: string, do_: string, reszta: Partial<Parameters<typeof delegacja>[0]> = {}) => {
  const [d1, g1] = od.split(' ');
  const [d2, g2] = do_.split(' ');
  return delegacja({ wyjazd: { data: d1, godzina: g1 }, powrot: { data: d2, godzina: g2 }, ...reszta });
};

describe('czas polski', () => {
  it('zima UTC+1, lato UTC+2', () => {
    expect(chwilaWPolsce('2026-11-12', '08:00')).toBe(Date.UTC(2026, 10, 12, 7, 0));
    expect(chwilaWPolsce('2026-07-01', '08:00')).toBe(Date.UTC(2026, 6, 1, 6, 0));
    expect(poPolsku(Date.UTC(2026, 6, 1, 6, 0))).toEqual({ data: '2026-07-01', godzina: '8:00' });
  });
  it('noc zmiany czasu: brakująca godzina przechodzi dalej, powtórzona to drugie wystąpienie', () => {
    expect(chwilaWPolsce('2026-03-29', '02:30')).toBe(Date.UTC(2026, 2, 29, 1, 30));
    expect(chwilaWPolsce('2026-10-25', '02:30')).toBe(Date.UTC(2026, 9, 25, 1, 30));
    expect(chwilaWPolsce('2026-10-25', '04:00') - chwilaWPolsce('2026-10-24', '20:00')).toBe(9 * GODZ);
  });
  it('opis czasu', () => {
    expect(czasPodrozy(36.5 * GODZ)).toBe('1 doba, 12 godz. 30 min');
    expect(czasPodrozy(9 * GODZ)).toBe('9 godz.');
    expect(czasPodrozy(72 * GODZ)).toBe('3 doby');
    expect(czasPodrozy(5 * 24 * GODZ)).toBe('5 dób');
    expect(czasPodrozy(22 * 24 * GODZ)).toBe('22 doby');
    expect(czasPodrozy(12 * 24 * GODZ)).toBe('12 dób');
    expect(opisChwili(chwilaWPolsce('2026-11-12', '06:05'))).toBe('12 listopada, 6:05');
    expect([1, 1.5, 2, 5, 22].map(ileDiet)).toEqual(['1 dieta', '1,5 diety', '2 diety', '5 diet', '22 diety']);
    expect([1, 2, 5, 12].map(ileNoclegow)).toEqual(['1 nocleg', '2 noclegi', '5 noclegów', '12 noclegów']);
  });
});

describe('dieta krajowa (§ 7 ust. 2 rozporządzenia)', () => {
  it('stałe: 45 zł, nocleg 67,50 zł, hotel do 900 zł, komunikacja 9 zł', () => {
    expect([RYCZALT_NOCLEG, LIMIT_HOTELU, RYCZALT_KOMUNIKACJA]).toEqual([67.5, 900, 9]);
  });
  it('do doby: mniej niż 8 h nic, od 8 do 12 h połowa, ponad 12 h cała', () => {
    expect(podroz('2026-11-12 06:00', '2026-11-12 13:59').dieta).toBe(0);
    expect(podroz('2026-11-12 06:00', '2026-11-12 14:00').dieta).toBe(22.5);
    expect(podroz('2026-11-12 06:00', '2026-11-12 18:00').dieta).toBe(22.5);
    expect(podroz('2026-11-12 06:00', '2026-11-12 18:01').dieta).toBe(45);
    expect(podroz('2026-11-12 06:00', '2026-11-13 06:00').dieta).toBe(45);
  });
  it('ponad dobę: pełne doby i reszta do 8 h połowa, ponad 8 h cała', () => {
    expect(podroz('2026-11-12 06:00', '2026-11-13 14:00')).toMatchObject({ dieta: 67.5, liczbaDiet: 1.5 });
    expect(podroz('2026-11-12 06:00', '2026-11-13 14:01')).toMatchObject({ dieta: 90, liczbaDiet: 2 });
    expect(podroz('2026-11-12 06:00', '2026-11-13 18:30')).toMatchObject({ dieta: 90, rozpoczeteDoby: 2 });
    expect(podroz('2026-11-09 07:00', '2026-11-13 17:00').doby.map((d) => d.procent)).toEqual([100, 100, 100, 100, 100]);
  });
  it('zmiana czasu liczy rzeczywiste godziny', () => {
    // 20:00–4:00 w nocy z 24 na 25 października 2026 r. to 9 godzin, a z 28 na 29 marca 7 godzin.
    expect(podroz('2026-10-24 20:00', '2026-10-25 04:00').dieta).toBe(22.5);
    expect(podroz('2026-03-28 20:00', '2026-03-29 04:00').dieta).toBe(0);
  });
});

describe('posiłki (§ 7 ust. 3–5)', () => {
  it('obiad zjada połowę diety, śniadanie i kolacja po 25%', () => {
    expect(podroz('2026-11-12 06:00', '2026-11-12 16:00', { posilki: [{ obiad: true }] })).toMatchObject({ dieta: 0, potracenie: 22.5 });
    expect(podroz('2026-11-12 06:00', '2026-11-12 16:00', { posilki: [{ sniadanie: true }] }).dieta).toBe(11.25);
    expect(podroz('2026-11-12 06:00', '2026-11-12 20:00', { posilki: [{ sniadanie: true, kolacja: true }] }).dieta).toBe(22.5);
  });
  it('całodzienne wyżywienie: bez diety', () => {
    const pelne = { sniadanie: true, obiad: true, kolacja: true };
    expect(podroz('2026-11-12 06:00', '2026-11-14 06:00', { posilki: [pelne, pelne] }).dieta).toBe(0);
  });
  it('potrącenie w dobie, w której był posiłek, najwyżej do diety za tę dobę', () => {
    const r = podroz('2026-11-12 06:00', '2026-11-13 12:00', { posilki: [{}, { sniadanie: true, obiad: true, kolacja: true }] });
    expect(r.doby.map((d) => d.naleznosc)).toEqual([45, 0]);
    expect(r).toMatchObject({ dietaPrzedPotraceniem: 67.5, potracenie: 22.5, dieta: 45 });
  });
});

describe('noclegi i komunikacja (§ 8–9)', () => {
  it('noce między 21 a 7: w ogóle i co najmniej 6 godzin', () => {
    const s = chwilaWPolsce('2026-11-09', '06:00');
    const k = chwilaWPolsce('2026-11-11', '18:00');
    expect(noceWPodrozy(s, k)).toEqual({ wszystkie: 3, doRyczaltu: 2 });
    expect(noceWPodrozy(chwilaWPolsce('2026-11-09', '06:00'), chwilaWPolsce('2026-11-10', '02:00'))).toEqual({ wszystkie: 2, doRyczaltu: 0 });
    expect(noceWPodrozy(chwilaWPolsce('2026-10-24', '20:00'), chwilaWPolsce('2026-10-25', '04:00')).doRyczaltu).toBe(1);
  });
  it('ryczałt za 2 noclegi i komunikacja za 3 rozpoczęte doby', () => {
    const r = podroz('2026-11-09 06:00', '2026-11-11 18:00', { noclegiRyczalt: 2, komunikacja: true });
    expect(r).toMatchObject({ dieta: 135, ryczaltNoclegi: 135, rozpoczeteDoby: 3, komunikacja: 27, razem: 297 });
  });
  it('komunikacja przy podróży krótszej niż doba: jedna rozpoczęta doba', () => {
    expect(podroz('2026-11-12 06:00', '2026-11-12 10:00', { komunikacja: true })).toMatchObject({ dieta: 0, komunikacja: 9, razem: 9 });
  });
});

describe('kilometrówka (§ 3 ust. 3–4, Dz.U. 2023 poz. 5)', () => {
  it('najwyższe stawki za km: 1,15 zł, 0,89 zł, 0,69 zł, 0,42 zł', () => {
    const km = (pojazd: 'auto-ponad-900' | 'auto-do-900' | 'motocykl' | 'motorower') =>
      podroz('2026-11-12 06:00', '2026-11-12 10:00', { pojazd, kilometry: 250 }).kilometrowka;
    expect([km('auto-ponad-900'), km('auto-do-900'), km('motocykl'), km('motorower')]).toEqual([287.5, 222.5, 172.5, 105]);
  });
  it('wlicza się do sumy, bez pojazdu zero', () => {
    expect(podroz('2026-11-12 06:00', '2026-11-12 20:00', { pojazd: 'auto-ponad-900', kilometry: 100 })).toMatchObject({ dieta: 45, kilometrowka: 115, razem: 160 });
    expect(podroz('2026-11-12 06:00', '2026-11-12 20:00', { kilometry: 100 }).kilometrowka).toBe(0);
  });
});

describe('błędy', () => {
  it('powrót przed wyjazdem, za długa podróż, za dużo noclegów', () => {
    expect(() => podroz('2026-11-12 10:00', '2026-11-12 10:00')).toThrow(RangeError);
    expect(() => dobyPodrozy(0, 32 * 24 * GODZ)).toThrow(RangeError);
    expect(() => podroz('2026-11-12 06:00', '2026-11-12 22:00', { noclegiRyczalt: 1 })).toThrow(RangeError);
  });
});
