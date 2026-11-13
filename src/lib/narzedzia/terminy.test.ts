import { describe, expect, it } from 'vitest';
import { dataPoPolsku, dniMiedzy, dodajDni, dodajLata, dodajMiesiace, dzisWPolsce, ileDni, poprawnaData } from './terminy';
import { plikIcs, wyzwalacz } from './kalendarz-ics';

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
  it('domyślne przypomnienia: tydzień i dzień przed terminem o 9:00 (VALARM)', () => {
    const rozwiniete = ics.replace(/\r\n /g, '');
    expect(rozwiniete).toContain(
      'BEGIN:VALARM\r\nACTION:DISPLAY\r\nDESCRIPTION:Za 7 dni: Ostatni dzień na szkolenie okresowe BHP\r\nTRIGGER;RELATED=START:-P6DT15H\r\nEND:VALARM',
    );
    expect(rozwiniete).toContain('DESCRIPTION:Jutro: Ostatni dzień na szkolenie okresowe BHP\r\nTRIGGER;RELATED=START:-PT15H\r\nEND:VALARM');
    // Alarm leży wewnątrz wydarzenia.
    expect(rozwiniete.indexOf('END:VALARM')).toBeLessThan(rozwiniete.indexOf('END:VEVENT'));
  });
});

describe('wyzwalacz przypomnienia (RFC 5545, 3.3.6 i 3.8.6.3)', () => {
  it('przesunięcie od północy dnia wydarzenia do 9:00 N dni wcześniej', () => {
    expect([0, 1, 2, 7, 30].map(wyzwalacz)).toEqual(['PT9H', '-PT15H', '-P1DT15H', '-P6DT15H', '-P29DT15H']);
  });
  it('odrzuca dni ujemne i ułamkowe', () => {
    expect(() => wyzwalacz(-1)).toThrow(RangeError);
    expect(() => wyzwalacz(1.5)).toThrow(RangeError);
  });
});

/** Minimalna kontrola gramatyki RFC 5545: CRLF, zawijanie, pary BEGIN/END, wymagane właściwości, format wartości. */
function bledyIcs(ics: string): string[] {
  const bledy: string[] = [];
  if (!ics.endsWith('\r\n') || /[^\r]\n/.test(ics)) bledy.push('wiersze muszą kończyć się CRLF');
  const linie = ics.replace(/\r\n[ \t]/g, '').split('\r\n').slice(0, -1);
  const stos: { nazwa: string; wlasciwosci: Map<string, string[]> }[] = [];
  for (const l of linie) {
    const m = /^([A-Z][A-Z0-9-]*)((?:;[A-Z-]+=[^;:]+)*):(.*)$/.exec(l);
    if (!m) {
      bledy.push(`zły wiersz: ${l}`);
      continue;
    }
    const [, nazwa, , wartosc] = m;
    if (nazwa === 'BEGIN') stos.push({ nazwa: wartosc, wlasciwosci: new Map() });
    else if (nazwa === 'END') {
      const k = stos.pop();
      if (!k || k.nazwa !== wartosc) bledy.push(`END:${wartosc} bez pary`);
      else {
        const wymagane = { VCALENDAR: ['PRODID', 'VERSION'], VEVENT: ['UID', 'DTSTAMP', 'DTSTART'], VALARM: ['ACTION', 'TRIGGER', 'DESCRIPTION'] }[k.nazwa] ?? [];
        for (const w of wymagane) if (k.wlasciwosci.get(w)?.length !== 1) bledy.push(`${k.nazwa}: ${w} musi wystąpić dokładnie raz`);
        if (k.nazwa === 'VALARM' && stos.at(-1)?.nazwa !== 'VEVENT') bledy.push('VALARM poza VEVENT');
      }
    } else {
      const k = stos.at(-1);
      if (!k) bledy.push(`właściwość poza komponentem: ${nazwa}`);
      else k.wlasciwosci.set(nazwa, [...(k.wlasciwosci.get(nazwa) ?? []), wartosc]);
      if (nazwa === 'TRIGGER' && !/^[+-]?P(?:\d+W|(?:\d+D)?(?:T(?:\d+H)?(?:\d+M)?(?:\d+S)?)?)$/.test(wartosc)) bledy.push(`zły TRIGGER: ${wartosc}`);
      if (/^DT(START|END)$/.test(nazwa) && !/^\d{8}$/.test(wartosc)) bledy.push(`zła data: ${l}`);
      if (/^(SUMMARY|DESCRIPTION)$/.test(nazwa) && /(?<!\\)[;,]/.test(wartosc)) bledy.push(`nieucieczony znak: ${l}`);
    }
  }
  if (stos.length) bledy.push('niezamknięty komponent');
  return bledy;
}

describe('plik .ics zgodny z RFC 5545', () => {
  const plik = plikIcs(
    [
      { data: '2027-02-28', tytul: 'Zaplanuj: badanie; okresowe, z zapasem', opis: 'Opis\nw dwóch wierszach ze znakami ąęółżźćń '.repeat(4), przypomnienia: [0] },
      { data: '2027-03-01', tytul: 'Termin' },
      { data: '2027-03-02', tytul: 'Święto', przypomnienia: [] },
      { data: '2027-03-03', tytul: 'Powtórzone', przypomnienia: [1, 1, 30] },
    ],
    'test',
    new Date('2026-11-13T08:00:00Z'),
  );
  it('bez błędów składni i z wymaganymi właściwościami', () => {
    expect(bledyIcs(plik)).toEqual([]);
  });
  it('liczba alarmów: [0] → 1, domyślnie 2, [] → 0, powtórzenia raz', () => {
    const wydarzenia = plik.replace(/\r\n /g, '').split('BEGIN:VEVENT').slice(1);
    expect(wydarzenia.map((w) => w.split('BEGIN:VALARM').length - 1)).toEqual([1, 2, 0, 2]);
    expect(wydarzenia[0]).toContain('TRIGGER;RELATED=START:PT9H');
    expect(wydarzenia[0]).toContain('DESCRIPTION:Dziś: Zaplanuj: badanie\\; okresowe\\, z zapasem');
    expect(wydarzenia[3]).toContain('DESCRIPTION:Za 30 dni: Powtórzone');
  });
  it('kontrola łapie błędy', () => {
    expect(bledyIcs('BEGIN:VCALENDAR\r\nBEGIN:VALARM\r\nTRIGGER:-1D\r\nEND:VALARM\r\n')).toEqual(
      expect.arrayContaining(['zły TRIGGER: -1D', 'VALARM poza VEVENT', 'niezamknięty komponent']),
    );
  });
});
