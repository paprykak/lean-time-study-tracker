// Oczekiwane wartości policzone niezależnie w Pythonie (datetime, calendar; skrypt poza repozytorium, opis w raporcie):
// 20 000 losowych dat bez rozbieżności. Uruchomienie 15.12.2026 → informacja do 1.12.2026, oznaczenie do 14.12.2026;
// nagranie 30.11.2026 → do 28.02.2027; 30.11.2027 → do 29.02.2028; 14.08.2026 → do 14.11.2026.
import { describe, expect, it } from 'vitest';
import { bladMonitoringu, koniecPrzechowywania, opisMonitoringu, terminyInformacji, type DaneMonitoringu } from './monitoring';

const DZIS = '2026-11-14';
const sp = (t: string) => t.replace(/\s/g, ' ');
const dane = (x: Partial<DaneMonitoringu>): DaneMonitoringu => ({ rodzaj: 'kamery', miejsce: 'hala', ...x });

describe('terminy', () => {
  it('informacja 2 tygodnie przed, oznaczenie dzień przed (art. 22² § 7 i 9)', () => {
    expect(terminyInformacji('2026-12-15')).toEqual({ informacja: '2026-12-01', oznaczenie: '2026-12-14' });
    expect(terminyInformacji('2027-01-01')).toEqual({ informacja: '2026-12-18', oznaczenie: '2026-12-31' });
  });
  it('3 miesiące od dnia nagrania (art. 22² § 3, art. 112 KC)', () => {
    expect(koniecPrzechowywania('2026-11-30')).toBe('2027-02-28');
    expect(koniecPrzechowywania('2027-11-30')).toBe('2028-02-29');
    expect(koniecPrzechowywania('2026-08-14')).toBe('2026-11-14');
  });
});

describe('czy wolno', () => {
  it('hala i teren: wolno na warunkach', () => {
    for (const miejsce of ['hala', 'teren'] as const) expect(opisMonitoringu(dane({ miejsce }), DZIS).werdykt).toBe('Wolno, na warunkach');
  });
  it('pomieszczenia związku: nigdy (§ 1¹)', () => {
    const o = opisMonitoringu(dane({ miejsce: 'zwiazek', nagranie: '2026-11-01' }), DZIS);
    expect(o.werdykt).toBe('Nie wolno');
    expect(o.warunki).toEqual([]);
    expect(o.przechowywanieKlasa).toBe('po-terminie');
  });
  it('sanitariaty: wyjątkowo i za zgodą związku albo przedstawicieli (§ 2 zd. 2)', () => {
    const o = opisMonitoringu(dane({ miejsce: 'sanitariat' }), DZIS);
    expect(o.werdykt).toBe('Tylko wyjątkowo');
    expect(o.warunki[0]).toContain('wcześniejsza zgoda');
    for (const miejsce of ['szatnia', 'stolowka', 'palarnia'] as const) {
      const x = opisMonitoringu(dane({ miejsce }), DZIS);
      expect(x.werdykt).toBe('Tylko wyjątkowo');
      expect(x.warunki.join(' ')).not.toContain('wcześniejsza zgoda');
    }
  });
  it('poczta i GPS: art. 22³, bez okresu przechowywania w Kodeksie pracy', () => {
    const p = opisMonitoringu({ rodzaj: 'poczta', nagranie: '2026-11-01' }, DZIS);
    expect(p.werdyktOpis).toContain('tajemnicy korespondencji');
    expect(p.przechowywanie).toContain('nie podaje okresu');
    expect(p.zakazy.join(' ')).toContain('przez art. 22³ § 3');
    const g = opisMonitoringu({ rodzaj: 'inne' }, DZIS);
    expect(g.przepis).toBe('art. 22³ § 4 Kodeksu pracy');
    expect(g.werdyktOpis).toContain('GPS');
  });
});

describe('informacja i przechowywanie', () => {
  it('informacja w terminie i za późno', () => {
    expect(opisMonitoringu(dane({ uruchomienie: '2026-12-15', informacja: 'tak', dataInformacji: '2026-11-10' }), DZIS).informacjaKlasa).toBe('w-terminie');
    const o = opisMonitoringu(dane({ uruchomienie: '2026-11-10', informacja: 'tak', dataInformacji: '2026-11-01' }), DZIS);
    expect(o.informacjaKlasa).toBe('po-terminie');
    expect(sp(o.informacja)).toContain('5 dni za późno');
    expect(opisMonitoringu(dane({ uruchomienie: '2026-11-10', informacja: 'tak', dataInformacji: '2026-10-27' }), DZIS).informacjaKlasa).toBe('w-terminie');
    expect(opisMonitoringu(dane({ uruchomienie: '2026-11-10', informacja: 'tak', dataInformacji: '2026-10-28' }), DZIS).informacjaKlasa).toBe('po-terminie');
  });
  it('brak informacji: przed terminem jeszcze czas, po terminie naruszenie', () => {
    expect(sp(opisMonitoringu(dane({ uruchomienie: '2026-12-15', informacja: 'nie' }), DZIS).informacja)).toContain('ma jeszcze czas: 17 dni');
    expect(opisMonitoringu(dane({ uruchomienie: '2026-11-20', informacja: 'nie' }), DZIS).informacjaKlasa).toBe('po-terminie');
  });
  it('nagranie: zostało, dziś, minęło', () => {
    expect(sp(opisMonitoringu(dane({ nagranie: '2026-11-10' }), DZIS).przechowywanie)).toContain('Najpóźniej do 10 lutego 2027 r. (zostało 88 dni)');
    expect(sp(opisMonitoringu(dane({ nagranie: '2026-08-14' }), DZIS).przechowywanie)).toContain('(to dziś)');
    const m = opisMonitoringu(dane({ nagranie: '2026-08-13' }), DZIS);
    expect(m.przechowywanieKlasa).toBe('po-terminie');
    expect(m.przechowywanie).toContain('powinno być zniszczone');
  });
});

describe('błędne dane', () => {
  it('daty', () => {
    expect(bladMonitoringu(dane({ nagranie: '2026-11-15' }), DZIS)?.pole).toBe('nagranie');
    expect(bladMonitoringu(dane({ uruchomienie: '2026-11-10', nagranie: '2026-11-09' }), DZIS)?.pole).toBe('nagranie');
    expect(bladMonitoringu(dane({ informacja: 'tak' }), DZIS)?.pole).toBe('dataInformacji');
    expect(bladMonitoringu(dane({ informacja: 'tak', dataInformacji: '2026-11-15' }), DZIS)?.pole).toBe('dataInformacji');
    expect(bladMonitoringu(dane({ uruchomienie: '2026-13-01' }), DZIS)?.pole).toBe('uruchomienie');
    expect(bladMonitoringu({ rodzaj: 'poczta', nagranie: 'zła' }, DZIS)).toBeNull();
    expect(() => opisMonitoringu(dane({ nagranie: '2030-01-01' }), DZIS)).toThrow(RangeError);
  });
});
