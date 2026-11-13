import { describe, expect, it } from 'vitest';
import { KONSERWACJA, OBSLUGA, kwotaGusMozeNieaktualna, opisRodzaju, oplataEgzaminu, rodzaj, terminyUdt } from './uprawnienia-udt';

describe('rodzaje urządzeń (zał. 3 do rozporządzenia z 2019 r.)', () => {
  it('okresy ważności z kolumny c dla kluczowych urządzeń', () => {
    expect(rodzaj('o-wozki')?.lata).toBe(10);
    expect(rodzaj('o-wozki-wysiegnik')?.lata).toBe(5);
    expect(rodzaj('o-suwnice-ogolne')?.lata).toBe(10);
    expect(rodzaj('o-podesty-przejezdne')?.lata).toBe(5);
    expect(rodzaj('k-wozki')?.lata).toBe(5);
    expect(rodzaj('k-ukladnice')?.lata).toBe(10);
  });
  it('identyfikatory unikalne, okres 5 albo 10 lat (art. 22 ust. 3a)', () => {
    const ids = [...OBSLUGA, ...KONSERWACJA].map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const r of [...OBSLUGA, ...KONSERWACJA]) expect([5, 10]).toContain(r.lata);
  });
});

describe('terminyUdt', () => {
  it('wniosek najpóźniej 3 miesiące przed końcem ważności, przedłużenie od dnia upływu', () => {
    const w = terminyUdt({ waznoDo: '2029-06-15', lata: 10, dzis: '2026-11-11' });
    expect(w).toMatchObject({ wniosekDo: '2029-03-15', poPrzedluzeniu: '2039-06-15', status: 'w-terminie' });
    expect(w.wydarzenia.map((e) => e.data)).toEqual(['2029-02-13', '2029-03-15', '2029-06-15']);
  });
  it('koniec miesiąca: 31 maja minus 3 miesiące = 28 lutego', () => {
    expect(terminyUdt({ waznoDo: '2027-05-31', lata: 5, dzis: '2026-11-11' }).wniosekDo).toBe('2027-02-28');
  });
  it('statusy: za późno na wniosek, wygasło, pilne', () => {
    expect(terminyUdt({ waznoDo: '2027-01-20', lata: 5, dzis: '2026-11-11' }).status).toBe('za-pozno-na-wniosek');
    expect(terminyUdt({ waznoDo: '2026-10-01', lata: 5, dzis: '2026-11-11' }).status).toBe('wygaslo');
    expect(terminyUdt({ waznoDo: '2027-03-01', lata: 5, dzis: '2026-11-11' }).status).toBe('pilne');
    expect(terminyUdt({ waznoDo: '2026-10-01', lata: 5, dzis: '2026-11-11' }).wydarzenia).toEqual([]);
  });
});

it('opłata za egzamin: 3,75% z 8903,56 zł (GUS za 2025 r.) = 333,88 zł', () => {
  expect(oplataEgzaminu(8903.56)).toBe(333.88);
});

it('kwota GUS może być nieaktualna po 12 miesiącach od ogłoszenia (10 lutego 2026 r.)', () => {
  expect(kwotaGusMozeNieaktualna('2026-02-10', '2027-02-09')).toBe(false);
  expect(kwotaGusMozeNieaktualna('2026-02-10', '2027-02-10')).toBe(false);
  expect(kwotaGusMozeNieaktualna('2026-02-10', '2027-02-11')).toBe(true);
});

it('krótkie nazwy do listy: najwyżej 25 znaków, a opis podaje obsługę albo konserwację i okres', () => {
  for (const r of [...OBSLUGA, ...KONSERWACJA]) expect(r.krotko.length).toBeLessThanOrEqual(25);
  for (const lista of [OBSLUGA, KONSERWACJA]) expect(new Set(lista.map((r) => r.krotko)).size).toBe(lista.length);
  expect(opisRodzaju(rodzaj('o-podesty-przejezdne')!)).toBe('Obsługa: Podesty ruchome przejezdne. Zaświadczenie ważne 5 lat.');
  expect(opisRodzaju(rodzaj('k-wozki')!)).toBe('Konserwacja: Wózki jezdniowe podnośnikowe z mechanicznym napędem podnoszenia. Zaświadczenie ważne 5 lat.');
});
