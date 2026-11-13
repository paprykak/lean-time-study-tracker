// Oczekiwane wartości policzone niezależnie skryptem w Pythonie (datetime, calendar): wiek w dniu urodzin
// (29 lutego: 28 lutego w roku nieprzestępnym), pkt 6 szacowany od dołu (staż minus zaczęte miesiące roku).
import { describe, expect, it } from 'vitest';
import { kwotyNaDzien, opisPrzedemerytalnego, swiadczeniePrzedemerytalne, type DanePrzedemerytalne } from './swiadczenie-przedemerytalne';

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

  it('pkt 6: 39 lat do 31 grudnia poprzedniego roku, szacowane od dołu', () => {
    expect(swiadczeniePrzedemerytalne(D({ urodzenie: '1980-01-01', data: '2026-03-31', staz: 39.3 }))).toMatchObject({ stan: 'spelnia', spelnione: ['pkt 6'], pkt6: 'tak' });
    expect(swiadczeniePrzedemerytalne(D({ urodzenie: '1980-01-01', data: '2026-03-31', staz: 39.2 }))).toMatchObject({ stan: 'zalezy', pkt6: 'zalezy' });
    expect(swiadczeniePrzedemerytalne(D({ urodzenie: '1980-01-01', data: '2026-12-15', staz: 39.5 })).stan).toBe('zalezy');
  });

  it('koniec renty: 55 lat kobiety urodzonej 29 lutego to 28 lutego 2023 r.', () => {
    expect(swiadczeniePrzedemerytalne(D({ plec: 'k', urodzenie: '1968-02-29', przyczyna: 'renta', data: '2024-02-28', staz: 22 }))).toMatchObject({ stan: 'spelnia', spelnione: ['pkt 4'], koniec: '2028-02-29' });
    expect(swiadczeniePrzedemerytalne(D({ plec: 'k', urodzenie: '1968-02-29', przyczyna: 'renta', data: '2023-02-27', staz: 22 })).stan).toBe('brak');
  });

  it('opiekun (pkt 4a), upadłość firmy (pkt 3), po 65. urodzinach nie przysługuje', () => {
    expect(swiadczeniePrzedemerytalne(D({ plec: 'k', urodzenie: '1969-01-10', przyczyna: 'opiekun', data: '2026-01-10', staz: 20 })).spelnione).toEqual(['pkt 4a']);
    expect(swiadczeniePrzedemerytalne(D({ urodzenie: '1964-01-10', przyczyna: 'firma', data: '2025-12-31', staz: 25 })).spelnione).toEqual(['pkt 3']);
    expect(swiadczeniePrzedemerytalne(D({ urodzenie: '1960-05-01', data: '2026-01-10', staz: 30 })).stan).toBe('wiek-emerytalny');
  });

  it('kwoty przychodu od 1 marca (M.P. 2025 poz. 142, M.P. 2026 poz. 208)', () => {
    expect(kwotyNaDzien('2026-02-28')).toMatchObject({ dopuszczalna: 2045.5, graniczna: 5727.2 });
    expect(kwotyNaDzien('2026-11-13')).toMatchObject({ dopuszczalna: 2225.9, graniczna: 6232.5 });
  });

  it('błędne dane', () => {
    expect(() => swiadczeniePrzedemerytalne(D({ staz: -1 }))).toThrow(RangeError);
    expect(() => swiadczeniePrzedemerytalne(D({ data: '1960-01-01' }))).toThrow(RangeError);
  });

  it('teksty wyniku', () => {
    const o = opisPrzedemerytalnego(D({}), '2026-11-13');
    expect(o).toMatchObject({ stan: 'Spełniasz warunki', podstawa: 'art. 2 ust. 1 pkt 1', koniec: '15 czerwca 2030 r.', przychod: 'bez zmniejszenia do 2225,90 zł, zawieszenie powyżej 6232,50 zł' });
    expect(opisPrzedemerytalnego(D({ data: '2026-06-14', staz: 24 }), '2026-11-13').opis).toBe(
      'pkt 1: brakuje wieku 61 lat w dniu rozwiązania (osiągasz go 15 czerwca 2026 r.) i 1 roku stażu; pkt 2: brakuje 11 lat stażu; pkt 5: brakuje 16 lat stażu',
    );
    expect(opisPrzedemerytalnego(D({ urodzenie: '1980-01-01', data: '2026-03-31', staz: 39.2 }), '2026-11-13').opis).toBe('wystarczy 39 lat okresu uprawniającego do emerytury do 31 grudnia 2025 r. (art. 2 ust. 1 pkt 6)');
    expect(opisPrzedemerytalnego(D({ okres: false }), '2026-11-13').opis).toBe('brakuje warunku: co najmniej 6 miesięcy pracy u tego pracodawcy');
  });
});
