// Oczekiwane wartości policzone niezależnie w Pythonie (datetime, calendar; skrypt poza repozytorium, opis w raporcie):
// 20 000 losowych dat bez rozbieżności. Uruchomienie 15.12.2026 → informacja do 30.11.2026 (sporny 1.12.2026), oznaczenie
// do 14.12.2026; nagranie 14.11.2026 → do 13.02.2027; 30.11.2026 → do 28.02.2027; 30.11.2027 → do 29.02.2028; 14.08.2026 → 13.11.2026.
import { describe, expect, it } from 'vitest';
import { bladMonitoringu, koniecPrzechowywania, opisMonitoringu, terminyInformacji, type DaneMonitoringu } from './monitoring';

const DZIS = '2026-11-14';
const sp = (t: string) => t.replace(/\s/g, ' ');
const dane = (x: Partial<DaneMonitoringu>): DaneMonitoringu => ({ rodzaj: 'kamery', miejsce: 'hala', ...x });

describe('terminy', () => {
  it('pełne 2 tygodnie przed uruchomieniem, oznaczenie dzień przed (art. 22² § 7 i 9, art. 112 KC)', () => {
    expect(terminyInformacji('2026-12-15')).toEqual({ informacja: '2026-11-30', informacjaLagodniej: '2026-12-01', oznaczenie: '2026-12-14' });
    expect(terminyInformacji('2027-01-01')).toEqual({ informacja: '2026-12-17', informacjaLagodniej: '2026-12-18', oznaczenie: '2026-12-31' });
    expect(terminyInformacji('2028-03-14').informacja).toBe('2028-02-28');
  });
  it('3 miesiące od dnia nagrania z tym dniem włącznie (art. 22² § 3, art. 112 KC)', () => {
    expect(koniecPrzechowywania('2026-11-14')).toBe('2027-02-13');
    expect(koniecPrzechowywania('2026-11-30')).toBe('2027-02-28');
    expect(koniecPrzechowywania('2027-11-30')).toBe('2028-02-29');
    expect(koniecPrzechowywania('2026-08-14')).toBe('2026-11-13');
    expect(koniecPrzechowywania('2026-10-01')).toBe('2026-12-31');
  });
});

describe('czy wolno', () => {
  it('hala i teren: wolno na warunkach', () => {
    for (const miejsce of ['hala', 'teren'] as const) expect(opisMonitoringu(dane({ miejsce }), DZIS).werdykt).toBe('Wolno, na warunkach');
  });
  it('pomieszczenia związku: nigdy (§ 1¹)', () => {
    const o = opisMonitoringu(dane({ miejsce: 'zwiazek', nagranie: '2026-11-01' }), DZIS);
    expect(o.werdykt).toBe('Nie wolno');
    expect(o.werdyktOpis).toContain('udostępnianych zakładowej organizacji związkowej');
    expect(o.warunki).toHaveLength(1);
    expect(o.zakazy.join(' ')).not.toContain('Nie wolno uruchomić');
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
  it('poczta i GPS: art. 22³, pełne odesłania, bez okresu przechowywania w Kodeksie pracy', () => {
    const p = opisMonitoringu({ rodzaj: 'poczta', nagranie: '2026-11-01' }, DZIS);
    expect(p.werdyktOpis).toContain('tajemnicy korespondencji');
    expect(p.przechowywanie).toContain('nie podaje okresu');
    expect(p.zakazy.join(' ')).toContain('przez art. 22³ § 3');
    expect(p.warunki.slice(0, 3).map((w) => w.match(/\(([^)]*)\)\.$/)?.[1])).toEqual(['art. 22² § 6 przez art. 22³ § 3', 'art. 22² § 7 przez art. 22³ § 3', 'art. 22² § 8 przez art. 22³ § 3']);
    expect(p.warunki.join(' ')).not.toContain('terenu');
    const g = opisMonitoringu({ rodzaj: 'inne' }, DZIS);
    expect(g.przepis).toBe('art. 22³ § 4 Kodeksu pracy');
    expect(g.werdyktOpis).toContain('GPS');
    expect(opisMonitoringu(dane({}), DZIS).warunki[0]).toMatch(/\(art\. 22² § 6\)\.$/);
  });
});

describe('informacja i przechowywanie', () => {
  it('informacja w terminie, sporna i za późno', () => {
    expect(opisMonitoringu(dane({ uruchomienie: '2026-12-15', informacja: 'tak', dataInformacji: '2026-11-10' }), DZIS).informacjaKlasa).toBe('w-terminie');
    const o = opisMonitoringu(dane({ uruchomienie: '2026-11-10', informacja: 'tak', dataInformacji: '2026-11-01' }), DZIS);
    expect(o.informacjaKlasa).toBe('po-terminie');
    expect(o.informacjaStatus).toBe('Za późno o 6 dni');
    expect(opisMonitoringu(dane({ uruchomienie: '2026-11-10', informacja: 'tak', dataInformacji: '2026-10-26' }), DZIS).informacjaStatus).toBe('W terminie');
    const sp2 = opisMonitoringu(dane({ uruchomienie: '2026-11-10', informacja: 'tak', dataInformacji: '2026-10-27' }), DZIS);
    expect(sp2.informacjaStatus).toBe('Sporne: dzień za późno albo w terminie');
    expect(sp2.informacjaKlasa).toBe('wkrotce');
    expect(opisMonitoringu(dane({ uruchomienie: '2026-11-10', informacja: 'tak', dataInformacji: '2026-10-28' }), DZIS).informacjaKlasa).toBe('po-terminie');
  });
  it('brak informacji: jeszcze czas, dziś ostatni dzień, po terminie; bez dnia uruchomienia bez oceny', () => {
    expect(sp(opisMonitoringu(dane({ uruchomienie: '2026-12-15', informacja: 'nie' }), DZIS).informacjaStatus!)).toBe('Pracodawcy zostało 16 dni');
    const dzisOstatni = opisMonitoringu(dane({ uruchomienie: '2026-11-29', informacja: 'nie' }), DZIS);
    expect(dzisOstatni.informacjaStatus).toBe('Dziś ostatni dzień na informację');
    expect(dzisOstatni.informacjaKlasa).toBe('pilne');
    expect(opisMonitoringu(dane({ uruchomienie: '2026-11-20', informacja: 'nie' }), DZIS).informacjaKlasa).toBe('po-terminie');
    const blisko = opisMonitoringu(dane({ uruchomienie: '2026-11-30', informacja: 'nie' }), DZIS);
    expect(blisko.informacjaStatus).toBe('Pracodawcy został 1 dzień');
    expect(blisko.informacjaKlasa).toBe('pilne');
    const bez = opisMonitoringu(dane({ informacja: 'nie' }), DZIS);
    expect(bez.informacjaStatus).toBeNull();
    expect(bez.informacjaKlasa).toBeNull();
  });
  it('nagranie: zostało, dziś, minęło', () => {
    const z = opisMonitoringu(dane({ nagranie: '2026-11-10' }), DZIS);
    expect(sp(z.przechowywanie)).toContain('Najpóźniej do 9 lutego 2027 r.');
    expect(z.przechowywanieStatus).toBe('Zostało 87 dni');
    expect(opisMonitoringu(dane({ nagranie: '2026-08-15' }), DZIS).przechowywanieStatus).toBe('Dziś ostatni dzień');
    const m = opisMonitoringu(dane({ nagranie: '2026-08-14' }), DZIS);
    expect(m.przechowywanieKlasa).toBe('po-terminie');
    expect(m.przechowywanieStatus).toBe('Okres minął 1 dzień temu');
    expect(m.przechowywanie).toContain('powinno być zniszczone');
  });
});

describe('błędne dane', () => {
  it('daty', () => {
    expect(bladMonitoringu(dane({ nagranie: '2026-11-15' }), DZIS)?.pole).toBe('nagranie');
    expect(bladMonitoringu(dane({ uruchomienie: '2026-11-10', nagranie: '2026-11-09' }), DZIS)?.pole).toBe('nagranie');
    expect(bladMonitoringu(dane({ informacja: 'tak' }), DZIS)?.pole).toBe('dataInformacji');
    expect(bladMonitoringu(dane({ informacja: 'tak', dataInformacji: '2026-11-15' }), DZIS)?.pole).toBe('dataInformacji');
    expect(bladMonitoringu(dane({ informacja: 'nie', dataInformacji: '2026-11-15' }), DZIS)).toBeNull();
    expect(bladMonitoringu(dane({ uruchomienie: '2026-13-01' }), DZIS)?.pole).toBe('uruchomienie');
    expect(bladMonitoringu({ rodzaj: 'poczta', nagranie: 'zła' }, DZIS)).toBeNull();
    expect(() => opisMonitoringu(dane({ nagranie: '2030-01-01' }), DZIS)).toThrow(RangeError);
  });
});
