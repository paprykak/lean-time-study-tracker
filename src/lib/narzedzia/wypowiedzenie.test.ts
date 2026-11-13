import { describe, expect, it } from 'vitest';
import { dniNaPoszukiwanie, koniecWypowiedzenia, okresWypowiedzenia, stazWDniu, wypowiedzenieStalej } from './wypowiedzenie';

describe('okres wypowiedzenia (art. 34 i 36 Kp)', () => {
  it('według stażu u pracodawcy', () => {
    expect(okresWypowiedzenia('stala', 5).opis).toBe('2 tygodnie');
    expect(okresWypowiedzenia('stala', 6).opis).toBe('1 miesiąc');
    expect(okresWypowiedzenia('stala', 35).opis).toBe('1 miesiąc');
    expect(okresWypowiedzenia('stala', 36).opis).toBe('3 miesiące');
    expect(okresWypowiedzenia('probna-2tyg', 0).opis).toBe('3 dni robocze');
    expect(okresWypowiedzenia('probna-3mies', 2).opis).toBe('2 tygodnie');
  });
  it('pełne miesiące stażu w dniu doręczenia (bez tego dnia)', () => {
    expect(stazWDniu('2026-05-15', '2026-11-14')).toBe(5);
    expect(stazWDniu('2026-05-15', '2026-11-15')).toBe(6);
    expect(stazWDniu('2023-11-11', '2026-11-11')).toBe(36);
  });
  it('pełne miesiące na końcu miesiąca według art. 112 KC (6 miesięcy od 31 marca mija z końcem 30 września)', () => {
    expect(stazWDniu('2026-03-31', '2026-09-30')).toBe(5);
    expect(stazWDniu('2026-03-31', '2026-10-01')).toBe(6);
    expect(stazWDniu('2024-02-29', '2027-02-28')).toBe(35);
    expect(stazWDniu('2024-02-29', '2027-03-01')).toBe(36);
    expect(stazWDniu('2026-08-31', '2027-03-01')).toBe(6);
    // Od 31 sierpnia 6 miesięcy mija z końcem 28 lutego: doręczenie 28 lutego to jeszcze 5 pełnych miesięcy.
    expect(stazWDniu('2026-08-31', '2027-02-28')).toBe(5);
    expect(stazWDniu('2026-01-01', '2026-02-01')).toBe(1);
  });
});

describe('koniec wypowiedzenia (art. 30 § 2^1 Kp)', () => {
  it('miesiące: od 1. dnia następnego miesiąca do ostatniego dnia (przykład gov.pl: 22 lipca)', () => {
    expect(koniecWypowiedzenia('2026-07-22', okresWypowiedzenia('stala', 12))).toBe('2026-08-31');
    expect(koniecWypowiedzenia('2026-07-22', okresWypowiedzenia('stala', 40))).toBe('2026-10-31');
    expect(koniecWypowiedzenia('2026-11-30', okresWypowiedzenia('stala', 12))).toBe('2026-12-31');
    expect(koniecWypowiedzenia('2026-12-10', okresWypowiedzenia('stala', 40))).toBe('2027-03-31');
  });
  it('tygodnie: pełne tygodnie od niedzieli, koniec w sobotę', () => {
    // Poniedziałek: trzecia kolejna sobota (Zielona Linia).
    expect(koniecWypowiedzenia('2026-11-09', okresWypowiedzenia('stala', 1))).toBe('2026-11-28');
    // Wtorek 7 marca 2023 r., 2 tygodnie: sobota 25 marca 2023 r.
    expect(koniecWypowiedzenia('2023-03-07', okresWypowiedzenia('stala', 1))).toBe('2023-03-25');
    // Doręczenie w sobotę: okres od niedzieli; w niedzielę: od następnej niedzieli.
    expect(koniecWypowiedzenia('2026-11-14', okresWypowiedzenia('probna-ponad-2tyg', 0))).toBe('2026-11-21');
    expect(koniecWypowiedzenia('2026-11-15', okresWypowiedzenia('probna-ponad-2tyg', 0))).toBe('2026-11-28');
    expect(koniecWypowiedzenia('2026-11-11', okresWypowiedzenia('probna-2tyg', 0))).toBeNull();
  });
  it('dni na poszukiwanie pracy (art. 37 § 2)', () => {
    expect(dniNaPoszukiwanie(okresWypowiedzenia('stala', 40))).toBe(3);
    expect(dniNaPoszukiwanie(okresWypowiedzenia('stala', 7))).toBe(2);
    expect(dniNaPoszukiwanie(okresWypowiedzenia('stala', 2))).toBe(2);
    expect(dniNaPoszukiwanie(okresWypowiedzenia('probna-ponad-2tyg', 0))).toBe(0);
  });
});

describe('próg stażu w trakcie wypowiedzenia (wartości z niezależnego rachunku w Pythonie)', () => {
  it('6 miesięcy mija w trakcie dwutygodniowego okresu: 1 miesiąc', () => {
    const w = wypowiedzenieStalej('2026-03-01', '2026-08-20');
    expect(w).toMatchObject({ staz: 5, koniec: '2026-09-30', okres: { opis: '1 miesiąc' } });
    expect(w.prog).toMatchObject({ miesiace: 6, dzien: '2026-08-31', krotszy: { opis: '2 tygodnie' }, krotszyKoniec: '2026-09-05' });
  });
  it('koniec miesiąca: 31 marca i 29 lutego', () => {
    expect(wypowiedzenieStalej('2026-03-31', '2026-09-30')).toMatchObject({ staz: 5, koniec: '2026-10-31', okres: { opis: '1 miesiąc' } });
    const w = wypowiedzenieStalej('2024-02-29', '2027-02-28');
    expect(w).toMatchObject({ staz: 35, koniec: '2027-05-31', okres: { opis: '3 miesiące' } });
    expect(w.prog).toMatchObject({ miesiace: 36, dzien: '2027-02-28', krotszy: { opis: '1 miesiąc' }, krotszyKoniec: '2027-03-31' });
  });
  it('1 miesiąc dochodzi do 3 lat: 3 miesiące; 2 tygodnie z doręczeniem w sobotę dochodzą do 6 miesięcy', () => {
    expect(wypowiedzenieStalej('2023-09-15', '2026-08-10')).toMatchObject({ staz: 34, koniec: '2026-11-30', okres: { opis: '3 miesiące' } });
    expect(wypowiedzenieStalej('2026-05-15', '2026-11-14')).toMatchObject({ staz: 5, koniec: '2026-12-31', okres: { opis: '1 miesiąc' } });
  });
  it('próg po końcu okresu: bez zmian', () => {
    expect(wypowiedzenieStalej('2026-03-01', '2026-08-01')).toEqual({ staz: 5, okres: okresWypowiedzenia('stala', 5), koniec: '2026-08-15', prog: null });
    expect(wypowiedzenieStalej('2022-03-01', '2026-07-22')).toMatchObject({ koniec: '2026-10-31', prog: null });
  });
});
