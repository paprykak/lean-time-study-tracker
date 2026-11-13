// Oczekiwane daty policzone niezależnie skryptem w Pythonie (datetime, miesiące według art. 112 KC):
// okno = (ważne do − 12 miesięcy) + 1 dzień … ważne do − 1 dzień; zapas = ważne do − 14 dni; nowe 5 lat = (od + 60 miesięcy) − 1 dzień.
import { describe, expect, it } from 'vitest';
import { ktoPlaci, opisAdr, oknoPrzedluzenia, piecLatOd, zaswiadczenieAdr } from './zaswiadczenie-adr';

describe('okres na kurs doskonalący (art. 24 ust. 6)', () => {
  it.each([
    ['2027-05-20', '2026-05-21', '2027-05-19'],
    ['2028-02-29', '2027-03-01', '2028-02-28'],
    ['2029-03-01', '2028-03-02', '2029-02-28'],
    ['2030-01-01', '2029-01-02', '2029-12-31'],
    ['2026-12-31', '2026-01-01', '2026-12-30'],
  ])('ważne do %s: od %s do %s', (waznyDo, od, do_) => {
    expect(oknoPrzedluzenia(waznyDo)).toEqual({ od, do: do_ });
  });
  it.each([
    ['2027-05-20', '2032-05-19'],
    ['2028-02-29', '2033-02-27'],
    ['2030-01-01', '2034-12-31'],
    ['2026-12-31', '2031-12-30'],
  ])('5 lat od %s: co najmniej do %s', (od, koniec) => {
    expect(piecLatOd(od)).toBe(koniec);
  });
});

describe('zaświadczenie ADR', () => {
  it('przed okresem: status, zapas 14 dni, nowe po przedłużeniu', () => {
    const r = zaswiadczenieAdr({ waznyDo: '2027-05-20', dzis: '2026-02-01' });
    expect(r.status).toBe('przed-oknem');
    expect(r.dniDoOkna).toBe(109);
    expect(r.zZapasem).toBe('2027-05-06');
    expect(r.nowyPoPrzedluzeniu).toBe('2032-05-19');
    expect(r.egzamin).toBe('brak');
    expect(r.wydarzenia.map((w) => w.data)).toEqual(['2026-05-21', '2027-05-06', '2027-05-19', '2027-05-20']);
  });
  it('egzamin w okresie: przedłużenie od dnia upływu', () => {
    const r = zaswiadczenieAdr({ waznyDo: '2027-05-20', egzamin: '2027-03-10', dzis: '2026-11-13' });
    expect(r.egzamin).toBe('w-oknie');
    expect(r.nowyKoniec).toBe('2032-05-19');
    expect(r.strata).toBe(0);
  });
  it('egzamin w ostatnich 14 dniach: przedłużenie, ale dokument może przyjść po końcu', () => {
    const r = zaswiadczenieAdr({ waznyDo: '2027-05-20', egzamin: '2027-05-07', dzis: '2026-11-13' });
    expect(r.egzamin).toBe('przed-wydaniem');
    expect(r.nowyKoniec).toBe('2032-05-19');
    expect(zaswiadczenieAdr({ waznyDo: '2027-05-20', egzamin: '2027-05-06', dzis: '2026-11-13' }).egzamin).toBe('w-oknie');
  });
  it('granice okresu: pierwszy i ostatni dzień', () => {
    expect(zaswiadczenieAdr({ waznyDo: '2027-05-20', egzamin: '2026-05-21', dzis: '2026-01-01' }).egzamin).toBe('w-oknie');
    expect(zaswiadczenieAdr({ waznyDo: '2027-05-20', egzamin: '2026-05-20', dzis: '2026-01-01' }).egzamin).toBe('przed-oknem');
    expect(zaswiadczenieAdr({ waznyDo: '2027-05-20', egzamin: '2027-05-19', dzis: '2026-01-01' }).egzamin).toBe('przed-wydaniem');
    expect(zaswiadczenieAdr({ waznyDo: '2027-05-20', egzamin: '2027-05-20', dzis: '2026-01-01' }).egzamin).toBe('po-koncu');
  });
  it('egzamin za wcześnie: 5 lat od egzaminu, przepada 405 dni', () => {
    const r = zaswiadczenieAdr({ waznyDo: '2027-05-20', egzamin: '2026-04-10', dzis: '2026-01-01' });
    expect(r.egzamin).toBe('przed-oknem');
    expect(r.nowyKoniec).toBe('2031-04-09');
    expect(r.strata).toBe(405);
  });
  it('29 lutego: za wcześnie o dzień, przepada 366 dni', () => {
    const r = zaswiadczenieAdr({ waznyDo: '2028-02-29', egzamin: '2027-02-28', dzis: '2026-11-13' });
    expect(r.egzamin).toBe('przed-oknem');
    expect(r.nowyKoniec).toBe('2032-02-27');
    expect(r.strata).toBe(366);
  });
  it('egzamin po końcu: 14 dni bez zaświadczenia', () => {
    const r = zaswiadczenieAdr({ waznyDo: '2027-05-20', egzamin: '2027-06-03', dzis: '2026-11-13' });
    expect(r.egzamin).toBe('po-koncu');
    expect(r.przerwa).toBe(14);
    expect(r.nowyKoniec).toBeNull();
  });
  it('w okresie i ostatni dzień; po końcu: wygasło, bez wydarzeń', () => {
    expect(zaswiadczenieAdr({ waznyDo: '2027-05-20', dzis: '2027-01-01' }).status).toBe('okno');
    const ostatni = zaswiadczenieAdr({ waznyDo: '2027-05-20', dzis: '2027-05-20' });
    expect(ostatni.status).toBe('okno');
    expect(opisAdr(ostatni, 'firma').status).toBe('Ostatni dzień ważności');
    const r = zaswiadczenieAdr({ waznyDo: '2025-05-20', dzis: '2026-11-13' });
    expect(r.status).toBe('wygaslo');
    expect(r.wydarzenia).toEqual([]);
    expect(opisAdr(r, 'firma').okno).toBe('minął');
  });
  it('błędne dane', () => {
    expect(() => zaswiadczenieAdr({ waznyDo: '2027-02-30', dzis: '2026-11-13' })).toThrow(RangeError);
    expect(() => zaswiadczenieAdr({ waznyDo: '2027-05-20', egzamin: '2020-01-01', dzis: '2026-11-13' })).toThrow(RangeError);
  });
});

describe('teksty wyniku', () => {
  it('status przed okresem i zapas', () => {
    const o = opisAdr(zaswiadczenieAdr({ waznyDo: '2027-05-20', dzis: '2026-02-01' }), 'firma');
    expect(o.status).toBe('Ważne: kurs doskonalący za 109 dni');
    expect(o.okno).toBe('od 21 maja 2026 r. do 19 maja 2027 r.');
    expect(o.zapas).toBe('do 6 maja 2027 r. (nasz rachunek: 14 dni na wydanie)');
    expect(o.nowy).toBe('co najmniej do 19 maja 2032 r.');
  });
  it('zapas minął w ostatnich 14 dniach', () => {
    const o = opisAdr(zaswiadczenieAdr({ waznyDo: '2027-05-20', dzis: '2027-05-10' }), 'firma');
    expect(o.status).toBe('Czas na kurs doskonalący: zostało 10 dni');
    expect(o.zapas).toBe('minął');
  });
  it('kto płaci (art. 39)', () => {
    expect(ktoPlaci('firma')).toContain('art. 39 pkt 1');
    expect(ktoPlaci('wlasna-firma')).toContain('osobiście');
    expect(ktoPlaci('sam')).toContain('art. 39 pkt 2');
  });
});
