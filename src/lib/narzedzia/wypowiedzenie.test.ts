import { describe, expect, it } from 'vitest';
import { dniNaPoszukiwanie, koniecWypowiedzenia, okresWypowiedzenia, pelneMiesiace } from './wypowiedzenie';

describe('okres wypowiedzenia (art. 34 i 36 Kp)', () => {
  it('według stażu u pracodawcy', () => {
    expect(okresWypowiedzenia('stala', 5).opis).toBe('2 tygodnie');
    expect(okresWypowiedzenia('stala', 6).opis).toBe('1 miesiąc');
    expect(okresWypowiedzenia('stala', 35).opis).toBe('1 miesiąc');
    expect(okresWypowiedzenia('stala', 36).opis).toBe('3 miesiące');
    expect(okresWypowiedzenia('probna-2tyg', 0).opis).toBe('3 dni robocze');
    expect(okresWypowiedzenia('probna-3mies', 2).opis).toBe('2 tygodnie');
  });
  it('pełne miesiące stażu', () => {
    expect(pelneMiesiace('2026-05-15', '2026-11-14')).toBe(5);
    expect(pelneMiesiace('2026-05-15', '2026-11-15')).toBe(6);
    expect(pelneMiesiace('2023-11-11', '2026-11-11')).toBe(36);
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
