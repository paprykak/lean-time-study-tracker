// Oczekiwane daty policzone niezależnie skryptem w Pythonie (datetime, własne dodawanie miesięcy i kalendarz świąt).
import { describe, expect, it } from 'vitest';
import { ART_41_DO, KARTA_UKR_WNIOSEK_DO, koniecLimitu, ostatniDzienMiesiecy, przechowywanieDo, terminyOchrony, terminyOswiadczenia, terminyZezwolenia } from './cudzoziemiec-terminy';

const mapa = <T extends { klucz: string }>(l: T[]) => Object.fromEntries(l.map((t) => [t.klucz, t]));

describe('oświadczenie o powierzeniu pracy (art. 61, 70, 71)', () => {
  it('złożone 12 listopada 2026 r.: start do 12 maja 2027 r., 24 miesiące od 1 grudnia do 30 listopada 2028 r.', () => {
    const m = mapa(terminyOswiadczenia({ zlozone: '2026-11-12', startEwidencja: '2026-12-01', startFaktyczny: '2026-12-03', koniec: '2028-11-30' }));
    expect(m['start-6m']).toMatchObject({ data: '2027-05-12', stan: 'ok' });
    expect(m['limit-24m']).toMatchObject({ data: '2028-11-30', stan: 'ok' });
    expect(m.podjecie).toMatchObject({ data: '2026-12-10' });
    expect(m.niepodjecie).toBeUndefined();
    expect(m.zakonczenie.data).toBeNull();
    expect(m['zezwolenie-po'].data).toBe('2028-11-29');
  });
  it('granice: dzień ponad 24 miesiące i start dzień po 6 miesiącach to błąd; 31 sierpnia + 6 miesięcy = 28 lutego', () => {
    expect(mapa(terminyOswiadczenia({ startEwidencja: '2026-12-01', koniec: '2028-12-01' }))['limit-24m'].stan).toBe('blad');
    expect(mapa(terminyOswiadczenia({ zlozone: '2026-11-12', startEwidencja: '2027-05-13', koniec: '2027-12-31' }))['start-6m'].stan).toBe('blad');
    expect(mapa(terminyOswiadczenia({ zlozone: '2026-08-31', startEwidencja: '2027-02-28', koniec: '2027-12-31' }))['start-6m']).toMatchObject({ data: '2027-02-28', stan: 'ok' });
  });
  it('praca nie zaczęła się: niepodjęcie 14 dni od dnia z ewidencji; start 17 grudnia: 7. dzień w Wigilię, po przesunięciu 28 grudnia', () => {
    expect(mapa(terminyOswiadczenia({ startEwidencja: '2026-12-01', startFaktyczny: null, koniec: '2027-11-30' })).niepodjecie.data).toBe('2026-12-15');
    expect(mapa(terminyOswiadczenia({ startEwidencja: '2026-12-17', startFaktyczny: '2026-12-17', koniec: '2027-11-30' })).podjecie).toMatchObject({ data: '2026-12-24', przesunieta: '2026-12-28' });
  });
  it('błędne dane', () => {
    expect(() => terminyOswiadczenia({ startEwidencja: '2027-01-01', koniec: '2026-12-31' })).toThrow(/przed jej rozpoczęciem/);
    expect(() => terminyOswiadczenia({ startEwidencja: '', koniec: '2026-12-31' })).toThrow();
    expect(() => terminyOswiadczenia({ startEwidencja: '2026-02-30', koniec: '2026-12-31' })).toThrow(/Popraw/);
  });
});

describe('zezwolenie na pracę (art. 15, 19–21)', () => {
  it('od 1 marca 2026 r. do 28 lutego 2029 r.: 3 lata w limicie, niepodjęcie do 30 kwietnia, powiadomienie do 7 maja', () => {
    const m = mapa(terminyZezwolenia({ od: '2026-03-01', do: '2029-02-28' }));
    expect(m['limit-3l']).toMatchObject({ data: '2029-02-28', stan: 'ok' });
    expect(m.niepodjecie).toMatchObject({ data: '2026-05-07' });
    expect(m.niepodjecie.nazwa).toContain('30 kwietnia 2026 r.');
    expect(m.kolejne.data).toBe('2029-02-28');
    expect(m.przerwa.data).toBeNull();
  });
  it('dzień ponad 3 lata to błąd; praca zaczęta w oknie 2 miesięcy: bez pozycji o niepodjęciu', () => {
    expect(mapa(terminyZezwolenia({ od: '2026-03-01', do: '2029-03-01' }))['limit-3l'].stan).toBe('blad');
    expect(mapa(terminyZezwolenia({ od: '2026-03-01', do: '2027-02-28', startFaktyczny: '2026-04-30' })).niepodjecie).toBeUndefined();
    expect(mapa(terminyZezwolenia({ od: '2026-03-01', do: '2027-02-28', startFaktyczny: '2026-05-01' })).niepodjecie).toBeDefined();
  });
  it('od 31 grudnia: okno do 27 lutego, 7. dzień w sobotę 6 marca, po przesunięciu 8 marca', () => {
    expect(ostatniDzienMiesiecy('2026-12-31', 2)).toBe('2027-02-27');
    expect(mapa(terminyZezwolenia({ od: '2026-12-31', do: '2027-12-30' })).niepodjecie).toMatchObject({ data: '2027-03-06', przesunieta: '2027-03-08' });
  });
  it('zakończenie: dzień przed granicą 2 miesięcy wymaga powiadomienia w 7 dni, w dniu granicy nie', () => {
    expect(mapa(terminyZezwolenia({ od: '2026-03-01', do: '2029-02-28', startFaktyczny: '2026-03-02', zakonczenie: '2028-12-27' })).zakonczenie).toMatchObject({ data: '2029-01-03' });
    const wGranicy = mapa(terminyZezwolenia({ od: '2026-03-01', do: '2029-02-28', startFaktyczny: '2026-03-02', zakonczenie: '2028-12-28' })).zakonczenie;
    expect(wGranicy.data).toBeNull();
    expect(wGranicy.uwaga).toMatch(/Niepotrzebne/);
  });
  it('limity od 29 lutego i 31 stycznia: ostatni dzień miesiąca (art. 112 KC), bez fałszywego błędu', () => {
    expect(koniecLimitu('2028-02-29', 24)).toBe('2030-02-28');
    expect(koniecLimitu('2028-02-29', 36)).toBe('2031-02-28');
    expect(koniecLimitu('2027-01-31', 1)).toBe('2027-02-28');
    expect(koniecLimitu('2026-03-01', 36)).toBe('2029-02-28');
    expect(mapa(terminyOswiadczenia({ startEwidencja: '2028-02-29', koniec: '2030-02-28' }))['limit-24m'].stan).toBe('ok');
    expect(mapa(terminyZezwolenia({ od: '2028-02-29', do: '2031-02-28' }))['limit-3l'].stan).toBe('ok');
  });
  it('błędne dane', () => {
    expect(() => terminyZezwolenia({ od: '2025-05-31', do: '2026-12-31' })).toThrow(/1 czerwca 2025/);
    expect(() => terminyZezwolenia({ od: '2027-01-01', do: '2026-12-31' })).toThrow(/przed początkiem/);
    expect(() => terminyZezwolenia({ od: '', do: '2026-12-31' })).toThrow();
  });
});

describe('ochrona czasowa i obywatele Ukrainy (art. 5a, art. 41 ustawy o wygaszeniu, art. 42x)', () => {
  it('start 12 listopada 2026 r.: PUP do 19 listopada; zmiana 31 grudnia: do 7 stycznia 2027 r.', () => {
    const m = mapa(terminyOchrony({ start: '2026-11-12', zmiana: '2026-12-31' }));
    expect(m.pup.data).toBe('2026-11-19');
    expect(m['pup-zmiana'].data).toBe('2027-01-07');
    expect(m.karta.data).toBe(KARTA_UKR_WNIOSEK_DO);
    expect(m.art41.data).toBe(ART_41_DO);
  });
  it('start przed 5 marca 2026 r.: art. 5a jeszcze nie obowiązywał; start po 4 marca 2027 r.: bez pozycji o karcie', () => {
    expect(() => terminyOchrony({ start: '2026-03-04' })).toThrow(/od 5 marca 2026/);
    expect(mapa(terminyOchrony({ start: '2026-03-05' })).pup.data).toBe('2026-03-12');
    expect(mapa(terminyOchrony({ start: '2027-03-05' })).karta).toBeUndefined();
    expect(mapa(terminyOchrony({ start: '2027-03-04' })).karta).toBeDefined();
  });
  it('błędne dane', () => {
    expect(() => terminyOchrony({ start: '2026-11-12', zmiana: '2026-11-11' })).toThrow(/przed rozpoczęciem/);
    expect(() => terminyOchrony({ start: '' })).toThrow();
  });
});

describe('przechowywanie kopii dokumentów (art. 4 ust. 4 i 6)', () => {
  it('2 lata od końca roku, w którym umowa ustała', () => {
    expect(przechowywanieDo('2026-11-30')).toBe('2028-12-31');
    expect(przechowywanieDo('2026-12-31')).toBe('2028-12-31');
    expect(przechowywanieDo('2027-01-01')).toBe('2029-12-31');
  });
});
