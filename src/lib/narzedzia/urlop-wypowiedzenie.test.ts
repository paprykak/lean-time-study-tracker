import { describe, expect, it } from 'vitest';
import { BladDanych, etykietaWykorzystanych, koniecMiesiaca, miesiaceKalendarzowe, proporcjonalny, teksty, urlopWWypowiedzeniu } from './urlop-wypowiedzenie';

// Wartości sprawdzone niezależnie w Pythonie (datetime, fractions, własna lista świąt).
const baza = { wymiar: 26, wykorzystane: 0, zalegly: 0 };

describe('urlop proporcjonalny w roku ustania (art. 155^1, 155^2a, 155^3 Kp)', () => {
  it('cały rok: 26 dni; grudzień od 1.12 ma 21 dni pracy, więc 5 dni ekwiwalentu', () => {
    expect(urlopWWypowiedzeniu({ ...baza, koniecUmowy: '2026-12-31', urlopOd: '2026-12-01' })).toMatchObject({
      miesiace: 12,
      proporcjonalny: 26,
      biezacy: 26,
      dniPracy: 21,
      wWypowiedzeniu: 21,
      ekwiwalent: 5,
      swieta: ['2026-12-24', '2026-12-25'],
      swietaWSoboty: ['2026-12-26'],
    });
  });
  it('koniec 15 marca: 3 miesiące, ceil(6,5) = 7; koniec 31 stycznia: ceil(26/12) = 3', () => {
    expect(urlopWWypowiedzeniu({ ...baza, koniecUmowy: '2026-03-15', urlopOd: '2026-03-02' })).toMatchObject({ miesiace: 3, proporcjonalny: 7, dniPracy: 10, ekwiwalent: 0 });
    expect(urlopWWypowiedzeniu({ ...baza, koniecUmowy: '2026-01-31', urlopOd: '2026-01-02' })).toMatchObject({ miesiace: 1, proporcjonalny: 3, dniPracy: 20 });
  });
  it('początek pracy 20 maja, koniec 10 sierpnia: 4 rozpoczęte miesiące, 9 dni', () => {
    expect(urlopWWypowiedzeniu({ ...baza, koniecUmowy: '2026-08-10', urlopOd: '2026-07-20', poczatekPracy: '2026-05-20' })).toMatchObject({
      poczatek: '2026-05-20',
      miesiace: 4,
      proporcjonalny: 9,
      dniPracy: 16,
      wWypowiedzeniu: 9,
    });
  });
  it('początek pracy w poprzednim roku liczy się od 1 stycznia', () => {
    expect(urlopWWypowiedzeniu({ ...baza, koniecUmowy: '2026-03-15', urlopOd: '2026-03-02', poczatekPracy: '2024-06-01' })).toMatchObject({ poczatek: '2026-01-01', miesiace: 3, proporcjonalny: 7 });
  });
  it('29 lutego 2028 r.: 2 miesiące, wymiar 20 → 4 dni; pół etatu 13 dni, 1 miesiąc → 2 dni', () => {
    expect(urlopWWypowiedzeniu({ ...baza, wymiar: 20, koniecUmowy: '2028-02-29', urlopOd: '2028-02-01' })).toMatchObject({ miesiace: 2, proporcjonalny: 4, dniPracy: 21 });
    expect(proporcjonalny(13, 1)).toBe(2);
    expect(proporcjonalny(20, 6)).toBe(10);
    expect(proporcjonalny(26, 12)).toBe(26);
  });
  it('miesiące kalendarzowe i koniec miesiąca', () => {
    expect(miesiaceKalendarzowe('2026-01-31', '2026-02-01')).toBe(2);
    expect(miesiaceKalendarzowe('2026-05-20', '2026-08-10')).toBe(4);
    expect(koniecMiesiaca('2028-02-10')).toBe('2028-02-29');
    expect(koniecMiesiaca('2026-12-05')).toBe('2026-12-31');
  });
});

describe('dni pracy w wypowiedzeniu i ekwiwalent (art. 167^1, 171 § 1 Kp)', () => {
  const listopad = { ...baza, koniecUmowy: '2026-11-30', urlopOd: '2026-11-02', wykorzystane: 2, zalegly: 6 };
  it('listopad bez 11.11: 20 dni pracy, 22 + 6 dni urlopu, ekwiwalent za 8', () => {
    expect(urlopWWypowiedzeniu(listopad)).toMatchObject({
      miesiace: 11,
      proporcjonalny: 24,
      biezacy: 22,
      razem: 28,
      dniPracy: 20,
      swieta: ['2026-11-11'],
      wWypowiedzeniu: 20,
      ekwiwalent: 8,
    });
  });
  it('soboty jako dni pracy: 24 dni; grafik 10 dni nadpisuje wyliczenie', () => {
    expect(urlopWWypowiedzeniu({ ...listopad, soboty: true })).toMatchObject({ dniPracy: 24, ekwiwalent: 4, swietaWSoboty: [] });
    expect(teksty(urlopWWypowiedzeniu({ ...listopad, soboty: true })).uwaga).toContain('dniówka bywa krótsza');
    expect(urlopWWypowiedzeniu({ ...listopad, dniPracy: 10 })).toMatchObject({ dniPracy: 10, zGrafiku: true, wWypowiedzeniu: 10, ekwiwalent: 18 });
    expect(urlopWWypowiedzeniu({ ...listopad, dniPracy: 0 })).toMatchObject({ wWypowiedzeniu: 0, ekwiwalent: 28 });
  });
  it('przełom roku: od 14.12.2026 do 15.01.2027, 21 dni pracy (9 w 2027 r.), urlop za 2027 r. 3 dni + 10 zaległego', () => {
    expect(urlopWWypowiedzeniu({ ...baza, koniecUmowy: '2027-01-15', urlopOd: '2026-12-14', zalegly: 10 })).toMatchObject({
      rok: 2027,
      miesiace: 1,
      proporcjonalny: 3,
      razem: 13,
      dniPracy: 21,
      dniPracyWRoku: 9,
      swieta: ['2026-12-24', '2026-12-25', '2027-01-01', '2027-01-06'],
      swietaWSoboty: ['2026-12-26'],
      wWypowiedzeniu: 13,
      ekwiwalent: 0,
      innyRok: true,
    });
  });
  it('wykorzystane ponad proporcję: koniec 30 kwietnia, 9 dni z proporcji, 20 wykorzystanych → nadwyżka 11', () => {
    expect(urlopWWypowiedzeniu({ ...baza, koniecUmowy: '2026-04-30', urlopOd: '2026-04-01', wykorzystane: 20, zalegly: 2 })).toMatchObject({
      proporcjonalny: 9,
      biezacy: 0,
      nadwyzka: 11,
      razem: 2,
      wWypowiedzeniu: 2,
      ekwiwalent: 0,
    });
  });
  it('wartości graniczne: wykorzystane równe proporcji, jeden dzień w święto 11 listopada', () => {
    expect(urlopWWypowiedzeniu({ ...baza, wymiar: 20, wykorzystane: 10, koniecUmowy: '2026-06-30', urlopOd: '2026-06-01' })).toMatchObject({ proporcjonalny: 10, biezacy: 0, nadwyzka: 0 });
    expect(urlopWWypowiedzeniu({ ...baza, koniecUmowy: '2026-11-11', urlopOd: '2026-11-11' })).toMatchObject({ proporcjonalny: 24, dniPracy: 0, ekwiwalent: 24 });
  });
  it('błędne dane: RangeError', () => {
    const ok = { ...baza, koniecUmowy: '2026-11-30', urlopOd: '2026-11-02' };
    expect(() => urlopWWypowiedzeniu({ ...ok, koniecUmowy: '2026-11-01' })).toThrow(RangeError);
    expect(() => urlopWWypowiedzeniu({ ...ok, koniecUmowy: '2026-02-30' })).toThrow(RangeError);
    expect(() => urlopWWypowiedzeniu({ ...ok, koniecUmowy: '2027-12-31' })).toThrow(RangeError);
    expect(() => urlopWWypowiedzeniu({ ...ok, poczatekPracy: '2026-11-10' })).toThrow(RangeError);
    expect(() => urlopWWypowiedzeniu({ ...ok, wymiar: 27 })).toThrow(RangeError);
    expect(() => urlopWWypowiedzeniu({ ...ok, wymiar: 0 })).toThrow(RangeError);
    expect(() => urlopWWypowiedzeniu({ ...ok, wykorzystane: 27 })).toThrow(RangeError);
    expect(() => urlopWWypowiedzeniu({ ...ok, wykorzystane: 1.5 })).toThrow(RangeError);
    expect(() => urlopWWypowiedzeniu({ ...ok, zalegly: -1 })).toThrow(RangeError);
    expect(() => urlopWWypowiedzeniu({ ...ok, dniPracy: 30 })).toThrow(RangeError);
    expect(() => urlopWWypowiedzeniu({ ...ok, wykorzystane: 1.5 })).toThrow(BladDanych);
    try {
      urlopWWypowiedzeniu({ ...ok, zalegly: -1 });
    } catch (e) {
      expect((e as BladDanych).pole).toBe('zalegly');
    }
  });
  it('teksty wyniku: odmiana, święta, nadwyżka', () => {
    const t = teksty(urlopWWypowiedzeniu(listopad));
    expect(t.wwyp).toBe('20 dni');
    expect(t.opis).toBe('Za co najmniej 8 dni urlopu należy się ekwiwalent');
    expect(t.dniPracy).toBe('20 dni od 2 listopada 2026 r., bez 1 święta');
    expect(t.proporcjonalny).toBe('24 dni (11/12 z 26 dni, od 1 stycznia 2026 r.)');
    expect(teksty(urlopWWypowiedzeniu({ ...baza, koniecUmowy: '2026-04-30', urlopOd: '2026-04-01', wykorzystane: 20 })).uwaga).toContain('ponad proporcję: 11 dni');
    expect(teksty(urlopWWypowiedzeniu({ ...baza, koniecUmowy: '2026-12-31', urlopOd: '2026-12-01' })).uwaga).toContain('26 grudnia 2026 r.');
    expect(teksty(urlopWWypowiedzeniu({ ...listopad, wykorzystane: 24, zalegly: 0 })).opis).toBe('Nie zostało urlopu do wykorzystania');
  });
  it('przełom roku: urlopu za 2027 r. nie da się udzielić przed 1 stycznia (koniec 5.01.2027: 2 dni pracy w 2027 r.)', () => {
    const p = { ...baza, koniecUmowy: '2027-01-05', urlopOd: '2026-12-14' };
    expect(urlopWWypowiedzeniu(p)).toMatchObject({ proporcjonalny: 3, dniPracy: 14, dniPracyWRoku: 2, udzielonyBiezacy: 2, wWypowiedzeniu: 2, ekwiwalent: 1 });
    expect(urlopWWypowiedzeniu({ ...p, zalegly: 10 })).toMatchObject({ razem: 13, udzielonyZalegly: 10, wWypowiedzeniu: 12, ekwiwalent: 1 });
    expect(urlopWWypowiedzeniu({ ...baza, koniecUmowy: '2027-01-15', urlopOd: '2026-12-14', zalegly: 10, dniPracy: 15 })).toMatchObject({ dniPracyWRoku: 9, wWypowiedzeniu: 13 });
    const t = teksty(urlopWWypowiedzeniu(p));
    expect(t.uwaga).toContain('Pozostały urlop za 2026 r. wpisz w polu zaległy');
    expect(t.uwaga).toContain('2 dni pracy');
    expect(t.dniPracy).toBe('14 dni od 14 grudnia 2026 r., bez 3 świąt');
  });
  it('przełom 2027/2028: Wigilia w piątek, 1.01.2028 w sobotę, Trzech Króli w czwartek (od 20.12.2027 do 14.01.2028)', () => {
    // Niezależnie: dni pon.–pt. 20–23.12 (4, bez 24.12), 27–31.12 (5), 3–7.01 (4, bez 6.01), 10–14.01 (5) = 18; w 2028 r. 9.
    const r = urlopWWypowiedzeniu({ ...baza, wymiar: 26, wykorzystane: 0, zalegly: 10, koniecUmowy: '2028-01-14', urlopOd: '2027-12-20' });
    expect(r).toMatchObject({ rok: 2028, miesiace: 1, proporcjonalny: 3, razem: 13, dniPracy: 18, dniPracyWRoku: 9, wWypowiedzeniu: 13, ekwiwalent: 0 });
    expect(r.swieta).toEqual(['2027-12-24', '2028-01-06']);
    expect(r.swietaWSoboty).toEqual(['2027-12-25', '2028-01-01']);
  });
  it('święto w sobotę przy pon.–pt. nie jest „odjęte”: sierpień 2026 (15.08 to sobota)', () => {
    const r = urlopWWypowiedzeniu({ ...baza, koniecUmowy: '2026-08-31', urlopOd: '2026-08-03' });
    expect(r).toMatchObject({ miesiace: 8, proporcjonalny: 18, dniPracy: 21, swieta: [], swietaWSoboty: ['2026-08-15'] });
    expect(teksty(r).dniPracy).toBe('21 dni od 3 sierpnia 2026 r.');
    expect(teksty(r).uwaga).toContain('o jeden mniej');
  });
  it('grafik w tym samym roku nadpisuje kalendarz także powyżej wyliczenia: 25 dni', () => {
    expect(urlopWWypowiedzeniu({ ...listopad, dniPracy: 25 })).toMatchObject({ wWypowiedzeniu: 25, ekwiwalent: 3 });
  });
  it('ekwiwalent 0 i etykieta wykorzystanych', () => {
    expect(teksty(urlopWWypowiedzeniu({ ...baza, koniecUmowy: '2026-03-15', urlopOd: '2026-03-02' })).ekwiwalent).toBe('0 dni, jeśli pracodawca udzieli całego urlopu');
    expect(etykietaWykorzystanych('2027-01-05')).toBe('Wykorzystane z urlopu za 2027 r.');
    expect(etykietaWykorzystanych('')).toBe('Wykorzystane z urlopu za rok końca umowy');
  });
});
