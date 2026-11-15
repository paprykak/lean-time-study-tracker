// Oczekiwane wartości policzone niezależnie skryptami w Pythonie (zmieniajace.py, zmien2.py z wydłużeniem przy progu stażu) (datetime, własny kalendarz świąt), nie kodem z TS.
// Daty według art. 115 KC: raporty/terminy2/swieta.py (własny kalendarz świąt i reguła soboty od 2017 r.).
import { describe, expect, it } from 'vitest';
import { ODMOWA_ART_115, opisZmieniajacego, tekstProgu, ostatniDzienPrzedPolowa, wypowiedzenieZmieniajace } from './wypowiedzenie-zmieniajace';
import { ZDANIE_ART_115 } from './terminy';

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
      odwolanie: { zdazDo: '2026-12-03', wedlugArt115: '2026-12-03', rozne: false },
      odmowa: { zdazDo: '2027-01-05', wedlugArt115: '2027-01-05', rozne: false },
    });
    expect(wypowiedzenieZmieniajace('2020-01-15', '2026-11-12').okres.opis).toBe('3 miesiące');
  });
  it('staż 5 miesięcy: 2 tygodnie do soboty 28 listopada, odmowa do 20 listopada', () => {
    const w = wypowiedzenieZmieniajace('2026-06-01', '2026-11-12');
    expect(w.okres.opis).toBe('2 tygodnie');
    expect(w).toMatchObject({ koniec: '2026-11-28', poczatekPelnegoOkresu: '2026-11-15', odmowaDo: '2026-11-20', odmowaDoWariantB: '2026-11-21', dniA: 16, dniB: 14 });
  });
  it('granice stażu: 6 miesięcy daje miesiąc; próg w trakcie wypowiedzenia wydłuża okres, a odmowa liczy się od krótszego', () => {
    expect(wypowiedzenieZmieniajace('2026-05-12', '2026-11-12')).toMatchObject({ stazMiesiecy: 6, koniec: '2026-12-31', odmowaDo: '2026-12-06', odmowaDoWariantB: '2026-12-15' });
    expect(wypowiedzenieZmieniajace('2026-05-13', '2026-11-12')).toMatchObject({ stazMiesiecy: 5, koniec: '2026-12-31', odmowaDo: '2026-11-20', odmowaDoWariantB: '2026-11-21', dniA: 16, dniB: 14 });
    expect(wypowiedzenieZmieniajace('2026-05-13', '2026-11-12').prog).toMatchObject({ miesiace: 6, krotszy: '2 tygodnie', krotszyKoniec: '2026-11-28' });
    expect(wypowiedzenieZmieniajace('2023-11-13', '2026-11-12')).toMatchObject({ stazMiesiecy: 35, koniec: '2027-02-28', odmowaDo: '2026-12-06', odmowaDoWariantB: '2026-12-15', dniA: 49, dniB: 31 });
    expect(wypowiedzenieZmieniajace('2020-01-15', '2026-11-12').prog).toBeNull();
    expect(wypowiedzenieZmieniajace('2023-11-12', '2026-11-12')).toMatchObject({ stazMiesiecy: 36, koniec: '2027-02-28' });
  });
  it('próg stażu, wartości z niezależnego rachunku w Pythonie: doręczenie w sobotę i 3 lata przy końcu lutego', () => {
    const sobota = wypowiedzenieZmieniajace('2026-05-15', '2026-11-14');
    expect(sobota.prog).not.toBeNull();
    expect(sobota).toMatchObject({ odmowaDo: '2026-11-21', odmowaDoWariantB: '2026-11-21' });
    const luty = wypowiedzenieZmieniajace('2024-02-29', '2027-02-28');
    expect(luty.prog).toMatchObject({ miesiace: 36, krotszyKoniec: '2027-03-31' });
    expect(luty).toMatchObject({ koniec: '2027-05-31', odmowaDo: '2027-03-15', odmowaDoWariantB: '2027-03-15' });
  });
  it('próg stażu: oba warianty połowy (A i B) liczone od krótszego okresu, więc przed jego końcem (nierówności)', () => {
    for (const [od, dor] of [['2026-05-13', '2026-11-12'], ['2023-11-13', '2026-11-12'], ['2026-06-01', '2026-11-15']]) {
      const w = wypowiedzenieZmieniajace(od, dor);
      expect(w.prog).not.toBeNull();
      expect(w.odmowaDoWariantB <= w.prog!.krotszyKoniec).toBe(true);
      expect(w.odmowaDo <= w.odmowaDoWariantB).toBe(true);
    }
  });
  it('doręczenie w sobotę i w niedzielę: tygodnie od najbliższej niedzieli', () => {
    expect(wypowiedzenieZmieniajace('2026-06-01', '2026-11-14')).toMatchObject({ koniec: '2026-11-28', odmowaDo: '2026-11-21', odmowaDoWariantB: '2026-11-21', dniA: 14 });
    expect(wypowiedzenieZmieniajace('2026-06-01', '2026-11-15')).toMatchObject({ koniec: '2026-12-31', poczatekPelnegoOkresu: '2026-11-22', odmowaDo: '2026-11-25', odmowaDoWariantB: '2026-11-28', dniA: 20, dniB: 14 });
  });
  it('odwołanie: 21 dni od doręczenia; zdąż do Bożego Narodzenia, według art. 115 KC poniedziałek 28 grudnia', () => {
    const w = wypowiedzenieZmieniajace('2026-01-01', '2026-12-04');
    expect(w).toMatchObject({ koniec: '2027-01-31', odmowaDo: '2027-01-02', odmowaDoWariantB: '2027-01-15' });
    expect(w.odwolanie).toMatchObject({ zdazDo: '2026-12-25', wedlugArt115: '2026-12-28', rozne: true });
    expect(w.odwolanie.wolne.map((x) => x.data)).toEqual(['2026-12-25', '2026-12-26', '2026-12-27']);
    // Odmowa do soboty 2 stycznia 2027 r.: według art. 115 KC poniedziałek 4 stycznia (6 stycznia to dopiero środa).
    expect(w.odmowa).toMatchObject({ zdazDo: '2027-01-02', wedlugArt115: '2027-01-04', rozne: true });
  });
  it('odmowa w sobotę: z pouczeniem (połowa) i bez pouczenia (koniec okresu) dwie daty', () => {
    expect(wypowiedzenieZmieniajace('2026-06-01', '2026-11-14').odmowa).toMatchObject({ zdazDo: '2026-11-21', wedlugArt115: '2026-11-23' });
    expect(wypowiedzenieZmieniajace('2026-05-13', '2026-11-12', false).odmowa).toMatchObject({ zdazDo: '2026-11-28', wedlugArt115: '2026-11-30' });
    expect(wypowiedzenieZmieniajace('2023-11-13', '2026-11-12').odmowa).toMatchObject({ zdazDo: '2026-12-06', wedlugArt115: '2026-12-07' });
    expect(wypowiedzenieZmieniajace('2024-02-29', '2027-02-28').odmowa).toMatchObject({ zdazDo: '2027-03-15', rozne: false });
  });
  it('odwołanie: sobota przed 2017 r. bez przesunięcia, 12.11.2018 r. jednorazowo wolny, przełom roku (swieta.py)', () => {
    expect(wypowiedzenieZmieniajace('2010-01-01', '2015-12-12').odwolanie).toMatchObject({ zdazDo: '2016-01-02', rozne: false });
    expect(wypowiedzenieZmieniajace('2010-01-01', '2018-10-20').odwolanie).toMatchObject({ zdazDo: '2018-11-10', wedlugArt115: '2018-11-13' });
    expect(wypowiedzenieZmieniajace('2010-01-01', '2026-12-11').odwolanie).toMatchObject({ zdazDo: '2027-01-01', wedlugArt115: '2027-01-04' });
  });
  it('teksty wyniku: dwie daty odmowy i odwołania, własne zdanie przy odmowie, status w oknie między datami', () => {
    // Doręczenie w sobotę 14.11.2026: odmowa do soboty 21.11 (art. 115 KC: 23.11), odwołanie do soboty 5.12 (7.12).
    const r = wypowiedzenieZmieniajace('2026-06-01', '2026-11-14');
    const o = opisZmieniajacego(r, '2026-11-15');
    expect(o).toMatchObject({
      odmowaEtykieta: 'Odmowa: zdąż do',
      odmowa: '21 listopada 2026 r.',
      odmowaArt115: '23 listopada 2026 r.',
      status: 'Zostało 6 dni',
      statusKlasa: 'w-terminie',
      odwolanieEtykieta: 'Odwołanie do sądu pracy: zdąż do',
      odwolanieArt115Etykieta: 'Odwołanie: ostatni dzień według art. 115 KC',
      odwolanie: '5 grudnia 2026 r.',
      odwolanieArt115: '7 grudnia 2026 r.',
    });
    expect(o.odmowaZdanie).toMatch(/^21 listopada 2026 r\. to sobota: gdy koniec terminu wypada w sobotę/);
    expect(o.odmowaZdanie.endsWith(ODMOWA_ART_115)).toBe(true);
    expect(o.odmowaZdanie).not.toContain(ZDANIE_ART_115.pracodawca);
    expect(o.odwolanieZdanie).toMatch(/^5 grudnia 2026 r\. to sobota: .*IV P 24\/19/);
    expect(opisZmieniajacego(r, '2026-11-20')).toMatchObject({ status: 'Został 1 dzień', statusKlasa: 'wkrotce' });
    expect(opisZmieniajacego(r, '2026-11-21')).toMatchObject({ status: 'To dziś: odmowa musi dziś dotrzeć do pracodawcy', statusKlasa: 'wkrotce' });
    expect(opisZmieniajacego(r, '2026-11-22')).toMatchObject({ status: 'Pierwsza data minęła; ostatni dzień według art. 115 KC: 23 listopada 2026 r.', statusKlasa: 'pilne' });
    expect(opisZmieniajacego(r, '2026-11-23')).toMatchObject({ status: 'Pierwsza data minęła; ostatni dzień według art. 115 KC: dziś', statusKlasa: 'pilne' });
    expect(opisZmieniajacego(r, '2026-11-24')).toMatchObject({ status: 'Termin na odmowę minął', statusKlasa: 'po-terminie' });
  });
  it('wiersz o progu stażu: zgoda liczby (audyt A-1)', () => {
    expect(tekstProgu({ miesiace: 6, dzien: '2026-11-12', krotszy: '2 tygodnie', krotszyKoniec: '2026-11-28' })).toBe('6 miesięcy stażu mija 12 listopada 2026 r.; odmowę liczymy od krótszego okresu (2 tygodnie)');
    expect(tekstProgu({ miesiace: 36, dzien: '2026-11-19', krotszy: '1 miesiąc', krotszyKoniec: '2026-12-31' })).toBe('3 lata stażu mijają 19 listopada 2026 r.; odmowę liczymy od krótszego okresu (1 miesiąc)');
  });
  it('teksty wyniku bez przesunięcia: jedna data, bez zdań o art. 115 KC', () => {
    const o = opisZmieniajacego(wypowiedzenieZmieniajace('2020-01-15', '2026-11-12'), '2026-11-12');
    expect(o).toMatchObject({ odmowaEtykieta: 'Odmowę złóż najpóźniej', odmowa: '5 stycznia 2027 r.', odmowaArt115: null, odmowaZdanie: '', odwolanieEtykieta: 'Odwołanie do sądu pracy do', odwolanie: '3 grudnia 2026 r.', odwolanieArt115: null, odwolanieZdanie: '', status: 'Zostały 54 dni', wariantB: '14 stycznia 2027 r.' });
    expect(o.uwaga).toContain('Liczy się dzień, w którym odmowa dotrze do pracodawcy.');
    const bez = opisZmieniajacego(wypowiedzenieZmieniajace('2026-05-13', '2026-11-12', false), '2026-11-12');
    expect(bez).toMatchObject({ wariantB: 'nie dotyczy (bez pouczenia)', prog: '6 miesięcy stażu mija 12 listopada 2026 r.; odmowę liczymy od krótszego okresu (2 tygodnie)' });
    expect(bez.uwaga).toContain('I PKN 34/99');
  });
  it('rok przestępny: miesiąc do 29 lutego, połowa lutego (29 dni) do 14 lutego', () => {
    expect(wypowiedzenieZmieniajace('2027-06-01', '2028-01-20')).toMatchObject({ koniec: '2028-02-29', odmowaDo: '2028-02-09', odmowaDoWariantB: '2028-02-14', dniB: 29 });
    expect(wypowiedzenieZmieniajace('2027-06-01', '2028-01-20').odwolanie).toMatchObject({ zdazDo: '2028-02-10', rozne: false });
  });
  it('bez pouczenia: odmowa do końca okresu wypowiedzenia (art. 42 § 3 zdanie trzecie)', () => {
    expect(wypowiedzenieZmieniajace('2020-01-15', '2026-11-12', false).odmowaDo).toBe('2027-02-28');
    // Bez pouczenia przy progu stażu w trakcie wypowiedzenia: koniec krótszego okresu (wariant bezpieczny).
    // 2 tygodnie od czwartku 12.11.2026 kończą się w sobotę 28.11 (art. 30 § 2^1), miesiąc 31.12.
    expect(wypowiedzenieZmieniajace('2026-05-13', '2026-11-12', false)).toMatchObject({ odmowaDo: '2026-11-28', koniec: '2026-12-31' });
    // Próg 3 lat: krótszy okres 1 miesiąc (31.12.2026), dłuższy 3 miesiące (28.02.2027).
    expect(wypowiedzenieZmieniajace('2023-11-20', '2026-11-12', false)).toMatchObject({ odmowaDo: '2026-12-31', koniec: '2027-02-28' });
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
