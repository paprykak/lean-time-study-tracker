import { describe, expect, it } from 'vitest';
import { koniecPrzedawnienia, opis, zaleglyUrlop } from './zalegly-urlop';

// Daty i liczby dni sprawdzone niezależnie w Pythonie (datetime, calendar): skrypt zalegly-urlop.py.
const NA = '2026-11-12';

describe('zaległy urlop (art. 168, 291 § 1, 293¹ Kp; art. 112 KC)', () => {
  it('urlop za 2025: termin 30.09.2026 minął 43 dni temu; przedawnienie najwcześniej 31.12.2028, później 30.09.2029', () => {
    const [r] = zaleglyUrlop({ urlopy: [{ rok: 2025, dni: 6 }], naDzien: NA }).lata;
    expect(r.udzielenie).toEqual({ data: '2026-09-30', zostalo: -43, status: 'po-terminie' });
    expect(r.przedawnienie).toEqual({ data: '2028-12-31', zostalo: 780, status: 'w-terminie' });
    expect(r.przedawnieniePozniej.data).toBe('2029-09-30');
    expect(r.biezacy).toBe(false);
    expect(r.zawieszenie).toBe(0);
  });

  it('rok bieżący 2026: termin 30.09.2027 (322 dni), przedawnienie 31.12.2029 (1145 dni)', () => {
    const [r] = zaleglyUrlop({ urlopy: [{ rok: 2026, dni: 26 }], naDzien: NA }).lata;
    expect(r.biezacy).toBe(true);
    expect(r.udzielenie).toMatchObject({ data: '2027-09-30', zostalo: 322 });
    expect(r.przedawnienie).toMatchObject({ data: '2029-12-31', zostalo: 1145 });
  });

  it('rok przestępny: urlop za 2027 → termin 30.09.2028, przedawnienie 31.12.2030 i 30.09.2031', () => {
    const [r] = zaleglyUrlop({ urlopy: [{ rok: 2027, dni: 2 }], naDzien: '2028-02-29' }).lata;
    expect(r.udzielenie.data).toBe('2028-09-30');
    expect(r.przedawnienie.data).toBe('2030-12-31');
    expect(r.przedawnieniePozniej.data).toBe('2031-09-30');
  });

  it('kilka lat: sortuje od najstarszego i sumuje dni; 2024 przedawnia się najwcześniej 31.12.2027 (414 dni)', () => {
    const w = zaleglyUrlop({ urlopy: [{ rok: 2025, dni: 6 }, { rok: 2024, dni: 2 }], naDzien: NA });
    expect(w.lata.map((r) => r.rok)).toEqual([2024, 2025]);
    expect(w.razem).toBe(8);
    expect(w.lata[0].przedawnienie).toMatchObject({ data: '2027-12-31', zostalo: 414 });
    expect(w.lata[0].przedawnieniePozniej.data).toBe('2028-09-30');
    expect(w.ekwiwalent).toBeNull();
  });

  it('progi statusu: 30 dni pilne, 31 i 90 dni wkrótce, 91 w terminie, dzień terminu pilny', () => {
    const s = (naDzien: string) => zaleglyUrlop({ urlopy: [{ rok: 2025, dni: 1 }], naDzien }).lata[0].udzielenie.status;
    expect(s('2026-08-31')).toBe('pilne');
    expect(s('2026-08-30')).toBe('wkrotce');
    expect(s('2026-07-02')).toBe('wkrotce');
    expect(s('2026-07-01')).toBe('w-terminie');
    expect(s('2026-09-30')).toBe('pilne');
    expect(s('2026-10-01')).toBe('po-terminie');
  });

  it('urlop wychowawczy (art. 293¹) zawiesza bieg', () => {
    // 1.03–31.08.2026 = 184 dni po wymagalności 31.12.2025: koniec 3.07.2029; wariant od 30.09.2026 bez zmian.
    const [r] = zaleglyUrlop({ urlopy: [{ rok: 2025, dni: 6 }], naDzien: NA, wychowawczy: { od: '2026-03-01', do: '2026-08-31' } }).lata;
    expect(r.przedawnienie.data).toBe('2029-07-03');
    expect(r.zawieszenie).toBe(184);
    expect(r.przedawnieniePozniej.data).toBe('2029-09-30');
    // obejmuje dzień wymagalności: liczy się 151 dni od 1.01 do 31.05.2026
    expect(koniecPrzedawnienia('2025-12-31', { od: '2025-06-01', do: '2026-05-31' })).toEqual({ koniec: '2029-05-31', zawieszenie: 151 });
    // po upływie terminu: bez wpływu
    expect(koniecPrzedawnienia('2025-12-31', { od: '2029-01-01', do: '2029-06-30' })).toEqual({ koniec: '2028-12-31', zawieszenie: 0 });
    // na przełomie końca terminu: przedłużenie wciąga kolejne dni wychowawczego, razem 90
    expect(koniecPrzedawnienia('2025-12-31', { od: '2028-12-01', do: '2029-02-28' })).toEqual({ koniec: '2029-03-31', zawieszenie: 90 });
  });

  it('koniec umowy 15.03.2026: ekwiwalent za wszystkie dni, przedawnienie najwcześniej 15.03.2029 (854 dni)', () => {
    const w = zaleglyUrlop({ urlopy: [{ rok: 2025, dni: 6 }, { rok: 2026, dni: 5 }], naDzien: NA, koniecUmowy: '2026-03-15' });
    expect(w.ekwiwalent).toEqual({
      koniecUmowy: '2026-03-15',
      dni: 11,
      wyplataNajpozniej10: '2026-03-25',
      przedawnienie: { data: '2029-03-15', zostalo: 854, status: 'w-terminie' },
    });
    expect(w.lata[0].przedawnionyPrzedKoncemUmowy).toBe(false);
  });

  it('koniec umowy 29.02.2028 → przedawnienie 28.02.2031 (art. 112 KC); stary urlop oznaczony', () => {
    const w = zaleglyUrlop({ urlopy: [{ rok: 2023, dni: 3 }], naDzien: '2028-03-01', koniecUmowy: '2028-02-29' });
    expect(w.ekwiwalent?.przedawnienie.data).toBe('2031-02-28');
    // 2023: najwcześniej 31.12.2026, przed końcem umowy
    expect(w.lata[0].przedawnionyPrzedKoncemUmowy).toBe(true);
  });

  it('błędne dane: RangeError', () => {
    const z = (urlopy: { rok: number; dni: number }[], extra = {}) => () => zaleglyUrlop({ urlopy, naDzien: NA, ...extra });
    expect(z([{ rok: 2027, dni: 2 }])).toThrow(RangeError);
    expect(z([{ rok: 2025, dni: -1 }])).toThrow(RangeError);
    expect(z([{ rok: 2025, dni: 0 }])).toThrow(RangeError);
    expect(z([{ rok: 2025, dni: 2.5 }])).toThrow(RangeError);
    expect(z([{ rok: 2025, dni: 101 }])).toThrow(RangeError);
    expect(z([{ rok: 1999, dni: 2 }])).toThrow(RangeError);
    expect(z([{ rok: 2024.5, dni: 2 }])).toThrow(RangeError);
    expect(z([{ rok: 2025, dni: 2 }, { rok: 2025, dni: 1 }])).toThrow(RangeError);
    expect(z([])).toThrow(RangeError);
    expect(z([{ rok: 2026, dni: 2 }], { koniecUmowy: '2025-12-31' })).toThrow(RangeError);
    expect(z([{ rok: 2025, dni: 2 }], { wychowawczy: { od: '2026-05-01', do: '2026-04-01' } })).toThrow(RangeError);
    expect(() => zaleglyUrlop({ urlopy: [{ rok: 2025, dni: 2 }], naDzien: '2026-02-30' })).toThrow(RangeError);
  });

  it('teksty wyniku: najbliższe przedawnienie i wiersze roku', () => {
    const o = opis(zaleglyUrlop({ urlopy: [{ rok: 2025, dni: 6 }, { rok: 2024, dni: 2 }], naDzien: NA }));
    expect(o.glowny).toBe('8 dni');
    expect(o.opis).toBe('Najwcześniej może się przedawnić urlop za 2024 r.: 31 grudnia 2027 r.');
    expect(o.statusTekst).toBe('Zostało: 414 dni');
    expect(o.lata[1].tytul).toBe('Urlop za 2025 r.: 6 dni');
    expect(o.lata[1].wiersze[0]).toEqual({ dt: 'Udzielić najpóźniej', dd: '30 września 2026 r. (43 dni temu)' });
    const e = opis(zaleglyUrlop({ urlopy: [{ rok: 2025, dni: 1 }], naDzien: NA, koniecUmowy: '2026-03-15' }));
    expect(e.glowny).toBe('1 dzień');
    expect(e.statusTekst).toBe('Zostało: 854 dni');
  });
});
