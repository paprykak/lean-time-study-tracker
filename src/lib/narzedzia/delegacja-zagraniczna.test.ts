import { describe, expect, it } from 'vitest';
import { DIETY_ZAGRANICZNE, INNE_PANSTWA } from '../../data/diety-zagraniczne';
import { delegacjaZagraniczna, ileDietZagranicznych, stawki, wWalucie, type DaneDelegacjiZagranicznej } from './delegacja-zagraniczna';

const podroz = (panstwo: string, od: string, do_: string, reszta: Partial<DaneDelegacjiZagranicznej> = {}) => {
  const [d1, g1] = od.split(' ');
  const [d2, g2] = do_.split(' ');
  return delegacjaZagraniczna({ panstwo, wyjazd: { data: d1, godzina: g1 }, powrot: { data: d2, godzina: g2 }, ...reszta });
};

describe('tabela stawek (załącznik, Dz.U. 2023 poz. 2190)', () => {
  it('114 państw z tabeli i 5 pozycji spod niej, bez powtórzeń', () => {
    expect(DIETY_ZAGRANICZNE).toHaveLength(119);
    expect(new Set(DIETY_ZAGRANICZNE.map((x) => x.panstwo)).size).toBe(119);
    // 119 wierszy to 117 państw i terytoriów: USA ma osobne wiersze dla Nowego Jorku i Waszyngtonu (opis strony).
    expect(new Set(DIETY_ZAGRANICZNE.map((x) => x.panstwo.replace(/ \(poza.*\)|: .*/, ''))).size).toBe(117);
  });
  it('wybrane stawki', () => {
    expect(stawki('Niemcy')).toMatchObject({ waluta: 'EUR', dieta: 49, nocleg: 170 });
    expect(stawki('Wielka Brytania')).toMatchObject({ waluta: 'GBP', dieta: 45, nocleg: 220 });
    expect(stawki('Norwegia')).toMatchObject({ waluta: 'NOK', dieta: 496, nocleg: 1650 });
    expect(stawki('Japonia')).toMatchObject({ waluta: 'JPY', dieta: 7532, nocleg: 22000 });
    expect(stawki('Stany Zjednoczone Ameryki: Nowy Jork')).toMatchObject({ dieta: 59, nocleg: 350 });
    expect(stawki('Atlantyda')).toEqual(INNE_PANSTWA);
    expect(INNE_PANSTWA).toMatchObject({ waluta: 'EUR', dieta: 41, nocleg: 140 });
  });
});

describe('dieta za granicą (§ 13 ust. 3)', () => {
  it('niepełna doba: do 8 h 1/3, ponad 8 do 12 h połowa, ponad 12 h cała', () => {
    expect(podroz('Niemcy', '2026-11-12 06:00', '2026-11-12 11:00').dieta).toBe(16.33);
    expect(podroz('Niemcy', '2026-11-12 06:00', '2026-11-12 14:00').dieta).toBe(16.33);
    expect(podroz('Niemcy', '2026-11-12 06:00', '2026-11-12 14:01').dieta).toBe(24.5);
    expect(podroz('Niemcy', '2026-11-12 06:00', '2026-11-12 18:00').dieta).toBe(24.5);
    expect(podroz('Niemcy', '2026-11-12 06:00', '2026-11-12 18:01').dieta).toBe(49);
  });
  it('2 doby i 4 godziny w Niemczech: 114,33 EUR', () => {
    expect(podroz('Niemcy', '2026-11-09 06:00', '2026-11-11 10:00')).toMatchObject({ dieta: 114.33, rozpoczeteDoby: 3, noce: 2 });
  });
});

describe('posiłki (§ 14)', () => {
  it('śniadanie 15%, obiad i kolacja po 30%, całodzienne wyżywienie 25% diety', () => {
    const doba = (posilki: object) => podroz('Niemcy', '2026-11-12 06:00', '2026-11-13 06:00', { posilki: [posilki] }).dieta;
    expect(doba({ sniadanie: true })).toBe(41.65);
    expect(doba({ obiad: true, kolacja: true })).toBe(19.6);
    expect(doba({ sniadanie: true, obiad: true, kolacja: true })).toBe(12.25);
  });
  it('niepełna doba: potrącenie najwyżej do diety za nią, całodzienne 25% tej części', () => {
    expect(podroz('Niemcy', '2026-11-12 06:00', '2026-11-12 11:00', { posilki: [{ obiad: true }] }).dieta).toBe(1.63);
    expect(podroz('Niemcy', '2026-11-12 06:00', '2026-11-12 11:00', { posilki: [{ obiad: true, kolacja: true }] }).dieta).toBe(0);
    expect(podroz('Niemcy', '2026-11-12 06:00', '2026-11-12 11:00', { posilki: [{ sniadanie: true, obiad: true, kolacja: true }] }).dieta).toBe(4.08);
  });
});

describe('nocleg i ryczałty (§ 16–17)', () => {
  it('ryczałt za nocleg 25% limitu, dojazd jedna dieta, komunikacja 10% za rozpoczętą dobę', () => {
    const r = podroz('Niemcy', '2026-11-09 06:00', '2026-11-11 10:00', { noclegiRyczalt: 2, dojazd: 'oba', komunikacja: true });
    expect(r).toMatchObject({ ryczaltNoclegi: 85, dojazd: 49, komunikacja: 14.7, razem: 263.03 });
    expect(podroz('Niemcy', '2026-11-09 06:00', '2026-11-11 10:00', { dojazd: 'jeden' }).dojazd).toBe(24.5);
  });
  it('Nowy Jork: ryczałt za nocleg 87,50 USD', () => {
    expect(podroz('Stany Zjednoczone Ameryki: Nowy Jork', '2026-11-09 06:00', '2026-11-10 10:00', { noclegiRyczalt: 1 }).ryczaltNoclegi).toBe(87.5);
  });
  it('błędy i format', () => {
    expect(() => podroz('Niemcy', '2026-11-09 06:00', '2026-11-09 06:00')).toThrow(RangeError);
    expect(() => podroz('Niemcy', '2026-11-09 06:00', '2026-11-09 22:00', { noclegiRyczalt: 1 })).toThrow(RangeError);
    expect(wWalucie(114.33, 'EUR')).toMatch(/^114,33\sEUR$/);
    expect([1, 1 / 3, 2 + 1 / 3, 1.5, 3, 5].map(ileDietZagranicznych)).toEqual(['1 dieta', '1/3 diety', '2 i 1/3 diety', '1 i 1/2 diety', '3 diety', '5 diet']);
  });
});
