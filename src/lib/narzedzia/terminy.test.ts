import { describe, expect, it } from 'vitest';
import { dataPoPolsku, dniMiedzy, dodajDni, dodajLata, dodajMiesiace, dzisWPolsce, ileDni, poprawnaData } from './terminy';
import { plikIcs } from './kalendarz-ics';

describe('terminy (art. 112 KC)', () => {
  it.each([
    ['2024-03-15', 3, '2027-03-15'],
    ['2024-02-29', 1, '2025-02-28'],
    ['2024-02-29', 4, '2028-02-29'],
    ['2026-11-11', 5, '2031-11-11'],
  ])('%s + %i lat = %s', (od, lata, wynik) => expect(dodajLata(od, lata)).toBe(wynik));
  it.each([
    ['2026-08-31', 6, '2027-02-28'],
    ['2026-01-31', 1, '2026-02-28'],
    ['2026-03-15', 12, '2027-03-15'],
    ['2026-12-10', -1, '2026-11-10'],
  ])('%s + %i mies. = %s', (od, m, wynik) => expect(dodajMiesiace(od, m)).toBe(wynik));
  it('dni', () => {
    expect(dniMiedzy('2026-11-11', '2026-12-31')).toBe(50);
    expect(dniMiedzy('2026-03-28', '2026-03-30')).toBe(2);
    expect(dodajDni('2027-03-15', -60)).toBe('2027-01-14');
  });
  it('poprawnaData', () => {
    expect(poprawnaData('2026-02-29')).toBe(false);
    expect(poprawnaData('2028-02-29')).toBe(true);
    expect(poprawnaData('2026-13-01')).toBe(false);
    expect(poprawnaData('15.03.2026')).toBe(false);
  });
  it('dzisWPolsce bierze strefę Europe/Warsaw', () => {
    expect(dzisWPolsce(new Date('2026-12-31T23:30:00Z'))).toBe('2027-01-01');
    expect(dzisWPolsce(new Date('2026-07-01T21:59:00Z'))).toBe('2026-07-01');
  });
  it('opisy', () => {
    expect(dataPoPolsku('2027-03-15')).toBe('15 marca 2027 r.');
    expect([ileDni(0), ileDni(1), ileDni(-1), ileDni(45), ileDni(-3)]).toEqual(['dziś', 'jutro', 'wczoraj', 'za 45 dni', '3 dni temu']);
  });
});

describe('plikIcs (RFC 5545)', () => {
  const ics = plikIcs(
    [{ data: '2027-03-15', tytul: 'Ostatni dzień na szkolenie okresowe BHP', opis: 'Termin: 15 marca 2027 r.; stanowisko robotnicze, co 3 lata' }],
    'szkolenie-okresowe-bhp',
    new Date('2026-11-11T10:00:00Z'),
  );
  const linie = ics.split('\r\n');
  it('wydarzenie całodniowe z CRLF, ucieczką znaków i identyfikatorem', () => {
    expect(linie[0]).toBe('BEGIN:VCALENDAR');
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
    expect(ics).toContain('DTSTART;VALUE=DATE:20270315');
    expect(ics).toContain('DTEND;VALUE=DATE:20270316');
    expect(ics).toContain('DTSTAMP:20261111T100000Z');
    expect(ics).toContain('UID:20270315-0-szkolenie-okresowe-bhp@rytmhali.pl');
    expect(ics.replace(/\r\n /g, '')).toContain('Termin: 15 marca 2027 r.\\; stanowisko robotnicze\\, co 3 lata');
  });
  it('wiersze najwyżej 75 bajtów', () => {
    for (const l of linie) expect(new TextEncoder().encode(l).length).toBeLessThanOrEqual(75);
  });
});
