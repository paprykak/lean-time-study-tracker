import { describe, expect, it } from 'vitest';
import { koniecMiesiecy, miesiacePracy, tekstyWyniku, urlopBezplatny } from './urlop-bezplatny';

// Oczekiwane wartości sprawdzone niezależnie w Pythonie (datetime, calendar).
const lata = (d: Parameters<typeof urlopBezplatny>[0]) => urlopBezplatny(d).lata.map((r) => [r.rok, r.miesiacePracy, r.dni]);

describe('urlop bezpłatny a urlop wypoczynkowy (art. 155^2, 155^2a, 155^3 Kp)', () => {
  it('1.03–31.05.2026: 9 miesięcy pracy, 26 × 9/12 = 19,5 → 20 dni; 92 dni poza stażem, 10 lat przesuwa się na 15.09.2027', () => {
    const r = urlopBezplatny({ od: '2026-03-01', do: '2026-05-31', rodzaj: 'bezplatny', wymiar: 26, data10Lat: '2027-06-15' });
    expect(r).toMatchObject({
      dni: 92,
      coNajmniejMiesiac: true,
      lata: [{ rok: 2026, miesiacePracy: 9, dni: 20, podstawa: 'proporcja' }],
      doWykorzystaniaWRokuRozpoczecia: 20,
      dluzszyNiz3Miesiace: false,
      nieWliczaSieDoStazu: 92,
      przesuniecie10Lat: 92,
      nowaData10Lat: '2027-09-15',
      swiadczeniaZdrowotneDo: '2026-03-31',
    });
  });
  it('15.03–14.05.2026: tylko kwiecień bez pracy, 11/12 → 24 dni', () => {
    expect(lata({ od: '2026-03-15', do: '2026-05-14', rodzaj: 'bezplatny', wymiar: 26 })).toEqual([[2026, 11, 24]]);
  });
  it('przełom roku 1.11.2026–28.02.2027: po 10/12 w każdym roku, 22 dni; dłuższy niż 3 miesiące', () => {
    const r = urlopBezplatny({ od: '2026-11-01', do: '2027-02-28', rodzaj: 'bezplatny', wymiar: 26 });
    expect(r.lata.map((x) => [x.rok, x.miesiacePracy, x.dni])).toEqual([[2026, 10, 22], [2027, 10, 22]]);
    expect(r).toMatchObject({ dni: 120, dluzszyNiz3Miesiace: true, swiadczeniaZdrowotneDo: '2026-12-01' });
  });
  it('rok w całości na urlopie: 0 miesięcy, 0 dni; wymiar 20', () => {
    expect(lata({ od: '2026-06-01', do: '2028-03-15', rodzaj: 'bezplatny', wymiar: 20 })).toEqual([[2026, 5, 9], [2027, 0, 0], [2028, 10, 17]]);
  });
  it('29 lutego 2028: miesiąc kończy się 28 marca; 28 dni to mniej niż miesiąc', () => {
    expect(koniecMiesiecy('2028-02-29', 1)).toBe('2028-03-28');
    expect(urlopBezplatny({ od: '2028-02-29', do: '2028-03-28', rodzaj: 'bezplatny', wymiar: 26 })).toMatchObject({ dni: 29, coNajmniejMiesiac: true });
    expect(urlopBezplatny({ od: '2028-02-29', do: '2028-03-27', rodzaj: 'bezplatny', wymiar: 26 })).toMatchObject({ dni: 28, coNajmniejMiesiac: false });
  });
  it('krótszy niż miesiąc od 31 stycznia: do 27 lutego bez zmian, do 28 lutego już miesiąc (Kc art. 112)', () => {
    expect(urlopBezplatny({ od: '2026-01-31', do: '2026-02-27', rodzaj: 'bezplatny', wymiar: 26 }).lata).toEqual([{ rok: 2026, miesiacePracy: 12, proporcja: 26, dni: 26, podstawa: 'bez-zmian' }]);
    expect(lata({ od: '2026-01-31', do: '2026-02-28', rodzaj: 'bezplatny', wymiar: 26 })).toEqual([[2026, 11, 24]]);
  });
  it('wykorzystany przed urlopem ≥ obniżony wymiar: bez obniżenia; o dzień mniej: obniżenie', () => {
    const a = urlopBezplatny({ od: '2026-03-01', do: '2026-05-31', rodzaj: 'bezplatny', wymiar: 26, wykorzystanePrzed: 20 });
    expect(a.lata[0]).toMatchObject({ dni: 26, podstawa: 'wykorzystany' });
    expect(a.doWykorzystaniaWRokuRozpoczecia).toBe(6);
    const b = urlopBezplatny({ od: '2026-03-01', do: '2026-05-31', rodzaj: 'bezplatny', wymiar: 26, wykorzystanePrzed: 19 });
    expect(b.lata[0]).toMatchObject({ dni: 20, podstawa: 'proporcja' });
    expect(b.doWykorzystaniaWRokuRozpoczecia).toBe(1);
  });
  it('urlop wychowawczy: w roku rozpoczęcia bez obniżenia, w roku powrotu proporcja; staż bez przesunięcia', () => {
    expect(lata({ od: '2026-03-01', do: '2026-05-31', rodzaj: 'wychowawczy', wymiar: 26 })).toEqual([[2026, 9, 26]]);
    const r = urlopBezplatny({ od: '2026-06-01', do: '2027-05-31', rodzaj: 'wychowawczy', wymiar: 26, data10Lat: '2027-06-15' });
    expect(r.lata.map((x) => [x.rok, x.dni, x.podstawa])).toEqual([[2026, 26, 'wychowawczy'], [2027, 16, 'proporcja']]);
    expect(r).toMatchObject({ nieWliczaSieDoStazu: 0, przesuniecie10Lat: 0, nowaData10Lat: '2027-06-15', swiadczeniaZdrowotneDo: null });
  });
  it('art. 174^1: bez obniżenia i bez przesunięcia stażu', () => {
    const r = urlopBezplatny({ od: '2026-03-01', do: '2026-05-31', rodzaj: 'inny-pracodawca', wymiar: 26, data10Lat: '2027-06-15' });
    expect(r.lata).toEqual([{ rok: 2026, miesiacePracy: 9, proporcja: 20, dni: 26, podstawa: 'inny-pracodawca' }]);
    expect(r).toMatchObject({ nieWliczaSieDoStazu: 0, nowaData10Lat: '2027-06-15', swiadczeniaZdrowotneDo: null });
  });
  it('nieobecność nieusprawiedliwiona: obniżenie jak przy urlopie bezpłatnym, staż nieliczony', () => {
    const r = urlopBezplatny({ od: '2026-03-01', do: '2026-05-31', rodzaj: 'nieobecnosc', wymiar: 26, data10Lat: '2027-06-15' });
    expect(r.lata[0].dni).toBe(20);
    expect(r.przesuniecie10Lat).toBe(0);
  });
  it('3 miesiące: 1.03–31.05 nie jest dłuższy, 1.03–1.06 jest (93 dni, nadal 9 miesięcy pracy)', () => {
    expect(koniecMiesiecy('2026-03-01', 3)).toBe('2026-05-31');
    expect(urlopBezplatny({ od: '2026-03-01', do: '2026-06-01', rodzaj: 'bezplatny', wymiar: 26 })).toMatchObject({ dni: 93, dluzszyNiz3Miesiace: true, lata: [{ dni: 20 }] });
  });
  it('urlop od 1 stycznia: proporcja z § 1 także dla wychowawczego; urlop zaczęty po dacie 10 lat jej nie przesuwa', () => {
    expect(lata({ od: '2026-01-01', do: '2026-03-31', rodzaj: 'wychowawczy', wymiar: 26 })).toEqual([[2026, 9, 20]]);
    expect(urlopBezplatny({ od: '2026-03-01', do: '2026-05-31', rodzaj: 'bezplatny', wymiar: 26, data10Lat: '2026-02-01' })).toMatchObject({ nieWliczaSieDoStazu: 92, przesuniecie10Lat: 0 });
  });
  it('miesiące pracy liczy po kalendarzu, 1 maja (święto) liczy się jak każdy dzień', () => {
    expect(miesiacePracy(2026, '2026-05-01', '2026-05-31')).toBe(11);
    expect(miesiacePracy(2026, '2026-05-02', '2026-05-31')).toBe(12);
  });
  it('błędne dane: RangeError', () => {
    const ok = { od: '2026-03-01', do: '2026-05-31', rodzaj: 'bezplatny' as const, wymiar: 26 };
    expect(() => urlopBezplatny({ ...ok, do: '2026-02-28' })).toThrow(RangeError);
    expect(() => urlopBezplatny({ ...ok, od: '2026-02-30' })).toThrow(RangeError);
    expect(() => urlopBezplatny({ ...ok, do: '2032-03-01' })).toThrow(RangeError);
    expect(() => urlopBezplatny({ ...ok, wymiar: 27 })).toThrow(RangeError);
    expect(() => urlopBezplatny({ ...ok, wykorzystanePrzed: 27 })).toThrow(RangeError);
    expect(() => urlopBezplatny({ ...ok, data10Lat: '2027-13-01' })).toThrow(RangeError);
  });
  it('teksty wyniku: rok po roku, staż, 10 lat i świadczenia zdrowotne', () => {
    const t = tekstyWyniku({ od: '2026-11-01', do: '2027-02-28', rodzaj: 'bezplatny', wymiar: 26, wykorzystanePrzed: 5, data10Lat: '2030-01-10' });
    expect(t.glowna).toBe('22 dni');
    expect(t.lata.map((x) => x.wartosc)).toEqual(['22 dni (praca w 10 z 12 miesięcy)', '22 dni (praca w 10 z 12 miesięcy)']);
    expect(t.pozycje.map((x) => x.wartosc)).toEqual([
      '17 dni po odjęciu 5 dni',
      '120 dni nie wlicza się (art. 174 § 2)',
      '10 maja 2030 r., później o 120 dni',
      'możliwe z ważnych przyczyn, jeśli strony przewidziały to przy udzielaniu urlopu (art. 174 § 3)',
    ]);
    expect(t.ubezpieczenia[2]).toContain('po 1 grudnia 2026 r.');
  });
});
