import { describe, expect, it } from 'vitest';
import { czas, dataZ, godzinaZ, odpracowanie, type DaneOdpracowania, type Wiersz } from './odpracowanie';

// Oczekiwane wartości sprawdzone niezależnie w Pythonie (datetime: zmiany z rozkładu, przerwy w oknach doby i tygodnia).
const dane = (odp: Wiersz[], zmiany: Partial<DaneOdpracowania> = {}): DaneOdpracowania => ({
  start: '7:00',
  koniec: '15:00',
  okres: 1,
  wyjscie: { data: '2026-11-18', od: '10:00', do: '13:00' },
  odpracowanie: odp,
  ...zmiany,
});
const kontrola = (w: ReturnType<typeof odpracowanie>, id: string) => w.kontrole.find((k) => k.id === id);
const doby = (w: ReturnType<typeof odpracowanie>) => w.doby.map((d) => [`${dataZ(d.od)} ${godzinaZ(d.od)}`, d.najdluzsza]);

describe('odpracowanie wyjścia prywatnego', () => {
  it('przykład startowy: 3 h wyjścia, odpracowanie 19.11 15:00–18:00, wszystko w porządku', () => {
    const w = odpracowanie(dane([{ data: '2026-11-19', od: '15:00', do: '18:00' }]));
    expect([w.wyjscie, w.odpracowane, w.roznica, w.zostalo, w.nadwyzka]).toEqual([180, 180, 0, 0, 0]);
    expect(doby(w)).toEqual([
      ['2026-11-18 7:00', 960],
      ['2026-11-19 7:00', 780],
    ]);
    expect(w.tygodnie).toEqual([{ od: '2026-11-15', najdluzsza: 1980, rozklad: 1980 }]);
    expect(w.kontrole.map((k) => [k.id, k.stan])).toEqual([
      ['bilans', 'ok'],
      ['odpoczynek-dobowy', 'ok'],
      ['odpoczynek-tygodniowy', 'ok'],
    ]);
    expect(kontrola(w, 'bilans')?.tytul).toBe('Odpracowane w całości: 3 h');
    expect(kontrola(w, 'odpoczynek-dobowy')?.szczegoly).toEqual([
      'Doba od 18 listopada 2026 r., 7:00: najdłuższa przerwa 16 h.',
      'Doba od 19 listopada 2026 r., 7:00: najdłuższa przerwa 13 h.',
    ]);
    expect(kontrola(w, 'odpoczynek-tygodniowy')?.szczegoly).toEqual(['Tydzień od 15 listopada 2026 r.: najdłuższa przerwa 33 h.']);
  });

  it('dwa wiersze 19.11 i 20.11: tydzień od niedzieli dzieli weekend, uwaga', () => {
    const w = odpracowanie(dane([
      { data: '2026-11-19', od: '15:00', do: '17:00' },
      { data: '2026-11-20', od: '15:00', do: '16:00' },
    ]));
    expect([w.wyjscie, w.odpracowane, w.roznica, w.zostalo, w.nadwyzka]).toEqual([180, 180, 0, 0, 0]);
    expect(doby(w)).toEqual([
      ['2026-11-18 7:00', 960],
      ['2026-11-19 7:00', 840],
      ['2026-11-20 7:00', 900],
    ]);
    expect(kontrola(w, 'bilans')?.stan).toBe('ok');
    expect(kontrola(w, 'odpoczynek-dobowy')?.stan).toBe('ok');
    // Okres od niedzieli 1 listopada: tydzień 15–21 listopada dzieli weekend; rozkład daje w nim 33 h, odpracowanie 32 h.
    expect(w.tygodnie).toEqual([{ od: '2026-11-15', najdluzsza: 1920, rozklad: 1980 }]);
    expect(kontrola(w, 'odpoczynek-tygodniowy')?.stan).toBe('uwaga');
    expect(w.kontrole.map((k) => k.id)).toEqual(['bilans', 'odpoczynek-dobowy', 'odpoczynek-tygodniowy']);
  });

  it('odpracowanie 15:00–21:00: przerwa 10 h w dobie, 3 h nadgodzin', () => {
    const w = odpracowanie(dane([{ data: '2026-11-19', od: '15:00', do: '21:00' }]));
    expect([w.wyjscie, w.odpracowane, w.roznica, w.nadwyzka]).toEqual([180, 360, 180, 180]);
    expect(doby(w)).toEqual([
      ['2026-11-18 7:00', 960],
      ['2026-11-19 7:00', 600],
    ]);
    expect(kontrola(w, 'odpoczynek-dobowy')?.stan).toBe('blad');
    expect(kontrola(w, 'odpoczynek-dobowy')?.szczegoly).toEqual(['Doba od 19 listopada 2026 r., 7:00: najdłuższa przerwa 10 h.']);
    expect(kontrola(w, 'bilans')).toMatchObject({ stan: 'uwaga', tytul: '3 h ponad czas wyjścia' });
    expect(kontrola(w, 'bilans')?.opis).toMatch(/nadgodzinami/);
    // Odpracowanie nie dotyka przerwy weekendowej: tyle samo co w rozkładzie.
    expect(w.tygodnie).toEqual([{ od: '2026-11-15', najdluzsza: 1980, rozklad: 1980 }]);
    expect(kontrola(w, 'odpoczynek-tygodniowy')?.stan).toBe('ok');
  });

  it('granica 11 h: do 20:00 w porządku, do 20:01 naruszenie', () => {
    const rowno = odpracowanie(dane([{ data: '2026-11-19', od: '15:00', do: '20:00' }]));
    expect(rowno.doby[1].najdluzsza).toBe(660);
    expect(kontrola(rowno, 'odpoczynek-dobowy')?.stan).toBe('ok');
    const minuta = odpracowanie(dane([{ data: '2026-11-19', od: '15:00', do: '20:01' }]));
    expect([minuta.doby[1].najdluzsza, minuta.nadwyzka]).toEqual([659, 121]);
    expect(kontrola(minuta, 'odpoczynek-dobowy')?.stan).toBe('blad');
  });

  it('granica 35 h w tygodniu od poniedziałku: sobota 10:00–13:00 tak, do 13:01 naruszenie', () => {
    const w = (doGodz: string) =>
      odpracowanie(dane([{ data: '2026-06-13', od: '10:00', do: doGodz }], { wyjscie: { data: '2026-06-10', od: '10:00', do: '13:00' } }));
    const rowno = w('13:00');
    expect(rowno.tygodnie).toEqual([{ od: '2026-06-08', najdluzsza: 2100, rozklad: 3420 }]);
    expect(kontrola(rowno, 'odpoczynek-tygodniowy')?.stan).toBe('ok');
    expect(doby(rowno)).toEqual([
      ['2026-06-10 7:00', 960],
      ['2026-06-13 10:00', 1260],
    ]);
    const minuta = w('13:01');
    expect(minuta.tygodnie[0].najdluzsza).toBe(2099);
    expect(kontrola(minuta, 'odpoczynek-tygodniowy')?.stan).toBe('blad');
  });

  it('sobota 8:00–11:00: dzień wolny z rozkładu, doba od początku odpracowania', () => {
    const w = odpracowanie(dane([{ data: '2026-11-21', od: '8:00', do: '11:00' }]));
    expect(w.roznica).toBe(0);
    expect(doby(w)).toEqual([
      ['2026-11-18 7:00', 960],
      ['2026-11-21 8:00', 1260],
    ]);
    expect(w.doby[1].wolny).toBe(true);
    expect(w.tygodnie).toEqual([{ od: '2026-11-15', najdluzsza: 1860, rozklad: 1980 }]);
    expect(kontrola(w, 'dzien-wolny')?.stan).toBe('uwaga');
    expect(kontrola(w, 'niedziela-swieto')).toBeUndefined();
  });

  it('niedziela przed wyjściem: uwaga art. 151^10 i uwaga o terminie', () => {
    const w = odpracowanie(dane([{ data: '2026-11-15', od: '8:00', do: '11:00' }]));
    expect(doby(w)).toEqual([
      ['2026-11-15 8:00', 1200],
      ['2026-11-18 7:00', 960],
    ]);
    expect(w.tygodnie).toEqual([{ od: '2026-11-15', najdluzsza: 1980, rozklad: 1980 }]);
    expect(kontrola(w, 'niedziela-swieto')?.podstawa).toBe('art. 151^10 i art. 151^11 § 1 Kodeksu pracy');
    expect(kontrola(w, 'przed-wyjsciem')?.stan).toBe('uwaga');
    expect(kontrola(w, 'dzien-wolny')).toBeUndefined();
  });

  it('godziny przed wyjściem nie wchodzą do bilansu (zwolnienie „udzielone”, art. 151 § 2^1)', () => {
    const w = odpracowanie(dane([
      { data: '2026-11-16', od: '15:00', do: '17:00' },
      { data: '2026-11-19', od: '15:00', do: '16:00' },
    ]));
    expect([w.wyjscie, w.odpracowane, w.roznica, w.zostalo]).toEqual([180, 60, -120, 120]);
    expect(kontrola(w, 'bilans')?.stan).toBe('uwaga');
    expect(kontrola(w, 'przed-wyjsciem')?.opis).toMatch(/nie liczymy/);
  });

  it('wolna sobota: jedna liczba w tytule i uwaga o art. 151^3', () => {
    const k = kontrola(odpracowanie(dane([{ data: '2026-11-21', od: '8:00', do: '11:00' }])), 'dzien-wolny');
    expect(k?.tytul).toBe('Odpracowanie w dzień wolny z rozkładu: 1 dzień');
    expect(k?.szczegoly).toEqual(['Odpracowanie 1: 21 listopada 2026 r.']);
    expect(k?.opis).toMatch(/151\^3/);
  });

  it('zmiana nocna 22:00–6:00, wyjście 2:00–4:00 i odpracowanie 6:00–8:00 po zmianie', () => {
    const w = odpracowanie(
      dane([{ data: '2026-11-19', od: '6:00', do: '8:00' }], { start: '22:00', koniec: '6:00', wyjscie: { data: '2026-11-18', od: '2:00', do: '4:00' } }),
    );
    expect([w.wyjscie, w.odpracowane, w.roznica]).toEqual([120, 120, 0]);
    expect(doby(w)).toEqual([['2026-11-18 22:00', 840]]);
    expect(w.tygodnie).toEqual([{ od: '2026-11-15', najdluzsza: 2760, rozklad: 2760 }]);
    expect(w.kontrole.every((k) => k.stan === 'ok')).toBe(true);
  });

  it('29 lutego 2028 i okres 3 miesiące: ten sam okres; przy 1 miesiącu uwaga o okresie', () => {
    const d = (okres: number) =>
      dane([{ data: '2028-03-01', od: '15:00', do: '17:00' }], { okres, wyjscie: { data: '2028-02-29', od: '10:00', do: '12:00' } });
    const trzy = odpracowanie(d(3));
    expect(doby(trzy)).toEqual([
      ['2028-02-29 7:00', 960],
      ['2028-03-01 7:00', 840],
    ]);
    expect(trzy.tygodnie).toEqual([{ od: '2028-02-26', najdluzsza: 3300, rozklad: 3300 }]);
    expect(kontrola(trzy, 'okres')).toBeUndefined();
    expect(kontrola(odpracowanie(d(1)), 'okres')?.stan).toBe('uwaga');
  });

  it('koniec roku: odpracowanie w Nowy Rok i 4 stycznia, inny okres rozliczeniowy', () => {
    const w = odpracowanie(
      dane(
        [
          { data: '2027-01-01', od: '8:00', do: '10:00' },
          { data: '2027-01-04', od: '15:00', do: '16:00' },
        ],
        { okres: 12, wyjscie: { data: '2026-12-30', od: '12:00', do: '15:00' } },
      ),
    );
    expect(w.roznica).toBe(0);
    expect(doby(w)).toEqual([
      ['2026-12-30 7:00', 1140],
      ['2027-01-01 8:00', 1320],
      ['2027-01-04 7:00', 900],
    ]);
    expect(w.tygodnie).toEqual([{ od: '2027-01-01', najdluzsza: 4140, rozklad: 4740 }]);
    expect(kontrola(w, 'niedziela-swieto')?.szczegoly).toEqual(['Odpracowanie 1: 1 stycznia 2027 r., Nowy Rok.']);
    expect(kontrola(w, 'okres')?.szczegoly).toHaveLength(2);
  });

  it('niedobór: zostało 1 h 30 min do odpracowania', () => {
    const w = odpracowanie(dane([{ data: '2026-11-19', od: '15:00', do: '16:30' }]));
    expect([w.zostalo, czas(w.zostalo)]).toEqual([90, '1 h 30 min']);
    expect(kontrola(w, 'bilans')?.podstawa).toBe('art. 80 Kodeksu pracy');
    const bez = odpracowanie(dane([]));
    expect([bez.zostalo, bez.tygodnie.length, kontrola(bez, 'odpoczynek-tygodniowy')?.stan]).toEqual([180, 0, 'ok']);
  });

  it('błędne dane', () => {
    const blad = (d: DaneOdpracowania) => () => odpracowanie(d);
    expect(blad(dane([{ data: '2026-11-19', od: '14:00', do: '16:00' }]))).toThrow(/nachodzi na godziny pracy/);
    expect(blad(dane([{ data: '2026-11-19', od: '15:00', do: '17:00' }, { data: '2026-11-19', od: '16:00', do: '18:00' }]))).toThrow(/nachodzą na siebie/);
    expect(blad(dane([], { wyjscie: { data: '2026-11-21', od: '10:00', do: '13:00' } }))).toThrow(/wolny/);
    expect(blad(dane([], { wyjscie: { data: '2026-11-11', od: '10:00', do: '13:00' } }))).toThrow(/wolny/);
    expect(blad(dane([], { wyjscie: { data: '2026-12-24', od: '10:00', do: '13:00' } }))).toThrow(/wolny/);
    expect(blad(dane([], { wyjscie: { data: '2026-11-18', od: '6:00', do: '8:00' } }))).toThrow(/godzinach pracy/);
    expect(blad(dane([], { wyjscie: { data: '2026-11-18', od: '14:00', do: '16:00' } }))).toThrow(/godzinach pracy/);
    expect(blad(dane([{ data: '2026-11-19', od: '25:00', do: '17:00' }]))).toThrow(RangeError);
    expect(blad(dane([{ data: '2026-11-19', od: '16:00', do: '16:00' }]))).toThrow(/taki sam/);
    expect(blad(dane([], { koniec: '20:00' }))).toThrow(/12 godzin/);
    expect(blad(dane([], { okres: 5 }))).toThrow(RangeError);
    expect(blad(dane([{ data: '2026-02-30', od: '15:00', do: '16:00' }]))).toThrow(/datę/);
  });

  it('wyjście na całą zmianę nocną i format czasu', () => {
    const w = odpracowanie(dane([], { start: '22:00', koniec: '6:00', wyjscie: { data: '2026-11-18', od: '22:00', do: '6:00' } }));
    expect(w.wyjscie).toBe(480);
    expect([czas(0), czas(45), czas(180), czas(659)]).toEqual(['0 min', '45 min', '3 h', '10 h 59 min']);
  });

  it('teksty kontroli bez zdublowanych liczb i kropek', () => {
    const przypadki = [
      dane([{ data: '2026-11-19', od: '15:00', do: '18:00' }]),
      dane([{ data: '2026-11-19', od: '15:00', do: '21:00' }]),
      dane([{ data: '2026-11-21', od: '8:00', do: '11:00' }, { data: '2026-11-28', od: '8:00', do: '9:00' }]),
      dane([{ data: '2026-11-15', od: '8:00', do: '11:00' }]),
      dane([{ data: '2026-12-01', od: '15:00', do: '16:00', nr: 3 }]),
      dane([{ data: '2027-01-01', od: '8:00', do: '10:00' }], { okres: 12, wyjscie: { data: '2026-12-30', od: '12:00', do: '14:00' } }),
    ];
    for (const d of przypadki)
      for (const k of odpracowanie(d).kontrole)
        for (const t of [k.tytul, k.opis, ...k.szczegoly]) {
          expect(t).not.toMatch(/\d \d+ (dz|dni|godz|h\b|min)/);
          expect(t).not.toMatch(/\.\./);
          expect(t).not.toMatch(/undefined|NaN/);
        }
    const dwie = kontrola(odpracowanie(przypadki[2]), 'dzien-wolny');
    expect(dwie?.tytul).toBe('Odpracowanie w dzień wolny z rozkładu: 2 dni');
    expect(kontrola(odpracowanie(przypadki[4]), 'okres')?.szczegoly).toEqual(['Odpracowanie 3: 1 grudnia 2026 r.']);
  });
});
