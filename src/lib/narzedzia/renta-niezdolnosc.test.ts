// Oczekiwane wartości policzone niezależnie skryptem w Pythonie (datetime, calendar): progi wieku z art. 58 ust. 1
// liczone od dni urodzin (dokładnie) i w pełnych latach, nieskładkowe do 1/3 składkowych, art. 57 ust. 2, 58 ust. 4.
import { describe, expect, it } from 'vitest';
import { opisRenty, warunkiRenty, wiekWDniu, wymaganyOkres, type DaneRenty } from './renta-niezdolnosc';

const D = (z: Partial<DaneRenty>): DaneRenty => ({
  plec: 'm',
  urodzenie: '1985-04-10',
  powstanie: '2026-11-13',
  przyczyna: 'choroba',
  stopien: 'czesciowa',
  skladkowe: 6,
  nieskladkowe: 1,
  ostatnie10: 6,
  ubezpieczenie: 'w-trakcie',
  dzis: '2026-11-13',
  ...z,
});

describe('renta z tytułu niezdolności do pracy (art. 57–58 ustawy o FUS, art. 17 ustawy wypadkowej)', () => {
  it('wiek w pełnych latach, także dla urodzonych 29 lutego', () => {
    expect(wiekWDniu('1985-04-10', '2026-11-13')).toBe(41);
    expect(wiekWDniu('2004-02-29', '2025-02-27')).toBe(20);
    expect(wiekWDniu('2004-02-29', '2025-02-28')).toBe(21);
  });

  it('progi art. 58 ust. 1: dzień urodzin daje niższy próg, rok po urodzinach zależy od sposobu liczenia', () => {
    expect(wymaganyOkres('2006-03-01', '2026-02-28')).toEqual({ dokladnie: 1, pelneLata: 1 });
    expect(wymaganyOkres('2006-03-01', '2026-03-01')).toEqual({ dokladnie: 2, pelneLata: 2 });
    expect(wymaganyOkres('2004-01-15', '2026-01-15')).toEqual({ dokladnie: 2, pelneLata: 2 });
    expect(wymaganyOkres('2004-01-15', '2026-01-16')).toEqual({ dokladnie: 3, pelneLata: 2 });
    expect(wymaganyOkres('1996-06-30', '2026-07-01')).toEqual({ dokladnie: 5, pelneLata: 4 });
    expect(wymaganyOkres('1985-04-10', '2026-11-13')).toEqual({ dokladnie: 5, pelneLata: 5 });
  });

  it('po 30 latach: 5 lat, w tym 5 w ostatnich 10 latach; nieskładkowe do 1/3 składkowych', () => {
    expect(warunkiRenty(D({}))).toMatchObject({ stan: 'spelnia', wiek: 41, wymagany: 5, staz: 7, okres: 'spelniony', potrzeba10: true });
    expect(warunkiRenty(D({ ostatnie10: 4 }))).toMatchObject({ stan: 'brak', brak10: 12 });
    expect(warunkiRenty(D({ skladkowe: 3, nieskladkowe: 3 }))).toMatchObject({ stan: 'brak', staz: 4, brakStazu: 12 });
  });

  it('całkowita niezdolność i 30 lat składkowych (mężczyzna): bez warunku 10 lat (art. 58 ust. 4)', () => {
    expect(warunkiRenty(D({ stopien: 'calkowita', skladkowe: 30, nieskladkowe: 0, ostatnie10: 4 }))).toMatchObject({ stan: 'spelnia', potrzeba10: false });
  });

  it('młodzi: 1 rok przed 20 latami, 2 lata od dnia 20. urodzin', () => {
    expect(warunkiRenty(D({ plec: 'k', urodzenie: '2006-03-01', powstanie: '2026-02-28', skladkowe: 0.9, nieskladkowe: 0.2, ostatnie10: 0.9 }))).toMatchObject({ stan: 'spelnia', wiek: 19, staz: 1.1 });
    expect(warunkiRenty(D({ plec: 'k', urodzenie: '2006-03-01', powstanie: '2026-03-01', skladkowe: 1.5, nieskladkowe: 0, ostatnie10: 1.5 }))).toMatchObject({ stan: 'brak', wymagany: 2 });
    expect(warunkiRenty(D({ plec: 'k', urodzenie: '2004-01-15', powstanie: '2026-01-15', skladkowe: 1.5, nieskladkowe: 0 })).stan).toBe('brak');
  });

  it('rok po 22. albo 30. urodzinach: „zależy”, gdy staż mieści się między progami', () => {
    expect(warunkiRenty(D({ plec: 'k', urodzenie: '2004-01-15', powstanie: '2026-01-16', skladkowe: 2.5, nieskladkowe: 0, ubezpieczenie: 'do-18' }))).toMatchObject({ stan: 'zalezy', wymagany: 3, wymaganyPelneLata: 2 });
    expect(warunkiRenty(D({ plec: 'k', urodzenie: '2004-01-15', powstanie: '2026-01-16', skladkowe: 1.5, nieskladkowe: 0 })).stan).toBe('brak');
    expect(warunkiRenty(D({ urodzenie: '1996-06-30', powstanie: '2026-07-01', stopien: 'calkowita', skladkowe: 4.2, nieskladkowe: 0, ostatnie10: 4.2 })).stan).toBe('zalezy');
  });

  it('ponad 18 miesięcy po końcu ubezpieczenia: tylko całkowita niezdolność i 25 lat stażu (art. 57 ust. 2)', () => {
    expect(warunkiRenty(D({ urodzenie: '1970-02-01', stopien: 'calkowita', skladkowe: 20, nieskladkowe: 9, ostatnie10: 5, ubezpieczenie: 'pozniej' }))).toMatchObject({ stan: 'spelnia', staz: 26.667, okres: 'zwolniony' });
    expect(warunkiRenty(D({ urodzenie: '1970-02-01', stopien: 'czesciowa', skladkowe: 20, nieskladkowe: 9, ostatnie10: 5, ubezpieczenie: 'pozniej' }))).toMatchObject({ stan: 'brak', okres: 'niespelniony' });
    // 27 lat stażu zwalnia z 18 miesięcy, ale 24 lata składkowe nie zwalniają z 5 lat w ostatnich 10 latach.
    expect(warunkiRenty(D({ urodzenie: '1970-02-01', stopien: 'calkowita', skladkowe: 24, nieskladkowe: 3, ostatnie10: 0, ubezpieczenie: 'pozniej' }))).toMatchObject({ stan: 'brak', okres: 'zwolniony', brak10: 60 });
  });

  it('wypadek przy pracy: bez stażu i bez 18 miesięcy; w drodze do pracy: bez stażu, ale z 18 miesiącami', () => {
    expect(warunkiRenty(D({ urodzenie: '1990-05-05', przyczyna: 'praca', skladkowe: 0.1, nieskladkowe: 0, ostatnie10: 0.1, ubezpieczenie: 'pozniej' }))).toMatchObject({ stan: 'bez-stazu', okres: 'niewymagany' });
    expect(warunkiRenty(D({ urodzenie: '1990-05-05', przyczyna: 'droga', skladkowe: 0.1, nieskladkowe: 0, ostatnie10: 0.1 })).stan).toBe('spelnia');
    expect(warunkiRenty(D({ urodzenie: '1960-01-01', przyczyna: 'zawodowa', skladkowe: 0.1, nieskladkowe: 0, ostatnie10: 0.1, ubezpieczenie: 'pozniej' })).stan).toBe('bez-stazu');
    expect(warunkiRenty(D({ urodzenie: '1990-05-05', przyczyna: 'droga', skladkowe: 0.1, nieskladkowe: 0, ostatnie10: 0.1, ubezpieczenie: 'pozniej' })).stan).toBe('brak');
  });

  it('w wieku emerytalnym renta z FUS nie przysługuje (od dnia 60. urodzin kobiety)', () => {
    expect(warunkiRenty(D({ urodzenie: '1960-01-01', stopien: 'calkowita', skladkowe: 40, nieskladkowe: 0, ostatnie10: 10 })).stan).toBe('emerytura');
    expect(warunkiRenty(D({ plec: 'k', urodzenie: '1966-11-13', stopien: 'calkowita', skladkowe: 30, nieskladkowe: 0, ostatnie10: 10 })).stan).toBe('emerytura');
    expect(warunkiRenty(D({ plec: 'k', urodzenie: '1966-11-14', stopien: 'calkowita', skladkowe: 30, nieskladkowe: 0, ostatnie10: 10 })).stan).toBe('spelnia');
  });

  it('ułamki lat: 4,999 roku to 5 lat; braki w miesiącach w górę', () => {
    expect(warunkiRenty(D({ skladkowe: 4.999, nieskladkowe: 0, ostatnie10: 4.999 }))).toMatchObject({ stan: 'spelnia', staz: 5 });
    expect(opisRenty(D({ skladkowe: 4.5, nieskladkowe: 0, ostatnie10: 4.5 })).opis).toBe('brakuje 6 miesięcy okresów składkowych i nieskładkowych; w ostatnich 10 latach brakuje 6 miesięcy (art. 58 ust. 2)');
  });

  it('emerytura: wiek 65 lat w dniu decyzji (dziś), urodzeni przed 1949 r. przy stażu 20 lat (art. 27–28)', () => {
    expect(warunkiRenty(D({ urodzenie: '1961-11-13', powstanie: '2026-06-01', stopien: 'calkowita', skladkowe: 40, ostatnie10: 10 })).stan).toBe('emerytura');
    expect(warunkiRenty(D({ urodzenie: '1961-11-14', powstanie: '2026-06-01', stopien: 'calkowita', skladkowe: 40, ostatnie10: 10 })).stan).toBe('spelnia');
    expect(warunkiRenty(D({ urodzenie: '1945-01-01', powstanie: '2012-01-01', stopien: 'calkowita', skladkowe: 30, ostatnie10: 10 })).stan).toBe('emerytura');
    expect(warunkiRenty(D({ urodzenie: '1945-01-01', powstanie: '2012-01-01', stopien: 'calkowita', skladkowe: 19, nieskladkowe: 0, ostatnie10: 10 })).stan).not.toBe('emerytura');
  });

  it('błędne dane', () => {
    expect(() => warunkiRenty(D({ skladkowe: -1 }))).toThrow(RangeError);
    expect(() => warunkiRenty(D({ powstanie: '1980-01-01' }))).toThrow(RangeError);
  });

  it('teksty wyniku', () => {
    expect(opisRenty(D({}))).toMatchObject({ stan: 'Warunki stażu spełnione', wiek: '41 lat', wymagany: '5 lat, w tym 5 lat w ostatnich 10 latach', staz: '7 lat', okres: 'tak' });
    expect(opisRenty(D({ skladkowe: 3, nieskladkowe: 3 }))).toMatchObject({ staz: '4 lata (nieskładkowe do 1/3 składkowych)', opis: 'brakuje 1 roku okresów składkowych i nieskładkowych' });
    expect(opisRenty(D({ ostatnie10: 4 })).opis).toBe('w ostatnich 10 latach brakuje 1 roku (art. 58 ust. 2)');
    expect(opisRenty(D({ ostatnie10: 4 })).uwagi.join(' ')).toContain('art. 58 ust. 3');
    expect(opisRenty(D({ przyczyna: 'praca' }))).toMatchObject({ stan: 'Staż nie jest wymagany', wymagany: 'nie jest wymagany' });
    expect(opisRenty(D({ plec: 'k', urodzenie: '2004-01-15', powstanie: '2026-01-16', skladkowe: 2.5, nieskladkowe: 0 })).opis).toBe('przy liczeniu wieku w pełnych latach potrzeba 2 lat, a przy liczeniu od dnia po urodzinach 3 lat; przepis tego nie rozstrzyga, decyduje ZUS, a w sporze sąd');
  });
});
