import { describe, expect, it } from 'vitest';
import { godzinySlownie, nadgodzinyOkresu, opisWymiaruOkresu, tekstyWyniku, ulamekEtatu, type DaneOkresu } from './nadgodziny-okres';

// Wymiary (calendar, Wielkanoc algorytmem Gaussa) i średnie (Fraction) sprawdzone niezależnie w Pythonie.
const PELNY: DaneOkresu = { rok: 2026, miesiac: 11, miesiecy: 1, etat: 1, przepracowane: 184, dobowe: 10, nieobecnosc: 0, stawka: 40 };

describe('nadgodziny średniotygodniowe (art. 130, 131, 151 i 151¹ § 2 Kp)', () => {
  it('listopad 2026, pełny etat: wymiar 160 h, 14 h średniotygodniowych, 560 zł, średnia 42,93 h', () => {
    const r = nadgodzinyOkresu(PELNY);
    expect(r).toMatchObject({
      od: '2026-11-01',
      do: '2026-11-30',
      dni: 30,
      wymiarPelny: 160,
      wymiarPoObnizeniu: 160,
      ponadwymiarowe: 0,
      sredniotygodniowe: 14,
      brakuje: 0,
      dodatek: 560,
      sredniaKp: 42.93,
      sredniaBezNieobecnosci: 42.93,
      limitDochowany: true,
      doLimitu: 21.71,
    });
    expect(opisWymiaruOkresu(r.wymiar)).toBe('21 dni od poniedziałku do piątku, minus święto: 11 listopada');
    expect(godzinySlownie(r.sredniotygodniowe)).toBe('14 godzin');
  });

  it('4 miesiące od stycznia 2026 z urlopem 40 h: wymiar 664 h, po obniżeniu 624 h, 64 h, średnie 40,83 i 43,36 h', () => {
    const r = nadgodzinyOkresu({ ...PELNY, miesiac: 1, miesiecy: 4, przepracowane: 700, dobowe: 12, nieobecnosc: 40, stawka: 35 });
    expect(r).toMatchObject({ dni: 120, wymiarPelny: 664, wymiarPoObnizeniu: 624, sredniotygodniowe: 64, dodatek: 2240, sredniaKp: 40.83, sredniaBezNieobecnosci: 43.36, doLimitu: 74.86 });
    expect(r.wymiar.swietaObnizajace.map((s) => s.data)).toEqual(['2026-01-01', '2026-01-06', '2026-04-06']);
  });

  it('luty 2026 (4 tygodnie): 192 h to dokładnie 48 h średnio i jeszcze limit; 192,5 h już ponad', () => {
    expect(nadgodzinyOkresu({ ...PELNY, miesiac: 2, przepracowane: 192, dobowe: 0, stawka: undefined })).toMatchObject({
      wymiarPelny: 160,
      sredniotygodniowe: 32,
      dodatek: null,
      sredniaKp: 48,
      limitDochowany: true,
      doLimitu: 0,
    });
    expect(nadgodzinyOkresu({ ...PELNY, miesiac: 2, przepracowane: 192.5, dobowe: 0 })).toMatchObject({ sredniotygodniowe: 32.5, sredniaKp: 48.13, limitDochowany: false });
  });

  it('średnia bez tygodni nieobecności przekracza 48 h, choć średnia z Kp nie', () => {
    expect(nadgodzinyOkresu({ ...PELNY, miesiac: 2, przepracowane: 180, dobowe: 0, nieobecnosc: 20 })).toMatchObject({
      sredniaKp: 45,
      sredniaBezNieobecnosci: 51.43,
      limitDochowany: false,
      doLimitu: 0,
    });
  });

  it('luty 2028 (rok przestępny, 29 dni): wymiar 168 h, z L4 8 h próg 160 h, 16 h', () => {
    expect(nadgodzinyOkresu({ ...PELNY, rok: 2028, miesiac: 2, przepracowane: 180, dobowe: 4, nieobecnosc: 8 })).toMatchObject({
      od: '2028-02-01',
      do: '2028-02-29',
      dni: 29,
      wymiarPelny: 168,
      wymiarPoObnizeniu: 160,
      sredniotygodniowe: 16,
      sredniaKp: 43.45,
      sredniaBezNieobecnosci: 45.65,
    });
  });

  it('12 miesięcy 2027 i okres przez koniec roku (listopad 2026 – styczeń 2027)', () => {
    expect(nadgodzinyOkresu({ ...PELNY, rok: 2027, miesiac: 1, miesiecy: 12, przepracowane: 2100, dobowe: 50, nieobecnosc: 80, stawka: 30 })).toMatchObject({
      dni: 365,
      wymiarPelny: 2008,
      wymiarPoObnizeniu: 1928,
      sredniotygodniowe: 122,
      dodatek: 3660,
      sredniaKp: 40.27,
      sredniaBezNieobecnosci: 41.88,
      doLimitu: 306.86,
    });
    expect(nadgodzinyOkresu({ ...PELNY, miesiecy: 3, przepracowane: 500, dobowe: 0 })).toMatchObject({ do: '2027-01-31', dni: 92, wymiarPelny: 472, sredniotygodniowe: 28 });
  });

  it('niepełny etat: 1/2 w listopadzie 2026 (80 h ponadwymiarowych, 10 h nadgodzin) i 7/8 z L4 16 h', () => {
    expect(nadgodzinyOkresu({ ...PELNY, etat: ulamekEtatu('1/2'), przepracowane: 170, dobowe: 0 })).toMatchObject({
      wymiarEtatu: 80,
      wymiarPoObnizeniu: 80,
      progNadgodzin: 160,
      ponadwymiarowe: 80,
      sredniotygodniowe: 10,
      dodatek: 400,
    });
    expect(nadgodzinyOkresu({ ...PELNY, etat: ulamekEtatu('7/8'), przepracowane: 150, dobowe: 2, nieobecnosc: 16 })).toMatchObject({
      wymiarEtatu: 140,
      wymiarPoObnizeniu: 124,
      progNadgodzin: 144,
      ponadwymiarowe: 20,
      sredniotygodniowe: 4,
      sredniaBezNieobecnosci: 39.18,
      doLimitu: 33.77,
    });
  });

  it('luty 2026 cały na L4 (160 h = 4 tygodnie): średniej bez nieobecności nie ma', () => {
    expect(nadgodzinyOkresu({ ...PELNY, miesiac: 2, przepracowane: 0, dobowe: 0, nieobecnosc: 160 })).toMatchObject({ sredniaBezNieobecnosci: null, limitDochowany: true, doLimitu: 0 });
  });

  it('listopad 2026 cały na urlopie (160 h, święto 11.11): średniej bez nieobecności nie ma, 0 h do limitu', () => {
    expect(nadgodzinyOkresu({ ...PELNY, przepracowane: 0, dobowe: 0, nieobecnosc: 160 })).toMatchObject({ sredniaBezNieobecnosci: null, limitDochowany: true, doLimitu: 0 });
  });

  it('grudzień 2026 (Wigilia i dwa dni świąt): 140 h, brakuje 20 h do wymiaru', () => {
    expect(nadgodzinyOkresu({ ...PELNY, miesiac: 12, przepracowane: 140, dobowe: 0 })).toMatchObject({ wymiarPelny: 160, sredniotygodniowe: 0, brakuje: 20, dodatek: 0 });
  });

  it('odmiana godzin', () => {
    expect(godzinySlownie(1)).toBe('1 godzina');
    expect(godzinySlownie(22)).toBe('22 godziny');
    expect(godzinySlownie(12)).toBe('12 godzin');
    expect(godzinySlownie(14.5)).toBe('14,5 godziny');
  });

  it('błędne dane: RangeError', () => {
    expect(() => nadgodzinyOkresu({ ...PELNY, dobowe: 200 })).toThrow(RangeError);
    expect(() => nadgodzinyOkresu({ ...PELNY, przepracowane: 721 })).toThrow(RangeError);
    expect(() => nadgodzinyOkresu({ ...PELNY, przepracowane: 720, dobowe: 0 })).not.toThrow();
    expect(() => nadgodzinyOkresu({ ...PELNY, nieobecnosc: 161 })).toThrow(RangeError);
    expect(() => nadgodzinyOkresu({ ...PELNY, etat: 0.5, nieobecnosc: 81 })).toThrow(RangeError);
    expect(() => nadgodzinyOkresu({ ...PELNY, przepracowane: -1 })).toThrow(RangeError);
    expect(() => nadgodzinyOkresu({ ...PELNY, przepracowane: Number.NaN })).toThrow(RangeError);
    expect(() => nadgodzinyOkresu({ ...PELNY, miesiecy: 5 })).toThrow(RangeError);
    expect(() => nadgodzinyOkresu({ ...PELNY, miesiac: 13 })).toThrow(RangeError);
    expect(() => ulamekEtatu('3/2')).toThrow(RangeError);
  });
});

describe('teksty wyniku', () => {
  it('przykład startowy i luty 2026 (4 tygodnie)', () => {
    const t = tekstyWyniku(nadgodzinyOkresu(PELNY), 1, 0);
    expect(t.glowna).toBe('14 godzin');
    expect(t.opis).toMatch(/^nadgodzin średniotygodniowych w okresie 1–30\slistopada\s2026\sr\.$/);
    expect(t.srednia).toMatch(/^42,93\sh \(30 dni to 4,29 tygodnia\)$/);
    expect(t.dodatek).toMatch(/^560,00\szł$/);
    expect(t.stan).toBe('ok');
    expect(tekstyWyniku(nadgodzinyOkresu({ ...PELNY, miesiac: 2, przepracowane: 200, dobowe: 0 }), 1, 0)).toMatchObject({ srednia: expect.stringContaining('28 dni to 4 tygodnie'), limit: 'przekroczony', stan: 'blad' });
    expect(tekstyWyniku(nadgodzinyOkresu({ ...PELNY, miesiac: 12, przepracowane: 140, dobowe: 0 }), 1, 0).opis).toMatch(/^brakuje 20\sh do wymiaru/);
  });
});
