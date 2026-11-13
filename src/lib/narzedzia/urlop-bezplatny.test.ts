import { describe, expect, it } from 'vitest';
import { koniecMiesiecy, miesiacePracy, tekstyWyniku, urlopBezplatny, type DaneUrlopuBezplatnego } from './urlop-bezplatny';

// Oczekiwane wartości sprawdzone niezależnie w Pythonie (datetime, calendar), skrypt urlop-bezplatny.py.
const lata = (d: DaneUrlopuBezplatnego) => urlopBezplatny(d).lata.map((r) => [r.rok, r.miesiacePracy, r.dni, r.podstawa, r.drugieOdczytanie?.dni ?? null]);

describe('urlop bezpłatny a urlop wypoczynkowy (art. 155^2, 155^2a, 155^3 Kp)', () => {
  it('1.03–31.05.2026: powrót w tym samym roku, 26 × 9/12 = 19,5 → 20 dni; 10 lat przesuwa się na 15.09.2027', () => {
    const r = urlopBezplatny({ od: '2026-03-01', do: '2026-05-31', rodzaj: 'bezplatny', wymiar: 26, data10Lat: '2027-06-15' });
    expect(r).toMatchObject({
      dni: 92,
      coNajmniejMiesiac: true,
      lata: [{ rok: 2026, miesiacePracy: 9, proporcja: 20, dni: 20, podstawa: 'obnizenie', drugieOdczytanie: null }],
      zostalo: { dni: 20, drugieOdczytanie: null },
      dluzszyNiz3Miesiace: false,
      nieWliczaSieDoStazu: 92,
      przesuniecie10Lat: 92,
      nowaData10Lat: '2027-09-15',
      swiadczeniaZdrowotneDo: '2026-03-31',
    });
  });
  it('15.03–14.05.2026: tylko kwiecień bez pracy, 11/12 → 24 dni', () => {
    expect(lata({ od: '2026-03-15', do: '2026-05-14', rodzaj: 'bezplatny', wymiar: 26 })).toEqual([[2026, 11, 24, 'obnizenie', null]]);
  });
  it('przełom roku 1.11.2026–28.02.2027: bez powrotu w 2026 bez obniżenia (26), w 2027 10/12 → 22', () => {
    const r = urlopBezplatny({ od: '2026-11-01', do: '2027-02-28', rodzaj: 'bezplatny', wymiar: 26 });
    expect(r.lata.map((x) => [x.rok, x.dni, x.podstawa])).toEqual([[2026, 26, 'brak-powrotu'], [2027, 22, 'powrot']]);
    expect(r).toMatchObject({ dni: 120, dluzszyNiz3Miesiace: true, swiadczeniaZdrowotneDo: '2026-12-01', zostalo: null });
  });
  it('urlop do 31 grudnia: brak powrotu w tym roku, 26 dni', () => {
    expect(lata({ od: '2026-06-01', do: '2026-12-31', rodzaj: 'bezplatny', wymiar: 26 })).toEqual([[2026, 5, 26, 'brak-powrotu', null]]);
  });
  it('rok w całości na urlopie: 0 dni, drugie odczytanie pełny wymiar; wymiar 20', () => {
    expect(lata({ od: '2026-06-01', do: '2028-03-15', rodzaj: 'bezplatny', wymiar: 20 })).toEqual([
      [2026, 5, 20, 'brak-powrotu', null],
      [2027, 0, 0, 'caly-rok', 20],
      [2028, 10, 17, 'powrot', null],
    ]);
  });
  it('miesiąc liczony od dnia po rozpoczęciu: 1.03–31.03 krócej (drugie odczytanie 24), 1.03–1.04 już miesiąc (24 dni)', () => {
    expect(koniecMiesiecy('2026-03-01', 1)).toBe('2026-04-01');
    expect(lata({ od: '2026-03-01', do: '2026-03-31', rodzaj: 'bezplatny', wymiar: 26 })).toEqual([[2026, 11, 26, 'bez-zmian', 24]]);
    expect(lata({ od: '2026-03-01', do: '2026-04-01', rodzaj: 'bezplatny', wymiar: 26 })).toEqual([[2026, 11, 24, 'obnizenie', null]]);
  });
  it('29 lutego 2028: miesiąc do 29 marca; 31 stycznia: miesiąc do 28 lutego', () => {
    expect(urlopBezplatny({ od: '2028-02-29', do: '2028-03-28', rodzaj: 'bezplatny', wymiar: 26 })).toMatchObject({ dni: 29, coNajmniejMiesiac: false });
    expect(urlopBezplatny({ od: '2028-02-29', do: '2028-03-29', rodzaj: 'bezplatny', wymiar: 26 })).toMatchObject({ dni: 30, coNajmniejMiesiac: true, lata: [{ dni: 26 }] });
    expect(lata({ od: '2026-01-31', do: '2026-02-27', rodzaj: 'bezplatny', wymiar: 26 })).toEqual([[2026, 12, 26, 'bez-zmian', null]]);
    expect(lata({ od: '2026-01-31', do: '2026-02-28', rodzaj: 'bezplatny', wymiar: 26 })).toEqual([[2026, 11, 24, 'obnizenie', null]]);
  });
  it('wyjątek „chyba że”: wykorzystane 20 ≥ 20 → 0 do wykorzystania, drugie odczytanie 26 (zostaje 6); 19 → 1', () => {
    const a = urlopBezplatny({ od: '2026-03-01', do: '2026-05-31', rodzaj: 'bezplatny', wymiar: 26, wykorzystanePrzed: 20 });
    expect(a.lata[0]).toMatchObject({ dni: 20, drugieOdczytanie: { dni: 26, powod: 'wyjatek' } });
    expect(a.zostalo).toEqual({ dni: 0, drugieOdczytanie: 6 });
    const b = urlopBezplatny({ od: '2026-03-01', do: '2026-05-31', rodzaj: 'bezplatny', wymiar: 26, wykorzystanePrzed: 19 });
    expect(b.lata[0]).toMatchObject({ dni: 20, drugieOdczytanie: null });
    expect(b.zostalo).toEqual({ dni: 1, drugieOdczytanie: null });
  });
  it('urlop wychowawczy: rok rozpoczęcia bez obniżenia, rok powrotu 7/12 → 16; 10 lat w czasie urlopu → dzień zakończenia', () => {
    expect(lata({ od: '2026-03-01', do: '2026-05-31', rodzaj: 'wychowawczy', wymiar: 26 })).toEqual([[2026, 9, 26, 'wychowawczy', null]]);
    const r = urlopBezplatny({ od: '2026-06-01', do: '2027-05-31', rodzaj: 'wychowawczy', wymiar: 26, data10Lat: '2027-03-10' });
    expect(r.lata.map((x) => [x.rok, x.dni, x.podstawa])).toEqual([[2026, 26, 'wychowawczy'], [2027, 16, 'powrot']]);
    expect(r).toMatchObject({ nieWliczaSieDoStazu: 0, nowaData10Lat: '2027-05-31', przesuniecie10Lat: 82, swiadczeniaZdrowotneDo: null });
    expect(urlopBezplatny({ od: '2026-06-01', do: '2027-05-31', rodzaj: 'wychowawczy', wymiar: 26, data10Lat: '2027-06-15' }).nowaData10Lat).toBe('2027-06-15');
  });
  it('art. 174^1: obniżenie jak przy urlopie bezpłatnym, drugie odczytanie 26; staż bez przesunięcia', () => {
    const r = urlopBezplatny({ od: '2026-03-01', do: '2026-05-31', rodzaj: 'inny-pracodawca', wymiar: 26, data10Lat: '2027-06-15' });
    expect(r.lata[0]).toMatchObject({ dni: 20, drugieOdczytanie: { dni: 26, powod: 'art-174-1' } });
    expect(r).toMatchObject({ nieWliczaSieDoStazu: 0, nowaData10Lat: '2027-06-15', swiadczeniaZdrowotneDo: null });
  });
  it('nieobecność nieusprawiedliwiona: obniżenie jak przy urlopie bezpłatnym, staż nieliczony', () => {
    const r = urlopBezplatny({ od: '2026-03-01', do: '2026-05-31', rodzaj: 'nieobecnosc', wymiar: 26, data10Lat: '2027-06-15' });
    expect(r.lata[0].dni).toBe(20);
    expect(r.przesuniecie10Lat).toBe(0);
  });
  it('3 miesiące: 1.03–1.06 nie jest dłuższy, 1.03–2.06 jest', () => {
    expect(urlopBezplatny({ od: '2026-03-01', do: '2026-06-01', rodzaj: 'bezplatny', wymiar: 26 })).toMatchObject({ dni: 93, dluzszyNiz3Miesiace: false, lata: [{ dni: 20 }] });
    expect(urlopBezplatny({ od: '2026-03-01', do: '2026-06-02', rodzaj: 'bezplatny', wymiar: 26 })).toMatchObject({ dni: 94, dluzszyNiz3Miesiace: true });
  });
  it('urlop od 1 stycznia: proporcja z § 1 także dla wychowawczego; urlop po dacie 10 lat jej nie przesuwa', () => {
    expect(lata({ od: '2026-01-01', do: '2026-03-31', rodzaj: 'wychowawczy', wymiar: 26 })).toEqual([[2026, 9, 20, 'powrot', null]]);
    expect(urlopBezplatny({ od: '2026-03-01', do: '2026-05-31', rodzaj: 'bezplatny', wymiar: 26, data10Lat: '2026-02-01' })).toMatchObject({ nieWliczaSieDoStazu: 92, przesuniecie10Lat: 0 });
  });
  it('1 maja (święto) liczy się jak każdy dzień; cały maj to mniej niż miesiąc od dnia po rozpoczęciu', () => {
    expect(miesiacePracy(2026, '2026-05-01', '2026-05-31')).toBe(11);
    expect(urlopBezplatny({ od: '2026-05-01', do: '2026-05-31', rodzaj: 'bezplatny', wymiar: 26 }).coNajmniejMiesiac).toBe(false);
    expect(lata({ od: '2026-05-02', do: '2026-06-02', rodzaj: 'bezplatny', wymiar: 26 })).toEqual([[2026, 12, 26, 'obnizenie', null]]);
  });
  it('błędne dane: RangeError', () => {
    const ok = { od: '2026-03-01', do: '2026-05-31', rodzaj: 'bezplatny' as const, wymiar: 26 };
    expect(() => urlopBezplatny({ ...ok, do: '2026-02-28' })).toThrow(RangeError);
    expect(() => urlopBezplatny({ ...ok, od: '2026-02-30' })).toThrow(RangeError);
    expect(() => urlopBezplatny({ ...ok, do: '2032-03-01' })).toThrow(RangeError);
    expect(() => urlopBezplatny({ ...ok, wymiar: 27 })).toThrow(RangeError);
    expect(() => urlopBezplatny({ ...ok, wymiar: 1.5 })).toThrow(RangeError);
    expect(() => urlopBezplatny({ ...ok, wykorzystanePrzed: 27 })).toThrow(RangeError);
    expect(() => urlopBezplatny({ ...ok, data10Lat: '2027-13-01' })).toThrow(RangeError);
  });
  it('teksty wyniku: przełom roku, staż, odwołanie, świadczenia zdrowotne, art. 41', () => {
    const t = tekstyWyniku({ od: '2026-11-01', do: '2027-02-28', rodzaj: 'bezplatny', wymiar: 26, wykorzystanePrzed: 5, data10Lat: '2030-01-10' });
    expect(t.glowna).toBe('26 dni');
    expect(t.lata.map((x) => x.wartosc)).toEqual([
      '26 dni, bez obniżenia: brak powrotu w tym samym roku (art. 155^2 § 2)',
      '22 dni, praca w 10 z 12 miesięcy, do końca roku (art. 155^2 § 1)',
    ]);
    expect(t.pozycje.map((x) => x.wartosc)).toEqual([
      '120 dni nie wlicza się do okresu pracy, od którego zależą uprawnienia (art. 174 § 2)',
      '10 maja 2030 r., później o 120 dni',
      'Kodeks przewiduje je przy urlopie dłuższym niż 3 miesiące, jeśli strony to przewidziały (art. 174 § 3)',
    ]);
    expect(t.ubezpieczenia[2]).toContain('po 1 grudnia 2026 r.');
    expect(t.ochrona).toMatch(/^„Pracodawca nie może wypowiedzieć/);
  });
  it('teksty: „po odjęciu 1 dnia”, drugie odczytanie wyjątku; nieobecność bez cytatu art. 41', () => {
    const t = tekstyWyniku({ od: '2026-03-01', do: '2026-05-31', rodzaj: 'bezplatny', wymiar: 26, wykorzystanePrzed: 1 });
    expect(t.pozycje[0].wartosc).toBe('19 dni po odjęciu 1 dnia wykorzystanego urlopu');
    const u = tekstyWyniku({ od: '2026-03-01', do: '2026-05-31', rodzaj: 'bezplatny', wymiar: 26, wykorzystanePrzed: 20 });
    expect(u.lata.map((x) => x.etykieta)).toEqual(['Urlop wypoczynkowy za 2026', 'Drugie odczytanie za 2026']);
    expect(u.pozycje.slice(0, 2).map((x) => x.wartosc)).toEqual(['0 dni po odjęciu 20 dni wykorzystanego urlopu', '6 dni']);
    expect(tekstyWyniku({ od: '2026-03-01', do: '2026-05-31', rodzaj: 'nieobecnosc', wymiar: 26 }).ochrona).toContain('nie obejmuje');
  });
  it('drugie odczytanie przy liczeniu miesiąca z dniem rozpoczęcia: 1.05–31.05 i 1.03–31.03 → 26, drugie 24; 1.03–30.03 bez', () => {
    expect(lata({ od: '2026-05-01', do: '2026-05-31', rodzaj: 'bezplatny', wymiar: 26 })).toEqual([[2026, 11, 26, 'bez-zmian', 24]]);
    expect(urlopBezplatny({ od: '2026-05-01', do: '2026-05-31', rodzaj: 'bezplatny', wymiar: 26 }).lata[0].drugieOdczytanie).toEqual({ dni: 24, powod: 'z-dniem-rozpoczecia' });
    expect(lata({ od: '2026-03-01', do: '2026-03-31', rodzaj: 'bezplatny', wymiar: 26 })).toEqual([[2026, 11, 26, 'bez-zmian', 24]]);
    expect(lata({ od: '2026-03-01', do: '2026-03-30', rodzaj: 'bezplatny', wymiar: 26 })).toEqual([[2026, 12, 26, 'bez-zmian', null]]);
    expect(lata({ od: '2026-05-01', do: '2026-05-31', rodzaj: 'wychowawczy', wymiar: 26 })).toEqual([[2026, 11, 26, 'bez-zmian', null]]);
    const t = tekstyWyniku({ od: '2026-05-01', do: '2026-05-31', rodzaj: 'bezplatny', wymiar: 26 });
    expect(t.lata[1].wartosc).toBe('24 dni, przy liczeniu miesiąca z dniem rozpoczęcia urlopu; przepis tego nie rozstrzyga');
  });
  it('3 miesiące: 1.03–1.06 nie jest dłuższy, ale byłby przy liczeniu z dniem rozpoczęcia (uwaga)', () => {
    const r = urlopBezplatny({ od: '2026-03-01', do: '2026-06-01', rodzaj: 'bezplatny', wymiar: 26 });
    expect(r).toMatchObject({ dluzszyNiz3Miesiace: false, dluzszyNiz3MiesiaceZDniem: true });
    expect(tekstyWyniku({ od: '2026-03-01', do: '2026-06-01', rodzaj: 'bezplatny', wymiar: 26 }).pozycje.at(-1)!.wartosc).toContain('przy liczeniu z dniem rozpoczęcia ten urlop byłby dłuższy');
  });
});
