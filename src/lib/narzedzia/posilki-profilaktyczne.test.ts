import { describe, expect, it } from 'vitest';
import { kcalNaKJ, kJNaKcal, ocen, oknoPosilku, okresZimowy, opisz, przekracza, PROGI, sezonZimowy, wpisanaTemperatura, type Dane } from './posilki-profilaktyczne';

// Wartości oczekiwane sprawdzone niezależnie w Pythonie (Decimal, datetime): scratchpad/python/posilki-profilaktyczne.py.
const d = (x: Partial<Dane>): Dane => ({ data: '2026-06-10', miejsce: 'hala', plec: 'mezczyzn', wydatek: null, jednostka: 'kcal', kleska: false, ...x });
const st = (x: Partial<Dane>) => ocen(d(x)).status;

describe('progi wydatku energetycznego (§ 3 ust. 1 rozporządzenia o posiłkach)', () => {
  it('„powyżej”: 2000 kcal u mężczyzn nie wystarcza, 2000,1 kcal tak', () => {
    expect(ocen(d({ wydatek: 2000 }))).toMatchObject({ status: 'nieNalezy', powody: [], pkt: 1, napoje: ['n4'] });
    expect(ocen(d({ wydatek: 2000.1 }))).toMatchObject({ status: 'nalezy', powody: ['p1'] });
  });
  it('kJ z nawiasu albo kcal: 8374 kJ = 2000,1 kcal tak, 8373 kJ nie', () => {
    expect(st({ wydatek: 8374, jednostka: 'kJ' })).toBe('nalezy');
    expect(st({ wydatek: 8373, jednostka: 'kJ' })).toBe('nieNalezy');
  });
  it('kobiety: 1100 kcal = 4605,48 kJ przekracza 4605 kJ (wariant bezpieczny), 1099,8 kcal i 4605 kJ nie, 4606 kJ tak', () => {
    expect(st({ plec: 'kobiet', wydatek: 1100 })).toBe('nalezy');
    expect(st({ plec: 'kobiet', wydatek: 1099.8 })).toBe('nieNalezy');
    expect(st({ plec: 'kobiet', wydatek: 4605, jednostka: 'kJ' })).toBe('nieNalezy');
    expect(st({ plec: 'kobiet', wydatek: 4606, jednostka: 'kJ' })).toBe('nalezy');
  });
  it('chłodnia przez cały rok: 1000 kcal nie, 1000,5 kcal i 4187 kJ tak; 6280 kJ u mężczyzn nie, 6280,1 kJ i 1500 kcal tak', () => {
    const ch = { data: '2026-07-15', miejsce: 'chlodnia' as const };
    expect(ocen(d({ ...ch, plec: 'kobiet', wydatek: 1000 }))).toMatchObject({ status: 'nieNalezy', pkt: 2, napoje: [] });
    expect(ocen(d({ ...ch, plec: 'kobiet', wydatek: 1000.5 }))).toMatchObject({ status: 'nalezy', powody: ['p2'] });
    expect(st({ ...ch, plec: 'kobiet', wydatek: 4187, jednostka: 'kJ' })).toBe('nalezy');
    expect(st({ ...ch, wydatek: 6280, jednostka: 'kJ' })).toBe('nieNalezy');
    expect(st({ ...ch, wydatek: 6280.1, jednostka: 'kJ' })).toBe('nalezy');
    expect(st({ ...ch, wydatek: 1500 })).toBe('nalezy');
  });
  it('gorące stanowisko: pkt 2 i napoje z solami mineralnymi', () => {
    expect(ocen(d({ data: '2026-07-15', miejsce: 'goraco', wydatek: 1600 }))).toMatchObject({ status: 'nalezy', powody: ['p2'], napoje: ['n1', 'n4'] });
  });
});

describe('okres zimowy na otwartej przestrzeni (§ 3 ust. 1 pkt 3)', () => {
  it('1 listopada i 31 marca w okresie, 31 października i 1 kwietnia poza nim', () => {
    expect(ocen(d({ data: '2026-11-01', miejsce: 'zewnatrz', wydatek: 1600 }))).toMatchObject({ status: 'nalezy', powody: ['p3'], pkt: 3 });
    expect(ocen(d({ data: '2026-10-31', miejsce: 'zewnatrz', wydatek: 1600 }))).toMatchObject({ status: 'nieNalezy', pkt: 1, napoje: ['n4'] });
    expect(st({ data: '2027-03-31', miejsce: 'zewnatrz', plec: 'kobiet', wydatek: 1001 })).toBe('nalezy');
    expect(st({ data: '2027-04-01', miejsce: 'zewnatrz', plec: 'kobiet', wydatek: 1001 })).toBe('nieNalezy');
  });
  it('29 lutego i przełom roku', () => {
    expect(st({ data: '2028-02-29', miejsce: 'zewnatrz', wydatek: 1501 })).toBe('nalezy');
    expect(st({ data: '2026-12-31', miejsce: 'zewnatrz', wydatek: 1600 })).toBe('nalezy');
    expect(st({ data: '2027-01-01', miejsce: 'zewnatrz', wydatek: 1600 })).toBe('nalezy');
    expect(sezonZimowy('2027-01-01')).toBe('tak, od 1 listopada 2026 r. do 31 marca 2027 r.');
    expect(sezonZimowy('2026-11-12')).toBe('tak, od 1 listopada 2026 r. do 31 marca 2027 r.');
    expect(okresZimowy('2026-04-01')).toBe(false);
  });
  it('praca częściowo na zewnątrz zimą bez liczby: „zależy”, próg 1000 kcal (4187 kJ) i uwaga', () => {
    const dane = d({ data: '2026-11-12', miejsce: 'mieszane', plec: 'kobiet' });
    const w = ocen(dane);
    expect(w).toMatchObject({ status: 'zalezy', pkt: 3 });
    const t = opisz(w, dane);
    expect(t.podstawa).toContain('przekracza 1000 kcal (4187 kJ)');
    expect(t.uwagi[0]).toContain('jaką część zmiany');
  });
});

describe('bez progu, „zależy”, napoje, okno, błędy', () => {
  it('pod ziemią i klęska żywiołowa bez progu wydatku', () => {
    expect(ocen(d({ miejsce: 'podZiemia', plec: null }))).toMatchObject({ status: 'nalezy', powody: ['p4'] });
    expect(ocen(d({ kleska: true, wydatek: 0 }))).toMatchObject({ status: 'nalezy', powody: ['kleska'] });
  });
  it('bez liczby: „zależy” z progiem; bez wyboru progów pokazuje oba', () => {
    const w = ocen(d({}));
    expect(w.status).toBe('zalezy');
    expect(opisz(w, d({})).podstawa).toContain('przekracza 2000 kcal (8374 kJ)');
    expect(opisz(ocen(d({ plec: null })), d({ plec: null })).podstawa).toContain('2000 kcal (8374 kJ) u mężczyzn albo 1100 kcal (4605 kJ) u kobiet');
  });
  it('napoje na zewnątrz: poniżej 10°C albo powyżej 25°C (granice ostre); pogoda powyżej 28°C', () => {
    const z = { data: '2026-06-01', miejsce: 'zewnatrz' as const, wydatek: 1200 };
    expect(ocen(d({ ...z, temp: 9 }))).toMatchObject({ status: 'nieNalezy', napoje: ['n3'] });
    expect(ocen(d({ ...z, temp: 10 })).napoje).toEqual([]);
    expect(ocen(d({ ...z, temp: 25 })).napoje).toEqual([]);
    expect(ocen(d({ ...z, temp: 25.1 })).napoje).toEqual(['n3']);
    expect(ocen(d({ data: '2026-07-01', temp: 28, tempZPogody: true })).napoje).toEqual([]);
    expect(ocen(d({ data: '2026-07-01', temp: 28.1, tempZPogody: true })).napoje).toEqual(['n5']);
  });
  it('przeliczenie kcal i kJ oraz okno posiłku przez północ', () => {
    expect(kcalNaKJ(1000)).toBeCloseTo(4186.8, 9);
    expect(kJNaKcal(4187)).toBeCloseTo(1000.0478, 4);
    expect(kcalNaKJ(2000)).toBeCloseTo(8373.6, 9);
    expect(ocen(d({ wydatek: 2100 })).przeliczenie!.kJ).toBeCloseTo(8792.28, 9);
    expect(przekracza(6280, 'kJ', PROGI.obnizony.mezczyzn)).toBe(false);
    expect(oknoPosilku('22:00')).toEqual({ od: '01:00', do: '02:00' });
    expect(oknoPosilku('06:30')).toEqual({ od: '09:30', do: '10:30' });
    expect(opisz(ocen(d({ start: '22:00' })), d({ start: '22:00' })).kiedy).toContain('orientacyjnie 01:00–02:00');
  });
  it('błędne dane: RangeError', () => {
    expect(() => ocen(d({ wydatek: 2100, plec: null }))).toThrow(RangeError);
    expect(() => ocen(d({ wydatek: -5 }))).toThrow(RangeError);
    expect(() => ocen(d({ wydatek: Number.NaN }))).toThrow(RangeError);
    expect(() => ocen(d({ wydatek: 100000 }))).toThrow(RangeError);
    expect(() => ocen(d({ wydatek: 83737, jednostka: 'kJ' }))).toThrow(RangeError);
    expect(ocen(d({ wydatek: 83736, jednostka: 'kJ' })).status).toBe('nalezy');
    expect(() => ocen(d({ data: '2027-02-29' }))).toThrow(RangeError);
    expect(() => ocen(d({ temp: 99 }))).toThrow(RangeError);
    expect(() => oknoPosilku('25:00')).toThrow(RangeError);
    expect(wpisanaTemperatura('−5,5')).toBe(-5.5);
    expect(wpisanaTemperatura('abc')).toBeNaN();
  });
});
