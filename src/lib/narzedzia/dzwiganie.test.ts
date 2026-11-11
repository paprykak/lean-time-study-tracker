import { describe, expect, it } from 'vitest';
import { limit, porownaj, tabelaOsoby } from './dzwiganie';

describe('limit (§ 13 i § 17 rozporządzenia o ręcznych pracach transportowych)', () => {
  it.each([
    ['mezczyzna', 'podnoszenie', 'stala', 30],
    ['mezczyzna', 'podnoszenie', 'dorywcza', 50],
    ['kobieta', 'podnoszenie', 'stala', 12],
    ['kobieta', 'podnoszenie', 'dorywcza', 20],
    ['mezczyzna', 'nad-barki', 'stala', 21],
    ['kobieta', 'nad-barki', 'dorywcza', 14],
    ['mezczyzna', 'ponad-25m', 'dorywcza', 30],
    ['kobieta', 'gora-ponad-30', 'stala', 8],
    ['mezczyzna', 'gora-ponad-30', 'stala', 20],
    ['mezczyzna', 'zespolowo', 'dorywcza', 42],
    ['kobieta', 'zespolowo', 'stala', 10],
  ] as const)('%s, %s, %s: %i kg', (o, c, t, kg) => expect(limit(o, c, t).kg).toBe(kg));
});

describe('kobiety w ciąży i karmiące (Dz.U. 2017 poz. 796)', () => {
  it('ciąża: 3 kg, pod górę przy pracy stałej zakaz, zespołowo zakaz', () => {
    expect(limit('ciaza', 'podnoszenie', 'dorywcza').kg).toBe(3);
    expect(limit('ciaza', 'gora-do-30', 'stala')).toMatchObject({ kg: 0, zakaz: true });
    expect(limit('ciaza', 'gora-do-30', 'dorywcza').kg).toBe(1);
    expect(limit('ciaza', 'zespolowo', 'dorywcza').zakaz).toBe(true);
  });
  it('karmiąca: 6 i 10 kg, ponad 30° pod górę 4 kg przy pracy stałej', () => {
    expect(limit('karmiaca', 'podnoszenie', 'stala').kg).toBe(6);
    expect(limit('karmiaca', 'podnoszenie', 'dorywcza').kg).toBe(10);
    expect(limit('karmiaca', 'gora-ponad-30', 'stala').kg).toBe(4);
  });
});

describe('młodociani (Dz.U. 2023 poz. 1240): 60% dla dziewcząt, 40% dla chłopców', () => {
  it('wartości z zaokrągleniem do 0,1 kg', () => {
    expect(limit('mlodociana', 'podnoszenie', 'stala').kg).toBe(7.2);
    expect(limit('mlodociany', 'podnoszenie', 'stala').kg).toBe(12);
    expect(limit('mlodociany', 'nad-barki', 'stala').kg).toBe(8.4);
    expect(limit('mlodociana', 'nad-barki', 'stala').kg).toBe(4.8);
  });
});

it('porownaj i tabela', () => {
  expect(porownaj(25, limit('kobieta', 'podnoszenie', 'dorywcza'))).toEqual({ miesciSie: false, roznica: 5 });
  expect(porownaj(12, limit('kobieta', 'podnoszenie', 'stala')).miesciSie).toBe(true);
  expect(porownaj(0.5, limit('ciaza', 'zespolowo', 'stala')).miesciSie).toBe(false);
  expect(tabelaOsoby('mezczyzna')).toHaveLength(6);
});
