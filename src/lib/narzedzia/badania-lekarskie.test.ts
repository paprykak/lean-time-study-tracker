import { describe, expect, it } from 'vitest';
import {
  badaniaWstepne,
  badanieKontrolne,
  odwolanie,
  przypomnienie,
  tekstKontrolnego,
  tekstOdwolania,
  tekstWstepnych,
  type DaneWstepnych,
} from './badania-lekarskie';

// Wartości sprawdzone niezależnie w Pythonie (datetime, własny kalendarz świąt):
// scratchpad/python/badania-lekarskie-w-pracy.py

describe('badanie kontrolne po zwolnieniu (art. 229 § 2 Kp)', () => {
  const k = (lista: [string, string][], powod: 'choroba' | 'ciaza' | 'wypadek' | 'opieka' = 'choroba', dp: 'auto' | 'tak' | 'nie' = 'auto') =>
    badanieKontrolne(
      lista.map(([od, do_]) => ({ od, do: do_ })),
      powod,
      dp,
    );

  it('granica progu: 30 dni nie wymaga badania, 31 dni wymaga (powrót 1 lutego)', () => {
    expect(k([['2026-01-01', '2026-01-30']])).toMatchObject({ wynik: 'niewymagane', dniOstatniej: 30, powrot: '2026-01-31' });
    expect(k([['2026-01-01', '2026-01-31']])).toMatchObject({ wynik: 'potrzebne', dniOstatniej: 31, powrot: '2026-02-01' });
  });
  it('rok przestępny: 1.02–1.03.2024 to 30 dni, do 2.03 już 31', () => {
    expect(k([['2024-02-01', '2024-03-01']])).toMatchObject({ wynik: 'niewymagane', dniOstatniej: 30 });
    expect(k([['2024-02-01', '2024-03-02']])).toMatchObject({ wynik: 'potrzebne', dniOstatniej: 31, powrot: '2024-03-03' });
  });
  it('koniec roku: 15.12.2026–14.01.2027 to 31 dni', () => {
    expect(k([['2026-12-15', '2027-01-14']])).toMatchObject({ wynik: 'potrzebne', dniOstatniej: 31, powrot: '2027-01-15' });
  });
  it('zwolnienia stykające się i nachodzące to jedna niezdolność', () => {
    expect(k([['2026-03-02', '2026-03-15'], ['2026-03-16', '2026-04-01']])).toMatchObject({ wynik: 'potrzebne', dniOstatniej: 31, powrot: '2026-04-02' });
    expect(k([['2026-03-01', '2026-03-20'], ['2026-03-15', '2026-03-31']])).toMatchObject({ wynik: 'potrzebne', dniOstatniej: 31 });
  });
  it('przerwa tylko w weekend: 19 + 12 dni, razem z przerwą 33, przepis nie rozstrzyga', () => {
    const r = k([['2026-11-02', '2026-11-20'], ['2026-11-23', '2026-12-04']]);
    expect(r).toMatchObject({ wynik: 'nierozstrzygniete', dniOstatniej: 12, dniZwolnien: 31, dniLacznie: 33, zwolnienWLancuchu: 2, odLancucha: '2026-11-02', przerwa: true, powrot: '2026-12-05' });
    expect(tekstKontrolnego(r, 'choroba').wynik).toBe('przepis tego nie rozstrzyga');
    // „Był dzień pracy z grafiku” rozdziela zwolnienia.
    expect(k([['2026-11-02', '2026-11-20'], ['2026-11-23', '2026-12-04']], 'choroba', 'tak')).toMatchObject({ wynik: 'niewymagane', dniLacznie: 12 });
  });
  it('w przerwie poniedziałek roboczy: liczymy osobno 11 dni; „nie było dnia pracy” łączy', () => {
    expect(k([['2026-11-02', '2026-11-20'], ['2026-11-24', '2026-12-04']])).toMatchObject({ wynik: 'niewymagane', dniOstatniej: 11, zwolnienWLancuchu: 1 });
    expect(k([['2026-11-02', '2026-11-20'], ['2026-11-24', '2026-12-04']], 'choroba', 'nie')).toMatchObject({ wynik: 'nierozstrzygniete', dniZwolnien: 30, dniLacznie: 33 });
  });
  it('przerwa w święta (25–27.12.2026): 18 + 12 = 30 dni zwolnień, 33 łącznie, nie rozstrzyga', () => {
    expect(k([['2026-12-07', '2026-12-24'], ['2026-12-28', '2027-01-08']])).toMatchObject({ wynik: 'nierozstrzygniete', dniZwolnien: 30, dniLacznie: 33, powrot: '2027-01-09' });
  });
  it('jeden dzień zwolnienia; opieka nad kimś nie dotyczy; ciąża i wypadek jak choroba', () => {
    expect(k([['2026-06-01', '2026-06-01']])).toMatchObject({ wynik: 'niewymagane', dniOstatniej: 1, powrot: '2026-06-02' });
    expect(k([['2026-01-01', '2026-02-28']], 'opieka').wynik).toBe('nie-dotyczy');
    const c = k([['2026-01-01', '2026-01-31']], 'ciaza');
    expect(c.wynik).toBe('potrzebne');
    expect(tekstKontrolnego(c, 'ciaza').opis).toContain('zwolnienie w ciąży liczymy tak samo');
    expect(tekstKontrolnego(c, 'choroba').opis).toContain('31 dni');
  });
  it('błędne dane: koniec przed początkiem, brak zwolnień, zła data', () => {
    expect(() => k([['2026-05-10', '2026-05-01']])).toThrow(RangeError);
    expect(() => k([])).toThrow(RangeError);
    expect(() => k([['2026-02-30', '2026-03-05']])).toThrow(RangeError);
  });
});

describe('badania wstępne (art. 229 § 1–1³ i art. 201 § 1 Kp)', () => {
  const B1: DaneWstepnych = {
    rodzaj: 'nowy',
    koniec: '2026-10-31',
    start: '2026-11-30',
    orzeczenie: 'data',
    nastepne: '2027-05-01',
    warunki: 'tak',
    szczegolnieNiebezpieczne: 'nie',
    mlodociany: false,
  };
  it('nowy pracodawca: 30. dzień po końcu umowy jeszcze warunkowo, 31. już badania', () => {
    expect(badaniaWstepne(B1)).toMatchObject({ wynik: 'warunkowe', ostatniDzien: '2026-11-30' });
    expect(badaniaWstepne({ ...B1, start: '2026-12-01' })).toMatchObject({ wynik: 'potrzebne', ostatniDzien: '2026-11-30' });
    expect(tekstWstepnych(badaniaWstepne(B1), 'nowy').opis).toContain('art. 229 § 1³');
  });
  it('koniec roku i rok przestępny: ostatni dzień 30.01.2027 i 15.03.2028', () => {
    expect(badaniaWstepne({ ...B1, koniec: '2026-12-31', start: '2027-01-30' }).ostatniDzien).toBe('2027-01-30');
    expect(badaniaWstepne({ ...B1, koniec: '2026-12-31', start: '2027-01-30' }).wynik).toBe('warunkowe');
    expect(badaniaWstepne({ ...B1, koniec: '2028-02-14', start: '2028-03-15', nastepne: '2029-01-01' })).toMatchObject({ wynik: 'warunkowe', ostatniDzien: '2028-03-15' });
  });
  it('prace szczególnie niebezpieczne „nie wiem”, warunki inne, brak orzeczenia: badania', () => {
    expect(badaniaWstepne({ ...B1, szczegolnieNiebezpieczne: 'nie-wiem' }).wynik).toBe('potrzebne');
    expect(badaniaWstepne({ ...B1, szczegolnieNiebezpieczne: 'tak' }).wynik).toBe('potrzebne');
    expect(badaniaWstepne({ ...B1, warunki: 'nie' }).wynik).toBe('potrzebne');
    expect(badaniaWstepne({ ...B1, orzeczenie: 'brak' }).wynik).toBe('potrzebne');
    expect(badaniaWstepne({ ...B1, warunki: 'nie-wiem' }).wynik).toBe('warunkowe');
  });
  it('aktualność: data badania równa startowi to orzeczenie nieaktualne, dzień później aktualne', () => {
    expect(badaniaWstepne({ ...B1, nastepne: '2026-11-30' }).wynik).toBe('potrzebne');
    expect(badaniaWstepne({ ...B1, nastepne: '2026-12-01' }).wynik).toBe('warunkowe');
  });
  it('ten sam pracodawca: zwolnienie, a przy nieaktualnym orzeczeniu badanie przed pracą', () => {
    const B8: DaneWstepnych = { ...B1, rodzaj: 'ten-sam', start: '2026-11-15', nastepne: '2027-01-01' };
    expect(badaniaWstepne(B8).wynik).toBe('zwolnienie');
    expect(badaniaWstepne({ ...B8, nastepne: '2026-11-10' }).wynik).toBe('badanie-przed-praca');
    expect(badaniaWstepne({ ...B8, warunki: 'nie' }).wynik).toBe('potrzebne');
    expect(badaniaWstepne({ ...B8, warunki: 'nie-wiem' }).wynik).toBe('warunkowe');
    // Prace szczególnie niebezpieczne wyłączają tylko pkt 2 (inny pracodawca).
    expect(badaniaWstepne({ ...B8, szczegolnieNiebezpieczne: 'tak' }).wynik).toBe('zwolnienie');
  });
  it('drugi etat: bez warunku 30 dni', () => {
    expect(badaniaWstepne({ ...B1, rodzaj: 'drugi-etat', koniec: null, nastepne: '2027-03-01' })).toMatchObject({ wynik: 'warunkowe', ostatniDzien: null });
  });
  it('zmiana stanowiska: dorosły bez czynników bez badań, młodociany zawsze; młodociany w nowej pracy zawsze', () => {
    const zm: DaneWstepnych = { ...B1, rodzaj: 'zmiana-stanowiska', koniec: null, start: null, warunki: 'nie' };
    expect(badaniaWstepne(zm).wynik).toBe('niewymagane');
    expect(badaniaWstepne({ ...zm, warunki: 'tak' }).wynik).toBe('potrzebne');
    expect(badaniaWstepne({ ...zm, warunki: 'nie-wiem' }).wynik).toBe('potrzebne');
    expect(badaniaWstepne({ ...zm, mlodociany: true }).wynik).toBe('potrzebne');
    expect(badaniaWstepne({ ...B1, mlodociany: true }).wynik).toBe('potrzebne');
  });
  it('błędne dane: start w dniu końca umowy, brak dat, zła data badania', () => {
    expect(() => badaniaWstepne({ ...B1, start: '2026-10-31' })).toThrow(RangeError);
    expect(() => badaniaWstepne({ ...B1, koniec: null })).toThrow(RangeError);
    expect(() => badaniaWstepne({ ...B1, start: null })).toThrow(RangeError);
    expect(() => badaniaWstepne({ ...B1, nastepne: '2027-02-29' })).toThrow(RangeError);
  });
});

describe('odwołanie od orzeczenia (§ 5 ust. 3 rozporządzenia) i następne badanie', () => {
  it('7 dni od dnia po otrzymaniu, bez przesunięcia', () => {
    expect(odwolanie('2026-11-12', '2026-11-12')).toEqual({ ostatniDzien: '2026-11-19', wolny: null, dniDo: 7 });
    expect(odwolanie('2026-12-24', '2026-12-24').ostatniDzien).toBe('2026-12-31');
    expect(odwolanie('2028-02-25', '2028-02-25').ostatniDzien).toBe('2028-03-03');
  });
  it('termin w święto, sobotę i święto w sobotę: ostrzeżenie, data ta sama', () => {
    const swieto = odwolanie('2026-11-04', '2026-11-04');
    expect(swieto).toMatchObject({ ostatniDzien: '2026-11-11', wolny: { rodzaj: 'swieto', nazwa: 'Narodowe Święto Niepodległości' } });
    expect(tekstOdwolania(swieto).opis).toContain('art. 115 Kodeksu cywilnego');
    expect(odwolanie('2026-11-07', '2026-11-07')).toMatchObject({ ostatniDzien: '2026-11-14', wolny: { rodzaj: 'sobota' } });
    expect(odwolanie('2026-12-19', '2026-12-19')).toMatchObject({ ostatniDzien: '2026-12-26', wolny: { rodzaj: 'swieto' } });
  });
  it('status terminu: zostało, ostatni dzień, minął', () => {
    expect(tekstOdwolania(odwolanie('2026-11-12', '2026-11-12')).status).toEqual({ tekst: 'Zostało: 7 dni', rodzaj: 'w-terminie' });
    expect(tekstOdwolania(odwolanie('2026-11-12', '2026-11-18')).status?.tekst).toBe('Zostało: 1 dzień');
    expect(tekstOdwolania(odwolanie('2026-11-12', '2026-11-19')).status?.tekst).toBe('Ostatni dzień: dziś');
    expect(tekstOdwolania(odwolanie('2026-11-12', '2026-11-22')).status).toEqual({ tekst: 'Termin minął 3 dni temu', rodzaj: 'po-terminie' });
  });
  it('przypomnienie: 181 dni do badania, wydarzenia 12.04 i 12.05.2027; termin minął bez wydarzeń', () => {
    const p = przypomnienie('2027-05-12', '2026-11-12');
    expect(p.dniDo).toBe(181);
    expect(p.status).toBe('w-terminie');
    expect(p.wydarzenia.map((w) => w.data)).toEqual(['2027-04-12', '2027-05-12']);
    expect(przypomnienie('2026-11-01', '2026-11-12')).toMatchObject({ dniDo: -11, status: 'po-terminie', wydarzenia: [] });
    expect(przypomnienie('2026-12-01', '2026-11-12').wydarzenia.map((w) => w.data)).toEqual(['2026-12-01']);
  });
  it('błędne dane: zła data', () => {
    expect(() => odwolanie('2026-13-01', '2026-11-12')).toThrow(RangeError);
    expect(() => przypomnienie('', '2026-11-12')).toThrow(RangeError);
  });
});
