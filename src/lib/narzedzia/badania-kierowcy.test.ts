// Oczekiwane daty sprawdzone niezależnie w Pythonie (skrypt badania-kierowcy.py w scratchpadzie: dodawanie miesięcy
// z przycięciem do ostatniego dnia miesiąca, KC art. 112) i zgodne z przykładami A–F z badania prawnego.
import { describe, expect, it } from 'vitest';
import { oplataPsychotestu, status, terminKierowcy, widelkiKP, widok, wydarzenia, OPLATA_PSYCH, OPLATA_PSYCH_DAWNA } from './badania-kierowcy';

describe('terminKierowcy (art. 39j ust. 4, 39k ust. 3 UTD)', () => {
  it.each([
    // nazwa, urodzenie, badanie, dzien60, po60, ustawowy (= wiążący termin), ostroznie (nasza interpretacja), [termin z Pythona]
    ['A: 45 lat, co 5 lat', '1981-05-10', '2026-11-12', '2041-05-10', false, '2031-11-12', null, '2031-11-12'],
    ['B: 5 lat przekracza 60. urodziny', '1968-03-15', '2026-01-20', '2028-03-15', false, '2031-01-20', '2028-07-20', '2028-07-20'],
    ['C: badanie w dniu 60. urodzin = po 60 (KC 112 zd. 2)', '1966-07-01', '2026-07-01', '2026-07-01', true, '2029-01-01', null, '2029-01-01'],
    ['D: dzień przed 60. urodzinami', '1966-07-01', '2026-06-30', '2026-07-01', false, '2031-06-30', '2028-12-30', '2028-12-30'],
    ['E: po 60, 31.08 + 30 mies. = 28.02', '1964-04-02', '2024-08-31', '2024-04-02', true, '2027-02-28', null, '2027-02-28'],
    ['F: 29.02 + 5 lat = 28.02', '1972-02-29', '2024-02-29', '2032-02-29', false, '2029-02-28', null, '2029-02-28'],
    ['G: urodzony 29.02, 60 lat w roku 2100 (zwykły)', '2040-02-29', '2098-01-15', '2100-02-28', false, '2103-01-15', '2100-07-15', '2100-07-15'],
    ['H: koniec roku', '1990-12-31', '2025-12-31', '2050-12-31', false, '2030-12-31', null, '2030-12-31'],
    ['K: po 60, 31.08 + 30 mies. w roku przestępnym', '1960-01-01', '2025-08-31', '2020-01-01', true, '2028-02-29', null, '2028-02-29'],
    ['L: badanie 29.02, przed 60', '1968-03-01', '2028-02-29', '2028-03-01', false, '2033-02-28', '2030-08-29', '2030-08-29'],
  ] as const)('%s', (_, urodzenie, badanie, dzien60, po60, ustawowy, ostroznie, termin) => {
    const r = terminKierowcy({ urodzenie, badanie });
    expect(r).toMatchObject({ dzien60, po60, ustawowy, ostroznie, termin: ustawowy, zrodlo: 'ustawa' });
    // Ostatnia kolumna to najwcześniejsza data z Pythona: równa ostrożnej, gdy ta istnieje.
    expect(ostroznie ?? ustawowy).toBe(termin);
  });

  it('wcześniejszy termin z orzeczenia ma pierwszeństwo', () => {
    const r = terminKierowcy({ urodzenie: '1981-05-10', badanie: '2026-11-12', zOrzeczenia: '2029-11-12' });
    expect(r.termin).toBe('2029-11-12');
    expect(r.zrodlo).toBe('orzeczenie');
  });
  it('wariant ostrożny nie zmienia wiążącego terminu; orzeczenie równe ustawowemu', () => {
    const r = terminKierowcy({ urodzenie: '1968-03-15', badanie: '2026-01-20', zOrzeczenia: '2031-01-20' });
    expect(r).toMatchObject({ termin: '2031-01-20', zrodlo: 'orzeczenie', ostroznie: '2028-07-20' });
  });
  it('późniejszy termin z orzeczenia: wiąże wcześniejszy ustawowy', () => {
    const r = terminKierowcy({ urodzenie: '1981-05-10', badanie: '2026-11-12', zOrzeczenia: '2032-01-01' });
    expect(r).toMatchObject({ termin: '2031-11-12', zrodlo: 'ustawa' });
  });
  it('błędne dane: RangeError', () => {
    expect(() => terminKierowcy({ urodzenie: '1981-02-30', badanie: '2026-11-12' })).toThrow(RangeError);
    expect(() => terminKierowcy({ urodzenie: '1981-05-10', badanie: '1980-01-01' })).toThrow(RangeError);
    expect(() => terminKierowcy({ urodzenie: '1981-05-10', badanie: '2026-11-12', zOrzeczenia: '2026-11-12' })).toThrow(RangeError);
    expect(() => terminKierowcy({ urodzenie: '1981-05-10', badanie: '' })).toThrow(RangeError);
  });
});

describe('widelkiKP (zał. 1 cz. V rozporządzenia o badaniach profilaktycznych)', () => {
  it('auto służbowe: 30 miesięcy – 5 lat, 31.08 → 28.02', () => {
    expect(widelkiKP({ rola: 'auto-sluzbowe', badanie: '2024-08-31' })).toMatchObject({ od: '2027-02-28', do: '2029-08-31' });
  });
  it('wózek: 50 lat w dniu badania → 2–3 lata', () => {
    expect(widelkiKP({ rola: 'wozek', badanie: '2025-03-10', urodzenie: '1975-03-10' })).toMatchObject({ po50: true, od: '2027-03-10', do: '2028-03-10' });
  });
  it('wózek: dzień przed 50. urodzinami → 3–4 lata', () => {
    expect(widelkiKP({ rola: 'wozek', badanie: '2025-03-09', urodzenie: '1975-03-10' })).toMatchObject({ po50: false, od: '2028-03-09', do: '2029-03-09' });
  });
  it('wózek bez daty urodzenia albo błędna data: RangeError', () => {
    expect(() => widelkiKP({ rola: 'wozek', badanie: '2025-03-09' })).toThrow(RangeError);
    expect(() => widelkiKP({ rola: 'auto-sluzbowe', badanie: '2025-13-01' })).toThrow(RangeError);
  });
});

describe('status', () => {
  it.each([
    ['2026-11-11', 'po-terminie', -1],
    ['2026-11-12', 'pilne', 0],
    ['2026-12-12', 'pilne', 30],
    ['2026-12-13', 'wkrotce', 31],
    ['2027-02-10', 'wkrotce', 90],
    ['2027-02-11', 'w-terminie', 91],
  ] as const)('%s → %s', (termin, s, dni) => {
    expect(status(termin, '2026-11-12')).toEqual({ status: s, dni });
  });
});

describe('oplataPsychotestu (§ 13 rozp., zmiana Dz.U. 2026 poz. 1434)', () => {
  it('granica 13/14 listopada 2026 r.', () => {
    expect(oplataPsychotestu('2026-11-13')).toBe(OPLATA_PSYCH_DAWNA);
    expect(oplataPsychotestu('2026-11-14')).toBe(OPLATA_PSYCH);
    expect(OPLATA_PSYCH_DAWNA).toBe(150);
    expect(OPLATA_PSYCH).toBe(200);
  });
  it('rozpoczęte przed 14.11, orzeczenie później: 150 zł (§ 2 przepis przejściowy)', () => {
    expect(oplataPsychotestu('2026-11-12', '2026-11-16')).toBe(150);
    expect(oplataPsychotestu('2026-11-14', '2026-11-14')).toBe(200);
  });
  it('błędne dane: RangeError', () => {
    expect(() => oplataPsychotestu('2026-11-31')).toThrow(RangeError);
    expect(() => oplataPsychotestu('2026-11-16', '2026-11-12')).toThrow(RangeError);
  });
});

describe('wydarzenia (.ics)', () => {
  it('30 dni przed i w dniu terminu, posortowane, bez minionych', () => {
    const w = wydarzenia(
      [
        { rodzaj: 'lekarskie', termin: '2031-11-12' },
        { rodzaj: 'psychologiczne', termin: '2026-11-20' },
      ],
      '2026-11-12',
    );
    expect(w.map((x) => x.data)).toEqual(['2026-11-20', '2031-10-13', '2031-11-12']);
    expect(w[0].tytul).toContain('psychologiczne');
  });
});

describe('widok', () => {
  it('kierowca: daty, statusy, opłata przed i po 14.11.2026', () => {
    const we = { rola: 'kierowca', urodzenie: '1968-03-15', lek: '2026-01-20', psy: '2024-02-29' } as const;
    const v = widok(we, '2026-11-12');
    expect(v.lek).toBe('20 stycznia 2031 r.');
    expect(v.lekOstroznie).toContain('Bezpieczniej wcześniej: 20 lipca 2028 r.');
    expect(v.lekOstroznie).toContain('przepis tego nie wymaga');
    expect(v.psy).toBe('28 lutego 2029 r.'); // Python: 2024-02-29 + 5 lat = 2029-02-28
    expect(v.psyOstroznie).toContain('15 marca 2028 r.'); // max(2026-08-29, 2028-03-15)
    expect(v.statusLek?.status).toBe('w-terminie');
    expect(v.oplataPsy).toMatch(/^150 zł .* 200 zł od 14 listopada 2026 r\./);
    expect(widok(we, '2026-11-14').oplataPsy).toMatch(/^200 zł/);
    expect(v.wydarzenia).toHaveLength(6);
    expect(v.wydarzenia.filter((w) => w.tytul.startsWith('Bezpieczniej')).map((w) => w.data)).toEqual(['2028-03-15', '2028-07-20']);
  });
  it('kierowca: zaległe badanie ze statusu daty wiążącej, nie ostrożnej; osobne podstawy dla lekarskiego i psychotestów', () => {
    // 60. urodziny 2028-03-15; dziś 2029-01-01: ostrożny termin minął, ustawowy (2031-01-20) nie
    const v = widok({ rola: 'kierowca', urodzenie: '1968-03-15', lek: '2026-01-20', psy: '2026-01-20' }, '2029-01-01');
    expect(v.statusLek?.status).toBe('w-terminie');
    expect(v.uwaga).toBeNull();
    const z = widok({ rola: 'kierowca', urodzenie: '1981-05-10', lek: '2026-01-10', psy: '2020-01-10' }, '2026-11-12');
    expect(z.statusPsy?.status).toBe('po-terminie');
    expect(z.uwaga).toContain('art. 39a ust. 1 pkt 4');
    expect(z.uwaga).not.toContain('229');
  });
  it('orzeczenie równe ustawowemu: bez słowa „wcześniejszy”', () => {
    const v = widok({ rola: 'kierowca', urodzenie: '1981-05-10', lek: '2026-11-12', lekTermin: '2031-11-12', psy: '2026-11-12' }, '2026-11-12');
    expect(v.lekOpis).toContain('taki sam jak z ustawy');
    expect(v.lekOpis).not.toContain('wcześniejszy');
  });
  it('wózek: widełki bez orzeczenia, po górnej granicy zaległe', () => {
    const v = widok({ rola: 'wozek', urodzenie: '1980-01-01', lek: '2020-01-10', psy: '' }, '2026-11-12');
    expect(v.lek).toBe('między 10 stycznia 2023 r. a 10 stycznia 2024 r.'); // Python: +36 i +48 miesięcy
    expect(v.statusLek?.status).toBe('po-terminie');
    expect(v.uwaga).toContain('art. 229 § 4');
    expect(v.wydarzenia).toEqual([]);
  });
  it('auto służbowe: termin z orzeczenia wiąże', () => {
    const v = widok({ rola: 'auto-sluzbowe', urodzenie: '', lek: '2024-08-31', lekTermin: '2027-08-31', psy: '' }, '2026-11-12');
    expect(v.lek).toBe('31 sierpnia 2027 r.');
    expect(v.wydarzenia.map((w) => w.data)).toEqual(['2027-08-01', '2027-08-31']);
  });
});
