import { describe, expect, it } from 'vitest';
import { grafikZWzoru, sprawdzGrafik, type KodDnia } from './grafik';

const stan = (w: ReturnType<typeof sprawdzGrafik>, id: string) => w.kontrole.find((k) => k.id === id)!;

describe('grafikZWzoru', () => {
  it('czterobrygadowy 12 h w listopadzie 2026: 16 zmian', () => {
    const g = grafikZWzoru(2026, 11, 'czterobrygadowy-12');
    expect(g).toHaveLength(30);
    expect(g.slice(0, 8)).toEqual(['D', 'D', 'N', 'N', 'W', 'W', 'W', 'W']);
    expect(g.filter((k) => k !== 'W')).toHaveLength(16);
    expect(grafikZWzoru(2026, 11, 'czterobrygadowy-12', 4)[0]).toBe('W');
  });
});

describe('sprawdzGrafik', () => {
  it('czterobrygadowy w listopadzie 2026: 192 h przy wymiarze 160 h, reszta zgodna', () => {
    const w = sprawdzGrafik(2026, 11, grafikZWzoru(2026, 11, 'czterobrygadowy-12'));
    expect([w.godziny, w.wymiar, w.zmian, w.dniWolnych]).toEqual([192, 160, 16, 14]);
    expect(stan(w, 'godziny').stan).toBe('uwaga');
    for (const id of ['doba', 'odpoczynek-dobowy', 'ta-sama-doba', 'odpoczynek-tygodniowy', 'niedziela', 'dni-wolne']) expect(stan(w, id).stan, id).toBe('ok');
  });
  it('noc, a rano następnego dnia: brak 11 h odpoczynku i ta sama doba', () => {
    const g: KodDnia[] = Array(30).fill('W');
    g[0] = 'N';
    g[1] = 'R';
    const w = sprawdzGrafik(2026, 11, g);
    expect(stan(w, 'odpoczynek-dobowy')).toMatchObject({ stan: 'blad', dni: [2] });
    expect(stan(w, 'ta-sama-doba')).toMatchObject({ stan: 'uwaga', dni: [2] });
  });
  it('praca codziennie: brak odpoczynku tygodniowego, 4 niedziele z rzędu, za mało dni wolnych', () => {
    const w = sprawdzGrafik(2026, 11, Array(30).fill('R'));
    expect(stan(w, 'odpoczynek-tygodniowy').stan).toBe('blad');
    expect(stan(w, 'niedziela')).toMatchObject({ stan: 'blad', dni: [1, 8, 15, 22] });
    expect(stan(w, 'dni-wolne').stan).toBe('blad');
  });
  it('trzyzmianowy 8 h od niedzieli 1 lutego 2026 bez wyrównania: 4 niedziele pracujące z rzędu', () => {
    expect(sprawdzGrafik(2026, 2, grafikZWzoru(2026, 2, 'trzyzmianowy-8')).kontrole.find((k) => k.id === 'niedziela')!.stan).toBe('blad');
  });
  it('trzyzmianowy 8 h wyrównany do poniedziałku: bez naruszeń; tygodnie od niedzieli dają 34 h przy zmianie zmiany (uwaga)', () => {
    const w = sprawdzGrafik(2026, 2, grafikZWzoru(2026, 2, 'trzyzmianowy-8', 6));
    expect(w.kontrole.some((k) => k.stan === 'blad')).toBe(false);
    expect(w.kontrole.find((k) => k.id === 'odpoczynek-tygodniowy')).toMatchObject({ stan: 'uwaga', dni: [15] });
    expect(stan(w, 'odpoczynek-dobowy').stan).toBe('ok');
    expect(w.godziny).toBe(160);
  });
  it('zła długość grafiku to błąd', () => {
    expect(() => sprawdzGrafik(2026, 11, Array(31).fill('W'))).toThrow(RangeError);
  });
});
