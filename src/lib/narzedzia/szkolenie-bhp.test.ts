import { describe, expect, it } from 'vitest';
import { GRUPY, KLUCZE_GRUP, status, terminSzkolenia } from './szkolenie-bhp';

describe('GRUPY (§ 15 rozporządzenia o szkoleniu BHP)', () => {
  it('częstotliwość i pierwsze szkolenie zgodne z § 15 ust. 1, 2 i 4', () => {
    expect(GRUPY.robotnicze.coIleLat).toBe(3);
    expect(GRUPY['robotnicze-szczegolnie-niebezpieczne'].coIleLat).toBe(1);
    expect(GRUPY.kierujacy).toMatchObject({ coIleLat: 5, pierwszeMiesiecy: 6 });
    expect(GRUPY['administracyjno-biurowe'].coIleLat).toBe(6);
    for (const k of KLUCZE_GRUP.filter((k) => k !== 'kierujacy')) expect(GRUPY[k].pierwszeMiesiecy).toBe(12);
    for (const k of ['inzynieryjno-techniczne', 'sluzba-bhp', 'inne-narazeni'] as const) expect(GRUPY[k].coIleLat).toBe(5);
  });
});

describe('terminSzkolenia', () => {
  it('kolejne szkolenie robotnika: 3 lata od ostatniego, przypomnienie 60 dni wcześniej', () => {
    const w = terminSzkolenia({ grupa: 'robotnicze', ostatnie: '2024-03-15', poczatekPracy: null, dzis: '2026-11-11' });
    expect(w).toMatchObject({ rodzaj: 'kolejne', termin: '2027-03-15', dni: 124, status: 'w-terminie' });
    expect(w.wydarzenia.map((e) => e.data)).toEqual(['2027-01-14', '2027-03-15']);
  });
  it('pierwsze szkolenie kierownika: 6 miesięcy od rozpoczęcia pracy', () => {
    const w = terminSzkolenia({ grupa: 'kierujacy', ostatnie: null, poczatekPracy: '2026-08-31', dzis: '2026-11-11' });
    expect(w).toMatchObject({ rodzaj: 'pierwsze', termin: '2027-02-28' });
    // Pierwszy dzień pracy się wlicza: od 15 sierpnia 6 miesięcy trwa do 14 lutego (konwencja terminy.ts, Python).
    expect(terminSzkolenia({ grupa: 'kierujacy', ostatnie: null, poczatekPracy: '2026-08-15', dzis: '2026-11-11' }).termin).toBe('2027-02-14');
    expect(terminSzkolenia({ grupa: 'robotnicze', ostatnie: null, poczatekPracy: '2026-03-01', dzis: '2026-11-11' }).termin).toBe('2027-02-28');
  });
  it('po terminie: bez przypomnienia z przeszłości', () => {
    const w = terminSzkolenia({ grupa: 'robotnicze-szczegolnie-niebezpieczne', ostatnie: '2025-10-01', poczatekPracy: null, dzis: '2026-11-11' });
    expect(w).toMatchObject({ termin: '2026-10-01', dni: -41, status: 'po-terminie' });
    expect(w.wydarzenia).toHaveLength(1);
  });
  it('biuro u pracodawcy z kategorią ryzyka do 3: szkolenie niewymagane (art. 237^3 § 2^2 Kp)', () => {
    expect(terminSzkolenia({ grupa: 'administracyjno-biurowe', ostatnie: '2020-01-10', poczatekPracy: null, dzis: '2026-11-11', zwolnienieBiurowe: true }).status).toBe('niewymagane');
    expect(terminSzkolenia({ grupa: 'administracyjno-biurowe', ostatnie: '2020-01-10', poczatekPracy: null, dzis: '2026-11-11' }).termin).toBe('2026-01-10');
  });
  it('bez dat to błąd', () => {
    expect(() => terminSzkolenia({ grupa: 'robotnicze', ostatnie: null, poczatekPracy: null, dzis: '2026-11-11' })).toThrow(RangeError);
  });
  it('progi statusu', () => {
    expect([status(-1), status(0), status(30), status(31), status(90), status(91)]).toEqual(['po-terminie', 'pilne', 'pilne', 'wkrotce', 'wkrotce', 'w-terminie']);
  });
});
