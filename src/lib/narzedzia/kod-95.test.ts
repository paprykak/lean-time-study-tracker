import { describe, expect, it } from 'vitest';
import { czyPotrzebny, kod95, przykladStartowy, szkolenieNajpozniej } from './kod-95';

// Oczekiwane daty sprawdzone niezależnie w Pythonie (datetime, art. 112 KC, święta liczone od Wielkanocy,
// Wigilia wolna od 2025 r.): scratchpad/python/kod-95.py.
const DZIS = '2026-11-12';

describe('ważność kodu 95 (art. 15 ust. 4 ukp, art. 112 KC)', () => {
  it('świadectwo 10.05.2021: ważny do 10.05.2026, wygasł 186 dni temu', () => {
    expect(kod95({ tryb: 'swiadectwo', data: '2021-05-10', dzis: DZIS })).toMatchObject({
      waznyDo: '2026-05-10',
      ograniczenie: 'piec-lat',
      dniDoKonca: -186,
      status: 'wygaslo',
      wydarzenia: [],
    });
  });
  it('29 lutego: 5 lat kończy się 28 lutego', () => {
    expect(kod95({ tryb: 'swiadectwo', data: '2024-02-29', dzis: DZIS })).toMatchObject({ waznyDo: '2029-02-28', szkolenieNajpozniej: '2029-02-27', zZapasem: '2029-01-28', dniDoKonca: 839 });
  });
  it('koniec miesiąca: 31.08.2023 → 31.08.2028', () => {
    expect(kod95({ tryb: 'swiadectwo', data: '2023-08-31', dzis: DZIS })).toMatchObject({ waznyDo: '2028-08-31', szkolenieNajpozniej: '2028-08-30', dniDoKonca: 658 });
  });
  it('orzeczenie lekarskie krótsze (po 60. roku): kod do 15.12.2028, nie 15.06.2031', () => {
    const w = kod95({ tryb: 'swiadectwo', data: '2026-06-15', lekarskieDo: '2028-12-15', psychologiczneDo: '2029-06-01', dzis: DZIS });
    expect(w).toMatchObject({ waznyDo: '2028-12-15', ograniczenie: 'lekarskie', szkolenieNajpozniej: '2028-12-14', dniDoKonca: 764 });
    expect(kod95({ tryb: 'swiadectwo', data: '2026-06-15', psychologiczneDo: '2028-01-10', dzis: DZIS }).ograniczenie).toBe('psychologiczne');
  });
  it('koniec roku: świadectwo 26.12.2025 → 26.12.2030, szkolenie najpóźniej 22.12.2030 (24–26 grudnia wolne)', () => {
    expect(kod95({ tryb: 'swiadectwo', data: '2025-12-26', dzis: DZIS })).toMatchObject({ waznyDo: '2030-12-26', szkolenieNajpozniej: '2030-12-22', dniDoKonca: 1505 });
    expect(kod95({ tryb: 'swiadectwo', data: '2026-01-02', dzis: DZIS })).toMatchObject({ waznyDo: '2031-01-02', szkolenieNajpozniej: '2031-01-01' });
  });
  it('tryb z prawa jazdy: data z dokumentu bez zmian, orzeczenie wcześniejsze tylko jako uwaga', () => {
    const w = kod95({ tryb: 'prawo-jazdy', data: '2027-03-15', lekarskieDo: '2027-01-10', dzis: DZIS });
    expect(w).toMatchObject({ waznyDo: '2027-03-15', ograniczenie: 'prawo-jazdy', orzeczenieWczesniej: true, status: 'wkrotce', dniDoKonca: 123 });
  });
  it('statusy: do 60 dni pilne, do 180 wkrótce', () => {
    expect(kod95({ tryb: 'prawo-jazdy', data: '2027-01-11', dzis: DZIS }).status).toBe('pilne');
    expect(kod95({ tryb: 'prawo-jazdy', data: '2027-01-12', dzis: DZIS }).status).toBe('wkrotce');
    expect(kod95({ tryb: 'prawo-jazdy', data: DZIS, dzis: DZIS }).status).toBe('pilne');
  });
  it('plik kalendarza: tylko przyszłe przypomnienia', () => {
    const w = kod95({ tryb: 'prawo-jazdy', data: '2027-03-15', dzis: DZIS });
    // Do końca 123 dni (< 180): przypomnienie o zapisie z dzisiejszą datą.
    expect(w.wydarzenia.map((x) => x.data)).toEqual(['2026-11-12', '2027-02-12', '2027-03-14', '2027-03-15']);
    expect(kod95({ tryb: 'prawo-jazdy', data: '2027-05-12', dzis: DZIS }).wydarzenia[0].data).toBe('2026-11-13');
    expect(kod95({ tryb: 'prawo-jazdy', data: '2027-05-10', dzis: DZIS }).wydarzenia[0].data).toBe(DZIS);
    expect(kod95({ tryb: 'prawo-jazdy', data: '2031-11-12', dzis: DZIS }).wydarzenia.map((x) => x.data)).toEqual(['2031-05-16', '2031-10-12', '2031-11-11', '2031-11-12']);
  });
  it('błędne dane: RangeError', () => {
    expect(() => kod95({ tryb: 'swiadectwo', data: '2026-02-30', dzis: DZIS })).toThrow(RangeError);
    expect(() => kod95({ tryb: 'swiadectwo', data: '2026-06-15', lekarskieDo: '2026-01-01', dzis: DZIS })).toThrow(RangeError);
  });
});

describe('przykład startowy (liczony od dzisiejszej daty w przeglądarce)', () => {
  it('1 czerwca 2027: świadectwo 4.12.2022 (1640 dni wcześniej), szkolenie 31.07.2027, kod do 4.12.2027 (186 dni)', () => {
    const s = przykladStartowy('2027-06-01');
    expect(s).toEqual({ data: '2022-12-04', szkolenie: '2027-07-31' });
    expect(kod95({ tryb: 'swiadectwo', ...s, dzis: '2027-06-01' })).toMatchObject({ waznyDo: '2027-12-04', dniDoKonca: 186, status: 'w-terminie', plan: { strata: 126 } });
  });
});

describe('szkolenie wcześniej (nowe 5 lat od nowego świadectwa)', () => {
  it('kod do 15.03.2027, świadectwo 20.11.2026: nowy kod do 20.11.2031, przepada 115 dni', () => {
    expect(kod95({ tryb: 'prawo-jazdy', data: '2027-03-15', szkolenie: '2026-11-20', dzis: DZIS }).plan).toEqual({ nowyKoniec: '2031-11-20', nowyOgraniczony: false, strata: 115, przerwa: 0, noweOrzeczenie: false });
  });
  it('szkolenie po końcu ważności: 17 dni bez kodu', () => {
    expect(kod95({ tryb: 'prawo-jazdy', data: '2027-03-15', szkolenie: '2027-04-01', dzis: DZIS }).plan).toEqual({ nowyKoniec: '2032-04-01', nowyOgraniczony: false, strata: 0, przerwa: 17, noweOrzeczenie: false });
  });
  it('orzeczenie kończy się przed szkoleniem: nie przycina nowego wpisu, potrzebne nowe orzeczenie', () => {
    expect(kod95({ tryb: 'swiadectwo', data: '2024-01-01', lekarskieDo: '2026-12-01', szkolenie: '2027-03-01', dzis: DZIS })).toMatchObject({
      waznyDo: '2026-12-01',
      plan: { nowyKoniec: '2032-03-01', nowyOgraniczony: false, strata: 0, przerwa: 90, noweOrzeczenie: true },
    });
  });
  it('szkolenie przed wydaniem obecnego świadectwa: RangeError', () => {
    expect(() => kod95({ tryb: 'swiadectwo', data: '2026-06-15', szkolenie: '2026-06-14', dzis: DZIS })).toThrow(RangeError);
    expect(kod95({ tryb: 'swiadectwo', data: '2026-06-15', szkolenie: '2026-06-15', dzis: DZIS }).plan?.strata).toBe(1826);
  });
  it('nowy wpis przycięty do orzeczenia', () => {
    expect(kod95({ tryb: 'prawo-jazdy', data: '2027-03-15', szkolenie: '2027-03-01', psychologiczneDo: '2030-05-31', dzis: DZIS }).plan).toMatchObject({ nowyKoniec: '2030-05-31', nowyOgraniczony: true, strata: 14 });
  });
});

describe('najpóźniejszy dzień ukończenia szkolenia (§ 21 ust. 5: świadectwo do następnego dnia roboczego)', () => {
  it.each([
    ['2027-03-15', '2027-03-14'], // poniedziałek
    ['2031-01-01', '2030-12-30'], // Nowy Rok
    ['2030-11-03', '2030-10-30'], // niedziela, 1 listopada w piątek
    ['2029-04-02', '2029-03-29'], // Poniedziałek Wielkanocny
    ['2030-12-27', '2030-12-26'], // piątek po świętach
  ])('koniec %s → %s', (koniec, wynik) => expect(szkolenieNajpozniej(koniec)).toBe(wynik));
});

describe('czy potrzebujesz kodu 95 (art. 39a ust. 3 i 4 utd)', () => {
  it('kategorie AM–B+E: nie (art. 39a ust. 4), nawet bez wyjątków', () => {
    for (const k of ['AM', 'A', 'B', 'B+E'] as const) expect(czyPotrzebny(k, []).potrzeba).toBe('nie');
  });
  it('C+E bez wyjątków: tak', () => {
    expect(czyPotrzebny('C+E', []).potrzeba).toBe('tak');
  });
  it('wyjątek bez warunków ocennych: nie', () => {
    expect(czyPotrzebny('C', ['w2']).potrzeba).toBe('nie');
    expect(czyPotrzebny('D', ['ratownictwo']).potrzeba).toBe('nie');
    // Ratownictwo medyczne to art. 3 ust. 1 pkt 3 utd, nie punkt art. 39a ust. 3.
    expect(czyPotrzebny('D', ['ratownictwo']).wyjatki[0].pkt).toBe('art. 3 ust. 1 pkt 3');
  });
  it('tylko wyjątki ocenne: raczej nie', () => {
    expect(czyPotrzebny('C', ['w9', 'w11']).potrzeba).toBe('raczej-nie');
    // pkt 6 i 7 opierają się na pojęciu przewozu handlowego/niehandlowego (niezdefiniowanego w ustawie).
    expect(czyPotrzebny('C', ['w6']).potrzeba).toBe('raczej-nie');
    expect(czyPotrzebny('D', ['w7']).potrzeba).toBe('raczej-nie');
  });
  it('pkt 5 tylko dla D i D1', () => {
    expect(czyPotrzebny('D1', ['w5']).potrzeba).toBe('raczej-nie');
    const c = czyPotrzebny('C', ['w5']);
    expect(c.potrzeba).toBe('tak');
    expect(c.niedotyczace.map((w) => w.pkt)).toEqual(['5']);
    expect(czyPotrzebny('D+E', ['w5']).potrzeba).toBe('tak');
  });
  it('błędne dane: RangeError', () => {
    expect(() => czyPotrzebny('X' as never, [])).toThrow(RangeError);
    expect(() => czyPotrzebny('C', ['w99'])).toThrow(RangeError);
  });
});
