// Oczekiwane wartości policzone niezależnie skryptem w Pythonie (datetime, calendar): wiek w dniu urodzin, 29 lutego
// w roku nieprzestępnym 28 lutego, brakujące miesiące w górę, najwcześniejsza data = późniejsza z daty wieku i dziś +
// brakujące miesiące.
import { describe, expect, it } from 'vitest';
import { emeryturaPomostowa, lat, latBrak, opisPomostowej, wymagania, type DanePomostowej } from './emerytura-pomostowa';

const D = (z: Partial<DanePomostowej>): DanePomostowej => ({
  plec: 'm',
  urodzenie: '1966-05-20',
  rodzaj: 'ogolne',
  lataSzczegolne: 16,
  przed2009: 0,
  staz: 30,
  dzis: '2026-11-13',
  ...z,
});

describe('emerytura pomostowa (art. 4, 6–8, 16 i 49 ustawy o emeryturach pomostowych)', () => {
  it('wymagany wiek i okres pracy według rodzaju prac i płci', () => {
    expect(wymagania('ogolne', 'k')).toMatchObject({ wiek: 55, lataPracy: 15 });
    expect(wymagania('ogolne', 'm')).toMatchObject({ wiek: 60, lataPracy: 15 });
    expect(wymagania('hutnictwo', 'k')).toMatchObject({ wiek: 55, lataPracy: 15 });
    expect(wymagania('port', 'm')).toMatchObject({ wiek: 55, lataPracy: 15 });
    expect(wymagania('art8', 'k')).toMatchObject({ wiek: 50, lataPracy: 10 });
    expect(wymagania('art8', 'm')).toMatchObject({ wiek: 55, lataPracy: 10 });
  });

  it('mężczyzna z 16 latami i stażem 30 lat: spełnia od dnia 60. urodzin, nie dzień wcześniej', () => {
    expect(emeryturaPomostowa(D({}))).toMatchObject({ stan: 'spelnia', dataWieku: '2026-05-20', koniec: '2031-05-20' });
    expect(emeryturaPomostowa(D({ dzis: '2026-05-20' })).stan).toBe('spelnia');
    expect(emeryturaPomostowa(D({ dzis: '2026-05-19' }))).toMatchObject({ stan: 'wiek', najwczesniej: '2026-05-20' });
  });

  it('urodzona 29 lutego: wiek 55 lat 28 lutego w roku nieprzestępnym, koniec 29 lutego w przestępnym', () => {
    const r = emeryturaPomostowa(D({ plec: 'k', urodzenie: '1972-02-29', lataSzczegolne: 15, przed2009: 5, staz: 20 }));
    expect(r).toMatchObject({ stan: 'wiek', dataWieku: '2027-02-28', koniec: '2032-02-29' });
  });

  it('wartości graniczne: 14,5 roku pracy i 19 lat stażu → brakuje 6 i 12 miesięcy', () => {
    const r = emeryturaPomostowa(D({ plec: 'k', urodzenie: '1972-02-29', lataSzczegolne: 14.5, przed2009: 5, staz: 19 }));
    expect(r).toMatchObject({ stan: 'brak', brakPracy: 6, brakStazu: 12, najwczesniej: '2027-11-13', zaPozno: false });
    expect(emeryturaPomostowa(D({ lataSzczegolne: 15, staz: 25 })).stan).toBe('spelnia');
    expect(emeryturaPomostowa(D({ lataSzczegolne: 14.99 })).brakPracy).toBe(1);
    // 14,999 wyświetlamy jako 15 lat, więc i liczymy jako 15.
    expect(opisPomostowej(D({ lataSzczegolne: 14.999 }))).toMatchObject({ stan: 'Spełniasz warunki', praca: 'tak: 15 lat z wymaganych 15 lat' });
    expect(opisPomostowej(D({ lataSzczegolne: 14.99 }))).toMatchObject({ stan: 'Jeszcze nie', praca: 'nie: 14,99 roku z wymaganych 15 lat' });
  });

  it('hutnictwo: 55 lat także dla mężczyzn; art. 8: 10 lat pracy, 50 lat dla kobiet', () => {
    expect(emeryturaPomostowa(D({ urodzenie: '1970-03-10', rodzaj: 'hutnictwo', lataSzczegolne: 15, przed2009: 10, staz: 25 }))).toMatchObject({ stan: 'spelnia', dataWieku: '2025-03-10', koniec: '2035-03-10' });
    expect(emeryturaPomostowa(D({ plec: 'k', urodzenie: '1975-01-01', rodzaj: 'art8', lataSzczegolne: 9, staz: 18 }))).toMatchObject({ stan: 'brak', brakPracy: 12, brakStazu: 24, najwczesniej: '2028-11-13' });
  });

  it('art. 6–8 tylko z pracą z tych punktów: 5 z 15 lat w hucie → ogólne zasady (60 lat 10 marca 2030 r. wcześniej niż 10 lat dalszej pracy w hucie)', () => {
    const r = emeryturaPomostowa(D({ urodzenie: '1970-03-10', rodzaj: 'hutnictwo', lataSzczegolne: 15, lataRodzaju: 5, przed2009: 10, staz: 25 }));
    expect(r).toMatchObject({ stan: 'wiek', szczegolneZasady: false, dataWieku: '2030-03-10', wymagania: { wiek: 60 } });
    const o = opisPomostowej(D({ urodzenie: '1970-03-10', rodzaj: 'hutnictwo', lataSzczegolne: 15, lataRodzaju: 5, przed2009: 10, staz: 25 }));
    expect(o.uwagi[0]).toBe('Pracy w hutnictwie (zał. 1 pkt 4–12, art. 7) masz 5 lat z wymaganych 15 lat, więc liczymy według ogólnych zasad z art. 4.');
    expect(o.uwagi.join(' ')).not.toContain('lekarza medycyny pracy');
    expect(() => emeryturaPomostowa(D({ rodzaj: 'port', lataRodzaju: 17 }))).toThrow(RangeError);
    // Wiersz „Praca z wykazu” pokazuje okres z punktów art. 8, gdy liczymy według art. 8.
    expect(opisPomostowej(D({ plec: 'k', urodzenie: '1975-01-01', rodzaj: 'art8', lataSzczegolne: 12, lataRodzaju: 9, staz: 18 })).praca).toBe('nie: 9 lat z pkt 20, 22 albo 32 z wymaganych 10 lat');
    // Remis dat (oba warianty spełnione dziś): art. 4, bez orzeczenia lekarza z art. 7.
    const remis = emeryturaPomostowa(D({ urodzenie: '1965-01-01', rodzaj: 'hutnictwo', lataSzczegolne: 16, lataRodzaju: 16 }));
    expect(remis).toMatchObject({ stan: 'spelnia', szczegolneZasady: false });
    expect(opisPomostowej(D({ urodzenie: '1965-01-01', rodzaj: 'hutnictwo', lataSzczegolne: 16, lataRodzaju: 16 })).uwagi.join(' ')).not.toContain('lekarza medycyny pracy');
  });

  it('bez pracy po 2008 r.: wystarczy cały wymagany okres przed 2009 r. (art. 49)', () => {
    const r = emeryturaPomostowa(D({ urodzenie: '1962-12-01', lataSzczegolne: 17, przed2009: 17, staz: 40 }));
    expect(r).toMatchObject({ stan: 'spelnia', po2008: 0, rekompensata: true });
    expect(r.warunki.po2008).toBe(true);
    expect(opisPomostowej(D({ urodzenie: '1962-12-01', lataSzczegolne: 17, przed2009: 17, staz: 40 })).po2008).toBe('nie, ale wymagany okres prac z załączników przed 2009 r. (art. 49)');
  });

  it('po 65. urodzinach już nie przysługuje; urodzeni do 31 grudnia 1948 r. nigdy', () => {
    expect(emeryturaPomostowa(D({ urodzenie: '1961-01-01', lataSzczegolne: 20, przed2009: 10, staz: 40 }))).toMatchObject({ stan: 'po-wieku', koniec: '2026-01-01' });
    expect(emeryturaPomostowa(D({ urodzenie: '1948-12-31', lataSzczegolne: 20, przed2009: 10, staz: 40 })).stan).toBe('rocznik');
    // Rekompensata to dodatek do kapitału początkowego, którego urodzeni przed 1949 r. nie mają (art. 173 ustawy o FUS).
    expect(opisPomostowej(D({ urodzenie: '1948-12-31', lataSzczegolne: 20, przed2009: 16, staz: 40 })).uwagi.join(' ')).not.toContain('rekompensat');
  });

  it('brakujące 10 lat pracy zebrane dopiero po 65 latach: nie zdąży', () => {
    expect(emeryturaPomostowa(D({ urodzenie: '1964-01-01', lataSzczegolne: 5, staz: 30 }))).toMatchObject({ stan: 'brak', brakPracy: 120, najwczesniej: '2036-11-13', zaPozno: true });
    expect(opisPomostowej(D({ urodzenie: '1964-01-01', lataSzczegolne: 5, staz: 30 })).stan).toBe('Nie zdążysz');
    expect(emeryturaPomostowa(D({ plec: 'k', urodzenie: '1980-07-15', rodzaj: 'port', lataSzczegolne: 3, staz: 10 }))).toMatchObject({ najwczesniej: '2038-11-13', zaPozno: false });
  });

  it('błędne dane', () => {
    expect(() => emeryturaPomostowa(D({ staz: -1 }))).toThrow(RangeError);
    expect(() => emeryturaPomostowa(D({ przed2009: 17 }))).toThrow(RangeError);
    expect(() => emeryturaPomostowa(D({ urodzenie: '2027-01-01' }))).toThrow(RangeError);
  });

  it('teksty wyniku: odmiana lat, daty, uwagi o zawieszeniu i rekompensacie', () => {
    expect([lat(1), lat(2), lat(5), lat(22), lat(14.5)]).toEqual(['1 rok', '2 lata', '5 lat', '22 lata', '14,5 roku']);
    expect([latBrak(1), latBrak(2), latBrak(12), latBrak(0.5)]).toEqual(['1 roku', '2 lat', '12 lat', '0,5 roku']);
    const o = opisPomostowej(D({}));
    expect(o).toMatchObject({ stan: 'Spełniasz warunki', praca: 'tak: 16 lat z wymaganych 15 lat', staz: 'tak: 30 lat z wymaganych 25 lat', koniec: '20 maja 2031 r.' });
    expect(o.uwagi.join(' ')).toContain('art. 103a');
    const b = opisPomostowej(D({ plec: 'k', urodzenie: '1972-02-29', lataSzczegolne: 14.5, przed2009: 5, staz: 19 }));
    expect(b.opis).toBe('brakuje 6 miesięcy pracy w szczególnych warunkach i 1 roku stażu; przy dalszej pracy w szczególnych warunkach na pełen etat warunki spełnisz najwcześniej 13 listopada 2027 r.');
    expect(opisPomostowej(D({ lataSzczegolne: 16, przed2009: 15, staz: 20 })).uwagi.join(' ')).toContain('rekompensaty');
    expect(opisPomostowej(D({ urodzenie: '1969-05-20', rodzaj: 'hutnictwo' })).uwagi[0]).toContain('lekarza medycyny pracy');
  });
});
