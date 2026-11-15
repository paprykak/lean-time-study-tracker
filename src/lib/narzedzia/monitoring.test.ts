// Oczekiwane wartości policzone niezależnie w Pythonie (datetime, calendar; skrypt poza repozytorium, opis w raporcie):
// 20 000 losowych dat bez rozbieżności. Uruchomienie 15.12.2026 → informacja do 30.11.2026 (sporny 1.12.2026), oznaczenie
// do 13.12.2026 (dzień poprzedni 14.12.2026); nagranie 14.11.2026 → do 13.02.2027; 30.11.2026 → do 28.02.2027; 30.11.2027 → do 29.02.2028; 14.08.2026 → 13.11.2026.
import { describe, expect, it } from 'vitest';
import { WSTECZ_BEZ_PRZESUNIECIA, bladMonitoringu, koniecPrzechowywania, opisMonitoringu, terminyInformacji, type DaneMonitoringu } from './monitoring';
import { BEZ_PRZESUNIECIA } from './terminy';

const DZIS = '2026-11-14';
const sp = (t: string) => t.replace(/\s/g, ' ');
const dane = (x: Partial<DaneMonitoringu>): DaneMonitoringu => ({ rodzaj: 'kamery', miejsce: 'hala', ...x });

describe('terminy', () => {
  it('pełne 2 tygodnie przed uruchomieniem, oznaczenie z pełnym dniem przerwy i dzień poprzedni (art. 22² § 7 i 9, art. 112 KC)', () => {
    expect(terminyInformacji('2026-12-15')).toEqual({ informacja: '2026-11-30', informacjaLagodniej: '2026-12-01', oznaczenie: '2026-12-13', oznaczenieLagodniej: '2026-12-14' });
    expect(terminyInformacji('2027-01-01')).toEqual({ informacja: '2026-12-17', informacjaLagodniej: '2026-12-18', oznaczenie: '2026-12-30', oznaczenieLagodniej: '2026-12-31' });
    expect(terminyInformacji('2028-03-01')).toMatchObject({ oznaczenie: '2028-02-28', oznaczenieLagodniej: '2028-02-29' });
    expect(terminyInformacji('2028-03-14').informacja).toBe('2028-02-28');
  });
  it('3 miesiące od dnia nagrania z tym dniem włącznie (art. 22² § 3, art. 112 KC)', () => {
    expect(koniecPrzechowywania('2026-11-14')).toBe('2027-02-13');
    expect(koniecPrzechowywania('2026-11-30')).toBe('2027-02-28');
    expect(koniecPrzechowywania('2027-11-30')).toBe('2028-02-29');
    expect(koniecPrzechowywania('2026-08-14')).toBe('2026-11-13');
    expect(koniecPrzechowywania('2026-10-01')).toBe('2026-12-31');
    // audyt jakosc3 (B-7): 29 lutego, 31. dzień przed miesiącem 30-dniowym, koniec stycznia
    expect(koniecPrzechowywania('2028-02-29')).toBe('2028-05-28');
    expect(koniecPrzechowywania('2027-03-31')).toBe('2027-06-30');
    expect(koniecPrzechowywania('2027-01-31')).toBe('2027-04-30');
  });
  it('wynik podaje obie daty oznaczenia (B-3)', () => {
    const o = opisMonitoringu(dane({ uruchomienie: '2026-12-15', informacja: 'nie-wiem' }), DZIS);
    expect(sp(o.informacja)).toBe('Informacja najpóźniej 30 listopada 2026 r., oznaczenie terenu najpóźniej 13 grudnia 2026 r., a jeśli wystarczy dzień poprzedni, 14 grudnia 2026 r.');
  });
});

describe('audyt jakosc3: osoba przyjęta po uruchomieniu, początek art. 22², przełom roku', () => {
  const D = '2027-01-01';
  it('„Przyjęto mnie później”: bez terminu 2 tygodni, informacja przed dopuszczeniem do pracy (§ 8)', () => {
    const o = opisMonitoringu(dane({ uruchomienie: '2026-06-01', informacja: 'pozniej' }), D);
    expect(o.informacjaStatus).toBeNull();
    expect(sp(o.informacja)).toContain('przed dopuszczeniem do pracy (art. 22² § 8)');
    const p = opisMonitoringu({ rodzaj: 'poczta', uruchomienie: '2026-06-01', informacja: 'pozniej' }, D);
    expect(sp(p.informacja)).toContain('art. 22² § 8 przez art. 22³ § 3');
  });
  it('informacja po uruchomieniu: „Za późno” ze wskazówką o § 8; przed uruchomieniem bez wskazówki', () => {
    const o = opisMonitoringu(dane({ uruchomienie: '2026-06-01', informacja: 'tak', dataInformacji: '2026-12-01' }), D);
    expect(sp(o.informacjaStatus!)).toBe('Za późno o 198 dni');
    expect(sp(o.informacja)).toContain('wybierz „Przyjęto mnie później”');
    const p = opisMonitoringu(dane({ uruchomienie: '2026-11-10', informacja: 'tak', dataInformacji: '2026-11-01' }), D);
    expect(p.informacjaKlasa).toBe('po-terminie');
    expect(p.informacja).not.toContain('Przyjęto mnie później');
  });
  it('termin informacji przed 25 maja 2018 r. nie jest oceniany', () => {
    for (const uruchomienie of ['2015-03-01', '2018-06-08']) {
      const o = opisMonitoringu(dane({ uruchomienie, informacja: 'nie' }), D);
      expect(o.informacjaStatus, uruchomienie).toBeNull();
      expect(sp(o.informacja)).toContain('obowiązuje od 25 maja 2018 r.');
    }
    expect(opisMonitoringu(dane({ uruchomienie: '2018-06-09', informacja: 'nie' }), D).informacjaStatus).toBe('Obowiązek niespełniony');
    expect(opisMonitoringu(dane({ uruchomienie: '2018-06-09', informacja: 'tak', dataInformacji: '2018-05-25' }), D).informacjaStatus).toBe('W terminie');
  });
  it('klasy statusu na przełomie roku: 3 dni pilne, 4 i 7 wkrótce, 8 w terminie', () => {
    const klasa = (uruchomienie: string) => opisMonitoringu(dane({ uruchomienie, informacja: 'nie' }), D).informacjaKlasa;
    expect([klasa('2027-01-19'), klasa('2027-01-20'), klasa('2027-01-23'), klasa('2027-01-24')]).toEqual(['pilne', 'wkrotce', 'wkrotce', 'w-terminie']);
    const n = opisMonitoringu(dane({ nagranie: '2026-10-01' }), D);
    expect(sp(n.przechowywanieStatus!)).toBe('Okres minął 1 dzień temu');
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

describe('terminy 2: bez przesunięcia z art. 115 KC (BEZ_PRZESUNIECIA)', () => {
  it('koniec przechowywania w sobotę 13.02.2027 i w Boże Narodzenie: zdanie o okresie; w czwartek bez zdania', () => {
    const sobota = opisMonitoringu(dane({ nagranie: '2026-11-14' }), '2026-11-15');
    expect(sobota.przechowywanie).toContain('Najpóźniej do 13 lutego 2027 r.');
    expect(sobota.przechowywanie.endsWith(BEZ_PRZESUNIECIA.okres)).toBe(true);
    expect(opisMonitoringu(dane({ nagranie: '2026-09-26' }), '2026-11-15').przechowywanie).toContain(BEZ_PRZESUNIECIA.okres);
    expect(koniecPrzechowywania('2026-09-26')).toBe('2026-12-25');
    expect(opisMonitoringu(dane({ nagranie: '2026-11-12' }), '2026-11-15').przechowywanie).not.toContain(BEZ_PRZESUNIECIA.okres);
  });
  it('terminy liczone wstecz: zdanie dlaczego bez przesunięcia', () => {
    expect(WSTECZ_BEZ_PRZESUNIECIA).toContain('wstecz od dnia uruchomienia');
  });
});
