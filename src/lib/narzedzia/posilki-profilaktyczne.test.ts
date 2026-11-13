import { describe, expect, it } from 'vitest';
import { kcalNaKJ, kJNaKcal, MIEJSCA, napojeZWydatku, ocen, oknoPosilku, okresZimowy, opisz, przekracza, PROGI, sezonZimowy, wpisanaTemperatura, type Dane } from './posilki-profilaktyczne';

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
    // Granica 4605 kJ / 4,1868 = 1099,8854 kcal.
    expect(st({ plec: 'kobiet', wydatek: 1099.88 })).toBe('nieNalezy');
    expect(st({ plec: 'kobiet', wydatek: 1099.89 })).toBe('nalezy');
  });
  it('wynik mówi wprost, gdy przekroczona jest tylko jedna liczba progu', () => {
    const k = d({ plec: 'kobiet', wydatek: 1100 });
    expect(opisz(ocen(k), k).podstawa).toBe(
      'Podstawa: § 3 ust. 1 pkt 1: praca z wysiłkiem fizycznym i wydatek powyżej 1100 kcal (4605 kJ) (1100 kcal = 4605,48 kJ, więcej niż 4605 kJ z nawiasu).',
    );
    const ch = d({ data: '2026-07-15', miejsce: 'chlodnia', plec: 'kobiet', wydatek: 4187, jednostka: 'kJ' });
    const t = opisz(ocen(ch), ch);
    expect(t.podstawa).toContain('(4187 kJ = 1000,05 kcal, więcej niż 1000 kcal)');
    expect(t.przeliczenie).toBe('1000,05 kcal = 4187 kJ (1 kcal = 4,1868 kJ)');
    const m = d({ data: '2026-07-15', miejsce: 'chlodnia', wydatek: 1500 });
    expect(opisz(ocen(m), m).podstawa).toContain('(1500 kcal = 6280,2 kJ, więcej niż 6280 kJ z nawiasu)');
    const zwykly = d({ wydatek: 2500 });
    expect(opisz(ocen(zwykly), zwykly).podstawa).not.toContain('z nawiasu');
  });
  it('chłodnia przez cały rok: 1000 kcal nie, 1000,5 kcal i 4187 kJ tak; 6280 kJ u mężczyzn nie, 6280,1 kJ i 1500 kcal tak', () => {
    const ch = { data: '2026-07-15', miejsce: 'chlodnia' as const };
    expect(ocen(d({ ...ch, plec: 'kobiet', wydatek: 1000 }))).toMatchObject({ status: 'nieNalezy', pkt: 2, napoje: ['n4'] });
    expect(ocen(d({ ...ch, plec: 'kobiet', wydatek: 1000.5 }))).toMatchObject({ status: 'nalezy', powody: ['p2'] });
    expect(st({ ...ch, plec: 'kobiet', wydatek: 4187, jednostka: 'kJ' })).toBe('nalezy');
    expect(st({ ...ch, wydatek: 6280, jednostka: 'kJ' })).toBe('nieNalezy');
    expect(st({ ...ch, wydatek: 6280.1, jednostka: 'kJ' })).toBe('nalezy');
    expect(st({ ...ch, wydatek: 1500 })).toBe('nalezy');
  });
  it('napoje z § 4 ust. 1 pkt 4: u kobiet bez „powyżej”, więc od 1000 kcal (4186,8 kJ) włącznie; u mężczyzn powyżej 1500 kcal', () => {
    expect(napojeZWydatku(1000, 'kcal', 'kobiet')).toBe(true);
    expect(napojeZWydatku(999.9, 'kcal', 'kobiet')).toBe(false);
    expect(napojeZWydatku(4186.8, 'kJ', 'kobiet')).toBe(true);
    expect(napojeZWydatku(4186.7, 'kJ', 'kobiet')).toBe(false);
    expect(napojeZWydatku(1500, 'kcal', 'mezczyzn')).toBe(true); // 6280,2 kJ > 6280 kJ
    expect(napojeZWydatku(6280, 'kJ', 'mezczyzn')).toBe(false);
    const k = d({ plec: 'kobiet', wydatek: 1000 });
    const w = ocen(k);
    expect(w).toMatchObject({ status: 'nieNalezy', napoje: ['n4'] });
    expect(opisz(w, k).napoje).toContain('§ 4 ust. 1 pkt 4: wydatek 1000 kcal (4187 kJ) lub więcej');
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
  it('na zewnątrz zimą bez liczby: pełna podstawa, bez nawiasu w nawiasie', () => {
    const dane = d({ data: '2026-11-12', miejsce: 'zewnatrz' });
    const t = opisz(ocen(dane), dane);
    expect(t.podstawa).toBe(
      'Posiłek należy się, jeśli wydatek na zmianę przekracza 1500 kcal (6280 kJ) (§ 3 ust. 1 pkt 3: praca na otwartej przestrzeni w okresie zimowym, od 1 listopada do 31 marca).',
    );
    expect(t.podstawa).not.toContain('))');
    const nie = d({ data: '2026-11-12', miejsce: 'zewnatrz', wydatek: 1400 });
    expect(opisz(ocen(nie), nie).podstawa).not.toContain('))');
  });
});

describe('bez progu, „zależy”, napoje, okno, błędy', () => {
  it('pod ziemią i klęska żywiołowa bez progu wydatku', () => {
    expect(ocen(d({ miejsce: 'podZiemia', plec: null }))).toMatchObject({ status: 'nalezy', powody: ['p4'] });
    expect(ocen(d({ kleska: true, wydatek: 0 }))).toMatchObject({ status: 'nalezy', powody: ['kleska'] });
  });
  it('pod ziemią i przy klęsce wydatek bez wyboru progów nie jest błędem', () => {
    const pz = d({ miejsce: 'podZiemia', plec: null, wydatek: 500 });
    const w = ocen(pz);
    expect(w).toMatchObject({ status: 'nalezy', powody: ['p4'], napoje: [] });
    expect(opisz(w, pz).napoje).toContain('powyżej 1500 kcal (6280 kJ) u mężczyzn albo 1000 kcal (4187 kJ) lub więcej u kobiet');
    expect(ocen(d({ kleska: true, plec: null, wydatek: 500 }))).toMatchObject({ status: 'nalezy', powody: ['kleska'] });
    expect(() => ocen(d({ miejsce: 'chlodnia', plec: null, wydatek: 500 }))).toThrow(RangeError);
  });
  it('etykieta gorącego miejsca mówi o pomieszczeniu i mieści się na telefonie', () => {
    expect(MIEJSCA.goraco).toBe('Wnętrze z WBGT > 25°C');
    for (const nazwa of Object.values(MIEJSCA)) expect(nazwa.length).toBeLessThanOrEqual(22);
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
    expect(ocen(d({ wydatek: 20000 })).status).toBe('nalezy');
    expect(() => ocen(d({ wydatek: 20000.1 }))).toThrow(RangeError);
    expect(() => ocen(d({ wydatek: 90000, jednostka: 'kJ' }))).toThrow(/do\s20\s000\skcal\s\(83\s736\skJ\)/);
    expect(ocen(d({ temp: -60 })).status).toBe('zalezy');
    expect(ocen(d({ temp: 60 })).status).toBe('zalezy');
    expect(() => ocen(d({ temp: 60.1 }))).toThrow(RangeError);
    expect(() => ocen(d({ temp: -60.1 }))).toThrow(RangeError);
    expect(() => ocen(d({ data: '2027-02-29' }))).toThrow(RangeError);
    expect(() => ocen(d({ temp: 99 }))).toThrow(RangeError);
    expect(() => oknoPosilku('25:00')).toThrow(RangeError);
    expect(wpisanaTemperatura('−5,5')).toBe(-5.5);
    expect(wpisanaTemperatura('abc')).toBeNaN();
  });
});
