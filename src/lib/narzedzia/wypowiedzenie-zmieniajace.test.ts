// Oczekiwane wartości policzone niezależnie skryptem w Pythonie (datetime, własny kalendarz świąt), nie kodem z TS.
import { describe, expect, it } from 'vitest';
import { ostatniDzienPrzedPolowa, wypowiedzenieZmieniajace } from './wypowiedzenie-zmieniajace';

describe('wypowiedzenie zmieniające (art. 42 § 1–3, art. 36 § 1, art. 30 § 2¹, art. 264 § 1 Kp)', () => {
  it('staż ponad 3 lata: 3 miesiące, odmowa do 5 stycznia (wariant B: 14 stycznia)', () => {
    expect(wypowiedzenieZmieniajace('2020-01-15', '2026-11-12')).toMatchObject({
      stazMiesiecy: 81,
      koniec: '2027-02-28',
      noweWarunkiOd: '2027-03-01',
      poczatekPelnegoOkresu: '2026-12-01',
      odmowaDo: '2027-01-05',
      odmowaDoWariantB: '2027-01-14',
      dniA: 108,
      dniB: 90,
      odwolanieDo: '2026-12-03',
    });
    expect(wypowiedzenieZmieniajace('2020-01-15', '2026-11-12').okres.opis).toBe('3 miesiące');
  });
  it('staż 5 miesięcy: 2 tygodnie do soboty 28 listopada, odmowa do 20 listopada', () => {
    const w = wypowiedzenieZmieniajace('2026-06-01', '2026-11-12');
    expect(w.okres.opis).toBe('2 tygodnie');
    expect(w).toMatchObject({ koniec: '2026-11-28', poczatekPelnegoOkresu: '2026-11-15', odmowaDo: '2026-11-20', odmowaDoWariantB: '2026-11-21', dniA: 16, dniB: 14 });
  });
  it('granice stażu: dokładnie 6 miesięcy daje miesiąc, dzień mniej 2 tygodnie; 36 miesięcy daje 3 miesiące', () => {
    expect(wypowiedzenieZmieniajace('2026-05-12', '2026-11-12')).toMatchObject({ stazMiesiecy: 6, koniec: '2026-12-31', odmowaDo: '2026-12-06', odmowaDoWariantB: '2026-12-15' });
    expect(wypowiedzenieZmieniajace('2026-05-13', '2026-11-12')).toMatchObject({ stazMiesiecy: 5, koniec: '2026-11-28' });
    expect(wypowiedzenieZmieniajace('2023-11-13', '2026-11-12')).toMatchObject({ stazMiesiecy: 35, koniec: '2026-12-31' });
    expect(wypowiedzenieZmieniajace('2023-11-12', '2026-11-12')).toMatchObject({ stazMiesiecy: 36, koniec: '2027-02-28' });
  });
  it('doręczenie w sobotę i w niedzielę: tygodnie od najbliższej niedzieli', () => {
    expect(wypowiedzenieZmieniajace('2026-06-01', '2026-11-14')).toMatchObject({ koniec: '2026-11-28', odmowaDo: '2026-11-21', odmowaDoWariantB: '2026-11-21', dniA: 14 });
    expect(wypowiedzenieZmieniajace('2026-06-01', '2026-11-15')).toMatchObject({ koniec: '2026-12-05', poczatekPelnegoOkresu: '2026-11-22', odmowaDo: '2026-11-25', odmowaDoWariantB: '2026-11-28', dniA: 20 });
  });
  it('odwołanie: 21 dni od doręczenia, z Bożego Narodzenia i niedzieli na poniedziałek 28 grudnia', () => {
    expect(wypowiedzenieZmieniajace('2026-01-01', '2026-12-04')).toMatchObject({ koniec: '2027-01-31', odmowaDo: '2027-01-02', odmowaDoWariantB: '2027-01-15', odwolanieDo: '2026-12-28' });
  });
  it('rok przestępny: miesiąc do 29 lutego, połowa lutego (29 dni) do 14 lutego', () => {
    expect(wypowiedzenieZmieniajace('2027-06-01', '2028-01-20')).toMatchObject({ koniec: '2028-02-29', odmowaDo: '2028-02-09', odmowaDoWariantB: '2028-02-14', dniB: 29, odwolanieDo: '2028-02-10' });
  });
  it('bez pouczenia: odmowa do końca okresu wypowiedzenia (art. 42 § 3 zdanie trzecie)', () => {
    expect(wypowiedzenieZmieniajace('2020-01-15', '2026-11-12', false).odmowaDo).toBe('2027-02-28');
  });
  it('połowa: dzień z połową w środku już się nie liczy', () => {
    expect(ostatniDzienPrzedPolowa('2026-12-01', '2026-12-31')).toBe('2026-12-15');
    expect(ostatniDzienPrzedPolowa('2026-11-01', '2026-11-30')).toBe('2026-11-15');
    expect(ostatniDzienPrzedPolowa('2026-11-15', '2026-11-28')).toBe('2026-11-21');
  });
  it('błędne dane', () => {
    expect(() => wypowiedzenieZmieniajace('2026-11-13', '2026-11-12')).toThrow(/przed rozpoczęciem/);
    expect(() => wypowiedzenieZmieniajace('2026-02-30', '2026-11-12')).toThrow(/obie daty/);
    expect(() => wypowiedzenieZmieniajace('', '2026-11-12')).toThrow();
  });
});
