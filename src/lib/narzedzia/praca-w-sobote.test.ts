import { describe, expect, it } from 'vitest';
import { opisWyniku, pracaWSobote } from './praca-w-sobote';

// Oczekiwane wartości sprawdzone niezależnie w Pythonie (datetime, calendar, Decimal).
const baza = { data: '2026-11-21', od: '6:00', do: '16:00', okres: 1, poraNocna: '22:00', stawka: 35 };

describe('praca w dniu wolnym z pięciodniowego tygodnia (art. 151^3, 151^1 Kp)', () => {
  it('sobota 21.11.2026, 6:00–16:00, 35 zł: dzień wolny do 30.11, A 35 zł, B 280 + 35 zł', () => {
    const r = pracaWSobote(baza);
    expect(r).toMatchObject({ rodzaj: 'zwykly', innaZasada: false, dzienTygodnia: 6, dzienWolnyDo: '2026-11-30' });
    expect(r).toMatchObject({ razem: 600, doOsmej: 480, poOsmej: 120, poOsmejNoc: 0, poOsmejDzien: 120 });
    expect(r.a).toEqual({ bezDodatku: 480, z100: 0, z50: 120, kwoty: { dodatek: 35, normalne: 70, razem: 105 } });
    expect(r.b).toEqual({ z100: 480, z50: 120, kwoty: { dodatek: 315, normalne: 350, razem: 665 } });
  });

  it('nocna zmiana 18:00–6:00 (12 h): godziny 9.–12. w porze nocnej → 100%', () => {
    const r = pracaWSobote({ ...baza, data: '2026-11-28', od: '18:00', do: '6:00' });
    expect(r).toMatchObject({ razem: 720, poOsmej: 240, poOsmejNoc: 240, poOsmejDzien: 0, wNiedzieleSwieto: 0 });
    expect(r.a.kwoty).toEqual({ dodatek: 140, normalne: 140, razem: 280 });
    expect(r.b.kwoty).toEqual({ dodatek: 420, normalne: 420, razem: 840 });
    // pora nocna od 21:00 (21:00–5:00): 2:00–5:00 noc, 5:00–6:00 dzień
    const r21 = pracaWSobote({ ...baza, data: '2026-11-28', od: '18:00', do: '6:00', poraNocna: '21:00' });
    expect(r21).toMatchObject({ poOsmejNoc: 180, poOsmejDzien: 60 });
    expect(r21.a.kwoty?.dodatek).toBe(122.5);
    expect(r21.b.kwoty?.dodatek).toBe(402.5);
  });

  it('pora nocna od 23:00, stawka z groszami: 14:00–23:30 przy 32,50 zł', () => {
    const r = pracaWSobote({ ...baza, od: '14:00', do: '23:30', poraNocna: '23:00', stawka: 32.5 });
    expect(r).toMatchObject({ razem: 570, poOsmejNoc: 30, poOsmejDzien: 60 });
    expect(r.a.kwoty).toEqual({ dodatek: 32.5, normalne: 48.75, razem: 81.25 });
    expect(r.b.kwoty).toEqual({ dodatek: 292.5, normalne: 308.75, razem: 601.25 });
  });

  it('próg 8 godzin: dokładnie 8 h i krócej → w A bez dodatku, cały dzień wolny', () => {
    const r8 = pracaWSobote({ ...baza, od: '7:00', do: '15:00' });
    expect(r8).toMatchObject({ doOsmej: 480, poOsmej: 0 });
    expect(r8.a.kwoty).toEqual({ dodatek: 0, normalne: 0, razem: 0 });
    expect(r8.b.kwoty).toEqual({ dodatek: 280, normalne: 280, razem: 560 });
    const r4 = pracaWSobote({ ...baza, od: '8:00', do: '12:00' });
    expect(r4.b).toEqual({ z100: 240, z50: 0, kwoty: { dodatek: 140, normalne: 140, razem: 280 } });
    const prawie24 = pracaWSobote({ ...baza, od: '6:00', do: '5:59' });
    expect(prawie24).toMatchObject({ razem: 1439, poOsmejNoc: 479, poOsmejDzien: 480 });
    expect(prawie24.a.kwoty?.dodatek).toBe(419.42);
  });

  it('termin dnia wolnego: okres 3 i 12 miesięcy, luty, rok przestępny', () => {
    expect(pracaWSobote({ ...baza, okres: 3 }).dzienWolnyDo).toBe('2026-12-31');
    expect(pracaWSobote({ ...baza, okres: 12 }).dzienWolnyDo).toBe('2026-12-31');
    expect(pracaWSobote({ ...baza, data: '2026-02-28' }).dzienWolnyDo).toBe('2026-02-28');
    expect(pracaWSobote({ ...baza, data: '2028-02-26' }).dzienWolnyDo).toBe('2028-02-29');
  });

  it('święto w sobotę i niedziela: inne zasady; zmiana wchodząca w niedzielę po 6:00', () => {
    expect(pracaWSobote({ ...baza, data: '2026-12-26' })).toMatchObject({ rodzaj: 'swieto', innaZasada: true, nazwaSwieta: expect.stringContaining('Bożego Narodzenia') });
    expect(pracaWSobote({ ...baza, data: '2026-11-22' })).toMatchObject({ rodzaj: 'niedziela', innaZasada: true });
    expect(pracaWSobote({ ...baza, data: '2026-11-20' })).toMatchObject({ innaZasada: false, dzienTygodnia: 5 });
    expect(pracaWSobote({ ...baza, od: '22:00', do: '10:00' }).wNiedzieleSwieto).toBe(240);
    // wtorek 10.11.2026 jako dzień wolny z grafiku, zmiana do 7:00 w święto 11 listopada: 1 h w święto
    expect(pracaWSobote({ ...baza, data: '2026-11-10', od: '22:00', do: '7:00' })).toMatchObject({ innaZasada: false, wNiedzieleSwieto: 60 });
    expect(pracaWSobote({ ...baza, data: '2026-12-24' })).toMatchObject({ rodzaj: 'swieto', innaZasada: true });
  });

  it('bez stawki: bez kwot', () => {
    const r = pracaWSobote({ ...baza, stawka: null });
    expect(r.a.kwoty).toBeNull();
    expect(r.b.kwoty).toBeNull();
  });

  it('błędne dane: RangeError', () => {
    expect(() => pracaWSobote({ ...baza, do: '6:00' })).toThrow(RangeError);
    expect(() => pracaWSobote({ ...baza, od: '25:00' })).toThrow(RangeError);
    expect(() => pracaWSobote({ ...baza, od: '6.00' })).toThrow(RangeError);
    expect(() => pracaWSobote({ ...baza, stawka: -1 })).toThrow(RangeError);
    expect(() => pracaWSobote({ ...baza, stawka: Number.NaN })).toThrow(RangeError);
    expect(() => pracaWSobote({ ...baza, data: '2026-02-30' })).toThrow(RangeError);
    expect(() => pracaWSobote({ ...baza, okres: 5 })).toThrow(RangeError);
    expect(() => pracaWSobote({ ...baza, poraNocna: '20:00' })).toThrow(RangeError);
  });

  it('opis wyniku: wiersze wariantów A i B, uwagi', () => {
    const o = opisWyniku(pracaWSobote(baza), baza.data);
    expect(o.data).toBe('30 listopada 2026 r.');
    expect(o.godziny).toBe('10 h: 8 h + 2 h nadgodzin dobowych');
    expect(o.a).toEqual([
      ['Pierwsze 8 h', 'bez dodatku, rozlicza je dzień wolny'],
      ['2 h nadgodzin, dodatek 50%', expect.stringMatching(/^35,00\szł$/)],
      ['Normalne wynagrodzenie za 2 h nadgodzin', expect.stringMatching(/^70,00\szł$/)],
      ['Razem za nadgodziny', expect.stringMatching(/^105,00\szł$/)],
    ]);
    expect(o.b.map((w) => w[0])).toEqual(['8 h ponad wymiar okresu, dodatek 100%', '2 h nadgodzin, dodatek 50%', 'Normalne wynagrodzenie za 10 h ponad wymiar', 'Razem za ten dzień']);
    expect(o.b[0][1]).toMatch(/^280,00\szł$/);
    expect(o.uwagi).toEqual([]);
    expect(opisWyniku(pracaWSobote({ ...baza, stawka: null }), baza.data).b[0][1]).toBe('100% stawki za godzinę');
    const swieto = opisWyniku(pracaWSobote({ ...baza, data: '2026-12-26' }), '2026-12-26');
    expect(swieto.a).toEqual([]);
    expect(swieto.uwagi[0]).toContain('kalkulator pracy w niedzielę i święto');
    expect(opisWyniku(pracaWSobote({ ...baza, data: '2026-11-20' }), '2026-11-20').uwagi[0]).toContain('piątek');
    expect(opisWyniku(pracaWSobote({ ...baza, od: '22:00', do: '10:00' }), baza.data).uwagi[0]).toContain('4 h to praca w niedzielę');
  });
});
