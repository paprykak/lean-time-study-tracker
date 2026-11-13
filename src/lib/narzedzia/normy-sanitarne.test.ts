import { describe, expect, it } from 'vitest';
import { naKazdych, normySanitarne } from './normy-sanitarne';

describe('normy sanitarne (załącznik nr 3 do ogólnych przepisów BHP)', () => {
  it('na każdych N: minimum według pełnych grup, ostrożnie każda rozpoczęta', () => {
    expect(naKazdych(0, 30)).toEqual({ minimum: 0, ostroznie: 0 });
    expect(naKazdych(12, 30)).toEqual({ minimum: 1, ostroznie: 1 });
    expect(naKazdych(31, 30)).toEqual({ minimum: 1, ostroznie: 2 });
    expect(naKazdych(60, 30)).toEqual({ minimum: 2, ostroznie: 2 });
  });
  it('hala: 45 mężczyzn i 25 kobiet na zmianie, praca brudząca, natryski przy brudzeniu ciała', () => {
    const r = normySanitarne({ kobiety: 25, mezczyzni: 45, praca: 'brudzaca', natryski: 'brudzace-cialo' });
    expect(r.razem).toBe(70);
    expect(r.umywalki).toEqual({ minimum: 14, ostroznie: 14 }); // 70 / 5
    expect(r.miskiMezczyzni).toEqual({ minimum: 1, ostroznie: 2 }); // 45 / 30
    expect(r.miskiKobiety).toEqual({ minimum: 1, ostroznie: 2 }); // 25 / 20
    expect(r.pisuary).toEqual({ minimum: 1, ostroznie: 2 });
    expect(r.natryski).toEqual({ minimum: 8, ostroznie: 9 }); // 70 / 8
    expect(r.miskiPrzyNatryskach).toEqual({ minimum: 1, ostroznie: 1 });
    expect(r.jadalnia).toBe(true);
    expect(r.miejscaDlaKobietWCiazy).toBe(1);
  });
  it('biuro: 30 mężczyzn, 20 kobiet → po jednej umywalce', () => {
    expect(normySanitarne({ kobiety: 20, mezczyzni: 30, praca: 'biurowa', natryski: 'brak' }).umywalki).toEqual({ minimum: 2, ostroznie: 2 });
  });
  it('mała firma: 6 osób, bez jadalni', () => {
    const r = normySanitarne({ kobiety: 0, mezczyzni: 6, praca: 'zwykla', natryski: 'brak' });
    expect(r).toMatchObject({ umywalki: { minimum: 1, ostroznie: 1 }, miskiKobiety: { minimum: 0, ostroznie: 0 }, jadalnia: false });
  });
  it('jadalnia przy 20 i mniej osobach przy pracach brudzących i szkodliwych (§ 29 ust. 2)', () => {
    expect(normySanitarne({ kobiety: 0, mezczyzni: 10, praca: 'brudzaca', natryski: 'brak' })).toMatchObject({ jadalnia: true, jadalniaZ: 'praca' });
    expect(normySanitarne({ kobiety: 0, mezczyzni: 10, praca: 'zwykla', natryski: 'przepustowa' })).toMatchObject({ jadalnia: true, jadalniaZ: 'praca' });
    expect(normySanitarne({ kobiety: 0, mezczyzni: 10, praca: 'zwykla', natryski: 'brak' })).toMatchObject({ jadalnia: false, jadalniaZ: null });
    expect(normySanitarne({ kobiety: 0, mezczyzni: 20, praca: 'zwykla', natryski: 'brak' }).jadalnia).toBe(false);
    expect(normySanitarne({ kobiety: 0, mezczyzni: 21, praca: 'zwykla', natryski: 'brak' })).toMatchObject({ jadalnia: true, jadalniaZ: 'liczba' });
  });
  it('błędy', () => {
    expect(() => normySanitarne({ kobiety: 0, mezczyzni: 0, praca: 'zwykla', natryski: 'brak' })).toThrow(RangeError);
  });
});
