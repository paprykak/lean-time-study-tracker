// Oczekiwane wartości policzone niezależnie skryptem w Pythonie (datetime, calendar): wiek w dniu urodzin
// (29 lutego: 28 lutego w roku nieprzestępnym), pkt 6 szacowany od dołu (staż minus 4/3 zaczętych miesięcy roku),
// 180 dni zasiłku przed 60/65 urodzinami, staż obcięty do setnych. Skrypt: scratchpad zespołu (przed.py).
import { describe, expect, it } from 'vitest';
import { MAKS_ZMNIEJSZENIA } from './dorabianie';
import { KWOTY_PRZYCHODU, kwotyNaDzien, opisPrzedemerytalnego, swiadczeniePrzedemerytalne, type DanePrzedemerytalne } from './swiadczenie-przedemerytalne';

const D = (z: Partial<DanePrzedemerytalne>): DanePrzedemerytalne => ({
  plec: 'm',
  urodzenie: '1965-06-15',
  przyczyna: 'likwidacja',
  data: '2026-06-15',
  staz: 25,
  okres: true,
  ...z,
});

describe('świadczenie przedemerytalne (art. 2 ust. 1 ustawy o świadczeniach przedemerytalnych)', () => {
  it('likwidacja: 61 lat i 25 lat stażu w dniu rozwiązania (pkt 1); dzień przed 61. urodzinami nie', () => {
    expect(swiadczeniePrzedemerytalne(D({}))).toMatchObject({ stan: 'spelnia', spelnione: ['pkt 1'], koniec: '2030-06-15' });
    expect(swiadczeniePrzedemerytalne(D({ data: '2026-06-14' })).stan).toBe('brak');
    expect(swiadczeniePrzedemerytalne(D({ okres: false })).stan).toBe('brak');
  });

  it('przyczyny dotyczące zakładu pracy: 55/60 lat i 30/35 lat (pkt 2) albo 35/40 lat bez wieku (pkt 5)', () => {
    expect(swiadczeniePrzedemerytalne(D({ przyczyna: 'zaklad' })).stan).toBe('brak');
    expect(swiadczeniePrzedemerytalne(D({ plec: 'k', urodzenie: '1970-03-01', przyczyna: 'zaklad', data: '2026-09-30', staz: 30 }))).toMatchObject({ stan: 'spelnia', spelnione: ['pkt 2'] });
    expect(swiadczeniePrzedemerytalne(D({ plec: 'k', urodzenie: '1970-03-01', przyczyna: 'zaklad', data: '2026-09-30', staz: 29.5 })).stan).toBe('brak');
    expect(swiadczeniePrzedemerytalne(D({ urodzenie: '1980-01-01', przyczyna: 'zaklad', data: '2026-09-30', staz: 40 }))).toMatchObject({ stan: 'spelnia', spelnione: ['pkt 5'] });
  });

  it('pkt 6: 39 lat do 31 grudnia poprzedniego roku, szacowane od dołu (4/3 zaczętych miesięcy)', () => {
    expect(swiadczeniePrzedemerytalne(D({ urodzenie: '1980-01-01', data: '2026-03-31', staz: 39.34 }))).toMatchObject({ stan: 'spelnia', spelnione: ['pkt 6'], pkt6: 'tak' });
    expect(swiadczeniePrzedemerytalne(D({ urodzenie: '1980-01-01', data: '2026-03-31', staz: 39.3 }))).toMatchObject({ stan: 'zalezy', pkt6: 'zalezy' });
    expect(swiadczeniePrzedemerytalne(D({ urodzenie: '1980-01-01', data: '2026-01-15', staz: 39.11 })).stan).toBe('zalezy');
    expect(swiadczeniePrzedemerytalne(D({ urodzenie: '1980-01-01', data: '2026-01-15', staz: 39.12 })).stan).toBe('spelnia');
    expect(swiadczeniePrzedemerytalne(D({ urodzenie: '1980-01-01', data: '2026-12-15', staz: 39.5 })).stan).toBe('zalezy');
  });

  it('koniec renty: 55 lat kobiety urodzonej 29 lutego to 28 lutego 2023 r.', () => {
    expect(swiadczeniePrzedemerytalne(D({ plec: 'k', urodzenie: '1968-02-29', przyczyna: 'renta', data: '2023-02-28', staz: 22 }))).toMatchObject({ stan: 'spelnia', spelnione: ['pkt 4'], koniec: '2028-02-29' });
    expect(swiadczeniePrzedemerytalne(D({ plec: 'k', urodzenie: '1968-02-29', przyczyna: 'renta', data: '2023-02-27', staz: 22 })).stan).toBe('brak');
  });

  it('opiekun (pkt 4a), upadłość firmy (pkt 3), po 65. urodzinach nie przysługuje', () => {
    expect(swiadczeniePrzedemerytalne(D({ plec: 'k', urodzenie: '1969-01-10', przyczyna: 'opiekun', data: '2026-01-10', staz: 20 })).spelnione).toEqual(['pkt 4a']);
    expect(swiadczeniePrzedemerytalne(D({ urodzenie: '1964-01-10', przyczyna: 'firma', data: '2025-12-31', staz: 25 })).spelnione).toEqual(['pkt 3']);
    expect(swiadczeniePrzedemerytalne(D({ urodzenie: '1960-05-01', data: '2026-01-10', staz: 30 })).stan).toBe('wiek-emerytalny');
  });

  it('180 dni zasiłku muszą minąć przed 65. urodzinami (art. 2 ust. 3 i art. 4 ust. 1 pkt 3)', () => {
    expect(swiadczeniePrzedemerytalne(D({ data: '2030-03-01' })).stan).toBe('nie-zdazy');
    expect(swiadczeniePrzedemerytalne(D({ data: '2029-12-17' })).stan).toBe('nie-zdazy');
    // Data + 182 dni (rejestracja następnego dnia, 180 dni zasiłku, wniosek, świadczenie od dnia po wniosku).
    expect(swiadczeniePrzedemerytalne(D({ data: '2029-12-16' })).stan).toBe('nie-zdazy');
    expect(swiadczeniePrzedemerytalne(D({ data: '2029-12-15' })).stan).toBe('nie-zdazy');
    expect(swiadczeniePrzedemerytalne(D({ data: '2029-12-14' })).stan).toBe('spelnia');
    expect(swiadczeniePrzedemerytalne(D({ data: '2030-06-15' })).stan).toBe('wiek-emerytalny');
    expect(opisPrzedemerytalnego(D({ data: '2030-03-01' }), '2026-11-13')).toMatchObject({ stan: 'Nie zdąży się zacząć', koniec: '—', podstawa: '—' });
  });

  it('staż obcięty do setnych: 34,999 roku to nie 35 lat (brakuje 1 miesiąca)', () => {
    const d = D({ plec: 'k', urodzenie: '1980-01-01', przyczyna: 'zaklad', data: '2026-09-30', staz: 34.999 });
    expect(swiadczeniePrzedemerytalne(d).stan).toBe('brak');
    expect(opisPrzedemerytalnego(d, '2026-11-13').opis).toContain('bez względu na wiek (pkt 5): brakuje 1 miesiąca stażu');
  });

  it('kwoty przychodu od 1 marca (M.P. 2025 poz. 142, M.P. 2026 poz. 208)', () => {
    expect(kwotyNaDzien('2026-02-28')).toMatchObject({ dopuszczalna: 2045.5, graniczna: 5727.2 });
    expect(kwotyNaDzien('2026-11-13')).toMatchObject({ dopuszczalna: 2225.9, graniczna: 6232.5, mozeNieaktualne: false });
    expect(kwotyNaDzien('2027-02-28').mozeNieaktualne).toBe(false);
    expect(kwotyNaDzien('2027-03-01')).toMatchObject({ dopuszczalna: 2225.9, mozeNieaktualne: true });
    expect(opisPrzedemerytalnego(D({}), '2027-03-01').uwagi.join(' ')).toContain('mogą być już nieaktualne');
    expect(opisPrzedemerytalnego(D({}), '2026-11-13').uwagi.join(' ')).not.toContain('mogą być już nieaktualne');
  });
  it('kwoty przychodu dopisywane razem z kwotami zmniejszeń w dorabianiu (oba komunikaty ZUS od 1 marca)', () => {
    expect(KWOTY_PRZYCHODU.at(-1)!.od >= MAKS_ZMNIEJSZENIA.at(-1)!.od).toBe(true);
  });

  it('błędne dane', () => {
    expect(() => swiadczeniePrzedemerytalne(D({ staz: -1 }))).toThrow(RangeError);
    expect(() => swiadczeniePrzedemerytalne(D({ data: '1960-01-01' }))).toThrow(RangeError);
  });

  it('teksty wyniku', () => {
    const o = opisPrzedemerytalnego(D({}), '2026-11-13');
    expect(o).toMatchObject({ stan: 'Spełniasz warunki', podstawa: 'art. 2 ust. 1 pkt 1', koniec: '15 czerwca 2030 r.', przychod: 'bez zmniejszenia do 2225,90 zł, zawieszenie powyżej 6232,50 zł' });
    expect(opisPrzedemerytalnego(D({ data: '2026-06-14', staz: 24 }), '2026-11-13')).toMatchObject({
      opis: 'przy likwidacji lub niewypłacalności (pkt 1): brakuje wieku 61 lat w dniu rozwiązania umowy (61. urodziny: 15 czerwca 2026 r.) i 1 roku stażu; przy przyczynach dotyczących zakładu pracy (pkt 2): brakuje 11 lat stażu; bez względu na wiek (pkt 5): brakuje 16 lat stażu; bez względu na wiek, do 31 grudnia 2025 r. (pkt 6): brakuje co najmniej 15 lat stażu',
      koniec: '—',
      przychod: '—',
    });
    expect(opisPrzedemerytalnego(D({ plec: 'k', urodzenie: '1968-02-29', przyczyna: 'renta', data: '2023-02-27', staz: 22 }), '2026-11-13').opis).toBe('po rencie (pkt 4): brakuje wieku 55 lat w dniu końca renty (55. urodziny: 28 lutego 2023 r.)');
    expect(opisPrzedemerytalnego(D({ urodzenie: '1980-01-01', data: '2026-03-31', staz: 39.2 }), '2026-11-13').opis).toBe('wystarczy 39 lat okresu uprawniającego do emerytury do 31 grudnia 2025 r. (art. 2 ust. 1 pkt 6)');
    expect(opisPrzedemerytalnego(D({ przyczyna: 'renta', data: '2026-06-15' }), '2026-11-13').uwagi.join(' ')).toContain('nie może być wyższe niż ostatnio otrzymywana renta');
    expect(opisPrzedemerytalnego(D({ okres: false }), '2026-11-13').opis).toBe('brakuje warunku: co najmniej 6 miesięcy pracy u tego pracodawcy; przy przyczynach dotyczących zakładu pracy (pkt 2): brakuje 10 lat stażu; bez względu na wiek (pkt 5): brakuje 15 lat stażu; bez względu na wiek, do 31 grudnia 2025 r. (pkt 6): brakuje co najmniej 14 lat stażu');
  });
});
