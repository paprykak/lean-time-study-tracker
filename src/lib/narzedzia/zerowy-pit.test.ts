// Zwolnienia z art. 21 ust. 1 pkt 148 i 152–154 ustawy o PIT; daty i kwoty sprawdzone ręcznie i skryptem w Pythonie.
import { describe, expect, it } from 'vitest';
import { LIMIT_ZWOLNIEN, opisZwolnienia, urodziny, zwolnienie, type DaneZwolnienia } from './zerowy-pit';

const d = (x: Partial<DaneZwolnienia>): DaneZwolnienia => ({ rok: 2026, zwolnienie: 'mlodzi', przychody: 60_000, ...x });

describe('urodziny (art. 12 § 4 Ordynacji podatkowej)', () => {
  it('rocznica, a 29 lutego w roku nieprzestępnym: 28 lutego', () => {
    expect(urodziny('2000-05-20', 26)).toBe('2026-05-20');
    expect(urodziny('2000-02-29', 26)).toBe('2026-02-28');
    expect(urodziny('2004-02-29', 24)).toBe('2028-02-29');
  });
});

describe('ulga dla młodych (pkt 148)', () => {
  it('do dnia 26. urodzin włącznie', () => {
    expect(zwolnienie(d({ dataUrodzenia: '2000-05-20' }))).toMatchObject({ stan: 'czesc-roku', od: '2026-01-01', do: '2026-05-20' });
    expect(zwolnienie(d({ dataUrodzenia: '2000-12-31' }))).toMatchObject({ stan: 'caly-rok', do: '2026-12-31' });
    expect(zwolnienie(d({ dataUrodzenia: '2001-03-01' })).stan).toBe('caly-rok');
  });
  it('26 lat skończone przed rokiem: bez ulgi', () => {
    expect(zwolnienie(d({ dataUrodzenia: '1999-12-31' }))).toMatchObject({ stan: 'nie', zwolnione: 0, opodatkowane: 60_000 });
  });
  it('limit 85 528 zł, wspólny z innymi ulgami', () => {
    expect(zwolnienie(d({ dataUrodzenia: '2003-01-01', przychody: 85_528 }))).toMatchObject({ zwolnione: 85_528, opodatkowane: 0 });
    expect(zwolnienie(d({ dataUrodzenia: '2003-01-01', przychody: 100_000 }))).toMatchObject({ zwolnione: LIMIT_ZWOLNIEN, opodatkowane: 14_472 });
    expect(zwolnienie(d({ dataUrodzenia: '2003-01-01', przychody: 100_000, inneZwolnione: 20_000 }))).toMatchObject({ limit: 65_528, zwolnione: 65_528, opodatkowane: 34_472 });
    expect(zwolnienie(d({ dataUrodzenia: '2003-01-01', przychody: 1000, inneZwolnione: 90_000 }))).toMatchObject({ limit: 0, zwolnione: 0 });
  });
});

describe('pracujący senior (pkt 154)', () => {
  it('od dnia po 60. urodzinach kobiety i 65. mężczyzny', () => {
    expect(zwolnienie(d({ zwolnienie: 'senior', dataUrodzenia: '1966-03-10', kobieta: true, bezEmerytury: true }))).toMatchObject({ stan: 'czesc-roku', od: '2026-03-11', do: '2026-12-31' });
    expect(zwolnienie(d({ zwolnienie: 'senior', dataUrodzenia: '1960-06-01', bezEmerytury: true })).stan).toBe('caly-rok');
  });
  it('urodziny 31 grudnia: ulga dopiero od następnego roku; z emeryturą bez ulgi', () => {
    expect(zwolnienie(d({ zwolnienie: 'senior', dataUrodzenia: '1961-12-31', bezEmerytury: true })).stan).toBe('nie');
    expect(zwolnienie(d({ zwolnienie: 'senior', dataUrodzenia: '1950-01-01', bezEmerytury: false })).stan).toBe('nie');
  });
});

describe('ulga na powrót (pkt 152) i rodzina 4+ (pkt 153)', () => {
  it('cztery lata od roku przeniesienia albo od następnego, tylko od 2022 r.', () => {
    expect(zwolnienie(d({ zwolnienie: 'powrot', rokPrzeniesienia: 2024, odNastepnego: true }))).toMatchObject({ stan: 'caly-rok', lata: [2025, 2028] });
    expect(zwolnienie(d({ zwolnienie: 'powrot', rokPrzeniesienia: 2023 }))).toMatchObject({ stan: 'caly-rok', lata: [2023, 2026] });
    expect(zwolnienie(d({ zwolnienie: 'powrot', rokPrzeniesienia: 2022 }))).toMatchObject({ stan: 'nie', lata: [2022, 2025] });
    expect(zwolnienie(d({ zwolnienie: 'powrot', rokPrzeniesienia: 2026, odNastepnego: true })).stan).toBe('nie');
    expect(zwolnienie(d({ zwolnienie: 'powrot', rokPrzeniesienia: 2021 })).stan).toBe('nie');
  });
  it('co najmniej czworo dzieci', () => {
    expect(zwolnienie(d({ zwolnienie: 'rodzina4', dzieci: 4 })).stan).toBe('caly-rok');
    expect(zwolnienie(d({ zwolnienie: 'rodzina4', dzieci: 3 })).stan).toBe('nie');
  });
});

describe('opis i błędne dane', () => {
  it('teksty wyniku', () => {
    expect(opisZwolnienia(d({ dataUrodzenia: '2000-05-20' }))).toMatchObject({ stan: 'Do 20 maja 2026 r.', zwolnione: expect.stringMatching(/^60\s000,00\szł$/) });
    expect(opisZwolnienia(d({ zwolnienie: 'senior', dataUrodzenia: '1966-03-10', kobieta: true, bezEmerytury: true })).stan).toBe('Od 11 marca 2026 r.');
    expect(opisZwolnienia(d({ dataUrodzenia: '1999-12-31' })).opis).toBe('26 lat skończone 31 grudnia 2025 r.');
    expect(opisZwolnienia(d({ zwolnienie: 'powrot', rokPrzeniesienia: 2024 })).okres).toBe('2024–2027');
  });
  it('limit wykorzystany przez inną ulgę; urodziny 1 stycznia: jedna data', () => {
    expect(opisZwolnienia(d({ dataUrodzenia: '2003-01-01', inneZwolnione: 85_528 }))).toMatchObject({ stan: 'Limit wykorzystany', opis: expect.stringContaining('cały limit') });
    expect(opisZwolnienia(d({ dataUrodzenia: '2000-01-01' })).okres).toBe('1 stycznia 2026 r.');
    expect(opisZwolnienia(d({ dataUrodzenia: '1990-01-01' })).limit).toBe('—');
  });
  it('brak daty, ujemne przychody', () => {
    expect(() => zwolnienie(d({}))).toThrow(RangeError);
    expect(() => zwolnienie(d({ dataUrodzenia: '2000-01-01', przychody: -1 }))).toThrow(RangeError);
    expect(() => zwolnienie(d({ zwolnienie: 'powrot' }))).toThrow(RangeError);
  });
});
