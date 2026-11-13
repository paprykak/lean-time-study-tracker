import { describe, expect, it } from 'vitest';
import { dataPoPolsku, dniMiedzy, dodajDni, dodajLata, dodajMiesiace, dzisWPolsce, ileDni, koniecOkresu, pelneMiesiace, poprawnaData } from './terminy';
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
  // Okres od początku dnia (pierwszy dzień wliczony): dzień przed dniem odpowiadającym datą, a gdy go nie ma, ostatni dzień.
  it.each([
    ['2026-03-31', 6, '2026-09-30'],
    ['2026-03-01', 3, '2026-05-31'],
    ['2026-03-30', 6, '2026-09-29'],
    ['2026-04-01', 6, '2026-09-30'],
    ['2026-11-30', 3, '2027-02-28'],
    ['2027-11-30', 3, '2028-02-29'],
    ['2026-11-28', 3, '2027-02-27'],
    ['2026-01-31', 1, '2026-02-28'],
    ['2026-01-31', 2, '2026-03-30'],
    ['2024-02-29', 12, '2025-02-28'],
    ['2024-02-29', 48, '2028-02-28'],
    ['2026-01-01', 12, '2026-12-31'],
    ['2026-12-15', 0, '2026-12-14'],
    ['2024-05-31', 33, '2027-02-28'],
  ])('okres od %s przez %i mies. trwa do %s', (od, m, wynik) => expect(koniecOkresu(od, m)).toBe(wynik));
  it('okres: ujemne i ułamkowe miesiące to błąd', () => {
    expect(() => koniecOkresu('2026-01-01', -1)).toThrow(RangeError);
    expect(() => koniecOkresu('2026-01-01', 1.5)).toThrow(RangeError);
  });
  it.each([
    ['2026-08-31', '2027-02-28', 6],
    ['2026-08-31', '2027-02-27', 5],
    ['2026-03-31', '2026-09-30', 6],
    ['2026-03-31', '2026-09-29', 5],
    ['2026-01-01', '2026-01-31', 1],
    ['2026-01-01', '2026-01-30', 0],
    ['2026-05-15', '2026-11-14', 6],
    ['2026-05-15', '2026-11-13', 5],
    ['2024-02-29', '2027-02-28', 36],
    ['2024-02-29', '2027-02-27', 35],
    ['2026-11-13', '2026-11-12', 0],
  ])('pełne miesiące od %s do %s włącznie: %i', (od, ostatni, m) => expect(pelneMiesiace(od, ostatni)).toBe(m));
  // Losowe przypadki z niezależnego rachunku (Python: chodzenie po dniach, .cache/narzedzia/wspolny-kod/miesiace.py).
  it.each([
    ['2025-09-12', 53, '2030-02-11', '2030-02-12', '2028-12-09', 38],
    ['2026-06-23', 24, '2028-06-22', '2028-06-23', '2028-10-29', 28],
    ['2026-09-20', 12, '2027-09-19', '2027-09-20', '2027-12-13', 14],
    ['2025-12-13', 0, '2025-12-12', '2025-12-13', '2028-02-16', 26],
    ['2026-05-04', 24, '2028-05-03', '2028-05-04', '2028-12-15', 31],
    ['2024-06-22', 3, '2024-09-21', '2024-09-22', '2025-09-27', 15],
    ['2026-05-19', 2, '2026-07-18', '2026-07-19', '2028-11-27', 30],
    ['2025-12-01', 18, '2027-05-31', '2027-06-01', '2028-02-23', 26],
    ['2024-06-04', 1, '2024-07-03', '2024-07-04', '2024-10-19', 4],
    ['2026-10-17', 6, '2027-04-16', '2027-04-17', '2029-01-06', 26],
    ['2026-08-18', 1, '2026-09-17', '2026-09-18', '2029-11-18', 39],
    ['2023-01-30', 3, '2023-04-29', '2023-04-30', '2024-07-02', 17],
    ['2026-09-18', 24, '2028-09-17', '2028-09-18', '2026-09-24', 0],
    ['2024-06-12', 18, '2025-12-11', '2025-12-12', '2027-05-12', 35],
    ['2023-12-16', 33, '2026-09-15', '2026-09-16', '2026-05-23', 29],
    ['2023-10-18', 33, '2026-07-17', '2026-07-18', '2024-05-05', 6],
    ['2024-03-18', 6, '2024-09-17', '2024-09-18', '2025-07-09', 15],
    ['2026-03-24', 36, '2029-03-23', '2029-03-24', '2027-03-02', 11],
    ['2025-06-08', 3, '2025-09-07', '2025-09-08', '2026-05-07', 11],
    ['2023-05-22', 20, '2025-01-21', '2025-01-22', '2023-11-23', 6],
    ['2026-04-03', 33, '2029-01-02', '2029-01-03', '2028-01-05', 21],
    ['2023-07-30', 24, '2025-07-29', '2025-07-30', '2024-02-18', 6],
    ['2025-09-24', 33, '2028-06-23', '2028-06-24', '2026-08-21', 10],
    ['2024-06-23', 0, '2024-06-22', '2024-06-23', '2027-05-12', 34],
    ['2026-11-28', 0, '2026-11-27', '2026-11-28', '2028-10-06', 22],
    ['2025-01-30', 18, '2026-07-29', '2026-07-30', '2027-09-15', 31],
    ['2024-11-07', 33, '2027-08-06', '2027-08-07', '2025-12-28', 13],
    ['2026-10-03', 1, '2026-11-02', '2026-11-03', '2027-04-07', 6],
    ['2026-03-24', 18, '2027-09-23', '2027-09-24', '2028-08-19', 28],
    ['2023-05-27', 12, '2024-05-26', '2024-05-27', '2025-08-29', 27],
    ['2026-05-06', 3, '2026-08-05', '2026-08-06', '2028-08-22', 27],
    ['2024-10-28', 12, '2025-10-27', '2025-10-28', '2025-08-29', 10],
    ['2023-04-17', 33, '2026-01-16', '2026-01-17', '2025-04-03', 23],
    ['2025-06-22', 33, '2028-03-21', '2028-03-22', '2027-01-02', 18],
    ['2024-09-24', 0, '2024-09-23', '2024-09-24', '2027-11-21', 37],
    ['2025-06-24', 6, '2025-12-23', '2025-12-24', '2027-04-08', 21],
    ['2023-03-21', 6, '2023-09-20', '2023-09-21', '2024-03-07', 11],
    ['2026-11-18', 24, '2028-11-17', '2028-11-18', '2029-06-07', 30],
    ['2026-05-27', 24, '2028-05-26', '2028-05-27', '2028-11-09', 29],
    ['2023-09-22', 3, '2023-12-21', '2023-12-22', '2026-09-22', 36],
    ['2026-04-04', 2, '2026-06-03', '2026-06-04', '2029-03-30', 35],
    ['2024-08-06', 6, '2025-02-05', '2025-02-06', '2025-12-18', 16],
    ['2024-02-22', 2, '2024-04-21', '2024-04-22', '2026-11-15', 32],
    ['2024-05-10', 12, '2025-05-09', '2025-05-10', '2024-10-22', 5],
    ['2026-03-10', 3, '2026-06-09', '2026-06-10', '2028-07-01', 27],
    ['2024-09-16', 0, '2024-09-15', '2024-09-16', '2026-03-29', 18],
    ['2023-01-02', 3, '2023-04-01', '2023-04-02', '2023-05-04', 4],
    ['2026-02-01', 12, '2027-01-31', '2027-02-01', '2026-12-06', 10],
    ['2026-08-01', 18, '2028-01-31', '2028-02-01', '2028-11-11', 27],
    ['2026-07-02', 26, '2028-09-01', '2028-09-02', '2028-10-31', 27],
    ['2023-06-16', 24, '2025-06-15', '2025-06-16', '2024-07-01', 12],
    ['2026-04-16', 29, '2028-09-15', '2028-09-16', '2027-01-03', 8],
    ['2026-02-21', 1, '2026-03-20', '2026-03-21', '2027-11-05', 20],
    ['2023-04-19', 18, '2024-10-18', '2024-10-19', '2023-11-09', 6],
    ['2026-05-02', 3, '2026-08-01', '2026-08-02', '2026-11-30', 6],
    ['2026-11-06', 0, '2026-11-05', '2026-11-06', '2029-03-28', 28],
    ['2023-09-22', 33, '2026-06-21', '2026-06-22', '2025-07-09', 21],
    ['2023-07-14', 12, '2024-07-13', '2024-07-14', '2026-02-18', 31],
    ['2024-03-13', 12, '2025-03-12', '2025-03-13', '2024-10-23', 7],
    ['2023-05-18', 3, '2023-08-17', '2023-08-18', '2025-02-28', 21],
    ['2026-02-01', 18, '2027-07-31', '2027-08-01', '2027-05-01', 15],
    ['2023-03-28', 2, '2023-05-27', '2023-05-28', '2024-04-25', 12],
    ['2025-05-24', 2, '2025-07-23', '2025-07-24', '2025-10-22', 4],
    ['2024-02-17', 6, '2024-08-16', '2024-08-17', '2026-10-31', 32],
    ['2024-01-10', 33, '2026-10-09', '2026-10-10', '2027-03-16', 38],
    ['2026-12-22', 3, '2027-03-21', '2027-03-22', '2029-03-02', 26],
    ['2026-02-01', 1, '2026-02-28', '2026-03-01', '2027-10-15', 20],
    ['2026-04-21', 33, '2029-01-20', '2029-01-21', '2028-05-06', 24],
    ['2025-03-11', 33, '2027-12-10', '2027-12-11', '2025-07-28', 4],
    ['2024-10-15', 4, '2025-02-14', '2025-02-15', '2024-12-07', 1],
    ['2026-02-18', 36, '2029-02-17', '2029-02-18', '2027-05-23', 15],
    ['2024-02-11', 2, '2024-04-10', '2024-04-11', '2026-02-23', 24],
    ['2024-10-19', 24, '2026-10-18', '2026-10-19', '2025-07-13', 8],
    ['2026-05-18', 0, '2026-05-17', '2026-05-18', '2028-09-22', 28],
    ['2024-03-09', 1, '2024-04-08', '2024-04-09', '2027-05-08', 38],
    ['2025-10-18', 36, '2028-10-17', '2028-10-18', '2026-11-13', 12],
    ['2024-09-08', 12, '2025-09-07', '2025-09-08', '2025-06-11', 9],
    ['2024-10-23', 3, '2025-01-22', '2025-01-23', '2027-07-09', 32],
    ['2026-07-17', 6, '2027-01-16', '2027-01-17', '2029-08-02', 36],
    ['2025-10-14', 6, '2026-04-13', '2026-04-14', '2027-10-04', 23],
  ] as const)('%s, %i mies. (Python): okres do %s, termin %s; pełne do %s: %i', (od, n, koniec, termin, ostatni, pelne) => {
    expect(koniecOkresu(od, n)).toBe(koniec);
    expect(dodajMiesiace(od, n)).toBe(termin);
    expect(pelneMiesiace(od, ostatni)).toBe(pelne);
  });
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
