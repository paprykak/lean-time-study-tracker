import { describe, expect, it } from 'vitest';
import { koniecPrzedawnienia, opisPrzedawnienia, przedawnienie, uwagaListy, wyplatyDoDochodzenia } from './przedawnienie';
import { UWAGA_ART_115_LISTA } from './terminy';

const sp = (t: string) => t.replace(/\s/g, ' ');

// Oczekiwane daty z niezależnego rachunku w Pythonie (własny kalendarz świąt, art. 85 § 3, 3 lata z art. 291 § 1).
describe('przedawnienie roszczeń pracownika (art. 291 § 1 Kp)', () => {
  it('3 lata od dnia wymagalności, 29 lutego → 28 lutego', () => {
    expect(koniecPrzedawnienia('2023-11-10')).toBe('2026-11-10');
    expect(koniecPrzedawnienia('2024-02-29')).toBe('2027-02-28');
  });
  it('ostatni dzień terminu jeszcze w terminie, następny po terminie', () => {
    expect(przedawnienie('2023-11-10', '2026-11-10')).toMatchObject({ koniec: '2026-11-10', zostalo: 0, status: 'pilne' });
    expect(przedawnienie('2023-11-10', '2026-11-11').status).toBe('po-terminie');
    expect(przedawnienie('2024-01-10', '2026-11-12')).toMatchObject({ zostalo: 59, status: 'wkrotce' });
    expect(przedawnienie('2024-03-08', '2026-11-12').status).toBe('w-terminie');
  });
});

describe('wypłaty, o które można jeszcze wystąpić', () => {
  it('wypłata 10. dnia następnego miesiąca, 12 listopada 2026 r.: najstarsza za listopad 2023 r.', () => {
    const w = wyplatyDoDochodzenia('2026-11-12', 'nastepny', 10);
    expect(w.slice(0, 3)).toEqual([
      { za: '2023-11', wymagalna: '2023-12-08', koniec: '2026-12-08', art115: '2026-12-08', zostalo: 26, status: 'pilne' },
      // 10 stycznia 2027 r. to niedziela: według art. 115 KC poniedziałek 11 stycznia (raporty/terminy/art115.py).
      { za: '2023-12', wymagalna: '2024-01-10', koniec: '2027-01-10', art115: '2027-01-11', zostalo: 59, status: 'wkrotce' },
      { za: '2024-01', wymagalna: '2024-02-09', koniec: '2027-02-09', art115: '2027-02-09', zostalo: 89, status: 'wkrotce' },
    ]);
    expect(w).toHaveLength(36);
    expect(w.at(-1)).toMatchObject({ za: '2026-10', wymagalna: '2026-11-10', koniec: '2029-11-10' });
  });
  it('wypłata ostatniego dnia miesiąca', () => {
    const w = wyplatyDoDochodzenia('2026-11-12', 'ostatni', 0);
    expect(w[0]).toEqual({ za: '2023-11', wymagalna: '2023-11-30', koniec: '2026-11-30', art115: '2026-11-30', zostalo: 18, status: 'pilne' });
    expect(w[1]).toMatchObject({ za: '2023-12', wymagalna: '2023-12-29' });
    expect(w).toHaveLength(36);
  });
  it('dzień wypłaty w następnym miesiącu najpóźniej 10. (art. 85 § 2)', () => {
    expect(() => wyplatyDoDochodzenia('2026-11-12', 'nastepny', 15)).toThrow(RangeError);
    expect(() => wyplatyDoDochodzenia('2026-11-12', 'ten', 30)).toThrow(RangeError);
  });
});

describe('wypłata za grudzień cofnięta na grudzień (art. 85 § 3)', () => {
  it('31 grudnia 2017 r., wypłata 1. dnia następnego miesiąca: grudzień 2017 r. na końcu listy', () => {
    // 1.01.2018 to Nowy Rok, 31.12 i 30.12.2017 to weekend: wypłata 29.12.2017 (piątek), soboty wolne.
    const w = wyplatyDoDochodzenia('2017-12-31', 'nastepny', 1);
    expect(w.at(-1)).toMatchObject({ za: '2017-12', wymagalna: '2017-12-29' });
  });
});

describe('koniec przedawnienia w sobotę albo dzień wolny (art. 115 KC)', () => {
  // 14 listopada 2026 r. to sobota, według art. 115 KC poniedziałek 16 listopada.
  it('między datami roszczenie zostaje na liście jako pilne', () => {
    expect(przedawnienie('2023-11-14', '2026-11-15')).toMatchObject({ koniec: '2026-11-14', art115: '2026-11-16', zostalo: -1, status: 'pilne' });
    expect(przedawnienie('2023-11-14', '2026-11-17').status).toBe('po-terminie');
    // Wypłata 14. dnia w tym samym miesiącu: listopad 2023 r. jeszcze na liście 15 listopada 2026 r.
    expect(wyplatyDoDochodzenia('2026-11-15', 'ten', 14)[0]).toMatchObject({ za: '2023-11', koniec: '2026-11-14', art115: '2026-11-16', status: 'pilne' });
    expect(wyplatyDoDochodzenia('2026-11-17', 'ten', 14)[0].za).toBe('2023-12');
  });
  it('teksty: zdąż do, ostatni dzień według art. 115 KC, jedno zdanie i stan', () => {
    const p = przedawnienie('2023-11-14', '2026-11-10');
    const o = opisPrzedawnienia(p, '2026-11-10');
    expect(sp(o.opis)).toBe('Wypłata z 14 listopada 2023 r.: zdąż do 14 listopada 2026 r.; ostatni dzień według art. 115 KC: 16 listopada 2026 r.');
    expect(sp(o.zdanie)).toMatch(/^14 listopada 2026 r\. to sobota: .*\(art\. 115 Kodeksu cywilnego\)\. /);
    expect(o.status).toBe('Zostało: 4 dni');
    expect(sp(o.krotko)).toBe('14 listopada 2026 r. (według art. 115 KC: 16 listopada 2026 r.)');
    expect(sp(o.inna)).toBe('14 listopada 2026 r. (za 4 dni); według art. 115 KC: 16 listopada 2026 r. (to przesunięcie jest wątpliwe, zdąż do pierwszej daty)');
    expect(opisPrzedawnienia(p, '2026-11-15').status).toBe('Pierwsza data minęła, więc roszczenie jest prawdopodobnie przedawnione; tylko gdy sąd przesunie koniec według art. 115 KC, zostało: 1 dzień');
    expect(opisPrzedawnienia(p, '2026-11-16').status).toBe('Pierwsza data minęła, więc roszczenie jest prawdopodobnie przedawnione; tylko gdy sąd przesunie koniec według art. 115 KC, ostatni dzień to dziś');
    expect(opisPrzedawnienia(p, '2026-11-18').status).toBe('Termin minął 2 dni temu');
    expect(opisPrzedawnienia(p, '2026-11-13').status).toBe('Zostało: 1 dzień');
    const bez = opisPrzedawnienia(przedawnienie('2023-11-10', '2026-11-10'), '2026-11-10');
    expect(sp(bez.opis)).toBe('Wypłata z 10 listopada 2023 r. przedawnia się z końcem dnia 10 listopada 2026 r.');
    expect(bez.zdanie).toBe('');
    expect(bez.status).toBe('Ostatni dzień: dziś');
  });
});

// Audyt jakości 4 (raporty/jakosc4/C-wer.json): wartości z niezależnego rachunku w Pythonie (własny kalendarz świąt).
describe('audyt jakosc4: ostrzeżenie przy datach z art. 115 KC, stan „innej należności”, styczeń cofnięty na grudzień', () => {
  it('C-1: lista „Kolejne terminy” z datą według art. 115 KC ma ostrzeżenie', () => {
    const lista = wyplatyDoDochodzenia('2026-11-15', 'nastepny', 10).slice(1, 6);
    expect(lista.some((x) => x.za === '2023-12' && x.koniec === '2027-01-10' && x.art115 === '2027-01-11')).toBe(true);
    expect(uwagaListy(lista)).toBe(UWAGA_ART_115_LISTA);
    expect(uwagaListy([{ koniec: '2027-02-09', art115: '2027-02-09' }])).toBe('');
  });
  it('C-2: „inna należność” mówi, w jakiej fazie jest termin', () => {
    const inna = (wym: string, dzis: string) => sp(opisPrzedawnienia(przedawnienie(wym, dzis), dzis).inna);
    expect(inna('2023-11-14', '2026-11-15')).toBe('14 listopada 2026 r. (wczoraj). Pierwsza data minęła, więc roszczenie jest prawdopodobnie przedawnione; tylko gdy sąd przesunie koniec według art. 115 KC: 16 listopada 2026 r.');
    expect(inna('2020-01-15', '2026-11-15')).toBe('15 stycznia 2023 r. (1400 dni temu); po tym dniu pracodawca może powołać się na przedawnienie (art. 292)');
    expect(inna('2023-11-15', '2026-11-15')).toBe('15 listopada 2026 r. (dziś); według art. 115 KC: 16 listopada 2026 r. (to przesunięcie jest wątpliwe, zdąż do pierwszej daty)');
    expect(inna('2024-01-10', '2026-11-15')).toBe('10 stycznia 2027 r. (za 56 dni); według art. 115 KC: 11 stycznia 2027 r. (to przesunięcie jest wątpliwe, zdąż do pierwszej daty)');
  });
  it('C-4: wypłata 1. dnia „w tym samym miesiącu” za styczeń, cofnięta na grudzień, jest na liście', () => {
    const l = wyplatyDoDochodzenia('2019-12-31', 'ten', 1);
    expect(l).toHaveLength(36);
    expect(l.at(-1)).toMatchObject({ za: '2020-01', wymagalna: '2019-12-31', koniec: '2022-12-31', art115: '2023-01-02' });
    expect(wyplatyDoDochodzenia('2017-12-29', 'ten', 1).at(-1)).toMatchObject({ za: '2018-01', wymagalna: '2017-12-29', koniec: '2020-12-29' });
    expect(wyplatyDoDochodzenia('2019-12-30', 'ten', 1).some((x) => x.za === '2020-01')).toBe(false);
  });
});

// Linijka praktyczna pod „zdąż do” (pakiet „terminy3”, daty z raporty/terminy3/linijka.py).
describe('terminy3: koniec przedawnienia w dzień wolny', () => {
  const sp = (t: string) => t.replace(/\s/g, ' ');
  const p = (wymagalne: string) => przedawnienie(wymagalne, '2026-11-15');
  it('koniec w niedzielę 13 grudnia 2026 r.: można nadać pozew tego dnia, z ostrzeżeniem', () => {
    const o = opisPrzedawnienia(p('2023-12-13'), '2026-11-15');
    expect(sp(o.praktycznie)).toBe(
      'To niedziela. Tego dnia możesz jeszcze nadać pozew w placówce Poczty Polskiej (operatora wyznaczonego), jeśli jest czynna: nadanie jest równoznaczne z wniesieniem pozwu do sądu (art. 165 § 2 Kodeksu postępowania cywilnego). Zachowaj potwierdzenie nadania; list u kuriera tego skutku nie ma. Nie odkładaj pozwu na następny dzień roboczy: przy przedawnieniu przesunięcie z art. 115 Kodeksu cywilnego jest wątpliwe.',
    );
  });
  it('Wigilia 2026 r. i sobota przed 2017 r. też; dzień roboczy i dzień po terminie bez linijki', () => {
    expect(opisPrzedawnienia(p('2023-12-24'), '2026-11-15').praktycznie).toMatch(/^To dzień wolny od pracy \(Wigilia Bożego Narodzenia\)\. /);
    expect(opisPrzedawnienia(przedawnienie('2013-12-31', '2016-12-01'), '2016-12-01').praktycznie).toMatch(/^To sobota\. Tego dnia/);
    expect(opisPrzedawnienia(p('2023-12-11'), '2026-11-15').praktycznie).toBe('');
    expect(opisPrzedawnienia(p('2023-12-13'), '2026-12-13').praktycznie).not.toBe('');
    expect(opisPrzedawnienia(p('2023-12-13'), '2026-12-14').praktycznie).toBe('');
  });
});
