// Czy można odmówić nadgodzin. Godziny odpoczynku i najpóźniejszy koniec pracy z niezależnego rachunku w Pythonie
// (raporty/luki/rachunek_nadgodziny.py: datetime, doba od startu zmiany, granica = koniec doby albo następna zmiana).
import { describe, expect, it } from 'vitest';
import { czasDnia, czasMin, godzina, minuty, opisNadgodzin, wczytajGodziny, type CzasDnia, type DaneNadgodzin } from './odmowa-nadgodzin';

const BAZA: DaneNadgodzin = {
  powod: 'potrzeby',
  ciaza: false,
  dziecko8: false,
  zgodaDziecko: false,
  mlodociany: false,
  niepelnosprawny: false,
  zgodaLekarza: false,
  pilnowanie: false,
  nds: false,
  start: '6:00',
  koniecZmiany: '14:00',
  koniecPracy: '18:00',
  nastepna: '6:00',
  wRoku: 40,
  limit: 150,
};
const czas = (d: Partial<DaneNadgodzin>) => czasDnia({ ...BAZA, ...d }) as CzasDnia;
const opis = (d: Partial<DaneNadgodzin>) => opisNadgodzin({ ...BAZA, ...d }, czas(d));

describe('godziny', () => {
  it('minuty i zapis', () => {
    expect(minuty('6:00')).toBe(360);
    expect(minuty('06:30')).toBe(390);
    expect(minuty('24:00')).toBeNull();
    expect(minuty('6')).toBeNull();
    expect(godzina(19 * 60)).toBe('19:00');
    expect(godzina(24 * 60 + 90)).toBe('1:30 następnego dnia');
    expect(czasMin(150)).toBe('2 h 30 min');
    expect(czasMin(240)).toBe('4 h');
    expect(czasMin(30)).toBe('30 min');
  });
  it('liczby godzin', () => {
    expect(wczytajGodziny('12,5')).toBe(12.5);
    expect(wczytajGodziny('')).toBe(0);
    expect(wczytajGodziny('-3')).toBeNull();
    expect(wczytajGodziny('1.2.3')).toBeNull();
  });
});

describe('odpoczynek dobowy (art. 132 § 1)', () => {
  it.each([
    // start, koniec zmiany, koniec pracy, następna, nadgodziny (min), odpoczynek (min), najpóźniej (min od północy dnia startu)
    ['6:00', '14:00', '18:00', '6:00', 240, 720, 19 * 60],
    ['6:00', '14:00', '20:00', '6:00', 360, 600, 19 * 60],
    ['6:00', '14:00', '20:00', '', 360, 600, 19 * 60],
    ['22:00', '6:00', '8:00', '22:00', 120, 840, 24 * 60 + 11 * 60],
    ['14:00', '22:00', '23:30', '6:00', 90, 390, 19 * 60],
    ['6:00', '18:00', '19:00', '6:00', 60, 660, 19 * 60],
    ['6:00', '14:00', '14:00', '6:00', 0, 960, 19 * 60],
    ['7:00', '15:00', '17:30', '5:00', 150, 690, 18 * 60],
  ])('%s–%s, praca do %s, następna %s', (start, koniecZmiany, koniecPracy, nastepna, nad, odp, najp) => {
    const c = czas({ start, koniecZmiany, koniecPracy, nastepna });
    expect([c.nadgodzinyMin, c.odpoczynek, c.najpozniej]).toEqual([nad, odp, najp]);
  });
  it('błędy', () => {
    expect(czasDnia({ ...BAZA, koniecPracy: '13:00' })).toEqual({ blad: 'kolejnosc' });
    expect(czasDnia({ ...BAZA, start: 'x' })).toEqual({ blad: 'godziny' });
    expect(czasDnia({ ...BAZA, koniecPracy: '6:30' })).toEqual({ blad: 'kolejnosc' }); // 6:30 tego samego dnia
    expect(czasDnia({ ...BAZA, start: '22:00', koniecZmiany: '6:00', koniecPracy: '10:00', nastepna: '' })).not.toHaveProperty('blad');
    expect(czasDnia({ ...BAZA, start: '14:00', koniecZmiany: '22:00', koniecPracy: '6:30', nastepna: '6:00' })).toEqual({ blad: 'nastepna' });
  });
});

describe('werdykt', () => {
  it('zwykłe nadgodziny w granicach: obowiązek, dodatek', () => {
    const o = opis({});
    expect(o.werdykt).toBe('obowiazek');
    expect(o.naglowek).toBe('Co do zasady musisz zostać');
    expect(o.powody.join(' ')).toContain('art. 100 § 1');
    expect(o.najpozniej).toBe('19:00 (11 h odpoczynku w dobie)');
    expect(opis({ nastepna: '5:00', koniecPracy: '17:00' }).najpozniej).toBe('18:00 (11 h odpoczynku przed następną zmianą)');
    expect(opis({ nastepna: '10:00' }).najpozniej).toBe('19:00 (11 h odpoczynku w dobie)');
    expect(o.limit).toBe('zostało 110 z 150 h w tym roku, po dzisiejszych 106 h');
    expect(o.dzis).toBe('4 h, do 18:00');
  });
  it('ciąża i młodociany: zakaz także przy awarii', () => {
    expect(opis({ ciaza: true, powod: 'awaria' }).werdykt).toBe('zakaz');
    expect(opis({ ciaza: true }).powody[0]).toContain('art. 178 § 1');
    expect(opis({ mlodociany: true }).powody[0]).toContain('art. 203 § 1');
  });
  it('niepełnosprawność: zakaz, chyba że zgoda lekarza albo pilnowanie', () => {
    expect(opis({ niepelnosprawny: true }).werdykt).toBe('zakaz');
    expect(opis({ niepelnosprawny: true, zgodaLekarza: true }).werdykt).toBe('obowiazek');
    expect(opis({ niepelnosprawny: true, pilnowanie: true }).werdykt).toBe('obowiazek');
  });
  it('NDS/NDN: zakaz przy szczególnych potrzebach, nie przy awarii', () => {
    expect(opis({ nds: true }).werdykt).toBe('zakaz');
    expect(opis({ nds: true, powod: 'awaria' }).werdykt).toBe('obowiazek');
  });
  it('dziecko do 8 lat: zgoda', () => {
    expect(opis({ dziecko8: true }).werdykt).toBe('zgoda');
    expect(opis({ dziecko8: true, zgodaDziecko: true }).werdykt).toBe('obowiazek');
    expect(opis({ dziecko8: true, ciaza: true }).werdykt).toBe('zakaz');
  });
  it.each([
    [146, '18:00', 'obowiazek'], // 146 + 4 = 150: jeszcze w limicie
    [146, '18:30', 'za-dlugo'], // 146 + 4,5 > 150
    [150, '15:00', 'za-dlugo'],
  ])('limit roczny: %s h w roku, praca do %s → %s', (wRoku, koniecPracy, w) => {
    expect(opis({ wRoku, koniecPracy }).werdykt).toBe(w);
  });
  it('limit z regulaminu 200 h', () => {
    expect(opis({ wRoku: 190, limit: 200, koniecPracy: '19:00' }).werdykt).toBe('obowiazek');
    expect(opis({ wRoku: 150, limit: 150, koniecPracy: '15:00' }).powody[0]).toContain('jest już wykorzystany');
  });
  it('awaria: bez limitu, odpoczynek tylko w uwadze', () => {
    const o = opis({ powod: 'awaria', wRoku: 200, koniecPracy: '21:00' });
    expect(o.werdykt).toBe('obowiazek');
    expect(o.limit).toBe('nie dotyczy akcji ratowniczej ani awarii');
    expect(o.uwagi.join(' ')).toContain('równoważny odpoczynek');
  });
  it('za długo przez odpoczynek: najpóźniej 19:00; grafik bez 11 h: bez nadgodzin', () => {
    const o = opis({ koniecPracy: '20:00' });
    expect(o.werdykt).toBe('za-dlugo');
    expect(o.powody[0]).toContain('zostałoby 10 h');
    expect(o.powody[0]).toContain('o 19:00');
    const g = opis({ start: '14:00', koniecZmiany: '22:00', koniecPracy: '23:30', nastepna: '6:00' });
    expect(g.werdykt).toBe('za-dlugo');
    expect(g.powody[0]).toContain('nawet po zmianie z grafiku');
  });
  it('koniec pracy z końcem zmiany: brak nadgodzin', () => {
    expect(opis({ koniecPracy: '14:00' }).werdykt).toBe('brak');
  });
  it('następna zmiana wcześniej niż dzisiejsza: uwaga o tej samej dobie', () => {
    expect(opis({ start: '7:00', koniecZmiany: '15:00', koniecPracy: '17:30', nastepna: '5:00' }).uwagi.join(' ')).toContain('tej samej dobie');
  });
  it('ciąża bez nadgodzin: brak, zakaz w uwadze', () => {
    const o = opis({ ciaza: true, koniecPracy: '14:00' });
    expect(o.werdykt).toBe('brak');
    expect(o.uwagi.join(' ')).toContain('Gdyby praca trwała dłużej: w ciąży nie wolno');
  });
  it('awaria przy zmianie 14–22 i następnej o 6:00: bez godziny sprzed końca zmiany', () => {
    expect(opis({ powod: 'awaria', start: '14:00', koniecZmiany: '22:00', koniecPracy: '23:00', nastepna: '6:00' }).najpozniej).toBe('przy zwykłej pracy nadgodzin dziś być nie może; przy awarii bez tej granicy');
  });
  it('zmiana nocna 22–6 z pracą do 8:00: najpóźniej 11:00 następnego dnia', () => {
    const o = opis({ start: '22:00', koniecZmiany: '6:00', koniecPracy: '8:00', nastepna: '22:00' });
    expect(o.werdykt).toBe('obowiazek');
    expect(o.najpozniej).toBe('11:00 następnego dnia (11 h odpoczynku w dobie)');
  });
});

describe('nagłówek przy wykorzystanym limicie', () => {
  it('limit 0 zostało, odpoczynek w porządku', () => {
    expect(opis({ wRoku: 150, koniecPracy: '15:00' }).naglowek).toBe('Nadgodzin z tego powodu już nie');
    expect(opis({ wRoku: 148, koniecPracy: '18:00' }).naglowek).toBe('Nie tak długo');
  });
});

describe('audyt: limit w polu „Najpóźniej do”, art. 189¹, zmiana krótsza niż 8 h', () => {
  it('148 z 150 h przy zmianie 6–14: najpóźniej 16:00 z limitu', () => {
    expect(opis({ wRoku: 148, koniecPracy: '15:00' }).najpozniej).toBe('16:00 (limit roczny; odpoczynek pozwalałby do 19:00)');
    expect(opis({ wRoku: 149.5, koniecPracy: '14:30' }).najpozniej).toBe('14:30 (limit roczny; odpoczynek pozwalałby do 19:00)');
    expect(opis({ wRoku: 150, koniecPracy: '15:00' }).najpozniej).toBe('14:00, koniec zmiany: limit roczny wykorzystany');
    expect(opis({ wRoku: 140 }).najpozniej).toBe('19:00 (11 h odpoczynku w dobie)');
    expect(opis({ powod: 'awaria', wRoku: 150 }).najpozniej).toBe('19:00 przy zwykłej pracy; przy awarii bez tej granicy');
  });
  it('dziecko do 8 lat: art. 189¹ w wyniku, także przy „Nie tak długo”', () => {
    expect(opis({ dziecko8: true }).powody.join(' ')).toContain('art. 189¹');
    const o = opis({ dziecko8: true, koniecPracy: '20:00' });
    expect(o.werdykt).toBe('za-dlugo');
    expect(o.powody.join(' ')).toContain('art. 178 § 2');
  });
  it('brak nadgodzin i następna zmiana w tej samej dobie: uwaga bez sprzeczności', () => {
    expect(opis({ koniecPracy: '14:00', nastepna: '5:00' }).uwagi.join(' ')).toContain('Dziś nadgodzin nie ma');
  });
  it('zmiana krótsza niż 8 h: uwaga o normie dobowej', () => {
    expect(opis({ koniecZmiany: '12:00', koniecPracy: '14:00' }).uwagi.join(' ')).toContain('art. 129 § 1');
    expect(opis({}).uwagi.join(' ')).not.toContain('art. 129 § 1');
  });
});
